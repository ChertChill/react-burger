import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import styles from './modal.module.css';
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "../modal-overlay/modal-overlay";

// Корневой элемент для рендера модальных окон
const modalRoot = document.getElementById("modals");

/**
 * Компонент модального окна
 * Рендерится в отдельном DOM-элементе через React Portal
 * Содержит заголовок, кнопку закрытия и контент
 * Поддерживает закрытие по Escape и клику по оверлею
 */
export default function Modal({ children, title, handleClose }) {
    // Эффект для добавления обработчика клавиши Escape
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [handleClose]);

    /**
     * Обработчик клика по модальному окну
     * Предотвращает закрытие при клике на содержимое модального окна
     * @param {Event} event - событие клика
     */
    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    // Рендер модального окна через Portal
    return ReactDOM.createPortal(
        (
            <ModalOverlay handleClose={handleClose}>
                <div className={`${styles.container} p-10`} onClick={handleModalClick}>

                    {/* Заголовок модального окна с кнопкой закрытия */}
                    <div className={styles.header}>
                        <p className="text text_type_main-large">
                            {title}
                        </p>
                        
                        <button className={styles.button__close} onClick={handleClose}>
                            <CloseIcon type="primary" />            
                        </button>
                    </div>

                    {/* Содержимое модального окна */}
                    {children}
                    
                </div>
            </ModalOverlay>
        ),
        modalRoot
    );
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired
};