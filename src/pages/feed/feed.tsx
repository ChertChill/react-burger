import React from 'react';
import OrderFeed from '../../components/order-feed/order-feed';
import OrderStats from '../../components/order-stats/order-stats';
import styles from './feed.module.css';

/**
 * Страница ленты заказов
 * Отображает ленту всех заказов и статистику
 */
export default function Feed(): React.JSX.Element {
  return (
    <div className={styles.container}>
        <h1 className="text text_type_main-large">
            Лента заказов
        </h1>

        <div className={styles.content}>
            <div className={styles.feed_column}>
                <OrderFeed />
            </div>
            <div className={styles.stats_column}>
                <OrderStats />
            </div>
        </div>
    </div>
  );
}

