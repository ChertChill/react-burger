import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { TAllActions, IRootState } from '../utils/types';

/**
 * Типизированный хук для работы с Redux dispatch
 * Предоставляет типизированный доступ к dispatch функциям
 */
export const useTypedDispatch = () => useDispatch<ThunkDispatch<IRootState, unknown, TAllActions>>();
