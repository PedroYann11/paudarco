import type { ElementType, ReactNode } from "react";

/*
 * Microrrótulo no padrão "— CARIRI —" da logo: caixa alta espaçada, ladeada por
 * filetes dourados. `alinhamento="inicio"` mantém só o filete da esquerda.
 */
interface RotuloProps {
  children: ReactNode;
  alinhamento?: "centro" | "inicio";
  tom?: "claro" | "escuro";
  como?: ElementType;
  className?: string;
}

export function Rotulo({
  children,
  alinhamento = "centro",
  tom = "claro",
  como: Tag = "p",
  className = "",
}: RotuloProps) {
  const filete = tom === "claro" ? "bg-ouro" : "bg-ouro-claro/70";
  const texto = tom === "claro" ? "text-ouro-texto" : "text-ouro-claro";

  return (
    <Tag
      className={`flex items-center gap-3 text-[0.6875rem] font-medium uppercase leading-none tracking-rotulo ${texto} ${
        alinhamento === "centro" ? "justify-center" : ""
      } ${className}`}
    >
      <span aria-hidden="true" className={`h-px w-6 ${filete}`} />
      <span>{children}</span>
      {alinhamento === "centro" ? (
        <span aria-hidden="true" className={`h-px w-6 ${filete}`} />
      ) : null}
    </Tag>
  );
}
