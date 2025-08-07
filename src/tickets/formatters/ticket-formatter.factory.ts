import { TicketFormatter } from './ticket-formatter.interface';
import { FlightFormatter } from './flight-formatter';
import { TrainFormatter } from './train-formatter';
import { TramFormatter } from './tram-formatter';
import { BusFormatter } from './bus-formatter';

export class TicketFormatterFactory {
  static getFormatter(type: string): TicketFormatter {
    switch (type) {
      case 'flight':
        return new FlightFormatter();
      case 'train':
        return new TrainFormatter();
      case 'tram':
        return new TramFormatter();
      case 'bus':
        return new BusFormatter();
      default:
        throw new Error(`Unsupported ticket type: ${type}`);
    }
  }
}
