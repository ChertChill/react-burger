import React from "react";
import styles from "./modal-overlay.module.css";
import { IModalOverlayProps } from '../../utils/types';

/**
 * Компонент оверлея для модального окна
 * Создает затемненный фон и обрабатывает клики для закрытия модального окна
 * Содержит дочерние элементы (содержимое модального окна)
 */
const ModalOverlay: React.FC<IModalOverlayProps> = ({ children, handleClose }) => {
    return (
        <div 
            className={styles.container} 
            onClick={handleClose}
            data-testid="modal-overlay"
        >
            {children}
        </div>
    );
}

export default ModalOverlay;
