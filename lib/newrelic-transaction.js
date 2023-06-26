"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgent = exports.noticeError = exports.startSegment = exports.startTransaction = exports.getGlobalAttributes = exports.setGlobalAttributes = void 0;
const newrelic_1 = __importDefault(require("newrelic"));
const attributes = {
    firmwareVersion: undefined,
    appVersion: undefined,
};
const setGlobalAttributes = ({ firmwareVersion, appVersion, }) => {
    if (firmwareVersion !== undefined)
        attributes.firmwareVersion = firmwareVersion;
    if (appVersion !== undefined)
        attributes.appVersion = appVersion;
};
exports.setGlobalAttributes = setGlobalAttributes;
const getGlobalAttributes = () => attributes;
exports.getGlobalAttributes = getGlobalAttributes;
const addAttributesToTransaction = () => {
    const { firmwareVersion, appVersion } = attributes;
    if (firmwareVersion !== undefined)
        newrelic_1.default.addCustomAttribute('firmwareVersion', firmwareVersion);
    if (appVersion !== undefined)
        newrelic_1.default.addCustomAttribute('appVersion', appVersion);
};
const startTransaction = (name, group, handle) => newrelic_1.default.startBackgroundTransaction(name, group, async () => {
    addAttributesToTransaction();
    return handle();
});
exports.startTransaction = startTransaction;
const startSegment = (name, record, handler, callback) => newrelic_1.default.startSegment(name, record, handler, callback);
exports.startSegment = startSegment;
const noticeError = (error, customAttributes) => newrelic_1.default.noticeError(error, customAttributes);
exports.noticeError = noticeError;
const getUserAgent = () => {
    const { firmwareVersion, appVersion } = (0, exports.getGlobalAttributes)();
    return `Homey/${firmwareVersion} com.tibber/${appVersion}`;
};
exports.getUserAgent = getUserAgent;
//# sourceMappingURL=newrelic-transaction.js.map