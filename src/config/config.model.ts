interface DatabaseConfiguration {
  HOST: string
  USERNAME: string
  PASSWORD: string
  NAME: string
  PORT: number
}

export interface ApplicationConfiguration {
  PORT: number
  JWT_SECRET: string
  DB: DatabaseConfiguration
}
