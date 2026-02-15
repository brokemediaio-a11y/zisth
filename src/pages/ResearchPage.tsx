import { useState } from 'react'
import TextType from '../components/ui/TextType'
import './ResearchPage.css'

// Demo research articles data
interface ResearchArticle {
  id: string
  title: string
  abstract: string
  authors: string[]
  date: string
  category: string
  type: string
  tags: string[]
  featured?: boolean
}

const demoResearchArticles: ResearchArticle[] = [
  {
    id: '1',
    title: 'Neural Architecture Search for Adaptive Learning Systems',
    abstract: 'We present a novel approach to neural architecture search that enables adaptive learning systems to dynamically reconfigure their network topology based on task complexity and data characteristics. Our experimental results demonstrate significant improvements in both accuracy and computational efficiency across multiple benchmark datasets.',
    authors: ['Dr. Sarah Chen', 'Dr. Michael Zhang', 'Alexandra Rodriguez'],
    date: '2024-01-15',
    category: 'Original Research',
    type: 'Machine Learning',
    tags: ['Neural Networks', 'Adaptive Systems', 'Architecture Search'],
    featured: true
  },
  {
    id: '2',
    title: 'Clinical Validation of AI-Powered Diagnostic Assistant',
    abstract: 'This study evaluates the clinical performance of our AI-powered diagnostic assistant in real-world healthcare settings. Through a multi-center trial involving 500+ patient cases, we demonstrate improved diagnostic accuracy and reduced time-to-diagnosis compared to traditional methods.',
    authors: ['Dr. James Wilson', 'Dr. Emily Thompson'],
    date: '2024-01-08',
    category: 'Clinical Evaluation',
    type: 'Applied Research',
    tags: ['Healthcare AI', 'Clinical Validation', 'Diagnostic Systems'],
    featured: true
  },
  {
    id: '3',
    title: 'Prototype Evaluation: Autonomous Decision Support Framework',
    abstract: 'We developed and evaluated a prototype autonomous decision support framework that integrates behavioral analysis with predictive modeling. Technical validation results show promising performance in complex decision-making scenarios with reduced human intervention requirements.',
    authors: ['Dr. Robert Kim', 'Maria Santos', 'Dr. David Lee'],
    date: '2023-12-20',
    category: 'Technical Validation',
    type: 'Prototype Development',
    tags: ['Autonomous Systems', 'Decision Support', 'Behavioral Analysis']
  },
  {
    id: '4',
    title: 'Experimental Results: Quantum-Inspired Optimization Algorithms',
    abstract: 'Our experimental investigation into quantum-inspired optimization algorithms reveals novel approaches to solving complex optimization problems. The results demonstrate significant performance improvements over classical methods in specific problem domains.',
    authors: ['Dr. Lisa Anderson', 'Dr. Mark Johnson'],
    date: '2023-12-10',
    category: 'Original Research',
    type: 'Experimental',
    tags: ['Quantum Computing', 'Optimization', 'Algorithms']
  },
  {
    id: '5',
    title: 'Translational Development: From Research to Production ML System',
    abstract: 'This paper documents our translational development process, bridging research insights into a production-ready machine learning system. We discuss challenges, solutions, and lessons learned in deploying research-grade models to real-world applications.',
    authors: ['Dr. Jennifer Park', 'Thomas Brown', 'Dr. Amanda White'],
    date: '2023-11-28',
    category: 'Translational Development',
    type: 'Applied Research',
    tags: ['MLOps', 'Production Systems', 'Translational Research']
  },
  {
    id: '6',
    title: 'Knowledge Insights: Human-AI Collaboration Patterns',
    abstract: 'Through extensive analysis of human-AI interaction data, we identify key patterns that enhance collaborative effectiveness. These insights inform the design of more intuitive and effective intelligent systems that augment human capabilities.',
    authors: ['Dr. Christopher Martinez', 'Rachel Green'],
    date: '2023-11-15',
    category: 'Knowledge & Insights',
    type: 'Research Analysis',
    tags: ['Human-AI Interaction', 'Collaboration', 'UX Design']
  },
  {
    id: '7',
    title: 'Technical Evaluation: Scalability of Distributed AI Systems',
    abstract: 'We conducted comprehensive technical evaluations of distributed AI system architectures, focusing on scalability, latency, and resource efficiency. Our findings provide guidelines for designing large-scale intelligent systems.',
    authors: ['Dr. Kevin Nguyen', 'Sophie Williams', 'Dr. Brian Taylor'],
    date: '2023-11-05',
    category: 'Technical Validation',
    type: 'System Evaluation',
    tags: ['Distributed Systems', 'Scalability', 'Performance']
  },
  {
    id: '8',
    title: 'Experimental Prototype: Real-Time Cognitive Load Assessment',
    abstract: 'We developed an experimental prototype for real-time cognitive load assessment using multimodal sensor data. Initial validation shows promising accuracy in detecting cognitive states, with potential applications in adaptive interface design.',
    authors: ['Dr. Nicole Garcia', 'Daniel Kim'],
    date: '2023-10-22',
    category: 'Prototype Development',
    type: 'Experimental',
    tags: ['Cognitive Computing', 'Sensor Fusion', 'Adaptive Interfaces']
  }
]

