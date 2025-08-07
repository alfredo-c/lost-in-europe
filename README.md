LOST IN EUROPE

## Description

API that creates an ordered itinerary based on unsorted tickets.
Uses a linear-time sorting algorithm (O(n)) that reconstructs the trip by mapping each ticket's start location to the ticket and then following the chain from the unique start point.

The approach uses a Map and Set to find the itinerary start and sort tickets in one pass.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# Start the required Docker services:
$ npm run docker:build
$ npm run docker:db:up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
# Start the required Docker services:
$ npm run docker:e2e:up
$ npm run test:e2e

# services tests
# Start the required Docker services:
# Will prepare the db, app, run the postman collection
$ npm run docker:up

# test coverage
$ npm run test:cov
```

## Migration

```bash
# run docker-compose.db.yml to make db avaiable then create and run
# change [name_you_want] to what the name you want for your new migration
$ npm run migration:generate:name [name_you_want]
$ npm run migration:run
```

## API Documentation and Mock Integration

This project integrates Swagger UI to provide comprehensive, interactive API documentation.

- **Input and Output Schemas:** Swagger defines request parameters, body schemas, and response formats for each endpoint.
- **Interactive Testing:** Developers can test API endpoints directly from the Swagger UI without needing a separate client.
- **Mock Integration:** The detailed request/response models make it easy for frontend or integration teams to create mocks and stubs based on the exact API contract.
- **Error Handling Documentation:** Error responses, such as 404 Not Found, include example payloads so consumers know what to expect on failures.

To access the Swagger documentation, run the application and open:

```bash
http://localhost:3000/api
```

## Resources

- NestJS
- PostgreSQL
- TypeORM
- Docker
- Jest
- Swagger
- ESlint
- Prettier

## Possibles improvement on the system design

- Use the Command pattern for extensible operations and segregate writes from reads.
- Use event-driven architecture with Kafka: create events with pending status; workers process and update to finished, to make it scalable.
- The system is prepare to extend another types using the factory pattern.

---

## Algorithm & Patterns used in TicketsService.sortTickets

The algorithm to sort tickets:

1. Creates a Map (`fromMap`) from each ticket's `from` location to the ticket.
2. Creates a Set (`toSet`) of all `to` locations.
3. Finds the unique itinerary start by locating a `from` location not present in `toSet`.
4. Iteratively follows the itinerary from start, retrieving each next ticket from the Map until no next leg is found.

- This has **O(n)** time complexity because each ticket is processed once.
- Uses **Map** and **Set** for constant-time lookups.
- Applies the **Factory pattern** for formatting tickets of different types (`TicketFormatterFactory`).
- Data persistence via TypeORM repository, creating entities with an `order` property for DB retrieval.
- Throws exceptions for invalid itineraries or missing data.
- Uses UUIDs to uniquely identify each generated itinerary.
