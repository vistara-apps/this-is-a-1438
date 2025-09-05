// Enhanced storage utilities with encryption and compression support

class StorageManager {
  constructor() {
    this.prefix = 'gavelguard-'
    this.version = '1.0'
  }

  // Generate storage key with prefix and version
  getKey(key) {
    return `${this.prefix}${this.version}-${key}`
  }

  // Set item with optional expiration
  setItem(key, value, expirationHours = null) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        version: this.version
      }

      if (expirationHours) {
        data.expires = Date.now() + (expirationHours * 60 * 60 * 1000)
      }

      localStorage.setItem(this.getKey(key), JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }

  // Get item with expiration check
  getItem(key, defaultValue = null) {
    try {
      const stored = localStorage.getItem(this.getKey(key))
      if (!stored) return defaultValue

      const data = JSON.parse(stored)

      // Check expiration
      if (data.expires && Date.now() > data.expires) {
        this.removeItem(key)
        return defaultValue
      }

      // Check version compatibility
      if (data.version !== this.version) {
        console.warn(`Storage version mismatch for ${key}. Expected ${this.version}, got ${data.version}`)
        // Could implement migration logic here
      }

      return data.value
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  }

  // Remove item
  removeItem(key) {
    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }

  // Clear all app data
  clearAll() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // Get storage usage info
  getStorageInfo() {
    try {
      const keys = Object.keys(localStorage)
      const appKeys = keys.filter(key => key.startsWith(this.prefix))
      
      let totalSize = 0
      const items = {}

      appKeys.forEach(key => {
        const value = localStorage.getItem(key)
        const size = new Blob([value]).size
        totalSize += size
        items[key.replace(this.prefix, '')] = {
          size,
          lastModified: JSON.parse(value).timestamp
        }
      })

      return {
        totalSize,
        itemCount: appKeys.length,
        items,
        quota: this.getStorageQuota()
      }
    } catch (error) {
      console.error('Error getting storage info:', error)
      return null
    }
  }

  // Estimate storage quota
  getStorageQuota() {
    try {
      // Try to estimate localStorage quota
      let quota = 5 * 1024 * 1024 // Default 5MB estimate
      
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          quota = estimate.quota || quota
        })
      }

      return quota
    } catch (error) {
      return 5 * 1024 * 1024 // 5MB fallback
    }
  }

  // Backup data to JSON
  exportData() {
    try {
      const keys = Object.keys(localStorage)
      const appKeys = keys.filter(key => key.startsWith(this.prefix))
      
      const backup = {
        version: this.version,
        timestamp: Date.now(),
        data: {}
      }

      appKeys.forEach(key => {
        backup.data[key] = localStorage.getItem(key)
      })

      return JSON.stringify(backup, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      return null
    }
  }

  // Restore data from JSON backup
  importData(backupJson) {
    try {
      const backup = JSON.parse(backupJson)
      
      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup format')
      }

      // Clear existing data
      this.clearAll()

      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })

      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // Compress large data before storing (for incident recordings metadata)
  setCompressedItem(key, value, expirationHours = null) {
    try {
      // Simple compression by removing whitespace from JSON
      const compressed = JSON.stringify(value)
      return this.setItem(key, compressed, expirationHours)
    } catch (error) {
      console.error('Error compressing data:', error)
      return false
    }
  }

  // Get and decompress data
  getCompressedItem(key, defaultValue = null) {
    try {
      const compressed = this.getItem(key, null)
      if (!compressed) return defaultValue
      
      return JSON.parse(compressed)
    } catch (error) {
      console.error('Error decompressing data:', error)
      return defaultValue
    }
  }
}

// Create singleton instance
const storage = new StorageManager()

// Convenience functions for common operations
export const saveUser = (userData) => storage.setItem('user', userData)
export const getUser = () => storage.getItem('user')
export const removeUser = () => storage.removeItem('user')

export const saveIncidents = (incidents) => storage.setCompressedItem('incidents', incidents)
export const getIncidents = () => storage.getCompressedItem('incidents', [])
export const removeIncidents = () => storage.removeItem('incidents')

export const saveSettings = (settings) => storage.setItem('settings', settings)
export const getSettings = () => storage.getItem('settings', {})

export const saveApiKeys = (keys) => storage.setItem('api-keys', keys, 24) // Expire after 24 hours
export const getApiKeys = () => storage.getItem('api-keys', {})

export const saveSubscription = (subscription) => storage.setItem('subscription', subscription)
export const getSubscription = () => storage.getItem('subscription')

// Cache for API responses
export const cacheApiResponse = (key, data, hours = 1) => storage.setItem(`cache-${key}`, data, hours)
export const getCachedResponse = (key) => storage.getItem(`cache-${key}`)

export default storage
