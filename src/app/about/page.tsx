export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 mb-20">
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
                href="https://discord.gg/cqF9THUfnN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors no-underline"
              >
                Entrar no Discord
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 