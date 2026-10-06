"use client";

import { useEffect, useMemo, useState } from "react";

import { Painel } from "@/components/ui/Painel";
import { Rotulo } from "@/components/ui/Rotulo";
import type { Categoria, FamiliaCor, Marca, Produto, Variante } from "@/content/tipos";

import { CardProduto } from "./CardProduto";
import { DetalheProduto } from "./DetalheProduto";

const FAMILIAS: Record<FamiliaCor, { nome: string; hex: string }> = {
  preto: { nome: "Preto", hex: "#1d1d1f" },
  branco: { nome: "Branco", hex: "#f7f6f2" },
  "off-white": { nome: "Off-white", hex: "#eee9df" },
  bege: { nome: "Bege", hex: "#cdbb9c" },
  marrom: { nome: "Marrom", hex: "#6b4f37" },
  cinza: { nome: "Cinza", hex: "#7c7d82" },
  azul: { nome: "Azul", hex: "#2b3d5f" },
  verde: { nome: "Verde", hex: "#4f5d44" },
  vermelho: { nome: "Vermelho", hex: "#8e2a2a" },
  rosa: { nome: "Rosa", hex: "#d9a3a8" },
  amarelo: { nome: "Amarelo", hex: "#d8b545" },
  colorido: { nome: "Colorido", hex: "conic-gradient(#8e2a2a, #d8b545, #2f5a45, #2b3d5f, #8e2a2a)" },
};

interface Filtros {
  categoria: string | null;
  marcas: string[];
  cores: FamiliaCor[];
}

const VAZIO: Filtros = { categoria: null, marcas: [], cores: [] };

function lerDaUrl(): Filtros {
  const p = new URLSearchParams(window.location.search);
  const lista = (chave: string) => p.get(chave)?.split(",").filter(Boolean) ?? [];
  return { categoria: p.get("modelo"), marcas: lista("marca"), cores: lista("cor") as FamiliaCor[] };
}

