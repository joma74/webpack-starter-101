/*global describe*/
/*global it*/
/*global expect*/

"use strict";

import {Color, ColorEnum} from "./ColorEnum";

describe("ColorEnumType", () => {

    it("can be stringifed as expected", () => {
        let expectedElements = ["Color.RED", "Color.GREEN", "Color.BLUE", "Color.BLACK"]
        for (const nextColor of ColorEnum.values) {
            let c_nextColor = /** @type {Color} */ (nextColor)
            expect(expectedElements.indexOf(c_nextColor.toString())).toBeGreaterThanOrEqual(0)
        }
    });
    it("can be verified as an instance of each", () => {
        for (const nextColor of ColorEnum.values) {
            let c_nextColor = /** @type {Color} */ (nextColor)
            expect(c_nextColor instanceof Color).toBe(true)
        }
    });
    it("can be verified as an instance of individually", () => {
        expect(ColorEnum.RED instanceof Color).toBe(true)
        expect(ColorEnum.GREEN instanceof Color).toBe(true)
        expect(ColorEnum.BLUE instanceof Color).toBe(true)
    });
    it("can be looked up by prop name", () => {
        expect(ColorEnum.byPropName("RED") === ColorEnum.RED).toBe(true)
        expect(ColorEnum.byPropName("GREEN") === ColorEnum.GREEN).toBe(true)
        expect(ColorEnum.byPropName("BLUE") === ColorEnum.BLUE).toBe(true)
    });
    it("does respond with undefined to lookup of undefined prop name", () => {
        expect(ColorEnum.byPropName("DIRTY")).not.toBeDefined()
    });
    it("does have the expected name", () => {
        expect(ColorEnum.RED.propName).toBe("RED")
        expect(ColorEnum.GREEN.propName).toBe("GREEN")
        expect(ColorEnum.BLUE.propName).toBe("BLUE")
    });
    it("does have the expected ordinal (according to order of initialisation)", () => {
        expect(ColorEnum.RED.ordinal).toBe(0)
        expect(ColorEnum.GREEN.ordinal).toBe(1)
        expect(ColorEnum.BLUE.ordinal).toBe(2)
    });
});