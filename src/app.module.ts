import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { configuration, validateEnvironmentVariables } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironmentVariables,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
