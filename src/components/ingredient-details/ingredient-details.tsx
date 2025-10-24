import React, { useState } from "react";
import { useSelector } from 'react-redux';
import styles from './ingredient-details.module.css';
import Loader from '../loader/loader';
import NutritionItem from '../nutrition-item/nutrition-item';
import { IRootState } from '../../utils/types';

/**
 * Компонент для отображения детальной информации об ингредиенте
 * Показывает большое изображение, название и пищевую ценность ингредиента
 * Обрабатывает загрузку изображения с индикатором загрузки и обработкой ошибок
 */
export default function IngredientDetails(): React.JSX.Element | null {
    const ingredient = useSelector((state: IRootState) => state.ingredientDetails.currentIngredient);
    const [imageLoading, setImageLoading] = useState<boolean>(true);     // Состояние загрузки изображения
    const [imageError, setImageError] = useState<boolean>(false);        // Состояние ошибки загрузки изображения

    // Эффект для сброса состояния и предзагрузки изображения при смене ингредиента
    React.useEffect(() => {
        if (!ingredient) return;
        
        setImageLoading(true);
        setImageError(false);
        
        // Проверяем, загружено ли изображение в кэше
        const img = new Image();
        img.onload = () => setImageLoading(false);
        img.onerror = () => {
            setImageLoading(false);
            setImageError(true);
        };
        img.src = ingredient.image_large || ingredient.image;
    }, [ingredient]);

    // Возвращаем null если ингредиент не передан
    if (!ingredient) {
        return null;
    }

    return (
        <div 
            className={`${styles.container} mb-5`}
            data-testid="ingredient-details"
            data-ingredient-id={ingredient._id}
            data-ingredient-name={ingredient.name}
        >

            {/* Контейнер с изображением ингредиента */}
            <div className={styles.image__container}>
                
                {/* Индикатор загрузки изображения */}
                {imageLoading && !imageError && (
                    <Loader size="medium" />
                )}
                
                {/* Сообщение об ошибке загрузки */}
                {imageError && (
                    <p className="text text_type_main-default text_color_inactive">
                        Ошибка загрузки изображения
                    </p>
                )}
                
                {/* Отображение изображения после загрузки */}
                {!imageLoading && !imageError && (
                    <img 
                        src={ingredient.image_large || ingredient.image} 
                        alt={ingredient.name} 
                        className={styles.image}
                    />
                )}

            </div>
            
            {/* Название ингредиента */}
            <h3 className={`${styles.title} text text_type_main-medium mt-4`}>
                {ingredient.name}
            </h3>
            
            {/* Блок с пищевой ценностью */}
            <div className={`${styles.nutrition__info} mt-8`}>
                <NutritionItem label="Калории, ккал" value={ingredient.calories} />
                <NutritionItem label="Белки, г" value={ingredient.proteins} />
                <NutritionItem label="Жиры, г" value={ingredient.fat} />
                <NutritionItem label="Углеводы, г" value={ingredient.carbohydrates} />
            </div>
            
        </div>
    );
}
