import React, { useState } from "react";
import PropTypes from 'prop-types';
import styles from './app-header.module.css';
import { BurgerIcon, ListIcon, Logo, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';

/**
 * Компонент шапки приложения
 * Содержит навигационное меню с переключением между разделами:
 * - Конструктор бургеров
 * - Лента заказов  
 * - Личный кабинет
 */
export default function AppHeader({ activeSection, setActiveSection }) {
    // Состояние для отслеживания наведения на элементы навигации
    const [hoveredItem, setHoveredItem] = useState(null);

    /**
     * Функция для переключения состояния наведения
     * @param {string} name - название элемента навигации
     */
    const toggleHovered = (name) => {
        setHoveredItem(name || null);
    }

    /**
     * Функция для определения активного состояния элемента
     * @param {string} name - название элемента навигации
     * @returns {boolean} - активен ли элемент
     */
    const isItemActive = (name) => {
        return hoveredItem === name || activeSection === name;
    }
    
    /**
     * Обработчик клика по элементам навигации (тестовая реализация роутинга)
     * @param {Event} e - событие клика
     * @param {string} name - название раздела
     */
    const handleSectionClick = (e, name) => {
        e.preventDefault();
        setActiveSection(name);
    }

    return (
        <header className={`${styles.header} pt-4 pb-4`}>
            <nav className={styles.nav__menu}>

                {/* Левая часть навигации */}

                <div className={styles.nav__menu__left}>
                    {/* Ссылка на конструктор бургеров */}
                    <a 
                        className={`${styles.nav__item} pt-4 pr-5 pb-4 pl-5`} 
                        href="."
                        onMouseEnter={() => toggleHovered('burger')}
                        onMouseLeave={() => toggleHovered(null)}
                        onClick={(e) => handleSectionClick(e, 'burger')}
                    >
                        <BurgerIcon type={isItemActive('burger') ? 'primary' : 'secondary'} />
                        <p className={`text text_type_main-default ml-2 ${isItemActive('burger') ? '' : 'text_color_inactive'}`}>
                            Конструктор
                        </p>
                    </a>

                    {/* Ссылка на ленту заказов */}
                    <a 
                        className={`${styles.nav__item} pt-4 pr-5 pb-4 pl-5`} 
                        href="."
                        onMouseEnter={() => toggleHovered('orders')}
                        onMouseLeave={() => toggleHovered(null)}
                        onClick={(e) => handleSectionClick(e, 'orders')}
                    >
                        <ListIcon type={isItemActive('orders') ? 'primary' : 'secondary'} />
                        <p className={`text text_type_main-default ml-2 ${isItemActive('orders') ? '' : 'text_color_inactive'}`}>
                            Лента заказов
                        </p>
                    </a>
                </div>
                
                {/* Центральный логотип */}
                <a className={`${styles.nav__item} ${styles.nav__item__logo}`} href=".">
                    <Logo />
                </a>

                {/* Правая часть навигации */}

                <div className={styles.nav__menu__right}>
                    {/* Ссылка на личный кабинет */}
                    <a 
                        className={`${styles.nav__item} pt-4 pr-5 pb-4 pl-5`} 
                        href="."
                        onMouseEnter={() => toggleHovered('profile')}
                        onMouseLeave={() => toggleHovered(null)}
                        onClick={(e) => handleSectionClick(e, 'profile')}
                    >
                        <ProfileIcon type={isItemActive('profile') ? 'primary' : 'secondary'} />
                        <p className={`text text_type_main-default ml-2 ${isItemActive('profile') ? '' : 'text_color_inactive'}`}>
                            Личный кабинет
                        </p>
                    </a>
                </div>
                
            </nav>
        </header>
    )
}

AppHeader.propTypes = {
    activeSection: PropTypes.string.isRequired,
    setActiveSection: PropTypes.func.isRequired
};