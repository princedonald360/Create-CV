<script setup>
defineProps({
  label: { type: String, required: true },
})
const model = defineModel({ type: Boolean, default: false })
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :aria-label="label"
    class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
    :class="model ? 'bg-blue-600' : 'bg-slate-300'"
    @click="model = !model"
  >
    <span
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
      :class="model ? 'translate-x-5' : 'translate-x-0'"
    />
  </button>
</template>
