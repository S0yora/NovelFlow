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
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto max-w-7xl p-4">
      <header class="mb-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h1 class="mb-3 text-xl font-semibold">NovelFlow MVP</h1>
        <div class="grid gap-2 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-xs text-slate-400">Project Title</span>
            <input
              class="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              :value="store.project.title"
              @input="store.setProjectTitle(($event.target as HTMLInputElement).value)"
            />
          </label>
          <div class="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-400">
            Last update: {{ new Date(store.project.updatedAt).toLocaleString() }}
          </div>
        </div>
      </header>

      <div class="grid gap-4 lg:grid-cols-3">
        <div class="space-y-4">
          <GraphCanvas />
          <VariablesPanel />
        </div>
        <div class="space-y-4">
          <NodeInspector />
        </div>
        <div class="space-y-4">
          <AssetsPanel />
          <ExportPanel />
        </div>
      </div>
    </div>
  </main>
</template>
