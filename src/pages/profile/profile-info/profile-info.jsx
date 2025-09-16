import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button, EmailInput, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { fetchUserData, updateUserProfile } from '../../../services/actions/auth-actions';
import { getErrorText } from '../../../utils/getErrorText';
import { useForm } from '../../../hooks';
import styles from './profile-info.module.css';

/**
 * Компонент информации профиля
 */
export default function ProfileInfo() {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector(state => state.auth);
    
    const [formData, handleChange, setFormValues] = useForm({
        name: '',
        email: '',
        password: ''
    });

    const [originalData, setOriginalData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [isChanged, setIsChanged] = useState(false);

    // Загружаем данные пользователя при монтировании компонента
    useEffect(() => {
        if (!user) {
            dispatch(fetchUserData());
        }
    }, [dispatch, user]);

    // Обновляем форму при получении данных пользователя
    useEffect(() => {
        if (user) {
            const userData = {
                name: user.name || '',
                email: user.email || '',
                password: '' // Пароль не возвращается API по соображениям безопасности
            };
            setFormValues(userData);
            setOriginalData(userData);
        }
    }, [user, setFormValues]);

    /**
     * Обработчик изменения полей формы с отслеживанием изменений
     * @param {Event} e - событие изменения
     */
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);
        
        // Проверяем, изменились ли данные по сравнению с оригинальными
        const newData = { ...formData, [name]: value };
        const hasChanges = newData.name !== originalData.name || 
                          newData.email !== originalData.email || 
                          (name === 'password' && newData.password !== '');
        setIsChanged(hasChanges);
    };

    /**
     * Обработчик отправки формы
     * @param {Event} e - событие отправки
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Подготавливаем данные для отправки (исключаем пустой пароль)
        const updateData = {
            name: formData.name,
            email: formData.email
        };
        
        // Добавляем пароль только если он был введен
        if (formData.password) {
            updateData.password = formData.password;
        }
        
        try {
            await dispatch(updateUserProfile(updateData));
            // Обновляем оригинальные данные после успешного сохранения
            setOriginalData({
                name: formData.name,
                email: formData.email,
                password: ''
            });
            setFormValues({ ...formData, password: '' });
            setIsChanged(false);
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    /**
     * Обработчик отмены изменений
     */
    const handleCancel = () => {
        setFormValues(originalData);
        setIsChanged(false);
    };

    // Показываем загрузку если данные еще не загружены
    if (isLoading && !user) {
        return (
            <div className={styles.profileInfo}>
                <div className={styles.loading}>Загрузка данных пользователя...</div>
            </div>
        );
    }

    return (
        <div className={styles.profileInfo}>            
            {error && (
                <div className={styles.error}>
                    Ошибка: {getErrorText(error)}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.input}>
                    <Input
                        type="text"
                        placeholder="Имя"
                        value={formData.name}
                        onChange={handleFormChange}
                        name="name"
                        error={false}
                        size="default"
                        icon="EditIcon"
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
                        error={false}
                        size="default"
                        icon="EditIcon"
                        disabled={isLoading}
                        autoComplete="email"
                    />
                </div>
                
                <div className={styles.input}>
                    <PasswordInput
                        placeholder="Новый пароль"
                        value={formData.password}
                        onChange={handleFormChange}
                        name="password"
                        error={false}
                        size="default"
                        icon="EditIcon"
                        disabled={isLoading}
                        autoComplete="new-password"
                    />
                </div>
                
                {isChanged && (
                    <div className={styles.buttons}>
                        <Button 
                            type="secondary" 
                            size="medium"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Отмена
                        </Button>
                        <Button 
                            type="primary" 
                            size="medium"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
