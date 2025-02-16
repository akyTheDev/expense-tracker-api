import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Kafka, Partitioners } from 'kafkajs'

import { KafkaConfiguration } from '../config'
import { KAFKA_PRODUCER } from './kafka.constants'
import { KafkaService } from './kafka.service'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: KAFKA_PRODUCER,
      useFactory: async (configService: ConfigService) => {
        const kafkaConfig = configService.get<KafkaConfiguration>('KAFKA')
        const kafkaClient = new Kafka({
          clientId: kafkaConfig.CLIENT_ID,
          brokers: [kafkaConfig.BROKER],
          ssl: false,
          retry: {
            maxRetryTime: 5 * 60 * 1000,
            initialRetryTime: 1000,
            factor: 0.2,
            retries: 10,
            multiplier: 3,
          },
          sasl: {
            mechanism: 'plain',
            username: kafkaConfig.USERNAME,
            password: kafkaConfig.PASSWORD,
          },
        })

        const producer = kafkaClient.producer({
          createPartitioner: Partitioners.DefaultPartitioner,
          allowAutoTopicCreation: true,
        })

        return producer
      },
      inject: [ConfigService],
    },
    KafkaService,
  ],
  exports: [KafkaService],
})
export class KafkaModule {}
