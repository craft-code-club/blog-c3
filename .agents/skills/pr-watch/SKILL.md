---
name: pr-watch
description: Acompanha um PR deste repositório até tudo estar resolvido - verifica comentários de review (Copilot e humanos) e checks de CI, responde cada ponto com evidência, resolve as threads e reporta. Use SEMPRE logo depois de abrir um PR, e também quando pedirem para checar, acompanhar, cuidar ou fechar os comentários de um PR.
allowed-tools: Bash(gh:*), Bash(git:*), Bash(npm run:*), Bash(npx playwright:*), Read, Edit, Write, Grep
---

# Acompanhar um PR até o fim

Abrir o PR não é o fim da tarefa. Rode isto logo depois de abrir, e repita até a condição de saída.

**Condição de saída:** zero threads não resolvidas **e** todos os checks passando. Aí pare e reporte.

## O ciclo

```bash
PR=<numero>
REPO=craft-code-club/blog-c3

# threads de review ainda abertas
# --paginate é obrigatório: sem ele a query trunca na primeira página e some com
# thread aberta, o que faria você encerrar achando que não sobrou nada.
gh api graphql --paginate -f query='query($endCursor:String) {
  repository(owner:"craft-code-club", name:"blog-c3") {
  pullRequest(number:'"$PR"') { reviewThreads(first:50, after:$endCursor) {
    pageInfo { hasNextPage endCursor }
    nodes { id isResolved comments(first:1){nodes{databaseId author{login} path body}} } } } } }' \
  --jq '.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved==false)
        | "[\(.comments.nodes[0].databaseId)] \(.comments.nodes[0].author.login) \(.comments.nodes[0].path)\n\(.comments.nodes[0].body)\n---"'

# comentários soltos, ignorando o github-actions[bot], que é quem posta o link de
# preview do Cloudflare a cada push
gh api repos/$REPO/issues/$PR/comments --paginate \
  --jq '.[] | select(.user.login != "github-actions[bot]") | "[\(.id)] \(.user.login)\n\(.body)\n---"'

gh pr checks $PR --repo $REPO
gh pr view $PR --repo $REPO --json state,mergeable,mergeStateStatus,reviewDecision
```

Para acompanhar em intervalo, use `/loop 10m`. Um minuto é mais rápido que o ciclo real de um PR (bot leva minutos, humano leva bem mais) e só produz passadas idênticas.

## Verifique antes de agir

**Nunca aceite a alegação de um revisor sem conferir**, nem a de bot nem a de humano. Reproduza o problema apontado. Se ele não se sustenta, diga isso com a evidência ao lado.

Caso real: o Copilot afirmou que `path.resolve(__dirname, '../..')` a partir de `tests/e2e` resolvia para `tests/`, quebrando o teste. Errou por um nível — resolve para a raiz do repositório. Um `node -e` de dez segundos mostrou isso. Aceitar a alegação teria produzido uma "correção" que quebrava o código certo.

Confira também se o comentário ainda vale: revisões ficam presas ao commit que revisaram. Compare `original_commit_id` com o HEAD atual.

## Assine toda mensagem

**Todo comentário que você postar no PR começa com `(Claude Code)`**, na primeira linha, antes de qualquer outra coisa. Vale para resposta em thread, comentário solto e aviso de que vai resolver.

O repositório é público e quem lê a thread depois precisa saber, de cara, que ali respondeu um agente e não uma pessoa. Sem isso, uma afirmação técnica errada passa com o peso de revisão humana.

```markdown
(Claude Code)

Não procede, por dois motivos.
...
```

## Como responder cada tipo

**Bot (Copilot e afins):** responda ao mérito com a evidência, comente que vai resolver, resolva e cite o commit. Não precisa esperar ninguém.

**Humano:** responda ao mérito e, logo abaixo, **pergunte** se faz sentido e se a pessoa concorda em fechar. Só resolva depois de ela concordar, ou depois de você aplicar o que foi pedido. Se ela trouxer mais contexto, trate o contexto antes.

**Sempre comente antes de resolver, e depois cite o commit que endereçou.** Nunca resolva em silêncio: as threads são o registro de auditoria da decisão, e o repositório é público.

```bash
# responder numa thread de review
gh api repos/$REPO/pulls/$PR/comments/<comment_id>/replies -F body=@resposta.md

# resolver (pegue o threadId no GraphQL do ciclo acima)
gh api graphql -f query='mutation { resolveReviewThread(input:{threadId:"<id>"}) { thread { isResolved } } }'
```

## Quando parar e perguntar

Se um comentário questiona o desenho da mudança, e não a implementação — mudar o roteamento acordado, tirar algo do sitemap, inverter uma decisão de produto — **não enderece sozinho**. Traga para o usuário, explique o trade-off e espere. Ajuste de implementação você resolve; mudança de rumo é decisão dele.

## Antes de empurrar commit em PR aprovado

A `main` está com `dismiss_stale_reviews: true` e `require_last_push_approval: true`: **qualquer push novo derruba a aprovação existente** e exige review de novo.

Então, num PR já aprovado, só empurre o que a própria revisão pediu. Trabalho não relacionado vai para PR separado. Se precisar mesmo empurrar, avise o usuário do custo antes.

## Detalhes deste repositório

- **Push:** pode não haver chave SSH carregada no agent. Use o token do `gh` sem alterar a config global:
  `git -c credential.helper='!gh auth git-credential' push https://github.com/craft-code-club/blog-c3.git HEAD:<branch>`
- **Checks obrigatórios:** Build Pages, Deploy to Cloudflare Pages, CodeQL, CodeQL Analyze (javascript).
- **Antes de empurrar correção:** `npm run build` e `npm run test:e2e`. O `npm run lint` está quebrado na `main` por incompatibilidade do `eslint-plugin-react` com ESLint 10; não é regressão sua.
- **Commits:** conventional commits, em inglês. O corpo do PR usa o `.github/PULL_REQUEST_TEMPLATE.md`, cujos títulos e checklist são em inglês; o conteúdo que você escreve dentro dele vai em português.
- O `github-actions[bot]` comenta o link de preview do Cloudflare a cada push. É ruído, ignore.

## Ao terminar

Reporte: quantas threads foram fechadas e com que argumento, o estado dos checks, e o que ficou de fora com o motivo. Se o usuário puder estar longe, mande um `PushNotification` com o resultado.
