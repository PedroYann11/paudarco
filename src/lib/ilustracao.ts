import type { ModeloBone } from "@/components/bone/IlustracaoBone";
import type { Produto } from "@/content/tipos";

/* Forma usada pela ilustração enquanto o produto não tem foto. */
export function modeloIlustracao(produto: Produto): ModeloBone {
  if (produto.categoriaId === "trucker") return "trucker";
  if (produto.categoriaId === "dad-hat") return "dad";
  return produto.aba === "reta" ? "reta" : "curva";
}
