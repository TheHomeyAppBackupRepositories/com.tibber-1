"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("newrelic");
const source_map_support_1 = __importDefault(require("source-map-support"));
const homey_1 = require("homey");
const newrelic_transaction_1 = require("./lib/newrelic-transaction");
const appJson = __importStar(require("./app.json"));
source_map_support_1.default.install();
class TibberApp extends homey_1.App {
    async onInit() {
        this.log('Tibber app is running...');
        const { version: firmwareVersion } = this.homey;
        const { version: appVersion } = appJson;
        this.log(`firmwareVersion:`, firmwareVersion);
        this.log(`appVersion:`, appVersion);
        (0, newrelic_transaction_1.setGlobalAttributes)({ firmwareVersion, appVersion });
        const v = this.homey.settings.get('v');
        if (v !== 2) {
            this.log('Cleaning logs');
            this.homey.settings.set('v', 2);
            this.cleanupLogs('*').catch(console.error);
        }
    }
    async cleanupLogs(prefix) {
        if (prefix !== '*')
            return;
        const logs = await this.homey.insights.getLogs();
        await Promise.all(logs
            .filter(({ name }) => name.startsWith(prefix))
            .map((log) => {
            console.log('Deleting log', log.name);
            return this.homey.insights.deleteLog(log);
        }));
    }
    async onUninit() {
        this.log('Tibber app is stopping');
    }
}
module.exports = TibberApp;
//# sourceMappingURL=app.js.map