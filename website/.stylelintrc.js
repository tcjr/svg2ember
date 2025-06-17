'use strict';

module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'import-notation': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          /** tailwindcss v4 */
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'plugin',
        ],
      },
    ],
  },
};
