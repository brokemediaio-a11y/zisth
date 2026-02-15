import { useState } from 'react'
import BlurText from '../components/ui/BlurText'
import TiltedCard from '../components/ui/TiltedCard'
import './AboutUsPage.css'

export default function AboutUsPage() {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  const teamMembers = [
    {
      name: 'NAVID KARL',
      role: 'CEO & Founder',
      bio: 'Leading Zisth with vision and expertise in technology innovation.'
    },
    {
      name: 'Sarah Chen',
      role: 'Lead Data Scientist',
      bio: 'Specializing in machine learning models and behavioral analysis systems.'
    },
    {
      name: 'Marcus Johnson',
      role: 'Senior Systems Engineer',
      bio: 'Expert in intelligent systems design and complex process automation.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'UX Design Director',
      bio: 'Creating human-centered experiences at the intersection of design and technology.'
    },
    {
      name: 'David Kim',
      role: 'Research Lead',
      bio: 'Driving interdisciplinary research and translating findings into products.'
    },
    {
      name: 'Amara Patel',
      role: 'Product Strategist',
      bio: 'Bridging research and productization with ethical constraints and real-world focus.'
    }
  ];

  const cards = [
    {
      title: 'Research to Product',
      description: 'From prototypes and evaluation to deployable systems'
    },
    {
      title: 'Interdisciplinary',
      description: 'Data science, design, engineering, systems thinking'
    },
    {
      title: 'Conscious and Ethical',
      description: 'Human values, agency, accountability'
    }
  ];

  return (
    <>
      <div className="about-us-story">
        <div className="about-us-story-header">
          <BlurText
            text="How Zisth Came to Be"
            delay={200}
            animateBy="words"
            direction="top"
            className="about-us-story-heading"
          />
          <p className="about-us-story-subtext">
            Zisth was born out of experience, not a blueprint. During the years we worked in technology and software services, one question kept repeating itself.
          </p>
        </div>

        <div className="about-us-story-content">
          <div className="about-us-story-text">
            <h3 className="about-us-story-question">A recurring question</h3>
            <p className="about-us-story-paragraph">
              How can technology become something more than a tool?
            </p>
            <p className="about-us-story-paragraph">
              We had worked with many systems, from commercial software to complex infrastructures. They all functioned, but none of them understood.
            </p>
            <p className="about-us-story-paragraph">
              That realization revealed a gap between technical performance and human understanding. If bridged, technology could become a partner in growth, learning, and decision-making.
            </p>
            <p className="about-us-story-paragraph">
              From this perspective, the idea of Zisth emerged. It was envisioned as a space for research, experimentation, and the development of technologies that could be both intelligent and meaningful.
            </p>
            <p className="about-us-story-paragraph">
              We began with projects related to artificial intelligence, but the path quickly expanded. Today, Zisth operates across diverse scientific and technological domains, from data analysis and intelligent systems design to interdisciplinary research at the intersection of science and human experience.
            </p>
            <p className="about-us-story-paragraph">
              Over time, the vision evolved into a working method: how we choose what to build, and why.
            </p>
          </div>
        </div>
      </div>

      <main className="about-us-page">
        <div className="about-us-container">
          <div className="about-us-header">
            <BlurText
              text="Zisth Synthesis Lab AB"
              delay={200}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="about-us-heading"
            />
            <p className="about-us-subtext">
              Zisth operates at the intersection of science, technology, and design, translating research into real products with a strong focus on artificial intelligence and intelligent systems.
            </p>
          </div>

          <div className="about-us-cards">
            {cards.map((card, index) => (
              <TiltedCard
                key={index}
                title={card.title}
                description={card.description}
                containerHeight="250px"
                containerWidth="100%"
                rotateAmplitude={8}
                scaleOnHover={1.03}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            ))}
          </div>

        <div className="about-us-approach">
          <div className="about-us-approach-section">
            <BlurText
              text="Our Approach"
              delay={200}
              animateBy="words"
              direction="top"
              className="about-us-approach-heading"
            />
            <p className="about-us-approach-intro">
              We work on projects that are both technically and ethically challenging, from machine learning models and behavioral analysis systems to intelligent experience design and the automation of complex processes.
            </p>
          </div>

          <div className="about-us-approach-grid">
            <div className="about-us-approach-column">
              <h3 className="about-us-approach-subheading">What we work on</h3>
              <ul className="about-us-approach-list">
                <li>Machine learning models and evaluation</li>
                <li>Behavioral analysis and decision support</li>
                <li>Intelligent systems design</li>
                <li>Automation of complex processes</li>
                <li>Human-centered experience design</li>
              </ul>
            </div>

            <div className="about-us-approach-column">
              <h3 className="about-us-approach-subheading">How we work</h3>
              <ul className="about-us-approach-list">
                <li>Interdisciplinary collaboration</li>
                <li>Rigor in research and engineering</li>
                <li>Ethical constraints as design inputs</li>
                <li>Iterative prototyping and validation</li>
                <li>Productization with real-world constraints</li>
              </ul>
            </div>
          </div>

          <p className="about-us-approach-transition">
            At Zisth, research doesn't end with publication. It evolves into products, and products into lasting impact. We focus on ideas that enhance efficiency, awareness, and human well-being.
          </p>
        </div>

        <div className="about-us-vision">
          <BlurText
            text="Our Vision"
            delay={200}
            animateBy="words"
            direction="top"
            className="about-us-vision-heading"
          />
          <p className="about-us-vision-intro">
            Zisth was born from a simple question, but its answer is still unfolding.
          </p>
          <div className="about-us-vision-question">
            <h3 className="about-us-vision-question-heading">Guiding question</h3>
            <p className="about-us-vision-question-text">
              How can we build a lasting balance between technology and human understanding, a space where artificial intelligence is neither a replacement for people nor merely their tool, but a true partner in human growth, understanding, and innovation?
            </p>
            <p className="about-us-vision-question-conclusion">
              This question continues to guide everything we research, design, and build at Zisth. For clarity, we've answered some of the most common questions about how Zisth operates and collaborates.
            </p>
          </div>
        </div>

        <div className="about-us-team">
          <div className="about-us-team-header">
            <BlurText
              text="Our Team"
              delay={200}
              animateBy="words"
              direction="top"
              className="about-us-team-heading"
            />
            <p className="about-us-team-subtext">
              Meet the people behind Zisth
            </p>
          </div>

          <div className="about-us-team-grid">
            <div className="about-us-team-card">
              <div className="about-us-team-card-avatar">
                <div className="about-us-team-card-avatar-placeholder">
                  {teamMembers[0].name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <h3 className="about-us-team-card-name">{teamMembers[0].name}</h3>
              <p className="about-us-team-card-role">{teamMembers[0].role}</p>
              <p className="about-us-team-card-bio">{teamMembers[0].bio}</p>
            </div>

            {teamMembers.slice(1).map((member, index) => (
              <div key={index + 1} className="about-us-team-card">
                <div className="about-us-team-card-avatar">
                  <div className="about-us-team-card-avatar-placeholder">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="about-us-team-card-name">{member.name}</h3>
                <p className="about-us-team-card-role">{member.role}</p>
                <p className="about-us-team-card-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-us-faq">
          <div className="about-us-faq-header">
            <BlurText
              text="FAQ"
              delay={200}
              animateBy="words"
              direction="top"
              className="about-us-faq-heading"
            />
            <p className="about-us-faq-subtext">
              Common questions about collaboration and how we work.
            </p>
          </div>

          <div className="about-us-faq-list">
            <FAQItem
              question="What types of partners do you collaborate with?"
              answer="Research groups, product teams, startups, and organizations looking to translate research into deployable systems and products."
            />
            <FAQItem
              question="Do you only work on artificial intelligence?"
              answer="No. AI and intelligent systems are a major focus, but Zisth operates across diverse scientific and technological domains."
            />
            <FAQItem
              question="How do you move from research to product?"
              answer="Prototyping, evaluation, iteration, system design, and productization, guided by real-world constraints and ethical safeguards."
            />
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="about-us-faq-item">
      <button
        className="about-us-faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className={`about-us-faq-icon ${isOpen ? 'open' : ''}`}>+</span>
      </button>
      {isOpen && (
        <div className="about-us-faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
