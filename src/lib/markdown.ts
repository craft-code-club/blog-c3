import rehypeHighlight from "rehype-highlight";
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Converte o corpo em Markdown de um post ou evento em HTML. Os dois usam o
 * mesmo pipeline, então o que funciona num post funciona igual num evento.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true }) // Allow HTML to pass through
      .use(rehypeSlug)
      .use(rehypeHighlight)
      .use(rehypeStringify, { allowDangerousHtml: true }) // Preserve HTML in the output
      .process(markdown);

  // Adjust image paths dynamically
  return processedContent
    .toString()
    .replace(/<img src="\/public/g, `<img src="`)
    .replace(/<img src="\.\.\/\.\.\/public/g, `<img src="`);
}
