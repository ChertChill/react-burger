import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button, EmailInput, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { fetchUserData, updateUserProfile } from '../../../services/actions/auth-actions';
import { getErrorText } from '../../../utils/getErrorText';
import { useForm } from '../../../hooks';
import { 
  TWithEmailPasswordAndName, 
  TWithOptionalPassword,
  TInputChangeHandler,
  TFormEventHandler,
  TVoidFunction,
  IRootState
} from '../../../utils/types';
import styles from './profile-info.module.css';

/**
 * Компонент информации профиля
 */
const ProfileInfo: React.FC = () => {
    // Используем any для useDispatch из-за несовместимости типов Redux actions с TypeScript
    // Существующие actions написаны на JavaScript и не имеют полной типизации
    const dispatch = useDispatch<any>();
    const { user, isLoading, error } = useSelector((state: IRootState) => state.auth);
    
    const [formData, handleChange, setFormValues] = useForm({
        name: '',
        email: '',
        password: ''
    });

    const [originalData, setOriginalData] = useState<TWithEmailPasswordAndName>({
        name: '',
        email: '',
        password: ''
    });

    const [isChanged, setIsChanged] = useState<boolean>(false);

    // Загружаем данные пользователя при монтировании компонента
    useEffect(() => {
        if (!user) {
            dispatch(fetchUserData());
        }
    }, [dispatch, user]);

    // Обновляем форму при получении данных пользователя
    useEffect(() => {
        if (user) {
            const userData: TWithEmailPasswordAndName = {
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
     * @param e - событие изменения
     */
    const handleFormChange: TInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
     * @param e - событие отправки
     */
    const handleSubmit: TFormEventHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Подготавливаем данные для отправки (исключаем пустой пароль)
        const updateData: TWithOptionalPassword = {
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
    const handleCancel: TVoidFunction = () => {
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
        <div className={`${styles.profileInfo} mt-20`}>            
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
                        error={false}
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
                        placeholder="Новый пароль"
                        value={formData.password}
                        onChange={handleFormChange}
                        name="password"
                        error={false}
                        size="default"
                        disabled={isLoading}
                        autoComplete="new-password"
                        // Используем as any для обхода ограничений TypeScript типов UI библиотеки
                        // Компонент PasswordInput не поддерживает свойство error в типах, но поддерживает в runtime
                        {...({} as any)}
                    />
                </div>
                
                {isChanged && (
                    <div className={styles.buttons}>
                        <Button 
                            type="secondary" 
                            size="medium"
                            htmlType="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Отмена
                        </Button>
                        <Button 
                            type="primary" 
                            size="medium"
                            htmlType="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProfileInfo;
