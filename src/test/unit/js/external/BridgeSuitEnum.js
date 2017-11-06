import { Enum, EnumValue } from "ts-enums";
import {
    Color, // eslint-disable-line no-unused-vars
    ColorEnum
} from "./ColorEnum";

"use strict";

export class BridgeSuit extends EnumValue {
    /**
     * @argument {string} description 
     * @argument {boolean} isMajor
     */
    constructor(description, isMajor = false) {
        super(description);
        this._isMajor = isMajor;
    }

    /**
     * @returns {boolean}
     */
    get isMajor() {
        return this._isMajor;
    }

    /**
     * @returns {Color}
     */
    get color() {
        if (this === BridgeSuitEnum.SPADES || this === BridgeSuitEnum.CLUBS) {
            return ColorEnum.BLACK;
        } else {
            return ColorEnum.RED;
        }
    }
}

class BridgeSuitEnumType extends Enum {

    constructor() {
        super();
        this.SPADES = new BridgeSuit("Spades", true);
        this.HEARTS = new BridgeSuit("Hearts", true);
        this.DIAMONDS = new BridgeSuit("Diamonds");
        this.CLUBS = new BridgeSuit("Clubs");
        this.initEnum("BridgeSuit");
    }

    /**
     * @returns {BridgeSuit[]}
     */
    get majors() {
        return this.values.filter(suit => suit.isMajor);
    }
}

export const BridgeSuitEnum = new BridgeSuitEnumType();
