import { IOrder, IIngredient, IOrderWithIngredients } from './types';

/**
 * Утилиты для работы с заказами
 */

/**
 * Рассчитывает стоимость заказа на основе ингредиентов
 * @param order - заказ с массивом ID ингредиентов
 * @param ingredients - массив всех доступных ингредиентов
 * @returns общая стоимость заказа
 */
export const calculateOrderPrice = (order: IOrder, ingredients: IIngredient[]): number => {
  const orderIngredients = order.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  return orderIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
};

/**
 * Получает детальную информацию об ингредиентах заказа
 * @param order - заказ с массивом ID ингредиентов
 * @param ingredients - массив всех доступных ингредиентов
 * @returns заказ с полной информацией об ингредиентах
 */
export const getOrderWithIngredients = (order: IOrder, ingredients: IIngredient[]): IOrderWithIngredients => {
  const orderIngredients = order.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  const totalPrice = calculateOrderPrice(order, ingredients);

  return {
    ...order,
    ingredients: orderIngredients,
    totalPrice
  };
};

/**
 * Группирует заказы по статусам для статистики
 * @param orders - массив заказов
 * @returns объект с массивами номеров заказов по статусам
 */
export const groupOrdersByStatus = (orders: IOrder[]) => {
  const ready: number[] = [];
  const inProgress: number[] = [];
  const cancelled: number[] = [];

  orders.forEach(order => {
    switch (order.status) {
      case 'done':
        ready.push(order.number);
        break;
      case 'pending':
      case 'created':
        inProgress.push(order.number);
        break;
      case 'cancelled':
        cancelled.push(order.number);
        break;
    }
  });

  return {
    ready,
    inProgress,
    cancelled
  };
};

/**
 * Форматирует статус заказа для отображения
 * @param status - статус заказа
 * @returns отформатированный текст статуса
 */
export const formatOrderStatus = (status: string): string => {
  switch (status) {
    case 'done':
      return 'Выполнен';
    case 'pending':
      return 'Готовится';
    case 'created':
      return 'Создан';
    case 'cancelled':
      return 'Отменён';
    default:
      return 'Неизвестно';
  }
};

/**
 * Получает CSS класс для статуса заказа
 * @param status - статус заказа
 * @returns CSS класс для стилизации
 */
export const getOrderStatusClass = (status: string): string => {
  switch (status) {
    case 'done':
      return 'status_done';
    case 'pending':
      return 'status_pending';
    case 'created':
      return 'status_created';
    case 'cancelled':
      return 'status_cancelled';
    default:
      return '';
  }
};

/**
 * Проверяет, является ли заказ свежим (создан в течение последних 15 секунд)
 * @param order - заказ
 * @returns true, если заказ свежий
 */
export const isOrderFresh = (order: IOrder): boolean => {
  const orderTime = new Date(order.createdAt).getTime();
  const currentTime = Date.now();
  const timeDiff = currentTime - orderTime;
  
  // Заказ считается свежим, если он создан в течение последних 15 секунд
  return timeDiff <= 15000;
};

/**
 * Сортирует заказы по времени обновления (новые сначала)
 * @param orders - массив заказов
 * @returns отсортированный массив заказов
 */
export const sortOrdersByUpdateTime = (orders: IOrder[]): IOrder[] => {
  return [...orders].sort((a, b) => {
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    return timeB - timeA;
  });
};

