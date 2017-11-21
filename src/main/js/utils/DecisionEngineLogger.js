import {
    LogLevel, // eslint-disable-line no-unused-vars
    LogLevelEnum
} from "jsm@/utils/LogLevelEnum"
import { default as curryTpl }  from "curry-template";
import Ris from "ramda/es/is"
import RPath from "ramda/es/path"
import RZipObj from "ramda/es/zipObj"

/**
 * @typedef {object} Outcome
 * @property {object} cell
 * @property {number} index
 */

export default class DecisionEngineLogger {

    /**
     * 
     * @param {function(string):void} f_log
     * @param {string[]} considerationHeaders
     * @param {string} decisionTableName
     */
    constructor(f_log, considerationHeaders, decisionTableName) {
        this.f_log = f_log;
        this.considerationHeaders = considerationHeaders;
        this.decisionTableName = decisionTableName;
    }

    /**
     * @param {any[]} onCaseArray
     * @param {Outcome|undefined} outcome
     */
    logOutcome(onCaseArray, outcome) {
        let logLevel = _evaluateLogLevel();
        if (logLevel.isFine()) {
            const msg = _createMsgOnLevelFine(this, outcome);
            this.f_log(msg);
        } else if (logLevel.isFiner()) {
            const msg = _createMsgOnLevelFiner(this, onCaseArray, outcome);
            this.f_log(msg);
        }
    }
}

const _DEFAULT_LOGLEVEL = LogLevelEnum.INFO;

const _f_logLevelConfigPath = RPath(["localStorage", "logLevel"]);
const _f_cellPath = RPath(["cell"]);
const _f_indexPath = RPath(["index"]);

const f_TPL_case = curryTpl("Given >${0}<");
const f_TPL_OUTCOME = curryTpl("${0}he outcome is >${1}<");
const f_TPL_FROM = curryTpl(" from rule ${0}@${1}");


/**
 * @param {DecisionEngineLogger} that
 * @param {Outcome|undefined} outcome
 * @param {boolean} isSyntaxStart
 * @returns {string} message
 */
function _createMsgOnLevelFine(that, outcome, isSyntaxStart=true) {
    let cell = _f_cellPath(outcome);
    let index = _f_indexPath(outcome);
    let msg = f_TPL_OUTCOME([isSyntaxStart ? "T":" t", JSON.stringify(cell)]);
    msg = msg + f_TPL_FROM([JSON.stringify(index), that.decisionTableName]);
    return msg;
}

/**
 * @param {DecisionEngineLogger} that
 * @param {any[]} onCaseArray
 * @param {Outcome|undefined} outcome
 * @returns {string} message
 */
function _createMsgOnLevelFiner(that, onCaseArray, outcome) {
    let msg = f_TPL_case([JSON.stringify(RZipObj(that.considerationHeaders, onCaseArray))]);
    msg = msg + _createMsgOnLevelFine(that, outcome, false);
    return msg;
}

function _evaluateLogLevel() {
    let logLevel = _DEFAULT_LOGLEVEL;
    let logLevelConfig = _f_logLevelConfigPath(window);
    if (Ris(String, logLevelConfig) && LogLevelEnum.byPropName(logLevelConfig)) {
        logLevel = LogLevelEnum.byPropName(logLevelConfig);
    }
    return logLevel;
}
