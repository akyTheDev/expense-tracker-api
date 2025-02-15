import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { user_1_token, user_3_token } from '../fixtures/common'
import { AppModule } from './../../src/app.module'

describe('Transactions (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/transactions (POST)', () => {
    it('should insert the transaction and return 201', async () => {
      const newTransaction = {
        date: '2025-01-03T13:13:000Z',
        amount: 124.13,
        description: 'Test e2e transaction',
        cardId: 1,
      }

      await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${user_1_token}`)
        .send(newTransaction)
        .expect(201)
    })

    it('should return 404 if the card not found', async () => {
      const newTransaction = {
        date: '2025-01-03T13:13:000Z',
        amount: 124.13,
        description: 'Test e2e transaction',
        cardId: 12,
      }

      await request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${user_1_token}`)
        .send(newTransaction)
        .expect(404)
    })

    it('should return 401 when token is not given', async () => {
      await request(app.getHttpServer()).post('/transactions').expect(401)
    })
  })

  describe('/transactions (GET)', () => {
    it('shold return all transactions', async () => {
      const result = await request(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(200)

      expect(Array.isArray(result.body)).toBe(true)
    })

    it('shold return transactions of card', async () => {
      const result = await request(app.getHttpServer())
        .get('/transactions?cardId=1')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(200)

      expect(Array.isArray(result.body)).toBe(true)
    })

    it('should return 404 if card not found', async () => {
      await request(app.getHttpServer())
        .get('/credit-cards')
        .set('Authorization', `Bearer ${user_3_token}`)
        .expect(404)
    })

    it('should return 401 if card not found', async () => {
      await request(app.getHttpServer()).get('/credit-cards').expect(401)
    })
  })

  describe('/transactions/{id} (GET)', () => {
    it('shold return the transaction', async () => {
      const result = await request(app.getHttpServer())
        .get('/transactions/1')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(200)

      expect(result.body).toHaveProperty('description')
      expect(result.body).toHaveProperty('amount')
      expect(result.body).toHaveProperty('cardId')
      expect(result.body).toHaveProperty('date')
      expect(result.body).toHaveProperty('id')
    })

    it('should return 404 if card not found', async () => {
      await request(app.getHttpServer())
        .get('/transactions/124')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(404)
    })

    it('should return 401 if card not found', async () => {
      await request(app.getHttpServer()).get('/transactions/123').expect(401)
    })
  })
})
