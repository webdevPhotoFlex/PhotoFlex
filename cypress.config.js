const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'create-react-app',
    },
  },
  e2e: {
    baseUrl: 'https://webdevPhotoFlex.github.io/PhotoFlex',
    specPattern: 'cypress/integration/*.spec.js',
  },
});
