import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { LEGACY_STORAGE_KEY, LIMITS, SCHEMA_VERSION, STORAGE_KEY } from '../utils/constants'
import {
  createId,
  defaultProfile,
  defaultSetting,
  normalizeSnapshot,
  parseDraft,
} from '../utils/normalize'

const SAVE_DELAY_MS = 400

const safeRead = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null // stockage indisponible (navigation privée stricte, cookies bloqués…)
  }
}

export const useCvStore = defineStore('cv', () => {
  /* ---------------------------------------------------------------- */
  /*  1. État                                                         */
  /* ---------------------------------------------------------------- */
  const setting = ref(defaultSetting())
  const profile = ref(defaultProfile())
  const experience = ref([])
  const education = ref([])
  const skills = ref([])
  const languages = ref([])
  const projects = ref([])
  const certifications = ref([])
  const interests = ref([])

  const storageError = ref('')
  const lastSavedAt = ref(null)

  // Listes réordonnables (utilisé par moveItem)
  const collections = { experience, education, languages, projects, certifications, interests }

  const applySnapshot = (snap) => {
    setting.value = snap.setting
    profile.value = snap.profile
    experience.value = snap.experience
    education.value = snap.education
    skills.value = snap.skills
    languages.value = snap.languages
    projects.value = snap.projects
    certifications.value = snap.certifications
    interests.value = snap.interests
  }

  const buildSnapshot = () => ({
    version: SCHEMA_VERSION,
    setting: setting.value,
    profile: profile.value,
    experience: experience.value,
    education: education.value,
    skills: skills.value,
    languages: languages.value,
    projects: projects.value,
    certifications: certifications.value,
    interests: interests.value,
  })

  /* ---------------------------------------------------------------- */
  /*  2. Restauration (v2, ou migration depuis la v1)                 */
  /* ---------------------------------------------------------------- */
  const hydrate = () => {
    const raw = safeRead(STORAGE_KEY) ?? safeRead(LEGACY_STORAGE_KEY)
    if (!raw) return
    try {
      applySnapshot(parseDraft(raw))
    } catch (e) {
      console.error('[CV Builder] Brouillon local illisible, démarrage à vide :', e)
    }
  }
  hydrate()

  /* ---------------------------------------------------------------- */
  /*  3. Sauvegarde automatique (debounce + vidage à la fermeture)    */
  /* ---------------------------------------------------------------- */
  let timer = null

  const writeNow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buildSnapshot()))
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      storageError.value = ''
      lastSavedAt.value = Date.now()
    } catch (e) {
      storageError.value =
        e && e.name === 'QuotaExceededError'
          ? "Espace de stockage du navigateur plein : vos dernières modifications ne sont pas sauvegardées. Exportez votre CV en JSON."
          : "Sauvegarde automatique impossible (navigation privée ou stockage désactivé). Exportez votre CV en JSON pour ne rien perdre."
    }
  }

  const schedulePersist = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      writeNow()
    }, SAVE_DELAY_MS)
  }

  const flush = () => {
    if (!timer) return
    clearTimeout(timer)
    timer = null
    writeNow()
  }

  watch(
    [setting, profile, experience, education, skills, languages, projects, certifications, interests],
    schedulePersist,
    { deep: true },
  )

  // Évite de perdre les 400 dernières ms si l'onglet se ferme.
  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush()
    })
  }

  /* ---------------------------------------------------------------- */
  /*  4. Actions                                                      */
  /* ---------------------------------------------------------------- */
  const addTo = (listRef, factory) => {
    if (listRef.value.length >= LIMITS.maxItems) return null
    const item = { id: createId(), ...factory() }
    listRef.value.push(item)
    return item.id
  }

  const removeFrom = (listRef, id) => {
    listRef.value = listRef.value.filter((item) => item.id !== id)
  }

  // Photo
  const setPhoto = (dataUrl) => {
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
      profile.value.photo = dataUrl
    }
  }
  const removePhoto = () => {
    profile.value.photo = ''
  }

  // Expériences
  const addExperience = () =>
    addTo(experience, () => ({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }))
  const removeExperience = (id) => removeFrom(experience, id)

  // Formations
  const addEducation = () =>
    addTo(education, () => ({ degree: '', school: '', startDate: '', endDate: '' }))
  const removeEducation = (id) => removeFrom(education, id)

  // Langues
  const addLanguage = () => addTo(languages, () => ({ name: '', level: 50 }))
  const removeLanguage = (id) => removeFrom(languages, id)

  // Projets
  const addProject = () => addTo(projects, () => ({ name: '', technologies: '', description: '' }))
  const removeProject = (id) => removeFrom(projects, id)

  // Certifications
  const addCertification = () =>
    addTo(certifications, () => ({ name: '', organization: '', year: '' }))
  const removeCertification = (id) => removeFrom(certifications, id)

  // Centres d'intérêt : renvoie l'id créé, ou null si le nom est vide / limite atteinte
  const addInterest = (name, detail = '') => {
    const cleanName = typeof name === 'string' ? name.trim().slice(0, LIMITS.short) : ''
    if (!cleanName) return null
    const cleanDetail = typeof detail === 'string' ? detail.trim().slice(0, LIMITS.medium) : ''
    return addTo(interests, () => ({ name: cleanName, detail: cleanDetail }))
  }
  const removeInterest = (id) => removeFrom(interests, id)

  // Compétences : renvoie true si ajoutée (non vide, non dupliquée, limite non atteinte)
  const addSkill = (name) => {
    const value = typeof name === 'string' ? name.trim().slice(0, LIMITS.skill) : ''
    if (!value || skills.value.length >= LIMITS.maxSkills) return false
    if (skills.value.some((s) => s.toLowerCase() === value.toLowerCase())) return false
    skills.value.push(value)
    return true
  }
  const removeSkill = (index) => {
    skills.value.splice(index, 1)
  }

  // Réordonner : delta = -1 (monter) ou +1 (descendre)
  const moveItem = (section, id, delta) => {
    const listRef = collections[section]
    if (!listRef) return
    const list = listRef.value
    const from = list.findIndex((item) => item.id === id)
    const to = from + delta
    if (from < 0 || to < 0 || to >= list.length) return
    const copy = [...list]
    ;[copy[from], copy[to]] = [copy[to], copy[from]]
    listRef.value = copy
  }

  // Réinitialisation, export et import
  const resetAll = () => {
    applySnapshot(normalizeSnapshot({}))
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    writeNow()
  }

  const exportJson = () => JSON.stringify(buildSnapshot(), null, 2)

  const importJson = (jsonText) => {
    if (typeof jsonText !== 'string' || jsonText.length > LIMITS.maxImportBytes) {
      return { ok: false, error: 'Fichier trop volumineux (2 Mo maximum).' }
    }
    try {
      applySnapshot(parseDraft(jsonText))
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Import impossible.' }
    }
  }

  return {
    // état
    setting,
    profile,
    experience,
    education,
    skills,
    languages,
    projects,
    certifications,
    interests,
    storageError,
    lastSavedAt,
    // actions
    setPhoto,
    removePhoto,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addLanguage,
    removeLanguage,
    addProject,
    removeProject,
    addCertification,
    removeCertification,
    addInterest,
    removeInterest,
    addSkill,
    removeSkill,
    moveItem,
    resetAll,
    exportJson,
    importJson,
  }
})
