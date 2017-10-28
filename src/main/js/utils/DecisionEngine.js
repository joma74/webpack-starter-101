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
        this.numberOfCases = this.decisionRules[0].length - 1;
        this.cases = Rmap(Rtake(this.numberOfCases), this.decisionRules);
        this.outcomes = Rflatten(Rmap(RtakeLast(1), this.decisionRules));
        this.evaluate = _decorateDecisionTable(this);
    }

    /**
     * 
     * @param {object} onCase single case to the rule
     * @param {object} mergeOutcomeInto where the values of the outcome get merged into
     */
    decide(onCase, mergeOutcomeInto) {
        let outcome = this.evaluate(onCase);
        MPSmergeValues(outcome, mergeOutcomeInto);
    }

    getDecisionTable() {
        return this.decisionTable;
    }

    getCases() {
        return this.cases;
    }

    getHeaders() {
        return this.headers;
    }

    getNumberOfCases() {
        return this.numberOfCases;
    }

    getOutcomes() {
        return this.outcomes;
    }
}

const _metaData_default = { descriptiveHeaderRows: 0};

/**
 * @param {DecisionEngine} self
 */
function _decorateDecisionTable(self) {
    let indicesOfConsiderations = Rrange(0, self.numberOfCases);
    let mapIndexed = RaddIndex(Rmap);
    let flippedContainsConsideration = Rflip(Rcontains)(indicesOfConsiderations);
    let decorateCell = Rcond([
        [flippedContainsConsideration, (index, cell) => Requals(cell)],
        [RT, (index, cell) => Ralways(cell)]
    ]);
    let decorateRow = mapIndexed((cell, index) => decorateCell(index, cell));
    let decoratedTable = Rmap(decorateRow, self.decisionRules);
    return Rmemoize(Rcond(decoratedTable));
}