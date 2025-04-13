import { Topic } from "@/lib/topics";
import Link from "next/link";
import ArrowIcon from "./ArrowIcon";

export default function TopicCard({ topic }: { topic: Topic }) {
  return <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{topic.name}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{topic.description}</p>
    <Link href={`/topics/${topic.slug}`} aria-label={`Saiba mais sobre ${topic.name}`} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
      Saiba mais <ArrowIcon />
    </Link>
  </div>;
}
