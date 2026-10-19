import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const MIN_FS = 10.5 // taille de texte minimale (px)
const MAX_FS = 16.5 // taille de texte maximale (px)

/**
 * Ajuste la taille de tout le CV (texte, photo, espacements : tout est en « em »)
 * pour que le contenu occupe la page entière :
 *  - peu de données  -> texte plus grand, la feuille est remplie ;
 *  - beaucoup de données -> texte plus petit, jusqu'à MIN_FS, puis 2 pages ou plus.
 *
 * On mesure toujours le contenu par rapport à une « règle » invisible de 273 mm
 * (hauteur utile d'une page A4) qui subit le même zoom : le résultat reste juste
 * quel que soit le zoom de l'aperçu, et identique à l'impression.
 */
export function useAutoFit({ rootRef, contentRef, rulerRef, source }) {
  const fs = ref(13)
  let timer = null
  let observer = null

  const heightAt = (value) => {
    rootRef.value.style.setProperty('--fs', String(value))
    return contentRef.value.offsetHeight
  }

  const fit = () => {
    const root = rootRef.value
    const content = contentRef.value
    const ruler = rulerRef.value
    if (!root || !content || !ruler) return

    const page = ruler.offsetHeight
    if (page <= 0) return // panneau masqué (mobile) : on recalcule à son affichage

    const heightMin = heightAt(MIN_FS)
    const pages = Math.max(1, Math.ceil(heightMin / page))
    // Marge de sécurité : les blocs non coupables laissent des vides en bas des pages.
    const target = pages === 1 ? page * 0.985 : pages * page * 0.9

    let best = MIN_FS
    if (heightMin <= target) {
      if (heightAt(MAX_FS) <= target) {
        best = MAX_FS
      } else {
        let low = MIN_FS
        let high = MAX_FS
        for (let i = 0; i < 8; i++) {
          const mid = (low + high) / 2
          if (heightAt(mid) <= target) low = mid
          else high = mid
        }
        best = low
      }
    }

    best = Math.round(best * 100) / 100
    root.style.setProperty('--fs', String(best))
    fs.value = best
  }

  // Les calculs sont regroupés : une seule mesure même si l'utilisateur tape vite.
  const schedule = () => {
    clearTimeout(timer)
    timer = setTimeout(() => requestAnimationFrame(fit), 120)
  }

  watch(source, schedule, { deep: true, flush: 'post' })

  onMounted(() => {
    schedule()
    // Les polices changent la largeur du texte : on recalcule quand elles sont prêtes.
    document.fonts?.ready.then(schedule)
    document.fonts?.addEventListener?.('loadingdone', schedule)
    if (rulerRef.value && 'ResizeObserver' in window) {
      observer = new ResizeObserver(schedule)
      observer.observe(rulerRef.value)
    }
  })

  onBeforeUnmount(() => {
    clearTimeout(timer)
    observer?.disconnect()
    document.fonts?.removeEventListener?.('loadingdone', schedule)
  })

  return fs
}
