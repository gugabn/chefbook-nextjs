# Rumo à Basque

App pessoal de poupança — controlar o caminho financeiro até à **Basque Culinary**,
com meta, ritmo mensal, projeção e as certificações necessárias (STCW, ENG1,
DELE B2, …) antes de embarcar.

Foi extraída do projeto **ChefBook**, onde vivia como o separador «Finanças».
Passou a ser uma aplicação Next.js autónoma.

## Stack

- **Next.js** 16.2.6 · **React** 19.2 · **TypeScript** · **Tailwind v4**
- Mobile-first, instalável como PWA
- Sem backend: os dados ficam no `localStorage` do dispositivo

## Arranque

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## O que faz

- **Painel de progresso** — quanto já poupaste face à meta, com estado (adiantado / atrasado)
- **Ritmo** — quanto precisas de poupar por mês e quanto vai no mês corrente,
  incluindo a percentagem do salário estimado
- **Projeção** — ao ritmo médio atual, quando chegas à meta face ao prazo
- **Anuidades** — a meta dividida em fatias (ex.: 4 anos da Basque)
- **Marcos e certificações** — passos com custo e prazo, com alertas de atraso
- **Lançamentos** — depósitos e levantamentos
- **Cópia de segurança** — exportar / importar tudo em JSON

## Estrutura

```
app/            layout (fonts, PWA), page.tsx (orquestrador), globals.css
hooks/useStore  estado central + persistência (localStorage)
lib/            types · storage · finance · backup
components/
  ├ Header.tsx
  ├ FinanceView.tsx
  ├ modals/     AddContribution · AddMilestone · FinanceGoal · Settings
  └ ui/         Sheet · Toast
```

## Dados

Guardados no `localStorage` sob as chaves `rumobasque_contributions`,
`rumobasque_goal` e `rumobasque_milestones`. O backup é um ficheiro
`rumo-basque-backup-AAAA-MM-DD.json`.

> Nota: como é uma app separada (origem/domínio próprios), os dados que existiam
> no separador Finanças do ChefBook não migram automaticamente.
