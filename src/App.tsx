import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ConfigProvider } from './context/ConfigContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import ApiConsole from './components/ApiConsole'
import DatabaseConsole from './components/DatabaseConsole'
import EnvironmentConsole from './components/EnvironmentConsole'
import ApiList from './components/ApiList'
import './index.css'

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/apis" element={
              <ProtectedRoute>
                <ApiConsole />
              </ProtectedRoute>
            } />
            <Route path="/database" element={
              <ProtectedRoute>
                <DatabaseConsole />
              </ProtectedRoute>
            } />
            <Route path="/environment" element={
              <ProtectedRoute>
                <EnvironmentConsole />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <div>
            <h1>Backend Monitor UI</h1>
            <ApiList />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
