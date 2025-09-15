import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import styles from './burger-constructor.module.css';
import { ConstructorElement, Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';
import { useModal } from '../../hooks';
import { createOrder, clearOrder, addIngredientToConstructor, setBun, removeIngredientFromConstructor, clearConstructor, saveConstructorState, restoreConstructorState } from '../../services/actions';
import DraggableConstructorItem from './draggable-constructor-item';

/**
 * Компонент конструктора бургеров
 * Отображает выбранные ингредиенты в виде конструктора,
 * позволяет оформить заказ и показывает итоговую стоимость
 */
export default function BurgerConstructor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { bun, constructorIngredients } = useSelector(state => state.constructor);
    const { loading: orderLoading, error: orderError, orderNumber } = useSelector(state => state.order);
    const { isAuthenticated } = useSelector(state => state.auth);
    const [hasOverflow, setHasOverflow] = useState(false);      // Состояние для отслеживания переполнения контейнера с ингредиентами
    const [orderTimer, setOrderTimer] = useState(0);            // Счетчик времени создания заказа
    const { isModalOpen, openModal, closeModal } = useModal();  // Кастомный хук для управления модальным окном
    
    // Ссылка на контейнер с ингредиентами для проверки переполнения
    const middleElementsRef = useRef(null);

    // Общая функция для обработки drop булки
    const handleBunDrop = (item) => {
        if (item.type === 'bun') {
            dispatch(setBun(item));
        }
    };

    // Drop функциональность для булки (верхняя)
    const [{ isOverBunTop }, dropBunTop] = useDrop({
        accept: 'ingredient',
        drop: handleBunDrop,
        collect: (monitor) => ({
            isOverBunTop: monitor.isOver(),
        }),
    });

    // Drop функциональность для булки (нижняя)
    const [{ isOverBunBottom }, dropBunBottom] = useDrop({
        accept: 'ingredient',
        drop: handleBunDrop,
        collect: (monitor) => ({
            isOverBunBottom: monitor.isOver(),
        }),
    });

    // Общее состояние для подсветки булок
    const isOverBun = isOverBunTop || isOverBunBottom;

    // Drop функциональность для начинок
    const [{ isOverMiddle }, dropMiddle] = useDrop({
        accept: 'ingredient',
        drop: (item) => {
            if (item.type !== 'bun') {
                dispatch(addIngredientToConstructor(item));
            }
        },
        collect: (monitor) => ({
            isOverMiddle: monitor.isOver(),
        }),
    });
    
    // Используем данные из Redux store с мемоизацией
    const chosenBun = useMemo(() => bun, [bun]);
    const chosenMiddleIngredients = useMemo(() => constructorIngredients, [constructorIngredients]);

    // Мемоизированный расчёт итоговой стоимости бургера
    const totalPrice = useMemo(() => {
        const bunPrice = chosenBun ? chosenBun.price * 2 : 0; // Булка учитывается дважды (верх и низ)
        const ingredientsPrice = chosenMiddleIngredients ? chosenMiddleIngredients.reduce((total, ingredient) => total + ingredient.price, 0) : 0;
        return bunPrice + ingredientsPrice;
    }, [chosenBun, chosenMiddleIngredients]);

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

    // Эффект для отслеживания времени создания заказа
    useEffect(() => {
        let interval;
        
        if (orderLoading) {
            setOrderTimer(0);
            interval = setInterval(() => {
                setOrderTimer(prev => {
                    const newTime = prev + 1;
                    // Если прошло 15 секунд, останавливаем счетчик
                    if (newTime >= 15) {
                        clearInterval(interval);
                        return 15;
                    }
                    return newTime;
                });
            }, 1000);
        } else {
            setOrderTimer(0);
        }
        
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [orderLoading]);

    // Эффект для восстановления состояния конструктора при загрузке приложения
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(restoreConstructorState(isAuthenticated));
        }
    }, [isAuthenticated, dispatch]);

    // Эффект для сохранения состояния конструктора при изменениях (только для авторизованных пользователей)
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(saveConstructorState(isAuthenticated));
        }
    }, [bun, constructorIngredients, isAuthenticated, dispatch]);

    // Эффект для открытия модального окна при успешном создании заказа
    useEffect(() => {
        if (orderNumber && !orderLoading && !orderError) {
            openModal();
            // Очищаем конструктор после успешного получения номера заказа
            dispatch(clearConstructor());
        }
    }, [orderNumber, orderLoading, orderError, openModal, dispatch]);

    /**
     * Обработчик клика по кнопке "Оформить заказ"
     * Проверяет авторизацию пользователя и создает заказ через API
     */
    const handleOrderClick = () => {
        // Если пользователь не авторизован, перенаправляем на страницу логина
        // с сохранением текущего пути для возврата после авторизации
        if (!isAuthenticated) {
            navigate('/login', { 
                state: { from: '/' },
                replace: false 
            });
            return;
        }
        
        // Если пользователь авторизован, создаем заказ
        dispatch(createOrder(bun, constructorIngredients));
    };

    /**
     * Функция для закрытия модального окна
     */
    const handleCloseModal = () => {
        closeModal();
        dispatch(clearOrder());
    };

    /**
     * Обработчик удаления ингредиента из конструктора
     */
    const handleRemoveIngredient = (index, ingredientId) => {
        dispatch(removeIngredientFromConstructor(index, ingredientId));
    };

    return (
        <section className={`${styles.group} pt-15`}>

            {/* Верхняя булка */}
            <div 
                ref={dropBunTop}
                className={`${styles['drop-zone']} ${isOverBun && chosenBun ? styles['drop-target'] : ''}`}
            >
                <div className={styles.element__bun}>
                    {chosenBun ? (
                        <ConstructorElement
                            type="top"
                            isLocked={true}
                            text={chosenBun.name + ' (верх)'}
                            price={chosenBun.price}
                            thumbnail={chosenBun.image}
                        />
                    ) : (
                        <div className={`${styles.placeholder} ${isOverBun ? styles['placeholder-active'] : ''}`}>
                            <p className="text text_type_main-default text_color_inactive">
                                Выберите булку
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Контейнер с начинкой и соусом бургера */}
            <div 
                ref={(node) => {
                    middleElementsRef.current = node;
                    dropMiddle(node);
                }}
                className={`${styles['drop-zone']} ${styles.middle__elements} ${hasOverflow ? styles.overflow : ''} ${isOverMiddle && chosenMiddleIngredients && chosenMiddleIngredients.length > 0 ? styles['drop-target'] : ''}`}
            >
                {chosenMiddleIngredients && chosenMiddleIngredients.length > 0 ? (
                    chosenMiddleIngredients.map((ingredient, index) => (
                        <DraggableConstructorItem 
                            key={ingredient.id} 
                            ingredient={ingredient} 
                            index={index}
                            onRemove={handleRemoveIngredient}
                        />
                    ))
                ) : (
                    <div className={`${styles.placeholder} ${isOverMiddle ? styles['placeholder-active'] : ''}`}>
                        <p className="text text_type_main-default text_color_inactive">
                            Выберите начинку
                        </p>
                    </div>
                )}
            </div>

            {/* Нижняя булка */}
            <div 
                ref={dropBunBottom}
                className={`${styles['drop-zone']} ${isOverBun && chosenBun ? styles['drop-target'] : ''}`}
            >
                <div className={styles.element__bun}>
                    {chosenBun ? (
                        <ConstructorElement
                            type="bottom"
                            isLocked={true}
                            text={chosenBun.name + ' (низ)'}
                            price={chosenBun.price}
                            thumbnail={chosenBun.image}
                        />
                    ) : (
                        <div className={`${styles.placeholder} ${isOverBun ? styles['placeholder-active'] : ''}`}>
                            <p className="text text_type_main-default text_color_inactive">
                                Выберите булку
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Отображение ошибки заказа */}
            {orderError && (
                <div className={`${styles.error}`}>
                    <p className="text text_type_main-default text_color_error">
                        {orderError}
                    </p>
                </div>
            )}

            {/* Блок с итоговой стоимостью и кнопкой заказа */}

            {(chosenBun || (chosenMiddleIngredients && chosenMiddleIngredients.length > 0)) &&
                <>
                    <div className={`${styles.bill} mt-6`}>
                        
                        {/* Отображение общей стоимости */}
                        <div className={styles.bill__sum}>
                            <p className="text text_type_digits-medium">
                                {totalPrice}
                            </p>

                            <CurrencyIcon type="primary" />
                        </div>

                        {/* Кнопка оформления заказа */}
                        <Button 
                            htmlType="button" 
                            type="primary" 
                            size="large" 
                            onClick={handleOrderClick}
                            disabled={orderLoading}
                        >
                            {orderLoading ? 'Оформление...' : 'Оформить заказ'}
                        </Button>
                    </div>

                    {/* Прелоадер и счетчик времени */}
                    {orderLoading && (
                        <div className={styles.loader__row}>
                            <div className={styles.dotsLoader}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                            
                            <p className="text text_type_main-small text_color_inactive">
                                Создаем заказ... {orderTimer}/15 сек
                            </p>
                        </div>
                    )}
                </>
            }

            {/* Модальное окно с деталями заказа */}

            {isModalOpen && (
                <Modal title="" handleClose={handleCloseModal}>
                    <OrderDetails />
                </Modal>
            )}

        </section>
    )
}