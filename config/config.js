import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

// Конфигурация для приложения
export const appConfig = {
  port: process.env.PORT || 3000,
};

// Конфигурация для Sequelize (для моделей и миграций)
export default {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'appeals_db',
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME_TEST || 'appeals_db_test',
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST_PROD || 'localhost',
    port: process.env.DB_PORT_PROD || 5432,
    database: process.env.DB_NAME_PROD || 'appeals_db_prod',
    username: process.env.DB_USER_PROD || 'user',
    password: process.env.DB_PASSWORD_PROD || 'password',
  },
};
