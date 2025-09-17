import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../services/actions/auth-actions';
import styles from './profile-navigation.module.css';

/**
 * Компонент навигации профиля
 */
export default function ProfileNavigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     * Функция для определения активного состояния ссылки
     * @param {string} path - путь для проверки
     * @returns {boolean} - активна ли ссылка
     */
    const isLinkActive = (path) => {
        return location.pathname === path;
    }

    /**
     * Функция для получения текста подсказки в зависимости от активной страницы
     * @returns {string} - текст подсказки
     */
    const getTooltipText = () => {
        if (isLinkActive('/profile')) {
            return 'В этом разделе вы можете изменить свои персональные данные';
        } else if (isLinkActive('/profile/orders')) {
            return 'В этом разделе вы можете просмотреть свою историю заказов';
        }
        return '';
    }

    /**
     * Обработчик выхода из системы
     */
    const handleLogout = async () => {
        try {
            await dispatch(logout());
            // Навигация происходит автоматически через ProtectedRoute
            // при изменении isAuthenticated на false
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
        }
    };

    return (
        <div className={styles.navigationContainer}>
            <nav className={styles.navigation}>
                <Link 
                    to="/profile" 
                    className={`${styles.navLink} text text_type_main-medium ${isLinkActive('/profile') ? styles.navLinkActive : 'text_color_inactive'}`}
                >
                    Профиль
                </Link>
                <Link 
                    to="/profile/orders" 
                    className={`${styles.navLink} text text_type_main-medium ${isLinkActive('/profile/orders') ? styles.navLinkActive : 'text_color_inactive'}`}
                >
                    История заказов
                </Link>
                <button 
                    onClick={handleLogout}
                    className={`${styles.navLink} text text_type_main-medium text_color_inactive`}
                >
                    Выход
                </button>
            </nav>
            
            {/* Подсказка под навигацией */}
            {getTooltipText() && (
                <p className={`${styles.tooltip} text text_type_main-default text_color_inactive mt-20`}>
                    {getTooltipText()}
                </p>
            )}
        </div>
    );
}
