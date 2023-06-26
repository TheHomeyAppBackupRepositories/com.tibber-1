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
var _HomeDriver_api;
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = require("homey");
const device_helpers_1 = require("../../lib/device-helpers");
const oauth_1 = require("../../lib/oauth");
const api_1 = require("../../lib/api");
class HomeDriver extends homey_1.Driver {
    constructor() {
        super(...arguments);
        _HomeDriver_api.set(this, void 0);
    }
    async onInit() {
        this.log('Tibber Home driver has been initialized');
    }
    onPair(session) {
        __classPrivateFieldSet(this, _HomeDriver_api, new api_1.TibberApi(this.log, this.homey.settings), "f");
        session.setHandler('list_devices', (0, device_helpers_1.createListDeviceHandler)(this.log, __classPrivateFieldGet(this, _HomeDriver_api, "f"), (home) => { var _a; return ((_a = home === null || home === void 0 ? void 0 : home.currentSubscription) === null || _a === void 0 ? void 0 : _a.status) === 'running'; }, formatDeviceName));
        (0, oauth_1.initiateOauth)(this.homey, session, __classPrivateFieldGet(this, _HomeDriver_api, "f")).catch(console.error);
    }
}
_HomeDriver_api = new WeakMap();
const formatDeviceName = (address) => `${address}`;
module.exports = HomeDriver;
//# sourceMappingURL=driver.js.map