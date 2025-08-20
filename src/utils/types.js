import PropTypes from 'prop-types';

/**
 * PropTypes для объекта ингредиента
 * Используется для валидации props в компонентах, работающих с ингредиентами
 * Содержит все необходимые поля для отображения информации об ингредиенте
 */
export const IngredientType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string,
  image_large: PropTypes.string,
  __v: PropTypes.number
});

/**
 * PropTypes для объекта ингредиента в конструкторе
 * Расширенная версия IngredientType с дополнительными полями для конструктора
 */
export const ConstructorIngredientType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string,
  image_large: PropTypes.string,
  __v: PropTypes.number
});