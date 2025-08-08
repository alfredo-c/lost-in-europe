LOST IN EUROPE

## Description

API that creates an ordered itinerary based on unsorted tickets.
Uses a linear-time sorting algorithm (O(n)) that reconstructs the trip by mapping each ticket's start location to the ticket and then following the chain from the unique start point.

The approach uses a Map and Set to find the itinerary start and sort tickets in one pass.

## Project setup

### Docker setup

```bash
# Start a persistent database instance for local development.
npm run docker:db:up

# Start a temporary database instance (non-persistent), intended for running E2E tests locally.
npm run docker:e2e:up

# Start the application and database using Docker, and automatically run the Postman collection.
npm run docker:up

```

### Compile and run the project

```bash
# Required Node.js version
node -v
# v22.x

# Install project dependencies
npm install

# Run the app in development mode
npm run start

# Run the app in watch mode (auto-restarts on file changes)
npm run start:dev

# Run the app in production mode
npm run start:prod

```

## Run tests

```bash
# Run unit tests
npm run test

# Run end-to-end (E2E) tests
npm run test:e2e

# Run full API integration tests using Docker (includes DB and Postman collection)
npm run docker:up

# Generate test coverage report
npm run test:cov

```

## Migration

```bash
# Generate a new migration script
npm run migration:generate:name [migration_name]

# Run all pending migrations
npm run migration:run

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

## Algorithm & Patterns used in TicketsService.sortTickets

The algorithm to sort tickets:

1. Creates a Map (`fromMap`) from each ticket's `from` location to the ticket.
2. Creates a Set (`toSet`) of all `to` locations.
3. Finds the unique itinerary start by locating a `from` location not present in `toSet`.
4. Iteratively follows the itinerary from start, retrieving each next ticket from the Map until no next leg is found.

- This has **O(n)** time complexity because each ticket is processed once.
- Uses **Map** and **Set** for constant-time lookups.
- Implemented the **Factory Pattern** through `TicketFormatterFactory` to support scalable extension of new ticket types.
- Data persistence via TypeORM repository, creating entities with an `order` property for DB retrieval.
- Throws exceptions for invalid itineraries or missing data.
- Uses UUIDs to uniquely identify each generated itinerary.

## Possible Improvements to System Design

- Implement the **Command Pattern** to support extensible operations and separate write and read responsibilities.
- Adopt an **event-driven architecture** using Kafka: create events with a pending status; workers process these events and update them to finished, improving scalability.

## Next Steps

- Implement CI/CD pipelines.
- Integrate Newman for service testing, enabling canary deployments with CloudWatch alarms.
- Add API security by implementing JWT authentication.

---
