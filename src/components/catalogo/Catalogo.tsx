"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Painel } from "@/components/ui/Painel";
import { Rotulo } from "@/components/ui/Rotulo";
import type { Categoria, FamiliaCor, Marca, Produto, Variante } from "@/content/tipos";
import { modeloIlustracao } from "@/lib/ilustracao";

import { CardDestaque } from "./CardDestaque";
import { CardProduto } from "./CardProduto";
import { CarrosselEstilos, type Estilo } from "./CarrosselEstilos";
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
  marcas: string[];
  cores: FamiliaCor[];
}

const SEM_FILTROS: Filtros = { marcas: [], cores: [] };

function lerDaUrl() {
  const p = new URLSearchParams(window.location.search);
  const lista = (chave: string) => p.get(chave)?.split(",").filter(Boolean) ?? [];
  return {
    estilo: p.get("estilo"),
    filtros: { marcas: lista("marca"), cores: lista("cor") as FamiliaCor[] },
  };
}

function gravarNaUrl(estilo: string, f: Filtros) {
  const p = new URLSearchParams(window.location.search);
  const definir = (chave: string, valor: string) => (valor ? p.set(chave, valor) : p.delete(chave));
  definir("estilo", estilo);
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

const plural = (n: number) => `${n} ${n === 1 ? "modelo" : "modelos"}`;

interface CatalogoProps {
  produtos: Produto[];
  marcas: Marca[];
  categorias: Categoria[];
  exibirPrecos: boolean;
  whatsapp: string | null;
}

/*
 * O catálogo funciona como um cardápio: primeiro a pessoa escolhe o estilo
 * (carrossel de capas), depois vê a vitrine daquele estilo — um destaque
 * grande e os demais modelos. Marca e cor ficam num filtro discreto.
 */
export function Catalogo({ produtos, marcas, categorias, exibirPrecos, whatsapp }: CatalogoProps) {
  // Só estilos com produto entram no cardápio; destaques primeiro dentro de cada um.
  const estilos = useMemo<Estilo[]>(
    () =>
      categorias
        .map((categoria) => {
          const doEstilo = produtos
            .filter((p) => p.categoriaId === categoria.id)
            .sort((a, b) => Number(b.destaque) - Number(a.destaque));
          return {
            categoria,
            total: doEstilo.length,
            bones: doEstilo.slice(0, 2).map((p) => ({
              modelo: modeloIlustracao(p),
              abaReta: p.aba === "reta",
              cor: p.variantes[0].hex,
              corSecundaria: p.variantes[0].hexSecundario,
            })),
          };
        })
        .filter((e) => e.total > 0),
    [categorias, produtos],
  );

  const [estiloId, setEstiloId] = useState(estilos[0]?.categoria.id ?? "");
  const [filtros, setFiltros] = useState<Filtros>(SEM_FILTROS);
  const [painelAberto, setPainelAberto] = useState(false);
  const [aberto, setAberto] = useState<{ produto: Produto; variante: Variante } | null>(null);
  const vitrine = useRef<HTMLDivElement>(null);

  // Estilo e filtros compartilháveis: lidos da URL ao chegar.
  useEffect(() => {
    const { estilo, filtros: daUrl } = lerDaUrl();
    /* eslint-disable react-hooks/set-state-in-effect -- a URL só existe no navegador */
    if (estilo && estilos.some((e) => e.categoria.id === estilo)) setEstiloId(estilo);
    setFiltros(daUrl);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [estilos]);

  function escolherEstilo(id: string) {
    setEstiloId(id);
    setFiltros(SEM_FILTROS);
    gravarNaUrl(id, SEM_FILTROS);
    vitrine.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function atualizarFiltros(novos: Filtros) {
    setFiltros(novos);
    gravarNaUrl(estiloId, novos);
  }

  const marcaPorId = useMemo(() => new Map(marcas.map((m) => [m.id, m])), [marcas]);
  const estilo = estilos.find((e) => e.categoria.id === estiloId) ?? estilos[0];
  const categoria = estilo?.categoria;

  const doEstilo = produtos
    .filter((p) => p.categoriaId === categoria?.id)
    .sort((a, b) => Number(b.destaque) - Number(a.destaque));
  const marcasDoEstilo = marcas.filter((m) => doEstilo.some((p) => p.marcaId === m.id));
  const familiasDoEstilo = (Object.keys(FAMILIAS) as FamiliaCor[]).filter((f) =>
    doEstilo.some((p) => p.variantes.some((v) => v.familia === f)),
  );

  const visiveis = doEstilo.filter(
    (p) =>
      (filtros.marcas.length === 0 || filtros.marcas.includes(p.marcaId)) &&
      (filtros.cores.length === 0 || p.variantes.some((v) => filtros.cores.includes(v.familia))),
  );
  const [destaque, ...demais] = visiveis;
  const qtdFiltros = filtros.marcas.length + filtros.cores.length;

  if (!estilo || !categoria) return null;

  return (
    <section id="colecao" aria-labelledby="titulo-colecao" className="scroll-mt-16 pb-24 pt-16 md:pt-24">
      <div className="envelope">
        <Rotulo alinhamento="inicio">Coleção</Rotulo>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h2
            id="titulo-colecao"
            className="font-display text-[clamp(2.5rem,11vw,4.5rem)] font-bold uppercase italic leading-[0.9]"
          >
            Qual é o seu
            <br />
            estilo?
          </h2>
          <p className="max-w-[30ch] pb-1 text-[0.9375rem] text-grafite-suave">
            {estilos.length} estilos, um jeito de cada um. Escolha o seu e veja os modelos.
          </p>
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <CarrosselEstilos estilos={estilos} ativo={categoria.id} aoEscolher={escolherEstilo} />
      </div>

      {/* vitrine do estilo escolhido */}
      <div ref={vitrine} className="envelope scroll-mt-20 pt-16 md:pt-24">
        <div key={categoria.id} className="entrada">
          <div className="flex items-end justify-between gap-6 border-b border-filete pb-4">
            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-rotulo text-ouro-texto">
                {categoria.apelido ?? "Estilo"}
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.875rem,8vw,3rem)] font-bold uppercase italic leading-none">
                {categoria.nome}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="hidden text-sm text-grafite-suave tabular-nums sm:inline" aria-live="polite">
                {plural(visiveis.length)}
              </span>
              <button
                type="button"
                onClick={() => setPainelAberto(true)}
                className="flex h-10 items-center gap-2 border border-filete px-3.5 text-[0.75rem] font-medium uppercase tracking-[0.08em] transition-colors hover:border-grafite"
              >
                <svg viewBox="0 0 24 24" width={15} height={15} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                  <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                  <circle cx={16} cy={7} r={2} />
                  <circle cx={10} cy={17} r={2} />
                </svg>
                Filtrar
                {qtdFiltros > 0 ? (
                  <span className="grid size-5 place-items-center rounded-full bg-grafite text-[0.6875rem] tabular-nums text-papel">
                    {qtdFiltros}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {qtdFiltros > 0 ? (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              {filtros.marcas.map((id) => (
                <ChipAtivo
                  key={id}
                  rotulo={marcaPorId.get(id)?.nome ?? id}
                  aoRemover={() => atualizarFiltros({ ...filtros, marcas: alternar(filtros.marcas, id) })}
                />
              ))}
              {filtros.cores.map((f) => (
                <ChipAtivo
                  key={f}
                  rotulo={FAMILIAS[f].nome}
                  aoRemover={() => atualizarFiltros({ ...filtros, cores: alternar(filtros.cores, f) })}
                />
              ))}
              <button
                type="button"
                onClick={() => atualizarFiltros(SEM_FILTROS)}
                className="px-2 py-1.5 text-xs text-grafite-suave underline underline-offset-4 hover:text-grafite"
              >
                Limpar
              </button>
            </div>
          ) : null}

          {destaque ? (
            <>
              <div className="mt-6 md:mt-8">
                <CardDestaque
                  produto={destaque}
                  marca={marcaPorId.get(destaque.marcaId)}
                  variante={varianteEmDestaque(destaque, filtros.cores)}
                  categoria={categoria}
                  exibirPreco={exibirPrecos}
                  aoAbrir={() =>
                    setAberto({ produto: destaque, variante: varianteEmDestaque(destaque, filtros.cores) })
                  }
                />
              </div>

              {demais.length > 0 ? (
                <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-14">
                  {demais.map((produto) => {
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
              ) : null}
            </>
          ) : (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="font-display text-2xl font-bold uppercase italic">Nenhum boné por aqui.</p>
              <p className="mt-2 text-sm text-grafite-suave">Nenhum modelo deste estilo combina com esses filtros.</p>
              <button
                type="button"
                onClick={() => atualizarFiltros(SEM_FILTROS)}
                className="mt-6 border border-grafite px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-botao transition-colors hover:bg-grafite hover:text-papel"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <Painel
        aberto={painelAberto}
        aoFechar={() => setPainelAberto(false)}
        titulo={`Filtrar ${categoria.nome.toLowerCase()}`}
        rodape={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => atualizarFiltros(SEM_FILTROS)}
              className="h-12 px-4 text-[0.8125rem] font-medium uppercase tracking-botao text-grafite-suave hover:text-grafite"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => setPainelAberto(false)}
              className="h-12 flex-1 bg-grafite text-[0.8125rem] font-medium uppercase tracking-botao text-papel transition-colors hover:bg-carvao"
            >
              Ver {plural(visiveis.length)}
            </button>
          </div>
        }
      >
        <fieldset className="pt-4">
          <legend className="text-[0.6875rem] font-medium uppercase tracking-rotulo text-ouro-texto">Marca</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {marcasDoEstilo.map((m) => {
              const ativa = filtros.marcas.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => atualizarFiltros({ ...filtros, marcas: alternar(filtros.marcas, m.id) })}
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
            {familiasDoEstilo.map((f) => {
              const ativa = filtros.cores.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => atualizarFiltros({ ...filtros, cores: alternar(filtros.cores, f) })}
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
        categoria={aberto ? categorias.find((c) => c.id === aberto.produto.categoriaId) : undefined}
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
