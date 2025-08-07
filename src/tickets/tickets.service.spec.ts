import { TicketsService } from './tickets.service';
import { TicketDto } from './dto/ticket.dto';
import { TicketFormatterFactory } from './formatters/ticket-formatter.factory';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import type { Mocked } from 'jest-mock';

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepository: jest.Mocked<Repository<Ticket>>;

  // Mock formatters
  const mockFormatter = {
    format: jest.fn(),
  };

  beforeEach(() => {
    // Create a mock repository
    ticketRepository = {
      create: jest.fn((entity) => entity as Ticket),
      save: jest.fn(),
      find: jest.fn(),
    } as unknown as Mocked<Repository<Ticket>>;

    // Create the service with the mocked repository
    service = new TicketsService(ticketRepository);

    // Mock formatters
    jest
      .spyOn(TicketFormatterFactory, 'getFormatter')
      .mockImplementation(() => mockFormatter);

    mockFormatter.format.mockReset();
  });

  it('should sort the full itinerary correctly (ignoring metadata)', async () => {
    const tickets: TicketDto[] = [
      {
        from: 'Bologna San Ruffillo',
        to: 'Bologna Guglielmo Marconi Airport',
        type: 'bus',
        metadata: {},
      },
      {
        from: 'Paris CDG Airport',
        to: "Chicago O'Hare",
        type: 'flight',
        metadata: {},
      },
      {
        from: 'Venice Airport',
        to: 'Gara Venetia Santa Lucia',
        type: 'bus',
        metadata: {},
      },
      {
        from: 'Gara Venetia Santa Lucia',
        to: 'Bologna San Ruffillo',
        type: 'train',
        metadata: {},
      },
      {
        from: 'St. Anton am Arlberg Bahnhof',
        to: 'Innsbruck Hbf',
        type: 'train',
        metadata: {},
      },
      {
        from: 'Innsbruck Hbf',
        to: 'Innsbruck Airport',
        type: 'tram',
        metadata: {},
      },
      {
        from: 'Bologna Guglielmo Marconi Airport',
        to: 'Paris CDG Airport',
        type: 'flight',
        metadata: {},
      },
      {
        from: 'Innsbruck Airport',
        to: 'Venice Airport',
        type: 'flight',
        metadata: {},
      },
    ];

    const { sorted } = await service.sortTickets(tickets);

    const ordered = sorted.map((t) => `${t.from} -> ${t.to}`);

    expect(ordered).toEqual([
      'St. Anton am Arlberg Bahnhof -> Innsbruck Hbf',
      'Innsbruck Hbf -> Innsbruck Airport',
      'Innsbruck Airport -> Venice Airport',
      'Venice Airport -> Gara Venetia Santa Lucia',
      'Gara Venetia Santa Lucia -> Bologna San Ruffillo',
      'Bologna San Ruffillo -> Bologna Guglielmo Marconi Airport',
      'Bologna Guglielmo Marconi Airport -> Paris CDG Airport',
      "Paris CDG Airport -> Chicago O'Hare",
    ]);

    expect(ticketRepository.create).toHaveBeenCalledTimes(sorted.length);
    expect(ticketRepository.save).toHaveBeenCalledWith(expect.any(Array));
  });

  describe('getHumanReadableItinerary', () => {
    it('should produce human-readable itinerary with formatted steps', () => {
      const itinerary: TicketDto[] = [
        {
          from: 'A',
          to: 'B',
          type: 'bus',
          metadata: { line: 'Line 1' },
        },
        {
          from: 'B',
          to: 'C',
          type: 'train',
          metadata: { train: 'Train 123' },
        },
      ];

      mockFormatter.format
        .mockReturnValueOnce('Bus from A to B on Line 1')
        .mockReturnValueOnce('Train from B to C on Train 123');

      const result = service.getHumanReadableItinerary(itinerary);

      expect(result).toEqual([
        '0. Start.',
        '1. Bus from A to B on Line 1',
        '2. Train from B to C on Train 123',
        '3. Last destination reached.',
      ]);
    });
  });
});
