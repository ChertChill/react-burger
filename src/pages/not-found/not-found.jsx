import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './not-found.module.css';

/**
 * Компонент страницы 404 Not Found
 * Отображается для всех несуществующих роутов
 */
export default function NotFound() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={`${styles.title} text text_type_digits-large`}>
                    404
                </h1>

                <h2 className={`${styles.subtitle} text text_type_main-large`}>
                    Страница не&nbsp;найдена
                </h2>

                <p className={`${styles.description} text text_type_main-default text_color_inactive mb-5`}>
                    К&nbsp;сожалению, запрашиваемая страница не&nbsp;существует.
                </p>

                <Button
                    htmlType="button"
                    type="primary"
                    size="large"
                    onClick={handleGoHome}
                >
                    Вернуться на главную
                </Button>
            </div>
        </div>
    );
}
