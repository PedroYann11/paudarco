import Link from "next/link";

import { IconeInstagram, IconeWhatsApp } from "@/components/ui/IconesMarca";
import { linkInstagram, obterConfiguracao } from "@/lib/site";
import { linkWhatsApp } from "@/lib/whatsapp";

/*
 * Cabeçalho enxuto: nome da marca à esquerda e atalhos de contato à direita.
 * Os atalhos só aparecem quando o contato estiver cadastrado.
 */
export async function Cabecalho() {
  const site = await obterConfiguracao();

  return (
    <header className="envelope flex h-16 items-center justify-between">
      <Link
        href="/"
        className="font-display text-[0.95rem] font-bold uppercase italic leading-none tracking-[0.04em]"
      >
        Cap Store <span className="text-ouro-texto">Cariri</span>
      </Link>

      {site.whatsapp || site.instagram ? (
        <nav aria-label="Contato" className="-mr-2.5 flex items-center">
          {site.instagram ? (
            <a
              href={linkInstagram(site.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center transition-colors duration-200 hover:text-ouro-texto"
            >
              <IconeInstagram titulo="Instagram da Cap Store Cariri" width={19} height={19} />
            </a>
          ) : null}
          {site.whatsapp ? (
            <a
              href={linkWhatsApp(site.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center transition-colors duration-200 hover:text-ouro-texto"
            >
              <IconeWhatsApp titulo="Falar pelo WhatsApp" width={19} height={19} />
            </a>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
