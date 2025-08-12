import React, { useState, useEffect } from 'react';
import styles from './app.module.css';
import Loader from '../loader/loader';
import AppHeader from '../app-header/app-header';
import BurgerConstructor from '../burger-constructor/burger-constructor';
import BurgerIngredients from '../burger-ingredients/burger-ingredients';
import MobileRestriction from '../mobile-restriction/mobile-restriction';

// URL API для получения данных об ингредиентах
const API_URL = 'https://norma.nomoreparties.space/api/ingredients';

/**
 * Главный компонент приложения - Burger Constructor
 * Управляет состоянием приложения, загружает данные об ингредиентах,
 * обрабатывает адаптивность и роутинг между разделами
 */
export default function App() {
    const [ingredients, setIngredients] = useState([]);             // Состояние для хранения списка ингредиентов
    const [error, setError] = useState(null);                       // Состояние для обработки ошибок
    const [loading, setLoading] = useState(true);                   // Состояние загрузки данных
    const [activeSection, setActiveSection] = useState('burger');   // Состояние активного раздела (тестовая реализация роутинга)
    const [isMobile, setIsMobile] = useState(false);                // Состояние для определения мобильного устройства

    // Эффект для определения мобильного устройства
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1200);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Эффект для загрузки данных об ингредиентах при монтировании компонента
    useEffect(() => {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setIngredients(data.data)
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
                console.error('Ошибка при получении ингредиентов:', error);
            })
    }, [])

    // Показываем ограничение для мобильных устройств
    if (isMobile) {
        return <MobileRestriction />;
    }

    return (
        <div className={styles.container}>
            {/* Шапка приложения с навигацией */}
            <AppHeader activeSection={activeSection} setActiveSection={setActiveSection} />

            <main className={`${styles.group} pt-10 pr-5 pl-5`}>
                
                {/* Индикатор загрузки */}
                {loading && !error && (
                    <Loader size="medium" className={styles.roller} />
                )}

                {/* Отображение ошибки при неудачной загрузке */}
                {error && 
                    <p className={`${styles.error__text} text text_type_main-default text_color_inactive`}>
                        Ошибка при получении ингредиентов: {error}
                    </p>
                }

                {/* Основной контент приложения */}
                {!loading && !error && (
                    <>
                        {/* Раздел конструктора бургеров */}
                        {activeSection === 'burger' && (
                            <>
                                <BurgerIngredients ingredients={ingredients} />
                                <BurgerConstructor ingredients={ingredients} />
                            </>
                        )}

                        {/* Заглушка для будущих разделов */}

                        {/* Раздел ленты заказов (в разработке) */}
                        {activeSection === 'orders' && (
                            <p className="text text_type_main-large">
                                Лента заказов (в&nbsp;разработке)
                            </p>

                            // <Orders />
                        )}

                        {/* Раздел профиля пользователя (в разработке) */}
                        {activeSection === 'profile' && (
                            <p className="text text_type_main-large">
                                Профиль пользователя (в&nbsp;разработке)
                            </p>

                            // <Profile />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}