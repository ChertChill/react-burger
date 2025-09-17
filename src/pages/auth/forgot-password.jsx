import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmailInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { forgotPassword } from '../../utils/api';
import { getErrorText } from '../../utils/getErrorText';
import { resetPasswordUtils } from '../../utils/tokenUtils';
import { useForm } from '../../hooks';
import ProtectedRoute from '../../components/protected-route/protected-route';
import styles from './auth.module.css';

/**
 * Страница восстановления пароля
 */
export default function ForgotPassword() {
    const navigate = useNavigate();
    const [formData, handleChange] = useForm({ email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await forgotPassword(formData.email);
            if (response.success) {
                // Устанавливаем флаг доступа к странице reset-password
                resetPasswordUtils.setResetPasswordAllowed();
                setSuccess(true);
                // Переадресация на страницу сброса пароля через 2 секунды
                setTimeout(() => {
                    navigate('/reset-password');
                }, 2000);
            }
        } catch (err) {
            setError(getErrorText(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute requireGuest={true}>
            <div className={styles.container}>
                <h1 className={`${styles.title} text text_type_main-medium`}>
                    Восстановление пароля
                </h1>
                
                {success ? (
                    <div className={`${styles.success} mt-6`}>
                        <p className={`${styles.text} text text_type_main-default text_color_inactive`}>
                            Инструкция по&nbsp;восстановлению пароля отправлена на&nbsp;указанный email, если он зарегистрирован в&nbsp;системе
                        </p>
                    </div>
                ) : (
                    <>
                            
                        {error && (
                            <p className={`${styles.error} text text_type_main-default mt-2`}>
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className={`${styles.form} mt-6`}>
                            <div className={styles.input}>
                                <EmailInput
                                    placeholder="Укажите e-mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                    name="email"
                                    error={!!error}
                                    size="default"
                                    autoComplete="email"
                                />
                            </div>
                            
                            <Button 
                                type="primary" 
                                size="medium"
                                disabled={isLoading || !formData.email}
                            >
                                {isLoading ? 'Отправка...' : 'Восстановить'}
                            </Button>
                        </form>
                    </>
                )}
                
                <div className={`${styles.links} mt-20`}>
                    <p className={`${styles.text} text text_type_main-default text_color_inactive`}>
                        Вспомнили пароль?
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
