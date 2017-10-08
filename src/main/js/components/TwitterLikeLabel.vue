<template>
    <div class="label-is-down h2 flex justify-end items-center bb bw1 pt1 pb1" v-bind:class="b_labelMove" @mouseover="evalLabelState('hi')" @mouseout="evalLabelState('ho')" role="presentation">
        <label for="c_tweet_id" class="mr-auto" v-bind:class="b_labelTitle">{{ p_title }}</label>
        <label for="c_tweet_id" class="black-70" v-bind:class="b_labelCurCharCount">{{ p_curCharCount }}</label>
        <label for="c_tweet_id" class="black-70" v-bind:class="b_labelTotalCharCount">&nbsp;/&nbsp;{{ p_remainingCharCount }}</label>
    </div>
</template>

<script>
import Vue from "vue"

import "css@/twitterlike.scss"

import debug from "debug";
const logit = debug('components:TwitterLikeLabel.vue');

export default Vue.extend({
    /**
     * @returns {{labelIsUp: boolean, hasFocus: boolean, hasHover: boolean}}
     */
    data() {
        return {
            labelIsUp: false,
            hasFocus: false,
            hasHover: false
        }
    },
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
        p_labelIsUp: {
            type: Boolean,
            required: true
        },
        p_hasFocus: {
            type: Boolean,
            required: true
        },
        p_hasHover: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        /**@returns {boolean} */
        tweetIsOutOfUpperRange() {
            return this.p_curCharCount == 0;
        },
        /**@returns {boolean} */
        tweetIsOutOfLowerRange() {
            return this.p_remainingCharCount < 0;
        },
        /**@returns {boolean} */
        tweetIsOutOfRange() {
            return this.tweetIsOutOfLowerRange || this.tweetIsOutOfUpperRange;
        },
        /**@returns {boolean} */
        underTwentyMark() {
            return this.p_remainingCharCount <= 20 && this.p_remainingCharCount >= 10;
        },
        /**@returns {boolean} */
        underTenMark() {
            return this.p_remainingCharCount < 10 && this.p_remainingCharCount >= 0;
        },
        b_labelMove() {
            return {
                'b--dark-red': this.tweetIsOutOfRange,
                'b--black-20': !this.tweetIsOutOfRange,
                'label-is-up': this.labelIsUp,
                'label-is-down': !this.labelIsUp
            }
        },
        b_labelTitle() {
            return {
                'dark-red': this.tweetIsOutOfRange,
                'black-70': !this.tweetIsOutOfRange
            }
        },
        b_labelCurCharCount() {
            return {
                'dark-red': this.tweetIsOutOfUpperRange
            }

        },
        b_labelTotalCharCount() {
            return {
                'dark-red': this.tweetIsOutOfLowerRange,
                'orange': this.underTwentyMark,
                'light-red': this.underTenMark
            }
        }
    },
    methods: {
        /**@param {string} event */
        evalLabelState(event) {
            if (event == 'fi') {
                logit("handling focus in");
                this.labelIsUp = true;
                this.hasFocus = true;
                return;
            }
            if (event == 'hi') {
                logit("handling hover in");
                this.labelIsUp = true;
                this.hasHover = true;
                return;
            }
            if (event == 'ho') {
                this.hasHover = false;
                if (!this.hasFocus) {
                    logit("handling hover out without focus");
                    this.labelIsUp = false;
                } else {
                    logit("handling hover out with focus");
                    this.labelIsUp = true;
                }
                return;
            }
            if (event == 'fo') {
                logit("handling focus out");
                this.hasFocus = false;
                if (this.hasHover) {
                    logit("handling focus out but has hover");
                    this.labelIsUp = true;
                } else {
                    logit("handling focus out without hover");
                    this.labelIsUp = false;
                }


                return;
            }
            logit("Huh?" + event);
        }
    }
})
</script>

