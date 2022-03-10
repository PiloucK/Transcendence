"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
const env_1 = require("../constants/env");
const envAwareFetch = (url, options) => {
    const fetchUrl = env_1.isServer && url.startsWith('/') ? `http://localhost:${env_1.PORT}${url}` : url;
    return fetch(fetchUrl, options).then((res) => res.json());
};
exports.fetch = envAwareFetch;
//# sourceMappingURL=fetch.js.map