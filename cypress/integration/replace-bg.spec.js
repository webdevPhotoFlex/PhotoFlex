import 'cypress-file-upload';

describe('Функциональность инструмента ReplaceBgTool', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'validToken');
    });
    cy.visit('/');
    cy.reload();
    cy.get('[data-testid="upload-container"]').should('be.visible');

    cy.get('[data-testid="upload-container-button"]').attachFile(
      './../fixtures/2-test.jpeg'
    );
    cy.get('[data-testid="canvasMain"]').should('be.visible');

    cy.get('[data-testid="icon-6"]').should('be.visible').click();
    cy.get('[data-testid="replace-bg-component"]').should(
      'be.visible'
    );
  });

  it('должен отображать слайдер для изменения размера кисти', () => {
    cy.get('input[aria-label="brush size"]').should('be.visible');
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((win) => {
      const brushSize = win.store.getState().image.brushSize;
      // eslint-disable-next-line jest/valid-expect
      expect(brushSize).to.be.a('number');
    });
  });

  it('кнопка "Заменить фон" меняет картинку', () => {
    cy.get('[data-testid="fileUploadInput1"]').attachFile(
      './../fixtures/background.jpg'
    );
    cy.get('[data-testid="replaceButton"]').click();
  });

  it('кнопка "Сброс" должна вернуть исходное изображение', () => {
    cy.get('[data-testid="fileUploadInput1"]').attachFile(
      './../fixtures/background.jpg'
    );
    cy.get('[data-testid="replaceButton"]').click();

    cy.get('[data-testid="resetImage"]').click();

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((win) => {
      const { image, imageBeforeRemove } = win.store.getState().image;
      // eslint-disable-next-line jest/valid-expect
      expect(image).to.equal(imageBeforeRemove);
    });
  });
});
