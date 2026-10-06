import type { Categoria, Marca, Produto, Variante } from "@/content/tipos";

import { Preco } from "./Preco";
import { tomDe } from "./tons";
import { VisualProduto } from "./VisualProduto";

/*
 * O primeiro boné de cada estilo ganha vitrine própria: grande, no fundo do
 * estilo, com nome em display. Abre o mesmo detalhe rápido dos outros cards.
 */
interface CardDestaqueProps {
  produto: Produto;
  marca: Marca | undefined;
  variante: Variante;
  categoria: Categoria | undefined;
  exibirPreco: boolean;
  aoAbrir: () => void;
}

export function CardDestaque({ produto, marca, variante, categoria, exibirPreco, aoAbrir }: CardDestaqueProps) {
  const t = tomDe(categoria?.tom);

  return (
    <button
      type="button"
      onClick={aoAbrir}
      className={`group grid w-full overflow-hidden text-left md:grid-cols-[1.35fr_1fr] ${t.fundo} ${t.texto}`}
    >
      <span className="grid aspect-[4/3] place-items-center md:aspect-auto md:min-h-[26rem]">
        <VisualProduto
          produto={produto}
          variante={variante}
          sizes="(min-width: 768px) 40rem, 100vw"
          className="max-w-[36rem] -rotate-[4deg] transition-transform duration-700 ease-marca group-hover:-translate-y-1.5 group-hover:-rotate-[6deg]"
        />
      </span>
      <span className="flex flex-col justify-end gap-2 px-5 pb-6 md:px-10 md:pb-10">
        <span className={`text-[0.6875rem] font-medium uppercase tracking-rotulo ${t.escuro ? t.acento : t.texto}`}>
          Destaque · {marca?.nome}
        </span>
        <span className="font-display text-[clamp(2.25rem,10vw,3.5rem)] font-bold uppercase italic leading-[0.9]">
          {produto.nome}
        </span>
        {produto.descricaoCurta ? (
          <span className={`max-w-[32ch] text-[0.9375rem] ${t.suave}`}>{produto.descricaoCurta}</span>
        ) : null}
        <span className="mt-3 flex items-center justify-between gap-4">
          {exibirPreco ? <Preco produto={produto} className="text-lg font-medium" /> : <span />}
          <span className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-botao">
            <span className="texto-rolante" data-texto="Ver detalhes">
              <span>Ver detalhes</span>
            </span>
            <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </span>
    </button>
  );
}
