module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/',
    'src/images',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testMatch: [
    '**/tests/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '^@mui/icons-material/(.*)$':
      '<rootDir>/node_modules/@mui/icons-material/$1',
    '^axios$': '<rootDir>/__mocks__/axiosMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@mediapipe/selfie_segmentation$':
      '<rootDir>/__mocks__/selfie_segmentation.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!axios)/'],
};
