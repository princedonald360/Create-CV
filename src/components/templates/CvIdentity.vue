<script setup>
// Bloc « identité » du CV : photo, nom, poste, coordonnées.
// Selon le modèle, il apparaît en en-tête ou dans une colonne latérale.
//   variant : left | center | photoleft | band (en-têtes)
//             side  (colonne latérale : photo + coordonnées)
//             title (nom + poste seulement)
defineProps({
  variant: { type: String, default: 'left' },
  name: { type: String, default: '' },
  job: { type: String, default: '' },
  photo: { type: String, default: '' },
  shape: { type: String, default: 'circle' },
  contacts: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="id" :class="`id-${variant}`">
    <div v-if="photo && variant !== 'title'" class="photo" :class="`ph-${shape}`">
      <img :src="photo" alt="Photo de profil" />
    </div>

    <div class="who">
      <template v-if="variant !== 'side'">
        <h1 class="name">{{ name || 'Votre Nom' }}</h1>
        <p class="job">{{ job || 'Titre du poste recherché' }}</p>
      </template>

      <ul v-if="variant !== 'title' && contacts.length" class="contacts">
        <li v-for="c in contacts" :key="c.key">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path v-for="(d, i) in c.icon" :key="i" :d="d" />
          </svg>
          <span>{{ c.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.id {
  --ph: 9.5em;
}

.photo {
  flex-shrink: 0;
  width: var(--ph);
  height: var(--ph);
  overflow: hidden;
  border: 0.18em solid var(--photo-border);
  background: #e2e8f0;
}
.photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ph-circle {
  border-radius: 50%;
}
.ph-rounded {
  border-radius: 1.3em;
}

.name {
  font-size: 2.35em;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--name);
  overflow-wrap: anywhere;
}
.job {
  margin-top: 0.2em;
  font-size: 1.2em;
  font-weight: 500;
  color: var(--muted);
}

.contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em 1.2em;
  margin-top: 0.8em;
  font-size: 0.9em;
  color: var(--muted);
}
.contacts li {
  display: flex;
  align-items: center;
  gap: 0.45em;
  min-width: 0;
}
.contacts svg {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  color: var(--icon);
}
.contacts span {
  overflow-wrap: anywhere;
}

/* ---- Moderne : photo à droite ---- */
.id-left {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6em;
  margin-bottom: 1.4em;
  padding-bottom: 1.1em;
  border-bottom: 0.2em solid var(--accent);
}
.id-left .photo {
  order: 2;
}
.id-left .who {
  min-width: 0;
  flex: 1;
}

/* ---- Classique : tout centré ---- */
.id-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
  margin-bottom: 1.3em;
  padding-bottom: 1em;
  border-bottom: 0.09em solid var(--rule);
  text-align: center;
}
.id-center .contacts {
  justify-content: center;
}

/* ---- Direction : grande photo à gauche ---- */
.id-photoleft {
  --ph: 10.5em;
  display: flex;
  align-items: center;
  gap: 1.7em;
  margin-bottom: 1.4em;
  padding-bottom: 1.1em;
  border-bottom: 0.25em solid var(--accent);
}
.id-photoleft .who {
  min-width: 0;
  flex: 1;
}

/* ---- Bandeau : bloc coloré ---- */
.id-band {
  --ph: 9em;
  --muted: color-mix(in srgb, var(--on-accent) 85%, transparent);
  --icon: var(--on-accent);
  --name: var(--on-accent);
  --photo-border: var(--on-accent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6em;
  margin-bottom: 1.5em;
  padding: 1.4em 1.7em;
  border-radius: 1em;
  background: var(--accent);
  color: var(--on-accent);
}
.id-band .photo {
  order: 2;
}
.id-band .who {
  min-width: 0;
  flex: 1;
}

/* ---- Colonne latérale : photo puis coordonnées empilées ---- */
.id-side {
  --ph: 11.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1em;
  margin-bottom: 1.5em;
}
.id-side .who {
  width: 100%;
}
.id-side .contacts {
  flex-direction: column;
  gap: 0.6em;
  margin-top: 0;
}

/* ---- Nom seul, en haut de la colonne principale ---- */
.id-title {
  margin-bottom: 1.4em;
}
.id-title .name {
  font-size: 2.2em;
}
.id-title .job {
  color: var(--accent);
  font-weight: 600;
}
</style>
