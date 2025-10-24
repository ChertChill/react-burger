import { mockIngredients, mockUser, mockTokens, mockOrder, SELECTORS } from '../support/testData'

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
      cy.get(SELECTORS.ORDER_BUTTON).click()
      cy.wait('@createOrder')
    }

    // Вспомогательная функция для проверки модального окна
    const checkOrderModal = () => {
      cy.get(SELECTORS.MODAL_OVERLAY).should('be.visible')
      cy.get(SELECTORS.ORDER_CONFIRM).should('be.visible')
      cy.get(SELECTORS.ORDER_NUMBER).should('contain', '12345')
      cy.get(SELECTORS.ORDER_CONFIRM)
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

      cy.get(SELECTORS.ORDER_BUTTON).click()

      // Проверяем состояние загрузки и счетчик времени
      cy.get(SELECTORS.ORDER_BUTTON)
        .should('be.disabled')
        .should('contain', 'Оформление...')
      
      cy.contains('Создаем заказ...').should('be.visible')
      cy.contains('0/15 сек').should('be.visible')
      
      cy.wait(1000)
      cy.contains('1/15 сек').should('be.visible')

      cy.wait('@createOrderDelayed')
      cy.get(SELECTORS.MODAL_OVERLAY).should('be.visible')
    })

    it('должен закрывать модальное окно разными способами (по кнопке закрытия, по клику на фон, по клавише Esc) и очищать конструктор', () => {
      // Создаем заказ один раз
      createOrder()
      cy.get(SELECTORS.MODAL_OVERLAY).should('be.visible')

      // Тестируем закрытие через кнопку закрытия
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click()
      cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist')

      // Создаем заказ снова для следующего теста
      cy.buildBurger()
      createOrder()
      cy.get(SELECTORS.MODAL_OVERLAY).should('be.visible')

      // Тестируем закрытие через клик на фон
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true })
      cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist')

      // Создаем заказ снова для следующего теста
      cy.buildBurger()
      createOrder()
      cy.get(SELECTORS.MODAL_OVERLAY).should('be.visible')

      // Тестируем закрытие через Escape
      cy.get(SELECTORS.BODY).type('{esc}')
      cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist')

      // Проверяем очистку конструктора
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('not.exist')
      cy.get(SELECTORS.ORDER_BUTTON).should('not.exist')
    })
  })

  describe('Неавторизованный пользователь и валидация', () => {
    it('должен перенаправлять на страницу логина и сохранять состояние конструктора', () => {
      cy.clearState()
      cy.buildBurger()
      
      cy.get(SELECTORS.ORDER_BUTTON).click()
      cy.url().should('include', '/login')

      // Авторизуемся
      cy.get(SELECTORS.EMAIL_INPUT).type('chertchill@yandex.ru')
      cy.get(SELECTORS.PASSWORD_INPUT).type('123')
      cy.get(SELECTORS.SUBMIT_BUTTON).click()
      cy.wait('@login')
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Проверяем сохранение состояния конструктора
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .should('have.length', 1)
        .should('contain', 'Биокотлета из марсианской Магнолии')
      cy.get(SELECTORS.BUN_TOP_DROP_ZONE)
        .should('contain', 'Краторная булка N-200i (верх)')
      cy.get(SELECTORS.BUN_BOTTOM_DROP_ZONE)
        .should('contain', 'Краторная булка N-200i (низ)')
      cy.get(SELECTORS.ORDER_BUTTON)
        .should('be.visible')
        .should('not.be.disabled')
    })

    it('должен валидировать заказ и отображать соответствующие ошибки', () => {
      cy.login()
      
      // Вспомогательная функция для проверки ошибки валидации
      const checkValidationError = (errorText) => {
        cy.get(SELECTORS.ORDER_ERROR)
          .should('be.visible')
          .should('contain', errorText)
        cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist')
      }

      // Проверяем отсутствие кнопки без ингредиентов
      cy.get(SELECTORS.ORDER_BUTTON).should('not.exist')

      // Тестируем валидацию без булки
      cy.addOnlyFilling()
      cy.get(SELECTORS.ORDER_BUTTON).click()
      checkValidationError('Необходимо выбрать булку')

      // Тестируем валидацию без начинки
      cy.reload()
      cy.waitForIngredients()
      cy.addOnlyBun()
      cy.get(SELECTORS.ORDER_BUTTON).click()
      checkValidationError('Необходимо добавить начинку')
    })

    it('должен отображать ошибку при неудачном создании заказа', () => {
      cy.login()
      
      cy.intercept('POST', '**/api/orders', {
        statusCode: 500,
        body: { success: false, message: 'Ошибка сервера' }
      }).as('createOrderError')

      cy.buildBurger()
      cy.get(SELECTORS.ORDER_BUTTON).click()
      cy.wait('@createOrderError')

      cy.get(SELECTORS.ORDER_ERROR)
        .should('be.visible')
        .should('contain', 'Ошибка 500')
      cy.get(SELECTORS.MODAL_OVERLAY).should('not.exist')
    })
  })
})
