import type { ConfiguracaoSite } from "../tipos";

/*
 * Informações institucionais. Os campos nulos aguardam os dados da loja
 * (WhatsApp, Instagram, endereço, horários) e ficam ocultos no site até lá.
 */
export const configuracaoSite: ConfiguracaoSite = {
  nome: "Cap Store Cariri",
  assinatura: "Seu estilo. Sua identidade.",
  regiao: "Cariri · Ceará",
  descricao:
    "Bonés selecionados no Cariri. Conheça a coleção da Cap Store e fale com a loja pelo WhatsApp.",
  whatsapp: null,
  instagram: null,
  endereco: null,
  linkMapa: null,
  horarios: [],
  exibirPrecos: true,
};
