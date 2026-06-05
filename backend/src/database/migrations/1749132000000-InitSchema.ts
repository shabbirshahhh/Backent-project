import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1749132000000 implements MigrationInterface {
  name = 'InitSchema1749132000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "employee" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "position" character varying NOT NULL,
        CONSTRAINT "PK_employee_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "employee"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
