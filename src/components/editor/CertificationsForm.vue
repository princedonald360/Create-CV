<script setup>
import { useCvStore } from '../../stores/useCvStore'
import { useAccordion } from '../../composables/useAccordion'
import { LIMITS } from '../../utils/constants'
import AccordionCard from '../ui/AccordionCard.vue'
import FormField from '../ui/FormField.vue'

const store = useCvStore()
const { toggle, open, isOpen } = useAccordion()

const handleAdd = () => {
  const id = store.addCertification()
  if (id) open(id)
}
</script>

<template>
  <section>
    <h2 class="section-title">Certifications</h2>

    <div class="space-y-3">
      <AccordionCard
        v-for="(cert, index) in store.certifications"
        :key="cert.id"
        :open="isOpen(cert.id)"
        :title="cert.name || `Certification #${index + 1}`"
        :subtitle="cert.organization"
        :can-move-up="index > 0"
        :can-move-down="index < store.certifications.length - 1"
        @toggle="toggle(cert.id)"
        @remove="store.removeCertification(cert.id)"
        @move="store.moveItem('certifications', cert.id, $event)"
      >
        <FormField
          v-model="cert.name"
          label="Intitulé de la certification"
          placeholder="ex: AWS Certified Developer"
          :maxlength="LIMITS.medium"
        />

        <div class="grid grid-cols-2 gap-2">
          <FormField
            v-model="cert.organization"
            label="Organisme"
            placeholder="ex: Amazon Web Services"
            :maxlength="LIMITS.medium"
          />
          <FormField
            v-model="cert.year"
            label="Année"
            placeholder="ex: 2024"
            inputmode="numeric"
            :maxlength="10"
          />
        </div>
      </AccordionCard>
    </div>

    <button
      type="button"
      class="btn-add mt-3"
      :disabled="store.certifications.length >= LIMITS.maxItems"
      @click="handleAdd"
    >
      + Ajouter une certification
    </button>
  </section>
</template>
