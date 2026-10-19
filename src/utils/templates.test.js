import { describe, expect, it } from 'vitest'
import { SECTION_KEYS, TEMPLATES, TEMPLATE_IDS, getTemplate } from './templates'
import { normalizeSnapshot } from './normalize'

describe('modèles de CV', () => {
  it('propose 10 modèles aux identifiants uniques', () => {
    expect(TEMPLATES.length).toBe(10)
    expect(new Set(TEMPLATE_IDS).size).toBe(10)
  })

  it('place chaque section exactement une fois : aucune donnée ne disparaît', () => {
    for (const t of TEMPLATES) {
      const placed = t.columns.flatMap((c) => c.sections).sort()
      expect(placed).toEqual([...SECTION_KEYS].sort())
    }
  })

  it('renvoie le premier modèle si l’identifiant est inconnu', () => {
    expect(getTemplate('inconnu').id).toBe(TEMPLATES[0].id)
  })
})

describe('modèle sauvegardé', () => {
  it('utilise « modern » par défaut et ignore un modèle inconnu', () => {
    expect(normalizeSnapshot({}).setting.template).toBe('modern')
    expect(normalizeSnapshot({ setting: { template: 'xyz' } }).setting.template).toBe('modern')
  })

  it('conserve un modèle valide', () => {
    expect(normalizeSnapshot({ setting: { template: 'classic' } }).setting.template).toBe('classic')
  })
})
