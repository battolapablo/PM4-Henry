import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1727064766149 implements MigrationInterface {
    name = 'InitialMigration1727064766149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying NOT NULL, "confirmPassword" character varying NOT NULL, "phone" integer, "country" character varying(50), "address" text, "city" character varying(50), "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_afcd3ae9dbf45eced5872ca49b0" UNIQUE ("email"), CONSTRAINT "PK_d9b0d3777428b67f460cf8a9b14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_6a5532d4752516bb661d3c7e928" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders_detail_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, "orderId" uuid, CONSTRAINT "REL_cec5b19a4748b220fbee2f8765" UNIQUE ("orderId"), CONSTRAINT "PK_12b1ddb5dcbb869591aa6d15bd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "mimeType" character varying NOT NULL, "data" bytea NOT NULL, "productId" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL, "imgUrl" character varying DEFAULT 'https://img.freepik.com/vector-gratis/fondo-estudio-blanco-plataforma-visualizacion-podio_1017-37977.jpg', "categoryId" uuid NOT NULL, CONSTRAINT "PK_16ee1985f8818dd29f75f7f6282" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders_detail_entity_products_products_entity" ("ordersDetailEntityId" uuid NOT NULL, "productsEntityId" uuid NOT NULL, CONSTRAINT "PK_6099f026c92ba7aacf989ca0755" PRIMARY KEY ("ordersDetailEntityId", "productsEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bcf06d5301200ae652dbc53450" ON "orders_detail_entity_products_products_entity" ("ordersDetailEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_52fe2508c42471c3786b181b41" ON "orders_detail_entity_products_products_entity" ("productsEntityId") `);
        await queryRunner.query(`ALTER TABLE "orders_entity" ADD CONSTRAINT "FK_bc8499ffae550937c981473c5d1" FOREIGN KEY ("userId") REFERENCES "users_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_detail_entity" ADD CONSTRAINT "FK_cec5b19a4748b220fbee2f87659" FOREIGN KEY ("orderId") REFERENCES "orders_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_57a86e1cc8eae915977547fdaeb" FOREIGN KEY ("productId") REFERENCES "products_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_entity" ADD CONSTRAINT "FK_1c63dc5ff511fdec6b133599759" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_detail_entity_products_products_entity" ADD CONSTRAINT "FK_bcf06d5301200ae652dbc53450d" FOREIGN KEY ("ordersDetailEntityId") REFERENCES "orders_detail_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders_detail_entity_products_products_entity" ADD CONSTRAINT "FK_52fe2508c42471c3786b181b419" FOREIGN KEY ("productsEntityId") REFERENCES "products_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_detail_entity_products_products_entity" DROP CONSTRAINT "FK_52fe2508c42471c3786b181b419"`);
        await queryRunner.query(`ALTER TABLE "orders_detail_entity_products_products_entity" DROP CONSTRAINT "FK_bcf06d5301200ae652dbc53450d"`);
        await queryRunner.query(`ALTER TABLE "products_entity" DROP CONSTRAINT "FK_1c63dc5ff511fdec6b133599759"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_57a86e1cc8eae915977547fdaeb"`);
        await queryRunner.query(`ALTER TABLE "orders_detail_entity" DROP CONSTRAINT "FK_cec5b19a4748b220fbee2f87659"`);
        await queryRunner.query(`ALTER TABLE "orders_entity" DROP CONSTRAINT "FK_bc8499ffae550937c981473c5d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52fe2508c42471c3786b181b41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bcf06d5301200ae652dbc53450"`);
        await queryRunner.query(`DROP TABLE "orders_detail_entity_products_products_entity"`);
        await queryRunner.query(`DROP TABLE "category_entity"`);
        await queryRunner.query(`DROP TABLE "products_entity"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "orders_detail_entity"`);
        await queryRunner.query(`DROP TABLE "orders_entity"`);
        await queryRunner.query(`DROP TABLE "users_entity"`);
    }

}
