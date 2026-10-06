"use client";

import { useState } from "react";

import { IconeWhatsApp } from "@/components/ui/IconesMarca";
import { Painel } from "@/components/ui/Painel";
import type { Categoria, Marca, Produto, Variante } from "@/content/tipos";
import { linkWhatsApp, mensagemProduto } from "@/lib/whatsapp";

import { Preco } from "./Preco";
import { VisualProduto } from "./VisualProduto";

const FECHAMENTO: Record<Produto["fechamento"], string> = {
  snapback: "Snapback",
  strapback: "Ajuste com fivela",
  fitted: "Fechado (por tamanho)",
  elastico: "Elástico",
};

/*
 * Detalhe rápido: abre por cima do catálogo, sem trocar de página. Leva o
 * cliente da escolha da cor até a conversa no WhatsApp com a mensagem pronta.
 */
interface DetalheProdutoProps {
  produto: Produto | null;
  varianteInicial: Variante | null;
  marca: Marca | undefined;
  categoria: Categoria | undefined;
  exibirPreco: boolean;
  whatsapp: string | null;
  aoFechar: () => void;
}

export function DetalheProduto(props: DetalheProdutoProps) {
  const { produto, varianteInicial } = props;

  return (
    <Painel
      aberto={Boolean(produto)}
      aoFechar={props.aoFechar}
      titulo={produto ? produto.nome : "Produto"}
      ocultarTitulo
      variante="central"
    >
      {produto && varianteInicial ? (
        // a key reinicia a cor escolhida a cada produto aberto
        <Conteudo key={produto.id} {...props} produto={produto} varianteInicial={varianteInicial} />
      ) : null}
    </Painel>
  );
}

function Conteudo({
  produto,
  varianteInicial,
  marca,
  categoria,
  exibirPreco,
  whatsapp,
}: DetalheProdutoProps & { produto: Produto; varianteInicial: Variante }) {
  const [variante, setVariante] = useState(varianteInicial);
  const esgotado = produto.status === "esgotado" || !variante.disponivel;
  const mensagem = esgotado
    ? `Olá, Cap Store! O boné ${[marca?.nome, produto.nome].filter(Boolean).join(" ")}, cor ${variante.cor}, vai voltar ao estoque?`
    : mensagemProduto(produto, marca, variante, exibirPreco);

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-10">
      <div className="grid aspect-[16/10] place-items-center bg-linho md:aspect-[4/5]">
        <VisualProduto
          produto={produto}
          variante={variante}
          sizes="(min-width: 768px) 28rem, 100vw"
          className={esgotado ? "opacity-55 grayscale-[35%]" : ""}
        />
      </div>

      <div className="flex flex-col">
        {marca ? (
          <p className="text-[0.6875rem] font-medium uppercase tracking-rotulo text-ouro-texto">{marca.nome}</p>
        ) : null}
        <h3 className="mt-2 font-display text-[2rem] font-bold uppercase italic leading-[0.95]">{produto.nome}</h3>
        {produto.descricaoCurta ? (
          <p className="mt-3 text-[0.9375rem] text-grafite-suave">{produto.descricaoCurta}</p>
        ) : null}

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-filete py-4 text-sm">
          <div>
            <dt className="text-[0.625rem] uppercase tracking-rotulo text-grafite-suave">Modelo</dt>
            <dd className="mt-1">{categoria?.nome ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.625rem] uppercase tracking-rotulo text-grafite-suave">Fechamento</dt>
            <dd className="mt-1">{FECHAMENTO[produto.fechamento]}</dd>
          </div>
        </dl>

        <fieldset className="mt-5">
          <legend className="text-[0.625rem] uppercase tracking-rotulo text-grafite-suave">
            Cor: <span className="normal-case tracking-normal text-grafite">{variante.cor}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {produto.variantes.map((v) => {
              const ativa = v.id === variante.id;
              return (
                <label
                  key={v.id}
                  className={`grid size-11 cursor-pointer place-items-center rounded-full transition-shadow ${
                    ativa ? "ring-1 ring-grafite" : "ring-1 ring-transparent hover:ring-filete"
                  }`}
                >
                  <input
                    type="radio"
                    name={`cor-${produto.id}`}
                    value={v.id}
                    checked={ativa}
                    onChange={() => setVariante(v)}
                    className="sr-only"
                  />
                  <span
                    className="size-7 rounded-full ring-1 ring-grafite/15"
                    style={{
                      background: v.hexSecundario
                        ? `linear-gradient(135deg, ${v.hex} 50%, ${v.hexSecundario} 50%)`
                        : v.hex,
                    }}
                  />
                  <span className="sr-only">{v.cor}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="sticky bottom-0 -mx-5 mt-auto border-t border-filete bg-papel px-5 pb-1 pt-4 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-6">
          {exibirPreco ? <Preco produto={produto} className="text-lg font-medium md:text-xl" /> : null}
          <a
            href={linkWhatsApp(whatsapp, mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-13 w-full md:mt-4 items-center justify-center gap-2.5 bg-grafite px-6 text-[0.8125rem] font-medium uppercase tracking-botao text-papel transition-colors duration-200 hover:bg-carvao"
          >
            <IconeWhatsApp width={18} height={18} />
            {esgotado ? "Avise-me quando chegar" : "Tenho interesse"}
          </a>
          <p className="mt-3 hidden text-center text-xs text-grafite-suave md:block">
            Atendimento pelo WhatsApp, com a mensagem já escrita.
          </p>
        </div>
      </div>
    </div>
  );
}
