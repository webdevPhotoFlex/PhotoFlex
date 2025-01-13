import 'cypress-file-upload';

describe('Функциональность инструмента Text', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="upload-container"]').should('be.visible');
    cy.get('[data-testid="upload-container-button"]').attachFile(
      './../fixtures/2-test.jpeg'
    );
    cy.get('[data-testid="canvasMain"]').should('be.visible');
  });

  // eslint-disable-next-line jest/expect-expect
  it('должен отобразиться компонент Text при выборе соответствующего инструмента', () => {
    cy.get('[data-testid="icon-8"]').click();
    cy.get('[data-testid="text-component"]').should('be.visible');
  });

  // eslint-disable-next-line jest/expect-expect
  it('можно добавить текст с заданным содержимым', () => {
    cy.get('[data-testid="icon-8"]').click();
    cy.get('[data-testid="text-input"]').type('Пример текста');
    cy.get('[data-testid="add-text-icon"]').click();

    cy.get('[data-testid="text-list"]').should(
      'contain.text',
      'Пример текста'
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('можно удалить добавленный текст', () => {
    cy.get('[data-testid="icon-8"]').click();
    cy.get('[data-testid="text-input"]').type('Удаляемый текст');
    cy.get('[data-testid="add-text-icon"]').click();
    cy.get('[data-testid="text-list"]').should(
      'contain.text',
      'Удаляемый текст'
    );
    cy.get('[data-testid^="delete-icon"]').first().click();
    cy.get('[data-testid="text-list"]').should(
      'not.contain.text',
      'Удаляемый текст'
    );
  });

  it('можно задать цвет текста перед добавлением', () => {
    cy.get('[data-testid="icon-8"]').click();
    cy.get('[data-testid="color-block-2"]').click();
    cy.get('[data-testid="text-input"]').type(
      'Текст с заранее заданным цветом'
    );
    cy.get('[data-testid="add-text-icon"]').click();
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((win) => {
      const addedText = win.store
        .getState()
        .image.texts.find(
          (text) => text.content === 'Текст с заранее заданным цветом'
        );
      // eslint-disable-next-line jest/valid-expect
      expect(addedText.color).to.eq('red');
    });
  });

  it('можно задать размер шрифта перед добавлением текста', () => {
    cy.get('[data-testid="icon-8"]').click();
    cy.get('[data-testid="font-size-input"]').clear().type('24');
    cy.get('[data-testid="text-input"]').type(
      'Текст с измененным шрифтом'
    );
    cy.get('[data-testid="add-text-icon"]').click();
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((win) => {
      const addedText = win.store
        .getState()
        .image.texts.find(
          (text) => text.content === 'Текст с измененным шрифтом'
        );
      const actualFontSize = addedText.fontSize;
      const expectedFontSize = 24;
      const scaleFactor = 10;
      // eslint-disable-next-line jest/valid-expect
      expect(actualFontSize).to.eq(expectedFontSize * scaleFactor);
    });
  });
});
