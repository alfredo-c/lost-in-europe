// src/tickets/tickets.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { SortTicketsDto } from './dto/sort-tickets.dto';
import { TicketDto } from './dto/ticket.dto';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('sort')
  @ApiOperation({ summary: 'Sort tickets into a valid itinerary' })
  @ApiResponse({
    status: 201,
    description: 'Sorted tickets',
    schema: {
      example: {
        id: 'e3a1e4b0-9c4d-4f20-a0e2-9d124d2c93f3',
        sorted: [
          {
            from: 'St. Anton am Arlberg Bahnhof',
            to: 'Innsbruck Hbf',
            type: 'train',
            metadata: {
              seat: '17C',
              platform: '3',
            },
          },
        ],
      },
    },
  })
  async sort(
    @Body() body: SortTicketsDto,
  ): Promise<{ id: string; sorted: TicketDto[] }> {
    return this.ticketsService.sortTickets(body.tickets);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stored itinerary by ID' })
  @ApiResponse({ status: 200, type: [TicketDto] })
  @ApiResponse({
    status: 404,
    description: 'Itinerary not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message:
            "Itinerary with ID 'c3e0acf9-f4ab-4e69-9bd4-6a3e5abe0251a' not found",
          error: 'Not Found',
        },
      },
    },
  })
  async get(@Param('id') id: string): Promise<TicketDto[]> {
    return this.ticketsService.getItinerary(id);
  }

  @Get(':id/human-readable')
  @ApiOperation({
    summary: 'Get human-readable instructions for the itinerary',
  })
  @ApiResponse({
    status: 404,
    description: 'Itinerary not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message:
            "Itinerary with ID 'c3e0acf9-f4ab-4e69-9bd4-6a3e5abe0251a' not found",
          error: 'Not Found',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        '1. Board train RJX 765, Platform 3, from St. Anton am Arlberg Bahnhof to Innsbruck Hbf. Seat number 17C.',
        '2. ...',
      ],
    },
  })
  async getHumanReadable(@Param('id') id: string): Promise<string[]> {
    const itinerary = await this.ticketsService.getItinerary(id);
    return this.ticketsService.getHumanReadableItinerary(itinerary);
  }
}
