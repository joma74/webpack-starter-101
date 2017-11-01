import {
    mergeValues as MPSmergeValues
} from "jsm@/utils/manprops"
import {
    addIndex as RaddIndex,
    always as Ralways,
    cond as Rcond,
    contains as Rcontains,
    equals as Requals,
    flatten as Rflatten,
    flip as Rflip,
    map as Rmap,
    memoize as Rmemoize,
    range as Rrange,
    splitAt as RsplitAt,
    take as Rtake,
    takeLast as RtakeLast,
    T as RT
} from "ramda";


export default class DecisionEngine {
    /**
     * @typedef {Object} Metadata
     * @property {number} descriptiveHeaderRows - how many first rows contain description
     */
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
        this.cases = Rmap(Rtake(this.numberOfConsiderations), this.decisionRules);
        this.numberOfCases = this.cases.length;
        this.outcomes = Rflatten(Rmap(RtakeLast(1), this.decisionRules));
        this.evaluate = _decorateDecisionTable(this);
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
        MPSmergeValues(outcome, mergeOutcomeInto);
        return outcome;
    }

    /**
     * Decide the appropriate outcome from the given {onCase}.
     * 
     * @param {object|any[]} onCase single case to the rule
     * @returns {object|undefined} the outcome
     */
    decide(onCase = []) {
        if (onCase.constructor === Array && onCase.length != this.numberOfConsiderations) {
            throw new Error("Given onCase is an array with elements not equal to the expected number of this rule's considerations");
        } else if (onCase.constructor !== Array && 1 != this.numberOfConsiderations) {
            throw new Error("Given onCase is a single object hence not equal to the expected number of this rule's considerations");
        }
        let outcome = this.evaluate(onCase);
        return outcome;
    }

    /**
     * @return {object[][]} given table in constructor 
     */
    getDecisionTable() {
        return this.decisionTable;
    }

    /**
     * @return {object[][]} cases of each decision rule
     */
    getCases() {
        return this.cases;
    }

    /**
     * @returns {object[][]} given headers on the decision table  
     */
    getHeaders() {
        return this.headers;
    }

    /**
     * @returns {number} number of considerations
     */
    getNumberOfConsiderations() {
        return this.numberOfConsiderations;
    }


    /**
     * @returns {number} number of cases over all decision rule
     */
    getNumberOfCases() {
        return this.numberOfCases;
    }

    /**
     * @returns {object[]} outcomes of each decision rule
     */
    getOutcomes() {
        return this.outcomes;
    }
}

const _metaData_default = {
    descriptiveHeaderRows: 0
};

/**
 * @param {DecisionEngine} self
 */
function _decorateDecisionTable(self) {
    let indicesOfConsiderations = Rrange(0, self.numberOfConsiderations);
    let flippedContainsConsideration = Rflip(Rcontains)(indicesOfConsiderations);
    let mapIndexed = RaddIndex(Rmap);
    let decorateCell = Rcond([
        /* beautify preserve:start */
        [flippedContainsConsideration,      (index, cell) => Requals(cell)],
        [RT,                                (index, cell) => Ralways(cell)]
        /* beautify preserve:end */
    ]);
    let decorateRow = mapIndexed((cell, index) => decorateCell(index, cell));
    // Gives [
    // [function(), function(), object]
    // [function(), ...]
    // ]
    let decoratedTable = Rmap(decorateRow, self.decisionRules);
    return Rmemoize(Rcond(decoratedTable));
}