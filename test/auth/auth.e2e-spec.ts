import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { AppModule } from './../../src/app.module'

describe('Auth (e2e)', () => {
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

  describe('/auth/login (POST)', () => {
    it('should return the token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'test1234',
        })
        .expect(201)

      expect(response.body).toHaveProperty('token')
      expect(response.body.token_type).toBe('bearer')
    })

    it('should return 401 if the credentials are wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user2@example.com',
          password: 'test1234',
        })
        .expect(401)
    })
  })
})
