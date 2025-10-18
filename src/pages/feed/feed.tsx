import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderFeed from '../../components/order-feed/order-feed';
import OrderStats from '../../components/order-stats/order-stats';
import Modal from '../../components/modal/modal';
import OrderDetails from '../../components/order-details/order-details';
import { useModal } from '../../hooks';
import styles from './feed.module.css';

/**
 * Страница ленты заказов
 * Отображает ленту всех заказов и статистику
 * Поддерживает модальное окно с деталями заказа
 */
export default function Feed(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal } = useModal();

  /**
   * Функция для закрытия модального окна
   * Возвращает пользователя на страницу ленты заказов
   */
  const handleCloseModal = (): void => {
    navigate('/feed', { replace: true });
  };

  // Эффект для управления модальным окном при изменении маршрута
  useEffect(() => {
    const pathname = location.pathname;
    
    // Если мы находимся на странице заказа (/feed/:number)
    if (pathname.startsWith('/feed/') && pathname !== '/feed') {
      const orderNumber = pathname.split('/')[2];
      
      // Если есть номер заказа в URL, открываем модальное окно
      if (orderNumber) {
        if (!isModalOpen) {
          openModal();
        }
      }
    } else {
      // Если мы не на странице заказа, закрываем модальное окно
      if (isModalOpen) {
        closeModal();
      }
    }
  }, [location.pathname, isModalOpen, openModal, closeModal]);

  return (
    <div className={styles.container}>
        <h1 className="text text_type_main-large">
            Лента заказов
        </h1>

        <div className={styles.content}>
            <div className={styles.feed_column}>
                <OrderFeed />
            </div>
            <div className={styles.stats_column}>
                <OrderStats />
            </div>
        </div>

        {/* Модальное окно с деталями заказа */}
        {isModalOpen && (
            <Modal handleClose={handleCloseModal}>
                <OrderDetails />
            </Modal>
        )}
    </div>
  );
}

