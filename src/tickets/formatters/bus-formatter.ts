import { TicketFormatter } from './ticket-formatter.interface';
import { TicketDto } from '../dto/ticket.dto';

export class BusFormatter implements TicketFormatter {
  format(ticket: TicketDto): string {
    const { from, to } = ticket;
    return `Board the bus from ${from} to ${to}. No seat assignment.`;
  }
}
