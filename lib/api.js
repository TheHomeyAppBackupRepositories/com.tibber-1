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
var _TibberApi_instances, _TibberApi_log, _TibberApi_homeId, _TibberApi_homeySettings, _TibberApi_token, _TibberApi_client, _TibberApi_getClient, _TibberApi_getPriceInfo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibberApi = void 0;
const core_1 = require("@apollo/client/core");
const graphql_request_1 = require("graphql-request");
const subscriptions_1 = require("@apollo/client/link/subscriptions");
const graphql_ws_1 = require("graphql-ws");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const UserAgentWebSocket_1 = require("./UserAgentWebSocket");
const queries_1 = require("./queries");
const newrelic_transaction_1 = require("./newrelic-transaction");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const apiHost = 'https://api.tibber.com';
const apiPath = '/v1-beta/gql';
class TibberApi {
    constructor(log, homeySettings, homeId, token) {
        _TibberApi_instances.add(this);
        _TibberApi_log.set(this, void 0);
        _TibberApi_homeId.set(this, void 0);
        _TibberApi_homeySettings.set(this, void 0);
        _TibberApi_token.set(this, void 0);
        _TibberApi_client.set(this, void 0);
        this.hourlyPrices = [];
        __classPrivateFieldSet(this, _TibberApi_log, log, "f");
        __classPrivateFieldSet(this, _TibberApi_homeySettings, homeySettings, "f");
        __classPrivateFieldSet(this, _TibberApi_token, token, "f");
        __classPrivateFieldSet(this, _TibberApi_homeId, homeId, "f");
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Initialize Tibber client for home ${homeId} using token ${token}`);
    }
    async getHomes() {
        const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Get homes');
        return (0, newrelic_transaction_1.startSegment)('GetHomes.Fetch', true, () => client
            .request(queries_1.queries.getHomesQuery())
            .then((data) => data)
            .catch((e) => {
            (0, newrelic_transaction_1.noticeError)(e);
            console.error('Error while fetching home data', e);
            throw e;
        }));
    }
    async getHomeFeatures(device) {
        const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Get features for home ${__classPrivateFieldGet(this, _TibberApi_homeId, "f")}`);
        return (0, newrelic_transaction_1.startSegment)('GetHomeFeatures.Fetch', true, () => client
            .request(queries_1.queries.getHomeFeaturesByIdQuery(__classPrivateFieldGet(this, _TibberApi_homeId, "f")))
            .then((home) => {
            __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Home features', home);
            return home;
        })
            .catch(async (e) => {
            var _a, _b, _c, _d;
            (0, newrelic_transaction_1.noticeError)(e);
            console.error('Error while fetching home features', e);
            const errorCode = (_d = (_c = (_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.extensions) === null || _d === void 0 ? void 0 : _d.code;
            if (errorCode !== undefined) {
                __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Received error code', errorCode);
                if (errorCode === constants_1.ERROR_CODE_HOME_NOT_FOUND) {
                    __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Home with id ${__classPrivateFieldGet(this, _TibberApi_homeId, "f")} not found; set device unavailable.`);
                    await device.setUnavailable('Tibber home with specified id not found. Please re-add device.');
                }
                else if (errorCode === constants_1.ERROR_CODE_UNAUTHENTICATED) {
                    __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Invalid access token; set device unavailable.');
                    await device.setUnavailable('Invalid access token. Please re-add device.');
                }
            }
            throw e;
        }));
    }
    async populateCachedPriceInfos(homeySetTimeout) {
        if (this.hourlyPrices.length === 0) {
            __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `No price infos cached. Fetch prices immediately.`);
            this.hourlyPrices = await (0, newrelic_transaction_1.startSegment)('GetPriceInfo.CacheEmpty', true, () => __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getPriceInfo).call(this));
        }
        if (this.hourlyPrices.length === 0) {
            __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `No prices available. Retry later.`);
            return;
        }
        const [last] = (0, helpers_1.takeFromStartOrEnd)(this.hourlyPrices, -1);
        const lastPriceForDayLocal = last.startsAt.clone().startOf('day');
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Last price info entry is for day at local time ${lastPriceForDayLocal.format()}`);
        const expectedPricePublishTime = moment_timezone_1.default
            .tz('Europe/Oslo')
            .startOf('day')
            .add(13, 'hours');
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Expected price publish time is after ${expectedPricePublishTime.format()}`);
        const nowLocal = (0, moment_timezone_1.default)();
        const tomorrowLocal = (0, moment_timezone_1.default)().startOf('day').add(1, 'day');
        if (lastPriceForDayLocal.isBefore(tomorrowLocal) &&
            nowLocal.isAfter(expectedPricePublishTime)) {
            const delay = (0, helpers_1.randomBetweenRange)(0, 50 * 60);
            __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Last price info entry is before tomorrow and current time is after 13:00 CET. Schedule re-fetch prices after ${delay} seconds.`);
            (0, newrelic_transaction_1.startSegment)('GetPriceInfo.ScheduleFetchNewPrices', true, () => {
                homeySetTimeout(async () => {
                    let data;
                    try {
                        data = await (0, newrelic_transaction_1.startTransaction)('ScheduledGetPriceInfo', 'API', () => __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getPriceInfo).call(this));
                    }
                    catch (e) {
                        console.error('The following error happened when trying to re-fetch stale prices', e);
                        return;
                    }
                    this.hourlyPrices = data;
                }, delay * 1000);
            });
        }
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Last price info entry is up-to-date`);
    }
    async getConsumptionData(daysToFetch, hoursToFetch) {
        const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Get consumption for ${daysToFetch} days ${hoursToFetch} hours`);
        return (0, newrelic_transaction_1.startSegment)('GetConsumption.Fetch', true, () => client
            .request(queries_1.queries.getConsumptionQuery(__classPrivateFieldGet(this, _TibberApi_homeId, "f"), daysToFetch, hoursToFetch))
            .catch((e) => {
            (0, newrelic_transaction_1.noticeError)(e);
            console.error('Error while fetching consumption data', e);
            throw e;
        }));
    }
    async sendPush(title, message) {
        const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Send push notification');
        const push = queries_1.queries.getPushMessage(title, message);
        return (0, newrelic_transaction_1.startTransaction)('SendPushNotification', 'API', () => client
            .request(push)
            .then((result) => {
            console.log('Push notification sent', result);
        })
            .catch((e) => {
            (0, newrelic_transaction_1.noticeError)(e);
            console.error('Error sending push notification', e);
            throw e;
        }));
    }
    subscribeToLive(websocketSubscriptionUrl) {
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Subscribe to live; create web socket client');
        if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
            __classPrivateFieldSet(this, _TibberApi_token, this.getDefaultToken(), "f");
        if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
            throw new Error('Access token not set');
        const webSocketClient = (0, graphql_ws_1.createClient)({
            url: websocketSubscriptionUrl,
            connectionParams: {
                token: __classPrivateFieldGet(this, _TibberApi_token, "f"),
            },
            webSocketImpl: UserAgentWebSocket_1.UserAgentWebSocket,
        });
        const wsLink = new subscriptions_1.GraphQLWsLink(webSocketClient);
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Subscribe to live; create apollo client');
        const apolloClient = new core_1.ApolloClient({
            link: wsLink,
            cache: new core_1.InMemoryCache(),
        });
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Subscribe to live; call apollo subscribe');
        return apolloClient.subscribe({
            query: queries_1.queries.getSubscriptionQuery(__classPrivateFieldGet(this, _TibberApi_homeId, "f")),
            variables: {},
        });
    }
    setDefaultToken(token) {
        __classPrivateFieldGet(this, _TibberApi_homeySettings, "f").set('token', token);
    }
    getDefaultToken() {
        return __classPrivateFieldGet(this, _TibberApi_homeySettings, "f").get('token');
    }
}
exports.TibberApi = TibberApi;
_TibberApi_log = new WeakMap(), _TibberApi_homeId = new WeakMap(), _TibberApi_homeySettings = new WeakMap(), _TibberApi_token = new WeakMap(), _TibberApi_client = new WeakMap(), _TibberApi_instances = new WeakSet(), _TibberApi_getClient = function _TibberApi_getClient() {
    if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
        __classPrivateFieldSet(this, _TibberApi_token, this.getDefaultToken(), "f");
    if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
        throw new Error('Access token not set');
    if (__classPrivateFieldGet(this, _TibberApi_client, "f") === undefined) {
        __classPrivateFieldSet(this, _TibberApi_client, new graphql_request_1.GraphQLClient(`${apiHost}${apiPath}`, {
            timeout: 5 * 60 * 1000,
            headers: {
                Authorization: `Bearer ${__classPrivateFieldGet(this, _TibberApi_token, "f")}`,
                'User-Agent': (0, newrelic_transaction_1.getUserAgent)(),
            },
        }), "f");
    }
    return __classPrivateFieldGet(this, _TibberApi_client, "f");
}, _TibberApi_getPriceInfo = async function _TibberApi_getPriceInfo() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
    __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Get prices');
    const data = await (0, newrelic_transaction_1.startSegment)('GetPriceInfo.Fetch', true, () => client
        .request(queries_1.queries.getPriceQuery(__classPrivateFieldGet(this, _TibberApi_homeId, "f")))
        .catch((e) => {
        (0, newrelic_transaction_1.noticeError)(e);
        console.error('Error while fetching price data', e);
        throw e;
    }));
    const startOfToday = (0, moment_timezone_1.default)().tz('Europe/Oslo').startOf('day');
    const startOfYesterday = startOfToday.clone().subtract(1, 'day');
    const pricesYesterday = (_a = this.hourlyPrices) === null || _a === void 0 ? void 0 : _a.filter((p) => p.startsAt.isBefore(startOfToday) &&
        p.startsAt.isSameOrAfter(startOfYesterday));
    const pricesToday = (_f = (_e = (_d = (_c = (_b = data.viewer) === null || _b === void 0 ? void 0 : _b.home) === null || _c === void 0 ? void 0 : _c.currentSubscription) === null || _d === void 0 ? void 0 : _d.priceInfo) === null || _e === void 0 ? void 0 : _e.today) !== null && _f !== void 0 ? _f : [];
    const pricesTomorrow = (_l = (_k = (_j = (_h = (_g = data.viewer) === null || _g === void 0 ? void 0 : _g.home) === null || _h === void 0 ? void 0 : _h.currentSubscription) === null || _j === void 0 ? void 0 : _j.priceInfo) === null || _k === void 0 ? void 0 : _k.tomorrow) !== null && _l !== void 0 ? _l : [];
    return [
        ...pricesYesterday,
        ...pricesToday.map(transformPrice),
        ...pricesTomorrow.map(transformPrice),
    ];
};
const transformPrice = (priceEntry) => {
    const res = priceEntry;
    res.startsAt = (0, moment_timezone_1.default)(priceEntry.startsAt);
    return res;
};
//# sourceMappingURL=api.js.map