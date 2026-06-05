"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1749132000000 = void 0;
class InitSchema1749132000000 {
    constructor() {
        this.name = 'InitSchema1749132000000';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "employee"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    }
}
exports.InitSchema1749132000000 = InitSchema1749132000000;
//# sourceMappingURL=1749132000000-InitSchema.js.map