import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'

import { AppModule } from '../app.module'
import { bootstrap } from './main'
import { generateSwagger } from './swagger'

const PORT = 1234

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}))

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn((key) => {
      const envVariables = {
        PORT,
      }
      return envVariables[key]
    }),
  })),
}))

jest.mock('class-validator', () => ({
  useContainer: jest.fn(),
}))

jest.mock('../app.module', () => ({
  AppModule: jest.fn(),
}))

jest.mock('./swagger', () => ({
  generateSwagger: jest.fn(),
}))

describe('bootstrap', () => {
  let app: INestApplication
  let configService: ConfigService

  beforeEach(() => {
    app = {
      get: jest.fn(),
      listen: jest.fn(),
      enableShutdownHooks: jest.fn(),
      select: jest.fn(),
      getHttpServer: jest.fn().mockReturnValue({
        address: jest.fn().mockReturnValue({ port: PORT }),
      }),
    } as unknown as INestApplication

    configService = new ConfigService()
    ;(NestFactory.create as jest.Mock).mockResolvedValue(app)
    ;(app.get as jest.Mock).mockReturnValue(configService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should run the app correctly', async () => {
    await bootstrap()

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule)
    expect(generateSwagger).toHaveBeenCalledWith(app)
    expect(app.enableShutdownHooks).toHaveBeenCalled()
    expect(useContainer).toHaveBeenCalledWith(app.select(AppModule), {
      fallbackOnErrors: true,
    })
    expect(app.listen).toHaveBeenCalledWith(PORT)
  })
})
