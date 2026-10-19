<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

defineProps({
  imageSrc: { type: String, required: true },
})

const emit = defineEmits(['crop', 'cancel', 'error'])

const OUTPUT_SIZE = 300
const cropperRef = ref(null)

// Rendu final : carré 300×300 en JPEG. Le fond blanc évite un fond noir
// lorsqu'un PNG/WEBP transparent est converti en JPEG.
const confirmCrop = () => {
  const result = cropperRef.value?.getResult()
  if (!result?.canvas) return

  const output = document.createElement('canvas')
  output.width = OUTPUT_SIZE
  output.height = OUTPUT_SIZE

  const ctx = output.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(result.canvas, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

  emit('crop', output.toDataURL('image/jpeg', 0.85))
}

const onKeydown = (event) => {
  if (event.key === 'Escape') emit('cancel')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex select-none items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="crop-title"
    @click.self="emit('cancel')"
  >
    <div class="flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-100 bg-white p-4">
        <h3 id="crop-title" class="text-sm font-bold text-slate-800">Ajuster la photo de profil</h3>
        <button
          type="button"
          aria-label="Fermer"
          class="px-2 text-xl font-bold text-slate-400 hover:text-slate-600"
          @click="emit('cancel')"
        >
          &times;
        </button>
      </div>

      <div class="relative flex h-[360px] items-center justify-center overflow-hidden bg-slate-950 p-4">
        <Cropper
          ref="cropperRef"
          class="custom-cropper h-full w-full"
          :src="imageSrc"
          :stencil-component="CircleStencil"
          :stencil-props="{ aspectRatio: 1 }"
          @error="emit('error')"
        />
      </div>

      <div class="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
        <button type="button" class="btn-secondary" @click="emit('cancel')">Annuler</button>
        <button type="button" class="btn-primary" @click="confirmCrop">Valider le cadrage</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.vue-advanced-cropper) {
  height: 100% !important;
  width: 100% !important;
  background: #020617;
}

:deep(.vue-advanced-cropper__background),
:deep(.vue-advanced-cropper__foreground) {
  opacity: 1 !important;
}

:deep(.vue-bounding-box) {
  border: 2px dashed #3b82f6 !important;
}

:deep(.vue-line-wrapper),
:deep(.vue-handler-wrapper) {
  display: block !important;
}
</style>
