import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  saveUser, 
  getUser, 
  saveIncidents, 
  getIncidents, 
  saveSettings, 
  getSettings,
  saveSubscription,
  getSubscription
} from '../utils/storage'

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
  const [settings, setSettings] = useState({})
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data from enhanced storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load user data
        const savedUser = getUser()
        if (savedUser) setUser(savedUser)

        // Load incidents
        const savedIncidents = getIncidents()
        if (savedIncidents) setIncidentRecords(savedIncidents)

        // Load settings
        const savedSettings = getSettings()
        if (savedSettings) {
          setSettings(savedSettings)
          if (savedSettings.selectedState) setSelectedState(savedSettings.selectedState)
          if (savedSettings.language) setLanguage(savedSettings.language)
        }

        // Load subscription
        const savedSubscription = getSubscription()
        if (savedSubscription) setSubscription(savedSubscription)

      } catch (error) {
        console.error('Error loading app data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save to enhanced storage when state changes
  useEffect(() => {
    if (user && !loading) saveUser(user)
  }, [user, loading])

  useEffect(() => {
    if (!loading) saveIncidents(incidentRecords)
  }, [incidentRecords, loading])

  useEffect(() => {
    if (!loading) {
      const newSettings = {
        ...settings,
        selectedState,
        language
      }
      setSettings(newSettings)
      saveSettings(newSettings)
    }
  }, [selectedState, language, loading])

  useEffect(() => {
    if (subscription && !loading) saveSubscription(subscription)
  }, [subscription, loading])

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

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const deleteIncidentRecord = (recordId) => {
    setIncidentRecords(prev => prev.filter(record => record.recordId !== recordId))
  }

  const updateIncidentRecord = (recordId, updates) => {
    setIncidentRecords(prev => 
      prev.map(record => 
        record.recordId === recordId 
          ? { ...record, ...updates }
          : record
      )
    )
  }

  const clearAllData = () => {
    setUser(null)
    setIncidentRecords([])
    setSettings({})
    setSubscription(null)
    setSelectedState('')
    setLanguage('en')
  }

  const value = {
    user,
    setUser,
    updateUser,
    incidentRecords,
    setIncidentRecords,
    addIncidentRecord,
    deleteIncidentRecord,
    updateIncidentRecord,
    isRecording,
    setIsRecording,
    selectedState,
    setSelectedState,
    language,
    setLanguage,
    settings,
    setSettings,
    updateSettings,
    subscription,
    setSubscription,
    loading,
    clearAllData
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
