import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { resetPassword } from '../../utils/api';
import { getErrorText } from '../../utils/getErrorText';
import { resetPasswordUtils } from '../../utils/tokenUtils';
import ProtectedRoute from '../../components/protected-route/protected-route';
import styles from './auth.module.css';

/**
 * Страница сброса пароля
 */
export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await resetPassword(password, token);
            if (response.success) {
                // Очищаем флаг доступа к странице reset-password
                resetPasswordUtils.removeResetPasswordFlag();
                setSuccess(true);
                // Переадресация на страницу входа через 2 секунды
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(getErrorText(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute requireGuest={true} requireResetFlag={true}>
            <div className={styles.container}>
                <h1 className={`${styles.title} text text_type_main-medium`}>
                    Восстановление пароля
                </h1>
                
                {success ? (
                    <div className={`${styles.success} mt-6`}>
                        <p className={`${styles.text} text text_type_main-default text_color_inactive`}>
                            Пароль успешно изменен.
                            <br />
                            Теперь вы можете войти в систему
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
                                <PasswordInput
                                    placeholder="Введите новый пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    name="password"
                                    error={!!error}
                                    size="default"
                                />
                            </div>
                            
                            <div className={styles.input}>
                                <Input
                                    type="text"
                                    placeholder="Введите код из письма"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    name="token"
                                    error={!!error}
                                    size="default"
                                />
                            </div>

                            <Button 
                                type="primary" 
                                size="medium"
                                disabled={isLoading || !password || !token}
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
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
