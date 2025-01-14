import 'cypress-file-upload';

describe('Функциональность инструмента Tunes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('render Tunes component', () => {
    cy.get('[data-testid="tunes-component"]').should('exist');
  });
  it('должны отображаться элементы управления настройками', () => {
    const tunes = ['brightness', 'contrast', 'saturation', 'blur'];
    tunes.forEach((tune) => {
      cy.get(`[data-testid="${tune}-slider"]`).should('exist');
    });
  });
  const testSliderMovement = (sliderName) => {
    it(`ползунок ${sliderName} должен двигаться и изменять значение`, () => {
      const sliderSelector = `[data-testid="${sliderName}-slider"]`;
      cy.get(sliderSelector)
        .should('exist')
        .then((slider) => {
          const initialValue = parseInt(
            slider.attr('aria-valuenow'),
            10
          );
          cy.get(sliderSelector)
            .trigger('mousedown', { which: 1, force: true })
            .trigger('mousemove', { clientX: 200, force: true })
            .trigger('mouseup', { force: true });
          cy.get(sliderSelector)
            .invoke('attr', 'aria-valuenow')
            .then((newValue) => {
              expect(parseInt(newValue, 10)).to.not.eq(initialValue);
            });
        });
    });
  };
  ['brightness', 'contrast', 'saturation', 'blur'].forEach(
    (slider) => {
      testSliderMovement(slider);
    }
  );
  it('должна загружаться фотка и применяться настройки', () => {
    cy.get('[data-testid="upload-container"]').should('be.visible');
    cy.get('[data-testid="upload-container-button"]').attachFile(
      './../fixtures/2-test.jpeg'
    );
    cy.get('[data-testid="canvasMain"]').should('be.visible');
    cy.get('[data-testid="tunes-component"]').should('exist');
    cy.get('[data-testid="brightness-slider"]')
      .invoke('attr', 'aria-valuenow')
      .then((initialValue) => {
        cy.get('[data-testid="brightness-slider"]')
          .trigger('mousedown', { which: 1, force: true })
          .trigger('mousemove', { clientX: 300, force: true })
          .trigger('mouseup', { force: true });
        cy.get('[data-testid="brightness-slider"]')
          .invoke('attr', 'aria-valuenow')
          .then((newValue) => {
            expect(parseInt(newValue, 10)).to.not.eq(
              parseInt(initialValue, 10)
            );
          });
      });
    cy.get('[data-testid="canvasMain"]').then(($canvas) => {
      const ctx = $canvas[0].getContext('2d');
      const initialPixelData = ctx.getImageData(0, 0, 1, 1).data;
      const img = new Image();
      img.src = './../fixtures/2-test.jpeg';
      img.onload = () => {
        ctx.filter = `brightness(1.5)`;
        ctx.drawImage(img, 0, 0, $canvas[0].width, $canvas[0].height);
        const updatedPixelData = ctx.getImageData(0, 0, 1, 1).data;
        expect(updatedPixelData[0]).to.not.eq(initialPixelData[0]);
        expect(updatedPixelData[1]).to.not.eq(initialPixelData[1]);
        expect(updatedPixelData[2]).to.not.eq(initialPixelData[2]);
      };
    });
  });
});
