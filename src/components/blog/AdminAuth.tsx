import { useState, type FormEvent } from 'react'
import './AdminAuth.css'

const ADMIN_PASSWORD = 'navid123'

interface AdminAuthProps {
  onAuthenticated: () => void
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store auth in sessionStorage (clears on tab close)
        sessionStorage.setItem('admin_authenticated', 'true')
        onAuthenticated()
      } else {
        setError('Incorrect password. Please try again.')
        setPassword('')
      }
      setIsLoading(false)
    }, 300)
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth__container">
        <h1 className="admin-auth__title">Admin Access</h1>
        <p className="admin-auth__subtitle">Enter password to access the blog editor</p>
        
        <form onSubmit={handleSubmit} className="admin-auth__form">
          <div className="admin-auth__input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="admin-auth__input"
              autoFocus
              required
            />
            {error && <p className="admin-auth__error">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="admin-auth__button"
            disabled={isLoading || !password}
          >
            {isLoading ? 'Verifying...' : 'Access Editor'}
          </button>
        </form>
      </div>
    </div>
  )
}
