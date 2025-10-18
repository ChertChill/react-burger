import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styles from './app.module.css';
import Loader from '../loader/loader';
import AppHeader from '../app-header/app-header';
import MobileRestriction from '../mobile-restriction/mobile-restriction';
import Home from '../../pages/home';
import Login from '../../pages/auth/login';
import Register from '../../pages/auth/register';
import ForgotPassword from '../../pages/auth/forgot-password';
import ResetPassword from '../../pages/auth/reset-password';
import Profile from '../../pages/profile/profile';
import ProfileInfo from '../../pages/profile/profile-info/profile-info';
import IngredientDetailsPage from '../../pages/ingredient-details/ingredient-details';
import NotFound from '../../pages/not-found/not-found';
import Feed from '../../pages/feed/feed';
import OrderDetailsPage from '../../pages/order-details-page/order-details-page';
import OrderFeed from '../order-feed/order-feed';
import ProtectedRoute from '../protected-route/protected-route';
import { fetchIngredients } from '../../services/actions';
import { fetchUserData } from '../../services/actions/auth-actions';
import { authUtils } from '../../utils/tokenUtils';
import { useTypedSelector, useTypedDispatch } from '../../hooks';

/**
 * Главный компонент приложения - Burger Constructor
 * Управляет состоянием приложения, загружает данные об ингредиентах,
 * обрабатывает адаптивность и настройку роутинга
 */
export default function App(): React.JSX.Element {
    const dispatch = useTypedDispatch();
    
    const { ingredients, loading, error } = useTypedSelector((state) => state.ingredients);
    const { isAuthenticated } = useTypedSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState<boolean>(false);                // Состояние для определения мобильного устройства

    // Эффект для определения мобильного устройства
    useEffect(() => {
        const checkScreenSize = (): void => {
            setIsMobile(window.innerWidth < 1200);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Эффект для инициализации авторизации при загрузке приложения
    useEffect(() => {
        // Если есть токены в localStorage, но пользователь не авторизован в store,
        // загружаем данные пользователя

        if (authUtils.isAuthenticated() && !isAuthenticated) {
            dispatch(fetchUserData());
        }
    }, [dispatch, isAuthenticated]);

    // Эффект для загрузки данных об ингредиентах при монтировании компонента
    useEffect(() => {
        // Загружаем ингредиенты только если их еще нет и нет ошибки
        
        if (!ingredients || ingredients.length === 0) {
            dispatch(fetchIngredients());
        }
    }, [dispatch, ingredients])

    // Показываем ограничение для мобильных устройств
    if (isMobile) {
        return <MobileRestriction />;
    }

    return (
        <div className={styles.container}>
            {/* Шапка приложения с навигацией */}
            <AppHeader />

            <main className={`${styles.group} pt-10 pr-5 pl-5`}>
            
            {/* Отображение ошибки при неудачной загрузке */}
            {error && 
                <p className={`${styles.error__text} text text_type_main-default text_color_inactive`}>
                    Ошибка при получении ингредиентов: {error}
                </p>
            }

            {/* Основной контент приложения */}
            {!loading && !error && ingredients && ingredients.length > 0 ? (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/feed/:number" element={<OrderDetailsPage />} />
                    <Route path="/profile/orders/:number" element={
                        <ProtectedRoute requireAuth={true}>
                            <OrderDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute requireAuth={true}>
                            <Profile />
                        </ProtectedRoute>
                    }>
                        <Route index element={<ProfileInfo />} />
                        <Route path="orders" element={<OrderFeed showStatus={true} />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            ) : (
                <Loader size="medium" />
            )}
            </main>
        </div>
    );
}
