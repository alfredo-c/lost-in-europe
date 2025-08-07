import { TicketFormatter } from './ticket-formatter.interface';
import { TicketDto } from '../dto/ticket.dto';

export class TrainFormatter implements TicketFormatter {
  format(ticket: TicketDto): string {
    const { from, to, metadata } = ticket;
    return `Board train ${metadata.train || ''}, Platform ${metadata.platform || '?'}, from ${from} to ${to}. Seat number ${metadata.seat || '?'}.`;
  }
}
