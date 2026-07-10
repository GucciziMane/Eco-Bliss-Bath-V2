/// <reference types="cypress" />

describe("Smoke Tests", () => {

  it("la page de connexion affiche les champs et le bouton", () => {
    cy.visit("/#/login");
    cy.get("[data-cy=login-input-username]").should("be.visible");
    cy.get("[data-cy=login-input-password]").should("be.visible");
    cy.get("[data-cy=login-submit]").should("be.visible");
  });

  it("la page d accueil se charge", () => {
    cy.visit("/");
    cy.get("h1").should("exist");
  });

  it("le logo et la nav sont visibles", () => {
    cy.visit("/");
    cy.get("[data-cy=nav-link-home-logo]").should("be.visible");
    cy.get("[data-cy=nav-link-products]").should("be.visible");
  });

  it("le bouton ajouter au panier est visible quand on est connecte", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
    });
    cy.visit("/#/products/3");
    cy.get("[data-cy=detail-product-add]").should("be.visible");
  });

  it("le lien mon panier est visible quand on est connecte", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
    });
    cy.visit("/");
    cy.get("[data-cy=nav-link-cart]").should("be.visible");
  });
});
