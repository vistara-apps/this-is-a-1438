import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import stripeService from '../services/stripeService'
import { getSubscription, saveSubscription } from '../utils/storage'

export const useSubscription = () => {
  const { user } = useApp()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load subscription data on mount
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setLoading(true)
        
        // First try to load from local storage
        const cachedSubscription = getSubscription()
        if (cachedSubscription) {
          setSubscription(cachedSubscription)
        }

        // If user is logged in, try to fetch latest from API
        if (user?.customerId) {
          try {
            const latestSubscription = await stripeService.getSubscriptionStatus(user.customerId)
            setSubscription(latestSubscription)
            saveSubscription(latestSubscription)
          } catch (apiError) {
            console.warn('Failed to fetch latest subscription status:', apiError)
            // Keep using cached data if API fails
          }
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [user])

  // Get subscription plans
  const plans = stripeService.getSubscriptionPlans()

  // Check if user has premium access
  const hasPremiumAccess = stripeService.hasPremiumAccess(subscription)

  // Get feature access based on subscription
  const featureAccess = stripeService.getFeatureAccess(subscription)

  // Subscribe to premium
  const subscribeToPremium = async (paymentMethodId) => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.email) {
        throw new Error('User email is required for subscription')
      }

      const newSubscription = await stripeService.createSubscription(
        plans.premium.priceId,
        user.email,
        paymentMethodId
      )

      setSubscription(newSubscription)
      saveSubscription(newSubscription)
      
      return newSubscription
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!subscription?.id) {
        throw new Error('No active subscription to cancel')
      }

      await stripeService.cancelSubscription(subscription.id)
      
      const updatedSubscription = {
        ...subscription,
        status: 'canceled',
        canceledAt: new Date().toISOString()
      }

      setSubscription(updatedSubscription)
      saveSubscription(updatedSubscription)
      
      return updatedSubscription
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update subscription
  const updateSubscription = async (newPriceId) => {
    try {
      setLoading(true)
      setError(null)

      if (!subscription?.id) {
        throw new Error('No active subscription to update')
      }

      const updatedSubscription = await stripeService.updateSubscription(
        subscription.id,
        newPriceId
      )

      setSubscription(updatedSubscription)
      saveSubscription(updatedSubscription)
      
      return updatedSubscription
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Check if feature is available
  const hasFeature = (featureName) => {
    return featureAccess[featureName] === true
  }

  // Check recording limit
  const canRecord = (currentRecordingCount = 0) => {
    if (featureAccess.unlimitedRecordings) return true
    
    const limit = featureAccess.recordingLimit
    if (limit === null) return true // unlimited
    
    return currentRecordingCount < limit
  }

  // Get remaining recordings for free users
  const getRemainingRecordings = (currentRecordingCount = 0) => {
    if (featureAccess.unlimitedRecordings) return null // unlimited
    
    const limit = featureAccess.recordingLimit
    if (limit === null) return null // unlimited
    
    return Math.max(0, limit - currentRecordingCount)
  }

  // Format subscription status for display
  const getSubscriptionStatusDisplay = () => {
    if (!subscription) return 'Free'
    
    switch (subscription.status) {
      case 'active':
        return 'Premium Active'
      case 'canceled':
        return 'Canceled'
      case 'past_due':
        return 'Payment Due'
      case 'unpaid':
        return 'Payment Failed'
      case 'incomplete':
        return 'Setup Incomplete'
      default:
        return 'Free'
    }
  }

  // Get next billing date
  const getNextBillingDate = () => {
    if (!subscription?.currentPeriodEnd) return null
    return new Date(subscription.currentPeriodEnd * 1000)
  }

  // Check if subscription is in grace period
  const isInGracePeriod = () => {
    if (!subscription) return false
    return subscription.status === 'past_due' || subscription.status === 'unpaid'
  }

  return {
    subscription,
    loading,
    error,
    plans,
    hasPremiumAccess,
    featureAccess,
    subscribeToPremium,
    cancelSubscription,
    updateSubscription,
    hasFeature,
    canRecord,
    getRemainingRecordings,
    getSubscriptionStatusDisplay,
    getNextBillingDate,
    isInGracePeriod,
    // Convenience flags
    isPremium: hasPremiumAccess,
    isFree: !hasPremiumAccess,
    isActive: subscription?.status === 'active',
    isCanceled: subscription?.status === 'canceled'
  }
}
