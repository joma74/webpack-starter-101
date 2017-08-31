/* eslint-env browser */

import FOO_STRING from "./foo"
import BAZ_STRING from "js@/components/baz"
import "css@/index.css"
import "css@/twitterlike.scss"

const bar = require("./bar")

console.log(`Hello ${FOO_STRING} and hello ${bar.BAR_STRING} plus hello ${BAZ_STRING}`); // This is an ES6 feature