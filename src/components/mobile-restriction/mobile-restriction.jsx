import React from 'react';
import styles from './mobile-restriction.module.css';
import { LockIcon } from '@ya.praktikum/react-developer-burger-ui-components';

/**
 * Компонент ограничения для мобильных устройств
 * Отображается когда ширина экрана меньше 1200px
 * Показывает сообщение о том, что мобильная версия недоступна
 * и предлагает использовать устройство с большим экраном
 */
export default function MobileRestriction() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                
                {/* Иконка блокировки */}
                <div className={styles.icon}>
                    <LockIcon type="error" />
                </div>
                
                {/* Заголовок сообщения */}
                <h2 className="text text_type_main-large mt-8">
                    Мобильная версия недоступна
                </h2>
                
                {/* Основной текст с требованиями к устройству */}
                <p className="text text_type_main-default mt-4 mr-2 ml-2">
                    Для работы с&nbsp;приложением используйте устройство с&nbsp;шириной экрана не&nbsp;менее 1200px
                </p>
                
                {/* Дополнительная рекомендация */}
                <p className="text text_type_main-default text_color_inactive mt-6 mr-2 ml-2">
                    Откройте приложение на&nbsp;компьютере или планшете
                </p>
                
            </div>
        </div>
    );
}