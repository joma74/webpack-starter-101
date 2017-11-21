import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";
import debug from "debug";
import C from "jsm@/utils/C"
import Vue from "vue";
import DecisionEngine from "jsm@/utils/DecisionEngine"

let InputLabelMixinLabel = Vue.extend({
    created: function () {
        let componentName = this.$options.name || this.$options._componentTag;
        /**
         * @type {function(string)} 
         */
        this.logit = debug("components:" + componentName + ":InputLabelMixinLabel");
        let onEventDT = [
            /* beautify preserve:start */
            [   "Event",                "outcome"              ],
            [   EvtE.FOCUS_IN,          { d_hasFocus: C.Y }    ],
            [   EvtE.FOCUS_OUT,         { d_hasFocus: C.N }    ],
            [   EvtE.HOVER_IN,          { d_hasHover: C.Y }    ],
            [   EvtE.HOVER_OUT,         { d_hasHover: C.N }    ]
            /* beautify preserve:end */
        ];
        this.onEventDTE = new DecisionEngine(onEventDT, {
            descriptiveHeaderRows: 1,
            f_log: this.logit,
            name: "onEventDT"
        });

        let moveLabelUpDT = [
            /* beautify preserve:start */
            [   "d_hasHover",   "d_moveLabelUpControl",     "outcome"                 ],
            [   C.ANY,          C.Y,                        { d_labelIsUp: C.Y }      ],
            [   C.Y,            C.N,                        { d_labelIsUp: C.Y }      ],
            [   C.N,            C.N,                        { d_labelIsUp: C.N }      ]
            /* beautify preserve:end */
        ];

        this.moveLabelUpDTE = new DecisionEngine(moveLabelUpDT, {
            descriptiveHeaderRows: 1,
            f_log: this.logit,
            name: "moveLabelUpDT"
        });
    },
    data() {
        return {
            d_labelIsUp: false,
            d_hasHover: false,
            d_moveLabelUpControl: false
        }
    },
    methods: {
        /**
         * @param {Event} event
         */
        m_evalOnEvent(event) {
            /**
             * @type {DecisionEngine}
             */
            let onEventDTE = this.onEventDTE;
            if(!onEventDTE.decideAndMerge(event, this.$data)){
                this.logit("Unhandled on given args [" + arguments + "]");
            }
            this.m_evalShouldMoveLabelUp();
        },
        m_evalShouldMoveLabelUp(){
            /**
             * @type {DecisionEngine}
             */
            let moveLabelUpDTE = this.moveLabelUpDTE;
            let actualFacts = [this.d_hasHover, this.d_moveLabelUpControl];
            if(!moveLabelUpDTE.decideAndMerge(actualFacts, this.$data)){
                this.logit("Unhandled on actual facts [" + actualFacts + "]");
            }
        }
    },
    computed: {
        withoutthatinferencebreaks(){
            this.d_hasHover;
        }
    }
});

export default InputLabelMixinLabel;