import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { login } from '../../services/actions/auth-actions';
import { clearAuthError } from '../../services/actions/auth-actions';
import { getErrorText } from '../../utils/getErrorText';
import { useForm } from '../../hooks';
import ProtectedRoute from '../../components/protected-route/protected-route';
import { 
  TWithEmailAndPassword, 
  TFormEventHandler,
  IRootState
} from '../../utils/types';
import styles from './auth.module.css';

/**
 * Страница авторизации пользователя
 */
const Login: React.FC = () => {
    // Используем any для useDispatch из-за несовместимости типов Redux actions с TypeScript
    // Существующие actions написаны на JavaScript и не имеют полной типизации
    const dispatch = useDispatch<any>();
    const { isLoading, error } = useSelector((state: IRootState) => state.auth);
    
    const [formData, handleChange, setFormValues] = useForm({
        email: '',
        password: ''
    });

    // Очищаем ошибки при монтировании компонента
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    // Сохраняем значения при ошибке для восстановления
    const [, setSavedValues] = useState<TWithEmailAndPassword | null>(null);

    /**
     * Обработчик отправки формы
     * @param e - событие отправки
     */
    const handleSubmit: TFormEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            return;
        }

        // Сохраняем значения перед отправкой
        const currentValues: TWithEmailAndPassword = {
            email: formData.email,
            password: formData.password
        };
        setSavedValues(currentValues);

        try {
            await dispatch(login(formData.email, formData.password));
            // После успешной авторизации пользователь будет перенаправлен через ProtectedRoute
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            // Восстанавливаем значения при ошибке синхронно
            setFormValues({
                email: currentValues.email,
                password: currentValues.password
            });
            setSavedValues(null);
        }
    };

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
                            autoComplete="email"
                            // Используем as any для обхода ограничений TypeScript типов UI библиотеки
                            // Компонент EmailInput не поддерживает свойство error в типах, но поддерживает в runtime
                            {...({} as any)}
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
                            autoComplete="current-password"
                            // Используем as any для обхода ограничений TypeScript типов UI библиотеки
                            // Компонент PasswordInput не поддерживает свойство error в типах, но поддерживает в runtime
                            {...({} as any)}
                        />
                    </div>
                    
                    <Button 
                        type="primary" 
                        size="medium"
                        htmlType="submit"
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
};

export default Login;
