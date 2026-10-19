<script setup>
import { useCvStore } from '../../stores/useCvStore'
import { useAccordion } from '../../composables/useAccordion'
import { LIMITS } from '../../utils/constants'
import AccordionCard from '../ui/AccordionCard.vue'
import FormField from '../ui/FormField.vue'

const store = useCvStore()
const { toggle, open, isOpen } = useAccordion()

const handleAdd = () => {
  const id = store.addProject()
  if (id) open(id)
}
</script>

<template>
  <section>
    <h2 class="section-title">Projets &amp; réalisations</h2>

    <div class="space-y-3">
      <AccordionCard
        v-for="(proj, index) in store.projects"
        :key="proj.id"
        :open="isOpen(proj.id)"
        :title="proj.name || `Projet #${index + 1}`"
        :can-move-up="index > 0"
        :can-move-down="index < store.projects.length - 1"
        @toggle="toggle(proj.id)"
        @remove="store.removeProject(proj.id)"
        @move="store.moveItem('projects', proj.id, $event)"
      >
        <FormField
          v-model="proj.name"
          label="Nom du projet"
          placeholder="ex: Application de gestion de stock"
          :maxlength="LIMITS.medium"
        />

        <FormField
          v-model="proj.technologies"
          label="Technologies / Outils utilisés"
          placeholder="ex: Vue 3, Tailwind CSS, Firebase"
          :maxlength="LIMITS.medium"
        />

        <FormField
          v-model="proj.description"
          label="Description / Impact"
          placeholder="Fonctionnalités principales et résultats obtenus…"
          multiline
          :rows="3"
          :maxlength="LIMITS.projectDescription"
        />
      </AccordionCard>
    </div>

    <button
      type="button"
      class="btn-add mt-3"
      :disabled="store.projects.length >= LIMITS.maxItems"
      @click="handleAdd"
    >
      + Ajouter un projet
    </button>
  </section>
</template>
