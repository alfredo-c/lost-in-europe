import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketDto } from './dto/ticket.dto';
import { NotFoundException } from '@nestjs/common';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const mockSortedTickets: TicketDto[] = [
    { from: 'A', to: 'B', type: 'bus', metadata: {} },
    { from: 'B', to: 'C', type: 'train', metadata: {} },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: {
            sortTickets: jest
              .fn()
              .mockReturnValue({ id: 'test-id', sorted: mockSortedTickets }),
            getItinerary: jest.fn().mockReturnValue(mockSortedTickets),
            getHumanReadableItinerary: jest
              .fn()
              .mockReturnValue(['some string']),
          },
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should call service.sortTickets and return sorted itinerary with ID', () => {
    const payload = {
      tickets: [
        { from: 'B', to: 'C', type: 'train', metadata: {} } as TicketDto,
        { from: 'A', to: 'B', type: 'bus', metadata: {} } as TicketDto,
      ],
    };

    const result = controller.sort(payload);
    expect(service.sortTickets).toHaveBeenCalledWith(payload.tickets);
    expect(result).toEqual({
      id: 'test-id',
      sorted: mockSortedTickets,
    });
  });

  it('should call service.getItinerary and return the itinerary by id', () => {
    const result = controller.get('test-id');
    expect(service.getItinerary).toHaveBeenCalledWith('test-id');
    expect(result).toEqual(mockSortedTickets);
  });

  it('should throw NotFoundException when itinerary not found in get()', () => {
    jest.spyOn(service, 'getItinerary').mockReturnValue(undefined);

    expect(() => controller.get('invalid-id')).toThrow(NotFoundException);
  });

  it('should call getHumanReadable and return human-readable itinerary', () => {
    const result = controller.getHumanReadable('test-id');
    expect(service.getItinerary).toHaveBeenCalledWith('test-id');
    expect(service.getHumanReadableItinerary).toHaveBeenCalledWith(
      mockSortedTickets,
    );
    expect(result).toEqual(['some string']);
  });

  it('should throw NotFoundException when itinerary not found in getHumanReadable()', () => {
    jest.spyOn(service, 'getItinerary').mockReturnValue(undefined);

    expect(() => controller.getHumanReadable('invalid-id')).toThrow(
      NotFoundException,
    );
  });
});
