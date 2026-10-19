<script setup>
import { computed } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import { formatLicenses, formatPeriod, getLevelLabel } from '../../utils/format'
import { ICONS } from '../../utils/icons'
import TemplateSection from './TemplateSection.vue'

const store = useCvStore()
const accent = computed(() => store.setting.primaryColor || '#2563eb')

// On n'affiche pas les cartes laissées entièrement vides par l'utilisateur.
const nonEmpty = (list, keys) => list.filter((item) => keys.some((k) => String(item[k] ?? '').trim()))

const contacts = computed(() => {
  const p = store.profile
  const licenses = formatLicenses(p.driverLicence)
  return [
    { key: 'nationality', icon: ICONS.globe, text: p.nationality },
    { key: 'maritalStatus', icon: ICONS.user, text: p.maritalStatus },
    { key: 'email', icon: ICONS.mail, text: p.email },
    { key: 'phone', icon: ICONS.phone, text: p.phone },
    { key: 'location', icon: ICONS.pin, text: p.location },
    { key: 'licence', icon: ICONS.car, text: licenses },
  ].filter((c) => c.text && String(c.text).trim())
})

const showPhoto = computed(() => store.setting.showPhoto && !!store.profile.photo)
const summary = computed(() => store.profile.summary.trim())

const experiences = computed(() =>
  store.setting.showExperience
    ? nonEmpty(store.experience, ['position', 'company', 'description'])
    : [],
)
const educations = computed(() =>
  store.setting.showEducation ? nonEmpty(store.education, ['degree', 'school']) : [],
)
const projects = computed(() =>
  store.setting.showProjects ? nonEmpty(store.projects, ['name', 'technologies', 'description']) : [],
)
const certifications = computed(() =>
  store.setting.showCertifications ? nonEmpty(store.certifications, ['name', 'organization']) : [],
)
const skills = computed(() => (store.setting.showSkills ? store.skills : []))
const languages = computed(() =>
  store.setting.showLanguages ? nonEmpty(store.languages, ['name']) : [],
)
const interests = computed(() =>
  store.setting.showInterests ? nonEmpty(store.interests, ['name']) : [],
)

// Certifications et compétences se partagent la largeur quand les deux existent.
const sideBySide = computed(() => certifications.value.length > 0 && skills.value.length > 0)
</script>

