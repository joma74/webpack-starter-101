/*global describe*/
/*global it*/
/*global expect*/

"use strict";

import {
    BridgeSuit, // eslint-disable-line no-unused-vars
    BridgeSuitEnum
} from "./BridgeSuitEnum"; 

describe("BridgeSuitEnumType", () => {

    it("can be stringifed as expected", () => {
        let expectedElements = ["BridgeSuit.SPADES", "BridgeSuit.HEARTS", "BridgeSuit.DIAMONDS", "BridgeSuit.CLUBS"]
        for (const nextBridgeSuit of BridgeSuitEnum.values) {
            let c_nextBridgeSuit = /** @type {BridgeSuit} */ (nextBridgeSuit)
            expect(expectedElements.indexOf(c_nextBridgeSuit.toString())).toBeGreaterThanOrEqual(0)
        }
    });
    it("does have the expected major|minor assignement", () => {
        expect(BridgeSuitEnum.SPADES.isMajor).toBe(true)
        expect(BridgeSuitEnum.HEARTS.isMajor).toBe(true)
        expect(BridgeSuitEnum.DIAMONDS.isMajor).toBe(false)
        expect(BridgeSuitEnum.CLUBS.isMajor).toBe(false)
    });
});