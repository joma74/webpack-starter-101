<template>
    <div>
        <div class="label-is-down h2 flex justify-end items-center bb bw1 pt1 pb1"
             v-bind:class="b_labelMove"
             @mouseover="m_evalLabelState(d_HOVER_IN, p_curCharCount)"
             @mouseout="m_evalLabelState(d_HOVER_OUT, p_curCharCount)"
             role="presentation">
            <label for="c_tweet_id"
                   class="mr-auto"
                   v-bind:class="b_labelTitle">{{ p_title }}
            </label>
            <label for="c_tweet_id"
                   class="black-70"
                   v-bind:class="b_labelCurCharCount">{{ p_curCharCount }}
            </label>
            <label for="c_tweet_id"
                   class="black-70"
                   v-bind:class="b_labelTotalCharCount">&nbsp;/&nbsp;{{ p_remainingCharCount }}
            </label>
        </div>
        <div class="pb1"
             @mouseover="m_evalLabelState(d_HOVER_IN, p_curCharCount)"
             @mouseout="m_evalLabelState(d_HOVER_OUT, p_curCharCount)"
             role="presentation">
        </div>
    </div>
</template>

<script>
import Vue from "vue"

import "css@/twitterlike.scss"

import debug from "debug";
const logit = debug("components:Label.vue");

import InputLabelMixin from "./InputLabelMixin";

export default Vue.extend({
    props: {
        p_title: {
            type: String,
            required: true
        },
        p_curCharCount: {
            type: Number,
            required: true
        },
        p_remainingCharCount: {
            type: Number,
            required: true
        },
        p_isOutOfUpperRange: {
            type: Boolean,
            required: true
        },
        p_isOutOfLowerRange: {
            type: Boolean,
            required: true
        },
        p_isOutOfRange: {
            type: Boolean,
            required: true
        },
        p_labelIsUp: {
            type: Boolean,
            required: true
        },
        p_hasFocus: {
            type: Boolean,
            required: true
        }
    },
    mixins: [InputLabelMixin],
    computed: {
        /**@returns {boolean} */
        c_underTwentyMark() {
            return this.p_remainingCharCount <= 20 && this.p_remainingCharCount >= 10;
        },
        /**@returns {boolean} */
        c_underTenMark() {
            return this.p_remainingCharCount < 10 && this.p_remainingCharCount >= 0;
        },
        b_labelMove() {
            return {
                'b--dark-red': this.p_isOutOfRange,
                'b--black-20': !this.p_isOutOfRange,
                'label-is-up': this.d_labelIsUp,
                'label-is-down': !this.d_labelIsUp
            }
        },
        b_labelTitle() {
            return {
                'dark-red': this.p_isOutOfRange,
                'black-70': !this.p_isOutOfRange
            }
        },
        b_labelCurCharCount() {
            return {
                'dark-red': this.p_isOutOfUpperRange
            }

        },
        b_labelTotalCharCount() {
            return {
                'dark-red': this.p_isOutOfLowerRange,
                'orange': this.c_underTwentyMark,
                'light-red': this.c_underTenMark
            }
        }
    },
    watch: {
        /**
         * @param {Boolean} value 
         */
        p_labelIsUp: function(value) {
            this.d_labelIsUp = value;
        },
        /**
         * @param {Boolean} value 
         */
        p_hasFocus: function(value) {
            this.d_hasFocus = value;
        }
    }
})
</script>

