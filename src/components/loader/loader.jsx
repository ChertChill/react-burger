import React from 'react';
import PropTypes from 'prop-types';
import styles from './loader.module.css';

/**
 * Компонент Loader для отображения индикатора загрузки
 * Переиспользуемый компонент с настраиваемым размером
 */
export default function Loader({ size = 'medium', className = '' }) {
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

Loader.propTypes = {
    /** Размер лоадера: 'small', 'medium', 'large' */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /** Дополнительные CSS классы */
    className: PropTypes.string
};
