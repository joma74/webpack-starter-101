/*global fdescribe*/
/*global it*/
/*global expect*/

"use strict";

fdescribe("decision", () => {

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

    it("can destructure selective into existing object", () => {
        const data = {
            d_hasFocus: true,
            d_hasHover: false
        }
        let mergeExistingProperties = function mergeExistingProperties(a, b) {
            for (var i in b) {
                if (a.hasOwnProperty(i)) {
                    if (typeof a[i] == "object" && typeof b[i]== "object")
                        mergeExistingProperties(a[i], b[i]);
                    else
                        a[i] = b[i]
                }
            }
            return a;
        };
        mergeExistingProperties(data, { d_hasFocus: false, d_dunno: null }); // eslint-disable-line no-undef
        expect(data["d_hasFocus"]).toBe(false);
        expect(data.d_hasHover).toBe(false);
        expect(data.d_dunno).toBeUndefined();
    });
});