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
  <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Export and Validation</h2>

    <div class="mb-3 grid grid-cols-2 gap-2">
      <button class="rounded bg-emerald-700 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:bg-slate-600" :disabled="!!store.blockingIssues.length" @click="exportRenpy">
        Export .rpy
      </button>
      <button class="rounded bg-slate-700 px-2 py-1 text-xs text-white" @click="saveJson">Save JSON</button>
      <label class="cursor-pointer rounded bg-slate-700 px-2 py-1 text-center text-xs text-white">
        Load JSON
        <input class="hidden" type="file" accept=".json,application/json" @change="loadJson" />
      </label>
      <button class="rounded bg-rose-700 px-2 py-1 text-xs text-white" @click="store.resetProject">Reset</button>
    </div>
    <p v-if="importMessage" class="mb-2 text-xs text-slate-400">{{ importMessage }}</p>

    <div class="max-h-44 overflow-auto">
      <p v-if="!store.validationIssues.length" class="text-xs text-emerald-400">No validation issues.</p>
      <ul v-else class="space-y-1 text-xs">
        <li v-for="(issue, index) in store.validationIssues" :key="index" :class="issue.level === 'error' ? 'text-rose-400' : 'text-amber-300'">
          [{{ issue.level }}] {{ issue.message }}
        </li>
      </ul>
    </div>
  </section>
</template>
