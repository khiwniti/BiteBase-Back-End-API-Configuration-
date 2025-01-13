import { useState } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { scanBackend } from '../services/BackendScanner'
import { useConfig } from '../context/ConfigContext'

export default function AutoDiscovery() {
  const config = useConfig()
  const [isScanning, setIsScanning] = useState(false)
  const [lastScanTime, setLastScanTime] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async () => {
    setIsScanning(true)
    setError(null)

    try {
      const result = await scanBackend(config.apiBaseUrl)
      
      // Update last scan time
      const now = new Date().toLocaleTimeString()
      setLastScanTime(now)

      // Store the results in localStorage
      localStorage.setItem('discoveredApis', JSON.stringify(result.apis))
      localStorage.setItem('discoveredDatabases', JSON.stringify(result.databases))
      
    } catch (err) {
      setError('Failed to scan backend. Please check if the backend server is running.')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Auto Discovery</h3>
          <p className="text-sm text-gray-500">
            Scan your backend to automatically detect APIs and databases
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastScanTime && (
            <span className="text-sm text-gray-500">
              Last scan: {lastScanTime}
            </span>
          )}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${isScanning ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Backend'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}
