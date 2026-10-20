/**
 * Structured data em `<script type="application/ld+json">`. Um `<script>`
 * nativo, e não `next/script`: é dado, não código executável. O `<` é escapado
 * para o conteúdo do frontmatter não conseguir fechar a tag.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
