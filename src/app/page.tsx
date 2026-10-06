import { Catalogo } from "@/components/catalogo/Catalogo";
import { Hero } from "@/components/hero/Hero";
import { listarCategorias, listarMarcas, listarProdutos, modeloIlustracao } from "@/lib/catalogo";
import { obterConfiguracao } from "@/lib/site";

export default async function Inicio() {
  const [site, produtos, marcas, categorias] = await Promise.all([
    obterConfiguracao(),
    listarProdutos(),
    listarMarcas(),
    listarCategorias(),
  ]);

  // O boné da abertura é o primeiro produto em destaque, na primeira cor.
  const destaque = produtos.find((p) => p.destaque) ?? produtos[0];
  const varianteDestaque = destaque?.variantes[0];

  return (
    <>
      {destaque && varianteDestaque ? (
        <Hero
          assinatura={site.assinatura}
          regiao={site.regiao}
          destaque={{
            marca: marcas.find((m) => m.id === destaque.marcaId)?.nome ?? "",
            nome: destaque.nome,
            modelo: modeloIlustracao(destaque),
            abaReta: destaque.aba === "reta",
            cor: varianteDestaque.hex,
            corSecundaria: varianteDestaque.hexSecundario,
          }}
        />
      ) : null}
      <Catalogo
        produtos={produtos}
        marcas={marcas}
        categorias={categorias}
        exibirPrecos={site.exibirPrecos}
        whatsapp={site.whatsapp}
      />
    </>
  );
}
