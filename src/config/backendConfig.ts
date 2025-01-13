import { DatabaseInfo } from '../types/database'
import { ApiGroup } from '../types/api'
import { EnvGroup } from '../types/environment'

// This is the main configuration file that users will modify for their backend
const backendConfig = {
  // Basic backend information
  projectName: 'BiteBase',
  apiBaseUrl: 'http://localhost:3000',
  
  // Authentication settings
  auth: {
    loginEndpoint: '/api/auth/login',
    adminCredentials: {
      username: 'bitebase_admin',
      password: 'bitebase01'
    }
  },

  // Database Configuration
  databases: [
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
    }
  ] as DatabaseInfo[],

  // Environment Configuration
  environment: [
    {
      name: 'Authentication Service',
      description: 'Environment variables for the authentication service',
      variables: [
        { key: 'AUTH_SECRET', value: '****', isSecret: true },
        { key: 'AUTH_EXPIRY', value: '24h', isSecret: false },
        { key: 'AUTH_ALGORITHM', value: 'HS256', isSecret: false }
      ]
    }
  ] as EnvGroup[]
}

export const fetchApiList = async () => {
  const response = await fetch(`${backendConfig.apiBaseUrl}/api/list`);
  if (!response.ok) {
    throw new Error('Failed to fetch API list');
  }
  return response.json();
}

export default backendConfig;
