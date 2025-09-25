import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Input, EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { register } from '../../services/actions/auth-actions';
import { clearAuthError } from '../../services/actions/auth-actions';
import { getErrorText } from '../../utils/getErrorText';
import { useForm } from '../../hooks';
import ProtectedRoute from '../../components/protected-route/protected-route';
import { 
  TWithEmailPasswordAndName, 
  TInputChangeHandler,
  TFormEventHandler,
  IRootState
} from '../../utils/types';
import styles from './auth.module.css';

/**
 * Страница регистрации пользователя
 */
const Register: React.FC = () => {
    // Используем any для useDispatch из-за несовместимости типов Redux actions с TypeScript
    // Существующие actions написаны на JavaScript и не имеют полной типизации
    const dispatch = useDispatch<any>();
    const { isLoading, error } = useSelector((state: IRootState) => state.auth);
    
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
    const [, setSavedValues] = useState<TWithEmailPasswordAndName | null>(null);

    /**
     * Обработчик изменения полей формы с дополнительной логикой
     * @param e - событие изменения
     */
    const handleFormChange: TInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        
        // Очищаем ошибку только при непустом значении
        if (error && e.target.value.trim() !== '') {
            dispatch(clearAuthError());
        }
    };

    /**
     * Обработчик отправки формы
     * @param e - событие отправки
     */
    const handleSubmit: TFormEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password) {
            return;
        }

        // Сохраняем значения перед отправкой
        const currentValues: TWithEmailPasswordAndName = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        };
        setSavedValues(currentValues);

        try {
            await dispatch(register(formData.email, formData.password, formData.name));
            // После успешной регистрации пользователь будет перенаправлен через ProtectedRoute
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            // Восстанавливаем значения при ошибке синхронно
            setFormValues({
                name: currentValues.name,
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
                            // Используем as any для обхода ограничений TypeScript типов UI библиотеки
                            // Компонент Input требует дополнительные свойства, которые не указаны в типах
                            {...({} as any)}
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
                            // Используем as any для обхода ограничений TypeScript типов UI библиотеки
                            // Компонент EmailInput не поддерживает свойство error в типах, но поддерживает в runtime
                            {...({} as any)}
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
                            // Используем as any для обхода ограничений TypeScript типов UI библиотеки
                            // Компонент PasswordInput не поддерживает свойство error в типах, но поддерживает в runtime
                            {...({} as any)}
                        />
                    </div>
                    
                    <Button 
                        type="primary" 
                        size="medium"
                        htmlType="submit"
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
};

export default Register;
