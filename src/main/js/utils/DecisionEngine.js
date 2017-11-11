import C from "jsm@/utils/C"
import {
    mergeValues
} from "jsm@/utils/manprops"
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
import Rrange from "ramda/es/range"
import Rreduced from "ramda/es/reduced"
import RsplitAt from "ramda/es/splitAt"
import Rzip from "ramda/es/zip"
import RT from "ramda/es/T"

/**
 * @typedef {Object} Metadata
 * @property {number} descriptiveHeaderRows - how many first rows contain description
 */
export default class DecisionEngine {

    /**
     * @param {object[][]} decisionTable 
     * @param {Metadata} metaData
     */
    constructor(decisionTable, metaData = _metaData_default) {
        this.decisionTable = decisionTable;
        let headersOverDecisionRules = RsplitAt(metaData.descriptiveHeaderRows, this.decisionTable);
        this.headers = headersOverDecisionRules[0];
        this.decisionRules = headersOverDecisionRules[1];
        this.numberOfConsiderations = this.decisionRules[0].length - 1;
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
     * into the given {mergeOutcomeInto}.
     * 
     * @param {object|object[]} onCase single case to the rule
     * @param {object} mergeOutcomeInto where the values of the outcome get merged into
     * @returns {object|undefined} the outcome
     */
    decideAndMerge(onCase, mergeOutcomeInto) {
        let outcome = this.decide(onCase);
        mergeValues(outcome, mergeOutcomeInto);
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
        return outcome;
    }

    /**
     * Returns the given decision table.
     * @return {object[][]} given decision table
     */
    getDecisionTable() {
        return this.decisionTable;
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
    descriptiveHeaderRows: 0
};

/**
 * Function that accepts a fact and returns true if all considerations in any of the `decoratedCases` can be fulfilled.
 * 
 * @param {object[][]} decoratedCases
 * @returns {(function(object[]):boolean)[]} function that accepts a fact and returns true if the considerations can be fulfilled
 */
export function f_wrapDeciderOver(decoratedCases) {
    return f_mapIndexed((singleCase) => f_decideCurried(true, singleCase, R__), decoratedCases);
}

/**
 * Function that accepts a fact and returns conditionally upon this a matching outcome.   
 * The resulting table from `f_decoratedCases` with `decoratedOutcomes`.
 * 
 * @param {(function(object[]):boolean)[]} f_wrapedDecider 
 * @param {object[][]} decoratedOutcomes
 * @return {any|undefined} returns undefined if not any of the considerations matched 
 */
export function f_conditionalizeDecisionTable(f_wrapedDecider, decoratedOutcomes) {
    let f_decoratedDecisionTable = Rzip(f_wrapedDecider, decoratedOutcomes);
    // @ts-ignore Huh???
    return Rmemoize(Rcond(f_decoratedDecisionTable));
}

export const f_decideCurried = Rcurry(
    /**
     * @param {boolean} accValue 
     * @param {object[]} singleCase
     * @param {object[]} actualFacts
     */
    (accValue, singleCase, actualFacts) => {
        return f_reduceIndexed((acc, singleCase, index) => {
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
        [f_containsConsideration,       (index, cell) => Requals(cell, C.ANY) ? RT : Requals(cell)],
        [RT,                            (index, cell) => Ralways(cell)]
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
function _getCases(table){
    return Rmap(Rinit, table);
}

/**
 * Extract outcomes from the `table`(only the last column).
 * 
 * @param {object[][]} table a 2d array
 * @return {object[][]} extracted outcomes from the `table`
 */
function _getOutcomes(table){
    return f_flatMap(Rlast, table);
}