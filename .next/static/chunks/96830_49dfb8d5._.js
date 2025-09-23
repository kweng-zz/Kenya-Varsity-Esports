(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/esports/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/esports/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/esports/node_modules/appwrite/dist/esm/sdk.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ __turbopack_context__.s([
    "Account",
    ()=>Account,
    "AppwriteException",
    ()=>AppwriteException,
    "AuthenticationFactor",
    ()=>AuthenticationFactor,
    "AuthenticatorType",
    ()=>AuthenticatorType,
    "Avatars",
    ()=>Avatars,
    "Browser",
    ()=>Browser,
    "Client",
    ()=>Client,
    "CreditCard",
    ()=>CreditCard,
    "Databases",
    ()=>Databases,
    "ExecutionMethod",
    ()=>ExecutionMethod,
    "Flag",
    ()=>Flag,
    "Functions",
    ()=>Functions,
    "Graphql",
    ()=>Graphql,
    "ID",
    ()=>ID,
    "ImageFormat",
    ()=>ImageFormat,
    "ImageGravity",
    ()=>ImageGravity,
    "Locale",
    ()=>Locale,
    "Messaging",
    ()=>Messaging,
    "OAuthProvider",
    ()=>OAuthProvider,
    "Permission",
    ()=>Permission,
    "Query",
    ()=>Query,
    "Role",
    ()=>Role,
    "Storage",
    ()=>Storage,
    "TablesDB",
    ()=>TablesDB,
    "Teams",
    ()=>Teams
]);
function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
/**
 * Helper class to generate query strings.
 */ class Query {
    /**
     * Convert the query object to a JSON string.
     *
     * @returns {string}
     */ toString() {
        return JSON.stringify({
            method: this.method,
            attribute: this.attribute,
            values: this.values
        });
    }
    /**
     * Constructor for Query class.
     *
     * @param {string} method
     * @param {AttributesTypes} attribute
     * @param {QueryTypes} values
     */ constructor(method, attribute, values){
        this.method = method;
        this.attribute = attribute;
        if (values !== undefined) {
            if (Array.isArray(values)) {
                this.values = values;
            } else {
                this.values = [
                    values
                ];
            }
        }
    }
}
/**
 * Filter resources where attribute is equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes | any[]} value
 * @returns {string}
 */ Query.equal = (attribute, value)=>new Query("equal", attribute, value).toString();
/**
 * Filter resources where attribute is not equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes | any[]} value
 * @returns {string}
 */ Query.notEqual = (attribute, value)=>new Query("notEqual", attribute, value).toString();
/**
 * Filter resources where attribute is less than value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */ Query.lessThan = (attribute, value)=>new Query("lessThan", attribute, value).toString();
/**
 * Filter resources where attribute is less than or equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */ Query.lessThanEqual = (attribute, value)=>new Query("lessThanEqual", attribute, value).toString();
/**
 * Filter resources where attribute is greater than value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */ Query.greaterThan = (attribute, value)=>new Query("greaterThan", attribute, value).toString();
/**
 * Filter resources where attribute is greater than or equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */ Query.greaterThanEqual = (attribute, value)=>new Query("greaterThanEqual", attribute, value).toString();
/**
 * Filter resources where attribute is null.
 *
 * @param {string} attribute
 * @returns {string}
 */ Query.isNull = (attribute)=>new Query("isNull", attribute).toString();
/**
 * Filter resources where attribute is not null.
 *
 * @param {string} attribute
 * @returns {string}
 */ Query.isNotNull = (attribute)=>new Query("isNotNull", attribute).toString();
/**
 * Filter resources where attribute is between start and end (inclusive).
 *
 * @param {string} attribute
 * @param {string | number} start
 * @param {string | number} end
 * @returns {string}
 */ Query.between = (attribute, start, end)=>new Query("between", attribute, [
        start,
        end
    ]).toString();
/**
 * Filter resources where attribute starts with value.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */ Query.startsWith = (attribute, value)=>new Query("startsWith", attribute, value).toString();
/**
 * Filter resources where attribute ends with value.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */ Query.endsWith = (attribute, value)=>new Query("endsWith", attribute, value).toString();
/**
 * Specify which attributes should be returned by the API call.
 *
 * @param {string[]} attributes
 * @returns {string}
 */ Query.select = (attributes)=>new Query("select", undefined, attributes).toString();
/**
 * Filter resources by searching attribute for value.
 * A fulltext index on attribute is required for this query to work.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */ Query.search = (attribute, value)=>new Query("search", attribute, value).toString();
/**
 * Sort results by attribute descending.
 *
 * @param {string} attribute
 * @returns {string}
 */ Query.orderDesc = (attribute)=>new Query("orderDesc", attribute).toString();
/**
 * Sort results by attribute ascending.
 *
 * @param {string} attribute
 * @returns {string}
 */ Query.orderAsc = (attribute)=>new Query("orderAsc", attribute).toString();
/**
 * Return results after documentId.
 *
 * @param {string} documentId
 * @returns {string}
 */ Query.cursorAfter = (documentId)=>new Query("cursorAfter", undefined, documentId).toString();
/**
 * Return results before documentId.
 *
 * @param {string} documentId
 * @returns {string}
 */ Query.cursorBefore = (documentId)=>new Query("cursorBefore", undefined, documentId).toString();
/**
 * Return only limit results.
 *
 * @param {number} limit
 * @returns {string}
 */ Query.limit = (limit)=>new Query("limit", undefined, limit).toString();
/**
 * Filter resources by skipping the first offset results.
 *
 * @param {number} offset
 * @returns {string}
 */ Query.offset = (offset)=>new Query("offset", undefined, offset).toString();
/**
 * Filter resources where attribute contains the specified value.
 *
 * @param {string} attribute
 * @param {string | string[]} value
 * @returns {string}
 */ Query.contains = (attribute, value)=>new Query("contains", attribute, value).toString();
/**
 * Filter resources where attribute does not contain the specified value.
 *
 * @param {string} attribute
 * @param {string | any[]} value
 * @returns {string}
 */ Query.notContains = (attribute, value)=>new Query("notContains", attribute, value).toString();
/**
 * Filter resources by searching attribute for value (inverse of search).
 * A fulltext index on attribute is required for this query to work.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */ Query.notSearch = (attribute, value)=>new Query("notSearch", attribute, value).toString();
/**
 * Filter resources where attribute is not between start and end (exclusive).
 *
 * @param {string} attribute
 * @param {string | number} start
 * @param {string | number} end
 * @returns {string}
 */ Query.notBetween = (attribute, start, end)=>new Query("notBetween", attribute, [
        start,
        end
    ]).toString();
/**
 * Filter resources where attribute does not start with value.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */ Query.notStartsWith = (attribute, value)=>new Query("notStartsWith", attribute, value).toString();
/**
 * Filter resources where attribute does not end with value.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */ Query.notEndsWith = (attribute, value)=>new Query("notEndsWith", attribute, value).toString();
/**
 * Filter resources where document was created before date.
 *
 * @param {string} value
 * @returns {string}
 */ Query.createdBefore = (value)=>new Query("createdBefore", undefined, value).toString();
/**
 * Filter resources where document was created after date.
 *
 * @param {string} value
 * @returns {string}
 */ Query.createdAfter = (value)=>new Query("createdAfter", undefined, value).toString();
/**
 * Filter resources where document was created between dates.
 *
 * @param {string} start
 * @param {string} end
 * @returns {string}
 */ Query.createdBetween = (start, end)=>new Query("createdBetween", undefined, [
        start,
        end
    ]).toString();
/**
 * Filter resources where document was updated before date.
 *
 * @param {string} value
 * @returns {string}
 */ Query.updatedBefore = (value)=>new Query("updatedBefore", undefined, value).toString();
/**
 * Filter resources where document was updated after date.
 *
 * @param {string} value
 * @returns {string}
 */ Query.updatedAfter = (value)=>new Query("updatedAfter", undefined, value).toString();
/**
 * Filter resources where document was updated between dates.
 *
 * @param {string} start
 * @param {string} end
 * @returns {string}
 */ Query.updatedBetween = (start, end)=>new Query("updatedBetween", undefined, [
        start,
        end
    ]).toString();
/**
 * Combine multiple queries using logical OR operator.
 *
 * @param {string[]} queries
 * @returns {string}
 */ Query.or = (queries)=>new Query("or", undefined, queries.map((query)=>JSON.parse(query))).toString();
/**
 * Combine multiple queries using logical AND operator.
 *
 * @param {string[]} queries
 * @returns {string}
 */ Query.and = (queries)=>new Query("and", undefined, queries.map((query)=>JSON.parse(query))).toString();
/**
 * Filter resources where attribute is at a specific distance from the given coordinates.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @param {number} distance
 * @param {boolean} meters
 * @returns {string}
 */ Query.distanceEqual = function(attribute, values, distance) {
    let meters = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
    return new Query("distanceEqual", attribute, [
        [
            values,
            distance,
            meters
        ]
    ]).toString();
};
/**
 * Filter resources where attribute is not at a specific distance from the given coordinates.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @param {number} distance
 * @param {boolean} meters
 * @returns {string}
 */ Query.distanceNotEqual = function(attribute, values, distance) {
    let meters = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
    return new Query("distanceNotEqual", attribute, [
        [
            values,
            distance,
            meters
        ]
    ]).toString();
};
/**
 * Filter resources where attribute is at a distance greater than the specified value from the given coordinates.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @param {number} distance
 * @param {boolean} meters
 * @returns {string}
 */ Query.distanceGreaterThan = function(attribute, values, distance) {
    let meters = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
    return new Query("distanceGreaterThan", attribute, [
        [
            values,
            distance,
            meters
        ]
    ]).toString();
};
/**
 * Filter resources where attribute is at a distance less than the specified value from the given coordinates.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @param {number} distance
 * @param {boolean} meters
 * @returns {string}
 */ Query.distanceLessThan = function(attribute, values, distance) {
    let meters = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
    return new Query("distanceLessThan", attribute, [
        [
            values,
            distance,
            meters
        ]
    ]).toString();
};
/**
 * Filter resources where attribute intersects with the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.intersects = (attribute, values)=>new Query("intersects", attribute, [
        values
    ]).toString();
/**
 * Filter resources where attribute does not intersect with the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.notIntersects = (attribute, values)=>new Query("notIntersects", attribute, [
        values
    ]).toString();
/**
 * Filter resources where attribute crosses the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.crosses = (attribute, values)=>new Query("crosses", attribute, [
        values
    ]).toString();
/**
 * Filter resources where attribute does not cross the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.notCrosses = (attribute, values)=>new Query("notCrosses", attribute, [
        values
    ]).toString();
/**
 * Filter resources where attribute overlaps with the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.overlaps = (attribute, values)=>new Query("overlaps", attribute, [
        values
    ]).toString();
/**
 * Filter resources where attribute does not overlap with the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.notOverlaps = (attribute, values)=>new Query("notOverlaps", attribute, [
        values
    ]).toString();
/**
 * Filter resources where attribute touches the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.touches = (attribute, values)=>new Query("touches", attribute, [
        values
    ]).toString();
/**
 * Filter resources where attribute does not touch the given geometry.
 *
 * @param {string} attribute
 * @param {any[]} values
 * @returns {string}
 */ Query.notTouches = (attribute, values)=>new Query("notTouches", attribute, [
        values
    ]).toString();
/**
 * Exception thrown by the  package
 */ class AppwriteException extends Error {
    /**
     * Initializes a Appwrite Exception.
     *
     * @param {string} message - The error message.
     * @param {number} code - The error code. Default is 0.
     * @param {string} type - The error type. Default is an empty string.
     * @param {string} response - The response string. Default is an empty string.
     */ constructor(message, code = 0, type = '', response = ''){
        super(message);
        this.name = 'AppwriteException';
        this.message = message;
        this.code = code;
        this.type = type;
        this.response = response;
    }
}
/**
 * Client that handles requests to Appwrite
 */ class Client {
    /**
     * Set Endpoint
     *
     * Your project endpoint
     *
     * @param {string} endpoint
     *
     * @returns {this}
     */ setEndpoint(endpoint) {
        if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
            throw new AppwriteException('Invalid endpoint URL: ' + endpoint);
        }
        this.config.endpoint = endpoint;
        this.config.endpointRealtime = endpoint.replace('https://', 'wss://').replace('http://', 'ws://');
        return this;
    }
    /**
     * Set Realtime Endpoint
     *
     * @param {string} endpointRealtime
     *
     * @returns {this}
     */ setEndpointRealtime(endpointRealtime) {
        if (!endpointRealtime.startsWith('ws://') && !endpointRealtime.startsWith('wss://')) {
            throw new AppwriteException('Invalid realtime endpoint URL: ' + endpointRealtime);
        }
        this.config.endpointRealtime = endpointRealtime;
        return this;
    }
    /**
     * Set Project
     *
     * Your project ID
     *
     * @param value string
     *
     * @return {this}
     */ setProject(value) {
        this.headers['X-Appwrite-Project'] = value;
        this.config.project = value;
        return this;
    }
    /**
     * Set JWT
     *
     * Your secret JSON Web Token
     *
     * @param value string
     *
     * @return {this}
     */ setJWT(value) {
        this.headers['X-Appwrite-JWT'] = value;
        this.config.jwt = value;
        return this;
    }
    /**
     * Set Locale
     *
     * @param value string
     *
     * @return {this}
     */ setLocale(value) {
        this.headers['X-Appwrite-Locale'] = value;
        this.config.locale = value;
        return this;
    }
    /**
     * Set Session
     *
     * The user session to authenticate with
     *
     * @param value string
     *
     * @return {this}
     */ setSession(value) {
        this.headers['X-Appwrite-Session'] = value;
        this.config.session = value;
        return this;
    }
    /**
     * Set DevKey
     *
     * Your secret dev API key
     *
     * @param value string
     *
     * @return {this}
     */ setDevKey(value) {
        this.headers['X-Appwrite-Dev-Key'] = value;
        this.config.devkey = value;
        return this;
    }
    /**
     * Subscribes to Appwrite events and passes you the payload in realtime.
     *
     * @param {string|string[]} channels
     * Channel to subscribe - pass a single channel as a string or multiple with an array of strings.
     *
     * Possible channels are:
     * - account
     * - collections
     * - collections.[ID]
     * - collections.[ID].documents
     * - documents
     * - documents.[ID]
     * - files
     * - files.[ID]
     * - executions
     * - executions.[ID]
     * - functions.[ID]
     * - teams
     * - teams.[ID]
     * - memberships
     * - memberships.[ID]
     * @param {(payload: RealtimeMessage) => void} callback Is called on every realtime update.
     * @returns {() => void} Unsubscribes from events.
     */ subscribe(channels, callback) {
        let channelArray = typeof channels === 'string' ? [
            channels
        ] : channels;
        channelArray.forEach((channel)=>this.realtime.channels.add(channel));
        const counter = this.realtime.subscriptionsCounter++;
        this.realtime.subscriptions.set(counter, {
            channels: channelArray,
            callback
        });
        this.realtime.connect();
        return ()=>{
            this.realtime.subscriptions.delete(counter);
            this.realtime.cleanUp(channelArray);
            this.realtime.connect();
        };
    }
    prepareRequest(method, url) {
        let headers = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, params = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        method = method.toUpperCase();
        headers = Object.assign({}, this.headers, headers);
        if (typeof window !== 'undefined' && window.localStorage) {
            const cookieFallback = window.localStorage.getItem('cookieFallback');
            if (cookieFallback) {
                headers['X-Fallback-Cookies'] = cookieFallback;
            }
        }
        let options = {
            method,
            headers
        };
        if (headers['X-Appwrite-Dev-Key'] === undefined) {
            options.credentials = 'include';
        }
        if (method === 'GET') {
            for (const [key, value] of Object.entries(Client.flatten(params))){
                url.searchParams.append(key, value);
            }
        } else {
            switch(headers['content-type']){
                case 'application/json':
                    options.body = JSON.stringify(params);
                    break;
                case 'multipart/form-data':
                    const formData = new FormData();
                    for (const [key, value] of Object.entries(params)){
                        if (value instanceof File) {
                            formData.append(key, value, value.name);
                        } else if (Array.isArray(value)) {
                            for (const nestedValue of value){
                                formData.append("".concat(key, "[]"), nestedValue);
                            }
                        } else {
                            formData.append(key, value);
                        }
                    }
                    options.body = formData;
                    delete headers['content-type'];
                    break;
            }
        }
        return {
            uri: url.toString(),
            options
        };
    }
    chunkedUpload(method, url) {
        let headers = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalPayload = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, onProgress = arguments.length > 4 ? arguments[4] : void 0;
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            const [fileParam, file] = (_a = Object.entries(originalPayload).find((param)=>{
                let [_, value] = param;
                return value instanceof File;
            })) !== null && _a !== void 0 ? _a : [];
            if (!file || !fileParam) {
                throw new Error('File not found in payload');
            }
            if (file.size <= Client.CHUNK_SIZE) {
                return yield this.call(method, url, headers, originalPayload);
            }
            let start = 0;
            let response = null;
            while(start < file.size){
                let end = start + Client.CHUNK_SIZE; // Prepare end for the next chunk
                if (end >= file.size) {
                    end = file.size; // Adjust for the last chunk to include the last byte
                }
                headers['content-range'] = "bytes ".concat(start, "-").concat(end - 1, "/").concat(file.size);
                const chunk = file.slice(start, end);
                let payload = Object.assign({}, originalPayload);
                payload[fileParam] = new File([
                    chunk
                ], file.name);
                response = yield this.call(method, url, headers, payload);
                if (onProgress && typeof onProgress === 'function') {
                    onProgress({
                        $id: response.$id,
                        progress: Math.round(end / file.size * 100),
                        sizeUploaded: end,
                        chunksTotal: Math.ceil(file.size / Client.CHUNK_SIZE),
                        chunksUploaded: Math.ceil(end / Client.CHUNK_SIZE)
                    });
                }
                if (response && response.$id) {
                    headers['x-appwrite-id'] = response.$id;
                }
                start = end;
            }
            return response;
        });
    }
    ping() {
        return __awaiter(this, void 0, void 0, function*() {
            return this.call('GET', new URL(this.config.endpoint + '/ping'));
        });
    }
    call(method, url) {
        let headers = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, params = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, responseType = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 'json';
        var _a, _b;
        return __awaiter(this, void 0, void 0, function*() {
            const { uri, options } = this.prepareRequest(method, url, headers, params);
            let data = null;
            const response = yield fetch(uri, options);
            // type opaque: No-CORS, different-origin response (CORS-issue)
            if (response.type === 'opaque') {
                throw new AppwriteException("Invalid Origin. Register your new client (".concat(window.location.host, ") as a new Web platform on your project console dashboard"), 403, "forbidden", "");
            }
            const warnings = response.headers.get('x-appwrite-warning');
            if (warnings) {
                warnings.split(';').forEach((warning)=>console.warn('Warning: ' + warning));
            }
            if ((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json')) {
                data = yield response.json();
            } else if (responseType === 'arrayBuffer') {
                data = yield response.arrayBuffer();
            } else {
                data = {
                    message: yield response.text()
                };
            }
            if (400 <= response.status) {
                let responseText = '';
                if (((_b = response.headers.get('content-type')) === null || _b === void 0 ? void 0 : _b.includes('application/json')) || responseType === 'arrayBuffer') {
                    responseText = JSON.stringify(data);
                } else {
                    responseText = data === null || data === void 0 ? void 0 : data.message;
                }
                throw new AppwriteException(data === null || data === void 0 ? void 0 : data.message, response.status, data === null || data === void 0 ? void 0 : data.type, responseText);
            }
            const cookieFallback = response.headers.get('X-Fallback-Cookies');
            if (typeof window !== 'undefined' && window.localStorage && cookieFallback) {
                window.console.warn('Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.');
                window.localStorage.setItem('cookieFallback', cookieFallback);
            }
            return data;
        });
    }
    static flatten(data) {
        let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
        let output = {};
        for (const [key, value] of Object.entries(data)){
            let finalKey = prefix ? prefix + '[' + key + ']' : key;
            if (Array.isArray(value)) {
                output = Object.assign(Object.assign({}, output), Client.flatten(value, finalKey));
            } else {
                output[finalKey] = value;
            }
        }
        return output;
    }
    constructor(){
        /**
         * Holds configuration such as project.
         */ this.config = {
            endpoint: 'https://cloud.appwrite.io/v1',
            endpointRealtime: '',
            project: '',
            jwt: '',
            locale: '',
            session: '',
            devkey: ''
        };
        /**
         * Custom headers for API requests.
         */ this.headers = {
            'x-sdk-name': 'Web',
            'x-sdk-platform': 'client',
            'x-sdk-language': 'web',
            'x-sdk-version': '20.0.0',
            'X-Appwrite-Response-Format': '1.8.0'
        };
        this.realtime = {
            socket: undefined,
            timeout: undefined,
            heartbeat: undefined,
            url: '',
            channels: new Set(),
            subscriptions: new Map(),
            subscriptionsCounter: 0,
            reconnect: true,
            reconnectAttempts: 0,
            lastMessage: undefined,
            connect: ()=>{
                clearTimeout(this.realtime.timeout);
                this.realtime.timeout = window === null || window === void 0 ? void 0 : window.setTimeout(()=>{
                    this.realtime.createSocket();
                }, 50);
            },
            getTimeout: ()=>{
                switch(true){
                    case this.realtime.reconnectAttempts < 5:
                        return 1000;
                    case this.realtime.reconnectAttempts < 15:
                        return 5000;
                    case this.realtime.reconnectAttempts < 100:
                        return 10000;
                    default:
                        return 60000;
                }
            },
            createHeartbeat: ()=>{
                if (this.realtime.heartbeat) {
                    clearTimeout(this.realtime.heartbeat);
                }
                this.realtime.heartbeat = window === null || window === void 0 ? void 0 : window.setInterval(()=>{
                    var _a;
                    (_a = this.realtime.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                        type: 'ping'
                    }));
                }, 20000);
            },
            createSocket: ()=>{
                var _a, _b, _c;
                if (this.realtime.channels.size < 1) {
                    this.realtime.reconnect = false;
                    (_a = this.realtime.socket) === null || _a === void 0 ? void 0 : _a.close();
                    return;
                }
                const channels = new URLSearchParams();
                channels.set('project', this.config.project);
                this.realtime.channels.forEach((channel)=>{
                    channels.append('channels[]', channel);
                });
                const url = this.config.endpointRealtime + '/realtime?' + channels.toString();
                if (url !== this.realtime.url || // Check if URL is present
                !this.realtime.socket || // Check if WebSocket has not been created
                ((_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.readyState) > WebSocket.OPEN // Check if WebSocket is CLOSING (3) or CLOSED (4)
                ) {
                    if (this.realtime.socket && ((_c = this.realtime.socket) === null || _c === void 0 ? void 0 : _c.readyState) < WebSocket.CLOSING // Close WebSocket if it is CONNECTING (0) or OPEN (1)
                    ) {
                        this.realtime.reconnect = false;
                        this.realtime.socket.close();
                    }
                    this.realtime.url = url;
                    this.realtime.socket = new WebSocket(url);
                    this.realtime.socket.addEventListener('message', this.realtime.onMessage);
                    this.realtime.socket.addEventListener('open', (_event)=>{
                        this.realtime.reconnectAttempts = 0;
                        this.realtime.createHeartbeat();
                    });
                    this.realtime.socket.addEventListener('close', (event)=>{
                        var _a, _b, _c;
                        if (!this.realtime.reconnect || ((_b = (_a = this.realtime) === null || _a === void 0 ? void 0 : _a.lastMessage) === null || _b === void 0 ? void 0 : _b.type) === 'error' && // Check if last message was of type error
                        ((_c = this.realtime) === null || _c === void 0 ? void 0 : _c.lastMessage.data).code === 1008 // Check for policy violation 1008
                        ) {
                            this.realtime.reconnect = true;
                            return;
                        }
                        const timeout = this.realtime.getTimeout();
                        console.error("Realtime got disconnected. Reconnect will be attempted in ".concat(timeout / 1000, " seconds."), event.reason);
                        setTimeout(()=>{
                            this.realtime.reconnectAttempts++;
                            this.realtime.createSocket();
                        }, timeout);
                    });
                }
            },
            onMessage: (event)=>{
                var _a, _b;
                try {
                    const message = JSON.parse(event.data);
                    this.realtime.lastMessage = message;
                    switch(message.type){
                        case 'connected':
                            const cookie = JSON.parse((_a = window.localStorage.getItem('cookieFallback')) !== null && _a !== void 0 ? _a : '{}');
                            const session = cookie === null || cookie === void 0 ? void 0 : cookie["a_session_".concat(this.config.project)];
                            const messageData = message.data;
                            if (session && !messageData.user) {
                                (_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                                    type: 'authentication',
                                    data: {
                                        session
                                    }
                                }));
                            }
                            break;
                        case 'event':
                            let data = message.data;
                            if (data === null || data === void 0 ? void 0 : data.channels) {
                                const isSubscribed = data.channels.some((channel)=>this.realtime.channels.has(channel));
                                if (!isSubscribed) return;
                                this.realtime.subscriptions.forEach((subscription)=>{
                                    if (data.channels.some((channel)=>subscription.channels.includes(channel))) {
                                        setTimeout(()=>subscription.callback(data));
                                    }
                                });
                            }
                            break;
                        case 'pong':
                            break; // Handle pong response if needed
                        case 'error':
                            throw message.data;
                        default:
                            break;
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            cleanUp: (channels)=>{
                this.realtime.channels.forEach((channel)=>{
                    if (channels.includes(channel)) {
                        let found = Array.from(this.realtime.subscriptions).some((param)=>{
                            let [_key, subscription] = param;
                            return subscription.channels.includes(channel);
                        });
                        if (!found) {
                            this.realtime.channels.delete(channel);
                        }
                    }
                });
            }
        };
    }
}
Client.CHUNK_SIZE = 1024 * 1024 * 5;
class Service {
    static flatten(data) {
        let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
        let output = {};
        for (const [key, value] of Object.entries(data)){
            let finalKey = prefix ? prefix + '[' + key + ']' : key;
            if (Array.isArray(value)) {
                output = Object.assign(Object.assign({}, output), Service.flatten(value, finalKey));
            } else {
                output[finalKey] = value;
            }
        }
        return output;
    }
    constructor(client){
        this.client = client;
    }
}
/**
 * The size for chunked uploads in bytes.
 */ Service.CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
