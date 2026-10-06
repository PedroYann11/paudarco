import type { TomCategoria } from "@/content/tipos";

/*
 * Classes de cada fundo de estilo. Nos fundos claros o texto pequeno fica em
 * grafite (o dourado só aparece em tamanho grande); no carvão, papel e ouro claro.
 */
export interface ClassesTom {
  fundo: string;
  texto: string;
  suave: string;
  acento: string;
  filete: string;
  escuro: boolean;
}

const CLARO = {
  texto: "text-grafite",
  suave: "text-grafite/75",
  acento: "text-ouro-texto",
  filete: "bg-ouro",
  escuro: false,
};

export const TONS: Record<TomCategoria, ClassesTom> = {
  linho: { fundo: "bg-linho", ...CLARO },
  areia: { fundo: "bg-areia", ...CLARO },
  nevoa: { fundo: "bg-nevoa", ...CLARO },
  carvao: {
    fundo: "bg-carvao",
    texto: "text-papel",
    suave: "text-prata",
    acento: "text-ouro-claro",
    filete: "bg-ouro-claro",
    escuro: true,
  },
};

export const tomDe = (tom: TomCategoria | undefined) => TONS[tom ?? "linho"];
