import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Input, EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { register } from '../../services/actions/auth-actions';
import { clearAuthError } from '../../services/actions/auth-actions';
import { getErrorText } from '../../utils/getErrorText';
import { useForm } from '../../hooks';
import ProtectedRoute from '../../components/protected-route/protected-route';
import styles from './auth.module.css';

/**
 * Страница регистрации пользователя
 */
export default function Register() {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.auth);
    
    const [formData, handleChange, setFormValues] = useForm({
        name: '',
        email: '',
        password: ''
    });

    // Очищаем ошибки при монтировании компонента
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    // Сохраняем значения при ошибке для восстановления
    const [savedValues, setSavedValues] = useState(null);

    /**
     * Обработчик изменения полей формы с дополнительной логикой
     * @param {Event} e - событие изменения
     */
    const handleFormChange = (e) => {
        handleChange(e);
        
        // Очищаем ошибку только при непустом значении
        if (error && e.target.value.trim() !== '') {
            dispatch(clearAuthError());
        }
    };

    /**
     * Обработчик отправки формы
     * @param {Event} e - событие отправки
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password) {
            return;
        }

        // Сохраняем значения перед отправкой
        const currentValues = { ...formData };
        setSavedValues(currentValues);

        try {
            await dispatch(register(formData.email, formData.password, formData.name));
            // После успешной регистрации пользователь будет перенаправлен через ProtectedRoute
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            // Восстанавливаем значения при ошибке синхронно
            setFormValues(currentValues);
            setSavedValues(null);
        }
    };

    return (
        <ProtectedRoute requireGuest={true}>
            <div className={styles.container}>
                <h1 className={`${styles.title} text text_type_main-medium`}>
                    Регистрация
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
                        <Input
                            type="text"
                            placeholder="Имя"
                            value={formData.name}
                            onChange={handleFormChange}
                            name="name"
                            error={!!error}
                            size="default"
                            disabled={isLoading}
                            autoComplete="name"
                        />
                    </div>
                    
                    <div className={styles.input}>
                        <EmailInput
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleFormChange}
                            name="email"
                            error={!!error}
                            size="default"
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>
                    
                    <div className={styles.input}>
                        <PasswordInput
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleFormChange}
                            name="password"
                            error={!!error}
                            size="default"
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>
                    
                    <Button 
                        type="primary" 
                        size="medium"
                        disabled={isLoading || !formData.name || !formData.email || !formData.password}
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>
                </form>
                
                <div className={`${styles.links} mt-20`}>
                    <p className={`${styles.text} text text_type_main-default text_color_inactive`}>
                        Уже зарегистрированы?
                        &nbsp;
                        <Link to="/login" className={styles.link}>
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
