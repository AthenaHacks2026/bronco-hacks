import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignupPage({ resetOnboarding }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    resetOnboarding()
  }, [resetOnboarding])

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
        if (data.user?.id) {
          localStorage.setItem('userId', data.user.id)
        }
        setForm({ name: '', email: '', password: '' })
        resetOnboarding()
        navigate('/onboarding/user-type')
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

export default SignupPage
