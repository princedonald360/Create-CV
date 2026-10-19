// Les 10 modèles de CV. Un modèle ne change JAMAIS les données : il décide seulement
// où chaque section est placée, la police, le style des titres et des éléments.
//
// Champs d'un modèle
//   font          'jakarta' | 'lora' | 'poppins'
//   header        'left' | 'center' | 'photoleft' | 'band' | null (l'identité est alors dans une colonne)
//   headingStyle  style des titres de section : 'rule' | 'bar' | 'pill' | 'caps' | 'center'
//   sideHeading   style des titres dans une colonne étroite (défaut 'caps')
//   itemStyle     expériences / formations : 'plain' | 'timeline' | 'datecol'
//   skillStyle    'chips' | 'inline'          langStyle  'bars' | 'text'
//   shape         forme de la photo : 'circle' | 'rounded'
//   dense         true = espacements réduits
//   columns       colonnes, de gauche à droite :
//     w         largeur CSS ('70mm', '1fr', '1.35fr')
//     tone      fond de la colonne : 'accent' | 'dark' | 'tint'
//     edge      true = la colonne colorée touche le bord de la feuille
//     narrow    true = colonne étroite (éléments empilés)
//     identity  true = photo et coordonnées en haut de la colonne
//     title     true = nom et poste en haut de la colonne
//     sections  sections affichées dans cette colonne

export const DEFAULT_TEMPLATE = 'modern'

export const SECTION_KEYS = [
  'summary',
  'experience',
  'education',
  'projects',
  'certifications',
  'skills',
  'languages',
  'interests',
]

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Moderne',
    hint: 'Une colonne, photo à droite',
    font: 'jakarta',
    header: 'left',
    headingStyle: 'rule',
    itemStyle: 'plain',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'circle',
    columns: [{ w: '1fr', sections: SECTION_KEYS }],
  },
  {
    id: 'sidebar',
    name: 'Latéral',
    hint: 'Colonne colorée à gauche',
    font: 'jakarta',
    header: null,
    headingStyle: 'bar',
    itemStyle: 'plain',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'circle',
    columns: [
      {
        w: '70mm',
        tone: 'accent',
        edge: true,
        narrow: true,
        identity: true,
        sections: ['skills', 'languages', 'interests', 'certifications'],
      },
      { w: '1fr', title: true, sections: ['summary', 'experience', 'education', 'projects'] },
    ],
  },
  {
    id: 'sidebar-right',
    name: 'Latéral droit',
    hint: 'Colonne claire à droite',
    font: 'poppins',
    header: null,
    headingStyle: 'pill',
    itemStyle: 'plain',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'rounded',
    columns: [
      { w: '1fr', title: true, sections: ['summary', 'experience', 'projects'] },
      {
        w: '68mm',
        tone: 'tint',
        edge: true,
        narrow: true,
        identity: true,
        sections: ['education', 'skills', 'languages', 'certifications', 'interests'],
      },
    ],
  },
  {
    id: 'band',
    name: 'Bandeau',
    hint: 'En-tête coloré, deux colonnes',
    font: 'jakarta',
    header: 'band',
    headingStyle: 'rule',
    itemStyle: 'plain',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'circle',
    columns: [
      { w: '1fr', sections: ['summary', 'experience', 'projects'] },
      {
        w: '60mm',
        narrow: true,
        sections: ['education', 'skills', 'languages', 'certifications', 'interests'],
      },
    ],
  },
  {
    id: 'classic',
    name: 'Classique',
    hint: 'Sobre, avec des dates à gauche',
    font: 'lora',
    header: 'center',
    headingStyle: 'center',
    itemStyle: 'datecol',
    skillStyle: 'inline',
    langStyle: 'text',
    shape: 'circle',
    columns: [{ w: '1fr', sections: SECTION_KEYS }],
  },
  {
    id: 'timeline',
    name: 'Chronologie',
    hint: 'Parcours sur une ligne du temps',
    font: 'poppins',
    header: 'left',
    headingStyle: 'bar',
    itemStyle: 'timeline',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'circle',
    columns: [
      { w: '1fr', sections: ['summary', 'experience', 'education', 'projects'] },
      { w: '58mm', narrow: true, sections: ['skills', 'languages', 'certifications', 'interests'] },
    ],
  },
  {
    id: 'compact',
    name: 'Compact',
    hint: 'Dense, pour beaucoup de contenu',
    font: 'jakarta',
    dense: true,
    header: 'left',
    headingStyle: 'caps',
    itemStyle: 'plain',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'circle',
    columns: [
      { w: '1.35fr', sections: ['summary', 'experience', 'projects'] },
      {
        w: '1fr',
        narrow: true,
        sections: ['education', 'certifications', 'skills', 'languages', 'interests'],
      },
    ],
  },
  {
    id: 'elegant',
    name: 'Élégant',
    hint: 'Police à empattements, colonne teintée',
    font: 'lora',
    header: null,
    headingStyle: 'rule',
    itemStyle: 'plain',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'circle',
    columns: [
      {
        w: '62mm',
        tone: 'tint',
        edge: true,
        narrow: true,
        identity: true,
        sections: ['skills', 'languages', 'interests', 'certifications'],
      },
      { w: '1fr', title: true, sections: ['summary', 'experience', 'education', 'projects'] },
    ],
  },
  {
    id: 'ink',
    name: 'Sombre',
    hint: 'Colonne foncée, titres en pastille',
    font: 'poppins',
    header: null,
    headingStyle: 'pill',
    itemStyle: 'plain',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'rounded',
    columns: [
      {
        w: '72mm',
        tone: 'dark',
        edge: true,
        narrow: true,
        identity: true,
        sections: ['education', 'skills', 'languages', 'interests'],
      },
      { w: '1fr', title: true, sections: ['summary', 'experience', 'projects', 'certifications'] },
    ],
  },
  {
    id: 'executive',
    name: 'Direction',
    hint: 'Grande photo, dates en colonne',
    font: 'jakarta',
    header: 'photoleft',
    headingStyle: 'caps',
    itemStyle: 'datecol',
    skillStyle: 'chips',
    langStyle: 'bars',
    shape: 'rounded',
    columns: [{ w: '1fr', sections: SECTION_KEYS }],
  },
]

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.id)

/** Renvoie le modèle demandé, ou le premier si l'identifiant est inconnu. */
export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
