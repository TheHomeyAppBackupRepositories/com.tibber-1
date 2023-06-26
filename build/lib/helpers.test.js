"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_each_1 = __importDefault(require("jest-each"));
const helpers_1 = require("./helpers");
describe('helpers', () => {
    describe('min', () => {
        test('simple', () => {
            const values = [{ value: 7 }, { value: 13 }, { value: 2 }, { value: 5 }];
            const actual = (0, helpers_1.min)(values, (item) => item.value);
            expect(actual).toStrictEqual({ value: 2 });
        });
    });
    describe('max', () => {
        test('simple', () => {
            const values = [{ value: 7 }, { value: 13 }, { value: 2 }, { value: 5 }];
            const actual = (0, helpers_1.max)(values, (item) => item.value);
            expect(actual).toStrictEqual({ value: 13 });
        });
    });
    describe('sum', () => {
        test('simple', () => {
            const values = [2, 5, 7, 13];
            const actual = (0, helpers_1.sum)(values, (item) => item);
            expect(actual).toBe(27);
        });
    });
    describe('mean', () => {
        test('simple', () => {
            const values = [2, 5, 7, 13];
            const actual = (0, helpers_1.mean)(values, (item) => item);
            expect(actual).toBe(6.75);
        });
        test('empty array', () => {
            const values = [];
            const actual = (0, helpers_1.mean)(values, (item) => item);
            expect(actual).toBeNaN();
        });
    });
    describe('takeFromStartOrEnd', () => {
        (0, jest_each_1.default) `
       quantity | expected
       ${0}     | ${[]}
       ${1}     | ${[1]}
       ${2}     | ${[1, 2]}
       ${-1}    | ${[8]}
       ${-2}    | ${[7, 8]}
       ${9}     | ${[1, 2, 3, 4, 5, 6, 7, 8]}
    `.test('$start - $end: $expected', ({ quantity, expected }) => {
            const arr = [1, 2, 3, 4, 5, 6, 7, 8];
            const actual = (0, helpers_1.takeFromStartOrEnd)(arr, quantity);
            expect(actual).toStrictEqual(expected);
        });
    });
});
//# sourceMappingURL=helpers.test.js.map