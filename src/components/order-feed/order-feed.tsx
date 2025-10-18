import React, { useEffect } from 'react';
import { useTypedSelector, useTypedDispatch } from '../../hooks';
import OrderCard from '../order-card/order-card';
import styles from './order-feed.module.css';
import { connectFeedWebSocket, disconnectFeedWebSocket, connectProfileOrdersWebSocket, disconnectProfileOrdersWebSocket } from '../../services/actions';
import { sortOrdersByUpdateTime } from '../../utils/orderUtils';

interface IOrderFeedProps {
  showStatus?: boolean;
}

/**
 * Компонент ленты заказов
 * Отображает список заказов с возможностью показа статуса
 * Подключается к WebSocket для получения данных в реальном времени
 */
export default function OrderFeed({ showStatus = false }: IOrderFeedProps): React.JSX.Element {
  const dispatch = useTypedDispatch();
  const { ingredients } = useTypedSelector((state) => state.ingredients);
  
  // Получаем данные в зависимости от типа ленты
  const feedData = useTypedSelector((state) => state.feed);
  const profileData = useTypedSelector((state) => state.profileOrders);
  
  const { orders, status, error, loading } = showStatus ? profileData : feedData;
  
  // Определяем состояние загрузки: либо WebSocket подключается, либо идет HTTP загрузка
  const isLoading = loading || status === 'CONNECTING';

  // Подключаемся к WebSocket при монтировании компонента
  useEffect(() => {
    if (showStatus) {
      // Для истории заказов пользователя
      dispatch(connectProfileOrdersWebSocket());
    } else {
      // Для общей ленты заказов
      dispatch(connectFeedWebSocket());
    }

    // Отключаемся при размонтировании
    return () => {
      if (showStatus) {
        dispatch(disconnectProfileOrdersWebSocket());
      } else {
        dispatch(disconnectFeedWebSocket());
      }
    };
  }, [dispatch, showStatus]);

  // Сортируем заказы по времени обновления
  const sortedOrders = sortOrdersByUpdateTime(orders);

  // Показываем лоадер только при подключении к WebSocket
  if (isLoading) {
    return (
      <div className={styles.empty}>
        <p className="text text_type_main-default text_color_inactive">
          Загрузка заказов...
        </p>
      </div>
    );
  }

  // Показываем ошибку только если есть реальная ошибка и нет заказов
  if (error && sortedOrders.length === 0) {
    return (
      <div className={styles.empty}>
        <p className="text text_type_main-default text_color_inactive">
          Ошибка: {error}
        </p>
      </div>
    );
  }

  // Показываем "Заказы не найдены" только если загрузка завершена и заказов нет
  if (!isLoading && sortedOrders.length === 0) {
    return (
      <div className={styles.empty}>
        <p className="text text_type_main-default text_color_inactive">
          Заказы не найдены
        </p>
      </div>
    );
  }

  return (    
    <div className={styles.container}>
        {sortedOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            ingredients={ingredients}
            showStatus={showStatus}
          />
        ))}
    </div>
  );
}
