<template>
    <div @mouseenter="m_evalLabelState(HOVER_IN, p_curCharCount)"
         @mouseleave="m_evalLabelState(HOVER_OUT, p_curCharCount)">
        <div class="label-is-down h2 flex justify-end items-center bb bw1 pt1 pb1"
             v-bind:class="b_labelMove"
             role="presentation">
            <label :for="p_labelFor"
                   class="mr-auto"
                   v-bind:class="b_labelTitle">{{ p_title }}
            </label>
            <label :for="p_labelFor"
                   class="black-70"
                   v-bind:class="b_labelCurCharCount">{{ p_curCharCount }}
            </label>
            <label :for="p_labelFor"
                   class="black-70"
                   v-bind:class="b_labelTotalCharCount">&nbsp;/&nbsp;{{ p_remainingCharCount }}
            </label>
        </div>
        <div class="pb1"
             role="presentation">
        </div>
    </div>
</template>

<script>
import "css@/twitterlike.scss"
import debug from "debug";
import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum
} from "./EventEnum";
import InputLabelMixin from "./InputLabelMixin";
const logit = debug("components:Label.vue");
import Vue from "vue"

export default Vue.extend({
    props: {
        p_title: {
            type: String,
            required: true
        },
        p_labelFor: {
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
    created: function () {
        this.FOCUS_IN = EventEnum.FOCUS_IN
        this.FOCUS_OUT = EventEnum.FOCUS_OUT
        this.HOVER_IN = EventEnum.HOVER_IN
        this.HOVER_OUT = EventEnum.HOVER_OUT
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
            if(!this.d_hasHover){
                this.d_labelIsUp = value;
            }
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

