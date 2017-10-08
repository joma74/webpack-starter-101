import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum
} from "./EventEnum";

import debug from "debug";
const logit = debug("components:LabelMixin.vue");

let labelMixin = {
    /**
     * @returns {{d_labelIsUp: boolean, d_hasFocus: boolean, d_hasHover: boolean}}
     */
    data() {
        return {
            d_labelIsUp: false,
            d_hasFocus: false,
            d_hasHover: false
        }
    },
    methods: {
        /**@param {Event} event */
        m_evalLabelState(event) {
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
                if (!this.d_hasFocus) {
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
                if (this.d_hasHover) {
                    logit("handling focus out but has hover");
                    this.d_labelIsUp = true;
                } else {
                    logit("handling focus out without hover");
                    this.d_labelIsUp = false;
                }


                return;
            }
            logit("Huh?" + event);
        }
    }
}

export default labelMixin;