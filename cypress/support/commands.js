// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { GraphQLClient } from 'graphql-request';

const resetDB = () => {
  const query = `mutation {
    prepareDB {
      log
      error
    }
  }`;
  const authHeader = `Bearer ${Cypress.env('SVC_ACC_TOKEN')}`;
  new GraphQLClient('/graphql', { headers: { authorization: authHeader } })
    .rawRequest(query, null)
    .then(data => console.log(data));
};

const navigateToTemplatesSubmenu = submenuName => {
  cy.contains('Templates').click();
  cy.get(`[title='${submenuName}']`)
    .first()
    .click();
};

const login = role => {
  const testCredentialStore = {
    user: {
      email: 'Javon4@hotmail.com',
      password: 'Test1234!',
    },
    officer: {
      email: 'Aaron_Harris49@gmail.com',
      password: 'Test1234!',
    },
  };

  const credentials = testCredentialStore[role];

  cy.visit('/');

  cy.get('[data-cy=input-email] input')
    .type(credentials.email)
    .should('have.value', credentials.email);

  cy.get('[data-cy=input-password] input')
    .type(credentials.password)
    .should('have.value', credentials.password);

  cy.get('[data-cy=submit]').click();
};

Cypress.Commands.add('resetDB', resetDB);

Cypress.Commands.add('navigateToTemplatesSubmenu', navigateToTemplatesSubmenu);

Cypress.Commands.add('login', login);

// call cy.presentationMode(); before your test to have delay between clicks.
// Excellent for presentation purposes
Cypress.Commands.add('presentationMode', () => {
  const COMMAND_DELAY = 300;

  for (const command of [
    'visit',
    'click',
    'trigger',
    'type',
    'clear',
    'reload',
    'contains',
  ]) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
      const origVal = originalFn(...args);

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(origVal);
        }, COMMAND_DELAY);
      });
    });
  }
});
