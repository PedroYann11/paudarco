import { configuracaoSite } from "@/content/dados/site";
import type { ConfiguracaoSite } from "@/content/tipos";

export async function obterConfiguracao(): Promise<ConfiguracaoSite> {
  return configuracaoSite;
}

export function linkInstagram(usuario: string): string {
  return `https://www.instagram.com/${usuario}/`;
}
