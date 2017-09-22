"use strict";

/**
 * The number of bits of a word
 * @const
 * @type number
 */
const WORD_LENGTH = 32;

/**
 * The log base 2 of WORD_LENGTH
 * @const
 * @type number
 */
const WORD_LOG = 5;


/**
 * @typedef {Object} PStruct
 * @property {number[]} data
 * @property {number} _
 */

/** @type {PStruct} */
let P = {
    data: [],
    _: 0
};

/**
* Calculates the number of set bits
* 
* @param {number} v
* @returns {number}
*/
function popCount(v) {

    // Warren, H. (2009). Hacker`s Delight. New York, NY: Addison-Wesley

    v -= ((v >>> 1) & 0x55555555);
    v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
    return (((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24);
}

/**
 * Divide a number in base two by B
 *
 * @param {Array} arr
 * @param {number} B
 * @returns {number}
 */
function divide(arr, B) {

    var r = 0;
    var d;
    var i = 0;

    for (; i < arr.length; i++) {
        r *= 2;
        d = (arr[i] + r) / B | 0;
        r = (arr[i] + r) % B;
        arr[i] = d;
    }
    return r;
}

/**
 * Parses the parameters and set variable P
 *
 * @param {PStruct} P
 * @param {string|BitSet|Array|Uint8Array|number=|undefined} val
 */
function parse(P, val) {

    if (val == null) {
        P.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        P._ = 0;
        return;
    }

    if (val instanceof BitSet) {
        P.data = val.data;
        P._ = val._;
        return;
    }

    let valType = typeof val;
    switch (valType) {
        case "number": {
            let valNumber = /** @type {Number} */(val);
            P.data = [valNumber | 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            P._ = 0;
            break;
        }
        case "string": {
            let valString = /** @type {String} */(val);
            var base = 2;
            var len = WORD_LENGTH;

            if (valString.indexOf("0b") === 0) {
                valString = valString.substr(2);
            } else if (valString.indexOf("0x") === 0) {
                valString = valString.substr(2);
                base = 16;
                len = 8;
            }

            P.data = [];
            P._ = 0;

            var a = valString.length - len;
            var b = valString.length;

            for (; ;) {
                var num = parseInt(valString.slice(a > 0 ? a : 0, b), base);

                if (isNaN(num)) {
                    throw SyntaxError("Invalid param");
                }

                P.data.push(num | 0);

                if (a <= 0)
                    break;

                a -= len;
                b -= len;
            }

            break;
        }
        default: {

            P.data = [0];
            var data = P.data;

            if (val instanceof Array) {

                for (let i = val.length - 1; i >= 0; i--) {

                    var ndx = val[i];

                    if (ndx === Infinity) {
                        P._ = -1;
                    } else {
                        scale(P, ndx);
                        data[ndx >>> WORD_LOG] |= 1 << ndx;
                    }
                }
                break;
            }

            if (Uint8Array && val instanceof Uint8Array) {

                var bits = 8;

                scale(P, val.length * bits);

                for (let i = 0; i < val.length; i++) {

                    var n = val[i];

                    for (var j = 0; j < bits; j++) {

                        var k = i * bits + j;

                        data[k >>> WORD_LOG] |= (n >> j & 1) << k;
                    }
                }
                break;
            }
            throw SyntaxError("Invalid param");
        }
    }
}

/**
 *
 * @param {{data: number[], _: number}} dst The destination of the scaling operation
 * @param {number} ndx The index of the bit to be set
 */
function scale(dst, ndx) {

    let l = ndx >>> WORD_LOG;
    let d = dst.data;
    let v = dst._;

    for (let i = d.length; l >= i; l--) {
        d[l] = v;
    }
}

class BitSet {

    /**
    *
    * @param {string|BitSet|number=} [param=undefined]
    * @returns {BitSet}
    */
    constructor(param) {
        /**
         * @type {number[]}
         */
        this.data = [];
        /**
         * @type {number}
         */
        this._ = 0;

        if (!(this instanceof BitSet)) {
            return new BitSet(param);
        }
        parse(this, param);
        this.data = this.data.slice();
    }

    /**
     * Set a single bit flag
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * bs1.set(3, 1);
     *
     * @param {number} ndx The index of the bit to be set
     * @param {number=|undefined} value Optional value that should be set on the index (0 or 1)
     * @returns {BitSet} this
     */
    set(ndx, value) {

        ndx |= 0;

        scale(this, ndx);

        if (value === undefined || value) {
            this.data[ndx >>> WORD_LOG] |= (1 << ndx);
        } else {
            this.data[ndx >>> WORD_LOG] &= ~(1 << ndx);
        }
        return this;
    }

    /**
     * Get a single bit flag of a certain bit position
     *
     * Ex:
     * bs1 = new BitSet();
     * var isValid = bs1.get(12);
     *
     * @param {number} ndx the index to be fetched
     * @returns {number|undefined} The binary flag
     */
    get(ndx) {

        ndx |= 0;

        var d = this.data;
        var n = ndx >>> WORD_LOG;

        if (n > d.length) {
            return this._ & 1;
        }
        return (d[n] >>> ndx) & 1;
    }

    /**
     * Creates the bitwise AND of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.and(bs2);
     *
     * @param {BitSet} value A bitset object
     * @returns {BitSet} this
     */
    and(value) {// intersection

        parse(P, value);

        var t = this.data;
        var p = P.data;

        var p_ = P._;

        var pl = p.length - 1;
        var tl = t.length - 1;

        var i = tl;

        if (p_ == 0) {
            // clear any bits set:
            for (; i > pl; i--) {
                t[i] = 0;
            }
        }

        for (; i >= 0; i--) {
            t[i] &= p[i];
        }

        this._ &= P._;

        return this;
    }

    /**
     * Creates the bitwise OR of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.or(bs2);
     *
     * @param {BitSet} val A bitset object
     * @returns {BitSet} this
     */
    or(val) { // union

        parse(P, val);

        var t = this.data;
        var p = P.data;

        var pl = p.length - 1;
        var tl = t.length - 1;

        var minLength = Math.min(tl, pl);

        // Append backwards, extend array only once
        for (var i = pl; i > minLength; i--) {
            t[i] = p[i];
        }

        for (; i >= 0; i--) {
            t[i] |= p[i];
        }

        this._ |= P._;

        return this;
    }

    /**
     * Creates the bitwise NOT of a set. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * bs1.not();
     *
     * @returns {BitSet} this
     */
    not() { // invert()

        var d = this.data;
        for (var i = 0; i < d.length; i++) {
            d[i] = ~d[i];
        }

        this._ = ~this._;

        return this;
    }

    /**
     * Creates the bitwise XOR of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.xor(bs2);
     *
     * @param {BitSet} val A bitset object
     * @returns {BitSet} this
     */
    xor(val) { // symmetric difference

        parse(P, val);

        var t = this.data;
        var p = P.data;

        var t_ = this._;
        var p_ = P._;

        var i = 0;

        var tl = t.length - 1;
        var pl = p.length - 1;

        // Cut if tl > pl
        for (i = tl; i > pl; i--) {
            t[i] ^= p_;
        }

        // Cut if pl > tl
        for (i = pl; i > tl; i--) {
            t[i] = t_ ^ p[i];
        }

        // XOR the rest
        for (; i >= 0; i--) {
            t[i] ^= p[i];
        }

        // XOR infinity
        this._ ^= p_;

        return this;
    }

    /**
     * Flip/Invert a range of bits by setting
     *
     * Ex:
     * bs1 = new BitSet();
     * bs1.flip(); // Flip entire set
     * bs1.flip(5); // Flip single bit
     * bs1.flip(3,10); // Flip a bit range
     *
     * @param {number=} from The start index of the range to be flipped
     * @param {number=} to The end index of the range to be flipped
     * @returns {BitSet} this
     */
    flip(from, to) {

        if (from === undefined) {

            return this.not();

        } else if (to === undefined) {

            from |= 0;

            scale(this, from);

            this.data[from >>> WORD_LOG] ^= (1 << from);

        } else if (from <= to && 0 <= from) {

            scale(this, to);

            for (var i = from; i <= to; i++) {
                this.data[i >>> WORD_LOG] ^= (1 << i);
            }
        }
        return this;
    }

    /**
     * Creates the bitwise AND NOT (not confuse with NAND!) of two sets. The result is stored in-place.
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = new BitSet(10);
     *
     * bs1.notAnd(bs2);
     *
     * @param {BitSet} val A bitset object
     * @returns {BitSet} this
     */
    andNot(val) { // difference

        parse(P, val);

        var t = this.data;
        var p = P.data;

        var p_ = P._;

        var l = Math.min(t.length, p.length);

        for (var k = 0; k < l; k++) {
            t[k] &= ~p[k];
        }
        this._ &= ~p_;

        return this;
    }

    /**
     * Clear a range of bits by setting it to 0
     *
     * Ex:
     * bs1 = new BitSet();
     * bs1.clear(); // Clear entire set
     * bs1.clear(5); // Clear single bit
     * bs1.clar(3,10); // Clear a bit range
     *
     * @param {number=} from The start index of the range to be cleared
     * @param {number=} to The end index of the range to be cleared
     * @returns {BitSet} this
     */
    clear(from, to) {

        var data = this.data;

        if (from === undefined) {

            for (let i = data.length - 1; i >= 0; i--) {
                data[i] = 0;
            }
            this._ = 0;

        } else if (to === undefined) {

            from |= 0;

            scale(this, from);

            data[from >>> WORD_LOG] &= ~(1 << from);

        } else if (from <= to) {

            scale(this, to);

            for (let i = from; i <= to; i++) {
                data[i >>> WORD_LOG] &= ~(1 << i);
            }
        }
        return this;
    }

    /**
     * Gets an entire range as a new bitset object
     *
     * Ex:
     * bs1 = new BitSet();
     * bs1.slice(4, 8);
     *
     * @param {number=} from The start index of the range to be get
     * @param {number=} to The end index of the range to be get
     * @returns {BitSet|Object} A new smaller bitset object, containing the extracted range
     */
    slice(from, to) {

        if (from === undefined) {
            return this.clone();

        } else if (to === undefined) {

            to = this.data.length * WORD_LENGTH;

            let im = new BitSet();

            im._ = this._;
            im.data = [0];

            for (var i = from; i <= to; i++) {
                im.set(i - from, this.get(i));
            }
            return im;

        } else if (from <= to && 0 <= from) {

            let im = new BitSet();
            im.data = [0];

            for (let i = from; i <= to; i++) {
                im.set(i - from, this.get(i));
            }
            return im;
        }
        return null;
    }

    /**
     * Set a range of bits
     *
     * Ex:
     * bs1 = new BitSet();
     *
     * bs1.setRange(10, 15, 1);
     *
     * @param {number} from The start index of the range to be set
     * @param {number} to The end index of the range to be set
     * @param {number} value Optional value that should be set on the index (0 or 1)
     * @returns {BitSet} this
     */
    setRange(from, to, value) {

        for (var i = from; i <= to; i++) {
            this.set(i, value);
        }
        return this;
    }

    /**
     * Clones the actual object
     *
     * Ex:
     * bs1 = new BitSet(10);
     * bs2 = bs1.clone();
     *
     * @returns {BitSet|Object} A new BitSet object, containing a copy of the actual object
     */
    clone() {

        var im = Object.create(BitSet.prototype);
        im.data = this.data.slice();
        im._ = this._;

        return im;
    }

    /**
     * Gets a list of set bits
     * 
     * @returns {Array|number}
     */
    toArray() {
        var ret = [];
        var data = this.data;

        for (var i = 0; i < data.length; i++) {

            var num = data[i];

            while (num !== 0) {
                var t = num & -num;
                num ^= t;
                ret.push((i * WORD_LENGTH) + popCount(t - 1));
            }
        }

        if (this._ !== 0)
            ret.push(Infinity);

        return ret;
    }

    /**
     * Overrides the toString method to get a binary representation of the BitSet
     *
     * @param {number=} base
     * @returns {string} A binary string
     */
    toString(base) {

        var data = this.data;

        if (!base)
            base = 2;

        // If base is power of two
        if ((base & (base - 1)) === 0 && base < 36) {

            var retString = "";
            var len = 2 + Math.log(4294967295/*Math.pow(2, WORD_LENGTH)-1*/) / Math.log(base) | 0;

            for (let i = data.length - 1; i >= 0; i--) {

                var cur = data[i];

                // Make the number unsigned
                if (cur < 0)
                    cur += 4294967296 /*Math.pow(2, WORD_LENGTH)*/;

                var tmp = cur.toString(base);

                if (retString !== "") {
                    // Fill small positive numbers with leading zeros. The +1 for array creation is added outside already
                    retString += new Array(len - tmp.length).join("0");
                }
                retString += tmp;
            }

            if (this._ === 0) {

                retString = retString.replace(/^0+/, "");

                if (retString === "")
                    retString = "0";
                return retString;

            } else {
                // Pad the string with ones
                retString = "1111" + retString;
                return retString.replace(/^1+/, "...1111");
            }

        } else {

            if ((2 > base || base > 36))
                throw "Invalid base";

            /**
             * @type {string[]}
             */
            var retStringArray = [];
            var arr = [];

            // Copy every single bit to a new array
            for (let i = data.length; i--;) {

                for (var j = WORD_LENGTH; j--;) {

                    arr.push(data[i] >>> j & 1);
                }
            }

            do {
                retStringArray.unshift(divide(arr, base).toString(base));
            } while (!arr.every(function (x) {
                return x === 0;
            }));

            return retStringArray.join("");
        }
    }

    /**
     * Check if the BitSet is empty, means all bits are unset
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * bs1.isEmpty() ? 'yes' : 'no'
     *
     * @returns {boolean} Whether the bitset is empty
     */
    isEmpty() {

        if (this._ !== 0)
            return false;

        var d = this.data;

        for (var i = d.length - 1; i >= 0; i--) {
            if (d[i] !== 0)
                return false;
        }
        return true;
    }

    /**
     * Calculates the number of bits set
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * var num = bs1.cardinality();
     *
     * @returns {number} The number of bits set
     */
    cardinality() {

        if (this._ !== 0) {
            return Infinity;
        }

        var s = 0;
        var d = this.data;
        for (var i = 0; i < d.length; i++) {
            var n = d[i];
            if (n !== 0)
                s += popCount(n);
        }
        return s;
    }

    /**
     * Calculates the Most Significant Bit / log base two
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * var logbase2 = bs1.msb();
     *
     * var truncatedTwo = Math.pow(2, logbase2); // May overflow!
     *
     * @returns {number} The index of the highest bit set
     */
    msb() {

        if (this._ !== 0) {
            return Infinity;
        }

        var data = this.data;

        for (var i = data.length; i-- > 0;) {

            var v = data[i];
            var c = 0;

            if (v) {
                /* eslint no-empty:0 */
                for (; (v >>>= 1) > 0; c++) {
                }
                return (i * WORD_LENGTH) + c;
            }
        }
        return Infinity;
    }

    /**
     * Calculates the number of trailing zeros
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * var ntz = bs1.ntz();
     *
     * @returns {number} The index of the lowest bit set
     */
    ntz() {

        var data = this.data;

        for (var j = 0; j < data.length; j++) {
            var v = data[j];

            if (v !== 0) {

                v = (v ^ (v - 1)) >>> 1; // Set v's trailing 0s to 1s and zero rest

                return (j * WORD_LENGTH) + popCount(v);
            }
        }
        return Infinity;
    }

    /**
     * Calculates the Least Significant Bit
     *
     * Ex:
     * bs1 = new BitSet(10);
     *
     * var lsb = bs1.lsb();
     *
     * @returns {number} The index of the lowest bit set
     */
    lsb() {

        for (var i = 0; i < this.data.length; i++) {

            var v = this.data[i];
            var c = 0;

            if (v) {

                var bit = (v & -v);

                for (; (bit >>>= 1); c++) {

                }
                return WORD_LENGTH * i + c;
            }
        }
        return this._ & 1;
    }

    /**
  * Compares two BitSet objects
  *
  * Ex:
  * bs1 = new BitSet(10);
  * bs2 = new BitSet(10);
  *
  * bs1.equals(bs2) ? 'yes' : 'no'
  *
  * @param {BitSet} val A bitset object
  * @returns {boolean} Whether the two BitSets are similar
  */
    equals(val) {

        parse(P, val);

        var t = this.data;
        var p = P.data;

        var t_ = this._;
        var p_ = P._;

        var tl = t.length - 1;
        var pl = p.length - 1;

        if (p_ !== t_) {
            return false;
        }

        var minLength = tl < pl ? tl : pl;

        for (var i = 0; i <= minLength; i++) {
            if (t[i] !== p[i])
                return false;
        }

        for (i = tl; i > pl; i--) {
            if (t[i] !== p_)
                return false;
        }

        for (i = pl; i > tl; i--) {
            if (p[i] !== t_)
                return false;
        }
        return true;
    }

} // End of class BitSet

/**
 * Convert a binary string into a BitSet
 * 
 * @param {string} str
 * @return {BitSet}
 */
BitSet.fromBinaryString = function (str) {

    return new BitSet("0b" + str);
};

/**
* Convert a hex string into a BitSet
* @param {string} str
 * @return {BitSet}
*/
BitSet.fromHexString = function (str) {

    return new BitSet("0x" + str);
};

export default BitSet;
