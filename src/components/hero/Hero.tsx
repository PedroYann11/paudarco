"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { IlustracaoBone, type ModeloBone } from "@/components/bone/IlustracaoBone";
import { Selo } from "@/components/marca/Selo";
import { Rotulo } from "@/components/ui/Rotulo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Abertura: a logo vira produto.
 *   1. o selo encolhe e assume o lugar no cabeçalho;
 *   2. o traço dourado do boné (o mesmo da logo) se desenha no centro;
 *   3. a assinatura entra por máscara, linha a linha;
 *   4. a vitrine abre a partir da "prateleira" e o traço vira o boné de verdade;
 *   5. a legenda do destaque leva ao catálogo.
 * A seção fica presa com `position: sticky`; o GSAP só controla a timeline.
 * Com movimento reduzido, mostra direto a composição final, sem rolagem presa.
 */
interface HeroProps {
  assinatura: string;
  regiao: string;
  destaque: {
    marca: string;
    nome: string;
    modelo: ModeloBone;
    abaReta: boolean;
    cor: string;
    corSecundaria?: string;
  };
}

export function Hero({ assinatura, regiao, destaque }: HeroProps) {
  const raiz = useRef<HTMLElement>(null);
  const [linha1, linha2] = assinatura.split(/(?<=\.)\s+/);

  useGSAP(
    () => {
      const secao = raiz.current;
      if (!secao) return;
      const q = gsap.utils.selector(secao);
      const palco = q("[data-palco]")[0] as HTMLElement;
      const seloCasa = q("[data-selo-casa]")[0] as HTMLElement;
      const bone = q("[data-bone]")[0] as HTMLElement;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Destino do selo: o selo pequeno do cabeçalho.
        const destinoSelo = () => {
          const alvo = document.querySelector("[data-selo-cabecalho]")?.getBoundingClientRect();
          const casa = seloCasa.getBoundingClientRect();
          const p = palco.getBoundingClientRect();
          if (!alvo) return { x: 0, y: -casa.top, scale: 0.2 };
          return {
            x: alvo.left + alvo.width / 2 - (casa.left - p.left + casa.width / 2),
            y: alvo.top + alvo.height / 2 - (casa.top - p.top + casa.height / 2),
            scale: alvo.width / casa.width,
          };
        };

        // A vitrine nasce como uma linha fina na base do boné: a prateleira.
        const prateleira = () => {
          const b = bone.getBoundingClientRect();
          const p = palco.getBoundingClientRect();
          const base = b.top - p.top + b.height * 0.86;
          const lado = Math.max(0, b.left - p.left + b.width * 0.06);
          const ladoDir = Math.max(0, p.right - b.right + b.width * 0.06);
          return `inset(${base}px ${ladoDir}px ${p.height - base}px ${lado}px)`;
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: secao,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.to(q("[data-dica]"), { autoAlpha: 0, duration: 0.06 }, 0)
          .to(q("[data-rotulo-hero]"), { autoAlpha: 0, y: -12, duration: 0.1 }, 0)
          .to(q("[data-selo]"), {
            x: () => destinoSelo().x,
            y: () => destinoSelo().y,
            scale: () => destinoSelo().scale,
            duration: 0.22,
            ease: "power2.inOut",
          }, 0)
          .set(secao, { attr: { "data-fase": "marca" } }, 0.2)
          .to(q("[data-selo]"), { autoAlpha: 0, duration: 0.02 }, 0.2)
          .set(q("[data-traco-svg]"), { autoAlpha: 1 }, 0.1)
          .to(q("[data-traco]"), { strokeDashoffset: 0, duration: 0.26, stagger: 0.012 }, 0.1)
          .fromTo(
            q("[data-linha]"),
            { yPercent: 110, y: 0 },
            { yPercent: 0, duration: 0.14, stagger: 0.08, ease: "power3.out" },
            0.3,
          )
          .fromTo(
            q("[data-vitrine]"),
            { clipPath: prateleira },
            { clipPath: "inset(0px 0px 0px 0px)", duration: 0.26, ease: "power2.inOut" },
            0.56,
          )
          .to(q("[data-traco-svg]"), { "--fundo-traco": "#ecebe7", duration: 0.05 }, 0.56)
          .fromTo(q("[data-bone-cheio]"), { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.16, ease: "power2.out" }, 0.64)
          .to(q("[data-traco-svg]"), { autoAlpha: 0, duration: 0.12 }, 0.7)
          .fromTo(q("[data-legenda]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.84)
          .set(secao, { attr: { "data-fase": "fim" } }, 1);

        // Medidas dependem das fontes (altura da assinatura) e do cabeçalho.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });

      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <section
      ref={raiz}
      id="hero"
      data-fase="abertura"
      aria-labelledby="assinatura"
      className="relative -mt-16 h-svh motion-safe:h-[250svh] lg:motion-safe:h-[270svh]"
    >
      <div data-palco className="sticky top-0 h-svh overflow-hidden">
        {/* vitrine em linho: abre por trás do boné */}
        <div
          data-vitrine
          aria-hidden="true"
          className="hero-vitrine absolute inset-0 bg-linho"
        />

        {/* região, no topo */}
        <div data-rotulo-hero className="absolute inset-x-0 top-[13svh] motion-reduce:hidden lg:top-[14svh]">
          <Rotulo>{regiao}</Rotulo>
        </div>

        {/* boné: traço dourado e versão preenchida, empilhados na mesma posição */}
        <div
          data-bone
          className="absolute left-1/2 top-[35%] w-[94vw] max-w-[40rem] -translate-x-1/2 -translate-y-1/2 lg:left-[71%] lg:top-[47%] lg:w-[40vw] lg:max-w-[46rem]"
        >
          <div
            data-traco-svg
            className="hero-traco absolute inset-0 text-ouro motion-reduce:hidden"
            style={{ "--fundo-traco": "#f6f5f2" } as React.CSSProperties}
          >
            <IlustracaoBone
              modelo={destaque.modelo}
              abaReta={destaque.abaReta}
              modo="traco"
              className="h-auto w-full"
            />
          </div>
          <div data-bone-cheio className="hero-cheio relative">
            <IlustracaoBone
              modelo={destaque.modelo}
              abaReta={destaque.abaReta}
              cor={destaque.cor}
              corSecundaria={destaque.corSecundaria}
              titulo={`Boné ${destaque.marca} ${destaque.nome}`}
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* selo: a casa fica parada, o miolo é o que viaja até o cabeçalho */}
        <div
          data-selo-casa
          className="absolute left-1/2 top-[44%] w-[62vw] max-w-[18.75rem] -translate-x-1/2 -translate-y-1/2 motion-reduce:hidden lg:top-1/2"
        >
          <div data-selo className="origin-center will-change-transform">
            <Selo preload sizes="(min-width: 768px) 300px, 62vw" className="h-auto w-full" />
          </div>
        </div>

        {/* assinatura */}
        <h1
          id="assinatura"
          className="absolute inset-x-0 top-[60%] text-center font-display text-[clamp(2.75rem,12.5vw,5.75rem)] font-bold uppercase italic leading-[0.92] lg:left-[max(2rem,calc((100vw-72rem)/2))] lg:right-auto lg:top-1/2 lg:-translate-y-1/2 lg:text-left lg:text-[clamp(3.5rem,5.4vw,6.25rem)]"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-linha className="hero-linha block">
              {linha1}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-linha className="hero-linha block">
              {linha2}
            </span>
          </span>
        </h1>

        {/* legenda do destaque, aparece no fim da abertura */}
        <div
          data-legenda
          className="hero-legenda absolute inset-x-0 bottom-[6svh] flex flex-col items-center gap-3 text-center lg:bottom-[8svh] lg:left-[max(2rem,calc((100vw-72rem)/2))] lg:right-auto lg:items-start lg:text-left"
        >
          <p className="text-[0.6875rem] font-medium uppercase tracking-rotulo text-ouro-texto">
            Em destaque · {destaque.marca} {destaque.nome}
          </p>
          <a
            href="#colecao"
            className="group inline-flex items-center gap-3 text-[0.8125rem] font-medium uppercase tracking-botao"
          >
            <span className="texto-rolante" data-texto="Ver a coleção">
              <span>Ver a coleção</span>
            </span>
            <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className="transition-transform duration-300 ease-marca group-hover:translate-y-0.5">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>

        {/* dica de rolagem */}
        <div
          data-dica
          aria-hidden="true"
          className="absolute bottom-[4svh] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 motion-reduce:hidden"
        >
          <span className="text-[0.625rem] uppercase tracking-rotulo text-grafite-suave">Role</span>
          <span className="dica-linha block h-8 w-px bg-ouro" />
        </div>
      </div>
    </section>
  );
}
