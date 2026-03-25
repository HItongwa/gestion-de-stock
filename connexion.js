import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'DB_DIALECT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable d'environnement ${envVar} est requise.`);
  }
}

const connexion = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    logging: false,
  }
);

export const testDatabaseConnection = async () => {
  await connexion.authenticate();
  return connexion;
};

export default connexion;
