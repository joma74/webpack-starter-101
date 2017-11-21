import C from "jsm@/utils/C"
import {
    mergeValues,
    sanitzeObject
} from "jsm@/utils/manprops"
import DecisionEngineLogger from "jsm@/utils/DecisionEngineLogger"
import {
    f_mapIndexed,
    f_reduceIndexed,
    f_flippedContains,
    f_flatMap
} from "jsm@/utils/ramdautils"
import R__ from "ramda/es/__"
import Ralways from "ramda/es/always"
import Rcond from "ramda/es/cond"
import Rcurry from "ramda/es/curry"
import Requals from "ramda/es/equals"
import Rinit from "ramda/es/init"
import Rlast from "ramda/es/last"
import Rmap from "ramda/es/map"
import Rmemoize from "ramda/es/memoize"
import RPath from "ramda/es/path"
import Rrange from "ramda/es/range"
import Rreduced from "ramda/es/reduced"
import RsplitAt from "ramda/es/splitAt"
import Rzip from "ramda/es/zip"
import RT from "ramda/es/T"

/**
 * @TODO Describe the concept and part of a decision table.
 * 
 * @typedef {Object} Metadata
 * @property {number=} descriptiveHeaderRows - how many initial rows contain description; last row of descriptions(if any) is used as the to-be logged description for each decision. If there is no 
 * @property {(function(string):void)=} f_log
 * @property {string=} name
 * 
 * @typedef {object} Outcome
 * @property {object} cell
 * @property {number} index
 */
export default class DecisionEngine {

    /**
     * [CAVEAT1] The number of columns of each decision rule from the given `decisionTable` is assumed to be the same for each row 
     * over the whole `decisionTable`. The `DecisionEngine` does NOT check this assumption but uses the number of columns of the 
     * FIRST decision rule for stating this. 
     * 
     * `decisionTable`: A 2d table which may contain descriptive header rows and must contain one or more decision rules.
     * 
     * `metaData`: Meta data that supports the whereabouts of the given `decisionTable`.
    //  * 
     * `metaData.descriptiveHeaderRows`: Descriptive headers can be given in the initial rows of a decision table. If so then 
     * their row count must be given via this variable. So that the `DecisionEngine` instance can 
     * split between the descriptive header rows and the decision rules. From those descriptive header rows the last one is assumed to 
     * hold the consideration names used for logging on `LogLevelEnum.FINER`.  If there are no descriptiveHeaderRows, synthetic unique names are generated after the pattern `"dd" + (column index)`.
     * 
     * `metaData.f_log`: A function that is used to log a message of type string
     * 
     * `metaData.name`: A name for the given `decisionTable` used for logging
     * @param {object[][]} decisionTable 
     * @param {Metadata} metaData
     */
    constructor(decisionTable, metaData = _metaData_default) {
        sanitzeObject(metaData, _metaData_default);
        this.decisionTable = decisionTable;
        this.metaData = metaData;
        this.decisionTableName = metaData.name;
        let headersOverDecisionRules = RsplitAt(metaData.descriptiveHeaderRows, this.decisionTable);
        this.headers = headersOverDecisionRules[0];
        this.decisionRules = headersOverDecisionRules[1];
        this.numberOfConsiderations = this.decisionRules[0].length - 1;
        this.logger = _setupLogger(this.metaData, this.decisionTableName, this.headers, this.numberOfConsiderations);
        this.cases = _getCases(this.decisionRules);
        this.numberOfCases = this.cases.length;
        this.outcomes = _getOutcomes(this.decisionRules);
        this.decoratedDecisionTable = _decorateDecisionTable(this.numberOfConsiderations, this.decisionRules);
        let decoratedCases = _getCases(this.decoratedDecisionTable);
        let decoratedOutcomes = _getOutcomes(this.decoratedDecisionTable);
        let f_wrapedDecider = f_wrapDeciderOver(decoratedCases);
        this.f_conditionalDecisionTable = f_conditionalizeDecisionTable(f_wrapedDecider, decoratedOutcomes);
    }

