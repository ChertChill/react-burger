import React from "react";
import styles from './nutrition-item.module.css';
import { INutritionItemProps } from '../../utils/types';

/**
 * Компонент элемента пищевой ценности
 * Отображает название питательного вещества и его значение
 * Используется в деталях ингредиента для показа калорий, белков, жиров, углеводов
 */
const NutritionItem: React.FC<INutritionItemProps> = ({ label, value }) => {
    return (
        <div className={styles.container}>

            {/* Название питательного вещества */}
            <p className="text text_type_main-default text_color_inactive">
                {label}
            </p>

            {/* Значение питательного вещества */}
            <p className="text text_type_digits-default text_color_inactive mt-2">
                {value}
            </p>
            
        </div>
    );
}

export default NutritionItem;
