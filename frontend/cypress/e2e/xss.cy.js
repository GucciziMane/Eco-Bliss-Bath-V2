/// <reference types="cypress" />

describe("Test XSS", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
    });
  });

  it("ne doit pas executer un script injecte dans un commentaire", () => {
    cy.visit("/#/reviews");

    // on injecte un script dans le champ commentaire
    cy.get("[data-cy=review-input-title]").type("Test XSS");
    cy.get("[data-cy=review-input-comment]").type('<script>alert("XSS")</script>');
    cy.get("[data-cy=review-input-rating-images] img").eq(2).click();
    cy.get("[data-cy=review-submit]").click();

    // on verifie que le script ne s est pas execute
    cy.get("[data-cy=review-detail]").should("have.length.greaterThan", 0);
    cy.get("[data-cy=review-comment]").each(($el) => {
      cy.wrap($el).find("script").should("not.exist");
    });

    // on teste aussi avec une balise img onerror
    cy.get("[data-cy=review-input-title]").clear().type("Test XSS img");
    cy.get("[data-cy=review-input-comment]").clear().type('<img src="x" onerror="alert(\'XSS\')">');
    cy.get("[data-cy=review-input-rating-images] img").eq(3).click();
    cy.get("[data-cy=review-submit]").click();

    cy.get("[data-cy=review-detail]").should("have.length.greaterThan", 0);

    // on intercepte alert pour verifier qu il n est pas appele
    cy.window().then((win) => {
      const alertStub = cy.stub(win, "alert");
      cy.reload();
      cy.get("[data-cy=review-detail]").should("have.length.greaterThan", 0).then(() => {
        expect(alertStub).not.to.be.called;
      });
    });
  });
});
