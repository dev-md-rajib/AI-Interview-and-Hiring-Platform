"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./index-5KBAV19e.js");
require("node:child_process");
require("node:fs");
require("node:os");
require("node:path");
require("node:process");
require("node:readline");
Object.defineProperty(exports, "Browser", {
  enumerable: true,
  get: () => index.Browser
});
Object.defineProperty(exports, "BrowserPlatform", {
  enumerable: true,
  get: () => index.BrowserPlatform
});
Object.defineProperty(exports, "BrowserTag", {
  enumerable: true,
  get: () => index.BrowserTag
});
exports.CDP_WEBSOCKET_ENDPOINT_REGEX = index.CDP_WEBSOCKET_ENDPOINT_REGEX;
exports.Cache = index.Cache;
Object.defineProperty(exports, "ChromeReleaseChannel", {
  enumerable: true,
  get: () => index.ChromeReleaseChannel
});
exports.InstalledBrowser = index.InstalledBrowser;
exports.Process = index.Process;
exports.TimeoutError = index.TimeoutError;
exports.WEBDRIVER_BIDI_WEBSOCKET_ENDPOINT_REGEX = index.WEBDRIVER_BIDI_WEBSOCKET_ENDPOINT_REGEX;
exports.computeExecutablePath = index.computeExecutablePath;
exports.computeSystemExecutablePath = index.computeSystemExecutablePath;
exports.createProfile = index.createProfile;
exports.detectBrowserPlatform = index.detectBrowserPlatform;
exports.getInstalledBrowsers = index.getInstalledBrowsers;
exports.getVersionComparator = index.getVersionComparator;
exports.launch = index.launch;
exports.resolveBuildId = index.resolveBuildId;
exports.resolveDefaultUserDataDir = index.resolveDefaultUserDataDir;
exports.uninstall = index.uninstall;
