import { validateEnvironmentVariables } from './config.validation'

describe('validateEnvironmentVariables', () => {
  it('throws an error if validation fails', () => {
    const envVariables = {
      DB_HOST: 'localhost',
      DB_PORT: '1234',
    }

    expect(() => {
      validateEnvironmentVariables(envVariables)
    }).toThrow(Error)
  })

  it('should return validated env variables if validation success', () => {
    const envVariables = {
      PORT: '8000',
      JWT_SECRET: 'supersecretjwt',
      DB_HOST: 'localhost',
      DB_USERNAME: 'username',
      DB_PASSWORD: 'password',
      DB_NAME: 'postgres',
      DB_PORT: '5432',
      KAFKA_CLIENT_ID: 'kafka-client',
      KAFKA_BROKER: 'localhost:59092',
      KAFKA_USERNAME: 'admin',
      KAFKA_PASSWORD: 'password',
    }

    const result = validateEnvironmentVariables(envVariables)
    expect(result).toEqual({ ...envVariables, PORT: 8000, DB_PORT: 5432 })
  })
})
