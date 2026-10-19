# Éditeur de CV

Application web (Vue 3, Pinia, Tailwind CSS 4) pour créer un CV, avec aperçu A4 en temps réel,
export PDF, sauvegarde automatique et import / export JSON.

## Démarrage

```bash
npm install
npm run dev      # développement : http://localhost:5173
npm test         # tests unitaires (Vitest)
npm run build    # production : dossier dist/
npm run preview  # test local du build
```

Node 20.19 ou plus récent.

## Structure

```
src/
├── main.js
├── App.vue                       # mise en page éditeur / aperçu, onglets mobiles
├── style.css                     # Tailwind, classes communes, règles d'impression A4
├── stores/useCvStore.js          # état, sauvegarde auto, import / export
├── utils/
│   ├── constants.js              # clés, limites, couleurs, sections
│   ├── normalize.js              # validation / migration des données (localStorage et import)
│   ├── format.js                 # dates, niveaux, permis
│   └── icons.js                  # icônes SVG de l'en-tête du CV
├── composables/
│   ├── useAccordion.js
│   └── usePreviewScale.js        # ajuste la feuille A4 à la largeur disponible
└── components/
    ├── ui/                       # ToggleSwitch, FormField, AccordionCard
    ├── editor/                   # un formulaire par rubrique + ActionsBar
    └── templates/                # ModernTemplate, TemplateSection
```

## Ce qui a changé par rapport à la version d'origine

- **Centres d'intérêt** : formulaire réécrit, sauvegarde/restauration corrigée, section ajoutée à l'aperçu.
- **Sanitisation supprimée** : elle transformait « Description » en « Deion » et affichait `&lt;` à l'écran.
  Vue échappe déjà tout ce qui passe par `{{ }}`. La sécurité repose maintenant sur une validation stricte
  à l'entrée (`normalize.js`) : types, longueurs, couleur hexadécimale, photo = data-URL JPEG/PNG/WEBP uniquement.
- **Migration automatique** des brouillons de l'ancienne version (`cv_builder_draft_v1`).
- **Dates** : champs « mois » partout, affichage « janv. 2022 – Présent », case « Poste actuel ».
- **Photo** : annuler le recadrage conserve la photo existante, recadrage circulaire, fond blanc pour les PNG
  transparents, bibliothèque chargée à la demande.
- **Accessibilité** : vrais `<button>`, `aria-expanded`, labels reliés aux champs, interrupteurs `role="switch"`.
- **Nouveautés** : réordonner les éléments (↑ ↓), saisie de plusieurs compétences séparées par des virgules,
  masquer des sections, export / import JSON, réinitialisation, onglets mobiles, aperçu adapté à l'écran,
  avertissement si le stockage du navigateur est plein.
- **Impression multi-pages** : marges répétées sur chaque page, blocs qui ne sont pas coupés en deux.
- `PhotoCroppeModal.vue` devient `PhotoCropModal.vue` (supprimez l'ancien fichier).

## Déploiement et montée en charge

L'application est **100 % côté navigateur** : les données de chaque visiteur restent dans son
`localStorage` et rien n'est envoyé à un serveur. Votre serveur ne fait que distribuer des fichiers
statiques (HTML, JS, CSS). Il n'y a ni connexion à maintenir, ni base de données, ni session : des
milliers de visiteurs simultanés ne posent pas de problème d'architecture, il suffit de bien servir ces fichiers.

Recommandé, par ordre de simplicité :

1. **Hébergement statique avec CDN** (Cloudflare Pages, Netlify, Vercel, GitHub Pages) : commande de build
   `npm run build`, dossier de sortie `dist`. Le fichier `public/_headers` (cache longue durée,
   en-têtes de sécurité, CSP) est reconnu par Cloudflare Pages et Netlify.
2. **Votre propre serveur** : `docker build -t cv-builder . && docker run -p 80:80 cv-builder`
   (nginx + compression + cache, voir `nginx.conf`). Placez un CDN (Cloudflare gratuit) devant.

À savoir :

- Les fichiers du dossier `assets/` ont un hash dans leur nom et sont mis en cache un an ; `index.html`
  est toujours revalidé, donc chaque mise en production est visible tout de suite.
- Si vous modifiez le code pour appeler un service externe (API, analytics, polices), adaptez la CSP
  (`connect-src`, `script-src`, `font-src`) dans `public/_headers` et `nginx.conf`.

### Comptes utilisateurs et sauvegarde en ligne

Si « se connecter » signifie avoir un compte pour retrouver son CV depuis plusieurs appareils, cela
demande un **back-end** (authentification + base de données), qui n'existe pas dans ce projet.
Dans ce cas, la voie la plus sûre pour tenir la charge est un service managé (Supabase, Firebase,
Appwrite) plutôt qu'un serveur à gérer soi-même. Le store est prêt pour cela : `exportJson()` et
`importJson()` fournissent déjà le format de données à stocker.
