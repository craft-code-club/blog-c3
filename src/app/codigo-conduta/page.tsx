import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Código de Conduta | Craft & Code Club',
  description: 'Código de Conduta da comunidade Craft & Code Club - diretrizes para um ambiente inclusivo, respeitoso e colaborativo.',
};

export default function CodigoCondutaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Craft & Code Club - Código de Conduta
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Bem-vindos ao Craft & Code Club! A nossa comunidade está presente em vários canais de comunicação
              (como chats/Discord, eventos online, repositórios de projetos, etc) e foi criada para{' '}
              <strong>fomentar a troca de conhecimento em engenharia de software</strong> e todas as disciplinas que
              orbitam ao seu redor - por exemplo, <strong>programação</strong>, <strong>DevOps</strong> e{' '}
              <strong>gestão de projetos</strong>. Procuramos <strong>difundir</strong> práticas que promovam a{' '}
              <strong>colaboração</strong> e assegurem a <strong>entrega de produtos de qualidade</strong>.
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Pretendemos manter este ambiente inclusivo, aberto e respeitoso. Ao participar do Craft & Code Club,
              concorda em seguir este Código de Conduta, que se aplica a todas as interações na comunidade.
            </p>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Finalidade</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              <li>
                <strong>Promover a colaboração e a troca de conhecimento</strong>: Pretendemos que cada membro se sinta
                seguro para partilhar ideias e fazer perguntas.
              </li>
              <li>
                <strong>Fomentar o crescimento de todos</strong>: Independentemente do nível de experiência,
                todos são bem-vindos. Acreditamos que todos podem ensinar e aprender.
              </li>
              <li>
                <strong>Criar um ambiente acolhedor e inclusivo</strong>: Não importa se são iniciantes, experientes,
                programadores, engenheiros de dados, DevOps, arquitetos de software, designers ou estudantes.
                O nosso espaço é para todos.
              </li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Este Código de Conduta aplica-se a todas as interações na nossa comunidade, seja no Discord, em
              eventos presenciais, nos comentários do YouTube, nos repositórios de código e em qualquer outra
              plataforma relacionada ao Craft & Code Club.
            </p>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Comportamento Esperado</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Seja Respeitoso(a)</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Trate todos os membros com cordialidade e empatia. Evite julgamentos, ofensas, ou respostas que
                  intimidem ou diminuam alguém.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Use Linguagem Adequada</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Linguagem inadequada, insultos e linguagem ofensiva não serão tolerados.</li>
                  <li>Evite partilhar conteúdo violento, sexualmente explícito ou que possa constranger outros membros.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Mantenha Discussões Saudáveis</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Foco no assunto técnico e no aprendizado mútuo.</li>
                  <li>Divergências de opinião fazem parte de qualquer grupo, mas debate com respeito é essencial.</li>
                  <li>Evite transformar diferenças de opinião em discussões pessoais.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Respeite a Privacidade de Todos</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Não divulgue dados ou informações pessoais de terceiros sem consentimento.</li>
                  <li>Em plataformas de chat ao vivo, tenha cuidado ao expor informações sensíveis.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Use os Canais de Forma Apropriada</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Cada canal ou tópico tem um propósito. Use o canal correto para perguntas de código, infra, DevOps, AI, etc.</li>
                  <li>Perguntas fora de contexto podem ser redirecionadas pelos moderadores.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Faça Perguntas de Forma Construtiva</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Não há pergunta “tola”. No entanto, pesquise antes de questionar. Ferramentas como Google ou ChatGPT podem trazer respostas rápidas.</li>
                  <li>Se não quiser ou não puder ajudar, apenas abstenha-se. Desencorajar quem pergunta não contribui para a comunidade.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Seja Responsável Pelo Que Diz e Escreve</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Evite comentários políticos e religiosos.</li>
                  <li>Evite opiniões ou piadas que soem preconceituosas, discriminatórias ou depreciativas.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Colabore</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Participe das discussões ativamente e ajude no que puder.</li>
                  <li>Se vir alguém a esforçar-se para manter um ambiente positivo, reconheça e valorize esse comportamento.</li>
                </ul>
              </div>
            </div>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. Comportamentos Inaceitáveis</h2>

            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-6">
              <li>
                <strong>Assédio e Discriminação</strong>: Comentários ou ações que sejam sexistas, racistas,
                homofóbicos, transfóbicos, capacitistas ou que tenham qualquer teor de preconceito e discriminação.
              </li>
              <li>
                <strong>Agressões e Ataques Pessoais</strong>: Ofensas diretas, ameaças, perseguições,
                intimidações ou qualquer forma de coação.
              </li>
              <li>
                <strong>Divulgação de Conteúdo Sensível ou Ilegal</strong>: Partilhar dados privados de
                terceiros ou material protegido por direitos autorais sem permissão.
              </li>
              <li>
                <strong>Manifestação Política ou Religiosa que Gere Conflito</strong>: Qualquer posicionamento
                de natureza política ou religiosa feito de forma a constranger ou desrespeitar alguém, ou mesmo
                gerar discussões inflamadas.
              </li>
              <li>
                <strong>Desacato ou Desrespeito às Regras da Plataforma</strong>: Não cumprir as diretrizes
                específicas de cada plataforma (Discord, YouTube, etc.) também pode resultar em medidas por
                parte da nossa moderação.
              </li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Qualquer um desses comportamentos pode levar a advertências, suspensão e até banimento permanente,
              dependendo da gravidade.
            </p>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">4. Consequências do Comportamento Inaceitável</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Advertência</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Caso alguém viole o Código de Conduta, poderá receber um aviso formal da moderação ou dos organizadores.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Suspensão Temporária</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Se o comportamento persistir ou for grave, o membro poderá ser suspenso de todos os canais e
                  eventos por um período determinado.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. Banimento</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Em casos extremos ou após reincidência, o membro poderá ser banido permanentemente da comunidade.
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-6 mb-8">
              O nosso objetivo é sempre educar e manter um espaço seguro. Medidas punitivas serão tomadas apenas
              quando necessárias para proteger a comunidade.
            </p>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5. Se Você Passar ou Presenciar Situação de Abuso</h2>

            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              <li>
                <strong>Peça Ajuda</strong>: Entre em contato imediatamente com um(a) moderador(a) ou organizador(a)
                do Craft & Code Club por mensagem privada no Discord, ou por e-mail indicado em{' '}
                <a href="https://craftcodeclub.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  craftcodeclub.io
                </a>.
              </li>
              <li>
                <strong>Relate o Máximo de Detalhes Possível</strong>: Se houver prints ou links, envie, para nos
                ajudar a entender e tomar as devidas providências.
              </li>
              <li>
                <strong>O Nosso Compromisso</strong>: A organização compromete-se a analisar a situação com
                imparcialidade, tomar medidas necessárias e oferecer suporte a quem foi afetado.
              </li>
            </ul>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">6. Como Responder a uma Acusação</h2>

            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Se acreditar ter sido acusado injustamente de violar o Código de Conduta, explique a sua versão
              dos factos para a moderação ou organizadores. O caso será avaliado com cuidado, ouvindo todas as
              partes envolvidas, antes de uma decisão final.
            </p>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">7. Escopo</h2>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Este Código de Conduta aplica-se a todos os espaços do Craft & Code Club - incluindo, mas não se
              limitando a:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-8">
              <li>Servidor Discord</li>
              <li>Lives e eventos (online ou presenciais)</li>
              <li>Canais de vídeo e plataformas de streaming</li>
              <li>Repositórios de código e comentários em pull requests</li>
              <li>Qualquer outro local onde membros interajam oficialmente em nome ou como parte do Craft & Code Club</li>
            </ul>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">8. Contribuições</h2>

            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Nosso Código de Conduta está em constante evolução e busca refletir as necessidades e valores do
              Craft & Code Club. Se você deseja contribuir ou tem sugestões de melhoria, entre em contato conosco
              ou abra um Pull Request em nosso repositório (quando disponível). Sua participação é fundamental
              para a construção de uma comunidade cada vez melhor.
            </p>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <div className="text-center py-8">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Muito obrigado por ajudar a tornar o Craft & Code Club um lugar seguro, inclusivo e colaborativo para todos!
              </p>
              <a
                href="https://craftcodeclub.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                craftcodeclub.io
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
