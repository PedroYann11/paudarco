/*
 * Link para conversa no WhatsApp. As mensagens por contexto (produto, visita,
 * atendimento geral) entram na etapa 3; aqui fica só a montagem do link.
 */
export function linkWhatsApp(numero: string, mensagem?: string): string {
  const base = `https://wa.me/${numero.replace(/\D/g, "")}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
