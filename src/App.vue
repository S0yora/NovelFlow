<script setup lang="ts">
import { useProjectStore } from "@/stores/projectStore";
import GraphCanvas from "@/components/editor/GraphCanvas.vue";
import NodeInspector from "@/components/editor/NodeInspector.vue";
import VariablesPanel from "@/components/editor/VariablesPanel.vue";
import AssetsPanel from "@/components/editor/AssetsPanel.vue";
import ExportPanel from "@/components/export/ExportPanel.vue";

const store = useProjectStore();
</script>

<template>
  <div class="relative min-h-screen font-sans text-slate-200">
    <!-- Фон: мягкий градиент + «шарики» (размытые круги), не перехватывают клики -->
    <div
      class="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-[#151225] via-[#14101c] to-[#0f0d14]"
      aria-hidden="true"
    />
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        class="absolute -left-[18%] -top-[12%] h-[min(85vw,560px)] w-[min(85vw,560px)] rounded-full bg-violet-500/[0.22] blur-[100px]"
      />
      <div
        class="absolute -right-[12%] top-[18%] h-[min(75vw,480px)] w-[min(75vw,480px)] rounded-full bg-sky-400/[0.18] blur-[110px]"
      />
      <div
        class="absolute bottom-[-8%] left-[15%] h-[min(65vw,420px)] w-[min(65vw,420px)] rounded-full bg-fuchsia-500/[0.14] blur-[95px]"
      />
      <div
        class="absolute left-[40%] top-[55%] h-[min(50vw,320px)] w-[min(50vw,320px)] -translate-x-1/2 rounded-full bg-indigo-400/[0.08] blur-[80px]"
      />
    </div>

    <main class="relative z-0">
      <div class="mx-auto max-w-7xl p-4 sm:p-6">
        <header
          class="mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-lg shadow-black/20 ring-1 ring-white/[0.06] backdrop-blur-md"
        >
          <div class="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 class="mt-1 bg-gradient-to-r from-white via-violet-100 to-slate-200 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
                NovelFlow
              </h1>
            </div>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-slate-400">Название проекта</span>
              <input
                class="w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none transition placeholder:text-slate-500 focus:border-violet-400/35 focus:ring-2 focus:ring-violet-500/25"
                :value="store.project.title"
                @input="store.setProjectTitle(($event.target as HTMLInputElement).value)"
              />
            </label>
            <div
              class="mt-auto h-fit rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5 text-xs text-slate-400/90"
            >
              <span class="text-slate-500">Последнее сохранение:</span>
              <span class="ml-2 font-mono text-sm text-slate-300/95">{{ new Date(store.project.updatedAt).toLocaleString("ru-RU") }}</span>
            </div>
          </div>
        </header>

        <div class="grid gap-5 lg:grid-cols-3">
          <div class="space-y-5">
            <GraphCanvas />
            <VariablesPanel />
          </div>
          <div class="space-y-5">
            <NodeInspector />
          </div>
          <div class="space-y-5">
            <AssetsPanel />
            <ExportPanel />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
