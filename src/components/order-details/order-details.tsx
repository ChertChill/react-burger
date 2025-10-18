import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useTypedSelector, useTypedDispatch } from '../../hooks';
import styles from './order-details.module.css';
import { IOrder, IIngredient } from '../../utils/types';
import { formatDateTime } from '../../utils/dateUtils';
import { calculateOrderPrice, formatOrderStatus, getOrderStatusClass, isOrderFresh } from '../../utils/orderUtils';
import { fetchOrderById, fetchProfileOrderById } from '../../services/actions';

interface IOrderDetailsProps {
  order?: IOrder;
}

/**
 * Компонент детальной информации о заказе
 * Отображает полную информацию о заказе: номер, статус, состав, дату и общую стоимость
 */
export default function OrderDetails({ order }: IOrderDetailsProps): React.JSX.Element {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useTypedDispatch();
  const { ingredients } = useTypedSelector((state) => state.ingredients);
  const { orders: feedOrders } = useTypedSelector((state) => state.feed);
  const { orders: profileOrders } = useTypedSelector((state) => state.profileOrders);
  const { orderNumber } = useTypedSelector((state) => state.order);

  // Определяем, откуда пришли (из ленты или из профиля)
  const isFromProfile = location.state?.from === 'profile' || location.pathname.startsWith('/profile/orders/');
  
  // Состояние для динамического статуса
  const [currentStatus, setCurrentStatus] = useState<string>('');

  // Проверяем все три слайса для поиска заказа
  const currentOrder = useMemo(() => {
    return order || 
      feedOrders.find((o: IOrder) => o.number === Number(number)) ||
      profileOrders.find((o: IOrder) => o.number === Number(number)) ||
      (orderNumber === Number(number) ? { 
        _id: 'temp', 
        number: orderNumber, 
        status: 'created' as const, 
        name: 'Заказ создается...', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        ingredients: [] 
      } : null);
  }, [order, feedOrders, profileOrders, orderNumber, number]);

  // Обновляем статус каждую секунду для свежих заказов в профиле
  useEffect(() => {
    if (!currentOrder || !isFromProfile) return;
    
    const interval = setInterval(() => {
      if (isOrderFresh(currentOrder)) {
        // Если заказ свежий (менее 15 секунд), показываем статус "Создан"
        setCurrentStatus('created');
      } else {
        // Если заказ не свежий, показываем реальный статус
        setCurrentStatus(currentOrder.status);
      }
    }, 1000); // Обновляем каждую секунду
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, [currentOrder, isFromProfile]);

  // Если заказ не найден, пытаемся загрузить его с сервера
  useEffect(() => {
    if (!currentOrder && number) {
      const orderNumber = Number(number);
      if (isFromProfile) {
        dispatch(fetchProfileOrderById(orderNumber));
      } else {
        dispatch(fetchOrderById(orderNumber));
      }
    }
  }, [currentOrder, number, isFromProfile, dispatch]);

  if (!currentOrder) {
    return (
      <div className={styles.not_found}>
        <p className="text text_type_main-default text_color_inactive">
          Заказ не найден
        </p>
      </div>
    );
  }

  // Получаем ингредиенты заказа
  const orderIngredients = currentOrder.ingredients
    .map((id: string) => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  // Подсчитываем количество каждого ингредиента
  const ingredientCounts = orderIngredients.reduce((acc, ingredient) => {
    acc[ingredient._id] = (acc[ingredient._id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Уникальные ингредиенты для отображения
  const uniqueIngredients = Array.from(new Set(orderIngredients));

  // Вычисляем общую стоимость
  const totalPrice = calculateOrderPrice(currentOrder, ingredients);

  return (
    <div className={styles.details}>
      <p className="text text_type_digits-default">#{currentOrder.number}</p>
      
      <h2 className="text text_type_main-medium mt-10">{currentOrder.name}</h2>
      
      <p className={`text text_type_main-default mt-3 ${styles[getOrderStatusClass(isFromProfile && currentStatus ? currentStatus : currentOrder.status)]}`}>
        {formatOrderStatus(isFromProfile && currentStatus ? currentStatus : currentOrder.status)}
      </p>
      
      <div className="mb-10">
        <h3 className="text text_type_main-medium mt-15">Состав:</h3>
        <div className={`${styles.ingredients_list} mt-6 pr-6`}>
          {uniqueIngredients.map((ingredient) => (
            <div key={ingredient._id} className={styles.ingredient_item}>
              <div className={styles.ingredient_info}>
                <div className={styles.ingredient_image_wrapper}>
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name}
                    className={styles.ingredient_image}
                  />
                </div>
                <span className="text text_type_main-default">{ingredient.name}</span>
              </div>
              <div className={styles.ingredient_count}>
                <span className="text text_type_digits-default">
                  {ingredientCounts[ingredient._id]} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {formatDateTime(new Date(currentOrder.createdAt))}
        </span>
        <div className={styles.total_price}>
          <span className="text text_type_digits-default mr-2">
            {totalPrice}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
}