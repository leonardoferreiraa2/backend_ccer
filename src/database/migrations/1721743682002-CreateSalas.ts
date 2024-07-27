import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSalas1721743682002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "salas",
                columns: [
                    {
                        name: "id",
                        type: "integer",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: "titulo",
                        type: "varchar"
                    },
                    {
                        name: "texto",
                        type: "text"
                    },
                    {
                        name: "urlAudio",
                        type: "varchar"
                    },
                    {
                        name: "urlFoto",
                        type: "varchar"
                    },
                    {
                        name: "urlVideo",
                        type: "varchar"
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("salas");
    }

}
