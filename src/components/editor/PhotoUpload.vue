<script setup>
import { defineAsyncComponent, onBeforeUnmount, ref } from 'vue'
import { useCvStore } from '../../stores/useCvStore'
import ToggleSwitch from '../ui/ToggleSwitch.vue'

// Chargé à la demande : la bibliothèque de recadrage (et son CSS) n'alourdit
// pas le premier affichage de la page.
const PhotoCropModal = defineAsyncComponent(() => import('./PhotoCropModal.vue'))

const store = useCvStore()

const MAX_FILE_SIZE = 3 * 1024 * 1024
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const errorMessage = ref('')
const fileInputRef = ref(null)
const rawImageSource = ref('')

const releaseSource = () => {
  if (rawImageSource.value) {
    URL.revokeObjectURL(rawImageSource.value)
    rawImageSource.value = ''
  }
}

const resetFileInput = () => {
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const openPicker = () => fileInputRef.value?.click()

const handleFileSelection = (event) => {
  const file = event.target.files?.[0]
  errorMessage.value = ''
  if (!file) return

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    errorMessage.value = 'Format non supporté. Choisissez un fichier JPEG, PNG ou WEBP.'
    resetFileInput()
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = "Taille de l'image trop grande (3 Mo maximum)."
    resetFileInput()
    return
  }

  releaseSource()
  // URL temporaire plutôt que base64 : pas de copie en mémoire de l'image d'origine.
  rawImageSource.value = URL.createObjectURL(file)
}

const closeCropper = () => {
  releaseSource()
  resetFileInput()
}

const handleCropped = (dataUrl) => {
  store.setPhoto(dataUrl)
  closeCropper()
}

const handleCropError = () => {
  errorMessage.value = "Impossible de lire cette image. Essayez un autre fichier."
  closeCropper()
}

const handleRemovePhoto = () => {
  store.removePhoto()
  resetFileInput()
}

onBeforeUnmount(releaseSource)
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="handleFileSelection"
    />

    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Photo de profil</h3>
      <ToggleSwitch v-model="store.setting.showPhoto" label="Afficher la photo sur le CV" />
    </div>

    <div v-if="store.setting.showPhoto" class="mt-2 flex items-center gap-4">
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100"
      >
        <img
          v-if="store.profile.photo"
          :src="store.profile.photo"
          alt="Aperçu de la photo de profil"
          class="h-full w-full object-cover"
        />
        <span v-else class="px-1 text-center text-[10px] text-slate-400">Aucune photo</span>
      </div>

      <div class="flex-1 space-y-1.5">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
            @click="openPicker"
          >
            {{ store.profile.photo ? 'Changer' : 'Ajouter une photo' }}
          </button>

          <button
            v-if="store.profile.photo"
            type="button"
            class="rounded bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            @click="handleRemovePhoto"
          >
            Supprimer
          </button>
        </div>

        <p class="text-[11px] text-slate-400">Formats acceptés : JPG, PNG, WEBP (3 Mo maximum)</p>
      </div>
    </div>

    <p
      v-if="errorMessage && store.setting.showPhoto"
      role="alert"
      class="mt-2 text-xs font-medium text-red-500"
    >
      {{ errorMessage }}
    </p>

    <PhotoCropModal
      v-if="rawImageSource"
      :image-src="rawImageSource"
      @crop="handleCropped"
      @cancel="closeCropper"
      @error="handleCropError"
    />
  </div>
</template>
