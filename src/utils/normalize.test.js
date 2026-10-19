import { describe, expect, it } from 'vitest'
import { normalizeSnapshot, parseDraft } from './normalize'

describe('normalizeSnapshot', () => {
  it('renvoie un état complet à partir de rien', () => {
    const snap = normalizeSnapshot(undefined)
    expect(snap.experience).toEqual([])
    expect(snap.interests).toEqual([])
    expect(snap.setting.showInterests).toBe(true)
    expect(snap.profile.driverLicence).toEqual([])
  })

  it('rejette une photo qui n’est pas une image raster en data-URL', () => {
    const evil = normalizeSnapshot({ profile: { photo: 'javascript:alert(1)' } })
    const svg = normalizeSnapshot({ profile: { photo: 'data:image/svg+xml;base64,PHN2Zz4=' } })
    const ok = normalizeSnapshot({ profile: { photo: 'data:image/jpeg;base64,/9j/4AAQ' } })
    expect(evil.profile.photo).toBe('')
    expect(svg.profile.photo).toBe('')
    expect(ok.profile.photo).toBe('data:image/jpeg;base64,/9j/4AAQ')
  })

  it('borne les niveaux de langue et corrige les types', () => {
    const snap = normalizeSnapshot({
      languages: [{ name: 'Anglais', level: 999 }, { name: 'Fon', level: 'abc' }, { name: 'X', level: 3 }],
    })
    expect(snap.languages.map((l) => l.level)).toEqual([100, 50, 10])
  })

  it('génère des identifiants uniques même si le fichier en contient des doublons', () => {
    const snap = normalizeSnapshot({
      interests: [
        { id: 'a', name: 'Foot' },
        { id: 'a', name: 'Voyage' },
      ],
    })
    expect(new Set(snap.interests.map((i) => i.id)).size).toBe(2)
  })

  it('dédoublonne les compétences sans tenir compte de la casse', () => {
    const snap = normalizeSnapshot({ skills: ['Vue', 'vue', ' Python ', '', 42] })
    expect(snap.skills).toEqual(['Vue', 'Python'])
  })

  it('refuse une couleur invalide', () => {
    expect(normalizeSnapshot({ setting: { primaryColor: 'red; background:url(x)' } }).setting.primaryColor).toBe(
      '#2563eb',
    )
  })

  it('ne conserve que les permis connus', () => {
    const snap = normalizeSnapshot({ profile: { driverLicence: ['Permis B', 'Permis Z'] } })
    expect(snap.profile.driverLicence).toEqual(['Permis B'])
  })
})

describe('parseDraft', () => {
  it('lève une erreur lisible sur un JSON invalide', () => {
    expect(() => parseDraft('{pas du json')).toThrow(/JSON valide/)
  })

  it('lève une erreur sur un JSON qui n’est pas un CV', () => {
    expect(() => parseDraft('{"foo":1}')).toThrow(/ne ressemble pas/)
    expect(() => parseDraft('[]')).toThrow(/ne ressemble pas/)
  })

  it('migre l’ancien format en restaurant « < » et « > »', () => {
    const legacy = JSON.stringify({
      profile: { fullName: 'A &lt;b&gt; C' },
      interests: [{ id: 'x', name: 'Foot', detail: '' }],
    })
    const snap = parseDraft(legacy)
    expect(snap.profile.fullName).toBe('A <b> C')
    expect(snap.interests[0].name).toBe('Foot')
  })

  it('ne touche pas aux textes d’un fichier déjà en version 2', () => {
    const data = JSON.stringify({ version: 2, profile: { fullName: 'A &lt; B' } })
    expect(parseDraft(data).profile.fullName).toBe('A &lt; B')
  })
})
