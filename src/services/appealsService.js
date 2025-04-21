import { Op } from 'sequelize';

export class AppealsService {
  constructor(Appeal) {
    this.Appeal = Appeal;
  }

  async createAppeal({ topic, text }) {
    return await this.Appeal.create({ topic, text });
  }

  async startWork(id) {
    const appeal = await this.Appeal.findByPk(id);
    if (!appeal) {
      throw new Error('Обращение не найдено');
    }
    if (appeal.status !== 'Новое') {
      throw new Error('Обращение должно быть в статусе "Новое"');
    }
    appeal.status = 'В работе';
    return await appeal.save();
  }

  async completeAppeal(id, resolution) {
    const appeal = await this.Appeal.findByPk(id);
    if (!appeal) {
      throw new Error('Обращение не найдено');
    }
    if (appeal.status !== 'В работе') {
      throw new Error('Обращение должно быть в статусе "В работе"');
    }
    appeal.status = 'Завершено';
    appeal.resolution = resolution;
    return await appeal.save();
  }

  async cancelAppeal(id, cancelReason) {
    const appeal = await this.Appeal.findByPk(id);
    if (!appeal) {
      throw new Error('Обращение не найдено');
    }
    if (appeal.status === 'Завершено' || appeal.status === 'Отменено') {
      throw new Error('Обращение не может быть отменено');
    }
    appeal.status = 'Отменено';
    appeal.cancelReason = cancelReason;
    return await appeal.save();
  }

  async getAppeals({ date, startDate, endDate, page = 1, limit = 10 }) {
    let where = {};
    if (date) {
      const specificDate = new Date(date);
      where.createdAt = {
        [Op.gte]: specificDate,
        [Op.lte]: new Date(specificDate.getTime() + 24 * 60 * 60 * 1000),
      };
    } else if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }
    return await this.Appeal.findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async cancelAllWorking(cancelReason) {
    const [affectedRows] = await this.Appeal.update(
      { status: 'Отменено', cancelReason },
      { where: { status: 'В работе' } }
    );
    return affectedRows;
  }
}
