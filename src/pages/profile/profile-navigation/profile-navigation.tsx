import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../services/actions/auth-actions';
import { 
  TIsLinkActiveFunction, 
  TGetTooltipTextFunction, 
  THandleLogoutFunction
} from '../../../utils/types';
import styles from './profile-navigation.module.css';

/**
 * Компонент навигации профиля
 */
const ProfileNavigation: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch<any>();
    // Используем any для useDispatch из-за несовместимости типов Redux actions с TypeScript
    // Существующие actions написаны на JavaScript и не имеют полной типизации

    /**
     * Функция для определения активного состояния ссылки
     * @param path - путь для проверки
     * @returns активна ли ссылка
     */
    const isLinkActive: TIsLinkActiveFunction = (path: string): boolean => {
        if (path === '/profile/orders') {
            // Для истории заказов считаем активной как /profile/orders, так и /profile/orders/:number
            return location.pathname === '/profile/orders' || location.pathname.startsWith('/profile/orders/');
        }
        return location.pathname === path;
    }

    /**
     * Функция для получения текста подсказки в зависимости от активной страницы
     * @returns текст подсказки
     */
    const getTooltipText: TGetTooltipTextFunction = (): string => {
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
    const handleLogout: THandleLogoutFunction = async (): Promise<void> => {
        try {
            await dispatch(logout());
            // Навигация происходит автоматически через ProtectedRoute
            // при изменении isAuthenticated на false
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
        }
    };

    return (
        <div className={`${styles.navigationContainer} mt-20`}>
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
};

export default ProfileNavigation;
