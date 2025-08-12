import React from "react";
import PropTypes from 'prop-types';
import styles from './category-block.module.css';
import CategoryItem from '../category-item/category-item';

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
    items: PropTypes.arrayOf(
        PropTypes.shape({
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
        })
    ).isRequired,
    onIngredientClick: PropTypes.func.isRequired
};

export default CategoryBlock;