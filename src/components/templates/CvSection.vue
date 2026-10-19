<script setup>
// Une section du CV (profil, expériences, formations…). Le même composant sert à tous
// les modèles : le style des titres et des éléments vient de la configuration du modèle.
import { computed } from 'vue'
import { formatPeriod, getLevelLabel } from '../../utils/format'

const props = defineProps({
  name: { type: String, required: true },
  cv: { type: Object, required: true },
  tpl: { type: Object, required: true },
  narrow: { type: Boolean, default: false }, // colonne étroite : éléments empilés
})

const TITLES = {
  summary: 'Profil professionnel',
  experience: 'Expériences professionnelles',
  education: 'Éducation et formations',
  projects: 'Projets et réalisations',
  certifications: 'Certifications',
  skills: 'Compétences',
  languages: 'Langues',
  interests: "Centres d'intérêt",
}
const NARROW_TITLES = { education: 'Formation' }

const title = computed(() => (props.narrow && NARROW_TITLES[props.name]) || TITLES[props.name])
const headingClass = computed(
  () => `h-${props.narrow ? props.tpl.sideHeading || 'caps' : props.tpl.headingStyle}`,
)
const itemStyle = computed(() => (props.narrow ? 'stack' : props.tpl.itemStyle))
const period = (item, withCurrent = false) =>
  formatPeriod(item.startDate, item.endDate, withCurrent && item.current)
</script>

