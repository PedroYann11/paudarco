import type { Produto } from "@/content/tipos";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatarPreco(valor: number): string {
  return moeda.format(valor);
}

/* Preço que vale agora: o promocional, quando existir e for menor. */
export function precoAtual(produto: Produto): number | null {
  const { preco, precoPromocional } = produto;
  if (preco === null) return null;
  return precoPromocional != null && precoPromocional < preco ? precoPromocional : preco;
}

export function emPromocao(produto: Produto): boolean {
  const atual = precoAtual(produto);
  return atual !== null && produto.preco !== null && atual < produto.preco;
}
