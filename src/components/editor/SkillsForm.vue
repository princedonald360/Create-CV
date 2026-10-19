<script setup>
import { ref } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import { LIMITS } from '../../utils/constants'

const store = useCvStore()
const newSkill = ref('')

// Accepte plusieurs compétences d'un coup, séparées par des virgules ou des points-virgules.
const handleAddSkill = () => {
  newSkill.value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((skill) => store.addSkill(skill))
  newSkill.value = ''
}
</script>

<template>
  <section>
    <h2 class="section-title">Compétences clés</h2>

    <div class="space-y-3">
      <div class="flex gap-2">
        <input
          v-model="newSkill"
          type="text"
          aria-label="Nouvelle compétence"
          placeholder="ex: Vue.js, Python, Gestion de projet…"
          :maxlength="LIMITS.skill * 5"
          class="field-input flex-1"
          @keydown.enter.prevent="handleAddSkill"
        />
        <button
          type="button"
          class="btn-primary px-4"
          :disabled="!newSkill.trim() || store.skills.length >= LIMITS.maxSkills"
          @click="handleAddSkill"
        >
          Ajouter
        </button>
      </div>

      <ul v-if="store.skills.length > 0" class="flex flex-wrap gap-2 pt-1">
        <li
          v-for="(skill, index) in store.skills"
          :key="skill"
          class="chip"
        >
          <span>{{ skill }}</span>
          <button
            type="button"
            :aria-label="`Supprimer la compétence ${skill}`"
            class="ml-1 font-bold text-slate-400 transition hover:text-red-600"
            @click="store.removeSkill(index)"
          >
            &times;
          </button>
        </li>
      </ul>
      <p v-else class="text-xs italic text-slate-400">
        Appuyez sur Entrée ou cliquez sur « Ajouter ». Vous pouvez en saisir plusieurs séparées par une
        virgule.
      </p>

      <p v-if="store.skills.length >= LIMITS.maxSkills" class="text-xs text-amber-600">
        Limite de {{ LIMITS.maxSkills }} compétences atteinte.
      </p>
    </div>
  </section>
</template>
