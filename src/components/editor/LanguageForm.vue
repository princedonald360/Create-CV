<script setup>
import { useCvStore } from '../../stores/useCvStore'
import { useAccordion } from '../../composables/useAccordion'
import { LIMITS } from '../../utils/constants'
import { getLevelLabel } from '../../utils/format'
import AccordionCard from '../ui/AccordionCard.vue'
import FormField from '../ui/FormField.vue'

const store = useCvStore()
const { toggle, open, isOpen } = useAccordion()

const handleAdd = () => {
  const id = store.addLanguage()
  if (id) open(id)
}
</script>

<template>
  <section>
    <h2 class="section-title">Langues pratiquées</h2>

    <div class="space-y-3">
      <AccordionCard
        v-for="(lang, index) in store.languages"
        :key="lang.id"
        :open="isOpen(lang.id)"
        :title="lang.name || `Langue #${index + 1}`"
        :subtitle="getLevelLabel(lang.level)"
        :can-move-up="index > 0"
        :can-move-down="index < store.languages.length - 1"
        @toggle="toggle(lang.id)"
        @remove="store.removeLanguage(lang.id)"
        @move="store.moveItem('languages', lang.id, $event)"
      >
        <FormField
          v-model="lang.name"
          label="Langue"
          placeholder="ex: Français, Anglais, Espagnol…"
          :maxlength="LIMITS.short"
        />

        <div>
          <div class="mb-1 flex items-center justify-between">
            <label :for="`level-${lang.id}`" class="field-label mb-0">Niveau de maîtrise</label>
            <span class="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
              {{ getLevelLabel(lang.level) }}
            </span>
          </div>
          <input
            :id="`level-${lang.id}`"
            v-model.number="lang.level"
            type="range"
            min="10"
            max="100"
            step="10"
            :style="{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${lang.level}%, #e2e8f0 ${lang.level}%, #e2e8f0 100%)`,
            }"
            class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
          />
        </div>
      </AccordionCard>
    </div>

    <button
      type="button"
      class="btn-add mt-3"
      :disabled="store.languages.length >= LIMITS.maxItems"
      @click="handleAdd"
    >
      + Ajouter une langue
    </button>
  </section>
</template>
