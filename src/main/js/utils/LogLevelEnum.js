import { Enum, EnumValue } from "ts-enums";

export class LogLevel extends EnumValue {
    /**
     * @param {string} description 
     */
    constructor(description) {
        super(description);
    }

    /**
     * @return {boolean} is on level FINER
     */
    isFiner(){
        return LogLevelEnum.FINER === this;
    }

    /**
     * @return {boolean} is on level FINE
     */
    isFine(){
        return LogLevelEnum.FINE === this;
    }

    /**
     * @return {boolean} is on level INFO
     */
    isInfo(){
        return LogLevelEnum.INFO === this;
    }

    /**
     * @return {boolean} is on level WARN
     */
    isWarn(){
        return LogLevelEnum.WARN === this;
    }

    /**
     * @return {boolean} is on level WARN
     */
    isError(){
        return LogLevelEnum.ERROR === this;
    }

    /**
     * @return {boolean} is on level SEVERE
     */
    isSevere(){
        return LogLevelEnum.SEVERE === this;
    }
}

class LogLevelType extends Enum {

    constructor() {
        super();
        this.SEVERE = new LogLevel("SEVERE");
        this.ERROR = new LogLevel("ERROR");
        this.WARN = new LogLevel("WARN");
        this.INFO = new LogLevel("INFO");
        this.FINE = new LogLevel("FINE");
        this.FINER = new LogLevel("FINER");
        this.initEnum("LogLevels");
    }
}

export const LogLevelEnum = new LogLevelType();