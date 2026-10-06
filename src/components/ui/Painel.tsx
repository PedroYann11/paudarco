"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Painel sobre a página, construído no <dialog> nativo (foco preso, Esc fecha,
 * fundo escurecido). No celular sobe da base da tela, onde o polegar alcança;
 * no desktop vira gaveta lateral ("lateral") ou janela central ("central").
 */
interface PainelProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  ocultarTitulo?: boolean;
  variante?: "lateral" | "central";
  children: ReactNode;
  rodape?: ReactNode;
}

export function Painel({
  aberto,
  aoFechar,
  titulo,
  ocultarTitulo = false,
  variante = "lateral",
  children,
  rodape,
}: PainelProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      className={`painel painel-${variante}`}
      onClose={aoFechar}
      onClick={(e) => {
        // clique no fundo escurecido (fora da caixa) fecha
        if (e.target === e.currentTarget) aoFechar();
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-3 md:px-7 md:pt-6">
          <span aria-hidden="true" className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-filete md:hidden" />
          <h2
            className={
              ocultarTitulo
                ? "sr-only"
                : "pt-3 font-display text-lg font-bold uppercase italic leading-none md:pt-0"
            }
          >
            {titulo}
          </h2>
          <button
            type="button"
            onClick={aoFechar}
            className="-mr-2 ml-auto grid size-11 place-items-center text-grafite-suave transition-colors hover:text-grafite"
          >
            <span className="sr-only">Fechar</span>
            <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 md:px-7">{children}</div>
        {rodape ? <div className="border-t border-filete px-5 py-4 md:px-7">{rodape}</div> : null}
      </div>
    </dialog>
  );
}
