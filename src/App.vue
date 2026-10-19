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
import CvTemplate from './components/templates/CvTemplate.vue'
import TemplatePicker from './components/editor/TemplatePicker.vue'

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
    class="flex min-h-screen flex-col bg-[var(--color-mist)] font-sans md:h-screen md:flex-row md:overflow-hidden print:block print:h-auto print:min-h-0 print:overflow-visible print:bg-white"
  >
    <!-- Onglets mobile -->
    <nav
      class="sticky top-0 z-20 flex gap-2 border-b border-[#c9d3ee] bg-white p-2 md:hidden print:hidden"
      aria-label="Éditeur ou aperçu"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex-1 rounded-full py-2 text-sm font-bold transition"
        :class="
          view === tab.id
            ? 'bg-[var(--color-cobalt)] text-white'
            : 'bg-[var(--color-mist)] text-[var(--color-ink)]'
        "
        :aria-current="view === tab.id ? 'page' : undefined"
        @click="view = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- ============ PANNEAU ÉDITEUR (masqué à l'impression) ============ -->
    <aside
      class="editor-pane w-full overflow-y-auto md:block md:w-1/2 print:hidden"
      :class="view === 'edit' ? 'block' : 'hidden'"
    >
      <div class="mx-auto max-w-xl space-y-5 p-4 sm:p-6">
        <header class="hero">
          <div class="relative z-10 flex items-center gap-3">
            <span class="hero-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="M14 3v5h5" />
                <path d="M9 13h6M9 17h4" />
              </svg>
            </span>
            <h1 class="hero-title">Éditeur de CV</h1>
          </div>
          <p class="hero-sub relative z-10">
            Votre CV se met à jour en direct pendant que vous écrivez. Vos données restent sur votre
            appareil.
          </p>
        </header>

        <!-- Actions : le jaune signale l'action principale -->
        <div class="panel-card" style="--tone: #fbbf24">
          <ActionsBar />
        </div>

        <p
          v-if="store.storageError"
          role="alert"
          class="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 text-xs font-medium text-amber-900"
        >
          {{ store.storageError }}
        </p>

        <div class="panel-card" style="--tone: #1d4ed8">
          <StylePicker />
        </div>

        <div class="panel-card space-y-4" style="--tone: #f43f5e">
          <InfoProfile />
          <PhotoUpload />
        </div>

        <div v-if="store.setting.showExperience" class="panel-card" style="--tone: #f59e0b">
          <ExperienceForm />
        </div>

        <div v-if="store.setting.showEducation" class="panel-card" style="--tone: #10b981">
          <EducationForm />
        </div>

        <div v-if="store.setting.showProjects" class="panel-card" style="--tone: #8b5cf6">
          <ProjectsForm />
        </div>

        <div v-if="store.setting.showCertifications" class="panel-card" style="--tone: #0891b2">
          <CertificationsForm />
        </div>

        <div v-if="store.setting.showSkills" class="panel-card" style="--tone: #ec4899">
          <SkillsForm />
        </div>

        <div v-if="store.setting.showLanguages" class="panel-card" style="--tone: #0ea5e9">
          <LanguageForm />
        </div>

        <div v-if="store.setting.showInterests" class="panel-card" style="--tone: #f97316">
          <InterestForm />
        </div>
      </div>
    </aside>

    <!-- ============ APERÇU TEMPS RÉEL / FEUILLE A4 ============ -->
    <main
      ref="previewRef"
      class="preview-pane w-full flex-col items-center gap-4 overflow-y-auto p-4 md:flex md:w-1/2 md:p-6 print:block print:w-full print:overflow-visible print:p-0"
      :class="view === 'preview' ? 'flex' : 'hidden'"
    >
      <!-- Bouton de choix du modèle (jamais imprimé) -->
      <div class="sticky top-0 z-10 print:hidden">
        <TemplatePicker />
      </div>

      <!-- La feuille A4 : CvTemplate est lui-même la feuille (fond, marges, colonnes) -->
      <CvTemplate class="shadow-2xl" :style="{ zoom: scale }" />
    </main>
  </div>
</template>
