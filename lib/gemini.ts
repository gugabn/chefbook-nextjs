import type { Recipe, PantryItem, RecipeSuggestion } from './types'

const SYSTEM_PROMPT = `Analisa esta imagem de receita e extrai as informações em JSON com exatamente este formato:
{
  "name": "nome da receita em português",
  "category": "uma destas categorias: Pequeno-Almoço, Almoço, Jantar, Sobremesa, Snack, Outro",
  "time": "tempo total de preparação e cozimento (ex: 30 min) — omite este campo se não estiver visível",
  "servings": "número de porções (ex: 4 pessoas) — omite este campo se não estiver visível",
  "ingredients": [
    { "qty": "quantidade ou string vazia se não indicada", "unit": "unidade (g, ml, colher, xícara, dente, folha, etc) ou string vazia", "name": "nome do ingrediente" }
  ],
  "steps": ["passo completo 1", "passo completo 2"]
}
Regras obrigatórias:
- Português de Portugal em todos os campos
- Extrai TODOS os ingredientes visíveis, mesmo sem quantidade
- Os passos devem ser frases completas e claras com todos os detalhes
- Se time ou servings não estiverem visíveis, omite esses campos completamente (não uses null)
- Se a imagem não for uma receita, devolve { "name": "Receita desconhecida", "category": "Outro", "ingredients": [], "steps": [] }
- Responde APENAS com JSON válido, sem texto adicional nem markdown`

function parseGeminiResponse<T>(text: string, fallbackPattern: RegExp): T {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    const match = cleaned.match(fallbackPattern)
    if (match) return JSON.parse(match[0]) as T
    throw new Error('Não foi possível analisar a resposta da IA')
  }
}

async function callGemini(body: object, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
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
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export async function analyzeRecipeImage(
  base64: string,
  mediaType: string,
  apiKey: string
): Promise<Partial<Recipe>> {
  const body = {
    contents: [
      {
        parts: [
          { inline_data: { mime_type: mediaType, data: base64 } },
          { text: SYSTEM_PROMPT },
        ],
      },
    ],
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
  }
  const text = await callGemini(body, apiKey)
  return parseGeminiResponse<Partial<Recipe>>(text, /\{[\s\S]*\}/)
}

export async function suggestRecipesFromPantry(
  pantry: PantryItem[],
  apiKey: string
): Promise<RecipeSuggestion[]> {
  const pantryList = pantry
    .map(item => `${item.name} (${item.qty} ${item.unit})`)
    .join(', ')

  const prompt = `Tenho estes ingredientes na despensa: ${pantryList}

Sugere 5 receitas que posso fazer com estes ingredientes. Prioriza receitas que usem o máximo de ingredientes disponíveis e que precisem de poucos ingredientes extra. Responde APENAS com JSON válido no formato:
[
  {
    "name": "nome da receita em português",
    "description": "descrição apetitosa em 1-2 frases",
    "usedIngredients": ["ingredientes da despensa que usa"],
    "missingIngredients": ["ingredientes em falta, máximo 3"],
    "time": "tempo total (ex: 30 min)",
    "difficulty": "Fácil",
    "category": "Almoço"
  }
]
difficulty deve ser exatamente "Fácil", "Médio" ou "Difícil". category deve ser uma de: Pequeno-Almoço, Almoço, Jantar, Sobremesa, Snack, Outro. Português de Portugal. Sem markdown.`

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
  }
  const text = await callGemini(body, apiKey)
  return parseGeminiResponse<RecipeSuggestion[]>(text, /\[[\s\S]*\]/)
}
