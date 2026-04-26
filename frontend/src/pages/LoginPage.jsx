import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
        if (data.user?.id) {
          localStorage.setItem('userId', data.user.id)
        }
        navigate('/dashboard')
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

export default LoginPage
