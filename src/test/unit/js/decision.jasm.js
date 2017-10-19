/*global describe*/
/*global it*/
/*global expect*/

"use strict";

import C from "jsm@/components/twitterlike/C"
import BitSet from "jsm@/utils/BitSet"
import {
    apply as Rapply
} from "ramda";

describe("decision", () => {

    it("can convert true-false array into a BitSet", () => {
        /**
         * @type {boolean[][]} 
         */
        let decisionTable = [
            /* beautify preserve:start */
            [          C.Y,            C.N,           C.N,            C.N ], //
            [          C.N,            C.Y,           C.N,            C.N ], //
            [          C.N,            C.N,           C.Y,            C.N ], //
            [          C.N,            C.N,           C.N,            C.Y ] //
            /* beautify preserve:end */
        ];
        const booleansToBinaryString = 
        /**
         * 
         * @param {boolean[]} arrayOfBooleans 
         * @returns {BitSet}
         */
        const transformToBitset = arrayOfBooleans => {arrayOfBooleans; return new BitSet("1000")};
        const tBitSet = Rapply(transformToBitset, decisionTable[0]);
        expect(tBitSet).toEqual(new BitSet("1000"));
    });
});