/*global describe*/
/*global it*/
/*global expect*/

describe("add method", () => {
    it("adds 2 numbers", () => {
        expect(2 + 5).toBe(9)
    });
    it("off by 1", () => {
        expect(2 + 5).toBe(7)
    });
});