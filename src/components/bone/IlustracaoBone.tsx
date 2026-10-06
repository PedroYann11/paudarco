import { useId } from "react";

/*
 * Boné ilustrado em vista ¾ lateral, aba para a esquerda (o mesmo ângulo do
 * desenho da logo). Serve aos produtos enquanto não houver fotos: a cor vem da
 * variante e a forma vem do modelo. No modo "traco" vira o desenho dourado do
 * hero — mesma geometria, para a transição traço → produto ser contínua.
 */

export type ModeloBone = "curva" | "reta" | "dad" | "trucker";

interface Geometria {
  aba: string;
  abaBorda: string;
  pesponto: string[];
  copa: string;
  costuras: string[];
  tela: string;
  botao: [number, number];
  ilhoses: [number, number][];
}

const ABERTURA =
  "M356 206 C356 184 372 168 392 170 C402 172 408 184 406 200 C390 206 372 207 356 206 Z";
const TIRA = "M354 196 C372 194 392 194 408 188 L409 196 C392 202 372 203 355 204 Z";

const CURVA: Geometria = {
  aba: "M292 210 C232 236 112 252 52 230 C30 222 34 206 60 200 C96 192 130 194 152 198 Z",
  abaBorda: "M52 230 C112 252 232 236 292 210 L292 216 C232 244 110 260 47 236 Z",
  pesponto: ["M70 214 C110 226 190 222 252 207", "M84 222 C126 232 200 226 262 212"],
  copa: "M146 204 C132 130 176 58 252 50 C336 44 398 98 412 168 C414 184 410 196 404 200 C330 216 214 218 146 204 Z",
  costuras: [
    "M252 52 C214 84 186 140 182 210",
    "M252 52 C286 96 302 158 302 214",
    "M252 52 C320 74 372 120 392 170",
  ],
  tela: "M252 52 C286 96 302 158 302 214 L420 214 L420 40 Z",
  botao: [252, 50],
  ilhoses: [
    [214, 120],
    [318, 108],
  ],
};

const GEOMETRIAS: Record<Exclude<ModeloBone, "trucker">, Geometria> = {
  curva: CURVA,
  reta: {
    aba: "M300 206 L70 222 C58 223 52 216 60 211 L150 196 Z",
    abaBorda: "M70 222 L300 206 L300 216 L68 233 C56 234 52 227 60 222 Z",
    pesponto: ["M90 216 L276 204", "M112 212 L276 200"],
    copa: "M148 206 C138 128 160 46 250 34 C340 26 404 92 414 168 C416 184 412 196 406 200 C334 216 214 220 148 206 Z",
    costuras: [
      "M250 36 C200 70 172 132 176 212",
      "M250 36 C290 90 306 156 304 216",
      "M250 36 C322 60 376 116 396 170",
    ],
    tela: "M250 36 C290 90 306 156 304 216 L420 216 L420 20 Z",
    botao: [250, 34],
    ilhoses: [
      [204, 104],
      [322, 92],
    ],
  },
  dad: {
    aba: "M290 212 C230 236 118 250 62 230 C42 222 46 208 70 203 C104 196 132 198 154 202 Z",
    abaBorda: "M62 230 C118 250 230 236 290 212 L290 218 C230 244 116 258 57 236 Z",
    pesponto: ["M80 216 C118 226 192 222 250 209", "M94 223 C134 232 202 226 260 214"],
    copa: "M150 206 C142 150 186 82 258 76 C334 70 394 112 410 170 C413 184 410 196 404 200 C330 216 216 220 150 206 Z",
    costuras: [
      "M258 78 C222 104 196 150 188 212",
      "M258 78 C288 112 302 164 302 214",
      "M258 78 C320 92 368 128 390 172",
    ],
    tela: "M258 78 C288 112 302 164 302 214 L420 214 L420 60 Z",
    botao: [258, 76],
    ilhoses: [
      [220, 132],
      [322, 122],
    ],
  },
};

interface IlustracaoBoneProps {
  modelo: ModeloBone;
  /* Trucker com aba reta usa a geometria reta; os demais ignoram. */
  abaReta?: boolean;
  cor?: string;
  /* Cor da tela do trucker e da tira traseira; sem ela, repete `cor`. */
  corSecundaria?: string;
  modo?: "preenchido" | "traco";
  sombra?: boolean;
  className?: string;
  titulo?: string;
}

