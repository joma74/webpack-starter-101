/*global describe*/
/*global it*/
/*global expect*/

"use strict";

import { mergeValues, RPick } from "jsm@/utils/manprops"

describe("manprops", () => {

    it("can destructure selective into new object", () => {
        const data = {
            d_hasFocus: true,
            d_hasHover: false,
            d_dunno: null
        }
        /** https://stackoverflow.com/a/39333479 */
        const facts_output = (({ d_hasFocus, d_hasHover }) => ({ d_hasFocus, d_hasHover }))(data); // eslint-disable-line no-undef
        expect(facts_output["d_hasFocus"]).toBe(true);
        expect(facts_output.d_hasHover).toBe(false);
        expect(facts_output.d_dunno).toBeUndefined();
    });

    it("can pick into new object", () => {
        const data = {
            d_hasFocus: true,
            d_hasHover: false,
            d_dunno: null
        }
        const facts_output = RPick(["d_hasFocus", "d_hasHover"], data);
        expect(facts_output["d_hasFocus"]).toBe(true);
        expect(facts_output.d_hasHover).toBe(false);
        expect(facts_output.d_dunno).toBeUndefined();
    });

    it("can destructure selective into existing object", () => {
        const data = {
            d_hasFocus: true,
            d_hasHover: false
        }
        mergeValues({ d_hasFocus: false, d_notExistsInTo: true }, data); // eslint-disable-line no-undef
        expect(data["d_hasFocus"]).toBe(false);
        expect(data.d_hasHover).toBe(false);
        expect(data.d_notExistsInTo).toBeUndefined();
    });
});