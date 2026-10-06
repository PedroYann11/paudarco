"use client";

import { useEffect, useRef, useState } from "react";

import { IlustracaoBone, type ModeloBone } from "@/components/bone/IlustracaoBone";
import type { Categoria } from "@/content/tipos";

import { tomDe } from "./tons";

/*
 * O "cardápio" de estilos: um card grande por categoria, como capa de revista —
 * nome enorme, um boné na frente sobrepondo o texto e outro atrás. Rola na
 * horizontal com encaixe (scroll-snap), sem biblioteca.
 */

export interface BoneDoEstilo {
  modelo: ModeloBone;
  abaReta: boolean;
  cor: string;
  corSecundaria?: string;
}

export interface Estilo {
  categoria: Categoria;
  total: number;
  bones: BoneDoEstilo[]; // [frente, fundo]
}

interface CarrosselEstilosProps {
  estilos: Estilo[];
  ativo: string;
  aoEscolher: (id: string) => void;
}

export function CarrosselEstilos({ estilos, ativo, aoEscolher }: CarrosselEstilosProps) {
  const trilho = useRef<HTMLUListElement>(null);
  const [visivel, setVisivel] = useState(0);

  // Card mais próximo do início do trilho: alimenta o contador "01 / 04".
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    let quadro = 0;
    const medir = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const cards = Array.from(el.children) as HTMLElement[];
        const inicio = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");
        let melhor = 0;
        let menor = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.getBoundingClientRect().left - inicio);
          if (d < menor) {
            menor = d;
            melhor = i;
          }
        });
        // no fim do trilho o último card não chega ao início: considera o último
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) melhor = cards.length - 1;
        setVisivel(melhor);
      });
    };
    el.addEventListener("scroll", medir, { passive: true });
    return () => {
      el.removeEventListener("scroll", medir);
      cancelAnimationFrame(quadro);
    };
  }, []);

  function rolar(direcao: 1 | -1) {
    const el = trilho.current;
    const card = el?.children[0] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollBy({ left: direcao * (card.offsetWidth + 12), behavior: "smooth" });
  }

  const total = estilos.length;

  return (
    <div>
      <ul
        ref={trilho}
        aria-label="Estilos"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-1 [scroll-padding-inline:1.25rem] [scrollbar-width:none] md:px-[max(1.25rem,calc((100vw-72rem)/2))] md:[scroll-padding-inline:max(1.25rem,calc((100vw-72rem)/2))] [&::-webkit-scrollbar]:hidden"
      >
        {estilos.map((estilo, i) => (
          <CardEstilo
            key={estilo.categoria.id}
            estilo={estilo}
            indice={i}
            ativo={estilo.categoria.id === ativo}
            aoEscolher={() => aoEscolher(estilo.categoria.id)}
          />
        ))}
      </ul>

      <div className="envelope mt-5 flex items-center justify-between gap-6">
        <div className="flex flex-1 items-center gap-4">
          <span className="text-xs font-medium tabular-nums tracking-[0.12em]" aria-hidden="true">
            {String(visivel + 1).padStart(2, "0")}
            <span className="text-grafite-suave"> / {String(total).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px max-w-48 flex-1 bg-filete" aria-hidden="true">
            <span
              className="absolute inset-y-0 left-0 bg-ouro transition-[width] duration-500 ease-marca"
              style={{ width: `${((visivel + 1) / total) * 100}%` }}
            />
          </span>
        </div>
        <div className="hidden gap-2 md:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => rolar(d)}
              className="grid size-11 place-items-center rounded-full border border-filete transition-colors duration-200 hover:border-grafite"
            >
              <span className="sr-only">{d < 0 ? "Estilo anterior" : "Próximo estilo"}</span>
              <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d={d < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardEstilo({
  estilo,
  indice,
  ativo,
  aoEscolher,
}: {
  estilo: Estilo;
  indice: number;
  ativo: boolean;
  aoEscolher: () => void;
}) {
  const { categoria, total, bones } = estilo;
  const t = tomDe(categoria.tom);
  const [frente, fundo] = bones;
  const palavras = categoria.nome.split(" ");
  // nome o maior possível sem passar da largura do card: palavras longas encolhem
  const maior = Math.max(...palavras.map((p) => p.length));
  const tamanhoNome = Math.min(21, 84 / (maior * 0.64));

  return (
    <li className="estilo-card w-[82vw] shrink-0 snap-start sm:w-[22rem] lg:w-[23.5rem]">
      <button
        type="button"
        onClick={aoEscolher}
        aria-pressed={ativo}
        aria-label={`${categoria.nome}, ${categoria.apelido ?? ""}: ver ${total} modelos`}
        className={`group relative block aspect-[4/5.3] w-full overflow-hidden text-left [container-type:inline-size] ${t.fundo} ${t.texto}`}
      >
        {/* topo: número e quantidade */}
        <span className="absolute inset-x-[6cqw] top-[6cqw] flex items-center justify-between text-[3.4cqw] font-medium uppercase tracking-[0.18em]">
          <span>{String(indice + 1).padStart(2, "0")}</span>
          <span className={t.suave}>
            {total} {total === 1 ? "modelo" : "modelos"}
          </span>
        </span>

        {/* boné de fundo */}
        {fundo ? (
          <span className="absolute right-[-14cqw] top-[15cqw] w-[66cqw] rotate-[9deg] transition-transform duration-700 ease-marca group-hover:translate-x-[-2cqw] group-hover:rotate-[12deg]">
            <IlustracaoBone {...fundo} sombra={false} className="h-auto w-full" />
          </span>
        ) : null}

        {/* nome do estilo, enorme, entre os dois bonés */}
        <span
          aria-hidden="true"
          className="absolute left-[5cqw] top-[22cqw] font-display font-bold uppercase italic leading-[0.8] tracking-[-0.01em]"
          style={{ fontSize: `${tamanhoNome}cqw` }}
        >
          {palavras.map((p) => (
            <span key={p} className="block">
              {p}
            </span>
          ))}
        </span>

        {/* boné da frente */}
        {frente ? (
          <span className="absolute bottom-[30cqw] left-[3cqw] w-[94cqw] -rotate-[5deg] transition-transform duration-700 ease-marca group-hover:-translate-y-[2cqw] group-hover:-rotate-[7deg]">
            <IlustracaoBone {...frente} className="h-auto w-full drop-shadow-[0_18px_22px_rgb(0_0_0/0.18)]" />
          </span>
        ) : null}

        {/* rodapé do card: personalidade, descrição e chamada */}
        <span className="absolute inset-x-[6cqw] bottom-[6cqw] flex items-end justify-between gap-[4cqw]">
          <span className="flex flex-col gap-[1.6cqw]">
            {categoria.apelido ? (
              <span className={`font-display text-[7.4cqw] font-bold uppercase italic leading-none ${t.acento}`}>
                {categoria.apelido}
              </span>
            ) : null}
            {categoria.descricao ? (
              <span className={`max-w-[56cqw] text-[3.7cqw] leading-snug ${t.suave}`}>{categoria.descricao}</span>
            ) : null}
          </span>
          <span
            className={`grid size-[13cqw] shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
              t.escuro
                ? "border-papel/30 group-hover:border-papel group-hover:bg-papel group-hover:text-carvao"
                : "border-grafite/25 group-hover:border-grafite group-hover:bg-grafite group-hover:text-papel"
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="w-[45%]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>

        {/* marca do estilo escolhido */}
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-[1.2cqw] origin-left transition-transform duration-500 ease-marca ${t.filete} ${
            ativo ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </button>
    </li>
  );
}
