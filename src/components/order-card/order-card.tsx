import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-card.module.css';
import { IOrder, IIngredient } from '../../utils/types';
import { formatDateTime } from '../../utils/dateUtils';
import { calculateOrderPrice, formatOrderStatus, getOrderStatusClass, isOrderFresh } from '../../utils/orderUtils';

interface IOrderCardProps {
  order: IOrder;
  ingredients: IIngredient[];
  showStatus?: boolean;
}

/**
 * Компонент карточки заказа
 * Отображает основную информацию о заказе: номер, название, дату, состав и цену
 */
export default function OrderCard({ order, ingredients, showStatus = false }: IOrderCardProps): React.JSX.Element {
  const location = useLocation();
  const [currentStatus, setCurrentStatus] = useState(order.status);
  
  // Обновляем статус каждую секунду для свежих заказов в профиле
  useEffect(() => {
    if (!showStatus) return; // Только для истории заказов в профиле
    
    const interval = setInterval(() => {
      if (isOrderFresh(order)) {
        // Если заказ свежий (менее 15 секунд), показываем статус "Создан"
        setCurrentStatus('created');
      } else {
        // Если заказ не свежий, показываем реальный статус
        setCurrentStatus(order.status);
      }
    }, 1000); // Обновляем каждую секунду
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, [order, showStatus]);
  
  // Получаем ингредиенты заказа
  const orderIngredients = order.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  // Подсчитываем количество каждого ингредиента (пока не используется, но может понадобиться для будущих функций)
  // const ingredientCounts = orderIngredients.reduce((acc, ingredient) => {
  //   acc[ingredient._id] = (acc[ingredient._id] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  // Уникальные ингредиенты для отображения
  const uniqueIngredients = Array.from(new Set(orderIngredients));

  // Вычисляем общую стоимость
  const totalPrice = calculateOrderPrice(order, ingredients);

  // Определяем путь для ссылки
  const getOrderPath = () => {
    if (location.pathname.startsWith('/profile/orders')) {
      return `/profile/orders/${order.number}`;
    }
    return `/feed/${order.number}`;
  };

  // Определяем состояние для передачи в маршрут согласно паттерну React Router
  const getOrderState = () => {
    if (location.pathname.startsWith('/profile/orders')) {
      return { background: location };
    }
    return { background: location };
  };

  return (
    <Link to={getOrderPath()} state={getOrderState()} className={styles.link}>
      <div className={`${styles.card} p-6`}>
        <div className={styles.header}>
          <span className="text text_type_digits-default">#{order.number}</span>
          <span className="text text_type_main-default text_color_inactive">
            {formatDateTime(new Date(order.createdAt))}
          </span>
        </div>
        
        <div className={`${styles.name} mt-6`}>
          <h3 className="text text_type_main-medium">{order.name}</h3>
          {showStatus && (
            <p className={`text text_type_main-default mt-2 ${styles[getOrderStatusClass(currentStatus)]}`}>
              {formatOrderStatus(currentStatus)}
            </p>
          )}
        </div>
        
        <div className={`${styles.content} mt-6`}>
          <div className={styles.ingredients}>
            {uniqueIngredients.slice(0, 6).map((ingredient, index) => {
              const zIndexClass = `ingredient_z_${10 - index}` as keyof typeof styles;
              return (
                <div key={ingredient._id} className={`${styles.ingredient} ${styles[zIndexClass]}`}>
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name}
                    className={styles.ingredient_image}
                  />
                  {index === 5 && uniqueIngredients.length > 6 && (
                    <div className={styles.ingredient_overlay}>
                      <span className="text text_type_main-default">
                        +{uniqueIngredients.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className={styles.price}>
            <span className="text text_type_digits-default mr-2">
              {totalPrice}
            </span>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}
