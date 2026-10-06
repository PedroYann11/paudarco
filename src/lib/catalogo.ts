import { categorias } from "@/content/dados/categorias";
import { marcas } from "@/content/dados/marcas";
import { produtos } from "@/content/dados/produtos";
import type { Categoria, Marca, Produto } from "@/content/tipos";

/*
 * Único ponto de acesso aos dados do catálogo. As funções já são assíncronas
 * para que a troca dos arquivos locais pelo banco do painel não mude quem as usa.
 */

const porOrdem = <T extends { ordem: number }>(a: T, b: T) => a.ordem - b.ordem;

/* Produtos visíveis no site: pausados ficam de fora, esgotados continuam aparecendo. */
export async function listarProdutos(): Promise<Produto[]> {
  return produtos.filter((p) => p.status !== "pausado").sort(porOrdem);
}

export async function obterProduto(slug: string): Promise<Produto | null> {
  return produtos.find((p) => p.slug === slug && p.status !== "pausado") ?? null;
}

export async function listarMarcas(): Promise<Marca[]> {
  return [...marcas].sort(porOrdem);
}

export async function listarCategorias(): Promise<Categoria[]> {
  return [...categorias].sort(porOrdem);
}
