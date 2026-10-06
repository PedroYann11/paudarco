import { Selo } from "@/components/marca/Selo";
import { Estrela } from "@/components/ui/Estrela";
import { Rotulo } from "@/components/ui/Rotulo";
import { obterConfiguracao } from "@/lib/site";

/*
 * Abertura estática: selo, assinatura e região. É a composição de partida do
 * hero animado e continuará sendo a versão exibida com movimento reduzido.
 */
export default async function Inicio() {
  const site = await obterConfiguracao();
  const [estilo, identidade] = site.assinatura.split(/(?<=\.)\s+/);

  return (
    <section
      aria-labelledby="assinatura"
      className="envelope flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center pb-16 pt-6 text-center"
    >
      <Rotulo>{site.regiao}</Rotulo>

      <Selo
        preload
        sizes="(min-width: 768px) 300px, 62vw"
        className="mt-8 h-auto w-[62vw] max-w-[18.75rem]"
      />

      <h1
        id="assinatura"
        className="mt-10 font-display text-[clamp(2.75rem,12vw,5.75rem)] font-bold uppercase italic leading-[0.92]"
      >
        <span className="block">{estilo}</span>
        <span className="block">{identidade}</span>
      </h1>

      <Estrela className="mt-9 text-ouro" />
    </section>
  );
}
