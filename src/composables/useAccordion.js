import { ref } from 'vue'

/** Gère l'accordéon « une seule carte ouverte à la fois » partagé par tous les formulaires. */
export function useAccordion() {
  const activeId = ref(null)

  const toggle = (id) => {
    activeId.value = activeId.value === id ? null : id
  }
  const open = (id) => {
    activeId.value = id
  }
  const isOpen = (id) => activeId.value === id

  return { activeId, toggle, open, isOpen }
}
