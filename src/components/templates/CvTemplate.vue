<script setup>
// Gabarit unique du CV. Il lit le modèle choisi (utils/templates.js) et place les mêmes
// données différemment : en-tête, colonnes, police, style. Il ajuste aussi la taille du
// contenu pour remplir la feuille (composables/useAutoFit.js).
import { computed, ref } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import { getTemplate } from '../../utils/templates'
import { formatLicenses } from '../../utils/format'
import { ICONS } from '../../utils/icons'
import { useAutoFit } from '../../composables/useAutoFit'
import CvIdentity from './CvIdentity.vue'
import CvSection from './CvSection.vue'

const store = useCvStore()
const tpl = computed(() => getTemplate(store.setting.template))

/* ---------------- Couleurs ---------------- */
const accent = computed(() => store.setting.primaryColor || '#2563eb')

// Texte blanc ou noir selon la luminosité de la couleur choisie (lisibilité garantie).
const onAccent = computed(() => {
  const n = parseInt(accent.value.slice(1), 16)
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return luminance > 0.62 ? '#111827' : '#ffffff'
})

const toneColor = (tone) =>
  ({
    accent: accent.value,
    dark: '#1e293b',
    tint: `color-mix(in srgb, ${accent.value} 13%, #ffffff)`,
  })[tone] || '#ffffff'

/* ---------------- Données affichées ---------------- */
// On ne montre pas les cartes laissées entièrement vides, ni les sections désactivées.
const nonEmpty = (list, keys) => list.filter((it) => keys.some((k) => String(it[k] ?? '').trim()))

const cv = computed(() => {
  const s = store.setting
  return {
    summary: store.profile.summary.trim(),
    experience: s.showExperience ? nonEmpty(store.experience, ['position', 'company', 'description']) : [],
    education: s.showEducation ? nonEmpty(store.education, ['degree', 'school']) : [],
    projects: s.showProjects ? nonEmpty(store.projects, ['name', 'technologies', 'description']) : [],
    certifications: s.showCertifications ? nonEmpty(store.certifications, ['name', 'organization']) : [],
    skills: s.showSkills ? store.skills : [],
    languages: s.showLanguages ? nonEmpty(store.languages, ['name']) : [],
    interests: s.showInterests ? nonEmpty(store.interests, ['name']) : [],
  }
})
const has = (key) => (key === 'summary' ? !!cv.value.summary : cv.value[key].length > 0)

const identity = computed(() => {
  const p = store.profile
  const contacts = [
    { key: 'nationality', icon: ICONS.globe, text: p.nationality },
    { key: 'maritalStatus', icon: ICONS.user, text: p.maritalStatus },
    { key: 'email', icon: ICONS.mail, text: p.email },
    { key: 'phone', icon: ICONS.phone, text: p.phone },
    { key: 'location', icon: ICONS.pin, text: p.location },
    { key: 'licence', icon: ICONS.car, text: formatLicenses(p.driverLicence) },
  ].filter((c) => c.text && String(c.text).trim())

  return {
    name: p.fullName,
    job: p.jobTitle,
    photo: store.setting.showPhoto ? p.photo : '',
    shape: tpl.value.shape,
    contacts,
  }
})

/* ---------------- Mise en page ---------------- */
const edgeIndex = computed(() => tpl.value.columns.findIndex((c) => c.edge))
const hasEdge = computed(() => edgeIndex.value >= 0)

// La colonne colorée pleine hauteur est dessinée en fond de la feuille : elle se prolonge
// donc sur toutes les pages à l'impression.
const paperBackground = computed(() => {
  if (!hasEdge.value) return '#ffffff'
  const col = tpl.value.columns[edgeIndex.value]
  const dir = edgeIndex.value === 0 ? 'to right' : 'to left'
  return `linear-gradient(${dir}, ${toneColor(col.tone)} ${col.w}, #ffffff ${col.w})`
})

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: tpl.value.columns.map((c) => c.w).join(' '),
  columnGap: hasEdge.value ? '0' : '8mm',
}))

const colStyle = (c) => (hasEdge.value ? { padding: c.edge ? '0 6mm' : '0 10mm' } : {})

/* ---------------- Remplissage automatique de la page ---------------- */
const rootRef = ref(null)
const contentRef = ref(null)
const rulerRef = ref(null)

