"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_each_1 = __importDefault(require("jest-each"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const comparators_1 = require("./comparators");
const logger = () => { };
const yesterday = '2023-01-31T00:00:00+01:00';
const today = '2023-02-01T00:00:00+01:00';
const tomorrow = '2023-02-02T00:00:00+01:00';
const hourlyPrices = [];
for (const day of [yesterday, today, tomorrow]) {
    const startsAt = (0, moment_timezone_1.default)(day);
    let valueBase = 1;
    for (let hour = 0; hour < 24; hour += 1) {
        hourlyPrices.push({
            startsAt: startsAt.clone(),
            total: hour + valueBase,
            energy: hour + valueBase,
            tax: hour + valueBase,
            level: 'NORMAL',
        });
        startsAt.add(1, 'hour');
    }
    valueBase += 10;
}
const priceData = (now) => ({
    today: hourlyPrices.slice(24, 48),
    latest: hourlyPrices.find((p) => p.startsAt.isSame(now, 'hour')),
    lowestToday: hourlyPrices[24],
    highestToday: hourlyPrices[47],
});
describe('comparators', () => {
    describe('averagePrice', () => {
        describe('below avg', () => {
            test('today', () => {
                expect(true);
            });
            test('for the next X hours', () => {
                expect(true);
            });
        });
    });
    describe('priceExtremes', () => {
        describe('today', () => {
            (0, jest_each_1.default) `
        now                            | expectedLowest | expectedHighest
        ${'2023-02-01T00:17:06+01:00'} | ${true}        | ${false}
        ${'2023-02-01T02:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T04:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T06:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T08:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T10:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T12:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T16:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T18:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T20:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T22:17:06+01:00'} | ${false}       | ${false}
        ${'2023-02-01T23:17:06+01:00'} | ${false}       | ${true}
      `.describe('today: $now', ({ now, expectedLowest, expectedHighest }) => {
                test('lowest', () => {
                    const actual = (0, comparators_1.priceExtremes)(logger, hourlyPrices, priceData(now), now, {}, { lowest: true });
                    expect(actual).toBe(expectedLowest);
                });
                test('highest', () => {
                    const actual = (0, comparators_1.priceExtremes)(logger, hourlyPrices, priceData(now), now, {}, { lowest: false });
                    expect(actual).toBe(expectedHighest);
                });
            });
            test('for the next X hours', () => {
                const timeTodayWithLowestPrice = (0, moment_timezone_1.default)('2023-02-01T00:32:27+01:00');
                const actual = (0, comparators_1.priceExtremes)(logger, hourlyPrices, priceData(timeTodayWithLowestPrice), timeTodayWithLowestPrice, { hours: 3 }, { lowest: false });
                expect(actual).toBe(false);
            });
            test('among the X for the next Y hours', () => {
                const timeTodayWithLowestPrice = (0, moment_timezone_1.default)('2023-02-01T00:32:27+01:00');
                const actual = (0, comparators_1.priceExtremes)(logger, hourlyPrices, priceData(timeTodayWithLowestPrice), timeTodayWithLowestPrice, { ranked_hours: 3, hours: 12 }, { lowest: false });
                expect(actual).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=comparators.test.js.map