<script setup lang="ts">
import { ref } from "vue";
import { useProjectStore } from "@/stores/projectStore";

const store = useProjectStore();
const importMessage = ref("");

function download(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportRenpy() {
  if (store.blockingIssues.length) return;
  download(store.exportRenpy(), "script.rpy", "text/plain;charset=utf-8");
}

function saveJson() {
  download(store.exportProjectJson(), "project.json", "application/json;charset=utf-8");
}

async function loadJson(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const content = await file.text();
  const result = store.importProjectJson(content);
  importMessage.value = result.message;
  input.value = "";
}
</script>

<template>
  <section class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-lg shadow-black/15 ring-1 ring-white/[0.05] backdrop-blur-sm">
    <h2 class="mb-1 text-sm font-semibold text-slate-200">Экспорт и проверка</h2>
    <p class="mb-3 text-xs text-slate-500">При ошибках графа экспорт в Ren'Py заблокирован.</p>

    <div class="mb-3 grid grid-cols-2 gap-2">
      <button
        type="button"
        class="rounded-lg bg-emerald-600 px-2 py-2 text-xs font-medium text-white shadow-md shadow-emerald-900/20 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none"
        :disabled="!!store.blockingIssues.length"
        :title="store.blockingIssues.length ? 'Исправьте ошибки в списке ниже' : ''"
        @click="exportRenpy"
      >
        Скачать .rpy
      </button>
      <button type="button" class="rounded-lg bg-slate-600 px-2 py-2 text-xs font-medium text-white hover:bg-slate-500" @click="saveJson">Сохранить JSON</button>
      <label class="cursor-pointer rounded-lg bg-slate-600 px-2 py-2 text-center text-xs font-medium text-white hover:bg-slate-500">
        Загрузить JSON
        <input class="hidden" type="file" accept=".json,application/json" @change="loadJson" />
      </label>
      <button type="button" class="rounded-lg bg-rose-600/90 px-2 py-2 text-xs font-medium text-white hover:bg-rose-500" @click="store.resetProject">Новый проект</button>
    </div>
    <p v-if="importMessage" class="mb-2 rounded-lg bg-black/30 px-2 py-1.5 text-xs text-slate-300">{{ importMessage }}</p>

    <div class="max-h-48 overflow-auto rounded-xl border border-white/[0.06] bg-black/20 p-2">
      <p v-if="!store.validationIssues.length" class="text-xs text-emerald-400/90">Замечаний нет.</p>
      <ul v-else class="space-y-1.5 text-xs leading-relaxed">
        <li v-for="(issue, index) in store.validationIssues" :key="index" :class="issue.level === 'error' ? 'text-rose-300' : 'text-amber-200/90'">
          <span class="font-mono text-[10px] text-slate-500">{{ issue.level === "error" ? "[ошибка]" : "[предупреждение]" }}</span>
          {{ issue.message }}
        </li>
      </ul>
    </div>
  </section>
</template>
