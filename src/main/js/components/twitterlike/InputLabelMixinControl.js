import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";
import debug from "debug";
import C from "jsm@/components/twitterlike/C"
import {
    ComponentOptions // eslint-disable-line no-unused-vars
} from "vue";

/**
 * @type {ComponentOptions} 
 */
let InputLabelMixin = {
    created: function () {
        let componentName = this.$options.name || this.$options._componentTag;
        this.logit = debug("components:" + componentName + ":InputLabelMixin");
        this.decisionTable = [
            /* beautify preserve:start */
            [EvtE.FOCUS_IN, EvtE.FOCUS_OUT, EvtE.HOVER_IN, EvtE.HOVER_OUT                       ],
            [          C.Y,            C.N,           C.N,            C.N, { d_hasFocus: C.Y }  ], //
            [          C.N,            C.Y,           C.N,            C.N, { d_hasFocus: C.N }  ], //
            [          C.N,            C.N,           C.Y,            C.N, { d_hasHover: C.Y }  ], //
            [          C.N,            C.N,           C.N,            C.Y, { d_hasHover: C.N }  ], //
            /* beautify preserve:end */
        ];
        const facts_output = Object.assign({}, () => ({ d_hasFocus, d_hasHover } = this.$data)); // eslint-disable-line no-undef
        this.facts = {
            input: {
                event: EvtE.FOCUS_IN
            },
            output: facts_output
        };
    },
    /**
     * @typedef {Object} Data
     * @property {boolean} d_moveLabelUp
     * @property {boolean} d_hasFocus
     * @property {boolean} d_hasHover
     */
    /**
     * @returns {Data}
     */
    data() {
        return {
            d_moveLabelUp: false,
            d_hasFocus: false,
            d_hasHover: false
        }
    },
    methods: {
        /**
         * @param {Event} event 
         * @param {Number} curCharCount 
         */
        m_evalLabelState(event, curCharCount) {
            if (event === EvtE.FOCUS_IN) {
                this.logit("handling focus in");
                this.d_moveLabelUp = true;
                this.d_hasFocus = true;
                return;
            }
            if (event === EvtE.HOVER_IN) {
                this.logit("handling hover in");
                this.d_moveLabelUp = true;
                this.d_hasHover = true;
                return;
            }
            if (event == EvtE.HOVER_OUT) {
                this.d_hasHover = false;
                if (!this.d_hasFocus && !(curCharCount > 0)) {
                    this.logit("handling hover out without focus");
                    this.d_moveLabelUp = false;
                } else {
                    this.logit("handling hover out with focus");
                    this.d_moveLabelUp = true;
                }
                return;
            }
            if (event == EvtE.FOCUS_OUT) {
                this.logit("handling focus out");
                this.d_hasFocus = false;
                if (!this.d_hasHover && !(curCharCount > 0)) {
                    this.logit("handling focus out without hover");
                    this.d_moveLabelUp = false;
                } else {
                    this.logit("handling focus out but has hover");
                    this.d_moveLabelUp = true;
                }


                return;
            }
            this.logit("Unhandled event on given args [" + arguments + "]");
        }
    }
}

export default InputLabelMixin;