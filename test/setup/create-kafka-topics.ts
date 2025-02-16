import { Kafka } from 'kafkajs'

async function createTopics() {
  const kafka = new Kafka({
    clientId: 'kafka-client',
    brokers: ['localhost:59092'],
    sasl: {
      mechanism: 'plain',
      username: 'admin',
      password: 'password',
    },
    ssl: false,
  })

  const admin = kafka.admin()

  try {
    await admin.connect()
    console.log('Connected to Kafka admin.')

    const topics = [
      { topic: 'transaction.create', numPartitions: 1, replicationFactor: 1 },
      // Add more topics as needed
    ]

    // Create topics
    const created = await admin.createTopics({
      topics,
      waitForLeaders: true,
    })

    console.log(`Topics created: ${created}`)
  } catch (error) {
    console.error('Error creating topics:', error)
  } finally {
    await admin.disconnect()
    console.log('Disconnected from Kafka admin.')
  }
}

createTopics()
