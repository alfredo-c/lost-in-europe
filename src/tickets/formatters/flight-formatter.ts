import { TicketFormatter } from './ticket-formatter.interface';
import { TicketDto } from '../dto/ticket.dto';

export class FlightFormatter implements TicketFormatter {
  format(ticket: TicketDto): string {
    const { from, to, metadata } = ticket;
    return `From ${from}, board the flight ${metadata.flight || ''} to ${to} from gate ${metadata.gate || '?'}, seat ${metadata.seat || '?'}. ${metadata.luggage || ''}`.trim();
  }
}
