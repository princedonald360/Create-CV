<script setup>
import { useCvStore } from '../../stores/useCvStore'
import { PRESET_COLORS, SECTION_TOGGLES } from '../../utils/constants'
import ToggleSwitch from '../ui/ToggleSwitch.vue'

const store = useCvStore()
</script>

<template>
  <section>
    <h2 class="section-title">Apparence &amp; sections</h2>

    <div class="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <!-- Couleur d'accentuation -->
      <div>
        <span class="mb-3 block text-sm font-semibold text-slate-700">Couleur d'accentuation</span>

        <div class="flex flex-wrap items-center gap-3">
          <button
            v-for="color in PRESET_COLORS"
            :key="color"
            type="button"
            :aria-label="`Couleur ${color}`"
            :aria-pressed="store.setting.primaryColor === color"
            :style="{ backgroundColor: color }"
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-sm transition-transform active:scale-95"
            :class="
              store.setting.primaryColor === color
                ? 'scale-110 border-slate-800'
                : 'border-transparent hover:scale-105'
            "
            @click="store.setting.primaryColor = color"
          >
            <span
              v-if="store.setting.primaryColor === color"
              class="h-2 w-2 rounded-full bg-white"
            />
          </button>

          <!-- Sélecteur natif : couleur personnalisée -->
          <div class="relative flex items-center">
            <input
              id="customColor"
              v-model="store.setting.primaryColor"
              type="color"
              aria-label="Couleur personnalisée"
              class="absolute inset-0 z-10 h-8 w-8 cursor-pointer opacity-0"
            />
            <label
              for="customColor"
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-400 bg-white text-xs font-bold text-slate-500 hover:border-slate-600 hover:text-slate-700"
            >
              +
            </label>
          </div>
        </div>
      </div>

      <!-- Sections visibles -->
      <div class="space-y-3 border-t border-slate-200 pt-4">
        <span class="block text-sm font-semibold text-slate-700">Sections visibles sur le CV</span>

        <div
          v-for="section in SECTION_TOGGLES"
          :key="section.key"
          class="flex items-center justify-between gap-3"
        >
          <div class="min-w-0">
            <span class="block text-xs font-medium text-slate-700">{{ section.label }}</span>
            <span v-if="section.hint" class="block text-[11px] text-slate-500">
              {{ section.hint }}
            </span>
          </div>
          <ToggleSwitch v-model="store.setting[section.key]" :label="`Afficher : ${section.label}`" />
        </div>
      </div>
    </div>
  </section>
</template>
