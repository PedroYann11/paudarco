/*
 * Modelo de dados do site. Hoje os dados vivem em arquivos dentro de
 * `src/content/dados`; quando o painel administrativo existir, eles passam a
 * vir do banco sem que os componentes precisem mudar, porque todo acesso
 * passa por `src/lib/catalogo.ts` e `src/lib/site.ts`.
 */

export type StatusProduto = "ativo" | "pausado" | "esgotado";

export type FamiliaCor =
  | "preto"
  | "branco"
  | "off-white"
  | "bege"
  | "marrom"
  | "cinza"
  | "azul"
  | "verde"
  | "vermelho"
  | "rosa"
  | "amarelo"
  | "colorido";

export type TipoAba = "curva" | "reta";

export type Fechamento = "snapback" | "strapback" | "fitted" | "elastico";

export type AnguloImagem = "tres-quartos" | "frente" | "perfil" | "traseira" | "detalhe";

export interface Marca {
  id: string;
  slug: string;
  nome: string;
  ordem: number;
}

export interface Categoria {
  id: string;
  slug: string;
  nome: string;
  descricao?: string;
  ordem: number;
}

export interface ImagemProduto {
  src: string;
  alt: string;
  angulo: AnguloImagem;
  largura: number;
  altura: number;
}

/* Cada colorway é uma variante: muda a cor, as fotos e a disponibilidade. */
export interface Variante {
  id: string;
  cor: string; // nome exibido, ex.: "Preto fosco"
  familia: FamiliaCor; // usado no filtro
  hex: string; // usado na bolinha de cor
  hexSecundario?: string; // segunda cor (tela do trucker, tira traseira)
  imagens: ImagemProduto[]; // vazio = o site mostra o tile provisório
  disponivel: boolean;
  codigo?: string; // referência interna da loja, vai na mensagem do WhatsApp
}

export interface Produto {
  id: string;
  slug: string;
  nome: string;
  marcaId: string;
  categoriaId: string;
  aba: TipoAba;
  fechamento: Fechamento;
  descricaoCurta?: string;
  preco: number | null; // null = "sob consulta"
  precoPromocional?: number | null;
  status: StatusProduto;
  destaque: boolean;
  novo: boolean;
  ordem: number;
  variantes: Variante[];
}

export interface HorarioFuncionamento {
  dias: string; // ex.: "Segunda a sexta"
  horario: string; // ex.: "9h às 18h"
}

export interface ConfiguracaoSite {
  nome: string;
  assinatura: string;
  regiao: string;
  descricao: string;
  /* Contatos ficam nulos até a loja confirmar; o site só mostra o que existir. */
  whatsapp: string | null; // só dígitos, com DDI e DDD: 5588XXXXXXXXX
  instagram: string | null; // usuário sem @
  endereco: string | null;
  linkMapa: string | null;
  horarios: HorarioFuncionamento[];
  exibirPrecos: boolean;
}
