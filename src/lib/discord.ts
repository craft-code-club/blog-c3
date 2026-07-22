/**
 * Convite oficial do Discord da comunidade.
 *
 * Este é o ÚNICO lugar do código onde o convite real aparece, e ele só é usado
 * pela página `/join`. Para trocar o convite, revogue o link no Discord, gere um
 * novo e atualize apenas a constante abaixo. Nenhum outro arquivo precisa mudar.
 *
 * Não use esta constante em outras páginas ou componentes: todo "Entrar no
 * Discord" do site deve apontar para `DISCORD_PAGE_PATH`, para que continue
 * existindo um único ponto de rotação.
 */
export const DISCORD_INVITE_URL = 'https://discord.gg/b5NnndAbFc';

/**
 * Caminho da página de convite. É para cá que todo link de Discord do site
 * aponta, nunca direto para `discord.gg`.
 */
export const DISCORD_PAGE_PATH = '/join';

/**
 * Token para o conteúdo em markdown, onde não dá para importar constante.
 * Use `{{discord-link}}` no lugar do link:
 *
 *     [Entre na comunidade]({{discord-link}})
 *     registrationLink: "{{discord-link}}"
 *
 * É resolvido no build ao carregar posts e eventos. Assim o conteúdo não fica
 * preso a para onde o link aponta hoje.
 */
export const DISCORD_LINK_TOKEN = '{{discord-link}}';

/**
 * Destino do token. Mudar aqui reescreve todo o conteúdo de uma vez, sem editar
 * nenhum arquivo de markdown.
 */
export const DISCORD_LINK_TARGET: string = DISCORD_PAGE_PATH;

/** Troca todas as ocorrências do token pelo destino atual. */
export function resolveDiscordLinks(text: string): string {
  return text.split(DISCORD_LINK_TOKEN).join(DISCORD_LINK_TARGET);
}
