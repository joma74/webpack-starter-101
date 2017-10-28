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
    take as Rtake,
    takeLast as RtakeLast,
    T as RT
} from "ramda";


export default class DecisionEngine {
    /**
     * @param {object[][]} decisionTable 
     */
    constructor(decisionTable) {
        this.decisionTable = decisionTable;
        this.numberOfConsiderations = this.decisionTable[0].length - 1;
        this.considerations = Rmap(Rtake(this.numberOfConsiderations), this.decisionTable);
        this.outcomes = Rflatten(Rmap(RtakeLast(1), this.decisionTable));
        this.evaluate = _decorateDecisionTable(this);
    }

    /**
     * 
     * @param {object} onCase single case to the rule
     * @param {object} intoOutput where the values of the outcome get merged into
     */
    decide(onCase, intoOutput) {
        let outcome = this.evaluate(onCase);
        MPSmergeValues(outcome, intoOutput);
    }

    getConsiderations(){
        return this.considerations;
    }

    getDecisionsTable(){
        return this.decisionTable;
    }

    getNumberOfConsiderations(){
        return this.numberOfConsiderations;
    }

    getOutcomes(){
        return this.outcomes;
    }
}

/**
 * @param {DecisionEngine} self
 */
function _decorateDecisionTable(self){
    let indicesOfConsiderations = Rrange(0, self.numberOfConsiderations);
    let mapIndexed = RaddIndex(Rmap);
    let flippedContainsConsideration = Rflip(Rcontains)(indicesOfConsiderations);
    let decorateCell = Rcond([
        [ flippedContainsConsideration, (index, cell) => Requals(cell) ],
        [ RT, (index, cell) => Ralways(cell) ]
    ]);
    let decorateRow = mapIndexed((cell, index) => decorateCell(index, cell));
    let decoratedTable = Rmap(decorateRow, self.decisionTable);
    return Rmemoize(Rcond(decoratedTable));
}