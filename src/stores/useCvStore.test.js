import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useCvStore } from './useCvStore'
import { LEGACY_STORAGE_KEY, SCHEMA_VERSION, STORAGE_KEY } from '../utils/constants'

const freshStore = () => {
  setActivePinia(createPinia())
  return useCvStore()
}

beforeEach(() => {
  localStorage.clear()
  vi.useRealTimers()
})

describe('centres d’intérêt', () => {
  it('refuse un nom vide et nettoie les espaces', () => {
    const store = freshStore()
    expect(store.addInterest('   ')).toBeNull()
    expect(store.interests).toHaveLength(0)

    const id = store.addInterest('  Football ', ' esprit d’équipe ')
    expect(id).toBeTruthy()
    expect(store.interests[0]).toMatchObject({ name: 'Football', detail: 'esprit d’équipe' })

    store.removeInterest(id)
    expect(store.interests).toHaveLength(0)
  })
})

describe('compétences', () => {
  it('dédoublonne sans tenir compte de la casse', () => {
    const store = freshStore()
    expect(store.addSkill('Vue.js')).toBe(true)
    expect(store.addSkill('vue.js')).toBe(false)
    expect(store.addSkill('   ')).toBe(false)
    expect(store.skills).toEqual(['Vue.js'])
  })
})

describe('réordonnancement', () => {
  it('monte et descend un élément, en respectant les bornes', () => {
    const store = freshStore()
    const a = store.addExperience()
    const b = store.addExperience()
    store.moveItem('experience', b, -1)
    expect(store.experience.map((e) => e.id)).toEqual([b, a])
    store.moveItem('experience', b, -1) // déjà en tête : sans effet
    expect(store.experience.map((e) => e.id)).toEqual([b, a])
  })
})

describe('persistance', () => {
  it('sauvegarde après le délai de debounce', async () => {
    vi.useFakeTimers()
    const store = freshStore()
    store.profile.fullName = 'Alexandre'
    await nextTick()
    vi.advanceTimersByTime(500)
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(saved.version).toBe(SCHEMA_VERSION)
    expect(saved.profile.fullName).toBe('Alexandre')
  })

  it('restaure les données, y compris les centres d’intérêt', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        interests: [{ id: 'i1', name: 'Voyage', detail: '' }],
        profile: { fullName: 'Awa' },
      }),
    )
    const store = freshStore()
    expect(store.profile.fullName).toBe('Awa')
    expect(store.interests).toHaveLength(1)
  })

  it('migre le brouillon de l’ancienne version', () => {
    localStorage.setItem(
      LEGACY_STORAGE_KEY,
      JSON.stringify({ profile: { fullName: 'Awa &lt;3' }, skills: ['Vue'] }),
    )
    const store = freshStore()
    expect(store.profile.fullName).toBe('Awa <3')
    expect(store.skills).toEqual(['Vue'])
  })

  it('démarre à vide si le brouillon est corrompu', () => {
    localStorage.setItem(STORAGE_KEY, '{corrompu')
    const store = freshStore()
    expect(store.experience).toEqual([])
  })
})

describe('import / export / réinitialisation', () => {
  it('fait un aller-retour export → import', () => {
    const a = freshStore()
    a.profile.fullName = 'Awa Koné'
    a.addSkill('Python')
    const json = a.exportJson()

    const b = freshStore()
    expect(b.importJson(json)).toEqual({ ok: true })
    expect(b.profile.fullName).toBe('Awa Koné')
    expect(b.skills).toEqual(['Python'])
  })

  it('rejette un fichier invalide sans modifier l’état', () => {
    const store = freshStore()
    store.profile.fullName = 'Awa'
    const result = store.importJson('pas du json')
    expect(result.ok).toBe(false)
    expect(store.profile.fullName).toBe('Awa')
  })

  it('réinitialise tout', () => {
    const store = freshStore()
    store.profile.fullName = 'Awa'
    store.addExperience()
    store.resetAll()
    expect(store.profile.fullName).toBe('')
    expect(store.experience).toEqual([])
  })
})
