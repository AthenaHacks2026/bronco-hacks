import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignupPage.css'

function SignupPage({ resetOnboarding }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    resetOnboarding()
  }, [resetOnboarding])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setMessage('Please enter your full name.')
      return
    }

    if (!form.email.trim()) {
      setMessage('Please enter your email address.')
      return
    }

    if (form.password.length < 8) {
      setMessage('Password must be at least 8 characters long.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setMessage('Loading...')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })

      const rawText = await response.text()
      let data = {}

      try {
        data = rawText ? JSON.parse(rawText) : {}
      } catch {
        data = {}
      }

      if (!response.ok) {
        setMessage(data.message || `Signup failed: ${response.status} ${response.statusText}`)
        return
      }

      setMessage(data.message || 'Account created successfully.')

      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id)
      }

      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      resetOnboarding()
      navigate('/onboarding/user-type')
    } catch (error) {
      setMessage(`Network error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-left">
        <div className="signup-brand">LittleLoop</div>

        <div className="signup-left-content">
          <h2>Connecting caregivers with the resources they need.</h2>
          <p>Some smaller slogan here</p>
        </div>
      </section>

      <section className="signup-right">
        <div className="signup-card">
          <h1>Sign Up</h1>
          <p className="signup-subtitle">
            Get started by creating your account.
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="name">
              <span className="label-with-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12.6666 14V12.6667C12.6666 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7072 10 9.99998 10H5.99998C5.29274 10 4.61446 10.281 4.11436 10.781C3.61426 11.2811 3.33331 11.9594 3.33331 12.6667V14"
                    stroke="#364153"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.99998 7.33333C9.47274 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47274 2 7.99998 2C6.52722 2 5.33331 3.19391 5.33331 4.66667C5.33331 6.13943 6.52722 7.33333 7.99998 7.33333Z"
                    stroke="#364153"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Full Name
              </span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              required
            />

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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />

            <label htmlFor="confirmPassword">
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
                Confirm Password
              </span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" className="signup-button" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="signup-policy">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          {message && <p className="signup-message">{message}</p>}

          <p className="signup-links">
            Already have an account? <Link to="/login">Go to Login</Link>
          </p>

          <p className="signup-links">
            <Link to="/">Back</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default SignupPage