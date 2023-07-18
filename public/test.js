"use strict";

function _instanceof(left, right) {
	if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
		return !!right[Symbol.hasInstance](left);
	} else {
		return left instanceof right;
	}
}

function _typeof(obj) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
		return typeof obj;
	} : function(obj) {
		return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	}, _typeof(obj);
}

function _regeneratorRuntime() {
	"use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
	_regeneratorRuntime = function _regeneratorRuntime() {
		return exports;
	};
	var exports = {},
		Op = Object.prototype,
		hasOwn = Op.hasOwnProperty,
		defineProperty = Object.defineProperty || function(obj, key, desc) {
			obj[key] = desc.value;
		},
		$Symbol = "function" == typeof Symbol ? Symbol : {},
		iteratorSymbol = $Symbol.iterator || "@@iterator",
		asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
		toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	function define(obj, key, value) {
		return Object.defineProperty(obj, key, {
			value: value,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}), obj[key];
	}
	try {
		define({}, "");
	} catch (err) {
		define = function define(obj, key, value) {
			return obj[key] = value;
		};
	}

	function wrap(innerFn, outerFn, self, tryLocsList) {
		var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator,
			generator = Object.create(protoGenerator.prototype),
			context = new Context(tryLocsList || []);
		return defineProperty(generator, "_invoke", {
			value: makeInvokeMethod(innerFn, self, context)
		}), generator;
	}

	function tryCatch(fn, obj, arg) {
		try {
			return {
				type: "normal",
				arg: fn.call(obj, arg)
			};
		} catch (err) {
			return {
				type: "throw",
				arg: err
			};
		}
	}
	exports.wrap = wrap;
	var ContinueSentinel = {};

	function Generator() {}

	function GeneratorFunction() {}

	function GeneratorFunctionPrototype() {}
	var IteratorPrototype = {};
	define(IteratorPrototype, iteratorSymbol, function() {
		return this;
	});
	var getProto = Object.getPrototypeOf,
		NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
	var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

	function defineIteratorMethods(prototype) {
		["next", "throw", "return"].forEach(function(method) {
			define(prototype, method, function(arg) {
				return this._invoke(method, arg);
			});
		});
	}

	function AsyncIterator(generator, PromiseImpl) {
		function invoke(method, arg, resolve, reject) {
			var record = tryCatch(generator[method], generator, arg);
			if ("throw" !== record.type) {
				var result = record.arg,
					value = result.value;
				return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await)
					.then(function(value) {
						invoke("next", value, resolve, reject);
					}, function(err) {
						invoke("throw", err, resolve, reject);
					}) : PromiseImpl.resolve(value)
					.then(function(unwrapped) {
						result.value = unwrapped, resolve(result);
					}, function(error) {
						return invoke("throw", error, resolve, reject);
					});
			}
			reject(record.arg);
		}
		var previousPromise;
		defineProperty(this, "_invoke", {
			value: function value(method, arg) {
				function callInvokeWithMethodAndArg() {
					return new PromiseImpl(function(resolve, reject) {
						invoke(method, arg, resolve, reject);
					});
				}
				return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
			}
		});
	}

	function makeInvokeMethod(innerFn, self, context) {
		var state = "suspendedStart";
		return function(method, arg) {
			if ("executing" === state) throw new Error("Generator is already running");
			if ("completed" === state) {
				if ("throw" === method) throw arg;
				return doneResult();
			}
			for (context.method = method, context.arg = arg;;) {
				var delegate = context.delegate;
				if (delegate) {
					var delegateResult = maybeInvokeDelegate(delegate, context);
					if (delegateResult) {
						if (delegateResult === ContinueSentinel) continue;
						return delegateResult;
					}
				}
				if ("next" === context.method) context.sent = context._sent = context.arg;
				else if ("throw" === context.method) {
					if ("suspendedStart" === state) throw state = "completed", context.arg;
					context.dispatchException(context.arg);
				} else "return" === context.method && context.abrupt("return", context.arg);
				state = "executing";
				var record = tryCatch(innerFn, self, context);
				if ("normal" === record.type) {
					if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
					return {
						value: record.arg,
						done: context.done
					};
				}
				"throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
			}
		};
	}

	function maybeInvokeDelegate(delegate, context) {
		var methodName = context.method,
			method = delegate.iterator[methodName];
		if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
		var record = tryCatch(method, delegate.iterator, context.arg);
		if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
		var info = record.arg;
		return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
	}

	function pushTryEntry(locs) {
		var entry = {
			tryLoc: locs[0]
		};
		1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
	}

	function resetTryEntry(entry) {
		var record = entry.completion || {};
		record.type = "normal", delete record.arg, entry.completion = record;
	}

	function Context(tryLocsList) {
		this.tryEntries = [{
			tryLoc: "root"
		}], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
	}

	function values(iterable) {
		if (iterable) {
			var iteratorMethod = iterable[iteratorSymbol];
			if (iteratorMethod) return iteratorMethod.call(iterable);
			if ("function" == typeof iterable.next) return iterable;
			if (!isNaN(iterable.length)) {
				var i = -1,
					next = function next() {
						for (; ++i < iterable.length;)
							if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
						return next.value = undefined, next.done = !0, next;
					};
				return next.next = next;
			}
		}
		return {
			next: doneResult
		};
	}

	function doneResult() {
		return {
			value: undefined,
			done: !0
		};
	}
	return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
		value: GeneratorFunctionPrototype,
		configurable: !0
	}), defineProperty(GeneratorFunctionPrototype, "constructor", {
		value: GeneratorFunction,
		configurable: !0
	}), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function(genFun) {
		var ctor = "function" == typeof genFun && genFun.constructor;
		return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
	}, exports.mark = function(genFun) {
		return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
	}, exports.awrap = function(arg) {
		return {
			__await: arg
		};
	}, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function() {
		return this;
	}), exports.AsyncIterator = AsyncIterator, exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
		void 0 === PromiseImpl && (PromiseImpl = Promise);
		var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
		return exports.isGeneratorFunction(outerFn) ? iter : iter.next()
			.then(function(result) {
				return result.done ? result.value : iter.next();
			});
	}, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function() {
		return this;
	}), define(Gp, "toString", function() {
		return "[object Generator]";
	}), exports.keys = function(val) {
		var object = Object(val),
			keys = [];
		for (var key in object) keys.push(key);
		return keys.reverse(),
			function next() {
				for (; keys.length;) {
					var key = keys.pop();
					if (key in object) return next.value = key, next.done = !1, next;
				}
				return next.done = !0, next;
			};
	}, exports.values = values, Context.prototype = {
		constructor: Context,
		reset: function reset(skipTempReset) {
			if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset)
				for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
		},
		stop: function stop() {
			this.done = !0;
			var rootRecord = this.tryEntries[0].completion;
			if ("throw" === rootRecord.type) throw rootRecord.arg;
			return this.rval;
		},
		dispatchException: function dispatchException(exception) {
			if (this.done) throw exception;
			var context = this;

			function handle(loc, caught) {
				return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
			}
			for (var i = this.tryEntries.length - 1; i >= 0; --i) {
				var entry = this.tryEntries[i],
					record = entry.completion;
				if ("root" === entry.tryLoc) return handle("end");
				if (entry.tryLoc <= this.prev) {
					var hasCatch = hasOwn.call(entry, "catchLoc"),
						hasFinally = hasOwn.call(entry, "finallyLoc");
					if (hasCatch && hasFinally) {
						if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
						if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
					} else if (hasCatch) {
						if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
					} else {
						if (!hasFinally) throw new Error("try statement without catch or finally");
						if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
					}
				}
			}
		},
		abrupt: function abrupt(type, arg) {
			for (var i = this.tryEntries.length - 1; i >= 0; --i) {
				var entry = this.tryEntries[i];
				if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
					var finallyEntry = entry;
					break;
				}
			}
			finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
			var record = finallyEntry ? finallyEntry.completion : {};
			return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
		},
		complete: function complete(record, afterLoc) {
			if ("throw" === record.type) throw record.arg;
			return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
		},
		finish: function finish(finallyLoc) {
			for (var i = this.tryEntries.length - 1; i >= 0; --i) {
				var entry = this.tryEntries[i];
				if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
			}
		},
		catch: function _catch(tryLoc) {
			for (var i = this.tryEntries.length - 1; i >= 0; --i) {
				var entry = this.tryEntries[i];
				if (entry.tryLoc === tryLoc) {
					var record = entry.completion;
					if ("throw" === record.type) {
						var thrown = record.arg;
						resetTryEntry(entry);
					}
					return thrown;
				}
			}
			throw new Error("illegal catch attempt");
		},
		delegateYield: function delegateYield(iterable, resultName, nextLoc) {
			return this.delegate = {
				iterator: values(iterable),
				resultName: resultName,
				nextLoc: nextLoc
			}, "next" === this.method && (this.arg = undefined), ContinueSentinel;
		}
	}, exports;
}

