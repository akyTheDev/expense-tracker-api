import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1739614293474 implements MigrationInterface {
  name = 'Migration1739614293474'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "credit_card" DROP CONSTRAINT "FK_5af060e164a7e2764ed1b15589d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "credit_card" RENAME COLUMN "userId" TO "user_id"`,
    )
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "description" character varying(255) NOT NULL, "card_id" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "transaction_card_id_idx" ON "transaction" ("card_id") `,
    )
    await queryRunner.query(`SELECT setval('transaction_id_seq', 1000)`)

    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_0cdacac0abbf49573c8d8babb6f" FOREIGN KEY ("card_id") REFERENCES "credit_card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "credit_card" ADD CONSTRAINT "FK_e2e8ed5e6717832d95f911767c2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "credit_card" DROP CONSTRAINT "FK_e2e8ed5e6717832d95f911767c2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_0cdacac0abbf49573c8d8babb6f"`,
    )
    await queryRunner.query(`DROP INDEX "public"."transaction_card_id_idx"`)
    await queryRunner.query(`DROP TABLE "transaction"`)
    await queryRunner.query(
      `ALTER TABLE "credit_card" RENAME COLUMN "user_id" TO "userId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "credit_card" ADD CONSTRAINT "FK_5af060e164a7e2764ed1b15589d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
