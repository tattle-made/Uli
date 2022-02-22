describe.only("App is multilingua", () => {
  before(() => {
    cy.exec(
      "cd ../backend && pwd && npx sequelize-cli db:seed:undo:all &&  npx sequelize-cli db:seed --seed 20220219083157-e2e-test-setup.js"
    ).then((res) => {
      cy.log(res);
    });
  });
  it("App opens in english for english users", () => {
    cy.visit("http://localhost:8000/login");
    cy.get('input[name="username"]').type("tattle_annotator_en");
    cy.get('input[name="password"]').type("r4&BTq");
    cy.contains("Login").click();

    cy.url().should("include", "/posts");
    cy.contains("OGBV ANNOTATOR");
    cy.contains("Post Annotation");
    cy.contains(
      "Is this post gendered abuse when not directed at a person of marginalized gender and sexuality?"
    );
  });
  it("App opens in hindi for hindi users", () => {
    cy.visit("http://localhost:8000/login");
    cy.get('input[name="username"]').type("tattle_annotator_hi");
    cy.get('input[name="password"]').type("Vk5$%r");
    cy.contains("Login").click();

    cy.url().should("include", "/hi/posts");
    cy.contains("एनोटेटर");
    cy.contains("पोस्ट व्याख्या");
    cy.contains(
      "क्या यह पोस्ट ओजीबीवी है अगर हाशिए के लिंग के व्यक्ति पर निर्देशित नहीं किया जाता है?"
    );
  });
  it("App opens in tamil for tamil users", () => {
    cy.visit("http://localhost:8000/login");
    cy.get('input[name="username"]').type("tattle_annotator_ta");
    cy.get('input[name="password"]').type("+B2CuN");
    cy.contains("Login").click();

    cy.url().should("include", "/ta/posts");
    cy.contains("குறிப்பாளர்");
    cy.contains("குறிப்பிற்க்குப் பின்");
    cy.contains(
      "இந்த பதிவு விளிம்புநிலை பாலினத்தவர்களைத் கொண்ட ஒரு நபரை நோக்கி இயக்கப்படாதபோது பாலின துஷ்பிரயோகம் ஆகிறது ?"
    );
  });
});
