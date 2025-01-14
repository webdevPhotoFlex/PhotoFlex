const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'create-react-app',
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000/PhotoFlex',
    specPattern: 'cypress/integration/*.spec.js',
  },
});
