import React from "react";
import PropTypes from 'prop-types';
import styles from './order-details.module.css';
import orderStatus from '../../images/order-status.png';

/**
 * Компонент деталей заказа
 * Отображается в модальном окне после оформления заказа
 * Показывает номер заказа, статус и сообщение о начале приготовления
 */
export default function OrderDetails({ orderNumber }) {
    return (
        <div className={`${styles.group} mt-4 mb-20`}>

            {/* Номер заказа */}
            <div className={styles.number}>
                <p className="text text_type_digits-large">
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

OrderDetails.propTypes = {
    orderNumber: PropTypes.number.isRequired
};
