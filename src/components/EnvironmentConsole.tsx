import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Settings, ArrowRight, Eye, EyeOff, Save, X } from 'lucide-react'
import Modal from './Modal'
import { EnvGroup, EnvVariable } from '../types/environment'

interface EditableEnvGroup extends EnvGroup {
  id: string
}

export default function EnvironmentConsole() {
  const navigate = useNavigate()
  const [envGroups, setEnvGroups] = useState<EditableEnvGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<EditableEnvGroup | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVar, setEditingVar] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Load environment variables from localStorage or initialize with defaults
    const savedEnv = localStorage.getItem('environmentVariables')
    if (savedEnv) {
      setEnvGroups(JSON.parse(savedEnv))
    } else {
      const defaultGroups = [
        {
          id: '1',
          name: 'Authentication Service',
          description: 'Environment variables for the authentication service',
          variables: [
            { key: 'AUTH_SECRET', value: '****', isSecret: true },
            { key: 'AUTH_EXPIRY', value: '24h', isSecret: false },
            { key: 'AUTH_ALGORITHM', value: 'HS256', isSecret: false }
          ]
        },
        {
          id: '2',
          name: 'Database Configuration',
          description: 'Database connection and configuration variables',
          variables: [
            { key: 'DB_HOST', value: 'localhost', isSecret: false },
            { key: 'DB_PORT', value: '5432', isSecret: false },
            { key: 'DB_PASSWORD', value: '****', isSecret: true }
          ]
        }
      ]
      setEnvGroups(defaultGroups)
      localStorage.setItem('environmentVariables', JSON.stringify(defaultGroups))
    }
  }, [])

  const handleGroupClick = (group: EditableEnvGroup) => {
    setSelectedGroup(group)
    setIsModalOpen(true)
  }

  const handleVariableEdit = (groupId: string, varKey: string, newValue: string) => {
    const updatedGroups = envGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          variables: group.variables.map(v => 
            v.key === varKey ? { ...v, value: newValue } : v
          )
        }
      }
      return group
    })
    setEnvGroups(updatedGroups)
    localStorage.setItem('environmentVariables', JSON.stringify(updatedGroups))
  }

  const toggleSecret = (varKey: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [varKey]: !prev[varKey]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Environment Console</h1>
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Environment Groups</h3>
            <div className="space-y-4">
              {envGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleGroupClick(group)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{group.name}</h4>
                      <p className="text-sm text-gray-500">{group.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedGroup && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedGroup.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{selectedGroup.description}</p>
              <div className="space-y-4">
                {selectedGroup.variables.map((variable) => (
                  <div
                    key={variable.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{variable.key}</h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
                            ${variable.isSecret ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                        >
                          {variable.isSecret ? 'Secret' : 'Public'}
                        </span>
                      </div>
                      {editingVar === variable.key ? (
                        <div className="mt-2 flex items-center space-x-2">
                          <input
                            type="text"
                            value={variable.value}
                            onChange={(e) => handleVariableEdit(selectedGroup.id, variable.key, e.target.value)}
                            className="flex-1 px-3 py-1 border rounded-md text-sm"
                            placeholder="Enter value..."
                          />
                          <button
                            onClick={() => setEditingVar(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingVar(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            {variable.isSecret && !showSecrets[variable.key] ? '••••••••' : variable.value}
                          </p>
                          <div className="flex items-center space-x-2">
                            {variable.isSecret && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSecret(variable.key)
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                {showSecrets[variable.key] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => setEditingVar(variable.key)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  )
}
