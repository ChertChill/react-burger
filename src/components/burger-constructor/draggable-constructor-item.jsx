import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch } from 'react-redux';
import { moveIngredient } from '../../services/actions';
import { ConstructorIngredientType } from '../../utils/types';
import styles from './burger-constructor.module.css';

/**
 * Компонент перетаскиваемого элемента конструктора
 * Позволяет перетаскивать ингредиенты внутри конструктора для изменения их порядка
 * Объединяет функциональность drag & drop с отображением ингредиента
 */
const DraggableConstructorItem = ({ ingredient, index, onRemove }) => {
    const dispatch = useDispatch();
    const ref = useRef(null);

    /**
     * Хук для drop функциональности
     * Обрабатывает наведение других элементов на текущий элемент
     * Выполняет перемещение при достижении определенных условий
     */
    const [{ handlerId }, drop] = useDrop({
        accept: 'constructor-item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Не выполняем операцию, если элемент наведен на самого себя
            if (dragIndex === hoverIndex) {
                return;
            }

            // Определяем границы элемента
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Перетаскиваем вниз
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Перетаскиваем вверх
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Выполняем перемещение
            dispatch(moveIngredient(dragIndex, hoverIndex));
            item.index = hoverIndex;
        },
    });

    /**
     * Хук для drag функциональности
     * Позволяет перетаскивать текущий элемент
     * Отслеживает состояние перетаскивания для визуальной обратной связи
     */
    const [{ isDragging }, drag] = useDrag({
        type: 'constructor-item',
        item: () => {
            return { id: ingredient.id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            // Если элемент был брошен за пределы контейнера, ничего не делаем
            if (!monitor.didDrop()) {
                return;
            }
        },
        isDragging: (monitor) => {
            return monitor.getItem().id === ingredient.id;
        },
    });

    /**
     * Эффект для управления CSS классом dragging на body
     * Добавляет/убирает класс при изменении состояния перетаскивания
     * Используется для глобальных стилей курсора
     */
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

    // Объединяем drag и drop refs для одного элемента
    drag(drop(ref));

    return (
        <div 
            ref={ref} 
            className={`${styles.element} ${isDragging ? styles.dragging : ''}`}
            data-handler-id={handlerId}
            data-dragging={isDragging}
        >
            {/* Иконка перетаскивания */}
            <DragIcon type="primary" />
            
            {/* Элемент конструктора с информацией об ингредиенте */}
            <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
                handleClose={() => onRemove(index, ingredient._id)}
            />
        </div>
    );
};

DraggableConstructorItem.propTypes = {
    ingredient: ConstructorIngredientType.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default DraggableConstructorItem;
