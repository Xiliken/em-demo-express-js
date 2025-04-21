import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

// Конфигурация для приложения
export const config = {
  port: process.env.PORT || 3000,
  database: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'appeals_db',
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
  },
};

// Конфигурация для Sequelize (для моделей и миграций)
export default {
  development: {
    dialect: config.database.dialect,
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    username: config.database.username,
    password: config.database.password,
  },
  test: {
    dialect: config.database.dialect,
    host: config.database.host,
    port: config.database.port,
    database: process.env.DB_NAME_TEST || 'appeals_db_test',
    username: config.database.username,
    password: config.database.password,
  },
  production: {
    dialect: config.database.dialect,
    host: process.env.DB_HOST_PROD || config.database.host,
    port: process.env.DB_PORT_PROD || config.database.port,
    database: process.env.DB_NAME_PROD || 'appeals_db_prod',
    username: process.env.DB_USER_PROD || config.database.username,
    password: process.env.DB_PASSWORD_PROD || config.database.password,
  },
};
