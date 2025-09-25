import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BurgerConstructor from '../components/burger-constructor/burger-constructor';
import BurgerIngredients from '../components/burger-ingredients/burger-ingredients';

/**
 * Компонент главной страницы приложения
 * Содержит конструктор бургеров с ингредиентами
 */
export default function Home(): React.JSX.Element {

    return (
        <DndProvider backend={HTML5Backend}>
            <BurgerIngredients />
            <BurgerConstructor />
        </DndProvider>
    );
}
