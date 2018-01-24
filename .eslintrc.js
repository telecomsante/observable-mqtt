module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "plugins": [
    "fp",
    "import"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:fp/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "fp/no-mutation": ["error", {
      "commonjs": true
    }],
    "import/no-unresolved": ["error", {
      "commonjs": true
    }]
  }
};
