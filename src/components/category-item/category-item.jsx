import React from "react";
import PropTypes from 'prop-types';
import styles from './category-item.module.css';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

/**
 * Компонент элемента категории ингредиентов
 * Отображает отдельный ингредиент с изображением, ценой, названием
 * и счетчиком количества. При клике открывает модальное окно с деталями
 */
export default function CategoryItem({ item, onIngredientClick }) {
    /**
     * Обработчик клика по ингредиенту
     * Вызывает функцию для открытия модального окна с деталями
     */
    const handleClick = () => {
        if (onIngredientClick) {
            onIngredientClick(item);
        }
    };

    return (
        <div className={styles.item} key={item._id} onClick={handleClick}>
            
            {/* Счетчик количества ингредиентов в заказе */}
            <Counter count={1} size="default" extraClass="m-1" />

            {/* Изображение ингредиента */}
            <img src={item.image} alt={item.name} />

            {/* Блок с ценой и иконкой валюты */}
            <div className={styles.price}>
                <p className="text text_type_digits-default">
                    {item.price}
                </p>

                <CurrencyIcon type="primary" />
            </div>

            {/* Название ингредиента */}
            <p className="text text_type_main-default">
                {item.name}
            </p>
            
        </div>
    )
}

CategoryItem.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
        proteins: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        carbohydrates: PropTypes.number.isRequired,
        calories: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        image_mobile: PropTypes.string,
        image_large: PropTypes.string,
        __v: PropTypes.number
    }).isRequired,
    onIngredientClick: PropTypes.func.isRequired
};