// commande pour se connecter via l api
Cypress.Commands.add("login", (username, password) => {
  cy.request({
    method: "POST",
    url: "http://localhost:8081/login",
    body: { username, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    window.localStorage.setItem("user", response.body.token);
  });
});
