import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Book, Video, Share2, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Select from '../components/Select'
import { useApp } from '../contexts/AppContext'

const Landing = () => {
  const navigate = useNavigate()
  const { setSelectedState, setLanguage, setUser } = useApp()
  const [formData, setFormData] = useState({
    state: '',
    language: 'en'
  })

  const features = [
    {
      icon: Shield,
      title: 'On-Demand Rights Guide',
      description: 'Get situation-specific guidance and scripts for police interactions in English and Spanish.',
    },
    {
      icon: Book,
      title: 'State Law Quick Reference',
      description: 'Access clear, digestible summaries of your state-specific rights and laws.',
    },
    {
      icon: Video,
      title: 'One-Tap Incident Recorder',
      description: 'Discreetly record interactions with automatic timestamp and GPS logging.',
    },
    {
      icon: Share2,
      title: 'Shareable Incident Summary',
      description: 'Generate and share incident details with trusted contacts or legal aid.',
    },
  ]

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  const handleGetStarted = () => {
    if (formData.state) {
      setSelectedState(formData.state)
      setLanguage(formData.language)
      setUser({
        userId: Date.now().toString(),
        subscriptionStatus: 'free',
        preferredLanguage: formData.language,
        savedContacts: []
      })
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden gradient-purple">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-2xl font-bold text-white">
              Gavel Guard
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-white hover:text-purple-200">Features</a>
              <a href="#pricing" className="text-white hover:text-purple-200">Pricing</a>
              <a href="#about" className="text-white hover:text-purple-200">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-purple">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Pocket Guide to Rights
              <span className="block text-purple-200">During Police Interactions</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Get instant, jargon-free guidance and documentation tools for individuals 
              interacting with law enforcement. Know your rights, stay protected.
            </p>
            
            {/* Quick Setup Form */}
            <Card className="max-w-md mx-auto p-6 glass-effect text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Get Started</h3>
              <div className="space-y-4">
                <Select
                  label="Select Your State"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="text-gray-900"
                >
                  <option value="">Choose your state...</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </Select>
                
                <Select
                  label="Preferred Language"
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="text-gray-900"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </Select>
                
                <Button 
                  onClick={handleGetStarted}
                  disabled={!formData.state}
                  className="w-full"
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Protection Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to confidently navigate police interactions and protect your rights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
                <p className="text-gray-600 mb-6">Perfect for basic rights awareness</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Basic rights guide</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>State law summaries</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Basic incident recording</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>English language support</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </div>
            </Card>
            
            {/* Premium Plan */}
            <Card className="p-8 border-purple-200 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$4.99</div>
                <div className="text-gray-600 mb-4">per month</div>
                <p className="text-gray-600 mb-6">Complete protection and peace of mind</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Advanced state-specific deep dives</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Offline access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Unlimited incident recording storage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Spanish language support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Priority support</span>
                  </li>
                </ul>
                
                <Button className="w-full">
                  Start Premium Trial
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">Gavel Guard</div>
            <p className="text-gray-400 mb-8">
              Your Pocket Guide to Rights During Police Interactions
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing