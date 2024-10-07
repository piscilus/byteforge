module.exports = {
  // Specifies the root directory for Jest
  roots: ['<rootDir>/tests'],

  // Patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.+(js|jsx|ts|tsx)',
    '**/?(*.)+(test).+(js|jsx|ts|tsx)',
  ],

  // Module file extensions for importing
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
