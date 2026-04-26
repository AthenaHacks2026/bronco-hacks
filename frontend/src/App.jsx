import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import { INITIAL_ONBOARDING } from './constants/onboarding'

import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import UploadPage from './pages/UploadPage'

import CaregiverInfoStep from './pages/onboarding/CaregiverInfoStep'
import DonorInfoStep from './pages/onboarding/DonorInfoStep'
import DonorThanksStep from './pages/onboarding/DonorThanksStep'
import NeedsStep from './pages/onboarding/NeedsStep'
import NeedsTagsStep from './pages/onboarding/NeedsTagsStep'
import OtherStep from './pages/onboarding/OtherStep'
import PostpartumStep from './pages/onboarding/PostpartumStep'
import PregnantStep from './pages/onboarding/PregnantStep'
import RecommendationsStep from './pages/onboarding/RecommendationsStep'
import UserTypeStep from './pages/onboarding/UserTypeStep'

function App() {
  const [onboarding, setOnboarding] = useState(INITIAL_ONBOARDING)

  const resetOnboarding = () => {
    setOnboarding(INITIAL_ONBOARDING)
  }

  const submitOnboarding = async () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    if (!token) {
      return {
        ok: false,
        message: 'Missing auth token. Please log in again.',
      }
    }

    if (!userId) {
      return {
        ok: false,
        message: 'Missing user ID. Please log in again.',
      }
    }

    try {
      const response = await fetch('/api/users/onboarding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ onboarding }),
      })

      const rawText = await response.text()
      const data = rawText ? JSON.parse(rawText) : {}

      if (!response.ok) {
        return {
          ok: false,
          message: data.message || 'Failed to save onboarding.',
        }
      }

      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        message: `Network error: ${error.message}`,
      }
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/signup"
          element={<SignupPage resetOnboarding={resetOnboarding} />}
        />

        <Route
          path="/onboarding/user-type"
          element={
            <UserTypeStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/donor-info"
          element={
            <DonorInfoStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/donor-thanks"
          element={<DonorThanksStep submitOnboarding={submitOnboarding} />}
        />
        <Route
          path="/onboarding/caregiver-info"
          element={
            <CaregiverInfoStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/pregnant"
          element={
            <PregnantStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/postpartum"
          element={
            <PostpartumStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/other"
          element={
            <OtherStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/needs"
          element={
            <NeedsStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/needs-tags"
          element={
            <NeedsTagsStep
              onboarding={onboarding}
              setOnboarding={setOnboarding}
              submitOnboarding={submitOnboarding}
            />
          }
        />
        <Route
          path="/onboarding/recommendations"
          element={<RecommendationsStep submitOnboarding={submitOnboarding} />}
        />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App