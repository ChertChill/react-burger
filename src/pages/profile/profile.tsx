import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './profile.module.css';
import ProfileNavigation from './profile-navigation/profile-navigation';
import Modal from '../../components/modal/modal';
import OrderDetails from '../../components/order-details/order-details';
import OrderFeed from '../../components/order-feed/order-feed';
import { useModal } from '../../hooks';

/**
 * Компонент страницы профиля пользователя
 * Содержит навигацию между разделами профиля и историей заказов
 * Поддерживает модальное окно с деталями заказа
 */
const Profile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isModalOpen, openModal, closeModal } = useModal();

    /**
     * Функция для закрытия модального окна
     * Возвращает пользователя на страницу профиля
     */
    const handleCloseModal = (): void => {
        navigate('/profile/orders', { replace: true });
    };

    // Эффект для управления модальным окном при изменении маршрута
    useEffect(() => {
        const pathname = location.pathname;
        
        // Если мы находимся на странице заказа в профиле (/profile/orders/:number)
        if (pathname.startsWith('/profile/orders/') && pathname !== '/profile/orders') {
            const orderNumber = pathname.split('/')[3];
            
            // Если есть номер заказа в URL, открываем модальное окно
            if (orderNumber) {
                if (!isModalOpen) {
                    openModal();
                }
            }
        } else {
            // Если мы не на странице заказа, закрываем модальное окно
            if (isModalOpen) {
                closeModal();
            }
        }
    }, [location.pathname, isModalOpen, openModal, closeModal]);

    // Определяем, нужно ли показывать OrderFeed в фоне
    const shouldShowOrderFeed = location.pathname.startsWith('/profile/orders/') && location.pathname !== '/profile/orders';

    return (
        <div className={styles.container}>
            <div className={`${styles.content}`}>
                {/* Навигационная панель */}
                <ProfileNavigation />

                {/* Контент профиля с вложенными маршрутами */}
                <div className={styles.profileContent}>
                    {shouldShowOrderFeed ? (
                        <OrderFeed showStatus={true} />
                    ) : (
                        <Outlet />
                    )}
                </div>
            </div>

            {/* Модальное окно с деталями заказа */}
            {isModalOpen && (
                <Modal handleClose={handleCloseModal}>
                    <OrderDetails />
                </Modal>
            )}
        </div>
    );
};

export default Profile;
