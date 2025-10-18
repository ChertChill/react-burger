import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './burger-ingredients.module.css';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import CategoryBlock from "../category-block/category-block";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { useModal, useTypedSelector, useTypedDispatch } from '../../hooks';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/actions';
import { IIngredient, TIngredientType, ICategoryRefs } from '../../utils/types';

/**
 * Компонент для отображения списка ингредиентов
 * Содержит табы для переключения между категориями (булки, соусы, начинки),
 * автоматически переключает активный таб при скролле и позволяет
 * просматривать детали ингредиентов в модальном окне при клике на ингредиент.
 * При клике на ингредиент происходит переход на маршрут /ingredients/:id,
 * который отображает модальное окно с деталями ингредиента.
 */
export default function BurgerIngredients(): React.JSX.Element {
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { ingredients } = useTypedSelector((state) => state.ingredients);
    const { currentIngredient } = useTypedSelector((state) => state.ingredientDetails);
    const [current, setCurrent] = useState<TIngredientType>('bun');                          // Состояние активного таба
    const { isModalOpen, openModal, closeModal } = useModal();              // Кастомный хук для управления модальным окном

    // Ссылки на контейнер и секции категорий для отслеживания скролла
    const containerRef = useRef<HTMLDivElement>(null);
    const bunRef = useRef<HTMLDivElement>(null);
    const sauceRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    // Мемоизированный объект с ссылками на все категории
    const categoryRefs: ICategoryRefs = React.useMemo(() => ({
        bun: bunRef,
        sauce: sauceRef,
        main: mainRef,
    }), [bunRef, sauceRef, mainRef]);

    /**
     * Обработчик клика по табу
     * Переключает активный таб и прокручивает к соответствующей секции
     * @param name - название категории
     */
    const handleTabClick = (name: TIngredientType): void => {
        setCurrent(name);
        categoryRefs[name]?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Обработчик скролла контейнера
     * Автоматически определяет ближайшую категорию и переключает активный таб
     * Использует getBoundingClientRect для точного определения позиции заголовков
     */
    const handleContainerScroll = React.useCallback((): void => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = containerRect.top;
        
        // Порог для определения активной категории (в пикселях от верха контейнера)
        const threshold = 50;

        let activeCategory: TIngredientType = 'bun';
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
                activeCategory = categoryName as TIngredientType;
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
                    activeCategory = categoryName as TIngredientType;
                }
            });
        }

        setCurrent(activeCategory);
    }, [categoryRefs]);

    /**
     * Обработчик клика по ингредиенту
     * Переходит на маршрут /ingredients/:id для отображения модального окна
     * @param ingredient - объект ингредиента
     */
    const handleIngredientClick = (ingredient: IIngredient): void => {
        // Используем as any для dispatch Redux actions из-за несовместимости типов
        // Существующие actions написаны на JavaScript и не имеют полной типизации
        dispatch(setCurrentIngredient(ingredient) as any);
        navigate(`/ingredients/${ingredient._id}`, { 
            state: { from: 'home' } 
        });
    };

    /**
     * Функция для закрытия модального окна
     * Возвращает пользователя на главную страницу и очищает данные ингредиента
     */
    const handleCloseModal = (): void => {
        closeModal();
        // Используем as any для dispatch Redux actions из-за несовместимости типов
        // Существующие actions написаны на JavaScript и не имеют полной типизации
        dispatch(clearCurrentIngredient() as any);
        navigate('/', { replace: true });
    };

    // Эффект для управления модальным окном при изменении маршрута
    useEffect(() => {
        const pathname = location.pathname;
        
        // Если мы находимся на странице ингредиента (/ingredients/:id)
        if (pathname.startsWith('/ingredients/') && pathname !== '/ingredients') {
            const ingredientId = pathname.split('/')[2];
            
            // Если есть ингредиент в store и он соответствует текущему маршруту
            if (currentIngredient && currentIngredient._id === ingredientId) {
                // Открываем модальное окно
                if (!isModalOpen) {
                    openModal();
                }
            }
        } else {
            // Если мы не на странице ингредиента, закрываем модальное окно
            if (isModalOpen) {
                closeModal();
                // Используем as any для dispatch Redux actions из-за несовместимости типов
                // Существующие actions написаны на JavaScript и не имеют полной типизации
                dispatch(clearCurrentIngredient() as any);
            }
        }
    }, [location.pathname, currentIngredient, isModalOpen, openModal, closeModal, dispatch]);

    // Эффект для добавления слушателя скролла
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Добавляем throttling для оптимизации производительности
        let ticking = false;
        
        const throttledScrollHandler = (): void => {
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
