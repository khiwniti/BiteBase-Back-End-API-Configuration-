import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import backendConfig from '../config/backendConfig'
import { ApiGroup } from '../types/api'
import { DatabaseInfo } from '../types/database'
import { EnvGroup } from '../types/environment'

interface ConfigContextType {
  projectName: string
  apiBaseUrl: string
  auth: {
    loginEndpoint: string
    adminCredentials: {
      username: string
      password: string
    }
  }
  apis: ApiGroup[]
  databases: DatabaseInfo[]
  environment: EnvGroup[]
  updateApis: (apis: ApiGroup[]) => void
  updateDatabases: (databases: DatabaseInfo[]) => void
}

const ConfigContext = createContext<ConfigContextType>({
  ...backendConfig,
  updateApis: () => {},
  updateDatabases: () => {}
})

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [apis, setApis] = useState<ApiGroup[]>(backendConfig.apis)
  const [databases, setDatabases] = useState<DatabaseInfo[]>(backendConfig.databases)

  useEffect(() => {
    // Load discovered APIs and databases from localStorage
    const discoveredApis = localStorage.getItem('discoveredApis')
    const discoveredDatabases = localStorage.getItem('discoveredDatabases')

    if (discoveredApis) {
      try {
        const parsedApis = JSON.parse(discoveredApis)
        setApis(prevApis => [...prevApis, ...parsedApis])
      } catch (error) {
        console.error('Failed to parse discovered APIs:', error)
      }
    }

    if (discoveredDatabases) {
      try {
        const parsedDatabases = JSON.parse(discoveredDatabases)
        setDatabases(prevDatabases => [...prevDatabases, ...parsedDatabases])
      } catch (error) {
        console.error('Failed to parse discovered databases:', error)
      }
    }
  }, [])

  const updateApis = (newApis: ApiGroup[]) => {
    setApis(newApis)
  }

  const updateDatabases = (newDatabases: DatabaseInfo[]) => {
    setDatabases(newDatabases)
  }

  return (
    <ConfigContext.Provider value={{
      ...backendConfig,
      apis,
      databases,
      updateApis,
      updateDatabases
    }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
