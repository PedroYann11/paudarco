import Image from "next/image";

import selo from "@/assets/marca/selo-cap-store-cariri.webp";

/*
 * Selo oficial da marca, recortado da arte original. Nítido até cerca de
 * 380px de largura na tela; acima disso depende do arquivo em alta da logo.
 */
interface SeloProps {
  className?: string;
  sizes: string;
  preload?: boolean;
  decorativo?: boolean;
}

export function Selo({ className, sizes, preload = false, decorativo = false }: SeloProps) {
  return (
    <Image
      src={selo}
      alt={decorativo ? "" : "Cap Store Cariri"}
      sizes={sizes}
      preload={preload}
      className={className}
    />
  );
}
