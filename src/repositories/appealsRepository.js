import { Op } from 'sequelize';

export class AppealsRepository {
  constructor(Appeal) {
    this.Appeal = Appeal;
  }

  async create({ topic, text }) {
    console.log('Repository: Creating appeal:', { topic, text });
    return await this.Appeal.create({ topic, text });
  }

  async findById(id) {
    console.log('Repository: Finding appeal by ID:', id);
    return await this.Appeal.findByPk(id);
  }

  async update(id, updates) {
    console.log('Repository: Updating appeal:', id, updates);
    const appeal = await this.findById(id);
    if (!appeal) {
      throw new Error('Обращение не найдено');
    }
    return await appeal.update(updates);
  }

  async findAll({ date, startDate, endDate, page = 1, limit = 10 }) {
    console.log('Repository: Fetching appeals:', { date, startDate, endDate, page, limit });
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

  async updateAllWorking(cancelReason) {
    console.log('Repository: Canceling all working appeals:', cancelReason);
    const [affectedRows] = await this.Appeal.update(
      { status: 'Отменено', cancelReason },
      { where: { status: 'В работе' } }
    );
    console.log(`Repository: Canceled ${affectedRows} appeals`);
    return affectedRows;
  }
}
