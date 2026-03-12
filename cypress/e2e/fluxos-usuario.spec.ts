describe('Fluxos de usuário - E2E', () => {
  const user = { id: 'u-test', nome: 'Test User', email: 'test@example.com', senha: 'senha123' };
  const carro = { id: 'c-test', name: 'Carro Teste', year: '2020', type: 'Hatch', engine: '1.6', size: '04' };

  it('Cadastro e login', () => {
    // interceptar criação de usuário
    cy.intercept('POST', '**/usuarios', { statusCode: 201, body: { ...user } }).as('criarUsuario');
    // criar conta
    cy.visit('/criar-conta');
    cy.get('#nome').type(user.nome);
    cy.get('#email').type(user.email);
    cy.get('#senha').type(user.senha);
    cy.get('#confirmaSenha').type(user.senha);
    cy.contains('CRIAR').click();
    cy.wait('@criarUsuario');

    // interceptar login (GET users filter)
    cy.intercept('GET', '**/usuarios*', { statusCode: 200, body: [user] }).as('loginReq');
    // efetuar login
    cy.visit('/');
    cy.get('#email').type(user.email);
    cy.get('#senha').type(user.senha);
    cy.contains('ENTRAR').click();
    cy.wait('@loginReq');
    // após login deve redirecionar para /inicio
    cy.url().should('include', '/inicio');
  });

  it('Reservar um veículo via Filtro', () => {
    // intercepções para listar carros e reservas
    cy.intercept('GET', '**/carros*', { statusCode: 200, body: [carro] }).as('listarCarros');
    cy.intercept('GET', '**/reservas*', { statusCode: 200, body: [] }).as('listarPorUsuario');
    cy.intercept('GET', '**/reservas*', { statusCode: 200, body: [] }).as('listarTodas');
    cy.intercept('POST', '**/reservas', { statusCode: 201, body: { id: 'r1', usuarioId: user.id, carroId: carro.id } }).as('criarReserva');

    cy.visit('/filtro', {
      onBeforeLoad(win) {
        win.localStorage.setItem('app_token', 'fake-token');
        win.localStorage.setItem('app_user', JSON.stringify(user));
      }
    });
    // aplicar filtro vazio para exibir lista
    cy.contains('APLICAR FILTRO').click();
    cy.wait('@listarCarros');
    cy.get('button').contains('Reservar agora').first().click();
    // confirmação modal aparece
    cy.contains('Confirmar reserva').should('be.visible');
    cy.contains('Sim').click();
    cy.wait('@criarReserva');
    cy.contains('Reserva criada com sucesso').should('exist');
  });

  it('Finalizar reserva em Agendamentos', () => {
    // retornar reservas do usuário com a criada
    const reserva = { id: 'r1', usuarioId: user.id, carroId: carro.id };
    cy.intercept('GET', '**/reservas*', { statusCode: 200, body: [reserva] }).as('listarPorUsuario2');
    cy.intercept('GET', `**/carros/${carro.id}`, { statusCode: 200, body: carro }).as('obterCarro');
    cy.intercept('DELETE', `**/reservas/${reserva.id}`, { statusCode: 200, body: {} }).as('deletarReserva');

    cy.visit('/agendamentos', {
      onBeforeLoad(win) {
        win.localStorage.setItem('app_token', 'fake-token');
        win.localStorage.setItem('app_user', JSON.stringify(user));
      }
    });
    cy.wait('@listarPorUsuario2');
    // clicar em Finalizar reserva
    cy.contains('Finalizar reserva').click();
    cy.contains('Sim').click();
    cy.wait('@deletarReserva');
    cy.contains('Finalização da reserva realizada com sucesso.').should('exist');
  });
});
