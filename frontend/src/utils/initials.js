// Iniciais robustas: 1 palavra → 2 primeiras letras; 2+ → primeira de cada extremo.
// Corrige o bug antigo de `.slice(0, 2)` que falhava com nomes compostos.
export function getInitials(name) {
  if (!name || typeof name !== 'string') return ''
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
