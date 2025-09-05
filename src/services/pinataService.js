class PinataService {
  constructor() {
    this.apiKey = null
    this.secretKey = null
    this.initialized = false
    this.baseUrl = 'https://api.pinata.cloud'
  }

  initialize(apiKey, secretKey) {
    if (!apiKey || !secretKey) {
      console.warn('Pinata API credentials not provided')
      return false
    }

    this.apiKey = apiKey
    this.secretKey = secretKey
    this.initialized = true
    return true
  }

  async uploadFile(file, metadata = {}) {
    if (!this.initialized) {
      throw new Error('Pinata service not initialized')
    }

    const formData = new FormData()
    formData.append('file', file)

    // Add metadata
    const pinataMetadata = {
      name: metadata.name || file.name,
      keyvalues: {
        type: 'incident-recording',
        timestamp: new Date().toISOString(),
        ...metadata.keyvalues
      }
    }

    formData.append('pinataMetadata', JSON.stringify(pinataMetadata))

    // Add options
    const pinataOptions = {
      cidVersion: 1,
      ...metadata.options
    }

    formData.append('pinataOptions', JSON.stringify(pinataOptions))

    try {
      const response = await fetch(`${this.baseUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Pinata upload failed: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      return {
        hash: result.IpfsHash,
        size: result.PinSize,
        timestamp: result.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      }
    } catch (error) {
      console.error('Error uploading to Pinata:', error)
      throw new Error('Failed to upload file to secure storage')
    }
  }

  async uploadJSON(jsonData, metadata = {}) {
    if (!this.initialized) {
      throw new Error('Pinata service not initialized')
    }

    const pinataMetadata = {
      name: metadata.name || 'incident-data',
      keyvalues: {
        type: 'incident-json',
        timestamp: new Date().toISOString(),
        ...metadata.keyvalues
      }
    }

    const pinataOptions = {
      cidVersion: 1,
      ...metadata.options
    }

    const data = {
      pinataContent: jsonData,
      pinataMetadata,
      pinataOptions
    }

    try {
      const response = await fetch(`${this.baseUrl}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Pinata JSON upload failed: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      return {
        hash: result.IpfsHash,
        size: result.PinSize,
        timestamp: result.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      }
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error)
      throw new Error('Failed to upload data to secure storage')
    }
  }

  async getFileInfo(hash) {
    if (!this.initialized) {
      throw new Error('Pinata service not initialized')
    }

    try {
      const response = await fetch(`${this.baseUrl}/data/pinList?hashContains=${hash}`, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.statusText}`)
      }

      const result = await response.json()
      return result.rows[0] || null
    } catch (error) {
      console.error('Error getting file info from Pinata:', error)
      throw new Error('Failed to retrieve file information')
    }
  }

  async unpinFile(hash) {
    if (!this.initialized) {
      throw new Error('Pinata service not initialized')
    }

    try {
      const response = await fetch(`${this.baseUrl}/pinning/unpin/${hash}`, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to unpin file: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error('Error unpinning file from Pinata:', error)
      throw new Error('Failed to remove file from secure storage')
    }
  }

  // Helper method to create shareable incident package
  async createIncidentPackage(incidentData, recordingBlob) {
    if (!this.initialized) {
      throw new Error('Pinata service not initialized')
    }

    try {
      const results = {}

      // Upload recording if provided
      if (recordingBlob) {
        const recordingFile = new File([recordingBlob], `incident-${incidentData.recordId}.webm`, {
          type: 'video/webm'
        })

        results.recording = await this.uploadFile(recordingFile, {
          name: `incident-recording-${incidentData.recordId}`,
          keyvalues: {
            recordId: incidentData.recordId,
            timestamp: incidentData.timestamp,
            location: incidentData.gpsLocation
          }
        })
      }

      // Upload incident metadata
      const metadata = {
        recordId: incidentData.recordId,
        timestamp: incidentData.timestamp,
        location: incidentData.gpsLocation,
        duration: incidentData.duration,
        notes: incidentData.userNotes,
        recordingHash: results.recording?.hash,
        createdAt: new Date().toISOString()
      }

      results.metadata = await this.uploadJSON(metadata, {
        name: `incident-metadata-${incidentData.recordId}`,
        keyvalues: {
          recordId: incidentData.recordId,
          type: 'incident-metadata'
        }
      })

      return results
    } catch (error) {
      console.error('Error creating incident package:', error)
      throw new Error('Failed to create secure incident package')
    }
  }

  // Generate shareable link for incident
  generateShareableLink(metadataHash, recordingHash = null) {
    const baseUrl = window.location.origin
    const params = new URLSearchParams({
      metadata: metadataHash
    })

    if (recordingHash) {
      params.append('recording', recordingHash)
    }

    return `${baseUrl}/shared-incident?${params.toString()}`
  }
}

export default new PinataService()
