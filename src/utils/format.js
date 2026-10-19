const MONTHS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
]

// Accepte « 2022-01 » (input type="month") et « 2022-01-15 » (anciennes données).
const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])(?:-\d{2})?$/

/** « 2022-01 » → « janv. 2022 ». Les anciennes saisies libres sont renvoyées telles quelles. */
export const formatMonth = (value) => {
  if (typeof value !== 'string') return ''
  const v = value.trim()
  const match = MONTH_RE.exec(v)
  return match ? `${MONTHS[Number(match[2]) - 1]} ${match[1]}` : v
}

/** Construit « janv. 2022 – Présent » à partir des champs d'une expérience ou d'une formation. */
export const formatPeriod = (start, end, current = false) => {
  const from = formatMonth(start)
  const to = current ? 'Présent' : formatMonth(end)
  if (from && to) return `${from} – ${to}`
  return from || to
}

export const getLevelLabel = (level) => {
  if (level <= 40) return 'Notions'
  if (level <= 60) return 'Intermédiaire'
  if (level <= 80) return 'Courant'
  return 'Maternelle / Officielle'
}

/** ['Permis B', 'Permis A'] → « Permis A, B » */
export const formatLicenses = (licenses) => {
  if (!Array.isArray(licenses) || licenses.length === 0) return ''
  const letters = licenses
    .map((item) => String(item).replace(/^Permis\s*/i, '').trim())
    .filter(Boolean)
    .sort()
  return letters.length ? `Permis ${letters.join(', ')}` : ''
}

/** Pour les noms de fichiers : « Alexandre Martin » → « alexandre-martin ». */
export const slugify = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
