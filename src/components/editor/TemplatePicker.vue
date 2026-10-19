<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import { TEMPLATES, getTemplate } from '../../utils/templates'

const store = useCvStore()
const open = ref(false)
const current = computed(() => getTemplate(store.setting.template))

const choose = (id) => {
  store.setting.template = id // seule la mise en page change, jamais les données
  open.value = false
}

const onKeydown = (event) => {
  if (event.key === 'Escape') open.value = false
}
watch(open, (isOpen) => {
  if (isOpen) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

/* ---- Miniatures dessinées à partir de la configuration de chaque modèle ---- */
const TONES = { accent: '#1d4ed8', dark: '#1e293b', tint: '#dbe7ff' }

const hasEdge = (t) => t.columns.some((c) => c.edge)

// '70mm' -> part fixe de la largeur (210 mm) ; '1.35fr' -> part flexible
const colStyle = (c) => {
  const match = /^([\d.]+)(mm|fr)$/.exec(c.w)
  const value = match ? parseFloat(match[1]) : 1
  return {
    flex: match && match[2] === 'mm' ? `0 0 ${((value / 210) * 100).toFixed(1)}%` : `${value} 1 0`,
    background: TONES[c.tone] || 'transparent',
  }
}
const barsFor = (c) => Math.min(c.sections.length * 2, 9)
const isDark = (c) => c.tone === 'accent' || c.tone === 'dark'
</script>

<template>
  <button type="button" class="btn-accent" aria-haspopup="dialog" @click="open = true">
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
    Changer de modèle
    <span class="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold">{{ current.name }}</span>
  </button>

  <Teleport to="body">
    <div
      v-if="open"
      class="picker-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="picker-title"
      @click.self="open = false"
    >
      <div class="picker-box">
        <div class="picker-head">
          <div>
            <h2 id="picker-title" class="text-lg font-extrabold text-[var(--color-ink)]">Choisir un modèle</h2>
            <p class="text-xs text-slate-500">
              Vos informations ne changent pas : seule la mise en page change.
            </p>
          </div>
          <button type="button" class="btn-secondary" @click="open = false">Fermer</button>
        </div>

        <div class="picker-grid">
          <button
            v-for="t in TEMPLATES"
            :key="t.id"
            type="button"
            class="tpl-card"
            :aria-pressed="store.setting.template === t.id"
            @click="choose(t.id)"
          >
            <div class="thumb" :style="{ '--thumb-accent': store.setting.primaryColor }">
              <div v-if="t.header" class="th-head" :class="`th-${t.header}`">
                <span class="th-photo"></span>
                <span class="th-lines"><i></i><i></i></span>
              </div>
              <div class="th-cols" :class="{ pad: !hasEdge(t) }">
                <div v-for="(c, i) in t.columns" :key="i" class="th-col" :style="colStyle(c)">
                  <div v-if="c.identity" class="th-photo th-center-photo"></div>
                  <i v-if="c.title" class="th-name"></i>
                  <i v-for="n in barsFor(c)" :key="n" class="th-bar" :class="{ light: isDark(c) }"></i>
                </div>
              </div>
            </div>
            <span class="tpl-name">{{ t.name }}</span>
            <span class="tpl-hint">{{ t.hint }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.picker-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(23 37 84 / 0.6);
  backdrop-filter: blur(3px);
}
.picker-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 64rem;
  max-height: 92vh;
  border-radius: 1.25rem;
  background: var(--color-mist);
  box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.5);
}
.picker-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid #c9d3ee;
}
.picker-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.9rem;
  padding: 1.25rem;
  overflow-y: auto;
}
@media (min-width: 640px) {
  .picker-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 900px) {
  .picker-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.tpl-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.6rem;
  border: 2px solid #c9d3ee;
  border-radius: 0.9rem;
  background: #fff;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.tpl-card:hover {
  border-color: #1d4ed8;
}
.tpl-card[aria-pressed='true'] {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.28);
}
.tpl-name {
  margin-top: 0.3rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--color-ink);
}
.tpl-hint {
  font-size: 0.7rem;
  line-height: 1.3;
  color: #64748b;
}

/* Miniature d'une feuille A4 */
.thumb {
  display: flex;
  flex-direction: column;
  aspect-ratio: 210 / 297;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.35rem;
  background: #fff;
}
.th-head {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 6px 6px 4px;
}
.th-photo {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--thumb-accent);
}
.th-lines {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}
.th-lines i {
  height: 3px;
  border-radius: 2px;
  background: #475569;
}
.th-lines i + i {
  width: 60%;
  background: #cbd5e1;
}
.th-left,
.th-band {
  flex-direction: row-reverse;
}
.th-band {
  padding: 5px;
  border-radius: 4px;
  background: var(--thumb-accent);
}
.th-band .th-photo {
  background: #fff;
}
.th-band .th-lines i,
.th-band .th-lines i + i {
  background: rgb(255 255 255 / 0.85);
}
.th-center {
  flex-direction: column;
}
.th-center .th-lines {
  width: 70%;
  align-items: center;
}
.th-photoleft .th-photo {
  width: 19px;
  height: 19px;
  border-radius: 5px;
}

.th-cols {
  display: flex;
  flex: 1;
  gap: 4px;
}
.th-cols.pad {
  padding: 2px 6px 6px;
}
.th-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding: 6px 4px;
}
.th-cols.pad .th-col {
  padding: 2px 0;
}
.th-center-photo {
  align-self: center;
  margin-bottom: 3px;
  background: #fff;
  border: 2px solid #94a3b8;
}
.th-name {
  height: 5px;
  width: 70%;
  margin-bottom: 4px;
  border-radius: 2px;
  background: var(--thumb-accent);
}
.th-bar {
  display: block;
  height: 3px;
  border-radius: 2px;
  background: #cbd5e1;
}
.th-bar.light {
  background: rgb(255 255 255 / 0.7);
}
.th-bar:nth-child(3n + 1) {
  width: 55%;
  height: 4px;
  background: var(--thumb-accent);
}
.th-bar.light:nth-child(3n + 1) {
  background: #fff;
}

@media print {
  .picker-overlay {
    display: none;
  }
}
</style>
