import { mockIngredients, mockUser, mockTokens, mockOrder, SELECTORS } from '../support/testData'

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
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="bun"]')
        .first()
        .should('be.visible')

      // Перемещаем булку в верхнюю зону конструктора
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="bun"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get(SELECTORS.BUN_TOP_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что булка появилась в конструкторе
      cy.get(SELECTORS.BUN_TOP_DROP_ZONE)
        .should('contain', 'Краторная булка N-200i (верх)')
      
      cy.get(SELECTORS.BUN_BOTTOM_DROP_ZONE)
        .should('contain', 'Краторная булка N-200i (низ)')

      // Проверяем, что счетчик булки стал равен 2
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="bun"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('contain', '2')
    })

    it('должен перемещать ингредиент в конструктор', () => {
      // Перемещаем соус
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что соус появился в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .should('contain', 'Соус Spicy-X')

      // Проверяем, что счетчик соуса стал равен 1
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('contain', '1')
    })

    it('должен перемещать несколько ингредиентов в конструктор', () => {
      // Добавляем начинку
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Добавляем соус
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что все ингредиенты появились в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .should('have.length', 2)
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .first()
        .should('contain', 'Биокотлета из марсианской Магнолии')
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .last()
        .should('contain', 'Соус Spicy-X')

      // Проверяем счетчики ингредиентов
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="main"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('contain', '1')

      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('contain', '1')
    })

    it('должен перемещать ингредиенты внутри конструктора', () => {
      // Добавляем два ингредиента
      // Добавляем первый ингредиент (начинку)
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Добавляем второй ингредиент (соус)
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем начальный порядок
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .should('have.length', 2)
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .first()
        .should('contain', 'Биокотлета из марсианской Магнолии')
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .last()
        .should('contain', 'Соус Spicy-X')

      // Перемещаем первый элемент на место второго
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .first()
        .then(($firstElement) => {
          cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
            .last()
            .then(($lastElement) => {
              const firstRect = $firstElement[0].getBoundingClientRect()
              const lastRect = $lastElement[0].getBoundingClientRect()
              
              // Перемещаем первый элемент на второй
              cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
                .first()
                .trigger('mousedown', { 
                  which: 1,
                  clientX: firstRect.left + firstRect.width / 2,
                  clientY: firstRect.top + firstRect.height / 2
                })
                .trigger('dragstart')
              
              cy.wait(100)
              
              cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
                .last()
                .trigger('dragover', { 
                  clientX: lastRect.left + lastRect.width / 2,
                  clientY: lastRect.top + lastRect.height / 2 + 5,
                  force: true 
                })
              
              cy.wait(100)
              
              cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
                .last()
                .trigger('drop', { 
                  clientX: lastRect.left + lastRect.width / 2,
                  clientY: lastRect.top + lastRect.height / 2 + 5,
                  force: true 
                })
              
              cy.wait(100)
              
              cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
                .first()
                .trigger('dragend')
                .trigger('mouseup', { which: 1 })
            })
        })

      // Проверяем, что порядок изменился - первый элемент стал вторым
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .first()
        .should('contain', 'Соус Spicy-X')
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .last()
        .should('contain', 'Биокотлета из марсианской Магнолии')
    })
  })

  describe('Удаление ингредиентов из конструктора', () => {
    it('должен удалять ингредиент из конструктора', () => {
      // Добавляем ингредиент из main
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что ингредиент есть в конструкторе
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .should('have.length', 1)
        .should('contain', 'Биокотлета из марсианской Магнолии')

      // Проверяем, что счетчик ингредиента равен 1
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="main"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('contain', '1')

      // Находим и кликаем кнопку удаления (constructor-element__action)
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .find(SELECTORS.CONSTRUCTOR_ELEMENT_ACTION)
        .click()

      // Проверяем, что ингредиент удален
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .should('not.exist')

      // Проверяем, что счетчик ингредиента исчез
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="main"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('not.exist')
    })

    it('должен добавлять и удалять несколько одинаковых ингредиентов с изменением счетчика', () => {
      // Добавляем первый соус
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Добавляем второй такой же соус
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart')
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем, что счетчик соуса равен 2
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('contain', '2')

      // Удаляем один ингредиент из конструктора
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT)
        .first()
        .find(SELECTORS.CONSTRUCTOR_ELEMENT_ACTION)
        .click()

      cy.wait(100)

      // Проверяем, что счетчик уменьшился до 1
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="sauce"]')
        .first()
        .find(SELECTORS.COUNTER)
        .should('contain', '1')
    })
  })

  describe('Отображение стоимости', () => {
    it('должен отображать общую стоимость бургера', () => {
      // Добавляем булку
      cy.get(SELECTORS.INGREDIENT_ITEM)
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
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .filter('[data-ingredient-type="main"]')
        .first()
        .trigger('dragstart')
      
      cy.wait(100)
      
      cy.get(SELECTORS.MIDDLE_INGREDIENTS_DROP_ZONE)
        .trigger('drop')
      
      cy.wait(100)

      // Проверяем обновленную стоимость (2510 + 424 = 2934)
      cy.contains('2934')
    })
  })
})
