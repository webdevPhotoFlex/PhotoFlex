import 'cypress-file-upload';
describe('Функциональность главной страницы', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // eslint-disable-next-line jest/expect-expect
  it('должна корректно отображаться главная страница', () => {
    cy.get('[data-testid="header"]').should('be.visible');
    cy.get('[data-testid="toolbar"]').should('be.visible');
    cy.get('[data-testid="tools-component"]').should('be.visible');
    cy.get('[data-testid="upload-container"]').should('be.visible');
  });
  // eslint-disable-next-line jest/expect-expect
  it('должны отображаться все иконки тулбара', () => {
    cy.get('[data-testid="icon-0"]').should('be.visible');
    cy.get('[data-testid="icon-1"]').should('be.visible');
    cy.get('[data-testid="icon-2"]').should('be.visible');
    cy.get('[data-testid="icon-3"]').should('be.visible');
    cy.get('[data-testid="icon-4"]').should('be.visible');
    cy.get('[data-testid="icon-5"]').should('be.visible');
    cy.get('[data-testid="icon-6"]').should('be.visible');
    cy.get('[data-testid="icon-7"]').should('be.visible');
  });
  // eslint-disable-next-line jest/expect-expect
  it('должны отображаться все иконки хэдера', () => {
    cy.get('[data-testid="logo"]').should('be.visible');
    cy.get('[data-testid="undo-icon"]').should('be.visible');
    cy.get('[data-testid="redo-icon"]').should('be.visible');
    cy.get('[data-testid="flip-icon"]').should('be.visible');
    cy.get('[data-testid="reset-icon"]').should('be.visible');
  });
  // eslint-disable-next-line jest/expect-expect
  it('при клике на иконки инстументов должны открываться настройки', () => {
    cy.get('[data-testid="icon-0"]').should('be.visible');
    cy.get('[data-testid="icon-0"]').click();
    cy.get('[data-testid="tunes-component"]').should('be.visible');

    cy.get('[data-testid="icon-1"]').should('be.visible');
    cy.get('[data-testid="icon-1"]').click();
    cy.get('[data-testid="tunes-component"]').should('not.exist');
    cy.get('[data-testid="crop-component"]').should('be.visible');

    cy.get('[data-testid="icon-2"]').should('be.visible');
    cy.get('[data-testid="icon-2"]').click();
    cy.get('[data-testid="crop-component"]').should('not.exist');
    cy.get('[data-testid="rotate-component"]').should('be.visible');

    cy.get('[data-testid="icon-3"]').should('be.visible');
    cy.get('[data-testid="icon-3"]').click();
    cy.get('[data-testid="rotate-component"]').should('not.exist');
    cy.get('[data-testid="resize-component"]').should('be.visible');

    cy.get('[data-testid="icon-4"]').should('be.visible');
    cy.get('[data-testid="icon-4"]').click();
    cy.get('[data-testid="resize-component"]').should('not.exist');
    cy.get('[data-testid="filters-component"]').should('be.visible');

    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'validToken');
    });

    cy.reload();
    cy.get('[data-testid="icon-5"]').should('be.visible');
    cy.get('[data-testid="icon-5"]').click();
    cy.get('[data-testid="filters-component"]').should('not.exist');
    cy.get('[data-testid="remove-bg-component"]').should(
      'be.visible'
    );
    cy.get('[data-testid="icon-6"]').should('be.visible');
    cy.get('[data-testid="icon-6"]').click();
    cy.get('[data-testid="remove-bg-component"]').should('not.exist');
    cy.get('[data-testid="replace-bg-component"]').should(
      'be.visible'
    );

    cy.get('[data-testid="icon-7"]').should('be.visible');
    cy.get('[data-testid="icon-7"]').click();
    cy.get('[data-testid="replace-bg-component"]').should(
      'not.exist'
    );
  });
  // eslint-disable-next-line jest/expect-expect
  it('должна загружаться фотка и работать удаление и сохранение', () => {
    cy.get('[data-testid="upload-container"]').should('be.visible');
    cy.get('[data-testid="upload-container-button"]').attachFile(
      './../fixtures/2-test.jpeg'
    );
    cy.get('[data-testid="canvasMain"]').should('be.visible');

    cy.get('[data-testid="save-icon"]').click();

    cy.get('[data-testid="reset-icon"]').should('be.visible');
    cy.get('[data-testid="reset-icon"]').click();
    cy.get('[data-testid="canvasMain"]').should('not.exist');
    cy.get('[data-testid="upload-container"]').should('be.visible');
  });
  it('должна рабоатть отмена действий и до/после', () => {
    cy.get('[data-testid="upload-container"]').should('be.visible');
    cy.get('[data-testid="upload-container-button"]').attachFile(
      './../fixtures/2-test.jpeg'
    );
    cy.get('[data-testid="canvasMain"]').should('be.visible');

    cy.get('[data-testid="undo-icon"]').should('be.visible');
    cy.get('[data-testid="redo-icon"]').should('be.visible');
    cy.get('[data-testid="flip-icon"]').should('be.visible');

    cy.get('[data-testid="icon-4"]').should('be.visible');
    cy.get('[data-testid="icon-4"]').click();
    cy.get('[data-testid="resize-component"]').should('not.exist');
    cy.get('[data-testid="filters-component"]').should('be.visible');
    cy.get('[data-testid="filter-2"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((win) => {
      const currentFilter = win.store.getState().image.filter;
      // eslint-disable-next-line jest/valid-expect
      expect(currentFilter).to.eq('sepia');
    });
    cy.get('[data-testid="undo-icon"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    cy.log('Нажата иконка "Undo"');

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((win) => {
      const currentFilter = win.store.getState().image.filter;
      // eslint-disable-next-line jest/valid-expect
      expect(currentFilter).to.eq('none');
    });

    cy.get('[data-testid="redo-icon"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((win) => {
      const currentFilter = win.store.getState().image.filter;
      // eslint-disable-next-line jest/valid-expect
      expect(currentFilter).to.eq('sepia');
      cy.log('Фильтр повторно применен в Redux store');
    });
    cy.get('[data-testid="flip-icon"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  });
});
