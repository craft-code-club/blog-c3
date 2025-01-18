export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Craft & Code Club</h1>
      
      <section className="prose lg:prose-xl max-w-none">
        <p>
          Craft & Code Club is a community of developers passionate about software craftsmanship, 
          Domain-Driven Design (DDD), and clean architecture. We believe in writing code that not 
          only works but is also maintainable, scalable, and a joy to work with.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to create a space where developers can learn, share, and grow together. 
          We focus on practical applications of software design principles, architectural patterns, 
          and coding best practices.
        </p>

        <h2>What We Do</h2>
        <ul>
          <li>Regular meetups and workshops</li>
          <li>Technical blog posts and tutorials</li>
          <li>Code reviews and pair programming sessions</li>
          <li>Open source projects and contributions</li>
          <li>Community discussions and knowledge sharing</li>
        </ul>

        <h2>Join Our Community</h2>
        <p>
          We welcome developers of all skill levels who are interested in improving their craft. 
          Here's how you can get involved:
        </p>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <a 
            href="https://discord.gg/V7hQJZSDYu"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Discord Community</h3>
            <p className="text-gray-600">Join our active Discord community for discussions and help</p>
          </a>
          <a 
            href="https://www.meetup.com/craft-code-club"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Meetup Group</h3>
            <p className="text-gray-600">Attend our in-person and online events</p>
          </a>
        </div>

        <h2>Contact Us</h2>
        <p>
          Have questions or want to contribute? Reach out to us on Discord or through our GitHub organization.
        </p>
      </section>
    </div>
  );
} 