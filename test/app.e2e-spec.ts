import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /members', () => {
    return request(app.getHttpServer())
      .get('/members')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });

  it('GET /books', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });

  it('POST /transactions/borrow/{memberCode}/{bookCode}', () => {
    const memberCode = 'M001';
    const bookCode = 'JK-45';

    return request(app.getHttpServer())
      .post(`/transactions/borrow/${memberCode}/${bookCode}`)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  it('POST /transactions/return/{id}', () => {
    const id = 12;

    return request(app.getHttpServer())
      .post(`/transactions/return/${id}`)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          'Book returned successfully',
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
