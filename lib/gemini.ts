import type { Recipe } from './types'

const SYSTEM_PROMPT = `Analisa esta imagem de receita e extrai as informações em JSON com exatamente este formato:
{
  "name": "nome da receita em português",
  "category": "uma destas categorias: Pequeno-Almoço, Almoço, Jantar, Sobremesa, Snack, Outro",
  "time": "tempo de preparação e cozimento (ex: 30 min)",
  "servings": "número de porções (ex: 4 pessoas)",
  "ingredients": [
    { "qty": "quantidade", "unit": "unidade (g, ml, colher, etc)", "name": "nome do ingrediente" }
  ],
  "steps": ["passo 1", "passo 2"]
}
Responde APENAS com JSON válido, sem texto adicional. Todos os campos devem estar em português de Portugal.`

export async function analyzeRecipeImage(
  base64: string,
  mediaType: string,
  apiKey: string
): Promise<Partial<Recipe>> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mediaType,
              data: base64,
            },
          },
          {
            text: SYSTEM_PROMPT,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error: ${response.status} — ${err}`)
  }

  const data = await response.json()

  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Strip markdown fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  try {
    return JSON.parse(cleaned) as Partial<Recipe>
  } catch {
    // Try extracting JSON object from text
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      return JSON.parse(match[0]) as Partial<Recipe>
    }
    throw new Error('Não foi possível analisar a resposta da IA')
  }
}
