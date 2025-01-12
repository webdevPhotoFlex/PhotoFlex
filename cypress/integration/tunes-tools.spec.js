import 'cypress-file-upload';

describe('Функциональность инструмента Tunes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('render Tunes component', () => {
    cy.get('[data-testid="tunes-component"]').should('exist');
  });

  it('должны отображаться элементы управления настройками', () => {
    const tunes = [
      'brightness',
      'contrast',
      'saturation',
      'sharpness',
    ];
    tunes.forEach((tune) => {
      cy.get(`[aria-label="${tune}"]`).should('exist');
    });
  });

  it('ползунок настройки яркости должен изменять яркость изображения', () => {
    cy.get('[aria-label="brightness"]').should('have.value', '50');
    cy.get('[aria-label="brightness"]')
      .invoke('val', 30)
      .trigger('input', { force: true });
    cy.wait(500);
    cy.get('[data-testid="canvasMain"]').should('exist');
    cy.get('[data-testid="canvasMain"]')
      .invoke('attr', 'data-brightness')
      .should('eq', '30');
  });

  it('ползунок настройки контраста должен изменять контраст изображения', () => {
    cy.get('[aria-label="contrast"]').should('have.value', '50');
    cy.get('[aria-label="contrast"]')
      .invoke('val', 30)
      .trigger('input', { force: true });
    cy.wait(500);
    cy.get('[data-testid="canvasMain"]').should('exist');
    cy.get('[data-testid="canvasMain"]')
      .invoke('attr', 'data-contrast')
      .should('eq', '30');
  });

  it('ползунок настройки насыщенности должен изменять насыщенность изображения', () => {
    cy.get('[aria-label="saturation"]').should('have.value', '50');
    cy.get('[aria-label="saturation"]')
      .invoke('val', 30)
      .trigger('input', { force: true });
    cy.wait(500);
    cy.get('[data-testid="canvasMain"]').should('exist');
    cy.get('[data-testid="canvasMain"]')
      .invoke('attr', 'data-saturation')
      .should('eq', '30');
  });

  it('ползунок настройки резкости должен изменять резкость изображения', () => {
    cy.get('[aria-label="sharpness"]').should('have.value', '50');
    cy.get('[aria-label="sharpness"]')
      .invoke('val', 30)
      .trigger('input', { force: true });
    cy.wait(500);
    cy.get('[data-testid="canvasMain"]').should('exist');
    cy.get('[data-testid="canvasMain"]')
      .invoke('attr', 'data-sharpness')
      .should('eq', '30');
  });
});
