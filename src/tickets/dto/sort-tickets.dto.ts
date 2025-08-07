// src/tickets/dto/sort-tickets.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';

export class SortTicketsDto {
  @ApiProperty({ type: [TicketDto] })
  tickets: TicketDto[];
}
