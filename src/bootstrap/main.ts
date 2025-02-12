import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'

import { AppModule } from '../app.module'
import { ApplicationConfiguration } from '../config'
import { generateSwagger } from './swagger'

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<ApplicationConfiguration>)
  generateSwagger(app)
  app.enableShutdownHooks()
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(configService.get('PORT')!)
  console.log(`Server is running: ${app.getHttpServer().address().port}`)
}
