import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { INITIAL_ONBOARDING } from './constants/onboarding'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
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
  const resetOnboarding = () => setOnboarding(INITIAL_ONBOARDING)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage resetOnboarding={resetOnboarding} />} />
        <Route path="/onboarding/user-type" element={<UserTypeStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/donor-info" element={<DonorInfoStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/donor-thanks" element={<DonorThanksStep />} />
        <Route path="/onboarding/caregiver-info" element={<CaregiverInfoStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/pregnant" element={<PregnantStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/postpartum" element={<PostpartumStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/other" element={<OtherStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/needs" element={<NeedsStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/needs-tags" element={<NeedsTagsStep onboarding={onboarding} setOnboarding={setOnboarding} />} />
        <Route path="/onboarding/recommendations" element={<RecommendationsStep />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
