import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";
import debug from "debug";
import C from "jsm@/utils/C"
import {
    ComponentOptions // eslint-disable-line no-unused-vars
} from "vue";
import DecisionEngine from "jsm@/utils/DecisionEngine"

/**
 * @type {ComponentOptions} 
 */
let InputLabelMixin = {
    created: function () {
        let componentName = this.$options.name || this.$options._componentTag;
        this.logit = debug("components:" + componentName + ":InputLabelMixin");
        let onEventDecisionTable = [
            /* beautify preserve:start */
            [   EvtE.FOCUS_IN,          { d_hasFocus: C.Y }    ],
            [   EvtE.FOCUS_OUT,         { d_hasFocus: C.N }    ],
            [   EvtE.HOVER_IN,          { d_hasHover: C.Y }    ],
            [   EvtE.HOVER_OUT,         { d_hasHover: C.N }    ]
            /* beautify preserve:end */
        ];
        this.onEventEngineDE = new DecisionEngine(onEventDecisionTable);

        let shouldMoveLabelUpDecisionTable = [
            /* beautify preserve:start */
            [   "d_hasFocus",   "d_hasHover",   "d_isDirty",    "outcome"                   ],
            [   C.N,            C.N,            C.N,            { d_moveLabelUp: C.N }      ],
            [   C.Y,            C.ANY,          C.ANY,          { d_moveLabelUp: C.Y }      ],
            [   C.ANY,          C.Y,            C.ANY,          { d_moveLabelUp: C.Y }      ],
            [   C.ANY,          C.ANY,          C.Y,            { d_moveLabelUp: C.Y }      ]
            /* beautify preserve:end */
        ];

        this.shouldMoveLabelUpDE = new DecisionEngine(shouldMoveLabelUpDecisionTable, {
            descriptiveHeaderRows: 1
        });
    },
    /**
     * @typedef {Object} Data
     * @property {boolean} d_moveLabelUp
     * @property {boolean} d_hasFocus
     * @property {boolean} d_hasHover
     * @property {boolean} d_isDirty
     */
    /**
     * @returns {Data}
     */
    data() {
        return {
            d_moveLabelUp: false,
            d_hasFocus: false,
            d_hasHover: false,
            d_isDirty: false
        }
    },
    methods: {
        /**
         * @param {Event} event
         */
        m_evalLabelState(event) {
            /**
             * @type {DecisionEngine}
             */
            let onEventEngine = this.onEventEngineDE;
            onEventEngine.decideAndMerge(event, this.$data);

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
                if (!this.d_hasFocus && !this.d_isDirty) {
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
                if (!this.d_hasHover && !this.d_isDirty) {
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