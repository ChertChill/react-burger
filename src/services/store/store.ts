import { createStore, applyMiddleware, compose, Store } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducers/root-reducer';
import { IRootState, TAllActions } from '../../utils/types';
import { websocketMiddleware } from '../middleware/websocket-middleware';

/**
 * Настройка Redux DevTools для разработки
 * Проверяет наличие расширения в браузере и использует его для отладки
 */
const composeEnhancers = 
  typeof window === 'object' && 
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : 
    compose;

/**
 * Усилитель store с применением middleware
 * Добавляет поддержку асинхронных действий через redux-thunk и WebSocket middleware
 */
const enhancer = composeEnhancers(
  applyMiddleware(thunk, websocketMiddleware)
);

/**
 * Основной Redux store приложения
 * Содержит все состояние приложения и применяет настроенные middleware
 */
const store: Store<IRootState, TAllActions> = createStore(rootReducer, enhancer);

export default store;