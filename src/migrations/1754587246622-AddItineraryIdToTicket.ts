import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItineraryIdToTicket1754587246622 implements MigrationInterface {
  name = 'AddItineraryIdToTicket1754587246622';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD "itineraryId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "itineraryId"`);
  }
}
