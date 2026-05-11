<script setup lang="ts">
import { computed } from "vue";
import { useProjectStore } from "@/stores/projectStore";

const store = useProjectStore();
const node = computed(() => store.selectedNode);

const variableOptions = computed(() => store.project.variables.map((item) => item.key));
const backgroundAssets = computed(() => store.project.assets.filter((a) => a.kind === "background"));
const spriteAssets = computed(() => store.project.assets.filter((a) => a.kind === "sprite"));
</script>

<template>
  <section class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-lg shadow-black/15 ring-1 ring-white/[0.05] backdrop-blur-sm">
    <h2 class="mb-3 text-sm font-semibold text-slate-200">Узел сцены</h2>

    <div v-if="node" class="space-y-4">
      <label class="block">
        <span class="mb-1.5 block text-xs font-medium text-slate-400">Название</span>
        <input
          class="w-full rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/30"
          :value="node.title"
          @input="store.updateNode(node.id, { title: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <label class="block">
        <span class="mb-1.5 block text-xs font-medium text-slate-400">Имя персонажа</span>
        <input
          class="w-full rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/30"
          placeholder="Оставьте пустым для безымянной реплики"
          :value="node.characterName"
          @input="store.updateNode(node.id, { characterName: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <label class="block">
        <span class="mb-1.5 block text-xs font-medium text-slate-400">Текст реплики</span>
        <textarea
          class="h-28 w-full resize-y rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2 text-sm leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/30"
          :value="node.text"
          @input="store.updateNode(node.id, { text: ($event.target as HTMLTextAreaElement).value })"
        />
      </label>

      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1.5 block text-xs font-medium text-slate-400">Фон</span>
          <select
            class="w-full rounded-lg border border-white/[0.08] bg-black/25 px-2 py-2 text-xs text-slate-100"
            :value="node.backgroundAssetId"
            @change="store.updateNode(node.id, { backgroundAssetId: ($event.target as HTMLSelectElement).value })"
          >
            <option value="">— не выбран —</option>
            <option v-for="a in backgroundAssets" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </label>
        <label class="block">
          <span class="mb-1.5 block text-xs font-medium text-slate-400">Спрайт</span>
          <select
            class="w-full rounded-lg border border-white/[0.08] bg-black/25 px-2 py-2 text-xs text-slate-100"
            :value="node.spriteAssetId"
            @change="store.updateNode(node.id, { spriteAssetId: ($event.target as HTMLSelectElement).value })"
          >
            <option value="">— не выбран —</option>
            <option v-for="a in spriteAssets" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </label>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="rounded-lg bg-emerald-600/90 px-2 py-2 text-xs font-medium text-white hover:bg-emerald-500"
          @click="store.setStartNode(node.id)"
        >
          Сделать стартом
        </button>
        <button type="button" class="rounded-lg bg-rose-600/90 px-2 py-2 text-xs font-medium text-white hover:bg-rose-500" @click="store.removeNode(node.id)">
          Удалить узел
        </button>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-xs font-medium text-slate-400">Эффекты при входе в узел</h3>
          <button type="button" class="rounded-lg bg-white/15 px-2 py-1 text-xs text-white hover:bg-white/25" @click="store.addNodeEffect(node.id)">
            + эффект
          </button>
        </div>
        <div v-for="(effect, effectIndex) in node.effects" :key="effectIndex" class="grid grid-cols-4 gap-1.5">
          <input
            class="min-w-0 rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1.5 text-xs text-slate-100"
            placeholder="переменная"
            :list="'variables-list'"
            :value="effect.variableKey"
            @input="store.updateNodeEffect(node.id, effectIndex, { variableKey: ($event.target as HTMLInputElement).value })"
          />
          <select
            class="rounded-lg border border-white/[0.08] bg-black/25 px-1 py-1.5 text-xs text-slate-100"
            :value="effect.operation"
            @change="store.updateNodeEffect(node.id, effectIndex, { operation: ($event.target as HTMLSelectElement).value as 'set' | 'add' })"
          >
            <option value="set">установить</option>
            <option value="add">прибавить</option>
          </select>
          <input
            class="min-w-0 rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1.5 text-xs text-slate-100"
            placeholder="значение"
            :value="String(effect.value)"
            @input="store.updateNodeEffect(node.id, effectIndex, { value: ($event.target as HTMLInputElement).value })"
          />
          <button type="button" class="rounded-lg bg-rose-600/90 px-2 py-1.5 text-xs text-white" @click="store.removeNodeEffect(node.id, effectIndex)">×</button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-xs font-medium text-slate-400">Варианты выбора</h3>
          <button type="button" class="rounded-lg bg-white/15 px-2 py-1 text-xs text-white hover:bg-white/25" @click="store.addChoice(node.id)">
            + вариант
          </button>
        </div>
        <div v-for="choice in node.choices" :key="choice.id" class="space-y-2 rounded-lg border border-white/[0.08] bg-black/20 p-3">
          <input
            class="w-full rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1.5 text-xs text-slate-100"
            placeholder="Текст на кнопке"
            :value="choice.text"
            @input="store.updateChoice(node.id, choice.id, { text: ($event.target as HTMLInputElement).value })"
          />
          <select
            class="w-full rounded-lg border border-white/[0.08] bg-black/25 px-2 py-1.5 text-xs text-slate-100"
            :value="choice.targetNodeId"
            @change="store.updateChoice(node.id, choice.id, { targetNodeId: ($event.target as HTMLSelectElement).value })"
          >
            <option v-for="target in store.project.nodes" :key="target.id" :value="target.id">{{ target.title }}</option>
          </select>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-medium uppercase tracking-wide text-slate-500">Условия</span>
              <button type="button" class="rounded bg-white/15 px-1.5 py-0.5 text-[10px] text-white hover:bg-white/25" @click="store.addChoiceCondition(node.id, choice.id)">
                + условие
              </button>
            </div>
            <div v-for="(condition, conditionIndex) in choice.conditions" :key="conditionIndex" class="grid grid-cols-4 gap-1">
              <input
                class="rounded border border-white/[0.1] bg-black/30 px-1 py-1 text-[10px] text-slate-100"
                :list="'variables-list'"
                :value="condition.variableKey"
                @input="
                  store.updateChoiceCondition(node.id, choice.id, conditionIndex, {
                    variableKey: ($event.target as HTMLInputElement).value
                  })
                "
              />
              <select
                class="rounded border border-white/[0.1] bg-black/30 px-1 py-1 text-[10px] text-slate-100"
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
                class="rounded border border-white/[0.1] bg-black/30 px-1 py-1 text-[10px] text-slate-100"
                :value="String(condition.value)"
                @input="
                  store.updateChoiceCondition(node.id, choice.id, conditionIndex, {
                    value: ($event.target as HTMLInputElement).value
                  })
                "
              />
              <button type="button" class="rounded bg-rose-600 px-1 py-1 text-[10px] text-white" @click="store.removeChoiceCondition(node.id, choice.id, conditionIndex)">
                ×
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-medium uppercase tracking-wide text-slate-500">После выбора</span>
              <button type="button" class="rounded bg-white/15 px-1.5 py-0.5 text-[10px] text-white hover:bg-white/25" @click="store.addChoiceEffect(node.id, choice.id)">
                + эффект
              </button>
            </div>
            <div v-for="(effect, effectIndex) in choice.effects" :key="effectIndex" class="grid grid-cols-4 gap-1">
              <input
                class="rounded border border-white/[0.1] bg-black/30 px-1 py-1 text-[10px] text-slate-100"
                :list="'variables-list'"
                :value="effect.variableKey"
                @input="store.updateChoiceEffect(node.id, choice.id, effectIndex, { variableKey: ($event.target as HTMLInputElement).value })"
              />
              <select
                class="rounded border border-white/[0.1] bg-black/30 px-1 py-1 text-[10px] text-slate-100"
                :value="effect.operation"
                @change="store.updateChoiceEffect(node.id, choice.id, effectIndex, { operation: ($event.target as HTMLSelectElement).value as 'set' | 'add' })"
              >
                <option value="set">установить</option>
                <option value="add">прибавить</option>
              </select>
              <input
                class="rounded border border-white/[0.1] bg-black/30 px-1 py-1 text-[10px] text-slate-100"
                :value="String(effect.value)"
                @input="store.updateChoiceEffect(node.id, choice.id, effectIndex, { value: ($event.target as HTMLInputElement).value })"
              />
              <button type="button" class="rounded bg-rose-600 px-1 py-1 text-[10px] text-white" @click="store.removeChoiceEffect(node.id, choice.id, effectIndex)">
                ×
              </button>
            </div>
          </div>

          <button type="button" class="w-full rounded-lg bg-rose-600/80 px-2 py-1.5 text-[10px] font-medium text-white hover:bg-rose-500" @click="store.removeChoice(node.id, choice.id)">
            Удалить вариант
          </button>
        </div>
      </div>

      <datalist id="variables-list">
        <option v-for="name in variableOptions" :key="name" :value="name">{{ name }}</option>
      </datalist>
    </div>

    <p v-else class="rounded-xl border border-dashed border-white/[0.12] bg-black/20 px-3 py-6 text-center text-sm text-slate-500">Выберите узел слева, чтобы редактировать сцену.</p>
  </section>
</template>
