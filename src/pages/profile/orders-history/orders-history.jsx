import React from 'react';
import styles from './orders-history.module.css';

/**
 * Компонент истории заказов
 */
export default function OrdersHistory() {
    return (
        <div className={styles.ordersHistory}>
            <h1 className="text text_type_main-large mb-6">История заказов</h1>
            <p className="text text_type_main-default text_color_inactive">
                Здесь будет список заказов пользователя
            </p>
        </div>
    );
}
