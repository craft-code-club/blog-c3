---
name: validacao-visual
description: Validação visual e manual de páginas do blog com o agent-browser CLI, em janela visível. Use quando precisar VER uma página renderizada (layout, quebra de texto, contraste, tema claro/escuro, viewport mobile), conferir hrefs no DOM já hidratado, ou capturar screenshots para revisão. Não use para teste automatizado de regressão, que é papel do Playwright em tests/e2e.
allowed-tools: Bash(agent-browser:*), Bash(npm run dev:*), Bash(curl:*)
---

# Validação visual com agent-browser

Complemento ao Playwright, não substituto.

| | Playwright (`tests/e2e/`) | agent-browser |
|---|---|---|
| Papel | regressão automatizada, roda em CI | inspeção pontual, durante o desenvolvimento |
| Responde | "continua passando?" | "como está ficando?" |
| Pega | link errado, noindex sumindo, rota quebrada | quebra de linha feia, contraste ruim, espaçamento torto |

Achado que motivou esta skill: o título `Engenharia de software de alto nível` quebrava deixando um "de" órfão no fim da linha. Os 45 testes passavam. Só olhando a tela dava para ver.

**Nunca porte teste automatizado para cá.** Se a checagem deve rodar sempre, ela pertence a `tests/e2e/`.

## Setup

```bash
npm install -g agent-browser
agent-browser install          # baixa o Chrome
```

## Fluxo

O servidor de dev precisa estar no ar (`npm run dev`, porta 3000).

```bash
agent-browser open http://localhost:3000/join --headed   # janela visível
agent-browser snapshot -i -u                             # elementos + hrefs
agent-browser click @e3                                  # age nos refs
agent-browser screenshot /tmp/pagina.png
agent-browser close
```

O `--headed` só vale na primeira chamada da sessão; o browser fica vivo entre comandos. Sem ele, roda headless.

Os refs (`@e1`, `@e2`) são reatribuídos a cada snapshot e ficam obsoletos assim que a página muda. Tire snapshot de novo antes de cada interação.

## Receitas deste projeto

**Higiene dos links de Discord.** O convite real só pode aparecer em `/join`; todo o resto aponta para lá. Ver [src/lib/discord.ts](../../../src/lib/discord.ts).

```bash
agent-browser open http://localhost:3000/join
agent-browser eval "[...document.querySelectorAll('a')].map(a=>a.getAttribute('href')).filter(h=>/discord/i.test(h)).join(' | ')"
# esperado: só https://discord.gg/<convite atual>
```

**Metadata de compartilhamento.** A `/join` é feita para ser compartilhada, então o card do link importa:

```bash
agent-browser eval "[...document.querySelectorAll('meta[property^=og]')].map(m=>m.getAttribute('property')+'='+m.content).join(' | ')"
```

**Tema claro/escuro.** O dark mode é por classe (`@variant dark (&:where(.dark, .dark *))` em `globals.css`), controlado pelo `next-themes`. Emular `prefers-color-scheme` não funciona. Alterne pelo botão do próprio site:

```bash
agent-browser snapshot -i | grep -i tema     # acha o ref do toggle
agent-browser click @e10
agent-browser eval "document.documentElement.className"   # confirma: light | dark
```

**Overflow no mobile.** O `resize` não existe na CLI (testado na 0.32.3). Meça direto:

```bash
agent-browser eval "document.documentElement.scrollWidth > document.documentElement.clientWidth"
# esperado: false
```

**Texto renderizado, para conferir copy e ordem dos blocos:**

```bash
agent-browser eval "document.querySelector('main').innerText.replace(/\n+/g,' | ')"
```

## Ao terminar

Olhe a screenshot de verdade. Frame em branco é falha de carregamento, não sucesso. E rode `npm run test:e2e` antes de abrir PR: o que você validou no olho não substitui a suíte.
