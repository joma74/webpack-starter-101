/* eslint-env browser */

import "css@/index.css"

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