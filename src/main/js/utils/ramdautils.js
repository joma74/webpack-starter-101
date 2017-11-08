import {
    addIndex as RaddIndex,
    compose as Rcompose,
    contains as Rcontains,
    flatten as Rflatten,
    flip as Rflip,
    map as Rmap,
    reduce as Rreduce
} from "ramda";


export const f_mapIndexed = RaddIndex(Rmap);

export const f_reduceIndexed = RaddIndex(Rreduce);

export const f_flippedContains = Rflip(Rcontains);

export const f_flatMap = Rcompose(Rflatten, Rmap);