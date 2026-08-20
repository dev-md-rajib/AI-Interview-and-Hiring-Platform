"use strict";
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _ws, _logger;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./index-brUe3Cta.js");
const _BrowserWebSocketTransport = class _BrowserWebSocketTransport {
  constructor(ws, logger) {
    __privateAdd(this, _ws);
    __privateAdd(this, _logger);
    __publicField(this, "onmessage");
    __publicField(this, "onclose");
    __privateSet(this, _ws, ws);
    __privateSet(this, _logger, logger);
    __privateGet(this, _ws).addEventListener("message", (event) => {
      if (this.onmessage) {
        this.onmessage.call(null, event.data);
      }
    });
    __privateGet(this, _ws).addEventListener("close", () => {
      if (this.onclose) {
        this.onclose.call(null);
      }
    });
    __privateGet(this, _ws).addEventListener("error", () => {
      var _a;
      (_a = __privateGet(this, _logger)) == null ? void 0 : _a.call(this, index.DEBUG_PREFIXES.error);
    });
  }
  static create(url, _headers, logger) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => {
        return resolve(new _BrowserWebSocketTransport(ws, logger));
      });
      ws.addEventListener("error", reject);
    });
  }
  send(message) {
    __privateGet(this, _ws).send(message);
  }
  close() {
    __privateGet(this, _ws).close();
  }
};
_ws = new WeakMap();
_logger = new WeakMap();
let BrowserWebSocketTransport = _BrowserWebSocketTransport;
exports.BrowserWebSocketTransport = BrowserWebSocketTransport;
