import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

const url = 'http://localhost:8080';
const successData = {
  numeroBip: 123456,
  valida: true,
  saldo: 10000
};
const failData = {
  numeroBip: 123456,
  valida: false,
};

Given('I open Home page', () => {
  cy.visit(url);
});

When('the user type a card number', () => {
  cy.get('#card-number-input')
    .type('123456');
});

When('click on get balance button', () => {
  /* workaround for #95 
    https://github.com/cypress-io/cypress/issues/95
  */
  cy.window().then((win) => {
    const fetchBodyResponse = JSON.stringify(successData);
    const response = new Response(fetchBodyResponse,{
      status: 200,
      headers: {
        'Content-type': 'application/json'
      },
    });
    win.fetch = () => Promise.resolve(response);

    cy.get('#get-balance')
      .click();
  });
});

When('click on get balance button for failing request', () => {
  /* workaround for #95 
    https://github.com/cypress-io/cypress/issues/95
  */
  cy.window().then((win) => {
    const fetchBodyResponse = JSON.stringify(failData);
    const response = new Response(fetchBodyResponse,{
      status: 200,
      headers: {
        'Content-type': 'application/json'
      },
    });
    win.fetch = () => Promise.resolve(response);

    cy.get('#get-balance')
      .click();
  });
});

Then('the user see the balance', () => {
  cy.get('.results h2')
    .invoke('text')
    .should('contains', 'Último saldo registrado');

  const expectedBalance = `${successData.saldo}`
    .replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      "$1."
    );
  cy.get('.results h3')
    .invoke('text')
    .should('contains', `$${expectedBalance}`)
});

Then('the user see the error', () => {
  cy.get('.results h2')
    .invoke('text')
    .should('contains', 'Error');

  cy.get('.results h3 .visible')
    .invoke('text')
    .should('be.oneOf', ['💔', '😭', '😥', '🥺', '😣'])
});
