# Eventos: configuração

Este documento explica como configurar eventos em `_content/events/*.md` e como esses dados sao usados no site e no bot do Discord.

## Frontmatter

Campos suportados hoje:

- `title` (string): titulo do evento.
- `description` (string): descricao curta exibida no site e usada no SEO.
- `date` (string): data no formato `YYYY-MM-DD`.
- `time` (string): faixa de horario no formato `HH:mm-HH:mm`.
- `location` (string): local exibido no card e nos detalhes.
- `type` (string): tipo do evento (exemplo: `online`, `hybrid`).
- `banner` (string, opcional): nome da imagem do evento.
- `registrationLink` (string, opcional): link de inscricao/participacao.
- `recordingLink` (string, opcional): link da gravação ou live do evento.
- `postLink` (string, opcional): link de artigo relacionado.
- `speakers` (string[], opcional): lista de palestrantes.
- `tags` (string[], opcional): tags do evento.
- `isLive` (boolean, opcional): campo extra (nao usado pelo site hoje); usado por automacoes externas (ex.: bot do Discord).
- `youtubeTitle` (string, opcional): campo extra (nao usado pelo site hoje); usado por automacoes externas (ex.: bot do Discord).
- `sessionLink` (string, opcional): campo extra (nao usado pelo site hoje); usado por automacoes externas (ex.: bot do Discord).

Tags encontradas hoje em `_content/events/*.md`:

- `book-club`
- `ddia`

## Website

### Slug (nome do arquivo)

O slug e o nome do arquivo Markdown sem `.md`.

Formato recomendado:

```text
<contexto>-<titulo-do-evento>
```

Padroes usados no projeto:

- Algoritmos e Estruturas de Dados: `dsa-<titulo>.md`
- Clube do Livro de System Design: `book-sd-<titulo>.md`
- Clube do Livro DDIA: `book-club-ddia-chapter-<numero>.md`
- Lives: `live-<titulo>.md`
- Outros: `<titulo>.md`

Exemplo real:

- `book-club-ddia-chapter-2.md`

Como e usado:

- Rota publica: `/events/<slug>`

### Card List

Comportamento do card na listagem

- Sempre mostra `title`, `description`, `date`, `time`, `location`, `type`.
- `tags` renderiza como chips (`span`), nao como botao/link.
- `speakers` aparece como lista somente quando existe.

#### Evento passado

- Mostra botao `Ver Detalhes`.
- Mostra `Assistir Gravacao` somente quando `recordingLink` existe.

#### Evento hoje

- Mostra `Participar Agora` apontando para `registrationLink`.
- Mostra `Entrar no Discord`.

#### Evento futuro

- Se `registrationLink` contem `youtube.com/watch?v=`: mostra `Agendar Lembrete` + `Entrar no Discord`.
- Caso contrario: mostra `Adicionar ao Calendario` + `Entrar no Discord`.

### Card Details

Comportamento da pagina de detalhe

- Mostra `title`, `description`, `date`, `time`, `location`, `type`.
- `banner` so aparece quando existe.
- `speakers` so aparece quando existe.
- `tags` renderiza como chips (`span`).

#### Evento passado

- Mostra `Assistir Gravacao` quando `recordingLink` existe.
- Mostra `Ler Artigo` quando `postLink` existe.

#### Evento hoje

- Com `registrationLink`: mostra `Participar Agora`.
- Sem `registrationLink`: fallback para `Participar via Discord`.
- Sempre mostra `Entrar no Discord`.

#### Evento futuro

- Mostra `Adicionar ao Calendario` + `Entrar no Discord`.

## Discord Bot

Os eventos tambem sao processados pelo discordbot.

### YouTube event scheduling

Agendamento de live no YouTube

- So agenda YouTube quando:
  - `isLive: true`
  - `recordingLink` vazio no frontmatter
  - `recording_link` vazio no registro existente do bot
- Se criar com sucesso, salva a URL `https://www.youtube.com/watch?v=<id>` em `recording_link`.
- Usa `youtubeTitle` quando preenchido; fallback para `title`.
- Faz upload de thumbnail usando `banner` quando disponivel.

### Discord chat notification

Notificacoes no canal de eventos

- Janela de lembretes: 1 semana, 3 dias, 1 dia e 1 hora antes.
- O embed inclui horarios em BR/CA/PT
- Link de participacao no embed segue fallback:
  - quando `sessionLink` existe, mostra o link de participacao em tempo real (exemplo: Zoom, Google Meet)
  - quando `recordingLink` existe, mostra o link da live (exemplo: YouTube)
  - Mostra sempre o link de detalhes do evento no site (`https://craftcodeclub.io/events/<slug>`)

### Discord event sechulining

Agendamento de evento no Discord

- Processa apenas eventos futuros.
- Cria evento agendado no Discord
- Se a data/hora mudou, remove o evento antigo no Discord e cria outro.
- Local do evento no Discord segue fallback:
  - Se `sessionLink` existe, mostra o link de participacao em tempo real (exemplo: Zoom, Google Meet)
  - Senao se `recordingLink` existe, mostra o link da live (exemplo: YouTube)
  - senao link de detalhes do evento no site
