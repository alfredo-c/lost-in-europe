import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderToTicket1754587937527 implements MigrationInterface {
    name = 'AddOrderToTicket1754587937527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "order"`);
    }

}
