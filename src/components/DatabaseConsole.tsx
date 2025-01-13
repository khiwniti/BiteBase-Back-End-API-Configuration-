import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Database, ArrowRight } from 'lucide-react'
import Modal from './Modal'

interface DatabaseInfo {
  name: string
  type: string
  status: 'connected' | 'disconnected'
  host: string
  port: number
  schema: SchemaTable[]
}

interface SchemaTable {
  name: string
  columns: string[]
}

const DATABASES: DatabaseInfo[] = [
  {
    name: 'Users DB',
    type: 'PostgreSQL',
    status: 'connected',
    host: 'localhost',
    port: 5432,
    schema: [
      {
        name: 'users',
        columns: ['id', 'username', 'email', 'created_at']
      },
      {
        name: 'profiles',
        columns: ['user_id', 'full_name', 'avatar', 'bio']
      }
    ]
  },
  {
    name: 'Analytics DB',
    type: 'MongoDB',
    status: 'connected',
    host: 'localhost',
    port: 27017,
    schema: [
      {
        name: 'events',
        columns: ['_id', 'event_type', 'timestamp', 'user_id']
      }
    ]
  }
]

export default function DatabaseConsole() {
  const navigate = useNavigate()
  const [selectedDB, setSelectedDB] = useState<DatabaseInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDatabaseClick = (db: DatabaseInfo) => {
    setSelectedDB(db)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Database Console</h1>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Database Connections</h3>
            <div className="space-y-4">
              {DATABASES.map((db) => (
                <div
                  key={db.name}
                  onClick={() => handleDatabaseClick(db)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
                >
                  <div className="flex items-center">
                    <Database className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{db.name}</h4>
                      <p className="text-sm text-gray-500">{db.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium mr-3
                      ${db.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {db.status}
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedDB && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedDB.name} Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Type</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedDB.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedDB.status}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Host</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedDB.host}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Port</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedDB.port}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Schema</h4>
                  <div className="space-y-3">
                    {selectedDB.schema.map((table) => (
                      <div key={table.name} className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900">{table.name}</h5>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {table.columns.map((column) => (
                            <span
                              key={column}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {column}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
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
