/*global describe*/
/*global jasmine*/
/*global beforeEach*/
/*global fit*/
/*global it*/
/*global expect*/

"use strict";

import C from "jsm@/components/twitterlike/C"
import DecisionEngine from "jsm@/utils/DecisionEngine"
import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";

describe("DescisionEngine", () => {

    it("can be set up with a two binary considerations", () => {
        let dataOrig = {
            d_hasFocus: null,
            d_hasHover: null
        };
        let decisionTable =  [
            /* beautify preserve:start */
            [   EvtE.FOCUS_IN,      { d_hasFocus: C.Y }    ],
            [   EvtE.FOCUS_OUT,     { d_hasFocus: C.N }    ],
            [   EvtE.HOVER_IN,      { d_hasHover: C.Y }    ],
            [   EvtE.HOVER_OUT,     { d_hasHover: C.N }    ]
            /* beautify preserve:end */
        ];
        let dEngine = new DecisionEngine(decisionTable);
        //
        let data = Object.assign({}, dataOrig);
        dEngine.decide(EvtE.FOCUS_IN, data);
        expect(data.d_hasFocus).toBe(C.Y);
        expect(data.d_hasHover).toBeNull();
        //
        data = Object.assign({}, dataOrig);
        dEngine.decide(EvtE.FOCUS_OUT, data);
        expect(data.d_hasFocus).toBe(C.N);
        expect(data.d_hasHover).toBeNull();
        //
        data = Object.assign({}, dataOrig);
        dEngine.decide(EvtE.HOVER_IN, data);
        expect(data.d_hasHover).toBe(C.Y);
        expect(data.d_hasFocus).toBeNull();
        //
        data = Object.assign({}, dataOrig);
        dEngine.decide(EvtE.HOVER_OUT, data);
        expect(data.d_hasHover).toBe(C.N);
        expect(data.d_hasFocus).toBeNull();
    });
});