import { useState, useCallback } from "react";

/**
 * Кастомный хук для управления модальными окнами
 * Предоставляет состояние и функции для открытия/закрытия модального окна
 * 
 * @returns {Object} Объект с состоянием и функциями управления модальным окном
 * @returns {boolean} returns.isModalOpen - состояние открытия модального окна
 * @returns {Function} returns.openModal - функция для открытия модального окна
 * @returns {Function} returns.closeModal - функция для закрытия модального окна
 */
export const useModal = () => {
  // Состояние для отслеживания открытия/закрытия модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для открытия модального окна
  const openModal = useCallback(() => {     // для оптимизации производительности, предотвращает лишние перерисовки компонентов
    setIsModalOpen(true);
  }, []);

  // Функция для закрытия модального окна
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Возвращаем объект с состоянием и функциями управления
  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};
