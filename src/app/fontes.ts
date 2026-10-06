import { Barlow, Barlow_Semi_Condensed } from "next/font/google";

/*
 * Tipografia da marca. Trocar de família é uma mudança só neste arquivo:
 * o restante do site usa os tokens `font-sans` e `font-display`.
 */

/* Texto corrido e interface. */
export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

/* Display: assinatura e títulos, quase sempre em caixa alta itálica. */
export const barlowSemi = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-barlow-semi",
  display: "swap",
});
