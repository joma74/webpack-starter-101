import {
    mergeValues
} from "jsm@/utils/manprops"
import {
    f_mapIndexed,
    f_reduceIndexed,
    f_flippedContains,
    f_flatMap
} from "jsm@/utils/ramdautils"
import {
    __ as R__,
    always as Ralways,
    cond as Rcond,
    curry as Rcurry,
    equals as Requals,
    map as Rmap,
    memoize as Rmemoize,
    range as Rrange,
    reduced as Rreduced,
    splitAt as RsplitAt,
    take as Rtake,
    takeLast as RtakeLast,
    zip as Rzip,
    T as RT
} from "ramda";

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
        this.cases = _getCases(this.numberOfConsiderations, this.decisionRules);
        this.numberOfCases = this.cases.length;
        this.outcomes = _getOutcomes(this.decisionRules);
        this.decoratedDecisionTable = _decorateDecisionTable(this.numberOfConsiderations, this.decisionRules);
        this.decoratedCases = _getCases(this.numberOfConsiderations, this.decoratedDecisionTable);
        this.decoratedOutcomes = _getOutcomes(this.decoratedDecisionTable);
        this.f_conditionalDecisionTable = f_conditionalizeDecisionTable(f_decideOn(this.decoratedCases), this.decoratedOutcomes);
    }

    /**
     * Decide the appropriate outcome from the given {onCase}. The outcome will be merged
     * into the given {mergeOutcomeInto}.
     * 
     * @param {object} onCase single case to the rule
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
export function f_decideOn(decoratedCases) {
    return f_mapIndexed((singleCase) => f_decideCurried(true, singleCase, R__), decoratedCases);
}

/**
 * @param {(function(object[]):boolean)[]} f_decoratedCases 
 * @param {object[][]} decoratedOutcomes 
 */
export function f_conditionalizeDecisionTable(f_decoratedCases, decoratedOutcomes) {
    let f_decoratedDecisionTable = Rzip(f_decoratedCases, decoratedOutcomes);
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
        [f_containsConsideration,       (index, cell) => Requals(cell)],
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
 * 
 * @param {number} numberOfConsiderations 
 * @param {object[]} decisionRulesTable 
 */
function _getCases(numberOfConsiderations, decisionRulesTable){
    return Rmap(Rtake(numberOfConsiderations), decisionRulesTable);
}

/**
 * 
 * @param {object[]} decisionRulesTable 
 */
function _getOutcomes(decisionRulesTable){
    return f_flatMap(RtakeLast(1), decisionRulesTable);
}