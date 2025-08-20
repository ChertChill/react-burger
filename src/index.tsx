import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/app/app';
import store from './services/store/store';
import reportWebVitals from './reportWebVitals';

/**
 * Создание корневого элемента для рендеринга React приложения
 * Получает DOM элемент с id 'root' из HTML файла
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/**
 * Рендеринг основного компонента приложения
 * Оборачивает приложение в Redux Provider для доступа к store
 * Включает React.StrictMode для дополнительных проверок в режиме разработки
 */
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
