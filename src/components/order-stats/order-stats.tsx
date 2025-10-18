import React from 'react';
import { useTypedSelector } from '../../hooks';
import styles from './order-stats.module.css';

/**
 * Компонент статистики заказов
 * Отображает информацию о готовых заказах, заказах в работе и общую статистику
 */
export default function OrderStats(): React.JSX.Element {
  const { total, totalToday, ready, inProgress } = useTypedSelector((state) => state.feed);

  // Показываем только первые 10 заказов в каждой категории
  const displayedReady = ready.slice(0, 10);
  const displayedInProgress = inProgress.slice(0, 10);
  
  // Подсчитываем количество оставшихся заказов
  const remainingReady = ready.length - displayedReady.length;
  const remainingInProgress = inProgress.length - displayedInProgress.length;

  // Разделяем на две колонки по 5 заказов
  const readyColumn1 = displayedReady.slice(0, 5);
  const readyColumn2 = displayedReady.slice(5, 10);
  const inProgressColumn1 = displayedInProgress.slice(0, 5);
  const inProgressColumn2 = displayedInProgress.slice(5, 10);

  return (
    <div className={styles.stats}>
      <div className={styles.ready}>
        <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
        <div className={styles.columns}>
          <div className={styles.numbers}>
            {readyColumn1.map((number: number) => (
              <span 
                key={number} 
                className={`${styles.number} ${styles.number_ready} text text_type_digits-default`}
              >
                {number}
              </span>
            ))}
          </div>
          <div className={styles.numbers}>
            {readyColumn2.map((number: number) => (
              <span 
                key={number} 
                className={`${styles.number} ${styles.number_ready} text text_type_digits-default`}
              >
                {number}
              </span>
            ))}
          </div>
        </div>
        {remainingReady > 0 && (
          <div className={styles.more_container}>
            <span className={`${styles.number_more} text text_type_main-default`}>
              Ещё {remainingReady} заказов
            </span>
          </div>
        )}
      </div>

      <div className={styles.in_progress}>
        <h3 className="text text_type_main-medium mb-6">В работе:</h3>
        <div className={styles.columns}>
          <div className={styles.numbers}>
            {inProgressColumn1.map((number: number) => (
              <span 
                key={number} 
                className={`${styles.number} text text_type_digits-default`}
              >
                {number}
              </span>
            ))}
          </div>
          <div className={styles.numbers}>
            {inProgressColumn2.map((number: number) => (
              <span 
                key={number} 
                className={`${styles.number} text text_type_digits-default`}
              >
                {number}
              </span>
            ))}
          </div>
        </div>
        {remainingInProgress > 0 && (
          <div className={styles.more_container}>
            <span className={`${styles.number_more} text text_type_main-default`}>
              Ещё {remainingInProgress} заказов
            </span>
          </div>
        )}
      </div>

        <div className={styles.total}>
          <h3 className="text text_type_main-medium">Выполнено за все время:</h3>
          <span className={`${styles.total_number} text text_type_digits-large`}>
            {total}
          </span>
        </div>

        <div className={styles.today}>
          <h3 className="text text_type_main-medium">Выполнено за сегодня:</h3>
          <span className={`${styles.total_number} text text_type_digits-large`}>
            {totalToday}
          </span>
        </div>
    </div>
  );
}

