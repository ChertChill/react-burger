import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authUtils, resetPasswordUtils } from '../../utils/tokenUtils';
import Loader from '../loader/loader';
import { IProtectedRouteProps, IRootState } from '../../utils/types';

/**
 * Компонент для защиты маршрутов
 * Обеспечивает редиректы в зависимости от статуса авторизации пользователя
 * 
 * @param props - Свойства компонента
 * @param props.children - Дочерние элементы для рендера
 * @param props.requireAuth - Требуется ли авторизация для доступа к маршруту
 * @param props.requireGuest - Требуется ли отсутствие авторизации для доступа к маршруту
 * @param props.requireResetFlag - Требуется ли флаг доступа к reset-password
 * @param props.redirectTo - Путь для редиректа (по умолчанию '/login' для защищенных маршрутов)
 */
const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ 
    children, 
    requireAuth = false, 
    requireGuest = false,
    requireResetFlag = false,
    redirectTo = null 
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading } = useSelector((state: IRootState) => state.auth);

    useEffect(() => {
        // Не выполняем редиректы пока идет загрузка
        if (isLoading) {
            return;
        }

        // Проверяем авторизацию через Redux store и localStorage
        const isUserAuthenticated = isAuthenticated && authUtils.isAuthenticated();

        // Если маршрут требует авторизации, но пользователь не авторизован
        if (requireAuth && !isUserAuthenticated) {
            // Сохраняем текущий путь для редиректа после авторизации
            const from = location.pathname;
            const redirectPath = redirectTo || '/login';
            navigate(redirectPath, { 
                state: { from },
                replace: true 
            });
            return;
        }

        // Если маршрут требует отсутствия авторизации, но пользователь авторизован
        if (requireGuest && isUserAuthenticated) {
            // Редиректим на главную страницу или на страницу, с которой пришел пользователь
            const from = location.state?.from || '/';
            navigate(from, { replace: true });
            return;
        }

        // Если маршрут требует флаг доступа к reset-password
        if (requireResetFlag && !resetPasswordUtils.isResetPasswordAllowed()) {
            navigate('/forgot-password', { replace: true });
            return;
        }

    }, [isAuthenticated, isLoading, location, navigate, requireAuth, requireGuest, requireResetFlag, redirectTo]);

    // Показываем загрузку пока проверяем авторизацию
    if (isLoading) {
        return <Loader size="medium" />;
    }

    // Проверяем авторизацию через Redux store и localStorage
    const isUserAuthenticated = isAuthenticated && authUtils.isAuthenticated();

    // Если маршрут требует авторизации, но пользователь не авторизован - не рендерим
    if (requireAuth && !isUserAuthenticated) {
        return null;
    }

    // Если маршрут требует отсутствия авторизации, но пользователь авторизован - не рендерим
    if (requireGuest && isUserAuthenticated) {
        return null;
    }

    // Если маршрут требует флаг доступа к reset-password, но флаг не установлен - не рендерим
    if (requireResetFlag && !resetPasswordUtils.isResetPasswordAllowed()) {
        return null;
    }

    // Рендерим защищенный контент
    return <>{children}</>;
}

export default ProtectedRoute;
