import { Enum, EnumValue } from "ts-enums";

export class Color extends EnumValue {
    /**
     * @param {string} description 
     */
    constructor(description) {
        super(description);
    }
}

class ColorEnumType extends Enum {

    constructor() {
        super();
        this.RED = new Color("RED name");
        this.GREEN = new Color("GREEN name");
        this.BLUE = new Color("BLUE name");
        this.BLACK = new Color("BLACK name");
        this.initEnum("Color");
    }
}

export const ColorEnum = new ColorEnumType();