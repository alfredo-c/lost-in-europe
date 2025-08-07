import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { SortTicketsDto } from './dto/sort-tickets.dto';
import { TicketDto } from './dto/ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('sort')
  sort(@Body() body: SortTicketsDto): { id: string; sorted: TicketDto[] } {
    return this.ticketsService.sortTickets(body.tickets);
  }

  @Get(':id')
  get(@Param('id') id: string): TicketDto[] {
    const itinerary = this.ticketsService.getItinerary(id);
    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID '${id}' not found`);
    }
    return itinerary;
  }

  @Get(':id/human-readable')
  getHumanReadable(@Param('id') id: string): string[] {
    const itinerary = this.ticketsService.getItinerary(id);

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID '${id}' not found`);
    }

    return this.ticketsService.getHumanReadableItinerary(itinerary);
  }
}
