import { useState, useCallback } from 'react';
import { TFormValues, TFormChangeHandler, TSetFormValuesFunction, TVoidFunction, TUseFormReturn } from '../utils/types';

/**
 * Кастомный хук для управления состоянием формы
 * @param initialValues - Начальные значения формы
 * @returns [values, handleChange, setFormValues, resetForm]
 */
export function useForm(initialValues: TFormValues = {}): TUseFormReturn {
    const [values, setValues] = useState<TFormValues>(initialValues);

    /**
     * Обработчик изменения полей формы
     * @param e - событие изменения
     */
    const handleChange: TFormChangeHandler = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    /**
     * Функция для установки значений формы (для внешнего управления)
     * @param newValues - новые значения
     */
    const setFormValues: TSetFormValuesFunction = useCallback((newValues: TFormValues) => {
        setValues(newValues);
    }, []);

    /**
     * Функция для сброса формы к начальным значениям
     */
    const resetForm: TVoidFunction = useCallback(() => {
        setValues(initialValues);
    }, [initialValues]);

    return [values, handleChange, setFormValues, resetForm];
}
