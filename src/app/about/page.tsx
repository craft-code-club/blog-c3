export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 mb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sobre o Craft & Code Club
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Uma comunidade dedicada à excelência em engenharia de software e boas práticas.
            Abordando desde a base com algoritmos e estruturas de dados até a arquitetura de sistemas avançadas.
          </p>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nossa Missão</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Criar um espaço colaborativo onde desenvolvedores e engenheiros de software podem aprender, compartilhar conhecimento e crescer juntos. 
              Nosso foco está em promover as melhores práticas de desenvolvimento, Algorítimos, Estruturas de Dados, System Design, Domain-Driven Design, Arquitetura limpa e tópicos avançados.
              <br />
              <br />
            </p>
            <p>
              Nosso principal objetivo é fazer com que nós como comunidade e quanto indivíduos possamos evoluir juntos, ajudando uns aos outros a alcançarmos o próximo nível como engenheiros de software, na carreira, e em nossos objetivos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">O Que Fazemos</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Encontros recorrentes para discutirmos sobre as bases com Algorítimos e Estruturas de Dados</li>
              <li>Encontros recorrentes para discutirmos sobre System Design</li>
              <li>Clube do Livro</li>
              <li>Encontros recorrentes para discutirmos sobre Tópicos Avançados</li>
              <li>Projetos colaborativos da comunidade</li>
              <li>Comunidade ativa no Discord onde discutimos sobre os tópicos avançados e compartilhamos conhecimento</li>
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