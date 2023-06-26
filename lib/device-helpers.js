"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListDeviceHandler = void 0;
const newrelic_transaction_1 = require("./newrelic-transaction");
const createListDeviceHandler = (log, tibber, filterPredicate, deviceNameFormatter) => async (_data) => {
    var _a, _b;
    try {
        const { viewer: { homes }, } = await (0, newrelic_transaction_1.startTransaction)('GetHomes', 'API', () => tibber.getHomes());
        const devices = homes
            .filter(filterPredicate)
            .map((home) => {
            var _a;
            const address = (_a = home.address) === null || _a === void 0 ? void 0 : _a.address1;
            return {
                name: deviceNameFormatter(address),
                data: {
                    ...home,
                    t: tibber.getDefaultToken(),
                },
            };
        });
        devices.sort(sortByName);
        return devices;
    }
    catch (err) {
        (0, newrelic_transaction_1.noticeError)(err);
        log('Error in list device handler called from `onPair`', err);
        const statusCode = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 'unknown';
        throw new Error(`Failed to retrieve data: ${statusCode}`);
    }
};
exports.createListDeviceHandler = createListDeviceHandler;
const sortByName = (a, b) => {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
};
//# sourceMappingURL=device-helpers.js.map