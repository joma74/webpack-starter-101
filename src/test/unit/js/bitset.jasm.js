/*global describe*/
/*global it*/
/*global expect*/

import BitSet from "jsm@/utils/BitSet";

describe("BitSet", () => {
    it("can set at certain position", () => {
        var bs = new BitSet();
        bs.set(127, 1); // Set bit at position 128
        // console.log(bs.toString(16)); // Print out a hex dump with one bit set
        expect(bs.get(127)).toBe(1);
    });
});