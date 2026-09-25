// Reduz fotos antes de as guardar.
// Uma foto de telemóvel pode ter 3-4 MB e o localStorage só aceita ~5 MB
// no total, por isso encolhemos para no máximo MAX_SIDE px e guardamos em JPEG.

const MAX_SIDE = 1280   // lado maior em píxeis — chega para ler o texto de uma receita
const QUALITY = 0.75    // qualidade JPEG (0 a 1)

/** Carrega um ficheiro de imagem num <img> para o podermos desenhar num canvas. */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Não foi possível ler a imagem'))
    }
    img.src = url
  })
}

/** Lê o ficheiro tal como está, sem compressão (usado como plano B). */
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Devolve a foto como data URL JPEG, reduzida para caber no armazenamento.
 * Se o browser não conseguir descodificar a imagem, devolve o original.
 */
export async function compressImage(file: File): Promise<string> {
  try {
    const img = await loadImage(file)

    // Mantém a proporção: só encolhe, nunca aumenta.
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
    const width = Math.round(img.width * scale)
    const height = Math.round(img.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return readAsDataUrl(file)

    // Fundo branco: o JPEG não tem transparência, e sem isto
    // as partes transparentes de um PNG ficavam pretas.
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    return canvas.toDataURL('image/jpeg', QUALITY)
  } catch {
    return readAsDataUrl(file)
  }
}
