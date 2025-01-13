export interface EnvGroup {
  name: string
  description: string
  variables: EnvVariable[]
}

export interface EnvVariable {
  key: string
  value: string
  isSecret: boolean
}
