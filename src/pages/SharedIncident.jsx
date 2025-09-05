import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { MapPin, Clock, FileText, Video, Download, Share2, AlertTriangle } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { formatDateTime, formatLocation, formatDuration } from '../utils/helpers'

const SharedIncident = () => {
  const [searchParams] = useSearchParams()
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const metadataHash = searchParams.get('metadata')
  const recordingHash = searchParams.get('recording')

  useEffect(() => {
    const loadIncidentData = async () => {
      if (!metadataHash) {
        setError('No incident data provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch incident metadata from IPFS
        const metadataResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${metadataHash}`)
        if (!metadataResponse.ok) {
          throw new Error('Failed to load incident data')
        }

        const incidentData = await metadataResponse.json()
        setIncident({
          ...incidentData,
          recordingHash
        })
      } catch (err) {
        console.error('Error loading incident:', err)
        setError('Failed to load incident data')
      } finally {
        setLoading(false)
      }
    }

    loadIncidentData()
  }, [metadataHash, recordingHash])

  const handleDownloadRecording = () => {
    if (recordingHash) {
      const url = `https://gateway.pinata.cloud/ipfs/${recordingHash}`
      window.open(url, '_blank')
    }
  }

  const handleShareIncident = async () => {
    const shareUrl = window.location.href
    const shareText = `Incident Report - ${formatDateTime(incident.timestamp)}\nLocation: ${formatLocation(incident.location)}\n\nShared via Gavel Guard`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Incident Report',
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        console.log('Share canceled')
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy to clipboard')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading incident data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Incident</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">No Incident Data</h1>
            <p className="text-gray-600 mb-6">The requested incident could not be found.</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shared Incident Report</h1>
              <p className="text-gray-600 mt-1">Securely shared via Gavel Guard</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleShareIncident}
                className="flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              {recordingHash && (
                <Button
                  onClick={handleDownloadRecording}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Recording</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Details */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Incident Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date & Time</p>
                      <p className="text-sm text-gray-600">{formatDateTime(incident.timestamp)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{formatLocation(incident.location)}</p>
                    </div>
                  </div>

                  {incident.duration && (
                    <div className="flex items-start space-x-3">
                      <Video className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-600">{formatDuration(incident.duration)}</p>
                      </div>
                    </div>
                  )}

                  {incident.notes && (
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Notes</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{incident.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Recording Section */}
            {recordingHash && (
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recording</h2>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-4">
                      Recording is stored securely on IPFS
                    </p>
                    <Button
                      onClick={handleDownloadRecording}
                      className="flex items-center space-x-2 mx-auto"
                    >
                      <Download className="h-4 w-4" />
                      <span>View Recording</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Notice */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Notice</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>This incident report is stored securely using decentralized technology (IPFS).</p>
                  <p>The data is immutable and cannot be altered or deleted.</p>
                  <p>Only those with the direct link can access this information.</p>
                </div>
              </div>
            </Card>

            {/* About Gavel Guard */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Gavel Guard</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Gavel Guard is your pocket guide to rights during police interactions, 
                  providing instant guidance and secure documentation tools.
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Legal Disclaimer */}
            <Alert variant="info">
              <div className="text-sm">
                <p className="font-medium mb-1">Legal Disclaimer</p>
                <p>This incident report is provided for informational purposes only. 
                Consult with legal professionals for advice specific to your situation.</p>
              </div>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedIncident
