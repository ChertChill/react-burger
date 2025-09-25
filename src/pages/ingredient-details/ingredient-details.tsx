import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ingredient-details.module.css';
import IngredientDetails from '../../components/ingredient-details/ingredient-details';
import { setCurrentIngredient } from '../../services/actions';
import Home from '../home';
import { IRootState, ILocationState } from '../../utils/types';

/**
 * Страница деталей ингредиента
 * Определяет, показывать ли модальное окно поверх главной страницы
 * или отдельную страницу в зависимости от того, откуда пришел пользователь
 */
export default function IngredientDetailsPage(): React.JSX.Element {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const { ingredients } = useSelector((state: IRootState) => state.ingredients);
    const { currentIngredient } = useSelector((state: IRootState) => state.ingredientDetails);

    // Эффект для загрузки ингредиента по ID
    useEffect(() => {
        if (ingredients && ingredients.length > 0 && id) {
            const ingredient = ingredients.find(item => item._id === id);
            if (ingredient) {
                // Используем as any для dispatch Redux actions из-за несовместимости типов
                // Существующие actions написаны на JavaScript и не имеют полной типизации
                dispatch(setCurrentIngredient(ingredient) as any);
            } else {
                // Если ингредиент не найден, перенаправляем на главную страницу
                navigate('/', { replace: true });
            }
        }
    }, [ingredients, id, dispatch, navigate]);

    // Если ингредиент не найден, показываем сообщение
    if (!currentIngredient) {
        return (
            <div className={styles.container}>
                <p className={`${styles.error__message} text text_type_main-default text_color_inactive`}>
                    Ингредиент не найден
                </p>
            </div>
        );
    }

    // Если пришли с главной страницы (через клик на ингредиент), показываем главную страницу с модальным окном
    if ((location.state as ILocationState)?.from === 'home') {
        return <Home />;
    }

    // Если пришли напрямую по ссылке, показываем отдельную страницу
    return (
        <div className={styles.container}>
            <h1 className="text text_type_main-large">
                Детали ингредиента
            </h1>

            <IngredientDetails />
        </div>
    );
}
