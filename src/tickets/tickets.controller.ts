import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { SortTicketsDto } from './dto/sort-tickets.dto';
import { TicketDto } from './dto/ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('sort')
  async sort(
    @Body() body: SortTicketsDto,
  ): Promise<{ id: string; sorted: TicketDto[] }> {
    return this.ticketsService.sortTickets(body.tickets);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<TicketDto[]> {
    return this.ticketsService.getItinerary(id);
  }

  @Get(':id/human-readable')
  async getHumanReadable(@Param('id') id: string): Promise<string[]> {
    const itinerary = await this.ticketsService.getItinerary(id);
    return this.ticketsService.getHumanReadableItinerary(itinerary);
  }
}
