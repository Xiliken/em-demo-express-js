import { validateCreateAppeal, validateCancelAll, validateCompleteAppeal, validateCancelAppeal, displayErrors } from './validate.js';

const ITEMS_PER_PAGE = 9;
let currentPage = 1;

const createAppeal = async () => {
  const topic = document.getElementById('topic').value;
  const text = document.getElementById('text').value;
  const errors = validateCreateAppeal(topic, text);

  if (errors.length > 0) {
    displayErrors(errors, 'create-appeal-errors');
    return;
  }

  try {
    const response = await fetch('/api/appeals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, text }),
    });
    const result = await response.json();
    if (response.ok) {
      showNotification('Обращение создано', 'success');
      document.getElementById('topic').value = '';
      document.getElementById('text').value = '';
    } else {
      showNotification(result.errors ? result.errors.join(', ') : result.error, 'error');
    }
  } catch (error) {
    showNotification('Ошибка: ' + error.message, 'error');
  }
};

const fetchAppeals = async (page = 1) => {
  const date = document.getElementById('date')?.value;
  const startDate = document.getElementById('startDate')?.value;
  const endDate = document.getElementById('endDate')?.value;
  let url = `/api/appeals?page=${page}&limit=${ITEMS_PER_PAGE}`;
  if (date) url += `&date=${date}`;
  else if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;

  try {
    const response = await fetch(url);
    const appeals = await response.json();
    const appealsDiv = document.getElementById('appeals');
    if (page === 1) appealsDiv.innerHTML = '';

    appeals.forEach(appeal => {
      const div = document.createElement('div');
      div.className = 'bg-white p-6 rounded-lg shadow card';
      div.innerHTML = `
        <h3 class="font-bold text-lg text-gray-800 mb-2">${appeal.topic}</h3>
        <p class="text-gray-600 mb-2">${appeal.text}</p>
        <p class="text-sm"><strong class="text-gray-700">Статус:</strong> ${appeal.status}</p>
        ${appeal.resolution ? `<p class="text-sm"><strong class="text-gray-700">Решение:</strong> ${appeal.resolution}</p>` : ''}
        ${appeal.cancelReason ? `<p class="text-sm"><strong class="text-gray-700">Причина отмены:</strong> ${appeal.cancelReason}</p>` : ''}
        ${appeal.status === 'Новое' ? `<button data-action="start-work" data-id="${appeal.id}" class="bg-yellow-500 text-white p-2 rounded mt-4 w-full hover:bg-yellow-600 transition">Взять в работу</button>` : ''}
        ${appeal.status === 'В работе' ? `
          <div id="complete-errors-${appeal.id}" class="text-red-600 mb-2"></div>
          <textarea id="resolution-${appeal.id}" placeholder="Текст решения" class="border rounded-lg p-3 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          <button data-action="complete" data-id="${appeal.id}" class="bg-green-500 text-white p-2 rounded mt-2 w-full hover:bg-green-600 transition">Завершить</button>
          <div id="cancel-errors-${appeal.id}" class="text-red-600 mb-2"></div>
          <textarea id="cancelReason-${appeal.id}" placeholder="Причина отмены" class="border rounded-lg p-3 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          <button data-action="cancel" data-id="${appeal.id}" class="bg-red-500 text-white p-2 rounded mt-2 w-full hover:bg-red-600 transition">Отменить</button>
        ` : ''}
      `;
      appealsDiv.appendChild(div);
    });

    const loadMoreButton = document.getElementById('load-more');
    if (appeals.length === ITEMS_PER_PAGE) {
      loadMoreButton.classList.remove('hidden');
    } else {
      loadMoreButton.classList.add('hidden');
    }
  } catch (error) {
    showNotification('Ошибка: ' + error.message, 'error');
  }
};

const startWork = async (id) => {
  try {
    const response = await fetch(`/api/appeals/${id}/work`, { method: 'PATCH' });
    const result = await response.json();
    if (response.ok) {
      showNotification('Обращение взято в работу', 'success');
      await fetchAppeals(currentPage);
    } else {
      showNotification(result.errors ? result.errors.join(', ') : result.error, 'error');
    }
  } catch (error) {
    showNotification('Ошибка: ' + error.message, 'error');
  }
};

const completeAppeal = async (id) => {
  const resolution = document.getElementById(`resolution-${id}`).value;
  const errors = validateCompleteAppeal(resolution);

  if (errors.length > 0) {
    displayErrors(errors, `complete-errors-${id}`);
    return;
  }

  try {
    const response = await fetch(`/api/appeals/${id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution }),
    });
    const result = await response.json();
    if (response.ok) {
      showNotification('Обращение завершено', 'success');
      await fetchAppeals(currentPage);
    } else {
      showNotification(result.errors ? result.errors.join(', ') : result.error, 'error');
    }
  } catch (error) {
    showNotification('Ошибка: ' + error.message, 'error');
  }
};

const cancelAppeal = async (id) => {
  const cancelReason = document.getElementById(`cancelReason-${id}`).value;
  const errors = validateCancelAppeal(cancelReason);

  if (errors.length > 0) {
    displayErrors(errors, `cancel-errors-${id}`);
    return;
  }

  try {
    const response = await fetch(`/api/appeals/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancelReason }),
    });
    const result = await response.json();
    if (response.ok) {
      showNotification('Обращение отменено', 'success');
      await fetchAppeals(currentPage);
    } else {
      showNotification(result.errors ? result.errors.join(', ') : result.error, 'error');
    }
  } catch (error) {
    showNotification('Ошибка: ' + error.message, 'error');
  }
};

const cancelAllWorking = async () => {
  const cancelReason = document.getElementById('cancelReasonAll').value;
  const errors = validateCancelAll(cancelReason);

  if (errors.length > 0) {
    displayErrors(errors, 'cancel-all-errors');
    return;
  }

  try {
    const response = await fetch('/api/appeals/cancel-working', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancelReason }),
    });
    const result = await response.json();
    if (response.ok) {
      showNotification(result.message, 'success');
      document.getElementById('cancelReasonAll').value = '';
    } else {
      showNotification(result.errors ? result.errors.join(', ') : result.error, 'error');
    }
  } catch (error) {
    showNotification('Ошибка: ' + error.message, 'error');
  }
};

const showNotification = (message, type) => {
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

// Настройка делегирования событий
document.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id ? parseInt(button.dataset.id, 10) : null;

  if (action === 'start-work' && id) {
    await startWork(id);
  } else if (action === 'complete' && id) {
    await completeAppeal(id);
  } else if (action === 'cancel' && id) {
    await cancelAppeal(id);
  } else if (action === 'create-appeal') {
    await createAppeal();
  } else if (action === 'cancel-all') {
    await cancelAllWorking();
  } else if (action === 'apply-filter') {
    currentPage = 1;
    await fetchAppeals(currentPage);
  } else if (action === 'load-more') {
    currentPage++;
    await fetchAppeals(currentPage);
  }
});

if (window.location.pathname === '/appeals') {
  fetchAppeals();
}
