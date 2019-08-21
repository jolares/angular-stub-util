module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/src/jest.setup.ts'
  ],
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/*.module.ts',
    '!**/*.mock.ts',
    '!src/karma.setup.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/**/index.ts',
    '!src/assets/i18n/languages.ts',
    '!src/environments/**/*.ts',
    '!src/app/tests/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      'statements': 95,
      'branches': 80,
      'functions': 92.5
    }
  },
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [require.resolve('jest-preset-angular/InlineHtmlStripStylesTransformer')]
    }
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
};
