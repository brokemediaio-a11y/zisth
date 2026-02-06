import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import TechStack from './components/sections/TechStack'
import Testimonials from './components/sections/Testimonials'
import ContactUs from './components/sections/ContactUs'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import AboutUsPage from './pages/AboutUsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminEditorPage from './pages/AdminEditorPage'
import ProtectedRoute from './components/ProtectedRoute'
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
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/editor"
          element={
            <ProtectedRoute>
              <AdminEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editor/:id"
          element={
            <ProtectedRoute>
              <AdminEditorPage />
            </ProtectedRoute>
          }
        />
        {/* Legacy routes redirect */}
        <Route path="/adminblogs/editor" element={<AdminEditorPage />} />
        <Route path="/adminblogs/editor/:id" element={<AdminEditorPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
