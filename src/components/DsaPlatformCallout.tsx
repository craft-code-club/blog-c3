import ArrowIcon from '@/components/ArrowIcon';
import { DSA_PLATFORM_ROADMAP_URL, type DsaTopic } from '@/lib/dsa-platform';

interface Props {
  topic?: DsaTopic | null;
  className?: string;
}

export default function DsaPlatformCallout({ topic, className = '' }: Props) {
  const href = topic ? topic.url : DSA_PLATFORM_ROADMAP_URL;

  return (
    <aside
      className={`rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {topic ? `${topic.label} no DSA Roadmap` : 'Roadmap de Algoritmos e Estruturas de Dados'}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {topic ? (
          <>
            A plataforma de algoritmos da comunidade tem uma página dedicada a{' '}
            {topic.label}, com visualização passo a passo, código comentado e
            exercícios selecionados.
          </>
        ) : (
          <>
            A trilha completa — dos fundamentos aos grafos e à programação
            dinâmica — vive na plataforma de algoritmos da comunidade, com
            visualizações interativas e exercícios por tópico.
          </>
        )}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
      >
        {topic
          ? `Estudar ${topic.label} no roadmap de algoritmos`
          : 'Abrir o roadmap completo de algoritmos'}
        <ArrowIcon />
      </a>
    </aside>
  );
}
