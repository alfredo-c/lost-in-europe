import { TicketFormatter } from './ticket-formatter.interface';
import { TicketDto } from '../dto/ticket.dto';

export class TramFormatter implements TicketFormatter {
  format(ticket: TicketDto): string {
    const { from, to, metadata } = ticket;
    return `Board the Tram ${metadata.line || ''} from ${from} to ${to}.`;
  }
}