    /**
     * Decide the appropriate outcome from the given {onCase}. The outcome will be merged
     * into the given {mergeOutcomeInto} if it is not `undefined`.
     * 
     * @param {object|object[]} onCase single case to the rule
     * @param {object} mergeOutcomeInto where the values of the outcome get merged into
     * @returns {object|undefined} the outcome
     */
    decideAndMerge(onCase, mergeOutcomeInto) {
        let outcome = this.decide(onCase);
        if (outcome != undefined) {
            mergeValues(outcome, mergeOutcomeInto);
        }
        return outcome;
    }

    /**
     * Decide the appropriate outcome from the given {onCase}.
     * 
     * @param {object|any[]} onCase single case to the rule
     * @returns {object|undefined} the outcome
     */
    decide(onCase = []) {
        let onCaseArray = onCase;
        if (onCase.constructor === Array) {
            if (onCase.length != this.numberOfConsiderations) {

                throw new Error("Given onCase is an array with elements not equal to the expected number of this rule's considerations");
            }
        } else if (onCase.constructor !== Array) {
            if (1 != this.numberOfConsiderations) {

                throw new Error("Given onCase is a single object hence not equal to the expected number of this rule's considerations");
            }
            onCaseArray = [onCase];
        }
        let outcome = this.f_conditionalDecisionTable(onCaseArray);

        this.logger.logOutcome(onCaseArray, outcome);

        return _f_cellPath(outcome);
    }

    /**
     * Returns the given decision table.
     * @return {object[][]} given decision table
     */
    getDecisionTable() {
        return this.decisionTable;
    }

    /**
     * Returns the given decision table name.
     * @return {string} name of the given decision table 
     */
    getDecisionTableName() {
        return this.decisionTableName;
    }

    /**
     * Returns the given cases of each decision rule
     * @return {object[][]} cases of each decision rule
     */
    getCases() {
        return this.cases;
    }

    /**
     * Returns the given headers on the decision table
     * @returns {object[][]} given headers on the decision table
     */
    getHeaders() {
        return this.headers;
    }

    /**
     * Returns the number of considerations of the given decision table
     * @returns {number} number of considerations
     */
    getNumberOfConsiderations() {
        return this.numberOfConsiderations;
    }


    /**
     * Returns the number of cases for each decision rule
     * @returns {number} number of cases for each decision rule
     */
    getNumberOfCases() {
        return this.numberOfCases;
    }

    /**
     * Returns the outcomes over all decision rules
     * @returns {object[]} outcomes over all decision rules
     */
    getOutcomes() {
        return this.outcomes;
    }

    /**
     * Returns the function-wise decorated decisions table
     * @return {object[][]} the function-wise decorated decisions table
     */
    getDecoratedDecisionTable() {
        return this.decoratedDecisionTable;
    }
}

/**
 * @type {Metadata}
 */
const _metaData_default = {
    descriptiveHeaderRows: 0,
    f_log: (msg) => {}, // eslint-disable-line no-unused-vars
    name: "DecisionTable"
};

const _f_cellPath = RPath(["cell"]);

/**
 * Function that accepts a fact and returns true if all considerations in any of the `decoratedCases` can be fulfilled.
 * 
 * @param {function[][]} decoratedCases
 * @returns {(function(object[]):boolean)[]} function that accepts a fact as `parameter` and returns true if the considerations can be fulfilled
 */
export function f_wrapDeciderOver(decoratedCases) {
    return f_mapIndexed(
        /**
         * @param {object[]} singleCase
         */
        (singleCase) => f_decideCurried(true, singleCase, R__), decoratedCases);
}

/**
 * Returns a function that accepts a fact and returns conditionally upon this a matching `Outcome`.
 * 
 * @param {(function(object[]):boolean)[]} f_wrapedDecider 
 * @param {object[][]} decoratedOutcomes
 * @return {function(object[]):Outcome|undefined} 
 */
