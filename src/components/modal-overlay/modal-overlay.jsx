import React from "react";
import PropTypes from 'prop-types';
import styles from "./modal-overlay.module.css";

/**
 * Компонент оверлея для модального окна
 * Создает затемненный фон и обрабатывает клики для закрытия модального окна
 * Содержит дочерние элементы (содержимое модального окна)
 */
export default function ModalOverlay({ children, handleClose }) {
    return (
        <div className={styles.container} onClick={handleClose}>
            {children}
        </div>
    );
}

ModalOverlay.propTypes = {
    children: PropTypes.node.isRequired,
    handleClose: PropTypes.func.isRequired
};