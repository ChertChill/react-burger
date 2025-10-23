import { mockIngredients, mockUser, mockTokens } from '../support/testData'

describe('Детали ингредиентов', () => {
  beforeEach(() => {
    // Мокируем API запросы
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: { success: true, data: mockIngredients }
    }).as('getIngredients')

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: { success: true, user: mockUser }
    }).as('getUser')

    // Переходим на главную страницу
    cy.visit('/')
    
    // Ожидаем загрузки ингредиентов
    cy.wait('@getIngredients')
    cy.waitForIngredients()
  })

  describe('Работа с модальными окнами ингредиентов', () => {
    it('должен открывать модальное окно при клике на ингредиент и отображать все данные', () => {
      // Кликаем на первый ингредиент
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .click()

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal-overlay"]')
        .should('be.visible')

      // Проверяем заголовок модального окна
      cy.contains('Детали ингредиента')
        .should('be.visible')

      // Проверяем, что отображается информация об ингредиенте
      cy.get('[data-testid="ingredient-details"]')
        .should('be.visible')

      // Проверяем изображение ингредиента
      cy.get('[data-testid="ingredient-details"]')
        .find('img')
        .should('be.visible')
        .should('have.attr', 'src')
    })

    it('должен закрывать модальное окно разными способами (по кнопке закрытия, по клику на фон, по клавише Esc)', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .click()

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal-overlay"]')
        .should('be.visible')

      // Закрываем через кнопку закрытия
      cy.get('[data-testid="modal-close-button"]').click()
      cy.get('[data-testid="modal-overlay"]').should('not.exist')

      // Открываем снова
      cy.get('[data-testid="ingredient-item"]').first().click()
      cy.get('[data-testid="modal-overlay"]').should('be.visible')

      // Закрываем через клик на фон
      cy.get('[data-testid="modal-overlay"]').click({ force: true })
      cy.get('[data-testid="modal-overlay"]').should('not.exist')

      // Открываем снова
      cy.get('[data-testid="ingredient-item"]').first().click()
      cy.get('[data-testid="modal-overlay"]').should('be.visible')

      // Закрываем через Escape
      cy.get('body').type('{esc}')
      cy.get('[data-testid="modal-overlay"]').should('not.exist')
    })

    it('не должен закрывать модальное окно при клике на содержимое', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .click()

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal-overlay"]')
        .should('be.visible')

      // Кликаем на содержимое модального окна (не на фон)
      cy.get('[data-testid="ingredient-details"]')
        .click()

      // Проверяем, что модальное окно осталось открытым
      cy.get('[data-testid="modal-overlay"]')
        .should('be.visible')

      // Проверяем, что URL не изменился
      cy.url().should('include', '/ingredients/')
    })

    it('должен переключаться между модальными окнами ингредиентов', () => {
      // Открываем модальное окно с первым ингредиентом
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .click()

      // Проверяем, что отображается информация об ингредиенте
      cy.get('[data-testid="ingredient-details"]')
        .should('be.visible')

      // Закрываем модальное окно
      cy.get('[data-testid="modal-close-button"]').click()

      // Открываем модальное окно со вторым ингредиентом
      cy.get('[data-testid="ingredient-item"]')
        .eq(1)
        .click()

      // Проверяем, что отображается информация о другом ингредиенте
      cy.get('[data-testid="ingredient-details"]')
        .should('be.visible')
    })
  })

  describe('Работа с отдельными страницами ингредиентов', () => {
    it('должен переходить на страницу ингредиента при прямом переходе и отображать данные о нем', () => {
      // Получаем ID первого ингредиента
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .should('have.attr', 'data-ingredient-id')
        .then((ingredientId) => {
          // Переходим напрямую на страницу ингредиента
          cy.visit(`/ingredients/${ingredientId}`)

          // Проверяем, что URL соответствует странице ингредиента
          cy.url().should('include', `/ingredients/${ingredientId}`)

          // Проверяем, что отображается заголовок страницы
          cy.contains('Детали ингредиента')
            .should('be.visible')

          // Проверяем, что отображается информация об ингредиенте
          cy.get('[data-testid="ingredient-details"]')
            .should('be.visible')

          // Проверяем, что модальное окно НЕ открылось (это отдельная страница)
          cy.get('[data-testid="modal-overlay"]')
            .should('not.exist')
        })
    })

    it('должен обрабатывать переход на страницу с несуществующим ID ингредиента', () => {
      // Переходим на страницу с несуществующим ID
      cy.visit('/ingredients/nonexistent-id')

      // Проверяем, что произошло перенаправление на главную страницу
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Проверяем, что отображается главная страница
      cy.get('[data-testid="ingredient-item"]')
        .should('have.length.greaterThan', 0)
    })
  })
})
