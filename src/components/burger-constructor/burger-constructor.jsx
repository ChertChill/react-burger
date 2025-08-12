import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import styles from './burger-constructor.module.css';
import { ConstructorElement, Button, DragIcon, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';

/**
 * Компонент конструктора бургеров
 * Отображает выбранные ингредиенты в виде конструктора,
 * позволяет оформить заказ и показывает итоговую стоимость
 */
export default function BurgerConstructor({ingredients}) {
    const [hasOverflow, setHasOverflow] = useState(false);      // Состояние для отслеживания переполнения контейнера с ингредиентами
    const [isModalOpen, setIsModalOpen] = useState(false);      // Состояние для отслеживания открытия модального окна
    const [orderNumber, setOrderNumber] = useState(null);       // Состояние для хранения номера заказа
    
    // Ссылка на контейнер с ингредиентами для проверки переполнения
    const middleElementsRef = useRef(null);
    
    // Тестовые ингредиенты, позже заменю на логику получения (и выбора) ингредиентов
    const chosenIngredients = [ ingredients[0], ingredients[1], ingredients[6], ingredients[8], ingredients[13], ingredients[6], ingredients[8], ingredients[13] ];

    // Разделение ингредиентов на булку и начинку
    const chosenBun = chosenIngredients.find(ingredient => ingredient.type === 'bun') || null;
    const chosenMiddleIngredients = chosenIngredients.filter(ingredient => ingredient.type !== 'bun') || null;

    /**
     * Функция для проверки переполнения контейнера с ингредиентами
     * Устанавливает состояние hasOverflow для стилизации скролла
     */
    const checkOverflow = () => {
        if (middleElementsRef.current) {
            const element = middleElementsRef.current;
            const hasOverflowContent = element.scrollHeight > element.clientHeight;

            setHasOverflow(hasOverflowContent);
        }
    };

    // Эффект для проверки переполнения при изменении ингредиентов и размера окна
    useEffect(() => {
        checkOverflow();       
        window.addEventListener('resize', checkOverflow);
        
        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [chosenMiddleIngredients]);

    /**
     * Обработчик клика по кнопке "Оформить заказ"
     * Генерирует случайный номер заказа и открывает модальное окно
     */
    const handleOrderClick = () => {
        const randomOrderNumber = Math.floor(Math.random() * 1000000) + 100000;   // Тестовое рандомное число для заказа

        setOrderNumber(randomOrderNumber);
        setIsModalOpen(true);
    };

    /**
     * Функция для закрытия модального окна
     */
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className={`${styles.group} pt-15`}>

            {/* Верхняя булка */}
           
            {chosenBun &&
                <div className={styles.element__bun}>
                    <ConstructorElement
                        type="top"
                        isLocked={true}
                        text={chosenBun.name + ' (верх)'}
                        price={chosenBun.price}
                        thumbnail={chosenBun.image}
                    />
                </div>
            }

            {/* Контейнер с начинкой и соусом бургера */}

            {chosenMiddleIngredients &&
                <div 
                    ref={middleElementsRef}
                    className={`${styles.middle__elements} ${hasOverflow ? styles.overflow : ''}`}
                >
                    {chosenMiddleIngredients.map((ingredient, index) => (
                        <div key={index} className={styles.element}>
                            <DragIcon type="primary" />

                            <ConstructorElement
                                text={ingredient.name}
                                price={ingredient.price}
                                thumbnail={ingredient.image}
                            />
                        </div>
                    ))}
                </div>
            }

            {/* Нижняя булка */}

            {chosenBun &&
                <div className={styles.element__bun}>
                    <ConstructorElement
                        type="bottom"
                        isLocked={true}
                        text={chosenBun.name + ' (низ)'}
                        price={chosenBun.price}
                        thumbnail={chosenBun.image}
                    />
                </div>
            }

            {/* Блок с итоговой стоимостью и кнопкой заказа */}

            {(chosenBun || chosenMiddleIngredients) &&
                <div className={`${styles.bill} mt-6`}>
                    
                    {/* Отображение общей стоимости */}
                    <div className={styles.bill__sum}>
                        <p className="text text_type_digits-medium">
                            {(chosenBun ? chosenBun.price * 2 : 0) + chosenMiddleIngredients.reduce((total, ingredient) => total + ingredient.price, 0)}
                        </p>

                        <CurrencyIcon type="primary" />
                    </div>

                    {/* Кнопка оформления заказа */}
                    <Button htmlType="button" type="primary" size="large" onClick={handleOrderClick}>
                        Оформить заказ
                    </Button>
                </div>
            }

            {/* Сообщение при отсутствии ингредиентов */}
                
            {chosenIngredients.length === 0 && (
                <p className="text text_type_main-large">
                    Добавьте ингредиенты для бургера!
                </p>
            )}

            {/* Модальное окно с деталями заказа */}

            {isModalOpen && (
                <Modal title="" handleClose={closeModal}>
                    <OrderDetails orderNumber={orderNumber} />
                </Modal>
            )}

        </section>
    )
}

BurgerConstructor.propTypes = {
    ingredients: PropTypes.arrayOf(
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
    ).isRequired
};