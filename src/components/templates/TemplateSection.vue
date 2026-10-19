<script setup>
defineProps({
  title: { type: String, required: true },
  accent: { type: String, default: '#2563eb' },
})
</script>

<template>
  <section class="mb-5">
    <h2
      class="mb-2.5 break-after-avoid border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider"
      :style="{ color: accent }"
    >
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
