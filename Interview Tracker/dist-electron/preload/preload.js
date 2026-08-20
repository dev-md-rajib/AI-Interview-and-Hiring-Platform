"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  login: (credentials) => electron.ipcRenderer.invoke("auth:login", credentials),
  logout: () => electron.ipcRenderer.invoke("auth:logout"),
  getStoredAuth: () => electron.ipcRenderer.invoke("auth:getStoredAuth"),
  getNextInterview: () => electron.ipcRenderer.invoke("candidate:getNextInterview"),
  sendConsent: (payload) => electron.ipcRenderer.invoke("tracker:consent", payload),
  sendReady: (payload) => electron.ipcRenderer.invoke("tracker:ready", payload),
  getOpenWindows: () => electron.ipcRenderer.invoke("tracker:getOpenWindows"),
  startLockdown: (interviewId, allowedPids, allowedTitle) => electron.ipcRenderer.invoke("tracker:startLockdown", interviewId, allowedPids, allowedTitle),
  stopLockdown: () => electron.ipcRenderer.invoke("tracker:stopLockdown"),
  setWindowHeight: (height) => electron.ipcRenderer.invoke("tracker:setWindowHeight", height),
  minimizeWindow: () => electron.ipcRenderer.invoke("window:minimize"),
  closeWindow: () => electron.ipcRenderer.invoke("window:close"),
  endInterview: (payload) => electron.ipcRenderer.invoke("tracker:endInterview", payload),
  onStatusChange: (callback) => {
    electron.ipcRenderer.on("tracker:status-change", (_event, status) => callback(status));
  },
  openExternal: (url) => electron.shell.openExternal(url)
});
electron.contextBridge.exposeInMainWorld("trackerAPI", {
  listWindows: () => electron.ipcRenderer.invoke("tracker:list-windows"),
  debugWindows: () => electron.ipcRenderer.invoke("tracker:debug-windows"),
  startActive: (interviewUrl) => electron.ipcRenderer.invoke("tracker:start-active", interviewUrl),
  stopActive: () => electron.ipcRenderer.invoke("tracker:stop-active"),
  onTrackerEvent: (callback) => {
    electron.ipcRenderer.on("tracker:event", (_e, data) => callback(data));
  }
});
