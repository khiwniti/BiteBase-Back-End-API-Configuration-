import { useAuth } from '../context/AuthContext'
import { LogOut, Database, Globe, Key, Home } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import AutoDiscovery from './AutoDiscovery'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Backend Monitor</h1>
              <div className="hidden md:flex space-x-4">
                <Link to="/apis" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  APIs
                </Link>
                <Link to="/database" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Database
                </Link>
                <Link to="/environment" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Environment
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Add AutoDiscovery component at the top */}
        <AutoDiscovery />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">API Status</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">Healthy</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Database Status</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">Connected</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <Key className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Environment</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">Configured</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/apis"
                className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
              >
                <h4 className="text-base font-semibold text-gray-900">API Management</h4>
                <p className="mt-1 text-sm text-gray-500">Manage and monitor API endpoints</p>
              </Link>
              <Link
                to="/database"
                className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
              >
                <h4 className="text-base font-semibold text-gray-900">Database Console</h4>
                <p className="mt-1 text-sm text-gray-500">Monitor database connections and schema</p>
              </Link>
              <Link
                to="/environment"
                className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition"
              >
                <h4 className="text-base font-semibold text-gray-900">Environment Settings</h4>
                <p className="mt-1 text-sm text-gray-500">Manage environment variables</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
