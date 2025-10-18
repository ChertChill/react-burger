import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './order-details-page.module.css';
import OrderDetails from '../../components/order-details/order-details';
import Feed from '../feed/feed';
import Profile from '../profile/profile';
import { ILocationState } from '../../utils/types';

/**
 * Единая страница деталей заказа
 * Определяет, показывать ли модальное окно поверх соответствующей страницы
 * или отдельную страницу в зависимости от того, откуда пришел пользователь
 */
export default function OrderDetailsPage(): React.JSX.Element {
    const location = useLocation();

    // Если пришли с ленты заказов (через клик на заказ), показываем ленту с модальным окном
    if ((location.state as ILocationState)?.from === 'feed') {
        return <Feed />;
    }

    // Если пришли с профиля (через клик на заказ), показываем профиль с модальным окном
    if ((location.state as ILocationState)?.from === 'profile') {
        return <Profile />;
    }

    // Если пришли напрямую по ссылке, показываем отдельную страницу
    return (
        <div className={styles.container}>
            <OrderDetails />
        </div>
    );
}
