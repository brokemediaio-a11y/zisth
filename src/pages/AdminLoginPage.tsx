import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './AdminLoginPage.css'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/admin/editor')
    } else {
      setError(result.error || 'Failed to sign in. Please check your credentials.')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <h1 className="admin-login__title">Admin Login</h1>
        <p className="admin-login__subtitle">Sign in to access the blog editor</p>
        
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__input-group">
            <label htmlFor="email" className="admin-login__label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="admin-login__input"
              autoFocus
              required
              disabled={isLoading}
            />
          </div>

          <div className="admin-login__input-group">
            <label htmlFor="password" className="admin-login__label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="admin-login__input"
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="admin-login__error">{error}</p>}
          
          <button
            type="submit"
            className="admin-login__button"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
