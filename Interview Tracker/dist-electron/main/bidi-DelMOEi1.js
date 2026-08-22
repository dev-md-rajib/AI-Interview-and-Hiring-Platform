"use strict";
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __reflectGet = Reflect.get;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var _emitter, _logger, _processor, _queue, _isProcessing, _ProcessingQueue_instances, processIfNeeded_fn, _browserCdpClient, _browsingContextStorage, _configStorage, _userContextStorage, _BrowserProcessor_instances, getWindowInfo_fn, toCdpDownloadBehavior_fn, applyDownloadBehavior_fn, _browsingContextStorage2, _realmStorage, _cdpConnection, _browserCdpClient2, _browserCdpClient3, _browsingContextStorage3, _contextConfigStorage, _eventManager, _userContextStorage2, _BrowsingContextProcessor_instances, getRelatedTopLevelBrowsingContexts_fn, onContextCreatedSubscribeHook_fn, _userContextStorage3, _browsingContextStorage4, _contextConfigStorage2, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2, _modifiers, _KeySource_instances, setModifier_fn, _DOUBLE_CLICK_TIME_MS, _MAX_DOUBLE_CLICK_RADIUS, _x, _y, _time, _clickContexts, _browsingContextStorage5, _tickStart, _tickDuration, _inputState, _contextId, _isMacOS, _ActionDispatcher_instances, context_get, dispatchAction_fn, dispatchPointerDownAction_fn, dispatchPointerUpAction_fn, dispatchPointerMoveAction_fn, getFrameOffset_fn, getCoordinateFromOrigin_fn, dispatchScrollAction_fn, dispatchKeyDownAction_fn, dispatchKeyUpAction_fn, _locked, _acquirers, _Mutex_instances, release_fn, _sources, _mutex, _browsingContextStorage6, _inputStateManager, _InputProcessor_instances, getActionsByTick_fn, _browsingContextStorage7, _networkStorage, _userContextStorage4, _contextConfigStorage3, _NetworkProcessor_instances, toggleNetwork_fn, getRequestOrFail_fn, getBlockedRequestOrFail_fn, getRelatedTopLevelBrowsingContexts_fn3, _browserCdpClient4, _properties, _id, _logger2, _ChannelProxy_static, createChannelProxyEvalStr_fn, createAndGetHandleInRealm_fn, createSendMessageHandle_fn, _ChannelProxy_instances, startListener_fn, getHandleFromWindow_fn, _id2, _cdpPreloadScripts, _functionDeclaration, _targetIds, _channels, _sandbox, _contexts, _userContexts, _PreloadScript_instances, getEvaluateString_fn, _eventManager2, _browsingContextStorage8, _realmStorage2, _preloadScriptStorage, _userContextStorage5, _logger3, _ScriptProcessor_instances, onRealmCreatedSubscribeHook_fn, getRealm_fn, _eventManager3, _browserCdpClient5, _initConnection, _created, _SessionProcessor_instances, mergeCapabilities_fn, getUnhandledPromptBehavior_fn, _browserCdpClient6, _browsingContextStorage9, _logger4, _StorageProcessor_instances, isNoSuchUserContextError_fn, getCdpBrowserContextId_fn, expandStoragePartitionSpecByBrowsingContext_fn, expandStoragePartitionSpecByStorageKey_fn, expandStoragePartitionSpec_fn, matchCookie_fn, _browserCdpClient7, _message, _googChannel, _bluetoothProcessor, _browserCdpClient8, _browserProcessor, _browsingContextProcessor, _cdpProcessor, _digitalCredentialsProcessor, _emulationProcessor, _inputProcessor, _networkProcessor, _permissionsProcessor, _scriptProcessor, _sessionProcessor, _storageProcessor, _webExtensionProcessor, _parser, _logger5, _CommandProcessor_instances, processCommand_fn, processTargetParams_fn, _eventManager4, _browsingContextStorage10, _bluetoothDevices, _bluetoothCharacteristics, _bluetoothDescriptors, _BluetoothProcessor_instances, getDevice_fn, getService_fn, getCharacteristic_fn, getDescriptor_fn, _global, _userContextConfigs, _browsingContextConfigs, _ContextConfigStorage_instances, getExtraHeaders_fn, _browserClient, _a2, _isFinished, _promise, _result, _resolve, _reject, _cdpClient, _eventManager5, _executionContextId, _logger6, _origin, _realmId, _Realm_instances, registerEvent_fn, _Realm_static, _b, cdpRemoteObjectToCallArgument_fn, flattenKeyValuePairs_fn, flattenValueList_fn, serializeCdpExceptionDetails_fn, getExceptionResult_fn, getSerializationOptions_fn, getAdditionalSerializationParameters_fn, getMaxObjectDepth_fn, releaseObject_fn, _browsingContextId, _browsingContextStorage11, _WindowRealm_instances, getBrowsingContextId_fn, _c, _browsingContextId2, _started, _finished, _isInitial, _eventManager6, _NavigationState_instances, finish_fn, _eventManager7, _logger7, _loaderIdToNavigationsMap, _browsingContextId3, _lastCommittedNavigation, _pendingNavigation, _isInitialNavigation, _NavigationTracker_instances, getNavigationForFrameNavigated_fn, _NavigationTracker_static, isFragmentNavigation_fn, _children, _id3, _hiddenSandbox, _downloadIdToUrlMap, _loaderId, _parentId, _originalOpener, _lifecycle, _cdpTarget, _defaultRealmDeferred, _browsingContextStorage12, _eventManager8, _logger8, _navigationTracker, _realmStorage3, _configStorage2, _lastUserPromptType, _BrowsingContextImpl_instances, deleteAllChildren_fn, getOrCreateSandboxInternal_fn, initListeners_fn, _BrowsingContextImpl_static, getPromptType_fn, getPromptHandler_fn, documentChanged_fn, resetLifecycleIfFinished_fn, failLifecycleIfNotFinished_fn, waitNavigation_fn, parseRect_fn, getLocatorDelegate_fn, locateNodesByLocator_fn, locateNodesByContextLocator_fn, locateNodesByAccessibility_fn, getAllRelatedCdpTargets_fn, _realmType, _ownerRealms, _eventManager9, _realmStorage4, _cdpTarget2, _logger9, _LogManager_instances, heuristicSerializeArg_fn, initializeEntryAddedEventListener_fn, _LogManager_static, getExceptionText_fn, _collectors, _responseCollectors, _requestBodyCollectors, _maxEncodedDataSize, _logger10, _CollectorsStorage_instances, getRequestToCollectorMap_fn, shouldCollectRequest_fn, _getDefaultValue, _id4, _fetchId, _interceptPhase, _servedFromCache, _redirectCount, _bodySize, _encodedResponseBodySize, _decodedResponseBodySize, _request, _requestOverrides, _responseOverrides, _response, _eventManager10, _networkStorage2, _cdpTarget3, _logger11, _emittedEvents, _NetworkRequest_instances, isDataUrl_fn, isNonInterceptable_fn, method_get, navigationId_get, cookies_get, getBodySizeFromHeaders_fn, updateBodySize_fn, context_get2, statusCode_get, requestHeaders_get, authChallenges_get, timings_get, phaseChanged_fn, interceptsInPhase_fn, isBlockedInPhase_fn, emitEventsIfReady_fn, continueRequest_fn, continueResponse_fn, continueWithAuth_fn, emitEvent_fn, getBaseEventParams_fn, getResponseEventParams_fn, getRequestData_fn, getDestination_fn, getInitiatorType_fn, getBeforeRequestEvent_fn, getResponseStartedEvent_fn, getResponseReceivedEvent_fn, isIgnoredEvent_fn, getOverrideHeader_fn, _NetworkRequest_static, getInitiator_fn, _browsingContextStorage13, _eventManager11, _collectorsStorage, _logger12, _requests, _intercepts, _defaultCacheBehavior, _NetworkStorage_instances, getOrCreateNetworkRequest_fn, getCollectedResponseData_fn, getCollectedRequestData_fn, _id5, _cdpClient2, _browserCdpClient9, _parentCdpClient, _realmStorage5, _eventManager12, _preloadScriptStorage2, _browsingContextStorage14, _networkStorage3, _unblocked, _defaultUserAgent, _logger13, _windowId, _deviceAccessEnabled, _cacheDisableState, _preloadEnabled, _fetchDomainStages, _CdpTarget_instances, unblock_fn, restoreFrameTreeState_fn, isExpectedError_fn, setEventListeners_fn, enableFetch_fn, disableFetch_fn, updateWindowId_fn, initAndEvaluatePreloadScripts_fn, setUserContextConfig_fn, ignoreFileDialog_fn, toCdpScreenOrientationAngle_fn, _browserCdpClient10, _cdpConnection2, _targetKeysToBeIgnoredByAutoAttach, _selfTargetId, _eventManager13, _browsingContextStorage15, _networkStorage4, _bluetoothProcessor2, _preloadScriptStorage3, _realmStorage6, _configStorage3, _speculationProcessor, _defaultUserContextId, _defaultUserAgent2, _logger14, _CdpTargetManager_instances, setEventListeners_fn2, handleFrameAttachedEvent_fn, handleFrameSubtreeWillBeDetached_fn, handleAttachedToTargetEvent_fn, findFrameParentId_fn, createCdpTarget_fn, _workers, handleWorkerTarget_fn, handleDetachedFromTargetEvent_fn, handleTargetInfoChangedEvent_fn, handleTargetCrashedEvent_fn, _contexts2, _eventEmitter, _scripts, _knownHandlesToRealmMap, _realmMap, _capacity, _entries, _onItemRemoved, _d, _counter, _id6, _subscriptions, _knownSubscriptionIds, _browsingContextStorage16, _SubscriptionManager_instances, isSubscribedTo_fn, _idWrapper, _contextId2, _event, _eventToContextsMap, _eventBuffers, _lastMessageSent, _subscriptionManager, _browsingContextStorage17, _subscribeHooks, _userContextStorage6, _EventManager_static, getMapKey_fn, _EventManager_instances, bufferEvent_fn, markEventSent_fn, getBufferedEvents_fn, _eventManager14, _logger15, _browsingContextStorage18, _contextConfigStorage4, _DigitalCredentialsProcessor_instances, applyToAllTargets_fn, applyBehaviorToTarget_fn, sendCdpCommand_fn, _messageQueue, _transport, _commandProcessor, _eventManager15, _browsingContextStorage19, _realmStorage7, _preloadScriptStorage4, _bluetoothProcessor3, _speculationProcessor2, _digitalCredentialsProcessor2, _logger16, _handleIncomingMessage, _processOutgoingMessage, _BidiServer_static, getDefaultUserContextId_fn, _BidiServer_instances, topLevelContextsLoaded_fn, _detached, _connection, _sessionId, _url, _transport2, _delay, _timeout, _closed, _logger17, _callbacks, _emitters, _debugProtocolSend, _debugProtocolReceive, _BidiConnection_instances, toWebDriverOnlyEvent_fn, _cdp, _adapters, _browserCdpConnection, _closed2, _client, _browserClient2, _forwardMessage, _onMessage, _session, _contextId3, _session2, _contextId4, _enabled, _BidiDeviceRequestPromptManager_instances, enableIfNeeded_fn, _session3, _promptId, _contextId5, _workers2, _WindowRealm_instances2, initialize_fn, _workers3, _DedicatedWorkerRealm_instances, initialize_fn2, _workers4, _SharedWorkerRealm_instances, initialize_fn3, _BidiDeserializer_static, deserializeNumber_fn, deserializeTuple_fn, _remoteValue, _disposed, _prompt, _frame, _apply, _isolate, _logger18, _channel, _scripts2, _disposables, _ExposableFunction_instances, initialize_fn4, connection_get, _handleMessage, getRealm_fn2, findFrame_fn, _redirectChain, _response2, _frame2, _request2, _logger19, _BidiHTTPRequest_instances, initialize_fn5, _authenticationHandled, _handleAuthentication, _BidiSerializer_static, serializeNumber_fn, serializeObject_fn, _logger20, _BidiRealm_instances, evaluate_fn, _frame3, _BidiFrameRealm_instances, initialize_fn6, _bindingsInstalled, _worker, _frame4, _realm, _page, _page2, _lastMovePoint, _started2, _x2, _y2, _bidiId, _page3, _touchScreen, _properties2, _page4, _browser, _page5, _frame5, _page6, _worker2;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./index-1oYXFRcr.js");
function mitt(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
    var i = n.get(t);
    i ? i.push(e) : n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
  }, emit: function(t, e) {
    var i = n.get(t);
    i && i.slice().map(function(n2) {
      n2(e);
    }), (i = n.get("*")) && i.slice().map(function(n2) {
      n2(t, e);
    });
  } };
}
class EventEmitter {
  constructor() {
    __privateAdd(this, _emitter, mitt());
  }
  on(type, handler) {
    __privateGet(this, _emitter).on(type, handler);
    return this;
  }
  /**
   * Like `on` but the listener will only be fired once and then it will be removed.
   * @param event The event you'd like to listen to
   * @param handler The handler function to run when the event occurs
   * @return `this` to enable chaining method calls.
   */
  once(event, handler) {
    const onceHandler = (eventData) => {
      handler(eventData);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }
  off(type, handler) {
    __privateGet(this, _emitter).off(type, handler);
    return this;
  }
  /**
   * Emits an event and call any associated listeners.
   *
   * @param event The event to emit.
   * @param eventData Any data to emit with the event.
   * @return `true` if there are any listeners, `false` otherwise.
   */
  emit(event, eventData) {
    __privateGet(this, _emitter).emit(event, eventData);
  }
  /**
   * Removes all listeners. If given an event argument, it will remove only
   * listeners for that event.
   * @param event - the event to remove listeners for.
   * @returns `this` to enable you to chain method calls.
   */
  removeAllListeners(event) {
    if (event) {
      __privateGet(this, _emitter).all.delete(event);
    } else {
      __privateGet(this, _emitter).all.clear();
    }
    return this;
  }
}
_emitter = new WeakMap();
var LogType;
(function(LogType2) {
  LogType2["bidi"] = "bidi";
  LogType2["cdp"] = "cdp";
  LogType2["debug"] = "debug";
  LogType2["debugError"] = "debug:error";
  LogType2["debugInfo"] = "debug:info";
  LogType2["debugWarn"] = "debug:warn";
})(LogType || (LogType = {}));
var _a$6;
class ProcessingQueue {
  constructor(processor, logger) {
    __privateAdd(this, _ProcessingQueue_instances);
    __privateAdd(this, _logger);
    __privateAdd(this, _processor);
    __privateAdd(this, _queue, []);
    // Flag to keep only 1 active processor.
    __privateAdd(this, _isProcessing, false);
    __privateSet(this, _processor, processor);
    __privateSet(this, _logger, logger);
  }
  add(entry, name) {
    __privateGet(this, _queue).push([entry, name]);
    void __privateMethod(this, _ProcessingQueue_instances, processIfNeeded_fn).call(this);
  }
}
_logger = new WeakMap();
_processor = new WeakMap();
_queue = new WeakMap();
_isProcessing = new WeakMap();
_ProcessingQueue_instances = new WeakSet();
processIfNeeded_fn = async function() {
  var _a3, _b2;
  if (__privateGet(this, _isProcessing)) {
    return;
  }
  __privateSet(this, _isProcessing, true);
  while (__privateGet(this, _queue).length > 0) {
    const arrayEntry = __privateGet(this, _queue).shift();
    if (!arrayEntry) {
      continue;
    }
    const [entryPromise, name] = arrayEntry;
    (_b2 = (_a3 = __privateGet(this, _logger)) == null ? void 0 : _a3.call(this, _a$6.LOGGER_PREFIX)) == null ? void 0 : _b2("Processing event:", name);
    await entryPromise.then((entry) => {
      var _a4, _b3;
      if (entry.kind === "error") {
        (_b3 = (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, LogType.debugError)) == null ? void 0 : _b3("Event threw before sending:", entry.error.message, entry.error.stack);
        return;
      }
      return __privateGet(this, _processor).call(this, entry.value);
    }).catch((error) => {
      var _a4, _b3;
      (_b3 = (_a4 = __privateGet(this, _logger)) == null ? void 0 : _a4.call(this, LogType.debugError)) == null ? void 0 : _b3("Event was not processed:", error == null ? void 0 : error.message);
    });
  }
  __privateSet(this, _isProcessing, false);
};
__publicField(ProcessingQueue, "LOGGER_PREFIX", `${LogType.debug}:queue`);
_a$6 = ProcessingQueue;
var BiDiModule;
(function(BiDiModule2) {
  BiDiModule2["Bluetooth"] = "bluetooth";
  BiDiModule2["Browser"] = "browser";
  BiDiModule2["BrowsingContext"] = "browsingContext";
  BiDiModule2["Cdp"] = "goog:cdp";
  BiDiModule2["Input"] = "input";
  BiDiModule2["Log"] = "log";
  BiDiModule2["Network"] = "network";
  BiDiModule2["Script"] = "script";
  BiDiModule2["Session"] = "session";
  BiDiModule2["Speculation"] = "speculation";
})(BiDiModule || (BiDiModule = {}));
var Script;
(function(Script2) {
  (function(EventNames) {
    EventNames["Message"] = "script.message";
    EventNames["RealmCreated"] = "script.realmCreated";
    EventNames["RealmDestroyed"] = "script.realmDestroyed";
  })(Script2.EventNames || (Script2.EventNames = {}));
})(Script || (Script = {}));
var Log;
(function(Log2) {
  (function(EventNames) {
    EventNames["LogEntryAdded"] = "log.entryAdded";
  })(Log2.EventNames || (Log2.EventNames = {}));
})(Log || (Log = {}));
var BrowsingContext$1;
(function(BrowsingContext2) {
  (function(EventNames) {
    EventNames["ContextCreated"] = "browsingContext.contextCreated";
    EventNames["ContextDestroyed"] = "browsingContext.contextDestroyed";
    EventNames["DomContentLoaded"] = "browsingContext.domContentLoaded";
    EventNames["DownloadEnd"] = "browsingContext.downloadEnd";
    EventNames["DownloadWillBegin"] = "browsingContext.downloadWillBegin";
    EventNames["FragmentNavigated"] = "browsingContext.fragmentNavigated";
    EventNames["HistoryUpdated"] = "browsingContext.historyUpdated";
    EventNames["Load"] = "browsingContext.load";
    EventNames["NavigationAborted"] = "browsingContext.navigationAborted";
    EventNames["NavigationCommitted"] = "browsingContext.navigationCommitted";
    EventNames["NavigationFailed"] = "browsingContext.navigationFailed";
    EventNames["NavigationStarted"] = "browsingContext.navigationStarted";
    EventNames["UserPromptClosed"] = "browsingContext.userPromptClosed";
    EventNames["UserPromptOpened"] = "browsingContext.userPromptOpened";
  })(BrowsingContext2.EventNames || (BrowsingContext2.EventNames = {}));
})(BrowsingContext$1 || (BrowsingContext$1 = {}));
var Input;
(function(Input2) {
  (function(EventNames) {
    EventNames["FileDialogOpened"] = "input.fileDialogOpened";
  })(Input2.EventNames || (Input2.EventNames = {}));
})(Input || (Input = {}));
var Network;
(function(Network2) {
  (function(EventNames) {
    EventNames["AuthRequired"] = "network.authRequired";
    EventNames["BeforeRequestSent"] = "network.beforeRequestSent";
    EventNames["FetchError"] = "network.fetchError";
    EventNames["ResponseCompleted"] = "network.responseCompleted";
    EventNames["ResponseStarted"] = "network.responseStarted";
  })(Network2.EventNames || (Network2.EventNames = {}));
})(Network || (Network = {}));
var Bluetooth;
(function(Bluetooth2) {
  (function(EventNames) {
    EventNames["RequestDevicePromptUpdated"] = "bluetooth.requestDevicePromptUpdated";
    EventNames["GattConnectionAttempted"] = "bluetooth.gattConnectionAttempted";
    EventNames["CharacteristicEventGenerated"] = "bluetooth.characteristicEventGenerated";
    EventNames["DescriptorEventGenerated"] = "bluetooth.descriptorEventGenerated";
  })(Bluetooth2.EventNames || (Bluetooth2.EventNames = {}));
})(Bluetooth || (Bluetooth = {}));
var Speculation;
(function(Speculation2) {
  (function(EventNames) {
    EventNames["PrefetchStatusUpdated"] = "speculation.prefetchStatusUpdated";
  })(Speculation2.EventNames || (Speculation2.EventNames = {}));
})(Speculation || (Speculation = {}));
const EVENT_NAMES = /* @__PURE__ */ new Set([
  // keep-sorted start
  ...Object.values(BiDiModule),
  ...Object.values(Bluetooth.EventNames),
  ...Object.values(BrowsingContext$1.EventNames),
  ...Object.values(Input.EventNames),
  ...Object.values(Log.EventNames),
  ...Object.values(Network.EventNames),
  ...Object.values(Script.EventNames),
  ...Object.values(Speculation.EventNames)
  // keep-sorted end
]);
class Exception extends Error {
  constructor(error, message, stacktrace) {
    super();
    __publicField(this, "error");
    __publicField(this, "message");
    __publicField(this, "stacktrace");
    this.error = error;
    this.message = message;
    this.stacktrace = stacktrace;
  }
  toErrorResponse(commandId) {
    return {
      type: "error",
      id: commandId,
      error: this.error,
      message: this.message,
      stacktrace: this.stacktrace
    };
  }
}
class InvalidArgumentException extends Exception {
  constructor(message, stacktrace) {
    super("invalid argument", message, stacktrace);
  }
}
class InvalidSelectorException extends Exception {
  constructor(message, stacktrace) {
    super("invalid selector", message, stacktrace);
  }
}
class MoveTargetOutOfBoundsException extends Exception {
  constructor(message, stacktrace) {
    super("move target out of bounds", message, stacktrace);
  }
}
class NoSuchAlertException extends Exception {
  constructor(message, stacktrace) {
    super("no such alert", message, stacktrace);
  }
}
class NoSuchElementException extends Exception {
  constructor(message, stacktrace) {
    super("no such element", message, stacktrace);
  }
}
class NoSuchFrameException extends Exception {
  constructor(message, stacktrace) {
    super("no such frame", message, stacktrace);
  }
}
class NoSuchHandleException extends Exception {
  constructor(message, stacktrace) {
    super("no such handle", message, stacktrace);
  }
}
class NoSuchHistoryEntryException extends Exception {
  constructor(message, stacktrace) {
    super("no such history entry", message, stacktrace);
  }
}
class NoSuchInterceptException extends Exception {
  constructor(message, stacktrace) {
    super("no such intercept", message, stacktrace);
  }
}
class NoSuchNodeException extends Exception {
  constructor(message, stacktrace) {
    super("no such node", message, stacktrace);
  }
}
class NoSuchRequestException extends Exception {
  constructor(message, stacktrace) {
    super("no such request", message, stacktrace);
  }
}
class NoSuchScriptException extends Exception {
  constructor(message, stacktrace) {
    super("no such script", message, stacktrace);
  }
}
class NoSuchUserContextException extends Exception {
  constructor(message, stacktrace) {
    super("no such user context", message, stacktrace);
  }
}
class UnknownCommandException extends Exception {
  constructor(message, stacktrace) {
    super("unknown command", message, stacktrace);
  }
}
class UnknownErrorException extends Exception {
  constructor(message, stacktrace = new Error().stack) {
    super("unknown error", message, stacktrace);
  }
}
class UnableToCaptureScreenException extends Exception {
  constructor(message, stacktrace) {
    super("unable to capture screen", message, stacktrace);
  }
}
class UnsupportedOperationException extends Exception {
  constructor(message, stacktrace) {
    super("unsupported operation", message, stacktrace);
  }
}
class UnableToSetCookieException extends Exception {
  constructor(message, stacktrace) {
    super("unable to set cookie", message, stacktrace);
  }
}
class UnableToSetFileInputException extends Exception {
  constructor(message, stacktrace) {
    super("unable to set file input", message, stacktrace);
  }
}
class InvalidWebExtensionException extends Exception {
  constructor(message, stacktrace) {
    super("invalid web extension", message, stacktrace);
  }
}
class NoSuchWebExtensionException extends Exception {
  constructor(message, stacktrace) {
    super("no such web extension", message, stacktrace);
  }
}
class NoSuchNetworkCollectorException extends Exception {
  constructor(message, stacktrace) {
    super("no such network collector", message, stacktrace);
  }
}
class NoSuchNetworkDataException extends Exception {
  constructor(message, stacktrace) {
    super("no such network data", message, stacktrace);
  }
}
class BidiNoOpParser {
  // Bluetooth module
  // keep-sorted start block=yes
  parseDisableSimulationParameters(params) {
    return params;
  }
  parseHandleRequestDevicePromptParams(params) {
    return params;
  }
  parseSimulateAdapterParameters(params) {
    return params;
  }
  parseSimulateAdvertisementParameters(params) {
    return params;
  }
  parseSimulateCharacteristicParameters(params) {
    return params;
  }
  parseSimulateCharacteristicResponseParameters(params) {
    return params;
  }
  parseSimulateDescriptorParameters(params) {
    return params;
  }
  parseSimulateDescriptorResponseParameters(params) {
    return params;
  }
  parseSimulateGattConnectionResponseParameters(params) {
    return params;
  }
  parseSimulateGattDisconnectionParameters(params) {
    return params;
  }
  parseSimulatePreconnectedPeripheralParameters(params) {
    return params;
  }
  parseSimulateServiceParameters(params) {
    return params;
  }
  // keep-sorted end
  // Browser module
  // keep-sorted start block=yes
  parseCreateUserContextParameters(params) {
    return params;
  }
  parseRemoveUserContextParameters(params) {
    return params;
  }
  parseSetClientWindowStateParameters(params) {
    return params;
  }
  parseSetDownloadBehaviorParameters(params) {
    return params;
  }
  // keep-sorted end
  // Browsing Context module
  // keep-sorted start block=yes
  parseActivateParams(params) {
    return params;
  }
  parseCaptureScreenshotParams(params) {
    return params;
  }
  parseCloseParams(params) {
    return params;
  }
  parseCreateParams(params) {
    return params;
  }
  parseGetTreeParams(params) {
    return params;
  }
  parseHandleUserPromptParams(params) {
    return params;
  }
  parseLocateNodesParams(params) {
    return params;
  }
  parseNavigateParams(params) {
    return params;
  }
  parsePrintParams(params) {
    return params;
  }
  parseReloadParams(params) {
    return params;
  }
  parseSetBypassCspParams(params) {
    return params;
  }
  parseSetViewportParams(params) {
    return params;
  }
  parseStartScreencastParams(params) {
    return params;
  }
  parseStopScreencastParams(params) {
    return params;
  }
  parseTraverseHistoryParams(params) {
    return params;
  }
  // keep-sorted end
  // CDP module
  // keep-sorted start block=yes
  parseGetSessionParams(params) {
    return params;
  }
  parseResolveRealmParams(params) {
    return params;
  }
  parseSendCommandParams(params) {
    return params;
  }
  // keep-sorted end
  // Emulation module
  // keep-sorted start block=yes
  parseSetClientHintsOverrideParams(params) {
    return params;
  }
  parseSetForcedColorsModeThemeOverrideParams(params) {
    return params;
  }
  parseSetGeolocationOverrideParams(params) {
    return params;
  }
  parseSetLocaleOverrideParams(params) {
    return params;
  }
  parseSetNetworkConditionsParams(params) {
    return params;
  }
  parseSetScreenOrientationOverrideParams(params) {
    return params;
  }
  parseSetScreenSettingsOverrideParams(params) {
    return params;
  }
  parseSetScriptingEnabledParams(params) {
    return params;
  }
  parseSetScrollbarTypeOverrideParams(params) {
    return params;
  }
  parseSetTimezoneOverrideParams(params) {
    return params;
  }
  parseSetTouchOverrideParams(params) {
    return params;
  }
  parseSetUserAgentOverrideParams(params) {
    return params;
  }
  // keep-sorted end
  // Script module
  // keep-sorted start block=yes
  parseAddPreloadScriptParams(params) {
    return params;
  }
  parseCallFunctionParams(params) {
    return params;
  }
  parseDisownParams(params) {
    return params;
  }
  parseEvaluateParams(params) {
    return params;
  }
  parseGetRealmsParams(params) {
    return params;
  }
  parseRemovePreloadScriptParams(params) {
    return params;
  }
  // keep-sorted end
  // Input module
  // keep-sorted start block=yes
  parsePerformActionsParams(params) {
    return params;
  }
  parseReleaseActionsParams(params) {
    return params;
  }
  parseSetFilesParams(params) {
    return params;
  }
  // keep-sorted end
  // Network module
  // keep-sorted start block=yes
  parseAddDataCollectorParams(params) {
    return params;
  }
  parseAddInterceptParams(params) {
    return params;
  }
  parseContinueRequestParams(params) {
    return params;
  }
  parseContinueResponseParams(params) {
    return params;
  }
  parseContinueWithAuthParams(params) {
    return params;
  }
  parseDisownDataParams(params) {
    return params;
  }
  parseFailRequestParams(params) {
    return params;
  }
  parseGetDataParams(params) {
    return params;
  }
  parseProvideResponseParams(params) {
    return params;
  }
  parseRemoveDataCollectorParams(params) {
    return params;
  }
  parseRemoveInterceptParams(params) {
    return params;
  }
  parseSetCacheBehaviorParams(params) {
    return params;
  }
  parseSetExtraHeadersParams(params) {
    return params;
  }
  // keep-sorted end
  // Permissions module
  // keep-sorted start block=yes
  parseSetPermissionsParams(params) {
    return params;
  }
  // keep-sorted end
  // Session module
  // keep-sorted start block=yes
  parseSubscribeParams(params) {
    return params;
  }
  parseUnsubscribeParams(params) {
    return params;
  }
  // keep-sorted end
  // Storage module
  // keep-sorted start block=yes
  parseDeleteCookiesParams(params) {
    return params;
  }
  parseGetCookiesParams(params) {
    return params;
  }
  parseSetCookieParams(params) {
    return params;
  }
  // keep-sorted end
  // WebExtenstion module
  // keep-sorted start block=yes
  parseInstallParams(params) {
    return params;
  }
  parseUninstallParams(params) {
    return params;
  }
  // keep-sorted end
  // DigitalCredentials module
  // keep-sorted start block=yes
  parseSetVirtualWalletBehaviorParams(params) {
    return params;
  }
}
class BrowserProcessor {
  constructor(browserCdpClient, browsingContextStorage, configStorage, userContextStorage) {
    __privateAdd(this, _BrowserProcessor_instances);
    __privateAdd(this, _browserCdpClient);
    __privateAdd(this, _browsingContextStorage);
    __privateAdd(this, _configStorage);
    __privateAdd(this, _userContextStorage);
    __privateSet(this, _browserCdpClient, browserCdpClient);
    __privateSet(this, _browsingContextStorage, browsingContextStorage);
    __privateSet(this, _configStorage, configStorage);
    __privateSet(this, _userContextStorage, userContextStorage);
  }
  close() {
    setTimeout(() => __privateGet(this, _browserCdpClient).sendCommand("Browser.close").catch(() => {
    }), 0);
    return {};
  }
  async createUserContext(params) {
    const w3cParams = params;
    const globalConfig = __privateGet(this, _configStorage).getGlobalConfig();
    if (w3cParams.acceptInsecureCerts !== void 0) {
      if (w3cParams.acceptInsecureCerts === false && globalConfig.acceptInsecureCerts === true)
        throw new UnknownErrorException(`Cannot set user context's "acceptInsecureCerts" to false, when a capability "acceptInsecureCerts" is set to true`);
    }
    const request = {};
    if (w3cParams.proxy) {
      const proxyStr = getProxyStr(w3cParams.proxy);
      if (proxyStr) {
        request.proxyServer = proxyStr;
      }
      if (w3cParams.proxy.noProxy) {
        request.proxyBypassList = w3cParams.proxy.noProxy.join(",");
      }
    } else {
      if (params["goog:proxyServer"] !== void 0) {
        request.proxyServer = params["goog:proxyServer"];
      }
      const proxyBypassList = params["goog:proxyBypassList"] ?? void 0;
      if (proxyBypassList) {
        request.proxyBypassList = proxyBypassList.join(",");
      }
    }
    const context = await __privateGet(this, _browserCdpClient).sendCommand("Target.createBrowserContext", request);
    await __privateMethod(this, _BrowserProcessor_instances, applyDownloadBehavior_fn).call(this, globalConfig.downloadBehavior ?? null, context.browserContextId);
    __privateGet(this, _configStorage).updateUserContextConfig(context.browserContextId, {
      acceptInsecureCerts: params["acceptInsecureCerts"],
      userPromptHandler: params["unhandledPromptBehavior"]
    });
    return {
      userContext: context.browserContextId
    };
  }
  async removeUserContext(params) {
    const userContext = params.userContext;
    if (userContext === "default") {
      throw new InvalidArgumentException("`default` user context cannot be removed");
    }
    try {
      await __privateGet(this, _browserCdpClient).sendCommand("Target.disposeBrowserContext", {
        browserContextId: userContext
      });
    } catch (err) {
      if (err.message.startsWith("Failed to find context with id")) {
        throw new NoSuchUserContextException(err.message);
      }
      throw err;
    }
    return {};
  }
  async getUserContexts() {
    return {
      userContexts: await __privateGet(this, _userContextStorage).getUserContexts()
    };
  }
  async setClientWindowState(params) {
    const { clientWindow } = params;
    const bounds = {
      windowState: params.state
    };
    if (params.state === "normal") {
      if (params.width !== void 0) {
        bounds.width = params.width;
      }
      if (params.height !== void 0) {
        bounds.height = params.height;
      }
      if (params.x !== void 0) {
        bounds.left = params.x;
      }
      if (params.y !== void 0) {
        bounds.top = params.y;
      }
    }
    const windowId = Number.parseInt(clientWindow);
    if (isNaN(windowId)) {
      throw new InvalidArgumentException("no such client window");
    }
    await __privateGet(this, _browserCdpClient).sendCommand("Browser.setWindowBounds", {
      windowId,
      bounds
    });
    const result = await __privateGet(this, _browserCdpClient).sendCommand("Browser.getWindowBounds", {
      windowId
    });
    return {
      active: false,
      clientWindow: `${windowId}`,
      state: result.bounds.windowState ?? "normal",
      height: result.bounds.height ?? 0,
      width: result.bounds.width ?? 0,
      x: result.bounds.left ?? 0,
      y: result.bounds.top ?? 0
    };
  }
  async getClientWindows() {
    const topLevelTargetIds = __privateGet(this, _browsingContextStorage).getTopLevelContexts().map((b) => b.cdpTarget.id);
    const clientWindows = await Promise.all(topLevelTargetIds.map(async (targetId) => await __privateMethod(this, _BrowserProcessor_instances, getWindowInfo_fn).call(this, targetId)));
    const uniqueClientWindowIds = /* @__PURE__ */ new Set();
    const uniqueClientWindows = new Array();
    for (const window2 of clientWindows) {
      if (!uniqueClientWindowIds.has(window2.clientWindow)) {
        uniqueClientWindowIds.add(window2.clientWindow);
        uniqueClientWindows.push(window2);
      }
    }
    return { clientWindows: uniqueClientWindows };
  }
  async setDownloadBehavior(params) {
    let userContexts;
    if (params.userContexts === void 0) {
      userContexts = (await __privateGet(this, _userContextStorage).getUserContexts()).map((c) => c.userContext);
    } else {
      userContexts = Array.from(await __privateGet(this, _userContextStorage).verifyUserContextIdList(params.userContexts));
    }
    if (params.userContexts === void 0) {
      __privateGet(this, _configStorage).updateGlobalConfig({
        downloadBehavior: params.downloadBehavior
      });
    } else {
      params.userContexts.map((userContext) => __privateGet(this, _configStorage).updateUserContextConfig(userContext, {
        downloadBehavior: params.downloadBehavior
      }));
    }
    await Promise.all(userContexts.map(async (userContext) => {
      const downloadBehavior = __privateGet(this, _configStorage).getActiveConfig(void 0, userContext).downloadBehavior ?? null;
      await __privateMethod(this, _BrowserProcessor_instances, applyDownloadBehavior_fn).call(this, downloadBehavior, userContext);
    }));
    return {};
  }
}
_browserCdpClient = new WeakMap();
_browsingContextStorage = new WeakMap();
_configStorage = new WeakMap();
_userContextStorage = new WeakMap();
_BrowserProcessor_instances = new WeakSet();
getWindowInfo_fn = async function(targetId) {
  const windowInfo = await __privateGet(this, _browserCdpClient).sendCommand("Browser.getWindowForTarget", { targetId });
  return {
    // `active` is not supported in CDP yet.
    active: false,
    clientWindow: `${windowInfo.windowId}`,
    state: windowInfo.bounds.windowState ?? "normal",
    height: windowInfo.bounds.height ?? 0,
    width: windowInfo.bounds.width ?? 0,
    x: windowInfo.bounds.left ?? 0,
    y: windowInfo.bounds.top ?? 0
  };
};
toCdpDownloadBehavior_fn = function(downloadBehavior) {
  if (downloadBehavior === null)
    return {
      behavior: "default"
    };
  if ((downloadBehavior == null ? void 0 : downloadBehavior.type) === "denied")
    return {
      behavior: "deny"
    };
  if ((downloadBehavior == null ? void 0 : downloadBehavior.type) === "allowed") {
    return {
      behavior: "allow",
      downloadPath: downloadBehavior.destinationFolder
    };
  }
  throw new UnknownErrorException("Unexpected download behavior");
};
applyDownloadBehavior_fn = async function(downloadBehavior, userContext) {
  await __privateGet(this, _browserCdpClient).sendCommand("Browser.setDownloadBehavior", {
    ...__privateMethod(this, _BrowserProcessor_instances, toCdpDownloadBehavior_fn).call(this, downloadBehavior),
    browserContextId: userContext === "default" ? void 0 : userContext,
    // Required for enabling download events.
    eventsEnabled: true
  });
};
function getProxyStr(proxyConfig) {
  if (proxyConfig.proxyType === "direct" || proxyConfig.proxyType === "system") {
    return void 0;
  }
  if (proxyConfig.proxyType === "pac") {
    throw new UnsupportedOperationException(`PAC proxy configuration is not supported per user context`);
  }
  if (proxyConfig.proxyType === "autodetect") {
    throw new UnsupportedOperationException(`Autodetect proxy is not supported per user context`);
  }
  if (proxyConfig.proxyType === "manual") {
    const servers = [];
    if (proxyConfig.httpProxy !== void 0) {
      servers.push(`http=${proxyConfig.httpProxy}`);
    }
    if (proxyConfig.sslProxy !== void 0) {
      servers.push(`https=${proxyConfig.sslProxy}`);
    }
    if (proxyConfig.socksProxy !== void 0 || proxyConfig.socksVersion !== void 0) {
      if (proxyConfig.socksProxy === void 0) {
        throw new InvalidArgumentException(`'socksVersion' cannot be set without 'socksProxy'`);
      }
      if (proxyConfig.socksVersion === void 0 || typeof proxyConfig.socksVersion !== "number" || !Number.isInteger(proxyConfig.socksVersion) || proxyConfig.socksVersion < 0 || proxyConfig.socksVersion > 255) {
        throw new InvalidArgumentException(`'socksVersion' must be between 0 and 255`);
      }
      servers.push(`socks=socks${proxyConfig.socksVersion}://${proxyConfig.socksProxy}`);
    }
    if (servers.length === 0) {
      return void 0;
    }
    return servers.join(";");
  }
  throw new UnknownErrorException(`Unknown proxy type`);
}
class CdpProcessor {
  constructor(browsingContextStorage, realmStorage, cdpConnection, browserCdpClient) {
    __privateAdd(this, _browsingContextStorage2);
    __privateAdd(this, _realmStorage);
    __privateAdd(this, _cdpConnection);
    __privateAdd(this, _browserCdpClient2);
    __privateSet(this, _browsingContextStorage2, browsingContextStorage);
    __privateSet(this, _realmStorage, realmStorage);
    __privateSet(this, _cdpConnection, cdpConnection);
    __privateSet(this, _browserCdpClient2, browserCdpClient);
  }
  getSession(params) {
    const context = params.context;
    const sessionId = __privateGet(this, _browsingContextStorage2).getContext(context).cdpTarget.cdpSessionId;
    if (sessionId === void 0) {
      return {};
    }
    return { session: sessionId };
  }
  resolveRealm(params) {
    const context = params.realm;
    const realm = __privateGet(this, _realmStorage).getRealm({ realmId: context });
    if (realm === void 0) {
      throw new UnknownErrorException(`Could not find realm ${params.realm}`);
    }
    return { executionContextId: realm.executionContextId };
  }
  async sendCommand(params) {
    const client = params.session ? __privateGet(this, _cdpConnection).getCdpClient(params.session) : __privateGet(this, _browserCdpClient2);
    const result = await client.sendCommand(params.method, params.params);
    return {
      result,
      session: params.session
    };
  }
}
_browsingContextStorage2 = new WeakMap();
_realmStorage = new WeakMap();
_cdpConnection = new WeakMap();
_browserCdpClient2 = new WeakMap();
class BrowsingContextProcessor {
  constructor(browserCdpClient, browsingContextStorage, userContextStorage, contextConfigStorage, eventManager) {
    __privateAdd(this, _BrowsingContextProcessor_instances);
    __privateAdd(this, _browserCdpClient3);
    __privateAdd(this, _browsingContextStorage3);
    __privateAdd(this, _contextConfigStorage);
    __privateAdd(this, _eventManager);
    __privateAdd(this, _userContextStorage2);
    __privateSet(this, _contextConfigStorage, contextConfigStorage);
    __privateSet(this, _userContextStorage2, userContextStorage);
    __privateSet(this, _browserCdpClient3, browserCdpClient);
    __privateSet(this, _browsingContextStorage3, browsingContextStorage);
    __privateSet(this, _eventManager, eventManager);
    __privateGet(this, _eventManager).addSubscribeHook(BrowsingContext$1.EventNames.ContextCreated, __privateMethod(this, _BrowsingContextProcessor_instances, onContextCreatedSubscribeHook_fn).bind(this));
  }
  getTree(params) {
    const resultContexts = params.root === void 0 ? __privateGet(this, _browsingContextStorage3).getTopLevelContexts() : [__privateGet(this, _browsingContextStorage3).getContext(params.root)];
    return {
      contexts: resultContexts.map((c) => c.serializeToBidiValue(params.maxDepth ?? Number.MAX_VALUE))
    };
  }
  async create(params) {
    let referenceContext;
    let userContext = "default";
    if (params.referenceContext !== void 0) {
      referenceContext = __privateGet(this, _browsingContextStorage3).getContext(params.referenceContext);
      if (!referenceContext.isTopLevelContext()) {
        throw new InvalidArgumentException(`referenceContext should be a top-level context`);
      }
      userContext = referenceContext.userContext;
    }
    if (params.userContext !== void 0) {
      userContext = params.userContext;
    }
    const existingContexts = __privateGet(this, _browsingContextStorage3).getAllContexts().filter((context2) => context2.userContext === userContext);
    let newWindow = false;
    switch (params.type) {
      case "tab":
        newWindow = false;
        break;
      case "window":
        newWindow = true;
        break;
    }
    if (!existingContexts.length) {
      newWindow = true;
    }
    let result;
    try {
      result = await __privateGet(this, _browserCdpClient3).sendCommand("Target.createTarget", {
        url: "about:blank",
        newWindow,
        browserContextId: userContext === "default" ? void 0 : userContext,
        background: params.background === true
      });
    } catch (err) {
      if (
        // See https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/devtools/protocol/target_handler.cc;l=90;drc=e80392ac11e48a691f4309964cab83a3a59e01c8
        err.message.startsWith("Failed to find browser context with id") || // See https://source.chromium.org/chromium/chromium/src/+/main:headless/lib/browser/protocol/target_handler.cc;l=49;drc=e80392ac11e48a691f4309964cab83a3a59e01c8
        err.message === "browserContextId"
      ) {
        throw new NoSuchUserContextException(`The context ${userContext} was not found`);
      }
      throw err;
    }
    const context = await __privateGet(this, _browsingContextStorage3).waitForContext(result.targetId);
    await context.lifecycleLoaded();
    return { context: context.id };
  }
  navigate(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    return context.navigate(
      params.url,
      params.wait ?? "none"
      /* BrowsingContext.ReadinessState.None */
    );
  }
  reload(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    return context.reload(
      params.ignoreCache ?? false,
      params.wait ?? "none"
      /* BrowsingContext.ReadinessState.None */
    );
  }
  async activate(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    if (!context.isTopLevelContext()) {
      throw new InvalidArgumentException("Activation is only supported on the top-level context");
    }
    await context.activate();
    return {};
  }
  async captureScreenshot(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    return await context.captureScreenshot(params);
  }
  async print(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    return await context.print(params);
  }
  async setViewport(params) {
    var _a3, _b2;
    const maxDimensionSize = 1e7;
    if ((((_a3 = params.viewport) == null ? void 0 : _a3.height) ?? 0) > maxDimensionSize || (((_b2 = params.viewport) == null ? void 0 : _b2.width) ?? 0) > maxDimensionSize) {
      throw new UnsupportedOperationException(`Viewport dimension over ${maxDimensionSize} are not supported`);
    }
    const config = {};
    if (params.devicePixelRatio !== void 0) {
      config.devicePixelRatio = params.devicePixelRatio;
    }
    if (params.viewport !== void 0) {
      config.viewport = params.viewport;
    }
    const impactedTopLevelContexts = await __privateMethod(this, _BrowsingContextProcessor_instances, getRelatedTopLevelBrowsingContexts_fn).call(this, params.context, params.userContexts);
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage).updateUserContextConfig(userContextId, config);
    }
    if (params.context !== void 0) {
      __privateGet(this, _contextConfigStorage).updateBrowsingContextConfig(params.context, config);
    }
    await Promise.all(impactedTopLevelContexts.map(async (context) => {
      const config2 = __privateGet(this, _contextConfigStorage).getActiveConfig(context.id, context.userContext);
      await context.setViewport(config2.viewport ?? null, config2.devicePixelRatio ?? null, config2.screenOrientation ?? null);
    }));
    return {};
  }
  async traverseHistory(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    if (!context) {
      throw new InvalidArgumentException(`No browsing context with id ${params.context}`);
    }
    if (!context.isTopLevelContext()) {
      throw new InvalidArgumentException("Traversing history is only supported on the top-level context");
    }
    await context.traverseHistory(params.delta);
    return {};
  }
  async handleUserPrompt(params) {
    var _a3;
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    try {
      await context.handleUserPrompt(params.accept, params.userText);
    } catch (error) {
      if ((_a3 = error.message) == null ? void 0 : _a3.includes("No dialog is showing")) {
        throw new NoSuchAlertException("No dialog is showing");
      }
      throw error;
    }
    return {};
  }
  async close(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    if (!context.isTopLevelContext()) {
      throw new InvalidArgumentException(`Non top-level browsing context ${context.id} cannot be closed.`);
    }
    const parentCdpClient = context.cdpTarget.parentCdpClient;
    try {
      const detachedFromTargetPromise = new Promise((resolve) => {
        const onContextDestroyed = (event) => {
          if (event.targetId === params.context) {
            parentCdpClient.off("Target.detachedFromTarget", onContextDestroyed);
            resolve();
          }
        };
        parentCdpClient.on("Target.detachedFromTarget", onContextDestroyed);
      });
      try {
        if (params.promptUnload) {
          await context.close();
        } else {
          await parentCdpClient.sendCommand("Target.closeTarget", {
            targetId: params.context
          });
        }
      } catch (error) {
        if (!parentCdpClient.isCloseError(error)) {
          throw error;
        }
      }
      await detachedFromTargetPromise;
    } catch (error) {
      if (!(error.code === -32e3 && error.message === "Not attached to an active page")) {
        throw error;
      }
    }
    return {};
  }
  async locateNodes(params) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(params.context);
    return await context.locateNodes(params);
  }
}
_browserCdpClient3 = new WeakMap();
_browsingContextStorage3 = new WeakMap();
_contextConfigStorage = new WeakMap();
_eventManager = new WeakMap();
_userContextStorage2 = new WeakMap();
_BrowsingContextProcessor_instances = new WeakSet();
getRelatedTopLevelBrowsingContexts_fn = async function(browsingContextId, userContextIds) {
  if (browsingContextId === void 0 && userContextIds === void 0) {
    throw new InvalidArgumentException("Either userContexts or context must be provided");
  }
  if (browsingContextId !== void 0 && userContextIds !== void 0) {
    throw new InvalidArgumentException("userContexts and context are mutually exclusive");
  }
  if (browsingContextId !== void 0) {
    const context = __privateGet(this, _browsingContextStorage3).getContext(browsingContextId);
    if (!context.isTopLevelContext()) {
      throw new InvalidArgumentException("Emulating viewport is only supported on the top-level context");
    }
    return [context];
  }
  await __privateGet(this, _userContextStorage2).verifyUserContextIdList(userContextIds);
  const result = [];
  for (const userContextId of userContextIds) {
    const topLevelBrowsingContexts = __privateGet(this, _browsingContextStorage3).getTopLevelContexts().filter((browsingContext) => browsingContext.userContext === userContextId);
    result.push(...topLevelBrowsingContexts);
  }
  return [...new Set(result).values()];
};
onContextCreatedSubscribeHook_fn = function(contextId) {
  const context = __privateGet(this, _browsingContextStorage3).getContext(contextId);
  const contextsToReport = [
    context,
    ...__privateGet(this, _browsingContextStorage3).getContext(contextId).allChildren
  ];
  contextsToReport.forEach((context2) => {
    __privateGet(this, _eventManager).registerEvent({
      type: "event",
      method: BrowsingContext$1.EventNames.ContextCreated,
      params: context2.serializeToBidiValue()
    }, context2.id);
  });
  return Promise.resolve();
};
class EmulationProcessor {
  constructor(browsingContextStorage, userContextStorage, contextConfigStorage) {
    __privateAdd(this, _EmulationProcessor_instances);
    __privateAdd(this, _userContextStorage3);
    __privateAdd(this, _browsingContextStorage4);
    __privateAdd(this, _contextConfigStorage2);
    __privateSet(this, _userContextStorage3, userContextStorage);
    __privateSet(this, _browsingContextStorage4, browsingContextStorage);
    __privateSet(this, _contextConfigStorage2, contextConfigStorage);
  }
  async setGeolocationOverride(params) {
    var _a3, _b2;
    if ("coordinates" in params && "error" in params) {
      throw new InvalidArgumentException("Coordinates and error cannot be set at the same time");
    }
    let geolocation = null;
    if ("coordinates" in params) {
      if ((((_a3 = params.coordinates) == null ? void 0 : _a3.altitude) ?? null) === null && (((_b2 = params.coordinates) == null ? void 0 : _b2.altitudeAccuracy) ?? null) !== null) {
        throw new InvalidArgumentException("Geolocation altitudeAccuracy can be set only with altitude");
      }
      geolocation = params.coordinates;
    } else if ("error" in params) {
      if (params.error.type !== "positionUnavailable") {
        throw new InvalidArgumentException(`Unknown geolocation error ${params.error.type}`);
      }
      geolocation = params.error;
    } else {
      throw new InvalidArgumentException(`Coordinates or error should be set`);
    }
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        geolocation
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        geolocation
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setGeolocationOverride(config.geolocation ?? null);
    }));
    return {};
  }
  async setLocaleOverride(params) {
    const locale = params.locale ?? null;
    if (locale !== null && !isValidLocale(locale)) {
      throw new InvalidArgumentException(`Invalid locale "${locale}"`);
    }
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        locale
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        locale
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await Promise.all([
        context.setLocaleOverride(config.locale ?? null),
        // Set `AcceptLanguage` to locale.
        context.setUserAgentAndAcceptLanguage(config.userAgent, config.locale, config.clientHints)
      ]);
    }));
    return {};
  }
  async setScriptingEnabled(params) {
    const scriptingEnabled = params.enabled;
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        scriptingEnabled
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        scriptingEnabled
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setScriptingEnabled(config.scriptingEnabled ?? null);
    }));
    return {};
  }
  async setScrollbarTypeOverride(params) {
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        scrollbarType: params.scrollbarType
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        scrollbarType: params.scrollbarType
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setScrollbarTypeOverride(config.scrollbarType ?? null);
    }));
    return {};
  }
  async setScreenOrientationOverride(params) {
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        screenOrientation: params.screenOrientation
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        screenOrientation: params.screenOrientation
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setViewport(config.viewport ?? null, config.devicePixelRatio ?? null, config.screenOrientation ?? null);
    }));
    return {};
  }
  async setScreenSettingsOverride(params) {
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        screenArea: params.screenArea
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        screenArea: params.screenArea
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setViewport(config.viewport ?? null, config.devicePixelRatio ?? null, config.screenOrientation ?? null);
    }));
    return {};
  }
  async setTimezoneOverride(params) {
    let timezone = params.timezone ?? null;
    if (timezone !== null && !isValidTimezone(timezone)) {
      throw new InvalidArgumentException(`Invalid timezone "${timezone}"`);
    }
    if (timezone !== null && isTimeZoneOffsetString(timezone)) {
      timezone = `GMT${timezone}`;
    }
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        timezone
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        timezone
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setTimezoneOverride(config.timezone ?? null);
    }));
    return {};
  }
  async setTouchOverride(params) {
    const maxTouchPoints = params.maxTouchPoints;
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts, true);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        maxTouchPoints
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        maxTouchPoints
      });
    }
    if (params.contexts === void 0 && params.userContexts === void 0) {
      __privateGet(this, _contextConfigStorage2).updateGlobalConfig({
        maxTouchPoints
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setTouchOverride(config.maxTouchPoints ?? null);
    }));
    return {};
  }
  async setUserAgentOverrideParams(params) {
    if (params.userAgent === "") {
      throw new UnsupportedOperationException("empty user agent string is not supported");
    }
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts, true);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        userAgent: params.userAgent
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        userAgent: params.userAgent
      });
    }
    if (params.contexts === void 0 && params.userContexts === void 0) {
      __privateGet(this, _contextConfigStorage2).updateGlobalConfig({
        userAgent: params.userAgent
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setUserAgentAndAcceptLanguage(config.userAgent, config.locale, config.clientHints);
    }));
    return {};
  }
  async setClientHintsOverride(params) {
    const clientHints = params.clientHints ?? null;
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts, true);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        clientHints
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        clientHints
      });
    }
    if (params.contexts === void 0 && params.userContexts === void 0) {
      __privateGet(this, _contextConfigStorage2).updateGlobalConfig({
        clientHints
      });
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setUserAgentAndAcceptLanguage(config.userAgent, config.locale, config.clientHints);
    }));
    return {};
  }
  async setNetworkConditions(params) {
    const browsingContexts = await __privateMethod(this, _EmulationProcessor_instances, getRelatedTopLevelBrowsingContexts_fn2).call(this, params.contexts, params.userContexts, true);
    for (const browsingContextId of params.contexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateBrowsingContextConfig(browsingContextId, {
        emulatedNetworkConditions: params.networkConditions
      });
    }
    for (const userContextId of params.userContexts ?? []) {
      __privateGet(this, _contextConfigStorage2).updateUserContextConfig(userContextId, {
        emulatedNetworkConditions: params.networkConditions
      });
    }
    if (params.contexts === void 0 && params.userContexts === void 0) {
      __privateGet(this, _contextConfigStorage2).updateGlobalConfig({
        emulatedNetworkConditions: params.networkConditions
      });
    }
    if (params.networkConditions !== null && params.networkConditions.type !== "offline") {
      throw new UnsupportedOperationException(`Unsupported network conditions ${params.networkConditions.type}`);
    }
    await Promise.all(browsingContexts.map(async (context) => {
      const config = __privateGet(this, _contextConfigStorage2).getActiveConfig(context.id, context.userContext);
      await context.setEmulatedNetworkConditions(config.emulatedNetworkConditions ?? null);
    }));
    return {};
  }
}
_userContextStorage3 = new WeakMap();
_browsingContextStorage4 = new WeakMap();
_contextConfigStorage2 = new WeakMap();
_EmulationProcessor_instances = new WeakSet();
getRelatedTopLevelBrowsingContexts_fn2 = async function(browsingContextIds, userContextIds, allowGlobal = false) {
  if (browsingContextIds === void 0 && userContextIds === void 0) {
    if (allowGlobal) {
      return __privateGet(this, _browsingContextStorage4).getTopLevelContexts();
    }
    throw new InvalidArgumentException("Either user contexts or browsing contexts must be provided");
  }
  if (browsingContextIds !== void 0 && userContextIds !== void 0) {
    throw new InvalidArgumentException("User contexts and browsing contexts are mutually exclusive");
  }
  const result = [];
  if (browsingContextIds === void 0) {
    if (userContextIds.length === 0) {
      throw new InvalidArgumentException("user context should be provided");
    }
    await __privateGet(this, _userContextStorage3).verifyUserContextIdList(userContextIds);
    for (const userContextId of userContextIds) {
      const topLevelBrowsingContexts = __privateGet(this, _browsingContextStorage4).getTopLevelContexts().filter((browsingContext) => browsingContext.userContext === userContextId);
      result.push(...topLevelBrowsingContexts);
    }
  } else {
    if (browsingContextIds.length === 0) {
      throw new InvalidArgumentException("browsing context should be provided");
    }
    for (const browsingContextId of browsingContextIds) {
      const browsingContext = __privateGet(this, _browsingContextStorage4).getContext(browsingContextId);
      if (!browsingContext.isTopLevelContext()) {
        throw new InvalidArgumentException("The command is only supported on the top-level context");
      }
      result.push(browsingContext);
    }
  }
  return [...new Set(result).values()];
};
function isValidLocale(locale) {
  try {
    new Intl.Locale(locale);
    return true;
  } catch (e) {
    if (e instanceof RangeError) {
      return false;
    }
    throw e;
  }
}
function isValidTimezone(timezone) {
  try {
    Intl.DateTimeFormat(void 0, { timeZone: timezone });
    return true;
  } catch (e) {
    if (e instanceof RangeError) {
      return false;
    }
    throw e;
  }
}
function isTimeZoneOffsetString(timezone) {
  return /^[+-](?:2[0-3]|[01]\d)(?::[0-5]\d)?$/.test(timezone);
}
function assert(predicate, message) {
  if (!predicate) {
    throw new Error(message ?? "Internal assertion failed.");
  }
}
function isSingleComplexGrapheme(value) {
  return isSingleGrapheme(value) && value.length > 1;
}
function isSingleGrapheme(value) {
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  return [...segmenter.segment(value)].length === 1;
}
class NoneSource {
  constructor() {
    __publicField(this, "type", "none");
  }
}
class KeySource {
  constructor() {
    __privateAdd(this, _KeySource_instances);
    __publicField(this, "type", "key");
    __publicField(this, "pressed", /* @__PURE__ */ new Set());
    // This is a bitfield that matches the modifiers parameter of
    // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchKeyEvent
    __privateAdd(this, _modifiers, 0);
  }
  get modifiers() {
    return __privateGet(this, _modifiers);
  }
  get alt() {
    return (__privateGet(this, _modifiers) & 1) === 1;
  }
  set alt(value) {
    __privateMethod(this, _KeySource_instances, setModifier_fn).call(this, value, 1);
  }
  get ctrl() {
    return (__privateGet(this, _modifiers) & 2) === 2;
  }
  set ctrl(value) {
    __privateMethod(this, _KeySource_instances, setModifier_fn).call(this, value, 2);
  }
  get meta() {
    return (__privateGet(this, _modifiers) & 4) === 4;
  }
  set meta(value) {
    __privateMethod(this, _KeySource_instances, setModifier_fn).call(this, value, 4);
  }
  get shift() {
    return (__privateGet(this, _modifiers) & 8) === 8;
  }
  set shift(value) {
    __privateMethod(this, _KeySource_instances, setModifier_fn).call(this, value, 8);
  }
}
_modifiers = new WeakMap();
_KeySource_instances = new WeakSet();
setModifier_fn = function(value, bit) {
  if (value) {
    __privateSet(this, _modifiers, __privateGet(this, _modifiers) | bit);
  } else {
    __privateSet(this, _modifiers, __privateGet(this, _modifiers) & ~bit);
  }
};
const _ClickContext = class _ClickContext {
  constructor(x, y, time) {
    __publicField(this, "count", 0);
    __privateAdd(this, _x);
    __privateAdd(this, _y);
    __privateAdd(this, _time);
    __privateSet(this, _x, x);
    __privateSet(this, _y, y);
    __privateSet(this, _time, time);
  }
  compare(context) {
    return (
      // The click needs to be within a certain amount of ms.
      __privateGet(context, _time) - __privateGet(this, _time) > __privateGet(_ClickContext, _DOUBLE_CLICK_TIME_MS) || // The click needs to be within a certain square radius.
      Math.abs(__privateGet(context, _x) - __privateGet(this, _x)) > __privateGet(_ClickContext, _MAX_DOUBLE_CLICK_RADIUS) || Math.abs(__privateGet(context, _y) - __privateGet(this, _y)) > __privateGet(_ClickContext, _MAX_DOUBLE_CLICK_RADIUS)
    );
  }
};
_DOUBLE_CLICK_TIME_MS = new WeakMap();
_MAX_DOUBLE_CLICK_RADIUS = new WeakMap();
_x = new WeakMap();
_y = new WeakMap();
_time = new WeakMap();
__privateAdd(_ClickContext, _DOUBLE_CLICK_TIME_MS, 500);
__privateAdd(_ClickContext, _MAX_DOUBLE_CLICK_RADIUS, 2);
let ClickContext = _ClickContext;
class PointerSource {
  constructor(id, subtype) {
    __publicField(this, "type", "pointer");
    __publicField(this, "subtype");
    __publicField(this, "pointerId");
    __publicField(this, "pressed", /* @__PURE__ */ new Set());
    __publicField(this, "x", 0);
    __publicField(this, "y", 0);
    __publicField(this, "radiusX");
    __publicField(this, "radiusY");
    __publicField(this, "force");
    // --- Platform-specific code starts here ---
    // Input.dispatchMouseEvent doesn't know the concept of double click, so we
    // need to create the logic, similar to how it's done for OSes:
    // https://source.chromium.org/chromium/chromium/src/+/refs/heads/main:ui/events/event.cc;l=479
    __privateAdd(this, _clickContexts, /* @__PURE__ */ new Map());
    this.pointerId = id;
    this.subtype = subtype;
  }
  // This is a bitfield that matches the buttons parameter of
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchMouseEvent
  get buttons() {
    let buttons = 0;
    for (const button of this.pressed) {
      switch (button) {
        case 0:
          buttons |= 1;
          break;
        case 1:
          buttons |= 4;
          break;
        case 2:
          buttons |= 2;
          break;
        case 3:
          buttons |= 8;
          break;
        case 4:
          buttons |= 16;
          break;
      }
    }
    return buttons;
  }
  setClickCount(button, context) {
    let storedContext = __privateGet(this, _clickContexts).get(button);
    if (!storedContext || storedContext.compare(context)) {
      storedContext = context;
    }
    ++storedContext.count;
    __privateGet(this, _clickContexts).set(button, storedContext);
    return storedContext.count;
  }
  getClickCount(button) {
    var _a3;
    return ((_a3 = __privateGet(this, _clickContexts).get(button)) == null ? void 0 : _a3.count) ?? 0;
  }
  /**
   * Resets click count. Resets consequent click counter. Prevents grouping clicks in
   * different `performActions` calls, so that they are not grouped as double, triple etc
   * clicks. Required for https://github.com/GoogleChromeLabs/chromium-bidi/issues/3043.
   */
  resetClickCount() {
    __privateSet(this, _clickContexts, /* @__PURE__ */ new Map());
  }
}
_clickContexts = new WeakMap();
class WheelSource {
  constructor() {
    __publicField(this, "type", "wheel");
  }
}
function getNormalizedKey(value) {
  switch (value) {
    case "":
      return "Unidentified";
    case "":
      return "Cancel";
    case "":
      return "Help";
    case "":
      return "Backspace";
    case "":
      return "Tab";
    case "":
      return "Clear";
    case "":
    case "":
      return "Enter";
    case "":
      return "Shift";
    case "":
      return "Control";
    case "":
      return "Alt";
    case "":
      return "Pause";
    case "":
      return "Escape";
    case "":
      return " ";
    case "":
      return "PageUp";
    case "":
      return "PageDown";
    case "":
      return "End";
    case "":
      return "Home";
    case "":
      return "ArrowLeft";
    case "":
      return "ArrowUp";
    case "":
      return "ArrowRight";
    case "":
      return "ArrowDown";
    case "":
      return "Insert";
    case "":
      return "Delete";
    case "":
      return ";";
    case "":
      return "=";
    case "":
      return "0";
    case "":
      return "1";
    case "":
      return "2";
    case "":
      return "3";
    case "":
      return "4";
    case "":
      return "5";
    case "":
      return "6";
    case "":
      return "7";
    case "":
      return "8";
    case "":
      return "9";
    case "":
      return "*";
    case "":
      return "+";
    case "":
      return ",";
    case "":
      return "-";
    case "":
      return ".";
    case "":
      return "/";
    case "":
      return "F1";
    case "":
      return "F2";
    case "":
      return "F3";
    case "":
      return "F4";
    case "":
      return "F5";
    case "":
      return "F6";
    case "":
      return "F7";
    case "":
      return "F8";
    case "":
      return "F9";
    case "":
      return "F10";
    case "":
      return "F11";
    case "":
      return "F12";
    case "":
      return "Meta";
    case "":
      return "ZenkakuHankaku";
    case "":
      return "Shift";
    case "":
      return "Control";
    case "":
      return "Alt";
    case "":
      return "Meta";
    case "":
      return "PageUp";
    case "":
      return "PageDown";
    case "":
      return "End";
    case "":
      return "Home";
    case "":
      return "ArrowLeft";
    case "":
      return "ArrowUp";
    case "":
      return "ArrowRight";
    case "":
      return "ArrowDown";
    case "":
      return "Insert";
    case "":
      return "Delete";
    default:
      return value;
  }
}
function getKeyCode(key) {
  switch (key) {
    case "`":
    case "~":
      return "Backquote";
    case "\\":
    case "|":
      return "Backslash";
    case "":
      return "Backspace";
    case "[":
    case "{":
      return "BracketLeft";
    case "]":
    case "}":
      return "BracketRight";
    case ",":
    case "<":
      return "Comma";
    case "0":
    case ")":
      return "Digit0";
    case "1":
    case "!":
      return "Digit1";
    case "2":
    case "@":
      return "Digit2";
    case "3":
    case "#":
      return "Digit3";
    case "4":
    case "$":
      return "Digit4";
    case "5":
    case "%":
      return "Digit5";
    case "6":
    case "^":
      return "Digit6";
    case "7":
    case "&":
      return "Digit7";
    case "8":
    case "*":
      return "Digit8";
    case "9":
    case "(":
      return "Digit9";
    case "=":
    case "+":
      return "Equal";
    case ">":
      return "IntlBackslash";
    case "a":
    case "A":
      return "KeyA";
    case "b":
    case "B":
      return "KeyB";
    case "c":
    case "C":
      return "KeyC";
    case "d":
    case "D":
      return "KeyD";
    case "e":
    case "E":
      return "KeyE";
    case "f":
    case "F":
      return "KeyF";
    case "g":
    case "G":
      return "KeyG";
    case "h":
    case "H":
      return "KeyH";
    case "i":
    case "I":
      return "KeyI";
    case "j":
    case "J":
      return "KeyJ";
    case "k":
    case "K":
      return "KeyK";
    case "l":
    case "L":
      return "KeyL";
    case "m":
    case "M":
      return "KeyM";
    case "n":
    case "N":
      return "KeyN";
    case "o":
    case "O":
      return "KeyO";
    case "p":
    case "P":
      return "KeyP";
    case "q":
    case "Q":
      return "KeyQ";
    case "r":
    case "R":
      return "KeyR";
    case "s":
    case "S":
      return "KeyS";
    case "t":
    case "T":
      return "KeyT";
    case "u":
    case "U":
      return "KeyU";
    case "v":
    case "V":
      return "KeyV";
    case "w":
    case "W":
      return "KeyW";
    case "x":
    case "X":
      return "KeyX";
    case "y":
    case "Y":
      return "KeyY";
    case "z":
    case "Z":
      return "KeyZ";
    case "-":
    case "_":
      return "Minus";
    case ".":
      return "Period";
    case "'":
    case '"':
      return "Quote";
    case ";":
    case ":":
      return "Semicolon";
    case "/":
    case "?":
      return "Slash";
    case "":
      return "AltLeft";
    case "":
      return "AltRight";
    case "":
      return "ControlLeft";
    case "":
      return "ControlRight";
    case "":
      return "Enter";
    case "":
      return "Pause";
    case "":
      return "MetaLeft";
    case "":
      return "MetaRight";
    case "":
      return "ShiftLeft";
    case "":
      return "ShiftRight";
    case " ":
    case "":
      return "Space";
    case "":
      return "Tab";
    case "":
      return "Delete";
    case "":
      return "End";
    case "":
      return "Help";
    case "":
      return "Home";
    case "":
      return "Insert";
    case "":
      return "PageDown";
    case "":
      return "PageUp";
    case "":
      return "ArrowDown";
    case "":
      return "ArrowLeft";
    case "":
      return "ArrowRight";
    case "":
      return "ArrowUp";
    case "":
      return "Escape";
    case "":
      return "F1";
    case "":
      return "F2";
    case "":
      return "F3";
    case "":
      return "F4";
    case "":
      return "F5";
    case "":
      return "F6";
    case "":
      return "F7";
    case "":
      return "F8";
    case "":
      return "F9";
    case "":
      return "F10";
    case "":
      return "F11";
    case "":
      return "F12";
    case "":
      return "NumpadEqual";
    case "":
    case "":
      return "Numpad0";
    case "":
    case "":
      return "Numpad1";
    case "":
    case "":
      return "Numpad2";
    case "":
    case "":
      return "Numpad3";
    case "":
    case "":
      return "Numpad4";
    case "":
      return "Numpad5";
    case "":
    case "":
      return "Numpad6";
    case "":
    case "":
      return "Numpad7";
    case "":
    case "":
      return "Numpad8";
    case "":
    case "":
      return "Numpad9";
    case "":
      return "NumpadAdd";
    case "":
      return "NumpadComma";
    case "":
    case "":
      return "NumpadDecimal";
    case "":
      return "NumpadDivide";
    case "":
      return "NumpadEnter";
    case "":
      return "NumpadMultiply";
    case "":
      return "NumpadSubtract";
    default:
      return;
  }
}
function getKeyLocation(key) {
  switch (key) {
    case "":
    case "":
    case "":
    case "":
    case "":
      return 1;
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
      return 3;
    case "":
    case "":
    case "":
    case "":
      return 2;
    default:
      return 0;
  }
}
const KeyToKeyCode = {
  "0": 48,
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  "9": 57,
  Abort: 3,
  Help: 6,
  Backspace: 8,
  Tab: 9,
  Numpad5: 12,
  NumpadEnter: 13,
  Enter: 13,
  "\\r": 13,
  "\\n": 13,
  ShiftLeft: 16,
  ShiftRight: 16,
  ControlLeft: 17,
  ControlRight: 17,
  AltLeft: 18,
  AltRight: 18,
  Pause: 19,
  CapsLock: 20,
  Escape: 27,
  Convert: 28,
  NonConvert: 29,
  Space: 32,
  Numpad9: 33,
  PageUp: 33,
  Numpad3: 34,
  PageDown: 34,
  End: 35,
  Numpad1: 35,
  Home: 36,
  Numpad7: 36,
  ArrowLeft: 37,
  Numpad4: 37,
  Numpad8: 38,
  ArrowUp: 38,
  ArrowRight: 39,
  Numpad6: 39,
  Numpad2: 40,
  ArrowDown: 40,
  Select: 41,
  Open: 43,
  PrintScreen: 44,
  Insert: 45,
  Numpad0: 45,
  Delete: 46,
  NumpadDecimal: 46,
  Digit0: 48,
  Digit1: 49,
  Digit2: 50,
  Digit3: 51,
  Digit4: 52,
  Digit5: 53,
  Digit6: 54,
  Digit7: 55,
  Digit8: 56,
  Digit9: 57,
  KeyA: 65,
  KeyB: 66,
  KeyC: 67,
  KeyD: 68,
  KeyE: 69,
  KeyF: 70,
  KeyG: 71,
  KeyH: 72,
  KeyI: 73,
  KeyJ: 74,
  KeyK: 75,
  KeyL: 76,
  KeyM: 77,
  KeyN: 78,
  KeyO: 79,
  KeyP: 80,
  KeyQ: 81,
  KeyR: 82,
  KeyS: 83,
  KeyT: 84,
  KeyU: 85,
  KeyV: 86,
  KeyW: 87,
  KeyX: 88,
  KeyY: 89,
  KeyZ: 90,
  MetaLeft: 91,
  MetaRight: 92,
  ContextMenu: 93,
  NumpadMultiply: 106,
  NumpadAdd: 107,
  NumpadSubtract: 109,
  NumpadDivide: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  F13: 124,
  F14: 125,
  F15: 126,
  F16: 127,
  F17: 128,
  F18: 129,
  F19: 130,
  F20: 131,
  F21: 132,
  F22: 133,
  F23: 134,
  F24: 135,
  NumLock: 144,
  ScrollLock: 145,
  AudioVolumeMute: 173,
  AudioVolumeDown: 174,
  AudioVolumeUp: 175,
  MediaTrackNext: 176,
  MediaTrackPrevious: 177,
  MediaStop: 178,
  MediaPlayPause: 179,
  Semicolon: 186,
  Equal: 187,
  NumpadEqual: 187,
  Comma: 188,
  Minus: 189,
  Period: 190,
  Slash: 191,
  Backquote: 192,
  BracketLeft: 219,
  Backslash: 220,
  BracketRight: 221,
  Quote: 222,
  AltGraph: 225,
  Props: 247,
  Cancel: 3,
  Clear: 12,
  Shift: 16,
  Control: 17,
  Alt: 18,
  Accept: 30,
  ModeChange: 31,
  " ": 32,
  Print: 42,
  Execute: 43,
  "\\u0000": 46,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  Meta: 91,
  "*": 106,
  "+": 107,
  "-": 109,
  "/": 111,
  ";": 186,
  "=": 187,
  ",": 188,
  ".": 190,
  "`": 192,
  "[": 219,
  "\\\\": 220,
  "]": 221,
  "'": 222,
  Attn: 246,
  CrSel: 247,
  ExSel: 248,
  EraseEof: 249,
  Play: 250,
  ZoomOut: 251,
  ")": 48,
  "!": 49,
  "@": 50,
  "#": 51,
  $: 52,
  "%": 53,
  "^": 54,
  "&": 55,
  "(": 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  ":": 186,
  "<": 188,
  _: 189,
  ">": 190,
  "?": 191,
  "~": 192,
  "{": 219,
  "|": 220,
  "}": 221,
  '"': 222,
  Camera: 44,
  EndCall: 95,
  VolumeDown: 182,
  VolumeUp: 183
};
const CALCULATE_IN_VIEW_CENTER_PT_DECL = ((i) => {
  const t = i.getClientRects()[0], e = Math.max(0, Math.min(t.x, t.x + t.width)), n = Math.min(window.innerWidth, Math.max(t.x, t.x + t.width)), h = Math.max(0, Math.min(t.y, t.y + t.height)), m = Math.min(window.innerHeight, Math.max(t.y, t.y + t.height));
  return [e + (n - e >> 1), h + (m - h >> 1)];
}).toString();
const IS_MAC_DECL = (() => {
  return navigator.platform.toLowerCase().includes("mac");
}).toString();
async function getElementCenter(context, element) {
  var _a3, _b2, _c2, _d2;
  const hiddenSandboxRealm = await context.getOrCreateHiddenSandbox();
  const result = await hiddenSandboxRealm.callFunction(CALCULATE_IN_VIEW_CENTER_PT_DECL, false, { type: "undefined" }, [element]);
  if (result.type === "exception") {
    throw new NoSuchElementException(`Origin element ${element.sharedId} was not found`);
  }
  assert(result.result.type === "array");
  assert(((_b2 = (_a3 = result.result.value) == null ? void 0 : _a3[0]) == null ? void 0 : _b2.type) === "number");
  assert(((_d2 = (_c2 = result.result.value) == null ? void 0 : _c2[1]) == null ? void 0 : _d2.type) === "number");
  const { result: { value: [{ value: x }, { value: y }] } } = result;
  return { x, y };
}
class ActionDispatcher {
  constructor(inputState, browsingContextStorage, contextId, isMacOS) {
    __privateAdd(this, _ActionDispatcher_instances);
    __privateAdd(this, _browsingContextStorage5);
    __privateAdd(this, _tickStart, 0);
    __privateAdd(this, _tickDuration, 0);
    __privateAdd(this, _inputState);
    __privateAdd(this, _contextId);
    __privateAdd(this, _isMacOS);
    __privateSet(this, _browsingContextStorage5, browsingContextStorage);
    __privateSet(this, _inputState, inputState);
    __privateSet(this, _contextId, contextId);
    __privateSet(this, _isMacOS, isMacOS);
  }
  async dispatchActions(optionsByTick) {
    await __privateGet(this, _inputState).queue.run(async () => {
      for (const options of optionsByTick) {
        await this.dispatchTickActions(options);
      }
    });
  }
  async dispatchTickActions(options) {
    __privateSet(this, _tickStart, performance.now());
    __privateSet(this, _tickDuration, 0);
    for (const { action } of options) {
      if ("duration" in action && action.duration !== void 0) {
        __privateSet(this, _tickDuration, Math.max(__privateGet(this, _tickDuration), action.duration));
      }
    }
    const promises = [
      new Promise((resolve) => setTimeout(resolve, __privateGet(this, _tickDuration)))
    ];
    for (const option of options) {
      promises.push(__privateMethod(this, _ActionDispatcher_instances, dispatchAction_fn).call(this, option));
    }
    await Promise.all(promises);
  }
}
_browsingContextStorage5 = new WeakMap();
_tickStart = new WeakMap();
_tickDuration = new WeakMap();
_inputState = new WeakMap();
_contextId = new WeakMap();
_isMacOS = new WeakMap();
_ActionDispatcher_instances = new WeakSet();
context_get = function() {
  return __privateGet(this, _browsingContextStorage5).getContext(__privateGet(this, _contextId));
};
dispatchAction_fn = async function({ id, action }) {
  const source = __privateGet(this, _inputState).get(id);
  const keyState = __privateGet(this, _inputState).getGlobalKeyState();
  switch (action.type) {
    case "keyDown": {
      await __privateMethod(this, _ActionDispatcher_instances, dispatchKeyDownAction_fn).call(this, source, action);
      __privateGet(this, _inputState).cancelList.push({
        id,
        action: {
          ...action,
          type: "keyUp"
        }
      });
      break;
    }
    case "keyUp": {
      await __privateMethod(this, _ActionDispatcher_instances, dispatchKeyUpAction_fn).call(this, source, action);
      break;
    }
    case "pause": {
      break;
    }
    case "pointerDown": {
      await __privateMethod(this, _ActionDispatcher_instances, dispatchPointerDownAction_fn).call(this, source, keyState, action);
      __privateGet(this, _inputState).cancelList.push({
        id,
        action: {
          ...action,
          type: "pointerUp"
        }
      });
      break;
    }
    case "pointerMove": {
      await __privateMethod(this, _ActionDispatcher_instances, dispatchPointerMoveAction_fn).call(this, source, keyState, action);
      break;
    }
    case "pointerUp": {
      await __privateMethod(this, _ActionDispatcher_instances, dispatchPointerUpAction_fn).call(this, source, keyState, action);
      break;
    }
    case "scroll": {
      await __privateMethod(this, _ActionDispatcher_instances, dispatchScrollAction_fn).call(this, source, keyState, action);
      break;
    }
  }
};
dispatchPointerDownAction_fn = async function(source, keyState, action) {
  const { button } = action;
  if (source.pressed.has(button)) {
    return;
  }
  source.pressed.add(button);
  const { x, y, subtype: pointerType } = source;
  const { width, height, pressure, twist, tangentialPressure } = action;
  const { tiltX, tiltY } = getTilt(action);
  const { modifiers } = keyState;
  const { radiusX, radiusY } = getRadii(width ?? 1, height ?? 1);
  switch (pointerType) {
    case "mouse":
    case "pen":
      await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
        type: "mousePressed",
        x,
        y,
        modifiers,
        button: getCdpButton(button),
        buttons: source.buttons,
        clickCount: source.setClickCount(button, new ClickContext(x, y, performance.now())),
        pointerType,
        tangentialPressure,
        tiltX,
        tiltY,
        twist,
        force: pressure
      });
      break;
    case "touch":
      await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [
          {
            x,
            y,
            radiusX,
            radiusY,
            tangentialPressure,
            tiltX,
            tiltY,
            twist,
            force: pressure,
            id: source.pointerId
          }
        ],
        modifiers
      });
      break;
  }
  source.radiusX = radiusX;
  source.radiusY = radiusY;
  source.force = pressure;
};
dispatchPointerUpAction_fn = function(source, keyState, action) {
  const { button } = action;
  if (!source.pressed.has(button)) {
    return;
  }
  source.pressed.delete(button);
  const { x, y, force, radiusX, radiusY, subtype: pointerType } = source;
  const { modifiers } = keyState;
  switch (pointerType) {
    case "mouse":
    case "pen":
      return __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x,
        y,
        modifiers,
        button: getCdpButton(button),
        buttons: source.buttons,
        clickCount: source.getClickCount(button),
        pointerType
      });
    case "touch":
      return __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [
          {
            x,
            y,
            id: source.pointerId,
            force,
            radiusX,
            radiusY
          }
        ],
        modifiers
      });
  }
};
dispatchPointerMoveAction_fn = async function(source, keyState, action) {
  const { x: startX, y: startY, subtype: pointerType } = source;
  const { width, height, pressure, twist, tangentialPressure, x: offsetX, y: offsetY, origin = "viewport", duration = __privateGet(this, _tickDuration) } = action;
  const { tiltX, tiltY } = getTilt(action);
  const { radiusX, radiusY } = getRadii(width ?? 1, height ?? 1);
  const { targetX, targetY } = await __privateMethod(this, _ActionDispatcher_instances, getCoordinateFromOrigin_fn).call(this, origin, offsetX, offsetY, startX, startY);
  if (targetX < 0 || targetY < 0) {
    throw new MoveTargetOutOfBoundsException(`Cannot move beyond viewport (x: ${targetX}, y: ${targetY})`);
  }
  let last;
  do {
    const ratio = duration > 0 ? (performance.now() - __privateGet(this, _tickStart)) / duration : 1;
    last = ratio >= 1;
    let x;
    let y;
    if (last) {
      x = targetX;
      y = targetY;
    } else {
      x = Math.round(ratio * (targetX - startX) + startX);
      y = Math.round(ratio * (targetY - startY) + startY);
    }
    if (source.x !== x || source.y !== y) {
      const { modifiers } = keyState;
      switch (pointerType) {
        case "mouse":
          await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
            type: "mouseMoved",
            x,
            y,
            modifiers,
            clickCount: 0,
            button: getCdpButton(source.pressed.values().next().value ?? 5),
            buttons: source.buttons,
            pointerType,
            tangentialPressure,
            tiltX,
            tiltY,
            twist,
            force: pressure
          });
          break;
        case "pen":
          if (source.pressed.size !== 0) {
            await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
              type: "mouseMoved",
              x,
              y,
              modifiers,
              clickCount: 0,
              button: getCdpButton(source.pressed.values().next().value ?? 5),
              buttons: source.buttons,
              pointerType,
              tangentialPressure,
              tiltX,
              tiltY,
              twist,
              force: pressure ?? 0.5
            });
          }
          break;
        case "touch":
          if (source.pressed.size !== 0) {
            await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
              type: "touchMove",
              touchPoints: [
                {
                  x,
                  y,
                  radiusX,
                  radiusY,
                  tangentialPressure,
                  tiltX,
                  tiltY,
                  twist,
                  force: pressure,
                  id: source.pointerId
                }
              ],
              modifiers
            });
          }
          break;
      }
      source.x = x;
      source.y = y;
      source.radiusX = radiusX;
      source.radiusY = radiusY;
      source.force = pressure;
    }
  } while (!last);
};
getFrameOffset_fn = async function() {
  if (__privateGet(this, _ActionDispatcher_instances, context_get).id === __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.id) {
    return { x: 0, y: 0 };
  }
  const { backendNodeId } = await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("DOM.getFrameOwner", { frameId: __privateGet(this, _ActionDispatcher_instances, context_get).id });
  const { model: frameBoxModel } = await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("DOM.getBoxModel", {
    backendNodeId
  });
  return { x: frameBoxModel.content[0], y: frameBoxModel.content[1] };
};
getCoordinateFromOrigin_fn = async function(origin, offsetX, offsetY, startX, startY) {
  let targetX;
  let targetY;
  const frameOffset = await __privateMethod(this, _ActionDispatcher_instances, getFrameOffset_fn).call(this);
  switch (origin) {
    case "viewport":
      targetX = offsetX + frameOffset.x;
      targetY = offsetY + frameOffset.y;
      break;
    case "pointer":
      targetX = startX + offsetX + frameOffset.x;
      targetY = startY + offsetY + frameOffset.y;
      break;
    default: {
      const { x: posX, y: posY } = await getElementCenter(__privateGet(this, _ActionDispatcher_instances, context_get), origin.element);
      targetX = posX + offsetX + frameOffset.x;
      targetY = posY + offsetY + frameOffset.y;
      break;
    }
  }
  return { targetX, targetY };
};
dispatchScrollAction_fn = async function(_source, keyState, action) {
  const { deltaX: targetDeltaX, deltaY: targetDeltaY, x: offsetX, y: offsetY, origin = "viewport", duration = __privateGet(this, _tickDuration) } = action;
  if (origin === "pointer") {
    throw new InvalidArgumentException('"pointer" origin is invalid for scrolling.');
  }
  const { targetX, targetY } = await __privateMethod(this, _ActionDispatcher_instances, getCoordinateFromOrigin_fn).call(this, origin, offsetX, offsetY, 0, 0);
  if (targetX < 0 || targetY < 0) {
    throw new MoveTargetOutOfBoundsException(`Cannot move beyond viewport (x: ${targetX}, y: ${targetY})`);
  }
  let currentDeltaX = 0;
  let currentDeltaY = 0;
  let last;
  do {
    const ratio = duration > 0 ? (performance.now() - __privateGet(this, _tickStart)) / duration : 1;
    last = ratio >= 1;
    let deltaX;
    let deltaY;
    if (last) {
      deltaX = targetDeltaX - currentDeltaX;
      deltaY = targetDeltaY - currentDeltaY;
    } else {
      deltaX = Math.round(ratio * targetDeltaX - currentDeltaX);
      deltaY = Math.round(ratio * targetDeltaY - currentDeltaY);
    }
    if (deltaX !== 0 || deltaY !== 0) {
      const { modifiers } = keyState;
      await __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseWheel",
        deltaX,
        deltaY,
        x: targetX,
        y: targetY,
        modifiers
      });
      currentDeltaX += deltaX;
      currentDeltaY += deltaY;
    }
  } while (!last);
};
dispatchKeyDownAction_fn = async function(source, action) {
  const rawKey = action.value;
  if (!isSingleGrapheme(rawKey)) {
    throw new InvalidArgumentException(`Invalid key value: ${rawKey}`);
  }
  const isGrapheme = isSingleComplexGrapheme(rawKey);
  const key = getNormalizedKey(rawKey);
  const repeat = source.pressed.has(key);
  const code = getKeyCode(rawKey);
  const location = getKeyLocation(rawKey);
  switch (key) {
    case "Alt":
      source.alt = true;
      break;
    case "Shift":
      source.shift = true;
      break;
    case "Control":
      source.ctrl = true;
      break;
    case "Meta":
      source.meta = true;
      break;
  }
  source.pressed.add(key);
  const { modifiers } = source;
  const unmodifiedText = getKeyEventUnmodifiedText(key, source, isGrapheme);
  const text = getKeyEventText(code ?? "", source) ?? unmodifiedText;
  let command;
  if (__privateGet(this, _isMacOS) && source.meta) {
    switch (code) {
      case "KeyA":
        command = "SelectAll";
        break;
      case "KeyC":
        command = "Copy";
        break;
      case "KeyV":
        command = source.shift ? "PasteAndMatchStyle" : "Paste";
        break;
      case "KeyX":
        command = "Cut";
        break;
      case "KeyZ":
        command = source.shift ? "Redo" : "Undo";
        break;
    }
  }
  const promises = [
    __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchKeyEvent", {
      type: text ? "keyDown" : "rawKeyDown",
      windowsVirtualKeyCode: KeyToKeyCode[key],
      key,
      code,
      text,
      unmodifiedText,
      autoRepeat: repeat,
      isSystemKey: source.alt || void 0,
      location: location < 3 ? location : void 0,
      isKeypad: location === 3,
      modifiers,
      commands: command ? [command] : void 0
    })
  ];
  if (key === "Escape") {
    if (!source.alt && (__privateGet(this, _isMacOS) && !source.ctrl && !source.meta || !__privateGet(this, _isMacOS))) {
      promises.push(__privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.cancelDragging"));
    }
  }
  await Promise.all(promises);
};
dispatchKeyUpAction_fn = function(source, action) {
  const rawKey = action.value;
  if (!isSingleGrapheme(rawKey)) {
    throw new InvalidArgumentException(`Invalid key value: ${rawKey}`);
  }
  const isGrapheme = isSingleComplexGrapheme(rawKey);
  const key = getNormalizedKey(rawKey);
  if (!source.pressed.has(key)) {
    return;
  }
  const code = getKeyCode(rawKey);
  const location = getKeyLocation(rawKey);
  switch (key) {
    case "Alt":
      source.alt = false;
      break;
    case "Shift":
      source.shift = false;
      break;
    case "Control":
      source.ctrl = false;
      break;
    case "Meta":
      source.meta = false;
      break;
  }
  source.pressed.delete(key);
  const { modifiers } = source;
  const unmodifiedText = getKeyEventUnmodifiedText(key, source, isGrapheme);
  const text = getKeyEventText(code ?? "", source) ?? unmodifiedText;
  return __privateGet(this, _ActionDispatcher_instances, context_get).cdpTarget.cdpClient.sendCommand("Input.dispatchKeyEvent", {
    type: "keyUp",
    windowsVirtualKeyCode: KeyToKeyCode[key],
    key,
    code,
    text,
    unmodifiedText,
    location: location < 3 ? location : void 0,
    isSystemKey: source.alt || void 0,
    isKeypad: location === 3,
    modifiers
  });
};
__publicField(ActionDispatcher, "isMacOS", async (context) => {
  const hiddenSandboxRealm = await context.getOrCreateHiddenSandbox();
  const result = await hiddenSandboxRealm.callFunction(IS_MAC_DECL, false);
  assert(result.type !== "exception");
  assert(result.result.type === "boolean");
  return result.result.value;
});
const getKeyEventUnmodifiedText = (key, source, isGrapheme) => {
  if (isGrapheme) {
    return key;
  }
  if (key === "Enter") {
    return "\r";
  }
  return [...key].length === 1 ? source.shift ? key.toLocaleUpperCase("en-US") : key : void 0;
};
const getKeyEventText = (code, source) => {
  if (source.ctrl) {
    switch (code) {
      case "Digit2":
        if (source.shift) {
          return "\0";
        }
        break;
      case "KeyA":
        return "";
      case "KeyB":
        return "";
      case "KeyC":
        return "";
      case "KeyD":
        return "";
      case "KeyE":
        return "";
      case "KeyF":
        return "";
      case "KeyG":
        return "\x07";
      case "KeyH":
        return "\b";
      case "KeyI":
        return "	";
      case "KeyJ":
        return "\n";
      case "KeyK":
        return "\v";
      case "KeyL":
        return "\f";
      case "KeyM":
        return "\r";
      case "KeyN":
        return "";
      case "KeyO":
        return "";
      case "KeyP":
        return "";
      case "KeyQ":
        return "";
      case "KeyR":
        return "";
      case "KeyS":
        return "";
      case "KeyT":
        return "";
      case "KeyU":
        return "";
      case "KeyV":
        return "";
      case "KeyW":
        return "";
      case "KeyX":
        return "";
      case "KeyY":
        return "";
      case "KeyZ":
        return "";
      case "BracketLeft":
        return "\x1B";
      case "Backslash":
        return "";
      case "BracketRight":
        return "";
      case "Digit6":
        if (source.shift) {
          return "";
        }
        break;
      case "Minus":
        return "";
    }
    return "";
  }
  if (source.alt) {
    return "";
  }
  return;
};
function getCdpButton(button) {
  switch (button) {
    case 0:
      return "left";
    case 1:
      return "middle";
    case 2:
      return "right";
    case 3:
      return "back";
    case 4:
      return "forward";
    default:
      return "none";
  }
}
function getTilt(action) {
  const altitudeAngle = action.altitudeAngle ?? Math.PI / 2;
  const azimuthAngle = action.azimuthAngle ?? 0;
  let tiltXRadians = 0;
  let tiltYRadians = 0;
  if (altitudeAngle === 0) {
    if (azimuthAngle === 0 || azimuthAngle === 2 * Math.PI) {
      tiltXRadians = Math.PI / 2;
    }
    if (azimuthAngle === Math.PI / 2) {
      tiltYRadians = Math.PI / 2;
    }
    if (azimuthAngle === Math.PI) {
      tiltXRadians = -Math.PI / 2;
    }
    if (azimuthAngle === 3 * Math.PI / 2) {
      tiltYRadians = -Math.PI / 2;
    }
    if (azimuthAngle > 0 && azimuthAngle < Math.PI / 2) {
      tiltXRadians = Math.PI / 2;
      tiltYRadians = Math.PI / 2;
    }
    if (azimuthAngle > Math.PI / 2 && azimuthAngle < Math.PI) {
      tiltXRadians = -Math.PI / 2;
      tiltYRadians = Math.PI / 2;
    }
    if (azimuthAngle > Math.PI && azimuthAngle < 3 * Math.PI / 2) {
      tiltXRadians = -Math.PI / 2;
      tiltYRadians = -Math.PI / 2;
    }
    if (azimuthAngle > 3 * Math.PI / 2 && azimuthAngle < 2 * Math.PI) {
      tiltXRadians = Math.PI / 2;
      tiltYRadians = -Math.PI / 2;
    }
  }
  if (altitudeAngle !== 0) {
    const tanAlt = Math.tan(altitudeAngle);
    tiltXRadians = Math.atan(Math.cos(azimuthAngle) / tanAlt);
    tiltYRadians = Math.atan(Math.sin(azimuthAngle) / tanAlt);
  }
  const factor = 180 / Math.PI;
  return {
    tiltX: Math.round(tiltXRadians * factor),
    tiltY: Math.round(tiltYRadians * factor)
  };
}
function getRadii(width, height) {
  return {
    radiusX: width ? width / 2 : 0.5,
    radiusY: height ? height / 2 : 0.5
  };
}
class Mutex {
  constructor() {
    __privateAdd(this, _Mutex_instances);
    __privateAdd(this, _locked, false);
    __privateAdd(this, _acquirers, []);
  }
  // This is FIFO.
  acquire() {
    const state = { resolved: false };
    if (__privateGet(this, _locked)) {
      return new Promise((resolve) => {
        __privateGet(this, _acquirers).push(() => resolve(__privateMethod(this, _Mutex_instances, release_fn).bind(this, state)));
      });
    }
    __privateSet(this, _locked, true);
    return Promise.resolve(__privateMethod(this, _Mutex_instances, release_fn).bind(this, state));
  }
  async run(action) {
    const release = await this.acquire();
    try {
      const result = await action();
      return result;
    } finally {
      release();
    }
  }
}
_locked = new WeakMap();
_acquirers = new WeakMap();
_Mutex_instances = new WeakSet();
release_fn = function(state) {
  if (state.resolved) {
    throw new Error("Cannot release more than once.");
  }
  state.resolved = true;
  const resolve = __privateGet(this, _acquirers).shift();
  if (!resolve) {
    __privateSet(this, _locked, false);
    return;
  }
  resolve();
};
class InputState {
  constructor() {
    __publicField(this, "cancelList", []);
    __privateAdd(this, _sources, /* @__PURE__ */ new Map());
    __privateAdd(this, _mutex, new Mutex());
  }
  getOrCreate(id, type, subtype) {
    let source = __privateGet(this, _sources).get(id);
    if (!source) {
      switch (type) {
        case "none":
          source = new NoneSource();
          break;
        case "key":
          source = new KeySource();
          break;
        case "pointer": {
          let pointerId = subtype === "mouse" ? 0 : 2;
          const pointerIds = /* @__PURE__ */ new Set();
          for (const [, source2] of __privateGet(this, _sources)) {
            if (source2.type === "pointer") {
              pointerIds.add(source2.pointerId);
            }
          }
          while (pointerIds.has(pointerId)) {
            ++pointerId;
          }
          source = new PointerSource(pointerId, subtype);
          break;
        }
        case "wheel":
          source = new WheelSource();
          break;
        default:
          throw new InvalidArgumentException(`Expected "${"none"}", "${"key"}", "${"pointer"}", or "${"wheel"}". Found unknown source type ${type}.`);
      }
      __privateGet(this, _sources).set(id, source);
      return source;
    }
    if (source.type !== type) {
      throw new InvalidArgumentException(`Input source type of ${id} is ${source.type}, but received ${type}.`);
    }
    return source;
  }
  get(id) {
    const source = __privateGet(this, _sources).get(id);
    if (!source) {
      throw new UnknownErrorException(`Internal error.`);
    }
    return source;
  }
  getGlobalKeyState() {
    const state = new KeySource();
    for (const [, source] of __privateGet(this, _sources)) {
      if (source.type !== "key") {
        continue;
      }
      for (const pressed of source.pressed) {
        state.pressed.add(pressed);
      }
      state.alt || (state.alt = source.alt);
      state.ctrl || (state.ctrl = source.ctrl);
      state.meta || (state.meta = source.meta);
      state.shift || (state.shift = source.shift);
    }
    return state;
  }
  get queue() {
    return __privateGet(this, _mutex);
  }
}
_sources = new WeakMap();
_mutex = new WeakMap();
class InputStateManager extends WeakMap {
  get(context) {
    assert(context.isTopLevelContext());
    if (!this.has(context)) {
      this.set(context, new InputState());
    }
    return super.get(context);
  }
}
class InputProcessor {
  constructor(browsingContextStorage) {
    __privateAdd(this, _InputProcessor_instances);
    __privateAdd(this, _browsingContextStorage6);
    __privateAdd(this, _inputStateManager, new InputStateManager());
    __privateSet(this, _browsingContextStorage6, browsingContextStorage);
  }
  async performActions(params) {
    const context = __privateGet(this, _browsingContextStorage6).getContext(params.context);
    const inputState = __privateGet(this, _inputStateManager).get(context.top);
    const actionsByTick = __privateMethod(this, _InputProcessor_instances, getActionsByTick_fn).call(this, params, inputState);
    const dispatcher = new ActionDispatcher(inputState, __privateGet(this, _browsingContextStorage6), params.context, await ActionDispatcher.isMacOS(context).catch(() => false));
    await dispatcher.dispatchActions(actionsByTick);
    return {};
  }
  async releaseActions(params) {
    const context = __privateGet(this, _browsingContextStorage6).getContext(params.context);
    const topContext = context.top;
    const inputState = __privateGet(this, _inputStateManager).get(topContext);
    const dispatcher = new ActionDispatcher(inputState, __privateGet(this, _browsingContextStorage6), params.context, await ActionDispatcher.isMacOS(context).catch(() => false));
    await dispatcher.dispatchTickActions(inputState.cancelList.reverse());
    __privateGet(this, _inputStateManager).delete(topContext);
    return {};
  }
  async setFiles(params) {
    const context = __privateGet(this, _browsingContextStorage6).getContext(params.context);
    const hiddenSandboxRealm = await context.getOrCreateHiddenSandbox();
    let result;
    try {
      result = await hiddenSandboxRealm.callFunction(String(function getFiles(fileListLength) {
        if (!(this instanceof HTMLInputElement)) {
          if (this instanceof Element) {
            return 1;
          }
          return 0;
        }
        if (this.type !== "file") {
          return 2;
        }
        if (this.disabled) {
          return 3;
        }
        if (fileListLength > 1 && !this.multiple) {
          return 4;
        }
        return;
      }), false, params.element, [{ type: "number", value: params.files.length }]);
    } catch {
      throw new NoSuchNodeException(`Could not find element ${params.element.sharedId}`);
    }
    assert(result.type === "success");
    if (result.result.type === "number") {
      switch (result.result.value) {
        case 0: {
          throw new NoSuchElementException(`Could not find element ${params.element.sharedId}`);
        }
        case 1: {
          throw new UnableToSetFileInputException(`Element ${params.element.sharedId} is not a input`);
        }
        case 2: {
          throw new UnableToSetFileInputException(`Input element ${params.element.sharedId} is not a file type`);
        }
        case 3: {
          throw new UnableToSetFileInputException(`Input element ${params.element.sharedId} is disabled`);
        }
        case 4: {
          throw new UnableToSetFileInputException(`Cannot set multiple files on a non-multiple input element`);
        }
      }
    }
    if (params.files.length === 0) {
      await hiddenSandboxRealm.callFunction(String(function dispatchEvent() {
        var _a3;
        if (((_a3 = this.files) == null ? void 0 : _a3.length) === 0) {
          this.dispatchEvent(new Event("cancel", {
            bubbles: true
          }));
          return;
        }
        this.files = new DataTransfer().files;
        this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        this.dispatchEvent(new Event("change", { bubbles: true }));
      }), false, params.element);
      return {};
    }
    const paths = [];
    for (let i = 0; i < params.files.length; ++i) {
      const result2 = await hiddenSandboxRealm.callFunction(
        String(function getFiles(index2) {
          var _a3;
          return (_a3 = this.files) == null ? void 0 : _a3.item(index2);
        }),
        false,
        params.element,
        [{ type: "number", value: 0 }],
        "root"
        /* Script.ResultOwnership.Root */
      );
      assert(result2.type === "success");
      if (result2.result.type !== "object") {
        break;
      }
      const { handle } = result2.result;
      assert(handle !== void 0);
      const { path } = await hiddenSandboxRealm.cdpClient.sendCommand("DOM.getFileInfo", {
        objectId: handle
      });
      paths.push(path);
      void hiddenSandboxRealm.disown(handle).catch(void 0);
    }
    paths.sort();
    const sortedFiles = [...params.files].sort();
    if (paths.length !== params.files.length || sortedFiles.some((path, index2) => {
      return paths[index2] !== path;
    })) {
      const { objectId } = await hiddenSandboxRealm.deserializeForCdp(params.element);
      assert(objectId !== void 0);
      await hiddenSandboxRealm.cdpClient.sendCommand("DOM.setFileInputFiles", {
        files: params.files,
        objectId
      });
    } else {
      await hiddenSandboxRealm.callFunction(String(function dispatchEvent() {
        this.dispatchEvent(new Event("cancel", {
          bubbles: true
        }));
      }), false, params.element);
    }
    return {};
  }
}
_browsingContextStorage6 = new WeakMap();
_inputStateManager = new WeakMap();
_InputProcessor_instances = new WeakSet();
getActionsByTick_fn = function(params, inputState) {
  var _a3;
  const actionsByTick = [];
  for (const action of params.actions) {
    switch (action.type) {
      case "pointer": {
        action.parameters ?? (action.parameters = {
          pointerType: "mouse"
          /* Input.PointerType.Mouse */
        });
        (_a3 = action.parameters).pointerType ?? (_a3.pointerType = "mouse");
        const source = inputState.getOrCreate(action.id, "pointer", action.parameters.pointerType);
        if (source.subtype !== action.parameters.pointerType) {
          throw new InvalidArgumentException(`Expected input source ${action.id} to be ${source.subtype}; got ${action.parameters.pointerType}.`);
        }
        source.resetClickCount();
        break;
      }
      default:
        inputState.getOrCreate(action.id, action.type);
    }
    const actions = action.actions.map((item) => ({
      id: action.id,
      action: item
    }));
    for (let i = 0; i < actions.length; i++) {
      if (actionsByTick.length === i) {
        actionsByTick.push([]);
      }
      actionsByTick[i].push(actions[i]);
    }
  }
  return actionsByTick;
};
function base64ToString(base64Str) {
  if ("atob" in globalThis) {
    return globalThis.atob(base64Str);
  }
  return Buffer.from(base64Str, "base64").toString("ascii");
}
function computeHeadersSize(headers) {
  const requestHeaders = headers.reduce((acc, header) => {
    return `${acc}${header.name}: ${header.value.value}\r
`;
  }, "");
  return new TextEncoder().encode(requestHeaders).length;
}
function stringToBase64(str) {
  return typedArrayToBase64(new TextEncoder().encode(str));
}
function typedArrayToBase64(typedArray) {
  const chunkSize = 65534;
  const chunks = [];
  for (let i = 0; i < typedArray.length; i += chunkSize) {
    const chunk = typedArray.subarray(i, i + chunkSize);
    chunks.push(String.fromCodePoint.apply(null, chunk));
  }
  const binaryString = chunks.join("");
  return btoa(binaryString);
}
function bidiNetworkHeadersFromCdpNetworkHeaders(headers) {
  if (!headers) {
    return [];
  }
  return Object.entries(headers).map(([name, value]) => ({
    name,
    value: {
      type: "string",
      value
    }
  }));
}
function cdpFetchHeadersFromBidiNetworkHeaders(headers) {
  if (headers === void 0) {
    return void 0;
  }
  return headers.map(({ name, value }) => ({
    name,
    value: value.value
  }));
}
function networkHeaderFromCookieHeaders(headers) {
  if (headers === void 0) {
    return void 0;
  }
  const value = headers.reduce((acc, value2, index2) => {
    if (index2 > 0) {
      acc += ";";
    }
    const cookieValue = value2.value.type === "base64" ? btoa(value2.value.value) : value2.value.value;
    acc += `${value2.name}=${cookieValue}`;
    return acc;
  }, "");
  return {
    name: "Cookie",
    value: {
      type: "string",
      value
    }
  };
}
function cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction(action) {
  switch (action) {
    case "default":
      return "Default";
    case "cancel":
      return "CancelAuth";
    case "provideCredentials":
      return "ProvideCredentials";
  }
}
function cdpToBiDiCookie(cookie) {
  const result = {
    name: cookie.name,
    value: { type: "string", value: cookie.value },
    domain: cookie.domain,
    path: cookie.path,
    size: cookie.size,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite === void 0 ? "none" : sameSiteCdpToBiDi(cookie.sameSite),
    ...cookie.expires >= 0 ? { expiry: Math.round(cookie.expires) } : void 0
  };
  result[`goog:session`] = cookie.session;
  result[`goog:priority`] = cookie.priority;
  result[`goog:sourceScheme`] = cookie.sourceScheme;
  result[`goog:sourcePort`] = cookie.sourcePort;
  if (cookie.partitionKey !== void 0) {
    result[`goog:partitionKey`] = cookie.partitionKey;
  }
  if (cookie.partitionKeyOpaque !== void 0) {
    result[`goog:partitionKeyOpaque`] = cookie.partitionKeyOpaque;
  }
  return result;
}
function deserializeByteValue(value) {
  if (value.type === "base64") {
    return base64ToString(value.value);
  }
  return value.value;
}
function bidiToCdpCookie(params, partitionKey) {
  const deserializedValue = deserializeByteValue(params.cookie.value);
  const result = {
    name: params.cookie.name,
    value: deserializedValue,
    domain: params.cookie.domain,
    path: params.cookie.path ?? "/",
    secure: params.cookie.secure ?? false,
    httpOnly: params.cookie.httpOnly ?? false,
    ...partitionKey.sourceOrigin !== void 0 && {
      partitionKey: {
        hasCrossSiteAncestor: false,
        // CDP's `partitionKey.topLevelSite` is the BiDi's `partition.sourceOrigin`.
        topLevelSite: partitionKey.sourceOrigin
      }
    },
    ...params.cookie.expiry !== void 0 && {
      expires: params.cookie.expiry
    },
    ...params.cookie.sameSite !== void 0 && {
      sameSite: sameSiteBiDiToCdp(params.cookie.sameSite)
    }
  };
  if (params.cookie[`goog:url`] !== void 0) {
    result.url = params.cookie[`goog:url`];
  }
  if (params.cookie[`goog:priority`] !== void 0) {
    result.priority = params.cookie[`goog:priority`];
  }
  if (params.cookie[`goog:sourceScheme`] !== void 0) {
    result.sourceScheme = params.cookie[`goog:sourceScheme`];
  }
  if (params.cookie[`goog:sourcePort`] !== void 0) {
    result.sourcePort = params.cookie[`goog:sourcePort`];
  }
  return result;
}
function sameSiteCdpToBiDi(sameSite) {
  switch (sameSite) {
    case "Strict":
      return "strict";
    case "None":
      return "none";
    case "Lax":
      return "lax";
    default:
      return "lax";
  }
}
function sameSiteBiDiToCdp(sameSite) {
  switch (sameSite) {
    case "none":
      return "None";
    case "strict":
      return "Strict";
    case "default":
    case "lax":
      return "Lax";
  }
  throw new InvalidArgumentException(`Unknown 'sameSite' value ${sameSite}`);
}
function isSpecialScheme(protocol) {
  return ["ftp", "file", "http", "https", "ws", "wss"].includes(protocol.replace(/:$/, ""));
}
function getScheme(url) {
  return url.protocol.replace(/:$/, "");
}
function matchUrlPattern(pattern, url) {
  const parsedUrl = new URL(url);
  if (pattern.protocol !== void 0 && pattern.protocol !== getScheme(parsedUrl)) {
    return false;
  }
  if (pattern.hostname !== void 0 && pattern.hostname !== parsedUrl.hostname) {
    return false;
  }
  if (pattern.port !== void 0 && pattern.port !== parsedUrl.port) {
    return false;
  }
  if (pattern.pathname !== void 0 && pattern.pathname !== parsedUrl.pathname) {
    return false;
  }
  if (pattern.search !== void 0 && pattern.search !== parsedUrl.search) {
    return false;
  }
  return true;
}
function bidiBodySizeFromCdpPostDataEntries(entries) {
  let size = 0;
  for (const entry of entries) {
    size += atob(entry.bytes ?? "").length;
  }
  return size;
}
function getTiming(timing, offset = 0) {
  if (!timing) {
    return 0;
  }
  if (timing <= 0 || timing + offset <= 0) {
    return 0;
  }
  return timing + offset;
}
const _NetworkProcessor = class _NetworkProcessor {
  constructor(browsingContextStorage, networkStorage, userContextStorage, contextConfigStorage) {
    __privateAdd(this, _NetworkProcessor_instances);
    __privateAdd(this, _browsingContextStorage7);
    __privateAdd(this, _networkStorage);
    __privateAdd(this, _userContextStorage4);
    __privateAdd(this, _contextConfigStorage3);
    __privateSet(this, _userContextStorage4, userContextStorage);
    __privateSet(this, _browsingContextStorage7, browsingContextStorage);
    __privateSet(this, _networkStorage, networkStorage);
    __privateSet(this, _contextConfigStorage3, contextConfigStorage);
  }
  async addIntercept(params) {
    __privateGet(this, _browsingContextStorage7).verifyTopLevelContextsList(params.contexts);
    const urlPatterns = params.urlPatterns ?? [];
    const parsedUrlPatterns = _NetworkProcessor.parseUrlPatterns(urlPatterns);
    const intercept = __privateGet(this, _networkStorage).addIntercept({
      urlPatterns: parsedUrlPatterns,
      phases: params.phases,
      contexts: params.contexts
    });
    await __privateMethod(this, _NetworkProcessor_instances, toggleNetwork_fn).call(this);
    return {
      intercept
    };
  }
  async continueRequest(params) {
    if (params.url !== void 0) {
      _NetworkProcessor.parseUrlString(params.url);
    }
    if (params.method !== void 0) {
      if (!_NetworkProcessor.isMethodValid(params.method)) {
        throw new InvalidArgumentException(`Method '${params.method}' is invalid.`);
      }
    }
    if (params.headers) {
      _NetworkProcessor.validateHeaders(params.headers);
    }
    const request = __privateMethod(this, _NetworkProcessor_instances, getBlockedRequestOrFail_fn).call(this, params.request, [
      "beforeRequestSent"
    ]);
    try {
      await request.continueRequest(params);
    } catch (error) {
      throw _NetworkProcessor.wrapInterceptionError(error);
    }
    return {};
  }
  async continueResponse(params) {
    if (params.headers) {
      _NetworkProcessor.validateHeaders(params.headers);
    }
    const request = __privateMethod(this, _NetworkProcessor_instances, getBlockedRequestOrFail_fn).call(this, params.request, [
      "authRequired",
      "responseStarted"
    ]);
    try {
      await request.continueResponse(params);
    } catch (error) {
      throw _NetworkProcessor.wrapInterceptionError(error);
    }
    return {};
  }
  async continueWithAuth(params) {
    const networkId = params.request;
    const request = __privateMethod(this, _NetworkProcessor_instances, getBlockedRequestOrFail_fn).call(this, networkId, [
      "authRequired"
    ]);
    await request.continueWithAuth(params);
    return {};
  }
  async failRequest({ request: networkId }) {
    const request = __privateMethod(this, _NetworkProcessor_instances, getRequestOrFail_fn).call(this, networkId);
    if (request.interceptPhase === "authRequired") {
      throw new InvalidArgumentException(`Request '${networkId}' in 'authRequired' phase cannot be failed`);
    }
    if (!request.interceptPhase) {
      throw new NoSuchRequestException(`No blocked request found for network id '${networkId}'`);
    }
    await request.failRequest("Failed");
    return {};
  }
  async provideResponse(params) {
    if (params.headers) {
      _NetworkProcessor.validateHeaders(params.headers);
    }
    const request = __privateMethod(this, _NetworkProcessor_instances, getBlockedRequestOrFail_fn).call(this, params.request, [
      "beforeRequestSent",
      "responseStarted",
      "authRequired"
    ]);
    try {
      await request.provideResponse(params);
    } catch (error) {
      throw _NetworkProcessor.wrapInterceptionError(error);
    }
    return {};
  }
  async removeIntercept(params) {
    __privateGet(this, _networkStorage).removeIntercept(params.intercept);
    await __privateMethod(this, _NetworkProcessor_instances, toggleNetwork_fn).call(this);
    return {};
  }
  async setCacheBehavior(params) {
    const contexts = __privateGet(this, _browsingContextStorage7).verifyTopLevelContextsList(params.contexts);
    if (contexts.size === 0) {
      __privateGet(this, _networkStorage).defaultCacheBehavior = params.cacheBehavior;
      await Promise.all(__privateGet(this, _browsingContextStorage7).getAllContexts().map((context) => {
        return context.cdpTarget.toggleSetCacheDisabled();
      }));
      return {};
    }
    const cacheDisabled = params.cacheBehavior === "bypass";
    await Promise.all([...contexts.values()].map((context) => {
      return context.cdpTarget.toggleSetCacheDisabled(cacheDisabled);
    }));
    return {};
  }
  /**
   * Validate https://fetch.spec.whatwg.org/#header-value
   */
  static validateHeaders(headers) {
    for (const header of headers) {
      let headerValue;
      if (header.value.type === "string") {
        headerValue = header.value.value;
      } else {
        headerValue = atob(header.value.value);
      }
      if (headerValue !== headerValue.trim() || headerValue.includes("\n") || headerValue.includes("\0")) {
        throw new InvalidArgumentException(`Header value '${headerValue}' is not acceptable value`);
      }
    }
  }
  static isMethodValid(method) {
    return /^[!#$%&'*+\-.^_`|~a-zA-Z\d]+$/.test(method);
  }
  /**
   * Attempts to parse the given url.
   * Throws an InvalidArgumentException if the url is invalid.
   */
  static parseUrlString(url) {
    try {
      return new URL(url);
    } catch (error) {
      throw new InvalidArgumentException(`Invalid URL '${url}': ${error}`);
    }
  }
  static parseUrlPatterns(urlPatterns) {
    return urlPatterns.map((urlPattern) => {
      let patternUrl = "";
      let hasProtocol = true;
      let hasHostname = true;
      let hasPort = true;
      let hasPathname = true;
      let hasSearch = true;
      switch (urlPattern.type) {
        case "string": {
          patternUrl = unescapeURLPattern(urlPattern.pattern);
          break;
        }
        case "pattern": {
          if (urlPattern.protocol === void 0) {
            hasProtocol = false;
            patternUrl += "http";
          } else {
            if (urlPattern.protocol === "") {
              throw new InvalidArgumentException("URL pattern must specify a protocol");
            }
            urlPattern.protocol = unescapeURLPattern(urlPattern.protocol);
            if (!urlPattern.protocol.match(/^[a-zA-Z+-.]+$/)) {
              throw new InvalidArgumentException("Forbidden characters");
            }
            patternUrl += urlPattern.protocol;
          }
          const scheme = patternUrl.toLocaleLowerCase();
          patternUrl += ":";
          if (isSpecialScheme(scheme)) {
            patternUrl += "//";
          }
          if (urlPattern.hostname === void 0) {
            if (scheme !== "file") {
              patternUrl += "placeholder";
            }
            hasHostname = false;
          } else {
            if (urlPattern.hostname === "") {
              throw new InvalidArgumentException("URL pattern must specify a hostname");
            }
            if (urlPattern.protocol === "file") {
              throw new InvalidArgumentException(`URL pattern protocol cannot be 'file'`);
            }
            urlPattern.hostname = unescapeURLPattern(urlPattern.hostname);
            let insideBrackets = false;
            for (const c of urlPattern.hostname) {
              if (c === "/" || c === "?" || c === "#") {
                throw new InvalidArgumentException(`'/', '?', '#' are forbidden in hostname`);
              }
              if (!insideBrackets && c === ":") {
                throw new InvalidArgumentException(`':' is only allowed inside brackets in hostname`);
              }
              if (c === "[") {
                insideBrackets = true;
              }
              if (c === "]") {
                insideBrackets = false;
              }
            }
            patternUrl += urlPattern.hostname;
          }
          if (urlPattern.port === void 0) {
            hasPort = false;
          } else {
            if (urlPattern.port === "") {
              throw new InvalidArgumentException(`URL pattern must specify a port`);
            }
            urlPattern.port = unescapeURLPattern(urlPattern.port);
            patternUrl += ":";
            if (!urlPattern.port.match(/^\d+$/)) {
              throw new InvalidArgumentException("Forbidden characters");
            }
            patternUrl += urlPattern.port;
          }
          if (urlPattern.pathname === void 0) {
            hasPathname = false;
          } else {
            urlPattern.pathname = unescapeURLPattern(urlPattern.pathname);
            if (urlPattern.pathname[0] !== "/") {
              patternUrl += "/";
            }
            if (urlPattern.pathname.includes("#") || urlPattern.pathname.includes("?")) {
              throw new InvalidArgumentException("Forbidden characters");
            }
            patternUrl += urlPattern.pathname;
          }
          if (urlPattern.search === void 0) {
            hasSearch = false;
          } else {
            urlPattern.search = unescapeURLPattern(urlPattern.search);
            if (urlPattern.search[0] !== "?") {
              patternUrl += "?";
            }
            if (urlPattern.search.includes("#")) {
              throw new InvalidArgumentException("Forbidden characters");
            }
            patternUrl += urlPattern.search;
          }
          break;
        }
      }
      const serializePort = (url) => {
        const defaultPorts = {
          "ftp:": 21,
          "file:": null,
          "http:": 80,
          "https:": 443,
          "ws:": 80,
          "wss:": 443
        };
        if (isSpecialScheme(url.protocol) && defaultPorts[url.protocol] !== null && (!url.port || String(defaultPorts[url.protocol]) === url.port)) {
          return "";
        } else if (url.port) {
          return url.port;
        }
        return void 0;
      };
      try {
        const url = new URL(patternUrl);
        return {
          protocol: hasProtocol ? url.protocol.replace(/:$/, "") : void 0,
          hostname: hasHostname ? url.hostname : void 0,
          port: hasPort ? serializePort(url) : void 0,
          pathname: hasPathname && url.pathname ? url.pathname : void 0,
          search: hasSearch ? url.search : void 0
        };
      } catch (err) {
        throw new InvalidArgumentException(`${err.message} '${patternUrl}'`);
      }
    });
  }
  static wrapInterceptionError(error) {
    if ((error == null ? void 0 : error.message.includes("Invalid header")) || (error == null ? void 0 : error.message.includes("Unsafe header"))) {
      return new InvalidArgumentException(error.message);
    }
    return error;
  }
  async addDataCollector(params) {
    if (params.userContexts !== void 0 && params.contexts !== void 0) {
      throw new InvalidArgumentException("'contexts' and 'userContexts' are mutually exclusive");
    }
    if (params.userContexts !== void 0) {
      await __privateGet(this, _userContextStorage4).verifyUserContextIdList(params.userContexts);
    }
    if (params.contexts !== void 0) {
      for (const browsingContextId of params.contexts) {
        const browsingContext = __privateGet(this, _browsingContextStorage7).getContext(browsingContextId);
        if (!browsingContext.isTopLevelContext()) {
          throw new InvalidArgumentException(`Data collectors are available only on top-level browsing contexts`);
        }
      }
    }
    const collectorId = __privateGet(this, _networkStorage).addDataCollector(params);
    await __privateMethod(this, _NetworkProcessor_instances, toggleNetwork_fn).call(this);
    return { collector: collectorId };
  }
  async getData(params) {
    return await __privateGet(this, _networkStorage).getCollectedData(params);
  }
  async removeDataCollector(params) {
    __privateGet(this, _networkStorage).removeDataCollector(params);
    await __privateMethod(this, _NetworkProcessor_instances, toggleNetwork_fn).call(this);
    return {};
  }
  disownData(params) {
    __privateGet(this, _networkStorage).disownData(params);
    return {};
  }
  async setExtraHeaders(params) {
    const affectedBrowsingContexts = await __privateMethod(this, _NetworkProcessor_instances, getRelatedTopLevelBrowsingContexts_fn3).call(this, params.contexts, params.userContexts);
    const cdpExtraHeaders = parseBiDiHeaders(params.headers);
    if (params.userContexts === void 0 && params.contexts === void 0) {
      __privateGet(this, _contextConfigStorage3).updateGlobalConfig({
        extraHeaders: cdpExtraHeaders
      });
    }
    if (params.userContexts !== void 0) {
      params.userContexts.forEach((userContext) => {
        __privateGet(this, _contextConfigStorage3).updateUserContextConfig(userContext, {
          extraHeaders: cdpExtraHeaders
        });
      });
    }
    if (params.contexts !== void 0) {
      params.contexts.forEach((browsingContextId) => {
        __privateGet(this, _contextConfigStorage3).updateBrowsingContextConfig(browsingContextId, { extraHeaders: cdpExtraHeaders });
      });
    }
    await Promise.all(affectedBrowsingContexts.map(async (context) => {
      const extraHeaders = __privateGet(this, _contextConfigStorage3).getActiveConfig(context.id, context.userContext).extraHeaders ?? {};
      await context.setExtraHeaders(extraHeaders);
    }));
    return {};
  }
};
_browsingContextStorage7 = new WeakMap();
_networkStorage = new WeakMap();
_userContextStorage4 = new WeakMap();
_contextConfigStorage3 = new WeakMap();
_NetworkProcessor_instances = new WeakSet();
toggleNetwork_fn = async function() {
  await Promise.all(__privateGet(this, _browsingContextStorage7).getAllContexts().map((context) => {
    return context.cdpTarget.toggleNetwork();
  }));
};
getRequestOrFail_fn = function(id) {
  const request = __privateGet(this, _networkStorage).getRequestById(id);
  if (!request) {
    throw new NoSuchRequestException(`Network request with ID '${id}' doesn't exist`);
  }
  return request;
};
getBlockedRequestOrFail_fn = function(id, phases) {
  const request = __privateMethod(this, _NetworkProcessor_instances, getRequestOrFail_fn).call(this, id);
  if (!request.interceptPhase) {
    throw new NoSuchRequestException(`No blocked request found for network id '${id}'`);
  }
  if (request.interceptPhase && !phases.includes(request.interceptPhase)) {
    throw new InvalidArgumentException(`Blocked request for network id '${id}' is in '${request.interceptPhase}' phase`);
  }
  return request;
};
getRelatedTopLevelBrowsingContexts_fn3 = async function(browsingContextIds, userContextIds) {
  if (browsingContextIds === void 0 && userContextIds === void 0) {
    return __privateGet(this, _browsingContextStorage7).getTopLevelContexts();
  }
  if (browsingContextIds !== void 0 && userContextIds !== void 0) {
    throw new InvalidArgumentException("User contexts and browsing contexts are mutually exclusive");
  }
  const result = [];
  if (userContextIds !== void 0) {
    if (userContextIds.length === 0) {
      throw new InvalidArgumentException("user context should be provided");
    }
    await __privateGet(this, _userContextStorage4).verifyUserContextIdList(userContextIds);
    for (const userContextId of userContextIds) {
      const topLevelBrowsingContexts = __privateGet(this, _browsingContextStorage7).getTopLevelContexts().filter((browsingContext) => browsingContext.userContext === userContextId);
      result.push(...topLevelBrowsingContexts);
    }
  }
  if (browsingContextIds !== void 0) {
    if (browsingContextIds.length === 0) {
      throw new InvalidArgumentException("browsing context should be provided");
    }
    for (const browsingContextId of browsingContextIds) {
      const browsingContext = __privateGet(this, _browsingContextStorage7).getContext(browsingContextId);
      if (!browsingContext.isTopLevelContext()) {
        throw new InvalidArgumentException("The command is only supported on the top-level context");
      }
      result.push(browsingContext);
    }
  }
  return [...new Set(result).values()];
};
let NetworkProcessor = _NetworkProcessor;
function unescapeURLPattern(pattern) {
  const forbidden = /* @__PURE__ */ new Set(["(", ")", "*", "{", "}"]);
  let result = "";
  let isEscaped = false;
  for (const c of pattern) {
    if (!isEscaped) {
      if (forbidden.has(c)) {
        throw new InvalidArgumentException("Forbidden characters");
      }
      if (c === "\\") {
        isEscaped = true;
        continue;
      }
    }
    result += c;
    isEscaped = false;
  }
  return result;
}
const FORBIDDEN_HEADER_NAME_SYMBOLS = /* @__PURE__ */ new Set([
  " ",
  "	",
  "\n",
  '"',
  "(",
  ")",
  ",",
  "/",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "@",
  "[",
  "\\",
  "]",
  "{",
  "}"
]);
const FORBIDDEN_HEADER_VALUE_SYMBOLS = /* @__PURE__ */ new Set(["\0", "\n", "\r"]);
function includesChar(str, chars) {
  for (const char of str) {
    if (chars.has(char)) {
      return true;
    }
  }
  return false;
}
function parseBiDiHeaders(headers) {
  const parsedHeaders = {};
  for (const bidiHeader of headers) {
    if (bidiHeader.value.type === "string") {
      const name = bidiHeader.name;
      const value = bidiHeader.value.value;
      if (name.length === 0) {
        throw new InvalidArgumentException(`Empty header name is not allowed`);
      }
      if (includesChar(name, FORBIDDEN_HEADER_NAME_SYMBOLS)) {
        throw new InvalidArgumentException(`Header name '${name}' contains forbidden symbols`);
      }
      if (includesChar(value, FORBIDDEN_HEADER_VALUE_SYMBOLS)) {
        throw new InvalidArgumentException(`Header value '${value}' contains forbidden symbols`);
      }
      if (value.trim() !== value) {
        throw new InvalidArgumentException(`Header value should not contain trailing or ending whitespaces`);
      }
      parsedHeaders[bidiHeader.name] = bidiHeader.value.value;
    } else {
      throw new UnsupportedOperationException("Only string headers values are supported");
    }
  }
  return parsedHeaders;
}
class PermissionsProcessor {
  constructor(browserCdpClient) {
    __privateAdd(this, _browserCdpClient4);
    __privateSet(this, _browserCdpClient4, browserCdpClient);
  }
  async setPermissions(params) {
    try {
      const userContextId = params["goog:userContext"] || params.userContext;
      await __privateGet(this, _browserCdpClient4).sendCommand("Browser.setPermission", {
        origin: params.origin,
        embeddedOrigin: params.embeddedOrigin,
        browserContextId: userContextId && userContextId !== "default" ? userContextId : void 0,
        permission: {
          name: params.descriptor.name
        },
        setting: params.state
      });
    } catch (err) {
      if (err.message === `Permission can't be granted to opaque origins.`) {
        return {};
      }
      throw new InvalidArgumentException(err.message);
    }
    return {};
  }
}
_browserCdpClient4 = new WeakMap();
function bytesToHex(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
function uuidv4() {
  if ("crypto" in globalThis && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }
  const randomValues = new Uint8Array(16);
  if ("crypto" in globalThis && "getRandomValues" in globalThis.crypto) {
    globalThis.crypto.getRandomValues(randomValues);
  }
  randomValues[6] = randomValues[6] & 15 | 64;
  randomValues[8] = randomValues[8] & 63 | 128;
  return [
    bytesToHex(randomValues.subarray(0, 4)),
    bytesToHex(randomValues.subarray(4, 6)),
    bytesToHex(randomValues.subarray(6, 8)),
    bytesToHex(randomValues.subarray(8, 10)),
    bytesToHex(randomValues.subarray(10, 16))
  ].join("-");
}
const _ChannelProxy = class _ChannelProxy {
  constructor(channel, logger) {
    __privateAdd(this, _ChannelProxy_instances);
    __privateAdd(this, _properties);
    __privateAdd(this, _id, uuidv4());
    __privateAdd(this, _logger2);
    __privateSet(this, _properties, channel);
    __privateSet(this, _logger2, logger);
  }
  /**
   * Creates a channel proxy in the given realm, initialises listener and
   * returns a handle to `sendMessage` delegate.
   */
  async init(realm, eventManager) {
    var _a3, _b2;
    const channelHandle = await __privateMethod(_a3 = _ChannelProxy, _ChannelProxy_static, createAndGetHandleInRealm_fn).call(_a3, realm);
    const sendMessageHandle = await __privateMethod(_b2 = _ChannelProxy, _ChannelProxy_static, createSendMessageHandle_fn).call(_b2, realm, channelHandle);
    void __privateMethod(this, _ChannelProxy_instances, startListener_fn).call(this, realm, channelHandle, eventManager);
    return sendMessageHandle;
  }
  /** Gets a ChannelProxy from window and returns its handle. */
  async startListenerFromWindow(realm, eventManager) {
    var _a3, _b2;
    try {
      const channelHandle = await __privateMethod(this, _ChannelProxy_instances, getHandleFromWindow_fn).call(this, realm);
      void __privateMethod(this, _ChannelProxy_instances, startListener_fn).call(this, realm, channelHandle, eventManager);
    } catch (error) {
      (_b2 = (_a3 = __privateGet(this, _logger2)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(error);
    }
  }
  /**
   * String to be evaluated to create a ProxyChannel and put it to window.
   * Returns the delegate `sendMessage`. Used to provide an argument for preload
   * script. Does the following:
   * 1. Creates a ChannelProxy.
   * 2. Puts the ChannelProxy to window['${this.#id}'] or resolves the promise
   *    by calling delegate stored in window['${this.#id}'].
   *    This is needed because `#getHandleFromWindow` can be called before or
   *    after this method.
   * 3. Returns the delegate `sendMessage` of the created ChannelProxy.
   */
  getEvalInWindowStr() {
    var _a3;
    const delegate = String((id, channelProxy) => {
      const w = window;
      if (w[id] === void 0) {
        w[id] = channelProxy;
      } else {
        w[id](channelProxy);
        delete w[id];
      }
      return channelProxy.sendMessage;
    });
    const channelProxyEval = __privateMethod(_a3 = _ChannelProxy, _ChannelProxy_static, createChannelProxyEvalStr_fn).call(_a3);
    return `(${delegate})('${__privateGet(this, _id)}',${channelProxyEval})`;
  }
};
_properties = new WeakMap();
_id = new WeakMap();
_logger2 = new WeakMap();
_ChannelProxy_static = new WeakSet();
createChannelProxyEvalStr_fn = function() {
  const functionStr = String(() => {
    const queue = [];
    let queueNonEmptyResolver = null;
    return {
      /**
       * Gets a promise, which is resolved as soon as a message occurs
       * in the queue.
       */
      async getMessage() {
        const onMessage = queue.length > 0 ? Promise.resolve() : new Promise((resolve) => {
          queueNonEmptyResolver = resolve;
        });
        await onMessage;
        return queue.shift();
      },
      /**
       * Adds a message to the queue.
       * Resolves the pending promise if needed.
       */
      sendMessage(message) {
        queue.push(message);
        if (queueNonEmptyResolver !== null) {
          queueNonEmptyResolver();
          queueNonEmptyResolver = null;
        }
      }
    };
  });
  return `(${functionStr})()`;
};
createAndGetHandleInRealm_fn = async function(realm) {
  const createChannelHandleResult = await realm.cdpClient.sendCommand("Runtime.evaluate", {
    expression: __privateMethod(this, _ChannelProxy_static, createChannelProxyEvalStr_fn).call(this),
    contextId: realm.executionContextId,
    serializationOptions: {
      serialization: "idOnly"
    }
  });
  if (createChannelHandleResult.exceptionDetails || createChannelHandleResult.result.objectId === void 0) {
    throw new Error(`Cannot create channel`);
  }
  return createChannelHandleResult.result.objectId;
};
createSendMessageHandle_fn = async function(realm, channelHandle) {
  const sendMessageArgResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
    functionDeclaration: String((channelHandle2) => {
      return channelHandle2.sendMessage;
    }),
    arguments: [{ objectId: channelHandle }],
    executionContextId: realm.executionContextId,
    serializationOptions: {
      serialization: "idOnly"
    }
  });
  return sendMessageArgResult.result.objectId;
};
_ChannelProxy_instances = new WeakSet();
startListener_fn = async function(realm, channelHandle, eventManager) {
  var _a3, _b2, _c2;
  for (; ; ) {
    try {
      const message = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
        functionDeclaration: String(async (channelHandle2) => await channelHandle2.getMessage()),
        arguments: [
          {
            objectId: channelHandle
          }
        ],
        awaitPromise: true,
        executionContextId: realm.executionContextId,
        serializationOptions: {
          serialization: "deep",
          maxDepth: ((_a3 = __privateGet(this, _properties).serializationOptions) == null ? void 0 : _a3.maxObjectDepth) ?? void 0
        }
      });
      if (message.exceptionDetails) {
        throw new Error("Runtime.callFunctionOn in ChannelProxy", {
          cause: message.exceptionDetails
        });
      }
      for (const browsingContext of realm.associatedBrowsingContexts) {
        eventManager.registerEvent({
          type: "event",
          method: Script.EventNames.Message,
          params: {
            channel: __privateGet(this, _properties).channel,
            data: realm.cdpToBidiValue(
              message,
              __privateGet(this, _properties).ownership ?? "none"
              /* Script.ResultOwnership.None */
            ),
            source: realm.source
          }
        }, browsingContext.id);
      }
    } catch (error) {
      (_c2 = (_b2 = __privateGet(this, _logger2)) == null ? void 0 : _b2.call(this, LogType.debugError)) == null ? void 0 : _c2(error);
      break;
    }
  }
};
getHandleFromWindow_fn = async function(realm) {
  const channelHandleResult = await realm.cdpClient.sendCommand("Runtime.callFunctionOn", {
    functionDeclaration: String((id) => {
      const w = window;
      if (w[id] === void 0) {
        return new Promise((resolve) => w[id] = resolve);
      }
      const channelProxy = w[id];
      delete w[id];
      return channelProxy;
    }),
    arguments: [{ value: __privateGet(this, _id) }],
    executionContextId: realm.executionContextId,
    awaitPromise: true,
    serializationOptions: {
      serialization: "idOnly"
    }
  });
  if (channelHandleResult.exceptionDetails !== void 0 || channelHandleResult.result.objectId === void 0) {
    throw new Error(`ChannelHandle not found in window["${__privateGet(this, _id)}"]`);
  }
  return channelHandleResult.result.objectId;
};
__privateAdd(_ChannelProxy, _ChannelProxy_static);
let ChannelProxy = _ChannelProxy;
class PreloadScript {
  constructor(params, logger) {
    __privateAdd(this, _PreloadScript_instances);
    /** BiDi ID, an automatically generated UUID. */
    __privateAdd(this, _id2, uuidv4());
    /** CDP preload scripts. */
    __privateAdd(this, _cdpPreloadScripts, []);
    /** The script itself, in a format expected by the spec i.e. a function. */
    __privateAdd(this, _functionDeclaration);
    /** Targets, in which the preload script is initialized. */
    __privateAdd(this, _targetIds, /* @__PURE__ */ new Set());
    /** Channels to be added as arguments to functionDeclaration. */
    __privateAdd(this, _channels);
    /** The script sandbox / world name. */
    __privateAdd(this, _sandbox);
    /** The browsing contexts to execute the preload scripts in, if any. */
    __privateAdd(this, _contexts);
    /** The browsing contexts to execute the preload scripts in, if any. */
    __privateAdd(this, _userContexts);
    var _a3;
    __privateSet(this, _channels, ((_a3 = params.arguments) == null ? void 0 : _a3.map((a) => new ChannelProxy(a.value, logger))) ?? []);
    __privateSet(this, _functionDeclaration, params.functionDeclaration);
    __privateSet(this, _sandbox, params.sandbox);
    __privateSet(this, _contexts, params.contexts);
    __privateSet(this, _userContexts, params.userContexts);
  }
  get id() {
    return __privateGet(this, _id2);
  }
  get targetIds() {
    return __privateGet(this, _targetIds);
  }
  /** Channels of the preload script. */
  get channels() {
    return __privateGet(this, _channels);
  }
  /** Contexts of the preload script, if any */
  get contexts() {
    return __privateGet(this, _contexts);
  }
  /** UserContexts of the preload script, if any */
  get userContexts() {
    return __privateGet(this, _userContexts);
  }
  /**
   * Adds the script to the given CDP targets by calling the
   * `Page.addScriptToEvaluateOnNewDocument` command.
   */
  async initInTargets(cdpTargets, runImmediately) {
    await Promise.all(Array.from(cdpTargets).map((cdpTarget) => this.initInTarget(cdpTarget, runImmediately)));
  }
  /**
   * Adds the script to the given CDP target by calling the
   * `Page.addScriptToEvaluateOnNewDocument` command.
   */
  async initInTarget(cdpTarget, runImmediately) {
    const addCdpPreloadScriptResult = await cdpTarget.cdpClient.sendCommand("Page.addScriptToEvaluateOnNewDocument", {
      source: __privateMethod(this, _PreloadScript_instances, getEvaluateString_fn).call(this),
      worldName: __privateGet(this, _sandbox),
      runImmediately
    });
    __privateGet(this, _cdpPreloadScripts).push({
      target: cdpTarget,
      preloadScriptId: addCdpPreloadScriptResult.identifier
    });
    __privateGet(this, _targetIds).add(cdpTarget.id);
  }
  /**
   * Removes this script from all CDP targets.
   */
  async remove() {
    await Promise.all([
      __privateGet(this, _cdpPreloadScripts).map(async (cdpPreloadScript) => {
        const cdpTarget = cdpPreloadScript.target;
        const cdpPreloadScriptId = cdpPreloadScript.preloadScriptId;
        return await cdpTarget.cdpClient.sendCommand("Page.removeScriptToEvaluateOnNewDocument", {
          identifier: cdpPreloadScriptId
        });
      })
    ]);
  }
  /** Removes the provided cdp target from the list of cdp preload scripts. */
  dispose(cdpTargetId) {
    __privateSet(this, _cdpPreloadScripts, __privateGet(this, _cdpPreloadScripts).filter((cdpPreloadScript) => {
      var _a3;
      return ((_a3 = cdpPreloadScript.target) == null ? void 0 : _a3.id) !== cdpTargetId;
    }));
    __privateGet(this, _targetIds).delete(cdpTargetId);
  }
}
_id2 = new WeakMap();
_cdpPreloadScripts = new WeakMap();
_functionDeclaration = new WeakMap();
_targetIds = new WeakMap();
_channels = new WeakMap();
_sandbox = new WeakMap();
_contexts = new WeakMap();
_userContexts = new WeakMap();
_PreloadScript_instances = new WeakSet();
/**
 * String to be evaluated. Wraps user-provided function so that the following
 * steps are run:
 * 1. Create channels.
 * 2. Store the created channels in window.
 * 3. Call the user-provided function with channels as arguments.
 */
getEvaluateString_fn = function() {
  const channelsArgStr = `[${this.channels.map((c) => c.getEvalInWindowStr()).join(", ")}]`;
  return `(()=>{(${__privateGet(this, _functionDeclaration)})(...${channelsArgStr})})()`;
};
class ScriptProcessor {
  constructor(eventManager, browsingContextStorage, realmStorage, preloadScriptStorage, userContextStorage, logger) {
    __privateAdd(this, _ScriptProcessor_instances);
    __privateAdd(this, _eventManager2);
    __privateAdd(this, _browsingContextStorage8);
    __privateAdd(this, _realmStorage2);
    __privateAdd(this, _preloadScriptStorage);
    __privateAdd(this, _userContextStorage5);
    __privateAdd(this, _logger3);
    __privateSet(this, _browsingContextStorage8, browsingContextStorage);
    __privateSet(this, _realmStorage2, realmStorage);
    __privateSet(this, _preloadScriptStorage, preloadScriptStorage);
    __privateSet(this, _userContextStorage5, userContextStorage);
    __privateSet(this, _logger3, logger);
    __privateSet(this, _eventManager2, eventManager);
    __privateGet(this, _eventManager2).addSubscribeHook(Script.EventNames.RealmCreated, __privateMethod(this, _ScriptProcessor_instances, onRealmCreatedSubscribeHook_fn).bind(this));
  }
  async addPreloadScript(params) {
    var _a3, _b2;
    if (((_a3 = params.userContexts) == null ? void 0 : _a3.length) && ((_b2 = params.contexts) == null ? void 0 : _b2.length)) {
      throw new InvalidArgumentException("Both userContexts and contexts cannot be specified.");
    }
    const userContexts = await __privateGet(this, _userContextStorage5).verifyUserContextIdList(params.userContexts ?? []);
    const browsingContexts = __privateGet(this, _browsingContextStorage8).verifyTopLevelContextsList(params.contexts);
    const preloadScript = new PreloadScript(params, __privateGet(this, _logger3));
    __privateGet(this, _preloadScriptStorage).add(preloadScript);
    let contextsToRunIn = [];
    if (userContexts.size) {
      contextsToRunIn = __privateGet(this, _browsingContextStorage8).getTopLevelContexts().filter((context) => {
        return userContexts.has(context.userContext);
      });
    } else if (browsingContexts.size) {
      contextsToRunIn = [...browsingContexts.values()];
    } else {
      contextsToRunIn = __privateGet(this, _browsingContextStorage8).getTopLevelContexts();
    }
    const cdpTargets = new Set(contextsToRunIn.map((context) => context.cdpTarget));
    await preloadScript.initInTargets(cdpTargets, false);
    return {
      script: preloadScript.id
    };
  }
  async removePreloadScript(params) {
    const { script: id } = params;
    const script = __privateGet(this, _preloadScriptStorage).getPreloadScript(id);
    await script.remove();
    __privateGet(this, _preloadScriptStorage).remove(id);
    return {};
  }
  async callFunction(params) {
    const realm = await __privateMethod(this, _ScriptProcessor_instances, getRealm_fn).call(this, params.target);
    return await realm.callFunction(params.functionDeclaration, params.awaitPromise, params.this, params.arguments, params.resultOwnership, params.serializationOptions, params.userActivation);
  }
  async evaluate(params) {
    const realm = await __privateMethod(this, _ScriptProcessor_instances, getRealm_fn).call(this, params.target);
    return await realm.evaluate(params.expression, params.awaitPromise, params.resultOwnership, params.serializationOptions, params.userActivation);
  }
  async disown(params) {
    const realm = await __privateMethod(this, _ScriptProcessor_instances, getRealm_fn).call(this, params.target);
    await Promise.all(params.handles.map(async (handle) => await realm.disown(handle)));
    return {};
  }
  getRealms(params) {
    if (params.context !== void 0) {
      __privateGet(this, _browsingContextStorage8).getContext(params.context);
    }
    const realms = __privateGet(this, _realmStorage2).findRealms({
      browsingContextId: params.context,
      type: params.type,
      isHidden: false
    }).map((realm) => realm.realmInfo);
    return { realms };
  }
}
_eventManager2 = new WeakMap();
_browsingContextStorage8 = new WeakMap();
_realmStorage2 = new WeakMap();
_preloadScriptStorage = new WeakMap();
_userContextStorage5 = new WeakMap();
_logger3 = new WeakMap();
_ScriptProcessor_instances = new WeakSet();
onRealmCreatedSubscribeHook_fn = function(contextId) {
  const context = __privateGet(this, _browsingContextStorage8).getContext(contextId);
  const contextsToReport = [
    context,
    ...__privateGet(this, _browsingContextStorage8).getContext(contextId).allChildren
  ];
  const realms = /* @__PURE__ */ new Set();
  for (const reportContext of contextsToReport) {
    const realmsForContext = __privateGet(this, _realmStorage2).findRealms({
      browsingContextId: reportContext.id
    });
    for (const realm of realmsForContext) {
      realms.add(realm);
    }
  }
  for (const realm of realms) {
    __privateGet(this, _eventManager2).registerEvent({
      type: "event",
      method: Script.EventNames.RealmCreated,
      params: realm.realmInfo
    }, context.id);
  }
  return Promise.resolve();
};
getRealm_fn = async function(target) {
  if ("context" in target) {
    const context = __privateGet(this, _browsingContextStorage8).getContext(target.context);
    return await context.getOrCreateUserSandbox(target.sandbox);
  }
  return __privateGet(this, _realmStorage2).getRealm({
    realmId: target.realm,
    isHidden: false
  });
};
class SessionProcessor {
  constructor(eventManager, browserCdpClient, initConnection) {
    __privateAdd(this, _SessionProcessor_instances);
    __privateAdd(this, _eventManager3);
    __privateAdd(this, _browserCdpClient5);
    __privateAdd(this, _initConnection);
    __privateAdd(this, _created, false);
    __privateSet(this, _eventManager3, eventManager);
    __privateSet(this, _browserCdpClient5, browserCdpClient);
    __privateSet(this, _initConnection, initConnection);
  }
  status() {
    return { ready: false, message: "already connected" };
  }
  async new(params) {
    if (__privateGet(this, _created)) {
      throw new Error("Session has been already created.");
    }
    __privateSet(this, _created, true);
    const matchedCapabitlites = __privateMethod(this, _SessionProcessor_instances, mergeCapabilities_fn).call(this, params.capabilities);
    await __privateGet(this, _initConnection).call(this, matchedCapabitlites);
    const version = await __privateGet(this, _browserCdpClient5).sendCommand("Browser.getVersion");
    return {
      sessionId: "unknown",
      capabilities: {
        ...matchedCapabitlites,
        acceptInsecureCerts: matchedCapabitlites.acceptInsecureCerts ?? false,
        browserName: version.product,
        browserVersion: version.revision,
        platformName: "",
        setWindowRect: false,
        webSocketUrl: "",
        userAgent: version.userAgent
      }
    };
  }
  async subscribe(params, googChannel = null) {
    const subscription = await __privateGet(this, _eventManager3).subscribe(params.events, params.contexts ?? [], params.userContexts ?? [], googChannel);
    return {
      subscription
    };
  }
  async unsubscribe(params, googChannel = null) {
    if ("subscriptions" in params) {
      await __privateGet(this, _eventManager3).unsubscribeByIds(params.subscriptions);
      return {};
    }
    await __privateGet(this, _eventManager3).unsubscribe(params.events, googChannel);
    return {};
  }
}
_eventManager3 = new WeakMap();
_browserCdpClient5 = new WeakMap();
_initConnection = new WeakMap();
_created = new WeakMap();
_SessionProcessor_instances = new WeakSet();
mergeCapabilities_fn = function(capabilitiesRequest) {
  const mergedCapabilities = [];
  for (const first of capabilitiesRequest.firstMatch ?? [{}]) {
    const result = {
      ...capabilitiesRequest.alwaysMatch
    };
    for (const key of Object.keys(first)) {
      if (result[key] !== void 0) {
        throw new InvalidArgumentException(`Capability ${key} in firstMatch is already defined in alwaysMatch`);
      }
      result[key] = first[key];
    }
    mergedCapabilities.push(result);
  }
  const match = mergedCapabilities.find((c) => c.browserName === "chrome") ?? mergedCapabilities[0] ?? {};
  match.unhandledPromptBehavior = __privateMethod(this, _SessionProcessor_instances, getUnhandledPromptBehavior_fn).call(this, match.unhandledPromptBehavior);
  return match;
};
getUnhandledPromptBehavior_fn = function(capabilityValue) {
  if (capabilityValue === void 0) {
    return void 0;
  }
  if (typeof capabilityValue === "object") {
    return capabilityValue;
  }
  if (typeof capabilityValue !== "string") {
    throw new InvalidArgumentException(`Unexpected 'unhandledPromptBehavior' type: ${typeof capabilityValue}`);
  }
  switch (capabilityValue) {
    case "accept":
    case "accept and notify":
      return {
        default: "accept",
        beforeUnload: "accept"
      };
    case "dismiss":
    case "dismiss and notify":
      return {
        default: "dismiss",
        beforeUnload: "accept"
      };
    case "ignore":
      return {
        default: "ignore",
        beforeUnload: "accept"
      };
    default:
      throw new InvalidArgumentException(`Unexpected 'unhandledPromptBehavior' value: ${capabilityValue}`);
  }
};
class StorageProcessor {
  constructor(browserCdpClient, browsingContextStorage, logger) {
    __privateAdd(this, _StorageProcessor_instances);
    __privateAdd(this, _browserCdpClient6);
    __privateAdd(this, _browsingContextStorage9);
    __privateAdd(this, _logger4);
    __privateSet(this, _browsingContextStorage9, browsingContextStorage);
    __privateSet(this, _browserCdpClient6, browserCdpClient);
    __privateSet(this, _logger4, logger);
  }
  async deleteCookies(params) {
    const partitionKey = __privateMethod(this, _StorageProcessor_instances, expandStoragePartitionSpec_fn).call(this, params.partition);
    let cdpResponse;
    try {
      cdpResponse = await __privateGet(this, _browserCdpClient6).sendCommand("Storage.getCookies", {
        browserContextId: __privateMethod(this, _StorageProcessor_instances, getCdpBrowserContextId_fn).call(this, partitionKey)
      });
    } catch (err) {
      if (__privateMethod(this, _StorageProcessor_instances, isNoSuchUserContextError_fn).call(this, err)) {
        throw new NoSuchUserContextException(err.message);
      }
      throw err;
    }
    const cdpCookiesToDelete = cdpResponse.cookies.filter(
      // CDP's partition key is the source origin. If the request specifies the
      // `sourceOrigin` partition key, only cookies with the requested source origin
      // are returned.
      (c) => {
        var _a3;
        return partitionKey.sourceOrigin === void 0 || ((_a3 = c.partitionKey) == null ? void 0 : _a3.topLevelSite) === partitionKey.sourceOrigin;
      }
    ).filter((cdpCookie) => {
      const bidiCookie = cdpToBiDiCookie(cdpCookie);
      return __privateMethod(this, _StorageProcessor_instances, matchCookie_fn).call(this, bidiCookie, params.filter);
    }).map((cookie) => ({
      ...cookie,
      // Set expiry to pass date to delete the cookie.
      expires: 1
    }));
    await __privateGet(this, _browserCdpClient6).sendCommand("Storage.setCookies", {
      cookies: cdpCookiesToDelete,
      browserContextId: __privateMethod(this, _StorageProcessor_instances, getCdpBrowserContextId_fn).call(this, partitionKey)
    });
    return {
      partitionKey
    };
  }
  async getCookies(params) {
    const partitionKey = __privateMethod(this, _StorageProcessor_instances, expandStoragePartitionSpec_fn).call(this, params.partition);
    let cdpResponse;
    try {
      cdpResponse = await __privateGet(this, _browserCdpClient6).sendCommand("Storage.getCookies", {
        browserContextId: __privateMethod(this, _StorageProcessor_instances, getCdpBrowserContextId_fn).call(this, partitionKey)
      });
    } catch (err) {
      if (__privateMethod(this, _StorageProcessor_instances, isNoSuchUserContextError_fn).call(this, err)) {
        throw new NoSuchUserContextException(err.message);
      }
      throw err;
    }
    const filteredBiDiCookies = cdpResponse.cookies.filter(
      // CDP's partition key is the source origin. If the request specifies the
      // `sourceOrigin` partition key, only cookies with the requested source origin
      // are returned.
      (c) => {
        var _a3;
        return partitionKey.sourceOrigin === void 0 || ((_a3 = c.partitionKey) == null ? void 0 : _a3.topLevelSite) === partitionKey.sourceOrigin;
      }
    ).map((c) => cdpToBiDiCookie(c)).filter((c) => __privateMethod(this, _StorageProcessor_instances, matchCookie_fn).call(this, c, params.filter));
    return {
      cookies: filteredBiDiCookies,
      partitionKey
    };
  }
  async setCookie(params) {
    var _a3, _b2;
    const partitionKey = __privateMethod(this, _StorageProcessor_instances, expandStoragePartitionSpec_fn).call(this, params.partition);
    const cdpCookie = bidiToCdpCookie(params, partitionKey);
    try {
      await __privateGet(this, _browserCdpClient6).sendCommand("Storage.setCookies", {
        cookies: [cdpCookie],
        browserContextId: __privateMethod(this, _StorageProcessor_instances, getCdpBrowserContextId_fn).call(this, partitionKey)
      });
    } catch (err) {
      if (__privateMethod(this, _StorageProcessor_instances, isNoSuchUserContextError_fn).call(this, err)) {
        throw new NoSuchUserContextException(err.message);
      }
      (_b2 = (_a3 = __privateGet(this, _logger4)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(err);
      throw new UnableToSetCookieException(err.toString());
    }
    return {
      partitionKey
    };
  }
}
_browserCdpClient6 = new WeakMap();
_browsingContextStorage9 = new WeakMap();
_logger4 = new WeakMap();
_StorageProcessor_instances = new WeakSet();
isNoSuchUserContextError_fn = function(err) {
  var _a3;
  return (_a3 = err.message) == null ? void 0 : _a3.startsWith("Failed to find browser context for id");
};
getCdpBrowserContextId_fn = function(partitionKey) {
  return partitionKey.userContext === "default" ? void 0 : partitionKey.userContext;
};
expandStoragePartitionSpecByBrowsingContext_fn = function(descriptor) {
  const browsingContextId = descriptor.context;
  const browsingContext = __privateGet(this, _browsingContextStorage9).getContext(browsingContextId);
  return {
    userContext: browsingContext.userContext
  };
};
expandStoragePartitionSpecByStorageKey_fn = function(descriptor) {
  var _a3, _b2;
  const unsupportedPartitionKeys = /* @__PURE__ */ new Map();
  let sourceOrigin = descriptor.sourceOrigin;
  if (sourceOrigin !== void 0) {
    const url = NetworkProcessor.parseUrlString(sourceOrigin);
    if (url.origin === "null") {
      sourceOrigin = url.origin;
    } else {
      sourceOrigin = `${url.protocol}//${url.hostname}`;
    }
  }
  for (const [key, value] of Object.entries(descriptor)) {
    if (key !== void 0 && value !== void 0 && !["type", "sourceOrigin", "userContext"].includes(key)) {
      unsupportedPartitionKeys.set(key, value);
    }
  }
  if (unsupportedPartitionKeys.size > 0) {
    (_b2 = (_a3 = __privateGet(this, _logger4)) == null ? void 0 : _a3.call(this, LogType.debugInfo)) == null ? void 0 : _b2(`Unsupported partition keys: ${JSON.stringify(Object.fromEntries(unsupportedPartitionKeys))}`);
  }
  const userContext = descriptor.userContext ?? "default";
  return {
    userContext,
    ...sourceOrigin === void 0 ? {} : { sourceOrigin }
  };
};
expandStoragePartitionSpec_fn = function(partitionSpec) {
  if (partitionSpec === void 0) {
    return { userContext: "default" };
  }
  if (partitionSpec.type === "context") {
    return __privateMethod(this, _StorageProcessor_instances, expandStoragePartitionSpecByBrowsingContext_fn).call(this, partitionSpec);
  }
  assert(partitionSpec.type === "storageKey", "Unknown partition type");
  return __privateMethod(this, _StorageProcessor_instances, expandStoragePartitionSpecByStorageKey_fn).call(this, partitionSpec);
};
matchCookie_fn = function(cookie, filter) {
  if (filter === void 0) {
    return true;
  }
  return (filter.domain === void 0 || filter.domain === cookie.domain) && (filter.name === void 0 || filter.name === cookie.name) && // `value` contains fields `type` and `value`.
  (filter.value === void 0 || deserializeByteValue(filter.value) === deserializeByteValue(cookie.value)) && (filter.path === void 0 || filter.path === cookie.path) && (filter.size === void 0 || filter.size === cookie.size) && (filter.httpOnly === void 0 || filter.httpOnly === cookie.httpOnly) && (filter.secure === void 0 || filter.secure === cookie.secure) && (filter.sameSite === void 0 || filter.sameSite === cookie.sameSite) && (filter.expiry === void 0 || filter.expiry === cookie.expiry);
};
class WebExtensionProcessor {
  constructor(browserCdpClient) {
    __privateAdd(this, _browserCdpClient7);
    __privateSet(this, _browserCdpClient7, browserCdpClient);
  }
  async install(params) {
    switch (params.extensionData.type) {
      case "archivePath":
      case "base64":
        throw new UnsupportedOperationException("Archived and Base64 extensions are not supported");
    }
    try {
      const response = await __privateGet(this, _browserCdpClient7).sendCommand("Extensions.loadUnpacked", {
        path: params.extensionData.path
      });
      return {
        extension: response.id
      };
    } catch (err) {
      if (err.message.startsWith("invalid web extension")) {
        throw new InvalidWebExtensionException(err.message);
      }
      throw err;
    }
  }
  async uninstall(params) {
    try {
      await __privateGet(this, _browserCdpClient7).sendCommand("Extensions.uninstall", {
        id: params.extension
      });
      return {};
    } catch (err) {
      if (err.message === "Uninstall failed. Reason: could not find extension.") {
        throw new NoSuchWebExtensionException("no such web extension");
      }
      throw err;
    }
  }
}
_browserCdpClient7 = new WeakMap();
const _OutgoingMessage = class _OutgoingMessage {
  constructor(message, googChannel = null) {
    __privateAdd(this, _message);
    __privateAdd(this, _googChannel);
    __privateSet(this, _message, message);
    __privateSet(this, _googChannel, googChannel);
  }
  static createFromPromise(messagePromise, googChannel) {
    return messagePromise.then((message) => {
      if (message.kind === "success") {
        return {
          kind: "success",
          value: new _OutgoingMessage(message.value, googChannel)
        };
      }
      return message;
    });
  }
  static createResolved(message, googChannel = null) {
    return Promise.resolve({
      kind: "success",
      value: new _OutgoingMessage(message, googChannel)
    });
  }
  get message() {
    return __privateGet(this, _message);
  }
  get googChannel() {
    return __privateGet(this, _googChannel);
  }
};
_message = new WeakMap();
_googChannel = new WeakMap();
let OutgoingMessage = _OutgoingMessage;
class CommandProcessor extends EventEmitter {
  constructor(cdpConnection, browserCdpClient, eventManager, browsingContextStorage, realmStorage, preloadScriptStorage, networkStorage, contextConfigStorage, bluetoothProcessor, digitalCredentialsProcessor, userContextStorage, parser = new BidiNoOpParser(), initConnection, logger) {
    super();
    __privateAdd(this, _CommandProcessor_instances);
    // keep-sorted start
    __privateAdd(this, _bluetoothProcessor);
    __privateAdd(this, _browserCdpClient8);
    __privateAdd(this, _browserProcessor);
    __privateAdd(this, _browsingContextProcessor);
    __privateAdd(this, _cdpProcessor);
    __privateAdd(this, _digitalCredentialsProcessor);
    __privateAdd(this, _emulationProcessor);
    __privateAdd(this, _inputProcessor);
    __privateAdd(this, _networkProcessor);
    __privateAdd(this, _permissionsProcessor);
    __privateAdd(this, _scriptProcessor);
    __privateAdd(this, _sessionProcessor);
    __privateAdd(this, _storageProcessor);
    __privateAdd(this, _webExtensionProcessor);
    // keep-sorted end
    __privateAdd(this, _parser);
    __privateAdd(this, _logger5);
    __privateSet(this, _browserCdpClient8, browserCdpClient);
    __privateSet(this, _parser, parser);
    __privateSet(this, _logger5, logger);
    __privateSet(this, _bluetoothProcessor, bluetoothProcessor);
    __privateSet(this, _digitalCredentialsProcessor, digitalCredentialsProcessor);
    __privateSet(this, _browserProcessor, new BrowserProcessor(browserCdpClient, browsingContextStorage, contextConfigStorage, userContextStorage));
    __privateSet(this, _browsingContextProcessor, new BrowsingContextProcessor(browserCdpClient, browsingContextStorage, userContextStorage, contextConfigStorage, eventManager));
    __privateSet(this, _cdpProcessor, new CdpProcessor(browsingContextStorage, realmStorage, cdpConnection, browserCdpClient));
    __privateSet(this, _emulationProcessor, new EmulationProcessor(browsingContextStorage, userContextStorage, contextConfigStorage));
    __privateSet(this, _inputProcessor, new InputProcessor(browsingContextStorage));
    __privateSet(this, _networkProcessor, new NetworkProcessor(browsingContextStorage, networkStorage, userContextStorage, contextConfigStorage));
    __privateSet(this, _permissionsProcessor, new PermissionsProcessor(browserCdpClient));
    __privateSet(this, _scriptProcessor, new ScriptProcessor(eventManager, browsingContextStorage, realmStorage, preloadScriptStorage, userContextStorage, logger));
    __privateSet(this, _sessionProcessor, new SessionProcessor(eventManager, browserCdpClient, initConnection));
    __privateSet(this, _storageProcessor, new StorageProcessor(browserCdpClient, browsingContextStorage, logger));
    __privateSet(this, _webExtensionProcessor, new WebExtensionProcessor(browserCdpClient));
  }
  async processCommand(command) {
    var _a3, _b2;
    try {
      const result = await __privateMethod(this, _CommandProcessor_instances, processCommand_fn).call(this, command);
      const response = {
        type: "success",
        id: command.id,
        result
      };
      this.emit("response", {
        message: OutgoingMessage.createResolved(response, command["goog:channel"]),
        event: command.method
      });
    } catch (e) {
      if (e instanceof Exception) {
        this.emit("response", {
          message: OutgoingMessage.createResolved(e.toErrorResponse(command.id), command["goog:channel"]),
          event: command.method
        });
      } else {
        const error = e;
        (_b2 = (_a3 = __privateGet(this, _logger5)) == null ? void 0 : _a3.call(this, LogType.bidi)) == null ? void 0 : _b2(error);
        const errorException = __privateGet(this, _browserCdpClient8).isCloseError(e) ? new NoSuchFrameException(`Browsing context is gone`) : new UnknownErrorException(error.message, error.stack);
        this.emit("response", {
          message: OutgoingMessage.createResolved(errorException.toErrorResponse(command.id), command["goog:channel"]),
          event: command.method
        });
      }
    }
  }
}
_bluetoothProcessor = new WeakMap();
_browserCdpClient8 = new WeakMap();
_browserProcessor = new WeakMap();
_browsingContextProcessor = new WeakMap();
_cdpProcessor = new WeakMap();
_digitalCredentialsProcessor = new WeakMap();
_emulationProcessor = new WeakMap();
_inputProcessor = new WeakMap();
_networkProcessor = new WeakMap();
_permissionsProcessor = new WeakMap();
_scriptProcessor = new WeakMap();
_sessionProcessor = new WeakMap();
_storageProcessor = new WeakMap();
_webExtensionProcessor = new WeakMap();
_parser = new WeakMap();
_logger5 = new WeakMap();
_CommandProcessor_instances = new WeakSet();
processCommand_fn = async function(command) {
  switch (command.method) {
    case "bluetooth.disableSimulation":
      return await __privateGet(this, _bluetoothProcessor).disableSimulation(__privateGet(this, _parser).parseDisableSimulationParameters(command.params));
    case "bluetooth.handleRequestDevicePrompt":
      return await __privateGet(this, _bluetoothProcessor).handleRequestDevicePrompt(__privateGet(this, _parser).parseHandleRequestDevicePromptParams(command.params));
    case "bluetooth.simulateAdapter":
      return await __privateGet(this, _bluetoothProcessor).simulateAdapter(__privateGet(this, _parser).parseSimulateAdapterParameters(command.params));
    case "bluetooth.simulateAdvertisement":
      return await __privateGet(this, _bluetoothProcessor).simulateAdvertisement(__privateGet(this, _parser).parseSimulateAdvertisementParameters(command.params));
    case "bluetooth.simulateCharacteristic":
      return await __privateGet(this, _bluetoothProcessor).simulateCharacteristic(__privateGet(this, _parser).parseSimulateCharacteristicParameters(command.params));
    case "bluetooth.simulateCharacteristicResponse":
      return await __privateGet(this, _bluetoothProcessor).simulateCharacteristicResponse(__privateGet(this, _parser).parseSimulateCharacteristicResponseParameters(command.params));
    case "bluetooth.simulateDescriptor":
      return await __privateGet(this, _bluetoothProcessor).simulateDescriptor(__privateGet(this, _parser).parseSimulateDescriptorParameters(command.params));
    case "bluetooth.simulateDescriptorResponse":
      return await __privateGet(this, _bluetoothProcessor).simulateDescriptorResponse(__privateGet(this, _parser).parseSimulateDescriptorResponseParameters(command.params));
    case "bluetooth.simulateGattConnectionResponse":
      return await __privateGet(this, _bluetoothProcessor).simulateGattConnectionResponse(__privateGet(this, _parser).parseSimulateGattConnectionResponseParameters(command.params));
    case "bluetooth.simulateGattDisconnection":
      return await __privateGet(this, _bluetoothProcessor).simulateGattDisconnection(__privateGet(this, _parser).parseSimulateGattDisconnectionParameters(command.params));
    case "bluetooth.simulatePreconnectedPeripheral":
      return await __privateGet(this, _bluetoothProcessor).simulatePreconnectedPeripheral(__privateGet(this, _parser).parseSimulatePreconnectedPeripheralParameters(command.params));
    case "bluetooth.simulateService":
      return await __privateGet(this, _bluetoothProcessor).simulateService(__privateGet(this, _parser).parseSimulateServiceParameters(command.params));
    case "browser.close":
      return __privateGet(this, _browserProcessor).close();
    case "browser.createUserContext":
      return await __privateGet(this, _browserProcessor).createUserContext(__privateGet(this, _parser).parseCreateUserContextParameters(command.params));
    case "browser.getClientWindows":
      return await __privateGet(this, _browserProcessor).getClientWindows();
    case "browser.getUserContexts":
      return await __privateGet(this, _browserProcessor).getUserContexts();
    case "browser.removeUserContext":
      return await __privateGet(this, _browserProcessor).removeUserContext(__privateGet(this, _parser).parseRemoveUserContextParameters(command.params));
    case "browser.setClientWindowState":
      return await __privateGet(this, _browserProcessor).setClientWindowState(__privateGet(this, _parser).parseSetClientWindowStateParameters(command.params));
    case "browser.setDownloadBehavior":
      return await __privateGet(this, _browserProcessor).setDownloadBehavior(__privateGet(this, _parser).parseSetDownloadBehaviorParameters(command.params));
    case "browsingContext.activate":
      return await __privateGet(this, _browsingContextProcessor).activate(__privateGet(this, _parser).parseActivateParams(command.params));
    case "browsingContext.captureScreenshot":
      return await __privateGet(this, _browsingContextProcessor).captureScreenshot(__privateGet(this, _parser).parseCaptureScreenshotParams(command.params));
    case "browsingContext.close":
      return await __privateGet(this, _browsingContextProcessor).close(__privateGet(this, _parser).parseCloseParams(command.params));
    case "browsingContext.create":
      return await __privateGet(this, _browsingContextProcessor).create(__privateGet(this, _parser).parseCreateParams(command.params));
    case "browsingContext.getTree":
      return __privateGet(this, _browsingContextProcessor).getTree(__privateGet(this, _parser).parseGetTreeParams(command.params));
    case "browsingContext.handleUserPrompt":
      return await __privateGet(this, _browsingContextProcessor).handleUserPrompt(__privateGet(this, _parser).parseHandleUserPromptParams(command.params));
    case "browsingContext.locateNodes":
      return await __privateGet(this, _browsingContextProcessor).locateNodes(__privateGet(this, _parser).parseLocateNodesParams(command.params));
    case "browsingContext.navigate":
      return await __privateGet(this, _browsingContextProcessor).navigate(__privateGet(this, _parser).parseNavigateParams(command.params));
    case "browsingContext.print":
      return await __privateGet(this, _browsingContextProcessor).print(__privateGet(this, _parser).parsePrintParams(command.params));
    case "browsingContext.reload":
      return await __privateGet(this, _browsingContextProcessor).reload(__privateGet(this, _parser).parseReloadParams(command.params));
    case "browsingContext.setBypassCSP":
      __privateGet(this, _parser).parseSetBypassCspParams(command.params);
      throw new UnsupportedOperationException(`Method ${command.method} is not implemented.`);
    case "browsingContext.setViewport":
      return await __privateGet(this, _browsingContextProcessor).setViewport(__privateGet(this, _parser).parseSetViewportParams(command.params));
    case "browsingContext.startScreencast":
      __privateGet(this, _parser).parseStartScreencastParams(command.params);
      throw new UnsupportedOperationException(`Method ${command.method} is not implemented.`);
    case "browsingContext.stopScreencast":
      __privateGet(this, _parser).parseStopScreencastParams(command.params);
      throw new UnsupportedOperationException(`Method ${command.method} is not implemented.`);
    case "browsingContext.traverseHistory":
      return await __privateGet(this, _browsingContextProcessor).traverseHistory(__privateGet(this, _parser).parseTraverseHistoryParams(command.params));
    case "goog:cdp.getSession":
      return __privateGet(this, _cdpProcessor).getSession(__privateGet(this, _parser).parseGetSessionParams(command.params));
    case "goog:cdp.resolveRealm":
      return __privateGet(this, _cdpProcessor).resolveRealm(__privateGet(this, _parser).parseResolveRealmParams(command.params));
    case "goog:cdp.sendCommand":
      return await __privateGet(this, _cdpProcessor).sendCommand(__privateGet(this, _parser).parseSendCommandParams(command.params));
    case "digitalCredentials.setVirtualWalletBehavior":
      return await __privateGet(this, _digitalCredentialsProcessor).setVirtualWalletBehavior(__privateGet(this, _parser).parseSetVirtualWalletBehaviorParams(command.params));
    case "emulation.setForcedColorsModeThemeOverride":
      __privateGet(this, _parser).parseSetForcedColorsModeThemeOverrideParams(command.params);
      throw new UnsupportedOperationException(`Method ${command.method} is not implemented.`);
    case "emulation.setGeolocationOverride":
      return await __privateGet(this, _emulationProcessor).setGeolocationOverride(__privateGet(this, _parser).parseSetGeolocationOverrideParams(command.params));
    case "emulation.setLocaleOverride":
      return await __privateGet(this, _emulationProcessor).setLocaleOverride(__privateGet(this, _parser).parseSetLocaleOverrideParams(command.params));
    case "emulation.setNetworkConditions":
      return await __privateGet(this, _emulationProcessor).setNetworkConditions(__privateGet(this, _parser).parseSetNetworkConditionsParams(command.params));
    case "emulation.setScreenOrientationOverride":
      return await __privateGet(this, _emulationProcessor).setScreenOrientationOverride(__privateGet(this, _parser).parseSetScreenOrientationOverrideParams(command.params));
    case "emulation.setScreenSettingsOverride":
      return await __privateGet(this, _emulationProcessor).setScreenSettingsOverride(__privateGet(this, _parser).parseSetScreenSettingsOverrideParams(command.params));
    case "emulation.setScriptingEnabled":
      return await __privateGet(this, _emulationProcessor).setScriptingEnabled(__privateGet(this, _parser).parseSetScriptingEnabledParams(command.params));
    case "emulation.setScrollbarTypeOverride":
      return await __privateGet(this, _emulationProcessor).setScrollbarTypeOverride(__privateGet(this, _parser).parseSetScrollbarTypeOverrideParams(command.params));
    case "emulation.setTimezoneOverride":
      return await __privateGet(this, _emulationProcessor).setTimezoneOverride(__privateGet(this, _parser).parseSetTimezoneOverrideParams(command.params));
    case "emulation.setTouchOverride":
      return await __privateGet(this, _emulationProcessor).setTouchOverride(__privateGet(this, _parser).parseSetTouchOverrideParams(command.params));
    case "emulation.setUserAgentOverride":
      return await __privateGet(this, _emulationProcessor).setUserAgentOverrideParams(__privateGet(this, _parser).parseSetUserAgentOverrideParams(command.params));
    case "userAgentClientHints.setClientHintsOverride":
      return await __privateGet(this, _emulationProcessor).setClientHintsOverride(__privateGet(this, _parser).parseSetClientHintsOverrideParams(command.params));
    case "input.performActions":
      return await __privateGet(this, _inputProcessor).performActions(__privateGet(this, _parser).parsePerformActionsParams(command.params));
    case "input.releaseActions":
      return await __privateGet(this, _inputProcessor).releaseActions(__privateGet(this, _parser).parseReleaseActionsParams(command.params));
    case "input.setFiles":
      return await __privateGet(this, _inputProcessor).setFiles(__privateGet(this, _parser).parseSetFilesParams(command.params));
    case "network.addDataCollector":
      return await __privateGet(this, _networkProcessor).addDataCollector(__privateGet(this, _parser).parseAddDataCollectorParams(command.params));
    case "network.addIntercept":
      return await __privateGet(this, _networkProcessor).addIntercept(__privateGet(this, _parser).parseAddInterceptParams(command.params));
    case "network.continueRequest":
      return await __privateGet(this, _networkProcessor).continueRequest(__privateGet(this, _parser).parseContinueRequestParams(command.params));
    case "network.continueResponse":
      return await __privateGet(this, _networkProcessor).continueResponse(__privateGet(this, _parser).parseContinueResponseParams(command.params));
    case "network.continueWithAuth":
      return await __privateGet(this, _networkProcessor).continueWithAuth(__privateGet(this, _parser).parseContinueWithAuthParams(command.params));
    case "network.disownData":
      return __privateGet(this, _networkProcessor).disownData(__privateGet(this, _parser).parseDisownDataParams(command.params));
    case "network.failRequest":
      return await __privateGet(this, _networkProcessor).failRequest(__privateGet(this, _parser).parseFailRequestParams(command.params));
    case "network.getData":
      return await __privateGet(this, _networkProcessor).getData(__privateGet(this, _parser).parseGetDataParams(command.params));
    case "network.provideResponse":
      return await __privateGet(this, _networkProcessor).provideResponse(__privateGet(this, _parser).parseProvideResponseParams(command.params));
    case "network.removeDataCollector":
      return await __privateGet(this, _networkProcessor).removeDataCollector(__privateGet(this, _parser).parseRemoveDataCollectorParams(command.params));
    case "network.removeIntercept":
      return await __privateGet(this, _networkProcessor).removeIntercept(__privateGet(this, _parser).parseRemoveInterceptParams(command.params));
    case "network.setCacheBehavior":
      return await __privateGet(this, _networkProcessor).setCacheBehavior(__privateGet(this, _parser).parseSetCacheBehaviorParams(command.params));
    case "network.setExtraHeaders":
      return await __privateGet(this, _networkProcessor).setExtraHeaders(__privateGet(this, _parser).parseSetExtraHeadersParams(command.params));
    case "permissions.setPermission":
      return await __privateGet(this, _permissionsProcessor).setPermissions(__privateGet(this, _parser).parseSetPermissionsParams(command.params));
    case "script.addPreloadScript":
      return await __privateGet(this, _scriptProcessor).addPreloadScript(__privateGet(this, _parser).parseAddPreloadScriptParams(command.params));
    case "script.callFunction":
      return await __privateGet(this, _scriptProcessor).callFunction(__privateGet(this, _parser).parseCallFunctionParams(__privateMethod(this, _CommandProcessor_instances, processTargetParams_fn).call(this, command.params)));
    case "script.disown":
      return await __privateGet(this, _scriptProcessor).disown(__privateGet(this, _parser).parseDisownParams(__privateMethod(this, _CommandProcessor_instances, processTargetParams_fn).call(this, command.params)));
    case "script.evaluate":
      return await __privateGet(this, _scriptProcessor).evaluate(__privateGet(this, _parser).parseEvaluateParams(__privateMethod(this, _CommandProcessor_instances, processTargetParams_fn).call(this, command.params)));
    case "script.getRealms":
      return __privateGet(this, _scriptProcessor).getRealms(__privateGet(this, _parser).parseGetRealmsParams(command.params));
    case "script.removePreloadScript":
      return await __privateGet(this, _scriptProcessor).removePreloadScript(__privateGet(this, _parser).parseRemovePreloadScriptParams(command.params));
    case "session.end":
      throw new UnsupportedOperationException(`Method ${command.method} is not implemented.`);
    case "session.new":
      return await __privateGet(this, _sessionProcessor).new(command.params);
    case "session.status":
      return __privateGet(this, _sessionProcessor).status();
    case "session.subscribe":
      return await __privateGet(this, _sessionProcessor).subscribe(__privateGet(this, _parser).parseSubscribeParams(command.params), command["goog:channel"]);
    case "session.unsubscribe":
      return await __privateGet(this, _sessionProcessor).unsubscribe(__privateGet(this, _parser).parseUnsubscribeParams(command.params), command["goog:channel"]);
    case "storage.deleteCookies":
      return await __privateGet(this, _storageProcessor).deleteCookies(__privateGet(this, _parser).parseDeleteCookiesParams(command.params));
    case "storage.getCookies":
      return await __privateGet(this, _storageProcessor).getCookies(__privateGet(this, _parser).parseGetCookiesParams(command.params));
    case "storage.setCookie":
      return await __privateGet(this, _storageProcessor).setCookie(__privateGet(this, _parser).parseSetCookieParams(command.params));
    case "webExtension.install":
      return await __privateGet(this, _webExtensionProcessor).install(__privateGet(this, _parser).parseInstallParams(command.params));
    case "webExtension.uninstall":
      return await __privateGet(this, _webExtensionProcessor).uninstall(__privateGet(this, _parser).parseUninstallParams(command.params));
  }
  throw new UnknownCommandException(`Unknown command '${command == null ? void 0 : command.method}'.`);
};
// Workaround for as zod.union always take the first schema
// https://github.com/w3c/webdriver-bidi/issues/635
processTargetParams_fn = function(params) {
  if (typeof params === "object" && params && "target" in params && typeof params.target === "object" && params.target && "context" in params.target) {
    delete params.target["realm"];
  }
  return params;
};
class BluetoothGattItem {
  constructor(id, uuid) {
    __publicField(this, "id");
    __publicField(this, "uuid");
    this.id = id;
    this.uuid = uuid;
  }
}
class BluetoothDescriptor extends BluetoothGattItem {
  constructor(id, uuid, characteristic) {
    super(id, uuid);
    __publicField(this, "characteristic");
    this.characteristic = characteristic;
  }
}
class BluetoothCharacteristic extends BluetoothGattItem {
  constructor(id, uuid, service) {
    super(id, uuid);
    __publicField(this, "descriptors", /* @__PURE__ */ new Map());
    __publicField(this, "service");
    this.service = service;
  }
}
class BluetoothService extends BluetoothGattItem {
  constructor(id, uuid, device) {
    super(id, uuid);
    __publicField(this, "characteristics", /* @__PURE__ */ new Map());
    __publicField(this, "device");
    this.device = device;
  }
}
class BluetoothDevice {
  constructor(address) {
    __publicField(this, "address");
    __publicField(this, "services", /* @__PURE__ */ new Map());
    this.address = address;
  }
}
class BluetoothProcessor {
  constructor(eventManager, browsingContextStorage) {
    __privateAdd(this, _BluetoothProcessor_instances);
    __privateAdd(this, _eventManager4);
    __privateAdd(this, _browsingContextStorage10);
    __privateAdd(this, _bluetoothDevices, /* @__PURE__ */ new Map());
    // A map from a characteristic id from CDP to its BluetoothCharacteristic object.
    __privateAdd(this, _bluetoothCharacteristics, /* @__PURE__ */ new Map());
    // A map from a descriptor id from CDP to its BluetoothDescriptor object.
    __privateAdd(this, _bluetoothDescriptors, /* @__PURE__ */ new Map());
    __privateSet(this, _eventManager4, eventManager);
    __privateSet(this, _browsingContextStorage10, browsingContextStorage);
  }
  async simulateAdapter(params) {
    if (params.state === void 0) {
      throw new InvalidArgumentException(`Parameter "state" is required for creating a Bluetooth adapter`);
    }
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.disable");
    __privateGet(this, _bluetoothDevices).clear();
    __privateGet(this, _bluetoothCharacteristics).clear();
    __privateGet(this, _bluetoothDescriptors).clear();
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.enable", {
      state: params.state,
      leSupported: params.leSupported ?? true
    });
    return {};
  }
  async disableSimulation(params) {
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.disable");
    __privateGet(this, _bluetoothDevices).clear();
    __privateGet(this, _bluetoothCharacteristics).clear();
    __privateGet(this, _bluetoothDescriptors).clear();
    return {};
  }
  async simulatePreconnectedPeripheral(params) {
    if (__privateGet(this, _bluetoothDevices).has(params.address)) {
      throw new InvalidArgumentException(`Bluetooth device with address ${params.address} already exists`);
    }
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulatePreconnectedPeripheral", {
      address: params.address,
      name: params.name,
      knownServiceUuids: params.knownServiceUuids,
      manufacturerData: params.manufacturerData
    });
    __privateGet(this, _bluetoothDevices).set(params.address, new BluetoothDevice(params.address));
    return {};
  }
  async simulateAdvertisement(params) {
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateAdvertisement", {
      entry: params.scanEntry
    });
    return {};
  }
  async simulateCharacteristic(params) {
    const device = __privateMethod(this, _BluetoothProcessor_instances, getDevice_fn).call(this, params.address);
    const service = __privateMethod(this, _BluetoothProcessor_instances, getService_fn).call(this, device, params.serviceUuid);
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    switch (params.type) {
      case "add": {
        if (params.characteristicProperties === void 0) {
          throw new InvalidArgumentException(`Parameter "characteristicProperties" is required for adding a Bluetooth characteristic`);
        }
        if (service.characteristics.has(params.characteristicUuid)) {
          throw new InvalidArgumentException(`Characteristic with UUID ${params.characteristicUuid} already exists`);
        }
        const response = await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.addCharacteristic", {
          serviceId: service.id,
          characteristicUuid: params.characteristicUuid,
          properties: params.characteristicProperties
        });
        const characteristic = new BluetoothCharacteristic(response.characteristicId, params.characteristicUuid, service);
        service.characteristics.set(params.characteristicUuid, characteristic);
        __privateGet(this, _bluetoothCharacteristics).set(characteristic.id, characteristic);
        return {};
      }
      case "remove": {
        if (params.characteristicProperties !== void 0) {
          throw new InvalidArgumentException(`Parameter "characteristicProperties" should not be provided for removing a Bluetooth characteristic`);
        }
        const characteristic = __privateMethod(this, _BluetoothProcessor_instances, getCharacteristic_fn).call(this, service, params.characteristicUuid);
        await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.removeCharacteristic", {
          characteristicId: characteristic.id
        });
        service.characteristics.delete(params.characteristicUuid);
        __privateGet(this, _bluetoothCharacteristics).delete(characteristic.id);
        return {};
      }
      default:
        throw new InvalidArgumentException(`Parameter "type" of ${params.type} is not supported`);
    }
  }
  async simulateCharacteristicResponse(params) {
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    const device = __privateMethod(this, _BluetoothProcessor_instances, getDevice_fn).call(this, params.address);
    const service = __privateMethod(this, _BluetoothProcessor_instances, getService_fn).call(this, device, params.serviceUuid);
    const characteristic = __privateMethod(this, _BluetoothProcessor_instances, getCharacteristic_fn).call(this, service, params.characteristicUuid);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateCharacteristicOperationResponse", {
      characteristicId: characteristic.id,
      type: params.type,
      code: params.code,
      ...params.data && {
        data: btoa(String.fromCharCode(...params.data))
      }
    });
    return {};
  }
  async simulateDescriptor(params) {
    const device = __privateMethod(this, _BluetoothProcessor_instances, getDevice_fn).call(this, params.address);
    const service = __privateMethod(this, _BluetoothProcessor_instances, getService_fn).call(this, device, params.serviceUuid);
    const characteristic = __privateMethod(this, _BluetoothProcessor_instances, getCharacteristic_fn).call(this, service, params.characteristicUuid);
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    switch (params.type) {
      case "add": {
        if (characteristic.descriptors.has(params.descriptorUuid)) {
          throw new InvalidArgumentException(`Descriptor with UUID ${params.descriptorUuid} already exists`);
        }
        const response = await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.addDescriptor", {
          characteristicId: characteristic.id,
          descriptorUuid: params.descriptorUuid
        });
        const descriptor = new BluetoothDescriptor(response.descriptorId, params.descriptorUuid, characteristic);
        characteristic.descriptors.set(params.descriptorUuid, descriptor);
        __privateGet(this, _bluetoothDescriptors).set(descriptor.id, descriptor);
        return {};
      }
      case "remove": {
        const descriptor = __privateMethod(this, _BluetoothProcessor_instances, getDescriptor_fn).call(this, characteristic, params.descriptorUuid);
        await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.removeDescriptor", {
          descriptorId: descriptor.id
        });
        characteristic.descriptors.delete(params.descriptorUuid);
        __privateGet(this, _bluetoothDescriptors).delete(descriptor.id);
        return {};
      }
      default:
        throw new InvalidArgumentException(`Parameter "type" of ${params.type} is not supported`);
    }
  }
  async simulateDescriptorResponse(params) {
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    const device = __privateMethod(this, _BluetoothProcessor_instances, getDevice_fn).call(this, params.address);
    const service = __privateMethod(this, _BluetoothProcessor_instances, getService_fn).call(this, device, params.serviceUuid);
    const characteristic = __privateMethod(this, _BluetoothProcessor_instances, getCharacteristic_fn).call(this, service, params.characteristicUuid);
    const descriptor = __privateMethod(this, _BluetoothProcessor_instances, getDescriptor_fn).call(this, characteristic, params.descriptorUuid);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateDescriptorOperationResponse", {
      descriptorId: descriptor.id,
      type: params.type,
      code: params.code,
      ...params.data && {
        data: btoa(String.fromCharCode(...params.data))
      }
    });
    return {};
  }
  async simulateGattConnectionResponse(params) {
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateGATTOperationResponse", {
      address: params.address,
      type: "connection",
      code: params.code
    });
    return {};
  }
  async simulateGattDisconnection(params) {
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateGATTDisconnection", {
      address: params.address
    });
    return {};
  }
  async simulateService(params) {
    const device = __privateMethod(this, _BluetoothProcessor_instances, getDevice_fn).call(this, params.address);
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    switch (params.type) {
      case "add": {
        if (device.services.has(params.uuid)) {
          throw new InvalidArgumentException(`Service with UUID ${params.uuid} already exists`);
        }
        const response = await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.addService", {
          address: params.address,
          serviceUuid: params.uuid
        });
        device.services.set(params.uuid, new BluetoothService(response.serviceId, params.uuid, device));
        return {};
      }
      case "remove": {
        const service = __privateMethod(this, _BluetoothProcessor_instances, getService_fn).call(this, device, params.uuid);
        await context.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.removeService", {
          serviceId: service.id
        });
        device.services.delete(params.uuid);
        return {};
      }
      default:
        throw new InvalidArgumentException(`Parameter "type" of ${params.type} is not supported`);
    }
  }
  onCdpTargetCreated(cdpTarget) {
    cdpTarget.cdpClient.on("DeviceAccess.deviceRequestPrompted", (event) => {
      __privateGet(this, _eventManager4).registerEvent({
        type: "event",
        method: "bluetooth.requestDevicePromptUpdated",
        params: {
          context: cdpTarget.id,
          prompt: event.id,
          devices: event.devices
        }
      }, cdpTarget.id);
    });
    cdpTarget.browserCdpClient.on("BluetoothEmulation.gattOperationReceived", async (event) => {
      switch (event.type) {
        case "connection":
          __privateGet(this, _eventManager4).registerEvent({
            type: "event",
            method: "bluetooth.gattConnectionAttempted",
            params: {
              context: cdpTarget.id,
              address: event.address
            }
          }, cdpTarget.id);
          return;
        case "discovery":
          await cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateGATTOperationResponse", {
            address: event.address,
            type: "discovery",
            code: 0
          });
      }
    });
    cdpTarget.browserCdpClient.on("BluetoothEmulation.characteristicOperationReceived", (event) => {
      if (!__privateGet(this, _bluetoothCharacteristics).has(event.characteristicId)) {
        return;
      }
      let type;
      if (event.type === "write") {
        if (event.writeType === "write-default-deprecated") {
          return;
        }
        type = event.writeType;
      } else {
        type = event.type;
      }
      const characteristic = __privateGet(this, _bluetoothCharacteristics).get(event.characteristicId);
      __privateGet(this, _eventManager4).registerEvent({
        type: "event",
        method: "bluetooth.characteristicEventGenerated",
        params: {
          context: cdpTarget.id,
          address: characteristic.service.device.address,
          serviceUuid: characteristic.service.uuid,
          characteristicUuid: characteristic.uuid,
          type,
          ...event.data && {
            data: Array.from(atob(event.data), (c) => c.charCodeAt(0))
          }
        }
      }, cdpTarget.id);
    });
    cdpTarget.browserCdpClient.on("BluetoothEmulation.descriptorOperationReceived", (event) => {
      if (!__privateGet(this, _bluetoothDescriptors).has(event.descriptorId)) {
        return;
      }
      const descriptor = __privateGet(this, _bluetoothDescriptors).get(event.descriptorId);
      __privateGet(this, _eventManager4).registerEvent({
        type: "event",
        method: "bluetooth.descriptorEventGenerated",
        params: {
          context: cdpTarget.id,
          address: descriptor.characteristic.service.device.address,
          serviceUuid: descriptor.characteristic.service.uuid,
          characteristicUuid: descriptor.characteristic.uuid,
          descriptorUuid: descriptor.uuid,
          type: event.type,
          ...event.data && {
            data: Array.from(atob(event.data), (c) => c.charCodeAt(0))
          }
        }
      }, cdpTarget.id);
    });
  }
  async handleRequestDevicePrompt(params) {
    const context = __privateGet(this, _browsingContextStorage10).getContext(params.context);
    if (params.accept) {
      await context.cdpTarget.cdpClient.sendCommand("DeviceAccess.selectPrompt", {
        id: params.prompt,
        deviceId: params.device
      });
    } else {
      await context.cdpTarget.cdpClient.sendCommand("DeviceAccess.cancelPrompt", {
        id: params.prompt
      });
    }
    return {};
  }
}
_eventManager4 = new WeakMap();
_browsingContextStorage10 = new WeakMap();
_bluetoothDevices = new WeakMap();
_bluetoothCharacteristics = new WeakMap();
_bluetoothDescriptors = new WeakMap();
_BluetoothProcessor_instances = new WeakSet();
getDevice_fn = function(address) {
  const device = __privateGet(this, _bluetoothDevices).get(address);
  if (!device) {
    throw new InvalidArgumentException(`Bluetooth device with address ${address} does not exist`);
  }
  return device;
};
getService_fn = function(device, serviceUuid) {
  const service = device.services.get(serviceUuid);
  if (!service) {
    throw new InvalidArgumentException(`Service with UUID ${serviceUuid} on device ${device.address} does not exist`);
  }
  return service;
};
getCharacteristic_fn = function(service, characteristicUuid) {
  const characteristic = service.characteristics.get(characteristicUuid);
  if (!characteristic) {
    throw new InvalidArgumentException(`Characteristic with UUID ${characteristicUuid} does not exist for service ${service.uuid} on device ${service.device.address}`);
  }
  return characteristic;
};
getDescriptor_fn = function(characteristic, descriptorUuid) {
  const descriptor = characteristic.descriptors.get(descriptorUuid);
  if (!descriptor) {
    throw new InvalidArgumentException(`Descriptor with UUID ${descriptorUuid} does not exist for characteristic ${characteristic.uuid} on service ${characteristic.service.uuid} on device ${characteristic.service.device.address}`);
  }
  return descriptor;
};
class ContextConfig {
  constructor() {
    // keep-sorted start block=yes
    __publicField(this, "acceptInsecureCerts");
    __publicField(this, "clientHints");
    __publicField(this, "devicePixelRatio");
    __publicField(this, "digitalCredentialsBehavior");
    __publicField(this, "disableNetworkDurableMessages");
    __publicField(this, "downloadBehavior");
    __publicField(this, "emulatedNetworkConditions");
    // Extra headers are kept in CDP format.
    __publicField(this, "extraHeaders");
    __publicField(this, "geolocation");
    __publicField(this, "locale");
    __publicField(this, "maxTouchPoints");
    __publicField(this, "prerenderingDisabled");
    __publicField(this, "screenArea");
    __publicField(this, "screenOrientation");
    __publicField(this, "scriptingEnabled");
    __publicField(this, "scrollbarType");
    // Timezone is kept in CDP format with GMT prefix for offset values.
    __publicField(this, "timezone");
    __publicField(this, "userAgent");
    __publicField(this, "userPromptHandler");
    __publicField(this, "viewport");
  }
  // keep-sorted end
  /**
   * Merges multiple `ContextConfig` objects. The configs are merged in the order they are
   * provided. For each property, the value from the last config that defines it will be
   * used. The final result will not contain any `undefined` or `null` properties.
   * `undefined` values are ignored. `null` values remove the already set value.
   */
  static merge(...configs) {
    const result = new ContextConfig();
    for (const config of configs) {
      if (!config) {
        continue;
      }
      for (const key in config) {
        const value = config[key];
        if (value === null) {
          delete result[key];
        } else if (value !== void 0) {
          result[key] = value;
        }
      }
    }
    return result;
  }
}
class ContextConfigStorage {
  constructor() {
    __privateAdd(this, _ContextConfigStorage_instances);
    __privateAdd(this, _global, new ContextConfig());
    __privateAdd(this, _userContextConfigs, /* @__PURE__ */ new Map());
    __privateAdd(this, _browsingContextConfigs, /* @__PURE__ */ new Map());
  }
  /**
   * Updates the global configuration. Properties with `undefined` values in the
   * provided `config` are ignored.
   */
  updateGlobalConfig(config) {
    __privateSet(this, _global, ContextConfig.merge(__privateGet(this, _global), config));
  }
  /**
   * Updates the configuration for a specific browsing context. Properties with
   * `undefined` values in the provided `config` are ignored.
   */
  updateBrowsingContextConfig(browsingContextId, config) {
    __privateGet(this, _browsingContextConfigs).set(browsingContextId, ContextConfig.merge(__privateGet(this, _browsingContextConfigs).get(browsingContextId), config));
  }
  /**
   * Updates the configuration for a specific user context. Properties with
   * `undefined` values in the provided `config` are ignored.
   */
  updateUserContextConfig(userContext, config) {
    __privateGet(this, _userContextConfigs).set(userContext, ContextConfig.merge(__privateGet(this, _userContextConfigs).get(userContext), config));
  }
  /**
   * Returns the current global configuration.
   */
  getGlobalConfig() {
    return __privateGet(this, _global);
  }
  /**
   * Calculates the active configuration by merging global, user context, and
   * browsing context settings.
   */
  getActiveConfig(topLevelBrowsingContextId, userContext) {
    let result = ContextConfig.merge(__privateGet(this, _global), __privateGet(this, _userContextConfigs).get(userContext));
    if (topLevelBrowsingContextId !== void 0) {
      result = ContextConfig.merge(result, __privateGet(this, _browsingContextConfigs).get(topLevelBrowsingContextId));
    }
    const extraHeaders = __privateMethod(this, _ContextConfigStorage_instances, getExtraHeaders_fn).call(this, topLevelBrowsingContextId, userContext);
    result.extraHeaders = Object.keys(extraHeaders).length > 0 ? extraHeaders : void 0;
    return result;
  }
}
_global = new WeakMap();
_userContextConfigs = new WeakMap();
_browsingContextConfigs = new WeakMap();
_ContextConfigStorage_instances = new WeakSet();
/**
 * Extra headers is a special case. The headers from the different levels have to be
 * merged instead of being overridden.
 */
getExtraHeaders_fn = function(topLevelBrowsingContextId, userContext) {
  var _a3, _b2;
  const globalHeaders = __privateGet(this, _global).extraHeaders ?? {};
  const userContextHeaders = ((_a3 = __privateGet(this, _userContextConfigs).get(userContext)) == null ? void 0 : _a3.extraHeaders) ?? {};
  const browsingContextHeaders = topLevelBrowsingContextId === void 0 ? {} : ((_b2 = __privateGet(this, _browsingContextConfigs).get(topLevelBrowsingContextId)) == null ? void 0 : _b2.extraHeaders) ?? {};
  return { ...globalHeaders, ...userContextHeaders, ...browsingContextHeaders };
};
class UserContextStorage {
  constructor(browserClient) {
    __privateAdd(this, _browserClient);
    __privateSet(this, _browserClient, browserClient);
  }
  async getUserContexts() {
    const result = await __privateGet(this, _browserClient).sendCommand("Target.getBrowserContexts");
    return [
      {
        userContext: "default"
      },
      ...result.browserContextIds.map((id) => {
        return {
          userContext: id
        };
      })
    ];
  }
  async verifyUserContextIdList(userContextIds) {
    const foundContexts = /* @__PURE__ */ new Set();
    if (!userContextIds.length) {
      return foundContexts;
    }
    const userContexts = await this.getUserContexts();
    const knownUserContextIds = new Set(userContexts.map((userContext) => userContext.userContext));
    for (const userContextId of userContextIds) {
      if (!knownUserContextIds.has(userContextId)) {
        throw new NoSuchUserContextException(`User context ${userContextId} not found`);
      }
      foundContexts.add(userContextId);
    }
    return foundContexts;
  }
}
_browserClient = new WeakMap();
_a2 = Symbol.toStringTag;
class Deferred {
  constructor() {
    __privateAdd(this, _isFinished, false);
    __privateAdd(this, _promise);
    __privateAdd(this, _result);
    __privateAdd(this, _resolve);
    __privateAdd(this, _reject);
    __publicField(this, _a2, "Promise");
    __privateSet(this, _promise, new Promise((resolve, reject) => {
      __privateSet(this, _resolve, resolve);
      __privateSet(this, _reject, reject);
    }));
    __privateGet(this, _promise).catch((_error) => {
    });
  }
  get isFinished() {
    return __privateGet(this, _isFinished);
  }
  get result() {
    if (!__privateGet(this, _isFinished)) {
      throw new Error("Deferred is not finished yet");
    }
    return __privateGet(this, _result);
  }
  then(onFulfilled, onRejected) {
    return __privateGet(this, _promise).then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return __privateGet(this, _promise).catch(onRejected);
  }
  resolve(value) {
    __privateSet(this, _result, value);
    if (!__privateGet(this, _isFinished)) {
      __privateSet(this, _isFinished, true);
      __privateGet(this, _resolve).call(this, value);
    }
  }
  reject(reason) {
    if (!__privateGet(this, _isFinished)) {
      __privateSet(this, _isFinished, true);
      __privateGet(this, _reject).call(this, reason);
    }
  }
  finally(onFinally) {
    return __privateGet(this, _promise).finally(onFinally);
  }
}
_isFinished = new WeakMap();
_promise = new WeakMap();
_result = new WeakMap();
_resolve = new WeakMap();
_reject = new WeakMap();
function getTimestamp() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function inchesFromCm(cm) {
  return cm / 2.54;
}
const SHARED_ID_DIVIDER = "_element_";
function getSharedId(frameId, documentId, backendNodeId) {
  return `f.${frameId}.d.${documentId}.e.${backendNodeId}`;
}
function parseLegacySharedId(sharedId) {
  const match = sharedId.match(new RegExp(`(.*)${SHARED_ID_DIVIDER}(.*)`));
  if (!match) {
    return null;
  }
  const documentId = match[1];
  const elementId = match[2];
  if (documentId === void 0 || elementId === void 0) {
    return null;
  }
  const backendNodeId = parseInt(elementId ?? "");
  if (isNaN(backendNodeId)) {
    return null;
  }
  return {
    documentId,
    backendNodeId
  };
}
function parseSharedId(sharedId) {
  const legacyFormattedSharedId = parseLegacySharedId(sharedId);
  if (legacyFormattedSharedId !== null) {
    return { ...legacyFormattedSharedId, frameId: void 0 };
  }
  const match = sharedId.match(/f\.(.*)\.d\.(.*)\.e\.([0-9]*)/);
  if (!match) {
    return null;
  }
  const frameId = match[1];
  const documentId = match[2];
  const elementId = match[3];
  if (frameId === void 0 || documentId === void 0 || elementId === void 0) {
    return null;
  }
  const backendNodeId = parseInt(elementId ?? "");
  if (isNaN(backendNodeId)) {
    return null;
  }
  return {
    frameId,
    documentId,
    backendNodeId
  };
}
let Realm$1 = (_b = class {
  constructor(cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage) {
    __privateAdd(this, _Realm_instances);
    __privateAdd(this, _cdpClient);
    __privateAdd(this, _eventManager5);
    __privateAdd(this, _executionContextId);
    __privateAdd(this, _logger6);
    __privateAdd(this, _origin);
    __privateAdd(this, _realmId);
    __publicField(this, "realmStorage");
    __privateSet(this, _cdpClient, cdpClient);
    __privateSet(this, _eventManager5, eventManager);
    __privateSet(this, _executionContextId, executionContextId);
    __privateSet(this, _logger6, logger);
    __privateSet(this, _origin, origin);
    __privateSet(this, _realmId, realmId);
    this.realmStorage = realmStorage;
    this.realmStorage.addRealm(this);
  }
  cdpToBidiValue(cdpValue, resultOwnership) {
    const bidiValue = this.serializeForBiDi(cdpValue.result.deepSerializedValue, /* @__PURE__ */ new Map());
    if (cdpValue.result.objectId) {
      const objectId = cdpValue.result.objectId;
      if (resultOwnership === "root") {
        bidiValue.handle = objectId;
        this.realmStorage.knownHandlesToRealmMap.set(objectId, this.realmId);
      } else {
        void __privateMethod(this, _Realm_instances, releaseObject_fn).call(this, objectId).catch((error) => {
          var _a3, _b2;
          return (_b2 = (_a3 = __privateGet(this, _logger6)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(error);
        });
      }
    }
    return bidiValue;
  }
  isHidden() {
    return false;
  }
  /**
   * Relies on the CDP to implement proper BiDi serialization, except:
   * * CDP integer property `backendNodeId` is replaced with `sharedId` of
   * `{documentId}_element_{backendNodeId}`;
   * * CDP integer property `weakLocalObjectReference` is replaced with UUID `internalId`
   * using unique-per serialization `internalIdMap`.
   * * CDP type `platformobject` is replaced with `object`.
   * @param deepSerializedValue - CDP value to be converted to BiDi.
   * @param internalIdMap - Map from CDP integer `weakLocalObjectReference` to BiDi UUID
   * `internalId`.
   */
  serializeForBiDi(deepSerializedValue, internalIdMap) {
    if (Object.hasOwn(deepSerializedValue, "weakLocalObjectReference")) {
      const weakLocalObjectReference = deepSerializedValue.weakLocalObjectReference;
      if (!internalIdMap.has(weakLocalObjectReference)) {
        internalIdMap.set(weakLocalObjectReference, uuidv4());
      }
      deepSerializedValue.internalId = internalIdMap.get(weakLocalObjectReference);
      delete deepSerializedValue["weakLocalObjectReference"];
    }
    if (deepSerializedValue.type === "node" && deepSerializedValue.value && Object.hasOwn(deepSerializedValue.value, "frameId")) {
      delete deepSerializedValue.value["frameId"];
    }
    if (deepSerializedValue.type === "platformobject") {
      return { type: "object" };
    }
    const bidiValue = deepSerializedValue.value;
    if (bidiValue === void 0) {
      return deepSerializedValue;
    }
    if (["array", "set", "htmlcollection", "nodelist"].includes(deepSerializedValue.type)) {
      for (const i in bidiValue) {
        bidiValue[i] = this.serializeForBiDi(bidiValue[i], internalIdMap);
      }
    }
    if (["object", "map"].includes(deepSerializedValue.type)) {
      for (const i in bidiValue) {
        bidiValue[i] = [
          this.serializeForBiDi(bidiValue[i][0], internalIdMap),
          this.serializeForBiDi(bidiValue[i][1], internalIdMap)
        ];
      }
    }
    return deepSerializedValue;
  }
  get realmId() {
    return __privateGet(this, _realmId);
  }
  get executionContextId() {
    return __privateGet(this, _executionContextId);
  }
  get origin() {
    return __privateGet(this, _origin);
  }
  get source() {
    return {
      realm: this.realmId
    };
  }
  get cdpClient() {
    return __privateGet(this, _cdpClient);
  }
  get baseInfo() {
    return {
      realm: this.realmId,
      origin: this.origin
    };
  }
  async evaluate(expression, awaitPromise, resultOwnership = "none", serializationOptions = {}, userActivation = false, includeCommandLineApi = false) {
    var _a3;
    const cdpEvaluateResult = await this.cdpClient.sendCommand("Runtime.evaluate", {
      contextId: this.executionContextId,
      expression,
      awaitPromise,
      serializationOptions: __privateMethod(_a3 = _b, _Realm_static, getSerializationOptions_fn).call(_a3, "deep", serializationOptions),
      userGesture: userActivation,
      includeCommandLineAPI: includeCommandLineApi
    });
    if (cdpEvaluateResult.exceptionDetails) {
      return await __privateMethod(this, _Realm_instances, getExceptionResult_fn).call(this, cdpEvaluateResult.exceptionDetails, 0, resultOwnership);
    }
    return {
      realm: this.realmId,
      result: this.cdpToBidiValue(cdpEvaluateResult, resultOwnership),
      type: "success"
    };
  }
  initialize() {
    if (!this.isHidden()) {
      __privateMethod(this, _Realm_instances, registerEvent_fn).call(this, {
        type: "event",
        method: Script.EventNames.RealmCreated,
        params: this.realmInfo
      });
    }
  }
  /**
   * Serializes a given CDP object into BiDi, keeping references in the
   * target's `globalThis`.
   */
  async serializeCdpObject(cdpRemoteObject, resultOwnership) {
    var _a3;
    const argument = __privateMethod(_a3 = _b, _Realm_static, cdpRemoteObjectToCallArgument_fn).call(_a3, cdpRemoteObject);
    const cdpValue = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
      functionDeclaration: String((remoteObject) => remoteObject),
      awaitPromise: false,
      arguments: [argument],
      serializationOptions: {
        serialization: "deep"
      },
      executionContextId: this.executionContextId
    });
    return this.cdpToBidiValue(cdpValue, resultOwnership);
  }
  /**
   * Gets the string representation of an object. This is equivalent to
   * calling `toString()` on the object value.
   */
  async stringifyObject(cdpRemoteObject) {
    const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
      functionDeclaration: String((remoteObject) => String(remoteObject)),
      awaitPromise: false,
      arguments: [cdpRemoteObject],
      returnByValue: true,
      executionContextId: this.executionContextId
    });
    return result.value;
  }
  async callFunction(functionDeclaration, awaitPromise, thisLocalValue = {
    type: "undefined"
  }, argumentsLocalValues = [], resultOwnership = "none", serializationOptions = {}, userActivation = false) {
    var _a3;
    const callFunctionAndSerializeScript = `(...args) => {
      function callFunction(f, args) {
        const deserializedThis = args.shift();
        const deserializedArgs = args;
        return f.apply(deserializedThis, deserializedArgs);
      }
      return callFunction((
        ${functionDeclaration}
      ), args);
    }`;
    const thisAndArgumentsList = [
      await this.deserializeForCdp(thisLocalValue),
      ...await Promise.all(argumentsLocalValues.map(async (argumentLocalValue) => await this.deserializeForCdp(argumentLocalValue)))
    ];
    let cdpCallFunctionResult;
    try {
      cdpCallFunctionResult = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
        functionDeclaration: callFunctionAndSerializeScript,
        awaitPromise,
        arguments: thisAndArgumentsList,
        serializationOptions: __privateMethod(_a3 = _b, _Realm_static, getSerializationOptions_fn).call(_a3, "deep", serializationOptions),
        executionContextId: this.executionContextId,
        userGesture: userActivation
      });
    } catch (error) {
      if (error.code === -32e3 && [
        "Could not find object with given id",
        "Argument should belong to the same JavaScript world as target object",
        "Invalid remote object id"
      ].includes(error.message)) {
        throw new NoSuchHandleException("Handle was not found.");
      }
      throw error;
    }
    if (cdpCallFunctionResult.exceptionDetails) {
      return await __privateMethod(this, _Realm_instances, getExceptionResult_fn).call(this, cdpCallFunctionResult.exceptionDetails, 1, resultOwnership);
    }
    return {
      type: "success",
      result: this.cdpToBidiValue(cdpCallFunctionResult, resultOwnership),
      realm: this.realmId
    };
  }
  async deserializeForCdp(localValue) {
    if ("handle" in localValue && localValue.handle) {
      return { objectId: localValue.handle };
    } else if ("handle" in localValue || "sharedId" in localValue) {
      throw new NoSuchHandleException("Handle was not found.");
    }
    switch (localValue.type) {
      case "undefined":
        return { unserializableValue: "undefined" };
      case "null":
        return { unserializableValue: "null" };
      case "string":
        return { value: localValue.value };
      case "number":
        if (localValue.value === "NaN") {
          return { unserializableValue: "NaN" };
        } else if (localValue.value === "-0") {
          return { unserializableValue: "-0" };
        } else if (localValue.value === "Infinity") {
          return { unserializableValue: "Infinity" };
        } else if (localValue.value === "-Infinity") {
          return { unserializableValue: "-Infinity" };
        }
        return {
          value: localValue.value
        };
      case "boolean":
        return { value: Boolean(localValue.value) };
      case "bigint":
        return {
          unserializableValue: `BigInt(${JSON.stringify(localValue.value)})`
        };
      case "date":
        return {
          unserializableValue: `new Date(Date.parse(${JSON.stringify(localValue.value)}))`
        };
      case "regexp":
        return {
          unserializableValue: `new RegExp(${JSON.stringify(localValue.value.pattern)}, ${JSON.stringify(localValue.value.flags)})`
        };
      case "map": {
        const keyValueArray = await __privateMethod(this, _Realm_instances, flattenKeyValuePairs_fn).call(this, localValue.value);
        const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...args) => {
            const result2 = /* @__PURE__ */ new Map();
            for (let i = 0; i < args.length; i += 2) {
              result2.set(args[i], args[i + 1]);
            }
            return result2;
          }),
          awaitPromise: false,
          arguments: keyValueArray,
          returnByValue: false,
          executionContextId: this.executionContextId
        });
        return { objectId: result.objectId };
      }
      case "object": {
        const keyValueArray = await __privateMethod(this, _Realm_instances, flattenKeyValuePairs_fn).call(this, localValue.value);
        const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...args) => {
            const result2 = {};
            for (let i = 0; i < args.length; i += 2) {
              const key = args[i];
              result2[key] = args[i + 1];
            }
            return result2;
          }),
          awaitPromise: false,
          arguments: keyValueArray,
          returnByValue: false,
          executionContextId: this.executionContextId
        });
        return { objectId: result.objectId };
      }
      case "array": {
        const args = await __privateMethod(this, _Realm_instances, flattenValueList_fn).call(this, localValue.value);
        const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...args2) => args2),
          awaitPromise: false,
          arguments: args,
          returnByValue: false,
          executionContextId: this.executionContextId
        });
        return { objectId: result.objectId };
      }
      case "set": {
        const args = await __privateMethod(this, _Realm_instances, flattenValueList_fn).call(this, localValue.value);
        const { result } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...args2) => new Set(args2)),
          awaitPromise: false,
          arguments: args,
          returnByValue: false,
          executionContextId: this.executionContextId
        });
        return { objectId: result.objectId };
      }
      case "channel": {
        const channelProxy = new ChannelProxy(localValue.value, __privateGet(this, _logger6));
        const channelProxySendMessageHandle = await channelProxy.init(this, __privateGet(this, _eventManager5));
        return { objectId: channelProxySendMessageHandle };
      }
    }
    throw new Error(`Value ${JSON.stringify(localValue)} is not deserializable.`);
  }
  async disown(handle) {
    if (this.realmStorage.knownHandlesToRealmMap.get(handle) !== this.realmId) {
      return;
    }
    await __privateMethod(this, _Realm_instances, releaseObject_fn).call(this, handle);
    this.realmStorage.knownHandlesToRealmMap.delete(handle);
  }
  dispose() {
    if (!this.isHidden()) {
      __privateMethod(this, _Realm_instances, registerEvent_fn).call(this, {
        type: "event",
        method: Script.EventNames.RealmDestroyed,
        params: {
          realm: this.realmId
        }
      });
    }
  }
}, _cdpClient = new WeakMap(), _eventManager5 = new WeakMap(), _executionContextId = new WeakMap(), _logger6 = new WeakMap(), _origin = new WeakMap(), _realmId = new WeakMap(), _Realm_instances = new WeakSet(), registerEvent_fn = function(event) {
  if (this.associatedBrowsingContexts.length === 0) {
    __privateGet(this, _eventManager5).registerGlobalEvent(event);
  } else {
    for (const browsingContext of this.associatedBrowsingContexts) {
      __privateGet(this, _eventManager5).registerEvent(event, browsingContext.id);
    }
  }
}, _Realm_static = new WeakSet(), cdpRemoteObjectToCallArgument_fn = function(cdpRemoteObject) {
  if (cdpRemoteObject.objectId !== void 0) {
    return { objectId: cdpRemoteObject.objectId };
  }
  if (cdpRemoteObject.unserializableValue !== void 0) {
    return { unserializableValue: cdpRemoteObject.unserializableValue };
  }
  return { value: cdpRemoteObject.value };
}, flattenKeyValuePairs_fn = async function(mappingLocalValue) {
  const keyValueArray = await Promise.all(mappingLocalValue.map(async ([key, value]) => {
    let keyArg;
    if (typeof key === "string") {
      keyArg = { value: key };
    } else {
      keyArg = await this.deserializeForCdp(key);
    }
    const valueArg = await this.deserializeForCdp(value);
    return [keyArg, valueArg];
  }));
  return keyValueArray.flat();
}, flattenValueList_fn = async function(listLocalValue) {
  return await Promise.all(listLocalValue.map((localValue) => this.deserializeForCdp(localValue)));
}, serializeCdpExceptionDetails_fn = async function(cdpExceptionDetails, lineOffset, resultOwnership) {
  var _a3;
  const callFrames = ((_a3 = cdpExceptionDetails.stackTrace) == null ? void 0 : _a3.callFrames.map((frame) => ({
    url: frame.url,
    functionName: frame.functionName,
    lineNumber: frame.lineNumber - lineOffset,
    columnNumber: frame.columnNumber
  }))) ?? [];
  const exception = cdpExceptionDetails.exception;
  return {
    exception: await this.serializeCdpObject(exception, resultOwnership),
    columnNumber: cdpExceptionDetails.columnNumber,
    lineNumber: cdpExceptionDetails.lineNumber - lineOffset,
    stackTrace: {
      callFrames
    },
    text: await this.stringifyObject(exception) || cdpExceptionDetails.text
  };
}, getExceptionResult_fn = async function(exceptionDetails, lineOffset, resultOwnership) {
  return {
    exceptionDetails: await __privateMethod(this, _Realm_instances, serializeCdpExceptionDetails_fn).call(this, exceptionDetails, lineOffset, resultOwnership),
    realm: this.realmId,
    type: "exception"
  };
}, getSerializationOptions_fn = function(serialization, serializationOptions) {
  var _a3, _b2;
  return {
    serialization,
    additionalParameters: __privateMethod(_a3 = _b, _Realm_static, getAdditionalSerializationParameters_fn).call(_a3, serializationOptions),
    ...__privateMethod(_b2 = _b, _Realm_static, getMaxObjectDepth_fn).call(_b2, serializationOptions)
  };
}, getAdditionalSerializationParameters_fn = function(serializationOptions) {
  const additionalParameters = {};
  if (serializationOptions.maxDomDepth !== void 0) {
    additionalParameters["maxNodeDepth"] = serializationOptions.maxDomDepth === null ? 1e3 : serializationOptions.maxDomDepth;
  }
  if (serializationOptions.includeShadowTree !== void 0) {
    additionalParameters["includeShadowTree"] = serializationOptions.includeShadowTree;
  }
  return additionalParameters;
}, getMaxObjectDepth_fn = function(serializationOptions) {
  return serializationOptions.maxObjectDepth === void 0 || serializationOptions.maxObjectDepth === null ? {} : { maxDepth: serializationOptions.maxObjectDepth };
}, releaseObject_fn = async function(handle) {
  try {
    await this.cdpClient.sendCommand("Runtime.releaseObject", {
      objectId: handle
    });
  } catch (error) {
    if (!(error.code === -32e3 && error.message === "Invalid remote object id")) {
      throw error;
    }
  }
}, __privateAdd(_b, _Realm_static), _b);
let WindowRealm$1 = (_c = class extends Realm$1 {
  constructor(browsingContextId, browsingContextStorage, cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage, sandbox) {
    super(cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage);
    __privateAdd(this, _WindowRealm_instances);
    __privateAdd(this, _browsingContextId);
    __privateAdd(this, _browsingContextStorage11);
    __publicField(this, "sandbox");
    __privateSet(this, _browsingContextId, browsingContextId);
    __privateSet(this, _browsingContextStorage11, browsingContextStorage);
    this.sandbox = sandbox;
    this.initialize();
  }
  get browsingContext() {
    return __privateGet(this, _browsingContextStorage11).getContext(__privateGet(this, _browsingContextId));
  }
  /**
   * Do not expose to user hidden realms.
   */
  isHidden() {
    return this.realmStorage.hiddenSandboxes.has(this.sandbox);
  }
  get associatedBrowsingContexts() {
    return [this.browsingContext];
  }
  get realmType() {
    return "window";
  }
  get realmInfo() {
    return {
      ...this.baseInfo,
      type: this.realmType,
      context: __privateGet(this, _browsingContextId),
      sandbox: this.sandbox
    };
  }
  get source() {
    return {
      realm: this.realmId,
      context: this.browsingContext.id
    };
  }
  serializeForBiDi(deepSerializedValue, internalIdMap) {
    const bidiValue = deepSerializedValue.value;
    if (deepSerializedValue.type === "node" && bidiValue !== void 0) {
      if (Object.hasOwn(bidiValue, "backendNodeId")) {
        let navigableId = this.browsingContext.navigableId ?? "UNKNOWN";
        if (Object.hasOwn(bidiValue, "loaderId")) {
          navigableId = bidiValue.loaderId;
          delete bidiValue["loaderId"];
        }
        deepSerializedValue.sharedId = getSharedId(__privateMethod(this, _WindowRealm_instances, getBrowsingContextId_fn).call(this, navigableId), navigableId, bidiValue.backendNodeId);
        delete bidiValue["backendNodeId"];
      }
      if (Object.hasOwn(bidiValue, "children")) {
        for (const i in bidiValue.children) {
          bidiValue.children[i] = this.serializeForBiDi(bidiValue.children[i], internalIdMap);
        }
      }
      if (Object.hasOwn(bidiValue, "shadowRoot") && bidiValue.shadowRoot !== null) {
        bidiValue.shadowRoot = this.serializeForBiDi(bidiValue.shadowRoot, internalIdMap);
      }
      if (bidiValue.namespaceURI === "") {
        bidiValue.namespaceURI = null;
      }
    }
    return super.serializeForBiDi(deepSerializedValue, internalIdMap);
  }
  async deserializeForCdp(localValue) {
    if ("sharedId" in localValue && localValue.sharedId) {
      const parsedSharedId = parseSharedId(localValue.sharedId);
      if (parsedSharedId === null) {
        throw new NoSuchNodeException(`SharedId "${localValue.sharedId}" was not found.`);
      }
      const { documentId, backendNodeId } = parsedSharedId;
      if (this.browsingContext.navigableId !== documentId) {
        throw new NoSuchNodeException(`SharedId "${localValue.sharedId}" belongs to different document. Current document is ${this.browsingContext.navigableId}.`);
      }
      try {
        const { object } = await this.cdpClient.sendCommand("DOM.resolveNode", {
          backendNodeId,
          executionContextId: this.executionContextId
        });
        return { objectId: object.objectId };
      } catch (error) {
        if (error.code === -32e3 && error.message === "No node with given id found") {
          throw new NoSuchNodeException(`SharedId "${localValue.sharedId}" was not found.`);
        }
        throw new UnknownErrorException(error.message, error.stack);
      }
    }
    return await super.deserializeForCdp(localValue);
  }
  async evaluate(expression, awaitPromise, resultOwnership, serializationOptions, userActivation, includeCommandLineApi) {
    await __privateGet(this, _browsingContextStorage11).getContext(__privateGet(this, _browsingContextId)).targetUnblockedOrThrow();
    return await super.evaluate(expression, awaitPromise, resultOwnership, serializationOptions, userActivation, includeCommandLineApi);
  }
  async callFunction(functionDeclaration, awaitPromise, thisLocalValue, argumentsLocalValues, resultOwnership, serializationOptions, userActivation) {
    await __privateGet(this, _browsingContextStorage11).getContext(__privateGet(this, _browsingContextId)).targetUnblockedOrThrow();
    return await super.callFunction(functionDeclaration, awaitPromise, thisLocalValue, argumentsLocalValues, resultOwnership, serializationOptions, userActivation);
  }
}, _browsingContextId = new WeakMap(), _browsingContextStorage11 = new WeakMap(), _WindowRealm_instances = new WeakSet(), getBrowsingContextId_fn = function(navigableId) {
  const maybeBrowsingContext = __privateGet(this, _browsingContextStorage11).getAllContexts().find((context) => context.navigableId === navigableId);
  return (maybeBrowsingContext == null ? void 0 : maybeBrowsingContext.id) ?? "UNKNOWN";
}, _c);
function urlMatchesAboutBlank(url) {
  if (url === "") {
    return true;
  }
  try {
    const parsedUrl = new URL(url);
    const schema = parsedUrl.protocol.replace(/:$/, "");
    return schema.toLowerCase() === "about" && parsedUrl.pathname.toLowerCase() === "blank" && parsedUrl.username === "" && parsedUrl.password === "" && parsedUrl.host === "";
  } catch (err) {
    if (err instanceof TypeError) {
      return false;
    }
    throw err;
  }
}
class NavigationResult {
  constructor(eventName, message) {
    __publicField(this, "eventName");
    __publicField(this, "message");
    this.eventName = eventName;
    this.message = message;
  }
}
class NavigationState {
  constructor(url, browsingContextId, isInitial, eventManager) {
    __privateAdd(this, _NavigationState_instances);
    __publicField(this, "navigationId", uuidv4());
    __privateAdd(this, _browsingContextId2);
    __privateAdd(this, _started, false);
    __privateAdd(this, _finished, new Deferred());
    __publicField(this, "url");
    __publicField(this, "loaderId");
    __privateAdd(this, _isInitial);
    __privateAdd(this, _eventManager6);
    __publicField(this, "committed", new Deferred());
    __publicField(this, "isFragmentNavigation");
    __privateSet(this, _browsingContextId2, browsingContextId);
    this.url = url;
    __privateSet(this, _isInitial, isInitial);
    __privateSet(this, _eventManager6, eventManager);
  }
  get finished() {
    return __privateGet(this, _finished);
  }
  navigationInfo() {
    return {
      context: __privateGet(this, _browsingContextId2),
      navigation: this.navigationId,
      timestamp: getTimestamp(),
      url: this.url
    };
  }
  start() {
    if (
      // Initial navigation should not be reported.
      !__privateGet(this, _isInitial) && // No need in reporting started navigation twice.
      !__privateGet(this, _started) && // No need for reporting fragment navigations. Step 13 vs step 16 of the spec:
      // https://html.spec.whatwg.org/#beginning-navigation:webdriver-bidi-navigation-started
      !this.isFragmentNavigation
    ) {
      __privateGet(this, _eventManager6).registerEvent({
        type: "event",
        method: BrowsingContext$1.EventNames.NavigationStarted,
        params: this.navigationInfo()
      }, __privateGet(this, _browsingContextId2));
    }
    __privateSet(this, _started, true);
  }
  frameNavigated() {
    this.committed.resolve();
    if (!__privateGet(this, _isInitial)) {
      __privateGet(this, _eventManager6).registerEvent({
        type: "event",
        method: BrowsingContext$1.EventNames.NavigationCommitted,
        params: this.navigationInfo()
      }, __privateGet(this, _browsingContextId2));
    }
  }
  fragmentNavigated() {
    this.committed.resolve();
    __privateMethod(this, _NavigationState_instances, finish_fn).call(this, new NavigationResult(
      "browsingContext.fragmentNavigated"
      /* NavigationEventName.FragmentNavigated */
    ));
  }
  load() {
    __privateMethod(this, _NavigationState_instances, finish_fn).call(this, new NavigationResult(
      "browsingContext.load"
      /* NavigationEventName.Load */
    ));
  }
  fail(message) {
    __privateMethod(this, _NavigationState_instances, finish_fn).call(this, new NavigationResult(this.committed.isFinished ? "browsingContext.navigationAborted" : "browsingContext.navigationFailed", message));
  }
}
_browsingContextId2 = new WeakMap();
_started = new WeakMap();
_finished = new WeakMap();
_isInitial = new WeakMap();
_eventManager6 = new WeakMap();
_NavigationState_instances = new WeakSet();
finish_fn = function(navigationResult) {
  __privateSet(this, _started, true);
  if (!__privateGet(this, _isInitial) && !__privateGet(this, _finished).isFinished && navigationResult.eventName !== "browsingContext.load") {
    __privateGet(this, _eventManager6).registerEvent({
      type: "event",
      method: navigationResult.eventName,
      params: this.navigationInfo()
    }, __privateGet(this, _browsingContextId2));
  }
  __privateGet(this, _finished).resolve(navigationResult);
};
const _NavigationTracker = class _NavigationTracker {
  constructor(url, browsingContextId, eventManager, logger) {
    __privateAdd(this, _NavigationTracker_instances);
    __privateAdd(this, _eventManager7);
    __privateAdd(this, _logger7);
    __privateAdd(this, _loaderIdToNavigationsMap, /* @__PURE__ */ new Map());
    __privateAdd(this, _browsingContextId3);
    /**
     * Last committed navigation is committed, but is not guaranteed to be finished, as it
     * can still wait for `load` or `DOMContentLoaded` events.
     */
    __privateAdd(this, _lastCommittedNavigation);
    /**
     * Pending navigation is a navigation that is started but not yet committed.
     */
    __privateAdd(this, _pendingNavigation);
    // Flags if the initial navigation to `about:blank` is in progress.
    __privateAdd(this, _isInitialNavigation, true);
    __privateSet(this, _browsingContextId3, browsingContextId);
    __privateSet(this, _eventManager7, eventManager);
    __privateSet(this, _logger7, logger);
    __privateSet(this, _isInitialNavigation, true);
    __privateSet(this, _lastCommittedNavigation, new NavigationState(url, browsingContextId, urlMatchesAboutBlank(url), __privateGet(this, _eventManager7)));
  }
  /**
   * Returns current started ongoing navigation. It can be either a started pending
   * navigation, or one is already navigated.
   */
  get currentNavigationId() {
    var _a3;
    if (((_a3 = __privateGet(this, _pendingNavigation)) == null ? void 0 : _a3.isFragmentNavigation) === false) {
      return __privateGet(this, _pendingNavigation).navigationId;
    }
    return __privateGet(this, _lastCommittedNavigation).navigationId;
  }
  /**
   * Flags if the current navigation relates to the initial to `about:blank` navigation.
   */
  get isInitialNavigation() {
    return __privateGet(this, _isInitialNavigation);
  }
  /**
   * Url of the last navigated navigation.
   */
  get url() {
    return __privateGet(this, _lastCommittedNavigation).url;
  }
  /**
   * Creates a pending navigation e.g. when navigation command is called. Required to
   * provide navigation id before the actual navigation is started. It will be used when
   * navigation started. Can be aborted, failed, fragment navigated, or became a current
   * navigation.
   */
  createPendingNavigation(url, canBeInitialNavigation = false) {
    var _a3, _b2, _c2;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2("createCommandNavigation");
    __privateSet(this, _isInitialNavigation, canBeInitialNavigation && __privateGet(this, _isInitialNavigation) && urlMatchesAboutBlank(url));
    (_c2 = __privateGet(this, _pendingNavigation)) == null ? void 0 : _c2.fail("navigation canceled by concurrent navigation");
    const navigation = new NavigationState(url, __privateGet(this, _browsingContextId3), __privateGet(this, _isInitialNavigation), __privateGet(this, _eventManager7));
    __privateSet(this, _pendingNavigation, navigation);
    return navigation;
  }
  dispose() {
    var _a3;
    (_a3 = __privateGet(this, _pendingNavigation)) == null ? void 0 : _a3.fail("navigation canceled by context disposal");
    __privateGet(this, _lastCommittedNavigation).fail("navigation canceled by context disposal");
  }
  // Update the current url.
  onTargetInfoChanged(url) {
    var _a3, _b2;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2(`onTargetInfoChanged ${url}`);
    __privateGet(this, _lastCommittedNavigation).url = url;
  }
  /**
   * @param {string} unreachableUrl indicated the navigation is actually failed.
   */
  frameNavigated(url, loaderId, unreachableUrl) {
    var _a3, _b2;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2(`frameNavigated ${url}`);
    if (unreachableUrl !== void 0) {
      const navigation2 = __privateGet(this, _loaderIdToNavigationsMap).get(loaderId) ?? __privateGet(this, _pendingNavigation) ?? this.createPendingNavigation(unreachableUrl, true);
      navigation2.url = unreachableUrl;
      navigation2.start();
      navigation2.fail("the requested url is unreachable");
      return;
    }
    const navigation = __privateMethod(this, _NavigationTracker_instances, getNavigationForFrameNavigated_fn).call(this, url, loaderId);
    if (navigation !== __privateGet(this, _lastCommittedNavigation)) {
      __privateGet(this, _lastCommittedNavigation).fail("navigation canceled by concurrent navigation");
    }
    navigation.url = url;
    navigation.loaderId = loaderId;
    __privateGet(this, _loaderIdToNavigationsMap).set(loaderId, navigation);
    navigation.start();
    navigation.frameNavigated();
    __privateSet(this, _lastCommittedNavigation, navigation);
    if (__privateGet(this, _pendingNavigation) === navigation) {
      __privateSet(this, _pendingNavigation, void 0);
    }
  }
  navigatedWithinDocument(url, navigationType) {
    var _a3, _b2, _c2;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2(`navigatedWithinDocument ${url}, ${navigationType}`);
    __privateGet(this, _lastCommittedNavigation).url = url;
    if (navigationType !== "fragment") {
      return;
    }
    const fragmentNavigation = ((_c2 = __privateGet(this, _pendingNavigation)) == null ? void 0 : _c2.isFragmentNavigation) === true ? __privateGet(this, _pendingNavigation) : new NavigationState(url, __privateGet(this, _browsingContextId3), false, __privateGet(this, _eventManager7));
    fragmentNavigation.fragmentNavigated();
    if (fragmentNavigation === __privateGet(this, _pendingNavigation)) {
      __privateSet(this, _pendingNavigation, void 0);
    }
  }
  /**
   * Required to mark navigation as fully complete.
   * TODO: navigation should be complete when it became the current one on
   * `Page.frameNavigated` or on navigating command finished with a new loader Id.
   */
  loadPageEvent(loaderId) {
    var _a3, _b2, _c2;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2("loadPageEvent");
    __privateSet(this, _isInitialNavigation, false);
    (_c2 = __privateGet(this, _loaderIdToNavigationsMap).get(loaderId)) == null ? void 0 : _c2.load();
  }
  /**
   * Fail navigation due to navigation command failed.
   */
  failNavigation(navigation, errorText) {
    var _a3, _b2;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2("failCommandNavigation");
    navigation.fail(errorText);
  }
  /**
   * Updates the navigation's `loaderId` and sets it as current one, if it is a
   * cross-document navigation.
   */
  navigationCommandFinished(navigation, loaderId) {
    var _a3, _b2;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2(`finishCommandNavigation ${navigation.navigationId}, ${loaderId}`);
    if (loaderId !== void 0) {
      navigation.loaderId = loaderId;
      __privateGet(this, _loaderIdToNavigationsMap).set(loaderId, navigation);
    }
    navigation.isFragmentNavigation = loaderId === void 0;
  }
  frameStartedNavigating(url, loaderId, navigationType) {
    var _a3, _b2, _c2, _d2, _e, _f, _g;
    (_b2 = (_a3 = __privateGet(this, _logger7)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2(`frameStartedNavigating ${url}, ${loaderId}`);
    if (__privateGet(this, _pendingNavigation) && ((_c2 = __privateGet(this, _pendingNavigation)) == null ? void 0 : _c2.loaderId) !== void 0 && ((_d2 = __privateGet(this, _pendingNavigation)) == null ? void 0 : _d2.loaderId) !== loaderId) {
      (_e = __privateGet(this, _pendingNavigation)) == null ? void 0 : _e.fail("navigation canceled by concurrent navigation");
      __privateSet(this, _pendingNavigation, void 0);
    }
    if (__privateGet(this, _loaderIdToNavigationsMap).has(loaderId)) {
      const existingNavigation = __privateGet(this, _loaderIdToNavigationsMap).get(loaderId);
      existingNavigation.isFragmentNavigation = __privateMethod(_f = _NavigationTracker, _NavigationTracker_static, isFragmentNavigation_fn).call(_f, navigationType);
      __privateSet(this, _pendingNavigation, existingNavigation);
      return;
    }
    const pendingNavigation = __privateGet(this, _pendingNavigation) ?? this.createPendingNavigation(url, true);
    __privateGet(this, _loaderIdToNavigationsMap).set(loaderId, pendingNavigation);
    pendingNavigation.isFragmentNavigation = __privateMethod(_g = _NavigationTracker, _NavigationTracker_static, isFragmentNavigation_fn).call(_g, navigationType);
    pendingNavigation.url = url;
    pendingNavigation.loaderId = loaderId;
    pendingNavigation.start();
  }
  /**
   * If there is a navigation with the loaderId equals to the network request id, it means
   * that the navigation failed.
   */
  networkLoadingFailed(loaderId, errorText) {
    var _a3;
    (_a3 = __privateGet(this, _loaderIdToNavigationsMap).get(loaderId)) == null ? void 0 : _a3.fail(errorText);
  }
};
_eventManager7 = new WeakMap();
_logger7 = new WeakMap();
_loaderIdToNavigationsMap = new WeakMap();
_browsingContextId3 = new WeakMap();
_lastCommittedNavigation = new WeakMap();
_pendingNavigation = new WeakMap();
_isInitialNavigation = new WeakMap();
_NavigationTracker_instances = new WeakSet();
getNavigationForFrameNavigated_fn = function(url, loaderId) {
  if (__privateGet(this, _loaderIdToNavigationsMap).has(loaderId)) {
    return __privateGet(this, _loaderIdToNavigationsMap).get(loaderId);
  }
  if (__privateGet(this, _pendingNavigation) !== void 0 && __privateGet(this, _pendingNavigation).loaderId === void 0) {
    return __privateGet(this, _pendingNavigation);
  }
  return this.createPendingNavigation(url, true);
};
_NavigationTracker_static = new WeakSet();
isFragmentNavigation_fn = function(navigationType) {
  return ["historySameDocument", "sameDocument"].includes(navigationType);
};
__privateAdd(_NavigationTracker, _NavigationTracker_static);
let NavigationTracker = _NavigationTracker;
var _a$5;
class BrowsingContextImpl {
  constructor(id, parentId, userContext, cdpTarget, eventManager, browsingContextStorage, realmStorage, configStorage, url, originalOpener, logger) {
    __privateAdd(this, _BrowsingContextImpl_instances);
    /** Direct children browsing contexts. */
    __privateAdd(this, _children, /* @__PURE__ */ new Set());
    /** The ID of this browsing context. */
    __privateAdd(this, _id3);
    __publicField(this, "userContext");
    // Used for running helper scripts.
    __privateAdd(this, _hiddenSandbox, uuidv4());
    __privateAdd(this, _downloadIdToUrlMap, /* @__PURE__ */ new Map());
    /**
     * The ID of the parent browsing context.
     * If null, this is a top-level context.
     */
    __privateAdd(this, _loaderId);
    __privateAdd(this, _parentId, null);
    __privateAdd(this, _originalOpener);
    __privateAdd(this, _lifecycle, {
      DOMContentLoaded: new Deferred(),
      load: new Deferred()
    });
    __privateAdd(this, _cdpTarget);
    __privateAdd(this, _defaultRealmDeferred, new Deferred());
    __privateAdd(this, _browsingContextStorage12);
    __privateAdd(this, _eventManager8);
    __privateAdd(this, _logger8);
    __privateAdd(this, _navigationTracker);
    __privateAdd(this, _realmStorage3);
    __privateAdd(this, _configStorage2);
    // Set when the user prompt is opened. Required to provide the type in closing event.
    __privateAdd(this, _lastUserPromptType);
    __privateSet(this, _cdpTarget, cdpTarget);
    __privateSet(this, _id3, id);
    __privateSet(this, _parentId, parentId);
    this.userContext = userContext;
    __privateSet(this, _eventManager8, eventManager);
    __privateSet(this, _browsingContextStorage12, browsingContextStorage);
    __privateSet(this, _realmStorage3, realmStorage);
    __privateSet(this, _configStorage2, configStorage);
    __privateSet(this, _logger8, logger);
    __privateSet(this, _originalOpener, originalOpener);
    __privateGet(this, _realmStorage3).hiddenSandboxes.add(__privateGet(this, _hiddenSandbox));
    __privateSet(this, _navigationTracker, new NavigationTracker(url, id, eventManager, logger));
  }
  static create(id, parentId, userContext, cdpTarget, eventManager, browsingContextStorage, realmStorage, configStorage, url, originalOpener, logger) {
    var _a3;
    const context = new _a$5(id, parentId, userContext, cdpTarget, eventManager, browsingContextStorage, realmStorage, configStorage, url, originalOpener, logger);
    __privateMethod(_a3 = context, _BrowsingContextImpl_instances, initListeners_fn).call(_a3);
    browsingContextStorage.addContext(context);
    if (!context.isTopLevelContext()) {
      context.parent.addChild(context.id);
    }
    eventManager.registerPromiseEvent(context.targetUnblockedOrThrow().then(() => {
      return {
        kind: "success",
        value: {
          type: "event",
          method: BrowsingContext$1.EventNames.ContextCreated,
          params: {
            ...context.serializeToBidiValue(),
            // Hack to provide the initial URL of the context, as it can be changed
            // between the page target is attached and unblocked, as the page is not
            // fully paused in MPArch session (https://crbug.com/372842894).
            // TODO: remove once https://crbug.com/372842894 is addressed.
            url
          }
        }
      };
    }, (error) => {
      return {
        kind: "error",
        error
      };
    }), context.id, BrowsingContext$1.EventNames.ContextCreated);
    return context;
  }
  /**
   * @see https://html.spec.whatwg.org/multipage/document-sequences.html#navigable
   */
  get navigableId() {
    return __privateGet(this, _loaderId);
  }
  get navigationId() {
    return __privateGet(this, _navigationTracker).currentNavigationId;
  }
  dispose(emitContextDestroyed) {
    __privateGet(this, _navigationTracker).dispose();
    __privateGet(this, _realmStorage3).deleteRealms({
      browsingContextId: this.id
    });
    if (!this.isTopLevelContext()) {
      __privateGet(this.parent, _children).delete(this.id);
    }
    __privateMethod(this, _BrowsingContextImpl_instances, failLifecycleIfNotFinished_fn).call(this);
    if (emitContextDestroyed) {
      __privateGet(this, _eventManager8).registerEvent({
        type: "event",
        method: BrowsingContext$1.EventNames.ContextDestroyed,
        params: this.serializeToBidiValue(null)
      }, this.id);
    }
    __privateMethod(this, _BrowsingContextImpl_instances, deleteAllChildren_fn).call(this);
    __privateGet(this, _eventManager8).clearBufferedEvents(this.id);
    __privateGet(this, _browsingContextStorage12).deleteContextById(this.id);
  }
  /** Returns the ID of this context. */
  get id() {
    return __privateGet(this, _id3);
  }
  /** Returns the parent context ID. */
  get parentId() {
    return __privateGet(this, _parentId);
  }
  /** Sets the parent context ID and updates parent's children. */
  set parentId(parentId) {
    var _a3, _b2;
    if (__privateGet(this, _parentId) !== null) {
      (_b2 = (_a3 = __privateGet(this, _logger8)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2("Parent context already set");
      return;
    }
    __privateSet(this, _parentId, parentId);
    if (!this.isTopLevelContext()) {
      this.parent.addChild(this.id);
    }
  }
  /** Returns the parent context. */
  get parent() {
    if (this.parentId === null) {
      return null;
    }
    return __privateGet(this, _browsingContextStorage12).getContext(this.parentId);
  }
  /** Returns all direct children contexts. */
  get directChildren() {
    return [...__privateGet(this, _children)].map((id) => __privateGet(this, _browsingContextStorage12).getContext(id));
  }
  /** Returns all children contexts, flattened. */
  get allChildren() {
    const children = this.directChildren;
    return children.concat(...children.map((child) => child.allChildren));
  }
  /**
   * Returns true if this is a top-level context.
   * This is the case whenever the parent context ID is null.
   */
  isTopLevelContext() {
    return __privateGet(this, _parentId) === null;
  }
  get top() {
    let topContext = this;
    let parent = topContext.parent;
    while (parent) {
      topContext = parent;
      parent = topContext.parent;
    }
    return topContext;
  }
  addChild(childId) {
    __privateGet(this, _children).add(childId);
  }
  get cdpTarget() {
    return __privateGet(this, _cdpTarget);
  }
  updateCdpTarget(cdpTarget) {
    __privateSet(this, _cdpTarget, cdpTarget);
    __privateMethod(this, _BrowsingContextImpl_instances, initListeners_fn).call(this);
  }
  get url() {
    return __privateGet(this, _navigationTracker).url;
  }
  async lifecycleLoaded() {
    await __privateGet(this, _lifecycle).load;
  }
  async targetUnblockedOrThrow() {
    const result = await __privateGet(this, _cdpTarget).unblocked;
    if (result.kind === "error") {
      throw result.error;
    }
  }
  /** Returns a sandbox for internal helper scripts which is not exposed to the user.*/
  async getOrCreateHiddenSandbox() {
    return await __privateMethod(this, _BrowsingContextImpl_instances, getOrCreateSandboxInternal_fn).call(this, __privateGet(this, _hiddenSandbox));
  }
  /** Returns a sandbox which is exposed to user. */
  async getOrCreateUserSandbox(sandbox) {
    const realm = await __privateMethod(this, _BrowsingContextImpl_instances, getOrCreateSandboxInternal_fn).call(this, sandbox);
    if (realm.isHidden()) {
      throw new NoSuchFrameException(`Realm "${sandbox}" not found`);
    }
    return realm;
  }
  /**
   * Implements https://w3c.github.io/webdriver-bidi/#get-the-navigable-info.
   */
  serializeToBidiValue(maxDepth = 0, addParentField = true) {
    return {
      context: __privateGet(this, _id3),
      url: this.url,
      userContext: this.userContext,
      originalOpener: __privateGet(this, _originalOpener) ?? null,
      clientWindow: `${this.cdpTarget.windowId}`,
      children: maxDepth === null || maxDepth > 0 ? this.directChildren.map((c) => c.serializeToBidiValue(maxDepth === null ? maxDepth : maxDepth - 1, false)) : null,
      ...addParentField ? { parent: __privateGet(this, _parentId) } : {}
    };
  }
  onTargetInfoChanged(params) {
    __privateGet(this, _navigationTracker).onTargetInfoChanged(params.targetInfo.url);
  }
  async navigate(url, wait) {
    try {
      new URL(url);
    } catch {
      throw new InvalidArgumentException(`Invalid URL: ${url}`);
    }
    const navigationState = __privateGet(this, _navigationTracker).createPendingNavigation(url);
    const cdpNavigatePromise = (async () => {
      const cdpNavigateResult = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.navigate", {
        url,
        frameId: this.id
      });
      if (cdpNavigateResult.errorText) {
        __privateGet(this, _navigationTracker).failNavigation(navigationState, cdpNavigateResult.errorText);
        throw new UnknownErrorException(cdpNavigateResult.errorText);
      }
      __privateGet(this, _navigationTracker).navigationCommandFinished(navigationState, cdpNavigateResult.loaderId);
      __privateMethod(this, _BrowsingContextImpl_instances, documentChanged_fn).call(this, cdpNavigateResult.loaderId);
    })();
    const result = await Promise.race([
      // No `loaderId` means same-document navigation.
      __privateMethod(this, _BrowsingContextImpl_instances, waitNavigation_fn).call(this, wait, cdpNavigatePromise, navigationState),
      // Throw an error if the navigation is canceled.
      navigationState.finished
    ]);
    if (result instanceof NavigationResult) {
      if (
        // TODO: check after decision on the spec is done:
        //  https://github.com/w3c/webdriver-bidi/issues/799.
        result.eventName === "browsingContext.navigationAborted" || result.eventName === "browsingContext.navigationFailed"
      ) {
        throw new UnknownErrorException(result.message ?? "unknown exception");
      }
    }
    return {
      navigation: navigationState.navigationId,
      // Url can change due to redirects. Get the one from commandNavigation.
      url: navigationState.url
    };
  }
  // TODO: support concurrent navigations analogous to `navigate`.
  async reload(ignoreCache, wait) {
    await this.targetUnblockedOrThrow();
    __privateMethod(this, _BrowsingContextImpl_instances, resetLifecycleIfFinished_fn).call(this);
    const navigationState = __privateGet(this, _navigationTracker).createPendingNavigation(__privateGet(this, _navigationTracker).url);
    const cdpReloadPromise = __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.reload", {
      ignoreCache
    });
    const result = await Promise.race([
      // No `loaderId` means same-document navigation.
      __privateMethod(this, _BrowsingContextImpl_instances, waitNavigation_fn).call(this, wait, cdpReloadPromise, navigationState),
      // Throw an error if the navigation is canceled.
      navigationState.finished
    ]);
    if (result instanceof NavigationResult) {
      if (result.eventName === "browsingContext.navigationAborted" || result.eventName === "browsingContext.navigationFailed") {
        throw new UnknownErrorException(result.message ?? "unknown exception");
      }
    }
    return {
      navigation: navigationState.navigationId,
      // Url can change due to redirects. Get the one from commandNavigation.
      url: navigationState.url
    };
  }
  async setViewport(viewport, devicePixelRatio, screenOrientation) {
    const config = __privateGet(this, _configStorage2).getActiveConfig(this.id, this.userContext);
    await this.cdpTarget.setDeviceMetricsOverride(viewport, devicePixelRatio, screenOrientation, config.screenArea ?? null, config.scrollbarType ?? null);
  }
  async handleUserPrompt(accept, userText) {
    await __privateGet(this.top, _cdpTarget).cdpClient.sendCommand("Page.handleJavaScriptDialog", {
      accept: accept ?? true,
      promptText: userText
    });
  }
  async activate() {
    await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.bringToFront");
  }
  async captureScreenshot(params) {
    if (!this.isTopLevelContext()) {
      throw new UnsupportedOperationException(`Non-top-level 'context' (${params.context}) is currently not supported`);
    }
    const formatParameters = getImageFormatParameters(params);
    let captureBeyondViewport = false;
    let script;
    params.origin ?? (params.origin = "viewport");
    switch (params.origin) {
      case "document": {
        script = String(() => {
          const element = document.documentElement;
          return {
            x: 0,
            y: 0,
            width: element.scrollWidth,
            height: element.scrollHeight
          };
        });
        captureBeyondViewport = true;
        break;
      }
      case "viewport": {
        script = String(() => {
          const viewport = window.visualViewport;
          return {
            x: viewport.pageLeft,
            y: viewport.pageTop,
            width: viewport.width,
            height: viewport.height
          };
        });
        break;
      }
    }
    const hiddenSandboxRealm = await this.getOrCreateHiddenSandbox();
    const originResult = await hiddenSandboxRealm.callFunction(script, false);
    assert(originResult.type === "success");
    const origin = deserializeDOMRect(originResult.result);
    assert(origin);
    let rect = origin;
    if (params.clip) {
      const clip = params.clip;
      if (params.origin === "viewport" && clip.type === "box") {
        clip.x += origin.x;
        clip.y += origin.y;
      }
      rect = getIntersectionRect(await __privateMethod(this, _BrowsingContextImpl_instances, parseRect_fn).call(this, clip), origin);
    }
    if (rect.width === 0 || rect.height === 0) {
      throw new UnableToCaptureScreenException(`Unable to capture screenshot with zero dimensions: width=${rect.width}, height=${rect.height}`);
    }
    return await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.captureScreenshot", {
      clip: { ...rect, scale: 1 },
      ...formatParameters,
      captureBeyondViewport
    });
  }
  async print(params) {
    var _a3, _b2, _c2, _d2, _e, _f;
    if (!this.isTopLevelContext()) {
      throw new UnsupportedOperationException("Printing of non-top level contexts is not supported");
    }
    const cdpParams = {};
    if (params.background !== void 0) {
      cdpParams.printBackground = params.background;
    }
    if (((_a3 = params.margin) == null ? void 0 : _a3.bottom) !== void 0) {
      cdpParams.marginBottom = inchesFromCm(params.margin.bottom);
    }
    if (((_b2 = params.margin) == null ? void 0 : _b2.left) !== void 0) {
      cdpParams.marginLeft = inchesFromCm(params.margin.left);
    }
    if (((_c2 = params.margin) == null ? void 0 : _c2.right) !== void 0) {
      cdpParams.marginRight = inchesFromCm(params.margin.right);
    }
    if (((_d2 = params.margin) == null ? void 0 : _d2.top) !== void 0) {
      cdpParams.marginTop = inchesFromCm(params.margin.top);
    }
    if (params.orientation !== void 0) {
      cdpParams.landscape = params.orientation === "landscape";
    }
    if (((_e = params.page) == null ? void 0 : _e.height) !== void 0) {
      cdpParams.paperHeight = inchesFromCm(params.page.height);
    }
    if (((_f = params.page) == null ? void 0 : _f.width) !== void 0) {
      cdpParams.paperWidth = inchesFromCm(params.page.width);
    }
    if (params.pageRanges !== void 0) {
      for (const range of params.pageRanges) {
        if (typeof range === "number") {
          continue;
        }
        const rangeParts = range.split("-");
        if (rangeParts.length < 1 || rangeParts.length > 2) {
          throw new InvalidArgumentException(`Invalid page range: ${range} is not a valid integer range.`);
        }
        if (rangeParts.length === 1) {
          void parseInteger(rangeParts[0] ?? "");
          continue;
        }
        let lowerBound;
        let upperBound;
        const [rangeLowerPart = "", rangeUpperPart = ""] = rangeParts;
        if (rangeLowerPart === "") {
          lowerBound = 1;
        } else {
          lowerBound = parseInteger(rangeLowerPart);
        }
        if (rangeUpperPart === "") {
          upperBound = Number.MAX_SAFE_INTEGER;
        } else {
          upperBound = parseInteger(rangeUpperPart);
        }
        if (lowerBound > upperBound) {
          throw new InvalidArgumentException(`Invalid page range: ${rangeLowerPart} > ${rangeUpperPart}`);
        }
      }
      cdpParams.pageRanges = params.pageRanges.join(",");
    }
    if (params.scale !== void 0) {
      cdpParams.scale = params.scale;
    }
    if (params.shrinkToFit !== void 0) {
      cdpParams.preferCSSPageSize = !params.shrinkToFit;
    }
    try {
      const result = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.printToPDF", cdpParams);
      return {
        data: result.data
      };
    } catch (error) {
      if (error.message === "invalid print parameters: content area is empty") {
        throw new UnsupportedOperationException(error.message);
      }
      throw error;
    }
  }
  async close() {
    await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.close");
  }
  async traverseHistory(delta) {
    if (delta === 0) {
      return;
    }
    const history = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.getNavigationHistory");
    const entry = history.entries[history.currentIndex + delta];
    if (!entry) {
      throw new NoSuchHistoryEntryException(`No history entry at delta ${delta}`);
    }
    await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.navigateToHistoryEntry", {
      entryId: entry.id
    });
  }
  async toggleModulesIfNeeded() {
    await Promise.all([
      __privateGet(this, _cdpTarget).toggleNetworkIfNeeded(),
      __privateGet(this, _cdpTarget).toggleDeviceAccessIfNeeded(),
      __privateGet(this, _cdpTarget).togglePreloadIfNeeded()
    ]);
  }
  async locateNodes(params) {
    return await __privateMethod(this, _BrowsingContextImpl_instances, locateNodesByLocator_fn).call(this, await __privateGet(this, _defaultRealmDeferred), params.locator, params.startNodes ?? [], params.maxNodeCount, params.serializationOptions);
  }
  async setTimezoneOverride(timezone) {
    await Promise.all(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setTimezoneOverride(timezone)));
  }
  async setLocaleOverride(locale) {
    await Promise.all(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setLocaleOverride(locale)));
  }
  async setGeolocationOverride(geolocation) {
    await Promise.all(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setGeolocationOverride(geolocation)));
  }
  async setScriptingEnabled(scriptingEnabled) {
    await Promise.all(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setScriptingEnabled(scriptingEnabled)));
  }
  async setUserAgentAndAcceptLanguage(userAgent, acceptLanguage, clientHints) {
    await Promise.all(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setUserAgentAndAcceptLanguage(userAgent, acceptLanguage, clientHints)));
  }
  async setEmulatedNetworkConditions(networkConditions) {
    await Promise.all(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setEmulatedNetworkConditions(networkConditions)));
  }
  async setTouchOverride(maxTouchPoints) {
    await Promise.allSettled(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setTouchOverride(maxTouchPoints)));
  }
  async setExtraHeaders(cdpExtraHeaders) {
    await Promise.all(__privateMethod(this, _BrowsingContextImpl_instances, getAllRelatedCdpTargets_fn).call(this).map(async (cdpTarget) => await cdpTarget.setExtraHeaders(cdpExtraHeaders)));
  }
  async setScrollbarTypeOverride(scrollbarType) {
    const config = __privateGet(this, _configStorage2).getActiveConfig(this.id, this.userContext);
    await this.cdpTarget.setDeviceMetricsOverride(config.viewport ?? null, config.devicePixelRatio ?? null, config.screenOrientation ?? null, config.screenArea ?? null, scrollbarType);
  }
}
_children = new WeakMap();
_id3 = new WeakMap();
_hiddenSandbox = new WeakMap();
_downloadIdToUrlMap = new WeakMap();
_loaderId = new WeakMap();
_parentId = new WeakMap();
_originalOpener = new WeakMap();
_lifecycle = new WeakMap();
_cdpTarget = new WeakMap();
_defaultRealmDeferred = new WeakMap();
_browsingContextStorage12 = new WeakMap();
_eventManager8 = new WeakMap();
_logger8 = new WeakMap();
_navigationTracker = new WeakMap();
_realmStorage3 = new WeakMap();
_configStorage2 = new WeakMap();
_lastUserPromptType = new WeakMap();
_BrowsingContextImpl_instances = new WeakSet();
deleteAllChildren_fn = function(emitContextDestroyed = false) {
  this.directChildren.map((child) => child.dispose(emitContextDestroyed));
};
getOrCreateSandboxInternal_fn = async function(sandbox) {
  if (sandbox === void 0 || sandbox === "") {
    return await __privateGet(this, _defaultRealmDeferred);
  }
  let maybeSandboxes = __privateGet(this, _realmStorage3).findRealms({
    browsingContextId: this.id,
    sandbox
  });
  if (maybeSandboxes.length === 0) {
    await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Page.createIsolatedWorld", {
      frameId: this.id,
      worldName: sandbox
    });
    maybeSandboxes = __privateGet(this, _realmStorage3).findRealms({
      browsingContextId: this.id,
      sandbox
    });
    assert(maybeSandboxes.length !== 0);
  }
  return maybeSandboxes[0];
};
initListeners_fn = function() {
  __privateGet(this, _cdpTarget).cdpClient.on("Network.loadingFailed", (params) => {
    __privateGet(this, _navigationTracker).networkLoadingFailed(params.requestId, params.errorText);
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Page.fileChooserOpened", (params) => {
    var _a3, _b2;
    if (this.id !== params.frameId) {
      return;
    }
    if (__privateGet(this, _loaderId) === void 0) {
      (_b2 = (_a3 = __privateGet(this, _logger8)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2("LoaderId should be defined when file upload is shown", params);
      return;
    }
    const element = params.backendNodeId === void 0 ? void 0 : {
      sharedId: getSharedId(this.id, __privateGet(this, _loaderId), params.backendNodeId)
    };
    __privateGet(this, _eventManager8).registerEvent({
      type: "event",
      method: Input.EventNames.FileDialogOpened,
      params: {
        context: this.id,
        multiple: params.mode === "selectMultiple",
        element
      }
    }, this.id);
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Page.frameNavigated", (params) => {
    if (this.id !== params.frame.id) {
      return;
    }
    __privateGet(this, _navigationTracker).frameNavigated(
      params.frame.url + (params.frame.urlFragment ?? ""),
      params.frame.loaderId,
      // `unreachableUrl` indicates if the navigation failed.
      params.frame.unreachableUrl
    );
    __privateMethod(this, _BrowsingContextImpl_instances, deleteAllChildren_fn).call(this);
    __privateMethod(this, _BrowsingContextImpl_instances, documentChanged_fn).call(this, params.frame.loaderId);
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Page.frameStartedNavigating", (params) => {
    if (this.id !== params.frameId) {
      return;
    }
    __privateGet(this, _navigationTracker).frameStartedNavigating(params.url, params.loaderId, params.navigationType);
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Page.navigatedWithinDocument", (params) => {
    if (this.id !== params.frameId) {
      return;
    }
    __privateGet(this, _navigationTracker).navigatedWithinDocument(params.url, params.navigationType);
    if (params.navigationType === "historyApi") {
      __privateGet(this, _eventManager8).registerEvent({
        type: "event",
        method: "browsingContext.historyUpdated",
        params: {
          context: this.id,
          timestamp: getTimestamp(),
          url: __privateGet(this, _navigationTracker).url
        }
      }, this.id);
      return;
    }
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Page.lifecycleEvent", (params) => {
    if (this.id !== params.frameId) {
      return;
    }
    if (params.name === "init") {
      __privateMethod(this, _BrowsingContextImpl_instances, documentChanged_fn).call(this, params.loaderId);
      return;
    }
    if (params.name === "commit") {
      __privateSet(this, _loaderId, params.loaderId);
      return;
    }
    if (!__privateGet(this, _loaderId)) {
      __privateSet(this, _loaderId, params.loaderId);
    }
    if (params.loaderId !== __privateGet(this, _loaderId)) {
      return;
    }
    switch (params.name) {
      case "DOMContentLoaded":
        if (!__privateGet(this, _navigationTracker).isInitialNavigation) {
          __privateGet(this, _eventManager8).registerEvent({
            type: "event",
            method: BrowsingContext$1.EventNames.DomContentLoaded,
            params: {
              context: this.id,
              navigation: __privateGet(this, _navigationTracker).currentNavigationId,
              timestamp: getTimestamp(),
              url: __privateGet(this, _navigationTracker).url
            }
          }, this.id);
        }
        __privateGet(this, _lifecycle).DOMContentLoaded.resolve();
        break;
      case "load":
        if (!__privateGet(this, _navigationTracker).isInitialNavigation) {
          __privateGet(this, _eventManager8).registerEvent({
            type: "event",
            method: BrowsingContext$1.EventNames.Load,
            params: {
              context: this.id,
              navigation: __privateGet(this, _navigationTracker).currentNavigationId,
              timestamp: getTimestamp(),
              url: __privateGet(this, _navigationTracker).url
            }
          }, this.id);
        }
        __privateGet(this, _navigationTracker).loadPageEvent(params.loaderId);
        __privateGet(this, _lifecycle).load.resolve();
        break;
    }
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Runtime.executionContextCreated", (params) => {
    var _a3, _b2;
    const { auxData, name, uniqueId, id } = params.context;
    if (!auxData || auxData.frameId !== this.id) {
      return;
    }
    if (auxData.type === "isolated" && name === "") {
      return;
    }
    let origin;
    let sandbox;
    switch (auxData.type) {
      case "isolated":
        sandbox = name;
        if (!__privateGet(this, _defaultRealmDeferred).isFinished) {
          (_b2 = (_a3 = __privateGet(this, _logger8)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2("Unexpectedly, isolated realm created before the default one");
        }
        origin = __privateGet(this, _defaultRealmDeferred).isFinished ? __privateGet(this, _defaultRealmDeferred).result.origin : (
          // This fallback is not expected to be ever reached.
          ""
        );
        break;
      case "default":
        origin = serializeOrigin(params.context.origin);
        break;
      default:
        return;
    }
    const realm = new WindowRealm$1(this.id, __privateGet(this, _browsingContextStorage12), __privateGet(this, _cdpTarget).cdpClient, __privateGet(this, _eventManager8), id, __privateGet(this, _logger8), origin, uniqueId, __privateGet(this, _realmStorage3), sandbox);
    if (auxData.isDefault) {
      __privateGet(this, _defaultRealmDeferred).resolve(realm);
      void Promise.all(__privateGet(this, _cdpTarget).getChannels().map((channel) => channel.startListenerFromWindow(realm, __privateGet(this, _eventManager8))));
    }
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Runtime.executionContextDestroyed", (params) => {
    if (__privateGet(this, _defaultRealmDeferred).isFinished && __privateGet(this, _defaultRealmDeferred).result.executionContextId === params.executionContextId) {
      __privateSet(this, _defaultRealmDeferred, new Deferred());
    }
    __privateGet(this, _realmStorage3).deleteRealms({
      cdpSessionId: __privateGet(this, _cdpTarget).cdpSessionId,
      executionContextId: params.executionContextId
    });
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Runtime.executionContextsCleared", () => {
    if (!__privateGet(this, _defaultRealmDeferred).isFinished) {
      __privateGet(this, _defaultRealmDeferred).reject(new UnknownErrorException("execution contexts cleared"));
    }
    __privateSet(this, _defaultRealmDeferred, new Deferred());
    __privateGet(this, _realmStorage3).deleteRealms({
      cdpSessionId: __privateGet(this, _cdpTarget).cdpSessionId
    });
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Page.javascriptDialogClosed", (params) => {
    var _a3, _b2, _c2;
    if (params.frameId && this.id !== params.frameId) {
      return;
    }
    if (!params.frameId && __privateGet(this, _parentId) && __privateGet(this, _cdpTarget).cdpClient !== ((_a3 = __privateGet(this, _browsingContextStorage12).getContext(__privateGet(this, _parentId))) == null ? void 0 : _a3.cdpTarget.cdpClient)) {
      return;
    }
    const accepted = params.result;
    if (__privateGet(this, _lastUserPromptType) === void 0) {
      (_c2 = (_b2 = __privateGet(this, _logger8)) == null ? void 0 : _b2.call(this, LogType.debugError)) == null ? void 0 : _c2("Unexpectedly no opening prompt event before closing one");
    }
    __privateGet(this, _eventManager8).registerEvent({
      type: "event",
      method: BrowsingContext$1.EventNames.UserPromptClosed,
      params: {
        context: this.id,
        accepted,
        // `lastUserPromptType` should never be undefined here, so fallback to
        // `UNKNOWN`. The fallback is required to prevent tests from hanging while
        // waiting for the closing event. The cast is required, as the `UNKNOWN` value
        // is not standard.
        type: __privateGet(this, _lastUserPromptType) ?? "UNKNOWN",
        userText: accepted && params.userInput ? params.userInput : void 0
      }
    }, this.id);
    __privateSet(this, _lastUserPromptType, void 0);
  });
  __privateGet(this, _cdpTarget).cdpClient.on("Page.javascriptDialogOpening", (params) => {
    var _a3, _b2;
    if (params.frameId && this.id !== params.frameId) {
      return;
    }
    if (!params.frameId && __privateGet(this, _parentId) && __privateGet(this, _cdpTarget).cdpClient !== ((_a3 = __privateGet(this, _browsingContextStorage12).getContext(__privateGet(this, _parentId))) == null ? void 0 : _a3.cdpTarget.cdpClient)) {
      return;
    }
    const promptType = __privateMethod(_b2 = _a$5, _BrowsingContextImpl_static, getPromptType_fn).call(_b2, params.type);
    __privateSet(this, _lastUserPromptType, promptType);
    const promptHandler = __privateMethod(this, _BrowsingContextImpl_instances, getPromptHandler_fn).call(this, promptType);
    __privateGet(this, _eventManager8).registerEvent({
      type: "event",
      method: BrowsingContext$1.EventNames.UserPromptOpened,
      params: {
        context: this.id,
        handler: promptHandler,
        type: promptType,
        message: params.message,
        ...params.type === "prompt" ? { defaultValue: params.defaultPrompt } : {}
      }
    }, this.id);
    switch (promptHandler) {
      case "accept":
        void this.handleUserPrompt(true);
        break;
      case "dismiss":
        void this.handleUserPrompt(false);
        break;
    }
  });
  __privateGet(this, _cdpTarget).browserCdpClient.on("Browser.downloadWillBegin", (params) => {
    if (this.id !== params.frameId) {
      return;
    }
    __privateGet(this, _downloadIdToUrlMap).set(params.guid, params.url);
    __privateGet(this, _eventManager8).registerEvent(
      // @ts-expect-error we do not support download yet. https://github.com/GoogleChromeLabs/chromium-bidi/issues/4155.
      {
        type: "event",
        method: BrowsingContext$1.EventNames.DownloadWillBegin,
        params: {
          context: this.id,
          suggestedFilename: params.suggestedFilename,
          navigation: params.guid,
          timestamp: getTimestamp(),
          url: params.url
        }
      },
      this.id
    );
  });
  __privateGet(this, _cdpTarget).browserCdpClient.on("Browser.downloadProgress", (params) => {
    if (!__privateGet(this, _downloadIdToUrlMap).has(params.guid)) {
      return;
    }
    if (params.state === "inProgress") {
      return;
    }
    const url = __privateGet(this, _downloadIdToUrlMap).get(params.guid);
    switch (params.state) {
      case "canceled":
        __privateGet(this, _eventManager8).registerEvent(
          // @ts-expect-error we do not support download yet. https://github.com/GoogleChromeLabs/chromium-bidi/issues/4155.
          {
            type: "event",
            method: BrowsingContext$1.EventNames.DownloadEnd,
            params: {
              status: "canceled",
              context: this.id,
              navigation: params.guid,
              timestamp: getTimestamp(),
              url
            }
          },
          this.id
        );
        break;
      case "completed":
        __privateGet(this, _eventManager8).registerEvent(
          // @ts-expect-error we do not support download yet. https://github.com/GoogleChromeLabs/chromium-bidi/issues/4155.
          {
            type: "event",
            method: BrowsingContext$1.EventNames.DownloadEnd,
            params: {
              filepath: params.filePath ?? null,
              status: "complete",
              context: this.id,
              navigation: params.guid,
              timestamp: getTimestamp(),
              url
            }
          },
          this.id
        );
        break;
      default:
        throw new UnknownErrorException(`Unknown download state: ${params.state}`);
    }
  });
};
_BrowsingContextImpl_static = new WeakSet();
getPromptType_fn = function(cdpType) {
  switch (cdpType) {
    case "alert":
      return "alert";
    case "beforeunload":
      return "beforeunload";
    case "confirm":
      return "confirm";
    case "prompt":
      return "prompt";
  }
};
/**
 * Returns either custom UserContext's prompt handler, global or default one.
 */
getPromptHandler_fn = function(promptType) {
  var _a3, _b2, _c2, _d2, _e, _f, _g, _h;
  const defaultPromptHandler = "dismiss";
  const contextConfig = __privateGet(this, _configStorage2).getActiveConfig(this.top.id, this.userContext);
  switch (promptType) {
    case "alert":
      return ((_a3 = contextConfig.userPromptHandler) == null ? void 0 : _a3.alert) ?? ((_b2 = contextConfig.userPromptHandler) == null ? void 0 : _b2.default) ?? defaultPromptHandler;
    case "beforeunload":
      return ((_c2 = contextConfig.userPromptHandler) == null ? void 0 : _c2.beforeUnload) ?? ((_d2 = contextConfig.userPromptHandler) == null ? void 0 : _d2.default) ?? "accept";
    case "confirm":
      return ((_e = contextConfig.userPromptHandler) == null ? void 0 : _e.confirm) ?? ((_f = contextConfig.userPromptHandler) == null ? void 0 : _f.default) ?? defaultPromptHandler;
    case "prompt":
      return ((_g = contextConfig.userPromptHandler) == null ? void 0 : _g.prompt) ?? ((_h = contextConfig.userPromptHandler) == null ? void 0 : _h.default) ?? defaultPromptHandler;
  }
};
documentChanged_fn = function(loaderId) {
  if (loaderId === void 0 || __privateGet(this, _loaderId) === loaderId) {
    return;
  }
  __privateMethod(this, _BrowsingContextImpl_instances, resetLifecycleIfFinished_fn).call(this);
  __privateSet(this, _loaderId, loaderId);
  __privateMethod(this, _BrowsingContextImpl_instances, deleteAllChildren_fn).call(this, true);
};
resetLifecycleIfFinished_fn = function() {
  var _a3, _b2, _c2, _d2;
  if (__privateGet(this, _lifecycle).DOMContentLoaded.isFinished) {
    __privateGet(this, _lifecycle).DOMContentLoaded = new Deferred();
  } else {
    (_b2 = (_a3 = __privateGet(this, _logger8)) == null ? void 0 : _a3.call(this, _a$5.LOGGER_PREFIX)) == null ? void 0 : _b2("Document changed (DOMContentLoaded)");
  }
  if (__privateGet(this, _lifecycle).load.isFinished) {
    __privateGet(this, _lifecycle).load = new Deferred();
  } else {
    (_d2 = (_c2 = __privateGet(this, _logger8)) == null ? void 0 : _c2.call(this, _a$5.LOGGER_PREFIX)) == null ? void 0 : _d2("Document changed (load)");
  }
};
failLifecycleIfNotFinished_fn = function() {
  if (!__privateGet(this, _lifecycle).DOMContentLoaded.isFinished) {
    __privateGet(this, _lifecycle).DOMContentLoaded.reject(new UnknownErrorException("navigation canceled"));
  }
  if (!__privateGet(this, _lifecycle).load.isFinished) {
    __privateGet(this, _lifecycle).load.reject(new UnknownErrorException("navigation canceled"));
  }
};
waitNavigation_fn = async function(wait, cdpCommandPromise, navigationState) {
  await Promise.all([navigationState.committed, cdpCommandPromise]);
  if (wait === "none") {
    return;
  }
  if (navigationState.isFragmentNavigation === true) {
    await navigationState.finished;
    return;
  }
  if (wait === "interactive") {
    await __privateGet(this, _lifecycle).DOMContentLoaded;
    return;
  }
  if (wait === "complete") {
    await __privateGet(this, _lifecycle).load;
    return;
  }
  throw new InvalidArgumentException(`Wait condition ${wait} is not supported`);
};
parseRect_fn = async function(clip) {
  switch (clip.type) {
    case "box":
      return { x: clip.x, y: clip.y, width: clip.width, height: clip.height };
    case "element": {
      const hiddenSandboxRealm = await this.getOrCreateHiddenSandbox();
      const result = await hiddenSandboxRealm.callFunction(String((element) => {
        return element instanceof Element;
      }), false, { type: "undefined" }, [clip.element]);
      if (result.type === "exception") {
        throw new NoSuchElementException(`Element '${clip.element.sharedId}' was not found`);
      }
      assert(result.result.type === "boolean");
      if (!result.result.value) {
        throw new NoSuchElementException(`Node '${clip.element.sharedId}' is not an Element`);
      }
      {
        const result2 = await hiddenSandboxRealm.callFunction(String((element) => {
          const rect2 = element.getBoundingClientRect();
          return {
            x: rect2.x,
            y: rect2.y,
            height: rect2.height,
            width: rect2.width
          };
        }), false, { type: "undefined" }, [clip.element]);
        assert(result2.type === "success");
        const rect = deserializeDOMRect(result2.result);
        if (!rect) {
          throw new UnableToCaptureScreenException(`Could not get bounding box for Element '${clip.element.sharedId}'`);
        }
        return rect;
      }
    }
  }
};
getLocatorDelegate_fn = function(locator, maxNodeCount, startNodes) {
  switch (locator.type) {
    case "context":
    case "accessibility":
      throw new Error("Unreachable");
    case "css":
      return {
        functionDeclaration: String((cssSelector, maxNodeCount2, ...startNodes2) => {
          const locateNodesUsingCss = (element) => {
            if (!(element instanceof HTMLElement || element instanceof Document || element instanceof DocumentFragment || element instanceof SVGElement)) {
              throw new Error("startNodes in css selector should be HTMLElement, SVGElement or Document or DocumentFragment");
            }
            return [...element.querySelectorAll(cssSelector)];
          };
          startNodes2 = startNodes2.length > 0 ? startNodes2 : [document];
          const returnedNodes = startNodes2.map((startNode) => (
            // TODO: stop search early if `maxNodeCount` is reached.
            locateNodesUsingCss(startNode)
          )).flat(1);
          return maxNodeCount2 === 0 ? returnedNodes : returnedNodes.slice(0, maxNodeCount2);
        }),
        argumentsLocalValues: [
          // `cssSelector`
          { type: "string", value: locator.value },
          // `maxNodeCount` with `0` means no limit.
          { type: "number", value: maxNodeCount ?? 0 },
          // `startNodes`
          ...startNodes
        ]
      };
    case "xpath":
      return {
        functionDeclaration: String((xPathSelector, maxNodeCount2, ...startNodes2) => {
          const evaluator = new XPathEvaluator();
          const expression = evaluator.createExpression(xPathSelector);
          const locateNodesUsingXpath = (element) => {
            const xPathResult = expression.evaluate(element, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            const returnedNodes2 = [];
            for (let i = 0; i < xPathResult.snapshotLength; i++) {
              returnedNodes2.push(xPathResult.snapshotItem(i));
            }
            return returnedNodes2;
          };
          startNodes2 = startNodes2.length > 0 ? startNodes2 : [document];
          const returnedNodes = startNodes2.map((startNode) => (
            // TODO: stop search early if `maxNodeCount` is reached.
            locateNodesUsingXpath(startNode)
          )).flat(1);
          return maxNodeCount2 === 0 ? returnedNodes : returnedNodes.slice(0, maxNodeCount2);
        }),
        argumentsLocalValues: [
          // `xPathSelector`
          { type: "string", value: locator.value },
          // `maxNodeCount` with `0` means no limit.
          { type: "number", value: maxNodeCount ?? 0 },
          // `startNodes`
          ...startNodes
        ]
      };
    case "innerText":
      if (locator.value === "") {
        throw new InvalidSelectorException("innerText locator cannot be empty");
      }
      return {
        functionDeclaration: String((innerTextSelector, fullMatch, ignoreCase, maxNodeCount2, maxDepth, ...startNodes2) => {
          const searchText = ignoreCase ? innerTextSelector.toUpperCase() : innerTextSelector;
          const locateNodesUsingInnerText = (node, currentMaxDepth) => {
            var _a3;
            const returnedNodes2 = [];
            if (node instanceof DocumentFragment || node instanceof Document) {
              const children = [...node.children];
              children.forEach((child) => (
                // `currentMaxDepth` is not decremented intentionally according to
                // https://github.com/w3c/webdriver-bidi/pull/713.
                returnedNodes2.push(...locateNodesUsingInnerText(child, currentMaxDepth))
              ));
              return returnedNodes2;
            }
            if (!(node instanceof HTMLElement)) {
              return [];
            }
            const element = node;
            const nodeInnerText = ignoreCase ? (_a3 = element.innerText) == null ? void 0 : _a3.toUpperCase() : element.innerText;
            if (!nodeInnerText.includes(searchText)) {
              return [];
            }
            const childNodes = [];
            for (const child of element.children) {
              if (child instanceof HTMLElement) {
                childNodes.push(child);
              }
            }
            if (childNodes.length === 0) {
              if (fullMatch && nodeInnerText === searchText) {
                returnedNodes2.push(element);
              } else {
                if (!fullMatch) {
                  returnedNodes2.push(element);
                }
              }
            } else {
              const childNodeMatches = (
                // Don't search deeper if `maxDepth` is reached.
                currentMaxDepth <= 0 ? [] : childNodes.map((child) => locateNodesUsingInnerText(child, currentMaxDepth - 1)).flat(1)
              );
              if (childNodeMatches.length === 0) {
                if (!fullMatch || nodeInnerText === searchText) {
                  returnedNodes2.push(element);
                }
              } else {
                returnedNodes2.push(...childNodeMatches);
              }
            }
            return returnedNodes2;
          };
          startNodes2 = startNodes2.length > 0 ? startNodes2 : [document];
          const returnedNodes = startNodes2.map((startNode) => (
            // TODO: stop search early if `maxNodeCount` is reached.
            locateNodesUsingInnerText(startNode, maxDepth)
          )).flat(1);
          return maxNodeCount2 === 0 ? returnedNodes : returnedNodes.slice(0, maxNodeCount2);
        }),
        argumentsLocalValues: [
          // `innerTextSelector`
          { type: "string", value: locator.value },
          // `fullMatch` with default `true`.
          { type: "boolean", value: locator.matchType !== "partial" },
          // `ignoreCase` with default `false`.
          { type: "boolean", value: locator.ignoreCase === true },
          // `maxNodeCount` with `0` means no limit.
          { type: "number", value: maxNodeCount ?? 0 },
          // `maxDepth` with default `1000` (same as default full serialization depth).
          { type: "number", value: locator.maxDepth ?? 1e3 },
          // `startNodes`
          ...startNodes
        ]
      };
  }
};
locateNodesByLocator_fn = async function(realm, locator, startNodes, maxNodeCount, serializationOptions) {
  var _a3, _b2, _c2, _d2;
  if (locator.type === "context") {
    return await __privateMethod(this, _BrowsingContextImpl_instances, locateNodesByContextLocator_fn).call(this, locator, startNodes, realm, serializationOptions);
  }
  if (locator.type === "accessibility") {
    return await __privateMethod(this, _BrowsingContextImpl_instances, locateNodesByAccessibility_fn).call(this, locator, startNodes, maxNodeCount, realm);
  }
  const locatorDelegate = __privateMethod(this, _BrowsingContextImpl_instances, getLocatorDelegate_fn).call(this, locator, maxNodeCount, startNodes);
  serializationOptions = {
    ...serializationOptions,
    // The returned object is an array of nodes, so no need in deeper JS serialization.
    maxObjectDepth: 1
  };
  const locatorResult = await realm.callFunction(locatorDelegate.functionDeclaration, false, { type: "undefined" }, locatorDelegate.argumentsLocalValues, "none", serializationOptions);
  if (locatorResult.type !== "success") {
    (_b2 = (_a3 = __privateGet(this, _logger8)) == null ? void 0 : _a3.call(this, _a$5.LOGGER_PREFIX)) == null ? void 0 : _b2("Failed locateNodesByLocator", locatorResult);
    if (
      // CSS selector.
      ((_c2 = locatorResult.exceptionDetails.text) == null ? void 0 : _c2.endsWith("is not a valid selector.")) || // XPath selector.
      ((_d2 = locatorResult.exceptionDetails.text) == null ? void 0 : _d2.endsWith("is not a valid XPath expression."))
    ) {
      throw new InvalidSelectorException(`Not valid selector ${typeof locator.value === "string" ? locator.value : JSON.stringify(locator.value)}`);
    }
    if (locatorResult.exceptionDetails.text === "Error: startNodes in css selector should be HTMLElement, SVGElement or Document or DocumentFragment") {
      throw new InvalidArgumentException("startNodes in css selector should be HTMLElement, SVGElement or Document or DocumentFragment");
    }
    throw new UnknownErrorException(`Unexpected error in selector script: ${locatorResult.exceptionDetails.text}`);
  }
  if (locatorResult.result.type !== "array") {
    throw new UnknownErrorException(`Unexpected selector script result type: ${locatorResult.result.type}`);
  }
  const nodes = locatorResult.result.value.map((value) => {
    if (value.type !== "node") {
      throw new UnknownErrorException(`Unexpected selector script result element: ${value.type}`);
    }
    return value;
  });
  return { nodes };
};
locateNodesByContextLocator_fn = async function(locator, startNodes, realm, serializationOptions) {
  if (startNodes.length !== 0) {
    throw new InvalidArgumentException("Start nodes are not supported");
  }
  const contextId = locator.value.context;
  if (!contextId) {
    throw new InvalidSelectorException("Invalid context");
  }
  const context = __privateGet(this, _browsingContextStorage12).getContext(contextId);
  const parent = context.parent;
  if (!parent) {
    throw new InvalidArgumentException("This context has no container");
  }
  try {
    const { backendNodeId } = await __privateGet(parent, _cdpTarget).cdpClient.sendCommand("DOM.getFrameOwner", {
      frameId: contextId
    });
    const { object } = await __privateGet(parent, _cdpTarget).cdpClient.sendCommand("DOM.resolveNode", {
      backendNodeId
    });
    const locatorResult = await realm.callFunction(`function () { return this; }`, false, { handle: object.objectId }, [], "none", serializationOptions);
    if (locatorResult.type === "exception") {
      throw new Error("Unknown exception");
    }
    return { nodes: [locatorResult.result] };
  } catch {
    throw new InvalidArgumentException("Context does not exist");
  }
};
locateNodesByAccessibility_fn = async function(locator, startNodes, maxNodeCount, realm) {
  var _a3;
  if (!locator.value.name && !locator.value.role) {
    throw new InvalidSelectorException("Either name or role has to be specified");
  }
  await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Accessibility.enable");
  const startBackendNodeIds = [];
  if (startNodes.length === 0) {
    const { root: documentRoot } = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("DOM.getDocument");
    startBackendNodeIds.push(documentRoot.backendNodeId);
  } else {
    for (const node of startNodes) {
      if (node.sharedId) {
        const parsed = parseSharedId(node.sharedId);
        if (!parsed) {
          throw new NoSuchNodeException(`Invalid sharedId: ${node.sharedId}`);
        }
        startBackendNodeIds.push(parsed.backendNodeId);
      } else {
        if (node.handle) {
          const { nodeId } = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("DOM.requestNode", {
            objectId: node.handle
          });
          const { node: describedNode } = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("DOM.describeNode", {
            nodeId
          });
          startBackendNodeIds.push(describedNode.backendNodeId);
        } else {
          throw new NoSuchNodeException("Start node must have sharedId or handle");
        }
      }
    }
  }
  const matchedBackendNodeIds = /* @__PURE__ */ new Set();
  for (const backendNodeId of startBackendNodeIds) {
    const { nodes } = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("Accessibility.queryAXTree", {
      backendNodeId,
      accessibleName: locator.value.name,
      role: locator.value.role
    });
    for (const node of nodes) {
      if (node.backendDOMNodeId && ((_a3 = node.role) == null ? void 0 : _a3.type) === "role") {
        matchedBackendNodeIds.add(node.backendDOMNodeId);
        if (maxNodeCount !== void 0 && maxNodeCount > 0 && matchedBackendNodeIds.size >= maxNodeCount) {
          break;
        }
      }
    }
  }
  const resultNodes = await Promise.all(Array.from(matchedBackendNodeIds).map(async (backendNodeId) => {
    const { object } = await __privateGet(this, _cdpTarget).cdpClient.sendCommand("DOM.resolveNode", {
      backendNodeId
    });
    return await realm.serializeCdpObject(
      object,
      "none"
      /* Script.ResultOwnership.None */
    );
  }));
  return {
    nodes: resultNodes.filter((result) => result.type === "node")
  };
};
getAllRelatedCdpTargets_fn = function() {
  const targets = /* @__PURE__ */ new Set();
  targets.add(this.cdpTarget);
  this.allChildren.forEach((c) => targets.add(c.cdpTarget));
  return Array.from(targets);
};
__privateAdd(BrowsingContextImpl, _BrowsingContextImpl_static);
__publicField(BrowsingContextImpl, "LOGGER_PREFIX", `${LogType.debug}:browsingContext`);
_a$5 = BrowsingContextImpl;
function serializeOrigin(origin) {
  if (["://", ""].includes(origin)) {
    origin = "null";
  }
  return origin;
}
function getImageFormatParameters(params) {
  const { quality, type } = params.format ?? {
    type: "image/png"
  };
  switch (type) {
    case "image/png": {
      return { format: "png" };
    }
    case "image/jpeg": {
      return {
        format: "jpeg",
        ...quality === void 0 ? {} : { quality: Math.round(quality * 100) }
      };
    }
    case "image/webp": {
      return {
        format: "webp",
        ...quality === void 0 ? {} : { quality: Math.round(quality * 100) }
      };
    }
  }
  throw new InvalidArgumentException(`Image format '${type}' is not a supported format`);
}
function deserializeDOMRect(result) {
  var _a3, _b2, _c2, _d2;
  if (result.type !== "object" || result.value === void 0) {
    return;
  }
  const x = (_a3 = result.value.find(([key]) => {
    return key === "x";
  })) == null ? void 0 : _a3[1];
  const y = (_b2 = result.value.find(([key]) => {
    return key === "y";
  })) == null ? void 0 : _b2[1];
  const height = (_c2 = result.value.find(([key]) => {
    return key === "height";
  })) == null ? void 0 : _c2[1];
  const width = (_d2 = result.value.find(([key]) => {
    return key === "width";
  })) == null ? void 0 : _d2[1];
  if ((x == null ? void 0 : x.type) !== "number" || (y == null ? void 0 : y.type) !== "number" || (height == null ? void 0 : height.type) !== "number" || (width == null ? void 0 : width.type) !== "number") {
    return;
  }
  return {
    x: x.value,
    y: y.value,
    width: width.value,
    height: height.value
  };
}
function normalizeRect(box) {
  return {
    ...box.width < 0 ? {
      x: box.x + box.width,
      width: -box.width
    } : {
      x: box.x,
      width: box.width
    },
    ...box.height < 0 ? {
      y: box.y + box.height,
      height: -box.height
    } : {
      y: box.y,
      height: box.height
    }
  };
}
function getIntersectionRect(first, second) {
  first = normalizeRect(first);
  second = normalizeRect(second);
  const x = Math.max(first.x, second.x);
  const y = Math.max(first.y, second.y);
  return {
    x,
    y,
    width: Math.max(Math.min(first.x + first.width, second.x + second.width) - x, 0),
    height: Math.max(Math.min(first.y + first.height, second.y + second.height) - y, 0)
  };
}
function parseInteger(value) {
  value = value.trim();
  if (!/^[0-9]+$/.test(value)) {
    throw new InvalidArgumentException(`Invalid integer: ${value}`);
  }
  return parseInt(value);
}
class WorkerRealm extends Realm$1 {
  constructor(cdpClient, eventManager, executionContextId, logger, origin, ownerRealms, realmId, realmStorage, realmType) {
    super(cdpClient, eventManager, executionContextId, logger, origin, realmId, realmStorage);
    __privateAdd(this, _realmType);
    __privateAdd(this, _ownerRealms);
    __privateSet(this, _ownerRealms, ownerRealms);
    __privateSet(this, _realmType, realmType);
    this.initialize();
  }
  get associatedBrowsingContexts() {
    return __privateGet(this, _ownerRealms).flatMap((realm) => realm.associatedBrowsingContexts);
  }
  get realmType() {
    return __privateGet(this, _realmType);
  }
  get source() {
    var _a3;
    return {
      realm: this.realmId,
      // This is a hack to make Puppeteer able to track workers.
      // TODO: remove after Puppeteer tracks workers by owners and use the base version.
      context: (_a3 = this.associatedBrowsingContexts[0]) == null ? void 0 : _a3.id
    };
  }
  get realmInfo() {
    const owners = __privateGet(this, _ownerRealms).map((realm) => realm.realmId);
    const { realmType } = this;
    switch (realmType) {
      case "dedicated-worker": {
        const owner = owners[0];
        if (owner === void 0 || owners.length !== 1) {
          throw new Error("Dedicated worker must have exactly one owner");
        }
        return {
          ...this.baseInfo,
          type: realmType,
          owners: [owner]
        };
      }
      case "service-worker":
      case "shared-worker": {
        return {
          ...this.baseInfo,
          type: realmType
        };
      }
    }
  }
}
_realmType = new WeakMap();
_ownerRealms = new WeakMap();
const specifiers = ["%s", "%d", "%i", "%f", "%o", "%O", "%c"];
function isFormatSpecifier(str) {
  return specifiers.some((spec) => str.includes(spec));
}
function logMessageFormatter(args) {
  let output = "";
  const argFormat = args[0].value.toString();
  const argValues = args.slice(1, void 0);
  const tokens = argFormat.split(new RegExp(specifiers.map((spec) => `(${spec})`).join("|"), "g"));
  for (const token of tokens) {
    if (token === void 0 || token === "") {
      continue;
    }
    if (isFormatSpecifier(token)) {
      const arg = argValues.shift();
      assert(arg, `Less value is provided: "${getRemoteValuesText(args, false)}"`);
      if (token === "%s") {
        output += stringFromArg(arg);
      } else if (token === "%d" || token === "%i") {
        if (arg.type === "bigint" || arg.type === "number" || arg.type === "string") {
          output += parseInt(arg.value.toString(), 10);
        } else {
          output += "NaN";
        }
      } else if (token === "%f") {
        if (arg.type === "bigint" || arg.type === "number" || arg.type === "string") {
          output += parseFloat(arg.value.toString());
        } else {
          output += "NaN";
        }
      } else {
        output += toJson(arg);
      }
    } else {
      output += token;
    }
  }
  if (argValues.length > 0) {
    throw new Error(`More value is provided: "${getRemoteValuesText(args, false)}"`);
  }
  return output;
}
function toJson(arg) {
  var _a3;
  if (arg.type !== "array" && arg.type !== "bigint" && arg.type !== "date" && arg.type !== "number" && arg.type !== "object" && arg.type !== "string") {
    return stringFromArg(arg);
  }
  if (arg.type === "bigint") {
    return `${arg.value.toString()}n`;
  }
  if (arg.type === "number") {
    return arg.value.toString();
  }
  if (["date", "string"].includes(arg.type)) {
    return JSON.stringify(arg.value);
  }
  if (arg.type === "object") {
    return `{${arg.value.map((pair) => {
      return `${JSON.stringify(pair[0])}:${toJson(pair[1])}`;
    }).join(",")}}`;
  }
  if (arg.type === "array") {
    return `[${((_a3 = arg.value) == null ? void 0 : _a3.map((val) => toJson(val)).join(",")) ?? ""}]`;
  }
  throw Error(`Invalid value type: ${arg}`);
}
function stringFromArg(arg) {
  var _a3, _b2, _c2, _d2;
  if (!Object.hasOwn(arg, "value")) {
    return arg.type;
  }
  switch (arg.type) {
    case "string":
    case "number":
    case "boolean":
    case "bigint":
      return String(arg.value);
    case "regexp":
      return `/${arg.value.pattern}/${arg.value.flags ?? ""}`;
    case "date":
      return new Date(arg.value).toString();
    case "object":
      return `Object(${((_a3 = arg.value) == null ? void 0 : _a3.length) ?? ""})`;
    case "array":
      return `Array(${((_b2 = arg.value) == null ? void 0 : _b2.length) ?? ""})`;
    case "map":
      return `Map(${(_c2 = arg.value) == null ? void 0 : _c2.length})`;
    case "set":
      return `Set(${(_d2 = arg.value) == null ? void 0 : _d2.length})`;
    default:
      return arg.type;
  }
}
function getRemoteValuesText(args, formatText) {
  const arg = args[0];
  if (!arg) {
    return "";
  }
  if (arg.type === "string" && isFormatSpecifier(arg.value.toString()) && formatText) {
    return logMessageFormatter(args);
  }
  return args.map((arg2) => {
    return stringFromArg(arg2);
  }).join(" ");
}
var _a$4;
function getBidiStackTrace(cdpStackTrace) {
  const stackFrames = cdpStackTrace == null ? void 0 : cdpStackTrace.callFrames.map((callFrame) => {
    return {
      columnNumber: callFrame.columnNumber,
      functionName: callFrame.functionName,
      lineNumber: callFrame.lineNumber,
      url: callFrame.url
    };
  });
  return stackFrames ? { callFrames: stackFrames } : void 0;
}
function getLogLevel(consoleApiType) {
  if (["error", "assert"].includes(consoleApiType)) {
    return "error";
  }
  if (["debug", "trace"].includes(consoleApiType)) {
    return "debug";
  }
  if (["warn", "warning"].includes(consoleApiType)) {
    return "warn";
  }
  return "info";
}
function getLogMethod(consoleApiType) {
  switch (consoleApiType) {
    case "warning":
      return "warn";
    case "startGroup":
      return "group";
    case "startGroupCollapsed":
      return "groupCollapsed";
    case "endGroup":
      return "groupEnd";
  }
  return consoleApiType;
}
class LogManager {
  constructor(cdpTarget, realmStorage, eventManager, logger) {
    __privateAdd(this, _LogManager_instances);
    __privateAdd(this, _eventManager9);
    __privateAdd(this, _realmStorage4);
    __privateAdd(this, _cdpTarget2);
    __privateAdd(this, _logger9);
    __privateSet(this, _cdpTarget2, cdpTarget);
    __privateSet(this, _realmStorage4, realmStorage);
    __privateSet(this, _eventManager9, eventManager);
    __privateSet(this, _logger9, logger);
  }
  static create(cdpTarget, realmStorage, eventManager, logger) {
    var _a3;
    const logManager = new _a$4(cdpTarget, realmStorage, eventManager, logger);
    __privateMethod(_a3 = logManager, _LogManager_instances, initializeEntryAddedEventListener_fn).call(_a3);
    return logManager;
  }
}
_eventManager9 = new WeakMap();
_realmStorage4 = new WeakMap();
_cdpTarget2 = new WeakMap();
_logger9 = new WeakMap();
_LogManager_instances = new WeakSet();
heuristicSerializeArg_fn = async function(arg, realm) {
  switch (arg.type) {
    case "undefined":
      return { type: "undefined" };
    case "boolean":
      return { type: "boolean", value: arg.value };
    case "string":
      return { type: "string", value: arg.value };
    case "number":
      return { type: "number", value: arg.unserializableValue ?? arg.value };
    case "bigint":
      if (arg.unserializableValue !== void 0 && arg.unserializableValue[arg.unserializableValue.length - 1] === "n") {
        return {
          type: arg.type,
          value: arg.unserializableValue.slice(0, -1)
        };
      }
      break;
    case "object":
      if (arg.subtype === "null") {
        return { type: "null" };
      }
      break;
  }
  return await realm.serializeCdpObject(
    arg,
    "none"
    /* Script.ResultOwnership.None */
  );
};
initializeEntryAddedEventListener_fn = function() {
  __privateGet(this, _cdpTarget2).cdpClient.on("Runtime.consoleAPICalled", (params) => {
    var _a3, _b2;
    const realm = __privateGet(this, _realmStorage4).findRealm({
      cdpSessionId: __privateGet(this, _cdpTarget2).cdpSessionId,
      executionContextId: params.executionContextId
    });
    if (realm === void 0) {
      (_b2 = (_a3 = __privateGet(this, _logger9)) == null ? void 0 : _a3.call(this, LogType.cdp)) == null ? void 0 : _b2(params);
      return;
    }
    const argsPromise = Promise.all(params.args.map((arg) => __privateMethod(this, _LogManager_instances, heuristicSerializeArg_fn).call(this, arg, realm)));
    for (const browsingContext of realm.associatedBrowsingContexts) {
      __privateGet(this, _eventManager9).registerPromiseEvent(argsPromise.then((args) => ({
        kind: "success",
        value: {
          type: "event",
          method: Log.EventNames.LogEntryAdded,
          params: {
            level: getLogLevel(params.type),
            source: realm.source,
            text: getRemoteValuesText(args, true),
            timestamp: Math.round(params.timestamp),
            stackTrace: getBidiStackTrace(params.stackTrace),
            type: "console",
            method: getLogMethod(params.type),
            args
          }
        }
      }), (error) => ({
        kind: "error",
        error
      })), browsingContext.id, Log.EventNames.LogEntryAdded);
    }
  });
  __privateGet(this, _cdpTarget2).cdpClient.on("Runtime.exceptionThrown", (params) => {
    var _a3, _b2, _c2;
    const realm = __privateGet(this, _realmStorage4).findRealm({
      cdpSessionId: __privateGet(this, _cdpTarget2).cdpSessionId,
      executionContextId: params.exceptionDetails.executionContextId
    });
    if (realm === void 0) {
      (_b2 = (_a3 = __privateGet(this, _logger9)) == null ? void 0 : _a3.call(this, LogType.cdp)) == null ? void 0 : _b2(params);
      return;
    }
    for (const browsingContext of realm.associatedBrowsingContexts) {
      __privateGet(this, _eventManager9).registerPromiseEvent(__privateMethod(_c2 = _a$4, _LogManager_static, getExceptionText_fn).call(_c2, params, realm).then((text) => ({
        kind: "success",
        value: {
          type: "event",
          method: Log.EventNames.LogEntryAdded,
          params: {
            level: "error",
            source: realm.source,
            text,
            timestamp: Math.round(params.timestamp),
            stackTrace: getBidiStackTrace(params.exceptionDetails.stackTrace),
            type: "javascript"
          }
        }
      }), (error) => ({
        kind: "error",
        error
      })), browsingContext.id, Log.EventNames.LogEntryAdded);
    }
  });
};
_LogManager_static = new WeakSet();
getExceptionText_fn = async function(params, realm) {
  if (!params.exceptionDetails.exception) {
    return params.exceptionDetails.text;
  }
  if (realm === void 0) {
    return JSON.stringify(params.exceptionDetails.exception);
  }
  return await realm.stringifyObject(params.exceptionDetails.exception);
};
__privateAdd(LogManager, _LogManager_static);
_a$4 = LogManager;
class CollectorsStorage {
  constructor(maxEncodedDataSize, logger) {
    __privateAdd(this, _CollectorsStorage_instances);
    __privateAdd(this, _collectors, /* @__PURE__ */ new Map());
    __privateAdd(this, _responseCollectors, /* @__PURE__ */ new Map());
    __privateAdd(this, _requestBodyCollectors, /* @__PURE__ */ new Map());
    __privateAdd(this, _maxEncodedDataSize);
    __privateAdd(this, _logger10);
    __privateSet(this, _maxEncodedDataSize, maxEncodedDataSize);
    __privateSet(this, _logger10, logger);
  }
  addDataCollector(params) {
    if (params.maxEncodedDataSize < 1 || params.maxEncodedDataSize > __privateGet(this, _maxEncodedDataSize)) {
      throw new InvalidArgumentException(`Max encoded data size should be between 1 and ${__privateGet(this, _maxEncodedDataSize)}`);
    }
    const collectorId = uuidv4();
    __privateGet(this, _collectors).set(collectorId, params);
    return collectorId;
  }
  isCollected(requestId, dataType, collectorId) {
    if (collectorId !== void 0 && !__privateGet(this, _collectors).has(collectorId)) {
      throw new NoSuchNetworkCollectorException(`Unknown collector ${collectorId}`);
    }
    if (dataType === void 0) {
      return this.isCollected(requestId, "response", collectorId) || this.isCollected(requestId, "request", collectorId);
    }
    const requestToCollectorsMap = __privateMethod(this, _CollectorsStorage_instances, getRequestToCollectorMap_fn).call(this, dataType).get(requestId);
    if (requestToCollectorsMap === void 0 || requestToCollectorsMap.size === 0) {
      return false;
    }
    if (collectorId === void 0) {
      return true;
    }
    if (!requestToCollectorsMap.has(collectorId)) {
      return false;
    }
    return true;
  }
  disownData(requestId, dataType, collectorId) {
    var _a3, _b2;
    const requestToCollectorsMap = __privateMethod(this, _CollectorsStorage_instances, getRequestToCollectorMap_fn).call(this, dataType);
    if (collectorId !== void 0) {
      (_a3 = requestToCollectorsMap.get(requestId)) == null ? void 0 : _a3.delete(collectorId);
    }
    if (collectorId === void 0 || ((_b2 = requestToCollectorsMap.get(requestId)) == null ? void 0 : _b2.size) === 0) {
      requestToCollectorsMap.delete(requestId);
    }
  }
  collectIfNeeded(request, dataType, topLevelBrowsingContext, userContext) {
    const collectorIds = [...__privateGet(this, _collectors).keys()].filter((collectorId) => __privateMethod(this, _CollectorsStorage_instances, shouldCollectRequest_fn).call(this, collectorId, request, dataType, topLevelBrowsingContext, userContext));
    if (collectorIds.length > 0) {
      __privateMethod(this, _CollectorsStorage_instances, getRequestToCollectorMap_fn).call(this, dataType).set(request.id, new Set(collectorIds));
    }
  }
  removeDataCollector(collectorId) {
    if (!__privateGet(this, _collectors).has(collectorId)) {
      throw new NoSuchNetworkCollectorException(`Collector ${collectorId} does not exist`);
    }
    __privateGet(this, _collectors).delete(collectorId);
    const affectedRequests = [];
    for (const [requestId, collectorIds] of __privateGet(this, _responseCollectors)) {
      if (collectorIds.has(collectorId)) {
        collectorIds.delete(collectorId);
        if (collectorIds.size === 0) {
          __privateGet(this, _responseCollectors).delete(requestId);
          affectedRequests.push(requestId);
        }
      }
    }
    for (const [requestId, collectorIds] of __privateGet(this, _requestBodyCollectors)) {
      if (collectorIds.has(collectorId)) {
        collectorIds.delete(collectorId);
        if (collectorIds.size === 0) {
          __privateGet(this, _requestBodyCollectors).delete(requestId);
          affectedRequests.push(requestId);
        }
      }
    }
    return affectedRequests;
  }
}
_collectors = new WeakMap();
_responseCollectors = new WeakMap();
_requestBodyCollectors = new WeakMap();
_maxEncodedDataSize = new WeakMap();
_logger10 = new WeakMap();
_CollectorsStorage_instances = new WeakSet();
getRequestToCollectorMap_fn = function(dataType) {
  switch (dataType) {
    case "response":
      return __privateGet(this, _responseCollectors);
    case "request":
      return __privateGet(this, _requestBodyCollectors);
    default:
      throw new UnsupportedOperationException(`Unsupported data type ${dataType}`);
  }
};
shouldCollectRequest_fn = function(collectorId, request, dataType, topLevelBrowsingContext, userContext) {
  var _a3, _b2, _c2, _d2, _e, _f;
  const collector = __privateGet(this, _collectors).get(collectorId);
  if (collector === void 0) {
    throw new NoSuchNetworkCollectorException(`Unknown collector ${collectorId}`);
  }
  if (collector.userContexts && !collector.userContexts.includes(userContext)) {
    return false;
  }
  if (collector.contexts && !collector.contexts.includes(topLevelBrowsingContext)) {
    return false;
  }
  if (!collector.dataTypes.includes(dataType)) {
    return false;
  }
  if (dataType === "request" && request.bodySize > collector.maxEncodedDataSize) {
    (_b2 = (_a3 = __privateGet(this, _logger10)) == null ? void 0 : _a3.call(this, LogType.debug)) == null ? void 0 : _b2(`Request's ${request.id} body size is too big for the collector ${collectorId}`);
    return false;
  }
  if (dataType === "response" && request.encodedResponseBodySize > collector.maxEncodedDataSize) {
    (_d2 = (_c2 = __privateGet(this, _logger10)) == null ? void 0 : _c2.call(this, LogType.debug)) == null ? void 0 : _d2(`Request's ${request.id} response is too big for the collector ${collectorId}`);
    return false;
  }
  (_f = (_e = __privateGet(this, _logger10)) == null ? void 0 : _e.call(this, LogType.debug)) == null ? void 0 : _f(`Collector ${collectorId} collected ${dataType} of ${request.id}`);
  return true;
};
class DefaultMap extends Map {
  constructor(getDefaultValue, entries) {
    super(entries);
    /** The default value to return whenever a key is not present in the map. */
    __privateAdd(this, _getDefaultValue);
    __privateSet(this, _getDefaultValue, getDefaultValue);
  }
  get(key) {
    if (!this.has(key)) {
      this.set(key, __privateGet(this, _getDefaultValue).call(this, key));
    }
    return super.get(key);
  }
}
_getDefaultValue = new WeakMap();
var _a$3;
const REALM_REGEX = new RegExp('(?<=realm=").*(?=")');
class NetworkRequest {
  constructor(id, eventManager, networkStorage, cdpTarget, redirectCount = 0, logger) {
    __privateAdd(this, _NetworkRequest_instances);
    /**
     * Each network request has an associated request id, which is a string
     * uniquely identifying that request.
     *
     * The identifier for a request resulting from a redirect matches that of the
     * request that initiated it.
     */
    __privateAdd(this, _id4);
    __privateAdd(this, _fetchId);
    /**
     * Indicates the network intercept phase, if the request is currently blocked.
     * Undefined necessarily implies that the request is not blocked.
     */
    __privateAdd(this, _interceptPhase);
    __privateAdd(this, _servedFromCache, false);
    __privateAdd(this, _redirectCount);
    __privateAdd(this, _bodySize, 0);
    // Tracked encoded data size while the response is loading.
    __privateAdd(this, _encodedResponseBodySize, 0);
    // Tracked decoded data size while the response is loading.
    __privateAdd(this, _decodedResponseBodySize, 0);
    __privateAdd(this, _request, {});
    __privateAdd(this, _requestOverrides);
    __privateAdd(this, _responseOverrides);
    __privateAdd(this, _response, {});
    __privateAdd(this, _eventManager10);
    __privateAdd(this, _networkStorage2);
    __privateAdd(this, _cdpTarget3);
    __privateAdd(this, _logger11);
    __privateAdd(this, _emittedEvents, {
      [Network.EventNames.AuthRequired]: false,
      [Network.EventNames.BeforeRequestSent]: false,
      [Network.EventNames.FetchError]: false,
      [Network.EventNames.ResponseCompleted]: false,
      [Network.EventNames.ResponseStarted]: false
    });
    __publicField(this, "waitNextPhase", new Deferred());
    __privateSet(this, _id4, id);
    __privateSet(this, _eventManager10, eventManager);
    __privateSet(this, _networkStorage2, networkStorage);
    __privateSet(this, _cdpTarget3, cdpTarget);
    __privateSet(this, _redirectCount, redirectCount);
    __privateSet(this, _logger11, logger);
  }
  get id() {
    return __privateGet(this, _id4);
  }
  get fetchId() {
    return __privateGet(this, _fetchId);
  }
  /**
   * When blocked returns the phase for it
   */
  get interceptPhase() {
    return __privateGet(this, _interceptPhase);
  }
  get url() {
    var _a3, _b2, _c2, _d2, _e, _f, _g, _h;
    const fragment = ((_a3 = __privateGet(this, _request).info) == null ? void 0 : _a3.request.urlFragment) ?? ((_b2 = __privateGet(this, _request).paused) == null ? void 0 : _b2.request.urlFragment) ?? "";
    const url = ((_c2 = __privateGet(this, _response).paused) == null ? void 0 : _c2.request.url) ?? ((_d2 = __privateGet(this, _requestOverrides)) == null ? void 0 : _d2.url) ?? ((_e = __privateGet(this, _response).info) == null ? void 0 : _e.url) ?? ((_f = __privateGet(this, _request).auth) == null ? void 0 : _f.request.url) ?? ((_g = __privateGet(this, _request).info) == null ? void 0 : _g.request.url) ?? ((_h = __privateGet(this, _request).paused) == null ? void 0 : _h.request.url) ?? _a$3.unknownParameter;
    return `${url}${fragment}`;
  }
  get redirectCount() {
    return __privateGet(this, _redirectCount);
  }
  get cdpTarget() {
    return __privateGet(this, _cdpTarget3);
  }
  /** CdpTarget can be changed when frame is moving out of process. */
  updateCdpTarget(cdpTarget) {
    var _a3, _b2;
    if (cdpTarget !== __privateGet(this, _cdpTarget3)) {
      (_b2 = (_a3 = __privateGet(this, _logger11)) == null ? void 0 : _a3.call(this, LogType.debugInfo)) == null ? void 0 : _b2(`Request ${this.id} was moved from ${__privateGet(this, _cdpTarget3).id} to ${cdpTarget.id}`);
      __privateSet(this, _cdpTarget3, cdpTarget);
    }
  }
  get cdpClient() {
    return __privateGet(this, _cdpTarget3).cdpClient;
  }
  isRedirecting() {
    return Boolean(__privateGet(this, _request).info);
  }
  get bodySize() {
    return __privateGet(this, _bodySize);
  }
  handleRedirect(event) {
    __privateGet(this, _response).hasExtraInfo = false;
    __privateSet(this, _decodedResponseBodySize, 0);
    __privateSet(this, _encodedResponseBodySize, 0);
    __privateGet(this, _response).info = event.redirectResponse;
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this, {
      wasRedirected: true
    });
  }
  onRequestWillBeSentEvent(event) {
    __privateGet(this, _request).info = event;
    __privateMethod(this, _NetworkRequest_instances, updateBodySize_fn).call(this);
    __privateGet(this, _networkStorage2).collectIfNeeded(
      this,
      "request"
      /* Network.DataType.Request */
    );
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
  }
  onRequestWillBeSentExtraInfoEvent(event) {
    __privateGet(this, _request).extraInfo = event;
    __privateMethod(this, _NetworkRequest_instances, updateBodySize_fn).call(this);
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
  }
  onResponseReceivedExtraInfoEvent(event) {
    if (event.statusCode >= 300 && event.statusCode <= 399 && __privateGet(this, _request).info && event.headers["location"] === __privateGet(this, _request).info.request.url) {
      return;
    }
    __privateGet(this, _response).extraInfo = event;
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
  }
  onResponseReceivedEvent(event) {
    __privateGet(this, _response).hasExtraInfo = event.hasExtraInfo;
    __privateGet(this, _response).info = event.response;
    __privateSet(this, _encodedResponseBodySize, event.response.encodedDataLength);
    __privateGet(this, _networkStorage2).collectIfNeeded(
      this,
      "response"
      /* Network.DataType.Response */
    );
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
  }
  onServedFromCache() {
    __privateSet(this, _servedFromCache, true);
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
  }
  onLoadingFinishedEvent(event) {
    __privateGet(this, _response).loadingFinished = event;
    __privateSet(this, _encodedResponseBodySize, event.encodedDataLength);
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
  }
  onDataReceivedEvent(event) {
    __privateSet(this, _decodedResponseBodySize, __privateGet(this, _decodedResponseBodySize) + event.dataLength);
    __privateSet(this, _encodedResponseBodySize, __privateGet(this, _encodedResponseBodySize) + event.encodedDataLength);
  }
  onLoadingFailedEvent(event) {
    __privateGet(this, _response).loadingFailed = event;
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
    __privateMethod(this, _NetworkRequest_instances, emitEvent_fn).call(this, () => {
      return {
        method: Network.EventNames.FetchError,
        params: {
          ...__privateMethod(this, _NetworkRequest_instances, getBaseEventParams_fn).call(this),
          errorText: event.errorText
        }
      };
    });
    this.disposeData();
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-failRequest */
  async failRequest(errorReason) {
    assert(__privateGet(this, _fetchId), "Network Interception not set-up.");
    await this.cdpClient.sendCommand("Fetch.failRequest", {
      requestId: __privateGet(this, _fetchId),
      errorReason
    });
    __privateSet(this, _interceptPhase, void 0);
  }
  onRequestPaused(event) {
    __privateSet(this, _fetchId, event.requestId);
    if (event.responseStatusCode || event.responseErrorReason) {
      __privateGet(this, _response).paused = event;
      if (__privateMethod(this, _NetworkRequest_instances, isBlockedInPhase_fn).call(this, "responseStarted") && // CDP may emit multiple events for a single request
      !__privateGet(this, _emittedEvents)[Network.EventNames.ResponseStarted] && // Continue all response that have not enabled Network domain
      __privateGet(this, _fetchId) !== this.id) {
        __privateSet(this, _interceptPhase, "responseStarted");
      } else {
        void __privateMethod(this, _NetworkRequest_instances, continueResponse_fn).call(this);
      }
    } else {
      __privateGet(this, _request).paused = event;
      if (__privateMethod(this, _NetworkRequest_instances, isBlockedInPhase_fn).call(this, "beforeRequestSent") && // CDP may emit multiple events for a single request
      !__privateGet(this, _emittedEvents)[Network.EventNames.BeforeRequestSent] && // Continue all requests that have not enabled Network domain
      __privateGet(this, _fetchId) !== this.id) {
        __privateSet(this, _interceptPhase, "beforeRequestSent");
      } else {
        void __privateMethod(this, _NetworkRequest_instances, continueRequest_fn).call(this);
      }
    }
    __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
  }
  onAuthRequired(event) {
    __privateSet(this, _fetchId, event.requestId);
    __privateGet(this, _request).auth = event;
    if (__privateMethod(this, _NetworkRequest_instances, isBlockedInPhase_fn).call(this, "authRequired") && // Continue all auth requests that have not enabled Network domain
    __privateGet(this, _fetchId) !== this.id) {
      __privateSet(this, _interceptPhase, "authRequired");
      __privateMethod(this, _NetworkRequest_instances, emitEventsIfReady_fn).call(this);
    } else {
      void __privateMethod(this, _NetworkRequest_instances, continueWithAuth_fn).call(this, {
        response: "Default"
      });
    }
    __privateMethod(this, _NetworkRequest_instances, emitEvent_fn).call(this, () => {
      return {
        method: Network.EventNames.AuthRequired,
        params: {
          ...__privateMethod(this, _NetworkRequest_instances, getBaseEventParams_fn).call(this, "authRequired"),
          response: __privateMethod(this, _NetworkRequest_instances, getResponseEventParams_fn).call(this)
        }
      };
    });
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueRequest */
  async continueRequest(overrides = {}) {
    const overrideHeaders = __privateMethod(this, _NetworkRequest_instances, getOverrideHeader_fn).call(this, overrides.headers, overrides.cookies);
    const headers = cdpFetchHeadersFromBidiNetworkHeaders(overrideHeaders);
    const postData = getCdpBodyFromBiDiBytesValue(overrides.body);
    await __privateMethod(this, _NetworkRequest_instances, continueRequest_fn).call(this, {
      url: overrides.url,
      method: overrides.method,
      headers,
      postData
    });
    __privateSet(this, _requestOverrides, {
      url: overrides.url,
      method: overrides.method,
      headers: overrides.headers,
      cookies: overrides.cookies,
      bodySize: getSizeFromBiDiBytesValue(overrides.body)
    });
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueResponse */
  async continueResponse(overrides = {}) {
    var _a3, _b2, _c2;
    if (this.interceptPhase === "authRequired") {
      if (overrides.credentials) {
        await Promise.all([
          this.waitNextPhase,
          await __privateMethod(this, _NetworkRequest_instances, continueWithAuth_fn).call(this, {
            response: "ProvideCredentials",
            username: overrides.credentials.username,
            password: overrides.credentials.password
          })
        ]);
      } else {
        return await __privateMethod(this, _NetworkRequest_instances, continueWithAuth_fn).call(this, {
          response: "ProvideCredentials"
        });
      }
    }
    if (__privateGet(this, _interceptPhase) === "responseStarted") {
      const overrideHeaders = __privateMethod(this, _NetworkRequest_instances, getOverrideHeader_fn).call(this, overrides.headers, overrides.cookies);
      const responseHeaders = cdpFetchHeadersFromBidiNetworkHeaders(overrideHeaders);
      await __privateMethod(this, _NetworkRequest_instances, continueResponse_fn).call(this, {
        responseCode: overrides.statusCode ?? ((_a3 = __privateGet(this, _response).paused) == null ? void 0 : _a3.responseStatusCode),
        responsePhrase: overrides.reasonPhrase ?? ((_b2 = __privateGet(this, _response).paused) == null ? void 0 : _b2.responseStatusText),
        responseHeaders: responseHeaders ?? ((_c2 = __privateGet(this, _response).paused) == null ? void 0 : _c2.responseHeaders)
      });
      __privateSet(this, _responseOverrides, {
        statusCode: overrides.statusCode,
        headers: overrideHeaders
      });
    }
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueWithAuth */
  async continueWithAuth(authChallenge) {
    let username;
    let password;
    if (authChallenge.action === "provideCredentials") {
      const { credentials } = authChallenge;
      username = credentials.username;
      password = credentials.password;
    }
    const response = cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction(authChallenge.action);
    await __privateMethod(this, _NetworkRequest_instances, continueWithAuth_fn).call(this, {
      response,
      username,
      password
    });
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-provideResponse */
  async provideResponse(overrides) {
    assert(__privateGet(this, _fetchId), "Network Interception not set-up.");
    if (this.interceptPhase === "authRequired") {
      return await __privateMethod(this, _NetworkRequest_instances, continueWithAuth_fn).call(this, {
        response: "ProvideCredentials"
      });
    }
    if (!overrides.body && !overrides.headers) {
      return await __privateMethod(this, _NetworkRequest_instances, continueRequest_fn).call(this);
    }
    const overrideHeaders = __privateMethod(this, _NetworkRequest_instances, getOverrideHeader_fn).call(this, overrides.headers, overrides.cookies);
    const responseHeaders = cdpFetchHeadersFromBidiNetworkHeaders(overrideHeaders);
    const responseCode = overrides.statusCode ?? __privateGet(this, _NetworkRequest_instances, statusCode_get) ?? 200;
    await this.cdpClient.sendCommand("Fetch.fulfillRequest", {
      requestId: __privateGet(this, _fetchId),
      responseCode,
      responsePhrase: overrides.reasonPhrase,
      responseHeaders,
      body: getCdpBodyFromBiDiBytesValue(overrides.body)
    });
    __privateSet(this, _interceptPhase, void 0);
  }
  dispose() {
    this.waitNextPhase.reject(new Error("waitNextPhase disposed"));
  }
  disposeData() {
    __privateSet(this, _request, {});
    __privateSet(this, _response, {});
    __privateSet(this, _requestOverrides, void 0);
    __privateSet(this, _responseOverrides, void 0);
  }
  get encodedResponseBodySize() {
    return __privateGet(this, _encodedResponseBodySize);
  }
  get decodedResponseBodySize() {
    return __privateGet(this, _decodedResponseBodySize);
  }
}
_id4 = new WeakMap();
_fetchId = new WeakMap();
_interceptPhase = new WeakMap();
_servedFromCache = new WeakMap();
_redirectCount = new WeakMap();
_bodySize = new WeakMap();
_encodedResponseBodySize = new WeakMap();
_decodedResponseBodySize = new WeakMap();
_request = new WeakMap();
_requestOverrides = new WeakMap();
_responseOverrides = new WeakMap();
_response = new WeakMap();
_eventManager10 = new WeakMap();
_networkStorage2 = new WeakMap();
_cdpTarget3 = new WeakMap();
_logger11 = new WeakMap();
_emittedEvents = new WeakMap();
_NetworkRequest_instances = new WeakSet();
isDataUrl_fn = function() {
  return this.url.startsWith("data:");
};
isNonInterceptable_fn = function() {
  return (
    // We can't intercept data urls from CDP
    __privateMethod(this, _NetworkRequest_instances, isDataUrl_fn).call(this) || // Cached requests never hit the network
    __privateGet(this, _servedFromCache)
  );
};
method_get = function() {
  var _a3, _b2, _c2, _d2, _e;
  return ((_a3 = __privateGet(this, _requestOverrides)) == null ? void 0 : _a3.method) ?? ((_b2 = __privateGet(this, _request).info) == null ? void 0 : _b2.request.method) ?? ((_c2 = __privateGet(this, _request).paused) == null ? void 0 : _c2.request.method) ?? ((_d2 = __privateGet(this, _request).auth) == null ? void 0 : _d2.request.method) ?? ((_e = __privateGet(this, _response).paused) == null ? void 0 : _e.request.method);
};
navigationId_get = function() {
  if (!__privateGet(this, _request).info || !__privateGet(this, _request).info.loaderId || // When we navigate all CDP network events have `loaderId`
  // CDP's `loaderId` and `requestId` match when
  // that request triggered the loading
  __privateGet(this, _request).info.loaderId !== __privateGet(this, _request).info.requestId) {
    return null;
  }
  return __privateGet(this, _networkStorage2).getNavigationId(__privateGet(this, _NetworkRequest_instances, context_get2) ?? void 0);
};
cookies_get = function() {
  let cookies = [];
  if (__privateGet(this, _request).extraInfo) {
    cookies = __privateGet(this, _request).extraInfo.associatedCookies.filter(({ blockedReasons }) => {
      return !Array.isArray(blockedReasons) || blockedReasons.length === 0;
    }).map(({ cookie }) => cdpToBiDiCookie(cookie));
  }
  return cookies;
};
getBodySizeFromHeaders_fn = function(headers) {
  var _a3, _b2;
  if (headers === void 0) {
    return void 0;
  }
  if (headers["Content-Length"] !== void 0) {
    const bodySize = Number.parseInt(headers["Content-Length"]);
    if (Number.isInteger(bodySize)) {
      return bodySize;
    }
    (_b2 = (_a3 = __privateGet(this, _logger11)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2("Unexpected non-integer 'Content-Length' header");
  }
  return void 0;
};
updateBodySize_fn = function() {
  var _a3, _b2, _c2, _d2, _e;
  if (typeof ((_a3 = __privateGet(this, _requestOverrides)) == null ? void 0 : _a3.bodySize) === "number") {
    __privateSet(this, _bodySize, __privateGet(this, _requestOverrides).bodySize);
    return;
  }
  if (((_b2 = __privateGet(this, _request).info) == null ? void 0 : _b2.request.postDataEntries) !== void 0) {
    __privateSet(this, _bodySize, bidiBodySizeFromCdpPostDataEntries((_c2 = __privateGet(this, _request).info) == null ? void 0 : _c2.request.postDataEntries));
    return;
  }
  __privateSet(this, _bodySize, __privateMethod(this, _NetworkRequest_instances, getBodySizeFromHeaders_fn).call(this, (_d2 = __privateGet(this, _request).info) == null ? void 0 : _d2.request.headers) ?? __privateMethod(this, _NetworkRequest_instances, getBodySizeFromHeaders_fn).call(this, (_e = __privateGet(this, _request).extraInfo) == null ? void 0 : _e.headers) ?? 0);
};
context_get2 = function() {
  var _a3, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k;
  const result = ((_a3 = __privateGet(this, _response).paused) == null ? void 0 : _a3.frameId) ?? ((_b2 = __privateGet(this, _request).info) == null ? void 0 : _b2.frameId) ?? ((_c2 = __privateGet(this, _request).paused) == null ? void 0 : _c2.frameId) ?? ((_d2 = __privateGet(this, _request).auth) == null ? void 0 : _d2.frameId);
  if (result !== void 0) {
    return result;
  }
  if (((_f = (_e = __privateGet(this, _request)) == null ? void 0 : _e.info) == null ? void 0 : _f.initiator.type) === "preflight" && ((_h = (_g = __privateGet(this, _request)) == null ? void 0 : _g.info) == null ? void 0 : _h.initiator.requestId) !== void 0) {
    const maybeInitiator = __privateGet(this, _networkStorage2).getRequestById((_j = (_i = __privateGet(this, _request)) == null ? void 0 : _i.info) == null ? void 0 : _j.initiator.requestId);
    if (maybeInitiator !== void 0) {
      return ((_k = __privateGet(maybeInitiator, _request).info) == null ? void 0 : _k.frameId) ?? null;
    }
  }
  return null;
};
statusCode_get = function() {
  var _a3, _b2, _c2, _d2;
  return ((_a3 = __privateGet(this, _responseOverrides)) == null ? void 0 : _a3.statusCode) ?? ((_b2 = __privateGet(this, _response).paused) == null ? void 0 : _b2.responseStatusCode) ?? ((_c2 = __privateGet(this, _response).extraInfo) == null ? void 0 : _c2.statusCode) ?? ((_d2 = __privateGet(this, _response).info) == null ? void 0 : _d2.status);
};
requestHeaders_get = function() {
  var _a3, _b2, _c2;
  let headers = [];
  if ((_a3 = __privateGet(this, _requestOverrides)) == null ? void 0 : _a3.headers) {
    const headerMap = new DefaultMap(() => []);
    for (const header of __privateGet(this, _requestOverrides).headers) {
      headerMap.get(header.name).push(header.value.value);
    }
    for (const [name, value] of headerMap.entries()) {
      headers.push({
        name,
        value: {
          type: "string",
          value: value.join("\n").trimEnd()
        }
      });
    }
  } else {
    headers = [
      ...bidiNetworkHeadersFromCdpNetworkHeaders((_b2 = __privateGet(this, _request).info) == null ? void 0 : _b2.request.headers),
      ...bidiNetworkHeadersFromCdpNetworkHeaders((_c2 = __privateGet(this, _request).extraInfo) == null ? void 0 : _c2.headers)
    ];
  }
  return headers;
};
authChallenges_get = function() {
  var _a3;
  if (!__privateGet(this, _response).info) {
    return;
  }
  if (!(__privateGet(this, _NetworkRequest_instances, statusCode_get) === 401 || __privateGet(this, _NetworkRequest_instances, statusCode_get) === 407)) {
    return void 0;
  }
  const headerName = __privateGet(this, _NetworkRequest_instances, statusCode_get) === 401 ? "WWW-Authenticate" : "Proxy-Authenticate";
  const authChallenges = [];
  for (const [header, value] of Object.entries(__privateGet(this, _response).info.headers)) {
    if (header.localeCompare(headerName, void 0, { sensitivity: "base" }) === 0) {
      authChallenges.push({
        scheme: value.split(" ").at(0) ?? "",
        realm: ((_a3 = value.match(REALM_REGEX)) == null ? void 0 : _a3.at(0)) ?? ""
      });
    }
  }
  return authChallenges;
};
timings_get = function() {
  var _a3, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  const responseTimeOffset = getTiming(getTiming((_b2 = (_a3 = __privateGet(this, _response).info) == null ? void 0 : _a3.timing) == null ? void 0 : _b2.requestTime) - getTiming((_c2 = __privateGet(this, _request).info) == null ? void 0 : _c2.timestamp));
  return {
    // TODO: Verify this is correct
    timeOrigin: Math.round(getTiming((_d2 = __privateGet(this, _request).info) == null ? void 0 : _d2.wallTime) * 1e3),
    // Timing baseline.
    // TODO: Verify this is correct.
    requestTime: 0,
    // TODO: set if redirect detected.
    redirectStart: 0,
    // TODO: set if redirect detected.
    redirectEnd: 0,
    // TODO: Verify this is correct
    // https://source.chromium.org/chromium/chromium/src/+/main:net/base/load_timing_info.h;l=145
    fetchStart: getTiming((_f = (_e = __privateGet(this, _response).info) == null ? void 0 : _e.timing) == null ? void 0 : _f.workerFetchStart, responseTimeOffset),
    // fetchStart: 0,
    dnsStart: getTiming((_h = (_g = __privateGet(this, _response).info) == null ? void 0 : _g.timing) == null ? void 0 : _h.dnsStart, responseTimeOffset),
    dnsEnd: getTiming((_j = (_i = __privateGet(this, _response).info) == null ? void 0 : _i.timing) == null ? void 0 : _j.dnsEnd, responseTimeOffset),
    connectStart: getTiming((_l = (_k = __privateGet(this, _response).info) == null ? void 0 : _k.timing) == null ? void 0 : _l.connectStart, responseTimeOffset),
    connectEnd: getTiming((_n = (_m = __privateGet(this, _response).info) == null ? void 0 : _m.timing) == null ? void 0 : _n.connectEnd, responseTimeOffset),
    tlsStart: getTiming((_p = (_o = __privateGet(this, _response).info) == null ? void 0 : _o.timing) == null ? void 0 : _p.sslStart, responseTimeOffset),
    requestStart: getTiming((_r = (_q = __privateGet(this, _response).info) == null ? void 0 : _q.timing) == null ? void 0 : _r.sendStart, responseTimeOffset),
    // https://source.chromium.org/chromium/chromium/src/+/main:net/base/load_timing_info.h;l=196
    responseStart: getTiming((_t = (_s = __privateGet(this, _response).info) == null ? void 0 : _s.timing) == null ? void 0 : _t.receiveHeadersStart, responseTimeOffset),
    responseEnd: getTiming((_v = (_u = __privateGet(this, _response).info) == null ? void 0 : _u.timing) == null ? void 0 : _v.receiveHeadersEnd, responseTimeOffset)
  };
};
phaseChanged_fn = function() {
  this.waitNextPhase.resolve();
  this.waitNextPhase = new Deferred();
};
interceptsInPhase_fn = function(phase) {
  if (__privateMethod(this, _NetworkRequest_instances, isNonInterceptable_fn).call(this) || !__privateGet(this, _cdpTarget3).isSubscribedTo(`network.${phase}`)) {
    return /* @__PURE__ */ new Set();
  }
  return __privateGet(this, _networkStorage2).getInterceptsForPhase(this, phase);
};
isBlockedInPhase_fn = function(phase) {
  return __privateMethod(this, _NetworkRequest_instances, interceptsInPhase_fn).call(this, phase).size > 0;
};
emitEventsIfReady_fn = function(options = {}) {
  const requestExtraInfoCompleted = (
    // Flush redirects
    options.wasRedirected || Boolean(__privateGet(this, _response).loadingFailed) || __privateMethod(this, _NetworkRequest_instances, isDataUrl_fn).call(this) || Boolean(__privateGet(this, _request).extraInfo) || // If the request is intercepted during the `authRequired` phase, there
    // will be no `Network.requestWillBeSentExtraInfo` CDP events.
    __privateMethod(this, _NetworkRequest_instances, isBlockedInPhase_fn).call(this, "authRequired") || // Requests from cache don't have extra info
    __privateGet(this, _servedFromCache) || // Sometimes there is no extra info and the response
    // is the only place we can find out
    Boolean(__privateGet(this, _response).info && !__privateGet(this, _response).hasExtraInfo)
  );
  const noInterceptionExpected = __privateMethod(this, _NetworkRequest_instances, isNonInterceptable_fn).call(this);
  const requestInterceptionExpected = !noInterceptionExpected && __privateMethod(this, _NetworkRequest_instances, isBlockedInPhase_fn).call(this, "beforeRequestSent");
  const requestInterceptionCompleted = !requestInterceptionExpected || requestInterceptionExpected && Boolean(__privateGet(this, _request).paused);
  if (Boolean(__privateGet(this, _request).info) && (requestInterceptionExpected ? requestInterceptionCompleted : requestExtraInfoCompleted)) {
    __privateMethod(this, _NetworkRequest_instances, emitEvent_fn).call(this, __privateMethod(this, _NetworkRequest_instances, getBeforeRequestEvent_fn).bind(this));
  }
  const responseExtraInfoCompleted = Boolean(__privateGet(this, _response).extraInfo) || // Response from cache don't have extra info
  __privateGet(this, _servedFromCache) || // Don't expect extra info if the flag is false
  Boolean(__privateGet(this, _response).info && !__privateGet(this, _response).hasExtraInfo);
  const responseInterceptionExpected = !noInterceptionExpected && __privateMethod(this, _NetworkRequest_instances, isBlockedInPhase_fn).call(this, "responseStarted");
  if (__privateGet(this, _response).info || responseInterceptionExpected && Boolean(__privateGet(this, _response).paused)) {
    __privateMethod(this, _NetworkRequest_instances, emitEvent_fn).call(this, __privateMethod(this, _NetworkRequest_instances, getResponseStartedEvent_fn).bind(this));
  }
  const responseInterceptionCompleted = !responseInterceptionExpected || responseInterceptionExpected && Boolean(__privateGet(this, _response).paused);
  const loadingFinished = Boolean(__privateGet(this, _response).loadingFailed) || Boolean(__privateGet(this, _response).loadingFinished);
  if (Boolean(__privateGet(this, _response).info) && responseExtraInfoCompleted && responseInterceptionCompleted && (loadingFinished || options.wasRedirected)) {
    __privateMethod(this, _NetworkRequest_instances, emitEvent_fn).call(this, __privateMethod(this, _NetworkRequest_instances, getResponseReceivedEvent_fn).bind(this));
    __privateGet(this, _networkStorage2).disposeRequest(this.id);
  }
};
continueRequest_fn = async function(overrides = {}) {
  assert(__privateGet(this, _fetchId), "Network Interception not set-up.");
  await this.cdpClient.sendCommand("Fetch.continueRequest", {
    requestId: __privateGet(this, _fetchId),
    url: overrides.url,
    method: overrides.method,
    headers: overrides.headers,
    postData: overrides.postData
  });
  __privateSet(this, _interceptPhase, void 0);
};
continueResponse_fn = async function({ responseCode, responsePhrase, responseHeaders } = {}) {
  assert(__privateGet(this, _fetchId), "Network Interception not set-up.");
  await this.cdpClient.sendCommand("Fetch.continueResponse", {
    requestId: __privateGet(this, _fetchId),
    responseCode,
    responsePhrase,
    responseHeaders
  });
  __privateSet(this, _interceptPhase, void 0);
};
continueWithAuth_fn = async function(authChallengeResponse) {
  assert(__privateGet(this, _fetchId), "Network Interception not set-up.");
  await this.cdpClient.sendCommand("Fetch.continueWithAuth", {
    requestId: __privateGet(this, _fetchId),
    authChallengeResponse
  });
  __privateSet(this, _interceptPhase, void 0);
};
emitEvent_fn = function(getEvent) {
  var _a3, _b2;
  let event;
  try {
    event = getEvent();
  } catch (error) {
    (_b2 = (_a3 = __privateGet(this, _logger11)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(error);
    return;
  }
  if (__privateMethod(this, _NetworkRequest_instances, isIgnoredEvent_fn).call(this) || __privateGet(this, _emittedEvents)[event.method] && // Special case this event can be emitted multiple times
  event.method !== Network.EventNames.AuthRequired) {
    return;
  }
  __privateMethod(this, _NetworkRequest_instances, phaseChanged_fn).call(this);
  __privateGet(this, _emittedEvents)[event.method] = true;
  if (__privateGet(this, _NetworkRequest_instances, context_get2)) {
    __privateGet(this, _eventManager10).registerEvent(Object.assign(event, {
      type: "event"
    }), __privateGet(this, _NetworkRequest_instances, context_get2));
  } else {
    __privateGet(this, _eventManager10).registerGlobalEvent(Object.assign(event, {
      type: "event"
    }));
  }
};
getBaseEventParams_fn = function(phase) {
  var _a3;
  const interceptProps = {
    isBlocked: false
  };
  if (phase) {
    const blockedBy = __privateMethod(this, _NetworkRequest_instances, interceptsInPhase_fn).call(this, phase);
    interceptProps.isBlocked = blockedBy.size > 0;
    if (interceptProps.isBlocked) {
      interceptProps.intercepts = [...blockedBy];
    }
  }
  return {
    context: __privateGet(this, _NetworkRequest_instances, context_get2),
    navigation: __privateGet(this, _NetworkRequest_instances, navigationId_get),
    redirectCount: __privateGet(this, _redirectCount),
    request: __privateMethod(this, _NetworkRequest_instances, getRequestData_fn).call(this),
    // Timestamp should be in milliseconds, while CDP provides it in seconds.
    timestamp: Math.round(getTiming((_a3 = __privateGet(this, _request).info) == null ? void 0 : _a3.wallTime) * 1e3),
    // Contains isBlocked and intercepts
    ...interceptProps
  };
};
getResponseEventParams_fn = function() {
  var _a3, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k;
  if ((_a3 = __privateGet(this, _response).info) == null ? void 0 : _a3.fromDiskCache) {
    __privateGet(this, _response).extraInfo = void 0;
  }
  const cdpHeaders = ((_b2 = __privateGet(this, _response).info) == null ? void 0 : _b2.headers) ?? {};
  const cdpRawHeaders = ((_c2 = __privateGet(this, _response).extraInfo) == null ? void 0 : _c2.headers) ?? {};
  for (const [key, value] of Object.entries(cdpRawHeaders)) {
    cdpHeaders[key] = value;
  }
  const headers = bidiNetworkHeadersFromCdpNetworkHeaders(cdpHeaders);
  const authChallenges = __privateGet(this, _NetworkRequest_instances, authChallenges_get);
  const response = {
    url: this.url,
    protocol: ((_d2 = __privateGet(this, _response).info) == null ? void 0 : _d2.protocol) ?? "",
    status: __privateGet(this, _NetworkRequest_instances, statusCode_get) ?? -1,
    // TODO: Throw an exception or use some other status code?
    statusText: ((_e = __privateGet(this, _response).info) == null ? void 0 : _e.statusText) || ((_f = __privateGet(this, _response).paused) == null ? void 0 : _f.responseStatusText) || "",
    fromCache: ((_g = __privateGet(this, _response).info) == null ? void 0 : _g.fromDiskCache) || ((_h = __privateGet(this, _response).info) == null ? void 0 : _h.fromPrefetchCache) || __privateGet(this, _servedFromCache),
    headers: ((_i = __privateGet(this, _responseOverrides)) == null ? void 0 : _i.headers) ?? headers,
    mimeType: ((_j = __privateGet(this, _response).info) == null ? void 0 : _j.mimeType) || "",
    // TODO: this should be the size for the entire HTTP response.
    bytesReceived: this.encodedResponseBodySize,
    headersSize: computeHeadersSize(headers),
    bodySize: this.encodedResponseBodySize,
    content: {
      size: __privateGet(this, _decodedResponseBodySize)
    },
    ...authChallenges ? { authChallenges } : {}
  };
  return {
    ...response,
    "goog:securityDetails": (_k = __privateGet(this, _response).info) == null ? void 0 : _k.securityDetails
  };
};
getRequestData_fn = function() {
  var _a3, _b2, _c2, _d2, _e, _f;
  const headers = __privateGet(this, _NetworkRequest_instances, requestHeaders_get);
  const request = {
    request: __privateGet(this, _id4),
    url: this.url,
    method: __privateGet(this, _NetworkRequest_instances, method_get) ?? _a$3.unknownParameter,
    headers,
    cookies: __privateGet(this, _NetworkRequest_instances, cookies_get),
    headersSize: computeHeadersSize(headers),
    bodySize: this.bodySize,
    // TODO: populate
    destination: __privateMethod(this, _NetworkRequest_instances, getDestination_fn).call(this),
    // TODO: populate
    initiatorType: __privateMethod(this, _NetworkRequest_instances, getInitiatorType_fn).call(this),
    timings: __privateGet(this, _NetworkRequest_instances, timings_get)
  };
  return {
    ...request,
    "goog:postData": (_b2 = (_a3 = __privateGet(this, _request).info) == null ? void 0 : _a3.request) == null ? void 0 : _b2.postData,
    "goog:hasPostData": (_d2 = (_c2 = __privateGet(this, _request).info) == null ? void 0 : _c2.request) == null ? void 0 : _d2.hasPostData,
    "goog:resourceType": (_e = __privateGet(this, _request).info) == null ? void 0 : _e.type,
    "goog:resourceInitiator": (_f = __privateGet(this, _request).info) == null ? void 0 : _f.initiator
  };
};
/**
 * Heuristic trying to guess the destination.
 * Specification: https://fetch.spec.whatwg.org/#concept-request-destination.
 * Specified values: "audio", "audioworklet", "document", "embed", "font", "frame",
 * "iframe", "image", "json", "manifest", "object", "paintworklet", "report", "script",
 * "serviceworker", "sharedworker", "style", "track", "video", "webidentity", "worker",
 * "xslt".
 */
getDestination_fn = function() {
  var _a3, _b2;
  switch ((_a3 = __privateGet(this, _request).info) == null ? void 0 : _a3.type) {
    case "Script":
      return "script";
    case "Stylesheet":
      return "style";
    case "Image":
      return "image";
    case "Document":
      return ((_b2 = __privateGet(this, _request).info) == null ? void 0 : _b2.initiator.type) === "parser" ? "iframe" : "document";
    default:
      return "";
  }
};
/**
 * Heuristic trying to guess the initiator type.
 * Specification: https://fetch.spec.whatwg.org/#request-initiator-type.
 * Specified values: "audio", "beacon", "body", "css", "early-hints", "embed", "fetch",
 * "font", "frame", "iframe", "image", "img", "input", "link", "object", "ping",
 * "script", "track", "video", "xmlhttprequest", "other".
 */
getInitiatorType_fn = function() {
  var _a3, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j;
  if (((_a3 = __privateGet(this, _request).info) == null ? void 0 : _a3.initiator.type) === "parser") {
    switch ((_b2 = __privateGet(this, _request).info) == null ? void 0 : _b2.type) {
      case "Document":
        return "iframe";
      case "Font":
        return ((_d2 = (_c2 = __privateGet(this, _request).info) == null ? void 0 : _c2.initiator) == null ? void 0 : _d2.url) === ((_e = __privateGet(this, _request).info) == null ? void 0 : _e.documentURL) ? "font" : "css";
      case "Image":
        return ((_g = (_f = __privateGet(this, _request).info) == null ? void 0 : _f.initiator) == null ? void 0 : _g.url) === ((_h = __privateGet(this, _request).info) == null ? void 0 : _h.documentURL) ? "img" : "css";
      case "Script":
        return "script";
      case "Stylesheet":
        return "link";
      default:
        return null;
    }
  }
  if (((_j = (_i = __privateGet(this, _request)) == null ? void 0 : _i.info) == null ? void 0 : _j.type) === "Fetch") {
    return "fetch";
  }
  return null;
};
getBeforeRequestEvent_fn = function() {
  var _a3;
  assert(__privateGet(this, _request).info, "RequestWillBeSentEvent is not set");
  return {
    method: Network.EventNames.BeforeRequestSent,
    params: {
      ...__privateMethod(this, _NetworkRequest_instances, getBaseEventParams_fn).call(this, "beforeRequestSent"),
      initiator: {
        type: __privateMethod(_a3 = _a$3, _NetworkRequest_static, getInitiator_fn).call(_a3, __privateGet(this, _request).info.initiator.type),
        columnNumber: __privateGet(this, _request).info.initiator.columnNumber,
        lineNumber: __privateGet(this, _request).info.initiator.lineNumber,
        stackTrace: __privateGet(this, _request).info.initiator.stack,
        request: __privateGet(this, _request).info.initiator.requestId
      }
    }
  };
};
getResponseStartedEvent_fn = function() {
  return {
    method: Network.EventNames.ResponseStarted,
    params: {
      ...__privateMethod(this, _NetworkRequest_instances, getBaseEventParams_fn).call(this, "responseStarted"),
      response: __privateMethod(this, _NetworkRequest_instances, getResponseEventParams_fn).call(this)
    }
  };
};
getResponseReceivedEvent_fn = function() {
  return {
    method: Network.EventNames.ResponseCompleted,
    params: {
      ...__privateMethod(this, _NetworkRequest_instances, getBaseEventParams_fn).call(this),
      response: __privateMethod(this, _NetworkRequest_instances, getResponseEventParams_fn).call(this)
    }
  };
};
isIgnoredEvent_fn = function() {
  var _a3, _b2;
  const faviconUrl = "/favicon.ico";
  return ((_a3 = __privateGet(this, _request).paused) == null ? void 0 : _a3.request.url.endsWith(faviconUrl)) ?? ((_b2 = __privateGet(this, _request).info) == null ? void 0 : _b2.request.url.endsWith(faviconUrl)) ?? false;
};
getOverrideHeader_fn = function(headers, cookies) {
  if (!headers && !cookies) {
    return void 0;
  }
  let overrideHeaders = headers;
  const cookieHeader = networkHeaderFromCookieHeaders(cookies);
  if (cookieHeader && !overrideHeaders) {
    overrideHeaders = __privateGet(this, _NetworkRequest_instances, requestHeaders_get);
  }
  if (cookieHeader && overrideHeaders) {
    overrideHeaders.filter((header) => header.name.localeCompare("cookie", void 0, {
      sensitivity: "base"
    }) !== 0);
    overrideHeaders.push(cookieHeader);
  }
  return overrideHeaders;
};
_NetworkRequest_static = new WeakSet();
getInitiator_fn = function(initiatorType) {
  switch (initiatorType) {
    case "parser":
    case "script":
    case "preflight":
      return initiatorType;
    default:
      return "other";
  }
};
__privateAdd(NetworkRequest, _NetworkRequest_static);
__publicField(NetworkRequest, "unknownParameter", "UNKNOWN");
_a$3 = NetworkRequest;
function getCdpBodyFromBiDiBytesValue(body) {
  let parsedBody;
  if ((body == null ? void 0 : body.type) === "string") {
    parsedBody = stringToBase64(body.value);
  } else if ((body == null ? void 0 : body.type) === "base64") {
    parsedBody = body.value;
  }
  return parsedBody;
}
function getSizeFromBiDiBytesValue(body) {
  if ((body == null ? void 0 : body.type) === "string") {
    return body.value.length;
  } else if ((body == null ? void 0 : body.type) === "base64") {
    return atob(body.value).length;
  }
  return 0;
}
const MAX_TOTAL_COLLECTED_SIZE = 2e8;
class NetworkStorage {
  constructor(eventManager, browsingContextStorage, browserClient, logger) {
    __privateAdd(this, _NetworkStorage_instances);
    __privateAdd(this, _browsingContextStorage13);
    __privateAdd(this, _eventManager11);
    __privateAdd(this, _collectorsStorage);
    __privateAdd(this, _logger12);
    /**
     * A map from network request ID to Network Request objects.
     * Needed as long as information about requests comes from different events.
     */
    __privateAdd(this, _requests, /* @__PURE__ */ new Map());
    /** A map from intercept ID to track active network intercepts. */
    __privateAdd(this, _intercepts, /* @__PURE__ */ new Map());
    __privateAdd(this, _defaultCacheBehavior, "default");
    __privateSet(this, _browsingContextStorage13, browsingContextStorage);
    __privateSet(this, _eventManager11, eventManager);
    __privateSet(this, _collectorsStorage, new CollectorsStorage(MAX_TOTAL_COLLECTED_SIZE, logger));
    browserClient.on("Target.detachedFromTarget", ({ sessionId }) => {
      this.disposeRequestMap(sessionId);
    });
    __privateSet(this, _logger12, logger);
  }
  onCdpTargetCreated(cdpTarget) {
    const cdpClient = cdpTarget.cdpClient;
    const listeners = [
      [
        "Network.requestWillBeSent",
        (params) => {
          const request = this.getRequestById(params.requestId);
          request == null ? void 0 : request.updateCdpTarget(cdpTarget);
          if (request && request.isRedirecting()) {
            request.handleRedirect(params);
            this.disposeRequest(params.requestId);
            __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, params.requestId, cdpTarget, request.redirectCount + 1).onRequestWillBeSentEvent(params);
          } else {
            __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, params.requestId, cdpTarget).onRequestWillBeSentEvent(params);
          }
        }
      ],
      [
        "Network.requestWillBeSentExtraInfo",
        (params) => {
          const request = __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, params.requestId, cdpTarget);
          request.updateCdpTarget(cdpTarget);
          request.onRequestWillBeSentExtraInfoEvent(params);
        }
      ],
      [
        "Network.responseReceived",
        (params) => {
          const request = __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, params.requestId, cdpTarget);
          request.updateCdpTarget(cdpTarget);
          request.onResponseReceivedEvent(params);
        }
      ],
      [
        "Network.responseReceivedExtraInfo",
        (params) => {
          const request = __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, params.requestId, cdpTarget);
          request.updateCdpTarget(cdpTarget);
          request.onResponseReceivedExtraInfoEvent(params);
        }
      ],
      [
        "Network.requestServedFromCache",
        (params) => {
          const request = __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, params.requestId, cdpTarget);
          request.updateCdpTarget(cdpTarget);
          request.onServedFromCache();
        }
      ],
      [
        "Fetch.requestPaused",
        (event) => {
          const request = __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(
            this,
            // CDP quirk if the Network domain is not present this is undefined
            event.networkId ?? event.requestId,
            cdpTarget
          );
          request.updateCdpTarget(cdpTarget);
          request.onRequestPaused(event);
        }
      ],
      [
        "Fetch.authRequired",
        (event) => {
          let request = this.getRequestByFetchId(event.requestId);
          if (!request) {
            request = __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, event.requestId, cdpTarget);
          }
          request.updateCdpTarget(cdpTarget);
          request.onAuthRequired(event);
        }
      ],
      [
        "Network.dataReceived",
        (params) => {
          const request = this.getRequestById(params.requestId);
          request == null ? void 0 : request.updateCdpTarget(cdpTarget);
          request == null ? void 0 : request.onDataReceivedEvent(params);
        }
      ],
      [
        "Network.loadingFailed",
        (params) => {
          const request = __privateMethod(this, _NetworkStorage_instances, getOrCreateNetworkRequest_fn).call(this, params.requestId, cdpTarget);
          request.updateCdpTarget(cdpTarget);
          request.onLoadingFailedEvent(params);
        }
      ],
      [
        "Network.loadingFinished",
        (params) => {
          const request = this.getRequestById(params.requestId);
          request == null ? void 0 : request.updateCdpTarget(cdpTarget);
          request == null ? void 0 : request.onLoadingFinishedEvent(params);
        }
      ]
    ];
    for (const [event, listener] of listeners) {
      cdpClient.on(event, listener);
    }
  }
  async getCollectedData(params) {
    if (!__privateGet(this, _collectorsStorage).isCollected(params.request, params.dataType, params.collector)) {
      throw new NoSuchNetworkDataException(params.collector === void 0 ? `No collected ${params.dataType} data` : `Collector ${params.collector} didn't collect ${params.dataType} data`);
    }
    if (params.disown && params.collector === void 0) {
      throw new InvalidArgumentException("Cannot disown collected data without collector ID");
    }
    const request = this.getRequestById(params.request);
    if (request === void 0) {
      throw new NoSuchNetworkDataException(`No data for ${params.request}`);
    }
    let result = void 0;
    switch (params.dataType) {
      case "response":
        result = await __privateMethod(this, _NetworkStorage_instances, getCollectedResponseData_fn).call(this, request);
        break;
      case "request":
        result = await __privateMethod(this, _NetworkStorage_instances, getCollectedRequestData_fn).call(this, request);
        break;
      default:
        throw new UnsupportedOperationException(`Unsupported data type ${params.dataType}`);
    }
    if (params.disown && params.collector !== void 0) {
      __privateGet(this, _collectorsStorage).disownData(request.id, params.dataType, params.collector);
      this.disposeRequest(request.id);
    }
    return result;
  }
  collectIfNeeded(request, dataType) {
    __privateGet(this, _collectorsStorage).collectIfNeeded(request, dataType, request.cdpTarget.topLevelId, request.cdpTarget.userContext);
  }
  getInterceptionStages(browsingContextId) {
    const stages = {
      request: false,
      response: false,
      auth: false
    };
    for (const intercept of __privateGet(this, _intercepts).values()) {
      if (intercept.contexts && !intercept.contexts.includes(browsingContextId)) {
        continue;
      }
      stages.request || (stages.request = intercept.phases.includes(
        "beforeRequestSent"
        /* Network.InterceptPhase.BeforeRequestSent */
      ));
      stages.response || (stages.response = intercept.phases.includes(
        "responseStarted"
        /* Network.InterceptPhase.ResponseStarted */
      ));
      stages.auth || (stages.auth = intercept.phases.includes(
        "authRequired"
        /* Network.InterceptPhase.AuthRequired */
      ));
    }
    return stages;
  }
  getInterceptsForPhase(request, phase) {
    if (request.url === NetworkRequest.unknownParameter) {
      return /* @__PURE__ */ new Set();
    }
    const intercepts = /* @__PURE__ */ new Set();
    for (const [interceptId, intercept] of __privateGet(this, _intercepts).entries()) {
      if (!intercept.phases.includes(phase) || intercept.contexts && !intercept.contexts.includes(request.cdpTarget.topLevelId)) {
        continue;
      }
      if (intercept.urlPatterns.length === 0) {
        intercepts.add(interceptId);
        continue;
      }
      for (const pattern of intercept.urlPatterns) {
        if (matchUrlPattern(pattern, request.url)) {
          intercepts.add(interceptId);
          break;
        }
      }
    }
    return intercepts;
  }
  disposeRequestMap(sessionId) {
    for (const request of __privateGet(this, _requests).values()) {
      if (request.cdpClient.sessionId === sessionId) {
        __privateGet(this, _requests).delete(request.id);
        request.dispose();
      }
    }
  }
  /**
   * Adds the given entry to the intercept map.
   * URL patterns are assumed to be parsed.
   *
   * @return The intercept ID.
   */
  addIntercept(value) {
    const interceptId = uuidv4();
    __privateGet(this, _intercepts).set(interceptId, value);
    return interceptId;
  }
  /**
   * Removes the given intercept from the intercept map.
   * Throws NoSuchInterceptException if the intercept does not exist.
   */
  removeIntercept(intercept) {
    if (!__privateGet(this, _intercepts).has(intercept)) {
      throw new NoSuchInterceptException(`Intercept '${intercept}' does not exist.`);
    }
    __privateGet(this, _intercepts).delete(intercept);
  }
  getRequestsByTarget(target) {
    const requests2 = [];
    for (const request of __privateGet(this, _requests).values()) {
      if (request.cdpTarget === target) {
        requests2.push(request);
      }
    }
    return requests2;
  }
  getRequestById(id) {
    return __privateGet(this, _requests).get(id);
  }
  getRequestByFetchId(fetchId) {
    for (const request of __privateGet(this, _requests).values()) {
      if (request.fetchId === fetchId) {
        return request;
      }
    }
    return;
  }
  addRequest(request) {
    __privateGet(this, _requests).set(request.id, request);
  }
  /**
   * Disposes the given request, if no collectors targeting it are left.
   */
  disposeRequest(id) {
    var _a3;
    if (__privateGet(this, _collectorsStorage).isCollected(id)) {
      (_a3 = __privateGet(this, _requests).get(id)) == null ? void 0 : _a3.disposeData();
      return;
    }
    __privateGet(this, _requests).delete(id);
  }
  /**
   * Gets the virtual navigation ID for the given navigable ID.
   */
  getNavigationId(contextId) {
    var _a3;
    if (contextId === void 0) {
      return null;
    }
    return ((_a3 = __privateGet(this, _browsingContextStorage13).findContext(contextId)) == null ? void 0 : _a3.navigationId) ?? null;
  }
  set defaultCacheBehavior(behavior) {
    __privateSet(this, _defaultCacheBehavior, behavior);
  }
  get defaultCacheBehavior() {
    return __privateGet(this, _defaultCacheBehavior);
  }
  addDataCollector(params) {
    return __privateGet(this, _collectorsStorage).addDataCollector(params);
  }
  removeDataCollector(params) {
    const releasedRequests = __privateGet(this, _collectorsStorage).removeDataCollector(params.collector);
    releasedRequests.map((request) => this.disposeRequest(request));
  }
  disownData(params) {
    if (!__privateGet(this, _collectorsStorage).isCollected(params.request, params.dataType, params.collector)) {
      throw new NoSuchNetworkDataException(`Collector ${params.collector} didn't collect ${params.dataType} data`);
    }
    __privateGet(this, _collectorsStorage).disownData(params.request, params.dataType, params.collector);
    this.disposeRequest(params.request);
  }
}
_browsingContextStorage13 = new WeakMap();
_eventManager11 = new WeakMap();
_collectorsStorage = new WeakMap();
_logger12 = new WeakMap();
_requests = new WeakMap();
_intercepts = new WeakMap();
_defaultCacheBehavior = new WeakMap();
_NetworkStorage_instances = new WeakSet();
/**
 * Gets the network request with the given ID, if any.
 * Otherwise, creates a new network request with the given ID and cdp target.
 */
getOrCreateNetworkRequest_fn = function(id, cdpTarget, redirectCount) {
  let request = this.getRequestById(id);
  if (redirectCount === void 0 && request) {
    return request;
  }
  request = new NetworkRequest(id, __privateGet(this, _eventManager11), this, cdpTarget, redirectCount, __privateGet(this, _logger12));
  this.addRequest(request);
  return request;
};
getCollectedResponseData_fn = async function(request) {
  try {
    const responseBody = await request.cdpClient.sendCommand("Network.getResponseBody", { requestId: request.id });
    return {
      bytes: {
        type: responseBody.base64Encoded ? "base64" : "string",
        value: responseBody.body
      }
    };
  } catch (error) {
    if (error.code === -32e3 && error.message === "No resource with given identifier found") {
      throw new NoSuchNetworkDataException(`Response data was disposed`);
    }
    if (error.code === -32001) {
      throw new NoSuchNetworkDataException(`Response data is disposed after the related page`);
    }
    throw error;
  }
};
getCollectedRequestData_fn = async function(request) {
  const requestPostData = await request.cdpClient.sendCommand("Network.getRequestPostData", { requestId: request.id });
  return {
    bytes: {
      type: "string",
      value: requestPostData.postData
    }
  };
};
const _CdpTarget = class _CdpTarget {
  constructor(targetId, cdpClient, browserCdpClient, parentCdpClient, eventManager, realmStorage, preloadScriptStorage, browsingContextStorage, configStorage, networkStorage, userContext, defaultUserAgent, logger) {
    __privateAdd(this, _CdpTarget_instances);
    __privateAdd(this, _id5);
    __publicField(this, "userContext");
    __privateAdd(this, _cdpClient2);
    __privateAdd(this, _browserCdpClient9);
    __privateAdd(this, _parentCdpClient);
    __privateAdd(this, _realmStorage5);
    __privateAdd(this, _eventManager12);
    __privateAdd(this, _preloadScriptStorage2);
    __privateAdd(this, _browsingContextStorage14);
    __privateAdd(this, _networkStorage3);
    __publicField(this, "contextConfigStorage");
    __privateAdd(this, _unblocked, new Deferred());
    // Default user agent for the target. Required, as emulating client hints without user
    // agent is not possible. Cache it to avoid round trips to the browser for every target override.
    __privateAdd(this, _defaultUserAgent);
    __privateAdd(this, _logger13);
    /**
     * Target's window id. Is filled when the CDP target is created and do not reflect
     * moving targets from one window to another. The actual values
     * will be set during `#unblock`.
     * */
    __privateAdd(this, _windowId);
    __privateAdd(this, _deviceAccessEnabled, false);
    __privateAdd(this, _cacheDisableState, false);
    __privateAdd(this, _preloadEnabled, false);
    __privateAdd(this, _fetchDomainStages, {
      request: false,
      response: false,
      auth: false
    });
    __privateSet(this, _defaultUserAgent, defaultUserAgent);
    this.userContext = userContext;
    __privateSet(this, _id5, targetId);
    __privateSet(this, _cdpClient2, cdpClient);
    __privateSet(this, _browserCdpClient9, browserCdpClient);
    __privateSet(this, _parentCdpClient, parentCdpClient);
    __privateSet(this, _eventManager12, eventManager);
    __privateSet(this, _realmStorage5, realmStorage);
    __privateSet(this, _preloadScriptStorage2, preloadScriptStorage);
    __privateSet(this, _networkStorage3, networkStorage);
    __privateSet(this, _browsingContextStorage14, browsingContextStorage);
    this.contextConfigStorage = configStorage;
    __privateSet(this, _logger13, logger);
  }
  static create(targetId, cdpClient, browserCdpClient, parentCdpClient, realmStorage, eventManager, preloadScriptStorage, browsingContextStorage, networkStorage, configStorage, userContext, defaultUserAgent, logger) {
    var _a3, _b2;
    const cdpTarget = new _CdpTarget(targetId, cdpClient, browserCdpClient, parentCdpClient, eventManager, realmStorage, preloadScriptStorage, browsingContextStorage, configStorage, networkStorage, userContext, defaultUserAgent, logger);
    LogManager.create(cdpTarget, realmStorage, eventManager, logger);
    __privateMethod(_a3 = cdpTarget, _CdpTarget_instances, setEventListeners_fn).call(_a3);
    void __privateMethod(_b2 = cdpTarget, _CdpTarget_instances, unblock_fn).call(_b2);
    return cdpTarget;
  }
  /** Returns a deferred that resolves when the target is unblocked. */
  get unblocked() {
    return __privateGet(this, _unblocked);
  }
  get id() {
    return __privateGet(this, _id5);
  }
  get cdpClient() {
    return __privateGet(this, _cdpClient2);
  }
  get parentCdpClient() {
    return __privateGet(this, _parentCdpClient);
  }
  get browserCdpClient() {
    return __privateGet(this, _browserCdpClient9);
  }
  /** Needed for CDP escape path. */
  get cdpSessionId() {
    return __privateGet(this, _cdpClient2).sessionId;
  }
  /**
   * Window id the target belongs to. If not known, returns 0.
   */
  get windowId() {
    var _a3, _b2;
    if (__privateGet(this, _windowId) === void 0) {
      (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2("Getting windowId before it was set, returning 0");
    }
    return __privateGet(this, _windowId) ?? 0;
  }
  async toggleFetchIfNeeded() {
    const stages = __privateGet(this, _networkStorage3).getInterceptionStages(this.topLevelId);
    if (__privateGet(this, _fetchDomainStages).request === stages.request && __privateGet(this, _fetchDomainStages).response === stages.response && __privateGet(this, _fetchDomainStages).auth === stages.auth) {
      return;
    }
    const patterns = [];
    __privateSet(this, _fetchDomainStages, stages);
    if (stages.request || stages.auth) {
      patterns.push({
        urlPattern: "*",
        requestStage: "Request"
      });
    }
    if (stages.response) {
      patterns.push({
        urlPattern: "*",
        requestStage: "Response"
      });
    }
    if (patterns.length) {
      await __privateGet(this, _cdpClient2).sendCommand("Fetch.enable", {
        patterns,
        handleAuthRequests: stages.auth
      });
    } else {
      const blockedRequest = __privateGet(this, _networkStorage3).getRequestsByTarget(this).filter((request) => request.interceptPhase);
      void Promise.allSettled(blockedRequest.map((request) => request.waitNextPhase)).then(async () => {
        const blockedRequest2 = __privateGet(this, _networkStorage3).getRequestsByTarget(this).filter((request) => request.interceptPhase);
        if (blockedRequest2.length) {
          return await this.toggleFetchIfNeeded();
        }
        return await __privateGet(this, _cdpClient2).sendCommand("Fetch.disable");
      }).catch((error) => {
        var _a3, _b2;
        (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.bidi)) == null ? void 0 : _b2("Disable failed", error);
      });
    }
  }
  /**
   * Toggles CDP "Fetch" domain and enable/disable network cache.
   */
  async toggleNetworkIfNeeded() {
    var _a3, _b2;
    try {
      await Promise.all([
        this.toggleSetCacheDisabled(),
        this.toggleFetchIfNeeded()
      ]);
    } catch (err) {
      (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(err);
      if (!__privateMethod(this, _CdpTarget_instances, isExpectedError_fn).call(this, err)) {
        throw err;
      }
    }
  }
  async toggleSetCacheDisabled(disable) {
    var _a3, _b2;
    const defaultCacheDisabled = __privateGet(this, _networkStorage3).defaultCacheBehavior === "bypass";
    const cacheDisabled = disable ?? defaultCacheDisabled;
    if (__privateGet(this, _cacheDisableState) === cacheDisabled) {
      return;
    }
    __privateSet(this, _cacheDisableState, cacheDisabled);
    try {
      await __privateGet(this, _cdpClient2).sendCommand("Network.setCacheDisabled", {
        cacheDisabled
      });
    } catch (err) {
      (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(err);
      __privateSet(this, _cacheDisableState, !cacheDisabled);
      if (!__privateMethod(this, _CdpTarget_instances, isExpectedError_fn).call(this, err)) {
        throw err;
      }
    }
  }
  async toggleDeviceAccessIfNeeded() {
    var _a3, _b2;
    const enabled = this.isSubscribedTo(Bluetooth.EventNames.RequestDevicePromptUpdated);
    if (__privateGet(this, _deviceAccessEnabled) === enabled) {
      return;
    }
    __privateSet(this, _deviceAccessEnabled, enabled);
    try {
      await __privateGet(this, _cdpClient2).sendCommand(enabled ? "DeviceAccess.enable" : "DeviceAccess.disable");
    } catch (err) {
      (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(err);
      __privateSet(this, _deviceAccessEnabled, !enabled);
      if (!__privateMethod(this, _CdpTarget_instances, isExpectedError_fn).call(this, err)) {
        throw err;
      }
    }
  }
  async togglePreloadIfNeeded() {
    var _a3, _b2;
    const enabled = this.isSubscribedTo(Speculation.EventNames.PrefetchStatusUpdated);
    if (__privateGet(this, _preloadEnabled) === enabled) {
      return;
    }
    __privateSet(this, _preloadEnabled, enabled);
    try {
      await __privateGet(this, _cdpClient2).sendCommand(enabled ? "Preload.enable" : "Preload.disable");
    } catch (err) {
      (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(err);
      __privateSet(this, _preloadEnabled, !enabled);
      if (!__privateMethod(this, _CdpTarget_instances, isExpectedError_fn).call(this, err)) {
        throw err;
      }
    }
  }
  async toggleNetwork() {
    var _a3, _b2;
    const stages = __privateGet(this, _networkStorage3).getInterceptionStages(this.topLevelId);
    const fetchEnable = Object.values(stages).some((value) => value);
    const fetchChanged = __privateGet(this, _fetchDomainStages).request !== stages.request || __privateGet(this, _fetchDomainStages).response !== stages.response || __privateGet(this, _fetchDomainStages).auth !== stages.auth;
    (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.debugInfo)) == null ? void 0 : _b2("Toggle Network", `Fetch (${fetchEnable}) ${fetchChanged}`);
    if (fetchEnable && fetchChanged) {
      await __privateMethod(this, _CdpTarget_instances, enableFetch_fn).call(this, stages);
    }
    if (!fetchEnable && fetchChanged) {
      await __privateMethod(this, _CdpTarget_instances, disableFetch_fn).call(this);
    }
  }
  /**
   * All the ProxyChannels from all the preload scripts of the given
   * BrowsingContext.
   */
  getChannels() {
    return __privateGet(this, _preloadScriptStorage2).find().flatMap((script) => script.channels);
  }
  async setDeviceMetricsOverride(viewport, devicePixelRatio, screenOrientation, screenArea, scrollbarType = null) {
    if (viewport === null && devicePixelRatio === null && screenOrientation === null && screenArea === null && scrollbarType === null) {
      await this.cdpClient.sendCommand("Emulation.clearDeviceMetricsOverride");
      return;
    }
    const metricsOverride = {
      width: (viewport == null ? void 0 : viewport.width) ?? 0,
      height: (viewport == null ? void 0 : viewport.height) ?? 0,
      deviceScaleFactor: devicePixelRatio ?? 0,
      screenOrientation: __privateMethod(this, _CdpTarget_instances, toCdpScreenOrientationAngle_fn).call(this, screenOrientation) ?? void 0,
      mobile: false,
      screenWidth: screenArea == null ? void 0 : screenArea.width,
      screenHeight: screenArea == null ? void 0 : screenArea.height,
      scrollbarType: scrollbarType === "overlay" ? "overlay" : "default"
    };
    await this.cdpClient.sendCommand("Emulation.setDeviceMetricsOverride", metricsOverride);
  }
  get topLevelId() {
    return __privateGet(this, _browsingContextStorage14).findTopLevelContextId(this.id) ?? this.id;
  }
  isSubscribedTo(moduleOrEvent) {
    return __privateGet(this, _eventManager12).subscriptionManager.isSubscribedTo(moduleOrEvent, this.topLevelId);
  }
  async setGeolocationOverride(geolocation) {
    if (geolocation === null) {
      await this.cdpClient.sendCommand("Emulation.clearGeolocationOverride");
    } else if ("type" in geolocation) {
      if (geolocation.type !== "positionUnavailable") {
        throw new UnknownErrorException(`Unknown geolocation error ${geolocation.type}`);
      }
      await this.cdpClient.sendCommand("Emulation.setGeolocationOverride", {});
    } else if ("latitude" in geolocation) {
      await this.cdpClient.sendCommand("Emulation.setGeolocationOverride", {
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        accuracy: geolocation.accuracy ?? 1,
        // `null` value is treated as "missing".
        altitude: geolocation.altitude ?? void 0,
        altitudeAccuracy: geolocation.altitudeAccuracy ?? void 0,
        heading: geolocation.heading ?? void 0,
        speed: geolocation.speed ?? void 0
      });
    } else {
      throw new UnknownErrorException("Unexpected geolocation coordinates value");
    }
  }
  async setTouchOverride(maxTouchPoints) {
    const touchEmulationParams = {
      enabled: maxTouchPoints !== null
    };
    if (maxTouchPoints !== null) {
      touchEmulationParams.maxTouchPoints = maxTouchPoints;
    }
    await this.cdpClient.sendCommand("Emulation.setTouchEmulationEnabled", touchEmulationParams);
  }
  async setLocaleOverride(locale) {
    if (locale === null) {
      await this.cdpClient.sendCommand("Emulation.setLocaleOverride", {});
    } else {
      await this.cdpClient.sendCommand("Emulation.setLocaleOverride", {
        locale
      });
    }
  }
  async setScriptingEnabled(scriptingEnabled) {
    await this.cdpClient.sendCommand("Emulation.setScriptExecutionDisabled", {
      value: scriptingEnabled === false
    });
  }
  async setTimezoneOverride(timezone) {
    if (timezone === null) {
      await this.cdpClient.sendCommand("Emulation.setTimezoneOverride", {
        // If empty, disables the override and restores default host system timezone.
        timezoneId: ""
      });
    } else {
      await this.cdpClient.sendCommand("Emulation.setTimezoneOverride", {
        timezoneId: timezone
      });
    }
  }
  async setExtraHeaders(headers) {
    await this.cdpClient.sendCommand("Network.setExtraHTTPHeaders", {
      headers
    });
  }
  async setUserAgentAndAcceptLanguage(userAgent, acceptLanguage, clientHints) {
    var _a3;
    const userAgentMetadata = clientHints ? {
      brands: (_a3 = clientHints.brands) == null ? void 0 : _a3.map((b) => ({
        brand: b.brand,
        version: b.version
      })),
      fullVersionList: clientHints.fullVersionList,
      platform: clientHints.platform ?? "",
      platformVersion: clientHints.platformVersion ?? "",
      architecture: clientHints.architecture ?? "",
      model: clientHints.model ?? "",
      mobile: clientHints.mobile ?? false,
      bitness: clientHints.bitness ?? void 0,
      wow64: clientHints.wow64 ?? void 0,
      formFactors: clientHints.formFactors ?? void 0
    } : void 0;
    await this.cdpClient.sendCommand("Emulation.setUserAgentOverride", {
      // `userAgent` is required if `userAgentMetadata` is provided.
      userAgent: userAgent || (userAgentMetadata ? __privateGet(this, _defaultUserAgent) : ""),
      acceptLanguage: acceptLanguage ?? void 0,
      // We need to provide the platform to enable platform emulation.
      // Note that the value might be different from the one expected by the
      // legacy `navigator.platform` (e.g. `Win32` vs `Windows`).
      // https://github.com/w3c/webdriver-bidi/issues/1065
      platform: (clientHints == null ? void 0 : clientHints.platform) ?? void 0,
      userAgentMetadata
    });
  }
  async setEmulatedNetworkConditions(networkConditions) {
    if (networkConditions !== null && networkConditions.type !== "offline") {
      throw new UnsupportedOperationException(`Unsupported network conditions ${networkConditions.type}`);
    }
    await Promise.all([
      this.cdpClient.sendCommand("Network.emulateNetworkConditionsByRule", {
        offline: (networkConditions == null ? void 0 : networkConditions.type) === "offline",
        matchedNetworkConditions: [
          {
            urlPattern: "",
            latency: 0,
            downloadThroughput: -1,
            uploadThroughput: -1
          }
        ]
      }),
      this.cdpClient.sendCommand("Network.overrideNetworkState", {
        offline: (networkConditions == null ? void 0 : networkConditions.type) === "offline",
        // TODO: restore the original `latency` value when emulation is removed.
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1
      })
    ]);
  }
};
_id5 = new WeakMap();
_cdpClient2 = new WeakMap();
_browserCdpClient9 = new WeakMap();
_parentCdpClient = new WeakMap();
_realmStorage5 = new WeakMap();
_eventManager12 = new WeakMap();
_preloadScriptStorage2 = new WeakMap();
_browsingContextStorage14 = new WeakMap();
_networkStorage3 = new WeakMap();
_unblocked = new WeakMap();
_defaultUserAgent = new WeakMap();
_logger13 = new WeakMap();
_windowId = new WeakMap();
_deviceAccessEnabled = new WeakMap();
_cacheDisableState = new WeakMap();
_preloadEnabled = new WeakMap();
_fetchDomainStages = new WeakMap();
_CdpTarget_instances = new WeakSet();
unblock_fn = async function() {
  var _a3, _b2;
  const config = this.contextConfigStorage.getActiveConfig(this.topLevelId, this.userContext);
  const results = await Promise.allSettled([
    __privateGet(this, _cdpClient2).sendCommand("Page.enable", {
      enableFileChooserOpenedEvent: true
    }),
    ...__privateMethod(this, _CdpTarget_instances, ignoreFileDialog_fn).call(this) ? [] : [
      __privateGet(this, _cdpClient2).sendCommand("Page.setInterceptFileChooserDialog", {
        enabled: true,
        // The intercepted dialog should be canceled.
        cancel: true
      })
    ],
    // There can be some existing frames in the target, if reconnecting to an
    // existing browser instance, e.g. via Puppeteer. Need to restore the browsing
    // contexts for the frames to correctly handle further events, like
    // `Runtime.executionContextCreated`.
    // It's important to schedule this task together with enabling domains commands to
    // prepare the tree before the events (e.g. Runtime.executionContextCreated) start
    // coming.
    // https://github.com/GoogleChromeLabs/chromium-bidi/issues/2282
    __privateGet(this, _cdpClient2).sendCommand("Page.getFrameTree").then((frameTree) => __privateMethod(this, _CdpTarget_instances, restoreFrameTreeState_fn).call(this, frameTree.frameTree)),
    __privateGet(this, _cdpClient2).sendCommand("Runtime.enable"),
    __privateGet(this, _cdpClient2).sendCommand("Page.setLifecycleEventsEnabled", {
      enabled: true
    }),
    // Enabling CDP Network domain is required for navigation detection:
    // https://github.com/GoogleChromeLabs/chromium-bidi/issues/2856.
    __privateGet(this, _cdpClient2).sendCommand("Network.enable", {
      // If `googDisableNetworkDurableMessages` flag is set, do not enable durable
      // messages.
      enableDurableMessages: config.disableNetworkDurableMessages !== true,
      maxTotalBufferSize: MAX_TOTAL_COLLECTED_SIZE
    }).then(() => this.toggleNetworkIfNeeded()),
    __privateGet(this, _cdpClient2).sendCommand("Target.setAutoAttach", {
      autoAttach: true,
      waitForDebuggerOnStart: true,
      flatten: true
    }),
    __privateMethod(this, _CdpTarget_instances, updateWindowId_fn).call(this),
    __privateMethod(this, _CdpTarget_instances, setUserContextConfig_fn).call(this, config),
    __privateMethod(this, _CdpTarget_instances, initAndEvaluatePreloadScripts_fn).call(this),
    __privateGet(this, _cdpClient2).sendCommand("Runtime.runIfWaitingForDebugger"),
    // Resume tab execution as well if it was paused by the debugger.
    __privateGet(this, _parentCdpClient).sendCommand("Runtime.runIfWaitingForDebugger"),
    this.toggleDeviceAccessIfNeeded(),
    this.togglePreloadIfNeeded()
  ]);
  for (const result of results) {
    if (result instanceof Error) {
      (_b2 = (_a3 = __privateGet(this, _logger13)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2("Error happened when configuring a new target", result);
    }
  }
  __privateGet(this, _unblocked).resolve({
    kind: "success",
    value: void 0
  });
};
restoreFrameTreeState_fn = function(frameTree) {
  var _a3;
  const frame = frameTree.frame;
  const maybeContext = __privateGet(this, _browsingContextStorage14).findContext(frame.id);
  if (maybeContext !== void 0) {
    if (maybeContext.parentId === null && frame.parentId !== null && frame.parentId !== void 0) {
      maybeContext.parentId = frame.parentId;
    }
  }
  if (maybeContext === void 0 && frame.parentId !== void 0) {
    const parentBrowsingContext = __privateGet(this, _browsingContextStorage14).getContext(frame.parentId);
    BrowsingContextImpl.create(frame.id, frame.parentId, this.userContext, parentBrowsingContext.cdpTarget, __privateGet(this, _eventManager12), __privateGet(this, _browsingContextStorage14), __privateGet(this, _realmStorage5), this.contextConfigStorage, frame.url, void 0, __privateGet(this, _logger13));
  }
  (_a3 = frameTree.childFrames) == null ? void 0 : _a3.map((frameTree2) => __privateMethod(this, _CdpTarget_instances, restoreFrameTreeState_fn).call(this, frameTree2));
};
/**
 * Heuristic checking if the error is due to the session being closed. If so, ignore the
 * error.
 */
isExpectedError_fn = function(err) {
  const error = err;
  return error.code === -32001 && error.message === "Session with given id not found." || __privateGet(this, _cdpClient2).isCloseError(err);
};
setEventListeners_fn = function() {
  __privateGet(this, _cdpClient2).on("*", (event, params) => {
    if (typeof event !== "string") {
      return;
    }
    __privateGet(this, _eventManager12).registerEvent({
      type: "event",
      method: `goog:cdp.${event}`,
      params: {
        event,
        params,
        session: this.cdpSessionId
      }
    }, this.id);
  });
};
enableFetch_fn = async function(stages) {
  const patterns = [];
  if (stages.request || stages.auth) {
    patterns.push({
      urlPattern: "*",
      requestStage: "Request"
    });
  }
  if (stages.response) {
    patterns.push({
      urlPattern: "*",
      requestStage: "Response"
    });
  }
  if (patterns.length) {
    const oldStages = __privateGet(this, _fetchDomainStages);
    __privateSet(this, _fetchDomainStages, stages);
    try {
      await __privateGet(this, _cdpClient2).sendCommand("Fetch.enable", {
        patterns,
        handleAuthRequests: stages.auth
      });
    } catch {
      __privateSet(this, _fetchDomainStages, oldStages);
    }
  }
};
disableFetch_fn = async function() {
  const blockedRequest = __privateGet(this, _networkStorage3).getRequestsByTarget(this).filter((request) => request.interceptPhase);
  if (blockedRequest.length === 0) {
    __privateSet(this, _fetchDomainStages, {
      request: false,
      response: false,
      auth: false
    });
    await __privateGet(this, _cdpClient2).sendCommand("Fetch.disable");
  }
};
updateWindowId_fn = async function() {
  const { windowId } = await __privateGet(this, _browserCdpClient9).sendCommand("Browser.getWindowForTarget", { targetId: this.id });
  __privateSet(this, _windowId, windowId);
};
initAndEvaluatePreloadScripts_fn = async function() {
  await Promise.all(__privateGet(this, _preloadScriptStorage2).find({
    // Needed for OOPIF
    targetId: this.topLevelId
  }).map((script) => {
    return script.initInTarget(this, true);
  }));
};
setUserContextConfig_fn = async function(config) {
  const promises = [];
  promises.push(__privateGet(this, _cdpClient2).sendCommand("Page.setPrerenderingAllowed", {
    isAllowed: !config.prerenderingDisabled
  }).catch(() => {
  }));
  if (config.viewport !== void 0 || config.devicePixelRatio !== void 0 || config.screenOrientation !== void 0 || config.screenArea !== void 0) {
    promises.push(this.setDeviceMetricsOverride(config.viewport ?? null, config.devicePixelRatio ?? null, config.screenOrientation ?? null, config.screenArea ?? null, config.scrollbarType ?? null).catch(() => {
    }));
  }
  if (config.geolocation !== void 0 && config.geolocation !== null) {
    promises.push(this.setGeolocationOverride(config.geolocation));
  }
  if (config.locale !== void 0) {
    promises.push(this.setLocaleOverride(config.locale));
  }
  if (config.timezone !== void 0) {
    promises.push(this.setTimezoneOverride(config.timezone));
  }
  if (config.extraHeaders !== void 0) {
    promises.push(this.setExtraHeaders(config.extraHeaders));
  }
  if (config.userAgent !== void 0 || config.locale !== void 0 || config.clientHints !== void 0) {
    promises.push(this.setUserAgentAndAcceptLanguage(config.userAgent, config.locale, config.clientHints));
  }
  if (config.scriptingEnabled !== void 0) {
    promises.push(this.setScriptingEnabled(config.scriptingEnabled));
  }
  if (config.acceptInsecureCerts !== void 0) {
    promises.push(this.cdpClient.sendCommand("Security.setIgnoreCertificateErrors", {
      ignore: config.acceptInsecureCerts
    }));
  }
  if (config.emulatedNetworkConditions !== void 0) {
    promises.push(this.setEmulatedNetworkConditions(config.emulatedNetworkConditions));
  }
  if (config.maxTouchPoints !== void 0) {
    promises.push(this.setTouchOverride(config.maxTouchPoints));
  }
  if (config.digitalCredentialsBehavior && this.id === this.topLevelId) {
    promises.push(this.cdpClient.sendCommand("DigitalCredentials.setVirtualWalletBehavior", {
      // @ts-expect-error action is kept for backward compatibility with older Chromium CDP versions
      action: config.digitalCredentialsBehavior.action,
      behavior: config.digitalCredentialsBehavior.action,
      protocol: config.digitalCredentialsBehavior.protocol,
      response: config.digitalCredentialsBehavior.response
    }).catch(() => {
    }));
  }
  await Promise.all(promises);
};
ignoreFileDialog_fn = function() {
  var _a3, _b2;
  const config = this.contextConfigStorage.getActiveConfig(this.topLevelId, this.userContext);
  return (((_a3 = config.userPromptHandler) == null ? void 0 : _a3.file) ?? ((_b2 = config.userPromptHandler) == null ? void 0 : _b2.default) ?? "ignore") === "ignore";
};
toCdpScreenOrientationAngle_fn = function(orientation) {
  if (orientation === null) {
    return null;
  }
  if (orientation.natural === "portrait") {
    switch (orientation.type) {
      case "portrait-primary":
        return {
          angle: 0,
          type: "portraitPrimary"
        };
      case "landscape-primary":
        return {
          angle: 90,
          type: "landscapePrimary"
        };
      case "portrait-secondary":
        return {
          angle: 180,
          type: "portraitSecondary"
        };
      case "landscape-secondary":
        return {
          angle: 270,
          type: "landscapeSecondary"
        };
      default:
        throw new UnknownErrorException(`Unexpected screen orientation type ${orientation.type}`);
    }
  }
  if (orientation.natural === "landscape") {
    switch (orientation.type) {
      case "landscape-primary":
        return {
          angle: 0,
          type: "landscapePrimary"
        };
      case "portrait-primary":
        return {
          angle: 90,
          type: "portraitPrimary"
        };
      case "landscape-secondary":
        return {
          angle: 180,
          type: "landscapeSecondary"
        };
      case "portrait-secondary":
        return {
          angle: 270,
          type: "portraitSecondary"
        };
      default:
        throw new UnknownErrorException(`Unexpected screen orientation type ${orientation.type}`);
    }
  }
  throw new UnknownErrorException(`Unexpected orientation natural ${orientation.natural}`);
};
let CdpTarget = _CdpTarget;
const cdpToBidiTargetTypes = {
  service_worker: "service-worker",
  shared_worker: "shared-worker",
  worker: "dedicated-worker"
};
class CdpTargetManager {
  constructor(cdpConnection, browserCdpClient, selfTargetId, eventManager, browsingContextStorage, realmStorage, networkStorage, configStorage, bluetoothProcessor, speculationProcessor, preloadScriptStorage, defaultUserContextId, defaultUserAgent, logger) {
    __privateAdd(this, _CdpTargetManager_instances);
    __privateAdd(this, _browserCdpClient10);
    __privateAdd(this, _cdpConnection2);
    __privateAdd(this, _targetKeysToBeIgnoredByAutoAttach, /* @__PURE__ */ new Set());
    __privateAdd(this, _selfTargetId);
    __privateAdd(this, _eventManager13);
    __privateAdd(this, _browsingContextStorage15);
    __privateAdd(this, _networkStorage4);
    __privateAdd(this, _bluetoothProcessor2);
    __privateAdd(this, _preloadScriptStorage3);
    __privateAdd(this, _realmStorage6);
    __privateAdd(this, _configStorage3);
    __privateAdd(this, _speculationProcessor);
    __privateAdd(this, _defaultUserContextId);
    __privateAdd(this, _defaultUserAgent2);
    __privateAdd(this, _logger14);
    __privateAdd(this, _workers, /* @__PURE__ */ new Map());
    __privateSet(this, _cdpConnection2, cdpConnection);
    __privateSet(this, _browserCdpClient10, browserCdpClient);
    __privateGet(this, _targetKeysToBeIgnoredByAutoAttach).add(selfTargetId);
    __privateSet(this, _selfTargetId, selfTargetId);
    __privateSet(this, _eventManager13, eventManager);
    __privateSet(this, _browsingContextStorage15, browsingContextStorage);
    __privateSet(this, _preloadScriptStorage3, preloadScriptStorage);
    __privateSet(this, _networkStorage4, networkStorage);
    __privateSet(this, _configStorage3, configStorage);
    __privateSet(this, _bluetoothProcessor2, bluetoothProcessor);
    __privateSet(this, _speculationProcessor, speculationProcessor);
    __privateSet(this, _realmStorage6, realmStorage);
    __privateSet(this, _defaultUserContextId, defaultUserContextId);
    __privateSet(this, _defaultUserAgent2, defaultUserAgent);
    __privateSet(this, _logger14, logger);
    __privateMethod(this, _CdpTargetManager_instances, setEventListeners_fn2).call(this, browserCdpClient);
  }
}
_browserCdpClient10 = new WeakMap();
_cdpConnection2 = new WeakMap();
_targetKeysToBeIgnoredByAutoAttach = new WeakMap();
_selfTargetId = new WeakMap();
_eventManager13 = new WeakMap();
_browsingContextStorage15 = new WeakMap();
_networkStorage4 = new WeakMap();
_bluetoothProcessor2 = new WeakMap();
_preloadScriptStorage3 = new WeakMap();
_realmStorage6 = new WeakMap();
_configStorage3 = new WeakMap();
_speculationProcessor = new WeakMap();
_defaultUserContextId = new WeakMap();
_defaultUserAgent2 = new WeakMap();
_logger14 = new WeakMap();
_CdpTargetManager_instances = new WeakSet();
/**
 * This method is called for each CDP session, since this class is responsible
 * for creating and destroying all targets and browsing contexts.
 */
setEventListeners_fn2 = function(cdpClient) {
  cdpClient.on("Target.attachedToTarget", (params) => {
    __privateMethod(this, _CdpTargetManager_instances, handleAttachedToTargetEvent_fn).call(this, params, cdpClient);
  });
  cdpClient.on("Target.detachedFromTarget", __privateMethod(this, _CdpTargetManager_instances, handleDetachedFromTargetEvent_fn).bind(this));
  cdpClient.on("Target.targetInfoChanged", __privateMethod(this, _CdpTargetManager_instances, handleTargetInfoChangedEvent_fn).bind(this));
  cdpClient.on("Inspector.targetCrashed", () => {
    __privateMethod(this, _CdpTargetManager_instances, handleTargetCrashedEvent_fn).call(this, cdpClient);
  });
  cdpClient.on("Page.frameAttached", __privateMethod(this, _CdpTargetManager_instances, handleFrameAttachedEvent_fn).bind(this));
  cdpClient.on("Page.frameSubtreeWillBeDetached", __privateMethod(this, _CdpTargetManager_instances, handleFrameSubtreeWillBeDetached_fn).bind(this));
};
handleFrameAttachedEvent_fn = function(params) {
  const parentBrowsingContext = __privateGet(this, _browsingContextStorage15).findContext(params.parentFrameId);
  if (parentBrowsingContext !== void 0) {
    BrowsingContextImpl.create(
      params.frameId,
      params.parentFrameId,
      parentBrowsingContext.userContext,
      parentBrowsingContext.cdpTarget,
      __privateGet(this, _eventManager13),
      __privateGet(this, _browsingContextStorage15),
      __privateGet(this, _realmStorage6),
      __privateGet(this, _configStorage3),
      // At this point, we don't know the URL of the frame yet, so it will be updated
      // later.
      "about:blank",
      void 0,
      __privateGet(this, _logger14)
    );
  }
};
handleFrameSubtreeWillBeDetached_fn = function(params) {
  var _a3;
  (_a3 = __privateGet(this, _browsingContextStorage15).findContext(params.frameId)) == null ? void 0 : _a3.dispose(true);
};
handleAttachedToTargetEvent_fn = function(params, parentSessionCdpClient) {
  const { sessionId, targetInfo } = params;
  const targetCdpClient = __privateGet(this, _cdpConnection2).getCdpClient(sessionId);
  const detach = async () => {
    await targetCdpClient.sendCommand("Runtime.runIfWaitingForDebugger").then(() => parentSessionCdpClient.sendCommand("Target.detachFromTarget", params)).catch((error) => {
      var _a3, _b2;
      return (_b2 = (_a3 = __privateGet(this, _logger14)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(error);
    });
  };
  if (__privateGet(this, _selfTargetId) === targetInfo.targetId) {
    void detach();
    return;
  }
  const targetKey = targetInfo.type === "service_worker" ? `${parentSessionCdpClient.sessionId}_${targetInfo.targetId}` : targetInfo.targetId;
  if (__privateGet(this, _targetKeysToBeIgnoredByAutoAttach).has(targetKey)) {
    return;
  }
  __privateGet(this, _targetKeysToBeIgnoredByAutoAttach).add(targetKey);
  const userContext = targetInfo.browserContextId && targetInfo.browserContextId !== __privateGet(this, _defaultUserContextId) ? targetInfo.browserContextId : "default";
  switch (targetInfo.type) {
    case "tab": {
      __privateMethod(this, _CdpTargetManager_instances, setEventListeners_fn2).call(this, targetCdpClient);
      void (async () => {
        await targetCdpClient.sendCommand("Target.setAutoAttach", {
          autoAttach: true,
          waitForDebuggerOnStart: true,
          flatten: true
        });
      })();
      return;
    }
    case "page":
    case "iframe": {
      const cdpTarget = __privateMethod(this, _CdpTargetManager_instances, createCdpTarget_fn).call(this, targetCdpClient, parentSessionCdpClient, targetInfo, userContext);
      const maybeContext = __privateGet(this, _browsingContextStorage15).findContext(targetInfo.targetId);
      if (maybeContext && targetInfo.type === "iframe") {
        maybeContext.updateCdpTarget(cdpTarget);
      } else {
        const parentId = __privateMethod(this, _CdpTargetManager_instances, findFrameParentId_fn).call(this, targetInfo, parentSessionCdpClient.sessionId);
        BrowsingContextImpl.create(
          targetInfo.targetId,
          parentId,
          userContext,
          cdpTarget,
          __privateGet(this, _eventManager13),
          __privateGet(this, _browsingContextStorage15),
          __privateGet(this, _realmStorage6),
          __privateGet(this, _configStorage3),
          // Hack: when a new target created, CDP emits targetInfoChanged with an empty
          // url, and navigates it to about:blank later. When the event is emitted for
          // an existing target (reconnect), the url is already known, and navigation
          // events will not be emitted anymore. Replacing empty url with `about:blank`
          // allows to handle both cases in the same way.
          // "7.3.2.1 Creating browsing contexts".
          // https://html.spec.whatwg.org/multipage/document-sequences.html#creating-browsing-contexts
          // TODO: check who to deal with non-null creator and its `creatorOrigin`.
          targetInfo.url === "" ? "about:blank" : targetInfo.url,
          targetInfo.openerFrameId ?? targetInfo.openerId,
          __privateGet(this, _logger14)
        );
      }
      return;
    }
    case "service_worker":
    case "worker": {
      const realm = __privateGet(this, _realmStorage6).findRealm({
        cdpSessionId: parentSessionCdpClient.sessionId,
        sandbox: null
        // Non-sandboxed realms.
      });
      if (!realm) {
        void detach();
        return;
      }
      const cdpTarget = __privateMethod(this, _CdpTargetManager_instances, createCdpTarget_fn).call(this, targetCdpClient, parentSessionCdpClient, targetInfo, userContext);
      __privateMethod(this, _CdpTargetManager_instances, handleWorkerTarget_fn).call(this, cdpToBidiTargetTypes[targetInfo.type], cdpTarget, realm);
      return;
    }
    case "shared_worker": {
      const cdpTarget = __privateMethod(this, _CdpTargetManager_instances, createCdpTarget_fn).call(this, targetCdpClient, parentSessionCdpClient, targetInfo, userContext);
      __privateMethod(this, _CdpTargetManager_instances, handleWorkerTarget_fn).call(this, cdpToBidiTargetTypes[targetInfo.type], cdpTarget);
      return;
    }
  }
  void detach();
};
/** Try to find the parent browsing context ID for the given attached target. */
findFrameParentId_fn = function(targetInfo, parentSessionId) {
  var _a3;
  if (targetInfo.type !== "iframe") {
    return null;
  }
  const parentId = targetInfo.openerFrameId ?? targetInfo.openerId;
  if (parentId !== void 0) {
    return parentId;
  }
  if (parentSessionId !== void 0) {
    return ((_a3 = __privateGet(this, _browsingContextStorage15).findContextBySession(parentSessionId)) == null ? void 0 : _a3.id) ?? null;
  }
  return null;
};
createCdpTarget_fn = function(targetCdpClient, parentCdpClient, targetInfo, userContext) {
  __privateMethod(this, _CdpTargetManager_instances, setEventListeners_fn2).call(this, targetCdpClient);
  __privateGet(this, _preloadScriptStorage3).onCdpTargetCreated(targetInfo.targetId, userContext);
  const target = CdpTarget.create(
    targetInfo.targetId,
    targetCdpClient,
    __privateGet(this, _browserCdpClient10),
    parentCdpClient,
    __privateGet(this, _realmStorage6),
    __privateGet(this, _eventManager13),
    __privateGet(this, _preloadScriptStorage3),
    __privateGet(this, _browsingContextStorage15),
    __privateGet(this, _networkStorage4),
    __privateGet(this, _configStorage3),
    userContext,
    // Pass the cached default User Agent to the new target.
    __privateGet(this, _defaultUserAgent2),
    __privateGet(this, _logger14)
  );
  __privateGet(this, _networkStorage4).onCdpTargetCreated(target);
  __privateGet(this, _bluetoothProcessor2).onCdpTargetCreated(target);
  __privateGet(this, _speculationProcessor).onCdpTargetCreated(target);
  return target;
};
_workers = new WeakMap();
handleWorkerTarget_fn = function(realmType, cdpTarget, ownerRealm) {
  cdpTarget.cdpClient.on("Runtime.executionContextCreated", (params) => {
    const { uniqueId, id, origin } = params.context;
    const workerRealm = new WorkerRealm(cdpTarget.cdpClient, __privateGet(this, _eventManager13), id, __privateGet(this, _logger14), serializeOrigin(origin), ownerRealm ? [ownerRealm] : [], uniqueId, __privateGet(this, _realmStorage6), realmType);
    __privateGet(this, _workers).set(cdpTarget.cdpSessionId, workerRealm);
  });
};
handleDetachedFromTargetEvent_fn = function({ sessionId, targetId }) {
  if (targetId) {
    __privateGet(this, _preloadScriptStorage3).find({ targetId }).map((preloadScript) => {
      preloadScript.dispose(targetId);
    });
  }
  const context = __privateGet(this, _browsingContextStorage15).findContextBySession(sessionId);
  if (context) {
    context.dispose(true);
    return;
  }
  const worker = __privateGet(this, _workers).get(sessionId);
  if (worker) {
    __privateGet(this, _realmStorage6).deleteRealms({
      cdpSessionId: worker.cdpClient.sessionId
    });
  }
};
handleTargetInfoChangedEvent_fn = function(params) {
  const context = __privateGet(this, _browsingContextStorage15).findContext(params.targetInfo.targetId);
  if (context) {
    context.onTargetInfoChanged(params);
  }
};
handleTargetCrashedEvent_fn = function(cdpClient) {
  const realms = __privateGet(this, _realmStorage6).findRealms({
    cdpSessionId: cdpClient.sessionId
  });
  for (const realm of realms) {
    realm.dispose();
  }
};
class BrowsingContextStorage {
  constructor() {
    /** Map from context ID to context implementation. */
    __privateAdd(this, _contexts2, /* @__PURE__ */ new Map());
    /** Event emitter for browsing context storage eventsis not expected to be exposed to
     * the outside world. */
    __privateAdd(this, _eventEmitter, new EventEmitter());
  }
  /** Gets all top-level contexts, i.e. those with no parent. */
  getTopLevelContexts() {
    return this.getAllContexts().filter((context) => context.isTopLevelContext());
  }
  /** Gets all contexts. */
  getAllContexts() {
    return Array.from(__privateGet(this, _contexts2).values());
  }
  /** Deletes the context with the given ID. */
  deleteContextById(id) {
    __privateGet(this, _contexts2).delete(id);
  }
  /** Deletes the given context. */
  deleteContext(context) {
    __privateGet(this, _contexts2).delete(context.id);
  }
  /** Tracks the given context. */
  addContext(context) {
    __privateGet(this, _contexts2).set(context.id, context);
    __privateGet(this, _eventEmitter).emit("added", {
      browsingContext: context
    });
  }
  /**
   * Waits for a context with the given ID to be added and returns it.
   */
  waitForContext(browsingContextId) {
    if (__privateGet(this, _contexts2).has(browsingContextId)) {
      return Promise.resolve(this.getContext(browsingContextId));
    }
    return new Promise((resolve) => {
      const listener = (event) => {
        if (event.browsingContext.id === browsingContextId) {
          __privateGet(this, _eventEmitter).off("added", listener);
          resolve(event.browsingContext);
        }
      };
      __privateGet(this, _eventEmitter).on("added", listener);
    });
  }
  /** Returns true whether there is an existing context with the given ID. */
  hasContext(id) {
    return __privateGet(this, _contexts2).has(id);
  }
  /** Gets the context with the given ID, if any. */
  findContext(id) {
    return __privateGet(this, _contexts2).get(id);
  }
  /** Returns the top-level context ID of the given context, if any. */
  findTopLevelContextId(id) {
    if (id === null) {
      return null;
    }
    const maybeContext = this.findContext(id);
    if (!maybeContext) {
      return null;
    }
    const parentId = maybeContext.parentId ?? null;
    if (parentId === null) {
      return id;
    }
    return this.findTopLevelContextId(parentId);
  }
  findContextBySession(sessionId) {
    for (const context of __privateGet(this, _contexts2).values()) {
      if (context.cdpTarget.cdpSessionId === sessionId) {
        return context;
      }
    }
    return;
  }
  /** Gets the context with the given ID, if any, otherwise throws. */
  getContext(id) {
    const result = this.findContext(id);
    if (result === void 0) {
      throw new NoSuchFrameException(`Context ${id} not found`);
    }
    return result;
  }
  verifyTopLevelContextsList(contexts) {
    const foundContexts = /* @__PURE__ */ new Set();
    if (!contexts) {
      return foundContexts;
    }
    for (const contextId of contexts) {
      const context = this.getContext(contextId);
      if (context.isTopLevelContext()) {
        foundContexts.add(context);
      } else {
        throw new InvalidArgumentException(`Non top-level context '${contextId}' given.`);
      }
    }
    return foundContexts;
  }
  verifyContextsList(contexts) {
    if (!contexts.length) {
      return;
    }
    for (const contextId of contexts) {
      this.getContext(contextId);
    }
  }
}
_contexts2 = new WeakMap();
_eventEmitter = new WeakMap();
class PreloadScriptStorage {
  constructor() {
    /** Tracks all BiDi preload scripts.  */
    __privateAdd(this, _scripts, /* @__PURE__ */ new Set());
  }
  /**
   * Finds all entries that match the given filter (OR logic).
   */
  find(filter) {
    if (!filter) {
      return [...__privateGet(this, _scripts)];
    }
    return [...__privateGet(this, _scripts)].filter((script) => {
      if (script.contexts === void 0 && script.userContexts === void 0) {
        return true;
      }
      if (filter.targetId !== void 0 && script.targetIds.has(filter.targetId)) {
        return true;
      }
      return false;
    });
  }
  add(preloadScript) {
    __privateGet(this, _scripts).add(preloadScript);
  }
  /** Deletes all BiDi preload script entries that match the given filter. */
  remove(id) {
    const script = [...__privateGet(this, _scripts)].find((script2) => script2.id === id);
    if (script === void 0) {
      throw new NoSuchScriptException(`No preload script with id '${id}'`);
    }
    __privateGet(this, _scripts).delete(script);
  }
  /** Gets the preload script with the given ID, if any, otherwise throws. */
  getPreloadScript(id) {
    const script = [...__privateGet(this, _scripts)].find((script2) => script2.id === id);
    if (script === void 0) {
      throw new NoSuchScriptException(`No preload script with id '${id}'`);
    }
    return script;
  }
  onCdpTargetCreated(targetId, userContext) {
    const scriptInUserContext = [...__privateGet(this, _scripts)].filter((script) => {
      var _a3;
      if (!script.userContexts && !script.contexts) {
        return true;
      }
      return (_a3 = script.userContexts) == null ? void 0 : _a3.includes(userContext);
    });
    for (const script of scriptInUserContext) {
      script.targetIds.add(targetId);
    }
  }
}
_scripts = new WeakMap();
class RealmStorage {
  constructor() {
    /** Tracks handles and their realms sent to the client. */
    __privateAdd(this, _knownHandlesToRealmMap, /* @__PURE__ */ new Map());
    /** Map from realm ID to Realm. */
    __privateAdd(this, _realmMap, /* @__PURE__ */ new Map());
    /** List of the internal sandboxed realms which should not be reported to the user. */
    __publicField(this, "hiddenSandboxes", /* @__PURE__ */ new Set());
  }
  get knownHandlesToRealmMap() {
    return __privateGet(this, _knownHandlesToRealmMap);
  }
  addRealm(realm) {
    __privateGet(this, _realmMap).set(realm.realmId, realm);
  }
  /** Finds all realms that match the given filter. */
  findRealms(filter) {
    const sandboxFilterValue = filter.sandbox === null ? void 0 : filter.sandbox;
    return Array.from(__privateGet(this, _realmMap).values()).filter((realm) => {
      if (filter.realmId !== void 0 && filter.realmId !== realm.realmId) {
        return false;
      }
      if (filter.browsingContextId !== void 0 && !realm.associatedBrowsingContexts.map((browsingContext) => browsingContext.id).includes(filter.browsingContextId)) {
        return false;
      }
      if (filter.sandbox !== void 0 && (!(realm instanceof WindowRealm$1) || sandboxFilterValue !== realm.sandbox)) {
        return false;
      }
      if (filter.executionContextId !== void 0 && filter.executionContextId !== realm.executionContextId) {
        return false;
      }
      if (filter.origin !== void 0 && filter.origin !== realm.origin) {
        return false;
      }
      if (filter.type !== void 0 && filter.type !== realm.realmType) {
        return false;
      }
      if (filter.cdpSessionId !== void 0 && filter.cdpSessionId !== realm.cdpClient.sessionId) {
        return false;
      }
      if (filter.isHidden !== void 0 && filter.isHidden !== realm.isHidden()) {
        return false;
      }
      return true;
    });
  }
  findRealm(filter) {
    return this.findRealms(filter)[0];
  }
  /** Gets the only realm that matches the given filter, if any, otherwise throws. */
  getRealm(filter) {
    const maybeRealm = this.findRealm(filter);
    if (maybeRealm === void 0) {
      throw new NoSuchFrameException(`Realm ${JSON.stringify(filter)} not found`);
    }
    return maybeRealm;
  }
  /** Deletes all realms that match the given filter. */
  deleteRealms(filter) {
    this.findRealms(filter).map((realm) => {
      realm.dispose();
      __privateGet(this, _realmMap).delete(realm.realmId);
      Array.from(this.knownHandlesToRealmMap.entries()).filter(([, r]) => r === realm.realmId).map(([handle]) => this.knownHandlesToRealmMap.delete(handle));
    });
  }
}
_knownHandlesToRealmMap = new WeakMap();
_realmMap = new WeakMap();
let Buffer$1 = (_d = class {
  /**
   * @param capacity The buffer capacity.
   * @param onItemRemoved Delegate called for each removed element.
   */
  constructor(capacity, onItemRemoved) {
    __privateAdd(this, _capacity);
    __privateAdd(this, _entries, []);
    __privateAdd(this, _onItemRemoved);
    __privateSet(this, _capacity, capacity);
    __privateSet(this, _onItemRemoved, onItemRemoved);
  }
  get() {
    return __privateGet(this, _entries);
  }
  add(value) {
    var _a3;
    __privateGet(this, _entries).push(value);
    while (__privateGet(this, _entries).length > __privateGet(this, _capacity)) {
      const item = __privateGet(this, _entries).shift();
      if (item !== void 0) {
        (_a3 = __privateGet(this, _onItemRemoved)) == null ? void 0 : _a3.call(this, item);
      }
    }
  }
}, _capacity = new WeakMap(), _entries = new WeakMap(), _onItemRemoved = new WeakMap(), _d);
const _IdWrapper = class _IdWrapper {
  constructor() {
    __privateAdd(this, _id6);
    __privateSet(this, _id6, ++__privateWrapper(_IdWrapper, _counter)._);
  }
  get id() {
    return __privateGet(this, _id6);
  }
};
_counter = new WeakMap();
_id6 = new WeakMap();
__privateAdd(_IdWrapper, _counter, 0);
let IdWrapper = _IdWrapper;
function isCdpEvent$1(name) {
  var _a3;
  return ((_a3 = name.split(".").at(0)) == null ? void 0 : _a3.startsWith(BiDiModule.Cdp)) ?? false;
}
function assertSupportedEvent(name) {
  if (!EVENT_NAMES.has(name) && !isCdpEvent$1(name)) {
    throw new InvalidArgumentException(`Unknown event: ${name}`);
  }
}
function unrollEvents(events) {
  const allEvents = /* @__PURE__ */ new Set();
  function addEvents(events2) {
    for (const event of events2) {
      allEvents.add(event);
    }
  }
  for (const event of events) {
    switch (event) {
      case BiDiModule.Bluetooth:
        addEvents(Object.values(Bluetooth.EventNames));
        break;
      case BiDiModule.BrowsingContext:
        addEvents(Object.values(BrowsingContext$1.EventNames));
        break;
      case BiDiModule.Input:
        addEvents(Object.values(Input.EventNames));
        break;
      case BiDiModule.Log:
        addEvents(Object.values(Log.EventNames));
        break;
      case BiDiModule.Network:
        addEvents(Object.values(Network.EventNames));
        break;
      case BiDiModule.Script:
        addEvents(Object.values(Script.EventNames));
        break;
      case BiDiModule.Speculation:
        addEvents(Object.values(Speculation.EventNames));
        break;
      default:
        allEvents.add(event);
    }
  }
  return allEvents.values();
}
class SubscriptionManager {
  constructor(browsingContextStorage) {
    __privateAdd(this, _SubscriptionManager_instances);
    __privateAdd(this, _subscriptions, []);
    __privateAdd(this, _knownSubscriptionIds, /* @__PURE__ */ new Set());
    __privateAdd(this, _browsingContextStorage16);
    __privateSet(this, _browsingContextStorage16, browsingContextStorage);
  }
  getGoogChannelsSubscribedToEvent(eventName, contextId) {
    const googChannels = /* @__PURE__ */ new Set();
    for (const subscription of __privateGet(this, _subscriptions)) {
      if (__privateMethod(this, _SubscriptionManager_instances, isSubscribedTo_fn).call(this, subscription, eventName, contextId)) {
        googChannels.add(subscription.googChannel);
      }
    }
    return Array.from(googChannels);
  }
  getGoogChannelsSubscribedToEventGlobally(eventName) {
    const googChannels = /* @__PURE__ */ new Set();
    for (const subscription of __privateGet(this, _subscriptions)) {
      if (__privateMethod(this, _SubscriptionManager_instances, isSubscribedTo_fn).call(this, subscription, eventName)) {
        googChannels.add(subscription.googChannel);
      }
    }
    return Array.from(googChannels);
  }
  isSubscribedTo(moduleOrEvent, contextId) {
    for (const subscription of __privateGet(this, _subscriptions)) {
      if (__privateMethod(this, _SubscriptionManager_instances, isSubscribedTo_fn).call(this, subscription, moduleOrEvent, contextId)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Subscribes to event in the given context and goog:channel.
   * @return {SubscriptionItem[]} List of
   * subscriptions. If the event is a whole module, it will return all the specific
   * events. If the contextId is null, it will return all the top-level contexts which were
   * not subscribed before the command.
   */
  subscribe(eventNames, contextIds, userContextIds, googChannel) {
    const subscription = {
      id: uuidv4(),
      eventNames: new Set(unrollEvents(eventNames)),
      topLevelTraversableIds: new Set(contextIds.map((contextId) => {
        const topLevelContext = __privateGet(this, _browsingContextStorage16).findTopLevelContextId(contextId);
        if (!topLevelContext) {
          throw new NoSuchFrameException(`Top-level navigable not found for context id ${contextId}`);
        }
        return topLevelContext;
      })),
      userContextIds: new Set(userContextIds),
      googChannel
    };
    __privateGet(this, _subscriptions).push(subscription);
    __privateGet(this, _knownSubscriptionIds).add(subscription.id);
    return subscription;
  }
  /**
   * Unsubscribes atomically from all events in the given contexts and channel.
   *
   * This is a legacy spec branch to unsubscribe by attributes.
   */
  unsubscribe(inputEventNames, googChannel) {
    const eventNames = new Set(unrollEvents(inputEventNames));
    const newSubscriptions = [];
    const eventsMatched = /* @__PURE__ */ new Set();
    for (const subscription of __privateGet(this, _subscriptions)) {
      if (subscription.googChannel !== googChannel) {
        newSubscriptions.push(subscription);
        continue;
      }
      if (subscription.userContextIds.size !== 0) {
        newSubscriptions.push(subscription);
        continue;
      }
      if (intersection(subscription.eventNames, eventNames).size === 0) {
        newSubscriptions.push(subscription);
        continue;
      }
      if (subscription.topLevelTraversableIds.size !== 0) {
        newSubscriptions.push(subscription);
        continue;
      }
      const subscriptionEventNames = new Set(subscription.eventNames);
      for (const eventName of eventNames) {
        if (subscriptionEventNames.has(eventName)) {
          eventsMatched.add(eventName);
          subscriptionEventNames.delete(eventName);
        }
      }
      if (subscriptionEventNames.size !== 0) {
        newSubscriptions.push({
          ...subscription,
          eventNames: subscriptionEventNames
        });
      }
    }
    if (!equal(eventsMatched, eventNames)) {
      throw new InvalidArgumentException("No subscription found");
    }
    __privateSet(this, _subscriptions, newSubscriptions);
  }
  /**
   * Unsubscribes by subscriptionId.
   */
  unsubscribeById(subscriptionIds) {
    const subscriptionIdsSet = new Set(subscriptionIds);
    const unknownIds = difference(subscriptionIdsSet, __privateGet(this, _knownSubscriptionIds));
    if (unknownIds.size !== 0) {
      throw new InvalidArgumentException("No subscription found");
    }
    __privateSet(this, _subscriptions, __privateGet(this, _subscriptions).filter((subscription) => {
      return !subscriptionIdsSet.has(subscription.id);
    }));
    __privateSet(this, _knownSubscriptionIds, difference(__privateGet(this, _knownSubscriptionIds), subscriptionIdsSet));
  }
}
_subscriptions = new WeakMap();
_knownSubscriptionIds = new WeakMap();
_browsingContextStorage16 = new WeakMap();
_SubscriptionManager_instances = new WeakSet();
isSubscribedTo_fn = function(subscription, moduleOrEvent, browsingContextId) {
  let includesEvent = false;
  for (const eventName of subscription.eventNames) {
    if (
      // Event explicitly subscribed
      eventName === moduleOrEvent || // Event subscribed via module
      eventName === moduleOrEvent.split(".").at(0) || // Event explicitly subscribed compared to module
      eventName.split(".").at(0) === moduleOrEvent
    ) {
      includesEvent = true;
      break;
    }
  }
  if (!includesEvent) {
    return false;
  }
  if (subscription.userContextIds.size !== 0) {
    if (!browsingContextId) {
      return false;
    }
    const context = __privateGet(this, _browsingContextStorage16).findContext(browsingContextId);
    if (!context) {
      return false;
    }
    return subscription.userContextIds.has(context.userContext);
  }
  if (subscription.topLevelTraversableIds.size !== 0) {
    if (!browsingContextId) {
      return false;
    }
    const topLevelContext = __privateGet(this, _browsingContextStorage16).findTopLevelContextId(browsingContextId);
    return topLevelContext !== null && subscription.topLevelTraversableIds.has(topLevelContext);
  }
  return true;
};
function intersection(setA, setB) {
  const result = /* @__PURE__ */ new Set();
  for (const a of setA) {
    if (setB.has(a)) {
      result.add(a);
    }
  }
  return result;
}
function difference(setA, setB) {
  const result = /* @__PURE__ */ new Set();
  for (const a of setA) {
    if (!setB.has(a)) {
      result.add(a);
    }
  }
  return result;
}
function equal(setA, setB) {
  if (setA.size !== setB.size) {
    return false;
  }
  for (const a of setA) {
    if (!setB.has(a)) {
      return false;
    }
  }
  return true;
}
var _a$2;
class EventWrapper {
  constructor(event, contextId) {
    __privateAdd(this, _idWrapper, new IdWrapper());
    __privateAdd(this, _contextId2);
    __privateAdd(this, _event);
    __privateSet(this, _event, event);
    __privateSet(this, _contextId2, contextId);
  }
  get id() {
    return __privateGet(this, _idWrapper).id;
  }
  get contextId() {
    return __privateGet(this, _contextId2);
  }
  get event() {
    return __privateGet(this, _event);
  }
}
_idWrapper = new WeakMap();
_contextId2 = new WeakMap();
_event = new WeakMap();
const eventBufferLength = /* @__PURE__ */ new Map([[Log.EventNames.LogEntryAdded, 100]]);
class EventManager extends EventEmitter {
  constructor(browsingContextStorage, userContextStorage) {
    super();
    __privateAdd(this, _EventManager_instances);
    /**
     * Maps event name to a set of contexts where this event already happened.
     * Needed for getting buffered events from all the contexts in case of
     * subscripting to all contexts.
     */
    __privateAdd(this, _eventToContextsMap, new DefaultMap(() => /* @__PURE__ */ new Set()));
    /**
     * Maps `eventName` + `browsingContext` to buffer. Used to get buffered events
     * during subscription. Channel-agnostic.
     */
    __privateAdd(this, _eventBuffers, /* @__PURE__ */ new Map());
    /**
     * Maps `eventName` + `browsingContext` to  Map of goog:channel to last id.
     * Used to avoid sending duplicated events when user
     * subscribes -> unsubscribes -> subscribes.
     */
    __privateAdd(this, _lastMessageSent, /* @__PURE__ */ new Map());
    __privateAdd(this, _subscriptionManager);
    __privateAdd(this, _browsingContextStorage17);
    /**
     * Map of event name to hooks to be called when client is subscribed to the event.
     */
    __privateAdd(this, _subscribeHooks);
    __privateAdd(this, _userContextStorage6);
    __privateSet(this, _browsingContextStorage17, browsingContextStorage);
    __privateSet(this, _userContextStorage6, userContextStorage);
    __privateSet(this, _subscriptionManager, new SubscriptionManager(browsingContextStorage));
    __privateSet(this, _subscribeHooks, new DefaultMap(() => []));
  }
  get subscriptionManager() {
    return __privateGet(this, _subscriptionManager);
  }
  addSubscribeHook(event, hook) {
    __privateGet(this, _subscribeHooks).get(event).push(hook);
  }
  registerEvent(event, contextId) {
    this.registerPromiseEvent(Promise.resolve({
      kind: "success",
      value: event
    }), contextId, event.method);
  }
  registerGlobalEvent(event) {
    this.registerGlobalPromiseEvent(Promise.resolve({
      kind: "success",
      value: event
    }), event.method);
  }
  registerPromiseEvent(event, contextId, eventName) {
    const eventWrapper = new EventWrapper(event, contextId);
    const sortedGoogChannels = __privateGet(this, _subscriptionManager).getGoogChannelsSubscribedToEvent(eventName, contextId);
    __privateMethod(this, _EventManager_instances, bufferEvent_fn).call(this, eventWrapper, eventName);
    for (const googChannel of sortedGoogChannels) {
      this.emit("event", {
        message: OutgoingMessage.createFromPromise(event, googChannel),
        event: eventName
      });
      __privateMethod(this, _EventManager_instances, markEventSent_fn).call(this, eventWrapper, googChannel, eventName);
    }
  }
  registerGlobalPromiseEvent(event, eventName) {
    const eventWrapper = new EventWrapper(event, null);
    const sortedGoogChannels = __privateGet(this, _subscriptionManager).getGoogChannelsSubscribedToEventGlobally(eventName);
    __privateMethod(this, _EventManager_instances, bufferEvent_fn).call(this, eventWrapper, eventName);
    for (const googChannel of sortedGoogChannels) {
      this.emit("event", {
        message: OutgoingMessage.createFromPromise(event, googChannel),
        event: eventName
      });
      __privateMethod(this, _EventManager_instances, markEventSent_fn).call(this, eventWrapper, googChannel, eventName);
    }
  }
  async subscribe(eventNames, contextIds, userContextIds, googChannel) {
    for (const name of eventNames) {
      assertSupportedEvent(name);
    }
    if (userContextIds.length && contextIds.length) {
      throw new InvalidArgumentException("Both userContexts and contexts cannot be specified.");
    }
    __privateGet(this, _browsingContextStorage17).verifyContextsList(contextIds);
    await __privateGet(this, _userContextStorage6).verifyUserContextIdList(userContextIds);
    const unrolledEventNames = new Set(unrollEvents(eventNames));
    const subscribeStepEvents = /* @__PURE__ */ new Map();
    const subscriptionNavigableIds = new Set(contextIds.length ? contextIds.map((contextId) => {
      const id = __privateGet(this, _browsingContextStorage17).findTopLevelContextId(contextId);
      if (!id) {
        throw new InvalidArgumentException("Invalid context id");
      }
      return id;
    }) : __privateGet(this, _browsingContextStorage17).getTopLevelContexts().map((c) => c.id));
    for (const eventName of unrolledEventNames) {
      const subscribedNavigableIds = new Set(__privateGet(this, _browsingContextStorage17).getTopLevelContexts().map((c) => c.id).filter((id) => {
        return __privateGet(this, _subscriptionManager).isSubscribedTo(eventName, id);
      }));
      subscribeStepEvents.set(eventName, difference(subscriptionNavigableIds, subscribedNavigableIds));
    }
    const subscription = __privateGet(this, _subscriptionManager).subscribe(eventNames, contextIds, userContextIds, googChannel);
    for (const eventName of subscription.eventNames) {
      for (const contextId of subscriptionNavigableIds) {
        for (const eventWrapper of __privateMethod(this, _EventManager_instances, getBufferedEvents_fn).call(this, eventName, contextId, googChannel)) {
          this.emit("event", {
            message: OutgoingMessage.createFromPromise(eventWrapper.event, googChannel),
            event: eventName
          });
          __privateMethod(this, _EventManager_instances, markEventSent_fn).call(this, eventWrapper, googChannel, eventName);
        }
      }
    }
    for (const [eventName, contextIds2] of subscribeStepEvents) {
      for (const contextId of contextIds2) {
        __privateGet(this, _subscribeHooks).get(eventName).forEach((hook) => hook(contextId));
      }
    }
    await this.toggleModulesIfNeeded();
    return subscription.id;
  }
  async unsubscribe(eventNames, googChannel) {
    for (const name of eventNames) {
      assertSupportedEvent(name);
    }
    __privateGet(this, _subscriptionManager).unsubscribe(eventNames, googChannel);
    await this.toggleModulesIfNeeded();
  }
  async unsubscribeByIds(subscriptionIds) {
    __privateGet(this, _subscriptionManager).unsubscribeById(subscriptionIds);
    await this.toggleModulesIfNeeded();
  }
  async toggleModulesIfNeeded() {
    await Promise.all(__privateGet(this, _browsingContextStorage17).getAllContexts().map(async (context) => {
      return await context.toggleModulesIfNeeded();
    }));
  }
  clearBufferedEvents(contextId) {
    var _a3;
    for (const eventName of eventBufferLength.keys()) {
      const bufferMapKey = __privateMethod(_a3 = _a$2, _EventManager_static, getMapKey_fn).call(_a3, eventName, contextId);
      __privateGet(this, _eventBuffers).delete(bufferMapKey);
    }
  }
}
_eventToContextsMap = new WeakMap();
_eventBuffers = new WeakMap();
_lastMessageSent = new WeakMap();
_subscriptionManager = new WeakMap();
_browsingContextStorage17 = new WeakMap();
_subscribeHooks = new WeakMap();
_userContextStorage6 = new WeakMap();
_EventManager_static = new WeakSet();
getMapKey_fn = function(eventName, browsingContext) {
  return JSON.stringify({ eventName, browsingContext });
};
_EventManager_instances = new WeakSet();
/**
 * If the event is buffer-able, put it in the buffer.
 */
bufferEvent_fn = function(eventWrapper, eventName) {
  var _a3;
  if (!eventBufferLength.has(eventName)) {
    return;
  }
  const bufferMapKey = __privateMethod(_a3 = _a$2, _EventManager_static, getMapKey_fn).call(_a3, eventName, eventWrapper.contextId);
  if (!__privateGet(this, _eventBuffers).has(bufferMapKey)) {
    __privateGet(this, _eventBuffers).set(bufferMapKey, new Buffer$1(eventBufferLength.get(eventName)));
  }
  __privateGet(this, _eventBuffers).get(bufferMapKey).add(eventWrapper);
  __privateGet(this, _eventToContextsMap).get(eventName).add(eventWrapper.contextId);
};
/**
 * If the event is buffer-able, mark it as sent to the given contextId and goog:channel.
 */
markEventSent_fn = function(eventWrapper, googChannel, eventName) {
  var _a3, _b2;
  if (!eventBufferLength.has(eventName)) {
    return;
  }
  const lastSentMapKey = __privateMethod(_a3 = _a$2, _EventManager_static, getMapKey_fn).call(_a3, eventName, eventWrapper.contextId);
  const lastId = Math.max(((_b2 = __privateGet(this, _lastMessageSent).get(lastSentMapKey)) == null ? void 0 : _b2.get(googChannel)) ?? 0, eventWrapper.id);
  const googChannelMap = __privateGet(this, _lastMessageSent).get(lastSentMapKey);
  if (googChannelMap) {
    googChannelMap.set(googChannel, lastId);
  } else {
    __privateGet(this, _lastMessageSent).set(lastSentMapKey, /* @__PURE__ */ new Map([[googChannel, lastId]]));
  }
};
/**
 * Returns events which are buffered and not yet sent to the given goog:channel events.
 */
getBufferedEvents_fn = function(eventName, contextId, googChannel) {
  var _a3, _b2, _c2;
  const bufferMapKey = __privateMethod(_a3 = _a$2, _EventManager_static, getMapKey_fn).call(_a3, eventName, contextId);
  const lastSentMessageId = ((_b2 = __privateGet(this, _lastMessageSent).get(bufferMapKey)) == null ? void 0 : _b2.get(googChannel)) ?? -Infinity;
  const result = ((_c2 = __privateGet(this, _eventBuffers).get(bufferMapKey)) == null ? void 0 : _c2.get().filter((wrapper) => wrapper.id > lastSentMessageId)) ?? [];
  if (contextId === null) {
    Array.from(__privateGet(this, _eventToContextsMap).get(eventName).keys()).filter((_contextId6) => (
      // Events without context are already in the result.
      _contextId6 !== null && // Events from deleted contexts should not be sent.
      __privateGet(this, _browsingContextStorage17).hasContext(_contextId6)
    )).map((_contextId6) => __privateMethod(this, _EventManager_instances, getBufferedEvents_fn).call(this, eventName, _contextId6, googChannel)).forEach((events) => result.push(...events));
  }
  return result.sort((e1, e2) => e1.id - e2.id);
};
__privateAdd(EventManager, _EventManager_static);
_a$2 = EventManager;
class SpeculationProcessor {
  constructor(eventManager, logger) {
    __privateAdd(this, _eventManager14);
    __privateAdd(this, _logger15);
    __privateSet(this, _eventManager14, eventManager);
    __privateSet(this, _logger15, logger);
  }
  onCdpTargetCreated(cdpTarget) {
    cdpTarget.cdpClient.on("Preload.prefetchStatusUpdated", (event) => {
      var _a3, _b2;
      let prefetchStatus;
      switch (event.status) {
        case "Running":
          prefetchStatus = "pending";
          break;
        case "Ready":
          prefetchStatus = "ready";
          break;
        case "Success":
          prefetchStatus = "success";
          break;
        case "Failure":
          prefetchStatus = "failure";
          break;
        default:
          (_b2 = (_a3 = __privateGet(this, _logger15)) == null ? void 0 : _a3.call(this, LogType.debugWarn)) == null ? void 0 : _b2(`Unknown prefetch status: ${event.status}`);
          return;
      }
      __privateGet(this, _eventManager14).registerEvent({
        type: "event",
        method: "speculation.prefetchStatusUpdated",
        params: {
          context: event.initiatingFrameId,
          url: event.prefetchUrl,
          status: prefetchStatus
        }
      }, cdpTarget.id);
    });
  }
}
_eventManager14 = new WeakMap();
_logger15 = new WeakMap();
class DigitalCredentialsProcessor {
  constructor(browsingContextStorage, contextConfigStorage) {
    __privateAdd(this, _DigitalCredentialsProcessor_instances);
    __privateAdd(this, _browsingContextStorage18);
    __privateAdd(this, _contextConfigStorage4);
    __privateSet(this, _browsingContextStorage18, browsingContextStorage);
    __privateSet(this, _contextConfigStorage4, contextConfigStorage);
  }
  async setVirtualWalletBehavior(params) {
    const { context, action, protocol, response } = params;
    if (action === "respond") {
      if (protocol === void 0 || response === void 0) {
        throw new InvalidArgumentException("Protocol and response are required when action is 'respond'");
      }
    } else {
      if (protocol !== void 0 || response !== void 0) {
        throw new InvalidArgumentException("Protocol and response are only allowed when action is 'respond'");
      }
    }
    if (context === void 0) {
      if (action === "clear") {
        __privateGet(this, _contextConfigStorage4).updateGlobalConfig({
          digitalCredentialsBehavior: null
        });
      } else {
        __privateGet(this, _contextConfigStorage4).updateGlobalConfig({
          digitalCredentialsBehavior: { action, protocol, response }
        });
      }
    } else {
      const browsingContext = __privateGet(this, _browsingContextStorage18).getContext(context);
      if (browsingContext.parentId !== null) {
        throw new UnsupportedOperationException("Only top-level contexts are supported");
      }
      if (action === "clear") {
        __privateGet(this, _contextConfigStorage4).updateBrowsingContextConfig(context, {
          digitalCredentialsBehavior: null
        });
      } else {
        __privateGet(this, _contextConfigStorage4).updateBrowsingContextConfig(context, {
          digitalCredentialsBehavior: { action, protocol, response }
        });
      }
    }
    await __privateMethod(this, _DigitalCredentialsProcessor_instances, applyToAllTargets_fn).call(this);
    return {};
  }
}
_browsingContextStorage18 = new WeakMap();
_contextConfigStorage4 = new WeakMap();
_DigitalCredentialsProcessor_instances = new WeakSet();
applyToAllTargets_fn = async function() {
  const contexts = __privateGet(this, _browsingContextStorage18).getAllContexts();
  const targets = /* @__PURE__ */ new Set();
  for (const c of contexts) {
    targets.add(c.cdpTarget);
  }
  await Promise.all(Array.from(targets).map((target) => __privateMethod(this, _DigitalCredentialsProcessor_instances, applyBehaviorToTarget_fn).call(this, target)));
};
applyBehaviorToTarget_fn = async function(target) {
  if (target.id !== target.topLevelId) {
    return;
  }
  const config = __privateGet(this, _contextConfigStorage4).getActiveConfig(target.topLevelId, target.userContext);
  const behavior = config.digitalCredentialsBehavior;
  if (behavior === null || behavior === void 0) {
    await __privateMethod(this, _DigitalCredentialsProcessor_instances, sendCdpCommand_fn).call(this, target, {
      action: "clear"
    });
    return;
  }
  await __privateMethod(this, _DigitalCredentialsProcessor_instances, sendCdpCommand_fn).call(this, target, behavior);
};
sendCdpCommand_fn = async function(cdpTarget, behavior) {
  await cdpTarget.cdpClient.sendCommand("DigitalCredentials.setVirtualWalletBehavior", {
    // @ts-expect-error action is kept for backward compatibility with older Chromium CDP versions
    action: behavior.action,
    behavior: behavior.action,
    protocol: behavior.protocol,
    response: behavior.response
  });
};
const _BidiServer = class _BidiServer extends EventEmitter {
  constructor(bidiTransport, cdpConnection, browserCdpClient, selfTargetId, defaultUserContextId, defaultUserAgent, parser, logger) {
    super();
    __privateAdd(this, _BidiServer_instances);
    __privateAdd(this, _messageQueue);
    __privateAdd(this, _transport);
    __privateAdd(this, _commandProcessor);
    __privateAdd(this, _eventManager15);
    __privateAdd(this, _browsingContextStorage19, new BrowsingContextStorage());
    __privateAdd(this, _realmStorage7, new RealmStorage());
    __privateAdd(this, _preloadScriptStorage4, new PreloadScriptStorage());
    __privateAdd(this, _bluetoothProcessor3);
    __privateAdd(this, _speculationProcessor2);
    __privateAdd(this, _digitalCredentialsProcessor2);
    __privateAdd(this, _logger16);
    __privateAdd(this, _handleIncomingMessage, (message) => {
      void __privateGet(this, _commandProcessor).processCommand(message).catch((error) => {
        var _a3, _b2;
        (_b2 = (_a3 = __privateGet(this, _logger16)) == null ? void 0 : _a3.call(this, LogType.debugError)) == null ? void 0 : _b2(error);
      });
    });
    __privateAdd(this, _processOutgoingMessage, async (messageEntry) => {
      const message = messageEntry.message;
      if (messageEntry.googChannel !== null) {
        message["goog:channel"] = messageEntry.googChannel;
      }
      await __privateGet(this, _transport).sendMessage(message);
    });
    __privateSet(this, _logger16, logger);
    __privateSet(this, _messageQueue, new ProcessingQueue(__privateGet(this, _processOutgoingMessage), __privateGet(this, _logger16)));
    __privateSet(this, _transport, bidiTransport);
    __privateGet(this, _transport).setOnMessage(__privateGet(this, _handleIncomingMessage));
    const contextConfigStorage = new ContextConfigStorage();
    const userContextStorage = new UserContextStorage(browserCdpClient);
    __privateSet(this, _eventManager15, new EventManager(__privateGet(this, _browsingContextStorage19), userContextStorage));
    const networkStorage = new NetworkStorage(__privateGet(this, _eventManager15), __privateGet(this, _browsingContextStorage19), browserCdpClient, logger);
    __privateSet(this, _bluetoothProcessor3, new BluetoothProcessor(__privateGet(this, _eventManager15), __privateGet(this, _browsingContextStorage19)));
    __privateSet(this, _speculationProcessor2, new SpeculationProcessor(__privateGet(this, _eventManager15), __privateGet(this, _logger16)));
    __privateSet(this, _digitalCredentialsProcessor2, new DigitalCredentialsProcessor(__privateGet(this, _browsingContextStorage19), contextConfigStorage));
    __privateSet(this, _commandProcessor, new CommandProcessor(cdpConnection, browserCdpClient, __privateGet(this, _eventManager15), __privateGet(this, _browsingContextStorage19), __privateGet(this, _realmStorage7), __privateGet(this, _preloadScriptStorage4), networkStorage, contextConfigStorage, __privateGet(this, _bluetoothProcessor3), __privateGet(this, _digitalCredentialsProcessor2), userContextStorage, parser, async (options) => {
      await browserCdpClient.sendCommand("Security.setIgnoreCertificateErrors", {
        ignore: options.acceptInsecureCerts ?? false
      });
      contextConfigStorage.updateGlobalConfig({
        acceptInsecureCerts: options.acceptInsecureCerts ?? false,
        userPromptHandler: options.unhandledPromptBehavior,
        prerenderingDisabled: (options == null ? void 0 : options["goog:prerenderingDisabled"]) ?? false,
        disableNetworkDurableMessages: options == null ? void 0 : options["goog:disableNetworkDurableMessages"]
      });
      new CdpTargetManager(cdpConnection, browserCdpClient, selfTargetId, __privateGet(this, _eventManager15), __privateGet(this, _browsingContextStorage19), __privateGet(this, _realmStorage7), networkStorage, contextConfigStorage, __privateGet(this, _bluetoothProcessor3), __privateGet(this, _speculationProcessor2), __privateGet(this, _preloadScriptStorage4), defaultUserContextId, defaultUserAgent, logger);
      await browserCdpClient.sendCommand("Target.setDiscoverTargets", {
        discover: true
      });
      await browserCdpClient.sendCommand("Target.setAutoAttach", {
        autoAttach: true,
        waitForDebuggerOnStart: true,
        flatten: true,
        // Browser session should attach to tab instead of the page, so that
        // prerendering is not blocked.
        filter: [
          {
            type: "page",
            exclude: true
          },
          {}
        ]
      });
      await __privateMethod(this, _BidiServer_instances, topLevelContextsLoaded_fn).call(this);
    }, __privateGet(this, _logger16)));
    __privateGet(this, _eventManager15).on("event", ({ message, event }) => {
      this.emitOutgoingMessage(message, event);
    });
    __privateGet(this, _commandProcessor).on("response", ({ message, event }) => {
      this.emitOutgoingMessage(message, event);
    });
  }
  /**
   * Creates and starts BiDi Mapper instance.
   */
  static async createAndStart(bidiTransport, cdpConnection, browserCdpClient, selfTargetId, parser, logger) {
    const [defaultUserContextId, version] = await Promise.all([
      __privateMethod(this, _BidiServer_static, getDefaultUserContextId_fn).call(this, browserCdpClient),
      // Fetch the default User Agent to be used in `CdpTarget`. This allows to avoid
      // round trips to the browser for every target override.
      browserCdpClient.sendCommand("Browser.getVersion"),
      // Required for `Browser.downloadWillBegin` events.
      browserCdpClient.sendCommand("Browser.setDownloadBehavior", {
        behavior: "default",
        eventsEnabled: true
      })
    ]);
    const server = new _BidiServer(bidiTransport, cdpConnection, browserCdpClient, selfTargetId, defaultUserContextId, version.userAgent, parser, logger);
    return server;
  }
  /**
   * Sends BiDi message.
   */
  emitOutgoingMessage(messageEntry, event) {
    __privateGet(this, _messageQueue).add(messageEntry, event);
  }
  close() {
    __privateGet(this, _transport).close();
  }
};
_messageQueue = new WeakMap();
_transport = new WeakMap();
_commandProcessor = new WeakMap();
_eventManager15 = new WeakMap();
_browsingContextStorage19 = new WeakMap();
_realmStorage7 = new WeakMap();
_preloadScriptStorage4 = new WeakMap();
_bluetoothProcessor3 = new WeakMap();
_speculationProcessor2 = new WeakMap();
_digitalCredentialsProcessor2 = new WeakMap();
_logger16 = new WeakMap();
_handleIncomingMessage = new WeakMap();
_processOutgoingMessage = new WeakMap();
_BidiServer_static = new WeakSet();
getDefaultUserContextId_fn = async function(browserCdpClient) {
  const [{ defaultBrowserContextId, browserContextIds }, { targetInfos }] = await Promise.all([
    browserCdpClient.sendCommand("Target.getBrowserContexts"),
    browserCdpClient.sendCommand("Target.getTargets")
  ]);
  if (defaultBrowserContextId) {
    return defaultBrowserContextId;
  }
  for (const info of targetInfos) {
    if (info.browserContextId && !browserContextIds.includes(info.browserContextId)) {
      return info.browserContextId;
    }
  }
  return "default";
};
_BidiServer_instances = new WeakSet();
topLevelContextsLoaded_fn = async function() {
  await Promise.all(__privateGet(this, _browsingContextStorage19).getTopLevelContexts().map((c) => c.lifecycleLoaded()));
};
__privateAdd(_BidiServer, _BidiServer_static);
let BidiServer = _BidiServer;
const _BidiCdpSession = class _BidiCdpSession extends index.CDPSession {
  constructor(frame, sessionId) {
    super();
    __privateAdd(this, _detached, false);
    __privateAdd(this, _connection);
    __privateAdd(this, _sessionId, index.Deferred.create());
    __publicField(this, "frame");
    /**
     * @internal
     */
    __publicField(this, "onClose", () => {
      _BidiCdpSession.sessions.delete(this.id());
      __privateSet(this, _detached, true);
    });
    this.frame = frame;
    if (!this.frame.page().browser().cdpSupported) {
      return;
    }
    const connection = this.frame.page().browser().connection;
    __privateSet(this, _connection, connection);
    if (sessionId) {
      __privateGet(this, _sessionId).resolve(sessionId);
      _BidiCdpSession.sessions.set(sessionId, this);
    } else {
      (async () => {
        try {
          const { result } = await connection.send("goog:cdp.getSession", {
            context: frame._id
          });
          __privateGet(this, _sessionId).resolve(result.session);
          _BidiCdpSession.sessions.set(result.session, this);
        } catch (error) {
          __privateGet(this, _sessionId).reject(error);
        }
      })();
    }
    _BidiCdpSession.sessions.set(__privateGet(this, _sessionId).value(), this);
  }
  connection() {
    return void 0;
  }
  get detached() {
    return __privateGet(this, _detached);
  }
  async send(method, params, options) {
    if (__privateGet(this, _connection) === void 0) {
      throw new index.UnsupportedOperation("CDP support is required for this feature. The current browser does not support CDP.");
    }
    if (__privateGet(this, _detached)) {
      throw new index.TargetCloseError(`Protocol error (${method}): Session closed. Most likely the page has been closed.`);
    }
    const session = await __privateGet(this, _sessionId).valueOrThrow();
    const { result } = await __privateGet(this, _connection).send("goog:cdp.sendCommand", {
      method,
      params,
      session
    }, options == null ? void 0 : options.timeout);
    return result.result;
  }
  async detach() {
    if (__privateGet(this, _connection) === void 0 || __privateGet(this, _connection).closed || __privateGet(this, _detached)) {
      return;
    }
    try {
      await this.frame.client.send("Target.detachFromTarget", {
        sessionId: this.id()
      });
    } finally {
      this.onClose();
    }
  }
  id() {
    const value = __privateGet(this, _sessionId).value();
    return typeof value === "string" ? value : "";
  }
};
_detached = new WeakMap();
_connection = new WeakMap();
_sessionId = new WeakMap();
__publicField(_BidiCdpSession, "sessions", /* @__PURE__ */ new Map());
let BidiCdpSession = _BidiCdpSession;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
class BidiConnection extends index.EventEmitter {
  constructor(url, transport, idGenerator, delay = 0, timeout = void 0, logger) {
    super();
    __privateAdd(this, _BidiConnection_instances);
    __privateAdd(this, _url);
    __privateAdd(this, _transport2);
    __privateAdd(this, _delay);
    __privateAdd(this, _timeout, 0);
    __privateAdd(this, _closed, false);
    __privateAdd(this, _logger17);
    __privateAdd(this, _callbacks);
    __privateAdd(this, _emitters, []);
    __privateAdd(this, _debugProtocolSend);
    __privateAdd(this, _debugProtocolReceive);
    __privateSet(this, _url, url);
    __privateSet(this, _delay, delay);
    __privateSet(this, _timeout, timeout ?? 18e4);
    __privateSet(this, _callbacks, new index.CallbackRegistry(idGenerator, logger));
    __privateSet(this, _debugProtocolSend, logger == null ? void 0 : logger(index.DEBUG_PREFIXES.bidiSend));
    __privateSet(this, _debugProtocolReceive, logger == null ? void 0 : logger(index.DEBUG_PREFIXES.bidiReceive));
    __privateSet(this, _transport2, transport);
    __privateGet(this, _transport2).onmessage = this.onMessage.bind(this);
    __privateGet(this, _transport2).onclose = this.unbind.bind(this);
  }
  get closed() {
    return __privateGet(this, _closed);
  }
  get url() {
    return __privateGet(this, _url);
  }
  pipeTo(emitter) {
    __privateGet(this, _emitters).push(emitter);
  }
  emit(type, event) {
    if (process.env["PUPPETEER_WEBDRIVER_BIDI_ONLY"] === "true") {
      __privateMethod(this, _BidiConnection_instances, toWebDriverOnlyEvent_fn).call(this, event);
    }
    for (const emitter of __privateGet(this, _emitters)) {
      emitter.emit(type, event);
    }
    return super.emit(type, event);
  }
  send(method, params, timeout) {
    if (__privateGet(this, _closed)) {
      return Promise.reject(new index.ConnectionClosedError("Connection closed."));
    }
    return __privateGet(this, _callbacks).create(method, timeout ?? __privateGet(this, _timeout), (id) => {
      var _a3;
      const stringifiedMessage = JSON.stringify({
        id,
        method,
        params
      });
      (_a3 = __privateGet(this, _debugProtocolSend)) == null ? void 0 : _a3.call(this, stringifiedMessage);
      __privateGet(this, _transport2).send(stringifiedMessage);
    });
  }
  /**
   * @internal
   */
  async onMessage(message) {
    var _a3, _b2, _c2, _d2;
    if (__privateGet(this, _delay)) {
      await new Promise((f) => {
        return setTimeout(f, __privateGet(this, _delay));
      });
    }
    (_a3 = __privateGet(this, _debugProtocolReceive)) == null ? void 0 : _a3.call(this, message);
    const object = JSON.parse(message);
    if ("type" in object) {
      switch (object.type) {
        case "success":
          __privateGet(this, _callbacks).resolve(object.id, object);
          return;
        case "error":
          if (object.id === null) {
            break;
          }
          __privateGet(this, _callbacks).reject(object.id, createProtocolError(object), `${object.error}: ${object.message}`);
          return;
        case "event":
          if (isCdpEvent(object)) {
            (_b2 = BidiCdpSession.sessions.get(object.params.session)) == null ? void 0 : _b2.emit(object.params.event, object.params.params);
            return;
          }
          this.emit(object.method, object.params);
          return;
      }
    }
    if ("id" in object) {
      __privateGet(this, _callbacks).reject(object.id, `Protocol Error. Message is not in BiDi protocol format: '${message}'`, object.message);
    }
    (_d2 = (_c2 = __privateGet(this, _logger17)) == null ? void 0 : _c2.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _d2(object);
  }
  /**
   * Unbinds the connection, but keeps the transport open. Useful when the transport will
   * be reused by other connection e.g. with different protocol.
   * @internal
   */
  unbind() {
    if (__privateGet(this, _closed)) {
      return;
    }
    __privateSet(this, _closed, true);
    __privateGet(this, _transport2).onmessage = () => {
    };
    __privateGet(this, _transport2).onclose = () => {
    };
    __privateGet(this, _callbacks).clear();
  }
  /**
   * Unbinds the connection and closes the transport.
   */
  dispose() {
    this.unbind();
    __privateGet(this, _transport2).close();
  }
  getPendingProtocolErrors() {
    return __privateGet(this, _callbacks).getPendingProtocolErrors();
  }
}
_url = new WeakMap();
_transport2 = new WeakMap();
_delay = new WeakMap();
_timeout = new WeakMap();
_closed = new WeakMap();
_logger17 = new WeakMap();
_callbacks = new WeakMap();
_emitters = new WeakMap();
_debugProtocolSend = new WeakMap();
_debugProtocolReceive = new WeakMap();
_BidiConnection_instances = new WeakSet();
toWebDriverOnlyEvent_fn = function(event) {
  for (const key in event) {
    if (key.startsWith("goog:")) {
      delete event[key];
    } else {
      if (typeof event[key] === "object" && event[key] !== null) {
        __privateMethod(this, _BidiConnection_instances, toWebDriverOnlyEvent_fn).call(this, event[key]);
      }
    }
  }
};
function createProtocolError(object) {
  let message = `${object.error} ${object.message}`;
  if (object.stacktrace) {
    message += ` ${object.stacktrace}`;
  }
  return message;
}
function isCdpEvent(event) {
  return event.method.startsWith("goog:cdp.");
}
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
async function connectBidiOverCdp(cdp, logger) {
  const bidiServerLogger = logger ? (prefix) => {
    return logger(`bidi:${prefix}`);
  } : void 0;
  const transportBiDi = new NoOpTransport();
  const cdpConnectionAdapter = new CdpConnectionAdapter(cdp);
  const pptrTransport = {
    send(message) {
      transportBiDi.emitMessage(JSON.parse(message));
    },
    close() {
      bidiServer.close();
      cdpConnectionAdapter.close();
      cdp.dispose();
    },
    onmessage(_message2) {
    }
  };
  transportBiDi.on("bidiResponse", (message) => {
    pptrTransport.onmessage(JSON.stringify(message));
  });
  const pptrBiDiConnection = new BidiConnection(cdp.url(), pptrTransport, cdp._idGenerator, cdp.delay, cdp.timeout, logger);
  const bidiServer = await BidiServer.createAndStart(
    transportBiDi,
    cdpConnectionAdapter,
    cdpConnectionAdapter.browserClient(),
    /* selfTargetId= */
    "",
    void 0,
    bidiServerLogger
  );
  return pptrBiDiConnection;
}
class CdpConnectionAdapter {
  constructor(cdp) {
    __privateAdd(this, _cdp);
    __privateAdd(this, _adapters, /* @__PURE__ */ new Map());
    __privateAdd(this, _browserCdpConnection);
    __privateSet(this, _cdp, cdp);
    __privateSet(this, _browserCdpConnection, new CDPClientAdapter(cdp));
  }
  browserClient() {
    return __privateGet(this, _browserCdpConnection);
  }
  getCdpClient(id) {
    const session = __privateGet(this, _cdp).session(id);
    if (!session) {
      throw new Error(`Unknown CDP session with id ${id}`);
    }
    if (!__privateGet(this, _adapters).has(session)) {
      const adapter = new CDPClientAdapter(session, id, __privateGet(this, _browserCdpConnection));
      __privateGet(this, _adapters).set(session, adapter);
      return adapter;
    }
    return __privateGet(this, _adapters).get(session);
  }
  close() {
    __privateGet(this, _browserCdpConnection).close();
    for (const adapter of __privateGet(this, _adapters).values()) {
      adapter.close();
    }
  }
}
_cdp = new WeakMap();
_adapters = new WeakMap();
_browserCdpConnection = new WeakMap();
class CDPClientAdapter extends EventEmitter {
  constructor(client, sessionId, browserClient) {
    super();
    __privateAdd(this, _closed2, false);
    __privateAdd(this, _client);
    __publicField(this, "sessionId");
    __privateAdd(this, _browserClient2);
    __privateAdd(this, _forwardMessage, (method, event) => {
      this.emit(method, event);
    });
    __privateSet(this, _client, client);
    this.sessionId = sessionId;
    __privateSet(this, _browserClient2, browserClient);
    __privateGet(this, _client).on("*", __privateGet(this, _forwardMessage));
  }
  browserClient() {
    return __privateGet(this, _browserClient2);
  }
  async sendCommand(method, ...params) {
    if (__privateGet(this, _closed2)) {
      return;
    }
    try {
      return await __privateGet(this, _client).send(method, ...params);
    } catch (err) {
      if (__privateGet(this, _closed2)) {
        return;
      }
      throw err;
    }
  }
  close() {
    __privateGet(this, _client).off("*", __privateGet(this, _forwardMessage));
    __privateSet(this, _closed2, true);
  }
  isCloseError(error) {
    return error instanceof index.TargetCloseError;
  }
}
_closed2 = new WeakMap();
_client = new WeakMap();
_browserClient2 = new WeakMap();
_forwardMessage = new WeakMap();
class NoOpTransport extends EventEmitter {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onMessage, async (_m) => {
      return;
    });
  }
  emitMessage(message) {
    void __privateGet(this, _onMessage).call(this, message);
  }
  setOnMessage(onMessage) {
    __privateSet(this, _onMessage, onMessage);
  }
  async sendMessage(message) {
    this.emit("bidiResponse", message);
  }
  close() {
    __privateSet(this, _onMessage, async (_m) => {
      return;
    });
  }
}
_onMessage = new WeakMap();
/**
 * @license
 * Copyright 2025 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
class BidiBluetoothEmulation {
  constructor(contextId, session) {
    __privateAdd(this, _session);
    __privateAdd(this, _contextId3);
    __privateSet(this, _contextId3, contextId);
    __privateSet(this, _session, session);
  }
  async emulateAdapter(state, leSupported = true) {
    await __privateGet(this, _session).send("bluetooth.simulateAdapter", {
      context: __privateGet(this, _contextId3),
      state,
      leSupported
    });
  }
  async disableEmulation() {
    await __privateGet(this, _session).send("bluetooth.disableSimulation", {
      context: __privateGet(this, _contextId3)
    });
  }
  async simulatePreconnectedPeripheral(preconnectedPeripheral) {
    await __privateGet(this, _session).send("bluetooth.simulatePreconnectedPeripheral", {
      context: __privateGet(this, _contextId3),
      address: preconnectedPeripheral.address,
      name: preconnectedPeripheral.name,
      manufacturerData: preconnectedPeripheral.manufacturerData,
      knownServiceUuids: preconnectedPeripheral.knownServiceUuids
    });
  }
}
_session = new WeakMap();
_contextId3 = new WeakMap();
/**
 * @license
 * Copyright 2025 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
class BidiDeviceRequestPromptManager {
  constructor(contextId, session) {
    __privateAdd(this, _BidiDeviceRequestPromptManager_instances);
    __privateAdd(this, _session2);
    __privateAdd(this, _contextId4);
    __privateAdd(this, _enabled, false);
    __privateSet(this, _session2, session);
    __privateSet(this, _contextId4, contextId);
  }
  async waitForDevicePrompt(timeout, signal) {
    const deferred = index.Deferred.create({
      message: `Waiting for \`DeviceRequestPrompt\` failed: ${timeout}ms exceeded`,
      timeout
    });
    const onRequestDevicePromptUpdated = (params) => {
      if (params.context === __privateGet(this, _contextId4)) {
        deferred.resolve(new BidiDeviceRequestPrompt(__privateGet(this, _contextId4), params.prompt, __privateGet(this, _session2), params.devices));
        __privateGet(this, _session2).off("bluetooth.requestDevicePromptUpdated", onRequestDevicePromptUpdated);
      }
    };
    __privateGet(this, _session2).on("bluetooth.requestDevicePromptUpdated", onRequestDevicePromptUpdated);
    if (signal) {
      signal.addEventListener("abort", () => {
        deferred.reject(signal.reason);
      }, { once: true });
    }
    await __privateMethod(this, _BidiDeviceRequestPromptManager_instances, enableIfNeeded_fn).call(this);
    return await deferred.valueOrThrow();
  }
}
_session2 = new WeakMap();
_contextId4 = new WeakMap();
_enabled = new WeakMap();
_BidiDeviceRequestPromptManager_instances = new WeakSet();
enableIfNeeded_fn = async function() {
  if (!__privateGet(this, _enabled)) {
    __privateSet(this, _enabled, true);
    await __privateGet(this, _session2).subscribe(["bluetooth.requestDevicePromptUpdated"], [__privateGet(this, _contextId4)]);
  }
};
class BidiDeviceRequestPrompt extends index.DeviceRequestPrompt {
  constructor(contextId, promptId, session, devices) {
    super();
    __privateAdd(this, _session3);
    __privateAdd(this, _promptId);
    __privateAdd(this, _contextId5);
    __privateSet(this, _session3, session);
    __privateSet(this, _promptId, promptId);
    __privateSet(this, _contextId5, contextId);
    this.devices.push(...devices.map((d) => {
      return {
        id: d.id,
        name: d.name ?? "UNKNOWN"
      };
    }));
  }
  async cancel() {
    await __privateGet(this, _session3).send("bluetooth.handleRequestDevicePrompt", {
      context: __privateGet(this, _contextId5),
      prompt: __privateGet(this, _promptId),
      accept: false
    });
  }
  async select(device) {
    await __privateGet(this, _session3).send("bluetooth.handleRequestDevicePrompt", {
      context: __privateGet(this, _contextId5),
      prompt: __privateGet(this, _promptId),
      accept: true,
      device: device.id
    });
  }
  waitForDevice() {
    throw new index.UnsupportedOperation();
  }
}
_session3 = new WeakMap();
_promptId = new WeakMap();
_contextId5 = new WeakMap();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$d = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$d = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
let Navigation = (() => {
  var _request3, _navigation, _browsingContext, _disposables2, _id7, _Navigation_instances, initialize_fn7, matches_fn, session_get, _a3;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  return _a3 = class extends _classSuper {
    constructor(context) {
      super();
      __privateAdd(this, _Navigation_instances);
      __privateAdd(this, _request3, __runInitializers$d(this, _instanceExtraInitializers));
      __privateAdd(this, _navigation);
      __privateAdd(this, _browsingContext);
      __privateAdd(this, _disposables2, new index.DisposableStack());
      __privateAdd(this, _id7);
      __privateSet(this, _browsingContext, context);
    }
    static from(context) {
      var _a4;
      const navigation = new _a3(context);
      __privateMethod(_a4 = navigation, _Navigation_instances, initialize_fn7).call(_a4);
      return navigation;
    }
    get disposed() {
      return __privateGet(this, _disposables2).disposed;
    }
    get request() {
      return __privateGet(this, _request3);
    }
    get navigation() {
      return __privateGet(this, _navigation);
    }
    dispose() {
      this[index.disposeSymbol]();
    }
    [(_dispose_decorators = [index.inertIfDisposed], index.disposeSymbol)]() {
      __privateGet(this, _disposables2).dispose();
      super[index.disposeSymbol]();
    }
  }, _request3 = new WeakMap(), _navigation = new WeakMap(), _browsingContext = new WeakMap(), _disposables2 = new WeakMap(), _id7 = new WeakMap(), _Navigation_instances = new WeakSet(), initialize_fn7 = function() {
    const browsingContextEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _browsingContext)));
    browsingContextEmitter.once("closed", () => {
      this.emit("failed", {
        url: __privateGet(this, _browsingContext).url,
        timestamp: /* @__PURE__ */ new Date()
      });
      this.dispose();
    });
    browsingContextEmitter.on("request", (request) => {
      if (request.navigation === void 0 || // If a request with a navigation ID comes in, then the navigation ID is
      // for this navigation.
      !__privateMethod(this, _Navigation_instances, matches_fn).call(this, request.navigation)) {
        return;
      }
      __privateSet(this, _request3, request);
      this.emit("request", request);
      const requestEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _request3)));
      requestEmitter.on("redirect", (request2) => {
        __privateSet(this, _request3, request2);
      });
    });
    const sessionEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _Navigation_instances, session_get)));
    sessionEmitter.on("browsingContext.navigationStarted", (info) => {
      if (info.context !== __privateGet(this, _browsingContext).id || __privateGet(this, _navigation) !== void 0) {
        return;
      }
      __privateSet(this, _navigation, _a3.from(__privateGet(this, _browsingContext)));
    });
    for (const eventName of [
      "browsingContext.domContentLoaded",
      "browsingContext.load",
      "browsingContext.navigationCommitted"
    ]) {
      sessionEmitter.on(eventName, (info) => {
        if (info.context !== __privateGet(this, _browsingContext).id || info.navigation === null || !__privateMethod(this, _Navigation_instances, matches_fn).call(this, info.navigation)) {
          return;
        }
        this.dispose();
      });
    }
    for (const [eventName, event] of [
      ["browsingContext.fragmentNavigated", "fragment"],
      ["browsingContext.navigationFailed", "failed"],
      ["browsingContext.navigationAborted", "aborted"]
    ]) {
      sessionEmitter.on(eventName, (info) => {
        if (info.context !== __privateGet(this, _browsingContext).id || // Note we don't check if `navigation` is null since `null` means the
        // fragment navigated.
        !__privateMethod(this, _Navigation_instances, matches_fn).call(this, info.navigation)) {
          return;
        }
        this.emit(event, {
          url: info.url,
          timestamp: new Date(info.timestamp)
        });
        this.dispose();
      });
    }
  }, matches_fn = function(navigation) {
    if (__privateGet(this, _navigation) !== void 0 && !__privateGet(this, _navigation).disposed) {
      return false;
    }
    if (__privateGet(this, _id7) === void 0) {
      __privateSet(this, _id7, navigation);
      return true;
    }
    return __privateGet(this, _id7) === navigation;
  }, session_get = function() {
    return __privateGet(this, _browsingContext).userContext.browser.session;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    __esDecorate$d(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$c = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$c = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var _a$1;
let Realm = (() => {
  var _reason, _a3;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _disown_decorators;
  let _callFunction_decorators;
  let _evaluate_decorators;
  let _resolveExecutionContextId_decorators;
  return _a3 = class extends _classSuper {
    constructor(id, origin) {
      super();
      __privateAdd(this, _reason, __runInitializers$c(this, _instanceExtraInitializers));
      __publicField(this, "disposables", new index.DisposableStack());
      __publicField(this, "id");
      __publicField(this, "origin");
      __publicField(this, "executionContextId");
      this.id = id;
      this.origin = origin;
    }
    get disposed() {
      return __privateGet(this, _reason) !== void 0;
    }
    get target() {
      return { realm: this.id };
    }
    dispose(reason) {
      __privateSet(this, _reason, reason);
      this[index.disposeSymbol]();
    }
    async disown(handles) {
      await this.session.send("script.disown", {
        target: this.target,
        handles
      });
    }
    async callFunction(functionDeclaration, awaitPromise, options = {}) {
      const { result } = await this.session.send("script.callFunction", {
        functionDeclaration,
        awaitPromise,
        target: this.target,
        ...options
      });
      return result;
    }
    async evaluate(expression, awaitPromise, options = {}) {
      const { result } = await this.session.send("script.evaluate", {
        expression,
        awaitPromise,
        target: this.target,
        ...options
      });
      return result;
    }
    async resolveExecutionContextId() {
      if (!this.executionContextId) {
        const { result } = await this.session.connection.send("goog:cdp.resolveRealm", { realm: this.id });
        this.executionContextId = result.executionContextId;
      }
      return this.executionContextId;
    }
    [(_dispose_decorators = [index.inertIfDisposed], _disown_decorators = [index.throwIfDisposed((realm) => {
      return __privateGet(realm, _reason);
    })], _callFunction_decorators = [index.throwIfDisposed((realm) => {
      return __privateGet(realm, _reason);
    })], _evaluate_decorators = [index.throwIfDisposed((realm) => {
      return __privateGet(realm, _reason);
    })], _resolveExecutionContextId_decorators = [index.throwIfDisposed((realm) => {
      return __privateGet(realm, _reason);
    })], index.disposeSymbol)]() {
      __privateGet(this, _reason) ?? __privateSet(this, _reason, "Realm already destroyed, probably because all associated browsing contexts closed.");
      this.emit("destroyed", __privateGet(this, _reason));
      this.disposables.dispose();
      super[index.disposeSymbol]();
    }
  }, _reason = new WeakMap(), (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    __esDecorate$c(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$c(_a3, null, _disown_decorators, { kind: "method", name: "disown", static: false, private: false, access: { has: (obj) => "disown" in obj, get: (obj) => obj.disown }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$c(_a3, null, _callFunction_decorators, { kind: "method", name: "callFunction", static: false, private: false, access: { has: (obj) => "callFunction" in obj, get: (obj) => obj.callFunction }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$c(_a3, null, _evaluate_decorators, { kind: "method", name: "evaluate", static: false, private: false, access: { has: (obj) => "evaluate" in obj, get: (obj) => obj.evaluate }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$c(_a3, null, _resolveExecutionContextId_decorators, { kind: "method", name: "resolveExecutionContextId", static: false, private: false, access: { has: (obj) => "resolveExecutionContextId" in obj, get: (obj) => obj.resolveExecutionContextId }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
const _WindowRealm = class _WindowRealm extends Realm {
  constructor(context, sandbox) {
    super("", "");
    __privateAdd(this, _WindowRealm_instances2);
    __publicField(this, "browsingContext");
    __publicField(this, "sandbox");
    __privateAdd(this, _workers2, /* @__PURE__ */ new Map());
    this.browsingContext = context;
    this.sandbox = sandbox;
  }
  static from(context, sandbox) {
    var _a3;
    const realm = new _WindowRealm(context, sandbox);
    __privateMethod(_a3 = realm, _WindowRealm_instances2, initialize_fn).call(_a3);
    return realm;
  }
  get session() {
    return this.browsingContext.userContext.browser.session;
  }
  get target() {
    return { context: this.browsingContext.id, sandbox: this.sandbox };
  }
};
_workers2 = new WeakMap();
_WindowRealm_instances2 = new WeakSet();
initialize_fn = function() {
  const browsingContextEmitter = this.disposables.use(new index.EventEmitter(this.browsingContext));
  browsingContextEmitter.on("closed", (reason) => {
    this.dispose(reason);
  });
  const sessionEmitter = this.disposables.use(new index.EventEmitter(this.session));
  sessionEmitter.on("script.realmCreated", (info) => {
    if (info.type !== "window" || info.context !== this.browsingContext.id || info.sandbox !== this.sandbox) {
      return;
    }
    this.id = info.realm;
    this.origin = info.origin;
    this.executionContextId = void 0;
    this.emit("updated", this);
  });
  sessionEmitter.on("script.realmCreated", (info) => {
    if (info.type !== "dedicated-worker") {
      return;
    }
    if (!info.owners.includes(this.id)) {
      return;
    }
    const realm = DedicatedWorkerRealm.from(this, info.realm, info.origin);
    __privateGet(this, _workers2).set(realm.id, realm);
    const realmEmitter = this.disposables.use(new index.EventEmitter(realm));
    realmEmitter.once("destroyed", () => {
      realmEmitter.removeAllListeners();
      __privateGet(this, _workers2).delete(realm.id);
    });
    this.emit("worker", realm);
  });
  sessionEmitter.on("log.entryAdded", (entry) => {
    if (entry.source.realm !== this.id) {
      return;
    }
    this.emit("log", entry);
  });
};
let WindowRealm = _WindowRealm;
class DedicatedWorkerRealm extends Realm {
  constructor(owner, id, origin) {
    super(id, origin);
    __privateAdd(this, _DedicatedWorkerRealm_instances);
    __privateAdd(this, _workers3, /* @__PURE__ */ new Map());
    __publicField(this, "owners");
    this.owners = /* @__PURE__ */ new Set([owner]);
  }
  static from(owner, id, origin) {
    var _a3;
    const realm = new _a$1(owner, id, origin);
    __privateMethod(_a3 = realm, _DedicatedWorkerRealm_instances, initialize_fn2).call(_a3);
    return realm;
  }
  get session() {
    return this.owners.values().next().value.session;
  }
}
_workers3 = new WeakMap();
_DedicatedWorkerRealm_instances = new WeakSet();
initialize_fn2 = function() {
  const sessionEmitter = this.disposables.use(new index.EventEmitter(this.session));
  sessionEmitter.on("script.realmDestroyed", (info) => {
    if (info.realm !== this.id) {
      return;
    }
    this.dispose("Realm already destroyed.");
  });
  sessionEmitter.on("script.realmCreated", (info) => {
    if (info.type !== "dedicated-worker") {
      return;
    }
    if (!info.owners.includes(this.id)) {
      return;
    }
    const realm = _a$1.from(this, info.realm, info.origin);
    __privateGet(this, _workers3).set(realm.id, realm);
    const realmEmitter = this.disposables.use(new index.EventEmitter(realm));
    realmEmitter.once("destroyed", () => {
      __privateGet(this, _workers3).delete(realm.id);
    });
    this.emit("worker", realm);
  });
  sessionEmitter.on("log.entryAdded", (entry) => {
    if (entry.source.realm !== this.id) {
      return;
    }
    this.emit("log", entry);
  });
};
_a$1 = DedicatedWorkerRealm;
const _SharedWorkerRealm = class _SharedWorkerRealm extends Realm {
  constructor(browser, id, origin) {
    super(id, origin);
    __privateAdd(this, _SharedWorkerRealm_instances);
    __privateAdd(this, _workers4, /* @__PURE__ */ new Map());
    __publicField(this, "browser");
    this.browser = browser;
  }
  static from(browser, id, origin) {
    var _a3;
    const realm = new _SharedWorkerRealm(browser, id, origin);
    __privateMethod(_a3 = realm, _SharedWorkerRealm_instances, initialize_fn3).call(_a3);
    return realm;
  }
  get session() {
    return this.browser.session;
  }
};
_workers4 = new WeakMap();
_SharedWorkerRealm_instances = new WeakSet();
initialize_fn3 = function() {
  const sessionEmitter = this.disposables.use(new index.EventEmitter(this.session));
  sessionEmitter.on("script.realmDestroyed", (info) => {
    if (info.realm !== this.id) {
      return;
    }
    this.dispose("Realm already destroyed.");
  });
  sessionEmitter.on("script.realmCreated", (info) => {
    if (info.type !== "dedicated-worker") {
      return;
    }
    if (!info.owners.includes(this.id)) {
      return;
    }
    const realm = DedicatedWorkerRealm.from(this, info.realm, info.origin);
    __privateGet(this, _workers4).set(realm.id, realm);
    const realmEmitter = this.disposables.use(new index.EventEmitter(realm));
    realmEmitter.once("destroyed", () => {
      __privateGet(this, _workers4).delete(realm.id);
    });
    this.emit("worker", realm);
  });
  sessionEmitter.on("log.entryAdded", (entry) => {
    if (entry.source.realm !== this.id) {
      return;
    }
    this.emit("log", entry);
  });
};
let SharedWorkerRealm = _SharedWorkerRealm;
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$b = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$b = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
let Request = (() => {
  var _responseContentPromise, _requestBodyPromise, _error, _redirect, _response3, _browsingContext, _disposables2, _event2, _Request_instances, initialize_fn7, session_get, _a3;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  return _a3 = class extends _classSuper {
    constructor(browsingContext, event) {
      super();
      __privateAdd(this, _Request_instances);
      __privateAdd(this, _responseContentPromise, (__runInitializers$b(this, _instanceExtraInitializers), null));
      __privateAdd(this, _requestBodyPromise, null);
      __privateAdd(this, _error);
      __privateAdd(this, _redirect);
      __privateAdd(this, _response3);
      __privateAdd(this, _browsingContext);
      __privateAdd(this, _disposables2, new index.DisposableStack());
      __privateAdd(this, _event2);
      __privateSet(this, _browsingContext, browsingContext);
      __privateSet(this, _event2, event);
    }
    static from(browsingContext, event) {
      var _a4;
      const request = new _a3(browsingContext, event);
      __privateMethod(_a4 = request, _Request_instances, initialize_fn7).call(_a4);
      return request;
    }
    get disposed() {
      return __privateGet(this, _disposables2).disposed;
    }
    get error() {
      return __privateGet(this, _error);
    }
    get headers() {
      return __privateGet(this, _event2).request.headers;
    }
    get id() {
      return __privateGet(this, _event2).request.request;
    }
    get initiator() {
      var _a4, _b2;
      return {
        ...__privateGet(this, _event2).initiator,
        // Initiator URL is not specified in BiDi.
        // @ts-expect-error non-standard property.
        url: (_a4 = __privateGet(this, _event2).request["goog:resourceInitiator"]) == null ? void 0 : _a4.url,
        // @ts-expect-error non-standard property.
        stack: (_b2 = __privateGet(this, _event2).request["goog:resourceInitiator"]) == null ? void 0 : _b2.stack
      };
    }
    get method() {
      return __privateGet(this, _event2).request.method;
    }
    get navigation() {
      return __privateGet(this, _event2).navigation ?? void 0;
    }
    get redirect() {
      return __privateGet(this, _redirect);
    }
    get lastRedirect() {
      let redirect = __privateGet(this, _redirect);
      while (redirect) {
        if (redirect && !__privateGet(redirect, _redirect)) {
          return redirect;
        }
        redirect = __privateGet(redirect, _redirect);
      }
      return redirect;
    }
    get response() {
      return __privateGet(this, _response3);
    }
    get url() {
      return __privateGet(this, _event2).request.url;
    }
    get isBlocked() {
      return __privateGet(this, _event2).isBlocked;
    }
    get resourceType() {
      return __privateGet(this, _event2).request["goog:resourceType"] ?? void 0;
    }
    get postData() {
      return __privateGet(this, _event2).request["goog:postData"] ?? void 0;
    }
    get hasPostData() {
      return (__privateGet(this, _event2).request.bodySize ?? 0) > 0;
    }
    async continueRequest({ url, method, headers, cookies, body }) {
      await __privateGet(this, _Request_instances, session_get).send("network.continueRequest", {
        request: this.id,
        url,
        method,
        headers,
        body,
        cookies
      });
    }
    async failRequest() {
      await __privateGet(this, _Request_instances, session_get).send("network.failRequest", {
        request: this.id
      });
    }
    async provideResponse({ statusCode, reasonPhrase, headers, body }) {
      await __privateGet(this, _Request_instances, session_get).send("network.provideResponse", {
        request: this.id,
        statusCode,
        reasonPhrase,
        headers,
        body
      });
    }
    async fetchPostData() {
      if (!this.hasPostData) {
        return void 0;
      }
      if (!__privateGet(this, _requestBodyPromise)) {
        __privateSet(this, _requestBodyPromise, (async () => {
          const data = await __privateGet(this, _Request_instances, session_get).send("network.getData", {
            dataType: "request",
            request: this.id
          });
          if (data.result.bytes.type === "string") {
            return data.result.bytes.value;
          }
          throw new index.UnsupportedOperation(`Collected request body data of type ${data.result.bytes.type} is not supported`);
        })());
      }
      return await __privateGet(this, _requestBodyPromise);
    }
    async getResponseContent() {
      if (!__privateGet(this, _responseContentPromise)) {
        __privateSet(this, _responseContentPromise, (async () => {
          try {
            const data = await __privateGet(this, _Request_instances, session_get).send("network.getData", {
              dataType: "response",
              request: this.id
            });
            return index.stringToTypedArray(data.result.bytes.value, data.result.bytes.type === "base64");
          } catch (error) {
            if (error instanceof index.ProtocolError && error.originalMessage.includes("No resource with given identifier found")) {
              throw new index.ProtocolError("Could not load response body for this request. This might happen if the request is a preflight request.");
            }
            throw error;
          }
        })());
      }
      return await __privateGet(this, _responseContentPromise);
    }
    async continueWithAuth(parameters) {
      if (parameters.action === "provideCredentials") {
        await __privateGet(this, _Request_instances, session_get).send("network.continueWithAuth", {
          request: this.id,
          action: parameters.action,
          credentials: parameters.credentials
        });
      } else {
        await __privateGet(this, _Request_instances, session_get).send("network.continueWithAuth", {
          request: this.id,
          action: parameters.action
        });
      }
    }
    dispose() {
      this[index.disposeSymbol]();
    }
    [(_dispose_decorators = [index.inertIfDisposed], index.disposeSymbol)]() {
      __privateGet(this, _disposables2).dispose();
      super[index.disposeSymbol]();
    }
    timing() {
      return __privateGet(this, _event2).request.timings;
    }
  }, _responseContentPromise = new WeakMap(), _requestBodyPromise = new WeakMap(), _error = new WeakMap(), _redirect = new WeakMap(), _response3 = new WeakMap(), _browsingContext = new WeakMap(), _disposables2 = new WeakMap(), _event2 = new WeakMap(), _Request_instances = new WeakSet(), initialize_fn7 = function() {
    const browsingContextEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _browsingContext)));
    browsingContextEmitter.once("closed", (reason) => {
      __privateSet(this, _error, reason);
      this.emit("error", reason);
      this.dispose();
    });
    const sessionEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _Request_instances, session_get)));
    sessionEmitter.on("network.beforeRequestSent", (event) => {
      if (event.context !== __privateGet(this, _browsingContext).id || event.request.request !== this.id) {
        return;
      }
      const previousRequestHasAuth = __privateGet(this, _event2).request.headers.find((header) => {
        return header.name.toLowerCase() === "authorization";
      });
      const newRequestHasAuth = event.request.headers.find((header) => {
        return header.name.toLowerCase() === "authorization";
      });
      const isAfterAuth = newRequestHasAuth && !previousRequestHasAuth;
      if (event.redirectCount !== __privateGet(this, _event2).redirectCount + 1 && !isAfterAuth) {
        return;
      }
      __privateSet(this, _redirect, _a3.from(__privateGet(this, _browsingContext), event));
      this.emit("redirect", __privateGet(this, _redirect));
      this.dispose();
    });
    sessionEmitter.on("network.authRequired", (event) => {
      if (event.context !== __privateGet(this, _browsingContext).id || event.request.request !== this.id || // Don't try to authenticate for events that are not blocked
      !event.isBlocked) {
        return;
      }
      this.emit("authenticate", void 0);
    });
    sessionEmitter.on("network.fetchError", (event) => {
      if (event.context !== __privateGet(this, _browsingContext).id || event.request.request !== this.id || __privateGet(this, _event2).redirectCount !== event.redirectCount) {
        return;
      }
      __privateSet(this, _error, event.errorText);
      this.emit("error", __privateGet(this, _error));
      this.dispose();
    });
    sessionEmitter.on("network.responseStarted", (event) => {
      if (event.context !== __privateGet(this, _browsingContext).id || event.request.request !== this.id || __privateGet(this, _event2).redirectCount !== event.redirectCount) {
        return;
      }
      __privateSet(this, _response3, event.response);
      __privateGet(this, _event2).request.timings = event.request.timings;
      this.emit("response", __privateGet(this, _response3));
    });
    sessionEmitter.on("network.responseCompleted", (event) => {
      if (event.context !== __privateGet(this, _browsingContext).id || event.request.request !== this.id || __privateGet(this, _event2).redirectCount !== event.redirectCount) {
        return;
      }
      __privateSet(this, _response3, event.response);
      __privateGet(this, _event2).request.timings = event.request.timings;
      this.emit("success", __privateGet(this, _response3));
      if (__privateGet(this, _response3).status >= 300 && __privateGet(this, _response3).status < 400) {
        return;
      }
      this.dispose();
    });
  }, session_get = function() {
    return __privateGet(this, _browsingContext).userContext.browser.session;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    __esDecorate$b(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$a = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$a = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
let UserPrompt = (() => {
  var _reason, _result2, _disposables2, _UserPrompt_instances, initialize_fn7, session_get, _a3;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _handle_decorators;
  return _a3 = class extends _classSuper {
    constructor(context, info) {
      super();
      __privateAdd(this, _UserPrompt_instances);
      __privateAdd(this, _reason, __runInitializers$a(this, _instanceExtraInitializers));
      __privateAdd(this, _result2);
      __privateAdd(this, _disposables2, new index.DisposableStack());
      __publicField(this, "browsingContext");
      __publicField(this, "info");
      this.browsingContext = context;
      this.info = info;
    }
    static from(browsingContext, info) {
      var _a4;
      const userPrompt = new _a3(browsingContext, info);
      __privateMethod(_a4 = userPrompt, _UserPrompt_instances, initialize_fn7).call(_a4);
      return userPrompt;
    }
    get closed() {
      return __privateGet(this, _reason) !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get handled() {
      if (this.info.handler === "accept" || this.info.handler === "dismiss") {
        return true;
      }
      return __privateGet(this, _result2) !== void 0;
    }
    get result() {
      return __privateGet(this, _result2);
    }
    dispose(reason) {
      __privateSet(this, _reason, reason);
      this[index.disposeSymbol]();
    }
    async handle(options = {}) {
      await __privateGet(this, _UserPrompt_instances, session_get).send("browsingContext.handleUserPrompt", {
        ...options,
        context: this.info.context
      });
      return __privateGet(this, _result2);
    }
    [(_dispose_decorators = [index.inertIfDisposed], _handle_decorators = [index.throwIfDisposed((prompt) => {
      return __privateGet(prompt, _reason);
    })], index.disposeSymbol)]() {
      __privateGet(this, _reason) ?? __privateSet(this, _reason, "User prompt already closed, probably because the associated browsing context was destroyed.");
      this.emit("closed", __privateGet(this, _reason));
      __privateGet(this, _disposables2).dispose();
      super[index.disposeSymbol]();
    }
  }, _reason = new WeakMap(), _result2 = new WeakMap(), _disposables2 = new WeakMap(), _UserPrompt_instances = new WeakSet(), initialize_fn7 = function() {
    const browserContextEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(this.browsingContext));
    browserContextEmitter.once("closed", (reason) => {
      this.dispose(`User prompt already closed: ${reason}`);
    });
    const sessionEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _UserPrompt_instances, session_get)));
    sessionEmitter.on("browsingContext.userPromptClosed", (parameters) => {
      if (parameters.context !== this.browsingContext.id) {
        return;
      }
      __privateSet(this, _result2, parameters);
      this.emit("handled", parameters);
      this.dispose("User prompt already handled.");
    });
  }, session_get = function() {
    return this.browsingContext.userContext.browser.session;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    __esDecorate$a(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$a(_a3, null, _handle_decorators, { kind: "method", name: "handle", static: false, private: false, access: { has: (obj) => "handle" in obj, get: (obj) => obj.handle }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$9 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$9 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
let BrowsingContext = (() => {
  var _navigation, _reason, _url2, _clientHintsAreSet, _children2, _disposables2, _realms, _emulationState, _bluetoothEmulation, _deviceRequestPromptManager, _BrowsingContext_instances, initialize_fn7, session_get, createWindowRealm_fn, _a3;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _activate_decorators;
  let _captureScreenshot_decorators;
  let _close_decorators;
  let _traverseHistory_decorators;
  let _navigate_decorators;
  let _reload_decorators;
  let _setCacheBehavior_decorators;
  let _print_decorators;
  let _handleUserPrompt_decorators;
  let _setViewport_decorators;
  let _setTouchOverride_decorators;
  let _performActions_decorators;
  let _releaseActions_decorators;
  let _createWindowRealm_decorators;
  let _addPreloadScript_decorators;
  let _addIntercept_decorators;
  let _removePreloadScript_decorators;
  let _setGeolocationOverride_decorators;
  let _setTimezoneOverride_decorators;
  let _setLocaleOverride_decorators;
  let _setScreenOrientationOverride_decorators;
  let _getCookies_decorators;
  let _setCookie_decorators;
  let _setFiles_decorators;
  let _subscribe_decorators;
  let _addInterception_decorators;
  let _deleteCookie_decorators;
  let _locateNodes_decorators;
  return _a3 = class extends _classSuper {
    constructor(userContext, parent, id, url, originalOpener, clientWindow) {
      super();
      __privateAdd(this, _BrowsingContext_instances);
      __privateAdd(this, _navigation, __runInitializers$9(this, _instanceExtraInitializers));
      __privateAdd(this, _reason);
      __privateAdd(this, _url2);
      // Indicated whether client hints have been set to non-default.
      __privateAdd(this, _clientHintsAreSet, false);
      __privateAdd(this, _children2, /* @__PURE__ */ new Map());
      __privateAdd(this, _disposables2, new index.DisposableStack());
      __privateAdd(this, _realms, /* @__PURE__ */ new Map());
      __publicField(this, "defaultRealm");
      __publicField(this, "id");
      __publicField(this, "parent");
      __publicField(this, "userContext");
      __publicField(this, "originalOpener");
      __publicField(this, "windowId");
      __privateAdd(this, _emulationState, { javaScriptEnabled: true });
      __privateAdd(this, _bluetoothEmulation);
      __privateAdd(this, _deviceRequestPromptManager);
      __privateSet(this, _url2, url);
      this.id = id;
      this.parent = parent;
      this.userContext = userContext;
      this.originalOpener = originalOpener;
      this.windowId = clientWindow;
      this.defaultRealm = __privateMethod(this, _BrowsingContext_instances, createWindowRealm_fn).call(this);
      __privateSet(this, _bluetoothEmulation, new BidiBluetoothEmulation(this.id, __privateGet(this, _BrowsingContext_instances, session_get)));
      __privateSet(this, _deviceRequestPromptManager, new BidiDeviceRequestPromptManager(this.id, __privateGet(this, _BrowsingContext_instances, session_get)));
    }
    static from(userContext, parent, id, url, originalOpener, clientWindow) {
      var _a4;
      const browsingContext = new _a3(userContext, parent, id, url, originalOpener, clientWindow);
      __privateMethod(_a4 = browsingContext, _BrowsingContext_instances, initialize_fn7).call(_a4);
      return browsingContext;
    }
    get children() {
      return __privateGet(this, _children2).values();
    }
    get closed() {
      return __privateGet(this, _reason) !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get realms() {
      const self = this;
      return function* () {
        yield self.defaultRealm;
        yield* __privateGet(self, _realms).values();
      }();
    }
    get top() {
      let context = this;
      for (let { parent } = context; parent; { parent } = context) {
        context = parent;
      }
      return context;
    }
    get url() {
      return __privateGet(this, _url2);
    }
    dispose(reason) {
      __privateSet(this, _reason, reason);
      for (const context of __privateGet(this, _children2).values()) {
        context.dispose("Parent browsing context was disposed");
      }
      this[index.disposeSymbol]();
    }
    async activate() {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.activate", {
        context: this.id
      });
    }
    async captureScreenshot(options = {}) {
      const { result: { data } } = await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.captureScreenshot", {
        context: this.id,
        ...options
      });
      return data;
    }
    async close(promptUnload) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.close", {
        context: this.id,
        promptUnload
      });
    }
    async traverseHistory(delta) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.traverseHistory", {
        context: this.id,
        delta
      });
    }
    async navigate(url, wait) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.navigate", {
        context: this.id,
        url,
        wait
      });
    }
    async reload(options = {}) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.reload", {
        context: this.id,
        ...options
      });
    }
    async setCacheBehavior(cacheBehavior) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("network.setCacheBehavior", {
        contexts: [this.id],
        cacheBehavior
      });
    }
    async print(options = {}) {
      const { result: { data } } = await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.print", {
        context: this.id,
        ...options
      });
      return data;
    }
    async handleUserPrompt(options = {}) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.handleUserPrompt", {
        context: this.id,
        ...options
      });
    }
    async setViewport(options = {}) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.setViewport", {
        context: this.id,
        ...options
      });
    }
    async setTouchOverride(maxTouchPoints) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("emulation.setTouchOverride", {
        contexts: [this.id],
        maxTouchPoints
      });
    }
    async performActions(actions) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("input.performActions", {
        context: this.id,
        actions
      });
    }
    async releaseActions() {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("input.releaseActions", {
        context: this.id
      });
    }
    createWindowRealm(sandbox) {
      return __privateMethod(this, _BrowsingContext_instances, createWindowRealm_fn).call(this, sandbox);
    }
    async addPreloadScript(functionDeclaration, options = {}) {
      return await this.userContext.browser.addPreloadScript(functionDeclaration, {
        ...options,
        contexts: [this]
      });
    }
    async addIntercept(options) {
      const { result: { intercept } } = await this.userContext.browser.session.send("network.addIntercept", {
        ...options,
        contexts: [this.id]
      });
      return intercept;
    }
    async removePreloadScript(script) {
      await this.userContext.browser.removePreloadScript(script);
    }
    async setGeolocationOverride(options) {
      if (!("coordinates" in options)) {
        throw new Error("Missing coordinates");
      }
      await this.userContext.browser.session.send("emulation.setGeolocationOverride", {
        coordinates: options.coordinates,
        contexts: [this.id]
      });
    }
    async setTimezoneOverride(timezoneId) {
      if (timezoneId == null ? void 0 : timezoneId.startsWith("GMT")) {
        timezoneId = timezoneId == null ? void 0 : timezoneId.replace("GMT", "");
      }
      await this.userContext.browser.session.send("emulation.setTimezoneOverride", {
        timezone: timezoneId ?? null,
        contexts: [this.id]
      });
    }
    async setLocaleOverride(locale) {
      await this.userContext.browser.session.send("emulation.setLocaleOverride", {
        locale: locale ?? null,
        contexts: [this.id]
      });
    }
    async setScreenOrientationOverride(screenOrientation) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("emulation.setScreenOrientationOverride", {
        screenOrientation,
        contexts: [this.id]
      });
    }
    async getCookies(options = {}) {
      const { result: { cookies } } = await __privateGet(this, _BrowsingContext_instances, session_get).send("storage.getCookies", {
        ...options,
        partition: {
          type: "context",
          context: this.id
        }
      });
      return cookies;
    }
    async setCookie(cookie) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("storage.setCookie", {
        cookie,
        partition: {
          type: "context",
          context: this.id
        }
      });
    }
    async setFiles(element, files) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("input.setFiles", {
        context: this.id,
        element,
        files
      });
    }
    async subscribe(events) {
      await __privateGet(this, _BrowsingContext_instances, session_get).subscribe(events, [this.id]);
    }
    async addInterception(events) {
      await __privateGet(this, _BrowsingContext_instances, session_get).subscribe(events, [this.id]);
    }
    [(_dispose_decorators = [index.inertIfDisposed], _activate_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _captureScreenshot_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _close_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _traverseHistory_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _navigate_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _reload_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setCacheBehavior_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _print_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _handleUserPrompt_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setViewport_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setTouchOverride_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _performActions_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _releaseActions_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _createWindowRealm_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _addPreloadScript_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _addIntercept_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _removePreloadScript_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setGeolocationOverride_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setTimezoneOverride_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setLocaleOverride_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setScreenOrientationOverride_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _getCookies_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setCookie_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setFiles_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _subscribe_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _addInterception_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], index.disposeSymbol)]() {
      __privateGet(this, _reason) ?? __privateSet(this, _reason, "Browsing context already closed, probably because the user context closed.");
      this.emit("closed", __privateGet(this, _reason));
      __privateGet(this, _disposables2).dispose();
      super[index.disposeSymbol]();
    }
    async deleteCookie(...cookieFilters) {
      await Promise.all(cookieFilters.map(async (filter) => {
        await __privateGet(this, _BrowsingContext_instances, session_get).send("storage.deleteCookies", {
          filter,
          partition: {
            type: "context",
            context: this.id
          }
        });
      }));
    }
    async locateNodes(locator, startNodes = []) {
      const result = await __privateGet(this, _BrowsingContext_instances, session_get).send("browsingContext.locateNodes", {
        context: this.id,
        locator,
        startNodes: startNodes.length ? startNodes : void 0
      });
      return result.result.nodes;
    }
    async setJavaScriptEnabled(enabled) {
      await this.userContext.browser.session.send("emulation.setScriptingEnabled", {
        // Enabled `null` means `default`, `false` means `disabled`.
        enabled: enabled ? null : false,
        contexts: [this.id]
      });
      __privateGet(this, _emulationState).javaScriptEnabled = enabled;
    }
    isJavaScriptEnabled() {
      return __privateGet(this, _emulationState).javaScriptEnabled;
    }
    async setUserAgent(userAgent) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("emulation.setUserAgentOverride", {
        userAgent,
        contexts: [this.id]
      });
    }
    async setClientHintsOverride(clientHints) {
      if (clientHints === null && !__privateGet(this, _clientHintsAreSet)) {
        return;
      }
      __privateSet(this, _clientHintsAreSet, true);
      await __privateGet(this, _BrowsingContext_instances, session_get).send("userAgentClientHints.setClientHintsOverride", {
        clientHints,
        contexts: [this.id]
      });
    }
    async setOfflineMode(enabled) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("emulation.setNetworkConditions", {
        networkConditions: enabled ? {
          type: "offline"
        } : null,
        contexts: [this.id]
      });
    }
    get bluetooth() {
      return __privateGet(this, _bluetoothEmulation);
    }
    async waitForDevicePrompt(timeout, signal) {
      return await __privateGet(this, _deviceRequestPromptManager).waitForDevicePrompt(timeout, signal);
    }
    async setExtraHTTPHeaders(headers) {
      await __privateGet(this, _BrowsingContext_instances, session_get).send("network.setExtraHeaders", {
        headers: Object.entries(headers).map(([key, value]) => {
          index.assert(index.isString(value), `Expected value of header "${key}" to be String, but "${typeof value}" is found.`);
          return {
            name: key.toLowerCase(),
            value: { type: "string", value }
          };
        }),
        contexts: [this.id]
      });
    }
  }, _navigation = new WeakMap(), _reason = new WeakMap(), _url2 = new WeakMap(), _clientHintsAreSet = new WeakMap(), _children2 = new WeakMap(), _disposables2 = new WeakMap(), _realms = new WeakMap(), _emulationState = new WeakMap(), _bluetoothEmulation = new WeakMap(), _deviceRequestPromptManager = new WeakMap(), _BrowsingContext_instances = new WeakSet(), initialize_fn7 = function() {
    const userContextEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(this.userContext));
    userContextEmitter.once("closed", (reason) => {
      this.dispose(`Browsing context already closed: ${reason}`);
    });
    const sessionEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _BrowsingContext_instances, session_get)));
    sessionEmitter.on("input.fileDialogOpened", (info) => {
      if (this.id !== info.context) {
        return;
      }
      this.emit("filedialogopened", info);
    });
    sessionEmitter.on("browsingContext.contextCreated", (info) => {
      if (info.parent !== this.id) {
        return;
      }
      const browsingContext = _a3.from(this.userContext, this, info.context, info.url, info.originalOpener, info.clientWindow);
      __privateGet(this, _children2).set(info.context, browsingContext);
      const browsingContextEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(browsingContext));
      browsingContextEmitter.once("closed", () => {
        browsingContextEmitter.removeAllListeners();
        __privateGet(this, _children2).delete(browsingContext.id);
      });
      this.emit("browsingcontext", browsingContext);
    });
    sessionEmitter.on("browsingContext.contextDestroyed", (info) => {
      if (info.context !== this.id) {
        return;
      }
      this.dispose("Browsing context already closed.");
    });
    sessionEmitter.on("browsingContext.historyUpdated", (info) => {
      if (info.context !== this.id) {
        return;
      }
      __privateSet(this, _url2, info.url);
      this.emit("historyUpdated", void 0);
    });
    sessionEmitter.on("browsingContext.domContentLoaded", (info) => {
      if (info.context !== this.id) {
        return;
      }
      __privateSet(this, _url2, info.url);
      this.emit("DOMContentLoaded", void 0);
    });
    sessionEmitter.on("browsingContext.load", (info) => {
      if (info.context !== this.id) {
        return;
      }
      __privateSet(this, _url2, info.url);
      this.emit("load", void 0);
    });
    sessionEmitter.on("browsingContext.navigationStarted", (info) => {
      if (info.context !== this.id) {
        return;
      }
      if (__privateGet(this, _navigation) !== void 0 && !__privateGet(this, _navigation).disposed) {
        return;
      }
      __privateSet(this, _navigation, Navigation.from(this));
      const navigationEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _navigation)));
      for (const eventName of ["fragment", "failed", "aborted"]) {
        navigationEmitter.once(eventName, ({ url }) => {
          navigationEmitter[index.disposeSymbol]();
          __privateSet(this, _url2, url);
        });
      }
      this.emit("navigation", __privateGet(this, _navigation));
    });
    sessionEmitter.on("network.beforeRequestSent", (event) => {
      if (event.context !== this.id) {
        return;
      }
      if (event.redirectCount > 0) {
        return;
      }
      const request = Request.from(this, event);
      this.emit("request", request);
    });
    sessionEmitter.on("log.entryAdded", (entry) => {
      if (entry.source.context !== this.id) {
        return;
      }
      this.emit("log", entry);
    });
    sessionEmitter.on("browsingContext.userPromptOpened", (info) => {
      if (info.context !== this.id) {
        return;
      }
      const userPrompt = UserPrompt.from(this, info);
      this.emit("userprompt", userPrompt);
    });
  }, session_get = function() {
    return this.userContext.browser.session;
  }, createWindowRealm_fn = function(sandbox) {
    const realm = WindowRealm.from(this, sandbox);
    realm.on("worker", (realm2) => {
      this.emit("worker", realm2);
    });
    return realm;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    _deleteCookie_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })];
    _locateNodes_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })];
    __esDecorate$9(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _activate_decorators, { kind: "method", name: "activate", static: false, private: false, access: { has: (obj) => "activate" in obj, get: (obj) => obj.activate }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _captureScreenshot_decorators, { kind: "method", name: "captureScreenshot", static: false, private: false, access: { has: (obj) => "captureScreenshot" in obj, get: (obj) => obj.captureScreenshot }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: (obj) => "close" in obj, get: (obj) => obj.close }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _traverseHistory_decorators, { kind: "method", name: "traverseHistory", static: false, private: false, access: { has: (obj) => "traverseHistory" in obj, get: (obj) => obj.traverseHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _navigate_decorators, { kind: "method", name: "navigate", static: false, private: false, access: { has: (obj) => "navigate" in obj, get: (obj) => obj.navigate }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _reload_decorators, { kind: "method", name: "reload", static: false, private: false, access: { has: (obj) => "reload" in obj, get: (obj) => obj.reload }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setCacheBehavior_decorators, { kind: "method", name: "setCacheBehavior", static: false, private: false, access: { has: (obj) => "setCacheBehavior" in obj, get: (obj) => obj.setCacheBehavior }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _print_decorators, { kind: "method", name: "print", static: false, private: false, access: { has: (obj) => "print" in obj, get: (obj) => obj.print }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _handleUserPrompt_decorators, { kind: "method", name: "handleUserPrompt", static: false, private: false, access: { has: (obj) => "handleUserPrompt" in obj, get: (obj) => obj.handleUserPrompt }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setViewport_decorators, { kind: "method", name: "setViewport", static: false, private: false, access: { has: (obj) => "setViewport" in obj, get: (obj) => obj.setViewport }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setTouchOverride_decorators, { kind: "method", name: "setTouchOverride", static: false, private: false, access: { has: (obj) => "setTouchOverride" in obj, get: (obj) => obj.setTouchOverride }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _performActions_decorators, { kind: "method", name: "performActions", static: false, private: false, access: { has: (obj) => "performActions" in obj, get: (obj) => obj.performActions }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _releaseActions_decorators, { kind: "method", name: "releaseActions", static: false, private: false, access: { has: (obj) => "releaseActions" in obj, get: (obj) => obj.releaseActions }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _createWindowRealm_decorators, { kind: "method", name: "createWindowRealm", static: false, private: false, access: { has: (obj) => "createWindowRealm" in obj, get: (obj) => obj.createWindowRealm }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _addPreloadScript_decorators, { kind: "method", name: "addPreloadScript", static: false, private: false, access: { has: (obj) => "addPreloadScript" in obj, get: (obj) => obj.addPreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _addIntercept_decorators, { kind: "method", name: "addIntercept", static: false, private: false, access: { has: (obj) => "addIntercept" in obj, get: (obj) => obj.addIntercept }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _removePreloadScript_decorators, { kind: "method", name: "removePreloadScript", static: false, private: false, access: { has: (obj) => "removePreloadScript" in obj, get: (obj) => obj.removePreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setGeolocationOverride_decorators, { kind: "method", name: "setGeolocationOverride", static: false, private: false, access: { has: (obj) => "setGeolocationOverride" in obj, get: (obj) => obj.setGeolocationOverride }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setTimezoneOverride_decorators, { kind: "method", name: "setTimezoneOverride", static: false, private: false, access: { has: (obj) => "setTimezoneOverride" in obj, get: (obj) => obj.setTimezoneOverride }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setLocaleOverride_decorators, { kind: "method", name: "setLocaleOverride", static: false, private: false, access: { has: (obj) => "setLocaleOverride" in obj, get: (obj) => obj.setLocaleOverride }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setScreenOrientationOverride_decorators, { kind: "method", name: "setScreenOrientationOverride", static: false, private: false, access: { has: (obj) => "setScreenOrientationOverride" in obj, get: (obj) => obj.setScreenOrientationOverride }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _getCookies_decorators, { kind: "method", name: "getCookies", static: false, private: false, access: { has: (obj) => "getCookies" in obj, get: (obj) => obj.getCookies }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setCookie_decorators, { kind: "method", name: "setCookie", static: false, private: false, access: { has: (obj) => "setCookie" in obj, get: (obj) => obj.setCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _setFiles_decorators, { kind: "method", name: "setFiles", static: false, private: false, access: { has: (obj) => "setFiles" in obj, get: (obj) => obj.setFiles }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _subscribe_decorators, { kind: "method", name: "subscribe", static: false, private: false, access: { has: (obj) => "subscribe" in obj, get: (obj) => obj.subscribe }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _addInterception_decorators, { kind: "method", name: "addInterception", static: false, private: false, access: { has: (obj) => "addInterception" in obj, get: (obj) => obj.addInterception }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _deleteCookie_decorators, { kind: "method", name: "deleteCookie", static: false, private: false, access: { has: (obj) => "deleteCookie" in obj, get: (obj) => obj.deleteCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$9(_a3, null, _locateNodes_decorators, { kind: "method", name: "locateNodes", static: false, private: false, access: { has: (obj) => "locateNodes" in obj, get: (obj) => obj.locateNodes }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$8 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$8 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
let UserContext = (() => {
  var _a3, _reason, _browsingContexts, _disposables2, _id7, _UserContext_instances, initialize_fn7, session_get;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _createBrowsingContext_decorators;
  let _remove_decorators;
  let _getCookies_decorators;
  let _setCookie_decorators;
  let _setPermissions_decorators;
  return _a3 = class extends _classSuper {
    constructor(browser, id) {
      super();
      __privateAdd(this, _UserContext_instances);
      __privateAdd(this, _reason, __runInitializers$8(this, _instanceExtraInitializers));
      // Note these are only top-level contexts.
      __privateAdd(this, _browsingContexts, /* @__PURE__ */ new Map());
      __privateAdd(this, _disposables2, new index.DisposableStack());
      __privateAdd(this, _id7);
      __publicField(this, "browser");
      __privateSet(this, _id7, id);
      this.browser = browser;
    }
    static create(browser, id) {
      var _a4;
      const context = new _a3(browser, id);
      __privateMethod(_a4 = context, _UserContext_instances, initialize_fn7).call(_a4);
      return context;
    }
    get browsingContexts() {
      return __privateGet(this, _browsingContexts).values();
    }
    get closed() {
      return __privateGet(this, _reason) !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get id() {
      return __privateGet(this, _id7);
    }
    dispose(reason) {
      __privateSet(this, _reason, reason);
      this[index.disposeSymbol]();
    }
    async createBrowsingContext(type, options = {}) {
      var _a4;
      const { result: { context: contextId } } = await __privateGet(this, _UserContext_instances, session_get).send("browsingContext.create", {
        type,
        ...options,
        referenceContext: (_a4 = options.referenceContext) == null ? void 0 : _a4.id,
        background: options.background,
        userContext: __privateGet(this, _id7)
      });
      const browsingContext = __privateGet(this, _browsingContexts).get(contextId);
      index.assert(browsingContext, "The WebDriver BiDi implementation is failing to create a browsing context correctly.");
      return browsingContext;
    }
    async remove() {
      try {
        await __privateGet(this, _UserContext_instances, session_get).send("browser.removeUserContext", {
          userContext: __privateGet(this, _id7)
        });
      } finally {
        this.dispose("User context already closed.");
      }
    }
    async getCookies(options = {}, sourceOrigin = void 0) {
      const { result: { cookies } } = await __privateGet(this, _UserContext_instances, session_get).send("storage.getCookies", {
        ...options,
        partition: {
          type: "storageKey",
          userContext: __privateGet(this, _id7),
          sourceOrigin
        }
      });
      return cookies;
    }
    async setCookie(cookie, sourceOrigin) {
      await __privateGet(this, _UserContext_instances, session_get).send("storage.setCookie", {
        cookie,
        partition: {
          type: "storageKey",
          sourceOrigin,
          userContext: this.id
        }
      });
    }
    async setPermissions(origin, descriptor, state) {
      await __privateGet(this, _UserContext_instances, session_get).send("permissions.setPermission", {
        origin,
        descriptor,
        state,
        userContext: __privateGet(this, _id7)
      });
    }
    [(_dispose_decorators = [index.inertIfDisposed], _createBrowsingContext_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _remove_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _getCookies_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setCookie_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], _setPermissions_decorators = [index.throwIfDisposed((context) => {
      return __privateGet(context, _reason);
    })], index.disposeSymbol)]() {
      __privateGet(this, _reason) ?? __privateSet(this, _reason, "User context already closed, probably because the browser disconnected/closed.");
      this.emit("closed", __privateGet(this, _reason));
      __privateGet(this, _disposables2).dispose();
      super[index.disposeSymbol]();
    }
  }, _reason = new WeakMap(), _browsingContexts = new WeakMap(), _disposables2 = new WeakMap(), _id7 = new WeakMap(), _UserContext_instances = new WeakSet(), initialize_fn7 = function() {
    const browserEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(this.browser));
    browserEmitter.once("closed", (reason) => {
      this.dispose(`User context was closed: ${reason}`);
    });
    browserEmitter.once("disconnected", (reason) => {
      this.dispose(`User context was closed: ${reason}`);
    });
    const sessionEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(__privateGet(this, _UserContext_instances, session_get)));
    sessionEmitter.on("browsingContext.contextCreated", (info) => {
      if (info.parent) {
        return;
      }
      if (info.userContext !== __privateGet(this, _id7)) {
        return;
      }
      const browsingContext = BrowsingContext.from(this, void 0, info.context, info.url, info.originalOpener, info.clientWindow);
      __privateGet(this, _browsingContexts).set(browsingContext.id, browsingContext);
      const browsingContextEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(browsingContext));
      browsingContextEmitter.on("closed", () => {
        browsingContextEmitter.removeAllListeners();
        __privateGet(this, _browsingContexts).delete(browsingContext.id);
      });
      this.emit("browsingcontext", browsingContext);
    });
  }, session_get = function() {
    return this.browser.session;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    __esDecorate$8(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$8(_a3, null, _createBrowsingContext_decorators, { kind: "method", name: "createBrowsingContext", static: false, private: false, access: { has: (obj) => "createBrowsingContext" in obj, get: (obj) => obj.createBrowsingContext }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$8(_a3, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: (obj) => "remove" in obj, get: (obj) => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$8(_a3, null, _getCookies_decorators, { kind: "method", name: "getCookies", static: false, private: false, access: { has: (obj) => "getCookies" in obj, get: (obj) => obj.getCookies }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$8(_a3, null, _setCookie_decorators, { kind: "method", name: "setCookie", static: false, private: false, access: { has: (obj) => "setCookie" in obj, get: (obj) => obj.setCookie }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$8(_a3, null, _setPermissions_decorators, { kind: "method", name: "setPermissions", static: false, private: false, access: { has: (obj) => "setPermissions" in obj, get: (obj) => obj.setPermissions }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), __publicField(_a3, "DEFAULT", "default"), _a3;
})();
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
class BidiDeserializer {
  static deserialize(result, logger) {
    var _a3, _b2, _c2, _d2, _e, _f;
    if (!result) {
      (_a3 = logger == null ? void 0 : logger(index.DEBUG_PREFIXES.error)) == null ? void 0 : _a3("Service did not produce a result.");
      return void 0;
    }
    switch (result.type) {
      case "array":
        return (_b2 = result.value) == null ? void 0 : _b2.map((value) => {
          return this.deserialize(value);
        });
      case "set":
        return (_c2 = result.value) == null ? void 0 : _c2.reduce((acc, value) => {
          return acc.add(this.deserialize(value));
        }, /* @__PURE__ */ new Set());
      case "object":
        return (_d2 = result.value) == null ? void 0 : _d2.reduce((acc, tuple) => {
          const { key, value } = __privateMethod(this, _BidiDeserializer_static, deserializeTuple_fn).call(this, tuple);
          acc[key] = value;
          return acc;
        }, {});
      case "map":
        return (_e = result.value) == null ? void 0 : _e.reduce((acc, tuple) => {
          const { key, value } = __privateMethod(this, _BidiDeserializer_static, deserializeTuple_fn).call(this, tuple);
          return acc.set(key, value);
        }, /* @__PURE__ */ new Map());
      case "promise":
        return {};
      case "regexp":
        return new RegExp(result.value.pattern, result.value.flags);
      case "date":
        return new Date(result.value);
      case "undefined":
        return void 0;
      case "null":
        return null;
      case "number":
        return __privateMethod(this, _BidiDeserializer_static, deserializeNumber_fn).call(this, result.value);
      case "bigint":
        return BigInt(result.value);
      case "boolean":
        return Boolean(result.value);
      case "string":
        return result.value;
    }
    (_f = logger == null ? void 0 : logger(index.DEBUG_PREFIXES.error)) == null ? void 0 : _f(`Deserialization of type ${result.type} not supported.`);
    return void 0;
  }
}
_BidiDeserializer_static = new WeakSet();
deserializeNumber_fn = function(value) {
  switch (value) {
    case "-0":
      return -0;
    case "NaN":
      return NaN;
    case "Infinity":
      return Infinity;
    case "-Infinity":
      return -Infinity;
    default:
      return value;
  }
};
deserializeTuple_fn = function([serializedKey, serializedValue]) {
  const key = typeof serializedKey === "string" ? serializedKey : this.deserialize(serializedKey);
  const value = this.deserialize(serializedValue);
  return { key, value };
};
__privateAdd(BidiDeserializer, _BidiDeserializer_static);
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
const _BidiJSHandle = class _BidiJSHandle extends index.JSHandle {
  constructor(value, realm) {
    super(realm.logger);
    __privateAdd(this, _remoteValue);
    __publicField(this, "realm");
    __privateAdd(this, _disposed, false);
    __privateSet(this, _remoteValue, value);
    this.realm = realm;
  }
  static from(value, realm) {
    return new _BidiJSHandle(value, realm);
  }
  get disposed() {
    return __privateGet(this, _disposed);
  }
  async jsonValue() {
    return await this.evaluate((value) => {
      return value;
    });
  }
  asElement() {
    return null;
  }
  async dispose() {
    if (__privateGet(this, _disposed)) {
      return;
    }
    __privateSet(this, _disposed, true);
    await this.realm.destroyHandles([this]);
  }
  get isPrimitiveValue() {
    switch (__privateGet(this, _remoteValue).type) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
      case "undefined":
      case "null":
        return true;
      default:
        return false;
    }
  }
  toString() {
    if (this.isPrimitiveValue) {
      return "JSHandle:" + BidiDeserializer.deserialize(__privateGet(this, _remoteValue));
    }
    return "JSHandle@" + __privateGet(this, _remoteValue).type;
  }
  get id() {
    return "handle" in __privateGet(this, _remoteValue) ? __privateGet(this, _remoteValue).handle : void 0;
  }
  remoteValue() {
    return __privateGet(this, _remoteValue);
  }
  remoteObject() {
    throw new index.UnsupportedOperation("Not available in WebDriver BiDi");
  }
};
_remoteValue = new WeakMap();
_disposed = new WeakMap();
let BidiJSHandle = _BidiJSHandle;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$7 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$7 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __addDisposableResource$5 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources$5 = /* @__PURE__ */ function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
let BidiElementHandle = (() => {
  var _backendNodeId, _a3;
  let _classSuper = index.ElementHandle;
  let _instanceExtraInitializers = [];
  let _autofill_decorators;
  let _contentFrame_decorators;
  return _a3 = class extends _classSuper {
    constructor(value, realm) {
      super(BidiJSHandle.from(value, realm), realm.logger);
      __privateAdd(this, _backendNodeId, __runInitializers$7(this, _instanceExtraInitializers));
    }
    static from(value, realm) {
      return new _a3(value, realm);
    }
    get realm() {
      return this.handle.realm;
    }
    get frame() {
      return this.realm.environment;
    }
    remoteValue() {
      return this.handle.remoteValue();
    }
    async autofill(data) {
      const client = this.frame.client;
      const nodeInfo = await client.send("DOM.describeNode", {
        objectId: this.handle.id
      });
      const fieldId = nodeInfo.node.backendNodeId;
      const frameId = this.frame._id;
      await client.send("Autofill.trigger", {
        fieldId,
        frameId,
        card: data.creditCard,
        address: data.address
      });
    }
    async contentFrame() {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource$5(env_1, await this.evaluateHandle((element) => {
          if (element instanceof HTMLIFrameElement || element instanceof HTMLFrameElement) {
            return element.contentWindow;
          }
          return;
        }), false);
        const value = handle.remoteValue();
        if (value.type === "window") {
          return this.frame.page().frames().find((frame) => {
            return frame._id === value.value.context;
          }) ?? null;
        }
        return null;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources$5(env_1);
      }
    }
    async uploadFile(...files) {
      const path = index.environment.value.path;
      if (path) {
        files = files.map((file) => {
          if (path.win32.isAbsolute(file) || path.posix.isAbsolute(file)) {
            return file;
          } else {
            return path.resolve(file);
          }
        });
      }
      await this.frame.setFiles(this, files);
    }
    async *queryAXTree(name, role) {
      const results = await this.frame.locateNodes(this, {
        type: "accessibility",
        value: {
          role,
          name
        }
      });
      return yield* index.AsyncIterableUtil.map(results, (node) => {
        return Promise.resolve(_a3.from(node, this.realm));
      });
    }
    async backendNodeId() {
      if (!this.frame.page().browser().cdpSupported) {
        throw new index.UnsupportedOperation();
      }
      if (__privateGet(this, _backendNodeId)) {
        return __privateGet(this, _backendNodeId);
      }
      const { node } = await this.frame.client.send("DOM.describeNode", {
        objectId: this.handle.id
      });
      __privateSet(this, _backendNodeId, node.backendNodeId);
      return __privateGet(this, _backendNodeId);
    }
  }, _backendNodeId = new WeakMap(), (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    _autofill_decorators = [index.throwIfDisposed()];
    _contentFrame_decorators = [index.throwIfDisposed(), index.bindIsolatedHandle];
    __esDecorate$7(_a3, null, _autofill_decorators, { kind: "method", name: "autofill", static: false, private: false, access: { has: (obj) => "autofill" in obj, get: (obj) => obj.autofill }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$7(_a3, null, _contentFrame_decorators, { kind: "method", name: "contentFrame", static: false, private: false, access: { has: (obj) => "contentFrame" in obj, get: (obj) => obj.contentFrame }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
const _BidiDialog = class _BidiDialog extends index.Dialog {
  constructor(prompt) {
    super(prompt.info.type, prompt.info.message, prompt.info.defaultValue);
    __privateAdd(this, _prompt);
    __privateSet(this, _prompt, prompt);
    this.handled = prompt.handled;
    prompt.once("handled", () => {
      this.handled = true;
    });
  }
  static from(prompt) {
    return new _BidiDialog(prompt);
  }
  async handle(options) {
    await __privateGet(this, _prompt).handle({
      accept: options.accept,
      userText: options.text
    });
  }
};
_prompt = new WeakMap();
let BidiDialog = _BidiDialog;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __addDisposableResource$4 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources$4 = /* @__PURE__ */ function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
const _ExposableFunction = class _ExposableFunction {
  constructor(frame, name, apply, isolate = false, logger) {
    __privateAdd(this, _ExposableFunction_instances);
    __privateAdd(this, _frame);
    __publicField(this, "name");
    __privateAdd(this, _apply);
    __privateAdd(this, _isolate);
    __privateAdd(this, _logger18);
    __privateAdd(this, _channel);
    __privateAdd(this, _scripts2, []);
    __privateAdd(this, _disposables, new index.DisposableStack());
    __privateAdd(this, _handleMessage, async (params) => {
      var _a3, _b2, _c2, _d2;
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        if (params.channel !== __privateGet(this, _channel)) {
          return;
        }
        const realm = __privateMethod(this, _ExposableFunction_instances, getRealm_fn2).call(this, params.source);
        if (!realm) {
          return;
        }
        const dataHandle = __addDisposableResource$4(env_1, BidiJSHandle.from(params.data, realm), false);
        const stack = __addDisposableResource$4(env_1, new index.DisposableStack(), false);
        const args = [];
        let result;
        try {
          const env_2 = { stack: [], error: void 0, hasError: false };
          try {
            const argsHandle = __addDisposableResource$4(env_2, await dataHandle.evaluateHandle(([, , args2]) => {
              return args2;
            }), false);
            for (const [index2, handle] of await argsHandle.getProperties()) {
              stack.use(handle);
              if (handle instanceof BidiElementHandle) {
                args[+index2] = handle;
                stack.use(handle);
                continue;
              }
              args[+index2] = handle.jsonValue();
            }
            result = await __privateGet(this, _apply).call(this, ...await Promise.all(args));
          } catch (e_1) {
            env_2.error = e_1;
            env_2.hasError = true;
          } finally {
            __disposeResources$4(env_2);
          }
        } catch (error) {
          try {
            if (error instanceof Error) {
              await dataHandle.evaluate(([, reject], name, message, stack2) => {
                const error2 = new Error(message);
                error2.name = name;
                if (stack2) {
                  error2.stack = stack2;
                }
                reject(error2);
              }, error.name, error.message, error.stack);
            } else {
              await dataHandle.evaluate(([, reject], error2) => {
                reject(error2);
              }, error);
            }
          } catch (error2) {
            (_b2 = (_a3 = __privateGet(this, _logger18)) == null ? void 0 : _a3.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error2);
          }
          return;
        }
        try {
          await dataHandle.evaluate(([resolve], result2) => {
            resolve(result2);
          }, result);
        } catch (error) {
          (_d2 = (_c2 = __privateGet(this, _logger18)) == null ? void 0 : _c2.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _d2(error);
        }
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        __disposeResources$4(env_1);
      }
    });
    __privateSet(this, _frame, frame);
    this.name = name;
    __privateSet(this, _apply, apply);
    __privateSet(this, _isolate, isolate);
    __privateSet(this, _logger18, logger);
    __privateSet(this, _channel, `__puppeteer__${__privateGet(this, _frame)._id}_page_exposeFunction_${this.name}`);
  }
  static async from(frame, name, apply, isolate = false, logger) {
    var _a3;
    const func = new _ExposableFunction(frame, name, apply, isolate, logger);
    await __privateMethod(_a3 = func, _ExposableFunction_instances, initialize_fn4).call(_a3);
    return func;
  }
  [Symbol.dispose]() {
    void this[Symbol.asyncDispose]().catch((error) => {
      var _a3, _b2;
      (_b2 = (_a3 = __privateGet(this, _logger18)) == null ? void 0 : _a3.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
    });
  }
  async [Symbol.asyncDispose]() {
    __privateGet(this, _disposables).dispose();
    await Promise.all(__privateGet(this, _scripts2).map(async ([frame, script]) => {
      var _a3, _b2;
      const realm = __privateGet(this, _isolate) ? frame.isolatedRealm() : frame.mainRealm();
      try {
        await Promise.all([
          realm.evaluate((name) => {
            delete globalThis[name];
          }, this.name),
          ...frame.childFrames().map((childFrame) => {
            return childFrame.evaluate((name) => {
              delete globalThis[name];
            }, this.name);
          }),
          frame.browsingContext.removePreloadScript(script)
        ]);
      } catch (error) {
        (_b2 = (_a3 = __privateGet(this, _logger18)) == null ? void 0 : _a3.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
      }
    }));
  }
};
_frame = new WeakMap();
_apply = new WeakMap();
_isolate = new WeakMap();
_logger18 = new WeakMap();
_channel = new WeakMap();
_scripts2 = new WeakMap();
_disposables = new WeakMap();
_ExposableFunction_instances = new WeakSet();
initialize_fn4 = async function() {
  const connection = __privateGet(this, _ExposableFunction_instances, connection_get);
  const channel = {
    type: "channel",
    value: {
      channel: __privateGet(this, _channel),
      ownership: "root"
    }
  };
  const connectionEmitter = __privateGet(this, _disposables).use(new index.EventEmitter(connection, __privateGet(this, _logger18)));
  connectionEmitter.on("script.message", __privateGet(this, _handleMessage));
  const functionDeclaration = index.stringifyFunction(index.interpolateFunction((callback) => {
    Object.assign(globalThis, {
      [PLACEHOLDER("name")]: function(...args) {
        return new Promise((resolve, reject) => {
          callback([resolve, reject, args]);
        });
      }
    });
  }, { name: JSON.stringify(this.name) }));
  const frames = [__privateGet(this, _frame)];
  for (const frame of frames) {
    frames.push(...frame.childFrames());
  }
  await Promise.all(frames.map(async (frame) => {
    var _a3, _b2;
    const realm = __privateGet(this, _isolate) ? frame.isolatedRealm() : frame.mainRealm();
    try {
      const [script] = await Promise.all([
        frame.browsingContext.addPreloadScript(functionDeclaration, {
          arguments: [channel],
          sandbox: realm.sandbox
        }),
        realm.realm.callFunction(functionDeclaration, false, {
          arguments: [channel]
        })
      ]);
      __privateGet(this, _scripts2).push([frame, script]);
    } catch (error) {
      (_b2 = (_a3 = __privateGet(this, _logger18)) == null ? void 0 : _a3.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
    }
  }));
};
connection_get = function() {
  return __privateGet(this, _frame).page().browser().connection;
};
_handleMessage = new WeakMap();
getRealm_fn2 = function(source) {
  const frame = __privateMethod(this, _ExposableFunction_instances, findFrame_fn).call(this, source.context);
  if (!frame) {
    return;
  }
  return frame.realm(source.realm);
};
findFrame_fn = function(id) {
  const frames = [__privateGet(this, _frame)];
  for (const frame of frames) {
    if (frame._id === id) {
      return frame;
    }
    frames.push(...frame.childFrames());
  }
  return;
};
let ExposableFunction = _ExposableFunction;
var __runInitializers$6 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$6 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
let BidiHTTPResponse = (() => {
  var _data, _request3, _securityDetails, _cdpSupported, _BidiHTTPResponse_instances, initialize_fn7, _a3;
  let _classSuper = index.HTTPResponse;
  let _instanceExtraInitializers = [];
  let _remoteAddress_decorators;
  return _a3 = class extends _classSuper {
    constructor(data, request, cdpSupported) {
      super();
      __privateAdd(this, _BidiHTTPResponse_instances);
      __privateAdd(this, _data, __runInitializers$6(this, _instanceExtraInitializers));
      __privateAdd(this, _request3);
      __privateAdd(this, _securityDetails);
      __privateAdd(this, _cdpSupported, false);
      __privateSet(this, _data, data);
      __privateSet(this, _request3, request);
      __privateSet(this, _cdpSupported, cdpSupported);
      const securityDetails = data["goog:securityDetails"];
      if (cdpSupported && securityDetails) {
        __privateSet(this, _securityDetails, new index.SecurityDetails(securityDetails));
      }
    }
    /**
     * Returns a new BidiHTTPResponse or updates the existing one if it already exists.
     */
    static from(data, request, cdpSupported) {
      var _a4;
      const existingResponse = request.response();
      if (existingResponse) {
        __privateSet(existingResponse, _data, data);
        return existingResponse;
      }
      const response = new _a3(data, request, cdpSupported);
      __privateMethod(_a4 = response, _BidiHTTPResponse_instances, initialize_fn7).call(_a4);
      return response;
    }
    remoteAddress() {
      return {
        ip: "",
        port: -1
      };
    }
    url() {
      return __privateGet(this, _data).url;
    }
    status() {
      return __privateGet(this, _data).status;
    }
    statusText() {
      return __privateGet(this, _data).statusText;
    }
    headers() {
      const headers = {};
      for (const header of __privateGet(this, _data).headers) {
        if (header.value.type === "string") {
          const headerName = header.name.toLowerCase();
          const value = headerName in headers ? `${headers[headerName]}
${header.value.value}` : header.value.value;
          headers[headerName] = index.normalizeHeaderValue(headerName, value);
        }
      }
      return headers;
    }
    request() {
      return __privateGet(this, _request3);
    }
    fromCache() {
      return __privateGet(this, _data).fromCache;
    }
    timing() {
      const bidiTiming = __privateGet(this, _request3).timing();
      return {
        requestTime: bidiTiming.requestTime,
        proxyStart: -1,
        proxyEnd: -1,
        dnsStart: bidiTiming.dnsStart,
        dnsEnd: bidiTiming.dnsEnd,
        connectStart: bidiTiming.connectStart,
        connectEnd: bidiTiming.connectEnd,
        sslStart: bidiTiming.tlsStart,
        sslEnd: -1,
        workerStart: -1,
        workerReady: -1,
        workerFetchStart: -1,
        workerRespondWithSettled: -1,
        workerRouterEvaluationStart: -1,
        workerCacheLookupStart: -1,
        sendStart: bidiTiming.requestStart,
        sendEnd: -1,
        pushStart: -1,
        pushEnd: -1,
        receiveHeadersStart: bidiTiming.responseStart,
        receiveHeadersEnd: bidiTiming.responseEnd
      };
    }
    frame() {
      return __privateGet(this, _request3).frame();
    }
    fromServiceWorker() {
      return false;
    }
    securityDetails() {
      if (!__privateGet(this, _cdpSupported)) {
        throw new index.UnsupportedOperation();
      }
      return __privateGet(this, _securityDetails) ?? null;
    }
    async content() {
      return await __privateGet(this, _request3).getResponseContent();
    }
  }, _data = new WeakMap(), _request3 = new WeakMap(), _securityDetails = new WeakMap(), _cdpSupported = new WeakMap(), _BidiHTTPResponse_instances = new WeakSet(), initialize_fn7 = function() {
    var _a4, _b2;
    if (__privateGet(this, _data).fromCache) {
      __privateGet(this, _request3)._fromMemoryCache = true;
      (_a4 = __privateGet(this, _request3).frame()) == null ? void 0 : _a4.page().trustedEmitter.emit("requestservedfromcache", __privateGet(this, _request3));
    }
    (_b2 = __privateGet(this, _request3).frame()) == null ? void 0 : _b2.page().trustedEmitter.emit("response", this);
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    _remoteAddress_decorators = [index.invokeAtMostOnceForArguments];
    __esDecorate$6(_a3, null, _remoteAddress_decorators, { kind: "method", name: "remoteAddress", static: false, private: false, access: { has: (obj) => "remoteAddress" in obj, get: (obj) => obj.remoteAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
var _a;
const requests = /* @__PURE__ */ new WeakMap();
class BidiHTTPRequest extends index.HTTPRequest {
  constructor(request, frame, isNetworkInterceptionEnabled, redirect, logger) {
    super();
    __privateAdd(this, _BidiHTTPRequest_instances);
    __privateAdd(this, _redirectChain);
    __privateAdd(this, _response2, null);
    __publicField(this, "id");
    __privateAdd(this, _frame2);
    __privateAdd(this, _request2);
    __privateAdd(this, _logger19);
    __privateAdd(this, _authenticationHandled, false);
    __privateAdd(this, _handleAuthentication, async () => {
      if (!__privateGet(this, _frame2)) {
        return;
      }
      const credentials = __privateGet(this, _frame2).page()._credentials;
      if (credentials && !__privateGet(this, _authenticationHandled)) {
        __privateSet(this, _authenticationHandled, true);
        void __privateGet(this, _request2).continueWithAuth({
          action: "provideCredentials",
          credentials: {
            type: "password",
            username: credentials.username,
            password: credentials.password
          }
        });
      } else {
        void __privateGet(this, _request2).continueWithAuth({
          action: "cancel"
        });
      }
    });
    __privateSet(this, _logger19, logger);
    requests.set(request, this);
    this.interception.enabled = isNetworkInterceptionEnabled;
    __privateSet(this, _request2, request);
    __privateSet(this, _frame2, frame);
    __privateSet(this, _redirectChain, redirect ? __privateGet(redirect, _redirectChain) : []);
    this.id = request.id;
  }
  static from(bidiRequest, frame, isNetworkInterceptionEnabled, redirect, logger) {
    var _a3;
    const request = new _a(bidiRequest, frame, isNetworkInterceptionEnabled, redirect, logger);
    __privateMethod(_a3 = request, _BidiHTTPRequest_instances, initialize_fn5).call(_a3);
    return request;
  }
  get client() {
    return __privateGet(this, _frame2).client;
  }
  canBeIntercepted() {
    return __privateGet(this, _request2).isBlocked;
  }
  interceptResolutionState() {
    if (!__privateGet(this, _request2).isBlocked) {
      return { action: index.InterceptResolutionAction.Disabled };
    }
    return super.interceptResolutionState();
  }
  url() {
    return __privateGet(this, _request2).url;
  }
  resourceType() {
    if (!__privateGet(this, _frame2).page().browser().cdpSupported) {
      throw new index.UnsupportedOperation();
    }
    return (__privateGet(this, _request2).resourceType || "other").toLowerCase();
  }
  method() {
    return __privateGet(this, _request2).method;
  }
  postData() {
    if (!__privateGet(this, _frame2).page().browser().cdpSupported) {
      throw new index.UnsupportedOperation();
    }
    return __privateGet(this, _request2).postData;
  }
  hasPostData() {
    return __privateGet(this, _request2).hasPostData;
  }
  async fetchPostData() {
    return await __privateGet(this, _request2).fetchPostData();
  }
  headers() {
    const headers = {};
    for (const header of __privateGet(this, _request2).headers) {
      headers[header.name.toLowerCase()] = header.value.value;
    }
    return {
      ...headers
    };
  }
  response() {
    return __privateGet(this, _response2);
  }
  failure() {
    if (__privateGet(this, _request2).error === void 0) {
      return null;
    }
    return { errorText: __privateGet(this, _request2).error };
  }
  isNavigationRequest() {
    return __privateGet(this, _request2).navigation !== void 0;
  }
  initiator() {
    var _a3;
    return {
      ...__privateGet(this, _request2).initiator,
      type: ((_a3 = __privateGet(this, _request2).initiator) == null ? void 0 : _a3.type) ?? "other"
    };
  }
  redirectChain() {
    return __privateGet(this, _redirectChain).slice();
  }
  frame() {
    return __privateGet(this, _frame2);
  }
  async _continue(overrides = {}) {
    const headers = getBidiHeaders(overrides.headers);
    this.interception.handled = true;
    return await __privateGet(this, _request2).continueRequest({
      url: overrides.url,
      method: overrides.method,
      body: overrides.postData ? {
        type: "base64",
        value: index.stringToBase64(overrides.postData)
      } : void 0,
      headers: headers.length > 0 ? headers : void 0
    }).catch((error) => {
      this.interception.handled = false;
      return index.handleError(error, __privateGet(this, _logger19));
    });
  }
  async _abort() {
    this.interception.handled = true;
    return await __privateGet(this, _request2).failRequest().catch((error) => {
      this.interception.handled = false;
      throw error;
    });
  }
  async _respond(response, _priority) {
    this.interception.handled = true;
    let parsedBody;
    if (response.body) {
      parsedBody = index.HTTPRequest.getResponse(response.body);
    }
    const headers = getBidiHeaders(response.headers);
    const hasContentLength = headers.some((header) => {
      return header.name === "content-length";
    });
    if (response.contentType) {
      headers.push({
        name: "content-type",
        value: {
          type: "string",
          value: response.contentType
        }
      });
    }
    if ((parsedBody == null ? void 0 : parsedBody.contentLength) && !hasContentLength) {
      headers.push({
        name: "content-length",
        value: {
          type: "string",
          value: String(parsedBody.contentLength)
        }
      });
    }
    const status = response.status || 200;
    return await __privateGet(this, _request2).provideResponse({
      statusCode: status,
      headers: headers.length > 0 ? headers : void 0,
      reasonPhrase: index.STATUS_TEXTS[status],
      body: (parsedBody == null ? void 0 : parsedBody.base64) ? {
        type: "base64",
        value: parsedBody == null ? void 0 : parsedBody.base64
      } : void 0
    }).catch((error) => {
      this.interception.handled = false;
      throw error;
    });
  }
  timing() {
    return __privateGet(this, _request2).timing();
  }
  getResponseContent() {
    return __privateGet(this, _request2).getResponseContent();
  }
}
_redirectChain = new WeakMap();
_response2 = new WeakMap();
_frame2 = new WeakMap();
_request2 = new WeakMap();
_logger19 = new WeakMap();
_BidiHTTPRequest_instances = new WeakSet();
initialize_fn5 = function() {
  __privateGet(this, _request2).on("redirect", (request) => {
    const httpRequest = _a.from(request, __privateGet(this, _frame2), this.interception.enabled, this, __privateGet(this, _logger19));
    __privateGet(this, _redirectChain).push(this);
    request.once("success", () => {
      __privateGet(this, _frame2).page().trustedEmitter.emit("requestfinished", httpRequest);
    });
    request.once("error", () => {
      __privateGet(this, _frame2).page().trustedEmitter.emit("requestfailed", httpRequest);
    });
    void httpRequest.finalizeInterceptions();
  });
  __privateGet(this, _request2).once("response", (data) => {
    __privateSet(this, _response2, BidiHTTPResponse.from(data, this, __privateGet(this, _frame2).page().browser().cdpSupported));
  });
  __privateGet(this, _request2).once("success", (data) => {
    __privateSet(this, _response2, BidiHTTPResponse.from(data, this, __privateGet(this, _frame2).page().browser().cdpSupported));
  });
  __privateGet(this, _request2).on("authenticate", __privateGet(this, _handleAuthentication));
  __privateGet(this, _frame2).page().trustedEmitter.emit("request", this);
};
_authenticationHandled = new WeakMap();
_handleAuthentication = new WeakMap();
_a = BidiHTTPRequest;
function getBidiHeaders(rawHeaders) {
  const headers = [];
  for (const [name, value] of Object.entries(rawHeaders ?? [])) {
    if (!Object.is(value, void 0)) {
      const values = Array.isArray(value) ? value : [value];
      for (const value2 of values) {
        headers.push({
          name: name.toLowerCase(),
          value: {
            type: "string",
            value: String(value2)
          }
        });
      }
    }
  }
  return headers;
}
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
class UnserializableError extends Error {
}
class BidiSerializer {
  static serialize(arg) {
    switch (typeof arg) {
      case "symbol":
      case "function":
        throw new UnserializableError(`Unable to serializable ${typeof arg}`);
      case "object":
        return __privateMethod(this, _BidiSerializer_static, serializeObject_fn).call(this, arg);
      case "undefined":
        return {
          type: "undefined"
        };
      case "number":
        return __privateMethod(this, _BidiSerializer_static, serializeNumber_fn).call(this, arg);
      case "bigint":
        return {
          type: "bigint",
          value: arg.toString()
        };
      case "string":
        return {
          type: "string",
          value: arg
        };
      case "boolean":
        return {
          type: "boolean",
          value: arg
        };
    }
  }
}
_BidiSerializer_static = new WeakSet();
serializeNumber_fn = function(arg) {
  let value;
  if (Object.is(arg, -0)) {
    value = "-0";
  } else if (Object.is(arg, Infinity)) {
    value = "Infinity";
  } else if (Object.is(arg, -Infinity)) {
    value = "-Infinity";
  } else if (Object.is(arg, NaN)) {
    value = "NaN";
  } else {
    value = arg;
  }
  return {
    type: "number",
    value
  };
};
serializeObject_fn = function(arg) {
  if (arg === null) {
    return {
      type: "null"
    };
  } else if (Array.isArray(arg)) {
    const parsedArray = arg.map((subArg) => {
      return this.serialize(subArg);
    });
    return {
      type: "array",
      value: parsedArray
    };
  } else if (index.isPlainObject(arg)) {
    try {
      JSON.stringify(arg);
    } catch (error) {
      if (error instanceof TypeError && error.message.startsWith("Converting circular structure to JSON")) {
        error.message += " Recursive objects are not allowed.";
      }
      throw error;
    }
    const parsedObject = [];
    for (const key in arg) {
      parsedObject.push([this.serialize(key), this.serialize(arg[key])]);
    }
    return {
      type: "object",
      value: parsedObject
    };
  } else if (index.isRegExp(arg)) {
    return {
      type: "regexp",
      value: {
        pattern: arg.source,
        flags: arg.flags
      }
    };
  } else if (index.isDate(arg)) {
    return {
      type: "date",
      value: arg.toISOString()
    };
  }
  throw new UnserializableError("Custom object serialization not possible. Use plain objects instead.");
};
__privateAdd(BidiSerializer, _BidiSerializer_static);
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
function convertConsoleMessageLevel(method) {
  switch (method) {
    case "group":
      return "startGroup";
    case "groupCollapsed":
      return "startGroupCollapsed";
    case "groupEnd":
      return "endGroup";
    default:
      return method;
  }
}
function getStackTraceLocations(stackTrace) {
  const stackTraceLocations = [];
  if (stackTrace) {
    for (const callFrame of stackTrace.callFrames) {
      stackTraceLocations.push({
        url: callFrame.url,
        lineNumber: callFrame.lineNumber,
        columnNumber: callFrame.columnNumber
      });
    }
  }
  return stackTraceLocations;
}
function getConsoleMessage(entry, args, frame, targetId) {
  const text = args.reduce((value, arg) => {
    const parsedValue = arg instanceof BidiJSHandle && arg.isPrimitiveValue ? BidiDeserializer.deserialize(arg.remoteValue()) : arg.toString();
    return `${value} ${parsedValue}`;
  }, "").slice(1);
  return new index.ConsoleMessage(convertConsoleMessageLevel(entry.method), text, args, getStackTraceLocations(entry.stackTrace), frame, void 0, targetId);
}
function isConsoleLogEntry(event) {
  return event.type === "console";
}
function isJavaScriptLogEntry(event) {
  return event.type === "javascript";
}
function createEvaluationError(details) {
  if (details.exception.type === "object" && !("value" in details.exception)) {
    return new Error(details.text);
  }
  if (details.exception.type !== "error") {
    return BidiDeserializer.deserialize(details.exception);
  }
  const [name = "", ...parts] = details.text.split(": ");
  const message = parts.join(": ");
  const error = new Error(message);
  error.name = name;
  const stackLines = [];
  if (details.stackTrace && stackLines.length < Error.stackTraceLimit) {
    for (const frame of details.stackTrace.callFrames.reverse()) {
      if (index.PuppeteerURL.isPuppeteerURL(frame.url) && frame.url !== index.PuppeteerURL.INTERNAL_URL) {
        const url = index.PuppeteerURL.parse(frame.url);
        stackLines.unshift(`    at ${frame.functionName || url.functionName} (${url.functionName} at ${url.siteString}, <anonymous>:${frame.lineNumber}:${frame.columnNumber})`);
      } else {
        stackLines.push(`    at ${frame.functionName || "<anonymous>"} (${frame.url}:${frame.lineNumber}:${frame.columnNumber})`);
      }
      if (stackLines.length >= Error.stackTraceLimit) {
        break;
      }
    }
  }
  error.stack = [details.text, ...stackLines].join("\n");
  return error;
}
function rewriteNavigationError(message, ms) {
  return (error) => {
    if (error instanceof index.ProtocolError) {
      error.message += ` at ${message}`;
    } else if (error instanceof index.TimeoutError$1) {
      error.message = `Navigation timeout of ${ms} ms exceeded`;
    }
    throw error;
  };
}
function rewriteEvaluationError(error) {
  if (error instanceof Error) {
    if (error.message.includes("ExecutionContext was destroyed") || error.message.includes("Inspected target navigated or closed")) {
      throw new Error("Execution context was destroyed, most likely because of a navigation.");
    }
  }
  throw error;
}
var __addDisposableResource$3 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources$3 = /* @__PURE__ */ function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
class BidiRealm extends index.Realm {
  constructor(realm, timeoutSettings, logger) {
    super(timeoutSettings);
    __privateAdd(this, _BidiRealm_instances);
    __publicField(this, "realm");
    __privateAdd(this, _logger20);
    __publicField(this, "internalPuppeteerUtil");
    this.realm = realm;
    __privateSet(this, _logger20, logger);
  }
  /**
   * @internal
   */
  get logger() {
    return __privateGet(this, _logger20);
  }
  initialize() {
    this.realm.on("destroyed", (reason) => {
      this.taskManager.terminateAll(new Error(reason));
      this.dispose();
    });
    this.realm.on("updated", () => {
      this.internalPuppeteerUtil = void 0;
      void this.taskManager.rerunAll();
    });
  }
  get puppeteerUtil() {
    const promise = Promise.resolve();
    index.scriptInjector.inject((script) => {
      if (this.internalPuppeteerUtil) {
        void this.internalPuppeteerUtil.then((handle) => {
          void handle.dispose();
        });
      }
      this.internalPuppeteerUtil = promise.then(() => {
        return this.evaluateHandle(script);
      });
    }, !this.internalPuppeteerUtil);
    return this.internalPuppeteerUtil;
  }
  async evaluateHandle(pageFunction, ...args) {
    return await __privateMethod(this, _BidiRealm_instances, evaluate_fn).call(this, false, pageFunction, ...args);
  }
  async evaluate(pageFunction, ...args) {
    return await __privateMethod(this, _BidiRealm_instances, evaluate_fn).call(this, true, pageFunction, ...args);
  }
  createHandle(result) {
    if ((result.type === "node" || result.type === "window") && this instanceof BidiFrameRealm) {
      return BidiElementHandle.from(result, this);
    }
    return BidiJSHandle.from(result, this);
  }
  async serializeAsync(arg) {
    if (arg instanceof index.LazyArg) {
      arg = await arg.get(this);
    }
    return this.serialize(arg);
  }
  serialize(arg) {
    if (arg instanceof BidiJSHandle || arg instanceof BidiElementHandle) {
      if (arg.realm !== this) {
        if (!(arg.realm instanceof BidiFrameRealm) || !(this instanceof BidiFrameRealm)) {
          throw new Error("Trying to evaluate JSHandle from different global types. Usually this means you're using a handle from a worker in a page or vice versa.");
        }
        if (arg.realm.environment !== this.environment) {
          throw new Error("Trying to evaluate JSHandle from different frames. Usually this means you're using a handle from a page on a different page.");
        }
      }
      if (arg.disposed) {
        throw new Error("JSHandle is disposed!");
      }
      return arg.remoteValue();
    }
    return BidiSerializer.serialize(arg);
  }
  async destroyHandles(handles) {
    if (this.disposed) {
      return;
    }
    const handleIds = handles.map(({ id }) => {
      return id;
    }).filter((id) => {
      return id !== void 0;
    });
    if (handleIds.length === 0) {
      return;
    }
    void this.realm.disown(handleIds).catch((error) => {
      var _a3, _b2;
      (_b2 = (_a3 = __privateGet(this, _logger20)) == null ? void 0 : _a3.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
    });
  }
  async adoptHandle(handle) {
    return await this.evaluateHandle((node) => {
      return node;
    }, handle);
  }
  async transferHandle(handle) {
    if (handle.realm === this) {
      return handle;
    }
    const transferredHandle = this.adoptHandle(handle);
    await handle.dispose();
    return await transferredHandle;
  }
  extension() {
    throw new index.UnsupportedOperation();
  }
  get origin() {
    throw new index.UnsupportedOperation();
  }
}
_logger20 = new WeakMap();
_BidiRealm_instances = new WeakSet();
evaluate_fn = async function(returnByValue, pageFunction, ...args) {
  var _a3;
  const sourceUrlComment = index.getSourceUrlComment(((_a3 = index.getSourcePuppeteerURLIfAvailable(pageFunction)) == null ? void 0 : _a3.toString()) ?? index.PuppeteerURL.INTERNAL_URL);
  let responsePromise;
  const resultOwnership = returnByValue ? "none" : "root";
  const serializationOptions = returnByValue ? {} : {
    maxObjectDepth: 0,
    maxDomDepth: 0
  };
  if (index.isString(pageFunction)) {
    const expression = index.SOURCE_URL_REGEX.test(pageFunction) ? pageFunction : `${pageFunction}
${sourceUrlComment}
`;
    responsePromise = this.realm.evaluate(expression, true, {
      resultOwnership,
      userActivation: true,
      serializationOptions
    });
  } else {
    let functionDeclaration = index.stringifyFunction(pageFunction);
    functionDeclaration = index.SOURCE_URL_REGEX.test(functionDeclaration) ? functionDeclaration : `${functionDeclaration}
${sourceUrlComment}
`;
    responsePromise = this.realm.callFunction(
      functionDeclaration,
      /* awaitPromise= */
      true,
      {
        // LazyArgs are used only internally and should not affect the order
        // evaluate calls for the public APIs.
        arguments: args.some((arg) => {
          return arg instanceof index.LazyArg;
        }) ? await Promise.all(args.map((arg) => {
          return this.serializeAsync(arg);
        })) : args.map((arg) => {
          return this.serialize(arg);
        }),
        resultOwnership,
        userActivation: true,
        serializationOptions
      }
    );
  }
  const result = await responsePromise.catch(rewriteEvaluationError);
  if ("type" in result && result.type === "exception") {
    throw createEvaluationError(result.exceptionDetails);
  }
  if (returnByValue) {
    return BidiDeserializer.deserialize(result.result);
  }
  return this.createHandle(result.result);
};
const _BidiFrameRealm = class _BidiFrameRealm extends BidiRealm {
  constructor(realm, frame, logger) {
    super(realm, frame.timeoutSettings, logger);
    __privateAdd(this, _BidiFrameRealm_instances);
    __privateAdd(this, _frame3);
    __privateAdd(this, _bindingsInstalled, false);
    __privateSet(this, _frame3, frame);
  }
  static from(realm, frame, logger) {
    var _a3;
    const frameRealm = new _BidiFrameRealm(realm, frame, logger);
    __privateMethod(_a3 = frameRealm, _BidiFrameRealm_instances, initialize_fn6).call(_a3);
    return frameRealm;
  }
  get puppeteerUtil() {
    let promise = Promise.resolve();
    if (!__privateGet(this, _bindingsInstalled)) {
      promise = Promise.all([
        ExposableFunction.from(this.environment, "__ariaQuerySelector", index.ARIAQueryHandler.queryOne, !!this.sandbox, this.logger),
        ExposableFunction.from(this.environment, "__ariaQuerySelectorAll", async (element, selector) => {
          const results = index.ARIAQueryHandler.queryAll(element, selector);
          return await element.realm.evaluateHandle((...elements) => {
            return elements;
          }, ...await index.AsyncIterableUtil.collect(results));
        }, !!this.sandbox, this.logger)
      ]);
      __privateSet(this, _bindingsInstalled, true);
    }
    return promise.then(() => {
      return super.puppeteerUtil;
    });
  }
  get sandbox() {
    return this.realm.sandbox;
  }
  get environment() {
    return __privateGet(this, _frame3);
  }
  async adoptBackendNode(backendNodeId) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const { object } = await __privateGet(this, _frame3).client.send("DOM.resolveNode", {
        backendNodeId,
        executionContextId: await this.realm.resolveExecutionContextId()
      });
      const handle = __addDisposableResource$3(env_1, BidiElementHandle.from({
        handle: object.objectId,
        type: "node"
      }, this), false);
      return await handle.evaluateHandle((element) => {
        return element;
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources$3(env_1);
    }
  }
};
_frame3 = new WeakMap();
_BidiFrameRealm_instances = new WeakSet();
initialize_fn6 = function() {
  __superGet(_BidiFrameRealm.prototype, this, "initialize").call(this);
  this.realm.on("updated", () => {
    this.environment.clearDocumentHandle();
    __privateSet(this, _bindingsInstalled, false);
  });
};
_bindingsInstalled = new WeakMap();
let BidiFrameRealm = _BidiFrameRealm;
const _BidiWorkerRealm = class _BidiWorkerRealm extends BidiRealm {
  constructor(realm, frame, logger) {
    super(realm, frame.timeoutSettings, logger);
    __privateAdd(this, _worker);
    __privateSet(this, _worker, frame);
  }
  static from(realm, worker, logger) {
    const workerRealm = new _BidiWorkerRealm(realm, worker, logger);
    workerRealm.initialize();
    return workerRealm;
  }
  initialize() {
    super.initialize();
    this.realm.on("log", (entry) => {
      if (isConsoleLogEntry(entry) && __privateGet(this, _worker).listenerCount(index.WebWorkerEvent.Console)) {
        const args = entry.args.map((arg) => {
          return this.createHandle(arg);
        });
        const message = getConsoleMessage(entry, args, void 0, this.realm.id);
        __privateGet(this, _worker).emit(index.WebWorkerEvent.Console, message);
      }
    });
  }
  get environment() {
    return __privateGet(this, _worker);
  }
  async adoptBackendNode() {
    throw new Error("Cannot adopt DOM nodes into a worker.");
  }
};
_worker = new WeakMap();
let BidiWorkerRealm = _BidiWorkerRealm;
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
const _BidiWebWorker = class _BidiWebWorker extends index.WebWorker {
  constructor(frame, realm, logger) {
    super(realm.origin);
    __privateAdd(this, _frame4);
    __privateAdd(this, _realm);
    __privateSet(this, _frame4, frame);
    __privateSet(this, _realm, BidiWorkerRealm.from(realm, this, logger));
  }
  static from(frame, realm, logger) {
    const worker = new _BidiWebWorker(frame, realm, logger);
    return worker;
  }
  get frame() {
    return __privateGet(this, _frame4);
  }
  mainRealm() {
    return __privateGet(this, _realm);
  }
  get client() {
    throw new index.UnsupportedOperation();
  }
};
_frame4 = new WeakMap();
_realm = new WeakMap();
let BidiWebWorker = _BidiWebWorker;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$5 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$5 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __setFunctionName$1 = function(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
let BidiFrame = (() => {
  var _parent, _frames, _logger21, _BidiFrame_instances, initialize_fn7, createFrameTarget_fn, detached$_fn, _exposedFunctions, waitForLoad$_get, waitForNetworkIdle$_get, _a3;
  let _classSuper = index.Frame;
  let _instanceExtraInitializers = [];
  let _goto_decorators;
  let _setContent_decorators;
  let _waitForNavigation_decorators;
  let _private_waitForLoad$_decorators;
  let _private_waitForLoad$_descriptor;
  let _private_waitForNetworkIdle$_decorators;
  let _private_waitForNetworkIdle$_descriptor;
  let _setFiles_decorators;
  let _frameElement_decorators;
  let _locateNodes_decorators;
  return _a3 = class extends _classSuper {
    constructor(parent, browsingContext, logger) {
      super(logger);
      __privateAdd(this, _BidiFrame_instances);
      __privateAdd(this, _parent, __runInitializers$5(this, _instanceExtraInitializers));
      __publicField(this, "browsingContext");
      __privateAdd(this, _frames, /* @__PURE__ */ new WeakMap());
      __publicField(this, "realms");
      __privateAdd(this, _logger21);
      __publicField(this, "_id");
      __publicField(this, "client");
      __publicField(this, "accessibility");
      __privateAdd(this, _exposedFunctions, /* @__PURE__ */ new Map());
      __privateSet(this, _parent, parent);
      this.browsingContext = browsingContext;
      __privateSet(this, _logger21, logger);
      this._id = browsingContext.id;
      this.client = new BidiCdpSession(this);
      this.realms = {
        default: BidiFrameRealm.from(this.browsingContext.defaultRealm, this, logger),
        internal: BidiFrameRealm.from(this.browsingContext.createWindowRealm(`__puppeteer_internal_${Math.ceil(Math.random() * 1e4)}`), this, logger)
      };
      this.accessibility = new index.Accessibility(this.realms.default, this._id, logger);
    }
    static from(parent, browsingContext, logger) {
      var _a4;
      const frame = new _a3(parent, browsingContext, logger);
      __privateMethod(_a4 = frame, _BidiFrame_instances, initialize_fn7).call(_a4);
      return frame;
    }
    get timeoutSettings() {
      return this.page()._timeoutSettings;
    }
    mainRealm() {
      return this.realms.default;
    }
    isolatedRealm() {
      return this.realms.internal;
    }
    realm(id) {
      for (const realm of Object.values(this.realms)) {
        if (realm.realm.id === id) {
          return realm;
        }
      }
      return;
    }
    page() {
      let parent = __privateGet(this, _parent);
      while (parent instanceof _a3) {
        parent = __privateGet(parent, _parent);
      }
      return parent;
    }
    url() {
      return this.browsingContext.url;
    }
    parentFrame() {
      if (__privateGet(this, _parent) instanceof _a3) {
        return __privateGet(this, _parent);
      }
      return null;
    }
    childFrames() {
      return [...this.browsingContext.children].map((child) => {
        return __privateGet(this, _frames).get(child);
      });
    }
    async goto(url, options = {}) {
      const [response] = await Promise.all([
        this.waitForNavigation(options),
        // Some implementations currently only report errors when the
        // readiness=interactive.
        //
        // Related: https://bugzilla.mozilla.org/show_bug.cgi?id=1846601
        this.browsingContext.navigate(
          url,
          "interactive"
          /* Bidi.BrowsingContext.ReadinessState.Interactive */
        ).catch((error) => {
          if (index.isErrorLike(error) && error.message.includes("net::ERR_HTTP_RESPONSE_CODE_FAILURE")) {
            return;
          }
          if (error.message.includes("navigation canceled")) {
            return;
          }
          if (error.message.includes("Navigation was aborted by another navigation")) {
            return;
          }
          throw error;
        })
      ]).catch(rewriteNavigationError(url, options.timeout ?? this.timeoutSettings.navigationTimeout()));
      return response;
    }
    async setContent(html, options = {}) {
      await Promise.all([
        this.setFrameContent(html),
        index.firstValueFrom(index.combineLatest([
          __privateGet(this, _BidiFrame_instances, waitForLoad$_get).call(this, options),
          __privateGet(this, _BidiFrame_instances, waitForNetworkIdle$_get).call(this, options)
        ]))
      ]);
    }
    async waitForNavigation(options = {}) {
      const { timeout: ms = this.timeoutSettings.navigationTimeout(), signal } = options;
      const frames = this.childFrames().map((frame) => {
        var _a4;
        return __privateMethod(_a4 = frame, _BidiFrame_instances, detached$_fn).call(_a4);
      });
      return await index.firstValueFrom(index.combineLatest([
        index.race(index.fromEmitterEvent(this.browsingContext, "navigation"), index.fromEmitterEvent(this.browsingContext, "historyUpdated").pipe(index.map(() => {
          return null;
        }))).pipe(index.first()).pipe(index.switchMap((navigation) => {
          if (navigation === null) {
            return index.of(null);
          }
          return __privateGet(this, _BidiFrame_instances, waitForLoad$_get).call(this, options).pipe(index.delayWhen(() => {
            if (frames.length === 0) {
              return index.of(void 0);
            }
            return index.combineLatest(frames);
          }), index.raceWith(index.fromEmitterEvent(navigation, "fragment"), index.fromEmitterEvent(navigation, "failed"), index.fromEmitterEvent(navigation, "aborted")), index.switchMap(() => {
            if (navigation.request) {
              let requestFinished$ = function(request) {
                if (navigation === null) {
                  return index.of(null);
                }
                if (request.response || request.error) {
                  return index.of(navigation);
                }
                if (request.redirect) {
                  return requestFinished$(request.redirect);
                }
                return index.fromEmitterEvent(request, "success").pipe(index.raceWith(index.fromEmitterEvent(request, "error")), index.raceWith(index.fromEmitterEvent(request, "redirect"))).pipe(index.switchMap(() => {
                  return requestFinished$(request);
                }));
              };
              return requestFinished$(navigation.request);
            }
            return index.of(navigation);
          }));
        })),
        __privateGet(this, _BidiFrame_instances, waitForNetworkIdle$_get).call(this, options)
      ]).pipe(index.map(([navigation]) => {
        if (!navigation) {
          return null;
        }
        const request = navigation.request;
        if (!request) {
          return null;
        }
        const lastRequest = request.lastRedirect ?? request;
        const httpRequest = requests.get(lastRequest);
        return httpRequest.response();
      }), index.raceWith(index.timeout(ms), index.fromAbortSignal(signal), __privateMethod(this, _BidiFrame_instances, detached$_fn).call(this).pipe(index.map(() => {
        throw new index.TargetCloseError("Frame detached.");
      })))));
    }
    waitForDevicePrompt(options = {}) {
      const { timeout = this.timeoutSettings.timeout(), signal } = options;
      return this.browsingContext.waitForDevicePrompt(timeout, signal);
    }
    get detached() {
      return this.browsingContext.closed;
    }
    async exposeFunction(name, apply) {
      if (__privateGet(this, _exposedFunctions).has(name)) {
        throw new Error(`Failed to add page binding with name ${name}: globalThis['${name}'] already exists!`);
      }
      const exposable = await ExposableFunction.from(this, name, apply, false, __privateGet(this, _logger21));
      __privateGet(this, _exposedFunctions).set(name, exposable);
    }
    async removeExposedFunction(name) {
      const exposedFunction = __privateGet(this, _exposedFunctions).get(name);
      if (!exposedFunction) {
        throw new Error(`Failed to remove page binding with name ${name}: window['${name}'] does not exists!`);
      }
      __privateGet(this, _exposedFunctions).delete(name);
      await exposedFunction[Symbol.asyncDispose]();
    }
    async createCDPSession() {
      if (!this.page().browser().cdpSupported) {
        throw new index.UnsupportedOperation();
      }
      const cdpConnection = this.page().browser().cdpConnection;
      return await cdpConnection._createSession({ targetId: this._id });
    }
    async setFiles(element, files) {
      await this.browsingContext.setFiles(
        // SAFETY: ElementHandles are always remote references.
        element.remoteValue(),
        files
      );
    }
    async frameElement() {
      const parentFrame = this.parentFrame();
      if (!parentFrame) {
        return null;
      }
      const [node] = await parentFrame.browsingContext.locateNodes({
        type: "context",
        value: {
          context: this._id
        }
      });
      if (!node) {
        return null;
      }
      return BidiElementHandle.from(node, parentFrame.mainRealm());
    }
    async locateNodes(element, locator) {
      return await this.browsingContext.locateNodes(
        locator,
        // SAFETY: ElementHandles are always remote references.
        [element.remoteValue()]
      );
    }
    extensionRealms() {
      throw new index.UnsupportedOperation();
    }
  }, _parent = new WeakMap(), _frames = new WeakMap(), _logger21 = new WeakMap(), _BidiFrame_instances = new WeakSet(), initialize_fn7 = function() {
    for (const browsingContext of this.browsingContext.children) {
      __privateMethod(this, _BidiFrame_instances, createFrameTarget_fn).call(this, browsingContext);
    }
    this.browsingContext.on("browsingcontext", (browsingContext) => {
      __privateMethod(this, _BidiFrame_instances, createFrameTarget_fn).call(this, browsingContext);
    });
    this.browsingContext.on("closed", () => {
      for (const session of BidiCdpSession.sessions.values()) {
        if (session.frame === this) {
          session.onClose();
        }
      }
      this.page().trustedEmitter.emit("framedetached", this);
    });
    this.browsingContext.on("request", (request) => {
      const httpRequest = BidiHTTPRequest.from(request, this, this.page().isNetworkInterceptionEnabled, void 0, this.logger);
      request.once("success", () => {
        this.page().trustedEmitter.emit("requestfinished", httpRequest);
      });
      request.once("error", () => {
        this.page().trustedEmitter.emit("requestfailed", httpRequest);
      });
      void httpRequest.finalizeInterceptions();
    });
    this.browsingContext.on("navigation", (navigation) => {
      navigation.once("fragment", () => {
        this.page().trustedEmitter.emit("framenavigated", this);
      });
    });
    this.browsingContext.on("load", () => {
      this.page().trustedEmitter.emit("load", void 0);
    });
    this.browsingContext.on("DOMContentLoaded", () => {
      this._hasStartedLoading = true;
      this.page().trustedEmitter.emit("domcontentloaded", void 0);
      this.page().trustedEmitter.emit("framenavigated", this);
    });
    this.browsingContext.on("userprompt", (userPrompt) => {
      this.page().trustedEmitter.emit("dialog", BidiDialog.from(userPrompt));
    });
    this.browsingContext.on("log", (entry) => {
      var _a4, _b2;
      if (this._id !== entry.source.context) {
        return;
      }
      if (isConsoleLogEntry(entry)) {
        if (!this.page().listenerCount(
          "console"
          /* PageEvent.Console */
        )) {
          return;
        }
        const args = entry.args.map((arg) => {
          return this.mainRealm().createHandle(arg);
        });
        this.page().trustedEmitter.emit("console", getConsoleMessage(entry, args, this));
      } else if (isJavaScriptLogEntry(entry)) {
        const error = new Error(entry.text ?? "");
        const messageHeight = error.message.split("\n").length;
        const messageLines = error.stack.split("\n").splice(0, messageHeight);
        const stackLines = [];
        if (entry.stackTrace) {
          for (const frame of entry.stackTrace.callFrames) {
            stackLines.push(`    at ${frame.functionName || "<anonymous>"} (${frame.url}:${frame.lineNumber + 1}:${frame.columnNumber + 1})`);
            if (stackLines.length >= Error.stackTraceLimit) {
              break;
            }
          }
        }
        error.stack = [...messageLines, ...stackLines].join("\n");
        this.page().trustedEmitter.emit("pageerror", error);
      } else {
        (_b2 = (_a4 = __privateGet(this, _logger21)) == null ? void 0 : _a4.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(`Unhandled LogEntry with type "${entry.type}", text "${entry.text}" and level "${entry.level}"`);
      }
    });
    this.browsingContext.on("worker", (realm) => {
      const worker = BidiWebWorker.from(this, realm, __privateGet(this, _logger21));
      realm.on("destroyed", () => {
        this.page().trustedEmitter.emit("workerdestroyed", worker);
      });
      this.page().trustedEmitter.emit("workercreated", worker);
    });
  }, createFrameTarget_fn = function(browsingContext) {
    const frame = _a3.from(this, browsingContext, __privateGet(this, _logger21));
    __privateGet(this, _frames).set(browsingContext, frame);
    this.page().trustedEmitter.emit("frameattached", frame);
    browsingContext.on("closed", () => {
      __privateGet(this, _frames).delete(browsingContext);
    });
    return frame;
  }, detached$_fn = function() {
    return index.defer(() => {
      if (this.detached) {
        return index.of(this);
      }
      return index.fromEmitterEvent(
        this.page().trustedEmitter,
        "framedetached"
        /* PageEvent.FrameDetached */
      ).pipe(index.filter((detachedFrame) => {
        return detachedFrame === this;
      }));
    });
  }, _exposedFunctions = new WeakMap(), waitForLoad$_get = function() {
    return _private_waitForLoad$_descriptor.value;
  }, waitForNetworkIdle$_get = function() {
    return _private_waitForNetworkIdle$_descriptor.value;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    _goto_decorators = [index.throwIfDetached];
    _setContent_decorators = [index.throwIfDetached];
    _waitForNavigation_decorators = [index.throwIfDetached];
    _private_waitForLoad$_decorators = [index.throwIfDetached];
    _private_waitForNetworkIdle$_decorators = [index.throwIfDetached];
    _setFiles_decorators = [index.throwIfDetached];
    _frameElement_decorators = [index.throwIfDetached];
    _locateNodes_decorators = [index.throwIfDetached];
    __esDecorate$5(_a3, null, _goto_decorators, { kind: "method", name: "goto", static: false, private: false, access: { has: (obj) => "goto" in obj, get: (obj) => obj.goto }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$5(_a3, null, _setContent_decorators, { kind: "method", name: "setContent", static: false, private: false, access: { has: (obj) => "setContent" in obj, get: (obj) => obj.setContent }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$5(_a3, null, _waitForNavigation_decorators, { kind: "method", name: "waitForNavigation", static: false, private: false, access: { has: (obj) => "waitForNavigation" in obj, get: (obj) => obj.waitForNavigation }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$5(_a3, _private_waitForLoad$_descriptor = { value: __setFunctionName$1(function(options = {}) {
      let { waitUntil = "load" } = options;
      const { timeout: ms = this.timeoutSettings.navigationTimeout() } = options;
      if (!Array.isArray(waitUntil)) {
        waitUntil = [waitUntil];
      }
      const events = /* @__PURE__ */ new Set();
      for (const lifecycleEvent of waitUntil) {
        switch (lifecycleEvent) {
          case "load": {
            events.add("load");
            break;
          }
          case "domcontentloaded": {
            events.add("DOMContentLoaded");
            break;
          }
        }
      }
      if (events.size === 0) {
        return index.of(void 0);
      }
      return index.combineLatest([...events].map((event) => {
        return index.fromEmitterEvent(this.browsingContext, event);
      })).pipe(index.map(() => {
      }), index.first(), index.raceWith(index.timeout(ms), __privateMethod(this, _BidiFrame_instances, detached$_fn).call(this).pipe(index.map(() => {
        throw new Error("Frame detached.");
      }))));
    }, "#waitForLoad$") }, _private_waitForLoad$_decorators, { kind: "method", name: "#waitForLoad$", static: false, private: true, access: { has: (obj) => __privateIn(_BidiFrame_instances, obj), get: (obj) => __privateGet(obj, _BidiFrame_instances, waitForLoad$_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$5(_a3, _private_waitForNetworkIdle$_descriptor = { value: __setFunctionName$1(function(options = {}) {
      let { waitUntil = "load" } = options;
      if (!Array.isArray(waitUntil)) {
        waitUntil = [waitUntil];
      }
      let concurrency = Infinity;
      for (const event of waitUntil) {
        switch (event) {
          case "networkidle0": {
            concurrency = Math.min(0, concurrency);
            break;
          }
          case "networkidle2": {
            concurrency = Math.min(2, concurrency);
            break;
          }
        }
      }
      if (concurrency === Infinity) {
        return index.of(void 0);
      }
      return this.page().waitForNetworkIdle$({
        idleTime: 500,
        timeout: options.timeout ?? this.timeoutSettings.timeout(),
        concurrency
      });
    }, "#waitForNetworkIdle$") }, _private_waitForNetworkIdle$_decorators, { kind: "method", name: "#waitForNetworkIdle$", static: false, private: true, access: { has: (obj) => __privateIn(_BidiFrame_instances, obj), get: (obj) => __privateGet(obj, _BidiFrame_instances, waitForNetworkIdle$_get) }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$5(_a3, null, _setFiles_decorators, { kind: "method", name: "setFiles", static: false, private: false, access: { has: (obj) => "setFiles" in obj, get: (obj) => obj.setFiles }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$5(_a3, null, _frameElement_decorators, { kind: "method", name: "frameElement", static: false, private: false, access: { has: (obj) => "frameElement" in obj, get: (obj) => obj.frameElement }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$5(_a3, null, _locateNodes_decorators, { kind: "method", name: "locateNodes", static: false, private: false, access: { has: (obj) => "locateNodes" in obj, get: (obj) => obj.locateNodes }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var SourceActionsType;
(function(SourceActionsType2) {
  SourceActionsType2["None"] = "none";
  SourceActionsType2["Key"] = "key";
  SourceActionsType2["Pointer"] = "pointer";
  SourceActionsType2["Wheel"] = "wheel";
})(SourceActionsType || (SourceActionsType = {}));
var ActionType;
(function(ActionType2) {
  ActionType2["Pause"] = "pause";
  ActionType2["KeyDown"] = "keyDown";
  ActionType2["KeyUp"] = "keyUp";
  ActionType2["PointerUp"] = "pointerUp";
  ActionType2["PointerDown"] = "pointerDown";
  ActionType2["PointerMove"] = "pointerMove";
  ActionType2["Scroll"] = "scroll";
})(ActionType || (ActionType = {}));
const getBidiKeyValue = (key) => {
  switch (key) {
    case "\r":
    case "\n":
      key = "Enter";
      break;
  }
  if ([...key].length === 1) {
    return key;
  }
  switch (key) {
    case "Cancel":
      return "";
    case "Help":
      return "";
    case "Backspace":
      return "";
    case "Tab":
      return "";
    case "Clear":
      return "";
    case "Enter":
      return "";
    case "Shift":
    case "ShiftLeft":
      return "";
    case "Control":
    case "ControlLeft":
      return "";
    case "Alt":
    case "AltLeft":
      return "";
    case "Pause":
      return "";
    case "Escape":
      return "";
    case "PageUp":
      return "";
    case "PageDown":
      return "";
    case "End":
      return "";
    case "Home":
      return "";
    case "ArrowLeft":
      return "";
    case "ArrowUp":
      return "";
    case "ArrowRight":
      return "";
    case "ArrowDown":
      return "";
    case "Insert":
      return "";
    case "Delete":
      return "";
    case "NumpadEqual":
      return "";
    case "Numpad0":
      return "";
    case "Numpad1":
      return "";
    case "Numpad2":
      return "";
    case "Numpad3":
      return "";
    case "Numpad4":
      return "";
    case "Numpad5":
      return "";
    case "Numpad6":
      return "";
    case "Numpad7":
      return "";
    case "Numpad8":
      return "";
    case "Numpad9":
      return "";
    case "NumpadMultiply":
      return "";
    case "NumpadAdd":
      return "";
    case "NumpadSubtract":
      return "";
    case "NumpadDecimal":
      return "";
    case "NumpadDivide":
      return "";
    case "F1":
      return "";
    case "F2":
      return "";
    case "F3":
      return "";
    case "F4":
      return "";
    case "F5":
      return "";
    case "F6":
      return "";
    case "F7":
      return "";
    case "F8":
      return "";
    case "F9":
      return "";
    case "F10":
      return "";
    case "F11":
      return "";
    case "F12":
      return "";
    case "Meta":
    case "MetaLeft":
      return "";
    case "ShiftRight":
      return "";
    case "ControlRight":
      return "";
    case "AltRight":
      return "";
    case "MetaRight":
      return "";
    case "Digit0":
      return "0";
    case "Digit1":
      return "1";
    case "Digit2":
      return "2";
    case "Digit3":
      return "3";
    case "Digit4":
      return "4";
    case "Digit5":
      return "5";
    case "Digit6":
      return "6";
    case "Digit7":
      return "7";
    case "Digit8":
      return "8";
    case "Digit9":
      return "9";
    case "KeyA":
      return "a";
    case "KeyB":
      return "b";
    case "KeyC":
      return "c";
    case "KeyD":
      return "d";
    case "KeyE":
      return "e";
    case "KeyF":
      return "f";
    case "KeyG":
      return "g";
    case "KeyH":
      return "h";
    case "KeyI":
      return "i";
    case "KeyJ":
      return "j";
    case "KeyK":
      return "k";
    case "KeyL":
      return "l";
    case "KeyM":
      return "m";
    case "KeyN":
      return "n";
    case "KeyO":
      return "o";
    case "KeyP":
      return "p";
    case "KeyQ":
      return "q";
    case "KeyR":
      return "r";
    case "KeyS":
      return "s";
    case "KeyT":
      return "t";
    case "KeyU":
      return "u";
    case "KeyV":
      return "v";
    case "KeyW":
      return "w";
    case "KeyX":
      return "x";
    case "KeyY":
      return "y";
    case "KeyZ":
      return "z";
    case "Semicolon":
      return ";";
    case "Equal":
      return "=";
    case "Comma":
      return ",";
    case "Minus":
      return "-";
    case "Period":
      return ".";
    case "Slash":
      return "/";
    case "Backquote":
      return "`";
    case "BracketLeft":
      return "[";
    case "Backslash":
      return "\\";
    case "BracketRight":
      return "]";
    case "Quote":
      return '"';
    default:
      throw new Error(`Unknown key: "${key}"`);
  }
};
class BidiKeyboard extends index.Keyboard {
  constructor(page) {
    super();
    __privateAdd(this, _page);
    __privateSet(this, _page, page);
  }
  async down(key, _options) {
    await __privateGet(this, _page).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions: [
          {
            type: ActionType.KeyDown,
            value: getBidiKeyValue(key)
          }
        ]
      }
    ]);
  }
  async up(key) {
    await __privateGet(this, _page).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions: [
          {
            type: ActionType.KeyUp,
            value: getBidiKeyValue(key)
          }
        ]
      }
    ]);
  }
  async press(key, options = {}) {
    const { delay = 0 } = options;
    const actions = [
      {
        type: ActionType.KeyDown,
        value: getBidiKeyValue(key)
      }
    ];
    if (delay > 0) {
      actions.push({
        type: ActionType.Pause,
        duration: delay
      });
    }
    actions.push({
      type: ActionType.KeyUp,
      value: getBidiKeyValue(key)
    });
    await __privateGet(this, _page).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions
      }
    ]);
  }
  async type(text, options = {}) {
    const { delay = 0 } = options;
    const values = [...text].map(getBidiKeyValue);
    const actions = [];
    if (delay <= 0) {
      for (const value of values) {
        actions.push({
          type: ActionType.KeyDown,
          value
        }, {
          type: ActionType.KeyUp,
          value
        });
      }
    } else {
      for (const value of values) {
        actions.push({
          type: ActionType.KeyDown,
          value
        }, {
          type: ActionType.Pause,
          duration: delay
        }, {
          type: ActionType.KeyUp,
          value
        });
      }
    }
    await __privateGet(this, _page).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Key,
        id: "__puppeteer_keyboard",
        actions
      }
    ]);
  }
  async sendCharacter(char) {
    if ([...char].length > 1) {
      throw new Error("Cannot send more than 1 character.");
    }
    const frame = await __privateGet(this, _page).focusedFrame();
    await frame.isolatedRealm().evaluate(async (char2) => {
      document.execCommand("insertText", false, char2);
    }, char);
  }
}
_page = new WeakMap();
const getBidiButton = (button) => {
  switch (button) {
    case index.MouseButton.Left:
      return 0;
    case index.MouseButton.Middle:
      return 1;
    case index.MouseButton.Right:
      return 2;
    case index.MouseButton.Back:
      return 3;
    case index.MouseButton.Forward:
      return 4;
  }
};
class BidiMouse extends index.Mouse {
  constructor(page) {
    super();
    __privateAdd(this, _page2);
    __privateAdd(this, _lastMovePoint, { x: 0, y: 0 });
    __privateSet(this, _page2, page);
  }
  async reset() {
    __privateSet(this, _lastMovePoint, { x: 0, y: 0 });
    await __privateGet(this, _page2).mainFrame().browsingContext.releaseActions();
  }
  async move(x, y, options = {}) {
    const from = __privateGet(this, _lastMovePoint);
    const to = {
      x: Math.round(x),
      y: Math.round(y)
    };
    const actions = [];
    const steps = options.steps ?? 0;
    for (let i = 0; i < steps; ++i) {
      actions.push({
        type: ActionType.PointerMove,
        x: from.x + (to.x - from.x) * (i / steps),
        y: from.y + (to.y - from.y) * (i / steps),
        origin: options.origin
      });
    }
    actions.push({
      type: ActionType.PointerMove,
      ...to,
      origin: options.origin
    });
    __privateSet(this, _lastMovePoint, to);
    await __privateGet(this, _page2).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions
      }
    ]);
  }
  async down(options = {}) {
    await __privateGet(this, _page2).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions: [
          {
            type: ActionType.PointerDown,
            button: getBidiButton(options.button ?? index.MouseButton.Left)
          }
        ]
      }
    ]);
  }
  async up(options = {}) {
    await __privateGet(this, _page2).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions: [
          {
            type: ActionType.PointerUp,
            button: getBidiButton(options.button ?? index.MouseButton.Left)
          }
        ]
      }
    ]);
  }
  async click(x, y, options = {}) {
    const actions = [
      {
        type: ActionType.PointerMove,
        x: Math.round(x),
        y: Math.round(y),
        origin: options.origin
      }
    ];
    const pointerDownAction = {
      type: ActionType.PointerDown,
      button: getBidiButton(options.button ?? index.MouseButton.Left)
    };
    const pointerUpAction = {
      type: ActionType.PointerUp,
      button: pointerDownAction.button
    };
    for (let i = 1; i < (options.count ?? 1); ++i) {
      actions.push(pointerDownAction, pointerUpAction);
    }
    actions.push(pointerDownAction);
    if (options.delay) {
      actions.push({
        type: ActionType.Pause,
        duration: options.delay
      });
    }
    actions.push(pointerUpAction);
    await __privateGet(this, _page2).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: "__puppeteer_mouse",
        actions
      }
    ]);
  }
  async wheel(options = {}) {
    await __privateGet(this, _page2).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Wheel,
        id: "__puppeteer_wheel",
        actions: [
          {
            type: ActionType.Scroll,
            ...__privateGet(this, _lastMovePoint) ?? {
              x: 0,
              y: 0
            },
            deltaX: options.deltaX ?? 0,
            deltaY: options.deltaY ?? 0
          }
        ]
      }
    ]);
  }
  drag() {
    throw new index.UnsupportedOperation();
  }
  dragOver() {
    throw new index.UnsupportedOperation();
  }
  dragEnter() {
    throw new index.UnsupportedOperation();
  }
  drop() {
    throw new index.UnsupportedOperation();
  }
  dragAndDrop() {
    throw new index.UnsupportedOperation();
  }
}
_page2 = new WeakMap();
_lastMovePoint = new WeakMap();
class BidiTouchHandle {
  constructor(page, touchScreen, id, x, y, properties) {
    __privateAdd(this, _started2, false);
    __privateAdd(this, _x2);
    __privateAdd(this, _y2);
    __privateAdd(this, _bidiId);
    __privateAdd(this, _page3);
    __privateAdd(this, _touchScreen);
    __privateAdd(this, _properties2);
    __privateSet(this, _page3, page);
    __privateSet(this, _touchScreen, touchScreen);
    __privateSet(this, _x2, Math.round(x));
    __privateSet(this, _y2, Math.round(y));
    __privateSet(this, _properties2, properties);
    __privateSet(this, _bidiId, `${"__puppeteer_finger"}_${id}`);
  }
  async start(options = {}) {
    if (__privateGet(this, _started2)) {
      throw new index.TouchError("Touch has already started");
    }
    await __privateGet(this, _page3).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: __privateGet(this, _bidiId),
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            type: ActionType.PointerMove,
            x: __privateGet(this, _x2),
            y: __privateGet(this, _y2),
            origin: options.origin
          },
          {
            ...__privateGet(this, _properties2),
            type: ActionType.PointerDown,
            button: 0
          }
        ]
      }
    ]);
    __privateSet(this, _started2, true);
  }
  move(x, y) {
    const newX = Math.round(x);
    const newY = Math.round(y);
    return __privateGet(this, _page3).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: __privateGet(this, _bidiId),
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            ...__privateGet(this, _properties2),
            type: ActionType.PointerMove,
            x: newX,
            y: newY
          }
        ]
      }
    ]);
  }
  async end() {
    await __privateGet(this, _page3).mainFrame().browsingContext.performActions([
      {
        type: SourceActionsType.Pointer,
        id: __privateGet(this, _bidiId),
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            type: ActionType.PointerUp,
            button: 0
          }
        ]
      }
    ]);
    __privateGet(this, _touchScreen).removeHandle(this);
  }
}
_started2 = new WeakMap();
_x2 = new WeakMap();
_y2 = new WeakMap();
_bidiId = new WeakMap();
_page3 = new WeakMap();
_touchScreen = new WeakMap();
_properties2 = new WeakMap();
class BidiTouchscreen extends index.Touchscreen {
  constructor(page) {
    super();
    __privateAdd(this, _page4);
    __privateSet(this, _page4, page);
  }
  async touchStart(x, y, options = {}) {
    const id = this.idGenerator();
    const properties = {
      width: 0.5 * 2,
      // 2 times default touch radius.
      height: 0.5 * 2,
      // 2 times default touch radius.
      pressure: 0.5
    };
    const touch = new BidiTouchHandle(__privateGet(this, _page4), this, id, x, y, properties);
    await touch.start(options);
    this.touches.push(touch);
    return touch;
  }
}
_page4 = new WeakMap();
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __esDecorate$4 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers$4 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __addDisposableResource$2 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources$2 = /* @__PURE__ */ function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
let BidiPage = (() => {
  var _trustedEmitter_accessor_storage, _browserContext, _frame6, _viewport, _workers5, _cdpEmulationManager, _emulatedNetworkConditions, _fileChooserDeferreds, _BidiPage_instances, initialize_fn7, _requestInterception, _authInterception, toggleInterception_fn, applyNetworkConditions_fn, go_fn, _a3;
  let _classSuper = index.Page;
  let _trustedEmitter_decorators;
  let _trustedEmitter_initializers = [];
  let _trustedEmitter_extraInitializers = [];
  return _a3 = class extends _classSuper {
    constructor(browserContext, browsingContext, logger) {
      super(logger);
      __privateAdd(this, _BidiPage_instances);
      __privateAdd(this, _trustedEmitter_accessor_storage, __runInitializers$4(this, _trustedEmitter_initializers, new index.EventEmitter()));
      __privateAdd(this, _browserContext, __runInitializers$4(this, _trustedEmitter_extraInitializers));
      __privateAdd(this, _frame6);
      __privateAdd(this, _viewport, null);
      __privateAdd(this, _workers5, /* @__PURE__ */ new Set());
      __publicField(this, "keyboard");
      __publicField(this, "mouse");
      __publicField(this, "touchscreen");
      __publicField(this, "tracing");
      __publicField(this, "coverage");
      __privateAdd(this, _cdpEmulationManager);
      __privateAdd(this, _emulatedNetworkConditions);
      __privateAdd(this, _fileChooserDeferreds, /* @__PURE__ */ new Set());
      __privateAdd(this, _requestInterception);
      /**
       * @internal
       */
      __publicField(this, "_credentials", null);
      __privateAdd(this, _authInterception);
      __privateSet(this, _browserContext, browserContext);
      __privateSet(this, _frame6, BidiFrame.from(this, browsingContext, logger));
      __privateSet(this, _cdpEmulationManager, new index.EmulationManager(__privateGet(this, _frame6).client, logger));
      this.tracing = new index.Tracing(__privateGet(this, _frame6).client, logger);
      this.coverage = new index.Coverage(__privateGet(this, _frame6).client);
      this.keyboard = new BidiKeyboard(this);
      this.mouse = new BidiMouse(this);
      this.touchscreen = new BidiTouchscreen(this);
    }
    static from(browserContext, browsingContext, logger) {
      var _a4;
      const page = new _a3(browserContext, browsingContext, logger);
      __privateMethod(_a4 = page, _BidiPage_instances, initialize_fn7).call(_a4);
      return page;
    }
    get trustedEmitter() {
      return __privateGet(this, _trustedEmitter_accessor_storage);
    }
    set trustedEmitter(value) {
      __privateSet(this, _trustedEmitter_accessor_storage, value);
    }
    get webmcp() {
      throw new index.UnsupportedOperation();
    }
    _client() {
      return __privateGet(this, _frame6).client;
    }
    /**
     * @internal
     */
    async setUserAgent(userAgentOrOptions, userAgentMetadata) {
      let userAgent;
      let clientHints;
      let platform;
      if (typeof userAgentOrOptions === "string") {
        userAgent = userAgentOrOptions;
        clientHints = userAgentMetadata;
      } else {
        userAgent = userAgentOrOptions.userAgent ?? null;
        clientHints = userAgentOrOptions.userAgentMetadata;
        platform = userAgentOrOptions.platform === "" ? void 0 : userAgentOrOptions.platform;
      }
      if (userAgent === "") {
        userAgent = null;
      }
      await __privateGet(this, _frame6).browsingContext.setUserAgent(userAgent);
      if (platform && platform !== "") {
        clientHints = clientHints ?? {};
        clientHints.platform = platform;
      }
      await __privateGet(this, _frame6).browsingContext.setClientHintsOverride(clientHints ?? null);
    }
    async setBypassCSP(enabled) {
      await this._client().send("Page.setBypassCSP", { enabled });
    }
    async queryObjects(prototypeHandle) {
      index.assert(!prototypeHandle.disposed, "Prototype JSHandle is disposed!");
      index.assert(prototypeHandle.id, "Prototype JSHandle must not be referencing primitive value");
      const response = await __privateGet(this, _frame6).client.send("Runtime.queryObjects", {
        prototypeObjectId: prototypeHandle.id
      });
      return __privateGet(this, _frame6).mainRealm().createHandle({
        type: "array",
        handle: response.objects.objectId
      });
    }
    browser() {
      return this.browserContext().browser();
    }
    browserContext() {
      return __privateGet(this, _browserContext);
    }
    mainFrame() {
      return __privateGet(this, _frame6);
    }
    async triggerExtensionAction(_extension) {
      throw new index.UnsupportedOperation();
    }
    async emulateFocusedPage(enabled) {
      return await __privateGet(this, _cdpEmulationManager).emulateFocus(enabled);
    }
    resize(_params) {
      throw new index.UnsupportedOperation();
    }
    async windowId() {
      return __privateGet(this, _frame6).browsingContext.windowId;
    }
    openDevTools() {
      throw new index.UnsupportedOperation();
    }
    hasDevTools() {
      throw new index.UnsupportedOperation();
    }
    async focusedFrame() {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const handle = __addDisposableResource$2(env_1, await this.mainFrame().isolatedRealm().evaluateHandle(() => {
          let win = window;
          while (win.document.activeElement instanceof win.HTMLIFrameElement || win.document.activeElement instanceof win.HTMLFrameElement) {
            if (win.document.activeElement.contentWindow === null) {
              break;
            }
            win = win.document.activeElement.contentWindow;
          }
          return win;
        }), false);
        const value = handle.remoteValue();
        index.assert(value.type === "window");
        const frame = this.frames().find((frame2) => {
          return frame2._id === value.value.context;
        });
        index.assert(frame);
        return frame;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources$2(env_1);
      }
    }
    frames() {
      const frames = [__privateGet(this, _frame6)];
      for (const frame of frames) {
        frames.push(...frame.childFrames());
      }
      return frames;
    }
    isClosed() {
      return __privateGet(this, _frame6).detached;
    }
    async close(options) {
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        const _guard = __addDisposableResource$2(env_2, await __privateGet(this, _browserContext).waitForScreenshotOperations(), false);
        try {
          await __privateGet(this, _frame6).browsingContext.close(options == null ? void 0 : options.runBeforeUnload);
        } catch {
          return;
        }
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        __disposeResources$2(env_2);
      }
    }
    async reload(options = {}) {
      const [response] = await Promise.all([
        __privateGet(this, _frame6).waitForNavigation(options),
        __privateGet(this, _frame6).browsingContext.reload({
          ignoreCache: options.ignoreCache ? true : void 0
        })
      ]).catch(rewriteNavigationError(this.url(), options.timeout ?? this._timeoutSettings.navigationTimeout()));
      return response;
    }
    setDefaultNavigationTimeout(timeout) {
      this._timeoutSettings.setDefaultNavigationTimeout(timeout);
    }
    setDefaultTimeout(timeout) {
      this._timeoutSettings.setDefaultTimeout(timeout);
    }
    getDefaultTimeout() {
      return this._timeoutSettings.timeout();
    }
    getDefaultNavigationTimeout() {
      return this._timeoutSettings.navigationTimeout();
    }
    isJavaScriptEnabled() {
      return __privateGet(this, _frame6).browsingContext.isJavaScriptEnabled();
    }
    async setGeolocation(options) {
      const { longitude, latitude, accuracy = 0 } = options;
      if (longitude < -180 || longitude > 180) {
        throw new Error(`Invalid longitude "${longitude}": precondition -180 <= LONGITUDE <= 180 failed.`);
      }
      if (latitude < -90 || latitude > 90) {
        throw new Error(`Invalid latitude "${latitude}": precondition -90 <= LATITUDE <= 90 failed.`);
      }
      if (accuracy < 0) {
        throw new Error(`Invalid accuracy "${accuracy}": precondition 0 <= ACCURACY failed.`);
      }
      return await __privateGet(this, _frame6).browsingContext.setGeolocationOverride({
        coordinates: {
          latitude: options.latitude,
          longitude: options.longitude,
          accuracy: options.accuracy
        }
      });
    }
    async setJavaScriptEnabled(enabled) {
      return await __privateGet(this, _frame6).browsingContext.setJavaScriptEnabled(enabled);
    }
    async emulateMediaType(type) {
      return await __privateGet(this, _cdpEmulationManager).emulateMediaType(type);
    }
    async emulateCPUThrottling(factor) {
      return await __privateGet(this, _cdpEmulationManager).emulateCPUThrottling(factor);
    }
    async emulateMediaFeatures(features) {
      return await __privateGet(this, _cdpEmulationManager).emulateMediaFeatures(features);
    }
    async emulateTimezone(timezoneId) {
      return await __privateGet(this, _frame6).browsingContext.setTimezoneOverride(timezoneId);
    }
    async emulateLocale(locale) {
      return await __privateGet(this, _frame6).browsingContext.setLocaleOverride(locale);
    }
    async emulateIdleState(overrides) {
      return await __privateGet(this, _cdpEmulationManager).emulateIdleState(overrides);
    }
    async emulateVisionDeficiency(type) {
      return await __privateGet(this, _cdpEmulationManager).emulateVisionDeficiency(type);
    }
    async setViewport(viewport) {
      var _a4;
      let needsReload = false;
      if (!this.browser().cdpSupported) {
        const viewportSize = (viewport == null ? void 0 : viewport.width) && (viewport == null ? void 0 : viewport.height) ? {
          width: viewport.width,
          height: viewport.height
        } : null;
        const devicePixelRatio = (viewport == null ? void 0 : viewport.deviceScaleFactor) ? viewport.deviceScaleFactor : null;
        const screenOrientation = viewport ? viewport.isLandscape ? {
          natural: "landscape",
          type: "landscape-primary"
        } : {
          natural: "portrait",
          type: "portrait-primary"
        } : null;
        const commands = [
          __privateGet(this, _frame6).browsingContext.setViewport({
            viewport: viewportSize,
            devicePixelRatio
          }),
          __privateGet(this, _frame6).browsingContext.setScreenOrientationOverride(screenOrientation)
        ];
        if ((((_a4 = __privateGet(this, _viewport)) == null ? void 0 : _a4.hasTouch) ?? false) !== ((viewport == null ? void 0 : viewport.hasTouch) ?? false)) {
          needsReload = true;
          const maxTouchPoints = (viewport == null ? void 0 : viewport.hasTouch) ? 1 : null;
          commands.push(__privateGet(this, _frame6).browsingContext.setTouchOverride(maxTouchPoints).catch((error) => {
            if (error instanceof index.ProtocolError && (error.message.includes("unknown command") || error.message.includes("unsupported operation"))) {
              return;
            }
            throw error;
          }));
        }
        await Promise.all(commands);
      } else {
        needsReload = await __privateGet(this, _cdpEmulationManager).emulateViewport(viewport);
      }
      __privateSet(this, _viewport, viewport);
      if (needsReload) {
        await this.reload();
      }
    }
    viewport() {
      return __privateGet(this, _viewport);
    }
    async pdf(options = {}) {
      const { timeout: ms = this._timeoutSettings.timeout(), path = void 0 } = options;
      const { printBackground: background, margin, landscape, width, height, pageRanges: ranges, scale, preferCSSPageSize } = index.parsePDFOptions(options, "cm");
      const pageRanges = ranges ? ranges.split(", ") : [];
      await index.firstValueFrom(index.from(this.mainFrame().isolatedRealm().evaluate(() => {
        return document.fonts.ready;
      })).pipe(index.raceWith(index.timeout(ms))));
      const data = await index.firstValueFrom(index.from(__privateGet(this, _frame6).browsingContext.print({
        background,
        margin,
        orientation: landscape ? "landscape" : "portrait",
        page: {
          width,
          height
        },
        pageRanges,
        scale,
        shrinkToFit: !preferCSSPageSize
      })).pipe(index.raceWith(index.timeout(ms))));
      const typedArray = index.stringToTypedArray(data, true);
      await this._maybeWriteTypedArrayToFile(path, typedArray);
      return typedArray;
    }
    async createPDFStream(options) {
      const typedArray = await this.pdf(options);
      return new ReadableStream({
        start(controller) {
          controller.enqueue(typedArray);
          controller.close();
        }
      });
    }
    async _screenshot(options) {
      const { clip, type, captureBeyondViewport, quality } = options;
      if (options.omitBackground !== void 0 && options.omitBackground) {
        throw new index.UnsupportedOperation(`BiDi does not support 'omitBackground'.`);
      }
      if (options.optimizeForSpeed !== void 0 && options.optimizeForSpeed) {
        throw new index.UnsupportedOperation(`BiDi does not support 'optimizeForSpeed'.`);
      }
      if (options.fromSurface !== void 0 && !options.fromSurface) {
        throw new index.UnsupportedOperation(`BiDi does not support 'fromSurface'.`);
      }
      if (clip !== void 0 && clip.scale !== void 0 && clip.scale !== 1) {
        throw new index.UnsupportedOperation(`BiDi does not support 'scale' in 'clip'.`);
      }
      let box;
      if (clip) {
        if (captureBeyondViewport) {
          box = clip;
        } else {
          const [pageLeft, pageTop] = await this.evaluate(() => {
            if (!window.visualViewport) {
              throw new Error("window.visualViewport is not supported.");
            }
            return [
              window.visualViewport.pageLeft,
              window.visualViewport.pageTop
            ];
          });
          box = {
            ...clip,
            x: clip.x - pageLeft,
            y: clip.y - pageTop
          };
        }
      }
      const data = await __privateGet(this, _frame6).browsingContext.captureScreenshot({
        origin: captureBeyondViewport ? "document" : "viewport",
        format: {
          type: `image/${type}`,
          ...quality !== void 0 ? { quality: quality / 100 } : {}
        },
        ...box ? { clip: { type: "box", ...box } } : {}
      });
      return data;
    }
    async createCDPSession() {
      return await __privateGet(this, _frame6).createCDPSession();
    }
    async bringToFront() {
      await __privateGet(this, _frame6).browsingContext.activate();
    }
    async evaluateOnNewDocument(pageFunction, ...args) {
      const expression = evaluationExpression(pageFunction, ...args);
      const script = await __privateGet(this, _frame6).browsingContext.addPreloadScript(expression);
      return { identifier: script };
    }
    async removeScriptToEvaluateOnNewDocument(id) {
      await __privateGet(this, _frame6).browsingContext.removePreloadScript(id);
    }
    async exposeFunction(name, pptrFunction) {
      return await this.mainFrame().exposeFunction(name, "default" in pptrFunction ? pptrFunction.default : pptrFunction);
    }
    isDragInterceptionEnabled() {
      return false;
    }
    async setCacheEnabled(enabled) {
      if (!__privateGet(this, _browserContext).browser().cdpSupported) {
        await __privateGet(this, _frame6).browsingContext.setCacheBehavior(enabled ? "default" : "bypass");
        return;
      }
      await this._client().send("Network.setCacheDisabled", {
        cacheDisabled: !enabled
      });
    }
    async cookies(...urls) {
      const normalizedUrls = (urls.length ? urls : [this.url()]).map((url) => {
        return new URL(url);
      });
      const cookies = await __privateGet(this, _frame6).browsingContext.getCookies();
      return cookies.map((cookie) => {
        return bidiToPuppeteerCookie(cookie);
      }).filter((cookie) => {
        return normalizedUrls.some((url) => {
          return testUrlMatchCookie(cookie, url);
        });
      });
    }
    isServiceWorkerBypassed() {
      throw new index.UnsupportedOperation();
    }
    target() {
      const target = this.browserContext().getTargetForPage(this);
      if (!target) {
        throw new Error("Target not found for page");
      }
      return target;
    }
    async waitForFileChooser(options = {}) {
      const { timeout = this._timeoutSettings.timeout() } = options;
      const deferred = index.Deferred.create({
        message: `Waiting for \`FileChooser\` failed: ${timeout}ms exceeded`,
        timeout
      });
      __privateGet(this, _fileChooserDeferreds).add(deferred);
      if (options.signal) {
        options.signal.addEventListener("abort", () => {
          var _a4;
          deferred.reject((_a4 = options.signal) == null ? void 0 : _a4.reason);
        }, { once: true });
      }
      __privateGet(this, _frame6).browsingContext.once("filedialogopened", (info) => {
        if (!info.element) {
          return;
        }
        const chooser = new index.FileChooser(BidiElementHandle.from({
          sharedId: info.element.sharedId,
          handle: info.element.handle,
          type: "node"
        }, __privateGet(this, _frame6).mainRealm()), info.multiple);
        for (const deferred2 of __privateGet(this, _fileChooserDeferreds)) {
          deferred2.resolve(chooser);
          __privateGet(this, _fileChooserDeferreds).delete(deferred2);
        }
      });
      try {
        return await deferred.valueOrThrow();
      } catch (error) {
        __privateGet(this, _fileChooserDeferreds).delete(deferred);
        throw error;
      }
    }
    workers() {
      return [...__privateGet(this, _workers5)];
    }
    get isNetworkInterceptionEnabled() {
      return Boolean(__privateGet(this, _requestInterception)) || Boolean(__privateGet(this, _authInterception));
    }
    async setRequestInterception(enable) {
      __privateSet(this, _requestInterception, await __privateMethod(this, _BidiPage_instances, toggleInterception_fn).call(this, [
        "beforeRequestSent"
        /* Bidi.Network.InterceptPhase.BeforeRequestSent */
      ], __privateGet(this, _requestInterception), enable));
    }
    /**
     * @internal
     */
    async setExtraHTTPHeaders(headers) {
      await __privateGet(this, _frame6).browsingContext.setExtraHTTPHeaders(headers);
    }
    async authenticate(credentials) {
      __privateSet(this, _authInterception, await __privateMethod(this, _BidiPage_instances, toggleInterception_fn).call(this, [
        "authRequired"
        /* Bidi.Network.InterceptPhase.AuthRequired */
      ], __privateGet(this, _authInterception), Boolean(credentials)));
      this._credentials = credentials;
    }
    setDragInterception() {
      throw new index.UnsupportedOperation();
    }
    setBypassServiceWorker() {
      throw new index.UnsupportedOperation();
    }
    async setOfflineMode(enabled) {
      if (!__privateGet(this, _browserContext).browser().cdpSupported) {
        return await __privateGet(this, _frame6).browsingContext.setOfflineMode(enabled);
      }
      if (!__privateGet(this, _emulatedNetworkConditions)) {
        __privateSet(this, _emulatedNetworkConditions, {
          offline: false,
          upload: -1,
          download: -1,
          latency: 0
        });
      }
      __privateGet(this, _emulatedNetworkConditions).offline = enabled;
      return await __privateMethod(this, _BidiPage_instances, applyNetworkConditions_fn).call(this);
    }
    async emulateNetworkConditions(networkConditions) {
      if (!__privateGet(this, _browserContext).browser().cdpSupported) {
        if (!(networkConditions == null ? void 0 : networkConditions.offline) && (((networkConditions == null ? void 0 : networkConditions.upload) ?? -1) >= 0 || ((networkConditions == null ? void 0 : networkConditions.download) ?? -1) >= 0 || ((networkConditions == null ? void 0 : networkConditions.latency) ?? 0) > 0)) {
          throw new index.UnsupportedOperation();
        }
        return await __privateGet(this, _frame6).browsingContext.setOfflineMode((networkConditions == null ? void 0 : networkConditions.offline) ?? false);
      }
      if (!__privateGet(this, _emulatedNetworkConditions)) {
        __privateSet(this, _emulatedNetworkConditions, {
          offline: (networkConditions == null ? void 0 : networkConditions.offline) ?? false,
          upload: -1,
          download: -1,
          latency: 0
        });
      }
      __privateGet(this, _emulatedNetworkConditions).upload = networkConditions ? networkConditions.upload : -1;
      __privateGet(this, _emulatedNetworkConditions).download = networkConditions ? networkConditions.download : -1;
      __privateGet(this, _emulatedNetworkConditions).latency = networkConditions ? networkConditions.latency : 0;
      __privateGet(this, _emulatedNetworkConditions).offline = (networkConditions == null ? void 0 : networkConditions.offline) ?? false;
      return await __privateMethod(this, _BidiPage_instances, applyNetworkConditions_fn).call(this);
    }
    async setCookie(...cookies) {
      const pageURL = this.url();
      const pageUrlStartsWithHTTP = pageURL.startsWith("http");
      for (const cookie of cookies) {
        let cookieUrl = cookie.url || "";
        if (!cookieUrl && pageUrlStartsWithHTTP) {
          cookieUrl = pageURL;
        }
        index.assert(cookieUrl !== "about:blank", `Blank page can not have cookie "${cookie.name}"`);
        index.assert(!String.prototype.startsWith.call(cookieUrl || "", "data:"), `Data URL page can not have cookie "${cookie.name}"`);
        index.assert(cookie.partitionKey === void 0 || typeof cookie.partitionKey === "string", "BiDi only allows domain partition keys");
        const normalizedUrl = URL.canParse(cookieUrl) ? new URL(cookieUrl) : void 0;
        const domain = cookie.domain ?? (normalizedUrl == null ? void 0 : normalizedUrl.hostname);
        index.assert(domain !== void 0, `At least one of the url and domain needs to be specified`);
        const bidiCookie = {
          domain,
          name: cookie.name,
          value: {
            type: "string",
            value: cookie.value
          },
          ...cookie.path !== void 0 ? { path: cookie.path } : {},
          ...cookie.httpOnly !== void 0 ? { httpOnly: cookie.httpOnly } : {},
          ...cookie.secure !== void 0 ? { secure: cookie.secure } : {},
          ...cookie.sameSite !== void 0 ? { sameSite: convertCookiesSameSiteCdpToBiDi(cookie.sameSite) } : {},
          ...{ expiry: convertCookiesExpiryCdpToBiDi(cookie.expires) },
          // Chrome-specific properties.
          ...cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookie, "sourceScheme", "priority", "url")
        };
        if (cookie.partitionKey !== void 0) {
          await this.browserContext().userContext.setCookie(bidiCookie, cookie.partitionKey);
        } else {
          await __privateGet(this, _frame6).browsingContext.setCookie(bidiCookie);
        }
      }
    }
    async deleteCookie(...cookies) {
      await Promise.all(cookies.map(async (deleteCookieRequest) => {
        const cookieUrl = deleteCookieRequest.url ?? this.url();
        const normalizedUrl = URL.canParse(cookieUrl) ? new URL(cookieUrl) : void 0;
        const domain = deleteCookieRequest.domain ?? (normalizedUrl == null ? void 0 : normalizedUrl.hostname);
        index.assert(domain !== void 0, `At least one of the url and domain needs to be specified`);
        const filter = {
          domain,
          name: deleteCookieRequest.name,
          ...deleteCookieRequest.path !== void 0 ? { path: deleteCookieRequest.path } : {}
        };
        await __privateGet(this, _frame6).browsingContext.deleteCookie(filter);
      }));
    }
    async removeExposedFunction(name) {
      await __privateGet(this, _frame6).removeExposedFunction(name);
    }
    metrics() {
      throw new index.UnsupportedOperation();
    }
    async captureHeapSnapshot(_options) {
      throw new index.UnsupportedOperation();
    }
    async goBack(options = {}) {
      return await __privateMethod(this, _BidiPage_instances, go_fn).call(this, -1, options);
    }
    async goForward(options = {}) {
      return await __privateMethod(this, _BidiPage_instances, go_fn).call(this, 1, options);
    }
    async waitForDevicePrompt(options = {}) {
      return await this.mainFrame().waitForDevicePrompt(options);
    }
    get bluetooth() {
      return this.mainFrame().browsingContext.bluetooth;
    }
    extensionRealms() {
      throw new index.UnsupportedOperation();
    }
  }, _trustedEmitter_accessor_storage = new WeakMap(), _browserContext = new WeakMap(), _frame6 = new WeakMap(), _viewport = new WeakMap(), _workers5 = new WeakMap(), _cdpEmulationManager = new WeakMap(), _emulatedNetworkConditions = new WeakMap(), _fileChooserDeferreds = new WeakMap(), _BidiPage_instances = new WeakSet(), initialize_fn7 = function() {
    __privateGet(this, _frame6).browsingContext.on("closed", () => {
      this.trustedEmitter.emit("close", void 0);
      this.trustedEmitter.removeAllListeners();
    });
    this.trustedEmitter.on("workercreated", (worker) => {
      __privateGet(this, _workers5).add(worker);
    });
    this.trustedEmitter.on("workerdestroyed", (worker) => {
      __privateGet(this, _workers5).delete(worker);
    });
  }, _requestInterception = new WeakMap(), _authInterception = new WeakMap(), toggleInterception_fn = async function(phases, interception, expected) {
    if (expected && !interception) {
      return await __privateGet(this, _frame6).browsingContext.addIntercept({
        phases
      });
    } else if (!expected && interception) {
      await __privateGet(this, _frame6).browsingContext.userContext.browser.removeIntercept(interception);
      return;
    }
    return interception;
  }, applyNetworkConditions_fn = async function() {
    if (!__privateGet(this, _emulatedNetworkConditions)) {
      return;
    }
    await this._client().send("Network.emulateNetworkConditions", {
      offline: __privateGet(this, _emulatedNetworkConditions).offline,
      latency: __privateGet(this, _emulatedNetworkConditions).latency,
      uploadThroughput: __privateGet(this, _emulatedNetworkConditions).upload,
      downloadThroughput: __privateGet(this, _emulatedNetworkConditions).download
    });
  }, go_fn = async function(delta, options) {
    const controller = new AbortController();
    try {
      const [response] = await Promise.all([
        this.waitForNavigation({
          ...options,
          signal: controller.signal
        }),
        __privateGet(this, _frame6).browsingContext.traverseHistory(delta)
      ]);
      return response;
    } catch (error) {
      controller.abort();
      throw error;
    }
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    _trustedEmitter_decorators = [index.bubble()];
    __esDecorate$4(_a3, null, _trustedEmitter_decorators, { kind: "accessor", name: "trustedEmitter", static: false, private: false, access: { has: (obj) => "trustedEmitter" in obj, get: (obj) => obj.trustedEmitter, set: (obj, value) => {
      obj.trustedEmitter = value;
    } }, metadata: _metadata }, _trustedEmitter_initializers, _trustedEmitter_extraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
function evaluationExpression(fun, ...args) {
  return `() => {${index.evaluationString(fun, ...args)}}`;
}
function testUrlMatchCookieHostname(cookie, normalizedUrl) {
  const cookieDomain = cookie.domain.toLowerCase();
  const urlHostname = normalizedUrl.hostname.toLowerCase();
  if (cookieDomain === urlHostname) {
    return true;
  }
  return cookieDomain.startsWith(".") && urlHostname.endsWith(cookieDomain);
}
function testUrlMatchCookiePath(cookie, normalizedUrl) {
  const uriPath = normalizedUrl.pathname;
  const cookiePath = cookie.path;
  if (uriPath === cookiePath) {
    return true;
  }
  if (uriPath.startsWith(cookiePath)) {
    if (cookiePath.endsWith("/")) {
      return true;
    }
    if (uriPath[cookiePath.length] === "/") {
      return true;
    }
  }
  return false;
}
function testUrlMatchCookie(cookie, url) {
  const normalizedUrl = new URL(url);
  index.assert(cookie !== void 0);
  if (!testUrlMatchCookieHostname(cookie, normalizedUrl)) {
    return false;
  }
  return testUrlMatchCookiePath(cookie, normalizedUrl);
}
function bidiToPuppeteerCookie(bidiCookie, returnCompositePartitionKey = false) {
  const partitionKey = bidiCookie[CDP_SPECIFIC_PREFIX + "partitionKey"];
  function getPartitionKey() {
    if (typeof partitionKey === "string") {
      return { partitionKey };
    }
    if (typeof partitionKey === "object" && partitionKey !== null) {
      if (returnCompositePartitionKey) {
        return {
          partitionKey: {
            sourceOrigin: partitionKey.topLevelSite,
            hasCrossSiteAncestor: partitionKey.hasCrossSiteAncestor ?? false
          }
        };
      }
      return {
        // TODO: a breaking change in Puppeteer is required to change
        // partitionKey type and report the composite partition key.
        partitionKey: partitionKey.topLevelSite
      };
    }
    return {};
  }
  return {
    name: bidiCookie.name,
    // Presents binary value as base64 string.
    value: bidiCookie.value.value,
    domain: bidiCookie.domain,
    path: bidiCookie.path,
    size: bidiCookie.size,
    httpOnly: bidiCookie.httpOnly,
    secure: bidiCookie.secure,
    sameSite: convertCookiesSameSiteBiDiToCdp(bidiCookie.sameSite),
    expires: bidiCookie.expiry ?? -1,
    session: bidiCookie.expiry === void 0 || bidiCookie.expiry <= 0,
    // Extending with CDP-specific properties with `goog:` prefix.
    ...cdpSpecificCookiePropertiesFromBidiToPuppeteer(bidiCookie, "sourceScheme", "partitionKeyOpaque", "priority"),
    ...getPartitionKey()
  };
}
const CDP_SPECIFIC_PREFIX = "goog:";
function cdpSpecificCookiePropertiesFromBidiToPuppeteer(bidiCookie, ...propertyNames) {
  const result = {};
  for (const property of propertyNames) {
    if (bidiCookie[CDP_SPECIFIC_PREFIX + property] !== void 0) {
      result[property] = bidiCookie[CDP_SPECIFIC_PREFIX + property];
    }
  }
  return result;
}
function cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookieParam, ...propertyNames) {
  const result = {};
  for (const property of propertyNames) {
    if (cookieParam[property] !== void 0) {
      result[CDP_SPECIFIC_PREFIX + property] = cookieParam[property];
    }
  }
  return result;
}
function convertCookiesSameSiteBiDiToCdp(sameSite) {
  switch (sameSite) {
    case "strict":
      return "Strict";
    case "lax":
      return "Lax";
    case "none":
      return "None";
    default:
      return "Default";
  }
}
function convertCookiesSameSiteCdpToBiDi(sameSite) {
  switch (sameSite) {
    case "Strict":
      return "strict";
    case "Lax":
      return "lax";
    case "None":
      return "none";
    default:
      return "default";
  }
}
function convertCookiesExpiryCdpToBiDi(expiry) {
  return [void 0, -1].includes(expiry) ? void 0 : expiry;
}
function convertCookiesPartitionKeyFromPuppeteerToBiDi(partitionKey) {
  if (partitionKey === void 0 || typeof partitionKey === "string") {
    return partitionKey;
  }
  if (partitionKey.hasCrossSiteAncestor) {
    throw new index.UnsupportedOperation("WebDriver BiDi does not support `hasCrossSiteAncestor` yet.");
  }
  return partitionKey.sourceOrigin;
}
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
class BidiBrowserTarget extends index.Target {
  constructor(browser, logger) {
    super(logger);
    __privateAdd(this, _browser);
    __privateSet(this, _browser, browser);
  }
  asPage() {
    throw new index.UnsupportedOperation();
  }
  url() {
    return "";
  }
  createCDPSession() {
    throw new index.UnsupportedOperation();
  }
  type() {
    return index.TargetType.BROWSER;
  }
  browser() {
    return __privateGet(this, _browser);
  }
  browserContext() {
    return __privateGet(this, _browser).defaultBrowserContext();
  }
  opener() {
    throw new index.UnsupportedOperation();
  }
}
_browser = new WeakMap();
class BidiPageTarget extends index.Target {
  constructor(page, logger) {
    super(logger);
    __privateAdd(this, _page5);
    __privateSet(this, _page5, page);
  }
  async page() {
    return __privateGet(this, _page5);
  }
  async asPage() {
    return await this.page();
  }
  url() {
    return __privateGet(this, _page5).url();
  }
  createCDPSession() {
    return __privateGet(this, _page5).createCDPSession();
  }
  type() {
    return index.TargetType.PAGE;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return __privateGet(this, _page5).browserContext();
  }
  opener() {
    throw new index.UnsupportedOperation();
  }
}
_page5 = new WeakMap();
class BidiFrameTarget extends index.Target {
  constructor(frame, logger) {
    super(logger);
    __privateAdd(this, _frame5);
    __privateAdd(this, _page6);
    __privateSet(this, _frame5, frame);
  }
  async page() {
    if (__privateGet(this, _page6) === void 0) {
      __privateSet(this, _page6, BidiPage.from(this.browserContext(), __privateGet(this, _frame5).browsingContext, this.logger));
    }
    return __privateGet(this, _page6);
  }
  async asPage() {
    return await this.page();
  }
  url() {
    return __privateGet(this, _frame5).url();
  }
  createCDPSession() {
    return __privateGet(this, _frame5).createCDPSession();
  }
  type() {
    return index.TargetType.PAGE;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return __privateGet(this, _frame5).page().browserContext();
  }
  opener() {
    throw new index.UnsupportedOperation();
  }
}
_frame5 = new WeakMap();
_page6 = new WeakMap();
class BidiWorkerTarget extends index.Target {
  constructor(worker, logger) {
    super(logger);
    __privateAdd(this, _worker2);
    __privateSet(this, _worker2, worker);
  }
  async page() {
    throw new index.UnsupportedOperation();
  }
  async asPage() {
    throw new index.UnsupportedOperation();
  }
  url() {
    return __privateGet(this, _worker2).url();
  }
  createCDPSession() {
    throw new index.UnsupportedOperation();
  }
  type() {
    return index.TargetType.OTHER;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return __privateGet(this, _worker2).frame.page().browserContext();
  }
  opener() {
    throw new index.UnsupportedOperation();
  }
}
_worker2 = new WeakMap();
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __esDecorate$3 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers$3 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __addDisposableResource$1 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources$1 = /* @__PURE__ */ function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
let BidiBrowserContext = (() => {
  var _trustedEmitter_accessor_storage, _browser2, _defaultViewport, _pages, _targets, _overrides, _logger21, _BidiBrowserContext_instances, initialize_fn7, createPage_fn, _a3;
  let _classSuper = index.BrowserContext;
  let _trustedEmitter_decorators;
  let _trustedEmitter_initializers = [];
  let _trustedEmitter_extraInitializers = [];
  return _a3 = class extends _classSuper {
    constructor(browser, userContext, options, logger) {
      super(logger);
      __privateAdd(this, _BidiBrowserContext_instances);
      __privateAdd(this, _trustedEmitter_accessor_storage, __runInitializers$3(this, _trustedEmitter_initializers, new index.EventEmitter()));
      __privateAdd(this, _browser2, __runInitializers$3(this, _trustedEmitter_extraInitializers));
      __privateAdd(this, _defaultViewport);
      // This is public because of cookies.
      __publicField(this, "userContext");
      __privateAdd(this, _pages, /* @__PURE__ */ new WeakMap());
      __privateAdd(this, _targets, /* @__PURE__ */ new Map());
      __privateAdd(this, _overrides, []);
      __privateAdd(this, _logger21);
      __privateSet(this, _browser2, browser);
      this.userContext = userContext;
      __privateSet(this, _defaultViewport, options.defaultViewport);
      __privateSet(this, _logger21, logger);
    }
    static from(browser, userContext, options, logger) {
      var _a4;
      const context = new _a3(browser, userContext, options, logger);
      __privateMethod(_a4 = context, _BidiBrowserContext_instances, initialize_fn7).call(_a4);
      return context;
    }
    get trustedEmitter() {
      return __privateGet(this, _trustedEmitter_accessor_storage);
    }
    set trustedEmitter(value) {
      __privateSet(this, _trustedEmitter_accessor_storage, value);
    }
    targets() {
      return [...__privateGet(this, _targets).values()].flatMap(([target, frames]) => {
        return [target, ...frames.values()];
      });
    }
    /**
     * @internal
     */
    getTargetForPage(page) {
      var _a4;
      return (_a4 = __privateGet(this, _targets).get(page)) == null ? void 0 : _a4[0];
    }
    async newPage(options) {
      var _a4, _b2, _c2, _d2;
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const _guard = __addDisposableResource$1(env_1, await this.waitForScreenshotOperations(), false);
        const type = (options == null ? void 0 : options.type) === "window" ? "window" : "tab";
        const context = await this.userContext.createBrowsingContext(type, {
          background: options == null ? void 0 : options.background
        });
        const page = __privateGet(this, _pages).get(context);
        if (!page) {
          throw new Error("Page is not found");
        }
        if (__privateGet(this, _defaultViewport)) {
          try {
            await page.setViewport(__privateGet(this, _defaultViewport));
          } catch (error) {
            (_b2 = (_a4 = __privateGet(this, _logger21)) == null ? void 0 : _a4.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
          }
        }
        if ((options == null ? void 0 : options.type) === "window" && (options == null ? void 0 : options.windowBounds) !== void 0) {
          try {
            await this.browser().setWindowBounds(context.windowId, options.windowBounds);
          } catch (error) {
            (_d2 = (_c2 = __privateGet(this, _logger21)) == null ? void 0 : _c2.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _d2(error);
          }
        }
        return page;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources$1(env_1);
      }
    }
    async close() {
      var _a4, _b2;
      index.assert(this.userContext.id !== UserContext.DEFAULT, "Default BrowserContext cannot be closed!");
      try {
        await this.userContext.remove();
      } catch (error) {
        (_b2 = (_a4 = __privateGet(this, _logger21)) == null ? void 0 : _a4.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
      }
      __privateGet(this, _targets).clear();
    }
    browser() {
      return __privateGet(this, _browser2);
    }
    async pages(_includeAll = false) {
      return [...this.userContext.browsingContexts].map((context) => {
        return __privateGet(this, _pages).get(context);
      });
    }
    async overridePermissions(origin, permissions) {
      const permissionsSet = new Set(permissions.map((permission) => {
        const protocolPermission = index.WEB_PERMISSION_TO_PROTOCOL_PERMISSION.get(permission);
        if (!protocolPermission) {
          throw new Error("Unknown permission: " + permission);
        }
        return permission;
      }));
      await Promise.all(Array.from(index.WEB_PERMISSION_TO_PROTOCOL_PERMISSION.keys()).map((permission) => {
        const result = this.userContext.setPermissions(
          origin,
          {
            name: permission
          },
          permissionsSet.has(permission) ? "granted" : "denied"
          /* Bidi.Permissions.PermissionState.Denied */
        );
        __privateGet(this, _overrides).push({ origin, permission });
        if (!permissionsSet.has(permission)) {
          return result.catch((error) => {
            var _a4, _b2;
            (_b2 = (_a4 = __privateGet(this, _logger21)) == null ? void 0 : _a4.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
          });
        }
        return result;
      }));
    }
    async setPermission(origin, ...permissions) {
      if (origin === "*") {
        throw new index.UnsupportedOperation("Origin (*) is not supported by WebDriver BiDi");
      }
      await Promise.all(permissions.map((permission) => {
        if (permission.permission.allowWithoutSanitization) {
          throw new index.UnsupportedOperation("allowWithoutSanitization is not supported by WebDriver BiDi");
        }
        if (permission.permission.panTiltZoom) {
          throw new index.UnsupportedOperation("panTiltZoom is not supported by WebDriver BiDi");
        }
        if (permission.permission.userVisibleOnly) {
          throw new index.UnsupportedOperation("userVisibleOnly is not supported by WebDriver BiDi");
        }
        return this.userContext.setPermissions(origin, {
          name: permission.permission.name
        }, permission.state);
      }));
    }
    async clearPermissionOverrides() {
      const promises = __privateGet(this, _overrides).map(({ permission, origin }) => {
        return this.userContext.setPermissions(
          origin,
          {
            name: permission
          },
          "prompt"
          /* Bidi.Permissions.PermissionState.Prompt */
        ).catch((error) => {
          var _a4, _b2;
          (_b2 = (_a4 = __privateGet(this, _logger21)) == null ? void 0 : _a4.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
        });
      });
      __privateSet(this, _overrides, []);
      await Promise.all(promises);
    }
    get id() {
      if (this.userContext.id === UserContext.DEFAULT) {
        return void 0;
      }
      return this.userContext.id;
    }
    async cookies() {
      const cookies = await this.userContext.getCookies();
      return cookies.map((cookie) => {
        return bidiToPuppeteerCookie(cookie, true);
      });
    }
    async setCookie(...cookies) {
      await Promise.all(cookies.map(async (cookie) => {
        const bidiCookie = {
          domain: cookie.domain,
          name: cookie.name,
          value: {
            type: "string",
            value: cookie.value
          },
          ...cookie.path !== void 0 ? { path: cookie.path } : {},
          ...cookie.httpOnly !== void 0 ? { httpOnly: cookie.httpOnly } : {},
          ...cookie.secure !== void 0 ? { secure: cookie.secure } : {},
          ...cookie.sameSite !== void 0 ? { sameSite: convertCookiesSameSiteCdpToBiDi(cookie.sameSite) } : {},
          ...{ expiry: convertCookiesExpiryCdpToBiDi(cookie.expires) },
          // Chrome-specific properties.
          ...cdpSpecificCookiePropertiesFromPuppeteerToBidi(cookie, "sourceScheme", "priority", "url")
        };
        return await this.userContext.setCookie(bidiCookie, convertCookiesPartitionKeyFromPuppeteerToBiDi(cookie.partitionKey));
      }));
    }
  }, _trustedEmitter_accessor_storage = new WeakMap(), _browser2 = new WeakMap(), _defaultViewport = new WeakMap(), _pages = new WeakMap(), _targets = new WeakMap(), _overrides = new WeakMap(), _logger21 = new WeakMap(), _BidiBrowserContext_instances = new WeakSet(), initialize_fn7 = function() {
    for (const browsingContext of this.userContext.browsingContexts) {
      __privateMethod(this, _BidiBrowserContext_instances, createPage_fn).call(this, browsingContext);
    }
    this.userContext.on("browsingcontext", (browsingContext) => {
      const page = __privateMethod(this, _BidiBrowserContext_instances, createPage_fn).call(this, browsingContext);
      if (browsingContext.originalOpener) {
        for (const context of this.userContext.browsingContexts) {
          if (context.id === browsingContext.originalOpener) {
            __privateGet(this, _pages).get(context).trustedEmitter.emit("popup", page);
          }
        }
      }
    });
    this.userContext.on("closed", () => {
      this.trustedEmitter.removeAllListeners();
    });
  }, createPage_fn = function(browsingContext) {
    const page = BidiPage.from(this, browsingContext, __privateGet(this, _logger21));
    __privateGet(this, _pages).set(browsingContext, page);
    page.trustedEmitter.on("close", () => {
      __privateGet(this, _pages).delete(browsingContext);
    });
    const pageTarget = new BidiPageTarget(page, __privateGet(this, _logger21));
    const pageTargets = /* @__PURE__ */ new Map();
    __privateGet(this, _targets).set(page, [pageTarget, pageTargets]);
    page.trustedEmitter.on("frameattached", (frame) => {
      const bidiFrame = frame;
      const target = new BidiFrameTarget(bidiFrame, __privateGet(this, _logger21));
      pageTargets.set(bidiFrame, target);
      this.trustedEmitter.emit("targetcreated", target);
    });
    page.trustedEmitter.on("framenavigated", (frame) => {
      const bidiFrame = frame;
      const target = pageTargets.get(bidiFrame);
      if (target === void 0) {
        this.trustedEmitter.emit("targetchanged", pageTarget);
      } else {
        this.trustedEmitter.emit("targetchanged", target);
      }
    });
    page.trustedEmitter.on("framedetached", (frame) => {
      const bidiFrame = frame;
      const target = pageTargets.get(bidiFrame);
      if (target === void 0) {
        return;
      }
      pageTargets.delete(bidiFrame);
      this.trustedEmitter.emit("targetdestroyed", target);
    });
    page.trustedEmitter.on("workercreated", (worker) => {
      const bidiWorker = worker;
      const target = new BidiWorkerTarget(bidiWorker, __privateGet(this, _logger21));
      pageTargets.set(bidiWorker, target);
      this.trustedEmitter.emit("targetcreated", target);
    });
    page.trustedEmitter.on("workerdestroyed", (worker) => {
      const bidiWorker = worker;
      const target = pageTargets.get(bidiWorker);
      if (target === void 0) {
        return;
      }
      pageTargets.delete(worker);
      this.trustedEmitter.emit("targetdestroyed", target);
    });
    page.trustedEmitter.on("close", () => {
      __privateGet(this, _targets).delete(page);
      this.trustedEmitter.emit("targetdestroyed", pageTarget);
    });
    this.trustedEmitter.emit("targetcreated", pageTarget);
    return page;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    _trustedEmitter_decorators = [index.bubble()];
    __esDecorate$3(_a3, null, _trustedEmitter_decorators, { kind: "accessor", name: "trustedEmitter", static: false, private: false, access: { has: (obj) => "trustedEmitter" in obj, get: (obj) => obj.trustedEmitter, set: (obj, value) => {
      obj.trustedEmitter = value;
    } }, metadata: _metadata }, _trustedEmitter_initializers, _trustedEmitter_extraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$2 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$2 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __addDisposableResource = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources = /* @__PURE__ */ function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
let Browser = (() => {
  var _closed3, _reason, _disposables2, _userContexts2, _sharedWorkers, _Browser_instances, initialize_fn7, syncUserContexts_fn, syncBrowsingContexts_fn, createUserContext_fn, _a3;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _dispose_decorators;
  let _close_decorators;
  let _addPreloadScript_decorators;
  let _removeIntercept_decorators;
  let _removePreloadScript_decorators;
  let _createUserContext_decorators;
  let _installExtension_decorators;
  let _uninstallExtension_decorators;
  let _setClientWindowState_decorators;
  let _getClientWindowInfo_decorators;
  return _a3 = class extends _classSuper {
    constructor(session) {
      super();
      __privateAdd(this, _Browser_instances);
      __privateAdd(this, _closed3, (__runInitializers$2(this, _instanceExtraInitializers), false));
      __privateAdd(this, _reason);
      __privateAdd(this, _disposables2, new index.DisposableStack());
      __privateAdd(this, _userContexts2, /* @__PURE__ */ new Map());
      __publicField(this, "session");
      __privateAdd(this, _sharedWorkers, /* @__PURE__ */ new Map());
      this.session = session;
    }
    static async from(session) {
      var _a4;
      const browser = new _a3(session);
      await __privateMethod(_a4 = browser, _Browser_instances, initialize_fn7).call(_a4);
      return browser;
    }
    get closed() {
      return __privateGet(this, _closed3);
    }
    get defaultUserContext() {
      return __privateGet(this, _userContexts2).get(UserContext.DEFAULT);
    }
    get disconnected() {
      return __privateGet(this, _reason) !== void 0;
    }
    get disposed() {
      return this.disconnected;
    }
    get userContexts() {
      return __privateGet(this, _userContexts2).values();
    }
    dispose(reason, closed = false) {
      __privateSet(this, _closed3, closed);
      __privateSet(this, _reason, reason);
      this[index.disposeSymbol]();
    }
    async close() {
      try {
        await this.session.send("browser.close", {});
      } finally {
        this.dispose("Browser already closed.", true);
      }
    }
    async addPreloadScript(functionDeclaration, options = {}) {
      var _a4;
      const { result: { script } } = await this.session.send("script.addPreloadScript", {
        functionDeclaration,
        ...options,
        contexts: (_a4 = options.contexts) == null ? void 0 : _a4.map((context) => {
          return context.id;
        })
      });
      return script;
    }
    async removeIntercept(intercept) {
      await this.session.send("network.removeIntercept", {
        intercept
      });
    }
    async removePreloadScript(script) {
      await this.session.send("script.removePreloadScript", {
        script
      });
    }
    async createUserContext(options) {
      var _a4, _b2, _c2;
      const proxyConfig = options.proxyServer === void 0 ? void 0 : {
        proxyType: "manual",
        httpProxy: options.proxyServer,
        sslProxy: options.proxyServer,
        noProxy: options.proxyBypassList
      };
      const { result: { userContext } } = await this.session.send("browser.createUserContext", {
        proxy: proxyConfig
      });
      if (((_a4 = options.downloadBehavior) == null ? void 0 : _a4.policy) === "allowAndName") {
        throw new index.UnsupportedOperation("`allowAndName` is not supported in WebDriver BiDi");
      }
      if (((_b2 = options.downloadBehavior) == null ? void 0 : _b2.policy) === "allow") {
        if (options.downloadBehavior.downloadPath === void 0) {
          throw new index.UnsupportedOperation("`downloadPath` is required in `allow` download behavior");
        }
        await this.session.send("browser.setDownloadBehavior", {
          downloadBehavior: {
            type: "allowed",
            destinationFolder: options.downloadBehavior.downloadPath
          },
          userContexts: [userContext]
        });
      }
      if (((_c2 = options.downloadBehavior) == null ? void 0 : _c2.policy) === "deny") {
        await this.session.send("browser.setDownloadBehavior", {
          downloadBehavior: { type: "denied" },
          userContexts: [userContext]
        });
      }
      return __privateMethod(this, _Browser_instances, createUserContext_fn).call(this, userContext);
    }
    async installExtension(path) {
      const { result: { extension } } = await this.session.send("webExtension.install", {
        extensionData: { type: "path", path }
      });
      return extension;
    }
    async uninstallExtension(id) {
      await this.session.send("webExtension.uninstall", { extension: id });
    }
    async setClientWindowState(params) {
      await this.session.send("browser.setClientWindowState", params);
    }
    async getClientWindowInfo(windowId) {
      const { result: { clientWindows } } = await this.session.send("browser.getClientWindows", {});
      const window2 = clientWindows.find((window3) => {
        return window3.clientWindow === windowId;
      });
      if (!window2) {
        throw new Error("Window not found");
      }
      return window2;
    }
    [(_dispose_decorators = [index.inertIfDisposed], _close_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _addPreloadScript_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _removeIntercept_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _removePreloadScript_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _createUserContext_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _installExtension_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _uninstallExtension_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _setClientWindowState_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], _getClientWindowInfo_decorators = [index.throwIfDisposed((browser) => {
      return __privateGet(browser, _reason);
    })], index.disposeSymbol)]() {
      __privateGet(this, _reason) ?? __privateSet(this, _reason, "Browser was disconnected, probably because the session ended.");
      if (this.closed) {
        this.emit("closed", __privateGet(this, _reason));
      }
      this.emit("disconnected", __privateGet(this, _reason));
      __privateGet(this, _disposables2).dispose();
      super[index.disposeSymbol]();
    }
  }, _closed3 = new WeakMap(), _reason = new WeakMap(), _disposables2 = new WeakMap(), _userContexts2 = new WeakMap(), _sharedWorkers = new WeakMap(), _Browser_instances = new WeakSet(), initialize_fn7 = async function() {
    const sessionEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(this.session));
    sessionEmitter.once("ended", (reason) => {
      this.dispose(reason);
    });
    sessionEmitter.on("script.realmCreated", (info) => {
      if (info.type !== "shared-worker") {
        return;
      }
      __privateGet(this, _sharedWorkers).set(info.realm, SharedWorkerRealm.from(this, info.realm, info.origin));
    });
    await __privateMethod(this, _Browser_instances, syncUserContexts_fn).call(this);
    await __privateMethod(this, _Browser_instances, syncBrowsingContexts_fn).call(this);
  }, syncUserContexts_fn = async function() {
    const { result: { userContexts } } = await this.session.send("browser.getUserContexts", {});
    for (const context of userContexts) {
      __privateMethod(this, _Browser_instances, createUserContext_fn).call(this, context.userContext);
    }
  }, syncBrowsingContexts_fn = async function() {
    const contextIds = /* @__PURE__ */ new Set();
    let contexts;
    {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const sessionEmitter = __addDisposableResource(env_1, new index.EventEmitter(this.session), false);
        sessionEmitter.on("browsingContext.contextCreated", (info) => {
          contextIds.add(info.context);
        });
        const { result } = await this.session.send("browsingContext.getTree", {});
        contexts = result.contexts;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources(env_1);
      }
    }
    for (const info of contexts) {
      if (!contextIds.has(info.context)) {
        this.session.emit("browsingContext.contextCreated", info);
      }
      if (info.children) {
        contexts.push(...info.children);
      }
    }
  }, createUserContext_fn = function(id) {
    const userContext = UserContext.create(this, id);
    __privateGet(this, _userContexts2).set(userContext.id, userContext);
    const userContextEmitter = __privateGet(this, _disposables2).use(new index.EventEmitter(userContext));
    userContextEmitter.once("closed", () => {
      userContextEmitter.removeAllListeners();
      __privateGet(this, _userContexts2).delete(userContext.id);
    });
    return userContext;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    __esDecorate$2(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: (obj) => "close" in obj, get: (obj) => obj.close }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _addPreloadScript_decorators, { kind: "method", name: "addPreloadScript", static: false, private: false, access: { has: (obj) => "addPreloadScript" in obj, get: (obj) => obj.addPreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _removeIntercept_decorators, { kind: "method", name: "removeIntercept", static: false, private: false, access: { has: (obj) => "removeIntercept" in obj, get: (obj) => obj.removeIntercept }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _removePreloadScript_decorators, { kind: "method", name: "removePreloadScript", static: false, private: false, access: { has: (obj) => "removePreloadScript" in obj, get: (obj) => obj.removePreloadScript }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _createUserContext_decorators, { kind: "method", name: "createUserContext", static: false, private: false, access: { has: (obj) => "createUserContext" in obj, get: (obj) => obj.createUserContext }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _installExtension_decorators, { kind: "method", name: "installExtension", static: false, private: false, access: { has: (obj) => "installExtension" in obj, get: (obj) => obj.installExtension }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _uninstallExtension_decorators, { kind: "method", name: "uninstallExtension", static: false, private: false, access: { has: (obj) => "uninstallExtension" in obj, get: (obj) => obj.uninstallExtension }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _setClientWindowState_decorators, { kind: "method", name: "setClientWindowState", static: false, private: false, access: { has: (obj) => "setClientWindowState" in obj, get: (obj) => obj.setClientWindowState }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$2(_a3, null, _getClientWindowInfo_decorators, { kind: "method", name: "getClientWindowInfo", static: false, private: false, access: { has: (obj) => "getClientWindowInfo" in obj, get: (obj) => obj.getClientWindowInfo }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __runInitializers$1 = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __esDecorate$1 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
let Session = (() => {
  var _reason, _disposables2, _info, _connection_accessor_storage, _Session_instances, initialize_fn7, _a3;
  let _classSuper = index.EventEmitter;
  let _instanceExtraInitializers = [];
  let _connection_decorators;
  let _connection_initializers = [];
  let _connection_extraInitializers = [];
  let _dispose_decorators;
  let _send_decorators;
  let _subscribe_decorators;
  let _addIntercepts_decorators;
  let _end_decorators;
  return _a3 = class extends _classSuper {
    constructor(connection, info) {
      super();
      __privateAdd(this, _Session_instances);
      __privateAdd(this, _reason, __runInitializers$1(this, _instanceExtraInitializers));
      __privateAdd(this, _disposables2, new index.DisposableStack());
      __privateAdd(this, _info);
      __publicField(this, "browser");
      __privateAdd(this, _connection_accessor_storage, __runInitializers$1(this, _connection_initializers, void 0));
      __runInitializers$1(this, _connection_extraInitializers);
      __privateSet(this, _info, info);
      this.connection = connection;
    }
    static async from(connection, capabilities) {
      var _a4;
      const { result } = await connection.send("session.new", {
        capabilities
      });
      const session = new _a3(connection, result);
      await __privateMethod(_a4 = session, _Session_instances, initialize_fn7).call(_a4);
      return session;
    }
    get connection() {
      return __privateGet(this, _connection_accessor_storage);
    }
    set connection(value) {
      __privateSet(this, _connection_accessor_storage, value);
    }
    get capabilities() {
      return __privateGet(this, _info).capabilities;
    }
    get disposed() {
      return this.ended;
    }
    get ended() {
      return __privateGet(this, _reason) !== void 0;
    }
    get id() {
      return __privateGet(this, _info).sessionId;
    }
    dispose(reason) {
      __privateSet(this, _reason, reason);
      this[index.disposeSymbol]();
    }
    /**
     * Currently, there is a 1:1 relationship between the session and the
     * session. In the future, we might support multiple sessions and in that
     * case we always needs to make sure that the session for the right session
     * object is used, so we implement this method here, although it's not defined
     * in the spec.
     */
    async send(method, params) {
      return await this.connection.send(method, params);
    }
    async subscribe(events, contexts) {
      await this.send("session.subscribe", {
        events,
        contexts
      });
    }
    async addIntercepts(events, contexts) {
      await this.send("session.subscribe", {
        events,
        contexts
      });
    }
    async end() {
      try {
        await this.send("session.end", {});
      } finally {
        this.dispose(`Session already ended.`);
      }
    }
    [(_connection_decorators = [index.bubble()], _dispose_decorators = [index.inertIfDisposed], _send_decorators = [index.throwIfDisposed((session) => {
      return __privateGet(session, _reason);
    })], _subscribe_decorators = [index.throwIfDisposed((session) => {
      return __privateGet(session, _reason);
    })], _addIntercepts_decorators = [index.throwIfDisposed((session) => {
      return __privateGet(session, _reason);
    })], _end_decorators = [index.throwIfDisposed((session) => {
      return __privateGet(session, _reason);
    })], index.disposeSymbol)]() {
      __privateGet(this, _reason) ?? __privateSet(this, _reason, "Session already destroyed, probably because the connection broke.");
      this.emit("ended", __privateGet(this, _reason));
      __privateGet(this, _disposables2).dispose();
      super[index.disposeSymbol]();
    }
  }, _reason = new WeakMap(), _disposables2 = new WeakMap(), _info = new WeakMap(), _connection_accessor_storage = new WeakMap(), _Session_instances = new WeakSet(), initialize_fn7 = async function() {
    this.browser = await Browser.from(this);
    const browserEmitter = __privateGet(this, _disposables2).use(this.browser);
    browserEmitter.once("closed", (reason) => {
      this.dispose(reason);
    });
    const seen = /* @__PURE__ */ new WeakSet();
    this.on("browsingContext.fragmentNavigated", (info) => {
      if (seen.has(info)) {
        return;
      }
      seen.add(info);
      this.emit("browsingContext.navigationStarted", info);
      this.emit("browsingContext.fragmentNavigated", info);
    });
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    __esDecorate$1(_a3, null, _connection_decorators, { kind: "accessor", name: "connection", static: false, private: false, access: { has: (obj) => "connection" in obj, get: (obj) => obj.connection, set: (obj, value) => {
      obj.connection = value;
    } }, metadata: _metadata }, _connection_initializers, _connection_extraInitializers);
    __esDecorate$1(_a3, null, _dispose_decorators, { kind: "method", name: "dispose", static: false, private: false, access: { has: (obj) => "dispose" in obj, get: (obj) => obj.dispose }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$1(_a3, null, _send_decorators, { kind: "method", name: "send", static: false, private: false, access: { has: (obj) => "send" in obj, get: (obj) => obj.send }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$1(_a3, null, _subscribe_decorators, { kind: "method", name: "subscribe", static: false, private: false, access: { has: (obj) => "subscribe" in obj, get: (obj) => obj.subscribe }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$1(_a3, null, _addIntercepts_decorators, { kind: "method", name: "addIntercepts", static: false, private: false, access: { has: (obj) => "addIntercepts" in obj, get: (obj) => obj.addIntercepts }, metadata: _metadata }, null, _instanceExtraInitializers);
    __esDecorate$1(_a3, null, _end_decorators, { kind: "method", name: "end", static: false, private: false, access: { has: (obj) => "end" in obj, get: (obj) => obj.end }, metadata: _metadata }, null, _instanceExtraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), _a3;
})();
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};
var __runInitializers = function(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};
var __setFunctionName = function(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
let BidiBrowser = (() => {
  var _a3, _trustedEmitter_accessor_storage, _BidiBrowser_instances, trustedEmitter_get, trustedEmitter_set, _process, _closeCallback, _browserCore, _defaultViewport, _browserContexts, _target, _cdpConnection3, _networkEnabled, _issuesEnabled, _logger21, initialize_fn7, browserName_get, browserVersion_get, createBrowserContext_fn;
  let _classSuper = index.Browser$1;
  let _private_trustedEmitter_decorators;
  let _private_trustedEmitter_initializers = [];
  let _private_trustedEmitter_extraInitializers = [];
  let _private_trustedEmitter_descriptor;
  return _a3 = class extends _classSuper {
    constructor(browserCore, opts, logger) {
      super(logger);
      __privateAdd(this, _BidiBrowser_instances);
      __publicField(this, "protocol", "webDriverBiDi");
      __privateAdd(this, _trustedEmitter_accessor_storage, __runInitializers(this, _private_trustedEmitter_initializers, new index.EventEmitter()));
      __privateAdd(this, _process, __runInitializers(this, _private_trustedEmitter_extraInitializers));
      __privateAdd(this, _closeCallback);
      __privateAdd(this, _browserCore);
      __privateAdd(this, _defaultViewport);
      __privateAdd(this, _browserContexts, /* @__PURE__ */ new WeakMap());
      __privateAdd(this, _target);
      __privateAdd(this, _cdpConnection3);
      __privateAdd(this, _networkEnabled);
      __privateAdd(this, _issuesEnabled);
      __privateAdd(this, _logger21);
      __privateSet(this, _process, opts.process);
      __privateSet(this, _closeCallback, opts.closeCallback);
      __privateSet(this, _browserCore, browserCore);
      __privateSet(this, _defaultViewport, opts.defaultViewport);
      __privateSet(this, _cdpConnection3, opts.cdpConnection);
      __privateSet(this, _networkEnabled, opts.networkEnabled);
      __privateSet(this, _issuesEnabled, opts.issuesEnabled);
      __privateSet(this, _logger21, logger);
      __privateSet(this, _target, new BidiBrowserTarget(this, logger));
    }
    static async create(opts) {
      var _a4, _b2, _c2;
      const session = await Session.from(opts.connection, {
        firstMatch: (_a4 = opts.capabilities) == null ? void 0 : _a4.firstMatch,
        alwaysMatch: {
          ...(_b2 = opts.capabilities) == null ? void 0 : _b2.alwaysMatch,
          // Capabilities that come from Puppeteer's API take precedence.
          acceptInsecureCerts: opts.acceptInsecureCerts,
          unhandledPromptBehavior: {
            default: "ignore"
          },
          webSocketUrl: true,
          // Puppeteer with WebDriver BiDi does not support prerendering
          // yet because WebDriver BiDi behavior is not specified. See
          // https://github.com/w3c/webdriver-bidi/issues/321.
          "goog:prerenderingDisabled": true,
          // TODO: remove after Puppeteer rolled Chrome to 142 after Oct 28, 2025.
          "goog:disableNetworkDurableMessages": true
        }
      });
      await session.subscribe((opts.cdpConnection ? [..._a3.subscribeModules, ..._a3.subscribeCdpEvents] : _a3.subscribeModules).filter((module2) => {
        if (!opts.networkEnabled) {
          return module2 !== "network" && module2 !== "goog:cdp.Network.requestWillBeSent";
        }
        return true;
      }));
      await Promise.all([
        "request",
        "response"
        /* Bidi.Network.DataType.Response */
      ].map(
        // Data collectors might be not implemented for specific data type, so create them
        // separately and ignore protocol errors.
        async (dataType) => {
          var _a5, _b3;
          try {
            await session.send("network.addDataCollector", {
              dataTypes: [dataType],
              // Buffer size of 20 MB is equivalent to the CDP:
              maxEncodedDataSize: 2e7
            });
          } catch (err) {
            if (err instanceof index.ProtocolError) {
              (_b3 = (_a5 = opts.logger) == null ? void 0 : _a5.call(opts, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b3(err);
            } else {
              throw err;
            }
          }
        }
      ));
      const browser = new _a3(session.browser, opts, opts.logger);
      __privateMethod(_c2 = browser, _BidiBrowser_instances, initialize_fn7).call(_c2);
      return browser;
    }
    get cdpSupported() {
      return __privateGet(this, _cdpConnection3) !== void 0;
    }
    get cdpConnection() {
      return __privateGet(this, _cdpConnection3);
    }
    async userAgent() {
      return __privateGet(this, _browserCore).session.capabilities.userAgent;
    }
    get connection() {
      return __privateGet(this, _browserCore).session.connection;
    }
    wsEndpoint() {
      return this.connection.url;
    }
    async close() {
      var _a4, _b2, _c2;
      if (this.connection.closed) {
        return;
      }
      try {
        await __privateGet(this, _browserCore).close();
        await ((_a4 = __privateGet(this, _closeCallback)) == null ? void 0 : _a4.call(null));
      } catch (error) {
        (_c2 = (_b2 = __privateGet(this, _logger21)) == null ? void 0 : _b2.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _c2(error);
      } finally {
        this.connection.dispose();
      }
    }
    get connected() {
      return !__privateGet(this, _browserCore).disconnected;
    }
    process() {
      return __privateGet(this, _process) ?? null;
    }
    async createBrowserContext(options = {}) {
      const userContext = await __privateGet(this, _browserCore).createUserContext(options);
      return __privateMethod(this, _BidiBrowser_instances, createBrowserContext_fn).call(this, userContext);
    }
    async version() {
      return `${__privateGet(this, _BidiBrowser_instances, browserName_get)}/${__privateGet(this, _BidiBrowser_instances, browserVersion_get)}`;
    }
    browserContexts() {
      return [...__privateGet(this, _browserCore).userContexts].map((context) => {
        return __privateGet(this, _browserContexts).get(context);
      });
    }
    defaultBrowserContext() {
      return __privateGet(this, _browserContexts).get(__privateGet(this, _browserCore).defaultUserContext);
    }
    newPage(options) {
      return this.defaultBrowserContext().newPage(options);
    }
    installExtension(path) {
      return __privateGet(this, _browserCore).installExtension(path);
    }
    async uninstallExtension(id) {
      await __privateGet(this, _browserCore).uninstallExtension(id);
    }
    installPWA() {
      throw new index.UnsupportedOperation();
    }
    uninstallPWA() {
      throw new index.UnsupportedOperation();
    }
    launchPWA() {
      throw new index.UnsupportedOperation();
    }
    getPWAState() {
      throw new index.UnsupportedOperation();
    }
    screens() {
      throw new index.UnsupportedOperation();
    }
    addScreen(_params) {
      throw new index.UnsupportedOperation();
    }
    removeScreen(_screenId) {
      throw new index.UnsupportedOperation();
    }
    async getWindowBounds(windowId) {
      const clientWindowInfo = await __privateGet(this, _browserCore).getClientWindowInfo(windowId);
      return {
        left: clientWindowInfo.x,
        top: clientWindowInfo.y,
        width: clientWindowInfo.width,
        height: clientWindowInfo.height,
        windowState: clientWindowInfo.state
      };
    }
    async setWindowBounds(windowId, windowBounds) {
      let params;
      const windowState = windowBounds.windowState ?? "normal";
      if (windowState === "normal") {
        params = {
          clientWindow: windowId,
          state: "normal",
          x: windowBounds.left,
          y: windowBounds.top,
          width: windowBounds.width,
          height: windowBounds.height
        };
      } else {
        params = {
          clientWindow: windowId,
          state: windowState
        };
      }
      await __privateGet(this, _browserCore).setClientWindowState(params);
    }
    targets() {
      return [
        __privateGet(this, _target),
        ...this.browserContexts().flatMap((context) => {
          return context.targets();
        })
      ];
    }
    target() {
      return __privateGet(this, _target);
    }
    async disconnect() {
      var _a4, _b2;
      try {
        await __privateGet(this, _browserCore).session.end();
      } catch (error) {
        (_b2 = (_a4 = __privateGet(this, _logger21)) == null ? void 0 : _a4.call(this, index.DEBUG_PREFIXES.error)) == null ? void 0 : _b2(error);
      } finally {
        this.connection.dispose();
      }
    }
    get debugInfo() {
      return {
        pendingProtocolErrors: this.connection.getPendingProtocolErrors()
      };
    }
    isNetworkEnabled() {
      return __privateGet(this, _networkEnabled);
    }
    extensions() {
      throw new index.UnsupportedOperation();
    }
    isIssuesEnabled() {
      return __privateGet(this, _issuesEnabled);
    }
  }, _trustedEmitter_accessor_storage = new WeakMap(), _BidiBrowser_instances = new WeakSet(), trustedEmitter_get = function() {
    return _private_trustedEmitter_descriptor.get.call(this);
  }, trustedEmitter_set = function(value) {
    return _private_trustedEmitter_descriptor.set.call(this, value);
  }, _process = new WeakMap(), _closeCallback = new WeakMap(), _browserCore = new WeakMap(), _defaultViewport = new WeakMap(), _browserContexts = new WeakMap(), _target = new WeakMap(), _cdpConnection3 = new WeakMap(), _networkEnabled = new WeakMap(), _issuesEnabled = new WeakMap(), _logger21 = new WeakMap(), initialize_fn7 = function() {
    var _a4;
    for (const userContext of __privateGet(this, _browserCore).userContexts) {
      __privateMethod(this, _BidiBrowser_instances, createBrowserContext_fn).call(this, userContext);
    }
    __privateGet(this, _browserCore).once("disconnected", () => {
      __privateGet(this, _BidiBrowser_instances, trustedEmitter_get).emit("disconnected", void 0);
      __privateGet(this, _BidiBrowser_instances, trustedEmitter_get).removeAllListeners();
    });
    (_a4 = __privateGet(this, _process)) == null ? void 0 : _a4.once("close", () => {
      __privateGet(this, _browserCore).dispose("Browser process exited.", true);
      this.connection.dispose();
    });
  }, browserName_get = function() {
    return __privateGet(this, _browserCore).session.capabilities.browserName;
  }, browserVersion_get = function() {
    return __privateGet(this, _browserCore).session.capabilities.browserVersion;
  }, createBrowserContext_fn = function(userContext) {
    const browserContext = BidiBrowserContext.from(this, userContext, {
      defaultViewport: __privateGet(this, _defaultViewport)
    }, __privateGet(this, _logger21));
    __privateGet(this, _browserContexts).set(userContext, browserContext);
    browserContext.trustedEmitter.on("targetcreated", (target) => {
      __privateGet(this, _BidiBrowser_instances, trustedEmitter_get).emit("targetcreated", target);
    });
    browserContext.trustedEmitter.on("targetchanged", (target) => {
      __privateGet(this, _BidiBrowser_instances, trustedEmitter_get).emit("targetchanged", target);
    });
    browserContext.trustedEmitter.on("targetdestroyed", (target) => {
      __privateGet(this, _BidiBrowser_instances, trustedEmitter_get).emit("targetdestroyed", target);
    });
    return browserContext;
  }, (() => {
    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
    _private_trustedEmitter_decorators = [index.bubble()];
    __esDecorate(_a3, _private_trustedEmitter_descriptor = { get: __setFunctionName(function() {
      return __privateGet(this, _trustedEmitter_accessor_storage);
    }, "#trustedEmitter", "get"), set: __setFunctionName(function(value) {
      __privateSet(this, _trustedEmitter_accessor_storage, value);
    }, "#trustedEmitter", "set") }, _private_trustedEmitter_decorators, { kind: "accessor", name: "#trustedEmitter", static: false, private: true, access: { has: (obj) => __privateIn(_BidiBrowser_instances, obj), get: (obj) => __privateGet(obj, _BidiBrowser_instances, trustedEmitter_get), set: (obj, value) => {
      __privateSet(obj, _BidiBrowser_instances, value, trustedEmitter_set);
    } }, metadata: _metadata }, _private_trustedEmitter_initializers, _private_trustedEmitter_extraInitializers);
    if (_metadata) Object.defineProperty(_a3, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
  })(), __publicField(_a3, "subscribeModules", [
    "browsingContext",
    "network",
    "log",
    "script",
    "input"
  ]), __publicField(_a3, "subscribeCdpEvents", [
    // Coverage
    "goog:cdp.Debugger.scriptParsed",
    "goog:cdp.CSS.styleSheetAdded",
    "goog:cdp.Runtime.executionContextsCleared",
    // Tracing
    "goog:cdp.Tracing.tracingComplete",
    // TODO: subscribe to all CDP events in the future.
    "goog:cdp.Network.requestWillBeSent",
    "goog:cdp.Debugger.scriptParsed",
    "goog:cdp.Page.screencastFrame"
  ]), _a3;
})();
exports.BidiBrowser = BidiBrowser;
exports.BidiBrowserContext = BidiBrowserContext;
exports.BidiConnection = BidiConnection;
exports.BidiElementHandle = BidiElementHandle;
exports.BidiFrame = BidiFrame;
exports.BidiFrameRealm = BidiFrameRealm;
exports.BidiHTTPRequest = BidiHTTPRequest;
exports.BidiHTTPResponse = BidiHTTPResponse;
exports.BidiJSHandle = BidiJSHandle;
exports.BidiKeyboard = BidiKeyboard;
exports.BidiMouse = BidiMouse;
exports.BidiPage = BidiPage;
exports.BidiRealm = BidiRealm;
exports.BidiTouchscreen = BidiTouchscreen;
exports.BidiWorkerRealm = BidiWorkerRealm;
exports.bidiToPuppeteerCookie = bidiToPuppeteerCookie;
exports.cdpSpecificCookiePropertiesFromPuppeteerToBidi = cdpSpecificCookiePropertiesFromPuppeteerToBidi;
exports.connectBidiOverCdp = connectBidiOverCdp;
exports.convertCookiesExpiryCdpToBiDi = convertCookiesExpiryCdpToBiDi;
exports.convertCookiesPartitionKeyFromPuppeteerToBiDi = convertCookiesPartitionKeyFromPuppeteerToBiDi;
exports.convertCookiesSameSiteCdpToBiDi = convertCookiesSameSiteCdpToBiDi;
exports.requests = requests;
