import { Enum, EnumValue } from "ts-enums";

export class Event extends EnumValue {
    /**
     * @param {string} description 
     */
    constructor(description) {
        super(description);
    }
}

class EventEnumType extends Enum {

    constructor() {
        super();
        this.FOCUS_IN = new Event("Focus in event");
        this.FOCUS_OUT = new Event("Focus out event");
        this.HOVER_IN = new Event("Hover in event");
        this.HOVER_OUT = new Event("Hover out event");
        this.initEnum("Events");
    }
}

export const EventEnum = new EventEnumType();