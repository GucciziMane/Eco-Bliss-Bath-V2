/// <reference types="cypress" />

describe("Test Connexion", () => {
  // on va sur la page login avant chaque test
  beforeEach(() => {
    cy.visit("/#/login");
  });

  it("affiche le formulaire de connexion", () => {
    cy.get("[data-cy=login-form]").should("be.visible");
    cy.get("[data-cy=login-input-username]").should("be.visible");
    cy.get("[data-cy=login-input-password]").should("be.visible");
    cy.get("[data-cy=login-submit]").should("be.visible");
  });

  it("se connecter avec les bons identifiants", () => {
    cy.fixture("users").then((users) => {
      cy.get("[data-cy=login-input-username]").type(users.validUser.username);
      cy.get("[data-cy=login-input-password]").type(users.validUser.password);
      cy.get("[data-cy=login-submit]").click();

      // apres connexion on doit voir le panier et la deconnexion
      cy.get("[data-cy=nav-link-cart]").should("be.visible");
      cy.get("[data-cy=nav-link-logout]").should("be.visible");
      // et le bouton connexion ne doit plus etre la
      cy.get("[data-cy=nav-link-login]").should("not.exist");
    });
  });

  it("erreur avec des mauvais identifiants", () => {
    cy.fixture("users").then((users) => {
      cy.get("[data-cy=login-input-username]").type(users.invalidUser.username);
      cy.get("[data-cy=login-input-password]").type(users.invalidUser.password);
      cy.get("[data-cy=login-submit]").click();

      cy.get("[data-cy=login-errors]").should("be.visible");
      cy.get("[data-cy=login-errors]").should("contain", "Identifiants incorrects");
    });
  });

  it("erreur si les champs sont vides", () => {
    cy.get("[data-cy=login-submit]").click();
    cy.get("[data-cy=login-errors]").should("be.visible");
  });

  it("se deconnecter apres connexion", () => {
    cy.fixture("users").then((users) => {
      cy.get("[data-cy=login-input-username]").type(users.validUser.username);
      cy.get("[data-cy=login-input-password]").type(users.validUser.password);
      cy.get("[data-cy=login-submit]").click();

      cy.get("[data-cy=nav-link-cart]").should("be.visible");

      // on clique sur deconnexion
      cy.get("[data-cy=nav-link-logout]").click();

      // le bouton connexion doit revenir
      cy.get("[data-cy=nav-link-login]").should("be.visible");
      cy.get("[data-cy=nav-link-cart]").should("not.exist");
    });
  });
});
