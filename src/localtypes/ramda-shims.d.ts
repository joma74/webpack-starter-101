import { 
    __, 
    addIndex, always, 
    cond, compose, contains, curry, clone, 
    equals, 
    flatten, flip, 
    init, 
    last, 
    map, memoize, 
    range, reduce, reduced, 
    set, splitAt, 
    T, take,
    zip
} from "../../node_modules/@types/ramda/index.d";

declare module "ramda/es/__" {
    export = __;
}
declare module "ramda/es/always" {
    export = always;
}
declare module "ramda/es/cond" {
    export = cond;
}
declare module "ramda/es/curry" {
    export = curry;
}
declare module "ramda/es/compose" {
    export = compose;
}
declare module "ramda/es/contains" {
    export = contains;
}
declare module "ramda/es/curry" {
    export = curry;
}
declare module "ramda/es/clone" {
    export = clone;
}
declare module "ramda/es/equals" {
    export = equals;
}
declare module "ramda/es/flatten" {
    export = flatten;
}
declare module "ramda/es/flip" {
    export = flip;
}
declare module "ramda/es/init" {
    export = init;
}
declare module "ramda/es/last" {
    export = last;
} 
declare module "ramda/es/map" {
    export = map;
}
declare module "ramda/es/memoize" {
    export = memoize;
}
declare module "ramda/es/range" {
    export = range;
} 
declare module "ramda/es/reduce" {
    export = reduce;
}
declare module "ramda/es/reduced" {
    export = reduced;
}
declare module "ramda/es/set" {
    export = set;
}
declare module "ramda/es/spliAt" {
    export = spliAt;
} 
declare module "ramda/es/take" {
    export = take;
} 
declare module "ramda/es/zip" {
    export = zip;
}
declare module "ramda/es/T" {
    export = T;
} 