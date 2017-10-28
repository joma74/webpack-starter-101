/*global describe*/
/*global jasmine*/
/*global beforeEach*/
/*global fit*/
/*global it*/
/*global expect*/

"use strict";

import C from "jsm@/components/twitterlike/C"
import {
    mergeValues as MPmergeValues
} from "jsm@/utils/manprops"
import BitSet from "jsm@/utils/BitSet"
import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";
import {
    contains as Rcontains,
    flip as Rflip,
    reduce as Rreduce,
    range as Rrange,
    addIndex as RaddIndex,
    map as Rmap,
    take as Rtake,
    takeLast as RtakeLast,
    flatten as Rflatten,
    lensProp as RlensProp,
    set as Rset,
    cond as Rcond,
    clone as Rclone,
    equals as Requals,
    always as Ralways,
    memoize as Rmemoize,
    T as RT
} from "ramda";

describe("decision", () => {

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
         * @param {boolean} aBoolean 
         */
        const f_booleanToBinaryString = (acc, aBoolean) => acc + (aBoolean ? "1" : "0");
        const binaryString = Rreduce(f_booleanToBinaryString, "", decisionTable[0]);
        expect(binaryString.length).toBe(4);
        expect(binaryString).toBe("1000");
    });

    it("can split true-false array into decisions and actions", () => {
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

        const actions = Rflatten(Rmap(RtakeLast(1), decisionTable));
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

    it("can flip ramda's contains", () => {
        let indicesOfConsiderations = Rrange(0,1);
        let flippedContains = Rflip(Rcontains)(indicesOfConsiderations);
        expect(flippedContains(0)).toBe(true);
        expect(flippedContains(1)).toBe(false);
    });

    it("can conditional return function", () => {
        let indicesOfConsiderations = Rrange(0,1);
        // item, list -> list, item is curried
        let flippedContainsConsideration = Rflip(Rcontains)(indicesOfConsiderations);
        let transformRow = Rcond([
            [ flippedContainsConsideration, (index, cell) => { 
                // console.log("1. " +  index + cell); 
                return Requals(cell) 
            } ],
            [ RT, (index, cell) => { 
                // console.log("2. " +  index + cell); 
                return Requals(cell) 
            }]
        ]);
        expect(transformRow(0,"abc")("abc")).toBe(true);
        expect(transformRow(1,"abc")("def")).toBe(false);
        expect(transformRow(1,"def")("def")).toBe(true);
        expect(transformRow(1,"def")("abc")).toBe(false);
    });

    it("can decorate decision table", () => {
        let decisionTable =  [
            /* beautify preserve:start */
            [   EvtE.FOCUS_IN,      { d_hasFocus: C.Y }    ],
            [   EvtE.FOCUS_OUT,     { d_hasFocus: C.N }    ],
            [   EvtE.HOVER_IN,      { d_hasHover: C.Y }    ],
            [   EvtE.HOVER_OUT,     { d_hasHover: C.N }    ]
            /* beautify preserve:end */
        ];
        let indicesOfConsiderations = Rrange(0,1);
        let mapIndexed = RaddIndex(Rmap);
        let flippedContainsConsideration = Rflip(Rcontains)(indicesOfConsiderations);
        let decorateCell = Rcond([
            [ flippedContainsConsideration, (index, cell) => Requals(cell) ],
            [ RT, (index, cell) => Ralways(cell) ]
        ]);
        let decorateRow = mapIndexed((cell, index) => decorateCell(index, cell));
        let decoratedTable = Rmap(decorateRow, decisionTable);
        /**
         * @type {function(Event): {d_hasFocus: boolean} | {d_hasHover: boolean}} | undefined }
         */
        let onEventRuleWhen =  Rmemoize(Rcond(decoratedTable));
        //
        let onEventOutcome = onEventRuleWhen(EvtE.FOCUS_IN);
        expect(onEventOutcome).not.toBeUndefined();
        expect(onEventOutcome).toEqual({ d_hasFocus: C.Y });
        //
        onEventOutcome = onEventRuleWhen(EvtE.HOVER_IN);
        expect(onEventOutcome).not.toBeUndefined();
        expect(onEventOutcome).toEqual({ d_hasHover: C.Y });
        //
        onEventOutcome = onEventRuleWhen(EvtE.FOCUS_OUT);
        expect(onEventOutcome).not.toBeUndefined();
        expect(onEventOutcome).toEqual({ d_hasFocus: C.N });
        //
        onEventOutcome = onEventRuleWhen(EvtE.HOVER_OUT);
        expect(onEventOutcome).not.toBeUndefined();
        expect(onEventOutcome).toEqual({ d_hasHover: C.N });
    });

    it("can rule outcome by when on case", () => {
        /**
         * @type {function(Event): {d_hasFocus: boolean} | {d_hasHover: boolean}} | undefined }
         */
        let onEventRuleWhen =  Rmemoize(Rcond([
            /* beautify preserve:start */
            [   Requals(EvtE.FOCUS_IN),     Ralways({ d_hasFocus: C.Y })    ],
            [   Requals(EvtE.FOCUS_OUT),    Ralways({ d_hasFocus: C.N })    ],
            [   Requals(EvtE.HOVER_IN),     Ralways({ d_hasHover: C.Y })    ],
            [   Requals(EvtE.HOVER_OUT),    Ralways({ d_hasHover: C.N })    ]
            /* beautify preserve:end */
        ]));
        //
        let onEventOutcome = onEventRuleWhen(EvtE.HOVER_IN);
        expect(onEventOutcome).not.toBeUndefined();
        expect(onEventOutcome).toEqual({ d_hasHover: C.Y });
        expect(onEventRuleWhen(EvtE.HOVER_IN)).toEqual({ d_hasHover: C.Y });
        //
        onEventOutcome = onEventRuleWhen(EvtE.FOCUS_IN);
        expect(onEventOutcome).not.toBeUndefined();
        expect(onEventOutcome).toEqual({ d_hasFocus: C.Y });
        expect(onEventRuleWhen(EvtE.FOCUS_IN)).toEqual({ d_hasFocus: C.Y });
        //
        onEventOutcome = onEventRuleWhen("WHATSUP");
        expect(onEventOutcome).toBeUndefined();
        expect(onEventRuleWhen("WHATSUP")).toBeUndefined();
    });

    it("avoid Ramda's clone", () => {
        let FocusInEvent = EvtE.FOCUS_IN;
        let FocusInEventClone = Rclone(FocusInEvent);
        expect(FocusInEvent).not.toEqual(FocusInEventClone);
    });
});