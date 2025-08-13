import React from "react";
import PropTypes from 'prop-types';
import styles from './category-block.module.css';
import CategoryItem from '../category-item/category-item';
import { IngredientType } from '../../utils/types';

/**
 * Компонент блока категории ингредиентов
 * Отображает заголовок категории и список ингредиентов данной категории
 * Использует forwardRef для передачи ссылки на родительский компонент
 */
const CategoryBlock = React.forwardRef(({ title, items, onIngredientClick }, ref) => {
    return (
        <div ref={ref} className={`${styles.container}`}>

            {/* Заголовок категории */}
            <p className="text text_type_main-medium">
                {title}
            </p>

            {/* Контейнер с ингредиентами категории */}
            <div className={`${styles.group} mt-6 pr-4 pl-4`}>

                {/* Рендер списка ингредиентов */}
                {items.map((item) => (
                    <CategoryItem 
                        key={item._id} 
                        item={item} 
                        onIngredientClick={onIngredientClick}
                    />
                ))}

            </div>
            
        </div>
    )
});

CategoryBlock.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(IngredientType).isRequired,
    onIngredientClick: PropTypes.func.isRequired
};

export default CategoryBlock;