function set(target, property, value, receiver) {
	if (typeof Reflect !== "undefined" && Reflect.set) {
		set = Reflect.set;
	} else {
		set = function set(target, property, value, receiver) {
			var base = _superPropBase(target, property);
			var desc;
			if (base) {
				desc = Object.getOwnPropertyDescriptor(base, property);
				if (desc.set) {
					desc.set.call(receiver, value);
					return true;
				} else if (!desc.writable) {
					return false;
				}
			}
			desc = Object.getOwnPropertyDescriptor(receiver, property);
			if (desc) {
				if (!desc.writable) {
					return false;
				}
				desc.value = value;
				Object.defineProperty(receiver, property, desc);
			} else {
				_defineProperty(receiver, property, value);
			}
			return true;
		};
	}
	return set(target, property, value, receiver);
}

function _set(target, property, value, receiver, isStrict) {
	var s = set(target, property, value, receiver || target);
	if (!s && isStrict) {
		throw new TypeError('failed to set property');
	}
	return value;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function");
	}
	subClass.prototype = Object.create(superClass && superClass.prototype, {
		constructor: {
			value: subClass,
			writable: true,
			configurable: true
		}
	});
	Object.defineProperty(subClass, "prototype", {
		writable: false
	});
	if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
	_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
	var hasNativeReflectConstruct = _isNativeReflectConstruct();
	return function _createSuperInternal() {
		var Super = _getPrototypeOf(Derived),
			result;
		if (hasNativeReflectConstruct) {
			var NewTarget = _getPrototypeOf(this)
				.constructor;
			result = Reflect.construct(Super, arguments, NewTarget);
		} else {
			result = Super.apply(this, arguments);
		}
		return _possibleConstructorReturn(this, result);
	};
}

