import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import styles from './app-header.module.css';
import { BurgerIcon, ListIcon, Logo, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { IRootState } from '../../utils/types';

/**
 * Компонент шапки приложения
 * Содержит навигационное меню с переключением между разделами:
 * - Конструктор бургеров
 * - Лента заказов  
 * - Личный кабинет
 */
export default function AppHeader(): React.JSX.Element {
    // Состояние для отслеживания наведения на элементы навигации
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state: IRootState) => state.auth);

    /**
     * Функция для переключения состояния наведения
     * @param name - название элемента навигации
     */
    const toggleHovered = (name: string | null): void => {
        setHoveredItem(name);
    }

    /**
     * Функция для определения активного состояния элемента на основе URL
     * @param path - путь для проверки
     * @returns активен ли элемент
     */
    const isItemActive = (path: string): boolean => {
        // Если элемент находится в состоянии hover, он активен
        if (hoveredItem === path) {
            return true;
        }

        // Для профиля (аутентифицированный пользователь) проверяем все связанные маршруты
        if (path === '/profile') {
            return location.pathname === '/profile' || 
                   location.pathname.startsWith('/profile/');
        }

        // Для страницы входа (неаутентифицированный пользователь) проверяем страницы аутентификации
        if (path === '/login') {
            return location.pathname === '/login' ||
                   location.pathname === '/register' ||
                   location.pathname === '/forgot-password' ||
                   location.pathname === '/reset-password';
        }

        // Для остальных маршрутов проверяем точное совпадение
        return location.pathname === path;
    }

    return (
        <header className={`${styles.header} pt-4 pb-4`}>
            <nav className={styles.nav__menu}>

                {/* Левая часть навигации */}

                <div className={styles.nav__menu__left}>
                    {/* Ссылка на конструктор бургеров */}
                    <Link 
                        to="/"
                        className={`${styles.nav__item} pt-4 pr-5 pb-4 pl-5`} 
                        onMouseEnter={() => toggleHovered('/')}
                        onMouseLeave={() => toggleHovered(null)}
                    >
                        <BurgerIcon type={isItemActive('/') ? 'primary' : 'secondary'} />
                        <p className={`text text_type_main-default ml-2 ${isItemActive('/') ? '' : 'text_color_inactive'}`}>
                            Конструктор
                        </p>
                    </Link>

                    {/* Ссылка на ленту заказов */}
                    <Link 
                        to="/feed"
                        className={`${styles.nav__item} pt-4 pr-5 pb-4 pl-5`} 
                        onMouseEnter={() => toggleHovered('/feed')}
                        onMouseLeave={() => toggleHovered(null)}
                    >
                        <ListIcon type={isItemActive('/feed') ? 'primary' : 'secondary'} />
                        <p className={`text text_type_main-default ml-2 ${isItemActive('/feed') ? '' : 'text_color_inactive'}`}>
                            Лента заказов
                        </p>
                    </Link>
                </div>
                
                {/* Центральный логотип */}
                <Link to="/" className={`${styles.nav__item} ${styles.nav__item__logo}`}>
                    <Logo />
                </Link>

                {/* Правая часть навигации */}

                <div className={styles.nav__menu__right}>
                    {/* Ссылка на личный кабинет или страницу входа */}
                    <Link 
                        to={isAuthenticated ? "/profile" : "/login"}
                        className={`${styles.nav__item} pt-4 pr-5 pb-4 pl-5`} 
                        onMouseEnter={() => toggleHovered(isAuthenticated ? '/profile' : '/login')}
                        onMouseLeave={() => toggleHovered(null)}
                    >
                        <ProfileIcon type={isItemActive(isAuthenticated ? '/profile' : '/login') ? 'primary' : 'secondary'} />
                        <p className={`text text_type_main-default ml-2 ${isItemActive(isAuthenticated ? '/profile' : '/login') ? '' : 'text_color_inactive'}`}>
                            {isAuthenticated ? (user?.name || 'Личный кабинет') : 'Войти'}
                        </p>
                    </Link>
                </div>
                
            </nav>
        </header>
    )
}
