import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum
} from "./EventEnum";

import debug from "debug";
const logit = debug("components:InputLabelMixin.vue");

let inputLabelMixin = {
    /**
     * @returns {{d_labelIsUp: boolean, d_hasFocus: boolean, d_hasHover: boolean, d_FOCUS_IN: Event, d_FOCUS_OUT: Event, d_HOVER_IN: Event, d_HOVER_OUT: Event}}
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
                logit("handling focus in");
                this.d_labelIsUp = true;
                this.d_hasFocus = true;
                return;
            }
            if (event === EventEnum.HOVER_IN) {
                logit("handling hover in");
                this.d_labelIsUp = true;
                this.d_hasHover = true;
                return;
            }
            if (event == EventEnum.HOVER_OUT) {
                this.d_hasHover = false;
                if (!this.d_hasFocus && !(curCharCount > 0)) {
                    logit("handling hover out without focus");
                    this.d_labelIsUp = false;
                } else {
                    logit("handling hover out with focus");
                    this.d_labelIsUp = true;
                }
                return;
            }
            if (event == EventEnum.FOCUS_OUT) {
                logit("handling focus out");
                this.d_hasFocus = false;
                if (!this.d_hasHover && !(curCharCount > 0)) {
                    logit("handling focus out without hover");
                    this.d_labelIsUp = false;
                } else {
                    logit("handling focus out but has hover");
                    this.d_labelIsUp = true;
                }


                return;
            }
            logit("Huh?" + event);
        }
    }
}

export default inputLabelMixin;