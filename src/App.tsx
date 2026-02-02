import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <div className="hero-spacer" />
        <Services />
      </main>
    </div>
  )
}

export default App