class Account {
    /**
     * Get the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     */ get() {
        const apiPath = '/account';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    create(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                email: rest[0],
                password: rest[1],
                name: rest[2]
            };
        }
        const userId = params.userId;
        const email = params.email;
        const password = params.password;
        const name = params.name;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }
        const apiPath = '/account';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }
        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updateEmail(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                email: paramsOrFirst,
                password: rest[0]
            };
        }
        const email = params.email;
        const password = params.password;
        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }
        const apiPath = '/account/email';
        const payload = {};
        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    listIdentities(paramsOrFirst) {
        let params;
        if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                queries: paramsOrFirst
            };
        }
        const queries = params.queries;
        const apiPath = '/account/identities';
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    deleteIdentity(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                identityId: paramsOrFirst
            };
        }
        const identityId = params.identityId;
        if (typeof identityId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "identityId"');
        }
        const apiPath = '/account/identities/{identityId}'.replace('{identityId}', identityId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    /**
     * Use this endpoint to create a JSON Web Token. You can use the resulting JWT to authenticate on behalf of the current user when working with the Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes from its creation and will be invalid if the user will logout in that time frame.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.Jwt>}
     */ createJWT() {
        const apiPath = '/account/jwts';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    listLogs(paramsOrFirst) {
        let params;
        if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                queries: paramsOrFirst
            };
        }
        const queries = params.queries;
        const apiPath = '/account/logs';
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    updateMFA(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                mfa: paramsOrFirst
            };
        }
        const mfa = params.mfa;
        if (typeof mfa === 'undefined') {
            throw new AppwriteException('Missing required parameter: "mfa"');
        }
        const apiPath = '/account/mfa';
        const payload = {};
        if (typeof mfa !== 'undefined') {
            payload['mfa'] = mfa;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    createMfaAuthenticator(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                type: paramsOrFirst
            };
        }
        const type = params.type;
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }
        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    createMFAAuthenticator(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                type: paramsOrFirst
            };
        }
        const type = params.type;
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }
        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updateMfaAuthenticator(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                type: paramsOrFirst,
                otp: rest[0]
            };
        }
        const type = params.type;
        const otp = params.otp;
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }
        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }
        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload = {};
        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    updateMFAAuthenticator(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                type: paramsOrFirst,
                otp: rest[0]
            };
        }
        const type = params.type;
        const otp = params.otp;
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }
        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }
        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload = {};
        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    deleteMfaAuthenticator(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                type: paramsOrFirst
            };
        }
        const type = params.type;
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }
        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    deleteMFAAuthenticator(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'type' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                type: paramsOrFirst
            };
        }
        const type = params.type;
        if (typeof type === 'undefined') {
            throw new AppwriteException('Missing required parameter: "type"');
        }
        const apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    createMfaChallenge(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'factor' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                factor: paramsOrFirst
            };
        }
        const factor = params.factor;
        if (typeof factor === 'undefined') {
            throw new AppwriteException('Missing required parameter: "factor"');
        }
        const apiPath = '/account/mfa/challenge';
        const payload = {};
        if (typeof factor !== 'undefined') {
            payload['factor'] = factor;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    createMFAChallenge(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'factor' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                factor: paramsOrFirst
            };
        }
        const factor = params.factor;
        if (typeof factor === 'undefined') {
            throw new AppwriteException('Missing required parameter: "factor"');
        }
        const apiPath = '/account/mfa/challenge';
        const payload = {};
        if (typeof factor !== 'undefined') {
            payload['factor'] = factor;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updateMfaChallenge(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                challengeId: paramsOrFirst,
                otp: rest[0]
            };
        }
        const challengeId = params.challengeId;
        const otp = params.otp;
        if (typeof challengeId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "challengeId"');
        }
        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }
        const apiPath = '/account/mfa/challenge';
        const payload = {};
        if (typeof challengeId !== 'undefined') {
            payload['challengeId'] = challengeId;
        }
        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    updateMFAChallenge(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                challengeId: paramsOrFirst,
                otp: rest[0]
            };
        }
        const challengeId = params.challengeId;
        const otp = params.otp;
        if (typeof challengeId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "challengeId"');
        }
        if (typeof otp === 'undefined') {
            throw new AppwriteException('Missing required parameter: "otp"');
        }
        const apiPath = '/account/mfa/challenge';
        const payload = {};
        if (typeof challengeId !== 'undefined') {
            payload['challengeId'] = challengeId;
        }
        if (typeof otp !== 'undefined') {
            payload['otp'] = otp;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    /**
     * List the factors available on the account to be used as a MFA challange.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaFactors>}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.listMFAFactors` instead.
     */ listMfaFactors() {
        const apiPath = '/account/mfa/factors';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List the factors available on the account to be used as a MFA challange.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaFactors>}
     */ listMFAFactors() {
        const apiPath = '/account/mfa/factors';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaRecoveryCodes>}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.getMFARecoveryCodes` instead.
     */ getMfaRecoveryCodes() {
        const apiPath = '/account/mfa/recovery-codes';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaRecoveryCodes>}
     */ getMFARecoveryCodes() {
        const apiPath = '/account/mfa/recovery-codes';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaRecoveryCodes>}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.createMFARecoveryCodes` instead.
     */ createMfaRecoveryCodes() {
        const apiPath = '/account/mfa/recovery-codes';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    /**
     * Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaRecoveryCodes>}
     */ createMFARecoveryCodes() {
        const apiPath = '/account/mfa/recovery-codes';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    /**
     * Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaRecoveryCodes>}
     * @deprecated This API has been deprecated since 1.8.0. Please use `Account.updateMFARecoveryCodes` instead.
     */ updateMfaRecoveryCodes() {
        const apiPath = '/account/mfa/recovery-codes';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    /**
     * Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.MfaRecoveryCodes>}
     */ updateMFARecoveryCodes() {
        const apiPath = '/account/mfa/recovery-codes';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    updateName(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                name: paramsOrFirst
            };
        }
        const name = params.name;
        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }
        const apiPath = '/account/name';
        const payload = {};
        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    updatePassword(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                password: paramsOrFirst,
                oldPassword: rest[0]
            };
        }
        const password = params.password;
        const oldPassword = params.oldPassword;
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }
        const apiPath = '/account/password';
        const payload = {};
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }
        if (typeof oldPassword !== 'undefined') {
            payload['oldPassword'] = oldPassword;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    updatePhone(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                phone: paramsOrFirst,
                password: rest[0]
            };
        }
        const phone = params.phone;
        const password = params.password;
        if (typeof phone === 'undefined') {
            throw new AppwriteException('Missing required parameter: "phone"');
        }
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }
        const apiPath = '/account/phone';
        const payload = {};
        if (typeof phone !== 'undefined') {
            payload['phone'] = phone;
        }
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    /**
     * Get the preferences as a key-value object for the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Preferences>}
     */ getPrefs() {
        const apiPath = '/account/prefs';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    updatePrefs(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'prefs' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                prefs: paramsOrFirst
            };
        }
        const prefs = params.prefs;
        if (typeof prefs === 'undefined') {
            throw new AppwriteException('Missing required parameter: "prefs"');
        }
        const apiPath = '/account/prefs';
        const payload = {};
        if (typeof prefs !== 'undefined') {
            payload['prefs'] = prefs;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    createRecovery(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                email: paramsOrFirst,
                url: rest[0]
            };
        }
        const email = params.email;
        const url = params.url;
        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }
        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }
        const apiPath = '/account/recovery';
        const payload = {};
        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }
        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updateRecovery(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                secret: rest[0],
                password: rest[1]
            };
        }
        const userId = params.userId;
        const secret = params.secret;
        const password = params.password;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }
        const apiPath = '/account/recovery';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    /**
     * Get the list of active sessions across different devices for the currently logged in user.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.SessionList>}
     */ listSessions() {
        const apiPath = '/account/sessions';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * Delete all sessions from the user account and remove any sessions cookies from the end client.
     *
     * @throws {AppwriteException}
     * @returns {Promise<{}>}
     */ deleteSessions() {
        const apiPath = '/account/sessions';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    /**
     * Use this endpoint to allow a new user to register an anonymous account in your project. This route will also create a new session for the user. To allow the new user to convert an anonymous account to a normal account, you need to update its [email and password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail) or create an [OAuth2 session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.Session>}
     */ createAnonymousSession() {
        const apiPath = '/account/sessions/anonymous';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    createEmailPasswordSession(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                email: paramsOrFirst,
                password: rest[0]
            };
        }
        const email = params.email;
        const password = params.password;
        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }
        if (typeof password === 'undefined') {
            throw new AppwriteException('Missing required parameter: "password"');
        }
        const apiPath = '/account/sessions/email';
        const payload = {};
        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }
        if (typeof password !== 'undefined') {
            payload['password'] = password;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updateMagicURLSession(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                secret: rest[0]
            };
        }
        const userId = params.userId;
        const secret = params.secret;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }
        const apiPath = '/account/sessions/magic-url';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    createOAuth2Session(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'provider' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                provider: paramsOrFirst,
                success: rest[0],
                failure: rest[1],
                scopes: rest[2]
            };
        }
        const provider = params.provider;
        const success = params.success;
        const failure = params.failure;
        const scopes = params.scopes;
        if (typeof provider === 'undefined') {
            throw new AppwriteException('Missing required parameter: "provider"');
        }
        const apiPath = '/account/sessions/oauth2/{provider}'.replace('{provider}', provider);
        const payload = {};
        if (typeof success !== 'undefined') {
            payload['success'] = success;
        }
        if (typeof failure !== 'undefined') {
            payload['failure'] = failure;
        }
        if (typeof scopes !== 'undefined') {
            payload['scopes'] = scopes;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        if (typeof window !== 'undefined' && (window === null || window === void 0 ? void 0 : window.location)) {
            window.location.href = uri.toString();
            return;
        } else {
            return uri.toString();
        }
    }
    updatePhoneSession(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                secret: rest[0]
            };
        }
        const userId = params.userId;
        const secret = params.secret;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }
        const apiPath = '/account/sessions/phone';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    createSession(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                secret: rest[0]
            };
        }
        const userId = params.userId;
        const secret = params.secret;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }
        const apiPath = '/account/sessions/token';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    getSession(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                sessionId: paramsOrFirst
            };
        }
        const sessionId = params.sessionId;
        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }
        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    updateSession(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                sessionId: paramsOrFirst
            };
        }
        const sessionId = params.sessionId;
        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }
        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    deleteSession(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                sessionId: paramsOrFirst
            };
        }
        const sessionId = params.sessionId;
        if (typeof sessionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "sessionId"');
        }
        const apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    /**
     * Block the currently logged in user account. Behind the scene, the user record is not deleted but permanently blocked from any access. To completely delete a user, use the Users API instead.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.User<Preferences>>}
     */ updateStatus() {
        const apiPath = '/account/status';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    createPushTarget(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                targetId: paramsOrFirst,
                identifier: rest[0],
                providerId: rest[1]
            };
        }
        const targetId = params.targetId;
        const identifier = params.identifier;
        const providerId = params.providerId;
        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }
        if (typeof identifier === 'undefined') {
            throw new AppwriteException('Missing required parameter: "identifier"');
        }
        const apiPath = '/account/targets/push';
        const payload = {};
        if (typeof targetId !== 'undefined') {
            payload['targetId'] = targetId;
        }
        if (typeof identifier !== 'undefined') {
            payload['identifier'] = identifier;
        }
        if (typeof providerId !== 'undefined') {
            payload['providerId'] = providerId;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updatePushTarget(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                targetId: paramsOrFirst,
                identifier: rest[0]
            };
        }
        const targetId = params.targetId;
        const identifier = params.identifier;
        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }
        if (typeof identifier === 'undefined') {
            throw new AppwriteException('Missing required parameter: "identifier"');
        }
        const apiPath = '/account/targets/{targetId}/push'.replace('{targetId}', targetId);
        const payload = {};
        if (typeof identifier !== 'undefined') {
            payload['identifier'] = identifier;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    deletePushTarget(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                targetId: paramsOrFirst
            };
        }
        const targetId = params.targetId;
        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }
        const apiPath = '/account/targets/{targetId}/push'.replace('{targetId}', targetId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    createEmailToken(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                email: rest[0],
                phrase: rest[1]
            };
        }
        const userId = params.userId;
        const email = params.email;
        const phrase = params.phrase;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }
        const apiPath = '/account/tokens/email';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }
        if (typeof phrase !== 'undefined') {
            payload['phrase'] = phrase;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    createMagicURLToken(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                email: rest[0],
                url: rest[1],
                phrase: rest[2]
            };
        }
        const userId = params.userId;
        const email = params.email;
        const url = params.url;
        const phrase = params.phrase;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof email === 'undefined') {
            throw new AppwriteException('Missing required parameter: "email"');
        }
        const apiPath = '/account/tokens/magic-url';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }
        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }
        if (typeof phrase !== 'undefined') {
            payload['phrase'] = phrase;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    createOAuth2Token(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'provider' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                provider: paramsOrFirst,
                success: rest[0],
                failure: rest[1],
                scopes: rest[2]
            };
        }
        const provider = params.provider;
        const success = params.success;
        const failure = params.failure;
        const scopes = params.scopes;
        if (typeof provider === 'undefined') {
            throw new AppwriteException('Missing required parameter: "provider"');
        }
        const apiPath = '/account/tokens/oauth2/{provider}'.replace('{provider}', provider);
        const payload = {};
        if (typeof success !== 'undefined') {
            payload['success'] = success;
        }
        if (typeof failure !== 'undefined') {
            payload['failure'] = failure;
        }
        if (typeof scopes !== 'undefined') {
            payload['scopes'] = scopes;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        if (typeof window !== 'undefined' && (window === null || window === void 0 ? void 0 : window.location)) {
            window.location.href = uri.toString();
            return;
        } else {
            return uri.toString();
        }
    }
    createPhoneToken(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                phone: rest[0]
            };
        }
        const userId = params.userId;
        const phone = params.phone;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof phone === 'undefined') {
            throw new AppwriteException('Missing required parameter: "phone"');
        }
        const apiPath = '/account/tokens/phone';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof phone !== 'undefined') {
            payload['phone'] = phone;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    createVerification(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                url: paramsOrFirst
            };
        }
        const url = params.url;
        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }
        const apiPath = '/account/verification';
        const payload = {};
        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updateVerification(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                secret: rest[0]
            };
        }
        const userId = params.userId;
        const secret = params.secret;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }
        const apiPath = '/account/verification';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    /**
     * Use this endpoint to send a verification SMS to the currently logged in user. This endpoint is meant for use after updating a user's phone number using the [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone) endpoint. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification). The verification code sent to the user's phone number is valid for 15 minutes.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.Token>}
     */ createPhoneVerification() {
        const apiPath = '/account/verification/phone';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    updatePhoneVerification(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                userId: paramsOrFirst,
                secret: rest[0]
            };
        }
        const userId = params.userId;
        const secret = params.secret;
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }
        const apiPath = '/account/verification/phone';
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
class Avatars {
    getBrowser(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'code' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                code: paramsOrFirst,
                width: rest[0],
                height: rest[1],
                quality: rest[2]
            };
        }
        const code = params.code;
        const width = params.width;
        const height = params.height;
        const quality = params.quality;
        if (typeof code === 'undefined') {
            throw new AppwriteException('Missing required parameter: "code"');
        }
        const apiPath = '/avatars/browsers/{code}'.replace('{code}', code);
        const payload = {};
        if (typeof width !== 'undefined') {
            payload['width'] = width;
        }
        if (typeof height !== 'undefined') {
            payload['height'] = height;
        }
        if (typeof quality !== 'undefined') {
            payload['quality'] = quality;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getCreditCard(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'code' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                code: paramsOrFirst,
                width: rest[0],
                height: rest[1],
                quality: rest[2]
            };
        }
        const code = params.code;
        const width = params.width;
        const height = params.height;
        const quality = params.quality;
        if (typeof code === 'undefined') {
            throw new AppwriteException('Missing required parameter: "code"');
        }
        const apiPath = '/avatars/credit-cards/{code}'.replace('{code}', code);
        const payload = {};
        if (typeof width !== 'undefined') {
            payload['width'] = width;
        }
        if (typeof height !== 'undefined') {
            payload['height'] = height;
        }
        if (typeof quality !== 'undefined') {
            payload['quality'] = quality;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getFavicon(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                url: paramsOrFirst
            };
        }
        const url = params.url;
        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }
        const apiPath = '/avatars/favicon';
        const payload = {};
        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getFlag(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'code' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                code: paramsOrFirst,
                width: rest[0],
                height: rest[1],
                quality: rest[2]
            };
        }
        const code = params.code;
        const width = params.width;
        const height = params.height;
        const quality = params.quality;
        if (typeof code === 'undefined') {
            throw new AppwriteException('Missing required parameter: "code"');
        }
        const apiPath = '/avatars/flags/{code}'.replace('{code}', code);
        const payload = {};
        if (typeof width !== 'undefined') {
            payload['width'] = width;
        }
        if (typeof height !== 'undefined') {
            payload['height'] = height;
        }
        if (typeof quality !== 'undefined') {
            payload['quality'] = quality;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getImage(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                url: paramsOrFirst,
                width: rest[0],
                height: rest[1]
            };
        }
        const url = params.url;
        const width = params.width;
        const height = params.height;
        if (typeof url === 'undefined') {
            throw new AppwriteException('Missing required parameter: "url"');
        }
        const apiPath = '/avatars/image';
        const payload = {};
        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }
        if (typeof width !== 'undefined') {
            payload['width'] = width;
        }
        if (typeof height !== 'undefined') {
            payload['height'] = height;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getInitials(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                name: paramsOrFirst,
                width: rest[0],
                height: rest[1],
                background: rest[2]
            };
        }
        const name = params.name;
        const width = params.width;
        const height = params.height;
        const background = params.background;
        const apiPath = '/avatars/initials';
        const payload = {};
        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }
        if (typeof width !== 'undefined') {
            payload['width'] = width;
        }
        if (typeof height !== 'undefined') {
            payload['height'] = height;
        }
        if (typeof background !== 'undefined') {
            payload['background'] = background;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getQR(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                text: paramsOrFirst,
                size: rest[0],
                margin: rest[1],
                download: rest[2]
            };
        }
        const text = params.text;
        const size = params.size;
        const margin = params.margin;
        const download = params.download;
        if (typeof text === 'undefined') {
            throw new AppwriteException('Missing required parameter: "text"');
        }
        const apiPath = '/avatars/qr';
        const payload = {};
        if (typeof text !== 'undefined') {
            payload['text'] = text;
        }
        if (typeof size !== 'undefined') {
            payload['size'] = size;
        }
        if (typeof margin !== 'undefined') {
            payload['margin'] = margin;
        }
        if (typeof download !== 'undefined') {
            payload['download'] = download;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    constructor(client){
        this.client = client;
    }
}
class Databases {
    listDocuments(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                queries: rest[1]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const queries = params.queries;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    createDocument(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                documentId: rest[1],
                data: rest[2],
                permissions: rest[3]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const documentId = params.documentId;
        const data = params.data;
        const permissions = params.permissions;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        if (typeof documentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "documentId"');
        }
        if (typeof data === 'undefined') {
            throw new AppwriteException('Missing required parameter: "data"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
        const payload = {};
        if (typeof documentId !== 'undefined') {
            payload['documentId'] = documentId;
        }
        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    getDocument(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                documentId: rest[1],
                queries: rest[2]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const documentId = params.documentId;
        const queries = params.queries;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        if (typeof documentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "documentId"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    upsertDocument(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                documentId: rest[1],
                data: rest[2],
                permissions: rest[3]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const documentId = params.documentId;
        const data = params.data;
        const permissions = params.permissions;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        if (typeof documentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "documentId"');
        }
        if (typeof data === 'undefined') {
            throw new AppwriteException('Missing required parameter: "data"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
        const payload = {};
        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    updateDocument(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                documentId: rest[1],
                data: rest[2],
                permissions: rest[3]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const documentId = params.documentId;
        const data = params.data;
        const permissions = params.permissions;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        if (typeof documentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "documentId"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
        const payload = {};
        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    deleteDocument(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                documentId: rest[1]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const documentId = params.documentId;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        if (typeof documentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "documentId"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    decrementDocumentAttribute(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                documentId: rest[1],
                attribute: rest[2],
                value: rest[3],
                min: rest[4]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const documentId = params.documentId;
        const attribute = params.attribute;
        const value = params.value;
        const min = params.min;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        if (typeof documentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "documentId"');
        }
        if (typeof attribute === 'undefined') {
            throw new AppwriteException('Missing required parameter: "attribute"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/decrement'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId).replace('{attribute}', attribute);
        const payload = {};
        if (typeof value !== 'undefined') {
            payload['value'] = value;
        }
        if (typeof min !== 'undefined') {
            payload['min'] = min;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    incrementDocumentAttribute(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                collectionId: rest[0],
                documentId: rest[1],
                attribute: rest[2],
                value: rest[3],
                max: rest[4]
            };
        }
        const databaseId = params.databaseId;
        const collectionId = params.collectionId;
        const documentId = params.documentId;
        const attribute = params.attribute;
        const value = params.value;
        const max = params.max;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof collectionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "collectionId"');
        }
        if (typeof documentId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "documentId"');
        }
        if (typeof attribute === 'undefined') {
            throw new AppwriteException('Missing required parameter: "attribute"');
        }
        const apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/increment'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId).replace('{attribute}', attribute);
        const payload = {};
        if (typeof value !== 'undefined') {
            payload['value'] = value;
        }
        if (typeof max !== 'undefined') {
            payload['max'] = max;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
class Functions {
    listExecutions(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                functionId: paramsOrFirst,
                queries: rest[0]
            };
        }
        const functionId = params.functionId;
        const queries = params.queries;
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }
        const apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    createExecution(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                functionId: paramsOrFirst,
                body: rest[0],
                async: rest[1],
                xpath: rest[2],
                method: rest[3],
                headers: rest[4],
                scheduledAt: rest[5]
            };
        }
        const functionId = params.functionId;
        const body = params.body;
        const async = params.async;
        const xpath = params.xpath;
        const method = params.method;
        const headers = params.headers;
        const scheduledAt = params.scheduledAt;
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }
        const apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
        const payload = {};
        if (typeof body !== 'undefined') {
            payload['body'] = body;
        }
        if (typeof async !== 'undefined') {
            payload['async'] = async;
        }
        if (typeof xpath !== 'undefined') {
            payload['path'] = xpath;
        }
        if (typeof method !== 'undefined') {
            payload['method'] = method;
        }
        if (typeof headers !== 'undefined') {
            payload['headers'] = headers;
        }
        if (typeof scheduledAt !== 'undefined') {
            payload['scheduledAt'] = scheduledAt;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    getExecution(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                functionId: paramsOrFirst,
                executionId: rest[0]
            };
        }
        const functionId = params.functionId;
        const executionId = params.executionId;
        if (typeof functionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "functionId"');
        }
        if (typeof executionId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "executionId"');
        }
        const apiPath = '/functions/{functionId}/executions/{executionId}'.replace('{functionId}', functionId).replace('{executionId}', executionId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
class Graphql {
    query(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'query' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                query: paramsOrFirst
            };
        }
        const query = params.query;
        if (typeof query === 'undefined') {
            throw new AppwriteException('Missing required parameter: "query"');
        }
        const apiPath = '/graphql';
        const payload = {};
        if (typeof query !== 'undefined') {
            payload['query'] = query;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'x-sdk-graphql': 'true',
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    mutation(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst) && 'query' in paramsOrFirst) {
            params = paramsOrFirst || {};
        } else {
            params = {
                query: paramsOrFirst
            };
        }
        const query = params.query;
        if (typeof query === 'undefined') {
            throw new AppwriteException('Missing required parameter: "query"');
        }
        const apiPath = '/graphql/mutation';
        const payload = {};
        if (typeof query !== 'undefined') {
            payload['query'] = query;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'x-sdk-graphql': 'true',
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
class Locale {
    /**
     * Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.
     *
     * ([IP Geolocation by DB-IP](https://db-ip.com))
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.Locale>}
     */ get() {
        const apiPath = '/locale';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List of all locale codes in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.LocaleCodeList>}
     */ listCodes() {
        const apiPath = '/locale/codes';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List of all continents. You can use the locale header to get the data in a supported language.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.ContinentList>}
     */ listContinents() {
        const apiPath = '/locale/continents';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List of all countries. You can use the locale header to get the data in a supported language.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.CountryList>}
     */ listCountries() {
        const apiPath = '/locale/countries';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.CountryList>}
     */ listCountriesEU() {
        const apiPath = '/locale/countries/eu';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List of all countries phone codes. You can use the locale header to get the data in a supported language.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.PhoneList>}
     */ listCountriesPhones() {
        const apiPath = '/locale/countries/phones';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.CurrencyList>}
     */ listCurrencies() {
        const apiPath = '/locale/currencies';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    /**
     * List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.
     *
     * @throws {AppwriteException}
     * @returns {Promise<Models.LanguageList>}
     */ listLanguages() {
        const apiPath = '/locale/languages';
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
class Messaging {
    createSubscriber(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                topicId: paramsOrFirst,
                subscriberId: rest[0],
                targetId: rest[1]
            };
        }
        const topicId = params.topicId;
        const subscriberId = params.subscriberId;
        const targetId = params.targetId;
        if (typeof topicId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "topicId"');
        }
        if (typeof subscriberId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "subscriberId"');
        }
        if (typeof targetId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "targetId"');
        }
        const apiPath = '/messaging/topics/{topicId}/subscribers'.replace('{topicId}', topicId);
        const payload = {};
        if (typeof subscriberId !== 'undefined') {
            payload['subscriberId'] = subscriberId;
        }
        if (typeof targetId !== 'undefined') {
            payload['targetId'] = targetId;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    deleteSubscriber(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                topicId: paramsOrFirst,
                subscriberId: rest[0]
            };
        }
        const topicId = params.topicId;
        const subscriberId = params.subscriberId;
        if (typeof topicId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "topicId"');
        }
        if (typeof subscriberId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "subscriberId"');
        }
        const apiPath = '/messaging/topics/{topicId}/subscribers/{subscriberId}'.replace('{topicId}', topicId).replace('{subscriberId}', subscriberId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
class Storage {
    listFiles(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                bucketId: paramsOrFirst,
                queries: rest[0],
                search: rest[1]
            };
        }
        const bucketId = params.bucketId;
        const queries = params.queries;
        const search = params.search;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        if (typeof search !== 'undefined') {
            payload['search'] = search;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    createFile(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        let onProgress;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
            onProgress = paramsOrFirst === null || paramsOrFirst === void 0 ? void 0 : paramsOrFirst.onProgress;
        } else {
            params = {
                bucketId: paramsOrFirst,
                fileId: rest[0],
                file: rest[1],
                permissions: rest[2]
            };
            onProgress = rest[3];
        }
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const file = params.file;
        const permissions = params.permissions;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }
        if (typeof file === 'undefined') {
            throw new AppwriteException('Missing required parameter: "file"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
        const payload = {};
        if (typeof fileId !== 'undefined') {
            payload['fileId'] = fileId;
        }
        if (typeof file !== 'undefined') {
            payload['file'] = file;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'multipart/form-data'
        };
        return this.client.chunkedUpload('post', uri, apiHeaders, payload, onProgress);
    }
    getFile(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                bucketId: paramsOrFirst,
                fileId: rest[0]
            };
        }
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    updateFile(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                bucketId: paramsOrFirst,
                fileId: rest[0],
                name: rest[1],
                permissions: rest[2]
            };
        }
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const name = params.name;
        const permissions = params.permissions;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload = {};
        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    deleteFile(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                bucketId: paramsOrFirst,
                fileId: rest[0]
            };
        }
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    getFileDownload(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                bucketId: paramsOrFirst,
                fileId: rest[0],
                token: rest[1]
            };
        }
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const token = params.token;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/download'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload = {};
        if (typeof token !== 'undefined') {
            payload['token'] = token;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getFilePreview(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                bucketId: paramsOrFirst,
                fileId: rest[0],
                width: rest[1],
                height: rest[2],
                gravity: rest[3],
                quality: rest[4],
                borderWidth: rest[5],
                borderColor: rest[6],
                borderRadius: rest[7],
                opacity: rest[8],
                rotation: rest[9],
                background: rest[10],
                output: rest[11],
                token: rest[12]
            };
        }
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const width = params.width;
        const height = params.height;
        const gravity = params.gravity;
        const quality = params.quality;
        const borderWidth = params.borderWidth;
        const borderColor = params.borderColor;
        const borderRadius = params.borderRadius;
        const opacity = params.opacity;
        const rotation = params.rotation;
        const background = params.background;
        const output = params.output;
        const token = params.token;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/preview'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload = {};
        if (typeof width !== 'undefined') {
            payload['width'] = width;
        }
        if (typeof height !== 'undefined') {
            payload['height'] = height;
        }
        if (typeof gravity !== 'undefined') {
            payload['gravity'] = gravity;
        }
        if (typeof quality !== 'undefined') {
            payload['quality'] = quality;
        }
        if (typeof borderWidth !== 'undefined') {
            payload['borderWidth'] = borderWidth;
        }
        if (typeof borderColor !== 'undefined') {
            payload['borderColor'] = borderColor;
        }
        if (typeof borderRadius !== 'undefined') {
            payload['borderRadius'] = borderRadius;
        }
        if (typeof opacity !== 'undefined') {
            payload['opacity'] = opacity;
        }
        if (typeof rotation !== 'undefined') {
            payload['rotation'] = rotation;
        }
        if (typeof background !== 'undefined') {
            payload['background'] = background;
        }
        if (typeof output !== 'undefined') {
            payload['output'] = output;
        }
        if (typeof token !== 'undefined') {
            payload['token'] = token;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    getFileView(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                bucketId: paramsOrFirst,
                fileId: rest[0],
                token: rest[1]
            };
        }
        const bucketId = params.bucketId;
        const fileId = params.fileId;
        const token = params.token;
        if (typeof bucketId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "bucketId"');
        }
        if (typeof fileId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "fileId"');
        }
        const apiPath = '/storage/buckets/{bucketId}/files/{fileId}/view'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
        const payload = {};
        if (typeof token !== 'undefined') {
            payload['token'] = token;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        payload['project'] = this.client.config.project;
        for (const [key, value] of Object.entries(Service.flatten(payload))){
            uri.searchParams.append(key, value);
        }
        return uri.toString();
    }
    constructor(client){
        this.client = client;
    }
}
class TablesDB {
    listRows(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                queries: rest[1]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const queries = params.queries;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    createRow(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                rowId: rest[1],
                data: rest[2],
                permissions: rest[3]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }
        if (typeof data === 'undefined') {
            throw new AppwriteException('Missing required parameter: "data"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
        const payload = {};
        if (typeof rowId !== 'undefined') {
            payload['rowId'] = rowId;
        }
        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    getRow(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                rowId: rest[1],
                queries: rest[2]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const queries = params.queries;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    upsertRow(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                rowId: rest[1],
                data: rest[2],
                permissions: rest[3]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload = {};
        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    updateRow(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                rowId: rest[1],
                data: rest[2],
                permissions: rest[3]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const data = params.data;
        const permissions = params.permissions;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload = {};
        if (typeof data !== 'undefined') {
            payload['data'] = data;
        }
        if (typeof permissions !== 'undefined') {
            payload['permissions'] = permissions;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    deleteRow(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                rowId: rest[1]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    decrementRowColumn(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                rowId: rest[1],
                column: rest[2],
                value: rest[3],
                min: rest[4]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const column = params.column;
        const value = params.value;
        const min = params.min;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }
        if (typeof column === 'undefined') {
            throw new AppwriteException('Missing required parameter: "column"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/decrement'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
        const payload = {};
        if (typeof value !== 'undefined') {
            payload['value'] = value;
        }
        if (typeof min !== 'undefined') {
            payload['min'] = min;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    incrementRowColumn(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                databaseId: paramsOrFirst,
                tableId: rest[0],
                rowId: rest[1],
                column: rest[2],
                value: rest[3],
                max: rest[4]
            };
        }
        const databaseId = params.databaseId;
        const tableId = params.tableId;
        const rowId = params.rowId;
        const column = params.column;
        const value = params.value;
        const max = params.max;
        if (typeof databaseId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "databaseId"');
        }
        if (typeof tableId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "tableId"');
        }
        if (typeof rowId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "rowId"');
        }
        if (typeof column === 'undefined') {
            throw new AppwriteException('Missing required parameter: "column"');
        }
        const apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/increment'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
        const payload = {};
        if (typeof value !== 'undefined') {
            payload['value'] = value;
        }
        if (typeof max !== 'undefined') {
            payload['max'] = max;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
class Teams {
    list(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (!paramsOrFirst || paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                queries: paramsOrFirst,
                search: rest[0]
            };
        }
        const queries = params.queries;
        const search = params.search;
        const apiPath = '/teams';
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        if (typeof search !== 'undefined') {
            payload['search'] = search;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    create(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                name: rest[0],
                roles: rest[1]
            };
        }
        const teamId = params.teamId;
        const name = params.name;
        const roles = params.roles;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }
        const apiPath = '/teams';
        const payload = {};
        if (typeof teamId !== 'undefined') {
            payload['teamId'] = teamId;
        }
        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }
        if (typeof roles !== 'undefined') {
            payload['roles'] = roles;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    get(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst
            };
        }
        const teamId = params.teamId;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        const apiPath = '/teams/{teamId}'.replace('{teamId}', teamId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    updateName(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                name: rest[0]
            };
        }
        const teamId = params.teamId;
        const name = params.name;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof name === 'undefined') {
            throw new AppwriteException('Missing required parameter: "name"');
        }
        const apiPath = '/teams/{teamId}'.replace('{teamId}', teamId);
        const payload = {};
        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    delete(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst
            };
        }
        const teamId = params.teamId;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        const apiPath = '/teams/{teamId}'.replace('{teamId}', teamId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    listMemberships(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                queries: rest[0],
                search: rest[1]
            };
        }
        const teamId = params.teamId;
        const queries = params.queries;
        const search = params.search;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        const apiPath = '/teams/{teamId}/memberships'.replace('{teamId}', teamId);
        const payload = {};
        if (typeof queries !== 'undefined') {
            payload['queries'] = queries;
        }
        if (typeof search !== 'undefined') {
            payload['search'] = search;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    createMembership(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                roles: rest[0],
                email: rest[1],
                userId: rest[2],
                phone: rest[3],
                url: rest[4],
                name: rest[5]
            };
        }
        const teamId = params.teamId;
        const roles = params.roles;
        const email = params.email;
        const userId = params.userId;
        const phone = params.phone;
        const url = params.url;
        const name = params.name;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof roles === 'undefined') {
            throw new AppwriteException('Missing required parameter: "roles"');
        }
        const apiPath = '/teams/{teamId}/memberships'.replace('{teamId}', teamId);
        const payload = {};
        if (typeof email !== 'undefined') {
            payload['email'] = email;
        }
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof phone !== 'undefined') {
            payload['phone'] = phone;
        }
        if (typeof roles !== 'undefined') {
            payload['roles'] = roles;
        }
        if (typeof url !== 'undefined') {
            payload['url'] = url;
        }
        if (typeof name !== 'undefined') {
            payload['name'] = name;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('post', uri, apiHeaders, payload);
    }
    getMembership(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                membershipId: rest[0]
            };
        }
        const teamId = params.teamId;
        const membershipId = params.membershipId;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof membershipId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "membershipId"');
        }
        const apiPath = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    updateMembership(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                membershipId: rest[0],
                roles: rest[1]
            };
        }
        const teamId = params.teamId;
        const membershipId = params.membershipId;
        const roles = params.roles;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof membershipId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "membershipId"');
        }
        if (typeof roles === 'undefined') {
            throw new AppwriteException('Missing required parameter: "roles"');
        }
        const apiPath = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
        const payload = {};
        if (typeof roles !== 'undefined') {
            payload['roles'] = roles;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    deleteMembership(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                membershipId: rest[0]
            };
        }
        const teamId = params.teamId;
        const membershipId = params.membershipId;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof membershipId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "membershipId"');
        }
        const apiPath = '/teams/{teamId}/memberships/{membershipId}'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('delete', uri, apiHeaders, payload);
    }
    updateMembershipStatus(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                membershipId: rest[0],
                userId: rest[1],
                secret: rest[2]
            };
        }
        const teamId = params.teamId;
        const membershipId = params.membershipId;
        const userId = params.userId;
        const secret = params.secret;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof membershipId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "membershipId"');
        }
        if (typeof userId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "userId"');
        }
        if (typeof secret === 'undefined') {
            throw new AppwriteException('Missing required parameter: "secret"');
        }
        const apiPath = '/teams/{teamId}/memberships/{membershipId}/status'.replace('{teamId}', teamId).replace('{membershipId}', membershipId);
        const payload = {};
        if (typeof userId !== 'undefined') {
            payload['userId'] = userId;
        }
        if (typeof secret !== 'undefined') {
            payload['secret'] = secret;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('patch', uri, apiHeaders, payload);
    }
    getPrefs(paramsOrFirst) {
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst
            };
        }
        const teamId = params.teamId;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        const apiPath = '/teams/{teamId}/prefs'.replace('{teamId}', teamId);
        const payload = {};
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {};
        return this.client.call('get', uri, apiHeaders, payload);
    }
    updatePrefs(paramsOrFirst) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            rest[_key - 1] = arguments[_key];
        }
        let params;
        if (paramsOrFirst && typeof paramsOrFirst === 'object' && !Array.isArray(paramsOrFirst)) {
            params = paramsOrFirst || {};
        } else {
            params = {
                teamId: paramsOrFirst,
                prefs: rest[0]
            };
        }
        const teamId = params.teamId;
        const prefs = params.prefs;
        if (typeof teamId === 'undefined') {
            throw new AppwriteException('Missing required parameter: "teamId"');
        }
        if (typeof prefs === 'undefined') {
            throw new AppwriteException('Missing required parameter: "prefs"');
        }
        const apiPath = '/teams/{teamId}/prefs'.replace('{teamId}', teamId);
        const payload = {};
        if (typeof prefs !== 'undefined') {
            payload['prefs'] = prefs;
        }
        const uri = new URL(this.client.config.endpoint + apiPath);
        const apiHeaders = {
            'content-type': 'application/json'
        };
        return this.client.call('put', uri, apiHeaders, payload);
    }
    constructor(client){
        this.client = client;
    }
}
/**
 * Helper class to generate permission strings for resources.
 */ class Permission {
}
/**
 * Generate read permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */ Permission.read = (role)=>{
    return 'read("'.concat(role, '")');
};
/**
 * Generate write permission string for the provided role.
 *
 * This is an alias of update, delete, and possibly create.
 * Don't use write in combination with update, delete, or create.
 *
 * @param {string} role
 * @returns {string}
 */ Permission.write = (role)=>{
    return 'write("'.concat(role, '")');
};
/**
 * Generate create permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */ Permission.create = (role)=>{
    return 'create("'.concat(role, '")');
};
/**
 * Generate update permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */ Permission.update = (role)=>{
    return 'update("'.concat(role, '")');
};
/**
 * Generate delete permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */ Permission.delete = (role)=>{
    return 'delete("'.concat(role, '")');
};
/**
 * Helper class to generate role strings for `Permission`.
 */ class Role {
    /**
     * Grants access to anyone.
     *
     * This includes authenticated and unauthenticated users.
     *
     * @returns {string}
     */ static any() {
        return 'any';
    }
    /**
     * Grants access to a specific user by user ID.
     *
     * You can optionally pass verified or unverified for
     * `status` to target specific types of users.
     *
     * @param {string} id
     * @param {string} status
     * @returns {string}
     */ static user(id) {
        let status = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
        if (status === '') {
            return "user:".concat(id);
        }
        return "user:".concat(id, "/").concat(status);
    }
    /**
     * Grants access to any authenticated or anonymous user.
     *
     * You can optionally pass verified or unverified for
     * `status` to target specific types of users.
     *
     * @param {string} status
     * @returns {string}
     */ static users() {
        let status = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
        if (status === '') {
            return 'users';
        }
        return "users/".concat(status);
    }
    /**
     * Grants access to any guest user without a session.
     *
     * Authenticated users don't have access to this role.
     *
     * @returns {string}
     */ static guests() {
        return 'guests';
    }
    /**
     * Grants access to a team by team ID.
     *
     * You can optionally pass a role for `role` to target
     * team members with the specified role.
     *
     * @param {string} id
     * @param {string} role
     * @returns {string}
     */ static team(id) {
        let role = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
        if (role === '') {
            return "team:".concat(id);
        }
        return "team:".concat(id, "/").concat(role);
    }
    /**
     * Grants access to a specific member of a team.
     *
     * When the member is removed from the team, they will
     * no longer have access.
     *
     * @param {string} id
     * @returns {string}
     */ static member(id) {
        return "member:".concat(id);
    }
    /**
     * Grants access to a user with the specified label.
     *
     * @param {string} name
     * @returns  {string}
     */ static label(name) {
        return "label:".concat(name);
    }
}
var _a, _ID_hexTimestamp;
/**
 * Helper class to generate ID strings for resources.
 */ class ID {
    /**
     * Uses the provided ID as the ID for the resource.
     *
     * @param {string} id
     * @returns {string}
     */ static custom(id) {
        return id;
    }
    /**
     * Have Appwrite generate a unique ID for you.
     *
     * @param {number} padding. Default is 7.
     * @returns {string}
     */ static unique() {
        let padding = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 7;
        // Generate a unique ID with padding to have a longer ID
        const baseId = __classPrivateFieldGet(ID, _a, "m", _ID_hexTimestamp).call(ID);
        let randomPadding = '';
        for(let i = 0; i < padding; i++){
            const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
            randomPadding += randomHexDigit;
        }
        return baseId + randomPadding;
    }
}
_a = ID, _ID_hexTimestamp = function _ID_hexTimestamp() {
    const now = new Date();
    const sec = Math.floor(now.getTime() / 1000);
    const msec = now.getMilliseconds();
    // Convert to hexadecimal
    const hexTimestamp = sec.toString(16) + msec.toString(16).padStart(5, '0');
    return hexTimestamp;
};
var AuthenticatorType;
(function(AuthenticatorType) {
    AuthenticatorType["Totp"] = "totp";
})(AuthenticatorType || (AuthenticatorType = {}));
var AuthenticationFactor;
(function(AuthenticationFactor) {
    AuthenticationFactor["Email"] = "email";
    AuthenticationFactor["Phone"] = "phone";
    AuthenticationFactor["Totp"] = "totp";
    AuthenticationFactor["Recoverycode"] = "recoverycode";
})(AuthenticationFactor || (AuthenticationFactor = {}));
var OAuthProvider;
(function(OAuthProvider) {
    OAuthProvider["Amazon"] = "amazon";
    OAuthProvider["Apple"] = "apple";
    OAuthProvider["Auth0"] = "auth0";
    OAuthProvider["Authentik"] = "authentik";
    OAuthProvider["Autodesk"] = "autodesk";
    OAuthProvider["Bitbucket"] = "bitbucket";
    OAuthProvider["Bitly"] = "bitly";
    OAuthProvider["Box"] = "box";
    OAuthProvider["Dailymotion"] = "dailymotion";
    OAuthProvider["Discord"] = "discord";
    OAuthProvider["Disqus"] = "disqus";
    OAuthProvider["Dropbox"] = "dropbox";
    OAuthProvider["Etsy"] = "etsy";
    OAuthProvider["Facebook"] = "facebook";
    OAuthProvider["Figma"] = "figma";
    OAuthProvider["Github"] = "github";
    OAuthProvider["Gitlab"] = "gitlab";
    OAuthProvider["Google"] = "google";
    OAuthProvider["Linkedin"] = "linkedin";
    OAuthProvider["Microsoft"] = "microsoft";
    OAuthProvider["Notion"] = "notion";
    OAuthProvider["Oidc"] = "oidc";
    OAuthProvider["Okta"] = "okta";
    OAuthProvider["Paypal"] = "paypal";
    OAuthProvider["PaypalSandbox"] = "paypalSandbox";
    OAuthProvider["Podio"] = "podio";
    OAuthProvider["Salesforce"] = "salesforce";
    OAuthProvider["Slack"] = "slack";
    OAuthProvider["Spotify"] = "spotify";
    OAuthProvider["Stripe"] = "stripe";
    OAuthProvider["Tradeshift"] = "tradeshift";
    OAuthProvider["TradeshiftBox"] = "tradeshiftBox";
    OAuthProvider["Twitch"] = "twitch";
    OAuthProvider["Wordpress"] = "wordpress";
    OAuthProvider["Yahoo"] = "yahoo";
    OAuthProvider["Yammer"] = "yammer";
    OAuthProvider["Yandex"] = "yandex";
    OAuthProvider["Zoho"] = "zoho";
    OAuthProvider["Zoom"] = "zoom";
    OAuthProvider["Mock"] = "mock";
})(OAuthProvider || (OAuthProvider = {}));
var Browser;
(function(Browser) {
    Browser["AvantBrowser"] = "aa";
    Browser["AndroidWebViewBeta"] = "an";
    Browser["GoogleChrome"] = "ch";
    Browser["GoogleChromeIOS"] = "ci";
    Browser["GoogleChromeMobile"] = "cm";
    Browser["Chromium"] = "cr";
    Browser["MozillaFirefox"] = "ff";
    Browser["Safari"] = "sf";
    Browser["MobileSafari"] = "mf";
    Browser["MicrosoftEdge"] = "ps";
    Browser["MicrosoftEdgeIOS"] = "oi";
    Browser["OperaMini"] = "om";
    Browser["Opera"] = "op";
    Browser["OperaNext"] = "on";
})(Browser || (Browser = {}));
var CreditCard;
(function(CreditCard) {
    CreditCard["AmericanExpress"] = "amex";
    CreditCard["Argencard"] = "argencard";
    CreditCard["Cabal"] = "cabal";
    CreditCard["Cencosud"] = "cencosud";
    CreditCard["DinersClub"] = "diners";
    CreditCard["Discover"] = "discover";
    CreditCard["Elo"] = "elo";
    CreditCard["Hipercard"] = "hipercard";
    CreditCard["JCB"] = "jcb";
    CreditCard["Mastercard"] = "mastercard";
    CreditCard["Naranja"] = "naranja";
    CreditCard["TarjetaShopping"] = "targeta-shopping";
    CreditCard["UnionPay"] = "unionpay";
    CreditCard["Visa"] = "visa";
    CreditCard["MIR"] = "mir";
    CreditCard["Maestro"] = "maestro";
    CreditCard["Rupay"] = "rupay";
})(CreditCard || (CreditCard = {}));
var Flag;
(function(Flag) {
    Flag["Afghanistan"] = "af";
    Flag["Angola"] = "ao";
    Flag["Albania"] = "al";
    Flag["Andorra"] = "ad";
    Flag["UnitedArabEmirates"] = "ae";
    Flag["Argentina"] = "ar";
    Flag["Armenia"] = "am";
    Flag["AntiguaAndBarbuda"] = "ag";
    Flag["Australia"] = "au";
    Flag["Austria"] = "at";
    Flag["Azerbaijan"] = "az";
    Flag["Burundi"] = "bi";
    Flag["Belgium"] = "be";
    Flag["Benin"] = "bj";
    Flag["BurkinaFaso"] = "bf";
    Flag["Bangladesh"] = "bd";
    Flag["Bulgaria"] = "bg";
    Flag["Bahrain"] = "bh";
    Flag["Bahamas"] = "bs";
    Flag["BosniaAndHerzegovina"] = "ba";
    Flag["Belarus"] = "by";
    Flag["Belize"] = "bz";
    Flag["Bolivia"] = "bo";
    Flag["Brazil"] = "br";
    Flag["Barbados"] = "bb";
    Flag["BruneiDarussalam"] = "bn";
    Flag["Bhutan"] = "bt";
    Flag["Botswana"] = "bw";
    Flag["CentralAfricanRepublic"] = "cf";
    Flag["Canada"] = "ca";
    Flag["Switzerland"] = "ch";
    Flag["Chile"] = "cl";
    Flag["China"] = "cn";
    Flag["CoteDIvoire"] = "ci";
    Flag["Cameroon"] = "cm";
    Flag["DemocraticRepublicOfTheCongo"] = "cd";
    Flag["RepublicOfTheCongo"] = "cg";
    Flag["Colombia"] = "co";
    Flag["Comoros"] = "km";
    Flag["CapeVerde"] = "cv";
    Flag["CostaRica"] = "cr";
    Flag["Cuba"] = "cu";
    Flag["Cyprus"] = "cy";
    Flag["CzechRepublic"] = "cz";
    Flag["Germany"] = "de";
    Flag["Djibouti"] = "dj";
    Flag["Dominica"] = "dm";
    Flag["Denmark"] = "dk";
    Flag["DominicanRepublic"] = "do";
    Flag["Algeria"] = "dz";
    Flag["Ecuador"] = "ec";
    Flag["Egypt"] = "eg";
    Flag["Eritrea"] = "er";
    Flag["Spain"] = "es";
    Flag["Estonia"] = "ee";
    Flag["Ethiopia"] = "et";
    Flag["Finland"] = "fi";
    Flag["Fiji"] = "fj";
    Flag["France"] = "fr";
    Flag["MicronesiaFederatedStatesOf"] = "fm";
    Flag["Gabon"] = "ga";
    Flag["UnitedKingdom"] = "gb";
    Flag["Georgia"] = "ge";
    Flag["Ghana"] = "gh";
    Flag["Guinea"] = "gn";
    Flag["Gambia"] = "gm";
    Flag["GuineaBissau"] = "gw";
    Flag["EquatorialGuinea"] = "gq";
    Flag["Greece"] = "gr";
    Flag["Grenada"] = "gd";
    Flag["Guatemala"] = "gt";
    Flag["Guyana"] = "gy";
    Flag["Honduras"] = "hn";
    Flag["Croatia"] = "hr";
    Flag["Haiti"] = "ht";
    Flag["Hungary"] = "hu";
    Flag["Indonesia"] = "id";
    Flag["India"] = "in";
    Flag["Ireland"] = "ie";
    Flag["IranIslamicRepublicOf"] = "ir";
    Flag["Iraq"] = "iq";
    Flag["Iceland"] = "is";
    Flag["Israel"] = "il";
    Flag["Italy"] = "it";
    Flag["Jamaica"] = "jm";
    Flag["Jordan"] = "jo";
    Flag["Japan"] = "jp";
    Flag["Kazakhstan"] = "kz";
    Flag["Kenya"] = "ke";
    Flag["Kyrgyzstan"] = "kg";
    Flag["Cambodia"] = "kh";
    Flag["Kiribati"] = "ki";
    Flag["SaintKittsAndNevis"] = "kn";
    Flag["SouthKorea"] = "kr";
    Flag["Kuwait"] = "kw";
    Flag["LaoPeopleSDemocraticRepublic"] = "la";
    Flag["Lebanon"] = "lb";
    Flag["Liberia"] = "lr";
    Flag["Libya"] = "ly";
    Flag["SaintLucia"] = "lc";
    Flag["Liechtenstein"] = "li";
    Flag["SriLanka"] = "lk";
    Flag["Lesotho"] = "ls";
    Flag["Lithuania"] = "lt";
    Flag["Luxembourg"] = "lu";
    Flag["Latvia"] = "lv";
    Flag["Morocco"] = "ma";
    Flag["Monaco"] = "mc";
    Flag["Moldova"] = "md";
    Flag["Madagascar"] = "mg";
    Flag["Maldives"] = "mv";
    Flag["Mexico"] = "mx";
    Flag["MarshallIslands"] = "mh";
    Flag["NorthMacedonia"] = "mk";
    Flag["Mali"] = "ml";
    Flag["Malta"] = "mt";
    Flag["Myanmar"] = "mm";
    Flag["Montenegro"] = "me";
    Flag["Mongolia"] = "mn";
    Flag["Mozambique"] = "mz";
    Flag["Mauritania"] = "mr";
    Flag["Mauritius"] = "mu";
    Flag["Malawi"] = "mw";
    Flag["Malaysia"] = "my";
    Flag["Namibia"] = "na";
    Flag["Niger"] = "ne";
    Flag["Nigeria"] = "ng";
    Flag["Nicaragua"] = "ni";
    Flag["Netherlands"] = "nl";
    Flag["Norway"] = "no";
    Flag["Nepal"] = "np";
    Flag["Nauru"] = "nr";
    Flag["NewZealand"] = "nz";
    Flag["Oman"] = "om";
    Flag["Pakistan"] = "pk";
    Flag["Panama"] = "pa";
    Flag["Peru"] = "pe";
    Flag["Philippines"] = "ph";
    Flag["Palau"] = "pw";
    Flag["PapuaNewGuinea"] = "pg";
    Flag["Poland"] = "pl";
    Flag["FrenchPolynesia"] = "pf";
    Flag["NorthKorea"] = "kp";
    Flag["Portugal"] = "pt";
    Flag["Paraguay"] = "py";
    Flag["Qatar"] = "qa";
    Flag["Romania"] = "ro";
    Flag["Russia"] = "ru";
    Flag["Rwanda"] = "rw";
    Flag["SaudiArabia"] = "sa";
    Flag["Sudan"] = "sd";
    Flag["Senegal"] = "sn";
    Flag["Singapore"] = "sg";
    Flag["SolomonIslands"] = "sb";
    Flag["SierraLeone"] = "sl";
    Flag["ElSalvador"] = "sv";
    Flag["SanMarino"] = "sm";
    Flag["Somalia"] = "so";
    Flag["Serbia"] = "rs";
    Flag["SouthSudan"] = "ss";
    Flag["SaoTomeAndPrincipe"] = "st";
    Flag["Suriname"] = "sr";
    Flag["Slovakia"] = "sk";
    Flag["Slovenia"] = "si";
    Flag["Sweden"] = "se";
    Flag["Eswatini"] = "sz";
    Flag["Seychelles"] = "sc";
    Flag["Syria"] = "sy";
    Flag["Chad"] = "td";
    Flag["Togo"] = "tg";
    Flag["Thailand"] = "th";
    Flag["Tajikistan"] = "tj";
    Flag["Turkmenistan"] = "tm";
    Flag["TimorLeste"] = "tl";
    Flag["Tonga"] = "to";
    Flag["TrinidadAndTobago"] = "tt";
    Flag["Tunisia"] = "tn";
    Flag["Turkey"] = "tr";
    Flag["Tuvalu"] = "tv";
    Flag["Tanzania"] = "tz";
    Flag["Uganda"] = "ug";
    Flag["Ukraine"] = "ua";
    Flag["Uruguay"] = "uy";
    Flag["UnitedStates"] = "us";
    Flag["Uzbekistan"] = "uz";
    Flag["VaticanCity"] = "va";
    Flag["SaintVincentAndTheGrenadines"] = "vc";
    Flag["Venezuela"] = "ve";
    Flag["Vietnam"] = "vn";
    Flag["Vanuatu"] = "vu";
    Flag["Samoa"] = "ws";
    Flag["Yemen"] = "ye";
    Flag["SouthAfrica"] = "za";
    Flag["Zambia"] = "zm";
    Flag["Zimbabwe"] = "zw";
})(Flag || (Flag = {}));
var ExecutionMethod;
(function(ExecutionMethod) {
    ExecutionMethod["GET"] = "GET";
    ExecutionMethod["POST"] = "POST";
    ExecutionMethod["PUT"] = "PUT";
    ExecutionMethod["PATCH"] = "PATCH";
    ExecutionMethod["DELETE"] = "DELETE";
    ExecutionMethod["OPTIONS"] = "OPTIONS";
    ExecutionMethod["HEAD"] = "HEAD";
})(ExecutionMethod || (ExecutionMethod = {}));
var ImageGravity;
(function(ImageGravity) {
    ImageGravity["Center"] = "center";
    ImageGravity["Topleft"] = "top-left";
    ImageGravity["Top"] = "top";
    ImageGravity["Topright"] = "top-right";
    ImageGravity["Left"] = "left";
    ImageGravity["Right"] = "right";
    ImageGravity["Bottomleft"] = "bottom-left";
    ImageGravity["Bottom"] = "bottom";
    ImageGravity["Bottomright"] = "bottom-right";
})(ImageGravity || (ImageGravity = {}));
var ImageFormat;
(function(ImageFormat) {
    ImageFormat["Jpg"] = "jpg";
    ImageFormat["Jpeg"] = "jpeg";
    ImageFormat["Png"] = "png";
    ImageFormat["Webp"] = "webp";
    ImageFormat["Heic"] = "heic";
    ImageFormat["Avif"] = "avif";
    ImageFormat["Gif"] = "gif";
})(ImageFormat || (ImageFormat = {}));
;
 //# sourceMappingURL=sdk.js.map
}),
]);

//# sourceMappingURL=96830_49dfb8d5._.js.map