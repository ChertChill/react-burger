import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BurgerConstructor from '../components/burger-constructor/burger-constructor';
import BurgerIngredients from '../components/burger-ingredients/burger-ingredients';

/**
 * Компонент главной страницы приложения
 * Содержит конструктор бургеров с ингредиентами
 * Автоматически показывает модальное окно, если пользователь находится на маршруте /ingredients/:id
 * и пришел с главной страницы (через клик на ингредиент)
 */
export default function Home() {
    const location = useLocation();
    const { currentIngredient } = useSelector(state => state.ingredientDetails);

    return (
        <DndProvider backend={HTML5Backend}>
            <BurgerIngredients />
            <BurgerConstructor />
        </DndProvider>
    );
}
