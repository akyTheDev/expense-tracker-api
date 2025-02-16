import { configuration } from './config.configuration'

describe('configuration', () => {
  it('should return the application configuration correctly', () => {
    const expectedResult = {
      PORT: 8000,
      JWT_SECRET: 'supersecretjwt',
      DB: {
        HOST: 'localhost',
        USERNAME: 'username',
        PASSWORD: 'password',
        NAME: 'postgres',
        PORT: 5432,
      },
      KAFKA: {
        CLIENT_ID: 'kafka-client',
        BROKER: 'localhost:59092',
        USERNAME: 'admin',
        PASSWORD: 'password',
      },
    }

    const result = configuration()

    expect(result).toEqual(expectedResult)
  })
})
