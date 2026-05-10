<script setup lang="ts">
import { useProjectStore } from "@/stores/projectStore";
import type { VariableType } from "@/domain/types";

const store = useProjectStore();

function parseDefaultValue(type: VariableType, raw: string) {
  if (type === "number") return Number(raw || 0);
  if (type === "boolean") return raw === "true";
  return raw;
}
</script>

<template>
  <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-300">Variables</h2>
      <button class="rounded bg-indigo-600 px-2 py-1 text-xs text-white" @click="store.addVariable">Add</button>
    </div>

    <div class="space-y-2">
      <div v-for="variable in store.project.variables" :key="variable.id" class="grid grid-cols-4 gap-1">
        <input
          class="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
          :value="variable.key"
          @input="store.updateVariable(variable.id, { key: ($event.target as HTMLInputElement).value })"
        />
        <select
          class="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
          :value="variable.type"
          @change="
            store.updateVariable(variable.id, {
              type: ($event.target as HTMLSelectElement).value as VariableType
            })
          "
        >
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="string">string</option>
        </select>
        <input
          class="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
          :value="String(variable.defaultValue)"
          @input="
            store.updateVariable(variable.id, {
              defaultValue: parseDefaultValue(variable.type, ($event.target as HTMLInputElement).value)
            })
          "
        />
        <button class="rounded bg-rose-700 px-2 py-1 text-xs text-white" @click="store.removeVariable(variable.id)">x</button>
      </div>
    </div>
  </section>
</template>
