// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // update this to match your dev server (e.g., Vite might be 5173)
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});

