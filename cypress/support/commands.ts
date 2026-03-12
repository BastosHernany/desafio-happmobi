// comandos customizados se necessário
// Ex.: login via UI helper
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, senha: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, senha: string) => {
  cy.visit('/');
  cy.get('#email').clear().type(email);
  cy.get('#senha').clear().type(senha);
  cy.contains('ENTRAR').click();
});

export {}