export function f_conditionalizeDecisionTable(f_wrapedDecider, decoratedOutcomes) {
    let f_decoratedDecisionTable = Rzip(f_wrapedDecider, decoratedOutcomes);
    // @ts-ignore Huh???
    return Rmemoize(Rcond(f_decoratedDecisionTable));
}

export const f_decideCurried = Rcurry(
    /**
     * @param {boolean} accValue 
     * @param {function[]} singleCase
     * @param {object[]} actualFacts
     */
    (accValue, singleCase, actualFacts) => {
        return f_reduceIndexed(
            /**
             * @param {boolean} acc
             * @param {function(object[]):boolean} singleCase
             * @param {number} index
             */
            (acc, singleCase, index) => {
                acc = singleCase(actualFacts[index]) && acc;
                if (!acc) Rreduced(acc);
                return acc;
            }, accValue, singleCase);
    }
);

/**
 * @param {number} numberOfConsiderations
 * @param {object[][]} decisionRules
 * @returns {function[][]} a 2d array of functions
 */
export function _decorateDecisionTable(numberOfConsiderations, decisionRules) {
    let indicesOfConsiderations = Rrange(0, numberOfConsiderations);
    let f_containsConsideration = f_flippedContains(indicesOfConsiderations);
    let decoratedTable = _decorateConsiderationCells(decisionRules, f_mapIndexed, f_containsConsideration);
    return decoratedTable;
}

/**
 * @param {object[][]} decisionRules
 * @param {function} f_mapIndexed
 * @param {function(number[]): boolean} f_containsConsideration
 * @returns {function[][]} a 2d array of functions
 */
function _decorateConsiderationCells(decisionRules, f_mapIndexed, f_containsConsideration) {
    let f_decorateCell = Rcond([
        /* beautify preserve:start */
        [f_containsConsideration,       (index, cell) => {
            return Requals(cell, C.ANY) ? RT : Requals(cell)
        }],
        [RT,                            (index, cell) => {
            return Ralways( Object.freeze(
                {
                    cell,
                    index
                }
            ) )
        }
        ]
        /* beautify preserve:end */
    ]);
    let f_decorateRow = f_mapIndexed(
        /**
         * @param {any} cell
         * @param {number} index
         */
        (cell, index) => f_decorateCell(index, cell)
    );
    // Gives [
    //      [function(), function(), ..., object]
    //      [function(), function(), ..., object]
    //      [function(), ...]
    /* beautify preserve:end */
    let decoratedTable = Rmap(f_decorateRow, decisionRules);
    return decoratedTable;
}

/**
 * Extract cases from the `table`(all but the last column).
 * 
 * @param {object[][]} table 2d 
 * @return {object[][]} extracted cases from the `table`
 */
function _getCases(table) {
    return Rmap(Rinit, table);
}

/**
 * Extract outcomes from the `table`(only the last column).
 * 
 * @param {object[][]} table a 2d array
 * @return {object[][]} extracted outcomes from the `table`
 */
function _getOutcomes(table) {
    return f_flatMap(Rlast, table);
}

/**
 * 
 * @param {Metadata} metaData 
 * @param {String} decisionTableName
 * @param {string[][]} headers
 * @param {number} numberOfConsiderations
 */
function _setupLogger(metaData, decisionTableName, headers, numberOfConsiderations) {
    let considerationHeaders = null;
    if (metaData.descriptiveHeaderRows == 0) {
        considerationHeaders = f_mapIndexed((cell, index) => "dd" + index, Array.apply(null, Array(numberOfConsiderations)));
    } else {
        considerationHeaders = Rinit(headers[metaData.descriptiveHeaderRows - 1]);
    }
    return new DecisionEngineLogger(metaData.f_log, considerationHeaders, decisionTableName);
}