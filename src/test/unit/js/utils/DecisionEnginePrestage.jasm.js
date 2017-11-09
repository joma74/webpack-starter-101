/*global describe*/
/*global fdescribe*/
/*global jasmine*/
/*global beforeEach*/
/*global fit*/
/*global it*/
/*global expect*/

"use strict";

import C from "jsm@/utils/C"
import {
    mergeValues as MPmergeValues
} from "jsm@/utils/manprops"
import BitSet from "jsm@/utils/BitSet"
import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";
import {
    f_decideCurried,
    f_wrapDeciderOver,
    f_conditionalizeDecisionTable
} from "jsm@/utils/DecisionEngine"
import {
    f_flatMap
} from "jsm@/utils/ramdautils"
import R__ from "ramda/es/__"
import Ralways from "ramda/es/always"
import Requals from "ramda/es/equals"
import Rinit from "ramda/es/init"
import Rlast from "ramda/es/last"
import RlensProp from "ramda/es/lensProp"
import Rmap from "ramda/es/map"
import Rreduce from "ramda/es/reduce"
import Rset from "ramda/es/set"
import Rtake from "ramda/es/take"


describe("Decision Engine Prestage", () => {

    it("can convert true-false array into a binary string", () => {
        /**
         * @type {boolean[][]} 
         */
        let decisionTable = [
            /* beautify preserve:start */
            [C.Y, C.N, C.N, C.N], //
            /* beautify preserve:end */
        ];
        /**
         * @param {string} acc
         * @param {boolean} elem 
         * @returns {string}
         */
        const f_booleanToBinaryString = (acc, elem) => acc + (elem ? "1" : "0");
        const binaryString = Rreduce(f_booleanToBinaryString, "", decisionTable[0]);
        expect(binaryString.length).toBe(4);
        expect(binaryString).toBe("1000");
    });

    it("can split true-false array into decisions and outcomes", () => {
        /**
         * @type (boolean | object )[][]
         */
        let decisionTable = [
            /* beautify preserve:start */
            [C.Y, C.N, C.N, C.N, { d_hasFocus: C.Y }], //
            [C.N, C.Y, C.N, C.N, { d_hasFocus: C.N }], //
            [C.N, C.N, C.Y, C.N, { d_hasHover: C.Y }], //
            [C.N, C.N, C.N, C.Y, { d_hasHover: C.N }] //
            /* beautify preserve:end */
        ];
        const decisions = Rmap(Rtake(4), decisionTable);
        //
        expect(decisions.length).toBe(4);
        expect(decisions[0].length).toBe(4);
        expect(decisions[0]).toEqual([true, false, false, false]);

        /**
         * @type {object[]}
         */
        const actions = f_flatMap(Rlast, decisionTable);
        //
        expect(actions.length).toBe(4);
        expect(actions[0]).toEqual({
            d_hasFocus: C.Y
        });
    });

    it("can update a property then merge value to original target", () => {
        let target1 = {
            d_hasFocus: C.Y,
            d_hasObservedChange: C.N
        };
        let target2 = {
            d_hasFocus: C.Y,
            d_hasObservedChange: C.N,
            d_apropertyNotInTarget1: C.Y
        };
        let d_HasFocusLens = RlensProp("d_hasFocus");
        let target3 = Rset(d_HasFocusLens, C.N, target2);
        MPmergeValues(target3, target1);
        //
        expect(target1).not.toEqual(target2);
        // @ts-ignore is expected as d_apropertyNotInTarget1 is not given
        expect(target1).not.toEqual(jasmine.objectContaining({
            d_apropertyNotInTarget1: C.Y
        }));
        expect(target1).toEqual({
            d_hasFocus: C.N,
            d_hasObservedChange: C.N
        });

    });

    it("can transform decision table into BitSet-Action array", () => {
        /**
         * @type {boolean[][]} 
         */
        let decisionTable = [
            /* beautify preserve:start */
            [C.Y, C.N, C.N, C.N], //
            [C.N, C.Y, C.N, C.N], //
            [C.N, C.N, C.Y, C.N], //
            [C.N, C.N, C.N, C.Y] //
            /* beautify preserve:end */
        ];
        // split
        /**
         * @param {string} acc
         * @param {boolean} aBoolean 
         */
        const f_booleanToBinaryString = (acc, aBoolean) => acc + (aBoolean ? "1" : "0");
        const arrayOfBinaryStrings = Rmap(Rreduce(f_booleanToBinaryString, ""), decisionTable);
        /**
         * @param {string} binaryString 
         */
        const f_binaryStringToBitSet = binaryString => new BitSet(binaryString);
        const arrayOfBitSets = Rmap(f_binaryStringToBitSet, arrayOfBinaryStrings);
        //
        expect(arrayOfBitSets[0].toString()).toBe("1000");
        expect(arrayOfBitSets[1].toString()).toBe("100");
        expect(arrayOfBitSets[2].toString()).toBe("10");
        expect(arrayOfBitSets[3].toString()).toBe("1");
    });

    it("can reduce a single consideration", () => {
        let considerationMatches = [Requals(EvtE.FOCUS_IN), Requals(C.Y)];
        let considerationNotMatchesA = [Requals(EvtE.FOCUS_OUT), Requals(C.Y)];
        let considerationNotMatchesB = [Requals(EvtE.FOCUS_IN), Requals(C.N)];

        let actualFacts = [EvtE.FOCUS_IN, true];
        //
        expect(f_decideCurried(true, considerationMatches, R__)(actualFacts)).toBe(true);
        expect(f_decideCurried(true, considerationNotMatchesA, R__)(actualFacts)).toBe(false);
        expect(f_decideCurried(true, considerationNotMatchesB, R__)(actualFacts)).toBe(false);
    });

    it("can decide on an array of one consideration", () => {
        let decoratedDecisionTable = [
            /* beautify preserve:start */
            [   Requals(EvtE.FOCUS_IN),     Ralways({ expected: 1 })    ],
            [   Requals(EvtE.FOCUS_OUT),    Ralways({ expected: 2 })    ],
            [   Requals(EvtE.HOVER_IN),     Ralways({ expected: 3 })    ],
            [   Requals(EvtE.HOVER_OUT),    Ralways({ expected: 4 })    ]
            /* beautify preserve:end */
        ];

        let decoratedCases = Rmap(Rinit, decoratedDecisionTable);
        let decoratedOutcomes = f_flatMap(Rlast, decoratedDecisionTable);
        let f_decoratedDecisions = f_wrapDeciderOver(decoratedCases);
        //
        expect(f_decoratedDecisions[0]([EvtE.FOCUS_IN])).toBe(true);
        expect(f_decoratedDecisions[1]([EvtE.FOCUS_OUT])).toBe(true);
        expect(f_decoratedDecisions[2]([EvtE.HOVER_IN])).toBe(true);
        expect(f_decoratedDecisions[3]([EvtE.HOVER_OUT])).toBe(true);
        //
        let f_conditionalDecisionTable = f_conditionalizeDecisionTable(f_decoratedDecisions, decoratedOutcomes);
        // 1.
        expect(f_conditionalDecisionTable([EvtE.FOCUS_IN])).toEqual({
            expected: 1
        });
        expect(f_conditionalDecisionTable([EvtE.FOCUS_OUT])).toEqual({
            expected: 2
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_IN])).toEqual({
            expected: 3
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_OUT])).toEqual({
            expected: 4
        });
    });

    it("can decide on an array of two considerations", () => {
        let decoratedDecisionTable = [
            /* beautify preserve:start */
            [   Requals(EvtE.FOCUS_IN),     Requals(C.Y),   Ralways({ expected: 1 })    ],
            [   Requals(EvtE.FOCUS_OUT),    Requals(C.Y),   Ralways({ expected: 2 })    ],
            [   Requals(EvtE.HOVER_IN),     Requals(C.Y),   Ralways({ expected: 3 })    ],
            [   Requals(EvtE.HOVER_OUT),    Requals(C.Y),   Ralways({ expected: 4 })    ]
            /* beautify preserve:end */
        ];

        let decoratedCases = Rmap(Rinit, decoratedDecisionTable);
        let decoratedOutcomes = f_flatMap(Rlast, decoratedDecisionTable);
        let f_decoratedDecisions = f_wrapDeciderOver(decoratedCases);
        //
        expect(f_decoratedDecisions[0]([EvtE.FOCUS_IN, true])).toBe(true);
        expect(f_decoratedDecisions[1]([EvtE.FOCUS_OUT, true])).toBe(true);
        expect(f_decoratedDecisions[2]([EvtE.HOVER_IN, true])).toBe(true);
        expect(f_decoratedDecisions[3]([EvtE.HOVER_OUT, true])).toBe(true);
        //
        expect(f_decoratedDecisions[0]([EvtE.FOCUS_IN, false])).toBe(false);
        expect(f_decoratedDecisions[1]([EvtE.FOCUS_IN, true])).toBe(false);
        expect(f_decoratedDecisions[2]([EvtE.HOVER_IN, false])).toBe(false);
        expect(f_decoratedDecisions[3]([EvtE.HOVER_IN, true])).toBe(false);

        let f_conditionalDecisionTable = f_conditionalizeDecisionTable(f_decoratedDecisions, decoratedOutcomes);
        // 1.
        expect(f_conditionalDecisionTable([EvtE.FOCUS_IN, true])).toEqual({
            expected: 1
        });
        expect(f_conditionalDecisionTable([EvtE.FOCUS_OUT, true])).toEqual({
            expected: 2
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_IN, true])).toEqual({
            expected: 3
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_OUT, true])).toEqual({
            expected: 4
        });
        // 2.
        expect(f_conditionalDecisionTable([EvtE.FOCUS_IN, true])).toEqual({
            expected: 1
        });
        expect(f_conditionalDecisionTable([EvtE.FOCUS_OUT, true])).toEqual({
            expected: 2
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_IN, true])).toEqual({
            expected: 3
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_OUT, true])).toEqual({
            expected: 4
        });
        // 3.
        expect(f_conditionalDecisionTable([EvtE.FOCUS_IN, true])).toEqual({
            expected: 1
        });
        expect(f_conditionalDecisionTable([EvtE.FOCUS_OUT, true])).toEqual({
            expected: 2
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_IN, true])).toEqual({
            expected: 3
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_OUT, true])).toEqual({
            expected: 4
        });
        // 4.
        expect(f_conditionalDecisionTable([EvtE.FOCUS_IN, true])).toEqual({
            expected: 1
        });
        expect(f_conditionalDecisionTable([EvtE.FOCUS_OUT, true])).toEqual({
            expected: 2
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_IN, true])).toEqual({
            expected: 3
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_OUT, true])).toEqual({
            expected: 4
        });
        // 5.
        expect(f_conditionalDecisionTable([EvtE.FOCUS_IN, true])).toEqual({
            expected: 1
        });
        expect(f_conditionalDecisionTable([EvtE.FOCUS_OUT, true])).toEqual({
            expected: 2
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_IN, true])).toEqual({
            expected: 3
        });
        expect(f_conditionalDecisionTable([EvtE.HOVER_OUT, true])).toEqual({
            expected: 4
        });
    });
});