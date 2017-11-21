/* eslint-env browser */
import "css@/index.css"
import {
    LogLevel, // eslint-disable-line no-unused-vars
    LogLevelEnum
} from "jsm@/utils/LogLevelEnum"

import Vue from "vue";
import TwitterLikeWithLabel from "jsm@/components/twitterlike/TwitterLikeWithLabel.vue"

localStorage.debug = "components:*";
localStorage.logLevel = LogLevelEnum.INFO.propName;

new Vue({
    el: "#twitterlike",
    template: "<TwitterLikeWithLabel></TwitterLikeWithLabel>",
    components: {
        TwitterLikeWithLabel
    }
});