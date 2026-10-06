import type { Produto } from "@/content/tipos";
import { emPromocao, formatarPreco, precoAtual } from "@/lib/preco";

export function Preco({ produto, className = "" }: { produto: Produto; className?: string }) {
  const atual = precoAtual(produto);

  if (atual === null) {
    return <p className={`text-grafite-suave ${className}`}>Sob consulta</p>;
  }

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 tabular-nums ${className}`}>
      <span>{formatarPreco(atual)}</span>
      {emPromocao(produto) && produto.preco !== null ? (
        <s className="text-[0.85em] text-grafite-suave">{formatarPreco(produto.preco)}</s>
      ) : null}
    </p>
  );
}
