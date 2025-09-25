import React from "react";
import styles from './category-block.module.css';
import CategoryItem from '../category-item/category-item';
import { ICategoryBlockProps } from '../../utils/types';

/**
 * Компонент блока категории ингредиентов
 * Отображает заголовок категории и список ингредиентов данной категории
 * Использует forwardRef для передачи ссылки на родительский компонент
 */
const CategoryBlock = React.forwardRef<HTMLDivElement, ICategoryBlockProps>(({ title, items, onIngredientClick }, ref) => {
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

CategoryBlock.displayName = 'CategoryBlock';

export default CategoryBlock;