const fs = useAutoFit({
  rootRef,
  contentRef,
  rulerRef,
  source: () => [
    store.profile,
    store.setting,
    store.experience,
    store.education,
    store.skills,
    store.languages,
    store.projects,
    store.certifications,
    store.interests,
  ],
})

const rootStyle = computed(() => ({
  '--accent': accent.value,
  '--on-accent': onAccent.value,
  '--fs': fs.value,
  '--pad-x': hasEdge.value ? '0mm' : '14mm',
  background: paperBackground.value,
}))
</script>

<template>
  <div
    ref="rootRef"
    class="cv-paper cv-root"
    :class="[`font-${tpl.font}`, { dense: tpl.dense }]"
    :style="rootStyle"
  >
    <!-- Règle invisible = hauteur utile d'une page A4 (sert à mesurer le contenu) -->
    <div ref="rulerRef" class="cv-ruler" aria-hidden="true"></div>

    <!-- Le tableau (thead / tfoot) ne sert qu'à répéter des marges sur chaque page imprimée. -->
    <table class="cv-table">
      <thead>
        <tr><td class="cv-spacer"></td></tr>
      </thead>

      <tbody>
        <tr>
          <td>
            <div ref="contentRef" class="cv-content">
              <CvIdentity v-if="tpl.header" :variant="tpl.header" v-bind="identity" />

              <div :style="gridStyle">
                <div
                  v-for="(c, i) in tpl.columns"
                  :key="i"
                  class="cv-col"
                  :class="c.tone ? `tone-${c.tone}` : ''"
                  :style="colStyle(c)"
                >
                  <CvIdentity v-if="c.identity" variant="side" v-bind="identity" />
                  <CvIdentity v-if="c.title" variant="title" v-bind="identity" />

                  <template v-for="key in c.sections" :key="key">
                    <CvSection v-if="has(key)" :name="key" :cv="cv" :tpl="tpl" :narrow="!!c.narrow" />
                  </template>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr><td class="cv-spacer"></td></tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
/* Tout est en « em » : changer --fs agrandit ou réduit texte, photo et espacements ensemble. */
.cv-root {
  --ink: #1f2937;
  --body: #374151;
  --muted: #64748b;
  --rule: #d9dfeb;
  --hx: var(--accent);
  --name: var(--accent);
  --icon: var(--accent);
  --chip-bg: color-mix(in srgb, var(--accent) 12%, #ffffff);
  --chip-ink: var(--ink);
  --bar-bg: #e5e9f2;
  --bar-fill: var(--accent);
  --photo-border: var(--accent);
  font-size: calc(var(--fs, 13) * 1px);
  line-height: 1.45;
  color: var(--body);
  overflow-wrap: anywhere;
}
.dense {
  --sec-gap: 0.85em;
  --item-gap: 0.55em;
  line-height: 1.38;
}

/* Polices (installées avec le site, voir src/fonts.js) */
.font-jakarta {
  font-family: 'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif;
}
.font-lora {
  font-family: Lora, Georgia, 'Times New Roman', serif;
}
.font-poppins {
  font-family: Poppins, 'Segoe UI', system-ui, sans-serif;
}

.cv-table {
  width: 100%;
  border-collapse: collapse;
}
.cv-table td {
  padding: 0;
  vertical-align: top;
}
/* flow-root : le contenu mesuré inclut les marges de son dernier élément */
.cv-content {
  display: flow-root;
}
.cv-col {
  min-width: 0;
}
.cv-ruler {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 273mm;
  visibility: hidden;
  pointer-events: none;
}

/* Couleurs des colonnes colorées : le texte change de couleur pour rester lisible */
.tone-accent,
.tone-dark {
  --ink: var(--tone-on);
  --body: var(--tone-on);
  --muted: color-mix(in srgb, var(--tone-on) 82%, transparent);
  --rule: color-mix(in srgb, var(--tone-on) 35%, transparent);
  --hx: var(--tone-on);
  --name: var(--tone-on);
  --icon: var(--tone-on);
  --chip-bg: color-mix(in srgb, var(--tone-on) 18%, transparent);
  --chip-ink: var(--tone-on);
  --bar-bg: color-mix(in srgb, var(--tone-on) 28%, transparent);
  --bar-fill: var(--tone-on);
  --photo-border: var(--tone-on);
}
.tone-accent {
  --tone-on: var(--on-accent);
}
.tone-dark {
  --tone-on: #ffffff;
}
.tone-tint {
  --chip-bg: #ffffff;
}
</style>
