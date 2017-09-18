/*global describe*/
/*global it*/
/*global expect*/

describe("add method", () => {
    it("adds 2 numbers", function() {
        expect(2 + 5).toBe(7)
    });
    it("adds 3 numbers", () => {
        expect(2 + 5 + 1).toBe(8)
    });
});