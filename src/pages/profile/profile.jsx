import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styles from './profile.module.css';
import ProfileNavigation from './profile-navigation/profile-navigation';
import ProfileInfo from './profile-info/profile-info';
import OrdersHistory from './orders-history/orders-history';

/**
 * Компонент страницы профиля пользователя
 * Содержит навигацию между разделами профиля и историей заказов
 */
export default function Profile() {
    return (
        <div className={styles.container}>
            <div className={`${styles.content} mt-20`}>
                {/* Навигационная панель */}
                <ProfileNavigation />

                {/* Контент профиля с вложенными маршрутами */}
                <div className={styles.profileContent}>
                    <Routes>
                        <Route index element={<ProfileInfo />} />
                        <Route path="orders" element={<OrdersHistory />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
