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

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * @param {number} min
 * @param {number} max
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Copies any properties from defaults into target iff they are missing on target
 * @param {*} target 
 * @param {*} defaults 
 */
export function sanitzeObject(target, defaults) {
    for (const p in defaults)
        target[p] = (p in target ? target : defaults)[p];
}