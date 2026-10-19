<script setup>
import { ref } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import { LIMITS } from '../../utils/constants'
import FormField from '../ui/FormField.vue'

const store = useCvStore()

const name = ref('')
const detail = ref('')

const handleAdd = () => {
  if (store.addInterest(name.value, detail.value)) {
    name.value = ''
    detail.value = ''
  }
}
</script>

<template>
  <section>
    <h2 class="section-title">Centres d'intérêt &amp; loisirs</h2>

    <div class="space-y-3 rounded-xl border border-[#c9d3ee] bg-[var(--color-mist)] p-3" @keydown.enter.prevent="handleAdd">
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <FormField
          v-model="name"
          label="Activité / Loisir"
          placeholder="ex: Football, Voyage…"
          :maxlength="LIMITS.short"
        />
        <FormField
          v-model="detail"
          label="Description (facultatif)"
          placeholder="ex: Esprit d'équipe, découverte"
          :maxlength="LIMITS.medium"
        />
      </div>

      <button
        type="button"
        class="btn-primary w-full"
        :disabled="!name.trim() || store.interests.length >= LIMITS.maxItems"
        @click="handleAdd"
      >
        + Ajouter ce centre d'intérêt
      </button>
    </div>

    <ul v-if="store.interests.length > 0" class="mt-3 flex flex-wrap gap-2">
      <li
        v-for="item in store.interests"
        :key="item.id"
        class="chip gap-2"
      >
        <span class="min-w-0 truncate">
          <span class="font-bold text-slate-800">{{ item.name }}</span>
          <span v-if="item.detail" class="text-slate-600"> : {{ item.detail }}</span>
        </span>
        <button
          type="button"
          :aria-label="`Supprimer ${item.name}`"
          class="shrink-0 rounded px-1 font-bold text-slate-400 transition hover:text-red-500"
          @click="store.removeInterest(item.id)"
        >
          &times;
        </button>
      </li>
    </ul>
  </section>
</template>
