import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { user_1_token, user_3_token } from '../fixtures/common'
import { AppModule } from './../../src/app.module'

describe('Credit Cards (e2e)', () => {
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

  describe('/credit-cards (POST)', () => {
    it('should register the user and return 201', async () => {
      const newCard = {
        name: faker.person.fullName(),
      }

      await request(app.getHttpServer())
        .post('/credit-cards')
        .set('Authorization', `Bearer ${user_1_token}`)
        .send(newCard)
        .expect(201)
    })

    it('should return 401 when token is not given', async () => {
      await request(app.getHttpServer())
        .post('/credit-cards')
        .send({ name: 'Test123' })
        .expect(401)
    })
  })

  describe('/credit-cards (GET)', () => {
    it('shold return all cards', async () => {
      const result = await request(app.getHttpServer())
        .get('/credit-cards')
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

  describe('/credit-cards/{id} (GET)', () => {
    it('shold return the given card', async () => {
      const result = await request(app.getHttpServer())
        .get('/credit-cards/1')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(200)

      expect(result.body).toHaveProperty('id')
      expect(result.body).toHaveProperty('name')
    })

    it('should return 404 if card not found', async () => {
      await request(app.getHttpServer())
        .get('/credit-cards/1234')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(404)
    })

    it('should return 401 if card not found', async () => {
      await request(app.getHttpServer()).get('/credit-cards/123').expect(401)
    })
  })

  describe('/credit-cards/{id} (DELETE)', () => {
    it('shold delete the card', async () => {
      const cards = await request(app.getHttpServer())
        .get('/credit-cards')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(200)

      const cardId = cards.body[cards.body.length - 1].id

      await request(app.getHttpServer())
        .delete(`/credit-cards/${cardId}`)
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(204)
    })

    it('should return 404 if card not found', async () => {
      await request(app.getHttpServer())
        .delete('/credit-cards/1234')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(404)
    })

    it('should return 401 if card not found', async () => {
      await request(app.getHttpServer()).delete('/credit-cards/123').expect(401)
    })
  })
})
