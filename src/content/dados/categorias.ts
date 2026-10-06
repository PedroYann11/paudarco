import type { Categoria } from "../tipos";

/*
 * Estilos da loja. Cada um tem uma personalidade (o "apelido") e um fundo
 * próprio: a escolha do boné começa pela identidade, não pela especificação.
 */
export const categorias: Categoria[] = [
  {
    id: "aba-curva",
    slug: "aba-curva",
    nome: "Aba curva",
    apelido: "O clássico",
    descricao: "Copa estruturada e aba curvada. Vai com tudo, do dia a dia ao rolê.",
    tom: "linho",
    ordem: 1,
  },
  {
    id: "aba-reta",
    slug: "aba-reta",
    nome: "Aba reta",
    apelido: "O arretado",
    descricao: "Aba reta e frente alta. Pra quem chega e já é notado.",
    tom: "carvao",
    ordem: 2,
  },
  {
    id: "trucker",
    slug: "trucker",
    nome: "Trucker",
    apelido: "O estradeiro",
    descricao: "Frente firme e tela atrás. Fresco no sol do Cariri.",
    tom: "areia",
    ordem: 3,
  },
  {
    id: "dad-hat",
    slug: "dad-hat",
    nome: "Dad hat",
    apelido: "O sossegado",
    descricao: "Copa macia, sem estrutura. Conforto de quem não tem pressa.",
    tom: "nevoa",
    ordem: 4,
  },
];
