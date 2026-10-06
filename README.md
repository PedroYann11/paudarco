# Cap Store Cariri

Site institucional com catálogo de bonés da Cap Store Cariri. A conversão acontece pelo WhatsApp.

## Stack

- Next.js 16 (App Router, Cache Components) + React 19 + TypeScript
- Tailwind CSS 4, com tokens definidos em `src/app/globals.css`
- Fontes Barlow e Barlow Semi Condensed via `next/font` (auto-hospedadas)

## Scripts

```bash
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # build de produção
npm run verificar  # tipos + lint
```

## Estrutura

```
src/
  app/              rotas, layout raiz, tokens (globals.css) e fontes (fontes.ts)
  assets/marca/     selo da marca usado pelo site
  components/
    layout/         Cabecalho, Rodape
    marca/          Selo
    ui/             Rotulo, Estrela, ícones das redes
  content/
    tipos.ts        modelo de dados (produto, variante, marca, categoria, configuração)
    dados/          dados atuais do site; serão substituídos pelo painel administrativo
  lib/              acesso aos dados (catalogo.ts, site.ts) e utilidades (whatsapp.ts)
brand/              arquivos-fonte da marca (não publicados)
reference/          material de referência interna (não publicado)
```

Os componentes nunca leem `src/content/dados` diretamente: todo acesso passa por `src/lib`.
Assim, a troca dos arquivos locais pelo banco do painel não exige mudar componentes.

## Identidade

| Token | Cor | Uso |
|---|---|---|
| `papel` | `#F6F5F2` | fundo principal |
| `linho` | `#ECEBE7` | superfícies |
| `filete` | `#DEDCD6` | divisórias |
| `prata` | `#C9C8C3` | segundo metal |
| `grafite` | `#26272B` | texto e botão principal |
| `grafite-suave` | `#6A6B70` | texto secundário |
| `carvao` | `#1B1C1F` | seção final e rodapé |
| `ouro` | `#A3844E` | filetes e detalhes (não usar em texto pequeno) |
| `ouro-claro` | `#D9BC7A` | dourado sobre fundo escuro |
| `ouro-texto` | `#7E6233` | dourado como texto sobre o papel |

A paleta padrão do Tailwind está desligada: só essas cores existem como utilitários.
