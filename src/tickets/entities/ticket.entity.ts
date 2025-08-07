import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  type: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, string>;

  @Column()
  itineraryId: string;

  @Column()
  order: number;
}
