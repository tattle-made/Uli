/// <reference types="cypress">

describe("Post Annotation", () => {
  before(() => {
    cy.exec(
      "cd ../backend && pwd && npx sequelize-cli db:seed:undo:all &&  npx sequelize-cli db:seed --seed 20220219083157-e2e-test-setup.js"
    ).then((res) => {
      cy.log(res);
    });
  });

  it("A User can annotate posts", () => {
    cy.visit("http://localhost:8000/login");
    cy.get('input[name="username"]').type("tattle_annotator_en");
    cy.get('input[name="password"]').type("r4&BTq");
    cy.contains("Login").click();

    cy.url().should("include", "/posts");

    cy.wait(250);
    cy.get('input[name="question_1"]').eq(1).click();
    cy.get('input[name="question_2"]').eq(0).click();
    cy.get('input[name="question_3"]').eq(0).click();

    cy.get('[aria-label="LinkNext"]').click();
    cy.wait(2000);

    cy.contains("pending : 53");

    cy.get('[aria-label="LinkPrevious"]').click();
    cy.wait(2000);

    cy.get('input[name="question_1"]').eq(1).should("be.checked");
    cy.get('input[name="question_2"]').eq(0).should("be.checked");
    cy.get('input[name="question_3"]').eq(0).should("be.checked");

    cy.get('[aria-label="LinkNext"]').click();
    cy.get('[aria-label="LinkNext"]').click();
    cy.get('[aria-label="LinkNext"]').click();
    cy.get('[aria-label="LinkNext"]').click();
    cy.get('[aria-label="LinkNext"]').click();
    cy.wait(2000);
  });

  it("User session is maintained", () => {
    cy.contains("Logout").click();
    cy.url().should("include", "/login");

    cy.get('input[name="username"]').type("tattle_annotator_en");
    cy.get('input[name="password"]').type("r4&BTq");
    cy.contains("Login").click();

    cy.url().should("include", "/posts");

    cy.contains("6/54");

    cy.reload();
    cy.wait(2000);
    cy.contains("6/54");
    cy.get('[aria-label="LinkNext"]').click();
    cy.get('[aria-label="LinkNext"]').click();
    cy.get('[aria-label="LinkNext"]').click();
    cy.contains("9/54");

    cy.get('[aria-label="LinkPrevious"]').click();
    cy.get('[aria-label="LinkPrevious"]').click();
    cy.get('[aria-label="LinkPrevious"]').click();
    cy.get('[aria-label="LinkPrevious"]').click();
    cy.get('[aria-label="LinkPrevious"]').click();
    cy.get('[aria-label="LinkPrevious"]').click();
    cy.contains("3/54");
  });

  it("Annotations are stored correctly in db", () => {
    cy.request("http://localhost:3000/api/annotations/type/csv").then(
      (response) => {
        if (response.status === 200) {
          let annotation_1 = response.body.tweets.filter(
            (tweet) => tweet.userId === "bd33353d-7ac2-418a-8417-4e82004fd398"
          );
          cy.log(annotation_1);
          // expect(response.body.tweets[0]).to.have.property('tweets')
        }
      }
    );
  });

  after(() => {
    cy.exec("cd ../backend && npx sequelize-cli db:seed:undo:all").then(
      (res) => {
        cy.log(res);
      }
    );
  });
});
