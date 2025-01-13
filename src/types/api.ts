export interface ApiGroup {
  name: string
  endpoints: ApiEndpoint[]
}

export interface ApiEndpoint {
  path: string
  method: string
  version: string
  description: string
  requestSchema: RequestSchema
  responseSchema: ResponseSchema
  changelog: string[]
}

export interface RequestSchema {
  type: string
  required?: string[]
  properties: Record<string, SchemaProperty>
}

export interface ResponseSchema {
  type: string
  properties: Record<string, SchemaProperty>
}

export interface SchemaProperty {
  type: string
  description: string
  example?: any
}
