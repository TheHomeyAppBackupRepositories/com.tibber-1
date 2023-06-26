"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgentWebSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const newrelic_transaction_1 = require("./newrelic-transaction");
class UserAgentWebSocket extends ws_1.default {
    constructor(address, protocols) {
        super(address, protocols, {
            headers: {
                'User-Agent': (0, newrelic_transaction_1.getUserAgent)(),
            },
        });
    }
}
exports.UserAgentWebSocket = UserAgentWebSocket;
//# sourceMappingURL=UserAgentWebSocket.js.map