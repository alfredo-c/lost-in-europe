import { Injectable } from '@nestjs/common';
import { TicketDto } from './dto/ticket.dto';
import { v4 as uuidv4 } from 'uuid';
import { TicketFormatterFactory } from 'src/tickets/formatters/ticket-formatter.factory';

@Injectable()
export class TicketsService {
  private itineraries = new Map<string, TicketDto[]>();

  sortTickets(tickets: TicketDto[]): { id: string; sorted: TicketDto[] } {
    const fromMap = new Map<string, TicketDto>();
    const toSet = new Set<string>();

    for (const ticket of tickets) {
      fromMap.set(ticket.from, ticket);
      toSet.add(ticket.to);
    }

    // Find start point (from not in any to)
    const start = [...fromMap.keys()].find((place) => !toSet.has(place));
    if (!start) {
      throw new Error('Invalid itinerary: no start point found.');
    }

    // Walk the path
    const sorted: TicketDto[] = [];
    let current = start;

    while (fromMap.has(current)) {
      const ticket = fromMap.get(current) as TicketDto;
      sorted.push(ticket);
      current = ticket.to;
    }

    const id = uuidv4();
    this.itineraries.set(id, sorted);
    return { id, sorted };
  }

  getItinerary(id: string): TicketDto[] | undefined {
    return this.itineraries.get(id);
  }

  getHumanReadableItinerary(itinerary: TicketDto[]): string[] {
    const result: string[] = [];

    result.push('0. Start.');

    itinerary.forEach((ticket, index) => {
      const formatter = TicketFormatterFactory.getFormatter(ticket.type);
      result.push(`${index + 1}. ${formatter.format(ticket)}`);
    });

    result.push(`${itinerary.length + 1}. Last destination reached.`);

    return result;
  }
}
