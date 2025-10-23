// ========================================
// CYPRESS COMMANDS
// ========================================

import { SELECTORS } from './testData'

// Команда для ожидания загрузки ингредиентов
Cypress.Commands.add('waitForIngredients', () => {
  cy.get(SELECTORS.INGREDIENT_ITEM, { timeout: 10000 }).should('have.length.greaterThan', 0)
})

// ========================================
// AUTHENTICATION COMMANDS
// ========================================

// Команда для авторизации через UI
Cypress.Commands.add('login', (email = 'chertchill@yandex.ru', password = '123') => {
  cy.visit('/login')
  
  // Заполняем форму логина
  cy.get(SELECTORS.EMAIL_INPUT).clear().type(email)
  cy.get(SELECTORS.PASSWORD_INPUT).clear().type(password)
  cy.get(SELECTORS.SUBMIT_BUTTON).click()
  
  // Ждем завершения запроса авторизации
  cy.wait('@login')
  
  // Ждем перенаправления на главную страницу
  cy.url().should('eq', Cypress.config().baseUrl + '/')
  
  // Ждем загрузки ингредиентов после авторизации
  cy.waitForIngredients()
})

// Команда для очистки состояния
Cypress.Commands.add('clearState', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

// Команда для сборки бургера (булка + начинка)
Cypress.Commands.add('buildBurger', () => {
  // Добавляем булку
  cy.get(SELECTORS.INGREDIENT_ITEM)
    .filter('[data-ingredient-type="bun"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get(SELECTORS.BUN_TOP_DROP_ZONE)
    .trigger('drop')
  
  cy.wait(100)

  // Добавляем начинку
  cy.get(SELECTORS.INGREDIENT_ITEM)
    .filter('[data-ingredient-type="main"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
    .trigger('drop')
  
  cy.wait(100)

  // Проверяем, что ингредиенты добавлены в конструктор
  cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
    .should('have.length', 1)
})

// Команда для добавления только начинки (без булки)
Cypress.Commands.add('addOnlyFilling', () => {
  cy.get(SELECTORS.INGREDIENT_ITEM)
    .filter('[data-ingredient-type="main"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
    .trigger('drop')
  
  cy.wait(100)
})

// Команда для добавления только булки (без начинки)
Cypress.Commands.add('addOnlyBun', () => {
  cy.get(SELECTORS.INGREDIENT_ITEM)
    .filter('[data-ingredient-type="bun"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get(SELECTORS.BUN_TOP_DROP_ZONE)
    .trigger('drop')
  
  cy.wait(100)
})

// Команды для работы с модальными окнами
Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click()
})

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true })
})

Cypress.Commands.add('closeModalByEscape', () => {
  cy.get(SELECTORS.BODY).type('{esc}')
})

// Команда для перетаскивания ингредиента
Cypress.Commands.add('dragIngredient', (ingredientSelector, targetSelector) => {
  cy.get(ingredientSelector).trigger('dragstart')
  cy.wait(100)
  cy.get(targetSelector).trigger('drop')
  cy.wait(100)
})
