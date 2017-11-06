/*global describe*/
/*global fdescribe*/
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

    it("can be set up with one type consideration", () => {
        let dataOrig = {
            d_hasFocus: null,
            d_hasHover: null
        };
        let decisionTable = [
            /* beautify preserve:start */
            [   EvtE.FOCUS_IN,          { d_hasFocus: C.Y }    ],
            [   EvtE.FOCUS_OUT,         { d_hasFocus: C.N }    ],
            [   EvtE.HOVER_IN,          { d_hasHover: C.Y }    ],
            [   EvtE.HOVER_OUT,         { d_hasHover: C.N }    ]
            /* beautify preserve:end */
        ];
        let dEngine = new DecisionEngine(decisionTable);
        expect(dEngine.getNumberOfCases()).toEqual(4);
        expect(dEngine.getNumberOfConsiderations()).toEqual(1);
        //
        let data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge(EvtE.FOCUS_IN, data);
        expect(data.d_hasFocus).toBe(C.Y);
        expect(data.d_hasHover).toBeNull();
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge(EvtE.FOCUS_OUT, data);
        expect(data.d_hasFocus).toBe(C.N);
        expect(data.d_hasHover).toBeNull();
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge(EvtE.HOVER_IN, data);
        expect(data.d_hasHover).toBe(C.Y);
        expect(data.d_hasFocus).toBeNull();
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge(EvtE.HOVER_OUT, data);
        expect(data.d_hasHover).toBe(C.N);
        expect(data.d_hasFocus).toBeNull();
    });

    it("can be set up with one binary consideration", () => {
        let dataOrig = {
            d_result: null
        };
        let decisionTable = [
            /* beautify preserve:start */
            [   C.Y,    { d_result: C.Y }    ],
            [   C.N,    { d_result: C.N }    ]
            /* beautify preserve:end */
        ];
        let dEngine = new DecisionEngine(decisionTable);
        expect(dEngine.getNumberOfCases()).toEqual(2);
        expect(dEngine.getNumberOfConsiderations()).toEqual(1);
        //
        let data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge(C.Y, data);
        expect(data.d_result).toBe(C.Y);
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge(C.N, data);
        expect(data.d_result).toBe(C.N);
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge("WHUTSDAT?", data);
        expect(data.d_result).toBeNull();
    });

    it("can be set up with two mixed consideration", () => {
        let dataOrig = {
            d_result: null
        };
        let decisionTable = [
            /* beautify preserve:start */
            [   EvtE.FOCUS_IN,      C.Y,    { d_result: C.Y }       ],
            [   EvtE.FOCUS_OUT,     C.N,    { d_result: C.N }       ],
            [   EvtE.HOVER_IN,      C.Y,    { d_result: C.ANY }     ],
            [   EvtE.HOVER_OUT,     C.N,    { d_result: C.I }       ]
            /* beautify preserve:end */
        ];
        let dEngine = new DecisionEngine(decisionTable);
        expect(dEngine.getNumberOfCases()).toEqual(4);
        expect(dEngine.getNumberOfConsiderations()).toEqual(2);
        //
        let data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge([ EvtE.FOCUS_IN, C.Y ], data);
        expect(data.d_result).toBe(C.Y);
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge([ EvtE.FOCUS_OUT, C.N ], data);
        expect(data.d_result).toBe(C.N);
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge([ EvtE.HOVER_IN, C.Y ], data);
        expect(data.d_result).toBe(C.ANY);
        //
        data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge([ EvtE.HOVER_OUT, C.N ], data);
        expect(data.d_result).toBe(C.I);
        //
        data = Object.assign({}, dataOrig);
        let result = dEngine.decideAndMerge([ EvtE.HOVER_OUT, C.Y ], data);
        expect(result).toBeUndefined();
        //
        data = Object.assign({}, dataOrig);
        result = dEngine.decideAndMerge([ "Hah!", "Huh?" ], data);
        expect(result).toBeUndefined();
    });

    it("can ignore three descriptive header rows", () => {
        let dataOrig = {
            d_hasFocus: null,
            d_hasHover: null
        };
        let decisionTable = [
            /* beautify preserve:start */
            [   "Which type of event",  "What state should"],
            [   "is it?",               "be changed to"],
            [   "",                     "which value?"],
            [   EvtE.FOCUS_IN,          { d_hasFocus: C.Y }    ],
            [   EvtE.FOCUS_OUT,         { d_hasFocus: C.N }    ],
            [   EvtE.HOVER_IN,          { d_hasHover: C.Y }    ],
            [   EvtE.HOVER_OUT,         { d_hasHover: C.N }    ]
            /* beautify preserve:end */
        ];
        let dEngine = new DecisionEngine(decisionTable, {
            descriptiveHeaderRows: 3
        });
        expect(dEngine.getNumberOfCases()).toEqual(4);
        expect(dEngine.getNumberOfConsiderations()).toEqual(1);
        //
        let data = Object.assign({}, dataOrig);
        dEngine.decideAndMerge(EvtE.FOCUS_IN, data);
        expect(data.d_hasFocus).toBe(C.Y);
        expect(data.d_hasHover).toBeNull();
    });
});