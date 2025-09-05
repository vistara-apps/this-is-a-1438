import React, { useState, useEffect } from 'react'
import { Book, Search, MapPin, ExternalLink, Filter } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import { useApp } from '../contexts/AppContext'

const StateLaws = () => {
  const { selectedState, setSelectedState } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'traffic', label: 'Traffic Stops' },
    { value: 'search', label: 'Search & Seizure' },
    { value: 'id', label: 'ID Requirements' },
    { value: 'recording', label: 'Recording Rights' },
    { value: 'arrest', label: 'Arrest Procedures' },
    { value: 'miranda', label: 'Miranda Rights' }
  ]

  // Mock state laws data - in real app this would come from API
  const stateLaws = {
    'California': [
      {
        id: 1,
        category: 'recording',
        title: 'Right to Record Police',
        summary: 'California law explicitly protects the right to record police officers performing their duties in public spaces.',
        details: 'Under California Penal Code Section 148(g), it is legal to record police officers in the performance of their duties. Officers cannot confiscate or demand deletion of recordings without a warrant.',
        keyPoints: [
          'You can record from a reasonable distance',
          'Officers cannot delete your recordings',
          'Recording is protected as free speech',
          'Must not interfere with police duties'
        ]
      },
      {
        id: 2,
        category: 'search',
        title: 'Vehicle Search Rights',
        summary: 'California follows federal standards for vehicle searches but has additional protections for certain situations.',
        details: 'California adheres to the federal "automobile exception" but provides additional protections under Article I, Section 13 of the California Constitution.',
        keyPoints: [
          'Consent must be voluntary',
          'Probable cause required for warrantless searches',
          'Inventory searches must follow proper procedures',
          'California Constitution may provide additional protections'
        ]
      },
      {
        id: 3,
        category: 'id',
        title: 'Identification Requirements',
        summary: 'California does not have a "stop and identify" statute requiring you to provide ID during police encounters.',
        details: 'Unlike some states, California does not require you to provide identification simply because police ask. However, you must provide ID during traffic stops if driving.',
        keyPoints: [
          'No general duty to provide ID when walking',
          'Must provide license when driving',
          'Can provide name verbally if detained',
          'Refusing ID alone cannot justify arrest'
        ]
      }
    ],
    'Texas': [
      {
        id: 1,
        category: 'id',
        title: 'Stop and Identify Law',
        summary: 'Texas has a "stop and identify" statute requiring you to provide your name if lawfully detained.',
        details: 'Under Texas Penal Code Section 38.02, you must provide your name, residence address, and date of birth if lawfully arrested or detained.',
        keyPoints: [
          'Must provide name if lawfully detained',
          'Only required if police have reasonable suspicion',
          'Don\'t have to provide physical ID card',
          'Failure to identify is a Class C misdemeanor'
        ]
      },
      {
        id: 2,
        category: 'recording',
        title: 'Recording Police Interactions',
        summary: 'Texas law generally permits recording police officers in public, but with some restrictions.',
        details: 'Texas follows federal precedent allowing recording of police in public. However, you must maintain a reasonable distance and not interfere.',
        keyPoints: [
          'Recording in public is generally protected',
          'Must maintain reasonable distance',
          'Cannot interfere with police duties',
          'Audio recording may have additional restrictions'
        ]
      }
    ],
    'New York': [
      {
        id: 1,
        category: 'search',
        title: 'Stop and Frisk Laws',
        summary: 'New York has specific regulations governing stop and frisk procedures following federal and state court decisions.',
        details: 'Following federal Terry v. Ohio and state court decisions, New York police must have reasonable suspicion of criminal activity to conduct a stop and frisk.',
        keyPoints: [
          'Reasonable suspicion required',
          'Must be based on specific facts',
          'Cannot be based solely on race or location',
          'Limited to weapons search for officer safety'
        ]
      },
      {
        id: 2,
        category: 'recording',
        title: 'Right to Record',
        summary: 'New York law protects the right to record police officers performing their duties in public.',
        details: 'Under New York Civil Rights Law Section 79-p, individuals have the right to record police activities in public spaces.',
        keyPoints: [
          'Protected by state civil rights law',
          'Cannot be arrested solely for recording',
          'Must not interfere with police activities',
          'Officers cannot demand deletion without warrant'
        ]
      }
    ]
  }

  const currentStateLaws = selectedState ? (stateLaws[selectedState] || []) : []
  
  const filteredLaws = currentStateLaws.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         law.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Book className="w-8 h-8 text-blue-500 mr-3" />
          State Laws Quick Reference
        </h1>
        <p className="text-gray-600">
          Get clear, digestible summaries of laws relevant to police interactions in your state.
        </p>
      </div>

      {/* State Selection & Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Select State"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">Choose your state...</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Select>

          <Input
            label="Search Laws"
            placeholder="Search by topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {!selectedState ? (
        /* No State Selected */
        <Card className="p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Select Your State
          </h2>
          <p className="text-gray-600 mb-6">
            Choose your state to view specific laws and regulations relevant to police interactions.
          </p>
          <p className="text-sm text-gray-500">
            Each state has different laws regarding identification requirements, recording rights, 
            search and seizure procedures, and more.
          </p>
        </Card>
      ) : filteredLaws.length === 0 ? (
        /* No Laws Found */
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Laws Found
          </h2>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : `We're still building our database for ${selectedState}. Check back soon!`
            }
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        /* Laws List */
        <div className="space-y-6">
          {filteredLaws.map((law) => (
            <Card key={law.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mr-3 ${
                      law.category === 'recording' ? 'bg-green-100 text-green-800' :
                      law.category === 'search' ? 'bg-blue-100 text-blue-800' :
                      law.category === 'id' ? 'bg-purple-100 text-purple-800' :
                      law.category === 'traffic' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {categories.find(c => c.value === law.category)?.label || law.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {law.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {law.summary}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
                <ul className="space-y-2">
                  {law.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <details className="group">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    <span>View Full Details</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </summary>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {law.details}
                    </p>
                  </div>
                </details>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="p-6 mt-8 bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <div className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5">
            ⚠️
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">
              Important Legal Disclaimer
            </h3>
            <p className="text-yellow-700 text-sm">
              This information is provided for educational purposes only and should not be considered 
              legal advice. Laws can change frequently and may be interpreted differently in various 
              jurisdictions. For specific legal questions, consult with a qualified attorney in your area.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StateLaws