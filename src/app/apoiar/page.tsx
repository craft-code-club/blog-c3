import type { Metadata } from "next";
import { ArrowRight, Heart } from "lucide-react";
import { APOIA_URL, fetchSupporters } from "./supporters";

const TITLE = "Apoiar a comunidade | Craft & Code Club";
const DESCRIPTION =
  "Ajude a manter o Craft & Code Club livre e aberto. Apoie o conteúdo, os eventos e as ferramentas da comunidade, e entre na lista de apoiadores.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/apoiar" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: ["/logo.png"] },
  twitter: { title: TITLE, description: DESCRIPTION, images: ["/logo.png"] },
};

// Página estática: a lista de apoiadores é buscada na APOIA.se no build.
export const dynamic = "force-static";

const amberButton =
  "inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-colors";

export default async function ApoiarPage() {
  const supporters = await fetchSupporters();

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-3xl">
        <span className="inline-block rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
          Feito pela comunidade, para a comunidade
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Apoie a comunidade
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          O <strong className="text-gray-900 dark:text-white">Craft &amp; Code Club</strong> é livre,
          aberto e feito pela comunidade. O conteúdo, os eventos e as ferramentas se mantêm com o
          apoio de pessoas e empresas que acreditam em educação de qualidade e gratuita para todo
          mundo. Sem paywall, sem login e{" "}
          <strong className="text-gray-900 dark:text-white">sem anúncios, nunca</strong>.
        </p>

        {/* Apoio principal: APOIA.se */}
        <div className="mt-10 rounded-2xl border border-amber-300/60 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
            <Heart className="h-5 w-5" aria-hidden="true" />
            Apoie a comunidade
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">Seja um apoiador</h2>
          <p className="mt-2 max-w-prose text-gray-600 dark:text-gray-300">
            Sua contribuição, do valor que você quiser, mantém o conteúdo saindo, os eventos
            acontecendo e tudo livre e aberto para quem vem depois. E você entra na lista de
            apoiadores abaixo.
          </p>
          <a href={APOIA_URL} target="_blank" rel="noopener noreferrer" className={`mt-5 ${amberButton}`}>
            Quero apoiar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {/* Apoiadores (nomes trazidos da APOIA.se no build) */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Apoiadores</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">Pessoas que bancam a comunidade</span>
          </div>
          {supporters.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {supporters.map((s) => (
                <span
                  key={s.name}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-300">
                Ainda não há apoiadores por aqui.{" "}
                <strong className="text-gray-900 dark:text-white">Seja o primeiro</strong>{" "}
                a sustentar a comunidade Craft &amp; Code Club.
              </p>
              <a href={APOIA_URL} target="_blank" rel="noopener noreferrer" className={`mt-4 ${amberButton}`}>
                Quero apoiar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
