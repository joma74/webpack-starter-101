/*global describe*/
/*global it*/
/*global expect*/

import BitSet from "jsm@/utils/BitSet";

describe("decision table", () => {
    it("initial", () => {
        var bs = new BitSet();
        bs.set(128, 1); // Set bit at position 128
        console.log(bs.toString(16)); // Print out a hex dump with one bit set
        expect(bs.get(128)).toBe(1);
    });
});