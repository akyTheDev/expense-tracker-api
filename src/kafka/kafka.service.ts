import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { Producer } from 'kafkajs'

import { KAFKA_PRODUCER } from './kafka.constants'

@Injectable()
export class KafkaService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(@Inject(KAFKA_PRODUCER) private readonly producer: Producer) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.producer.connect()
  }

  async onApplicationShutdown(): Promise<void> {
    await this.producer.disconnect()
  }

  /**
   * Send kafka message to the given topic.
   *
   * @param topic The topic to send the message.
   * @param data The data to send.
   * @returns Void.
   */
  async sendMessage(topic: string, data: Record<string, any>): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: String(data?.userId || ''),
          value: JSON.stringify(data),
        },
      ],
    })
  }
}
