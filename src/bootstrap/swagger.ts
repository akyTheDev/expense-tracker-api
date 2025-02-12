import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { description, name, version } from '../../package.json'

export const generateSwagger = (app: INestApplication): void => {
  const swaggerBuilder = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .setContact(
      'akyTheDev',
      'https://github.com/akyTheDev',
      'aky.dev@proton.me',
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerBuilder)

  SwaggerModule.setup('docs', app, document, {
    explorer: false,
    customSiteTitle: description,
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      operationsSorter: 'alpha',
    },
  })
}
