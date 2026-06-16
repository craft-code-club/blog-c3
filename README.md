# Craft & Code Club Blog

Este é o repositório do blog da comunidade Craft & Code Club, uma comunidade dedicada ao artesanato de software, onde compartilhamos conhecimento sobre Algoritmos, Estruturas de Dados, System Design, Engenharia de Software Moderna, Domain-Driven Design, Clean Architecture e outros tópicos avançados de desenvolvimento de software.

## 🌟 Sobre a Comunidade

O Craft & Code Club é uma comunidade de desenvolvedores apaixonados por qualidade de código e boas práticas de desenvolvimento. Nosso objetivo é compartilhar conhecimento e experiências através de:

- 📝 Artigos técnicos no blog
- 🎥 Conteúdo no YouTube
- 💬 Discussões no Discord
- 🤝 Eventos e encontros
- 📖 Clube do Livro

## :rocket: Faça parte da Comunidade

Linkd para participar no Discord: \
https://discord.gg/V7hQJZSDYu

## 📋 Usando este Template

Este blog foi desenvolvido como um template open source, e você está convidado a usá-lo! Se você tem uma comunidade de tecnologia ou quer criar seu blog pessoal, sinta-se à vontade para fazer um fork e adaptar às suas necessidades.

### Como Usar

1. Faça um fork deste repositório
2. Personalize como quiser
3. Os posts eventos são escritos em Markdown e ficam na pasta `_content/`

## 🛠 Tecnologias Utilizadas

- **Next.js 15** - Framework React com suporte a SSG
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização e design system
- **next-themes** - Suporte a tema claro/escuro
- **remark** - Renderização de Markdown
- **gray-matter** - Parsing de frontmatter dos posts

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:3000`

### Build Estático

Este blog usa exportação estática do Next.js, permitindo hospedagem em qualquer servidor estático:

```bash
# Gerar build estático
npm run build

# Os arquivos estáticos estarão na pasta 'out'
```

### Configuração

1. Crie seus posts em Markdown na pasta `_content/posts/`
2. Crie seus eventos em Markdown na pasta `_content/events/`
3. Configure os metadados do site em `src/app/layout.tsx`
4. Ajuste as cores e tema em `tailwind.config.js`
5. Personalize os componentes e páginas em `src/components/` e `src/app/`


## 📝 Criando conteúdo

Para a ajudar na indexação e SEO, os posts e eventos devem seguir um formato específico dos slugs. O slug é a parte da URL que identifica o post ou evento.
O slug deve ser escrito em letras minúsculas, com palavras separadas por hífens.
Para manter a consistência, vamos também seguir um padrão de nomenclatura para os arquivos Markdown. A seguir, mostraremos cada um dos padrões de slug tanto para posts quanto para eventos.


### Posts

Os posts devem ser criados na pasta `_content/posts/` seguindo o formato:

```markdown
---
title: 'Título do Post'
date: '2024-03-20'
description: 'Descrição do post que aparecerá na listagem'
topics: ['tag1', 'tag2', 'tag3']
authors:
  - name: 'Nome do Autor'
    link: 'https://github.com/nomedautor'
---

Conteúdo do post em Markdown...
```

[Mais exemplos de posts](docs/examples/post-example.md)

#### Slug
```
<context>-<titulo-do-post>

## Exemplo:

`dsa-dijkstra.md`
```
- Algoritmos e Estruturas de Dados
  - `ds-<titulo>.md`
- System Design
  - `sd-<titulo>.md`
  - `sd-<titulo>-<parte>.md`
- Outros
  - `<titulo>.md`


### Eventos

Documentação completa de configuração de eventos:

- [docs/events.md](docs/events.md)
- [Mais exemplos de eventos](docs/examples/event-example.md)


### Roadmaps

Os roadmaps são recursos de aprendizado estruturados que ajudam a comunidade a navegar por tópicos complexos de forma organizada. Atualmente, temos o **Roadmap de Algoritmos e Estruturas de Dados** disponível em `/roadmap/dsa`.

#### 📍 Acessando o Roadmap

- **URL**: [https://craftcodeclub.io/roadmap/dsa](https://craftcodeclub.io/roadmap/dsa)
- **Navegação**: Clique em "Roadmap DSA" no menu principal

#### ✏️ Editando o Roadmap

Os roadmaps são configurados via arquivos YAML na pasta `_content/roadmap/`. Para editar o roadmap DSA:

1. **Arquivo de Conteúdo**: `_content/roadmap/dsa.yml`
2. **Documentação Completa**: `_content/roadmap/README.md`
3. **Validação Local**: Execute `npx tsx scripts/validate-roadmap.ts`

**Exemplo de estrutura YAML**:

```yaml
categories:
  - title: "Estruturas de Dados Básicas"
    items:
      - title: "Arrays e Listas"
        description: "Estruturas fundamentais para armazenamento sequencial de dados"
        links:
          - icon: "book"
            title: "Artigo - Arrays"
            url: "https://exemplo.com/arrays"
            target: "_blank"
          - icon: "video"
            title: "Vídeo - Listas Ligadas"
            url: "https://exemplo.com/listas"
            target: "_blank"
```

**Tipos de ícones disponíveis**:
- `book` - Artigos e documentação
- `video` - Vídeos e tutoriais
- `file-text` - Posts do blog
- `code` - Exercícios e código
- `external-link` - Links externos
- `graduation-cap` - Cursos
- `play-circle` - Demonstrações interativas

**Validação**:

Antes de fazer commit das suas alterações, valide o YAML:

```bash
npx tsx scripts/validate-roadmap.ts
```

O script verifica:
- ✅ Sintaxe YAML correta
- ✅ Campos obrigatórios presentes
- ✅ URLs válidas
- ✅ Tipos de ícone corretos
- ✅ Valores de `target` válidos (`_blank` ou `_self`)



## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrou um bug ou tem uma sugestão de melhoria:

1. Abra uma issue descrevendo o problema/sugestão
2. Fork o repositório
3. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
4. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
5. Push para a branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com 💙 pela comunidade Craft & Code Club
