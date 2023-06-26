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
var _TibberApi_instances, _TibberApi_log, _TibberApi_homeySettings, _TibberApi_hourlyPrices, _TibberApi_homeId, _TibberApi_token, _TibberApi_client, _TibberApi_userAgent, _TibberApi_getClient, _TibberApi_getPriceInfo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibberApi = exports.getRandomDelay = void 0;
const lodash_1 = __importDefault(require("lodash"));
const ws_1 = __importDefault(require("ws"));
const core_1 = require("@apollo/client/core");
const graphql_request_1 = require("graphql-request");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const subscriptions_1 = require("@apollo/client/link/subscriptions");
const graphql_ws_1 = require("graphql-ws");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const queries_1 = require("./queries");
const newrelic_transaction_1 = require("./newrelic-transaction");
const apiHost = 'https://api.tibber.com';
const apiPath = '/v1-beta/gql';
const liveSubscriptionUrl = 'wss://api.tibber.com/v1-beta/gql/subscriptions';
const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min) + min);
exports.getRandomDelay = getRandomDelay;
class TibberApi {
    constructor(log, homeySettings, homeId, token) {
        _TibberApi_instances.add(this);
        _TibberApi_log.set(this, void 0);
        _TibberApi_homeySettings.set(this, void 0);
        _TibberApi_hourlyPrices.set(this, []);
        _TibberApi_homeId.set(this, void 0);
        _TibberApi_token.set(this, void 0);
        _TibberApi_client.set(this, void 0);
        _TibberApi_userAgent.set(this, void 0);
        __classPrivateFieldSet(this, _TibberApi_log, log, "f");
        __classPrivateFieldSet(this, _TibberApi_homeySettings, homeySettings, "f");
        __classPrivateFieldSet(this, _TibberApi_token, token, "f");
        __classPrivateFieldSet(this, _TibberApi_homeId, homeId, "f");
        const { firmwareVersion, appVersion } = (0, newrelic_transaction_1.getGlobalAttributes)();
        __classPrivateFieldSet(this, _TibberApi_userAgent, `Homey/${firmwareVersion} com.tibber/${appVersion}`, "f");
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
            console.error(`${new Date()} Error while fetching home data`, e);
            throw e;
        }));
    }
    async getHomeFeatures() {
        const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Get features for home ${__classPrivateFieldGet(this, _TibberApi_homeId, "f")}`);
        return (0, newrelic_transaction_1.startSegment)('GetHomeFeatures.Fetch', true, () => client
            .request(queries_1.queries.getHomeFeaturesByIdQuery(__classPrivateFieldGet(this, _TibberApi_homeId, "f")))
            .then((data) => data)
            .catch((e) => {
            var _a, _b, _c, _d;
            (0, newrelic_transaction_1.noticeError)(e);
            console.error(`${new Date()} Error while fetching home features`, e);
            const errorCode = (_d = (_c = (_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.extensions) === null || _d === void 0 ? void 0 : _d.code;
            if (errorCode !== undefined) {
                __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Received error code', errorCode);
                if (errorCode === 'HOME_NOT_FOUND') {
                    __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Home with id ${__classPrivateFieldGet(this, _TibberApi_homeId, "f")} not found`);
                    return { viewer: { home: null } };
                }
            }
            throw e;
        }));
    }
    async getPriceInfoCached(homeySetTimeout) {
        if (!__classPrivateFieldGet(this, _TibberApi_hourlyPrices, "f").length) {
            __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `No price infos cached. Fetch prices immediately.`);
            __classPrivateFieldSet(this, _TibberApi_hourlyPrices, await (0, newrelic_transaction_1.startSegment)('GetPriceInfo.CacheEmpty', true, () => __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getPriceInfo).call(this)), "f");
            return __classPrivateFieldGet(this, _TibberApi_hourlyPrices, "f");
        }
        const last = lodash_1.default.last(__classPrivateFieldGet(this, _TibberApi_hourlyPrices, "f"));
        const lastPriceForDay = (0, moment_timezone_1.default)(last.startsAt).startOf('day');
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Last price info entry is for day at system time ${lastPriceForDay.format()}`);
        const now = (0, moment_timezone_1.default)();
        const today = (0, moment_timezone_1.default)().startOf('day');
        const tomorrow = today.add(1, 'day');
        const expectedPricePublishTime = moment_timezone_1.default
            .tz('Europe/Oslo')
            .startOf('day')
            .add(13, 'hours');
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Expected price publish time is after ${expectedPricePublishTime.format()}`);
        if (lastPriceForDay < tomorrow && now > expectedPricePublishTime) {
            const delay = (0, exports.getRandomDelay)(0, 50 * 60);
            __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Last price info entry is before tomorrow and current time is after 13:00 CET. Schedule re-fetch prices after ${delay} seconds.`);
            (0, newrelic_transaction_1.startSegment)('GetPriceInfo.ScheduleFetchNewPrices', true, () => {
                homeySetTimeout(async () => {
                    __classPrivateFieldSet(this, _TibberApi_hourlyPrices, await (0, newrelic_transaction_1.startTransaction)('ScheduledGetPriceInfo', 'API', () => __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getPriceInfo).call(this)), "f");
                }, delay * 1000);
            });
            return __classPrivateFieldGet(this, _TibberApi_hourlyPrices, "f");
        }
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Last price info entry is up-to-date`);
        return __classPrivateFieldGet(this, _TibberApi_hourlyPrices, "f");
    }
    async getConsumptionData(daysToFetch, hoursToFetch) {
        const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, `Get consumption for ${daysToFetch} days ${hoursToFetch} hours`);
        return (0, newrelic_transaction_1.startSegment)('GetConsumption.Fetch', true, () => client
            .request(queries_1.queries.getConsumptionQuery(__classPrivateFieldGet(this, _TibberApi_homeId, "f"), daysToFetch, hoursToFetch))
            .catch((e) => {
            (0, newrelic_transaction_1.noticeError)(e);
            console.error(`${new Date()} Error while fetching consumption data`, e);
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
            console.log(`${new Date()} Push notification sent`, result);
        })
            .catch((e) => {
            (0, newrelic_transaction_1.noticeError)(e);
            console.error(`${new Date()} Error sending push notification`, e);
            throw e;
        }));
    }
    subscribeToLive() {
        __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Subscribe to live');
        if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
            __classPrivateFieldSet(this, _TibberApi_token, this.getDefaultToken(), "f");
        if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
            throw new Error('Access token not set');
        const webSocketClient = (0, graphql_ws_1.createClient)({
            url: liveSubscriptionUrl,
            connectionParams: {
                token: __classPrivateFieldGet(this, _TibberApi_token, "f"),
                userAgent: __classPrivateFieldGet(this, _TibberApi_userAgent, "f"),
            },
            webSocketImpl: ws_1.default,
        });
        const wsLink = new subscriptions_1.GraphQLWsLink(webSocketClient);
        const apolloClient = new core_1.ApolloClient({
            link: wsLink,
            cache: new apollo_cache_inmemory_1.InMemoryCache(),
        });
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
_TibberApi_log = new WeakMap(), _TibberApi_homeySettings = new WeakMap(), _TibberApi_hourlyPrices = new WeakMap(), _TibberApi_homeId = new WeakMap(), _TibberApi_token = new WeakMap(), _TibberApi_client = new WeakMap(), _TibberApi_userAgent = new WeakMap(), _TibberApi_instances = new WeakSet(), _TibberApi_getClient = function _TibberApi_getClient() {
    if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
        __classPrivateFieldSet(this, _TibberApi_token, this.getDefaultToken(), "f");
    if (__classPrivateFieldGet(this, _TibberApi_token, "f") === undefined)
        throw new Error('Access token not set');
    if (__classPrivateFieldGet(this, _TibberApi_client, "f") === undefined) {
        __classPrivateFieldSet(this, _TibberApi_client, new graphql_request_1.GraphQLClient(`${apiHost}${apiPath}`, {
            timeout: 5 * 60 * 1000,
            headers: {
                Authorization: `Bearer ${__classPrivateFieldGet(this, _TibberApi_token, "f")}`,
                'User-Agent': __classPrivateFieldGet(this, _TibberApi_userAgent, "f"),
            },
        }), "f");
    }
    return __classPrivateFieldGet(this, _TibberApi_client, "f");
}, _TibberApi_getPriceInfo = async function _TibberApi_getPriceInfo() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const client = __classPrivateFieldGet(this, _TibberApi_instances, "m", _TibberApi_getClient).call(this);
    __classPrivateFieldGet(this, _TibberApi_log, "f").call(this, 'Get prices');
    const data = await (0, newrelic_transaction_1.startSegment)('GetPriceInfo.Fetch', true, () => client.request(queries_1.queries.getPriceQuery(__classPrivateFieldGet(this, _TibberApi_homeId, "f"))).catch((e) => {
        (0, newrelic_transaction_1.noticeError)(e);
        console.error(`${new Date()} Error while fetching price data`, e);
        throw e;
    }));
    const pricesToday = (_e = (_d = (_c = (_b = (_a = data.viewer) === null || _a === void 0 ? void 0 : _a.home) === null || _b === void 0 ? void 0 : _b.currentSubscription) === null || _c === void 0 ? void 0 : _c.priceInfo) === null || _d === void 0 ? void 0 : _d.today) !== null && _e !== void 0 ? _e : [];
    const pricesTomorrow = (_k = (_j = (_h = (_g = (_f = data.viewer) === null || _f === void 0 ? void 0 : _f.home) === null || _g === void 0 ? void 0 : _g.currentSubscription) === null || _h === void 0 ? void 0 : _h.priceInfo) === null || _j === void 0 ? void 0 : _j.tomorrow) !== null && _k !== void 0 ? _k : [];
    __classPrivateFieldSet(this, _TibberApi_hourlyPrices, [...pricesToday, ...pricesTomorrow], "f");
    return __classPrivateFieldGet(this, _TibberApi_hourlyPrices, "f");
};
//# sourceMappingURL=tibber.js.map