export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Craft & Code Club</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A community of passionate developers dedicated to software craftsmanship and continuous learning.
          </p>
        </header>

        <div className="prose dark:prose-dark prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in creating high-quality software through disciplined practices, continuous learning, and knowledge sharing. Our community focuses on Domain-Driven Design, Clean Architecture, and software craftsmanship principles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Do</h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Organize workshops and coding sessions focused on best practices and modern development techniques.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Share knowledge through blog posts, tutorials, and live coding sessions.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Foster a community of developers who are passionate about writing clean, maintainable code.</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join Our Community</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We welcome developers of all skill levels who are passionate about improving their craft and sharing knowledge with others.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://discord.gg/V7hQJZSDYu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Join Discord
              </a>
              <a
                href="https://www.meetup.com/craft-code-club"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Join Meetup Group
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Have questions or want to get involved? Reach out to us:
            </p>
            <a
              href="mailto:contact@craftcodeclub.com"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              contact@craftcodeclub.com
            </a>
          </section>
        </div>
      </div>
    </div>
  );
} 