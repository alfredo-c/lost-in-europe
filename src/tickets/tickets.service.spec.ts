import { TicketsService } from './tickets.service';
import { TicketDto } from './dto/ticket.dto';
import { TicketFormatterFactory } from 'src/tickets/formatters/ticket-formatter.factory';

describe('TicketsService', () => {
  let service: TicketsService;

  // Mock formatters for each type
  const mockFormatter = {
    format: jest.fn(),
  };

  beforeEach(() => {
    service = new TicketsService();

    // Mock the TicketFormatterFactory.getFormatter method globally
    jest
      .spyOn(TicketFormatterFactory, 'getFormatter')
      .mockImplementation(() => mockFormatter);

    mockFormatter.format.mockReset();
  });

  it('should sort the full itinerary correctly (ignoring metadata)', () => {
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

    const { sorted } = service.sortTickets(tickets);

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

      // Mock the formatter.format to return a predictable string per ticket
      mockFormatter.format
        .mockReturnValueOnce('Bus from A to B on Line 1')
        .mockReturnValueOnce('Train from B to C on Train 123');

      const result = service.getHumanReadableItinerary(itinerary);

      expect(TicketFormatterFactory.getFormatter).toHaveBeenCalledTimes(2);
      expect(TicketFormatterFactory.getFormatter).toHaveBeenCalledWith('bus');
      expect(TicketFormatterFactory.getFormatter).toHaveBeenCalledWith('train');

      expect(mockFormatter.format).toHaveBeenCalledTimes(2);
      expect(mockFormatter.format).toHaveBeenCalledWith(itinerary[0]);
      expect(mockFormatter.format).toHaveBeenCalledWith(itinerary[1]);

      expect(result).toEqual([
        '0. Start.',
        '1. Bus from A to B on Line 1',
        '2. Train from B to C on Train 123',
        '3. Last destination reached.',
      ]);
    });
  });
});
