import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './profile.module.css';
import ProfileNavigation from './profile-navigation/profile-navigation';

/**
 * Компонент страницы профиля пользователя
 * Содержит навигацию между разделами профиля и историей заказов
 */
const Profile: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={`${styles.content}`}>
                {/* Навигационная панель */}
                <ProfileNavigation />

                {/* Контент профиля с вложенными маршрутами */}
                <div className={styles.profileContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Profile;
