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
        to: target?.title ?? "нет узла",
        text: choice.text
      };
    })
  )
);
</script>

<template>
  <section class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-lg shadow-black/15 ring-1 ring-white/[0.05] backdrop-blur-sm">
    <div class="mb-3 flex items-center justify-between gap-2">
      <h2 class="text-sm font-semibold text-slate-200">Граф сцен</h2>
      <button
        type="button"
        class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-md shadow-violet-900/30 transition hover:bg-violet-500"
        @click="store.addNode"
      >
        + Узел
      </button>
    </div>

    <div class="grid gap-2">
      <button
        v-for="node in store.project.nodes"
        :key="node.id"
        type="button"
        class="rounded-lg border px-3 py-2.5 text-left text-sm transition"
        :class="
          store.selectedNodeId === node.id
            ? 'border-violet-500/80 bg-violet-500/15 text-violet-50 ring-1 ring-violet-400/30'
            : 'border-white/[0.08] bg-black/20 text-slate-200/95 hover:border-white/15 hover:bg-white/[0.06]'
        "
        @click="store.selectNode(node.id)"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="font-medium">{{ node.title || "Без названия" }}</span>
          <span
            v-if="store.project.startNodeId === node.id"
            class="shrink-0 rounded-md bg-emerald-600/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200"
          >старт</span>
        </div>
      </button>
    </div>

    <div class="mt-4 border-t border-white/[0.06] pt-4">
      <h3 class="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Связи</h3>
      <div v-if="nodeLinks.length" class="space-y-1.5 text-xs leading-relaxed text-slate-300">
        <p v-for="link in nodeLinks" :key="link.id" class="rounded-lg bg-black/20 px-2 py-1.5">
          <span class="text-slate-400">{{ link.from }}</span>
          → <span class="text-slate-400">{{ link.to }}</span>
          <span class="text-slate-500"> — «{{ link.text }}»</span>
        </p>
      </div>
      <p v-else class="text-xs text-slate-500">Пока нет веток. Добавьте варианты в инспекторе узла.</p>
    </div>
  </section>
</template>