function _possibleConstructorReturn(self, call) {
	if (call && (_typeof(call) === "object" || typeof call === "function")) {
		return call;
	} else if (call !== void 0) {
		throw new TypeError("Derived constructors may only return object or undefined");
	}
	return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
	if (self === void 0) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}
	return self;
}

function _isNativeReflectConstruct() {
	if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	if (Reflect.construct.sham) return false;
	if (typeof Proxy === "function") return true;
	try {
		Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
		return true;
	} catch (e) {
		return false;
	}
}

function _get() {
	if (typeof Reflect !== "undefined" && Reflect.get) {
		_get = Reflect.get.bind();
	} else {
		_get = function _get(target, property, receiver) {
			var base = _superPropBase(target, property);
			if (!base) return;
			var desc = Object.getOwnPropertyDescriptor(base, property);
			if (desc.get) {
				return desc.get.call(arguments.length < 3 ? target : receiver);
			}
			return desc.value;
		};
	}
	return _get.apply(this, arguments);
}

function _superPropBase(object, property) {
	while (!Object.prototype.hasOwnProperty.call(object, property)) {
		object = _getPrototypeOf(object);
		if (object === null) break;
	}
	return object;
}

function _getPrototypeOf(o) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf(o);
}

function _classCallCheck(instance, Constructor) {
	if (!_instanceof(instance, Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
	}
}

function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", {
		writable: false
	});
	return Constructor;
}

function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true
		});
	} else {
		obj[key] = value;
	}
	return obj;
}

function _toPropertyKey(arg) {
	var key = _toPrimitive(arg, "string");
	return _typeof(key) === "symbol" ? key : String(key);
}

