<script setup lang="ts">
import { computed } from "vue";
import { useProjectStore } from "@/stores/projectStore";

const store = useProjectStore();

const nodeLinks = computed(() =>
  store.project.nodes.flatMap((node) =>
    node.choices.map((choice) => {
      const target = store.project.nodes.find((entry) => entry.id === choice.targetNodeId);
      return {
        id: choice.id,
        from: node.title,
        to: target?.title ?? "Missing node",
        text: choice.text
      };
    })
  )
);
</script>

<template>
  <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-300">Graph</h2>
      <button class="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500" @click="store.addNode">
        Add Node
      </button>
    </div>

    <div class="grid gap-2">
      <button
        v-for="node in store.project.nodes"
        :key="node.id"
        class="rounded border px-3 py-2 text-left text-sm transition"
        :class="
          store.selectedNodeId === node.id
            ? 'border-indigo-500 bg-indigo-500/20 text-indigo-100'
            : 'border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500'
        "
        @click="store.selectNode(node.id)"
      >
        <div class="flex items-center justify-between gap-2">
          <span>{{ node.title || "Untitled" }}</span>
          <span v-if="store.project.startNodeId === node.id" class="rounded bg-emerald-700/40 px-2 py-0.5 text-[10px]">start</span>
        </div>
      </button>
    </div>

    <div class="mt-4">
      <h3 class="mb-2 text-xs uppercase tracking-wide text-slate-400">Links</h3>
      <div v-if="nodeLinks.length" class="space-y-1 text-xs text-slate-300">
        <p v-for="link in nodeLinks" :key="link.id">{{ link.from }} -> {{ link.to }} ({{ link.text }})</p>
      </div>
      <p v-else class="text-xs text-slate-500">No links yet.</p>
    </div>
  </section>
</template>
