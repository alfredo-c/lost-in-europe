// src/tickets/dto/ticket.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export type TicketType = 'flight' | 'train' | 'bus' | 'tram' | 'taxi';

export class TicketDto {
  @ApiProperty({ example: 'St. Anton am Arlberg Bahnhof' })
  from: string;

  @ApiProperty({ example: 'Innsbruck Hbf' })
  to: string;

  @ApiProperty({
    example: 'train',
    enum: ['flight', 'train', 'bus', 'tram', 'taxi'],
  })
  type: TicketType;

  @ApiProperty({
    example: { seat: '17C', platform: '3' },
    description: 'Additional information like seat, gate, platform, etc.',
  })
  metadata: Record<string, string>;
}
