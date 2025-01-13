export interface DatabaseInfo {
  name: string
  type: string
  status: 'connected' | 'disconnected'
  host: string
  port: number
  schema: SchemaTable[]
}

export interface SchemaTable {
  name: string
  columns: string[]
}
