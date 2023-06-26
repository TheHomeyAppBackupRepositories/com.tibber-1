"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightLoggerError = void 0;
class InsightLoggerError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.InsightLoggerError = InsightLoggerError;
//# sourceMappingURL=errors.js.map