export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sobre o Craft & Code Club
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Uma comunidade dedicada à excelência em desenvolvimento de software e boas práticas de programação.
          </p>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nossa Missão</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Criar um espaço colaborativo onde desenvolvedores podem aprender, compartilhar conhecimento e crescer juntos. 
              Nosso foco está em promover as melhores práticas de desenvolvimento, Domain-Driven Design, e arquitetura limpa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">O Que Fazemos</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Workshops práticos sobre DDD, TDD e Clean Architecture</li>
              <li>Encontros mensais com palestras técnicas</li>
              <li>Discussões sobre boas práticas de desenvolvimento</li>
              <li>Projetos colaborativos da comunidade</li>
              <li>Mentoria e suporte entre membros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Participe da Comunidade</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Junte-se a nós para fazer parte de uma comunidade vibrante de desenvolvedores apaixonados por qualidade e artesanato de software.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://discord.gg/V7hQJZSDYu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors no-underline"
              >
                Entrar no Discord
              </a>
              <a
                href="https://www.meetup.com/craft-code-club"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors no-underline"
              >
                Ver Próximos Eventos
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contato</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Tem alguma dúvida ou sugestão? Entre em contato conosco:
            </p>
            <a
              href="mailto:contact@craftcodeclub.com"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 no-underline"
            >
              contact@craftcodeclub.com
            </a>
          </section>
        </div>
      </div>
    </div>
  );
} 