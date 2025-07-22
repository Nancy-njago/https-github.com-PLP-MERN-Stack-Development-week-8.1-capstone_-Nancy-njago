describe('Asset Management E2E', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[data-testid="login-username"]').type('admin');
    cy.get('[data-testid="login-password"]').type('admin123');
    cy.get('button[type=submit]').click();
    cy.url().should('not.include', '/login');
  });

  it('should create an asset', () => {
    cy.visit('/assets');
    cy.contains('Add Asset').click();
    cy.get('input[name=name]').type('Boiler Unit');
    cy.get('input[name=location]').type('Section A');
    cy.get('button[type=submit]').contains('Save').click();
    cy.contains('Boiler Unit');
  });

  it('should update an asset', () => {
    cy.contains('Boiler Unit').click();
    cy.contains('Edit').click();
    cy.get('input[name=location]').clear().type('Section B');
    cy.contains('Save').click();
    cy.contains('Section B');
  });

  it('should delete an asset', () => {
    cy.contains('Boiler Unit').click();
    cy.contains('Delete').click();
    cy.contains('Confirm').click();
    cy.contains('Boiler Unit').should('not.exist');
  });
});
