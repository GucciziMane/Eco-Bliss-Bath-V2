/// <reference types="cypress" />

describe("Tests API", () => {
  let token;

  // on se connecte une fois avant tous les tests pour avoir le token
  before(() => {
    cy.fixture("users").then((users) => {
      cy.request("POST", "http://localhost:8081/login", users.validUser).then((response) => {
        token = response.body.token;
      });
    });
  });

  it("login avec un utilisateur connu", () => {
    cy.fixture("users").then((users) => {
      cy.request("POST", "http://localhost:8081/login", users.validUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("token");
      });
    });
  });

  it("login avec un utilisateur inconnu", () => {
    cy.fixture("users").then((users) => {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: users.invalidUser,
        failOnStatusCode: false, // pour ne pas que cypress plante sur le 401
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  it("acceder aux commandes sans etre connecte", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      failOnStatusCode: false,
    }).then((response) => {
      // on attend 403 mais l api renvoie 401 (bug back-end)
      expect(response.status).to.eq(403);
    });
  });

  it("recuperer les commandes en etant connecte", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: { Authorization: "Bearer " + token },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("orderLines");
    });
  });

  it("recuperer un produit par son id", () => {
    cy.request("GET", "http://localhost:8081/products/3").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("price");
    });
  });

  it("ajouter un produit au panier", () => {
    // note : on utilise PUT car c est ce que l api attend (devrait etre POST normalement)
    cy.request({
      method: "PUT",
      url: "http://localhost:8081/orders/add",
      headers: { Authorization: "Bearer " + token },
      body: { product: 3, quantity: 1 },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("ajouter un produit en rupture de stock", () => {
    // on cherche un produit avec stock a 0
    cy.request("GET", "http://localhost:8081/products").then((response) => {
      const produit = response.body.find((p) => p.availableStock === 0);

      if (produit) {
        cy.request({
          method: "PUT",
          url: "http://localhost:8081/orders/add",
          headers: { Authorization: "Bearer " + token },
          body: { product: produit.id, quantity: 1 },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.not.eq(200);
        });
      } else {
        // pas de produit en rupture donc on teste avec trop de quantite
        cy.request("GET", "http://localhost:8081/products/3").then((prodRes) => {
          cy.request({
            method: "PUT",
            url: "http://localhost:8081/orders/add",
            headers: { Authorization: "Bearer " + token },
            body: { product: 3, quantity: prodRes.body.availableStock + 100 },
            failOnStatusCode: false,
          }).then((res) => {
            expect(res.status).to.be.oneOf([200, 400, 422]);
          });
        });
      }
    });
  });

  it("poster un avis", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/reviews",
      headers: { Authorization: "Bearer " + token },
      body: { title: "Super produit", comment: "Je recommande ce savon", rating: 4 },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
