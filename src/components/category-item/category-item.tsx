import React from "react";
import { useDrag } from 'react-dnd';
import styles from './category-item.module.css';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { ICategoryItemProps, IDragItem } from '../../utils/types';

/**
 * Компонент элемента категории ингредиентов
 * Отображает отдельный ингредиент с изображением, ценой, названием
 * и счетчиком количества. При клике открывает модальное окно с деталями
 */
const CategoryItem: React.FC<ICategoryItemProps> = ({ item, onIngredientClick }) => {
    /**
     * Хук для drag & drop функциональности
     * Позволяет перетаскивать ингредиент в конструктор бургера
     * Отслеживает состояние перетаскивания для визуальной обратной связи
     */
    const [{ isDragging }, drag] = useDrag<IDragItem, void, { isDragging: boolean }>({
        type: 'ingredient',
        item: (): IDragItem => ({ ...item, id: item._id, index: 0 }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Добавляем/убираем класс dragging к body при изменении состояния
    React.useEffect(() => {
        if (isDragging) {
            document.body.classList.add('dragging');
        } else {
            document.body.classList.remove('dragging');
        }

        return () => {
            document.body.classList.remove('dragging');
        };
    }, [isDragging]);
    
    /**
     * Обработчик клика по ингредиенту
     * Вызывает функцию для открытия модального окна с деталями
     */
    const handleClick = (): void => {
        if (onIngredientClick) {
            onIngredientClick(item);
        }
    };

    return (
        <div 
            // Используем as any для ref react-dnd из-за несовместимости типов
            // react-dnd требует гибкую типизацию для работы с различными drag элементами
            ref={drag as any}
            className={`${styles.item} ${isDragging ? styles.dragging : ''}`} 
            key={item._id} 
            onClick={handleClick} 
        >
            
            {/* Счетчик количества ингредиентов в заказе */}
            {(item.count && item.count > 0) && (
                <Counter count={item.count} size="default" extraClass="m-1" />
            )}

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

export default CategoryItem;