<template>
  <!-- Le tableau (thead / tfoot) ne sert qu'à répéter des marges sur chaque page imprimée. -->
  <table class="w-full border-collapse font-sans text-sm leading-relaxed text-slate-800">
    <thead><tr><td class="cv-spacer"></td></tr></thead>

    <tbody>
      <tr>
        <td class="break-words align-top">
          <!-- EN-TÊTE -->
          <header
            class="mb-6 flex items-center justify-between gap-6 border-b-2 pb-4"
            :style="{ borderColor: accent }"
          >
            <div class="min-w-0 flex-1">
              <h1
                class="mb-1 break-words text-3xl font-extrabold uppercase tracking-tight"
                :style="{ color: accent }"
              >
                {{ store.profile.fullName || 'Votre Nom' }}
              </h1>

              <p class="mb-3 text-lg font-medium text-slate-600">
                {{ store.profile.jobTitle || 'Titre du poste recherché' }}
              </p>

              <ul v-if="contacts.length" class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <li v-for="c in contacts" :key="c.key" class="inline-flex items-center gap-1.5">
                  <svg
                    class="h-3 w-3 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    :stroke="accent"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path v-for="(d, i) in c.icon" :key="i" :d="d" />
                  </svg>
                  <span>{{ c.text }}</span>
                </li>
              </ul>
            </div>

            <div
              v-if="showPhoto"
              class="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 shadow-sm"
              :style="{ borderColor: accent }"
            >
              <img :src="store.profile.photo" alt="Photo de profil" class="h-full w-full object-cover" />
            </div>
          </header>

          <!-- PROFIL -->
          <TemplateSection v-if="summary" title="Profil professionnel" :accent="accent">
            <p class="whitespace-pre-line text-xs leading-normal text-slate-700">{{ summary }}</p>
          </TemplateSection>

          <!-- EXPÉRIENCES -->
          <TemplateSection v-if="experiences.length" title="Expériences professionnelles" :accent="accent">
            <div class="space-y-4">
              <article
                v-for="exp in experiences"
                :key="exp.id"
                class="break-inside-avoid border-l-2 pl-3"
                :style="{ borderColor: accent }"
              >
                <div class="mb-1 flex items-baseline justify-between gap-2">
                  <h3 class="text-sm font-bold leading-tight text-slate-800">{{ exp.position }}</h3>
                  <span class="shrink-0 whitespace-nowrap text-[11px] font-medium" :style="{ color: accent }">
                    {{ formatPeriod(exp.startDate, exp.endDate, exp.current) }}
                  </span>
                </div>
                <div v-if="exp.company" class="mb-1 text-xs font-semibold text-slate-700">{{ exp.company }}</div>
                <p v-if="exp.description" class="mt-1 whitespace-pre-line text-xs leading-normal text-slate-600">
                  {{ exp.description }}
                </p>
              </article>
            </div>
          </TemplateSection>

          <!-- FORMATIONS -->
          <TemplateSection v-if="educations.length" title="Éducation & formations" :accent="accent">
            <div class="space-y-4">
              <article
                v-for="edu in educations"
                :key="edu.id"
                class="break-inside-avoid border-l-2 pl-3"
                :style="{ borderColor: accent }"
              >
                <div class="mb-1 flex items-baseline justify-between gap-2">
                  <h3 class="text-sm font-bold leading-tight text-slate-800">{{ edu.degree }}</h3>
                  <span class="shrink-0 whitespace-nowrap text-[11px] font-medium" :style="{ color: accent }">
                    {{ formatPeriod(edu.startDate, edu.endDate) }}
                  </span>
                </div>
                <div v-if="edu.school" class="text-xs font-semibold text-slate-700">{{ edu.school }}</div>
              </article>
            </div>
          </TemplateSection>

          <!-- PROJETS -->
          <TemplateSection v-if="projects.length" title="Projets & réalisations" :accent="accent">
            <div class="space-y-3">
              <article
                v-for="proj in projects"
                :key="proj.id"
                class="break-inside-avoid border-l-2 pl-3"
                :style="{ borderColor: accent }"
              >
                <h3 class="text-sm font-bold text-slate-800">{{ proj.name }}</h3>
                <div v-if="proj.technologies" class="mb-1 text-[11px] font-medium text-slate-500">
                  Technologies : {{ proj.technologies }}
                </div>
                <p v-if="proj.description" class="whitespace-pre-line text-xs leading-normal text-slate-600">
                  {{ proj.description }}
                </p>
              </article>
            </div>
          </TemplateSection>

          <!-- CERTIFICATIONS + COMPÉTENCES -->
          <div v-if="certifications.length || skills.length" :class="sideBySide ? 'grid grid-cols-2 gap-6' : ''">
            <TemplateSection v-if="certifications.length" title="Certifications" :accent="accent">
              <div class="space-y-2">
                <div v-for="cert in certifications" :key="cert.id" class="break-inside-avoid">
                  <div class="text-xs font-bold text-slate-800">{{ cert.name }}</div>
                  <div class="text-[11px] text-slate-500">
                    {{ cert.organization }}<span v-if="cert.year"> ({{ cert.year }})</span>
                  </div>
                </div>
              </div>
            </TemplateSection>

            <TemplateSection v-if="skills.length" title="Compétences clés" :accent="accent">
              <ul class="flex flex-wrap gap-1.5">
                <li
                  v-for="skill in skills"
                  :key="skill"
                  class="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                >
                  {{ skill }}
                </li>
              </ul>
            </TemplateSection>
          </div>

          <!-- LANGUES -->
          <TemplateSection v-if="languages.length" title="Langues" :accent="accent">
            <div class="grid grid-cols-2 gap-x-10 gap-y-4">
              <div v-for="lang in languages" :key="lang.id" class="break-inside-avoid space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-800">{{ lang.name }}</span>
                  <span class="text-[11px] font-medium text-slate-500">{{ getLevelLabel(lang.level) }}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full"
                    :style="{ width: `${lang.level}%`, backgroundColor: accent }"
                  ></div>
                </div>
              </div>
            </div>
          </TemplateSection>

          <!-- CENTRES D'INTÉRÊT -->
          <TemplateSection v-if="interests.length" title="Centres d'intérêt" :accent="accent">
            <ul class="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-700">
              <li v-for="item in interests" :key="item.id" class="break-inside-avoid">
                <strong class="font-bold text-slate-800">{{ item.name }}</strong
                ><span v-if="item.detail" class="text-slate-600"> : {{ item.detail }}</span>
              </li>
            </ul>
          </TemplateSection>
        </td>
      </tr>
    </tbody>

    <tfoot><tr><td class="cv-spacer"></td></tr></tfoot>
  </table>
</template>
