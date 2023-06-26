"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowestPricesWithinTimeFrame = exports.priceExtremes = exports.averagePrice = void 0;
const fast_sort_1 = require("fast-sort");
const helpers_1 = require("./helpers");
const averagePrice = (logger, hourlyPrices, priceData, now, options, { below }) => {
    const { hours, percentage } = options;
    if (hours === 0)
        return false;
    const prices = hours !== undefined
        ? (0, helpers_1.takeFromStartOrEnd)(hourlyPrices.filter((p) => hours > 0
            ? p.startsAt.isAfter(now)
            : p.startsAt.isBefore(now, 'hour')), hours)
        : priceData.today;
    const avgPrice = (0, helpers_1.mean)(prices, (item) => item.total);
    if (Number.isNaN(avgPrice)) {
        logger(`Cannot determine condition. No prices for next hours available.`);
        return false;
    }
    if (!priceData.latest)
        return false;
    let diffAvgCurrent = ((priceData.latest.total - avgPrice) / avgPrice) * 100;
    if (below)
        diffAvgCurrent *= -1;
    logger(`${priceData.latest.total} is ${diffAvgCurrent}% ${below ? 'below' : 'above'} avg (${avgPrice}) ${hours ? `next ${hours} hours` : 'today'}. Condition of min ${percentage} percentage met = ${diffAvgCurrent > percentage}`);
    return diffAvgCurrent > percentage;
};
exports.averagePrice = averagePrice;
const priceExtremes = (logger, hourlyPrices, priceData, now, options, { lowest }) => {
    const { hours, ranked_hours: rankedHours } = options;
    if (hours === 0 || rankedHours === 0)
        return false;
    const prices = hours !== undefined
        ? (0, helpers_1.takeFromStartOrEnd)(hourlyPrices.filter((p) => hours > 0
            ? p.startsAt.isAfter(now)
            : p.startsAt.isBefore(now, 'hour')), hours)
        : priceData.today;
    if (!prices.length) {
        logger(`Cannot determine condition. No prices for next hours available.`);
        return false;
    }
    if (priceData.latest === undefined) {
        logger(`Cannot determine condition. The last price is undefined`);
        return false;
    }
    let conditionMet;
    if (rankedHours !== undefined) {
        const sortedPrices = (0, fast_sort_1.sort)(prices).asc((p) => p.total);
        const currentHourRank = sortedPrices.findIndex((p) => { var _a; return p.startsAt === ((_a = priceData.latest) === null || _a === void 0 ? void 0 : _a.startsAt); });
        if (currentHourRank < 0) {
            logger(`Could not find the current hour rank among today's hours`);
            return false;
        }
        conditionMet = lowest
            ? currentHourRank < rankedHours
            : currentHourRank >= sortedPrices.length - rankedHours;
        logger(`${priceData.latest.total} is among the ${lowest ? 'lowest' : 'highest'} ${options.ranked_hours} hours today = ${conditionMet}`);
    }
    else {
        const toCompare = lowest
            ? (0, helpers_1.min)(prices, (p) => p.total).total
            : (0, helpers_1.max)(prices, (p) => p.total).total;
        conditionMet = lowest
            ? priceData.latest.total <= toCompare
            : priceData.latest.total >= toCompare;
        logger(`${priceData.latest.total} is ${lowest ? 'lower than the lowest' : 'higher than the highest'} (${toCompare}) ${options.hours ? `among the next ${options.hours} hours` : 'today'} = ${conditionMet}`);
    }
    return conditionMet;
};
exports.priceExtremes = priceExtremes;
const lowestPricesWithinTimeFrame = (logger, hourlyPrices, priceData, now, options) => {
    const { ranked_hours: rankedHours, start_time: startTime, end_time: endTime, } = options;
    if (rankedHours === 0)
        return false;
    const nonAdjustedStart = (0, helpers_1.parseTimeString)(startTime);
    let start = nonAdjustedStart;
    const nonAdjustedEnd = (0, helpers_1.parseTimeString)(endTime);
    let end = nonAdjustedEnd;
    const periodStretchesOverMidnight = nonAdjustedStart.isAfter(nonAdjustedEnd);
    const adjustStartToYesterday = now.isBefore(nonAdjustedEnd);
    const adjustEndToTomorrow = now.isAfter(nonAdjustedEnd);
    if (periodStretchesOverMidnight) {
        start = nonAdjustedStart
            .clone()
            .subtract(adjustStartToYesterday ? 1 : 0, 'day');
        end = nonAdjustedEnd.clone().add(adjustEndToTomorrow ? 1 : 0, 'day');
    }
    if (!now.isSameOrAfter(start) || !now.isBefore(end)) {
        logger(`Time conditions not met`);
        return false;
    }
    const pricesWithinTimeFrame = hourlyPrices.filter((p) => p.startsAt.isSameOrAfter(start, 'hour') && p.startsAt.isBefore(end));
    if (!pricesWithinTimeFrame.length) {
        logger(`Cannot determine condition. No prices for next hours available.`);
        return false;
    }
    if (priceData.latest === undefined) {
        logger(`Cannot determine condition. The last price is undefined`);
        return false;
    }
    const sortedHours = (0, fast_sort_1.sort)(pricesWithinTimeFrame).asc((p) => p.total);
    const currentHourRank = sortedHours.findIndex((p) => { var _a; return p.startsAt === ((_a = priceData.latest) === null || _a === void 0 ? void 0 : _a.startsAt); });
    if (currentHourRank < 0) {
        logger(`Could not find the current hour rank among today's hours`);
        return false;
    }
    const conditionMet = currentHourRank < rankedHours;
    logger(`${priceData.latest.total} is among the lowest ${rankedHours}
      prices between ${start} and ${end} = ${conditionMet}`);
    return conditionMet;
};
exports.lowestPricesWithinTimeFrame = lowestPricesWithinTimeFrame;
//# sourceMappingURL=comparators.js.map