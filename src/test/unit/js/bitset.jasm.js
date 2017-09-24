/*global describe*/
/*global it*/
/*global expect*/

"use strict";

import BitSet from "jsm@/utils/BitSet";

describe("BitSet", () => {
    it("can be setup with binary string", () => {
        let bs = new BitSet("10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        expect(bs.get(127)).toBe(1);
    });
    it("can be setup with 0b prefix binary string", () => {
        let bs = new BitSet("0b10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        expect(bs.get(127)).toBe(1);
    });
    it("can be setup from static function", () => {
        let bs = BitSet.fromBinaryString("10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        expect(bs.get(127)).toBe(1);
    });
    it("can be asked for most and least significant bit", () => {
        let bs = new BitSet("10000000000000000000000000000000000000000111110000000000000000000000000000000000000000000000000000000000000000000000000000000001");
        expect(bs.get(127)).toBe(1);
        expect(bs.msb()).toBe(127);
        expect(bs.lsb()).toBe(0);
    });
    it("gives Infinity for most significant bit on an empty BitSet", () => {
        let bs = new BitSet();
        expect(bs.msb()).toBe(Infinity);
        expect(bs.lsb()).toBe(0);
    });
    it("gives 0 for least significant bit on an empty BitSet", () => {
        let bs = new BitSet();
        expect(bs.isEmpty()).toBe(true);
        expect(bs.lsb()).toBe(0);
    });
    it("can set bit at position", () => {
        let bs = new BitSet();
        bs.set(127, 1); // Set bit at position 128
        expect(bs.get(127)).toBe(1);
    });
    it("can be converted to binary string", () => {
        let bs = new BitSet();
        bs.set(127, 1); // Set bit at position 128
        expect(bs.toString(2)).toBe("10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        expect(bs.toString()).toBe("10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    });
    it("can be xored by itself", () => {
        let bs1 = new BitSet();
        bs1.set(127, 1); // Set bit at position 128
        let bs2 = bs1.xor(bs1);
        expect(bs2.toString()).toBe("0");
    });
    it("can calculate the number of trailing zeros(ntz)", () => {
        let bs1 = new BitSet();
        bs1.set(127, 1); // Set bit at position 128
        expect(bs1.ntz()).toBe(127);
    });
});