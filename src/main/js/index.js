/* eslint-env browser */

import FOO_STRING from "./foo"
import BAZ_STRING from "jsm@/components/baz"
import "css@/index.css"

const bar = require("./bar")

console.log(`Hello ${FOO_STRING} and hello ${bar.BAR_STRING} plus hello ${BAZ_STRING}`); // This is an ES6 feature

import Vue from "vue";
import TwitterLikeWithLabel from "jsm@/components/twitterlike/TwitterLikeWithLabel.vue"

localStorage.debug = "components:*";

new Vue({
    el: "#twitterlike",
    template: "<TwitterLikeWithLabel></TwitterLikeWithLabel>",
    components: {
        TwitterLikeWithLabel
    }
});