import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('TicketsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tickets/sort (POST) should sort, save and return itinerary id with sorted tickets', async () => {
    const ticketsPayload = {
      tickets: [
        { from: 'A', to: 'B', type: 'bus', metadata: {} },
        { from: 'B', to: 'C', type: 'train', metadata: {} },
      ],
    };

    const response = await request
      .default(app.getHttpServer())
      .post('/tickets/sort')
      .send(ticketsPayload)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(Array.isArray(response.body.sorted)).toBe(true);
    expect(response.body.sorted).toHaveLength(2);
    expect(response.body.sorted[0].from).toBe('A');
    expect(response.body.sorted[1].to).toBe('C');
  });

  it('/tickets/:id (GET) should retrieve the saved itinerary', async () => {
    // First save itinerary
    const ticketsPayload = {
      tickets: [
        { from: 'X', to: 'Y', type: 'bus', metadata: {} },
        { from: 'Y', to: 'Z', type: 'train', metadata: {} },
      ],
    };

    const sortResponse = await request
      .default(app.getHttpServer())
      .post('/tickets/sort')
      .send(ticketsPayload)
      .expect(201);

    const itineraryId = sortResponse.body.id;

    // Now retrieve it
    const getResponse = await request
      .default(app.getHttpServer())
      .get(`/tickets/${itineraryId}`)
      .expect(200);

    expect(Array.isArray(getResponse.body)).toBe(true);
    expect(getResponse.body.length).toBe(2);
    expect(getResponse.body[0].from).toBe('X');
    expect(getResponse.body[1].to).toBe('Z');
  });

  it('/tickets/:id/human-readable (GET) should return human-readable itinerary', async () => {
    const ticketsPayload = {
      tickets: [
        { from: 'P', to: 'Q', type: 'bus', metadata: {} },
        { from: 'Q', to: 'R', type: 'train', metadata: {} },
      ],
    };

    const sortResponse = await request
      .default(app.getHttpServer())
      .post('/tickets/sort')
      .send(ticketsPayload)
      .expect(201);

    const itineraryId = sortResponse.body.id;

    const humanResponse = await request
      .default(app.getHttpServer())
      .get(`/tickets/${itineraryId}/human-readable`)
      .expect(200);

    expect(Array.isArray(humanResponse.body)).toBe(true);
    expect(humanResponse.body[0]).toContain('Start');
    expect(humanResponse.body[humanResponse.body.length - 1]).toContain(
      'Last destination',
    );
  });
});