function gravarNaUrl(f: Filtros) {
  const p = new URLSearchParams(window.location.search);
  const definir = (chave: string, valor: string) => (valor ? p.set(chave, valor) : p.delete(chave));
  definir("modelo", f.categoria ?? "");
  definir("marca", f.marcas.join(","));
  definir("cor", f.cores.join(","));
  const busca = p.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${busca ? `?${busca}` : ""}${window.location.hash}`);
}

const alternar = <T,>(lista: T[], item: T) =>
  lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];

/* Variante mostrada no card: a da cor filtrada, senão a primeira disponível. */
function varianteEmDestaque(produto: Produto, cores: FamiliaCor[]): Variante {
  return (
    produto.variantes.find((v) => cores.includes(v.familia)) ??
    produto.variantes.find((v) => v.disponivel) ??
    produto.variantes[0]
  );
}

interface CatalogoProps {
  produtos: Produto[];
  marcas: Marca[];
  categorias: Categoria[];
  exibirPrecos: boolean;
  whatsapp: string | null;
}

export function Catalogo({ produtos, marcas, categorias, exibirPrecos, whatsapp }: CatalogoProps) {
  const [filtros, setFiltros] = useState<Filtros>(VAZIO);
  const [painelAberto, setPainelAberto] = useState(false);
  const [aberto, setAberto] = useState<{ produto: Produto; variante: Variante } | null>(null);

  // Filtros compartilháveis: lidos da URL ao chegar e gravados a cada mudança.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a URL só existe no navegador
    setFiltros(lerDaUrl());
  }, []);

  function atualizar(novos: Filtros) {
    setFiltros(novos);
    gravarNaUrl(novos);
  }

  const marcaPorId = useMemo(() => new Map(marcas.map((m) => [m.id, m])), [marcas]);
  const categoriaPorId = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);

  const categoriasComProduto = categorias.filter((c) => produtos.some((p) => p.categoriaId === c.id));
  const marcasComProduto = marcas.filter((m) => produtos.some((p) => p.marcaId === m.id));
  const familiasComProduto = (Object.keys(FAMILIAS) as FamiliaCor[]).filter((f) =>
    produtos.some((p) => p.variantes.some((v) => v.familia === f)),
  );

  const visiveis = produtos.filter(
    (p) =>
      (!filtros.categoria || p.categoriaId === filtros.categoria) &&
      (filtros.marcas.length === 0 || filtros.marcas.includes(p.marcaId)) &&
      (filtros.cores.length === 0 || p.variantes.some((v) => filtros.cores.includes(v.familia))),
  );

  const filtrosDoPainel = filtros.marcas.length + filtros.cores.length;
  const contagem = `${visiveis.length} ${visiveis.length === 1 ? "modelo" : "modelos"}`;

  return (
    <section id="colecao" aria-labelledby="titulo-colecao" className="scroll-mt-16 pb-24 pt-16 md:pt-24">
      <div className="envelope">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Rotulo alinhamento="inicio">Coleção</Rotulo>
            <h2
              id="titulo-colecao"
              className="mt-4 font-display text-[clamp(2.25rem,9vw,4rem)] font-bold uppercase italic leading-[0.92]"
            >
              Encontre o seu.
            </h2>
          </div>
          <p className="hidden shrink-0 pb-1 text-sm text-grafite-suave tabular-nums md:block" aria-live="polite">
            {contagem}
          </p>
        </div>
      </div>

      {/* barra de categorias e filtros: acompanha a rolagem logo abaixo do cabeçalho */}
      <div className="sticky top-16 z-30 mt-8 bg-papel">
        <div className="envelope flex items-center gap-4 border-b border-filete">
          <nav aria-label="Modelos" className="-mb-px flex min-w-0 flex-1 gap-6 overflow-x-auto pr-6 [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] [scrollbar-width:none] md:[mask-image:none] [&::-webkit-scrollbar]:hidden">
            {[{ id: null, nome: "Todos" }, ...categoriasComProduto].map((c) => {
              const ativa = filtros.categoria === c.id;
              return (
                <button
                  key={c.id ?? "todos"}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => atualizar({ ...filtros, categoria: c.id })}
                  className={`shrink-0 border-b-2 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${
                    ativa ? "border-ouro text-grafite" : "border-transparent text-grafite-suave hover:text-grafite"
                  }`}
                >
                  {c.nome}
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => setPainelAberto(true)}
            className="flex shrink-0 items-center gap-2 py-3.5 pl-2 text-[0.8125rem] font-medium uppercase tracking-[0.08em]"
          >
            <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
              <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
              <circle cx={16} cy={7} r={2} />
              <circle cx={10} cy={17} r={2} />
            </svg>
            Filtrar
            {filtrosDoPainel > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-grafite text-[0.6875rem] tabular-nums text-papel">
                {filtrosDoPainel}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="envelope">
        {/* filtros ativos de marca e cor, removíveis um a um */}
        {filtrosDoPainel > 0 ? (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {filtros.marcas.map((id) => (
              <ChipAtivo key={id} rotulo={marcaPorId.get(id)?.nome ?? id} aoRemover={() => atualizar({ ...filtros, marcas: alternar(filtros.marcas, id) })} />
            ))}
            {filtros.cores.map((f) => (
              <ChipAtivo key={f} rotulo={FAMILIAS[f].nome} aoRemover={() => atualizar({ ...filtros, cores: alternar(filtros.cores, f) })} />
            ))}
            <button
              type="button"
              onClick={() => atualizar({ ...filtros, marcas: [], cores: [] })}
              className="px-2 py-1.5 text-xs text-grafite-suave underline underline-offset-4 hover:text-grafite"
            >
              Limpar
            </button>
          </div>
        ) : null}

        <p className="pt-4 text-xs text-grafite-suave tabular-nums md:hidden" aria-live="polite">
          {contagem}
        </p>

        {visiveis.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 md:mt-8 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-14">
            {visiveis.map((produto) => {
              const variante = varianteEmDestaque(produto, filtros.cores);
              return (
                <li key={produto.id}>
                  <CardProduto
                    produto={produto}
                    marca={marcaPorId.get(produto.marcaId)}
                    variante={variante}
                    exibirPreco={exibirPrecos}
                    aoAbrir={() => setAberto({ produto, variante })}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <p className="font-display text-2xl font-bold uppercase italic">Nenhum boné por aqui.</p>
            <p className="mt-2 text-sm text-grafite-suave">Nenhum modelo combina com todos esses filtros.</p>
            <button
              type="button"
              onClick={() => atualizar(VAZIO)}
              className="mt-6 border border-grafite px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-botao transition-colors hover:bg-grafite hover:text-papel"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <Painel
        aberto={painelAberto}
        aoFechar={() => setPainelAberto(false)}
        titulo="Filtrar"
        rodape={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => atualizar({ ...filtros, marcas: [], cores: [] })}
              className="h-12 px-4 text-[0.8125rem] font-medium uppercase tracking-botao text-grafite-suave hover:text-grafite"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => setPainelAberto(false)}
              className="h-12 flex-1 bg-grafite text-[0.8125rem] font-medium uppercase tracking-botao text-papel transition-colors hover:bg-carvao"
            >
              Ver {contagem}
            </button>
          </div>
        }
      >
        <fieldset className="pt-4">
          <legend className="text-[0.6875rem] font-medium uppercase tracking-rotulo text-ouro-texto">Marca</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {marcasComProduto.map((m) => {
              const ativa = filtros.marcas.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => atualizar({ ...filtros, marcas: alternar(filtros.marcas, m.id) })}
                  className={`h-10 border px-4 text-sm transition-colors duration-200 ${
                    ativa ? "border-grafite bg-grafite text-papel" : "border-filete hover:border-grafite-suave"
                  }`}
                >
                  {m.nome}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-[0.6875rem] font-medium uppercase tracking-rotulo text-ouro-texto">Cor</legend>
          <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
            {familiasComProduto.map((f) => {
              const ativa = filtros.cores.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => atualizar({ ...filtros, cores: alternar(filtros.cores, f) })}
                  className="flex flex-col items-center gap-2 text-xs"
                >
                  <span
                    className={`grid size-11 place-items-center rounded-full transition-shadow ${
                      ativa ? "ring-1 ring-grafite" : "ring-1 ring-transparent"
                    }`}
                  >
                    <span className="size-8 rounded-full ring-1 ring-grafite/15" style={{ background: FAMILIAS[f].hex }} />
                  </span>
                  <span className={ativa ? "text-grafite" : "text-grafite-suave"}>{FAMILIAS[f].nome}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </Painel>

      <DetalheProduto
        produto={aberto?.produto ?? null}
        varianteInicial={aberto?.variante ?? null}
        marca={aberto ? marcaPorId.get(aberto.produto.marcaId) : undefined}
        categoria={aberto ? categoriaPorId.get(aberto.produto.categoriaId) : undefined}
        exibirPreco={exibirPrecos}
        whatsapp={whatsapp}
        aoFechar={() => setAberto(null)}
      />
    </section>
  );
}

function ChipAtivo({ rotulo, aoRemover }: { rotulo: string; aoRemover: () => void }) {
  return (
    <button
      type="button"
      onClick={aoRemover}
      className="flex h-8 items-center gap-2 bg-linho pl-3 pr-2 text-xs transition-colors hover:bg-filete"
    >
      {rotulo}
      <span className="sr-only">(remover filtro)</span>
      <svg viewBox="0 0 24 24" width={12} height={12} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}
