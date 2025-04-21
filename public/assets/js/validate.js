export const validateCreateAppeal = (topic, text) => {
  const errors = [];
  if (!topic.trim()) errors.push('Тема обращения обязательна');
  if (!text.trim()) errors.push('Текст обращения обязателен');
  return errors;
};

export const validateCancelAll = (cancelReason) => {
  const errors = [];
  if (!cancelReason.trim()) errors.push('Причина отмены обязательна');
  return errors;
};

export const validateCompleteAppeal = (resolution) => {
  const errors = [];
  if (!resolution.trim()) errors.push('Текст решения обязателен');
  return errors;
};

export const validateCancelAppeal = (cancelReason) => {
  const errors = [];
  if (!cancelReason.trim()) errors.push('Причина отмены обязательна');
  return errors;
};

export const displayErrors = (errors, containerId) => {
  const container = document.getElementById(containerId);
  container.innerHTML = errors.map(error => `<p class="text-red-500">${error}</p>`).join('');
};
