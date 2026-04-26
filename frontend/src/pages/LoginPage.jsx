import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'

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
        navigate('/dashboard')
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`)
    }
  }

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-brand">LittleLoop</div>

        <div className="login-left-content">
          <h2>Connecting caregivers with the resources they need.</h2>
          <p>Some smaller slogan here</p>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <h1>Log In</h1>
          <p className="login-subtitle">Welcome back to your account.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">
              <span className="label-with-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M2.66669 4.66669L7.31394 7.92077C7.71919 8.20444 8.28084 8.20444 8.6861 7.92077L13.3334 4.66669"
                    stroke="#364153"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 3.33331H4.00002C3.26364 3.33331 2.66669 3.93027 2.66669 4.66665V11.3333C2.66669 12.0697 3.26364 12.6666 4.00002 12.6666H12C12.7364 12.6666 13.3334 12.0697 13.3334 11.3333V4.66665C13.3334 3.93027 12.7364 3.33331 12 3.33331Z"
                    stroke="#364153"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Email Address
              </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">
              <span className="label-with-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12.6667 7.33331H3.33333C2.59695 7.33331 2 7.93027 2 8.66665V13.3333C2 14.0697 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0697 14 13.3333V8.66665C14 7.93027 13.403 7.33331 12.6667 7.33331Z"
                    stroke="#364153"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.66669 7.33331V4.66665C4.66669 3.78259 5.01788 2.93475 5.643 2.30962C6.26812 1.6845 7.11597 1.33331 8.00002 1.33331C8.88408 1.33331 9.73192 1.6845 10.357 2.30962C10.9822 2.93475 11.3334 3.78259 11.3334 4.66665V7.33331"
                    stroke="#364153"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Password
              </span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="login-button">
              Log In
            </button>
          </form>

          {message && <p className="login-message">{message}</p>}

          <p className="login-links">
            Need an account? <Link to="/signup">Go to Sign Up</Link>
          </p>

          <p className="login-links">
            <Link to="/">Back</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage