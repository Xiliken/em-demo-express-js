import { AppealsRepository } from '../../src/repositories/appealsRepository.js';

const mockAppealModel = {
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
};

let repository;

beforeEach(() => {
  repository = new AppealsRepository(mockAppealModel);
  jest.clearAllMocks();
});

describe('AppealsRepository', () => {
  test('create должен вызывать Appeal.create', async () => {
    const data = { topic: 'Topic', text: 'Text' };
    await repository.create(data);

    expect(mockAppealModel.create).toHaveBeenCalledWith(data);
  });

  test('findById должен вызывать Appeal.findByPk', async () => {
    await repository.findById(1);

    expect(mockAppealModel.findByPk).toHaveBeenCalledWith(1);
  });

  test('update должен обновлять обращение', async () => {
    const mockAppeal = { update: jest.fn() };
    mockAppealModel.findByPk.mockResolvedValue(mockAppeal);

    await repository.update(1, { status: 'Новое' });

    expect(mockAppeal.update).toHaveBeenCalledWith({ status: 'Новое' });
  });

  test('update должен выбрасывать ошибку, если обращение не найдено', async () => {
    mockAppealModel.findByPk.mockResolvedValue(null);

    await expect(repository.update(1, { status: 'Новое' })).rejects.toThrow('Обращение не найдено');
  });

  test('updateAllWorking должен вызывать массовое обновление', async () => {
		mockAppealModel.update.mockResolvedValue([5]);
    await repository.updateAllWorking('Canceled by system');

		expect(mockAppealModel.update.mockResolvedValue([5]));
    expect(mockAppealModel.update).toHaveBeenCalled();
  });
});
