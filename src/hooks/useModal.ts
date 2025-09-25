import { useState, useCallback } from "react";
import { IUseModalReturn, TVoidFunction } from '../utils/types';

/**
 * Кастомный хук для управления модальными окнами
 * Предоставляет состояние и функции для открытия/закрытия модального окна
 * 
 * @returns Объект с состоянием и функциями управления модальным окном
 * @returns isModalOpen - состояние открытия модального окна
 * @returns openModal - функция для открытия модального окна
 * @returns closeModal - функция для закрытия модального окна
 */
export const useModal = (): IUseModalReturn => {
  // Состояние для отслеживания открытия/закрытия модального окна
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Функция для открытия модального окна
  const openModal: TVoidFunction = useCallback(() => {     // для оптимизации производительности, предотвращает лишние перерисовки компонентов
    setIsModalOpen(true);
  }, []);

  // Функция для закрытия модального окна
  const closeModal: TVoidFunction = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Возвращаем объект с состоянием и функциями управления
  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};
