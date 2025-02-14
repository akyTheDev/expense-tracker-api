import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1739567043765 implements MigrationInterface {
  name = 'Migration1739567043765'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "credit_card" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_97c08b6c8d5c1df81bf1a96c43e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "user_email_ids" ON "user" ("email") `,
    )
    await queryRunner.query(`SELECT setval('user_id_seq', 1000)`)
    await queryRunner.query(
      `ALTER TABLE "credit_card" ADD CONSTRAINT "FK_5af060e164a7e2764ed1b15589d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`SELECT setval('credit_card_id_seq', 1000)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "credit_card" DROP CONSTRAINT "FK_5af060e164a7e2764ed1b15589d"`,
    )
    await queryRunner.query(`DROP INDEX "public"."user_email_ids"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "credit_card"`)
  }
}
