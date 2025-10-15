import type { Metadata } from 'next';
import { loadDSARoadmap } from '@/lib/roadmap';
import { RoadmapTimeline } from '@/components/roadmap/RoadmapTimeline';

export const metadata: Metadata = {
  title: 'Roadmap de Algoritmos e Estruturas de Dados | Craft & Code Club',
  description: 'Trilha completa de aprendizado de algoritmos e estruturas de dados com recursos organizados sequencialmente.',
  keywords: ['Roadmap', 'Algoritmos', 'Estruturas de Dados', 'DSA', 'Aprendizado', 'Trilha', 'Programação'],
  openGraph: {
    title: 'Roadmap DSA | Craft & Code Club',
    description: 'Trilha completa de aprendizado de algoritmos e estruturas de dados com recursos organizados sequencialmente.',
  },
  twitter: {
    title: 'Roadmap DSA | Craft & Code Club',
    description: 'Trilha completa de aprendizado de algoritmos e estruturas de dados com recursos organizados sequencialmente.',
  },
};

export default function DSARoadmapPage() {
  // Load roadmap at build time (SSG)
  const roadmap = loadDSARoadmap();
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Algoritmos e Estruturas de Dados
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            From Zero to Hero - Roadmap organizado para uma aprendizagem fluida
          </p>
        </div>
      </header>
      
      <RoadmapTimeline roadmap={roadmap} />
    </main>
  );
}
