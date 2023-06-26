"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateOauth = void 0;
const homey_1 = require("homey");
const http_min_1 = __importDefault(require("http.min"));
const newrelic_transaction_1 = require("./newrelic-transaction");
const initiateOauth = async ({ app, cloud }, session, tibber) => {
    const state = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substring(0, 10);
    const redirectUrl = 'https://callback.athom.com/oauth2/callback/';
    const apiBaseUrl = 'https://thewall.tibber.com';
    const apiAuthUrl = `${apiBaseUrl}/connect/authorize?state=${state}&scope=tibber_graph&response_type=code&client_id=${homey_1.env.CLIENT_ID}&redirect_uri=${redirectUrl}`;
    const myOAuth2Callback = await cloud.createOAuth2Callback(apiAuthUrl);
    myOAuth2Callback
        .on('url', async (url) => {
        await session.emit('url', url).catch(console.error);
    })
        .on('code', async (code) => {
        try {
            const result = await (0, newrelic_transaction_1.startTransaction)('ConnectOauth', 'Auth', () => http_min_1.default.post({
                uri: `${apiBaseUrl}/connect/token`,
                form: {
                    client_id: homey_1.env.CLIENT_ID,
                    client_secret: homey_1.env.CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUrl,
                    code,
                },
            }));
            if (result.response.statusCode !== 200) {
                console.error('request failed', result.response);
                const error = new Error(`Request failed with code ${result.response.statusCode}`);
                await session.emit('error', error).catch(console.error);
                (0, newrelic_transaction_1.noticeError)(error);
                return app.error('api -> failed to fetch tokens', result.response.statusCode);
            }
            const params = JSON.parse(result.data);
            tibber.setDefaultToken(params.access_token);
            await session.emit('authorized', undefined).catch(console.error);
        }
        catch (err) {
            console.error('request failed', err);
            await session
                .emit('error', new Error(`Error fetching tokens`))
                .catch(console.error);
            app.error('api -> error fetching tokens:', err);
            (0, newrelic_transaction_1.noticeError)(err);
        }
        return undefined;
    });
};
exports.initiateOauth = initiateOauth;
//# sourceMappingURL=oauth.js.map