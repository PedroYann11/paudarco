import Image from "next/image";

import { IlustracaoBone } from "@/components/bone/IlustracaoBone";
import type { Produto, Variante } from "@/content/tipos";
import { modeloIlustracao } from "@/lib/catalogo";

/*
 * Imagem do produto: a primeira foto da variante quando existir; enquanto não
 * houver fotos, o boné ilustrado na cor da variante.
 */
interface VisualProdutoProps {
  produto: Produto;
  variante: Variante;
  sizes: string;
  className?: string;
}

export function VisualProduto({ produto, variante, sizes, className = "" }: VisualProdutoProps) {
  const foto = variante.imagens[0];

  if (foto) {
    return (
      <Image
        src={foto.src}
        alt={foto.alt}
        width={foto.largura}
        height={foto.altura}
        sizes={sizes}
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }

  return (
    <IlustracaoBone
      modelo={modeloIlustracao(produto)}
      abaReta={produto.aba === "reta"}
      cor={variante.hex}
      corSecundaria={variante.hexSecundario}
      className={`w-[88%] ${className}`}
    />
  );
}
