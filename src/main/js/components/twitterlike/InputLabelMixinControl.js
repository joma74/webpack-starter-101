import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";
import debug from "debug";
import C from "jsm@/utils/C"
import Vue from "vue";
import DecisionEngine from "jsm@/utils/DecisionEngine"

let InputLabelMixinControl = Vue.extend({
    created: function () {
        let componentName = this.$options.name || this.$options._componentTag;
        this.logit = debug("components:" + componentName + ":InputLabelMixinControl");
        let onEventDecisionTable = [
            /* beautify preserve:start */
            [   EvtE.FOCUS_IN,          { d_hasFocus: C.Y }    ],
            [   EvtE.FOCUS_OUT,         { d_hasFocus: C.N }    ],
            [   EvtE.HOVER_IN,          { d_hasHover: C.Y }    ],
            [   EvtE.HOVER_OUT,         { d_hasHover: C.N }    ]
            /* beautify preserve:end */
        ];
        this.onEventDE = new DecisionEngine(onEventDecisionTable);

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
        m_evalOnEvent(event) {
            /**
             * @type {DecisionEngine}
             */
            let onEventEngine = this.onEventDE;
            if(!onEventEngine.decideAndMerge(event, this.$data)){
                this.logit("Unhandled on given args [" + arguments + "]");
            }
            this.m_evalShouldMoveLabelUp();
        },
        m_evalShouldMoveLabelUp(){
            /**
             * @type {DecisionEngine}
             */
            let shouldMoveLabelUpDE = this.shouldMoveLabelUpDE;
            let actualFacts = [this.d_hasFocus,   this.d_hasHover,   this.d_isDirty];
            if(!shouldMoveLabelUpDE.decideAndMerge(actualFacts, this.$data)){
                this.logit("Unhandled on actual facts [" + actualFacts + "]");
            }
        }
    },
    computed: {
        withoutthatinferencebreaks(){
            this.d_isDirty;
        }
    },
    watch: {
        d_isDirty(){
            this.m_evalShouldMoveLabelUp();
        }
    }
});

export default InputLabelMixinControl;