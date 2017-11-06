/*global describe*/
/*global it*/
/*global fit*/
/*global expect*/

"use strict";
import {
    range as Rrange,
    clone as Rclone
} from "ramda";
import {
    Event, // eslint-disable-line no-unused-vars
    EventEnum as EvtE
} from "jsm@/components/twitterlike/EventEnum";
import { f_flippedContains } from "jsm@/utils/ramdautils"

describe("ramdautils", () => {

    it("can flip ramda's contains", () => {
        let indicesOfConsiderations = Rrange(0, 1);
        /**
         * @type {function(number):boolean}
         */
        // @ts-ignore
        let f_containsInRange = f_flippedContains(indicesOfConsiderations);
        expect(f_containsInRange(0)).toBe(true);
        expect(f_containsInRange(1)).toBe(false);
    });

    it("avoid Ramda's clone on class instances", () => {
        let FocusInEvent = EvtE.FOCUS_IN;
        let FocusInEventClone = Rclone(FocusInEvent);
        expect(FocusInEvent).not.toEqual(FocusInEventClone);
    });
});