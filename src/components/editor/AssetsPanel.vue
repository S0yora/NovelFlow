<script setup lang="ts">
import { useProjectStore } from "@/stores/projectStore";

const store = useProjectStore();

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function handleFiles(kind: "background" | "sprite", event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  for (const file of files) {
    const dataUrl = await readFileAsDataUrl(file);
    store.addAsset({
      id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      kind,
      name: file.name,
      mimeType: file.type,
      dataUrl
    });
  }
  input.value = "";
}
</script>

<template>
  <section class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-lg shadow-black/15 ring-1 ring-white/[0.05] backdrop-blur-sm">
    <h2 class="mb-1 text-sm font-semibold text-slate-200">Ресурсы</h2>
    <p class="mb-3 text-xs text-slate-500">Фоны и спрайты хранятся в браузере (в проекте). Привяжите их к узлу в инспекторе.</p>

    <div class="mb-3 grid grid-cols-2 gap-2">
      <label
        class="cursor-pointer rounded-lg border border-white/[0.1] bg-black/25 px-2 py-2 text-center text-xs font-medium text-slate-200 transition hover:border-violet-400/35 hover:bg-white/[0.06]"
      >
        + Фон
        <input class="hidden" type="file" accept="image/*" multiple @change="handleFiles('background', $event)" />
      </label>
      <label
        class="cursor-pointer rounded-lg border border-white/[0.1] bg-black/25 px-2 py-2 text-center text-xs font-medium text-slate-200 transition hover:border-violet-400/35 hover:bg-white/[0.06]"
      >
        + Спрайт
        <input class="hidden" type="file" accept="image/*" multiple @change="handleFiles('sprite', $event)" />
      </label>
    </div>

    <div class="max-h-48 space-y-2 overflow-auto rounded-xl border border-white/[0.06] bg-black/20 p-2">
      <p v-if="!store.project.assets.length" class="py-4 text-center text-xs text-slate-500">Нет загруженных файлов</p>
      <div v-for="asset in store.project.assets" :key="asset.id" class="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
        <img :src="asset.dataUrl" class="h-11 w-11 shrink-0 rounded-md object-cover ring-1 ring-white/10" alt="" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-medium text-slate-200">{{ asset.name }}</p>
          <p class="text-[10px] text-slate-500">{{ asset.kind === "background" ? "фон" : "спрайт" }}</p>
        </div>
        <button type="button" class="shrink-0 rounded-lg bg-rose-600/90 px-2 py-1.5 text-xs text-white hover:bg-rose-500" @click="store.removeAsset(asset.id)">×</button>
      </div>
    </div>
  </section>
</template>
