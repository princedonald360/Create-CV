import { describe, expect, it } from 'vitest'
import { formatLicenses, formatMonth, formatPeriod, getLevelLabel, slugify } from './format'

describe('formatMonth', () => {
  it('formate un mois au format input type="month"', () => {
    expect(formatMonth('2022-01')).toBe('janv. 2022')
    expect(formatMonth('2023-12')).toBe('déc. 2023')
  })

  it('accepte les anciennes dates complètes', () => {
    expect(formatMonth('2022-03-15')).toBe('mars 2022')
  })

  it('laisse intactes les saisies libres et gère les valeurs invalides', () => {
    expect(formatMonth('Janvier 2022')).toBe('Janvier 2022')
    expect(formatMonth('2022-13')).toBe('2022-13')
    expect(formatMonth(undefined)).toBe('')
  })
})

describe('formatPeriod', () => {
  it('construit une période complète', () => {
    expect(formatPeriod('2022-01', '2023-03')).toBe('janv. 2022 – mars 2023')
  })

  it('affiche « Présent » pour un poste actuel', () => {
    expect(formatPeriod('2022-01', '2099-01', true)).toBe('janv. 2022 – Présent')
  })

  it("n'affiche qu'une borne si l'autre est vide", () => {
    expect(formatPeriod('2022-01', '')).toBe('janv. 2022')
    expect(formatPeriod('', '2023-03')).toBe('mars 2023')
    expect(formatPeriod('', '')).toBe('')
  })
})

describe('getLevelLabel', () => {
  it('traduit le niveau en libellé', () => {
    expect(getLevelLabel(30)).toBe('Notions')
    expect(getLevelLabel(50)).toBe('Intermédiaire')
    expect(getLevelLabel(80)).toBe('Courant')
    expect(getLevelLabel(100)).toBe('Maternelle / Officielle')
  })
})

describe('formatLicenses', () => {
  it('trie et regroupe les permis', () => {
    expect(formatLicenses(['Permis B', 'Permis A'])).toBe('Permis A, B')
  })

  it('renvoie une chaîne vide sans permis', () => {
    expect(formatLicenses([])).toBe('')
    expect(formatLicenses(undefined)).toBe('')
  })
})

describe('slugify', () => {
  it('produit un nom de fichier propre', () => {
    expect(slugify('Alexandre Évrard-Martin')).toBe('alexandre-evrard-martin')
    expect(slugify('')).toBe('')
  })
})
