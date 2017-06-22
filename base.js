/*! IQIYI webnative  2016-04-29 */
__DEV__ = !1;
var _Global = this, _Global_cmd;
_Global.__batchDidComplete = [],
console = {},
console.log = console.warn = console.info = function() {}
,
console.error = function(msg, flag) {
    RCTUIManager.JsError((flag || "^^^^^^^^ ") + msg)
}
,
function(global) {
    function _debugUnresolvedDependencies(names) {
        for (var ii, name, module, dependency, unresolved = Array.prototype.slice.call(names), visited = {}; unresolved.length; )
            if (name = unresolved.shift(),
            !visited[name] && (visited[name] = !0,
            module = modulesMap[name],
            module && module.waiting))
                for (ii = 0; ii < module.dependencies.length; ii++)
                    dependency = module.dependencies[ii],
                    (!modulesMap[dependency] || modulesMap[dependency].waiting) && unresolved.push(dependency);
        for (name in visited)
            hop.call(visited, name) && unresolved.push(name);
        var messages = [];
        for (ii = 0; ii < unresolved.length; ii++) {
            name = unresolved[ii];
            var message = name;
            if (module = modulesMap[name])
                if (module.waiting) {
                    for (var unresolvedDependencies = [], jj = 0; jj < module.dependencies.length; jj++)
                        dependency = module.dependencies[jj],
                        (!modulesMap[dependency] || modulesMap[dependency].waiting) && unresolvedDependencies.push(dependency);
                    message += " is waiting for " + unresolvedDependencies.join(", ")
                } else
                    message += " is ready";
            else
                message += " is not defined";
            messages.push(message)
        }
        return messages.join("\n")
    }
    function ModuleError(msg) {
        this.name = "ModuleError",
        this.message = msg,
        this.stack = Error(msg).stack,
        this.framesToPop = 2
    }
    function require(id) {
        var dep, i, msg, module = modulesMap[id];
        if (module && module.exports)
            return 1 === module.refcount-- && delete modulesMap[id],
            module.exports;
        if (global.ErrorUtils && !global.ErrorUtils.inGuard())
            return ErrorUtils.applyWithGuard(require, this, arguments);
        if (!module)
            throw msg = 'Requiring unknown module "' + id + '"',
            __DEV__ && (msg += ". If you are sure the module is there, try restarting the packager."),
            new ModuleError(msg);
        if (module.hasError)
            throw new ModuleError('Requiring module "' + id + '" which threw an exception');
        if (module.waiting)
            throw new ModuleError('Requiring module "' + id + '" with unresolved dependencies: ' + _debugUnresolvedDependencies([id]));
        var exports = module.exports = {}
          , factory = module.factory;
        if ("[object Function]" === toString.call(factory)) {
            var ret, args = [], dependencies = module.dependencies, length = dependencies.length;
            module.special & USED_AS_TRANSPORT && (length = Math.min(length, factory.length));
            try {
                for (i = 0; args.length < length; i++)
                    dep = dependencies[i],
                    module.inlineRequires[dep] || args.push("module" === dep ? module : "exports" === dep ? exports : require.call(null , dep));
                ++_totalFactories,
                0 === _factoryStackCount++ && (_factoryTime -= _now());
                try {
                    ret = factory.apply(module.context || global, args)
                } catch (e) {
                    if (modulesMap.ex && modulesMap.erx) {
                        var ex = require.call(null , "ex")
                          , erx = require.call(null , "erx")
                          , messageWithParams = erx(e.message);
                        messageWithParams[0].indexOf(' from module "%s"') < 0 && (messageWithParams[0] += ' from module "%s"',
                        messageWithParams[messageWithParams.length] = id)
                    }
                    throw e
                } finally {
                    0 === --_factoryStackCount && (_factoryTime += _now())
                }
            } catch (e) {
                throw module.hasError = !0,
                module.exports = null ,
                e.message = ex.apply(null , messageWithParams),
                e
            }
            ret && (module.exports = ret)
        } else
            module.exports = factory;
        return 1 === module.refcount-- && delete modulesMap[id],
        module.exports
    }
    function define(id, dependencies, factory, _special, _context, _refCount, _inlineRequires) {
        void 0 === dependencies ? (dependencies = [],
        factory = id,
        id = _uid()) : void 0 === factory && (factory = dependencies,
        "[object Array]" === toString.call(id) ? (dependencies = id,
        id = _uid()) : dependencies = []);
        var canceler = {
            cancel: _undefine.bind(this, id)
        }
          , record = modulesMap[id];
        if (record)
            return _refCount && (record.refcount += _refCount),
            canceler;
        if (!dependencies && !factory && _refCount)
            return predefinedRefCounts[id] = (predefinedRefCounts[id] || 0) + _refCount,
            canceler;
        if (record = {
            id: id
        },
        record.refcount = (predefinedRefCounts[id] || 0) + (_refCount || 0),
        delete predefinedRefCounts[id],
        __DEV__) {
            if (!factory || "object" != typeof factory && "function" != typeof factory && "string" != typeof factory)
                throw new ModuleError('Invalid factory "' + factory + '" for module "' + id + '". Factory should be either a function or an object.');
            if ("[object Array]" !== toString.call(dependencies))
                throw new ModuleError('Invalid dependencies for module "' + id + '". Dependencies must be passed as an array.')
        }
        return record.factory = factory,
        record.dependencies = dependencies,
        record.context = _context,
        record.special = _special,
        record.inlineRequires = _inlineRequires || {},
        record.waitingMap = {},
        record.waiting = 0,
        record.hasError = !1,
        modulesMap[id] = record,
        _initDependencies(id),
        canceler
    }
    function _undefine(id) {
        if (modulesMap[id]) {
            var module = modulesMap[id];
            delete modulesMap[id];
            for (var dep in module.waitingMap)
                module.waitingMap[dep] && delete dependencyMap[dep][id];
            for (var ii = 0; ii < module.dependencies.length; ii++)
                dep = module.dependencies[ii],
                modulesMap[dep] ? 1 === modulesMap[dep].refcount-- && _undefine(dep) : predefinedRefCounts[dep] && predefinedRefCounts[dep]--
        }
    }
    function requireLazy(dependencies, factory, context) {
        return define(dependencies, factory, void 0, REQUIRE_WHEN_READY, context, 1)
    }
    function _uid() {
        return "__mod__" + _counter++
    }
    function _addDependency(module, dep) {
        module.waitingMap[dep] || module.id === dep || (module.waiting++,
        module.waitingMap[dep] = 1,
        dependencyMap[dep] || (dependencyMap[dep] = {}),
        dependencyMap[dep][module.id] = 1)
    }
    function _initDependencies(id) {
        var dep, i, subdep, modulesToRequire = [], module = modulesMap[id];
        for (i = 0; i < module.dependencies.length; i++)
            if (dep = module.dependencies[i],
            modulesMap[dep]) {
                if (modulesMap[dep].waiting)
                    for (subdep in modulesMap[dep].waitingMap)
                        modulesMap[dep].waitingMap[subdep] && _addDependency(module, subdep)
            } else
                _addDependency(module, dep);
        if (0 === module.waiting && module.special & REQUIRE_WHEN_READY && modulesToRequire.push(id),
        dependencyMap[id]) {
            var submodule, deps = dependencyMap[id];
            dependencyMap[id] = void 0;
            for (dep in deps) {
                submodule = modulesMap[dep];
                for (subdep in module.waitingMap)
                    module.waitingMap[subdep] && _addDependency(submodule, subdep);
                submodule.waitingMap[id] && (submodule.waitingMap[id] = void 0,
                submodule.waiting--),
                0 === submodule.waiting && submodule.special & REQUIRE_WHEN_READY && modulesToRequire.push(dep)
            }
        }
        for (i = 0; i < modulesToRequire.length; i++)
            require.call(null , modulesToRequire[i])
    }
    function _register(id, exports) {
        var module = modulesMap[id] = {
            id: id
        };
        module.exports = exports,
        module.refcount = 0
    }
    if (!global.require) {
        var __DEV__ = global.__DEV__
          , toString = Object.prototype.toString
          , modulesMap = {}
          , dependencyMap = {}
          , predefinedRefCounts = {}
          , _counter = 0
          , REQUIRE_WHEN_READY = 1
          , USED_AS_TRANSPORT = 2
          , hop = Object.prototype.hasOwnProperty;
        ModuleError.prototype = Object.create(Error.prototype),
        ModuleError.prototype.constructor = ModuleError;
        var _performance = global.performance || global.msPerformance || global.webkitPerformance || {};
        _performance.now || (_performance = global.Date);
        var _now = _performance ? _performance.now.bind(_performance) : function() {
            return 0
        }
          , _factoryStackCount = 0
          , _factoryTime = 0
          , _totalFactories = 0;
        require.__getFactoryTime = function() {
            return (_factoryStackCount ? _now() : 0) + _factoryTime
        }
        ,
        require.__getTotalFactories = function() {
            return _totalFactories
        }
        ,
        _register("module", 0),
        _register("exports", 0),
        _register("global", global),
        _register("require", require),
        _register("requireDynamic", require),
        _register("requireLazy", requireLazy),
        global.require = require,
        global.requireDynamic = require,
        global.requireLazy = requireLazy,
        require.__debug = {
            modules: modulesMap,
            deps: dependencyMap,
            printDependencyInfo: function() {
                if (global.console) {
                    var names = Object.keys(require.__debug.deps);
                    global.console.log(_debugUnresolvedDependencies(names))
                }
            }
        },
        global.__d = function(id, deps, factory, _special, _inlineRequires) {
            var defaultDeps = ["global", "require", "requireDynamic", "requireLazy", "module", "exports"];
            define(id, defaultDeps.concat(deps), factory, _special || USED_AS_TRANSPORT, null , null , _inlineRequires)
        }
    }
}(this),
Object.assign = function(target, sources) {
    for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
        var nextSource = arguments[nextIndex];
        if (null  != nextSource)
            for (var key in nextSource)
                target[key] = nextSource[key]
    }
    return target
}
,
function(global) {
    "use strict";
    function setupConsole(global) {
        if (global.nativeLoggingHook)
            ;
    }
    "undefined" != typeof module ? module.exports = setupConsole : setupConsole(global)
}(this),
function(global) {
    function setupErrorGuard() {
        var onError = function(e) {
            global.console.error("Error: \n stack: " + e.stack.replace(/\n/g, "") + "\n line: " + e.line + "\n message: " + e.message, e)
        }
        ;
        global.ErrorUtils.setGlobalHandler(onError)
    }
    var ErrorUtils = {
        _inGuard: 0,
        _globalHandler: null ,
        setGlobalHandler: function(fun) {
            ErrorUtils._globalHandler = fun
        },
        reportError: function(error) {
            console.error(error + " ...")
        },
        reportFatalError: function(error) {
            console.error(error + " - - -"),
            console.error(error.stack.replace(/\n/g, ""))
        },
        applyWithGuard: function(fun, context, args) {
            try {
                return ErrorUtils._inGuard++,
                fun.apply(context, args)
            } catch (e) {
                ErrorUtils.reportError(e)
            } finally {
                ErrorUtils._inGuard--
            }
        },
        applyWithGuardIfNeeded: function(fun, context, args) {
            return ErrorUtils.inGuard() ? fun.apply(context, args) : void ErrorUtils.applyWithGuard(fun, context, args)
        },
        inGuard: function() {
            return ErrorUtils._inGuard
        },
        guard: function(fun, name, context) {
            function guarded() {
                return ErrorUtils.applyWithGuard(fun, context || this, arguments, null , name)
            }
            return "function" != typeof fun ? (console.warn("A function must be passed to ErrorUtils.guard, got ", fun),
            null ) : (name = name || fun.name || "<generated guard>",
            guarded)
        }
    };
    global.ErrorUtils = ErrorUtils,
    setupErrorGuard()
}(this),
String.prototype.startsWith || (String.prototype.startsWith = function(search) {
    "use strict";
    if (null  == this)
        throw TypeError();
    var string = String(this)
      , pos = arguments.length > 1 ? Number(arguments[1]) || 0 : 0
      , start = Math.min(Math.max(pos, 0), string.length);
    return string.indexOf(String(search), pos) === start
}
),
String.prototype.endsWith || (String.prototype.endsWith = function(search) {
    "use strict";
    if (null  == this)
        throw TypeError();
    var string = String(this)
      , stringLength = string.length
      , searchString = String(search)
      , pos = arguments.length > 1 ? Number(arguments[1]) || 0 : stringLength
      , end = Math.min(Math.max(pos, 0), stringLength)
      , start = end - searchString.length;
    return 0 > start ? !1 : string.lastIndexOf(searchString, start) === start
}
),
String.prototype.contains || (String.prototype.contains = function(search) {
    "use strict";
    if (null  == this)
        throw TypeError();
    var string = String(this)
      , pos = arguments.length > 1 ? Number(arguments[1]) || 0 : 0;
    return -1 !== string.indexOf(String(search), pos)
}
),
String.prototype.repeat || (String.prototype.repeat = function(count) {
    "use strict";
    if (null  == this)
        throw TypeError();
    var string = String(this);
    if (count = Number(count) || 0,
    0 > count || count === 1 / 0)
        throw RangeError();
    if (1 === count)
        return string;
    for (var result = ""; count; )
        1 & count && (result += string),
        (count >>= 1) && (string += string);
    return result
}
),
function(undefined) {
    function findIndex(predicate, context) {
        if (null  == this)
            throw new TypeError("Array.prototype.findIndex called on null or undefined");
        if ("function" != typeof predicate)
            throw new TypeError("predicate must be a function");
        for (var list = Object(this), length = list.length >>> 0, i = 0; length > i; i++)
            if (predicate.call(context, list[i], i, list))
                return i;
        return -1
    }
    Array.prototype.findIndex || Object.defineProperty(Array.prototype, "findIndex", {
        enumerable: !1,
        writable: !0,
        configurable: !0,
        value: findIndex
    }),
    Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
        enumerable: !1,
        writable: !0,
        configurable: !0,
        value: function(predicate, context) {
            if (null  == this)
                throw new TypeError("Array.prototype.find called on null or undefined");
            var index = findIndex.call(this, predicate, context);
            return -1 === index ? undefined : this[index]
        }
    })
}(),
function(GLOBAL) {
    function getInvalidGlobalUseError(name) {
        return new Error("You are trying to render the global " + name + " variable as a React element. You probably forgot to require " + name + ".")
    }
    GLOBAL.Text = {
        get defaultProps() {
            throw getInvalidGlobalUseError("Text")
        }
    },
    GLOBAL.Image = {
        get defaultProps() {
            throw getInvalidGlobalUseError("Image")
        }
    },
    GLOBAL.document && (GLOBAL.document.createElement = null ),
    GLOBAL.MutationObserver = void 0
}(this),
__d("events", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var cache = {}
      , _once = {};
    module.exports = {
        on: function(type, fn) {
            cache[type] = cache[type] || [],
            cache[type].push(fn)
        },
        once: function(type, fn) {
            _once[type] = fn
        },
        off: function(type, fn) {
            fn ? (cache[type] = (cache[type] || []).filter(function(v) {
                return v != fn;
            })) : (cache[type] = [],
            _once[type] = null );
        },
        fire: function(type, data) {
            var arg = arguments;
            (cache[type] || []).forEach(function(v) {
                v.apply(global, Array.prototype.slice.call(arg, 1))
            }),
            "function" == typeof _once[type] && (_once[type].apply(global, Array.prototype.slice.call(arguments, 1)), delete _once[type])
        }
    }
}),
__d("callNativeRender", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var _native_call_flag, Events = require("events"), _native_call_array = [], exp = {
        cache: [],
        call: function(cmd, flag) {
            "now" == flag ? RCTUIManager.batchDidComplete(JSON.stringify([cmd])) : (clearTimeout(_native_call_flag),
            _native_call_array.push(cmd),
            _native_call_flag = setTimeout(function() {
                RCTUIManager.batchDidComplete(JSON.stringify(_native_call_array)),
                _native_call_array = [],
                Events.fire("batchedUpdates"),
                flag && console.error(JSON.stringify(cmd))
            }, 1))
        }
    };
    module.exports = exp
}),
__d("ajax", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var Events = require('events');
  var callback_name = '_CALLBACK_',
    index = 0;
  function obj2query(obj) {
      return Object.keys(obj).map(function(v) {
          var value = obj[v];
          if (/[\u4e00-\u9fa5]/.test(value)) {
            value = encodeURIComponent(value);
          }
          return v + '=' + value;
      }).join('&');
  }
  module.exports = function(obj) {
    // fecth oc 
    var data = obj.data || {url: ''},
        last,
        port,
        port_site = obj.url.indexOf(':');

    if (port_site != -1) {
      var host = obj.url.split('//')[1];
      if (host) {
        port = host.split('/')[0].split(':')[1];
        obj.url = obj.url.replace(':' + port, '');
        obj.port = parseInt(port);
      }
    }

    if (Array.isArray(data)) {
      data = data.join('&');
    } else {
      data = obj2query(data)
    }

    if (obj.type == 'post') {
      obj.data = data;
    } else {
      if (data) {
        last = obj.url.lastIndexOf('?');
        if (last != -1) {
          if (last == obj.url.length - 1) {
            obj.url += data;
          } else {
            obj.url += '&' + data;
          }
        } else {
          obj.url += '?' + data;
        }
      }
      obj.data = '';
    }

    var callback = callback_name + (+ new Date()) + (index++ % 10000);
    if (!obj.id) {
      obj.id = 0;      
    }

    Events.once(callback, function(data, header) {
      if (/404|500|502/.test(header)) {
        obj.error(header);
      } else {
        obj.success && obj.success(data, header);
      }
    });
    NetRequest.ajax(callback, JSON.stringify(obj));
  }
}),
__d('ajaxex',[],function(global, require, requireDynamic, requireLazy, module, exports) {
  var Ajax = require('ajax');
  var ajaxex_request_id = 1;
  module.exports = function(obj) {
    this.had_destory = false;
    this.request_id = 0; 

    this.send = function(obj) {
      if (!this.had_destory) {
        obj.id = this.request_id;
        Ajax(obj);
      };
    },
    this.stop = function() {
       if (!this.had_destory) {
          NetRequest.stop(this.request_id);
       };
    },
    this.destroy = function() {
       this.had_destory = true;

       NetRequest.destroy(this.request_id);
    },
    this.request_id = ++ajaxex_request_id;
  }
}),
__d("props", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    module.exports = {
        get: function(view, prop) {
            return RCTUIManager.getAttribute(view._id, prop)
        },
        set: function(view, prop, value) {
            return RCTUIManager.setAttribute(view._id, prop, value + "")
        }
    }
}),
__d("EasingType", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    return {
        easeInQuad: function(pos) {
            return Math.pow(pos, 2)
        },
        easeOutQuad: function(pos) {
            return -(Math.pow(pos - 1, 2) - 1)
        },
        easeInOutQuad: function(pos) {
            return (pos /= .5) < 1 ? .5 * Math.pow(pos, 2) : -.5 * ((pos -= 2) * pos - 2)
        },
        easeInCubic: function(pos) {
            return Math.pow(pos, 3)
        },
        easeOutCubic: function(pos) {
            return Math.pow(pos - 1, 3) + 1
        },
        easeInOutCubic: function(pos) {
            return (pos /= .5) < 1 ? .5 * Math.pow(pos, 3) : .5 * (Math.pow(pos - 2, 3) + 2)
        },
        easeInQuart: function(pos) {
            return Math.pow(pos, 4)
        },
        easeOutQuart: function(pos) {
            return -(Math.pow(pos - 1, 4) - 1)
        },
        easeInOutQuart: function(pos) {
            return (pos /= .5) < 1 ? .5 * Math.pow(pos, 4) : -.5 * ((pos -= 2) * Math.pow(pos, 3) - 2)
        },
        easeInQuint: function(pos) {
            return Math.pow(pos, 5)
        },
        easeOutQuint: function(pos) {
            return Math.pow(pos - 1, 5) + 1
        },
        easeInOutQuint: function(pos) {
            return (pos /= .5) < 1 ? .5 * Math.pow(pos, 5) : .5 * (Math.pow(pos - 2, 5) + 2)
        },
        easeInSine: function(pos) {
            return -Math.cos(pos * (Math.PI / 2)) + 1
        },
        easeOutSine: function(pos) {
            return Math.sin(pos * (Math.PI / 2))
        },
        easeInOutSine: function(pos) {
            return -.5 * (Math.cos(Math.PI * pos) - 1)
        },
        easeInExpo: function(pos) {
            return 0 == pos ? 0 : Math.pow(2, 10 * (pos - 1))
        },
        easeOutExpo: function(pos) {
            return 1 == pos ? 1 : -Math.pow(2, -10 * pos) + 1
        },
        easeInOutExpo: function(pos) {
            return 0 == pos ? 0 : 1 == pos ? 1 : (pos /= .5) < 1 ? .5 * Math.pow(2, 10 * (pos - 1)) : .5 * (-Math.pow(2, -10 * --pos) + 2)
        },
        easeInCirc: function(pos) {
            return -(Math.sqrt(1 - pos * pos) - 1)
        },
        easeOutCirc: function(pos) {
            return Math.sqrt(1 - Math.pow(pos - 1, 2))
        },
        easeInOutCirc: function(pos) {
            return (pos /= .5) < 1 ? -.5 * (Math.sqrt(1 - pos * pos) - 1) : .5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1)
        },
        easeOutBounce: function(pos) {
            return 1 / 2.75 > pos ? 7.5625 * pos * pos : 2 / 2.75 > pos ? 7.5625 * (pos -= 1.5 / 2.75) * pos + .75 : 2.5 / 2.75 > pos ? 7.5625 * (pos -= 2.25 / 2.75) * pos + .9375 : 7.5625 * (pos -= 2.625 / 2.75) * pos + .984375
        },
        easeInBack: function(pos) {
            var s = 1.70158;
            return pos * pos * ((s + 1) * pos - s)
        },
        easeOutBack: function(pos) {
            var s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1
        },
        easeInOutBack: function(pos) {
            var s = 1.70158;
            return (pos /= .5) < 1 ? .5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : .5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2)
        },
        elastic: function(pos) {
            return -1 * Math.pow(4, -8 * pos) * Math.sin((6 * pos - 1) * (2 * Math.PI) / 2) + 1
        },
        swingFromTo: function(pos) {
            var s = 1.70158;
            return (pos /= .5) < 1 ? .5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : .5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2)
        },
        swingFrom: function(pos) {
            var s = 1.70158;
            return pos * pos * ((s + 1) * pos - s)
        },
        swingTo: function(pos) {
            var s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1
        },
        bounce: function(pos) {
            return 1 / 2.75 > pos ? 7.5625 * pos * pos : 2 / 2.75 > pos ? 7.5625 * (pos -= 1.5 / 2.75) * pos + .75 : 2.5 / 2.75 > pos ? 7.5625 * (pos -= 2.25 / 2.75) * pos + .9375 : 7.5625 * (pos -= 2.625 / 2.75) * pos + .984375
        },
        bouncePast: function(pos) {
            return 1 / 2.75 > pos ? 7.5625 * pos * pos : 2 / 2.75 > pos ? 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + .75) : 2.5 / 2.75 > pos ? 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + .9375) : 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + .984375)
        },
        easeFromTo: function(pos) {
            return (pos /= .5) < 1 ? .5 * Math.pow(pos, 4) : -.5 * ((pos -= 2) * Math.pow(pos, 3) - 2)
        },
        easeFrom: function(pos) {
            return Math.pow(pos, 4)
        },
        easeTo: function(pos) {
            return Math.pow(pos, .25)
        },
        linear: function(pos) {
            return pos
        },
        sinusoidal: function(pos) {
            return -Math.cos(pos * Math.PI) / 2 + .5
        },
        reverse: function(pos) {
            return 1 - pos
        },
        mirror: function(pos, transition) {
            return (transition = transition || tween.sinusoidal)(.5 > pos ? 2 * pos : 1 - 2 * (pos - .5))
        },
        flicker: function(pos) {
            var pos = pos + (Math.random() - .5) / 5;
            return tween.sinusoidal(0 > pos ? 0 : pos > 1 ? 1 : pos)
        },
        wobble: function(pos) {
            return -Math.cos(pos * Math.PI * (9 * pos)) / 2 + .5
        },
        pulse: function(pos, pulses) {
            return -Math.cos(pos * ((pulses || 5) - .5) * 2 * Math.PI) / 2 + .5
        },
        blink: function(pos, blinks) {
            return Math.round(pos * (blinks || 5)) % 2
        },
        spring: function(pos) {
            return 1 - Math.cos(4.5 * pos * Math.PI) * Math.exp(6 * -pos)
        },
        none: function(pos) {
            return 0
        },
        full: function(pos) {
            return 1
        }
    }
}),
__d("NodeProps", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var style = require("StyleSheetRegistry");
    module.exports = {
        get: function(view, prop) {
            var node = view._currentElement || view;
            if (!node.props.style)
                return 0;
            if ("number" == typeof node.props.style) {
                var styles = style.getStyleByID[node.props.style];
                return styles ? styles[prop] || 0 : 0
            }
            if (Array.isArray(node.props.style)) {
                var tmp;
                return node.props.style.forEach(function(v) {
                    if ("number" == typeof v) {
                        var styles = style.getStyleByID(v);
                        styles && (tmp = styles[prop] ? styles[prop] : tmp)
                    } else
                        tmp = v[prop] ? v[prop] : tmp
                }),
                tmp || 0
            }
            return "object" == typeof node.props.style ? node.props.style[prop] || 0 : void 0
        },
        set: function(view, props) {
            var styles, node = view._currentElement || view;
            Object.keys(props).forEach(function(prop) {
                if (styles = null ,
                node.props.style)
                    if ("number" == typeof node.props.style)
                        styles = style.getStyleByID[node.props.style];
                    else if (Array.isArray(node.props.style)) {
                        var tmp;
                        node.props.style.forEach(function(v) {
                            "number" == typeof v ? (tmp = style.getStyleByID(v),
                            tmp && (styles = tmp)) : v[prop] && (styles = v)
                        })
                    } else
                        "object" == typeof node.props.style && (styles = node.props.style);
                styles && (styles[prop] = props[prop])
            })
        }
    }
}),
__d("Animate", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function startAnimate() {
        flag = setInterval(function() {
            tick_queue.forEach(function(v) {
                v.tick()
            })
        }, 16)
    }
    function popQueue(animate) {
        var index = 0;
        tick_queue.some(function(v, i) {
            return (v.index = animate.index) ? (index = i,
            !0) : void 0
        }),
        tick_queue.splice(index, 1),
        delete animateNodeCache[animate.view._id],
        0 == tick_queue.length && clearInterval(flag)
    }
    function pushQueue(animate) {
        animate.index = +new Date,
        animateNodeCache[animate.view._id] = !0,
        tick_queue.push(animate),
        1 == tick_queue.length && startAnimate()
    }
    function AnimatesLists(lists) {
        this.lists = lists
    }
    var NodeProps = require("NodeProps")
      , precomputeStyle = require("precomputeStyle")
      , EasingType = require("EasingType")
      , Animate = function(view, props, speed, easing, callback) {
        var _this = this;
        this.view = view,
        this.props = props,
        this.speed = speed || 300,
        this.easing = EasingType[easing || "linear"],
        this.callback = callback || null ,
        this.start_time = +new Date,
        this.current = {},
        this.dif = {},
        this.isAnimate = !0,
        this.middleStatus = {},
        pushQueue(this),
        Object.keys(this.props).forEach(function(v) {
            _this.current[v] = NodeProps.get(_this.view, v) || 0,
            _this.dif[v] = _this.props[v] - _this.current[v]
        })
    }
    ;
    Animate.prototype.tick = function() {
        var _this = this
          , current = new Date
          , during = (current - this.start_time) / this.speed;
        during >= 1 ? (NodeProps.set(this.view, this.props),
        this.view.setNativeProps({
            style: precomputeStyle(this.props)
        }),
        popQueue(this),
        this.isAnimate = !1,
        this.callback && this.callback()) : (Object.keys(this.props).forEach(function(v) {
            _this.middleStatus[v] = _this.current[v] + _this.easing(during) * _this.dif[v]
        }),
        this.view.setNativeProps({
            style: precomputeStyle(this.middleStatus)
        }))
    }
    ,
    Animate.prototype.stop = function(end) {
        end ? NodeProps.set(this.view, this.props) : NodeProps.set(this.view, this.middleStatus),
        popQueue(this),
        this.callback && this.callback()
    }
    ;
    var flag, tick_queue = [], animateNodeCache = {};
    AnimatesLists.prototype.start = function() {
        return Array.isArray(this.lists) ? void this.call() : !1
    }
    ,
    AnimatesLists.prototype.stop = function() {}
    ,
    AnimatesLists.prototype.call = function() {
        var current = this.lists.shift()
          , _this = this;
        current && new Animate(current.node,current.props,current.speed,current.easing,function() {
            current.callback && current.callback(),
            current = null ,
            _this.call()
        }
        )
    }
    ,
    module.exports = {
        animate: function(obj) {
            var animate = new Animate(obj.node,obj.props,obj.speed,obj.easing,obj.callback);
            return animate
        },
        isAnimate: function(node) {
            return animateNodeCache[node._id]
        },
        stop: function(end, node) {
            node ? tick_queue.forEach(function(v) {
                v.view == node && v.stop(end)
            }) : tick_queue.forEach(function(v) {
                v.stop(end)
            })
        },
        lists: function(lists) {
            var lists = new AnimatesLists(lists);
            return lists.start(),
            lists
        }
    }
}),
__d("react-native", ["React", "Image", "ListView", "MapView", "ScrollView", "Text", "TextInput", "View", "CustomView", "AppRegistry", "AppStateIOS", "AsyncStorage", "StyleSheet", "RCTDeviceEventEmitter", "requireNativeComponent", "ReactComponentWithPureRenderMixin", "NativeModules", "ReactUpdates", "cloneWithProps", "update"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactNative = Object.assign(Object.create(require("React")), {
        img: require("Image"),
        Image: require("Image"),
        ListView: require("ListView"),
        MapView: require("MapView"),
        ScrollView: require("ScrollView"),
        Text: require("Text"),
        span: require("Text"),
        TextInput: require("TextInput"),
        div: require("View"),
        View: require("View"),
        CustomView: require("CustomView"),
        AppRegistry: require("AppRegistry"),
        AppStateIOS: require("AppStateIOS"),
        AsyncStorage: require("AsyncStorage"),
        StyleSheet: require("StyleSheet"),
        DeviceEventEmitter: require("RCTDeviceEventEmitter"),
        NativeModules: require("NativeModules"),
        requireNativeComponent: require("requireNativeComponent"),
        addons: {
            Perf: void 0,
            PureRenderMixin: require("ReactComponentWithPureRenderMixin"),
            TestUtils: void 0,
            batchedUpdates: require("ReactUpdates").batchedUpdates,
            cloneWithProps: require("cloneWithProps"),
            update: require("update")
        }
    });
    module.exports = ReactNative
}),
__d("React", ["ReactNative"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    module.exports = require("ReactNative")
}),
__d("ReactNative", ["ReactChildren", "ReactClass", "ReactComponent", "ReactContext", "ReactCurrentOwner", "ReactElement", "ReactElementValidator", "ReactInstanceHandles", "ReactNativeDefaultInjection", "ReactNativeMount", "ReactPropTypes", "deprecated", "findNodeHandle", "invariant", "onlyChild", "ReactReconciler", "ReactNativeTextComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactChildren = require("ReactChildren")
      , ReactClass = require("ReactClass")
      , ReactComponent = require("ReactComponent")
      , ReactContext = require("ReactContext")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactElement = require("ReactElement")
      , ReactElementValidator = require("ReactElementValidator")
      , ReactInstanceHandles = require("ReactInstanceHandles")
      , ReactNativeDefaultInjection = require("ReactNativeDefaultInjection")
      , ReactNativeMount = require("ReactNativeMount")
      , ReactPropTypes = require("ReactPropTypes")
      , deprecated = require("deprecated")
      , findNodeHandle = require("findNodeHandle")
      , invariant = require("invariant")
      , onlyChild = require("onlyChild");
    ReactNativeDefaultInjection.inject();
    var createElement = ReactElement.createElement
      , createFactory = ReactElement.createFactory
      , cloneElement = ReactElement.cloneElement;
    __DEV__ && (createElement = ReactElementValidator.createElement,
    createFactory = ReactElementValidator.createFactory,
    cloneElement = ReactElementValidator.cloneElement);
    var resolveDefaultProps = function(element) {
        var defaultProps = element.type.defaultProps
          , props = element.props;
        for (var propName in defaultProps)
            void 0 === props[propName] && (props[propName] = defaultProps[propName])
    }
      , augmentElement = function(element) {
        return __DEV__ && invariant(!1, "This optimized path should never be used in DEV mode because it does not provide validation. Check your JSX transform."),
        element._owner = ReactCurrentOwner.current,
        element._context = ReactContext.current,
        element.type.defaultProps && resolveDefaultProps(element),
        element
    }
      , render = function(element, mountInto, callback) {
        return ReactNativeMount.renderComponent(element, mountInto, callback)
    }
      , ReactNative = {
        hasReactNativeInitialized: !1,
        Children: {
            map: ReactChildren.map,
            forEach: ReactChildren.forEach,
            count: ReactChildren.count,
            only: onlyChild
        },
        Component: ReactComponent,
        PropTypes: ReactPropTypes,
        createClass: ReactClass.createClass,
        createElement: createElement,
        createFactory: createFactory,
        cloneElement: cloneElement,
        _augmentElement: augmentElement,
        findNodeHandle: findNodeHandle,
        render: render,
        unmountComponentAtNode: ReactNativeMount.unmountComponentAtNode,
        __spread: Object.assign,
        unmountComponentAtNodeAndRemoveContainer: ReactNativeMount.unmountComponentAtNodeAndRemoveContainer,
        isValidClass: ReactElement.isValidFactory,
        isValidElement: ReactElement.isValidElement,
        renderComponent: deprecated("React", "renderComponent", "render", this, render),
        isValidComponent: deprecated("React", "isValidComponent", "isValidElement", this, ReactElement.isValidElement)
    };
    "undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject && __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
        CurrentOwner: ReactCurrentOwner,
        InstanceHandles: ReactInstanceHandles,
        Mount: ReactNativeMount,
        Reconciler: require("ReactReconciler"),
        TextComponent: require("ReactNativeTextComponent")
    }),
    module.exports = ReactNative
}),
__d("ReactChildren", ["PooledClass", "ReactFragment", "traverseAllChildren", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function ForEachBookKeeping(forEachFunction, forEachContext) {
        this.forEachFunction = forEachFunction,
        this.forEachContext = forEachContext
    }
    function forEachSingleChild(traverseContext, child, name, i) {
        var forEachBookKeeping = traverseContext;
        forEachBookKeeping.forEachFunction.call(forEachBookKeeping.forEachContext, child, i)
    }
    function forEachChildren(children, forEachFunc, forEachContext) {
        if (null  == children)
            return children;
        var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
        traverseAllChildren(children, forEachSingleChild, traverseContext),
        ForEachBookKeeping.release(traverseContext)
    }
    function MapBookKeeping(mapResult, mapFunction, mapContext) {
        this.mapResult = mapResult,
        this.mapFunction = mapFunction,
        this.mapContext = mapContext
    }
    function mapSingleChildIntoContext(traverseContext, child, name, i) {
        var mapBookKeeping = traverseContext
          , mapResult = mapBookKeeping.mapResult
          , keyUnique = !mapResult.hasOwnProperty(name);
        if (__DEV__ && warning(keyUnique, "ReactChildren.map(...): Encountered two children with the same key, `%s`. Child keys must be unique; when two children share a key, only the first child will be used.", name),
        keyUnique) {
            var mappedChild = mapBookKeeping.mapFunction.call(mapBookKeeping.mapContext, child, i);
            mapResult[name] = mappedChild
        }
    }
    function mapChildren(children, func, context) {
        if (null  == children)
            return children;
        var mapResult = {}
          , traverseContext = MapBookKeeping.getPooled(mapResult, func, context);
        return traverseAllChildren(children, mapSingleChildIntoContext, traverseContext),
        MapBookKeeping.release(traverseContext),
        ReactFragment.create(mapResult)
    }
    function forEachSingleChildDummy(traverseContext, child, name, i) {
        return null 
    }
    function countChildren(children, context) {
        return traverseAllChildren(children, forEachSingleChildDummy, null )
    }
    var PooledClass = require("PooledClass")
      , ReactFragment = require("ReactFragment")
      , traverseAllChildren = require("traverseAllChildren")
      , warning = require("warning")
      , twoArgumentPooler = PooledClass.twoArgumentPooler
      , threeArgumentPooler = PooledClass.threeArgumentPooler;
    PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler),
    PooledClass.addPoolingTo(MapBookKeeping, threeArgumentPooler);
    var ReactChildren = {
        forEach: forEachChildren,
        map: mapChildren,
        count: countChildren
    };
    module.exports = ReactChildren
}),
__d("PooledClass", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , oneArgumentPooler = function(copyFieldsFrom) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            return Klass.call(instance, copyFieldsFrom),
            instance
        }
        return new Klass(copyFieldsFrom)
    }
      , twoArgumentPooler = function(a1, a2) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            return Klass.call(instance, a1, a2),
            instance
        }
        return new Klass(a1,a2)
    }
      , threeArgumentPooler = function(a1, a2, a3) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            return Klass.call(instance, a1, a2, a3),
            instance
        }
        return new Klass(a1,a2,a3)
    }
      , fiveArgumentPooler = function(a1, a2, a3, a4, a5) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            return Klass.call(instance, a1, a2, a3, a4, a5),
            instance
        }
        return new Klass(a1,a2,a3,a4,a5)
    }
      , standardReleaser = function(instance) {
        var Klass = this;
        invariant(instance instanceof Klass, "Trying to release an instance into a pool of a different type."),
        instance.destructor && instance.destructor(),
        Klass.instancePool.length < Klass.poolSize && Klass.instancePool.push(instance)
    }
      , DEFAULT_POOL_SIZE = 10
      , DEFAULT_POOLER = oneArgumentPooler
      , addPoolingTo = function(CopyConstructor, pooler) {
        var NewKlass = CopyConstructor;
        return NewKlass.instancePool = [],
        NewKlass.getPooled = pooler || DEFAULT_POOLER,
        NewKlass.poolSize || (NewKlass.poolSize = DEFAULT_POOL_SIZE),
        NewKlass.release = standardReleaser,
        NewKlass
    }
      , PooledClass = {
        addPoolingTo: addPoolingTo,
        oneArgumentPooler: oneArgumentPooler,
        twoArgumentPooler: twoArgumentPooler,
        threeArgumentPooler: threeArgumentPooler,
        fiveArgumentPooler: fiveArgumentPooler
    };
    module.exports = PooledClass
}),
__d("invariant", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = function(condition, format, a, b, c, d, e, f) {
        if (__DEV__ && void 0 === format)
            throw new Error("invariant requires an error message argument");
        if (!condition) {
            var error;
            if (void 0 === format)
                error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
            else {
                var args = [a, b, c, d, e, f]
                  , argIndex = 0;
                error = new Error("Invariant Violation: " + format.replace(/%s/g, function() {
                    return args[argIndex++]
                }))
            }
            throw error.framesToPop = 1,
            error
        }
    }
    ;
    module.exports = invariant
}),
__d("ReactFragment", ["ReactElement", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactElement = require("ReactElement")
      , warning = require("warning");
    if (__DEV__) {
        var fragmentKey = "_reactFragment"
          , didWarnKey = "_reactDidWarn"
          , canWarnForReactFragment = !1;
        try {
            var dummy = function() {
                return 1
            }
            ;
            Object.defineProperty({}, fragmentKey, {
                enumerable: !1,
                value: !0
            }),
            Object.defineProperty({}, "key", {
                enumerable: !0,
                get: dummy
            }),
            canWarnForReactFragment = !0
        } catch (x) {}
        var proxyPropertyAccessWithWarning = function(obj, key) {
            Object.defineProperty(obj, key, {
                enumerable: !0,
                get: function() {
                    return warning(this[didWarnKey], "A ReactFragment is an opaque type. Accessing any of its properties is deprecated. Pass it to one of the React.Children helpers."),
                    this[didWarnKey] = !0,
                    this[fragmentKey][key]
                },
                set: function(value) {
                    warning(this[didWarnKey], "A ReactFragment is an immutable opaque type. Mutating its properties is deprecated."),
                    this[didWarnKey] = !0,
                    this[fragmentKey][key] = value
                }
            })
        }
          , issuedWarnings = {}
          , didWarnForFragment = function(fragment) {
            var fragmentCacheKey = "";
            for (var key in fragment)
                fragmentCacheKey += key + ":" + typeof fragment[key] + ",";
            var alreadyWarnedOnce = !!issuedWarnings[fragmentCacheKey];
            return issuedWarnings[fragmentCacheKey] = !0,
            alreadyWarnedOnce
        }
    }
    var ReactFragment = {
        create: function(object) {
            if (__DEV__) {
                if ("object" != typeof object || !object || Array.isArray(object))
                    return warning(!1, "React.addons.createFragment only accepts a single object.", object),
                    object;
                if (ReactElement.isValidElement(object))
                    return warning(!1, "React.addons.createFragment does not accept a ReactElement without a wrapper object."),
                    object;
                if (canWarnForReactFragment) {
                    var proxy = {};
                    Object.defineProperty(proxy, fragmentKey, {
                        enumerable: !1,
                        value: object
                    }),
                    Object.defineProperty(proxy, didWarnKey, {
                        writable: !0,
                        enumerable: !1,
                        value: !1
                    });
                    for (var key in object)
                        proxyPropertyAccessWithWarning(proxy, key);
                    return Object.preventExtensions(proxy),
                    proxy
                }
            }
            return object
        },
        extract: function(fragment) {
            return __DEV__ && canWarnForReactFragment ? fragment[fragmentKey] ? fragment[fragmentKey] : (warning(didWarnForFragment(fragment), "Any use of a keyed object should be wrapped in React.addons.createFragment(object) before being passed as a child."),
            fragment) : fragment
        },
        extractIfFragment: function(fragment) {
            if (__DEV__ && canWarnForReactFragment) {
                if (fragment[fragmentKey])
                    return fragment[fragmentKey];
                for (var key in fragment)
                    if (fragment.hasOwnProperty(key) && ReactElement.isValidElement(fragment[key]))
                        return ReactFragment.extract(fragment)
            }
            return fragment
        }
    };
    module.exports = ReactFragment
}),
__d("ReactElement", ["ReactContext", "ReactCurrentOwner", "Object.assign", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function defineWarningProperty(object, key) {
        Object.defineProperty(object, key, {
            configurable: !1,
            enumerable: !0,
            get: function() {
                return this._store ? this._store[key] : null 
            },
            set: function(value) {
                warning(!1, "Don't set the %s property of the React element. Instead, specify the correct value when initially creating the element.", key),
                this._store[key] = value
            }
        })
    }
    function defineMutationMembrane(prototype) {
        try {
            var pseudoFrozenProperties = {
                props: !0
            };
            for (var key in pseudoFrozenProperties)
                defineWarningProperty(prototype, key);
            useMutationMembrane = !0
        } catch (x) {}
    }
    var ReactContext = require("ReactContext")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , assign = require("Object.assign")
      , warning = require("warning")
      , useMutationMembrane = !1
      , ReactElement = function(type, key, ref, owner, context, props) {
        if (this.type = type,
        this.key = key,
        this.ref = ref,
        this._owner = owner,
        this._context = context,
        __DEV__) {
            this._store = {
                props: props,
                originalProps: assign({}, props)
            };
            try {
                Object.defineProperty(this._store, "validated", {
                    configurable: !1,
                    enumerable: !1,
                    writable: !0
                })
            } catch (x) {}
            if (this._store.validated = !1,
            useMutationMembrane)
                return void Object.freeze(this)
        }
        this.props = props
    }
    ;
    ReactElement.prototype = {
        _isReactElement: !0
    },
    __DEV__ && defineMutationMembrane(ReactElement.prototype),
    ReactElement.createElement = function(type, config, children) {
        var propName, props = {}, key = null , ref = null ;
        null  != config && (ref = void 0 === config.ref ? null  : config.ref,
        key = void 0 === config.key ? null  : "" + config.key,
        props = config);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength)
            "" === children && (children = null ),
            children && children.filter && (children = children.filter(function(v) {
                return "" !== v
            })),
            props.children = children;
        else if (childrenLength > 1) {
            for (var childArray = Array(childrenLength), i = 0; childrenLength > i; i++)
                childArray[i] = arguments[i + 2];
            childArray && childArray.filter && (childArray = childArray.filter(function(v) {
                return "" !== v
            })),
            props.children = childArray
        }
        if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps)
                "undefined" == typeof props[propName] && (props[propName] = defaultProps[propName])
        }
        return new ReactElement(type,key,ref,ReactCurrentOwner.current,ReactContext.current,props)
    }
    ,
    ReactElement.createFactory = function(type) {
        var factory = ReactElement.createElement.bind(null , type);
        return factory.type = type,
        factory
    }
    ,
    ReactElement.cloneAndReplaceProps = function(oldElement, newProps) {
        var newElement = new ReactElement(oldElement.type,oldElement.key,oldElement.ref,oldElement._owner,oldElement._context,newProps);
        return __DEV__ && (newElement._store.validated = oldElement._store.validated),
        newElement
    }
    ,
    ReactElement.cloneElement = function(element, config, children) {
        var props = assign({}, element.props)
          , key = element.key
          , ref = element.ref
          , owner = element._owner;
        null  != config && (void 0 !== config.ref && (ref = config.ref,
        owner = ReactCurrentOwner.current),
        void 0 !== config.key && (key = "" + config.key),
        props = config,
        config = null );
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength)
            props.children = children;
        else if (childrenLength > 1) {
            for (var childArray = Array(childrenLength), i = 0; childrenLength > i; i++)
                childArray[i] = arguments[i + 2];
            props.children = childArray
        }
        return new ReactElement(element.type,key,ref,owner,element._context,props)
    }
    ,
    ReactElement.isValidElement = function(object) {
        var isElement = !(!object || !object._isReactElement);
        return isElement
    }
    ,
    module.exports = ReactElement
}),
__d("ReactContext", ["Object.assign", "emptyObject", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var assign = require("Object.assign")
      , emptyObject = require("emptyObject")
      , warning = require("warning")
      , didWarn = !1
      , ReactContext = {
        current: emptyObject,
        withContext: function(newContext, scopedCallback) {
            __DEV__ && (warning(didWarn, "withContext is deprecated and will be removed in a future version. Use a wrapper component with getChildContext instead."),
            didWarn = !0);
            var result, previousContext = ReactContext.current;
            ReactContext.current = assign({}, previousContext, newContext);
            try {
                result = scopedCallback()
            } finally {
                ReactContext.current = previousContext
            }
            return result
        }
    };
    module.exports = ReactContext
}),
__d("Object.assign", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function assign(target, sources) {
        if (null  == target)
            throw new TypeError("Object.assign target cannot be null or undefined");
        for (var to = Object(target), hasOwnProperty = Object.prototype.hasOwnProperty, nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
            var nextSource = arguments[nextIndex];
            if (null  != nextSource) {
                var from = Object(nextSource);
                for (var key in from)
                    hasOwnProperty.call(from, key) && (to[key] = from[key])
            }
        }
        return to
    }
    module.exports = assign
}),
__d("emptyObject", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var emptyObject = {};
    __DEV__ && Object.freeze(emptyObject),
    module.exports = emptyObject
}),
__d("warning", ["emptyFunction"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var emptyFunction = require("emptyFunction")
      , warning = emptyFunction;
    __DEV__ && (warning = function(condition, format) {
        for (var args = [], $__0 = 2, $__1 = arguments.length; $__1 > $__0; $__0++)
            args.push(arguments[$__0]);
        if (void 0 === format)
            throw new Error("`warning(condition, format, ...args)` requires a warning message argument");
        if (format.length < 10 || /^[s\W]*$/.test(format))
            throw new Error("The warning format should be able to uniquely identify this warning. Please, use a more descriptive format than: " + format);
        if (0 !== format.indexOf("Failed Composite propType: ") && !condition) {
            var argIndex = 0
              , message = "Warning: " + format.replace(/%s/g, function() {
                return args[argIndex++]
            });
            console.warn(message);
            try {
                throw new Error(message)
            } catch (x) {}
        }
    }
    ),
    module.exports = warning
}),
__d("emptyFunction", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function makeEmptyFunction(arg) {
        return function() {
            return arg
        }
    }
    function emptyFunction() {}
    emptyFunction.thatReturns = makeEmptyFunction,
    emptyFunction.thatReturnsFalse = makeEmptyFunction(!1),
    emptyFunction.thatReturnsTrue = makeEmptyFunction(!0),
    emptyFunction.thatReturnsNull = makeEmptyFunction(null ),
    emptyFunction.thatReturnsThis = function() {
        return this
    }
    ,
    emptyFunction.thatReturnsArgument = function(arg) {
        return arg
    }
    ,
    module.exports = emptyFunction
}),
__d("ReactCurrentOwner", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactCurrentOwner = {
        current: null 
    };
    module.exports = ReactCurrentOwner
}),
__d("traverseAllChildren", ["ReactElement", "ReactFragment", "ReactInstanceHandles", "getIteratorFn", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function userProvidedKeyEscaper(match) {
        return userProvidedKeyEscaperLookup[match]
    }
    function getComponentKey(component, index) {
        return component && null  != component.key ? wrapUserProvidedKey(component.key) : index.toString(36)
    }
    function escapeUserProvidedKey(text) {
        return ("" + text).replace(userProvidedKeyEscapeRegex, userProvidedKeyEscaper)
    }
    function wrapUserProvidedKey(key) {
        return "$" + escapeUserProvidedKey(key)
    }
    function traverseAllChildrenImpl(children, nameSoFar, indexSoFar, callback, traverseContext) {
        var type = typeof children;
        if (("undefined" === type || "boolean" === type) && (children = null ),
        null  === children || "string" === type || "number" === type || ReactElement.isValidElement(children))
            return callback(traverseContext, children, "" === nameSoFar ? SEPARATOR + getComponentKey(children, 0) : nameSoFar, indexSoFar),
            1;
        var child, nextName, nextIndex, subtreeCount = 0;
        if (Array.isArray(children))
            for (var i = 0; i < children.length; i++)
                child = children[i],
                nextName = ("" !== nameSoFar ? nameSoFar + SUBSEPARATOR : SEPARATOR) + getComponentKey(child, i),
                nextIndex = indexSoFar + subtreeCount,
                subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext);
        else {
            var iteratorFn = getIteratorFn(children);
            if (iteratorFn) {
                var step, iterator = iteratorFn.call(children);
                if (iteratorFn !== children.entries)
                    for (var ii = 0; !(step = iterator.next()).done; )
                        child = step.value,
                        nextName = ("" !== nameSoFar ? nameSoFar + SUBSEPARATOR : SEPARATOR) + getComponentKey(child, ii++),
                        nextIndex = indexSoFar + subtreeCount,
                        subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext);
                else
                    for (__DEV__ && (warning(didWarnAboutMaps, "Using Maps as children is not yet fully supported. It is an experimental feature that might be removed. Convert it to a sequence / iterable of keyed ReactElements instead."),
                    didWarnAboutMaps = !0); !(step = iterator.next()).done; ) {
                        var entry = step.value;
                        entry && (child = entry[1],
                        nextName = ("" !== nameSoFar ? nameSoFar + SUBSEPARATOR : SEPARATOR) + wrapUserProvidedKey(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0),
                        nextIndex = indexSoFar + subtreeCount,
                        subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext))
                    }
            } else if ("object" === type) {
                invariant(1 !== children.nodeType, "traverseAllChildren(...): Encountered an invalid child; DOM elements are not valid children of React components.");
                var fragment = ReactFragment.extract(children);
                for (var key in fragment)
                    fragment.hasOwnProperty(key) && (child = fragment[key],
                    nextName = ("" !== nameSoFar ? nameSoFar + SUBSEPARATOR : SEPARATOR) + wrapUserProvidedKey(key) + SUBSEPARATOR + getComponentKey(child, 0),
                    nextIndex = indexSoFar + subtreeCount,
                    subtreeCount += traverseAllChildrenImpl(child, nextName, nextIndex, callback, traverseContext))
            }
        }
        return subtreeCount
    }
    function traverseAllChildren(children, callback, traverseContext) {
        return null  == children ? 0 : traverseAllChildrenImpl(children, "", 0, callback, traverseContext)
    }
    var ReactElement = require("ReactElement")
      , ReactFragment = require("ReactFragment")
      , ReactInstanceHandles = require("ReactInstanceHandles")
      , getIteratorFn = require("getIteratorFn")
      , invariant = require("invariant")
      , warning = require("warning")
      , SEPARATOR = ReactInstanceHandles.SEPARATOR
      , SUBSEPARATOR = ":"
      , userProvidedKeyEscaperLookup = {
        "=": "=0",
        ".": "=1",
        ":": "=2"
    }
      , userProvidedKeyEscapeRegex = /[=.:]/g
      , didWarnAboutMaps = !1;
    module.exports = traverseAllChildren
}),
__d("ReactInstanceHandles", ["ReactRootIndex", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getReactRootIDString(index) {
        return SEPARATOR + index.toString(36)
    }
    function isBoundary(id, index) {
        return id.charAt(index) === SEPARATOR || index === id.length
    }
    function isValidID(id) {
        return "" === id || id.charAt(0) === SEPARATOR && id.charAt(id.length - 1) !== SEPARATOR
    }
    function isAncestorIDOf(ancestorID, descendantID) {
        return 0 === descendantID.indexOf(ancestorID) && isBoundary(descendantID, ancestorID.length)
    }
    function getParentID(id) {
        return id ? id.substr(0, id.lastIndexOf(SEPARATOR)) : ""
    }
    function getNextDescendantID(ancestorID, destinationID) {
        if (invariant(isValidID(ancestorID) && isValidID(destinationID), "getNextDescendantID(%s, %s): Received an invalid React DOM ID.", ancestorID, destinationID),
        invariant(isAncestorIDOf(ancestorID, destinationID), "getNextDescendantID(...): React has made an invalid assumption about the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.", ancestorID, destinationID),
        ancestorID === destinationID)
            return ancestorID;
        for (var start = ancestorID.length + SEPARATOR_LENGTH, i = start; i < destinationID.length && !isBoundary(destinationID, i); i++)
            ;
        return destinationID.substr(0, i)
    }
    function getFirstCommonAncestorID(oneID, twoID) {
        var minLength = Math.min(oneID.length, twoID.length);
        if (0 === minLength)
            return "";
        for (var lastCommonMarkerIndex = 0, i = 0; minLength >= i; i++)
            if (isBoundary(oneID, i) && isBoundary(twoID, i))
                lastCommonMarkerIndex = i;
            else if (oneID.charAt(i) !== twoID.charAt(i))
                break;
        var longestCommonID = oneID.substr(0, lastCommonMarkerIndex);
        return invariant(isValidID(longestCommonID), "getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s", oneID, twoID, longestCommonID),
        longestCommonID
    }
    function traverseParentPath(start, stop, cb, arg, skipFirst, skipLast) {
        start = start || "",
        stop = stop || "",
        invariant(start !== stop, "traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.", start);
        var traverseUp = isAncestorIDOf(stop, start);
        invariant(traverseUp || isAncestorIDOf(start, stop), "traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do not have a parent path.", start, stop);
        for (var depth = 0, traverse = traverseUp ? getParentID : getNextDescendantID, id = start; ; id = traverse(id, stop)) {
            var ret;
            if (skipFirst && id === start || skipLast && id === stop || (ret = cb(id, traverseUp, arg)),
            ret === !1 || id === stop)
                break;
            invariant(depth++ < MAX_TREE_DEPTH, "traverseParentPath(%s, %s, ...): Detected an infinite loop while traversing the React DOM ID tree. This may be due to malformed IDs: %s", start, stop)
            if (arg.dispatchConfig.phasedRegistrationNames.bubbled == 'onMouseEnter' || arg.dispatchConfig.phasedRegistrationNames.bubbled == 'onMouseLeave') 
                break;
        }
    }
    var ReactRootIndex = require("ReactRootIndex")
      , invariant = require("invariant")
      , SEPARATOR = "."
      , SEPARATOR_LENGTH = SEPARATOR.length
      , MAX_TREE_DEPTH = 100
      , ReactInstanceHandles = {
        createReactRootID: function() {
            return getReactRootIDString(ReactRootIndex.createReactRootIndex())
        },
        createReactID: function(rootID, name) {
            return rootID + name
        },
        getReactRootIDFromNodeID: function(id) {
            if (id && id.charAt(0) === SEPARATOR && id.length > 1) {
                var index = id.indexOf(SEPARATOR, 1);
                return index > -1 ? id.substr(0, index) : id
            }
            return null 
        },
        traverseEnterLeave: function(leaveID, enterID, cb, upArg, downArg) {
            var ancestorID = getFirstCommonAncestorID(leaveID, enterID);
            ancestorID !== leaveID && traverseParentPath(leaveID, ancestorID, cb, upArg, !1, !0),
            ancestorID !== enterID && traverseParentPath(ancestorID, enterID, cb, downArg, !0, !1)
        },
        traverseTwoPhase: function(targetID, cb, arg) {
            targetID && (traverseParentPath("", targetID, cb, arg, !0, !1),
            traverseParentPath(targetID, "", cb, arg, !1, !0))
        },
        traverseTwoPhaseSkipTarget: function(targetID, cb, arg) {
            targetID && (traverseParentPath("", targetID, cb, arg, !0, !0),
            traverseParentPath(targetID, "", cb, arg, !0, !0))
        },
        traverseAncestors: function(targetID, cb, arg) {
            traverseParentPath("", targetID, cb, arg, !0, !1)
        },
        _getFirstCommonAncestorID: getFirstCommonAncestorID,
        _getNextDescendantID: getNextDescendantID,
        isAncestorIDOf: isAncestorIDOf,
        SEPARATOR: SEPARATOR
    };
    module.exports = ReactInstanceHandles
}),
__d("ReactRootIndex", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactRootIndexInjection = {
        injectCreateReactRootIndex: function(_createReactRootIndex) {
            ReactRootIndex.createReactRootIndex = _createReactRootIndex
        }
    }
      , ReactRootIndex = {
        createReactRootIndex: null ,
        injection: ReactRootIndexInjection
    };
    module.exports = ReactRootIndex
}),
__d("getIteratorFn", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        return "function" == typeof iteratorFn ? iteratorFn : void 0
    }
    var ITERATOR_SYMBOL = "function" == typeof Symbol && Symbol.iterator
      , FAUX_ITERATOR_SYMBOL = "@@iterator";
    module.exports = getIteratorFn
}),
__d("ReactClass", ["ReactComponent", "ReactCurrentOwner", "ReactElement", "ReactErrorUtils", "ReactInstanceMap", "ReactLifeCycle", "ReactPropTypeLocations", "ReactPropTypeLocationNames", "ReactUpdateQueue", "Object.assign", "invariant", "keyMirror", "keyOf", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function validateTypeDef(Constructor, typeDef, location) {
        for (var propName in typeDef)
            typeDef.hasOwnProperty(propName) && warning("function" == typeof typeDef[propName], "%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.", Constructor.displayName || "ReactClass", ReactPropTypeLocationNames[location], propName)
    }
    function validateMethodOverride(proto, name) {
        var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null ;
        ReactClassMixin.hasOwnProperty(name) && invariant(specPolicy === SpecPolicy.OVERRIDE_BASE, "ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.", name),
        proto.hasOwnProperty(name) && invariant(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED, "ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.", name)
    }
    function mixSpecIntoComponent(Constructor, spec) {
        if (spec) {
            invariant("function" != typeof spec, "ReactClass: You're attempting to use a component class as a mixin. Instead, just use a regular object."),
            invariant(!ReactElement.isValidElement(spec), "ReactClass: You're attempting to use a component as a mixin. Instead, just use a regular object.");
            var proto = Constructor.prototype;
            spec.hasOwnProperty(MIXINS_KEY) && RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
            for (var name in spec)
                if (spec.hasOwnProperty(name) && name !== MIXINS_KEY) {
                    var property = spec[name];
                    if (validateMethodOverride(proto, name),
                    RESERVED_SPEC_KEYS.hasOwnProperty(name))
                        RESERVED_SPEC_KEYS[name](Constructor, property);
                    else {
                        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name)
                          , isAlreadyDefined = proto.hasOwnProperty(name)
                          , markedDontBind = property && property.__reactDontBind
                          , isFunction = "function" == typeof property
                          , shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && !markedDontBind;
                        if (shouldAutoBind)
                            proto.__reactAutoBindMap || (proto.__reactAutoBindMap = {}),
                            proto.__reactAutoBindMap[name] = property,
                            proto[name] = property;
                        else if (isAlreadyDefined) {
                            var specPolicy = ReactClassInterface[name];
                            invariant(isReactClassMethod && (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY), "ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.", specPolicy, name),
                            specPolicy === SpecPolicy.DEFINE_MANY_MERGED ? proto[name] = createMergedResultFunction(proto[name], property) : specPolicy === SpecPolicy.DEFINE_MANY && (proto[name] = createChainedFunction(proto[name], property))
                        } else
                            proto[name] = property,
                            __DEV__ && "function" == typeof property && spec.displayName && (proto[name].displayName = spec.displayName + "_" + name)
                    }
                }
        }
    }
    function mixStaticSpecIntoComponent(Constructor, statics) {
        if (statics)
            for (var name in statics) {
                var property = statics[name];
                if (statics.hasOwnProperty(name)) {
                    var isReserved = name in RESERVED_SPEC_KEYS;
                    invariant(!isReserved, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name);
                    var isInherited = name in Constructor;
                    invariant(!isInherited, "ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.", name),
                    Constructor[name] = property
                }
            }
    }
    function mergeIntoWithNoDuplicateKeys(one, two) {
        invariant(one && two && "object" == typeof one && "object" == typeof two, "mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.");
        for (var key in two)
            two.hasOwnProperty(key) && (invariant(void 0 === one[key], "mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.", key),
            one[key] = two[key]);
        return one
    }
    function createMergedResultFunction(one, two) {
        return function() {
            var a = one.apply(this, arguments)
              , b = two.apply(this, arguments);
            if (null  == a)
                return b;
            if (null  == b)
                return a;
            var c = {};
            return mergeIntoWithNoDuplicateKeys(c, a),
            mergeIntoWithNoDuplicateKeys(c, b),
            c
        }
    }
    function createChainedFunction(one, two) {
        return function() {
            one.apply(this, arguments),
            two.apply(this, arguments)
        }
    }
    function bindAutoBindMethod(component, method) {
        var boundMethod = method.bind(component);
        if (__DEV__) {
            boundMethod.__reactBoundContext = component,
            boundMethod.__reactBoundMethod = method,
            boundMethod.__reactBoundArguments = null ;
            var componentName = component.constructor.displayName
              , _bind = boundMethod.bind;
            boundMethod.bind = function(newThis) {
                for (var args = [], $__0 = 1, $__1 = arguments.length; $__1 > $__0; $__0++)
                    args.push(arguments[$__0]);
                if (newThis !== component && null  !== newThis)
                    warning(!1, "bind(): React component methods may only be bound to the component instance. See %s", componentName);
                else if (!args.length)
                    return warning(!1, "bind(): You are binding a component method to the component. React does this for you automatically in a high-performance way, so you can safely remove this call. See %s", componentName),
                    boundMethod;
                var reboundMethod = _bind.apply(boundMethod, arguments);
                return reboundMethod.__reactBoundContext = component,
                reboundMethod.__reactBoundMethod = method,
                reboundMethod.__reactBoundArguments = args,
                reboundMethod
            }
        }
        return boundMethod
    }
    function bindAutoBindMethods(component) {
        for (var autoBindKey in component.__reactAutoBindMap)
            if (component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
                var method = component.__reactAutoBindMap[autoBindKey];
                component[autoBindKey] = bindAutoBindMethod(component, ReactErrorUtils.guard(method, component.constructor.displayName + "." + autoBindKey))
            }
    }
    var ReactComponent = require("ReactComponent")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactElement = require("ReactElement")
      , ReactErrorUtils = require("ReactErrorUtils")
      , ReactInstanceMap = require("ReactInstanceMap")
      , ReactLifeCycle = require("ReactLifeCycle")
      , ReactPropTypeLocations = require("ReactPropTypeLocations")
      , ReactPropTypeLocationNames = require("ReactPropTypeLocationNames")
      , ReactUpdateQueue = require("ReactUpdateQueue")
      , assign = require("Object.assign")
      , invariant = require("invariant")
      , keyMirror = require("keyMirror")
      , keyOf = require("keyOf")
      , warning = require("warning")
      , MIXINS_KEY = keyOf({
        mixins: null 
    })
      , SpecPolicy = keyMirror({
        DEFINE_ONCE: null ,
        DEFINE_MANY: null ,
        OVERRIDE_BASE: null ,
        DEFINE_MANY_MERGED: null 
    })
      , injectedMixins = []
      , ReactClassInterface = {
        mixins: SpecPolicy.DEFINE_MANY,
        statics: SpecPolicy.DEFINE_MANY,
        propTypes: SpecPolicy.DEFINE_MANY,
        contextTypes: SpecPolicy.DEFINE_MANY,
        childContextTypes: SpecPolicy.DEFINE_MANY,
        getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,
        getInitialState: SpecPolicy.DEFINE_MANY_MERGED,
        getChildContext: SpecPolicy.DEFINE_MANY_MERGED,
        render: SpecPolicy.DEFINE_ONCE,
        componentWillMount: SpecPolicy.DEFINE_MANY,
        componentDidMount: SpecPolicy.DEFINE_MANY,
        componentWillReceiveProps: SpecPolicy.DEFINE_MANY,
        shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,
        componentWillUpdate: SpecPolicy.DEFINE_MANY,
        componentDidUpdate: SpecPolicy.DEFINE_MANY,
        componentWillUnmount: SpecPolicy.DEFINE_MANY,
        updateComponent: SpecPolicy.OVERRIDE_BASE
    }
      , RESERVED_SPEC_KEYS = {
        displayName: function(Constructor, displayName) {
            Constructor.displayName = displayName
        },
        mixins: function(Constructor, mixins) {
            if (mixins)
                for (var i = 0; i < mixins.length; i++)
                    mixSpecIntoComponent(Constructor, mixins[i])
        },
        childContextTypes: function(Constructor, childContextTypes) {
            __DEV__ && validateTypeDef(Constructor, childContextTypes, ReactPropTypeLocations.childContext),
            Constructor.childContextTypes = assign({}, Constructor.childContextTypes, childContextTypes)
        },
        contextTypes: function(Constructor, contextTypes) {
            __DEV__ && validateTypeDef(Constructor, contextTypes, ReactPropTypeLocations.context),
            Constructor.contextTypes = assign({}, Constructor.contextTypes, contextTypes)
        },
        getDefaultProps: function(Constructor, getDefaultProps) {
            Constructor.getDefaultProps ? Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps) : Constructor.getDefaultProps = getDefaultProps
        },
        propTypes: function(Constructor, propTypes) {
            __DEV__ && validateTypeDef(Constructor, propTypes, ReactPropTypeLocations.prop),
            Constructor.propTypes = assign({}, Constructor.propTypes, propTypes)
        },
        statics: function(Constructor, statics) {
            mixStaticSpecIntoComponent(Constructor, statics)
        }
    }
      , typeDeprecationDescriptor = {
        enumerable: !1,
        get: function() {
            var displayName = this.displayName || this.name || "Component";
            return warning(!1, "%s.type is deprecated. Use %s directly to access the class.", displayName, displayName),
            Object.defineProperty(this, "type", {
                value: this
            }),
            this
        }
    }
      , ReactClassMixin = {
        replaceState: function(newState, callback) {
            ReactUpdateQueue.enqueueReplaceState(this, newState),
            callback && ReactUpdateQueue.enqueueCallback(this, callback)
        },
        isMounted: function() {
            if (__DEV__) {
                var owner = ReactCurrentOwner.current;
                null  !== owner && (warning(owner._warnedAboutRefsInRender, "%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", owner.getName() || "A component"),
                owner._warnedAboutRefsInRender = !0)
            }
            var internalInstance = ReactInstanceMap.get(this);
            return internalInstance && internalInstance !== ReactLifeCycle.currentlyMountingInstance
        },
        setProps: function(partialProps, callback) {
            ReactUpdateQueue.enqueueSetProps(this, partialProps),
            callback && ReactUpdateQueue.enqueueCallback(this, callback)
        },
        replaceProps: function(newProps, callback) {
            ReactUpdateQueue.enqueueReplaceProps(this, newProps),
            callback && ReactUpdateQueue.enqueueCallback(this, callback)
        }
    }
      , ReactClassComponent = function() {}
    ;
    assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);
    var ReactClass = {
        createClass: function(spec) {
            var Constructor = function(props, context) {
                __DEV__ && warning(this instanceof Constructor, "Something is calling a React component directly. Use a factory or JSX instead. See: http://fb.me/react-legacyfactory"),
                this.__reactAutoBindMap && bindAutoBindMethods(this),
                this.props = props,
                this.context = context,
                this.state = null ;
                var initialState = this.getInitialState ? this.getInitialState() : null ;
                __DEV__ && "undefined" == typeof initialState && this.getInitialState._isMockFunction && (initialState = null ),
                invariant("object" == typeof initialState && !Array.isArray(initialState), "%s.getInitialState(): must return an object or null", Constructor.displayName || "ReactCompositeComponent"),
                this.state = initialState
            }
            ;
            Constructor.prototype = new ReactClassComponent,
            Constructor.prototype.constructor = Constructor,
            injectedMixins.forEach(mixSpecIntoComponent.bind(null , Constructor)),
            mixSpecIntoComponent(Constructor, spec),
            Constructor.getDefaultProps && (Constructor.defaultProps = Constructor.getDefaultProps()),
            __DEV__ && (Constructor.getDefaultProps && (Constructor.getDefaultProps.isReactClassApproved = {}),
            Constructor.prototype.getInitialState && (Constructor.prototype.getInitialState.isReactClassApproved = {})),
            invariant(Constructor.prototype.render, "createClass(...): Class specification must implement a `render` method."),
            __DEV__ && warning(!Constructor.prototype.componentShouldUpdate, "%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", spec.displayName || "A component");
            for (var methodName in ReactClassInterface)
                Constructor.prototype[methodName] || (Constructor.prototype[methodName] = null );
            if (Constructor.type = Constructor,
            __DEV__)
                try {
                    Object.defineProperty(Constructor, "type", typeDeprecationDescriptor)
                } catch (x) {}
            return Constructor
        },
        injection: {
            injectMixin: function(mixin) {
                injectedMixins.push(mixin)
            }
        }
    };
    module.exports = ReactClass
}),
__d("ReactComponent", ["ReactUpdateQueue", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function ReactComponent(props, context) {
        this.props = props,
        this.context = context
    }
    var ReactUpdateQueue = require("ReactUpdateQueue")
      , invariant = require("invariant")
      , warning = require("warning");
    if (ReactComponent.prototype.setState = function(partialState, callback) {
        invariant("object" == typeof partialState || "function" == typeof partialState || null  == partialState, "setState(...): takes an object of state variables to update or a function which returns an object of state variables."),
        __DEV__ && warning(null  != partialState, "setState(...): You passed an undefined or null state object; instead, use forceUpdate()."),
        ReactUpdateQueue.enqueueSetState(this, partialState),
        callback && ReactUpdateQueue.enqueueCallback(this, callback)
    }
    ,
    ReactComponent.prototype.forceUpdate = function(callback) {
        ReactUpdateQueue.enqueueForceUpdate(this),
        callback && ReactUpdateQueue.enqueueCallback(this, callback)
    }
    ,
    __DEV__) {
        var deprecatedAPIs = {
            getDOMNode: "getDOMNode",
            isMounted: "isMounted",
            replaceProps: "replaceProps",
            replaceState: "replaceState",
            setProps: "setProps"
        }
          , defineDeprecationWarning = function(methodName, displayName) {
            try {
                Object.defineProperty(ReactComponent.prototype, methodName, {
                    get: function() {
                        warning(!1, "%s(...) is deprecated in plain JavaScript React classes.", displayName)
                    }
                })
            } catch (x) {}
        }
        ;
        for (var fnName in deprecatedAPIs)
            deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName])
    }
    module.exports = ReactComponent
}),
__d("ReactUpdateQueue", ["ReactLifeCycle", "ReactCurrentOwner", "ReactElement", "ReactInstanceMap", "ReactUpdates", "Object.assign", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function enqueueUpdate(internalInstance) {
        internalInstance !== ReactLifeCycle.currentlyMountingInstance && ReactUpdates.enqueueUpdate(internalInstance)
    }
    function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
        invariant(null  == ReactCurrentOwner.current, "%s(...): Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.", callerName);
        var internalInstance = ReactInstanceMap.get(publicInstance);
        return internalInstance ? internalInstance === ReactLifeCycle.currentlyUnmountingInstance ? null  : internalInstance : (__DEV__ && warning(!callerName, "%s(...): Can only update a mounted or mounting component. This usually means you called %s() on an unmounted component. This is a no-op.", callerName, callerName),
        null )
    }
    var ReactLifeCycle = require("ReactLifeCycle")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactElement = require("ReactElement")
      , ReactInstanceMap = require("ReactInstanceMap")
      , ReactUpdates = require("ReactUpdates")
      , assign = require("Object.assign")
      , invariant = require("invariant")
      , warning = require("warning")
      , ReactUpdateQueue = {
        enqueueCallback: function(publicInstance, callback) {
            invariant("function" == typeof callback, "enqueueCallback(...): You called `setProps`, `replaceProps`, `setState`, `replaceState`, or `forceUpdate` with a callback that isn't callable.");
            var internalInstance = getInternalInstanceReadyForUpdate(publicInstance);
            return internalInstance && internalInstance !== ReactLifeCycle.currentlyMountingInstance ? (internalInstance._pendingCallbacks ? internalInstance._pendingCallbacks.push(callback) : internalInstance._pendingCallbacks = [callback],
            void enqueueUpdate(internalInstance)) : null 
        },
        enqueueCallbackInternal: function(internalInstance, callback) {
            invariant("function" == typeof callback, "enqueueCallback(...): You called `setProps`, `replaceProps`, `setState`, `replaceState`, or `forceUpdate` with a callback that isn't callable."),
            internalInstance._pendingCallbacks ? internalInstance._pendingCallbacks.push(callback) : internalInstance._pendingCallbacks = [callback],
            enqueueUpdate(internalInstance)
        },
        enqueueForceUpdate: function(publicInstance) {
            var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, "forceUpdate");
            internalInstance && (internalInstance._pendingForceUpdate = !0,
            enqueueUpdate(internalInstance))
        },
        enqueueReplaceState: function(publicInstance, completeState) {
            var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, "replaceState");
            internalInstance && (internalInstance._pendingStateQueue = [completeState],
            internalInstance._pendingReplaceState = !0,
            enqueueUpdate(internalInstance))
        },
        enqueueSetState: function(publicInstance, partialState) {
            var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, "setState");
            if (internalInstance) {
                var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
                queue.push(partialState),
                enqueueUpdate(internalInstance)
            }
        },
        enqueueSetProps: function(publicInstance, partialProps) {
            var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, "setProps");
            if (internalInstance) {
                invariant(internalInstance._isTopLevel, "setProps(...): You called `setProps` on a component with a parent. This is an anti-pattern since props will get reactively updated when rendered. Instead, change the owner's `render` method to pass the correct value as props to the component where it is created.");
                var element = internalInstance._pendingElement || internalInstance._currentElement
                  , props = assign({}, element.props, partialProps);
                internalInstance._pendingElement = ReactElement.cloneAndReplaceProps(element, props),
                enqueueUpdate(internalInstance)
            }
        },
        enqueueReplaceProps: function(publicInstance, props) {
            var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, "replaceProps");
            if (internalInstance) {
                invariant(internalInstance._isTopLevel, "replaceProps(...): You called `replaceProps` on a component with a parent. This is an anti-pattern since props will get reactively updated when rendered. Instead, change the owner's `render` method to pass the correct value as props to the component where it is created.");
                var element = internalInstance._pendingElement || internalInstance._currentElement;
                internalInstance._pendingElement = ReactElement.cloneAndReplaceProps(element, props),
                enqueueUpdate(internalInstance)
            }
        },
        enqueueElementInternal: function(internalInstance, newElement) {
            internalInstance._pendingElement = newElement,
            enqueueUpdate(internalInstance)
        }
    };
    module.exports = ReactUpdateQueue
}),
__d("ReactLifeCycle", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactLifeCycle = {
        currentlyMountingInstance: null ,
        currentlyUnmountingInstance: null 
    };
    module.exports = ReactLifeCycle
}),
__d("ReactInstanceMap", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactInstanceMap = {
        remove: function(key) {
            key._reactInternalInstance = void 0
        },
        get: function(key) {
            return key._reactInternalInstance
        },
        has: function(key) {
            return void 0 !== key._reactInternalInstance
        },
        set: function(key, value) {
            key._reactInternalInstance = value
        }
    };
    module.exports = ReactInstanceMap
}),
__d("ReactUpdates", ["CallbackQueue", "PooledClass", "ReactCurrentOwner", "ReactPerf", "ReactReconciler", "Transaction", "Object.assign", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function ensureInjected() {
        invariant(ReactUpdates.ReactReconcileTransaction && batchingStrategy, "ReactUpdates: must inject a reconcile transaction class and batching strategy")
    }
    function ReactUpdatesFlushTransaction() {
        this.reinitializeTransaction(),
        this.dirtyComponentsLength = null ,
        this.callbackQueue = CallbackQueue.getPooled(),
        this.reconcileTransaction = ReactUpdates.ReactReconcileTransaction.getPooled()
    }
    function batchedUpdates(callback, a, b, c, d) {
        ensureInjected(),
        batchingStrategy.batchedUpdates(callback, a, b, c, d),
        Events.fire("batchedUpdates")
    }
    function mountOrderComparator(c1, c2) {
        return c1._mountOrder - c2._mountOrder
    }
    function runBatchedUpdates(transaction) {
        var len = transaction.dirtyComponentsLength;
        invariant(len === dirtyComponents.length, "Expected flush transaction's stored dirty-components length (%s) to match dirty-components array length (%s).", len, dirtyComponents.length),
        dirtyComponents.sort(mountOrderComparator);
        for (var i = 0; len > i; i++) {
            var component = dirtyComponents[i]
              , callbacks = component._pendingCallbacks;
            if (component._pendingCallbacks = null ,
            ReactReconciler.performUpdateIfNecessary(component, transaction.reconcileTransaction),
            callbacks)
                for (var j = 0; j < callbacks.length; j++)
                    transaction.callbackQueue.enqueue(callbacks[j], component.getPublicInstance())
        }
    }
    function enqueueUpdate(component) {
        return ensureInjected(),
        warning(null  == ReactCurrentOwner.current, "enqueueUpdate(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate."),
        batchingStrategy.isBatchingUpdates ? void dirtyComponents.push(component) : void batchingStrategy.batchedUpdates(enqueueUpdate, component)
    }
    function asap(callback, context) {
        invariant(batchingStrategy.isBatchingUpdates, "ReactUpdates.asap: Can't enqueue an asap callback in a context whereupdates are not being batched."),
        asapCallbackQueue.enqueue(callback, context),
        asapEnqueued = !0
    }
    var CallbackQueue = require("CallbackQueue")
      , PooledClass = require("PooledClass")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactPerf = require("ReactPerf")
      , ReactReconciler = require("ReactReconciler")
      , Transaction = require("Transaction")
      , assign = require("Object.assign")
      , invariant = require("invariant")
      , warning = require("warning")
      , dirtyComponents = []
      , asapCallbackQueue = CallbackQueue.getPooled()
      , asapEnqueued = !1
      , batchingStrategy = null 
      , Events = require("events")
      , NESTED_UPDATES = {
        initialize: function() {
            this.dirtyComponentsLength = dirtyComponents.length
        },
        close: function() {
            this.dirtyComponentsLength !== dirtyComponents.length ? (dirtyComponents.splice(0, this.dirtyComponentsLength),
            flushBatchedUpdates()) : dirtyComponents.length = 0
        }
    }
      , UPDATE_QUEUEING = {
        initialize: function() {
            this.callbackQueue.reset()
        },
        close: function() {
            this.callbackQueue.notifyAll()
        }
    }
      , TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];
    assign(ReactUpdatesFlushTransaction.prototype, Transaction.Mixin, {
        getTransactionWrappers: function() {
            return TRANSACTION_WRAPPERS
        },
        destructor: function() {
            this.dirtyComponentsLength = null ,
            CallbackQueue.release(this.callbackQueue),
            this.callbackQueue = null ,
            ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction),
            this.reconcileTransaction = null 
        },
        perform: function(method, scope, a) {
            return Transaction.Mixin.perform.call(this, this.reconcileTransaction.perform, this.reconcileTransaction, method, scope, a)
        }
    }),
    PooledClass.addPoolingTo(ReactUpdatesFlushTransaction);
    var flushBatchedUpdates = function() {
        for (; dirtyComponents.length || asapEnqueued; ) {
            if (dirtyComponents.length) {
                var transaction = ReactUpdatesFlushTransaction.getPooled();
                transaction.perform(runBatchedUpdates, null , transaction),
                ReactUpdatesFlushTransaction.release(transaction)
            }
            if (asapEnqueued) {
                asapEnqueued = !1;
                var queue = asapCallbackQueue;
                asapCallbackQueue = CallbackQueue.getPooled(),
                queue.notifyAll(),
                CallbackQueue.release(queue)
            }
        }
    }
    ;
    flushBatchedUpdates = ReactPerf.measure("ReactUpdates", "flushBatchedUpdates", flushBatchedUpdates);
    var ReactUpdatesInjection = {
        injectReconcileTransaction: function(ReconcileTransaction) {
            invariant(ReconcileTransaction, "ReactUpdates: must provide a reconcile transaction class"),
            ReactUpdates.ReactReconcileTransaction = ReconcileTransaction
        },
        injectBatchingStrategy: function(_batchingStrategy) {
            invariant(_batchingStrategy, "ReactUpdates: must provide a batching strategy"),
            invariant("function" == typeof _batchingStrategy.batchedUpdates, "ReactUpdates: must provide a batchedUpdates() function"),
            invariant("boolean" == typeof _batchingStrategy.isBatchingUpdates, "ReactUpdates: must provide an isBatchingUpdates boolean attribute"),
            batchingStrategy = _batchingStrategy
        }
    }
      , ReactUpdates = {
        ReactReconcileTransaction: null ,
        batchedUpdates: batchedUpdates,
        enqueueUpdate: enqueueUpdate,
        flushBatchedUpdates: flushBatchedUpdates,
        injection: ReactUpdatesInjection,
        asap: asap
    };
    module.exports = ReactUpdates
}),
__d("CallbackQueue", ["PooledClass", "Object.assign", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function CallbackQueue() {
        this._callbacks = null ,
        this._contexts = null 
    }
    var PooledClass = require("PooledClass")
      , assign = require("Object.assign")
      , invariant = require("invariant");
    assign(CallbackQueue.prototype, {
        enqueue: function(callback, context) {
            this._callbacks = this._callbacks || [],
            this._contexts = this._contexts || [],
            this._callbacks.push(callback),
            this._contexts.push(context)
        },
        notifyAll: function() {
            var callbacks = this._callbacks
              , contexts = this._contexts;
            if (callbacks) {
                invariant(callbacks.length === contexts.length, "Mismatched list of contexts in callback queue"),
                this._callbacks = null ,
                this._contexts = null ;
                for (var i = 0, l = callbacks.length; l > i; i++)
                    callbacks[i].call(contexts[i]);
                callbacks.length = 0,
                contexts.length = 0
            }
        },
        reset: function() {
            this._callbacks = null ,
            this._contexts = null 
        },
        destructor: function() {
            this.reset()
        }
    }),
    PooledClass.addPoolingTo(CallbackQueue),
    module.exports = CallbackQueue
}),
__d("ReactPerf", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function _noMeasure(objName, fnName, func) {
        return func
    }
    var ReactPerf = {
        enableMeasure: !1,
        storedMeasure: _noMeasure,
        measureMethods: function(object, objectName, methodNames) {
            if (__DEV__)
                for (var key in methodNames)
                    methodNames.hasOwnProperty(key) && (object[key] = ReactPerf.measure(objectName, methodNames[key], object[key]))
        },
        measure: function(objName, fnName, func) {
            if (__DEV__) {
                var measuredFunc = null 
                  , wrapper = function() {
                    return ReactPerf.enableMeasure ? (measuredFunc || (measuredFunc = ReactPerf.storedMeasure(objName, fnName, func)),
                    measuredFunc.apply(this, arguments)) : func.apply(this, arguments)
                }
                ;
                return wrapper.displayName = objName + "_" + fnName,
                wrapper
            }
            return func
        },
        injection: {
            injectMeasure: function(measure) {
                ReactPerf.storedMeasure = measure
            }
        }
    };
    module.exports = ReactPerf
}),
__d("ReactReconciler", ["ReactRef", "ReactElementValidator"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function attachRefs() {
        ReactRef.attachRefs(this, this._currentElement)
    }
    var ReactRef = require("ReactRef")
      , ReactElementValidator = require("ReactElementValidator")
      , ReactReconciler = {
        mountComponent: function(internalInstance, rootID, transaction, context) {
            var markup = internalInstance.mountComponent(rootID, transaction, context);
            return __DEV__ && ReactElementValidator.checkAndWarnForMutatedProps(internalInstance._currentElement),
            transaction.getReactMountReady().enqueue(attachRefs, internalInstance),
            markup
        },
        unmountComponent: function(internalInstance) {
            ReactRef.detachRefs(internalInstance, internalInstance._currentElement),
            internalInstance.unmountComponent()
        },
        receiveComponent: function(internalInstance, nextElement, transaction, context) {
            var prevElement = internalInstance._currentElement;
            if (nextElement !== prevElement || null  == nextElement._owner) {
                __DEV__ && ReactElementValidator.checkAndWarnForMutatedProps(nextElement);
                var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);
                refsChanged && ReactRef.detachRefs(internalInstance, prevElement),
                internalInstance.receiveComponent(nextElement, transaction, context),
                refsChanged && transaction.getReactMountReady().enqueue(attachRefs, internalInstance)
            }
        },
        performUpdateIfNecessary: function(internalInstance, transaction) {
            internalInstance.performUpdateIfNecessary(transaction)
        }
    };
    module.exports = ReactReconciler
}),
__d("ReactRef", ["ReactOwner"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function attachRef(ref, component, owner) {
        "function" == typeof ref ? ref(component.getPublicInstance()) : ReactOwner.addComponentAsRefTo(component, ref, owner)
    }
    function detachRef(ref, component, owner) {
        "function" == typeof ref ? ref(null ) : ReactOwner.removeComponentAsRefFrom(component, ref, owner)
    }
    var ReactOwner = require("ReactOwner")
      , ReactRef = {};
    ReactRef.attachRefs = function(instance, element) {
        var ref = element.ref;
        null  != ref && attachRef(ref, instance, element._owner)
    }
    ,
    ReactRef.shouldUpdateRefs = function(prevElement, nextElement) {
        return nextElement._owner !== prevElement._owner || nextElement.ref !== prevElement.ref
    }
    ,
    ReactRef.detachRefs = function(instance, element) {
        var ref = element.ref;
        null  != ref && detachRef(ref, instance, element._owner)
    }
    ,
    module.exports = ReactRef
}),
__d("ReactOwner", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , ReactOwner = {
        isValidOwner: function(object) {
            return !(!object || "function" != typeof object.attachRef || "function" != typeof object.detachRef)
        },
        addComponentAsRefTo: function(component, ref, owner) {
            invariant(ReactOwner.isValidOwner(owner), "addComponentAsRefTo(...): Only a ReactOwner can have refs. This usually means that you're trying to add a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). Try rendering this component inside of a new top-level component which will hold the ref."),
            owner.attachRef(ref, component)
        },
        removeComponentAsRefFrom: function(component, ref, owner) {
            invariant(ReactOwner.isValidOwner(owner), "removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This usually means that you're trying to remove a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). Try rendering this component inside of a new top-level component which will hold the ref."),
            owner.getPublicInstance().refs[ref] === component.getPublicInstance() && owner.detachRef(ref)
        }
    };
    module.exports = ReactOwner
}),
__d("ReactElementValidator", ["ReactElement", "ReactFragment", "ReactPropTypeLocations", "ReactPropTypeLocationNames", "ReactCurrentOwner", "ReactNativeComponent", "getIteratorFn", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
            var name = ReactCurrentOwner.current.getName();
            if (name)
                return " Check the render method of `" + name + "`."
        }
        return ""
    }
    function getName(instance) {
        var publicInstance = instance && instance.getPublicInstance();
        if (publicInstance) {
            var constructor = publicInstance.constructor;
            if (constructor)
                return constructor.displayName || constructor.name || void 0
        }
    }
    function getCurrentOwnerDisplayName() {
        var current = ReactCurrentOwner.current;
        return current && getName(current) || void 0
    }
    function validateExplicitKey(element, parentType) {
        element._store.validated || null  != element.key || (element._store.validated = !0,
        warnAndMonitorForKeyUse('Each child in an array or iterator should have a unique "key" prop.', element, parentType))
    }
    function validatePropertyKey(name, element, parentType) {
        NUMERIC_PROPERTY_REGEX.test(name) && warnAndMonitorForKeyUse("Child objects should have non-numeric keys so ordering is preserved.", element, parentType)
    }
    function warnAndMonitorForKeyUse(message, element, parentType) {
        var ownerName = getCurrentOwnerDisplayName()
          , parentName = "string" == typeof parentType ? parentType : parentType.displayName || parentType.name
          , useName = ownerName || parentName
          , memoizer = ownerHasKeyUseWarning[message] || (ownerHasKeyUseWarning[message] = {});
        if (!memoizer.hasOwnProperty(useName)) {
            memoizer[useName] = !0;
            var parentOrOwnerAddendum = ownerName ? " Check the render method of " + ownerName + "." : parentName ? " Check the React.render call using <" + parentName + ">." : ""
              , childOwnerAddendum = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
                var childOwnerName = getName(element._owner);
                childOwnerAddendum = " It was passed a child from " + childOwnerName + "."
            }
            warning(!1, message + "%s%s See http://fb.me/react-warning-keys for more information.", parentOrOwnerAddendum, childOwnerAddendum)
        }
    }
    function validateChildKeys(node, parentType) {
        if (Array.isArray(node))
            for (var i = 0; i < node.length; i++) {
                var child = node[i];
                ReactElement.isValidElement(child) && validateExplicitKey(child, parentType)
            }
        else if (ReactElement.isValidElement(node))
            node._store.validated = !0;
        else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (iteratorFn) {
                if (iteratorFn !== node.entries)
                    for (var step, iterator = iteratorFn.call(node); !(step = iterator.next()).done; )
                        ReactElement.isValidElement(step.value) && validateExplicitKey(step.value, parentType)
            } else if ("object" == typeof node) {
                var fragment = ReactFragment.extractIfFragment(node);
                for (var key in fragment)
                    fragment.hasOwnProperty(key) && validatePropertyKey(key, fragment[key], parentType)
            }
        }
    }
    function checkPropTypes(componentName, propTypes, props, location) {
        for (var propName in propTypes)
            if (propTypes.hasOwnProperty(propName)) {
                var error;
                try {
                    invariant("function" == typeof propTypes[propName], "%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.", componentName || "React class", ReactPropTypeLocationNames[location], propName),
                    error = propTypes[propName](props, propName, componentName, location)
                } catch (ex) {
                    error = ex
                }
                if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                    loggedTypeFailures[error.message] = !0;
                    var addendum = getDeclarationErrorAddendum(this);
                    warning(!1, "Failed propType: %s%s", error.message, addendum)
                }
            }
    }
    function warnForPropsMutation(propName, element) {
        var type = element.type
          , elementName = "string" == typeof type ? type : type.displayName
          , ownerName = element._owner ? element._owner.getPublicInstance().constructor.displayName : null 
          , warningKey = propName + "|" + elementName + "|" + ownerName;
        if (!warnedPropsMutations.hasOwnProperty(warningKey)) {
            warnedPropsMutations[warningKey] = !0;
            var elementInfo = "";
            elementName && (elementInfo = " <" + elementName + " />");
            var ownerInfo = "";
            ownerName && (ownerInfo = " The element was created by " + ownerName + "."),
            warning(!1, "Don't set .props.%s of the React component%s. Instead, specify the correct value when initially creating the element or use React.cloneElement to make a new element with updated props.%s", propName, elementInfo, ownerInfo)
        }
    }
    function is(a, b) {
        return a !== a ? b !== b : 0 === a && 0 === b ? 1 / a === 1 / b : a === b
    }
    function checkAndWarnForMutatedProps(element) {
        if (element._store) {
            var originalProps = element._store.originalProps
              , props = element.props;
            for (var propName in props)
                props.hasOwnProperty(propName) && (originalProps.hasOwnProperty(propName) && is(originalProps[propName], props[propName]) || (warnForPropsMutation(propName, element),
                originalProps[propName] = props[propName]))
        }
    }
    function validatePropTypes(element) {
        if (null  != element.type) {
            var componentClass = ReactNativeComponent.getComponentClassForElement(element)
              , name = componentClass.displayName || componentClass.name;
            componentClass.propTypes && checkPropTypes(name, componentClass.propTypes, element.props, ReactPropTypeLocations.prop),
            "function" == typeof componentClass.getDefaultProps && warning(componentClass.getDefaultProps.isReactClassApproved, "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.")
        }
    }
    var ReactElement = require("ReactElement")
      , ReactFragment = require("ReactFragment")
      , ReactPropTypeLocations = require("ReactPropTypeLocations")
      , ReactPropTypeLocationNames = require("ReactPropTypeLocationNames")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactNativeComponent = require("ReactNativeComponent")
      , getIteratorFn = require("getIteratorFn")
      , invariant = require("invariant")
      , warning = require("warning")
      , ownerHasKeyUseWarning = {}
      , loggedTypeFailures = {}
      , NUMERIC_PROPERTY_REGEX = /^\d+$/
      , warnedPropsMutations = {}
      , ReactElementValidator = {
        checkAndWarnForMutatedProps: checkAndWarnForMutatedProps,
        createElement: function(type, props, children) {
            warning(null  != type, "React.createElement: type should not be null or undefined. It should be a string (for DOM elements) or a ReactClass (for composite components).");
            var element = ReactElement.createElement.apply(this, arguments);
            if (null  == element)
                return element;
            for (var i = 2; i < arguments.length; i++)
                validateChildKeys(arguments[i], type);
            return validatePropTypes(element),
            element
        },
        createFactory: function(type) {
            var validatedFactory = ReactElementValidator.createElement.bind(null , type);
            if (validatedFactory.type = type,
            __DEV__)
                try {
                    Object.defineProperty(validatedFactory, "type", {
                        enumerable: !1,
                        get: function() {
                            return warning(!1, "Factory.type is deprecated. Access the class directly before passing it to createFactory."),
                            Object.defineProperty(this, "type", {
                                value: type
                            }),
                            type
                        }
                    })
                } catch (x) {}
            return validatedFactory
        },
        cloneElement: function(element, props, children) {
            for (var newElement = ReactElement.cloneElement.apply(this, arguments), i = 2; i < arguments.length; i++)
                validateChildKeys(arguments[i], newElement.type);
            return validatePropTypes(newElement),
            newElement
        }
    };
    module.exports = ReactElementValidator
}),
__d("ReactPropTypeLocations", ["keyMirror"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var keyMirror = require("keyMirror")
      , ReactPropTypeLocations = keyMirror({
        prop: null ,
        context: null ,
        childContext: null 
    });
    module.exports = ReactPropTypeLocations
}),
__d("keyMirror", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , keyMirror = function(obj) {
        var key, ret = {};
        invariant(obj instanceof Object && !Array.isArray(obj), "keyMirror(...): Argument must be an object.");
        for (key in obj)
            obj.hasOwnProperty(key) && (ret[key] = key);
        return ret
    }
    ;
    module.exports = keyMirror
}),
__d("ReactPropTypeLocationNames", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactPropTypeLocationNames = {};
    __DEV__ && (ReactPropTypeLocationNames = {
        prop: "prop",
        context: "context",
        childContext: "child context"
    }),
    module.exports = ReactPropTypeLocationNames
}),
__d("ReactNativeComponent", ["Object.assign", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getComponentClassForElement(element) {
        if ("function" == typeof element.type)
            return element.type;
        var tag = element.type
          , componentClass = tagToComponentClass[tag];
        return null  == componentClass && (tagToComponentClass[tag] = componentClass = autoGenerateWrapperClass(tag)),
        componentClass
    }
    function createInternalComponent(element) {
        return invariant(genericComponentClass, "There is no registered component for the tag %s", element.type),
        new genericComponentClass(element.type,element.props)
    }
    function createInstanceForText(text) {
        return new textComponentClass(text)
    }
    function isTextComponent(component) {
        return component instanceof textComponentClass
    }
    var assign = require("Object.assign")
      , invariant = require("invariant")
      , autoGenerateWrapperClass = null 
      , genericComponentClass = null 
      , tagToComponentClass = {}
      , textComponentClass = null 
      , ReactNativeComponentInjection = {
        injectGenericComponentClass: function(componentClass) {
            genericComponentClass = componentClass
        },
        injectTextComponentClass: function(componentClass) {
            textComponentClass = componentClass
        },
        injectComponentClasses: function(componentClasses) {
            assign(tagToComponentClass, componentClasses)
        },
        injectAutoWrapper: function(wrapperFactory) {
            autoGenerateWrapperClass = wrapperFactory
        }
    }
      , ReactNativeComponent = {
        getComponentClassForElement: getComponentClassForElement,
        createInternalComponent: createInternalComponent,
        createInstanceForText: createInstanceForText,
        isTextComponent: isTextComponent,
        injection: ReactNativeComponentInjection
    };
    module.exports = ReactNativeComponent
}),
__d("Transaction", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , Mixin = {
        reinitializeTransaction: function() {
            this.transactionWrappers = this.getTransactionWrappers(),
            this.wrapperInitData ? this.wrapperInitData.length = 0 : this.wrapperInitData = [],
            this._isInTransaction = !1
        },
        _isInTransaction: !1,
        getTransactionWrappers: null ,
        isInTransaction: function() {
            return !!this._isInTransaction
        },
        perform: function(method, scope, a, b, c, d, e, f) {
            invariant(!this.isInTransaction(), "Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction.");
            var errorThrown, ret;
            try {
                this._isInTransaction = !0,
                errorThrown = !0,
                this.initializeAll(0),
                ret = method.call(scope, a, b, c, d, e, f),
                errorThrown = !1
            } finally {
                try {
                    if (errorThrown)
                        try {
                            this.closeAll(0)
                        } catch (err) {}
                    else
                        this.closeAll(0)
                } finally {
                    this._isInTransaction = !1
                }
            }
            return ret
        },
        initializeAll: function(startIndex) {
            for (var transactionWrappers = this.transactionWrappers, i = startIndex; i < transactionWrappers.length; i++) {
                var wrapper = transactionWrappers[i];
                try {
                    this.wrapperInitData[i] = Transaction.OBSERVED_ERROR,
                    this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null 
                } finally {
                    if (this.wrapperInitData[i] === Transaction.OBSERVED_ERROR)
                        try {
                            this.initializeAll(i + 1)
                        } catch (err) {}
                }
            }
        },
        closeAll: function(startIndex) {
            invariant(this.isInTransaction(), "Transaction.closeAll(): Cannot close transaction when none are open.");
            for (var transactionWrappers = this.transactionWrappers, i = startIndex; i < transactionWrappers.length; i++) {
                var errorThrown, wrapper = transactionWrappers[i], initData = this.wrapperInitData[i];
                try {
                    errorThrown = !0,
                    initData !== Transaction.OBSERVED_ERROR && wrapper.close && wrapper.close.call(this, initData),
                    errorThrown = !1
                } finally {
                    if (errorThrown)
                        try {
                            this.closeAll(i + 1)
                        } catch (e) {}
                }
            }
            this.wrapperInitData.length = 0
        }
    }
      , Transaction = {
        Mixin: Mixin,
        OBSERVED_ERROR: {}
    };
    module.exports = Transaction
}),
__d("ReactErrorUtils", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactErrorUtils = {
        guard: function(func, name) {
            return func
        }
    };
    module.exports = ReactErrorUtils
}),
__d("keyOf", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var keyOf = function(oneKeyObj) {
        var key;
        for (key in oneKeyObj)
            if (oneKeyObj.hasOwnProperty(key))
                return key;
        return null 
    }
    ;
    module.exports = keyOf
}),
__d("ReactNativeDefaultInjection", ["InitializeJavaScriptAppEngine", "EventPluginHub", "EventPluginUtils", "IOSDefaultEventPluginOrder", "IOSNativeBridgeEventPlugin", "NodeHandle", "ReactClass", "ReactComponentEnvironment", "ReactDefaultBatchingStrategy", "ReactEmptyComponent", "ReactInstanceHandles", "ReactNativeComponentEnvironment", "ReactNativeGlobalInteractionHandler", "ReactNativeGlobalResponderHandler", "ReactNativeMount", "ReactNativeTextComponent", "ReactNativeComponent", "ReactUpdates", "ResponderEventPlugin", "UniversalWorkerNodeHandle", "createReactNativeComponentClass", "invariant", "RCTEventEmitter", "RCTJSTimers"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function inject() {
        EventPluginHub.injection.injectEventPluginOrder(IOSDefaultEventPluginOrder),
        EventPluginHub.injection.injectInstanceHandle(ReactInstanceHandles),
        ResponderEventPlugin.injection.injectGlobalResponderHandler(ReactNativeGlobalResponderHandler),
        ResponderEventPlugin.injection.injectGlobalInteractionHandler(ReactNativeGlobalInteractionHandler),
        EventPluginHub.injection.injectEventPluginsByName({
            ResponderEventPlugin: ResponderEventPlugin,
            IOSNativeBridgeEventPlugin: IOSNativeBridgeEventPlugin
        }),
        ReactUpdates.injection.injectReconcileTransaction(ReactNativeComponentEnvironment.ReactReconcileTransaction),
        ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy),
        ReactComponentEnvironment.injection.injectEnvironment(ReactNativeComponentEnvironment);
        var RCTView = createReactNativeComponentClass({
            validAttributes: {},
            uiViewClassName: "RCTView"
        });
        ReactEmptyComponent.injection.injectEmptyComponent(RCTView),
        EventPluginUtils.injection.injectMount(ReactNativeMount),
        ReactNativeComponent.injection.injectTextComponentClass(ReactNativeTextComponent),
        ReactNativeComponent.injection.injectAutoWrapper(function(tag) {
            var info = "";
            "string" == typeof tag && /^[a-z]/.test(tag) && (info += " Each component name should start with an uppercase letter."),
            invariant(!1, "Expected a component class, got %s.%s", tag, info)
        }),
        NodeHandle.injection.injectImplementation(UniversalWorkerNodeHandle)
    }
    require("InitializeJavaScriptAppEngine");
    var EventPluginHub = require("EventPluginHub")
      , EventPluginUtils = require("EventPluginUtils")
      , IOSDefaultEventPluginOrder = require("IOSDefaultEventPluginOrder")
      , IOSNativeBridgeEventPlugin = require("IOSNativeBridgeEventPlugin")
      , NodeHandle = require("NodeHandle")
      , ReactComponentEnvironment = (require("ReactClass"),
    require("ReactComponentEnvironment"))
      , ReactDefaultBatchingStrategy = require("ReactDefaultBatchingStrategy")
      , ReactEmptyComponent = require("ReactEmptyComponent")
      , ReactInstanceHandles = require("ReactInstanceHandles")
      , ReactNativeComponentEnvironment = require("ReactNativeComponentEnvironment")
      , ReactNativeGlobalInteractionHandler = require("ReactNativeGlobalInteractionHandler")
      , ReactNativeGlobalResponderHandler = require("ReactNativeGlobalResponderHandler")
      , ReactNativeMount = require("ReactNativeMount")
      , ReactNativeTextComponent = require("ReactNativeTextComponent")
      , ReactNativeComponent = require("ReactNativeComponent")
      , ReactUpdates = require("ReactUpdates")
      , ResponderEventPlugin = require("ResponderEventPlugin")
      , UniversalWorkerNodeHandle = require("UniversalWorkerNodeHandle")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , invariant = require("invariant");
    require("RCTEventEmitter"),
    require("RCTJSTimers"),
    module.exports = {
        inject: inject
    }
}),
__d("InitializeJavaScriptAppEngine", ["RCTDeviceEventEmitter", "ExceptionsManager", "ErrorUtils", "ExceptionsManager", "Platform", "JSTimers", "NativeModules", "Promise", "XMLHttpRequest", "fetch", "Geolocation", "WebSocket"], function(global, require, requireDynamic, requireLazy, module, exports) {
    function handleErrorWithRedBox(e, isFatal) {
        try {
            require("ExceptionsManager").handleException(e, isFatal)
        } catch (ee) {
            console.log("Failed to print error: ", ee.message)
        }
    }
    function setUpRedBoxErrorHandler() {
        var ErrorUtils = require("ErrorUtils");
        ErrorUtils.setGlobalHandler(handleErrorWithRedBox)
    }
    function setUpRedBoxConsoleErrorHandler() {
        var ExceptionsManager = require("ExceptionsManager")
          , Platform = require("Platform");
        __DEV__ && "ios" === Platform.OS && ExceptionsManager.installConsoleErrorReporter()
    }
    function setUpTimers() {
        var JSTimers = require("JSTimers");
        GLOBAL.setTimeout = JSTimers.setTimeout,
        GLOBAL.setInterval = JSTimers.setInterval,
        GLOBAL.setImmediate = JSTimers.setImmediate,
        GLOBAL.clearTimeout = JSTimers.clearTimeout,
        GLOBAL.clearInterval = JSTimers.clearInterval,
        GLOBAL.clearImmediate = JSTimers.clearImmediate,
        GLOBAL.cancelAnimationFrame = JSTimers.clearInterval,
        GLOBAL.requestAnimationFrame = function(cb) {
            return JSTimers.requestAnimationFrame(cb)
        }
    }
    function setUpAlert() {
        var RCTAlertManager = require("NativeModules").AlertManager;
        GLOBAL.alert || (GLOBAL.alert = function(text) {
            var alertOpts = {
                title: "Alert",
                message: "" + text,
                buttons: [{
                    cancel: "Okay"
                }]
            };
            RCTAlertManager.alertWithArgs(alertOpts, null )
        }
        )
    }
    function setUpPromise() {
        GLOBAL.Promise = require("Promise")
    }
    function setUpXHR() {
        GLOBAL.XMLHttpRequest = require("XMLHttpRequest");
        var fetchPolyfill = require("fetch");
        GLOBAL.fetch = fetchPolyfill.fetch,
        GLOBAL.Headers = fetchPolyfill.Headers,
        GLOBAL.Request = fetchPolyfill.Request,
        GLOBAL.Response = fetchPolyfill.Response
    }
    function setUpGeolocation() {
        GLOBAL.navigator = GLOBAL.navigator || {},
        GLOBAL.navigator.geolocation = require("Geolocation")
    }
    function setUpWebSockets() {
        GLOBAL.WebSocket = require("WebSocket")
    }
    require("RCTDeviceEventEmitter"),
    "undefined" == typeof GLOBAL && (GLOBAL = this),
    "undefined" == typeof window && (window = GLOBAL),
    setUpRedBoxErrorHandler(),
    setUpTimers(),
    setUpAlert(),
    setUpPromise(),
    setUpXHR(),
    setUpRedBoxConsoleErrorHandler(),
    setUpGeolocation(),
    setUpWebSockets()
}),
__d("RCTDeviceEventEmitter", ["EventEmitter"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var EventEmitter = require("EventEmitter")
      , RCTDeviceEventEmitter = new EventEmitter;
    module.exports = RCTDeviceEventEmitter
}),
__d("EventEmitter", ["EmitterSubscription", "ErrorUtils", "EventSubscriptionVendor", "emptyFunction", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    function EventEmitter() {
        "use strict";
        this.$EventEmitter_subscriber = new EventSubscriptionVendor
    }
    var EmitterSubscription = require("EmitterSubscription")
      , ErrorUtils = require("ErrorUtils")
      , EventSubscriptionVendor = require("EventSubscriptionVendor")
      , emptyFunction = require("emptyFunction")
      , invariant = require("invariant");
    EventEmitter.prototype.addListener = function(eventType, listener, context) {
        "use strict";
        return this.$EventEmitter_subscriber.addSubscription(eventType, new EmitterSubscription(this.$EventEmitter_subscriber,listener,context))
    }
    ,
    EventEmitter.prototype.once = function(eventType, listener, context) {
        "use strict";
        var emitter = this;
        return this.addListener(eventType, function() {
            emitter.removeCurrentListener(),
            listener.apply(context, arguments)
        })
    }
    ,
    EventEmitter.prototype.removeAllListeners = function(eventType) {
        "use strict";
        this.$EventEmitter_subscriber.removeAllSubscriptions(eventType)
    }
    ,
    EventEmitter.prototype.removeCurrentListener = function() {
        "use strict";
        invariant(!!this.$EventEmitter_currentSubscription, "Not in an emitting cycle; there is no current subscription"),
        this.$EventEmitter_subscriber.removeSubscription(this.$EventEmitter_currentSubscription)
    }
    ,
    EventEmitter.prototype.listeners = function(eventType) {
        "use strict";
        var subscriptions = this.$EventEmitter_subscriber.getSubscriptionsForType(eventType);
        return subscriptions ? subscriptions.filter(emptyFunction.thatReturnsTrue).map(function(subscription) {
            return subscription.listener
        }) : []
    }
    ,
    EventEmitter.prototype.emit = function(eventType) {
        "use strict";
        var subscriptions = this.$EventEmitter_subscriber.getSubscriptionsForType(eventType);
        if (subscriptions) {
            for (var keys = Object.keys(subscriptions), ii = 0; ii < keys.length; ii++) {
                var key = keys[ii]
                  , subscription = subscriptions[key];
                subscription && (this.$EventEmitter_currentSubscription = subscription,
                ErrorUtils.applyWithGuard(subscription.listener, subscription.context, Array.prototype.slice.call(arguments, 1), null , "EventEmitter:" + eventType))
            }
            this.$EventEmitter_currentSubscription = null 
        }
    }
    ,
    module.exports = EventEmitter
}),
__d("EmitterSubscription", ["EventSubscription"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function EmitterSubscription(subscriber, listener, context) {
        EventSubscription.call(this, subscriber),
        this.listener = listener,
        this.context = context
    }
    var EventSubscription = require("EventSubscription");
    for (var EventSubscription____Key in EventSubscription)
        EventSubscription.hasOwnProperty(EventSubscription____Key) && (EmitterSubscription[EventSubscription____Key] = EventSubscription[EventSubscription____Key]);
    var ____SuperProtoOfEventSubscription = null  === EventSubscription ? null  : EventSubscription.prototype;
    EmitterSubscription.prototype = Object.create(____SuperProtoOfEventSubscription),
    EmitterSubscription.prototype.constructor = EmitterSubscription,
    EmitterSubscription.__superConstructor__ = EventSubscription,
    module.exports = EmitterSubscription
}),
__d("EventSubscription", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function EventSubscription(subscriber) {
        this.subscriber = subscriber
    }
    EventSubscription.prototype.remove = function() {
        this.subscriber.removeSubscription(this)
    }
    ,
    module.exports = EventSubscription
}),
__d("ErrorUtils", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var GLOBAL = this;
    module.exports = GLOBAL.ErrorUtils
}),
__d("EventSubscriptionVendor", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function EventSubscriptionVendor() {
        this.$EventSubscriptionVendor_subscriptionsForType = {},
        this.$EventSubscriptionVendor_currentSubscription = null 
    }
    var invariant = require("invariant");
    EventSubscriptionVendor.prototype.addSubscription = function(eventType, subscription) {
        invariant(subscription.subscriber === this, "The subscriber of the subscription is incorrectly set."),
        this.$EventSubscriptionVendor_subscriptionsForType[eventType] || (this.$EventSubscriptionVendor_subscriptionsForType[eventType] = []);
        var key = this.$EventSubscriptionVendor_subscriptionsForType[eventType].length;
        return this.$EventSubscriptionVendor_subscriptionsForType[eventType].push(subscription),
        subscription.eventType = eventType,
        subscription.key = key,
        subscription
    }
    ,
    EventSubscriptionVendor.prototype.removeAllSubscriptions = function(eventType) {
        void 0 === eventType ? this.$EventSubscriptionVendor_subscriptionsForType = {} : delete this.$EventSubscriptionVendor_subscriptionsForType[eventType]
    }
    ,
    EventSubscriptionVendor.prototype.removeSubscription = function(subscription) {
        var eventType = subscription.eventType
          , key = subscription.key
          , subscriptionsForType = this.$EventSubscriptionVendor_subscriptionsForType[eventType];
        subscriptionsForType && delete subscriptionsForType[key]
    }
    ,
    EventSubscriptionVendor.prototype.getSubscriptionsForType = function(eventType) {
        return this.$EventSubscriptionVendor_subscriptionsForType[eventType]
    }
    ,
    module.exports = EventSubscriptionVendor
}),
__d("ExceptionsManager", ["NativeModules", "parseErrorStack", "stringifySafe"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function reportException(e, isFatal, stack) {
        RCTExceptionsManager && (stack || (stack = parseErrorStack(e)),
        RCTExceptionsManager.reportFatalException && RCTExceptionsManager.reportSoftException ? isFatal ? RCTExceptionsManager.reportFatalException(e.message, stack) : RCTExceptionsManager.reportSoftException(e.message, stack) : RCTExceptionsManager.reportUnhandledException(e.message, stack))
    }
    function handleException(e, isFatal) {
        var stack = parseErrorStack(e)
          , msg = "Error: " + e.message + "\n stack: \n" + stackToString(stack) + "\n URL: " + e.sourceURL + "\n line: " + e.line + "\n message: " + e.message;
        console.errorOriginal ? console.errorOriginal(msg) : console.error(msg),
        reportException(e, isFatal, stack)
    }
    function installConsoleErrorReporter() {
        console.reportException || (console.reportException = reportException,
        console.errorOriginal = console.error.bind(console),
        console.error = function() {
            if (console.errorOriginal.apply(null , arguments),
            console.reportErrorsAsExceptions) {
                var str = Array.prototype.map.call(arguments, stringifySafe).join(", ")
                  , error = new Error("console.error: " + str);
                error.framesToPop = 1,
                reportException(error, !1)
            }
        }
        ,
        void 0 === console.reportErrorsAsExceptions && (console.reportErrorsAsExceptions = !0))
    }
    function stackToString(stack) {
        var maxLength = Math.max.apply(null , stack.map(function(frame) {
            return frame.methodName.length
        }));
        return stack.map(function(frame) {
            return stackFrameToString(frame, maxLength)
        }).join("\n")
    }
    function stackFrameToString(stackFrame, maxLength) {
        var fileNameParts = stackFrame.file.split("/")
          , fileName = fileNameParts[fileNameParts.length - 1];
        fileName.length > 18 && (fileName = fileName.substr(0, 17) + "…");
        var spaces = fillSpaces(maxLength - stackFrame.methodName.length);
        return "  " + stackFrame.methodName + spaces + "  " + fileName + ":" + stackFrame.lineNumber
    }
    function fillSpaces(n) {
        return new Array(n + 1).join(" ")
    }
    var RCTExceptionsManager = require("NativeModules").ExceptionsManager
      , parseErrorStack = require("parseErrorStack")
      , stringifySafe = require("stringifySafe");
    module.exports = {
        handleException: handleException,
        installConsoleErrorReporter: installConsoleErrorReporter
    }
}),
__d("NativeModules", ["BatchedBridge", "nativeModulePrefixNormalizer"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeModules = require("BatchedBridge").RemoteModules
      , nativeModulePrefixNormalizer = require("nativeModulePrefixNormalizer");
    nativeModulePrefixNormalizer(NativeModules),
    module.exports = NativeModules
}),
__d("BatchedBridge", ["BatchedBridgeFactory", "MessageQueue"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var BatchedBridgeFactory = require("BatchedBridgeFactory")
      , MessageQueue = require("MessageQueue")
      , __fbBatchedBridgeConfig = JSON.parse('{"remoteModuleConfig":{"RCTAppState":{"methods":{"getCurrentAppState":{"type":"remote","methodID":0}},"moduleID":11},"RCTLocationObserver":{"methods":{"getCurrentPosition":{"type":"remote","methodID":2},"stopObserving":{"type":"remote","methodID":1},"startObserving":{"type":"remote","methodID":0}},"moduleID":7},"RCTTabBarItemManager":{"methods":{},"moduleID":29},"RCTNetworkImageViewManager":{"methods":{},"moduleID":9},"RCTViewManager":{"methods":{},"moduleID":24},"RCTTextManager":{"methods":{},"moduleID":23},"RCTScrollViewManager":{"methods":{"getContentSize":{"type":"remote","methodID":0}},"moduleID":28,"constants":{"KeyboardDismissMode":{"None":0,"Interactive":2,"OnDrag":1},"DecelerationRate":{"Normal":0.998,"Fast":0.99}}},"RCTRawTextManager":{"methods":{},"moduleID":13},"RCTPickerManager":{"methods":{},"moduleID":8,"constants":{"ComponentWidth":375,"ComponentHeight":216}},"RCTTextViewManager":{"methods":{},"moduleID":31},"RCTNavItemManager":{"methods":{},"moduleID":21},"RCTDevMenu":{"methods":{"show":{"type":"remote","methodID":0},"reload":{"type":"remote","methodID":1}},"moduleID":20},"RCTSliderManager":{"methods":{},"moduleID":3},"RCTExceptionsManager":{"methods":{"reportSoftException":{"type":"remote","methodID":0},"reportUnhandledException":{"type":"remote","methodID":3},"reportFatalException":{"type":"remote","methodID":1},"updateExceptionMessage":{"type":"remote","methodID":2}},"moduleID":0},"RCTAlertManager":{"methods":{"alertWithArgs":{"type":"remote","methodID":0}},"moduleID":6},"RCTWebViewManager":{"methods":{"goForward":{"type":"remote","methodID":1},"goBack":{"type":"remote","methodID":0},"reload":{"type":"remote","methodID":2}},"moduleID":19,"constants":{"NavigationType":{"Other":5,"BackForward":2,"LinkClicked":0,"FormSubmitted":1,"Reload":3,"FormResubmitted":4}}},"RCTAsyncLocalStorage":{"methods":{"multiSet":{"type":"remote","methodID":1},"multiRemove":{"type":"remote","methodID":2},"clear":{"type":"remote","methodID":3},"multiGet":{"type":"remote","methodID":0},"getAllKeys":{"type":"remote","methodID":4}},"moduleID":15},"RCTStatusBarManager":{"methods":{"setStyle":{"type":"remote","methodID":0},"setHidden":{"type":"remote","methodID":1}},"moduleID":27,"constants":{"Style":{"default":0,"lightContent":1},"Animation":{"slide":2,"fade":1,"none":0}}},"RCTNavigatorManager":{"methods":{"requestSchedulingJavaScriptNavigation":{"type":"remote","methodID":0}},"moduleID":2},"RCTActivityIndicatorViewManager":{"methods":{},"moduleID":33},"RCTVibration":{"methods":{"vibrate":{"type":"remote","methodID":0}},"moduleID":12},"RCTTextFieldManager":{"methods":{},"moduleID":10},"RCTMapManager":{"methods":{},"moduleID":34},"RCTCameraRollManager":{"methods":{"getPhotos":{"type":"remote","methodID":1},"saveImageWithTag":{"type":"remote","methodID":0}},"moduleID":16},"RCTLinkingManager":{"methods":{"openURL":{"type":"remote","methodID":0},"canOpenURL":{"type":"remote","methodID":1}},"moduleID":30,"constants":{"initialURL":null}},"RCTSourceCode":{"methods":{"getScriptText":{"type":"remote","methodID":0}},"moduleID":22,"constants":{"scriptURL":"http://localhost:8081/index.ios.bundle"}},"RCTSwitchManager":{"methods":{},"moduleID":1},"RCTActionSheetManager":{"methods":{"showShareActionSheetWithOptions":{"type":"remote","methodID":1},"showActionSheetWithOptions":{"type":"remote","methodID":0}},"moduleID":32},"RCTSegmentedControlManager":{"methods":{},"moduleID":4,"constants":{"ComponentHeight":28}},"RCTAdSupport":{"methods":{"getAdvertisingTrackingEnabled":{"type":"remote","methodID":1},"getAdvertisingId":{"type":"remote","methodID":0}},"moduleID":17},"RCTTabBarManager":{"methods":{},"moduleID":26},"RCTUIManager":{"methods":{"createView":{"type":"remote","methodID":4},"setJSResponder":{"type":"remote","methodID":16},"setMainScrollViewTag":{"type":"remote","methodID":12},"removeRootView":{"type":"remote","methodID":1},"clearJSResponder":{"type":"remote","methodID":17},"zoomToRect":{"type":"remote","methodID":15},"configureNextLayoutAnimation":{"type":"remote","methodID":18},"updateView":{"type":"remote","methodID":5},"removeSubviewsFromContainerWithID":{"type":"remote","methodID":0},"manageChildren":{"type":"remote","methodID":3},"blur":{"type":"remote","methodID":7},"focus":{"type":"remote","methodID":6},"measureViewsInRect":{"type":"remote","methodID":11},"scrollTo":{"type":"remote","methodID":13},"measureLayoutRelativeToParent":{"type":"remote","methodID":10},"measure":{"type":"remote","methodID":8},"replaceExistingNonRootView":{"type":"remote","methodID":2},"measureLayout":{"type":"remote","methodID":9},"scrollWithoutAnimationTo":{"type":"remote","methodID":14}},"moduleID":25,"constants":{"RCTTextView":{"nativeProps":{"autoCorrect":"BOOL","placeholderTextColor":"UIColor","returnKeyType":"UIReturnKeyType","keyboardType":"UIKeyboardType","autoCapitalize":"UITextAutocapitalizationType","fontStyle":"NSString","fontWeight":"NSString","enablesReturnKeyAutomatically":"BOOL","color":"UIColor","editable":"BOOL","text":"NSString","placeholder":"NSString","clearTextOnFocus":"BOOL","fontSize":"CGFloat","selectTextOnFocus":"BOOL","fontFamily":"NSString"}},"RCTSwitch":{"nativeProps":{"thumbTintColor":"UIColor","tintColor":"UIColor","onTintColor":"UIColor","value":"BOOL","disabled":"BOOL"}},"customDirectEventTypes":{"topMomentumScrollBegin":{"registrationName":"onMomentumScrollBegin"},"topScrollEndDrag":{"registrationName":"onScrollEndDrag"},"topSelectionChange":{"registrationName":"onSelectionChange"},"topScroll":{"registrationName":"onScroll"},"topLoadingStart":{"registrationName":"onLoadingStart"},"topLoadingError":{"registrationName":"onLoadingError"},"topPullToRefresh":{"registrationName":"onPullToRefresh"},"topNavigationProgress":{"registrationName":"onNavigationProgress"},"topScrollBeginDrag":{"registrationName":"onScrollBeginDrag"},"topLoadingFinish":{"registrationName":"onLoadingFinish"},"topScrollAnimationEnd":{"registrationName":"onScrollAnimationEnd"},"topLayout":{"registrationName":"onLayout"},"topMomentumScrollEnd":{"registrationName":"onMomentumScrollEnd"}},"RCTRawText":{"nativeProps":{"text":"NSString"}},"RCTNavigator":{"nativeProps":{"requestedTopOfStack":"NSInteger"}},"UIReturnKeyType":{"google":2,"search":6,"send":7,"yahoo":8,"join":3,"next":4,"done":9,"emergency-call":10,"go":1,"route":5,"default":0},"RCTScrollView":{"Constants":{"KeyboardDismissMode":{"None":0,"Interactive":2,"OnDrag":1},"DecelerationRate":{"Normal":0.998,"Fast":0.99}},"nativeProps":{"showsVerticalScrollIndicator":"BOOL","scrollEventThrottle":"NSTimeInterval","contentOffset":"CGPoint","showsHorizontalScrollIndicator":"BOOL","directionalLockEnabled":"BOOL","decelerationRate":"CGFloat","alwaysBounceHorizontal":"BOOL","scrollsToTop":"BOOL","scrollbarattr":"Object","maximumZoomScale":"CGFloat","keyboardDismissMode":"UIScrollViewKeyboardDismissMode","centerContent":"BOOL","minimumZoomScale":"CGFloat","stickyHeaderIndices":"NSIndexSet","scrollEnabled":"BOOL","bounces":"BOOL","pagingEnabled":"BOOL","scrollIndicatorInsets":"UIEdgeInsets","alwaysBounceVertical":"BOOL","contentInset":"UIEdgeInsets","bouncesZoom":"BOOL","automaticallyAdjustContentInsets":"BOOL","zoomScale":"CGFloat","canCancelContentTouches":"BOOL"}},"customBubblingEventTypes":{"topTap":{"phasedRegistrationNames":{"bubbled":"onPress","captured":"onPressCapture"}},"topEndEditing":{"phasedRegistrationNames":{"bubbled":"onEndEditing","captured":"onEndEditingCapture"}},"topVisibleCellsChange":{"phasedRegistrationNames":{"bubbled":"onVisibleCellsChange","captured":"onVisibleCellsChangeCapture"}},"topNavigateBack":{"phasedRegistrationNames":{"bubbled":"onNavigationComplete","captured":"onNavigationCompleteCapture"}},"topSubmitEditing":{"phasedRegistrationNames":{"bubbled":"onSubmitEditing","captured":"onSubmitEditingCapture"}},"topTouchStart":{"phasedRegistrationNames":{"bubbled":"onTouchStart","captured":"onTouchStartCapture"}},"topTextInput":{"phasedRegistrationNames":{"bubbled":"onTextInput","captured":"onTextInputCapture"}},"topTouchMove":{"phasedRegistrationNames":{"bubbled":"onTouchMove","captured":"onTouchMoveCapture"}},"topTouchEnd":{"phasedRegistrationNames":{"bubbled":"onTouchEnd","captured":"onTouchEndCapture"}},"topBlur":{"phasedRegistrationNames":{"bubbled":"onBlur","captured":"onBlurCapture"}},"topTouchCancel":{"phasedRegistrationNames":{"bubbled":"onTouchCancel","captured":"onTouchCancelCapture"}},"topNavRightButtonTap":{"phasedRegistrationNames":{"bubbled":"onNavRightButtonTap","captured":"onNavRightButtonTapCapture"}},"topNavLeftButtonTap":{"phasedRegistrationNames":{"bubbled":"onNavLeftButtonTap","captured":"onNavLefttButtonTapCapture"}},"topFocus":{"phasedRegistrationNames":{"bubbled":"onFocus","captured":"onFocusCapture"}},"topChange":{"phasedRegistrationNames":{"bubbled":"onChange","captured":"onChangeCapture"}}},"RCTSegmentedControl":{"Constants":{"ComponentHeight":28},"nativeProps":{"momentary":"BOOL","tintColor":"UIColor","enabled":"BOOL","selectedIndex":"NSInteger","values":"NSStringArray"}},"RCTSlider":{"nativeProps":{"value":"float","minimumValue":"float","maximumValue":"float","maximumTrackTintColor":"UIColor","minimumTrackTintColor":"UIColor"}},"RCTPicker":{"Constants":{"ComponentWidth":375,"ComponentHeight":216},"nativeProps":{"selectedIndex":"NSInteger","items":"NSDictionaryArray"}},"RCTNetworkImageView":{"nativeProps":{"title":"NSString","visible":"BOOL","contentMode":"UIViewContentMode","defaultImageSrc":"UIImage","src":"NSURL"}},"RCTGif":{"nativeProps":{"title":"NSString","visible":"BOOL","contentMode":"UIViewContentMode","defaultImageSrc":"UIImage","src":"NSURL"}},"RCTTabBarItem":{"nativeProps":{"title":"NSString","icon":"NSString","selected":"BOOL","selectedIcon":"UIImage","badge":"NSString"}},"StyleConstants":{"PointerEventsValues":{"auto":0,"box-none":2,"none":1,"box-only":3}},"RCTDatePicker":{"Constants":{"ComponentWidth":375,"ComponentHeight":216,"DatePickerModes":{"date":1,"time":0,"datetime":2}},"nativeProps":{"mode":"UIDatePickerMode","timeZoneOffsetInMinutes":"NSTimeZone","minuteInterval":"NSInteger","date":"NSDate","minimumDate":"NSDate","maximumDate":"NSDate"}},"RCTText":{"nativeProps":{"containerBackgroundColor":"UIColor","writingDirection":"NSWritingDirection","lineHeight":"CGFloat","maximumNumberOfLines":"NSInteger","backgroundColor":"UIColor","hoverColor":"UIColor","cursor":"NSString","hoverBkColor":"UIColor","backgroundImage":"NSString","background":"NSString","fontStyle":"NSString","fontWeight":"NSString","color":"UIColor","shadowOffset":"CGSize","textAlign":"NSTextAlignment","letterSpacing":"CGFloat","numberOfLines":"NSInteger","fontSize":"CGFloat","isHighlighted":"BOOL","fontFamily":"NSString"}},"UIView":{"ContentMode":{"Redraw":3,"ScaleAspectFit":1,"BottomLeft":11,"BottomRight":12,"Left":7,"Right":8,"TopRight":10,"ScaleAspectFill":2,"Center":4,"Top":5,"Bottom":6,"TopLeft":9,"ScaleToFill":0}},"UIText":{"AutocapitalizationType":{"words":1,"characters":3,"sentences":2,"none":0}},"UIKeyboardType":{"numbers-and-punctuation":2,"url":3,"name-phone-pad":6,"twitter":9,"number-pad":4,"ascii-capable":1,"phone-pad":5,"email-address":7,"decimal-pad":8,"web-search":10,"default":0},"Dimensions":{"window":{"width":375,"scale":2,"height":667},"modalFullscreenView":{"width":375,"height":667}},"RCTTextField":{"nativeProps":{"autoCorrect":"BOOL","placeholderTextColor":"UIColor","secureTextEntry":"BOOL","returnKeyType":"UIReturnKeyType","keyboardType":"UIKeyboardType","autoCapitalize":"UITextAutocapitalizationType","fontStyle":"NSString","fontWeight":"NSString","enablesReturnKeyAutomatically":"BOOL","clearButtonMode":"UITextFieldViewMode","color":"UIColor","enabled":"BOOL","caretHidden":"BOOL","placeholder":"NSString","text":"NSString","clearTextOnFocus":"BOOL","selectTextOnFocus":"BOOL","fontSize":"CGFloat","fontFamily":"NSString"}},"NSTextAlignment":{"Left":0,"Center":1,"Right":2},"RCTStaticImage":{"nativeProps":{"title":"NSString","tintColor":"UIColor","contentMode":"UIViewContentMode","capInsets":"UIEdgeInsets","imageTag":"NSString","src":"NSURL"}},"RCTView":{"nativeProps":{"borderLeftWidth":"CGFloat","paddingRight":"CGFloat","marginRight":"CGFloat","backgroundColor":"UIColor","hoverColor":"UIColor","visible":"BOOL","cursor":"NSString","hoverBkColor":"UIColor","backgroundImage":"NSString","background":"NSString","borderTopWidth":"CGFloat","borderLeftColor":"UIColor","removeClippedSubviews":"BOOL","flexWrap":"css_wrap_type_t","marginVertical":"CGFloat","position":"css_position_type_t","flex":"CGFloat","paddingBottom":"CGFloat","borderTopColor":"UIColor","paddingTop":"CGFloat","justifyContent":"css_justify_t","padding":"CGFloat","marginBottom":"CGFloat","pointerEvents":"RCTPointerEvents","shadowColor":"CGColor","top":"CGFloat","transformMatrix":"CATransform3D","left":"CGFloat","alignSelf":"css_align_t","borderTopLeftRadius":"CGFloat","borderBottomWidth":"CGFloat","borderColor":"CGColor","flexDirection":"css_flex_direction_t","borderTopRightRadius":"CGFloat","alignItems":"css_align_t","margin":"CGFloat","marginHorizontal":"CGFloat","borderRadius":"CGFloat","opacity":"CGFloat","paddingLeft":"CGFloat","shadowOpacity":"float","right":"CGFloat","borderBottomLeftRadius":"CGFloat","height":"CGFloat","borderWidth":"CGFloat","paddingVertical":"CGFloat","shadowOffset":"CGSize","accessible":"BOOL","borderRightColor":"UIColor","overflow":"css_overflow","accessibilityLabel":"NSString","paddingHorizontal":"CGFloat","borderBottomColor":"UIColor","borderBottomRightRadius":"CGFloat","borderRightWidth":"CGFloat","marginTop":"CGFloat","testID":"NSString","width":"CGFloat","bottom":"CGFloat","marginLeft":"CGFloat","onLayout":"BOOL","shadowRadius":"CGFloat"}},"RCTActivityIndicatorView":{"nativeProps":{"size":"UIActivityIndicatorViewStyle","hidesWhenStopped":"BOOL","animating":"BOOL","color":"UIColor"}},"UITextField":{"clearButtonMode":{"while-editing":1,"never":0,"unless-editing":2,"always":3}},"RCTNavItem":{"nativeProps":{"backButtonTitle":"NSString","rightButtonTitle":"NSString","leftButtonTitle":"NSString","navigationBarHidden":"BOOL","titleTextColor":"UIColor","backButtonIcon":"UIImage","tintColor":"UIColor","title":"NSString","rightButtonIcon":"UIImage","barTintColor":"UIColor","leftButtonIcon":"UIImage"}},"RCTWebView":{"Constants":{"NavigationType":{"Other":5,"BackForward":2,"LinkClicked":0,"FormSubmitted":1,"Reload":3,"FormResubmitted":4}},"nativeProps":{"automaticallyAdjustContentInsets":"BOOL","shouldInjectAJAXHandler":"BOOL","contentInset":"UIEdgeInsets","html":"NSString","bounces":"BOOL","scrollEnabled":"BOOL","url":"NSURL"}},"RCTMap":{"nativeProps":{"region":"MKCoordinateRegion","showsUserLocation":"BOOL","rotateEnabled":"BOOL","annotations":"MKShapeArray","scrollEnabled":"BOOL","maxDelta":"CGFloat","zoomEnabled":"BOOL","minDelta":"CGFloat","legalLabelInsets":"UIEdgeInsets","pitchEnabled":"BOOL"}},"RCTTabBar":{"nativeProps":{}}}},"RCTDatePickerManager":{"methods":{},"moduleID":18,"constants":{"ComponentWidth":375,"ComponentHeight":216,"DatePickerModes":{"date":1,"time":0,"datetime":2}}},"RCTTiming":{"methods":{"deleteTimer":{"type":"remote","methodID":1},"createTimer":{"type":"remote","methodID":0}},"moduleID":5},"RCTStaticImageManager":{"methods":{},"moduleID":14}},"localModulesConfig":{"AppRegistry":{"methods":{"runApplication":{"type":"local","methodID":0}},"moduleID":4},"RCTDeviceEventEmitter":{"methods":{"emit":{"type":"local","methodID":0}},"moduleID":5},"ReactNative":{"methods":{"unmountComponentAtNodeAndRemoveContainer":{"type":"local","methodID":0}},"moduleID":3},"RCTJSTimers":{"methods":{"callTimers":{"type":"local","methodID":0}},"moduleID":0},"RCTEventEmitter":{"methods":{"receiveTouches":{"type":"local","methodID":1},"receiveEvent":{"type":"local","methodID":0},"mouseEvents":{"type":"local","methodID":2},"keyEvents":{"type":"local","methodID":3}},"moduleID":2},"RCTNativeAppEventEmitter":{"methods":{"emit":{"type":"local","methodID":0}},"moduleID":1}}}')
      , remoteModulesConfig = __fbBatchedBridgeConfig.remoteModuleConfig
      , localModulesConfig = __fbBatchedBridgeConfig.localModulesConfig
      , BatchedBridge = BatchedBridgeFactory.create(MessageQueue, remoteModulesConfig, localModulesConfig);
    BatchedBridge._config = remoteModulesConfig,
    module.exports = BatchedBridge
}),
__d("BatchedBridgeFactory", ["invariant", "keyMirror", "mapObject", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , keyMirror = require("keyMirror")
      , mapObject = require("mapObject")
      , warning = require("warning")
      , slice = Array.prototype.slice
      , MethodTypes = keyMirror({
        remote: null ,
        local: null 
    })
      , BatchedBridgeFactory = {
        MethodTypes: MethodTypes,
        _createBridgedModule: function(messageQueue, moduleConfig, moduleName) {
            var remoteModule = mapObject(moduleConfig.methods, function(methodConfig, memberName) {
                return methodConfig.type === MethodTypes.local ? null  : function() {
                    var lastArg = arguments.length > 0 ? arguments[arguments.length - 1] : null 
                      , secondLastArg = arguments.length > 1 ? arguments[arguments.length - 2] : null 
                      , hasSuccCB = "function" == typeof lastArg
                      , hasErrorCB = "function" == typeof secondLastArg;
                    hasErrorCB && invariant(hasSuccCB, "Cannot have a non-function arg after a function arg.");
                    var numCBs = (hasSuccCB ? 1 : 0) + (hasErrorCB ? 1 : 0)
                      , args = slice.call(arguments, 0, arguments.length - numCBs)
                      , onSucc = hasSuccCB ? lastArg : null 
                      , onFail = hasErrorCB ? secondLastArg : null ;
                    return messageQueue.call(moduleName, memberName, args, onFail, onSucc)
                }
            });
            for (var constName in moduleConfig.constants)
                warning(!remoteModule[constName], "saw constant and method named %s", constName),
                remoteModule[constName] = moduleConfig.constants[constName];
            return remoteModule
        },
        create: function(MessageQueue, modulesConfig, localModulesConfig) {
            var messageQueue = new MessageQueue(modulesConfig,localModulesConfig);
            return {
                callFunction: messageQueue.callFunction.bind(messageQueue),
                callFunctionReturnFlushedQueue: messageQueue.callFunctionReturnFlushedQueue.bind(messageQueue),
                invokeCallback: messageQueue.invokeCallback.bind(messageQueue),
                invokeCallbackAndReturnFlushedQueue: messageQueue.invokeCallbackAndReturnFlushedQueue.bind(messageQueue),
                flushedQueue: messageQueue.flushedQueue.bind(messageQueue),
                RemoteModules: mapObject(modulesConfig, this._createBridgedModule.bind(this, messageQueue)),
                setLoggingEnabled: messageQueue.setLoggingEnabled.bind(messageQueue),
                getLoggedOutgoingItems: messageQueue.getLoggedOutgoingItems.bind(messageQueue),
                getLoggedIncomingItems: messageQueue.getLoggedIncomingItems.bind(messageQueue),
                replayPreviousLog: messageQueue.replayPreviousLog.bind(messageQueue),
                processBatch: messageQueue.processBatch.bind(messageQueue)
            }
        }
    };
    module.exports = BatchedBridgeFactory
}),
__d("mapObject", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function mapObject(object, callback, context) {
        if (!object)
            return null ;
        var result = {};
        for (var name in object)
            hasOwnProperty.call(object, name) && (result[name] = callback.call(context, object[name], name, object));
        return result
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    module.exports = mapObject
}),
__d("MessageQueue", ["ErrorUtils", "ReactUpdates", "invariant", "warning", "JSTimersExecution"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ErrorUtils = require("ErrorUtils")
      , ReactUpdates = require("ReactUpdates")
      , invariant = require("invariant")
      , JSTimersExecution = (require("warning"),
    require("JSTimersExecution"))
      , INTERNAL_ERROR = "Error in MessageQueue implementation"
      , DEBUG_SPY_MODE = !1
      , requireFunc = require
      , jsCall = function(module, methodName, params) {
        return module[methodName].apply(module, params)
    }
      , MessageQueue = function(remoteModulesConfig, localModulesConfig, customRequire) {
        this._requireFunc = customRequire || requireFunc,
        this._initBookeeping(),
        this._initNamingMap(remoteModulesConfig, localModulesConfig)
    }
      , REQUEST_MODULE_IDS = 0
      , REQUEST_METHOD_IDS = 1
      , REQUEST_PARAMSS = 2
      , RESPONSE_CBIDS = 3
      , RESPONSE_RETURN_VALUES = 4
      , applyWithErrorReporter = function(fun, context, args) {
        try {
            return fun.apply(context, args)
        } catch (e) {
            ErrorUtils.reportFatalError(e)
        }
    }
      , guardReturn = function(operation, operationArguments, getReturnValue, context) {
        return operation && applyWithErrorReporter(operation, context, operationArguments),
        getReturnValue ? JSON.stringify(applyWithErrorReporter(getReturnValue, context, null )) : null 
    }
      , callNativeRender = require("callNativeRender").call
      , createBookkeeping = function() {
        return {
            GUID: 1,
            errorCallbackIDForSuccessCallbackID: function(successID) {
                return successID + 1
            },
            successCallbackIDForErrorCallbackID: function(errorID) {
                return errorID - 1
            },
            allocateCallbackIDs: function(res) {
                res.successCallbackID = this.GUID++,
                res.errorCallbackID = this.GUID++
            },
            isSuccessCallback: function(id) {
                return id % 2 === 1
            }
        }
    }
      , MessageQueueMixin = {
        _initNamingMap: function(remoteModulesConfig, localModulesConfig) {
            function fillMappings(modulesConfig, moduleNameToModuleID, moduleIDToModuleName, moduleNameToMethodNameToID, moduleNameToMethodIDToName) {
                for (var moduleName in modulesConfig) {
                    var moduleConfig = modulesConfig[moduleName]
                      , moduleID = moduleConfig.moduleID;
                    moduleNameToModuleID[moduleName] = moduleID,
                    moduleIDToModuleName[moduleID] = moduleName,
                    moduleNameToMethodNameToID[moduleName] = {},
                    moduleNameToMethodIDToName[moduleName] = {};
                    var methods = moduleConfig.methods;
                    for (var methodName in methods) {
                        var methodID = methods[methodName].methodID;
                        moduleNameToMethodNameToID[moduleName][methodName] = methodID,
                        moduleNameToMethodIDToName[moduleName][methodID] = methodName
                    }
                }
            }
            this._remoteModuleNameToModuleID = {},
            this._remoteModuleIDToModuleName = {},
            this._remoteModuleNameToMethodNameToID = {},
            this._remoteModuleNameToMethodIDToName = {},
            this._localModuleNameToModuleID = {},
            this._localModuleIDToModuleName = {},
            this._localModuleNameToMethodNameToID = {},
            this._localModuleNameToMethodIDToName = {},
            fillMappings(remoteModulesConfig, this._remoteModuleNameToModuleID, this._remoteModuleIDToModuleName, this._remoteModuleNameToMethodNameToID, this._remoteModuleNameToMethodIDToName),
            fillMappings(localModulesConfig, this._localModuleNameToModuleID, this._localModuleIDToModuleName, this._localModuleNameToMethodNameToID, this._localModuleNameToMethodIDToName)
        },
        _initBookeeping: function() {
            this._POOLED_CBIDS = {
                errorCallbackID: null ,
                successCallbackID: null 
            },
            this._bookkeeping = createBookkeeping(),
            this._threadLocalCallbacksByID = [],
            this._threadLocalScopesByID = [],
            this._outgoingItems = [[], [], [], [], []],
            this._outgoingItemsSwap = [[], [], [], [], []]
        },
        invokeCallback: function(cbID, args) {
            return guardReturn(this._invokeCallback, [cbID, args], null , this)
        },
        _invokeCallback: function(cbID, args) {
            try {
                var cb = this._threadLocalCallbacksByID[cbID]
                  , scope = this._threadLocalScopesByID[cbID];
                console.warning(cb, "Cannot find callback with CBID %s. Native module may have invoked both the success callback and the error callback.", cbID),
                DEBUG_SPY_MODE && console.log("N->JS: Callback#" + cbID + "(" + JSON.stringify(args) + ")"),
                cb.apply(scope, args)
            } catch (ie_requires_catch) {
                throw ie_requires_catch
            } finally {
                this._freeResourcesForCallbackID(cbID)
            }
        },
        invokeCallbackAndReturnFlushedQueue: function(cbID, args) {
            return this._enableLogging && this._loggedIncomingItems.push([(new Date).getTime(), cbID, args]),
            guardReturn(this._invokeCallback, [cbID, args], this._flushedQueueUnguarded, this)
        },
        callFunction: function(moduleID, methodID, params) {
            return guardReturn(this._callFunction, [moduleID, methodID, params], null , this)
        },
        _callFunction: function(moduleID, methodID, params) {
            var moduleName = this._localModuleIDToModuleName[moduleID]
              , methodName = this._localModuleNameToMethodIDToName[moduleName][methodID];
            DEBUG_SPY_MODE && console.log("N->JS: " + moduleName + "." + methodName + "(" + JSON.stringify(params) + ")");
            var ret = jsCall(this._requireFunc(moduleName), methodName, params);
            return ret
        },
        callFunctionReturnFlushedQueue: function(moduleID, methodID, params) {
            return this._enableLogging && this._loggedIncomingItems.push([(new Date).getTime(), moduleID, methodID, params]),
            guardReturn(this._callFunction, [moduleID, methodID, params], this._flushedQueueUnguarded, this)
        },
        processBatch: function(batch) {
            var self = this
              , events = require("events");
            return guardReturn(function() {
                ReactUpdates.batchedUpdates(function() {
                    batch.forEach(function(call) {
                        if ("callFunctionReturnFlushedQueue" === call.method) {
                            if (call.args[2] && "resize" == call.args[2][0])
                                events.fire("resize", call.args[2][1][0]);
                            else if (call.args[2]) {
                                var tmp = call.args[2][0];
                                call.args[2][0] = "top" + tmp.substring(0, 1).toUpperCase() + tmp.substring(1, tmp.length),
                                self._callFunction.apply(self, call.args)
                            }
                        } else if ("invokeCallbackAndReturnFlushedQueue" === call.method)
                            self._invokeCallback.apply(self, call.args);
                        else {
                            if ("customizedEvents" !== call.method)
                                throw new Error("Unrecognized method called on BatchedBridge: " + call.method);
                            events.fire(call.args[0], call.args[1]),
                            "isPStyle" == call.args[0] && (require("Platform").OS = "pstyle")
                        }
                    })
                })
            }, null , this._flushedQueueUnguarded, this)
        },
        setLoggingEnabled: function(enabled) {
            this._enableLogging = enabled,
            this._loggedIncomingItems = [],
            this._loggedOutgoingItems = [[], [], [], [], []]
        },
        getLoggedIncomingItems: function() {
            return this._loggedIncomingItems
        },
        getLoggedOutgoingItems: function() {
            return this._loggedOutgoingItems
        },
        replayPreviousLog: function(previousLog) {
            this._outgoingItems = previousLog
        },
        _swapAndReinitializeBuffer: function() {
            var currentOutgoingItems = this._outgoingItems
              , nextOutgoingItems = this._outgoingItemsSwap;
            nextOutgoingItems[REQUEST_MODULE_IDS].length = 0,
            nextOutgoingItems[REQUEST_METHOD_IDS].length = 0,
            nextOutgoingItems[REQUEST_PARAMSS].length = 0,
            nextOutgoingItems[RESPONSE_CBIDS].length = 0,
            nextOutgoingItems[RESPONSE_RETURN_VALUES].length = 0,
            this._outgoingItemsSwap = currentOutgoingItems,
            this._outgoingItems = nextOutgoingItems
        },
        _pushRequestToOutgoingItems: function(moduleID, methodName, params) {
            if ("RCTUIManager" == moduleID) {
                var props = params[2];
                if (props)
                    if (props.opacity && (props.backgroundColor || prpps.borderColor)) {
                        var alpha = Math.ceil(255 * props.opacity).toString(16);
                        delete props.opacity,
                        props.backgroundColor && (props.backgroundColor = (alpha.length < 2 ? "0" + alpha : alpha) + props.backgroundColor.substring(1)),
                        props.borderColor && (props.borderColor = (alpha.length < 2 ? "0" + alpha : alpha) + props.borderColor.substring(1))
                    } else
                        (props.backgroundColor || props.borderColor) && (props.backgroundColor && (props.backgroundColor = "ff" + props.backgroundColor.substring(1)),
                        props.borderColor && (props.borderColor = "ff" + props.borderColor.substring(1)));
                props && Object.keys(props).forEach(function(v) {
                    props[v] = props[v] + ""
                }),
                callNativeRender([moduleID, methodName, JSON.stringify(params)])
            } else
                "RCTExceptionsManager" == moduleID && console.error(JSON.stringify(params))
        },
        _pushResponseToOutgoingItems: function(cbID, returnValue) {
            this._outgoingItems[RESPONSE_CBIDS].push(cbID),
            this._outgoingItems[RESPONSE_RETURN_VALUES].push(returnValue)
        },
        _freeResourcesForCallbackID: function(cbID) {
            var correspondingCBID = this._bookkeeping.isSuccessCallback(cbID) ? this._bookkeeping.errorCallbackIDForSuccessCallbackID(cbID) : this._bookkeeping.successCallbackIDForErrorCallbackID(cbID);
            this._threadLocalCallbacksByID[cbID] = null ,
            this._threadLocalScopesByID[cbID] = null ,
            this._threadLocalCallbacksByID[correspondingCBID] && (this._threadLocalCallbacksByID[correspondingCBID] = null ,
            this._threadLocalScopesByID[correspondingCBID] = null )
        },
        _storeCallbacksInCurrentThread: function(onFail, onSucc, scope) {
            invariant(onFail || onSucc, INTERNAL_ERROR),
            this._bookkeeping.allocateCallbackIDs(this._POOLED_CBIDS);
            var succCBID = this._POOLED_CBIDS.successCallbackID
              , errorCBID = this._POOLED_CBIDS.errorCallbackID;
            this._threadLocalCallbacksByID[errorCBID] = onFail,
            this._threadLocalCallbacksByID[succCBID] = onSucc,
            this._threadLocalScopesByID[errorCBID] = scope,
            this._threadLocalScopesByID[succCBID] = scope
        },
        flushedQueue: function() {
            return guardReturn(null , null , this._flushedQueueUnguarded, this)
        },
        _flushedQueueUnguarded: function() {
            JSTimersExecution.callImmediates();
            var currentOutgoingItems = this._outgoingItems;
            this._swapAndReinitializeBuffer();
            var ret = currentOutgoingItems[REQUEST_MODULE_IDS].length || currentOutgoingItems[RESPONSE_RETURN_VALUES].length ? currentOutgoingItems : null ;
            if (DEBUG_SPY_MODE && ret)
                for (var i = 0; i < currentOutgoingItems[0].length; i++) {
                    var moduleName = this._remoteModuleIDToModuleName[currentOutgoingItems[0][i]]
                      , methodName = this._remoteModuleNameToMethodIDToName[moduleName][currentOutgoingItems[1][i]];
                    console.log("JS->N: " + moduleName + "." + methodName + "(" + JSON.stringify(currentOutgoingItems[2][i]) + ")")
                }
            return ret
        },
        call: function(moduleName, methodName, params, onFail, onSucc, scope) {
            invariant(!(onFail && "function" != typeof onFail || onSucc && "function" != typeof onSucc), "Callbacks must be functions"),
            onSucc && (this._storeCallbacksInCurrentThread(onFail, onSucc, scope, this._POOLED_CBIDS),
            onFail && params.push(this._POOLED_CBIDS.errorCallbackID),
            params.push(this._POOLED_CBIDS.successCallbackID));
            var moduleID = this._remoteModuleNameToModuleID[moduleName];
            if (void 0 === moduleID || null  === moduleID)
                throw new Error("Unrecognized module name:" + moduleName);
            var methodID = this._remoteModuleNameToMethodNameToID[moduleName][methodName];
            if (void 0 === methodID || null  === moduleID)
                throw new Error("Unrecognized method name:" + methodName);
            this._pushRequestToOutgoingItems(moduleName, methodName, params)
        },
        __numPendingCallbacksOnlyUseMeInTestCases: function() {
            for (var callbacks = this._threadLocalCallbacksByID, total = 0, i = 0; i < callbacks.length; i++)
                callbacks[i] && total++;
            return total
        }
    };
    Object.assign(MessageQueue.prototype, MessageQueueMixin),
    module.exports = MessageQueue
}),
__d("JSTimersExecution", ["invariant", "keyMirror", "performanceNow", "warning", "JSTimers", "JSTimers"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , keyMirror = require("keyMirror")
      , performanceNow = require("performanceNow")
      , warning = require("warning")
      , JSTimersExecution = {
        GUID: 1,
        Type: keyMirror({
            setTimeout: null ,
            setInterval: null ,
            requestAnimationFrame: null ,
            setImmediate: null 
        }),
        callbacks: [],
        types: [],
        timerIDs: [],
        immediates: [],
        callTimer: function(timerID) {
            warning(timerID <= JSTimersExecution.GUID, "Tried to call timer with ID " + timerID + " but no such timer exists");
            var timerIndex = JSTimersExecution.timerIDs.indexOf(timerID);
            if (-1 !== timerIndex) {
                var type = JSTimersExecution.types[timerIndex]
                  , callback = JSTimersExecution.callbacks[timerIndex];
                (type === JSTimersExecution.Type.setTimeout || type === JSTimersExecution.Type.setImmediate || type === JSTimersExecution.Type.requestAnimationFrame) && JSTimersExecution._clearIndex(timerIndex);
                try {
                    if (type === JSTimersExecution.Type.setTimeout || type === JSTimersExecution.Type.setInterval || type === JSTimersExecution.Type.setImmediate)
                        callback();
                    else {
                        if (type !== JSTimersExecution.Type.requestAnimationFrame)
                            return void console.error("Tried to call a callback with invalid type: " + type);
                        var currentTime = performanceNow();
                        callback(currentTime)
                    }
                } catch (e) {
                    JSTimersExecution.errors = JSTimersExecution.errors || [],
                    JSTimersExecution.errors.push(e)
                }
            }
        },
        callTimers: function(timerIDs) {
            invariant(0 !== timerIDs.length, 'Probably shouldn\'t call "callTimers" with no timerIDs'),
            JSTimersExecution.errors = null ,
            timerIDs.forEach(JSTimersExecution.callTimer);
            var errors = JSTimersExecution.errors;
            if (errors) {
                var errorCount = errors.length;
                if (errorCount > 1)
                    for (var ii = 1; errorCount > ii; ii++)
                        require("JSTimers").setTimeout(function(error) {
                            throw error
                        }
                        .bind(null , errors[ii]), 0);
                throw errors[0]
            }
        },
        callImmediates: function() {
            for (JSTimersExecution.errors = null ; 0 !== JSTimersExecution.immediates.length; )
                JSTimersExecution.callTimer(JSTimersExecution.immediates.shift());
            JSTimersExecution.errors && JSTimersExecution.errors.forEach(function(error) {
                return require("JSTimers").setTimeout(function() {
                    throw error
                }, 0)
            })
        },
        _clearIndex: function(i) {
            JSTimersExecution.timerIDs[i] = null ,
            JSTimersExecution.callbacks[i] = null ,
            JSTimersExecution.types[i] = null 
        }
    };
    module.exports = JSTimersExecution
}),
__d("performanceNow", ["performance"], function(global, require, requireDynamic, requireLazy, module, exports) {
    var performance = require("performance");
    performance && performance.now || (performance = Date);
    var performanceNow = performance.now.bind(performance);
    module.exports = performanceNow
}),
__d("performance", ["ExecutionEnvironment"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var performance, ExecutionEnvironment = require("ExecutionEnvironment");
    ExecutionEnvironment.canUseDOM && (performance = window.performance || window.msPerformance || window.webkitPerformance),
    module.exports = performance || {}
}),
__d("ExecutionEnvironment", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var canUseDOM = !("undefined" == typeof window || !window.document || !window.document.createElement)
      , ExecutionEnvironment = {
        canUseDOM: canUseDOM,
        canUseWorkers: "undefined" != typeof Worker,
        canUseEventListeners: canUseDOM && !(!window.addEventListener && !window.attachEvent),
        canUseViewport: canUseDOM && !!window.screen,
        isInWorker: !canUseDOM
    };
    module.exports = ExecutionEnvironment
}),
__d("JSTimers", ["NativeModules", "JSTimersExecution"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var RCTTiming = require("NativeModules").Timing
      , JSTimersExecution = require("JSTimersExecution")
      , JSTimers = {
        Types: JSTimersExecution.Types,
        _getFreeIndex: function() {
            var freeIndex = JSTimersExecution.timerIDs.indexOf(null );
            return -1 === freeIndex && (freeIndex = JSTimersExecution.timerIDs.length),
            freeIndex
        },
        setTimeout: setTimeout,
        setInterval: setInterval,
        setImmediate: function(func) {
            for (var args = [], $__0 = 1, $__1 = arguments.length; $__1 > $__0; $__0++)
                args.push(arguments[$__0]);
            var newID = JSTimersExecution.GUID++
              , freeIndex = JSTimers._getFreeIndex();
            return JSTimersExecution.timerIDs[freeIndex] = newID,
            JSTimersExecution.callbacks[freeIndex] = func,
            JSTimersExecution.callbacks[freeIndex] = function() {
                return func.apply(void 0, args)
            }
            ,
            JSTimersExecution.types[freeIndex] = JSTimersExecution.Type.setImmediate,
            JSTimersExecution.immediates.push(newID),
            newID
        },
        requestAnimationFrame: requestAnimationFrame,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        clearImmediate: function(timerID) {
            JSTimers._clearTimerID(timerID),
            JSTimersExecution.immediates.splice(JSTimersExecution.immediates.indexOf(timerID), 1)
        },
        cancelAnimationFrame: function(timerID) {
            JSTimers._clearTimerID(timerID)
        },
        _clearTimerID: function(timerID) {
            if (null  != timerID) {
                var index = JSTimersExecution.timerIDs.indexOf(timerID);
                -1 !== index && (JSTimersExecution._clearIndex(index),
                JSTimersExecution.types[index] !== JSTimersExecution.Type.setImmediate && RCTTiming.deleteTimer(timerID))
            }
        }
    };
    module.exports = JSTimers
}),
__d("nativeModulePrefixNormalizer", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function nativeModulePrefixNormalizer(modules) {
        Object.keys(modules).forEach(function(moduleName) {
            var strippedName = moduleName.replace(/^(RCT|RK)/, "");
            if (modules["RCT" + strippedName] && modules["RK" + strippedName])
                throw new Error("Module cannot be registered as both RCT and RK: " + moduleName);
            strippedName !== moduleName && (modules[strippedName] = modules[moduleName],
            delete modules[moduleName])
        })
    }
    module.exports = nativeModulePrefixNormalizer
}),
__d("Promise", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    module.exports = Promise
}),
__d("setImmediate", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    module.exports = global.setImmediate || function() {}
}),
__d("ImmediateImplementation", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    !function(global, undefined) {
        "use strict";
        function addFromSetImmediateArguments(args) {
            var handler = args[0];
            return args = Array.prototype.slice.call(args, 1),
            tasksByHandle[nextHandle] = function() {
                handler.apply(undefined, args)
            }
            ,
            queueTail = queueTail.next = {
                handle: nextHandle++
            },
            queueTail.handle
        }
        function flushQueue() {
            for (var next, task; !currentlyRunningATask && (next = queueHead.next); )
                if (queueHead = next,
                task = tasksByHandle[next.handle]) {
                    currentlyRunningATask = !0;
                    try {
                        task(),
                        currentlyRunningATask = !1
                    } finally {
                        clearImmediate(next.handle),
                        currentlyRunningATask && (currentlyRunningATask = !1,
                        queueHead.next && setImmediate(flushQueue))
                    }
                }
        }
        function clearImmediate(handle) {
            delete tasksByHandle[handle]
        }
        function canUsePostMessage() {
            if (global.postMessage && !global.importScripts) {
                var postMessageIsAsynchronous = !0
                  , onMessage = function() {
                    postMessageIsAsynchronous = !1,
                    global.removeEventListener ? global.removeEventListener("message", onMessage, !1) : global.detachEvent("onmessage", onMessage)
                }
                ;
                if (global.addEventListener)
                    global.addEventListener("message", onMessage, !1);
                else {
                    if (!global.attachEvent)
                        return !1;
                    global.attachEvent("onmessage", onMessage)
                }
                return global.postMessage("", "*"),
                postMessageIsAsynchronous
            }
        }
        function installPostMessageImplementation() {
            var messagePrefix = "setImmediate$" + Math.random() + "$"
              , onGlobalMessage = function(event) {
                event.source === global && "string" == typeof event.data && 0 === event.data.indexOf(messagePrefix) && flushQueue()
            }
            ;
            global.addEventListener ? global.addEventListener("message", onGlobalMessage, !1) : global.attachEvent("onmessage", onGlobalMessage),
            setImmediate = function() {
                var handle = addFromSetImmediateArguments(arguments);
                return global.postMessage(messagePrefix + handle, "*"),
                handle
            }
        }
        function installMessageChannelImplementation() {
            var channel = new MessageChannel;
            channel.port1.onmessage = flushQueue,
            setImmediate = function() {
                var handle = addFromSetImmediateArguments(arguments);
                return channel.port2.postMessage(handle),
                handle
            }
        }
        function installReadyStateChangeImplementation() {
            var html = doc.documentElement;
            setImmediate = function() {
                var handle = addFromSetImmediateArguments(arguments)
                  , script = doc.createElement("script");
                return script.onreadystatechange = function() {
                    script.onreadystatechange = null ,
                    html.removeChild(script),
                    script = null ,
                    flushQueue()
                }
                ,
                html.appendChild(script),
                handle
            }
        }
        function installSetTimeoutImplementation() {
            setImmediate = function() {
                return setTimeout(flushQueue, 0),
                addFromSetImmediateArguments(arguments)
            }
        }
        var setImmediate, nextHandle = 1, tasksByHandle = {}, queueHead = {}, queueTail = queueHead, currentlyRunningATask = !1, doc = global.document;
        canUsePostMessage() ? installPostMessageImplementation() : global.MessageChannel ? installMessageChannelImplementation() : doc && "onreadystatechange" in doc.createElement("script") ? installReadyStateChangeImplementation() : installSetTimeoutImplementation(),
        exports.setImmediate = setImmediate,
        exports.clearImmediate = clearImmediate
    }(Function("return this")())
}),
__d("parseErrorStack", ["stacktrace-parser/index"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function resolveSourceMaps(sourceMapInstance, stackFrame) {
        try {
            var orig = sourceMapInstance.originalPositionFor({
                line: stackFrame.lineNumber,
                column: stackFrame.column
            });
            orig && (stackFrame.file = orig.source,
            stackFrame.lineNumber = orig.line,
            stackFrame.column = orig.column)
        } catch (innerEx) {}
    }
    function parseErrorStack(e, sourceMapInstance) {
        for (var stack = stacktraceParser.parse(e.stack), framesToPop = e.framesToPop || 0; framesToPop--; )
            stack.shift();
        return sourceMapInstance && stack.forEach(resolveSourceMaps.bind(null , sourceMapInstance)),
        stack
    }
    var stacktraceParser = require("stacktrace-parser/index");
    module.exports = parseErrorStack
}),
__d("stacktrace-parser/index", ["stacktrace-parser/lib/stacktrace-parser"], function(global, require, requireDynamic, requireLazy, module, exports) {
    module.exports = require("stacktrace-parser/lib/stacktrace-parser")
}),
__d("stacktrace-parser/lib/stacktrace-parser", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var UNKNOWN_FUNCTION = "<unknown>"
      , StackTraceParser = {
        parse: function(stackString) {
            for (var parts, element, chrome = /^\s*at (?:(?:(?:Anonymous function)?|((?:\[object object\])?\S+(?: \[as \S+\])?)) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i, gecko = /^(?:\s*(\S*)(?:\((.*?)\))?@)?((?:\w).*?):(\d+)(?::(\d+))?\s*$/i, node = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i, lines = stackString.split("\n"), stack = [], i = 0, j = lines.length; j > i; ++i) {
                if (parts = gecko.exec(lines[i]))
                    element = {
                        file: parts[3],
                        methodName: parts[1] || UNKNOWN_FUNCTION,
                        lineNumber: +parts[4],
                        column: parts[5] ? +parts[5] : null 
                    };
                else if (parts = chrome.exec(lines[i]))
                    element = {
                        file: parts[2],
                        methodName: parts[1] || UNKNOWN_FUNCTION,
                        lineNumber: +parts[3],
                        column: parts[4] ? +parts[4] : null 
                    };
                else {
                    if (!(parts = node.exec(lines[i])))
                        continue;element = {
                        file: parts[2],
                        methodName: parts[1] || UNKNOWN_FUNCTION,
                        lineNumber: +parts[3],
                        column: parts[4] ? +parts[4] : null 
                    }
                }
                stack.push(element)
            }
            return stack
        }
    };
    module.exports = StackTraceParser
}),
__d("stringifySafe", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function stringifySafe(arg) {
        var ret, type = typeof arg;
        if (void 0 === arg)
            ret = "undefined";
        else if (null  === arg)
            ret = "null";
        else if ("string" === type)
            ret = '"' + arg + '"';
        else if ("function" === type)
            try {
                ret = arg.toString()
            } catch (e) {
                ret = "[function unknown]"
            }
        else
            try {
                ret = JSON.stringify(arg)
            } catch (e) {
                if ("function" == typeof arg.toString)
                    try {
                        ret = arg.toString()
                    } catch (E) {}
            }
        return ret || '["' + type + '" failed to stringify]'
    }
    module.exports = stringifySafe
}),
__d("Platform", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var Platform = {
        OS: "ios",
        getItem: function(key) {
            var result;
            try {
                result = Native.getData(key)
            } catch (e) {
                result = ""
            }
            return result
        },
        setItem: function(key, data) {
            try {
                Native.setData(key, data)
            } catch (e) {}
        },
        call: function(msg) {
            try {
                Native.call(msg)
            } catch (e) {}
        }
    };
    module.exports = Platform
}),
__d("XMLHttpRequest", ["NativeModules", "crc32", "XMLHttpRequestBase"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function XMLHttpRequest() {
        null  !== XMLHttpRequestBase && XMLHttpRequestBase.apply(this, arguments)
    }
    var RCTDataManager = require("NativeModules").DataManager
      , crc32 = require("crc32")
      , XMLHttpRequestBase = require("XMLHttpRequestBase");
    for (var XMLHttpRequestBase____Key in XMLHttpRequestBase)
        XMLHttpRequestBase.hasOwnProperty(XMLHttpRequestBase____Key) && (XMLHttpRequest[XMLHttpRequestBase____Key] = XMLHttpRequestBase[XMLHttpRequestBase____Key]);
    var ____SuperProtoOfXMLHttpRequestBase = null  === XMLHttpRequestBase ? null  : XMLHttpRequestBase.prototype;
    XMLHttpRequest.prototype = Object.create(____SuperProtoOfXMLHttpRequestBase),
    XMLHttpRequest.prototype.constructor = XMLHttpRequest,
    XMLHttpRequest.__superConstructor__ = XMLHttpRequestBase,
    XMLHttpRequest.prototype.sendImpl = function(method, url, headers, data) {
        RCTDataManager.queryData("http", {
            method: method,
            url: url,
            data: data,
            headers: headers
        }, "h" + crc32(method + "|" + url + "|" + data), function(result) {
            result = JSON.parse(result),
            this.callback(result.status, result.responseHeaders, result.responseText)
        }
        .bind(this))
    }
    ,
    XMLHttpRequest.prototype.abortImpl = function() {
        console.warn("XMLHttpRequest: abort() cancels JS callbacks but not native HTTP request.")
    }
    ,
    module.exports = XMLHttpRequest
}),
__d("crc32", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function crc32(str) {
        var crc = 0
          , n = 0
          , x = 0;
        crc = -1 ^ crc;
        for (var i = 0, iTop = str.length; iTop > i; i++)
            n = 255 & (crc ^ str.charCodeAt(i)),
            x = "0x" + table.substr(9 * n, 8),
            crc = crc >>> 8 ^ x;
        return -1 ^ crc
    }
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
    module.exports = crc32
}),
__d("XMLHttpRequestBase", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function XMLHttpRequestBase() {
        this.UNSENT = 0,
        this.OPENED = 1,
        this.HEADERS_RECEIVED = 2,
        this.LOADING = 3,
        this.DONE = 4,
        this.onreadystatechange = void 0,
        this.upload = void 0,
        this.readyState = this.UNSENT,
        this.responseHeaders = void 0,
        this.responseText = void 0,
        this.status = void 0,
        this.$XMLHttpRequestBase_method = null ,
        this.$XMLHttpRequestBase_url = null ,
        this.$XMLHttpRequestBase_headers = {},
        this.$XMLHttpRequestBase_sent = !1,
        this.$XMLHttpRequestBase_aborted = !1
    }
    XMLHttpRequestBase.prototype.getAllResponseHeaders = function() {
        if (this.responseHeaders) {
            var headers = [];
            for (var headerName in this.responseHeaders)
                headers.push(headerName + ": " + this.responseHeaders[headerName]);
            return headers.join("\n")
        }
        return null 
    }
    ,
    XMLHttpRequestBase.prototype.getResponseHeader = function(header) {
        if (this.responseHeaders) {
            var value = this.responseHeaders[header.toLowerCase()];
            return void 0 !== value ? value : null 
        }
        return null 
    }
    ,
    XMLHttpRequestBase.prototype.setRequestHeader = function(header, value) {
        this.$XMLHttpRequestBase_headers[header] = value
    }
    ,
    XMLHttpRequestBase.prototype.open = function(method, url, async) {
        if (this.readyState !== this.UNSENT)
            throw new Error("Cannot open, already sending");
        if (void 0 !== async && !async)
            throw new Error("Synchronous http requests are not supported");
        this.$XMLHttpRequestBase_method = method,
        this.$XMLHttpRequestBase_url = url,
        this.$XMLHttpRequestBase_aborted = !1,
        this.$XMLHttpRequestBase_setReadyState(this.OPENED)
    }
    ,
    XMLHttpRequestBase.prototype.sendImpl = function(method, url, headers, data) {
        throw new Error("Subclass must define sendImpl method")
    }
    ,
    XMLHttpRequestBase.prototype.abortImpl = function() {
        throw new Error("Subclass must define abortImpl method")
    }
    ,
    XMLHttpRequestBase.prototype.send = function(data) {
        if (this.readyState !== this.OPENED)
            throw new Error("Request has not been opened");
        if (this.$XMLHttpRequestBase_sent)
            throw new Error("Request has already been sent");
        this.$XMLHttpRequestBase_sent = !0,
        this.sendImpl(this.$XMLHttpRequestBase_method, this.$XMLHttpRequestBase_url, this.$XMLHttpRequestBase_headers, data)
    }
    ,
    XMLHttpRequestBase.prototype.abort = function() {
        this.abortImpl(),
        this.readyState === this.UNSENT || this.readyState === this.OPENED && !this.$XMLHttpRequestBase_sent || this.readyState === this.DONE || (this.$XMLHttpRequestBase_sent = !1,
        this.$XMLHttpRequestBase_setReadyState(this.DONE)),
        this.readyState === this.DONE && this.$XMLHttpRequestBase_sendLoad(),
        this.readyState = this.UNSENT,
        this.$XMLHttpRequestBase_aborted = !0
    }
    ,
    XMLHttpRequestBase.prototype.callback = function(status, responseHeaders, responseText) {
        if (!this.$XMLHttpRequestBase_aborted) {
            this.status = status;
            var lcResponseHeaders = {};
            for (var header in responseHeaders)
                lcResponseHeaders[header.toLowerCase()] = responseHeaders[header];
            this.responseHeaders = lcResponseHeaders,
            this.responseText = responseText,
            this.$XMLHttpRequestBase_setReadyState(this.DONE),
            this.$XMLHttpRequestBase_sendLoad()
        }
    }
    ,
    XMLHttpRequestBase.prototype.$XMLHttpRequestBase_setReadyState = function(newState) {
        this.readyState = newState;
        var onreadystatechange = this.onreadystatechange;
        onreadystatechange && onreadystatechange(null )
    }
    ,
    XMLHttpRequestBase.prototype.$XMLHttpRequestBase_sendLoad = function() {
        var onload = this.onload;
        onload && onload(null )
    }
    ,
    module.exports = XMLHttpRequestBase
}),
__d("fetch", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var self = {};
    !function() {
        function normalizeName(name) {
            if ("string" != typeof name && (name = name.toString()),
            /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name))
                throw new TypeError("Invalid character in header field name");
            return name.toLowerCase()
        }
        function normalizeValue(value) {
            return "string" != typeof value && (value = value.toString()),
            value
        }
        function Headers(headers) {
            this.map = {};
            var self = this;
            headers instanceof Headers ? headers.forEach(function(name, values) {
                values.forEach(function(value) {
                    self.append(name, value)
                })
            }) : headers && Object.getOwnPropertyNames(headers).forEach(function(name) {
                self.append(name, headers[name])
            })
        }
        function consumed(body) {
            return body.bodyUsed ? Promise.reject(new TypeError("Already read")) : void (body.bodyUsed = !0)
        }
        function fileReaderReady(reader) {
            return new Promise(function(resolve, reject) {
                reader.onload = function() {
                    resolve(reader.result)
                }
                ,
                reader.onerror = function() {
                    reject(reader.error)
                }
            }
            )
        }
        function readBlobAsArrayBuffer(blob) {
            var reader = new FileReader;
            return reader.readAsArrayBuffer(blob),
            fileReaderReady(reader)
        }
        function readBlobAsText(blob) {
            var reader = new FileReader;
            return reader.readAsText(blob),
            fileReaderReady(reader)
        }
        function Body() {
            return this.bodyUsed = !1,
            this._initBody = function(body) {
                if (this._bodyInit = body,
                "string" == typeof body)
                    this._bodyText = body;
                else if (support.blob && Blob.prototype.isPrototypeOf(body))
                    this._bodyBlob = body;
                else if (support.formData && FormData.prototype.isPrototypeOf(body))
                    this._bodyFormData = body;
                else {
                    if (body)
                        throw new Error("unsupported BodyInit type");
                    this._bodyText = ""
                }
            }
            ,
            support.blob ? (this.blob = function() {
                var rejected = consumed(this);
                if (rejected)
                    return rejected;
                if (this._bodyBlob)
                    return Promise.resolve(this._bodyBlob);
                if (this._bodyFormData)
                    throw new Error("could not read FormData body as blob");
                return Promise.resolve(new Blob([this._bodyText]))
            }
            ,
            this.arrayBuffer = function() {
                return this.blob().then(readBlobAsArrayBuffer)
            }
            ,
            this.text = function() {
                var rejected = consumed(this);
                if (rejected)
                    return rejected;
                if (this._bodyBlob)
                    return readBlobAsText(this._bodyBlob);
                if (this._bodyFormData)
                    throw new Error("could not read FormData body as text");
                return Promise.resolve(this._bodyText)
            }
            ) : this.text = function() {
                var rejected = consumed(this);
                return rejected ? rejected : Promise.resolve(this._bodyText)
            }
            ,
            support.formData && (this.formData = function() {
                return this.text().then(decode)
            }
            ),
            this.json = function() {
                return this.text().then(JSON.parse)
            }
            ,
            this
        }
        function normalizeMethod(method) {
            var upcased = method.toUpperCase();
            return methods.indexOf(upcased) > -1 ? upcased : method
        }
        function Request(url, options) {
            if (options = options || {},
            this.url = url,
            this.credentials = options.credentials || "omit",
            this.headers = new Headers(options.headers),
            this.method = normalizeMethod(options.method || "GET"),
            this.mode = options.mode || null ,
            this.referrer = null ,
            ("GET" === this.method || "HEAD" === this.method) && options.body)
                throw new TypeError("Body not allowed for GET or HEAD requests");
            this._initBody(options.body)
        }
        function decode(body) {
            var form = new FormData;
            return body.trim().split("&").forEach(function(bytes) {
                if (bytes) {
                    var split = bytes.split("=")
                      , name = split.shift().replace(/\+/g, " ")
                      , value = split.join("=").replace(/\+/g, " ");
                    form.append(decodeURIComponent(name), decodeURIComponent(value))
                }
            }),
            form
        }
        function headers(xhr) {
            var head = new Headers
              , pairs = xhr.getAllResponseHeaders().trim().split("\n");
            return pairs.forEach(function(header) {
                var split = header.trim().split(":")
                  , key = split.shift().trim()
                  , value = split.join(":").trim();
                head.append(key, value)
            }),
            head
        }
        function Response(bodyInit, options) {
            options || (options = {}),
            this._initBody(bodyInit),
            this.type = "default",
            this.url = null ,
            this.status = options.status,
            this.ok = this.status >= 200 && this.status < 300,
            this.statusText = options.statusText,
            this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers),
            this.url = options.url || ""
        }
        if (!self.fetch) {
            Headers.prototype.append = function(name, value) {
                name = normalizeName(name),
                value = normalizeValue(value);
                var list = this.map[name];
                list || (list = [],
                this.map[name] = list),
                list.push(value)
            }
            ,
            Headers.prototype["delete"] = function(name) {
                delete this.map[normalizeName(name)]
            }
            ,
            Headers.prototype.get = function(name) {
                var values = this.map[normalizeName(name)];
                return values ? values[0] : null 
            }
            ,
            Headers.prototype.getAll = function(name) {
                return this.map[normalizeName(name)] || []
            }
            ,
            Headers.prototype.has = function(name) {
                return this.map.hasOwnProperty(normalizeName(name))
            }
            ,
            Headers.prototype.set = function(name, value) {
                this.map[normalizeName(name)] = [normalizeValue(value)]
            }
            ,
            Headers.prototype.forEach = function(callback) {
                var self = this;
                Object.getOwnPropertyNames(this.map).forEach(function(name) {
                    callback(name, self.map[name])
                })
            }
            ;
            var support = {
                blob: "FileReader" in self && "Blob" in self && function() {
                    try {
                        return new Blob,
                        !0
                    } catch (e) {
                        return !1
                    }
                }(),
                formData: "FormData" in self
            }
              , methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
            Body.call(Request.prototype),
            Body.call(Response.prototype),
            self.Headers = Headers,
            self.Request = Request,
            self.Response = Response,
            self.fetch = function(input, init) {
                var request;
                return request = Request.prototype.isPrototypeOf(input) && !init ? input : new Request(input,init),
                new Promise(function(resolve, reject) {
                    function responseURL() {
                        return "responseURL" in xhr ? xhr.responseURL : /^X-Request-URL:/m.test(xhr.getAllResponseHeaders()) ? xhr.getResponseHeader("X-Request-URL") : void 0
                    }
                    var xhr = new XMLHttpRequest;
                    "cors" === request.credentials && (xhr.withCredentials = !0),
                    xhr.onload = function() {
                        var status = 1223 === xhr.status ? 204 : xhr.status;
                        if (100 > status || status > 599)
                            return void reject(new TypeError("Network request failed"));
                        var options = {
                            status: status,
                            statusText: xhr.statusText,
                            headers: headers(xhr),
                            url: responseURL()
                        }
                          , body = "response" in xhr ? xhr.response : xhr.responseText;
                        resolve(new Response(body,options))
                    }
                    ,
                    xhr.onerror = function() {
                        reject(new TypeError("Network request failed"))
                    }
                    ,
                    xhr.open(request.method, request.url, !0),
                    "responseType" in xhr && support.blob && (xhr.responseType = "blob"),
                    request.headers.forEach(function(name, values) {
                        values.forEach(function(value) {
                            xhr.setRequestHeader(name, value)
                        })
                    }),
                    xhr.send("undefined" == typeof request._bodyInit ? null  : request._bodyInit)
                }
                )
            }
            ,
            self.fetch.polyfill = !0
        }
    }(),
    module.exports = self
}),
__d("Geolocation", ["RCTDeviceEventEmitter", "NativeModules", "invariant", "logError", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var RCTDeviceEventEmitter = require("RCTDeviceEventEmitter")
      , RCTLocationObserver = require("NativeModules").LocationObserver
      , invariant = require("invariant")
      , logError = require("logError")
      , warning = require("warning")
      , subscriptions = []
      , updatesEnabled = !1
      , Geolocation = {
        getCurrentPosition: function(geo_success, geo_error, geo_options) {
            invariant("function" == typeof geo_success, "Must provide a valid geo_success callback."),
            RCTLocationObserver.getCurrentPosition(geo_options || {}, geo_success, geo_error || logError)
        },
        watchPosition: function(success, error, options) {
            updatesEnabled || (RCTLocationObserver.startObserving(options || {}),
            updatesEnabled = !0);
            var watchID = subscriptions.length;
            return subscriptions.push([RCTDeviceEventEmitter.addListener("geolocationDidChange", success), error ? RCTDeviceEventEmitter.addListener("geolocationError", error) : null ]),
            watchID
        },
        clearWatch: function(watchID) {
            var sub = subscriptions[watchID];
            if (sub) {
                sub[0].remove();
                var sub1 = sub[1];
                sub1 && sub1.remove(),
                subscriptions[watchID] = void 0;
                for (var noWatchers = !0, ii = 0; ii < subscriptions.length; ii++)
                    subscriptions[ii] && (noWatchers = !1);
                noWatchers && Geolocation.stopObserving()
            }
        },
        stopObserving: function() {
            if (updatesEnabled) {
                RCTLocationObserver.stopObserving(),
                updatesEnabled = !1;
                for (var ii = 0; ii < subscriptions.length; ii++) {
                    var sub = subscriptions[ii];
                    if (sub) {
                        warning("Called stopObserving with existing subscriptions."),
                        sub[0].remove();
                        var sub1 = sub[1];
                        sub1 && sub1.remove()
                    }
                }
                subscriptions = []
            }
        }
    };
    module.exports = Geolocation
}),
__d("logError", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var logError = function() {
        if (1 === arguments.length && arguments[0] instanceof Error) {
            var err = arguments[0];
            console.error('Error: "' + err.message + '".  Stack:\n' + err.stack.replace(/\n/g, ""))
        } else
            console.error.apply(console, arguments)
    }
    ;
    module.exports = logError
}),
__d("WebSocket", ["RCTDeviceEventEmitter", "NativeModules", "WebSocketBase"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function WebSocket() {
        null  !== WebSocketBase && WebSocketBase.apply(this, arguments)
    }
    var RCTDeviceEventEmitter = require("RCTDeviceEventEmitter")
      , RCTWebSocketManager = require("NativeModules").WebSocketManager
      , WebSocketBase = require("WebSocketBase")
      , WebSocketId = 0;
    for (var WebSocketBase____Key in WebSocketBase)
        WebSocketBase.hasOwnProperty(WebSocketBase____Key) && (WebSocket[WebSocketBase____Key] = WebSocketBase[WebSocketBase____Key]);
    var ____SuperProtoOfWebSocketBase = null  === WebSocketBase ? null  : WebSocketBase.prototype;
    WebSocket.prototype = Object.create(____SuperProtoOfWebSocketBase),
    WebSocket.prototype.constructor = WebSocket,
    WebSocket.__superConstructor__ = WebSocketBase,
    WebSocket.prototype.connectToSocketImpl = function(url) {
        this.$WebSocket_socketId = WebSocketId++,
        RCTWebSocketManager.connect(url, this.$WebSocket_socketId),
        this.$WebSocket_registerEvents(this.$WebSocket_socketId)
    }
    ,
    WebSocket.prototype.closeConnectionImpl = function() {
        RCTWebSocketManager.close(this.$WebSocket_socketId)
    }
    ,
    WebSocket.prototype.cancelConnectionImpl = function() {
        RCTWebSocketManager.close(this.$WebSocket_socketId)
    }
    ,
    WebSocket.prototype.sendStringImpl = function(message) {
        RCTWebSocketManager.send(message, this.$WebSocket_socketId)
    }
    ,
    WebSocket.prototype.sendArrayBufferImpl = function() {
        console.warn("Sending ArrayBuffers is not yet supported")
    }
    ,
    WebSocket.prototype.$WebSocket_unregisterEvents = function() {
        this.$WebSocket_subs.forEach(function(e) {
            return e.remove()
        }),
        this.$WebSocket_subs = []
    }
    ,
    WebSocket.prototype.$WebSocket_registerEvents = function(id) {
        this.$WebSocket_subs = [RCTDeviceEventEmitter.addListener("websocketMessage", function(ev) {
            ev.id === id && this.onmessage && this.onmessage({
                data: ev.data
            })
        }
        .bind(this)), RCTDeviceEventEmitter.addListener("websocketOpen", function(ev) {
            ev.id === id && (this.readyState = this.OPEN,
            this.onopen && this.onopen())
        }
        .bind(this)), RCTDeviceEventEmitter.addListener("websocketClosed", function(ev) {
            ev.id === id && (this.readyState = this.CLOSED,
            this.onclose && this.onclose(ev),
            this.$WebSocket_unregisterEvents(),
            RCTWebSocketManager.close(id))
        }
        .bind(this)), RCTDeviceEventEmitter.addListener("websocketFailed", function(ev) {
            ev.id === id && (this.onerror && this.onerror(new Error(ev.message)),
            this.$WebSocket_unregisterEvents(),
            RCTWebSocketManager.close(id))
        }
        .bind(this))]
    }
    ,
    module.exports = WebSocket
}),
__d("WebSocketBase", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function WebSocketBase(url, protocols) {
        this.CONNECTING = 0,
        this.OPEN = 1,
        this.CLOSING = 2,
        this.CLOSED = 3,
        protocols || (protocols = []),
        this.connectToSocketImpl(url)
    }
    WebSocketBase.prototype.close = function() {
        this.readyState !== WebSocketBase.CLOSING && this.readyState !== WebSocketBase.CLOSED && (this.readyState === WebSocketBase.CONNECTING && this.cancelConnectionImpl(),
        this.closeConnectionImpl())
    }
    ,
    WebSocketBase.prototype.send = function(data) {
        if (this.readyState === WebSocketBase.CONNECTING)
            throw new Error("INVALID_STATE_ERR");
        if ("string" == typeof data)
            this.sendStringImpl(data);
        else {
            if (!(data instanceof ArrayBuffer))
                throw new Error("Not supported data type");
            this.sendArrayBufferImpl(data)
        }
    }
    ,
    WebSocketBase.prototype.closeConnectionImpl = function() {
        throw new Error("Subclass must define closeConnectionImpl method")
    }
    ,
    WebSocketBase.prototype.connectToSocketImpl = function() {
        throw new Error("Subclass must define connectToSocketImpl method")
    }
    ,
    WebSocketBase.prototype.cancelConnectionImpl = function() {
        throw new Error("Subclass must define cancelConnectionImpl method")
    }
    ,
    WebSocketBase.prototype.sendStringImpl = function() {
        throw new Error("Subclass must define sendStringImpl method")
    }
    ,
    WebSocketBase.prototype.sendArrayBufferImpl = function() {
        throw new Error("Subclass must define sendArrayBufferImpl method")
    }
    ,
    module.exports = WebSocketBase
}),
__d("EventPluginHub", ["EventPluginRegistry", "EventPluginUtils", "accumulateInto", "forEachAccumulated", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function validateInstanceHandle() {
        var valid = InstanceHandle && InstanceHandle.traverseTwoPhase && InstanceHandle.traverseEnterLeave;
        invariant(valid, "InstanceHandle not injected before use!")
    }
    var EventPluginRegistry = require("EventPluginRegistry")
      , EventPluginUtils = require("EventPluginUtils")
      , accumulateInto = require("accumulateInto")
      , forEachAccumulated = require("forEachAccumulated")
      , invariant = require("invariant")
      , listenerBank = {};
    window.listenerBank = listenerBank;
    var eventQueue = null 
      , executeDispatchesAndRelease = function(event) {
        if (event) {
            var executeDispatch = EventPluginUtils.executeDispatch
              , PluginModule = EventPluginRegistry.getPluginModuleForEvent(event);
            PluginModule && PluginModule.executeDispatch && (executeDispatch = PluginModule.executeDispatch),
            EventPluginUtils.executeDispatchesInOrder(event, executeDispatch),
            event.isPersistent() || event.constructor.release(event)
        }
    }
      , InstanceHandle = null 
      , EventPluginHub = {
        injection: {
            injectMount: EventPluginUtils.injection.injectMount,
            injectInstanceHandle: function(InjectedInstanceHandle) {
                InstanceHandle = InjectedInstanceHandle,
                __DEV__ && validateInstanceHandle()
            },
            getInstanceHandle: function() {
                return __DEV__ && validateInstanceHandle(),
                InstanceHandle
            },
            injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,
            injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName
        },
        eventNameDispatchConfigs: EventPluginRegistry.eventNameDispatchConfigs,
        registrationNameModules: EventPluginRegistry.registrationNameModules,
        putListener: function(id, registrationName, listener) {
            var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
            bankForRegistrationName[id] = listener
        },
        getListener: function(id, registrationName) {
            var bankForRegistrationName = listenerBank[registrationName];
            return bankForRegistrationName && bankForRegistrationName[id]
        },
        deleteListener: function(id, registrationName) {
            var bankForRegistrationName = listenerBank[registrationName];
            bankForRegistrationName && delete bankForRegistrationName[id]
        },
        deleteAllListeners: function(id) {
            for (var registrationName in listenerBank)
                delete listenerBank[registrationName][id]
        },
        extractEvents: function(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent) {
            for (var events, plugins = EventPluginRegistry.plugins, i = 0, l = plugins.length; l > i; i++) {
                var possiblePlugin = plugins[i];
                if (possiblePlugin) {
                    var extractedEvents = possiblePlugin.extractEvents(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent);
                    extractedEvents && (events = accumulateInto(events, extractedEvents))
                }
            }
            return events
        },
        enqueueEvents: function(events) {
            events && (eventQueue = accumulateInto(eventQueue, events))
        },
        processEventQueue: function() {
            var processingEventQueue = eventQueue;
            eventQueue = null ,
            forEachAccumulated(processingEventQueue, executeDispatchesAndRelease),
            invariant(!eventQueue, "processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.")
        },
        __purge: function() {
            listenerBank = {}
        },
        __getListenerBank: function() {
            return listenerBank
        }
    };
    module.exports = EventPluginHub
}),
__d("EventPluginRegistry", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function recomputePluginOrdering() {
        if (EventPluginOrder)
            for (var pluginName in namesToPlugins) {
                var PluginModule = namesToPlugins[pluginName]
                  , pluginIndex = EventPluginOrder.indexOf(pluginName);
                if (invariant(pluginIndex > -1, "EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.", pluginName),
                !EventPluginRegistry.plugins[pluginIndex]) {
                    invariant(PluginModule.extractEvents, "EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.", pluginName),
                    EventPluginRegistry.plugins[pluginIndex] = PluginModule;
                    var publishedEvents = PluginModule.eventTypes;
                    for (var eventName in publishedEvents)
                        invariant(publishEventForPlugin(publishedEvents[eventName], PluginModule, eventName), "EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.", eventName, pluginName)
                }
            }
    }
    function publishEventForPlugin(dispatchConfig, PluginModule, eventName) {
        invariant(!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName), "EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.", eventName),
        EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;
        var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
        if (phasedRegistrationNames) {
            for (var phaseName in phasedRegistrationNames)
                if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
                    var phasedRegistrationName = phasedRegistrationNames[phaseName];
                    publishRegistrationName(phasedRegistrationName, PluginModule, eventName)
                }
            return !0
        }
        return dispatchConfig.registrationName ? (publishRegistrationName(dispatchConfig.registrationName, PluginModule, eventName),
        !0) : !1
    }
    function publishRegistrationName(registrationName, PluginModule, eventName) {
        invariant(!EventPluginRegistry.registrationNameModules[registrationName], "EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.", registrationName),
        EventPluginRegistry.registrationNameModules[registrationName] = PluginModule,
        EventPluginRegistry.registrationNameDependencies[registrationName] = PluginModule.eventTypes[eventName].dependencies
    }
    var invariant = require("invariant")
      , EventPluginOrder = null 
      , namesToPlugins = {}
      , EventPluginRegistry = {
        plugins: [],
        eventNameDispatchConfigs: {},
        registrationNameModules: {},
        registrationNameDependencies: {},
        injectEventPluginOrder: function(InjectedEventPluginOrder) {
            invariant(!EventPluginOrder, "EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React."),
            EventPluginOrder = Array.prototype.slice.call(InjectedEventPluginOrder),
            recomputePluginOrdering()
        },
        injectEventPluginsByName: function(injectedNamesToPlugins) {
            var isOrderingDirty = !1;
            for (var pluginName in injectedNamesToPlugins)
                if (injectedNamesToPlugins.hasOwnProperty(pluginName)) {
                    var PluginModule = injectedNamesToPlugins[pluginName];
                    namesToPlugins.hasOwnProperty(pluginName) && namesToPlugins[pluginName] === PluginModule || (invariant(!namesToPlugins[pluginName], "EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.", pluginName),
                    namesToPlugins[pluginName] = PluginModule,
                    isOrderingDirty = !0)
                }
            isOrderingDirty && recomputePluginOrdering()
        },
        getPluginModuleForEvent: function(event) {
            var dispatchConfig = event.dispatchConfig;
            if (dispatchConfig.registrationName)
                return EventPluginRegistry.registrationNameModules[dispatchConfig.registrationName] || null ;
            for (var phase in dispatchConfig.phasedRegistrationNames)
                if (dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)) {
                    var PluginModule = EventPluginRegistry.registrationNameModules[dispatchConfig.phasedRegistrationNames[phase]];
                    if (PluginModule)
                        return PluginModule
                }
            return null 
        },
        _resetEventPlugins: function() {
            EventPluginOrder = null ;
            for (var pluginName in namesToPlugins)
                namesToPlugins.hasOwnProperty(pluginName) && delete namesToPlugins[pluginName];
            EventPluginRegistry.plugins.length = 0;
            var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
            for (var eventName in eventNameDispatchConfigs)
                eventNameDispatchConfigs.hasOwnProperty(eventName) && delete eventNameDispatchConfigs[eventName];
            var registrationNameModules = EventPluginRegistry.registrationNameModules;
            for (var registrationName in registrationNameModules)
                registrationNameModules.hasOwnProperty(registrationName) && delete registrationNameModules[registrationName]
        }
    };
    module.exports = EventPluginRegistry
}),
__d("EventPluginUtils", ["EventConstants", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function isEndish(topLevelType) {
        return topLevelType === topLevelTypes.topMouseUp || topLevelType === topLevelTypes.topKeyUp || topLevelType === topLevelTypes.topTouchEnd || topLevelType === topLevelTypes.topTouchCancel
    }
    function isMoveish(topLevelType) {
        return topLevelType === topLevelTypes.topMouseMove || topLevelType === topLevelTypes.topTouchMove
    }
    function isStartish(topLevelType) {
        return topLevelType === topLevelTypes.topMouseDown || topLevelType === topLevelTypes.topKeyDown || topLevelType === topLevelTypes.topTouchStart
    }
    function forEachEventDispatch(event, cb) {
        var dispatchListeners = event._dispatchListeners
          , dispatchIDs = event._dispatchIDs;
        if (__DEV__ && validateEventDispatches(event),
        Array.isArray(dispatchListeners))
            for (var i = 0; i < dispatchListeners.length && !event.isPropagationStopped(); i++)
                cb(event, dispatchListeners[i], dispatchIDs[i]);
        else
            dispatchListeners && cb(event, dispatchListeners, dispatchIDs)
    }
    function executeDispatch(event, listener, domID) {
        event.currentTarget = injection.Mount.getNode(domID);
        var returnValue = listener(event, domID);
        return event.currentTarget = null ,
        returnValue
    }
    function executeDispatchesInOrder(event, cb) {
        forEachEventDispatch(event, cb),
        event._dispatchListeners = null ,
        event._dispatchIDs = null 
    }
    function executeDispatchesInOrderStopAtTrueImpl(event) {
        var dispatchListeners = event._dispatchListeners
          , dispatchIDs = event._dispatchIDs;
        if (__DEV__ && validateEventDispatches(event),
        Array.isArray(dispatchListeners)) {
            for (var i = 0; i < dispatchListeners.length && !event.isPropagationStopped(); i++)
                if (dispatchListeners[i](event, dispatchIDs[i]))
                    return dispatchIDs[i]
        } else if (dispatchListeners && dispatchListeners(event, dispatchIDs))
            return dispatchIDs;
        return null 
    }
    function executeDispatchesInOrderStopAtTrue(event) {
        var ret = executeDispatchesInOrderStopAtTrueImpl(event);
        return event._dispatchIDs = null ,
        event._dispatchListeners = null ,
        ret
    }
    function executeDirectDispatch(event) {
        __DEV__ && validateEventDispatches(event);
        var dispatchListener = event._dispatchListeners
          , dispatchID = event._dispatchIDs;
        invariant(!Array.isArray(dispatchListener), "executeDirectDispatch(...): Invalid `event`.");
        var res = dispatchListener ? dispatchListener(event, dispatchID) : null ;
        return event._dispatchListeners = null ,
        event._dispatchIDs = null ,
        res
    }
    function hasDispatches(event) {
        return !!event._dispatchListeners
    }
    var validateEventDispatches, EventConstants = require("EventConstants"), invariant = require("invariant"), injection = {
        Mount: null ,
        injectMount: function(InjectedMount) {
            injection.Mount = InjectedMount,
            __DEV__ && invariant(InjectedMount && InjectedMount.getNode, "EventPluginUtils.injection.injectMount(...): Injected Mount module is missing getNode.")
        }
    }, topLevelTypes = EventConstants.topLevelTypes;
    __DEV__ && (validateEventDispatches = function(event) {
        var dispatchListeners = event._dispatchListeners
          , dispatchIDs = event._dispatchIDs
          , listenersIsArr = Array.isArray(dispatchListeners)
          , idsIsArr = Array.isArray(dispatchIDs)
          , IDsLen = idsIsArr ? dispatchIDs.length : dispatchIDs ? 1 : 0
          , listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;
        invariant(idsIsArr === listenersIsArr && IDsLen === listenersLen, "EventPluginUtils: Invalid `event`.")
    }
    );
    var EventPluginUtils = {
        isEndish: isEndish,
        isMoveish: isMoveish,
        isStartish: isStartish,
        executeDirectDispatch: executeDirectDispatch,
        executeDispatch: executeDispatch,
        executeDispatchesInOrder: executeDispatchesInOrder,
        executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
        hasDispatches: hasDispatches,
        injection: injection,
        useTouchEvents: !1
    };
    module.exports = EventPluginUtils
}),
__d("EventConstants", ["keyMirror"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var keyMirror = require("keyMirror")
      , PropagationPhases = keyMirror({
        bubbled: null ,
        captured: null 
    })
      , topLevelTypes = keyMirror({
        topBlur: null ,
        topChange: null ,
        topClick: null ,
        topCompositionEnd: null ,
        topCompositionStart: null ,
        topCompositionUpdate: null ,
        topContextMenu: null ,
        topCopy: null ,
        topCut: null ,
        topDoubleClick: null ,
        topDrag: null ,
        topDragEnd: null ,
        topDragEnter: null ,
        topDragExit: null ,
        topDragLeave: null ,
        topDragOver: null ,
        topDragStart: null ,
        topDrop: null ,
        topError: null ,
        topFocus: null ,
        topInput: null ,
        topKeyDown: null ,
        topKeyPress: null ,
        topKeyUp: null ,
        topLoad: null ,
        topMouseDown: null ,
        topMouseMove: null ,
        topMouseOut: null ,
        topMouseOver: null ,
        topMouseEnter: null ,
        topMouseLeave: null ,
        topMouseUp: null ,
        topPaste: null ,
        topReset: null ,
        topScroll: null ,
        topSelectionChange: null ,
        topSubmit: null ,
        topTextInput: null ,
        topTouchCancel: null ,
        topTouchEnd: null ,
        topTouchMove: null ,
        topTouchStart: null ,
        topWheel: null 
    })
      , EventConstants = {
        topLevelTypes: topLevelTypes,
        PropagationPhases: PropagationPhases
    };
    module.exports = EventConstants
}),
__d("accumulateInto", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function accumulateInto(current, next) {
        if (invariant(null  != next, "accumulateInto(...): Accumulated items must not be null or undefined."),
        null  == current)
            return next;
        var currentIsArray = Array.isArray(current)
          , nextIsArray = Array.isArray(next);
        return currentIsArray && nextIsArray ? (current.push.apply(current, next),
        current) : currentIsArray ? (current.push(next),
        current) : nextIsArray ? [current].concat(next) : [current, next]
    }
    var invariant = require("invariant");
    module.exports = accumulateInto
}),
__d("forEachAccumulated", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var forEachAccumulated = function(arr, cb, scope) {
        Array.isArray(arr) ? arr.forEach(cb, scope) : arr && cb.call(scope, arr)
    }
    ;
    module.exports = forEachAccumulated
}),
__d("IOSDefaultEventPluginOrder", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var IOSDefaultEventPluginOrder = ["ResponderEventPlugin", "IOSNativeBridgeEventPlugin"];
    module.exports = IOSDefaultEventPluginOrder
}),
__d("IOSNativeBridgeEventPlugin", ["EventPropagators", "NativeModules", "SyntheticEvent", "merge", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var EventPropagators = require("EventPropagators")
      , NativeModules = require("NativeModules")
      , SyntheticEvent = require("SyntheticEvent")
      , merge = require("merge")
      , warning = require("warning")
      , customBubblingEventTypes = (NativeModules.UIManager,
    {})
      , customDirectEventTypes = {};
    customBubblingEventTypes.topClick = {
        phasedRegistrationNames: {
            bubbled: "onClick",
            captured: "onClickCapture"
        }
    },
    customBubblingEventTypes.topMouseEnter = {
        phasedRegistrationNames: {
            bubbled: "onMouseEnter",
            captured: "onMouseEnterCapture"
        }
    },
    customBubblingEventTypes.topMouseLeave = {
        phasedRegistrationNames: {
            bubbled: "onMouseLeave",
            captured: "onMouseLeaveCapture"
        }
    },
    customBubblingEventTypes.topMouseMove = {
        phasedRegistrationNames: {
            bubbled: "onMouseMove",
            captured: "onMouseMoveCapture"
        }
    },
    customBubblingEventTypes.topKeyDown = {
        phasedRegistrationNames: {
            bubbled: "onKeyDown",
            captured: "onKeyDownCapture"
        }
    },
    customBubblingEventTypes.topKeyUp = {
        phasedRegistrationNames: {
            bubbled: "onKeyUp",
            captured: "onKeyUpCapture"
        }
    },
    customBubblingEventTypes.topMouseWheel = {
        phasedRegistrationNames: {
            bubbled: "onMouseWheel",
            captured: "onMouseWheelCapture"
        }
    };

customDirectEventTypes.topLButtonDown = {
  registrationName: "onLButtonDown"
};
customDirectEventTypes.topLButtonUp = {
  registrationName: "onLButtonUp"
};

customDirectEventTypes.topScrollChanged = {
  registrationName: "onScrollChanged"
};

customBubblingEventTypes.topMButtonDown = {
  phasedRegistrationNames: {
    bubbled: "onMButtonDown",
    captured: "onMButtonDownCapture"
  }
};
customBubblingEventTypes.topMButtonUp = {
  phasedRegistrationNames: {
    bubbled: "onMButtonUp",
    captured: "onMButtonUpCapture"
  }
};

customBubblingEventTypes.topRButtonDown = {
  phasedRegistrationNames: {
    bubbled: "onRButtonDown",
    captured: "onRButtonDownCapture"
  }
};
customBubblingEventTypes.topRButtonUp = {
  phasedRegistrationNames: {
    bubbled: "onRButtonUp",
    captured: "onRButtonUpCapture"
  }
};
    var allTypesByEventName = {};
    for (var bubblingTypeName in customBubblingEventTypes)
        allTypesByEventName[bubblingTypeName] = customBubblingEventTypes[bubblingTypeName];
    for (var directTypeName in customDirectEventTypes)
        warning(!customBubblingEventTypes[directTypeName], "Event cannot be both direct and bubbling: %s", directTypeName),
        allTypesByEventName[directTypeName] = customDirectEventTypes[directTypeName];
    var IOSNativeBridgeEventPlugin = {
        eventTypes: merge(customBubblingEventTypes, customDirectEventTypes),
        extractEvents: function(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent) {
            var bubbleDispatchConfig = customBubblingEventTypes[topLevelType]
              , directDispatchConfig = customDirectEventTypes[topLevelType]
              , event = SyntheticEvent.getPooled(bubbleDispatchConfig || directDispatchConfig, topLevelTargetID, nativeEvent);
            if (bubbleDispatchConfig)
                EventPropagators.accumulateTwoPhaseDispatches(event);
            else {
                if (!directDispatchConfig)
                    return null ;
                EventPropagators.accumulateDirectDispatches(event)
            }
            return event
        }
    };
    module.exports = IOSNativeBridgeEventPlugin
}),
__d("EventPropagators", ["EventConstants", "EventPluginHub", "accumulateInto", "forEachAccumulated"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function listenerAtPhase(id, event, propagationPhase) {
        var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
        return getListener(id, registrationName)
    }
    function accumulateDirectionalDispatches(domID, upwards, event) {
        if (__DEV__ && !domID)
            throw new Error("Dispatching id must not be null");
        var phase = upwards ? PropagationPhases.bubbled : PropagationPhases.captured
          , listener = listenerAtPhase(domID, event, phase);
        listener && (event._dispatchListeners = accumulateInto(event._dispatchListeners, listener),
        event._dispatchIDs = accumulateInto(event._dispatchIDs, domID))
    }
    function accumulateTwoPhaseDispatchesSingle(event) {
        event && event.dispatchConfig.phasedRegistrationNames && EventPluginHub.injection.getInstanceHandle().traverseTwoPhase(event.dispatchMarker, accumulateDirectionalDispatches, event)
    }
    function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
        event && event.dispatchConfig.phasedRegistrationNames && EventPluginHub.injection.getInstanceHandle().traverseTwoPhaseSkipTarget(event.dispatchMarker, accumulateDirectionalDispatches, event)
    }
    function accumulateDispatches(id, ignoredDirection, event) {
        if (event && event.dispatchConfig.registrationName) {
            var registrationName = event.dispatchConfig.registrationName
              , listener = getListener(id, registrationName);
            listener && (event._dispatchListeners = accumulateInto(event._dispatchListeners, listener),
            event._dispatchIDs = accumulateInto(event._dispatchIDs, id))
        }
    }
    function accumulateDirectDispatchesSingle(event) {
        event && event.dispatchConfig.registrationName && accumulateDispatches(event.dispatchMarker, null , event)
    }
    function accumulateTwoPhaseDispatches(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle)
    }
    function accumulateTwoPhaseDispatchesSkipTarget(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget)
    }
    function accumulateEnterLeaveDispatches(leave, enter, fromID, toID) {
        EventPluginHub.injection.getInstanceHandle().traverseEnterLeave(fromID, toID, accumulateDispatches, leave, enter)
    }
    function accumulateDirectDispatches(events) {
        forEachAccumulated(events, accumulateDirectDispatchesSingle)
    }
    var EventConstants = require("EventConstants")
      , EventPluginHub = require("EventPluginHub")
      , accumulateInto = require("accumulateInto")
      , forEachAccumulated = require("forEachAccumulated")
      , PropagationPhases = EventConstants.PropagationPhases
      , getListener = EventPluginHub.getListener
      , EventPropagators = {
        accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
        accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
        accumulateDirectDispatches: accumulateDirectDispatches,
        accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
    };
    module.exports = EventPropagators
}),
__d("SyntheticEvent", ["PooledClass", "Object.assign", "emptyFunction", "getEventTarget"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function SyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent) {
        this.dispatchConfig = dispatchConfig,
        this.dispatchMarker = dispatchMarker,
        this.nativeEvent = nativeEvent;
        var Interface = this.constructor.Interface;
        for (var propName in Interface)
            if (Interface.hasOwnProperty(propName)) {
                var normalize = Interface[propName];
                normalize ? this[propName] = normalize(nativeEvent) : this[propName] = nativeEvent[propName]
            }
        var defaultPrevented = null  != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : nativeEvent.returnValue === !1;
        defaultPrevented ? this.isDefaultPrevented = emptyFunction.thatReturnsTrue : this.isDefaultPrevented = emptyFunction.thatReturnsFalse,
        this.isPropagationStopped = emptyFunction.thatReturnsFalse
    }
    var PooledClass = require("PooledClass")
      , assign = require("Object.assign")
      , emptyFunction = require("emptyFunction")
      , getEventTarget = require("getEventTarget")
      , EventInterface = {
        type: null ,
        target: getEventTarget,
        currentTarget: emptyFunction.thatReturnsNull,
        eventPhase: null ,
        bubbles: null ,
        cancelable: null ,
        timeStamp: function(event) {
            return event.timeStamp || Date.now()
        },
        defaultPrevented: null ,
        isTrusted: null 
    };
    assign(SyntheticEvent.prototype, {
        preventDefault: function() {
            this.defaultPrevented = !0;
            var event = this.nativeEvent;
            event.preventDefault ? event.preventDefault() : event.returnValue = !1,
            this.isDefaultPrevented = emptyFunction.thatReturnsTrue
        },
        stopPropagation: function() {
            var event = this.nativeEvent;
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = !0,
            this.isPropagationStopped = emptyFunction.thatReturnsTrue
        },
        persist: function() {
            this.isPersistent = emptyFunction.thatReturnsTrue
        },
        isPersistent: emptyFunction.thatReturnsFalse,
        destructor: function() {
            var Interface = this.constructor.Interface;
            for (var propName in Interface)
                this[propName] = null ;
            this.dispatchConfig = null ,
            this.dispatchMarker = null ,
            this.nativeEvent = null 
        }
    }),
    SyntheticEvent.Interface = EventInterface,
    SyntheticEvent.augmentClass = function(Class, Interface) {
        var Super = this
          , prototype = Object.create(Super.prototype);
        assign(prototype, Class.prototype),
        Class.prototype = prototype,
        Class.prototype.constructor = Class,
        Class.Interface = assign({}, Super.Interface, Interface),
        Class.augmentClass = Super.augmentClass,
        PooledClass.addPoolingTo(Class, PooledClass.threeArgumentPooler)
    }
    ,
    PooledClass.addPoolingTo(SyntheticEvent, PooledClass.threeArgumentPooler),
    module.exports = SyntheticEvent
}),
__d("getEventTarget", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getEventTarget(nativeEvent) {
        var target = nativeEvent.target || nativeEvent.srcElement || window;
        return 3 === target.nodeType ? target.parentNode : target
    }
    module.exports = getEventTarget
}),
__d("merge", ["mergeInto"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var mergeInto = require("mergeInto")
      , merge = function(one, two) {
        var result = {};
        return mergeInto(result, one),
        mergeInto(result, two),
        result
    }
    ;
    module.exports = merge
}),
__d("mergeInto", ["mergeHelpers"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function mergeInto(one, two) {
        if (checkMergeIntoObjectArg(one),
        null  != two) {
            checkMergeObjectArg(two);
            for (var key in two)
                two.hasOwnProperty(key) && (one[key] = two[key])
        }
    }
    var mergeHelpers = require("mergeHelpers")
      , checkMergeObjectArg = mergeHelpers.checkMergeObjectArg
      , checkMergeIntoObjectArg = mergeHelpers.checkMergeIntoObjectArg;
    module.exports = mergeInto
}),
__d("mergeHelpers", ["invariant", "keyMirror"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , keyMirror = require("keyMirror")
      , MAX_MERGE_DEPTH = 36
      , isTerminal = function(o) {
        return "object" != typeof o || null  === o
    }
      , mergeHelpers = {
        MAX_MERGE_DEPTH: MAX_MERGE_DEPTH,
        isTerminal: isTerminal,
        normalizeMergeArg: function(arg) {
            return void 0 === arg || null  === arg ? {} : arg
        },
        checkMergeArrayArgs: function(one, two) {
            invariant(Array.isArray(one) && Array.isArray(two), "Tried to merge arrays, instead got %s and %s.", one, two)
        },
        checkMergeObjectArgs: function(one, two) {
            mergeHelpers.checkMergeObjectArg(one),
            mergeHelpers.checkMergeObjectArg(two)
        },
        checkMergeObjectArg: function(arg) {
            invariant(!isTerminal(arg) && !Array.isArray(arg), "Tried to merge an object, instead got %s.", arg)
        },
        checkMergeIntoObjectArg: function(arg) {
            invariant(!(isTerminal(arg) && "function" != typeof arg || Array.isArray(arg)), "Tried to merge into an object, instead got %s.", arg)
        },
        checkMergeLevel: function(level) {
            invariant(MAX_MERGE_DEPTH > level, "Maximum deep merge depth exceeded. You may be attempting to merge circular structures in an unsupported way.")
        },
        checkArrayStrategy: function(strategy) {
            invariant(void 0 === strategy || strategy in mergeHelpers.ArrayStrategies, "You must provide an array strategy to deep merge functions to instruct the deep merge how to resolve merging two arrays.")
        },
        ArrayStrategies: keyMirror({
            Clobber: !0,
            IndexByIndex: !0
        })
    };
    module.exports = mergeHelpers
}),
__d("NodeHandle", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var NodeHandle = {
        injection: {
            injectImplementation: function(Impl) {
                NodeHandle._Implementation = Impl
            }
        },
        _Implementation: null ,
        getRootNodeID: function(nodeHandle) {
            return NodeHandle._Implementation.getRootNodeID(nodeHandle)
        }
    };
    module.exports = NodeHandle
}),
__d("ReactComponentEnvironment", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , injected = !1
      , ReactComponentEnvironment = {
        unmountIDFromEnvironment: null ,
        replaceNodeWithMarkupByID: null ,
        processChildrenUpdates: null ,
        injection: {
            injectEnvironment: function(environment) {
                invariant(!injected, "ReactCompositeComponent: injectEnvironment() can only be called once."),
                ReactComponentEnvironment.unmountIDFromEnvironment = environment.unmountIDFromEnvironment,
                ReactComponentEnvironment.replaceNodeWithMarkupByID = environment.replaceNodeWithMarkupByID,
                ReactComponentEnvironment.processChildrenUpdates = environment.processChildrenUpdates,
                injected = !0
            }
        }
    };
    module.exports = ReactComponentEnvironment
}),
__d("ReactDefaultBatchingStrategy", ["ReactUpdates", "Transaction", "Object.assign", "emptyFunction"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function ReactDefaultBatchingStrategyTransaction() {
        this.reinitializeTransaction()
    }
    var ReactUpdates = require("ReactUpdates")
      , Transaction = require("Transaction")
      , assign = require("Object.assign")
      , emptyFunction = require("emptyFunction")
      , RESET_BATCHED_UPDATES = {
        initialize: emptyFunction,
        close: function() {
            ReactDefaultBatchingStrategy.isBatchingUpdates = !1
        }
    }
      , FLUSH_BATCHED_UPDATES = {
        initialize: emptyFunction,
        close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
    }
      , TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
    assign(ReactDefaultBatchingStrategyTransaction.prototype, Transaction.Mixin, {
        getTransactionWrappers: function() {
            return TRANSACTION_WRAPPERS
        }
    });
    var transaction = new ReactDefaultBatchingStrategyTransaction
      , ReactDefaultBatchingStrategy = {
        isBatchingUpdates: !1,
        batchedUpdates: function(callback, a, b, c, d) {
            var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
            ReactDefaultBatchingStrategy.isBatchingUpdates = !0,
            alreadyBatchingUpdates ? callback(a, b, c, d) : transaction.perform(callback, null , a, b, c, d)
        }
    };
    module.exports = ReactDefaultBatchingStrategy
}),
__d("ReactEmptyComponent", ["ReactElement", "ReactInstanceMap", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function registerNullComponentID(id) {
        nullComponentIDsRegistry[id] = !0
    }
    function deregisterNullComponentID(id) {
        delete nullComponentIDsRegistry[id]
    }
    function isNullComponentID(id) {
        return !!nullComponentIDsRegistry[id]
    }
    var component, ReactElement = require("ReactElement"), ReactInstanceMap = require("ReactInstanceMap"), invariant = require("invariant"), nullComponentIDsRegistry = {}, ReactEmptyComponentInjection = {
        injectEmptyComponent: function(emptyComponent) {
            component = ReactElement.createFactory(emptyComponent)
        }
    }, ReactEmptyComponentType = function() {}
    ;
    ReactEmptyComponentType.prototype.componentDidMount = function() {
        var internalInstance = ReactInstanceMap.get(this);
        internalInstance && registerNullComponentID(internalInstance._rootNodeID)
    }
    ,
    ReactEmptyComponentType.prototype.componentWillUnmount = function() {
        var internalInstance = ReactInstanceMap.get(this);
        internalInstance && deregisterNullComponentID(internalInstance._rootNodeID)
    }
    ,
    ReactEmptyComponentType.prototype.render = function() {
        return invariant(component, "Trying to return null from a render, but no null placeholder component was injected."),
        component()
    }
    ;
    var emptyElement = ReactElement.createElement(ReactEmptyComponentType)
      , ReactEmptyComponent = {
        emptyElement: emptyElement,
        injection: ReactEmptyComponentInjection,
        isNullComponentID: isNullComponentID
    };
    module.exports = ReactEmptyComponent
}),
__d("ReactNativeComponentEnvironment", ["ReactNativeDOMIDOperations", "ReactNativeReconcileTransaction"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactNativeDOMIDOperations = require("ReactNativeDOMIDOperations")
      , ReactNativeReconcileTransaction = require("ReactNativeReconcileTransaction")
      , ReactNativeComponentEnvironment = {
        processChildrenUpdates: ReactNativeDOMIDOperations.dangerouslyProcessChildrenUpdates,
        replaceNodeWithMarkupByID: ReactNativeDOMIDOperations.dangerouslyReplaceNodeWithMarkupByID,
        unmountIDFromEnvironment: function() {},
        clearNode: function() {},
        ReactReconcileTransaction: ReactNativeReconcileTransaction
    };
    module.exports = ReactNativeComponentEnvironment
}),
__d("ReactNativeDOMIDOperations", ["ReactNativeTagHandles", "ReactMultiChildUpdateTypes", "NativeModules", "ReactPerf"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactNativeTagHandles = require("ReactNativeTagHandles")
      , ReactMultiChildUpdateTypes = require("ReactMultiChildUpdateTypes")
      , RCTUIManager = require("NativeModules").UIManager
      , ReactPerf = require("ReactPerf")
      , dangerouslyProcessChildrenUpdates = function(childrenUpdates, markupList) {
        if (childrenUpdates.length) {
            for (var byContainerTag = {}, i = 0; i < childrenUpdates.length; i++) {
                var update = childrenUpdates[i]
                  , containerTag = ReactNativeTagHandles.mostRecentMountedNodeHandleForRootNodeID(update.parentID)
                  , updates = byContainerTag[containerTag] || (byContainerTag[containerTag] = {});
                if (update.type === ReactMultiChildUpdateTypes.MOVE_EXISTING)
                    (updates.moveFromIndices || (updates.moveFromIndices = [])).push(update.fromIndex),
                    (updates.moveToIndices || (updates.moveToIndices = [])).push(update.toIndex);
                else if (update.type === ReactMultiChildUpdateTypes.REMOVE_NODE)
                    (updates.removeAtIndices || (updates.removeAtIndices = [])).push(update.fromIndex);
                else if (update.type === ReactMultiChildUpdateTypes.INSERT_MARKUP) {
                    var mountImage = markupList[update.markupIndex]
                      , tag = mountImage.tag
                      , rootNodeID = mountImage.rootNodeID;
                    ReactNativeTagHandles.associateRootNodeIDWithMountedNodeHandle(rootNodeID, tag),
                    (updates.addAtIndices || (updates.addAtIndices = [])).push(update.toIndex),
                    (updates.addChildTags || (updates.addChildTags = [])).push(tag)
                }
            }
            for (var updateParentTagString in byContainerTag) {
                var updateParentTagNumber = +updateParentTagString
                  , childUpdatesToSend = byContainerTag[updateParentTagNumber];
                RCTUIManager.manageChildren(updateParentTagNumber, childUpdatesToSend.moveFromIndices, childUpdatesToSend.moveToIndices, childUpdatesToSend.addChildTags, childUpdatesToSend.addAtIndices, childUpdatesToSend.removeAtIndices)
            }
        }
    }
      , ReactNativeDOMIDOperations = {
        dangerouslyProcessChildrenUpdates: ReactPerf.measure("ReactDOMIDOperations", "dangerouslyProcessChildrenUpdates", dangerouslyProcessChildrenUpdates),
        dangerouslyReplaceNodeWithMarkupByID: ReactPerf.measure("ReactDOMIDOperations", "dangerouslyReplaceNodeWithMarkupByID", function(id, mountImage) {
            var oldTag = ReactNativeTagHandles.mostRecentMountedNodeHandleForRootNodeID(id);
            RCTUIManager.replaceExistingNonRootView(oldTag, mountImage.tag),
            ReactNativeTagHandles.associateRootNodeIDWithMountedNodeHandle(id, mountImage.tag)
        })
    };
    module.exports = ReactNativeDOMIDOperations
}),
__d("ReactNativeTagHandles", ["invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , warning = require("warning")
      , INITIAL_TAG_COUNT = 1
      , ReactNativeTagHandles = {
        tagsStartAt: INITIAL_TAG_COUNT,
        tagCount: INITIAL_TAG_COUNT,
        allocateTag: function() {
            for (; this.reactTagIsNativeTopRootID(ReactNativeTagHandles.tagCount); )
                ReactNativeTagHandles.tagCount++;
            var tag = ReactNativeTagHandles.tagCount;
            return ReactNativeTagHandles.tagCount++,
            tag
        },
        associateRootNodeIDWithMountedNodeHandle: function(rootNodeID, tag) {
            warning(rootNodeID && tag, "Root node or tag is null when associating"),
            rootNodeID && tag && (ReactNativeTagHandles.tagToRootNodeID[tag] = rootNodeID,
            ReactNativeTagHandles.rootNodeIDToTag[rootNodeID] = tag)
        },
        allocateRootNodeIDForTag: function(tag) {
            return invariant(this.reactTagIsNativeTopRootID(tag), "Expect a native root tag, instead got ", tag),
            ".r[" + tag + "]{TOP_LEVEL}"
        },
        reactTagIsNativeTopRootID: function(reactTag) {
            return reactTag % 10 === 1
        },
        mostRecentMountedNodeHandleForRootNodeID: function(rootNodeID) {
            return ReactNativeTagHandles.rootNodeIDToTag[rootNodeID]
        },
        tagToRootNodeID: {},
        rootNodeIDToTag: {}
    };
    window.nodeLib = ReactNativeTagHandles,
    module.exports = ReactNativeTagHandles
}),
__d("ReactMultiChildUpdateTypes", ["keyMirror"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var keyMirror = require("keyMirror")
      , ReactMultiChildUpdateTypes = keyMirror({
        INSERT_MARKUP: null ,
        MOVE_EXISTING: null ,
        REMOVE_NODE: null ,
        TEXT_CONTENT: null 
    });
    module.exports = ReactMultiChildUpdateTypes
}),
__d("ReactNativeReconcileTransaction", ["CallbackQueue", "PooledClass", "Transaction"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function ReactNativeReconcileTransaction() {
        this.reinitializeTransaction(),
        this.reactMountReady = CallbackQueue.getPooled(null )
    }
    var CallbackQueue = require("CallbackQueue")
      , PooledClass = require("PooledClass")
      , Transaction = require("Transaction")
      , ON_DOM_READY_QUEUEING = {
        initialize: function() {
            this.reactMountReady.reset()
        },
        close: function() {
            this.reactMountReady.notifyAll()
        }
    }
      , TRANSACTION_WRAPPERS = [ON_DOM_READY_QUEUEING]
      , Mixin = {
        getTransactionWrappers: function() {
            return TRANSACTION_WRAPPERS
        },
        getReactMountReady: function() {
            return this.reactMountReady
        },
        destructor: function() {
            CallbackQueue.release(this.reactMountReady),
            this.reactMountReady = null 
        }
    };
    Object.assign(ReactNativeReconcileTransaction.prototype, Transaction.Mixin, ReactNativeReconcileTransaction, Mixin),
    PooledClass.addPoolingTo(ReactNativeReconcileTransaction),
    module.exports = ReactNativeReconcileTransaction
}),
__d("ReactNativeGlobalInteractionHandler", ["InteractionManager"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var InteractionManager = require("InteractionManager")
      , interactionHandle = null 
      , ReactNativeGlobalInteractionHandler = {
        onChange: function(numberActiveTouches) {
            0 === numberActiveTouches ? interactionHandle && (InteractionManager.clearInteractionHandle(interactionHandle),
            interactionHandle = null ) : interactionHandle || (interactionHandle = InteractionManager.createInteractionHandle())
        }
    };
    module.exports = ReactNativeGlobalInteractionHandler
}),
__d("InteractionManager", ["ErrorUtils", "EventEmitter", "Set", "invariant", "keyMirror", "setImmediate"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function scheduleUpdate() {
        _nextUpdateHandle || (_nextUpdateHandle = setImmediate(processUpdate))
    }
    function processUpdate() {
        _nextUpdateHandle = null ;
        var interactionCount = _interactionSet.size;
        _addInteractionSet.forEach(function(handle) {
            return _interactionSet.add(handle)
        }),
        _deleteInteractionSet.forEach(function(handle) {
            return _interactionSet["delete"](handle)
        });
        var nextInteractionCount = _interactionSet.size;
        if (0 !== interactionCount && 0 === nextInteractionCount ? _emitter.emit(InteractionManager.Events.interactionComplete) : 0 === interactionCount && 0 !== nextInteractionCount && _emitter.emit(InteractionManager.Events.interactionStart),
        0 === nextInteractionCount) {
            var queue = _queue;
            _queue = [],
            queue.forEach(function(callback) {
                ErrorUtils.applyWithGuard(callback)
            })
        }
        _addInteractionSet.clear(),
        _deleteInteractionSet.clear()
    }
    var ErrorUtils = require("ErrorUtils")
      , EventEmitter = require("EventEmitter")
      , Set = require("Set")
      , invariant = require("invariant")
      , keyMirror = require("keyMirror")
      , setImmediate = require("setImmediate")
      , _emitter = new EventEmitter
      , _interactionSet = new Set
      , _addInteractionSet = new Set
      , _deleteInteractionSet = new Set
      , _nextUpdateHandle = null 
      , _queue = []
      , _inc = 0
      , InteractionManager = {
        Events: keyMirror({
            interactionStart: !0,
            interactionComplete: !0
        }),
        runAfterInteractions: function(callback) {
            invariant("function" == typeof callback, "Must specify a function to schedule."),
            scheduleUpdate(),
            _queue.push(callback)
        },
        createInteractionHandle: function() {
            scheduleUpdate();
            var handle = ++_inc;
            return _addInteractionSet.add(handle),
            handle
        },
        clearInteractionHandle: function(handle) {
            invariant(!!handle, "Must provide a handle to clear."),
            scheduleUpdate(),
            _addInteractionSet["delete"](handle),
            _deleteInteractionSet.add(handle)
        },
        addListener: _emitter.addListener.bind(_emitter)
    };
    module.exports = InteractionManager
}),
__d("Set", ["Map", "toIterator", "_shouldPolyfillES6Collection"], function(global, require, requireDynamic, requireLazy, module, exports) {
    var Map = require("Map")
      , toIterator = require("toIterator")
      , _shouldPolyfillES6Collection = require("_shouldPolyfillES6Collection");
    module.exports = function(global, undefined) {
        function Set(iterable) {
            "use strict";
            if (null  == this || "object" != typeof this && "function" != typeof this)
                throw new TypeError("Wrong set object type.");
            if (initSet(this),
            null  != iterable)
                for (var next, it = toIterator(iterable); !(next = it.next()).done; )
                    this.add(next.value)
        }
        function initSet(set) {
            set._map = new Map,
            set.size = set._map.size
        }
        return _shouldPolyfillES6Collection("Set") ? (Set.prototype.add = function(value) {
            "use strict";
            return this._map.set(value, value),
            this.size = this._map.size,
            this
        }
        ,
        Set.prototype.clear = function() {
            "use strict";
            initSet(this)
        }
        ,
        Set.prototype["delete"] = function(value) {
            "use strict";
            var ret = this._map["delete"](value);
            return this.size = this._map.size,
            ret
        }
        ,
        Set.prototype.entries = function() {
            "use strict";
            return this._map.entries()
        }
        ,
        Set.prototype.forEach = function(callback) {
            "use strict";
            for (var next, thisArg = arguments[1], it = this._map.keys(); !(next = it.next()).done; )
                callback.call(thisArg, next.value, next.value, this)
        }
        ,
        Set.prototype.has = function(value) {
            "use strict";
            return this._map.has(value)
        }
        ,
        Set.prototype.values = function() {
            "use strict";
            return this._map.values()
        }
        ,
        Set.prototype[toIterator.ITERATOR_SYMBOL] = Set.prototype.values,
        Set.prototype.keys = Set.prototype.values,
        Set) : global.Set
    }(Function("return this")())
}),
__d("Map", ["guid", "isNode", "toIterator", "_shouldPolyfillES6Collection"], function(global, require, requireDynamic, requireLazy, module, exports) {
    var guid = require("guid")
      , isNode = require("isNode")
      , toIterator = require("toIterator")
      , _shouldPolyfillES6Collection = require("_shouldPolyfillES6Collection");
    module.exports = function(global, undefined) {
        function Map(iterable) {
            "use strict";
            if (!isObject(this))
                throw new TypeError("Wrong map object type.");
            if (initMap(this),
            null  != iterable)
                for (var next, it = toIterator(iterable); !(next = it.next()).done; ) {
                    if (!isObject(next.value))
                        throw new TypeError("Expected iterable items to be pair objects.");
                    this.set(next.value[0], next.value[1])
                }
        }
        function MapIterator(map, kind) {
            "use strict";
            if (!isObject(map) || !map._mapData)
                throw new TypeError("Object is not a map.");
            if (-1 === [KIND_KEY, KIND_KEY_VALUE, KIND_VALUE].indexOf(kind))
                throw new Error("Invalid iteration kind.");
            this._map = map,
            this._nextIndex = 0,
            this._kind = kind
        }
        function getIndex(map, key) {
            if (isObject(key)) {
                var hash = getHash(key);
                return map._objectIndex[hash]
            }
            var prefixedKey = KEY_PREFIX + key;
            return "string" == typeof key ? map._stringIndex[prefixedKey] : map._otherIndex[prefixedKey]
        }
        function setIndex(map, key, index) {
            var shouldDelete = null  == index;
            if (isObject(key)) {
                var hash = getHash(key);
                shouldDelete ? delete map._objectIndex[hash] : map._objectIndex[hash] = index
            } else {
                var prefixedKey = KEY_PREFIX + key;
                "string" == typeof key ? shouldDelete ? delete map._stringIndex[prefixedKey] : map._stringIndex[prefixedKey] = index : shouldDelete ? delete map._otherIndex[prefixedKey] : map._otherIndex[prefixedKey] = index
            }
        }
        function initMap(map) {
            return map._mapData = [],
            map._objectIndex = {},
            map._stringIndex = {},
            map._otherIndex = {},
            __DEV__ && isES5 ? void (map.hasOwnProperty(SECRET_SIZE_PROP) ? map[SECRET_SIZE_PROP] = 0 : (Object.defineProperty(map, SECRET_SIZE_PROP, {
                value: 0,
                writable: !0
            }),
            Object.defineProperty(map, "size", {
                set: function(v) {
                    throw console.error("PLEASE FIX ME: You are changing the map size property which should not be writable and will break in production."),
                    new Error("The map size property is not writable.")
                },
                get: function() {
                    return map[SECRET_SIZE_PROP]
                }
            }))) : void (map.size = 0)
        }
        function isObject(o) {
            return null  != o && ("object" == typeof o || "function" == typeof o)
        }
        function createIterResultObject(value, done) {
            return {
                value: value,
                done: done
            }
        }
        function isExtensible(o) {
            return isES5 ? Object.isExtensible(o) : !0
        }
        function getIENodeHash(node) {
            var uniqueID;
            switch (node.nodeType) {
            case 1:
                uniqueID = node.uniqueID;
                break;
            case 9:
                uniqueID = node.documentElement.uniqueID;
                break;
            default:
                return null 
            }
            return uniqueID ? OLD_IE_HASH_PREFIX + uniqueID : null 
        }
        if (!_shouldPolyfillES6Collection("Map"))
            return global.Map;
        var SECRET_SIZE_PROP, KIND_KEY = "key", KIND_VALUE = "value", KIND_KEY_VALUE = "key+value", KEY_PREFIX = "$map_";
        __DEV__ && (SECRET_SIZE_PROP = "$size" + guid());
        var OLD_IE_HASH_PREFIX = "IE_HASH_";
        Map.prototype.clear = function() {
            "use strict";
            initMap(this)
        }
        ,
        Map.prototype.has = function(key) {
            "use strict";
            var index = getIndex(this, key);
            return !(null  == index || !this._mapData[index])
        }
        ,
        Map.prototype.set = function(key, value) {
            "use strict";
            var index = getIndex(this, key);
            return null  != index && this._mapData[index] ? this._mapData[index][1] = value : (index = this._mapData.push([key, value]) - 1,
            setIndex(this, key, index),
            __DEV__ ? this[SECRET_SIZE_PROP] += 1 : this.size += 1),
            this
        }
        ,
        Map.prototype.get = function(key) {
            "use strict";
            var index = getIndex(this, key);
            return null  == index ? undefined : this._mapData[index][1]
        }
        ,
        Map.prototype["delete"] = function(key) {
            "use strict";
            var index = getIndex(this, key);
            return null  != index && this._mapData[index] ? (setIndex(this, key, undefined),
            this._mapData[index] = undefined,
            __DEV__ ? this[SECRET_SIZE_PROP] -= 1 : this.size -= 1,
            !0) : !1
        }
        ,
        Map.prototype.entries = function() {
            "use strict";
            return new MapIterator(this,KIND_KEY_VALUE)
        }
        ,
        Map.prototype.keys = function() {
            "use strict";
            return new MapIterator(this,KIND_KEY)
        }
        ,
        Map.prototype.values = function() {
            "use strict";
            return new MapIterator(this,KIND_VALUE)
        }
        ,
        Map.prototype.forEach = function(callback, thisArg) {
            "use strict";
            if ("function" != typeof callback)
                throw new TypeError("Callback must be callable.");
            for (var boundCallback = callback.bind(thisArg || undefined), mapData = this._mapData, i = 0; i < mapData.length; i++) {
                var entry = mapData[i];
                null  != entry && boundCallback(entry[1], entry[0], this)
            }
        }
        ,
        Map.prototype[toIterator.ITERATOR_SYMBOL] = Map.prototype.entries,
        MapIterator.prototype.next = function() {
            "use strict";
            if (!this instanceof Map)
                throw new TypeError("Expected to be called on a MapIterator.");
            var map = this._map
              , index = this._nextIndex
              , kind = this._kind;
            if (null  == map)
                return createIterResultObject(undefined, !0);
            for (var entries = map._mapData; index < entries.length; ) {
                var record = entries[index];
                if (index += 1,
                this._nextIndex = index,
                record) {
                    if (kind === KIND_KEY)
                        return createIterResultObject(record[0], !1);
                    if (kind === KIND_VALUE)
                        return createIterResultObject(record[1], !1);
                    if (kind)
                        return createIterResultObject(record, !1)
                }
            }
            return this._map = undefined,
            createIterResultObject(undefined, !0)
        }
        ,
        MapIterator.prototype[toIterator.ITERATOR_SYMBOL] = function() {
            return this
        }
        ;
        var isES5 = function() {
            try {
                return Object.defineProperty({}, "x", {}),
                !0
            } catch (e) {
                return !1
            }
        }()
          , getHash = function() {
            var propIsEnumerable = Object.prototype.propertyIsEnumerable
              , hashProperty = guid()
              , hashCounter = 0;
            return function(o) {
                if (o[hashProperty])
                    return o[hashProperty];
                if (!isES5 && o.propertyIsEnumerable && o.propertyIsEnumerable[hashProperty])
                    return o.propertyIsEnumerable[hashProperty];
                if (!isES5 && isNode(o) && getIENodeHash(o))
                    return getIENodeHash(o);
                if (!isES5 && o[hashProperty])
                    return o[hashProperty];
                if (isExtensible(o)) {
                    if (hashCounter += 1,
                    isES5)
                        Object.defineProperty(o, hashProperty, {
                            enumerable: !1,
                            writable: !1,
                            configurable: !1,
                            value: hashCounter
                        });
                    else if (o.propertyIsEnumerable)
                        o.propertyIsEnumerable = function() {
                            return propIsEnumerable.apply(this, arguments)
                        }
                        ,
                        o.propertyIsEnumerable[hashProperty] = hashCounter;
                    else {
                        if (!isNode(o))
                            throw new Error("Unable to set a non-enumerable property on object.");
                        o[hashProperty] = hashCounter
                    }
                    return hashCounter
                }
                throw new Error("Non-extensible objects are not allowed as keys.")
            }
        }();
        return Map
    }(Function("return this")())
}),
__d("guid", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function guid() {
        return "f" + (Math.random() * (1 << 30)).toString(16).replace(".", "")
    }
    module.exports = guid
}),
__d("isNode", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function isNode(object) {
        return !(!object || !("function" == typeof Node ? object instanceof Node : "object" == typeof object && "number" == typeof object.nodeType && "string" == typeof object.nodeName))
    }
    module.exports = isNode
}),
__d("toIterator", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var KIND_KEY = "key"
      , KIND_VALUE = "value"
      , KIND_KEY_VAL = "key+value"
      , ITERATOR_SYMBOL = "function" == typeof Symbol ? Symbol.iterator : "@@iterator"
      , toIterator = function() {
        return Array.prototype[ITERATOR_SYMBOL] && String.prototype[ITERATOR_SYMBOL] ? function(object) {
            return object[ITERATOR_SYMBOL]()
        }
         : function() {
            function ArrayIterator(array, kind) {
                "use strict";
                if (!Array.isArray(array))
                    throw new TypeError("Object is not an Array");
                this.$ArrayIterator_iteratedObject = array,
                this.$ArrayIterator_kind = kind,
                this.$ArrayIterator_nextIndex = 0
            }
            function StringIterator(string) {
                "use strict";
                if ("string" != typeof string)
                    throw new TypeError("Object is not a string");
                this.$StringIterator_iteratedString = string,
                this.$StringIterator_nextIndex = 0
            }
            function createIterResultObject(value, done) {
                return {
                    value: value,
                    done: done
                }
            }
            return ArrayIterator.prototype.next = function() {
                "use strict";
                if (!this instanceof ArrayIterator)
                    throw new TypeError("Object is not an ArrayIterator");
                if (null  == this.$ArrayIterator_iteratedObject)
                    return createIterResultObject(void 0, !0);
                var array = this.$ArrayIterator_iteratedObject
                  , len = this.$ArrayIterator_iteratedObject.length
                  , index = this.$ArrayIterator_nextIndex
                  , kind = this.$ArrayIterator_kind;
                return index >= len ? (this.$ArrayIterator_iteratedObject = void 0,
                createIterResultObject(void 0, !0)) : (this.$ArrayIterator_nextIndex = index + 1,
                kind === KIND_KEY ? createIterResultObject(index, !1) : kind === KIND_VALUE ? createIterResultObject(array[index], !1) : kind === KIND_KEY_VAL ? createIterResultObject([index, array[index]], !1) : void 0)
            }
            ,
            ArrayIterator.prototype["@@iterator"] = function() {
                "use strict";
                return this
            }
            ,
            StringIterator.prototype.next = function() {
                "use strict";
                if (!this instanceof StringIterator)
                    throw new TypeError("Object is not a StringIterator");
                if (null  == this.$StringIterator_iteratedString)
                    return createIterResultObject(void 0, !0);
                var index = this.$StringIterator_nextIndex
                  , s = this.$StringIterator_iteratedString
                  , len = s.length;
                if (index >= len)
                    return this.$StringIterator_iteratedString = void 0,
                    createIterResultObject(void 0, !0);
                var ret, first = s.charCodeAt(index);
                if (55296 > first || first > 56319 || index + 1 === len)
                    ret = s[index];
                else {
                    var second = s.charCodeAt(index + 1);
                    ret = 56320 > second || second > 57343 ? s[index] : s[index] + s[index + 1]
                }
                return this.$StringIterator_nextIndex = index + ret.length,
                createIterResultObject(ret, !1)
            }
            ,
            StringIterator.prototype["@@iterator"] = function() {
                "use strict";
                return this
            }
            ,
            function(object, kind) {
                return "string" == typeof object ? new StringIterator(object) : Array.isArray(object) ? new ArrayIterator(object,kind || KIND_VALUE) : object[ITERATOR_SYMBOL]()
            }
        }()
    }();
    Object.assign(toIterator, {
        KIND_KEY: KIND_KEY,
        KIND_VALUE: KIND_VALUE,
        KIND_KEY_VAL: KIND_KEY_VAL,
        ITERATOR_SYMBOL: ITERATOR_SYMBOL
    }),
    module.exports = toIterator
}),
__d("_shouldPolyfillES6Collection", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function shouldPolyfillES6Collection(collectionName) {
        var Collection = global[collectionName];
        if (null  == Collection)
            return !0;
        var proto = Collection.prototype;
        return null  == Collection || "function" != typeof Collection || "function" != typeof proto.clear || 0 !== (new Collection).size || "function" != typeof proto.keys || "function" != typeof proto.forEach || isCallableWithoutNew(Collection) || !supportsSubclassing(Collection)
    }
    function supportsSubclassing(Collection) {
        function SubCollection() {
            "use strict";
            null  !== Collection && Collection.apply(this, arguments)
        }
        for (var Collection____Key in Collection)
            Collection.hasOwnProperty(Collection____Key) && (SubCollection[Collection____Key] = Collection[Collection____Key]);
        var ____SuperProtoOfCollection = null  === Collection ? null  : Collection.prototype;
        SubCollection.prototype = Object.create(____SuperProtoOfCollection),
        SubCollection.prototype.constructor = SubCollection,
        SubCollection.__superConstructor__ = Collection;
        try {
            var s = new SubCollection([]);
            return s.size,
            s instanceof Collection
        } catch (e) {
            return !1
        }
    }
    function isCallableWithoutNew(Collection) {
        try {
            Collection()
        } catch (e) {
            return !1
        }
        return !0
    }
    module.exports = shouldPolyfillES6Collection
}),
__d("ReactNativeGlobalResponderHandler", ["NativeModules", "ReactNativeTagHandles"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var RCTUIManager = require("NativeModules").UIManager
      , ReactNativeTagHandles = require("ReactNativeTagHandles")
      , ReactNativeGlobalResponderHandler = {
        onChange: function(from, to) {
            null  !== to ? RCTUIManager.setJSResponder(ReactNativeTagHandles.mostRecentMountedNodeHandleForRootNodeID(to)) : RCTUIManager.clearJSResponder()
        }
    };
    module.exports = ReactNativeGlobalResponderHandler
}),
__d("ReactNativeMount", ["NativeModules", "ReactNativeTagHandles", "ReactPerf", "ReactReconciler", "ReactUpdateQueue", "ReactUpdates", "emptyObject", "instantiateReactComponent", "invariant", "shouldUpdateReactComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function instanceNumberToChildRootID(rootNodeID, instanceNumber) {
        return rootNodeID + "[" + instanceNumber + "]"
    }
    function mountComponentIntoNode(componentInstance, rootID, container, transaction) {
        var markup = ReactReconciler.mountComponent(componentInstance, rootID, transaction, emptyObject);
        componentInstance._isTopLevel = !0,
        ReactNativeMount._mountImageIntoNode(markup, container)
    }
    function batchedMountComponentIntoNode(componentInstance, rootID, container) {
        var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
        transaction.perform(mountComponentIntoNode, null , componentInstance, rootID, container, transaction),
        ReactUpdates.ReactReconcileTransaction.release(transaction)
    }
    var RCTUIManager = require("NativeModules").UIManager
      , ReactNativeTagHandles = require("ReactNativeTagHandles")
      , ReactPerf = require("ReactPerf")
      , ReactReconciler = require("ReactReconciler")
      , ReactUpdateQueue = require("ReactUpdateQueue")
      , ReactUpdates = require("ReactUpdates")
      , emptyObject = require("emptyObject")
      , instantiateReactComponent = require("instantiateReactComponent")
      , shouldUpdateReactComponent = (require("invariant"),
    require("shouldUpdateReactComponent"))
      , ReactNativeMount = {
        instanceCount: 0,
        _instancesByContainerID: {},
        renderComponent: function(nextElement, containerTag, callback) {
            var topRootNodeID = ReactNativeTagHandles.tagToRootNodeID[containerTag];
            if (topRootNodeID) {
                var prevComponent = ReactNativeMount._instancesByContainerID[topRootNodeID];
                if (prevComponent) {
                    var prevElement = prevComponent._currentElement;
                    if (shouldUpdateReactComponent(prevElement, nextElement))
                        return ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement),
                        callback && ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback),
                        prevComponent;
                    ReactNativeMount.unmountComponentAtNode(containerTag)
                }
            }
            if (!ReactNativeTagHandles.reactTagIsNativeTopRootID(containerTag))
                return void console.error("You cannot render into anything but a top root");
            var topRootNodeID = ReactNativeTagHandles.allocateRootNodeIDForTag(containerTag);
            ReactNativeTagHandles.associateRootNodeIDWithMountedNodeHandle(topRootNodeID, containerTag);
            var instance = instantiateReactComponent(nextElement);
            ReactNativeMount._instancesByContainerID[topRootNodeID] = instance;
            var childRootNodeID = instanceNumberToChildRootID(topRootNodeID, ReactNativeMount.instanceCount++);
            ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, instance, childRootNodeID, topRootNodeID);
            var component = instance.getPublicInstance();
            return callback && callback.call(component),
            component
        },
        _mountImageIntoNode: ReactPerf.measure("ReactComponentBrowserEnvironment", "mountImageIntoNode", function(mountImage, containerID) {
            ReactNativeTagHandles.associateRootNodeIDWithMountedNodeHandle(mountImage.rootNodeID, mountImage.tag);
            var addChildTags = [mountImage.tag]
              , addAtIndices = [0];
            RCTUIManager.manageChildren(ReactNativeTagHandles.mostRecentMountedNodeHandleForRootNodeID(containerID), null , null , addChildTags, addAtIndices, null )
        }),
        unmountComponentAtNodeAndRemoveContainer: function(containerTag) {
            ReactNativeMount.unmountComponentAtNode(containerTag),
            RCTUIManager.removeRootView(containerTag)
        },
        unmountComponentAtNode: function(containerTag) {
            if (!ReactNativeTagHandles.reactTagIsNativeTopRootID(containerTag))
                return console.error("You cannot render into anything but a top root"),
                !1;
            var containerID = ReactNativeTagHandles.tagToRootNodeID[containerTag]
              , instance = ReactNativeMount._instancesByContainerID[containerID];
            return instance ? (ReactNativeMount.unmountComponentFromNode(instance, containerID),
            delete ReactNativeMount._instancesByContainerID[containerID],
            !0) : !1
        },
        unmountComponentFromNode: function(instance, containerID) {
            ReactReconciler.unmountComponent(instance);
            var containerTag = ReactNativeTagHandles.mostRecentMountedNodeHandleForRootNodeID(containerID);
            RCTUIManager.removeSubviewsFromContainerWithID(containerTag)
        },
        getNode: function(id) {
            return id
        }
    };
    ReactNativeMount.renderComponent = ReactPerf.measure("ReactMount", "_renderNewRootComponent", ReactNativeMount.renderComponent),
    module.exports = ReactNativeMount
}),
__d("instantiateReactComponent", ["ReactCompositeComponent", "ReactEmptyComponent", "ReactNativeComponent", "Object.assign", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function isInternalComponentType(type) {
        return "function" == typeof type && "undefined" != typeof type.prototype && "function" == typeof type.prototype.mountComponent && "function" == typeof type.prototype.receiveComponent
    }
    function instantiateReactComponent(node, parentCompositeType) {
        var instance;
        if ((null  === node || node === !1) && (node = ReactEmptyComponent.emptyElement),
        "object" == typeof node) {
            var element = node;
            __DEV__ && warning(element && ("function" == typeof element.type || "string" == typeof element.type), "Only functions or strings can be mounted as React components."),
            instance = parentCompositeType === element.type && "string" == typeof element.type ? ReactNativeComponent.createInternalComponent(element) : isInternalComponentType(element.type) ? new element.type(element) : new ReactCompositeComponentWrapper
        } else
            "string" == typeof node || "number" == typeof node ? instance = ReactNativeComponent.createInstanceForText(node) : invariant(!1, "Encountered invalid React node of type %s", typeof node);
        return __DEV__ && warning("function" == typeof instance.construct && "function" == typeof instance.mountComponent && "function" == typeof instance.receiveComponent && "function" == typeof instance.unmountComponent, "Only React Components can be mounted."),
        instance.construct(node),
        instance._mountIndex = 0,
        instance._mountImage = null ,
        __DEV__ && (instance._isOwnerNecessary = !1,
        instance._warnedAboutRefsInRender = !1),
        __DEV__ && Object.preventExtensions && Object.preventExtensions(instance),
        instance
    }
    var ReactCompositeComponent = require("ReactCompositeComponent")
      , ReactEmptyComponent = require("ReactEmptyComponent")
      , ReactNativeComponent = require("ReactNativeComponent")
      , assign = require("Object.assign")
      , invariant = require("invariant")
      , warning = require("warning")
      , ReactCompositeComponentWrapper = function() {}
    ;
    assign(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent.Mixin, {
        _instantiateReactComponent: instantiateReactComponent
    }),
    module.exports = instantiateReactComponent
}),
__d("ReactCompositeComponent", ["ReactComponentEnvironment", "ReactContext", "ReactCurrentOwner", "ReactElement", "ReactElementValidator", "ReactInstanceMap", "ReactLifeCycle", "ReactNativeComponent", "ReactPerf", "ReactPropTypeLocations", "ReactPropTypeLocationNames", "ReactReconciler", "ReactUpdates", "Object.assign", "emptyObject", "invariant", "shouldUpdateReactComponent", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getDeclarationErrorAddendum(component) {
        var owner = component._currentElement._owner || null ;
        if (owner) {
            var name = owner.getName();
            if (name)
                return " Check the render method of `" + name + "`."
        }
        return ""
    }
    var ReactComponentEnvironment = require("ReactComponentEnvironment")
      , ReactContext = require("ReactContext")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactElement = require("ReactElement")
      , ReactElementValidator = require("ReactElementValidator")
      , ReactInstanceMap = require("ReactInstanceMap")
      , ReactLifeCycle = require("ReactLifeCycle")
      , ReactNativeComponent = require("ReactNativeComponent")
      , ReactPerf = require("ReactPerf")
      , ReactPropTypeLocations = require("ReactPropTypeLocations")
      , ReactPropTypeLocationNames = require("ReactPropTypeLocationNames")
      , ReactReconciler = require("ReactReconciler")
      , ReactUpdates = require("ReactUpdates")
      , assign = require("Object.assign")
      , emptyObject = require("emptyObject")
      , invariant = require("invariant")
      , shouldUpdateReactComponent = require("shouldUpdateReactComponent")
      , warning = require("warning")
      , nextMountID = 1
      , ReactCompositeComponentMixin = {
        construct: function(element) {
            this._currentElement = element,
            this._rootNodeID = null ,
            this._instance = null ,
            this._pendingElement = null ,
            this._pendingStateQueue = null ,
            this._pendingReplaceState = !1,
            this._pendingForceUpdate = !1,
            this._renderedComponent = null ,
            this._context = null ,
            this._mountOrder = 0,
            this._isTopLevel = !1,
            this._pendingCallbacks = null 
        },
        mountComponent: function(rootID, transaction, context) {
            this._context = context,
            this._mountOrder = nextMountID++,
            this._rootNodeID = rootID;
            var publicProps = this._processProps(this._currentElement.props)
              , publicContext = this._processContext(this._currentElement._context)
              , Component = ReactNativeComponent.getComponentClassForElement(this._currentElement)
              , inst = new Component(publicProps,publicContext);
            __DEV__ && warning(null  != inst.render, "%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render` in your component or you may have accidentally tried to render an element whose type is a function that isn't a React component.", Component.displayName || Component.name || "Component"),
            inst.props = publicProps,
            inst.context = publicContext,
            inst.refs = emptyObject,
            this._instance = inst,
            ReactInstanceMap.set(inst, this),
            __DEV__ && this._warnIfContextsDiffer(this._currentElement._context, context),
            __DEV__ && (warning(!inst.getInitialState || inst.getInitialState.isReactClassApproved, "getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", this.getName() || "a component"),
            warning(!inst.getDefaultProps || inst.getDefaultProps.isReactClassApproved, "getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", this.getName() || "a component"),
            warning(!inst.propTypes, "propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", this.getName() || "a component"),
            warning(!inst.contextTypes, "contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", this.getName() || "a component"),
            warning("function" != typeof inst.componentShouldUpdate, "%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", this.getName() || "A component"));
            var initialState = inst.state;
            void 0 === initialState && (inst.state = initialState = null ),
            invariant("object" == typeof initialState && !Array.isArray(initialState), "%s.state: must be set to an object or null", this.getName() || "ReactCompositeComponent"),
            this._pendingStateQueue = null ,
            this._pendingReplaceState = !1,
            this._pendingForceUpdate = !1;
            var renderedElement, previouslyMounting = ReactLifeCycle.currentlyMountingInstance;
            ReactLifeCycle.currentlyMountingInstance = this;
            try {
                inst.componentWillMount && (inst.componentWillMount(),
                this._pendingStateQueue && (inst.state = this._processPendingState(inst.props, inst.context))),
                renderedElement = this._renderValidatedComponent()
            } finally {
                ReactLifeCycle.currentlyMountingInstance = previouslyMounting
            }
            this._renderedComponent = this._instantiateReactComponent(renderedElement, this._currentElement.type);
            var markup = ReactReconciler.mountComponent(this._renderedComponent, rootID, transaction, this._processChildContext(context));
            return inst.componentDidMount && transaction.getReactMountReady().enqueue(inst.componentDidMount, inst),
            this._instance._id = markup.tag,
            markup
        },
        unmountComponent: function() {
            var inst = this._instance;
            if (inst.componentWillUnmount) {
                var previouslyUnmounting = ReactLifeCycle.currentlyUnmountingInstance;
                ReactLifeCycle.currentlyUnmountingInstance = this;
                try {
                    inst.componentWillUnmount()
                } finally {
                    ReactLifeCycle.currentlyUnmountingInstance = previouslyUnmounting
                }
            }
            ReactReconciler.unmountComponent(this._renderedComponent),
            this._renderedComponent = null ,
            this._pendingStateQueue = null ,
            this._pendingReplaceState = !1,
            this._pendingForceUpdate = !1,
            this._pendingCallbacks = null ,
            this._pendingElement = null ,
            this._context = null ,
            this._rootNodeID = null ,
            ReactInstanceMap.remove(inst)
        },
        _setPropsInternal: function(partialProps, callback) {
            var element = this._pendingElement || this._currentElement;
            this._pendingElement = ReactElement.cloneAndReplaceProps(element, assign({}, element.props, partialProps)),
            ReactUpdates.enqueueUpdate(this, callback)
        },
        _maskContext: function(context) {
            var maskedContext = null ;
            if ("string" == typeof this._currentElement.type)
                return emptyObject;
            var contextTypes = this._currentElement.type.contextTypes;
            if (!contextTypes)
                return emptyObject;
            maskedContext = {};
            for (var contextName in contextTypes)
                maskedContext[contextName] = context[contextName];
            return maskedContext
        },
        _processContext: function(context) {
            var maskedContext = this._maskContext(context);
            if (__DEV__) {
                var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
                Component.contextTypes && this._checkPropTypes(Component.contextTypes, maskedContext, ReactPropTypeLocations.context)
            }
            return maskedContext
        },
        _processChildContext: function(currentContext) {
            var inst = this._instance
              , childContext = inst.getChildContext && inst.getChildContext();
            if (childContext) {
                invariant("object" == typeof inst.constructor.childContextTypes, "%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", this.getName() || "ReactCompositeComponent"),
                __DEV__ && this._checkPropTypes(inst.constructor.childContextTypes, childContext, ReactPropTypeLocations.childContext);
                for (var name in childContext)
                    invariant(name in inst.constructor.childContextTypes, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', this.getName() || "ReactCompositeComponent", name);
                return assign({}, currentContext, childContext)
            }
            return currentContext
        },
        _processProps: function(newProps) {
            if (__DEV__) {
                var Component = ReactNativeComponent.getComponentClassForElement(this._currentElement);
                Component.propTypes && this._checkPropTypes(Component.propTypes, newProps, ReactPropTypeLocations.prop)
            }
            return newProps
        },
        _checkPropTypes: function(propTypes, props, location) {
            var componentName = this.getName();
            for (var propName in propTypes)
                if (propTypes.hasOwnProperty(propName)) {
                    var error;
                    try {
                        invariant("function" == typeof propTypes[propName], "%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.", componentName || "React class", ReactPropTypeLocationNames[location], propName),
                        error = propTypes[propName](props, propName, componentName, location)
                    } catch (ex) {
                        error = ex
                    }
                    if (error instanceof Error) {
                        var addendum = getDeclarationErrorAddendum(this);
                        location === ReactPropTypeLocations.prop ? warning(!1, "Failed Composite propType: %s%s", error.message, addendum) : warning(!1, "Failed Context Types: %s%s", error.message, addendum)
                    }
                }
        },
        receiveComponent: function(nextElement, transaction, nextContext) {
            var prevElement = this._currentElement
              , prevContext = this._context;
            this._pendingElement = null ,
            this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext)
        },
        performUpdateIfNecessary: function(transaction) {
            null  != this._pendingElement && ReactReconciler.receiveComponent(this, this._pendingElement || this._currentElement, transaction, this._context),
            (null  !== this._pendingStateQueue || this._pendingForceUpdate) && (__DEV__ && ReactElementValidator.checkAndWarnForMutatedProps(this._currentElement),
            this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context))
        },
        _warnIfContextsDiffer: function(ownerBasedContext, parentBasedContext) {
            ownerBasedContext = this._maskContext(ownerBasedContext),
            parentBasedContext = this._maskContext(parentBasedContext);
            for (var parentKeys = Object.keys(parentBasedContext).sort(), displayName = this.getName() || "ReactCompositeComponent", i = 0; i < parentKeys.length; i++) {
                var key = parentKeys[i];
                warning(ownerBasedContext[key] === parentBasedContext[key], "owner-based and parent-based contexts differ (values: `%s` vs `%s`) for key (%s) while mounting %s (see: http://fb.me/react-context-by-parent)", ownerBasedContext[key], parentBasedContext[key], key, displayName)
            }
        },
        updateComponent: function(transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
            var inst = this._instance
              , nextContext = inst.context
              , nextProps = inst.props;
            prevParentElement !== nextParentElement && (nextContext = this._processContext(nextParentElement._context),
            nextProps = this._processProps(nextParentElement.props),
            __DEV__ && null  != nextUnmaskedContext && this._warnIfContextsDiffer(nextParentElement._context, nextUnmaskedContext),
            inst.componentWillReceiveProps && inst.componentWillReceiveProps(nextProps, nextContext));
            var nextState = this._processPendingState(nextProps, nextContext)
              , shouldUpdate = this._pendingForceUpdate || !inst.shouldComponentUpdate || inst.shouldComponentUpdate(nextProps, nextState, nextContext);
            __DEV__ && warning("undefined" != typeof shouldUpdate, "%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", this.getName() || "ReactCompositeComponent"),
            shouldUpdate ? (this._pendingForceUpdate = !1,
            this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext)) : (this._currentElement = nextParentElement,
            this._context = nextUnmaskedContext,
            inst.props = nextProps,
            inst.state = nextState,
            inst.context = nextContext)
        },
        _processPendingState: function(props, context) {
            var inst = this._instance
              , queue = this._pendingStateQueue
              , replace = this._pendingReplaceState;
            if (this._pendingReplaceState = !1,
            this._pendingStateQueue = null ,
            !queue)
                return inst.state;
            for (var nextState = assign({}, replace ? queue[0] : inst.state), i = replace ? 1 : 0; i < queue.length; i++) {
                var partial = queue[i];
                assign(nextState, "function" == typeof partial ? partial.call(inst, nextState, props, context) : partial)
            }
            return nextState
        },
        _performComponentUpdate: function(nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
            var inst = this._instance
              , prevProps = inst.props
              , prevState = inst.state
              , prevContext = inst.context;
            inst.componentWillUpdate && inst.componentWillUpdate(nextProps, nextState, nextContext),
            this._currentElement = nextElement,
            this._context = unmaskedContext,
            inst.props = nextProps,
            inst.state = nextState,
            inst.context = nextContext,
            this._updateRenderedComponent(transaction, unmaskedContext),
            inst.componentDidUpdate && transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst)
        },
        _updateRenderedComponent: function(transaction, context) {
            var prevComponentInstance = this._renderedComponent
              , prevRenderedElement = prevComponentInstance._currentElement
              , nextRenderedElement = this._renderValidatedComponent();
            if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement))
                ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
            else {
                var thisID = this._rootNodeID
                  , prevComponentID = prevComponentInstance._rootNodeID;
                ReactReconciler.unmountComponent(prevComponentInstance),
                this._renderedComponent = this._instantiateReactComponent(nextRenderedElement, this._currentElement.type);
                var nextMarkup = ReactReconciler.mountComponent(this._renderedComponent, thisID, transaction, this._processChildContext(context));
                this._replaceNodeWithMarkupByID(prevComponentID, nextMarkup)
            }
        },
        _replaceNodeWithMarkupByID: function(prevComponentID, nextMarkup) {
            ReactComponentEnvironment.replaceNodeWithMarkupByID(prevComponentID, nextMarkup)
        },
        _renderValidatedComponentWithoutOwnerOrContext: function() {
            var inst = this._instance
              , renderedComponent = inst.render();
            return __DEV__ && "undefined" == typeof renderedComponent && inst.render._isMockFunction && (renderedComponent = null ),
            renderedComponent
        },
        _renderValidatedComponent: function() {
            var renderedComponent, previousContext = ReactContext.current;
            ReactContext.current = this._processChildContext(this._currentElement._context),
            ReactCurrentOwner.current = this;
            try {
                renderedComponent = this._renderValidatedComponentWithoutOwnerOrContext()
            } finally {
                ReactContext.current = previousContext,
                ReactCurrentOwner.current = null 
            }
            return invariant(null  === renderedComponent || renderedComponent === !1 || ReactElement.isValidElement(renderedComponent), "%s.render(): A valid ReactComponent must be returned. You may have returned undefined, an array or some other invalid object.", this.getName() || "ReactCompositeComponent"),
            renderedComponent
        },
        attachRef: function(ref, component) {
            var inst = this.getPublicInstance()
              , refs = inst.refs === emptyObject ? inst.refs = {} : inst.refs;
            refs[ref] = component.getPublicInstance()
        },
        detachRef: function(ref) {
            var refs = this.getPublicInstance().refs;
            delete refs[ref]
        },
        getName: function() {
            var type = this._currentElement.type
              , constructor = this._instance && this._instance.constructor;
            return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null 
        },
        getPublicInstance: function() {
            return this._instance
        },
        _instantiateReactComponent: null 
    };
    ReactPerf.measureMethods(ReactCompositeComponentMixin, "ReactCompositeComponent", {
        mountComponent: "mountComponent",
        updateComponent: "updateComponent",
        _renderValidatedComponent: "_renderValidatedComponent"
    });
    var ReactCompositeComponent = {
        Mixin: ReactCompositeComponentMixin
    };
    module.exports = ReactCompositeComponent
}),
__d("shouldUpdateReactComponent", ["warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function shouldUpdateReactComponent(prevElement, nextElement) {
        if (null  != prevElement && null  != nextElement) {
            var prevType = typeof prevElement
              , nextType = typeof nextElement;
            if ("string" === prevType || "number" === prevType)
                return "string" === nextType || "number" === nextType;
            if ("object" === nextType && prevElement.type === nextElement.type && prevElement.key === nextElement.key) {
                var ownersMatch = prevElement._owner === nextElement._owner
                  , prevName = null 
                  , nextName = null 
                  , nextDisplayName = null ;
                return __DEV__ && (ownersMatch || (null  != prevElement._owner && null  != prevElement._owner.getPublicInstance() && null  != prevElement._owner.getPublicInstance().constructor && (prevName = prevElement._owner.getPublicInstance().constructor.displayName),
                null  != nextElement._owner && null  != nextElement._owner.getPublicInstance() && null  != nextElement._owner.getPublicInstance().constructor && (nextName = nextElement._owner.getPublicInstance().constructor.displayName),
                null  != nextElement.type && null  != nextElement.type.displayName && (nextDisplayName = nextElement.type.displayName),
                null  != nextElement.type && "string" == typeof nextElement.type && (nextDisplayName = nextElement.type),
                ("string" != typeof nextElement.type || "input" === nextElement.type || "textarea" === nextElement.type) && (null  != prevElement._owner && prevElement._owner._isOwnerNecessary === !1 || null  != nextElement._owner && nextElement._owner._isOwnerNecessary === !1) && (null  != prevElement._owner && (prevElement._owner._isOwnerNecessary = !0),
                null  != nextElement._owner && (nextElement._owner._isOwnerNecessary = !0),
                warning(!1, "<%s /> is being rendered by both %s and %s using the same key (%s) in the same place. Currently, this means that they don't preserve state. This behavior should be very rare so we're considering deprecating it. Please contact the React team and explain your use case so that we can take that into consideration.", nextDisplayName || "Unknown Component", prevName || "[Unknown]", nextName || "[Unknown]", prevElement.key)))),
                ownersMatch
            }
        }
        return !1
    }
    var warning = require("warning");
    module.exports = shouldUpdateReactComponent
}),
__d("ReactNativeTextComponent", ["ReactNativeTagHandles", "NativeModules", "Object.assign"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactNativeTagHandles = require("ReactNativeTagHandles")
      , RCTUIManager = require("NativeModules").UIManager
      , assign = require("Object.assign")
      , ReactNativeTextComponent = function(props) {}
    ;
    assign(ReactNativeTextComponent.prototype, {
        construct: function(text) {
            this._currentElement = text,
            this._stringText = "" + text,
            this._rootNodeID = null 
        },
        mountComponent: function(rootID, transaction, context) {
            this._rootNodeID = rootID;
            var tag = ReactNativeTagHandles.allocateTag();
            return RCTUIManager.createView(tag, "RCTRawText", {
                text: this._stringText
            }),
            {
                rootNodeID: rootID,
                tag: tag
            }
        },
        receiveComponent: function(nextText, transaction, context) {
            if (nextText !== this._currentElement) {
                this._currentElement = nextText;
                var nextStringText = "" + nextText;
                nextStringText !== this._stringText && (this._stringText = nextStringText,
                RCTUIManager.updateView(ReactNativeTagHandles.mostRecentMountedNodeHandleForRootNodeID(this._rootNodeID), "RCTRawText", {
                    text: this._stringText
                }))
            }
        },
        unmountComponent: function() {
            this._currentElement = null ,
            this._stringText = null ,
            this._rootNodeID = null 
        }
    }),
    module.exports = ReactNativeTextComponent
}),
__d("ResponderEventPlugin", ["EventConstants", "EventPluginUtils", "EventPropagators", "NodeHandle", "ReactInstanceHandles", "ResponderSyntheticEvent", "ResponderTouchHistoryStore", "accumulate", "invariant", "keyOf"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function setResponderAndExtractTransfer(topLevelType, topLevelTargetID, nativeEvent) {
        var shouldSetEventType = isStartish(topLevelType) ? eventTypes.startShouldSetResponder : isMoveish(topLevelType) ? eventTypes.moveShouldSetResponder : topLevelType === EventConstants.topLevelTypes.topSelectionChange ? eventTypes.selectionChangeShouldSetResponder : eventTypes.scrollShouldSetResponder
          , bubbleShouldSetFrom = responderID ? ReactInstanceHandles._getFirstCommonAncestorID(responderID, topLevelTargetID) : topLevelTargetID
          , skipOverBubbleShouldSetFrom = bubbleShouldSetFrom === responderID
          , shouldSetEvent = ResponderSyntheticEvent.getPooled(shouldSetEventType, bubbleShouldSetFrom, nativeEvent);
        shouldSetEvent.touchHistory = ResponderTouchHistoryStore.touchHistory,
        skipOverBubbleShouldSetFrom ? EventPropagators.accumulateTwoPhaseDispatchesSkipTarget(shouldSetEvent) : EventPropagators.accumulateTwoPhaseDispatches(shouldSetEvent);
        var wantsResponderID = executeDispatchesInOrderStopAtTrue(shouldSetEvent);
        if (shouldSetEvent.isPersistent() || shouldSetEvent.constructor.release(shouldSetEvent),
        !wantsResponderID || wantsResponderID === responderID)
            return null ;
        var extracted, grantEvent = ResponderSyntheticEvent.getPooled(eventTypes.responderGrant, wantsResponderID, nativeEvent);
        if (grantEvent.touchHistory = ResponderTouchHistoryStore.touchHistory,
        EventPropagators.accumulateDirectDispatches(grantEvent),
        responderID) {
            var terminationRequestEvent = ResponderSyntheticEvent.getPooled(eventTypes.responderTerminationRequest, responderID, nativeEvent);
            terminationRequestEvent.touchHistory = ResponderTouchHistoryStore.touchHistory,
            EventPropagators.accumulateDirectDispatches(terminationRequestEvent);
            var shouldSwitch = !hasDispatches(terminationRequestEvent) || executeDirectDispatch(terminationRequestEvent);
            if (terminationRequestEvent.isPersistent() || terminationRequestEvent.constructor.release(terminationRequestEvent),
            shouldSwitch) {
                var terminateType = eventTypes.responderTerminate
                  , terminateEvent = ResponderSyntheticEvent.getPooled(terminateType, responderID, nativeEvent);
                terminateEvent.touchHistory = ResponderTouchHistoryStore.touchHistory,
                EventPropagators.accumulateDirectDispatches(terminateEvent),
                extracted = accumulate(extracted, [grantEvent, terminateEvent]),
                changeResponder(wantsResponderID)
            } else {
                var rejectEvent = ResponderSyntheticEvent.getPooled(eventTypes.responderReject, wantsResponderID, nativeEvent);
                rejectEvent.touchHistory = ResponderTouchHistoryStore.touchHistory,
                EventPropagators.accumulateDirectDispatches(rejectEvent),
                extracted = accumulate(extracted, rejectEvent)
            }
        } else
            extracted = accumulate(extracted, grantEvent),
            changeResponder(wantsResponderID);
        return extracted
    }
    function canTriggerTransfer(topLevelType, topLevelTargetID) {
        return topLevelTargetID && (topLevelType === EventConstants.topLevelTypes.topScroll || trackedTouchCount > 0 && topLevelType === EventConstants.topLevelTypes.topSelectionChange || isStartish(topLevelType) || isMoveish(topLevelType))
    }
    function noResponderTouches(nativeEvent) {
        var touches = nativeEvent.touches;
        if (!touches || 0 === touches.length)
            return !0;
        for (var i = 0; i < touches.length; i++) {
            var activeTouch = touches[i]
              , target = activeTouch.target;
            if (null  !== target && void 0 !== target && 0 !== target) {
                var commonAncestor = ReactInstanceHandles._getFirstCommonAncestorID(responderID, NodeHandle.getRootNodeID(target));
                if (commonAncestor === responderID)
                    return !1
            }
        }
        return !0
    }
    var EventConstants = require("EventConstants")
      , EventPluginUtils = require("EventPluginUtils")
      , EventPropagators = require("EventPropagators")
      , NodeHandle = require("NodeHandle")
      , ReactInstanceHandles = require("ReactInstanceHandles")
      , ResponderSyntheticEvent = require("ResponderSyntheticEvent")
      , ResponderTouchHistoryStore = require("ResponderTouchHistoryStore")
      , accumulate = require("accumulate")
      , invariant = require("invariant")
      , keyOf = require("keyOf")
      , isStartish = EventPluginUtils.isStartish
      , isMoveish = EventPluginUtils.isMoveish
      , isEndish = EventPluginUtils.isEndish
      , executeDirectDispatch = EventPluginUtils.executeDirectDispatch
      , hasDispatches = EventPluginUtils.hasDispatches
      , executeDispatchesInOrderStopAtTrue = EventPluginUtils.executeDispatchesInOrderStopAtTrue
      , responderID = null 
      , trackedTouchCount = 0
      , previousActiveTouches = 0
      , changeResponder = function(nextResponderID) {
        var oldResponderID = responderID;
        responderID = nextResponderID,
        null  !== ResponderEventPlugin.GlobalResponderHandler && ResponderEventPlugin.GlobalResponderHandler.onChange(oldResponderID, nextResponderID)
    }
      , eventTypes = {
        startShouldSetResponder: {
            phasedRegistrationNames: {
                bubbled: keyOf({
                    onStartShouldSetResponder: null 
                }),
                captured: keyOf({
                    onStartShouldSetResponderCapture: null 
                })
            }
        },
        scrollShouldSetResponder: {
            phasedRegistrationNames: {
                bubbled: keyOf({
                    onScrollShouldSetResponder: null 
                }),
                captured: keyOf({
                    onScrollShouldSetResponderCapture: null 
                })
            }
        },
        selectionChangeShouldSetResponder: {
            phasedRegistrationNames: {
                bubbled: keyOf({
                    onSelectionChangeShouldSetResponder: null 
                }),
                captured: keyOf({
                    onSelectionChangeShouldSetResponderCapture: null 
                })
            }
        },
        moveShouldSetResponder: {
            phasedRegistrationNames: {
                bubbled: keyOf({
                    onMoveShouldSetResponder: null 
                }),
                captured: keyOf({
                    onMoveShouldSetResponderCapture: null 
                })
            }
        },
        responderStart: {
            registrationName: keyOf({
                onResponderStart: null 
            })
        },
        responderMove: {
            registrationName: keyOf({
                onResponderMove: null 
            })
        },
        responderEnd: {
            registrationName: keyOf({
                onResponderEnd: null 
            })
        },
        responderClick: {
            registrationName: keyOf({
                onResponderClick: null 
            })
        },
        responderKeyDown: {
            registrationName: keyOf({
                onResponderKeyDown: null 
            })
        },
        responderKeyUp: {
            registrationName: keyOf({
                onResponderKeyUp: null 
            })
        },
        responderRelease: {
            registrationName: keyOf({
                onResponderRelease: null 
            })
        },
        responderTerminationRequest: {
            registrationName: keyOf({
                onResponderTerminationRequest: null 
            })
        },
        responderGrant: {
            registrationName: keyOf({
                onResponderGrant: null 
            })
        },
        responderReject: {
            registrationName: keyOf({
                onResponderReject: null 
            })
        },
        responderTerminate: {
            registrationName: keyOf({
                onResponderTerminate: null 
            })
        }
    }
      , ResponderEventPlugin = {
        getResponderID: function() {
            return responderID
        },
        eventTypes: eventTypes,
        extractEvents: function(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent) {
            isStartish(topLevelType) ? trackedTouchCount += 1 : isEndish(topLevelType) && (trackedTouchCount -= 1,
            invariant(trackedTouchCount >= 0, "Ended a touch event which was not counted in trackedTouchCount.")),
            ResponderTouchHistoryStore.recordTouchTrack(topLevelType, nativeEvent);
            var extracted = canTriggerTransfer(topLevelType, topLevelTargetID) ? setResponderAndExtractTransfer(topLevelType, topLevelTargetID, nativeEvent) : null 
              , isResponderTouchStart = responderID && isStartish(topLevelType)
              , isResponderTouchMove = responderID && isMoveish(topLevelType)
              , isResponderTouchEnd = responderID && isEndish(topLevelType)
              , incrementalTouch = isResponderTouchStart ? eventTypes.responderStart : isResponderTouchMove ? eventTypes.responderMove : isResponderTouchEnd ? eventTypes.responderEnd : null ;
            if ("topClick" == topLevelType ? (responderID = topLevelTargetID,
            incrementalTouch = eventTypes.responderClick) : "topKeyDown" == topLevelType ? (responderID = topLevelTargetID,
            incrementalTouch = eventTypes.responderKeyDown) : "topKeyUp" == topLevelType ? (responderID = topLevelTargetID,
            incrementalTouch = eventTypes.responderKeyUp) : "topMouseEnter" == topLevelType ? (responderID = topLevelTargetID,
            incrementalTouch = eventTypes.responderMouseEnter) : "topMouseLeave" == topLevelType && (responderID = topLevelTargetID,
            incrementalTouch = eventTypes.responderMouseLeave),
            incrementalTouch) {
                var gesture = ResponderSyntheticEvent.getPooled(incrementalTouch, responderID, nativeEvent);
                gesture.touchHistory = ResponderTouchHistoryStore.touchHistory,
                EventPropagators.accumulateDirectDispatches(gesture),
                extracted = accumulate(extracted, gesture)
            }
            var isResponderTerminate = responderID && topLevelType === EventConstants.topLevelTypes.topTouchCancel
              , isResponderRelease = responderID && !isResponderTerminate && isEndish(topLevelType) && noResponderTouches(nativeEvent)
              , finalTouch = isResponderTerminate ? eventTypes.responderTerminate : isResponderRelease ? eventTypes.responderRelease : null ;
            if (finalTouch) {
                var finalEvent = ResponderSyntheticEvent.getPooled(finalTouch, responderID, nativeEvent);
                finalEvent.touchHistory = ResponderTouchHistoryStore.touchHistory,
                EventPropagators.accumulateDirectDispatches(finalEvent),
                extracted = accumulate(extracted, finalEvent),
                changeResponder(null )
            }
            var numberActiveTouches = ResponderTouchHistoryStore.touchHistory.numberActiveTouches;
            return ResponderEventPlugin.GlobalInteractionHandler && numberActiveTouches !== previousActiveTouches && ResponderEventPlugin.GlobalInteractionHandler.onChange(numberActiveTouches),
            previousActiveTouches = numberActiveTouches,
            extracted
        },
        GlobalResponderHandler: null ,
        GlobalInteractionHandler: null ,
        injection: {
            injectGlobalResponderHandler: function(GlobalResponderHandler) {
                ResponderEventPlugin.GlobalResponderHandler = GlobalResponderHandler
            },
            injectGlobalInteractionHandler: function(GlobalInteractionHandler) {
                ResponderEventPlugin.GlobalInteractionHandler = GlobalInteractionHandler
            }
        }
    };
    module.exports = ResponderEventPlugin
}),
__d("ResponderSyntheticEvent", ["SyntheticEvent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function ResponderSyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent) {
        SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent)
    }
    var SyntheticEvent = require("SyntheticEvent")
      , ResponderEventInterface = {
        touchHistory: function(nativeEvent) {
            return null 
        }
    };
    SyntheticEvent.augmentClass(ResponderSyntheticEvent, ResponderEventInterface),
    module.exports = ResponderSyntheticEvent
}),
__d("ResponderTouchHistoryStore", ["EventPluginUtils", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var EventPluginUtils = require("EventPluginUtils")
      , invariant = require("invariant")
      , isMoveish = EventPluginUtils.isMoveish
      , isStartish = EventPluginUtils.isStartish
      , isEndish = EventPluginUtils.isEndish
      , MAX_TOUCH_BANK = 20
      , touchHistory = {
        touchBank: [],
        numberActiveTouches: 0,
        indexOfSingleActiveTouch: -1,
        mostRecentTimeStamp: 0
    }
      , timestampForTouch = function(touch) {
        return touch.timeStamp || touch.timestamp
    }
      , initializeTouchData = function(touch) {
        return {
            touchActive: !0,
            startTimeStamp: timestampForTouch(touch),
            startPageX: touch.pageX,
            startPageY: touch.pageY,
            currentPageX: touch.pageX,
            currentPageY: touch.pageY,
            currentTimeStamp: timestampForTouch(touch),
            previousPageX: touch.pageX,
            previousPageY: touch.pageY,
            previousTimeStamp: timestampForTouch(touch)
        }
    }
      , reinitializeTouchTrack = function(touchTrack, touch) {
        touchTrack.touchActive = !0,
        touchTrack.startTimeStamp = timestampForTouch(touch),
        touchTrack.startPageX = touch.pageX,
        touchTrack.startPageY = touch.pageY,
        touchTrack.currentPageX = touch.pageX,
        touchTrack.currentPageY = touch.pageY,
        touchTrack.currentTimeStamp = timestampForTouch(touch),
        touchTrack.previousPageX = touch.pageX,
        touchTrack.previousPageY = touch.pageY,
        touchTrack.previousTimeStamp = timestampForTouch(touch)
    }
      , validateTouch = function(touch) {
        var identifier = touch.identifier;
        invariant(null  != identifier, "Touch object is missing identifier"),
        identifier > MAX_TOUCH_BANK && console.warn("Touch identifier " + identifier + " is greater than maximum supported " + MAX_TOUCH_BANK + " which causes performance issues backfilling array locations for all of the indices.")
    }
      , recordStartTouchData = function(touch) {
        var touchBank = touchHistory.touchBank
          , identifier = touch.identifier
          , touchTrack = touchBank[identifier];
        __DEV__ && validateTouch(touch),
        touchTrack ? reinitializeTouchTrack(touchTrack, touch) : touchBank[touch.identifier] = initializeTouchData(touch),
        touchHistory.mostRecentTimeStamp = timestampForTouch(touch)
    }
      , recordMoveTouchData = function(touch) {
        var touchBank = touchHistory.touchBank
          , touchTrack = touchBank[touch.identifier];
        __DEV__ && (validateTouch(touch),
        invariant(touchTrack, "Touch data should have been recorded on start")),
        touchTrack.touchActive = !0,
        touchTrack.previousPageX = touchTrack.currentPageX,
        touchTrack.previousPageY = touchTrack.currentPageY,
        touchTrack.previousTimeStamp = touchTrack.currentTimeStamp,
        touchTrack.currentPageX = touch.pageX,
        touchTrack.currentPageY = touch.pageY,
        touchTrack.currentTimeStamp = timestampForTouch(touch),
        touchHistory.mostRecentTimeStamp = timestampForTouch(touch)
    }
      , recordEndTouchData = function(touch) {
        var touchBank = touchHistory.touchBank
          , touchTrack = touchBank[touch.identifier];
        __DEV__ && (validateTouch(touch),
        invariant(touchTrack, "Touch data should have been recorded on start")),
        touchTrack.previousPageX = touchTrack.currentPageX,
        touchTrack.previousPageY = touchTrack.currentPageY,
        touchTrack.previousTimeStamp = touchTrack.currentTimeStamp,
        touchTrack.currentPageX = touch.pageX,
        touchTrack.currentPageY = touch.pageY,
        touchTrack.currentTimeStamp = timestampForTouch(touch),
        touchTrack.touchActive = !1,
        touchHistory.mostRecentTimeStamp = timestampForTouch(touch)
    }
      , ResponderTouchHistoryStore = {
        recordTouchTrack: function(topLevelType, nativeEvent) {
            if (!nativeEvent.changedTouches)
                return !1;
            var touchBank = touchHistory.touchBank;
            if (isMoveish(topLevelType))
                nativeEvent.changedTouches.forEach(recordMoveTouchData);
            else if (isStartish(topLevelType))
                nativeEvent.changedTouches.forEach(recordStartTouchData),
                touchHistory.numberActiveTouches = nativeEvent.touches.length,
                1 === touchHistory.numberActiveTouches && (touchHistory.indexOfSingleActiveTouch = nativeEvent.touches[0].identifier);
            else if (isEndish(topLevelType) && (nativeEvent.changedTouches.forEach(recordEndTouchData),
            touchHistory.numberActiveTouches = nativeEvent.touches.length,
            1 === touchHistory.numberActiveTouches)) {
                for (var i = 0; i < touchBank.length; i++) {
                    var touchTrackToCheck = touchBank[i];
                    if (null  != touchTrackToCheck && touchTrackToCheck.touchActive) {
                        touchHistory.indexOfSingleActiveTouch = i;
                        break
                    }
                }
                if (__DEV__) {
                    var activeTouchData = touchBank[touchHistory.indexOfSingleActiveTouch]
                      , foundActive = null  != activeTouchData && !!activeTouchData.touchActive;
                    invariant(foundActive, "Cannot find single active touch")
                }
            }
        },
        touchHistory: touchHistory
    };
    module.exports = ResponderTouchHistoryStore
}),
__d("accumulate", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function accumulate(current, next) {
        if (invariant(null  != next, "accumulate(...): Accumulated items must be not be null or undefined."),
        null  == current)
            return next;
        var currentIsArray = Array.isArray(current)
          , nextIsArray = Array.isArray(next);
        return currentIsArray ? current.concat(next) : nextIsArray ? [current].concat(next) : [current, next]
    }
    var invariant = require("invariant");
    module.exports = accumulate
}),
__d("UniversalWorkerNodeHandle", ["ReactNativeTagHandles", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    var ReactNativeTagHandles = require("ReactNativeTagHandles")
      , invariant = require("invariant")
      , UniversalWorkerNodeHandle = {
        getRootNodeID: function(nodeHandle) {
            return invariant(void 0 !== nodeHandle && null  !== nodeHandle && 0 !== nodeHandle, "No node handle defined"),
            ReactNativeTagHandles.tagToRootNodeID[nodeHandle]
        }
    };
    module.exports = UniversalWorkerNodeHandle
}),
__d("createReactNativeComponentClass", ["ReactElement", "ReactNativeBaseComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactNativeBaseComponent = (require("ReactElement"),
    require("ReactNativeBaseComponent"))
      , createReactNativeComponentClass = function(viewConfig) {
        var Constructor = function(element) {
            this._currentElement = element,
            this._rootNodeID = null ,
            this._renderedChildren = null ,
            this.previousFlattenedStyle = null 
        }
        ;
        return Constructor.displayName = viewConfig.uiViewClassName,
        Constructor.prototype = new ReactNativeBaseComponent(viewConfig),
        Constructor
    }
    ;
    module.exports = createReactNativeComponentClass
}),
__d("ReactNativeBaseComponent", ["NativeMethodsMixin", "ReactNativeEventEmitter", "ReactNativeStyleAttributes", "ReactNativeTagHandles", "ReactMultiChild", "NativeModules", "styleDiffer", "deepFreezeAndThrowOnMutationInDev", "diffRawProperties", "flattenStyle", "precomputeStyle", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , ReactNativeEventEmitter = require("ReactNativeEventEmitter")
      , ReactNativeStyleAttributes = require("ReactNativeStyleAttributes")
      , ReactNativeTagHandles = require("ReactNativeTagHandles")
      , ReactMultiChild = require("ReactMultiChild")
      , RCTUIManager = require("NativeModules").UIManager
      , styleDiffer = require("styleDiffer")
      , deepFreezeAndThrowOnMutationInDev = require("deepFreezeAndThrowOnMutationInDev")
      , diffRawProperties = require("diffRawProperties")
      , flattenStyle = require("flattenStyle")
      , precomputeStyle = require("precomputeStyle")
      , warning = require("warning")
      , registrationNames = ReactNativeEventEmitter.registrationNames
      , putListener = ReactNativeEventEmitter.putListener
      , deleteListener = ReactNativeEventEmitter.deleteListener
      , deleteAllListeners = ReactNativeEventEmitter.deleteAllListeners
      , ReactNativeBaseComponent = function(viewConfig) {
        this.viewConfig = viewConfig
    }
      , cachedIndexArray = function(size) {
        var cachedResult = cachedIndexArray._cache[size];
        if (cachedResult)
            return cachedResult;
        for (var arr = [], i = 0; size > i; i++)
            arr[i] = i;
        return cachedIndexArray._cache[size] = arr
    }
    ;
    cachedIndexArray._cache = {},
    ReactNativeBaseComponent.Mixin = {
        getPublicInstance: function() {
            return this
        },
        construct: function(element) {
            this._currentElement = element
        },
        unmountComponent: function() {
            deleteAllListeners(this._rootNodeID),
            this.unmountChildren(),
            // delete ReactNativeTagHandles.tagToRootNodeID[ReactNativeTagHandles.rootNodeIDToTag[this._rootNodeID]],
            this._rootNodeID = null 
        },
        initializeChildren: function(children, containerTag, transaction, context) {
            var mountImages = this.mountChildren(children, transaction, context);
            if (mountImages.length) {
                for (var indexes = cachedIndexArray(mountImages.length), createdTags = [], i = 0; i < mountImages.length; i++) {
                    var mountImage = mountImages[i]
                      , childTag = mountImage.tag
                      , childID = mountImage.rootNodeID;
                    warning(mountImage && mountImage.rootNodeID && mountImage.tag, "Mount image returned does not have required data"),
                    ReactNativeTagHandles.associateRootNodeIDWithMountedNodeHandle(childID, childTag),
                    createdTags[i] = mountImage.tag
                }
                RCTUIManager.manageChildren(containerTag, null , null , createdTags, indexes, null )
            }
        },
        computeUpdatedProperties: function(prevProps, nextProps, validAttributes) {
            if (__DEV__)
                for (var key in nextProps)
                    nextProps.hasOwnProperty(key) && nextProps[key] && validAttributes[key] && deepFreezeAndThrowOnMutationInDev(nextProps[key]);
            var updatePayload = diffRawProperties(null , prevProps, nextProps, validAttributes);
            if (styleDiffer(nextProps.style, prevProps.style)) {
                var nextFlattenedStyle = precomputeStyle(flattenStyle(nextProps.style));
                updatePayload = diffRawProperties(updatePayload, this.previousFlattenedStyle, nextFlattenedStyle, ReactNativeStyleAttributes),
                this.previousFlattenedStyle = nextFlattenedStyle
            }
            return updatePayload
        },
        receiveComponent: function(nextElement, transaction, context) {
            var prevElement = this._currentElement;
            this._currentElement = nextElement;
            var updatePayload = this.computeUpdatedProperties(prevElement.props, nextElement.props, this.viewConfig.validAttributes);
            updatePayload && RCTUIManager.updateView(ReactNativeTagHandles.mostRecentMountedNodeHandleForRootNodeID(this._rootNodeID), this.viewConfig.uiViewClassName, updatePayload),
            this._reconcileListenersUponUpdate(prevElement.props, nextElement.props),
            this.updateChildren(nextElement.props.children, transaction, context)
        },
        _registerListenersUponCreation: function(initialProps) {
            for (var key in initialProps)
                if (registrationNames[key] && initialProps[key]) {
                    var listener = initialProps[key];
                    putListener(this._rootNodeID, key, listener)
                }
        },
        _reconcileListenersUponUpdate: function(prevProps, nextProps) {
            for (var key in prevProps)
                registrationNames[key] && !nextProps[key] && deleteListener(this._rootNodeID, key);
            for (var key in nextProps)
                registrationNames[key] && nextProps[key] != prevProps[key] && putListener(this._rootNodeID, key, nextProps[key])
        },
        mountComponent: function(rootID, transaction, context) {
            this._rootNodeID = rootID;
            var tag = ReactNativeTagHandles.allocateTag();
            this.previousFlattenedStyle = {};
            var updatePayload = this.computeUpdatedProperties({}, this._currentElement.props, this.viewConfig.validAttributes);
            return RCTUIManager.createView(tag, this.viewConfig.uiViewClassName, updatePayload),
            this._registerListenersUponCreation(this._currentElement.props),
            this.initializeChildren(this._currentElement.props.children, tag, transaction, context),
            {
                rootNodeID: rootID,
                tag: tag
            }
        }
    },
    Object.assign(ReactNativeBaseComponent.prototype, ReactMultiChild.Mixin, ReactNativeBaseComponent.Mixin, NativeMethodsMixin),
    module.exports = ReactNativeBaseComponent
}),
__d("NativeMethodsMixin", ["NativeModules", "TextInputState", "findNodeHandle", "flattenStyle", "invariant", "mergeFast", "mountSafeCallback", "precomputeStyle"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function throwOnStylesProp(component, props) {
        if (void 0 !== props.styles) {
            var owner = component._owner || null 
              , name = component.constructor.displayName
              , msg = "`styles` is not a supported property of `" + name + "`, did you mean `style` (singular)?";
            throw owner && owner.constructor && owner.constructor.displayName && (msg += "\n\nCheck the `" + owner.constructor.displayName + "` parent  component."),
            new Error(msg)
        }
    }
    var NativeModules = require("NativeModules")
      , RCTPOPAnimationManager = NativeModules.POPAnimationManager
      , TextInputState = require("TextInputState")
      , findNodeHandle = require("findNodeHandle")
      , flattenStyle = require("flattenStyle")
      , invariant = require("invariant")
      , mergeFast = require("mergeFast")
      , mountSafeCallback = require("mountSafeCallback")
      , precomputeStyle = require("precomputeStyle")
      , animationIDInvariant = function(funcName, anim) {
        invariant(anim, funcName + ' must be called with a valid animation ID returned from POPAnimation.createAnimation, received: "' + anim + '"')
    }
      , callNativeRender = require("callNativeRender").call
      , NativeMethodsMixin = {
        addAnimation: function(anim, callback) {
            animationIDInvariant("addAnimation", anim),
            RCTPOPAnimationManager.addAnimation(findNodeHandle(this), anim, mountSafeCallback(this, callback))
        },
        removeAnimation: function(anim) {
            animationIDInvariant("removeAnimation", anim),
            RCTPOPAnimationManager.removeAnimation(findNodeHandle(this), anim)
        },
        measure: function(callback) {
            RCTUIManager.measure(findNodeHandle(this), mountSafeCallback(this, callback))
        },
        measureLayout: function(relativeToNativeNode, onSuccess, onFail) {
            RCTUIManager.measureLayout(findNodeHandle(this), relativeToNativeNode, mountSafeCallback(this, onFail), mountSafeCallback(this, onSuccess))
        },
        setNativeProps: function(nativeProps) {
            var hasOnlyStyle = !0;
            for (var key in nativeProps)
                if ("style" !== key) {
                    hasOnlyStyle = !1;
                    break
                }
            var style = precomputeStyle(flattenStyle(nativeProps.style))
              , props = null ;
            props = hasOnlyStyle ? style : style ? mergeFast(nativeProps, style) : nativeProps;
            var props2 = {};
            Object.keys(props).forEach(function(v) {
                "opacity" != v && (props2[v] = props[v] + "")
            }),
            props.opacity && (props.opacity > 255 ? props2.opacity = "255" : props.opacity < 0 ? props2.opacity = "0" : props2.opacity = props.opacity + ""),
            callNativeRender(["RCTUIManager", "updateView", JSON.stringify([findNodeHandle(this), this.viewConfig.uiViewClassName, props2])], "now")
        },
        focus: function() {
            TextInputState.focusTextInput(findNodeHandle(this))
        },
        blur: function() {
            TextInputState.blurTextInput(findNodeHandle(this))
        }
    };
    if (__DEV__) {
        var NativeMethodsMixin_DEV = NativeMethodsMixin;
        invariant(!NativeMethodsMixin_DEV.componentWillMount && !NativeMethodsMixin_DEV.componentWillReceiveProps, "Do not override existing functions."),
        NativeMethodsMixin_DEV.componentWillMount = function() {
            throwOnStylesProp(this, this.props)
        }
        ,
        NativeMethodsMixin_DEV.componentWillReceiveProps = function(newProps) {
            throwOnStylesProp(this, newProps)
        }
    }
    module.exports = NativeMethodsMixin
}),
__d("TextInputState", ["NativeModules"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var RCTUIManager = require("NativeModules").UIManager
      , TextInputState = {
        _currentlyFocusedID: null ,
        currentlyFocusedField: function() {
            return this._currentlyFocusedID
        },
        focusTextInput: function(textFieldID) {
            this._currentlyFocusedID !== textFieldID && null  !== textFieldID && (this._currentlyFocusedID = textFieldID,
            RCTUIManager.focus(textFieldID))
        },
        blurTextInput: function(textFieldID) {
            this._currentlyFocusedID === textFieldID && null  !== textFieldID && (this._currentlyFocusedID = null ,
            RCTUIManager.blur(textFieldID))
        }
    };
    module.exports = TextInputState
}),
__d("findNodeHandle", ["ReactCurrentOwner", "ReactInstanceMap", "ReactNativeTagHandles", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function findNodeHandle(componentOrHandle) {
        if (__DEV__) {
            var owner = ReactCurrentOwner.current;
            null  !== owner && (warning(owner._warnedAboutRefsInRender, "%s is accessing findNodeHandle inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", owner.getName() || "A component"),
            owner._warnedAboutRefsInRender = !0)
        }
        if (null  == componentOrHandle)
            return null ;
        if ("number" == typeof componentOrHandle)
            return componentOrHandle;
        var component = componentOrHandle
          , internalInstance = ReactInstanceMap.get(component);
        if (internalInstance)
            return ReactNativeTagHandles.rootNodeIDToTag[internalInstance._rootNodeID];
        var rootNodeID = component._rootNodeID;
        return rootNodeID ? ReactNativeTagHandles.rootNodeIDToTag[rootNodeID] : (invariant("object" == typeof component && "_rootNodeID" in component || null  != component.render && "function" == typeof component.render, "findNodeHandle(...): Argument is not a component (type: %s, keys: %s)", typeof component, Object.keys(component)),
        void invariant(!1, "findNodeHandle(...): Unable to find node handle for unmounted component."))
    }
    var ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactInstanceMap = require("ReactInstanceMap")
      , ReactNativeTagHandles = require("ReactNativeTagHandles")
      , invariant = require("invariant")
      , warning = require("warning");
    module.exports = findNodeHandle
}),
__d("flattenStyle", ["StyleSheetRegistry", "invariant", "mergeIntoFast"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getStyle(style) {
        return "number" == typeof style ? StyleSheetRegistry.getStyleByID(style) : style
    }
    function flattenStyle(style) {
        if (style) {
            if (invariant(style !== !0, "style may be false but not true"),
            !Array.isArray(style))
                return getStyle(style);
            for (var result = {}, i = 0; i < style.length; ++i) {
                var computedStyle = flattenStyle(style[i]);
                computedStyle && mergeIntoFast(result, computedStyle)
            }
            return result
        }
    }
    var StyleSheetRegistry = require("StyleSheetRegistry")
      , invariant = require("invariant")
      , mergeIntoFast = require("mergeIntoFast");
    module.exports = flattenStyle
}),
__d("StyleSheetRegistry", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function StyleSheetRegistry() {}
    var styles = {}
      , uniqueID = 1
      , emptyStyle = {};
    window.styleLib = styles,
    StyleSheetRegistry.registerStyle = function(style) {
        var id = ++uniqueID;
        return __DEV__ && Object.freeze(style),
        styles[id] = style,
        id
    }
    ,
    StyleSheetRegistry.getStyleByID = function(id) {
        if (!id)
            return emptyStyle;
        var style = styles[id];
        return style ? style : (console.warn("Invalid style with id `" + id + "`. Skipping ..."),
        emptyStyle)
    }
    ,
    module.exports = StyleSheetRegistry
}),
__d("mergeIntoFast", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var mergeIntoFast = function(one, two) {
        for (var keyTwo in two)
            one[keyTwo] = two[keyTwo]
    }
    ;
    module.exports = mergeIntoFast
}),
__d("mergeFast", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var mergeFast = function(one, two) {
        var ret = {};
        for (var keyOne in one)
            ret[keyOne] = one[keyOne];
        for (var keyTwo in two)
            ret[keyTwo] = two[keyTwo];
        return ret
    }
    ;
    module.exports = mergeFast
}),
__d("mountSafeCallback", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var mountSafeCallback = function(context, callback) {
        return function() {
            return callback && context.isMounted() ? callback.apply(context, arguments) : void 0
        }
    }
    ;
    module.exports = mountSafeCallback
}),
__d("precomputeStyle", ["MatrixMath", "Platform", "deepFreezeAndThrowOnMutationInDev", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function precomputeStyle(style) {
        if (!style || !style.transform)
            return style;
        invariant(!style.transformMatrix, "transformMatrix and transform styles cannot be used on the same component");
        var newStyle = _precomputeTransforms(Object.assign({}, style));
        return newStyle
    }
    function _precomputeTransforms(style) {
        var $__0 = style
          , transform = $__0.transform
          , result = MatrixMath.createIdentityMatrix();
        return transform.forEach(function(transformation) {
            var key = Object.keys(transformation)[0]
              , value = transformation[key];
            switch (__DEV__ && _validateTransform(key, value, transformation),
            key) {
            case "matrix":
                MatrixMath.multiplyInto(result, result, value);
                break;
            case "rotate":
                _multiplyTransform(result, MatrixMath.reuseRotateZCommand, [_convertToRadians(value)]);
                break;
            case "scale":
                _multiplyTransform(result, MatrixMath.reuseScaleCommand, [value]);
                break;
            case "scaleX":
                _multiplyTransform(result, MatrixMath.reuseScaleXCommand, [value]);
                break;
            case "scaleY":
                _multiplyTransform(result, MatrixMath.reuseScaleYCommand, [value]);
                break;
            case "translate":
                _multiplyTransform(result, MatrixMath.reuseTranslate3dCommand, [value[0], value[1], value[2] || 0]);
                break;
            case "translateX":
                _multiplyTransform(result, MatrixMath.reuseTranslate2dCommand, [value, 0]);
                break;
            case "translateY":
                _multiplyTransform(result, MatrixMath.reuseTranslate2dCommand, [0, value]);
                break;
            default:
                throw new Error("Invalid transform name: " + key)
            }
        }),
        // "android" === Platform.OS ? Object.assign({}, style, {
        //     transformMatrix: result,
        //     decomposedMatrix: MatrixMath.decomposeMatrix(result)
        // }) : Object.assign({}, style, {
        //     transformMatrix: result
        // })
        Object.assign({}, style, {
            transformMatrix: result
        })
    }
    function _multiplyTransform(result, matrixMathFunction, args) {
        var matrixToApply = MatrixMath.createIdentityMatrix()
          , argsWithIdentity = [matrixToApply].concat(args);
        matrixMathFunction.apply(this, argsWithIdentity),
        MatrixMath.multiplyInto(result, result, matrixToApply)
    }
    function _convertToRadians(value) {
        var floatValue = parseFloat(value, 10);
        return value.indexOf("rad") > -1 ? floatValue : floatValue * Math.PI / 180
    }
    function _validateTransform(key, value, transformation) {
        var multivalueTransforms = ["matrix", "translate"];
        switch (-1 !== multivalueTransforms.indexOf(key) && invariant(Array.isArray(value), "Transform with key of %s must have an array as the value: %s", key, JSON.stringify(transformation)),
        key) {
        case "matrix":
            invariant(9 === value.length || 16 === value.length, "Matrix transform must have a length of 9 (2d) or 16 (3d). Provided matrix has a length of %s: %s", value.length, JSON.stringify(transformation));
            break;
        case "translate":
            break;
        case "rotate":
            invariant("string" == typeof value, 'Transform with key of "%s" must be a string: %s', key, JSON.stringify(transformation)),
            invariant(value.indexOf("deg") > -1 || value.indexOf("rad") > -1, "Rotate transform must be expressed in degrees (deg) or radians (rad): %s", JSON.stringify(transformation));
            break;
        default:
            invariant("number" == typeof value, 'Transform with key of "%s" must be a number: %s', key, JSON.stringify(transformation))
        }
    }
    var MatrixMath = require("MatrixMath")
      , Platform = require("Platform")
      , invariant = (require("deepFreezeAndThrowOnMutationInDev"),
    require("invariant"));
    module.exports = precomputeStyle
}),
__d("MatrixMath", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , MatrixMath = {
        createIdentityMatrix: function() {
            return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        },
        createCopy: function(m) {
            return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]]
        },
        createTranslate2d: function(x, y) {
            var mat = MatrixMath.createIdentityMatrix();
            return MatrixMath.reuseTranslate2dCommand(mat, x, y),
            mat
        },
        reuseTranslate2dCommand: function(matrixCommand, x, y) {
            matrixCommand[12] = x,
            matrixCommand[13] = y
        },
        reuseTranslate3dCommand: function(matrixCommand, x, y, z) {
            matrixCommand[12] = x,
            matrixCommand[13] = y,
            matrixCommand[14] = z
        },
        createScale: function(factor) {
            var mat = MatrixMath.createIdentityMatrix();
            return MatrixMath.reuseScaleCommand(mat, factor),
            mat
        },
        reuseScaleCommand: function(matrixCommand, factor) {
            matrixCommand[0] = factor,
            matrixCommand[5] = factor
        },
        reuseScale3dCommand: function(matrixCommand, x, y, z) {
            matrixCommand[0] = x,
            matrixCommand[5] = y,
            matrixCommand[10] = z
        },
        reuseScaleXCommand: function(matrixCommand, factor) {
            matrixCommand[0] = factor
        },
        reuseScaleYCommand: function(matrixCommand, factor) {
            matrixCommand[5] = factor
        },
        reuseScaleZCommand: function(matrixCommand, factor) {
            matrixCommand[10] = factor
        },
        reuseRotateXCommand: function(matrixCommand, radians) {
            matrixCommand[5] = Math.cos(radians),
            matrixCommand[6] = Math.sin(radians),
            matrixCommand[9] = -Math.sin(radians),
            matrixCommand[10] = Math.cos(radians)
        },
        reuseRotateYCommand: function(matrixCommand, amount) {
            matrixCommand[0] = Math.cos(amount),
            matrixCommand[2] = -Math.sin(amount),
            matrixCommand[8] = Math.sin(amount),
            matrixCommand[10] = Math.cos(amount)
        },
        reuseRotateZCommand: function(matrixCommand, radians) {
            matrixCommand[0] = Math.cos(radians),
            matrixCommand[1] = Math.sin(radians),
            matrixCommand[4] = -Math.sin(radians),
            matrixCommand[5] = Math.cos(radians)
        },
        createRotateZ: function(radians) {
            var mat = MatrixMath.createIdentityMatrix();
            return MatrixMath.reuseRotateZCommand(mat, radians),
            mat
        },
        multiplyInto: function(out, a, b) {
            var a00 = a[0]
              , a01 = a[1]
              , a02 = a[2]
              , a03 = a[3]
              , a10 = a[4]
              , a11 = a[5]
              , a12 = a[6]
              , a13 = a[7]
              , a20 = a[8]
              , a21 = a[9]
              , a22 = a[10]
              , a23 = a[11]
              , a30 = a[12]
              , a31 = a[13]
              , a32 = a[14]
              , a33 = a[15]
              , b0 = b[0]
              , b1 = b[1]
              , b2 = b[2]
              , b3 = b[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
            b0 = b[4],
            b1 = b[5],
            b2 = b[6],
            b3 = b[7],
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
            b0 = b[8],
            b1 = b[9],
            b2 = b[10],
            b3 = b[11],
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
            b0 = b[12],
            b1 = b[13],
            b2 = b[14],
            b3 = b[15],
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
        },
        determinant: function(matrix) {
            var $__0 = matrix
              , m00 = $__0[0]
              , m01 = $__0[1]
              , m02 = $__0[2]
              , m03 = $__0[3]
              , m10 = $__0[4]
              , m11 = $__0[5]
              , m12 = $__0[6]
              , m13 = $__0[7]
              , m20 = $__0[8]
              , m21 = $__0[9]
              , m22 = $__0[10]
              , m23 = $__0[11]
              , m30 = $__0[12]
              , m31 = $__0[13]
              , m32 = $__0[14]
              , m33 = $__0[15];
            return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 + m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 + m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 + m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 + m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 + m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33
        },
        inverse: function(matrix) {
            var det = MatrixMath.determinant(matrix);
            if (!det)
                return matrix;
            var $__0 = matrix
              , m00 = $__0[0]
              , m01 = $__0[1]
              , m02 = $__0[2]
              , m03 = $__0[3]
              , m10 = $__0[4]
              , m11 = $__0[5]
              , m12 = $__0[6]
              , m13 = $__0[7]
              , m20 = $__0[8]
              , m21 = $__0[9]
              , m22 = $__0[10]
              , m23 = $__0[11]
              , m30 = $__0[12]
              , m31 = $__0[13]
              , m32 = $__0[14]
              , m33 = $__0[15];
            return [(m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33) / det, (m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33) / det, (m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33) / det, (m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23) / det, (m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33) / det, (m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33) / det, (m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33) / det, (m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23) / det, (m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33) / det, (m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33) / det, (m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33) / det, (m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23) / det, (m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32) / det, (m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32) / det, (m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32) / det, (m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22) / det]
        },
        transpose: function(m) {
            return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]]
        },
        multiplyVectorByMatrix: function(v, m) {
            var $__0 = v
              , vx = $__0[0]
              , vy = $__0[1]
              , vz = $__0[2]
              , vw = $__0[3];
            return [vx * m[0] + vy * m[4] + vz * m[8] + vw * m[12], vx * m[1] + vy * m[5] + vz * m[9] + vw * m[13], vx * m[2] + vy * m[6] + vz * m[10] + vw * m[14], vx * m[3] + vy * m[7] + vz * m[11] + vw * m[15]]
        },
        v3Length: function(a) {
            return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
        },
        v3Normalize: function(vector, v3Length) {
            var im = 1 / (v3Length || MatrixMath.v3Length(vector));
            return [vector[0] * im, vector[1] * im, vector[2] * im]
        },
        v3Dot: function(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
        },
        v3Combine: function(a, b, aScale, bScale) {
            return [aScale * a[0] + bScale * b[0], aScale * a[1] + bScale * b[1], aScale * a[2] + bScale * b[2]]
        },
        v3Cross: function(a, b) {
            return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
        },
        quaternionToDegreesXYZ: function(q, matrix, row) {
            var $__0 = q
              , qx = $__0[0]
              , qy = $__0[1]
              , qz = $__0[2]
              , qw = $__0[3]
              , qw2 = qw * qw
              , qx2 = qx * qx
              , qy2 = qy * qy
              , qz2 = qz * qz
              , test = qx * qy + qz * qw
              , unit = qw2 + qx2 + qy2 + qz2
              , conv = 180 / Math.PI;
            return test > .49999 * unit ? [0, 2 * Math.atan2(qx, qw) * conv, 90] : -.49999 * unit > test ? [0, -2 * Math.atan2(qx, qw) * conv, -90] : [MatrixMath.roundTo3Places(Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx2 - 2 * qz2) * conv), MatrixMath.roundTo3Places(Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy2 - 2 * qz2) * conv), MatrixMath.roundTo3Places(Math.asin(2 * qx * qy + 2 * qz * qw) * conv)]
        },
        roundTo3Places: function(n) {
            var arr = n.toString().split("e");
            return .001 * Math.round(arr[0] + "e" + (arr[1] ? +arr[1] - 3 : 3))
        },
        decomposeMatrix: function(transformMatrix) {
            invariant(16 === transformMatrix.length, "Matrix decomposition needs a list of 3d matrix values, received %s", transformMatrix);
            var perspective = []
              , quaternion = []
              , scale = []
              , skew = []
              , translation = [];
            if (transformMatrix[15]) {
                for (var matrix = [], perspectiveMatrix = [], i = 0; 4 > i; i++) {
                    matrix.push([]);
                    for (var j = 0; 4 > j; j++) {
                        var value = transformMatrix[4 * i + j] / transformMatrix[15];
                        matrix[i].push(value),
                        perspectiveMatrix.push(3 === j ? 0 : value)
                    }
                }
                if (perspectiveMatrix[15] = 1,
                MatrixMath.determinant(perspectiveMatrix)) {
                    if (0 !== matrix[0][3] || 0 !== matrix[1][3] || 0 !== matrix[2][3])
                        var rightHandSide = [matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]]
                          , inversePerspectiveMatrix = MatrixMath.inverse3x3(perspectiveMatrix)
                          , transposedInversePerspectiveMatrix = MatrixMath.transpose4x4(inversePerspectiveMatrix)
                          , perspective = MatrixMath.multiplyVectorByMatrix(rightHandSide, transposedInversePerspectiveMatrix);
                    else
                        perspective[0] = perspective[1] = perspective[2] = 0,
                        perspective[3] = 1;
                    for (var i = 0; 3 > i; i++)
                        translation[i] = matrix[3][i];
                    var row = [];
                    for (i = 0; 3 > i; i++)
                        row[i] = [matrix[i][0], matrix[i][1], matrix[i][2]];
                    scale[0] = MatrixMath.v3Length(row[0]),
                    row[0] = MatrixMath.v3Normalize(row[0], scale[0]),
                    skew[0] = MatrixMath.v3Dot(row[0], row[1]),
                    row[1] = MatrixMath.v3Combine(row[1], row[0], 1, -skew[0]),
                    skew[0] = MatrixMath.v3Dot(row[0], row[1]),
                    row[1] = MatrixMath.v3Combine(row[1], row[0], 1, -skew[0]),
                    scale[1] = MatrixMath.v3Length(row[1]),
                    row[1] = MatrixMath.v3Normalize(row[1], scale[1]),
                    skew[0] /= scale[1],
                    skew[1] = MatrixMath.v3Dot(row[0], row[2]),
                    row[2] = MatrixMath.v3Combine(row[2], row[0], 1, -skew[1]),
                    skew[2] = MatrixMath.v3Dot(row[1], row[2]),
                    row[2] = MatrixMath.v3Combine(row[2], row[1], 1, -skew[2]),
                    scale[2] = MatrixMath.v3Length(row[2]),
                    row[2] = MatrixMath.v3Normalize(row[2], scale[2]),
                    skew[1] /= scale[2],
                    skew[2] /= scale[2];
                    var pdum3 = MatrixMath.v3Cross(row[1], row[2]);
                    if (MatrixMath.v3Dot(row[0], pdum3) < 0)
                        for (i = 0; 3 > i; i++)
                            scale[i] *= -1,
                            row[i][0] *= -1,
                            row[i][1] *= -1,
                            row[i][2] *= -1;
                    quaternion[0] = .5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0)),
                    quaternion[1] = .5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0)),
                    quaternion[2] = .5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0)),
                    quaternion[3] = .5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0)),
                    row[2][1] > row[1][2] && (quaternion[0] = -quaternion[0]),
                    row[0][2] > row[2][0] && (quaternion[1] = -quaternion[1]),
                    row[1][0] > row[0][1] && (quaternion[2] = -quaternion[2]);
                    var rotationDegrees;
                    return rotationDegrees = quaternion[0] < .001 && quaternion[0] >= 0 && quaternion[1] < .001 && quaternion[1] >= 0 ? [0, 0, MatrixMath.roundTo3Places(180 * Math.atan2(row[0][1], row[0][0]) / Math.PI)] : MatrixMath.quaternionToDegreesXYZ(quaternion, matrix, row),
                    {
                        rotationDegrees: rotationDegrees,
                        perspective: perspective,
                        quaternion: quaternion,
                        scale: scale,
                        skew: skew,
                        translation: translation,
                        rotate: rotationDegrees[2],
                        scaleX: scale[0],
                        scaleY: scale[1],
                        translateX: translation[0],
                        translateY: translation[1]
                    }
                }
            }
        }
    };
    module.exports = MatrixMath
}),
__d("deepFreezeAndThrowOnMutationInDev", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function deepFreezeAndThrowOnMutationInDev(object) {
        if (__DEV__) {
            if ("object" != typeof object || null  === object || Object.isFrozen(object) || Object.isSealed(object))
                return;
            for (var key in object)
                object.hasOwnProperty(key) && (object.__defineGetter__(key, identity.bind(null , object[key])),
                object.__defineSetter__(key, throwOnImmutableMutation.bind(null , key)),
                deepFreezeAndThrowOnMutationInDev(object[key]));
            Object.freeze(object),
            Object.seal(object)
        }
    }
    function throwOnImmutableMutation(key, value) {
        throw Error("You attempted to set the key `" + key + "` with the value `" + JSON.stringify(value) + "` on an object that is meant to be immutable and has been frozen.")
    }
    function identity(value) {
        return value
    }
    module.exports = deepFreezeAndThrowOnMutationInDev
}),
__d("ReactNativeEventEmitter", ["EventPluginHub", "ReactEventEmitterMixin", "ReactNativeTagHandles", "NodeHandle", "EventConstants", "merge", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var EventPluginHub = require("EventPluginHub")
      , ReactEventEmitterMixin = require("ReactEventEmitterMixin")
      , ReactNativeTagHandles = require("ReactNativeTagHandles")
      , NodeHandle = require("NodeHandle")
      , EventConstants = require("EventConstants")
      , merge = require("merge")
      , warning = require("warning")
      , topLevelTypes = EventConstants.topLevelTypes
      , EMPTY_NATIVE_EVENT = {}
      , touchSubsequence = function(touches, indices) {
        for (var ret = [], i = 0; i < indices.length; i++)
            ret.push(touches[indices[i]]);
        return ret
    }
      , removeTouchesAtIndices = function(touches, indices) {
        for (var rippedOut = [], temp = touches, i = 0; i < indices.length; i++) {
            var index = indices[i];
            rippedOut.push(touches[index]),
            temp[index] = null 
        }
        for (var fillAt = 0, j = 0; j < temp.length; j++) {
            var cur = temp[j];
            null  !== cur && (temp[fillAt++] = cur)
        }
        return temp.length = fillAt,
        rippedOut
    }
      , ReactNativeEventEmitter = merge(ReactEventEmitterMixin, {
        registrationNames: EventPluginHub.registrationNameModules,
        putListener: EventPluginHub.putListener,
        getListener: EventPluginHub.getListener,
        deleteListener: EventPluginHub.deleteListener,
        deleteAllListeners: EventPluginHub.deleteAllListeners,
        _receiveRootNodeIDEvent: function(rootNodeID, topLevelType, nativeEventParam) {
            var nativeEvent = nativeEventParam || EMPTY_NATIVE_EVENT;
            ReactNativeEventEmitter.handleTopLevel(topLevelType, rootNodeID, rootNodeID, nativeEvent)
        },
        receiveEvent: function(tag, topLevelType, nativeEventParam) {
            var rootNodeID = ReactNativeTagHandles.tagToRootNodeID[tag];
            ReactNativeEventEmitter._receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam)
        },
        mouseEvents: function(eventTopLevelType, events, changedIndices) {
            var nativeEvent = events[0]
              , rootNodeID = NodeHandle.getRootNodeID(nativeEvent.target);
            ReactNativeEventEmitter._receiveRootNodeIDEvent(rootNodeID, eventTopLevelType, nativeEvent)
        },
        keyEvents: function(eventTopLevelType, events, changedIndices) {
            if (!events)
                return !1;
            var nativeEvent = events[0]
              , rootNodeID = NodeHandle.getRootNodeID(nativeEvent.target);
            ReactNativeEventEmitter._receiveRootNodeIDEvent(rootNodeID, eventTopLevelType, nativeEvent)
        },
        receiveTouches: function(eventTopLevelType, touches, changedIndices) {
            for (var changedTouches = eventTopLevelType === topLevelTypes.topTouchEnd || eventTopLevelType === topLevelTypes.topTouchCancel ? removeTouchesAtIndices(touches, changedIndices) : touchSubsequence(touches, changedIndices), jj = 0; jj < changedTouches.length; jj++) {
                var touch = changedTouches[jj];
                touch.changedTouches = changedTouches,
                touch.touches = touches;
                var nativeEvent = touch
                  , rootNodeID = null 
                  , target = nativeEvent.target;
                null  !== target && void 0 !== target && (target < ReactNativeTagHandles.tagsStartAt ? __DEV__ && warning(!1, "A view is reporting that a touch occured on tag zero.") : rootNodeID = NodeHandle.getRootNodeID(target)),
                ReactNativeEventEmitter._receiveRootNodeIDEvent(rootNodeID, eventTopLevelType, nativeEvent)
            }
        }
    });
    module.exports = ReactNativeEventEmitter
}),
__d("ReactEventEmitterMixin", ["EventPluginHub"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function runEventQueueInBatch(events) {
        EventPluginHub.enqueueEvents(events),
        EventPluginHub.processEventQueue()
    }
    var EventPluginHub = require("EventPluginHub")
      , ReactEventEmitterMixin = {
        handleTopLevel: function(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent) {
            var events = EventPluginHub.extractEvents(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent);
            runEventQueueInBatch(events)
        }
    };
    module.exports = ReactEventEmitterMixin
}),
__d("ReactNativeStyleAttributes", ["ImageStylePropTypes", "TextStylePropTypes", "ViewStylePropTypes", "keyMirror", "matricesDiffer", "sizesDiffer"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ImageStylePropTypes = require("ImageStylePropTypes")
      , TextStylePropTypes = require("TextStylePropTypes")
      , ViewStylePropTypes = require("ViewStylePropTypes")
      , keyMirror = require("keyMirror")
      , matricesDiffer = require("matricesDiffer")
      , sizesDiffer = require("sizesDiffer")
      , ReactNativeStyleAttributes = Object.assign({}, keyMirror(ViewStylePropTypes), keyMirror(TextStylePropTypes), keyMirror(ImageStylePropTypes));
    ReactNativeStyleAttributes.transformMatrix = {
        diff: matricesDiffer
    },
    ReactNativeStyleAttributes.shadowOffset = {
        diff: sizesDiffer
    },
    module.exports = ReactNativeStyleAttributes
}),
__d("ImageStylePropTypes", ["ImageResizeMode", "LayoutPropTypes", "ReactPropTypes", "TransformPropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ImageResizeMode = require("ImageResizeMode")
      , LayoutPropTypes = require("LayoutPropTypes")
      , ReactPropTypes = require("ReactPropTypes")
      , TransformPropTypes = require("TransformPropTypes")
      , ImageStylePropTypes = Object.assign({}, LayoutPropTypes, TransformPropTypes, {
        resizeMode: ReactPropTypes.oneOf(Object.keys(ImageResizeMode)),
        backgroundColor: ReactPropTypes.string,
        hoverColor: ReactPropTypes.string,
        cursor: ReactPropTypes.string,
        background: ReactPropTypes.string,
        hoverBkColor: ReactPropTypes.string,
        borderColor: ReactPropTypes.string,
        borderWidth: ReactPropTypes.number,
        borderRadius: ReactPropTypes.number,
        tintColor: ReactPropTypes.string,
        opacity: ReactPropTypes.number
    });
    module.exports = ImageStylePropTypes
}),
__d("ImageResizeMode", ["keyMirror"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var keyMirror = require("keyMirror")
      , ImageResizeMode = keyMirror({
        contain: null ,
        cover: null ,
        stretch: null 
    });
    module.exports = ImageResizeMode
}),
__d("LayoutPropTypes", ["ReactPropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactPropTypes = require("ReactPropTypes")
      , LayoutPropTypes = {
        width: ReactPropTypes.number,
        height: ReactPropTypes.number,
        top: ReactPropTypes.number,
        left: ReactPropTypes.number,
        right: ReactPropTypes.number,
        bottom: ReactPropTypes.number,
        margin: ReactPropTypes.number,
        marginVertical: ReactPropTypes.number,
        marginHorizontal: ReactPropTypes.number,
        marginTop: ReactPropTypes.number,
        marginBottom: ReactPropTypes.number,
        marginLeft: ReactPropTypes.number,
        marginRight: ReactPropTypes.number,
        padding: ReactPropTypes.number,
        paddingVertical: ReactPropTypes.number,
        paddingHorizontal: ReactPropTypes.number,
        paddingTop: ReactPropTypes.number,
        paddingBottom: ReactPropTypes.number,
        paddingLeft: ReactPropTypes.number,
        paddingRight: ReactPropTypes.number,
        borderWidth: ReactPropTypes.number,
        borderTopWidth: ReactPropTypes.number,
        borderRightWidth: ReactPropTypes.number,
        borderBottomWidth: ReactPropTypes.number,
        borderLeftWidth: ReactPropTypes.number,
        position: ReactPropTypes.oneOf(["absolute", "relative"]),
        flexDirection: ReactPropTypes.oneOf(["row", "column"]),
        flexWrap: ReactPropTypes.oneOf(["wrap", "nowrap"]),
        justifyContent: ReactPropTypes.oneOf(["flex-start", "flex-end", "center", "space-between", "space-around"]),
        alignItems: ReactPropTypes.oneOf(["flex-start", "flex-end", "center", "stretch"]),
        alignSelf: ReactPropTypes.oneOf(["auto", "flex-start", "flex-end", "center", "stretch"]),
        flex: ReactPropTypes.number
    };
    module.exports = LayoutPropTypes
}),
__d("ReactPropTypes", ["ReactElement", "ReactFragment", "ReactPropTypeLocationNames", "emptyFunction"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function createChainableTypeChecker(validate) {
        function checkType(isRequired, props, propName, componentName, location) {
            if (componentName = componentName || ANONYMOUS,
            null  == props[propName]) {
                var locationName = ReactPropTypeLocationNames[location];
                return isRequired ? new Error("Required " + locationName + " `" + propName + "` was not specified in " + ("`" + componentName + "`.")) : null 
            }
            return validate(props, propName, componentName, location)
        }
        var chainedCheckType = checkType.bind(null , !1);
        return chainedCheckType.isRequired = checkType.bind(null , !0),
        chainedCheckType
    }
    function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location) {
            var propValue = props[propName]
              , propType = getPropType(propValue);
            if (propType !== expectedType) {
                var locationName = ReactPropTypeLocationNames[location]
                  , preciseType = getPreciseType(propValue);
                return new Error("Invalid " + locationName + " `" + propName + "` of type `" + preciseType + "` " + ("supplied to `" + componentName + "`, expected `" + expectedType + "`."))
            }
            return null 
        }
        return createChainableTypeChecker(validate)
    }
    function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunction.thatReturns(null ))
    }
    function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location) {
            var propValue = props[propName];
            if (!Array.isArray(propValue)) {
                var locationName = ReactPropTypeLocationNames[location]
                  , propType = getPropType(propValue);
                return new Error("Invalid " + locationName + " `" + propName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."))
            }
            for (var i = 0; i < propValue.length; i++) {
                var error = typeChecker(propValue, i, componentName, location);
                if (error instanceof Error)
                    return error
            }
            return null 
        }
        return createChainableTypeChecker(validate)
    }
    function createElementTypeChecker() {
        function validate(props, propName, componentName, location) {
            if (!ReactElement.isValidElement(props[propName])) {
                var locationName = ReactPropTypeLocationNames[location];
                return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + componentName + "`, expected a ReactElement."))
            }
            return null 
        }
        return createChainableTypeChecker(validate)
    }
    function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location) {
            if (!(props[propName] instanceof expectedClass)) {
                var locationName = ReactPropTypeLocationNames[location]
                  , expectedClassName = expectedClass.name || ANONYMOUS;
                return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + componentName + "`, expected instance of `" + expectedClassName + "`."))
            }
            return null 
        }
        return createChainableTypeChecker(validate)
    }
    function createEnumTypeChecker(expectedValues) {
        function validate(props, propName, componentName, location) {
            for (var propValue = props[propName], i = 0; i < expectedValues.length; i++)
                if (propValue === expectedValues[i])
                    return null ;
            var locationName = ReactPropTypeLocationNames[location]
              , valuesString = JSON.stringify(expectedValues);
            return new Error("Invalid " + locationName + " `" + propName + "` of value `" + propValue + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."))
        }
        return createChainableTypeChecker(validate)
    }
    function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location) {
            var propValue = props[propName]
              , propType = getPropType(propValue);
            if ("object" !== propType) {
                var locationName = ReactPropTypeLocationNames[location];
                return new Error("Invalid " + locationName + " `" + propName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."))
            }
            for (var key in propValue)
                if (propValue.hasOwnProperty(key)) {
                    var error = typeChecker(propValue, key, componentName, location);
                    if (error instanceof Error)
                        return error
                }
            return null 
        }
        return createChainableTypeChecker(validate)
    }
    function createUnionTypeChecker(arrayOfTypeCheckers) {
        function validate(props, propName, componentName, location) {
            for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                var checker = arrayOfTypeCheckers[i];
                if (null  == checker(props, propName, componentName, location))
                    return null 
            }
            var locationName = ReactPropTypeLocationNames[location];
            return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + componentName + "`."))
        }
        return createChainableTypeChecker(validate)
    }
    function createNodeChecker() {
        function validate(props, propName, componentName, location) {
            if (!isNode(props[propName])) {
                var locationName = ReactPropTypeLocationNames[location];
                return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."))
            }
            return null 
        }
        return createChainableTypeChecker(validate)
    }
    function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location) {
            var propValue = props[propName]
              , propType = getPropType(propValue);
            if ("object" !== propType) {
                var locationName = ReactPropTypeLocationNames[location];
                return new Error("Invalid " + locationName + " `" + propName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."))
            }
            for (var key in shapeTypes) {
                var checker = shapeTypes[key];
                if (checker) {
                    var error = checker(propValue, key, componentName, location);
                    if (error)
                        return error
                }
            }
            return null 
        }
        return createChainableTypeChecker(validate)
    }
    function isNode(propValue) {
        switch (typeof propValue) {
        case "number":
        case "string":
        case "undefined":
            return !0;
        case "boolean":
            return !propValue;
        case "object":
            if (Array.isArray(propValue))
                return propValue.every(isNode);
            if (null  === propValue || ReactElement.isValidElement(propValue))
                return !0;
            propValue = ReactFragment.extractIfFragment(propValue);
            for (var k in propValue)
                if (!isNode(propValue[k]))
                    return !1;
            return !0;
        default:
            return !1
        }
    }
    function getPropType(propValue) {
        var propType = typeof propValue;
        return Array.isArray(propValue) ? "array" : propValue instanceof RegExp ? "object" : propType
    }
    function getPreciseType(propValue) {
        var propType = getPropType(propValue);
        if ("object" === propType) {
            if (propValue instanceof Date)
                return "date";
            if (propValue instanceof RegExp)
                return "regexp"
        }
        return propType
    }
    var ReactElement = require("ReactElement")
      , ReactFragment = require("ReactFragment")
      , ReactPropTypeLocationNames = require("ReactPropTypeLocationNames")
      , emptyFunction = require("emptyFunction")
      , ANONYMOUS = "<<anonymous>>"
      , elementTypeChecker = createElementTypeChecker()
      , nodeTypeChecker = createNodeChecker()
      , ReactPropTypes = {
        array: createPrimitiveTypeChecker("array"),
        bool: createPrimitiveTypeChecker("boolean"),
        func: createPrimitiveTypeChecker("function"),
        number: createPrimitiveTypeChecker("number"),
        object: createPrimitiveTypeChecker("object"),
        string: createPrimitiveTypeChecker("string"),
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: elementTypeChecker,
        instanceOf: createInstanceTypeChecker,
        node: nodeTypeChecker,
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker
    };
    module.exports = ReactPropTypes
}),
__d("TransformPropTypes", ["ReactPropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactPropTypes = require("ReactPropTypes")
      , TransformPropTypes = {
        transform: ReactPropTypes.arrayOf(ReactPropTypes.oneOfType([ReactPropTypes.shape({
            rotate: ReactPropTypes.string
        }), ReactPropTypes.shape({
            scaleX: ReactPropTypes.number
        }), ReactPropTypes.shape({
            scaleY: ReactPropTypes.number
        }), ReactPropTypes.shape({
            translateX: ReactPropTypes.number
        }), ReactPropTypes.shape({
            translateY: ReactPropTypes.number
        })])),
        transformMatrix: ReactPropTypes.arrayOf(ReactPropTypes.number),
        rotation: ReactPropTypes.number,
        scaleX: ReactPropTypes.number,
        scaleY: ReactPropTypes.number,
        translateX: ReactPropTypes.number,
        translateY: ReactPropTypes.number
    };
    module.exports = TransformPropTypes
}),
__d("TextStylePropTypes", ["ReactPropTypes", "ViewStylePropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    for (var ReactPropTypes = require("ReactPropTypes"), ViewStylePropTypes = require("ViewStylePropTypes"), TextStylePropTypes = Object.assign(Object.create(ViewStylePropTypes), {
        fontFamily: ReactPropTypes.string,
        fontSize: ReactPropTypes.number,
        fontWeight: ReactPropTypes.oneOf(["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"]),
        fontStyle: ReactPropTypes.oneOf(["normal", "italic"]),
        lineHeight: ReactPropTypes.number,
        color: ReactPropTypes.string,
        containerBackgroundColor: ReactPropTypes.string,
        textAlign: ReactPropTypes.oneOf(["auto", "left", "right", "center"]),
        writingDirection: ReactPropTypes.oneOf(["auto", "ltr", "rtl"]),
        letterSpacing: ReactPropTypes.number
    }), unsupportedProps = Object.keys({
        padding: null ,
        paddingTop: null ,
        paddingLeft: null ,
        paddingRight: null ,
        paddingBottom: null ,
        paddingVertical: null ,
        paddingHorizontal: null 
    }), ii = 0; ii < unsupportedProps.length; ii++)
        delete TextStylePropTypes[unsupportedProps[ii]];
    module.exports = TextStylePropTypes
}),
__d("ViewStylePropTypes", ["LayoutPropTypes", "ReactPropTypes", "TransformPropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var LayoutPropTypes = require("LayoutPropTypes")
      , ReactPropTypes = require("ReactPropTypes")
      , TransformPropTypes = require("TransformPropTypes")
      , ViewStylePropTypes = Object.assign({}, LayoutPropTypes, TransformPropTypes, {
        backgroundColor: ReactPropTypes.string,
        hoverBkColor: ReactPropTypes.string,
        hoverColor: ReactPropTypes.string,
        cursor: ReactPropTypes.string,
        background: ReactPropTypes.string,
        borderColor: ReactPropTypes.string,
        borderTopColor: ReactPropTypes.string,
        borderRightColor: ReactPropTypes.string,
        borderBottomColor: ReactPropTypes.string,
        borderLeftColor: ReactPropTypes.string,
        borderRadius: ReactPropTypes.number,
        borderTopLeftRadius: ReactPropTypes.number,
        borderTopRightRadius: ReactPropTypes.number,
        borderBottomLeftRadius: ReactPropTypes.number,
        borderBottomRightRadius: ReactPropTypes.number,
        opacity: ReactPropTypes.number,
        overflow: ReactPropTypes.oneOf(["visible", "hidden"]),
        shadowColor: ReactPropTypes.string,
        shadowOffset: ReactPropTypes.shape({
            width: ReactPropTypes.number,
            height: ReactPropTypes.number
        }),
        shadowOpacity: ReactPropTypes.number,
        shadowRadius: ReactPropTypes.number
    });
    module.exports = ViewStylePropTypes
}),
__d("matricesDiffer", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var matricesDiffer = function(one, two) {
        return one === two ? !1 : !one || !two || one[12] !== two[12] || one[13] !== two[13] || one[14] !== two[14] || one[5] !== two[5] || one[10] !== two[10] || one[1] !== two[1] || one[2] !== two[2] || one[3] !== two[3] || one[4] !== two[4] || one[6] !== two[6] || one[7] !== two[7] || one[8] !== two[8] || one[9] !== two[9] || one[11] !== two[11] || one[15] !== two[15]
    }
    ;
    module.exports = matricesDiffer
}),
__d("sizesDiffer", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var dummySize = {
        width: void 0,
        height: void 0
    }
      , sizesDiffer = function(one, two) {
        return one = one || dummySize,
        two = two || dummySize,
        one !== two && (one.width !== two.width || one.height !== two.height)
    }
    ;
    module.exports = sizesDiffer
}),
__d("ReactMultiChild", ["ReactComponentEnvironment", "ReactMultiChildUpdateTypes", "ReactReconciler", "ReactChildReconciler"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function enqueueMarkup(parentID, markup, toIndex) {
        updateQueue.push({
            parentID: parentID,
            parentNode: null ,
            type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
            markupIndex: markupQueue.push(markup) - 1,
            textContent: null ,
            fromIndex: null ,
            toIndex: toIndex
        })
    }
    function enqueueMove(parentID, fromIndex, toIndex) {
        updateQueue.push({
            parentID: parentID,
            parentNode: null ,
            type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
            markupIndex: null ,
            textContent: null ,
            fromIndex: fromIndex,
            toIndex: toIndex
        })
    }
    function enqueueRemove(parentID, fromIndex) {
        updateQueue.push({
            parentID: parentID,
            parentNode: null ,
            type: ReactMultiChildUpdateTypes.REMOVE_NODE,
            markupIndex: null ,
            textContent: null ,
            fromIndex: fromIndex,
            toIndex: null 
        })
    }
    function enqueueTextContent(parentID, textContent) {
        updateQueue.push({
            parentID: parentID,
            parentNode: null ,
            type: ReactMultiChildUpdateTypes.TEXT_CONTENT,
            markupIndex: null ,
            textContent: textContent,
            fromIndex: null ,
            toIndex: null 
        })
    }
    function processQueue() {
        updateQueue.length && (ReactComponentEnvironment.processChildrenUpdates(updateQueue, markupQueue),
        clearQueue())
    }
    function clearQueue() {
        updateQueue.length = 0,
        markupQueue.length = 0
    }
    var ReactComponentEnvironment = require("ReactComponentEnvironment")
      , ReactMultiChildUpdateTypes = require("ReactMultiChildUpdateTypes")
      , ReactReconciler = require("ReactReconciler")
      , ReactChildReconciler = require("ReactChildReconciler")
      , updateDepth = 0
      , updateQueue = []
      , markupQueue = []
      , ReactMultiChild = {
        Mixin: {
            mountChildren: function(nestedChildren, transaction, context) {
                var children = ReactChildReconciler.instantiateChildren(nestedChildren, transaction, context);
                this._renderedChildren = children;
                var mountImages = []
                  , index = 0;
                for (var name in children)
                    if (children.hasOwnProperty(name)) {
                        var child = children[name]
                          , rootID = this._rootNodeID + name
                          , mountImage = ReactReconciler.mountComponent(child, rootID, transaction, context);
                        child._mountIndex = index,
                        mountImages.push(mountImage),
                        index++
                    }
                return mountImages
            },
            updateTextContent: function(nextContent) {
                updateDepth++;
                var errorThrown = !0;
                try {
                    var prevChildren = this._renderedChildren;
                    ReactChildReconciler.unmountChildren(prevChildren);
                    for (var name in prevChildren)
                        prevChildren.hasOwnProperty(name) && this._unmountChildByName(prevChildren[name], name);
                    this.setTextContent(nextContent),
                    errorThrown = !1
                } finally {
                    updateDepth--,
                    updateDepth || (errorThrown ? clearQueue() : processQueue())
                }
            },
            updateChildren: function(nextNestedChildren, transaction, context) {
                updateDepth++;
                var errorThrown = !0;
                try {
                    this._updateChildren(nextNestedChildren, transaction, context),
                    errorThrown = !1
                } finally {
                    updateDepth--,
                    updateDepth || (errorThrown ? clearQueue() : processQueue())
                }
            },
            _updateChildren: function(nextNestedChildren, transaction, context) {
                var prevChildren = this._renderedChildren
                  , nextChildren = ReactChildReconciler.updateChildren(prevChildren, nextNestedChildren, transaction, context);
                if (this._renderedChildren = nextChildren,
                nextChildren || prevChildren) {
                    var name, lastIndex = 0, nextIndex = 0;
                    for (name in nextChildren)
                        if (nextChildren.hasOwnProperty(name)) {
                            var prevChild = prevChildren && prevChildren[name]
                              , nextChild = nextChildren[name];
                            prevChild === nextChild ? (this.moveChild(prevChild, nextIndex, lastIndex),
                            lastIndex = Math.max(prevChild._mountIndex, lastIndex),
                            prevChild._mountIndex = nextIndex) : (prevChild && (lastIndex = Math.max(prevChild._mountIndex, lastIndex),
                            this._unmountChildByName(prevChild, name)),
                            this._mountChildByNameAtIndex(nextChild, name, nextIndex, transaction, context)),
                            nextIndex++
                        }
                    for (name in prevChildren)
                        !prevChildren.hasOwnProperty(name) || nextChildren && nextChildren.hasOwnProperty(name) || this._unmountChildByName(prevChildren[name], name)
                }
            },
            unmountChildren: function() {
                var renderedChildren = this._renderedChildren;
                ReactChildReconciler.unmountChildren(renderedChildren),
                this._renderedChildren = null 
            },
            moveChild: function(child, toIndex, lastIndex) {
                child._mountIndex < lastIndex && enqueueMove(this._rootNodeID, child._mountIndex, toIndex)
            },
            createChild: function(child, mountImage) {
                enqueueMarkup(this._rootNodeID, mountImage, child._mountIndex)
            },
            removeChild: function(child) {
                enqueueRemove(this._rootNodeID, child._mountIndex)
            },
            setTextContent: function(textContent) {
                enqueueTextContent(this._rootNodeID, textContent)
            },
            _mountChildByNameAtIndex: function(child, name, index, transaction, context) {
                var rootID = this._rootNodeID + name
                  , mountImage = ReactReconciler.mountComponent(child, rootID, transaction, context);
                child._mountIndex = index,
                this.createChild(child, mountImage)
            },
            _unmountChildByName: function(child, name) {
                this.removeChild(child),
                child._mountIndex = null 
            }
        }
    };
    module.exports = ReactMultiChild
}),
__d("ReactChildReconciler", ["ReactReconciler", "flattenChildren", "instantiateReactComponent", "shouldUpdateReactComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactReconciler = require("ReactReconciler")
      , flattenChildren = require("flattenChildren")
      , instantiateReactComponent = require("instantiateReactComponent")
      , shouldUpdateReactComponent = require("shouldUpdateReactComponent")
      , ReactChildReconciler = {
        instantiateChildren: function(nestedChildNodes, transaction, context) {
            var children = flattenChildren(nestedChildNodes);
            for (var name in children)
                if (children.hasOwnProperty(name)) {
                    var child = children[name]
                      , childInstance = instantiateReactComponent(child, null );
                    children[name] = childInstance
                }
            return children
        },
        updateChildren: function(prevChildren, nextNestedChildNodes, transaction, context) {
            var nextChildren = flattenChildren(nextNestedChildNodes);
            if (!nextChildren && !prevChildren)
                return null ;
            var name;
            for (name in nextChildren)
                if (nextChildren.hasOwnProperty(name)) {
                    var prevChild = prevChildren && prevChildren[name]
                      , prevElement = prevChild && prevChild._currentElement
                      , nextElement = nextChildren[name];
                    if (shouldUpdateReactComponent(prevElement, nextElement))
                        ReactReconciler.receiveComponent(prevChild, nextElement, transaction, context),
                        nextChildren[name] = prevChild;
                    else {
                        prevChild && ReactReconciler.unmountComponent(prevChild, name);
                        var nextChildInstance = instantiateReactComponent(nextElement, null );
                        nextChildren[name] = nextChildInstance
                    }
                }
            for (name in prevChildren)
                !prevChildren.hasOwnProperty(name) || nextChildren && nextChildren.hasOwnProperty(name) || ReactReconciler.unmountComponent(prevChildren[name]);
            return nextChildren
        },
        unmountChildren: function(renderedChildren) {
            for (var name in renderedChildren) {
                var renderedChild = renderedChildren[name];
                ReactReconciler.unmountComponent(renderedChild)
            }
        }
    };
    module.exports = ReactChildReconciler
}),
__d("flattenChildren", ["traverseAllChildren", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function flattenSingleChildIntoContext(traverseContext, child, name) {
        var result = traverseContext
          , keyUnique = !result.hasOwnProperty(name);
        __DEV__ && warning(keyUnique, "flattenChildren(...): Encountered two children with the same key, `%s`. Child keys must be unique; when two children share a key, only the first child will be used.", name),
        keyUnique && null  != child && (result[name] = child)
    }
    function flattenChildren(children) {
        if (null  == children)
            return children;
        var result = {};
        return traverseAllChildren(children, flattenSingleChildIntoContext, result),
        result
    }
    var traverseAllChildren = require("traverseAllChildren")
      , warning = require("warning");
    module.exports = flattenChildren
}),
__d("styleDiffer", ["deepDiffer"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function styleDiffer(a, b) {
        return !styleEqual(a, b)
    }
    function styleEqual(a, b) {
        if (!a)
            return !b;
        if (!b)
            return !a;
        if (typeof a != typeof b)
            return !1;
        if ("number" == typeof a)
            return a === b;
        if (Array.isArray(a)) {
            if (!Array.isArray(b) || a.length !== b.length)
                return !1;
            for (var i = 0; i < a.length; ++i)
                if (!styleEqual(a[i], b[i]))
                    return !1;
            return !0
        }
        for (var key in a)
            if (deepDiffer(a[key], b[key]))
                return !1;
        for (var key in b)
            if (!a.hasOwnProperty(key))
                return !1;
        return !0
    }
    var deepDiffer = require("deepDiffer");
    module.exports = styleDiffer
}),
__d("deepDiffer", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var deepDiffer = function(one, two) {
        if (one === two)
            return !1;
        if ("function" == typeof one && "function" == typeof two)
            return !1;
        if ("object" != typeof one || null  === one)
            return one !== two;
        if ("object" != typeof two || null  === two)
            return !0;
        if (one.constructor !== two.constructor)
            return !0;
        if (Array.isArray(one)) {
            var len = one.length;
            if (two.length !== len)
                return !0;
            for (var ii = 0; len > ii; ii++)
                if (deepDiffer(one[ii], two[ii]))
                    return !0
        } else {
            for (var key in one)
                if (deepDiffer(one[key], two[key]))
                    return !0;
            for (var twoKey in two)
                if (void 0 === one[twoKey] && void 0 !== two[twoKey])
                    return !0
        }
        return !1
    }
    ;
    module.exports = deepDiffer
}),
__d("diffRawProperties", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function diffRawProperties(updatePayload, prevProps, nextProps, validAttributes) {
        var validAttributeConfig, nextProp, prevProp, isScalar, shouldUpdate;
        if (nextProps)
            for (var propKey in nextProps)
                validAttributeConfig = validAttributes[propKey],
                validAttributeConfig && (prevProp = prevProps && prevProps[propKey],
                nextProp = nextProps[propKey],
                "function" == typeof prevProp && (prevProp = !0),
                "function" == typeof nextProp && (nextProp = !0),
                prevProp !== nextProp && (isScalar = "object" != typeof nextProp || null  === nextProp,
                shouldUpdate = isScalar || !prevProp || validAttributeConfig.diff && validAttributeConfig.diff(prevProp, nextProp),
                shouldUpdate && (updatePayload = updatePayload || {},
                updatePayload[propKey] = nextProp)));
        if (prevProps)
            for (var propKey in prevProps)
                validAttributeConfig = validAttributes[propKey],
                validAttributeConfig && (updatePayload && void 0 !== updatePayload[propKey] || (prevProp = prevProps[propKey],
                nextProp = nextProps && nextProps[propKey],
                "function" == typeof prevProp && (prevProp = !0),
                "function" == typeof nextProp && (nextProp = !0),
                prevProp !== nextProp && (void 0 === nextProp && (nextProp = null ),
                isScalar = "object" != typeof nextProp || null  === nextProp,
                shouldUpdate = isScalar && prevProp !== nextProp || validAttributeConfig.diff && validAttributeConfig.diff(prevProp, nextProp),
                shouldUpdate && (updatePayload = updatePayload || {},
                updatePayload[propKey] = nextProp))));
        return updatePayload
    }
    module.exports = diffRawProperties
}),
__d("RCTEventEmitter", ["ReactNativeEventEmitter"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactNativeEventEmitter = require("ReactNativeEventEmitter");
    module.exports = ReactNativeEventEmitter
}),
__d("RCTJSTimers", ["JSTimersExecution"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var JSTimersExecution = require("JSTimersExecution")
      , RCTJSTimers = JSTimersExecution;
    module.exports = RCTJSTimers
}),
__d("deprecated", ["Object.assign", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function deprecated(namespace, oldName, newName, ctx, fn) {
        var warned = !1;
        if (__DEV__) {
            var newFn = function() {
                return warning(warned, "%s.%s will be deprecated in a future version. Use %s.%s instead.", namespace, oldName, namespace, newName),
                warned = !0,
                fn.apply(ctx, arguments)
            }
            ;
            return newFn.displayName = namespace + "_" + oldName,
            assign(newFn, fn)
        }
        return fn
    }
    var assign = require("Object.assign")
      , warning = require("warning");
    module.exports = deprecated
}),
__d("onlyChild", ["ReactElement", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function onlyChild(children) {
        return invariant(ReactElement.isValidElement(children), "onlyChild must be passed a children with exactly one child."),
        children
    }
    var ReactElement = require("ReactElement")
      , invariant = require("invariant");
    module.exports = onlyChild
}),
__d("ActivityIndicatorIOS", ["NativeMethodsMixin", "NativeModules", "ReactPropTypes", "React", "StyleSheet", "View", "requireNativeComponent", "verifyPropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , PropTypes = (require("NativeModules"),
    require("ReactPropTypes"))
      , React = require("React")
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , requireNativeComponent = require("requireNativeComponent")
      , verifyPropTypes = require("verifyPropTypes")
      , GRAY = "#999999"
      , ActivityIndicatorIOS = React.createClass({
        displayName: "ActivityIndicatorIOS",
        mixins: [NativeMethodsMixin],
        propTypes: {
            animating: PropTypes.bool,
            color: PropTypes.string,
            hidesWhenStopped: PropTypes.bool,
            size: PropTypes.oneOf(["small", "large"])
        },
        getDefaultProps: function() {
            return {
                animating: !0,
                color: GRAY,
                hidesWhenStopped: !0,
                size: "small"
            }
        },
        render: function() {
            var $__0 = this.props
              , style = $__0.style
              , props = function(source, exclusion) {
                var rest = {}
                  , hasOwn = Object.prototype.hasOwnProperty;
                if (null  == source)
                    throw new TypeError;
                for (var key in source)
                    hasOwn.call(source, key) && !hasOwn.call(exclusion, key) && (rest[key] = source[key]);
                return rest
            }($__0, {
                style: 1
            })
              , sizeStyle = "large" === this.props.size ? styles.sizeLarge : styles.sizeSmall;
            return React.createElement(View, {
                style: [styles.container, sizeStyle, style]
            }, React.createElement(RCTActivityIndicatorView, React.__spread({}, props)))
        }
    })
      , styles = StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center"
        },
        sizeSmall: {
            height: 20
        },
        sizeLarge: {
            height: 36
        }
    })
      , RCTActivityIndicatorView = requireNativeComponent("RCTActivityIndicatorView", null );
    if (__DEV__) {
        var nativeOnlyProps = {
            activityIndicatorViewStyle: !0
        };
        verifyPropTypes(ActivityIndicatorIOS, RCTActivityIndicatorView.viewConfig, nativeOnlyProps)
    }
    module.exports = ActivityIndicatorIOS
}),
__d("StyleSheet", ["StyleSheetRegistry", "StyleSheetValidation"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function StyleSheet() {}
    var StyleSheetRegistry = require("StyleSheetRegistry")
      , StyleSheetValidation = require("StyleSheetValidation");
    StyleSheet.create = function(obj) {
        var result = {};
        for (var key in obj)
            StyleSheetValidation.validateStyle(key, obj),
            result[key] = StyleSheetRegistry.registerStyle(obj[key]);
        return result
    }
    ,
    module.exports = StyleSheet
}),
__d("StyleSheetValidation", ["ImageStylePropTypes", "ReactPropTypeLocations", "TextStylePropTypes", "ViewStylePropTypes", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function StyleSheetValidation() {}
    var ImageStylePropTypes = require("ImageStylePropTypes")
      , ReactPropTypeLocations = require("ReactPropTypeLocations")
      , TextStylePropTypes = require("TextStylePropTypes")
      , ViewStylePropTypes = require("ViewStylePropTypes")
      , invariant = require("invariant");
    StyleSheetValidation.validateStyleProp = function(prop, style, caller) {
        if (__DEV__) {
            if (void 0 === allStylePropTypes[prop]) {
                var message1 = '"' + prop + '" is not a valid style property.'
                  , message2 = "\nValid style props: " + JSON.stringify(Object.keys(allStylePropTypes), null , "  ");
                styleError(message1, style, caller, message2)
            }
            var error = allStylePropTypes[prop](style, prop, caller, ReactPropTypeLocations.prop);
            error && styleError(error.message, style, caller)
        }
    }
    ,
    StyleSheetValidation.validateStyle = function(name, styles) {
        if (__DEV__)
            for (var prop in styles[name])
                StyleSheetValidation.validateStyleProp(prop, styles[name], "StyleSheet " + name)
    }
    ,
    StyleSheetValidation.addValidStylePropTypes = function(stylePropTypes) {
        for (var key in stylePropTypes)
            invariant(void 0 === allStylePropTypes[key] || allStylePropTypes[key] === stylePropTypes[key], 'Attemped to redefine existing style prop type "' + key + '".'),
            allStylePropTypes[key] = stylePropTypes[key]
    }
    ;
    var styleError = function(message1, style, caller, message2) {
        invariant(!1, message1 + "\n" + (caller || "<<unknown>>") + ": " + JSON.stringify(style, null , "  ") + (message2 || ""))
    }
      , allStylePropTypes = {};
    StyleSheetValidation.addValidStylePropTypes(ImageStylePropTypes),
    StyleSheetValidation.addValidStylePropTypes(TextStylePropTypes),
    StyleSheetValidation.addValidStylePropTypes(ViewStylePropTypes),
    module.exports = StyleSheetValidation
}),
__d("View", ["NativeMethodsMixin", "ReactPropTypes", "NativeModules", "React", "ReactNativeStyleAttributes", "ReactNativeViewAttributes", "StyleSheetPropType", "ViewStylePropTypes", "createReactNativeComponentClass"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , PropTypes = require("ReactPropTypes")
      , RCTUIManager = require("NativeModules").UIManager
      , React = require("React")
      , ReactNativeStyleAttributes = require("ReactNativeStyleAttributes")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , StyleSheetPropType = require("StyleSheetPropType")
      , ViewStylePropTypes = require("ViewStylePropTypes")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , stylePropType = StyleSheetPropType(ViewStylePropTypes)
      , View = React.createClass({
        displayName: "View",
        mixins: [NativeMethodsMixin],
        viewConfig: {
            uiViewClassName: "RCTView",
            validAttributes: ReactNativeViewAttributes.RCTView
        },
        propTypes: {
            accessible: PropTypes.bool,
            accessibilityLabel: PropTypes.string,
            testID: PropTypes.string,
            onMoveShouldSetResponder: PropTypes.func,
            onResponderGrant: PropTypes.func,
            onResponderMove: PropTypes.func,
            onResponderReject: PropTypes.func,
            onResponderRelease: PropTypes.func,
            onResponderTerminate: PropTypes.func,
            onResponderTerminationRequest: PropTypes.func,
            onStartShouldSetResponder: PropTypes.func,
            onStartShouldSetResponderCapture: PropTypes.func,
            onLayout: PropTypes.func,
            pointerEvents: PropTypes.oneOf(["box-none", "none", "box-only", "auto"]),
            style: stylePropType,
            removeClippedSubviews: PropTypes.bool,
            renderToHardwareTextureAndroid: PropTypes.bool
        },
        render: function() {
            return React.createElement(RCTView, React.__spread({}, this.props))
        }
    })
      , RCTView = createReactNativeComponentClass({
        validAttributes: ReactNativeViewAttributes.RCTView,
        uiViewClassName: "RCTView"
    });
    if (RCTView.propTypes = View.propTypes,
    __DEV__) {
        var viewConfig = RCTUIManager.viewConfigs && RCTUIManager.viewConfigs.RCTView || {};
        for (var prop in viewConfig.nativeProps) {
            var viewAny = View;
            if (!viewAny.propTypes[prop] && !ReactNativeStyleAttributes[prop])
                throw new Error("View is missing propType for native prop `" + prop + "`")
        }
    }
    var ViewToExport = RCTView;
    __DEV__ && (ViewToExport = View),
    module.exports = ViewToExport
}),
__d("ReactNativeViewAttributes", ["merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var merge = require("merge")
      , ReactNativeViewAttributes = {};
    ReactNativeViewAttributes.UIView = {
        pointerEvents: !0,
        accessible: !0,
        accessibilityLabel: !0,
        testID: !0,
        onLayout: !0,
        visible: !0,
        title: !0
    },
    ReactNativeViewAttributes.RCTView = merge(ReactNativeViewAttributes.UIView, {
        removeClippedSubviews: !0
    }),
    module.exports = ReactNativeViewAttributes
}),
__d("StyleSheetPropType", ["createStrictShapeTypeChecker", "flattenStyle"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function StyleSheetPropType(shape) {
        var shapePropType = createStrictShapeTypeChecker(shape);
        return function(props, propName, componentName, location) {
            var newProps = props;
            return props[propName] && (newProps = {},
            newProps[propName] = flattenStyle(props[propName])),
            shapePropType(newProps, propName, componentName, location)
        }
    }
    var createStrictShapeTypeChecker = require("createStrictShapeTypeChecker")
      , flattenStyle = require("flattenStyle");
    module.exports = StyleSheetPropType
}),
__d("createStrictShapeTypeChecker", ["ReactPropTypeLocationNames", "invariant", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function createStrictShapeTypeChecker(shapeTypes) {
        function checkType(isRequired, props, propName, componentName, location) {
            if (!props[propName])
                return void (isRequired && invariant(!1, "Required object `" + propName + "` was not specified in " + ("`" + componentName + "`.")));
            var propValue = props[propName]
              , propType = typeof propValue
              , locationName = location && ReactPropTypeLocationNames[location] || "(unknown)";
            "object" !== propType && invariant(!1, "Invalid " + locationName + " `" + propName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
            var allKeys = merge(props[propName], shapeTypes);
            for (var key in allKeys) {
                var checker = shapeTypes[key];
                checker || invariant(!1, "Invalid props." + propName + " key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null , "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null , "  "));
                var error = checker(propValue, key, componentName, location);
                error && invariant(!1, error.message + "\nBad object: " + JSON.stringify(props[propName], null , "  "))
            }
        }
        function chainedCheckType(props, propName, componentName, location) {
            return checkType(!1, props, propName, componentName, location)
        }
        return chainedCheckType.isRequired = checkType.bind(null , !0),
        chainedCheckType
    }
    var ReactPropTypeLocationNames = require("ReactPropTypeLocationNames")
      , invariant = require("invariant")
      , merge = require("merge");
    module.exports = createStrictShapeTypeChecker
}),
__d("requireNativeComponent", ["NativeModules", "UnimplementedView", "createReactNativeComponentClass", "deepDiffer", "insetsDiffer", "pointsDiffer", "matricesDiffer", "sizesDiffer", "verifyPropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function requireNativeComponent(viewName, wrapperComponent) {
        var viewConfig = RCTUIManager[viewName];
        if (!viewConfig || !viewConfig.nativeProps)
            return UnimplementedView;
        var nativeProps = Object.assign({}, RCTUIManager.RCTView.nativeProps, viewConfig.nativeProps);
        viewConfig.uiViewClassName = viewName,
        viewConfig.validAttributes = {};
        for (var key in nativeProps) {
            var differ = TypeToDifferMap[nativeProps[key]] || deepDiffer;
            viewConfig.validAttributes[key] = {
                diff: differ
            }
        }
        return __DEV__ && wrapperComponent && verifyPropTypes(wrapperComponent, viewConfig),
        createReactNativeComponentClass(viewConfig)
    }
    var RCTUIManager = require("NativeModules").UIManager
      , UnimplementedView = require("UnimplementedView")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , deepDiffer = require("deepDiffer")
      , insetsDiffer = require("insetsDiffer")
      , pointsDiffer = require("pointsDiffer")
      , matricesDiffer = require("matricesDiffer")
      , sizesDiffer = require("sizesDiffer")
      , verifyPropTypes = require("verifyPropTypes")
      , TypeToDifferMap = {
        CATransform3D: matricesDiffer,
        CGPoint: pointsDiffer,
        CGSize: sizesDiffer,
        UIEdgeInsets: insetsDiffer
    };
    module.exports = requireNativeComponent
}),
__d("UnimplementedView", ["React", "StyleSheet", "View"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var React = require("React")
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , UnimplementedView = React.createClass({
        displayName: "UnimplementedView",
        setNativeProps: function() {},
        render: function() {
            return React.createElement(View, {
                style: [styles.unimplementedView, this.props.style]
            }, this.props.children)
        }
    })
      , styles = StyleSheet.create({
        unimplementedView: {
            borderWidth: 1,
            borderColor: "red",
            alignSelf: "flex-start"
        }
    });
    module.exports = UnimplementedView
}),
__d("insetsDiffer", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var dummyInsets = {
        top: void 0,
        left: void 0,
        right: void 0,
        bottom: void 0
    }
      , insetsDiffer = function(one, two) {
        return one = one || dummyInsets,
        two = two || dummyInsets,
        one !== two && (one.top !== two.top || one.left !== two.left || one.right !== two.right || one.bottom !== two.bottom)
    }
    ;
    module.exports = insetsDiffer
}),
__d("pointsDiffer", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var dummyPoint = {
        x: void 0,
        y: void 0
    }
      , pointsDiffer = function(one, two) {
        return one = one || dummyPoint,
        two = two || dummyPoint,
        one !== two && (one.x !== two.x || one.y !== two.y)
    }
    ;
    module.exports = pointsDiffer
}),
__d("verifyPropTypes", ["ReactNativeStyleAttributes", "View"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function verifyPropTypes(component, viewConfig, nativePropsToIgnore) {
        if (viewConfig) {
            var nativeProps = viewConfig.nativeProps;
            for (var prop in nativeProps)
                if (!(component.propTypes[prop] || View.propTypes[prop] || ReactNativeStyleAttributes[prop] || nativePropsToIgnore && nativePropsToIgnore[prop]))
                    throw new Error("`" + component.displayName + "` has no propType for native prop `" + viewConfig.uiViewClassName + "." + prop + "` of native type `" + nativeProps[prop].type + "`")
        }
    }
    var ReactNativeStyleAttributes = require("ReactNativeStyleAttributes")
      , View = require("View");
    module.exports = verifyPropTypes
}),
__d("DatePickerIOS", ["NativeMethodsMixin", "ReactPropTypes", "React", "NativeModules", "StyleSheet", "View", "requireNativeComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , PropTypes = require("ReactPropTypes")
      , React = require("React")
      , RCTDatePickerIOSConsts = require("NativeModules").UIManager.RCTDatePicker.Constants
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , requireNativeComponent = require("requireNativeComponent")
      , DATEPICKER = "datepicker"
      , DatePickerIOS = React.createClass({
        displayName: "DatePickerIOS",
        mixins: [NativeMethodsMixin],
        propTypes: {
            date: PropTypes.instanceOf(Date).isRequired,
            onDateChange: PropTypes.func.isRequired,
            maximumDate: PropTypes.instanceOf(Date),
            minimumDate: PropTypes.instanceOf(Date),
            mode: PropTypes.oneOf(["date", "time", "datetime"]),
            minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),
            timeZoneOffsetInMinutes: PropTypes.number
        },
        getDefaultProps: function() {
            return {
                mode: "datetime"
            }
        },
        _onChange: function(event) {
            var nativeTimeStamp = event.nativeEvent.timestamp;
            this.props.onDateChange && this.props.onDateChange(new Date(nativeTimeStamp)),
            this.props.onChange && this.props.onChange(event);
            var propsTimeStamp = this.props.date.getTime();
            nativeTimeStamp !== propsTimeStamp && this.refs[DATEPICKER].setNativeProps({
                date: propsTimeStamp
            })
        },
        render: function() {
            var props = this.props;
            return React.createElement(View, {
                style: props.style
            }, React.createElement(RCTDatePickerIOS, {
                ref: DATEPICKER,
                style: styles.rkDatePickerIOS,
                date: props.date.getTime(),
                maximumDate: props.maximumDate ? props.maximumDate.getTime() : void 0,
                minimumDate: props.minimumDate ? props.minimumDate.getTime() : void 0,
                mode: RCTDatePickerIOSConsts.DatePickerModes[props.mode],
                minuteInterval: props.minuteInterval,
                timeZoneOffsetInMinutes: props.timeZoneOffsetInMinutes,
                onChange: this._onChange
            }))
        }
    })
      , styles = StyleSheet.create({
        rkDatePickerIOS: {
            height: RCTDatePickerIOSConsts.ComponentHeight,
            width: RCTDatePickerIOSConsts.ComponentWidth
        }
    })
      , RCTDatePickerIOS = requireNativeComponent("RCTDatePicker", DatePickerIOS);
    module.exports = DatePickerIOS
}),
__d("Image", ["EdgeInsetsPropType", "ImageResizeMode", "ImageStylePropTypes", "NativeMethodsMixin", "NativeModules", "ReactPropTypes", "React", "ReactNativeViewAttributes", "StyleSheet", "StyleSheetPropType", "flattenStyle", "invariant", "merge", "requireNativeComponent", "resolveAssetSource", "verifyPropTypes", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var EdgeInsetsPropType = require("EdgeInsetsPropType")
      , ImageResizeMode = require("ImageResizeMode")
      , ImageStylePropTypes = require("ImageStylePropTypes")
      , NativeMethodsMixin = require("NativeMethodsMixin")
      , NativeModules = require("NativeModules")
      , PropTypes = require("ReactPropTypes")
      , React = require("React")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , StyleSheet = require("StyleSheet")
      , StyleSheetPropType = require("StyleSheetPropType")
      , flattenStyle = require("flattenStyle")
      , invariant = require("invariant")
      , merge = require("merge")
      , requireNativeComponent = require("requireNativeComponent")
      , resolveAssetSource = require("resolveAssetSource")
      , verifyPropTypes = require("verifyPropTypes")
      , warning = require("warning")
      , Image = React.createClass({
        displayName: "Image",
        propTypes: {
            source: PropTypes.shape({
                uri: PropTypes.string
            }),
            defaultSource: PropTypes.shape({
                uri: PropTypes.string
            }),
            title: PropTypes.string,
            accessible: PropTypes.bool,
            accessibilityLabel: PropTypes.string,
            capInsets: EdgeInsetsPropType,
            resizeMode: PropTypes.oneOf(["cover", "contain", "stretch"]),
            style: StyleSheetPropType(ImageStylePropTypes),
            testID: PropTypes.string
        },
        statics: {
            resizeMode: ImageResizeMode
        },
        mixins: [NativeMethodsMixin],
        viewConfig: {
            uiViewClassName: "UIView",
            validAttributes: ReactNativeViewAttributes.UIView
        },
        render: function() {
            for (var prop in nativeOnlyProps)
                void 0 !== this.props[prop] && console.warn("Prop `" + prop + " = " + this.props[prop] + "` should not be set directly on Image.");
            var source = resolveAssetSource(this.props.source) || {}
              , $__0 = source
              , width = $__0.width
              , height = $__0.height
              , style = flattenStyle([{
                width: width,
                height: height
            }, styles.base, this.props.style]);
            invariant(style, "style must be initialized");
            var isNetwork = source.uri && source.uri.match(/^https?:/);
            invariant(!(isNetwork && source.isStatic), 'static image uris cannot start with "http": "' + source.uri + '"');
            var RawImage = isNetwork ? RCTNetworkImage : RCTStaticImage;
            var src = this.props.src || this.props.source.uri || '.';
            if (src.split('.').pop().split('?')[0] == 'gif') {
                RawImage = RCTGif;
            }            
            this.props.style && this.props.style.tintColor && warning(RawImage === RCTStaticImage, "tintColor style only supported on static images.");
            var contentMode, resizeMode = this.props.resizeMode || style.resizeMode, contentModes = NativeModules.UIManager.UIView.ContentMode;
            contentMode = resizeMode === ImageResizeMode.stretch ? contentModes.ScaleToFill : resizeMode === ImageResizeMode.contain ? contentModes.ScaleAspectFit : contentModes.ScaleAspectFill;
            var nativeProps = merge(this.props, {
                style: style,
                contentMode: contentMode,
                tintColor: style.tintColor
            });
            return nativeProps.src = source.uri,
            this.props.defaultSource && (nativeProps.defaultImageSrc = this.props.defaultSource.uri),
            React.createElement(RawImage, React.__spread({}, nativeProps))
        }
    })
      , styles = StyleSheet.create({
        base: {
            overflow: "hidden"
        }
    })
      , RCTNetworkImage = requireNativeComponent("RCTNetworkImageView", null )
      , RCTStaticImage = requireNativeComponent("RCTStaticImage", null )
      , RCTGif = requireNativeComponent("RCTGif", null)
      , nativeOnlyProps = {
        src: !0,
        defaultImageSrc: !0,
        imageTag: !0,
        contentMode: !0
    };
    __DEV__ && (verifyPropTypes(Image, RCTStaticImage.viewConfig, nativeOnlyProps),
    verifyPropTypes(Image, RCTNetworkImage.viewConfig, nativeOnlyProps),
    verifyPropTypes(Image, RCTGif.viewConfig, nativeOnlyProps)),
    module.exports = Image
}),

__d('CustomViewStylePropTypes',["ReactPropTypes","ViewStylePropTypes"],function(global, require, requireDynamic, requireLazy, module, exports) {  /**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TextStylePropTypes
 * @flow
 */
'use strict';

var ReactPropTypes = require('ReactPropTypes');
var ViewStylePropTypes = require('ViewStylePropTypes');

// TODO: use spread instead of Object.assign/create after #6560135 is fixed
var CustomViewStylePropTypes = Object.assign(Object.create(ViewStylePropTypes), {
  fontFamily: ReactPropTypes.string,
  fontSize: ReactPropTypes.number,
  fontWeight: ReactPropTypes.oneOf(
    ['normal' /*default*/, 'bold',
     '100', '200', '300', '400', '500', '600', '700', '800', '900']
  ),
  fontStyle: ReactPropTypes.oneOf(['normal', 'italic']),
  lineHeight: ReactPropTypes.number,
  color: ReactPropTypes.string,
  containerBackgroundColor: ReactPropTypes.string,
  textAlign: ReactPropTypes.oneOf(
    ['auto' /*default*/, 'left', 'right', 'center']
  ),
  type: ReactPropTypes.string,
  attr: ReactPropTypes.object,
});

module.exports = CustomViewStylePropTypes;
}),


__d('CustomView',["NativeMethodsMixin","React","ReactNativeViewAttributes","StyleSheetPropType","CustomViewStylePropTypes","Touchable","createReactNativeComponentClass","merge"],function(global, require, requireDynamic, requireLazy, module, exports) {  /**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Input
 * @flow
 */
'use strict';

var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var StyleSheetPropType = require('StyleSheetPropType');
var CustomViewStylePropTypes = require('CustomViewStylePropTypes');
var Touchable = require('Touchable');

var createReactNativeComponentClass =
  require('createReactNativeComponentClass');
var merge = require('merge');

var stylePropType = StyleSheetPropType(CustomViewStylePropTypes);

var viewConfig = {
  validAttributes: merge(ReactNativeViewAttributes.UIView, {
    isHighlighted: true,
    type: true,
    attr: true,
    endellipsis: true,
    visible: true,
    bind: true
  }),
  uiViewClassName: 'RCTCustomView',
};

var CustomView = React.createClass({displayName: "RCTCustomView",

  mixins: [Touchable.Mixin, NativeMethodsMixin],

  propTypes: {
    /**
     * Used to truncate the text with an elipsis after computing the text
     * layout, including line wrapping, such that the total number of lines does
     * not exceed this number.
     */
    numberOfLines: React.PropTypes.number,
    /**
     * This function is called on press.  Text intrinsically supports press
     * handling with a default highlight state (which can be disabled with
     * `suppressHighlighting`).
     */
    onPress: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onKeyUp: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    type: React.PropTypes.string,
    attr: React.PropTypes.object,


    /**
     * When true, no visual change is made when text is pressed down.  By
     * default, a gray oval highlights the text on press down.
     */
    suppressHighlighting: React.PropTypes.bool,
    style: stylePropType,
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID: React.PropTypes.string,
  },

  viewConfig: viewConfig,

  getInitialState: function() {
    return merge(this.touchableGetInitialState(), {
      attr:null,
    });
  },

  onStartShouldSetResponder: function()       {
    var shouldSetFromProps = this.props.onStartShouldSetResponder &&
      this.props.onStartShouldSetResponder();
    return shouldSetFromProps || !!this.props.onPress;
  },

  /*
   * Returns true to allow responder termination
   */
  handleResponderTerminationRequest: function()       {
    // Allow touchable or props.onResponderTerminationRequest to deny
    // the request
    var allowTermination = this.touchableHandleResponderTerminationRequest();
    if (allowTermination && this.props.onResponderTerminationRequest) {
      allowTermination = this.props.onResponderTerminationRequest();
    }
    return allowTermination;
  },

  handleResponderGrant: function(e                , dispatchID        ) {
    this.touchableHandleResponderGrant(e, dispatchID);
    this.props.onResponderGrant &&
      this.props.onResponderGrant.apply(this, arguments);
  },

  render: function() {

    var props = this.props;
    props.attr = JSON.stringify(props.attr);
    return React.createElement(RCTCustomView, React.__spread({},  props));
  },
});

var RCTCustomView = createReactNativeComponentClass(viewConfig);

module.exports = CustomView;
}),

__d("EdgeInsetsPropType", ["ReactPropTypes", "createStrictShapeTypeChecker", "insetsDiffer"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var PropTypes = require("ReactPropTypes")
      , createStrictShapeTypeChecker = require("createStrictShapeTypeChecker")
      , EdgeInsetsPropType = (require("insetsDiffer"),
    createStrictShapeTypeChecker({
        top: PropTypes.number,
        left: PropTypes.number,
        bottom: PropTypes.number,
        right: PropTypes.number
    }));
    module.exports = EdgeInsetsPropType
}),
__d("resolveAssetSource", ["AssetRegistry", "PixelRatio", "Platform", "NativeModules"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getPathInArchive(asset) {
        if ("android" === Platform.OS) {
            var assetDir = getBasePath(asset);
            return (assetDir + "/" + asset.name).toLowerCase().replace(/\//g, "_").replace(/([^a-z0-9_])/g, "")
        }
        return getScaledAssetPath(asset)
    }
    function getBasePath(asset) {
        var path = asset.httpServerLocation;
        return "/" === path[0] && (path = path.substr(1)),
        path
    }
    function getScaledAssetPath(asset) {
        var scale = pickScale(asset.scales, PixelRatio.get())
          , scaleSuffix = 1 === scale ? "" : "@" + scale + "x"
          , assetDir = getBasePath(asset);
        return assetDir + "/" + asset.name + scaleSuffix + "." + asset.type
    }
    function pickScale(scales, deviceScale) {
        for (var i = 0; i < scales.length; i++)
            if (scales[i] >= deviceScale)
                return scales[i];
        return scales[scales.length - 1] || 1
    }
    function resolveAssetSource(source) {
        if ("object" == typeof source)
            return source;
        var asset = AssetRegistry.getAssetByID(source);
        return asset ? assetToImageSource(asset) : null 
    }
    function assetToImageSource(asset) {
        return {
            width: asset.width,
            height: asset.height,
            uri: getPathInArchive(asset),
            isStatic: !0
        }
    }
    var AssetRegistry = require("AssetRegistry")
      , PixelRatio = require("PixelRatio")
      , Platform = require("Platform");
    require("NativeModules").SourceCode;
    module.exports = resolveAssetSource,
    module.exports.pickScale = pickScale
}),
__d("AssetRegistry", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function registerAsset(asset) {
        return assets.push(asset)
    }
    function getAssetByID(assetId) {
        return assets[assetId - 1]
    }
    var assets = [];
    module.exports = {
        registerAsset: registerAsset,
        getAssetByID: getAssetByID
    }
}),
__d("PixelRatio", ["Dimensions"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function PixelRatio() {}
    var Dimensions = require("Dimensions");
    PixelRatio.get = function() {
        return Dimensions.get("window").scale
    }
    ,
    PixelRatio.getPixelSizeForLayoutSize = function(layoutSize) {
        return Math.round(layoutSize * PixelRatio.get())
    }
    ,
    PixelRatio.startDetecting = function() {}
    ,
    module.exports = PixelRatio
}),
__d("Dimensions", ["NativeModules", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function Dimensions() {}
    var NativeModules = require("NativeModules")
      , invariant = require("invariant")
      , dimensions = NativeModules.UIManager.Dimensions;
    if (dimensions && dimensions.windowPhysicalPixels) {
        dimensions = JSON.parse(JSON.stringify(dimensions));
        var windowPhysicalPixels = dimensions.windowPhysicalPixels;
        dimensions.window = {
            width: windowPhysicalPixels.width / windowPhysicalPixels.scale,
            height: windowPhysicalPixels.height / windowPhysicalPixels.scale,
            scale: windowPhysicalPixels.scale
        },
        delete dimensions.windowPhysicalPixels
    }
    Dimensions.set = function(dims) {
        return Object.assign(dimensions, dims),
        !0
    }
    ,
    Dimensions.get = function(dim) {
        return invariant(dimensions[dim], "No dimension set for key " + dim),
        dimensions[dim]
    }
    ,
    module.exports = Dimensions
}),
__d("ListView", ["ListViewDataSource", "React", "NativeModules", "ScrollView", "ScrollResponder", "StaticRenderer", "react-timer-mixin/TimerMixin", "logError", "merge", "isEmpty"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ListViewDataSource = require("ListViewDataSource")
      , React = require("React")
      , RCTUIManager = require("NativeModules").UIManager
      , ScrollView = require("ScrollView")
      , ScrollResponder = require("ScrollResponder")
      , StaticRenderer = require("StaticRenderer")
      , TimerMixin = require("react-timer-mixin/TimerMixin")
      , logError = require("logError")
      , merge = require("merge")
      , isEmpty = require("isEmpty")
      , PropTypes = React.PropTypes
      , DEFAULT_PAGE_SIZE = 1
      , DEFAULT_INITIAL_ROWS = 10
      , DEFAULT_SCROLL_RENDER_AHEAD = 1e3
      , DEFAULT_END_REACHED_THRESHOLD = 1e3
      , DEFAULT_SCROLL_CALLBACK_THROTTLE = 50
      , RENDER_INTERVAL = 20
      , SCROLLVIEW_REF = "listviewscroll"
      , ListView = React.createClass({
        displayName: "ListView",
        mixins: [ScrollResponder.Mixin, TimerMixin],
        statics: {
            DataSource: ListViewDataSource
        },
        propTypes: Object.assign({}, ScrollView.propTypes, {
            dataSource: PropTypes.instanceOf(ListViewDataSource).isRequired,
            renderRow: PropTypes.func.isRequired,
            initialListSize: PropTypes.number,
            onEndReached: PropTypes.func,
            onEndReachedThreshold: PropTypes.number,
            pageSize: PropTypes.number,
            renderFooter: PropTypes.func,
            renderHeader: PropTypes.func,
            renderSectionHeader: PropTypes.func,
            scrollRenderAheadDistance: React.PropTypes.number,
            onChangeVisibleRows: React.PropTypes.func,
            removeClippedSubviews: React.PropTypes.bool
        }),
        getMetrics: function() {
            return {
                contentHeight: this.scrollProperties.contentHeight,
                totalRows: this.props.dataSource.getRowCount(),
                renderedRows: this.state.curRenderedRowsCount,
                visibleRows: Object.keys(this._visibleRows).length
            }
        },
        getScrollResponder: function() {
            return this.refs[SCROLLVIEW_REF]
        },
        setNativeProps: function(props) {
            this.refs[SCROLLVIEW_REF].setNativeProps(props)
        },
        getDefaultProps: function() {
            return {
                initialListSize: DEFAULT_INITIAL_ROWS,
                pageSize: DEFAULT_PAGE_SIZE,
                scrollRenderAheadDistance: DEFAULT_SCROLL_RENDER_AHEAD,
                onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD
            }
        },
        getInitialState: function() {
            return {
                curRenderedRowsCount: this.props.initialListSize,
                prevRenderedRowsCount: 0
            }
        },
        componentWillMount: function() {
            this.scrollProperties = {
                visibleHeight: null ,
                contentHeight: null ,
                offsetY: 0
            },
            this._childFrames = [],
            this._visibleRows = {}
        },
        componentDidMount: function() {
            this.requestAnimationFrame(function() {
                this._measureAndUpdateScrollProps(),
                this.setInterval(this._renderMoreRowsIfNeeded, RENDER_INTERVAL)
            }
            .bind(this))
        },
        componentWillReceiveProps: function(nextProps) {
            this.props.dataSource !== nextProps.dataSource && this.setState({
                prevRenderedRowsCount: 0
            })
        },
        render: function() {
            for (var bodyComponents = [], dataSource = this.props.dataSource, allRowIDs = dataSource.rowIdentities, rowCount = 0, sectionHeaderIndices = [], header = this.props.renderHeader && this.props.renderHeader(), footer = this.props.renderFooter && this.props.renderFooter(), totalIndex = header ? 1 : 0, sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
                var sectionID = dataSource.sectionIdentities[sectionIdx]
                  , rowIDs = allRowIDs[sectionIdx];
                if (0 !== rowIDs.length) {
                    if (this.props.renderSectionHeader) {
                        var shouldUpdateHeader = rowCount >= this.state.prevRenderedRowsCount && dataSource.sectionHeaderShouldUpdate(sectionIdx);
                        bodyComponents.push(React.createElement(StaticRenderer, {
                            key: "s_" + sectionID,
                            shouldUpdate: !!shouldUpdateHeader,
                            render: this.props.renderSectionHeader.bind(null , dataSource.getSectionHeaderData(sectionIdx), sectionID)
                        })),
                        sectionHeaderIndices.push(totalIndex++)
                    }
                    for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
                        var rowID = rowIDs[rowIdx]
                          , comboID = sectionID + rowID
                          , shouldUpdateRow = rowCount >= this.state.prevRenderedRowsCount && dataSource.rowShouldUpdate(sectionIdx, rowIdx)
                          , row = React.createElement(StaticRenderer, {
                            key: "r_" + comboID,
                            shouldUpdate: !!shouldUpdateRow,
                            render: this.props.renderRow.bind(null , dataSource.getRowData(sectionIdx, rowIdx), sectionID, rowID)
                        });
                        if (bodyComponents.push(row),
                        totalIndex++,
                        ++rowCount === this.state.curRenderedRowsCount)
                            break
                    }
                    if (rowCount >= this.state.curRenderedRowsCount)
                        break
                }
            }
            var props = merge(this.props, {
                onScroll: this._onScroll,
                stickyHeaderIndices: sectionHeaderIndices
            });
            return props.scrollEventThrottle || (props.scrollEventThrottle = DEFAULT_SCROLL_CALLBACK_THROTTLE),
            React.createElement(ScrollView, React.__spread({}, props, {
                ref: SCROLLVIEW_REF
            }), header, bodyComponents, footer)
        },
        _measureAndUpdateScrollProps: function() {
            RCTUIManager.measureLayout(this.refs[SCROLLVIEW_REF].getInnerViewNode(), React.findNodeHandle(this.refs[SCROLLVIEW_REF]), logError, this._setScrollContentHeight),
            RCTUIManager.measureLayoutRelativeToParent(React.findNodeHandle(this.refs[SCROLLVIEW_REF]), logError, this._setScrollVisibleHeight)
        },
        _setScrollContentHeight: function(left, top, width, height) {
            this.scrollProperties.contentHeight = height
        },
        _setScrollVisibleHeight: function(left, top, width, height) {
            this.scrollProperties.visibleHeight = height,
            this._updateVisibleRows()
        },
        _renderMoreRowsIfNeeded: function() {
            if (null  !== this.scrollProperties.contentHeight && null  !== this.scrollProperties.visibleHeight && this.state.curRenderedRowsCount !== this.props.dataSource.getRowCount()) {
                var distanceFromEnd = this._getDistanceFromEnd(this.scrollProperties);
                distanceFromEnd < this.props.scrollRenderAheadDistance && this._pageInNewRows()
            }
        },
        _pageInNewRows: function() {
            var rowsToRender = Math.min(this.state.curRenderedRowsCount + this.props.pageSize, this.props.dataSource.getRowCount());
            this.setState({
                prevRenderedRowsCount: this.state.curRenderedRowsCount,
                curRenderedRowsCount: rowsToRender
            }, function() {
                this._measureAndUpdateScrollProps(),
                this.setState({
                    prevRenderedRowsCount: this.state.curRenderedRowsCount
                })
            }
            .bind(this))
        },
        _getDistanceFromEnd: function(scrollProperties) {
            return scrollProperties.contentHeight - scrollProperties.visibleHeight - scrollProperties.offsetY
        },
        _updateVisibleRows: function(e) {
            if (this.props.onChangeVisibleRows) {
                var updatedFrames = e && e.nativeEvent.updatedChildFrames;
                updatedFrames && updatedFrames.forEach(function(frame) {
                    this._childFrames[frame.index] = merge(frame)
                }
                .bind(this));
                for (var dataSource = this.props.dataSource, visibleTop = this.scrollProperties.offsetY, visibleBottom = visibleTop + this.scrollProperties.visibleHeight, allRowIDs = dataSource.rowIdentities, header = this.props.renderHeader && this.props.renderHeader(), totalIndex = header ? 1 : 0, visibilityChanged = !1, changedRows = {}, sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
                    var rowIDs = allRowIDs[sectionIdx];
                    if (0 !== rowIDs.length) {
                        var sectionID = dataSource.sectionIdentities[sectionIdx];
                        this.props.renderSectionHeader && totalIndex++;
                        var visibleSection = this._visibleRows[sectionID];
                        visibleSection || (visibleSection = {});
                        for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
                            var rowID = rowIDs[rowIdx]
                              , frame = this._childFrames[totalIndex];
                            if (totalIndex++,
                            !frame)
                                break;
                            var rowVisible = visibleSection[rowID]
                              , top = frame.y
                              , bottom = top + frame.height;
                            top > visibleBottom || visibleTop > bottom ? rowVisible && (visibilityChanged = !0,
                            delete visibleSection[rowID],
                            changedRows[sectionID] || (changedRows[sectionID] = {}),
                            changedRows[sectionID][rowID] = !1) : rowVisible || (visibilityChanged = !0,
                            visibleSection[rowID] = !0,
                            changedRows[sectionID] || (changedRows[sectionID] = {}),
                            changedRows[sectionID][rowID] = !0)
                        }
                        isEmpty(visibleSection) ? this._visibleRows[sectionID] && delete this._visibleRows[sectionID] : this._visibleRows[sectionID] = visibleSection
                    }
                }
                visibilityChanged && this.props.onChangeVisibleRows(this._visibleRows, changedRows)
            }
        },
        _onScroll: function(e) {
            this.scrollProperties.visibleHeight = e.nativeEvent.layoutMeasurement.height,
            this.scrollProperties.contentHeight = e.nativeEvent.contentSize.height,
            this.scrollProperties.offsetY = e.nativeEvent.contentOffset.y,
            this._updateVisibleRows(e);
            var nearEnd = this._getDistanceFromEnd(this.scrollProperties) < this.props.onEndReachedThreshold;
            nearEnd && this.props.onEndReached && this.scrollProperties.contentHeight !== this._sentEndForContentHeight && this.state.curRenderedRowsCount === this.props.dataSource.getRowCount() ? (this._sentEndForContentHeight = this.scrollProperties.contentHeight,
            this.props.onEndReached(e)) : this._renderMoreRowsIfNeeded(),
            this.props.onScroll && this.props.onScroll(e)
        }
    });
    module.exports = ListView
}),
__d("ListViewDataSource", ["invariant", "isEmpty", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function defaultGetRowData(dataBlob, sectionID, rowID) {
        return dataBlob[sectionID][rowID]
    }
    function defaultGetSectionHeaderData(dataBlob, sectionID) {
        return dataBlob[sectionID]
    }
    function ListViewDataSource(params) {
        invariant(params && "function" == typeof params.rowHasChanged, "Must provide a rowHasChanged function."),
        this.$ListViewDataSource_rowHasChanged = params.rowHasChanged,
        this.$ListViewDataSource_getRowData = params.getRowData || defaultGetRowData,
        this.$ListViewDataSource_sectionHeaderHasChanged = params.sectionHeaderHasChanged,
        this.$ListViewDataSource_getSectionHeaderData = params.getSectionHeaderData || defaultGetSectionHeaderData,
        this.$ListViewDataSource_dataBlob = null ,
        this.$ListViewDataSource_dirtyRows = [],
        this.$ListViewDataSource_dirtySections = [],
        this.$ListViewDataSource_cachedRowCount = 0,
        this.rowIdentities = [],
        this.sectionIdentities = []
    }
    function countRows(allRowIDs) {
        for (var totalRows = 0, sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
            var rowIDs = allRowIDs[sectionIdx];
            totalRows += rowIDs.length
        }
        return totalRows
    }
    function keyedDictionaryFromArray(arr) {
        if (isEmpty(arr))
            return {};
        for (var result = {}, ii = 0; ii < arr.length; ii++) {
            var key = arr[ii];
            warning(!result[key], "Value appears more than once in array: " + key),
            result[key] = !0
        }
        return result
    }
    var invariant = require("invariant")
      , isEmpty = require("isEmpty")
      , warning = require("warning");
    ListViewDataSource.prototype.cloneWithRows = function(dataBlob, rowIdentities) {
        var rowIds = rowIdentities ? [rowIdentities] : null ;
        return this.$ListViewDataSource_sectionHeaderHasChanged || (this.$ListViewDataSource_sectionHeaderHasChanged = function() {
            return !1
        }
        ),
        this.cloneWithRowsAndSections({
            s1: dataBlob
        }, ["s1"], rowIds)
    }
    ,
    ListViewDataSource.prototype.cloneWithRowsAndSections = function(dataBlob, sectionIdentities, rowIdentities) {
        invariant("function" == typeof this.$ListViewDataSource_sectionHeaderHasChanged, "Must provide a sectionHeaderHasChanged function with section data.");
        var newSource = new ListViewDataSource({
            getRowData: this.$ListViewDataSource_getRowData,
            getSectionHeaderData: this.$ListViewDataSource_getSectionHeaderData,
            rowHasChanged: this.$ListViewDataSource_rowHasChanged,
            sectionHeaderHasChanged: this.$ListViewDataSource_sectionHeaderHasChanged
        });
        return newSource.$ListViewDataSource_dataBlob = dataBlob,
        sectionIdentities ? newSource.sectionIdentities = sectionIdentities : newSource.sectionIdentities = Object.keys(dataBlob),
        rowIdentities ? newSource.rowIdentities = rowIdentities : (newSource.rowIdentities = [],
        newSource.sectionIdentities.forEach(function(sectionID) {
            newSource.rowIdentities.push(Object.keys(dataBlob[sectionID]))
        })),
        newSource.$ListViewDataSource_cachedRowCount = countRows(newSource.rowIdentities),
        newSource.$ListViewDataSource_calculateDirtyArrays(this.$ListViewDataSource_dataBlob, this.sectionIdentities, this.rowIdentities),
        newSource
    }
    ,
    ListViewDataSource.prototype.getRowCount = function() {
        return this.$ListViewDataSource_cachedRowCount
    }
    ,
    ListViewDataSource.prototype.rowShouldUpdate = function(sectionIndex, rowIndex) {
        var needsUpdate = this.$ListViewDataSource_dirtyRows[sectionIndex][rowIndex];
        return warning(void 0 !== needsUpdate, "missing dirtyBit for section, row: " + sectionIndex + ", " + rowIndex),
        needsUpdate
    }
    ,
    ListViewDataSource.prototype.getRowData = function(sectionIndex, rowIndex) {
        var sectionID = this.sectionIdentities[sectionIndex]
          , rowID = this.rowIdentities[sectionIndex][rowIndex];
        return warning(void 0 !== sectionID && void 0 !== rowID, "rendering invalid section, row: " + sectionIndex + ", " + rowIndex),
        this.$ListViewDataSource_getRowData(this.$ListViewDataSource_dataBlob, sectionID, rowID)
    }
    ,
    ListViewDataSource.prototype.getRowIDForFlatIndex = function(index) {
        for (var accessIndex = index, ii = 0; ii < this.sectionIdentities.length; ii++) {
            if (!(accessIndex >= this.rowIdentities[ii].length))
                return this.rowIdentities[ii][accessIndex];
            accessIndex -= this.rowIdentities[ii].length
        }
        return null 
    }
    ,
    ListViewDataSource.prototype.getSectionIDForFlatIndex = function(index) {
        for (var accessIndex = index, ii = 0; ii < this.sectionIdentities.length; ii++) {
            if (!(accessIndex >= this.rowIdentities[ii].length))
                return this.sectionIdentities[ii];
            accessIndex -= this.rowIdentities[ii].length
        }
        return null 
    }
    ,
    ListViewDataSource.prototype.getSectionLengths = function() {
        for (var results = [], ii = 0; ii < this.sectionIdentities.length; ii++)
            results.push(this.rowIdentities[ii].length);
        return results
    }
    ,
    ListViewDataSource.prototype.sectionHeaderShouldUpdate = function(sectionIndex) {
        var needsUpdate = this.$ListViewDataSource_dirtySections[sectionIndex];
        return warning(void 0 !== needsUpdate, "missing dirtyBit for section: " + sectionIndex),
        needsUpdate
    }
    ,
    ListViewDataSource.prototype.getSectionHeaderData = function(sectionIndex) {
        if (!this.$ListViewDataSource_getSectionHeaderData)
            return null ;
        var sectionID = this.sectionIdentities[sectionIndex];
        return warning(void 0 !== sectionID, "renderSection called on invalid section: " + sectionIndex),
        this.$ListViewDataSource_getSectionHeaderData(this.$ListViewDataSource_dataBlob, sectionID)
    }
    ,
    ListViewDataSource.prototype.$ListViewDataSource_calculateDirtyArrays = function(prevDataBlob, prevSectionIDs, prevRowIDs) {
        for (var prevSectionsHash = keyedDictionaryFromArray(prevSectionIDs), prevRowsHash = {}, ii = 0; ii < prevRowIDs.length; ii++) {
            var sectionID = prevSectionIDs[ii];
            warning(!prevRowsHash[sectionID], "SectionID appears more than once: " + sectionID),
            prevRowsHash[sectionID] = keyedDictionaryFromArray(prevRowIDs[ii])
        }
        this.$ListViewDataSource_dirtySections = [],
        this.$ListViewDataSource_dirtyRows = [];
        for (var dirty, sIndex = 0; sIndex < this.sectionIdentities.length; sIndex++) {
            var sectionID = this.sectionIdentities[sIndex];
            dirty = !prevSectionsHash[sectionID];
            var sectionHeaderHasChanged = this.$ListViewDataSource_sectionHeaderHasChanged;
            !dirty && sectionHeaderHasChanged && (dirty = sectionHeaderHasChanged(this.$ListViewDataSource_getSectionHeaderData(prevDataBlob, sectionID), this.$ListViewDataSource_getSectionHeaderData(this.$ListViewDataSource_dataBlob, sectionID))),
            this.$ListViewDataSource_dirtySections.push(!!dirty),
            this.$ListViewDataSource_dirtyRows[sIndex] = [];
            for (var rIndex = 0; rIndex < this.rowIdentities[sIndex].length; rIndex++) {
                var rowID = this.rowIdentities[sIndex][rIndex];
                dirty = !prevSectionsHash[sectionID] || !prevRowsHash[sectionID][rowID] || this.$ListViewDataSource_rowHasChanged(this.$ListViewDataSource_getRowData(prevDataBlob, sectionID, rowID), this.$ListViewDataSource_getRowData(this.$ListViewDataSource_dataBlob, sectionID, rowID)),
                this.$ListViewDataSource_dirtyRows[sIndex].push(!!dirty)
            }
        }
    }
    ,
    module.exports = ListViewDataSource
}),
__d("isEmpty", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function isEmpty(obj) {
        if (Array.isArray(obj))
            return 0 === obj.length;
        if ("object" == typeof obj) {
            for (var i in obj)
                return !1;
            return !0
        }
        return !obj
    }
    module.exports = isEmpty
}),
__d("ScrollView", ["EdgeInsetsPropType", "Platform", "PointPropType", "NativeModules", "React", "ReactNativeViewAttributes", "NativeModules", "ScrollResponder", "StyleSheet", "StyleSheetPropType", "View", "ViewStylePropTypes", "createReactNativeComponentClass", "deepDiffer", "flattenStyle", "insetsDiffer", "invariant", "pointsDiffer", "requireNativeComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var EdgeInsetsPropType = require("EdgeInsetsPropType")
      , Platform = require("Platform")
      , PointPropType = require("PointPropType")
      , RCTScrollView = require("NativeModules").UIManager.RCTScrollView
      , RCTScrollViewConsts = RCTScrollView.Constants
      , React = require("React")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , RCTUIManager = require("NativeModules").UIManager
      , ScrollResponder = require("ScrollResponder")
      , StyleSheet = require("StyleSheet")
      , StyleSheetPropType = require("StyleSheetPropType")
      , View = require("View")
      , ViewStylePropTypes = require("ViewStylePropTypes")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , deepDiffer = require("deepDiffer")
      , flattenStyle = require("flattenStyle")
      , insetsDiffer = require("insetsDiffer")
      , invariant = require("invariant")
      , pointsDiffer = require("pointsDiffer")
      , requireNativeComponent = require("requireNativeComponent")
      , PropTypes = React.PropTypes
      , SCROLLVIEW = "ScrollView"
      , INNERVIEW = "InnerScrollView"
      , keyboardDismissModeConstants = {
        none: RCTScrollViewConsts.KeyboardDismissMode.None,
        interactive: RCTScrollViewConsts.KeyboardDismissMode.Interactive,
        onDrag: RCTScrollViewConsts.KeyboardDismissMode.OnDrag
    }
      , ScrollView = React.createClass({
        displayName: "ScrollView",
        propTypes: {
            automaticallyAdjustContentInsets: PropTypes.bool,
            contentInset: EdgeInsetsPropType,
            contentOffset: PointPropType,
            onScroll: PropTypes.func,
            onScrollAnimationEnd: PropTypes.func,
            scrollEnabled: PropTypes.bool,
            scrollIndicatorInsets: EdgeInsetsPropType,
            showsHorizontalScrollIndicator: PropTypes.bool,
            showsVerticalScrollIndicator: PropTypes.bool,
            style: StyleSheetPropType(ViewStylePropTypes),
            scrollEventThrottle: PropTypes.number,
            bounces: PropTypes.bool,
            bouncesZoom: PropTypes.bool,
            alwaysBounceHorizontal: PropTypes.bool,
            alwaysBounceVertical: PropTypes.bool,
            centerContent: PropTypes.bool,
            contentContainerStyle: StyleSheetPropType(ViewStylePropTypes),
            decelerationRate: PropTypes.number,
            horizontal: PropTypes.bool,
            directionalLockEnabled: PropTypes.bool,
            canCancelContentTouches: PropTypes.bool,
            keyboardDismissMode: PropTypes.oneOf(["none", "interactive", "onDrag"]),
            keyboardShouldPersistTaps: PropTypes.bool,
            maximumZoomScale: PropTypes.number,
            minimumZoomScale: PropTypes.number,
            pagingEnabled: PropTypes.bool,
            scrollsToTop: PropTypes.bool,
            stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number),
            removeClippedSubviews: PropTypes.bool,
            zoomScale: PropTypes.number,
            scrollbarattr: PropTypes.object,
        },
        mixins: [ScrollResponder.Mixin],
        getInitialState: function() {
            this.props.scrollbarattr = null;
            return this.scrollResponderMixinGetInitialState()
        },
        setNativeProps: function(props) {
            this.refs[SCROLLVIEW].setNativeProps(props)
        },
        getInnerViewNode: function() {
            return React.findNodeHandle(this.refs[INNERVIEW])
        },
        scrollTo: function(destY, destX) {
            // "android" === Platform.OS ? RCTUIManager.dispatchViewManagerCommand(React.findNodeHandle(this), RCTUIManager.RCTScrollView.Commands.scrollTo, [destX || 0, destY || 0]) : RCTUIManager.scrollTo(React.findNodeHandle(this), destX || 0, destY || 0)
            RCTUIManager.scrollTo(React.findNodeHandle(this), destX || 0, destY || 0)
        },
        scrollWithoutAnimationTo: function(destY, destX) {
            RCTUIManager.scrollWithoutAnimationTo(React.findNodeHandle(this), destX || 0, destY || 0)
        },
        render: function() {
            var contentContainerStyle = [this.props.horizontal && styles.contentContainerHorizontal, this.props.contentContainerStyle];
            if (__DEV__ && this.props.style) {
                var style = flattenStyle(this.props.style)
                  , childLayoutProps = ["alignItems", "justifyContent"].filter(function(prop) {
                    return style && void 0 !== style[prop]
                });
                invariant(0 === childLayoutProps.length, "ScrollView child layout (" + JSON.stringify(childLayoutProps) + ") must by applied through the contentContainerStyle prop.")
            }
            if (__DEV__ && this.props.onScroll && !this.props.scrollEventThrottle) {
                var onScroll = this.props.onScroll;
                this.props.onScroll = function() {
                    console.log("You specified `onScroll` on a <ScrollView> but not `scrollEventThrottle`. You will only receive one event. Using `16` you get all the events but be aware that it may cause frame drops, use a bigger number if you don't need as much precision."),
                    onScroll.apply(this, arguments)
                }
            }
            var ScrollViewClass, contentContainer = React.createElement(View, {
                ref: INNERVIEW,
                style: contentContainerStyle,
                removeClippedSubviews: this.props.removeClippedSubviews
            }, this.props.children), alwaysBounceHorizontal = void 0 !== this.props.alwaysBounceHorizontal ? this.props.alwaysBounceHorizontal : this.props.horizontal, alwaysBounceVertical = void 0 !== this.props.alwaysBounceVertical ? this.props.alwaysBounceVertical : !this.props.horizontal, props = Object.assign({}, this.props, {
                alwaysBounceHorizontal: alwaysBounceHorizontal,
                alwaysBounceVertical: alwaysBounceVertical,
                keyboardDismissMode: this.props.keyboardDismissMode ? keyboardDismissModeConstants[this.props.keyboardDismissMode] : void 0,
                style: [styles.base, this.props.style],
                onTouchStart: this.scrollResponderHandleTouchStart,
                onTouchMove: this.scrollResponderHandleTouchMove,
                onTouchEnd: this.scrollResponderHandleTouchEnd,
                onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
                onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
                onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
                onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
                onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
                onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
                onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
                onScroll: this.scrollResponderHandleScroll,
                onResponderGrant: this.scrollResponderHandleResponderGrant,
                onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
                onResponderTerminate: this.scrollResponderHandleTerminate,
                onResponderRelease: this.scrollResponderHandleResponderRelease,
                onResponderReject: this.scrollResponderHandleResponderReject,
                scrollbarattr: JSON.stringify(this.props.scrollbarattr),
            });
            return ScrollViewClass = RCTScrollView,
            invariant(void 0 !== ScrollViewClass, "ScrollViewClass must not be undefined"),
            React.createElement(ScrollViewClass, React.__spread({}, props, {
                ref: SCROLLVIEW
            }), contentContainer)
        }
    })
      , styles = StyleSheet.create({
        base: {
            flex: 1
        },
        contentContainerHorizontal: {
            alignSelf: "flex-start",
            flexDirection: "row"
        }
    })
      , validAttributes = Object.assign({}, ReactNativeViewAttributes.UIView, {
        alwaysBounceHorizontal: !0,
        alwaysBounceVertical: !0,
        automaticallyAdjustContentInsets: !0,
        bounces: !0,
        centerContent: !0,
        contentInset: {
            diff: insetsDiffer
        },
        contentOffset: {
            diff: pointsDiffer
        },
        decelerationRate: !0,
        horizontal: !0,
        keyboardDismissMode: !0,
        keyboardShouldPersistTaps: !0,
        maximumZoomScale: !0,
        minimumZoomScale: !0,
        pagingEnabled: !0,
        removeClippedSubviews: !0,
        scrollEnabled: !0,
        scrollIndicatorInsets: {
            diff: insetsDiffer
        },
        scrollsToTop: !0,
        showsHorizontalScrollIndicator: !0,
        showsVerticalScrollIndicator: !0,
        stickyHeaderIndices: {
            diff: deepDiffer
        },
        scrollEventThrottle: !0,
        zoomScale: !0,
        scrollbarattr: !0,
    });
    // if ("android" === Platform.OS)
    //     var AndroidScrollView = createReactNativeComponentClass({
    //         validAttributes: validAttributes,
    //         uiViewClassName: "RCTScrollView"
    //     })
    //       , AndroidHorizontalScrollView = createReactNativeComponentClass({
    //         validAttributes: validAttributes,
    //         uiViewClassName: "AndroidHorizontalScrollView"
    //     });
    // else if ("ios" === Platform.OS)
    //     var RCTScrollView = requireNativeComponent("RCTScrollView", ScrollView);
    var RCTScrollView = requireNativeComponent("RCTScrollView", ScrollView);
    module.exports = ScrollView
}),
__d("PointPropType", ["ReactPropTypes", "createStrictShapeTypeChecker", "pointsDiffer"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var PropTypes = require("ReactPropTypes")
      , createStrictShapeTypeChecker = require("createStrictShapeTypeChecker")
      , PointPropType = (require("pointsDiffer"),
    createStrictShapeTypeChecker({
        x: PropTypes.number,
        y: PropTypes.number
    }));
    module.exports = PointPropType
}),
__d("ScrollResponder", ["NativeModules", "RCTDeviceEventEmitter", "React", "Subscribable", "TextInputState", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeModules = require("NativeModules")
      , RCTDeviceEventEmitter = require("RCTDeviceEventEmitter")
      , React = require("React")
      , Subscribable = require("Subscribable")
      , TextInputState = require("TextInputState")
      , RCTUIManager = NativeModules.UIManager
      , RCTUIManagerDeprecated = NativeModules.UIManager
      , RCTScrollViewConsts = RCTUIManager.RCTScrollView.Constants
      , warning = require("warning")
      , IS_ANIMATING_TOUCH_START_THRESHOLD_MS = 16
      , ScrollResponderMixin = {
        mixins: [Subscribable.Mixin],
        statics: RCTScrollViewConsts,
        scrollResponderMixinGetInitialState: function() {
            return {
                isTouching: !1,
                lastMomentumScrollBeginTime: 0,
                lastMomentumScrollEndTime: 0,
                observedScrollSinceBecomingResponder: !1,
                becameResponderWhileAnimating: !1
            }
        },
        scrollResponderHandleScrollShouldSetResponder: function() {
            return this.state.isTouching
        },
        scrollResponderHandleStartShouldSetResponder: function() {
            return !1
        },
        scrollResponderHandleStartShouldSetResponderCapture: function(e) {
            var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
            return this.props.keyboardShouldPersistTaps || null  == currentlyFocusedTextInput || e.target == currentlyFocusedTextInput ? this.scrollResponderIsAnimating() : !0
        },
        scrollResponderHandleResponderReject: function() {
            warning(!1, "ScrollView doesn't take rejection well - scrolls anyway")
        },
        scrollResponderHandleTerminationRequest: function() {
            return !this.state.observedScrollSinceBecomingResponder
        },
        scrollResponderHandleTouchEnd: function(e) {
            var nativeEvent = e.nativeEvent;
            this.state.isTouching = 0 !== nativeEvent.touches.length,
            this.props.onTouchEnd && this.props.onTouchEnd(e)
        },
        scrollResponderHandleResponderRelease: function(e) {
            this.props.onResponderRelease && this.props.onResponderRelease(e);
            var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
            this.props.keyboardShouldPersistTaps || null  == currentlyFocusedTextInput || e.target == currentlyFocusedTextInput || this.state.observedScrollSinceBecomingResponder || this.state.becameResponderWhileAnimating || (this.props.onScrollResponderKeyboardDismissed && this.props.onScrollResponderKeyboardDismissed(e),
            TextInputState.blurTextInput(currentlyFocusedTextInput))
        },
        scrollResponderHandleScroll: function(e) {
            this.state.observedScrollSinceBecomingResponder = !0,
            this.props.onScroll && this.props.onScroll(e)
        },
        scrollResponderHandleResponderGrant: function(e) {
            this.state.observedScrollSinceBecomingResponder = !1,
            this.props.onResponderGrant && this.props.onResponderGrant(e),
            this.state.becameResponderWhileAnimating = this.scrollResponderIsAnimating()
        },
        scrollResponderHandleScrollBeginDrag: function(e) {
            this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e)
        },
        scrollResponderHandleScrollEndDrag: function(e) {
            this.props.onScrollEndDrag && this.props.onScrollEndDrag(e)
        },
        scrollResponderHandleMomentumScrollBegin: function(e) {
            this.state.lastMomentumScrollBeginTime = Date.now(),
            this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin(e)
        },
        scrollResponderHandleMomentumScrollEnd: function(e) {
            this.state.lastMomentumScrollEndTime = Date.now(),
            this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e)
        },
        scrollResponderHandleTouchStart: function(e) {
            this.state.isTouching = !0,
            this.props.onTouchStart && this.props.onTouchStart(e)
        },
        scrollResponderHandleTouchMove: function(e) {
            this.props.onTouchMove && this.props.onTouchMove(e)
        },
        scrollResponderIsAnimating: function() {
            var now = Date.now()
              , timeSinceLastMomentumScrollEnd = now - this.state.lastMomentumScrollEndTime
              , isAnimating = IS_ANIMATING_TOUCH_START_THRESHOLD_MS > timeSinceLastMomentumScrollEnd || this.state.lastMomentumScrollEndTime < this.state.lastMomentumScrollBeginTime;
            return isAnimating
        },
        scrollResponderScrollTo: function(offsetX, offsetY) {
            RCTUIManagerDeprecated.scrollTo(React.findNodeHandle(this), offsetX, offsetY)
        },
        scrollResponderZoomTo: function(rect) {
            RCTUIManagerDeprecated.zoomToRect(React.findNodeHandle(this), rect)
        },
        scrollResponderScrollNativeHandleToKeyboard: function(nodeHandle, additionalOffset, preventNegativeScrollOffset) {
            this.additionalScrollOffset = additionalOffset || 0,
            this.preventNegativeScrollOffset = !!preventNegativeScrollOffset,
            RCTUIManager.measureLayout(nodeHandle, React.findNodeHandle(this), this.scrollResponderTextInputFocusError, this.scrollResponderInputMeasureAndScrollToKeyboard)
        },
        scrollResponderInputMeasureAndScrollToKeyboard: function(left, top, width, height) {
            if (this.keyboardWillOpenTo) {
                var scrollOffsetY = top - this.keyboardWillOpenTo.endCoordinates.screenY + height + this.additionalScrollOffset;
                this.preventNegativeScrollOffset && (scrollOffsetY = Math.max(0, scrollOffsetY)),
                this.scrollResponderScrollTo(0, scrollOffsetY)
            }
            this.additionalOffset = 0,
            this.preventNegativeScrollOffset = !1
        },
        scrollResponderTextInputFocusError: function(e) {
            console.error("Error measuring text field: ", e)
        },
        componentWillMount: function() {
            this.keyboardWillOpenTo = null ,
            this.additionalScrollOffset = 0,
            this.addListenerOn(RCTDeviceEventEmitter, "keyboardWillShow", this.scrollResponderKeyboardWillShow),
            this.addListenerOn(RCTDeviceEventEmitter, "keyboardWillHide", this.scrollResponderKeyboardWillHide),
            this.addListenerOn(RCTDeviceEventEmitter, "keyboardDidShow", this.scrollResponderKeyboardDidShow),
            this.addListenerOn(RCTDeviceEventEmitter, "keyboardDidHide", this.scrollResponderKeyboardDidHide)
        },
        scrollResponderKeyboardWillShow: function(e) {
            this.keyboardWillOpenTo = e,
            this.props.onKeyboardWillShow && this.props.onKeyboardWillShow(e)
        },
        scrollResponderKeyboardWillHide: function(e) {
            this.keyboardWillOpenTo = null ,
            this.props.onKeyboardWillHide && this.props.onKeyboardWillHide(e)
        },
        scrollResponderKeyboardDidShow: function() {
            this.keyboardWillOpenTo = null ,
            this.props.onKeyboardDidShow && this.props.onKeyboardDidShow()
        },
        scrollResponderKeyboardDidHide: function() {
            this.keyboardWillOpenTo = null ,
            this.props.onKeyboardDidHide && this.props.onKeyboardDidHide()
        }
    }
      , ScrollResponder = {
        Mixin: ScrollResponderMixin
    };
    module.exports = ScrollResponder
}),
__d("Subscribable", ["EventEmitter"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var Subscribable = (require("EventEmitter"),
    {});
    Subscribable.Mixin = {
        componentWillMount: function() {
            this._subscribableSubscriptions = []
        },
        componentWillUnmount: function() {
            this._subscribableSubscriptions.forEach(function(subscription) {
                return subscription.remove()
            }),
            this._subscribableSubscriptions = null 
        },
        addListenerOn: function(eventEmitter, eventType, listener, context) {
            this._subscribableSubscriptions.push(eventEmitter.addListener(eventType, listener, context))
        }
    },
    module.exports = Subscribable
}),
__d("StaticRenderer", ["React"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var React = require("React")
      , StaticRenderer = React.createClass({
        displayName: "StaticRenderer",
        propTypes: {
            shouldUpdate: React.PropTypes.bool.isRequired,
            render: React.PropTypes.func.isRequired
        },
        shouldComponentUpdate: function(nextProps) {
            return nextProps.shouldUpdate
        },
        render: function() {
            return this.props.render()
        }
    });
    module.exports = StaticRenderer
}),
__d("react-timer-mixin/TimerMixin", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var setter = function(_setter, _clearer, array) {
        return function(callback, delta) {
            var id = _setter(function() {
                _clearer.call(this, id),
                callback.apply(this, arguments)
            }
            .bind(this), delta);
            return this[array] ? this[array].push(id) : this[array] = [id],
            id
        }
    }
      , clearer = function(_clearer, array) {
        return function(id) {
            if (this[array]) {
                var index = this[array].indexOf(id);
                -1 !== index && this[array].splice(index, 1)
            }
            _clearer(id)
        }
    }
      , _timeouts = "TimerMixin_timeouts"
      , _clearTimeout = clearer(clearTimeout, _timeouts)
      , _intervals = (setter(setTimeout, _clearTimeout, _timeouts),
    "TimerMixin_intervals")
      , _immediates = (clearer(clearInterval, _intervals),
    setter(setInterval, function() {}, _intervals),
    "TimerMixin_immediates")
      , _clearImmediate = clearer(clearImmediate, _immediates)
      , _rafs = (setter(setImmediate, _clearImmediate, _immediates),
    "TimerMixin_rafs")
      , _cancelAnimationFrame = clearer(cancelAnimationFrame, _rafs)
      , TimerMixin = (setter(requestAnimationFrame, _cancelAnimationFrame, _rafs),
    {
        componentWillUnmount: function() {
            this[_timeouts] && this[_timeouts].forEach(this.clearTimeout),
            this[_intervals] && this[_intervals].forEach(this.clearInterval),
            this[_immediates] && this[_immediates].forEach(this.clearImmediate),
            this[_rafs] && this[_rafs].forEach(this.cancelAnimationFrame)
        },
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        setImmediate: setImmediate,
        clearImmediate: clearImmediate,
        requestAnimationFrame: requestAnimationFrame.bind(window),
        cancelAnimationFrame: cancelAnimationFrame
    });
    module.exports = TimerMixin
}),
__d("MapView", ["EdgeInsetsPropType", "NativeMethodsMixin", "Platform", "React", "ReactNativeViewAttributes", "View", "createReactNativeComponentClass", "deepDiffer", "insetsDiffer", "merge", "requireNativeComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var EdgeInsetsPropType = require("EdgeInsetsPropType")
      , NativeMethodsMixin = require("NativeMethodsMixin")
      , Platform = require("Platform")
      , React = require("React")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , View = require("View")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , deepDiffer = require("deepDiffer")
      , insetsDiffer = require("insetsDiffer")
      , merge = require("merge")
      , requireNativeComponent = require("requireNativeComponent")
      , MapView = React.createClass({
        displayName: "MapView",
        mixins: [NativeMethodsMixin],
        propTypes: {
            style: View.propTypes.style,
            showsUserLocation: React.PropTypes.bool,
            zoomEnabled: React.PropTypes.bool,
            rotateEnabled: React.PropTypes.bool,
            pitchEnabled: React.PropTypes.bool,
            scrollEnabled: React.PropTypes.bool,
            region: React.PropTypes.shape({
                latitude: React.PropTypes.number.isRequired,
                longitude: React.PropTypes.number.isRequired,
                latitudeDelta: React.PropTypes.number.isRequired,
                longitudeDelta: React.PropTypes.number.isRequired
            }),
            annotations: React.PropTypes.arrayOf(React.PropTypes.shape({
                latitude: React.PropTypes.number.isRequired,
                longitude: React.PropTypes.number.isRequired,
                title: React.PropTypes.string,
                subtitle: React.PropTypes.string
            })),
            maxDelta: React.PropTypes.number,
            minDelta: React.PropTypes.number,
            legalLabelInsets: EdgeInsetsPropType,
            onRegionChange: React.PropTypes.func,
            onRegionChangeComplete: React.PropTypes.func
        },
        _onChange: function(event) {
            event.nativeEvent.continuous ? this.props.onRegionChange && this.props.onRegionChange(event.nativeEvent.region) : this.props.onRegionChangeComplete && this.props.onRegionChangeComplete(event.nativeEvent.region)
        },
        render: function() {
            return React.createElement(RCTMap, React.__spread({}, this.props, {
                onChange: this._onChange
            }))
        }
    });
    // if ("android" === Platform.OS)
    //     var RCTMap = createReactNativeComponentClass({
    //         validAttributes: merge(ReactNativeViewAttributes.UIView, {
    //             showsUserLocation: !0,
    //             zoomEnabled: !0,
    //             rotateEnabled: !0,
    //             pitchEnabled: !0,
    //             scrollEnabled: !0,
    //             region: {
    //                 diff: deepDiffer
    //             },
    //             annotations: {
    //                 diff: deepDiffer
    //             },
    //             maxDelta: !0,
    //             minDelta: !0,
    //             legalLabelInsets: {
    //                 diff: insetsDiffer
    //             }
    //         }),
    //         uiViewClassName: "RCTMap"
    //     });
    // else
    //     var RCTMap = requireNativeComponent("RCTMap", MapView);
    var RCTMap = requireNativeComponent("RCTMap", MapView);
    module.exports = MapView
}),
__d("NavigatorIOS", ["EventEmitter", "Image", "React", "ReactNativeViewAttributes", "NativeModules", "StyleSheet", "StaticContainer.react", "View", "createReactNativeComponentClass", "invariant", "logError", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getuid() {
        return __uid++
    }
    var EventEmitter = require("EventEmitter")
      , Image = require("Image")
      , React = require("React")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , RCTNavigatorManager = require("NativeModules").NavigatorManager
      , StyleSheet = require("StyleSheet")
      , StaticContainer = require("StaticContainer.react")
      , View = require("View")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , invariant = require("invariant")
      , logError = require("logError")
      , merge = require("merge")
      , TRANSITIONER_REF = "transitionerRef"
      , PropTypes = React.PropTypes
      , __uid = 0
      , RCTNavigator = createReactNativeComponentClass({
        validAttributes: merge(ReactNativeViewAttributes.UIView, {
            requestedTopOfStack: !0
        }),
        uiViewClassName: "RCTNavigator"
    })
      , RCTNavigatorItem = createReactNativeComponentClass({
        validAttributes: {
            title: !0,
            barTintColor: !0,
            leftButtonIcon: !0,
            leftButtonTitle: !0,
            onNavLeftButtonTap: !0,
            rightButtonIcon: !0,
            rightButtonTitle: !0,
            onNavRightButtonTap: !0,
            backButtonIcon: !0,
            backButtonTitle: !0,
            tintColor: !0,
            navigationBarHidden: !0,
            titleTextColor: !0,
            style: !0
        },
        uiViewClassName: "RCTNavItem"
    })
      , NavigatorTransitionerIOS = React.createClass({
        displayName: "NavigatorTransitionerIOS",
        requestSchedulingNavigation: function(cb) {
            RCTNavigatorManager.requestSchedulingJavaScriptNavigation(React.findNodeHandle(this), logError, cb)
        },
        render: function() {
            return React.createElement(RCTNavigator, React.__spread({}, this.props))
        }
    })
      , NavigatorIOS = React.createClass({
        displayName: "NavigatorIOS",
        propTypes: {
            initialRoute: PropTypes.shape({
                component: PropTypes.func.isRequired,
                title: PropTypes.string.isRequired,
                passProps: PropTypes.object,
                backButtonIcon: Image.propTypes.source,
                backButtonTitle: PropTypes.string,
                leftButtonIcon: Image.propTypes.source,
                leftButtonTitle: PropTypes.string,
                onLeftButtonPress: PropTypes.func,
                rightButtonIcon: Image.propTypes.source,
                rightButtonTitle: PropTypes.string,
                onRightButtonPress: PropTypes.func,
                wrapperStyle: View.propTypes.style
            }).isRequired,
            navigationBarHidden: PropTypes.bool,
            itemWrapperStyle: View.propTypes.style,
            tintColor: PropTypes.string,
            barTintColor: PropTypes.string,
            titleTextColor: PropTypes.string
        },
        navigator: void 0,
        componentWillMount: function() {
            this.navigator = {
                push: this.push,
                pop: this.pop,
                popN: this.popN,
                replace: this.replace,
                replacePrevious: this.replacePrevious,
                replacePreviousAndPop: this.replacePreviousAndPop,
                resetTo: this.resetTo,
                popToRoute: this.popToRoute,
                popToTop: this.popToTop
            }
        },
        getInitialState: function() {
            return {
                idStack: [getuid()],
                routeStack: [this.props.initialRoute],
                requestedTopOfStack: 0,
                observedTopOfStack: 0,
                progress: 1,
                fromIndex: 0,
                toIndex: 0,
                makingNavigatorRequest: !1,
                updatingAllIndicesAtOrBeyond: 0
            }
        },
        _toFocusOnNavigationComplete: void 0,
        _handleFocusRequest: function(item) {
            this.state.makingNavigatorRequest ? this._toFocusOnNavigationComplete = item : this._getFocusEmitter().emit("focus", item)
        },
        _focusEmitter: void 0,
        _getFocusEmitter: function() {
            var focusEmitter = this._focusEmitter;
            return focusEmitter || (focusEmitter = new EventEmitter,
            this._focusEmitter = focusEmitter),
            focusEmitter
        },
        getChildContext: function() {
            return {
                onFocusRequested: this._handleFocusRequest,
                focusEmitter: this._getFocusEmitter()
            }
        },
        childContextTypes: {
            onFocusRequested: React.PropTypes.func,
            focusEmitter: React.PropTypes.instanceOf(EventEmitter)
        },
        _tryLockNavigator: function(cb) {
            this.refs[TRANSITIONER_REF].requestSchedulingNavigation(function(acquiredLock) {
                return acquiredLock && cb()
            })
        },
        _handleNavigatorStackChanged: function(e) {
            var newObservedTopOfStack = e.nativeEvent.stackLength - 1;
            invariant(newObservedTopOfStack <= this.state.requestedTopOfStack, "No navigator item should be pushed without JS knowing about it %s %s", newObservedTopOfStack, this.state.requestedTopOfStack);
            var wasWaitingForConfirmation = this.state.requestedTopOfStack !== this.state.observedTopOfStack;
            wasWaitingForConfirmation && invariant(newObservedTopOfStack === this.state.requestedTopOfStack, "If waiting for observedTopOfStack to reach requestedTopOfStack, the only valid observedTopOfStack should be requestedTopOfStack.");
            var nextState = {
                observedTopOfStack: newObservedTopOfStack,
                makingNavigatorRequest: !1,
                updatingAllIndicesAtOrBeyond: null ,
                progress: 1,
                toIndex: newObservedTopOfStack,
                fromIndex: newObservedTopOfStack
            };
            this.setState(nextState, this._eliminateUnneededChildren)
        },
        _eliminateUnneededChildren: function() {
            var updatingAllIndicesAtOrBeyond = this.state.routeStack.length > this.state.observedTopOfStack + 1 ? this.state.observedTopOfStack + 1 : null ;
            this.setState({
                idStack: this.state.idStack.slice(0, this.state.observedTopOfStack + 1),
                routeStack: this.state.routeStack.slice(0, this.state.observedTopOfStack + 1),
                requestedTopOfStack: this.state.observedTopOfStack,
                makingNavigatorRequest: !0,
                updatingAllIndicesAtOrBeyond: updatingAllIndicesAtOrBeyond
            })
        },
        push: function(route) {
            invariant(!!route, "Must supply route to push"),
            this.state.requestedTopOfStack === this.state.observedTopOfStack && this._tryLockNavigator(function() {
                var nextStack = this.state.routeStack.concat([route])
                  , nextIDStack = this.state.idStack.concat([getuid()]);
                this.setState({
                    idStack: nextIDStack,
                    routeStack: nextStack,
                    requestedTopOfStack: nextStack.length - 1,
                    makingNavigatorRequest: !0,
                    updatingAllIndicesAtOrBeyond: nextStack.length - 1
                })
            }
            .bind(this))
        },
        popN: function(n) {
            0 !== n && this.state.requestedTopOfStack === this.state.observedTopOfStack && this.state.requestedTopOfStack > 0 && this._tryLockNavigator(function() {
                invariant(this.state.requestedTopOfStack - n >= 0, "Cannot pop below 0"),
                this.setState({
                    requestedTopOfStack: this.state.requestedTopOfStack - n,
                    makingNavigatorRequest: !0,
                    updatingAllIndicesAtOrBeyond: null 
                })
            }
            .bind(this))
        },
        pop: function() {
            this.popN(1)
        },
        replaceAtIndex: function(route, index) {
            if (invariant(!!route, "Must supply route to replace"),
            0 > index && (index += this.state.routeStack.length),
            !(this.state.routeStack.length <= index)) {
                var nextIDStack = this.state.idStack.slice()
                  , nextRouteStack = this.state.routeStack.slice();
                nextIDStack[index] = getuid(),
                nextRouteStack[index] = route,
                this.setState({
                    idStack: nextIDStack,
                    routeStack: nextRouteStack,
                    makingNavigatorRequest: !1,
                    updatingAllIndicesAtOrBeyond: index
                })
            }
        },
        replace: function(route) {
            this.replaceAtIndex(route, -1)
        },
        replacePrevious: function(route) {
            this.replaceAtIndex(route, -2)
        },
        popToTop: function() {
            this.popToRoute(this.state.routeStack[0])
        },
        popToRoute: function(route) {
            var indexOfRoute = this.state.routeStack.indexOf(route);
            invariant(-1 !== indexOfRoute, "Calling pop to route for a route that doesn't exist!");
            var numToPop = this.state.routeStack.length - indexOfRoute - 1;
            this.popN(numToPop)
        },
        replacePreviousAndPop: function(route) {
            this.state.requestedTopOfStack === this.state.observedTopOfStack && (this.state.routeStack.length < 2 || this._tryLockNavigator(function() {
                this.replacePrevious(route),
                this.setState({
                    requestedTopOfStack: this.state.requestedTopOfStack - 1,
                    makingNavigatorRequest: !0
                })
            }
            .bind(this)))
        },
        resetTo: function(route) {
            invariant(!!route, "Must supply route to push"),
            this.state.requestedTopOfStack === this.state.observedTopOfStack && (this.replaceAtIndex(route, 0),
            this.popToRoute(route))
        },
        handleNavigationComplete: function(e) {
            this._toFocusOnNavigationComplete && (this._getFocusEmitter().emit("focus", this._toFocusOnNavigationComplete),
            this._toFocusOnNavigationComplete = null ),
            this._handleNavigatorStackChanged(e)
        },
        _routeToStackItem: function(route, i) {
            var Component = route.component
              , shouldUpdateChild = null  !== this.state.updatingAllIndicesAtOrBeyond && this.state.updatingAllIndicesAtOrBeyond >= i;
            return React.createElement(StaticContainer, {
                key: "nav" + i,
                shouldUpdate: shouldUpdateChild
            }, React.createElement(RCTNavigatorItem, {
                title: route.title,
                style: [styles.stackItem, this.props.itemWrapperStyle, route.wrapperStyle],
                backButtonIcon: this._imageNameFromSource(route.backButtonIcon),
                backButtonTitle: route.backButtonTitle,
                leftButtonIcon: this._imageNameFromSource(route.leftButtonIcon),
                leftButtonTitle: route.leftButtonTitle,
                onNavLeftButtonTap: route.onLeftButtonPress,
                rightButtonIcon: this._imageNameFromSource(route.rightButtonIcon),
                rightButtonTitle: route.rightButtonTitle,
                onNavRightButtonTap: route.onRightButtonPress,
                navigationBarHidden: this.props.navigationBarHidden,
                tintColor: this.props.tintColor,
                barTintColor: this.props.barTintColor,
                titleTextColor: this.props.titleTextColor
            }, React.createElement(Component, React.__spread({
                navigator: this.navigator,
                route: route
            }, route.passProps))))
        },
        _imageNameFromSource: function(source) {
            return source ? source.uri : void 0
        },
        renderNavigationStackItems: function() {
            var shouldRecurseToNavigator = this.state.makingNavigatorRequest || null  !== this.state.updatingAllIndicesAtOrBeyond
              , items = shouldRecurseToNavigator ? this.state.routeStack.map(this._routeToStackItem) : null ;
            return React.createElement(StaticContainer, {
                shouldUpdate: shouldRecurseToNavigator
            }, React.createElement(NavigatorTransitionerIOS, {
                ref: TRANSITIONER_REF,
                style: styles.transitioner,
                vertical: this.props.vertical,
                requestedTopOfStack: this.state.requestedTopOfStack,
                onNavigationComplete: this.handleNavigationComplete
            }, items))
        },
        render: function() {
            return React.createElement(View, {
                style: this.props.style
            }, this.renderNavigationStackItems())
        }
    })
      , styles = StyleSheet.create({
        stackItem: {
            backgroundColor: "white",
            overflow: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        transitioner: {
            flex: 1
        }
    });
    module.exports = NavigatorIOS
}),
__d("StaticContainer.react", ["React", "onlyChild"], function(global, require, requireDynamic, requireLazy, module, exports) {
    var React = require("React")
      , onlyChild = require("onlyChild")
      , StaticContainer = React.createClass({
        displayName: "StaticContainer",
        shouldComponentUpdate: function(nextProps) {
            return nextProps.shouldUpdate
        },
        render: function() {
            return onlyChild(this.props.children)
        }
    });
    module.exports = StaticContainer
}),
__d("PickerIOS", ["NativeMethodsMixin", "React", "ReactChildren", "ReactNativeViewAttributes", "NativeModules", "StyleSheet", "View", "createReactNativeComponentClass", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , React = require("React")
      , ReactChildren = require("ReactChildren")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , RCTPickerIOSConsts = require("NativeModules").UIManager.RCTPicker.Constants
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , merge = require("merge")
      , PICKER = "picker"
      , PickerIOS = React.createClass({
        displayName: "PickerIOS",
        mixins: [NativeMethodsMixin],
        propTypes: {
            onValueChange: React.PropTypes.func,
            selectedValue: React.PropTypes.any
        },
        getInitialState: function() {
            return this._stateFromProps(this.props)
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState(this._stateFromProps(nextProps))
        },
        _stateFromProps: function(props) {
            var selectedIndex = 0
              , items = [];
            return ReactChildren.forEach(props.children, function(child, index) {
                child.props.value === props.selectedValue && (selectedIndex = index),
                items.push({
                    value: child.props.value,
                    label: child.props.label
                })
            }),
            {
                selectedIndex: selectedIndex,
                items: items
            }
        },
        render: function() {
            return React.createElement(View, {
                style: this.props.style
            }, React.createElement(RCTPickerIOS, {
                ref: PICKER,
                style: styles.rkPickerIOS,
                items: this.state.items,
                selectedIndex: this.state.selectedIndex,
                onChange: this._onChange
            }))
        },
        _onChange: function(event) {
            this.props.onChange && this.props.onChange(event),
            this.props.onValueChange && this.props.onValueChange(event.nativeEvent.newValue),
            this.state.selectedIndex !== event.nativeEvent.newIndex && this.refs[PICKER].setNativeProps({
                selectedIndex: this.state.selectedIndex
            })
        }
    });
    PickerIOS.Item = React.createClass({
        displayName: "Item",
        propTypes: {
            value: React.PropTypes.any,
            label: React.PropTypes.string
        },
        render: function() {
            return null 
        }
    });
    var styles = StyleSheet.create({
        rkPickerIOS: {
            height: RCTPickerIOSConsts.ComponentHeight
        }
    })
      , rkPickerIOSAttributes = merge(ReactNativeViewAttributes.UIView, {
        items: !0,
        selectedIndex: !0
    })
      , RCTPickerIOS = createReactNativeComponentClass({
        validAttributes: rkPickerIOSAttributes,
        uiViewClassName: "RCTPicker"
    });
    module.exports = PickerIOS
}),
__d("Navigator", ["NativeModules", "BackAndroid", "Dimensions", "InteractionMixin", "NavigatorBreadcrumbNavigationBar", "NavigatorInterceptor", "NavigatorNavigationBar", "NavigatorSceneConfigs", "NavigatorStaticContextContainer", "PanResponder", "Platform", "React", "StaticContainer.react", "StyleSheet", "Subscribable", "react-timer-mixin/TimerMixin", "View", "clamp", "flattenStyle", "getNavigatorContext", "invariant", "keyMirror", "merge", "rebound/rebound"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getuid() {
        return __uid++
    }
    var AnimationsDebugModule = require("NativeModules").AnimationsDebugModule
      , BackAndroid = require("BackAndroid")
      , Dimensions = require("Dimensions")
      , InteractionMixin = require("InteractionMixin")
      , NavigatorBreadcrumbNavigationBar = require("NavigatorBreadcrumbNavigationBar")
      , NavigatorInterceptor = require("NavigatorInterceptor")
      , NavigatorNavigationBar = require("NavigatorNavigationBar")
      , NavigatorSceneConfigs = require("NavigatorSceneConfigs")
      , NavigatorStaticContextContainer = require("NavigatorStaticContextContainer")
      , PanResponder = require("PanResponder")
      , Platform = require("Platform")
      , React = require("React")
      , StaticContainer = require("StaticContainer.react")
      , StyleSheet = require("StyleSheet")
      , Subscribable = require("Subscribable")
      , TimerMixin = require("react-timer-mixin/TimerMixin")
      , View = require("View")
      , clamp = require("clamp")
      , flattenStyle = require("flattenStyle")
      , getNavigatorContext = require("getNavigatorContext")
      , invariant = require("invariant")
      , rebound = (require("keyMirror"),
    require("merge"),
    require("rebound/rebound"))
      , PropTypes = React.PropTypes
      , SCREEN_WIDTH = Dimensions.get("window").width
      , SCREEN_HEIGHT = Dimensions.get("window").height
      , SCENE_DISABLED_NATIVE_PROPS = {
        style: {
            left: SCREEN_WIDTH,
            opacity: 0
        }
    }
      , __uid = 0
      , styles = StyleSheet.create({
        container: {
            flex: 1,
            overflow: "hidden"
        },
        defaultSceneStyle: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        },
        baseScene: {
            position: "absolute",
            overflow: "hidden",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        },
        disabledScene: {
            left: SCREEN_WIDTH
        },
        transitioner: {
            flex: 1,
            backgroundColor: "transparent",
            overflow: "hidden"
        }
    })
      , GESTURE_ACTIONS = ["pop", "jumpBack", "jumpForward"]
      , Navigator = React.createClass({
        displayName: "Navigator",
        propTypes: {
            configureScene: PropTypes.func,
            renderScene: PropTypes.func.isRequired,
            initialRoute: PropTypes.object,
            initialRouteStack: PropTypes.arrayOf(PropTypes.object),
            onWillFocus: PropTypes.func,
            onDidFocus: PropTypes.func,
            onItemRef: PropTypes.func,
            navigationBar: PropTypes.node,
            navigator: PropTypes.object,
            sceneStyle: View.propTypes.style
        },
        contextTypes: {},
        statics: {
            BreadcrumbNavigationBar: NavigatorBreadcrumbNavigationBar,
            NavigationBar: NavigatorNavigationBar,
            SceneConfigs: NavigatorSceneConfigs,
            Interceptor: NavigatorInterceptor,
            getContext: getNavigatorContext
        },
        mixins: [TimerMixin, InteractionMixin, Subscribable.Mixin],
        getDefaultProps: function() {
            return {
                configureScene: function() {
                    return NavigatorSceneConfigs.PushFromRight
                },
                sceneStyle: styles.defaultSceneStyle
            }
        },
        getInitialState: function() {
            var routeStack = this.props.initialRouteStack || [this.props.initialRoute];
            invariant(routeStack.length >= 1, "Navigator requires props.initialRoute or props.initialRouteStack.");
            var initialRouteIndex = routeStack.length - 1;
            return this.props.initialRoute && (initialRouteIndex = routeStack.indexOf(this.props.initialRoute),
            invariant(-1 !== initialRouteIndex, "initialRoute is not in initialRouteStack.")),
            {
                sceneConfigStack: routeStack.map(function(route) {
                    return this.props.configureScene(route)
                }
                .bind(this)),
                idStack: routeStack.map(function() {
                    return getuid()
                }),
                routeStack: routeStack,
                updatingRangeStart: 0,
                updatingRangeLength: routeStack.length,
                presentedIndex: initialRouteIndex,
                transitionFromIndex: null ,
                activeGesture: null ,
                pendingGestureProgress: null ,
                transitionQueue: []
            }
        },
        componentWillMount: function() {
            this.parentNavigator = getNavigatorContext(this) || this.props.navigator,
            this._subRouteFocus = [],
            this.navigatorContext = {
                setHandlerForRoute: this.setHandlerForRoute,
                request: this.request,
                parentNavigator: this.parentNavigator,
                getCurrentRoutes: this.getCurrentRoutes,
                pop: this.requestPop,
                popToRoute: this.requestPopTo,
                jumpBack: this.jumpBack,
                jumpForward: this.jumpForward,
                jumpTo: this.jumpTo,
                push: this.push,
                replace: this.replace,
                replaceAtIndex: this.replaceAtIndex,
                replacePrevious: this.replacePrevious,
                replacePreviousAndPop: this.replacePreviousAndPop,
                immediatelyResetRouteStack: this.immediatelyResetRouteStack,
                resetTo: this.resetTo,
                popToTop: this.popToTop
            },
            this._handlers = {},
            this.springSystem = new rebound.SpringSystem,
            this.spring = this.springSystem.createSpring(),
            this.spring.setRestSpeedThreshold(.05),
            this.spring.setCurrentValue(0).setAtRest(),
            this.spring.addListener({
                onSpringEndStateChange: function() {
                    this._interactionHandle || (this._interactionHandle = this.createInteractionHandle())
                }
                .bind(this),
                onSpringUpdate: function() {
                    this._handleSpringUpdate()
                }
                .bind(this),
                onSpringAtRest: function() {
                    this._completeTransition()
                }
                .bind(this)
            }),
            this.panGesture = PanResponder.create({
                onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
                onPanResponderGrant: this._handlePanResponderGrant,
                onPanResponderRelease: this._handlePanResponderRelease,
                onPanResponderMove: this._handlePanResponderMove,
                onPanResponderTerminate: this._handlePanResponderTerminate
            }),
            this._itemRefs = {},
            this._interactionHandle = null ,
            this._emitWillFocus(this.state.routeStack[this.state.presentedIndex])
        },
        request: function(action, arg1, arg2) {
            return this.parentNavigator ? this.parentNavigator.request.apply(null , arguments) : this._handleRequest.apply(null , arguments)
        },
        requestPop: function(popToBeforeRoute) {
            return this.request("pop", popToBeforeRoute)
        },
        requestPopTo: function(route) {
            return this.request("popTo", route)
        },
        _handleRequest: function(action, arg1, arg2) {
            var childHandler = this._handlers[this.state.presentedIndex];
            if (childHandler && childHandler(action, arg1, arg2))
                return !0;
            switch (action) {
            case "pop":
                return this._handlePop(arg1);
            case "popTo":
                return this._handlePopTo(arg1);
            case "push":
                return this._handlePush(arg1);
            default:
                return invariant(!1, "Unsupported request type " + action),
                !1
            }
        },
        _handlePop: function(popToBeforeRoute) {
            if (popToBeforeRoute) {
                var popToBeforeRouteIndex = this.state.routeStack.indexOf(popToBeforeRoute);
                return -1 === popToBeforeRouteIndex ? !1 : (invariant(popToBeforeRouteIndex <= this.state.presentedIndex, "Cannot pop past a route that is forward in the navigator"),
                this._popN(this.state.presentedIndex - popToBeforeRouteIndex + 1),
                !0)
            }
            return 0 === this.state.presentedIndex ? !1 : (this.pop(),
            !0)
        },
        _handlePopTo: function(destRoute) {
            if (destRoute) {
                var hasRoute = -1 !== this.state.routeStack.indexOf(destRoute);
                return hasRoute ? (this.popToRoute(destRoute),
                !0) : !1
            }
            return 0 === this.state.presentedIndex ? !1 : (this.pop(),
            !0)
        },
        _handlePush: function(route) {
            return this.push(route),
            !0
        },
        setHandlerForRoute: function(route, handler) {
            this._handlers[this.state.routeStack.indexOf(route)] = handler
        },
        componentDidMount: function() {
            this._handleSpringUpdate(),
            this._emitDidFocus(this.state.routeStack[this.state.presentedIndex]),
            this.parentNavigator ? this.parentNavigator.setHandler(this._handleRequest) : "android" === Platform.OS && BackAndroid.addEventListener("hardwareBackPress", this._handleAndroidBackPress)
        },
        componentWillUnmount: function() {
            this.parentNavigator ? this.parentNavigator.setHandler(null ) : "android" === Platform.OS && BackAndroid.removeEventListener("hardwareBackPress", this._handleAndroidBackPress)
        },
        _handleAndroidBackPress: function() {
            var didPop = this.requestPop();
            didPop || BackAndroid.exitApp()
        },
        immediatelyResetRouteStack: function(nextRouteStack) {
            var destIndex = nextRouteStack.length - 1;
            this.setState({
                idStack: nextRouteStack.map(getuid),
                routeStack: nextRouteStack,
                sceneConfigStack: nextRouteStack.map(this.props.configureScene),
                updatingRangeStart: 0,
                updatingRangeLength: nextRouteStack.length,
                presentedIndex: destIndex,
                activeGesture: null ,
                transitionFromIndex: null ,
                transitionQueue: []
            }, function() {
                this._handleSpringUpdate()
            }
            .bind(this))
        },
        _transitionTo: function(destIndex, velocity, jumpSpringTo, cb) {
            if (destIndex !== this.state.presentedIndex) {
                if (null  !== this.state.transitionFromIndex)
                    return void this.state.transitionQueue.push({
                        destIndex: destIndex,
                        velocity: velocity,
                        cb: cb
                    });
                this.state.transitionFromIndex = this.state.presentedIndex,
                this.state.presentedIndex = destIndex,
                this.state.transitionCb = cb,
                this._onAnimationStart(),
                AnimationsDebugModule && AnimationsDebugModule.startRecordingFps();
                var sceneConfig = this.state.sceneConfigStack[this.state.transitionFromIndex] || this.state.sceneConfigStack[this.state.presentedIndex];
                invariant(sceneConfig, "Cannot configure scene at index " + this.state.transitionFromIndex),
                null  != jumpSpringTo && this.spring.setCurrentValue(jumpSpringTo),
                this.spring.setOvershootClampingEnabled(!0),
                this.spring.getSpringConfig().friction = sceneConfig.springFriction,
                this.spring.getSpringConfig().tension = sceneConfig.springTension,
                this.spring.setVelocity(velocity || sceneConfig.defaultTransitionVelocity),
                this.spring.setEndValue(1);
                var willFocusRoute = this._subRouteFocus[this.state.presentedIndex] || this.state.routeStack[this.state.presentedIndex];
                this._emitWillFocus(willFocusRoute)
            }
        },
        _handleSpringUpdate: function() {
            null  != this.state.transitionFromIndex ? this._transitionBetween(this.state.transitionFromIndex, this.state.presentedIndex, this.spring.getCurrentValue()) : null  != this.state.activeGesture && this._transitionBetween(this.state.presentedIndex, this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture), this.spring.getCurrentValue())
        },
        _completeTransition: function() {
            if (1 !== this.spring.getCurrentValue() && 0 !== this.spring.getCurrentValue())
                return void (this.state.pendingGestureProgress && (this.state.pendingGestureProgress = null ));
            this._onAnimationEnd();
            var presentedIndex = this.state.presentedIndex
              , didFocusRoute = this._subRouteFocus[presentedIndex] || this.state.routeStack[presentedIndex];
            if (this._emitDidFocus(didFocusRoute),
            AnimationsDebugModule && AnimationsDebugModule.stopRecordingFps(Date.now()),
            this.state.transitionFromIndex = null ,
            this.spring.setCurrentValue(0).setAtRest(),
            this._hideScenes(),
            this.state.transitionCb && (this.state.transitionCb(),
            this.state.transitionCb = null ),
            this._interactionHandle && (this.clearInteractionHandle(this._interactionHandle),
            this._interactionHandle = null ),
            this.state.pendingGestureProgress) {
                var gestureToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
                return this._enableScene(gestureToIndex),
                void this.spring.setEndValue(this.state.pendingGestureProgress)
            }
            if (this.state.transitionQueue.length) {
                var queuedTransition = this.state.transitionQueue.shift();
                this._enableScene(queuedTransition.destIndex),
                this._transitionTo(queuedTransition.destIndex, queuedTransition.velocity, null , queuedTransition.cb)
            }
        },
        _emitDidFocus: function(route) {
            this._lastDidFocus !== route && (this._lastDidFocus = route,
            this.props.onDidFocus && this.props.onDidFocus(route),
            this.parentNavigator && this.parentNavigator.onDidFocus && this.parentNavigator.onDidFocus(route))
        },
        _emitWillFocus: function(route) {
            if (this._lastWillFocus !== route) {
                this._lastWillFocus = route;
                var navBar = this._navBar;
                navBar && navBar.handleWillFocus && navBar.handleWillFocus(route),
                this.props.onWillFocus && this.props.onWillFocus(route),
                this.parentNavigator && this.parentNavigator.onWillFocus && this.parentNavigator.onWillFocus(route)
            }
        },
        _hideScenes: function() {
            var gesturingToIndex = null ;
            this.state.activeGesture && (gesturingToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture));
            for (var i = 0; i < this.state.routeStack.length; i++)
                i !== this.state.presentedIndex && i !== this.state.transitionFromIndex && i !== gesturingToIndex && this._disableScene(i)
        },
        _disableScene: function(sceneIndex) {
            this.refs["scene_" + sceneIndex] && this.refs["scene_" + sceneIndex].setNativeProps(SCENE_DISABLED_NATIVE_PROPS)
        },
        _enableScene: function(sceneIndex) {
            var sceneStyle = flattenStyle(this.props.sceneStyle)
              , enabledSceneNativeProps = {
                left: sceneStyle.left
            };
            sceneIndex !== this.state.transitionFromIndex && sceneIndex !== this.state.presentedIndex && (enabledSceneNativeProps.opacity = 0),
            this.refs["scene_" + sceneIndex] && this.refs["scene_" + sceneIndex].setNativeProps(enabledSceneNativeProps)
        },
        _onAnimationStart: function() {
            var fromIndex = this.state.presentedIndex
              , toIndex = this.state.presentedIndex;
            null  != this.state.transitionFromIndex ? fromIndex = this.state.transitionFromIndex : this.state.activeGesture && (toIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture)),
            this._setRenderSceneToHarwareTextureAndroid(fromIndex, !0),
            this._setRenderSceneToHarwareTextureAndroid(toIndex, !0);
            var navBar = this._navBar;
            navBar && navBar.onAnimationStart && navBar.onAnimationStart(fromIndex, toIndex)
        },
        _onAnimationEnd: function() {
            for (var max = this.state.routeStack.length - 1, index = 0; max >= index; index++)
                this._setRenderSceneToHarwareTextureAndroid(index, !1);
            var navBar = this._navBar;
            navBar && navBar.onAnimationEnd && navBar.onAnimationEnd()
        },
        _setRenderSceneToHarwareTextureAndroid: function(sceneIndex, shouldRenderToHardwareTexture) {
            var viewAtIndex = this.refs["scene_" + sceneIndex];
            null  !== viewAtIndex && void 0 !== viewAtIndex && viewAtIndex.setNativeProps({
                renderToHardwareTextureAndroid: shouldRenderToHardwareTexture
            })
        },
        _handleTouchStart: function() {
            this._eligibleGestures = GESTURE_ACTIONS
        },
        _handleMoveShouldSetPanResponder: function(e, gestureState) {
            var sceneConfig = (this.state.routeStack[this.state.presentedIndex],
            this.state.sceneConfigStack[this.state.presentedIndex]);
            return this._expectingGestureGrant = this._matchGestureAction(this._eligibleGestures, sceneConfig.gestures, gestureState),
            !!this._expectingGestureGrant
        },
        _doesGestureOverswipe: function(gestureName) {
            var wouldOverswipeBack = this.state.presentedIndex <= 0 && ("pop" === gestureName || "jumpBack" === gestureName)
              , wouldOverswipeForward = this.state.presentedIndex >= this.state.routeStack.length - 1 && "jumpForward" === gestureName;
            return wouldOverswipeForward || wouldOverswipeBack;
        },
        _handlePanResponderGrant: function(e, gestureState) {
            invariant(this._expectingGestureGrant, "Responder granted unexpectedly."),
            this._attachGesture(this._expectingGestureGrant),
            this._onAnimationStart(),
            this._expectingGestureGrant = null 
        },
        _deltaForGestureAction: function(gestureAction) {
            switch (gestureAction) {
            case "pop":
            case "jumpBack":
                return -1;
            case "jumpForward":
                return 1;
            default:
                return void invariant(!1, "Unsupported gesture action " + gestureAction)
            }
        },
        _handlePanResponderRelease: function(e, gestureState) {
            var sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex]
              , releaseGestureAction = this.state.activeGesture;
            if (releaseGestureAction) {
                var releaseGesture = sceneConfig.gestures[releaseGestureAction]
                  , destIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
                if (0 === this.spring.getCurrentValue())
                    return this.spring.setCurrentValue(0).setAtRest(),
                    void this._completeTransition();
                var velocity, gestureDistance, isTravelVertical = "top-to-bottom" === releaseGesture.direction || "bottom-to-top" === releaseGesture.direction, isTravelInverted = "right-to-left" === releaseGesture.direction || "bottom-to-top" === releaseGesture.direction;
                isTravelVertical ? (velocity = isTravelInverted ? -gestureState.vy : gestureState.vy,
                gestureDistance = isTravelInverted ? -gestureState.dy : gestureState.dy) : (velocity = isTravelInverted ? -gestureState.vx : gestureState.vx,
                gestureDistance = isTravelInverted ? -gestureState.dx : gestureState.dx);
                var transitionVelocity = clamp(-10, velocity, 10);
                if (Math.abs(velocity) < releaseGesture.notMoving) {
                    var hasGesturedEnoughToComplete = gestureDistance > releaseGesture.fullDistance * releaseGesture.stillCompletionRatio;
                    transitionVelocity = hasGesturedEnoughToComplete ? releaseGesture.snapVelocity : -releaseGesture.snapVelocity
                }
                if (0 > transitionVelocity || this._doesGestureOverswipe(releaseGestureAction)) {
                    if (null  == this.state.transitionFromIndex) {
                        var transitionBackToPresentedIndex = this.state.presentedIndex;
                        this.state.presentedIndex = destIndex,
                        this._transitionTo(transitionBackToPresentedIndex, -transitionVelocity, 1 - this.spring.getCurrentValue())
                    }
                } else
                    this._transitionTo(destIndex, transitionVelocity);
                this._detachGesture()
            }
        },
        _handlePanResponderTerminate: function(e, gestureState) {
            var destIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
            this._detachGesture();
            var transitionBackToPresentedIndex = this.state.presentedIndex;
            this.state.presentedIndex = destIndex,
            this._transitionTo(transitionBackToPresentedIndex, null , 1 - this.spring.getCurrentValue())
        },
        _attachGesture: function(gestureId) {
            this.state.activeGesture = gestureId;
            var gesturingToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
            this._enableScene(gesturingToIndex)
        },
        _detachGesture: function() {
            this.state.activeGesture = null ,
            this.state.pendingGestureProgress = null ,
            this._hideScenes()
        },
        _handlePanResponderMove: function(e, gestureState) {
            var sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex];
            if (this.state.activeGesture) {
                var gesture = sceneConfig.gestures[this.state.activeGesture];
                return this._moveAttachedGesture(gesture, gestureState)
            }
            var matchedGesture = this._matchGestureAction(GESTURE_ACTIONS, sceneConfig.gestures, gestureState);
            matchedGesture && this._attachGesture(matchedGesture)
        },
        _moveAttachedGesture: function(gesture, gestureState) {
            var isTravelVertical = "top-to-bottom" === gesture.direction || "bottom-to-top" === gesture.direction
              , isTravelInverted = "right-to-left" === gesture.direction || "bottom-to-top" === gesture.direction
              , distance = isTravelVertical ? gestureState.dy : gestureState.dx;
            distance = isTravelInverted ? -distance : distance;
            var gestureDetectMovement = gesture.gestureDetectMovement
              , nextProgress = (distance - gestureDetectMovement) / (gesture.fullDistance - gestureDetectMovement);
            if (0 > nextProgress && gesture.isDetachable) {
                var gesturingToIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
                return this._transitionBetween(this.state.presentedIndex, gesturingToIndex, 0),
                this._detachGesture(),
                void (null  != this.state.pendingGestureProgress && this.spring.setCurrentValue(0))
            }
            if (this._doesGestureOverswipe(this.state.activeGesture)) {
                var frictionConstant = gesture.overswipe.frictionConstant
                  , frictionByDistance = gesture.overswipe.frictionByDistance
                  , frictionRatio = 1 / (frictionConstant + Math.abs(nextProgress) * frictionByDistance);
                nextProgress *= frictionRatio
            }
            nextProgress = clamp(0, nextProgress, 1),
            null  != this.state.transitionFromIndex ? this.state.pendingGestureProgress = nextProgress : this.state.pendingGestureProgress ? this.spring.setEndValue(nextProgress) : this.spring.setCurrentValue(nextProgress)
        },
        _matchGestureAction: function(eligibleGestures, gestures, gestureState) {
            if (!gestures)
                return null ;
            var matchedGesture = null ;
            return eligibleGestures.some(function(gestureName, gestureIndex) {
                var gesture = gestures[gestureName];
                if (gesture) {
                    if (null  == gesture.overswipe && this._doesGestureOverswipe(gestureName))
                        return !1;
                    var isTravelVertical = "top-to-bottom" === gesture.direction || "bottom-to-top" === gesture.direction
                      , isTravelInverted = "right-to-left" === gesture.direction || "bottom-to-top" === gesture.direction
                      , currentLoc = isTravelVertical ? gestureState.moveY : gestureState.moveX
                      , travelDist = isTravelVertical ? gestureState.dy : gestureState.dx
                      , oppositeAxisTravelDist = isTravelVertical ? gestureState.dx : gestureState.dy
                      , edgeHitWidth = gesture.edgeHitWidth;
                    isTravelInverted && (currentLoc = -currentLoc,
                    travelDist = -travelDist,
                    oppositeAxisTravelDist = -oppositeAxisTravelDist,
                    edgeHitWidth = isTravelVertical ? -(SCREEN_HEIGHT - edgeHitWidth) : -(SCREEN_WIDTH - edgeHitWidth));
                    var moveStartedInRegion = null  == gesture.edgeHitWidth || edgeHitWidth > currentLoc;
                    if (!moveStartedInRegion)
                        return !1;
                    var moveTravelledFarEnough = travelDist >= gesture.gestureDetectMovement;
                    if (!moveTravelledFarEnough)
                        return !1;
                    var directionIsCorrect = Math.abs(travelDist) > Math.abs(oppositeAxisTravelDist) * gesture.directionRatio;
                    return directionIsCorrect ? (matchedGesture = gestureName,
                    !0) : void (this._eligibleGestures = this._eligibleGestures.slice().splice(gestureIndex, 1))
                }
            }
            .bind(this)),
            matchedGesture
        },
        _transitionSceneStyle: function(fromIndex, toIndex, progress, index) {
            var viewAtIndex = this.refs["scene_" + index];
            if (null  !== viewAtIndex && void 0 !== viewAtIndex) {
                var sceneConfigIndex = toIndex > fromIndex ? toIndex : fromIndex
                  , sceneConfig = this.state.sceneConfigStack[sceneConfigIndex];
                sceneConfig || (sceneConfig = this.state.sceneConfigStack[sceneConfigIndex - 1]);
                var styleToUse = {}
                  , useFn = fromIndex > index || toIndex > index ? sceneConfig.animationInterpolators.out : sceneConfig.animationInterpolators.into
                  , directionAdjustedProgress = toIndex > fromIndex ? progress : 1 - progress
                  , didChange = useFn(styleToUse, directionAdjustedProgress);
                didChange && viewAtIndex.setNativeProps({
                    style: styleToUse
                })
            }
        },
        _transitionBetween: function(fromIndex, toIndex, progress) {
            this._transitionSceneStyle(fromIndex, toIndex, progress, fromIndex),
            this._transitionSceneStyle(fromIndex, toIndex, progress, toIndex);
            var navBar = this._navBar;
            navBar && navBar.updateProgress && navBar.updateProgress(progress, fromIndex, toIndex)
        },
        _handleResponderTerminationRequest: function() {
            return !1
        },
        _resetUpdatingRange: function() {
            this.state.updatingRangeStart = 0,
            this.state.updatingRangeLength = this.state.routeStack.length
        },
        _getDestIndexWithinBounds: function(n) {
            var currentIndex = this.state.presentedIndex
              , destIndex = currentIndex + n;
            invariant(destIndex >= 0, "Cannot jump before the first route.");
            var maxIndex = this.state.routeStack.length - 1;
            return invariant(maxIndex >= destIndex, "Cannot jump past the last route."),
            destIndex
        },
        _jumpN: function(n) {
            var destIndex = this._getDestIndexWithinBounds(n)
              , requestTransitionAndResetUpdatingRange = function() {
                this._enableScene(destIndex),
                this._transitionTo(destIndex),
                this._resetUpdatingRange()
            }
            .bind(this);
            this.setState({
                updatingRangeStart: destIndex,
                updatingRangeLength: 1
            }, requestTransitionAndResetUpdatingRange)
        },
        jumpTo: function(route) {
            var destIndex = this.state.routeStack.indexOf(route);
            invariant(-1 !== destIndex, "Cannot jump to route that is not in the route stack"),
            this._jumpN(destIndex - this.state.presentedIndex)
        },
        jumpForward: function() {
            this._jumpN(1)
        },
        jumpBack: function() {
            this._jumpN(-1)
        },
        push: function(route) {
            invariant(!!route, "Must supply route to push");
            var activeLength = this.state.presentedIndex + 1
              , activeStack = this.state.routeStack.slice(0, activeLength)
              , activeIDStack = this.state.idStack.slice(0, activeLength)
              , activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength)
              , nextStack = activeStack.concat([route])
              , destIndex = nextStack.length - 1
              , nextIDStack = activeIDStack.concat([getuid()])
              , nextAnimationConfigStack = activeAnimationConfigStack.concat([this.props.configureScene(route)])
              , requestTransitionAndResetUpdatingRange = function() {
                this._enableScene(destIndex),
                this._transitionTo(destIndex),
                this._resetUpdatingRange()
            }
            .bind(this);
            this.setState({
                idStack: nextIDStack,
                routeStack: nextStack,
                sceneConfigStack: nextAnimationConfigStack,
                updatingRangeStart: nextStack.length - 1,
                updatingRangeLength: 1
            }, requestTransitionAndResetUpdatingRange)
        },
        _popN: function(n) {
            if (0 !== n) {
                invariant(this.state.presentedIndex - n >= 0, "Cannot pop below zero");
                var popIndex = this.state.presentedIndex - n;
                this._enableScene(popIndex),
                this._transitionTo(popIndex, null , null , function() {
                    this._cleanScenesPastIndex(popIndex)
                }
                .bind(this))
            }
        },
        pop: function() {
            this._popN(1)
        },
        replaceAtIndex: function(route, index, cb) {
            if (invariant(!!route, "Must supply route to replace"),
            0 > index && (index += this.state.routeStack.length),
            !(this.state.routeStack.length <= index)) {
                var nextIDStack = this.state.idStack.slice()
                  , nextRouteStack = this.state.routeStack.slice()
                  , nextAnimationModeStack = this.state.sceneConfigStack.slice();
                nextIDStack[index] = getuid(),
                nextRouteStack[index] = route,
                nextAnimationModeStack[index] = this.props.configureScene(route),
                this.setState({
                    idStack: nextIDStack,
                    routeStack: nextRouteStack,
                    sceneConfigStack: nextAnimationModeStack,
                    updatingRangeStart: index,
                    updatingRangeLength: 1
                }, function() {
                    this._resetUpdatingRange(),
                    index === this.state.presentedIndex && (this._emitWillFocus(route),
                    this._emitDidFocus(route)),
                    cb && cb()
                }
                .bind(this))
            }
        },
        replace: function(route) {
            this.replaceAtIndex(route, this.state.presentedIndex)
        },
        replacePrevious: function(route) {
            this.replaceAtIndex(route, this.state.presentedIndex - 1)
        },
        popToTop: function() {
            this.popToRoute(this.state.routeStack[0])
        },
        _getNumToPopForRoute: function(route) {
            var indexOfRoute = this.state.routeStack.indexOf(route);
            return invariant(-1 !== indexOfRoute, "Calling pop to route for a route that doesn't exist!"),
            this.state.presentedIndex - indexOfRoute
        },
        popToRoute: function(route) {
            var numToPop = this._getNumToPopForRoute(route);
            this._popN(numToPop)
        },
        replacePreviousAndPop: function(route) {
            this.state.routeStack.length < 2 || (this.replacePrevious(route),
            this.pop())
        },
        resetTo: function(route) {
            invariant(!!route, "Must supply route to push"),
            this.replaceAtIndex(route, 0, function() {
                this.state.presentedIndex > 0 && this._popN(this.state.presentedIndex)
            }
            .bind(this))
        },
        getCurrentRoutes: function() {
            return this.state.routeStack
        },
        _handleItemRef: function(itemId, route, ref) {
            this._itemRefs[itemId] = ref;
            var itemIndex = this.state.idStack.indexOf(itemId);
            -1 !== itemIndex && this.props.onItemRef && this.props.onItemRef(ref, itemIndex, route)
        },
        _cleanScenesPastIndex: function(index) {
            var newStackLength = index + 1;
            if (newStackLength < this.state.routeStack.length) {
                var updatingRangeStart = newStackLength
                  , updatingRangeLength = this.state.routeStack.length - newStackLength + 1;
                this.state.idStack.slice(newStackLength).map(function(removingId) {
                    this._itemRefs[removingId] = null 
                }
                .bind(this)),
                this.setState({
                    updatingRangeStart: updatingRangeStart,
                    updatingRangeLength: updatingRangeLength,
                    sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
                    idStack: this.state.idStack.slice(0, newStackLength),
                    routeStack: this.state.routeStack.slice(0, newStackLength)
                }, this._resetUpdatingRange)
            }
        },
        _renderOptimizedScenes: function() {
            var shouldRenderScenes = 0 !== this.state.updatingRangeLength;
            return shouldRenderScenes ? React.createElement(StaticContainer, {
                shouldUpdate: !0
            }, React.createElement(View, React.__spread({
                style: styles.transitioner
            }, this.panGesture.panHandlers, {
                onTouchStart: this._handleTouchStart,
                onResponderTerminationRequest: this._handleResponderTerminationRequest
            }), this.state.routeStack.map(this._renderOptimizedScene))) : React.createElement(StaticContainer, {
                shouldUpdate: !1
            })
        },
        _renderOptimizedScene: function(route, i) {
            var shouldRenderScene = i >= this.state.updatingRangeStart && i <= this.state.updatingRangeStart + this.state.updatingRangeLength
              , sceneNavigatorContext = Object.assign({}, this.navigatorContext, {
                route: route,
                setHandler: function(handler) {
                    this.navigatorContext.setHandlerForRoute(route, handler)
                }
                .bind(this),
                onWillFocus: function(childRoute) {
                    this._subRouteFocus[i] = childRoute,
                    this.state.presentedIndex === i && this._emitWillFocus(childRoute)
                }
                .bind(this),
                onDidFocus: function(childRoute) {
                    this._subRouteFocus[i] = childRoute,
                    this.state.presentedIndex === i && this._emitDidFocus(childRoute)
                }
                .bind(this)
            })
              , scene = shouldRenderScene ? this._renderScene(route, i, sceneNavigatorContext) : null ;
            return React.createElement(NavigatorStaticContextContainer, {
                navigatorContext: sceneNavigatorContext,
                key: "nav" + i,
                shouldUpdate: shouldRenderScene
            }, scene)
        },
        _renderScene: function(route, i, sceneNavigatorContext) {
            var child = this.props.renderScene(route, sceneNavigatorContext)
              , disabledSceneStyle = null ;
            return i !== this.state.presentedIndex && (disabledSceneStyle = styles.disabledScene),
            React.createElement(View, {
                key: this.state.idStack[i],
                ref: "scene_" + i,
                onStartShouldSetResponderCapture: function() {
                    return i !== this.state.presentedIndex
                }
                .bind(this),
                style: [styles.baseScene, this.props.sceneStyle, disabledSceneStyle]
            }, React.cloneElement(child, {
                ref: this._handleItemRef.bind(null , this.state.idStack[i], route)
            }))
        },
        _renderNavigationBar: function() {
            return this.props.navigationBar ? React.cloneElement(this.props.navigationBar, {
                ref: function(navBar) {
                    this._navBar = navBar
                }
                .bind(this),
                navigator: this.navigatorContext,
                navState: this.state
            }) : null 
        },
        render: function() {
            return React.createElement(View, {
                style: [styles.container, this.props.style]
            }, this._renderOptimizedScenes(), this._renderNavigationBar())
        }
    });
    module.exports = Navigator
}),
__d("BackAndroid", ["warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function platformWarn() {
        warning(!1, "BackAndroid is not supported on this platform.")
    }
    var warning = require("warning")
      , BackAndroid = {
        exitApp: platformWarn,
        addEventListener: platformWarn,
        removeEventListener: platformWarn
    };
    module.exports = BackAndroid
}),
__d("InteractionMixin", ["InteractionManager"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var InteractionManager = require("InteractionManager")
      , InteractionMixin = {
        componentWillUnmount: function() {
            for (; this._interactionMixinHandles.length; )
                InteractionManager.clearInteractionHandle(this._interactionMixinHandles.pop())
        },
        _interactionMixinHandles: [],
        createInteractionHandle: function() {
            var handle = InteractionManager.createInteractionHandle();
            return this._interactionMixinHandles.push(handle),
            handle
        },
        clearInteractionHandle: function(clearHandle) {
            InteractionManager.clearInteractionHandle(clearHandle),
            this._interactionMixinHandles = this._interactionMixinHandles.filter(function(handle) {
                return handle !== clearHandle
            })
        },
        runAfterInteractions: function(callback) {
            InteractionManager.runAfterInteractions(callback)
        }
    };
    module.exports = InteractionMixin
}),
__d("NavigatorBreadcrumbNavigationBar", ["NavigatorBreadcrumbNavigationBarStyles", "NavigatorNavigationBarStyles", "React", "StaticContainer.react", "StyleSheet", "View", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NavigatorBreadcrumbNavigationBarStyles = require("NavigatorBreadcrumbNavigationBarStyles")
      , NavigatorNavigationBarStyles = require("NavigatorNavigationBarStyles")
      , React = require("React")
      , StaticContainer = require("StaticContainer.react")
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , invariant = require("invariant")
      , Interpolators = NavigatorBreadcrumbNavigationBarStyles.Interpolators
      , PropTypes = React.PropTypes
      , CRUMB_PROPS = Interpolators.map(function() {
        return {
            style: {}
        }
    })
      , ICON_PROPS = Interpolators.map(function() {
        return {
            style: {}
        }
    })
      , SEPARATOR_PROPS = Interpolators.map(function() {
        return {
            style: {}
        }
    })
      , TITLE_PROPS = Interpolators.map(function() {
        return {
            style: {}
        }
    })
      , RIGHT_BUTTON_PROPS = Interpolators.map(function() {
        return {
            style: {}
        }
    })
      , navStatePresentedIndex = function(navState) {
        return void 0 !== navState.presentedIndex ? navState.presentedIndex : navState.observedTopOfStack
    }
      , initStyle = function(index, presentedIndex) {
        return index === presentedIndex ? NavigatorBreadcrumbNavigationBarStyles.Center[index] : presentedIndex > index ? NavigatorBreadcrumbNavigationBarStyles.Left[index] : NavigatorBreadcrumbNavigationBarStyles.Right[index]
    }
      , NavigatorBreadcrumbNavigationBar = React.createClass({
        displayName: "NavigatorBreadcrumbNavigationBar",
        propTypes: {
            navigator: PropTypes.shape({
                push: PropTypes.func,
                pop: PropTypes.func,
                replace: PropTypes.func,
                popToRoute: PropTypes.func,
                popToTop: PropTypes.func
            }),
            routeMapper: PropTypes.shape({
                rightContentForRoute: PropTypes.func,
                titleContentForRoute: PropTypes.func,
                iconForRoute: PropTypes.func
            }),
            navState: React.PropTypes.shape({
                routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
                idStack: React.PropTypes.arrayOf(React.PropTypes.number),
                presentedIndex: React.PropTypes.number
            }),
            style: View.propTypes.style
        },
        statics: {
            Styles: NavigatorBreadcrumbNavigationBarStyles
        },
        _updateIndexProgress: function(progress, index, fromIndex, toIndex) {
            var interpolate, amount = toIndex > fromIndex ? progress : 1 - progress, oldDistToCenter = index - fromIndex, newDistToCenter = index - toIndex;
            invariant(Interpolators[index], "Cannot find breadcrumb interpolators for " + index),
            interpolate = oldDistToCenter > 0 && 0 === newDistToCenter || newDistToCenter > 0 && 0 === oldDistToCenter ? Interpolators[index].RightToCenter : 0 > oldDistToCenter && 0 === newDistToCenter || 0 > newDistToCenter && 0 === oldDistToCenter ? Interpolators[index].CenterToLeft : oldDistToCenter === newDistToCenter ? Interpolators[index].RightToCenter : Interpolators[index].RightToLeft,
            interpolate.Crumb(CRUMB_PROPS[index].style, amount) && this.refs["crumb_" + index].setNativeProps(CRUMB_PROPS[index]),
            interpolate.Icon(ICON_PROPS[index].style, amount) && this.refs["icon_" + index].setNativeProps(ICON_PROPS[index]),
            interpolate.Separator(SEPARATOR_PROPS[index].style, amount) && this.refs["separator_" + index].setNativeProps(SEPARATOR_PROPS[index]),
            interpolate.Title(TITLE_PROPS[index].style, amount) && this.refs["title_" + index].setNativeProps(TITLE_PROPS[index]);
            var right = this.refs["right_" + index];
            right && interpolate.RightItem(RIGHT_BUTTON_PROPS[index].style, amount) && right.setNativeProps(RIGHT_BUTTON_PROPS[index])
        },
        updateProgress: function(progress, fromIndex, toIndex) {
            for (var max = Math.max(fromIndex, toIndex), min = Math.min(fromIndex, toIndex), index = min; max >= index; index++)
                this._updateIndexProgress(progress, index, fromIndex, toIndex)
        },
        onAnimationStart: function(fromIndex, toIndex) {
            for (var max = Math.max(fromIndex, toIndex), min = Math.min(fromIndex, toIndex), index = min; max >= index; index++)
                this._setRenderViewsToHardwareTextureAndroid(index, !0)
        },
        onAnimationEnd: function() {
            for (var max = this.props.navState.routeStack.length - 1, index = 0; max >= index; index++)
                this._setRenderViewsToHardwareTextureAndroid(index, !1)
        },
        _setRenderViewsToHardwareTextureAndroid: function(index, renderToHardwareTexture) {
            var props = {
                renderToHardwareTextureAndroid: renderToHardwareTexture
            };
            this.refs["crumb_" + index].setNativeProps(props),
            this.refs["icon_" + index].setNativeProps(props),
            this.refs["separator_" + index].setNativeProps(props),
            this.refs["title_" + index].setNativeProps(props);
            var right = this.refs["right_" + index];
            right && right.setNativeProps(props)
        },
        render: function() {
            var navState = this.props.navState
              , icons = navState && navState.routeStack.map(this._renderOrReturnBreadcrumb)
              , titles = navState.routeStack.map(this._renderOrReturnTitle)
              , buttons = navState.routeStack.map(this._renderOrReturnRightButton);
            return React.createElement(View, {
                style: [styles.breadCrumbContainer, this.props.style]
            }, titles, icons, buttons)
        },
        _renderOrReturnBreadcrumb: function(route, index) {
            var uid = this.props.navState.idStack[index]
              , navBarRouteMapper = this.props.routeMapper
              , navOps = this.props.navigator
              , alreadyRendered = this.refs["crumbContainer" + uid];
            if (alreadyRendered)
                return React.createElement(StaticContainer, {
                    ref: "crumbContainer" + uid,
                    key: "crumbContainer" + uid,
                    shouldUpdate: !1
                });
            var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));
            return React.createElement(StaticContainer, {
                ref: "crumbContainer" + uid,
                key: "crumbContainer" + uid,
                shouldUpdate: !1
            }, React.createElement(View, {
                ref: "crumb_" + index,
                style: firstStyles.Crumb
            }, React.createElement(View, {
                ref: "icon_" + index,
                style: firstStyles.Icon
            }, navBarRouteMapper.iconForRoute(route, navOps)), React.createElement(View, {
                ref: "separator_" + index,
                style: firstStyles.Separator
            }, navBarRouteMapper.separatorForRoute(route, navOps))))
        },
        _renderOrReturnTitle: function(route, index) {
            var navState = this.props.navState
              , uid = navState.idStack[index]
              , alreadyRendered = this.refs["titleContainer" + uid];
            if (alreadyRendered)
                return React.createElement(StaticContainer, {
                    ref: "titleContainer" + uid,
                    key: "titleContainer" + uid,
                    shouldUpdate: !1
                });
            var navBarRouteMapper = this.props.routeMapper
              , titleContent = navBarRouteMapper.titleContentForRoute(navState.routeStack[index], this.props.navigator)
              , firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));
            return React.createElement(StaticContainer, {
                ref: "titleContainer" + uid,
                key: "titleContainer" + uid,
                shouldUpdate: !1
            }, React.createElement(View, {
                ref: "title_" + index,
                style: firstStyles.Title
            }, titleContent))
        },
        _renderOrReturnRightButton: function(route, index) {
            var navState = this.props.navState
              , navBarRouteMapper = this.props.routeMapper
              , uid = navState.idStack[index]
              , alreadyRendered = this.refs["rightContainer" + uid];
            if (alreadyRendered)
                return React.createElement(StaticContainer, {
                    ref: "rightContainer" + uid,
                    key: "rightContainer" + uid,
                    shouldUpdate: !1
                });
            var rightContent = navBarRouteMapper.rightContentForRoute(navState.routeStack[index], this.props.navigator);
            if (!rightContent)
                return null ;
            var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));
            return React.createElement(StaticContainer, {
                ref: "rightContainer" + uid,
                key: "rightContainer" + uid,
                shouldUpdate: !1
            }, React.createElement(View, {
                ref: "right_" + index,
                style: firstStyles.RightItem
            }, rightContent))
        }
    })
      , styles = StyleSheet.create({
        breadCrumbContainer: {
            overflow: "hidden",
            position: "absolute",
            height: NavigatorNavigationBarStyles.General.TotalNavHeight,
            top: 0,
            left: 0,
            right: 0
        }
    });
    module.exports = NavigatorBreadcrumbNavigationBar
}),
__d("NavigatorBreadcrumbNavigationBarStyles", ["Dimensions", "NavigatorNavigationBarStyles", "buildStyleInterpolator", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    for (var Dimensions = require("Dimensions"), NavigatorNavigationBarStyles = require("NavigatorNavigationBarStyles"), buildStyleInterpolator = require("buildStyleInterpolator"), merge = require("merge"), SCREEN_WIDTH = Dimensions.get("window").width, STATUS_BAR_HEIGHT = NavigatorNavigationBarStyles.General.StatusBarHeight, NAV_BAR_HEIGHT = NavigatorNavigationBarStyles.General.NavBarHeight, SPACING = 4, ICON_WIDTH = 40, SEPARATOR_WIDTH = 9, CRUMB_WIDTH = ICON_WIDTH + SEPARATOR_WIDTH, OPACITY_RATIO = 100, ICON_INACTIVE_OPACITY = .6, MAX_BREADCRUMBS = 10, CRUMB_BASE = {
        position: "absolute",
        flexDirection: "row",
        top: STATUS_BAR_HEIGHT,
        width: CRUMB_WIDTH,
        height: NAV_BAR_HEIGHT,
        backgroundColor: "transparent"
    }, ICON_BASE = {
        width: ICON_WIDTH,
        height: NAV_BAR_HEIGHT
    }, SEPARATOR_BASE = {
        width: SEPARATOR_WIDTH,
        height: NAV_BAR_HEIGHT
    }, TITLE_BASE = {
        position: "absolute",
        top: STATUS_BAR_HEIGHT,
        height: NAV_BAR_HEIGHT,
        backgroundColor: "transparent"
    }, FIRST_TITLE_BASE = merge(TITLE_BASE, {
        left: 0,
        right: 0,
        alignItems: "center",
        height: NAV_BAR_HEIGHT
    }), RIGHT_BUTTON_BASE = {
        position: "absolute",
        top: STATUS_BAR_HEIGHT,
        right: SPACING,
        overflow: "hidden",
        opacity: 1,
        height: NAV_BAR_HEIGHT,
        backgroundColor: "transparent"
    }, LEFT = [], CENTER = [], RIGHT = [], i = 0; MAX_BREADCRUMBS > i; i++) {
        var crumbLeft = CRUMB_WIDTH * i + SPACING;
        LEFT[i] = {
            Crumb: merge(CRUMB_BASE, {
                left: crumbLeft
            }),
            Icon: merge(ICON_BASE, {
                opacity: ICON_INACTIVE_OPACITY
            }),
            Separator: merge(SEPARATOR_BASE, {
                opacity: 1
            }),
            Title: merge(TITLE_BASE, {
                left: crumbLeft,
                opacity: 0
            }),
            RightItem: merge(RIGHT_BUTTON_BASE, {
                opacity: 0
            })
        },
        CENTER[i] = {
            Crumb: merge(CRUMB_BASE, {
                left: crumbLeft
            }),
            Icon: merge(ICON_BASE, {
                opacity: 1
            }),
            Separator: merge(SEPARATOR_BASE, {
                opacity: 0
            }),
            Title: merge(TITLE_BASE, {
                left: crumbLeft + ICON_WIDTH,
                opacity: 1
            }),
            RightItem: merge(RIGHT_BUTTON_BASE, {
                opacity: 1
            })
        };
        var crumbRight = SCREEN_WIDTH - 100;
        RIGHT[i] = {
            Crumb: merge(CRUMB_BASE, {
                left: crumbRight
            }),
            Icon: merge(ICON_BASE, {
                opacity: 0
            }),
            Separator: merge(SEPARATOR_BASE, {
                opacity: 0
            }),
            Title: merge(TITLE_BASE, {
                left: crumbRight + ICON_WIDTH,
                opacity: 0
            }),
            RightItem: merge(RIGHT_BUTTON_BASE, {
                opacity: 0
            })
        }
    }
    CENTER[0] = {
        Crumb: merge(CRUMB_BASE, {
            left: SCREEN_WIDTH / 4
        }),
        Icon: merge(ICON_BASE, {
            opacity: 0
        }),
        Separator: merge(SEPARATOR_BASE, {
            opacity: 0
        }),
        Title: merge(FIRST_TITLE_BASE, {
            opacity: 1
        }),
        RightItem: CENTER[0].RightItem
    },
    LEFT[0].Title = merge(FIRST_TITLE_BASE, {
        left: -SCREEN_WIDTH / 4,
        opacity: 0
    }),
    RIGHT[0].Title = merge(FIRST_TITLE_BASE, {
        opacity: 0
    });
    var buildIndexSceneInterpolator = function(startStyles, endStyles) {
        return {
            Crumb: buildStyleInterpolator({
                left: {
                    type: "linear",
                    from: startStyles.Crumb.left,
                    to: endStyles.Crumb.left,
                    min: 0,
                    max: 1,
                    extrapolate: !0
                }
            }),
            Icon: buildStyleInterpolator({
                opacity: {
                    type: "linear",
                    from: startStyles.Icon.opacity,
                    to: endStyles.Icon.opacity,
                    min: 0,
                    max: 1
                }
            }),
            Separator: buildStyleInterpolator({
                opacity: {
                    type: "linear",
                    from: startStyles.Separator.opacity,
                    to: endStyles.Separator.opacity,
                    min: 0,
                    max: 1
                }
            }),
            Title: buildStyleInterpolator({
                opacity: {
                    type: "linear",
                    from: startStyles.Title.opacity,
                    to: endStyles.Title.opacity,
                    min: 0,
                    max: 1
                },
                left: {
                    type: "linear",
                    from: startStyles.Title.left,
                    to: endStyles.Title.left,
                    min: 0,
                    max: 1,
                    extrapolate: !0
                }
            }),
            RightItem: buildStyleInterpolator({
                opacity: {
                    type: "linear",
                    from: startStyles.RightItem.opacity,
                    to: endStyles.RightItem.opacity,
                    min: 0,
                    max: 1,
                    round: OPACITY_RATIO
                }
            })
        }
    }
      , Interpolators = CENTER.map(function(_, ii) {
        return {
            RightToCenter: buildIndexSceneInterpolator(RIGHT[ii], CENTER[ii]),
            CenterToLeft: buildIndexSceneInterpolator(CENTER[ii], LEFT[ii]),
            RightToLeft: buildIndexSceneInterpolator(RIGHT[ii], LEFT[ii])
        }
    });
    module.exports = {
        Interpolators: Interpolators,
        Left: LEFT,
        Center: CENTER,
        Right: RIGHT,
        IconWidth: ICON_WIDTH,
        IconHeight: NAV_BAR_HEIGHT,
        SeparatorWidth: SEPARATOR_WIDTH,
        SeparatorHeight: NAV_BAR_HEIGHT
    }
}),
__d("NavigatorNavigationBarStyles", ["Dimensions", "buildStyleInterpolator", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function buildSceneInterpolators(startStyles, endStyles) {
        return {
            Title: buildStyleInterpolator({
                opacity: {
                    type: "linear",
                    from: startStyles.Title.opacity,
                    to: endStyles.Title.opacity,
                    min: 0,
                    max: 1
                },
                left: {
                    type: "linear",
                    from: startStyles.Title.left,
                    to: endStyles.Title.left,
                    min: 0,
                    max: 1,
                    extrapolate: !0
                }
            }),
            LeftButton: buildStyleInterpolator({
                opacity: {
                    type: "linear",
                    from: startStyles.LeftButton.opacity,
                    to: endStyles.LeftButton.opacity,
                    min: 0,
                    max: 1,
                    round: opacityRatio
                },
                left: {
                    type: "linear",
                    from: startStyles.LeftButton.left,
                    to: endStyles.LeftButton.left,
                    min: 0,
                    max: 1
                }
            }),
            RightButton: buildStyleInterpolator({
                opacity: {
                    type: "linear",
                    from: startStyles.RightButton.opacity,
                    to: endStyles.RightButton.opacity,
                    min: 0,
                    max: 1,
                    round: opacityRatio
                },
                left: {
                    type: "linear",
                    from: startStyles.RightButton.left,
                    to: endStyles.RightButton.left,
                    min: 0,
                    max: 1,
                    extrapolate: !0
                }
            })
        }
    }
    var Dimensions = require("Dimensions")
      , buildStyleInterpolator = require("buildStyleInterpolator")
      , merge = require("merge")
      , SCREEN_WIDTH = Dimensions.get("window").width
      , NAV_BAR_HEIGHT = 44
      , STATUS_BAR_HEIGHT = 20
      , NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT
      , BASE_STYLES = {
        Title: {
            position: "absolute",
            top: STATUS_BAR_HEIGHT,
            left: 0,
            alignItems: "center",
            width: SCREEN_WIDTH,
            height: NAV_BAR_HEIGHT,
            backgroundColor: "transparent"
        },
        LeftButton: {
            position: "absolute",
            top: STATUS_BAR_HEIGHT,
            left: 0,
            overflow: "hidden",
            opacity: 1,
            width: SCREEN_WIDTH / 3,
            height: NAV_BAR_HEIGHT,
            backgroundColor: "transparent"
        },
        RightButton: {
            position: "absolute",
            top: STATUS_BAR_HEIGHT,
            left: 2 * SCREEN_WIDTH / 3,
            overflow: "hidden",
            opacity: 1,
            alignItems: "flex-end",
            width: SCREEN_WIDTH / 3,
            height: NAV_BAR_HEIGHT,
            backgroundColor: "transparent"
        }
    }
      , Stages = {
        Left: {
            Title: merge(BASE_STYLES.Title, {
                left: -SCREEN_WIDTH / 2,
                opacity: 0
            }),
            LeftButton: merge(BASE_STYLES.LeftButton, {
                left: -SCREEN_WIDTH / 3,
                opacity: 1
            }),
            RightButton: merge(BASE_STYLES.RightButton, {
                left: SCREEN_WIDTH / 3,
                opacity: 0
            })
        },
        Center: {
            Title: merge(BASE_STYLES.Title, {
                left: 0,
                opacity: 1
            }),
            LeftButton: merge(BASE_STYLES.LeftButton, {
                left: 0,
                opacity: 1
            }),
            RightButton: merge(BASE_STYLES.RightButton, {
                left: 2 * SCREEN_WIDTH / 3 - 0,
                opacity: 1
            })
        },
        Right: {
            Title: merge(BASE_STYLES.Title, {
                left: SCREEN_WIDTH / 2,
                opacity: 0
            }),
            LeftButton: merge(BASE_STYLES.LeftButton, {
                left: 0,
                opacity: 0
            }),
            RightButton: merge(BASE_STYLES.RightButton, {
                left: SCREEN_WIDTH,
                opacity: 0
            })
        }
    }
      , opacityRatio = 100
      , Interpolators = {
        RightToCenter: buildSceneInterpolators(Stages.Right, Stages.Center),
        CenterToLeft: buildSceneInterpolators(Stages.Center, Stages.Left),
        RightToLeft: buildSceneInterpolators(Stages.Right, Stages.Left)
    };
    module.exports = {
        General: {
            NavBarHeight: NAV_BAR_HEIGHT,
            StatusBarHeight: STATUS_BAR_HEIGHT,
            TotalNavHeight: NAV_HEIGHT
        },
        Interpolators: Interpolators,
        Stages: Stages
    }
}),
__d("buildStyleInterpolator", ["keyOf"], function(global, require, requireDynamic, requireLazy, module, exports) {
    for (var keyOf = require("keyOf"), X_DIM = keyOf({
        x: null 
    }), Y_DIM = keyOf({
        y: null 
    }), Z_DIM = keyOf({
        z: null 
    }), W_DIM = keyOf({
        w: null 
    }), TRANSFORM_ROTATE_NAME = keyOf({
        transformRotateRadians: null 
    }), ShouldAllocateReusableOperationVars = {
        transformRotateRadians: !0,
        transformScale: !0,
        transformTranslate: !0
    }, InitialOperationField = {
        transformRotateRadians: [0, 0, 0, 1],
        transformTranslate: [0, 0, 0],
        transformScale: [1, 1, 1]
    }, ARGUMENT_NAMES_RE = /([^\s,]+)/g, inline = function(func, replaceWithArgs) {
        var fnStr = func.toString()
          , parameterNames = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES_RE) || []
          , replaceRegexStr = parameterNames.map(function(paramName) {
            return "\\b" + paramName + "\\b"
        }).join("|")
          , replaceRegex = new RegExp(replaceRegexStr,"g")
          , fnBody = fnStr.substring(fnStr.indexOf("{") + 1, fnStr.lastIndexOf("}") - 1)
          , newFnBody = fnBody.replace(replaceRegex, function(parameterName) {
            var indexInParameterNames = parameterNames.indexOf(parameterName)
              , replacementName = replaceWithArgs[indexInParameterNames];
            return replacementName
        });
        return newFnBody.split("\n")
    }
    , MatrixOps = {
        unroll: function(matVar, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15) {
            m0 = matVar[0],
            m1 = matVar[1],
            m2 = matVar[2],
            m3 = matVar[3],
            m4 = matVar[4],
            m5 = matVar[5],
            m6 = matVar[6],
            m7 = matVar[7],
            m8 = matVar[8],
            m9 = matVar[9],
            m10 = matVar[10],
            m11 = matVar[11],
            m12 = matVar[12],
            m13 = matVar[13],
            m14 = matVar[14],
            m15 = matVar[15]
        },
        matrixDiffers: function(retVar, matVar, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15) {
            retVar = retVar || m0 !== matVar[0] || m1 !== matVar[1] || m2 !== matVar[2] || m3 !== matVar[3] || m4 !== matVar[4] || m5 !== matVar[5] || m6 !== matVar[6] || m7 !== matVar[7] || m8 !== matVar[8] || m9 !== matVar[9] || m10 !== matVar[10] || m11 !== matVar[11] || m12 !== matVar[12] || m13 !== matVar[13] || m14 !== matVar[14] || m15 !== matVar[15]
        },
        transformScale: function(matVar, opVar) {
            var x = opVar[0]
              , y = opVar[1]
              , z = opVar[2];
            matVar[0] = matVar[0] * x,
            matVar[1] = matVar[1] * x,
            matVar[2] = matVar[2] * x,
            matVar[3] = matVar[3] * x,
            matVar[4] = matVar[4] * y,
            matVar[5] = matVar[5] * y,
            matVar[6] = matVar[6] * y,
            matVar[7] = matVar[7] * y,
            matVar[8] = matVar[8] * z,
            matVar[9] = matVar[9] * z,
            matVar[10] = matVar[10] * z,
            matVar[11] = matVar[11] * z,
            matVar[12] = matVar[12],
            matVar[13] = matVar[13],
            matVar[14] = matVar[14],
            matVar[15] = matVar[15]
        },
        transformTranslate: function(matVar, opVar) {
            var x = opVar[0]
              , y = opVar[1]
              , z = opVar[2];
            matVar[12] = matVar[0] * x + matVar[4] * y + matVar[8] * z + matVar[12],
            matVar[13] = matVar[1] * x + matVar[5] * y + matVar[9] * z + matVar[13],
            matVar[14] = matVar[2] * x + matVar[6] * y + matVar[10] * z + matVar[14],
            matVar[15] = matVar[3] * x + matVar[7] * y + matVar[11] * z + matVar[15]
        },
        transformRotateRadians: function(matVar, q) {
            var xQuat = q[0]
              , yQuat = q[1]
              , zQuat = q[2]
              , wQuat = q[3]
              , x2Quat = xQuat + xQuat
              , y2Quat = yQuat + yQuat
              , z2Quat = zQuat + zQuat
              , xxQuat = xQuat * x2Quat
              , xyQuat = xQuat * y2Quat
              , xzQuat = xQuat * z2Quat
              , yyQuat = yQuat * y2Quat
              , yzQuat = yQuat * z2Quat
              , zzQuat = zQuat * z2Quat
              , wxQuat = wQuat * x2Quat
              , wyQuat = wQuat * y2Quat
              , wzQuat = wQuat * z2Quat
              , quatMat0 = 1 - (yyQuat + zzQuat)
              , quatMat1 = xyQuat + wzQuat
              , quatMat2 = xzQuat - wyQuat
              , quatMat4 = xyQuat - wzQuat
              , quatMat5 = 1 - (xxQuat + zzQuat)
              , quatMat6 = yzQuat + wxQuat
              , quatMat8 = xzQuat + wyQuat
              , quatMat9 = yzQuat - wxQuat
              , quatMat10 = 1 - (xxQuat + yyQuat)
              , a00 = matVar[0]
              , a01 = matVar[1]
              , a02 = matVar[2]
              , a03 = matVar[3]
              , a10 = matVar[4]
              , a11 = matVar[5]
              , a12 = matVar[6]
              , a13 = matVar[7]
              , a20 = matVar[8]
              , a21 = matVar[9]
              , a22 = matVar[10]
              , a23 = matVar[11]
              , b0 = quatMat0
              , b1 = quatMat1
              , b2 = quatMat2;
            matVar[0] = b0 * a00 + b1 * a10 + b2 * a20,
            matVar[1] = b0 * a01 + b1 * a11 + b2 * a21,
            matVar[2] = b0 * a02 + b1 * a12 + b2 * a22,
            matVar[3] = b0 * a03 + b1 * a13 + b2 * a23,
            b0 = quatMat4,
            b1 = quatMat5,
            b2 = quatMat6,
            matVar[4] = b0 * a00 + b1 * a10 + b2 * a20,
            matVar[5] = b0 * a01 + b1 * a11 + b2 * a21,
            matVar[6] = b0 * a02 + b1 * a12 + b2 * a22,
            matVar[7] = b0 * a03 + b1 * a13 + b2 * a23,
            b0 = quatMat8,
            b1 = quatMat9,
            b2 = quatMat10,
            matVar[8] = b0 * a00 + b1 * a10 + b2 * a20,
            matVar[9] = b0 * a01 + b1 * a11 + b2 * a21,
            matVar[10] = b0 * a02 + b1 * a12 + b2 * a22,
            matVar[11] = b0 * a03 + b1 * a13 + b2 * a23
        }
    }, MatrixOpsInitial = {
        transformScale: function(matVar, opVar) {
            matVar[0] = opVar[0],
            matVar[1] = 0,
            matVar[2] = 0,
            matVar[3] = 0,
            matVar[4] = 0,
            matVar[5] = opVar[1],
            matVar[6] = 0,
            matVar[7] = 0,
            matVar[8] = 0,
            matVar[9] = 0,
            matVar[10] = opVar[2],
            matVar[11] = 0,
            matVar[12] = 0,
            matVar[13] = 0,
            matVar[14] = 0,
            matVar[15] = 1
        },
        transformTranslate: function(matVar, opVar) {
            matVar[0] = 1,
            matVar[1] = 0,
            matVar[2] = 0,
            matVar[3] = 0,
            matVar[4] = 0,
            matVar[5] = 1,
            matVar[6] = 0,
            matVar[7] = 0,
            matVar[8] = 0,
            matVar[9] = 0,
            matVar[10] = 1,
            matVar[11] = 0,
            matVar[12] = opVar[0],
            matVar[13] = opVar[1],
            matVar[14] = opVar[2],
            matVar[15] = 1
        },
        transformRotateRadians: function(matVar, q) {
            var xQuat = q[0]
              , yQuat = q[1]
              , zQuat = q[2]
              , wQuat = q[3]
              , x2Quat = xQuat + xQuat
              , y2Quat = yQuat + yQuat
              , z2Quat = zQuat + zQuat
              , xxQuat = xQuat * x2Quat
              , xyQuat = xQuat * y2Quat
              , xzQuat = xQuat * z2Quat
              , yyQuat = yQuat * y2Quat
              , yzQuat = yQuat * z2Quat
              , zzQuat = zQuat * z2Quat
              , wxQuat = wQuat * x2Quat
              , wyQuat = wQuat * y2Quat
              , wzQuat = wQuat * z2Quat
              , quatMat0 = 1 - (yyQuat + zzQuat)
              , quatMat1 = xyQuat + wzQuat
              , quatMat2 = xzQuat - wyQuat
              , quatMat4 = xyQuat - wzQuat
              , quatMat5 = 1 - (xxQuat + zzQuat)
              , quatMat6 = yzQuat + wxQuat
              , quatMat8 = xzQuat + wyQuat
              , quatMat9 = yzQuat - wxQuat
              , quatMat10 = 1 - (xxQuat + yyQuat)
              , b0 = quatMat0
              , b1 = quatMat1
              , b2 = quatMat2;
            matVar[0] = b0,
            matVar[1] = b1,
            matVar[2] = b2,
            matVar[3] = 0,
            b0 = quatMat4,
            b1 = quatMat5,
            b2 = quatMat6,
            matVar[4] = b0,
            matVar[5] = b1,
            matVar[6] = b2,
            matVar[7] = 0,
            b0 = quatMat8,
            b1 = quatMat9,
            b2 = quatMat10,
            matVar[8] = b0,
            matVar[9] = b1,
            matVar[10] = b2,
            matVar[11] = 0,
            matVar[12] = 0,
            matVar[13] = 0,
            matVar[14] = 0,
            matVar[15] = 1
        }
    }, setNextValAndDetectChange = function(name, tmpVarName) {
        return "  if (!didChange) {\n    var prevVal = result." + name + ";\n    result." + name + " = " + tmpVarName + ";\n    didChange = didChange  || (" + tmpVarName + " !== prevVal);\n  } else {\n    result." + name + " = " + tmpVarName + ";\n  }\n"
    }
    , computeNextValLinear = (function(anim, from, to, tmpVarName) {
        var hasRoundRatio = "round" in anim
          , roundRatio = anim.round
          , fn = "  ratio = (value - " + anim.min + ") / " + (anim.max - anim.min) + ";\n";
        anim.extrapolate || (fn += "  ratio = ratio > 1 ? 1 : (ratio < 0 ? 0 : ratio);\n");
        var roundOpen = hasRoundRatio ? "Math.round(" + roundRatio + " * " : ""
          , roundClose = hasRoundRatio ? ") / " + roundRatio : "";
        return fn += "  " + tmpVarName + " = " + roundOpen + "(" + from + " * (1 - ratio) + " + to + " * ratio)" + roundClose + ";\n"
    }
    ), computeNextValLinearScalar = function(anim) {
        return computeNextValLinear(anim, anim.from, anim.to, "nextScalarVal")
    }
    , computeNextValConstant = function(anim) {
        var constantExpression = JSON.stringify(anim.value);
        return "  nextScalarVal = " + constantExpression + ";\n"
    }
    , computeNextValStep = function(anim) {
        return "  nextScalarVal = value >= " + (anim.threshold + " ? " + anim.to + " : " + anim.from) + ";\n"
    }
    , computeNextValIdentity = function(anim) {
        return "  nextScalarVal = value;\n"
    }
    , operationVar = function(name) {
        return name + "ReuseOp"
    }
    , createReusableOperationVars = function(anims) {
        var ret = "";
        for (var name in anims)
            ShouldAllocateReusableOperationVars[name] && (ret += "var " + operationVar(name) + " = [];\n");
        return ret
    }
    , newlines = function(statements) {
        return "\n" + statements.join("\n") + "\n"
    }
    , computeNextMatrixOperationField = function(anim, name, dimension, index) {
        var fieldAccess = operationVar(name) + "[" + index + "]";
        return void 0 !== anim.from[dimension] && void 0 !== anim.to[dimension] ? "  " + anim.from[dimension] !== anim.to[dimension] ? computeNextValLinear(anim, anim.from[dimension], anim.to[dimension], fieldAccess) : fieldAccess + " = " + anim.from[dimension] + ";" : "  " + fieldAccess + " = " + InitialOperationField[name][index] + ";"
    }
    , unrolledVars = [], varIndex = 0; 16 > varIndex; varIndex++)
        unrolledVars.push("m" + varIndex);
    var setNextMatrixAndDetectChange = function(orderedMatrixOperations) {
        var fn = ["  var transformMatrix = result.transformMatrix !== undefined ? result.transformMatrix : (result.transformMatrix = []);"];
        fn.push.apply(fn, inline(MatrixOps.unroll, ["transformMatrix"].concat(unrolledVars)));
        for (var i = 0; i < orderedMatrixOperations.length; i++) {
            var opName = orderedMatrixOperations[i];
            0 === i ? fn.push.apply(fn, inline(MatrixOpsInitial[opName], ["transformMatrix", operationVar(opName)])) : fn.push.apply(fn, inline(MatrixOps[opName], ["transformMatrix", operationVar(opName)]))
        }
        return fn.push.apply(fn, inline(MatrixOps.matrixDiffers, ["didChange", "transformMatrix"].concat(unrolledVars))),
        fn
    }
      , InterpolateMatrix = {
        transformTranslate: !0,
        transformRotateRadians: !0,
        transformScale: !0
    }
      , createFunctionString = function(anims) {
        var orderedMatrixOperations = []
          , fn = "return (function() {\n";
        fn += createReusableOperationVars(anims),
        fn += "return function(result, value) {\n",
        fn += "  var didChange = false;\n",
        fn += "  var nextScalarVal;\n",
        fn += "  var ratio;\n";
        for (var name in anims) {
            var anim = anims[name];
            if ("linear" === anim.type)
                if (InterpolateMatrix[name]) {
                    orderedMatrixOperations.push(name);
                    var setOperations = [computeNextMatrixOperationField(anim, name, X_DIM, 0), computeNextMatrixOperationField(anim, name, Y_DIM, 1), computeNextMatrixOperationField(anim, name, Z_DIM, 2)];
                    name === TRANSFORM_ROTATE_NAME && setOperations.push(computeNextMatrixOperationField(anim, name, W_DIM, 3)),
                    fn += newlines(setOperations)
                } else
                    fn += computeNextValLinearScalar(anim, "nextScalarVal"),
                    fn += setNextValAndDetectChange(name, "nextScalarVal");
            else
                "constant" === anim.type ? (fn += computeNextValConstant(anim),
                fn += setNextValAndDetectChange(name, "nextScalarVal")) : "step" === anim.type ? (fn += computeNextValStep(anim),
                fn += setNextValAndDetectChange(name, "nextScalarVal")) : "identity" === anim.type && (fn += computeNextValIdentity(anim),
                fn += setNextValAndDetectChange(name, "nextScalarVal"))
        }
        return orderedMatrixOperations.length && (fn += newlines(setNextMatrixAndDetectChange(orderedMatrixOperations))),
        fn += "  return didChange;\n",
        fn += "};\n",
        fn += "})()"
    }
      , buildStyleInterpolator = function(anims) {
        return Function(createFunctionString(anims))()
    }
    ;
    module.exports = buildStyleInterpolator
}),
__d("NavigatorInterceptor", ["React", "getNavigatorContext"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var React = require("React")
      , getNavigatorContext = require("getNavigatorContext")
      , NavigatorInterceptor = React.createClass({
        displayName: "NavigatorInterceptor",
        contextTypes: {
            navigator: React.PropTypes.object
        },
        componentWillMount: function() {
            this.navigator = getNavigatorContext(this)
        },
        componentDidMount: function() {
            this.navigator.setHandler(this._navigatorHandleRequest)
        },
        childContextTypes: {
            navigator: React.PropTypes.object
        },
        getChildContext: function() {
            return {
                navigator: Object.assign({}, this.navigator, {
                    setHandler: function(handler) {
                        this._childNavigationHandler = handler
                    }
                    .bind(this)
                })
            }
        },
        componentWillUnmount: function() {
            this.navigator.setHandler(null )
        },
        _navigatorHandleRequest: function(action, arg1, arg2) {
            return this._interceptorHandle(action, arg1, arg2) ? !0 : this._childNavigationHandler && this._childNavigationHandler(action, arg1, arg2) ? !0 : void 0
        },
        _interceptorHandle: function(action, arg1, arg2) {
            if (this.props.onRequest && this.props.onRequest(action, arg1, arg2))
                return !0;
            switch (action) {
            case "pop":
                return this.props.onPopRequest && this.props.onPopRequest(arg1, arg2);
            case "popTo":
                return this.props.onPopToRequest && this.props.onPopToRequest(arg1, arg2);
            case "push":
                return this.props.onPushRequest && this.props.onPushRequest(arg1, arg2);
            default:
                return !1
            }
        },
        render: function() {
            return this.props.children
        }
    });
    module.exports = NavigatorInterceptor
}),
__d("getNavigatorContext", ["ReactInstanceMap"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getNavigatorContext(el) {
        return ReactInstanceMap.get(el)._context.navigator
    }
    var ReactInstanceMap = require("ReactInstanceMap");
    module.exports = getNavigatorContext
}),
__d("NavigatorNavigationBar", ["React", "NavigatorNavigationBarStyles", "StaticContainer.react", "StyleSheet", "View"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var React = require("React")
      , NavigatorNavigationBarStyles = require("NavigatorNavigationBarStyles")
      , StaticContainer = require("StaticContainer.react")
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , COMPONENT_NAMES = ["Title", "LeftButton", "RightButton"]
      , navStatePresentedIndex = function(navState) {
        return void 0 !== navState.presentedIndex ? navState.presentedIndex : navState.observedTopOfStack
    }
      , NavigatorNavigationBar = React.createClass({
        displayName: "NavigatorNavigationBar",
        propTypes: {
            navigator: React.PropTypes.object,
            routeMapper: React.PropTypes.shape({
                Title: React.PropTypes.func.isRequired,
                LeftButton: React.PropTypes.func.isRequired,
                RightButton: React.PropTypes.func.isRequired
            }),
            navState: React.PropTypes.shape({
                routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
                idStack: React.PropTypes.arrayOf(React.PropTypes.number),
                presentedIndex: React.PropTypes.number
            }),
            style: View.propTypes.style
        },
        statics: {
            Styles: NavigatorNavigationBarStyles
        },
        _getReusableProps: function(componentName, index) {
            this._reusableProps || (this._reusableProps = {});
            var propStack = this._reusableProps[componentName];
            propStack || (propStack = this._reusableProps[componentName] = []);
            var props = propStack[index];
            return props || (props = propStack[index] = {
                style: {}
            }),
            props
        },
        _updateIndexProgress: function(progress, index, fromIndex, toIndex) {
            var interpolate, amount = toIndex > fromIndex ? progress : 1 - progress, oldDistToCenter = index - fromIndex, newDistToCenter = index - toIndex;
            interpolate = oldDistToCenter > 0 && 0 === newDistToCenter || newDistToCenter > 0 && 0 === oldDistToCenter ? NavigatorNavigationBarStyles.Interpolators.RightToCenter : 0 > oldDistToCenter && 0 === newDistToCenter || 0 > newDistToCenter && 0 === oldDistToCenter ? NavigatorNavigationBarStyles.Interpolators.CenterToLeft : oldDistToCenter === newDistToCenter ? NavigatorNavigationBarStyles.Interpolators.RightToCenter : NavigatorNavigationBarStyles.Interpolators.RightToLeft,
            COMPONENT_NAMES.forEach(function(componentName) {
                var component = this.refs[componentName + index]
                  , props = this._getReusableProps(componentName, index);
                component && interpolate[componentName](props.style, amount) && component.setNativeProps(props)
            }, this)
        },
        updateProgress: function(progress, fromIndex, toIndex) {
            for (var max = Math.max(fromIndex, toIndex), min = Math.min(fromIndex, toIndex), index = min; max >= index; index++)
                this._updateIndexProgress(progress, index, fromIndex, toIndex)
        },
        render: function() {
            var navState = this.props.navState
              , components = COMPONENT_NAMES.map(function(componentName) {
                return navState.routeStack.map(this._renderOrReturnComponent.bind(this, componentName))
            }, this);
            return React.createElement(View, {
                style: [styles.navBarContainer, this.props.style]
            }, components)
        },
        _renderOrReturnComponent: function(componentName, route, index) {
            var navState = this.props.navState
              , uid = navState.idStack[index]
              , containerRef = componentName + "Container" + uid
              , alreadyRendered = this.refs[containerRef];
            if (alreadyRendered)
                return React.createElement(StaticContainer, {
                    ref: containerRef,
                    key: containerRef,
                    shouldUpdate: !1
                });
            var content = this.props.routeMapper[componentName](navState.routeStack[index], this.props.navigator, index, this.props.navState);
            if (!content)
                return null ;
            var initialStage = index === navStatePresentedIndex(this.props.navState) ? NavigatorNavigationBarStyles.Stages.Center : NavigatorNavigationBarStyles.Stages.Left;
            return React.createElement(StaticContainer, {
                ref: containerRef,
                key: containerRef,
                shouldUpdate: !1
            }, React.createElement(View, {
                ref: componentName + index,
                style: initialStage[componentName]
            }, content))
        }
    })
      , styles = StyleSheet.create({
        navBarContainer: {
            position: "absolute",
            height: NavigatorNavigationBarStyles.General.TotalNavHeight,
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "transparent"
        }
    });
    module.exports = NavigatorNavigationBar
}),
__d("NavigatorSceneConfigs", ["Dimensions", "PixelRatio", "buildStyleInterpolator"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var Dimensions = require("Dimensions")
      , PixelRatio = require("PixelRatio")
      , buildStyleInterpolator = require("buildStyleInterpolator")
      , SCREEN_WIDTH = Dimensions.get("window").width
      , SCREEN_HEIGHT = Dimensions.get("window").height
      , FadeToTheLeft = {
        transformTranslate: {
            from: {
                x: 0,
                y: 0,
                z: 0
            },
            to: {
                x: -Math.round(.3 * Dimensions.get("window").width),
                y: 0,
                z: 0
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        transformScale: {
            from: {
                x: 1,
                y: 1,
                z: 1
            },
            to: {
                x: .95,
                y: .95,
                z: 1
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0
        },
        opacity: {
            from: 1,
            to: .3,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !1,
            round: 100
        },
        translateX: {
            from: 0,
            to: -Math.round(.3 * Dimensions.get("window").width),
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        scaleX: {
            from: 1,
            to: .95,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0
        },
        scaleY: {
            from: 1,
            to: .95,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0
        }
    }
      , FadeToTheRight = Object.assign({}, FadeToTheLeft, {
        transformTranslate: {
            from: {
                x: 0,
                y: 0,
                z: 0
            },
            to: {
                x: Math.round(.3 * SCREEN_WIDTH),
                y: 0,
                z: 0
            }
        },
        translateX: {
            from: 0,
            to: Math.round(.3 * SCREEN_WIDTH)
        }
    })
      , FadeIn = {
        opacity: {
            from: 0,
            to: 1,
            min: .5,
            max: 1,
            type: "linear",
            extrapolate: !1,
            round: 100
        }
    }
      , FadeOut = {
        opacity: {
            from: 1,
            to: 0,
            min: 0,
            max: .5,
            type: "linear",
            extrapolate: !1,
            round: 100
        }
    }
      , ToTheLeft = {
        transformTranslate: {
            from: {
                x: 0,
                y: 0,
                z: 0
            },
            to: {
                x: -Dimensions.get("window").width,
                y: 0,
                z: 0
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        opacity: {
            value: 1,
            type: "constant"
        },
        translateX: {
            from: 0,
            to: -Dimensions.get("window").width,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        }
    }
      , FromTheRight = {
        opacity: {
            value: 1,
            type: "constant"
        },
        transformTranslate: {
            from: {
                x: Dimensions.get("window").width,
                y: 0,
                z: 0
            },
            to: {
                x: 0,
                y: 0,
                z: 0
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        translateX: {
            from: Dimensions.get("window").width,
            to: 0,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        scaleX: {
            value: 1,
            type: "constant"
        },
        scaleY: {
            value: 1,
            type: "constant"
        }
    }
      , FromTheLeft = Object.assign({}, FromTheRight, {
        transformTranslate: {
            from: {
                x: -SCREEN_WIDTH,
                y: 0,
                z: 0
            },
            to: {
                x: 0,
                y: 0,
                z: 0
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        translateX: {
            from: -SCREEN_WIDTH,
            to: 0,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        }
    })
      , ToTheBack = {
        transformTranslate: {
            from: {
                x: 0,
                y: 0,
                z: 0
            },
            to: {
                x: 0,
                y: 0,
                z: 0
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        transformScale: {
            from: {
                x: 1,
                y: 1,
                z: 1
            },
            to: {
                x: .95,
                y: .95,
                z: 1
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0
        },
        opacity: {
            from: 1,
            to: .3,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !1,
            round: 100
        },
        scaleX: {
            from: 1,
            to: .95,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0
        },
        scaleY: {
            from: 1,
            to: .95,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0
        }
    }
      , FromTheFront = {
        opacity: {
            value: 1,
            type: "constant"
        },
        transformTranslate: {
            from: {
                x: 0,
                y: Dimensions.get("window").height,
                z: 0
            },
            to: {
                x: 0,
                y: 0,
                z: 0
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        translateY: {
            from: Dimensions.get("window").height,
            to: 0,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        scaleX: {
            value: 1,
            type: "constant"
        },
        scaleY: {
            value: 1,
            type: "constant"
        }
    }
      , ToTheBackAndroid = {
        opacity: {
            value: 1,
            type: "constant"
        }
    }
      , FromTheFrontAndroid = {
        opacity: {
            from: 0,
            to: 1,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !1,
            round: 100
        },
        transformTranslate: {
            from: {
                x: 0,
                y: 50,
                z: 0
            },
            to: {
                x: 0,
                y: 0,
                z: 0
            },
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        },
        translateY: {
            from: 50,
            to: 0,
            min: 0,
            max: 1,
            type: "linear",
            extrapolate: !0,
            round: PixelRatio.get()
        }
    }
      , BaseOverswipeConfig = {
        frictionConstant: 1,
        frictionByDistance: 1.5
    }
      , BaseLeftToRightGesture = {
        isDetachable: !1,
        gestureDetectMovement: 2,
        notMoving: .3,
        directionRatio: .66,
        snapVelocity: 2,
        edgeHitWidth: 30,
        stillCompletionRatio: .6,
        fullDistance: SCREEN_WIDTH,
        direction: "left-to-right"
    }
      , BaseRightToLeftGesture = Object.assign({}, BaseLeftToRightGesture, {
        direction: "right-to-left"
    })
      , BaseConfig = {
        gestures: {
            pop: BaseLeftToRightGesture
        },
        springFriction: 26,
        springTension: 200,
        defaultTransitionVelocity: 1.5,
        animationInterpolators: {
            into: buildStyleInterpolator(FromTheRight),
            out: buildStyleInterpolator(FadeToTheLeft)
        }
    }
      , NavigatorSceneConfigs = {
        PushFromRight: Object.assign({}, BaseConfig),
        FloatFromRight: Object.assign({}, BaseConfig),
        FloatFromLeft: Object.assign({}, BaseConfig, {
            animationInterpolators: {
                into: buildStyleInterpolator(FromTheLeft),
                out: buildStyleInterpolator(FadeToTheRight)
            }
        }),
        FloatFromBottom: Object.assign({}, BaseConfig, {
            gestures: {
                pop: Object.assign({}, BaseLeftToRightGesture, {
                    edgeHitWidth: 150,
                    direction: "top-to-bottom",
                    fullDistance: SCREEN_HEIGHT
                })
            },
            animationInterpolators: {
                into: buildStyleInterpolator(FromTheFront),
                out: buildStyleInterpolator(ToTheBack)
            }
        }),
        FloatFromBottomAndroid: Object.assign({}, BaseConfig, {
            gestures: null ,
            animationInterpolators: {
                into: buildStyleInterpolator(FromTheFrontAndroid),
                out: buildStyleInterpolator(ToTheBackAndroid)
            }
        }),
        FadeAndroid: Object.assign({}, BaseConfig, {
            gestures: null ,
            animationInterpolators: {
                into: buildStyleInterpolator(FadeIn),
                out: buildStyleInterpolator(FadeOut)
            }
        }),
        HorizontalSwipeJump: Object.assign({}, BaseConfig, {
            gestures: {
                jumpBack: Object.assign({}, BaseLeftToRightGesture, {
                    overswipe: BaseOverswipeConfig,
                    edgeHitWidth: null ,
                    isDetachable: !0
                }),
                jumpForward: Object.assign({}, BaseRightToLeftGesture, {
                    overswipe: BaseOverswipeConfig,
                    edgeHitWidth: null ,
                    isDetachable: !0
                })
            },
            animationInterpolators: {
                into: buildStyleInterpolator(FromTheRight),
                out: buildStyleInterpolator(ToTheLeft)
            }
        })
    };
    module.exports = NavigatorSceneConfigs
}),
__d("NavigatorStaticContextContainer", ["React", "StaticContainer.react"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var React = require("React")
      , StaticContainer = require("StaticContainer.react")
      , PropTypes = React.PropTypes
      , NavigatorStaticContextContainer = React.createClass({
        displayName: "NavigatorStaticContextContainer",
        childContextTypes: {
            navigator: PropTypes.object
        },
        getChildContext: function() {
            return {
                navigator: this.props.navigatorContext
            }
        },
        render: function() {
            return React.createElement(StaticContainer, React.__spread({}, this.props))
        }
    });
    module.exports = NavigatorStaticContextContainer
}),
__d("PanResponder", ["TouchHistoryMath"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var TouchHistoryMath = require("TouchHistoryMath")
      , currentCentroidXOfTouchesChangedAfter = TouchHistoryMath.currentCentroidXOfTouchesChangedAfter
      , currentCentroidYOfTouchesChangedAfter = TouchHistoryMath.currentCentroidYOfTouchesChangedAfter
      , previousCentroidXOfTouchesChangedAfter = TouchHistoryMath.previousCentroidXOfTouchesChangedAfter
      , previousCentroidYOfTouchesChangedAfter = TouchHistoryMath.previousCentroidYOfTouchesChangedAfter
      , currentCentroidX = TouchHistoryMath.currentCentroidX
      , currentCentroidY = TouchHistoryMath.currentCentroidY
      , PanResponder = {
        _initializeGestureState: function(gestureState) {
            gestureState.moveX = 0,
            gestureState.moveY = 0,
            gestureState.x0 = 0,
            gestureState.y0 = 0,
            gestureState.dx = 0,
            gestureState.dy = 0,
            gestureState.vx = 0,
            gestureState.vy = 0,
            gestureState.numberActiveTouches = 0,
            gestureState._accountsForMovesUpTo = 0
        },
        _updateGestureStateOnMove: function(gestureState, touchHistory) {
            gestureState.numberActiveTouches = touchHistory.numberActiveTouches,
            gestureState.moveX = currentCentroidXOfTouchesChangedAfter(touchHistory, gestureState._accountsForMovesUpTo),
            gestureState.moveY = currentCentroidYOfTouchesChangedAfter(touchHistory, gestureState._accountsForMovesUpTo);
            var movedAfter = gestureState._accountsForMovesUpTo
              , prevX = previousCentroidXOfTouchesChangedAfter(touchHistory, movedAfter)
              , x = currentCentroidXOfTouchesChangedAfter(touchHistory, movedAfter)
              , prevY = previousCentroidYOfTouchesChangedAfter(touchHistory, movedAfter)
              , y = currentCentroidYOfTouchesChangedAfter(touchHistory, movedAfter)
              , nextDX = gestureState.dx + (x - prevX)
              , nextDY = gestureState.dy + (y - prevY)
              , dt = touchHistory.mostRecentTimeStamp - gestureState._accountsForMovesUpTo;
            gestureState.vx = (nextDX - gestureState.dx) / dt,
            gestureState.vy = (nextDY - gestureState.dy) / dt,
            gestureState.dx = nextDX,
            gestureState.dy = nextDY,
            gestureState._accountsForMovesUpTo = touchHistory.mostRecentTimeStamp
        },
        create: function(config) {
            var gestureState = {
                stateID: Math.random()
            };
            PanResponder._initializeGestureState(gestureState);
            var panHandlers = {
                onStartShouldSetResponder: function(e) {
                    return void 0 === config.onStartShouldSetPanResponder ? !1 : config.onStartShouldSetPanResponder(e, gestureState)
                },
                onMoveShouldSetResponder: function(e) {
                    return void 0 === config.onMoveShouldSetPanResponder ? !1 : config.onMoveShouldSetPanResponder(e, gestureState)
                },
                onStartShouldSetResponderCapture: function(e) {
                    return 1 === e.nativeEvent.touches.length && PanResponder._initializeGestureState(gestureState),
                    gestureState.numberActiveTouches = e.touchHistory.numberActiveTouches,
                    void 0 !== config.onStartShouldSetPanResponderCapture ? config.onStartShouldSetPanResponderCapture(e, gestureState) : !1
                },
                onMoveShouldSetResponderCapture: function(e) {
                    var touchHistory = e.touchHistory;
                    return gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp ? !1 : (PanResponder._updateGestureStateOnMove(gestureState, touchHistory),
                    config.onMoveShouldSetResponderCapture ? config.onMoveShouldSetPanResponderCapture(e, gestureState) : !1)
                },
                onResponderGrant: function(e) {
                    gestureState.x0 = currentCentroidX(e.touchHistory),
                    gestureState.y0 = currentCentroidY(e.touchHistory),
                    gestureState.dx = 0,
                    gestureState.dy = 0,
                    config.onPanResponderGrant && config.onPanResponderGrant(e, gestureState)
                },
                onResponderReject: function(e) {
                    config.onPanResponderReject && config.onPanResponderReject(e, gestureState)
                },
                onResponderRelease: function(e) {
                    config.onPanResponderRelease && config.onPanResponderRelease(e, gestureState),
                    PanResponder._initializeGestureState(gestureState)
                },
                onResponderStart: function(e) {
                    var touchHistory = e.touchHistory;
                    gestureState.numberActiveTouches = touchHistory.numberActiveTouches,
                    config.onPanResponderStart && config.onPanResponderStart(e, gestureState)
                },
                onResponderMove: function(e) {
                    var touchHistory = e.touchHistory;
                    gestureState._accountsForMovesUpTo !== touchHistory.mostRecentTimeStamp && (PanResponder._updateGestureStateOnMove(gestureState, touchHistory),
                    config.onPanResponderMove && config.onPanResponderMove(e, gestureState))
                },
                onResponderEnd: function(e) {
                    var touchHistory = e.touchHistory;
                    gestureState.numberActiveTouches = touchHistory.numberActiveTouches,
                    config.onPanResponderEnd && config.onPanResponderEnd(e, gestureState)
                },
                onResponderTerminate: function(e) {
                    config.onPanResponderTerminate && config.onPanResponderTerminate(e, gestureState),
                    PanResponder._initializeGestureState(gestureState)
                },
                onResponderTerminationRequest: function(e) {
                    return void 0 === config.onPanResponderTerminationRequest ? !0 : config.onPanResponderTerminationRequest(e, gestureState)
                }
            };
            return {
                panHandlers: panHandlers
            }
        }
    };
    module.exports = PanResponder
}),
__d("TouchHistoryMath", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var TouchHistoryMath = {
        centroidDimension: function(touchHistory, touchesChangedAfter, isXAxis, ofCurrent) {
            var touchBank = touchHistory.touchBank
              , total = 0
              , count = 0
              , oneTouchData = 1 === touchHistory.numberActiveTouches ? touchHistory.touchBank[touchHistory.indexOfSingleActiveTouch] : null ;
            if (null  !== oneTouchData)
                oneTouchData.touchActive && oneTouchData.currentTimeStamp > touchesChangedAfter && (total += ofCurrent && isXAxis ? oneTouchData.currentPageX : ofCurrent && !isXAxis ? oneTouchData.currentPageY : !ofCurrent && isXAxis ? oneTouchData.previousPageX : oneTouchData.previousPageY,
                count = 1);
            else
                for (var i = 0; i < touchBank.length; i++) {
                    var touchTrack = touchBank[i];
                    if (null  !== touchTrack && void 0 !== touchTrack && touchTrack.touchActive && touchTrack.currentTimeStamp >= touchesChangedAfter) {
                        var toAdd;
                        toAdd = ofCurrent && isXAxis ? touchTrack.currentPageX : ofCurrent && !isXAxis ? touchTrack.currentPageY : !ofCurrent && isXAxis ? touchTrack.previousPageX : touchTrack.previousPageY,
                        total += toAdd,
                        count++
                    }
                }
            return count > 0 ? total / count : TouchHistoryMath.noCentroid
        },
        currentCentroidXOfTouchesChangedAfter: function(touchHistory, touchesChangedAfter) {
            return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, !0, !0)
        },
        currentCentroidYOfTouchesChangedAfter: function(touchHistory, touchesChangedAfter) {
            return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, !1, !0)
        },
        previousCentroidXOfTouchesChangedAfter: function(touchHistory, touchesChangedAfter) {
            return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, !0, !1)
        },
        previousCentroidYOfTouchesChangedAfter: function(touchHistory, touchesChangedAfter) {
            return TouchHistoryMath.centroidDimension(touchHistory, touchesChangedAfter, !1, !1)
        },
        currentCentroidX: function(touchHistory) {
            return TouchHistoryMath.centroidDimension(touchHistory, 0, !0, !0)
        },
        currentCentroidY: function(touchHistory) {
            return TouchHistoryMath.centroidDimension(touchHistory, 0, !1, !0)
        },
        noCentroid: -1
    };
    module.exports = TouchHistoryMath
}),
__d("clamp", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function clamp(min, value, max) {
        return min > value ? min : value > max ? max : value
    }
    module.exports = clamp
}),
__d("rebound/rebound", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    !function() {
        function removeFirst(array, item) {
            var idx = array.indexOf(item);
            -1 != idx && array.splice(idx, 1)
        }
        var rebound = {}
          , util = rebound.util = {}
          , concat = Array.prototype.concat
          , slice = Array.prototype.slice;
        util.bind = function(func, context) {
            var args = slice.call(arguments, 2);
            return function() {
                func.apply(context, concat.call(args, slice.call(arguments)))
            }
        }
        ,
        util.extend = function(target, source) {
            for (var key in source)
                source.hasOwnProperty(key) && (target[key] = source[key])
        }
        ;
        var SpringSystem = rebound.SpringSystem = function(looper) {
            this._springRegistry = {},
            this._activeSprings = [],
            this.listeners = [],
            this._idleSpringIndices = [],
            this.looper = looper || new AnimationLooper,
            this.looper.springSystem = this
        }
        ;
        util.extend(SpringSystem.prototype, {
            _springRegistry: null ,
            _isIdle: !0,
            _lastTimeMillis: -1,
            _activeSprings: null ,
            listeners: null ,
            _idleSpringIndices: null ,
            setLooper: function(looper) {
                this.looper = looper,
                looper.springSystem = this
            },
            createSpring: function(tension, friction) {
                var springConfig;
                return springConfig = void 0 === tension || void 0 === friction ? SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG : SpringConfig.fromOrigamiTensionAndFriction(tension, friction),
                this.createSpringWithConfig(springConfig)
            },
            createSpringWithBouncinessAndSpeed: function(bounciness, speed) {
                var springConfig;
                return springConfig = void 0 === bounciness || void 0 === speed ? SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG : SpringConfig.fromBouncinessAndSpeed(bounciness, speed),
                this.createSpringWithConfig(springConfig)
            },
            createSpringWithConfig: function(springConfig) {
                var spring = new Spring(this);
                return this.registerSpring(spring),
                spring.setSpringConfig(springConfig),
                spring
            },
            getIsIdle: function() {
                return this._isIdle
            },
            getSpringById: function(id) {
                return this._springRegistry[id]
            },
            getAllSprings: function() {
                var vals = [];
                for (var id in this._springRegistry)
                    this._springRegistry.hasOwnProperty(id) && vals.push(this._springRegistry[id]);
                return vals
            },
            registerSpring: function(spring) {
                this._springRegistry[spring.getId()] = spring
            },
            deregisterSpring: function(spring) {
                removeFirst(this._activeSprings, spring),
                delete this._springRegistry[spring.getId()]
            },
            advance: function(time, deltaTime) {
                for (; this._idleSpringIndices.length > 0; )
                    this._idleSpringIndices.pop();
                for (var i = 0, len = this._activeSprings.length; len > i; i++) {
                    var spring = this._activeSprings[i];
                    spring.systemShouldAdvance() ? spring.advance(time / 1e3, deltaTime / 1e3) : this._idleSpringIndices.push(this._activeSprings.indexOf(spring))
                }
                for (; this._idleSpringIndices.length > 0; ) {
                    var idx = this._idleSpringIndices.pop();
                    idx >= 0 && this._activeSprings.splice(idx, 1)
                }
            },
            loop: function(currentTimeMillis) {
                var listener;
                -1 === this._lastTimeMillis && (this._lastTimeMillis = currentTimeMillis - 1);
                var ellapsedMillis = currentTimeMillis - this._lastTimeMillis;
                this._lastTimeMillis = currentTimeMillis;
                var i = 0
                  , len = this.listeners.length;
                for (i = 0; len > i; i++)
                    listener = this.listeners[i],
                    listener.onBeforeIntegrate && listener.onBeforeIntegrate(this);
                for (this.advance(currentTimeMillis, ellapsedMillis),
                0 === this._activeSprings.length && (this._isIdle = !0,
                this._lastTimeMillis = -1),
                i = 0; len > i; i++)
                    listener = this.listeners[i],
                    listener.onAfterIntegrate && listener.onAfterIntegrate(this);
                this._isIdle || this.looper.run()
            },
            activateSpring: function(springId) {
                var spring = this._springRegistry[springId];
                -1 == this._activeSprings.indexOf(spring) && this._activeSprings.push(spring),
                this.getIsIdle() && (this._isIdle = !1,
                this.looper.run())
            },
            addListener: function(listener) {
                this.listeners.push(listener)
            },
            removeListener: function(listener) {
                removeFirst(this.listeners, listener)
            },
            removeAllListeners: function() {
                this.listeners = []
            }
        });
        var Spring = rebound.Spring = function Spring(springSystem) {
            this._id = "s" + Spring._ID++,
            this._springSystem = springSystem,
            this.listeners = [],
            this._currentState = new PhysicsState,
            this._previousState = new PhysicsState,
            this._tempState = new PhysicsState
        }
        ;
        util.extend(Spring, {
            _ID: 0,
            MAX_DELTA_TIME_SEC: .064,
            SOLVER_TIMESTEP_SEC: .001
        }),
        util.extend(Spring.prototype, {
            _id: 0,
            _springConfig: null ,
            _overshootClampingEnabled: !1,
            _currentState: null ,
            _previousState: null ,
            _tempState: null ,
            _startValue: 0,
            _endValue: 0,
            _wasAtRest: !0,
            _restSpeedThreshold: .001,
            _displacementFromRestThreshold: .001,
            listeners: null ,
            _timeAccumulator: 0,
            _springSystem: null ,
            destroy: function() {
                this.listeners = [],
                this.frames = [],
                this._springSystem.deregisterSpring(this)
            },
            getId: function() {
                return this._id
            },
            setSpringConfig: function(springConfig) {
                return this._springConfig = springConfig,
                this
            },
            getSpringConfig: function() {
                return this._springConfig
            },
            setCurrentValue: function(currentValue, skipSetAtRest) {
                return this._startValue = currentValue,
                this._currentState.position = currentValue,
                skipSetAtRest || this.setAtRest(),
                this.notifyPositionUpdated(!1, !1),
                this
            },
            getStartValue: function() {
                return this._startValue
            },
            getCurrentValue: function() {
                return this._currentState.position
            },
            getCurrentDisplacementDistance: function() {
                return this.getDisplacementDistanceForState(this._currentState)
            },
            getDisplacementDistanceForState: function(state) {
                return Math.abs(this._endValue - state.position)
            },
            setEndValue: function(endValue) {
                if (this._endValue == endValue && this.isAtRest())
                    return this;
                this._startValue = this.getCurrentValue(),
                this._endValue = endValue,
                this._springSystem.activateSpring(this.getId());
                for (var i = 0, len = this.listeners.length; len > i; i++) {
                    var listener = this.listeners[i]
                      , onChange = listener.onSpringEndStateChange;
                    onChange && onChange(this)
                }
                return this
            },
            getEndValue: function() {
                return this._endValue
            },
            setVelocity: function(velocity) {
                return velocity === this._currentState.velocity ? this : (this._currentState.velocity = velocity,
                this._springSystem.activateSpring(this.getId()),
                this)
            },
            getVelocity: function() {
                return this._currentState.velocity
            },
            setRestSpeedThreshold: function(restSpeedThreshold) {
                return this._restSpeedThreshold = restSpeedThreshold,
                this
            },
            getRestSpeedThreshold: function() {
                return this._restSpeedThreshold
            },
            setRestDisplacementThreshold: function(displacementFromRestThreshold) {
                this._displacementFromRestThreshold = displacementFromRestThreshold
            },
            getRestDisplacementThreshold: function() {
                return this._displacementFromRestThreshold
            },
            setOvershootClampingEnabled: function(enabled) {
                return this._overshootClampingEnabled = enabled,
                this
            },
            isOvershootClampingEnabled: function() {
                return this._overshootClampingEnabled
            },
            isOvershooting: function() {
                var start = this._startValue
                  , end = this._endValue;
                return this._springConfig.tension > 0 && (end > start && this.getCurrentValue() > end || start > end && this.getCurrentValue() < end)
            },
            advance: function(time, realDeltaTime) {
                var isAtRest = this.isAtRest();
                if (!isAtRest || !this._wasAtRest) {
                    var adjustedDeltaTime = realDeltaTime;
                    realDeltaTime > Spring.MAX_DELTA_TIME_SEC && (adjustedDeltaTime = Spring.MAX_DELTA_TIME_SEC),
                    this._timeAccumulator += adjustedDeltaTime;
                    for (var aVelocity, aAcceleration, bVelocity, bAcceleration, cVelocity, cAcceleration, dVelocity, dAcceleration, dxdt, dvdt, tension = this._springConfig.tension, friction = this._springConfig.friction, position = this._currentState.position, velocity = this._currentState.velocity, tempPosition = this._tempState.position, tempVelocity = this._tempState.velocity; this._timeAccumulator >= Spring.SOLVER_TIMESTEP_SEC; )
                        this._timeAccumulator -= Spring.SOLVER_TIMESTEP_SEC,
                        this._timeAccumulator < Spring.SOLVER_TIMESTEP_SEC && (this._previousState.position = position,
                        this._previousState.velocity = velocity),
                        aVelocity = velocity,
                        aAcceleration = tension * (this._endValue - tempPosition) - friction * velocity,
                        tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * .5,
                        tempVelocity = velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * .5,
                        bVelocity = tempVelocity,
                        bAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity,
                        tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * .5,
                        tempVelocity = velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * .5,
                        cVelocity = tempVelocity,
                        cAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity,
                        tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC * .5,
                        tempVelocity = velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC * .5,
                        dVelocity = tempVelocity,
                        dAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity,
                        dxdt = 1 / 6 * (aVelocity + 2 * (bVelocity + cVelocity) + dVelocity),
                        dvdt = 1 / 6 * (aAcceleration + 2 * (bAcceleration + cAcceleration) + dAcceleration),
                        position += dxdt * Spring.SOLVER_TIMESTEP_SEC,
                        velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC;
                    this._tempState.position = tempPosition,
                    this._tempState.velocity = tempVelocity,
                    this._currentState.position = position,
                    this._currentState.velocity = velocity,
                    this._timeAccumulator > 0 && this.interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC),
                    (this.isAtRest() || this._overshootClampingEnabled && this.isOvershooting()) && (this._springConfig.tension > 0 ? (this._startValue = this._endValue,
                    this._currentState.position = this._endValue) : (this._endValue = this._currentState.position,
                    this._startValue = this._endValue),
                    this.setVelocity(0),
                    isAtRest = !0);
                    var notifyActivate = !1;
                    this._wasAtRest && (this._wasAtRest = !1,
                    notifyActivate = !0);
                    var notifyAtRest = !1;
                    isAtRest && (this._wasAtRest = !0,
                    notifyAtRest = !0),
                    this.notifyPositionUpdated(notifyActivate, notifyAtRest)
                }
            },
            notifyPositionUpdated: function(notifyActivate, notifyAtRest) {
                for (var i = 0, len = this.listeners.length; len > i; i++) {
                    var listener = this.listeners[i];
                    notifyActivate && listener.onSpringActivate && listener.onSpringActivate(this),
                    listener.onSpringUpdate && listener.onSpringUpdate(this),
                    notifyAtRest && listener.onSpringAtRest && listener.onSpringAtRest(this)
                }
            },
            systemShouldAdvance: function() {
                return !this.isAtRest() || !this.wasAtRest()
            },
            wasAtRest: function() {
                return this._wasAtRest
            },
            isAtRest: function() {
                return Math.abs(this._currentState.velocity) < this._restSpeedThreshold && (this.getDisplacementDistanceForState(this._currentState) <= this._displacementFromRestThreshold || 0 === this._springConfig.tension)
            },
            setAtRest: function() {
                return this._endValue = this._currentState.position,
                this._tempState.position = this._currentState.position,
                this._currentState.velocity = 0,
                this
            },
            interpolate: function(alpha) {
                this._currentState.position = this._currentState.position * alpha + this._previousState.position * (1 - alpha),
                this._currentState.velocity = this._currentState.velocity * alpha + this._previousState.velocity * (1 - alpha)
            },
            getListeners: function() {
                return this.listeners
            },
            addListener: function(newListener) {
                return this.listeners.push(newListener),
                this
            },
            removeListener: function(listenerToRemove) {
                return removeFirst(this.listeners, listenerToRemove),
                this
            },
            removeAllListeners: function() {
                return this.listeners = [],
                this
            },
            currentValueIsApproximately: function(value) {
                return Math.abs(this.getCurrentValue() - value) <= this.getRestDisplacementThreshold()
            }
        });
        var PhysicsState = function() {}
        ;
        util.extend(PhysicsState.prototype, {
            position: 0,
            velocity: 0
        });
        var SpringConfig = rebound.SpringConfig = function(tension, friction) {
            this.tension = tension,
            this.friction = friction
        }
          , AnimationLooper = rebound.AnimationLooper = function() {
            this.springSystem = null ;
            var _this = this
              , _run = function() {
                try {
                    _this.springSystem.loop(Date.now())
                } catch (e) {
                    console.error(e)
                }
            }
            ;
            this.run = function() {
                util.onFrame(_run)
            }
        }
        ;
        rebound.SimulationLooper = function(timestep) {
            this.springSystem = null ;
            var time = 0
              , running = !1;
            timestep = timestep || 16.667,
            this.run = function() {
                if (!running) {
                    for (running = !0; !this.springSystem.getIsIdle(); )
                        this.springSystem.loop(time += timestep);
                    running = !1
                }
            }
        }
        ,
        rebound.SteppingSimulationLooper = function(timestep) {
            this.springSystem = null ;
            var time = 0;
            this.run = function() {}
            ,
            this.step = function(timestep) {
                this.springSystem.loop(time += timestep)
            }
        }
        ;
        var OrigamiValueConverter = rebound.OrigamiValueConverter = {
            tensionFromOrigamiValue: function(oValue) {
                return 3.62 * (oValue - 30) + 194
            },
            origamiValueFromTension: function(tension) {
                return (tension - 194) / 3.62 + 30
            },
            frictionFromOrigamiValue: function(oValue) {
                return 3 * (oValue - 8) + 25
            },
            origamiFromFriction: function(friction) {
                return (friction - 25) / 3 + 8
            }
        }
          , BouncyConversion = rebound.BouncyConversion = function(bounciness, speed) {
            this.bounciness = bounciness,
            this.speed = speed;
            var b = this.normalize(bounciness / 1.7, 0, 20);
            b = this.projectNormal(b, 0, .8);
            var s = this.normalize(speed / 1.7, 0, 20);
            this.bouncyTension = this.projectNormal(s, .5, 200),
            this.bouncyFriction = this.quadraticOutInterpolation(b, this.b3Nobounce(this.bouncyTension), .01)
        }
        ;
        util.extend(BouncyConversion.prototype, {
            normalize: function(value, startValue, endValue) {
                return (value - startValue) / (endValue - startValue)
            },
            projectNormal: function(n, start, end) {
                return start + n * (end - start)
            },
            linearInterpolation: function(t, start, end) {
                return t * end + (1 - t) * start
            },
            quadraticOutInterpolation: function(t, start, end) {
                return this.linearInterpolation(2 * t - t * t, start, end)
            },
            b3Friction1: function(x) {
                return 7e-4 * Math.pow(x, 3) - .031 * Math.pow(x, 2) + .64 * x + 1.28
            },
            b3Friction2: function(x) {
                return 44e-6 * Math.pow(x, 3) - .006 * Math.pow(x, 2) + .36 * x + 2
            },
            b3Friction3: function(x) {
                return 4.5e-7 * Math.pow(x, 3) - 332e-6 * Math.pow(x, 2) + .1078 * x + 5.84
            },
            b3Nobounce: function(tension) {
                var friction = 0;
                return friction = 18 >= tension ? this.b3Friction1(tension) : tension > 18 && 44 >= tension ? this.b3Friction2(tension) : this.b3Friction3(tension)
            }
        }),
        util.extend(SpringConfig, {
            fromOrigamiTensionAndFriction: function(tension, friction) {
                return new SpringConfig(OrigamiValueConverter.tensionFromOrigamiValue(tension),OrigamiValueConverter.frictionFromOrigamiValue(friction))
            },
            fromBouncinessAndSpeed: function(bounciness, speed) {
                var bouncyConversion = new rebound.BouncyConversion(bounciness,speed);
                return this.fromOrigamiTensionAndFriction(bouncyConversion.bouncyTension, bouncyConversion.bouncyFriction)
            },
            coastingConfigWithOrigamiFriction: function(friction) {
                return new SpringConfig(0,OrigamiValueConverter.frictionFromOrigamiValue(friction))
            }
        }),
        SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG = SpringConfig.fromOrigamiTensionAndFriction(40, 7),
        util.extend(SpringConfig.prototype, {
            friction: 0,
            tension: 0
        });
        var colorCache = {};
        util.hexToRGB = function(color) {
            if (colorCache[color])
                return colorCache[color];
            color = color.replace("#", ""),
            3 === color.length && (color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]);
            var parts = color.match(/.{2}/g)
              , ret = {
                r: parseInt(parts[0], 16),
                g: parseInt(parts[1], 16),
                b: parseInt(parts[2], 16)
            };
            return colorCache[color] = ret,
            ret
        }
        ,
        util.rgbToHex = function(r, g, b) {
            return r = r.toString(16),
            g = g.toString(16),
            b = b.toString(16),
            r = r.length < 2 ? "0" + r : r,
            g = g.length < 2 ? "0" + g : g,
            b = b.length < 2 ? "0" + b : b,
            "#" + r + g + b
        }
        ;
        var MathUtil = rebound.MathUtil = {
            mapValueInRange: function(value, fromLow, fromHigh, toLow, toHigh) {
                var fromRangeSize = fromHigh - fromLow
                  , toRangeSize = toHigh - toLow
                  , valueScale = (value - fromLow) / fromRangeSize;
                return toLow + valueScale * toRangeSize
            },
            interpolateColor: function(val, startColor, endColor, fromLow, fromHigh, asRGB) {
                fromLow = void 0 === fromLow ? 0 : fromLow,
                fromHigh = void 0 === fromHigh ? 1 : fromHigh,
                startColor = util.hexToRGB(startColor),
                endColor = util.hexToRGB(endColor);
                var r = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r))
                  , g = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g))
                  , b = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b));
                return asRGB ? "rgb(" + r + "," + g + "," + b + ")" : util.rgbToHex(r, g, b)
            },
            degreesToRadians: function(deg) {
                return deg * Math.PI / 180
            },
            radiansToDegrees: function(rad) {
                return 180 * rad / Math.PI
            }
        };
        util.extend(util, MathUtil);
        var _onFrame;
        "undefined" != typeof window && (_onFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame),
        _onFrame || "undefined" == typeof process || "node" !== process.title || (_onFrame = setImmediate),
        util.onFrame = function(func) {
            return _onFrame(func)
        }
        ,
        "undefined" != typeof exports ? util.extend(exports, rebound) : "undefined" != typeof window && (window.rebound = rebound)
    }()
}),
__d("SegmentedControlIOS", ["NativeMethodsMixin", "NativeModules", "ReactPropTypes", "React", "StyleSheet", "requireNativeComponent", "verifyPropTypes"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , NativeModules = require("NativeModules")
      , PropTypes = require("ReactPropTypes")
      , React = require("React")
      , StyleSheet = require("StyleSheet")
      , requireNativeComponent = require("requireNativeComponent")
      , verifyPropTypes = require("verifyPropTypes")
      , SEGMENTED_CONTROL_REFERENCE = "segmentedcontrol"
      , SegmentedControlIOS = React.createClass({
        displayName: "SegmentedControlIOS",
        mixins: [NativeMethodsMixin],
        propTypes: {
            values: PropTypes.arrayOf(PropTypes.string),
            selectedIndex: PropTypes.number,
            onValueChange: PropTypes.func,
            onChange: PropTypes.func,
            enabled: PropTypes.bool,
            tintColor: PropTypes.string,
            momentary: PropTypes.bool
        },
        getDefaultProps: function() {
            return {
                values: [],
                enabled: !0
            }
        },
        _onChange: function(event) {
            this.props.onChange && this.props.onChange(event),
            this.props.onValueChange && this.props.onValueChange(event.nativeEvent.value)
        },
        render: function() {
            return React.createElement(RCTSegmentedControl, React.__spread({}, this.props, {
                ref: SEGMENTED_CONTROL_REFERENCE,
                style: [styles.segmentedControl, this.props.style],
                onChange: this._onChange
            }))
        }
    })
      , styles = StyleSheet.create({
        segmentedControl: {
            height: NativeModules.SegmentedControlManager.ComponentHeight
        }
    })
      , RCTSegmentedControl = requireNativeComponent("RCTSegmentedControl", null );
    __DEV__ && verifyPropTypes(RCTSegmentedControl, RCTSegmentedControl.viewConfig),
    module.exports = SegmentedControlIOS
}),
__d("SliderIOS", ["NativeMethodsMixin", "ReactPropTypes", "React", "StyleSheet", "View", "requireNativeComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , PropTypes = require("ReactPropTypes")
      , React = require("React")
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , requireNativeComponent = require("requireNativeComponent")
      , SliderIOS = React.createClass({
        displayName: "SliderIOS",
        mixins: [NativeMethodsMixin],
        propTypes: {
            style: View.propTypes.style,
            value: PropTypes.number,
            minimumValue: PropTypes.number,
            maximumValue: PropTypes.number,
            minimumTrackTintColor: PropTypes.string,
            maximumTrackTintColor: PropTypes.string,
            onValueChange: PropTypes.func,
            onSlidingComplete: PropTypes.func
        },
        _onValueChange: function(event) {
            this.props.onChange && this.props.onChange(event),
            event.nativeEvent.continuous ? this.props.onValueChange && this.props.onValueChange(event.nativeEvent.value) : this.props.onSlidingComplete && void 0 !== event.nativeEvent.value && this.props.onSlidingComplete(event.nativeEvent.value)
        },
        render: function() {
            return React.createElement(RCTSlider, {
                style: [styles.slider, this.props.style],
                value: this.props.value,
                maximumValue: this.props.maximumValue,
                minimumValue: this.props.minimumValue,
                minimumTrackTintColor: this.props.minimumTrackTintColor,
                maximumTrackTintColor: this.props.maximumTrackTintColor,
                onChange: this._onValueChange
            })
        }
    })
      , styles = StyleSheet.create({
        slider: {
            height: 40
        }
    })
      , RCTSlider = requireNativeComponent("RCTSlider", SliderIOS);
    module.exports = SliderIOS
}),
__d("SwitchIOS", ["NativeMethodsMixin", "ReactPropTypes", "React", "StyleSheet", "requireNativeComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , PropTypes = require("ReactPropTypes")
      , React = require("React")
      , StyleSheet = require("StyleSheet")
      , requireNativeComponent = require("requireNativeComponent")
      , SWITCH = "switch"
      , SwitchIOS = React.createClass({
        displayName: "SwitchIOS",
        mixins: [NativeMethodsMixin],
        propTypes: {
            value: PropTypes.bool,
            disabled: PropTypes.bool,
            onValueChange: PropTypes.func,
            onTintColor: PropTypes.string,
            thumbTintColor: PropTypes.string,
            tintColor: PropTypes.string
        },
        getDefaultProps: function() {
            return {
                value: !1,
                disabled: !1
            }
        },
        _onChange: function(event) {
            this.props.onChange && this.props.onChange(event),
            this.props.onValueChange && this.props.onValueChange(event.nativeEvent.value),
            this.refs[SWITCH].setNativeProps({
                value: this.props.value
            })
        },
        render: function() {
            return React.createElement(RCTSwitch, React.__spread({}, this.props, {
                ref: SWITCH,
                onChange: this._onChange,
                style: [styles.rkSwitch, this.props.style]
            }))
        }
    })
      , styles = StyleSheet.create({
        rkSwitch: {
            height: 31,
            width: 51
        }
    })
      , RCTSwitch = requireNativeComponent("RCTSwitch", SwitchIOS);
    module.exports = SwitchIOS
}),
__d("TabBarIOS", ["React", "StyleSheet", "TabBarItemIOS", "View", "requireNativeComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var React = require("React")
      , StyleSheet = require("StyleSheet")
      , TabBarItemIOS = require("TabBarItemIOS")
      , View = require("View")
      , requireNativeComponent = require("requireNativeComponent")
      , TabBarIOS = React.createClass({
        displayName: "TabBarIOS",
        statics: {
            Item: TabBarItemIOS
        },
        propTypes: {
            style: View.propTypes.style
        },
        render: function() {
            return React.createElement(RCTTabBar, {
                style: [styles.tabGroup, this.props.style]
            }, this.props.children)
        }
    })
      , styles = StyleSheet.create({
        tabGroup: {
            flex: 1
        }
    })
      , RCTTabBar = requireNativeComponent("RCTTabBar", TabBarIOS);
    module.exports = TabBarIOS
}),
__d("TabBarItemIOS", ["Image", "React", "StaticContainer.react", "StyleSheet", "View", "requireNativeComponent"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var Image = require("Image")
      , React = require("React")
      , StaticContainer = require("StaticContainer.react")
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , requireNativeComponent = require("requireNativeComponent")
      , TabBarItemIOS = React.createClass({
        displayName: "TabBarItemIOS",
        propTypes: {
            badge: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
            systemIcon: React.PropTypes.oneOf(["bookmarks", "contacts", "downloads", "favorites", "featured", "history", "more", "most-recent", "most-viewed", "recents", "search", "top-rated"]),
            icon: Image.propTypes.source,
            selectedIcon: Image.propTypes.source,
            onPress: React.PropTypes.func,
            selected: React.PropTypes.bool,
            style: View.propTypes.style,
            title: React.PropTypes.string
        },
        getInitialState: function() {
            return {
                hasBeenSelected: !1
            }
        },
        componentWillMount: function() {
            this.props.selected && this.setState({
                hasBeenSelected: !0
            })
        },
        componentWillReceiveProps: function(nextProps) {
            (this.state.hasBeenSelected || nextProps.selected) && this.setState({
                hasBeenSelected: !0
            })
        },
        render: function() {
            var tabContents = null ;
            tabContents = this.state.hasBeenSelected ? React.createElement(StaticContainer, {
                shouldUpdate: this.props.selected
            }, this.props.children) : React.createElement(View, null );
            var icon = this.props.systemIcon || this.props.icon && this.props.icon.uri
              , badge = "number" == typeof this.props.badge ? "" + this.props.badge : this.props.badge;
            return React.createElement(RCTTabBarItem, {
                icon: icon,
                selectedIcon: this.props.selectedIcon && this.props.selectedIcon.uri,
                onPress: this.props.onPress,
                selected: this.props.selected,
                badge: badge,
                title: this.props.title,
                style: [styles.tab, this.props.style]
            }, tabContents)
        }
    })
      , styles = StyleSheet.create({
        tab: {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    })
      , RCTTabBarItem = requireNativeComponent("RCTTabBarItem", TabBarItemIOS);
    module.exports = TabBarItemIOS
}),
__d("Text", ["NativeMethodsMixin", "React", "ReactNativeViewAttributes", "StyleSheetPropType", "TextStylePropTypes", "Touchable", "createReactNativeComponentClass", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , React = require("React")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , StyleSheetPropType = require("StyleSheetPropType")
      , TextStylePropTypes = require("TextStylePropTypes")
      , Touchable = require("Touchable")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , merge = require("merge")
      , stylePropType = StyleSheetPropType(TextStylePropTypes)
      , viewConfig = {
        validAttributes: merge(ReactNativeViewAttributes.UIView, {
            isHighlighted: !0,
            numberOfLines: !0,
            text: !0,
            showHtml: !0,
            multi: !0,
            ellipsis: !0,
            endellipsis: !0,
            title: !0,
            visible: !0
        }),
        uiViewClassName: "RCTText"
    }
      , Text = React.createClass({
        displayName: "Text",
        mixins: [Touchable.Mixin, NativeMethodsMixin],
        propTypes: {
            numberOfLines: React.PropTypes.number,
            onPress: React.PropTypes.func,
            onClick: React.PropTypes.func,
            onKeyDown: React.PropTypes.func,
            suppressHighlighting: React.PropTypes.bool,
            style: stylePropType,
            testID: React.PropTypes.string
        },
        viewConfig: viewConfig,
        getInitialState: function() {
            return merge(this.touchableGetInitialState(), {
                isHighlighted: !1
            })
        },
        onStartShouldSetResponder: function() {
            var shouldSetFromProps = this.props.onStartShouldSetResponder && this.props.onStartShouldSetResponder();
            return shouldSetFromProps || !!this.props.onPress
        },
        handleResponderTerminationRequest: function() {
            var allowTermination = this.touchableHandleResponderTerminationRequest();
            return allowTermination && this.props.onResponderTerminationRequest && (allowTermination = this.props.onResponderTerminationRequest()),
            allowTermination
        },
        handleResponderGrant: function(e, dispatchID) {
            this.touchableHandleResponderGrant(e, dispatchID),
            this.props.onResponderGrant && this.props.onResponderGrant.apply(this, arguments)
        },
        handleResponderMove: function(e) {
            this.touchableHandleResponderMove(e),
            this.props.onResponderMove && this.props.onResponderMove.apply(this, arguments)
        },
        handleResponderRelease: function(e) {
            this.touchableHandleResponderRelease(e),
            this.props.onResponderRelease && this.props.onResponderRelease.apply(this, arguments)
        },
        handleResponderTerminate: function(e) {
            this.touchableHandleResponderTerminate(e),
            this.props.onResponderTerminate && this.props.onResponderTerminate.apply(this, arguments)
        },
        touchableHandleActivePressIn: function() {
            !this.props.suppressHighlighting && this.props.onPress && this.setState({
                isHighlighted: !0
            })
        },
        touchableHandleActivePressOut: function() {
            !this.props.suppressHighlighting && this.props.onPress && this.setState({
                isHighlighted: !1
            })
        },
        touchableHandlePress: function() {
            this.props.onPress && this.props.onPress()
        },
        touchableGetPressRectOffset: function() {
            return PRESS_RECT_OFFSET
        },
        render: function() {
            var props = this.props;
            props.accessible !== !1 && (props.accessible = !0),
            props.isHighlighted = this.state.isHighlighted;

            props.text = props.text || '';
            if (Array.isArray(props.children)) {
              props.text = props.children.join('');
            } else if (props.children){
              props.text = props.children;
            }

            try {
                props.text = props.text && props.text.replace(/\[\/c\]/g, "</c>").replace(/(\[c #\w{6}\])/g, function(match) {
                    return props.showHtml = !0,
                    match.replace(/\[/g, "<").replace(/\]/g, ">")
                })
            } catch (e) {
                props.text = props.text
            }
            return props.endellipsis = props.ellipsis,
            props.children = null ,
            React.createElement(RCTText, React.__spread({}, props))
        }
    })
      , PRESS_RECT_OFFSET = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 30
    }
      , RCTText = createReactNativeComponentClass(viewConfig);
    module.exports = Text
}),
__d("Touchable", ["BoundingDimensions", "Position", "TouchEventUtils", "keyMirror", "queryLayoutByID"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var BoundingDimensions = require("BoundingDimensions")
      , Position = require("Position")
      , TouchEventUtils = require("TouchEventUtils")
      , keyMirror = require("keyMirror")
      , queryLayoutByID = require("queryLayoutByID")
      , States = keyMirror({
        NOT_RESPONDER: null ,
        RESPONDER_INACTIVE_PRESS_IN: null ,
        RESPONDER_INACTIVE_PRESS_OUT: null ,
        RESPONDER_ACTIVE_PRESS_IN: null ,
        RESPONDER_ACTIVE_PRESS_OUT: null ,
        RESPONDER_ACTIVE_LONG_PRESS_IN: null ,
        RESPONDER_ACTIVE_LONG_PRESS_OUT: null ,
        ERROR: null 
    })
      , IsActive = {
        RESPONDER_ACTIVE_PRESS_OUT: !0,
        RESPONDER_ACTIVE_PRESS_IN: !0
    }
      , IsPressingIn = {
        RESPONDER_INACTIVE_PRESS_IN: !0,
        RESPONDER_ACTIVE_PRESS_IN: !0,
        RESPONDER_ACTIVE_LONG_PRESS_IN: !0
    }
      , IsLongPressingIn = {
        RESPONDER_ACTIVE_LONG_PRESS_IN: !0
    }
      , Signals = keyMirror({
        DELAY: null ,
        RESPONDER_GRANT: null ,
        RESPONDER_RELEASE: null ,
        RESPONDER_TERMINATED: null ,
        ENTER_PRESS_RECT: null ,
        LEAVE_PRESS_RECT: null ,
        LONG_PRESS_DETECTED: null 
    })
      , Transitions = {
        NOT_RESPONDER: {
            DELAY: States.ERROR,
            RESPONDER_GRANT: States.RESPONDER_INACTIVE_PRESS_IN,
            RESPONDER_RELEASE: States.ERROR,
            RESPONDER_TERMINATED: States.ERROR,
            ENTER_PRESS_RECT: States.ERROR,
            LEAVE_PRESS_RECT: States.ERROR,
            LONG_PRESS_DETECTED: States.ERROR
        },
        RESPONDER_INACTIVE_PRESS_IN: {
            DELAY: States.RESPONDER_ACTIVE_PRESS_IN,
            RESPONDER_GRANT: States.ERROR,
            RESPONDER_RELEASE: States.NOT_RESPONDER,
            RESPONDER_TERMINATED: States.NOT_RESPONDER,
            ENTER_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_IN,
            LEAVE_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_OUT,
            LONG_PRESS_DETECTED: States.ERROR
        },
        RESPONDER_INACTIVE_PRESS_OUT: {
            DELAY: States.RESPONDER_ACTIVE_PRESS_OUT,
            RESPONDER_GRANT: States.ERROR,
            RESPONDER_RELEASE: States.NOT_RESPONDER,
            RESPONDER_TERMINATED: States.NOT_RESPONDER,
            ENTER_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_IN,
            LEAVE_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_OUT,
            LONG_PRESS_DETECTED: States.ERROR
        },
        RESPONDER_ACTIVE_PRESS_IN: {
            DELAY: States.ERROR,
            RESPONDER_GRANT: States.ERROR,
            RESPONDER_RELEASE: States.NOT_RESPONDER,
            RESPONDER_TERMINATED: States.NOT_RESPONDER,
            ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_IN,
            LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_OUT,
            LONG_PRESS_DETECTED: States.RESPONDER_ACTIVE_LONG_PRESS_IN
        },
        RESPONDER_ACTIVE_PRESS_OUT: {
            DELAY: States.ERROR,
            RESPONDER_GRANT: States.ERROR,
            RESPONDER_RELEASE: States.NOT_RESPONDER,
            RESPONDER_TERMINATED: States.NOT_RESPONDER,
            ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_IN,
            LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_OUT,
            LONG_PRESS_DETECTED: States.ERROR
        },
        RESPONDER_ACTIVE_LONG_PRESS_IN: {
            DELAY: States.ERROR,
            RESPONDER_GRANT: States.ERROR,
            RESPONDER_RELEASE: States.NOT_RESPONDER,
            RESPONDER_TERMINATED: States.NOT_RESPONDER,
            ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
            LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_OUT,
            LONG_PRESS_DETECTED: States.RESPONDER_ACTIVE_LONG_PRESS_IN
        },
        RESPONDER_ACTIVE_LONG_PRESS_OUT: {
            DELAY: States.ERROR,
            RESPONDER_GRANT: States.ERROR,
            RESPONDER_RELEASE: States.NOT_RESPONDER,
            RESPONDER_TERMINATED: States.NOT_RESPONDER,
            ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
            LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_OUT,
            LONG_PRESS_DETECTED: States.ERROR
        },
        error: {
            DELAY: States.NOT_RESPONDER,
            RESPONDER_GRANT: States.RESPONDER_INACTIVE_PRESS_IN,
            RESPONDER_RELEASE: States.NOT_RESPONDER,
            RESPONDER_TERMINATED: States.NOT_RESPONDER,
            ENTER_PRESS_RECT: States.NOT_RESPONDER,
            LEAVE_PRESS_RECT: States.NOT_RESPONDER,
            LONG_PRESS_DETECTED: States.NOT_RESPONDER
        }
    }
      , HIGHLIGHT_DELAY_MS = 130
      , PRESS_EXPAND_PX = 20
      , LONG_PRESS_THRESHOLD = 500
      , LONG_PRESS_ALLOWED_MOVEMENT = 10
      , TouchableMixin = {
        touchableGetInitialState: function() {
            return {
                touchable: {
                    touchState: void 0,
                    responderID: null 
                }
            }
        },
        touchableHandleResponderTerminationRequest: function() {
            return !this.props.rejectResponderTermination
        },
        touchableHandleStartShouldSetResponder: function() {
            return !0
        },
        touchableLongPressCancelsPress: function() {
            return !0
        },
        touchableHandleResponderGrant: function(e, dispatchID) {
            e.persist(),
            this.state.touchable.touchState = States.NOT_RESPONDER,
            this.state.touchable.responderID = dispatchID,
            this._receiveSignal(Signals.RESPONDER_GRANT, e);
            var delayMS = void 0 !== this.touchableGetHighlightDelayMS ? this.touchableGetHighlightDelayMS() : HIGHLIGHT_DELAY_MS;
            0 !== delayMS ? this.touchableDelayTimeout = setTimeout(this._handleDelay.bind(this, e), delayMS) : this._handleDelay(e),
            this.longPressDelayTimeout = setTimeout(this._handleLongDelay.bind(this, e), LONG_PRESS_THRESHOLD - delayMS)
        },
        touchableHandleResponderRelease: function(e) {
            this._receiveSignal(Signals.RESPONDER_RELEASE, e)
        },
        touchableHandleResponderTerminate: function(e) {
            this._receiveSignal(Signals.RESPONDER_TERMINATED, e)
        },
        touchableHandleResponderMove: function(e) {
            if (this.state.touchable.touchState !== States.RESPONDER_INACTIVE_PRESS_IN && this.state.touchable.positionOnActivate) {
                var positionOnActivate = this.state.touchable.positionOnActivate
                  , dimensionsOnActivate = this.state.touchable.dimensionsOnActivate
                  , pressRectOffset = this.touchableGetPressRectOffset ? this.touchableGetPressRectOffset() : null 
                  , pressExpandLeft = null  != pressRectOffset.left ? pressRectOffset.left : PRESS_EXPAND_PX
                  , pressExpandTop = null  != pressRectOffset.top ? pressRectOffset.top : PRESS_EXPAND_PX
                  , pressExpandRight = null  != pressRectOffset.right ? pressRectOffset.right : PRESS_EXPAND_PX
                  , pressExpandBottom = null  != pressRectOffset.bottom ? pressRectOffset.bottom : PRESS_EXPAND_PX
                  , touch = TouchEventUtils.extractSingleTouch(e.nativeEvent)
                  , pageX = touch && touch.pageX
                  , pageY = touch && touch.pageY;
                if (this.pressInLocation) {
                    var movedDistance = this._getDistanceBetweenPoints(pageX, pageY, this.pressInLocation.pageX, this.pressInLocation.pageY);
                    movedDistance > LONG_PRESS_ALLOWED_MOVEMENT && this._cancelLongPressDelayTimeout()
                }
                var isTouchWithinActive = pageX > positionOnActivate.left - pressExpandLeft && pageY > positionOnActivate.top - pressExpandTop && pageX < positionOnActivate.left + dimensionsOnActivate.width + pressExpandRight && pageY < positionOnActivate.top + dimensionsOnActivate.height + pressExpandBottom;
                isTouchWithinActive ? this._receiveSignal(Signals.ENTER_PRESS_RECT, e) : (this._cancelLongPressDelayTimeout(),
                this._receiveSignal(Signals.LEAVE_PRESS_RECT, e))
            }
        },
        _remeasureMetricsOnActivation: function() {
            queryLayoutByID(this.state.touchable.responderID, null , this._handleQueryLayout)
        },
        _handleQueryLayout: function(l, t, w, h, globalX, globalY) {
            this.state.touchable.positionOnActivate && Position.release(this.state.touchable.positionOnActivate),
            this.state.touchable.dimensionsOnActivate && BoundingDimensions.release(this.state.touchable.dimensionsOnActivate),
            this.state.touchable.positionOnActivate = Position.getPooled(globalX, globalY),
            this.state.touchable.dimensionsOnActivate = BoundingDimensions.getPooled(w, h)
        },
        _handleDelay: function(e) {
            this.touchableDelayTimeout = null ,
            this._receiveSignal(Signals.DELAY, e)
        },
        _handleLongDelay: function(e) {
            this.longPressDelayTimeout = null ,
            this._receiveSignal(Signals.LONG_PRESS_DETECTED, e)
        },
        _receiveSignal: function(signal, e) {
            var curState = this.state.touchable.touchState;
            if (!Transitions[curState] || !Transitions[curState][signal])
                throw new Error("Unrecognized signal `" + signal + "` or state `" + curState + "` for Touchable responder `" + this.state.touchable.responderID + "`");
            var nextState = Transitions[curState][signal];
            if (nextState === States.ERROR)
                throw new Error("Touchable cannot transition from `" + curState + "` to `" + signal + "` for responder `" + this.state.touchable.responderID + "`");
            curState !== nextState && (this._performSideEffectsForTransition(curState, nextState, signal, e),
            this.state.touchable.touchState = nextState)
        },
        _cancelLongPressDelayTimeout: function() {
            this.longPressDelayTimeout && clearTimeout(this.longPressDelayTimeout),
            this.longPressDelayTimeout = null 
        },
        _isHighlight: function(state) {
            return state === States.RESPONDER_ACTIVE_PRESS_IN || state === States.RESPONDER_ACTIVE_LONG_PRESS_IN
        },
        _savePressInLocation: function(e) {
            var touch = TouchEventUtils.extractSingleTouch(e.nativeEvent)
              , pageX = touch && touch.pageX
              , pageY = touch && touch.pageY;
            this.pressInLocation = {
                pageX: pageX,
                pageY: pageY
            }
        },
        _getDistanceBetweenPoints: function(aX, aY, bX, bY) {
            var deltaX = aX - bX
              , deltaY = aY - bY;
            return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        },
        _performSideEffectsForTransition: function(curState, nextState, signal, e) {
            var curIsHighlight = this._isHighlight(curState)
              , newIsHighlight = this._isHighlight(nextState)
              , isFinalSignal = signal === Signals.RESPONDER_TERMINATED || signal === Signals.RESPONDER_RELEASE;
            if (isFinalSignal && this._cancelLongPressDelayTimeout(),
            !IsActive[curState] && IsActive[nextState] && this._remeasureMetricsOnActivation(),
            IsPressingIn[curState] && signal === Signals.LONG_PRESS_DETECTED && this.touchableHandleLongPress && this.touchableHandleLongPress(),
            newIsHighlight && !curIsHighlight ? (this._savePressInLocation(e),
            this.touchableHandleActivePressIn && this.touchableHandleActivePressIn()) : !newIsHighlight && curIsHighlight && this.touchableHandleActivePressOut && this.touchableHandleActivePressOut(),
            IsPressingIn[curState] && signal === Signals.RESPONDER_RELEASE) {
                var hasLongPressHandler = !!this.props.onLongPress
                  , pressIsLongButStillCallOnPress = IsLongPressingIn[curState] && (!hasLongPressHandler || !this.touchableLongPressCancelsPress())
                  , shouldInvokePress = !IsLongPressingIn[curState] || pressIsLongButStillCallOnPress;
                shouldInvokePress && this.touchableHandlePress && this.touchableHandlePress(e)
            }
            this.touchableDelayTimeout && clearTimeout(this.touchableDelayTimeout),
            this.touchableDelayTimeout = null 
        }
    }
      , Touchable = {
        Mixin: TouchableMixin
    };
    module.exports = Touchable
}),
__d("BoundingDimensions", ["PooledClass"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function BoundingDimensions(width, height) {
        this.width = width,
        this.height = height
    }
    var PooledClass = require("PooledClass")
      , twoArgumentPooler = PooledClass.twoArgumentPooler;
    BoundingDimensions.getPooledFromElement = function(element) {
        return BoundingDimensions.getPooled(element.offsetWidth, element.offsetHeight)
    }
    ,
    PooledClass.addPoolingTo(BoundingDimensions, twoArgumentPooler),
    module.exports = BoundingDimensions
}),
__d("Position", ["PooledClass"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function Position(left, top) {
        this.left = left,
        this.top = top
    }
    var PooledClass = require("PooledClass")
      , twoArgumentPooler = PooledClass.twoArgumentPooler;
    PooledClass.addPoolingTo(Position, twoArgumentPooler),
    module.exports = Position
}),
__d("TouchEventUtils", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    var TouchEventUtils = {
        extractSingleTouch: function(nativeEvent) {
            var touches = nativeEvent.touches
              , changedTouches = nativeEvent.changedTouches
              , hasTouches = touches && touches.length > 0
              , hasChangedTouches = changedTouches && changedTouches.length > 0;
            return !hasTouches && hasChangedTouches ? changedTouches[0] : hasTouches ? touches[0] : nativeEvent
        }
    };
    module.exports = TouchEventUtils
}),
__d("queryLayoutByID", ["ReactNativeTagHandles", "NativeModules"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactNativeTagHandles = require("ReactNativeTagHandles")
      , RCTUIManager = require("NativeModules").UIManager
      , queryLayoutByID = function(rootNodeID, onError, onSuccess) {
        RCTUIManager.measure(ReactNativeTagHandles.rootNodeIDToTag[rootNodeID], onSuccess)
    }
    ;
    module.exports = queryLayoutByID
}),
__d("TextInput", ["DocumentSelectionState", "EventEmitter", "NativeMethodsMixin", "NativeModules", "Platform", "ReactPropTypes", "React", "ReactChildren", "ReactNativeViewAttributes", "StyleSheet", "Text", "TextInputState", "react-timer-mixin/TimerMixin", "TouchableWithoutFeedback", "createReactNativeComponentClass", "emptyFunction", "invariant", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var DocumentSelectionState = require("DocumentSelectionState")
      , EventEmitter = require("EventEmitter")
      , NativeMethodsMixin = require("NativeMethodsMixin")
      , RCTUIManager = require("NativeModules").UIManager
      , Platform = require("Platform")
      , PropTypes = require("ReactPropTypes")
      , React = require("React")
      , ReactChildren = require("ReactChildren")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , StyleSheet = require("StyleSheet")
      , Text = require("Text")
      , TextInputState = require("TextInputState")
      , TimerMixin = require("react-timer-mixin/TimerMixin")
      , TouchableWithoutFeedback = require("TouchableWithoutFeedback")
      , createReactNativeComponentClass = require("createReactNativeComponentClass")
      , emptyFunction = require("emptyFunction")
      , invariant = require("invariant")
      , merge = require("merge")
      , autoCapitalizeConsts = RCTUIManager.UIText.AutocapitalizationType
      , keyboardTypeConsts = RCTUIManager.UIKeyboardType
      , returnKeyTypeConsts = RCTUIManager.UIReturnKeyType
      , RCTTextViewAttributes = merge(ReactNativeViewAttributes.UIView, {
        autoCorrect: !0,
        autoCapitalize: !0,
        clearTextOnFocus: !0,
        color: !0,
        editable: !0,
        fontFamily: !0,
        fontSize: !0,
        fontStyle: !0,
        fontWeight: !0,
        keyboardType: !0,
        returnKeyType: !0,
        enablesReturnKeyAutomatically: !0,
        secureTextEntry: !0,
        selectTextOnFocus: !0,
        mostRecentEventCounter: !0,
        placeholder: !0,
        placeholderTextColor: !0,
        text: !0
    })
      , RCTTextFieldAttributes = merge(RCTTextViewAttributes, {
        caretHidden: !0,
        enabled: !0,
        clearButtonMode: !0,
        clearTextOnFocus: !0,
        selectTextOnFocus: !0
    })
      , onlyMultiline = {
        onSelectionChange: !0,
        onTextInput: !0,
        children: !0
    }
      , notMultiline = {
        onSubmitEditing: !0
    }
      , AndroidTextInputAttributes = {
        autoCapitalize: !0,
        autoCorrect: !0,
        autoFocus: !0,
        keyboardType: !0,
        multiline: !0,
        password: !0,
        placeholder: !0,
        text: !0,
        testID: !0
    }
      , viewConfigIOS = {
        uiViewClassName: "RCTTextField",
        validAttributes: RCTTextFieldAttributes
    }
      , viewConfigAndroid = {
        uiViewClassName: "AndroidTextInput",
        validAttributes: AndroidTextInputAttributes
    }
      , crossPlatformKeyboardTypeMap = {
        numeric: "decimal-pad"
    }
      , TextInput = React.createClass({
        displayName: "TextInput",
        propTypes: {
            autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
            autoCorrect: PropTypes.bool,
            autoFocus: PropTypes.bool,
            editable: PropTypes.bool,
            keyboardType: PropTypes.oneOf(["default", "ascii-capable", "numbers-and-punctuation", "url", "number-pad", "phone-pad", "name-phone-pad", "email-address", "decimal-pad", "twitter", "web-search", "numeric"]),
            returnKeyType: PropTypes.oneOf(["default", "go", "google", "join", "next", "route", "search", "send", "yahoo", "done", "emergency-call"]),
            enablesReturnKeyAutomatically: PropTypes.bool,
            multiline: PropTypes.bool,
            onBlur: PropTypes.func,
            onFocus: PropTypes.func,
            onChange: PropTypes.func,
            onChangeText: PropTypes.func,
            onEndEditing: PropTypes.func,
            onSubmitEditing: PropTypes.func,
            password: PropTypes.bool,
            placeholder: PropTypes.string,
            placeholderTextColor: PropTypes.string,
            selectionState: PropTypes.instanceOf(DocumentSelectionState),
            value: PropTypes.string,
            bufferDelay: PropTypes.number,
            controlled: PropTypes.bool,
            clearButtonMode: PropTypes.oneOf(["never", "while-editing", "unless-editing", "always"]),
            clearTextOnFocus: PropTypes.bool,
            selectTextOnFocus: PropTypes.bool,
            style: Text.propTypes.style,
            testID: PropTypes.string
        },
        mixins: [NativeMethodsMixin, TimerMixin],
        // viewConfig: "ios" === Platform.OS ? viewConfigIOS : "android" === Platform.OS ? viewConfigAndroid : {},
        viewConfig: viewConfigIOS,
        isFocused: function() {
            return TextInputState.currentlyFocusedField() === React.findNodeHandle(this.refs.input)
        },
        getDefaultProps: function() {
            return {
                bufferDelay: 100
            }
        },
        getInitialState: function() {
            return {
                mostRecentEventCounter: 0,
                bufferedValue: this.props.value
            }
        },
        contextTypes: {
            onFocusRequested: React.PropTypes.func,
            focusEmitter: React.PropTypes.instanceOf(EventEmitter)
        },
        _focusSubscription: void 0,
        componentDidMount: function() {
            return this.context.focusEmitter ? (this._focusSubscription = this.context.focusEmitter.addListener("focus", function(el) {
                this === el ? this.requestAnimationFrame(this.focus) : this.isFocused() && this.blur()
            }
            .bind(this)),
            void (this.props.autoFocus && this.context.onFocusRequested(this))) : void (this.props.autoFocus && this.requestAnimationFrame(this.focus))
        },
        componentWillUnmount: function() {
            this._focusSubscription && this._focusSubscription.remove(),
            this.isFocused() && this.blur()
        },
        _bufferTimeout: void 0,
        componentWillReceiveProps: function(newProps) {
            newProps.value !== this.props.value && (this.isFocused() ? (this.clearTimeout(this._bufferTimeout),
            this._bufferTimeout = this.setTimeout(function() {
                return this.setState({
                    bufferedValue: newProps.value
                })
            }
            .bind(this), this.props.bufferDelay)) : this.setState({
                bufferedValue: newProps.value
            }))
        },
        render: function() {
            return this._renderIOs();
            // return "ios" === Platform.OS ? this._renderIOs() : "android" === Platform.OS ? this._renderAndroid() : void 0
        },
        _renderIOs: function() {
            var textContainer, autoCapitalize = autoCapitalizeConsts[this.props.autoCapitalize], clearButtonMode = RCTUIManager.UITextField.clearButtonMode[this.props.clearButtonMode], keyboardType = keyboardTypeConsts[crossPlatformKeyboardTypeMap[this.props.keyboardType] || this.props.keyboardType], returnKeyType = returnKeyTypeConsts[this.props.returnKeyType];
            if (this.props.multiline) {
                for (var propKey in notMultiline)
                    if (this.props[propKey])
                        throw new Error("TextInput prop `" + propKey + "` cannot be used with multiline.");
                var children = this.props.children
                  , childCount = 0;
                ReactChildren.forEach(children, function() {
                    return ++childCount
                }),
                invariant(!(this.props.value && childCount), "Cannot specify both value and children."),
                childCount > 1 && (children = React.createElement(Text, null , children)),
                this.props.inputView && (children = [children, this.props.inputView]),
                textContainer = React.createElement(RCTTextView, {
                    ref: "input",
                    style: [styles.input, this.props.style],
                    children: children,
                    mostRecentEventCounter: this.state.mostRecentEventCounter,
                    editable: this.props.editable,
                    keyboardType: keyboardType,
                    returnKeyType: returnKeyType,
                    enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
                    secureTextEntry: this.props.password || this.props.secureTextEntry,
                    onFocus: this._onFocus,
                    onBlur: this._onBlur,
                    onChange: this._onChange,
                    onEndEditing: this.props.onEndEditing,
                    onSelectionChange: this._onSelectionChange,
                    onTextInput: this._onTextInput,
                    onSelectionChangeShouldSetResponder: emptyFunction.thatReturnsTrue,
                    placeholder: this.props.placeholder,
                    placeholderTextColor: this.props.placeholderTextColor,
                    text: this.state.bufferedValue,
                    autoCapitalize: autoCapitalize,
                    autoCorrect: this.props.autoCorrect,
                    clearButtonMode: clearButtonMode,
                    selectTextOnFocus: this.props.selectTextOnFocus,
                    clearTextOnFocus: this.props.clearTextOnFocus
                })
            } else {
                for (var propKey in onlyMultiline)
                    if (this.props[propKey])
                        throw new Error("TextInput prop `" + propKey + "` is only supported with multiline.");
                textContainer = React.createElement(RCTTextField, {
                    ref: "input",
                    style: [styles.input, this.props.style],
                    enabled: this.props.editable,
                    keyboardType: keyboardType,
                    returnKeyType: returnKeyType,
                    enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
                    secureTextEntry: this.props.password || this.props.secureTextEntry,
                    onFocus: this._onFocus,
                    onBlur: this._onBlur,
                    onChange: this._onChange,
                    onEndEditing: this.props.onEndEditing,
                    onSubmitEditing: this.props.onSubmitEditing,
                    onSelectionChangeShouldSetResponder: function() {
                        return !0
                    },
                    placeholder: this.props.placeholder,
                    placeholderTextColor: this.props.placeholderTextColor,
                    text: this.state.bufferedValue,
                    autoCapitalize: autoCapitalize,
                    autoCorrect: this.props.autoCorrect,
                    clearButtonMode: clearButtonMode,
                    clearTextOnFocus: this.props.clearTextOnFocus,
                    selectTextOnFocus: this.props.selectTextOnFocus
                })
            }
            return React.createElement(TouchableWithoutFeedback, {
                onPress: this._onPress,
                rejectResponderTermination: !0
            }, textContainer)
        },
        _renderAndroid: function() {
            var autoCapitalize = autoCapitalizeConsts[this.props.autoCapitalize]
              , textContainer = React.createElement(AndroidTextInput, {
                ref: "input",
                style: [this.props.style],
                autoCapitalize: autoCapitalize,
                autoCorrect: this.props.autoCorrect,
                keyboardType: this.props.keyboardType,
                multiline: this.props.multiline,
                onFocus: this._onFocus,
                onBlur: this._onBlur,
                onChange: this._onChange,
                onEndEditing: this.props.onEndEditing,
                onSubmitEditing: this.props.onSubmitEditing,
                password: this.props.password || this.props.secureTextEntry,
                placeholder: this.props.placeholder,
                text: this.state.bufferedValue
            });
            return React.createElement(TouchableWithoutFeedback, {
                onPress: this._onPress,
                testID: this.props.testID
            }, textContainer)
        },
        _onFocus: function(event) {
            this.props.onFocus && this.props.onFocus(event)
        },
        _onPress: function(event) {
            this.focus()
        },
        _onChange: function(event) {
            this.props.controlled && event.nativeEvent.text !== this.props.value && this.refs.input.setNativeProps({
                text: this.props.value
            }),
            this.props.onChange && this.props.onChange(event),
            this.props.onChangeText && this.props.onChangeText(event.nativeEvent.text)
        },
        _onBlur: function(event) {
            this.blur(),
            this.props.onBlur && this.props.onBlur(event)
        },
        _onSelectionChange: function(event) {
            if (this.props.selectionState) {
                var selection = event.nativeEvent.selection;
                this.props.selectionState.update(selection.start, selection.end)
            }
            this.props.onSelectionChange && this.props.onSelectionChange(event)
        },
        _onTextInput: function(event) {
            this.props.onTextInput && this.props.onTextInput(event);
            var counter = event.nativeEvent.eventCounter;
            counter > this.state.mostRecentEventCounter && this.setState({
                mostRecentEventCounter: counter
            })
        }
    })
      , styles = StyleSheet.create({
        input: {
            alignSelf: "stretch"
        }
    })
      , RCTTextView = createReactNativeComponentClass({
        validAttributes: RCTTextViewAttributes,
        uiViewClassName: "RCTTextView"
    })
      , RCTTextField = createReactNativeComponentClass({
        validAttributes: RCTTextFieldAttributes,
        uiViewClassName: "RCTTextField"
    })
      , AndroidTextInput = createReactNativeComponentClass({
        validAttributes: AndroidTextInputAttributes,
        uiViewClassName: "AndroidTextInput"
    });
    module.exports = TextInput
}),
__d("DocumentSelectionState", ["mixInEventEmitter"], function(global, require, requireDynamic, requireLazy, module, exports) {
    function DocumentSelectionState(anchor, focus) {
        "use strict";
        this.$DocumentSelectionState_anchorOffset = anchor,
        this.$DocumentSelectionState_focusOffset = focus,
        this.$DocumentSelectionState_hasFocus = !1
    }
    var mixInEventEmitter = require("mixInEventEmitter");
    DocumentSelectionState.prototype.update = function(anchor, focus) {
        "use strict";
        (this.$DocumentSelectionState_anchorOffset !== anchor || this.$DocumentSelectionState_focusOffset !== focus) && (this.$DocumentSelectionState_anchorOffset = anchor,
        this.$DocumentSelectionState_focusOffset = focus,
        this.emit("update"))
    }
    ,
    DocumentSelectionState.prototype.constrainLength = function(maxLength) {
        "use strict";
        this.update(Math.min(this.$DocumentSelectionState_anchorOffset, maxLength), Math.min(this.$DocumentSelectionState_focusOffset, maxLength))
    }
    ,
    DocumentSelectionState.prototype.focus = function() {
        "use strict";
        this.$DocumentSelectionState_hasFocus || (this.$DocumentSelectionState_hasFocus = !0,
        this.emit("focus"))
    }
    ,
    DocumentSelectionState.prototype.blur = function() {
        "use strict";
        this.$DocumentSelectionState_hasFocus && (this.$DocumentSelectionState_hasFocus = !1,
        this.emit("blur"))
    }
    ,
    DocumentSelectionState.prototype.hasFocus = function() {
        "use strict";
        return this.$DocumentSelectionState_hasFocus
    }
    ,
    DocumentSelectionState.prototype.isCollapsed = function() {
        "use strict";
        return this.$DocumentSelectionState_anchorOffset === this.$DocumentSelectionState_focusOffset
    }
    ,
    DocumentSelectionState.prototype.isBackward = function() {
        "use strict";
        return this.$DocumentSelectionState_anchorOffset > this.$DocumentSelectionState_focusOffset
    }
    ,
    DocumentSelectionState.prototype.getAnchorOffset = function() {
        "use strict";
        return this.$DocumentSelectionState_hasFocus ? this.$DocumentSelectionState_anchorOffset : null 
    }
    ,
    DocumentSelectionState.prototype.getFocusOffset = function() {
        "use strict";
        return this.$DocumentSelectionState_hasFocus ? this.$DocumentSelectionState_focusOffset : null 
    }
    ,
    DocumentSelectionState.prototype.getStartOffset = function() {
        "use strict";
        return this.$DocumentSelectionState_hasFocus ? Math.min(this.$DocumentSelectionState_anchorOffset, this.$DocumentSelectionState_focusOffset) : null 
    }
    ,
    DocumentSelectionState.prototype.getEndOffset = function() {
        "use strict";
        return this.$DocumentSelectionState_hasFocus ? Math.max(this.$DocumentSelectionState_anchorOffset, this.$DocumentSelectionState_focusOffset) : null 
    }
    ,
    DocumentSelectionState.prototype.overlaps = function(start, end) {
        "use strict";
        return this.hasFocus() && this.getStartOffset() <= end && start <= this.getEndOffset()
    }
    ,
    mixInEventEmitter(DocumentSelectionState, {
        blur: !0,
        focus: !0,
        update: !0
    }),
    module.exports = DocumentSelectionState
}),
__d("mixInEventEmitter", ["EventEmitter", "EventEmitterWithHolding", "EventHolder", "EventValidator", "copyProperties", "invariant", "keyOf"], function(global, require, requireDynamic, requireLazy, module, exports) {
    function mixInEventEmitter(klass, types) {
        invariant(types, "Must supply set of valid event types"),
        invariant(!this.__eventEmitter, "An active emitter is already mixed in");
        var target = klass.prototype || klass
          , ctor = klass.constructor;
        ctor && invariant(ctor === Object || ctor === Function, "Mix EventEmitter into a class, not an instance"),
        target.hasOwnProperty(TYPES_KEY) ? copyProperties(target.__types, types) : target.__types ? target.__types = copyProperties({}, target.__types, types) : target.__types = types,
        copyProperties(target, EventEmitterMixin)
    }
    var EventEmitter = require("EventEmitter")
      , EventEmitterWithHolding = require("EventEmitterWithHolding")
      , EventHolder = require("EventHolder")
      , EventValidator = require("EventValidator")
      , copyProperties = require("copyProperties")
      , invariant = require("invariant")
      , keyOf = require("keyOf")
      , TYPES_KEY = keyOf({
        __types: !0
    })
      , EventEmitterMixin = {
        emit: function(eventType, a, b, c, d, e, _) {
            return this.__getEventEmitter().emit(eventType, a, b, c, d, e, _)
        },
        emitAndHold: function(eventType, a, b, c, d, e, _) {
            return this.__getEventEmitter().emitAndHold(eventType, a, b, c, d, e, _)
        },
        addListener: function(eventType, listener, context) {
            return this.__getEventEmitter().addListener(eventType, listener, context)
        },
        once: function(eventType, listener, context) {
            return this.__getEventEmitter().once(eventType, listener, context)
        },
        addRetroactiveListener: function(eventType, listener, context) {
            return this.__getEventEmitter().addRetroactiveListener(eventType, listener, context)
        },
        addListenerMap: function(listenerMap, context) {
            return this.__getEventEmitter().addListenerMap(listenerMap, context)
        },
        addRetroactiveListenerMap: function(listenerMap, context) {
            return this.__getEventEmitter().addListenerMap(listenerMap, context)
        },
        removeAllListeners: function() {
            this.__getEventEmitter().removeAllListeners()
        },
        removeCurrentListener: function() {
            this.__getEventEmitter().removeCurrentListener()
        },
        releaseHeldEventType: function(eventType) {
            this.__getEventEmitter().releaseHeldEventType(eventType)
        },
        __getEventEmitter: function() {
            if (!this.__eventEmitter) {
                var emitter = new EventEmitter;
                emitter = EventValidator.addValidation(emitter, this.__types);
                var holder = new EventHolder;
                this.__eventEmitter = new EventEmitterWithHolding(emitter,holder)
            }
            return this.__eventEmitter
        }
    };
    module.exports = mixInEventEmitter
}),
__d("EventEmitterWithHolding", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function EventEmitterWithHolding(emitter, holder) {
        this.$EventEmitterWithHolding_emitter = emitter,
        this.$EventEmitterWithHolding_eventHolder = holder,
        this.$EventEmitterWithHolding_currentEventToken = null ,
        this.$EventEmitterWithHolding_emittingHeldEvents = !1
    }
    EventEmitterWithHolding.prototype.addListener = function(eventType, listener, context) {
        return this.$EventEmitterWithHolding_emitter.addListener(eventType, listener, context)
    }
    ,
    EventEmitterWithHolding.prototype.once = function(eventType, listener, context) {
        return this.$EventEmitterWithHolding_emitter.once(eventType, listener, context)
    }
    ,
    EventEmitterWithHolding.prototype.addRetroactiveListener = function(eventType, listener, context) {
        var subscription = this.$EventEmitterWithHolding_emitter.addListener(eventType, listener, context);
        return this.$EventEmitterWithHolding_emittingHeldEvents = !0,
        this.$EventEmitterWithHolding_eventHolder.emitToListener(eventType, listener, context),
        this.$EventEmitterWithHolding_emittingHeldEvents = !1,
        subscription
    }
    ,
    EventEmitterWithHolding.prototype.removeAllListeners = function(eventType) {
        this.$EventEmitterWithHolding_emitter.removeAllListeners(eventType)
    }
    ,
    EventEmitterWithHolding.prototype.removeCurrentListener = function() {
        this.$EventEmitterWithHolding_emitter.removeCurrentListener()
    }
    ,
    EventEmitterWithHolding.prototype.listeners = function(eventType) {
        return this.$EventEmitterWithHolding_emitter.listeners(eventType)
    }
    ,
    EventEmitterWithHolding.prototype.emit = function(eventType, a, b, c, d, e, $EventEmitterWithHolding_) {
        this.$EventEmitterWithHolding_emitter.emit(eventType, a, b, c, d, e, $EventEmitterWithHolding_)
    }
    ,
    EventEmitterWithHolding.prototype.emitAndHold = function(eventType, a, b, c, d, e, $EventEmitterWithHolding_) {
        this.$EventEmitterWithHolding_currentEventToken = this.$EventEmitterWithHolding_eventHolder.holdEvent(eventType, a, b, c, d, e, $EventEmitterWithHolding_),
        this.$EventEmitterWithHolding_emitter.emit(eventType, a, b, c, d, e, $EventEmitterWithHolding_),
        this.$EventEmitterWithHolding_currentEventToken = null 
    }
    ,
    EventEmitterWithHolding.prototype.releaseCurrentEvent = function() {
        null  !== this.$EventEmitterWithHolding_currentEventToken ? this.$EventEmitterWithHolding_eventHolder.releaseEvent(this.$EventEmitterWithHolding_currentEventToken) : this.$EventEmitterWithHolding_emittingHeldEvents && this.$EventEmitterWithHolding_eventHolder.releaseCurrentEvent()
    }
    ,
    EventEmitterWithHolding.prototype.releaseHeldEventType = function(eventType) {
        this.$EventEmitterWithHolding_eventHolder.releaseEventType(eventType)
    }
    ,
    module.exports = EventEmitterWithHolding
}),
__d("EventHolder", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function EventHolder() {
        this.$EventHolder_heldEvents = {},
        this.$EventHolder_currentEventKey = null 
    }
    var invariant = require("invariant");
    EventHolder.prototype.holdEvent = function(eventType, a, b, c, d, e, $EventHolder_) {
        this.$EventHolder_heldEvents[eventType] = this.$EventHolder_heldEvents[eventType] || [];
        var eventsOfType = this.$EventHolder_heldEvents[eventType]
          , key = {
            eventType: eventType,
            index: eventsOfType.length
        };
        return eventsOfType.push([a, b, c, d, e, $EventHolder_]),
        key
    }
    ,
    EventHolder.prototype.emitToListener = function(eventType, listener, context) {
        var eventsOfType = this.$EventHolder_heldEvents[eventType];
        if (eventsOfType) {
            var origEventKey = this.$EventHolder_currentEventKey;
            eventsOfType.forEach(function(eventHeld, index) {
                eventHeld && (this.$EventHolder_currentEventKey = {
                    eventType: eventType,
                    index: index
                },
                listener.apply(context, eventHeld))
            }
            .bind(this)),
            this.$EventHolder_currentEventKey = origEventKey
        }
    }
    ,
    EventHolder.prototype.releaseCurrentEvent = function() {
        invariant(null  !== this.$EventHolder_currentEventKey, "Not in an emitting cycle; there is no current event"),
        this.releaseEvent(this.$EventHolder_currentEventKey)
    }
    ,
    EventHolder.prototype.releaseEvent = function(token) {
        delete this.$EventHolder_heldEvents[token.eventType][token.index]
    }
    ,
    EventHolder.prototype.releaseEventType = function(type) {
        this.$EventHolder_heldEvents[type] = []
    }
    ,
    module.exports = EventHolder
}),
__d("EventValidator", ["copyProperties"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function assertAllowsEventType(type, allowedTypes) {
        if (-1 === allowedTypes.indexOf(type))
            throw new TypeError(errorMessageFor(type, allowedTypes))
    }
    function errorMessageFor(type, allowedTypes) {
        var message = 'Unknown event type "' + type + '". ';
        return __DEV__ && (message += recommendationFor(type, allowedTypes)),
        message += "Known event types: " + allowedTypes.join(", ") + "."
    }
    var copyProperties = require("copyProperties")
      , EventValidator = {
        addValidation: function(emitter, types) {
            var eventTypes = Object.keys(types)
              , emitterWithValidation = Object.create(emitter);
            return copyProperties(emitterWithValidation, {
                emit: function(type, a, b, c, d, e, _) {
                    return assertAllowsEventType(type, eventTypes),
                    emitter.emit.call(this, type, a, b, c, d, e, _)
                }
            }),
            emitterWithValidation
        }
    };
    if (__DEV__)
        var recommendationFor = function(type, allowedTypes) {
            var closestTypeRecommendation = closestTypeFor(type, allowedTypes);
            return isCloseEnough(closestTypeRecommendation, type) ? 'Did you mean "' + closestTypeRecommendation.type + '"? ' : ""
        }
          , closestTypeFor = function(type, allowedTypes) {
            var typeRecommendations = allowedTypes.map(typeRecommendationFor.bind(this, type));
            return typeRecommendations.sort(recommendationSort)[0]
        }
          , typeRecommendationFor = function(type, recomendedType) {
            return {
                type: recomendedType,
                distance: damerauLevenshteinDistance(type, recomendedType)
            }
        }
          , recommendationSort = function(recommendationA, recommendationB) {
            return recommendationA.distance < recommendationB.distance ? -1 : recommendationA.distance > recommendationB.distance ? 1 : 0
        }
          , isCloseEnough = function(closestType, actualType) {
            return closestType.distance / actualType.length < .334
        }
          , damerauLevenshteinDistance = function(a, b) {
            var i, j, d = [];
            for (i = 0; i <= a.length; i++)
                d[i] = [i];
            for (j = 1; j <= b.length; j++)
                d[0][j] = j;
            for (i = 1; i <= a.length; i++)
                for (j = 1; j <= b.length; j++) {
                    var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
                    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost),
                    i > 1 && j > 1 && a.charAt(i - 1) == b.charAt(j - 2) && a.charAt(i - 2) == b.charAt(j - 1) && (d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost))
                }
            return d[a.length][b.length]
        }
        ;
    module.exports = EventValidator
}),
__d("copyProperties", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function copyProperties(obj, a, b, c, d, e, f) {
        if (obj = obj || {},
        __DEV__ && f)
            throw new Error("Too many arguments passed to copyProperties");
        for (var v, args = [a, b, c, d, e], ii = 0; args[ii]; ) {
            v = args[ii++];
            for (var k in v)
                obj[k] = v[k];
            v.hasOwnProperty && v.hasOwnProperty("toString") && "undefined" != typeof v.toString && obj.toString !== v.toString && (obj.toString = v.toString)
        }
        return obj
    }
    module.exports = copyProperties
}),
__d("TouchableWithoutFeedback", ["React", "Touchable", "onlyChild"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var React = require("React")
      , Touchable = require("Touchable")
      , onlyChild = require("onlyChild")
      , PRESS_RECT_OFFSET = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 30
    }
      , TouchableWithoutFeedback = React.createClass({
        displayName: "TouchableWithoutFeedback",
        mixins: [Touchable.Mixin],
        propTypes: {
            onPress: React.PropTypes.func,
            onPressIn: React.PropTypes.func,
            onPressOut: React.PropTypes.func,
            onLongPress: React.PropTypes.func
        },
        getInitialState: function() {
            return this.touchableGetInitialState()
        },
        touchableHandlePress: function(e) {
            this.props.onPress && this.props.onPress(e)
        },
        touchableHandleActivePressIn: function() {
            this.props.onPressIn && this.props.onPressIn()
        },
        touchableHandleActivePressOut: function() {
            this.props.onPressOut && this.props.onPressOut()
        },
        touchableHandleLongPress: function() {
            this.props.onLongPress && this.props.onLongPress()
        },
        touchableGetPressRectOffset: function() {
            return PRESS_RECT_OFFSET
        },
        touchableGetHighlightDelayMS: function() {
            return 0
        },
        render: function() {
            return React.cloneElement(onlyChild(this.props.children), {
                accessible: !0,
                testID: this.props.testID,
                onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
                onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
                onResponderGrant: this.touchableHandleResponderGrant,
                onResponderMove: this.touchableHandleResponderMove,
                onResponderRelease: this.touchableHandleResponderRelease,
                onResponderTerminate: this.touchableHandleResponderTerminate
            })
        }
    });
    module.exports = TouchableWithoutFeedback
}),
__d("TouchableHighlight", ["NativeMethodsMixin", "React", "ReactNativeViewAttributes", "StyleSheet", "react-timer-mixin/TimerMixin", "Touchable", "TouchableWithoutFeedback", "View", "cloneWithProps", "ensureComponentIsNative", "keyOf", "merge", "onlyChild"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , React = require("React")
      , ReactNativeViewAttributes = require("ReactNativeViewAttributes")
      , StyleSheet = require("StyleSheet")
      , TimerMixin = require("react-timer-mixin/TimerMixin")
      , Touchable = require("Touchable")
      , TouchableWithoutFeedback = require("TouchableWithoutFeedback")
      , View = require("View")
      , cloneWithProps = require("cloneWithProps")
      , ensureComponentIsNative = require("ensureComponentIsNative")
      , keyOf = require("keyOf")
      , merge = require("merge")
      , onlyChild = require("onlyChild")
      , DEFAULT_PROPS = {
        activeOpacity: .8,
        underlayColor: "black"
    }
      , TouchableHighlight = React.createClass({
        displayName: "TouchableHighlight",
        propTypes: Object.assign({}, TouchableWithoutFeedback.propTypes, {
            activeOpacity: React.PropTypes.number,
            underlayColor: React.PropTypes.string,
            style: View.propTypes.style
        }),
        mixins: [NativeMethodsMixin, TimerMixin, Touchable.Mixin],
        getDefaultProps: function() {
            return DEFAULT_PROPS
        },
        computeSyntheticState: function(props) {
            return {
                activeProps: {
                    style: {
                        opacity: props.activeOpacity
                    }
                },
                activeUnderlayProps: {
                    style: {
                        backgroundColor: props.underlayColor
                    }
                },
                underlayStyle: [INACTIVE_UNDERLAY_PROPS.style, props.style]
            }
        },
        getInitialState: function() {
            return merge(this.touchableGetInitialState(), this.computeSyntheticState(this.props))
        },
        componentDidMount: function() {
            ensureComponentIsNative(this.refs[CHILD_REF])
        },
        componentDidUpdate: function() {
            ensureComponentIsNative(this.refs[CHILD_REF])
        },
        componentWillReceiveProps: function(nextProps) {
            (nextProps.activeOpacity !== this.props.activeOpacity || nextProps.underlayColor !== this.props.underlayColor || nextProps.style !== this.props.style) && this.setState(this.computeSyntheticState(nextProps))
        },
        viewConfig: {
            uiViewClassName: "RCTView",
            validAttributes: ReactNativeViewAttributes.RCTView
        },
        touchableHandleActivePressIn: function() {
            this.clearTimeout(this._hideTimeout),
            this._hideTimeout = null ,
            this._showUnderlay(),
            this.props.onPressIn && this.props.onPressIn()
        },
        touchableHandleActivePressOut: function() {
            this._hideTimeout || this._hideUnderlay(),
            this.props.onPressOut && this.props.onPressOut()
        },
        touchableHandlePress: function() {
            this.clearTimeout(this._hideTimeout),
            this._showUnderlay(),
            this._hideTimeout = this.setTimeout(this._hideUnderlay, 100),
            this.props.onPress && this.props.onPress()
        },
        touchableHandleLongPress: function() {
            this.props.onLongPress && this.props.onLongPress()
        },
        touchableGetPressRectOffset: function() {
            return PRESS_RECT_OFFSET
        },
        _showUnderlay: function() {
            this.refs[UNDERLAY_REF].setNativeProps(this.state.activeUnderlayProps),
            this.refs[CHILD_REF].setNativeProps(this.state.activeProps)
        },
        _hideUnderlay: function() {
            this.clearTimeout(this._hideTimeout),
            this._hideTimeout = null ,
            this.refs[UNDERLAY_REF] && (this.refs[CHILD_REF].setNativeProps(INACTIVE_CHILD_PROPS),
            this.refs[UNDERLAY_REF].setNativeProps(Object.assign({}, INACTIVE_UNDERLAY_PROPS, {
                style: this.state.underlayStyle
            })))
        },
        render: function() {
            return React.createElement(View, {
                ref: UNDERLAY_REF,
                style: this.state.underlayStyle,
                onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
                onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
                onResponderGrant: this.touchableHandleResponderGrant,
                onResponderMove: this.touchableHandleResponderMove,
                onResponderRelease: this.touchableHandleResponderRelease,
                onResponderTerminate: this.touchableHandleResponderTerminate
            }, cloneWithProps(onlyChild(this.props.children), {
                ref: CHILD_REF,
                accessible: !0,
                testID: this.props.testID
            }))
        }
    })
      , PRESS_RECT_OFFSET = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 30
    }
      , CHILD_REF = keyOf({
        childRef: null 
    })
      , UNDERLAY_REF = keyOf({
        underlayRef: null 
    })
      , INACTIVE_CHILD_PROPS = {
        style: StyleSheet.create({
            x: {
                opacity: 1
            }
        }).x
    }
      , INACTIVE_UNDERLAY_PROPS = {
        style: StyleSheet.create({
            x: {
                backgroundColor: "transparent"
            }
        }).x
    };
    module.exports = TouchableHighlight
}),
__d("cloneWithProps", ["ReactElement", "ReactPropTransferer", "keyOf", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function cloneWithProps(child, props) {
        __DEV__ && warning(!child.ref, "You are calling cloneWithProps() on a child with a ref. This is dangerous because you're creating a new child which will not be added as a ref to its parent.");
        var newProps = ReactPropTransferer.mergeProps(props, child.props);
        return !newProps.hasOwnProperty(CHILDREN_PROP) && child.props.hasOwnProperty(CHILDREN_PROP) && (newProps.children = child.props.children),
        ReactElement.createElement(child.type, newProps)
    }
    var ReactElement = require("ReactElement")
      , ReactPropTransferer = require("ReactPropTransferer")
      , keyOf = require("keyOf")
      , warning = require("warning")
      , CHILDREN_PROP = keyOf({
        children: null 
    });
    module.exports = cloneWithProps
}),
__d("ReactPropTransferer", ["Object.assign", "emptyFunction", "joinClasses"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function createTransferStrategy(mergeStrategy) {
        return function(props, key, value) {
            props.hasOwnProperty(key) ? props[key] = mergeStrategy(props[key], value) : props[key] = value
        }
    }
    function transferInto(props, newProps) {
        for (var thisKey in newProps)
            if (newProps.hasOwnProperty(thisKey)) {
                var transferStrategy = TransferStrategies[thisKey];
                transferStrategy && TransferStrategies.hasOwnProperty(thisKey) ? transferStrategy(props, thisKey, newProps[thisKey]) : props.hasOwnProperty(thisKey) || (props[thisKey] = newProps[thisKey])
            }
        return props
    }
    var assign = require("Object.assign")
      , emptyFunction = require("emptyFunction")
      , joinClasses = require("joinClasses")
      , transferStrategyMerge = createTransferStrategy(function(a, b) {
        return assign({}, b, a)
    })
      , TransferStrategies = {
        children: emptyFunction,
        className: createTransferStrategy(joinClasses),
        style: transferStrategyMerge
    }
      , ReactPropTransferer = {
        mergeProps: function(oldProps, newProps) {
            return transferInto(assign({}, oldProps), newProps)
        }
    };
    module.exports = ReactPropTransferer
}),
__d("joinClasses", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function joinClasses(className) {
        className || (className = "");
        var nextClass, argLength = arguments.length;
        if (argLength > 1)
            for (var ii = 1; argLength > ii; ii++)
                nextClass = arguments[ii],
                nextClass && (className = (className ? className + " " : "") + nextClass);
        return className
    }
    module.exports = joinClasses
}),
__d("ensureComponentIsNative", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , ensureComponentIsNative = function(component) {
        invariant(component && "function" == typeof component.setNativeProps, "Touchable child must either be native or forward setNativeProps to a native component")
    }
    ;
    module.exports = ensureComponentIsNative
}),
__d("TouchableOpacity", ["NativeMethodsMixin", "POPAnimationMixin", "React", "Touchable", "TouchableWithoutFeedback", "cloneWithProps", "ensureComponentIsNative", "flattenStyle", "keyOf", "onlyChild"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeMethodsMixin = require("NativeMethodsMixin")
      , POPAnimationMixin = require("POPAnimationMixin")
      , React = require("React")
      , Touchable = require("Touchable")
      , TouchableWithoutFeedback = require("TouchableWithoutFeedback")
      , cloneWithProps = require("cloneWithProps")
      , ensureComponentIsNative = require("ensureComponentIsNative")
      , flattenStyle = require("flattenStyle")
      , keyOf = require("keyOf")
      , onlyChild = require("onlyChild")
      , TouchableOpacity = React.createClass({
        displayName: "TouchableOpacity",
        mixins: [Touchable.Mixin, NativeMethodsMixin, POPAnimationMixin],
        propTypes: Object.assign({}, TouchableWithoutFeedback.propTypes, {
            activeOpacity: React.PropTypes.number
        }),
        getDefaultProps: function() {
            return {
                activeOpacity: .2
            }
        },
        getInitialState: function() {
            return this.touchableGetInitialState()
        },
        componentDidMount: function() {
            ensureComponentIsNative(this.refs[CHILD_REF])
        },
        componentDidUpdate: function() {
            ensureComponentIsNative(this.refs[CHILD_REF])
        },
        setOpacityTo: function(value) {
            if (POPAnimationMixin) {
                this.stopAllAnimations();
                var anim = {
                    type: this.AnimationTypes.linear,
                    property: this.AnimationProperties.opacity,
                    toValue: value
                };
                this.startAnimation(CHILD_REF, anim)
            } else
                this.refs[CHILD_REF].setNativeProps({
                    opacity: value
                })
        },
        touchableHandleActivePressIn: function() {
            this.refs[CHILD_REF].setNativeProps({
                opacity: this.props.activeOpacity
            }),
            this.props.onPressIn && this.props.onPressIn()
        },
        touchableHandleActivePressOut: function() {
            var child = onlyChild(this.props.children)
              , childStyle = flattenStyle(child.props.style) || {};
            this.setOpacityTo(void 0 === childStyle.opacity ? 1 : childStyle.opacity),
            this.props.onPressOut && this.props.onPressOut()
        },
        touchableHandlePress: function() {
            this.props.onPress && this.props.onPress()
        },
        touchableHandleLongPress: function() {
            this.props.onLongPress && this.props.onLongPress()
        },
        touchableGetPressRectOffset: function() {
            return PRESS_RECT_OFFSET
        },
        touchableGetHighlightDelayMS: function() {
            return 0
        },
        render: function() {
            return cloneWithProps(onlyChild(this.props.children), {
                ref: CHILD_REF,
                accessible: !0,
                testID: this.props.testID,
                onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
                onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
                onResponderGrant: this.touchableHandleResponderGrant,
                onResponderMove: this.touchableHandleResponderMove,
                onResponderRelease: this.touchableHandleResponderRelease,
                onResponderTerminate: this.touchableHandleResponderTerminate
            })
        }
    })
      , PRESS_RECT_OFFSET = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 30
    }
      , CHILD_REF = keyOf({
        childRef: null 
    });
    module.exports = TouchableOpacity
}),
__d("POPAnimationMixin", ["POPAnimation", "React", "invariant", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var POPAnimationOrNull = require("POPAnimation")
      , React = require("React");
    if (POPAnimationOrNull) {
        var POPAnimation = POPAnimationOrNull
          , invariant = require("invariant")
          , warning = require("warning")
          , POPAnimationMixin = {
            AnimationTypes: POPAnimation.Types,
            AnimationProperties: POPAnimation.Properties,
            getInitialState: function() {
                return {
                    _currentAnimationsByNodeHandle: {}
                }
            },
            _ensureBookkeepingSetup: function(nodeHandle) {
                this.state._currentAnimationsByNodeHandle[nodeHandle] || (this.state._currentAnimationsByNodeHandle[nodeHandle] = [])
            },
            startAnimation: function(refKey, anim, doneCallback) {
                var animID = 0;
                "number" == typeof anim ? animID = anim : (invariant(anim instanceof Object && void 0 !== anim.type && void 0 !== anim.property, "Animation definitions must specify a type of animation and a property to animate."),
                animID = POPAnimation.createAnimation(anim.type, anim)),
                invariant(this.refs[refKey], "Invalid refKey " + refKey + " for anim:\n" + JSON.stringify(anim) + "\nvalid refs: " + JSON.stringify(Object.keys(this.refs)));
                var refNodeHandle = React.findNodeHandle(this.refs[refKey]);
                this.startAnimationWithNodeHandle(refNodeHandle, animID, doneCallback)
            },
            startAnimationWithNodeHandle: function(nodeHandle, animID, doneCallback) {
                this._ensureBookkeepingSetup(nodeHandle);
                var animations = this.state._currentAnimationsByNodeHandle[nodeHandle]
                  , animIndex = animations.length;
                animations.push(animID);
                var cleanupWrapper = function(finished) {
                    if (this.isMounted()) {
                        animations[animIndex] = 0;
                        for (var allDone = !0, ii = 0; ii < animations.length; ii++)
                            if (animations[ii]) {
                                allDone = !1;
                                break
                            }
                        allDone && (this.state._currentAnimationsByNodeHandle[nodeHandle] = void 0),
                        doneCallback && doneCallback(finished)
                    }
                }
                .bind(this);
                POPAnimation.addAnimation(nodeHandle, animID, cleanupWrapper)
            },
            startAnimations: function(animations, onSuccess, onFailure) {
                var numReturned = 0
                  , numFinished = 0
                  , numAnimations = animations.length
                  , metaCallback = function(finished) {
                    finished && ++numFinished,
                    ++numReturned === numAnimations && onSuccess && onSuccess(numFinished === numAnimations)
                }
                ;
                animations.forEach(function(anim) {
                    warning(null  != anim.ref || null  != anim.nodeHandle && !anim.ref != !anim.nodeHandle, "Animations must be specified with either ref xor nodeHandle"),
                    anim.ref ? this.startAnimation(anim.ref, anim.anim, metaCallback) : anim.nodeHandle && this.startAnimationWithNodeHandle(anim.nodeHandle, anim.anim, metaCallback)
                }
                .bind(this))
            },
            stopNodeHandleAnimations: function(nodeHandle) {
                if (this.state._currentAnimationsByNodeHandle[nodeHandle]) {
                    for (var anims = this.state._currentAnimationsByNodeHandle[nodeHandle], i = 0; i < anims.length; i++) {
                        var anim = anims[i];
                        anim && POPAnimation.removeAnimation(+nodeHandle, anim)
                    }
                    this.state._currentAnimationsByNodeHandle[nodeHandle] = void 0
                }
            },
            stopAnimations: function(refKey) {
                invariant(this.refs[refKey], "invalid ref"),
                this.stopNodeHandleAnimations(React.findNodeHandle(this.refs[refKey]))
            },
            stopAllAnimations: function() {
                for (var nodeHandle in this.state._currentAnimationsByNodeHandle)
                    this.stopNodeHandleAnimations(nodeHandle)
            },
            animateToFrame: function(refKey, frame, type, velocity, doneCallback) {
                var animFrame = {
                    x: frame.left + frame.width / 2,
                    y: frame.top + frame.height / 2,
                    w: frame.width,
                    h: frame.height
                }
                  , posAnim = POPAnimation.createAnimation(type, {
                    property: POPAnimation.Properties.position,
                    toValue: [animFrame.x, animFrame.y],
                    velocity: velocity || [0, 0]
                })
                  , sizeAnim = POPAnimation.createAnimation(type, {
                    property: POPAnimation.Properties.size,
                    toValue: [animFrame.w, animFrame.h]
                });
                this.startAnimation(refKey, posAnim, doneCallback),
                this.startAnimation(refKey, sizeAnim)
            },
            componentWillUnmount: function() {
                this.stopAllAnimations()
            }
        };
        module.exports = POPAnimationMixin
    } else
        module.exports = null 
}),
__d("POPAnimation", ["NativeModules", "ReactPropTypes", "createStrictShapeTypeChecker", "getObjectValues", "invariant", "merge"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var RCTPOPAnimationManager = require("NativeModules").POPAnimationManager;
    if (RCTPOPAnimationManager) {
        var ReactPropTypes = require("ReactPropTypes")
          , createStrictShapeTypeChecker = require("createStrictShapeTypeChecker")
          , getObjectValues = require("getObjectValues")
          , invariant = require("invariant")
          , merge = require("merge")
          , RCTTypes = RCTPOPAnimationManager.Types
          , RCTProperties = RCTPOPAnimationManager.Properties
          , Properties = {
            bounds: RCTProperties.bounds,
            opacity: RCTProperties.opacity,
            position: RCTProperties.position,
            positionX: RCTProperties.positionX,
            positionY: RCTProperties.positionY,
            zPosition: RCTProperties.zPosition,
            rotation: RCTProperties.rotation,
            rotationX: RCTProperties.rotationX,
            rotationY: RCTProperties.rotationY,
            scaleX: RCTProperties.scaleX,
            scaleXY: RCTProperties.scaleXY,
            scaleY: RCTProperties.scaleY,
            shadowColor: RCTProperties.shadowColor,
            shadowOffset: RCTProperties.shadowOffset,
            shadowOpacity: RCTProperties.shadowOpacity,
            shadowRadius: RCTProperties.shadowRadius,
            size: RCTProperties.size,
            subscaleXY: RCTProperties.subscaleXY,
            subtranslationX: RCTProperties.subtranslationX,
            subtranslationXY: RCTProperties.subtranslationXY,
            subtranslationY: RCTProperties.subtranslationY,
            subtranslationZ: RCTProperties.subtranslationZ,
            translationX: RCTProperties.translationX,
            translationXY: RCTProperties.translationXY,
            translationY: RCTProperties.translationY,
            translationZ: RCTProperties.translationZ
        }
          , Types = {
            decay: RCTTypes.decay,
            easeIn: RCTTypes.easeIn,
            easeInEaseOut: RCTTypes.easeInEaseOut,
            easeOut: RCTTypes.easeOut,
            linear: RCTTypes.linear,
            spring: RCTTypes.spring
        }
          , POPAnimation = {
            Types: Types,
            Properties: Properties,
            attributeChecker: createStrictShapeTypeChecker({
                type: ReactPropTypes.oneOf(getObjectValues(Types)),
                property: ReactPropTypes.oneOf(getObjectValues(Properties)),
                fromValue: ReactPropTypes.any,
                toValue: ReactPropTypes.any,
                duration: ReactPropTypes.any,
                velocity: ReactPropTypes.any,
                deceleration: ReactPropTypes.any,
                springBounciness: ReactPropTypes.any,
                dynamicsFriction: ReactPropTypes.any,
                dynamicsMass: ReactPropTypes.any,
                dynamicsTension: ReactPropTypes.any
            }),
            lastUsedTag: 0,
            allocateTagForAnimation: function() {
                return ++this.lastUsedTag
            },
            createAnimation: function(typeName, attrs) {
                var tag = this.allocateTagForAnimation();
                return __DEV__ && (POPAnimation.attributeChecker({
                    attrs: attrs
                }, "attrs", "POPAnimation.createAnimation"),
                POPAnimation.attributeChecker({
                    attrs: {
                        type: typeName
                    }
                }, "attrs", "POPAnimation.createAnimation")),
                RCTPOPAnimationManager.createAnimationInternal(tag, typeName, attrs),
                tag
            },
            createSpringAnimation: function(attrs) {
                return this.createAnimation(this.Types.spring, attrs)
            },
            createDecayAnimation: function(attrs) {
                return this.createAnimation(this.Types.decay, attrs)
            },
            createLinearAnimation: function(attrs) {
                return this.createAnimation(this.Types.linear, attrs)
            },
            createEaseInAnimation: function(attrs) {
                return this.createAnimation(this.Types.easeIn, attrs)
            },
            createEaseOutAnimation: function(attrs) {
                return this.createAnimation(this.Types.easeOut, attrs)
            },
            createEaseInEaseOutAnimation: function(attrs) {
                return this.createAnimation(this.Types.easeInEaseOut, attrs)
            },
            addAnimation: function(nodeHandle, anim, callback) {
                RCTPOPAnimationManager.addAnimation(nodeHandle, anim, callback)
            },
            removeAnimation: function(nodeHandle, anim) {
                RCTPOPAnimationManager.removeAnimation(nodeHandle, anim)
            }
        };
        if (__DEV__) {
            var allProperties = merge(RCTPOPAnimationManager.Properties, RCTPOPAnimationManager.Properties);
            for (var key in allProperties)
                invariant(POPAnimation.Properties[key] === RCTPOPAnimationManager.Properties[key], "POPAnimation doesn't copy property " + key + " correctly");
            var allTypes = merge(RCTPOPAnimationManager.Types, RCTPOPAnimationManager.Types);
            for (var key in allTypes)
                invariant(POPAnimation.Types[key] === RCTPOPAnimationManager.Types[key], "POPAnimation doesn't copy type " + key + " correctly")
        }
        module.exports = POPAnimation
    } else
        module.exports = null 
}),
__d("getObjectValues", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    function getObjectValues(obj) {
        var values = [];
        for (var key in obj)
            values.push(obj[key]);
        return values
    }
    module.exports = getObjectValues
}),
__d("WebView", ["ActivityIndicatorIOS", "EdgeInsetsPropType", "React", "ReactNativeViewAttributes", "StyleSheet", "Text", "View", "invariant", "keyMirror", "requireNativeComponent", "NativeModules"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ActivityIndicatorIOS = require("ActivityIndicatorIOS")
      , EdgeInsetsPropType = require("EdgeInsetsPropType")
      , React = require("React")
      , StyleSheet = (require("ReactNativeViewAttributes"),
    require("StyleSheet"))
      , Text = require("Text")
      , View = require("View")
      , invariant = require("invariant")
      , keyMirror = require("keyMirror")
      , requireNativeComponent = require("requireNativeComponent")
      , PropTypes = React.PropTypes
      , RCTWebViewManager = require("NativeModules").WebViewManager
      , BGWASH = "rgba(255,255,255,0.8)"
      , RCT_WEBVIEW_REF = "webview"
      , WebViewState = keyMirror({
        IDLE: null ,
        LOADING: null ,
        ERROR: null 
    })
      , NavigationType = {
        click: RCTWebViewManager.NavigationType.LinkClicked,
        formsubmit: RCTWebViewManager.NavigationType.FormSubmitted,
        backforward: RCTWebViewManager.NavigationType.BackForward,
        reload: RCTWebViewManager.NavigationType.Reload,
        formresubmit: RCTWebViewManager.NavigationType.FormResubmitted,
        other: RCTWebViewManager.NavigationType.Other
    }
      , defaultRenderLoading = function() {
        return React.createElement(View, {
            style: styles.loadingView
        }, React.createElement(ActivityIndicatorIOS, null ))
    }
      , defaultRenderError = function(errorDomain, errorCode, errorDesc) {
        return React.createElement(View, {
            style: styles.errorContainer
        }, React.createElement(Text, {
            style: styles.errorTextTitle
        }, "Error loading page"), React.createElement(Text, {
            style: styles.errorText
        }, "Domain: " + errorDomain), React.createElement(Text, {
            style: styles.errorText
        }, "Error Code: " + errorCode), React.createElement(Text, {
            style: styles.errorText
        }, "Description: " + errorDesc))
    }
      , WebView = React.createClass({
        displayName: "WebView",
        statics: {
            NavigationType: NavigationType
        },
        propTypes: {
            url: PropTypes.string,
            html: PropTypes.string,
            renderError: PropTypes.func,
            renderLoading: PropTypes.func,
            bounces: PropTypes.bool,
            scrollEnabled: PropTypes.bool,
            automaticallyAdjustContentInsets: PropTypes.bool,
            shouldInjectAJAXHandler: PropTypes.bool,
            contentInset: EdgeInsetsPropType,
            onNavigationStateChange: PropTypes.func,
            startInLoadingState: PropTypes.bool,
            style: View.propTypes.style,
            javaScriptEnabledAndroid: PropTypes.bool
        },
        getInitialState: function() {
            return {
                viewState: WebViewState.IDLE,
                lastErrorEvent: null ,
                startInLoadingState: !0
            }
        },
        componentWillMount: function() {
            this.props.startInLoadingState && this.setState({
                viewState: WebViewState.LOADING
            })
        },
        render: function() {
            var otherView = null ;
            if (this.state.viewState === WebViewState.LOADING)
                otherView = (this.props.renderLoading || defaultRenderLoading)();
            else if (this.state.viewState === WebViewState.ERROR) {
                var errorEvent = this.state.lastErrorEvent;
                invariant(null  != errorEvent, "lastErrorEvent expected to be non-null"),
                otherView = (this.props.renderError || defaultRenderError)(errorEvent.domain, errorEvent.code, errorEvent.description)
            } else
                this.state.viewState !== WebViewState.IDLE && console.error("RCTWebView invalid state encountered: " + this.state.loading);
            var webViewStyles = [styles.container, styles.webView, this.props.style];
            (this.state.viewState === WebViewState.LOADING || this.state.viewState === WebViewState.ERROR) && webViewStyles.push(styles.hidden);
            var webView = React.createElement(RCTWebView, {
                ref: RCT_WEBVIEW_REF,
                key: "webViewKey",
                style: webViewStyles,
                url: this.props.url,
                html: this.props.html,
                bounces: this.props.bounces,
                scrollEnabled: this.props.scrollEnabled,
                shouldInjectAJAXHandler: this.props.shouldInjectAJAXHandler,
                contentInset: this.props.contentInset,
                automaticallyAdjustContentInsets: this.props.automaticallyAdjustContentInsets,
                onLoadingStart: this.onLoadingStart,
                onLoadingFinish: this.onLoadingFinish,
                onLoadingError: this.onLoadingError
            });
            return React.createElement(View, {
                style: styles.container
            }, webView, otherView)
        },
        goForward: function() {
            RCTWebViewManager.goForward(this.getWebWiewHandle())
        },
        goBack: function() {
            RCTWebViewManager.goBack(this.getWebWiewHandle())
        },
        reload: function() {
            RCTWebViewManager.reload(this.getWebWiewHandle())
        },
        updateNavigationState: function(event) {
            this.props.onNavigationStateChange && this.props.onNavigationStateChange(event.nativeEvent)
        },
        getWebWiewHandle: function() {
            return React.findNodeHandle(this.refs[RCT_WEBVIEW_REF])
        },
        onLoadingStart: function(event) {
            this.updateNavigationState(event)
        },
        onLoadingError: function(event) {
            event.persist(),
            console.error("encountered an error loading page", event.nativeEvent),
            this.setState({
                lastErrorEvent: event.nativeEvent,
                viewState: WebViewState.ERROR
            })
        },
        onLoadingFinish: function(event) {
            this.setState({
                viewState: WebViewState.IDLE
            }),
            this.updateNavigationState(event)
        }
    })
      , RCTWebView = requireNativeComponent("RCTWebView", WebView)
      , styles = StyleSheet.create({
        container: {
            flex: 1
        },
        errorContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: BGWASH
        },
        errorText: {
            fontSize: 14,
            textAlign: "center",
            marginBottom: 2
        },
        errorTextTitle: {
            fontSize: 15,
            fontWeight: "500",
            marginBottom: 10
        },
        hidden: {
            height: 0,
            flex: 0
        },
        loadingView: {
            backgroundColor: BGWASH,
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },
        webView: {
            backgroundColor: "#ffffff"
        }
    });
    module.exports = WebView
}),
__d("AlertIOS", ["NativeModules", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function AlertIOS() {}
    var RCTAlertManager = require("NativeModules").AlertManager
      , invariant = require("invariant")
      , DEFAULT_BUTTON_TEXT = "OK"
      , DEFAULT_BUTTON = {
        text: DEFAULT_BUTTON_TEXT,
        onPress: null 
    };
    AlertIOS.alert = function(title, message, buttons, type) {
        var callbacks = []
          , buttonsSpec = [];
        title = title || "",
        message = message || "",
        buttons = buttons || [DEFAULT_BUTTON],
        type = type || "",
        buttons.forEach(function(btn, index) {
            callbacks[index] = btn.onPress;
            var btnDef = {};
            btnDef[index] = btn.text || DEFAULT_BUTTON_TEXT,
            buttonsSpec.push(btnDef)
        }),
        RCTAlertManager.alertWithArgs({
            title: title,
            message: message,
            buttons: buttonsSpec,
            type: type
        }, function(id, value) {
            var cb = callbacks[id];
            cb && cb(value)
        })
    }
    ,
    AlertIOS.prompt = function(title, value, buttons, callback) {
        2 === arguments.length ? "object" == typeof value ? (buttons = value,
        value = void 0) : "function" == typeof value && (callback = value,
        value = void 0) : 3 === arguments.length && "function" == typeof buttons && (callback = buttons,
        buttons = void 0),
        invariant(!(callback && buttons) && (callback || buttons), "Must provide either a button list or a callback, but not both"),
        buttons || (buttons = [{
            text: "Cancel"
        }, {
            text: "OK",
            onPress: callback
        }]),
        this.alert(title, value, buttons, "plain-text")
    }
    ,
    module.exports = AlertIOS
}),
__d("AppRegistry", ["invariant", "renderApplication", "RCTRenderingPerf"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var invariant = require("invariant")
      , renderApplication = require("renderApplication");
    __DEV__ && require("RCTRenderingPerf");
    var runnables = {}
      , AppRegistry = {
        registerConfig: function(config) {
            for (var i = 0; i < config.length; ++i) {
                var appConfig = config[i];
                appConfig.run ? AppRegistry.registerRunnable(appConfig.appKey, appConfig.run) : AppRegistry.registerComponent(appConfig.appKey, appConfig.component)
            }
        },
        registerComponent: function(appKey, getComponentFunc) {
            return runnables[appKey] = {
                run: function(appParameters) {
                    return renderApplication(getComponentFunc(), appParameters.initialProps, appParameters.rootTag)
                }
            },
            appKey
        },
        registerRunnable: function(appKey, func) {
            return runnables[appKey] = {
                run: func
            },
            appKey
        },
        runApplication: function(appKey, appParameters) {
            console.log('Running application "' + appKey + '" with appParams: ' + JSON.stringify(appParameters) + ". __DEV__ === " + __DEV__ + ", development-level warning are " + (__DEV__ ? "ON" : "OFF") + ", performance optimizations are " + (__DEV__ ? "OFF" : "ON")),
            invariant(runnables[appKey] && runnables[appKey].run, "Application " + appKey + " has not been registered."),
            runnables[appKey].run(appParameters)
        }
    };
    module.exports = AppRegistry
}),
__d("renderApplication", ["React", "StyleSheet", "View", "WarningBox", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function renderApplication(RootComponent, initialProps, rootTag) {
        invariant(rootTag, "Expect to have a valid rootTag, instead got ", rootTag);
        var shouldRenderWarningBox = __DEV__ && console.yellowBoxEnabled
          , warningBox = shouldRenderWarningBox ? React.createElement(WarningBox, null ) : null ;
        React.render(React.createElement(View, {
            style: styles.appContainer
        }, React.createElement(RootComponent, React.__spread({}, initialProps)), warningBox), rootTag)
    }
    var React = require("React")
      , StyleSheet = require("StyleSheet")
      , View = require("View")
      , WarningBox = require("WarningBox")
      , invariant = require("invariant")
      , styles = StyleSheet.create({
        appContainer: {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    });
    module.exports = renderApplication
}),
__d("WarningBox", ["AsyncStorage", "EventEmitter", "Map", "PanResponder", "React", "StyleSheet", "Text", "TouchableOpacity", "View", "invariant", "rebound/rebound", "stringifySafe", "Dimensions"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function saveIgnoredWarnings() {
        AsyncStorage.setItem(IGNORED_WARNINGS_KEY, JSON.stringify(ignoredWarnings), function(err) {
            err && console.warn("Could not save ignored warnings.", err)
        })
    }
    var AsyncStorage = require("AsyncStorage")
      , EventEmitter = require("EventEmitter")
      , Map = require("Map")
      , PanResponder = require("PanResponder")
      , React = require("React")
      , StyleSheet = require("StyleSheet")
      , Text = require("Text")
      , TouchableOpacity = require("TouchableOpacity")
      , View = require("View")
      , invariant = require("invariant")
      , rebound = require("rebound/rebound")
      , stringifySafe = require("stringifySafe")
      , SCREEN_WIDTH = require("Dimensions").get("window").width
      , IGNORED_WARNINGS_KEY = "__DEV_WARNINGS_IGNORED"
      , consoleWarn = console.warn.bind(console)
      , warningCounts = new Map
      , ignoredWarnings = []
      , totalWarningCount = 0
      , warningCountEvents = new EventEmitter;
    __DEV__ && (console.warn = function() {
        if (consoleWarn.apply(null , arguments),
        console.yellowBoxEnabled) {
            var warning = Array.prototype.map.call(arguments, stringifySafe).join(" ");
            if (console.yellowBoxResetIgnored || -1 === ignoredWarnings.indexOf(warning)) {
                var count = warningCounts.has(warning) ? warningCounts.get(warning) + 1 : 1;
                warningCounts.set(warning, count),
                totalWarningCount += 1,
                warningCountEvents.emit("count", totalWarningCount)
            }
        }
    }
    ),
    AsyncStorage.getItem(IGNORED_WARNINGS_KEY, function(err, data) {
        err || !data || console.yellowBoxResetIgnored || (ignoredWarnings = JSON.parse(data))
    });
    var WarningRow = React.createClass({
        displayName: "WarningRow",
        componentWillMount: function() {
            this.springSystem = new rebound.SpringSystem,
            this.dismissalSpring = this.springSystem.createSpring(),
            this.dismissalSpring.setRestSpeedThreshold(.05),
            this.dismissalSpring.setCurrentValue(0),
            this.dismissalSpring.addListener({
                onSpringUpdate: function() {
                    var val = this.dismissalSpring.getCurrentValue();
                    this.text && this.text.setNativeProps({
                        left: SCREEN_WIDTH * val
                    }),
                    this.container && this.container.setNativeProps({
                        opacity: 1 - val
                    }),
                    this.closeButton && this.closeButton.setNativeProps({
                        opacity: 1 - 5 * val
                    })
                }
                .bind(this),
                onSpringAtRest: function() {
                    this.dismissalSpring.getCurrentValue() && this.collapseSpring.setEndValue(1)
                }
                .bind(this)
            }),
            this.collapseSpring = this.springSystem.createSpring(),
            this.collapseSpring.setRestSpeedThreshold(.05),
            this.collapseSpring.setCurrentValue(0),
            this.collapseSpring.getSpringConfig().friction = 20,
            this.collapseSpring.getSpringConfig().tension = 200,
            this.collapseSpring.addListener({
                onSpringUpdate: function() {
                    var val = this.collapseSpring.getCurrentValue();
                    this.container && this.container.setNativeProps({
                        height: Math.abs(46 - 46 * val)
                    })
                }
                .bind(this),
                onSpringAtRest: function() {
                    this.props.onDismissed()
                }
                .bind(this)
            }),
            this.panGesture = PanResponder.create({
                onStartShouldSetPanResponder: function() {
                    return !!this.dismissalSpring.getCurrentValue()
                }
                .bind(this),
                onMoveShouldSetPanResponder: function() {
                    return !0
                },
                onPanResponderGrant: function() {
                    this.isResponderOnlyToBlockTouches = !!this.dismissalSpring.getCurrentValue()
                }
                .bind(this),
                onPanResponderMove: function(e, gestureState) {
                    this.isResponderOnlyToBlockTouches || this.dismissalSpring.setCurrentValue(gestureState.dx / SCREEN_WIDTH)
                }
                .bind(this),
                onPanResponderRelease: function(e, gestureState) {
                    if (!this.isResponderOnlyToBlockTouches) {
                        var gestureCompletion = gestureState.dx / SCREEN_WIDTH
                          , doesGestureRelease = gestureState.vx + gestureCompletion > .5;
                        this.dismissalSpring.setEndValue(doesGestureRelease ? 1 : 0)
                    }
                }
                .bind(this)
            })
        },
        render: function() {
            var countText;
            return warningCounts.get(this.props.warning) > 1 && (countText = React.createElement(Text, {
                style: styles.bold
            }, "(", warningCounts.get(this.props.warning), ")", " ")),
            React.createElement(View, React.__spread({
                style: styles.warningBox,
                ref: function(container) {
                    this.container = container
                }
                .bind(this)
            }, this.panGesture.panHandlers), React.createElement(TouchableOpacity, {
                onPress: this.props.onOpened
            }, React.createElement(View, null , React.createElement(Text, {
                style: styles.warningText,
                numberOfLines: 2,
                ref: function(text) {
                    this.text = text
                }
                .bind(this)
            }, countText, this.props.warning))), React.createElement(View, {
                ref: function(closeButton) {
                    this.closeButton = closeButton
                }
                .bind(this),
                style: styles.closeButton
            }, React.createElement(TouchableOpacity, {
                onPress: function() {
                    this.dismissalSpring.setEndValue(1)
                }
                .bind(this)
            }, React.createElement(Text, {
                style: styles.closeButtonText
            }, "✕"))))
        }
    })
      , WarningBoxOpened = React.createClass({
        displayName: "WarningBoxOpened",
        render: function() {
            var countText;
            return warningCounts.get(this.props.warning) > 1 && (countText = React.createElement(Text, {
                style: styles.bold
            }, "(", warningCounts.get(this.props.warning), ")", " ")),
            React.createElement(TouchableOpacity, {
                activeOpacity: .9,
                onPress: this.props.onClose
            }, React.createElement(View, {
                style: styles.yellowBox
            }, React.createElement(Text, {
                style: styles.yellowBoxText
            }, countText, this.props.warning), React.createElement(View, {
                style: styles.yellowBoxButtons
            }, React.createElement(View, {
                style: styles.yellowBoxButton
            }, React.createElement(TouchableOpacity, {
                onPress: this.props.onDismissed
            }, React.createElement(Text, {
                style: styles.yellowBoxButtonText
            }, "Dismiss"))), React.createElement(View, {
                style: styles.yellowBoxButton
            }, React.createElement(TouchableOpacity, {
                onPress: this.props.onIgnored
            }, React.createElement(Text, {
                style: styles.yellowBoxButtonText
            }, "Ignore"))))))
        }
    })
      , canMountWarningBox = !0
      , WarningBox = React.createClass({
        displayName: "WarningBox",
        getInitialState: function() {
            return {
                totalWarningCount: totalWarningCount,
                openWarning: null 
            }
        },
        componentWillMount: function() {
            console.yellowBoxResetIgnored && (AsyncStorage.setItem(IGNORED_WARNINGS_KEY, "[]", function(err) {
                err && console.warn("Could not reset ignored warnings.", err)
            }),
            ignoredWarnings = [])
        },
        componentDidMount: function() {
            invariant(canMountWarningBox, "There can only be one WarningBox"),
            canMountWarningBox = !1,
            warningCountEvents.addListener("count", this._onWarningCount)
        },
        componentWillUnmount: function() {
            warningCountEvents.removeAllListeners(),
            canMountWarningBox = !0
        },
        _onWarningCount: function(totalWarningCount) {
            setImmediate(function() {
                this.setState({
                    totalWarningCount: totalWarningCount
                })
            }
            .bind(this))
        },
        _onDismiss: function(warning) {
            warningCounts["delete"](warning),
            this.setState({
                openWarning: null 
            })
        },
        render: function() {
            if (0 === warningCounts.size)
                return React.createElement(View, null );
            if (this.state.openWarning)
                return React.createElement(WarningBoxOpened, {
                    warning: this.state.openWarning,
                    onClose: function() {
                        this.setState({
                            openWarning: null 
                        })
                    }
                    .bind(this),
                    onDismissed: this._onDismiss.bind(this, this.state.openWarning),
                    onIgnored: function() {
                        ignoredWarnings.push(this.state.openWarning),
                        saveIgnoredWarnings(),
                        this._onDismiss(this.state.openWarning)
                    }
                    .bind(this)
                });
            var warningRows = [];
            return warningCounts.forEach(function(count, warning) {
                warningRows.push(React.createElement(WarningRow, {
                    key: warning,
                    onOpened: function() {
                        this.setState({
                            openWarning: warning
                        })
                    }
                    .bind(this),
                    onDismissed: this._onDismiss.bind(this, warning),
                    warning: warning
                }))
            }
            .bind(this)),
            React.createElement(View, {
                style: styles.warningContainer
            }, warningRows)
        }
    })
      , styles = StyleSheet.create({
        bold: {
            fontWeight: "bold"
        },
        closeButton: {
            position: "absolute",
            right: 0,
            height: 46,
            width: 46
        },
        closeButtonText: {
            color: "white",
            fontSize: 32,
            position: "relative",
            left: 8
        },
        warningContainer: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0
        },
        warningBox: {
            position: "relative",
            backgroundColor: "rgba(171, 124, 36, 0.9)",
            flex: 1,
            height: 46
        },
        warningText: {
            color: "white",
            position: "absolute",
            left: 0,
            marginLeft: 15,
            marginRight: 46,
            top: 7
        },
        yellowBox: {
            backgroundColor: "rgba(171, 124, 36, 0.9)",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            padding: 15,
            paddingTop: 35
        },
        yellowBoxText: {
            color: "white",
            fontSize: 20
        },
        yellowBoxButtons: {
            flexDirection: "row",
            position: "absolute",
            bottom: 0
        },
        yellowBoxButton: {
            flex: 1,
            padding: 25
        },
        yellowBoxButtonText: {
            color: "white",
            fontSize: 16
        }
    });
    module.exports = WarningBox
}),
__d("AsyncStorage", ["NativeModules"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function convertError(error) {
        if (!error)
            return null ;
        var out = new Error(error.message);
        return out.key = error.key,
        out
    }
    var NativeModules = require("NativeModules")
      , RCTAsyncLocalStorage = NativeModules.AsyncLocalStorage
      , RCTAsyncRocksDBStorage = NativeModules.AsyncRocksDBStorage
      , RCTAsyncStorage = RCTAsyncRocksDBStorage || RCTAsyncLocalStorage
      , AsyncStorage = {
        getItem: function(key, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiGet([key], function(errors, result) {
                    var value = result && result[0] && result[0][1] ? result[0][1] : null ;
                    callback && callback(errors && convertError(errors[0]) || null , value),
                    errors ? reject(convertError(errors[0])) : resolve(value)
                })
            }
            )
        },
        setItem: function(key, value, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiSet([[key, value]], function(errors) {
                    callback && callback(errors && convertError(errors[0]) || null ),
                    errors ? reject(convertError(errors[0])) : resolve(null )
                })
            }
            )
        },
        removeItem: function(key, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiRemove([key], function(errors) {
                    callback && callback(errors && convertError(errors[0]) || null ),
                    errors ? reject(convertError(errors[0])) : resolve(null )
                })
            }
            )
        },
        mergeItem: function(key, value, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiMerge([[key, value]], function(errors) {
                    callback && callback(errors && convertError(errors[0]) || null ),
                    errors ? reject(convertError(errors[0])) : resolve(null )
                })
            }
            )
        },
        clear: function(callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.clear(function(error) {
                    callback && callback(convertError(error)),
                    error && convertError(error) ? reject(convertError(error)) : resolve(null )
                })
            }
            )
        },
        getAllKeys: function(callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.getAllKeys(function(error, keys) {
                    callback && callback(convertError(error), keys),
                    error ? reject(convertError(error)) : resolve(keys)
                })
            }
            )
        },
        multiGet: function(keys, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiGet(keys, function(errors, result) {
                    var error = errors && errors.map(function(error) {
                        return convertError(error)
                    }) || null ;
                    callback && callback(error, result),
                    errors ? reject(error) : resolve(result)
                })
            }
            )
        },
        multiSet: function(keyValuePairs, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiSet(keyValuePairs, function(errors) {
                    var error = errors && errors.map(function(error) {
                        return convertError(error)
                    }) || null ;
                    callback && callback(error),
                    errors ? reject(error) : resolve(null )
                })
            }
            )
        },
        multiRemove: function(keys, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiRemove(keys, function(errors) {
                    var error = errors && errors.map(function(error) {
                        return convertError(error)
                    }) || null ;
                    callback && callback(error),
                    errors ? reject(error) : resolve(null )
                })
            }
            )
        },
        multiMerge: function(keyValuePairs, callback) {
            return new Promise(function(resolve, reject) {
                RCTAsyncStorage.multiMerge(keyValuePairs, function(errors) {
                    var error = errors && errors.map(function(error) {
                        return convertError(error)
                    }) || null ;
                    callback && callback(error),
                    errors ? reject(error) : resolve(null )
                })
            }
            )
        }
    };
    RCTAsyncStorage.multiMerge || (delete AsyncStorage.mergeItem,
    delete AsyncStorage.multiMerge),
    module.exports = AsyncStorage
}),
__d("RCTRenderingPerf", ["ReactDefaultPerf", "ReactPerf", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactDefaultPerf = require("ReactDefaultPerf")
      , invariant = (require("ReactPerf"),
    require("invariant"))
      , perfModules = []
      , enabled = !1
      , RCTRenderingPerf = {
        toggle: function() {
            console.log("Render perfomance measurements enabled"),
            enabled = !0
        },
        start: function() {
            enabled && (ReactDefaultPerf.start(),
            perfModules.forEach(function(module) {
                return module.start()
            }))
        },
        stop: function() {
            if (enabled) {
                ReactDefaultPerf.stop(),
                ReactDefaultPerf.printInclusive(),
                ReactDefaultPerf.printWasted();
                for (var totalRender = 0, totalTime = 0, measurements = ReactDefaultPerf.getLastMeasurements(), ii = 0; ii < measurements.length; ii++) {
                    var render = measurements[ii].render;
                    for (var nodeName in render)
                        totalRender += render[nodeName];
                    totalTime += measurements[ii].totalTime
                }
                console.log("Total time spent in render(): " + totalRender + "ms"),
                perfModules.forEach(function(module) {
                    return module.stop()
                })
            }
        },
        register: function(module) {
            invariant("function" == typeof module.start, "Perf module should have start() function"),
            invariant("function" == typeof module.stop, "Perf module should have stop() function"),
            perfModules.push(module)
        }
    };
    module.exports = RCTRenderingPerf
}),
__d("ReactDefaultPerf", ["DOMProperty", "ReactDefaultPerfAnalysis", "ReactMount", "ReactPerf", "performanceNow"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function roundFloat(val) {
        return Math.floor(100 * val) / 100
    }
    function addValue(obj, key, val) {
        obj[key] = (obj[key] || 0) + val
    }
    var DOMProperty = require("DOMProperty")
      , ReactDefaultPerfAnalysis = require("ReactDefaultPerfAnalysis")
      , ReactMount = require("ReactMount")
      , ReactPerf = require("ReactPerf")
      , performanceNow = require("performanceNow")
      , ReactDefaultPerf = {
        _allMeasurements: [],
        _mountStack: [0],
        _injected: !1,
        start: function() {
            ReactDefaultPerf._injected || ReactPerf.injection.injectMeasure(ReactDefaultPerf.measure),
            ReactDefaultPerf._allMeasurements.length = 0,
            ReactPerf.enableMeasure = !0
        },
        stop: function() {
            ReactPerf.enableMeasure = !1
        },
        getLastMeasurements: function() {
            return ReactDefaultPerf._allMeasurements
        },
        printExclusive: function(measurements) {
            measurements = measurements || ReactDefaultPerf._allMeasurements;
            var summary = ReactDefaultPerfAnalysis.getExclusiveSummary(measurements);
            console.table(summary.map(function(item) {
                return {
                    "Component class name": item.componentName,
                    "Total inclusive time (ms)": roundFloat(item.inclusive),
                    "Exclusive mount time (ms)": roundFloat(item.exclusive),
                    "Exclusive render time (ms)": roundFloat(item.render),
                    "Mount time per instance (ms)": roundFloat(item.exclusive / item.count),
                    "Render time per instance (ms)": roundFloat(item.render / item.count),
                    Instances: item.count
                }
            }))
        },
        printInclusive: function(measurements) {
            measurements = measurements || ReactDefaultPerf._allMeasurements;
            var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements);
            console.table(summary.map(function(item) {
                return {
                    "Owner > component": item.componentName,
                    "Inclusive time (ms)": roundFloat(item.time),
                    Instances: item.count
                }
            })),
            console.log("Total time:", ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + " ms")
        },
        getMeasurementsSummaryMap: function(measurements) {
            var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements, !0);
            return summary.map(function(item) {
                return {
                    "Owner > component": item.componentName,
                    "Wasted time (ms)": item.time,
                    Instances: item.count
                }
            })
        },
        printWasted: function(measurements) {
            measurements = measurements || ReactDefaultPerf._allMeasurements,
            console.table(ReactDefaultPerf.getMeasurementsSummaryMap(measurements)),
            console.log("Total time:", ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + " ms")
        },
        printDOM: function(measurements) {
            measurements = measurements || ReactDefaultPerf._allMeasurements;
            var summary = ReactDefaultPerfAnalysis.getDOMSummary(measurements);
            console.table(summary.map(function(item) {
                var result = {};
                return result[DOMProperty.ID_ATTRIBUTE_NAME] = item.id,
                result.type = item.type,
                result.args = JSON.stringify(item.args),
                result
            })),
            console.log("Total time:", ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + " ms")
        },
        _recordWrite: function(id, fnName, totalTime, args) {
            var writes = ReactDefaultPerf._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1].writes;
            writes[id] = writes[id] || [],
            writes[id].push({
                type: fnName,
                time: totalTime,
                args: args
            })
        },
        measure: function(moduleName, fnName, func) {
            return function() {
                for (var args = [], $__0 = 0, $__1 = arguments.length; $__1 > $__0; $__0++)
                    args.push(arguments[$__0]);
                var totalTime, rv, start;
                if ("_renderNewRootComponent" === fnName || "flushBatchedUpdates" === fnName)
                    return ReactDefaultPerf._allMeasurements.push({
                        exclusive: {},
                        inclusive: {},
                        render: {},
                        counts: {},
                        writes: {},
                        displayNames: {},
                        totalTime: 0
                    }),
                    start = performanceNow(),
                    rv = func.apply(this, args),
                    ReactDefaultPerf._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1].totalTime = performanceNow() - start,
                    rv;
                if ("_mountImageIntoNode" === fnName || "ReactDOMIDOperations" === moduleName) {
                    if (start = performanceNow(),
                    rv = func.apply(this, args),
                    totalTime = performanceNow() - start,
                    "_mountImageIntoNode" === fnName) {
                        var mountID = ReactMount.getID(args[1]);
                        ReactDefaultPerf._recordWrite(mountID, fnName, totalTime, args[0])
                    } else
                        "dangerouslyProcessChildrenUpdates" === fnName ? args[0].forEach(function(update) {
                            var writeArgs = {};
                            null  !== update.fromIndex && (writeArgs.fromIndex = update.fromIndex),
                            null  !== update.toIndex && (writeArgs.toIndex = update.toIndex),
                            null  !== update.textContent && (writeArgs.textContent = update.textContent),
                            null  !== update.markupIndex && (writeArgs.markup = args[1][update.markupIndex]),
                            ReactDefaultPerf._recordWrite(update.parentID, update.type, totalTime, writeArgs)
                        }) : ReactDefaultPerf._recordWrite(args[0], fnName, totalTime, Array.prototype.slice.call(args, 1));
                    return rv
                }
                if ("ReactCompositeComponent" !== moduleName || "mountComponent" !== fnName && "updateComponent" !== fnName && "_renderValidatedComponent" !== fnName)
                    return func.apply(this, args);
                if ("string" == typeof this._currentElement.type)
                    return func.apply(this, args);
                var rootNodeID = "mountComponent" === fnName ? args[0] : this._rootNodeID
                  , isRender = "_renderValidatedComponent" === fnName
                  , isMount = "mountComponent" === fnName
                  , mountStack = ReactDefaultPerf._mountStack
                  , entry = ReactDefaultPerf._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1];
                if (isRender ? addValue(entry.counts, rootNodeID, 1) : isMount && mountStack.push(0),
                start = performanceNow(),
                rv = func.apply(this, args),
                totalTime = performanceNow() - start,
                isRender)
                    addValue(entry.render, rootNodeID, totalTime);
                else if (isMount) {
                    var subMountTime = mountStack.pop();
                    mountStack[mountStack.length - 1] += totalTime,
                    addValue(entry.exclusive, rootNodeID, totalTime - subMountTime),
                    addValue(entry.inclusive, rootNodeID, totalTime)
                } else
                    addValue(entry.inclusive, rootNodeID, totalTime);
                return entry.displayNames[rootNodeID] = {
                    current: this.getName(),
                    owner: this._currentElement._owner ? this._currentElement._owner.getName() : "<root>"
                },
                rv
            }
        }
    };
    module.exports = ReactDefaultPerf
}),
__d("DOMProperty", ["invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function checkMask(value, bitmask) {
        return (value & bitmask) === bitmask
    }
    var invariant = require("invariant")
      , DOMPropertyInjection = {
        MUST_USE_ATTRIBUTE: 1,
        MUST_USE_PROPERTY: 2,
        HAS_SIDE_EFFECTS: 4,
        HAS_BOOLEAN_VALUE: 8,
        HAS_NUMERIC_VALUE: 16,
        HAS_POSITIVE_NUMERIC_VALUE: 48,
        HAS_OVERLOADED_BOOLEAN_VALUE: 64,
        injectDOMPropertyConfig: function(domPropertyConfig) {
            var Properties = domPropertyConfig.Properties || {}
              , DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {}
              , DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {}
              , DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};
            domPropertyConfig.isCustomAttribute && DOMProperty._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute);
            for (var propName in Properties) {
                invariant(!DOMProperty.isStandardName.hasOwnProperty(propName), "injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.", propName),
                DOMProperty.isStandardName[propName] = !0;
                var lowerCased = propName.toLowerCase();
                if (DOMProperty.getPossibleStandardName[lowerCased] = propName,
                DOMAttributeNames.hasOwnProperty(propName)) {
                    var attributeName = DOMAttributeNames[propName];
                    DOMProperty.getPossibleStandardName[attributeName] = propName,
                    DOMProperty.getAttributeName[propName] = attributeName
                } else
                    DOMProperty.getAttributeName[propName] = lowerCased;
                DOMProperty.getPropertyName[propName] = DOMPropertyNames.hasOwnProperty(propName) ? DOMPropertyNames[propName] : propName,
                DOMMutationMethods.hasOwnProperty(propName) ? DOMProperty.getMutationMethod[propName] = DOMMutationMethods[propName] : DOMProperty.getMutationMethod[propName] = null ;
                var propConfig = Properties[propName];
                DOMProperty.mustUseAttribute[propName] = checkMask(propConfig, DOMPropertyInjection.MUST_USE_ATTRIBUTE),
                DOMProperty.mustUseProperty[propName] = checkMask(propConfig, DOMPropertyInjection.MUST_USE_PROPERTY),
                DOMProperty.hasSideEffects[propName] = checkMask(propConfig, DOMPropertyInjection.HAS_SIDE_EFFECTS),
                DOMProperty.hasBooleanValue[propName] = checkMask(propConfig, DOMPropertyInjection.HAS_BOOLEAN_VALUE),
                DOMProperty.hasNumericValue[propName] = checkMask(propConfig, DOMPropertyInjection.HAS_NUMERIC_VALUE),
                DOMProperty.hasPositiveNumericValue[propName] = checkMask(propConfig, DOMPropertyInjection.HAS_POSITIVE_NUMERIC_VALUE),
                DOMProperty.hasOverloadedBooleanValue[propName] = checkMask(propConfig, DOMPropertyInjection.HAS_OVERLOADED_BOOLEAN_VALUE),
                invariant(!DOMProperty.mustUseAttribute[propName] || !DOMProperty.mustUseProperty[propName], "DOMProperty: Cannot require using both attribute and property: %s", propName),
                invariant(DOMProperty.mustUseProperty[propName] || !DOMProperty.hasSideEffects[propName], "DOMProperty: Properties that have side effects must use property: %s", propName),
                invariant(!!DOMProperty.hasBooleanValue[propName] + !!DOMProperty.hasNumericValue[propName] + !!DOMProperty.hasOverloadedBooleanValue[propName] <= 1, "DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s", propName)
            }
        }
    }
      , defaultValueCache = {}
      , DOMProperty = {
        ID_ATTRIBUTE_NAME: "data-reactid",
        isStandardName: {},
        getPossibleStandardName: {},
        getAttributeName: {},
        getPropertyName: {},
        getMutationMethod: {},
        mustUseAttribute: {},
        mustUseProperty: {},
        hasSideEffects: {},
        hasBooleanValue: {},
        hasNumericValue: {},
        hasPositiveNumericValue: {},
        hasOverloadedBooleanValue: {},
        _isCustomAttributeFunctions: [],
        isCustomAttribute: function(attributeName) {
            for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
                var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];
                if (isCustomAttributeFn(attributeName))
                    return !0
            }
            return !1
        },
        getDefaultValueForProperty: function(nodeName, prop) {
            var testElement, nodeDefaults = defaultValueCache[nodeName];
            return nodeDefaults || (defaultValueCache[nodeName] = nodeDefaults = {}),
            prop in nodeDefaults || (testElement = document.createElement(nodeName),
            nodeDefaults[prop] = testElement[prop]),
            nodeDefaults[prop]
        },
        injection: DOMPropertyInjection
    };
    module.exports = DOMProperty
}),
__d("ReactDefaultPerfAnalysis", ["Object.assign"], function(global, require, requireDynamic, requireLazy, module, exports) {
    function getTotalTime(measurements) {
        for (var totalTime = 0, i = 0; i < measurements.length; i++) {
            var measurement = measurements[i];
            totalTime += measurement.totalTime
        }
        return totalTime
    }
    function getDOMSummary(measurements) {
        for (var items = [], i = 0; i < measurements.length; i++) {
            var id, measurement = measurements[i];
            for (id in measurement.writes)
                measurement.writes[id].forEach(function(write) {
                    items.push({
                        id: id,
                        type: DOM_OPERATION_TYPES[write.type] || write.type,
                        args: write.args
                    })
                })
        }
        return items
    }
    function getExclusiveSummary(measurements) {
        for (var displayName, candidates = {}, i = 0; i < measurements.length; i++) {
            var measurement = measurements[i]
              , allIDs = assign({}, measurement.exclusive, measurement.inclusive);
            for (var id in allIDs)
                displayName = measurement.displayNames[id].current,
                candidates[displayName] = candidates[displayName] || {
                    componentName: displayName,
                    inclusive: 0,
                    exclusive: 0,
                    render: 0,
                    count: 0
                },
                measurement.render[id] && (candidates[displayName].render += measurement.render[id]),
                measurement.exclusive[id] && (candidates[displayName].exclusive += measurement.exclusive[id]),
                measurement.inclusive[id] && (candidates[displayName].inclusive += measurement.inclusive[id]),
                measurement.counts[id] && (candidates[displayName].count += measurement.counts[id])
        }
        var arr = [];
        for (displayName in candidates)
            candidates[displayName].exclusive >= DONT_CARE_THRESHOLD && arr.push(candidates[displayName]);
        return arr.sort(function(a, b) {
            return b.exclusive - a.exclusive
        }),
        arr
    }
    function getInclusiveSummary(measurements, onlyClean) {
        for (var inclusiveKey, candidates = {}, i = 0; i < measurements.length; i++) {
            var cleanComponents, measurement = measurements[i], allIDs = assign({}, measurement.exclusive, measurement.inclusive);
            onlyClean && (cleanComponents = getUnchangedComponents(measurement));
            for (var id in allIDs)
                if (!onlyClean || cleanComponents[id]) {
                    var displayName = measurement.displayNames[id];
                    inclusiveKey = displayName.owner + " > " + displayName.current,
                    candidates[inclusiveKey] = candidates[inclusiveKey] || {
                        componentName: inclusiveKey,
                        time: 0,
                        count: 0
                    },
                    measurement.inclusive[id] && (candidates[inclusiveKey].time += measurement.inclusive[id]),
                    measurement.counts[id] && (candidates[inclusiveKey].count += measurement.counts[id])
                }
        }
        var arr = [];
        for (inclusiveKey in candidates)
            candidates[inclusiveKey].time >= DONT_CARE_THRESHOLD && arr.push(candidates[inclusiveKey]);
        return arr.sort(function(a, b) {
            return b.time - a.time
        }),
        arr
    }
    function getUnchangedComponents(measurement) {
        var cleanComponents = {}
          , dirtyLeafIDs = Object.keys(measurement.writes)
          , allIDs = assign({}, measurement.exclusive, measurement.inclusive);
        for (var id in allIDs) {
            for (var isDirty = !1, i = 0; i < dirtyLeafIDs.length; i++)
                if (0 === dirtyLeafIDs[i].indexOf(id)) {
                    isDirty = !0;
                    break
                }
            !isDirty && measurement.counts[id] > 0 && (cleanComponents[id] = !0)
        }
        return cleanComponents
    }
    var assign = require("Object.assign")
      , DONT_CARE_THRESHOLD = 1.2
      , DOM_OPERATION_TYPES = {
        _mountImageIntoNode: "set innerHTML",
        INSERT_MARKUP: "set innerHTML",
        MOVE_EXISTING: "move",
        REMOVE_NODE: "remove",
        TEXT_CONTENT: "set textContent",
        updatePropertyByID: "update attribute",
        deletePropertyByID: "delete attribute",
        updateStylesByID: "update styles",
        updateInnerHTMLByID: "set innerHTML",
        dangerouslyReplaceNodeWithMarkupByID: "replace"
    }
      , ReactDefaultPerfAnalysis = {
        getExclusiveSummary: getExclusiveSummary,
        getInclusiveSummary: getInclusiveSummary,
        getDOMSummary: getDOMSummary,
        getTotalTime: getTotalTime
    };
    module.exports = ReactDefaultPerfAnalysis
}),
__d("ReactMount", ["DOMProperty", "ReactBrowserEventEmitter", "ReactCurrentOwner", "ReactElement", "ReactElementValidator", "ReactEmptyComponent", "ReactInstanceHandles", "ReactInstanceMap", "ReactMarkupChecksum", "ReactPerf", "ReactReconciler", "ReactUpdateQueue", "ReactUpdates", "emptyObject", "containsNode", "getReactRootElementInContainer", "instantiateReactComponent", "invariant", "setInnerHTML", "shouldUpdateReactComponent", "warning"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function firstDifferenceIndex(string1, string2) {
        for (var minLen = Math.min(string1.length, string2.length), i = 0; minLen > i; i++)
            if (string1.charAt(i) !== string2.charAt(i))
                return i;
        return string1.length === string2.length ? -1 : minLen
    }
    function getReactRootID(container) {
        var rootElement = getReactRootElementInContainer(container);
        return rootElement && ReactMount.getID(rootElement)
    }
    function getID(node) {
        var id = internalGetID(node);
        if (id)
            if (nodeCache.hasOwnProperty(id)) {
                var cached = nodeCache[id];
                cached !== node && (invariant(!isValid(cached, id), "ReactMount: Two valid but unequal nodes with the same `%s`: %s", ATTR_NAME, id),
                nodeCache[id] = node)
            } else
                nodeCache[id] = node;
        return id
    }
    function internalGetID(node) {
        return node && node.getAttribute && node.getAttribute(ATTR_NAME) || ""
    }
    function setID(node, id) {
        var oldID = internalGetID(node);
        oldID !== id && delete nodeCache[oldID],
        node.setAttribute(ATTR_NAME, id),
        nodeCache[id] = node
    }
    function getNode(id) {
        return nodeCache.hasOwnProperty(id) && isValid(nodeCache[id], id) || (nodeCache[id] = ReactMount.findReactNodeByID(id)),
        nodeCache[id]
    }
    function getNodeFromInstance(instance) {
        var id = ReactInstanceMap.get(instance)._rootNodeID;
        return ReactEmptyComponent.isNullComponentID(id) ? null  : (nodeCache.hasOwnProperty(id) && isValid(nodeCache[id], id) || (nodeCache[id] = ReactMount.findReactNodeByID(id)),
        nodeCache[id])
    }
    function isValid(node, id) {
        if (node) {
            invariant(internalGetID(node) === id, "ReactMount: Unexpected modification of `%s`", ATTR_NAME);
            var container = ReactMount.findReactContainerForID(id);
            if (container && containsNode(container, node))
                return !0
        }
        return !1
    }
    function purgeID(id) {
        delete nodeCache[id]
    }
    function findDeepestCachedAncestorImpl(ancestorID) {
        var ancestor = nodeCache[ancestorID];
        return ancestor && isValid(ancestor, ancestorID) ? void (deepestNodeSoFar = ancestor) : !1
    }
    function findDeepestCachedAncestor(targetID) {
        deepestNodeSoFar = null ,
        ReactInstanceHandles.traverseAncestors(targetID, findDeepestCachedAncestorImpl);
        var foundNode = deepestNodeSoFar;
        return deepestNodeSoFar = null ,
        foundNode
    }
    function mountComponentIntoNode(componentInstance, rootID, container, transaction, shouldReuseMarkup) {
        var markup = ReactReconciler.mountComponent(componentInstance, rootID, transaction, emptyObject);
        componentInstance._isTopLevel = !0,
        ReactMount._mountImageIntoNode(markup, container, shouldReuseMarkup)
    }
    function batchedMountComponentIntoNode(componentInstance, rootID, container, shouldReuseMarkup) {
        var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
        transaction.perform(mountComponentIntoNode, null , componentInstance, rootID, container, transaction, shouldReuseMarkup),
        ReactUpdates.ReactReconcileTransaction.release(transaction)
    }
    var DOMProperty = require("DOMProperty")
      , ReactBrowserEventEmitter = require("ReactBrowserEventEmitter")
      , ReactCurrentOwner = require("ReactCurrentOwner")
      , ReactElement = require("ReactElement")
      , ReactElementValidator = require("ReactElementValidator")
      , ReactEmptyComponent = require("ReactEmptyComponent")
      , ReactInstanceHandles = require("ReactInstanceHandles")
      , ReactInstanceMap = require("ReactInstanceMap")
      , ReactMarkupChecksum = require("ReactMarkupChecksum")
      , ReactPerf = require("ReactPerf")
      , ReactReconciler = require("ReactReconciler")
      , ReactUpdateQueue = require("ReactUpdateQueue")
      , ReactUpdates = require("ReactUpdates")
      , emptyObject = require("emptyObject")
      , containsNode = require("containsNode")
      , getReactRootElementInContainer = require("getReactRootElementInContainer")
      , instantiateReactComponent = require("instantiateReactComponent")
      , invariant = require("invariant")
      , setInnerHTML = require("setInnerHTML")
      , shouldUpdateReactComponent = require("shouldUpdateReactComponent")
      , warning = require("warning")
      , SEPARATOR = ReactInstanceHandles.SEPARATOR
      , ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME
      , nodeCache = {};
    window.nodeCache = nodeCache;
    var ELEMENT_NODE_TYPE = 1
      , DOC_NODE_TYPE = 9
      , instancesByReactRootID = {}
      , containersByReactRootID = {};
    if (__DEV__)
        var rootElementsByReactRootID = {};
    var findComponentRootReusableArray = []
      , deepestNodeSoFar = null 
      , ReactMount = {
        _instancesByReactRootID: instancesByReactRootID,
        scrollMonitor: function(container, renderCallback) {
            renderCallback()
        },
        _updateRootComponent: function(prevComponent, nextElement, container, callback) {
            return __DEV__ && ReactElementValidator.checkAndWarnForMutatedProps(nextElement),
            ReactMount.scrollMonitor(container, function() {
                ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement),
                callback && ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback)
            }),
            __DEV__ && (rootElementsByReactRootID[getReactRootID(container)] = getReactRootElementInContainer(container)),
            prevComponent
        },
        _registerComponent: function(nextComponent, container) {
            invariant(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE), "_registerComponent(...): Target container is not a DOM element."),
            ReactBrowserEventEmitter.ensureScrollValueMonitoring();
            var reactRootID = ReactMount.registerContainer(container);
            return instancesByReactRootID[reactRootID] = nextComponent,
            reactRootID
        },
        _renderNewRootComponent: function(nextElement, container, shouldReuseMarkup) {
            warning(null  == ReactCurrentOwner.current, "_renderNewRootComponent(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.");
            var componentInstance = instantiateReactComponent(nextElement, null )
              , reactRootID = ReactMount._registerComponent(componentInstance, container);
            return ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, reactRootID, container, shouldReuseMarkup),
            __DEV__ && (rootElementsByReactRootID[reactRootID] = getReactRootElementInContainer(container)),
            componentInstance
        },
        render: function(nextElement, container, callback) {
            invariant(ReactElement.isValidElement(nextElement), "React.render(): Invalid component element.%s", "string" == typeof nextElement ? " Instead of passing an element string, make sure to instantiate it by passing it to React.createElement." : "function" == typeof nextElement ? " Instead of passing a component class, make sure to instantiate it by passing it to React.createElement." : null  != nextElement && void 0 !== nextElement.props ? " This may be caused by unintentionally loading two independent copies of React." : "");
            var prevComponent = instancesByReactRootID[getReactRootID(container)];
            if (prevComponent) {
                var prevElement = prevComponent._currentElement;
                if (shouldUpdateReactComponent(prevElement, nextElement))
                    return ReactMount._updateRootComponent(prevComponent, nextElement, container, callback).getPublicInstance();
                ReactMount.unmountComponentAtNode(container)
            }
            var reactRootElement = getReactRootElementInContainer(container)
              , containerHasReactMarkup = reactRootElement && ReactMount.isRenderedByReact(reactRootElement);
            if (__DEV__ && (!containerHasReactMarkup || reactRootElement.nextSibling))
                for (var rootElementSibling = reactRootElement; rootElementSibling; ) {
                    if (ReactMount.isRenderedByReact(rootElementSibling)) {
                        warning(!1, "render(): Target node has markup rendered by React, but there are unrelated nodes as well. This is most commonly caused by white-space inserted around server-rendered markup.");
                        break
                    }
                    rootElementSibling = rootElementSibling.nextSibling
                }
            var shouldReuseMarkup = containerHasReactMarkup && !prevComponent
              , component = ReactMount._renderNewRootComponent(nextElement, container, shouldReuseMarkup).getPublicInstance();
            return callback && callback.call(component),
            component
        },
        constructAndRenderComponent: function(constructor, props, container) {
            var element = ReactElement.createElement(constructor, props);
            return ReactMount.render(element, container)
        },
        constructAndRenderComponentByID: function(constructor, props, id) {
            var domNode = document.getElementById(id);
            return invariant(domNode, 'Tried to get element with id of "%s" but it is not present on the page.', id),
            ReactMount.constructAndRenderComponent(constructor, props, domNode)
        },
        registerContainer: function(container) {
            var reactRootID = getReactRootID(container);
            return reactRootID && (reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID)),
            reactRootID || (reactRootID = ReactInstanceHandles.createReactRootID()),
            containersByReactRootID[reactRootID] = container,
            reactRootID
        },
        unmountComponentAtNode: function(container) {
            warning(null  == ReactCurrentOwner.current, "unmountComponentAtNode(): Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate."),
            invariant(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE), "unmountComponentAtNode(...): Target container is not a DOM element.");
            var reactRootID = getReactRootID(container)
              , component = instancesByReactRootID[reactRootID];
            return component ? (ReactMount.unmountComponentFromNode(component, container),
            delete instancesByReactRootID[reactRootID],
            delete containersByReactRootID[reactRootID],
            __DEV__ && delete rootElementsByReactRootID[reactRootID],
            !0) : !1
        },
        unmountComponentFromNode: function(instance, container) {
            for (ReactReconciler.unmountComponent(instance),
            container.nodeType === DOC_NODE_TYPE && (container = container.documentElement); container.lastChild; )
                container.removeChild(container.lastChild)
        },
        findReactContainerForID: function(id) {
            var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(id)
              , container = containersByReactRootID[reactRootID];
            if (__DEV__) {
                var rootElement = rootElementsByReactRootID[reactRootID];
                if (rootElement && rootElement.parentNode !== container) {
                    invariant(internalGetID(rootElement) === reactRootID, "ReactMount: Root element ID differed from reactRootID.");
                    var containerChild = container.firstChild;
                    containerChild && reactRootID === internalGetID(containerChild) ? rootElementsByReactRootID[reactRootID] = containerChild : warning(!1, "ReactMount: Root element has been removed from its original container. New container:", rootElement.parentNode)
                }
            }
            return container
        },
        findReactNodeByID: function(id) {
            var reactRoot = ReactMount.findReactContainerForID(id);
            return ReactMount.findComponentRoot(reactRoot, id)
        },
        isRenderedByReact: function(node) {
            if (1 !== node.nodeType)
                return !1;
            var id = ReactMount.getID(node);
            return id ? id.charAt(0) === SEPARATOR : !1
        },
        getFirstReactDOM: function(node) {
            for (var current = node; current && current.parentNode !== current; ) {
                if (ReactMount.isRenderedByReact(current))
                    return current;
                current = current.parentNode
            }
            return null 
        },
        findComponentRoot: function(ancestorNode, targetID) {
            var firstChildren = findComponentRootReusableArray
              , childIndex = 0
              , deepestAncestor = findDeepestCachedAncestor(targetID) || ancestorNode;
            for (firstChildren[0] = deepestAncestor.firstChild,
            firstChildren.length = 1; childIndex < firstChildren.length; ) {
                for (var targetChild, child = firstChildren[childIndex++]; child; ) {
                    var childID = ReactMount.getID(child);
                    childID ? targetID === childID ? targetChild = child : ReactInstanceHandles.isAncestorIDOf(childID, targetID) && (firstChildren.length = childIndex = 0,
                    firstChildren.push(child.firstChild)) : firstChildren.push(child.firstChild),
                    child = child.nextSibling
                }
                if (targetChild)
                    return firstChildren.length = 0,
                    targetChild
            }
            firstChildren.length = 0,
            invariant(!1, "findComponentRoot(..., %s): Unable to find element. This probably means the DOM was unexpectedly mutated (e.g., by the browser), usually due to forgetting a <tbody> when using tables, nesting tags like <form>, <p>, or <a>, or using non-SVG elements in an <svg> parent. Try inspecting the child nodes of the element with React ID `%s`.", targetID, ReactMount.getID(ancestorNode))
        },
        _mountImageIntoNode: function(markup, container, shouldReuseMarkup) {
            if (invariant(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE), "mountComponentIntoNode(...): Target container is not valid."),
            shouldReuseMarkup) {
                var rootElement = getReactRootElementInContainer(container);
                if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement))
                    return;
                var checksum = rootElement.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
                rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
                var rootMarkup = rootElement.outerHTML;
                rootElement.setAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME, checksum);
                var diffIndex = firstDifferenceIndex(markup, rootMarkup)
                  , difference = " (client) " + markup.substring(diffIndex - 20, diffIndex + 20) + "\n (server) " + rootMarkup.substring(diffIndex - 20, diffIndex + 20);
                invariant(container.nodeType !== DOC_NODE_TYPE, "You're trying to render a component to the document using server rendering but the checksum was invalid. This usually means you rendered a different component type or props on the client from the one on the server, or your render() methods are impure. React cannot handle this case due to cross-browser quirks by rendering at the document root. You should look for environment dependent code in your components and ensure the props are the same client and server side:\n%s", difference),
                __DEV__ && warning(!1, "React attempted to reuse markup in a container but the checksum was invalid. This generally means that you are using server rendering and the markup generated on the server was not what the client was expecting. React injected new markup to compensate which works but you have lost many of the benefits of server rendering. Instead, figure out why the markup being generated is different on the client or server:\n%s", difference)
            }
            invariant(container.nodeType !== DOC_NODE_TYPE, "You're trying to render a component to the document but you didn't use server rendering. We can't do this without using server rendering due to cross-browser quirks. See React.renderToString() for server rendering."),
            setInnerHTML(container, markup)
        },
        getReactRootID: getReactRootID,
        getID: getID,
        setID: setID,
        getNode: getNode,
        getNodeFromInstance: getNodeFromInstance,
        purgeID: purgeID
    };
    ReactPerf.measureMethods(ReactMount, "ReactMount", {
        _renderNewRootComponent: "_renderNewRootComponent",
        _mountImageIntoNode: "_mountImageIntoNode"
    }),
    module.exports = ReactMount
}),
__d("ReactBrowserEventEmitter", ["EventConstants", "EventPluginHub", "EventPluginRegistry", "ReactEventEmitterMixin", "ViewportMetrics", "Object.assign", "isEventSupported"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getListeningForDocument(mountAt) {
        return Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey) || (mountAt[topListenersIDKey] = reactTopListenersCounter++,
        alreadyListeningTo[mountAt[topListenersIDKey]] = {}),
        alreadyListeningTo[mountAt[topListenersIDKey]]
    }
    var EventConstants = require("EventConstants")
      , EventPluginHub = require("EventPluginHub")
      , EventPluginRegistry = require("EventPluginRegistry")
      , ReactEventEmitterMixin = require("ReactEventEmitterMixin")
      , ViewportMetrics = require("ViewportMetrics")
      , assign = require("Object.assign")
      , isEventSupported = require("isEventSupported")
      , alreadyListeningTo = {}
      , isMonitoringScrollValue = !1
      , reactTopListenersCounter = 0
      , topEventMapping = {
        topBlur: "blur",
        topChange: "change",
        topClick: "click",
        topCompositionEnd: "compositionend",
        topCompositionStart: "compositionstart",
        topCompositionUpdate: "compositionupdate",
        topContextMenu: "contextmenu",
        topCopy: "copy",
        topCut: "cut",
        topDoubleClick: "dblclick",
        topDrag: "drag",
        topDragEnd: "dragend",
        topDragEnter: "dragenter",
        topDragExit: "dragexit",
        topDragLeave: "dragleave",
        topDragOver: "dragover",
        topDragStart: "dragstart",
        topDrop: "drop",
        topFocus: "focus",
        topInput: "input",
        topKeyDown: "keydown",
        topKeyPress: "keypress",
        topKeyUp: "keyup",
        topMouseDown: "mousedown",
        topMouseMove: "mousemove",
        topMouseEnter: "mouseenter",
        topMouseLeave: "mouseleave",
        topMouseOut: "mouseout",
        topMouseOver: "mouseover",
        topMouseUp: "mouseup",
        topPaste: "paste",
        topScroll: "scroll",
        topSelectionChange: "selectionchange",
        topTextInput: "textInput",
        topTouchCancel: "touchcancel",
        topTouchEnd: "touchend",
        topTouchMove: "touchmove",
        topTouchStart: "touchstart",
        topWheel: "wheel"
    }
      , topListenersIDKey = "_reactListenersID" + String(Math.random()).slice(2)
      , ReactBrowserEventEmitter = assign({}, ReactEventEmitterMixin, {
        ReactEventListener: null ,
        injection: {
            injectReactEventListener: function(ReactEventListener) {
                ReactEventListener.setHandleTopLevel(ReactBrowserEventEmitter.handleTopLevel),
                ReactBrowserEventEmitter.ReactEventListener = ReactEventListener
            }
        },
        setEnabled: function(enabled) {
            ReactBrowserEventEmitter.ReactEventListener && ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled)
        },
        isEnabled: function() {
            return !(!ReactBrowserEventEmitter.ReactEventListener || !ReactBrowserEventEmitter.ReactEventListener.isEnabled())
        },
        listenTo: function(registrationName, contentDocumentHandle) {
            for (var mountAt = contentDocumentHandle, isListening = getListeningForDocument(mountAt), dependencies = EventPluginRegistry.registrationNameDependencies[registrationName], topLevelTypes = EventConstants.topLevelTypes, i = 0, l = dependencies.length; l > i; i++) {
                var dependency = dependencies[i];
                isListening.hasOwnProperty(dependency) && isListening[dependency] || (dependency === topLevelTypes.topWheel ? isEventSupported("wheel") ? ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, "wheel", mountAt) : isEventSupported("mousewheel") ? ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, "mousewheel", mountAt) : ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, "DOMMouseScroll", mountAt) : dependency === topLevelTypes.topScroll ? isEventSupported("scroll", !0) ? ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topScroll, "scroll", mountAt) : ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topScroll, "scroll", ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE) : dependency === topLevelTypes.topFocus || dependency === topLevelTypes.topBlur ? (isEventSupported("focus", !0) ? (ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topFocus, "focus", mountAt),
                ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topBlur, "blur", mountAt)) : isEventSupported("focusin") && (ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topFocus, "focusin", mountAt),
                ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topBlur, "focusout", mountAt)),
                isListening[topLevelTypes.topBlur] = !0,
                isListening[topLevelTypes.topFocus] = !0) : topEventMapping.hasOwnProperty(dependency) && ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(dependency, topEventMapping[dependency], mountAt),
                isListening[dependency] = !0)
            }
        },
        trapBubbledEvent: function(topLevelType, handlerBaseName, handle) {
            return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelType, handlerBaseName, handle)
        },
        trapCapturedEvent: function(topLevelType, handlerBaseName, handle) {
            return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelType, handlerBaseName, handle)
        },
        ensureScrollValueMonitoring: function() {
            if (!isMonitoringScrollValue) {
                var refresh = ViewportMetrics.refreshScrollValues;
                ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh),
                isMonitoringScrollValue = !0
            }
        },
        eventNameDispatchConfigs: EventPluginHub.eventNameDispatchConfigs,
        registrationNameModules: EventPluginHub.registrationNameModules,
        putListener: EventPluginHub.putListener,
        getListener: EventPluginHub.getListener,
        deleteListener: EventPluginHub.deleteListener,
        deleteAllListeners: EventPluginHub.deleteAllListeners
    });
    module.exports = ReactBrowserEventEmitter
}),
__d("ViewportMetrics", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ViewportMetrics = {
        currentScrollLeft: 0,
        currentScrollTop: 0,
        refreshScrollValues: function(scrollPosition) {
            ViewportMetrics.currentScrollLeft = scrollPosition.x,
            ViewportMetrics.currentScrollTop = scrollPosition.y
        }
    };
    module.exports = ViewportMetrics
}),
__d("isEventSupported", ["ExecutionEnvironment"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function isEventSupported(eventNameSuffix, capture) {
        if (!ExecutionEnvironment.canUseDOM || capture && !("addEventListener" in document))
            return !1;
        var eventName = "on" + eventNameSuffix
          , isSupported = eventName in document;
        if (!isSupported) {
            var element = document.createElement("div");
            element.setAttribute(eventName, "return;"),
            isSupported = "function" == typeof element[eventName]
        }
        return !isSupported && useHasFeature && "wheel" === eventNameSuffix && (isSupported = document.implementation.hasFeature("Events.wheel", "3.0")),
        isSupported
    }
    var useHasFeature, ExecutionEnvironment = require("ExecutionEnvironment");
    ExecutionEnvironment.canUseDOM && (useHasFeature = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== !0),
    module.exports = isEventSupported
}),
__d("ReactMarkupChecksum", ["adler32"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var adler32 = require("adler32")
      , ReactMarkupChecksum = {
        CHECKSUM_ATTR_NAME: "data-react-checksum",
        addChecksumToMarkup: function(markup) {
            var checksum = adler32(markup);
            return markup.replace(">", " " + ReactMarkupChecksum.CHECKSUM_ATTR_NAME + '="' + checksum + '">')
        },
        canReuseMarkup: function(markup, element) {
            var existingChecksum = element.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
            existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
            var markupChecksum = adler32(markup);
            return markupChecksum === existingChecksum
        }
    };
    module.exports = ReactMarkupChecksum
}),
__d("adler32", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function adler32(data) {
        for (var a = 1, b = 0, i = 0; i < data.length; i++)
            a = (a + data.charCodeAt(i)) % MOD,
            b = (b + a) % MOD;
        return a | b << 16
    }
    var MOD = 65521;
    module.exports = adler32
}),
__d("containsNode", ["isTextNode"], function(global, require, requireDynamic, requireLazy, module, exports) {
    function containsNode(outerNode, innerNode) {
        return outerNode && innerNode ? outerNode === innerNode ? !0 : isTextNode(outerNode) ? !1 : isTextNode(innerNode) ? containsNode(outerNode, innerNode.parentNode) : outerNode.contains ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(16 & outerNode.compareDocumentPosition(innerNode)) : !1 : !1
    }
    var isTextNode = require("isTextNode");
    module.exports = containsNode
}),
__d("isTextNode", ["isNode"], function(global, require, requireDynamic, requireLazy, module, exports) {
    function isTextNode(object) {
        return isNode(object) && 3 == object.nodeType
    }
    var isNode = require("isNode");
    module.exports = isTextNode
}),
__d("getReactRootElementInContainer", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function getReactRootElementInContainer(container) {
        return container ? container.nodeType === DOC_NODE_TYPE ? container.documentElement : container.firstChild : null 
    }
    var DOC_NODE_TYPE = 9;
    module.exports = getReactRootElementInContainer
}),
__d("setInnerHTML", ["ExecutionEnvironment"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ExecutionEnvironment = require("ExecutionEnvironment")
      , WHITESPACE_TEST = /^[ \r\n\t\f]/
      , NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/
      , setInnerHTML = function(node, html) {
        node.innerHTML = html
    }
    ;
    if ("undefined" != typeof MSApp && MSApp.execUnsafeLocalFunction && (setInnerHTML = function(node, html) {
        MSApp.execUnsafeLocalFunction(function() {
            node.innerHTML = html
        })
    }
    ),
    ExecutionEnvironment.canUseDOM) {
        var testElement = document.createElement("div");
        testElement.innerHTML = " ",
        "" === testElement.innerHTML && (setInnerHTML = function(node, html) {
            if (node.parentNode && node.parentNode.replaceChild(node, node),
            WHITESPACE_TEST.test(html) || "<" === html[0] && NONVISIBLE_TEST.test(html)) {
                node.innerHTML = "\ufeff" + html;
                var textNode = node.firstChild;
                1 === textNode.data.length ? node.removeChild(textNode) : textNode.deleteData(0, 1)
            } else
                node.innerHTML = html
        }
        )
    }
    module.exports = setInnerHTML
}),
__d("AppStateIOS", ["NativeModules", "RCTDeviceEventEmitter", "logError"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var NativeModules = require("NativeModules")
      , RCTDeviceEventEmitter = require("RCTDeviceEventEmitter")
      , RCTAppState = NativeModules.AppState
      , logError = require("logError")
      , DEVICE_APPSTATE_EVENT = "appStateDidChange"
      , _appStateHandlers = {}
      , AppStateIOS = {
        addEventListener: function(type, handler) {
            _appStateHandlers[handler] = RCTDeviceEventEmitter.addListener(DEVICE_APPSTATE_EVENT, function(appStateData) {
                handler(appStateData.app_state)
            })
        },
        removeEventListener: function(type, handler) {
            _appStateHandlers[handler] && (_appStateHandlers[handler].remove(),
            _appStateHandlers[handler] = null )
        },
        currentState: null 
    };
    RCTDeviceEventEmitter.addListener(DEVICE_APPSTATE_EVENT, function(appStateData) {
        AppStateIOS.currentState = appStateData.app_state
    }),
    RCTAppState.getCurrentAppState(function(appStateData) {
        AppStateIOS.currentState = appStateData.app_state;
    }, logError),
    module.exports = AppStateIOS
}),
__d("LayoutAnimation", ["ReactPropTypes", "NativeModules", "createStrictShapeTypeChecker", "keyMirror"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function configureNext(config, onAnimationDidEnd, onError) {
        configChecker({
            config: config
        }, "config", "LayoutAnimation.configureNext"),
        RCTUIManager.configureNextLayoutAnimation(config, onAnimationDidEnd, onError)
    }
    function create(duration, type, creationProp) {
        return {
            duration: duration,
            create: {
                type: type,
                property: creationProp
            },
            update: {
                type: type
            }
        }
    }
    var PropTypes = require("ReactPropTypes")
      , RCTUIManager = require("NativeModules").UIManager
      , createStrictShapeTypeChecker = require("createStrictShapeTypeChecker")
      , keyMirror = require("keyMirror")
      , TypesEnum = {
        spring: !0,
        linear: !0,
        easeInEaseOut: !0,
        easeIn: !0,
        easeOut: !0
    }
      , Types = keyMirror(TypesEnum)
      , PropertiesEnum = {
        opacity: !0,
        scaleXY: !0
    }
      , Properties = keyMirror(PropertiesEnum)
      , animChecker = createStrictShapeTypeChecker({
        duration: PropTypes.number,
        delay: PropTypes.number,
        springDamping: PropTypes.number,
        initialVelocity: PropTypes.number,
        type: PropTypes.oneOf(Object.keys(Types)),
        property: PropTypes.oneOf(Object.keys(Properties))
    })
      , configChecker = createStrictShapeTypeChecker({
        duration: PropTypes.number.isRequired,
        create: animChecker,
        update: animChecker,
        "delete": animChecker
    })
      , LayoutAnimation = {
        configureNext: configureNext,
        create: create,
        Types: Types,
        Properties: Properties,
        configChecker: configChecker,
        Presets: {
            easeInEaseOut: create(300, Types.easeInEaseOut, Properties.opacity),
            linear: create(500, Types.linear, Properties.opacity),
            spring: {
                duration: 700,
                create: {
                    type: Types.linear,
                    property: Properties.opacity
                },
                update: {
                    type: Types.spring,
                    springDamping: .4
                }
            }
        }
    };
    module.exports = LayoutAnimation
}),
__d("StatusBarIOS", ["NativeModules"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var RCTStatusBarManager = require("NativeModules").StatusBarManager
      , StatusBarIOS = {
        Style: {
            "default": RCTStatusBarManager.Style["default"],
            lightContent: RCTStatusBarManager.Style.lightContent
        },
        Animation: {
            none: RCTStatusBarManager.Animation.none,
            fade: RCTStatusBarManager.Animation.fade,
            slide: RCTStatusBarManager.Animation.slide
        },
        setStyle: function(style, animated) {
            animated = animated || !1,
            RCTStatusBarManager.setStyle(style, animated)
        },
        setHidden: function(hidden, animation) {
            animation = animation || StatusBarIOS.Animation.none,
            RCTStatusBarManager.setHidden(hidden, animation)
        }
    };
    module.exports = StatusBarIOS
}),
__d("VibrationIOS", ["NativeModules", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var RCTVibration = require("NativeModules").Vibration
      , invariant = require("invariant")
      , VibrationIOS = {
        vibrate: function() {
            invariant(void 0 === arguments[0], "Vibration patterns not supported."),
            RCTVibration.vibrate()
        }
    };
    module.exports = VibrationIOS
}),
__d("LinkedStateMixin", ["ReactLink", "ReactStateSetters"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var ReactLink = require("ReactLink")
      , ReactStateSetters = require("ReactStateSetters")
      , LinkedStateMixin = {
        linkState: function(key) {
            return new ReactLink(this.state[key],ReactStateSetters.createStateKeySetter(this, key))
        }
    };
    module.exports = LinkedStateMixin
}),
__d("ReactLink", ["React"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function ReactLink(value, requestChange) {
        this.value = value,
        this.requestChange = requestChange
    }
    function createLinkTypeChecker(linkType) {
        var shapes = {
            value: "undefined" == typeof linkType ? React.PropTypes.any.isRequired : linkType.isRequired,
            requestChange: React.PropTypes.func.isRequired
        };
        return React.PropTypes.shape(shapes)
    }
    var React = require("React");
    ReactLink.PropTypes = {
        link: createLinkTypeChecker
    },
    module.exports = ReactLink
}),
__d("ReactStateSetters", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function createStateKeySetter(component, key) {
        var partialState = {};
        return function(value) {
            partialState[key] = value,
            component.setState(partialState)
        }
    }
    var ReactStateSetters = {
        createStateSetter: function(component, funcReturningState) {
            return function(a, b, c, d, e, f) {
                var partialState = funcReturningState.call(component, a, b, c, d, e, f);
                partialState && component.setState(partialState)
            }
        },
        createStateKeySetter: function(component, key) {
            var cache = component.__keySetters || (component.__keySetters = {});
            return cache[key] || (cache[key] = createStateKeySetter(component, key))
        }
    };
    ReactStateSetters.Mixin = {
        createStateSetter: function(funcReturningState) {
            return ReactStateSetters.createStateSetter(this, funcReturningState)
        },
        createStateKeySetter: function(key) {
            return ReactStateSetters.createStateKeySetter(this, key)
        }
    },
    module.exports = ReactStateSetters
}),
__d("ReactComponentWithPureRenderMixin", ["shallowEqual"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    var shallowEqual = require("shallowEqual")
      , ReactComponentWithPureRenderMixin = {
        shouldComponentUpdate: function(nextProps, nextState) {
            return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
        }
    };
    module.exports = ReactComponentWithPureRenderMixin
}),
__d("shallowEqual", [], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function shallowEqual(objA, objB) {
        if (objA === objB)
            return !0;
        var key;
        for (key in objA)
            if (objA.hasOwnProperty(key) && (!objB.hasOwnProperty(key) || objA[key] !== objB[key]))
                return !1;
        for (key in objB)
            if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key))
                return !1;
        return !0
    }
    module.exports = shallowEqual
}),
__d("update", ["Object.assign", "keyOf", "invariant"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function shallowCopy(x) {
        return Array.isArray(x) ? x.concat() : x && "object" == typeof x ? assign(new x.constructor, x) : x
    }
    function invariantArrayCase(value, spec, command) {
        invariant(Array.isArray(value), "update(): expected target of %s to be an array; got %s.", command, value);
        var specValue = spec[command];
        invariant(Array.isArray(specValue), "update(): expected spec of %s to be an array; got %s. Did you forget to wrap your parameter in an array?", command, specValue)
    }
    function update(value, spec) {
        if (invariant("object" == typeof spec, "update(): You provided a key path to update() that did not contain one of %s. Did you forget to include {%s: ...}?", ALL_COMMANDS_LIST.join(", "), COMMAND_SET),
        hasOwnProperty.call(spec, COMMAND_SET))
            return invariant(1 === Object.keys(spec).length, "Cannot have more than one key in an object with %s", COMMAND_SET),
            spec[COMMAND_SET];
        var nextValue = shallowCopy(value);
        if (hasOwnProperty.call(spec, COMMAND_MERGE)) {
            var mergeObj = spec[COMMAND_MERGE];
            invariant(mergeObj && "object" == typeof mergeObj, "update(): %s expects a spec of type 'object'; got %s", COMMAND_MERGE, mergeObj),
            invariant(nextValue && "object" == typeof nextValue, "update(): %s expects a target of type 'object'; got %s", COMMAND_MERGE, nextValue),
            assign(nextValue, spec[COMMAND_MERGE])
        }
        hasOwnProperty.call(spec, COMMAND_PUSH) && (invariantArrayCase(value, spec, COMMAND_PUSH),
        spec[COMMAND_PUSH].forEach(function(item) {
            nextValue.push(item)
        })),
        hasOwnProperty.call(spec, COMMAND_UNSHIFT) && (invariantArrayCase(value, spec, COMMAND_UNSHIFT),
        spec[COMMAND_UNSHIFT].forEach(function(item) {
            nextValue.unshift(item)
        })),
        hasOwnProperty.call(spec, COMMAND_SPLICE) && (invariant(Array.isArray(value), "Expected %s target to be an array; got %s", COMMAND_SPLICE, value),
        invariant(Array.isArray(spec[COMMAND_SPLICE]), "update(): expected spec of %s to be an array of arrays; got %s. Did you forget to wrap your parameters in an array?", COMMAND_SPLICE, spec[COMMAND_SPLICE]),
        spec[COMMAND_SPLICE].forEach(function(args) {
            invariant(Array.isArray(args), "update(): expected spec of %s to be an array of arrays; got %s. Did you forget to wrap your parameters in an array?", COMMAND_SPLICE, spec[COMMAND_SPLICE]),
            nextValue.splice.apply(nextValue, args)
        })),
        hasOwnProperty.call(spec, COMMAND_APPLY) && (invariant("function" == typeof spec[COMMAND_APPLY], "update(): expected spec of %s to be a function; got %s.", COMMAND_APPLY, spec[COMMAND_APPLY]),
        nextValue = spec[COMMAND_APPLY](nextValue));
        for (var k in spec)
            ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k] || (nextValue[k] = update(value[k], spec[k]));
        return nextValue
    }
    var assign = require("Object.assign")
      , keyOf = require("keyOf")
      , invariant = require("invariant")
      , hasOwnProperty = {}.hasOwnProperty
      , COMMAND_PUSH = keyOf({
        $push: null 
    })
      , COMMAND_UNSHIFT = keyOf({
        $unshift: null 
    })
      , COMMAND_SPLICE = keyOf({
        $splice: null 
    })
      , COMMAND_SET = keyOf({
        $set: null 
    })
      , COMMAND_MERGE = keyOf({
        $merge: null 
    })
      , COMMAND_APPLY = keyOf({
        $apply: null 
    })
      , ALL_COMMANDS_LIST = [COMMAND_PUSH, COMMAND_UNSHIFT, COMMAND_SPLICE, COMMAND_SET, COMMAND_MERGE, COMMAND_APPLY]
      , ALL_COMMANDS_SET = {};
    ALL_COMMANDS_LIST.forEach(function(command) {
        ALL_COMMANDS_SET[command] = !0
    }),
    module.exports = update
}),
__d("ReactTestUtils", ["EventConstants", "EventPluginHub", "EventPropagators", "React", "ReactElement", "ReactEmptyComponent", "ReactBrowserEventEmitter", "ReactCompositeComponent", "ReactInstanceHandles", "ReactInstanceMap", "ReactMount", "ReactUpdates", "SyntheticEvent", "Object.assign"], function(global, require, requireDynamic, requireLazy, module, exports) {
    "use strict";
    function Event(suffix) {}
    function makeSimulator(eventType) {
        return function(domComponentOrNode, eventData) {
            var node;
            ReactTestUtils.isDOMComponent(domComponentOrNode) ? node = domComponentOrNode.getDOMNode() : domComponentOrNode.tagName && (node = domComponentOrNode);
            var fakeNativeEvent = new Event;
            fakeNativeEvent.target = node;
            var event = new SyntheticEvent(ReactBrowserEventEmitter.eventNameDispatchConfigs[eventType],ReactMount.getID(node),fakeNativeEvent);
            assign(event, eventData),
            EventPropagators.accumulateTwoPhaseDispatches(event),
            ReactUpdates.batchedUpdates(function() {
                EventPluginHub.enqueueEvents(event),
                EventPluginHub.processEventQueue()
            })
        }
    }
    function buildSimulators() {
        ReactTestUtils.Simulate = {};
        var eventType;
        for (eventType in ReactBrowserEventEmitter.eventNameDispatchConfigs)
            ReactTestUtils.Simulate[eventType] = makeSimulator(eventType)
    }
    function makeNativeSimulator(eventType) {
        return function(domComponentOrNode, nativeEventData) {
            var fakeNativeEvent = new Event(eventType);
            assign(fakeNativeEvent, nativeEventData),
            ReactTestUtils.isDOMComponent(domComponentOrNode) ? ReactTestUtils.simulateNativeEventOnDOMComponent(eventType, domComponentOrNode, fakeNativeEvent) : domComponentOrNode.tagName && ReactTestUtils.simulateNativeEventOnNode(eventType, domComponentOrNode, fakeNativeEvent)
        }
    }
    var EventConstants = require("EventConstants")
      , EventPluginHub = require("EventPluginHub")
      , EventPropagators = require("EventPropagators")
      , React = require("React")
      , ReactElement = require("ReactElement")
      , ReactEmptyComponent = require("ReactEmptyComponent")
      , ReactBrowserEventEmitter = require("ReactBrowserEventEmitter")
      , ReactCompositeComponent = require("ReactCompositeComponent")
      , ReactInstanceHandles = require("ReactInstanceHandles")
      , ReactInstanceMap = require("ReactInstanceMap")
      , ReactMount = require("ReactMount")
      , ReactUpdates = require("ReactUpdates")
      , SyntheticEvent = require("SyntheticEvent")
      , assign = require("Object.assign")
      , topLevelTypes = EventConstants.topLevelTypes
      , ReactTestUtils = {
        renderIntoDocument: function(instance) {
            var div = document.createElement("div");
            return React.render(instance, div)
        },
        isElement: function(element) {
            return ReactElement.isValidElement(element)
        },
        isElementOfType: function(inst, convenienceConstructor) {
            return ReactElement.isValidElement(inst) && inst.type === convenienceConstructor
        },
        isDOMComponent: function(inst) {
            return !!(inst && inst.tagName && inst.getDOMNode)
        },
        isDOMComponentElement: function(inst) {
            return !!(inst && ReactElement.isValidElement(inst) && inst.tagName)
        },
        isCompositeComponent: function(inst) {
            return "function" == typeof inst.render && "function" == typeof inst.setState
        },
        isCompositeComponentWithType: function(inst, type) {
            return !(!ReactTestUtils.isCompositeComponent(inst) || inst.constructor !== type)
        },
        isCompositeComponentElement: function(inst) {
            if (!ReactElement.isValidElement(inst))
                return !1;
            var prototype = inst.type.prototype;
            return "function" == typeof prototype.render && "function" == typeof prototype.setState
        },
        isCompositeComponentElementWithType: function(inst, type) {
            return !(!ReactTestUtils.isCompositeComponentElement(inst) || inst.constructor !== type)
        },
        getRenderedChildOfCompositeComponent: function(inst) {
            if (!ReactTestUtils.isCompositeComponent(inst))
                return null ;
            var internalInstance = ReactInstanceMap.get(inst);
            return internalInstance._renderedComponent.getPublicInstance()
        },
        findAllInRenderedTree: function(inst, test) {
            if (!inst)
                return [];
            var ret = test(inst) ? [inst] : [];
            if (ReactTestUtils.isDOMComponent(inst)) {
                var key, internalInstance = ReactInstanceMap.get(inst), renderedChildren = internalInstance._renderedComponent._renderedChildren;
                for (key in renderedChildren)
                    renderedChildren.hasOwnProperty(key) && renderedChildren[key].getPublicInstance && (ret = ret.concat(ReactTestUtils.findAllInRenderedTree(renderedChildren[key].getPublicInstance(), test)))
            } else
                ReactTestUtils.isCompositeComponent(inst) && (ret = ret.concat(ReactTestUtils.findAllInRenderedTree(ReactTestUtils.getRenderedChildOfCompositeComponent(inst), test)));
            return ret
        },
        scryRenderedDOMComponentsWithClass: function(root, className) {
            return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
                var instClassName = inst.props.className;
                return ReactTestUtils.isDOMComponent(inst) && instClassName && -1 !== (" " + instClassName + " ").indexOf(" " + className + " ")
            })
        },
        findRenderedDOMComponentWithClass: function(root, className) {
            var all = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
            if (1 !== all.length)
                throw new Error("Did not find exactly one match (found: " + all.length + ") for class:" + className);
            return all[0]
        },
        scryRenderedDOMComponentsWithTag: function(root, tagName) {
            return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
                return ReactTestUtils.isDOMComponent(inst) && inst.tagName === tagName.toUpperCase()
            })
        },
        findRenderedDOMComponentWithTag: function(root, tagName) {
            var all = ReactTestUtils.scryRenderedDOMComponentsWithTag(root, tagName);
            if (1 !== all.length)
                throw new Error("Did not find exactly one match for tag:" + tagName);
            return all[0]
        },
        scryRenderedComponentsWithType: function(root, componentType) {
            return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
                return ReactTestUtils.isCompositeComponentWithType(inst, componentType)
            })
        },
        findRenderedComponentWithType: function(root, componentType) {
            var all = ReactTestUtils.scryRenderedComponentsWithType(root, componentType);
            if (1 !== all.length)
                throw new Error("Did not find exactly one match for componentType:" + componentType);
            return all[0]
        },
        mockComponent: function(module, mockTagName) {
            return mockTagName = mockTagName || module.mockTagName || "div",
            module.prototype.render.mockImplementation(function() {
                return React.createElement(mockTagName, null , this.props.children)
            }),
            this
        },
        simulateNativeEventOnNode: function(topLevelType, node, fakeNativeEvent) {
            fakeNativeEvent.target = node,
            ReactBrowserEventEmitter.ReactEventListener.dispatchEvent(topLevelType, fakeNativeEvent)
        },
        simulateNativeEventOnDOMComponent: function(topLevelType, comp, fakeNativeEvent) {
            ReactTestUtils.simulateNativeEventOnNode(topLevelType, comp.getDOMNode(), fakeNativeEvent)
        },
        nativeTouchData: function(x, y) {
            return {
                touches: [{
                    pageX: x,
                    pageY: y
                }]
            }
        },
        createRenderer: function() {
            return new ReactShallowRenderer
        },
        Simulate: null ,
        SimulateNative: {}
    }
      , ReactShallowRenderer = function() {
        this._instance = null 
    }
    ;
    ReactShallowRenderer.prototype.getRenderOutput = function() {
        return this._instance && this._instance._renderedComponent && this._instance._renderedComponent._renderedOutput || null 
    }
    ;
    var NoopInternalComponent = function(element) {
        this._renderedOutput = element,
        this._currentElement = null  === element || element === !1 ? ReactEmptyComponent.emptyElement : element
    }
    ;
    NoopInternalComponent.prototype = {
        mountComponent: function() {},
        receiveComponent: function(element) {
            this._renderedOutput = element,
            this._currentElement = null  === element || element === !1 ? ReactEmptyComponent.emptyElement : element
        },
        unmountComponent: function() {}
    };
    var ShallowComponentWrapper = function() {}
    ;
    assign(ShallowComponentWrapper.prototype, ReactCompositeComponent.Mixin, {
        _instantiateReactComponent: function(element) {
            return new NoopInternalComponent(element)
        },
        _replaceNodeWithMarkupByID: function() {},
        _renderValidatedComponent: ReactCompositeComponent.Mixin._renderValidatedComponentWithoutOwnerOrContext
    }),
    ReactShallowRenderer.prototype.render = function(element, context) {
        var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
        this._render(element, transaction, context),
        ReactUpdates.ReactReconcileTransaction.release(transaction)
    }
    ,
    ReactShallowRenderer.prototype.unmount = function() {
        this._instance && this._instance.unmountComponent()
    }
    ,
    ReactShallowRenderer.prototype._render = function(element, transaction, context) {
        if (this._instance)
            this._instance.receiveComponent(element, transaction, context);
        else {
            var rootID = ReactInstanceHandles.createReactRootID()
              , instance = new ShallowComponentWrapper(element.type);
            instance.construct(element),
            instance.mountComponent(rootID, transaction, context),
            this._instance = instance
        }
    }
    ;
    var oldInjectEventPluginOrder = EventPluginHub.injection.injectEventPluginOrder;
    EventPluginHub.injection.injectEventPluginOrder = function() {
        oldInjectEventPluginOrder.apply(this, arguments),
        buildSimulators()
    }
    ;
    var oldInjectEventPlugins = EventPluginHub.injection.injectEventPluginsByName;
    EventPluginHub.injection.injectEventPluginsByName = function() {
        oldInjectEventPlugins.apply(this, arguments),
        buildSimulators()
    }
    ,
    buildSimulators();
    var eventType;
    for (eventType in topLevelTypes) {
        var convenienceName = 0 === eventType.indexOf("top") ? eventType.charAt(3).toLowerCase() + eventType.substr(4) : eventType;
        ReactTestUtils.SimulateNative[convenienceName] = makeNativeSimulator(eventType)
    }
    module.exports = ReactTestUtils
});
