import express from 'express';
import { Sequelize } from 'sequelize';
import cors from 'cors';
import { engine } from 'express-handlebars';
import path from 'path';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import config from '../config/config.js';
import { appConfig } from '../config/config.js';
import { defineAppeal } from '../models/appeals.js';
import { AppealsService } from './services/appealsService.js';
import { AppealsRepository } from './repositories/appealsRepository.js';
import { createAppealsRoutes } from './routes/appealsRoutes.js';
import { createViewsRoutes } from './routes/viewsRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализация базы данных
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

// Определение модели
const Appeal = defineAppeal(sequelize);

// Инициализация репозитория и сервиса
const appealsRepository = new AppealsRepository(Appeal);
const appealsService = new AppealsService(appealsRepository);

// Настройка Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(process.cwd(), 'src/views/layouts'),
  partialsDir: path.join(process.cwd(), 'src/views/partials'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'src/views'));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    console.log(`Serving static file: ${path}`);
  },
}));

// Маршруты
console.log('Setting up routes...');
app.use('/api/appeals', createAppealsRoutes(appealsService));
app.use('/', createViewsRoutes());

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Обработчик 404
app.use((req, res) => {
  console.log(`404: Cannot GET ${req.originalUrl}`);
  res.status(404).send('Ой, не удалось найти такую страницу');
});

// Запуск сервера
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    app.listen(appConfig.port, () => {
      console.log(`Сервер запущен на http://localhost:${appConfig.port}`);
    });
  } catch (error) {
    console.error('Ошибка запуска:', error);
  }
})();
