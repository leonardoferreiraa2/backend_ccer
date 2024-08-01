import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT, 10),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [__dirname + '/models/*.ts'], // Caminho para as entidades
  migrations: [__dirname + '/database/migrations/*.ts'], // Caminho para as migrations
  ssl: {
    rejectUnauthorized: false, // Adiciona esta configuração
  },
};

export default ormconfig;
