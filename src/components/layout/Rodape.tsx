import { cacheLife } from "next/cache";

import { Selo } from "@/components/marca/Selo";
import { IconeInstagram, IconeWhatsApp } from "@/components/ui/IconesMarca";
import { Rotulo } from "@/components/ui/Rotulo";
import { linkInstagram, obterConfiguracao } from "@/lib/site";
import { linkWhatsApp } from "@/lib/whatsapp";

async function AnoAtual() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

/*
 * Rodapé em carvão, só com o prático: marca, contatos, endereço e horários.
 * Cada bloco só aparece quando a informação correspondente estiver cadastrada.
 */
export async function Rodape() {
  const site = await obterConfiguracao();
  const temContato = Boolean(site.whatsapp || site.instagram);
  const temEndereco = Boolean(site.endereco);
  const temHorarios = site.horarios.length > 0;

  return (
    <footer className="bg-carvao text-prata">
      <div className="envelope py-16 md:py-20">
        <div className="flex flex-col items-center text-center">
          <Selo sizes="88px" className="h-auto w-[5.5rem]" />
          <Rotulo tom="escuro" className="mt-6">
            {site.regiao}
          </Rotulo>
        </div>

        {temContato || temEndereco || temHorarios ? (
          <div className="mt-14 grid gap-10 border-t border-papel/10 pt-10 text-sm sm:grid-cols-3">
            {temContato ? (
              <div>
                <Rotulo como="h2" alinhamento="inicio" tom="escuro">
                  Contato
                </Rotulo>
                <ul className="mt-4 space-y-3">
                  {site.whatsapp ? (
                    <li>
                      <a
                        href={linkWhatsApp(site.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 transition-colors hover:text-papel"
                      >
                        <IconeWhatsApp width={16} height={16} />
                        WhatsApp
                      </a>
                    </li>
                  ) : null}
                  {site.instagram ? (
                    <li>
                      <a
                        href={linkInstagram(site.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 transition-colors hover:text-papel"
                      >
                        <IconeInstagram width={16} height={16} />@{site.instagram}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {temEndereco ? (
              <div>
                <Rotulo como="h2" alinhamento="inicio" tom="escuro">
                  Endereço
                </Rotulo>
                <address className="mt-4 not-italic leading-relaxed">{site.endereco}</address>
                {site.linkMapa ? (
                  <a
                    href={site.linkMapa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-ouro-claro underline decoration-ouro-claro/40 underline-offset-4 transition-colors hover:decoration-ouro-claro"
                  >
                    Como chegar
                  </a>
                ) : null}
              </div>
            ) : null}

            {temHorarios ? (
              <div>
                <Rotulo como="h2" alinhamento="inicio" tom="escuro">
                  Horários
                </Rotulo>
                <dl className="mt-4 space-y-2">
                  {site.horarios.map((h) => (
                    <div key={h.dias} className="flex justify-between gap-4 sm:block">
                      <dt>{h.dias}</dt>
                      <dd className="tabular-nums text-papel">{h.horario}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        ) : null}

        <p className="mt-14 text-center text-xs text-prata/70">
          © <AnoAtual /> {site.nome}
        </p>
      </div>
    </footer>
  );
}
