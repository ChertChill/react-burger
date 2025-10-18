import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { IRootState } from '../utils/types';

/**
 * Типизированный хук для работы с Redux store
 * Предоставляет типизированный доступ к состоянию приложения
 */
export const useTypedSelector: TypedUseSelectorHook<IRootState> = useSelector;
