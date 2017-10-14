import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum
} from "./EventEnum";

import debug from "debug";

let InputLabelMixin = {
    created: function () {
        let componentName = this.$options.name || this.$options._componentTag;
        this.logit = debug("components:" + componentName + ":InputLabelMixin");
    },
    /**
     * @typedef {Object} Data
     * @property {boolean} d_labelIsUp
     * @property {boolean} d_hasFocus
     * @property {boolean} d_hasHover
     * @property {Event} d_FOCUS_IN
     * @property {Event} d_FOCUS_OUT
     * @property {Event} d_HOVER_IN
     * @property {Event} d_HOVER_OUT
     */
    /**
     * @returns {Data}
     */
    data() {
        return {
            d_labelIsUp: false,
            d_hasFocus: false,
            d_hasHover: false,
            d_FOCUS_IN: EventEnum.FOCUS_IN,
            d_FOCUS_OUT: EventEnum.FOCUS_OUT,
            d_HOVER_IN: EventEnum.HOVER_IN,
            d_HOVER_OUT: EventEnum.HOVER_OUT,
        }
    },
    methods: {
        /**
         * @param {Event} event 
         * @param {Number} curCharCount 
         */
        m_evalLabelState(event, curCharCount) {
            if (event === EventEnum.FOCUS_IN) {
                this.logit("handling focus in");
                this.d_labelIsUp = true;
                this.d_hasFocus = true;
                return;
            }
            if (event === EventEnum.HOVER_IN) {
                this.logit("handling hover in");
                this.d_labelIsUp = true;
                this.d_hasHover = true;
                return;
            }
            if (event == EventEnum.HOVER_OUT) {
                this.d_hasHover = false;
                if (!this.d_hasFocus && !(curCharCount > 0)) {
                    this.logit("handling hover out without focus");
                    this.d_labelIsUp = false;
                } else {
                    this.logit("handling hover out with focus");
                    this.d_labelIsUp = true;
                }
                return;
            }
            if (event == EventEnum.FOCUS_OUT) {
                this.logit("handling focus out");
                this.d_hasFocus = false;
                if (!this.d_hasHover && !(curCharCount > 0)) {
                    this.logit("handling focus out without hover");
                    this.d_labelIsUp = false;
                } else {
                    this.logit("handling focus out but has hover");
                    this.d_labelIsUp = true;
                }


                return;
            }
            this.logit("Unhandled event on given args [" + arguments + "]");
        }
    }
}

export default InputLabelMixin;