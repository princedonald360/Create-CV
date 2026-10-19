<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  canMoveUp: { type: Boolean, default: false },
  canMoveDown: { type: Boolean, default: false },
})

defineEmits(['toggle', 'remove', 'move'])
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-[#c9d3ee] border-l-[5px] bg-white"
    :style="{ borderLeftColor: 'var(--tone, #1d4ed8)' }"
  >
    <div class="flex items-center gap-1 bg-[var(--color-mist)] pr-2 transition hover:bg-[#e2eaff]">
      <button
        type="button"
        class="flex min-w-0 flex-1 select-none items-center gap-2 p-3 text-left"
        :aria-expanded="open"
        @click="$emit('toggle')"
      >
        <span
          aria-hidden="true"
          class="inline-block shrink-0 text-sm text-slate-400 transition-transform duration-200"
          :class="{ 'rotate-90': open }"
        >
          &#8250;
        </span>
        <span class="truncate text-xs font-bold text-slate-700">{{ title }}</span>
        <span v-if="subtitle" class="truncate text-xs text-slate-400">({{ subtitle }})</span>
      </button>

      <button
        type="button"
        aria-label="Monter"
        title="Monter"
        :disabled="!canMoveUp"
        class="shrink-0 rounded px-1.5 py-1 text-xs text-slate-500 transition hover:bg-slate-200 disabled:opacity-30"
        @click="$emit('move', -1)"
      >
        &#8593;
      </button>
      <button
        type="button"
        aria-label="Descendre"
        title="Descendre"
        :disabled="!canMoveDown"
        class="shrink-0 rounded px-1.5 py-1 text-xs text-slate-500 transition hover:bg-slate-200 disabled:opacity-30"
        @click="$emit('move', 1)"
      >
        &#8595;
      </button>
      <button
        type="button"
        class="shrink-0 rounded px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
        @click="$emit('remove')"
      >
        Supprimer
      </button>
    </div>

    <div v-show="open" class="space-y-3 border-t border-[#c9d3ee] bg-white p-4">
      <slot />
    </div>
  </div>
</template>
