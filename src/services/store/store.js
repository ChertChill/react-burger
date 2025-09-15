import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducers/root-reducer';

/**
 * Настройка Redux DevTools для разработки
 * Проверяет наличие расширения в браузере и использует его для отладки
 */
const composeEnhancers = 
  typeof window === 'object' && 
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : 
    compose;

/**
 * Усилитель store с применением middleware
 * Добавляет поддержку асинхронных действий через redux-thunk
 */
const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

/**
 * Основной Redux store приложения
 * Содержит все состояние приложения и применяет настроенные middleware
 */
const store = createStore(rootReducer, enhancer);

export default store;
