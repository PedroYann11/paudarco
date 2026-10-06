import type { Marca, Produto, Variante } from "@/content/tipos";

import { Preco } from "./Preco";
import { VisualProduto } from "./VisualProduto";

/*
 * Card do catálogo. Sem borda e sem sombra: o tile em linho e a tipografia
 * fazem o trabalho. O card inteiro é o botão que abre o detalhe rápido.
 */
interface CardProdutoProps {
  produto: Produto;
  marca: Marca | undefined;
  variante: Variante;
  exibirPreco: boolean;
  aoAbrir: () => void;
}

export function CardProduto({ produto, marca, variante, exibirPreco, aoAbrir }: CardProdutoProps) {
  const esgotado = produto.status === "esgotado";
  const selo = esgotado ? "Esgotado" : produto.novo ? "Novo" : null;

  return (
    <button
      type="button"
      onClick={aoAbrir}
      className="group flex w-full flex-col text-left"
      aria-label={`${marca?.nome ?? ""} ${produto.nome}, ${variante.cor}`.trim()}
    >
      <div className="relative grid aspect-[4/5] w-full place-items-center overflow-hidden bg-linho">
        <VisualProduto
          produto={produto}
          variante={variante}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
          className={`transition-transform duration-500 ease-marca group-hover:-translate-y-1 group-hover:scale-[1.03] ${
            esgotado ? "opacity-55 grayscale-[35%]" : ""
          }`}
        />
        {selo ? (
          <span
            className={`absolute left-2.5 top-2.5 text-[0.625rem] font-medium uppercase tracking-rotulo ${
              esgotado ? "text-grafite-suave" : "text-ouro-texto"
            }`}
          >
            {selo}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-0.5 pr-1">
        {marca ? (
          <span className="text-[0.625rem] font-medium uppercase tracking-rotulo text-grafite-suave">
            {marca.nome}
          </span>
        ) : null}
        <span className="text-[0.9375rem] font-medium leading-snug">{produto.nome}</span>
        {exibirPreco ? <Preco produto={produto} className="text-sm" /> : null}
        {produto.variantes.length > 1 ? (
          <span className="mt-1.5 flex items-center gap-1.5" aria-label={`${produto.variantes.length} cores`}>
            {produto.variantes.slice(0, 4).map((v) => (
              <span
                key={v.id}
                className={`size-2.5 rounded-full ring-1 ring-grafite/15 ${
                  v.id === variante.id ? "outline outline-1 outline-offset-2 outline-grafite/50" : ""
                }`}
                style={{ backgroundColor: v.hex }}
              />
            ))}
          </span>
        ) : null}
      </div>
    </button>
  );
}
