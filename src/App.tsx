import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import TechStack from './components/sections/TechStack'
import Testimonials from './components/sections/Testimonials'
import ContactUs from './components/sections/ContactUs'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import AdminEditorPage from './pages/AdminEditorPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <div className="hero-spacer" />
              <Services />
              <TechStack />
              <Testimonials />
              <ContactUs />
            </main>
          }
        />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/adminblogs/editor" element={<AdminEditorPage />} />
        <Route path="/adminblogs/editor/:id" element={<AdminEditorPage />} />
      </Routes>
    </div>
  )
}

export default App
