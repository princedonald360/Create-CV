import { onBeforeUnmount, onMounted, ref } from 'vue'

const A4_WIDTH_PX = 794 // 210 mm à 96 dpi

/**
 * Calcule le facteur de réduction qui permet d'afficher la feuille A4 entière
 * dans le conteneur d'aperçu (utile sur mobile et petits écrans).
 */
export function usePreviewScale(containerRef, gutter = 32) {
  const scale = ref(1)
  let observer = null

  const update = () => {
    const el = containerRef.value
    if (!el) return
    const available = el.clientWidth - gutter
    scale.value = Math.max(0.3, Math.min(1, available / A4_WIDTH_PX))
  }

  onMounted(() => {
    update()
    if (containerRef.value && 'ResizeObserver' in window) {
      observer = new ResizeObserver(update)
      observer.observe(containerRef.value)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return scale
}
