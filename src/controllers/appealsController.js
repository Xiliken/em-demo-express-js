import { body, param, query, validationResult } from 'express-validator';

export class AppealsController {
  constructor(appealsService) {
    this.appealsService = appealsService;
  }

  createAppealValidations = [
    body('topic').notEmpty().withMessage('Тема обращения обязательна').isString().withMessage('Тема должна быть строкой'),
    body('text').notEmpty().withMessage('Текст обращения обязателен').isString().withMessage('Текст должен быть строкой'),
  ];

  completeAppealValidations = [
    param('id').isInt().withMessage('ID должен быть числом'),
    body('resolution').notEmpty().withMessage('Текст решения обязателен').isString().withMessage('Решение должно быть строкой'),
  ];

  cancelAppealValidations = [
    param('id').isInt().withMessage('ID должен быть числом'),
    body('cancelReason').notEmpty().withMessage('Причина отмены обязательна').isString().withMessage('Причина отмены должна быть строкой'),
  ];

  getAppealsValidations = [
    query('date').optional().isDate().withMessage('Дата должна быть в формате YYYY-MM-DD'),
    query('startDate').optional().isDate().withMessage('Начальная дата должна быть в формате YYYY-MM-DD'),
    query('endDate').optional().isDate().withMessage('Конечная дата должна быть в формате YYYY-MM-DD'),
    query('page').optional().isInt({ min: 1 }).withMessage('Номер страницы должен быть положительным числом'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Лимит должен быть положительным числом'),
  ];

  cancelAllWorkingValidations = [
    body('cancelReason').notEmpty().withMessage('Причина отмены обязательна').isString().withMessage('Причина отмены должна быть строкой'),
  ];

  startWorkValidations = [
    param('id').isInt().withMessage('ID должен быть числом'),
  ];

  validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }
    next();
  };

  async createAppeal(req, res) {
    console.log('POST /api/appeals', req.body);
    try {
      await this.validate(req, res, async () => {
        const appeal = await this.appealsService.createAppeal(req.body);
        res.status(201).json(appeal);
      });
    } catch (error) {
      console.error('Create appeal error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async startWork(req, res) {
    console.log(`PATCH /api/appeals/${req.params.id}/work`);
    try {
      await this.validate(req, res, async () => {
        const appeal = await this.appealsService.startWork(req.params.id);
        res.json(appeal);
      });
    } catch (error) {
      console.error('Start work error:', error);
      res.status(error.message.includes('не найдено') ? 404 : 400).json({ error: error.message });
    }
  }

  async completeAppeal(req, res) {
    console.log(`PATCH /api/appeals/${req.params.id}/complete`, req.body);
    try {
      await this.validate(req, res, async () => {
        const { resolution } = req.body;
        const appeal = await this.appealsService.completeAppeal(req.params.id, resolution);
        res.json(appeal);
      });
    } catch (error) {
      console.error('Complete appeal error:', error);
      res.status(error.message.includes('не найдено') ? 404 : 400).json({ error: error.message });
    }
  }

  async cancelAppeal(req, res) {
    console.log(`PATCH /api/appeals/${req.params.id}/cancel`, req.body);
    try {
      await this.validate(req, res, async () => {
        const { cancelReason } = req.body;
        const appeal = await this.appealsService.cancelAppeal(req.params.id, cancelReason);
        res.json(appeal);
      });
    } catch (error) {
      console.error('Cancel appeal error:', error);
      res.status(error.message.includes('не найдено') ? 404 : 400).json({ error: error.message });
    }
  }

  async getAppeals(req, res) {
    console.log('GET /api/appeals', req.query);
    try {
      await this.validate(req, res, async () => {
        const { date, startDate, endDate, page, limit } = req.query;
        const appeals = await this.appealsService.getAppeals({ date, startDate, endDate, page, limit });
        res.json(appeals);
      });
    } catch (error) {
      console.error('Get appeals error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async cancelAllWorking(req, res) {
    console.log('PATCH /api/appeals/cancel-working', req.body);
    try {
      await this.validate(req, res, async () => {
        const { cancelReason } = req.body;
        if (typeof cancelReason !== 'string') {
          throw new Error('Причина отмены должна быть строкой');
        }
        const affectedRows = await this.appealsService.cancelAllWorking(cancelReason);
        res.json({ message: `Отменено ${affectedRows} обращений` });
      });
    } catch (error) {
      console.error('Cancel all working error:', error);
      res.status(400).json({ error: error.message });
    }
  }
}
