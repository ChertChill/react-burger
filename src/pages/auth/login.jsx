import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { login } from '../../services/actions/auth-actions';
import { clearAuthError } from '../../services/actions/auth-actions';
import { getErrorText } from '../../utils/getErrorText';
import ProtectedRoute from '../../components/protected-route/protected-route';
import styles from './auth.module.css';

/**
 * Страница авторизации пользователя
 */
export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, error } = useSelector(state => state.auth);
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Очищаем ошибки при монтировании компонента
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    // Сохраняем значения при ошибке для восстановления
    const [savedValues, setSavedValues] = useState(null);
    
    useEffect(() => {
        if (error && savedValues) {
            // Восстанавливаем значения при ошибке
            setFormData(savedValues);
            setSavedValues(null);
        }
    }, [error, savedValues]);

    /**
     * Обработчик изменения полей формы
     * @param {Event} e - событие изменения
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Обработчик отправки формы
     * @param {Event} e - событие отправки
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            return;
        }

        // Сохраняем значения перед отправкой
        setSavedValues({ ...formData });

        try {
            await dispatch(login(formData.email, formData.password));
            // После успешной авторизации пользователь будет перенаправлен через ProtectedRoute
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
        }
    };

    // Эффект для переадресации после успешной авторизации
    useEffect(() => {
        if (isAuthenticated) {
            // Получаем путь для возврата из state или используем главную страницу
            const from = location.state?.from || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location.state]);

    return (
        <ProtectedRoute requireGuest={true}>
            <div className={styles.container}>
                <h1 className={`${styles.title} text text_type_main-medium`}>
                    Вход
                </h1>
                
                {error && (
                    <div className={`${styles.error} mt-2`}>
                        <p className={`${styles.text} text text_type_main-default`}>
                            {getErrorText(error)}
                        </p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className={`${styles.form} mt-6`}>
                    <div className={styles.input}>
                        <EmailInput
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            error={!!error}
                            size="default"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className={styles.input}>
                        <PasswordInput
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            error={!!error}
                            size="default"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <Button 
                        type="primary" 
                        size="medium"
                        disabled={isLoading || !formData.email || !formData.password}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </Button>
                </form>
                
                <div className={`${styles.links} mt-20`}>
                    <p className={`${styles.text} text text_type_main-default text_color_inactive`}>
                        Вы — новый пользователь?
                        &nbsp;
                        <Link to="/register" className={styles.link}>
                            Зарегистрироваться
                        </Link>
                    </p>
                    
                    <p className={`${styles.text} text text_type_main-default text_color_inactive`}>
                        Забыли пароль?
                        &nbsp;
                        <Link to="/forgot-password" className={styles.link}>
                            Восстановить пароль
                        </Link>
                    </p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
