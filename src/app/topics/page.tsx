import TopicCard from "@/components/TopicCard";
import { getSortedTopicList } from "@/lib/topics";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tópicos | Craft & Code Club",
  description: "Explore nossos artigos e discussões sobre as melhores práticas de engenharia de software e os fundamentos da arte de programar. Veja os tópicos que abordamos abaixo.",
  keywords: ["Tópicos", "Engenharia de Software", "System Design", "Algoritmos", "DDD", "Domain Driven Design", "Arquitetura de Software", "Desenvolvimento de Software", "Artesanato de Software"],
  openGraph: {
    title: "Tópicos | Craft & Code Club",
    description: "Explore nossos artigos e discussões sobre as melhores práticas de engenharia de software e os fundamentos da arte de programar. Veja os tópicos que abordamos abaixo.",
  },
  twitter: {
    title: "Tópicos | Craft & Code Club",
    description: "Explore nossos artigos e discussões sobre as melhores práticas de engenharia de software e os fundamentos da arte de programar. Veja os tópicos que abordamos abaixo.",
  }
};

export default function TopicsPage() {
  const topics = getSortedTopicList();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tópicos</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Explore nossos artigos e discussões sobre as melhores práticas de engenharia de software e os fundamentos da arte de programar. Veja os tópicos que abordamos abaixo.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {topics.map((topic) => <TopicCard key={topic.key} topic={topic} />)}
        </div>
      </div>
    </div>
  );
}