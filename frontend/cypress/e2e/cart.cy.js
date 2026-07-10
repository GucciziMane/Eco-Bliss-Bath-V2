/// <reference types="cypress" />

describe("Test Panier", () => {
  // on se connecte avant chaque test
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
    });
  });

  it("affiche le stock et le bouton ajouter", () => {
    cy.visit("/#/products/3");
    cy.get("[data-cy=detail-product-name]").should("be.visible");
    cy.get("[data-cy=detail-product-price]").should("be.visible");
    cy.get("[data-cy=detail-product-stock]").should("be.visible");
    cy.get("[data-cy=detail-product-add]").should("be.visible");
  });

  it("ajouter un produit et verifier le panier", () => {
    cy.visit("/#/products/3");
    cy.get("[data-cy=detail-product-stock]").should("contain", "en stock");

    // on recupere le stock avant pour comparer apres
    cy.request("GET", "http://localhost:8081/products/3").then((res) => {
      const stockAvant = res.body.availableStock;

      // on ajoute 1 produit
      cy.get("[data-cy=detail-product-quantity]").clear().type("1");
      cy.get("[data-cy=detail-product-add]").click();

      // on verifie qu on est redirige vers le panier
      cy.url().should("include", "cart");
      cy.get("[data-cy=cart-line]").should("have.length.greaterThan", 0);

      // on verifie via l api que le produit est bien dans le panier
      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: { Authorization: "Bearer " + localStorage.getItem("user") },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.orderLines.length).to.be.greaterThan(0);
      });

      // on verifie que le stock a baisse
      cy.request("GET", "http://localhost:8081/products/3").then((res2) => {
        expect(res2.body.availableStock).to.be.lessThan(stockAvant);
      });
    });
  });

  it("refuser une quantite negative", () => {
    cy.visit("/#/products/3");
    cy.get("[data-cy=detail-product-quantity]").clear().type("-1");
    cy.get("[data-cy=detail-product-add]").click();

    // on verifie que le panier ne contient pas de quantite negative
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: { Authorization: "Bearer " + localStorage.getItem("user") },
    }).then((response) => {
      if (response.body.orderLines) {
        response.body.orderLines.forEach((line) => {
          expect(line.quantity).to.be.greaterThan(0);
        });
      }
    });
  });

  it("refuser une quantite superieure a 20", () => {
    cy.visit("/#/products/3");
    cy.get("[data-cy=detail-product-quantity]").clear().type("21");
    cy.get("[data-cy=detail-product-add]").click();

    // on verifie que le panier ne contient pas plus de 20 articles
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: { Authorization: "Bearer " + localStorage.getItem("user") },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.body.orderLines) {
        response.body.orderLines.forEach((line) => {
          expect(line.quantity).to.be.at.most(20);
        });
      }
    });
  });

  it("affiche la disponibilite du produit", () => {
    cy.visit("/#/products/3");
    cy.get("[data-cy=detail-product-stock]").should("be.visible");
    cy.get("[data-cy=detail-product-stock]").should("contain", "en stock");
  });

  it("supprimer un produit du panier", () => {
    // d abord on ajoute un produit
    cy.visit("/#/products/3");
    cy.get("[data-cy=detail-product-quantity]").clear().type("1");
    cy.get("[data-cy=detail-product-add]").click();

    // puis on le supprime
    cy.url().should("include", "cart");
    cy.get("[data-cy=cart-line]").should("have.length.greaterThan", 0);
    cy.get("[data-cy=cart-line-delete]").first().click();
  });
});
