import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  database: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'em_demo',
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
  },
};
