// ========================================
// CYPRESS COMMANDS
// ========================================

// Команда для ожидания загрузки ингредиентов
Cypress.Commands.add('waitForIngredients', () => {
  cy.get('[data-testid="ingredient-item"]', { timeout: 10000 }).should('have.length.greaterThan', 0)
})

// ========================================
// AUTHENTICATION COMMANDS
// ========================================

// Команда для авторизации через UI
Cypress.Commands.add('login', (email = 'chertchill@yandex.ru', password = '123') => {
  cy.visit('/login')
  
  // Заполняем форму логина
  cy.get('input[type="email"]').clear().type(email)
  cy.get('input[type="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
  
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
  cy.get('[data-testid="ingredient-item"]')
    .filter('[data-ingredient-type="bun"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get('[data-testid="bun-top-drop-zone"]')
    .trigger('drop')
  
  cy.wait(100)

  // Добавляем начинку
  cy.get('[data-testid="ingredient-item"]')
    .filter('[data-ingredient-type="main"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get('[data-testid="middle-ingredients-drop-zone"]')
    .trigger('drop')
  
  cy.wait(100)

  // Проверяем, что ингредиенты добавлены в конструктор
  cy.get('[data-testid="constructor-ingredient"]')
    .should('have.length', 1)
})

// Команда для добавления только начинки (без булки)
Cypress.Commands.add('addOnlyFilling', () => {
  cy.get('[data-testid="ingredient-item"]')
    .filter('[data-ingredient-type="main"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get('[data-testid="middle-ingredients-drop-zone"]')
    .trigger('drop')
  
  cy.wait(100)
})

// Команда для добавления только булки (без начинки)
Cypress.Commands.add('addOnlyBun', () => {
  cy.get('[data-testid="ingredient-item"]')
    .filter('[data-ingredient-type="bun"]')
    .first()
    .trigger('dragstart')
  
  cy.wait(100)
  
  cy.get('[data-testid="bun-top-drop-zone"]')
    .trigger('drop')
  
  cy.wait(100)
})

// Команды для работы с модальными окнами
Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close-button"]').click()
})

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-testid="modal-overlay"]').click({ force: true })
})

Cypress.Commands.add('closeModalByEscape', () => {
  cy.get('body').type('{esc}')
})

// Команда для перетаскивания ингредиента
Cypress.Commands.add('dragIngredient', (ingredientSelector, targetSelector) => {
  cy.get(ingredientSelector).trigger('dragstart')
  cy.wait(100)
  cy.get(targetSelector).trigger('drop')
  cy.wait(100)
})
