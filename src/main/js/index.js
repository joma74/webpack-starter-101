/* eslint-env browser */

import FOO_STRING from "./foo"
import "../css/index.css"
const bar = require("./bar")

console.log(`Hello ${FOO_STRING} and hello ${bar.BAR_STRING}`); // This is an ES6 feature