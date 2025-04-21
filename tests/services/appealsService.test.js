import { AppealsService } from '../../src/services/appealsService.js';

// Мокаем методы репозитория
const mockRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  updateAllWorking: jest.fn(),
};

let service;

beforeEach(() => {
  service = new AppealsService(mockRepository);
  jest.clearAllMocks(); // Очищаем моки перед каждым тестом
});

describe('AppealsService', () => {
  test('createAppeal должен вызывать repository.create', async () => {
    const data = { topic: 'Test', text: 'Test Text' };
    await service.createAppeal(data);

    expect(mockRepository.create).toHaveBeenCalledWith(data);
  });

  test('startWork должен менять статус на "В работе"', async () => {
    mockRepository.findById.mockResolvedValue({ id: 1, status: 'Новое' });

    await service.startWork(1);

    expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'В работе' });
  });

  test('startWork должен выбрасывать ошибку при неправильном статусе', async () => {
    mockRepository.findById.mockResolvedValue({ id: 1, status: 'Завершено' });

    await expect(service.startWork(1)).rejects.toThrow('Обращение должно быть в статусе "Новое"');
  });

  test('completeAppeal должен менять статус на "Завершено" и сохранять решение', async () => {
    mockRepository.findById.mockResolvedValue({ id: 1, status: 'В работе' });

    await service.completeAppeal(1, 'Resolved');

    expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'Завершено', resolution: 'Resolved' });
  });

  test('cancelAppeal должен менять статус на "Отменено" и сохранять причину отмены', async () => {
    mockRepository.findById.mockResolvedValue({ id: 1, status: 'В работе' });

    await service.cancelAppeal(1, 'Client canceled');

    expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'Отменено', cancelReason: 'Client canceled' });
  });

  test('cancelAllWorking должен вызывать repository.updateAllWorking', async () => {
    await service.cancelAllWorking('Reason');
    expect(mockRepository.updateAllWorking).toHaveBeenCalledWith('Reason');
  });
});
