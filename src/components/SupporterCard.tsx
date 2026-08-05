import type { Supporter } from "@/app/apoiar/supporters";

// Primeira letra do primeiro e do último nome. Nome de uma palavra só vira uma letra.
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function SupporterCard({ supporter }: { supporter: Supporter }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-500/40">
      {/* Brilho decorativo no canto, que acende no hover. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-amber-400/10 blur-2xl transition-colors duration-200 group-hover:bg-amber-400/25"
      />
      <div className="relative">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-base font-bold text-white shadow-md shadow-amber-500/25"
        >
          {initials(supporter.name)}
        </div>
        <p className="mt-4 font-semibold text-gray-900 dark:text-white">{supporter.name}</p>
      </div>
    </div>
  );
}
