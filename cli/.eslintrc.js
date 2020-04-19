const path = require('path');

module.exports = {
  extends: path.resolve(__dirname, '../.eslintrc.js'),
  rules: {
    'no-console': 0,
    'max-classes-per-file': 0
  }
};
