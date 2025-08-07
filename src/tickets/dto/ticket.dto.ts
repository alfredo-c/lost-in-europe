export type TicketType = 'flight' | 'train' | 'bus' | 'tram' | 'taxi';

export class TicketDto {
  from: string;
  to: string;
  type: TicketType;
  metadata: Record<string, string>; // seat, gate, platform, etc.
}
