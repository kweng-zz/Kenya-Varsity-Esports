(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/esports/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/esports/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target) {
    for(var _len = arguments.length, searchParamsList = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        searchParamsList[_key - 1] = arguments[_key];
    }
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
} //# sourceMappingURL=querystring.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? "[" + hostname + "]" : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && "?" + query || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return "" + protocol + host + pathname + search + hash;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn("Unknown key passed via urlObject into url.format: " + key);
                }
            });
        }
    }
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map
}),
"[project]/esports/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (e.g. via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-merged-ref.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port ? ':' + port : '');
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? "?" + urlParts.slice(1).join('?') : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        var _App_prototype;
        if ((_App_prototype = App.prototype) == null ? void 0 : _App_prototype.getInitialProps) {
            const message = '"' + getDisplayName(App) + '.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.';
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = '"' + getDisplayName(App) + '.getInitialProps()" should resolve to an object. But found "' + props + '" instead.';
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn("" + getDisplayName(App) + " returned an empty object from `getInitialProps`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps");
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = "Cannot find module for page: " + page;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = "Failed to load static file for page: " + page + " " + message;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = "Cannot find the middleware module";
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
} //# sourceMappingURL=utils.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/has-base-path.js [app-client] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
} //# sourceMappingURL=is-local-url.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
} //# sourceMappingURL=error-once.js.map
}),
"[project]/esports/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _approuterinstance = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/components/app-router-instance.js [app-client] (ecmascript)");
const _erroronce = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
const _segmentcache = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/components/segment-cache.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate) {
    const { nodeName } = e.currentTarget;
    // anchors inside an svg have a lowercase nodeName
    const isAnchorNodeName = nodeName.toUpperCase() === 'A';
    if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
        // ignore click for browser’s default behavior
        return;
    }
    if (!(0, _islocalurl.isLocalURL)(href)) {
        if (replace) {
            // browser default behavior does not replace the history state
            // so we need to do it manually
            e.preventDefault();
            location.replace(href);
        }
        // ignore click for browser’s default behavior
        return;
    }
    e.preventDefault();
    if (onNavigate) {
        let isDefaultPrevented = false;
        onNavigate({
            preventDefault: ()=>{
                isDefaultPrevented = true;
            }
        });
        if (isDefaultPrevented) {
            return;
        }
    }
    _react.default.startTransition(()=>{
        (0, _approuterinstance.dispatchNavigateAction)(as || href, replace ? 'replace' : 'push', scroll != null ? scroll : true, linkInstanceRef.current);
    });
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const fetchStrategy = prefetchProp !== false ? getFetchStrategyFromPrefetchProp(prefetchProp) : _segmentcache.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error("Failed prop type: The prop `" + args.key + "` expects a " + args.expected + " in `<Link>`, but got `" + args.actual + "` instead." + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto' && props[key] !== 'unstable_forceStale') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto" | "unstable_forceStale"`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _ = key;
            }
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (props.locale) {
            (0, _warnonce.warnOnce)('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof hrefProp === 'string') {
                href = hrefProp;
            } else if (typeof hrefProp === 'object' && typeof hrefProp.pathname === 'string') {
                href = hrefProp.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error("Dynamic href `" + href + "` found in <Link> while using the `/app` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href"), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const { href, as } = _react.default.useMemo({
        "LinkComponent.useMemo": ()=>{
            const resolvedHref = formatStringOrUrl(hrefProp);
            return {
                href: resolvedHref,
                as: asProp ? formatStringOrUrl(asProp) : resolvedHref
            };
        }
    }["LinkComponent.useMemo"], [
        hrefProp,
        asProp
    ]);
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn('"onClick" was passed to <Link> with `href` of `' + hrefProp + '` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link');
            }
            if (onMouseEnterProp) {
                console.warn('"onMouseEnter" was passed to <Link> with `href` of `' + hrefProp + '` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link');
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error("No children were passed to <Link> with `href` of `" + hrefProp + "` but one child is required https://nextjs.org/docs/messages/link-no-children"), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error("Multiple children were passed to <Link> with `href` of `" + hrefProp + "` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children" + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ((children == null ? void 0 : children.type) === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        href,
        router,
        fetchStrategy,
        setOptimisticLinkStatus
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error('Component rendered inside next/link has to pass click event to "onClick" prop.'), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
    // defined, we specify the current 'href', so that repetition is not needed by the user.
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(as)) {
        childProps.href = as;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(as);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, _erroronce.errorOnce)('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchProp(prefetchProp) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchProp === null || prefetchProp === 'auto' ? _segmentcache.FetchStrategy.PPR : // (although invalid values should've been filtered out by prop validation in dev)
        _segmentcache.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map
}),
"[project]/esports/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/compose-refs/src/compose-refs.tsx
__turbopack_context__.s([
    "composeRefs",
    ()=>composeRefs,
    "useComposedRefs",
    ()=>useComposedRefs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function setRef(ref, value) {
    if (typeof ref === "function") {
        return ref(value);
    } else if (ref !== null && ref !== void 0) {
        ref.current = value;
    }
}
function composeRefs() {
    for(var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++){
        refs[_key] = arguments[_key];
    }
    return (node)=>{
        let hasCleanup = false;
        const cleanups = refs.map((ref)=>{
            const cleanup = setRef(ref, node);
            if (!hasCleanup && typeof cleanup == "function") {
                hasCleanup = true;
            }
            return cleanup;
        });
        if (hasCleanup) {
            return ()=>{
                for(let i = 0; i < cleanups.length; i++){
                    const cleanup = cleanups[i];
                    if (typeof cleanup == "function") {
                        cleanup();
                    } else {
                        setRef(refs[i], null);
                    }
                }
            };
        }
    };
}
function useComposedRefs() {
    for(var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++){
        refs[_key] = arguments[_key];
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"](composeRefs(...refs), refs);
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/esports/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/slot.tsx
__turbopack_context__.s([
    "Root",
    ()=>Slot,
    "Slot",
    ()=>Slot,
    "Slottable",
    ()=>Slottable,
    "createSlot",
    ()=>createSlot,
    "createSlottable",
    ()=>createSlottable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot2 = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { children, ...slotProps } = props;
        const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].toArray(children);
        const slottable = childrenArray.find(isSlottable);
        if (slottable) {
            const newElement = slottable.props.children;
            const newChildren = childrenArray.map((child)=>{
                if (child === slottable) {
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].count(newElement) > 1) return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].only(null);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](newElement) ? newElement.props.children : null;
                } else {
                    return child;
                }
            });
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
                ...slotProps,
                ref: forwardedRef,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](newElement) ? __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](newElement, void 0, newChildren) : null
            });
        }
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
            ...slotProps,
            ref: forwardedRef,
            children
        });
    });
    Slot2.displayName = "".concat(ownerName, ".Slot");
    return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
    const SlotClone = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { children, ...slotProps } = props;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](children)) {
            const childrenRef = getElementRef(children);
            const props2 = mergeProps(slotProps, children.props);
            if (children.type !== __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"]) {
                props2.ref = forwardedRef ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeRefs"])(forwardedRef, childrenRef) : childrenRef;
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](children, props2);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].count(children) > 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].only(null) : null;
    });
    SlotClone.displayName = "".concat(ownerName, ".SlotClone");
    return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
    const Slottable2 = (param)=>{
        let { children } = param;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children
        });
    };
    Slottable2.displayName = "".concat(ownerName, ".Slottable");
    Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
    return Slottable2;
}
var Slottable = /* @__PURE__ */ createSlottable("Slottable");
function isSlottable(child) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
    const overrideProps = {
        ...childProps
    };
    for(const propName in childProps){
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];
        const isHandler = /^on[A-Z]/.test(propName);
        if (isHandler) {
            if (slotPropValue && childPropValue) {
                overrideProps[propName] = function() {
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = arguments[_key];
                    }
                    const result = childPropValue(...args);
                    slotPropValue(...args);
                    return result;
                };
            } else if (slotPropValue) {
                overrideProps[propName] = slotPropValue;
            }
        } else if (propName === "style") {
            overrideProps[propName] = {
                ...slotPropValue,
                ...childPropValue
            };
        } else if (propName === "className") {
            overrideProps[propName] = [
                slotPropValue,
                childPropValue
            ].filter(Boolean).join(" ");
        }
    }
    return {
        ...slotProps,
        ...overrideProps
    };
}
function getElementRef(element) {
    var _Object_getOwnPropertyDescriptor, _Object_getOwnPropertyDescriptor1;
    let getter = (_Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor(element.props, "ref")) === null || _Object_getOwnPropertyDescriptor === void 0 ? void 0 : _Object_getOwnPropertyDescriptor.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.ref;
    }
    getter = (_Object_getOwnPropertyDescriptor1 = Object.getOwnPropertyDescriptor(element, "ref")) === null || _Object_getOwnPropertyDescriptor1 === void 0 ? void 0 : _Object_getOwnPropertyDescriptor1.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.props.ref;
    }
    return element.props.ref || element.ref;
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/esports/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clsx",
    ()=>clsx,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
        var o = e.length;
        for(t = 0; t < o; t++)e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for(f in e)e[f] && (n && (n += " "), n += f);
    return n;
}
function clsx() {
    for(var e, t, f = 0, n = "", o = arguments.length; f < o; f++)(e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
}
const __TURBOPACK__default__export__ = clsx;
}),
"[project]/esports/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Copyright 2022 Joe Bell. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */ __turbopack_context__.s([
    "cva",
    ()=>cva,
    "cx",
    ()=>cx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
