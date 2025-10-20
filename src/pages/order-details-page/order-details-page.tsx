import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './order-details-page.module.css';
import OrderDetails from '../../components/order-details/order-details';

/**
 * Страница деталей заказа
 * Отображается только при прямом переходе по URL (без background state)
 */
export default function OrderDetailsPage(): React.JSX.Element | null {
    const location = useLocation();

    // Если есть background state, значит мы пришли из списка заказов
    // В этом случае модальное окно будет показано в App компоненте
    if ((location.state as any)?.background) {
        return null;
    }

    // Если пришли напрямую по ссылке, показываем отдельную страницу
    return (
        <div className={styles.container}>
            <OrderDetails />
        </div>
    );
}
