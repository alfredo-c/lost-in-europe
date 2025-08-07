import { TicketDto } from '../dto/ticket.dto';

export interface TicketFormatter {
  format(ticket: TicketDto): string;
}
