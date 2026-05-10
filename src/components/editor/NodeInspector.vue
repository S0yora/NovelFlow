<script setup lang="ts">
import { computed } from "vue";
import { useProjectStore } from "@/stores/projectStore";

const store = useProjectStore();
const node = computed(() => store.selectedNode);

const variableOptions = computed(() => store.project.variables.map((item) => item.key));
</script>

<template>
  <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Node Inspector</h2>

    <div v-if="node" class="space-y-3">
      <label class="block">
        <span class="mb-1 block text-xs text-slate-400">Title</span>
        <input
          class="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
          :value="node.title"
          @input="store.updateNode(node.id, { title: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-xs text-slate-400">Character Name</span>
        <input
          class="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
          :value="node.characterName"
          @input="store.updateNode(node.id, { characterName: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <label class="block">
        <span class="mb-1 block text-xs text-slate-400">Dialogue Text</span>
        <textarea
          class="h-24 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
          :value="node.text"
          @input="store.updateNode(node.id, { text: ($event.target as HTMLTextAreaElement).value })"
        />
      </label>

      <div class="grid grid-cols-2 gap-2">
        <button class="rounded bg-emerald-700 px-2 py-1 text-xs text-white" @click="store.setStartNode(node.id)">Set As Start</button>
        <button class="rounded bg-rose-700 px-2 py-1 text-xs text-white" @click="store.removeNode(node.id)">Delete Node</button>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-xs uppercase tracking-wide text-slate-400">Node Effects</h3>
          <button class="rounded bg-slate-700 px-2 py-1 text-xs text-white" @click="store.addNodeEffect(node.id)">Add Effect</button>
        </div>
        <div v-for="(effect, effectIndex) in node.effects" :key="effectIndex" class="grid grid-cols-4 gap-1">
          <input
            class="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            placeholder="variable"
            :list="'variables-list'"
            :value="effect.variableKey"
            @input="store.updateNodeEffect(node.id, effectIndex, { variableKey: ($event.target as HTMLInputElement).value })"
          />
          <select
            class="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            :value="effect.operation"
            @change="store.updateNodeEffect(node.id, effectIndex, { operation: ($event.target as HTMLSelectElement).value as 'set' | 'add' })"
          >
            <option value="set">set</option>
            <option value="add">add</option>
          </select>
          <input
            class="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            placeholder="value"
            :value="String(effect.value)"
            @input="store.updateNodeEffect(node.id, effectIndex, { value: ($event.target as HTMLInputElement).value })"
          />
          <button class="rounded bg-rose-700 px-2 py-1 text-xs text-white" @click="store.removeNodeEffect(node.id, effectIndex)">x</button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-xs uppercase tracking-wide text-slate-400">Choices</h3>
          <button class="rounded bg-slate-700 px-2 py-1 text-xs text-white" @click="store.addChoice(node.id)">Add Choice</button>
        </div>
        <div v-for="choice in node.choices" :key="choice.id" class="space-y-2 rounded border border-slate-700 p-2">
          <input
            class="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            :value="choice.text"
            @input="store.updateChoice(node.id, choice.id, { text: ($event.target as HTMLInputElement).value })"
          />
          <select
            class="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            :value="choice.targetNodeId"
            @change="store.updateChoice(node.id, choice.id, { targetNodeId: ($event.target as HTMLSelectElement).value })"
          >
            <option v-for="target in store.project.nodes" :key="target.id" :value="target.id">{{ target.title }}</option>
          </select>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-wide text-slate-400">Conditions</span>
              <button class="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-white" @click="store.addChoiceCondition(node.id, choice.id)">
                + condition
              </button>
            </div>
            <div v-for="(condition, conditionIndex) in choice.conditions" :key="conditionIndex" class="grid grid-cols-4 gap-1">
              <input
                class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-[10px] text-slate-100"
                :list="'variables-list'"
                :value="condition.variableKey"
                @input="
                  store.updateChoiceCondition(node.id, choice.id, conditionIndex, {
                    variableKey: ($event.target as HTMLInputElement).value
                  })
                "
              />
              <select
                class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-[10px] text-slate-100"
                :value="condition.operator"
                @change="
                  store.updateChoiceCondition(node.id, choice.id, conditionIndex, {
                    operator: ($event.target as HTMLSelectElement).value as '==' | '!=' | '>' | '<' | '>=' | '<='
                  })
                "
              >
                <option value="==">==</option>
                <option value="!=">!=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>
              <input
                class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-[10px] text-slate-100"
                :value="String(condition.value)"
                @input="
                  store.updateChoiceCondition(node.id, choice.id, conditionIndex, {
                    value: ($event.target as HTMLInputElement).value
                  })
                "
              />
              <button class="rounded bg-rose-700 px-1 py-1 text-[10px] text-white" @click="store.removeChoiceCondition(node.id, choice.id, conditionIndex)">
                x
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-wide text-slate-400">Choice Effects</span>
              <button class="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-white" @click="store.addChoiceEffect(node.id, choice.id)">+ effect</button>
            </div>
            <div v-for="(effect, effectIndex) in choice.effects" :key="effectIndex" class="grid grid-cols-4 gap-1">
              <input
                class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-[10px] text-slate-100"
                :list="'variables-list'"
                :value="effect.variableKey"
                @input="store.updateChoiceEffect(node.id, choice.id, effectIndex, { variableKey: ($event.target as HTMLInputElement).value })"
              />
              <select
                class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-[10px] text-slate-100"
                :value="effect.operation"
                @change="store.updateChoiceEffect(node.id, choice.id, effectIndex, { operation: ($event.target as HTMLSelectElement).value as 'set' | 'add' })"
              >
                <option value="set">set</option>
                <option value="add">add</option>
              </select>
              <input
                class="rounded border border-slate-700 bg-slate-950 px-1 py-1 text-[10px] text-slate-100"
                :value="String(effect.value)"
                @input="store.updateChoiceEffect(node.id, choice.id, effectIndex, { value: ($event.target as HTMLInputElement).value })"
              />
              <button class="rounded bg-rose-700 px-1 py-1 text-[10px] text-white" @click="store.removeChoiceEffect(node.id, choice.id, effectIndex)">
                x
              </button>
            </div>
          </div>

          <button class="w-full rounded bg-rose-700 px-2 py-1 text-[10px] text-white" @click="store.removeChoice(node.id, choice.id)">Delete Choice</button>
        </div>
      </div>

      <datalist id="variables-list">
        <option v-for="name in variableOptions" :key="name" :value="name">{{ name }}</option>
      </datalist>
    </div>

    <p v-else class="text-sm text-slate-500">Select a node to edit.</p>
  </section>
</template>
