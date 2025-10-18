/**
 * Утилиты для работы с датами
 */

/**
 * Форматирует дату в читаемый вид
 * @param date - дата для форматирования
 * @returns отформатированная строка даты
 */
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return 'Сегодня';
  } else if (days === 1) {
    return 'Вчера';
  } else if (days < 5) {
    return `${days} дня назад`;
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
};

/**
 * Форматирует время
 * @param date - дата для форматирования
 * @returns отформатированная строка времени
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow'
  });
};

/**
 * Форматирует дату и время
 * @param date - дата для форматирования
 * @returns отформатированная строка даты и времени
 */
export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)}, ${formatTime(date)}`;
};

