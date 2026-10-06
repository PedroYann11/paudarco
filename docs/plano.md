# Plano — Cap Store Cariri

Documento de referência do projeto. A **versão de apresentação** (seção 1) é o
escopo atual; o **plano completo** (seção 2) fica guardado para quando o projeto
for fechado com a loja.

---

## 1. Versão de apresentação (escopo atual)

Objetivo: causar uma ótima primeira impressão em dois pontos — a **abertura** e o
**catálogo** — e servir de chamariz para fechar o projeto. A interface se
apresenta como site real: nenhum texto de "demo", "protótipo" ou "em breve".

### Entra

1. **Hero com scroll** (selo → boné girando → assinatura → catálogo).
2. **Catálogo como cardápio de estilos** (inspirado na Goorin Bros, em que cada
   boné tem personalidade): carrossel de capas por estilo — aba curva "O
   clássico", aba reta "O arretado", trucker "O estradeiro", dad hat "O
   sossegado" —, depois a vitrine do estilo com um destaque grande e os demais
   modelos; marca e cor num filtro discreto dentro do estilo.
3. **Detalhe rápido** em painel inferior ao tocar no card: foto, marca, nome,
   cor, preço e botão "Tenho interesse" que abre o WhatsApp com a mensagem pronta.
   Substitui a página de produto nesta fase.
4. Cabeçalho que aparece depois do hero e o rodapé que já existe.

### Fica de fora (volta se o projeto fechar)

Página de produto, seções de narrativa (marcas, a casa, Instagram, visite a
loja), SEO completo, painel administrativo e métricas.

### Pendências da apresentação

- Boné do hero: vistas do pngtree (troca de pose), modelo 3D licenciado
  renderizado em 72 quadros (giro real) ou fotos próprias em turntable.
- Produtos do catálogo: idealmente fotos e marcas reais tiradas do Instagram da
  loja; sem elas, tiles provisórios com a silhueta do modelo.
- Número de WhatsApp para os botões.

---

## 2. Plano completo

### Decisões fechadas

| Tema | Decisão |
|---|---|
| Identidade | Streetwear esportivo premium, "metal e linha": papel, grafite, dourado raro |
| Tipografia | Barlow Semi Condensed itálica (display) + Barlow (texto) |
| Elementos da logo | Rótulo "— CARIRI —", estrela de 4 pontas, anel dourado como filete |
| Hero | Sequência de imagens em canvas + GSAP ScrollTrigger; sem 3D em tempo real |
| Preço | Visível; "sob consulta" por produto e opção geral para esconder |
| Conversão | WhatsApp com mensagem pronta por contexto |
| Componentes externos | Aceternity, Skiper e 21st só como referência de padrão; implementação própria em CSS/GSAP, sem Framer Motion nem Lenis |

### Etapas

1. **Fundação** — concluída.
2. **Hero** — motor da sequência (canvas, DPR ≤ 2, carregamento progressivo,
   36 quadros no celular e 72 no desktop, script `sharp`), coreografia, cabeçalho
   pós-hero com texto que rola no hover, versão sem movimento, testes no
   Instagram/WhatsApp in-app, primeira medição de performance.
3. **Catálogo** — grade 2/3/4 colunas, card sem borda e sem sombra, tile
   provisório, chips de categoria, painel inferior de filtros, filtros na URL,
   contador, "Limpar", estado vazio.
4. **Produto + WhatsApp** — `/bones/[slug]`, troca de cor, lupa no desktop e foto
   em tela cheia no celular, preço, mensagem com link do produto, imagem de
   compartilhamento, registro de cliques.
5. **Narrativa** — marcas (lista tipográfica), "A casa" com foto revelada por
   máscara, "Nas ruas" em faixa com scroll-snap, visite a loja, CTA final, SEO.
6. **Polimento e publicação** — QA, acessibilidade, performance, Vercel.
7. **Painel administrativo** — produtos, marcas, categorias, cores, textos,
   contatos, horários, preços e métricas (cliques no WhatsApp por produto,
   produtos mais vistos, filtros mais usados).
8. **Evoluções** — lista "Separar para mim", girar o boné com o dedo, boné do
   hero pousando no card.

### Inventário de animações

| Animação | Função | Técnica |
|---|---|---|
| Hero (selo, giro, assinatura) | A marca virando produto | GSAP ScrollTrigger + canvas |
| Hero → catálogo | Continuidade | GSAP, mesma timeline |
| Texto que rola nos links | Resposta tátil discreta | CSS |
| Revelação da foto em "A casa" | Repetir a máscara do hero | CSS ao entrar na tela |
| Painel de filtros | Mostrar de onde vem | CSS |
| Lupa no produto | Ver bordado e costura | Pointer events + CSS |

### Materiais da loja

Logo em alta ou vetorial; 72 fotos em 360° de um boné (tripé fixo, luz difusa,
recorte de luz para boné preto, primeira foto no ângulo do desenho da logo);
fotos de catálogo padronizadas (¾, perfil, traseira, detalhe, fundo único, 4:5);
planilha de produtos (marca, nome, categoria, cor, fechamento, preço,
disponibilidade, código); WhatsApp, Instagram, endereço, horários, marcas,
diferenciais confirmados, formas de pagamento e entrega.