export default function ResearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const categories = ['All', 'Original Research', 'Clinical Evaluation', 'Technical Validation', 'Translational Development', 'Knowledge & Insights', 'Prototype Development']
  
  const featuredArticles = demoResearchArticles.filter(article => article.featured)
  const filteredArticles = selectedCategory === 'All' 
    ? demoResearchArticles.filter(article => !article.featured)
    : demoResearchArticles.filter(article => !article.featured && article.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="research-page">
      <div className="research-heading-container">
        <h1 className="research-heading">
          <TextType
            text={[
              "Zisth's scientific Research",
              "Internally conducted studies",
              "Technical validation",
              "Translational development work"
            ]}
            typingSpeed={125}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="research-heading-text"
          />
        </h1>
      </div>
      <div className="research-container">
        <header className="research-header">
          <p className="research-subtext">
            Zist's scientific and applied research activities, including internally conducted studies, 
            technical validation, and translational development work. Our research spans from experimental 
            prototypes to clinical evaluations, translating knowledge into actionable insights and products.
          </p>
        </header>

        {/* Featured Research Section */}
        {featuredArticles.length > 0 && (
          <section className="research-featured">
            <h2 className="research-section-title">Featured Research</h2>
            <div className="research-featured-grid">
              {featuredArticles.map((article) => (
                <article key={article.id} className="research-card research-card--featured">
                  <div className="research-card__badges">
                    <span className="research-card__category">{article.category}</span>
                    <span className="research-card__type">{article.type}</span>
                  </div>
                  <h3 className="research-card__title">{article.title}</h3>
                  <p className="research-card__abstract">{article.abstract}</p>
                  <div className="research-card__meta">
                    <div className="research-card__authors">
                      <span className="research-card__authors-label">Authors:</span>
                      <span className="research-card__authors-list">
                        {article.authors.join(', ')}
                      </span>
                    </div>
                    <time className="research-card__date">{formatDate(article.date)}</time>
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="research-card__tags">
                      {article.tags.map((tag) => (
                        <span key={tag} className="research-card__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Research Section */}
        <section className="research-all">
          <div className="research-all-header">
            <h2 className="research-section-title">All Research</h2>
            <div className="research-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`research-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="research-grid">
            {filteredArticles.map((article) => (
              <article key={article.id} className="research-card">
                <div className="research-card__badges">
                  <span className="research-card__category">{article.category}</span>
                  <span className="research-card__type">{article.type}</span>
                </div>
                <h3 className="research-card__title">{article.title}</h3>
                <p className="research-card__abstract">{article.abstract}</p>
                <div className="research-card__meta">
                  <div className="research-card__authors">
                    <span className="research-card__authors-label">Authors:</span>
                    <span className="research-card__authors-list">
                      {article.authors.join(', ')}
                    </span>
                  </div>
                  <time className="research-card__date">{formatDate(article.date)}</time>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="research-card__tags">
                    {article.tags.map((tag) => (
                      <span key={tag} className="research-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