const falsyToString = (value)=>typeof value === "boolean" ? "".concat(value) : value === 0 ? "0" : value;
const cx = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"];
const cva = (base, config)=>(props)=>{
        var _config_compoundVariants;
        if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
        const { variants, defaultVariants } = config;
        const getVariantClassNames = Object.keys(variants).map((variant)=>{
            const variantProp = props === null || props === void 0 ? void 0 : props[variant];
            const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
            if (variantProp === null) return null;
            const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
            return variants[variant][variantKey];
        });
        const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param)=>{
            let [key, value] = param;
            if (value === undefined) {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, {});
        const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param)=>{
            let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
            return Object.entries(compoundVariantOptions).every((param)=>{
                let [key, value] = param;
                return Array.isArray(value) ? value.includes({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                }[key]) : ({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                })[key] === value;
            }) ? [
                ...acc,
                cvClass,
                cvClassName
            ] : acc;
        }, []);
        return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    };
}),
"[project]/esports/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTailwindMerge",
    ()=>createTailwindMerge,
    "extendTailwindMerge",
    ()=>extendTailwindMerge,
    "fromTheme",
    ()=>fromTheme,
    "getDefaultConfig",
    ()=>getDefaultConfig,
    "mergeConfigs",
    ()=>mergeConfigs,
    "twJoin",
    ()=>twJoin,
    "twMerge",
    ()=>twMerge,
    "validators",
    ()=>validators
]);
const CLASS_PART_SEPARATOR = '-';
const createClassGroupUtils = (config)=>{
    const classMap = createClassMap(config);
    const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
    const getClassGroupId = (className)=>{
        const classParts = className.split(CLASS_PART_SEPARATOR);
        // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
        if (classParts[0] === '' && classParts.length !== 1) {
            classParts.shift();
        }
        return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier)=>{
        const conflicts = conflictingClassGroups[classGroupId] || [];
        if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
            return [
                ...conflicts,
                ...conflictingClassGroupModifiers[classGroupId]
            ];
        }
        return conflicts;
    };
    return {
        getClassGroupId,
        getConflictingClassGroupIds
    };
};
const getGroupRecursive = (classParts, classPartObject)=>{
    var _classPartObject_validators_find;
    if (classParts.length === 0) {
        return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[0];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
    if (classGroupFromNextClassPart) {
        return classGroupFromNextClassPart;
    }
    if (classPartObject.validators.length === 0) {
        return undefined;
    }
    const classRest = classParts.join(CLASS_PART_SEPARATOR);
    return (_classPartObject_validators_find = classPartObject.validators.find((param)=>{
        let { validator } = param;
        return validator(classRest);
    })) === null || _classPartObject_validators_find === void 0 ? void 0 : _classPartObject_validators_find.classGroupId;
};
const arbitraryPropertyRegex = /^\[(.+)\]$/;
const getGroupIdForArbitraryProperty = (className)=>{
    if (arbitraryPropertyRegex.test(className)) {
        const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
        const property = arbitraryPropertyClassName === null || arbitraryPropertyClassName === void 0 ? void 0 : arbitraryPropertyClassName.substring(0, arbitraryPropertyClassName.indexOf(':'));
        if (property) {
            // I use two dots here because one dot is used as prefix for class groups in plugins
            return 'arbitrary..' + property;
        }
    }
};
/**
 * Exported for testing only
 */ const createClassMap = (config)=>{
    const { theme, classGroups } = config;
    const classMap = {
        nextPart: new Map(),
        validators: []
    };
    for(const classGroupId in classGroups){
        processClassesRecursively(classGroups[classGroupId], classMap, classGroupId, theme);
    }
    return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme)=>{
    classGroup.forEach((classDefinition)=>{
        if (typeof classDefinition === 'string') {
            const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
            classPartObjectToEdit.classGroupId = classGroupId;
            return;
        }
        if (typeof classDefinition === 'function') {
            if (isThemeGetter(classDefinition)) {
                processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
                return;
            }
            classPartObject.validators.push({
                validator: classDefinition,
                classGroupId
            });
            return;
        }
        Object.entries(classDefinition).forEach((param)=>{
            let [key, classGroup] = param;
            processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
        });
    });
};
const getPart = (classPartObject, path)=>{
    let currentClassPartObject = classPartObject;
    path.split(CLASS_PART_SEPARATOR).forEach((pathPart)=>{
        if (!currentClassPartObject.nextPart.has(pathPart)) {
            currentClassPartObject.nextPart.set(pathPart, {
                nextPart: new Map(),
                validators: []
            });
        }
        currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
    });
    return currentClassPartObject;
};
const isThemeGetter = (func)=>func.isThemeGetter;
// LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
const createLruCache = (maxCacheSize)=>{
    if (maxCacheSize < 1) {
        return {
            get: ()=>undefined,
            set: ()=>{}
        };
    }
    let cacheSize = 0;
    let cache = new Map();
    let previousCache = new Map();
    const update = (key, value)=>{
        cache.set(key, value);
        cacheSize++;
        if (cacheSize > maxCacheSize) {
            cacheSize = 0;
            previousCache = cache;
            cache = new Map();
        }
    };
    return {
        get (key) {
            let value = cache.get(key);
            if (value !== undefined) {
                return value;
            }
            if ((value = previousCache.get(key)) !== undefined) {
                update(key, value);
                return value;
            }
        },
        set (key, value) {
            if (cache.has(key)) {
                cache.set(key, value);
            } else {
                update(key, value);
            }
        }
    };
};
const IMPORTANT_MODIFIER = '!';
const MODIFIER_SEPARATOR = ':';
const MODIFIER_SEPARATOR_LENGTH = MODIFIER_SEPARATOR.length;
const createParseClassName = (config)=>{
    const { prefix, experimentalParseClassName } = config;
    /**
   * Parse class name into parts.
   *
   * Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
   * @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
   */ let parseClassName = (className)=>{
        const modifiers = [];
        let bracketDepth = 0;
        let parenDepth = 0;
        let modifierStart = 0;
        let postfixModifierPosition;
        for(let index = 0; index < className.length; index++){
            let currentCharacter = className[index];
            if (bracketDepth === 0 && parenDepth === 0) {
                if (currentCharacter === MODIFIER_SEPARATOR) {
                    modifiers.push(className.slice(modifierStart, index));
                    modifierStart = index + MODIFIER_SEPARATOR_LENGTH;
                    continue;
                }
                if (currentCharacter === '/') {
                    postfixModifierPosition = index;
                    continue;
                }
            }
            if (currentCharacter === '[') {
                bracketDepth++;
            } else if (currentCharacter === ']') {
                bracketDepth--;
            } else if (currentCharacter === '(') {
                parenDepth++;
            } else if (currentCharacter === ')') {
                parenDepth--;
            }
        }
        const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
        const baseClassName = stripImportantModifier(baseClassNameWithImportantModifier);
        const hasImportantModifier = baseClassName !== baseClassNameWithImportantModifier;
        const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
        return {
            modifiers,
            hasImportantModifier,
            baseClassName,
            maybePostfixModifierPosition
        };
    };
    if (prefix) {
        const fullPrefix = prefix + MODIFIER_SEPARATOR;
        const parseClassNameOriginal = parseClassName;
        parseClassName = (className)=>className.startsWith(fullPrefix) ? parseClassNameOriginal(className.substring(fullPrefix.length)) : {
                isExternal: true,
                modifiers: [],
                hasImportantModifier: false,
                baseClassName: className,
                maybePostfixModifierPosition: undefined
            };
    }
    if (experimentalParseClassName) {
        const parseClassNameOriginal = parseClassName;
        parseClassName = (className)=>experimentalParseClassName({
                className,
                parseClassName: parseClassNameOriginal
            });
    }
    return parseClassName;
};
const stripImportantModifier = (baseClassName)=>{
    if (baseClassName.endsWith(IMPORTANT_MODIFIER)) {
        return baseClassName.substring(0, baseClassName.length - 1);
    }
    /**
   * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
   * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
   */ if (baseClassName.startsWith(IMPORTANT_MODIFIER)) {
        return baseClassName.substring(1);
    }
    return baseClassName;
};
/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */ const createSortModifiers = (config)=>{
    const orderSensitiveModifiers = Object.fromEntries(config.orderSensitiveModifiers.map((modifier)=>[
            modifier,
            true
        ]));
    const sortModifiers = (modifiers)=>{
        if (modifiers.length <= 1) {
            return modifiers;
        }
        const sortedModifiers = [];
        let unsortedModifiers = [];
        modifiers.forEach((modifier)=>{
            const isPositionSensitive = modifier[0] === '[' || orderSensitiveModifiers[modifier];
            if (isPositionSensitive) {
                sortedModifiers.push(...unsortedModifiers.sort(), modifier);
                unsortedModifiers = [];
            } else {
                unsortedModifiers.push(modifier);
            }
        });
        sortedModifiers.push(...unsortedModifiers.sort());
        return sortedModifiers;
    };
    return sortModifiers;
};
const createConfigUtils = (config)=>({
        cache: createLruCache(config.cacheSize),
        parseClassName: createParseClassName(config),
        sortModifiers: createSortModifiers(config),
        ...createClassGroupUtils(config)
    });
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils)=>{
    const { parseClassName, getClassGroupId, getConflictingClassGroupIds, sortModifiers } = configUtils;
    /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */ const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = '';
    for(let index = classNames.length - 1; index >= 0; index -= 1){
        const originalClassName = classNames[index];
        const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
        if (isExternal) {
            result = originalClassName + (result.length > 0 ? ' ' + result : result);
            continue;
        }
        let hasPostfixModifier = !!maybePostfixModifierPosition;
        let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
        if (!classGroupId) {
            if (!hasPostfixModifier) {
                // Not a Tailwind class
                result = originalClassName + (result.length > 0 ? ' ' + result : result);
                continue;
            }
            classGroupId = getClassGroupId(baseClassName);
            if (!classGroupId) {
                // Not a Tailwind class
                result = originalClassName + (result.length > 0 ? ' ' + result : result);
                continue;
            }
            hasPostfixModifier = false;
        }
        const variantModifier = sortModifiers(modifiers).join(':');
        const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
        const classId = modifierId + classGroupId;
        if (classGroupsInConflict.includes(classId)) {
            continue;
        }
        classGroupsInConflict.push(classId);
        const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
        for(let i = 0; i < conflictGroups.length; ++i){
            const group = conflictGroups[i];
            classGroupsInConflict.push(modifierId + group);
        }
        // Tailwind class not in conflict
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
    }
    return result;
};
/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */ function twJoin() {
    let index = 0;
    let argument;
    let resolvedValue;
    let string = '';
    while(index < arguments.length){
        if (argument = arguments[index++]) {
            if (resolvedValue = toValue(argument)) {
                string && (string += ' ');
                string += resolvedValue;
            }
        }
    }
    return string;
}
const toValue = (mix)=>{
    if (typeof mix === 'string') {
        return mix;
    }
    let resolvedValue;
    let string = '';
    for(let k = 0; k < mix.length; k++){
        if (mix[k]) {
            if (resolvedValue = toValue(mix[k])) {
                string && (string += ' ');
                string += resolvedValue;
            }
        }
    }
    return string;
};
function createTailwindMerge(createConfigFirst) {
    for(var _len = arguments.length, createConfigRest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        createConfigRest[_key - 1] = arguments[_key];
    }
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall = initTailwindMerge;
    function initTailwindMerge(classList) {
        const config = createConfigRest.reduce((previousConfig, createConfigCurrent)=>createConfigCurrent(previousConfig), createConfigFirst());
        configUtils = createConfigUtils(config);
        cacheGet = configUtils.cache.get;
        cacheSet = configUtils.cache.set;
        functionToCall = tailwindMerge;
        return tailwindMerge(classList);
    }
    function tailwindMerge(classList) {
        const cachedResult = cacheGet(classList);
        if (cachedResult) {
            return cachedResult;
        }
        const result = mergeClassList(classList, configUtils);
        cacheSet(classList, result);
        return result;
    }
    return function callTailwindMerge() {
        return functionToCall(twJoin.apply(null, arguments));
    };
}
const fromTheme = (key)=>{
    const themeGetter = (theme)=>theme[key] || [];
    themeGetter.isThemeGetter = true;
    return themeGetter;
};
const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
const fractionRegex = /^\d+\/\d+$/;
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
// Shadow always begins with x and y offset separated by underscore optionally prepended by inset
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isFraction = (value)=>fractionRegex.test(value);
const isNumber = (value)=>!!value && !Number.isNaN(Number(value));
const isInteger = (value)=>!!value && Number.isInteger(Number(value));
const isPercent = (value)=>value.endsWith('%') && isNumber(value.slice(0, -1));
const isTshirtSize = (value)=>tshirtUnitRegex.test(value);
const isAny = ()=>true;
const isLengthOnly = (value)=>// `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = ()=>false;
const isShadow = (value)=>shadowRegex.test(value);
const isImage = (value)=>imageRegex.test(value);
const isAnyNonArbitrary = (value)=>!isArbitraryValue(value) && !isArbitraryVariable(value);
const isArbitrarySize = (value)=>getIsArbitraryValue(value, isLabelSize, isNever);
const isArbitraryValue = (value)=>arbitraryValueRegex.test(value);
const isArbitraryLength = (value)=>getIsArbitraryValue(value, isLabelLength, isLengthOnly);
const isArbitraryNumber = (value)=>getIsArbitraryValue(value, isLabelNumber, isNumber);
const isArbitraryPosition = (value)=>getIsArbitraryValue(value, isLabelPosition, isNever);
const isArbitraryImage = (value)=>getIsArbitraryValue(value, isLabelImage, isImage);
const isArbitraryShadow = (value)=>getIsArbitraryValue(value, isLabelShadow, isShadow);
const isArbitraryVariable = (value)=>arbitraryVariableRegex.test(value);
const isArbitraryVariableLength = (value)=>getIsArbitraryVariable(value, isLabelLength);
const isArbitraryVariableFamilyName = (value)=>getIsArbitraryVariable(value, isLabelFamilyName);
const isArbitraryVariablePosition = (value)=>getIsArbitraryVariable(value, isLabelPosition);
const isArbitraryVariableSize = (value)=>getIsArbitraryVariable(value, isLabelSize);
const isArbitraryVariableImage = (value)=>getIsArbitraryVariable(value, isLabelImage);
const isArbitraryVariableShadow = (value)=>getIsArbitraryVariable(value, isLabelShadow, true);
// Helpers
const getIsArbitraryValue = (value, testLabel, testValue)=>{
    const result = arbitraryValueRegex.exec(value);
    if (result) {
        if (result[1]) {
            return testLabel(result[1]);
        }
        return testValue(result[2]);
    }
    return false;
};
const getIsArbitraryVariable = function(value, testLabel) {
    let shouldMatchNoLabel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    const result = arbitraryVariableRegex.exec(value);
    if (result) {
        if (result[1]) {
            return testLabel(result[1]);
        }
        return shouldMatchNoLabel;
    }
    return false;
};
// Labels
const isLabelPosition = (label)=>label === 'position' || label === 'percentage';
const isLabelImage = (label)=>label === 'image' || label === 'url';
const isLabelSize = (label)=>label === 'length' || label === 'size' || label === 'bg-size';
const isLabelLength = (label)=>label === 'length';
const isLabelNumber = (label)=>label === 'number';
const isLabelFamilyName = (label)=>label === 'family-name';
const isLabelShadow = (label)=>label === 'shadow';
const validators = /*#__PURE__*/ Object.defineProperty({
    __proto__: null,
    isAny,
    isAnyNonArbitrary,
    isArbitraryImage,
    isArbitraryLength,
    isArbitraryNumber,
    isArbitraryPosition,
    isArbitraryShadow,
    isArbitrarySize,
    isArbitraryValue,
    isArbitraryVariable,
    isArbitraryVariableFamilyName,
    isArbitraryVariableImage,
    isArbitraryVariableLength,
    isArbitraryVariablePosition,
    isArbitraryVariableShadow,
    isArbitraryVariableSize,
    isFraction,
    isInteger,
    isNumber,
    isPercent,
    isTshirtSize
}, Symbol.toStringTag, {
    value: 'Module'
});
const getDefaultConfig = ()=>{
    /**
   * Theme getters for theme variable namespaces
   * @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
   */ /***/ const themeColor = fromTheme('color');
    const themeFont = fromTheme('font');
    const themeText = fromTheme('text');
    const themeFontWeight = fromTheme('font-weight');
    const themeTracking = fromTheme('tracking');
    const themeLeading = fromTheme('leading');
    const themeBreakpoint = fromTheme('breakpoint');
    const themeContainer = fromTheme('container');
    const themeSpacing = fromTheme('spacing');
    const themeRadius = fromTheme('radius');
    const themeShadow = fromTheme('shadow');
    const themeInsetShadow = fromTheme('inset-shadow');
    const themeTextShadow = fromTheme('text-shadow');
    const themeDropShadow = fromTheme('drop-shadow');
    const themeBlur = fromTheme('blur');
    const themePerspective = fromTheme('perspective');
    const themeAspect = fromTheme('aspect');
    const themeEase = fromTheme('ease');
    const themeAnimate = fromTheme('animate');
    /**
   * Helpers to avoid repeating the same scales
   *
   * We use functions that create a new array every time they're called instead of static arrays.
   * This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
   */ /***/ const scaleBreak = ()=>[
            'auto',
            'avoid',
            'all',
            'avoid-page',
            'page',
            'left',
            'right',
            'column'
        ];
    const scalePosition = ()=>[
            'center',
            'top',
            'bottom',
            'left',
            'right',
            'top-left',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'left-top',
            'top-right',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'right-top',
            'bottom-right',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'right-bottom',
            'bottom-left',
            // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
            'left-bottom'
        ];
    const scalePositionWithArbitrary = ()=>[
            ...scalePosition(),
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleOverflow = ()=>[
            'auto',
            'hidden',
            'clip',
            'visible',
            'scroll'
        ];
    const scaleOverscroll = ()=>[
            'auto',
            'contain',
            'none'
        ];
    const scaleUnambiguousSpacing = ()=>[
            isArbitraryVariable,
            isArbitraryValue,
            themeSpacing
        ];
    const scaleInset = ()=>[
            isFraction,
            'full',
            'auto',
            ...scaleUnambiguousSpacing()
        ];
    const scaleGridTemplateColsRows = ()=>[
            isInteger,
            'none',
            'subgrid',
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleGridColRowStartAndEnd = ()=>[
            'auto',
            {
                span: [
                    'full',
                    isInteger,
                    isArbitraryVariable,
                    isArbitraryValue
                ]
            },
            isInteger,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleGridColRowStartOrEnd = ()=>[
            isInteger,
            'auto',
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleGridAutoColsRows = ()=>[
            'auto',
            'min',
            'max',
            'fr',
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleAlignPrimaryAxis = ()=>[
            'start',
            'end',
            'center',
            'between',
            'around',
            'evenly',
            'stretch',
            'baseline',
            'center-safe',
            'end-safe'
        ];
    const scaleAlignSecondaryAxis = ()=>[
            'start',
            'end',
            'center',
            'stretch',
            'center-safe',
            'end-safe'
        ];
    const scaleMargin = ()=>[
            'auto',
            ...scaleUnambiguousSpacing()
        ];
    const scaleSizing = ()=>[
            isFraction,
            'auto',
            'full',
            'dvw',
            'dvh',
            'lvw',
            'lvh',
            'svw',
            'svh',
            'min',
            'max',
            'fit',
            ...scaleUnambiguousSpacing()
        ];
    const scaleColor = ()=>[
            themeColor,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleBgPosition = ()=>[
            ...scalePosition(),
            isArbitraryVariablePosition,
            isArbitraryPosition,
            {
                position: [
                    isArbitraryVariable,
                    isArbitraryValue
                ]
            }
        ];
    const scaleBgRepeat = ()=>[
            'no-repeat',
            {
                repeat: [
                    '',
                    'x',
                    'y',
                    'space',
                    'round'
                ]
            }
        ];
    const scaleBgSize = ()=>[
            'auto',
            'cover',
            'contain',
            isArbitraryVariableSize,
            isArbitrarySize,
            {
                size: [
                    isArbitraryVariable,
                    isArbitraryValue
                ]
            }
        ];
    const scaleGradientStopPosition = ()=>[
            isPercent,
            isArbitraryVariableLength,
            isArbitraryLength
        ];
    const scaleRadius = ()=>[
            // Deprecated since Tailwind CSS v4.0.0
            '',
            'none',
            'full',
            themeRadius,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleBorderWidth = ()=>[
            '',
            isNumber,
            isArbitraryVariableLength,
            isArbitraryLength
        ];
    const scaleLineStyle = ()=>[
            'solid',
            'dashed',
            'dotted',
            'double'
        ];
    const scaleBlendMode = ()=>[
            'normal',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion',
            'hue',
            'saturation',
            'color',
            'luminosity'
        ];
    const scaleMaskImagePosition = ()=>[
            isNumber,
            isPercent,
            isArbitraryVariablePosition,
            isArbitraryPosition
        ];
    const scaleBlur = ()=>[
            // Deprecated since Tailwind CSS v4.0.0
            '',
            'none',
            themeBlur,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleRotate = ()=>[
            'none',
            isNumber,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleScale = ()=>[
            'none',
            isNumber,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleSkew = ()=>[
            isNumber,
            isArbitraryVariable,
            isArbitraryValue
        ];
    const scaleTranslate = ()=>[
            isFraction,
            'full',
            ...scaleUnambiguousSpacing()
        ];
    return {
        cacheSize: 500,
        theme: {
            animate: [
                'spin',
                'ping',
                'pulse',
                'bounce'
            ],
            aspect: [
                'video'
            ],
            blur: [
                isTshirtSize
            ],
            breakpoint: [
                isTshirtSize
            ],
            color: [
                isAny
            ],
            container: [
                isTshirtSize
            ],
            'drop-shadow': [
                isTshirtSize
            ],
            ease: [
                'in',
                'out',
                'in-out'
            ],
            font: [
                isAnyNonArbitrary
            ],
            'font-weight': [
                'thin',
                'extralight',
                'light',
                'normal',
                'medium',
                'semibold',
                'bold',
                'extrabold',
                'black'
            ],
            'inset-shadow': [
                isTshirtSize
            ],
            leading: [
                'none',
                'tight',
                'snug',
                'normal',
                'relaxed',
                'loose'
            ],
            perspective: [
                'dramatic',
                'near',
                'normal',
                'midrange',
                'distant',
                'none'
            ],
            radius: [
                isTshirtSize
            ],
            shadow: [
                isTshirtSize
            ],
            spacing: [
                'px',
                isNumber
            ],
            text: [
                isTshirtSize
            ],
            'text-shadow': [
                isTshirtSize
            ],
            tracking: [
                'tighter',
                'tight',
                'normal',
                'wide',
                'wider',
                'widest'
            ]
        },
        classGroups: {
            // --------------
            // --- Layout ---
            // --------------
            /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */ aspect: [
                {
                    aspect: [
                        'auto',
                        'square',
                        isFraction,
                        isArbitraryValue,
                        isArbitraryVariable,
                        themeAspect
                    ]
                }
            ],
            /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */ container: [
                'container'
            ],
            /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */ columns: [
                {
                    columns: [
                        isNumber,
                        isArbitraryValue,
                        isArbitraryVariable,
                        themeContainer
                    ]
                }
            ],
            /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */ 'break-after': [
                {
                    'break-after': scaleBreak()
                }
            ],
            /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */ 'break-before': [
                {
                    'break-before': scaleBreak()
                }
            ],
            /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */ 'break-inside': [
                {
                    'break-inside': [
                        'auto',
                        'avoid',
                        'avoid-page',
                        'avoid-column'
                    ]
                }
            ],
            /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */ 'box-decoration': [
                {
                    'box-decoration': [
                        'slice',
                        'clone'
                    ]
                }
            ],
            /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */ box: [
                {
                    box: [
                        'border',
                        'content'
                    ]
                }
            ],
            /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */ display: [
                'block',
                'inline-block',
                'inline',
                'flex',
                'inline-flex',
                'table',
                'inline-table',
                'table-caption',
                'table-cell',
                'table-column',
                'table-column-group',
                'table-footer-group',
                'table-header-group',
                'table-row-group',
                'table-row',
                'flow-root',
                'grid',
                'inline-grid',
                'contents',
                'list-item',
                'hidden'
            ],
            /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */ sr: [
                'sr-only',
                'not-sr-only'
            ],
            /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */ float: [
                {
                    float: [
                        'right',
                        'left',
                        'none',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */ clear: [
                {
                    clear: [
                        'left',
                        'right',
                        'both',
                        'none',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */ isolation: [
                'isolate',
                'isolation-auto'
            ],
            /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */ 'object-fit': [
                {
                    object: [
                        'contain',
                        'cover',
                        'fill',
                        'none',
                        'scale-down'
                    ]
                }
            ],
            /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */ 'object-position': [
                {
                    object: scalePositionWithArbitrary()
                }
            ],
            /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */ overflow: [
                {
                    overflow: scaleOverflow()
                }
            ],
            /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */ 'overflow-x': [
                {
                    'overflow-x': scaleOverflow()
                }
            ],
            /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */ 'overflow-y': [
                {
                    'overflow-y': scaleOverflow()
                }
            ],
            /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ overscroll: [
                {
                    overscroll: scaleOverscroll()
                }
            ],
            /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ 'overscroll-x': [
                {
                    'overscroll-x': scaleOverscroll()
                }
            ],
            /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */ 'overscroll-y': [
                {
                    'overscroll-y': scaleOverscroll()
                }
            ],
            /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */ position: [
                'static',
                'fixed',
                'absolute',
                'relative',
                'sticky'
            ],
            /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ inset: [
                {
                    inset: scaleInset()
                }
            ],
            /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ 'inset-x': [
                {
                    'inset-x': scaleInset()
                }
            ],
            /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ 'inset-y': [
                {
                    'inset-y': scaleInset()
                }
            ],
            /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ start: [
                {
                    start: scaleInset()
                }
            ],
            /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ end: [
                {
                    end: scaleInset()
                }
            ],
            /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ top: [
                {
                    top: scaleInset()
                }
            ],
            /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ right: [
                {
                    right: scaleInset()
                }
            ],
            /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ bottom: [
                {
                    bottom: scaleInset()
                }
            ],
            /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */ left: [
                {
                    left: scaleInset()
                }
            ],
            /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */ visibility: [
                'visible',
                'invisible',
                'collapse'
            ],
            /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */ z: [
                {
                    z: [
                        isInteger,
                        'auto',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // ------------------------
            // --- Flexbox and Grid ---
            // ------------------------
            /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */ basis: [
                {
                    basis: [
                        isFraction,
                        'full',
                        'auto',
                        themeContainer,
                        ...scaleUnambiguousSpacing()
                    ]
                }
            ],
            /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */ 'flex-direction': [
                {
                    flex: [
                        'row',
                        'row-reverse',
                        'col',
                        'col-reverse'
                    ]
                }
            ],
            /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */ 'flex-wrap': [
                {
                    flex: [
                        'nowrap',
                        'wrap',
                        'wrap-reverse'
                    ]
                }
            ],
            /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */ flex: [
                {
                    flex: [
                        isNumber,
                        isFraction,
                        'auto',
                        'initial',
                        'none',
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */ grow: [
                {
                    grow: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */ shrink: [
                {
                    shrink: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */ order: [
                {
                    order: [
                        isInteger,
                        'first',
                        'last',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */ 'grid-cols': [
                {
                    'grid-cols': scaleGridTemplateColsRows()
                }
            ],
            /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-start-end': [
                {
                    col: scaleGridColRowStartAndEnd()
                }
            ],
            /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-start': [
                {
                    'col-start': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */ 'col-end': [
                {
                    'col-end': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */ 'grid-rows': [
                {
                    'grid-rows': scaleGridTemplateColsRows()
                }
            ],
            /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-start-end': [
                {
                    row: scaleGridColRowStartAndEnd()
                }
            ],
            /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-start': [
                {
                    'row-start': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */ 'row-end': [
                {
                    'row-end': scaleGridColRowStartOrEnd()
                }
            ],
            /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */ 'grid-flow': [
                {
                    'grid-flow': [
                        'row',
                        'col',
                        'dense',
                        'row-dense',
                        'col-dense'
                    ]
                }
            ],
            /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */ 'auto-cols': [
                {
                    'auto-cols': scaleGridAutoColsRows()
                }
            ],
            /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */ 'auto-rows': [
                {
                    'auto-rows': scaleGridAutoColsRows()
                }
            ],
            /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */ gap: [
                {
                    gap: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */ 'gap-x': [
                {
                    'gap-x': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */ 'gap-y': [
                {
                    'gap-y': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */ 'justify-content': [
                {
                    justify: [
                        ...scaleAlignPrimaryAxis(),
                        'normal'
                    ]
                }
            ],
            /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */ 'justify-items': [
                {
                    'justify-items': [
                        ...scaleAlignSecondaryAxis(),
                        'normal'
                    ]
                }
            ],
            /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */ 'justify-self': [
                {
                    'justify-self': [
                        'auto',
                        ...scaleAlignSecondaryAxis()
                    ]
                }
            ],
            /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */ 'align-content': [
                {
                    content: [
                        'normal',
                        ...scaleAlignPrimaryAxis()
                    ]
                }
            ],
            /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */ 'align-items': [
                {
                    items: [
                        ...scaleAlignSecondaryAxis(),
                        {
                            baseline: [
                                '',
                                'last'
                            ]
                        }
                    ]
                }
            ],
            /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */ 'align-self': [
                {
                    self: [
                        'auto',
                        ...scaleAlignSecondaryAxis(),
                        {
                            baseline: [
                                '',
                                'last'
                            ]
                        }
                    ]
                }
            ],
            /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */ 'place-content': [
                {
                    'place-content': scaleAlignPrimaryAxis()
                }
            ],
            /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */ 'place-items': [
                {
                    'place-items': [
                        ...scaleAlignSecondaryAxis(),
                        'baseline'
                    ]
                }
            ],
            /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */ 'place-self': [
                {
                    'place-self': [
                        'auto',
                        ...scaleAlignSecondaryAxis()
                    ]
                }
            ],
            // Spacing
            /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */ p: [
                {
                    p: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */ px: [
                {
                    px: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */ py: [
                {
                    py: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */ ps: [
                {
                    ps: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */ pe: [
                {
                    pe: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */ pt: [
                {
                    pt: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */ pr: [
                {
                    pr: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */ pb: [
                {
                    pb: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */ pl: [
                {
                    pl: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */ m: [
                {
                    m: scaleMargin()
                }
            ],
            /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */ mx: [
                {
                    mx: scaleMargin()
                }
            ],
            /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */ my: [
                {
                    my: scaleMargin()
                }
            ],
            /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */ ms: [
                {
                    ms: scaleMargin()
                }
            ],
            /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */ me: [
                {
                    me: scaleMargin()
                }
            ],
            /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */ mt: [
                {
                    mt: scaleMargin()
                }
            ],
            /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */ mr: [
                {
                    mr: scaleMargin()
                }
            ],
            /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */ mb: [
                {
                    mb: scaleMargin()
                }
            ],
            /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */ ml: [
                {
                    ml: scaleMargin()
                }
            ],
            /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-x': [
                {
                    'space-x': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-x-reverse': [
                'space-x-reverse'
            ],
            /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-y': [
                {
                    'space-y': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */ 'space-y-reverse': [
                'space-y-reverse'
            ],
            // --------------
            // --- Sizing ---
            // --------------
            /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */ size: [
                {
                    size: scaleSizing()
                }
            ],
            /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */ w: [
                {
                    w: [
                        themeContainer,
                        'screen',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */ 'min-w': [
                {
                    'min-w': [
                        themeContainer,
                        'screen',
                        /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ 'none',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */ 'max-w': [
                {
                    'max-w': [
                        themeContainer,
                        'screen',
                        'none',
                        /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ 'prose',
                        /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ {
                            screen: [
                                themeBreakpoint
                            ]
                        },
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */ h: [
                {
                    h: [
                        'screen',
                        'lh',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */ 'min-h': [
                {
                    'min-h': [
                        'screen',
                        'lh',
                        'none',
                        ...scaleSizing()
                    ]
                }
            ],
            /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */ 'max-h': [
                {
                    'max-h': [
                        'screen',
                        'lh',
                        ...scaleSizing()
                    ]
                }
            ],
            // ------------------
            // --- Typography ---
            // ------------------
            /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */ 'font-size': [
                {
                    text: [
                        'base',
                        themeText,
                        isArbitraryVariableLength,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */ 'font-smoothing': [
                'antialiased',
                'subpixel-antialiased'
            ],
            /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */ 'font-style': [
                'italic',
                'not-italic'
            ],
            /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */ 'font-weight': [
                {
                    font: [
                        themeFontWeight,
                        isArbitraryVariable,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */ 'font-stretch': [
                {
                    'font-stretch': [
                        'ultra-condensed',
                        'extra-condensed',
                        'condensed',
                        'semi-condensed',
                        'normal',
                        'semi-expanded',
                        'expanded',
                        'extra-expanded',
                        'ultra-expanded',
                        isPercent,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */ 'font-family': [
                {
                    font: [
                        isArbitraryVariableFamilyName,
                        isArbitraryValue,
                        themeFont
                    ]
                }
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-normal': [
                'normal-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-ordinal': [
                'ordinal'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-slashed-zero': [
                'slashed-zero'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-figure': [
                'lining-nums',
                'oldstyle-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-spacing': [
                'proportional-nums',
                'tabular-nums'
            ],
            /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */ 'fvn-fraction': [
                'diagonal-fractions',
                'stacked-fractions'
            ],
            /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */ tracking: [
                {
                    tracking: [
                        themeTracking,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */ 'line-clamp': [
                {
                    'line-clamp': [
                        isNumber,
                        'none',
                        isArbitraryVariable,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */ leading: [
                {
                    leading: [
                        /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */ themeLeading,
                        ...scaleUnambiguousSpacing()
                    ]
                }
            ],
            /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */ 'list-image': [
                {
                    'list-image': [
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */ 'list-style-position': [
                {
                    list: [
                        'inside',
                        'outside'
                    ]
                }
            ],
            /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */ 'list-style-type': [
                {
                    list: [
                        'disc',
                        'decimal',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */ 'text-alignment': [
                {
                    text: [
                        'left',
                        'center',
                        'right',
                        'justify',
                        'start',
                        'end'
                    ]
                }
            ],
            /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */ 'placeholder-color': [
                {
                    placeholder: scaleColor()
                }
            ],
            /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */ 'text-color': [
                {
                    text: scaleColor()
                }
            ],
            /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */ 'text-decoration': [
                'underline',
                'overline',
                'line-through',
                'no-underline'
            ],
            /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */ 'text-decoration-style': [
                {
                    decoration: [
                        ...scaleLineStyle(),
                        'wavy'
                    ]
                }
            ],
            /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */ 'text-decoration-thickness': [
                {
                    decoration: [
                        isNumber,
                        'from-font',
                        'auto',
                        isArbitraryVariable,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */ 'text-decoration-color': [
                {
                    decoration: scaleColor()
                }
            ],
            /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */ 'underline-offset': [
                {
                    'underline-offset': [
                        isNumber,
                        'auto',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */ 'text-transform': [
                'uppercase',
                'lowercase',
                'capitalize',
                'normal-case'
            ],
            /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */ 'text-overflow': [
                'truncate',
                'text-ellipsis',
                'text-clip'
            ],
            /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */ 'text-wrap': [
                {
                    text: [
                        'wrap',
                        'nowrap',
                        'balance',
                        'pretty'
                    ]
                }
            ],
            /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */ indent: [
                {
                    indent: scaleUnambiguousSpacing()
                }
            ],
            /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */ 'vertical-align': [
                {
                    align: [
                        'baseline',
                        'top',
                        'middle',
                        'bottom',
                        'text-top',
                        'text-bottom',
                        'sub',
                        'super',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */ whitespace: [
                {
                    whitespace: [
                        'normal',
                        'nowrap',
                        'pre',
                        'pre-line',
                        'pre-wrap',
                        'break-spaces'
                    ]
                }
            ],
            /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */ break: [
                {
                    break: [
                        'normal',
                        'words',
                        'all',
                        'keep'
                    ]
                }
            ],
            /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */ wrap: [
                {
                    wrap: [
                        'break-word',
                        'anywhere',
                        'normal'
                    ]
                }
            ],
            /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */ hyphens: [
                {
                    hyphens: [
                        'none',
                        'manual',
                        'auto'
                    ]
                }
            ],
            /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */ content: [
                {
                    content: [
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // -------------------
            // --- Backgrounds ---
            // -------------------
            /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */ 'bg-attachment': [
                {
                    bg: [
                        'fixed',
                        'local',
                        'scroll'
                    ]
                }
            ],
            /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */ 'bg-clip': [
                {
                    'bg-clip': [
                        'border',
                        'padding',
                        'content',
                        'text'
                    ]
                }
            ],
            /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */ 'bg-origin': [
                {
                    'bg-origin': [
                        'border',
                        'padding',
                        'content'
                    ]
                }
            ],
            /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */ 'bg-position': [
                {
                    bg: scaleBgPosition()
                }
            ],
            /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */ 'bg-repeat': [
                {
                    bg: scaleBgRepeat()
                }
            ],
            /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */ 'bg-size': [
                {
                    bg: scaleBgSize()
                }
            ],
            /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */ 'bg-image': [
                {
                    bg: [
                        'none',
                        {
                            linear: [
                                {
                                    to: [
                                        't',
                                        'tr',
                                        'r',
                                        'br',
                                        'b',
                                        'bl',
                                        'l',
                                        'tl'
                                    ]
                                },
                                isInteger,
                                isArbitraryVariable,
                                isArbitraryValue
                            ],
                            radial: [
                                '',
                                isArbitraryVariable,
                                isArbitraryValue
                            ],
                            conic: [
                                isInteger,
                                isArbitraryVariable,
                                isArbitraryValue
                            ]
                        },
                        isArbitraryVariableImage,
                        isArbitraryImage
                    ]
                }
            ],
            /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */ 'bg-color': [
                {
                    bg: scaleColor()
                }
            ],
            /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-from-pos': [
                {
                    from: scaleGradientStopPosition()
                }
            ],
            /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-via-pos': [
                {
                    via: scaleGradientStopPosition()
                }
            ],
            /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-to-pos': [
                {
                    to: scaleGradientStopPosition()
                }
            ],
            /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-from': [
                {
                    from: scaleColor()
                }
            ],
            /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-via': [
                {
                    via: scaleColor()
                }
            ],
            /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */ 'gradient-to': [
                {
                    to: scaleColor()
                }
            ],
            // ---------------
            // --- Borders ---
            // ---------------
            /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */ rounded: [
                {
                    rounded: scaleRadius()
                }
            ],
            /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-s': [
                {
                    'rounded-s': scaleRadius()
                }
            ],
            /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-e': [
                {
                    'rounded-e': scaleRadius()
                }
            ],
            /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-t': [
                {
                    'rounded-t': scaleRadius()
                }
            ],
            /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-r': [
                {
                    'rounded-r': scaleRadius()
                }
            ],
            /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-b': [
                {
                    'rounded-b': scaleRadius()
                }
            ],
            /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-l': [
                {
                    'rounded-l': scaleRadius()
                }
            ],
            /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-ss': [
                {
                    'rounded-ss': scaleRadius()
                }
            ],
            /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-se': [
                {
                    'rounded-se': scaleRadius()
                }
            ],
            /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-ee': [
                {
                    'rounded-ee': scaleRadius()
                }
            ],
            /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-es': [
                {
                    'rounded-es': scaleRadius()
                }
            ],
            /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-tl': [
                {
                    'rounded-tl': scaleRadius()
                }
            ],
            /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-tr': [
                {
                    'rounded-tr': scaleRadius()
                }
            ],
            /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-br': [
                {
                    'rounded-br': scaleRadius()
                }
            ],
            /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */ 'rounded-bl': [
                {
                    'rounded-bl': scaleRadius()
                }
            ],
            /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w': [
                {
                    border: scaleBorderWidth()
                }
            ],
            /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-x': [
                {
                    'border-x': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-y': [
                {
                    'border-y': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-s': [
                {
                    'border-s': scaleBorderWidth()
                }
            ],
            /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-e': [
                {
                    'border-e': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-t': [
                {
                    'border-t': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-r': [
                {
                    'border-r': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-b': [
                {
                    'border-b': scaleBorderWidth()
                }
            ],
            /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */ 'border-w-l': [
                {
                    'border-l': scaleBorderWidth()
                }
            ],
            /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-x': [
                {
                    'divide-x': scaleBorderWidth()
                }
            ],
            /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-x-reverse': [
                'divide-x-reverse'
            ],
            /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-y': [
                {
                    'divide-y': scaleBorderWidth()
                }
            ],
            /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */ 'divide-y-reverse': [
                'divide-y-reverse'
            ],
            /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */ 'border-style': [
                {
                    border: [
                        ...scaleLineStyle(),
                        'hidden',
                        'none'
                    ]
                }
            ],
            /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */ 'divide-style': [
                {
                    divide: [
                        ...scaleLineStyle(),
                        'hidden',
                        'none'
                    ]
                }
            ],
            /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color': [
                {
                    border: scaleColor()
                }
            ],
            /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-x': [
                {
                    'border-x': scaleColor()
                }
            ],
            /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-y': [
                {
                    'border-y': scaleColor()
                }
            ],
            /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-s': [
                {
                    'border-s': scaleColor()
                }
            ],
            /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-e': [
                {
                    'border-e': scaleColor()
                }
            ],
            /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-t': [
                {
                    'border-t': scaleColor()
                }
            ],
            /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-r': [
                {
                    'border-r': scaleColor()
                }
            ],
            /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-b': [
                {
                    'border-b': scaleColor()
                }
            ],
            /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */ 'border-color-l': [
                {
                    'border-l': scaleColor()
                }
            ],
            /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */ 'divide-color': [
                {
                    divide: scaleColor()
                }
            ],
            /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */ 'outline-style': [
                {
                    outline: [
                        ...scaleLineStyle(),
                        'none',
                        'hidden'
                    ]
                }
            ],
            /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */ 'outline-offset': [
                {
                    'outline-offset': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */ 'outline-w': [
                {
                    outline: [
                        '',
                        isNumber,
                        isArbitraryVariableLength,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */ 'outline-color': [
                {
                    outline: scaleColor()
                }
            ],
            // ---------------
            // --- Effects ---
            // ---------------
            /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */ shadow: [
                {
                    shadow: [
                        // Deprecated since Tailwind CSS v4.0.0
                        '',
                        'none',
                        themeShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */ 'shadow-color': [
                {
                    shadow: scaleColor()
                }
            ],
            /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */ 'inset-shadow': [
                {
                    'inset-shadow': [
                        'none',
                        themeInsetShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */ 'inset-shadow-color': [
                {
                    'inset-shadow': scaleColor()
                }
            ],
            /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */ 'ring-w': [
                {
                    ring: scaleBorderWidth()
                }
            ],
            /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */ 'ring-w-inset': [
                'ring-inset'
            ],
            /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */ 'ring-color': [
                {
                    ring: scaleColor()
                }
            ],
            /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */ 'ring-offset-w': [
                {
                    'ring-offset': [
                        isNumber,
                        isArbitraryLength
                    ]
                }
            ],
            /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */ 'ring-offset-color': [
                {
                    'ring-offset': scaleColor()
                }
            ],
            /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */ 'inset-ring-w': [
                {
                    'inset-ring': scaleBorderWidth()
                }
            ],
            /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */ 'inset-ring-color': [
                {
                    'inset-ring': scaleColor()
                }
            ],
            /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */ 'text-shadow': [
                {
                    'text-shadow': [
                        'none',
                        themeTextShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */ 'text-shadow-color': [
                {
                    'text-shadow': scaleColor()
                }
            ],
            /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */ opacity: [
                {
                    opacity: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */ 'mix-blend': [
                {
                    'mix-blend': [
                        ...scaleBlendMode(),
                        'plus-darker',
                        'plus-lighter'
                    ]
                }
            ],
            /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */ 'bg-blend': [
                {
                    'bg-blend': scaleBlendMode()
                }
            ],
            /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */ 'mask-clip': [
                {
                    'mask-clip': [
                        'border',
                        'padding',
                        'content',
                        'fill',
                        'stroke',
                        'view'
                    ]
                },
                'mask-no-clip'
            ],
            /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */ 'mask-composite': [
                {
                    mask: [
                        'add',
                        'subtract',
                        'intersect',
                        'exclude'
                    ]
                }
            ],
            /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */ 'mask-image-linear-pos': [
                {
                    'mask-linear': [
                        isNumber
                    ]
                }
            ],
            'mask-image-linear-from-pos': [
                {
                    'mask-linear-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-linear-to-pos': [
                {
                    'mask-linear-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-linear-from-color': [
                {
                    'mask-linear-from': scaleColor()
                }
            ],
            'mask-image-linear-to-color': [
                {
                    'mask-linear-to': scaleColor()
                }
            ],
            'mask-image-t-from-pos': [
                {
                    'mask-t-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-t-to-pos': [
                {
                    'mask-t-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-t-from-color': [
                {
                    'mask-t-from': scaleColor()
                }
            ],
            'mask-image-t-to-color': [
                {
                    'mask-t-to': scaleColor()
                }
            ],
            'mask-image-r-from-pos': [
                {
                    'mask-r-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-r-to-pos': [
                {
                    'mask-r-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-r-from-color': [
                {
                    'mask-r-from': scaleColor()
                }
            ],
            'mask-image-r-to-color': [
                {
                    'mask-r-to': scaleColor()
                }
            ],
            'mask-image-b-from-pos': [
                {
                    'mask-b-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-b-to-pos': [
                {
                    'mask-b-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-b-from-color': [
                {
                    'mask-b-from': scaleColor()
                }
            ],
            'mask-image-b-to-color': [
                {
                    'mask-b-to': scaleColor()
                }
            ],
            'mask-image-l-from-pos': [
                {
                    'mask-l-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-l-to-pos': [
                {
                    'mask-l-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-l-from-color': [
                {
                    'mask-l-from': scaleColor()
                }
            ],
            'mask-image-l-to-color': [
                {
                    'mask-l-to': scaleColor()
                }
            ],
            'mask-image-x-from-pos': [
                {
                    'mask-x-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-x-to-pos': [
                {
                    'mask-x-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-x-from-color': [
                {
                    'mask-x-from': scaleColor()
                }
            ],
            'mask-image-x-to-color': [
                {
                    'mask-x-to': scaleColor()
                }
            ],
            'mask-image-y-from-pos': [
                {
                    'mask-y-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-y-to-pos': [
                {
                    'mask-y-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-y-from-color': [
                {
                    'mask-y-from': scaleColor()
                }
            ],
            'mask-image-y-to-color': [
                {
                    'mask-y-to': scaleColor()
                }
            ],
            'mask-image-radial': [
                {
                    'mask-radial': [
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            'mask-image-radial-from-pos': [
                {
                    'mask-radial-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-radial-to-pos': [
                {
                    'mask-radial-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-radial-from-color': [
                {
                    'mask-radial-from': scaleColor()
                }
            ],
            'mask-image-radial-to-color': [
                {
                    'mask-radial-to': scaleColor()
                }
            ],
            'mask-image-radial-shape': [
                {
                    'mask-radial': [
                        'circle',
                        'ellipse'
                    ]
                }
            ],
            'mask-image-radial-size': [
                {
                    'mask-radial': [
                        {
                            closest: [
                                'side',
                                'corner'
                            ],
                            farthest: [
                                'side',
                                'corner'
                            ]
                        }
                    ]
                }
            ],
            'mask-image-radial-pos': [
                {
                    'mask-radial-at': scalePosition()
                }
            ],
            'mask-image-conic-pos': [
                {
                    'mask-conic': [
                        isNumber
                    ]
                }
            ],
            'mask-image-conic-from-pos': [
                {
                    'mask-conic-from': scaleMaskImagePosition()
                }
            ],
            'mask-image-conic-to-pos': [
                {
                    'mask-conic-to': scaleMaskImagePosition()
                }
            ],
            'mask-image-conic-from-color': [
                {
                    'mask-conic-from': scaleColor()
                }
            ],
            'mask-image-conic-to-color': [
                {
                    'mask-conic-to': scaleColor()
                }
            ],
            /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */ 'mask-mode': [
                {
                    mask: [
                        'alpha',
                        'luminance',
                        'match'
                    ]
                }
            ],
            /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */ 'mask-origin': [
                {
                    'mask-origin': [
                        'border',
                        'padding',
                        'content',
                        'fill',
                        'stroke',
                        'view'
                    ]
                }
            ],
            /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */ 'mask-position': [
                {
                    mask: scaleBgPosition()
                }
            ],
            /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */ 'mask-repeat': [
                {
                    mask: scaleBgRepeat()
                }
            ],
            /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */ 'mask-size': [
                {
                    mask: scaleBgSize()
                }
            ],
            /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */ 'mask-type': [
                {
                    'mask-type': [
                        'alpha',
                        'luminance'
                    ]
                }
            ],
            /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */ 'mask-image': [
                {
                    mask: [
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // ---------------
            // --- Filters ---
            // ---------------
            /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */ filter: [
                {
                    filter: [
                        // Deprecated since Tailwind CSS v3.0.0
                        '',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */ blur: [
                {
                    blur: scaleBlur()
                }
            ],
            /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */ brightness: [
                {
                    brightness: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */ contrast: [
                {
                    contrast: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */ 'drop-shadow': [
                {
                    'drop-shadow': [
                        // Deprecated since Tailwind CSS v4.0.0
                        '',
                        'none',
                        themeDropShadow,
                        isArbitraryVariableShadow,
                        isArbitraryShadow
                    ]
                }
            ],
            /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */ 'drop-shadow-color': [
                {
                    'drop-shadow': scaleColor()
                }
            ],
            /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */ grayscale: [
                {
                    grayscale: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */ 'hue-rotate': [
                {
                    'hue-rotate': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */ invert: [
                {
                    invert: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */ saturate: [
                {
                    saturate: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */ sepia: [
                {
                    sepia: [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */ 'backdrop-filter': [
                {
                    'backdrop-filter': [
                        // Deprecated since Tailwind CSS v3.0.0
                        '',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */ 'backdrop-blur': [
                {
                    'backdrop-blur': scaleBlur()
                }
            ],
            /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */ 'backdrop-brightness': [
                {
                    'backdrop-brightness': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */ 'backdrop-contrast': [
                {
                    'backdrop-contrast': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */ 'backdrop-grayscale': [
                {
                    'backdrop-grayscale': [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */ 'backdrop-hue-rotate': [
                {
                    'backdrop-hue-rotate': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */ 'backdrop-invert': [
                {
                    'backdrop-invert': [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */ 'backdrop-opacity': [
                {
                    'backdrop-opacity': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */ 'backdrop-saturate': [
                {
                    'backdrop-saturate': [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */ 'backdrop-sepia': [
                {
                    'backdrop-sepia': [
                        '',
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // --------------
            // --- Tables ---
            // --------------
            /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */ 'border-collapse': [
                {
                    border: [
                        'collapse',
                        'separate'
                    ]
                }
            ],
            /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing': [
                {
                    'border-spacing': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing-x': [
                {
                    'border-spacing-x': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */ 'border-spacing-y': [
                {
                    'border-spacing-y': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */ 'table-layout': [
                {
                    table: [
                        'auto',
                        'fixed'
                    ]
                }
            ],
            /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */ caption: [
                {
                    caption: [
                        'top',
                        'bottom'
                    ]
                }
            ],
            // ---------------------------------
            // --- Transitions and Animation ---
            // ---------------------------------
            /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */ transition: [
                {
                    transition: [
                        '',
                        'all',
                        'colors',
                        'opacity',
                        'shadow',
                        'transform',
                        'none',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */ 'transition-behavior': [
                {
                    transition: [
                        'normal',
                        'discrete'
                    ]
                }
            ],
            /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */ duration: [
                {
                    duration: [
                        isNumber,
                        'initial',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */ ease: [
                {
                    ease: [
                        'linear',
                        'initial',
                        themeEase,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */ delay: [
                {
                    delay: [
                        isNumber,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */ animate: [
                {
                    animate: [
                        'none',
                        themeAnimate,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // ------------------
            // --- Transforms ---
            // ------------------
            /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */ backface: [
                {
                    backface: [
                        'hidden',
                        'visible'
                    ]
                }
            ],
            /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */ perspective: [
                {
                    perspective: [
                        themePerspective,
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */ 'perspective-origin': [
                {
                    'perspective-origin': scalePositionWithArbitrary()
                }
            ],
            /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */ rotate: [
                {
                    rotate: scaleRotate()
                }
            ],
            /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */ 'rotate-x': [
                {
                    'rotate-x': scaleRotate()
                }
            ],
            /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */ 'rotate-y': [
                {
                    'rotate-y': scaleRotate()
                }
            ],
            /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */ 'rotate-z': [
                {
                    'rotate-z': scaleRotate()
                }
            ],
            /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */ scale: [
                {
                    scale: scaleScale()
                }
            ],
            /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-x': [
                {
                    'scale-x': scaleScale()
                }
            ],
            /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-y': [
                {
                    'scale-y': scaleScale()
                }
            ],
            /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-z': [
                {
                    'scale-z': scaleScale()
                }
            ],
            /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */ 'scale-3d': [
                'scale-3d'
            ],
            /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */ skew: [
                {
                    skew: scaleSkew()
                }
            ],
            /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */ 'skew-x': [
                {
                    'skew-x': scaleSkew()
                }
            ],
            /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */ 'skew-y': [
                {
                    'skew-y': scaleSkew()
                }
            ],
            /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */ transform: [
                {
                    transform: [
                        isArbitraryVariable,
                        isArbitraryValue,
                        '',
                        'none',
                        'gpu',
                        'cpu'
                    ]
                }
            ],
            /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */ 'transform-origin': [
                {
                    origin: scalePositionWithArbitrary()
                }
            ],
            /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */ 'transform-style': [
                {
                    transform: [
                        '3d',
                        'flat'
                    ]
                }
            ],
            /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */ translate: [
                {
                    translate: scaleTranslate()
                }
            ],
            /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-x': [
                {
                    'translate-x': scaleTranslate()
                }
            ],
            /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-y': [
                {
                    'translate-y': scaleTranslate()
                }
            ],
            /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-z': [
                {
                    'translate-z': scaleTranslate()
                }
            ],
            /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */ 'translate-none': [
                'translate-none'
            ],
            // ---------------------
            // --- Interactivity ---
            // ---------------------
            /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */ accent: [
                {
                    accent: scaleColor()
                }
            ],
            /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */ appearance: [
                {
                    appearance: [
                        'none',
                        'auto'
                    ]
                }
            ],
            /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */ 'caret-color': [
                {
                    caret: scaleColor()
                }
            ],
            /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */ 'color-scheme': [
                {
                    scheme: [
                        'normal',
                        'dark',
                        'light',
                        'light-dark',
                        'only-dark',
                        'only-light'
                    ]
                }
            ],
            /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */ cursor: [
                {
                    cursor: [
                        'auto',
                        'default',
                        'pointer',
                        'wait',
                        'text',
                        'move',
                        'help',
                        'not-allowed',
                        'none',
                        'context-menu',
                        'progress',
                        'cell',
                        'crosshair',
                        'vertical-text',
                        'alias',
                        'copy',
                        'no-drop',
                        'grab',
                        'grabbing',
                        'all-scroll',
                        'col-resize',
                        'row-resize',
                        'n-resize',
                        'e-resize',
                        's-resize',
                        'w-resize',
                        'ne-resize',
                        'nw-resize',
                        'se-resize',
                        'sw-resize',
                        'ew-resize',
                        'ns-resize',
                        'nesw-resize',
                        'nwse-resize',
                        'zoom-in',
                        'zoom-out',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */ 'field-sizing': [
                {
                    'field-sizing': [
                        'fixed',
                        'content'
                    ]
                }
            ],
            /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */ 'pointer-events': [
                {
                    'pointer-events': [
                        'auto',
                        'none'
                    ]
                }
            ],
            /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */ resize: [
                {
                    resize: [
                        'none',
                        '',
                        'y',
                        'x'
                    ]
                }
            ],
            /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */ 'scroll-behavior': [
                {
                    scroll: [
                        'auto',
                        'smooth'
                    ]
                }
            ],
            /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-m': [
                {
                    'scroll-m': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mx': [
                {
                    'scroll-mx': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-my': [
                {
                    'scroll-my': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-ms': [
                {
                    'scroll-ms': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-me': [
                {
                    'scroll-me': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mt': [
                {
                    'scroll-mt': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mr': [
                {
                    'scroll-mr': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-mb': [
                {
                    'scroll-mb': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */ 'scroll-ml': [
                {
                    'scroll-ml': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-p': [
                {
                    'scroll-p': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-px': [
                {
                    'scroll-px': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-py': [
                {
                    'scroll-py': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-ps': [
                {
                    'scroll-ps': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pe': [
                {
                    'scroll-pe': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pt': [
                {
                    'scroll-pt': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pr': [
                {
                    'scroll-pr': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pb': [
                {
                    'scroll-pb': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */ 'scroll-pl': [
                {
                    'scroll-pl': scaleUnambiguousSpacing()
                }
            ],
            /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */ 'snap-align': [
                {
                    snap: [
                        'start',
                        'end',
                        'center',
                        'align-none'
                    ]
                }
            ],
            /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */ 'snap-stop': [
                {
                    snap: [
                        'normal',
                        'always'
                    ]
                }
            ],
            /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */ 'snap-type': [
                {
                    snap: [
                        'none',
                        'x',
                        'y',
                        'both'
                    ]
                }
            ],
            /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */ 'snap-strictness': [
                {
                    snap: [
                        'mandatory',
                        'proximity'
                    ]
                }
            ],
            /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */ touch: [
                {
                    touch: [
                        'auto',
                        'none',
                        'manipulation'
                    ]
                }
            ],
            /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-x': [
                {
                    'touch-pan': [
                        'x',
                        'left',
                        'right'
                    ]
                }
            ],
            /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-y': [
                {
                    'touch-pan': [
                        'y',
                        'up',
                        'down'
                    ]
                }
            ],
            /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */ 'touch-pz': [
                'touch-pinch-zoom'
            ],
            /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */ select: [
                {
                    select: [
                        'none',
                        'text',
                        'all',
                        'auto'
                    ]
                }
            ],
            /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */ 'will-change': [
                {
                    'will-change': [
                        'auto',
                        'scroll',
                        'contents',
                        'transform',
                        isArbitraryVariable,
                        isArbitraryValue
                    ]
                }
            ],
            // -----------
            // --- SVG ---
            // -----------
            /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */ fill: [
                {
                    fill: [
                        'none',
                        ...scaleColor()
                    ]
                }
            ],
            /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */ 'stroke-w': [
                {
                    stroke: [
                        isNumber,
                        isArbitraryVariableLength,
                        isArbitraryLength,
                        isArbitraryNumber
                    ]
                }
            ],
            /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */ stroke: [
                {
                    stroke: [
                        'none',
                        ...scaleColor()
                    ]
                }
            ],
            // ---------------------
            // --- Accessibility ---
            // ---------------------
            /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */ 'forced-color-adjust': [
                {
                    'forced-color-adjust': [
                        'auto',
                        'none'
                    ]
                }
            ]
        },
        conflictingClassGroups: {
            overflow: [
                'overflow-x',
                'overflow-y'
            ],
            overscroll: [
                'overscroll-x',
                'overscroll-y'
            ],
            inset: [
                'inset-x',
                'inset-y',
                'start',
                'end',
                'top',
                'right',
                'bottom',
                'left'
            ],
            'inset-x': [
                'right',
                'left'
            ],
            'inset-y': [
                'top',
                'bottom'
            ],
            flex: [
                'basis',
                'grow',
                'shrink'
            ],
            gap: [
                'gap-x',
                'gap-y'
            ],
            p: [
                'px',
                'py',
                'ps',
                'pe',
                'pt',
                'pr',
                'pb',
                'pl'
            ],
            px: [
                'pr',
                'pl'
            ],
            py: [
                'pt',
                'pb'
            ],
            m: [
                'mx',
                'my',
                'ms',
                'me',
                'mt',
                'mr',
                'mb',
                'ml'
            ],
            mx: [
                'mr',
                'ml'
            ],
            my: [
                'mt',
                'mb'
            ],
            size: [
                'w',
                'h'
            ],
            'font-size': [
                'leading'
            ],
            'fvn-normal': [
                'fvn-ordinal',
                'fvn-slashed-zero',
                'fvn-figure',
                'fvn-spacing',
                'fvn-fraction'
            ],
            'fvn-ordinal': [
                'fvn-normal'
            ],
            'fvn-slashed-zero': [
                'fvn-normal'
            ],
            'fvn-figure': [
                'fvn-normal'
            ],
            'fvn-spacing': [
                'fvn-normal'
            ],
            'fvn-fraction': [
                'fvn-normal'
            ],
            'line-clamp': [
                'display',
                'overflow'
            ],
            rounded: [
                'rounded-s',
                'rounded-e',
                'rounded-t',
                'rounded-r',
                'rounded-b',
                'rounded-l',
                'rounded-ss',
                'rounded-se',
                'rounded-ee',
                'rounded-es',
                'rounded-tl',
                'rounded-tr',
                'rounded-br',
                'rounded-bl'
            ],
            'rounded-s': [
                'rounded-ss',
                'rounded-es'
            ],
            'rounded-e': [
                'rounded-se',
                'rounded-ee'
            ],
            'rounded-t': [
                'rounded-tl',
                'rounded-tr'
            ],
            'rounded-r': [
                'rounded-tr',
                'rounded-br'
            ],
            'rounded-b': [
                'rounded-br',
                'rounded-bl'
            ],
            'rounded-l': [
                'rounded-tl',
                'rounded-bl'
            ],
            'border-spacing': [
                'border-spacing-x',
                'border-spacing-y'
            ],
            'border-w': [
                'border-w-x',
                'border-w-y',
                'border-w-s',
                'border-w-e',
                'border-w-t',
                'border-w-r',
                'border-w-b',
                'border-w-l'
            ],
            'border-w-x': [
                'border-w-r',
                'border-w-l'
            ],
            'border-w-y': [
                'border-w-t',
                'border-w-b'
            ],
            'border-color': [
                'border-color-x',
                'border-color-y',
                'border-color-s',
                'border-color-e',
                'border-color-t',
                'border-color-r',
                'border-color-b',
                'border-color-l'
            ],
            'border-color-x': [
                'border-color-r',
                'border-color-l'
            ],
            'border-color-y': [
                'border-color-t',
                'border-color-b'
            ],
            translate: [
                'translate-x',
                'translate-y',
                'translate-none'
            ],
            'translate-none': [
                'translate',
                'translate-x',
                'translate-y',
                'translate-z'
            ],
            'scroll-m': [
                'scroll-mx',
                'scroll-my',
                'scroll-ms',
                'scroll-me',
                'scroll-mt',
                'scroll-mr',
                'scroll-mb',
                'scroll-ml'
            ],
            'scroll-mx': [
                'scroll-mr',
                'scroll-ml'
            ],
            'scroll-my': [
                'scroll-mt',
                'scroll-mb'
            ],
            'scroll-p': [
                'scroll-px',
                'scroll-py',
                'scroll-ps',
                'scroll-pe',
                'scroll-pt',
                'scroll-pr',
                'scroll-pb',
                'scroll-pl'
            ],
            'scroll-px': [
                'scroll-pr',
                'scroll-pl'
            ],
            'scroll-py': [
                'scroll-pt',
                'scroll-pb'
            ],
            touch: [
                'touch-x',
                'touch-y',
                'touch-pz'
            ],
            'touch-x': [
                'touch'
            ],
            'touch-y': [
                'touch'
            ],
            'touch-pz': [
                'touch'
            ]
        },
        conflictingClassGroupModifiers: {
            'font-size': [
                'leading'
            ]
        },
        orderSensitiveModifiers: [
            '*',
            '**',
            'after',
            'backdrop',
            'before',
            'details-content',
            'file',
            'first-letter',
            'first-line',
            'marker',
            'placeholder',
            'selection'
        ]
    };
};
/**
 * @param baseConfig Config where other config will be merged into. This object will be mutated.
 * @param configExtension Partial config to merge into the `baseConfig`.
 */ const mergeConfigs = (baseConfig, param)=>{
    let { cacheSize, prefix, experimentalParseClassName, extend = {}, override = {} } = param;
    overrideProperty(baseConfig, 'cacheSize', cacheSize);
    overrideProperty(baseConfig, 'prefix', prefix);
    overrideProperty(baseConfig, 'experimentalParseClassName', experimentalParseClassName);
    overrideConfigProperties(baseConfig.theme, override.theme);
    overrideConfigProperties(baseConfig.classGroups, override.classGroups);
    overrideConfigProperties(baseConfig.conflictingClassGroups, override.conflictingClassGroups);
    overrideConfigProperties(baseConfig.conflictingClassGroupModifiers, override.conflictingClassGroupModifiers);
    overrideProperty(baseConfig, 'orderSensitiveModifiers', override.orderSensitiveModifiers);
    mergeConfigProperties(baseConfig.theme, extend.theme);
    mergeConfigProperties(baseConfig.classGroups, extend.classGroups);
    mergeConfigProperties(baseConfig.conflictingClassGroups, extend.conflictingClassGroups);
    mergeConfigProperties(baseConfig.conflictingClassGroupModifiers, extend.conflictingClassGroupModifiers);
    mergeArrayProperties(baseConfig, extend, 'orderSensitiveModifiers');
    return baseConfig;
};
const overrideProperty = (baseObject, overrideKey, overrideValue)=>{
    if (overrideValue !== undefined) {
        baseObject[overrideKey] = overrideValue;
    }
};
const overrideConfigProperties = (baseObject, overrideObject)=>{
    if (overrideObject) {
        for(const key in overrideObject){
            overrideProperty(baseObject, key, overrideObject[key]);
        }
    }
};
const mergeConfigProperties = (baseObject, mergeObject)=>{
    if (mergeObject) {
        for(const key in mergeObject){
            mergeArrayProperties(baseObject, mergeObject, key);
        }
    }
};
const mergeArrayProperties = (baseObject, mergeObject, key)=>{
    const mergeValue = mergeObject[key];
    if (mergeValue !== undefined) {
        baseObject[key] = baseObject[key] ? baseObject[key].concat(mergeValue) : mergeValue;
    }
};
const extendTailwindMerge = function(configExtension) {
    for(var _len = arguments.length, createConfig = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        createConfig[_key - 1] = arguments[_key];
    }
    return typeof configExtension === 'function' ? createTailwindMerge(getDefaultConfig, configExtension, ...createConfig) : createTailwindMerge(()=>mergeConfigs(getDefaultConfig(), configExtension), ...createConfig);
};
const twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
;
 //# sourceMappingURL=bundle-mjs.mjs.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/image-blur-svg.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * A shared function, used on both client and server, to generate a SVG blur placeholder.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getImageBlurSvg", {
    enumerable: true,
    get: function() {
        return getImageBlurSvg;
    }
});
function getImageBlurSvg(param) {
    let { widthInt, heightInt, blurWidth, blurHeight, blurDataURL, objectFit } = param;
    const std = 20;
    const svgWidth = blurWidth ? blurWidth * 40 : widthInt;
    const svgHeight = blurHeight ? blurHeight * 40 : heightInt;
    const viewBox = svgWidth && svgHeight ? "viewBox='0 0 " + svgWidth + " " + svgHeight + "'" : '';
    const preserveAspectRatio = viewBox ? 'none' : objectFit === 'contain' ? 'xMidYMid' : objectFit === 'cover' ? 'xMidYMid slice' : 'none';
    return "%3Csvg xmlns='http://www.w3.org/2000/svg' " + viewBox + "%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='" + std + "'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='" + std + "'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='" + preserveAspectRatio + "' style='filter: url(%23b);' href='" + blurDataURL + "'/%3E%3C/svg%3E";
} //# sourceMappingURL=image-blur-svg.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    VALID_LOADERS: null,
    imageConfigDefault: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    VALID_LOADERS: function() {
        return VALID_LOADERS;
    },
    imageConfigDefault: function() {
        return imageConfigDefault;
    }
});
const VALID_LOADERS = [
    'default',
    'imgix',
    'cloudinary',
    'akamai',
    'custom'
];
const imageConfigDefault = {
    deviceSizes: [
        640,
        750,
        828,
        1080,
        1200,
        1920,
        2048,
        3840
    ],
    imageSizes: [
        16,
        32,
        48,
        64,
        96,
        128,
        256,
        384
    ],
    path: '/_next/image',
    loader: 'default',
    loaderFile: '',
    domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 60,
    formats: [
        'image/webp'
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
    contentDispositionType: 'attachment',
    localPatterns: undefined,
    remotePatterns: [],
    qualities: undefined,
    unoptimized: false
}; //# sourceMappingURL=image-config.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/get-img-props.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getImgProps", {
    enumerable: true,
    get: function() {
        return getImgProps;
    }
});
const _warnonce = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _imageblursvg = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-blur-svg.js [app-client] (ecmascript)");
const _imageconfig = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)");
const VALID_LOADING_VALUES = [
    'lazy',
    'eager',
    undefined
];
// Object-fit values that are not valid background-size values
const INVALID_BACKGROUND_SIZE_VALUES = [
    '-moz-initial',
    'fill',
    'none',
    'scale-down',
    undefined
];
function isStaticRequire(src) {
    return src.default !== undefined;
}
function isStaticImageData(src) {
    return src.src !== undefined;
}
function isStaticImport(src) {
    return !!src && typeof src === 'object' && (isStaticRequire(src) || isStaticImageData(src));
}
const allImgs = new Map();
let perfObserver;
function getInt(x) {
    if (typeof x === 'undefined') {
        return x;
    }
    if (typeof x === 'number') {
        return Number.isFinite(x) ? x : NaN;
    }
    if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
        return parseInt(x, 10);
    }
    return NaN;
}
function getWidths(param, width, sizes) {
    let { deviceSizes, allSizes } = param;
    if (sizes) {
        // Find all the "vw" percent sizes used in the sizes prop
        const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
        const percentSizes = [];
        for(let match; match = viewportWidthRe.exec(sizes); match){
            percentSizes.push(parseInt(match[2]));
        }
        if (percentSizes.length) {
            const smallestRatio = Math.min(...percentSizes) * 0.01;
            return {
                widths: allSizes.filter((s)=>s >= deviceSizes[0] * smallestRatio),
                kind: 'w'
            };
        }
        return {
            widths: allSizes,
            kind: 'w'
        };
    }
    if (typeof width !== 'number') {
        return {
            widths: deviceSizes,
            kind: 'w'
        };
    }
    const widths = [
        ...new Set(// > are actually 3x in the green color, but only 1.5x in the red and
        // > blue colors. Showing a 3x resolution image in the app vs a 2x
        // > resolution image will be visually the same, though the 3x image
        // > takes significantly more data. Even true 3x resolution screens are
        // > wasteful as the human eye cannot see that level of detail without
        // > something like a magnifying glass.
        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
        [
            width,
            width * 2 /*, width * 3*/ 
        ].map((w)=>allSizes.find((p)=>p >= w) || allSizes[allSizes.length - 1]))
    ];
    return {
        widths,
        kind: 'x'
    };
}
function generateImgAttrs(param) {
    let { config, src, unoptimized, width, quality, sizes, loader } = param;
    if (unoptimized) {
        return {
            src,
            srcSet: undefined,
            sizes: undefined
        };
    }
    const { widths, kind } = getWidths(config, width, sizes);
    const last = widths.length - 1;
    return {
        sizes: !sizes && kind === 'w' ? '100vw' : sizes,
        srcSet: widths.map((w, i)=>loader({
                config,
                src,
                quality,
                width: w
            }) + " " + (kind === 'w' ? w : i + 1) + kind).join(', '),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
            config,
            src,
            quality,
            width: widths[last]
        })
    };
}
function getImgProps(param, _state) {
    let { src, sizes, unoptimized = false, priority = false, loading, className, quality, width, height, fill = false, style, overrideSrc, onLoad, onLoadingComplete, placeholder = 'empty', blurDataURL, fetchPriority, decoding = 'async', layout, objectFit, objectPosition, lazyBoundary, lazyRoot, ...rest } = param;
    const { imgConf, showAltText, blurComplete, defaultLoader } = _state;
    let config;
    let c = imgConf || _imageconfig.imageConfigDefault;
    if ('allSizes' in c) {
        config = c;
    } else {
        var _c_qualities;
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        const qualities = (_c_qualities = c.qualities) == null ? void 0 : _c_qualities.sort((a, b)=>a - b);
        config = {
            ...c,
            allSizes,
            deviceSizes,
            qualities
        };
    }
    if (typeof defaultLoader === 'undefined') {
        throw Object.defineProperty(new Error('images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config'), "__NEXT_ERROR_CODE", {
            value: "E163",
            enumerable: false,
            configurable: true
        });
    }
    let loader = rest.loader || defaultLoader;
    // Remove property so it's not spread on <img> element
    delete rest.loader;
    delete rest.srcSet;
    // This special value indicates that the user
    // didn't define a "loader" prop or "loader" config.
    const isDefaultLoader = '__next_img_default' in loader;
    if (isDefaultLoader) {
        if (config.loader === 'custom') {
            throw Object.defineProperty(new Error('Image with src "' + src + '" is missing "loader" prop.' + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader"), "__NEXT_ERROR_CODE", {
                value: "E252",
                enumerable: false,
                configurable: true
            });
        }
    } else {
        // The user defined a "loader" prop or config.
        // Since the config object is internal only, we
        // must not pass it to the user-defined "loader".
        const customImageLoader = loader;
        loader = (obj)=>{
            const { config: _, ...opts } = obj;
            return customImageLoader(opts);
        };
    }
    if (layout) {
        if (layout === 'fill') {
            fill = true;
        }
        const layoutToStyle = {
            intrinsic: {
                maxWidth: '100%',
                height: 'auto'
            },
            responsive: {
                width: '100%',
                height: 'auto'
            }
        };
        const layoutToSizes = {
            responsive: '100vw',
            fill: '100vw'
        };
        const layoutStyle = layoutToStyle[layout];
        if (layoutStyle) {
            style = {
                ...style,
                ...layoutStyle
            };
        }
        const layoutSizes = layoutToSizes[layout];
        if (layoutSizes && !sizes) {
            sizes = layoutSizes;
        }
    }
    let staticSrc = '';
    let widthInt = getInt(width);
    let heightInt = getInt(height);
    let blurWidth;
    let blurHeight;
    if (isStaticImport(src)) {
        const staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
            throw Object.defineProperty(new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received " + JSON.stringify(staticImageData)), "__NEXT_ERROR_CODE", {
                value: "E460",
                enumerable: false,
                configurable: true
            });
        }
        if (!staticImageData.height || !staticImageData.width) {
            throw Object.defineProperty(new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received " + JSON.stringify(staticImageData)), "__NEXT_ERROR_CODE", {
                value: "E48",
                enumerable: false,
                configurable: true
            });
        }
        blurWidth = staticImageData.blurWidth;
        blurHeight = staticImageData.blurHeight;
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!fill) {
            if (!widthInt && !heightInt) {
                widthInt = staticImageData.width;
                heightInt = staticImageData.height;
            } else if (widthInt && !heightInt) {
                const ratio = widthInt / staticImageData.width;
                heightInt = Math.round(staticImageData.height * ratio);
            } else if (!widthInt && heightInt) {
                const ratio = heightInt / staticImageData.height;
                widthInt = Math.round(staticImageData.width * ratio);
            }
        }
    }
    src = typeof src === 'string' ? src : staticSrc;
    let isLazy = !priority && (loading === 'lazy' || typeof loading === 'undefined');
    if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
        // https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true;
        isLazy = false;
    }
    if (config.unoptimized) {
        unoptimized = true;
    }
    if (isDefaultLoader && !config.dangerouslyAllowSVG && src.split('?', 1)[0].endsWith('.svg')) {
        // Special case to make svg serve as-is to avoid proxying
        // through the built-in Image Optimization API.
        unoptimized = true;
    }
    const qualityInt = getInt(quality);
    if ("TURBOPACK compile-time truthy", 1) {
        var _config_localPatterns;
        if (config.output === 'export' && isDefaultLoader && !unoptimized) {
            throw Object.defineProperty(new Error("Image Optimization using the default loader is not compatible with `{ output: 'export' }`.\n  Possible solutions:\n    - Remove `{ output: 'export' }` and run \"next start\" to run server mode including the Image Optimization API.\n    - Configure `{ images: { unoptimized: true } }` in `next.config.js` to disable the Image Optimization API.\n  Read more: https://nextjs.org/docs/messages/export-image-api"), "__NEXT_ERROR_CODE", {
                value: "E500",
                enumerable: false,
                configurable: true
            });
        }
        if (!src) {
            // React doesn't show the stack trace and there's
            // no `src` to help identify which image, so we
            // instead console.error(ref) during mount.
            unoptimized = true;
        } else {
            if (fill) {
                if (width) {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has both "width" and "fill" properties. Only one should be used.'), "__NEXT_ERROR_CODE", {
                        value: "E96",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (height) {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has both "height" and "fill" properties. Only one should be used.'), "__NEXT_ERROR_CODE", {
                        value: "E115",
                        enumerable: false,
                        configurable: true
                    });
                }
                if ((style == null ? void 0 : style.position) && style.position !== 'absolute') {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has both "fill" and "style.position" properties. Images with "fill" always use position absolute - it cannot be modified.'), "__NEXT_ERROR_CODE", {
                        value: "E216",
                        enumerable: false,
                        configurable: true
                    });
                }
                if ((style == null ? void 0 : style.width) && style.width !== '100%') {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has both "fill" and "style.width" properties. Images with "fill" always use width 100% - it cannot be modified.'), "__NEXT_ERROR_CODE", {
                        value: "E73",
                        enumerable: false,
                        configurable: true
                    });
                }
                if ((style == null ? void 0 : style.height) && style.height !== '100%') {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has both "fill" and "style.height" properties. Images with "fill" always use height 100% - it cannot be modified.'), "__NEXT_ERROR_CODE", {
                        value: "E404",
                        enumerable: false,
                        configurable: true
                    });
                }
            } else {
                if (typeof widthInt === 'undefined') {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" is missing required "width" property.'), "__NEXT_ERROR_CODE", {
                        value: "E451",
                        enumerable: false,
                        configurable: true
                    });
                } else if (isNaN(widthInt)) {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has invalid "width" property. Expected a numeric value in pixels but received "' + width + '".'), "__NEXT_ERROR_CODE", {
                        value: "E66",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (typeof heightInt === 'undefined') {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" is missing required "height" property.'), "__NEXT_ERROR_CODE", {
                        value: "E397",
                        enumerable: false,
                        configurable: true
                    });
                } else if (isNaN(heightInt)) {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" has invalid "height" property. Expected a numeric value in pixels but received "' + height + '".'), "__NEXT_ERROR_CODE", {
                        value: "E444",
                        enumerable: false,
                        configurable: true
                    });
                }
                // eslint-disable-next-line no-control-regex
                if (/^[\x00-\x20]/.test(src)) {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" cannot start with a space or control character. Use src.trimStart() to remove it or encodeURIComponent(src) to keep it.'), "__NEXT_ERROR_CODE", {
                        value: "E176",
                        enumerable: false,
                        configurable: true
                    });
                }
                // eslint-disable-next-line no-control-regex
                if (/[\x00-\x20]$/.test(src)) {
                    throw Object.defineProperty(new Error('Image with src "' + src + '" cannot end with a space or control character. Use src.trimEnd() to remove it or encodeURIComponent(src) to keep it.'), "__NEXT_ERROR_CODE", {
                        value: "E21",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
        if (!VALID_LOADING_VALUES.includes(loading)) {
            throw Object.defineProperty(new Error('Image with src "' + src + '" has invalid "loading" property. Provided "' + loading + '" should be one of ' + VALID_LOADING_VALUES.map(String).join(',') + "."), "__NEXT_ERROR_CODE", {
                value: "E357",
                enumerable: false,
                configurable: true
            });
        }
        if (priority && loading === 'lazy') {
            throw Object.defineProperty(new Error('Image with src "' + src + '" has both "priority" and "loading=\'lazy\'" properties. Only one should be used.'), "__NEXT_ERROR_CODE", {
                value: "E218",
                enumerable: false,
                configurable: true
            });
        }
        if (placeholder !== 'empty' && placeholder !== 'blur' && !placeholder.startsWith('data:image/')) {
            throw Object.defineProperty(new Error('Image with src "' + src + '" has invalid "placeholder" property "' + placeholder + '".'), "__NEXT_ERROR_CODE", {
                value: "E431",
                enumerable: false,
                configurable: true
            });
        }
        if (placeholder !== 'empty') {
            if (widthInt && heightInt && widthInt * heightInt < 1600) {
                (0, _warnonce.warnOnce)('Image with src "' + src + '" is smaller than 40x40. Consider removing the "placeholder" property to improve performance.');
            }
        }
        if (qualityInt && qualityInt !== 75 && !config.qualities) {
            (0, _warnonce.warnOnce)('Image with src "' + src + '" is using quality "' + qualityInt + '" which is not configured in images.qualities. This config will be required starting in Next.js 16.' + "\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-qualities");
        }
        if (src.startsWith('/') && src.includes('?') && (!(config == null ? void 0 : (_config_localPatterns = config.localPatterns) == null ? void 0 : _config_localPatterns.length) || config.localPatterns.length === 1 && config.localPatterns[0].pathname === '/_next/static/media/**')) {
            (0, _warnonce.warnOnce)('Image with src "' + src + '" is using a query string which is not configured in images.localPatterns. This config will be required starting in Next.js 16.' + "\nRead more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns");
        }
        if (placeholder === 'blur' && !blurDataURL) {
            const VALID_BLUR_EXT = [
                'jpeg',
                'png',
                'webp',
                'avif'
            ] // should match next-image-loader
            ;
            throw Object.defineProperty(new Error('Image with src "' + src + '" has "placeholder=\'blur\'" property but is missing the "blurDataURL" property.\n        Possible solutions:\n          - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image\n          - Change the "src" property to a static import with one of the supported file types: ' + VALID_BLUR_EXT.join(',') + ' (animated images not supported)\n          - Remove the "placeholder" property, effectively no blur effect\n        Read more: https://nextjs.org/docs/messages/placeholder-blur-data-url'), "__NEXT_ERROR_CODE", {
                value: "E371",
                enumerable: false,
                configurable: true
            });
        }
        if ('ref' in rest) {
            (0, _warnonce.warnOnce)('Image with src "' + src + '" is using unsupported "ref" property. Consider using the "onLoad" property instead.');
        }
        if (!unoptimized && !isDefaultLoader) {
            const urlStr = loader({
                config,
                src,
                width: widthInt || 400,
                quality: qualityInt || 75
            });
            let url;
            try {
                url = new URL(urlStr);
            } catch (err) {}
            if (urlStr === src || url && url.pathname === src && !url.search) {
                (0, _warnonce.warnOnce)('Image with src "' + src + '" has a "loader" property that does not implement width. Please implement it or use the "unoptimized" property instead.' + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader-width");
            }
        }
        if (onLoadingComplete) {
            (0, _warnonce.warnOnce)('Image with src "' + src + '" is using deprecated "onLoadingComplete" property. Please use the "onLoad" property instead.');
        }
        for (const [legacyKey, legacyValue] of Object.entries({
            layout,
            objectFit,
            objectPosition,
            lazyBoundary,
            lazyRoot
        })){
            if (legacyValue) {
                (0, _warnonce.warnOnce)('Image with src "' + src + '" has legacy prop "' + legacyKey + '". Did you forget to run the codemod?' + "\nRead more: https://nextjs.org/docs/messages/next-image-upgrade-to-13");
            }
        }
        if (typeof window !== 'undefined' && !perfObserver && window.PerformanceObserver) {
            perfObserver = new PerformanceObserver((entryList)=>{
                for (const entry of entryList.getEntries()){
                    var _entry_element;
                    // @ts-ignore - missing "LargestContentfulPaint" class with "element" prop
                    const imgSrc = (entry == null ? void 0 : (_entry_element = entry.element) == null ? void 0 : _entry_element.src) || '';
                    const lcpImage = allImgs.get(imgSrc);
                    if (lcpImage && !lcpImage.priority && lcpImage.placeholder === 'empty' && !lcpImage.src.startsWith('data:') && !lcpImage.src.startsWith('blob:')) {
                        // https://web.dev/lcp/#measure-lcp-in-javascript
                        (0, _warnonce.warnOnce)('Image with src "' + lcpImage.src + '" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.' + "\nRead more: https://nextjs.org/docs/api-reference/next/image#priority");
                    }
                }
            });
            try {
                perfObserver.observe({
                    type: 'largest-contentful-paint',
                    buffered: true
                });
            } catch (err) {
                // Log error but don't crash the app
                console.error(err);
            }
        }
    }
    const imgStyle = Object.assign(fill ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit,
        objectPosition
    } : {}, showAltText ? {} : {
        color: 'transparent'
    }, style);
    const backgroundImage = !blurComplete && placeholder !== 'empty' ? placeholder === 'blur' ? 'url("data:image/svg+xml;charset=utf-8,' + (0, _imageblursvg.getImageBlurSvg)({
        widthInt,
        heightInt,
        blurWidth,
        blurHeight,
        blurDataURL: blurDataURL || '',
        objectFit: imgStyle.objectFit
    }) + '")' : 'url("' + placeholder + '")' // assume `data:image/`
     : null;
    const backgroundSize = !INVALID_BACKGROUND_SIZE_VALUES.includes(imgStyle.objectFit) ? imgStyle.objectFit : imgStyle.objectFit === 'fill' ? '100% 100%' // the background-size equivalent of `fill`
     : 'cover';
    let placeholderStyle = backgroundImage ? {
        backgroundSize,
        backgroundPosition: imgStyle.objectPosition || '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundImage
    } : {};
    if ("TURBOPACK compile-time truthy", 1) {
        if (placeholderStyle.backgroundImage && placeholder === 'blur' && (blurDataURL == null ? void 0 : blurDataURL.startsWith('/'))) {
            // During `next dev`, we don't want to generate blur placeholders with webpack
            // because it can delay starting the dev server. Instead, `next-image-loader.js`
            // will inline a special url to lazily generate the blur placeholder at request time.
            placeholderStyle.backgroundImage = 'url("' + blurDataURL + '")';
        }
    }
    const imgAttributes = generateImgAttrs({
        config,
        src,
        unoptimized,
        width: widthInt,
        quality: qualityInt,
        sizes,
        loader
    });
    if ("TURBOPACK compile-time truthy", 1) {
        if (typeof window !== 'undefined') {
            let fullUrl;
            try {
                fullUrl = new URL(imgAttributes.src);
            } catch (e) {
                fullUrl = new URL(imgAttributes.src, window.location.href);
            }
            allImgs.set(fullUrl.href, {
                src,
                priority,
                placeholder
            });
        }
    }
    const props = {
        ...rest,
        loading: isLazy ? 'lazy' : loading,
        fetchPriority,
        width: widthInt,
        height: heightInt,
        decoding,
        className,
        style: {
            ...imgStyle,
            ...placeholderStyle
        },
        sizes: imgAttributes.sizes,
        srcSet: imgAttributes.srcSet,
        src: overrideSrc || imgAttributes.src
    };
    const meta = {
        unoptimized,
        priority,
        placeholder,
        fill
    };
    return {
        props,
        meta
    };
} //# sourceMappingURL=get-img-props.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/side-effect.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return SideEffect;
    }
});
const _react = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const isServer = typeof window === 'undefined';
const useClientOnlyLayoutEffect = isServer ? ()=>{} : _react.useLayoutEffect;
const useClientOnlyEffect = isServer ? ()=>{} : _react.useEffect;
function SideEffect(props) {
    const { headManager, reduceComponentsToState } = props;
    function emitChange() {
        if (headManager && headManager.mountedInstances) {
            const headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
            headManager.updateHead(reduceComponentsToState(headElements, props));
        }
    }
    if (isServer) {
        var _headManager_mountedInstances;
        headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.add(props.children);
        emitChange();
    }
    useClientOnlyLayoutEffect({
        "SideEffect.useClientOnlyLayoutEffect": ()=>{
            var _headManager_mountedInstances;
            headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.add(props.children);
            return ({
                "SideEffect.useClientOnlyLayoutEffect": ()=>{
                    var _headManager_mountedInstances;
                    headManager == null ? void 0 : (_headManager_mountedInstances = headManager.mountedInstances) == null ? void 0 : _headManager_mountedInstances.delete(props.children);
                }
            })["SideEffect.useClientOnlyLayoutEffect"];
        }
    }["SideEffect.useClientOnlyLayoutEffect"]);
    // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
    // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
    // being rendered, we only trigger the method from the last one.
    // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
    // singleton in the layout effect pass, and actually trigger it in the effect pass.
    useClientOnlyLayoutEffect({
        "SideEffect.useClientOnlyLayoutEffect": ()=>{
            if (headManager) {
                headManager._pendingUpdate = emitChange;
            }
            return ({
                "SideEffect.useClientOnlyLayoutEffect": ()=>{
                    if (headManager) {
                        headManager._pendingUpdate = emitChange;
                    }
                }
            })["SideEffect.useClientOnlyLayoutEffect"];
        }
    }["SideEffect.useClientOnlyLayoutEffect"]);
    useClientOnlyEffect({
        "SideEffect.useClientOnlyEffect": ()=>{
            if (headManager && headManager._pendingUpdate) {
                headManager._pendingUpdate();
                headManager._pendingUpdate = null;
            }
            return ({
                "SideEffect.useClientOnlyEffect": ()=>{
                    if (headManager && headManager._pendingUpdate) {
                        headManager._pendingUpdate();
                        headManager._pendingUpdate = null;
                    }
                }
            })["SideEffect.useClientOnlyEffect"];
        }
    }["SideEffect.useClientOnlyEffect"]);
    return null;
} //# sourceMappingURL=side-effect.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/amp-context.shared-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AmpStateContext", {
    enumerable: true,
    get: function() {
        return AmpStateContext;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const AmpStateContext = _react.default.createContext({});
if ("TURBOPACK compile-time truthy", 1) {
    AmpStateContext.displayName = 'AmpStateContext';
} //# sourceMappingURL=amp-context.shared-runtime.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/amp-mode.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isInAmpMode", {
    enumerable: true,
    get: function() {
        return isInAmpMode;
    }
});
function isInAmpMode(param) {
    let { ampFirst = false, hybrid = false, hasQuery = false } = param === void 0 ? {} : param;
    return ampFirst || hybrid && hasQuery;
} //# sourceMappingURL=amp-mode.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/head.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    defaultHead: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    defaultHead: function() {
        return defaultHead;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _sideeffect = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/side-effect.js [app-client] (ecmascript)"));
const _ampcontextsharedruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/amp-context.shared-runtime.js [app-client] (ecmascript)");
const _headmanagercontextsharedruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/head-manager-context.shared-runtime.js [app-client] (ecmascript)");
const _ampmode = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/amp-mode.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
function defaultHead(inAmpMode) {
    if (inAmpMode === void 0) inAmpMode = false;
    const head = [
        /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
            charSet: "utf-8"
        }, "charset")
    ];
    if (!inAmpMode) {
        head.push(/*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
            name: "viewport",
            content: "width=device-width"
        }, "viewport"));
    }
    return head;
}
function onlyReactElement(list, child) {
    // React children can be "string" or "number" in this case we ignore them for backwards compat
    if (typeof child === 'string' || typeof child === 'number') {
        return list;
    }
    // Adds support for React.Fragment
    if (child.type === _react.default.Fragment) {
        return list.concat(_react.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild)=>{
            if (typeof fragmentChild === 'string' || typeof fragmentChild === 'number') {
                return fragmentList;
            }
            return fragmentList.concat(fragmentChild);
        }, []));
    }
    return list.concat(child);
}
const METATYPES = [
    'name',
    'httpEquiv',
    'charSet',
    'itemProp'
];
/*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/ function unique() {
    const keys = new Set();
    const tags = new Set();
    const metaTypes = new Set();
    const metaCategories = {};
    return (h)=>{
        let isUnique = true;
        let hasKey = false;
        if (h.key && typeof h.key !== 'number' && h.key.indexOf('$') > 0) {
            hasKey = true;
            const key = h.key.slice(h.key.indexOf('$') + 1);
            if (keys.has(key)) {
                isUnique = false;
            } else {
                keys.add(key);
            }
        }
        // eslint-disable-next-line default-case
        switch(h.type){
            case 'title':
            case 'base':
                if (tags.has(h.type)) {
                    isUnique = false;
                } else {
                    tags.add(h.type);
                }
                break;
            case 'meta':
                for(let i = 0, len = METATYPES.length; i < len; i++){
                    const metatype = METATYPES[i];
                    if (!h.props.hasOwnProperty(metatype)) continue;
                    if (metatype === 'charSet') {
                        if (metaTypes.has(metatype)) {
                            isUnique = false;
                        } else {
                            metaTypes.add(metatype);
                        }
                    } else {
                        const category = h.props[metatype];
                        const categories = metaCategories[metatype] || new Set();
                        if ((metatype !== 'name' || !hasKey) && categories.has(category)) {
                            isUnique = false;
                        } else {
                            categories.add(category);
                            metaCategories[metatype] = categories;
                        }
                    }
                }
                break;
        }
        return isUnique;
    };
}
/**
 *
 * @param headChildrenElements List of children of <Head>
 */ function reduceComponents(headChildrenElements, props) {
    const { inAmpMode } = props;
    return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead(inAmpMode).reverse()).filter(unique()).reverse().map((c, i)=>{
        const key = c.key || i;
        if ("TURBOPACK compile-time truthy", 1) {
            // omit JSON-LD structured data snippets from the warning
            if (c.type === 'script' && c.props['type'] !== 'application/ld+json') {
                const srcMessage = c.props['src'] ? '<script> tag with src="' + c.props['src'] + '"' : "inline <script>";
                (0, _warnonce.warnOnce)("Do not add <script> tags using next/head (see " + srcMessage + "). Use next/script instead. \nSee more info here: https://nextjs.org/docs/messages/no-script-tags-in-head-component");
            } else if (c.type === 'link' && c.props['rel'] === 'stylesheet') {
                (0, _warnonce.warnOnce)('Do not add stylesheets using next/head (see <link rel="stylesheet"> tag with href="' + c.props['href'] + '"). Use Document instead. \nSee more info here: https://nextjs.org/docs/messages/no-stylesheets-in-head-component');
            }
        }
        return /*#__PURE__*/ _react.default.cloneElement(c, {
            key
        });
    });
}
/**
 * This component injects elements to `<head>` of your page.
 * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
 */ function Head(param) {
    let { children } = param;
    const ampState = (0, _react.useContext)(_ampcontextsharedruntime.AmpStateContext);
    const headManager = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_sideeffect.default, {
        reduceComponentsToState: reduceComponents,
        headManager: headManager,
        inAmpMode: (0, _ampmode.isInAmpMode)(ampState),
        children: children
    });
}
const _default = Head;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/image-config-context.shared-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageConfigContext", {
    enumerable: true,
    get: function() {
        return ImageConfigContext;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _imageconfig = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)");
const ImageConfigContext = _react.default.createContext(_imageconfig.imageConfigDefault);
if ("TURBOPACK compile-time truthy", 1) {
    ImageConfigContext.displayName = 'ImageConfigContext';
} //# sourceMappingURL=image-config-context.shared-runtime.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/router-context.shared-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouterContext", {
    enumerable: true,
    get: function() {
        return RouterContext;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const RouterContext = _react.default.createContext(null);
if ("TURBOPACK compile-time truthy", 1) {
    RouterContext.displayName = 'RouterContext';
} //# sourceMappingURL=router-context.shared-runtime.js.map
}),
"[project]/esports/node_modules/next/dist/compiled/picomatch/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
(()=>{
    "use strict";
    var t = {
        170: (t, e, u)=>{
            const n = u(510);
            const isWindows = ()=>{
                if (typeof navigator !== "undefined" && navigator.platform) {
                    const t = navigator.platform.toLowerCase();
                    return t === "win32" || t === "windows";
                }
                if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].platform) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].platform === "win32";
                }
                return false;
            };
            function picomatch(t, e) {
                let u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                if (e && (e.windows === null || e.windows === undefined)) {
                    e = {
                        ...e,
                        windows: isWindows()
                    };
                }
                return n(t, e, u);
            }
            Object.assign(picomatch, n);
            t.exports = picomatch;
        },
        154: (t)=>{
            const e = "\\\\/";
            const u = "[^".concat(e, "]");
            const n = "\\.";
            const o = "\\+";
            const s = "\\?";
            const r = "\\/";
            const a = "(?=.)";
            const i = "[^/]";
            const c = "(?:".concat(r, "|$)");
            const p = "(?:^|".concat(r, ")");
            const l = "".concat(n, "{1,2}").concat(c);
            const f = "(?!".concat(n, ")");
            const A = "(?!".concat(p).concat(l, ")");
            const _ = "(?!".concat(n, "{0,1}").concat(c, ")");
            const R = "(?!".concat(l, ")");
            const E = "[^.".concat(r, "]");
            const h = "".concat(i, "*?");
            const g = "/";
            const b = {
                DOT_LITERAL: n,
                PLUS_LITERAL: o,
                QMARK_LITERAL: s,
                SLASH_LITERAL: r,
                ONE_CHAR: a,
                QMARK: i,
                END_ANCHOR: c,
                DOTS_SLASH: l,
                NO_DOT: f,
                NO_DOTS: A,
                NO_DOT_SLASH: _,
                NO_DOTS_SLASH: R,
                QMARK_NO_DOT: E,
                STAR: h,
                START_ANCHOR: p,
                SEP: g
            };
            const C = {
                ...b,
                SLASH_LITERAL: "[".concat(e, "]"),
                QMARK: u,
                STAR: "".concat(u, "*?"),
                DOTS_SLASH: "".concat(n, "{1,2}(?:[").concat(e, "]|$)"),
                NO_DOT: "(?!".concat(n, ")"),
                NO_DOTS: "(?!(?:^|[".concat(e, "])").concat(n, "{1,2}(?:[").concat(e, "]|$))"),
                NO_DOT_SLASH: "(?!".concat(n, "{0,1}(?:[").concat(e, "]|$))"),
                NO_DOTS_SLASH: "(?!".concat(n, "{1,2}(?:[").concat(e, "]|$))"),
                QMARK_NO_DOT: "[^.".concat(e, "]"),
                START_ANCHOR: "(?:^|[".concat(e, "])"),
                END_ANCHOR: "(?:[".concat(e, "]|$)"),
                SEP: "\\"
            };
            const y = {
                alnum: "a-zA-Z0-9",
                alpha: "a-zA-Z",
                ascii: "\\x00-\\x7F",
                blank: " \\t",
                cntrl: "\\x00-\\x1F\\x7F",
                digit: "0-9",
                graph: "\\x21-\\x7E",
                lower: "a-z",
                print: "\\x20-\\x7E ",
                punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
                space: " \\t\\r\\n\\v\\f",
                upper: "A-Z",
                word: "A-Za-z0-9_",
                xdigit: "A-Fa-f0-9"
            };
            t.exports = {
                MAX_LENGTH: 1024 * 64,
                POSIX_REGEX_SOURCE: y,
                REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
                REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
                REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
                REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
                REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
                REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
                REPLACEMENTS: {
                    "***": "*",
                    "**/**": "**",
                    "**/**/**": "**"
                },
                CHAR_0: 48,
                CHAR_9: 57,
                CHAR_UPPERCASE_A: 65,
                CHAR_LOWERCASE_A: 97,
                CHAR_UPPERCASE_Z: 90,
                CHAR_LOWERCASE_Z: 122,
                CHAR_LEFT_PARENTHESES: 40,
                CHAR_RIGHT_PARENTHESES: 41,
                CHAR_ASTERISK: 42,
                CHAR_AMPERSAND: 38,
                CHAR_AT: 64,
                CHAR_BACKWARD_SLASH: 92,
                CHAR_CARRIAGE_RETURN: 13,
                CHAR_CIRCUMFLEX_ACCENT: 94,
                CHAR_COLON: 58,
                CHAR_COMMA: 44,
                CHAR_DOT: 46,
                CHAR_DOUBLE_QUOTE: 34,
                CHAR_EQUAL: 61,
                CHAR_EXCLAMATION_MARK: 33,
                CHAR_FORM_FEED: 12,
                CHAR_FORWARD_SLASH: 47,
                CHAR_GRAVE_ACCENT: 96,
                CHAR_HASH: 35,
                CHAR_HYPHEN_MINUS: 45,
                CHAR_LEFT_ANGLE_BRACKET: 60,
                CHAR_LEFT_CURLY_BRACE: 123,
                CHAR_LEFT_SQUARE_BRACKET: 91,
                CHAR_LINE_FEED: 10,
                CHAR_NO_BREAK_SPACE: 160,
                CHAR_PERCENT: 37,
                CHAR_PLUS: 43,
                CHAR_QUESTION_MARK: 63,
                CHAR_RIGHT_ANGLE_BRACKET: 62,
                CHAR_RIGHT_CURLY_BRACE: 125,
                CHAR_RIGHT_SQUARE_BRACKET: 93,
                CHAR_SEMICOLON: 59,
                CHAR_SINGLE_QUOTE: 39,
                CHAR_SPACE: 32,
                CHAR_TAB: 9,
                CHAR_UNDERSCORE: 95,
                CHAR_VERTICAL_LINE: 124,
                CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
                extglobChars (t) {
                    return {
                        "!": {
                            type: "negate",
                            open: "(?:(?!(?:",
                            close: "))".concat(t.STAR, ")")
                        },
                        "?": {
                            type: "qmark",
                            open: "(?:",
                            close: ")?"
                        },
                        "+": {
                            type: "plus",
                            open: "(?:",
                            close: ")+"
                        },
                        "*": {
                            type: "star",
                            open: "(?:",
                            close: ")*"
                        },
                        "@": {
                            type: "at",
                            open: "(?:",
                            close: ")"
                        }
                    };
                },
                globChars (t) {
                    return t === true ? C : b;
                }
            };
        },
        697: (t, e, u)=>{
            const n = u(154);
            const o = u(96);
            const { MAX_LENGTH: s, POSIX_REGEX_SOURCE: r, REGEX_NON_SPECIAL_CHARS: a, REGEX_SPECIAL_CHARS_BACKREF: i, REPLACEMENTS: c } = n;
            const expandRange = (t, e)=>{
                if (typeof e.expandRange === "function") {
                    return e.expandRange(...t, e);
                }
                t.sort();
                const u = "[".concat(t.join("-"), "]");
                try {
                    new RegExp(u);
                } catch (e) {
                    return t.map((t)=>o.escapeRegex(t)).join("..");
                }
                return u;
            };
            const syntaxError = (t, e)=>"Missing ".concat(t, ': "').concat(e, '" - use "\\\\').concat(e, '" to match literal characters');
            const parse = (t, e)=>{
                if (typeof t !== "string") {
                    throw new TypeError("Expected a string");
                }
                t = c[t] || t;
                const u = {
                    ...e
                };
                const p = typeof u.maxLength === "number" ? Math.min(s, u.maxLength) : s;
                let l = t.length;
                if (l > p) {
                    throw new SyntaxError("Input length: ".concat(l, ", exceeds maximum allowed length: ").concat(p));
                }
                const f = {
                    type: "bos",
                    value: "",
                    output: u.prepend || ""
                };
                const A = [
                    f
                ];
                const _ = u.capture ? "" : "?:";
                const R = n.globChars(u.windows);
                const E = n.extglobChars(R);
                const { DOT_LITERAL: h, PLUS_LITERAL: g, SLASH_LITERAL: b, ONE_CHAR: C, DOTS_SLASH: y, NO_DOT: $, NO_DOT_SLASH: x, NO_DOTS_SLASH: S, QMARK: H, QMARK_NO_DOT: v, STAR: d, START_ANCHOR: L } = R;
                const globstar = (t)=>"(".concat(_, "(?:(?!").concat(L).concat(t.dot ? y : h, ").)*?)");
                const T = u.dot ? "" : $;
                const O = u.dot ? H : v;
                let k = u.bash === true ? globstar(u) : d;
                if (u.capture) {
                    k = "(".concat(k, ")");
                }
                if (typeof u.noext === "boolean") {
                    u.noextglob = u.noext;
                }
                const m = {
                    input: t,
                    index: -1,
                    start: 0,
                    dot: u.dot === true,
                    consumed: "",
                    output: "",
                    prefix: "",
                    backtrack: false,
                    negated: false,
                    brackets: 0,
                    braces: 0,
                    parens: 0,
                    quotes: 0,
                    globstar: false,
                    tokens: A
                };
                t = o.removePrefix(t, m);
                l = t.length;
                const w = [];
                const N = [];
                const I = [];
                let B = f;
                let G;
                const eos = ()=>m.index === l - 1;
                const D = m.peek = function() {
                    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
                    return t[m.index + e];
                };
                const M = m.advance = ()=>t[++m.index] || "";
                const remaining = ()=>t.slice(m.index + 1);
                const consume = function() {
                    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                    m.consumed += t;
                    m.index += e;
                };
                const append = (t)=>{
                    m.output += t.output != null ? t.output : t.value;
                    consume(t.value);
                };
                const negate = ()=>{
                    let t = 1;
                    while(D() === "!" && (D(2) !== "(" || D(3) === "?")){
                        M();
                        m.start++;
                        t++;
                    }
                    if (t % 2 === 0) {
                        return false;
                    }
                    m.negated = true;
                    m.start++;
                    return true;
                };
                const increment = (t)=>{
                    m[t]++;
                    I.push(t);
                };
                const decrement = (t)=>{
                    m[t]--;
                    I.pop();
                };
                const push = (t)=>{
                    if (B.type === "globstar") {
                        const e = m.braces > 0 && (t.type === "comma" || t.type === "brace");
                        const u = t.extglob === true || w.length && (t.type === "pipe" || t.type === "paren");
                        if (t.type !== "slash" && t.type !== "paren" && !e && !u) {
                            m.output = m.output.slice(0, -B.output.length);
                            B.type = "star";
                            B.value = "*";
                            B.output = k;
                            m.output += B.output;
                        }
                    }
                    if (w.length && t.type !== "paren") {
                        w[w.length - 1].inner += t.value;
                    }
                    if (t.value || t.output) append(t);
                    if (B && B.type === "text" && t.type === "text") {
                        B.output = (B.output || B.value) + t.value;
                        B.value += t.value;
                        return;
                    }
                    t.prev = B;
                    A.push(t);
                    B = t;
                };
                const extglobOpen = (t, e)=>{
                    const n = {
                        ...E[e],
                        conditions: 1,
                        inner: ""
                    };
                    n.prev = B;
                    n.parens = m.parens;
                    n.output = m.output;
                    const o = (u.capture ? "(" : "") + n.open;
                    increment("parens");
                    push({
                        type: t,
                        value: e,
                        output: m.output ? "" : C
                    });
                    push({
                        type: "paren",
                        extglob: true,
                        value: M(),
                        output: o
                    });
                    w.push(n);
                };
                const extglobClose = (t)=>{
                    let n = t.close + (u.capture ? ")" : "");
                    let o;
                    if (t.type === "negate") {
                        let s = k;
                        if (t.inner && t.inner.length > 1 && t.inner.includes("/")) {
                            s = globstar(u);
                        }
                        if (s !== k || eos() || /^\)+$/.test(remaining())) {
                            n = t.close = ")$))".concat(s);
                        }
                        if (t.inner.includes("*") && (o = remaining()) && /^\.[^\\/.]+$/.test(o)) {
                            const u = parse(o, {
                                ...e,
                                fastpaths: false
                            }).output;
                            n = t.close = ")".concat(u, ")").concat(s, ")");
                        }
                        if (t.prev.type === "bos") {
                            m.negatedExtglob = true;
                        }
                    }
                    push({
                        type: "paren",
                        extglob: true,
                        value: G,
                        output: n
                    });
                    decrement("parens");
                };
                if (u.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(t)) {
                    let n = false;
                    let s = t.replace(i, (t, e, u, o, s, r)=>{
                        if (o === "\\") {
                            n = true;
                            return t;
                        }
                        if (o === "?") {
                            if (e) {
                                return e + o + (s ? H.repeat(s.length) : "");
                            }
                            if (r === 0) {
                                return O + (s ? H.repeat(s.length) : "");
                            }
                            return H.repeat(u.length);
                        }
                        if (o === ".") {
                            return h.repeat(u.length);
                        }
                        if (o === "*") {
                            if (e) {
                                return e + o + (s ? k : "");
                            }
                            return k;
                        }
                        return e ? t : "\\".concat(t);
                    });
                    if (n === true) {
                        if (u.unescape === true) {
                            s = s.replace(/\\/g, "");
                        } else {
                            s = s.replace(/\\+/g, (t)=>t.length % 2 === 0 ? "\\\\" : t ? "\\" : "");
                        }
                    }
                    if (s === t && u.contains === true) {
                        m.output = t;
                        return m;
                    }
                    m.output = o.wrapOutput(s, m, e);
                    return m;
                }
                while(!eos()){
                    G = M();
                    if (G === "\0") {
                        continue;
                    }
                    if (G === "\\") {
                        const t = D();
                        if (t === "/" && u.bash !== true) {
                            continue;
                        }
                        if (t === "." || t === ";") {
                            continue;
                        }
                        if (!t) {
                            G += "\\";
                            push({
                                type: "text",
                                value: G
                            });
                            continue;
                        }
                        const e = /^\\+/.exec(remaining());
                        let n = 0;
                        if (e && e[0].length > 2) {
                            n = e[0].length;
                            m.index += n;
                            if (n % 2 !== 0) {
                                G += "\\";
                            }
                        }
                        if (u.unescape === true) {
                            G = M();
                        } else {
                            G += M();
                        }
                        if (m.brackets === 0) {
                            push({
                                type: "text",
                                value: G
                            });
                            continue;
                        }
                    }
                    if (m.brackets > 0 && (G !== "]" || B.value === "[" || B.value === "[^")) {
                        if (u.posix !== false && G === ":") {
                            const t = B.value.slice(1);
                            if (t.includes("[")) {
                                B.posix = true;
                                if (t.includes(":")) {
                                    const t = B.value.lastIndexOf("[");
                                    const e = B.value.slice(0, t);
                                    const u = B.value.slice(t + 2);
                                    const n = r[u];
                                    if (n) {
                                        B.value = e + n;
                                        m.backtrack = true;
                                        M();
                                        if (!f.output && A.indexOf(B) === 1) {
                                            f.output = C;
                                        }
                                        continue;
                                    }
                                }
                            }
                        }
                        if (G === "[" && D() !== ":" || G === "-" && D() === "]") {
                            G = "\\".concat(G);
                        }
                        if (G === "]" && (B.value === "[" || B.value === "[^")) {
                            G = "\\".concat(G);
                        }
                        if (u.posix === true && G === "!" && B.value === "[") {
                            G = "^";
                        }
                        B.value += G;
                        append({
                            value: G
                        });
                        continue;
                    }
                    if (m.quotes === 1 && G !== '"') {
                        G = o.escapeRegex(G);
                        B.value += G;
                        append({
                            value: G
                        });
                        continue;
                    }
                    if (G === '"') {
                        m.quotes = m.quotes === 1 ? 0 : 1;
                        if (u.keepQuotes === true) {
                            push({
                                type: "text",
                                value: G
                            });
                        }
                        continue;
                    }
                    if (G === "(") {
                        increment("parens");
                        push({
                            type: "paren",
                            value: G
                        });
                        continue;
                    }
                    if (G === ")") {
                        if (m.parens === 0 && u.strictBrackets === true) {
                            throw new SyntaxError(syntaxError("opening", "("));
                        }
                        const t = w[w.length - 1];
                        if (t && m.parens === t.parens + 1) {
                            extglobClose(w.pop());
                            continue;
                        }
                        push({
                            type: "paren",
                            value: G,
                            output: m.parens ? ")" : "\\)"
                        });
                        decrement("parens");
                        continue;
                    }
                    if (G === "[") {
                        if (u.nobracket === true || !remaining().includes("]")) {
                            if (u.nobracket !== true && u.strictBrackets === true) {
                                throw new SyntaxError(syntaxError("closing", "]"));
                            }
                            G = "\\".concat(G);
                        } else {
                            increment("brackets");
                        }
                        push({
                            type: "bracket",
                            value: G
                        });
                        continue;
                    }
                    if (G === "]") {
                        if (u.nobracket === true || B && B.type === "bracket" && B.value.length === 1) {
                            push({
                                type: "text",
                                value: G,
                                output: "\\".concat(G)
                            });
                            continue;
                        }
                        if (m.brackets === 0) {
                            if (u.strictBrackets === true) {
                                throw new SyntaxError(syntaxError("opening", "["));
                            }
                            push({
                                type: "text",
                                value: G,
                                output: "\\".concat(G)
                            });
                            continue;
                        }
                        decrement("brackets");
                        const t = B.value.slice(1);
                        if (B.posix !== true && t[0] === "^" && !t.includes("/")) {
                            G = "/".concat(G);
                        }
                        B.value += G;
                        append({
                            value: G
                        });
                        if (u.literalBrackets === false || o.hasRegexChars(t)) {
                            continue;
                        }
                        const e = o.escapeRegex(B.value);
                        m.output = m.output.slice(0, -B.value.length);
                        if (u.literalBrackets === true) {
                            m.output += e;
                            B.value = e;
                            continue;
                        }
                        B.value = "(".concat(_).concat(e, "|").concat(B.value, ")");
                        m.output += B.value;
                        continue;
                    }
                    if (G === "{" && u.nobrace !== true) {
                        increment("braces");
                        const t = {
                            type: "brace",
                            value: G,
                            output: "(",
                            outputIndex: m.output.length,
                            tokensIndex: m.tokens.length
                        };
                        N.push(t);
                        push(t);
                        continue;
                    }
                    if (G === "}") {
                        const t = N[N.length - 1];
                        if (u.nobrace === true || !t) {
                            push({
                                type: "text",
                                value: G,
                                output: G
                            });
                            continue;
                        }
                        let e = ")";
                        if (t.dots === true) {
                            const t = A.slice();
                            const n = [];
                            for(let e = t.length - 1; e >= 0; e--){
                                A.pop();
                                if (t[e].type === "brace") {
                                    break;
                                }
                                if (t[e].type !== "dots") {
                                    n.unshift(t[e].value);
                                }
                            }
                            e = expandRange(n, u);
                            m.backtrack = true;
                        }
                        if (t.comma !== true && t.dots !== true) {
                            const u = m.output.slice(0, t.outputIndex);
                            const n = m.tokens.slice(t.tokensIndex);
                            t.value = t.output = "\\{";
                            G = e = "\\}";
                            m.output = u;
                            for (const t of n){
                                m.output += t.output || t.value;
                            }
                        }
                        push({
                            type: "brace",
                            value: G,
                            output: e
                        });
                        decrement("braces");
                        N.pop();
                        continue;
                    }
                    if (G === "|") {
                        if (w.length > 0) {
                            w[w.length - 1].conditions++;
                        }
                        push({
                            type: "text",
                            value: G
                        });
                        continue;
                    }
                    if (G === ",") {
                        let t = G;
                        const e = N[N.length - 1];
                        if (e && I[I.length - 1] === "braces") {
                            e.comma = true;
                            t = "|";
                        }
                        push({
                            type: "comma",
                            value: G,
                            output: t
                        });
                        continue;
                    }
                    if (G === "/") {
                        if (B.type === "dot" && m.index === m.start + 1) {
                            m.start = m.index + 1;
                            m.consumed = "";
                            m.output = "";
                            A.pop();
                            B = f;
                            continue;
                        }
                        push({
                            type: "slash",
                            value: G,
                            output: b
                        });
                        continue;
                    }
                    if (G === ".") {
                        if (m.braces > 0 && B.type === "dot") {
                            if (B.value === ".") B.output = h;
                            const t = N[N.length - 1];
                            B.type = "dots";
                            B.output += G;
                            B.value += G;
                            t.dots = true;
                            continue;
                        }
                        if (m.braces + m.parens === 0 && B.type !== "bos" && B.type !== "slash") {
                            push({
                                type: "text",
                                value: G,
                                output: h
                            });
                            continue;
                        }
                        push({
                            type: "dot",
                            value: G,
                            output: h
                        });
                        continue;
                    }
                    if (G === "?") {
                        const t = B && B.value === "(";
                        if (!t && u.noextglob !== true && D() === "(" && D(2) !== "?") {
                            extglobOpen("qmark", G);
                            continue;
                        }
                        if (B && B.type === "paren") {
                            const t = D();
                            let e = G;
                            if (B.value === "(" && !/[!=<:]/.test(t) || t === "<" && !/<([!=]|\w+>)/.test(remaining())) {
                                e = "\\".concat(G);
                            }
                            push({
                                type: "text",
                                value: G,
                                output: e
                            });
                            continue;
                        }
                        if (u.dot !== true && (B.type === "slash" || B.type === "bos")) {
                            push({
                                type: "qmark",
                                value: G,
                                output: v
                            });
                            continue;
                        }
                        push({
                            type: "qmark",
                            value: G,
                            output: H
                        });
                        continue;
                    }
                    if (G === "!") {
                        if (u.noextglob !== true && D() === "(") {
                            if (D(2) !== "?" || !/[!=<:]/.test(D(3))) {
                                extglobOpen("negate", G);
                                continue;
                            }
                        }
                        if (u.nonegate !== true && m.index === 0) {
                            negate();
                            continue;
                        }
                    }
                    if (G === "+") {
                        if (u.noextglob !== true && D() === "(" && D(2) !== "?") {
                            extglobOpen("plus", G);
                            continue;
                        }
                        if (B && B.value === "(" || u.regex === false) {
                            push({
                                type: "plus",
                                value: G,
                                output: g
                            });
                            continue;
                        }
                        if (B && (B.type === "bracket" || B.type === "paren" || B.type === "brace") || m.parens > 0) {
                            push({
                                type: "plus",
                                value: G
                            });
                            continue;
                        }
                        push({
                            type: "plus",
                            value: g
                        });
                        continue;
                    }
                    if (G === "@") {
                        if (u.noextglob !== true && D() === "(" && D(2) !== "?") {
                            push({
                                type: "at",
                                extglob: true,
                                value: G,
                                output: ""
                            });
                            continue;
                        }
                        push({
                            type: "text",
                            value: G
                        });
                        continue;
                    }
                    if (G !== "*") {
                        if (G === "$" || G === "^") {
                            G = "\\".concat(G);
                        }
                        const t = a.exec(remaining());
                        if (t) {
                            G += t[0];
                            m.index += t[0].length;
                        }
                        push({
                            type: "text",
                            value: G
                        });
                        continue;
                    }
                    if (B && (B.type === "globstar" || B.star === true)) {
                        B.type = "star";
                        B.star = true;
                        B.value += G;
                        B.output = k;
                        m.backtrack = true;
                        m.globstar = true;
                        consume(G);
                        continue;
                    }
                    let e = remaining();
                    if (u.noextglob !== true && /^\([^?]/.test(e)) {
                        extglobOpen("star", G);
                        continue;
                    }
                    if (B.type === "star") {
                        if (u.noglobstar === true) {
                            consume(G);
                            continue;
                        }
                        const n = B.prev;
                        const o = n.prev;
                        const s = n.type === "slash" || n.type === "bos";
                        const r = o && (o.type === "star" || o.type === "globstar");
                        if (u.bash === true && (!s || e[0] && e[0] !== "/")) {
                            push({
                                type: "star",
                                value: G,
                                output: ""
                            });
                            continue;
                        }
                        const a = m.braces > 0 && (n.type === "comma" || n.type === "brace");
                        const i = w.length && (n.type === "pipe" || n.type === "paren");
                        if (!s && n.type !== "paren" && !a && !i) {
                            push({
                                type: "star",
                                value: G,
                                output: ""
                            });
                            continue;
                        }
                        while(e.slice(0, 3) === "/**"){
                            const u = t[m.index + 4];
                            if (u && u !== "/") {
                                break;
                            }
                            e = e.slice(3);
                            consume("/**", 3);
                        }
                        if (n.type === "bos" && eos()) {
                            B.type = "globstar";
                            B.value += G;
                            B.output = globstar(u);
                            m.output = B.output;
                            m.globstar = true;
                            consume(G);
                            continue;
                        }
                        if (n.type === "slash" && n.prev.type !== "bos" && !r && eos()) {
                            m.output = m.output.slice(0, -(n.output + B.output).length);
                            n.output = "(?:".concat(n.output);
                            B.type = "globstar";
                            B.output = globstar(u) + (u.strictSlashes ? ")" : "|$)");
                            B.value += G;
                            m.globstar = true;
                            m.output += n.output + B.output;
                            consume(G);
                            continue;
                        }
                        if (n.type === "slash" && n.prev.type !== "bos" && e[0] === "/") {
                            const t = e[1] !== void 0 ? "|$" : "";
                            m.output = m.output.slice(0, -(n.output + B.output).length);
                            n.output = "(?:".concat(n.output);
                            B.type = "globstar";
                            B.output = "".concat(globstar(u)).concat(b, "|").concat(b).concat(t, ")");
                            B.value += G;
                            m.output += n.output + B.output;
                            m.globstar = true;
                            consume(G + M());
                            push({
                                type: "slash",
                                value: "/",
                                output: ""
                            });
                            continue;
                        }
                        if (n.type === "bos" && e[0] === "/") {
                            B.type = "globstar";
                            B.value += G;
                            B.output = "(?:^|".concat(b, "|").concat(globstar(u)).concat(b, ")");
                            m.output = B.output;
                            m.globstar = true;
                            consume(G + M());
                            push({
                                type: "slash",
                                value: "/",
                                output: ""
                            });
                            continue;
                        }
                        m.output = m.output.slice(0, -B.output.length);
                        B.type = "globstar";
                        B.output = globstar(u);
                        B.value += G;
                        m.output += B.output;
                        m.globstar = true;
                        consume(G);
                        continue;
                    }
                    const n = {
                        type: "star",
                        value: G,
                        output: k
                    };
                    if (u.bash === true) {
                        n.output = ".*?";
                        if (B.type === "bos" || B.type === "slash") {
                            n.output = T + n.output;
                        }
                        push(n);
                        continue;
                    }
                    if (B && (B.type === "bracket" || B.type === "paren") && u.regex === true) {
                        n.output = G;
                        push(n);
                        continue;
                    }
                    if (m.index === m.start || B.type === "slash" || B.type === "dot") {
                        if (B.type === "dot") {
                            m.output += x;
                            B.output += x;
                        } else if (u.dot === true) {
                            m.output += S;
                            B.output += S;
                        } else {
                            m.output += T;
                            B.output += T;
                        }
                        if (D() !== "*") {
                            m.output += C;
                            B.output += C;
                        }
                    }
                    push(n);
                }
                while(m.brackets > 0){
                    if (u.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
                    m.output = o.escapeLast(m.output, "[");
                    decrement("brackets");
                }
                while(m.parens > 0){
                    if (u.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
                    m.output = o.escapeLast(m.output, "(");
                    decrement("parens");
                }
                while(m.braces > 0){
                    if (u.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
                    m.output = o.escapeLast(m.output, "{");
                    decrement("braces");
                }
                if (u.strictSlashes !== true && (B.type === "star" || B.type === "bracket")) {
                    push({
                        type: "maybe_slash",
                        value: "",
                        output: "".concat(b, "?")
                    });
                }
                if (m.backtrack === true) {
                    m.output = "";
                    for (const t of m.tokens){
                        m.output += t.output != null ? t.output : t.value;
                        if (t.suffix) {
                            m.output += t.suffix;
                        }
                    }
                }
                return m;
            };
            parse.fastpaths = (t, e)=>{
                const u = {
                    ...e
                };
                const r = typeof u.maxLength === "number" ? Math.min(s, u.maxLength) : s;
                const a = t.length;
                if (a > r) {
                    throw new SyntaxError("Input length: ".concat(a, ", exceeds maximum allowed length: ").concat(r));
                }
                t = c[t] || t;
                const { DOT_LITERAL: i, SLASH_LITERAL: p, ONE_CHAR: l, DOTS_SLASH: f, NO_DOT: A, NO_DOTS: _, NO_DOTS_SLASH: R, STAR: E, START_ANCHOR: h } = n.globChars(u.windows);
                const g = u.dot ? _ : A;
                const b = u.dot ? R : A;
                const C = u.capture ? "" : "?:";
                const y = {
                    negated: false,
                    prefix: ""
                };
                let $ = u.bash === true ? ".*?" : E;
                if (u.capture) {
                    $ = "(".concat($, ")");
                }
                const globstar = (t)=>{
                    if (t.noglobstar === true) return $;
                    return "(".concat(C, "(?:(?!").concat(h).concat(t.dot ? f : i, ").)*?)");
                };
                const create = (t)=>{
                    switch(t){
                        case "*":
                            return "".concat(g).concat(l).concat($);
                        case ".*":
                            return "".concat(i).concat(l).concat($);
                        case "*.*":
                            return "".concat(g).concat($).concat(i).concat(l).concat($);
                        case "*/*":
                            return "".concat(g).concat($).concat(p).concat(l).concat(b).concat($);
                        case "**":
                            return g + globstar(u);
                        case "**/*":
                            return "(?:".concat(g).concat(globstar(u)).concat(p, ")?").concat(b).concat(l).concat($);
                        case "**/*.*":
                            return "(?:".concat(g).concat(globstar(u)).concat(p, ")?").concat(b).concat($).concat(i).concat(l).concat($);
                        case "**/.*":
                            return "(?:".concat(g).concat(globstar(u)).concat(p, ")?").concat(i).concat(l).concat($);
                        default:
                            {
                                const e = /^(.*?)\.(\w+)$/.exec(t);
                                if (!e) return;
                                const u = create(e[1]);
                                if (!u) return;
                                return u + i + e[2];
                            }
                    }
                };
                const x = o.removePrefix(t, y);
                let S = create(x);
                if (S && u.strictSlashes !== true) {
                    S += "".concat(p, "?");
                }
                return S;
            };
            t.exports = parse;
        },
        510: (t, e, u)=>{
            const n = u(716);
            const o = u(697);
            const s = u(96);
            const r = u(154);
            const isObject = (t)=>t && typeof t === "object" && !Array.isArray(t);
            const picomatch = function(t, e) {
                let u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                if (Array.isArray(t)) {
                    const n = t.map((t)=>picomatch(t, e, u));
                    const arrayMatcher = (t)=>{
                        for (const e of n){
                            const u = e(t);
                            if (u) return u;
                        }
                        return false;
                    };
                    return arrayMatcher;
                }
                const n = isObject(t) && t.tokens && t.input;
                if (t === "" || typeof t !== "string" && !n) {
                    throw new TypeError("Expected pattern to be a non-empty string");
                }
                const o = e || {};
                const s = o.windows;
                const r = n ? picomatch.compileRe(t, e) : picomatch.makeRe(t, e, false, true);
                const a = r.state;
                delete r.state;
                let isIgnored = ()=>false;
                if (o.ignore) {
                    const t = {
                        ...e,
                        ignore: null,
                        onMatch: null,
                        onResult: null
                    };
                    isIgnored = picomatch(o.ignore, t, u);
                }
                const matcher = function(u) {
                    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                    const { isMatch: i, match: c, output: p } = picomatch.test(u, r, e, {
                        glob: t,
                        posix: s
                    });
                    const l = {
                        glob: t,
                        state: a,
                        regex: r,
                        posix: s,
                        input: u,
                        output: p,
                        match: c,
                        isMatch: i
                    };
                    if (typeof o.onResult === "function") {
                        o.onResult(l);
                    }
                    if (i === false) {
                        l.isMatch = false;
                        return n ? l : false;
                    }
                    if (isIgnored(u)) {
                        if (typeof o.onIgnore === "function") {
                            o.onIgnore(l);
                        }
                        l.isMatch = false;
                        return n ? l : false;
                    }
                    if (typeof o.onMatch === "function") {
                        o.onMatch(l);
                    }
                    return n ? l : true;
                };
                if (u) {
                    matcher.state = a;
                }
                return matcher;
            };
            picomatch.test = function(t, e, u) {
                let { glob: n, posix: o } = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
                if (typeof t !== "string") {
                    throw new TypeError("Expected input to be a string");
                }
                if (t === "") {
                    return {
                        isMatch: false,
                        output: ""
                    };
                }
                const r = u || {};
                const a = r.format || (o ? s.toPosixSlashes : null);
                let i = t === n;
                let c = i && a ? a(t) : t;
                if (i === false) {
                    c = a ? a(t) : t;
                    i = c === n;
                }
                if (i === false || r.capture === true) {
                    if (r.matchBase === true || r.basename === true) {
                        i = picomatch.matchBase(t, e, u, o);
                    } else {
                        i = e.exec(c);
                    }
                }
                return {
                    isMatch: Boolean(i),
                    match: i,
                    output: c
                };
            };
            picomatch.matchBase = (t, e, u)=>{
                const n = e instanceof RegExp ? e : picomatch.makeRe(e, u);
                return n.test(s.basename(t));
            };
            picomatch.isMatch = (t, e, u)=>picomatch(e, u)(t);
            picomatch.parse = (t, e)=>{
                if (Array.isArray(t)) return t.map((t)=>picomatch.parse(t, e));
                return o(t, {
                    ...e,
                    fastpaths: false
                });
            };
            picomatch.scan = (t, e)=>n(t, e);
            picomatch.compileRe = function(t, e) {
                let u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
                if (u === true) {
                    return t.output;
                }
                const o = e || {};
                const s = o.contains ? "" : "^";
                const r = o.contains ? "" : "$";
                let a = "".concat(s, "(?:").concat(t.output, ")").concat(r);
                if (t && t.negated === true) {
                    a = "^(?!".concat(a, ").*$");
                }
                const i = picomatch.toRegex(a, e);
                if (n === true) {
                    i.state = t;
                }
                return i;
            };
            picomatch.makeRe = function(t) {
                let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
                if (!t || typeof t !== "string") {
                    throw new TypeError("Expected a non-empty string");
                }
                let s = {
                    negated: false,
                    fastpaths: true
                };
                if (e.fastpaths !== false && (t[0] === "." || t[0] === "*")) {
                    s.output = o.fastpaths(t, e);
                }
                if (!s.output) {
                    s = o(t, e);
                }
                return picomatch.compileRe(s, e, u, n);
            };
            picomatch.toRegex = (t, e)=>{
                try {
                    const u = e || {};
                    return new RegExp(t, u.flags || (u.nocase ? "i" : ""));
                } catch (t) {
                    if (e && e.debug === true) throw t;
                    return /$^/;
                }
            };
            picomatch.constants = r;
            t.exports = picomatch;
        },
        716: (t, e, u)=>{
            const n = u(96);
            const { CHAR_ASTERISK: o, CHAR_AT: s, CHAR_BACKWARD_SLASH: r, CHAR_COMMA: a, CHAR_DOT: i, CHAR_EXCLAMATION_MARK: c, CHAR_FORWARD_SLASH: p, CHAR_LEFT_CURLY_BRACE: l, CHAR_LEFT_PARENTHESES: f, CHAR_LEFT_SQUARE_BRACKET: A, CHAR_PLUS: _, CHAR_QUESTION_MARK: R, CHAR_RIGHT_CURLY_BRACE: E, CHAR_RIGHT_PARENTHESES: h, CHAR_RIGHT_SQUARE_BRACKET: g } = u(154);
            const isPathSeparator = (t)=>t === p || t === r;
            const depth = (t)=>{
                if (t.isPrefix !== true) {
                    t.depth = t.isGlobstar ? Infinity : 1;
                }
            };
            const scan = (t, e)=>{
                const u = e || {};
                const b = t.length - 1;
                const C = u.parts === true || u.scanToEnd === true;
                const y = [];
                const $ = [];
                const x = [];
                let S = t;
                let H = -1;
                let v = 0;
                let d = 0;
                let L = false;
                let T = false;
                let O = false;
                let k = false;
                let m = false;
                let w = false;
                let N = false;
                let I = false;
                let B = false;
                let G = false;
                let D = 0;
                let M;
                let P;
                let K = {
                    value: "",
                    depth: 0,
                    isGlob: false
                };
                const eos = ()=>H >= b;
                const peek = ()=>S.charCodeAt(H + 1);
                const advance = ()=>{
                    M = P;
                    return S.charCodeAt(++H);
                };
                while(H < b){
                    P = advance();
                    let t;
                    if (P === r) {
                        N = K.backslashes = true;
                        P = advance();
                        if (P === l) {
                            w = true;
                        }
                        continue;
                    }
                    if (w === true || P === l) {
                        D++;
                        while(eos() !== true && (P = advance())){
                            if (P === r) {
                                N = K.backslashes = true;
                                advance();
                                continue;
                            }
                            if (P === l) {
                                D++;
                                continue;
                            }
                            if (w !== true && P === i && (P = advance()) === i) {
                                L = K.isBrace = true;
                                O = K.isGlob = true;
                                G = true;
                                if (C === true) {
                                    continue;
                                }
                                break;
                            }
                            if (w !== true && P === a) {
                                L = K.isBrace = true;
                                O = K.isGlob = true;
                                G = true;
                                if (C === true) {
                                    continue;
                                }
                                break;
                            }
                            if (P === E) {
                                D--;
                                if (D === 0) {
                                    w = false;
                                    L = K.isBrace = true;
                                    G = true;
                                    break;
                                }
                            }
                        }
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (P === p) {
                        y.push(H);
                        $.push(K);
                        K = {
                            value: "",
                            depth: 0,
                            isGlob: false
                        };
                        if (G === true) continue;
                        if (M === i && H === v + 1) {
                            v += 2;
                            continue;
                        }
                        d = H + 1;
                        continue;
                    }
                    if (u.noext !== true) {
                        const t = P === _ || P === s || P === o || P === R || P === c;
                        if (t === true && peek() === f) {
                            O = K.isGlob = true;
                            k = K.isExtglob = true;
                            G = true;
                            if (P === c && H === v) {
                                B = true;
                            }
                            if (C === true) {
                                while(eos() !== true && (P = advance())){
                                    if (P === r) {
                                        N = K.backslashes = true;
                                        P = advance();
                                        continue;
                                    }
                                    if (P === h) {
                                        O = K.isGlob = true;
                                        G = true;
                                        break;
                                    }
                                }
                                continue;
                            }
                            break;
                        }
                    }
                    if (P === o) {
                        if (M === o) m = K.isGlobstar = true;
                        O = K.isGlob = true;
                        G = true;
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (P === R) {
                        O = K.isGlob = true;
                        G = true;
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (P === A) {
                        while(eos() !== true && (t = advance())){
                            if (t === r) {
                                N = K.backslashes = true;
                                advance();
                                continue;
                            }
                            if (t === g) {
                                T = K.isBracket = true;
                                O = K.isGlob = true;
                                G = true;
                                break;
                            }
                        }
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                    if (u.nonegate !== true && P === c && H === v) {
                        I = K.negated = true;
                        v++;
                        continue;
                    }
                    if (u.noparen !== true && P === f) {
                        O = K.isGlob = true;
                        if (C === true) {
                            while(eos() !== true && (P = advance())){
                                if (P === f) {
                                    N = K.backslashes = true;
                                    P = advance();
                                    continue;
                                }
                                if (P === h) {
                                    G = true;
                                    break;
                                }
                            }
                            continue;
                        }
                        break;
                    }
                    if (O === true) {
                        G = true;
                        if (C === true) {
                            continue;
                        }
                        break;
                    }
                }
                if (u.noext === true) {
                    k = false;
                    O = false;
                }
                let U = S;
                let X = "";
                let F = "";
                if (v > 0) {
                    X = S.slice(0, v);
                    S = S.slice(v);
                    d -= v;
                }
                if (U && O === true && d > 0) {
                    U = S.slice(0, d);
                    F = S.slice(d);
                } else if (O === true) {
                    U = "";
                    F = S;
                } else {
                    U = S;
                }
                if (U && U !== "" && U !== "/" && U !== S) {
                    if (isPathSeparator(U.charCodeAt(U.length - 1))) {
                        U = U.slice(0, -1);
                    }
                }
                if (u.unescape === true) {
                    if (F) F = n.removeBackslashes(F);
                    if (U && N === true) {
                        U = n.removeBackslashes(U);
                    }
                }
                const Q = {
                    prefix: X,
                    input: t,
                    start: v,
                    base: U,
                    glob: F,
                    isBrace: L,
                    isBracket: T,
                    isGlob: O,
                    isExtglob: k,
                    isGlobstar: m,
                    negated: I,
                    negatedExtglob: B
                };
                if (u.tokens === true) {
                    Q.maxDepth = 0;
                    if (!isPathSeparator(P)) {
                        $.push(K);
                    }
                    Q.tokens = $;
                }
                if (u.parts === true || u.tokens === true) {
                    let e;
                    for(let n = 0; n < y.length; n++){
                        const o = e ? e + 1 : v;
                        const s = y[n];
                        const r = t.slice(o, s);
                        if (u.tokens) {
                            if (n === 0 && v !== 0) {
                                $[n].isPrefix = true;
                                $[n].value = X;
                            } else {
                                $[n].value = r;
                            }
                            depth($[n]);
                            Q.maxDepth += $[n].depth;
                        }
                        if (n !== 0 || r !== "") {
                            x.push(r);
                        }
                        e = s;
                    }
                    if (e && e + 1 < t.length) {
                        const n = t.slice(e + 1);
                        x.push(n);
                        if (u.tokens) {
                            $[$.length - 1].value = n;
                            depth($[$.length - 1]);
                            Q.maxDepth += $[$.length - 1].depth;
                        }
                    }
                    Q.slashes = y;
                    Q.parts = x;
                }
                return Q;
            };
            t.exports = scan;
        },
        96: (t, e, u)=>{
            const { REGEX_BACKSLASH: n, REGEX_REMOVE_BACKSLASH: o, REGEX_SPECIAL_CHARS: s, REGEX_SPECIAL_CHARS_GLOBAL: r } = u(154);
            e.isObject = (t)=>t !== null && typeof t === "object" && !Array.isArray(t);
            e.hasRegexChars = (t)=>s.test(t);
            e.isRegexChar = (t)=>t.length === 1 && e.hasRegexChars(t);
            e.escapeRegex = (t)=>t.replace(r, "\\$1");
            e.toPosixSlashes = (t)=>t.replace(n, "/");
            e.removeBackslashes = (t)=>t.replace(o, (t)=>t === "\\" ? "" : t);
            e.escapeLast = (t, u, n)=>{
                const o = t.lastIndexOf(u, n);
                if (o === -1) return t;
                if (t[o - 1] === "\\") return e.escapeLast(t, u, o - 1);
                return "".concat(t.slice(0, o), "\\").concat(t.slice(o));
            };
            e.removePrefix = function(t) {
                let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                let u = t;
                if (u.startsWith("./")) {
                    u = u.slice(2);
                    e.prefix = "./";
                }
                return u;
            };
            e.wrapOutput = function(t) {
                let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                const n = u.contains ? "" : "^";
                const o = u.contains ? "" : "$";
                let s = "".concat(n, "(?:").concat(t, ")").concat(o);
                if (e.negated === true) {
                    s = "(?:^(?!".concat(s, ").*$)");
                }
                return s;
            };
            e.basename = function(t) {
                let { windows: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                const u = t.split(e ? /[\\/]/ : "/");
                const n = u[u.length - 1];
                if (n === "") {
                    return u[u.length - 2];
                }
                return n;
            };
        }
    };
    var e = {};
    function __nccwpck_require__(u) {
        var n = e[u];
        if (n !== undefined) {
            return n.exports;
        }
        var o = e[u] = {
            exports: {}
        };
        var s = true;
        try {
            t[u](o, o.exports, __nccwpck_require__);
            s = false;
        } finally{
            if (s) delete e[u];
        }
        return o.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/esports/node_modules/next/dist/compiled/picomatch") + "/";
    var u = __nccwpck_require__(170);
    module.exports = u;
})();
}),
"[project]/esports/node_modules/next/dist/shared/lib/match-local-pattern.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    hasLocalMatch: null,
    matchLocalPattern: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    hasLocalMatch: function() {
        return hasLocalMatch;
    },
    matchLocalPattern: function() {
        return matchLocalPattern;
    }
});
const _picomatch = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/picomatch/index.js [app-client] (ecmascript)");
function matchLocalPattern(pattern, url) {
    if (pattern.search !== undefined) {
        if (pattern.search !== url.search) {
            return false;
        }
    }
    var _pattern_pathname;
    if (!(0, _picomatch.makeRe)((_pattern_pathname = pattern.pathname) != null ? _pattern_pathname : '**', {
        dot: true
    }).test(url.pathname)) {
        return false;
    }
    return true;
}
function hasLocalMatch(localPatterns, urlPathAndQuery) {
    if (!localPatterns) {
        // if the user didn't define "localPatterns", we allow all local images
        return true;
    }
    const url = new URL(urlPathAndQuery, 'http://n');
    return localPatterns.some((p)=>matchLocalPattern(p, url));
} //# sourceMappingURL=match-local-pattern.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/match-remote-pattern.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    hasRemoteMatch: null,
    matchRemotePattern: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    hasRemoteMatch: function() {
        return hasRemoteMatch;
    },
    matchRemotePattern: function() {
        return matchRemotePattern;
    }
});
const _picomatch = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/picomatch/index.js [app-client] (ecmascript)");
function matchRemotePattern(pattern, url) {
    if (pattern.protocol !== undefined) {
        if (pattern.protocol.replace(/:$/, '') !== url.protocol.replace(/:$/, '')) {
            return false;
        }
    }
    if (pattern.port !== undefined) {
        if (pattern.port !== url.port) {
            return false;
        }
    }
    if (pattern.hostname === undefined) {
        throw Object.defineProperty(new Error("Pattern should define hostname but found\n" + JSON.stringify(pattern)), "__NEXT_ERROR_CODE", {
            value: "E410",
            enumerable: false,
            configurable: true
        });
    } else {
        if (!(0, _picomatch.makeRe)(pattern.hostname).test(url.hostname)) {
            return false;
        }
    }
    if (pattern.search !== undefined) {
        if (pattern.search !== url.search) {
            return false;
        }
    }
    var _pattern_pathname;
    // Should be the same as writeImagesManifest()
    if (!(0, _picomatch.makeRe)((_pattern_pathname = pattern.pathname) != null ? _pattern_pathname : '**', {
        dot: true
    }).test(url.pathname)) {
        return false;
    }
    return true;
}
function hasRemoteMatch(domains, remotePatterns, url) {
    return domains.some((domain)=>url.hostname === domain) || remotePatterns.some((p)=>matchRemotePattern(p, url));
} //# sourceMappingURL=match-remote-pattern.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/image-loader.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const DEFAULT_Q = 75;
function defaultLoader(param) {
    let { config, src, width, quality } = param;
    var _config_qualities;
    if ("TURBOPACK compile-time truthy", 1) {
        const missingValues = [];
        // these should always be provided but make sure they are
        if (!src) missingValues.push('src');
        if (!width) missingValues.push('width');
        if (missingValues.length > 0) {
            throw Object.defineProperty(new Error("Next Image Optimization requires " + missingValues.join(', ') + " to be provided. Make sure you pass them as props to the `next/image` component. Received: " + JSON.stringify({
                src,
                width,
                quality
            })), "__NEXT_ERROR_CODE", {
                value: "E188",
                enumerable: false,
                configurable: true
            });
        }
        if (src.startsWith('//')) {
            throw Object.defineProperty(new Error('Failed to parse src "' + src + '" on `next/image`, protocol-relative URL (//) must be changed to an absolute URL (http:// or https://)'), "__NEXT_ERROR_CODE", {
                value: "E360",
                enumerable: false,
                configurable: true
            });
        }
        if (src.startsWith('/') && config.localPatterns) {
            if ("TURBOPACK compile-time truthy", 1) {
                // We use dynamic require because this should only error in development
                const { hasLocalMatch } = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/match-local-pattern.js [app-client] (ecmascript)");
                if (!hasLocalMatch(config.localPatterns, src)) {
                    throw Object.defineProperty(new Error("Invalid src prop (" + src + ") on `next/image` does not match `images.localPatterns` configured in your `next.config.js`\n" + "See more info: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns"), "__NEXT_ERROR_CODE", {
                        value: "E426",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
        if (!src.startsWith('/') && (config.domains || config.remotePatterns)) {
            let parsedSrc;
            try {
                parsedSrc = new URL(src);
            } catch (err) {
                console.error(err);
                throw Object.defineProperty(new Error('Failed to parse src "' + src + '" on `next/image`, if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)'), "__NEXT_ERROR_CODE", {
                    value: "E63",
                    enumerable: false,
                    configurable: true
                });
            }
            if ("TURBOPACK compile-time truthy", 1) {
                // We use dynamic require because this should only error in development
                const { hasRemoteMatch } = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/match-remote-pattern.js [app-client] (ecmascript)");
                if (!hasRemoteMatch(config.domains, config.remotePatterns, parsedSrc)) {
                    throw Object.defineProperty(new Error("Invalid src prop (" + src + ') on `next/image`, hostname "' + parsedSrc.hostname + '" is not configured under images in your `next.config.js`\n' + "See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host"), "__NEXT_ERROR_CODE", {
                        value: "E231",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
        if (quality && config.qualities && !config.qualities.includes(quality)) {
            throw Object.defineProperty(new Error("Invalid quality prop (" + quality + ") on `next/image` does not match `images.qualities` configured in your `next.config.js`\n" + "See more info: https://nextjs.org/docs/messages/next-image-unconfigured-qualities"), "__NEXT_ERROR_CODE", {
                value: "E623",
                enumerable: false,
                configurable: true
            });
        }
    }
    const q = quality || ((_config_qualities = config.qualities) == null ? void 0 : _config_qualities.reduce((prev, cur)=>Math.abs(cur - DEFAULT_Q) < Math.abs(prev - DEFAULT_Q) ? cur : prev)) || DEFAULT_Q;
    return config.path + "?url=" + encodeURIComponent(src) + "&w=" + width + "&q=" + q + (src.startsWith('/_next/static/media/') && ("TURBOPACK compile-time value", false) ? "TURBOPACK unreachable" : '');
}
// We use this to determine if the import is the default loader
// or a custom loader defined by the user in next.config.js
defaultLoader.__next_img_default = true;
const _default = defaultLoader; //# sourceMappingURL=image-loader.js.map
}),
"[project]/esports/node_modules/next/dist/client/image-component.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Image", {
    enumerable: true,
    get: function() {
        return Image;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)"));
const _head = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/head.js [app-client] (ecmascript)"));
const _getimgprops = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/get-img-props.js [app-client] (ecmascript)");
const _imageconfig = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-config.js [app-client] (ecmascript)");
const _imageconfigcontextsharedruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-config-context.shared-runtime.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _routercontextsharedruntime = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/router-context.shared-runtime.js [app-client] (ecmascript)");
const _imageloader = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-loader.js [app-client] (ecmascript)"));
const _usemergedref = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
// This is replaced by webpack define plugin
const configEnv = ("TURBOPACK compile-time value", {
    "deviceSizes": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", 640),
        ("TURBOPACK compile-time value", 750),
        ("TURBOPACK compile-time value", 828),
        ("TURBOPACK compile-time value", 1080),
        ("TURBOPACK compile-time value", 1200),
        ("TURBOPACK compile-time value", 1920),
        ("TURBOPACK compile-time value", 2048),
        ("TURBOPACK compile-time value", 3840)
    ]),
    "imageSizes": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", 16),
        ("TURBOPACK compile-time value", 32),
        ("TURBOPACK compile-time value", 48),
        ("TURBOPACK compile-time value", 64),
        ("TURBOPACK compile-time value", 96),
        ("TURBOPACK compile-time value", 128),
        ("TURBOPACK compile-time value", 256),
        ("TURBOPACK compile-time value", 384)
    ]),
    "path": ("TURBOPACK compile-time value", "/_next/image"),
    "loader": ("TURBOPACK compile-time value", "default"),
    "dangerouslyAllowSVG": ("TURBOPACK compile-time value", false),
    "unoptimized": ("TURBOPACK compile-time value", false),
    "domains": ("TURBOPACK compile-time value", [
        ("TURBOPACK compile-time value", "c.animaapp.com"),
        ("TURBOPACK compile-time value", "placehold.co"),
        ("TURBOPACK compile-time value", "fra.cloud.appwrite.io"),
        ("TURBOPACK compile-time value", "img.youtube.com")
    ]),
    "remotePatterns": ("TURBOPACK compile-time value", [])
});
if (typeof window === 'undefined') {
    ;
    globalThis.__NEXT_IMAGE_IMPORTED = true;
}
// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput) {
    const src = img == null ? void 0 : img.src;
    if (!img || img['data-loaded-src'] === src) {
        return;
    }
    img['data-loaded-src'] = src;
    const p = 'decode' in img ? img.decode() : Promise.resolve();
    p.catch(()=>{}).then(()=>{
        if (!img.parentElement || !img.isConnected) {
            // Exit early in case of race condition:
            // - onload() is called
            // - decode() is called but incomplete
            // - unmount is called
            // - decode() completes
            return;
        }
        if (placeholder !== 'empty') {
            setBlurComplete(true);
        }
        if (onLoadRef == null ? void 0 : onLoadRef.current) {
            // Since we don't have the SyntheticEvent here,
            // we must create one with the same shape.
            // See https://reactjs.org/docs/events.html
            const event = new Event('load');
            Object.defineProperty(event, 'target', {
                writable: false,
                value: img
            });
            let prevented = false;
            let stopped = false;
            onLoadRef.current({
                ...event,
                nativeEvent: event,
                currentTarget: img,
                target: img,
                isDefaultPrevented: ()=>prevented,
                isPropagationStopped: ()=>stopped,
                persist: ()=>{},
                preventDefault: ()=>{
                    prevented = true;
                    event.preventDefault();
                },
                stopPropagation: ()=>{
                    stopped = true;
                    event.stopPropagation();
                }
            });
        }
        if (onLoadingCompleteRef == null ? void 0 : onLoadingCompleteRef.current) {
            onLoadingCompleteRef.current(img);
        }
        if ("TURBOPACK compile-time truthy", 1) {
            const origSrc = new URL(src, 'http://n').searchParams.get('url') || src;
            if (img.getAttribute('data-nimg') === 'fill') {
                if (!unoptimized && (!sizesInput || sizesInput === '100vw')) {
                    let widthViewportRatio = img.getBoundingClientRect().width / window.innerWidth;
                    if (widthViewportRatio < 0.6) {
                        if (sizesInput === '100vw') {
                            (0, _warnonce.warnOnce)('Image with src "' + origSrc + '" has "fill" prop and "sizes" prop of "100vw", but image is not rendered at full viewport width. Please adjust "sizes" to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes');
                        } else {
                            (0, _warnonce.warnOnce)('Image with src "' + origSrc + '" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes');
                        }
                    }
                }
                if (img.parentElement) {
                    const { position } = window.getComputedStyle(img.parentElement);
                    const valid = [
                        'absolute',
                        'fixed',
                        'relative'
                    ];
                    if (!valid.includes(position)) {
                        (0, _warnonce.warnOnce)('Image with src "' + origSrc + '" has "fill" and parent element with invalid "position". Provided "' + position + '" should be one of ' + valid.map(String).join(',') + ".");
                    }
                }
                if (img.height === 0) {
                    (0, _warnonce.warnOnce)('Image with src "' + origSrc + '" has "fill" and a height value of 0. This is likely because the parent element of the image has not been styled to have a set height.');
                }
            }
            const heightModified = img.height.toString() !== img.getAttribute('height');
            const widthModified = img.width.toString() !== img.getAttribute('width');
            if (heightModified && !widthModified || !heightModified && widthModified) {
                (0, _warnonce.warnOnce)('Image with src "' + origSrc + '" has either width or height modified, but not the other. If you use CSS to change the size of your image, also include the styles \'width: "auto"\' or \'height: "auto"\' to maintain the aspect ratio.');
            }
        }
    });
}
function getDynamicProps(fetchPriority) {
    if (Boolean(_react.use)) {
        // In React 19.0.0 or newer, we must use camelCase
        // prop to avoid "Warning: Invalid DOM property".
        // See https://github.com/facebook/react/pull/25927
        return {
            fetchPriority
        };
    }
    // In React 18.2.0 or older, we must use lowercase prop
    // to avoid "Warning: Invalid DOM property".
    return {
        fetchpriority: fetchPriority
    };
}
const ImageElement = /*#__PURE__*/ (0, _react.forwardRef)((param, forwardedRef)=>{
    let { src, srcSet, sizes, height, width, decoding, className, style, fetchPriority, placeholder, loading, unoptimized, fill, onLoadRef, onLoadingCompleteRef, setBlurComplete, setShowAltText, sizesInput, onLoad, onError, ...rest } = param;
    const ownRef = (0, _react.useCallback)((img)=>{
        if (!img) {
            return;
        }
        if (onError) {
            // If the image has an error before react hydrates, then the error is lost.
            // The workaround is to wait until the image is mounted which is after hydration,
            // then we set the src again to trigger the error handler (if there was an error).
            // eslint-disable-next-line no-self-assign
            img.src = img.src;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (!src) {
                console.error('Image is missing required "src" property:', img);
            }
            if (img.getAttribute('alt') === null) {
                console.error('Image is missing required "alt" property. Please add Alternative Text to describe the image for screen readers and search engines.');
            }
        }
        if (img.complete) {
            handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput);
        }
    }, [
        src,
        placeholder,
        onLoadRef,
        onLoadingCompleteRef,
        setBlurComplete,
        onError,
        unoptimized,
        sizesInput
    ]);
    const ref = (0, _usemergedref.useMergedRef)(forwardedRef, ownRef);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("img", {
        ...rest,
        ...getDynamicProps(fetchPriority),
        // It's intended to keep `loading` before `src` because React updates
        // props in order which causes Safari/Firefox to not lazy load properly.
        // See https://github.com/facebook/react/issues/25883
        loading: loading,
        width: width,
        height: height,
        decoding: decoding,
        "data-nimg": fill ? 'fill' : '1',
        className: className,
        style: style,
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        sizes: sizes,
        srcSet: srcSet,
        src: src,
        ref: ref,
        onLoad: (event)=>{
            const img = event.currentTarget;
            handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput);
        },
        onError: (event)=>{
            // if the real image fails to load, this will ensure "alt" is visible
            setShowAltText(true);
            if (placeholder !== 'empty') {
                // If the real image fails to load, this will still remove the placeholder.
                setBlurComplete(true);
            }
            if (onError) {
                onError(event);
            }
        }
    });
});
function ImagePreload(param) {
    let { isAppRouter, imgAttributes } = param;
    const opts = {
        as: 'image',
        imageSrcSet: imgAttributes.srcSet,
        imageSizes: imgAttributes.sizes,
        crossOrigin: imgAttributes.crossOrigin,
        referrerPolicy: imgAttributes.referrerPolicy,
        ...getDynamicProps(imgAttributes.fetchPriority)
    };
    if (isAppRouter && _reactdom.default.preload) {
        _reactdom.default.preload(imgAttributes.src, opts);
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_head.default, {
        children: /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
            rel: "preload",
            // Note how we omit the `href` attribute, as it would only be relevant
            // for browsers that do not support `imagesrcset`, and in those cases
            // it would cause the incorrect image to be preloaded.
            //
            // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
            href: imgAttributes.srcSet ? undefined : imgAttributes.src,
            ...opts
        }, '__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes)
    });
}
const Image = /*#__PURE__*/ (0, _react.forwardRef)((props, forwardedRef)=>{
    const pagesRouter = (0, _react.useContext)(_routercontextsharedruntime.RouterContext);
    // We're in the app directory if there is no pages router.
    const isAppRouter = !pagesRouter;
    const configContext = (0, _react.useContext)(_imageconfigcontextsharedruntime.ImageConfigContext);
    const config = (0, _react.useMemo)(()=>{
        var _c_qualities;
        const c = configEnv || configContext || _imageconfig.imageConfigDefault;
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        const qualities = (_c_qualities = c.qualities) == null ? void 0 : _c_qualities.sort((a, b)=>a - b);
        return {
            ...c,
            allSizes,
            deviceSizes,
            qualities
        };
    }, [
        configContext
    ]);
    const { onLoad, onLoadingComplete } = props;
    const onLoadRef = (0, _react.useRef)(onLoad);
    (0, _react.useEffect)(()=>{
        onLoadRef.current = onLoad;
    }, [
        onLoad
    ]);
    const onLoadingCompleteRef = (0, _react.useRef)(onLoadingComplete);
    (0, _react.useEffect)(()=>{
        onLoadingCompleteRef.current = onLoadingComplete;
    }, [
        onLoadingComplete
    ]);
    const [blurComplete, setBlurComplete] = (0, _react.useState)(false);
    const [showAltText, setShowAltText] = (0, _react.useState)(false);
    const { props: imgAttributes, meta: imgMeta } = (0, _getimgprops.getImgProps)(props, {
        defaultLoader: _imageloader.default,
        imgConf: config,
        blurComplete,
        showAltText
    });
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)(ImageElement, {
                ...imgAttributes,
                unoptimized: imgMeta.unoptimized,
                placeholder: imgMeta.placeholder,
                fill: imgMeta.fill,
                onLoadRef: onLoadRef,
                onLoadingCompleteRef: onLoadingCompleteRef,
                setBlurComplete: setBlurComplete,
                setShowAltText: setShowAltText,
                sizesInput: props.sizes,
                ref: forwardedRef
            }),
            imgMeta.priority ? /*#__PURE__*/ (0, _jsxruntime.jsx)(ImagePreload, {
                isAppRouter: isAppRouter,
                imgAttributes: imgAttributes
            }) : null
        ]
    });
});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=image-component.js.map
}),
"[project]/esports/node_modules/next/dist/shared/lib/image-external.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/esports/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    getImageProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    getImageProps: function() {
        return getImageProps;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/esports/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _getimgprops = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/get-img-props.js [app-client] (ecmascript)");
const _imagecomponent = __turbopack_context__.r("[project]/esports/node_modules/next/dist/client/image-component.js [app-client] (ecmascript)");
const _imageloader = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-loader.js [app-client] (ecmascript)"));
function getImageProps(imgProps) {
    const { props } = (0, _getimgprops.getImgProps)(imgProps, {
        defaultLoader: _imageloader.default,
        // This is replaced by webpack define plugin
        imgConf: ("TURBOPACK compile-time value", {
            "deviceSizes": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", 640),
                ("TURBOPACK compile-time value", 750),
                ("TURBOPACK compile-time value", 828),
                ("TURBOPACK compile-time value", 1080),
                ("TURBOPACK compile-time value", 1200),
                ("TURBOPACK compile-time value", 1920),
                ("TURBOPACK compile-time value", 2048),
                ("TURBOPACK compile-time value", 3840)
            ]),
            "imageSizes": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", 16),
                ("TURBOPACK compile-time value", 32),
                ("TURBOPACK compile-time value", 48),
                ("TURBOPACK compile-time value", 64),
                ("TURBOPACK compile-time value", 96),
                ("TURBOPACK compile-time value", 128),
                ("TURBOPACK compile-time value", 256),
                ("TURBOPACK compile-time value", 384)
            ]),
            "path": ("TURBOPACK compile-time value", "/_next/image"),
            "loader": ("TURBOPACK compile-time value", "default"),
            "dangerouslyAllowSVG": ("TURBOPACK compile-time value", false),
            "unoptimized": ("TURBOPACK compile-time value", false),
            "domains": ("TURBOPACK compile-time value", [
                ("TURBOPACK compile-time value", "c.animaapp.com"),
                ("TURBOPACK compile-time value", "placehold.co"),
                ("TURBOPACK compile-time value", "fra.cloud.appwrite.io"),
                ("TURBOPACK compile-time value", "img.youtube.com")
            ]),
            "remotePatterns": ("TURBOPACK compile-time value", [])
        })
    });
    // Normally we don't care about undefined props because we pass to JSX,
    // but this exported function could be used by the end user for anything
    // so we delete undefined props to clean it up a little.
    for (const [key, value] of Object.entries(props)){
        if (value === undefined) {
            delete props[key];
        }
    }
    return {
        props
    };
}
const _default = _imagecomponent.Image; //# sourceMappingURL=image-external.js.map
}),
"[project]/esports/node_modules/next/image.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/esports/node_modules/next/dist/shared/lib/image-external.js [app-client] (ecmascript)");
}),
"[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SocialIcon",
    ()=>SocialIcon,
    "getKeys",
    ()=>getKeys,
    "getNetworks",
    ()=>getNetworks,
    "networkFor",
    ()=>networkFor,
    "network_names",
    ()=>network_names,
    "register",
    ()=>register,
    "social_icons",
    ()=>social_icons,
    "uri_regex",
    ()=>uri_regex
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
const default_key = 'sharethis';
const social_icon = {
    display: 'inline-block',
    width: '50px',
    height: '50px',
    position: 'relative',
    overflow: 'hidden',
    verticalAlign: 'middle'
};
const social_container = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%'
};
const social_svg = {
    ...social_container,
    fillRule: 'evenodd'
};
const social_svg_g = {
    transition: 'fill 170ms ease-in-out',
    fill: 'transparent'
};
const makeUriRegex = function() {
    let socials = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return new RegExp('(?:[/.]|^)($SOCIALS)([.]|$|/)'.replace('$SOCIALS', socials.join('|').replace(/\./gu, '\\.')), 'u');
};
const social_icons = new Map();
const network_names = new Set();
let uri_regex = makeUriRegex();
function getNetworks() {
    return [
        ...network_names
    ];
}
// note: deprecate in v7
function getKeys() {
    return getNetworks();
}
function register(social, icon) {
    social_icons.set(social, icon);
    network_names.add(social);
    uri_regex = makeUriRegex(// sort by longest string first
    [
        ...network_names
    ].sort((pre, post)=>post.length - pre.length));
    return icon;
}
function networkFor(url) {
    var _url_match;
    if (!url) {
        return default_key;
    }
    if (url.startsWith('mailto:')) {
        return 'mailto';
    }
    return ((_url_match = url.match(uri_regex)) === null || _url_match === void 0 ? void 0 : _url_match[1]) || default_key;
}
const SocialIcon = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function SocialIcon(props, ref) {
    const { as = 'a', href, url, network, bgColor, fgColor, className, label, children, fallback, defaultSVG, borderRadius: br = '50%', ...rest } = props;
    const networkKey = network || networkFor(url);
    const ariaLabel = label || props['aria-label'] || networkKey;
    const fallbackIcon = (typeof fallback === 'string' ? social_icons.get(fallback) : fallback || defaultSVG) || social_icons.get(default_key);
    const { color, path } = networkKey === default_key ? fallbackIcon : social_icons.get(networkKey) || {};
    const borderRadius = typeof br != 'string' ? '50%' : br;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](as, {
        href: href || url,
        className: "social-icon".concat(className ? " ".concat(className) : ''),
        ...rest,
        style: {
            ...social_icon,
            ...rest.style
        },
        'aria-label': ariaLabel,
        ref
    }, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
        className: "social-container",
        style: social_container,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
            role: "img",
            "aria-label": "".concat(ariaLabel, " social icon"),
            className: "social-svg",
            viewBox: "0 0 64 64",
            style: {
                ...social_svg,
                borderRadius
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("g", {
                    className: "social-svg-icon",
                    style: {
                        ...social_svg_g,
                        fill: fgColor || 'white'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("path", {
                        d: "M0,0H64V64H0Z".concat(path)
                    })
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("g", {
                    className: "social-svg-mask",
                    style: {
                        ...social_svg_g,
                        fill: bgColor || color
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("path", {
                        d: path
                    })
                })
            ]
        })
    }), children);
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/auth0.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_auth0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_auth0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("auth0", {
    "color": "#191919",
    "path": "M0 0v64h64V0Zm34.088 16.287c3.965.307 7.705 1.604 9.787 2.45a2.73 2.73 0 0 1 1.707 2.523v8.164a.79.79 0 0 1-.92.776l-.77-.124c-5.246-.858-9.356-5.162-10.22-10.37l-.004-.003-.29-2.504c-.06-.393.202-.95.71-.912m-3.363.006c.507-.038.777.515.707.913l-.291 2.503c-.865 5.205-4.974 9.51-10.221 10.369v.004l-.77.124a.79.79 0 0 1-.92-.776v-8.164c0-1.107.676-2.104 1.707-2.522 2.086-.845 5.823-2.145 9.788-2.45m-10.82 15.92c.346 0 .762.12 1.019.149 7.168 1.403 10.496 6.133 10.496 15.089 0 .45-.45.758-.826.51-3.297-2.207-10.55-7.967-11.3-15.175-.014-.454.264-.574.61-.574m25.001 0c.347-.001.626.119.612.573-.75 7.208-8.005 12.968-11.301 15.175-.376.248-.826-.06-.826-.51 0-8.956 3.33-13.686 10.498-15.09.257-.028.67-.148 1.017-.149"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/bandsintown.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_bandsintown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_bandsintown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("bandsintown", {
    "color": "#1B8793",
    "path": "M0 0v64h64V0zm32.6 24.7h5.6v7.8h-5.6zm-6.8 0h5.6v7.8h-5.6zM44.9 46H19.1V18h5.6v22.4h14.6v-1.1H25.8v-5.6h19V46zm0-13.4h-5.6V18h5.6z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/behance.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_behance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_behance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("behance", {
    "color": "#007CFF",
    "path": "M40.4 30.1q-.9 0-1.5.3c-.4.2-.7.4-.9.7s-.4.6-.5.9-.2.6-.2.9h6c-.1-.9-.4-1.6-.8-2.1-.5-.5-1.2-.7-2.1-.7m-14.9 2.7h-4.4v5.1h4.3c.4 0 .8 0 1.1-.1.4-.1.7-.2 1-.4s.5-.4.7-.7.2-.7.2-1.2c0-1-.3-1.6-.8-2-.5-.5-1.2-.7-2.1-.7m1.5-3.3c.5-.3.7-.9.7-1.7 0-.4-.1-.8-.2-1.1q-.3-.45-.6-.6-.45-.3-.9-.3c-.3-.1-.7-.1-1-.1h-3.8V30h4.1c.6.1 1.2-.1 1.7-.5M0 0v64h64V0zm36.6 23.8h7.5v1.8h-7.5zm-4.7 14.3c-.4.7-.9 1.2-1.5 1.7-.6.4-1.3.8-2.1 1q-1.2.3-2.4.3H17V22.6h8.7c.9 0 1.7.1 2.4.2.7.2 1.3.4 1.9.8.5.4.9.8 1.2 1.4s.4 1.3.4 2.2-.2 1.7-.6 2.3-1 1.1-1.9 1.5c1.1.3 2 .9 2.5 1.7.6.8.8 1.8.8 3 .1.9-.1 1.7-.5 2.4M47 35.3h-9.6c0 1.1.4 2.1.9 2.6s1.3.8 2.4.8c.7 0 1.4-.2 1.9-.6s.9-.8 1-1.2h3.2c-.5 1.6-1.3 2.8-2.4 3.4-1.1.7-2.4 1-3.9 1-1.1 0-2-.2-2.9-.5-.8-.3-1.6-.8-2.2-1.4s-1-1.4-1.4-2.2c-.3-.9-.5-1.8-.5-2.8s.2-1.9.5-2.8.8-1.6 1.4-2.2 1.3-1.1 2.2-1.5c.8-.4 1.8-.5 2.8-.5 1.1 0 2.1.2 3 .7q1.2.6 2.1 1.8c.5.7.9 1.6 1.2 2.5.3.8.3 1.8.3 2.9"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/bsky.app.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_bsky
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_bsky = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("bsky.app", {
    "color": "#1185fe",
    "path": "M0 0v64h64V0Zm45.498 17.766a2.84 2.84 0 0 1 1.354.312c.578.296.932.915 1.103 1.92.085.513.046 2.326-.086 3.666-.013.125-.038.494-.064.822-.02.322-.054.696-.067.82-.013.125-.039.434-.058.69-.027.25-.06.585-.073.736-.02.158-.046.408-.066.559-.099.92-.118 1.07-.13 1.104-.014.02-.041.244-.067.494-.171 1.662-1.354 3.376-2.938 4.263-1.261.703-2.667 1.045-4.336 1.051-.801.007-.927.041-.447.133.94.17 2.005.518 2.86.945 2.247 1.11 3.041 2.747 2.331 4.778-.118.322-.25.636-.302.695-.053.052-.092.131-.092.164 0 .066-.617 1.025-.8 1.242-.06.072-.219.264-.35.428-.355.434-1.004 1.097-1.346 1.373-.164.131-.31.25-.33.27-.184.203-1.333.946-1.938 1.261-.808.42-1.425.591-2.135.598-.722.006-.953-.033-1.439-.256-1.386-.63-2.418-2.34-3.39-5.586-.421-1.426-.54-1.826-.598-2.082-.066-.276-.131-.218-.256.223-.381 1.38-1.117 3.344-1.623 4.363-.92 1.853-1.927 2.937-3.11 3.357-.499.178-1.45.166-2.029-.025-1.452-.486-2.899-1.623-4.357-3.443-1.426-1.774-2.116-3.292-2.037-4.475.046-.69.118-.933.447-1.426.302-.453.841-.914 1.44-1.236.426-.23 1.28-.584 1.609-.676.111-.026.375-.099.592-.158.216-.066.453-.126.525-.139.867-.17 1.255-.255 1.295-.281.026-.02-.302-.04-.723-.047-.42 0-.947-.026-1.164-.053-.453-.059-1.445-.276-1.642-.36a6 6 0 0 0-.46-.17c-1.241-.441-2.378-1.33-3.087-2.427-.316-.486-.659-1.221-.73-1.576a10 10 0 0 1-.19-1.123c-.027-.217-.054-.466-.067-.558a33 33 0 0 1-.197-1.873c-.026-.29-.053-.632-.066-.756a72 72 0 0 1-.073-.756c-.02-.29-.05-.631-.064-.756-.164-1.938-.172-3.68-.008-4.238.302-1.019.73-1.466 1.623-1.715.29-.08 1.157-.078 1.531.008 1.183.25 3.576 1.655 5.008 2.93.072.065.237.21.361.322.927.828 2.543 2.522 3.358 3.521.23.29.447.553.486.592.033.04.139.17.23.289.093.118.196.25.23.29.098.104 1.065 1.43 1.486 2.042.492.71 1.201 1.847 1.378 2.229.138.282.256.387.256.236 0-.105.836-1.485 1.434-2.365 1.866-2.76 4.257-5.488 6.353-7.262.566-.473.769-.63 1.63-1.22 1.648-1.126 2.937-1.676 4.015-1.688"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/codepen.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_codepen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_codepen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("codepen", {
    "color": "#151515",
    "path": "M0 0v64h64V0zm32 48c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16m.5-25.7q-.45-.3-.9 0l-9.1 5.9c-.2.2-.4.4-.4.7v6.2c0 .3.1.6.4.7l9.1 5.9q.45.3.9 0l9.1-5.9c.2-.2.4-.4.4-.7v-6.2c0-.3-.1-.6-.4-.7zm.3 2.2 6.8 4.5-3 2-3.7-2.5v-4zm-1.6 0v4L27.4 31l-3-2zm-7.4 6.1 2.1 1.4-2.1 1.4zm7.4 8.9L24.4 35l3-2 3.7 2.5v4zM32 34l-3-2 3-2 3 2zm.8 5.5v-4l3.7-2.5 3 2zm7.4-6.1L38.1 32l2.1-1.4z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/clubhouse.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_clubhouse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_clubhouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("clubhouse", {
    "color": "#1F1F1A",
    "path": "M0 0v64.271h64.203V0zm32.694 15.453c1.277 0 2.24.566 2.804 1.842.824-.538 1.956-.738 2.92-.483 1.305.34 2.1 1.249 2.581 4.03.17.882.423 1.96.735 2.895.396 1.194.85 2.128 1.643 3.518.255.425.566.908.878 1.361l.256-.51c.764-1.562 2.268-3.093 4.45-3.093.937 0 1.956.34 2.522 1.305a3.04 3.04 0 0 1 .51 1.7c0 .737-.311 1.475-.566 2.042-.057.114-.084.17-.084.198-.652 1.36-1.53 3.066-1.53 5.05 0 5.76-2.127 8.71-3.77 10.242-1.674 1.562-4.28 2.893-7.313 2.893-2.152 0-4.393-.623-6.234-1.843-2.52-1.672-4.052-4.255-5.44-6.524-1.136-1.9-1.958-3.43-3.176-6.324-.708-1.617-1.36-3.293-1.897-5.079-.482-1.562-.228-2.696.393-3.433.625-.766 1.505-1.135 2.468-1.192.17 0 .34.001.51.03a6 6 0 0 1-.2-1.475c0-1.846 1.448-3.207 3.403-3.207.255 0 .51.028.736.085-.028-.312-.056-.567-.056-.822 0-2.016 1.644-3.206 3.457-3.206m0 1.704c-.822 0-1.812.424-1.812 1.502 0 .709.197 1.758.395 2.606.34.825.398 1.336.823 3.122.255 1.052.565 1.958.877 2.752.368.967.793 1.79 1.388 2.896.283.538.426.539 1.106.17.538-.284 1.33-.625 1.924-.824-1.02-2.211-1.869-4.057-2.294-5.616-.113-.454-.51-2.272-.623-3.066-.085-.794-.17-1.473-.368-2.21-.226-.908-.538-1.332-1.416-1.332m4.87 1.252c-.445-.004-.919.14-1.216.395-.312.283-.425.509-.34 1.132.142 1.364.368 2.414.623 3.406.595 2.325 1.585 4.142 2.095 5.22.17.368.313.511.596.483.397-.029.623-.058.878-.03.34.029.596.228.596.568 0 .283-.143.397-.653.51-1.048.227-2.38.595-3.684 1.333-1.107.626-2.07 1.392-2.948 2.498-.085.113-.172.17-.313.17-.198 0-.368-.227-.538-.454s-.283-.397-.283-.567c0-.199.085-.37.283-.624.312-.426.68-.737.68-.935 0-.142-.254-.482-.48-.879-.368-.68-.992-2.044-1.417-3.065-.651-1.56-1.105-3.546-1.36-4.766-.312-1.332-.794-1.702-1.53-1.702-1.02 0-1.698.595-1.698 1.503 0 .598.197 1.391.594 2.696.255.85.51 1.7.736 2.296a53 53 0 0 0 1.218 3.066c.368.822.906 1.787 1.16 2.269.142.255.397.68.397.935 0 .454-.338.708-.791.708-.255 0-.482-.113-.737-.51-.311-.457-.992-1.788-1.473-2.78-.369-.823-.992-2.3-1.304-3.32-.51-1.616-.85-2.24-1.727-2.213-.51.029-.936.2-1.247.568-.312.397-.339 1.02-.084 1.843.538 1.73 1.163 3.317 1.835 4.943 1.192 2.807 1.957 4.257 3.062 6.1 1.388 2.268 2.75 4.538 4.93 5.984 1.558 1.02 3.46 1.561 5.3 1.561 2.578 0 4.762-1.137 6.15-2.441 1.419-1.305 3.23-3.859 3.23-8.993 0-2.354 1.02-4.4 1.644-5.732.17-.34.537-1.049.537-1.56 0-.226-.055-.537-.197-.764-.255-.397-.652-.54-1.133-.54-1.504 0-2.468 1.136-3.006 2.128a7 7 0 0 0-.537 1.36c-.312 1.049-.624 1.475-1.53 2.212-.482.426-1.076.964-1.415 1.39-.567.767-.738 1.42-.88 2.44-.028.256-.51.369-1.104.369-.34 0-.453-.113-.453-.652 0-.567.198-1.418.623-2.183.595-1.05 1.246-1.617 1.898-2.156s.85-.765.963-1.105c-.595-.797-1.16-1.618-1.614-2.412-.822-1.446-1.36-2.526-1.784-3.83a25 25 0 0 1-.794-3.152c-.34-1.988-.679-2.497-1.33-2.667a1.8 1.8 0 0 0-.428-.054m-23.056.313c.206-.014.437.052.698.187.806.42 3.65 2.637 4.193 3.076.526.422.454.641.178 1.185-.275.544-.533.683-1.022.528-.978-.309-3.882-2.07-4.64-2.523-.684-.413-.773-.784-.296-1.689.264-.499.545-.742.889-.764m-1.79 9.45c.139-.014.296-.005.469.012.803.077 4.524.682 5.116.865.613.19.698.47.623 1.005-.095.696-.409.829-.81.841-.855.024-4.407-.129-5.218-.209-.706-.07-.992-.381-.915-1.404.062-.824.319-1.068.735-1.11m7.768 7.597c.308.018.54.218.713.653.255.637.08.89-.463 1.228-.6.372-3.78 2.04-4.499 2.305-.512.19-1.068.146-1.395-.824-.402-1.198.162-1.482.965-1.794.711-.275 3.66-1.344 4.345-1.53a1 1 0 0 1 .334-.038"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/developer.mozilla.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_developer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_developer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("developer.mozilla", {
    "color": "#236ab4",
    "path": "M0 0v64h64V0zm32 48.35h-3.69v-32.7l-10.15 32.7h-4.15l10.11-32.7H32zm18 0h-3.69v-32.7l-10.12 32.7h-4.15l10.11-32.7H50z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/dev.to.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_dev
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_dev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("dev.to", {
    "color": "#000000",
    "path": "M0 0h64v64H0Zm10.29 20.228v23.636h6.535c5.18.008 6.816-4.062 6.816-6.75V26.982c-.003-2.688-1.683-6.754-6.675-6.754zm18.637.004c-1.57.039-2.817 1.363-2.778 2.957v17.87c.04 1.595 1.348 2.856 2.918 2.813h8.762V39.65h-7.508v-5.49h4.59v-4.22h-4.59v-5.49h7.508v-4.218zm11.39 0 5.43 20.687c1.492 3.52 4.828 4.39 6.687 0l5.418-20.687h-4.59l-4.167 16.246-4.188-16.246zM14.74 24.65h2.457q.823 0 1.645.62.814.624.82 1.868v9.95c0 .827-.273 1.452-.82 1.866q-.82.621-1.641.621h-2.46z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/discord.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_discord
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_discord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("discord", {
    "color": "#5865F2",
    "path": "M0 0v64h64V0zm36.903 18.5a29.6 29.6 0 0 1 7.374 2.269c4.045 5.914 6.055 12.585 5.313 20.283a29.6 29.6 0 0 1-9.05 4.537 21.7 21.7 0 0 1-1.936-3.12 19.3 19.3 0 0 0 3.055-1.46 11 11 0 0 1-.747-.562 21.25 21.25 0 0 1-18.082 0c-.242.186-.492.377-.748.562a19 19 0 0 0 3.05 1.457 22 22 0 0 1-1.937 3.123 29.7 29.7 0 0 1-9.043-4.54c-.633-6.638.632-13.37 5.299-20.275a29.8 29.8 0 0 1 7.38-2.274q.522.935.944 1.92a27.5 27.5 0 0 1 8.183 0q.422-.985.945-1.92m-10.97 18.467c-1.762 0-3.218-1.6-3.218-3.568s1.405-3.581 3.213-3.581c1.807 0 3.252 1.614 3.222 3.581-.031 1.968-1.42 3.568-3.216 3.568m11.875 0c-1.765 0-3.216-1.6-3.216-3.568s1.406-3.581 3.216-3.581 3.244 1.614 3.213 3.581c-.03 1.968-1.417 3.568-3.213 3.568"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/dribbble.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_dribbble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_dribbble = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("dribbble", {
    "color": "#ea4c89",
    "path": "M34.3 34.3c-7.7 2.7-10.5 8-10.7 8.5 2.3 1.8 5.2 2.9 8.4 2.9 1.9 0 3.7-.4 5.3-1.1-.2-1.2-1-5.4-3-10.3.1-.1.1 0 0 0m-3-6.7c-2.3-4-4.7-7.4-5.1-7.9-3.8 1.8-6.7 5.3-7.6 9.6.6-.1 6.3 0 12.7-1.7m1.7 4.5c.2-.1.4-.1.5-.2-.3-.8-.7-1.6-1.1-2.3-6.8 2-13.4 2-14 1.9v.4c0 3.5 1.3 6.7 3.5 9.1.3-.4 4-6.6 11.1-8.9m8.1-10.3c-2.4-2.1-5.6-3.4-9.1-3.4-1.1 0-2.2.1-3.2.4.4.5 2.9 3.9 5.1 8 4.9-1.9 6.9-4.7 7.2-5m-6.2 7c.3.7.6 1.3.9 2 .1.2.2.5.3.7 4.5-.6 9.1.3 9.5.4 0-3.2-1.2-6.2-3.1-8.5-.2.4-2.5 3.3-7.6 5.4m2.1 4.8c1.8 4.9 2.5 8.9 2.7 9.7 3.1-2.1 5.2-5.4 5.9-9.2-.6-.1-4.3-1.2-8.6-.5M0 0v64h64V0zm32 48c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/dropbox.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_dropbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_dropbox = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("dropbox", {
    "color": "#1081DE",
    "path": "M0 0v64h64V0zm41.5 41.2L32 46.9l-9.4-5.7v-2.1l2.8 1.8 6.6-5.5 6.6 5.5 2.8-1.8v2.1zm6.5-7.5-9.4 6.1-6.6-5.5-6.6 5.5-9.4-6.1 6.5-5.2-6.5-5.2 9.4-6.1 6.6 5.5 6.6-5.5 9.4 6.1-6.5 5.2zm-25.5-5.2 9.5 5.9 9.5-5.9-9.5-5.9z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/email.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_email
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_email = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("email", {
    "color": "#7f7f7f",
    "path": "M41.1 25H22.9l9.1 7.1zm2.9 1.6-12 9.3-12-9.3V39h24zM0 0v64h64V0zm47 42H17V22h30z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/facebook.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_facebook
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_facebook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("facebook", {
    "color": "#3b5998",
    "path": "M0 0v64h64V0zm39.6 22h-2.8c-2.2 0-2.6 1.1-2.6 2.6V28h5.3l-.7 5.3h-4.6V47h-5.5V33.3H24V28h4.6v-4c0-4.6 2.8-7 6.9-7 2 0 3.6.1 4.1.2z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/fivehundredpix.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_fivehundredpix
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_fivehundredpix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("fivehundredpix", {
    "color": "#222222",
    "path": "M33.3 31.3c-.4-.2-.7-.4-1.1-.6-.3-.1-.8-.1-.9-.1-1.1 0-1.9.6-2.2 2.1v.9c0 .1.1.4.2.7.3.9 1.4 1.3 2.1 1.3s1.2-.2 1.9-.6c.5-.3 1-.7 1.4-1.1.2-.2.5-.5.5-.6.1-.5-1.5-1.7-1.9-2m9.5-.7c-1.3 0-2.4 1-3.8 2.6 1.3 1.5 2.6 2.3 3.9 2.3 1.5 0 2.2-1.1 2.2-2.4.1-1.4-.8-2.5-2.3-2.5M0 0v64h64V0zm42.9 38.5c-2 0-3.8-1-5.7-3.3-2.2 2.4-3.7 3.3-5.7 3.3-1.8 0-3.7-.7-4.8-3.1-1.2 2.5-3.3 3.2-5.1 3.2-1.6 0-3.8-.4-5-2.5-.1-.1-.6-1.3-.6-1.6v-.7h3c.1 1.6 1.3 2.2 2.4 2.2 1.3 0 2.4-.9 2.6-2.6v-.7c-.2-1.8-1.3-2.4-2.6-2.4-.8 0-1.6.2-2.3 1.2h-2.7v-.2l1.5-8h8.4v2.5h-6.2l-.6 3.3c1-.9 2-1.1 2.9-1.1 1.4 0 3.2.6 4.1 2.6 1-2.4 3-3.2 4.7-3.2 2 0 3.9 1 5.8 3.5 2.1-2.6 3.7-3.5 5.8-3.5 3.3 0 5.1 2.4 5.1 5.4.1 3.1-1.7 5.7-5 5.7"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/flickr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_flickr
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_flickr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("flickr", {
    "color": "#0063db",
    "path": "M38 27c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5M0 0v64h64V0zm32 48c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16m-6-21c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/foursquare.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_foursquare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_foursquare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("foursquare", {
    "color": "#0072b1",
    "path": "M39.7 20.4H26.4c-.6 0-1 .5-1 1v20.5c0 .1 0 .1.1 0 0 0 4.9-5.9 5.4-6.5.5-.7.8-.8 1.6-.8H37c.6 0 1-.5 1-.8.1-.3.6-3 .7-3.6.1-.5-.4-1.1-.9-1.1h-5.5c-.7 0-1.2-.5-1.2-1.2v-.8c0-.7.5-1.2 1.2-1.2h6.4c.5 0 .9-.4 1-.8l.7-3.6c.2-.6-.2-1.1-.7-1.1M0 0v64h64V0zm44 20.9-1 5.2c-.8 4.2-1.8 9-1.9 9.5-.2.9-.6 2.4-2.7 2.4h-5.1c-.2 0-.2 0-.4.2-.1.1-7.9 9.2-7.9 9.2-.6.7-1.6.6-2 .4-.4-.1-1-.6-1-1.8V19.7c0-1.1.7-2.8 3-2.8h16.5c2.4.1 3.1 1.5 2.5 4"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/gitlab.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_gitlab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_gitlab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("gitlab", {
    "color": "#f96424",
    "path": "M0 0v64h64V0zm50.402 32.559-1.969-6.066v.007-.011L44.52 14.454a1.54 1.54 0 0 0-1.476-1.055c-.68.004-1.25.422-1.461 1.062l-3.715 11.426h-11.72l-3.722-11.426a1.52 1.52 0 0 0-1.46-1.062h-.009c-.664 0-1.257.422-1.472 1.062L15.58 26.488v.004s0 .004-.004.008q.005-.007.004-.008l-1.98 6.067c-.297.914.027 1.91.805 2.476l17.082 12.402q.006-.001.007.004c.008.004.016.012.024.016-.008-.004-.012-.012-.02-.016l.004.004h.004q.035.028.082.051l.008.008h.004l.004.004h.008q0 .005.003.004c.004 0 .004.004.008.004q.024.009.047.02.022.006.043.015v.004h.008q.006.004.012.003h.004c0 .004.007.004.011.004h.004q.03.011.063.016.012.007.023.008h.004l.008.004h.015q.004-.001.008.004h.004q.061.006.121.007h.004q.061 0 .121-.007h.004q.006-.005.012-.004h.012q.007-.002.007-.004h.004l.028-.008.062-.016h.004q.006.001.012-.004h.004s.004 0 .008-.003h.007v-.004c.016-.004.032-.012.047-.016l.043-.02.008-.003h.004q.004-.005.008-.004l.008-.004.011-.008q.042-.023.082-.05.002.001.004-.005h.004q.004-.005.008-.004L49.6 35.035a2.21 2.21 0 0 0 .8-2.476zm-7.352-16.98 3.352 10.309h-6.7zm2.766 12.051-1.367 1.75-10.086 12.91 4.77-14.66zM31.171 47.001q.005.004.004.008.001-.004-.004-.008m-1.527-4.707L18.199 27.63h6.68zm-8.688-26.715 3.356 10.309h-6.703zm-5.523 18.047a.47.47 0 0 1-.172-.527l1.473-4.512 10.773 13.805zM31.46 47.415q-.006-.007-.012-.008v-.004q-.013-.008-.02-.015-.022-.018-.039-.036c.004 0 .004.004.004.004s.004 0 .004.004c.028.024.051.047.078.067h.004s0 .004.004.004c-.008-.004-.015-.012-.023-.016m.543-3.504-2.805-8.625-2.484-7.656H37.3zm.574 3.477q-.013.008-.02.015-.004-.001-.003.004a.01.01 0 0 0-.008.008c-.008.004-.016.012-.024.016 0 0 0-.004.004-.004a1 1 0 0 0 .078-.067l.004-.004s.004 0 .004-.003zm15.996-13.762-12.074 8.761L47.28 28.59l1.465 4.508a.47.47 0 0 1-.172.528"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/github.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_github
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_github = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("github", {
    "color": "#24292e",
    "path": "M0 0v64h64V0zm37.1 47.2c-.8.2-1.1-.3-1.1-.8V42c0-1.5-.5-2.5-1.1-3 3.6-.4 7.3-1.7 7.3-7.9 0-1.7-.6-3.2-1.6-4.3.2-.4.7-2-.2-4.2 0 0-1.3-.4-4.4 1.6-1.3-.4-2.6-.5-4-.5s-2.7.2-4 .5c-3.1-2.1-4.4-1.6-4.4-1.6-.9 2.2-.3 3.8-.2 4.2-1 1.1-1.6 2.5-1.6 4.3 0 6.1 3.7 7.5 7.3 7.9-.5.4-.9 1.1-1 2.1-.9.4-3.2 1.1-4.7-1.3 0 0-.8-1.5-2.5-1.6 0 0-1.6 0-.1 1 0 0 1 .5 1.8 2.3 0 0 .9 3.1 5.4 2.1v2.7c0 .4-.3.9-1.1.8-6.3-2-10.9-8-10.9-15.1 0-8.8 7.2-16 16-16s16 7.2 16 16c0 7.1-4.6 13.1-10.9 15.2"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/google.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_google
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_google = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("google", {
    "color": "#dd4b39",
    "path": "M0 0v64h64V0zm31.3 19.1q.45.45.9 1.2c.3.4.5.9.7 1.5q.3.9.3 2.1c0 1.4-.3 2.6-.9 3.4l-.9 1.2c-.4.4-.8.7-1.2 1.1-.2.2-.5.5-.7.8s-.4.7-.4 1.1.1.8.4 1c.2.3.4.5.6.7l1.4 1.1c.8.7 1.6 1.5 2.2 2.3s.9 2 .9 3.3c0 1.9-.9 3.7-2.6 5.2-1.8 1.6-4.3 2.4-7.7 2.4q-4.2 0-6.3-1.8-2.1-1.65-2.1-3.9c0-.7.2-1.6.7-2.5q.6-1.35 2.4-2.4c1.3-.7 2.7-1.2 4.1-1.5 1.4-.2 2.6-.3 3.5-.4-.3-.4-.5-.8-.8-1.2s-.4-.9-.4-1.5c0-.4 0-.6.2-.9.1-.2.2-.5.2-.7-.5.1-.9.1-1.3.1-2.1 0-3.8-.7-4.9-2-1.2-1.2-1.8-2.7-1.8-4.3 0-2 .8-3.8 2.5-5.4 1.1-.9 2.3-1.6 3.5-1.8s2.3-.4 3.4-.4h8L33 18.4h-2.5c.2.2.5.4.8.7M48 32h-4.3v4.2h-2.5V32H37v-2.5h4.2v-4.3h2.5v4.3H48zM27.1 19.1c-.6-.5-1.4-.7-2.2-.7-1.1 0-2 .5-2.7 1.3q-.9 1.35-.9 3c0 1.5.4 3 1.3 4.5.4.7.9 1.4 1.6 1.9.6.5 1.4.8 2.2.8 1.1 0 1.9-.4 2.6-1.1.3-.5.6-1 .7-1.6.1-.5.1-1 .1-1.4q0-2.4-1.2-4.8c-.4-.8-.9-1.5-1.5-1.9m-.2 17.1c-.2 0-.7 0-1.6.1-.8.1-1.7.3-2.5.6-.2.1-.5.2-.9.4s-.7.4-1.1.7q-.6.45-.9 1.2c-.3.5-.4 1.1-.4 1.8 0 1.4.6 2.6 1.9 3.5 1.2.9 2.9 1.4 5 1.4 1.9 0 3.3-.4 4.3-1.3 1-.8 1.5-1.8 1.5-3.1 0-1-.3-1.9-1-2.7-.7-.7-1.8-1.6-3.3-2.6z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/groupme.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_groupme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_groupme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("groupme", {
    "color": "#00aff0",
    "path": "M0 0v64h64V0zm40.321 39.434a10.4 9.517 0 0 1-16.64 0 2.6 2.38 0 1 0-4.161 2.856 15.6 14.276 0 0 0 24.961 0 2.6 2.38 0 0 0-4.16-2.856m-17.42-12.848a2.6 2.38 0 0 0 0 4.759h1.3v1.19a2.6 2.38 0 0 0 5.2 0v-1.19h5.2v1.19a2.6 2.38 0 0 0 5.2 0v-1.19h1.3a2.6 2.38 0 0 0 0-4.759h-1.3v-4.758h1.3a2.6 2.38 0 0 0 0-4.759h-1.3v-1.19a2.6 2.38 0 0 0-5.2 0v1.19h-5.2v-1.19a2.6 2.38 0 0 0-5.2 0v1.19h-1.3a2.6 2.38 0 0 0 0 4.759h1.3v4.758zm6.5-4.758h5.2v4.758h-5.2z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/google_play.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_google_play
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_google_play = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("google_play", {
    "color": "#40BBC1",
    "path": "M0 0v64h64V0zm40.4 27.1-3.6 3.6-12.3-12.3zM22 44.5V19.4c0-.4.1-.7.2-.9L35.6 32 22.2 45.4c-.1-.2-.2-.5-.2-.9m2.4 1.1 12.4-12.4 3.6 3.6zm22.7-12.4-5 2.8-4-4 3.9-3.9 5.1 2.8c1.2.5 1.2 1.6 0 2.3"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/hashnode.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_hashnode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_hashnode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("hashnode", {
    "color": "#2962FF",
    "path": "M0 0v64h64V0zm15 24c-4.4 4.4-4.4 11.5 0 15.9l9.7 9.7c4.4 4.4 11.5 4.4 15.9 0l9.7-9.7c4.4-4.4 4.4-11.5 0-15.9l-9.7-9.7c-4.4-4.4-11.5-4.4-15.9 0zm22.3 13.5c3.1-3.1 3.1-8.1 0-11.1-3.1-3.1-8.1-3.1-11.1 0-3.1 3.1-3.1 8.1 0 11.1 3.1 3.1 8.1 3.1 11.1 0"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/instagram.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_instagram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_instagram = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("instagram", {
    "color": "#e94475",
    "path": "M0 0v64h64V0zm39.88 25.89c.98 0 1.77-.79 1.77-1.77s-.79-1.77-1.77-1.77-1.77.79-1.77 1.77.79 1.77 1.77 1.77M32 24.42c-4.18 0-7.58 3.39-7.58 7.58s3.4 7.58 7.58 7.58 7.58-3.4 7.58-7.58-3.4-7.58-7.58-7.58m0 12.5c-2.72 0-4.92-2.2-4.92-4.92s2.2-4.92 4.92-4.92 4.92 2.2 4.92 4.92-2.2 4.92-4.92 4.92m0-17.02c3.94 0 4.41.02 5.96.09 1.45.06 2.23.3 2.75.51.69.27 1.18.58 1.7 1.1.51.52.83 1.01 1.1 1.7.2.52.44 1.3.51 2.74.07 1.56.09 2.02.09 5.97 0 3.94-.02 4.4-.09 5.96-.07 1.44-.31 2.22-.51 2.74-.27.69-.59 1.19-1.1 1.7-.52.52-1.01.84-1.7 1.1-.52.2-1.3.45-2.75.51-1.55.07-2.02.09-5.96.09s-4.41-.02-5.96-.09c-1.45-.06-2.23-.3-2.75-.51-.69-.27-1.18-.58-1.7-1.1-.51-.51-.83-1.01-1.1-1.7-.2-.52-.44-1.3-.51-2.74-.07-1.56-.09-2.02-.09-5.96 0-3.95.02-4.41.09-5.97.07-1.44.31-2.22.51-2.74.27-.69.59-1.18 1.1-1.7.52-.52 1.01-.84 1.7-1.1.52-.2 1.3-.45 2.75-.51 1.55-.08 2.02-.09 5.96-.09m0-2.66c-4.01 0-4.51.02-6.09.09-1.57.07-2.64.32-3.58.68-.97.38-1.79.89-2.61 1.71s-1.33 1.65-1.71 2.61c-.36.94-.61 2.01-.68 3.59-.07 1.57-.09 2.07-.09 6.08s.02 4.51.09 6.09c.07 1.57.32 2.64.68 3.58.38.98.89 1.8 1.71 2.62s1.65 1.32 2.61 1.7c.94.37 2.01.62 3.59.69 1.57.07 2.07.09 6.09.09 4.01 0 4.51-.02 6.08-.09s2.65-.32 3.59-.69c.97-.37 1.79-.88 2.61-1.7s1.33-1.65 1.71-2.62c.36-.93.61-2.01.68-3.58.07-1.58.09-2.08.09-6.09s-.02-4.51-.09-6.09c-.07-1.57-.32-2.64-.68-3.58-.38-.98-.89-1.8-1.71-2.62a7.3 7.3 0 0 0-2.61-1.7c-.94-.37-2.01-.62-3.59-.69-1.58-.06-2.08-.08-6.09-.08"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/itch.io.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_itch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_itch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("itch.io", {
    "color": "#fa5c5c",
    "path": "M0 0v64h64V0zm32 16c4.482 0 7.49.028 11.828.197 1.396.921 4.146 4.435 4.172 5.356v1.523c0 1.933-1.624 3.631-3.1 3.631-1.771 0-3.248-1.631-3.248-3.568 0 1.937-1.425 3.568-3.197 3.568-1.771 0-3.152-1.631-3.152-3.568 0 1.937-1.516 3.568-3.287 3.568h-.032c-1.771 0-3.287-1.631-3.287-3.568 0 1.937-1.38 3.568-3.152 3.568s-3.197-1.631-3.197-3.568c0 1.937-1.477 3.568-3.248 3.568-1.476 0-3.1-1.698-3.1-3.63v-1.524c.026-.921 2.776-4.434 4.172-5.356C21.407 16.077 27.518 16 32 16m-3.326 9.797a3.65 4.058 0 0 0 .619.892 3.716 4.13 0 0 0 2.602 1.178q.053 0 .105-.002l.107.002a3.716 4.13 0 0 0 2.602-1.178 3.65 4.058 0 0 0 .617-.892 3.655 4.063 0 0 0 .623.892c.669.727 1.585 1.178 2.596 1.178a3.714 4.129 0 0 0 2.601-1.178c.243-.263.427-.546.596-.875.169.33.404.611.647.875a3.717 4.132 0 0 0 2.601 1.178c.122 0 .25-.037.352-.076a66 66 0 0 1 .222 4.373l.002.006.008 1.73c-.027 3.46.307 11.21-1.373 13.116-2.603.674-7.395.982-12.201.984-4.806-.002-9.598-.31-12.201-.984-1.68-1.905-1.344-9.657-1.371-13.116.002-.666.005-1.147.008-1.73v-.006c.02-1.149.08-2.724.222-4.373.103.04.23.076.352.076a3.717 4.132 0 0 0 2.601-1.178c.243-.264.478-.545.647-.875.168.329.353.612.596.875a3.714 4.129 0 0 0 2.601 1.178c1.01 0 1.927-.45 2.596-1.178a3.655 4.063 0 0 0 .623-.892m9.324 3.84v.002h-.002c-1.058.002-1.997 0-3.162 1.414a24 24 0 0 0-2.834-.16 24 24 0 0 0-2.834.16c-1.165-1.413-2.104-1.412-3.162-1.414h-.002c-.5 0-2.5 0-3.893 4.35l-1.496 5.966c-1.109 4.44.354 4.549 2.18 4.553 2.708-.112 4.209-2.298 4.209-4.485 1.5.274 3.249.41 4.998.41s3.499-.136 4.998-.41c0 2.187 1.499 4.373 4.207 4.485 1.826-.004 3.29-.113 2.182-4.553l-1.496-5.967c-1.394-4.35-3.393-4.351-3.893-4.351M32 33.057s2.851 2.91 3.363 3.945l-1.865-.082v1.809c0 .084-.749.05-1.498.011-.75.039-1.498.073-1.498-.011v-1.81l-1.865.083c.512-1.034 3.36-3.943 3.363-3.945"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/leetcode.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_leetcode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_leetcode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("leetcode", {
    "color": "#E7A41F",
    "path": "M0 0h64v64H0zm42.05 42.07a2.12 2.12 0 0 0-3.069-.005l-3.77 3.885a4.65 4.65 0 0 1-6.616.06l-6.758-6.84c-1.824-1.846-2.143-4.74-.56-6.49l6.21-6.625c1.664-1.84 5.04-2.061 6.97-.45l5.508 4.596c.932.779 2.299.628 3.052-.336s.607-2.377-.326-3.156l-5.507-4.596c-1.204-1.005-2.649-1.641-4.161-1.917L36.5 16.5c.85-.91.947-2.264.04-3.116a2.245 2.245 0 0 0-3.181.107l-9.043 9.499-6.063 6.7c-3.252 3.594-2.908 9.19.548 12.688l6.79 6.871a8.887 8.887 0 0 0 12.685-.12l3.77-3.886a2.3 2.3 0 0 0 .005-3.173m-14.396-6.016c0 1.24.971 2.244 2.17 2.244H45.83c1.198 0 2.17-1.005 2.17-2.244s-.972-2.244-2.17-2.244H29.824c-1.199 0-2.17 1.005-2.17 2.244"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/line.me.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_line
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("line.me", {
    "color": "#4cc764",
    "path": "M0 0h64v64H0Zm27.54 13.171a26 26 0 0 1 6.17-.319c3.058.196 5.992.9 8.776 2.19 3.394 1.572 6.257 3.797 8.336 6.945 1.942 2.94 2.79 6.171 2.425 9.69-.286 2.758-1.398 5.185-3.046 7.382s-3.614 4.082-5.734 5.811c-3.558 2.901-7.32 5.505-11.32 7.758-.463.26-.954.469-1.437.69a2.4 2.4 0 0 1-.457.14c-.9.212-1.32-.166-1.184-1.077.099-.663.247-1.32.322-1.986.062-.558.074-1.124.062-1.686-.01-.494-.3-.862-.747-1.026-.574-.211-1.166-.405-1.767-.504-4.812-.789-9.1-2.66-12.59-6.137-2.247-2.238-3.792-4.89-4.423-8.028-.762-3.794-.064-7.333 1.949-10.61 1.868-3.044 4.503-5.257 7.642-6.896 2.205-1.15 4.545-1.912 7.023-2.337m4.31 18.669v-2.078c.126.159.192.239.254.323 1.294 1.747 2.59 3.492 3.875 5.244.176.24.369.352.67.335.392-.022.787-.004 1.181-.006.414-.002.54-.12.541-.529q.003-4.543 0-9.085c0-.4-.133-.531-.542-.538-.394-.006-.788-.002-1.182-.001-.512.002-.618.107-.618.621v5.291c-.149-.192-.234-.299-.316-.409-1.28-1.73-2.563-3.458-3.837-5.193-.153-.209-.324-.318-.585-.313-.426.01-.852-.004-1.278.004-.369.008-.503.14-.504.51q-.006 4.575 0 9.15c.001.362.143.488.516.491q.639.005 1.279 0c.428-.002.545-.118.546-.555.002-1.066 0-2.132 0-3.263m12.106 1.473h-1.79v-1.558h.366q1.79.001 3.58-.001c.39 0 .52-.125.527-.514.008-.405.004-.81.001-1.216-.002-.507-.11-.614-.627-.614l-3.484-.002c-.123 0-.245-.012-.355-.018v-1.54h.38q1.773.001 3.546-.001c.409 0 .533-.124.539-.535q.01-.656-.001-1.312c-.006-.35-.137-.493-.486-.494q-2.925-.009-5.849 0c-.353 0-.48.14-.48.489q-.003 4.59 0 9.18c0 .356.125.479.484.48q2.907.003 5.816 0c.383 0 .51-.13.516-.525q.007-.624 0-1.248c-.003-.447-.122-.568-.574-.57-.681-.005-1.363-.002-2.109-.002m-26.32 1.893c.006.32.178.454.488.454 1.949-.002 3.898 0 5.847-.002.35 0 .476-.13.482-.486.006-.395.002-.79.002-1.184 0-.585-.087-.674-.66-.674l-3.451-.001c-.113 0-.226-.01-.365-.018v-7.159c0-.519-.106-.627-.612-.63q-.56-.003-1.118 0c-.515.001-.613.101-.613.622zm10.432-1.51v-7.606c0-.465-.117-.581-.589-.585q-.543-.002-1.085 0c-.58 0-.68.103-.681.693v8.756c0 .086-.004.171.002.256.024.286.163.451.468.45.468-.003.936.003 1.405-.002.34-.004.475-.144.478-.492.004-.468.001-.937.001-1.47z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/itunes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_itunes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_itunes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("itunes", {
    "color": "#E049D1",
    "path": "M0 0v64h64V0zm42.5 40c0 2.2-1.8 4-4 4h-2c-1.9 0-3.4-1.5-3.4-3.4s1.5-3.4 3.4-3.4h2.8c.8 0 1.4-.6 1.4-1.4v-11c0-.5-.4-.9-.9-.9h-.2l-12.1 2.4c-.4.1-.7.4-.7.9V43c0 2.2-1.8 4-4 4h-2c-1.9 0-3.4-1.5-3.4-3.4s1.5-3.4 3.4-3.4h2.8c.8 0 1.4-.6 1.4-1.4V21.3c0-.7.5-1.2 1.1-1.4l14.7-3h.3c.8 0 1.4.6 1.4 1.4z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/linkedin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_linkedin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_linkedin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("linkedin", {
    "color": "#007fb1",
    "path": "M0 0v64h64V0zm25.8 44h-5.4V26.6h5.4zm-2.7-19.7c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1M46 44h-5.4v-8.4c0-2 0-4.6-2.8-4.6s-3.2 2.2-3.2 4.5V44h-5.4V26.6h5.2V29h.1c.7-1.4 2.5-2.8 5.1-2.8 5.5 0 6.5 3.6 6.5 8.3V44z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/linktree.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_linktree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_linktree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("linktree", {
    "color": "#43e660",
    "path": "M.053.053v64h64v-64zM29.688 16h4.626v7.8l5.338-5.474 3.096 3.174-5.596 5.324h7.873v4.405h-7.918l5.633 5.474-3.088 3.11-7.65-7.688-7.652 7.688-3.098-3.098 5.635-5.475h-7.912v-4.404h7.875L21.252 21.5l3.098-3.186 5.337 5.487zm-.014 21.549h4.629V48h-4.63z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/mailto.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_mailto
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_mailto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("mailto", {
    "color": "#7f7f7f",
    "path": "M41.1 25H22.9l9.1 7.1zm2.9 1.6-12 9.3-12-9.3V39h24zM0 0v64h64V0zm47 42H17V22h30z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/mastodon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_mastodon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_mastodon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("mastodon", {
    "color": "#17063B",
    "path": "M-.135-.135v64.541h64.678V-.134ZM31.91 16c4.394-.016 8.82.462 11.213 1.488 0 0 4.875 2.042 4.875 8.992 0 0 .064 5.126-.684 8.688-.477 2.26-4.218 4.734-8.515 5.213-1.54.17-7.13 1.013-13.686-.48q-.002.5.069.995c.507 3.546 3.767 3.76 6.861 3.86 3.123.093 5.646-.723 5.646-.723l.13 2.639s-1.924 1.093-5.815 1.295c-2.144.113-4.811-.05-7.912-.815C15.994 45.143 16 34.754 16 26.48c0-6.95 4.883-8.992 4.883-8.992 2.27-.96 6.633-1.472 11.027-1.488m-4.703 5.3c-1.505-.036-3.027.51-4.016 1.532-1.802 1.918-1.406 3.174-1.406 11.816h3.569v-7.513c0-3.518 4.882-3.651 4.882.49v4.354h3.537v-4.354c0-4.141 4.887-4.006 4.887-.488v7.515h3.56v-.004c0-8.636.404-9.883-1.406-11.816-1.962-2.032-6.087-2.196-7.927.43l-.883 1.383-.887-1.383c-.916-1.306-2.405-1.924-3.91-1.961"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/matrix.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_matrix
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_matrix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("matrix", {
    "color": "#000000",
    "path": "M0 0v64h64V0zm16 16h3.04v.732h-2.198v30.536h2.197V48H16zm28.96 0H48v32h-3.04v-.732h2.198V16.732h-2.197zM29.769 26.104c.72 0 1.377.143 1.974.42.598.277 1.046.775 1.36 1.476q.509-.749 1.378-1.322.87-.574 2.061-.574.904 0 1.68.222c.517.147.955.382 1.324.707.368.327.652.745.861 1.268q.306.783.307 1.89v7.637h-3.131V31.36q0-.573-.043-1.082a2.3 2.3 0 0 0-.24-.88 1.5 1.5 0 0 0-.584-.596q-.39-.222-1.047-.223-.665 0-1.07.252a1.84 1.84 0 0 0-.641.666 2.6 2.6 0 0 0-.309.928 7.4 7.4 0 0 0-.08 1.047v6.357h-3.132v-6.4c0-.339-.005-.67-.024-1.002a2.8 2.8 0 0 0-.191-.918 1.4 1.4 0 0 0-.553-.67c-.259-.167-.635-.254-1.139-.254q-.224 0-.586.1a2 2 0 0 0-.705.375q-.344.277-.586.793-.24.519-.24 1.36v6.622H23.28v-11.42h2.953v1.541h.045a4.4 4.4 0 0 1 1.49-1.365c.578-.327 1.249-.486 2-.486"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/medium.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_medium
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_medium = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("medium", {
    "color": "#000000",
    "path": "M0 0v64h64V0zm25.025 22.914c4.985 0 9.026 4.068 9.026 9.086s-4.041 9.086-9.026 9.086S16 37.018 16 32s4.041-9.086 9.025-9.086m14.413.531c2.492 0 4.511 3.83 4.511 8.555h.002c0 4.724-2.021 8.555-4.514 8.555-2.492 0-4.511-3.831-4.511-8.555s2.02-8.555 4.511-8.555m6.974.89C47.288 24.336 48 27.768 48 32c0 4.231-.711 7.664-1.588 7.664S44.826 36.232 44.826 32s.71-7.664 1.586-7.664"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/meetup.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_meetup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_meetup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("meetup", {
    "color": "#E51937",
    "path": "M0 0v64h64V0zm47.8 44.3c-.4.2-2.5.9-3.9 1-.6.1-1.1-.6-1.4-1.5C41 39.2 39 32 37.3 27.2c0 3.7-.3 10.8-.4 12-.1 1.7-.4 3.7-1.8 3.9-1.1.2-2.4.4-4 .4-1.3 0-1.8-.9-2.4-1.8-1-1.4-3.1-4.8-4.1-6.9.3 2.3.7 4.7.9 5.8.1.8 0 1.5-.6 1.9-1 .7-3.2 1.4-4.1 1.4-.8 0-1.5-.8-1.6-1.6-.7-3.4-1.2-8-1.1-11.1 0-2.8 0-5.9.2-8.3 0-.7.3-1.1.9-1.4 1.2-.5 3-.6 4.7-.3.8.1 1 .8 1.4 1.4 1.7 2.8 3.8 6.7 5.7 10.6 0-6.3 1.9-11.9 3.5-15.3.5-1.1.9-1.4 1.9-1.4 1.3 0 2.9.2 4.1.4 1.1.2 1.5 1.6 1.7 2.5 1.2 4.5 4.7 18.7 5.5 22.4.1 1 .6 2.2.1 2.5"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/misskey.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_misskey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_misskey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("misskey", {
    "color": "#86b300",
    "path": "M0 0h64v64H0Zm16.97 18.07c-.57 0-1.13.1-1.66.29-.94.33-1.72.93-2.32 1.78-.58.83-.87 1.75-.87 2.78v18.16c0 1.33.47 2.47 1.41 3.44.97.94 2.12 1.41 3.44 1.41 1.36 0 2.5-.47 3.44-1.41.97-.97 1.45-2.12 1.45-3.44v-3.3c.01-.72.75-.53 1.12 0 .7 1.21 2.33 2.24 3.9 2.24s3.15-.86 3.9-2.24c.28-.33 1.08-.9 1.16 0v3.3c0 1.33.47 2.47 1.41 3.44.97.94 2.12 1.41 3.44 1.41 1.35 0 2.5-.47 3.44-1.41.97-.97 1.45-2.12 1.45-3.44V22.92c0-1.02-.3-1.95-.91-2.78-.58-.86-1.34-1.45-2.28-1.78-.55-.19-1.11-.29-1.66-.29-1.49 0-2.75.58-3.77 1.74l-4.92 5.76c-.11.08-.48.72-1.26.72s-1.1-.63-1.21-.72l-4.96-5.76c-1-1.16-2.24-1.74-3.74-1.74m30.68 0c-1.16 0-2.16.41-2.98 1.24q-1.2 1.2-1.2 2.94c0 1.16.4 2.16 1.2 2.98.83.8 1.82 1.2 2.98 1.2s2.16-.4 2.99-1.2c.83-.83 1.24-1.82 1.24-2.98s-.41-2.14-1.24-2.94c-.84-.83-1.83-1.24-2.99-1.24m.04 9.2c-1.16 0-2.16.41-2.99 1.24s-1.24 1.82-1.24 2.99v10.24c0 1.16.41 2.16 1.24 2.98.83.8 1.82 1.2 2.99 1.2q1.74 0 2.94-1.2c.83-.83 1.24-1.82 1.24-2.98V31.5c0-1.16-.41-2.16-1.24-2.99-.8-.82-1.78-1.24-2.94-1.24"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/onlyfans.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_onlyfans
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_onlyfans = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("onlyfans", {
    "color": "#00aeef",
    "path": "M0-.006v64.012h64V-.006zm25.348 18.014a14 14 0 0 1 9.148 3.41c2.534-3.084 5.779-3.41 11.82-3.41h7.032c-1.176 5.179-5.229 9.138-12.264 10.5 3.557 1.024 7.756 0 7.756 0-1.22 5.32-5.083 8.65-10.654 9.056l-.063.12a14 14 0 0 1-.623 1.199 14 14 0 0 1-.357.63 14 14 0 0 1-.713.987 14 14 0 0 1-.526.674 14 14 0 0 1-.771.797 14 14 0 0 1-.696.66 14 14 0 0 1-.83.637 14 14 0 0 1-.822.578 14 14 0 0 1-.877.49 14 14 0 0 1-.943.475 14 14 0 0 1-.904.343 14 14 0 0 1-1.024.338 14 14 0 0 1-.935.207 14 14 0 0 1-1.077.188 14 14 0 0 1-.953.068 14 14 0 0 1-.724.053l.011-.035a14 14 0 1 1-.011-27.965m0 9.8a4.2 4.2 0 0 0 0 8.399 4.194 4.194 0 0 0 4.199-4.2 4.2 4.2 0 0 0-4.2-4.198"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/opensea.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_opensea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_opensea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("opensea", {
    "color": "#2081E2",
    "path": "M0 0h64v64H0Zm33 12.8c.5 0 .956.204 1.281.536.326.332.528.787.528 1.293v3.101l.375.106q.046.014.086.043c.092.069.222.172.39.297.132.105.275.232.445.363.34.273.744.627 1.188 1.031.118.102.235.208.34.313a27 27 0 0 1 1.824 1.847c.171.194.337.391.508.598.17.21.354.418.512.625.207.276.427.56.62.86.093.14.2.288.29.43.25.377.469.768.68 1.16.088.18.178.376.257.57a8.5 8.5 0 0 1 .54 1.59c.035.115.06.24.074.351v.027c.039.158.053.326.066.496a5.3 5.3 0 0 1-.094 1.641c-.05.234-.112.454-.191.688-.08.223-.16.455-.262.675-.197.457-.43.913-.707 1.34a8 8 0 0 1-.297.485c-.115.167-.234.326-.34.48a10 10 0 0 1-.457.59 6 6 0 0 1-.445.559c-.22.26-.428.505-.648.742a7 7 0 0 1-.418.453c-.142.158-.287.298-.418.43-.22.22-.404.393-.559.535l-.363.332a.3.3 0 0 1-.196.07h-2.8v3.594h3.527c.789 0 1.536-.28 2.14-.793.208-.181 1.112-.96 2.18-2.14a.3.3 0 0 1 .137-.083l9.734-2.816a.287.287 0 0 1 .364.277v2.059c0 .118-.07.223-.176.27-.644.275-2.852 1.29-3.77 2.566-2.34 3.258-4.127 7.918-8.125 7.918H24.14c-5.91 0-10.699-4.808-10.699-10.739v-.191c0-.158.128-.285.286-.285h9.296c.184 0 .318.17.301.351a3.17 3.17 0 0 0 .332 1.785 3.27 3.27 0 0 0 2.934 1.82h4.605v-3.593h-4.55a.294.294 0 0 1-.239-.46c.05-.077.105-.154.164-.243a33 33 0 0 0 1.657-2.645c.417-.73.822-1.506 1.148-2.289a5 5 0 0 0 .172-.43c.089-.25.18-.48.246-.714.066-.198.12-.404.172-.598a9.3 9.3 0 0 0 .219-2.098 10 10 0 0 0-.04-.87c-.013-.313-.05-.626-.09-.938a10 10 0 0 0-.128-.836 14 14 0 0 0-.266-1.25l-.035-.156c-.079-.286-.146-.562-.238-.848a32 32 0 0 0-.871-2.59c-.115-.325-.248-.637-.38-.949-.193-.47-.393-.896-.574-1.3a18 18 0 0 1-.25-.524 17 17 0 0 0-.269-.574c-.066-.142-.143-.271-.195-.403l-.563-1.039a.183.183 0 0 1 .207-.265l3.52.953h.008l.011.004.465.128.512.145.187.05v-2.09c0-1.008.805-1.827 1.805-1.827m-8.488 6.903a.28.28 0 0 1 .238.168c1.39 3.117 2.59 6.993 2.027 9.406-.24.993-.897 2.34-1.636 3.582q-.145.272-.313.528a.28.28 0 0 1-.234.125H16.03a.284.284 0 0 1-.242-.438l.137-.215 8.324-13.023a.28.28 0 0 1 .262-.133"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/patreon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_patreon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_patreon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("patreon", {
    "color": "#000000",
    "path": "M0 0h64v64H0Zm52.853 23.459c-.008-5.72-4.462-10.41-9.69-12.1-6.492-2.1-15.053-1.796-21.252 1.127-7.511 3.546-9.871 11.312-9.959 19.055-.07 6.369.564 23.139 10.022 23.259 7.03.088 8.077-8.969 11.328-13.33 2.314-3.104 5.294-3.979 8.96-4.886 6.303-1.562 10.6-6.536 10.591-13.125m0 0"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/pinterest.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_pinterest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_pinterest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("pinterest", {
    "color": "#cb2128",
    "path": "M0 0v64h64V0zm32 48c-1.6 0-3.1-.2-4.5-.7.6-1 1.3-2.2 1.6-3.4.2-.7 1.1-4.4 1.1-4.4.6 1.1 2.2 2 3.9 2 5.1 0 8.6-4.7 8.6-11 0-4.7-4-9.2-10.1-9.2-7.6 0-11.4 5.5-11.4 10 0 2.8 1 5.2 3.3 6.1.4.1.7 0 .8-.4.1-.3.2-1 .3-1.3.1-.4.1-.5-.2-.9-.6-.8-1.1-1.7-1.1-3.1 0-4 3-7.7 7.9-7.7 4.3 0 6.7 2.6 6.7 6.1 0 4.6-2 8.5-5.1 8.5-1.7 0-2.9-1.4-2.5-3.1.5-2 1.4-4.2 1.4-5.7 0-1.3-.7-2.4-2.2-2.4-1.7 0-3.1 1.8-3.1 4.1 0 1.5.5 2.5.5 2.5s-1.8 7.4-2.1 8.7c-.3 1.2-.3 2.6-.3 3.7C19.9 44.2 16 38.6 16 32c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/pixiv.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_pixiv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_pixiv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("pixiv", {
    "color": "#0097fa",
    "path": "M0 0v64h64V0zm33.553 16.469c-11.844 0-19.903 9.146-19.903 9.146l2.27 3.606s1.26.106.592-2.018c.573-1.086 1.698-2.545 3.892-4.232v24.008c-.946.268-2.194.768-1.34 1.623h6.518c.86-.861-.493-1.38-1.32-1.623v-5.663s4.469 1.756 9.29 1.756c4.234 0 8.088-1.26 10.954-3.537 2.869-2.264 4.712-5.642 4.703-9.506a12.75 12.75 0 0 0-4.41-9.709c-2.793-2.438-6.705-3.847-11.246-3.847zm-.397 2.027c3.601.003 6.425 1.36 8.338 3.43 1.907 2.075 2.948 4.83 2.957 8.04-.012 3.126-1.124 5.698-3.107 7.673-1.98 1.959-4.864 3.195-8.188 3.195h-.021c-3.699 0-6.816-.72-8.873-1.732V21.088c2.261-1.605 5.928-2.598 8.894-2.592"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/ravelry.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_ravelry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_ravelry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("ravelry", {
    "color": "#EE6E62",
    "path": "M0 0h64v64H0Zm42.692 28.943s-2.184-.397-3.752-.397c-3.584 0-4.424 1.987-4.424 4.939v12.488H24.83V20.542h9.687v4.257c1.176-3.576 3.528-4.825 8.176-4.825z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/rdio.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_rdio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_rdio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("rdio", {
    "color": "#0475C5",
    "path": "M0 0v64h64V0zm43.9 30.5c.1.5.1 1 .1 1.5 0 6.4-5.1 11.6-12 11.6s-12-5.1-12-11.5V32c0-6.4 5.1-11.6 12-11.6 1.2 0 2.3.2 3.4.5v6.8l-.6-.3c-3-1-6.2.4-7.7 2.9v.1c-1.5 2.5-.8 5.3 2.1 6.3 3 1 6.2-.4 7.7-2.9v-.1c.5-.8.8-1.7.8-2.6v-9.3c.2.1.3.2.5.3.1.1.3.2.4.2 1.5 1 5.4 3.5 8.7 3.4 1.7.1.2 3.8-3.4 4.8"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/sharethis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_sharethis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_sharethis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("sharethis", {
    "color": "#00BF00",
    "path": "M0 0h64v64H0zm28.388 32c0 .084-.02.163-.025.247l8.802 4.4a4.3 4.3 0 0 1 2.782-1.037 4.335 4.335 0 0 1 4.335 4.335 4.335 4.335 0 1 1-8.67 0c0-.086.02-.163.025-.247l-8.802-4.4a4.3 4.3 0 0 1-2.782 1.034 4.335 4.335 0 0 1 0-8.67c1.065 0 2.027.402 2.782 1.037l8.802-4.4c-.005-.083-.024-.162-.024-.249a4.333 4.333 0 0 1 4.334-4.332 4.335 4.335 0 0 1 0 8.67 4.28 4.28 0 0 1-2.782-1.04l-8.802 4.403c.005.084.024.163.024.25"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/rss.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_rss
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_rss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("rss", {
    "color": "#EF8733",
    "path": "M0 0v64h64V0zm24 44c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4m11-1c-1.1 0-2-.9-2-2 0-5.5-4.5-10-10-10-1.1 0-2-.9-2-2s.9-2 2-2c7.7 0 14 6.3 14 14 0 1.1-.9 2-2 2m9 0c-1.1 0-2-.9-2-2 0-10.5-8.5-19-19-19-1.1 0-2-.9-2-2s.9-2 2-2c12.7 0 23 10.3 23 23 0 1.1-.9 2-2 2"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/slack.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_slack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_slack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("slack", {
    "color": "#4A164A",
    "path": "M0 0v64h64V0Zm12.636 37.56c0 5.066 8 5.066 8 0v-3.8h-4c-2.209 0-4 1.7-4 3.8m25.28-6.346c2.21 0 4-1.702 4-3.8V17.287c0-5.066-8-5.066-8 0v10.127c0 2.113 1.815 3.82 4.04 3.8zm14.64-3.8c0-5.067-8-5.067-8 0v3.8h4c2.24.042 4.08-1.672 4.08-3.8zm-25.24 6.345c-2.209 0-4 1.702-4 3.8v10.127c0 5.067 8 5.067 8 0V37.559c0-2.098-1.79-3.8-4-3.8m10.64 10.127h-4v3.8c0 3.386 4.309 5.08 6.829 2.687s.735-6.487-2.829-6.487m10.68-10.127h-10.68c-5.324.009-5.324 7.592 0 7.6h10.68c5.325-.008 5.325-7.591 0-7.6m-21.32-10.145h-10.68c-5.342-.008-5.342 7.608 0 7.6h10.68c5.325-.009 5.325-7.592 0-7.6m0-10.127c-5.324.008-5.324 7.592 0 7.6h4v-3.8c0-2.126-1.804-3.8-4-3.8"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/reddit.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_reddit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_reddit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("reddit", {
    "color": "#FF4500",
    "path": "M0 0v64h64V0zm53.344 32a4.67 4.67 0 0 0-7.903-3.2 22.77 22.77 0 0 0-12.32-3.937L35.2 14.88l6.848 1.441a3.2 3.2 0 0 0 3.02 2.852 3.2 3.2 0 1 0-2.602-4.805l-7.84-1.566a1 1 0 0 0-.754.136.98.98 0 0 0-.43.63l-2.37 11.105a22.8 22.8 0 0 0-12.477 3.937 4.672 4.672 0 1 0-5.152 7.648q-.06.704 0 1.407c0 7.168 8.351 12.992 18.656 12.992 10.3 0 18.656-5.824 18.656-12.992a9.4 9.4 0 0 0 0-1.406A4.68 4.68 0 0 0 53.344 32m-32 3.2a3.198 3.198 0 1 1 6.398 0 3.195 3.195 0 0 1-3.199 3.198c-1.766 0-3.2-1.43-3.2-3.199M39.938 44a12.3 12.3 0 0 1-7.907 2.465A12.3 12.3 0 0 1 24.13 44a.87.87 0 0 1 .055-1.16.87.87 0 0 1 1.16-.055A10.48 10.48 0 0 0 32 44.801a10.5 10.5 0 0 0 6.688-1.953.9.9 0 0 1 1.265.015.9.9 0 0 1-.016 1.266Zm-.579-5.473a3.2 3.2 0 0 1-3.199-3.199 3.198 3.198 0 1 1 6.398 0 3.2 3.2 0 0 1-3.23 3.328Zm0 0"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/smugmug.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_smugmug
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_smugmug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("smugmug", {
    "color": "#8cca1e",
    "path": "M0 0v64h64V0zm36.1 19.8c.2-1.3 1.3-2.6 3.2-2.8 2.4-.2 3.8 1.3 3.8 2.8 0 1.3-1.2 2.6-3.8 2.8-2.4.1-3.4-1.3-3.2-2.8m-13.6.4c.2-1.4 1.4-2.8 3.3-2.8 2.3 0 3.5 1.1 3.6 2.4.2 1.5-1.1 3.1-3.9 3.1-2.4.1-3.2-1.3-3-2.7M28.8 47c-10.9 0-12-17.5-6.9-17.5 12.1-.3 12.5-.3 19-1C51.7 27.4 39.2 47 28.8 47m11.5-15.4c-3.9 0-6.8.5-17.8.9-1.6.1-2.9 11.4 6.6 11.4 7.5 0 15.2-12.3 11.2-12.3"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/snapchat.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_snapchat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_snapchat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("snapchat", {
    "color": "#FFC91B",
    "path": "M0 0v64h64V0zm47.927 39.545c-.326.76-1.702 1.318-4.21 1.707-.083.113-.17.511-.223.754a11 11 0 0 1-.183.743c-.104.357-.367.554-.74.554h-.037a4 4 0 0 1-.723-.089 8.5 8.5 0 0 0-1.706-.181c-.397 0-.809.034-1.222.103-.809.135-1.496.62-2.293 1.184-1.139.805-2.43 1.718-4.392 1.718-.088 0-.171-.003-.234-.006a2 2 0 0 1-.162.006c-1.962 0-3.253-.912-4.393-1.718-.796-.562-1.483-1.048-2.292-1.183a7.5 7.5 0 0 0-1.223-.103c-.716 0-1.288.112-1.706.193-.278.055-.519.102-.723.102-.505 0-.701-.308-.776-.565-.077-.262-.131-.51-.183-.751-.053-.244-.14-.644-.224-.758-2.507-.389-3.884-.948-4.21-1.711a.9.9 0 0 1-.071-.298.664.664 0 0 1 .555-.692c4.349-.716 6.308-5.181 6.389-5.371l.015-.032c.232-.471.284-.866.154-1.172-.251-.592-1.177-.885-1.789-1.08-.17-.054-.331-.105-.464-.157-1.482-.585-1.688-1.258-1.601-1.719.122-.64.903-1.07 1.555-1.07q.284 0 .507.104c.557.261 1.053.394 1.472.394.314 0 .513-.075.622-.136l-.048-.779c-.136-2.173-.307-4.877.403-6.469 2.111-4.732 6.585-5.1 7.905-5.1l.554-.005.078-.001h.001c1.324 0 5.807.368 7.919 5.103.711 1.593.54 4.299.403 6.474l-.006.092-.042.685c.099.055.272.121.537.134.4-.018.863-.149 1.379-.391.219-.103.454-.124.613-.124.232 0 .468.045.667.128l.002.001c.592.212.965.638.974 1.117.011.609-.533 1.135-1.617 1.564-.132.052-.293.103-.465.158-.612.194-1.538.488-1.788 1.079-.13.306-.079.701.154 1.172l.015.032c.081.189 2.038 4.654 6.389 5.371a.664.664 0 0 1 .555.691.9.9 0 0 1-.071.298"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/soundcloud.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_soundcloud
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_soundcloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("soundcloud", {
    "color": "#FF5700",
    "path": "M0 0v64h64V0zm18.5 36.3c0 .7-.6 1.2-1.2 1.2-.7 0-1.2-.6-1.2-1.2v-4.9c0-.6.6-1.1 1.2-1.1.7 0 1.2.5 1.2 1.1zm4.9 1.2c0 .7-.6 1.2-1.2 1.2s-1.2-.5-1.2-1.2V29c0-.6.6-1.1 1.2-1.1s1.2.5 1.2 1.1zm5 0c0 .7-.6 1.2-1.2 1.2-.7 0-1.2-.6-1.2-1.2V26.2c0-.6.6-1.1 1.2-1.1.7 0 1.2.5 1.2 1.1zm15.2 1.2H31.4c-.3 0-.5-.2-.5-.5V24.3c0-.3.1-.4.4-.5.9-.3 1.8-.5 2.8-.5 4 0 7.4 3.1 7.7 7.1.5-.2 1.1-.3 1.7-.3 2.4 0 4.4 2 4.4 4.4.1 2.3-1.9 4.2-4.3 4.2"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/spotify.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_spotify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_spotify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("spotify", {
    "color": "#2EBD59",
    "path": "M39 37.7c-4.2-2.6-9.4-3.2-15.5-1.8-.5.1-.9.7-.8 1.2s.7.9 1.2.7q8.4-1.95 14.1 1.5c.5.3 1.1.1 1.4-.3.2-.4.1-1-.4-1.3m1.9-4.7c-4.9-3-12.2-3.9-18-2.1-.7.2-1 .9-.8 1.6s.9 1 1.6.8c5.1-1.5 11.6-.8 15.9 1.9.6.4 1.4.2 1.7-.4.4-.7.2-1.4-.4-1.8M0 0v64h64V0zm32 48c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16m11-20.4c-5.9-3.5-15.3-3.9-21-2.1-.8.2-1.2 1.1-1 1.9s1.1 1.2 1.9 1c4.9-1.5 13.4-1.2 18.6 1.9.7.4 1.6.2 2.1-.5.3-.8.1-1.8-.6-2.2"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/squarespace.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_squarespace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_squarespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("squarespace", {
    "color": "#1C1C1C",
    "path": "M0 0v64h64V0zm39.6 21.1c.6.6.6 1.6 0 2.2s-1.6.6-2.2 0c-1.2-1.2-3.2-1.2-4.4 0l-9.8 9.8c-.6.6-1.6.6-2.2 0s-.6-1.6 0-2.2l9.8-9.8c2.5-2.4 6.4-2.4 8.8 0M17.8 36.4c-2.4-2.4-2.4-6.3 0-8.7l7.5-7.5c1.2-1.2 3.2-1.2 4.4 0L20 29.8c-1.2 1.2-1.2 3.2 0 4.4s3.2 1.2 4.4 0l9.8-9.8c.6-.6 1.6-.6 2.2 0s.6 1.6 0 2.2l-9.8 9.8c-2.5 2.4-6.4 2.4-8.8 0m6.6 6.5c-.6-.6-.6-1.6 0-2.2s1.6-.6 2.2 0c1.2 1.2 3.2 1.2 4.4 0l9.8-9.8c.6-.6 1.6-.6 2.2 0s.6 1.6 0 2.2l-9.8 9.8c-2.5 2.4-6.4 2.4-8.8 0m21.8-6.5-7.5 7.5c-1.2 1.2-3.2 1.2-4.4 0l9.6-9.6c1.2-1.2 1.2-3.2 0-4.4s-3.2-1.2-4.4 0l-9.8 9.8c-.6.6-1.6.6-2.2 0s-.6-1.6 0-2.2l9.8-9.8c2.4-2.4 6.3-2.4 8.7 0 2.6 2.3 2.6 6.3.2 8.7"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/substack.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_substack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_substack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("substack", {
    "color": "#ff6719",
    "path": "M0 0h64v64H0Zm20.098 18.477v3.195h23.805v-3.195zm0 6.075v3.24h23.805v-3.24zm0 6.075v14.895c.972-.28 1.95-1.042 2.835-1.536l5.94-3.317c.735-.411 1.472-.818 2.205-1.234.239-.136.644-.475.925-.47.278.005.681.346.919.482q1.03.588 2.07 1.157c2.094 1.149 4.162 2.343 6.256 3.492.809.445 1.754 1.221 2.655 1.426V30.627z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/t.me.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_t
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("t.me", {
    "color": "#49a9e9",
    "path": "M0 0v64h64V0zm11.887 33.477c3.73-2.055 7.894-3.77 11.785-5.497 6.695-2.824 13.414-5.597 20.203-8.18 1.324-.44 3.695-.87 3.93 1.087-.13 2.773-.653 5.527-1.012 8.281-.914 6.055-1.969 12.094-2.996 18.133-.356 2.008-2.875 3.05-4.488 1.761-3.871-2.613-7.778-5.207-11.598-7.882-1.254-1.274-.094-3.102 1.027-4.012 3.188-3.145 6.575-5.816 9.598-9.121.816-1.973-1.594-.313-2.39.2-4.368 3.007-8.63 6.202-13.235 8.847-2.352 1.297-5.094.187-7.445-.535-2.11-.871-5.2-1.75-3.38-3.082m0 0"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/stackoverflow.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_stackoverflow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_stackoverflow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("stackoverflow", {
    "color": "#ed803d",
    "path": "M64 0v64H0V0zM46.145 37.265H42.8v10.038H19.376V37.265H16.03V50.65h30.115zm-6.688 2.46L23.023 36.27l.69-3.287 16.435 3.456zm.964-4.234-15.224-7.09 1.418-3.045 15.224 7.09zm1.895-3.811L29.41 20.932l2.15-2.58 12.906 10.747zm-7.27-16.688 2.695-2.004 10.022 13.476-2.695 2.004zm4.407 28.965H22.722v-3.346h16.73z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/telegram.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_telegram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_telegram = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("telegram", {
    "color": "#49a9e9",
    "path": "M0 0v64h64V0zm11.887 33.477c3.73-2.055 7.894-3.77 11.785-5.497 6.695-2.824 13.414-5.597 20.203-8.18 1.324-.44 3.695-.87 3.93 1.087-.13 2.773-.653 5.527-1.012 8.281-.914 6.055-1.969 12.094-2.996 18.133-.356 2.008-2.875 3.05-4.488 1.761-3.871-2.613-7.778-5.207-11.598-7.882-1.254-1.274-.094-3.102 1.027-4.012 3.188-3.145 6.575-5.816 9.598-9.121.816-1.973-1.594-.313-2.39.2-4.368 3.007-8.63 6.202-13.235 8.847-2.352 1.297-5.094.187-7.445-.535-2.11-.871-5.2-1.75-3.38-3.082m0 0"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/threads.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_threads
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_threads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("threads", {
    "color": "#000000",
    "path": "M0 0v64h64V0zm32.28 15.75h.02c3.718.026 6.827.982 9.241 2.84 2.272 1.75 3.872 4.238 4.753 7.404l-2.763.771c-1.495-5.362-5.278-8.102-11.245-8.145-3.94.03-6.918 1.267-8.855 3.678-1.81 2.259-2.747 5.523-2.783 9.702.036 4.18.971 7.443 2.785 9.702 1.937 2.415 4.918 3.652 8.857 3.678 3.552-.026 5.902-.855 7.855-2.77 2.23-2.184 2.19-4.864 1.476-6.496-.42-.962-1.184-1.76-2.214-2.368-.26 1.83-.843 3.311-1.74 4.43-1.199 1.49-2.898 2.306-5.05 2.423-1.628.088-3.198-.295-4.414-1.085-1.44-.933-2.28-2.355-2.372-4.013-.088-1.612.553-3.094 1.801-4.173 1.193-1.03 2.87-1.636 4.852-1.75 1.46-.081 2.827-.016 4.088.192-.169-1.004-.506-1.803-1.013-2.378-.696-.793-1.77-1.196-3.194-1.206h-.04c-1.144 0-2.697.315-3.685 1.787l-2.379-1.595c1.326-1.97 3.477-3.056 6.064-3.056h.058c4.326.026 6.904 2.676 7.16 7.297q.22.093.435.19c2.018.95 3.494 2.387 4.271 4.159 1.079 2.466 1.18 6.486-2.097 9.694-2.505 2.45-5.543 3.559-9.852 3.588h-.02c-4.85-.033-8.577-1.63-11.083-4.75-2.226-2.78-3.377-6.644-3.416-11.486v-.024c.04-4.846 1.19-8.706 3.42-11.485 2.502-3.123 6.233-4.722 11.079-4.755m1.368 16.669q-.49 0-1.001.03c-2.487.14-4.038 1.28-3.95 2.901.091 1.7 1.967 2.49 3.771 2.393 1.658-.088 3.816-.735 4.18-5.025-.917-.198-1.92-.3-3-.3"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/tiktok.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_tiktok
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_tiktok = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("tiktok", {
    "color": "#000000",
    "path": "M0 0v64h64V0zm32.781 16h5.494c-.008 0-.064.526.075 1.34h-.008c.166.98.617 2.381 1.824 3.762a8.857 8.858 0 0 0 1.617 1.375 7 7 0 0 0 .631.367c1.405.7 2.777.913 3.453.84v5.457s-1.93-.081-3.361-.461c-1.996-.534-3.276-1.354-3.276-1.354s-.888-.587-.955-.627v11.274c0 .626-.164 2.194-.662 3.502a10.6 10.6 0 0 1-1.843 3.062s-1.227 1.52-3.381 2.541c-1.943.92-3.652.9-4.162.92 0 0-2.951.119-5.612-1.69l-.013-.013v.014a11.2 11.2 0 0 1-2.381-2.246c-.842-1.074-1.36-2.348-1.492-2.721v-.014c-.212-.634-.657-2.168-.59-3.648.106-2.609.983-4.216 1.215-4.616a10.8 10.8 0 0 1 2.351-2.902 10.2 10.2 0 0 1 7.867-2.3l-.006 5.595a4.6 4.6 0 0 0-1.427-.227c-2.56 0-4.637 2.09-4.637 4.668s2.076 4.666 4.637 4.666a4.6 4.6 0 0 0 2.273-.6 4.67 4.67 0 0 0 2.348-3.704v-.012a.2.2 0 0 0 .004-.047q.005-.054.006-.103c.012-.279.011-.563.011-.848z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/tumblr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_tumblr
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_tumblr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("tumblr", {
    "color": "#2c4762",
    "path": "M0 0v64h64V0zm35.4 47c-6.5.1-9-4.7-9-8v-9.8h-3v-3.9c4.6-1.6 5.6-5.7 5.9-8.1 0-.2.1-.2.2-.2h4.4v7.6h6v4.5h-6v9.3c0 1.3.5 3 2.9 3 .8 0 1.9-.3 2.4-.5l1.4 4.3c-.5.8-3 1.8-5.2 1.8"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/upwork.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_upwork
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_upwork = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("upwork", {
    "color": "#3da800",
    "path": "M0 0h64v64H0Zm24.938 17.111h5.6c1.1 3.8 3.099 8.2 5.599 12.1 1.6-5.5 5.6-9 10.9-9 6.1 0 11.1 5.002 11.1 11.102 0 6.4-5 11.398-11.1 11.398-3 0-5.5-.8-7.7-2.2l-2.4 11.901h-5.7l3.5-16.3c-1.5-2.1-2.9-4.5-4-6.7v2.5c0 6.1-4.9 11-10.9 11s-10.9-4.9-10.9-11V17.211h5.4v14.602c0 2.9 2.4 5.298 5.3 5.298s5.3-2.398 5.3-5.298zm22.199 8.801c-4.1 0-5.4 4-5.8 6.4v.1l-.6 2.2c1.8 1.5 4.1 2.5 6.3 2.5 2.9 0 5.6-2.5 5.7-5.6 0-3.1-2.5-5.6-5.6-5.6"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/twitch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_twitch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_twitch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("twitch", {
    "color": "#6441A5",
    "path": "M0 0v64h64V0zm47 35.8-7.6 7.6h-5.7l-3.8 3.8H26v-3.8h-7V23.1l1.9-5.1H47zm-17.8 7L33 39h7l4.5-4.5v-14h-21V39h5.7zm8.3-17.2H40v7.6h-2.5zm-7 0H33v7.6h-2.5z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/twitter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_twitter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_twitter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("twitter", {
    "color": "#00aced",
    "path": "M0 0v64h64V0zm44.7 25.5v.8C44.7 35 38.1 45 26.1 45c-3.7 0-7.2-1.1-10.1-2.9.5.1 1 .1 1.6.1 3.1 0 5.9-1 8.2-2.8-2.9-.1-5.3-2-6.1-4.6.4.1.8.1 1.2.1.6 0 1.2-.1 1.7-.2-3-.6-5.3-3.3-5.3-6.4v-.1c.9.5 1.9.8 3 .8-1.8-1.2-2.9-3.2-2.9-5.5q0-1.8.9-3.3c3.2 4 8.1 6.6 13.5 6.9-.1-.5-.2-1-.2-1.5 0-3.6 2.9-6.6 6.6-6.6 1.9 0 3.6.8 4.8 2.1 1.5-.3 2.9-.8 4.2-1.6-.5 1.5-1.5 2.8-2.9 3.6 1.3-.2 2.6-.5 3.8-1-1 1.3-2.1 2.4-3.4 3.4"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/vevo.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_vevo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_vevo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("vevo", {
    "color": "#ED1A3B",
    "path": "M0 0v64h64V0zm34.2 41.9c-1.4 2.1-2.9 3.1-5 3.1 0 0-3 .2-4.1-3.4L20 21h8.1l3 12.3c1.4-2.1 5.1-7.7 5.1-7.7 1.4-1.9 2.2-4.6 6.8-4.6h5z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/vimeo.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_vimeo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_vimeo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("vimeo", {
    "color": "#1ab7ea",
    "path": "M0 0v64h64V0zm40.9 37c-4.1 5.3-7.5 8-10.4 8-1.7 0-3.2-1.6-4.4-4.8-.8-3-1.6-5.9-2.4-8.9-.9-3.2-1.9-4.8-2.9-4.8-.2 0-1 .5-2.4 1.4L17 26c1.5-1.3 2.9-2.6 4.4-3.9 2-1.7 3.5-2.6 4.4-2.7 2.3-.2 3.8 1.4 4.3 4.8q.9 5.55 1.2 6.9c.7 3.1 1.4 4.6 2.2 4.6.6 0 1.6-1 2.8-3 1.3-2 1.9-3.5 2-4.5.2-1.7-.5-2.6-2-2.6-.7 0-1.5.2-2.2.5 1.5-4.8 4.3-7.2 8.4-7 3.1.1 4.5 2.1 4.4 6 0 2.8-2.1 6.8-6 11.9"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/vk.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_vk
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_vk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("vk", {
    "color": "#45668e",
    "path": "M0 0v64h64V0zm44.94 44.84h-.2c-2.17-.36-3.66-1.92-4.92-3.37-.72-.81-1.82-2.66-3.12-2.47-1.85.3-.93 3.52-1.71 4.9-.62 1.11-3.29.91-5.12.71-5.79-.62-8.75-3.77-11.35-7.14A64 64 0 0 1 11.6 26a10.6 10.6 0 0 1-1.51-4.49c.91-.81 2.47-.51 4.02-.51 1.31 0 3.36-.29 4.32.2.57.26 1.14 1.8 1.57 2.8a37 37 0 0 0 3.31 5.82c.56.81 1.41 2.35 2.41 2.14s1.06-2.63 1.1-4.18c0-1.77 0-4-.5-4.9S25 22 24.15 21.47c.73-1.49 2.72-1.63 5.12-1.63 2 0 4.84-.23 5.62 1.12s.25 3.85.2 5.71c-.06 2.09-.41 4.25 1 5.21 1.09-.12 1.68-1.2 2.31-2A28 28 0 0 0 41.72 24c.44-1 .91-2.65 1.71-3 1.21-.47 3.15-.1 4.92-.1 1.46 0 4.05-.41 4.52.61.39.85-.75 3-1.1 3.57a62 62 0 0 1-4.12 5.61c-.58.78-1.78 2-1.71 3.27.05.94 1 1.67 1.71 2.35a33 33 0 0 1 3.92 4.18c.47.62 1.5 2 1.4 2.76-.31 2.56-6.09.99-8.03 1.59"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/vsco.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_vsco
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_vsco = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("vsco", {
    "color": "#83878A",
    "path": "M0 0v64h64V0zm18.5 34.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5S21 30.6 21 32c-.1 1.4-1.2 2.5-2.5 2.5m6.6 6.6c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5m.1-13.4c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5M32 48c-1.4 0-2.5-1.1-2.5-2.5S30.6 43 32 43s2.5 1.1 2.5 2.5S33.4 48 32 48m-2.5-16.1c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5m2.5-11c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5m6.7 1.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5m.1 18.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5c-.1 1.4-1.2 2.5-2.5 2.5m6.7-6.7c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5S48 30.6 48 32s-1.1 2.5-2.5 2.5"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/vine.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_vine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_vine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("vine", {
    "color": "#00BF8F",
    "path": "M0 0v64h64V0zm38.4 21.5c-1.2 0-2.1 1.2-2.1 3.4 0 4.6 2.9 7.2 6.7 7.2.7 0 1.4-.1 2.2-.3v3.6c-1.3.3-2.5.4-3.6.4-2.5 5.3-7 9.8-8.6 10.7-1 .5-1.9.6-2.9-.1-1.9-1.1-8.9-6.9-11.2-25H24c1.3 10.9 4.4 16.5 7.9 20.7 1.9-1.9 3.7-4.4 5.2-7.3-3.4-1.7-5.5-5.5-5.5-10s2.6-7.9 7-7.9c4.3 0 6.6 2.7 6.6 7.3 0 1.7-.4 3.7-1 5.2-3.2.6-4.4-1.4-4.4-1.4.2-.8.6-2.1.6-3.3-.1-2.1-.9-3.2-2-3.2"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/wechat.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_wechat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_wechat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("wechat", {
    "color": "#00c80f",
    "path": "M65.6 65.6H-1.6V-1.6h67.2zM49.738 46.043c2.846-2.061 4.662-5.107 4.662-8.498 0-6.207-6.043-11.244-13.492-11.244-7.453 0-13.494 5.037-13.494 11.244 0 6.213 6.041 11.246 13.494 11.246 1.537 0 3.025-.221 4.402-.615l.395-.059c.262 0 .498.078.717.207l2.955 1.707.26.082a.45.45 0 0 0 .451-.449l-.074-.328-.605-2.271-.047-.287a.9.9 0 0 1 .376-.735M25.793 13.887C16.85 13.887 9.6 19.93 9.6 27.383c0 4.066 2.182 7.723 5.596 10.197.275.195.453.518.453.879l-.055.344-.732 2.725-.086.393c0 .301.24.541.539.541l.311-.1 3.545-2.049c.27-.152.551-.248.861-.248l.475.068a19 19 0 0 0 5.287.742l.891-.021a10.3 10.3 0 0 1-.543-3.309c0-6.793 6.611-12.305 14.768-12.305l.879.021c-1.225-6.443-7.918-11.374-15.996-11.374m10.615 21.859a1.798 1.798 0 1 1-.001-3.6 1.798 1.798 0 0 1 .001 3.6m8.996 0a1.798 1.798 0 1 1-.001-3.6 1.798 1.798 0 0 1 .001 3.6M20.395 25.221a2.16 2.16 0 1 1 .002-4.318 2.16 2.16 0 0 1-.002 4.318m10.796 0c-1.193 0-2.158-.965-2.158-2.158s.965-2.158 2.158-2.158 2.158.965 2.158 2.158-.964 2.158-2.158 2.158"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/wa.me.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_wa
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_wa = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("wa.me", {
    "color": "#25D366",
    "path": "M0 0v64h64V0zm48 31.59c0 8.605-7.031 15.586-15.71 15.586-2.755 0-5.34-.703-7.595-1.942L16 48l2.836-8.363a15.43 15.43 0 0 1-2.254-8.047c0-8.61 7.031-15.59 15.707-15.59C40.97 16 48 22.98 48 31.59M32.29 18.484c-7.282 0-13.208 5.88-13.208 13.106 0 2.867.938 5.52 2.516 7.68l-1.649 4.867 5.074-1.61a13.2 13.2 0 0 0 7.27 2.164c7.281 0 13.207-5.875 13.207-13.101s-5.926-13.106-13.21-13.106m7.933 16.696c-.098-.16-.352-.258-.739-.45-.382-.187-2.277-1.113-2.629-1.242-.355-.125-.613-.191-.867.192-.258.383-.996 1.242-1.218 1.5-.227.254-.45.285-.836.093-.387-.191-1.625-.593-3.098-1.894-1.145-1.012-1.918-2.262-2.14-2.645-.223-.382-.024-.59.167-.78.176-.173.387-.446.578-.669.196-.223.258-.383.387-.637.129-.257.063-.48-.035-.671-.094-.192-.867-2.07-1.188-2.836s-.64-.637-.863-.637c-.226 0-.484-.031-.738-.031a1.4 1.4 0 0 0-1.027.476c-.356.383-1.348 1.309-1.348 3.188s1.379 3.695 1.57 3.949c.196.258 2.664 4.238 6.578 5.77 3.914 1.53 3.914 1.019 4.621.956.707-.066 2.278-.925 2.602-1.816.32-.894.32-1.66.223-1.816m0 0"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/whatsapp.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_whatsapp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_whatsapp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("whatsapp", {
    "color": "#25D366",
    "path": "M0 0v64h64V0zm48 31.59c0 8.605-7.031 15.586-15.71 15.586-2.755 0-5.34-.703-7.595-1.942L16 48l2.836-8.363a15.43 15.43 0 0 1-2.254-8.047c0-8.61 7.031-15.59 15.707-15.59C40.97 16 48 22.98 48 31.59M32.29 18.484c-7.282 0-13.208 5.88-13.208 13.106 0 2.867.938 5.52 2.516 7.68l-1.649 4.867 5.074-1.61a13.2 13.2 0 0 0 7.27 2.164c7.281 0 13.207-5.875 13.207-13.101s-5.926-13.106-13.21-13.106m7.933 16.696c-.098-.16-.352-.258-.739-.45-.382-.187-2.277-1.113-2.629-1.242-.355-.125-.613-.191-.867.192-.258.383-.996 1.242-1.218 1.5-.227.254-.45.285-.836.093-.387-.191-1.625-.593-3.098-1.894-1.145-1.012-1.918-2.262-2.14-2.645-.223-.382-.024-.59.167-.78.176-.173.387-.446.578-.669.196-.223.258-.383.387-.637.129-.257.063-.48-.035-.671-.094-.192-.867-2.07-1.188-2.836s-.64-.637-.863-.637c-.226 0-.484-.031-.738-.031a1.4 1.4 0 0 0-1.027.476c-.356.383-1.348 1.309-1.348 3.188s1.379 3.695 1.57 3.949c.196.258 2.664 4.238 6.578 5.77 3.914 1.53 3.914 1.019 4.621.956.707-.066 2.278-.925 2.602-1.816.32-.894.32-1.66.223-1.816m0 0"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_x
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("x", {
    "color": "#000000",
    "path": "M0 0v64h64V0zm16 17.537h10.125l6.992 9.242 8.084-9.242h4.908L35.39 29.79 48 46.463h-9.875l-7.734-10.111-8.85 10.11h-4.908l11.465-13.105zm5.73 2.783 17.75 23.205h2.72L24.647 20.32z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/xiaohongshu.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_xiaohongshu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_xiaohongshu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("xiaohongshu", {
    "color": "#ff2741",
    "path": "M8.494-.006h47.784c4.552 0 8.596 3.953 8.715 8.5V56.28a8.91 8.91 90 0 1-8.717 8.702H8.509A8.92 8.92 90 0 1 .004 56.26V8.514C.114 4.038 4.018.12 8.494-.006m4.247 23.213c-.033 5.045-.016 10.092-.041 15.138a.533.533 90 0 1-.54.66c-.607.036-1.217.015-1.826.02a61 61 0 0 0 1.307 2.978c1.148-.038 2.458.201 3.438-.55.88-.656 1.162-1.82 1.145-2.87 0-5.125 0-10.253-.023-15.378a263 263 0 0 0-3.46.002m14.236-.228q-1.29 2.963-2.63 5.9c-.254.586-.56 1.363-.028 1.893.683.62 1.686.381 2.524.437-.581 1.467-1.346 2.861-1.836 4.364-.271.741.407 1.495 1.148 1.503 1.343.091 2.69 0 4.036.035.44-.982.881-1.962 1.313-2.95-.785 0-1.577.056-2.348-.099.835-2.096 1.825-4.125 2.71-6.196-1.083-.127-2.31.226-3.3-.196.483-1.625 1.361-3.115 1.98-4.696-1.192-.005-2.38-.013-3.568.005zm18.469.013v1.322h-2.33v3.536c.779 0 1.556 0 2.332.016q.03 1.523 0 3.066c-1.167.023-2.338 0-3.506.018a149 149 0 0 0 0 3.529c1.17.013 2.344 0 3.514 0v7.512h3.516v-7.507c1.711 0 3.42-.025 5.13 0 .602-.05 1.29.37 1.27 1.033a28 28 90 0 1 0 2.813.574.574 90 0 1-.538.607c-.978.07-1.958 0-2.938.033.432 1.015.85 2.03 1.34 3.033 1.613-.083 3.583.323 4.812-1.015 1.167-1.082.817-2.793.865-4.204-.073-1.485.29-3.163-.632-4.463-.784-1.102-2.198-1.401-3.473-1.424-.076-1.777.348-3.856-.96-5.3-1.218-1.367-3.18-1.372-4.866-1.306v-1.32c-1.193.013-2.366.015-3.536.02zM32.9 24.317v3.534h2.206v10.596c-1.053.018-2.11 0-3.163.013a315 315 0 0 0-1.61 3.528c3.93.016 7.87 0 11.79 0V38.46c-1.13 0-2.262 0-3.392-.013V27.843h2.214v-3.536c-2.676.005-5.36 0-8.045.01m23.19.325c-.985.746-.662 2.112-.705 3.175.657 0 1.317.036 1.975-.022 1.056-.097 1.85-1.328 1.426-2.323-.332-1.092-1.807-1.567-2.696-.83M6.86 27.848c-.178 2.315-.358 4.628-.526 6.943a5.6 5.6 90 0 1-.335 1.539 156 156 0 0 0 1.823 4.061c1.421-1.901 1.95-4.298 2.097-6.625.124-1.98.345-3.958.416-5.94-1.165.04-2.323.012-3.476.022m11.71 0 .508 6.44c.185 2.153.741 4.347 2.056 6.093a172 172 0 0 0 1.82-4.062 5.5 5.5 90 0 1-.355-1.546c-.167-2.307-.35-4.615-.528-6.923q-1.757-.01-3.508-.002zm4.357 13.884c1.797.53 3.7.167 5.546.266a295 295 0 0 0 1.612-3.536c-1.845-.071-3.724.193-5.534-.272q-.83 1.765-1.632 3.542zM48.94 27.86c.762.109 1.777-.31 2.359.304.096.927.025 1.859.035 2.793h-2.37q-.024-1.549-.024-3.097"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/yandex.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_yandex
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_yandex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("yandex", {
    "color": "#fc3f1d",
    "path": "M0 0v64h64V0Zm18.656 16h5.91l7.248 15.793c2.124 4.604 3.05 6.998 3.05 12.293V48H29.46v-3.223c0-4.374-.507-6.539-2.262-10.314zm21.008 0h5.68L38.51 31.47h-5.586z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/xing.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_xing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_xing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("xing", {
    "color": "#0698A0",
    "path": "M1.008 0C.45 0 0 .45 0 1.01v62.11c0 .56.45 1.01 1.008 1.01h62.02c.56 0 1.009-.45 1.009-1.01V1.01c0-.56-.45-1.01-1.009-1.01ZM41.72 16.032h5.482c.327 0 .585.106.723.296.143.197.139.459-.012.714L35.898 35.145a.025.025 0 0 0 0 .032l7.65 11.91c.152.257.156.517.012.715-.138.19-.394.295-.721.295h-5.42c-.83 0-1.247-.47-1.516-.88l-7.71-12.056c.386-.58 12.074-18.248 12.074-18.248.291-.446.642-.88 1.452-.88m-22.794 6.334h5.425c.832 0 1.24.456 1.51.867l3.731 5.544-5.857 8.828c-.277.427-.668.893-1.48.893h-5.426c-.326 0-.571-.125-.71-.315-.142-.198-.15-.453 0-.709l5.766-8.672c.006-.01.006-.015 0-.025l-3.668-5.413c-.152-.258-.175-.513-.032-.71.138-.192.414-.288.74-.288"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/yelp.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_yelp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_yelp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("yelp", {
    "color": "#B90C04",
    "path": "M0 0v64h64V0zm22.4 37.9q-.6 0-.9-.6c-.1-.3-.2-.7-.3-1.3-.2-1.7 0-4.2.5-5 .2-.4.6-.6 1-.6.3 0 .5.1 5.5 2.1l1.5.6c.5.2.9.7.8 1.4 0 .6-.4 1.1-.9 1.2l-2.1.7c-4.7 1.5-4.8 1.5-5.1 1.5M33 41c0 4.9 0 5-.1 5.3-.1.4-.4.6-.9.7-1.2.2-5.1-1.2-6-2.2q-.3-.3-.3-.6c0-.2 0-.3.1-.4.1-.2.2-.4 3.7-4.5l1-1.2c.3-.4 1-.6 1.5-.4.6.2.9.7.9 1.2.1-.1.1 2.1.1 2.1m-.8-10.2c-.3.1-1 .3-2-1.2 0 0-6.4-10.1-6.5-10.4s0-.7.3-1.1c1-1 6.1-2.4 7.5-2.1.4.1.7.4.9.8.1.4.7 9.8.8 11.9 0 1.8-.8 2-1 2.1m3.2.5 1.3-1.8c2.8-3.9 3-4.1 3.2-4.2.3-.2.7-.2 1.1 0 1.1.5 3.4 3.9 3.5 5.2 0 .4-.1.8-.5 1-.2.1-.4.2-5.7 1.5-.8.2-1.3.3-1.6.4-.5.1-1.1-.1-1.4-.6-.2-.5-.2-1.1.1-1.5m9.3 8.3c-.2 1.3-2.7 4.5-3.9 5-.4.2-.8.1-1.1-.1-.2-.2-.4-.5-3.2-5l-.8-1.3c-.3-.5-.3-1.1.1-1.6s.9-.6 1.4-.5l2.1.7c4.6 1.5 4.8 1.6 5 1.7.4.3.5.7.4 1.1"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/icons/youtube.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>_socialIcons_youtube
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var _socialIcons_youtube = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])("youtube", {
    "color": "#ff3333",
    "path": "M0 0v64h64V0zm47 33.1c0 2.4-.3 4.9-.3 4.9s-.3 2.1-1.2 3c-1.1 1.2-2.4 1.2-3 1.3-4.2.2-10.5.3-10.5.3s-7.8-.1-10.2-.3c-.7-.1-2.2-.1-3.3-1.3-.9-.9-1.2-3-1.2-3s-.3-2.4-.3-4.9v-2.3c0-2.4.3-4.9.3-4.9s.3-2.1 1.2-3c1.1-1.2 2.4-1.2 3-1.3 4.2-.3 10.5-.3 10.5-.3s6.3 0 10.5.3c.6.1 1.9.1 3 1.3.9.9 1.2 3 1.2 3s.3 2.4.3 4.9zm-18.1 2.8 8.1-4.2-8.1-4.2z"
});
;
}),
"[project]/esports/node_modules/react-social-icons/dist/react-social-icons.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$auth0$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/auth0.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$bandsintown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/bandsintown.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$behance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/behance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$bsky$2e$app$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/bsky.app.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$codepen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/codepen.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$clubhouse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/clubhouse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$developer$2e$mozilla$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/developer.mozilla.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$dev$2e$to$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/dev.to.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$discord$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/discord.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$dribbble$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/dribbble.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$dropbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/dropbox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$email$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/email.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/facebook.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$fivehundredpix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/fivehundredpix.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$flickr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/flickr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$foursquare$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/foursquare.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$gitlab$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/gitlab.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$github$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/github.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$google$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/google.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$groupme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/groupme.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$google_play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/google_play.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$hashnode$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/hashnode.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$instagram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/instagram.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$itch$2e$io$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/itch.io.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$leetcode$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/leetcode.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$line$2e$me$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/line.me.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$itunes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/itunes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/linkedin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$linktree$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/linktree.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$mailto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/mailto.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$mastodon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/mastodon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/matrix.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$medium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/medium.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$meetup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/meetup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$misskey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/misskey.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$onlyfans$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/onlyfans.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$opensea$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/opensea.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$patreon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/patreon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$pinterest$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/pinterest.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$pixiv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/pixiv.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$ravelry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/ravelry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$rdio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/rdio.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$sharethis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/sharethis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$rss$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/rss.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$slack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/slack.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$reddit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/reddit.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$smugmug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/smugmug.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$snapchat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/snapchat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$soundcloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/soundcloud.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$spotify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/spotify.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$squarespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/squarespace.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$substack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/substack.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$t$2e$me$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/t.me.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$stackoverflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/stackoverflow.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$telegram$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/telegram.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$threads$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/threads.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$tiktok$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/tiktok.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$tumblr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/tumblr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$upwork$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/upwork.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$twitch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/twitch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/twitter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$vevo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/vevo.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$vimeo$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/vimeo.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$vk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/vk.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$vsco$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/vsco.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$vine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/vine.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$wechat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/wechat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$wa$2e$me$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/wa.me.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$whatsapp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/whatsapp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/x.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$xiaohongshu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/xiaohongshu.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$yandex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/yandex.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$xing$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/xing.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$yelp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/yelp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$icons$2f$youtube$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/icons/youtube.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$react$2d$social$2d$icons$2f$dist$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/react-social-icons/dist/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/esports/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/primitive.tsx
__turbopack_context__.s([
    "Primitive",
    ()=>Primitive,
    "Root",
    ()=>Root,
    "dispatchDiscreteCustomEvent",
    ()=>dispatchDiscreteCustomEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
;
var NODES = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
];
var Primitive = NODES.reduce((primitive, node)=>{
    const Slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSlot"])("Primitive.".concat(node));
    const Node = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { asChild, ...primitiveProps } = props;
        const Comp = asChild ? Slot : node;
        if (typeof window !== "undefined") {
            window[Symbol.for("radix-ui")] = true;
        }
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Comp, {
            ...primitiveProps,
            ref: forwardedRef
        });
    });
    Node.displayName = "Primitive.".concat(node);
    return {
        ...primitive,
        [node]: Node
    };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
    if (target) __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"](()=>target.dispatchEvent(event));
}
var Root = Primitive;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/esports/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/separator.tsx
__turbopack_context__.s([
    "Root",
    ()=>Root,
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/esports/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = [
    "horizontal",
    "vertical"
];
var Separator = __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
    const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
    const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
    const ariaOrientation = orientation === "vertical" ? orientation : void 0;
    const semanticProps = decorative ? {
        role: "none"
    } : {
        "aria-orientation": ariaOrientation,
        role: "separator"
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$esports$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        "data-orientation": orientation,
        ...semanticProps,
        ...domProps,
        ref: forwardedRef
    });
});
Separator.displayName = NAME;
function isValidOrientation(orientation) {
    return ORIENTATIONS.includes(orientation);
}
var Root = Separator;
;
 //# sourceMappingURL=index.mjs.map
}),
]);

//# sourceMappingURL=96830_1e30f7a6._.js.map