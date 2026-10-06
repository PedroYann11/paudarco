/*
 * Estrela de quatro pontas, a mesma da logo. Ornamento raro: no máximo duas ou
 * três aparições na página inteira.
 */
export function Estrela({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={12}
      height={12}
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0c.6 6.4 5 11 12 12-7 1-11.4 5.6-12 12-.6-6.4-5-11-12-12 7-1 11.4-5.6 12-12Z" />
    </svg>
  );
}
