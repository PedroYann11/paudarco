import type { Metadata, Viewport } from "next";

import { Cabecalho } from "@/components/layout/Cabecalho";
import { Rodape } from "@/components/layout/Rodape";
import { obterConfiguracao } from "@/lib/site";

import { barlow, barlowSemi } from "./fontes";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await obterConfiguracao();
  return {
    title: {
      default: `${site.nome} · Bonés no Cariri`,
      template: `%s · ${site.nome}`,
    },
    description: site.descricao,
    applicationName: site.nome,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.nome,
      title: `${site.nome} · ${site.assinatura}`,
      description: site.descricao,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f5f2",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowSemi.variable}`}>
      <body className="flex min-h-svh flex-col">
        <Cabecalho />
        <main className="flex-1">{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
