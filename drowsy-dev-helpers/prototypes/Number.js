'use strict';

/**
 * Returns True if the Number is between two values. Min/Max can be in arbitrary order, they are sorted upon execution.
 * @param a Either the minimum or maximum value
 * @param b Either the minimum or maximum value
 * @param inclusive Include the min and max as passing values (default = false)
 * @returns {boolean}
 */
Number.prototype.between = function (a, b, inclusive = false) {
    if (typeof a !== 'number')
        throw new TypeError(`Number.prototype.between called on ${this} was expecting arguments of type number, but instead received ${typeof a}`);
    else if (typeof b !== 'number')
        throw new TypeError(`Number.prototype.between called on ${this} was expecting arguments of type number, but instead received ${typeof b}`);

    let min = Math.min(a, b), max = Math.max(a, b);
    return inclusive ? min <= this && this <= max : min < this && this < max;
};