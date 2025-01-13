import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowRight, Play, Code } from 'lucide-react'
import { useConfig } from '../context/ConfigContext'
import Modal from './Modal'
import Status from './Status'
import { ApiEndpoint } from '../types/api'

export default function ApiConsole() {
  const navigate = useNavigate()
  const config = useConfig()
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [testPayload, setTestPayload] = useState<string>('')
  const [testResponse, setTestResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [endpointStatuses, setEndpointStatuses] = useState<Record<string, 'healthy' | 'warning' | 'error' | 'unknown'>>({})

  useEffect(() => {
    // Simulate checking endpoint statuses
    const checkEndpoints = async () => {
      const statuses: Record<string, 'healthy' | 'warning' | 'error' | 'unknown'> = {}
      
      for (const group of config.apis) {
        for (const endpoint of group.endpoints) {
          try {
            const response = await fetch(`${config.apiBaseUrl}${endpoint.path}`, {
              method: 'HEAD',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            
            if (response.ok) {
              statuses[endpoint.path] = 'healthy'
            } else if (response.status >= 400 && response.status < 500) {
              statuses[endpoint.path] = 'warning'
            } else {
              statuses[endpoint.path] = 'error'
            }
          } catch {
            statuses[endpoint.path] = 'error'
          }
        }
      }
      
      setEndpointStatuses(statuses)
    }

    checkEndpoints()
    const interval = setInterval(checkEndpoints, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [config.apiBaseUrl, config.apis])

  const handleEndpointClick = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint)
    setTestPayload(JSON.stringify(
      Object.fromEntries(
        Object.entries(endpoint.requestSchema.properties).map(([key, value]) => [key, value.example])
      ),
      null,
      2
    ))
    setTestResponse('')
    setIsModalOpen(true)
  }

  const handleTest = async () => {
    if (!selectedEndpoint) return

    setIsLoading(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}${selectedEndpoint.path}`, {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: testPayload,
      })
      const data = await response.json()
      setTestResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setTestResponse(JSON.stringify({ error: 'Failed to execute request' }, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">API Console</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
              >
                <Home className="h-4 w-4 mr-2" />
                Main Console
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          {config.apis.map((group) => (
            <div key={group.name} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                <div className="mt-4 space-y-4">
                  {group.endpoints.map((endpoint) => (
                    <div
                      key={endpoint.path}
                      onClick={() => handleEndpointClick(endpoint)}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium
                            ${endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'}`}
                          >
                            {endpoint.method}
                          </span>
                          <span className="text-sm text-gray-900">{endpoint.path}</span>
                        </div>
                        <div className="mt-2">
                          <Status status={endpointStatuses[endpoint.path] || 'unknown'} size="small" />
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedEndpoint && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </h3>
                <Status status={endpointStatuses[selectedEndpoint.path] || 'unknown'} size="medium" />
              </div>
              <p className="text-sm text-gray-500 mb-4">{selectedEndpoint.description}</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Request Schema</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {Object.entries(selectedEndpoint.requestSchema.properties).map(([key, schema]) => (
                        <div key={key} className="flex items-start">
                          <span className="text-sm font-medium text-gray-700 min-w-[120px]">{key}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">{schema.description}</p>
                            <p className="text-xs text-gray-500">Type: {schema.type}</p>
                            {selectedEndpoint.requestSchema.required?.includes(key) && (
                              <span className="text-xs text-red-500">Required</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Test Request</h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={testPayload}
                        onChange={(e) => setTestPayload(e.target.value)}
                        className="w-full h-48 font-mono text-sm p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter request payload..."
                      />
                      <button
                        onClick={() => handleTest()}
                        disabled={isLoading}
                        className="absolute top-2 right-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                      >
                        {isLoading ? (
                          <span>Testing...</span>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Try it out
                          </>
                        )}
                      </button>
                    </div>

                    {testResponse && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Response</h4>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm text-gray-800">{testResponse}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  )
}