function _toPrimitive(input, hint) {
	if (_typeof(input) !== "object" || input === null) return input;
	var prim = input[Symbol.toPrimitive];
	if (prim !== undefined) {
		var res = prim.call(input, hint || "default");
		if (_typeof(res) !== "object") return res;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return (hint === "string" ? String : Number)(input);
}

function test() {
	var _ref, _ref2;
	var _window$sfd,
		_window$sfd$error,
		_this2 = this;
	console.log('hh-----h');
	(_window$sfd = window.sfd) === null || _window$sfd === void 0 || (_window$sfd$error = _window$sfd.error) === null || _window$sfd$error === void 0 ? void 0 : _window$sfd$error.call(_window$sfd, 'jfdofs');
	this.w = '3';
	var o1 = {
		hhhh: 'kklfl',
		c: [1]
	};
	var o2 = {
		a: 'fff',
		...o1
	};
	console.log(o2);
	o1.c[2] = 2;
	console.log(o2, o2.c[1]);
	var fn = '1';
	var b = 'temp';
	_ref = function() {
		console.log(_this2);
		return 'run2';
	}();
	_ref2 = fn + '2' + this.w;
	var A = /*#__PURE__*/ function() {
		function A(x) {
			_classCallCheck(this, A);
			_defineProperty(this, "ff", 'tt');
			_defineProperty(this, _ref, function() {
				console.log(this, this.ff);
			} /* function end */ );
			_defineProperty(this, "z", 4);
			_defineProperty(this, 4, void 0);
			_defineProperty(this, "x", 8);
			_defineProperty(this, "fn", function() {
				var _A$prototype$construc, _A$prototype$construc2;
				for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}
				(_A$prototype$construc = A.prototype.constructor) === null || _A$prototype$construc === void 0 || (_A$prototype$construc2 = _A$prototype$construc.call) === null || _A$prototype$construc2 === void 0 ? void 0 : _A$prototype$construc2.call.apply(_A$prototype$construc2, [_A$prototype$construc].concat(args));
			});
			console.log(x);
		} /* function end */
		_createClass(A, [{
			key: "run",
			value: function run(a) {
				console.log('A 的实例 of run', this.__proto__ === B.prototype);
				return this.x * a;
			} /* function end */
		}, {
			key: "gg",
			value: /* function end */

				function gg() {
					console.log('A.protopyte.gg');
				}
		}], [{
			key: "run",
			value: function run() {
				var _console;
				console.log('A of run', this === B);
				for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}
				(_console = console)
				.log.apply(_console, [this, B].concat([1, 2, 3], args));
			}
		}]);
		return A;
	}();
	/*class declaration end */
	_defineProperty(A, "ff", 'A of FF');
	_defineProperty(A, "g", 'h');
	_defineProperty(A, _ref2, A.ff);
	var B = /*#__PURE__*/ function(_A) {
		_inherits(B, _A);
		var _super = _createSuper(B);

		function B(x, y) {
			var _thisSuper, _thisSuper2, _thisSuper3, _thisSuper4, _thisSuper5, _thisSuper6, _this;
			_classCallCheck(this, B);
			_this = _super.call(this, x);
			_defineProperty(_assertThisInitialized(_this), "go", function() {
				console.error('---');
				console.log(_assertThisInitialized(_this), _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(B.prototype)), "ff", _thisSuper), 
                _get((_thisSuper2 = _assertThisInitialized(_this), _getPrototypeOf(B.prototype)), "gg", _thisSuper2), _get((_thisSuper3 = _assertThisInitialized(_this), _getPrototypeOf(B.prototype)), "__proto__", _thisSuper3) === B.prototype);
			});
			_defineProperty(_assertThisInitialized(_this), "gg", {
				jlj: 'tedt'
			});
			_defineProperty(_assertThisInitialized(_this), fn + fn, async function() {
				await 2;
				console.log(_assertThisInitialized(_this));
			});
			console.log('开始获取super', _get((_thisSuper4 = _assertThisInitialized(_this), _getPrototypeOf(B.prototype)), "ff", _thisSuper4), _get((_thisSuper5 = _assertThisInitialized(_this), _getPrototypeOf(B.prototype)), "x", _thisSuper5), _get((_thisSuper6 = _assertThisInitialized(_this), _getPrototypeOf(B.prototype)), "z", _thisSuper6));
			_this.y = y;
			return _this;
		} /* function end */
		_createClass(B, [{
			key: "run",
			value: function run() {
				console.log('B 的实例 of run', _get(_getPrototypeOf(B.prototype), "gg", this), this.gg, _get(_getPrototypeOf(B.prototype), "gg", this) === this.gg);
				_get(_getPrototypeOf(B.prototype), "gg", this)
					.call(this);
				console.log('run in run', this, // B 的实例
					_get(_getPrototypeOf(B.prototype), "prototype", this),
					// undefined
					'super.__proto__', _get(_getPrototypeOf(B.prototype), "__proto__", this), 'A.prototype', A.prototype, 'B.prototype', B.prototype, _get(_getPrototypeOf(B.prototype), "__proto__", this) === B.prototype);
				_get(_getPrototypeOf(B.prototype), "run", this)
					.call(this);
				console.log('更改super的值');
				this.xx = 23;
				_set(_getPrototypeOf(B.prototype), "xx", 22, this, true);
				console.log(_get(_getPrototypeOf(B.prototype), "xx", this), A.prototype, _get(_getPrototypeOf(B.prototype), "prototype", this), _get(_getPrototypeOf(B.prototype), "__proto__", this)
					.prototype, B.prototype.__proto__ === A.prototype, _get(_getPrototypeOf(B.prototype), "__proto__", this)
					.__proto__ === A.prototype);
				B.prototype.xx = 'jfodjsd0ofj';
				console.log('-----', _get(_getPrototypeOf(B.prototype), "xx", this), this.xx, B.prototype.xx);
			}
		}, {
			key: "gg",
			value: function gg() {
				console.log('B.protopyte.gg');
			}
		}], [{
			key: "run",
			value: function run() {
				_get(_getPrototypeOf(B), "run", this)
					.call(this);
				console.log('B of run', _get(_getPrototypeOf(B), "fn", this), _get(_getPrototypeOf(B), "ff", this), _get(_getPrototypeOf(B), "prototype", this) === A.prototype, _get(_getPrototypeOf(B), "prototype", this) === B.prototype, _get(_getPrototypeOf(B), "__proto__", this) === A);
			}
		}, {
			key: "fn",
			value: function fn() {
				return this.x * this.y;
			} /* function end */

			/* arrow function end */
		}]);
		return B;
	}(A);
	/*class declaration end */
	_defineProperty(B, fn, b = /*#__PURE__*/ _regeneratorRuntime()
		.mark(function b() {
			return _regeneratorRuntime()
				.wrap(function b$(_context) {
					while (1) switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return 1;
						case 2:
							console.log(this);
						case 3:
						case "end":
							return _context.stop();
					}
				}, b, this);
		}) /* function end */ );

	console.log('------class----');
	B.run();
	console.log('---jingtai-----');
	var y = new A(4);
	var x = new B(1, 2);
	x.run();
	console.log('---run---end');
	x.go();
	console.log('A的实例', y, 'B的实例', x);
	var obj = {
		x: 100,
		run: y.run,
		run2: y.run2
	};
	console.log(A, B, A['123']);
	// A.call()
	console.log('开始测试bind，call，apply----');

	function bb2() {
		var _console2;
		for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}
		(_console2 = console)
		.log.apply(_console2, [this, this.x].concat(args));
	}
	var cc2 = function cc2() {
		var _console3;
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			args[_key4] = arguments[_key4];
		}
		(_console3 = console)
		.log.apply(_console3, [_this2, _this2.x].concat(args));
	};
	console.log(cc2.__proto__);
	console.log(cc2.bind);
	var fn0 = cc2.bind({
		x: 'gg89i9j'
	});
	console.log('第一个bind函数', fn0);
	fn0('jofjofjf');
	console.log('第一个bind函数执行完毕');
	var fn1 = bb2.bind({
		x: 'gg89i9j'
	}, [6, 7, 7]);
	console.log(fn1, fn1.bind);
	fn1.apply({
		x: 'hhhh'
	}, [1, 2], 3);
	var fn2 = fn1.bind({
		x: 'jojdoljfs'
	});
	console.log(fn2.bind, fn1 === fn2);
	fn2.call({
		x: 'hhhh'
	}, 1, 2, 3);
	console.log([B.__proto__ === A, null === null, x.__proto__ === B.prototype, B.prototype.__proto__ === A.prototype, A.prototype.__proto__ === Object.prototype, Object.prototype.__proto__ === null, B.__proto__ === A, A.__proto__ === Function.prototype, Function.prototype.__proto__ === Object.prototype, Object.prototype.__proto__ === null, Function.__proto__ === Function.prototype, Function.prototype === Function.__proto__, Object.__proto__ === Function.prototype]);
	A.run('test', 'fsdfsdf');
	var t = A.run;
	t('test2');
	y.run2();
	obj.run2();
}