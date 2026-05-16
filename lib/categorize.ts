const KEYWORD_MAP: Record<string, string[]> = {
  Legumes: [
    'tomate', 'cebola', 'alho', 'cenoura', 'batata', 'pimento', 'pepino', 'alface',
    'espinafre', 'couve', 'brocolo', 'brócolo', 'courgette', 'abobrinha', 'beringela',
    'cogumelo', 'milho', 'feijão', 'lentilha', 'grão', 'ervilha', 'alho-porro',
    'curgete', 'repolho', 'nabo', 'beterraba', 'aipo', 'salsa', 'coentro', 'manjericão',
    'orégão', 'tomilho', 'louro', 'pimentão', 'abóbora', 'rúcula', 'endívia',
    'agrião', 'rabanete', 'cebolo', 'chalota', 'chalotas', 'alho-frances',
  ],
  Frutas: [
    'maçã', 'pera', 'banana', 'laranja', 'limão', 'uva', 'morango', 'framboesa',
    'mirtilo', 'kiwi', 'manga', 'abacate', 'abacaxi', 'ananás', 'melancia',
    'melão', 'pêssego', 'damasco', 'ameixa', 'cereja', 'figo', 'tâmara',
    'coco', 'papaia', 'maracujá', 'romã', 'lima', 'pomelo', 'tangerina',
    'clementina', 'nectarina', 'amora', 'arando', 'groselha',
  ],
  'Proteínas': [
    'frango', 'carne', 'porco', 'vaca', 'boi', 'peixe', 'bacalhau', 'salmão',
    'atum', 'sardinha', 'camarão', 'lula', 'polvo', 'mexilhão', 'amêijoa',
    'peru', 'pato', 'borrego', 'cordeiro', 'vitela', 'cabrito', 'coelho',
    'tofu', 'tempeh', 'ovo', 'ova', 'filete', 'bife', 'costeleta', 'lombinho',
    'entrecosto', 'linguiça', 'chouriço', 'presunto', 'bacon', 'salsicha',
    'salpicão', 'paio', 'dourada', 'robalo', 'cherne', 'pargo', 'pregado',
    'espadarte', 'perca', 'truta', 'enguia',
  ],
  'Laticínios': [
    'leite', 'queijo', 'iogurte', 'manteiga', 'nata', 'creme', 'requeijão',
    'mozzarela', 'mozzarella', 'parmesão', 'brie', 'ricotta', 'mascarpone',
    'buttermilk', 'leitelho', 'ghee', 'kefir', 'coalhada',
  ],
  'Cereais & Massas': [
    'arroz', 'massa', 'esparguete', 'spaghetti', 'macarrão', 'pão', 'farinha',
    'aveia', 'cevada', 'trigo', 'centeio', 'quinoa', 'cuscuz', 'bulgur',
    'polenta', 'milho', 'tagliatelle', 'penne', 'fusilli', 'lasanha',
    'gnocchi', 'panqueca', 'granola', 'muesli', 'biscoito', 'bolacha',
    'crackers', 'tortilha',
  ],
  Especiarias: [
    'sal', 'pimenta', 'açafrão', 'curcuma', 'canela', 'noz-moscada', 'cardamomo',
    'cominho', 'cominhos', 'cravinho', 'paprika', 'pimentão-doce', 'caril',
    'curry', 'gengibre', 'baunilha', 'anis', 'erva-doce', 'orégãos',
    'piri-piri', 'tabasco', 'mostarda', 'vinagre', 'molho', 'azeite', 'óleo',
    'acompanhamento', 'condimento',
  ],
  Enlatados: [
    'lata', 'conserva', 'atum em lata', 'feijão enlatado', 'tomate pelado',
    'polpa', 'puré de tomate', 'milho enlatado', 'ervilha enlatada',
    'azeitona', 'alcaparra', 'anchova', 'sardinha enlatada',
  ],
  Bebidas: [
    'água', 'sumo', 'suco', 'vinho', 'cerveja', 'café', 'chá', 'leite',
    'refrigerante', 'coca-cola', 'laranjada', 'limonada', 'kombucha',
    'smoothie', 'batido', 'bebida', 'licor', 'whisky', 'vodka', 'rum',
  ],
}

export function categorizeItem(name: string): string {
  const lower = name.toLowerCase().trim()

  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return category
      }
    }
  }

  return 'Outros'
}

export const CATEGORY_ICONS: Record<string, string> = {
  Legumes: '🥦',
  Frutas: '🍎',
  'Proteínas': '🥩',
  'Laticínios': '🧀',
  'Cereais & Massas': '🌾',
  Especiarias: '🧂',
  Enlatados: '🥫',
  Bebidas: '🥤',
  Outros: '📦',
}

export const CATEGORY_COLORS: Record<string, string> = {
  Legumes: '#7A9E7E',
  Frutas: '#E8A838',
  'Proteínas': '#C4622D',
  'Laticínios': '#F5EFE8',
  'Cereais & Massas': '#D4A76A',
  Especiarias: '#9B7CB6',
  Enlatados: '#6B8CAE',
  Bebidas: '#4AABB8',
  Outros: '#9E9E9E',
}
