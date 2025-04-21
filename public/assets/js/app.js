import { validateCreateAppeal, validateCancelAll, validateCompleteAppeal, validateCancelAppeal, displayErrors } from './validate.js';

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
      alert('Обращение создано');
      await fetchAppeals();
    } else {
      alert(result.errors ? result.errors.join(', ') : result.error);
    }
  } catch (error) {
    alert('Ошибка: ' + error.message);
  }
};

const fetchAppeals = async () => {
  const date = document.getElementById('date').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  let url = '/api/appeals';
  if (date) url += `?date=${date}`;
  else if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;

  try {
    const response = await fetch(url);
    const appeals = await response.json();
    const appealsDiv = document.getElementById('appeals');
    appealsDiv.innerHTML = '';

    appeals.forEach(appeal => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow';
      div.innerHTML = `
        <h3 class="font-bold">${appeal.topic}</h3>
        <p>${appeal.text}</p>
        <p><strong>Статус:</strong> ${appeal.status}</p>
        ${appeal.resolution ? `<p><strong>Решение:</strong> ${appeal.resolution}</p>` : ''}
        ${appeal.cancelReason ? `<p><strong>Причина отмены:</strong> ${appeal.cancelReason}</p>` : ''}
        ${appeal.status === 'Новое' ? `<button onclick="window.app.startWork(${appeal.id})" class="bg-yellow-500 text-white p-2 rounded mt-2">Взять в работу</button>` : ''}
        ${appeal.status === 'В работе' ? `
          <div id="complete-errors-${appeal.id}"></div>
          <textarea id="resolution-${appeal.id}" placeholder="Текст решения" class="border p-2 mt-2 w-full"></textarea>
          <button onclick="window.app.completeAppeal(${appeal.id})" class="bg-green-500 text-white p-2 rounded mt-2">Завершить</button>
          <div id="cancel-errors-${appeal.id}"></div>
          <textarea id="cancelReason-${appeal.id}" placeholder="Причина отмены" class="border p-2 mt-2 w-full"></textarea>
          <button onclick="window.app.cancelAppeal(${appeal.id})" class="bg-red-500 text-white p-2 rounded mt-2">Отменить</button>
        ` : ''}
      `;
      appealsDiv.appendChild(div);
    });
  } catch (error) {
    alert('Ошибка: ' + error.message);
  }
};

const startWork = async (id) => {
  try {
    const response = await fetch(`/api/appeals/${id}/work`, { method: 'PATCH' });
    const result = await response.json();
    if (response.ok) {
      alert('Обращение взято в работу');
      await fetchAppeals();
    } else {
      alert(result.errors ? result.errors.join(', ') : result.error);
    }
  } catch (error) {
    alert('Ошибка: ' + error.message);
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
      alert('Обращение завершено');
      await fetchAppeals();
    } else {
      alert(result.errors ? result.errors.join(', ') : result.error);
    }
  } catch (error) {
    alert('Ошибка: ' + error.message);
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
      alert('Обращение отменено');
      await fetchAppeals();
    } else {
      alert(result.errors ? result.errors.join(', ') : result.error);
    }
  } catch (error) {
    alert('Ошибка: ' + error.message);
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
      alert(result.message);
      await fetchAppeals();
    } else {
      alert(result.errors ? result.errors.join(', ') : result.error);
    }
  } catch (error) {
    alert('Ошибка: ' + error.message);
  }
};

window.app = {
  createAppeal,
  fetchAppeals,
  startWork,
  completeAppeal,
  cancelAppeal,
  cancelAllWorking,
};

fetchAppeals();
