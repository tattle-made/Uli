/// <reference types="cypress">

describe("User Authentication", () => {
  it("A User can login and logout", () => {
    cy.visit("http://localhost:8000/login");
    cy.get('input[name="username"]').type("tattle_annotator_en");
    cy.get('input[name="password"]').type("r4&BTq");
    cy.contains("Login").click();

    cy.url().should("include", "/hi/posts");

    cy.contains("Logout").click();
    cy.url().should("include", "/login");
  });

  it("An Unauthorized user can't login", () => {
    cy.visit("http://localhost:8000/login");
    cy.get('input[name="username"]').type("tattle_annotator_en");
    cy.get('input[name="password"]').type("asdf");
    cy.contains("Login").click();

    cy.url().should("include", "/login");
  });
});
