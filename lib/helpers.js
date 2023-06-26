"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBetweenRange = exports.max = exports.min = exports.sum = exports.mean = exports.takeFromStartOrEnd = exports.parseTimeString = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const parseTimeString = (time) => {
    const [h, m] = time.split(':');
    return moment_timezone_1.default
        .tz('Europe/Oslo')
        .hour(Number(h))
        .minute(Number(m))
        .startOf('minute');
};
exports.parseTimeString = parseTimeString;
const takeFromStartOrEnd = (arr, quantity) => {
    if (quantity === undefined)
        return [];
    let startIndex;
    let endIndex;
    if (Math.sign(quantity) === -1) {
        startIndex = quantity;
        endIndex = undefined;
    }
    else {
        startIndex = 0;
        endIndex = quantity;
    }
    return arr.slice(startIndex, endIndex);
};
exports.takeFromStartOrEnd = takeFromStartOrEnd;
const mean = (arr, func) => (0, exports.sum)(arr, func) / arr.length;
exports.mean = mean;
const sum = (arr, func) => {
    let result = 0;
    for (const item of arr)
        result += func(item);
    return result;
};
exports.sum = sum;
const min = (arr, predicate) => {
    const minimum = Math.min(...arr.map(predicate));
    return arr.find((item) => predicate(item) === minimum);
};
exports.min = min;
const max = (arr, predicate) => {
    const maximum = Math.max(...arr.map(predicate));
    return arr.find((item) => predicate(item) === maximum);
};
exports.max = max;
const randomBetweenRange = (lowerLimit, upperLimitExclusive) => Math.floor(Math.random() * (upperLimitExclusive - lowerLimit) + lowerLimit);
exports.randomBetweenRange = randomBetweenRange;
//# sourceMappingURL=helpers.js.map