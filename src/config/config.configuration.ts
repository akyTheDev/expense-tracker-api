import { ApplicationConfiguration } from './config.model'

export const configuration = (): ApplicationConfiguration => ({
  PORT: +process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  DB: {
    HOST: process.env.DB_HOST,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
    PORT: +process.env.DB_PORT,
  },
  KAFKA: {
    CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    BROKER: process.env.KAFKA_BROKER,
    USERNAME: process.env.KAFKA_USERNAME,
    PASSWORD: process.env.KAFKA_PASSWORD,
  },
})
