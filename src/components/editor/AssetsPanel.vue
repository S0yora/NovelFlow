<script setup lang="ts">
import { useProjectStore } from "@/stores/projectStore";

const store = useProjectStore();

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
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
  <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Assets</h2>

    <div class="mb-3 grid grid-cols-2 gap-2">
      <label class="cursor-pointer rounded border border-slate-700 bg-slate-950 px-2 py-1 text-center text-xs text-slate-200">
        Add Background
        <input class="hidden" type="file" accept="image/*" multiple @change="handleFiles('background', $event)" />
      </label>
      <label class="cursor-pointer rounded border border-slate-700 bg-slate-950 px-2 py-1 text-center text-xs text-slate-200">
        Add Sprite
        <input class="hidden" type="file" accept="image/*" multiple @change="handleFiles('sprite', $event)" />
      </label>
    </div>

    <div class="max-h-44 space-y-2 overflow-auto">
      <div v-for="asset in store.project.assets" :key="asset.id" class="flex items-center gap-2 rounded border border-slate-700 p-2">
        <img :src="asset.dataUrl" class="h-10 w-10 rounded object-cover" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs text-slate-200">{{ asset.name }}</p>
          <p class="text-[10px] text-slate-500">{{ asset.kind }}</p>
        </div>
        <button class="rounded bg-rose-700 px-2 py-1 text-xs text-white" @click="store.removeAsset(asset.id)">x</button>
      </div>
    </div>
  </section>
</template>
