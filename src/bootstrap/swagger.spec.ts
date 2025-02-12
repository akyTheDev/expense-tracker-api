import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Test, TestingModule } from '@nestjs/testing'

import { generateSwagger } from './swagger'
import { description, name, version } from '../../package.json'

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    setContact: jest.fn().mockReturnThis(),
    build: jest.fn(),
  })),
  SwaggerModule: {
    createDocument: jest.fn(),
    setup: jest.fn(),
  },
}))

describe('generateSwagger', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({}).compile()
    app = module.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should initialize Swagger correctly', () => {
    const swaggerBuilder = new DocumentBuilder()
      .setTitle(name)
      .setVersion(version)
      .setContact('akyTheDev', '', 'aky.dev@proton.me')
      .build()

    const setupOptions = {
      explorer: false,
      customSiteTitle: description,
      swaggerOptions: {
        persistAuthorization: true,
        defaultModelsExpandDepth: -1,
        operationsSorter: 'alpha',
      },
    }

    generateSwagger(app)

    const document = SwaggerModule.createDocument(app, swaggerBuilder)

    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(
      app,
      swaggerBuilder,
    )
    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'docs',
      app,
      document,
      setupOptions,
    )
  })
})
