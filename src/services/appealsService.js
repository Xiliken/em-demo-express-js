export class AppealsService {
  constructor(repository) {
    this.repository = repository;
  }

  async createAppeal({ topic, text }) {
    return await this.repository.create({ topic, text });
  }

  async startWork(id) {
    const appeal = await this.repository.findById(id);
    if (!appeal) {
      throw new Error('Обращение не найдено');
    }
    if (appeal.status !== 'Новое') {
      throw new Error('Обращение должно быть в статусе "Новое"');
    }
    return await this.repository.update(id, { status: 'В работе' });
  }

  async completeAppeal(id, resolution) {
    const appeal = await this.repository.findById(id);
    if (!appeal) {
      throw new Error('Обращение не найдено');
    }
    if (appeal.status !== 'В работе') {
      throw new Error('Обращение должно быть в статусе "В работе"');
    }
    return await this.repository.update(id, {
      status: 'Завершено',
      resolution,
    });
  }

  async cancelAppeal(id, cancelReason) {
    const appeal = await this.repository.findById(id);
    if (!appeal) {
      throw new Error('Обращение не найдено');
    }
    if (appeal.status === 'Завершено' || appeal.status === 'Отменено') {
      throw new Error('Обращение не может быть отменено');
    }
    return await this.repository.update(id, {
      status: 'Отменено',
      cancelReason,
    });
  }

  async getAppeals({ date, startDate, endDate, page = 1, limit = 10 }) {
    return await this.repository.findAll({ date, startDate, endDate, page, limit });
  }

  async cancelAllWorking(cancelReason) {
    return await this.repository.updateAllWorking(cancelReason);
  }
}
