import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styles from './burger-ingredients.module.css';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import CategoryBlock from "../category-block/category-block";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { useModal } from '../../hooks';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/actions';

/**
 * Компонент для отображения списка ингредиентов
 * Содержит табы для переключения между категориями (булки, соусы, начинки),
 * автоматически переключает активный таб при скролле и позволяет
 * просматривать детали ингредиентов в модальном окне
 */
export default function BurgerIngredients() {
    const dispatch = useDispatch();
    
    const { ingredients } = useSelector(state => state.ingredients);
    const [current, setCurrent] = useState('bun');                          // Состояние активного таба
    const { isModalOpen, openModal, closeModal } = useModal();              // Кастомный хук для управления модальным окном

    // Ссылки на контейнер и секции категорий для отслеживания скролла
    const containerRef = useRef(null);
    const bunRef = useRef(null);
    const sauceRef = useRef(null);
    const mainRef = useRef(null);

    // Мемоизированный объект с ссылками на все категории
    const categoryRefs = React.useMemo(() => ({
        bun: bunRef,
        sauce: sauceRef,
        main: mainRef,
    }), [bunRef, sauceRef, mainRef]);

    /**
     * Обработчик клика по табу
     * Переключает активный таб и прокручивает к соответствующей секции
     * @param {string} name - название категории
     */
    const handleTabClick = (name) => {
        setCurrent(name);
        categoryRefs[name]?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Обработчик скролла контейнера
     * Автоматически определяет ближайшую категорию и переключает активный таб
     * Использует getBoundingClientRect для точного определения позиции заголовков
     */
    const handleContainerScroll = React.useCallback(() => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = containerRect.top;
        
        // Порог для определения активной категории (в пикселях от верха контейнера)
        const threshold = 50;

        let activeCategory = 'bun';
        let minDistance = Infinity;

        // Проверяем каждую категорию
        Object.entries(categoryRefs).forEach(([categoryName, ref]) => {
            if (!ref.current) return;

            const categoryRect = ref.current.getBoundingClientRect();
            const categoryTop = categoryRect.top;
            
            // Вычисляем расстояние от верха контейнера до заголовка категории
            const distanceFromTop = Math.abs(categoryTop - containerTop);
            
            // Если заголовок категории находится в видимой области или близко к верху
            if (categoryTop <= containerTop + threshold && distanceFromTop < minDistance) {
                minDistance = distanceFromTop;
                activeCategory = categoryName;
            }
        });

        // Если ни одна категория не подходит по критериям, выбираем ту, которая ближе всего к верху
        if (minDistance === Infinity) {
            Object.entries(categoryRefs).forEach(([categoryName, ref]) => {
                if (!ref.current) return;

                const categoryRect = ref.current.getBoundingClientRect();
                const distanceFromTop = Math.abs(categoryRect.top - containerTop);
                
                if (distanceFromTop < minDistance) {
                    minDistance = distanceFromTop;
                    activeCategory = categoryName;
                }
            });
        }

        setCurrent(activeCategory);
    }, [categoryRefs]);

    /**
     * Обработчик клика по ингредиенту
     * Открывает модальное окно с деталями ингредиента
     * @param {Object} ingredient - объект ингредиента
     */
    const handleIngredientClick = (ingredient) => {
        dispatch(setCurrentIngredient(ingredient));
        openModal();
    };



    /**
     * Функция для закрытия модального окна
     */
    const handleCloseModal = () => {
        closeModal();
        dispatch(clearCurrentIngredient());
    };

    // Эффект для добавления слушателя скролла
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Добавляем throttling для оптимизации производительности
        let ticking = false;
        
        const throttledScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleContainerScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        container.addEventListener('scroll', throttledScrollHandler);

        return () => {
            container.removeEventListener('scroll', throttledScrollHandler);
        }
    }, [handleContainerScroll]);

    return (
        <section className={styles.group}>

            {/* Заголовок секции */}
            <h1 className="text text_type_main-large">
                Соберите бургер
            </h1>

            {/* Навигационные табы */}
            <nav className={`${styles.nav__tabs} mt-5`}>
                <Tab value="bun" active={current === 'bun'} onClick={() => handleTabClick('bun')}>
                    Булки
                </Tab>
                <Tab value="sauce" active={current === 'sauce'} onClick={() => handleTabClick('sauce')}>
                    Соусы
                </Tab>
                <Tab value="main" active={current === 'main'} onClick={() => handleTabClick('main')}>
                    Начинки
                </Tab>
            </nav>

            {/* Контейнер с категориями ингредиентов */}
            <div ref={containerRef} className={`${styles.categories__group} mt-10`}>
                
                {ingredients && ingredients.length > 0 && (
                    <>
                        {/* Секция с булками */}
                        <CategoryBlock 
                            ref={bunRef} 
                            title="Булки" 
                            items={ingredients.filter((item) => item.type === 'bun')} 
                            onIngredientClick={handleIngredientClick}
                        />

                        {/* Секция с соусами */}
                        <CategoryBlock 
                            ref={sauceRef} 
                            title="Соусы" 
                            items={ingredients.filter((item) => item.type === 'sauce')} 
                            onIngredientClick={handleIngredientClick}
                        />

                        {/* Секция с начинками */}
                        <CategoryBlock 
                            ref={mainRef} 
                            title="Начинки" 
                            items={ingredients.filter((item) => item.type === 'main')} 
                            onIngredientClick={handleIngredientClick}
                        />
                    </>
                )}
                
            </div>

            {/* Модальное окно с деталями ингредиента */}
            {isModalOpen && (
                <Modal 
                    title="Детали ингредиента" 
                    handleClose={handleCloseModal}
                >
                    <IngredientDetails />
                </Modal>
            )}
            
        </section>
    )
}