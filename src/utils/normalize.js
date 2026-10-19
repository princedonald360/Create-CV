import { DEFAULT_COLOR, LICENSES, LIMITS } from './constants'

/* ------------------------------------------------------------------ */
/*  Valeurs par défaut                                                */
/* ------------------------------------------------------------------ */

export const createId = () => {
  const c = globalThis.crypto
  // randomUUID n'existe qu'en contexte sécurisé (HTTPS / localhost) : on prévoit un repli.
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const defaultSetting = () => ({
  primaryColor: DEFAULT_COLOR,
  showPhoto: true,
  showExperience: true,
  showEducation: true,
  showSkills: true,
  showLanguages: true,
  showProjects: true,
  showCertifications: true,
  showInterests: true,
})

export const defaultProfile = () => ({
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  nationality: '',
  maritalStatus: '',
  driverLicence: [],
  photo: '',
  summary: '',
})

/* ------------------------------------------------------------------ */
/*  Briques de validation                                             */
/* ------------------------------------------------------------------ */

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const text = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '')
const bool = (v, fallback) => (typeof v === 'boolean' ? v : fallback)

const idOf = (x) =>
  typeof x.id === 'string' && x.id.length > 0 && x.id.length <= 64 ? x.id : createId()

const items = (value, mapItem) =>
  Array.isArray(value) ? value.filter(isObject).slice(0, LIMITS.maxItems).map(mapItem) : []

/** Garantit des identifiants uniques (clés v-for) même dans un fichier importé trafiqué. */
const uniqueIds = (list) => {
  const seen = new Set()
  return list.map((item) => {
    if (seen.has(item.id)) item.id = createId()
    seen.add(item.id)
    return item
  })
}

const level = (n) => {
  const v = Number(n)
  if (!Number.isFinite(v)) return 50
  return Math.min(100, Math.max(10, Math.round(v / 10) * 10))
}

/* ------------------------------------------------------------------ */
/*  Normalisation de chaque bloc                                      */
/* ------------------------------------------------------------------ */

const normalizeSetting = (raw) => {
  const base = defaultSetting()
  if (!isObject(raw)) return base
  const out = { ...base }
  for (const key of Object.keys(base)) {
    if (key !== 'primaryColor') out[key] = bool(raw[key], base[key])
  }
  if (typeof raw.primaryColor === 'string' && /^#[0-9a-f]{6}$/i.test(raw.primaryColor)) {
    out.primaryColor = raw.primaryColor
  }
  return out
}

const normalizeProfile = (raw) => {
  const base = defaultProfile()
  if (!isObject(raw)) return base

  // Seules les images en data-URL raster et de taille raisonnable sont acceptées.
  const photo =
    typeof raw.photo === 'string' &&
    /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(raw.photo) &&
    raw.photo.length <= LIMITS.maxPhotoChars
      ? raw.photo
      : ''

  return {
    fullName: text(raw.fullName, LIMITS.name),
    jobTitle: text(raw.jobTitle, LIMITS.title),
    email: text(raw.email, LIMITS.email),
    phone: text(raw.phone, LIMITS.phone),
    location: text(raw.location, LIMITS.location),
    nationality: text(raw.nationality, LIMITS.short),
    maritalStatus: text(raw.maritalStatus, LIMITS.short),
    driverLicence: Array.isArray(raw.driverLicence)
      ? LICENSES.filter((l) => raw.driverLicence.includes(l))
      : [],
    photo,
    summary: text(raw.summary, LIMITS.summary),
  }
}

const mapExperience = (x) => ({
  id: idOf(x),
  position: text(x.position, LIMITS.medium),
  company: text(x.company, LIMITS.medium),
  startDate: text(x.startDate, LIMITS.date),
  endDate: text(x.endDate, LIMITS.date),
  current: x.current === true,
  description: text(x.description, LIMITS.description),
})

const mapEducation = (x) => ({
  id: idOf(x),
  degree: text(x.degree, LIMITS.medium),
  school: text(x.school, LIMITS.medium),
  startDate: text(x.startDate, LIMITS.date),
  endDate: text(x.endDate, LIMITS.date),
})

const mapLanguage = (x) => ({
  id: idOf(x),
  name: text(x.name, LIMITS.short),
  level: level(x.level),
})

const mapProject = (x) => ({
  id: idOf(x),
  name: text(x.name, LIMITS.medium),
  technologies: text(x.technologies, LIMITS.medium),
  description: text(x.description, LIMITS.projectDescription),
})

const mapCertification = (x) => ({
  id: idOf(x),
  name: text(x.name, LIMITS.medium),
  organization: text(x.organization, LIMITS.medium),
  year: text(x.year, 10),
})

const mapInterest = (x) => ({
  id: idOf(x),
  name: text(x.name, LIMITS.short),
  detail: text(x.detail, LIMITS.medium),
})

const normalizeSkills = (raw) => {
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  const out = []
  for (const entry of raw) {
    const value = typeof entry === 'string' ? entry.trim().slice(0, LIMITS.skill) : ''
    const key = value.toLowerCase()
    if (value && !seen.has(key)) {
      seen.add(key)
      out.push(value)
    }
    if (out.length >= LIMITS.maxSkills) break
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  API publique                                                      */
/* ------------------------------------------------------------------ */

/** Transforme n'importe quelle donnée (localStorage, import) en un état valide et borné. */
export const normalizeSnapshot = (raw) => {
  const src = isObject(raw) ? raw : {}
  return {
    setting: normalizeSetting(src.setting),
    profile: normalizeProfile(src.profile),
    experience: uniqueIds(items(src.experience, mapExperience)),
    education: uniqueIds(items(src.education, mapEducation)),
    skills: normalizeSkills(src.skills),
    languages: uniqueIds(items(src.languages, mapLanguage)),
    projects: uniqueIds(items(src.projects, mapProject)),
    certifications: uniqueIds(items(src.certifications, mapCertification)),
    interests: uniqueIds(items(src.interests, mapInterest)),
  }
}

const KNOWN_KEYS = [
  'setting',
  'profile',
  'experience',
  'education',
  'skills',
  'languages',
  'projects',
  'certifications',
  'interests',
]

// L'ancienne version échappait « < » et « > » avant sauvegarde : on les restaure,
// sinon l'utilisateur verrait « &lt; » à l'écran.
const decodeLegacy = (v) => {
  if (typeof v === 'string') return v.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  if (Array.isArray(v)) return v.map(decodeLegacy)
  if (isObject(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, decodeLegacy(x)]))
  return v
}

/** Lit un JSON (brouillon sauvegardé ou fichier importé). Lève une Error au message lisible. */
export const parseDraft = (jsonText) => {
  let data
  try {
    data = JSON.parse(jsonText)
  } catch {
    throw new Error("Le fichier n'est pas un JSON valide.")
  }
  if (!isObject(data) || !KNOWN_KEYS.some((k) => k in data)) {
    throw new Error('Ce fichier ne ressemble pas à un CV exporté depuis cet éditeur.')
  }
  const migrated = typeof data.version === 'number' ? data : decodeLegacy(data)
  return normalizeSnapshot(migrated)
}
