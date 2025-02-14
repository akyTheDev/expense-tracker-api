import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { faker } from '@faker-js/faker'

import { AppModule } from './../../src/app.module'
import { user_1_token } from '../fixtures/common'

describe('Users (e2e)', () => {
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

  describe('/users (POST)', () => {
    it('should register the user and return 201', async () => {
      const newUser = {
        email: faker.internet.email(),
        password: 'test1234',
        name: faker.person.fullName(),
      }

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.email).toBe(newUser.email)
      expect(response.body.name).toBe(newUser.name)

      expect(response.body).not.toHaveProperty('password')
    })

    it('should return 409 when the email has already been used', async () => {
      const newUser = {
        email: 'user@example.com',
        password: 'test1234',
        name: faker.person.fullName(),
      }

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(409)
    })
  })

  describe('/users/me (GET)', () => {
    it('should return the user information', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${user_1_token}`)
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('email')
      expect(response.body).toHaveProperty('name')
      expect(response.body).not.toHaveProperty('password')
    })

    it('should return 401 if token is not given', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401)
    })
  })
})
