import { useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

function LandingPage() {
  return (
    <main className="page">
      <h1>Wesite Name!</h1>
      <p>Choose an option below.</p>
      <div className="button-row">
        <Link className="button-link" to="/login">
          Login
        </Link>
        <Link className="button-link" to="/signup">
          Sign Up
        </Link>
      </div>
    </main>
  )
}

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('Loading...')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      setMessage(data.message || `${response.status} ${response.statusText}`)

      if (data.token) {
        localStorage.setItem('token', data.token)
        navigate('/user-home')
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`)
    }
  }

  return (
    <main className="page">
      <h1>Sign Up</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          required
        />

        <button type="submit">Create Account</button>
      </form>
      <p>{message}</p>
      <p>
        Already have an account? <Link to="/login">Go to Login</Link>
      </p>
      <p>
        <Link to="/">Back</Link>
      </p>
    </main>
  )
}

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('Loading...')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      setMessage(data.message || `${response.status} ${response.statusText}`)

      if (data.token) {
        localStorage.setItem('token', data.token)
        navigate('/user-home')
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`)
    }
  }

  return (
    <main className="page">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />

        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p>
        Need an account? <Link to="/signup">Go to Sign Up</Link>
      </p>
      <p>
        <Link to="/">Back</Link>
      </p>
    </main>
  )
}

function UserHomePage() {
  const handleLogout = () => {
    localStorage.removeItem('token')
  }

  return (
    <main className="page">
      <h1>Wecome</h1>
      <p>This is your user home page.</p>
      <p>
        <Link to="/" onClick={handleLogout}>
          Logout
        </Link>
      </p>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user-home" element={<UserHomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
