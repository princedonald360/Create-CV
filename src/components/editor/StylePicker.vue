<script setup>
import { computed } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import { PRESET_COLORS, SECTION_TOGGLES } from '../../utils/constants'

const store = useCvStore()

// Nombre de sections actuellement affichées (pour le compteur « 5 / 7 »).
const visibleCount = computed(() => SECTION_TOGGLES.filter((s) => store.setting[s.key]).length)

// Affiche ou masque toutes les sections d'un coup.
const setAll = (value) => {
  SECTION_TOGGLES.forEach((s) => {
    store.setting[s.key] = value
  })
}

const toggleSection = (key) => {
  store.setting[key] = !store.setting[key]
}
</script>

<template>
  <section>
    <h2 class="section-title">Apparence et sections</h2>

    <!-- Couleur d'accentuation du CV -->
    <div>
      <span class="mb-3 block text-sm font-bold text-[var(--color-ink)]">Couleur de votre CV</span>

      <div class="flex flex-wrap items-center gap-3">
        <button
          v-for="color in PRESET_COLORS"
          :key="color"
          type="button"
          :aria-label="`Couleur ${color}`"
          :aria-pressed="store.setting.primaryColor === color"
          :style="{ backgroundColor: color }"
          class="flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-sm transition-transform active:scale-95"
          :class="
            store.setting.primaryColor === color
              ? 'scale-110 border-[var(--color-ink)]'
              : 'border-white hover:scale-105'
          "
          @click="store.setting.primaryColor = color"
        >
          <span v-if="store.setting.primaryColor === color" class="h-2.5 w-2.5 rounded-full bg-white" />
        </button>

        <!-- Sélecteur natif : couleur personnalisée -->
        <div class="relative flex items-center">
          <input
            id="customColor"
            v-model="store.setting.primaryColor"
            type="color"
            aria-label="Couleur personnalisée"
            class="absolute inset-0 z-10 h-9 w-9 cursor-pointer opacity-0"
          />
          <label
            for="customColor"
            class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-[var(--color-cobalt)] bg-white text-base font-bold text-[var(--color-cobalt)]"
          >
            +
          </label>
        </div>
      </div>
    </div>

    <!-- Sections affichées : pastilles à cliquer -->
    <div class="mt-5 border-t-2 border-dashed border-[#c9d3ee] pt-4">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 class="text-sm font-bold text-[var(--color-ink)]">
          Sections du CV
          <span class="ml-1 rounded-full bg-[var(--color-mist)] px-2 py-0.5 text-xs font-bold text-[var(--color-cobalt)]">
            {{ visibleCount }}/{{ SECTION_TOGGLES.length }}
          </span>
        </h3>

        <div class="flex gap-3 text-xs font-bold text-[var(--color-cobalt)]">
          <button type="button" class="underline-offset-2 hover:underline" @click="setAll(true)">
            Tout afficher
          </button>
          <button type="button" class="underline-offset-2 hover:underline" @click="setAll(false)">
            Tout masquer
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        <button
          v-for="section in SECTION_TOGGLES"
          :key="section.key"
          type="button"
          class="section-chip"
          :aria-pressed="store.setting[section.key]"
          @click="toggleSection(section.key)"
        >
          <span class="tick" aria-hidden="true">&#10003;</span>
          <span class="min-w-0 leading-tight">{{ section.label }}</span>
        </button>
      </div>

      <p class="mt-3 text-[11px] leading-relaxed text-slate-500">
        Profil junior ? Masquez « Expériences professionnelles » pour mettre votre formation en avant.
        Une section masquée disparaît du CV et de l'éditeur, mais vos informations sont conservées.
      </p>
    </div>
  </section>
</template>
