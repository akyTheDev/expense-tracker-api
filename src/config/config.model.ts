interface DatabaseConfiguration {
  HOST: string
  USERNAME: string
  PASSWORD: string
  NAME: string
  PORT: number
}

export interface KafkaConfiguration {
  CLIENT_ID: string
  BROKER: string
  USERNAME: string
  PASSWORD: string
}

export interface ApplicationConfiguration {
  PORT: number
  JWT_SECRET: string
  DB: DatabaseConfiguration
  KAFKA: KafkaConfiguration
}
