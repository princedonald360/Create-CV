<script setup>
import { useCvStore } from '../../stores/useCvStore'
import { useAccordion } from '../../composables/useAccordion'
import { LIMITS } from '../../utils/constants'
import AccordionCard from '../ui/AccordionCard.vue'
import FormField from '../ui/FormField.vue'

const store = useCvStore()
const { toggle, open, isOpen } = useAccordion()

const handleAdd = () => {
  const id = store.addEducation()
  if (id) open(id)
}
</script>

<template>
  <section>
    <h2 class="section-title">Éducation &amp; formations</h2>

    <div class="space-y-3">
      <AccordionCard
        v-for="(edu, index) in store.education"
        :key="edu.id"
        :open="isOpen(edu.id)"
        :title="edu.degree || `Formation #${index + 1}`"
        :subtitle="edu.school"
        :can-move-up="index > 0"
        :can-move-down="index < store.education.length - 1"
        @toggle="toggle(edu.id)"
        @remove="store.removeEducation(edu.id)"
        @move="store.moveItem('education', edu.id, $event)"
      >
        <FormField
          v-model="edu.degree"
          label="Diplôme / Formation"
          placeholder="ex: Licence en Informatique"
          :maxlength="LIMITS.medium"
        />

        <FormField
          v-model="edu.school"
          label="Établissement / École"
          placeholder="ex: Université Virtuelle"
          :maxlength="LIMITS.medium"
        />

        <div class="grid grid-cols-2 gap-2">
          <FormField v-model="edu.startDate" label="Début" type="month" />
          <FormField v-model="edu.endDate" label="Fin" type="month" />
        </div>
      </AccordionCard>
    </div>

    <button
      type="button"
      class="btn-add mt-3"
      :disabled="store.education.length >= LIMITS.maxItems"
      @click="handleAdd"
    >
      + Ajouter une formation
    </button>
  </section>
</template>
