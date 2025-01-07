describe('Authentication Flow E2E Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('Регистрация пользователя через модальное окно', () => {
    cy.get('[data-testid="PersonAddIcon"]').click();
    cy.get('[data-testid="login-modal"]').should('be.visible');
    cy.get('[data-testid="login-modal"]').within(() => {
      cy.get('[data-testid="sign-in-title"]')
        .should('be.visible')
        .and('contain', 'sign in');
      cy.get('#login-input').should('be.visible');
      cy.get('#password-input').should('be.visible');
      cy.get('button[type="submit"]')
        .should('be.visible')
        .and('contain', 'submit');
      cy.get('[data-testid="signup-link"]')
        .should('be.visible')
        .and('contain', 'sign up');
      cy.get('[data-testid="social-btn-google"]').should(
        'be.visible'
      );
      cy.get('[data-testid="social-btn-telegram"]').should(
        'be.visible'
      );
    });
    cy.get(
      '[data-testid="login-modal"] [data-testid="signup-link"]'
    ).click();
    cy.get('[data-testid="register-modal"]').should('be.visible');
    cy.get('[data-testid="register-modal"]').within(() => {
      cy.get('[data-testid="sign-up-title"]')
        .should('be.visible')
        .and('contain', 'sign up');
      cy.get('[data-testid="login-input"]').should('be.visible');
      cy.get('[data-testid="username-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('button[type="submit"]')
        .should('be.visible')
        .and('contain', 'submit');
      cy.get('[data-testid="signin-link"]')
        .should('be.visible')
        .and('contain', 'sign in');
      cy.get('[data-testid="social-btn-google"]').should(
        'be.visible'
      );
      cy.get('[data-testid="social-btn-telegram"]').should(
        'be.visible'
      );
    });
    cy.get('[data-testid="login-input"]').type('test1@gmail.com');
    cy.get('[data-testid="username-input"]').type('New_User');
    cy.get('[data-testid="password-input"]').type(
      'securePassword123'
    );
    cy.get('button[type="submit"]').click();
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'validToken');
    });
    cy.get('[data-testid="auth-modal"]').should('not.exist');
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'validToken');
    });
    cy.reload();
    cy.get('[data-testid="account-icon"]').click();
    cy.location('pathname').should(
      'eq',
      '/PhotoFlex/personal-account'
    );
    cy.get('[data-testid="username-container"]').should('be.visible');

    cy.get('[data-testid="edit-icon"]').should('be.visible');
    cy.get('[data-testid="edit-icon"]').click();
    cy.get('[data-testid="username-input"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="user-data"][name="phone"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="user-data"][name="email"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="user-data"][name="telegram"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="username-input"]')
      .clear()
      .type('Updated_User');
    cy.get('[data-testid="user-data"][name="phone"]')
      .clear()
      .type('+7 123 456 78 90');
    cy.get('[data-testid="user-data"][name="email"]')
      .clear()
      .type('updated_email@example.com');
    cy.get('[data-testid="user-data"][name="telegram"]')
      .clear()
      .type('@updatedtelegram');

    cy.get('[data-testid="username-input"]').should(
      'have.value',
      'Updated_User'
    );
    cy.get('[data-testid="user-data"][name="phone"]').should(
      'have.value',
      '+7 123 456 78 90'
    );
    cy.get('[data-testid="user-data"][name="email"]').should(
      'have.value',
      'updated_email@example.com'
    );
    cy.get('[data-testid="user-data"][name="telegram"]').should(
      'have.value',
      '@updatedtelegram'
    );
    cy.get('[data-testid="photos-container"]').should('be.visible');

    // Проверяем наличие стрелочек навигации
    cy.get('[data-testid="arrow-back"]').should('be.visible');
    cy.get('[data-testid="arrow-forward"]').should('be.visible');
    cy.get('[data-testid^="photo-"]').should('have.length', 3);

    let firstPhotoUrlBefore;
    cy.get('[data-testid="photo-0"]')
      .invoke('css', 'background-image')
      .then((bg) => {
        firstPhotoUrlBefore = bg.match(/url\("?(.*?)"?\)/)[1];
      });
    cy.get('[data-testid="arrow-forward"]').click();

    cy.get('[data-testid="photo-0"]')
      .invoke('css', 'background-image')
      .should((bg) => {
        const firstPhotoUrlAfter = bg.match(/url\("?(.*?)"?\)/)[1];
        // eslint-disable-next-line jest/valid-expect
        expect(firstPhotoUrlAfter).not.to.eq(firstPhotoUrlBefore);
      });

    cy.get('[data-testid="arrow-back"]').click();

    cy.get('[data-testid="photo-0"]')
      .invoke('css', 'background-image')
      .should((bg) => {
        const firstPhotoUrlAfterBack =
          bg.match(/url\("?(.*?)"?\)/)[1];
        // eslint-disable-next-line jest/valid-expect
        expect(firstPhotoUrlAfterBack).to.eq(firstPhotoUrlBefore);
      });
  });
});
