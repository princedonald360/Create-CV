<script setup>
import { useCvStore } from '../../stores/useCvStore'
import { useAccordion } from '../../composables/useAccordion'
import { LIMITS } from '../../utils/constants'
import AccordionCard from '../ui/AccordionCard.vue'
import FormField from '../ui/FormField.vue'

const store = useCvStore()
const { toggle, open, isOpen } = useAccordion()

// Crée une expérience et l'ouvre immédiatement (null si la limite est atteinte).
const handleAdd = () => {
  const id = store.addExperience()
  if (id) open(id)
}
</script>

<template>
  <section>
    <h2 class="section-title">Expérience professionnelle</h2>

    <div class="space-y-3">
      <AccordionCard
        v-for="(exp, index) in store.experience"
        :key="exp.id"
        :open="isOpen(exp.id)"
        :title="exp.position || `Expérience #${index + 1}`"
        :subtitle="exp.company"
        :can-move-up="index > 0"
        :can-move-down="index < store.experience.length - 1"
        @toggle="toggle(exp.id)"
        @remove="store.removeExperience(exp.id)"
        @move="store.moveItem('experience', exp.id, $event)"
      >
        <FormField
          v-model="exp.position"
          label="Poste occupé"
          placeholder="ex: Développeur Frontend"
          :maxlength="LIMITS.medium"
        />

        <FormField
          v-model="exp.company"
          label="Entreprise"
          placeholder="ex: Tech Solution"
          :maxlength="LIMITS.medium"
        />

        <div class="grid grid-cols-2 gap-2">
          <FormField v-model="exp.startDate" label="Début" type="month" />
          <FormField v-model="exp.endDate" label="Fin" type="month" :disabled="exp.current" />
        </div>

        <label class="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-slate-700">
          <input
            v-model="exp.current"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 accent-blue-600"
          />
          Poste actuel (affiche « Présent »)
        </label>

        <FormField
          v-model="exp.description"
          label="Description / Missions"
          placeholder="Décrivez vos réalisations (une ligne par point)"
          multiline
          :rows="4"
          :maxlength="LIMITS.description"
        />
      </AccordionCard>
    </div>

    <button
      type="button"
      class="btn-add mt-3"
      :disabled="store.experience.length >= LIMITS.maxItems"
      @click="handleAdd"
    >
      + Ajouter une expérience
    </button>
  </section>
</template>
