import type { Marca, Produto, Variante } from "@/content/tipos";

import { formatarPreco, precoAtual } from "./preco";

/*
 * Links e mensagens do WhatsApp. Sem número cadastrado, o link abre o WhatsApp
 * para a pessoa escolher a conversa, com a mensagem já escrita.
 */
export function linkWhatsApp(numero: string | null, mensagem?: string): string {
  const base = `https://wa.me/${numero ? numero.replace(/\D/g, "") : ""}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export function mensagemProduto(
  produto: Produto,
  marca: Marca | undefined,
  variante: Variante,
  exibirPreco: boolean,
): string {
  const nome = [marca?.nome, produto.nome].filter(Boolean).join(" ");
  const preco = precoAtual(produto);
  const valor = exibirPreco && preco !== null ? ` (${formatarPreco(preco)})` : "";
  const codigo = variante.codigo ? ` — ref. ${variante.codigo}` : "";
  return `Olá, Cap Store! Tenho interesse no boné ${nome}, cor ${variante.cor}${valor}${codigo}. Ainda tem disponível?`;
}
