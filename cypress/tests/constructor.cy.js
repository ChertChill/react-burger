import { mockIngredients, mockUser, mockTokens, mockOrder } from '../support/testData'

describe('Конструктор бургеров', () => {
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

    // Переходим на главную страницу
    cy.visit('/')
    
    // Ожидаем загрузки ингредиентов
    cy.wait('@getIngredients')
    cy.waitForIngredients()
  })

  describe('Перемещение ингредиентов', () => {
    it('должен перемещать булку в конструктор', () => {
      // Находим булку в списке ингредиентов
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="bun"]')
        .first()
        .should('be.visible')

      // Перемещаем булку в верхнюю зону конструктора
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="bun"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="bun-top-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что булка появилась в конструкторе
      cy.get('[data-testid="bun-top-drop-zone"]')
        .should('contain', 'Краторная булка N-200i (верх)')
      
      cy.get('[data-testid="bun-bottom-drop-zone"]')
        .should('contain', 'Краторная булка N-200i (низ)')

      // Проверяем, что счетчик булки стал равен 2
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="bun"]')
        .first()
        .find('.counter')
        .should('contain', '2')
    })

    it('должен перемещать ингредиент в конструктор', () => {
      // Перемещаем соус
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что соус появился в конструкторе
      cy.get('[data-testid="constructor-ingredient"]')
        .should('contain', 'Соус Spicy-X')

      // Проверяем, что счетчик соуса стал равен 1
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find('.counter')
        .should('contain', '1')
    })

    it('должен перемещать несколько ингредиентов в конструктор', () => {
      // Добавляем начинку
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Добавляем соус
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что все ингредиенты появились в конструкторе
      cy.get('[data-testid="constructor-ingredient"]')
        .should('have.length', 2)
      
      cy.get('[data-testid="constructor-ingredient"]')
        .first()
        .should('contain', 'Биокотлета из марсианской Магнолии')
      
      cy.get('[data-testid="constructor-ingredient"]')
        .last()
        .should('contain', 'Соус Spicy-X')

      // Проверяем счетчики ингредиентов
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="main"]')
        .first()
        .find('.counter')
        .should('contain', '1')

      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find('.counter')
        .should('contain', '1')
    })

    it('должен перемещать ингредиенты внутри конструктора', () => {
      // Добавляем два ингредиента
      // Добавляем первый ингредиент (начинку)
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Добавляем второй ингредиент (соус)
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем начальный порядок
      cy.get('[data-testid="constructor-ingredient"]')
        .should('have.length', 2)
      
      cy.get('[data-testid="constructor-ingredient"]')
        .first()
        .should('contain', 'Биокотлета из марсианской Магнолии')
      
      cy.get('[data-testid="constructor-ingredient"]')
        .last()
        .should('contain', 'Соус Spicy-X')

      // Перемещаем первый элемент на место второго
      cy.get('[data-testid="constructor-ingredient"]')
        .first()
        .then(($firstElement) => {
          cy.get('[data-testid="constructor-ingredient"]')
            .last()
            .then(($lastElement) => {
              const firstRect = $firstElement[0].getBoundingClientRect()
              const lastRect = $lastElement[0].getBoundingClientRect()
              
              // Перемещаем первый элемент на второй
              cy.get('[data-testid="constructor-ingredient"]')
                .first()
                .trigger('mousedown', { 
                  which: 1,
                  clientX: firstRect.left + firstRect.width / 2,
                  clientY: firstRect.top + firstRect.height / 2
                })
                .trigger('dragstart')
              
              cy.wait(100)
              
              cy.get('[data-testid="constructor-ingredient"]')
                .last()
                .trigger('dragover', { 
                  clientX: lastRect.left + lastRect.width / 2,
                  clientY: lastRect.top + lastRect.height / 2 + 5,
                  force: true 
                })
              
              cy.wait(100)
              
              cy.get('[data-testid="constructor-ingredient"]')
                .last()
                .trigger('drop', { 
                  clientX: lastRect.left + lastRect.width / 2,
                  clientY: lastRect.top + lastRect.height / 2 + 5,
                  force: true 
                })
              
              cy.wait(100)
              
              cy.get('[data-testid="constructor-ingredient"]')
                .first()
                .trigger('dragend')
                .trigger('mouseup', { which: 1 })
            })
        })

      // Проверяем, что порядок изменился - первый элемент стал вторым
      cy.get('[data-testid="constructor-ingredient"]')
        .first()
        .should('contain', 'Соус Spicy-X')
      
      cy.get('[data-testid="constructor-ingredient"]')
        .last()
        .should('contain', 'Биокотлета из марсианской Магнолии')
    })
  })

  describe('Удаление ингредиентов из конструктора', () => {
    it('должен удалять ингредиент из конструктора', () => {
      // Добавляем ингредиент из main
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что ингредиент есть в конструкторе
      cy.get('[data-testid="constructor-ingredient"]')
        .should('have.length', 1)
        .should('contain', 'Биокотлета из марсианской Магнолии')

      // Проверяем, что счетчик ингредиента равен 1
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="main"]')
        .first()
        .find('.counter')
        .should('contain', '1')

      // Находим и кликаем кнопку удаления (constructor-element__action)
      cy.get('[data-testid="constructor-ingredient"]')
        .find('.constructor-element__action')
        .click()

      // Проверяем, что ингредиент удален
      cy.get('[data-testid="constructor-ingredient"]')
        .should('not.exist')

      // Проверяем, что счетчик ингредиента исчез
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="main"]')
        .first()
        .find('.counter')
        .should('not.exist')
    })

    it('должен добавлять и удалять несколько одинаковых ингредиентов с изменением счетчика', () => {
      // Добавляем первый соус
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Добавляем второй такой же соус
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что счетчик соуса равен 2
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find('.counter')
        .should('contain', '2')

      // Удаляем один ингредиент из конструктора
      cy.get('[data-testid="constructor-ingredient"]')
        .first()
        .find('.constructor-element__action')
        .click()

      cy.wait(100)

      // Проверяем, что счетчик уменьшился до 1
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find('.counter')
        .should('contain', '1')
    })
  })

  describe('Отображение стоимости', () => {
    it('должен отображать общую стоимость бургера', () => {
      // Добавляем булку
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="bun"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="bun-top-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем отображение стоимости (булка учитывается дважды)
      cy.contains('2510') // 1255 * 2 = 2510

      // Добавляем начинку
      cy.get('[data-testid="ingredient-item"]')
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get('[data-testid="middle-ingredients-drop-zone"]')
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем обновленную стоимость (2510 + 424 = 2934)
      cy.contains('2934')
    })
  })
})
