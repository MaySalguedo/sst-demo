const Module = require("module");
const https = require("node:https");
const http = require("node:http");
const { URL } = require("node:url");
const { PassThrough } = require("node:stream");

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === "node-fetch" && parent && parent.filename && parent.filename.includes("gaxios")) {
    return __filename;
  }
  return origResolve.call(this, request, parent, isMain, options);
};

module.exports = nativeFetch;
module.exports.default = nativeFetch;
module.exports.Headers = Object;
module.exports.Request = Object;
module.exports.Response = Object;

function nativeFetch(input, init = {}) {
  return new Promise((resolve, reject) => {
    const url = typeof input === "string" || input instanceof URL
      ? new URL(input)
      : new URL(input.url || input.href);

    const method = (init.method || "GET").toUpperCase();
    const headers = { ...(init.headers || {}) };
    const body = init.body;
    const signal = init.signal || null;

    const isHttps = url.protocol === "https:";
    const mod = isHttps ? https : http;

    headers["User-Agent"] = headers["User-Agent"] || "sst-demo-ci/1.0";

    let bodyStr = null;
    if (body) {
      if (typeof body === "string") {
        bodyStr = body;
      } else if (Buffer.isBuffer(body)) {
        bodyStr = body.toString("utf-8");
      } else if (typeof body === "object" && body.url) {
        bodyStr = body.toString();
      }
    }

    if (bodyStr !== null) {
      headers["Content-Length"] = Buffer.byteLength(bodyStr);
    }

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers,
      timeout: 180000,
    };

    const req = mod.request(options, (res) => {
      const passthrough = new PassThrough();
      const statusText = res.statusMessage || "";

      const responseHeaders = {
        _headers: { ...res.headers },
        forEach(callback) {
          const raw = this._headers;
          for (const key of Object.keys(raw)) {
            const value = raw[key];
            if (Array.isArray(value)) {
              for (const v of value) callback(v, key, this);
            } else {
              callback(value, key, this);
            }
          }
        },
        get(name) { return this._headers[name.toLowerCase()] || null; },
        has(name) { return name.toLowerCase() in this._headers; },
        raw() { return this._headers; },
      };

      const fetchRes = {
        type: "basic",
        url: url.href,
        redirected: false,
        status: res.statusCode,
        statusText,
        ok: res.statusCode >= 200 && res.statusCode < 300,
        body: passthrough,
        bodyUsed: false,
        get headers() { return responseHeaders; },
        buffer() {
          return new Promise((resolveBuf) => {
            const chunks = [];
            passthrough.on("data", (c) => chunks.push(c));
            passthrough.on("end", () => resolveBuf(Buffer.concat(chunks)));
          });
        },
        async text() { return (await this.buffer()).toString("utf-8"); },
        async json() { return JSON.parse(await this.text()); },
      };

      res.pipe(passthrough);
      res.on("end", () => resolve(fetchRes));
      res.on("error", (err) => reject(err));
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      const err = new Error("Premature close");
      err.code = "ERR_PREMATURE_CLOSE";
      reject(err);
    });

    if (signal && typeof signal.addEventListener === "function") {
      signal.addEventListener("abort", () => {
        req.destroy();
        reject(new Error("The user aborted a request."));
      });
    }

    if (bodyStr !== null) {
      req.write(bodyStr);
    }
    req.end();
  });
}
