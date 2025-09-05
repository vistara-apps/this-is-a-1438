import { useState, useEffect } from 'react'
import openaiService from '../services/openaiService'
import pinataService from '../services/pinataService'
import stripeService from '../services/stripeService'
import { getApiKeys, saveApiKeys } from '../utils/storage'

export const useApiServices = () => {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState({
    openai: false,
    pinata: false,
    stripe: false
  })

  // Initialize services on mount
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setLoading(true)
        
        // Load API keys from storage
        const apiKeys = getApiKeys()
        
        const serviceStatus = {
          openai: false,
          pinata: false,
          stripe: false
        }

        // Initialize OpenAI
        if (apiKeys.openai) {
          serviceStatus.openai = openaiService.initialize(apiKeys.openai)
        }

        // Initialize Pinata
        if (apiKeys.pinata?.apiKey && apiKeys.pinata?.secretKey) {
          serviceStatus.pinata = pinataService.initialize(
            apiKeys.pinata.apiKey,
            apiKeys.pinata.secretKey
          )
        }

        // Initialize Stripe
        if (apiKeys.stripe?.publishableKey) {
          serviceStatus.stripe = await stripeService.initialize(apiKeys.stripe.publishableKey)
        }

        setServices(serviceStatus)
        setInitialized(Object.values(serviceStatus).some(status => status))
      } catch (error) {
        console.error('Error initializing API services:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeServices()
  }, [])

  // Configure API keys
  const configureApiKeys = async (keys) => {
    try {
      setLoading(true)
      
      const serviceStatus = { ...services }

      // Configure OpenAI
      if (keys.openai) {
        serviceStatus.openai = openaiService.initialize(keys.openai)
      }

      // Configure Pinata
      if (keys.pinata?.apiKey && keys.pinata?.secretKey) {
        serviceStatus.pinata = pinataService.initialize(
          keys.pinata.apiKey,
          keys.pinata.secretKey
        )
      }

      // Configure Stripe
      if (keys.stripe?.publishableKey) {
        serviceStatus.stripe = await stripeService.initialize(keys.stripe.publishableKey)
      }

      setServices(serviceStatus)
      setInitialized(Object.values(serviceStatus).some(status => status))
      
      // Save keys to storage
      saveApiKeys(keys)
      
      return serviceStatus
    } catch (error) {
      console.error('Error configuring API keys:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Generate rights script using OpenAI
  const generateRightsScript = async (scenario, state, language = 'en') => {
    if (!services.openai) {
      throw new Error('OpenAI service not available')
    }

    try {
      return await openaiService.generateRightsScript(scenario, state, language)
    } catch (error) {
      console.error('Error generating rights script:', error)
      throw error
    }
  }

  // Generate state law summary using OpenAI
  const generateStateLawSummary = async (state, topic) => {
    if (!services.openai) {
      throw new Error('OpenAI service not available')
    }

    try {
      return await openaiService.generateStateLawSummary(state, topic)
    } catch (error) {
      console.error('Error generating state law summary:', error)
      throw error
    }
  }

  // Generate incident summary using OpenAI
  const generateIncidentSummary = async (incidentData) => {
    if (!services.openai) {
      throw new Error('OpenAI service not available')
    }

    try {
      return await openaiService.generateIncidentSummary(incidentData)
    } catch (error) {
      console.error('Error generating incident summary:', error)
      throw error
    }
  }

  // Translate content using OpenAI
  const translateContent = async (content, targetLanguage) => {
    if (!services.openai) {
      throw new Error('OpenAI service not available')
    }

    try {
      return await openaiService.translateContent(content, targetLanguage)
    } catch (error) {
      console.error('Error translating content:', error)
      throw error
    }
  }

  // Upload file to Pinata
  const uploadFile = async (file, metadata = {}) => {
    if (!services.pinata) {
      throw new Error('Pinata service not available')
    }

    try {
      return await pinataService.uploadFile(file, metadata)
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  // Upload JSON to Pinata
  const uploadJSON = async (jsonData, metadata = {}) => {
    if (!services.pinata) {
      throw new Error('Pinata service not available')
    }

    try {
      return await pinataService.uploadJSON(jsonData, metadata)
    } catch (error) {
      console.error('Error uploading JSON:', error)
      throw error
    }
  }

  // Create incident package with Pinata
  const createIncidentPackage = async (incidentData, recordingBlob) => {
    if (!services.pinata) {
      throw new Error('Pinata service not available')
    }

    try {
      return await pinataService.createIncidentPackage(incidentData, recordingBlob)
    } catch (error) {
      console.error('Error creating incident package:', error)
      throw error
    }
  }

  // Generate shareable link
  const generateShareableLink = (metadataHash, recordingHash = null) => {
    return pinataService.generateShareableLink(metadataHash, recordingHash)
  }

  // Get service availability
  const getServiceAvailability = () => {
    return {
      openai: {
        available: services.openai,
        features: services.openai ? [
          'AI-generated rights scripts',
          'State law summaries',
          'Incident summaries',
          'Content translation'
        ] : []
      },
      pinata: {
        available: services.pinata,
        features: services.pinata ? [
          'Secure file storage',
          'Decentralized storage',
          'Shareable incident packages'
        ] : []
      },
      stripe: {
        available: services.stripe,
        features: services.stripe ? [
          'Subscription management',
          'Payment processing',
          'Premium features'
        ] : []
      }
    }
  }

  // Check if premium features are available
  const hasPremiumServices = () => {
    return services.openai && services.pinata
  }

  // Get fallback options when services are unavailable
  const getFallbackOptions = () => {
    const fallbacks = []

    if (!services.openai) {
      fallbacks.push({
        service: 'OpenAI',
        impact: 'AI-generated content not available',
        fallback: 'Static content and templates will be used'
      })
    }

    if (!services.pinata) {
      fallbacks.push({
        service: 'Pinata',
        impact: 'Secure cloud storage not available',
        fallback: 'Local storage only (data may be lost)'
      })
    }

    if (!services.stripe) {
      fallbacks.push({
        service: 'Stripe',
        impact: 'Premium subscriptions not available',
        fallback: 'All features available for free'
      })
    }

    return fallbacks
  }

  return {
    initialized,
    loading,
    services,
    configureApiKeys,
    generateRightsScript,
    generateStateLawSummary,
    generateIncidentSummary,
    translateContent,
    uploadFile,
    uploadJSON,
    createIncidentPackage,
    generateShareableLink,
    getServiceAvailability,
    hasPremiumServices,
    getFallbackOptions,
    // Convenience flags
    hasOpenAI: services.openai,
    hasPinata: services.pinata,
    hasStripe: services.stripe,
    hasAllServices: services.openai && services.pinata && services.stripe
  }
}
