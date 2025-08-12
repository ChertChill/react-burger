import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from './burger-ingredients.module.css';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import CategoryBlock from "../category-block/category-block";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";

/**
 * Компонент для отображения списка ингредиентов
 * Содержит табы для переключения между категориями (булки, соусы, начинки),
 * автоматически переключает активный таб при скролле и позволяет
 * просматривать детали ингредиентов в модальном окне
 */
export default function BurgerIngredients({ingredients}) {
    const [current, setCurrent] = useState('bun');                          // Состояние активного таба
    const [selectedIngredient, setSelectedIngredient] = useState(null);     // Состояние выбранного ингредиента для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);                  // Состояние открытия модального окна

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
     */
    const handleContainerScroll = React.useCallback(() => {
        const containerTop = containerRef.current.getBoundingClientRect().top;

        let closestCategory = 'bun';
        let minDelta = Infinity;

        for (const item in categoryRefs) {
            const delta = Math.abs(categoryRefs[item].current.getBoundingClientRect().top - containerTop);

            if (delta < minDelta) {
                minDelta = delta;
                closestCategory = item;
            }
        }

        setCurrent(closestCategory);
    }, [categoryRefs]);

    /**
     * Обработчик клика по ингредиенту
     * Открывает модальное окно с деталями ингредиента
     * @param {Object} ingredient - объект ингредиента
     */
    const handleIngredientClick = (ingredient) => {
        setSelectedIngredient(ingredient);
        setIsModalOpen(true);
    };

    /**
     * Функция для закрытия модального окна
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedIngredient(null);
    };

    // Эффект для добавления слушателя скролла
    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', handleContainerScroll);

        return () => {
            container.removeEventListener('scroll', handleContainerScroll);
        }
    }, [handleContainerScroll]);

    return (
        <section className={styles.group}>

            {/* Заголовок секции */}
            <h1 className="text text_type_main-large">
                Соберите бургер
            </h1>

            {/* Навигационные табы */}
            <nav className="mt-5" style={{ display: 'flex' }}>
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
                
            </div>

            {/* Модальное окно с деталями ингредиента */}

            {isModalOpen && selectedIngredient && (
                <Modal 
                    title="Детали ингредиента" 
                    handleClose={handleCloseModal}
                >
                    <IngredientDetails ingredient={selectedIngredient} />
                </Modal>
            )}
            
        </section>
    )
}

BurgerIngredients.propTypes = {
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