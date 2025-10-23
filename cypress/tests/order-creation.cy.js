import { mockIngredients, mockUser, mockTokens, mockOrder } from '../support/testData'

describe('Создание заказа', () => {
  beforeEach(() => {
    // Мокируем API запросы
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: { success: true, data: mockIngredients }
    }).as('getIngredients')

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: mockOrder
    }).as('createOrder')

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: { success: true, user: mockUser }
    }).as('getUser')

    // Мокируем API авторизации для реального логина
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { 
        success: true, 
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        user: mockUser
      }
    }).as('login')

    // Переходим на главную страницу
    cy.visit('/')
    
    // Ожидаем загрузки ингредиентов
    cy.wait('@getIngredients')
    cy.waitForIngredients()
  })

  describe('Успешное создание заказа и работа с модальным окном', () => {
    beforeEach(() => {
      cy.login()
      cy.buildBurger()
    })

    // Вспомогательная функция для создания заказа
    const createOrder = () => {
      cy.get('[data-testid="order-button"]').click()
      cy.wait('@createOrder')
    }

    // Вспомогательная функция для проверки модального окна
    const checkOrderModal = () => {
      cy.get('[data-testid="modal-overlay"]').should('be.visible')
      cy.get('[data-testid="order-confirm"]').should('be.visible')
      cy.get('[data-testid="order-number"]').should('contain', '12345')
      cy.get('[data-testid="order-confirm"]')
        .should('contain', 'идентификатор заказа')
        .should('contain', 'Ваш заказ начали готовить')
        .should('contain', 'Дождитесь готовности на орбитальной станции')
    }

    it('должен создавать заказ и отображать модальное окно с данными', () => {
      cy.contains('2934')
      createOrder()
      checkOrderModal()
    })

    it('должен отображать состояние загрузки при создании заказа', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 200,
        body: mockOrder,
        delay: 2000
      }).as('createOrderDelayed')

      cy.get('[data-testid="order-button"]').click()

      // Проверяем состояние загрузки и счетчик времени
      cy.get('[data-testid="order-button"]')
        .should('be.disabled')
        .should('contain', 'Оформление...')
      
      cy.contains('Создаем заказ...').should('be.visible')
      cy.contains('0/15 сек').should('be.visible')
      
      cy.wait(1000)
      cy.contains('1/15 сек').should('be.visible')

      cy.wait('@createOrderDelayed')
      cy.get('[data-testid="modal-overlay"]').should('be.visible')
    })

    it('должен закрывать модальное окно разными способами (по кнопке закрытия, по клику на фон, по клавише Esc) и очищать конструктор', () => {
      // Создаем заказ один раз
      createOrder()
      cy.get('[data-testid="modal-overlay"]').should('be.visible')

      // Тестируем закрытие через кнопку закрытия
      cy.get('[data-testid="modal-close-button"]').click()
      cy.get('[data-testid="modal-overlay"]').should('not.exist')

      // Создаем заказ снова для следующего теста
      cy.buildBurger()
      createOrder()
      cy.get('[data-testid="modal-overlay"]').should('be.visible')

      // Тестируем закрытие через клик на фон
      cy.get('[data-testid="modal-overlay"]').click({ force: true })
      cy.get('[data-testid="modal-overlay"]').should('not.exist')

      // Создаем заказ снова для следующего теста
      cy.buildBurger()
      createOrder()
      cy.get('[data-testid="modal-overlay"]').should('be.visible')

      // Тестируем закрытие через Escape
      cy.get('body').type('{esc}')
      cy.get('[data-testid="modal-overlay"]').should('not.exist')

      // Проверяем очистку конструктора
      cy.get('[data-testid="constructor-ingredient"]').should('not.exist')
      cy.get('[data-testid="order-button"]').should('not.exist')
    })
  })

  describe('Неавторизованный пользователь и валидация', () => {
    it('должен перенаправлять на страницу логина и сохранять состояние конструктора', () => {
      cy.clearState()
      cy.buildBurger()
      
      cy.get('[data-testid="order-button"]').click()
      cy.url().should('include', '/login')

      // Авторизуемся
      cy.get('input[type="email"]').type('chertchill@yandex.ru')
      cy.get('input[type="password"]').type('123')
      cy.get('button[type="submit"]').click()
      cy.wait('@login')
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Проверяем сохранение состояния конструктора
      cy.get('[data-testid="constructor-ingredient"]')
        .should('have.length', 1)
        .should('contain', 'Биокотлета из марсианской Магнолии')
      cy.get('[data-testid="bun-top-drop-zone"]')
        .should('contain', 'Краторная булка N-200i (верх)')
      cy.get('[data-testid="bun-bottom-drop-zone"]')
        .should('contain', 'Краторная булка N-200i (низ)')
      cy.get('[data-testid="order-button"]')
        .should('be.visible')
        .should('not.be.disabled')
    })

    it('должен валидировать заказ и отображать соответствующие ошибки', () => {
      cy.login()
      
      // Вспомогательная функция для проверки ошибки валидации
      const checkValidationError = (errorText) => {
        cy.get('[data-testid="order-error"]')
          .should('be.visible')
          .should('contain', errorText)
        cy.get('[data-testid="modal-overlay"]').should('not.exist')
      }

      // Проверяем отсутствие кнопки без ингредиентов
      cy.get('[data-testid="order-button"]').should('not.exist')

      // Тестируем валидацию без булки
      cy.addOnlyFilling()
      cy.get('[data-testid="order-button"]').click()
      checkValidationError('Необходимо выбрать булку')

      // Тестируем валидацию без начинки
      cy.reload()
      cy.waitForIngredients()
      cy.addOnlyBun()
      cy.get('[data-testid="order-button"]').click()
      checkValidationError('Необходимо добавить начинку')
    })

    it('должен отображать ошибку при неудачном создании заказа', () => {
      cy.login()
      
      cy.intercept('POST', '**/api/orders', {
        statusCode: 500,
        body: { success: false, message: 'Ошибка сервера' }
      }).as('createOrderError')

      cy.buildBurger()
      cy.get('[data-testid="order-button"]').click()
      cy.wait('@createOrderError')

      cy.get('[data-testid="order-error"]')
        .should('be.visible')
        .should('contain', 'Ошибка 500')
      cy.get('[data-testid="modal-overlay"]').should('not.exist')
    })
  })
})
