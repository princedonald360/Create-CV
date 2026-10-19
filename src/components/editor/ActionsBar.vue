<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import { LIMITS } from '../../utils/constants'
import { slugify } from '../../utils/format'

const store = useCvStore()

const fileInputRef = ref(null)
const status = ref({ type: '', text: '' })
let statusTimer = null

const notify = (type, text) => {
  status.value = { type, text }
  clearTimeout(statusTimer)
  statusTimer = setTimeout(() => {
    status.value = { type: '', text: '' }
  }, 5000)
}

// Le nom du fichier PDF proposé par le navigateur reprend le titre de la page.
const printCv = () => {
  const previousTitle = document.title
  const name = store.profile.fullName.trim()
  document.title = name ? `CV - ${name}` : 'CV'
  window.addEventListener(
    'afterprint',
    () => {
      document.title = previousTitle
    },
    { once: true },
  )
  window.print()
}

const exportJson = () => {
  const blob = new Blob([store.exportJson()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const slug = slugify(store.profile.fullName)
  link.href = url
  link.download = `cv-${slug || 'sauvegarde'}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  notify('success', 'Sauvegarde téléchargée.')
}

const openImport = () => fileInputRef.value?.click()

const handleImport = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (file.size > LIMITS.maxImportBytes) {
    notify('error', 'Fichier trop volumineux (2 Mo maximum).')
    return
  }

  try {
    const result = store.importJson(await file.text())
    if (result.ok) notify('success', 'CV importé avec succès.')
    else notify('error', result.error)
  } catch {
    notify('error', 'Lecture du fichier impossible.')
  }
}

const resetAll = () => {
  if (window.confirm('Effacer toutes vos informations ? Cette action est irréversible.')) {
    store.resetAll()
    notify('success', 'CV réinitialisé.')
  }
}

onBeforeUnmount(() => clearTimeout(statusTimer))
</script>

<template>
  <div class="space-y-2">
    <input
      ref="fileInputRef"
      type="file"
      accept="application/json,.json"
      class="hidden"
      @change="handleImport"
    />

    <div class="flex flex-wrap gap-2">
      <button type="button" class="btn-accent" @click="printCv">Télécharger en PDF</button>
      <button type="button" class="btn-secondary" @click="exportJson">Sauvegarder (JSON)</button>
      <button type="button" class="btn-secondary" @click="openImport">Importer</button>
      <button
        type="button"
        class="btn-secondary text-red-600 hover:bg-red-50"
        @click="resetAll"
      >
        Réinitialiser
      </button>
    </div>

    <p class="text-[11px] text-slate-400">
      Dans la fenêtre d'impression, choisissez « Enregistrer au format PDF ». Vos données restent sur
      votre appareil.
    </p>

    <p
      v-if="status.text"
      role="status"
      aria-live="polite"
      class="text-xs font-medium"
      :class="status.type === 'error' ? 'text-red-600' : 'text-emerald-600'"
    >
      {{ status.text }}
    </p>
  </div>
</template>
