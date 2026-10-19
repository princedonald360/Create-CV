export const STORAGE_KEY = 'cv_builder_draft_v2'
export const LEGACY_STORAGE_KEY = 'cv_builder_draft_v1'
export const SCHEMA_VERSION = 2

export const DEFAULT_COLOR = '#2563eb'

export const PRESET_COLORS = [
  '#2563eb',
  '#059669',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#1f2937',
]

export const LICENSES = ['Permis A', 'Permis B', 'Permis C', 'Permis D', 'Permis E']

/** Sections que l'utilisateur peut afficher / masquer sur son CV. */
export const SECTION_TOGGLES = [
  {
    key: 'showExperience',
    label: 'Expériences professionnelles',
    hint: 'À désactiver pour un profil junior ou étudiant',
  },
  { key: 'showEducation', label: 'Éducation & formations' },
  { key: 'showProjects', label: 'Projets & réalisations' },
  { key: 'showCertifications', label: 'Certifications' },
  { key: 'showSkills', label: 'Compétences clés' },
  { key: 'showLanguages', label: 'Langues' },
  { key: 'showInterests', label: "Centres d'intérêt" },
]

/** Limites de longueur : protègent le localStorage et la mise en page A4. */
export const LIMITS = {
  maxItems: 30,
  maxSkills: 40,
  name: 80,
  title: 100,
  email: 120,
  phone: 30,
  location: 100,
  short: 60,
  medium: 120,
  date: 10,
  summary: 600,
  description: 600,
  projectDescription: 500,
  skill: 40,
  maxPhotoChars: 600_000,
  maxImportBytes: 2_000_000,
}
