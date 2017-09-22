/// <reference path="../../../../node_modules/@types/webpack/index.d.ts" />

// require all test files
const testsContext = require.context("./", true, /\.jasm$/)
testsContext.keys().forEach(testsContext)