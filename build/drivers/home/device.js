"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _HomeDevice_instances, _HomeDevice_api, _HomeDevice_deviceLabel, _HomeDevice_insightId, _HomeDevice_prices, _HomeDevice_priceChangedTrigger, _HomeDevice_consumptionReportTrigger, _HomeDevice_priceBelowAvgTrigger, _HomeDevice_priceAboveAvgTrigger, _HomeDevice_priceBelowAvgTodayTrigger, _HomeDevice_priceAboveAvgTodayTrigger, _HomeDevice_priceAtLowestTrigger, _HomeDevice_priceAtHighestTrigger, _HomeDevice_priceAtLowestTodayTrigger, _HomeDevice_priceAtHighestTodayTrigger, _HomeDevice_priceAmongLowestTrigger, _HomeDevice_priceAmongHighestTrigger, _HomeDevice_currentPriceBelowCondition, _HomeDevice_currentPriceBelowAvgCondition, _HomeDevice_currentPriceAboveAvgCondition, _HomeDevice_currentPriceBelowAvgTodayCondition, _HomeDevice_currentPriceAboveAvgTodayCondition, _HomeDevice_currentPriceAtLowestCondition, _HomeDevice_currentPriceAtHighestCondition, _HomeDevice_currentPriceAtLowestTodayCondition, _HomeDevice_currentPriceAtHighestTodayCondition, _HomeDevice_currentPriceAmongLowestTodayCondition, _HomeDevice_currentPriceAmongHighestTodayCondition, _HomeDevice_currentPriceAmongLowestWithinTimeFrameCondition, _HomeDevice_sendPushNotificationAction, _HomeDevice_hasDeprecatedTotalPriceCapability, _HomeDevice_hasDeprecatedPriceLevelCapability, _HomeDevice_hasDeprecatedMeasurePriceLevelCapability, _HomeDevice_updateData, _HomeDevice_handlePrice, _HomeDevice_updateLowestAndHighestPrice, _HomeDevice_generateConsumptionReport, _HomeDevice_logConsumptionInsightsAndInvokeTrigger, _HomeDevice_getLastLoggedDailyConsumption, _HomeDevice_setLastLoggedDailyConsumption, _HomeDevice_getLastLoggedHourlyConsumption, _HomeDevice_setLastLoggedHourlyConsumption, _HomeDevice_priceAvgComparator, _HomeDevice_priceMinMaxComparator, _HomeDevice_lowestPricesWithinTimeFrame, _HomeDevice_scheduleUpdate, _HomeDevice_getLoggerPrefix, _HomeDevice_isConsumptionReportEnabled, _HomeDevice_createGetLog;
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = require("homey");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const api_1 = require("../../lib/api");
const newrelic_transaction_1 = require("../../lib/newrelic-transaction");
const helpers_1 = require("../../lib/helpers");
const constants_1 = require("../../lib/constants");
const errors_1 = require("../../lib/errors");
const comparators_1 = require("../../lib/comparators");
const deprecatedPriceLevelMap = {
    VERY_CHEAP: 'LOW',
    CHEAP: 'LOW',
    NORMAL: 'NORMAL',
    EXPENSIVE: 'HIGH',
    VERY_EXPENSIVE: 'HIGH',
};
class HomeDevice extends homey_1.Device {
    constructor() {
        super(...arguments);
        _HomeDevice_instances.add(this);
        _HomeDevice_api.set(this, void 0);
        _HomeDevice_deviceLabel.set(this, void 0);
        _HomeDevice_insightId.set(this, void 0);
        _HomeDevice_prices.set(this, { today: [] });
        _HomeDevice_priceChangedTrigger.set(this, void 0);
        _HomeDevice_consumptionReportTrigger.set(this, void 0);
        _HomeDevice_priceBelowAvgTrigger.set(this, void 0);
        _HomeDevice_priceAboveAvgTrigger.set(this, void 0);
        _HomeDevice_priceBelowAvgTodayTrigger.set(this, void 0);
        _HomeDevice_priceAboveAvgTodayTrigger.set(this, void 0);
        _HomeDevice_priceAtLowestTrigger.set(this, void 0);
        _HomeDevice_priceAtHighestTrigger.set(this, void 0);
        _HomeDevice_priceAtLowestTodayTrigger.set(this, void 0);
        _HomeDevice_priceAtHighestTodayTrigger.set(this, void 0);
        _HomeDevice_priceAmongLowestTrigger.set(this, void 0);
        _HomeDevice_priceAmongHighestTrigger.set(this, void 0);
        _HomeDevice_currentPriceBelowCondition.set(this, void 0);
        _HomeDevice_currentPriceBelowAvgCondition.set(this, void 0);
        _HomeDevice_currentPriceAboveAvgCondition.set(this, void 0);
        _HomeDevice_currentPriceBelowAvgTodayCondition.set(this, void 0);
        _HomeDevice_currentPriceAboveAvgTodayCondition.set(this, void 0);
        _HomeDevice_currentPriceAtLowestCondition.set(this, void 0);
        _HomeDevice_currentPriceAtHighestCondition.set(this, void 0);
        _HomeDevice_currentPriceAtLowestTodayCondition.set(this, void 0);
        _HomeDevice_currentPriceAtHighestTodayCondition.set(this, void 0);
        _HomeDevice_currentPriceAmongLowestTodayCondition.set(this, void 0);
        _HomeDevice_currentPriceAmongHighestTodayCondition.set(this, void 0);
        _HomeDevice_currentPriceAmongLowestWithinTimeFrameCondition.set(this, void 0);
        _HomeDevice_sendPushNotificationAction.set(this, void 0);
        _HomeDevice_hasDeprecatedTotalPriceCapability.set(this, false);
        _HomeDevice_hasDeprecatedPriceLevelCapability.set(this, false);
        _HomeDevice_hasDeprecatedMeasurePriceLevelCapability.set(this, false);
    }
    async onInit() {
        __classPrivateFieldSet(this, _HomeDevice_hasDeprecatedTotalPriceCapability, this.hasCapability('price_total'), "f");
        __classPrivateFieldSet(this, _HomeDevice_hasDeprecatedPriceLevelCapability, this.hasCapability('price_level'), "f");
        __classPrivateFieldSet(this, _HomeDevice_hasDeprecatedMeasurePriceLevelCapability, this.hasCapability('measure_price_level'), "f");
        const data = this.getData();
        const { id: homeId, t: token } = data;
        __classPrivateFieldSet(this, _HomeDevice_api, new api_1.TibberApi(this.log, this.homey.settings, homeId, token), "f");
        if (data.address === undefined) {
            return this.setUnavailable('You will need to remove and add this home as new device');
        }
        __classPrivateFieldSet(this, _HomeDevice_deviceLabel, this.getName(), "f");
        __classPrivateFieldSet(this, _HomeDevice_insightId, __classPrivateFieldGet(this, _HomeDevice_deviceLabel, "f")
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase(), "f");
        __classPrivateFieldGet(this, _HomeDevice_prices, "f").latest = undefined;
        __classPrivateFieldSet(this, _HomeDevice_priceChangedTrigger, this.homey.flow.getDeviceTriggerCard('price_changed'), "f");
        __classPrivateFieldSet(this, _HomeDevice_consumptionReportTrigger, this.homey.flow.getDeviceTriggerCard('consumption_report'), "f");
        __classPrivateFieldSet(this, _HomeDevice_priceBelowAvgTrigger, this.homey.flow.getDeviceTriggerCard('price_below_avg'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceBelowAvgTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_priceAboveAvgTrigger, this.homey.flow.getDeviceTriggerCard('price_above_avg'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceAboveAvgTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_priceBelowAvgTodayTrigger, this.homey.flow.getDeviceTriggerCard('price_below_avg_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceBelowAvgTodayTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_priceAboveAvgTodayTrigger, this.homey.flow.getDeviceTriggerCard('price_above_avg_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceAboveAvgTodayTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_priceAtLowestTrigger, this.homey.flow.getDeviceTriggerCard('price_at_lowest'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceAtLowestTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_priceAtHighestTrigger, this.homey.flow.getDeviceTriggerCard('price_at_highest'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceAtHighestTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_priceAtLowestTodayTrigger, this.homey.flow.getDeviceTriggerCard('price_at_lowest_today'), "f");
        __classPrivateFieldSet(this, _HomeDevice_priceAtHighestTodayTrigger, this.homey.flow.getDeviceTriggerCard('price_at_highest_today'), "f");
        __classPrivateFieldSet(this, _HomeDevice_priceAmongLowestTrigger, this.homey.flow.getDeviceTriggerCard('price_among_lowest_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceAmongLowestTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_priceAmongHighestTrigger, this.homey.flow.getDeviceTriggerCard('price_among_highest_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_priceAmongHighestTrigger, "f").registerRunListener(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).bind(this));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceBelowCondition, this.homey.flow.getConditionCard('current_price_below'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceBelowCondition, "f").registerRunListener((args, _state) => {
            if (__classPrivateFieldGet(this, _HomeDevice_prices, "f").latest === undefined)
                return false;
            return args.price > Number(__classPrivateFieldGet(this, _HomeDevice_prices, "f").latest.total);
        });
        __classPrivateFieldSet(this, _HomeDevice_currentPriceBelowAvgCondition, this.homey.flow.getConditionCard('cond_price_below_avg'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceBelowAvgCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).call(this, args, { below: true }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAboveAvgCondition, this.homey.flow.getConditionCard('cond_price_above_avg'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAboveAvgCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).call(this, args, { below: false }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceBelowAvgTodayCondition, this.homey.flow.getConditionCard('cond_price_below_avg_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceBelowAvgTodayCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).call(this, args, { below: true }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAboveAvgTodayCondition, this.homey.flow.getConditionCard('cond_price_above_avg_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAboveAvgTodayCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceAvgComparator).call(this, args, { below: false }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAtLowestCondition, this.homey.flow.getConditionCard('cond_price_at_lowest'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAtLowestCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, args, { lowest: true }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAtHighestCondition, this.homey.flow.getConditionCard('cond_price_at_highest'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAtHighestCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, args, { lowest: false }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAtLowestTodayCondition, this.homey.flow.getConditionCard('cond_price_at_lowest_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAtLowestTodayCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, args, { lowest: true }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAtHighestTodayCondition, this.homey.flow.getConditionCard('cond_price_at_highest_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAtHighestTodayCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, args, { lowest: false }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAmongLowestTodayCondition, this.homey.flow.getConditionCard('cond_price_among_lowest_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAmongLowestTodayCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, args, { lowest: true }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAmongHighestTodayCondition, this.homey.flow.getConditionCard('cond_price_among_highest_today'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAmongHighestTodayCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, args, { lowest: false }));
        __classPrivateFieldSet(this, _HomeDevice_currentPriceAmongLowestWithinTimeFrameCondition, this.homey.flow.getConditionCard('price_among_lowest_during_time'), "f");
        __classPrivateFieldGet(this, _HomeDevice_currentPriceAmongLowestWithinTimeFrameCondition, "f").registerRunListener((args) => __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_lowestPricesWithinTimeFrame).call(this, args));
        __classPrivateFieldSet(this, _HomeDevice_sendPushNotificationAction, this.homey.flow.getActionCard('sendPushNotification'), "f");
        __classPrivateFieldGet(this, _HomeDevice_sendPushNotificationAction, "f").registerRunListener(async (args) => __classPrivateFieldGet(this, _HomeDevice_api, "f").sendPush(args.title, args.message));
        if (!this.hasCapability('price_level'))
            await this.addCapability('price_level');
        if (!this.hasCapability('measure_price_level'))
            await this.addCapability('measure_price_level');
        if (!this.hasCapability('measure_price_info_level'))
            await this.addCapability('measure_price_info_level');
        if (!this.hasCapability('measure_price_total'))
            await this.addCapability('measure_price_total');
        if (this.hasCapability('measure_temperature')) {
            await this.removeCapability('measure_temperature');
            await this.homey.notifications
                .createNotification({
                excerpt: 'Please note potential breaking changes with this version of the ' +
                    "Tibber app. Details available on the app's store page.",
            })
                .catch(console.error);
        }
        if (!this.hasCapability('measure_price_lowest'))
            await this.addCapability('measure_price_lowest');
        if (!this.hasCapability('measure_price_highest'))
            await this.addCapability('measure_price_highest');
        this.log(`Tibber home device ${this.getName()} has been initialized`);
        await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_updateData).call(this);
        return undefined;
    }
    onDeleted() {
        var _a;
        this.log('Device deleted:', __classPrivateFieldGet(this, _HomeDevice_deviceLabel, "f"));
        this.homey.settings.set(`${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_lastLoggedDailyConsumption`, undefined);
        this.homey.settings.set(`${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_lastLoggerHourlyConsumption`, undefined);
        return (_a = this.homey.app) === null || _a === void 0 ? void 0 : _a.cleanupLogs(__classPrivateFieldGet(this, _HomeDevice_insightId, "f"));
    }
}
_HomeDevice_api = new WeakMap(), _HomeDevice_deviceLabel = new WeakMap(), _HomeDevice_insightId = new WeakMap(), _HomeDevice_prices = new WeakMap(), _HomeDevice_priceChangedTrigger = new WeakMap(), _HomeDevice_consumptionReportTrigger = new WeakMap(), _HomeDevice_priceBelowAvgTrigger = new WeakMap(), _HomeDevice_priceAboveAvgTrigger = new WeakMap(), _HomeDevice_priceBelowAvgTodayTrigger = new WeakMap(), _HomeDevice_priceAboveAvgTodayTrigger = new WeakMap(), _HomeDevice_priceAtLowestTrigger = new WeakMap(), _HomeDevice_priceAtHighestTrigger = new WeakMap(), _HomeDevice_priceAtLowestTodayTrigger = new WeakMap(), _HomeDevice_priceAtHighestTodayTrigger = new WeakMap(), _HomeDevice_priceAmongLowestTrigger = new WeakMap(), _HomeDevice_priceAmongHighestTrigger = new WeakMap(), _HomeDevice_currentPriceBelowCondition = new WeakMap(), _HomeDevice_currentPriceBelowAvgCondition = new WeakMap(), _HomeDevice_currentPriceAboveAvgCondition = new WeakMap(), _HomeDevice_currentPriceBelowAvgTodayCondition = new WeakMap(), _HomeDevice_currentPriceAboveAvgTodayCondition = new WeakMap(), _HomeDevice_currentPriceAtLowestCondition = new WeakMap(), _HomeDevice_currentPriceAtHighestCondition = new WeakMap(), _HomeDevice_currentPriceAtLowestTodayCondition = new WeakMap(), _HomeDevice_currentPriceAtHighestTodayCondition = new WeakMap(), _HomeDevice_currentPriceAmongLowestTodayCondition = new WeakMap(), _HomeDevice_currentPriceAmongHighestTodayCondition = new WeakMap(), _HomeDevice_currentPriceAmongLowestWithinTimeFrameCondition = new WeakMap(), _HomeDevice_sendPushNotificationAction = new WeakMap(), _HomeDevice_hasDeprecatedTotalPriceCapability = new WeakMap(), _HomeDevice_hasDeprecatedPriceLevelCapability = new WeakMap(), _HomeDevice_hasDeprecatedMeasurePriceLevelCapability = new WeakMap(), _HomeDevice_instances = new WeakSet(), _HomeDevice_updateData = async function _HomeDevice_updateData() {
    var _a, _b, _c, _d;
    try {
        this.log(`Begin update`);
        await (0, newrelic_transaction_1.startTransaction)('GetPriceInfo', 'API', () => __classPrivateFieldGet(this, _HomeDevice_api, "f").populateCachedPriceInfos((callback, ms, args) => this.homey.setTimeout(callback, ms, args)));
        const now = (0, moment_timezone_1.default)();
        try {
            await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_handlePrice).call(this, now);
        }
        catch (err) {
            console.error(err);
        }
        if (__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_isConsumptionReportEnabled).call(this)) {
            this.log(`Consumption report enabled. Begin update`);
            await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_generateConsumptionReport).call(this, now);
        }
        const nextUpdateTime = (0, moment_timezone_1.default)()
            .add(1, 'hour')
            .startOf('hour')
            .add((0, helpers_1.randomBetweenRange)(0, 2.5 * 60), 'seconds');
        this.log(`Next time to run update is at system time ${nextUpdateTime.format()}`);
        const delay = moment_timezone_1.default.duration(nextUpdateTime.diff((0, moment_timezone_1.default)()));
        __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_scheduleUpdate).call(this, delay.asSeconds());
        this.log(`End update`);
    }
    catch (e) {
        this.log('Error fetching data', e);
        const errorCode = (_d = (_c = (_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.extensions) === null || _d === void 0 ? void 0 : _d.code;
        if (errorCode !== undefined) {
            this.log('Received error code', errorCode);
            if (errorCode === constants_1.ERROR_CODE_HOME_NOT_FOUND) {
                this.log(`Home with id ${this.getData().id} not found. Set device unavailable`);
                await this.setUnavailable('Tibber home with specified id not found. Please re-add device.');
                return;
            }
            if (errorCode === constants_1.ERROR_CODE_UNAUTHENTICATED) {
                this.log('Invalid access token; set device unavailable.');
                await this.setUnavailable('Invalid access token. Please re-add device.');
                return;
            }
        }
        const delay = (0, helpers_1.randomBetweenRange)(0, 5 * 60);
        __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_scheduleUpdate).call(this, delay);
    }
}, _HomeDevice_handlePrice = async function _HomeDevice_handlePrice(now) {
    var _a;
    __classPrivateFieldGet(this, _HomeDevice_prices, "f").today = __classPrivateFieldGet(this, _HomeDevice_api, "f").hourlyPrices.filter((p) => p.startsAt.tz('Europe/Oslo').isSame(now, 'day'));
    __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_updateLowestAndHighestPrice).call(this, now);
    const currentHour = now.clone().startOf('hour');
    const currentPrice = __classPrivateFieldGet(this, _HomeDevice_prices, "f").today.find((p) => currentHour.isSame(p.startsAt));
    if (currentPrice === undefined) {
        this.log(`Error finding current price info for system time ${currentHour.format()}. Abort.`, __classPrivateFieldGet(this, _HomeDevice_prices, "f").today);
        return;
    }
    const shouldUpdate = currentPrice.startsAt !== ((_a = __classPrivateFieldGet(this, _HomeDevice_prices, "f").latest) === null || _a === void 0 ? void 0 : _a.startsAt);
    if (shouldUpdate) {
        __classPrivateFieldGet(this, _HomeDevice_prices, "f").latest = currentPrice;
        if (currentPrice.total !== null) {
            const capabilityPromises = [
                this.setCapabilityValue('measure_price_total', Number(currentPrice.total)).catch(console.error),
                this.setCapabilityValue('measure_price_info_level', currentPrice.level).catch(console.error),
            ];
            if (__classPrivateFieldGet(this, _HomeDevice_hasDeprecatedTotalPriceCapability, "f")) {
                capabilityPromises.push(this.setCapabilityValue('price_total', Number(currentPrice.total)).catch(console.error));
            }
            if (__classPrivateFieldGet(this, _HomeDevice_hasDeprecatedPriceLevelCapability, "f")) {
                capabilityPromises.push(this.setCapabilityValue('price_level', currentPrice.level).catch(console.error));
            }
            if (__classPrivateFieldGet(this, _HomeDevice_hasDeprecatedMeasurePriceLevelCapability, "f")) {
                const level = deprecatedPriceLevelMap[currentPrice.level];
                capabilityPromises.push(this.setCapabilityValue('measure_price_level', level).catch(console.error));
            }
            await Promise.all(capabilityPromises);
            __classPrivateFieldGet(this, _HomeDevice_priceChangedTrigger, "f")
                .trigger(this, currentPrice)
                .catch(console.error);
            this.log('Triggering price_changed', currentPrice);
            __classPrivateFieldGet(this, _HomeDevice_priceBelowAvgTrigger, "f")
                .trigger(this, undefined, { below: true })
                .catch(console.error);
            __classPrivateFieldGet(this, _HomeDevice_priceBelowAvgTodayTrigger, "f")
                .trigger(this, undefined, { below: true })
                .catch(console.error);
            __classPrivateFieldGet(this, _HomeDevice_priceAboveAvgTrigger, "f")
                .trigger(this, undefined, { below: false })
                .catch(console.error);
            __classPrivateFieldGet(this, _HomeDevice_priceAboveAvgTodayTrigger, "f")
                .trigger(this, undefined, { below: false })
                .catch(console.error);
            __classPrivateFieldGet(this, _HomeDevice_priceAtLowestTrigger, "f")
                .trigger(this, undefined, { lowest: true })
                .catch(console.error);
            __classPrivateFieldGet(this, _HomeDevice_priceAtHighestTrigger, "f")
                .trigger(this, undefined, { lowest: false })
                .catch(console.error);
            __classPrivateFieldGet(this, _HomeDevice_priceAmongLowestTrigger, "f")
                .trigger(this, undefined, { lowest: true })
                .catch(console.error);
            __classPrivateFieldGet(this, _HomeDevice_priceAmongHighestTrigger, "f")
                .trigger(this, undefined, { lowest: false })
                .catch(console.error);
            if (__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, {}, { lowest: true })) {
                __classPrivateFieldGet(this, _HomeDevice_priceAtLowestTodayTrigger, "f")
                    .trigger(this, undefined, { lowest: true })
                    .catch(console.error);
            }
            if (__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_priceMinMaxComparator).call(this, {}, { lowest: false })) {
                __classPrivateFieldGet(this, _HomeDevice_priceAtHighestTodayTrigger, "f")
                    .trigger(this, undefined, { lowest: false })
                    .catch(console.error);
            }
            try {
                const priceLogger = await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_createGetLog).call(this, `${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_price`, {
                    title: `${__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLoggerPrefix).call(this)}Current price`,
                    type: 'number',
                    decimals: 2,
                });
                priceLogger.createEntry(currentPrice.total).catch(console.error);
            }
            catch (err) {
                const error = new errors_1.InsightLoggerError(`Failing priceLogger. Insight id: ${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_price. Error: ${err}`);
                console.error(error.message);
            }
        }
    }
}, _HomeDevice_updateLowestAndHighestPrice = function _HomeDevice_updateLowestAndHighestPrice(now) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    this.log(`The current lowest price is ${(_a = __classPrivateFieldGet(this, _HomeDevice_prices, "f").lowestToday) === null || _a === void 0 ? void 0 : _a.total} at ${(_b = __classPrivateFieldGet(this, _HomeDevice_prices, "f").lowestToday) === null || _b === void 0 ? void 0 : _b.startsAt}`);
    this.log(`The current highest price is ${(_c = __classPrivateFieldGet(this, _HomeDevice_prices, "f").highestToday) === null || _c === void 0 ? void 0 : _c.total} at ${(_d = __classPrivateFieldGet(this, _HomeDevice_prices, "f").highestToday) === null || _d === void 0 ? void 0 : _d.startsAt}`);
    if ((_e = __classPrivateFieldGet(this, _HomeDevice_prices, "f").lowestToday) === null || _e === void 0 ? void 0 : _e.startsAt.isSame(now, 'day')) {
        this.log("Today's lowest and highest prices are up to date");
        return;
    }
    __classPrivateFieldGet(this, _HomeDevice_prices, "f").lowestToday = (0, helpers_1.min)(__classPrivateFieldGet(this, _HomeDevice_prices, "f").today, (p) => p.total);
    __classPrivateFieldGet(this, _HomeDevice_prices, "f").highestToday = (0, helpers_1.max)(__classPrivateFieldGet(this, _HomeDevice_prices, "f").today, (p) => p.total);
    const lowestPrice = (_g = (_f = __classPrivateFieldGet(this, _HomeDevice_prices, "f").lowestToday) === null || _f === void 0 ? void 0 : _f.total) !== null && _g !== void 0 ? _g : null;
    this.setCapabilityValue('measure_price_lowest', lowestPrice)
        .catch(console.error)
        .finally(() => {
        this.log("Set 'measure_price_lowest' capability to", lowestPrice);
    });
    const highestPrice = (_j = (_h = __classPrivateFieldGet(this, _HomeDevice_prices, "f").highestToday) === null || _h === void 0 ? void 0 : _h.total) !== null && _j !== void 0 ? _j : null;
    this.setCapabilityValue('measure_price_highest', highestPrice)
        .catch(console.error)
        .finally(() => {
        this.log("Set 'measure_price_highest' capability to", highestPrice);
    });
}, _HomeDevice_generateConsumptionReport = async function _HomeDevice_generateConsumptionReport(now) {
    const lastLoggedDailyConsumption = __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLastLoggedDailyConsumption).call(this);
    let daysToFetch = 14;
    if (lastLoggedDailyConsumption) {
        const durationSinceLastDailyConsumption = moment_timezone_1.default.duration(now.diff((0, moment_timezone_1.default)(lastLoggedDailyConsumption)));
        daysToFetch = Math.floor(durationSinceLastDailyConsumption.asDays());
    }
    const lastLoggedHourlyConsumption = __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLastLoggedHourlyConsumption).call(this);
    let hoursToFetch = 200;
    if (lastLoggedHourlyConsumption) {
        const durationSinceLastHourlyConsumption = moment_timezone_1.default.duration(now.diff((0, moment_timezone_1.default)(lastLoggedHourlyConsumption)));
        hoursToFetch = Math.floor(durationSinceLastHourlyConsumption.asHours());
    }
    this.log(`Last logged daily consumption at ${lastLoggedDailyConsumption} hourly consumption at ${lastLoggedHourlyConsumption}. Fetch ${daysToFetch} days ${hoursToFetch} hours`);
    if (!lastLoggedDailyConsumption || !lastLoggedHourlyConsumption) {
        const consumptionData = await (0, newrelic_transaction_1.startTransaction)('GetConsumption', 'API', () => __classPrivateFieldGet(this, _HomeDevice_api, "f").getConsumptionData(daysToFetch, hoursToFetch));
        await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_logConsumptionInsightsAndInvokeTrigger).call(this, consumptionData);
    }
    else if (!hoursToFetch && !daysToFetch) {
        this.log(`Consumption data up to date. Skip fetch.`);
    }
    else {
        const delay = (0, helpers_1.randomBetweenRange)(0, 59 * 60);
        this.log(`Schedule consumption fetch for ${daysToFetch} days ${hoursToFetch} hours after ${delay} seconds.`);
        this.homey.setTimeout(async () => {
            let consumptionData;
            try {
                consumptionData = await (0, newrelic_transaction_1.startTransaction)('ScheduledGetConsumption', 'API', () => __classPrivateFieldGet(this, _HomeDevice_api, "f").getConsumptionData(daysToFetch, hoursToFetch));
            }
            catch (e) {
                console.error('The following error occurred during scheduled consumption fetch', e);
                return;
            }
            await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_logConsumptionInsightsAndInvokeTrigger).call(this, consumptionData);
        }, delay * 1000);
    }
}, _HomeDevice_logConsumptionInsightsAndInvokeTrigger = async function _HomeDevice_logConsumptionInsightsAndInvokeTrigger(data) {
    var _a, _b, _c, _d, _e, _f;
    try {
        const lastLoggedDailyConsumption = __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLastLoggedDailyConsumption).call(this);
        const consumptionsSinceLastReport = [];
        const dailyConsumptions = (_c = (_b = (_a = data.viewer.home) === null || _a === void 0 ? void 0 : _a.daily) === null || _b === void 0 ? void 0 : _b.nodes) !== null && _c !== void 0 ? _c : [];
        await Promise.all(dailyConsumptions.map(async (dailyConsumption) => {
            if (dailyConsumption.consumption === null)
                return;
            if (lastLoggedDailyConsumption &&
                (0, moment_timezone_1.default)(dailyConsumption.to) <= (0, moment_timezone_1.default)(lastLoggedDailyConsumption))
                return;
            consumptionsSinceLastReport.push(dailyConsumption);
            __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_setLastLoggedDailyConsumption).call(this, dailyConsumption.to);
            this.log('Got daily consumption', dailyConsumption);
            const consumptionLogger = await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_createGetLog).call(this, `${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_dailyConsumption`, {
                title: `${__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLoggerPrefix).call(this)}Daily consumption`,
                type: 'number',
                decimals: 1,
            });
            consumptionLogger
                .createEntry(dailyConsumption.consumption)
                .catch(console.error);
            const costLogger = await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_createGetLog).call(this, `${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_dailyCost`, {
                title: `${__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLoggerPrefix).call(this)}Daily total cost`,
                type: 'number',
                decimals: 1,
            });
            costLogger
                .createEntry(dailyConsumption.totalCost)
                .catch(console.error);
        }));
        if (consumptionsSinceLastReport.length > 0) {
            __classPrivateFieldGet(this, _HomeDevice_consumptionReportTrigger, "f")
                .trigger(this, {
                consumption: Number((0, helpers_1.sum)(consumptionsSinceLastReport, (c) => c.consumption).toFixed(2)),
                totalCost: Number((0, helpers_1.sum)(consumptionsSinceLastReport, (c) => c.totalCost).toFixed(2)),
                unitCost: Number((0, helpers_1.sum)(consumptionsSinceLastReport, (c) => c.unitCost).toFixed(2)),
                unitPrice: Number((0, helpers_1.mean)(consumptionsSinceLastReport, (c) => c.unitPrice).toFixed(2)),
            })
                .catch(console.error);
        }
    }
    catch (e) {
        console.error('Error logging daily consumption', e);
    }
    try {
        const lastLoggedHourlyConsumption = __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLastLoggedHourlyConsumption).call(this);
        const hourlyConsumptions = (_f = (_e = (_d = data.viewer.home) === null || _d === void 0 ? void 0 : _d.hourly) === null || _e === void 0 ? void 0 : _e.nodes) !== null && _f !== void 0 ? _f : [];
        await Promise.all(hourlyConsumptions.map(async (hourlyConsumption) => {
            if (hourlyConsumption.consumption === null)
                return;
            if (lastLoggedHourlyConsumption &&
                (0, moment_timezone_1.default)(hourlyConsumption.to) <= (0, moment_timezone_1.default)(lastLoggedHourlyConsumption))
                return;
            __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_setLastLoggedHourlyConsumption).call(this, hourlyConsumption.to);
            this.log('Got hourly consumption', hourlyConsumption);
            const consumptionLogger = await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_createGetLog).call(this, `${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}hourlyConsumption`, {
                title: `${__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLoggerPrefix).call(this)}Hourly consumption`,
                type: 'number',
                decimals: 1,
            });
            consumptionLogger
                .createEntry(hourlyConsumption.consumption)
                .catch(console.error);
            const costLogger = await __classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_createGetLog).call(this, `${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_hourlyCost`, {
                title: `${__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_getLoggerPrefix).call(this)}Hourly total cost`,
                type: 'number',
                decimals: 1,
            });
            costLogger
                .createEntry(hourlyConsumption.totalCost)
                .catch(console.error);
        }));
    }
    catch (e) {
        console.error('Error logging hourly consumption', e);
    }
}, _HomeDevice_getLastLoggedDailyConsumption = function _HomeDevice_getLastLoggedDailyConsumption() {
    return this.homey.settings.get(`${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_lastLoggedDailyConsumption`);
}, _HomeDevice_setLastLoggedDailyConsumption = function _HomeDevice_setLastLoggedDailyConsumption(value) {
    this.homey.settings.set(`${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_lastLoggedDailyConsumption`, value);
}, _HomeDevice_getLastLoggedHourlyConsumption = function _HomeDevice_getLastLoggedHourlyConsumption() {
    return this.homey.settings.get(`${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_lastLoggerHourlyConsumption`);
}, _HomeDevice_setLastLoggedHourlyConsumption = function _HomeDevice_setLastLoggedHourlyConsumption(value) {
    this.homey.settings.set(`${__classPrivateFieldGet(this, _HomeDevice_insightId, "f")}_lastLoggerHourlyConsumption`, value);
}, _HomeDevice_priceAvgComparator = function _HomeDevice_priceAvgComparator(options, args) {
    const now = (0, moment_timezone_1.default)();
    return (0, comparators_1.averagePrice)(this.log, __classPrivateFieldGet(this, _HomeDevice_api, "f").hourlyPrices, __classPrivateFieldGet(this, _HomeDevice_prices, "f"), now, options, args);
}, _HomeDevice_priceMinMaxComparator = function _HomeDevice_priceMinMaxComparator(options, args) {
    const now = (0, moment_timezone_1.default)();
    return (0, comparators_1.priceExtremes)(this.log, __classPrivateFieldGet(this, _HomeDevice_api, "f").hourlyPrices, __classPrivateFieldGet(this, _HomeDevice_prices, "f"), now, options, args);
}, _HomeDevice_lowestPricesWithinTimeFrame = function _HomeDevice_lowestPricesWithinTimeFrame(options) {
    const now = (0, moment_timezone_1.default)().tz('Europe/Oslo');
    return (0, comparators_1.lowestPricesWithinTimeFrame)(this.log, __classPrivateFieldGet(this, _HomeDevice_api, "f").hourlyPrices, __classPrivateFieldGet(this, _HomeDevice_prices, "f"), now, options);
}, _HomeDevice_scheduleUpdate = function _HomeDevice_scheduleUpdate(seconds) {
    this.log(`Scheduling update again in ${seconds} seconds`);
    this.homey.setTimeout(__classPrivateFieldGet(this, _HomeDevice_instances, "m", _HomeDevice_updateData).bind(this), seconds * 1000);
}, _HomeDevice_getLoggerPrefix = function _HomeDevice_getLoggerPrefix() {
    return this.driver.getDevices().length > 1 ? `${__classPrivateFieldGet(this, _HomeDevice_deviceLabel, "f")} ` : '';
}, _HomeDevice_isConsumptionReportEnabled = function _HomeDevice_isConsumptionReportEnabled() {
    return this.getSetting('enable_consumption_report') || false;
}, _HomeDevice_createGetLog = async function _HomeDevice_createGetLog(name, options) {
    try {
        return await this.homey.insights.getLog(name);
    }
    catch (e) {
        console.info(`Could not find log ${name} (error: ${e}). Creating new log.`);
        return await this.homey.insights.createLog(name, options);
    }
};
module.exports = HomeDevice;
//# sourceMappingURL=device.js.map