import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppContextProvider')
  }
  return context
}

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [incidentRecords, setIncidentRecords] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [selectedState, setSelectedState] = useState('')
  const [language, setLanguage] = useState('en')

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gavelguard-user')
    const savedRecords = localStorage.getItem('gavelguard-incidents')
    const savedState = localStorage.getItem('gavelguard-state')
    const savedLanguage = localStorage.getItem('gavelguard-language')

    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedRecords) setIncidentRecords(JSON.parse(savedRecords))
    if (savedState) setSelectedState(savedState)
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (user) localStorage.setItem('gavelguard-user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('gavelguard-incidents', JSON.stringify(incidentRecords))
  }, [incidentRecords])

  useEffect(() => {
    if (selectedState) localStorage.setItem('gavelguard-state', selectedState)
  }, [selectedState])

  useEffect(() => {
    localStorage.setItem('gavelguard-language', language)
  }, [language])

  const addIncidentRecord = (record) => {
    const newRecord = {
      ...record,
      recordId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user?.userId || 'anonymous'
    }
    setIncidentRecords(prev => [newRecord, ...prev])
    return newRecord
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    setUser,
    updateUser,
    incidentRecords,
    setIncidentRecords,
    addIncidentRecord,
    isRecording,
    setIsRecording,
    selectedState,
    setSelectedState,
    language,
    setLanguage
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}