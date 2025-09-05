class StripeService {
  constructor() {
    this.stripe = null
    this.initialized = false
    this.publishableKey = null
  }

  async initialize(publishableKey) {
    if (!publishableKey) {
      console.warn('Stripe publishable key not provided')
      return false
    }

    try {
      // Dynamically import Stripe
      const { loadStripe } = await import('@stripe/stripe-js')
      this.stripe = await loadStripe(publishableKey)
      this.publishableKey = publishableKey
      this.initialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize Stripe:', error)
      return false
    }
  }

  async createSubscription(priceId, customerEmail, paymentMethodId) {
    if (!this.initialized) {
      throw new Error('Stripe service not initialized')
    }

    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the subscription creation
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerEmail,
          paymentMethodId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create subscription')
      }

      const subscription = await response.json()
      return subscription
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  async createPaymentMethod(cardElement) {
    if (!this.initialized || !this.stripe) {
      throw new Error('Stripe service not initialized')
    }

    try {
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        throw new Error(error.message)
      }

      return paymentMethod
    } catch (error) {
      console.error('Error creating payment method:', error)
      throw new Error('Failed to create payment method')
    }
  }

  async confirmPayment(clientSecret, paymentMethodId) {
    if (!this.initialized || !this.stripe) {
      throw new Error('Stripe service not initialized')
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId
      })

      if (error) {
        throw new Error(error.message)
      }

      return paymentIntent
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw new Error('Failed to confirm payment')
    }
  }

  async cancelSubscription(subscriptionId) {
    if (!this.initialized) {
      throw new Error('Stripe service not initialized')
    }

    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  async updateSubscription(subscriptionId, newPriceId) {
    if (!this.initialized) {
      throw new Error('Stripe service not initialized')
    }

    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      const subscription = await response.json()
      return subscription
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw new Error('Failed to update subscription')
    }
  }

  async getSubscriptionStatus(customerId) {
    if (!this.initialized) {
      throw new Error('Stripe service not initialized')
    }

    try {
      // In a real app, this would call your backend API
      const response = await fetch(`/api/subscription-status/${customerId}`)

      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      const status = await response.json()
      return status
    } catch (error) {
      console.error('Error getting subscription status:', error)
      throw new Error('Failed to get subscription status')
    }
  }

  // Helper method to format price for display
  formatPrice(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  // Subscription plans configuration
  getSubscriptionPlans() {
    return {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'usd',
        interval: 'month',
        features: [
          'Basic rights guide',
          'Limited state law access',
          '3 incident recordings per month',
          'Basic incident summaries'
        ],
        limitations: [
          'No offline access',
          'Limited recording storage',
          'Basic support only'
        ]
      },
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 499, // $4.99 in cents
        currency: 'usd',
        interval: 'month',
        priceId: 'price_premium_monthly', // This would be your actual Stripe price ID
        features: [
          'Complete rights guide with AI-generated scripts',
          'Full state law database access',
          'Unlimited incident recordings',
          'Advanced incident summaries with AI analysis',
          'Offline access to all content',
          'Secure cloud storage',
          'Priority support',
          'Multi-language support'
        ],
        limitations: []
      }
    }
  }

  // Check if user has premium features
  hasPremiumAccess(subscriptionStatus) {
    if (!subscriptionStatus) return false
    
    return subscriptionStatus.status === 'active' && 
           subscriptionStatus.plan !== 'free'
  }

  // Get feature availability based on subscription
  getFeatureAccess(subscriptionStatus) {
    const isPremium = this.hasPremiumAccess(subscriptionStatus)
    
    return {
      aiGeneratedScripts: isPremium,
      unlimitedRecordings: isPremium,
      offlineAccess: isPremium,
      advancedSummaries: isPremium,
      secureCloudStorage: isPremium,
      multiLanguage: isPremium,
      prioritySupport: isPremium,
      fullStateLaws: isPremium,
      recordingLimit: isPremium ? null : 3 // null means unlimited
    }
  }
}

export default new StripeService()
