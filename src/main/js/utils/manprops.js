/**
 * Merges only values of properties from from to to iff a property exists already on to.  
 * @param {any} to 
 * @param {any} from 
 */
export function mergeValues(from, to) {
    for (var i in from) {
        if (to.hasOwnProperty(i)) {
            if (typeof to[i] == "object" && typeof from[i] == "object")
                mergeValues(to[i], from[i]);
            else
                to[i] = from[i]
        }
    }
    return to;
}

import  {
    pick as RPick 
} from "ramda"

export { RPick };