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
    reduce as Rreduce,
    map as Rmap,
    take as Rtake,
    takeLast as RtakeLast,
    flatten as Rflatten,
    lensProp as RlensProp,
    set as Rset
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
        expect(arrayOfBitSets[0].toString()).toBe("1000");
        expect(arrayOfBitSets[1].toString()).toBe("100");
        expect(arrayOfBitSets[2].toString()).toBe("10");
        expect(arrayOfBitSets[3].toString()).toBe("1");
    });
});