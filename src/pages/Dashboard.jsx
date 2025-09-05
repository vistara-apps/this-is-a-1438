import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Book, Video, AlertTriangle, Clock, MapPin } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../contexts/AppContext'

const Dashboard = () => {
  const { user, incidentRecords, selectedState, isRecording } = useApp()

  const quickActions = [
    {
      title: 'Know Your Rights',
      description: 'Get instant guidance for your situation',
      icon: Shield,
      href: '/rights-guide',
      color: 'bg-green-500',
    },
    {
      title: 'State Laws',
      description: 'Quick reference for your state',
      icon: Book,
      href: '/state-laws',
      color: 'bg-blue-500',
    },
    {
      title: 'Record Incident',
      description: 'Start recording immediately',
      icon: Video,
      href: '/incident-recorder',
      color: 'bg-red-500',
    },
  ]

  const recentIncidents = incidentRecords.slice(0, 3)

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome to Gavel Guard
        </h1>
        <p className="text-gray-600">
          {selectedState ? `Your rights guide for ${selectedState}` : 'Your pocket guide to rights during police interactions'}
        </p>
      </div>

      {/* Recording Status Alert */}
      {isRecording && (
        <div className="mb-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">
                  Recording in progress
                </p>
                <p className="text-red-600 text-sm">
                  Your interaction is being recorded and saved securely.
                </p>
              </div>
              <div className="ml-auto">
                <Link to="/incident-recorder">
                  <Button variant="outline" size="sm">
                    Manage Recording
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link key={index} to={action.href}>
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emergency Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            Emergency Quick Reference
          </h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Remember:</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• You have the right to remain silent</li>
                <li>• You have the right to refuse searches</li>
                <li>• You have the right to ask if you're free to leave</li>
                <li>• You have the right to an attorney</li>
              </ul>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="flex-1">
                Emergency: 911
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Legal Aid
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Incidents */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              Recent Activity
            </h2>
            <Link to="/incident-recorder">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          {recentIncidents.length === 0 ? (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No incidents recorded yet</p>
              <Link to="/incident-recorder">
                <Button size="sm">
                  Record Your First Incident
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.recordId} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(incident.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {incident.gpsLocation || 'Location not available'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(incident.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* State-Specific Alert */}
      {selectedState && (
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <Book className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-900">
                {selectedState} Specific Information Available
              </h3>
              <p className="text-blue-700 text-sm">
                Access tailored rights information and laws specific to your state.
              </p>
            </div>
            <Link to="/state-laws" className="ml-auto">
              <Button variant="outline" size="sm">
                View Laws
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Dashboard