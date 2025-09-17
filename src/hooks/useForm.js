import { useState, useCallback } from 'react';

/**
 * Кастомный хук для управления состоянием формы
 * @param {Object} initialValues - Начальные значения формы
 * @returns {Array} - [values, handleChange, setValues]
 */
export function useForm(initialValues = {}) {
    const [values, setValues] = useState(initialValues);

    /**
     * Обработчик изменения полей формы
     * @param {Event} e - событие изменения
     */
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    /**
     * Функция для установки значений формы (для внешнего управления)
     * @param {Object} newValues - новые значения
     */
    const setFormValues = useCallback((newValues) => {
        setValues(newValues);
    }, []);

    /**
     * Функция для сброса формы к начальным значениям
     */
    const resetForm = useCallback(() => {
        setValues(initialValues);
    }, [initialValues]);

    return [values, handleChange, setFormValues, resetForm];
}
