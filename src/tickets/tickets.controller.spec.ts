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
              .mockResolvedValue({ id: 'test-id', sorted: mockSortedTickets }),
            getItinerary: jest.fn().mockResolvedValue(mockSortedTickets),
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

  it('should call service.sortTickets and return sorted itinerary with ID', async () => {
    const payload = {
      tickets: [
        { from: 'B', to: 'C', type: 'train', metadata: {} } as TicketDto,
        { from: 'A', to: 'B', type: 'bus', metadata: {} } as TicketDto,
      ],
    };

    const result = await controller.sort(payload);
    expect(service.sortTickets).toHaveBeenCalledWith(payload.tickets);
    expect(result).toEqual({
      id: 'test-id',
      sorted: mockSortedTickets,
    });
  });

  it('should call service.getItinerary and return the itinerary by id', async () => {
    const result = await controller.get('test-id');
    expect(service.getItinerary).toHaveBeenCalledWith('test-id');
    expect(result).toEqual(mockSortedTickets);
  });

  it('should throw NotFoundException when itinerary not found in get()', async () => {
    jest
      .spyOn(service, 'getItinerary')
      .mockRejectedValue(
        new NotFoundException(`Itinerary with ID 'invalid-id' not found`),
      );

    await expect(controller.get('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should call getHumanReadable and return human-readable itinerary', async () => {
    const result = await controller.getHumanReadable('test-id');
    expect(service.getItinerary).toHaveBeenCalledWith('test-id');
    expect(service.getHumanReadableItinerary).toHaveBeenCalledWith(
      mockSortedTickets,
    );
    expect(result).toEqual(['some string']);
  });

  it('should throw NotFoundException when itinerary not found in getHumanReadable()', async () => {
    jest
      .spyOn(service, 'getItinerary')
      .mockRejectedValue(
        new NotFoundException(`Itinerary with ID 'invalid-id' not found`),
      );

    await expect(controller.getHumanReadable('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
