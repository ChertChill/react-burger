import React from "react";
import { useTypedSelector } from '../../hooks';
import styles from './order-confirm.module.css';
import orderStatus from '../../images/order-status.png';

/**
 * Компонент подтверждения заказа
 * Отображается в модальном окне после оформления заказа
 * Показывает номер заказа, статус и сообщение о начале приготовления
 */
export default function OrderConfirm(): React.JSX.Element {
    const { orderNumber, loading, error } = useTypedSelector((state) => state.order);
    
    if (loading) {
        return (
            <div className={`${styles.group} mt-4 mb-20`}>
                <p className="text text_type_main-medium">
                    Оформление заказа...
                </p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`${styles.group} mt-4 mb-20`}>
                <p className="text text_type_main-medium text_color_error">
                    Ошибка: {error}
                </p>
            </div>
        );
    }
    
    return (
        <div 
            className={`${styles.group} mt-4 mb-20`}
            data-testid="order-confirm"
        >

            {/* Номер заказа */}
            <div className={styles.number}>
                <p 
                    className="text text_type_digits-large"
                    data-testid="order-number"
                >
                    {orderNumber}
                </p>
            </div>
            
            {/* Подпись к номеру заказа */}
            <p className="text text_type_main-medium mt-8">
                идентификатор заказа
            </p>

            {/* Иконка статуса заказа */}
            <img className={`${styles.icon} mt-15`} src={orderStatus} alt="Галочка подтверждения заказа" />
            
            {/* Основное сообщение о статусе */}
            <p className="text text_type_main-default mt-15">
                Ваш заказ начали готовить
            </p>
            
            {/* Дополнительная информация */}
            <p className="text text_type_main-default text_color_inactive mt-2">
                Дождитесь готовности на орбитальной станции
            </p>
            
        </div>
    );
}
