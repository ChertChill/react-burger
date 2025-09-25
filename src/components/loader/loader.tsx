import React from 'react';
import styles from './loader.module.css';
import { IBaseComponentProps } from '../../utils/types';

/**
 * Компонент Loader для отображения индикатора загрузки
 * Переиспользуемый компонент с настраиваемым размером
 */
const Loader: React.FC<IBaseComponentProps> = ({ size = 'medium', className = '' }) => {
    return (
        <div className={`${styles.roller} ${styles[size]} ${className}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default Loader;
