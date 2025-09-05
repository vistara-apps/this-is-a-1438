import React, { useState } from 'react'
import { User, CreditCard, Globe, Bell, Shield, Trash2, Download } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import { useApp } from '../contexts/AppContext'

const Profile = () => {
  const { 
    user, 
    updateUser, 
    selectedState, 
    setSelectedState, 
    language, 
    setLanguage,
    incidentRecords,
    setIncidentRecords 
  } = useApp()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [contacts, setContacts] = useState(user?.savedContacts || [])
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' })

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'contacts', label: 'Emergency Contacts', icon: Bell },
    { id: 'data', label: 'Data & Privacy', icon: Shield },
  ]

  const addContact = () => {
    if (newContact.name && (newContact.phone || newContact.email)) {
      const updatedContacts = [...contacts, { ...newContact, id: Date.now() }]
      setContacts(updatedContacts)
      updateUser({ savedContacts: updatedContacts })
      setNewContact({ name: '', phone: '', email: '' })
    }
  }

  const removeContact = (contactId) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId)
    setContacts(updatedContacts)
    updateUser({ savedContacts: updatedContacts })
  }

  const upgradeSubscription = () => {
    // In a real app, this would integrate with Stripe
    updateUser({ subscriptionStatus: 'premium' })
    alert('Subscription upgraded to Premium! (Demo only)')
  }

  const cancelSubscription = () => {
    updateUser({ subscriptionStatus: 'free' })
    alert('Subscription downgraded to Free.')
  }

  const exportData = () => {
    const data = {
      user,
      incidentRecords,
      selectedState,
      language,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gavel-guard-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteAllData = () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      localStorage.clear()
      setIncidentRecords([])
      alert('All data has been deleted.')
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Profile & Settings
        </h1>
        <p className="text-gray-600">
          Manage your account, subscription, and privacy settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-left ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Profile Settings
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Primary State"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value="">Choose your state...</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Select>

                  <Select
                    label="Preferred Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </Select>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Account Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">User ID:</span>
                        <span className="ml-2 font-mono">{user?.userId || 'Not set'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Subscription:</span>
                        <span className={`ml-2 font-medium ${
                          user?.subscriptionStatus === 'premium' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">State:</span>
                        <span className="ml-2">{selectedState || 'Not selected'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Language:</span>
                        <span className="ml-2">{language === 'es' ? 'Español' : 'English'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'subscription' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Subscription Management
              </h2>
              
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Current Plan: {user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free'}
                      </h3>
                      <p className="text-gray-600">
                        {user?.subscriptionStatus === 'premium' 
                          ? 'Full access to all features including offline mode and unlimited storage.'
                          : 'Basic access with limited features.'
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {user?.subscriptionStatus === 'premium' ? '$4.99' : '$0'}
                      </div>
                      <div className="text-gray-600 text-sm">per month</div>
                    </div>
                  </div>
                  
                  {user?.subscriptionStatus === 'premium' ? (
                    <Button variant="outline" onClick={cancelSubscription}>
                      Cancel Subscription
                    </Button>
                  ) : (
                    <Button onClick={upgradeSubscription}>
                      Upgrade to Premium
                    </Button>
                  )}
                </div>

                {/* Feature Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Free Plan</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Basic rights guide</li>
                      <li>✓ State law summaries</li>
                      <li>✓ Basic incident recording</li>
                      <li>✓ English language support</li>
                      <li>✗ Offline access</li>
                      <li>✗ Unlimited storage</li>
                      <li>✗ Spanish language</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-6 border-purple-200 bg-purple-50">
                    <h3 className="font-semibold text-purple-900 mb-4">Premium Plan</h3>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li>✓ Everything in Free</li>
                      <li>✓ Advanced state-specific guides</li>
                      <li>✓ Offline access</li>
                      <li>✓ Unlimited incident storage</li>
                      <li>✓ Spanish language support</li>
                      <li>✓ Priority support</li>
                      <li>✓ Advanced sharing features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'contacts' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Emergency Contacts
              </h2>
              
              <div className="space-y-6">
                {/* Add New Contact */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Add Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Name"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Phone number"
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <Input
                      placeholder="Email (optional)"
                      value={newContact.email}
                      onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addContact} className="mt-4" size="sm">
                    Add Contact
                  </Button>
                </div>

                {/* Contact List */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Saved Contacts</h3>
                  {contacts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No emergency contacts added yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{contact.name}</div>
                            <div className="text-sm text-gray-600">
                              {contact.phone && <span>{contact.phone}</span>}
                              {contact.phone && contact.email && <span> • </span>}
                              {contact.email && <span>{contact.email}</span>}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeContact(contact.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'data' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Data & Privacy
              </h2>
              
              <div className="space-y-6">
                {/* Data Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Your Data Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Incident Records</div>
                      <div className="font-semibold">{incidentRecords.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Emergency Contacts</div>
                      <div className="font-semibold">{contacts.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Selected State</div>
                      <div className="font-semibold">{selectedState || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Language</div>
                      <div className="font-semibold">{language === 'es' ? 'Spanish' : 'English'}</div>
                    </div>
                  </div>
                </div>

                {/* Data Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Export Your Data</h3>
                      <p className="text-sm text-gray-600">Download all your data in JSON format</p>
                    </div>
                    <Button variant="outline" onClick={exportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                    <div>
                      <h3 className="font-medium text-red-900">Delete All Data</h3>
                      <p className="text-sm text-red-600">Permanently delete all your data and recordings</p>
                    </div>
                    <Button variant="destructive" onClick={deleteAllData}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Privacy Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Privacy & Security</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• All data is stored locally on your device</li>
                    <li>• Incident recordings are not uploaded to external servers</li>
                    <li>• Your location data is only used for incident logging</li>
                    <li>• No personal information is shared with third parties</li>
                    <li>• You can delete all data at any time</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile