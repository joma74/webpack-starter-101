import RaddIndex from "ramda/es/addIndex"
import Rcompose from "ramda/es/compose"
import Rcontains from "ramda/es/contains"
import Rflatten from "ramda/es/flatten"
import Rflip from "ramda/es/flip"
import Rmap from "ramda/es/map"
import Rreduce from "ramda/es/reduce"

export const f_mapIndexed = RaddIndex(Rmap);

export const f_reduceIndexed = RaddIndex(Rreduce);

export const f_flippedContains = Rflip(Rcontains);

export const f_flatMap = Rcompose(Rflatten, Rmap);