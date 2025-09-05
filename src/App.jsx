import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppContextProvider } from './contexts/AppContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import RightsGuide from './pages/RightsGuide'
import StateLaws from './pages/StateLaws'
import IncidentRecorder from './pages/IncidentRecorder'
import Profile from './pages/Profile'
import SharedIncident from './pages/SharedIncident'
import AppShell from './components/AppShell'

function App() {
  return (
    <AppContextProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
          <Route path="/rights-guide" element={<AppShell><RightsGuide /></AppShell>} />
          <Route path="/state-laws" element={<AppShell><StateLaws /></AppShell>} />
          <Route path="/incident-recorder" element={<AppShell><IncidentRecorder /></AppShell>} />
          <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
          <Route path="/shared-incident" element={<SharedIncident />} />
        </Routes>
      </div>
    </AppContextProvider>
  )
}

export default App
