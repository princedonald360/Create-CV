<script setup>
import { ref } from 'vue'
import { useCvStore } from './stores/useCvStore'
import { usePreviewScale } from './composables/usePreviewScale'

// Éditeur
import ActionsBar from './components/editor/ActionsBar.vue'
import StylePicker from './components/editor/StylePicker.vue'
import InfoProfile from './components/editor/InfoProfile.vue'
import PhotoUpload from './components/editor/PhotoUpload.vue'
import ExperienceForm from './components/editor/ExperienceForm.vue'
import EducationForm from './components/editor/EducationForm.vue'
import ProjectsForm from './components/editor/ProjectsForm.vue'
import CertificationsForm from './components/editor/CertificationsForm.vue'
import SkillsForm from './components/editor/SkillsForm.vue'
import LanguageForm from './components/editor/LanguageForm.vue'
import InterestForm from './components/editor/InterestForm.vue'

// Aperçu
import ModernTemplate from './components/templates/ModernTemplate.vue'

const store = useCvStore()

// Sur mobile, un seul panneau à la fois (éditeur ou aperçu).
const view = ref('edit')
const tabs = [
  { id: 'edit', label: 'Éditer' },
  { id: 'preview', label: 'Aperçu' },
]

// Réduit la feuille A4 pour qu'elle tienne dans la zone d'aperçu.
const previewRef = ref(null)
const scale = usePreviewScale(previewRef)
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-slate-100 font-sans md:h-screen md:flex-row md:overflow-hidden print:block print:h-auto print:min-h-0 print:overflow-visible print:bg-white"
  >
    <!-- Onglets mobile -->
    <nav
      class="sticky top-0 z-20 flex border-b border-slate-200 bg-white md:hidden print:hidden"
      aria-label="Éditeur ou aperçu"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex-1 py-3 text-sm font-semibold transition"
        :class="
          view === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'
        "
        :aria-current="view === tab.id ? 'page' : undefined"
        @click="view = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- ============ PANNEAU ÉDITEUR (masqué à l'impression) ============ -->
    <aside
      class="w-full overflow-y-auto bg-white shadow-xl md:block md:w-1/2 md:border-r md:border-slate-200 print:hidden"
      :class="view === 'edit' ? 'block' : 'hidden'"
    >
      <div class="mx-auto max-w-xl space-y-8 p-6">
        <header class="space-y-3 border-b border-slate-100 pb-5">
          <div>
            <h1 class="flex items-center gap-2 text-2xl font-black text-slate-800">
              <span aria-hidden="true">⚡</span> Éditeur de CV
            </h1>
            <p class="mt-1 text-xs text-slate-500">
              Remplissez vos informations : votre CV se met à jour en temps réel.
            </p>
          </div>
          <ActionsBar />
        </header>

        <p
          v-if="store.storageError"
          role="alert"
          class="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800"
        >
          {{ store.storageError }}
        </p>

        <StylePicker />

        <div class="space-y-4 border-t border-slate-100 pt-6">
          <InfoProfile />
          <PhotoUpload />
        </div>

        <div v-if="store.setting.showExperience" class="border-t border-slate-100 pt-6">
          <ExperienceForm />
        </div>

        <div v-if="store.setting.showEducation" class="border-t border-slate-100 pt-6">
          <EducationForm />
        </div>

        <div v-if="store.setting.showProjects" class="border-t border-slate-100 pt-6">
          <ProjectsForm />
        </div>

        <div v-if="store.setting.showCertifications" class="border-t border-slate-100 pt-6">
          <CertificationsForm />
        </div>

        <div v-if="store.setting.showSkills" class="border-t border-slate-100 pt-6">
          <SkillsForm />
        </div>

        <div v-if="store.setting.showLanguages" class="border-t border-slate-100 pt-6">
          <LanguageForm />
        </div>

        <div v-if="store.setting.showInterests" class="border-t border-slate-100 pt-6">
          <InterestForm />
        </div>
      </div>
    </aside>

    <!-- ============ APERÇU TEMPS RÉEL / FEUILLE A4 ============ -->
    <main
      ref="previewRef"
      class="w-full items-start justify-center overflow-y-auto bg-slate-300 p-4 md:flex md:w-1/2 md:p-6 print:block print:w-full print:overflow-visible print:bg-white print:p-0"
      :class="view === 'preview' ? 'flex' : 'hidden'"
    >
      <div class="cv-paper shadow-2xl" :style="{ zoom: scale }">
        <ModernTemplate />
      </div>
    </main>
  </div>
</template>
