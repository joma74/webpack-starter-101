import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum
} from "./EventEnum";

import debug from "debug";
const logit = debug("components:LabelMixin.vue");

let labelMixin = {
    methods: {
        /**@param {Event} event */
        evalLabelState(event) {
            if (event === EventEnum.FOCUS_IN) {
                logit("handling focus in");
                this.labelIsUp = true;
                this.hasFocus = true;
                return;
            }
            if (event === EventEnum.HOVER_IN) {
                logit("handling hover in");
                this.labelIsUp = true;
                this.hasHover = true;
                return;
            }
            if (event == EventEnum.HOVER_OUT) {
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
            if (event == EventEnum.FOCUS_OUT) {
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
}

export default labelMixin;