<template>
  <section class="sec">
    <h2 class="sec-title" :class="headingClass">{{ title }}</h2>

    <!-- Profil -->
    <p v-if="name === 'summary'" class="desc">{{ cv.summary }}</p>

    <!-- Expériences -->
    <div v-else-if="name === 'experience'">
      <article v-for="e in cv.experience" :key="e.id" class="item" :class="`it-${itemStyle}`">
        <div v-if="itemStyle === 'datecol'" class="date">{{ period(e, true) }}</div>
        <div class="item-body">
          <div class="row">
            <h3 class="ttl">{{ e.position }}</h3>
            <span v-if="itemStyle === 'plain' || itemStyle === 'timeline'" class="period">
              {{ period(e, true) }}
            </span>
          </div>
          <div v-if="e.company" class="org">{{ e.company }}</div>
          <div v-if="itemStyle === 'stack'" class="period">{{ period(e, true) }}</div>
          <p v-if="e.description" class="desc">{{ e.description }}</p>
        </div>
      </article>
    </div>

    <!-- Formations -->
    <div v-else-if="name === 'education'">
      <article v-for="e in cv.education" :key="e.id" class="item" :class="`it-${itemStyle}`">
        <div v-if="itemStyle === 'datecol'" class="date">{{ period(e) }}</div>
        <div class="item-body">
          <div class="row">
            <h3 class="ttl">{{ e.degree }}</h3>
            <span v-if="itemStyle === 'plain' || itemStyle === 'timeline'" class="period">
              {{ period(e) }}
            </span>
          </div>
          <div v-if="e.school" class="org">{{ e.school }}</div>
          <div v-if="itemStyle === 'stack'" class="period">{{ period(e) }}</div>
        </div>
      </article>
    </div>

    <!-- Projets -->
    <div v-else-if="name === 'projects'">
      <article v-for="p in cv.projects" :key="p.id" class="item it-plain">
        <div class="item-body">
          <h3 class="ttl">{{ p.name }}</h3>
          <div v-if="p.technologies" class="org">Technologies : {{ p.technologies }}</div>
          <p v-if="p.description" class="desc">{{ p.description }}</p>
        </div>
      </article>
    </div>

    <!-- Certifications -->
    <div v-else-if="name === 'certifications'">
      <div v-for="c in cv.certifications" :key="c.id" class="item it-plain">
        <h3 class="ttl">{{ c.name }}</h3>
        <div v-if="c.organization || c.year" class="org">
          {{ c.organization }}<span v-if="c.year"> ({{ c.year }})</span>
        </div>
      </div>
    </div>

    <!-- Compétences -->
    <template v-else-if="name === 'skills'">
      <ul v-if="tpl.skillStyle === 'chips'" class="chips">
        <li v-for="s in cv.skills" :key="s">{{ s }}</li>
      </ul>
      <p v-else class="desc">{{ cv.skills.join('  ·  ') }}</p>
    </template>

    <!-- Langues -->
    <template v-else-if="name === 'languages'">
      <div v-if="tpl.langStyle === 'bars'" class="langs" :class="{ one: narrow }">
        <div v-for="l in cv.languages" :key="l.id" class="lang">
          <div class="lang-row">
            <span class="ttl">{{ l.name }}</span>
            <span class="period">{{ getLevelLabel(l.level) }}</span>
          </div>
          <div class="bar"><div class="fill" :style="{ width: `${l.level}%` }"></div></div>
        </div>
      </div>
      <ul v-else class="plain-list">
        <li v-for="l in cv.languages" :key="l.id">
          <span class="ttl">{{ l.name }}</span>
          <span class="period"> : {{ getLevelLabel(l.level) }}</span>
        </li>
      </ul>
    </template>

    <!-- Centres d'intérêt -->
    <ul v-else-if="name === 'interests'" class="interests" :class="{ stacked: narrow }">
      <li v-for="i in cv.interests" :key="i.id">
        <strong class="ttl">{{ i.name }}</strong
        ><span v-if="i.detail" class="desc-inline"> : {{ i.detail }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sec {
  margin-bottom: var(--sec-gap, 1.2em);
}

/* ---- Titres ---- */
.sec-title {
  margin: 0 0 0.7em;
  color: var(--hx);
  font-weight: 700;
  line-height: 1.2;
  break-after: avoid;
}
.h-rule {
  font-size: 1.12em;
  padding-bottom: 0.28em;
  border-bottom: 0.12em solid var(--hx);
}
.h-bar {
  font-size: 1.1em;
  padding-left: 0.6em;
  border-left: 0.3em solid var(--hx);
}
.h-pill {
  display: inline-block;
  font-size: 0.92em;
  padding: 0.25em 0.95em;
  border-radius: 2em;
  background: var(--accent);
  color: var(--on-accent);
}
.h-caps {
  font-size: 0.8em;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 0.4em;
  border-bottom: 0.08em solid var(--rule);
}
.h-center {
  display: flex;
  align-items: center;
  gap: 0.9em;
  font-size: 0.85em;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.h-center::before,
.h-center::after {
  content: '';
  flex: 1;
  border-top: 0.08em solid var(--rule);
}

/* ---- Éléments (expériences, formations, projets…) ---- */
.item {
  margin-bottom: var(--item-gap, 0.9em);
  break-inside: avoid;
}
.item:last-child {
  margin-bottom: 0;
}
.row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1em;
}
.ttl {
  font-weight: 700;
  color: var(--ink);
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.org {
  margin-top: 0.1em;
  font-size: 0.95em;
  font-weight: 600;
  color: var(--muted);
}
.period {
  flex-shrink: 0;
  font-size: 0.86em;
  font-weight: 600;
  color: var(--accent);
}
.desc {
  margin-top: 0.3em;
  font-size: 0.93em;
  white-space: pre-line;
  color: var(--body);
}
.sec > .desc {
  margin-top: 0;
}
.desc-inline {
  color: var(--body);
}

/* dates dans une colonne à gauche */
.it-datecol {
  display: grid;
  grid-template-columns: 8.2em 1fr;
  gap: 1em;
}
.it-datecol .date {
  padding-top: 0.12em;
  font-size: 0.88em;
  font-weight: 600;
  color: var(--muted);
}

/* ligne du temps */
.it-timeline {
  position: relative;
  margin-left: 0.35em;
  margin-bottom: 0;
  padding: 0 0 var(--item-gap, 0.9em) 1.3em;
  border-left: 0.14em solid var(--rule);
}
.it-timeline::before {
  content: '';
  position: absolute;
  top: 0.3em;
  left: -0.45em;
  width: 0.76em;
  height: 0.76em;
  border-radius: 50%;
  background: var(--accent);
}
.it-timeline:last-child {
  padding-bottom: 0;
}

/* colonne étroite : titre, organisme, période empilés */
.it-stack .period {
  display: block;
  margin-top: 0.1em;
  color: var(--muted);
}

/* ---- Compétences ---- */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
}
.chips li {
  padding: 0.22em 0.75em;
  border-radius: 2em;
  background: var(--chip-bg);
  color: var(--chip-ink);
  font-size: 0.88em;
  font-weight: 600;
}

/* ---- Langues ---- */
.langs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8em 2.2em;
}
.langs.one {
  grid-template-columns: 1fr;
  gap: 0.7em;
}
.lang-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.8em;
  font-size: 0.93em;
}
.lang-row .period {
  color: var(--muted);
  font-weight: 500;
}
.bar {
  height: 0.4em;
  margin-top: 0.3em;
  border-radius: 1em;
  background: var(--bar-bg);
  overflow: hidden;
}
.fill {
  height: 100%;
  border-radius: 1em;
  background: var(--bar-fill);
}
.plain-list li {
  margin-bottom: 0.2em;
  font-size: 0.95em;
}
.plain-list .period {
  color: var(--muted);
  font-weight: 500;
}

/* ---- Centres d'intérêt ---- */
.interests {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em 1.6em;
  font-size: 0.93em;
  color: var(--body);
}
.interests.stacked {
  flex-direction: column;
  gap: 0.35em;
}
</style>
