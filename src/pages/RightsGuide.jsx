import React, { useState } from 'react'
import { Shield, Car, Home, Phone, Users, Search, AlertTriangle } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../contexts/AppContext'

const RightsGuide = () => {
  const { language } = useApp()
  const [selectedScenario, setSelectedScenario] = useState(null)

  const scenarios = [
    {
      id: 'traffic-stop',
      title: 'Traffic Stop',
      icon: Car,
      description: 'Pulled over while driving',
      color: 'bg-blue-500'
    },
    {
      id: 'home-visit',
      title: 'Home Visit',
      icon: Home,
      description: 'Police at your door',
      color: 'bg-green-500'
    },
    {
      id: 'street-encounter',
      title: 'Street Encounter',
      icon: Users,
      description: 'Approached on the street',
      color: 'bg-purple-500'
    },
    {
      id: 'search-request',
      title: 'Search Request',
      icon: Search,
      description: 'Asked to search belongings',
      color: 'bg-yellow-500'
    },
    {
      id: 'questioning',
      title: 'Questioning',
      icon: Phone,
      description: 'Asked questions or interrogated',
      color: 'bg-red-500'
    }
  ]

  const scenarioGuides = {
    'traffic-stop': {
      title: 'Traffic Stop Rights & Scripts',
      rights: [
        'You must provide license, registration, and insurance when requested',
        'You have the right to remain silent beyond required documents',
        'You can refuse consent to search your vehicle',
        'You have the right to ask if you\'re free to leave'
      ],
      scripts: {
        en: [
          '"I am exercising my right to remain silent."',
          '"I do not consent to any searches."',
          '"Am I free to leave?"',
          '"I would like to speak with an attorney."'
        ],
        es: [
          '"Estoy ejerciendo mi derecho a permanecer en silencio."',
          '"No consiento a ningún registro."',
          '"¿Soy libre de irme?"',
          '"Me gustaría hablar con un abogado."'
        ]
      },
      tips: [
        'Keep your hands visible',
        'Stay calm and respectful',
        'Don\'t reach for documents until asked',
        'Remember you can record the interaction'
      ]
    },
    'home-visit': {
      title: 'Police at Your Door',
      rights: [
        'You do not have to open the door unless they have a warrant',
        'You can speak through the door',
        'You have the right to see a warrant before entry',
        'You can refuse entry without a warrant'
      ],
      scripts: {
        en: [
          '"I do not consent to your entry."',
          '"Do you have a warrant?"',
          '"I am exercising my right to remain silent."',
          '"I would like to see your warrant through the window."'
        ],
        es: [
          '"No consiento a su entrada."',
          '"¿Tienen una orden judicial?"',
          '"Estoy ejerciendo mi derecho a permanecer en silencio."',
          '"Me gustaría ver su orden judicial por la ventana."'
        ]
      },
      tips: [
        'Don\'t open the door unless required',
        'You can talk through the door',
        'Ask to see a warrant',
        'Record the interaction if possible'
      ]
    },
    'street-encounter': {
      title: 'Street Encounter Rights',
      rights: [
        'You have the right to ask if you\'re being detained',
        'If not detained, you can leave',
        'You have the right to remain silent',
        'You don\'t have to show ID unless required by state law'
      ],
      scripts: {
        en: [
          '"Am I being detained or am I free to go?"',
          '"I am exercising my right to remain silent."',
          '"I do not consent to any searches."',
          '"I would like to speak with an attorney."'
        ],
        es: [
          '"¿Estoy detenido o soy libre de irme?"',
          '"Estoy ejerciendo mi derecho a permanecer en silencio."',
          '"No consiento a ningún registro."',
          '"Me gustaría hablar con un abogado."'
        ]
      },
      tips: [
        'Stay calm and don\'t run',
        'Keep your hands visible',
        'Ask if you\'re free to leave',
        'Don\'t resist even if you believe it\'s wrong'
      ]
    },
    'search-request': {
      title: 'Search Request Rights',
      rights: [
        'You have the right to refuse consent to searches',
        'Police need a warrant, probable cause, or consent',
        'You can clearly state you do not consent',
        'Refusing consent is not obstruction'
      ],
      scripts: {
        en: [
          '"I do not consent to any searches."',
          '"Do you have a warrant to search?"',
          '"I am exercising my right to refuse this search."',
          '"I would like this refusal noted."'
        ],
        es: [
          '"No consiento a ningún registro."',
          '"¿Tienen una orden judicial para registrar?"',
          '"Estoy ejerciendo mi derecho a rechazar este registro."',
          '"Me gustaría que se tome nota de este rechazo."'
        ]
      },
      tips: [
        'Clearly state you do not consent',
        'Don\'t physically resist',
        'Remember what you say',
        'Ask for their reasoning'
      ]
    },
    'questioning': {
      title: 'Police Questioning Rights',
      rights: [
        'You have the right to remain silent',
        'You have the right to an attorney',
        'You can invoke these rights at any time',
        'Anything you say can be used against you'
      ],
      scripts: {
        en: [
          '"I am invoking my right to remain silent."',
          '"I want to speak with an attorney."',
          '"I will not answer questions without my lawyer present."',
          '"Am I under arrest or am I free to leave?"'
        ],
        es: [
          '"Estoy invocando mi derecho a permanecer en silencio."',
          '"Quiero hablar con un abogado."',
          '"No responderé preguntas sin mi abogado presente."',
          '"¿Estoy arrestado o soy libre de irme?"'
        ]
      },
      tips: [
        'Invoke your rights clearly',
        'Don\'t try to explain or justify',
        'Ask for an attorney immediately',
        'Stay silent until lawyer arrives'
      ]
    }
  }

  const currentGuide = selectedScenario ? scenarioGuides[selectedScenario] : null
  const currentScripts = currentGuide?.scripts[language] || currentGuide?.scripts.en || []

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Shield className="w-8 h-8 text-green-500 mr-3" />
          Know Your Rights Guide
        </h1>
        <p className="text-gray-600">
          Select a scenario to get specific rights information and what to say scripts.
        </p>
      </div>

      {!selectedScenario ? (
        <>
          {/* Scenario Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon
              return (
                <Card 
                  key={scenario.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${scenario.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {scenario.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {scenario.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* General Rights Overview */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
              Universal Rights - Always Remember
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Your Core Rights:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Right to remain silent</li>
                  <li>• Right to an attorney</li>
                  <li>• Right to refuse searches (with exceptions)</li>
                  <li>• Right to ask if you're free to leave</li>
                  <li>• Right to record police interactions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Key Phrases:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• "I am exercising my right to remain silent"</li>
                  <li>• "I do not consent to any searches"</li>
                  <li>• "Am I free to leave?"</li>
                  <li>• "I want to speak with an attorney"</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      ) : (
        /* Detailed Scenario Guide */
        <div>
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedScenario(null)}
              className="mb-4"
            >
              ← Back to Scenarios
            </Button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentGuide.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rights & Tips */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-green-500 mr-2" />
                  Your Rights
                </h3>
                <ul className="space-y-3">
                  {currentGuide.rights.map((right, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{right}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  Important Tips
                </h3>
                <ul className="space-y-3">
                  {currentGuide.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Scripts */}
            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 text-blue-500 mr-2" />
                  What to Say Scripts
                  {language === 'es' && (
                    <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Español
                    </span>
                  )}
                </h3>
                <div className="space-y-4">
                  {currentScripts.map((script, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <p className="text-gray-800 italic">
                          {script}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(script.replace(/"/g, ''))
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Remember:</h4>
                  <p className="text-red-700 text-sm">
                    Use these scripts calmly and clearly. Stay respectful even if you feel your rights are being violated. Document everything and address violations later through proper legal channels.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RightsGuide