import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketDto, TicketType } from './dto/ticket.dto';
import { v4 as uuidv4 } from 'uuid';
import { TicketFormatterFactory } from './formatters/ticket-formatter.factory';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async sortTickets(
    tickets: TicketDto[],
  ): Promise<{ id: string; sorted: TicketDto[] }> {
    const itineraryId = uuidv4();

    // Sort tickets (existing logic)
    const fromMap = new Map<string, TicketDto>();
    const toSet = new Set<string>();

    for (const ticket of tickets) {
      fromMap.set(ticket.from, ticket);
      toSet.add(ticket.to);
    }

    const start = [...fromMap.keys()].find((place) => !toSet.has(place));
    if (!start) throw new Error('Invalid itinerary: no start point found.');

    const sorted: TicketDto[] = [];
    let current = start;

    while (fromMap.has(current)) {
      const ticket = fromMap.get(current) as TicketDto;
      sorted.push(ticket);
      current = ticket.to;
    }

    // Create entities with order and itineraryId
    const ticketEntities = sorted.map((ticketDto, index) =>
      this.ticketRepository.create({
        ...ticketDto,
        itineraryId,
        order: index,
      }),
    );

    await this.ticketRepository.save(ticketEntities);

    return { id: itineraryId, sorted };
  }

  async getItinerary(id: string): Promise<TicketDto[]> {
    const tickets = await this.ticketRepository.find({
      where: { itineraryId: id },
      order: { order: 'ASC' },
    });

    if (tickets.length === 0) {
      throw new NotFoundException(`Itinerary with ID '${id}' not found`);
    }

    return tickets.map((t) => ({
      id: t.id,
      from: t.from,
      to: t.to,
      type: t.type as TicketType,
      metadata: t.metadata,
    }));
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
