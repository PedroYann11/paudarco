import Link from "next/link";

import { Selo } from "@/components/marca/Selo";
import { IconeInstagram, IconeWhatsApp } from "@/components/ui/IconesMarca";
import { linkInstagram, obterConfiguracao } from "@/lib/site";
import { linkWhatsApp } from "@/lib/whatsapp";

/*
 * Cabeçalho fixo no topo. Na página inicial ele começa transparente e o selo
 * só aparece quando o selo do hero chega até aqui (regras em globals.css).
 */
export async function Cabecalho() {
  const site = await obterConfiguracao();

  return (
    <header className="cabecalho sticky top-0 z-40 border-b border-filete bg-papel transition-colors duration-300">
      <div className="envelope flex h-16 items-center justify-between">
        <Link href="/" className="cabecalho-marca flex items-center gap-2.5 transition-opacity duration-300">
          <span data-selo-cabecalho className="block size-9">
            <Selo sizes="36px" decorativo className="h-auto w-full" />
          </span>
          <span className="font-display text-[0.95rem] font-bold uppercase italic leading-none tracking-[0.04em]">
            Cap Store <span className="text-ouro-texto">Cariri</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="-mr-2.5 flex items-center">
          <Link
            href="/#colecao"
            className="group hidden px-3 py-2 text-[0.75rem] font-medium uppercase tracking-botao sm:block"
          >
            <span className="texto-rolante" data-texto="Coleção">
              <span>Coleção</span>
            </span>
          </Link>
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
          <a
            href={linkWhatsApp(site.whatsapp, "Olá, Cap Store! Vim pelo site e queria ajuda para escolher um boné.")}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center transition-colors duration-200 hover:text-ouro-texto"
          >
            <IconeWhatsApp titulo="Falar pelo WhatsApp" width={19} height={19} />
          </a>
        </nav>
      </div>
    </header>
  );
}