export function IlustracaoBone({
  modelo,
  abaReta = false,
  cor = "#26272b",
  corSecundaria,
  modo = "preenchido",
  sombra = true,
  className,
  titulo,
}: IlustracaoBoneProps) {
  const id = useId().replace(/:/g, "");
  const trucker = modelo === "trucker";
  const g = trucker ? (abaReta ? GEOMETRIAS.reta : CURVA) : GEOMETRIAS[modelo];
  const traco = modo === "traco";
  const cor2 = corSecundaria ?? cor;

  const acessibilidade = titulo
    ? { role: "img" as const, "aria-label": titulo }
    : { "aria-hidden": true as const };

  if (traco) {
    return (
      <svg viewBox="10 10 430 270" className={className} {...acessibilidade}>
        <g
          style={{ fill: "var(--fundo-traco, var(--color-papel))" }}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path data-traco pathLength={1} d={g.aba} />
          <path data-traco pathLength={1} d={g.abaBorda} />
          <path data-traco pathLength={1} d={g.copa} />
          <path data-traco pathLength={1} d={ABERTURA} fill="none" />
          <path data-traco pathLength={1} d={TIRA} />
          {g.costuras.map((d) => (
            <path data-traco pathLength={1} key={d} d={d} fill="none" />
          ))}
          <ellipse data-traco pathLength={1} cx={g.botao[0]} cy={g.botao[1]} rx={13} ry={5} />
          {trucker
            ? null
            : g.ilhoses.map(([x, y]) => (
                <ellipse data-traco pathLength={1} key={`${x}-${y}`} cx={x} cy={y} rx={3.6} ry={2.8} fill="none" />
              ))}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="10 10 430 270" className={className} {...acessibilidade}>
      <defs>
        <linearGradient id={`luz-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.3} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id={`aba-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.18} />
          <stop offset="1" stopColor="#000" stopOpacity={0.25} />
        </linearGradient>
        <radialGradient id={`sombra-${id}`}>
          <stop offset="0" stopColor="#000" stopOpacity={0.22} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
        <clipPath id={`copa-${id}`}>
          <path d={g.copa} />
        </clipPath>
        <pattern id={`tela-${id}`} width={7} height={7} patternUnits="userSpaceOnUse">
          <circle cx={3.5} cy={3.5} r={1.6} fill="#000" fillOpacity={0.45} />
        </pattern>
      </defs>

      {sombra ? <ellipse cx={230} cy={250} rx={196} ry={15} fill={`url(#sombra-${id})`} /> : null}

      {/* aba: face de cima, borda inferior escurecida e pesponto */}
      <path d={g.abaBorda} fill={cor} />
      <path d={g.abaBorda} fill="#000" fillOpacity={0.4} />
      <path d={g.aba} fill={cor} />
      <path d={g.aba} fill={`url(#aba-${id})`} />
      <g fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={1.2} strokeDasharray="3 3">
        {g.pesponto.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* copa, tela do trucker e luz */}
      <path d={g.copa} fill={cor} />
      {trucker ? (
        <g clipPath={`url(#copa-${id})`}>
          <path d={g.tela} fill={cor2} />
          <path d={g.tela} fill={`url(#tela-${id})`} />
        </g>
      ) : null}
      <path d={g.copa} fill={`url(#luz-${id})`} />

      {/* abertura traseira e tira */}
      <path d={ABERTURA} fill="#000" fillOpacity={0.5} />
      <path d={TIRA} fill={cor2} />
      <path d={TIRA} fill="#000" fillOpacity={0.15} />

      <g fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth={1.6} strokeLinecap="round">
        {g.costuras.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <ellipse
        cx={g.botao[0]}
        cy={g.botao[1]}
        rx={13}
        ry={5}
        fill={cor}
        stroke="#000"
        strokeOpacity={0.3}
        strokeWidth={1.4}
      />
      {trucker
        ? null
        : g.ilhoses.map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={3.6} ry={2.8} fill="#000" fillOpacity={0.4} />
          ))}
    </svg>
  );
}
