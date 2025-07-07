import { g as getAugmentedNamespace, a as getDefaultExportFromCjs } from "./vendor-CeNkgTM-.js";
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p$1) => Promise.resolve(p$1).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const resolveFetch$3 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => __vitePreload(async () => {
      const { default: fetch2 } = await Promise.resolve().then(() => browser);
      return { default: fetch2 };
    }, true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
class FunctionsError extends Error {
  constructor(message, name = "FunctionsError", context) {
    super(message);
    this.name = name;
    this.context = context;
  }
}
class FunctionsFetchError extends FunctionsError {
  constructor(context) {
    super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
  }
}
class FunctionsRelayError extends FunctionsError {
  constructor(context) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
  }
}
class FunctionsHttpError extends FunctionsError {
  constructor(context) {
    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
  }
}
var FunctionRegion;
(function(FunctionRegion2) {
  FunctionRegion2["Any"] = "any";
  FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
  FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
  FunctionRegion2["ApSouth1"] = "ap-south-1";
  FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
  FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
  FunctionRegion2["CaCentral1"] = "ca-central-1";
  FunctionRegion2["EuCentral1"] = "eu-central-1";
  FunctionRegion2["EuWest1"] = "eu-west-1";
  FunctionRegion2["EuWest2"] = "eu-west-2";
  FunctionRegion2["EuWest3"] = "eu-west-3";
  FunctionRegion2["SaEast1"] = "sa-east-1";
  FunctionRegion2["UsEast1"] = "us-east-1";
  FunctionRegion2["UsWest1"] = "us-west-1";
  FunctionRegion2["UsWest2"] = "us-west-2";
})(FunctionRegion || (FunctionRegion = {}));
var __awaiter$7 = function(thisArg, _arguments, P, generator) {
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
};
class FunctionsClient {
  constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
    this.url = url;
    this.headers = headers;
    this.region = region;
    this.fetch = resolveFetch$3(customFetch);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   */
  invoke(functionName, options = {}) {
    var _a;
    return __awaiter$7(this, void 0, void 0, function* () {
      try {
        const { headers, method, body: functionArgs } = options;
        let _headers = {};
        let { region } = options;
        if (!region) {
          region = this.region;
        }
        const url = new URL(`${this.url}/${functionName}`);
        if (region && region !== "any") {
          _headers["x-region"] = region;
          url.searchParams.set("forceFunctionRegion", region);
        }
        let body;
        if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
          if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
            _headers["Content-Type"] = "application/octet-stream";
            body = functionArgs;
          } else if (typeof functionArgs === "string") {
            _headers["Content-Type"] = "text/plain";
            body = functionArgs;
          } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
            body = functionArgs;
          } else {
            _headers["Content-Type"] = "application/json";
            body = JSON.stringify(functionArgs);
          }
        }
        const response = yield this.fetch(url.toString(), {
          method: method || "POST",
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
          body
        }).catch((fetchError) => {
          throw new FunctionsFetchError(fetchError);
        });
        const isRelayError = response.headers.get("x-relay-error");
        if (isRelayError && isRelayError === "true") {
          throw new FunctionsRelayError(response);
        }
        if (!response.ok) {
          throw new FunctionsHttpError(response);
        }
        let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
        let data;
        if (responseType === "application/json") {
          data = yield response.json();
        } else if (responseType === "application/octet-stream") {
          data = yield response.blob();
        } else if (responseType === "text/event-stream") {
          data = response;
        } else if (responseType === "multipart/form-data") {
          data = yield response.formData();
        } else {
          data = yield response.text();
        }
        return { data, error: null, response };
      } catch (error) {
        return {
          data: null,
          error,
          response: error instanceof FunctionsHttpError || error instanceof FunctionsRelayError ? error.context : void 0
        };
      }
    });
  }
}
var cjs = {};
var PostgrestClient$1 = {};
var PostgrestQueryBuilder$1 = {};
var PostgrestFilterBuilder$1 = {};
var PostgrestTransformBuilder$1 = {};
var PostgrestBuilder$1 = {};
var getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
};
var globalObject = getGlobal();
const fetch$1 = globalObject.fetch;
const nodeFetch = globalObject.fetch.bind(globalObject);
const Headers$1 = globalObject.Headers;
const Request = globalObject.Request;
const Response$1 = globalObject.Response;
const browser = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Headers: Headers$1,
  Request,
  Response: Response$1,
  default: nodeFetch,
  fetch: fetch$1
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(browser);
var PostgrestError$1 = {};
var hasRequiredPostgrestError;
function requirePostgrestError() {
  if (hasRequiredPostgrestError) return PostgrestError$1;
  hasRequiredPostgrestError = 1;
  Object.defineProperty(PostgrestError$1, "__esModule", { value: true });
  class PostgrestError2 extends Error {
    constructor(context) {
      super(context.message);
      this.name = "PostgrestError";
      this.details = context.details;
      this.hint = context.hint;
      this.code = context.code;
    }
  }
  PostgrestError$1.default = PostgrestError2;
  return PostgrestError$1;
}
var hasRequiredPostgrestBuilder;
function requirePostgrestBuilder() {
  if (hasRequiredPostgrestBuilder) return PostgrestBuilder$1;
  hasRequiredPostgrestBuilder = 1;
  var __importDefault = PostgrestBuilder$1 && PostgrestBuilder$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(PostgrestBuilder$1, "__esModule", { value: true });
  const node_fetch_1 = __importDefault(require$$0);
  const PostgrestError_1 = __importDefault(requirePostgrestError());
  class PostgrestBuilder2 {
    constructor(builder) {
      this.shouldThrowOnError = false;
      this.method = builder.method;
      this.url = builder.url;
      this.headers = builder.headers;
      this.schema = builder.schema;
      this.body = builder.body;
      this.shouldThrowOnError = builder.shouldThrowOnError;
      this.signal = builder.signal;
      this.isMaybeSingle = builder.isMaybeSingle;
      if (builder.fetch) {
        this.fetch = builder.fetch;
      } else if (typeof fetch === "undefined") {
        this.fetch = node_fetch_1.default;
      } else {
        this.fetch = fetch;
      }
    }
    /**
     * If there's an error with the query, throwOnError will reject the promise by
     * throwing the error instead of returning it as part of a successful response.
     *
     * {@link https://github.com/supabase/supabase-js/issues/92}
     */
    throwOnError() {
      this.shouldThrowOnError = true;
      return this;
    }
    /**
     * Set an HTTP header for the request.
     */
    setHeader(name, value) {
      this.headers = Object.assign({}, this.headers);
      this.headers[name] = value;
      return this;
    }
    then(onfulfilled, onrejected) {
      if (this.schema === void 0) ;
      else if (["GET", "HEAD"].includes(this.method)) {
        this.headers["Accept-Profile"] = this.schema;
      } else {
        this.headers["Content-Profile"] = this.schema;
      }
      if (this.method !== "GET" && this.method !== "HEAD") {
        this.headers["Content-Type"] = "application/json";
      }
      const _fetch = this.fetch;
      let res = _fetch(this.url.toString(), {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(this.body),
        signal: this.signal
      }).then(async (res2) => {
        var _a, _b, _c;
        let error = null;
        let data = null;
        let count = null;
        let status = res2.status;
        let statusText = res2.statusText;
        if (res2.ok) {
          if (this.method !== "HEAD") {
            const body = await res2.text();
            if (body === "") ;
            else if (this.headers["Accept"] === "text/csv") {
              data = body;
            } else if (this.headers["Accept"] && this.headers["Accept"].includes("application/vnd.pgrst.plan+text")) {
              data = body;
            } else {
              data = JSON.parse(body);
            }
          }
          const countHeader = (_a = this.headers["Prefer"]) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/);
          const contentRange = (_b = res2.headers.get("content-range")) === null || _b === void 0 ? void 0 : _b.split("/");
          if (countHeader && contentRange && contentRange.length > 1) {
            count = parseInt(contentRange[1]);
          }
          if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
            if (data.length > 1) {
              error = {
                // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                code: "PGRST116",
                details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                hint: null,
                message: "JSON object requested, multiple (or no) rows returned"
              };
              data = null;
              count = null;
              status = 406;
              statusText = "Not Acceptable";
            } else if (data.length === 1) {
              data = data[0];
            } else {
              data = null;
            }
          }
        } else {
          const body = await res2.text();
          try {
            error = JSON.parse(body);
            if (Array.isArray(error) && res2.status === 404) {
              data = [];
              error = null;
              status = 200;
              statusText = "OK";
            }
          } catch (_d) {
            if (res2.status === 404 && body === "") {
              status = 204;
              statusText = "No Content";
            } else {
              error = {
                message: body
              };
            }
          }
          if (error && this.isMaybeSingle && ((_c = error === null || error === void 0 ? void 0 : error.details) === null || _c === void 0 ? void 0 : _c.includes("0 rows"))) {
            error = null;
            status = 200;
            statusText = "OK";
          }
          if (error && this.shouldThrowOnError) {
            throw new PostgrestError_1.default(error);
          }
        }
        const postgrestResponse = {
          error,
          data,
          count,
          status,
          statusText
        };
        return postgrestResponse;
      });
      if (!this.shouldThrowOnError) {
        res = res.catch((fetchError) => {
          var _a, _b, _c;
          return {
            error: {
              message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
              details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ""}`,
              hint: "",
              code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ""}`
            },
            data: null,
            count: null,
            status: 0,
            statusText: ""
          };
        });
      }
      return res.then(onfulfilled, onrejected);
    }
    /**
     * Override the type of the returned `data`.
     *
     * @typeParam NewResult - The new result type to override with
     * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
     */
    returns() {
      return this;
    }
    /**
     * Override the type of the returned `data` field in the response.
     *
     * @typeParam NewResult - The new type to cast the response data to
     * @typeParam Options - Optional type configuration (defaults to { merge: true })
     * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
     * @example
     * ```typescript
     * // Merge with existing types (default behavior)
     * const query = supabase
     *   .from('users')
     *   .select()
     *   .overrideTypes<{ custom_field: string }>()
     *
     * // Replace existing types completely
     * const replaceQuery = supabase
     *   .from('users')
     *   .select()
     *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
     * ```
     * @returns A PostgrestBuilder instance with the new type
     */
    overrideTypes() {
      return this;
    }
  }
  PostgrestBuilder$1.default = PostgrestBuilder2;
  return PostgrestBuilder$1;
}
var hasRequiredPostgrestTransformBuilder;
function requirePostgrestTransformBuilder() {
  if (hasRequiredPostgrestTransformBuilder) return PostgrestTransformBuilder$1;
  hasRequiredPostgrestTransformBuilder = 1;
  var __importDefault = PostgrestTransformBuilder$1 && PostgrestTransformBuilder$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(PostgrestTransformBuilder$1, "__esModule", { value: true });
  const PostgrestBuilder_1 = __importDefault(requirePostgrestBuilder());
  class PostgrestTransformBuilder2 extends PostgrestBuilder_1.default {
    /**
     * Perform a SELECT on the query result.
     *
     * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
     * return modified rows. By calling this method, modified rows are returned in
     * `data`.
     *
     * @param columns - The columns to retrieve, separated by commas
     */
    select(columns) {
      let quoted = false;
      const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
        if (/\s/.test(c) && !quoted) {
          return "";
        }
        if (c === '"') {
          quoted = !quoted;
        }
        return c;
      }).join("");
      this.url.searchParams.set("select", cleanedColumns);
      if (this.headers["Prefer"]) {
        this.headers["Prefer"] += ",";
      }
      this.headers["Prefer"] += "return=representation";
      return this;
    }
    /**
     * Order the query result by `column`.
     *
     * You can call this method multiple times to order by multiple columns.
     *
     * You can order referenced tables, but it only affects the ordering of the
     * parent table if you use `!inner` in the query.
     *
     * @param column - The column to order by
     * @param options - Named parameters
     * @param options.ascending - If `true`, the result will be in ascending order
     * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
     * `null`s appear last.
     * @param options.referencedTable - Set this to order a referenced table by
     * its columns
     * @param options.foreignTable - Deprecated, use `options.referencedTable`
     * instead
     */
    order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
      const key = referencedTable ? `${referencedTable}.order` : "order";
      const existingOrder = this.url.searchParams.get(key);
      this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
      return this;
    }
    /**
     * Limit the query result by `count`.
     *
     * @param count - The maximum number of rows to return
     * @param options - Named parameters
     * @param options.referencedTable - Set this to limit rows of referenced
     * tables instead of the parent table
     * @param options.foreignTable - Deprecated, use `options.referencedTable`
     * instead
     */
    limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
      const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
      this.url.searchParams.set(key, `${count}`);
      return this;
    }
    /**
     * Limit the query result by starting at an offset `from` and ending at the offset `to`.
     * Only records within this range are returned.
     * This respects the query order and if there is no order clause the range could behave unexpectedly.
     * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
     * and fourth rows of the query.
     *
     * @param from - The starting index from which to limit the result
     * @param to - The last index to which to limit the result
     * @param options - Named parameters
     * @param options.referencedTable - Set this to limit rows of referenced
     * tables instead of the parent table
     * @param options.foreignTable - Deprecated, use `options.referencedTable`
     * instead
     */
    range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
      const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
      const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
      this.url.searchParams.set(keyOffset, `${from}`);
      this.url.searchParams.set(keyLimit, `${to - from + 1}`);
      return this;
    }
    /**
     * Set the AbortSignal for the fetch request.
     *
     * @param signal - The AbortSignal to use for the fetch request
     */
    abortSignal(signal) {
      this.signal = signal;
      return this;
    }
    /**
     * Return `data` as a single object instead of an array of objects.
     *
     * Query result must be one row (e.g. using `.limit(1)`), otherwise this
     * returns an error.
     */
    single() {
      this.headers["Accept"] = "application/vnd.pgrst.object+json";
      return this;
    }
    /**
     * Return `data` as a single object instead of an array of objects.
     *
     * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
     * this returns an error.
     */
    maybeSingle() {
      if (this.method === "GET") {
        this.headers["Accept"] = "application/json";
      } else {
        this.headers["Accept"] = "application/vnd.pgrst.object+json";
      }
      this.isMaybeSingle = true;
      return this;
    }
    /**
     * Return `data` as a string in CSV format.
     */
    csv() {
      this.headers["Accept"] = "text/csv";
      return this;
    }
    /**
     * Return `data` as an object in [GeoJSON](https://geojson.org) format.
     */
    geojson() {
      this.headers["Accept"] = "application/geo+json";
      return this;
    }
    /**
     * Return `data` as the EXPLAIN plan for the query.
     *
     * You need to enable the
     * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
     * setting before using this method.
     *
     * @param options - Named parameters
     *
     * @param options.analyze - If `true`, the query will be executed and the
     * actual run time will be returned
     *
     * @param options.verbose - If `true`, the query identifier will be returned
     * and `data` will include the output columns of the query
     *
     * @param options.settings - If `true`, include information on configuration
     * parameters that affect query planning
     *
     * @param options.buffers - If `true`, include information on buffer usage
     *
     * @param options.wal - If `true`, include information on WAL record generation
     *
     * @param options.format - The format of the output, can be `"text"` (default)
     * or `"json"`
     */
    explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
      var _a;
      const options = [
        analyze ? "analyze" : null,
        verbose ? "verbose" : null,
        settings ? "settings" : null,
        buffers ? "buffers" : null,
        wal ? "wal" : null
      ].filter(Boolean).join("|");
      const forMediatype = (_a = this.headers["Accept"]) !== null && _a !== void 0 ? _a : "application/json";
      this.headers["Accept"] = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`;
      if (format === "json")
        return this;
      else
        return this;
    }
    /**
     * Rollback the query.
     *
     * `data` will still be returned, but the query is not committed.
     */
    rollback() {
      var _a;
      if (((_a = this.headers["Prefer"]) !== null && _a !== void 0 ? _a : "").trim().length > 0) {
        this.headers["Prefer"] += ",tx=rollback";
      } else {
        this.headers["Prefer"] = "tx=rollback";
      }
      return this;
    }
    /**
     * Override the type of the returned `data`.
     *
     * @typeParam NewResult - The new result type to override with
     * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
     */
    returns() {
      return this;
    }
  }
  PostgrestTransformBuilder$1.default = PostgrestTransformBuilder2;
  return PostgrestTransformBuilder$1;
}
var hasRequiredPostgrestFilterBuilder;
function requirePostgrestFilterBuilder() {
  if (hasRequiredPostgrestFilterBuilder) return PostgrestFilterBuilder$1;
  hasRequiredPostgrestFilterBuilder = 1;
  var __importDefault = PostgrestFilterBuilder$1 && PostgrestFilterBuilder$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(PostgrestFilterBuilder$1, "__esModule", { value: true });
  const PostgrestTransformBuilder_1 = __importDefault(requirePostgrestTransformBuilder());
  class PostgrestFilterBuilder2 extends PostgrestTransformBuilder_1.default {
    /**
     * Match only rows where `column` is equal to `value`.
     *
     * To check if the value of `column` is NULL, you should use `.is()` instead.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    eq(column, value) {
      this.url.searchParams.append(column, `eq.${value}`);
      return this;
    }
    /**
     * Match only rows where `column` is not equal to `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    neq(column, value) {
      this.url.searchParams.append(column, `neq.${value}`);
      return this;
    }
    /**
     * Match only rows where `column` is greater than `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    gt(column, value) {
      this.url.searchParams.append(column, `gt.${value}`);
      return this;
    }
    /**
     * Match only rows where `column` is greater than or equal to `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    gte(column, value) {
      this.url.searchParams.append(column, `gte.${value}`);
      return this;
    }
    /**
     * Match only rows where `column` is less than `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    lt(column, value) {
      this.url.searchParams.append(column, `lt.${value}`);
      return this;
    }
    /**
     * Match only rows where `column` is less than or equal to `value`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    lte(column, value) {
      this.url.searchParams.append(column, `lte.${value}`);
      return this;
    }
    /**
     * Match only rows where `column` matches `pattern` case-sensitively.
     *
     * @param column - The column to filter on
     * @param pattern - The pattern to match with
     */
    like(column, pattern) {
      this.url.searchParams.append(column, `like.${pattern}`);
      return this;
    }
    /**
     * Match only rows where `column` matches all of `patterns` case-sensitively.
     *
     * @param column - The column to filter on
     * @param patterns - The patterns to match with
     */
    likeAllOf(column, patterns) {
      this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
      return this;
    }
    /**
     * Match only rows where `column` matches any of `patterns` case-sensitively.
     *
     * @param column - The column to filter on
     * @param patterns - The patterns to match with
     */
    likeAnyOf(column, patterns) {
      this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
      return this;
    }
    /**
     * Match only rows where `column` matches `pattern` case-insensitively.
     *
     * @param column - The column to filter on
     * @param pattern - The pattern to match with
     */
    ilike(column, pattern) {
      this.url.searchParams.append(column, `ilike.${pattern}`);
      return this;
    }
    /**
     * Match only rows where `column` matches all of `patterns` case-insensitively.
     *
     * @param column - The column to filter on
     * @param patterns - The patterns to match with
     */
    ilikeAllOf(column, patterns) {
      this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
      return this;
    }
    /**
     * Match only rows where `column` matches any of `patterns` case-insensitively.
     *
     * @param column - The column to filter on
     * @param patterns - The patterns to match with
     */
    ilikeAnyOf(column, patterns) {
      this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
      return this;
    }
    /**
     * Match only rows where `column` IS `value`.
     *
     * For non-boolean columns, this is only relevant for checking if the value of
     * `column` is NULL by setting `value` to `null`.
     *
     * For boolean columns, you can also set `value` to `true` or `false` and it
     * will behave the same way as `.eq()`.
     *
     * @param column - The column to filter on
     * @param value - The value to filter with
     */
    is(column, value) {
      this.url.searchParams.append(column, `is.${value}`);
      return this;
    }
    /**
     * Match only rows where `column` is included in the `values` array.
     *
     * @param column - The column to filter on
     * @param values - The values array to filter with
     */
    in(column, values) {
      const cleanedValues = Array.from(new Set(values)).map((s) => {
        if (typeof s === "string" && new RegExp("[,()]").test(s))
          return `"${s}"`;
        else
          return `${s}`;
      }).join(",");
      this.url.searchParams.append(column, `in.(${cleanedValues})`);
      return this;
    }
    /**
     * Only relevant for jsonb, array, and range columns. Match only rows where
     * `column` contains every element appearing in `value`.
     *
     * @param column - The jsonb, array, or range column to filter on
     * @param value - The jsonb, array, or range value to filter with
     */
    contains(column, value) {
      if (typeof value === "string") {
        this.url.searchParams.append(column, `cs.${value}`);
      } else if (Array.isArray(value)) {
        this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
      } else {
        this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
      }
      return this;
    }
    /**
     * Only relevant for jsonb, array, and range columns. Match only rows where
     * every element appearing in `column` is contained by `value`.
     *
     * @param column - The jsonb, array, or range column to filter on
     * @param value - The jsonb, array, or range value to filter with
     */
    containedBy(column, value) {
      if (typeof value === "string") {
        this.url.searchParams.append(column, `cd.${value}`);
      } else if (Array.isArray(value)) {
        this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
      } else {
        this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
      }
      return this;
    }
    /**
     * Only relevant for range columns. Match only rows where every element in
     * `column` is greater than any element in `range`.
     *
     * @param column - The range column to filter on
     * @param range - The range to filter with
     */
    rangeGt(column, range) {
      this.url.searchParams.append(column, `sr.${range}`);
      return this;
    }
    /**
     * Only relevant for range columns. Match only rows where every element in
     * `column` is either contained in `range` or greater than any element in
     * `range`.
     *
     * @param column - The range column to filter on
     * @param range - The range to filter with
     */
    rangeGte(column, range) {
      this.url.searchParams.append(column, `nxl.${range}`);
      return this;
    }
    /**
     * Only relevant for range columns. Match only rows where every element in
     * `column` is less than any element in `range`.
     *
     * @param column - The range column to filter on
     * @param range - The range to filter with
     */
    rangeLt(column, range) {
      this.url.searchParams.append(column, `sl.${range}`);
      return this;
    }
    /**
     * Only relevant for range columns. Match only rows where every element in
     * `column` is either contained in `range` or less than any element in
     * `range`.
     *
     * @param column - The range column to filter on
     * @param range - The range to filter with
     */
    rangeLte(column, range) {
      this.url.searchParams.append(column, `nxr.${range}`);
      return this;
    }
    /**
     * Only relevant for range columns. Match only rows where `column` is
     * mutually exclusive to `range` and there can be no element between the two
     * ranges.
     *
     * @param column - The range column to filter on
     * @param range - The range to filter with
     */
    rangeAdjacent(column, range) {
      this.url.searchParams.append(column, `adj.${range}`);
      return this;
    }
    /**
     * Only relevant for array and range columns. Match only rows where
     * `column` and `value` have an element in common.
     *
     * @param column - The array or range column to filter on
     * @param value - The array or range value to filter with
     */
    overlaps(column, value) {
      if (typeof value === "string") {
        this.url.searchParams.append(column, `ov.${value}`);
      } else {
        this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
      }
      return this;
    }
    /**
     * Only relevant for text and tsvector columns. Match only rows where
     * `column` matches the query string in `query`.
     *
     * @param column - The text or tsvector column to filter on
     * @param query - The query text to match with
     * @param options - Named parameters
     * @param options.config - The text search configuration to use
     * @param options.type - Change how the `query` text is interpreted
     */
    textSearch(column, query, { config, type } = {}) {
      let typePart = "";
      if (type === "plain") {
        typePart = "pl";
      } else if (type === "phrase") {
        typePart = "ph";
      } else if (type === "websearch") {
        typePart = "w";
      }
      const configPart = config === void 0 ? "" : `(${config})`;
      this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
      return this;
    }
    /**
     * Match only rows where each column in `query` keys is equal to its
     * associated value. Shorthand for multiple `.eq()`s.
     *
     * @param query - The object to filter with, with column names as keys mapped
     * to their filter values
     */
    match(query) {
      Object.entries(query).forEach(([column, value]) => {
        this.url.searchParams.append(column, `eq.${value}`);
      });
      return this;
    }
    /**
     * Match only rows which doesn't satisfy the filter.
     *
     * Unlike most filters, `opearator` and `value` are used as-is and need to
     * follow [PostgREST
     * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
     * to make sure they are properly sanitized.
     *
     * @param column - The column to filter on
     * @param operator - The operator to be negated to filter with, following
     * PostgREST syntax
     * @param value - The value to filter with, following PostgREST syntax
     */
    not(column, operator, value) {
      this.url.searchParams.append(column, `not.${operator}.${value}`);
      return this;
    }
    /**
     * Match only rows which satisfy at least one of the filters.
     *
     * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
     * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
     * to make sure it's properly sanitized.
     *
     * It's currently not possible to do an `.or()` filter across multiple tables.
     *
     * @param filters - The filters to use, following PostgREST syntax
     * @param options - Named parameters
     * @param options.referencedTable - Set this to filter on referenced tables
     * instead of the parent table
     * @param options.foreignTable - Deprecated, use `referencedTable` instead
     */
    or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
      const key = referencedTable ? `${referencedTable}.or` : "or";
      this.url.searchParams.append(key, `(${filters})`);
      return this;
    }
    /**
     * Match only rows which satisfy the filter. This is an escape hatch - you
     * should use the specific filter methods wherever possible.
     *
     * Unlike most filters, `opearator` and `value` are used as-is and need to
     * follow [PostgREST
     * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
     * to make sure they are properly sanitized.
     *
     * @param column - The column to filter on
     * @param operator - The operator to filter with, following PostgREST syntax
     * @param value - The value to filter with, following PostgREST syntax
     */
    filter(column, operator, value) {
      this.url.searchParams.append(column, `${operator}.${value}`);
      return this;
    }
  }
  PostgrestFilterBuilder$1.default = PostgrestFilterBuilder2;
  return PostgrestFilterBuilder$1;
}
var hasRequiredPostgrestQueryBuilder;
function requirePostgrestQueryBuilder() {
  if (hasRequiredPostgrestQueryBuilder) return PostgrestQueryBuilder$1;
  hasRequiredPostgrestQueryBuilder = 1;
  var __importDefault = PostgrestQueryBuilder$1 && PostgrestQueryBuilder$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(PostgrestQueryBuilder$1, "__esModule", { value: true });
  const PostgrestFilterBuilder_1 = __importDefault(requirePostgrestFilterBuilder());
  class PostgrestQueryBuilder2 {
    constructor(url, { headers = {}, schema, fetch: fetch2 }) {
      this.url = url;
      this.headers = headers;
      this.schema = schema;
      this.fetch = fetch2;
    }
    /**
     * Perform a SELECT query on the table or view.
     *
     * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
     *
     * @param options - Named parameters
     *
     * @param options.head - When set to `true`, `data` will not be returned.
     * Useful if you only need the count.
     *
     * @param options.count - Count algorithm to use to count rows in the table or view.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    select(columns, { head: head2 = false, count } = {}) {
      const method = head2 ? "HEAD" : "GET";
      let quoted = false;
      const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
        if (/\s/.test(c) && !quoted) {
          return "";
        }
        if (c === '"') {
          quoted = !quoted;
        }
        return c;
      }).join("");
      this.url.searchParams.set("select", cleanedColumns);
      if (count) {
        this.headers["Prefer"] = `count=${count}`;
      }
      return new PostgrestFilterBuilder_1.default({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        fetch: this.fetch,
        allowEmpty: false
      });
    }
    /**
     * Perform an INSERT into the table or view.
     *
     * By default, inserted rows are not returned. To return it, chain the call
     * with `.select()`.
     *
     * @param values - The values to insert. Pass an object to insert a single row
     * or an array to insert multiple rows.
     *
     * @param options - Named parameters
     *
     * @param options.count - Count algorithm to use to count inserted rows.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     *
     * @param options.defaultToNull - Make missing fields default to `null`.
     * Otherwise, use the default value for the column. Only applies for bulk
     * inserts.
     */
    insert(values, { count, defaultToNull = true } = {}) {
      const method = "POST";
      const prefersHeaders = [];
      if (this.headers["Prefer"]) {
        prefersHeaders.push(this.headers["Prefer"]);
      }
      if (count) {
        prefersHeaders.push(`count=${count}`);
      }
      if (!defaultToNull) {
        prefersHeaders.push("missing=default");
      }
      this.headers["Prefer"] = prefersHeaders.join(",");
      if (Array.isArray(values)) {
        const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
        if (columns.length > 0) {
          const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
          this.url.searchParams.set("columns", uniqueColumns.join(","));
        }
      }
      return new PostgrestFilterBuilder_1.default({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        body: values,
        fetch: this.fetch,
        allowEmpty: false
      });
    }
    /**
     * Perform an UPSERT on the table or view. Depending on the column(s) passed
     * to `onConflict`, `.upsert()` allows you to perform the equivalent of
     * `.insert()` if a row with the corresponding `onConflict` columns doesn't
     * exist, or if it does exist, perform an alternative action depending on
     * `ignoreDuplicates`.
     *
     * By default, upserted rows are not returned. To return it, chain the call
     * with `.select()`.
     *
     * @param values - The values to upsert with. Pass an object to upsert a
     * single row or an array to upsert multiple rows.
     *
     * @param options - Named parameters
     *
     * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
     * duplicate rows are determined. Two rows are duplicates if all the
     * `onConflict` columns are equal.
     *
     * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
     * `false`, duplicate rows are merged with existing rows.
     *
     * @param options.count - Count algorithm to use to count upserted rows.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     *
     * @param options.defaultToNull - Make missing fields default to `null`.
     * Otherwise, use the default value for the column. This only applies when
     * inserting new rows, not when merging with existing rows under
     * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
     */
    upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
      const method = "POST";
      const prefersHeaders = [`resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`];
      if (onConflict !== void 0)
        this.url.searchParams.set("on_conflict", onConflict);
      if (this.headers["Prefer"]) {
        prefersHeaders.push(this.headers["Prefer"]);
      }
      if (count) {
        prefersHeaders.push(`count=${count}`);
      }
      if (!defaultToNull) {
        prefersHeaders.push("missing=default");
      }
      this.headers["Prefer"] = prefersHeaders.join(",");
      if (Array.isArray(values)) {
        const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
        if (columns.length > 0) {
          const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
          this.url.searchParams.set("columns", uniqueColumns.join(","));
        }
      }
      return new PostgrestFilterBuilder_1.default({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        body: values,
        fetch: this.fetch,
        allowEmpty: false
      });
    }
    /**
     * Perform an UPDATE on the table or view.
     *
     * By default, updated rows are not returned. To return it, chain the call
     * with `.select()` after filters.
     *
     * @param values - The values to update with
     *
     * @param options - Named parameters
     *
     * @param options.count - Count algorithm to use to count updated rows.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    update(values, { count } = {}) {
      const method = "PATCH";
      const prefersHeaders = [];
      if (this.headers["Prefer"]) {
        prefersHeaders.push(this.headers["Prefer"]);
      }
      if (count) {
        prefersHeaders.push(`count=${count}`);
      }
      this.headers["Prefer"] = prefersHeaders.join(",");
      return new PostgrestFilterBuilder_1.default({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        body: values,
        fetch: this.fetch,
        allowEmpty: false
      });
    }
    /**
     * Perform a DELETE on the table or view.
     *
     * By default, deleted rows are not returned. To return it, chain the call
     * with `.select()` after filters.
     *
     * @param options - Named parameters
     *
     * @param options.count - Count algorithm to use to count deleted rows.
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    delete({ count } = {}) {
      const method = "DELETE";
      const prefersHeaders = [];
      if (count) {
        prefersHeaders.push(`count=${count}`);
      }
      if (this.headers["Prefer"]) {
        prefersHeaders.unshift(this.headers["Prefer"]);
      }
      this.headers["Prefer"] = prefersHeaders.join(",");
      return new PostgrestFilterBuilder_1.default({
        method,
        url: this.url,
        headers: this.headers,
        schema: this.schema,
        fetch: this.fetch,
        allowEmpty: false
      });
    }
  }
  PostgrestQueryBuilder$1.default = PostgrestQueryBuilder2;
  return PostgrestQueryBuilder$1;
}
var constants = {};
var version$4 = {};
var hasRequiredVersion;
function requireVersion() {
  if (hasRequiredVersion) return version$4;
  hasRequiredVersion = 1;
  Object.defineProperty(version$4, "__esModule", { value: true });
  version$4.version = void 0;
  version$4.version = "0.0.0-automated";
  return version$4;
}
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  Object.defineProperty(constants, "__esModule", { value: true });
  constants.DEFAULT_HEADERS = void 0;
  const version_1 = requireVersion();
  constants.DEFAULT_HEADERS = { "X-Client-Info": `postgrest-js/${version_1.version}` };
  return constants;
}
var hasRequiredPostgrestClient;
function requirePostgrestClient() {
  if (hasRequiredPostgrestClient) return PostgrestClient$1;
  hasRequiredPostgrestClient = 1;
  var __importDefault = PostgrestClient$1 && PostgrestClient$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(PostgrestClient$1, "__esModule", { value: true });
  const PostgrestQueryBuilder_1 = __importDefault(requirePostgrestQueryBuilder());
  const PostgrestFilterBuilder_1 = __importDefault(requirePostgrestFilterBuilder());
  const constants_1 = requireConstants();
  class PostgrestClient2 {
    // TODO: Add back shouldThrowOnError once we figure out the typings
    /**
     * Creates a PostgREST client.
     *
     * @param url - URL of the PostgREST endpoint
     * @param options - Named parameters
     * @param options.headers - Custom headers
     * @param options.schema - Postgres schema to switch to
     * @param options.fetch - Custom fetch
     */
    constructor(url, { headers = {}, schema, fetch: fetch2 } = {}) {
      this.url = url;
      this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
      this.schemaName = schema;
      this.fetch = fetch2;
    }
    /**
     * Perform a query on a table or a view.
     *
     * @param relation - The table or view name to query
     */
    from(relation) {
      const url = new URL(`${this.url}/${relation}`);
      return new PostgrestQueryBuilder_1.default(url, {
        headers: Object.assign({}, this.headers),
        schema: this.schemaName,
        fetch: this.fetch
      });
    }
    /**
     * Select a schema to query or perform an function (rpc) call.
     *
     * The schema needs to be on the list of exposed schemas inside Supabase.
     *
     * @param schema - The schema to query
     */
    schema(schema) {
      return new PostgrestClient2(this.url, {
        headers: this.headers,
        schema,
        fetch: this.fetch
      });
    }
    /**
     * Perform a function call.
     *
     * @param fn - The function name to call
     * @param args - The arguments to pass to the function call
     * @param options - Named parameters
     * @param options.head - When set to `true`, `data` will not be returned.
     * Useful if you only need the count.
     * @param options.get - When set to `true`, the function will be called with
     * read-only access mode.
     * @param options.count - Count algorithm to use to count rows returned by the
     * function. Only applicable for [set-returning
     * functions](https://www.postgresql.org/docs/current/functions-srf.html).
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    rpc(fn, args = {}, { head: head2 = false, get: get2 = false, count } = {}) {
      let method;
      const url = new URL(`${this.url}/rpc/${fn}`);
      let body;
      if (head2 || get2) {
        method = head2 ? "HEAD" : "GET";
        Object.entries(args).filter(([_, value]) => value !== void 0).map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name, value]) => {
          url.searchParams.append(name, value);
        });
      } else {
        method = "POST";
        body = args;
      }
      const headers = Object.assign({}, this.headers);
      if (count) {
        headers["Prefer"] = `count=${count}`;
      }
      return new PostgrestFilterBuilder_1.default({
        method,
        url,
        headers,
        schema: this.schemaName,
        body,
        fetch: this.fetch,
        allowEmpty: false
      });
    }
  }
  PostgrestClient$1.default = PostgrestClient2;
  return PostgrestClient$1;
}
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  var __importDefault = cjs && cjs.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(cjs, "__esModule", { value: true });
  cjs.PostgrestError = cjs.PostgrestBuilder = cjs.PostgrestTransformBuilder = cjs.PostgrestFilterBuilder = cjs.PostgrestQueryBuilder = cjs.PostgrestClient = void 0;
  const PostgrestClient_1 = __importDefault(requirePostgrestClient());
  cjs.PostgrestClient = PostgrestClient_1.default;
  const PostgrestQueryBuilder_1 = __importDefault(requirePostgrestQueryBuilder());
  cjs.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
  const PostgrestFilterBuilder_1 = __importDefault(requirePostgrestFilterBuilder());
  cjs.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
  const PostgrestTransformBuilder_1 = __importDefault(requirePostgrestTransformBuilder());
  cjs.PostgrestTransformBuilder = PostgrestTransformBuilder_1.default;
  const PostgrestBuilder_1 = __importDefault(requirePostgrestBuilder());
  cjs.PostgrestBuilder = PostgrestBuilder_1.default;
  const PostgrestError_1 = __importDefault(requirePostgrestError());
  cjs.PostgrestError = PostgrestError_1.default;
  cjs.default = {
    PostgrestClient: PostgrestClient_1.default,
    PostgrestQueryBuilder: PostgrestQueryBuilder_1.default,
    PostgrestFilterBuilder: PostgrestFilterBuilder_1.default,
    PostgrestTransformBuilder: PostgrestTransformBuilder_1.default,
    PostgrestBuilder: PostgrestBuilder_1.default,
    PostgrestError: PostgrestError_1.default
  };
  return cjs;
}
var cjsExports = requireCjs();
const index = /* @__PURE__ */ getDefaultExportFromCjs(cjsExports);
const {
  PostgrestClient,
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestTransformBuilder,
  PostgrestBuilder,
  PostgrestError
} = index;
function getNativeWebSocket() {
  if (typeof WebSocket !== "undefined")
    return WebSocket;
  if (typeof global.WebSocket !== "undefined")
    return global.WebSocket;
  if (typeof window.WebSocket !== "undefined")
    return window.WebSocket;
  if (typeof self.WebSocket !== "undefined")
    return self.WebSocket;
  throw new Error("`WebSocket` is not supported in this environment");
}
const WebSocket$1 = getNativeWebSocket();
const version$3 = "2.11.15";
const DEFAULT_VERSION = `realtime-js/${version$3}`;
const VSN = "1.0.0";
const DEFAULT_TIMEOUT = 1e4;
const WS_CLOSE_NORMAL = 1e3;
var SOCKET_STATES;
(function(SOCKET_STATES2) {
  SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
  SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
  SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
  SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));
var CHANNEL_STATES;
(function(CHANNEL_STATES2) {
  CHANNEL_STATES2["closed"] = "closed";
  CHANNEL_STATES2["errored"] = "errored";
  CHANNEL_STATES2["joined"] = "joined";
  CHANNEL_STATES2["joining"] = "joining";
  CHANNEL_STATES2["leaving"] = "leaving";
})(CHANNEL_STATES || (CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function(CHANNEL_EVENTS2) {
  CHANNEL_EVENTS2["close"] = "phx_close";
  CHANNEL_EVENTS2["error"] = "phx_error";
  CHANNEL_EVENTS2["join"] = "phx_join";
  CHANNEL_EVENTS2["reply"] = "phx_reply";
  CHANNEL_EVENTS2["leave"] = "phx_leave";
  CHANNEL_EVENTS2["access_token"] = "access_token";
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
var TRANSPORTS;
(function(TRANSPORTS2) {
  TRANSPORTS2["websocket"] = "websocket";
})(TRANSPORTS || (TRANSPORTS = {}));
var CONNECTION_STATE;
(function(CONNECTION_STATE2) {
  CONNECTION_STATE2["Connecting"] = "connecting";
  CONNECTION_STATE2["Open"] = "open";
  CONNECTION_STATE2["Closing"] = "closing";
  CONNECTION_STATE2["Closed"] = "closed";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));
class Serializer {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this._binaryDecode(rawPayload));
    }
    if (typeof rawPayload === "string") {
      return callback(JSON.parse(rawPayload));
    }
    return callback({});
  }
  _binaryDecode(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    return this._decodeBroadcast(buffer, view, decoder);
  }
  _decodeBroadcast(buffer, view, decoder) {
    const topicSize = view.getUint8(1);
    const eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    const event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
    return { ref: null, topic, event, payload: data };
  }
}
class Timer {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = void 0;
    this.tries = 0;
    this.callback = callback;
    this.timerCalc = timerCalc;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }
  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
}
var PostgresTypes;
(function(PostgresTypes2) {
  PostgresTypes2["abstime"] = "abstime";
  PostgresTypes2["bool"] = "bool";
  PostgresTypes2["date"] = "date";
  PostgresTypes2["daterange"] = "daterange";
  PostgresTypes2["float4"] = "float4";
  PostgresTypes2["float8"] = "float8";
  PostgresTypes2["int2"] = "int2";
  PostgresTypes2["int4"] = "int4";
  PostgresTypes2["int4range"] = "int4range";
  PostgresTypes2["int8"] = "int8";
  PostgresTypes2["int8range"] = "int8range";
  PostgresTypes2["json"] = "json";
  PostgresTypes2["jsonb"] = "jsonb";
  PostgresTypes2["money"] = "money";
  PostgresTypes2["numeric"] = "numeric";
  PostgresTypes2["oid"] = "oid";
  PostgresTypes2["reltime"] = "reltime";
  PostgresTypes2["text"] = "text";
  PostgresTypes2["time"] = "time";
  PostgresTypes2["timestamp"] = "timestamp";
  PostgresTypes2["timestamptz"] = "timestamptz";
  PostgresTypes2["timetz"] = "timetz";
  PostgresTypes2["tsrange"] = "tsrange";
  PostgresTypes2["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
const convertChangeData = (columns, record, options = {}) => {
  var _a;
  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
    return acc;
  }, {});
};
const convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find((x) => x.name === columnName);
  const colType = column === null || column === void 0 ? void 0 : column.type;
  const value = record[columnName];
  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value);
  }
  return noop$1(value);
};
const convertCell = (type, value) => {
  if (type.charAt(0) === "_") {
    const dataType = type.slice(1, type.length);
    return toArray(value, dataType);
  }
  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value);
    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value);
    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value);
    case PostgresTypes.timestamp:
      return toTimestampString(value);
    // Format to be consistent with PostgREST
    case PostgresTypes.abstime:
    // To allow users to cast it based on Timezone
    case PostgresTypes.date:
    // To allow users to cast it based on Timezone
    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime:
    // To allow users to cast it based on Timezone
    case PostgresTypes.text:
    case PostgresTypes.time:
    // To allow users to cast it based on Timezone
    case PostgresTypes.timestamptz:
    // To allow users to cast it based on Timezone
    case PostgresTypes.timetz:
    // To allow users to cast it based on Timezone
    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop$1(value);
    default:
      return noop$1(value);
  }
};
const noop$1 = (value) => {
  return value;
};
const toBoolean = (value) => {
  switch (value) {
    case "t":
      return true;
    case "f":
      return false;
    default:
      return value;
  }
};
const toNumber = (value) => {
  if (typeof value === "string") {
    const parsedValue = parseFloat(value);
    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return value;
};
const toJson = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.log(`JSON parse error: ${error}`);
      return value;
    }
  }
  return value;
};
const toArray = (value, type) => {
  if (typeof value !== "string") {
    return value;
  }
  const lastIdx = value.length - 1;
  const closeBrace = value[lastIdx];
  const openBrace = value[0];
  if (openBrace === "{" && closeBrace === "}") {
    let arr;
    const valTrim = value.slice(1, lastIdx);
    try {
      arr = JSON.parse("[" + valTrim + "]");
    } catch (_) {
      arr = valTrim ? valTrim.split(",") : [];
    }
    return arr.map((val) => convertCell(type, val));
  }
  return value;
};
const toTimestampString = (value) => {
  if (typeof value === "string") {
    return value.replace(" ", "T");
  }
  return value;
};
const httpEndpointURL = (socketUrl) => {
  let url = socketUrl;
  url = url.replace(/^ws/i, "http");
  url = url.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "");
  return url.replace(/\/+$/, "");
};
class Push {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
    this.channel = channel;
    this.event = event;
    this.payload = payload;
    this.timeout = timeout;
    this.sent = false;
    this.timeoutTimer = void 0;
    this.ref = "";
    this.receivedResp = null;
    this.recHooks = [];
    this.refEvent = null;
  }
  resend(timeout) {
    this.timeout = timeout;
    this._cancelRefEvent();
    this.ref = "";
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
    this.send();
  }
  send() {
    if (this._hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    });
  }
  updatePayload(payload) {
    this.payload = Object.assign(Object.assign({}, this.payload), payload);
  }
  receive(status, callback) {
    var _a;
    if (this._hasReceived(status)) {
      callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
    }
    this.recHooks.push({ status, callback });
    return this;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      return;
    }
    this.ref = this.channel.socket._makeRef();
    this.refEvent = this.channel._replyEventName(this.ref);
    const callback = (payload) => {
      this._cancelRefEvent();
      this._cancelTimeout();
      this.receivedResp = payload;
      this._matchReceive(payload);
    };
    this.channel._on(this.refEvent, {}, callback);
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  trigger(status, response) {
    if (this.refEvent)
      this.channel._trigger(this.refEvent, { status, response });
  }
  destroy() {
    this._cancelRefEvent();
    this._cancelTimeout();
  }
  _cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = void 0;
  }
  _matchReceive({ status, response }) {
    this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
  }
  _hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
}
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
  REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
  REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
  REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
class RealtimePresence {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(channel, opts) {
    this.channel = channel;
    this.state = {};
    this.pendingDiffs = [];
    this.joinRef = null;
    this.caller = {
      onJoin: () => {
      },
      onLeave: () => {
      },
      onSync: () => {
      }
    };
    const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
      state: "presence_state",
      diff: "presence_diff"
    };
    this.channel._on(events.state, {}, (newState) => {
      const { onJoin, onLeave, onSync } = this.caller;
      this.joinRef = this.channel._joinRef();
      this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach((diff) => {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel._on(events.diff, {}, (diff) => {
      const { onJoin, onLeave, onSync } = this.caller;
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
    this.onJoin((key, currentPresences, newPresences) => {
      this.channel._trigger("presence", {
        event: "join",
        key,
        currentPresences,
        newPresences
      });
    });
    this.onLeave((key, currentPresences, leftPresences) => {
      this.channel._trigger("presence", {
        event: "leave",
        key,
        currentPresences,
        leftPresences
      });
    });
    this.onSync(() => {
      this.channel._trigger("presence", { event: "sync" });
    });
  }
  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @internal
   */
  static syncState(currentState, newState, onJoin, onLeave) {
    const state = this.cloneDeep(currentState);
    const transformedState = this.transformState(newState);
    const joins = {};
    const leaves = {};
    this.map(state, (key, presences) => {
      if (!transformedState[key]) {
        leaves[key] = presences;
      }
    });
    this.map(transformedState, (key, newPresences) => {
      const currentPresences = state[key];
      if (currentPresences) {
        const newPresenceRefs = newPresences.map((m) => m.presence_ref);
        const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
        const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
        const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
        if (joinedPresences.length > 0) {
          joins[key] = joinedPresences;
        }
        if (leftPresences.length > 0) {
          leaves[key] = leftPresences;
        }
      } else {
        joins[key] = newPresences;
      }
    });
    return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
  }
  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   *
   * @internal
   */
  static syncDiff(state, diff, onJoin, onLeave) {
    const { joins, leaves } = {
      joins: this.transformState(diff.joins),
      leaves: this.transformState(diff.leaves)
    };
    if (!onJoin) {
      onJoin = () => {
      };
    }
    if (!onLeave) {
      onLeave = () => {
      };
    }
    this.map(joins, (key, newPresences) => {
      var _a;
      const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
      state[key] = this.cloneDeep(newPresences);
      if (currentPresences.length > 0) {
        const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
        const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
        state[key].unshift(...curPresences);
      }
      onJoin(key, currentPresences, newPresences);
    });
    this.map(leaves, (key, leftPresences) => {
      let currentPresences = state[key];
      if (!currentPresences)
        return;
      const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
      currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
      state[key] = currentPresences;
      onLeave(key, currentPresences, leftPresences);
      if (currentPresences.length === 0)
        delete state[key];
    });
    return state;
  }
  /** @internal */
  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
  }
  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   * @internal
   */
  static transformState(state) {
    state = this.cloneDeep(state);
    return Object.getOwnPropertyNames(state).reduce((newState, key) => {
      const presences = state[key];
      if ("metas" in presences) {
        newState[key] = presences.metas.map((presence) => {
          presence["presence_ref"] = presence["phx_ref"];
          delete presence["phx_ref"];
          delete presence["phx_ref_prev"];
          return presence;
        });
      } else {
        newState[key] = presences;
      }
      return newState;
    }, {});
  }
  /** @internal */
  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  /** @internal */
  onJoin(callback) {
    this.caller.onJoin = callback;
  }
  /** @internal */
  onLeave(callback) {
    this.caller.onLeave = callback;
  }
  /** @internal */
  onSync(callback) {
    this.caller.onSync = callback;
  }
  /** @internal */
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function(REALTIME_LISTEN_TYPES2) {
  REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
  REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
  REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
  REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function(REALTIME_SUBSCRIBE_STATES2) {
  REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
  REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
  REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
  REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
class RealtimeChannel {
  constructor(topic, params = { config: {} }, socket) {
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = {};
    this.state = CHANNEL_STATES.closed;
    this.joinedOnce = false;
    this.pushBuffer = [];
    this.subTopic = topic.replace(/^realtime:/i, "");
    this.params.config = Object.assign({
      broadcast: { ack: false, self: false },
      presence: { key: "" },
      private: false
    }, params.config);
    this.timeout = this.socket.timeout;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach((pushEvent) => pushEvent.send());
      this.pushBuffer = [];
    });
    this._onClose(() => {
      this.rejoinTimer.reset();
      this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
      this.state = CHANNEL_STATES.closed;
      this.socket._remove(this);
    });
    this._onError((reason) => {
      if (this._isLeaving() || this._isClosed()) {
        return;
      }
      this.socket.log("channel", `error ${this.topic}`, reason);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", () => {
      if (!this._isJoining()) {
        return;
      }
      this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
      this._trigger(this._replyEventName(ref), payload);
    });
    this.presence = new RealtimePresence(this);
    this.broadcastEndpointURL = httpEndpointURL(this.socket.endPoint) + "/api/broadcast";
    this.private = this.params.config.private || false;
  }
  /** Subscribe registers your client with the server */
  subscribe(callback, timeout = this.timeout) {
    var _a, _b;
    if (!this.socket.isConnected()) {
      this.socket.connect();
    }
    if (this.state == CHANNEL_STATES.closed) {
      const { config: { broadcast, presence, private: isPrivate } } = this.params;
      this._onError((e) => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e));
      this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
      const accessTokenPayload = {};
      const config = {
        broadcast,
        presence,
        postgres_changes: (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [],
        private: isPrivate
      };
      if (this.socket.accessTokenValue) {
        accessTokenPayload.access_token = this.socket.accessTokenValue;
      }
      this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
      this.joinedOnce = true;
      this._rejoin(timeout);
      this.joinPush.receive("ok", async ({ postgres_changes }) => {
        var _a2;
        this.socket.setAuth();
        if (postgres_changes === void 0) {
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
          return;
        } else {
          const clientPostgresBindings = this.bindings.postgres_changes;
          const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
          const newPostgresBindings = [];
          for (let i = 0; i < bindingsLen; i++) {
            const clientPostgresBinding = clientPostgresBindings[i];
            const { filter: { event, schema, table, filter } } = clientPostgresBinding;
            const serverPostgresFilter = postgres_changes && postgres_changes[i];
            if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
              newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
            } else {
              this.unsubscribe();
              this.state = CHANNEL_STATES.errored;
              callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = newPostgresBindings;
          callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
          return;
        }
      }).receive("error", (error) => {
        this.state = CHANNEL_STATES.errored;
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(JSON.stringify(Object.values(error).join(", ") || "error")));
        return;
      }).receive("timeout", () => {
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
        return;
      });
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(payload, opts = {}) {
    return await this.send({
      type: "presence",
      event: "track",
      payload
    }, opts.timeout || this.timeout);
  }
  async untrack(opts = {}) {
    return await this.send({
      type: "presence",
      event: "untrack"
    }, opts);
  }
  on(type, filter, callback) {
    return this._on(type, filter, callback);
  }
  /**
   * Sends a message into the channel.
   *
   * @param args Arguments to send to channel
   * @param args.type The type of event to send
   * @param args.event The name of the event being sent
   * @param args.payload Payload to be sent
   * @param opts Options to be used during the send process
   */
  async send(args, opts = {}) {
    var _a, _b;
    if (!this._canPush() && args.type === "broadcast") {
      const { event, payload: endpoint_payload } = args;
      const authorization = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
      const options = {
        method: "POST",
        headers: {
          Authorization: authorization,
          apikey: this.socket.apiKey ? this.socket.apiKey : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              topic: this.subTopic,
              event,
              payload: endpoint_payload,
              private: this.private
            }
          ]
        })
      };
      try {
        const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
        await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
        return response.ok ? "ok" : "error";
      } catch (error) {
        if (error.name === "AbortError") {
          return "timed out";
        } else {
          return "error";
        }
      }
    } else {
      return new Promise((resolve) => {
        var _a2, _b2, _c;
        const push = this._push(args.type, args, opts.timeout || this.timeout);
        if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
          resolve("ok");
        }
        push.receive("ok", () => resolve("ok"));
        push.receive("error", () => resolve("error"));
        push.receive("timeout", () => resolve("timed out"));
      });
    }
  }
  updateJoinPayload(payload) {
    this.joinPush.updatePayload(payload);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */
  unsubscribe(timeout = this.timeout) {
    this.state = CHANNEL_STATES.leaving;
    const onClose = () => {
      this.socket.log("channel", `leave ${this.topic}`);
      this._trigger(CHANNEL_EVENTS.close, "leave", this._joinRef());
    };
    this.joinPush.destroy();
    let leavePush = null;
    return new Promise((resolve) => {
      leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", () => {
        onClose();
        resolve("ok");
      }).receive("timeout", () => {
        onClose();
        resolve("timed out");
      }).receive("error", () => {
        resolve("error");
      });
      leavePush.send();
      if (!this._canPush()) {
        leavePush.trigger("ok", {});
      }
    }).finally(() => {
      leavePush === null || leavePush === void 0 ? void 0 : leavePush.destroy();
    });
  }
  /**
   * Teardown the channel.
   *
   * Destroys and stops related timers.
   */
  teardown() {
    this.pushBuffer.forEach((push) => push.destroy());
    this.rejoinTimer && clearTimeout(this.rejoinTimer.timer);
    this.joinPush.destroy();
  }
  /** @internal */
  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
    clearTimeout(id);
    return response;
  }
  /** @internal */
  _push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    }
    let pushEvent = new Push(this, event, payload, timeout);
    if (this._canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }
    return pushEvent;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage(_event, payload, _ref) {
    return payload;
  }
  /** @internal */
  _isMember(topic) {
    return this.topic === topic;
  }
  /** @internal */
  _joinRef() {
    return this.joinPush.ref;
  }
  /** @internal */
  _trigger(type, payload, ref) {
    var _a, _b;
    const typeLower = type.toLocaleLowerCase();
    const { close, error, leave, join } = CHANNEL_EVENTS;
    const events = [close, error, leave, join];
    if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
      return;
    }
    let handledPayload = this._onMessage(typeLower, payload, ref);
    if (payload && !handledPayload) {
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    }
    if (["insert", "update", "delete"].includes(typeLower)) {
      (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
        var _a2, _b2, _c;
        return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
      }).map((bind) => bind.callback(handledPayload, ref));
    } else {
      (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
        var _a2, _b2, _c, _d, _e, _f;
        if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
          if ("id" in bind) {
            const bindId = bind.id;
            const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
            return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
          } else {
            const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
            return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
          }
        } else {
          return bind.type.toLocaleLowerCase() === typeLower;
        }
      }).map((bind) => {
        if (typeof handledPayload === "object" && "ids" in handledPayload) {
          const postgresChanges = handledPayload.data;
          const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
          const enrichedPayload = {
            schema,
            table,
            commit_timestamp,
            eventType: type2,
            new: {},
            old: {},
            errors
          };
          handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
        }
        bind.callback(handledPayload, ref);
      });
    }
  }
  /** @internal */
  _isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }
  /** @internal */
  _isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }
  /** @internal */
  _isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }
  /** @internal */
  _isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }
  /** @internal */
  _replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  /** @internal */
  _on(type, filter, callback) {
    const typeLower = type.toLocaleLowerCase();
    const binding = {
      type: typeLower,
      filter,
      callback
    };
    if (this.bindings[typeLower]) {
      this.bindings[typeLower].push(binding);
    } else {
      this.bindings[typeLower] = [binding];
    }
    return this;
  }
  /** @internal */
  _off(type, filter) {
    const typeLower = type.toLocaleLowerCase();
    this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
      var _a;
      return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && RealtimeChannel.isEqual(bind.filter, filter));
    });
    return this;
  }
  /** @internal */
  static isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const k in obj1) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }
    return true;
  }
  /** @internal */
  _rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();
    if (this.socket.isConnected()) {
      this._rejoin();
    }
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose(callback) {
    this._on(CHANNEL_EVENTS.close, {}, callback);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(callback) {
    this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
  }
  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   *
   * @internal
   */
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  /** @internal */
  _rejoin(timeout = this.timeout) {
    if (this._isLeaving()) {
      return;
    }
    this.socket._leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }
  /** @internal */
  _getPayloadRecords(payload) {
    const records = {
      new: {},
      old: {}
    };
    if (payload.type === "INSERT" || payload.type === "UPDATE") {
      records.new = convertChangeData(payload.columns, payload.record);
    }
    if (payload.type === "UPDATE" || payload.type === "DELETE") {
      records.old = convertChangeData(payload.columns, payload.old_record);
    }
    return records;
  }
}
const noop = () => {
};
const WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
class RealtimeClient {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.logLevel Sets the log level for Realtime
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   * @param options.worker Use Web Worker to set a side flow. Defaults to false.
   * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
   */
  constructor(endPoint, options) {
    var _a;
    this.accessTokenValue = null;
    this.apiKey = null;
    this.channels = new Array();
    this.endPoint = "";
    this.httpEndpoint = "";
    this.headers = {};
    this.params = {};
    this.timeout = DEFAULT_TIMEOUT;
    this.heartbeatIntervalMs = 25e3;
    this.heartbeatTimer = void 0;
    this.pendingHeartbeatRef = null;
    this.heartbeatCallback = noop;
    this.ref = 0;
    this.logger = noop;
    this.conn = null;
    this.sendBuffer = [];
    this.serializer = new Serializer();
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    };
    this.accessToken = null;
    this._resolveFetch = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = (...args) => __vitePreload(async () => {
          const { default: fetch2 } = await Promise.resolve().then(() => browser);
          return { default: fetch2 };
        }, true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    this.httpEndpoint = httpEndpointURL(endPoint);
    if (options === null || options === void 0 ? void 0 : options.transport) {
      this.transport = options.transport;
    } else {
      this.transport = null;
    }
    if (options === null || options === void 0 ? void 0 : options.params)
      this.params = options.params;
    if (options === null || options === void 0 ? void 0 : options.timeout)
      this.timeout = options.timeout;
    if (options === null || options === void 0 ? void 0 : options.logger)
      this.logger = options.logger;
    if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
      this.logLevel = options.logLevel || options.log_level;
      this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel });
    }
    if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
      this.heartbeatIntervalMs = options.heartbeatIntervalMs;
    const accessTokenValue = (_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey;
    if (accessTokenValue) {
      this.accessTokenValue = accessTokenValue;
      this.apiKey = accessTokenValue;
    }
    this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs : (tries) => {
      return [1e3, 2e3, 5e3, 1e4][tries - 1] || 1e4;
    };
    this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode : (payload, callback) => {
      return callback(JSON.stringify(payload));
    };
    this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode : this.serializer.decode.bind(this.serializer);
    this.reconnectTimer = new Timer(async () => {
      this.disconnect();
      this.connect();
    }, this.reconnectAfterMs);
    this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
    if (options === null || options === void 0 ? void 0 : options.worker) {
      if (typeof window !== "undefined" && !window.Worker) {
        throw new Error("Web Worker is not supported");
      }
      this.worker = (options === null || options === void 0 ? void 0 : options.worker) || false;
      this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
    }
    this.accessToken = (options === null || options === void 0 ? void 0 : options.accessToken) || null;
  }
  /**
   * Connects the socket, unless already connected.
   */
  connect() {
    if (this.conn) {
      return;
    }
    if (!this.transport) {
      this.transport = WebSocket$1;
    }
    if (!this.transport) {
      throw new Error("No transport provided");
    }
    this.conn = new this.transport(this.endpointURL());
    this.setupConnection();
  }
  /**
   * Returns the URL of the websocket.
   * @returns string The URL of the websocket.
   */
  endpointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect(code, reason) {
    if (this.conn) {
      this.conn.onclose = function() {
      };
      if (code) {
        this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
      } else {
        this.conn.close();
      }
      this.conn = null;
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);
      this.reconnectTimer.reset();
      this.channels.forEach((channel) => channel.teardown());
    }
  }
  /**
   * Returns all created channels
   */
  getChannels() {
    return this.channels;
  }
  /**
   * Unsubscribes and removes a single channel
   * @param channel A RealtimeChannel instance
   */
  async removeChannel(channel) {
    const status = await channel.unsubscribe();
    if (this.channels.length === 0) {
      this.disconnect();
    }
    return status;
  }
  /**
   * Unsubscribes and removes all channels
   */
  async removeAllChannels() {
    const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
    this.channels = [];
    this.disconnect();
    return values_1;
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  /**
   * Returns the current state of the socket.
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return CONNECTION_STATE.Connecting;
      case SOCKET_STATES.open:
        return CONNECTION_STATE.Open;
      case SOCKET_STATES.closing:
        return CONNECTION_STATE.Closing;
      default:
        return CONNECTION_STATE.Closed;
    }
  }
  /**
   * Returns `true` is the connection is open.
   */
  isConnected() {
    return this.connectionState() === CONNECTION_STATE.Open;
  }
  channel(topic, params = { config: {} }) {
    const realtimeTopic = `realtime:${topic}`;
    const exists = this.getChannels().find((c) => c.topic === realtimeTopic);
    if (!exists) {
      const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
      this.channels.push(chan);
      return chan;
    } else {
      return exists;
    }
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push(data) {
    const { topic, event, payload, ref } = data;
    const callback = () => {
      this.encode(data, (result) => {
        var _a;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
      });
    };
    this.log("push", `${topic} ${event} (${ref})`, payload);
    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * If param is null it will use the `accessToken` callback function or the token set on the client.
   *
   * On callback used, it will set the value of the token internal to the client.
   *
   * @param token A JWT string to override the token set on the client.
   */
  async setAuth(token = null) {
    let tokenToSend = token || this.accessToken && await this.accessToken() || this.accessTokenValue;
    if (this.accessTokenValue != tokenToSend) {
      this.accessTokenValue = tokenToSend;
      this.channels.forEach((channel) => {
        const payload = {
          access_token: tokenToSend,
          version: DEFAULT_VERSION
        };
        tokenToSend && channel.updateJoinPayload(payload);
        if (channel.joinedOnce && channel._isJoined()) {
          channel._push(CHANNEL_EVENTS.access_token, {
            access_token: tokenToSend
          });
        }
      });
    }
  }
  /**
   * Sends a heartbeat message if the socket is connected.
   */
  async sendHeartbeat() {
    var _a;
    if (!this.isConnected()) {
      this.heartbeatCallback("disconnected");
      return;
    }
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      this.heartbeatCallback("timeout");
      (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "hearbeat timeout");
      return;
    }
    this.pendingHeartbeatRef = this._makeRef();
    this.push({
      topic: "phoenix",
      event: "heartbeat",
      payload: {},
      ref: this.pendingHeartbeatRef
    });
    this.heartbeatCallback("sent");
    await this.setAuth();
  }
  onHeartbeat(callback) {
    this.heartbeatCallback = callback;
  }
  /**
   * Flushes send buffer
   */
  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback());
      this.sendBuffer = [];
    }
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic(topic) {
    let dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()));
    if (dupChannel) {
      this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.unsubscribe();
    }
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(channel) {
    this.channels = this.channels.filter((c) => c.topic !== channel.topic);
  }
  /**
   * Sets up connection handlers.
   *
   * @internal
   */
  setupConnection() {
    if (this.conn) {
      this.conn.binaryType = "arraybuffer";
      this.conn.onopen = () => this._onConnOpen();
      this.conn.onerror = (error) => this._onConnError(error);
      this.conn.onmessage = (event) => this._onConnMessage(event);
      this.conn.onclose = (event) => this._onConnClose(event);
    }
  }
  /** @internal */
  _onConnMessage(rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      let { topic, event, payload, ref } = msg;
      if (topic === "phoenix" && event === "phx_reply") {
        this.heartbeatCallback(msg.payload.status == "ok" ? "ok" : "error");
      }
      if (ref && ref === this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
      }
      this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
      Array.from(this.channels).filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
      this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
    });
  }
  /** @internal */
  _onConnOpen() {
    this.log("transport", `connected to ${this.endpointURL()}`);
    this.flushSendBuffer();
    this.reconnectTimer.reset();
    if (!this.worker) {
      this._startHeartbeat();
    } else {
      if (!this.workerRef) {
        this._startWorkerHeartbeat();
      }
    }
    this.stateChangeCallbacks.open.forEach((callback) => callback());
  }
  /** @internal */
  _startHeartbeat() {
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
  }
  /** @internal */
  _startWorkerHeartbeat() {
    if (this.workerUrl) {
      this.log("worker", `starting worker for from ${this.workerUrl}`);
    } else {
      this.log("worker", `starting default worker`);
    }
    const objectUrl = this._workerObjectUrl(this.workerUrl);
    this.workerRef = new Worker(objectUrl);
    this.workerRef.onerror = (error) => {
      this.log("worker", "worker error", error.message);
      this.workerRef.terminate();
    };
    this.workerRef.onmessage = (event) => {
      if (event.data.event === "keepAlive") {
        this.sendHeartbeat();
      }
    };
    this.workerRef.postMessage({
      event: "start",
      interval: this.heartbeatIntervalMs
    });
  }
  /** @internal */
  _onConnClose(event) {
    this.log("transport", "close", event);
    this._triggerChanError();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.reconnectTimer.scheduleTimeout();
    this.stateChangeCallbacks.close.forEach((callback) => callback(event));
  }
  /** @internal */
  _onConnError(error) {
    this.log("transport", `${error}`);
    this._triggerChanError();
    this.stateChangeCallbacks.error.forEach((callback) => callback(error));
  }
  /** @internal */
  _triggerChanError() {
    this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error));
  }
  /** @internal */
  _appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    const prefix = url.match(/\?/) ? "&" : "?";
    const query = new URLSearchParams(params);
    return `${url}${prefix}${query}`;
  }
  _workerObjectUrl(url) {
    let result_url;
    if (url) {
      result_url = url;
    } else {
      const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
      result_url = URL.createObjectURL(blob);
    }
    return result_url;
  }
}
class StorageError extends Error {
  constructor(message) {
    super(message);
    this.__isStorageError = true;
    this.name = "StorageError";
  }
}
function isStorageError(error) {
  return typeof error === "object" && error !== null && "__isStorageError" in error;
}
class StorageApiError extends StorageError {
  constructor(message, status) {
    super(message);
    this.name = "StorageApiError";
    this.status = status;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
class StorageUnknownError extends StorageError {
  constructor(message, originalError) {
    super(message);
    this.name = "StorageUnknownError";
    this.originalError = originalError;
  }
}
var __awaiter$6 = function(thisArg, _arguments, P, generator) {
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
};
const resolveFetch$2 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => __vitePreload(async () => {
      const { default: fetch2 } = await Promise.resolve().then(() => browser);
      return { default: fetch2 };
    }, true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const resolveResponse = () => __awaiter$6(void 0, void 0, void 0, function* () {
  if (typeof Response === "undefined") {
    return (yield __vitePreload(() => Promise.resolve().then(() => browser), true ? void 0 : void 0)).Response;
  }
  return Response;
});
const recursiveToCamel = (item) => {
  if (Array.isArray(item)) {
    return item.map((el) => recursiveToCamel(el));
  } else if (typeof item === "function" || item !== Object(item)) {
    return item;
  }
  const result = {};
  Object.entries(item).forEach(([key, value]) => {
    const newKey = key.replace(/([-_][a-z])/gi, (c) => c.toUpperCase().replace(/[-_]/g, ""));
    result[newKey] = recursiveToCamel(value);
  });
  return result;
};
var __awaiter$5 = function(thisArg, _arguments, P, generator) {
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
};
const _getErrorMessage$1 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const handleError$1 = (error, reject, options) => __awaiter$5(void 0, void 0, void 0, function* () {
  const Res = yield resolveResponse();
  if (error instanceof Res && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
    error.json().then((err) => {
      reject(new StorageApiError(_getErrorMessage$1(err), error.status || 500));
    }).catch((err) => {
      reject(new StorageUnknownError(_getErrorMessage$1(err), err));
    });
  } else {
    reject(new StorageUnknownError(_getErrorMessage$1(error), error));
  }
});
const _getRequestParams$1 = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
  if (body) {
    params.body = JSON.stringify(body);
  }
  return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest$1(fetcher, method, url, options, parameters, body) {
  return __awaiter$5(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams$1(method, options, parameters, body)).then((result) => {
        if (!result.ok)
          throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson)
          return result;
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError$1(error, reject, options));
    });
  });
}
function get(fetcher, url, options, parameters) {
  return __awaiter$5(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "GET", url, options, parameters);
  });
}
function post(fetcher, url, body, options, parameters) {
  return __awaiter$5(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "POST", url, options, parameters, body);
  });
}
function put(fetcher, url, body, options, parameters) {
  return __awaiter$5(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "PUT", url, options, parameters, body);
  });
}
function head(fetcher, url, options, parameters) {
  return __awaiter$5(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "HEAD", url, Object.assign(Object.assign({}, options), { noResolveJson: true }), parameters);
  });
}
function remove(fetcher, url, body, options, parameters) {
  return __awaiter$5(this, void 0, void 0, function* () {
    return _handleRequest$1(fetcher, "DELETE", url, options, parameters, body);
  });
}
var __awaiter$4 = function(thisArg, _arguments, P, generator) {
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
};
const DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: "name",
    order: "asc"
  }
};
const DEFAULT_FILE_OPTIONS = {
  cacheControl: "3600",
  contentType: "text/plain;charset=UTF-8",
  upsert: false
};
class StorageFileApi {
  constructor(url, headers = {}, bucketId, fetch2) {
    this.url = url;
    this.headers = headers;
    this.bucketId = bucketId;
    this.fetch = resolveFetch$2(fetch2);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate(method, path, fileBody, fileOptions) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        let body;
        const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
        let headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
        const metadata = options.metadata;
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          if (metadata) {
            body.append("metadata", this.encodeMetadata(metadata));
          }
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
          if (metadata) {
            body.append("metadata", this.encodeMetadata(metadata));
          }
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
          if (metadata) {
            headers["x-metadata"] = this.toBase64(this.encodeMetadata(metadata));
          }
        }
        if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) {
          headers = Object.assign(Object.assign({}, headers), fileOptions.headers);
        }
        const cleanPath = this._removeEmptyFolders(path);
        const _path = this._getFinalPath(cleanPath);
        const res = yield this.fetch(`${this.url}/object/${_path}`, Object.assign({ method, body, headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
        const data = yield res.json();
        if (res.ok) {
          return {
            data: { path: cleanPath, id: data.Id, fullPath: data.Key },
            error: null
          };
        } else {
          const error = data;
          return { data: null, error };
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload(path, fileBody, fileOptions) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
    });
  }
  /**
   * Upload a file with a token generated from `createSignedUploadUrl`.
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param token The token generated from `createSignedUploadUrl`
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadToSignedUrl(path, token, fileBody, fileOptions) {
    return __awaiter$4(this, void 0, void 0, function* () {
      const cleanPath = this._removeEmptyFolders(path);
      const _path = this._getFinalPath(cleanPath);
      const url = new URL(this.url + `/object/upload/sign/${_path}`);
      url.searchParams.set("token", token);
      try {
        let body;
        const options = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(options.upsert) });
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
        }
        const res = yield this.fetch(url.toString(), {
          method: "PUT",
          body,
          headers
        });
        const data = yield res.json();
        if (res.ok) {
          return {
            data: { path: cleanPath, fullPath: data.Key },
            error: null
          };
        } else {
          const error = data;
          return { data: null, error };
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed upload URL.
   * Signed upload URLs can be used to upload files to the bucket without further authentication.
   * They are valid for 2 hours.
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
   */
  createSignedUploadUrl(path, options) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        const headers = Object.assign({}, this.headers);
        if (options === null || options === void 0 ? void 0 : options.upsert) {
          headers["x-upsert"] = "true";
        }
        const data = yield post(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers });
        const url = new URL(this.url + data.url);
        const token = url.searchParams.get("token");
        if (!token) {
          throw new StorageError("No token returned by API");
        }
        return { data: { signedUrl: url.toString(), path, token }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update(path, fileBody, fileOptions) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
    });
  }
  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   * @param options The destination options.
   */
  move(fromPath, toPath, options) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/move`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   * @param options The destination options.
   */
  copy(fromPath, toPath, options) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/copy`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: this.headers });
        return { data: { path: data.Key }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  createSignedUrl(path, expiresIn, options) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
        data = { signedUrl };
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   */
  createSignedUrls(paths, expiresIn, options) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        return {
          data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
          error: null
        };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download(path, options) {
    return __awaiter$4(this, void 0, void 0, function* () {
      const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
      const renderPath = wantsTransformation ? "render/image/authenticated" : "object";
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
      const queryString = transformationQuery ? `?${transformationQuery}` : "";
      try {
        const _path = this._getFinalPath(path);
        const res = yield get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        });
        const data = yield res.blob();
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing file.
   * @param path
   */
  info(path) {
    return __awaiter$4(this, void 0, void 0, function* () {
      const _path = this._getFinalPath(path);
      try {
        const data = yield get(this.fetch, `${this.url}/object/info/${_path}`, {
          headers: this.headers
        });
        return { data: recursiveToCamel(data), error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Checks the existence of a file.
   * @param path
   */
  exists(path) {
    return __awaiter$4(this, void 0, void 0, function* () {
      const _path = this._getFinalPath(path);
      try {
        yield head(this.fetch, `${this.url}/object/${_path}`, {
          headers: this.headers
        });
        return { data: true, error: null };
      } catch (error) {
        if (isStorageError(error) && error instanceof StorageUnknownError) {
          const originalError = error.originalError;
          if ([400, 404].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) {
            return { data: false, error };
          }
        }
        throw error;
      }
    });
  }
  /**
   * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
   * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
   *
   * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
   * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  getPublicUrl(path, options) {
    const _path = this._getFinalPath(path);
    const _queryString = [];
    const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? "" : options.download}` : "";
    if (downloadQueryParam !== "") {
      _queryString.push(downloadQueryParam);
    }
    const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
    const renderPath = wantsTransformation ? "render/image" : "object";
    const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
    if (transformationQuery !== "") {
      _queryString.push(transformationQuery);
    }
    let queryString = _queryString.join("&");
    if (queryString !== "") {
      queryString = `?${queryString}`;
    }
    return {
      data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
    };
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove(paths) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(
  //   id: string
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await post(
  //       this.fetch,
  //       `${this.url}/metadata/${id}`,
  //       { ...meta },
  //       { headers: this.headers }
  //     )
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   */
  list(path, options, parameters) {
    return __awaiter$4(this, void 0, void 0, function* () {
      try {
        const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || "" });
        const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  encodeMetadata(metadata) {
    return JSON.stringify(metadata);
  }
  toBase64(data) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(data).toString("base64");
    }
    return btoa(data);
  }
  _getFinalPath(path) {
    return `${this.bucketId}/${path}`;
  }
  _removeEmptyFolders(path) {
    return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(transform) {
    const params = [];
    if (transform.width) {
      params.push(`width=${transform.width}`);
    }
    if (transform.height) {
      params.push(`height=${transform.height}`);
    }
    if (transform.resize) {
      params.push(`resize=${transform.resize}`);
    }
    if (transform.format) {
      params.push(`format=${transform.format}`);
    }
    if (transform.quality) {
      params.push(`quality=${transform.quality}`);
    }
    return params.join("&");
  }
}
const version$2 = "2.7.1";
const DEFAULT_HEADERS$2 = { "X-Client-Info": `storage-js/${version$2}` };
var __awaiter$3 = function(thisArg, _arguments, P, generator) {
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
};
class StorageBucketApi {
  constructor(url, headers = {}, fetch2) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$2), headers);
    this.fetch = resolveFetch$2(fetch2);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets() {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket(id) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   * @returns newly created bucket id
   */
  createBucket(id, options = {
    public: false
  }) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Updates a Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   */
  updateBucket(id, options) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield put(this.fetch, `${this.url}/bucket/${id}`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket(id) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket(id) {
    return __awaiter$3(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
}
class StorageClient extends StorageBucketApi {
  constructor(url, headers = {}, fetch2) {
    super(url, headers, fetch2);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(id) {
    return new StorageFileApi(this.url, this.headers, id, this.fetch);
  }
}
const version$1 = "2.50.3";
let JS_ENV = "";
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
} else if (typeof document !== "undefined") {
  JS_ENV = "web";
} else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  JS_ENV = "react-native";
} else {
  JS_ENV = "node";
}
const DEFAULT_HEADERS$1 = { "X-Client-Info": `supabase-js-${JS_ENV}/${version$1}` };
const DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS$1
};
const DEFAULT_DB_OPTIONS = {
  schema: "public"
};
const DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
const DEFAULT_REALTIME_OPTIONS = {};
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
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
};
const resolveFetch$1 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = nodeFetch;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return Headers$1;
  }
  return Headers;
};
const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
  const fetch2 = resolveFetch$1(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init) => __awaiter$2(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey);
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch2(input, Object.assign(Object.assign({}, init), { headers }));
  });
};
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
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
};
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
function applySettingDefaults(options, defaults) {
  var _a, _b;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  const result = {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS2 === null || DEFAULT_GLOBAL_OPTIONS2 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS2.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
    accessToken: () => __awaiter$1(this, void 0, void 0, function* () {
      return "";
    })
  };
  if (options.accessToken) {
    result.accessToken = options.accessToken;
  } else {
    delete result.accessToken;
  }
  return result;
}
const version = "2.70.0";
const AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
const AUTO_REFRESH_TICK_THRESHOLD = 3;
const EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
const GOTRUE_URL = "http://localhost:9999";
const STORAGE_KEY = "supabase.auth.token";
const DEFAULT_HEADERS = { "X-Client-Info": `gotrue-js/${version}` };
const API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
const API_VERSIONS = {
  "2024-01-01": {
    timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
    name: "2024-01-01"
  }
};
const BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
const JWKS_TTL = 6e5;
class AuthError extends Error {
  constructor(message, status, code) {
    super(message);
    this.__isAuthError = true;
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
}
function isAuthError(error) {
  return typeof error === "object" && error !== null && "__isAuthError" in error;
}
class AuthApiError extends AuthError {
  constructor(message, status, code) {
    super(message, status, code);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
  }
}
function isAuthApiError(error) {
  return isAuthError(error) && error.name === "AuthApiError";
}
class AuthUnknownError extends AuthError {
  constructor(message, originalError) {
    super(message);
    this.name = "AuthUnknownError";
    this.originalError = originalError;
  }
}
class CustomAuthError extends AuthError {
  constructor(message, name, status, code) {
    super(message, status, code);
    this.name = name;
    this.status = status;
  }
}
class AuthSessionMissingError extends CustomAuthError {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
  }
}
function isAuthSessionMissingError(error) {
  return isAuthError(error) && error.name === "AuthSessionMissingError";
}
class AuthInvalidTokenResponseError extends CustomAuthError {
  constructor() {
    super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
  }
}
class AuthInvalidCredentialsError extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidCredentialsError", 400, void 0);
  }
}
class AuthImplicitGrantRedirectError extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthImplicitGrantRedirectError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
function isAuthImplicitGrantRedirectError(error) {
  return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
}
class AuthPKCEGrantCodeExchangeError extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
class AuthRetryableFetchError extends CustomAuthError {
  constructor(message, status) {
    super(message, "AuthRetryableFetchError", status, void 0);
  }
}
function isAuthRetryableFetchError(error) {
  return isAuthError(error) && error.name === "AuthRetryableFetchError";
}
class AuthWeakPasswordError extends CustomAuthError {
  constructor(message, status, reasons) {
    super(message, "AuthWeakPasswordError", status, "weak_password");
    this.reasons = reasons;
  }
}
class AuthInvalidJwtError extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
  }
}
const TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
const IGNORE_BASE64URL = " 	\n\r=".split("");
const FROM_BASE64URL = (() => {
  const charMap = new Array(128);
  for (let i = 0; i < charMap.length; i += 1) {
    charMap[i] = -1;
  }
  for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
    charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
  }
  for (let i = 0; i < TO_BASE64URL.length; i += 1) {
    charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
  }
  return charMap;
})();
function byteToBase64URL(byte, state, emit) {
  if (byte !== null) {
    state.queue = state.queue << 8 | byte;
    state.queuedBits += 8;
    while (state.queuedBits >= 6) {
      const pos = state.queue >> state.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state.queuedBits -= 6;
    }
  } else if (state.queuedBits > 0) {
    state.queue = state.queue << 6 - state.queuedBits;
    state.queuedBits = 6;
    while (state.queuedBits >= 6) {
      const pos = state.queue >> state.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state.queuedBits -= 6;
    }
  }
}
function byteFromBase64URL(charCode, state, emit) {
  const bits = FROM_BASE64URL[charCode];
  if (bits > -1) {
    state.queue = state.queue << 6 | bits;
    state.queuedBits += 6;
    while (state.queuedBits >= 8) {
      emit(state.queue >> state.queuedBits - 8 & 255);
      state.queuedBits -= 8;
    }
  } else if (bits === -2) {
    return;
  } else {
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
  }
}
function stringFromBase64URL(str) {
  const conv = [];
  const utf8Emit = (codepoint) => {
    conv.push(String.fromCodePoint(codepoint));
  };
  const utf8State = {
    utf8seq: 0,
    codepoint: 0
  };
  const b64State = { queue: 0, queuedBits: 0 };
  const byteEmit = (byte) => {
    stringFromUTF8(byte, utf8State, utf8Emit);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), b64State, byteEmit);
  }
  return conv.join("");
}
function codepointToUTF8(codepoint, emit) {
  if (codepoint <= 127) {
    emit(codepoint);
    return;
  } else if (codepoint <= 2047) {
    emit(192 | codepoint >> 6);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 65535) {
    emit(224 | codepoint >> 12);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 1114111) {
    emit(240 | codepoint >> 18);
    emit(128 | codepoint >> 12 & 63);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  }
  throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
}
function stringToUTF8(str, emit) {
  for (let i = 0; i < str.length; i += 1) {
    let codepoint = str.charCodeAt(i);
    if (codepoint > 55295 && codepoint <= 56319) {
      const highSurrogate = (codepoint - 55296) * 1024 & 65535;
      const lowSurrogate = str.charCodeAt(i + 1) - 56320 & 65535;
      codepoint = (lowSurrogate | highSurrogate) + 65536;
      i += 1;
    }
    codepointToUTF8(codepoint, emit);
  }
}
function stringFromUTF8(byte, state, emit) {
  if (state.utf8seq === 0) {
    if (byte <= 127) {
      emit(byte);
      return;
    }
    for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
      if ((byte >> 7 - leadingBit & 1) === 0) {
        state.utf8seq = leadingBit;
        break;
      }
    }
    if (state.utf8seq === 2) {
      state.codepoint = byte & 31;
    } else if (state.utf8seq === 3) {
      state.codepoint = byte & 15;
    } else if (state.utf8seq === 4) {
      state.codepoint = byte & 7;
    } else {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.utf8seq -= 1;
  } else if (state.utf8seq > 0) {
    if (byte <= 127) {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.codepoint = state.codepoint << 6 | byte & 63;
    state.utf8seq -= 1;
    if (state.utf8seq === 0) {
      emit(state.codepoint);
    }
  }
}
function base64UrlToUint8Array(str) {
  const result = [];
  const state = { queue: 0, queuedBits: 0 };
  const onByte = (byte) => {
    result.push(byte);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), state, onByte);
  }
  return new Uint8Array(result);
}
function stringToUint8Array(str) {
  const result = [];
  stringToUTF8(str, (byte) => result.push(byte));
  return new Uint8Array(result);
}
function bytesToBase64URL(bytes) {
  const result = [];
  const state = { queue: 0, queuedBits: 0 };
  const onChar = (char) => {
    result.push(char);
  };
  bytes.forEach((byte) => byteToBase64URL(byte, state, onChar));
  byteToBase64URL(null, state, onChar);
  return result.join("");
}
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3);
  return timeNow + expiresIn;
}
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
const localStorageWriteTests = {
  tested: false,
  writable: false
};
const supportsLocalStorage = () => {
  if (!isBrowser()) {
    return false;
  }
  try {
    if (typeof globalThis.localStorage !== "object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  if (localStorageWriteTests.tested) {
    return localStorageWriteTests.writable;
  }
  const randomKey = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(randomKey, randomKey);
    globalThis.localStorage.removeItem(randomKey);
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = true;
  } catch (e) {
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = false;
  }
  return localStorageWriteTests.writable;
};
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key) => {
        result[key] = value;
      });
    } catch (e) {
    }
  }
  url.searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
const resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => __vitePreload(async () => {
      const { default: fetch2 } = await Promise.resolve().then(() => browser);
      return { default: fetch2 };
    }, true ? void 0 : void 0).then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const looksLikeFetchResponse = (maybeResponse) => {
  return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
};
const setItemAsync = async (storage, key, data) => {
  await storage.setItem(key, JSON.stringify(data));
};
const getItemAsync = async (storage, key) => {
  const value = await storage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
};
const removeItemAsync = async (storage, key) => {
  await storage.removeItem(key);
};
class Deferred {
  constructor() {
    this.promise = new Deferred.promiseConstructor((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}
Deferred.promiseConstructor = Promise;
function decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthInvalidJwtError("Invalid JWT structure");
  }
  for (let i = 0; i < parts.length; i++) {
    if (!BASE64URL_REGEX.test(parts[i])) {
      throw new AuthInvalidJwtError("JWT not in base64url format");
    }
  }
  const data = {
    // using base64url lib
    header: JSON.parse(stringFromBase64URL(parts[0])),
    payload: JSON.parse(stringFromBase64URL(parts[1])),
    signature: base64UrlToUint8Array(parts[2]),
    raw: {
      header: parts[0],
      payload: parts[1]
    }
  };
  return data;
}
async function sleep(time) {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time);
  });
}
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array = new Uint32Array(verifierLength);
  if (typeof crypto === "undefined") {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const charSetLen = charSet.length;
    let verifier = "";
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}
async function sha256(randomString) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(randomString);
  const hash = await crypto.subtle.digest("SHA-256", encodedData);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
}
async function generatePKCEChallenge(verifier) {
  const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
  if (!hasCryptoSupport) {
    console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
    return verifier;
  }
  const hashed = await sha256(verifier);
  return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
  const codeVerifier = generatePKCEVerifier();
  let storedCodeVerifier = codeVerifier;
  if (isPasswordRecovery) {
    storedCodeVerifier += "/PASSWORD_RECOVERY";
  }
  await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
  const codeChallenge = await generatePKCEChallenge(codeVerifier);
  const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
  return [codeChallenge, codeChallengeMethod];
}
const API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function parseResponseAPIVersion(response) {
  const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
  if (!apiVersion) {
    return null;
  }
  if (!apiVersion.match(API_VERSION_REGEX)) {
    return null;
  }
  try {
    const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
    return date;
  } catch (e) {
    return null;
  }
}
function validateExp(exp) {
  if (!exp) {
    throw new Error("Missing exp claim");
  }
  const timeNow = Math.floor(Date.now() / 1e3);
  if (exp <= timeNow) {
    throw new Error("JWT has expired");
  }
}
function getAlgorithm(alg) {
  switch (alg) {
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      };
    case "ES256":
      return {
        name: "ECDSA",
        namedCurve: "P-256",
        hash: { name: "SHA-256" }
      };
    default:
      throw new Error("Invalid alg claim");
  }
}
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function validateUUID(str) {
  if (!UUID_REGEX.test(str)) {
    throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
  }
}
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const NETWORK_ERROR_CODES = [502, 503, 504];
async function handleError(error) {
  var _a;
  if (!looksLikeFetchResponse(error)) {
    throw new AuthRetryableFetchError(_getErrorMessage(error), 0);
  }
  if (NETWORK_ERROR_CODES.includes(error.status)) {
    throw new AuthRetryableFetchError(_getErrorMessage(error), error.status);
  }
  let data;
  try {
    data = await error.json();
  } catch (e) {
    throw new AuthUnknownError(_getErrorMessage(e), e);
  }
  let errorCode = void 0;
  const responseAPIVersion = parseResponseAPIVersion(error);
  if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
    errorCode = data.code;
  } else if (typeof data === "object" && data && typeof data.error_code === "string") {
    errorCode = data.error_code;
  }
  if (!errorCode) {
    if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
      throw new AuthWeakPasswordError(_getErrorMessage(data), error.status, data.weak_password.reasons);
    }
  } else if (errorCode === "weak_password") {
    throw new AuthWeakPasswordError(_getErrorMessage(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
  } else if (errorCode === "session_not_found") {
    throw new AuthSessionMissingError();
  }
  throw new AuthApiError(_getErrorMessage(data), error.status || 500, errorCode);
}
const _getRequestParams = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
  var _a;
  const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
  if (!headers[API_VERSION_HEADER_NAME]) {
    headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
  }
  if (options === null || options === void 0 ? void 0 : options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  }
  const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
  if (options === null || options === void 0 ? void 0 : options.redirectTo) {
    qs["redirect_to"] = options.redirectTo;
  }
  const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
  const data = await _handleRequest(fetcher, method, url + queryString, {
    headers,
    noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
  }, {}, options === null || options === void 0 ? void 0 : options.body);
  return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
}
async function _handleRequest(fetcher, method, url, options, parameters, body) {
  const requestParams = _getRequestParams(method, options, parameters, body);
  let result;
  try {
    result = await fetcher(url, Object.assign({}, requestParams));
  } catch (e) {
    console.error(e);
    throw new AuthRetryableFetchError(_getErrorMessage(e), 0);
  }
  if (!result.ok) {
    await handleError(result);
  }
  if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError(e);
  }
}
function _sessionResponse(data) {
  var _a;
  let session = null;
  if (hasSession(data)) {
    session = Object.assign({}, data);
    if (!data.expires_at) {
      session.expires_at = expiresAt(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { session, user }, error: null };
}
function _sessionResponsePassword(data) {
  const response = _sessionResponse(data);
  if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
    response.data.weak_password = data.weak_password;
  }
  return response;
}
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { user }, error: null };
}
function _ssoResponse(data) {
  return { data, error: null };
}
function _generateLinkResponse(data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest$1(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
function _noResolveJsonResponse(data) {
  return data;
}
function hasSession(data) {
  return data.access_token && data.refresh_token && data.expires_in;
}
const SIGN_OUT_SCOPES = ["global", "local", "others"];
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
class GoTrueAdminApi {
  constructor({ url = "", headers = {}, fetch: fetch2 }) {
    this.url = url;
    this.headers = headers;
    this.fetch = resolveFetch(fetch2);
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   */
  async signOut(jwt, scope = SIGN_OUT_SCOPES[0]) {
    if (SIGN_OUT_SCOPES.indexOf(scope) < 0) {
      throw new Error(`@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(", ")}`);
    }
    try {
      await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true
      });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(email, options = {}) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/invite`, {
        body: { email, data: options.data },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  async generateLink(params) {
    try {
      const { options } = params, rest = __rest(params, ["options"]);
      const body = Object.assign(Object.assign({}, rest), options);
      if ("newEmail" in rest) {
        body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
        delete body["newEmail"];
      }
      return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
        body,
        headers: this.headers,
        xform: _generateLinkResponse,
        redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return {
          data: {
            properties: null,
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async createUser(attributes) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  async listUsers(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const pagination = { nextPage: null, lastPage: 0, total: 0 };
      const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
          per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
        },
        xform: _noResolveJsonResponse
      });
      if (response.error)
        throw response.error;
      const users = await response.json();
      const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
      const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
      if (links.length > 0) {
        links.forEach((link) => {
          const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
          const rel = JSON.parse(link.split(";")[1].split("=")[1]);
          pagination[`${rel}Page`] = page;
        });
        pagination.total = parseInt(total);
      }
      return { data: Object.assign(Object.assign({}, users), pagination), error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { users: [] }, error };
      }
      throw error;
    }
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async getUserById(uid) {
    validateUUID(uid);
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async updateUserById(uid, attributes) {
    validateUUID(uid);
    try {
      return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async deleteUser(id, shouldSoftDelete = false) {
    validateUUID(id);
    try {
      return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete
        },
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  async _listFactors(params) {
    validateUUID(params.userId);
    try {
      const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
        headers: this.headers,
        xform: (factors) => {
          return { data: { factors }, error: null };
        }
      });
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _deleteFactor(params) {
    validateUUID(params.userId);
    validateUUID(params.id);
    try {
      const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
        headers: this.headers
      });
      return { data, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
}
const localStorageAdapter = {
  getItem: (key) => {
    if (!supportsLocalStorage()) {
      return null;
    }
    return globalThis.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (!supportsLocalStorage()) {
      return;
    }
    globalThis.localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (!supportsLocalStorage()) {
      return;
    }
    globalThis.localStorage.removeItem(key);
  }
};
function memoryLocalStorageAdapter(store = {}) {
  return {
    getItem: (key) => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
}
function polyfillGlobalThis() {
  if (typeof globalThis === "object")
    return;
  try {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: function() {
        return this;
      },
      configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== "undefined") {
      self.globalThis = self;
    }
  }
}
const internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
};
class LockAcquireTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.isAcquireTimeout = true;
  }
}
class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {
}
async function navigatorLock(name, acquireTimeout, fn) {
  if (internals.debug) {
    console.log("@supabase/gotrue-js: navigatorLock: acquire lock", name, acquireTimeout);
  }
  const abortController = new globalThis.AbortController();
  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock acquire timed out", name);
      }
    }, acquireTimeout);
  }
  return await Promise.resolve().then(() => globalThis.navigator.locks.request(name, acquireTimeout === 0 ? {
    mode: "exclusive",
    ifAvailable: true
  } : {
    mode: "exclusive",
    signal: abortController.signal
  }, async (lock) => {
    if (lock) {
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock: acquired", name, lock.name);
      }
      try {
        return await fn();
      } finally {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: released", name, lock.name);
        }
      }
    } else {
      if (acquireTimeout === 0) {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: not immediately available", name);
        }
        throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
      } else {
        if (internals.debug) {
          try {
            const result = await globalThis.navigator.locks.query();
            console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(result, null, "  "));
          } catch (e) {
            console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e);
          }
        }
        console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request");
        return await fn();
      }
    }
  }));
}
polyfillGlobalThis();
const DEFAULT_OPTIONS = {
  url: GOTRUE_URL,
  storageKey: STORAGE_KEY,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: DEFAULT_HEADERS,
  flowType: "implicit",
  debug: false,
  hasCustomAuthorizationHeader: false
};
async function lockNoOp(name, acquireTimeout, fn) {
  return await fn();
}
class GoTrueClient {
  /**
   * Create a new client for use in the browser.
   */
  constructor(options) {
    var _a, _b;
    this.memoryStorage = null;
    this.stateChangeEmitters = /* @__PURE__ */ new Map();
    this.autoRefreshTicker = null;
    this.visibilityChangedCallback = null;
    this.refreshingDeferred = null;
    this.initializePromise = null;
    this.detectSessionInUrl = true;
    this.hasCustomAuthorizationHeader = false;
    this.suppressGetSessionWarning = false;
    this.lockAcquired = false;
    this.pendingInLock = [];
    this.broadcastChannel = null;
    this.logger = console.log;
    this.instanceID = GoTrueClient.nextInstanceID;
    GoTrueClient.nextInstanceID += 1;
    if (this.instanceID > 0 && isBrowser()) {
      console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
    }
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.logDebugMessages = !!settings.debug;
    if (typeof settings.debug === "function") {
      this.logger = settings.debug;
    }
    this.persistSession = settings.persistSession;
    this.storageKey = settings.storageKey;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.admin = new GoTrueAdminApi({
      url: settings.url,
      headers: settings.headers,
      fetch: settings.fetch
    });
    this.url = settings.url;
    this.headers = settings.headers;
    this.fetch = resolveFetch(settings.fetch);
    this.lock = settings.lock || lockNoOp;
    this.detectSessionInUrl = settings.detectSessionInUrl;
    this.flowType = settings.flowType;
    this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
    if (settings.lock) {
      this.lock = settings.lock;
    } else if (isBrowser() && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.locks)) {
      this.lock = navigatorLock;
    } else {
      this.lock = lockNoOp;
    }
    this.jwks = { keys: [] };
    this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
    this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    };
    if (this.persistSession) {
      if (settings.storage) {
        this.storage = settings.storage;
      } else {
        if (supportsLocalStorage()) {
          this.storage = localStorageAdapter;
        } else {
          this.memoryStorage = {};
          this.storage = memoryLocalStorageAdapter(this.memoryStorage);
        }
      }
    } else {
      this.memoryStorage = {};
      this.storage = memoryLocalStorageAdapter(this.memoryStorage);
    }
    if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (e) {
        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
      }
      (_b = this.broadcastChannel) === null || _b === void 0 ? void 0 : _b.addEventListener("message", async (event) => {
        this._debug("received broadcast notification from other tab or client", event);
        await this._notifyAllSubscribers(event.data.event, event.data.session, false);
      });
    }
    this.initialize();
  }
  _debug(...args) {
    if (this.logDebugMessages) {
      this.logger(`GoTrueClient@${this.instanceID} (${version}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...args);
    }
    return this;
  }
  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  async initialize() {
    if (this.initializePromise) {
      return await this.initializePromise;
    }
    this.initializePromise = (async () => {
      return await this._acquireLock(-1, async () => {
        return await this._initialize();
      });
    })();
    return await this.initializePromise;
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  async _initialize() {
    var _a;
    try {
      const params = parseParametersFromURL(window.location.href);
      let callbackUrlType = "none";
      if (this._isImplicitGrantCallback(params)) {
        callbackUrlType = "implicit";
      } else if (await this._isPKCECallback(params)) {
        callbackUrlType = "pkce";
      }
      if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
        const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
        if (error) {
          this._debug("#_initialize()", "error detecting session from URL", error);
          if (isAuthImplicitGrantRedirectError(error)) {
            const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
            if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
              return { error };
            }
          }
          await this._removeSession();
          return { error };
        }
        const { session, redirectType } = data;
        this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
        await this._saveSession(session);
        setTimeout(async () => {
          if (redirectType === "recovery") {
            await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
        }, 0);
        return { error: null };
      }
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { error };
      }
      return {
        error: new AuthUnknownError("Unexpected error during initialization", error)
      };
    } finally {
      await this._handleVisibilityChange();
      this._debug("#_initialize()", "end");
    }
  }
  /**
   * Creates a new anonymous user.
   *
   * @returns A session where the is_anonymous claim in the access token JWT set to true
   */
  async signInAnonymously(credentials) {
    var _a, _b, _c;
    try {
      const res = await _request(this.fetch, "POST", `${this.url}/signup`, {
        headers: this.headers,
        body: {
          data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
          gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error || !data) {
        return { data: { user: null, session: null }, error };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */
  async signUp(credentials) {
    var _a, _b, _c;
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: {
            email,
            password,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          xform: _sessionResponse
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone,
            password,
            data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
            channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error || !data) {
        return { data: { user: null, session: null }, error };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   */
  async signInWithPassword(credentials) {
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            phone,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return { data: { user: null, session: null }, error: new AuthInvalidTokenResponseError() };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return {
        data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
        error
      };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user via a third-party provider.
   * This method supports the PKCE flow.
   */
  async signInWithOAuth(credentials) {
    var _a, _b, _c, _d;
    return await this._handleProviderSignIn(credentials.provider, {
      redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
      scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
      queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
      skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   */
  async exchangeCodeForSession(authCode) {
    await this.initializePromise;
    return this._acquireLock(-1, async () => {
      return this._exchangeCodeForSession(authCode);
    });
  }
  /**
   * Signs in a user by verifying a message signed by the user's private key.
   * Only Solana supported at this time, using the Sign in with Solana standard.
   */
  async signInWithWeb3(credentials) {
    const { chain } = credentials;
    if (chain === "solana") {
      return await this.signInWithSolana(credentials);
    }
    throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
  }
  async signInWithSolana(credentials) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    let message;
    let signature;
    if ("message" in credentials) {
      message = credentials.message;
      signature = credentials.signature;
    } else {
      const { chain, wallet, statement, options } = credentials;
      let resolvedWallet;
      if (!isBrowser()) {
        if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
          throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
        }
        resolvedWallet = wallet;
      } else if (typeof wallet === "object") {
        resolvedWallet = wallet;
      } else {
        const windowAny = window;
        if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) {
          resolvedWallet = windowAny.solana;
        } else {
          throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
        }
      }
      const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
      if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
        const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
          // non-overridable properties
          version: "1",
          domain: url.host,
          uri: url.href
        }), statement ? { statement } : null));
        let outputToProcess;
        if (Array.isArray(output) && output[0] && typeof output[0] === "object") {
          outputToProcess = output[0];
        } else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) {
          outputToProcess = output;
        } else {
          throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
        }
        if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
          message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
          signature = outputToProcess.signature;
        } else {
          throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
        }
      } else {
        if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") {
          throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
        }
        message = [
          `${url.host} wants you to sign in with your Solana account:`,
          resolvedWallet.publicKey.toBase58(),
          ...statement ? ["", statement, ""] : [""],
          "Version: 1",
          `URI: ${url.href}`,
          `Issued At: ${(_c = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c !== void 0 ? _c : (/* @__PURE__ */ new Date()).toISOString()}`,
          ...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
          ...((_e = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _e === void 0 ? void 0 : _e.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
          ...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
          ...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
          ...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
          ...((_k = (_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.resources) === null || _k === void 0 ? void 0 : _k.length) ? [
            "Resources",
            ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)
          ] : []
        ].join("\n");
        const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
        if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) {
          throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
        }
        signature = maybeSignature;
      }
    }
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
        headers: this.headers,
        body: Object.assign({ chain: "solana", message, signature: bytesToBase64URL(signature) }, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data: Object.assign({}, data), error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  async _exchangeCodeForSession(authCode) {
    const storageItem = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
        headers: this.headers,
        body: {
          auth_code: authCode,
          code_verifier: codeVerifier
        },
        xform: _sessionResponse
      });
      await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null, redirectType: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null, redirectType: null }, error };
      }
      throw error;
    }
  }
  /**
   * Allows signing in with an OIDC ID token. The authentication provider used
   * should be enabled and configured.
   */
  async signInWithIdToken(credentials) {
    try {
      const { options, provider, token, access_token, nonce } = credentials;
      const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
        headers: this.headers,
        body: {
          provider,
          id_token: token,
          access_token,
          nonce,
          gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   *
   * Do note that you will need to configure a Whatsapp sender on Twilio
   * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
   * channel is not supported on other providers
   * at this time.
   * This method supports PKCE when an email is passed.
   */
  async signInWithOtp(credentials) {
    var _a, _b, _c, _d, _e;
    try {
      if ("email" in credentials) {
        const { email, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      }
      if ("phone" in credentials) {
        const { phone, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            phone,
            data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
            create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : "sms"
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
   */
  async verifyOtp(params) {
    var _a, _b;
    try {
      let redirectTo = void 0;
      let captchaToken = void 0;
      if ("options" in params) {
        redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
        captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
      }
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
        redirectTo,
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("An error occurred on token verification.");
      }
      const session = data.session;
      const user = data.user;
      if (session === null || session === void 0 ? void 0 : session.access_token) {
        await this._saveSession(session);
        await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   */
  async signInWithSSO(params) {
    var _a, _b, _c;
    try {
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === "pkce") {
        ;
        [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
      }
      return await _request(this.fetch, "POST", `${this.url}/sso`, {
        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
        headers: this.headers,
        xform: _ssoResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends a reauthentication OTP to the user's email or phone number.
   * Requires the user to be signed-in.
   */
  async reauthenticate() {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._reauthenticate();
    });
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError)
          throw sessionError;
        if (!session)
          throw new AuthSessionMissingError();
        const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: session.access_token
        });
        return { data: { user: null, session: null }, error };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   */
  async resend(credentials) {
    try {
      const endpoint = `${this.url}/resend`;
      if ("email" in credentials) {
        const { email, type, options } = credentials;
        const { error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            email,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      } else if ("phone" in credentials) {
        const { phone, type, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            phone,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns the session, refreshing it if necessary.
   *
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   *
   * **IMPORTANT:** This method loads values directly from the storage attached
   * to the client. If that storage is based on request cookies for example,
   * the values in it may not be authentic and therefore it's strongly advised
   * against using this method and its results in such circumstances. A warning
   * will be emitted if this is detected. Use {@link #getUser()} instead.
   */
  async getSession() {
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return this._useSession(async (result2) => {
        return result2;
      });
    });
    return result;
  }
  /**
   * Acquires a global lock based on the storage key.
   */
  async _acquireLock(acquireTimeout, fn) {
    this._debug("#_acquireLock", "begin", acquireTimeout);
    try {
      if (this.lockAcquired) {
        const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
        const result = (async () => {
          await last;
          return await fn();
        })();
        this.pendingInLock.push((async () => {
          try {
            await result;
          } catch (e) {
          }
        })());
        return result;
      }
      return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
        this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
        try {
          this.lockAcquired = true;
          const result = fn();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (e) {
            }
          })());
          await result;
          while (this.pendingInLock.length) {
            const waitOn = [...this.pendingInLock];
            await Promise.all(waitOn);
            this.pendingInLock.splice(0, waitOn.length);
          }
          return await result;
        } finally {
          this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
          this.lockAcquired = false;
        }
      });
    } finally {
      this._debug("#_acquireLock", "end");
    }
  }
  /**
   * Use instead of {@link #getSession} inside the library. It is
   * semantically usually what you want, as getting a session involves some
   * processing afterwards that requires only one client operating on the
   * session at once across multiple tabs or processes.
   */
  async _useSession(fn) {
    this._debug("#_useSession", "begin");
    try {
      const result = await this.__loadSession();
      return await fn(result);
    } finally {
      this._debug("#_useSession", "end");
    }
  }
  /**
   * NEVER USE DIRECTLY!
   *
   * Always use {@link #_useSession}.
   */
  async __loadSession() {
    this._debug("#__loadSession()", "begin");
    if (!this.lockAcquired) {
      this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
    }
    try {
      let currentSession = null;
      const maybeSession = await getItemAsync(this.storage, this.storageKey);
      this._debug("#getSession()", "session from storage", maybeSession);
      if (maybeSession !== null) {
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          this._debug("#getSession()", "session from storage is not valid");
          await this._removeSession();
        }
      }
      if (!currentSession) {
        return { data: { session: null }, error: null };
      }
      const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
      this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
      if (!hasExpired) {
        if (this.storage.isServer) {
          let suppressWarning = this.suppressGetSessionWarning;
          const proxySession = new Proxy(currentSession, {
            get: (target, prop, receiver) => {
              if (!suppressWarning && prop === "user") {
                console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
                suppressWarning = true;
                this.suppressGetSessionWarning = true;
              }
              return Reflect.get(target, prop, receiver);
            }
          });
          currentSession = proxySession;
        }
        return { data: { session: currentSession }, error: null };
      }
      const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
      if (error) {
        return { data: { session: null }, error };
      }
      return { data: { session }, error: null };
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  /**
   * Gets the current user details if there is an existing session. This method
   * performs a network request to the Supabase Auth server, so the returned
   * value is authentic and can be used to base authorization rules on.
   *
   * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
   */
  async getUser(jwt) {
    if (jwt) {
      return await this._getUser(jwt);
    }
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return await this._getUser();
    });
    return result;
  }
  async _getUser(jwt) {
    try {
      if (jwt) {
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt,
          xform: _userResponse
        });
      }
      return await this._useSession(async (result) => {
        var _a, _b, _c;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
          return { data: { user: null }, error: new AuthSessionMissingError() };
        }
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
          xform: _userResponse
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        if (isAuthSessionMissingError(error)) {
          await this._removeSession();
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        }
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates user data for a logged in user.
   */
  async updateUser(attributes, options = {}) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._updateUser(attributes, options);
    });
  }
  async _updateUser(attributes, options = {}) {
    try {
      return await this._useSession(async (result) => {
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          throw new AuthSessionMissingError();
        }
        const session = sessionData.session;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce" && attributes.email != null) {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
          jwt: session.access_token,
          xform: _userResponse
        });
        if (userError)
          throw userError;
        session.user = data.user;
        await this._saveSession(session);
        await this._notifyAllSubscribers("USER_UPDATED", session);
        return { data: { user: session.user }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  async setSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._setSession(currentSession);
    });
  }
  async _setSession(currentSession) {
    try {
      if (!currentSession.access_token || !currentSession.refresh_token) {
        throw new AuthSessionMissingError();
      }
      const timeNow = Date.now() / 1e3;
      let expiresAt2 = timeNow;
      let hasExpired = true;
      let session = null;
      const { payload } = decodeJWT(currentSession.access_token);
      if (payload.exp) {
        expiresAt2 = payload.exp;
        hasExpired = expiresAt2 <= timeNow;
      }
      if (hasExpired) {
        const { session: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!refreshedSession) {
          return { data: { user: null, session: null }, error: null };
        }
        session = refreshedSession;
      } else {
        const { data, error } = await this._getUser(currentSession.access_token);
        if (error) {
          throw error;
        }
        session = {
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
          user: data.user,
          token_type: "bearer",
          expires_in: expiresAt2 - timeNow,
          expires_at: expiresAt2
        };
        await this._saveSession(session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user: session.user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  async refreshSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._refreshSession(currentSession);
    });
  }
  async _refreshSession(currentSession) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        if (!currentSession) {
          const { data, error: error2 } = result;
          if (error2) {
            throw error2;
          }
          currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
        }
        if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
          throw new AuthSessionMissingError();
        }
        const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!session) {
          return { data: { user: null, session: null }, error: null };
        }
        return { data: { user: session.user, session }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Gets the session data from a URL string
   */
  async _getSessionFromURL(params, callbackUrlType) {
    try {
      if (!isBrowser())
        throw new AuthImplicitGrantRedirectError("No browser detected.");
      if (params.error || params.error_description || params.error_code) {
        throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
          error: params.error || "unspecified_error",
          code: params.error_code || "unspecified_code"
        });
      }
      switch (callbackUrlType) {
        case "implicit":
          if (this.flowType === "pkce") {
            throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
          }
          break;
        case "pkce":
          if (this.flowType === "implicit") {
            throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
          }
          break;
        default:
      }
      if (callbackUrlType === "pkce") {
        this._debug("#_initialize()", "begin", "is PKCE flow", true);
        if (!params.code)
          throw new AuthPKCEGrantCodeExchangeError("No code detected.");
        const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
        if (error2)
          throw error2;
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState(window.history.state, "", url.toString());
        return { data: { session: data2.session, redirectType: null }, error: null };
      }
      const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
      if (!access_token || !expires_in || !refresh_token || !token_type) {
        throw new AuthImplicitGrantRedirectError("No session defined in URL");
      }
      const timeNow = Math.round(Date.now() / 1e3);
      const expiresIn = parseInt(expires_in);
      let expiresAt2 = timeNow + expiresIn;
      if (expires_at) {
        expiresAt2 = parseInt(expires_at);
      }
      const actuallyExpiresIn = expiresAt2 - timeNow;
      if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION_MS) {
        console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
      }
      const issuedAt = expiresAt2 - expiresIn;
      if (timeNow - issuedAt >= 120) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
      } else if (timeNow - issuedAt < 0) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt2, timeNow);
      }
      const { data, error } = await this._getUser(access_token);
      if (error)
        throw error;
      const session = {
        provider_token,
        provider_refresh_token,
        access_token,
        expires_in: expiresIn,
        expires_at: expiresAt2,
        refresh_token,
        token_type,
        user: data.user
      };
      window.location.hash = "";
      this._debug("#_getSessionFromURL()", "clearing window.location.hash");
      return { data: { session, redirectType: params.type }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, redirectType: null }, error };
      }
      throw error;
    }
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantCallback(params) {
    return Boolean(params.access_token || params.error_description);
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  async _isPKCECallback(params) {
    const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    return !!(params.code && currentStorageContent);
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   *
   * If using `others` scope, no `SIGNED_OUT` event is fired!
   */
  async signOut(options = { scope: "global" }) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._signOut(options);
    });
  }
  async _signOut({ scope } = { scope: "global" }) {
    return await this._useSession(async (result) => {
      var _a;
      const { data, error: sessionError } = result;
      if (sessionError) {
        return { error: sessionError };
      }
      const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
      if (accessToken) {
        const { error } = await this.admin.signOut(accessToken, scope);
        if (error) {
          if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403))) {
            return { error };
          }
        }
      }
      if (scope !== "others") {
        await this._removeSession();
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      }
      return { error: null };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange(callback) {
    const id = uuid();
    const subscription = {
      id,
      callback,
      unsubscribe: () => {
        this._debug("#unsubscribe()", "state change callback with id removed", id);
        this.stateChangeEmitters.delete(id);
      }
    };
    this._debug("#onAuthStateChange()", "registered callback with id", id);
    this.stateChangeEmitters.set(id, subscription);
    (async () => {
      await this.initializePromise;
      await this._acquireLock(-1, async () => {
        this._emitInitialSession(id);
      });
    })();
    return { data: { subscription } };
  }
  async _emitInitialSession(id) {
    return await this._useSession(async (result) => {
      var _a, _b;
      try {
        const { data: { session }, error } = result;
        if (error)
          throw error;
        await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
        this._debug("INITIAL_SESSION", "callback id", id, "session", session);
      } catch (err) {
        await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
        this._debug("INITIAL_SESSION", "callback id", id, "error", err);
        console.error(err);
      }
    });
  }
  /**
   * Sends a password reset request to an email address. This method supports the PKCE flow.
   *
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   */
  async resetPasswordForEmail(email, options = {}) {
    let codeChallenge = null;
    let codeChallengeMethod = null;
    if (this.flowType === "pkce") {
      [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(
        this.storage,
        this.storageKey,
        true
        // isPasswordRecovery
      );
    }
    try {
      return await _request(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          gotrue_meta_security: { captcha_token: options.captchaToken }
        },
        headers: this.headers,
        redirectTo: options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Gets all the identities linked to a user.
   */
  async getUserIdentities() {
    var _a;
    try {
      const { data, error } = await this.getUser();
      if (error)
        throw error;
      return { data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Links an oauth identity to an existing user.
   * This method supports the PKCE flow.
   */
  async linkIdentity(credentials) {
    var _a;
    try {
      const { data, error } = await this._useSession(async (result) => {
        var _a2, _b, _c, _d, _e;
        const { data: data2, error: error2 } = result;
        if (error2)
          throw error2;
        const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
          redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: true
        });
        return await _request(this.fetch, "GET", url, {
          headers: this.headers,
          jwt: (_e = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : void 0
        });
      });
      if (error)
        throw error;
      if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
        window.location.assign(data === null || data === void 0 ? void 0 : data.url);
      }
      return { data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { provider: credentials.provider, url: null }, error };
      }
      throw error;
    }
  }
  /**
   * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
   */
  async unlinkIdentity(identity) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
          headers: this.headers,
          jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  async _refreshAccessToken(refreshToken) {
    const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      const startedAt = Date.now();
      return await retryable(async (attempt) => {
        if (attempt > 0) {
          await sleep(200 * Math.pow(2, attempt - 1));
        }
        this._debug(debugName, "refreshing attempt", attempt);
        return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
          body: { refresh_token: refreshToken },
          headers: this.headers,
          xform: _sessionResponse
        });
      }, (attempt, error) => {
        const nextBackOffInterval = 200 * Math.pow(2, attempt);
        return error && isAuthRetryableFetchError(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION_MS;
      });
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    } finally {
      this._debug(debugName, "end");
    }
  }
  _isValidSession(maybeSession) {
    const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
    return isValidSession;
  }
  async _handleProviderSignIn(provider, options) {
    const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    });
    this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
    if (isBrowser() && !options.skipBrowserRedirect) {
      window.location.assign(url);
    }
    return { data: { provider, url }, error: null };
  }
  /**
   * Recovers the session from LocalStorage and refreshes the token
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  async _recoverAndRefresh() {
    var _a;
    const debugName = "#_recoverAndRefresh()";
    this._debug(debugName, "begin");
    try {
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      this._debug(debugName, "session from storage", currentSession);
      if (!this._isValidSession(currentSession)) {
        this._debug(debugName, "session is not valid");
        if (currentSession !== null) {
          await this._removeSession();
        }
        return;
      }
      const expiresWithMargin = ((_a = currentSession.expires_at) !== null && _a !== void 0 ? _a : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
      this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            console.error(error);
            if (!isAuthRetryableFetchError(error)) {
              this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error);
              await this._removeSession();
            }
          }
        }
      } else {
        await this._notifyAllSubscribers("SIGNED_IN", currentSession);
      }
    } catch (err) {
      this._debug(debugName, "error", err);
      console.error(err);
      return;
    } finally {
      this._debug(debugName, "end");
    }
  }
  async _callRefreshToken(refreshToken) {
    var _a, _b;
    if (!refreshToken) {
      throw new AuthSessionMissingError();
    }
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }
    const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      this.refreshingDeferred = new Deferred();
      const { data, error } = await this._refreshAccessToken(refreshToken);
      if (error)
        throw error;
      if (!data.session)
        throw new AuthSessionMissingError();
      await this._saveSession(data.session);
      await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
      const result = { session: data.session, error: null };
      this.refreshingDeferred.resolve(result);
      return result;
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        const result = { session: null, error };
        if (!isAuthRetryableFetchError(error)) {
          await this._removeSession();
        }
        (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
        return result;
      }
      (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
      this._debug(debugName, "end");
    }
  }
  async _notifyAllSubscribers(event, session, broadcast = true) {
    const debugName = `#_notifyAllSubscribers(${event})`;
    this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
    try {
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({ event, session });
      }
      const errors = [];
      const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
        try {
          await x.callback(event, session);
        } catch (e) {
          errors.push(e);
        }
      });
      await Promise.all(promises);
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i += 1) {
          console.error(errors[i]);
        }
        throw errors[0];
      }
    } finally {
      this._debug(debugName, "end");
    }
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  async _saveSession(session) {
    this._debug("#_saveSession()", session);
    this.suppressGetSessionWarning = true;
    await setItemAsync(this.storage, this.storageKey, session);
  }
  async _removeSession() {
    this._debug("#_removeSession()");
    await removeItemAsync(this.storage, this.storageKey);
    await this._notifyAllSubscribers("SIGNED_OUT", null);
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
        window.removeEventListener("visibilitychange", callback);
      }
    } catch (e) {
      console.error("removing visibilitychange callback failed", e);
    }
  }
  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  async _startAutoRefresh() {
    await this._stopAutoRefresh();
    this._debug("#_startAutoRefresh()");
    const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
    this.autoRefreshTicker = ticker;
    if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
      ticker.unref();
    } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
      Deno.unrefTimer(ticker);
    }
    setTimeout(async () => {
      await this.initializePromise;
      await this._autoRefreshTokenTick();
    }, 0);
  }
  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;
    if (ticker) {
      clearInterval(ticker);
    }
  }
  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desirable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@see #stopAutoRefresh}
   */
  async startAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }
  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link #startAutoRefresh} for more details.
   */
  async stopAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }
  /**
   * Runs the auto refresh token tick.
   */
  async _autoRefreshTokenTick() {
    this._debug("#_autoRefreshTokenTick()", "begin");
    try {
      await this._acquireLock(0, async () => {
        try {
          const now = Date.now();
          try {
            return await this._useSession(async (result) => {
              const { data: { session } } = result;
              if (!session || !session.refresh_token || !session.expires_at) {
                this._debug("#_autoRefreshTokenTick()", "no session");
                return;
              }
              const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
              this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
              if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                await this._callRefreshToken(session.refresh_token);
              }
            });
          } catch (e) {
            console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
          }
        } finally {
          this._debug("#_autoRefreshTokenTick()", "end");
        }
      });
    } catch (e) {
      if (e.isAcquireTimeout || e instanceof LockAcquireTimeoutError) {
        this._debug("auto refresh token tick lock not available");
      } else {
        throw e;
      }
    }
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  async _handleVisibilityChange() {
    this._debug("#_handleVisibilityChange()");
    if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      if (this.autoRefreshToken) {
        this.startAutoRefresh();
      }
      return false;
    }
    try {
      this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
      window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
      await this._onVisibilityChanged(true);
    } catch (error) {
      console.error("_handleVisibilityChange", error);
    }
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  async _onVisibilityChanged(calledFromInitialize) {
    const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
    this._debug(methodName, "visibilityState", document.visibilityState);
    if (document.visibilityState === "visible") {
      if (this.autoRefreshToken) {
        this._startAutoRefresh();
      }
      if (!calledFromInitialize) {
        await this.initializePromise;
        await this._acquireLock(-1, async () => {
          if (document.visibilityState !== "visible") {
            this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
            return;
          }
          await this._recoverAndRefresh();
        });
      }
    } else if (document.visibilityState === "hidden") {
      if (this.autoRefreshToken) {
        this._stopAutoRefresh();
      }
    }
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  async _getUrlForProvider(url, provider, options) {
    const urlParams = [`provider=${encodeURIComponent(provider)}`];
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
    }
    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
    }
    if (this.flowType === "pkce") {
      const [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
      const flowParams = new URLSearchParams({
        code_challenge: `${encodeURIComponent(codeChallenge)}`,
        code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
      });
      urlParams.push(flowParams.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query = new URLSearchParams(options.queryParams);
      urlParams.push(query.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
      urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
    }
    return `${url}?${urlParams.join("&")}`;
  }
  async _unenroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _enroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : { issuer: params.issuer });
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
          body,
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return { data: null, error };
        }
        if (params.factorType === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
          data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
        }
        return { data, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * {@see GoTrueMFAApi#verify}
   */
  async _verify(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
            body: { code: params.code, challenge_id: params.challengeId },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return { data: null, error };
          }
          await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
          await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
          return { data, error };
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challenge}
   */
  async _challenge(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          return await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
            body: { channel: params.channel },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  async _challengeAndVerify(params) {
    const { data: challengeData, error: challengeError } = await this._challenge({
      factorId: params.factorId
    });
    if (challengeError) {
      return { data: null, error: challengeError };
    }
    return await this._verify({
      factorId: params.factorId,
      challengeId: challengeData.id,
      code: params.code
    });
  }
  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  async _listFactors() {
    const { data: { user }, error: userError } = await this.getUser();
    if (userError) {
      return { data: null, error: userError };
    }
    const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
    const totp = factors.filter((factor) => factor.factor_type === "totp" && factor.status === "verified");
    const phone = factors.filter((factor) => factor.factor_type === "phone" && factor.status === "verified");
    return {
      data: {
        all: factors,
        totp,
        phone
      },
      error: null
    };
  }
  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  async _getAuthenticatorAssuranceLevel() {
    return this._acquireLock(-1, async () => {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        if (!session) {
          return {
            data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
            error: null
          };
        }
        const { payload } = decodeJWT(session.access_token);
        let currentLevel = null;
        if (payload.aal) {
          currentLevel = payload.aal;
        }
        let nextLevel = currentLevel;
        const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
        if (verifiedFactors.length > 0) {
          nextLevel = "aal2";
        }
        const currentAuthenticationMethods = payload.amr || [];
        return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
      });
    });
  }
  async fetchJwk(kid, jwks = { keys: [] }) {
    let jwk = jwks.keys.find((key) => key.kid === kid);
    if (jwk) {
      return jwk;
    }
    jwk = this.jwks.keys.find((key) => key.kid === kid);
    if (jwk && this.jwks_cached_at + JWKS_TTL > Date.now()) {
      return jwk;
    }
    const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
      headers: this.headers
    });
    if (error) {
      throw error;
    }
    if (!data.keys || data.keys.length === 0) {
      throw new AuthInvalidJwtError("JWKS is empty");
    }
    this.jwks = data;
    this.jwks_cached_at = Date.now();
    jwk = data.keys.find((key) => key.kid === kid);
    if (!jwk) {
      throw new AuthInvalidJwtError("No matching signing key found in JWKS");
    }
    return jwk;
  }
  /**
   * @experimental This method may change in future versions.
   * @description Gets the claims from a JWT. If the JWT is symmetric JWTs, it will call getUser() to verify against the server. If the JWT is asymmetric, it will be verified against the JWKS using the WebCrypto API.
   */
  async getClaims(jwt, jwks = { keys: [] }) {
    try {
      let token = jwt;
      if (!token) {
        const { data, error } = await this.getSession();
        if (error || !data.session) {
          return { data: null, error };
        }
        token = data.session.access_token;
      }
      const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
      validateExp(payload.exp);
      if (!header.kid || header.alg === "HS256" || !("crypto" in globalThis && "subtle" in globalThis.crypto)) {
        const { error } = await this.getUser(token);
        if (error) {
          throw error;
        }
        return {
          data: {
            claims: payload,
            header,
            signature
          },
          error: null
        };
      }
      const algorithm = getAlgorithm(header.alg);
      const signingKey = await this.fetchJwk(header.kid, jwks);
      const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
        "verify"
      ]);
      const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`));
      if (!isValid) {
        throw new AuthInvalidJwtError("Invalid JWT signature");
      }
      return {
        data: {
          claims: payload,
          header,
          signature
        },
        error: null
      };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
}
GoTrueClient.nextInstanceID = 0;
const AuthClient = GoTrueClient;
class SupabaseAuthClient extends AuthClient {
  constructor(options) {
    super(options);
  }
}
var __awaiter = function(thisArg, _arguments, P, generator) {
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
};
class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    var _a, _b, _c;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = ensureTrailingSlash(supabaseUrl);
    const baseUrl = new URL(_supabaseUrl);
    this.realtimeUrl = new URL("realtime/v1", baseUrl);
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
    this.authUrl = new URL("auth/v1", baseUrl);
    this.storageUrl = new URL("storage/v1", baseUrl);
    this.functionsUrl = new URL("functions/v1", baseUrl);
    const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
    this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
    if (!settings.accessToken) {
      this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
    } else {
      this.accessToken = settings.accessToken;
      this.auth = new Proxy({}, {
        get: (_, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        }
      });
    }
    this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
    this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
      headers: this.headers,
      schema: settings.db.schema,
      fetch: this.fetch
    });
    if (!settings.accessToken) {
      this._listenForAuthEvents();
    }
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new StorageClient(this.storageUrl.href, this.headers, this.fetch);
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    return this.rest.from(relation);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.schema
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return this.rest.schema(schema);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.rpc
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, options = {}) {
    return this.rest.rpc(fn, args, options);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (this.accessToken) {
        return yield this.accessToken();
      }
      const { data } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug }, headers, fetch2) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl.href,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      lock,
      debug,
      fetch: fetch2,
      // auth checks if there is a custom authorizaiton header using this flag
      // so it knows whether to return an error when getUser is called with no session
      hasCustomAuthorizationHeader: "Authorization" in this.headers
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
      this.changedAccessToken = token;
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth();
      if (source == "STORAGE")
        this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
}
const createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};
export {
  createClient as c
};


//# sourceMappingURL=data:application/json;base64,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ZXNvbHZlRmV0Y2giLCJmZXRjaCIsIkZ1bmN0aW9uUmVnaW9uIiwiX19hd2FpdGVyIiwiSGVhZGVycyIsIlJlc3BvbnNlIiwiUG9zdGdyZXN0RXJyb3JfMSIsIlBvc3RncmVzdEVycm9yIiwidGhpcyIsIlBvc3RncmVzdEJ1aWxkZXJfMSIsInJlcXVpcmUkJDEiLCJQb3N0Z3Jlc3RCdWlsZGVyIiwicmVzIiwiUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlcl8xIiwicmVxdWlyZSQkMCIsIlBvc3RncmVzdFRyYW5zZm9ybUJ1aWxkZXIiLCJQb3N0Z3Jlc3RGaWx0ZXJCdWlsZGVyXzEiLCJQb3N0Z3Jlc3RGaWx0ZXJCdWlsZGVyIiwiUG9zdGdyZXN0UXVlcnlCdWlsZGVyXzEiLCJQb3N0Z3Jlc3RRdWVyeUJ1aWxkZXIiLCJoZWFkIiwidmVyc2lvbiIsIlBvc3RncmVzdENsaWVudF8xIiwicmVxdWlyZSQkMiIsIlBvc3RncmVzdENsaWVudCIsImdldCIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsIldlYlNvY2tldCIsIlNPQ0tFVF9TVEFURVMiLCJDSEFOTkVMX1NUQVRFUyIsIkNIQU5ORUxfRVZFTlRTIiwiVFJBTlNQT1JUUyIsIkNPTk5FQ1RJT05fU1RBVEUiLCJQb3N0Z3Jlc1R5cGVzIiwibm9vcCIsIlJFQUxUSU1FX1BSRVNFTkNFX0xJU1RFTl9FVkVOVFMiLCJSRUFMVElNRV9QT1NUR1JFU19DSEFOR0VTX0xJU1RFTl9FVkVOVCIsIlJFQUxUSU1FX0xJU1RFTl9UWVBFUyIsIlJFQUxUSU1FX1NVQlNDUklCRV9TVEFURVMiLCJfYSIsIl9iIiwidHlwZSIsIlRyYW5zZm9ybWVycy5jb252ZXJ0Q2hhbmdlRGF0YSIsIl9nZXRFcnJvck1lc3NhZ2UiLCJoYW5kbGVFcnJvciIsIl9nZXRSZXF1ZXN0UGFyYW1zIiwiX2hhbmRsZVJlcXVlc3QiLCJERUZBVUxUX0hFQURFUlMiLCJOb2RlRmV0Y2hIZWFkZXJzIiwiREVGQVVMVF9EQl9PUFRJT05TIiwiREVGQVVMVF9BVVRIX09QVElPTlMiLCJERUZBVUxUX1JFQUxUSU1FX09QVElPTlMiLCJERUZBVUxUX0dMT0JBTF9PUFRJT05TIiwiX19yZXN0IiwicmVzdWx0IiwiZXhwaXJlc0F0IiwiZXJyb3IiLCJkYXRhIiwiU3VwYWJhc2VTdG9yYWdlQ2xpZW50Il0sImlnbm9yZUxpc3QiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMwLDMxLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQxLDQyLDQzLDQ0LDQ1LDQ2LDQ3LDQ4LDQ5LDUwLDUxLDUyXSwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL2Z1bmN0aW9ucy1qcy9kaXN0L21vZHVsZS9oZWxwZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL2Z1bmN0aW9ucy1qcy9kaXN0L21vZHVsZS90eXBlcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvZnVuY3Rpb25zLWpzL2Rpc3QvbW9kdWxlL0Z1bmN0aW9uc0NsaWVudC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2Uvbm9kZS1mZXRjaC9icm93c2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9wb3N0Z3Jlc3QtanMvZGlzdC9janMvUG9zdGdyZXN0RXJyb3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3Bvc3RncmVzdC1qcy9kaXN0L2Nqcy9Qb3N0Z3Jlc3RCdWlsZGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9wb3N0Z3Jlc3QtanMvZGlzdC9janMvUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvcG9zdGdyZXN0LWpzL2Rpc3QvY2pzL1Bvc3RncmVzdEZpbHRlckJ1aWxkZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3Bvc3RncmVzdC1qcy9kaXN0L2Nqcy9Qb3N0Z3Jlc3RRdWVyeUJ1aWxkZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3Bvc3RncmVzdC1qcy9kaXN0L2Nqcy92ZXJzaW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9wb3N0Z3Jlc3QtanMvZGlzdC9janMvY29uc3RhbnRzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9wb3N0Z3Jlc3QtanMvZGlzdC9janMvUG9zdGdyZXN0Q2xpZW50LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9wb3N0Z3Jlc3QtanMvZGlzdC9janMvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3Bvc3RncmVzdC1qcy9kaXN0L2VzbS93cmFwcGVyLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9pc293cy9fZXNtL3V0aWxzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2lzb3dzL19lc20vbmF0aXZlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9yZWFsdGltZS1qcy9kaXN0L21vZHVsZS9saWIvdmVyc2lvbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvcmVhbHRpbWUtanMvZGlzdC9tb2R1bGUvbGliL2NvbnN0YW50cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvcmVhbHRpbWUtanMvZGlzdC9tb2R1bGUvbGliL3NlcmlhbGl6ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3JlYWx0aW1lLWpzL2Rpc3QvbW9kdWxlL2xpYi90aW1lci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvcmVhbHRpbWUtanMvZGlzdC9tb2R1bGUvbGliL3RyYW5zZm9ybWVycy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvcmVhbHRpbWUtanMvZGlzdC9tb2R1bGUvbGliL3B1c2guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3JlYWx0aW1lLWpzL2Rpc3QvbW9kdWxlL1JlYWx0aW1lUHJlc2VuY2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3JlYWx0aW1lLWpzL2Rpc3QvbW9kdWxlL1JlYWx0aW1lQ2hhbm5lbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvcmVhbHRpbWUtanMvZGlzdC9tb2R1bGUvUmVhbHRpbWVDbGllbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N0b3JhZ2UtanMvZGlzdC9tb2R1bGUvbGliL2Vycm9ycy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2Uvc3RvcmFnZS1qcy9kaXN0L21vZHVsZS9saWIvaGVscGVycy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2Uvc3RvcmFnZS1qcy9kaXN0L21vZHVsZS9saWIvZmV0Y2guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N0b3JhZ2UtanMvZGlzdC9tb2R1bGUvcGFja2FnZXMvU3RvcmFnZUZpbGVBcGkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N0b3JhZ2UtanMvZGlzdC9tb2R1bGUvbGliL3ZlcnNpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N0b3JhZ2UtanMvZGlzdC9tb2R1bGUvbGliL2NvbnN0YW50cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2Uvc3RvcmFnZS1qcy9kaXN0L21vZHVsZS9wYWNrYWdlcy9TdG9yYWdlQnVja2V0QXBpLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9zdG9yYWdlLWpzL2Rpc3QvbW9kdWxlL1N0b3JhZ2VDbGllbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N1cGFiYXNlLWpzL2Rpc3QvbW9kdWxlL2xpYi92ZXJzaW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9zdXBhYmFzZS1qcy9kaXN0L21vZHVsZS9saWIvY29uc3RhbnRzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9zdXBhYmFzZS1qcy9kaXN0L21vZHVsZS9saWIvZmV0Y2guanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N1cGFiYXNlLWpzL2Rpc3QvbW9kdWxlL2xpYi9oZWxwZXJzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9hdXRoLWpzL2Rpc3QvbW9kdWxlL2xpYi92ZXJzaW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9hdXRoLWpzL2Rpc3QvbW9kdWxlL2xpYi9jb25zdGFudHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL2F1dGgtanMvZGlzdC9tb2R1bGUvbGliL2Vycm9ycy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvYXV0aC1qcy9kaXN0L21vZHVsZS9saWIvYmFzZTY0dXJsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9hdXRoLWpzL2Rpc3QvbW9kdWxlL2xpYi9oZWxwZXJzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9hdXRoLWpzL2Rpc3QvbW9kdWxlL2xpYi9mZXRjaC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvYXV0aC1qcy9kaXN0L21vZHVsZS9saWIvdHlwZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL2F1dGgtanMvZGlzdC9tb2R1bGUvR29UcnVlQWRtaW5BcGkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL2F1dGgtanMvZGlzdC9tb2R1bGUvbGliL2xvY2FsLXN0b3JhZ2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL2F1dGgtanMvZGlzdC9tb2R1bGUvbGliL3BvbHlmaWxscy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvYXV0aC1qcy9kaXN0L21vZHVsZS9saWIvbG9ja3MuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL2F1dGgtanMvZGlzdC9tb2R1bGUvR29UcnVlQ2xpZW50LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9hdXRoLWpzL2Rpc3QvbW9kdWxlL0F1dGhDbGllbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N1cGFiYXNlLWpzL2Rpc3QvbW9kdWxlL2xpYi9TdXBhYmFzZUF1dGhDbGllbnQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHN1cGFiYXNlL3N1cGFiYXNlLWpzL2Rpc3QvbW9kdWxlL1N1cGFiYXNlQ2xpZW50LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BzdXBhYmFzZS9zdXBhYmFzZS1qcy9kaXN0L21vZHVsZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgcmVzb2x2ZUZldGNoID0gKGN1c3RvbUZldGNoKSA9PiB7XG4gICAgbGV0IF9mZXRjaDtcbiAgICBpZiAoY3VzdG9tRmV0Y2gpIHtcbiAgICAgICAgX2ZldGNoID0gY3VzdG9tRmV0Y2g7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBmZXRjaCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgX2ZldGNoID0gKC4uLmFyZ3MpID0+IGltcG9ydCgnQHN1cGFiYXNlL25vZGUtZmV0Y2gnKS50aGVuKCh7IGRlZmF1bHQ6IGZldGNoIH0pID0+IGZldGNoKC4uLmFyZ3MpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIF9mZXRjaCA9IGZldGNoO1xuICAgIH1cbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IF9mZXRjaCguLi5hcmdzKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWxwZXIuanMubWFwIiwiZXhwb3J0IGNsYXNzIEZ1bmN0aW9uc0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIG5hbWUgPSAnRnVuY3Rpb25zRXJyb3InLCBjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbnNGZXRjaEVycm9yIGV4dGVuZHMgRnVuY3Rpb25zRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIoJ0ZhaWxlZCB0byBzZW5kIGEgcmVxdWVzdCB0byB0aGUgRWRnZSBGdW5jdGlvbicsICdGdW5jdGlvbnNGZXRjaEVycm9yJywgY29udGV4dCk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uc1JlbGF5RXJyb3IgZXh0ZW5kcyBGdW5jdGlvbnNFcnJvciB7XG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgICAgICBzdXBlcignUmVsYXkgRXJyb3IgaW52b2tpbmcgdGhlIEVkZ2UgRnVuY3Rpb24nLCAnRnVuY3Rpb25zUmVsYXlFcnJvcicsIGNvbnRleHQpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbnNIdHRwRXJyb3IgZXh0ZW5kcyBGdW5jdGlvbnNFcnJvciB7XG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgICAgICBzdXBlcignRWRnZSBGdW5jdGlvbiByZXR1cm5lZCBhIG5vbi0yeHggc3RhdHVzIGNvZGUnLCAnRnVuY3Rpb25zSHR0cEVycm9yJywgY29udGV4dCk7XG4gICAgfVxufVxuLy8gRGVmaW5lIHRoZSBlbnVtIGZvciB0aGUgJ3JlZ2lvbicgcHJvcGVydHlcbmV4cG9ydCB2YXIgRnVuY3Rpb25SZWdpb247XG4oZnVuY3Rpb24gKEZ1bmN0aW9uUmVnaW9uKSB7XG4gICAgRnVuY3Rpb25SZWdpb25bXCJBbnlcIl0gPSBcImFueVwiO1xuICAgIEZ1bmN0aW9uUmVnaW9uW1wiQXBOb3J0aGVhc3QxXCJdID0gXCJhcC1ub3J0aGVhc3QtMVwiO1xuICAgIEZ1bmN0aW9uUmVnaW9uW1wiQXBOb3J0aGVhc3QyXCJdID0gXCJhcC1ub3J0aGVhc3QtMlwiO1xuICAgIEZ1bmN0aW9uUmVnaW9uW1wiQXBTb3V0aDFcIl0gPSBcImFwLXNvdXRoLTFcIjtcbiAgICBGdW5jdGlvblJlZ2lvbltcIkFwU291dGhlYXN0MVwiXSA9IFwiYXAtc291dGhlYXN0LTFcIjtcbiAgICBGdW5jdGlvblJlZ2lvbltcIkFwU291dGhlYXN0MlwiXSA9IFwiYXAtc291dGhlYXN0LTJcIjtcbiAgICBGdW5jdGlvblJlZ2lvbltcIkNhQ2VudHJhbDFcIl0gPSBcImNhLWNlbnRyYWwtMVwiO1xuICAgIEZ1bmN0aW9uUmVnaW9uW1wiRXVDZW50cmFsMVwiXSA9IFwiZXUtY2VudHJhbC0xXCI7XG4gICAgRnVuY3Rpb25SZWdpb25bXCJFdVdlc3QxXCJdID0gXCJldS13ZXN0LTFcIjtcbiAgICBGdW5jdGlvblJlZ2lvbltcIkV1V2VzdDJcIl0gPSBcImV1LXdlc3QtMlwiO1xuICAgIEZ1bmN0aW9uUmVnaW9uW1wiRXVXZXN0M1wiXSA9IFwiZXUtd2VzdC0zXCI7XG4gICAgRnVuY3Rpb25SZWdpb25bXCJTYUVhc3QxXCJdID0gXCJzYS1lYXN0LTFcIjtcbiAgICBGdW5jdGlvblJlZ2lvbltcIlVzRWFzdDFcIl0gPSBcInVzLWVhc3QtMVwiO1xuICAgIEZ1bmN0aW9uUmVnaW9uW1wiVXNXZXN0MVwiXSA9IFwidXMtd2VzdC0xXCI7XG4gICAgRnVuY3Rpb25SZWdpb25bXCJVc1dlc3QyXCJdID0gXCJ1cy13ZXN0LTJcIjtcbn0pKEZ1bmN0aW9uUmVnaW9uIHx8IChGdW5jdGlvblJlZ2lvbiA9IHt9KSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10eXBlcy5qcy5tYXAiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IHJlc29sdmVGZXRjaCB9IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7IEZ1bmN0aW9uc0ZldGNoRXJyb3IsIEZ1bmN0aW9uc0h0dHBFcnJvciwgRnVuY3Rpb25zUmVsYXlFcnJvciwgRnVuY3Rpb25SZWdpb24sIH0gZnJvbSAnLi90eXBlcyc7XG5leHBvcnQgY2xhc3MgRnVuY3Rpb25zQ2xpZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHsgaGVhZGVycyA9IHt9LCBjdXN0b21GZXRjaCwgcmVnaW9uID0gRnVuY3Rpb25SZWdpb24uQW55LCB9ID0ge30pIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xuICAgICAgICB0aGlzLmZldGNoID0gcmVzb2x2ZUZldGNoKGN1c3RvbUZldGNoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgYXV0aG9yaXphdGlvbiBoZWFkZXJcbiAgICAgKiBAcGFyYW0gdG9rZW4gLSB0aGUgbmV3IGp3dCB0b2tlbiBzZW50IGluIHRoZSBhdXRob3Jpc2F0aW9uIGhlYWRlclxuICAgICAqL1xuICAgIHNldEF1dGgodG9rZW4pIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW52b2tlcyBhIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIGZ1bmN0aW9uTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBGdW5jdGlvbiB0byBpbnZva2UuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIGZvciBpbnZva2luZyB0aGUgRnVuY3Rpb24uXG4gICAgICovXG4gICAgaW52b2tlKGZ1bmN0aW9uTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBoZWFkZXJzLCBtZXRob2QsIGJvZHk6IGZ1bmN0aW9uQXJncyB9ID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgICBsZXQgX2hlYWRlcnMgPSB7fTtcbiAgICAgICAgICAgICAgICBsZXQgeyByZWdpb24gfSA9IG9wdGlvbnM7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWdpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uID0gdGhpcy5yZWdpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEFkZCByZWdpb24gYXMgcXVlcnkgcGFyYW1ldGVyIHVzaW5nIFVSTCBBUElcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGAke3RoaXMudXJsfS8ke2Z1bmN0aW9uTmFtZX1gKTtcbiAgICAgICAgICAgICAgICBpZiAocmVnaW9uICYmIHJlZ2lvbiAhPT0gJ2FueScpIHtcbiAgICAgICAgICAgICAgICAgICAgX2hlYWRlcnNbJ3gtcmVnaW9uJ10gPSByZWdpb247XG4gICAgICAgICAgICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdmb3JjZUZ1bmN0aW9uUmVnaW9uJywgcmVnaW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgICAgICAgICAgaWYgKGZ1bmN0aW9uQXJncyAmJlxuICAgICAgICAgICAgICAgICAgICAoKGhlYWRlcnMgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChoZWFkZXJzLCAnQ29udGVudC1UeXBlJykpIHx8ICFoZWFkZXJzKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBmdW5jdGlvbkFyZ3MgaW5zdGFuY2VvZiBCbG9iKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25BcmdzIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgd29yayBmb3IgRmlsZSBhcyBGaWxlIGluaGVyaXRzIEJsb2JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsc28gd29ya3MgZm9yIEFycmF5QnVmZmVyIGFzIGl0IGlzIHRoZSBzYW1lIHVuZGVybHlpbmcgc3RydWN0dXJlIGFzIGEgQmxvYlxuICAgICAgICAgICAgICAgICAgICAgICAgX2hlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5ID0gZnVuY3Rpb25BcmdzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBmdW5jdGlvbkFyZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwbGFpbiBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIF9oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICd0ZXh0L3BsYWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkgPSBmdW5jdGlvbkFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyAmJiBmdW5jdGlvbkFyZ3MgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9uJ3Qgc2V0IGNvbnRlbnQtdHlwZSBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXF1ZXN0IHdpbGwgYXV0b21hdGljYWxseSBhZGQgdGhlIHJpZ2h0IGJvdW5kYXJ5IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5ID0gZnVuY3Rpb25BcmdzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCwgYXNzdW1lIHRoaXMgaXMgSlNPTlxuICAgICAgICAgICAgICAgICAgICAgICAgX2hlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGZ1bmN0aW9uQXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCB0aGlzLmZldGNoKHVybC50b1N0cmluZygpLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kIHx8ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gaGVhZGVycyBwcmlvcml0eSBpcyAoaGlnaCB0byBsb3cpOlxuICAgICAgICAgICAgICAgICAgICAvLyAxLiBpbnZva2UtbGV2ZWwgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICAvLyAyLiBjbGllbnQtbGV2ZWwgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICAvLyAzLiBkZWZhdWx0IENvbnRlbnQtVHlwZSBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIF9oZWFkZXJzKSwgdGhpcy5oZWFkZXJzKSwgaGVhZGVycyksXG4gICAgICAgICAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGZldGNoRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEZ1bmN0aW9uc0ZldGNoRXJyb3IoZmV0Y2hFcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNSZWxheUVycm9yID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ3gtcmVsYXktZXJyb3InKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNSZWxheUVycm9yICYmIGlzUmVsYXlFcnJvciA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBGdW5jdGlvbnNSZWxheUVycm9yKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRnVuY3Rpb25zSHR0cEVycm9yKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlVHlwZSA9ICgoX2EgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICd0ZXh0L3BsYWluJykuc3BsaXQoJzsnKVswXS50cmltKCk7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSB5aWVsZCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlVHlwZSA9PT0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHlpZWxkIHJlc3BvbnNlLmJsb2IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2VUeXBlID09PSAndGV4dC9ldmVudC1zdHJlYW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2VUeXBlID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHlpZWxkIHJlc3BvbnNlLmZvcm1EYXRhKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHRvIHRleHRcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHlpZWxkIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YSwgZXJyb3I6IG51bGwsIHJlc3BvbnNlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U6IGVycm9yIGluc3RhbmNlb2YgRnVuY3Rpb25zSHR0cEVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRnVuY3Rpb25zUmVsYXlFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBlcnJvci5jb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1GdW5jdGlvbnNDbGllbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJlZjogaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG52YXIgZ2V0R2xvYmFsID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gdGhlIG9ubHkgcmVsaWFibGUgbWVhbnMgdG8gZ2V0IHRoZSBnbG9iYWwgb2JqZWN0IGlzXG4gICAgLy8gYEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClgXG4gICAgLy8gSG93ZXZlciwgdGhpcyBjYXVzZXMgQ1NQIHZpb2xhdGlvbnMgaW4gQ2hyb21lIGFwcHMuXG4gICAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gc2VsZjsgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gd2luZG93OyB9XG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBnbG9iYWw7IH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBsb2NhdGUgZ2xvYmFsIG9iamVjdCcpO1xufVxuXG52YXIgZ2xvYmFsT2JqZWN0ID0gZ2V0R2xvYmFsKCk7XG5cbmV4cG9ydCBjb25zdCBmZXRjaCA9IGdsb2JhbE9iamVjdC5mZXRjaDtcblxuZXhwb3J0IGRlZmF1bHQgZ2xvYmFsT2JqZWN0LmZldGNoLmJpbmQoZ2xvYmFsT2JqZWN0KTtcblxuZXhwb3J0IGNvbnN0IEhlYWRlcnMgPSBnbG9iYWxPYmplY3QuSGVhZGVycztcbmV4cG9ydCBjb25zdCBSZXF1ZXN0ID0gZ2xvYmFsT2JqZWN0LlJlcXVlc3Q7XG5leHBvcnQgY29uc3QgUmVzcG9uc2UgPSBnbG9iYWxPYmplY3QuUmVzcG9uc2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogRXJyb3IgZm9ybWF0XG4gKlxuICoge0BsaW5rIGh0dHBzOi8vcG9zdGdyZXN0Lm9yZy9lbi9zdGFibGUvYXBpLmh0bWw/aGlnaGxpZ2h0PW9wdGlvbnMjZXJyb3JzLWFuZC1odHRwLXN0YXR1cy1jb2Rlc31cbiAqL1xuY2xhc3MgUG9zdGdyZXN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgICAgICBzdXBlcihjb250ZXh0Lm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSAnUG9zdGdyZXN0RXJyb3InO1xuICAgICAgICB0aGlzLmRldGFpbHMgPSBjb250ZXh0LmRldGFpbHM7XG4gICAgICAgIHRoaXMuaGludCA9IGNvbnRleHQuaGludDtcbiAgICAgICAgdGhpcy5jb2RlID0gY29udGV4dC5jb2RlO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBvc3RncmVzdEVycm9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UG9zdGdyZXN0RXJyb3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vLyBAdHMtaWdub3JlXG5jb25zdCBub2RlX2ZldGNoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIkBzdXBhYmFzZS9ub2RlLWZldGNoXCIpKTtcbmNvbnN0IFBvc3RncmVzdEVycm9yXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vUG9zdGdyZXN0RXJyb3JcIikpO1xuY2xhc3MgUG9zdGdyZXN0QnVpbGRlciB7XG4gICAgY29uc3RydWN0b3IoYnVpbGRlcikge1xuICAgICAgICB0aGlzLnNob3VsZFRocm93T25FcnJvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IGJ1aWxkZXIubWV0aG9kO1xuICAgICAgICB0aGlzLnVybCA9IGJ1aWxkZXIudXJsO1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBidWlsZGVyLmhlYWRlcnM7XG4gICAgICAgIHRoaXMuc2NoZW1hID0gYnVpbGRlci5zY2hlbWE7XG4gICAgICAgIHRoaXMuYm9keSA9IGJ1aWxkZXIuYm9keTtcbiAgICAgICAgdGhpcy5zaG91bGRUaHJvd09uRXJyb3IgPSBidWlsZGVyLnNob3VsZFRocm93T25FcnJvcjtcbiAgICAgICAgdGhpcy5zaWduYWwgPSBidWlsZGVyLnNpZ25hbDtcbiAgICAgICAgdGhpcy5pc01heWJlU2luZ2xlID0gYnVpbGRlci5pc01heWJlU2luZ2xlO1xuICAgICAgICBpZiAoYnVpbGRlci5mZXRjaCkge1xuICAgICAgICAgICAgdGhpcy5mZXRjaCA9IGJ1aWxkZXIuZmV0Y2g7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGZldGNoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5mZXRjaCA9IG5vZGVfZmV0Y2hfMS5kZWZhdWx0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mZXRjaCA9IGZldGNoO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElmIHRoZXJlJ3MgYW4gZXJyb3Igd2l0aCB0aGUgcXVlcnksIHRocm93T25FcnJvciB3aWxsIHJlamVjdCB0aGUgcHJvbWlzZSBieVxuICAgICAqIHRocm93aW5nIHRoZSBlcnJvciBpbnN0ZWFkIG9mIHJldHVybmluZyBpdCBhcyBwYXJ0IG9mIGEgc3VjY2Vzc2Z1bCByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2Uvc3VwYWJhc2UtanMvaXNzdWVzLzkyfVxuICAgICAqL1xuICAgIHRocm93T25FcnJvcigpIHtcbiAgICAgICAgdGhpcy5zaG91bGRUaHJvd09uRXJyb3IgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGFuIEhUVFAgaGVhZGVyIGZvciB0aGUgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBzZXRIZWFkZXIobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oZWFkZXJzKTtcbiAgICAgICAgdGhpcy5oZWFkZXJzW25hbWVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGVuKG9uZnVsZmlsbGVkLCBvbnJlamVjdGVkKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vcG9zdGdyZXN0Lm9yZy9lbi9zdGFibGUvYXBpLmh0bWwjc3dpdGNoaW5nLXNjaGVtYXNcbiAgICAgICAgaWYgKHRoaXMuc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIHNraXBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChbJ0dFVCcsICdIRUFEJ10uaW5jbHVkZXModGhpcy5tZXRob2QpKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnNbJ0FjY2VwdC1Qcm9maWxlJ10gPSB0aGlzLnNjaGVtYTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyc1snQ29udGVudC1Qcm9maWxlJ10gPSB0aGlzLnNjaGVtYTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tZXRob2QgIT09ICdHRVQnICYmIHRoaXMubWV0aG9kICE9PSAnSEVBRCcpIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbic7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTk9URTogSW52b2tlIHcvbyBgdGhpc2AgdG8gYXZvaWQgaWxsZWdhbCBpbnZvY2F0aW9uIGVycm9yLlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2UvcG9zdGdyZXN0LWpzL3B1bGwvMjQ3XG4gICAgICAgIGNvbnN0IF9mZXRjaCA9IHRoaXMuZmV0Y2g7XG4gICAgICAgIGxldCByZXMgPSBfZmV0Y2godGhpcy51cmwudG9TdHJpbmcoKSwge1xuICAgICAgICAgICAgbWV0aG9kOiB0aGlzLm1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keSksXG4gICAgICAgICAgICBzaWduYWw6IHRoaXMuc2lnbmFsLFxuICAgICAgICB9KS50aGVuKGFzeW5jIChyZXMpID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICAgICAgbGV0IGVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBkYXRhID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgICAgICAgICAgIGxldCBzdGF0dXNUZXh0ID0gcmVzLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICBpZiAocmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWV0aG9kICE9PSAnSEVBRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcy50ZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChib2R5ID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJlZmVyOiByZXR1cm49bWluaW1hbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaGVhZGVyc1snQWNjZXB0J10gPT09ICd0ZXh0L2NzdicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBib2R5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaGVhZGVyc1snQWNjZXB0J10gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyc1snQWNjZXB0J10uaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3ZuZC5wZ3JzdC5wbGFuK3RleHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGJvZHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudEhlYWRlciA9IChfYSA9IHRoaXMuaGVhZGVyc1snUHJlZmVyJ10pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXRjaCgvY291bnQ9KGV4YWN0fHBsYW5uZWR8ZXN0aW1hdGVkKS8pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRSYW5nZSA9IChfYiA9IHJlcy5oZWFkZXJzLmdldCgnY29udGVudC1yYW5nZScpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iuc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICBpZiAoY291bnRIZWFkZXIgJiYgY29udGVudFJhbmdlICYmIGNvbnRlbnRSYW5nZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ID0gcGFyc2VJbnQoY29udGVudFJhbmdlWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVGVtcG9yYXJ5IHBhcnRpYWwgZml4IGZvciBodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2UvcG9zdGdyZXN0LWpzL2lzc3Vlcy8zNjFcbiAgICAgICAgICAgICAgICAvLyBJc3N1ZSBwZXJzaXN0cyBlLmcuIGZvciBgLmluc2VydChbLi4uXSkuc2VsZWN0KCkubWF5YmVTaW5nbGUoKWBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01heWJlU2luZ2xlICYmIHRoaXMubWV0aG9kID09PSAnR0VUJyAmJiBBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Qb3N0Z1JFU1QvcG9zdGdyZXN0L2Jsb2IvYTg2N2Q3OWM0MjQxOWFmMTZjMThjM2ZiMDE5ZWJhOGRmOTkyNjI2Zi9zcmMvUG9zdGdSRVNUL0Vycm9yLmhzI0w1NTNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiAnUEdSU1QxMTYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbHM6IGBSZXN1bHRzIGNvbnRhaW4gJHtkYXRhLmxlbmd0aH0gcm93cywgYXBwbGljYXRpb24vdm5kLnBncnN0Lm9iamVjdCtqc29uIHJlcXVpcmVzIDEgcm93YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaW50OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdKU09OIG9iamVjdCByZXF1ZXN0ZWQsIG11bHRpcGxlIChvciBubykgcm93cyByZXR1cm5lZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSA0MDY7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0ID0gJ05vdCBBY2NlcHRhYmxlJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGFbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXMudGV4dCgpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL3N1cGFiYXNlL3Bvc3RncmVzdC1qcy9pc3N1ZXMvMjk1XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVycm9yKSAmJiByZXMuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9IDIwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQgPSAnT0snO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChfZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2UvcG9zdGdyZXN0LWpzL2lzc3Vlcy8yOTVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwNCAmJiBib2R5ID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gMjA0O1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dCA9ICdObyBDb250ZW50JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGJvZHksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnJvciAmJiB0aGlzLmlzTWF5YmVTaW5nbGUgJiYgKChfYyA9IGVycm9yID09PSBudWxsIHx8IGVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlcnJvci5kZXRhaWxzKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuaW5jbHVkZXMoJzAgcm93cycpKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9IDIwMDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dCA9ICdPSyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnJvciAmJiB0aGlzLnNob3VsZFRocm93T25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUG9zdGdyZXN0RXJyb3JfMS5kZWZhdWx0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwb3N0Z3Jlc3RSZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0Z3Jlc3RSZXNwb25zZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghdGhpcy5zaG91bGRUaHJvd09uRXJyb3IpIHtcbiAgICAgICAgICAgIHJlcyA9IHJlcy5jYXRjaCgoZmV0Y2hFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICAgICAgICAgIHJldHVybiAoe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYCR7KF9hID0gZmV0Y2hFcnJvciA9PT0gbnVsbCB8fCBmZXRjaEVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmZXRjaEVycm9yLm5hbWUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICdGZXRjaEVycm9yJ306ICR7ZmV0Y2hFcnJvciA9PT0gbnVsbCB8fCBmZXRjaEVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmZXRjaEVycm9yLm1lc3NhZ2V9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbHM6IGAkeyhfYiA9IGZldGNoRXJyb3IgPT09IG51bGwgfHwgZmV0Y2hFcnJvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZmV0Y2hFcnJvci5zdGFjaykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogJyd9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpbnQ6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogYCR7KF9jID0gZmV0Y2hFcnJvciA9PT0gbnVsbCB8fCBmZXRjaEVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmZXRjaEVycm9yLmNvZGUpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6ICcnfWAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDAsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6ICcnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcy50aGVuKG9uZnVsZmlsbGVkLCBvbnJlamVjdGVkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogT3ZlcnJpZGUgdGhlIHR5cGUgb2YgdGhlIHJldHVybmVkIGBkYXRhYC5cbiAgICAgKlxuICAgICAqIEB0eXBlUGFyYW0gTmV3UmVzdWx0IC0gVGhlIG5ldyByZXN1bHQgdHlwZSB0byBvdmVycmlkZSB3aXRoXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIG92ZXJyaWRlVHlwZXM8eW91clR5cGUsIHsgbWVyZ2U6IGZhbHNlIH0+KCkgbWV0aG9kIGF0IHRoZSBlbmQgb2YgeW91ciBjYWxsIGNoYWluIGluc3RlYWRcbiAgICAgKi9cbiAgICByZXR1cm5zKCkge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT3ZlcnJpZGUgdGhlIHR5cGUgb2YgdGhlIHJldHVybmVkIGBkYXRhYCBmaWVsZCBpbiB0aGUgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiBAdHlwZVBhcmFtIE5ld1Jlc3VsdCAtIFRoZSBuZXcgdHlwZSB0byBjYXN0IHRoZSByZXNwb25zZSBkYXRhIHRvXG4gICAgICogQHR5cGVQYXJhbSBPcHRpb25zIC0gT3B0aW9uYWwgdHlwZSBjb25maWd1cmF0aW9uIChkZWZhdWx0cyB0byB7IG1lcmdlOiB0cnVlIH0pXG4gICAgICogQHR5cGVQYXJhbSBPcHRpb25zLm1lcmdlIC0gV2hlbiB0cnVlLCBtZXJnZXMgdGhlIG5ldyB0eXBlIHdpdGggZXhpc3RpbmcgcmV0dXJuIHR5cGUuIFdoZW4gZmFsc2UsIHJlcGxhY2VzIHRoZSBleGlzdGluZyB0eXBlcyBlbnRpcmVseSAoZGVmYXVsdHMgdG8gdHJ1ZSlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBNZXJnZSB3aXRoIGV4aXN0aW5nIHR5cGVzIChkZWZhdWx0IGJlaGF2aW9yKVxuICAgICAqIGNvbnN0IHF1ZXJ5ID0gc3VwYWJhc2VcbiAgICAgKiAgIC5mcm9tKCd1c2VycycpXG4gICAgICogICAuc2VsZWN0KClcbiAgICAgKiAgIC5vdmVycmlkZVR5cGVzPHsgY3VzdG9tX2ZpZWxkOiBzdHJpbmcgfT4oKVxuICAgICAqXG4gICAgICogLy8gUmVwbGFjZSBleGlzdGluZyB0eXBlcyBjb21wbGV0ZWx5XG4gICAgICogY29uc3QgcmVwbGFjZVF1ZXJ5ID0gc3VwYWJhc2VcbiAgICAgKiAgIC5mcm9tKCd1c2VycycpXG4gICAgICogICAuc2VsZWN0KClcbiAgICAgKiAgIC5vdmVycmlkZVR5cGVzPHsgaWQ6IG51bWJlcjsgbmFtZTogc3RyaW5nIH0sIHsgbWVyZ2U6IGZhbHNlIH0+KClcbiAgICAgKiBgYGBcbiAgICAgKiBAcmV0dXJucyBBIFBvc3RncmVzdEJ1aWxkZXIgaW5zdGFuY2Ugd2l0aCB0aGUgbmV3IHR5cGVcbiAgICAgKi9cbiAgICBvdmVycmlkZVR5cGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBQb3N0Z3Jlc3RCdWlsZGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UG9zdGdyZXN0QnVpbGRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFBvc3RncmVzdEJ1aWxkZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9Qb3N0Z3Jlc3RCdWlsZGVyXCIpKTtcbmNsYXNzIFBvc3RncmVzdFRyYW5zZm9ybUJ1aWxkZXIgZXh0ZW5kcyBQb3N0Z3Jlc3RCdWlsZGVyXzEuZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhIFNFTEVDVCBvbiB0aGUgcXVlcnkgcmVzdWx0LlxuICAgICAqXG4gICAgICogQnkgZGVmYXVsdCwgYC5pbnNlcnQoKWAsIGAudXBkYXRlKClgLCBgLnVwc2VydCgpYCwgYW5kIGAuZGVsZXRlKClgIGRvIG5vdFxuICAgICAqIHJldHVybiBtb2RpZmllZCByb3dzLiBCeSBjYWxsaW5nIHRoaXMgbWV0aG9kLCBtb2RpZmllZCByb3dzIGFyZSByZXR1cm5lZCBpblxuICAgICAqIGBkYXRhYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW5zIC0gVGhlIGNvbHVtbnMgdG8gcmV0cmlldmUsIHNlcGFyYXRlZCBieSBjb21tYXNcbiAgICAgKi9cbiAgICBzZWxlY3QoY29sdW1ucykge1xuICAgICAgICAvLyBSZW1vdmUgd2hpdGVzcGFjZXMgZXhjZXB0IHdoZW4gcXVvdGVkXG4gICAgICAgIGxldCBxdW90ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgY2xlYW5lZENvbHVtbnMgPSAoY29sdW1ucyAhPT0gbnVsbCAmJiBjb2x1bW5zICE9PSB2b2lkIDAgPyBjb2x1bW5zIDogJyonKVxuICAgICAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAgICAgLm1hcCgoYykgPT4ge1xuICAgICAgICAgICAgaWYgKC9cXHMvLnRlc3QoYykgJiYgIXF1b3RlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjID09PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgcXVvdGVkID0gIXF1b3RlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oJycpO1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuc2V0KCdzZWxlY3QnLCBjbGVhbmVkQ29sdW1ucyk7XG4gICAgICAgIGlmICh0aGlzLmhlYWRlcnNbJ1ByZWZlciddKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnNbJ1ByZWZlciddICs9ICcsJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlYWRlcnNbJ1ByZWZlciddICs9ICdyZXR1cm49cmVwcmVzZW50YXRpb24nO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT3JkZXIgdGhlIHF1ZXJ5IHJlc3VsdCBieSBgY29sdW1uYC5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gY2FsbCB0aGlzIG1ldGhvZCBtdWx0aXBsZSB0aW1lcyB0byBvcmRlciBieSBtdWx0aXBsZSBjb2x1bW5zLlxuICAgICAqXG4gICAgICogWW91IGNhbiBvcmRlciByZWZlcmVuY2VkIHRhYmxlcywgYnV0IGl0IG9ubHkgYWZmZWN0cyB0aGUgb3JkZXJpbmcgb2YgdGhlXG4gICAgICogcGFyZW50IHRhYmxlIGlmIHlvdSB1c2UgYCFpbm5lcmAgaW4gdGhlIHF1ZXJ5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSBjb2x1bW4gdG8gb3JkZXIgYnlcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE5hbWVkIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hc2NlbmRpbmcgLSBJZiBgdHJ1ZWAsIHRoZSByZXN1bHQgd2lsbCBiZSBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5udWxsc0ZpcnN0IC0gSWYgYHRydWVgLCBgbnVsbGBzIGFwcGVhciBmaXJzdC4gSWYgYGZhbHNlYCxcbiAgICAgKiBgbnVsbGBzIGFwcGVhciBsYXN0LlxuICAgICAqIEBwYXJhbSBvcHRpb25zLnJlZmVyZW5jZWRUYWJsZSAtIFNldCB0aGlzIHRvIG9yZGVyIGEgcmVmZXJlbmNlZCB0YWJsZSBieVxuICAgICAqIGl0cyBjb2x1bW5zXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZm9yZWlnblRhYmxlIC0gRGVwcmVjYXRlZCwgdXNlIGBvcHRpb25zLnJlZmVyZW5jZWRUYWJsZWBcbiAgICAgKiBpbnN0ZWFkXG4gICAgICovXG4gICAgb3JkZXIoY29sdW1uLCB7IGFzY2VuZGluZyA9IHRydWUsIG51bGxzRmlyc3QsIGZvcmVpZ25UYWJsZSwgcmVmZXJlbmNlZFRhYmxlID0gZm9yZWlnblRhYmxlLCB9ID0ge30pIHtcbiAgICAgICAgY29uc3Qga2V5ID0gcmVmZXJlbmNlZFRhYmxlID8gYCR7cmVmZXJlbmNlZFRhYmxlfS5vcmRlcmAgOiAnb3JkZXInO1xuICAgICAgICBjb25zdCBleGlzdGluZ09yZGVyID0gdGhpcy51cmwuc2VhcmNoUGFyYW1zLmdldChrZXkpO1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuc2V0KGtleSwgYCR7ZXhpc3RpbmdPcmRlciA/IGAke2V4aXN0aW5nT3JkZXJ9LGAgOiAnJ30ke2NvbHVtbn0uJHthc2NlbmRpbmcgPyAnYXNjJyA6ICdkZXNjJ30ke251bGxzRmlyc3QgPT09IHVuZGVmaW5lZCA/ICcnIDogbnVsbHNGaXJzdCA/ICcubnVsbHNmaXJzdCcgOiAnLm51bGxzbGFzdCd9YCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMaW1pdCB0aGUgcXVlcnkgcmVzdWx0IGJ5IGBjb3VudGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY291bnQgLSBUaGUgbWF4aW11bSBudW1iZXIgb2Ygcm93cyB0byByZXR1cm5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE5hbWVkIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5yZWZlcmVuY2VkVGFibGUgLSBTZXQgdGhpcyB0byBsaW1pdCByb3dzIG9mIHJlZmVyZW5jZWRcbiAgICAgKiB0YWJsZXMgaW5zdGVhZCBvZiB0aGUgcGFyZW50IHRhYmxlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZm9yZWlnblRhYmxlIC0gRGVwcmVjYXRlZCwgdXNlIGBvcHRpb25zLnJlZmVyZW5jZWRUYWJsZWBcbiAgICAgKiBpbnN0ZWFkXG4gICAgICovXG4gICAgbGltaXQoY291bnQsIHsgZm9yZWlnblRhYmxlLCByZWZlcmVuY2VkVGFibGUgPSBmb3JlaWduVGFibGUsIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBrZXkgPSB0eXBlb2YgcmVmZXJlbmNlZFRhYmxlID09PSAndW5kZWZpbmVkJyA/ICdsaW1pdCcgOiBgJHtyZWZlcmVuY2VkVGFibGV9LmxpbWl0YDtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLnNldChrZXksIGAke2NvdW50fWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGltaXQgdGhlIHF1ZXJ5IHJlc3VsdCBieSBzdGFydGluZyBhdCBhbiBvZmZzZXQgYGZyb21gIGFuZCBlbmRpbmcgYXQgdGhlIG9mZnNldCBgdG9gLlxuICAgICAqIE9ubHkgcmVjb3JkcyB3aXRoaW4gdGhpcyByYW5nZSBhcmUgcmV0dXJuZWQuXG4gICAgICogVGhpcyByZXNwZWN0cyB0aGUgcXVlcnkgb3JkZXIgYW5kIGlmIHRoZXJlIGlzIG5vIG9yZGVyIGNsYXVzZSB0aGUgcmFuZ2UgY291bGQgYmVoYXZlIHVuZXhwZWN0ZWRseS5cbiAgICAgKiBUaGUgYGZyb21gIGFuZCBgdG9gIHZhbHVlcyBhcmUgMC1iYXNlZCBhbmQgaW5jbHVzaXZlOiBgcmFuZ2UoMSwgMylgIHdpbGwgaW5jbHVkZSB0aGUgc2Vjb25kLCB0aGlyZFxuICAgICAqIGFuZCBmb3VydGggcm93cyBvZiB0aGUgcXVlcnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZnJvbSAtIFRoZSBzdGFydGluZyBpbmRleCBmcm9tIHdoaWNoIHRvIGxpbWl0IHRoZSByZXN1bHRcbiAgICAgKiBAcGFyYW0gdG8gLSBUaGUgbGFzdCBpbmRleCB0byB3aGljaCB0byBsaW1pdCB0aGUgcmVzdWx0XG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBOYW1lZCBwYXJhbWV0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnMucmVmZXJlbmNlZFRhYmxlIC0gU2V0IHRoaXMgdG8gbGltaXQgcm93cyBvZiByZWZlcmVuY2VkXG4gICAgICogdGFibGVzIGluc3RlYWQgb2YgdGhlIHBhcmVudCB0YWJsZVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmZvcmVpZ25UYWJsZSAtIERlcHJlY2F0ZWQsIHVzZSBgb3B0aW9ucy5yZWZlcmVuY2VkVGFibGVgXG4gICAgICogaW5zdGVhZFxuICAgICAqL1xuICAgIHJhbmdlKGZyb20sIHRvLCB7IGZvcmVpZ25UYWJsZSwgcmVmZXJlbmNlZFRhYmxlID0gZm9yZWlnblRhYmxlLCB9ID0ge30pIHtcbiAgICAgICAgY29uc3Qga2V5T2Zmc2V0ID0gdHlwZW9mIHJlZmVyZW5jZWRUYWJsZSA9PT0gJ3VuZGVmaW5lZCcgPyAnb2Zmc2V0JyA6IGAke3JlZmVyZW5jZWRUYWJsZX0ub2Zmc2V0YDtcbiAgICAgICAgY29uc3Qga2V5TGltaXQgPSB0eXBlb2YgcmVmZXJlbmNlZFRhYmxlID09PSAndW5kZWZpbmVkJyA/ICdsaW1pdCcgOiBgJHtyZWZlcmVuY2VkVGFibGV9LmxpbWl0YDtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLnNldChrZXlPZmZzZXQsIGAke2Zyb219YCk7XG4gICAgICAgIC8vIFJhbmdlIGlzIGluY2x1c2l2ZSwgc28gYWRkIDFcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLnNldChrZXlMaW1pdCwgYCR7dG8gLSBmcm9tICsgMX1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgQWJvcnRTaWduYWwgZm9yIHRoZSBmZXRjaCByZXF1ZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHNpZ25hbCAtIFRoZSBBYm9ydFNpZ25hbCB0byB1c2UgZm9yIHRoZSBmZXRjaCByZXF1ZXN0XG4gICAgICovXG4gICAgYWJvcnRTaWduYWwoc2lnbmFsKSB7XG4gICAgICAgIHRoaXMuc2lnbmFsID0gc2lnbmFsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGBkYXRhYCBhcyBhIHNpbmdsZSBvYmplY3QgaW5zdGVhZCBvZiBhbiBhcnJheSBvZiBvYmplY3RzLlxuICAgICAqXG4gICAgICogUXVlcnkgcmVzdWx0IG11c3QgYmUgb25lIHJvdyAoZS5nLiB1c2luZyBgLmxpbWl0KDEpYCksIG90aGVyd2lzZSB0aGlzXG4gICAgICogcmV0dXJucyBhbiBlcnJvci5cbiAgICAgKi9cbiAgICBzaW5nbGUoKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyc1snQWNjZXB0J10gPSAnYXBwbGljYXRpb24vdm5kLnBncnN0Lm9iamVjdCtqc29uJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBgZGF0YWAgYXMgYSBzaW5nbGUgb2JqZWN0IGluc3RlYWQgb2YgYW4gYXJyYXkgb2Ygb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIFF1ZXJ5IHJlc3VsdCBtdXN0IGJlIHplcm8gb3Igb25lIHJvdyAoZS5nLiB1c2luZyBgLmxpbWl0KDEpYCksIG90aGVyd2lzZVxuICAgICAqIHRoaXMgcmV0dXJucyBhbiBlcnJvci5cbiAgICAgKi9cbiAgICBtYXliZVNpbmdsZSgpIHtcbiAgICAgICAgLy8gVGVtcG9yYXJ5IHBhcnRpYWwgZml4IGZvciBodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2UvcG9zdGdyZXN0LWpzL2lzc3Vlcy8zNjFcbiAgICAgICAgLy8gSXNzdWUgcGVyc2lzdHMgZS5nLiBmb3IgYC5pbnNlcnQoWy4uLl0pLnNlbGVjdCgpLm1heWJlU2luZ2xlKClgXG4gICAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyc1snQWNjZXB0J10gPSAnYXBwbGljYXRpb24vanNvbic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnNbJ0FjY2VwdCddID0gJ2FwcGxpY2F0aW9uL3ZuZC5wZ3JzdC5vYmplY3QranNvbic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc01heWJlU2luZ2xlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBgZGF0YWAgYXMgYSBzdHJpbmcgaW4gQ1NWIGZvcm1hdC5cbiAgICAgKi9cbiAgICBjc3YoKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyc1snQWNjZXB0J10gPSAndGV4dC9jc3YnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGBkYXRhYCBhcyBhbiBvYmplY3QgaW4gW0dlb0pTT05dKGh0dHBzOi8vZ2VvanNvbi5vcmcpIGZvcm1hdC5cbiAgICAgKi9cbiAgICBnZW9qc29uKCkge1xuICAgICAgICB0aGlzLmhlYWRlcnNbJ0FjY2VwdCddID0gJ2FwcGxpY2F0aW9uL2dlbytqc29uJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybiBgZGF0YWAgYXMgdGhlIEVYUExBSU4gcGxhbiBmb3IgdGhlIHF1ZXJ5LlxuICAgICAqXG4gICAgICogWW91IG5lZWQgdG8gZW5hYmxlIHRoZVxuICAgICAqIFtkYl9wbGFuX2VuYWJsZWRdKGh0dHBzOi8vc3VwYWJhc2UuY29tL2RvY3MvZ3VpZGVzL2RhdGFiYXNlL2RlYnVnZ2luZy1wZXJmb3JtYW5jZSNlbmFibGluZy1leHBsYWluKVxuICAgICAqIHNldHRpbmcgYmVmb3JlIHVzaW5nIHRoaXMgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBOYW1lZCBwYXJhbWV0ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hbmFseXplIC0gSWYgYHRydWVgLCB0aGUgcXVlcnkgd2lsbCBiZSBleGVjdXRlZCBhbmQgdGhlXG4gICAgICogYWN0dWFsIHJ1biB0aW1lIHdpbGwgYmUgcmV0dXJuZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zLnZlcmJvc2UgLSBJZiBgdHJ1ZWAsIHRoZSBxdWVyeSBpZGVudGlmaWVyIHdpbGwgYmUgcmV0dXJuZWRcbiAgICAgKiBhbmQgYGRhdGFgIHdpbGwgaW5jbHVkZSB0aGUgb3V0cHV0IGNvbHVtbnMgb2YgdGhlIHF1ZXJ5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5zZXR0aW5ncyAtIElmIGB0cnVlYCwgaW5jbHVkZSBpbmZvcm1hdGlvbiBvbiBjb25maWd1cmF0aW9uXG4gICAgICogcGFyYW1ldGVycyB0aGF0IGFmZmVjdCBxdWVyeSBwbGFubmluZ1xuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYnVmZmVycyAtIElmIGB0cnVlYCwgaW5jbHVkZSBpbmZvcm1hdGlvbiBvbiBidWZmZXIgdXNhZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zLndhbCAtIElmIGB0cnVlYCwgaW5jbHVkZSBpbmZvcm1hdGlvbiBvbiBXQUwgcmVjb3JkIGdlbmVyYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmZvcm1hdCAtIFRoZSBmb3JtYXQgb2YgdGhlIG91dHB1dCwgY2FuIGJlIGBcInRleHRcImAgKGRlZmF1bHQpXG4gICAgICogb3IgYFwianNvblwiYFxuICAgICAqL1xuICAgIGV4cGxhaW4oeyBhbmFseXplID0gZmFsc2UsIHZlcmJvc2UgPSBmYWxzZSwgc2V0dGluZ3MgPSBmYWxzZSwgYnVmZmVycyA9IGZhbHNlLCB3YWwgPSBmYWxzZSwgZm9ybWF0ID0gJ3RleHQnLCB9ID0ge30pIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBvcHRpb25zID0gW1xuICAgICAgICAgICAgYW5hbHl6ZSA/ICdhbmFseXplJyA6IG51bGwsXG4gICAgICAgICAgICB2ZXJib3NlID8gJ3ZlcmJvc2UnIDogbnVsbCxcbiAgICAgICAgICAgIHNldHRpbmdzID8gJ3NldHRpbmdzJyA6IG51bGwsXG4gICAgICAgICAgICBidWZmZXJzID8gJ2J1ZmZlcnMnIDogbnVsbCxcbiAgICAgICAgICAgIHdhbCA/ICd3YWwnIDogbnVsbCxcbiAgICAgICAgXVxuICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgLmpvaW4oJ3wnKTtcbiAgICAgICAgLy8gQW4gQWNjZXB0IGhlYWRlciBjYW4gY2FycnkgbXVsdGlwbGUgbWVkaWEgdHlwZXMgYnV0IHBvc3RncmVzdC1qcyBhbHdheXMgc2VuZHMgb25lXG4gICAgICAgIGNvbnN0IGZvck1lZGlhdHlwZSA9IChfYSA9IHRoaXMuaGVhZGVyc1snQWNjZXB0J10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgICAgdGhpcy5oZWFkZXJzWydBY2NlcHQnXSA9IGBhcHBsaWNhdGlvbi92bmQucGdyc3QucGxhbiske2Zvcm1hdH07IGZvcj1cIiR7Zm9yTWVkaWF0eXBlfVwiOyBvcHRpb25zPSR7b3B0aW9uc307YDtcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2pzb24nKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSb2xsYmFjayB0aGUgcXVlcnkuXG4gICAgICpcbiAgICAgKiBgZGF0YWAgd2lsbCBzdGlsbCBiZSByZXR1cm5lZCwgYnV0IHRoZSBxdWVyeSBpcyBub3QgY29tbWl0dGVkLlxuICAgICAqL1xuICAgIHJvbGxiYWNrKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICgoKF9hID0gdGhpcy5oZWFkZXJzWydQcmVmZXInXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogJycpLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnNbJ1ByZWZlciddICs9ICcsdHg9cm9sbGJhY2snO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJzWydQcmVmZXInXSA9ICd0eD1yb2xsYmFjayc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE92ZXJyaWRlIHRoZSB0eXBlIG9mIHRoZSByZXR1cm5lZCBgZGF0YWAuXG4gICAgICpcbiAgICAgKiBAdHlwZVBhcmFtIE5ld1Jlc3VsdCAtIFRoZSBuZXcgcmVzdWx0IHR5cGUgdG8gb3ZlcnJpZGUgd2l0aFxuICAgICAqIEBkZXByZWNhdGVkIFVzZSBvdmVycmlkZVR5cGVzPHlvdXJUeXBlLCB7IG1lcmdlOiBmYWxzZSB9PigpIG1ldGhvZCBhdCB0aGUgZW5kIG9mIHlvdXIgY2FsbCBjaGFpbiBpbnN0ZWFkXG4gICAgICovXG4gICAgcmV0dXJucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBvc3RncmVzdFRyYW5zZm9ybUJ1aWxkZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBQb3N0Z3Jlc3RUcmFuc2Zvcm1CdWlsZGVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlclwiKSk7XG5jbGFzcyBQb3N0Z3Jlc3RGaWx0ZXJCdWlsZGVyIGV4dGVuZHMgUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlcl8xLmRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGVyZSBgY29sdW1uYCBpcyBlcXVhbCB0byBgdmFsdWVgLlxuICAgICAqXG4gICAgICogVG8gY2hlY2sgaWYgdGhlIHZhbHVlIG9mIGBjb2x1bW5gIGlzIE5VTEwsIHlvdSBzaG91bGQgdXNlIGAuaXMoKWAgaW5zdGVhZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBmaWx0ZXIgd2l0aFxuICAgICAqL1xuICAgIGVxKGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBlcS4ke3ZhbHVlfWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2ggb25seSByb3dzIHdoZXJlIGBjb2x1bW5gIGlzIG5vdCBlcXVhbCB0byBgdmFsdWVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGZpbHRlciB3aXRoXG4gICAgICovXG4gICAgbmVxKGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBuZXEuJHt2YWx1ZX1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGVyZSBgY29sdW1uYCBpcyBncmVhdGVyIHRoYW4gYHZhbHVlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBmaWx0ZXIgd2l0aFxuICAgICAqL1xuICAgIGd0KGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBndC4ke3ZhbHVlfWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2ggb25seSByb3dzIHdoZXJlIGBjb2x1bW5gIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBgdmFsdWVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGZpbHRlciB3aXRoXG4gICAgICovXG4gICAgZ3RlKGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBndGUuJHt2YWx1ZX1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGVyZSBgY29sdW1uYCBpcyBsZXNzIHRoYW4gYHZhbHVlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBmaWx0ZXIgd2l0aFxuICAgICAqL1xuICAgIGx0KGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBsdC4ke3ZhbHVlfWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2ggb25seSByb3dzIHdoZXJlIGBjb2x1bW5gIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgdmFsdWVgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGZpbHRlciB3aXRoXG4gICAgICovXG4gICAgbHRlKGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBsdGUuJHt2YWx1ZX1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGVyZSBgY29sdW1uYCBtYXRjaGVzIGBwYXR0ZXJuYCBjYXNlLXNlbnNpdGl2ZWx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHBhdHRlcm4gLSBUaGUgcGF0dGVybiB0byBtYXRjaCB3aXRoXG4gICAgICovXG4gICAgbGlrZShjb2x1bW4sIHBhdHRlcm4pIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBsaWtlLiR7cGF0dGVybn1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGVyZSBgY29sdW1uYCBtYXRjaGVzIGFsbCBvZiBgcGF0dGVybnNgIGNhc2Utc2Vuc2l0aXZlbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sdW1uIC0gVGhlIGNvbHVtbiB0byBmaWx0ZXIgb25cbiAgICAgKiBAcGFyYW0gcGF0dGVybnMgLSBUaGUgcGF0dGVybnMgdG8gbWF0Y2ggd2l0aFxuICAgICAqL1xuICAgIGxpa2VBbGxPZihjb2x1bW4sIHBhdHRlcm5zKSB7XG4gICAgICAgIHRoaXMudXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoY29sdW1uLCBgbGlrZShhbGwpLnske3BhdHRlcm5zLmpvaW4oJywnKX19YCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXRjaCBvbmx5IHJvd3Mgd2hlcmUgYGNvbHVtbmAgbWF0Y2hlcyBhbnkgb2YgYHBhdHRlcm5zYCBjYXNlLXNlbnNpdGl2ZWx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHBhdHRlcm5zIC0gVGhlIHBhdHRlcm5zIHRvIG1hdGNoIHdpdGhcbiAgICAgKi9cbiAgICBsaWtlQW55T2YoY29sdW1uLCBwYXR0ZXJucykge1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYGxpa2UoYW55KS57JHtwYXR0ZXJucy5qb2luKCcsJyl9fWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2ggb25seSByb3dzIHdoZXJlIGBjb2x1bW5gIG1hdGNoZXMgYHBhdHRlcm5gIGNhc2UtaW5zZW5zaXRpdmVseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSBwYXR0ZXJuIC0gVGhlIHBhdHRlcm4gdG8gbWF0Y2ggd2l0aFxuICAgICAqL1xuICAgIGlsaWtlKGNvbHVtbiwgcGF0dGVybikge1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYGlsaWtlLiR7cGF0dGVybn1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGVyZSBgY29sdW1uYCBtYXRjaGVzIGFsbCBvZiBgcGF0dGVybnNgIGNhc2UtaW5zZW5zaXRpdmVseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSBwYXR0ZXJucyAtIFRoZSBwYXR0ZXJucyB0byBtYXRjaCB3aXRoXG4gICAgICovXG4gICAgaWxpa2VBbGxPZihjb2x1bW4sIHBhdHRlcm5zKSB7XG4gICAgICAgIHRoaXMudXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoY29sdW1uLCBgaWxpa2UoYWxsKS57JHtwYXR0ZXJucy5qb2luKCcsJyl9fWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2ggb25seSByb3dzIHdoZXJlIGBjb2x1bW5gIG1hdGNoZXMgYW55IG9mIGBwYXR0ZXJuc2AgY2FzZS1pbnNlbnNpdGl2ZWx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHBhdHRlcm5zIC0gVGhlIHBhdHRlcm5zIHRvIG1hdGNoIHdpdGhcbiAgICAgKi9cbiAgICBpbGlrZUFueU9mKGNvbHVtbiwgcGF0dGVybnMpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBpbGlrZShhbnkpLnske3BhdHRlcm5zLmpvaW4oJywnKX19YCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXRjaCBvbmx5IHJvd3Mgd2hlcmUgYGNvbHVtbmAgSVMgYHZhbHVlYC5cbiAgICAgKlxuICAgICAqIEZvciBub24tYm9vbGVhbiBjb2x1bW5zLCB0aGlzIGlzIG9ubHkgcmVsZXZhbnQgZm9yIGNoZWNraW5nIGlmIHRoZSB2YWx1ZSBvZlxuICAgICAqIGBjb2x1bW5gIGlzIE5VTEwgYnkgc2V0dGluZyBgdmFsdWVgIHRvIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEZvciBib29sZWFuIGNvbHVtbnMsIHlvdSBjYW4gYWxzbyBzZXQgYHZhbHVlYCB0byBgdHJ1ZWAgb3IgYGZhbHNlYCBhbmQgaXRcbiAgICAgKiB3aWxsIGJlaGF2ZSB0aGUgc2FtZSB3YXkgYXMgYC5lcSgpYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBmaWx0ZXIgd2l0aFxuICAgICAqL1xuICAgIGlzKGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBpcy4ke3ZhbHVlfWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2ggb25seSByb3dzIHdoZXJlIGBjb2x1bW5gIGlzIGluY2x1ZGVkIGluIHRoZSBgdmFsdWVzYCBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSB2YWx1ZXMgLSBUaGUgdmFsdWVzIGFycmF5IHRvIGZpbHRlciB3aXRoXG4gICAgICovXG4gICAgaW4oY29sdW1uLCB2YWx1ZXMpIHtcbiAgICAgICAgY29uc3QgY2xlYW5lZFZhbHVlcyA9IEFycmF5LmZyb20obmV3IFNldCh2YWx1ZXMpKVxuICAgICAgICAgICAgLm1hcCgocykgPT4ge1xuICAgICAgICAgICAgLy8gaGFuZGxlIHBvc3RncmVzdCByZXNlcnZlZCBjaGFyYWN0ZXJzXG4gICAgICAgICAgICAvLyBodHRwczovL3Bvc3RncmVzdC5vcmcvZW4vdjcuMC4wL2FwaS5odG1sI3Jlc2VydmVkLWNoYXJhY3RlcnNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcyA9PT0gJ3N0cmluZycgJiYgbmV3IFJlZ0V4cCgnWywoKV0nKS50ZXN0KHMpKVxuICAgICAgICAgICAgICAgIHJldHVybiBgXCIke3N9XCJgO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtzfWA7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignLCcpO1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYGluLigke2NsZWFuZWRWYWx1ZXN9KWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT25seSByZWxldmFudCBmb3IganNvbmIsIGFycmF5LCBhbmQgcmFuZ2UgY29sdW1ucy4gTWF0Y2ggb25seSByb3dzIHdoZXJlXG4gICAgICogYGNvbHVtbmAgY29udGFpbnMgZXZlcnkgZWxlbWVudCBhcHBlYXJpbmcgaW4gYHZhbHVlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUganNvbmIsIGFycmF5LCBvciByYW5nZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIGpzb25iLCBhcnJheSwgb3IgcmFuZ2UgdmFsdWUgdG8gZmlsdGVyIHdpdGhcbiAgICAgKi9cbiAgICBjb250YWlucyhjb2x1bW4sIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyByYW5nZSB0eXBlcyBjYW4gYmUgaW5jbHVzaXZlICdbJywgJ10nIG9yIGV4Y2x1c2l2ZSAnKCcsICcpJyBzbyBqdXN0XG4gICAgICAgICAgICAvLyBrZWVwIGl0IHNpbXBsZSBhbmQgYWNjZXB0IGEgc3RyaW5nXG4gICAgICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYGNzLiR7dmFsdWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIGFycmF5XG4gICAgICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYGNzLnske3ZhbHVlLmpvaW4oJywnKX19YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBqc29uXG4gICAgICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYGNzLiR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBPbmx5IHJlbGV2YW50IGZvciBqc29uYiwgYXJyYXksIGFuZCByYW5nZSBjb2x1bW5zLiBNYXRjaCBvbmx5IHJvd3Mgd2hlcmVcbiAgICAgKiBldmVyeSBlbGVtZW50IGFwcGVhcmluZyBpbiBgY29sdW1uYCBpcyBjb250YWluZWQgYnkgYHZhbHVlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUganNvbmIsIGFycmF5LCBvciByYW5nZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIGpzb25iLCBhcnJheSwgb3IgcmFuZ2UgdmFsdWUgdG8gZmlsdGVyIHdpdGhcbiAgICAgKi9cbiAgICBjb250YWluZWRCeShjb2x1bW4sIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyByYW5nZVxuICAgICAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBjZC4ke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBhcnJheVxuICAgICAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBjZC57JHt2YWx1ZS5qb2luKCcsJyl9fWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8ganNvblxuICAgICAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBjZC4ke0pTT04uc3RyaW5naWZ5KHZhbHVlKX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT25seSByZWxldmFudCBmb3IgcmFuZ2UgY29sdW1ucy4gTWF0Y2ggb25seSByb3dzIHdoZXJlIGV2ZXJ5IGVsZW1lbnQgaW5cbiAgICAgKiBgY29sdW1uYCBpcyBncmVhdGVyIHRoYW4gYW55IGVsZW1lbnQgaW4gYHJhbmdlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgcmFuZ2UgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSByYW5nZSAtIFRoZSByYW5nZSB0byBmaWx0ZXIgd2l0aFxuICAgICAqL1xuICAgIHJhbmdlR3QoY29sdW1uLCByYW5nZSkge1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYHNyLiR7cmFuZ2V9YCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBPbmx5IHJlbGV2YW50IGZvciByYW5nZSBjb2x1bW5zLiBNYXRjaCBvbmx5IHJvd3Mgd2hlcmUgZXZlcnkgZWxlbWVudCBpblxuICAgICAqIGBjb2x1bW5gIGlzIGVpdGhlciBjb250YWluZWQgaW4gYHJhbmdlYCBvciBncmVhdGVyIHRoYW4gYW55IGVsZW1lbnQgaW5cbiAgICAgKiBgcmFuZ2VgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSByYW5nZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHJhbmdlIC0gVGhlIHJhbmdlIHRvIGZpbHRlciB3aXRoXG4gICAgICovXG4gICAgcmFuZ2VHdGUoY29sdW1uLCByYW5nZSkge1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYG54bC4ke3JhbmdlfWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT25seSByZWxldmFudCBmb3IgcmFuZ2UgY29sdW1ucy4gTWF0Y2ggb25seSByb3dzIHdoZXJlIGV2ZXJ5IGVsZW1lbnQgaW5cbiAgICAgKiBgY29sdW1uYCBpcyBsZXNzIHRoYW4gYW55IGVsZW1lbnQgaW4gYHJhbmdlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgcmFuZ2UgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSByYW5nZSAtIFRoZSByYW5nZSB0byBmaWx0ZXIgd2l0aFxuICAgICAqL1xuICAgIHJhbmdlTHQoY29sdW1uLCByYW5nZSkge1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYHNsLiR7cmFuZ2V9YCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBPbmx5IHJlbGV2YW50IGZvciByYW5nZSBjb2x1bW5zLiBNYXRjaCBvbmx5IHJvd3Mgd2hlcmUgZXZlcnkgZWxlbWVudCBpblxuICAgICAqIGBjb2x1bW5gIGlzIGVpdGhlciBjb250YWluZWQgaW4gYHJhbmdlYCBvciBsZXNzIHRoYW4gYW55IGVsZW1lbnQgaW5cbiAgICAgKiBgcmFuZ2VgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbHVtbiAtIFRoZSByYW5nZSBjb2x1bW4gdG8gZmlsdGVyIG9uXG4gICAgICogQHBhcmFtIHJhbmdlIC0gVGhlIHJhbmdlIHRvIGZpbHRlciB3aXRoXG4gICAgICovXG4gICAgcmFuZ2VMdGUoY29sdW1uLCByYW5nZSkge1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYG54ci4ke3JhbmdlfWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT25seSByZWxldmFudCBmb3IgcmFuZ2UgY29sdW1ucy4gTWF0Y2ggb25seSByb3dzIHdoZXJlIGBjb2x1bW5gIGlzXG4gICAgICogbXV0dWFsbHkgZXhjbHVzaXZlIHRvIGByYW5nZWAgYW5kIHRoZXJlIGNhbiBiZSBubyBlbGVtZW50IGJldHdlZW4gdGhlIHR3b1xuICAgICAqIHJhbmdlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgcmFuZ2UgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSByYW5nZSAtIFRoZSByYW5nZSB0byBmaWx0ZXIgd2l0aFxuICAgICAqL1xuICAgIHJhbmdlQWRqYWNlbnQoY29sdW1uLCByYW5nZSkge1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYGFkai4ke3JhbmdlfWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT25seSByZWxldmFudCBmb3IgYXJyYXkgYW5kIHJhbmdlIGNvbHVtbnMuIE1hdGNoIG9ubHkgcm93cyB3aGVyZVxuICAgICAqIGBjb2x1bW5gIGFuZCBgdmFsdWVgIGhhdmUgYW4gZWxlbWVudCBpbiBjb21tb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sdW1uIC0gVGhlIGFycmF5IG9yIHJhbmdlIGNvbHVtbiB0byBmaWx0ZXIgb25cbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgYXJyYXkgb3IgcmFuZ2UgdmFsdWUgdG8gZmlsdGVyIHdpdGhcbiAgICAgKi9cbiAgICBvdmVybGFwcyhjb2x1bW4sIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyByYW5nZVxuICAgICAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBvdi4ke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gYXJyYXlcbiAgICAgICAgICAgIHRoaXMudXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoY29sdW1uLCBgb3YueyR7dmFsdWUuam9pbignLCcpfX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogT25seSByZWxldmFudCBmb3IgdGV4dCBhbmQgdHN2ZWN0b3IgY29sdW1ucy4gTWF0Y2ggb25seSByb3dzIHdoZXJlXG4gICAgICogYGNvbHVtbmAgbWF0Y2hlcyB0aGUgcXVlcnkgc3RyaW5nIGluIGBxdWVyeWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sdW1uIC0gVGhlIHRleHQgb3IgdHN2ZWN0b3IgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSBxdWVyeSAtIFRoZSBxdWVyeSB0ZXh0IHRvIG1hdGNoIHdpdGhcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE5hbWVkIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5jb25maWcgLSBUaGUgdGV4dCBzZWFyY2ggY29uZmlndXJhdGlvbiB0byB1c2VcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50eXBlIC0gQ2hhbmdlIGhvdyB0aGUgYHF1ZXJ5YCB0ZXh0IGlzIGludGVycHJldGVkXG4gICAgICovXG4gICAgdGV4dFNlYXJjaChjb2x1bW4sIHF1ZXJ5LCB7IGNvbmZpZywgdHlwZSB9ID0ge30pIHtcbiAgICAgICAgbGV0IHR5cGVQYXJ0ID0gJyc7XG4gICAgICAgIGlmICh0eXBlID09PSAncGxhaW4nKSB7XG4gICAgICAgICAgICB0eXBlUGFydCA9ICdwbCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ3BocmFzZScpIHtcbiAgICAgICAgICAgIHR5cGVQYXJ0ID0gJ3BoJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnd2Vic2VhcmNoJykge1xuICAgICAgICAgICAgdHlwZVBhcnQgPSAndyc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29uZmlnUGFydCA9IGNvbmZpZyA9PT0gdW5kZWZpbmVkID8gJycgOiBgKCR7Y29uZmlnfSlgO1xuICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGNvbHVtbiwgYCR7dHlwZVBhcnR9ZnRzJHtjb25maWdQYXJ0fS4ke3F1ZXJ5fWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2ggb25seSByb3dzIHdoZXJlIGVhY2ggY29sdW1uIGluIGBxdWVyeWAga2V5cyBpcyBlcXVhbCB0byBpdHNcbiAgICAgKiBhc3NvY2lhdGVkIHZhbHVlLiBTaG9ydGhhbmQgZm9yIG11bHRpcGxlIGAuZXEoKWBzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHF1ZXJ5IC0gVGhlIG9iamVjdCB0byBmaWx0ZXIgd2l0aCwgd2l0aCBjb2x1bW4gbmFtZXMgYXMga2V5cyBtYXBwZWRcbiAgICAgKiB0byB0aGVpciBmaWx0ZXIgdmFsdWVzXG4gICAgICovXG4gICAgbWF0Y2gocXVlcnkpIHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocXVlcnkpLmZvckVhY2goKFtjb2x1bW4sIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBlcS4ke3ZhbHVlfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGljaCBkb2Vzbid0IHNhdGlzZnkgdGhlIGZpbHRlci5cbiAgICAgKlxuICAgICAqIFVubGlrZSBtb3N0IGZpbHRlcnMsIGBvcGVhcmF0b3JgIGFuZCBgdmFsdWVgIGFyZSB1c2VkIGFzLWlzIGFuZCBuZWVkIHRvXG4gICAgICogZm9sbG93IFtQb3N0Z1JFU1RcbiAgICAgKiBzeW50YXhdKGh0dHBzOi8vcG9zdGdyZXN0Lm9yZy9lbi9zdGFibGUvYXBpLmh0bWwjb3BlcmF0b3JzKS4gWW91IGFsc28gbmVlZFxuICAgICAqIHRvIG1ha2Ugc3VyZSB0aGV5IGFyZSBwcm9wZXJseSBzYW5pdGl6ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sdW1uIC0gVGhlIGNvbHVtbiB0byBmaWx0ZXIgb25cbiAgICAgKiBAcGFyYW0gb3BlcmF0b3IgLSBUaGUgb3BlcmF0b3IgdG8gYmUgbmVnYXRlZCB0byBmaWx0ZXIgd2l0aCwgZm9sbG93aW5nXG4gICAgICogUG9zdGdSRVNUIHN5bnRheFxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBmaWx0ZXIgd2l0aCwgZm9sbG93aW5nIFBvc3RnUkVTVCBzeW50YXhcbiAgICAgKi9cbiAgICBub3QoY29sdW1uLCBvcGVyYXRvciwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChjb2x1bW4sIGBub3QuJHtvcGVyYXRvcn0uJHt2YWx1ZX1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1hdGNoIG9ubHkgcm93cyB3aGljaCBzYXRpc2Z5IGF0IGxlYXN0IG9uZSBvZiB0aGUgZmlsdGVycy5cbiAgICAgKlxuICAgICAqIFVubGlrZSBtb3N0IGZpbHRlcnMsIGBmaWx0ZXJzYCBpcyB1c2VkIGFzLWlzIGFuZCBuZWVkcyB0byBmb2xsb3cgW1Bvc3RnUkVTVFxuICAgICAqIHN5bnRheF0oaHR0cHM6Ly9wb3N0Z3Jlc3Qub3JnL2VuL3N0YWJsZS9hcGkuaHRtbCNvcGVyYXRvcnMpLiBZb3UgYWxzbyBuZWVkXG4gICAgICogdG8gbWFrZSBzdXJlIGl0J3MgcHJvcGVybHkgc2FuaXRpemVkLlxuICAgICAqXG4gICAgICogSXQncyBjdXJyZW50bHkgbm90IHBvc3NpYmxlIHRvIGRvIGFuIGAub3IoKWAgZmlsdGVyIGFjcm9zcyBtdWx0aXBsZSB0YWJsZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmlsdGVycyAtIFRoZSBmaWx0ZXJzIHRvIHVzZSwgZm9sbG93aW5nIFBvc3RnUkVTVCBzeW50YXhcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE5hbWVkIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5yZWZlcmVuY2VkVGFibGUgLSBTZXQgdGhpcyB0byBmaWx0ZXIgb24gcmVmZXJlbmNlZCB0YWJsZXNcbiAgICAgKiBpbnN0ZWFkIG9mIHRoZSBwYXJlbnQgdGFibGVcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5mb3JlaWduVGFibGUgLSBEZXByZWNhdGVkLCB1c2UgYHJlZmVyZW5jZWRUYWJsZWAgaW5zdGVhZFxuICAgICAqL1xuICAgIG9yKGZpbHRlcnMsIHsgZm9yZWlnblRhYmxlLCByZWZlcmVuY2VkVGFibGUgPSBmb3JlaWduVGFibGUsIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBrZXkgPSByZWZlcmVuY2VkVGFibGUgPyBgJHtyZWZlcmVuY2VkVGFibGV9Lm9yYCA6ICdvcic7XG4gICAgICAgIHRoaXMudXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoa2V5LCBgKCR7ZmlsdGVyc30pYCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXRjaCBvbmx5IHJvd3Mgd2hpY2ggc2F0aXNmeSB0aGUgZmlsdGVyLiBUaGlzIGlzIGFuIGVzY2FwZSBoYXRjaCAtIHlvdVxuICAgICAqIHNob3VsZCB1c2UgdGhlIHNwZWNpZmljIGZpbHRlciBtZXRob2RzIHdoZXJldmVyIHBvc3NpYmxlLlxuICAgICAqXG4gICAgICogVW5saWtlIG1vc3QgZmlsdGVycywgYG9wZWFyYXRvcmAgYW5kIGB2YWx1ZWAgYXJlIHVzZWQgYXMtaXMgYW5kIG5lZWQgdG9cbiAgICAgKiBmb2xsb3cgW1Bvc3RnUkVTVFxuICAgICAqIHN5bnRheF0oaHR0cHM6Ly9wb3N0Z3Jlc3Qub3JnL2VuL3N0YWJsZS9hcGkuaHRtbCNvcGVyYXRvcnMpLiBZb3UgYWxzbyBuZWVkXG4gICAgICogdG8gbWFrZSBzdXJlIHRoZXkgYXJlIHByb3Blcmx5IHNhbml0aXplZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2x1bW4gLSBUaGUgY29sdW1uIHRvIGZpbHRlciBvblxuICAgICAqIEBwYXJhbSBvcGVyYXRvciAtIFRoZSBvcGVyYXRvciB0byBmaWx0ZXIgd2l0aCwgZm9sbG93aW5nIFBvc3RnUkVTVCBzeW50YXhcbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gZmlsdGVyIHdpdGgsIGZvbGxvd2luZyBQb3N0Z1JFU1Qgc3ludGF4XG4gICAgICovXG4gICAgZmlsdGVyKGNvbHVtbiwgb3BlcmF0b3IsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMudXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoY29sdW1uLCBgJHtvcGVyYXRvcn0uJHt2YWx1ZX1gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUG9zdGdyZXN0RmlsdGVyQnVpbGRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBvc3RncmVzdEZpbHRlckJ1aWxkZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBQb3N0Z3Jlc3RGaWx0ZXJCdWlsZGVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vUG9zdGdyZXN0RmlsdGVyQnVpbGRlclwiKSk7XG5jbGFzcyBQb3N0Z3Jlc3RRdWVyeUJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yKHVybCwgeyBoZWFkZXJzID0ge30sIHNjaGVtYSwgZmV0Y2gsIH0pIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuICAgICAgICB0aGlzLmZldGNoID0gZmV0Y2g7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYSBTRUxFQ1QgcXVlcnkgb24gdGhlIHRhYmxlIG9yIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sdW1ucyAtIFRoZSBjb2x1bW5zIHRvIHJldHJpZXZlLCBzZXBhcmF0ZWQgYnkgY29tbWFzLiBDb2x1bW5zIGNhbiBiZSByZW5hbWVkIHdoZW4gcmV0dXJuZWQgd2l0aCBgY3VzdG9tTmFtZTpjb2x1bW5OYW1lYFxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBOYW1lZCBwYXJhbWV0ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oZWFkIC0gV2hlbiBzZXQgdG8gYHRydWVgLCBgZGF0YWAgd2lsbCBub3QgYmUgcmV0dXJuZWQuXG4gICAgICogVXNlZnVsIGlmIHlvdSBvbmx5IG5lZWQgdGhlIGNvdW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMuY291bnQgLSBDb3VudCBhbGdvcml0aG0gdG8gdXNlIHRvIGNvdW50IHJvd3MgaW4gdGhlIHRhYmxlIG9yIHZpZXcuXG4gICAgICpcbiAgICAgKiBgXCJleGFjdFwiYDogRXhhY3QgYnV0IHNsb3cgY291bnQgYWxnb3JpdGhtLiBQZXJmb3JtcyBhIGBDT1VOVCgqKWAgdW5kZXIgdGhlXG4gICAgICogaG9vZC5cbiAgICAgKlxuICAgICAqIGBcInBsYW5uZWRcImA6IEFwcHJveGltYXRlZCBidXQgZmFzdCBjb3VudCBhbGdvcml0aG0uIFVzZXMgdGhlIFBvc3RncmVzXG4gICAgICogc3RhdGlzdGljcyB1bmRlciB0aGUgaG9vZC5cbiAgICAgKlxuICAgICAqIGBcImVzdGltYXRlZFwiYDogVXNlcyBleGFjdCBjb3VudCBmb3IgbG93IG51bWJlcnMgYW5kIHBsYW5uZWQgY291bnQgZm9yIGhpZ2hcbiAgICAgKiBudW1iZXJzLlxuICAgICAqL1xuICAgIHNlbGVjdChjb2x1bW5zLCB7IGhlYWQgPSBmYWxzZSwgY291bnQsIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBtZXRob2QgPSBoZWFkID8gJ0hFQUQnIDogJ0dFVCc7XG4gICAgICAgIC8vIFJlbW92ZSB3aGl0ZXNwYWNlcyBleGNlcHQgd2hlbiBxdW90ZWRcbiAgICAgICAgbGV0IHF1b3RlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBjbGVhbmVkQ29sdW1ucyA9IChjb2x1bW5zICE9PSBudWxsICYmIGNvbHVtbnMgIT09IHZvaWQgMCA/IGNvbHVtbnMgOiAnKicpXG4gICAgICAgICAgICAuc3BsaXQoJycpXG4gICAgICAgICAgICAubWFwKChjKSA9PiB7XG4gICAgICAgICAgICBpZiAoL1xccy8udGVzdChjKSAmJiAhcXVvdGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMgPT09ICdcIicpIHtcbiAgICAgICAgICAgICAgICBxdW90ZWQgPSAhcXVvdGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgIHRoaXMudXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3NlbGVjdCcsIGNsZWFuZWRDb2x1bW5zKTtcbiAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcnNbJ1ByZWZlciddID0gYGNvdW50PSR7Y291bnR9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFBvc3RncmVzdEZpbHRlckJ1aWxkZXJfMS5kZWZhdWx0KHtcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hLFxuICAgICAgICAgICAgZmV0Y2g6IHRoaXMuZmV0Y2gsXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gSU5TRVJUIGludG8gdGhlIHRhYmxlIG9yIHZpZXcuXG4gICAgICpcbiAgICAgKiBCeSBkZWZhdWx0LCBpbnNlcnRlZCByb3dzIGFyZSBub3QgcmV0dXJuZWQuIFRvIHJldHVybiBpdCwgY2hhaW4gdGhlIGNhbGxcbiAgICAgKiB3aXRoIGAuc2VsZWN0KClgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlcyAtIFRoZSB2YWx1ZXMgdG8gaW5zZXJ0LiBQYXNzIGFuIG9iamVjdCB0byBpbnNlcnQgYSBzaW5nbGUgcm93XG4gICAgICogb3IgYW4gYXJyYXkgdG8gaW5zZXJ0IG11bHRpcGxlIHJvd3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE5hbWVkIHBhcmFtZXRlcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmNvdW50IC0gQ291bnQgYWxnb3JpdGhtIHRvIHVzZSB0byBjb3VudCBpbnNlcnRlZCByb3dzLlxuICAgICAqXG4gICAgICogYFwiZXhhY3RcImA6IEV4YWN0IGJ1dCBzbG93IGNvdW50IGFsZ29yaXRobS4gUGVyZm9ybXMgYSBgQ09VTlQoKilgIHVuZGVyIHRoZVxuICAgICAqIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJwbGFubmVkXCJgOiBBcHByb3hpbWF0ZWQgYnV0IGZhc3QgY291bnQgYWxnb3JpdGhtLiBVc2VzIHRoZSBQb3N0Z3Jlc1xuICAgICAqIHN0YXRpc3RpY3MgdW5kZXIgdGhlIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJlc3RpbWF0ZWRcImA6IFVzZXMgZXhhY3QgY291bnQgZm9yIGxvdyBudW1iZXJzIGFuZCBwbGFubmVkIGNvdW50IGZvciBoaWdoXG4gICAgICogbnVtYmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmRlZmF1bHRUb051bGwgLSBNYWtlIG1pc3NpbmcgZmllbGRzIGRlZmF1bHQgdG8gYG51bGxgLlxuICAgICAqIE90aGVyd2lzZSwgdXNlIHRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgY29sdW1uLiBPbmx5IGFwcGxpZXMgZm9yIGJ1bGtcbiAgICAgKiBpbnNlcnRzLlxuICAgICAqL1xuICAgIGluc2VydCh2YWx1ZXMsIHsgY291bnQsIGRlZmF1bHRUb051bGwgPSB0cnVlLCB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICBjb25zdCBwcmVmZXJzSGVhZGVycyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzWydQcmVmZXInXSkge1xuICAgICAgICAgICAgcHJlZmVyc0hlYWRlcnMucHVzaCh0aGlzLmhlYWRlcnNbJ1ByZWZlciddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICAgIHByZWZlcnNIZWFkZXJzLnB1c2goYGNvdW50PSR7Y291bnR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWZhdWx0VG9OdWxsKSB7XG4gICAgICAgICAgICBwcmVmZXJzSGVhZGVycy5wdXNoKCdtaXNzaW5nPWRlZmF1bHQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlYWRlcnNbJ1ByZWZlciddID0gcHJlZmVyc0hlYWRlcnMuam9pbignLCcpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5zID0gdmFsdWVzLnJlZHVjZSgoYWNjLCB4KSA9PiBhY2MuY29uY2F0KE9iamVjdC5rZXlzKHgpKSwgW10pO1xuICAgICAgICAgICAgaWYgKGNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXF1ZUNvbHVtbnMgPSBbLi4ubmV3IFNldChjb2x1bW5zKV0ubWFwKChjb2x1bW4pID0+IGBcIiR7Y29sdW1ufVwiYCk7XG4gICAgICAgICAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLnNldCgnY29sdW1ucycsIHVuaXF1ZUNvbHVtbnMuam9pbignLCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFBvc3RncmVzdEZpbHRlckJ1aWxkZXJfMS5kZWZhdWx0KHtcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hLFxuICAgICAgICAgICAgYm9keTogdmFsdWVzLFxuICAgICAgICAgICAgZmV0Y2g6IHRoaXMuZmV0Y2gsXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gVVBTRVJUIG9uIHRoZSB0YWJsZSBvciB2aWV3LiBEZXBlbmRpbmcgb24gdGhlIGNvbHVtbihzKSBwYXNzZWRcbiAgICAgKiB0byBgb25Db25mbGljdGAsIGAudXBzZXJ0KClgIGFsbG93cyB5b3UgdG8gcGVyZm9ybSB0aGUgZXF1aXZhbGVudCBvZlxuICAgICAqIGAuaW5zZXJ0KClgIGlmIGEgcm93IHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgYG9uQ29uZmxpY3RgIGNvbHVtbnMgZG9lc24ndFxuICAgICAqIGV4aXN0LCBvciBpZiBpdCBkb2VzIGV4aXN0LCBwZXJmb3JtIGFuIGFsdGVybmF0aXZlIGFjdGlvbiBkZXBlbmRpbmcgb25cbiAgICAgKiBgaWdub3JlRHVwbGljYXRlc2AuXG4gICAgICpcbiAgICAgKiBCeSBkZWZhdWx0LCB1cHNlcnRlZCByb3dzIGFyZSBub3QgcmV0dXJuZWQuIFRvIHJldHVybiBpdCwgY2hhaW4gdGhlIGNhbGxcbiAgICAgKiB3aXRoIGAuc2VsZWN0KClgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlcyAtIFRoZSB2YWx1ZXMgdG8gdXBzZXJ0IHdpdGguIFBhc3MgYW4gb2JqZWN0IHRvIHVwc2VydCBhXG4gICAgICogc2luZ2xlIHJvdyBvciBhbiBhcnJheSB0byB1cHNlcnQgbXVsdGlwbGUgcm93cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIC0gTmFtZWQgcGFyYW1ldGVyc1xuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMub25Db25mbGljdCAtIENvbW1hLXNlcGFyYXRlZCBVTklRVUUgY29sdW1uKHMpIHRvIHNwZWNpZnkgaG93XG4gICAgICogZHVwbGljYXRlIHJvd3MgYXJlIGRldGVybWluZWQuIFR3byByb3dzIGFyZSBkdXBsaWNhdGVzIGlmIGFsbCB0aGVcbiAgICAgKiBgb25Db25mbGljdGAgY29sdW1ucyBhcmUgZXF1YWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pZ25vcmVEdXBsaWNhdGVzIC0gSWYgYHRydWVgLCBkdXBsaWNhdGUgcm93cyBhcmUgaWdub3JlZC4gSWZcbiAgICAgKiBgZmFsc2VgLCBkdXBsaWNhdGUgcm93cyBhcmUgbWVyZ2VkIHdpdGggZXhpc3Rpbmcgcm93cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmNvdW50IC0gQ291bnQgYWxnb3JpdGhtIHRvIHVzZSB0byBjb3VudCB1cHNlcnRlZCByb3dzLlxuICAgICAqXG4gICAgICogYFwiZXhhY3RcImA6IEV4YWN0IGJ1dCBzbG93IGNvdW50IGFsZ29yaXRobS4gUGVyZm9ybXMgYSBgQ09VTlQoKilgIHVuZGVyIHRoZVxuICAgICAqIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJwbGFubmVkXCJgOiBBcHByb3hpbWF0ZWQgYnV0IGZhc3QgY291bnQgYWxnb3JpdGhtLiBVc2VzIHRoZSBQb3N0Z3Jlc1xuICAgICAqIHN0YXRpc3RpY3MgdW5kZXIgdGhlIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJlc3RpbWF0ZWRcImA6IFVzZXMgZXhhY3QgY291bnQgZm9yIGxvdyBudW1iZXJzIGFuZCBwbGFubmVkIGNvdW50IGZvciBoaWdoXG4gICAgICogbnVtYmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmRlZmF1bHRUb051bGwgLSBNYWtlIG1pc3NpbmcgZmllbGRzIGRlZmF1bHQgdG8gYG51bGxgLlxuICAgICAqIE90aGVyd2lzZSwgdXNlIHRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgY29sdW1uLiBUaGlzIG9ubHkgYXBwbGllcyB3aGVuXG4gICAgICogaW5zZXJ0aW5nIG5ldyByb3dzLCBub3Qgd2hlbiBtZXJnaW5nIHdpdGggZXhpc3Rpbmcgcm93cyB1bmRlclxuICAgICAqIGBpZ25vcmVEdXBsaWNhdGVzOiBmYWxzZWAuIFRoaXMgYWxzbyBvbmx5IGFwcGxpZXMgd2hlbiBkb2luZyBidWxrIHVwc2VydHMuXG4gICAgICovXG4gICAgdXBzZXJ0KHZhbHVlcywgeyBvbkNvbmZsaWN0LCBpZ25vcmVEdXBsaWNhdGVzID0gZmFsc2UsIGNvdW50LCBkZWZhdWx0VG9OdWxsID0gdHJ1ZSwgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgY29uc3QgcHJlZmVyc0hlYWRlcnMgPSBbYHJlc29sdXRpb249JHtpZ25vcmVEdXBsaWNhdGVzID8gJ2lnbm9yZScgOiAnbWVyZ2UnfS1kdXBsaWNhdGVzYF07XG4gICAgICAgIGlmIChvbkNvbmZsaWN0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnVybC5zZWFyY2hQYXJhbXMuc2V0KCdvbl9jb25mbGljdCcsIG9uQ29uZmxpY3QpO1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzWydQcmVmZXInXSkge1xuICAgICAgICAgICAgcHJlZmVyc0hlYWRlcnMucHVzaCh0aGlzLmhlYWRlcnNbJ1ByZWZlciddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICAgIHByZWZlcnNIZWFkZXJzLnB1c2goYGNvdW50PSR7Y291bnR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWZhdWx0VG9OdWxsKSB7XG4gICAgICAgICAgICBwcmVmZXJzSGVhZGVycy5wdXNoKCdtaXNzaW5nPWRlZmF1bHQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlYWRlcnNbJ1ByZWZlciddID0gcHJlZmVyc0hlYWRlcnMuam9pbignLCcpO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5zID0gdmFsdWVzLnJlZHVjZSgoYWNjLCB4KSA9PiBhY2MuY29uY2F0KE9iamVjdC5rZXlzKHgpKSwgW10pO1xuICAgICAgICAgICAgaWYgKGNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXF1ZUNvbHVtbnMgPSBbLi4ubmV3IFNldChjb2x1bW5zKV0ubWFwKChjb2x1bW4pID0+IGBcIiR7Y29sdW1ufVwiYCk7XG4gICAgICAgICAgICAgICAgdGhpcy51cmwuc2VhcmNoUGFyYW1zLnNldCgnY29sdW1ucycsIHVuaXF1ZUNvbHVtbnMuam9pbignLCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFBvc3RncmVzdEZpbHRlckJ1aWxkZXJfMS5kZWZhdWx0KHtcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hLFxuICAgICAgICAgICAgYm9keTogdmFsdWVzLFxuICAgICAgICAgICAgZmV0Y2g6IHRoaXMuZmV0Y2gsXG4gICAgICAgICAgICBhbGxvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gVVBEQVRFIG9uIHRoZSB0YWJsZSBvciB2aWV3LlxuICAgICAqXG4gICAgICogQnkgZGVmYXVsdCwgdXBkYXRlZCByb3dzIGFyZSBub3QgcmV0dXJuZWQuIFRvIHJldHVybiBpdCwgY2hhaW4gdGhlIGNhbGxcbiAgICAgKiB3aXRoIGAuc2VsZWN0KClgIGFmdGVyIGZpbHRlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWVzIC0gVGhlIHZhbHVlcyB0byB1cGRhdGUgd2l0aFxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBOYW1lZCBwYXJhbWV0ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5jb3VudCAtIENvdW50IGFsZ29yaXRobSB0byB1c2UgdG8gY291bnQgdXBkYXRlZCByb3dzLlxuICAgICAqXG4gICAgICogYFwiZXhhY3RcImA6IEV4YWN0IGJ1dCBzbG93IGNvdW50IGFsZ29yaXRobS4gUGVyZm9ybXMgYSBgQ09VTlQoKilgIHVuZGVyIHRoZVxuICAgICAqIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJwbGFubmVkXCJgOiBBcHByb3hpbWF0ZWQgYnV0IGZhc3QgY291bnQgYWxnb3JpdGhtLiBVc2VzIHRoZSBQb3N0Z3Jlc1xuICAgICAqIHN0YXRpc3RpY3MgdW5kZXIgdGhlIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJlc3RpbWF0ZWRcImA6IFVzZXMgZXhhY3QgY291bnQgZm9yIGxvdyBudW1iZXJzIGFuZCBwbGFubmVkIGNvdW50IGZvciBoaWdoXG4gICAgICogbnVtYmVycy5cbiAgICAgKi9cbiAgICB1cGRhdGUodmFsdWVzLCB7IGNvdW50LCB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gJ1BBVENIJztcbiAgICAgICAgY29uc3QgcHJlZmVyc0hlYWRlcnMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyc1snUHJlZmVyJ10pIHtcbiAgICAgICAgICAgIHByZWZlcnNIZWFkZXJzLnB1c2godGhpcy5oZWFkZXJzWydQcmVmZXInXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgICBwcmVmZXJzSGVhZGVycy5wdXNoKGBjb3VudD0ke2NvdW50fWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGVhZGVyc1snUHJlZmVyJ10gPSBwcmVmZXJzSGVhZGVycy5qb2luKCcsJyk7XG4gICAgICAgIHJldHVybiBuZXcgUG9zdGdyZXN0RmlsdGVyQnVpbGRlcl8xLmRlZmF1bHQoe1xuICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgdXJsOiB0aGlzLnVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgIHNjaGVtYTogdGhpcy5zY2hlbWEsXG4gICAgICAgICAgICBib2R5OiB2YWx1ZXMsXG4gICAgICAgICAgICBmZXRjaDogdGhpcy5mZXRjaCxcbiAgICAgICAgICAgIGFsbG93RW1wdHk6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhIERFTEVURSBvbiB0aGUgdGFibGUgb3Igdmlldy5cbiAgICAgKlxuICAgICAqIEJ5IGRlZmF1bHQsIGRlbGV0ZWQgcm93cyBhcmUgbm90IHJldHVybmVkLiBUbyByZXR1cm4gaXQsIGNoYWluIHRoZSBjYWxsXG4gICAgICogd2l0aCBgLnNlbGVjdCgpYCBhZnRlciBmaWx0ZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBOYW1lZCBwYXJhbWV0ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5jb3VudCAtIENvdW50IGFsZ29yaXRobSB0byB1c2UgdG8gY291bnQgZGVsZXRlZCByb3dzLlxuICAgICAqXG4gICAgICogYFwiZXhhY3RcImA6IEV4YWN0IGJ1dCBzbG93IGNvdW50IGFsZ29yaXRobS4gUGVyZm9ybXMgYSBgQ09VTlQoKilgIHVuZGVyIHRoZVxuICAgICAqIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJwbGFubmVkXCJgOiBBcHByb3hpbWF0ZWQgYnV0IGZhc3QgY291bnQgYWxnb3JpdGhtLiBVc2VzIHRoZSBQb3N0Z3Jlc1xuICAgICAqIHN0YXRpc3RpY3MgdW5kZXIgdGhlIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJlc3RpbWF0ZWRcImA6IFVzZXMgZXhhY3QgY291bnQgZm9yIGxvdyBudW1iZXJzIGFuZCBwbGFubmVkIGNvdW50IGZvciBoaWdoXG4gICAgICogbnVtYmVycy5cbiAgICAgKi9cbiAgICBkZWxldGUoeyBjb3VudCwgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9ICdERUxFVEUnO1xuICAgICAgICBjb25zdCBwcmVmZXJzSGVhZGVycyA9IFtdO1xuICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICAgIHByZWZlcnNIZWFkZXJzLnB1c2goYGNvdW50PSR7Y291bnR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyc1snUHJlZmVyJ10pIHtcbiAgICAgICAgICAgIHByZWZlcnNIZWFkZXJzLnVuc2hpZnQodGhpcy5oZWFkZXJzWydQcmVmZXInXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oZWFkZXJzWydQcmVmZXInXSA9IHByZWZlcnNIZWFkZXJzLmpvaW4oJywnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3N0Z3Jlc3RGaWx0ZXJCdWlsZGVyXzEuZGVmYXVsdCh7XG4gICAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgICB1cmw6IHRoaXMudXJsLFxuICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgc2NoZW1hOiB0aGlzLnNjaGVtYSxcbiAgICAgICAgICAgIGZldGNoOiB0aGlzLmZldGNoLFxuICAgICAgICAgICAgYWxsb3dFbXB0eTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBvc3RncmVzdFF1ZXJ5QnVpbGRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBvc3RncmVzdFF1ZXJ5QnVpbGRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmVyc2lvbiA9IHZvaWQgMDtcbmV4cG9ydHMudmVyc2lvbiA9ICcwLjAuMC1hdXRvbWF0ZWQnO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmVyc2lvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuREVGQVVMVF9IRUFERVJTID0gdm9pZCAwO1xuY29uc3QgdmVyc2lvbl8xID0gcmVxdWlyZShcIi4vdmVyc2lvblwiKTtcbmV4cG9ydHMuREVGQVVMVF9IRUFERVJTID0geyAnWC1DbGllbnQtSW5mbyc6IGBwb3N0Z3Jlc3QtanMvJHt2ZXJzaW9uXzEudmVyc2lvbn1gIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBQb3N0Z3Jlc3RRdWVyeUJ1aWxkZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9Qb3N0Z3Jlc3RRdWVyeUJ1aWxkZXJcIikpO1xuY29uc3QgUG9zdGdyZXN0RmlsdGVyQnVpbGRlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1Bvc3RncmVzdEZpbHRlckJ1aWxkZXJcIikpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi9jb25zdGFudHNcIik7XG4vKipcbiAqIFBvc3RnUkVTVCBjbGllbnQuXG4gKlxuICogQHR5cGVQYXJhbSBEYXRhYmFzZSAtIFR5cGVzIGZvciB0aGUgc2NoZW1hIGZyb20gdGhlIFt0eXBlXG4gKiBnZW5lcmF0b3JdKGh0dHBzOi8vc3VwYWJhc2UuY29tL2RvY3MvcmVmZXJlbmNlL2phdmFzY3JpcHQvbmV4dC90eXBlc2NyaXB0LXN1cHBvcnQpXG4gKlxuICogQHR5cGVQYXJhbSBTY2hlbWFOYW1lIC0gUG9zdGdyZXMgc2NoZW1hIHRvIHN3aXRjaCB0by4gTXVzdCBiZSBhIHN0cmluZ1xuICogbGl0ZXJhbCwgdGhlIHNhbWUgb25lIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IuIElmIHRoZSBzY2hlbWEgaXMgbm90XG4gKiBgXCJwdWJsaWNcImAsIHRoaXMgbXVzdCBiZSBzdXBwbGllZCBtYW51YWxseS5cbiAqL1xuY2xhc3MgUG9zdGdyZXN0Q2xpZW50IHtcbiAgICAvLyBUT0RPOiBBZGQgYmFjayBzaG91bGRUaHJvd09uRXJyb3Igb25jZSB3ZSBmaWd1cmUgb3V0IHRoZSB0eXBpbmdzXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIFBvc3RnUkVTVCBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdXJsIC0gVVJMIG9mIHRoZSBQb3N0Z1JFU1QgZW5kcG9pbnRcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE5hbWVkIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oZWFkZXJzIC0gQ3VzdG9tIGhlYWRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5zY2hlbWEgLSBQb3N0Z3JlcyBzY2hlbWEgdG8gc3dpdGNoIHRvXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmV0Y2ggLSBDdXN0b20gZmV0Y2hcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih1cmwsIHsgaGVhZGVycyA9IHt9LCBzY2hlbWEsIGZldGNoLCB9ID0ge30pIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgY29uc3RhbnRzXzEuREVGQVVMVF9IRUFERVJTKSwgaGVhZGVycyk7XG4gICAgICAgIHRoaXMuc2NoZW1hTmFtZSA9IHNjaGVtYTtcbiAgICAgICAgdGhpcy5mZXRjaCA9IGZldGNoO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGEgcXVlcnkgb24gYSB0YWJsZSBvciBhIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVsYXRpb24gLSBUaGUgdGFibGUgb3IgdmlldyBuYW1lIHRvIHF1ZXJ5XG4gICAgICovXG4gICAgZnJvbShyZWxhdGlvbikge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGAke3RoaXMudXJsfS8ke3JlbGF0aW9ufWApO1xuICAgICAgICByZXR1cm4gbmV3IFBvc3RncmVzdFF1ZXJ5QnVpbGRlcl8xLmRlZmF1bHQodXJsLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmhlYWRlcnMpLFxuICAgICAgICAgICAgc2NoZW1hOiB0aGlzLnNjaGVtYU5hbWUsXG4gICAgICAgICAgICBmZXRjaDogdGhpcy5mZXRjaCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbGVjdCBhIHNjaGVtYSB0byBxdWVyeSBvciBwZXJmb3JtIGFuIGZ1bmN0aW9uIChycGMpIGNhbGwuXG4gICAgICpcbiAgICAgKiBUaGUgc2NoZW1hIG5lZWRzIHRvIGJlIG9uIHRoZSBsaXN0IG9mIGV4cG9zZWQgc2NoZW1hcyBpbnNpZGUgU3VwYWJhc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NoZW1hIC0gVGhlIHNjaGVtYSB0byBxdWVyeVxuICAgICAqL1xuICAgIHNjaGVtYShzY2hlbWEpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3N0Z3Jlc3RDbGllbnQodGhpcy51cmwsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgIHNjaGVtYSxcbiAgICAgICAgICAgIGZldGNoOiB0aGlzLmZldGNoLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm4gLSBUaGUgZnVuY3Rpb24gbmFtZSB0byBjYWxsXG4gICAgICogQHBhcmFtIGFyZ3MgLSBUaGUgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGZ1bmN0aW9uIGNhbGxcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE5hbWVkIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oZWFkIC0gV2hlbiBzZXQgdG8gYHRydWVgLCBgZGF0YWAgd2lsbCBub3QgYmUgcmV0dXJuZWQuXG4gICAgICogVXNlZnVsIGlmIHlvdSBvbmx5IG5lZWQgdGhlIGNvdW50LlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmdldCAtIFdoZW4gc2V0IHRvIGB0cnVlYCwgdGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGhcbiAgICAgKiByZWFkLW9ubHkgYWNjZXNzIG1vZGUuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuY291bnQgLSBDb3VudCBhbGdvcml0aG0gdG8gdXNlIHRvIGNvdW50IHJvd3MgcmV0dXJuZWQgYnkgdGhlXG4gICAgICogZnVuY3Rpb24uIE9ubHkgYXBwbGljYWJsZSBmb3IgW3NldC1yZXR1cm5pbmdcbiAgICAgKiBmdW5jdGlvbnNdKGh0dHBzOi8vd3d3LnBvc3RncmVzcWwub3JnL2RvY3MvY3VycmVudC9mdW5jdGlvbnMtc3JmLmh0bWwpLlxuICAgICAqXG4gICAgICogYFwiZXhhY3RcImA6IEV4YWN0IGJ1dCBzbG93IGNvdW50IGFsZ29yaXRobS4gUGVyZm9ybXMgYSBgQ09VTlQoKilgIHVuZGVyIHRoZVxuICAgICAqIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJwbGFubmVkXCJgOiBBcHByb3hpbWF0ZWQgYnV0IGZhc3QgY291bnQgYWxnb3JpdGhtLiBVc2VzIHRoZSBQb3N0Z3Jlc1xuICAgICAqIHN0YXRpc3RpY3MgdW5kZXIgdGhlIGhvb2QuXG4gICAgICpcbiAgICAgKiBgXCJlc3RpbWF0ZWRcImA6IFVzZXMgZXhhY3QgY291bnQgZm9yIGxvdyBudW1iZXJzIGFuZCBwbGFubmVkIGNvdW50IGZvciBoaWdoXG4gICAgICogbnVtYmVycy5cbiAgICAgKi9cbiAgICBycGMoZm4sIGFyZ3MgPSB7fSwgeyBoZWFkID0gZmFsc2UsIGdldCA9IGZhbHNlLCBjb3VudCwgfSA9IHt9KSB7XG4gICAgICAgIGxldCBtZXRob2Q7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoYCR7dGhpcy51cmx9L3JwYy8ke2ZufWApO1xuICAgICAgICBsZXQgYm9keTtcbiAgICAgICAgaWYgKGhlYWQgfHwgZ2V0KSB7XG4gICAgICAgICAgICBtZXRob2QgPSBoZWFkID8gJ0hFQUQnIDogJ0dFVCc7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhhcmdzKVxuICAgICAgICAgICAgICAgIC8vIHBhcmFtcyB3aXRoIHVuZGVmaW5lZCB2YWx1ZSBuZWVkcyB0byBiZSBmaWx0ZXJlZCBvdXQsIG90aGVyd2lzZSBpdCdsbFxuICAgICAgICAgICAgICAgIC8vIHNob3cgdXAgYXMgYD9wYXJhbT11bmRlZmluZWRgXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoW18sIHZhbHVlXSkgPT4gdmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAvLyBhcnJheSB2YWx1ZXMgbmVlZCBzcGVjaWFsIHN5bnRheFxuICAgICAgICAgICAgICAgIC5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+IFtuYW1lLCBBcnJheS5pc0FycmF5KHZhbHVlKSA/IGB7JHt2YWx1ZS5qb2luKCcsJyl9fWAgOiBgJHt2YWx1ZX1gXSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgYm9keSA9IGFyZ3M7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGVhZGVycyk7XG4gICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICAgICAgaGVhZGVyc1snUHJlZmVyJ10gPSBgY291bnQ9JHtjb3VudH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUG9zdGdyZXN0RmlsdGVyQnVpbGRlcl8xLmRlZmF1bHQoe1xuICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgIHNjaGVtYTogdGhpcy5zY2hlbWFOYW1lLFxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgIGZldGNoOiB0aGlzLmZldGNoLFxuICAgICAgICAgICAgYWxsb3dFbXB0eTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBvc3RncmVzdENsaWVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBvc3RncmVzdENsaWVudC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUG9zdGdyZXN0RXJyb3IgPSBleHBvcnRzLlBvc3RncmVzdEJ1aWxkZXIgPSBleHBvcnRzLlBvc3RncmVzdFRyYW5zZm9ybUJ1aWxkZXIgPSBleHBvcnRzLlBvc3RncmVzdEZpbHRlckJ1aWxkZXIgPSBleHBvcnRzLlBvc3RncmVzdFF1ZXJ5QnVpbGRlciA9IGV4cG9ydHMuUG9zdGdyZXN0Q2xpZW50ID0gdm9pZCAwO1xuLy8gQWx3YXlzIHVwZGF0ZSB3cmFwcGVyLm1qcyB3aGVuIHVwZGF0aW5nIHRoaXMgZmlsZS5cbmNvbnN0IFBvc3RncmVzdENsaWVudF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1Bvc3RncmVzdENsaWVudFwiKSk7XG5leHBvcnRzLlBvc3RncmVzdENsaWVudCA9IFBvc3RncmVzdENsaWVudF8xLmRlZmF1bHQ7XG5jb25zdCBQb3N0Z3Jlc3RRdWVyeUJ1aWxkZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9Qb3N0Z3Jlc3RRdWVyeUJ1aWxkZXJcIikpO1xuZXhwb3J0cy5Qb3N0Z3Jlc3RRdWVyeUJ1aWxkZXIgPSBQb3N0Z3Jlc3RRdWVyeUJ1aWxkZXJfMS5kZWZhdWx0O1xuY29uc3QgUG9zdGdyZXN0RmlsdGVyQnVpbGRlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1Bvc3RncmVzdEZpbHRlckJ1aWxkZXJcIikpO1xuZXhwb3J0cy5Qb3N0Z3Jlc3RGaWx0ZXJCdWlsZGVyID0gUG9zdGdyZXN0RmlsdGVyQnVpbGRlcl8xLmRlZmF1bHQ7XG5jb25zdCBQb3N0Z3Jlc3RUcmFuc2Zvcm1CdWlsZGVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlclwiKSk7XG5leHBvcnRzLlBvc3RncmVzdFRyYW5zZm9ybUJ1aWxkZXIgPSBQb3N0Z3Jlc3RUcmFuc2Zvcm1CdWlsZGVyXzEuZGVmYXVsdDtcbmNvbnN0IFBvc3RncmVzdEJ1aWxkZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9Qb3N0Z3Jlc3RCdWlsZGVyXCIpKTtcbmV4cG9ydHMuUG9zdGdyZXN0QnVpbGRlciA9IFBvc3RncmVzdEJ1aWxkZXJfMS5kZWZhdWx0O1xuY29uc3QgUG9zdGdyZXN0RXJyb3JfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9Qb3N0Z3Jlc3RFcnJvclwiKSk7XG5leHBvcnRzLlBvc3RncmVzdEVycm9yID0gUG9zdGdyZXN0RXJyb3JfMS5kZWZhdWx0O1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICAgIFBvc3RncmVzdENsaWVudDogUG9zdGdyZXN0Q2xpZW50XzEuZGVmYXVsdCxcbiAgICBQb3N0Z3Jlc3RRdWVyeUJ1aWxkZXI6IFBvc3RncmVzdFF1ZXJ5QnVpbGRlcl8xLmRlZmF1bHQsXG4gICAgUG9zdGdyZXN0RmlsdGVyQnVpbGRlcjogUG9zdGdyZXN0RmlsdGVyQnVpbGRlcl8xLmRlZmF1bHQsXG4gICAgUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlcjogUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlcl8xLmRlZmF1bHQsXG4gICAgUG9zdGdyZXN0QnVpbGRlcjogUG9zdGdyZXN0QnVpbGRlcl8xLmRlZmF1bHQsXG4gICAgUG9zdGdyZXN0RXJyb3I6IFBvc3RncmVzdEVycm9yXzEuZGVmYXVsdCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJpbXBvcnQgaW5kZXggZnJvbSAnLi4vY2pzL2luZGV4LmpzJ1xuY29uc3Qge1xuICBQb3N0Z3Jlc3RDbGllbnQsXG4gIFBvc3RncmVzdFF1ZXJ5QnVpbGRlcixcbiAgUG9zdGdyZXN0RmlsdGVyQnVpbGRlcixcbiAgUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlcixcbiAgUG9zdGdyZXN0QnVpbGRlcixcbiAgUG9zdGdyZXN0RXJyb3IsXG59ID0gaW5kZXhcblxuZXhwb3J0IHtcbiAgUG9zdGdyZXN0QnVpbGRlcixcbiAgUG9zdGdyZXN0Q2xpZW50LFxuICBQb3N0Z3Jlc3RGaWx0ZXJCdWlsZGVyLFxuICBQb3N0Z3Jlc3RRdWVyeUJ1aWxkZXIsXG4gIFBvc3RncmVzdFRyYW5zZm9ybUJ1aWxkZXIsXG4gIFBvc3RncmVzdEVycm9yLFxufVxuXG4vLyBjb21wYXRpYmlsaXR5IHdpdGggQ0pTIG91dHB1dFxuZXhwb3J0IGRlZmF1bHQge1xuICBQb3N0Z3Jlc3RDbGllbnQsXG4gIFBvc3RncmVzdFF1ZXJ5QnVpbGRlcixcbiAgUG9zdGdyZXN0RmlsdGVyQnVpbGRlcixcbiAgUG9zdGdyZXN0VHJhbnNmb3JtQnVpbGRlcixcbiAgUG9zdGdyZXN0QnVpbGRlcixcbiAgUG9zdGdyZXN0RXJyb3IsXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0TmF0aXZlV2ViU29ja2V0KCkge1xuICAgIGlmICh0eXBlb2YgV2ViU29ja2V0ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm4gV2ViU29ja2V0O1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsLldlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIGdsb2JhbC5XZWJTb2NrZXQ7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuV2ViU29ja2V0ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm4gd2luZG93LldlYlNvY2tldDtcbiAgICBpZiAodHlwZW9mIHNlbGYuV2ViU29ja2V0ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm4gc2VsZi5XZWJTb2NrZXQ7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYFdlYlNvY2tldGAgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGVudmlyb25tZW50XCIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMuanMubWFwIiwiaW1wb3J0IHsgZ2V0TmF0aXZlV2ViU29ja2V0IH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcbmV4cG9ydCBjb25zdCBXZWJTb2NrZXQgPSBnZXROYXRpdmVXZWJTb2NrZXQoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5hdGl2ZS5qcy5tYXAiLCJleHBvcnQgY29uc3QgdmVyc2lvbiA9ICcyLjExLjE1Jztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZlcnNpb24uanMubWFwIiwiaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4vdmVyc2lvbic7XG5leHBvcnQgY29uc3QgREVGQVVMVF9WRVJTSU9OID0gYHJlYWx0aW1lLWpzLyR7dmVyc2lvbn1gO1xuZXhwb3J0IGNvbnN0IFZTTiA9ICcxLjAuMCc7XG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IHZlcnNpb247XG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUID0gMTAwMDA7XG5leHBvcnQgY29uc3QgV1NfQ0xPU0VfTk9STUFMID0gMTAwMDtcbmV4cG9ydCB2YXIgU09DS0VUX1NUQVRFUztcbihmdW5jdGlvbiAoU09DS0VUX1NUQVRFUykge1xuICAgIFNPQ0tFVF9TVEFURVNbU09DS0VUX1NUQVRFU1tcImNvbm5lY3RpbmdcIl0gPSAwXSA9IFwiY29ubmVjdGluZ1wiO1xuICAgIFNPQ0tFVF9TVEFURVNbU09DS0VUX1NUQVRFU1tcIm9wZW5cIl0gPSAxXSA9IFwib3BlblwiO1xuICAgIFNPQ0tFVF9TVEFURVNbU09DS0VUX1NUQVRFU1tcImNsb3NpbmdcIl0gPSAyXSA9IFwiY2xvc2luZ1wiO1xuICAgIFNPQ0tFVF9TVEFURVNbU09DS0VUX1NUQVRFU1tcImNsb3NlZFwiXSA9IDNdID0gXCJjbG9zZWRcIjtcbn0pKFNPQ0tFVF9TVEFURVMgfHwgKFNPQ0tFVF9TVEFURVMgPSB7fSkpO1xuZXhwb3J0IHZhciBDSEFOTkVMX1NUQVRFUztcbihmdW5jdGlvbiAoQ0hBTk5FTF9TVEFURVMpIHtcbiAgICBDSEFOTkVMX1NUQVRFU1tcImNsb3NlZFwiXSA9IFwiY2xvc2VkXCI7XG4gICAgQ0hBTk5FTF9TVEFURVNbXCJlcnJvcmVkXCJdID0gXCJlcnJvcmVkXCI7XG4gICAgQ0hBTk5FTF9TVEFURVNbXCJqb2luZWRcIl0gPSBcImpvaW5lZFwiO1xuICAgIENIQU5ORUxfU1RBVEVTW1wiam9pbmluZ1wiXSA9IFwiam9pbmluZ1wiO1xuICAgIENIQU5ORUxfU1RBVEVTW1wibGVhdmluZ1wiXSA9IFwibGVhdmluZ1wiO1xufSkoQ0hBTk5FTF9TVEFURVMgfHwgKENIQU5ORUxfU1RBVEVTID0ge30pKTtcbmV4cG9ydCB2YXIgQ0hBTk5FTF9FVkVOVFM7XG4oZnVuY3Rpb24gKENIQU5ORUxfRVZFTlRTKSB7XG4gICAgQ0hBTk5FTF9FVkVOVFNbXCJjbG9zZVwiXSA9IFwicGh4X2Nsb3NlXCI7XG4gICAgQ0hBTk5FTF9FVkVOVFNbXCJlcnJvclwiXSA9IFwicGh4X2Vycm9yXCI7XG4gICAgQ0hBTk5FTF9FVkVOVFNbXCJqb2luXCJdID0gXCJwaHhfam9pblwiO1xuICAgIENIQU5ORUxfRVZFTlRTW1wicmVwbHlcIl0gPSBcInBoeF9yZXBseVwiO1xuICAgIENIQU5ORUxfRVZFTlRTW1wibGVhdmVcIl0gPSBcInBoeF9sZWF2ZVwiO1xuICAgIENIQU5ORUxfRVZFTlRTW1wiYWNjZXNzX3Rva2VuXCJdID0gXCJhY2Nlc3NfdG9rZW5cIjtcbn0pKENIQU5ORUxfRVZFTlRTIHx8IChDSEFOTkVMX0VWRU5UUyA9IHt9KSk7XG5leHBvcnQgdmFyIFRSQU5TUE9SVFM7XG4oZnVuY3Rpb24gKFRSQU5TUE9SVFMpIHtcbiAgICBUUkFOU1BPUlRTW1wid2Vic29ja2V0XCJdID0gXCJ3ZWJzb2NrZXRcIjtcbn0pKFRSQU5TUE9SVFMgfHwgKFRSQU5TUE9SVFMgPSB7fSkpO1xuZXhwb3J0IHZhciBDT05ORUNUSU9OX1NUQVRFO1xuKGZ1bmN0aW9uIChDT05ORUNUSU9OX1NUQVRFKSB7XG4gICAgQ09OTkVDVElPTl9TVEFURVtcIkNvbm5lY3RpbmdcIl0gPSBcImNvbm5lY3RpbmdcIjtcbiAgICBDT05ORUNUSU9OX1NUQVRFW1wiT3BlblwiXSA9IFwib3BlblwiO1xuICAgIENPTk5FQ1RJT05fU1RBVEVbXCJDbG9zaW5nXCJdID0gXCJjbG9zaW5nXCI7XG4gICAgQ09OTkVDVElPTl9TVEFURVtcIkNsb3NlZFwiXSA9IFwiY2xvc2VkXCI7XG59KShDT05ORUNUSU9OX1NUQVRFIHx8IChDT05ORUNUSU9OX1NUQVRFID0ge30pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnN0YW50cy5qcy5tYXAiLCIvLyBUaGlzIGZpbGUgZHJhd3MgaGVhdmlseSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXgvY29tbWl0L2NmMDk4ZTljZjdhNDRlZTY0NzlkMzFkOTExYTk3ZDNjNzQzMGM2ZmVcbi8vIExpY2Vuc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXgvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VyaWFsaXplciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuSEVBREVSX0xFTkdUSCA9IDE7XG4gICAgfVxuICAgIGRlY29kZShyYXdQYXlsb2FkLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAocmF3UGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLl9iaW5hcnlEZWNvZGUocmF3UGF5bG9hZCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcmF3UGF5bG9hZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhKU09OLnBhcnNlKHJhd1BheWxvYWQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGJhY2soe30pO1xuICAgIH1cbiAgICBfYmluYXJ5RGVjb2RlKGJ1ZmZlcikge1xuICAgICAgICBjb25zdCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpO1xuICAgIH1cbiAgICBfZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2Rlcikge1xuICAgICAgICBjb25zdCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDEpO1xuICAgICAgICBjb25zdCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDIpO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgMjtcbiAgICAgICAgY29uc3QgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKTtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplO1xuICAgICAgICBjb25zdCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpO1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemU7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKSkpO1xuICAgICAgICByZXR1cm4geyByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhIH07XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2VyaWFsaXplci5qcy5tYXAiLCIvKipcbiAqIENyZWF0ZXMgYSB0aW1lciB0aGF0IGFjY2VwdHMgYSBgdGltZXJDYWxjYCBmdW5jdGlvbiB0byBwZXJmb3JtIGNhbGN1bGF0ZWQgdGltZW91dCByZXRyaWVzLCBzdWNoIGFzIGV4cG9uZW50aWFsIGJhY2tvZmYuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgIGxldCByZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB0aGlzLmNvbm5lY3QoKSwgZnVuY3Rpb24odHJpZXMpe1xuICogICAgICByZXR1cm4gWzEwMDAsIDUwMDAsIDEwMDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiAgICB9KVxuICogICAgcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICogICAgcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgNTAwMFxuICogICAgcmVjb25uZWN0VGltZXIucmVzZXQoKVxuICogICAgcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lciB7XG4gICAgY29uc3RydWN0b3IoY2FsbGJhY2ssIHRpbWVyQ2FsYykge1xuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMudGltZXJDYWxjID0gdGltZXJDYWxjO1xuICAgICAgICB0aGlzLnRpbWVyID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnRyaWVzID0gMDtcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLnRpbWVyQ2FsYyA9IHRpbWVyQ2FsYztcbiAgICB9XG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgfVxuICAgIC8vIENhbmNlbHMgYW55IHByZXZpb3VzIHNjaGVkdWxlVGltZW91dCBhbmQgc2NoZWR1bGVzIGNhbGxiYWNrXG4gICAgc2NoZWR1bGVUaW1lb3V0KCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJpZXMgPSB0aGlzLnRyaWVzICsgMTtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2soKTtcbiAgICAgICAgfSwgdGhpcy50aW1lckNhbGModGhpcy50cmllcyArIDEpKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aW1lci5qcy5tYXAiLCIvKipcbiAqIEhlbHBlcnMgdG8gY29udmVydCB0aGUgY2hhbmdlIFBheWxvYWQgaW50byBuYXRpdmUgSlMgdHlwZXMuXG4gKi9cbi8vIEFkYXB0ZWQgZnJvbSBlcGdzcWwgKHNyYy9lcGdzcWxfYmluYXJ5LmVybCksIHRoaXMgbW9kdWxlIGxpY2Vuc2VkIHVuZGVyXG4vLyAzLWNsYXVzZSBCU0QgZm91bmQgaGVyZTogaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2VwZ3NxbC9lcGdzcWwvZGV2ZWwvTElDRU5TRVxuZXhwb3J0IHZhciBQb3N0Z3Jlc1R5cGVzO1xuKGZ1bmN0aW9uIChQb3N0Z3Jlc1R5cGVzKSB7XG4gICAgUG9zdGdyZXNUeXBlc1tcImFic3RpbWVcIl0gPSBcImFic3RpbWVcIjtcbiAgICBQb3N0Z3Jlc1R5cGVzW1wiYm9vbFwiXSA9IFwiYm9vbFwiO1xuICAgIFBvc3RncmVzVHlwZXNbXCJkYXRlXCJdID0gXCJkYXRlXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcImRhdGVyYW5nZVwiXSA9IFwiZGF0ZXJhbmdlXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcImZsb2F0NFwiXSA9IFwiZmxvYXQ0XCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcImZsb2F0OFwiXSA9IFwiZmxvYXQ4XCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcImludDJcIl0gPSBcImludDJcIjtcbiAgICBQb3N0Z3Jlc1R5cGVzW1wiaW50NFwiXSA9IFwiaW50NFwiO1xuICAgIFBvc3RncmVzVHlwZXNbXCJpbnQ0cmFuZ2VcIl0gPSBcImludDRyYW5nZVwiO1xuICAgIFBvc3RncmVzVHlwZXNbXCJpbnQ4XCJdID0gXCJpbnQ4XCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcImludDhyYW5nZVwiXSA9IFwiaW50OHJhbmdlXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcImpzb25cIl0gPSBcImpzb25cIjtcbiAgICBQb3N0Z3Jlc1R5cGVzW1wianNvbmJcIl0gPSBcImpzb25iXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcIm1vbmV5XCJdID0gXCJtb25leVwiO1xuICAgIFBvc3RncmVzVHlwZXNbXCJudW1lcmljXCJdID0gXCJudW1lcmljXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcIm9pZFwiXSA9IFwib2lkXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcInJlbHRpbWVcIl0gPSBcInJlbHRpbWVcIjtcbiAgICBQb3N0Z3Jlc1R5cGVzW1widGV4dFwiXSA9IFwidGV4dFwiO1xuICAgIFBvc3RncmVzVHlwZXNbXCJ0aW1lXCJdID0gXCJ0aW1lXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcInRpbWVzdGFtcFwiXSA9IFwidGltZXN0YW1wXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcInRpbWVzdGFtcHR6XCJdID0gXCJ0aW1lc3RhbXB0elwiO1xuICAgIFBvc3RncmVzVHlwZXNbXCJ0aW1ldHpcIl0gPSBcInRpbWV0elwiO1xuICAgIFBvc3RncmVzVHlwZXNbXCJ0c3JhbmdlXCJdID0gXCJ0c3JhbmdlXCI7XG4gICAgUG9zdGdyZXNUeXBlc1tcInRzdHpyYW5nZVwiXSA9IFwidHN0enJhbmdlXCI7XG59KShQb3N0Z3Jlc1R5cGVzIHx8IChQb3N0Z3Jlc1R5cGVzID0ge30pKTtcbi8qKlxuICogVGFrZXMgYW4gYXJyYXkgb2YgY29sdW1ucyBhbmQgYW4gb2JqZWN0IG9mIHN0cmluZyB2YWx1ZXMgdGhlbiBjb252ZXJ0cyBlYWNoIHN0cmluZyB2YWx1ZVxuICogdG8gaXRzIG1hcHBlZCB0eXBlLlxuICpcbiAqIEBwYXJhbSB7e25hbWU6IFN0cmluZywgdHlwZTogU3RyaW5nfVtdfSBjb2x1bW5zXG4gKiBAcGFyYW0ge09iamVjdH0gcmVjb3JkXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgbWFwIG9mIHZhcmlvdXMgb3B0aW9ucyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIHRoZSBtYXBwZXJcbiAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnMuc2tpcFR5cGVzIFRoZSBhcnJheSBvZiB0eXBlcyB0aGF0IHNob3VsZCBub3QgYmUgY29udmVydGVkXG4gKlxuICogQGV4YW1wbGUgY29udmVydENoYW5nZURhdGEoW3tuYW1lOiAnZmlyc3RfbmFtZScsIHR5cGU6ICd0ZXh0J30sIHtuYW1lOiAnYWdlJywgdHlwZTogJ2ludDQnfV0sIHtmaXJzdF9uYW1lOiAnUGF1bCcsIGFnZTonMzMnfSwge30pXG4gKiAvLz0+eyBmaXJzdF9uYW1lOiAnUGF1bCcsIGFnZTogMzMgfVxuICovXG5leHBvcnQgY29uc3QgY29udmVydENoYW5nZURhdGEgPSAoY29sdW1ucywgcmVjb3JkLCBvcHRpb25zID0ge30pID0+IHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3Qgc2tpcFR5cGVzID0gKF9hID0gb3B0aW9ucy5za2lwVHlwZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhyZWNvcmQpLnJlZHVjZSgoYWNjLCByZWNfa2V5KSA9PiB7XG4gICAgICAgIGFjY1tyZWNfa2V5XSA9IGNvbnZlcnRDb2x1bW4ocmVjX2tleSwgY29sdW1ucywgcmVjb3JkLCBza2lwVHlwZXMpO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn07XG4vKipcbiAqIENvbnZlcnRzIHRoZSB2YWx1ZSBvZiBhbiBpbmRpdmlkdWFsIGNvbHVtbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sdW1uTmFtZSBUaGUgY29sdW1uIHRoYXQgeW91IHdhbnQgdG8gY29udmVydFxuICogQHBhcmFtIHt7bmFtZTogU3RyaW5nLCB0eXBlOiBTdHJpbmd9W119IGNvbHVtbnMgQWxsIG9mIHRoZSBjb2x1bW5zXG4gKiBAcGFyYW0ge09iamVjdH0gcmVjb3JkIFRoZSBtYXAgb2Ygc3RyaW5nIHZhbHVlc1xuICogQHBhcmFtIHtBcnJheX0gc2tpcFR5cGVzIEFuIGFycmF5IG9mIHR5cGVzIHRoYXQgc2hvdWxkIG5vdCBiZSBjb252ZXJ0ZWRcbiAqIEByZXR1cm4ge29iamVjdH0gVXNlbGVzcyBpbmZvcm1hdGlvblxuICpcbiAqIEBleGFtcGxlIGNvbnZlcnRDb2x1bW4oJ2FnZScsIFt7bmFtZTogJ2ZpcnN0X25hbWUnLCB0eXBlOiAndGV4dCd9LCB7bmFtZTogJ2FnZScsIHR5cGU6ICdpbnQ0J31dLCB7Zmlyc3RfbmFtZTogJ1BhdWwnLCBhZ2U6ICczMyd9LCBbXSlcbiAqIC8vPT4gMzNcbiAqIEBleGFtcGxlIGNvbnZlcnRDb2x1bW4oJ2FnZScsIFt7bmFtZTogJ2ZpcnN0X25hbWUnLCB0eXBlOiAndGV4dCd9LCB7bmFtZTogJ2FnZScsIHR5cGU6ICdpbnQ0J31dLCB7Zmlyc3RfbmFtZTogJ1BhdWwnLCBhZ2U6ICczMyd9LCBbJ2ludDQnXSlcbiAqIC8vPT4gXCIzM1wiXG4gKi9cbmV4cG9ydCBjb25zdCBjb252ZXJ0Q29sdW1uID0gKGNvbHVtbk5hbWUsIGNvbHVtbnMsIHJlY29yZCwgc2tpcFR5cGVzKSA9PiB7XG4gICAgY29uc3QgY29sdW1uID0gY29sdW1ucy5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IGNvbHVtbk5hbWUpO1xuICAgIGNvbnN0IGNvbFR5cGUgPSBjb2x1bW4gPT09IG51bGwgfHwgY29sdW1uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb2x1bW4udHlwZTtcbiAgICBjb25zdCB2YWx1ZSA9IHJlY29yZFtjb2x1bW5OYW1lXTtcbiAgICBpZiAoY29sVHlwZSAmJiAhc2tpcFR5cGVzLmluY2x1ZGVzKGNvbFR5cGUpKSB7XG4gICAgICAgIHJldHVybiBjb252ZXJ0Q2VsbChjb2xUeXBlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBub29wKHZhbHVlKTtcbn07XG4vKipcbiAqIElmIHRoZSB2YWx1ZSBvZiB0aGUgY2VsbCBpcyBgbnVsbGAsIHJldHVybnMgbnVsbC5cbiAqIE90aGVyd2lzZSBjb252ZXJ0cyB0aGUgc3RyaW5nIHZhbHVlIHRvIHRoZSBjb3JyZWN0IHR5cGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIHBvc3RncmVzIGNvbHVtbiB0eXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgVGhlIGNlbGwgdmFsdWVcbiAqXG4gKiBAZXhhbXBsZSBjb252ZXJ0Q2VsbCgnYm9vbCcsICd0JylcbiAqIC8vPT4gdHJ1ZVxuICogQGV4YW1wbGUgY29udmVydENlbGwoJ2ludDgnLCAnMTAnKVxuICogLy89PiAxMFxuICogQGV4YW1wbGUgY29udmVydENlbGwoJ19pbnQ0JywgJ3sxLDIsMyw0fScpXG4gKiAvLz0+IFsxLDIsMyw0XVxuICovXG5leHBvcnQgY29uc3QgY29udmVydENlbGwgPSAodHlwZSwgdmFsdWUpID0+IHtcbiAgICAvLyBpZiBkYXRhIHR5cGUgaXMgYW4gYXJyYXlcbiAgICBpZiAodHlwZS5jaGFyQXQoMCkgPT09ICdfJykge1xuICAgICAgICBjb25zdCBkYXRhVHlwZSA9IHR5cGUuc2xpY2UoMSwgdHlwZS5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gdG9BcnJheSh2YWx1ZSwgZGF0YVR5cGUpO1xuICAgIH1cbiAgICAvLyBJZiBub3QgbnVsbCwgY29udmVydCB0byBjb3JyZWN0IHR5cGUuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy5ib29sOlxuICAgICAgICAgICAgcmV0dXJuIHRvQm9vbGVhbih2YWx1ZSk7XG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy5mbG9hdDQ6XG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy5mbG9hdDg6XG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy5pbnQyOlxuICAgICAgICBjYXNlIFBvc3RncmVzVHlwZXMuaW50NDpcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLmludDg6XG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy5udW1lcmljOlxuICAgICAgICBjYXNlIFBvc3RncmVzVHlwZXMub2lkOlxuICAgICAgICAgICAgcmV0dXJuIHRvTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLmpzb246XG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy5qc29uYjpcbiAgICAgICAgICAgIHJldHVybiB0b0pzb24odmFsdWUpO1xuICAgICAgICBjYXNlIFBvc3RncmVzVHlwZXMudGltZXN0YW1wOlxuICAgICAgICAgICAgcmV0dXJuIHRvVGltZXN0YW1wU3RyaW5nKHZhbHVlKTsgLy8gRm9ybWF0IHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBQb3N0Z1JFU1RcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLmFic3RpbWU6IC8vIFRvIGFsbG93IHVzZXJzIHRvIGNhc3QgaXQgYmFzZWQgb24gVGltZXpvbmVcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLmRhdGU6IC8vIFRvIGFsbG93IHVzZXJzIHRvIGNhc3QgaXQgYmFzZWQgb24gVGltZXpvbmVcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLmRhdGVyYW5nZTpcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLmludDRyYW5nZTpcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLmludDhyYW5nZTpcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLm1vbmV5OlxuICAgICAgICBjYXNlIFBvc3RncmVzVHlwZXMucmVsdGltZTogLy8gVG8gYWxsb3cgdXNlcnMgdG8gY2FzdCBpdCBiYXNlZCBvbiBUaW1lem9uZVxuICAgICAgICBjYXNlIFBvc3RncmVzVHlwZXMudGV4dDpcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLnRpbWU6IC8vIFRvIGFsbG93IHVzZXJzIHRvIGNhc3QgaXQgYmFzZWQgb24gVGltZXpvbmVcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLnRpbWVzdGFtcHR6OiAvLyBUbyBhbGxvdyB1c2VycyB0byBjYXN0IGl0IGJhc2VkIG9uIFRpbWV6b25lXG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy50aW1ldHo6IC8vIFRvIGFsbG93IHVzZXJzIHRvIGNhc3QgaXQgYmFzZWQgb24gVGltZXpvbmVcbiAgICAgICAgY2FzZSBQb3N0Z3Jlc1R5cGVzLnRzcmFuZ2U6XG4gICAgICAgIGNhc2UgUG9zdGdyZXNUeXBlcy50c3R6cmFuZ2U6XG4gICAgICAgICAgICByZXR1cm4gbm9vcCh2YWx1ZSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHZhbHVlIGZvciByZW1haW5pbmcgdHlwZXNcbiAgICAgICAgICAgIHJldHVybiBub29wKHZhbHVlKTtcbiAgICB9XG59O1xuY29uc3Qgbm9vcCA9ICh2YWx1ZSkgPT4ge1xuICAgIHJldHVybiB2YWx1ZTtcbn07XG5leHBvcnQgY29uc3QgdG9Cb29sZWFuID0gKHZhbHVlKSA9PiB7XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICBjYXNlICd0JzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlICdmJzpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHRvTnVtYmVyID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkVmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VkVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcbmV4cG9ydCBjb25zdCB0b0pzb24gPSAodmFsdWUpID0+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEpTT04gcGFyc2UgZXJyb3I6ICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcbi8qKlxuICogQ29udmVydHMgYSBQb3N0Z3JlcyBBcnJheSBpbnRvIGEgbmF0aXZlIEpTIGFycmF5XG4gKlxuICogQGV4YW1wbGUgdG9BcnJheSgne30nLCAnaW50NCcpXG4gKiAvLz0+IFtdXG4gKiBAZXhhbXBsZSB0b0FycmF5KCd7XCJbMjAyMS0wMS0wMSwyMDIxLTEyLTMxKVwiLFwiKDIwMjEtMDEtMDEsMjAyMS0xMi0zMl1cIn0nLCAnZGF0ZXJhbmdlJylcbiAqIC8vPT4gWydbMjAyMS0wMS0wMSwyMDIxLTEyLTMxKScsICcoMjAyMS0wMS0wMSwyMDIxLTEyLTMyXSddXG4gKiBAZXhhbXBsZSB0b0FycmF5KFsxLDIsMyw0XSwgJ2ludDQnKVxuICogLy89PiBbMSwyLDMsNF1cbiAqL1xuZXhwb3J0IGNvbnN0IHRvQXJyYXkgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGNvbnN0IGxhc3RJZHggPSB2YWx1ZS5sZW5ndGggLSAxO1xuICAgIGNvbnN0IGNsb3NlQnJhY2UgPSB2YWx1ZVtsYXN0SWR4XTtcbiAgICBjb25zdCBvcGVuQnJhY2UgPSB2YWx1ZVswXTtcbiAgICAvLyBDb25maXJtIHZhbHVlIGlzIGEgUG9zdGdyZXMgYXJyYXkgYnkgY2hlY2tpbmcgY3VybHkgYnJhY2tldHNcbiAgICBpZiAob3BlbkJyYWNlID09PSAneycgJiYgY2xvc2VCcmFjZSA9PT0gJ30nKSB7XG4gICAgICAgIGxldCBhcnI7XG4gICAgICAgIGNvbnN0IHZhbFRyaW0gPSB2YWx1ZS5zbGljZSgxLCBsYXN0SWR4KTtcbiAgICAgICAgLy8gVE9ETzogZmluZCBhIGJldHRlciBzb2x1dGlvbiB0byBzZXBhcmF0ZSBQb3N0Z3JlcyBhcnJheSBkYXRhXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhcnIgPSBKU09OLnBhcnNlKCdbJyArIHZhbFRyaW0gKyAnXScpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChfKSB7XG4gICAgICAgICAgICAvLyBXQVJOSU5HOiBzcGxpdHRpbmcgb24gY29tbWEgZG9lcyBub3QgY292ZXIgYWxsIGVkZ2UgY2FzZXNcbiAgICAgICAgICAgIGFyciA9IHZhbFRyaW0gPyB2YWxUcmltLnNwbGl0KCcsJykgOiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyLm1hcCgodmFsKSA9PiBjb252ZXJ0Q2VsbCh0eXBlLCB2YWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcbi8qKlxuICogRml4ZXMgdGltZXN0YW1wIHRvIGJlIElTTy04NjAxLiBTd2FwcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgZGF0ZSBhbmQgdGltZSBmb3IgYSAnVCdcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2Uvc3VwYWJhc2UvaXNzdWVzLzE4XG4gKlxuICogQGV4YW1wbGUgdG9UaW1lc3RhbXBTdHJpbmcoJzIwMTktMDktMTAgMDA6MDA6MDAnKVxuICogLy89PiAnMjAxOS0wOS0xMFQwMDowMDowMCdcbiAqL1xuZXhwb3J0IGNvbnN0IHRvVGltZXN0YW1wU3RyaW5nID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoJyAnLCAnVCcpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuZXhwb3J0IGNvbnN0IGh0dHBFbmRwb2ludFVSTCA9IChzb2NrZXRVcmwpID0+IHtcbiAgICBsZXQgdXJsID0gc29ja2V0VXJsO1xuICAgIHVybCA9IHVybC5yZXBsYWNlKC9ed3MvaSwgJ2h0dHAnKTtcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvKFxcL3NvY2tldFxcL3dlYnNvY2tldHxcXC9zb2NrZXR8XFwvd2Vic29ja2V0KVxcLz8kL2ksICcnKTtcbiAgICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcLyskLywgJycpO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYW5zZm9ybWVycy5qcy5tYXAiLCJpbXBvcnQgeyBERUZBVUxUX1RJTUVPVVQgfSBmcm9tICcuLi9saWIvY29uc3RhbnRzJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1c2gge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBQdXNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hhbm5lbCBUaGUgQ2hhbm5lbFxuICAgICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQsIGZvciBleGFtcGxlIGBcInBoeF9qb2luXCJgXG4gICAgICogQHBhcmFtIHBheWxvYWQgVGhlIHBheWxvYWQsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogMTIzfWBcbiAgICAgKiBAcGFyYW0gdGltZW91dCBUaGUgcHVzaCB0aW1lb3V0IGluIG1pbGxpc2Vjb25kc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWwsIGV2ZW50LCBwYXlsb2FkID0ge30sIHRpbWVvdXQgPSBERUZBVUxUX1RJTUVPVVQpIHtcbiAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgICAgICB0aGlzLnNlbnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50aW1lb3V0VGltZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMucmVmID0gJyc7XG4gICAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWNIb29rcyA9IFtdO1xuICAgICAgICB0aGlzLnJlZkV2ZW50ID0gbnVsbDtcbiAgICB9XG4gICAgcmVzZW5kKHRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgICAgdGhpcy5fY2FuY2VsUmVmRXZlbnQoKTtcbiAgICAgICAgdGhpcy5yZWYgPSAnJztcbiAgICAgICAgdGhpcy5yZWZFdmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZW50ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgIH1cbiAgICBzZW5kKCkge1xuICAgICAgICBpZiAodGhpcy5faGFzUmVjZWl2ZWQoJ3RpbWVvdXQnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lb3V0KCk7XG4gICAgICAgIHRoaXMuc2VudCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2hhbm5lbC5zb2NrZXQucHVzaCh7XG4gICAgICAgICAgICB0b3BpYzogdGhpcy5jaGFubmVsLnRvcGljLFxuICAgICAgICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXG4gICAgICAgICAgICBwYXlsb2FkOiB0aGlzLnBheWxvYWQsXG4gICAgICAgICAgICByZWY6IHRoaXMucmVmLFxuICAgICAgICAgICAgam9pbl9yZWY6IHRoaXMuY2hhbm5lbC5fam9pblJlZigpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlUGF5bG9hZChwYXlsb2FkKSB7XG4gICAgICAgIHRoaXMucGF5bG9hZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXlsb2FkKSwgcGF5bG9hZCk7XG4gICAgfVxuICAgIHJlY2VpdmUoc3RhdHVzLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0aGlzLl9oYXNSZWNlaXZlZChzdGF0dXMpKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygoX2EgPSB0aGlzLnJlY2VpdmVkUmVzcCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY0hvb2tzLnB1c2goeyBzdGF0dXMsIGNhbGxiYWNrIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3RhcnRUaW1lb3V0KCkge1xuICAgICAgICBpZiAodGhpcy50aW1lb3V0VGltZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlZiA9IHRoaXMuY2hhbm5lbC5zb2NrZXQuX21ha2VSZWYoKTtcbiAgICAgICAgdGhpcy5yZWZFdmVudCA9IHRoaXMuY2hhbm5lbC5fcmVwbHlFdmVudE5hbWUodGhpcy5yZWYpO1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYW5jZWxSZWZFdmVudCgpO1xuICAgICAgICAgICAgdGhpcy5fY2FuY2VsVGltZW91dCgpO1xuICAgICAgICAgICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBwYXlsb2FkO1xuICAgICAgICAgICAgdGhpcy5fbWF0Y2hSZWNlaXZlKHBheWxvYWQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoYW5uZWwuX29uKHRoaXMucmVmRXZlbnQsIHt9LCBjYWxsYmFjayk7XG4gICAgICAgIHRoaXMudGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RpbWVvdXQnLCB7fSk7XG4gICAgICAgIH0sIHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIHRyaWdnZXIoc3RhdHVzLCByZXNwb25zZSkge1xuICAgICAgICBpZiAodGhpcy5yZWZFdmVudClcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5fdHJpZ2dlcih0aGlzLnJlZkV2ZW50LCB7IHN0YXR1cywgcmVzcG9uc2UgfSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX2NhbmNlbFJlZkV2ZW50KCk7XG4gICAgICAgIHRoaXMuX2NhbmNlbFRpbWVvdXQoKTtcbiAgICB9XG4gICAgX2NhbmNlbFJlZkV2ZW50KCkge1xuICAgICAgICBpZiAoIXRoaXMucmVmRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYW5uZWwuX29mZih0aGlzLnJlZkV2ZW50LCB7fSk7XG4gICAgfVxuICAgIF9jYW5jZWxUaW1lb3V0KCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0VGltZXIpO1xuICAgICAgICB0aGlzLnRpbWVvdXRUaW1lciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgX21hdGNoUmVjZWl2ZSh7IHN0YXR1cywgcmVzcG9uc2UsIH0pIHtcbiAgICAgICAgdGhpcy5yZWNIb29rc1xuICAgICAgICAgICAgLmZpbHRlcigoaCkgPT4gaC5zdGF0dXMgPT09IHN0YXR1cylcbiAgICAgICAgICAgIC5mb3JFYWNoKChoKSA9PiBoLmNhbGxiYWNrKHJlc3BvbnNlKSk7XG4gICAgfVxuICAgIF9oYXNSZWNlaXZlZChzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjZWl2ZWRSZXNwICYmIHRoaXMucmVjZWl2ZWRSZXNwLnN0YXR1cyA9PT0gc3RhdHVzO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXB1c2guanMubWFwIiwiLypcbiAgVGhpcyBmaWxlIGRyYXdzIGhlYXZpbHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4L2Jsb2IvZDM0NGVjMGE3MzJhYjRlZTIwNDIxNWIzMWRlNjljZjRiZTcyZTNiZi9hc3NldHMvanMvcGhvZW5peC9wcmVzZW5jZS5qc1xuICBMaWNlbnNlOiBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4L2Jsb2IvZDM0NGVjMGE3MzJhYjRlZTIwNDIxNWIzMWRlNjljZjRiZTcyZTNiZi9MSUNFTlNFLm1kXG4qL1xuZXhwb3J0IHZhciBSRUFMVElNRV9QUkVTRU5DRV9MSVNURU5fRVZFTlRTO1xuKGZ1bmN0aW9uIChSRUFMVElNRV9QUkVTRU5DRV9MSVNURU5fRVZFTlRTKSB7XG4gICAgUkVBTFRJTUVfUFJFU0VOQ0VfTElTVEVOX0VWRU5UU1tcIlNZTkNcIl0gPSBcInN5bmNcIjtcbiAgICBSRUFMVElNRV9QUkVTRU5DRV9MSVNURU5fRVZFTlRTW1wiSk9JTlwiXSA9IFwiam9pblwiO1xuICAgIFJFQUxUSU1FX1BSRVNFTkNFX0xJU1RFTl9FVkVOVFNbXCJMRUFWRVwiXSA9IFwibGVhdmVcIjtcbn0pKFJFQUxUSU1FX1BSRVNFTkNFX0xJU1RFTl9FVkVOVFMgfHwgKFJFQUxUSU1FX1BSRVNFTkNFX0xJU1RFTl9FVkVOVFMgPSB7fSkpO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhbHRpbWVQcmVzZW5jZSB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIFByZXNlbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoYW5uZWwgLSBUaGUgUmVhbHRpbWVDaGFubmVsXG4gICAgICogQHBhcmFtIG9wdHMgLSBUaGUgb3B0aW9ucyxcbiAgICAgKiAgICAgICAgZm9yIGV4YW1wbGUgYHtldmVudHM6IHtzdGF0ZTogJ3N0YXRlJywgZGlmZjogJ2RpZmYnfX1gXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY2hhbm5lbCwgb3B0cykge1xuICAgICAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuICAgICAgICB0aGlzLnN0YXRlID0ge307XG4gICAgICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW107XG4gICAgICAgIHRoaXMuam9pblJlZiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FsbGVyID0ge1xuICAgICAgICAgICAgb25Kb2luOiAoKSA9PiB7IH0sXG4gICAgICAgICAgICBvbkxlYXZlOiAoKSA9PiB7IH0sXG4gICAgICAgICAgICBvblN5bmM6ICgpID0+IHsgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXZlbnRzID0gKG9wdHMgPT09IG51bGwgfHwgb3B0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0cy5ldmVudHMpIHx8IHtcbiAgICAgICAgICAgIHN0YXRlOiAncHJlc2VuY2Vfc3RhdGUnLFxuICAgICAgICAgICAgZGlmZjogJ3ByZXNlbmNlX2RpZmYnLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoYW5uZWwuX29uKGV2ZW50cy5zdGF0ZSwge30sIChuZXdTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvbkpvaW4sIG9uTGVhdmUsIG9uU3luYyB9ID0gdGhpcy5jYWxsZXI7XG4gICAgICAgICAgICB0aGlzLmpvaW5SZWYgPSB0aGlzLmNoYW5uZWwuX2pvaW5SZWYoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBSZWFsdGltZVByZXNlbmNlLnN5bmNTdGF0ZSh0aGlzLnN0YXRlLCBuZXdTdGF0ZSwgb25Kb2luLCBvbkxlYXZlKTtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goKGRpZmYpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gUmVhbHRpbWVQcmVzZW5jZS5zeW5jRGlmZih0aGlzLnN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdO1xuICAgICAgICAgICAgb25TeW5jKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoYW5uZWwuX29uKGV2ZW50cy5kaWZmLCB7fSwgKGRpZmYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb25Kb2luLCBvbkxlYXZlLCBvblN5bmMgfSA9IHRoaXMuY2FsbGVyO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5QZW5kaW5nU3luY1N0YXRlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdEaWZmcy5wdXNoKGRpZmYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFJlYWx0aW1lUHJlc2VuY2Uuc3luY0RpZmYodGhpcy5zdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKTtcbiAgICAgICAgICAgICAgICBvblN5bmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub25Kb2luKChrZXksIGN1cnJlbnRQcmVzZW5jZXMsIG5ld1ByZXNlbmNlcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVsLl90cmlnZ2VyKCdwcmVzZW5jZScsIHtcbiAgICAgICAgICAgICAgICBldmVudDogJ2pvaW4nLFxuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICBjdXJyZW50UHJlc2VuY2VzLFxuICAgICAgICAgICAgICAgIG5ld1ByZXNlbmNlcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbkxlYXZlKChrZXksIGN1cnJlbnRQcmVzZW5jZXMsIGxlZnRQcmVzZW5jZXMpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5fdHJpZ2dlcigncHJlc2VuY2UnLCB7XG4gICAgICAgICAgICAgICAgZXZlbnQ6ICdsZWF2ZScsXG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIGN1cnJlbnRQcmVzZW5jZXMsXG4gICAgICAgICAgICAgICAgbGVmdFByZXNlbmNlcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vblN5bmMoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVsLl90cmlnZ2VyKCdwcmVzZW5jZScsIHsgZXZlbnQ6ICdzeW5jJyB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVzZWQgdG8gc3luYyB0aGUgbGlzdCBvZiBwcmVzZW5jZXMgb24gdGhlIHNlcnZlciB3aXRoIHRoZVxuICAgICAqIGNsaWVudCdzIHN0YXRlLlxuICAgICAqXG4gICAgICogQW4gb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFjayBjYW4gYmUgcHJvdmlkZWQgdG9cbiAgICAgKiByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAgICogZGlzY29ubmVjdHMgYW5kIHJlY29ubmVjdHMgd2l0aCB0aGUgc2VydmVyLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmNsb25lRGVlcChjdXJyZW50U3RhdGUpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZFN0YXRlID0gdGhpcy50cmFuc2Zvcm1TdGF0ZShuZXdTdGF0ZSk7XG4gICAgICAgIGNvbnN0IGpvaW5zID0ge307XG4gICAgICAgIGNvbnN0IGxlYXZlcyA9IHt9O1xuICAgICAgICB0aGlzLm1hcChzdGF0ZSwgKGtleSwgcHJlc2VuY2VzKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRyYW5zZm9ybWVkU3RhdGVba2V5XSkge1xuICAgICAgICAgICAgICAgIGxlYXZlc1trZXldID0gcHJlc2VuY2VzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYXAodHJhbnNmb3JtZWRTdGF0ZSwgKGtleSwgbmV3UHJlc2VuY2VzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UHJlc2VuY2VzID0gc3RhdGVba2V5XTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UHJlc2VuY2VzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UHJlc2VuY2VSZWZzID0gbmV3UHJlc2VuY2VzLm1hcCgobSkgPT4gbS5wcmVzZW5jZV9yZWYpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1clByZXNlbmNlUmVmcyA9IGN1cnJlbnRQcmVzZW5jZXMubWFwKChtKSA9PiBtLnByZXNlbmNlX3JlZik7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pbmVkUHJlc2VuY2VzID0gbmV3UHJlc2VuY2VzLmZpbHRlcigobSkgPT4gY3VyUHJlc2VuY2VSZWZzLmluZGV4T2YobS5wcmVzZW5jZV9yZWYpIDwgMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdFByZXNlbmNlcyA9IGN1cnJlbnRQcmVzZW5jZXMuZmlsdGVyKChtKSA9PiBuZXdQcmVzZW5jZVJlZnMuaW5kZXhPZihtLnByZXNlbmNlX3JlZikgPCAwKTtcbiAgICAgICAgICAgICAgICBpZiAoam9pbmVkUHJlc2VuY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgam9pbnNba2V5XSA9IGpvaW5lZFByZXNlbmNlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRQcmVzZW5jZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZWF2ZXNba2V5XSA9IGxlZnRQcmVzZW5jZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bmNEaWZmKHN0YXRlLCB7IGpvaW5zLCBsZWF2ZXMgfSwgb25Kb2luLCBvbkxlYXZlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXNlZCB0byBzeW5jIGEgZGlmZiBvZiBwcmVzZW5jZSBqb2luIGFuZCBsZWF2ZSBldmVudHMgZnJvbSB0aGVcbiAgICAgKiBzZXJ2ZXIsIGFzIHRoZXkgaGFwcGVuLlxuICAgICAqXG4gICAgICogTGlrZSBgc3luY1N0YXRlYCwgYHN5bmNEaWZmYCBhY2NlcHRzIG9wdGlvbmFsIGBvbkpvaW5gIGFuZFxuICAgICAqIGBvbkxlYXZlYCBjYWxsYmFja3MgdG8gcmVhY3QgdG8gYSB1c2VyIGpvaW5pbmcgb3IgbGVhdmluZyBmcm9tIGFcbiAgICAgKiBkZXZpY2UuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBzdGF0aWMgc3luY0RpZmYoc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSkge1xuICAgICAgICBjb25zdCB7IGpvaW5zLCBsZWF2ZXMgfSA9IHtcbiAgICAgICAgICAgIGpvaW5zOiB0aGlzLnRyYW5zZm9ybVN0YXRlKGRpZmYuam9pbnMpLFxuICAgICAgICAgICAgbGVhdmVzOiB0aGlzLnRyYW5zZm9ybVN0YXRlKGRpZmYubGVhdmVzKSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFvbkpvaW4pIHtcbiAgICAgICAgICAgIG9uSm9pbiA9ICgpID0+IHsgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9uTGVhdmUpIHtcbiAgICAgICAgICAgIG9uTGVhdmUgPSAoKSA9PiB7IH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXAoam9pbnMsIChrZXksIG5ld1ByZXNlbmNlcykgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFByZXNlbmNlcyA9IChfYSA9IHN0YXRlW2tleV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICAgICAgc3RhdGVba2V5XSA9IHRoaXMuY2xvbmVEZWVwKG5ld1ByZXNlbmNlcyk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFByZXNlbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pbmVkUHJlc2VuY2VSZWZzID0gc3RhdGVba2V5XS5tYXAoKG0pID0+IG0ucHJlc2VuY2VfcmVmKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJQcmVzZW5jZXMgPSBjdXJyZW50UHJlc2VuY2VzLmZpbHRlcigobSkgPT4gam9pbmVkUHJlc2VuY2VSZWZzLmluZGV4T2YobS5wcmVzZW5jZV9yZWYpIDwgMCk7XG4gICAgICAgICAgICAgICAgc3RhdGVba2V5XS51bnNoaWZ0KC4uLmN1clByZXNlbmNlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkpvaW4oa2V5LCBjdXJyZW50UHJlc2VuY2VzLCBuZXdQcmVzZW5jZXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYXAobGVhdmVzLCAoa2V5LCBsZWZ0UHJlc2VuY2VzKSA9PiB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFByZXNlbmNlcyA9IHN0YXRlW2tleV07XG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRQcmVzZW5jZXMpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgcHJlc2VuY2VSZWZzVG9SZW1vdmUgPSBsZWZ0UHJlc2VuY2VzLm1hcCgobSkgPT4gbS5wcmVzZW5jZV9yZWYpO1xuICAgICAgICAgICAgY3VycmVudFByZXNlbmNlcyA9IGN1cnJlbnRQcmVzZW5jZXMuZmlsdGVyKChtKSA9PiBwcmVzZW5jZVJlZnNUb1JlbW92ZS5pbmRleE9mKG0ucHJlc2VuY2VfcmVmKSA8IDApO1xuICAgICAgICAgICAgc3RhdGVba2V5XSA9IGN1cnJlbnRQcmVzZW5jZXM7XG4gICAgICAgICAgICBvbkxlYXZlKGtleSwgY3VycmVudFByZXNlbmNlcywgbGVmdFByZXNlbmNlcyk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFByZXNlbmNlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0YXRlW2tleV07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBzdGF0aWMgbWFwKG9iaiwgZnVuYykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5tYXAoKGtleSkgPT4gZnVuYyhrZXksIG9ialtrZXldKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSAnbWV0YXMnIGtleVxuICAgICAqIENoYW5nZSAncGh4X3JlZicgdG8gJ3ByZXNlbmNlX3JlZidcbiAgICAgKiBSZW1vdmUgJ3BoeF9yZWYnIGFuZCAncGh4X3JlZl9wcmV2J1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyByZXR1cm5zIHtcbiAgICAgKiAgYWJjMTIzOiBbXG4gICAgICogICAgeyBwcmVzZW5jZV9yZWY6ICcyJywgdXNlcl9pZDogMSB9LFxuICAgICAqICAgIHsgcHJlc2VuY2VfcmVmOiAnMycsIHVzZXJfaWQ6IDIgfVxuICAgICAqICBdXG4gICAgICogfVxuICAgICAqIFJlYWx0aW1lUHJlc2VuY2UudHJhbnNmb3JtU3RhdGUoe1xuICAgICAqICBhYmMxMjM6IHtcbiAgICAgKiAgICBtZXRhczogW1xuICAgICAqICAgICAgeyBwaHhfcmVmOiAnMicsIHBoeF9yZWZfcHJldjogJzEnIHVzZXJfaWQ6IDEgfSxcbiAgICAgKiAgICAgIHsgcGh4X3JlZjogJzMnLCB1c2VyX2lkOiAyIH1cbiAgICAgKiAgICBdXG4gICAgICogIH1cbiAgICAgKiB9KVxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybVN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHN0YXRlID0gdGhpcy5jbG9uZURlZXAoc3RhdGUpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc3RhdGUpLnJlZHVjZSgobmV3U3RhdGUsIGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJlc2VuY2VzID0gc3RhdGVba2V5XTtcbiAgICAgICAgICAgIGlmICgnbWV0YXMnIGluIHByZXNlbmNlcykge1xuICAgICAgICAgICAgICAgIG5ld1N0YXRlW2tleV0gPSBwcmVzZW5jZXMubWV0YXMubWFwKChwcmVzZW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwcmVzZW5jZVsncHJlc2VuY2VfcmVmJ10gPSBwcmVzZW5jZVsncGh4X3JlZiddO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcHJlc2VuY2VbJ3BoeF9yZWYnXTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHByZXNlbmNlWydwaHhfcmVmX3ByZXYnXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXNlbmNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U3RhdGVba2V5XSA9IHByZXNlbmNlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICAgICAgfSwge30pO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgc3RhdGljIGNsb25lRGVlcChvYmopIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBvbkpvaW4oY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5jYWxsZXIub25Kb2luID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBvbkxlYXZlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuY2FsbGVyLm9uTGVhdmUgPSBjYWxsYmFjaztcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIG9uU3luYyhjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmNhbGxlci5vblN5bmMgPSBjYWxsYmFjaztcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIGluUGVuZGluZ1N5bmNTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmpvaW5SZWYgfHwgdGhpcy5qb2luUmVmICE9PSB0aGlzLmNoYW5uZWwuX2pvaW5SZWYoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZWFsdGltZVByZXNlbmNlLmpzLm1hcCIsImltcG9ydCB7IENIQU5ORUxfRVZFTlRTLCBDSEFOTkVMX1NUQVRFUyB9IGZyb20gJy4vbGliL2NvbnN0YW50cyc7XG5pbXBvcnQgUHVzaCBmcm9tICcuL2xpYi9wdXNoJztcbmltcG9ydCBUaW1lciBmcm9tICcuL2xpYi90aW1lcic7XG5pbXBvcnQgUmVhbHRpbWVQcmVzZW5jZSBmcm9tICcuL1JlYWx0aW1lUHJlc2VuY2UnO1xuaW1wb3J0ICogYXMgVHJhbnNmb3JtZXJzIGZyb20gJy4vbGliL3RyYW5zZm9ybWVycyc7XG5pbXBvcnQgeyBodHRwRW5kcG9pbnRVUkwgfSBmcm9tICcuL2xpYi90cmFuc2Zvcm1lcnMnO1xuZXhwb3J0IHZhciBSRUFMVElNRV9QT1NUR1JFU19DSEFOR0VTX0xJU1RFTl9FVkVOVDtcbihmdW5jdGlvbiAoUkVBTFRJTUVfUE9TVEdSRVNfQ0hBTkdFU19MSVNURU5fRVZFTlQpIHtcbiAgICBSRUFMVElNRV9QT1NUR1JFU19DSEFOR0VTX0xJU1RFTl9FVkVOVFtcIkFMTFwiXSA9IFwiKlwiO1xuICAgIFJFQUxUSU1FX1BPU1RHUkVTX0NIQU5HRVNfTElTVEVOX0VWRU5UW1wiSU5TRVJUXCJdID0gXCJJTlNFUlRcIjtcbiAgICBSRUFMVElNRV9QT1NUR1JFU19DSEFOR0VTX0xJU1RFTl9FVkVOVFtcIlVQREFURVwiXSA9IFwiVVBEQVRFXCI7XG4gICAgUkVBTFRJTUVfUE9TVEdSRVNfQ0hBTkdFU19MSVNURU5fRVZFTlRbXCJERUxFVEVcIl0gPSBcIkRFTEVURVwiO1xufSkoUkVBTFRJTUVfUE9TVEdSRVNfQ0hBTkdFU19MSVNURU5fRVZFTlQgfHwgKFJFQUxUSU1FX1BPU1RHUkVTX0NIQU5HRVNfTElTVEVOX0VWRU5UID0ge30pKTtcbmV4cG9ydCB2YXIgUkVBTFRJTUVfTElTVEVOX1RZUEVTO1xuKGZ1bmN0aW9uIChSRUFMVElNRV9MSVNURU5fVFlQRVMpIHtcbiAgICBSRUFMVElNRV9MSVNURU5fVFlQRVNbXCJCUk9BRENBU1RcIl0gPSBcImJyb2FkY2FzdFwiO1xuICAgIFJFQUxUSU1FX0xJU1RFTl9UWVBFU1tcIlBSRVNFTkNFXCJdID0gXCJwcmVzZW5jZVwiO1xuICAgIFJFQUxUSU1FX0xJU1RFTl9UWVBFU1tcIlBPU1RHUkVTX0NIQU5HRVNcIl0gPSBcInBvc3RncmVzX2NoYW5nZXNcIjtcbiAgICBSRUFMVElNRV9MSVNURU5fVFlQRVNbXCJTWVNURU1cIl0gPSBcInN5c3RlbVwiO1xufSkoUkVBTFRJTUVfTElTVEVOX1RZUEVTIHx8IChSRUFMVElNRV9MSVNURU5fVFlQRVMgPSB7fSkpO1xuZXhwb3J0IHZhciBSRUFMVElNRV9TVUJTQ1JJQkVfU1RBVEVTO1xuKGZ1bmN0aW9uIChSRUFMVElNRV9TVUJTQ1JJQkVfU1RBVEVTKSB7XG4gICAgUkVBTFRJTUVfU1VCU0NSSUJFX1NUQVRFU1tcIlNVQlNDUklCRURcIl0gPSBcIlNVQlNDUklCRURcIjtcbiAgICBSRUFMVElNRV9TVUJTQ1JJQkVfU1RBVEVTW1wiVElNRURfT1VUXCJdID0gXCJUSU1FRF9PVVRcIjtcbiAgICBSRUFMVElNRV9TVUJTQ1JJQkVfU1RBVEVTW1wiQ0xPU0VEXCJdID0gXCJDTE9TRURcIjtcbiAgICBSRUFMVElNRV9TVUJTQ1JJQkVfU1RBVEVTW1wiQ0hBTk5FTF9FUlJPUlwiXSA9IFwiQ0hBTk5FTF9FUlJPUlwiO1xufSkoUkVBTFRJTUVfU1VCU0NSSUJFX1NUQVRFUyB8fCAoUkVBTFRJTUVfU1VCU0NSSUJFX1NUQVRFUyA9IHt9KSk7XG5leHBvcnQgY29uc3QgUkVBTFRJTUVfQ0hBTk5FTF9TVEFURVMgPSBDSEFOTkVMX1NUQVRFUztcbi8qKiBBIGNoYW5uZWwgaXMgdGhlIGJhc2ljIGJ1aWxkaW5nIGJsb2NrIG9mIFJlYWx0aW1lXG4gKiBhbmQgbmFycm93cyB0aGUgc2NvcGUgb2YgZGF0YSBmbG93IHRvIHN1YnNjcmliZWQgY2xpZW50cy5cbiAqIFlvdSBjYW4gdGhpbmsgb2YgYSBjaGFubmVsIGFzIGEgY2hhdHJvb20gd2hlcmUgcGFydGljaXBhbnRzIGFyZSBhYmxlIHRvIHNlZSB3aG8ncyBvbmxpbmVcbiAqIGFuZCBzZW5kIGFuZCByZWNlaXZlIG1lc3NhZ2VzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFsdGltZUNoYW5uZWwge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUb3BpYyBuYW1lIGNhbiBiZSBhbnkgc3RyaW5nLiAqL1xuICAgIHRvcGljLCBwYXJhbXMgPSB7IGNvbmZpZzoge30gfSwgc29ja2V0KSB7XG4gICAgICAgIHRoaXMudG9waWMgPSB0b3BpYztcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5jbG9zZWQ7XG4gICAgICAgIHRoaXMuam9pbmVkT25jZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXTtcbiAgICAgICAgdGhpcy5zdWJUb3BpYyA9IHRvcGljLnJlcGxhY2UoL15yZWFsdGltZTovaSwgJycpO1xuICAgICAgICB0aGlzLnBhcmFtcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGJyb2FkY2FzdDogeyBhY2s6IGZhbHNlLCBzZWxmOiBmYWxzZSB9LFxuICAgICAgICAgICAgcHJlc2VuY2U6IHsga2V5OiAnJyB9LFxuICAgICAgICAgICAgcHJpdmF0ZTogZmFsc2UsXG4gICAgICAgIH0sIHBhcmFtcy5jb25maWcpO1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSB0aGlzLnNvY2tldC50aW1lb3V0O1xuICAgICAgICB0aGlzLmpvaW5QdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMuam9pbiwgdGhpcy5wYXJhbXMsIHRoaXMudGltZW91dCk7XG4gICAgICAgIHRoaXMucmVqb2luVGltZXIgPSBuZXcgVGltZXIoKCkgPT4gdGhpcy5fcmVqb2luVW50aWxDb25uZWN0ZWQoKSwgdGhpcy5zb2NrZXQucmVjb25uZWN0QWZ0ZXJNcyk7XG4gICAgICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZSgnb2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmVkO1xuICAgICAgICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5wdXNoQnVmZmVyLmZvckVhY2goKHB1c2hFdmVudCkgPT4gcHVzaEV2ZW50LnNlbmQoKSk7XG4gICAgICAgICAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX29uQ2xvc2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQubG9nKCdjaGFubmVsJywgYGNsb3NlICR7dGhpcy50b3BpY30gJHt0aGlzLl9qb2luUmVmKCl9YCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuX3JlbW92ZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX29uRXJyb3IoKHJlYXNvbikgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzTGVhdmluZygpIHx8IHRoaXMuX2lzQ2xvc2VkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5sb2coJ2NoYW5uZWwnLCBgZXJyb3IgJHt0aGlzLnRvcGljfWAsIHJlYXNvbik7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZDtcbiAgICAgICAgICAgIHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoJ3RpbWVvdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzSm9pbmluZygpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zb2NrZXQubG9nKCdjaGFubmVsJywgYHRpbWVvdXQgJHt0aGlzLnRvcGljfWAsIHRoaXMuam9pblB1c2gudGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZDtcbiAgICAgICAgICAgIHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9vbihDSEFOTkVMX0VWRU5UUy5yZXBseSwge30sIChwYXlsb2FkLCByZWYpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIodGhpcy5fcmVwbHlFdmVudE5hbWUocmVmKSwgcGF5bG9hZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnByZXNlbmNlID0gbmV3IFJlYWx0aW1lUHJlc2VuY2UodGhpcyk7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0RW5kcG9pbnRVUkwgPVxuICAgICAgICAgICAgaHR0cEVuZHBvaW50VVJMKHRoaXMuc29ja2V0LmVuZFBvaW50KSArICcvYXBpL2Jyb2FkY2FzdCc7XG4gICAgICAgIHRoaXMucHJpdmF0ZSA9IHRoaXMucGFyYW1zLmNvbmZpZy5wcml2YXRlIHx8IGZhbHNlO1xuICAgIH1cbiAgICAvKiogU3Vic2NyaWJlIHJlZ2lzdGVycyB5b3VyIGNsaWVudCB3aXRoIHRoZSBzZXJ2ZXIgKi9cbiAgICBzdWJzY3JpYmUoY2FsbGJhY2ssIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgaWYgKCF0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkKSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvbmZpZzogeyBicm9hZGNhc3QsIHByZXNlbmNlLCBwcml2YXRlOiBpc1ByaXZhdGUgfSwgfSA9IHRoaXMucGFyYW1zO1xuICAgICAgICAgICAgdGhpcy5fb25FcnJvcigoZSkgPT4gY2FsbGJhY2sgPT09IG51bGwgfHwgY2FsbGJhY2sgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNhbGxiYWNrKFJFQUxUSU1FX1NVQlNDUklCRV9TVEFURVMuQ0hBTk5FTF9FUlJPUiwgZSkpO1xuICAgICAgICAgICAgdGhpcy5fb25DbG9zZSgoKSA9PiBjYWxsYmFjayA9PT0gbnVsbCB8fCBjYWxsYmFjayA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2FsbGJhY2soUkVBTFRJTUVfU1VCU0NSSUJFX1NUQVRFUy5DTE9TRUQpKTtcbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuUGF5bG9hZCA9IHt9O1xuICAgICAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGJyb2FkY2FzdCxcbiAgICAgICAgICAgICAgICBwcmVzZW5jZSxcbiAgICAgICAgICAgICAgICBwb3N0Z3Jlc19jaGFuZ2VzOiAoX2IgPSAoX2EgPSB0aGlzLmJpbmRpbmdzLnBvc3RncmVzX2NoYW5nZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXAoKHIpID0+IHIuZmlsdGVyKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10sXG4gICAgICAgICAgICAgICAgcHJpdmF0ZTogaXNQcml2YXRlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldC5hY2Nlc3NUb2tlblZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzVG9rZW5QYXlsb2FkLmFjY2Vzc190b2tlbiA9IHRoaXMuc29ja2V0LmFjY2Vzc1Rva2VuVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUpvaW5QYXlsb2FkKE9iamVjdC5hc3NpZ24oeyBjb25maWcgfSwgYWNjZXNzVG9rZW5QYXlsb2FkKSk7XG4gICAgICAgICAgICB0aGlzLmpvaW5lZE9uY2UgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fcmVqb2luKHRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5qb2luUHVzaFxuICAgICAgICAgICAgICAgIC5yZWNlaXZlKCdvaycsIGFzeW5jICh7IHBvc3RncmVzX2NoYW5nZXMgfSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZXRBdXRoKCk7XG4gICAgICAgICAgICAgICAgaWYgKHBvc3RncmVzX2NoYW5nZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9PT0gbnVsbCB8fCBjYWxsYmFjayA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2FsbGJhY2soUkVBTFRJTUVfU1VCU0NSSUJFX1NUQVRFUy5TVUJTQ1JJQkVEKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xpZW50UG9zdGdyZXNCaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MucG9zdGdyZXNfY2hhbmdlcztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluZGluZ3NMZW4gPSAoX2EgPSBjbGllbnRQb3N0Z3Jlc0JpbmRpbmdzID09PSBudWxsIHx8IGNsaWVudFBvc3RncmVzQmluZGluZ3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsaWVudFBvc3RncmVzQmluZGluZ3MubGVuZ3RoKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQb3N0Z3Jlc0JpbmRpbmdzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluZGluZ3NMZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xpZW50UG9zdGdyZXNCaW5kaW5nID0gY2xpZW50UG9zdGdyZXNCaW5kaW5nc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZmlsdGVyOiB7IGV2ZW50LCBzY2hlbWEsIHRhYmxlLCBmaWx0ZXIgfSwgfSA9IGNsaWVudFBvc3RncmVzQmluZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlclBvc3RncmVzRmlsdGVyID0gcG9zdGdyZXNfY2hhbmdlcyAmJiBwb3N0Z3Jlc19jaGFuZ2VzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlcnZlclBvc3RncmVzRmlsdGVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyUG9zdGdyZXNGaWx0ZXIuZXZlbnQgPT09IGV2ZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyUG9zdGdyZXNGaWx0ZXIuc2NoZW1hID09PSBzY2hlbWEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJQb3N0Z3Jlc0ZpbHRlci50YWJsZSA9PT0gdGFibGUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJQb3N0Z3Jlc0ZpbHRlci5maWx0ZXIgPT09IGZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Bvc3RncmVzQmluZGluZ3MucHVzaChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNsaWVudFBvc3RncmVzQmluZGluZyksIHsgaWQ6IHNlcnZlclBvc3RncmVzRmlsdGVyLmlkIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9PT0gbnVsbCB8fCBjYWxsYmFjayA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2FsbGJhY2soUkVBTFRJTUVfU1VCU0NSSUJFX1NUQVRFUy5DSEFOTkVMX0VSUk9SLCBuZXcgRXJyb3IoJ21pc21hdGNoIGJldHdlZW4gc2VydmVyIGFuZCBjbGllbnQgYmluZGluZ3MgZm9yIHBvc3RncmVzIGNoYW5nZXMnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZGluZ3MucG9zdGdyZXNfY2hhbmdlcyA9IG5ld1Bvc3RncmVzQmluZGluZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKFJFQUxUSU1FX1NVQlNDUklCRV9TVEFURVMuU1VCU0NSSUJFRCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5yZWNlaXZlKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID09PSBudWxsIHx8IGNhbGxiYWNrID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjYWxsYmFjayhSRUFMVElNRV9TVUJTQ1JJQkVfU1RBVEVTLkNIQU5ORUxfRVJST1IsIG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShPYmplY3QudmFsdWVzKGVycm9yKS5qb2luKCcsICcpIHx8ICdlcnJvcicpKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAucmVjZWl2ZSgndGltZW91dCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9PT0gbnVsbCB8fCBjYWxsYmFjayA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2FsbGJhY2soUkVBTFRJTUVfU1VCU0NSSUJFX1NUQVRFUy5USU1FRF9PVVQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBwcmVzZW5jZVN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVzZW5jZS5zdGF0ZTtcbiAgICB9XG4gICAgYXN5bmMgdHJhY2socGF5bG9hZCwgb3B0cyA9IHt9KSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNlbmQoe1xuICAgICAgICAgICAgdHlwZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgICAgIGV2ZW50OiAndHJhY2snLFxuICAgICAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgfSwgb3B0cy50aW1lb3V0IHx8IHRoaXMudGltZW91dCk7XG4gICAgfVxuICAgIGFzeW5jIHVudHJhY2sob3B0cyA9IHt9KSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNlbmQoe1xuICAgICAgICAgICAgdHlwZTogJ3ByZXNlbmNlJyxcbiAgICAgICAgICAgIGV2ZW50OiAndW50cmFjaycsXG4gICAgICAgIH0sIG9wdHMpO1xuICAgIH1cbiAgICBvbih0eXBlLCBmaWx0ZXIsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vbih0eXBlLCBmaWx0ZXIsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBtZXNzYWdlIGludG8gdGhlIGNoYW5uZWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyBBcmd1bWVudHMgdG8gc2VuZCB0byBjaGFubmVsXG4gICAgICogQHBhcmFtIGFyZ3MudHlwZSBUaGUgdHlwZSBvZiBldmVudCB0byBzZW5kXG4gICAgICogQHBhcmFtIGFyZ3MuZXZlbnQgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IGJlaW5nIHNlbnRcbiAgICAgKiBAcGFyYW0gYXJncy5wYXlsb2FkIFBheWxvYWQgdG8gYmUgc2VudFxuICAgICAqIEBwYXJhbSBvcHRzIE9wdGlvbnMgdG8gYmUgdXNlZCBkdXJpbmcgdGhlIHNlbmQgcHJvY2Vzc1xuICAgICAqL1xuICAgIGFzeW5jIHNlbmQoYXJncywgb3B0cyA9IHt9KSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGlmICghdGhpcy5fY2FuUHVzaCgpICYmIGFyZ3MudHlwZSA9PT0gJ2Jyb2FkY2FzdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZXZlbnQsIHBheWxvYWQ6IGVuZHBvaW50X3BheWxvYWQgfSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBhdXRob3JpemF0aW9uID0gdGhpcy5zb2NrZXQuYWNjZXNzVG9rZW5WYWx1ZVxuICAgICAgICAgICAgICAgID8gYEJlYXJlciAke3RoaXMuc29ja2V0LmFjY2Vzc1Rva2VuVmFsdWV9YFxuICAgICAgICAgICAgICAgIDogJyc7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYXV0aG9yaXphdGlvbixcbiAgICAgICAgICAgICAgICAgICAgYXBpa2V5OiB0aGlzLnNvY2tldC5hcGlLZXkgPyB0aGlzLnNvY2tldC5hcGlLZXkgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BpYzogdGhpcy5zdWJUb3BpYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiBlbmRwb2ludF9wYXlsb2FkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaXZhdGU6IHRoaXMucHJpdmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX2ZldGNoV2l0aFRpbWVvdXQodGhpcy5icm9hZGNhc3RFbmRwb2ludFVSTCwgb3B0aW9ucywgKF9hID0gb3B0cy50aW1lb3V0KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIGF3YWl0ICgoX2IgPSByZXNwb25zZS5ib2R5KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FuY2VsKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5vayA/ICdvaycgOiAnZXJyb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yLm5hbWUgPT09ICdBYm9ydEVycm9yJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3RpbWVkIG91dCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Vycm9yJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgICAgICBjb25zdCBwdXNoID0gdGhpcy5fcHVzaChhcmdzLnR5cGUsIGFyZ3MsIG9wdHMudGltZW91dCB8fCB0aGlzLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLnR5cGUgPT09ICdicm9hZGNhc3QnICYmICEoKF9jID0gKF9iID0gKF9hID0gdGhpcy5wYXJhbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb25maWcpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5icm9hZGNhc3QpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5hY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ29rJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHB1c2gucmVjZWl2ZSgnb2snLCAoKSA9PiByZXNvbHZlKCdvaycpKTtcbiAgICAgICAgICAgICAgICBwdXNoLnJlY2VpdmUoJ2Vycm9yJywgKCkgPT4gcmVzb2x2ZSgnZXJyb3InKSk7XG4gICAgICAgICAgICAgICAgcHVzaC5yZWNlaXZlKCd0aW1lb3V0JywgKCkgPT4gcmVzb2x2ZSgndGltZWQgb3V0JykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlSm9pblBheWxvYWQocGF5bG9hZCkge1xuICAgICAgICB0aGlzLmpvaW5QdXNoLnVwZGF0ZVBheWxvYWQocGF5bG9hZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExlYXZlcyB0aGUgY2hhbm5lbC5cbiAgICAgKlxuICAgICAqIFVuc3Vic2NyaWJlcyBmcm9tIHNlcnZlciBldmVudHMsIGFuZCBpbnN0cnVjdHMgY2hhbm5lbCB0byB0ZXJtaW5hdGUgb24gc2VydmVyLlxuICAgICAqIFRyaWdnZXJzIG9uQ2xvc2UoKSBob29rcy5cbiAgICAgKlxuICAgICAqIFRvIHJlY2VpdmUgbGVhdmUgYWNrbm93bGVkZ2VtZW50cywgdXNlIHRoZSBhIGByZWNlaXZlYCBob29rIHRvIGJpbmQgdG8gdGhlIHNlcnZlciBhY2ssIGllOlxuICAgICAqIGNoYW5uZWwudW5zdWJzY3JpYmUoKS5yZWNlaXZlKFwib2tcIiwgKCkgPT4gYWxlcnQoXCJsZWZ0IVwiKSApXG4gICAgICovXG4gICAgdW5zdWJzY3JpYmUodGltZW91dCA9IHRoaXMudGltZW91dCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMubGVhdmluZztcbiAgICAgICAgY29uc3Qgb25DbG9zZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LmxvZygnY2hhbm5lbCcsIGBsZWF2ZSAke3RoaXMudG9waWN9YCk7XG4gICAgICAgICAgICB0aGlzLl90cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmNsb3NlLCAnbGVhdmUnLCB0aGlzLl9qb2luUmVmKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmpvaW5QdXNoLmRlc3Ryb3koKTtcbiAgICAgICAgbGV0IGxlYXZlUHVzaCA9IG51bGw7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgbGVhdmVQdXNoID0gbmV3IFB1c2godGhpcywgQ0hBTk5FTF9FVkVOVFMubGVhdmUsIHt9LCB0aW1lb3V0KTtcbiAgICAgICAgICAgIGxlYXZlUHVzaFxuICAgICAgICAgICAgICAgIC5yZWNlaXZlKCdvaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBvbkNsb3NlKCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgnb2snKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnJlY2VpdmUoJ3RpbWVvdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgb25DbG9zZSgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoJ3RpbWVkIG91dCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAucmVjZWl2ZSgnZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgnZXJyb3InKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGVhdmVQdXNoLnNlbmQoKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2FuUHVzaCgpKSB7XG4gICAgICAgICAgICAgICAgbGVhdmVQdXNoLnRyaWdnZXIoJ29rJywge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICAgIGxlYXZlUHVzaCA9PT0gbnVsbCB8fCBsZWF2ZVB1c2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxlYXZlUHVzaC5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUZWFyZG93biB0aGUgY2hhbm5lbC5cbiAgICAgKlxuICAgICAqIERlc3Ryb3lzIGFuZCBzdG9wcyByZWxhdGVkIHRpbWVycy5cbiAgICAgKi9cbiAgICB0ZWFyZG93bigpIHtcbiAgICAgICAgdGhpcy5wdXNoQnVmZmVyLmZvckVhY2goKHB1c2gpID0+IHB1c2guZGVzdHJveSgpKTtcbiAgICAgICAgdGhpcy5yZWpvaW5UaW1lciAmJiBjbGVhclRpbWVvdXQodGhpcy5yZWpvaW5UaW1lci50aW1lcik7XG4gICAgICAgIHRoaXMuam9pblB1c2guZGVzdHJveSgpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgYXN5bmMgX2ZldGNoV2l0aFRpbWVvdXQodXJsLCBvcHRpb25zLCB0aW1lb3V0KSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIHRpbWVvdXQpO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuc29ja2V0LmZldGNoKHVybCwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBzaWduYWw6IGNvbnRyb2xsZXIuc2lnbmFsIH0pKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3B1c2goZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmpvaW5lZE9uY2UpIHtcbiAgICAgICAgICAgIHRocm93IGB0cmllZCB0byBwdXNoICcke2V2ZW50fScgdG8gJyR7dGhpcy50b3BpY30nIGJlZm9yZSBqb2luaW5nLiBVc2UgY2hhbm5lbC5zdWJzY3JpYmUoKSBiZWZvcmUgcHVzaGluZyBldmVudHNgO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwdXNoRXZlbnQgPSBuZXcgUHVzaCh0aGlzLCBldmVudCwgcGF5bG9hZCwgdGltZW91dCk7XG4gICAgICAgIGlmICh0aGlzLl9jYW5QdXNoKCkpIHtcbiAgICAgICAgICAgIHB1c2hFdmVudC5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwdXNoRXZlbnQuc3RhcnRUaW1lb3V0KCk7XG4gICAgICAgICAgICB0aGlzLnB1c2hCdWZmZXIucHVzaChwdXNoRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwdXNoRXZlbnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE92ZXJyaWRhYmxlIG1lc3NhZ2UgaG9va1xuICAgICAqXG4gICAgICogUmVjZWl2ZXMgYWxsIGV2ZW50cyBmb3Igc3BlY2lhbGl6ZWQgbWVzc2FnZSBoYW5kbGluZyBiZWZvcmUgZGlzcGF0Y2hpbmcgdG8gdGhlIGNoYW5uZWwgY2FsbGJhY2tzLlxuICAgICAqIE11c3QgcmV0dXJuIHRoZSBwYXlsb2FkLCBtb2RpZmllZCBvciB1bm1vZGlmaWVkLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX29uTWVzc2FnZShfZXZlbnQsIHBheWxvYWQsIF9yZWYpIHtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfaXNNZW1iZXIodG9waWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9waWMgPT09IHRvcGljO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2pvaW5SZWYoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmpvaW5QdXNoLnJlZjtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF90cmlnZ2VyKHR5cGUsIHBheWxvYWQsIHJlZikge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBjb25zdCB0eXBlTG93ZXIgPSB0eXBlLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IHsgY2xvc2UsIGVycm9yLCBsZWF2ZSwgam9pbiB9ID0gQ0hBTk5FTF9FVkVOVFM7XG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IFtjbG9zZSwgZXJyb3IsIGxlYXZlLCBqb2luXTtcbiAgICAgICAgaWYgKHJlZiAmJiBldmVudHMuaW5kZXhPZih0eXBlTG93ZXIpID49IDAgJiYgcmVmICE9PSB0aGlzLl9qb2luUmVmKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaGFuZGxlZFBheWxvYWQgPSB0aGlzLl9vbk1lc3NhZ2UodHlwZUxvd2VyLCBwYXlsb2FkLCByZWYpO1xuICAgICAgICBpZiAocGF5bG9hZCAmJiAhaGFuZGxlZFBheWxvYWQpIHtcbiAgICAgICAgICAgIHRocm93ICdjaGFubmVsIG9uTWVzc2FnZSBjYWxsYmFja3MgbXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChbJ2luc2VydCcsICd1cGRhdGUnLCAnZGVsZXRlJ10uaW5jbHVkZXModHlwZUxvd2VyKSkge1xuICAgICAgICAgICAgKF9hID0gdGhpcy5iaW5kaW5ncy5wb3N0Z3Jlc19jaGFuZ2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZmlsdGVyKChiaW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoKF9hID0gYmluZC5maWx0ZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5ldmVudCkgPT09ICcqJyB8fFxuICAgICAgICAgICAgICAgICAgICAoKF9jID0gKF9iID0gYmluZC5maWx0ZXIpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ldmVudCkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnRvTG9jYWxlTG93ZXJDYXNlKCkpID09PSB0eXBlTG93ZXIpO1xuICAgICAgICAgICAgfSkubWFwKChiaW5kKSA9PiBiaW5kLmNhbGxiYWNrKGhhbmRsZWRQYXlsb2FkLCByZWYpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIChfYiA9IHRoaXMuYmluZGluZ3NbdHlwZUxvd2VyXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmZpbHRlcigoYmluZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mO1xuICAgICAgICAgICAgICAgIGlmIChbJ2Jyb2FkY2FzdCcsICdwcmVzZW5jZScsICdwb3N0Z3Jlc19jaGFuZ2VzJ10uaW5jbHVkZXModHlwZUxvd2VyKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJ2lkJyBpbiBiaW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5kSWQgPSBiaW5kLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluZEV2ZW50ID0gKF9hID0gYmluZC5maWx0ZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5ldmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoYmluZElkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChfYiA9IHBheWxvYWQuaWRzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaW5jbHVkZXMoYmluZElkKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYmluZEV2ZW50ID09PSAnKicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGJpbmRFdmVudCA9PT0gbnVsbCB8fCBiaW5kRXZlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGJpbmRFdmVudC50b0xvY2FsZUxvd2VyQ2FzZSgpKSA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoX2MgPSBwYXlsb2FkLmRhdGEpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy50eXBlLnRvTG9jYWxlTG93ZXJDYXNlKCkpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiaW5kRXZlbnQgPSAoX2UgPSAoX2QgPSBiaW5kID09PSBudWxsIHx8IGJpbmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGJpbmQuZmlsdGVyKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuZXZlbnQpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChiaW5kRXZlbnQgPT09ICcqJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRFdmVudCA9PT0gKChfZiA9IHBheWxvYWQgPT09IG51bGwgfHwgcGF5bG9hZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGF5bG9hZC5ldmVudCkgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLnRvTG9jYWxlTG93ZXJDYXNlKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpbmQudHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpID09PSB0eXBlTG93ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkubWFwKChiaW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVkUGF5bG9hZCA9PT0gJ29iamVjdCcgJiYgJ2lkcycgaW4gaGFuZGxlZFBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zdGdyZXNDaGFuZ2VzID0gaGFuZGxlZFBheWxvYWQuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzY2hlbWEsIHRhYmxlLCBjb21taXRfdGltZXN0YW1wLCB0eXBlLCBlcnJvcnMgfSA9IHBvc3RncmVzQ2hhbmdlcztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5yaWNoZWRQYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1hOiBzY2hlbWEsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZTogdGFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXRfdGltZXN0YW1wOiBjb21taXRfdGltZXN0YW1wLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3OiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZDoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IGVycm9ycyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlZFBheWxvYWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGVucmljaGVkUGF5bG9hZCksIHRoaXMuX2dldFBheWxvYWRSZWNvcmRzKHBvc3RncmVzQ2hhbmdlcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBiaW5kLmNhbGxiYWNrKGhhbmRsZWRQYXlsb2FkLCByZWYpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9pc0Nsb3NlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmNsb3NlZDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9pc0pvaW5lZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmpvaW5lZDtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9pc0pvaW5pbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX2lzTGVhdmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmxlYXZpbmc7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVwbHlFdmVudE5hbWUocmVmKSB7XG4gICAgICAgIHJldHVybiBgY2hhbl9yZXBseV8ke3JlZn1gO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX29uKHR5cGUsIGZpbHRlciwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgdHlwZUxvd2VyID0gdHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBiaW5kaW5nID0ge1xuICAgICAgICAgICAgdHlwZTogdHlwZUxvd2VyLFxuICAgICAgICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmJpbmRpbmdzW3R5cGVMb3dlcl0pIHtcbiAgICAgICAgICAgIHRoaXMuYmluZGluZ3NbdHlwZUxvd2VyXS5wdXNoKGJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iaW5kaW5nc1t0eXBlTG93ZXJdID0gW2JpbmRpbmddO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX29mZih0eXBlLCBmaWx0ZXIpIHtcbiAgICAgICAgY29uc3QgdHlwZUxvd2VyID0gdHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICB0aGlzLmJpbmRpbmdzW3R5cGVMb3dlcl0gPSB0aGlzLmJpbmRpbmdzW3R5cGVMb3dlcl0uZmlsdGVyKChiaW5kKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICByZXR1cm4gISgoKF9hID0gYmluZC50eXBlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudG9Mb2NhbGVMb3dlckNhc2UoKSkgPT09IHR5cGVMb3dlciAmJlxuICAgICAgICAgICAgICAgIFJlYWx0aW1lQ2hhbm5lbC5pc0VxdWFsKGJpbmQuZmlsdGVyLCBmaWx0ZXIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgc3RhdGljIGlzRXF1YWwob2JqMSwgb2JqMikge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMob2JqMSkubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhvYmoyKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqMSkge1xuICAgICAgICAgICAgaWYgKG9iajFba10gIT09IG9iajJba10pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVqb2luVW50aWxDb25uZWN0ZWQoKSB7XG4gICAgICAgIHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCk7XG4gICAgICAgIGlmICh0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWpvaW4oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgY2hhbm5lbCBjbG9zZXMuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBfb25DbG9zZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9vbihDSEFOTkVMX0VWRU5UUy5jbG9zZSwge30sIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNoYW5uZWwgZW5jb3VudGVyZXMgYW4gZXJyb3IuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBfb25FcnJvcihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9vbihDSEFOTkVMX0VWRU5UUy5lcnJvciwge30sIChyZWFzb24pID0+IGNhbGxiYWNrKHJlYXNvbikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgc29ja2V0IGlzIGNvbm5lY3RlZCBhbmQgdGhlIGNoYW5uZWwgaGFzIGJlZW4gam9pbmVkLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX2NhblB1c2goKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuX2lzSm9pbmVkKCk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfcmVqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzTGVhdmluZygpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb2NrZXQuX2xlYXZlT3BlblRvcGljKHRoaXMudG9waWMpO1xuICAgICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmluZztcbiAgICAgICAgdGhpcy5qb2luUHVzaC5yZXNlbmQodGltZW91dCk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfZ2V0UGF5bG9hZFJlY29yZHMocGF5bG9hZCkge1xuICAgICAgICBjb25zdCByZWNvcmRzID0ge1xuICAgICAgICAgICAgbmV3OiB7fSxcbiAgICAgICAgICAgIG9sZDoge30sXG4gICAgICAgIH07XG4gICAgICAgIGlmIChwYXlsb2FkLnR5cGUgPT09ICdJTlNFUlQnIHx8IHBheWxvYWQudHlwZSA9PT0gJ1VQREFURScpIHtcbiAgICAgICAgICAgIHJlY29yZHMubmV3ID0gVHJhbnNmb3JtZXJzLmNvbnZlcnRDaGFuZ2VEYXRhKHBheWxvYWQuY29sdW1ucywgcGF5bG9hZC5yZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXlsb2FkLnR5cGUgPT09ICdVUERBVEUnIHx8IHBheWxvYWQudHlwZSA9PT0gJ0RFTEVURScpIHtcbiAgICAgICAgICAgIHJlY29yZHMub2xkID0gVHJhbnNmb3JtZXJzLmNvbnZlcnRDaGFuZ2VEYXRhKHBheWxvYWQuY29sdW1ucywgcGF5bG9hZC5vbGRfcmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVjb3JkcztcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZWFsdGltZUNoYW5uZWwuanMubWFwIiwiaW1wb3J0IHsgV2ViU29ja2V0IH0gZnJvbSAnaXNvd3MnO1xuaW1wb3J0IHsgQ0hBTk5FTF9FVkVOVFMsIENPTk5FQ1RJT05fU1RBVEUsIERFRkFVTFRfVkVSU0lPTiwgREVGQVVMVF9USU1FT1VULCBTT0NLRVRfU1RBVEVTLCBUUkFOU1BPUlRTLCBWU04sIFdTX0NMT1NFX05PUk1BTCwgfSBmcm9tICcuL2xpYi9jb25zdGFudHMnO1xuaW1wb3J0IFNlcmlhbGl6ZXIgZnJvbSAnLi9saWIvc2VyaWFsaXplcic7XG5pbXBvcnQgVGltZXIgZnJvbSAnLi9saWIvdGltZXInO1xuaW1wb3J0IHsgaHR0cEVuZHBvaW50VVJMIH0gZnJvbSAnLi9saWIvdHJhbnNmb3JtZXJzJztcbmltcG9ydCBSZWFsdGltZUNoYW5uZWwgZnJvbSAnLi9SZWFsdGltZUNoYW5uZWwnO1xuY29uc3Qgbm9vcCA9ICgpID0+IHsgfTtcbmNvbnN0IFdPUktFUl9TQ1JJUFQgPSBgXG4gIGFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChlKSA9PiB7XG4gICAgaWYgKGUuZGF0YS5ldmVudCA9PT0gXCJzdGFydFwiKSB7XG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiBwb3N0TWVzc2FnZSh7IGV2ZW50OiBcImtlZXBBbGl2ZVwiIH0pLCBlLmRhdGEuaW50ZXJ2YWwpO1xuICAgIH1cbiAgfSk7YDtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWx0aW1lQ2xpZW50IHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgU29ja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGVuZFBvaW50IFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgXCJ3czovL2V4YW1wbGUuY29tL3NvY2tldFwiLCBcIndzczovL2V4YW1wbGUuY29tXCIsIFwiL3NvY2tldFwiIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICAgICAqIEBwYXJhbSBodHRwRW5kcG9pbnQgVGhlIHN0cmluZyBIVFRQIGVuZHBvaW50LCBpZSwgXCJodHRwczovL2V4YW1wbGUuY29tXCIsIFwiL1wiIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICAgICAqIEBwYXJhbSBvcHRpb25zLnRyYW5zcG9ydCBUaGUgV2Vic29ja2V0IFRyYW5zcG9ydCwgZm9yIGV4YW1wbGUgV2ViU29ja2V0LiBUaGlzIGNhbiBiZSBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICAgICAqIEBwYXJhbSBvcHRpb25zLnRpbWVvdXQgVGhlIGRlZmF1bHQgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gdHJpZ2dlciBwdXNoIHRpbWVvdXRzLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLnBhcmFtcyBUaGUgb3B0aW9uYWwgcGFyYW1zIHRvIHBhc3Mgd2hlbiBjb25uZWN0aW5nLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhlYWRlcnMgRGVwcmVjYXRlZDogaGVhZGVycyBjYW5ub3QgYmUgc2V0IG9uIHdlYnNvY2tldCBjb25uZWN0aW9ucyBhbmQgdGhpcyBvcHRpb24gd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGVhcnRiZWF0SW50ZXJ2YWxNcyBUaGUgbWlsbGlzZWMgaW50ZXJ2YWwgdG8gc2VuZCBhIGhlYXJ0YmVhdCBtZXNzYWdlLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmxvZ2dlciBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHNwZWNpYWxpemVkIGxvZ2dpbmcsIGllOiBsb2dnZXI6IChraW5kLCBtc2csIGRhdGEpID0+IHsgY29uc29sZS5sb2coYCR7a2luZH06ICR7bXNnfWAsIGRhdGEpIH1cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5sb2dMZXZlbCBTZXRzIHRoZSBsb2cgbGV2ZWwgZm9yIFJlYWx0aW1lXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZW5jb2RlIFRoZSBmdW5jdGlvbiB0byBlbmNvZGUgb3V0Z29pbmcgbWVzc2FnZXMuIERlZmF1bHRzIHRvIEpTT046IChwYXlsb2FkLCBjYWxsYmFjaykgPT4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZGVjb2RlIFRoZSBmdW5jdGlvbiB0byBkZWNvZGUgaW5jb21pbmcgbWVzc2FnZXMuIERlZmF1bHRzIHRvIFNlcmlhbGl6ZXIncyBkZWNvZGUuXG4gICAgICogQHBhcmFtIG9wdGlvbnMucmVjb25uZWN0QWZ0ZXJNcyBoZSBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG1pbGxzZWMgcmVjb25uZWN0IGludGVydmFsLiBEZWZhdWx0cyB0byBzdGVwcGVkIGJhY2tvZmYgb2ZmLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLndvcmtlciBVc2UgV2ViIFdvcmtlciB0byBzZXQgYSBzaWRlIGZsb3cuIERlZmF1bHRzIHRvIGZhbHNlLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLndvcmtlclVybCBUaGUgVVJMIG9mIHRoZSB3b3JrZXIgc2NyaXB0LiBEZWZhdWx0cyB0byBodHRwczovL3JlYWx0aW1lLnN1cGFiYXNlLmNvbS93b3JrZXIuanMgdGhhdCBpbmNsdWRlcyBhIGhlYXJ0YmVhdCBldmVudCBjYWxsIHRvIGtlZXAgdGhlIGNvbm5lY3Rpb24gYWxpdmUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZW5kUG9pbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuVmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLmFwaUtleSA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9ICcnO1xuICAgICAgICB0aGlzLmh0dHBFbmRwb2ludCA9ICcnO1xuICAgICAgICAvKiogQGRlcHJlY2F0ZWQgaGVhZGVycyBjYW5ub3QgYmUgc2V0IG9uIHdlYnNvY2tldCBjb25uZWN0aW9ucyAqL1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSB7fTtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gREVGQVVMVF9USU1FT1VUO1xuICAgICAgICB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMgPSAyNTAwMDtcbiAgICAgICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbDtcbiAgICAgICAgdGhpcy5oZWFydGJlYXRDYWxsYmFjayA9IG5vb3A7XG4gICAgICAgIHRoaXMucmVmID0gMDtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBub29wO1xuICAgICAgICB0aGlzLmNvbm4gPSBudWxsO1xuICAgICAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXTtcbiAgICAgICAgdGhpcy5zZXJpYWxpemVyID0gbmV3IFNlcmlhbGl6ZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcyA9IHtcbiAgICAgICAgICAgIG9wZW46IFtdLFxuICAgICAgICAgICAgY2xvc2U6IFtdLFxuICAgICAgICAgICAgZXJyb3I6IFtdLFxuICAgICAgICAgICAgbWVzc2FnZTogW10sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVXNlIGVpdGhlciBjdXN0b20gZmV0Y2gsIGlmIHByb3ZpZGVkLCBvciBkZWZhdWx0IGZldGNoIHRvIG1ha2UgSFRUUCByZXF1ZXN0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3Jlc29sdmVGZXRjaCA9IChjdXN0b21GZXRjaCkgPT4ge1xuICAgICAgICAgICAgbGV0IF9mZXRjaDtcbiAgICAgICAgICAgIGlmIChjdXN0b21GZXRjaCkge1xuICAgICAgICAgICAgICAgIF9mZXRjaCA9IGN1c3RvbUZldGNoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGZldGNoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIF9mZXRjaCA9ICguLi5hcmdzKSA9PiBpbXBvcnQoJ0BzdXBhYmFzZS9ub2RlLWZldGNoJykudGhlbigoeyBkZWZhdWx0OiBmZXRjaCB9KSA9PiBmZXRjaCguLi5hcmdzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfZmV0Y2ggPSBmZXRjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4gX2ZldGNoKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVuZFBvaW50ID0gYCR7ZW5kUG9pbnR9LyR7VFJBTlNQT1JUUy53ZWJzb2NrZXR9YDtcbiAgICAgICAgdGhpcy5odHRwRW5kcG9pbnQgPSBodHRwRW5kcG9pbnRVUkwoZW5kUG9pbnQpO1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnRyYW5zcG9ydCkge1xuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQgPSBvcHRpb25zLnRyYW5zcG9ydDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnBhcmFtcylcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gb3B0aW9ucy5wYXJhbXM7XG4gICAgICAgIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMudGltZW91dClcbiAgICAgICAgICAgIHRoaXMudGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5sb2dnZXIpXG4gICAgICAgICAgICB0aGlzLmxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyO1xuICAgICAgICBpZiAoKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5sb2dMZXZlbCkgfHwgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5sb2dfbGV2ZWwpKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ0xldmVsID0gb3B0aW9ucy5sb2dMZXZlbCB8fCBvcHRpb25zLmxvZ19sZXZlbDtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB0aGlzLnBhcmFtcyksIHsgbG9nX2xldmVsOiB0aGlzLmxvZ0xldmVsIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgICAgICAgICAgIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcyA9IG9wdGlvbnMuaGVhcnRiZWF0SW50ZXJ2YWxNcztcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW5WYWx1ZSA9IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5wYXJhbXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hcGlrZXk7XG4gICAgICAgIGlmIChhY2Nlc3NUb2tlblZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuVmFsdWUgPSBhY2Nlc3NUb2tlblZhbHVlO1xuICAgICAgICAgICAgdGhpcy5hcGlLZXkgPSBhY2Nlc3NUb2tlblZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb25uZWN0QWZ0ZXJNcyA9IChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMucmVjb25uZWN0QWZ0ZXJNcylcbiAgICAgICAgICAgID8gb3B0aW9ucy5yZWNvbm5lY3RBZnRlck1zXG4gICAgICAgICAgICA6ICh0cmllcykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMCwgMTAwMDBdW3RyaWVzIC0gMV0gfHwgMTAwMDA7XG4gICAgICAgICAgICB9O1xuICAgICAgICB0aGlzLmVuY29kZSA9IChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZW5jb2RlKVxuICAgICAgICAgICAgPyBvcHRpb25zLmVuY29kZVxuICAgICAgICAgICAgOiAocGF5bG9hZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWNvZGUgPSAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmRlY29kZSlcbiAgICAgICAgICAgID8gb3B0aW9ucy5kZWNvZGVcbiAgICAgICAgICAgIDogdGhpcy5zZXJpYWxpemVyLmRlY29kZS5iaW5kKHRoaXMuc2VyaWFsaXplcik7XG4gICAgICAgIHRoaXMucmVjb25uZWN0VGltZXIgPSBuZXcgVGltZXIoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICAgICAgfSwgdGhpcy5yZWNvbm5lY3RBZnRlck1zKTtcbiAgICAgICAgdGhpcy5mZXRjaCA9IHRoaXMuX3Jlc29sdmVGZXRjaChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZmV0Y2gpO1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLndvcmtlcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICF3aW5kb3cuV29ya2VyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXZWIgV29ya2VyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMud29ya2VyID0gKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy53b3JrZXIpIHx8IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy53b3JrZXJVcmwgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMud29ya2VyVXJsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmFjY2Vzc1Rva2VuKSB8fCBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb25uZWN0cyB0aGUgc29ja2V0LCB1bmxlc3MgYWxyZWFkeSBjb25uZWN0ZWQuXG4gICAgICovXG4gICAgY29ubmVjdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29ubikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy50cmFuc3BvcnQpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0ID0gV2ViU29ja2V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy50cmFuc3BvcnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdHJhbnNwb3J0IHByb3ZpZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25uID0gbmV3IHRoaXMudHJhbnNwb3J0KHRoaXMuZW5kcG9pbnRVUkwoKSk7XG4gICAgICAgIHRoaXMuc2V0dXBDb25uZWN0aW9uKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIFVSTCBvZiB0aGUgd2Vic29ja2V0LlxuICAgICAqIEByZXR1cm5zIHN0cmluZyBUaGUgVVJMIG9mIHRoZSB3ZWJzb2NrZXQuXG4gICAgICovXG4gICAgZW5kcG9pbnRVUkwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBlbmRQYXJhbXModGhpcy5lbmRQb2ludCwgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXJhbXMsIHsgdnNuOiBWU04gfSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0cyB0aGUgc29ja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvZGUgQSBudW1lcmljIHN0YXR1cyBjb2RlIHRvIHNlbmQgb24gZGlzY29ubmVjdC5cbiAgICAgKiBAcGFyYW0gcmVhc29uIEEgY3VzdG9tIHJlYXNvbiBmb3IgdGhlIGRpc2Nvbm5lY3QuXG4gICAgICovXG4gICAgZGlzY29ubmVjdChjb2RlLCByZWFzb24pIHtcbiAgICAgICAgaWYgKHRoaXMuY29ubikge1xuICAgICAgICAgICAgdGhpcy5jb25uLm9uY2xvc2UgPSBmdW5jdGlvbiAoKSB7IH07IC8vIG5vb3BcbiAgICAgICAgICAgIGlmIChjb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uLmNsb3NlKGNvZGUsIHJlYXNvbiAhPT0gbnVsbCAmJiByZWFzb24gIT09IHZvaWQgMCA/IHJlYXNvbiA6ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubi5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb25uID0gbnVsbDtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBvcGVuIGhhbmRsZXNcbiAgICAgICAgICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgJiYgY2xlYXJJbnRlcnZhbCh0aGlzLmhlYXJ0YmVhdFRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCkgPT4gY2hhbm5lbC50ZWFyZG93bigpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFsbCBjcmVhdGVkIGNoYW5uZWxzXG4gICAgICovXG4gICAgZ2V0Q2hhbm5lbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWxzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZXMgYW5kIHJlbW92ZXMgYSBzaW5nbGUgY2hhbm5lbFxuICAgICAqIEBwYXJhbSBjaGFubmVsIEEgUmVhbHRpbWVDaGFubmVsIGluc3RhbmNlXG4gICAgICovXG4gICAgYXN5bmMgcmVtb3ZlQ2hhbm5lbChjaGFubmVsKSB7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IGNoYW5uZWwudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgaWYgKHRoaXMuY2hhbm5lbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZXMgYW5kIHJlbW92ZXMgYWxsIGNoYW5uZWxzXG4gICAgICovXG4gICAgYXN5bmMgcmVtb3ZlQWxsQ2hhbm5lbHMoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlc18xID0gYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5jaGFubmVscy5tYXAoKGNoYW5uZWwpID0+IGNoYW5uZWwudW5zdWJzY3JpYmUoKSkpO1xuICAgICAgICB0aGlzLmNoYW5uZWxzID0gW107XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICByZXR1cm4gdmFsdWVzXzE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExvZ3MgdGhlIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBGb3IgY3VzdG9taXplZCBsb2dnaW5nLCBgdGhpcy5sb2dnZXJgIGNhbiBiZSBvdmVycmlkZGVuLlxuICAgICAqL1xuICAgIGxvZyhraW5kLCBtc2csIGRhdGEpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIoa2luZCwgbXNnLCBkYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgc29ja2V0LlxuICAgICAqL1xuICAgIGNvbm5lY3Rpb25TdGF0ZSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nOlxuICAgICAgICAgICAgICAgIHJldHVybiBDT05ORUNUSU9OX1NUQVRFLkNvbm5lY3Rpbmc7XG4gICAgICAgICAgICBjYXNlIFNPQ0tFVF9TVEFURVMub3BlbjpcbiAgICAgICAgICAgICAgICByZXR1cm4gQ09OTkVDVElPTl9TVEFURS5PcGVuO1xuICAgICAgICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNsb3Npbmc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIENPTk5FQ1RJT05fU1RBVEUuQ2xvc2luZztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIENPTk5FQ1RJT05fU1RBVEUuQ2xvc2VkO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlzIHRoZSBjb25uZWN0aW9uIGlzIG9wZW4uXG4gICAgICovXG4gICAgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25TdGF0ZSgpID09PSBDT05ORUNUSU9OX1NUQVRFLk9wZW47XG4gICAgfVxuICAgIGNoYW5uZWwodG9waWMsIHBhcmFtcyA9IHsgY29uZmlnOiB7fSB9KSB7XG4gICAgICAgIGNvbnN0IHJlYWx0aW1lVG9waWMgPSBgcmVhbHRpbWU6JHt0b3BpY31gO1xuICAgICAgICBjb25zdCBleGlzdHMgPSB0aGlzLmdldENoYW5uZWxzKCkuZmluZCgoYykgPT4gYy50b3BpYyA9PT0gcmVhbHRpbWVUb3BpYyk7XG4gICAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFuID0gbmV3IFJlYWx0aW1lQ2hhbm5lbChgcmVhbHRpbWU6JHt0b3BpY31gLCBwYXJhbXMsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW4pO1xuICAgICAgICAgICAgcmV0dXJuIGNoYW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RzO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFB1c2ggb3V0IGEgbWVzc2FnZSBpZiB0aGUgc29ja2V0IGlzIGNvbm5lY3RlZC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBzb2NrZXQgaXMgbm90IGNvbm5lY3RlZCwgdGhlIG1lc3NhZ2UgZ2V0cyBlbnF1ZXVlZCB3aXRoaW4gYSBsb2NhbCBidWZmZXIsIGFuZCBzZW50IG91dCB3aGVuIGEgY29ubmVjdGlvbiBpcyBuZXh0IGVzdGFibGlzaGVkLlxuICAgICAqL1xuICAgIHB1c2goZGF0YSkge1xuICAgICAgICBjb25zdCB7IHRvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmIH0gPSBkYXRhO1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW5jb2RlKGRhdGEsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gdGhpcy5jb25uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2VuZChyZXN1bHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubG9nKCdwdXNoJywgYCR7dG9waWN9ICR7ZXZlbnR9ICgke3JlZn0pYCwgcGF5bG9hZCk7XG4gICAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbmRCdWZmZXIucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgSldUIGFjY2VzcyB0b2tlbiB1c2VkIGZvciBjaGFubmVsIHN1YnNjcmlwdGlvbiBhdXRob3JpemF0aW9uIGFuZCBSZWFsdGltZSBSTFMuXG4gICAgICpcbiAgICAgKiBJZiBwYXJhbSBpcyBudWxsIGl0IHdpbGwgdXNlIHRoZSBgYWNjZXNzVG9rZW5gIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIHRoZSB0b2tlbiBzZXQgb24gdGhlIGNsaWVudC5cbiAgICAgKlxuICAgICAqIE9uIGNhbGxiYWNrIHVzZWQsIGl0IHdpbGwgc2V0IHRoZSB2YWx1ZSBvZiB0aGUgdG9rZW4gaW50ZXJuYWwgdG8gdGhlIGNsaWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0b2tlbiBBIEpXVCBzdHJpbmcgdG8gb3ZlcnJpZGUgdGhlIHRva2VuIHNldCBvbiB0aGUgY2xpZW50LlxuICAgICAqL1xuICAgIGFzeW5jIHNldEF1dGgodG9rZW4gPSBudWxsKSB7XG4gICAgICAgIGxldCB0b2tlblRvU2VuZCA9IHRva2VuIHx8XG4gICAgICAgICAgICAodGhpcy5hY2Nlc3NUb2tlbiAmJiAoYXdhaXQgdGhpcy5hY2Nlc3NUb2tlbigpKSkgfHxcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW5WYWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW5WYWx1ZSAhPSB0b2tlblRvU2VuZCkge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblZhbHVlID0gdG9rZW5Ub1NlbmQ7XG4gICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmZvckVhY2goKGNoYW5uZWwpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBERUZBVUxUX1ZFUlNJT04sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0b2tlblRvU2VuZCAmJiBjaGFubmVsLnVwZGF0ZUpvaW5QYXlsb2FkKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFubmVsLmpvaW5lZE9uY2UgJiYgY2hhbm5lbC5faXNKb2luZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBjaGFubmVsLl9wdXNoKENIQU5ORUxfRVZFTlRTLmFjY2Vzc190b2tlbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblRvU2VuZCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBoZWFydGJlYXQgbWVzc2FnZSBpZiB0aGUgc29ja2V0IGlzIGNvbm5lY3RlZC5cbiAgICAgKi9cbiAgICBhc3luYyBzZW5kSGVhcnRiZWF0KCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmhlYXJ0YmVhdENhbGxiYWNrKCdkaXNjb25uZWN0ZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKSB7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5sb2coJ3RyYW5zcG9ydCcsICdoZWFydGJlYXQgdGltZW91dC4gQXR0ZW1wdGluZyB0byByZS1lc3RhYmxpc2ggY29ubmVjdGlvbicpO1xuICAgICAgICAgICAgdGhpcy5oZWFydGJlYXRDYWxsYmFjaygndGltZW91dCcpO1xuICAgICAgICAgICAgKF9hID0gdGhpcy5jb25uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2xvc2UoV1NfQ0xPU0VfTk9STUFMLCAnaGVhcmJlYXQgdGltZW91dCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IHRoaXMuX21ha2VSZWYoKTtcbiAgICAgICAgdGhpcy5wdXNoKHtcbiAgICAgICAgICAgIHRvcGljOiAncGhvZW5peCcsXG4gICAgICAgICAgICBldmVudDogJ2hlYXJ0YmVhdCcsXG4gICAgICAgICAgICBwYXlsb2FkOiB7fSxcbiAgICAgICAgICAgIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oZWFydGJlYXRDYWxsYmFjaygnc2VudCcpO1xuICAgICAgICBhd2FpdCB0aGlzLnNldEF1dGgoKTtcbiAgICB9XG4gICAgb25IZWFydGJlYXQoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5oZWFydGJlYXRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGbHVzaGVzIHNlbmQgYnVmZmVyXG4gICAgICovXG4gICAgZmx1c2hTZW5kQnVmZmVyKCkge1xuICAgICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuc2VuZEJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnNlbmRCdWZmZXIuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpO1xuICAgICAgICAgICAgdGhpcy5zZW5kQnVmZmVyID0gW107XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIF9tYWtlUmVmKCkge1xuICAgICAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYgKyAxO1xuICAgICAgICBpZiAobmV3UmVmID09PSB0aGlzLnJlZikge1xuICAgICAgICAgICAgdGhpcy5yZWYgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWYgPSBuZXdSZWY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVmLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlIGZyb20gY2hhbm5lbHMgd2l0aCB0aGUgc3BlY2lmaWVkIHRvcGljLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX2xlYXZlT3BlblRvcGljKHRvcGljKSB7XG4gICAgICAgIGxldCBkdXBDaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKChjKSA9PiBjLnRvcGljID09PSB0b3BpYyAmJiAoYy5faXNKb2luZWQoKSB8fCBjLl9pc0pvaW5pbmcoKSkpO1xuICAgICAgICBpZiAoZHVwQ2hhbm5lbCkge1xuICAgICAgICAgICAgdGhpcy5sb2coJ3RyYW5zcG9ydCcsIGBsZWF2aW5nIGR1cGxpY2F0ZSB0b3BpYyBcIiR7dG9waWN9XCJgKTtcbiAgICAgICAgICAgIGR1cENoYW5uZWwudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgc3Vic2NyaXB0aW9uIGZyb20gdGhlIHNvY2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGFubmVsIEFuIG9wZW4gc3Vic2NyaXB0aW9uLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgX3JlbW92ZShjaGFubmVsKSB7XG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzLmZpbHRlcigoYykgPT4gYy50b3BpYyAhPT0gY2hhbm5lbC50b3BpYyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdXAgY29ubmVjdGlvbiBoYW5kbGVycy5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHNldHVwQ29ubmVjdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuY29ubikge1xuICAgICAgICAgICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgICAgICAgdGhpcy5jb25uLm9ub3BlbiA9ICgpID0+IHRoaXMuX29uQ29ubk9wZW4oKTtcbiAgICAgICAgICAgIHRoaXMuY29ubi5vbmVycm9yID0gKGVycm9yKSA9PiB0aGlzLl9vbkNvbm5FcnJvcihlcnJvcik7XG4gICAgICAgICAgICB0aGlzLmNvbm4ub25tZXNzYWdlID0gKGV2ZW50KSA9PiB0aGlzLl9vbkNvbm5NZXNzYWdlKGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMuY29ubi5vbmNsb3NlID0gKGV2ZW50KSA9PiB0aGlzLl9vbkNvbm5DbG9zZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9vbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5kZWNvZGUocmF3TWVzc2FnZS5kYXRhLCAobXNnKSA9PiB7XG4gICAgICAgICAgICBsZXQgeyB0b3BpYywgZXZlbnQsIHBheWxvYWQsIHJlZiB9ID0gbXNnO1xuICAgICAgICAgICAgaWYgKHRvcGljID09PSAncGhvZW5peCcgJiYgZXZlbnQgPT09ICdwaHhfcmVwbHknKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFydGJlYXRDYWxsYmFjayhtc2cucGF5bG9hZC5zdGF0dXMgPT0gJ29rJyA/ICdvaycgOiAnZXJyb3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWYgJiYgcmVmID09PSB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sb2coJ3JlY2VpdmUnLCBgJHtwYXlsb2FkLnN0YXR1cyB8fCAnJ30gJHt0b3BpY30gJHtldmVudH0gJHsocmVmICYmICcoJyArIHJlZiArICcpJykgfHwgJyd9YCwgcGF5bG9hZCk7XG4gICAgICAgICAgICBBcnJheS5mcm9tKHRoaXMuY2hhbm5lbHMpXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoY2hhbm5lbCkgPT4gY2hhbm5lbC5faXNNZW1iZXIodG9waWMpKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChjaGFubmVsKSA9PiBjaGFubmVsLl90cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYpKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2sobXNnKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX29uQ29ubk9wZW4oKSB7XG4gICAgICAgIHRoaXMubG9nKCd0cmFuc3BvcnQnLCBgY29ubmVjdGVkIHRvICR7dGhpcy5lbmRwb2ludFVSTCgpfWApO1xuICAgICAgICB0aGlzLmZsdXNoU2VuZEJ1ZmZlcigpO1xuICAgICAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KCk7XG4gICAgICAgIGlmICghdGhpcy53b3JrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0SGVhcnRiZWF0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMud29ya2VyUmVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnRXb3JrZXJIZWFydGJlYXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4uZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpO1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgX3N0YXJ0SGVhcnRiZWF0KCkge1xuICAgICAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyICYmIGNsZWFySW50ZXJ2YWwodGhpcy5oZWFydGJlYXRUaW1lcik7XG4gICAgICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIF9zdGFydFdvcmtlckhlYXJ0YmVhdCgpIHtcbiAgICAgICAgaWYgKHRoaXMud29ya2VyVXJsKSB7XG4gICAgICAgICAgICB0aGlzLmxvZygnd29ya2VyJywgYHN0YXJ0aW5nIHdvcmtlciBmb3IgZnJvbSAke3RoaXMud29ya2VyVXJsfWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2coJ3dvcmtlcicsIGBzdGFydGluZyBkZWZhdWx0IHdvcmtlcmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9iamVjdFVybCA9IHRoaXMuX3dvcmtlck9iamVjdFVybCh0aGlzLndvcmtlclVybCk7XG4gICAgICAgIHRoaXMud29ya2VyUmVmID0gbmV3IFdvcmtlcihvYmplY3RVcmwpO1xuICAgICAgICB0aGlzLndvcmtlclJlZi5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZygnd29ya2VyJywgJ3dvcmtlciBlcnJvcicsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy53b3JrZXJSZWYudGVybWluYXRlKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud29ya2VyUmVmLm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRhdGEuZXZlbnQgPT09ICdrZWVwQWxpdmUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kSGVhcnRiZWF0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud29ya2VyUmVmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RhcnQnLFxuICAgICAgICAgICAgaW50ZXJ2YWw6IHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfb25Db25uQ2xvc2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5sb2coJ3RyYW5zcG9ydCcsICdjbG9zZScsIGV2ZW50KTtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckNoYW5FcnJvcigpO1xuICAgICAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyICYmIGNsZWFySW50ZXJ2YWwodGhpcy5oZWFydGJlYXRUaW1lcik7XG4gICAgICAgIHRoaXMucmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCk7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKGV2ZW50KSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfb25Db25uRXJyb3IoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5sb2coJ3RyYW5zcG9ydCcsIGAke2Vycm9yfWApO1xuICAgICAgICB0aGlzLl90cmlnZ2VyQ2hhbkVycm9yKCk7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKGVycm9yKSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfdHJpZ2dlckNoYW5FcnJvcigpIHtcbiAgICAgICAgdGhpcy5jaGFubmVscy5mb3JFYWNoKChjaGFubmVsKSA9PiBjaGFubmVsLl90cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmVycm9yKSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBfYXBwZW5kUGFyYW1zKHVybCwgcGFyYW1zKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmVmaXggPSB1cmwubWF0Y2goL1xcPy8pID8gJyYnIDogJz8nO1xuICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIGAke3VybH0ke3ByZWZpeH0ke3F1ZXJ5fWA7XG4gICAgfVxuICAgIF93b3JrZXJPYmplY3RVcmwodXJsKSB7XG4gICAgICAgIGxldCByZXN1bHRfdXJsO1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXN1bHRfdXJsID0gdXJsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtXT1JLRVJfU0NSSVBUXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSk7XG4gICAgICAgICAgICByZXN1bHRfdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0X3VybDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZWFsdGltZUNsaWVudC5qcy5tYXAiLCJleHBvcnQgY2xhc3MgU3RvcmFnZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuX19pc1N0b3JhZ2VFcnJvciA9IHRydWU7XG4gICAgICAgIHRoaXMubmFtZSA9ICdTdG9yYWdlRXJyb3InO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1N0b3JhZ2VFcnJvcihlcnJvcikge1xuICAgIHJldHVybiB0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnICYmIGVycm9yICE9PSBudWxsICYmICdfX2lzU3RvcmFnZUVycm9yJyBpbiBlcnJvcjtcbn1cbmV4cG9ydCBjbGFzcyBTdG9yYWdlQXBpRXJyb3IgZXh0ZW5kcyBTdG9yYWdlRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHN0YXR1cykge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ1N0b3JhZ2VBcGlFcnJvcic7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICAgICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdG9yYWdlVW5rbm93bkVycm9yIGV4dGVuZHMgU3RvcmFnZUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBvcmlnaW5hbEVycm9yKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSAnU3RvcmFnZVVua25vd25FcnJvcic7XG4gICAgICAgIHRoaXMub3JpZ2luYWxFcnJvciA9IG9yaWdpbmFsRXJyb3I7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3JzLmpzLm1hcCIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0IHJlc29sdmVGZXRjaCA9IChjdXN0b21GZXRjaCkgPT4ge1xuICAgIGxldCBfZmV0Y2g7XG4gICAgaWYgKGN1c3RvbUZldGNoKSB7XG4gICAgICAgIF9mZXRjaCA9IGN1c3RvbUZldGNoO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZmV0Y2ggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9mZXRjaCA9ICguLi5hcmdzKSA9PiBpbXBvcnQoJ0BzdXBhYmFzZS9ub2RlLWZldGNoJykudGhlbigoeyBkZWZhdWx0OiBmZXRjaCB9KSA9PiBmZXRjaCguLi5hcmdzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBfZmV0Y2ggPSBmZXRjaDtcbiAgICB9XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiBfZmV0Y2goLi4uYXJncyk7XG59O1xuZXhwb3J0IGNvbnN0IHJlc29sdmVSZXNwb25zZSA9ICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGlmICh0eXBlb2YgUmVzcG9uc2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuICh5aWVsZCBpbXBvcnQoJ0BzdXBhYmFzZS9ub2RlLWZldGNoJykpLlJlc3BvbnNlO1xuICAgIH1cbiAgICByZXR1cm4gUmVzcG9uc2U7XG59KTtcbmV4cG9ydCBjb25zdCByZWN1cnNpdmVUb0NhbWVsID0gKGl0ZW0pID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbS5tYXAoKGVsKSA9PiByZWN1cnNpdmVUb0NhbWVsKGVsKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnZnVuY3Rpb24nIHx8IGl0ZW0gIT09IE9iamVjdChpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgT2JqZWN0LmVudHJpZXMoaXRlbSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0tleSA9IGtleS5yZXBsYWNlKC8oWy1fXVthLXpdKS9naSwgKGMpID0+IGMudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9bLV9dL2csICcnKSk7XG4gICAgICAgIHJlc3VsdFtuZXdLZXldID0gcmVjdXJzaXZlVG9DYW1lbCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWxwZXJzLmpzLm1hcCIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgU3RvcmFnZUFwaUVycm9yLCBTdG9yYWdlVW5rbm93bkVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IHsgcmVzb2x2ZVJlc3BvbnNlIH0gZnJvbSAnLi9oZWxwZXJzJztcbmNvbnN0IF9nZXRFcnJvck1lc3NhZ2UgPSAoZXJyKSA9PiBlcnIubXNnIHx8IGVyci5tZXNzYWdlIHx8IGVyci5lcnJvcl9kZXNjcmlwdGlvbiB8fCBlcnIuZXJyb3IgfHwgSlNPTi5zdHJpbmdpZnkoZXJyKTtcbmNvbnN0IGhhbmRsZUVycm9yID0gKGVycm9yLCByZWplY3QsIG9wdGlvbnMpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGNvbnN0IFJlcyA9IHlpZWxkIHJlc29sdmVSZXNwb25zZSgpO1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFJlcyAmJiAhKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5ub1Jlc29sdmVKc29uKSkge1xuICAgICAgICBlcnJvclxuICAgICAgICAgICAgLmpzb24oKVxuICAgICAgICAgICAgLnRoZW4oKGVycikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBTdG9yYWdlQXBpRXJyb3IoX2dldEVycm9yTWVzc2FnZShlcnIpLCBlcnJvci5zdGF0dXMgfHwgNTAwKSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBTdG9yYWdlVW5rbm93bkVycm9yKF9nZXRFcnJvck1lc3NhZ2UoZXJyKSwgZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG5ldyBTdG9yYWdlVW5rbm93bkVycm9yKF9nZXRFcnJvck1lc3NhZ2UoZXJyb3IpLCBlcnJvcikpO1xuICAgIH1cbn0pO1xuY29uc3QgX2dldFJlcXVlc3RQYXJhbXMgPSAobWV0aG9kLCBvcHRpb25zLCBwYXJhbWV0ZXJzLCBib2R5KSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0geyBtZXRob2QsIGhlYWRlcnM6IChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaGVhZGVycykgfHwge30gfTtcbiAgICBpZiAobWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cbiAgICBwYXJhbXMuaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sIG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5oZWFkZXJzKTtcbiAgICBpZiAoYm9keSkge1xuICAgICAgICBwYXJhbXMuYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwYXJhbXMpLCBwYXJhbWV0ZXJzKTtcbn07XG5mdW5jdGlvbiBfaGFuZGxlUmVxdWVzdChmZXRjaGVyLCBtZXRob2QsIHVybCwgb3B0aW9ucywgcGFyYW1ldGVycywgYm9keSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmZXRjaGVyKHVybCwgX2dldFJlcXVlc3RQYXJhbXMobWV0aG9kLCBvcHRpb25zLCBwYXJhbWV0ZXJzLCBib2R5KSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQub2spXG4gICAgICAgICAgICAgICAgICAgIHRocm93IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLm5vUmVzb2x2ZUpzb24pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5qc29uKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiByZXNvbHZlKGRhdGEpKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IGhhbmRsZUVycm9yKGVycm9yLCByZWplY3QsIG9wdGlvbnMpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0KGZldGNoZXIsIHVybCwgb3B0aW9ucywgcGFyYW1ldGVycykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlUmVxdWVzdChmZXRjaGVyLCAnR0VUJywgdXJsLCBvcHRpb25zLCBwYXJhbWV0ZXJzKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwb3N0KGZldGNoZXIsIHVybCwgYm9keSwgb3B0aW9ucywgcGFyYW1ldGVycykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlUmVxdWVzdChmZXRjaGVyLCAnUE9TVCcsIHVybCwgb3B0aW9ucywgcGFyYW1ldGVycywgYm9keSk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gcHV0KGZldGNoZXIsIHVybCwgYm9keSwgb3B0aW9ucywgcGFyYW1ldGVycykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlUmVxdWVzdChmZXRjaGVyLCAnUFVUJywgdXJsLCBvcHRpb25zLCBwYXJhbWV0ZXJzLCBib2R5KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoZWFkKGZldGNoZXIsIHVybCwgb3B0aW9ucywgcGFyYW1ldGVycykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlUmVxdWVzdChmZXRjaGVyLCAnSEVBRCcsIHVybCwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBub1Jlc29sdmVKc29uOiB0cnVlIH0pLCBwYXJhbWV0ZXJzKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmUoZmV0Y2hlciwgdXJsLCBib2R5LCBvcHRpb25zLCBwYXJhbWV0ZXJzKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgcmV0dXJuIF9oYW5kbGVSZXF1ZXN0KGZldGNoZXIsICdERUxFVEUnLCB1cmwsIG9wdGlvbnMsIHBhcmFtZXRlcnMsIGJvZHkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmV0Y2guanMubWFwIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBpc1N0b3JhZ2VFcnJvciwgU3RvcmFnZUVycm9yLCBTdG9yYWdlVW5rbm93bkVycm9yIH0gZnJvbSAnLi4vbGliL2Vycm9ycyc7XG5pbXBvcnQgeyBnZXQsIGhlYWQsIHBvc3QsIHJlbW92ZSB9IGZyb20gJy4uL2xpYi9mZXRjaCc7XG5pbXBvcnQgeyByZWN1cnNpdmVUb0NhbWVsLCByZXNvbHZlRmV0Y2ggfSBmcm9tICcuLi9saWIvaGVscGVycyc7XG5jb25zdCBERUZBVUxUX1NFQVJDSF9PUFRJT05TID0ge1xuICAgIGxpbWl0OiAxMDAsXG4gICAgb2Zmc2V0OiAwLFxuICAgIHNvcnRCeToge1xuICAgICAgICBjb2x1bW46ICduYW1lJyxcbiAgICAgICAgb3JkZXI6ICdhc2MnLFxuICAgIH0sXG59O1xuY29uc3QgREVGQVVMVF9GSUxFX09QVElPTlMgPSB7XG4gICAgY2FjaGVDb250cm9sOiAnMzYwMCcsXG4gICAgY29udGVudFR5cGU6ICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnLFxuICAgIHVwc2VydDogZmFsc2UsXG59O1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmFnZUZpbGVBcGkge1xuICAgIGNvbnN0cnVjdG9yKHVybCwgaGVhZGVycyA9IHt9LCBidWNrZXRJZCwgZmV0Y2gpIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICAgIHRoaXMuYnVja2V0SWQgPSBidWNrZXRJZDtcbiAgICAgICAgdGhpcy5mZXRjaCA9IHJlc29sdmVGZXRjaChmZXRjaCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwbG9hZHMgYSBmaWxlIHRvIGFuIGV4aXN0aW5nIGJ1Y2tldCBvciByZXBsYWNlcyBhbiBleGlzdGluZyBmaWxlIGF0IHRoZSBzcGVjaWZpZWQgcGF0aCB3aXRoIGEgbmV3IG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXRob2QgSFRUUCBtZXRob2QuXG4gICAgICogQHBhcmFtIHBhdGggVGhlIHJlbGF0aXZlIGZpbGUgcGF0aC4gU2hvdWxkIGJlIG9mIHRoZSBmb3JtYXQgYGZvbGRlci9zdWJmb2xkZXIvZmlsZW5hbWUucG5nYC4gVGhlIGJ1Y2tldCBtdXN0IGFscmVhZHkgZXhpc3QgYmVmb3JlIGF0dGVtcHRpbmcgdG8gdXBsb2FkLlxuICAgICAqIEBwYXJhbSBmaWxlQm9keSBUaGUgYm9keSBvZiB0aGUgZmlsZSB0byBiZSBzdG9yZWQgaW4gdGhlIGJ1Y2tldC5cbiAgICAgKi9cbiAgICB1cGxvYWRPclVwZGF0ZShtZXRob2QsIHBhdGgsIGZpbGVCb2R5LCBmaWxlT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgYm9keTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0ZJTEVfT1BUSU9OUyksIGZpbGVPcHRpb25zKTtcbiAgICAgICAgICAgICAgICBsZXQgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oZWFkZXJzKSwgKG1ldGhvZCA9PT0gJ1BPU1QnICYmIHsgJ3gtdXBzZXJ0JzogU3RyaW5nKG9wdGlvbnMudXBzZXJ0KSB9KSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBvcHRpb25zLm1ldGFkYXRhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgZmlsZUJvZHkgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgYm9keS5hcHBlbmQoJ2NhY2hlQ29udHJvbCcsIG9wdGlvbnMuY2FjaGVDb250cm9sKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5LmFwcGVuZCgnbWV0YWRhdGEnLCB0aGlzLmVuY29kZU1ldGFkYXRhKG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYm9keS5hcHBlbmQoJycsIGZpbGVCb2R5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyAmJiBmaWxlQm9keSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkgPSBmaWxlQm9keTtcbiAgICAgICAgICAgICAgICAgICAgYm9keS5hcHBlbmQoJ2NhY2hlQ29udHJvbCcsIG9wdGlvbnMuY2FjaGVDb250cm9sKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5LmFwcGVuZCgnbWV0YWRhdGEnLCB0aGlzLmVuY29kZU1ldGFkYXRhKG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkgPSBmaWxlQm9keTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1snY2FjaGUtY29udHJvbCddID0gYG1heC1hZ2U9JHtvcHRpb25zLmNhY2hlQ29udHJvbH1gO1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzWydjb250ZW50LXR5cGUnXSA9IG9wdGlvbnMuY29udGVudFR5cGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1sneC1tZXRhZGF0YSddID0gdGhpcy50b0Jhc2U2NCh0aGlzLmVuY29kZU1ldGFkYXRhKG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVPcHRpb25zID09PSBudWxsIHx8IGZpbGVPcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmaWxlT3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGhlYWRlcnMpLCBmaWxlT3B0aW9ucy5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY2xlYW5QYXRoID0gdGhpcy5fcmVtb3ZlRW1wdHlGb2xkZXJzKHBhdGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IF9wYXRoID0gdGhpcy5fZ2V0RmluYWxQYXRoKGNsZWFuUGF0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5mZXRjaChgJHt0aGlzLnVybH0vb2JqZWN0LyR7X3BhdGh9YCwgT2JqZWN0LmFzc2lnbih7IG1ldGhvZCwgYm9keTogYm9keSwgaGVhZGVycyB9LCAoKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5kdXBsZXgpID8geyBkdXBsZXg6IG9wdGlvbnMuZHVwbGV4IH0gOiB7fSkpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IHBhdGg6IGNsZWFuUGF0aCwgaWQ6IGRhdGEuSWQsIGZ1bGxQYXRoOiBkYXRhLktleSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwbG9hZHMgYSBmaWxlIHRvIGFuIGV4aXN0aW5nIGJ1Y2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXRoIFRoZSBmaWxlIHBhdGgsIGluY2x1ZGluZyB0aGUgZmlsZSBuYW1lLiBTaG91bGQgYmUgb2YgdGhlIGZvcm1hdCBgZm9sZGVyL3N1YmZvbGRlci9maWxlbmFtZS5wbmdgLiBUaGUgYnVja2V0IG11c3QgYWxyZWFkeSBleGlzdCBiZWZvcmUgYXR0ZW1wdGluZyB0byB1cGxvYWQuXG4gICAgICogQHBhcmFtIGZpbGVCb2R5IFRoZSBib2R5IG9mIHRoZSBmaWxlIHRvIGJlIHN0b3JlZCBpbiB0aGUgYnVja2V0LlxuICAgICAqL1xuICAgIHVwbG9hZChwYXRoLCBmaWxlQm9keSwgZmlsZU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwbG9hZE9yVXBkYXRlKCdQT1NUJywgcGF0aCwgZmlsZUJvZHksIGZpbGVPcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwbG9hZCBhIGZpbGUgd2l0aCBhIHRva2VuIGdlbmVyYXRlZCBmcm9tIGBjcmVhdGVTaWduZWRVcGxvYWRVcmxgLlxuICAgICAqIEBwYXJhbSBwYXRoIFRoZSBmaWxlIHBhdGgsIGluY2x1ZGluZyB0aGUgZmlsZSBuYW1lLiBTaG91bGQgYmUgb2YgdGhlIGZvcm1hdCBgZm9sZGVyL3N1YmZvbGRlci9maWxlbmFtZS5wbmdgLiBUaGUgYnVja2V0IG11c3QgYWxyZWFkeSBleGlzdCBiZWZvcmUgYXR0ZW1wdGluZyB0byB1cGxvYWQuXG4gICAgICogQHBhcmFtIHRva2VuIFRoZSB0b2tlbiBnZW5lcmF0ZWQgZnJvbSBgY3JlYXRlU2lnbmVkVXBsb2FkVXJsYFxuICAgICAqIEBwYXJhbSBmaWxlQm9keSBUaGUgYm9keSBvZiB0aGUgZmlsZSB0byBiZSBzdG9yZWQgaW4gdGhlIGJ1Y2tldC5cbiAgICAgKi9cbiAgICB1cGxvYWRUb1NpZ25lZFVybChwYXRoLCB0b2tlbiwgZmlsZUJvZHksIGZpbGVPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBjbGVhblBhdGggPSB0aGlzLl9yZW1vdmVFbXB0eUZvbGRlcnMocGF0aCk7XG4gICAgICAgICAgICBjb25zdCBfcGF0aCA9IHRoaXMuX2dldEZpbmFsUGF0aChjbGVhblBhdGgpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh0aGlzLnVybCArIGAvb2JqZWN0L3VwbG9hZC9zaWduLyR7X3BhdGh9YCk7XG4gICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldCgndG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBib2R5O1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgdXBzZXJ0OiBERUZBVUxUX0ZJTEVfT1BUSU9OUy51cHNlcnQgfSwgZmlsZU9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGVhZGVycyksIHsgJ3gtdXBzZXJ0JzogU3RyaW5nKG9wdGlvbnMudXBzZXJ0KSB9KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIGZpbGVCb2R5IGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICAgICAgICAgICAgICBib2R5ID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kKCdjYWNoZUNvbnRyb2wnLCBvcHRpb25zLmNhY2hlQ29udHJvbCk7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kKCcnLCBmaWxlQm9keSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgZmlsZUJvZHkgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBib2R5ID0gZmlsZUJvZHk7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kKCdjYWNoZUNvbnRyb2wnLCBvcHRpb25zLmNhY2hlQ29udHJvbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBib2R5ID0gZmlsZUJvZHk7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbJ2NhY2hlLWNvbnRyb2wnXSA9IGBtYXgtYWdlPSR7b3B0aW9ucy5jYWNoZUNvbnRyb2x9YDtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1snY29udGVudC10eXBlJ10gPSBvcHRpb25zLmNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCB0aGlzLmZldGNoKHVybC50b1N0cmluZygpLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5vaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBwYXRoOiBjbGVhblBhdGgsIGZ1bGxQYXRoOiBkYXRhLktleSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzaWduZWQgdXBsb2FkIFVSTC5cbiAgICAgKiBTaWduZWQgdXBsb2FkIFVSTHMgY2FuIGJlIHVzZWQgdG8gdXBsb2FkIGZpbGVzIHRvIHRoZSBidWNrZXQgd2l0aG91dCBmdXJ0aGVyIGF1dGhlbnRpY2F0aW9uLlxuICAgICAqIFRoZXkgYXJlIHZhbGlkIGZvciAyIGhvdXJzLlxuICAgICAqIEBwYXJhbSBwYXRoIFRoZSBmaWxlIHBhdGgsIGluY2x1ZGluZyB0aGUgY3VycmVudCBmaWxlIG5hbWUuIEZvciBleGFtcGxlIGBmb2xkZXIvaW1hZ2UucG5nYC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy51cHNlcnQgSWYgc2V0IHRvIHRydWUsIGFsbG93cyB0aGUgZmlsZSB0byBiZSBvdmVyd3JpdHRlbiBpZiBpdCBhbHJlYWR5IGV4aXN0cy5cbiAgICAgKi9cbiAgICBjcmVhdGVTaWduZWRVcGxvYWRVcmwocGF0aCwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgX3BhdGggPSB0aGlzLl9nZXRGaW5hbFBhdGgocGF0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy51cHNlcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1sneC11cHNlcnQnXSA9ICd0cnVlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHBvc3QodGhpcy5mZXRjaCwgYCR7dGhpcy51cmx9L29iamVjdC91cGxvYWQvc2lnbi8ke19wYXRofWAsIHt9LCB7IGhlYWRlcnMgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh0aGlzLnVybCArIGRhdGEudXJsKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCd0b2tlbicpO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN0b3JhZ2VFcnJvcignTm8gdG9rZW4gcmV0dXJuZWQgYnkgQVBJJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgc2lnbmVkVXJsOiB1cmwudG9TdHJpbmcoKSwgcGF0aCwgdG9rZW4gfSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChpc1N0b3JhZ2VFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlcyBhbiBleGlzdGluZyBmaWxlIGF0IHRoZSBzcGVjaWZpZWQgcGF0aCB3aXRoIGEgbmV3IG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXRoIFRoZSByZWxhdGl2ZSBmaWxlIHBhdGguIFNob3VsZCBiZSBvZiB0aGUgZm9ybWF0IGBmb2xkZXIvc3ViZm9sZGVyL2ZpbGVuYW1lLnBuZ2AuIFRoZSBidWNrZXQgbXVzdCBhbHJlYWR5IGV4aXN0IGJlZm9yZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZS5cbiAgICAgKiBAcGFyYW0gZmlsZUJvZHkgVGhlIGJvZHkgb2YgdGhlIGZpbGUgdG8gYmUgc3RvcmVkIGluIHRoZSBidWNrZXQuXG4gICAgICovXG4gICAgdXBkYXRlKHBhdGgsIGZpbGVCb2R5LCBmaWxlT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBsb2FkT3JVcGRhdGUoJ1BVVCcsIHBhdGgsIGZpbGVCb2R5LCBmaWxlT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNb3ZlcyBhbiBleGlzdGluZyBmaWxlIHRvIGEgbmV3IHBhdGggaW4gdGhlIHNhbWUgYnVja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGZyb21QYXRoIFRoZSBvcmlnaW5hbCBmaWxlIHBhdGgsIGluY2x1ZGluZyB0aGUgY3VycmVudCBmaWxlIG5hbWUuIEZvciBleGFtcGxlIGBmb2xkZXIvaW1hZ2UucG5nYC5cbiAgICAgKiBAcGFyYW0gdG9QYXRoIFRoZSBuZXcgZmlsZSBwYXRoLCBpbmNsdWRpbmcgdGhlIG5ldyBmaWxlIG5hbWUuIEZvciBleGFtcGxlIGBmb2xkZXIvaW1hZ2UtbmV3LnBuZ2AuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIGRlc3RpbmF0aW9uIG9wdGlvbnMuXG4gICAgICovXG4gICAgbW92ZShmcm9tUGF0aCwgdG9QYXRoLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCBwb3N0KHRoaXMuZmV0Y2gsIGAke3RoaXMudXJsfS9vYmplY3QvbW92ZWAsIHtcbiAgICAgICAgICAgICAgICAgICAgYnVja2V0SWQ6IHRoaXMuYnVja2V0SWQsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUtleTogZnJvbVBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uS2V5OiB0b1BhdGgsXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZGVzdGluYXRpb25CdWNrZXQsXG4gICAgICAgICAgICAgICAgfSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChpc1N0b3JhZ2VFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYW4gZXhpc3RpbmcgZmlsZSB0byBhIG5ldyBwYXRoIGluIHRoZSBzYW1lIGJ1Y2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmcm9tUGF0aCBUaGUgb3JpZ2luYWwgZmlsZSBwYXRoLCBpbmNsdWRpbmcgdGhlIGN1cnJlbnQgZmlsZSBuYW1lLiBGb3IgZXhhbXBsZSBgZm9sZGVyL2ltYWdlLnBuZ2AuXG4gICAgICogQHBhcmFtIHRvUGF0aCBUaGUgbmV3IGZpbGUgcGF0aCwgaW5jbHVkaW5nIHRoZSBuZXcgZmlsZSBuYW1lLiBGb3IgZXhhbXBsZSBgZm9sZGVyL2ltYWdlLWNvcHkucG5nYC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgZGVzdGluYXRpb24gb3B0aW9ucy5cbiAgICAgKi9cbiAgICBjb3B5KGZyb21QYXRoLCB0b1BhdGgsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHBvc3QodGhpcy5mZXRjaCwgYCR7dGhpcy51cmx9L29iamVjdC9jb3B5YCwge1xuICAgICAgICAgICAgICAgICAgICBidWNrZXRJZDogdGhpcy5idWNrZXRJZCxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlS2V5OiBmcm9tUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25LZXk6IHRvUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5kZXN0aW5hdGlvbkJ1Y2tldCxcbiAgICAgICAgICAgICAgICB9LCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHBhdGg6IGRhdGEuS2V5IH0sIGVycm9yOiBudWxsIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdG9yYWdlRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNpZ25lZCBVUkwuIFVzZSBhIHNpZ25lZCBVUkwgdG8gc2hhcmUgYSBmaWxlIGZvciBhIGZpeGVkIGFtb3VudCBvZiB0aW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhdGggVGhlIGZpbGUgcGF0aCwgaW5jbHVkaW5nIHRoZSBjdXJyZW50IGZpbGUgbmFtZS4gRm9yIGV4YW1wbGUgYGZvbGRlci9pbWFnZS5wbmdgLlxuICAgICAqIEBwYXJhbSBleHBpcmVzSW4gVGhlIG51bWJlciBvZiBzZWNvbmRzIHVudGlsIHRoZSBzaWduZWQgVVJMIGV4cGlyZXMuIEZvciBleGFtcGxlLCBgNjBgIGZvciBhIFVSTCB3aGljaCBpcyB2YWxpZCBmb3Igb25lIG1pbnV0ZS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5kb3dubG9hZCB0cmlnZ2VycyB0aGUgZmlsZSBhcyBhIGRvd25sb2FkIGlmIHNldCB0byB0cnVlLiBTZXQgdGhpcyBwYXJhbWV0ZXIgYXMgdGhlIG5hbWUgb2YgdGhlIGZpbGUgaWYgeW91IHdhbnQgdG8gdHJpZ2dlciB0aGUgZG93bmxvYWQgd2l0aCBhIGRpZmZlcmVudCBmaWxlbmFtZS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50cmFuc2Zvcm0gVHJhbnNmb3JtIHRoZSBhc3NldCBiZWZvcmUgc2VydmluZyBpdCB0byB0aGUgY2xpZW50LlxuICAgICAqL1xuICAgIGNyZWF0ZVNpZ25lZFVybChwYXRoLCBleHBpcmVzSW4sIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IF9wYXRoID0gdGhpcy5fZ2V0RmluYWxQYXRoKHBhdGgpO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0geWllbGQgcG9zdCh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vb2JqZWN0L3NpZ24vJHtfcGF0aH1gLCBPYmplY3QuYXNzaWduKHsgZXhwaXJlc0luIH0sICgob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnRyYW5zZm9ybSkgPyB7IHRyYW5zZm9ybTogb3B0aW9ucy50cmFuc2Zvcm0gfSA6IHt9KSksIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRvd25sb2FkUXVlcnlQYXJhbSA9IChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZG93bmxvYWQpXG4gICAgICAgICAgICAgICAgICAgID8gYCZkb3dubG9hZD0ke29wdGlvbnMuZG93bmxvYWQgPT09IHRydWUgPyAnJyA6IG9wdGlvbnMuZG93bmxvYWR9YFxuICAgICAgICAgICAgICAgICAgICA6ICcnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpZ25lZFVybCA9IGVuY29kZVVSSShgJHt0aGlzLnVybH0ke2RhdGEuc2lnbmVkVVJMfSR7ZG93bmxvYWRRdWVyeVBhcmFtfWApO1xuICAgICAgICAgICAgICAgIGRhdGEgPSB7IHNpZ25lZFVybCB9O1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGEsIGVycm9yOiBudWxsIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdG9yYWdlRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBtdWx0aXBsZSBzaWduZWQgVVJMcy4gVXNlIGEgc2lnbmVkIFVSTCB0byBzaGFyZSBhIGZpbGUgZm9yIGEgZml4ZWQgYW1vdW50IG9mIHRpbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGF0aHMgVGhlIGZpbGUgcGF0aHMgdG8gYmUgZG93bmxvYWRlZCwgaW5jbHVkaW5nIHRoZSBjdXJyZW50IGZpbGUgbmFtZXMuIEZvciBleGFtcGxlIGBbJ2ZvbGRlci9pbWFnZS5wbmcnLCAnZm9sZGVyMi9pbWFnZTIucG5nJ11gLlxuICAgICAqIEBwYXJhbSBleHBpcmVzSW4gVGhlIG51bWJlciBvZiBzZWNvbmRzIHVudGlsIHRoZSBzaWduZWQgVVJMcyBleHBpcmUuIEZvciBleGFtcGxlLCBgNjBgIGZvciBVUkxzIHdoaWNoIGFyZSB2YWxpZCBmb3Igb25lIG1pbnV0ZS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5kb3dubG9hZCB0cmlnZ2VycyB0aGUgZmlsZSBhcyBhIGRvd25sb2FkIGlmIHNldCB0byB0cnVlLiBTZXQgdGhpcyBwYXJhbWV0ZXIgYXMgdGhlIG5hbWUgb2YgdGhlIGZpbGUgaWYgeW91IHdhbnQgdG8gdHJpZ2dlciB0aGUgZG93bmxvYWQgd2l0aCBhIGRpZmZlcmVudCBmaWxlbmFtZS5cbiAgICAgKi9cbiAgICBjcmVhdGVTaWduZWRVcmxzKHBhdGhzLCBleHBpcmVzSW4sIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHBvc3QodGhpcy5mZXRjaCwgYCR7dGhpcy51cmx9L29iamVjdC9zaWduLyR7dGhpcy5idWNrZXRJZH1gLCB7IGV4cGlyZXNJbiwgcGF0aHMgfSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZG93bmxvYWRRdWVyeVBhcmFtID0gKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5kb3dubG9hZClcbiAgICAgICAgICAgICAgICAgICAgPyBgJmRvd25sb2FkPSR7b3B0aW9ucy5kb3dubG9hZCA9PT0gdHJ1ZSA/ICcnIDogb3B0aW9ucy5kb3dubG9hZH1gXG4gICAgICAgICAgICAgICAgICAgIDogJyc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5tYXAoKGRhdHVtKSA9PiAoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBkYXR1bSksIHsgc2lnbmVkVXJsOiBkYXR1bS5zaWduZWRVUkxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGVuY29kZVVSSShgJHt0aGlzLnVybH0ke2RhdHVtLnNpZ25lZFVSTH0ke2Rvd25sb2FkUXVlcnlQYXJhbX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCB9KSkpLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERvd25sb2FkcyBhIGZpbGUgZnJvbSBhIHByaXZhdGUgYnVja2V0LiBGb3IgcHVibGljIGJ1Y2tldHMsIG1ha2UgYSByZXF1ZXN0IHRvIHRoZSBVUkwgcmV0dXJuZWQgZnJvbSBgZ2V0UHVibGljVXJsYCBpbnN0ZWFkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBhdGggVGhlIGZ1bGwgcGF0aCBhbmQgZmlsZSBuYW1lIG9mIHRoZSBmaWxlIHRvIGJlIGRvd25sb2FkZWQuIEZvciBleGFtcGxlIGBmb2xkZXIvaW1hZ2UucG5nYC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50cmFuc2Zvcm0gVHJhbnNmb3JtIHRoZSBhc3NldCBiZWZvcmUgc2VydmluZyBpdCB0byB0aGUgY2xpZW50LlxuICAgICAqL1xuICAgIGRvd25sb2FkKHBhdGgsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHdhbnRzVHJhbnNmb3JtYXRpb24gPSB0eXBlb2YgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy50cmFuc2Zvcm0pICE9PSAndW5kZWZpbmVkJztcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlclBhdGggPSB3YW50c1RyYW5zZm9ybWF0aW9uID8gJ3JlbmRlci9pbWFnZS9hdXRoZW50aWNhdGVkJyA6ICdvYmplY3QnO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtYXRpb25RdWVyeSA9IHRoaXMudHJhbnNmb3JtT3B0c1RvUXVlcnlTdHJpbmcoKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy50cmFuc2Zvcm0pIHx8IHt9KTtcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gdHJhbnNmb3JtYXRpb25RdWVyeSA/IGA/JHt0cmFuc2Zvcm1hdGlvblF1ZXJ5fWAgOiAnJztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX3BhdGggPSB0aGlzLl9nZXRGaW5hbFBhdGgocGF0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZ2V0KHRoaXMuZmV0Y2gsIGAke3RoaXMudXJsfS8ke3JlbmRlclBhdGh9LyR7X3BhdGh9JHtxdWVyeVN0cmluZ31gLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgbm9SZXNvbHZlSnNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcmVzLmJsb2IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZGV0YWlscyBvZiBhbiBleGlzdGluZyBmaWxlLlxuICAgICAqIEBwYXJhbSBwYXRoXG4gICAgICovXG4gICAgaW5mbyhwYXRoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBfcGF0aCA9IHRoaXMuX2dldEZpbmFsUGF0aChwYXRoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIGdldCh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vb2JqZWN0L2luZm8vJHtfcGF0aH1gLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiByZWN1cnNpdmVUb0NhbWVsKGRhdGEpLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0aGUgZXhpc3RlbmNlIG9mIGEgZmlsZS5cbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqL1xuICAgIGV4aXN0cyhwYXRoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBfcGF0aCA9IHRoaXMuX2dldEZpbmFsUGF0aChwYXRoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeWllbGQgaGVhZCh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vb2JqZWN0LyR7X3BhdGh9YCwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogdHJ1ZSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChpc1N0b3JhZ2VFcnJvcihlcnJvcikgJiYgZXJyb3IgaW5zdGFuY2VvZiBTdG9yYWdlVW5rbm93bkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsRXJyb3IgPSBlcnJvci5vcmlnaW5hbEVycm9yO1xuICAgICAgICAgICAgICAgICAgICBpZiAoWzQwMCwgNDA0XS5pbmNsdWRlcyhvcmlnaW5hbEVycm9yID09PSBudWxsIHx8IG9yaWdpbmFsRXJyb3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9yaWdpbmFsRXJyb3Iuc3RhdHVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogZmFsc2UsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIHNpbXBsZSBjb252ZW5pZW5jZSBmdW5jdGlvbiB0byBnZXQgdGhlIFVSTCBmb3IgYW4gYXNzZXQgaW4gYSBwdWJsaWMgYnVja2V0LiBJZiB5b3UgZG8gbm90IHdhbnQgdG8gdXNlIHRoaXMgZnVuY3Rpb24sIHlvdSBjYW4gY29uc3RydWN0IHRoZSBwdWJsaWMgVVJMIGJ5IGNvbmNhdGVuYXRpbmcgdGhlIGJ1Y2tldCBVUkwgd2l0aCB0aGUgcGF0aCB0byB0aGUgYXNzZXQuXG4gICAgICogVGhpcyBmdW5jdGlvbiBkb2VzIG5vdCB2ZXJpZnkgaWYgdGhlIGJ1Y2tldCBpcyBwdWJsaWMuIElmIGEgcHVibGljIFVSTCBpcyBjcmVhdGVkIGZvciBhIGJ1Y2tldCB3aGljaCBpcyBub3QgcHVibGljLCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBkb3dubG9hZCB0aGUgYXNzZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCBhbmQgbmFtZSBvZiB0aGUgZmlsZSB0byBnZW5lcmF0ZSB0aGUgcHVibGljIFVSTCBmb3IuIEZvciBleGFtcGxlIGBmb2xkZXIvaW1hZ2UucG5nYC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5kb3dubG9hZCBUcmlnZ2VycyB0aGUgZmlsZSBhcyBhIGRvd25sb2FkIGlmIHNldCB0byB0cnVlLiBTZXQgdGhpcyBwYXJhbWV0ZXIgYXMgdGhlIG5hbWUgb2YgdGhlIGZpbGUgaWYgeW91IHdhbnQgdG8gdHJpZ2dlciB0aGUgZG93bmxvYWQgd2l0aCBhIGRpZmZlcmVudCBmaWxlbmFtZS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50cmFuc2Zvcm0gVHJhbnNmb3JtIHRoZSBhc3NldCBiZWZvcmUgc2VydmluZyBpdCB0byB0aGUgY2xpZW50LlxuICAgICAqL1xuICAgIGdldFB1YmxpY1VybChwYXRoLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IF9wYXRoID0gdGhpcy5fZ2V0RmluYWxQYXRoKHBhdGgpO1xuICAgICAgICBjb25zdCBfcXVlcnlTdHJpbmcgPSBbXTtcbiAgICAgICAgY29uc3QgZG93bmxvYWRRdWVyeVBhcmFtID0gKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5kb3dubG9hZClcbiAgICAgICAgICAgID8gYGRvd25sb2FkPSR7b3B0aW9ucy5kb3dubG9hZCA9PT0gdHJ1ZSA/ICcnIDogb3B0aW9ucy5kb3dubG9hZH1gXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICBpZiAoZG93bmxvYWRRdWVyeVBhcmFtICE9PSAnJykge1xuICAgICAgICAgICAgX3F1ZXJ5U3RyaW5nLnB1c2goZG93bmxvYWRRdWVyeVBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3YW50c1RyYW5zZm9ybWF0aW9uID0gdHlwZW9mIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMudHJhbnNmb3JtKSAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIGNvbnN0IHJlbmRlclBhdGggPSB3YW50c1RyYW5zZm9ybWF0aW9uID8gJ3JlbmRlci9pbWFnZScgOiAnb2JqZWN0JztcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtYXRpb25RdWVyeSA9IHRoaXMudHJhbnNmb3JtT3B0c1RvUXVlcnlTdHJpbmcoKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy50cmFuc2Zvcm0pIHx8IHt9KTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybWF0aW9uUXVlcnkgIT09ICcnKSB7XG4gICAgICAgICAgICBfcXVlcnlTdHJpbmcucHVzaCh0cmFuc2Zvcm1hdGlvblF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcXVlcnlTdHJpbmcgPSBfcXVlcnlTdHJpbmcuam9pbignJicpO1xuICAgICAgICBpZiAocXVlcnlTdHJpbmcgIT09ICcnKSB7XG4gICAgICAgICAgICBxdWVyeVN0cmluZyA9IGA/JHtxdWVyeVN0cmluZ31gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiB7IHB1YmxpY1VybDogZW5jb2RlVVJJKGAke3RoaXMudXJsfS8ke3JlbmRlclBhdGh9L3B1YmxpYy8ke19wYXRofSR7cXVlcnlTdHJpbmd9YCkgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBmaWxlcyB3aXRoaW4gdGhlIHNhbWUgYnVja2V0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGF0aHMgQW4gYXJyYXkgb2YgZmlsZXMgdG8gZGVsZXRlLCBpbmNsdWRpbmcgdGhlIHBhdGggYW5kIGZpbGUgbmFtZS4gRm9yIGV4YW1wbGUgW2AnZm9sZGVyL2ltYWdlLnBuZydgXS5cbiAgICAgKi9cbiAgICByZW1vdmUocGF0aHMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHJlbW92ZSh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vb2JqZWN0LyR7dGhpcy5idWNrZXRJZH1gLCB7IHByZWZpeGVzOiBwYXRocyB9LCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBmaWxlIG1ldGFkYXRhXG4gICAgICogQHBhcmFtIGlkIHRoZSBmaWxlIGlkIHRvIHJldHJpZXZlIG1ldGFkYXRhXG4gICAgICovXG4gICAgLy8gYXN5bmMgZ2V0TWV0YWRhdGEoXG4gICAgLy8gICBpZDogc3RyaW5nXG4gICAgLy8gKTogUHJvbWlzZTxcbiAgICAvLyAgIHwge1xuICAgIC8vICAgICAgIGRhdGE6IE1ldGFkYXRhXG4gICAgLy8gICAgICAgZXJyb3I6IG51bGxcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfCB7XG4gICAgLy8gICAgICAgZGF0YTogbnVsbFxuICAgIC8vICAgICAgIGVycm9yOiBTdG9yYWdlRXJyb3JcbiAgICAvLyAgICAgfVxuICAgIC8vID4ge1xuICAgIC8vICAgdHJ5IHtcbiAgICAvLyAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldCh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vbWV0YWRhdGEvJHtpZH1gLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KVxuICAgIC8vICAgICByZXR1cm4geyBkYXRhLCBlcnJvcjogbnVsbCB9XG4gICAgLy8gICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vICAgICBpZiAoaXNTdG9yYWdlRXJyb3IoZXJyb3IpKSB7XG4gICAgLy8gICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHRocm93IGVycm9yXG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBmaWxlIG1ldGFkYXRhXG4gICAgICogQHBhcmFtIGlkIHRoZSBmaWxlIGlkIHRvIHVwZGF0ZSBtZXRhZGF0YVxuICAgICAqIEBwYXJhbSBtZXRhIHRoZSBuZXcgZmlsZSBtZXRhZGF0YVxuICAgICAqL1xuICAgIC8vIGFzeW5jIHVwZGF0ZU1ldGFkYXRhKFxuICAgIC8vICAgaWQ6IHN0cmluZyxcbiAgICAvLyAgIG1ldGE6IE1ldGFkYXRhXG4gICAgLy8gKTogUHJvbWlzZTxcbiAgICAvLyAgIHwge1xuICAgIC8vICAgICAgIGRhdGE6IE1ldGFkYXRhXG4gICAgLy8gICAgICAgZXJyb3I6IG51bGxcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfCB7XG4gICAgLy8gICAgICAgZGF0YTogbnVsbFxuICAgIC8vICAgICAgIGVycm9yOiBTdG9yYWdlRXJyb3JcbiAgICAvLyAgICAgfVxuICAgIC8vID4ge1xuICAgIC8vICAgdHJ5IHtcbiAgICAvLyAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHBvc3QoXG4gICAgLy8gICAgICAgdGhpcy5mZXRjaCxcbiAgICAvLyAgICAgICBgJHt0aGlzLnVybH0vbWV0YWRhdGEvJHtpZH1gLFxuICAgIC8vICAgICAgIHsgLi4ubWV0YSB9LFxuICAgIC8vICAgICAgIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH1cbiAgICAvLyAgICAgKVxuICAgIC8vICAgICByZXR1cm4geyBkYXRhLCBlcnJvcjogbnVsbCB9XG4gICAgLy8gICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vICAgICBpZiAoaXNTdG9yYWdlRXJyb3IoZXJyb3IpKSB7XG4gICAgLy8gICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHRocm93IGVycm9yXG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8qKlxuICAgICAqIExpc3RzIGFsbCB0aGUgZmlsZXMgd2l0aGluIGEgYnVja2V0LlxuICAgICAqIEBwYXJhbSBwYXRoIFRoZSBmb2xkZXIgcGF0aC5cbiAgICAgKi9cbiAgICBsaXN0KHBhdGgsIG9wdGlvbnMsIHBhcmFtZXRlcnMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFQVJDSF9PUFRJT05TKSwgb3B0aW9ucyksIHsgcHJlZml4OiBwYXRoIHx8ICcnIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCBwb3N0KHRoaXMuZmV0Y2gsIGAke3RoaXMudXJsfS9vYmplY3QvbGlzdC8ke3RoaXMuYnVja2V0SWR9YCwgYm9keSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSwgcGFyYW1ldGVycyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChpc1N0b3JhZ2VFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbmNvZGVNZXRhZGF0YShtZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWV0YWRhdGEpO1xuICAgIH1cbiAgICB0b0Jhc2U2NChkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgQnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGRhdGEpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnRvYShkYXRhKTtcbiAgICB9XG4gICAgX2dldEZpbmFsUGF0aChwYXRoKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmJ1Y2tldElkfS8ke3BhdGh9YDtcbiAgICB9XG4gICAgX3JlbW92ZUVtcHR5Rm9sZGVycyhwYXRoKSB7XG4gICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL15cXC98XFwvJC9nLCAnJykucmVwbGFjZSgvXFwvKy9nLCAnLycpO1xuICAgIH1cbiAgICB0cmFuc2Zvcm1PcHRzVG9RdWVyeVN0cmluZyh0cmFuc2Zvcm0pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gW107XG4gICAgICAgIGlmICh0cmFuc2Zvcm0ud2lkdGgpIHtcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKGB3aWR0aD0ke3RyYW5zZm9ybS53aWR0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhbnNmb3JtLmhlaWdodCkge1xuICAgICAgICAgICAgcGFyYW1zLnB1c2goYGhlaWdodD0ke3RyYW5zZm9ybS5oZWlnaHR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yZXNpemUpIHtcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKGByZXNpemU9JHt0cmFuc2Zvcm0ucmVzaXplfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFuc2Zvcm0uZm9ybWF0KSB7XG4gICAgICAgICAgICBwYXJhbXMucHVzaChgZm9ybWF0PSR7dHJhbnNmb3JtLmZvcm1hdH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhbnNmb3JtLnF1YWxpdHkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKGBxdWFsaXR5PSR7dHJhbnNmb3JtLnF1YWxpdHl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcmFtcy5qb2luKCcmJyk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3RvcmFnZUZpbGVBcGkuanMubWFwIiwiLy8gZ2VuZXJhdGVkIGJ5IGdlbnZlcnNpb25cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJzIuNy4xJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZlcnNpb24uanMubWFwIiwiaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4vdmVyc2lvbic7XG5leHBvcnQgY29uc3QgREVGQVVMVF9IRUFERVJTID0geyAnWC1DbGllbnQtSW5mbyc6IGBzdG9yYWdlLWpzLyR7dmVyc2lvbn1gIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBERUZBVUxUX0hFQURFUlMgfSBmcm9tICcuLi9saWIvY29uc3RhbnRzJztcbmltcG9ydCB7IGlzU3RvcmFnZUVycm9yIH0gZnJvbSAnLi4vbGliL2Vycm9ycyc7XG5pbXBvcnQgeyBnZXQsIHBvc3QsIHB1dCwgcmVtb3ZlIH0gZnJvbSAnLi4vbGliL2ZldGNoJztcbmltcG9ydCB7IHJlc29sdmVGZXRjaCB9IGZyb20gJy4uL2xpYi9oZWxwZXJzJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JhZ2VCdWNrZXRBcGkge1xuICAgIGNvbnN0cnVjdG9yKHVybCwgaGVhZGVycyA9IHt9LCBmZXRjaCkge1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0hFQURFUlMpLCBoZWFkZXJzKTtcbiAgICAgICAgdGhpcy5mZXRjaCA9IHJlc29sdmVGZXRjaChmZXRjaCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZGV0YWlscyBvZiBhbGwgU3RvcmFnZSBidWNrZXRzIHdpdGhpbiBhbiBleGlzdGluZyBwcm9qZWN0LlxuICAgICAqL1xuICAgIGxpc3RCdWNrZXRzKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgZ2V0KHRoaXMuZmV0Y2gsIGAke3RoaXMudXJsfS9idWNrZXRgLCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZGV0YWlscyBvZiBhbiBleGlzdGluZyBTdG9yYWdlIGJ1Y2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBUaGUgdW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGJ1Y2tldCB5b3Ugd291bGQgbGlrZSB0byByZXRyaWV2ZS5cbiAgICAgKi9cbiAgICBnZXRCdWNrZXQoaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIGdldCh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vYnVja2V0LyR7aWR9YCwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChpc1N0b3JhZ2VFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFN0b3JhZ2UgYnVja2V0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGJ1Y2tldCB5b3UgYXJlIGNyZWF0aW5nLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLnB1YmxpYyBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgYnVja2V0LiBQdWJsaWMgYnVja2V0cyBkb24ndCByZXF1aXJlIGFuIGF1dGhvcml6YXRpb24gdG9rZW4gdG8gZG93bmxvYWQgb2JqZWN0cywgYnV0IHN0aWxsIHJlcXVpcmUgYSB2YWxpZCB0b2tlbiBmb3IgYWxsIG90aGVyIG9wZXJhdGlvbnMuIEJ5IGRlZmF1bHQsIGJ1Y2tldHMgYXJlIHByaXZhdGUuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlsZVNpemVMaW1pdCBzcGVjaWZpZXMgdGhlIG1heCBmaWxlIHNpemUgaW4gYnl0ZXMgdGhhdCBjYW4gYmUgdXBsb2FkZWQgdG8gdGhpcyBidWNrZXQuXG4gICAgICogVGhlIGdsb2JhbCBmaWxlIHNpemUgbGltaXQgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHRoaXMgdmFsdWUuXG4gICAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgbnVsbCwgd2hpY2ggZG9lc24ndCBzZXQgYSBwZXIgYnVja2V0IGZpbGUgc2l6ZSBsaW1pdC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hbGxvd2VkTWltZVR5cGVzIHNwZWNpZmllcyB0aGUgYWxsb3dlZCBtaW1lIHR5cGVzIHRoYXQgdGhpcyBidWNrZXQgY2FuIGFjY2VwdCBkdXJpbmcgdXBsb2FkLlxuICAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIG51bGwsIHdoaWNoIGFsbG93cyBmaWxlcyB3aXRoIGFsbCBtaW1lIHR5cGVzIHRvIGJlIHVwbG9hZGVkLlxuICAgICAqIEVhY2ggbWltZSB0eXBlIHNwZWNpZmllZCBjYW4gYmUgYSB3aWxkY2FyZCwgZS5nLiBpbWFnZS8qLCBvciBhIHNwZWNpZmljIG1pbWUgdHlwZSwgZS5nLiBpbWFnZS9wbmcuXG4gICAgICogQHJldHVybnMgbmV3bHkgY3JlYXRlZCBidWNrZXQgaWRcbiAgICAgKi9cbiAgICBjcmVhdGVCdWNrZXQoaWQsIG9wdGlvbnMgPSB7XG4gICAgICAgIHB1YmxpYzogZmFsc2UsXG4gICAgfSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcG9zdCh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vYnVja2V0YCwge1xuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpYzogb3B0aW9ucy5wdWJsaWMsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVfc2l6ZV9saW1pdDogb3B0aW9ucy5maWxlU2l6ZUxpbWl0LFxuICAgICAgICAgICAgICAgICAgICBhbGxvd2VkX21pbWVfdHlwZXM6IG9wdGlvbnMuYWxsb3dlZE1pbWVUeXBlcyxcbiAgICAgICAgICAgICAgICB9LCB7IGhlYWRlcnM6IHRoaXMuaGVhZGVycyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RvcmFnZUVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgYSBTdG9yYWdlIGJ1Y2tldFxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIEEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBidWNrZXQgeW91IGFyZSB1cGRhdGluZy5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5wdWJsaWMgVGhlIHZpc2liaWxpdHkgb2YgdGhlIGJ1Y2tldC4gUHVibGljIGJ1Y2tldHMgZG9uJ3QgcmVxdWlyZSBhbiBhdXRob3JpemF0aW9uIHRva2VuIHRvIGRvd25sb2FkIG9iamVjdHMsIGJ1dCBzdGlsbCByZXF1aXJlIGEgdmFsaWQgdG9rZW4gZm9yIGFsbCBvdGhlciBvcGVyYXRpb25zLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpbGVTaXplTGltaXQgc3BlY2lmaWVzIHRoZSBtYXggZmlsZSBzaXplIGluIGJ5dGVzIHRoYXQgY2FuIGJlIHVwbG9hZGVkIHRvIHRoaXMgYnVja2V0LlxuICAgICAqIFRoZSBnbG9iYWwgZmlsZSBzaXplIGxpbWl0IHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0aGlzIHZhbHVlLlxuICAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIG51bGwsIHdoaWNoIGRvZXNuJ3Qgc2V0IGEgcGVyIGJ1Y2tldCBmaWxlIHNpemUgbGltaXQuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYWxsb3dlZE1pbWVUeXBlcyBzcGVjaWZpZXMgdGhlIGFsbG93ZWQgbWltZSB0eXBlcyB0aGF0IHRoaXMgYnVja2V0IGNhbiBhY2NlcHQgZHVyaW5nIHVwbG9hZC5cbiAgICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBudWxsLCB3aGljaCBhbGxvd3MgZmlsZXMgd2l0aCBhbGwgbWltZSB0eXBlcyB0byBiZSB1cGxvYWRlZC5cbiAgICAgKiBFYWNoIG1pbWUgdHlwZSBzcGVjaWZpZWQgY2FuIGJlIGEgd2lsZGNhcmQsIGUuZy4gaW1hZ2UvKiwgb3IgYSBzcGVjaWZpYyBtaW1lIHR5cGUsIGUuZy4gaW1hZ2UvcG5nLlxuICAgICAqL1xuICAgIHVwZGF0ZUJ1Y2tldChpZCwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcHV0KHRoaXMuZmV0Y2gsIGAke3RoaXMudXJsfS9idWNrZXQvJHtpZH1gLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgcHVibGljOiBvcHRpb25zLnB1YmxpYyxcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9zaXplX2xpbWl0OiBvcHRpb25zLmZpbGVTaXplTGltaXQsXG4gICAgICAgICAgICAgICAgICAgIGFsbG93ZWRfbWltZV90eXBlczogb3B0aW9ucy5hbGxvd2VkTWltZVR5cGVzLFxuICAgICAgICAgICAgICAgIH0sIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGEsIGVycm9yOiBudWxsIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdG9yYWdlRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2JqZWN0cyBpbnNpZGUgYSBzaW5nbGUgYnVja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgYnVja2V0IHlvdSB3b3VsZCBsaWtlIHRvIGVtcHR5LlxuICAgICAqL1xuICAgIGVtcHR5QnVja2V0KGlkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCBwb3N0KHRoaXMuZmV0Y2gsIGAke3RoaXMudXJsfS9idWNrZXQvJHtpZH0vZW1wdHlgLCB7fSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChpc1N0b3JhZ2VFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEZWxldGVzIGFuIGV4aXN0aW5nIGJ1Y2tldC4gQSBidWNrZXQgY2FuJ3QgYmUgZGVsZXRlZCB3aXRoIGV4aXN0aW5nIG9iamVjdHMgaW5zaWRlIGl0LlxuICAgICAqIFlvdSBtdXN0IGZpcnN0IGBlbXB0eSgpYCB0aGUgYnVja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgYnVja2V0IHlvdSB3b3VsZCBsaWtlIHRvIGRlbGV0ZS5cbiAgICAgKi9cbiAgICBkZWxldGVCdWNrZXQoaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHJlbW92ZSh0aGlzLmZldGNoLCBgJHt0aGlzLnVybH0vYnVja2V0LyR7aWR9YCwge30sIHsgaGVhZGVyczogdGhpcy5oZWFkZXJzIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGEsIGVycm9yOiBudWxsIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdG9yYWdlRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdG9yYWdlQnVja2V0QXBpLmpzLm1hcCIsImltcG9ydCBTdG9yYWdlRmlsZUFwaSBmcm9tICcuL3BhY2thZ2VzL1N0b3JhZ2VGaWxlQXBpJztcbmltcG9ydCBTdG9yYWdlQnVja2V0QXBpIGZyb20gJy4vcGFja2FnZXMvU3RvcmFnZUJ1Y2tldEFwaSc7XG5leHBvcnQgY2xhc3MgU3RvcmFnZUNsaWVudCBleHRlbmRzIFN0b3JhZ2VCdWNrZXRBcGkge1xuICAgIGNvbnN0cnVjdG9yKHVybCwgaGVhZGVycyA9IHt9LCBmZXRjaCkge1xuICAgICAgICBzdXBlcih1cmwsIGhlYWRlcnMsIGZldGNoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBmaWxlIG9wZXJhdGlvbiBpbiBhIGJ1Y2tldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBUaGUgYnVja2V0IGlkIHRvIG9wZXJhdGUgb24uXG4gICAgICovXG4gICAgZnJvbShpZCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0b3JhZ2VGaWxlQXBpKHRoaXMudXJsLCB0aGlzLmhlYWRlcnMsIGlkLCB0aGlzLmZldGNoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdG9yYWdlQ2xpZW50LmpzLm1hcCIsImV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJzIuNTAuMyc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD12ZXJzaW9uLmpzLm1hcCIsImltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuL3ZlcnNpb24nO1xubGV0IEpTX0VOViA9ICcnO1xuLy8gQHRzLWlnbm9yZVxuaWYgKHR5cGVvZiBEZW5vICE9PSAndW5kZWZpbmVkJykge1xuICAgIEpTX0VOViA9ICdkZW5vJztcbn1cbmVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBKU19FTlYgPSAnd2ViJztcbn1cbmVsc2UgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKSB7XG4gICAgSlNfRU5WID0gJ3JlYWN0LW5hdGl2ZSc7XG59XG5lbHNlIHtcbiAgICBKU19FTlYgPSAnbm9kZSc7XG59XG5leHBvcnQgY29uc3QgREVGQVVMVF9IRUFERVJTID0geyAnWC1DbGllbnQtSW5mbyc6IGBzdXBhYmFzZS1qcy0ke0pTX0VOVn0vJHt2ZXJzaW9ufWAgfTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0dMT0JBTF9PUFRJT05TID0ge1xuICAgIGhlYWRlcnM6IERFRkFVTFRfSEVBREVSUyxcbn07XG5leHBvcnQgY29uc3QgREVGQVVMVF9EQl9PUFRJT05TID0ge1xuICAgIHNjaGVtYTogJ3B1YmxpYycsXG59O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQVVUSF9PUFRJT05TID0ge1xuICAgIGF1dG9SZWZyZXNoVG9rZW46IHRydWUsXG4gICAgcGVyc2lzdFNlc3Npb246IHRydWUsXG4gICAgZGV0ZWN0U2Vzc2lvbkluVXJsOiB0cnVlLFxuICAgIGZsb3dUeXBlOiAnaW1wbGljaXQnLFxufTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JFQUxUSU1FX09QVElPTlMgPSB7fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnN0YW50cy5qcy5tYXAiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBub2RlRmV0Y2gsIHsgSGVhZGVycyBhcyBOb2RlRmV0Y2hIZWFkZXJzIH0gZnJvbSAnQHN1cGFiYXNlL25vZGUtZmV0Y2gnO1xuZXhwb3J0IGNvbnN0IHJlc29sdmVGZXRjaCA9IChjdXN0b21GZXRjaCkgPT4ge1xuICAgIGxldCBfZmV0Y2g7XG4gICAgaWYgKGN1c3RvbUZldGNoKSB7XG4gICAgICAgIF9mZXRjaCA9IGN1c3RvbUZldGNoO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZmV0Y2ggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9mZXRjaCA9IG5vZGVGZXRjaDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIF9mZXRjaCA9IGZldGNoO1xuICAgIH1cbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IF9mZXRjaCguLi5hcmdzKTtcbn07XG5leHBvcnQgY29uc3QgcmVzb2x2ZUhlYWRlcnNDb25zdHJ1Y3RvciA9ICgpID0+IHtcbiAgICBpZiAodHlwZW9mIEhlYWRlcnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBOb2RlRmV0Y2hIZWFkZXJzO1xuICAgIH1cbiAgICByZXR1cm4gSGVhZGVycztcbn07XG5leHBvcnQgY29uc3QgZmV0Y2hXaXRoQXV0aCA9IChzdXBhYmFzZUtleSwgZ2V0QWNjZXNzVG9rZW4sIGN1c3RvbUZldGNoKSA9PiB7XG4gICAgY29uc3QgZmV0Y2ggPSByZXNvbHZlRmV0Y2goY3VzdG9tRmV0Y2gpO1xuICAgIGNvbnN0IEhlYWRlcnNDb25zdHJ1Y3RvciA9IHJlc29sdmVIZWFkZXJzQ29uc3RydWN0b3IoKTtcbiAgICByZXR1cm4gKGlucHV0LCBpbml0KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IChfYSA9ICh5aWVsZCBnZXRBY2Nlc3NUb2tlbigpKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogc3VwYWJhc2VLZXk7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnNDb25zdHJ1Y3Rvcihpbml0ID09PSBudWxsIHx8IGluaXQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGluaXQuaGVhZGVycyk7XG4gICAgICAgIGlmICghaGVhZGVycy5oYXMoJ2FwaWtleScpKSB7XG4gICAgICAgICAgICBoZWFkZXJzLnNldCgnYXBpa2V5Jywgc3VwYWJhc2VLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGVhZGVycy5oYXMoJ0F1dGhvcml6YXRpb24nKSkge1xuICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0F1dGhvcml6YXRpb24nLCBgQmVhcmVyICR7YWNjZXNzVG9rZW59YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZldGNoKGlucHV0LCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluaXQpLCB7IGhlYWRlcnMgfSkpO1xuICAgIH0pO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZldGNoLmpzLm1hcCIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIHV1aWQoKSB7XG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgdmFyIHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsIHYgPSBjID09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVUcmFpbGluZ1NsYXNoKHVybCkge1xuICAgIHJldHVybiB1cmwuZW5kc1dpdGgoJy8nKSA/IHVybCA6IHVybCArICcvJztcbn1cbmV4cG9ydCBjb25zdCBpc0Jyb3dzZXIgPSAoKSA9PiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbmV4cG9ydCBmdW5jdGlvbiBhcHBseVNldHRpbmdEZWZhdWx0cyhvcHRpb25zLCBkZWZhdWx0cykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgeyBkYjogZGJPcHRpb25zLCBhdXRoOiBhdXRoT3B0aW9ucywgcmVhbHRpbWU6IHJlYWx0aW1lT3B0aW9ucywgZ2xvYmFsOiBnbG9iYWxPcHRpb25zLCB9ID0gb3B0aW9ucztcbiAgICBjb25zdCB7IGRiOiBERUZBVUxUX0RCX09QVElPTlMsIGF1dGg6IERFRkFVTFRfQVVUSF9PUFRJT05TLCByZWFsdGltZTogREVGQVVMVF9SRUFMVElNRV9PUFRJT05TLCBnbG9iYWw6IERFRkFVTFRfR0xPQkFMX09QVElPTlMsIH0gPSBkZWZhdWx0cztcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgIGRiOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfREJfT1BUSU9OUyksIGRiT3B0aW9ucyksXG4gICAgICAgIGF1dGg6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9BVVRIX09QVElPTlMpLCBhdXRoT3B0aW9ucyksXG4gICAgICAgIHJlYWx0aW1lOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfUkVBTFRJTUVfT1BUSU9OUyksIHJlYWx0aW1lT3B0aW9ucyksXG4gICAgICAgIGdsb2JhbDogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfR0xPQkFMX09QVElPTlMpLCBnbG9iYWxPcHRpb25zKSwgeyBoZWFkZXJzOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sICgoX2EgPSBERUZBVUxUX0dMT0JBTF9PUFRJT05TID09PSBudWxsIHx8IERFRkFVTFRfR0xPQkFMX09QVElPTlMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IERFRkFVTFRfR0xPQkFMX09QVElPTlMuaGVhZGVycykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge30pKSwgKChfYiA9IGdsb2JhbE9wdGlvbnMgPT09IG51bGwgfHwgZ2xvYmFsT3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZ2xvYmFsT3B0aW9ucy5oZWFkZXJzKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB7fSkpIH0pLFxuICAgICAgICBhY2Nlc3NUb2tlbjogKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgeyByZXR1cm4gJyc7IH0pLFxuICAgIH07XG4gICAgaWYgKG9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVzdWx0LmFjY2Vzc1Rva2VuID0gb3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGhhY2sgYXJvdW5kIFJlcXVpcmVkPD5cbiAgICAgICAgZGVsZXRlIHJlc3VsdC5hY2Nlc3NUb2tlbjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlbHBlcnMuanMubWFwIiwiZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnMi43MC4wJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZlcnNpb24uanMubWFwIiwiaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4vdmVyc2lvbic7XG4vKiogQ3VycmVudCBzZXNzaW9uIHdpbGwgYmUgY2hlY2tlZCBmb3IgcmVmcmVzaCBhdCB0aGlzIGludGVydmFsLiAqL1xuZXhwb3J0IGNvbnN0IEFVVE9fUkVGUkVTSF9USUNLX0RVUkFUSU9OX01TID0gMzAgKiAxMDAwO1xuLyoqXG4gKiBBIHRva2VuIHJlZnJlc2ggd2lsbCBiZSBhdHRlbXB0ZWQgdGhpcyBtYW55IHRpY2tzIGJlZm9yZSB0aGUgY3VycmVudCBzZXNzaW9uIGV4cGlyZXMuICovXG5leHBvcnQgY29uc3QgQVVUT19SRUZSRVNIX1RJQ0tfVEhSRVNIT0xEID0gMztcbi8qXG4gKiBFYXJsaWVzdCB0aW1lIGJlZm9yZSBhbiBhY2Nlc3MgdG9rZW4gZXhwaXJlcyB0aGF0IHRoZSBzZXNzaW9uIHNob3VsZCBiZSByZWZyZXNoZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBFWFBJUllfTUFSR0lOX01TID0gQVVUT19SRUZSRVNIX1RJQ0tfVEhSRVNIT0xEICogQVVUT19SRUZSRVNIX1RJQ0tfRFVSQVRJT05fTVM7XG5leHBvcnQgY29uc3QgR09UUlVFX1VSTCA9ICdodHRwOi8vbG9jYWxob3N0Ojk5OTknO1xuZXhwb3J0IGNvbnN0IFNUT1JBR0VfS0VZID0gJ3N1cGFiYXNlLmF1dGgudG9rZW4nO1xuZXhwb3J0IGNvbnN0IEFVRElFTkNFID0gJyc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9IRUFERVJTID0geyAnWC1DbGllbnQtSW5mbyc6IGBnb3RydWUtanMvJHt2ZXJzaW9ufWAgfTtcbmV4cG9ydCBjb25zdCBORVRXT1JLX0ZBSUxVUkUgPSB7XG4gICAgTUFYX1JFVFJJRVM6IDEwLFxuICAgIFJFVFJZX0lOVEVSVkFMOiAyLCAvLyBpbiBkZWNpc2Vjb25kc1xufTtcbmV4cG9ydCBjb25zdCBBUElfVkVSU0lPTl9IRUFERVJfTkFNRSA9ICdYLVN1cGFiYXNlLUFwaS1WZXJzaW9uJztcbmV4cG9ydCBjb25zdCBBUElfVkVSU0lPTlMgPSB7XG4gICAgJzIwMjQtMDEtMDEnOiB7XG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5wYXJzZSgnMjAyNC0wMS0wMVQwMDowMDowMC4wWicpLFxuICAgICAgICBuYW1lOiAnMjAyNC0wMS0wMScsXG4gICAgfSxcbn07XG5leHBvcnQgY29uc3QgQkFTRTY0VVJMX1JFR0VYID0gL14oW2EtejAtOV8tXXs0fSkqKCR8W2EtejAtOV8tXXszfSR8W2EtejAtOV8tXXsyfSQpJC9pO1xuZXhwb3J0IGNvbnN0IEpXS1NfVFRMID0gNjAwMDAwOyAvLyAxMCBtaW51dGVzXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiZXhwb3J0IGNsYXNzIEF1dGhFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBzdGF0dXMsIGNvZGUpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMuX19pc0F1dGhFcnJvciA9IHRydWU7XG4gICAgICAgIHRoaXMubmFtZSA9ICdBdXRoRXJyb3InO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gaXNBdXRoRXJyb3IoZXJyb3IpIHtcbiAgICByZXR1cm4gdHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiBlcnJvciAhPT0gbnVsbCAmJiAnX19pc0F1dGhFcnJvcicgaW4gZXJyb3I7XG59XG5leHBvcnQgY2xhc3MgQXV0aEFwaUVycm9yIGV4dGVuZHMgQXV0aEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBzdGF0dXMsIGNvZGUpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSwgc3RhdHVzLCBjb2RlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0F1dGhBcGlFcnJvcic7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0F1dGhBcGlFcnJvcihlcnJvcikge1xuICAgIHJldHVybiBpc0F1dGhFcnJvcihlcnJvcikgJiYgZXJyb3IubmFtZSA9PT0gJ0F1dGhBcGlFcnJvcic7XG59XG5leHBvcnQgY2xhc3MgQXV0aFVua25vd25FcnJvciBleHRlbmRzIEF1dGhFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgb3JpZ2luYWxFcnJvcikge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0F1dGhVbmtub3duRXJyb3InO1xuICAgICAgICB0aGlzLm9yaWdpbmFsRXJyb3IgPSBvcmlnaW5hbEVycm9yO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBDdXN0b21BdXRoRXJyb3IgZXh0ZW5kcyBBdXRoRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIG5hbWUsIHN0YXR1cywgY29kZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlLCBzdGF0dXMsIGNvZGUpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgQXV0aFNlc3Npb25NaXNzaW5nRXJyb3IgZXh0ZW5kcyBDdXN0b21BdXRoRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignQXV0aCBzZXNzaW9uIG1pc3NpbmchJywgJ0F1dGhTZXNzaW9uTWlzc2luZ0Vycm9yJywgNDAwLCB1bmRlZmluZWQpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0F1dGhTZXNzaW9uTWlzc2luZ0Vycm9yKGVycm9yKSB7XG4gICAgcmV0dXJuIGlzQXV0aEVycm9yKGVycm9yKSAmJiBlcnJvci5uYW1lID09PSAnQXV0aFNlc3Npb25NaXNzaW5nRXJyb3InO1xufVxuZXhwb3J0IGNsYXNzIEF1dGhJbnZhbGlkVG9rZW5SZXNwb25zZUVycm9yIGV4dGVuZHMgQ3VzdG9tQXV0aEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ0F1dGggc2Vzc2lvbiBvciB1c2VyIG1pc3NpbmcnLCAnQXV0aEludmFsaWRUb2tlblJlc3BvbnNlRXJyb3InLCA1MDAsIHVuZGVmaW5lZCk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEF1dGhJbnZhbGlkQ3JlZGVudGlhbHNFcnJvciBleHRlbmRzIEN1c3RvbUF1dGhFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlLCAnQXV0aEludmFsaWRDcmVkZW50aWFsc0Vycm9yJywgNDAwLCB1bmRlZmluZWQpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBBdXRoSW1wbGljaXRHcmFudFJlZGlyZWN0RXJyb3IgZXh0ZW5kcyBDdXN0b21BdXRoRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGRldGFpbHMgPSBudWxsKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UsICdBdXRoSW1wbGljaXRHcmFudFJlZGlyZWN0RXJyb3InLCA1MDAsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRoaXMuZGV0YWlscyA9IG51bGw7XG4gICAgICAgIHRoaXMuZGV0YWlscyA9IGRldGFpbHM7XG4gICAgfVxuICAgIHRvSlNPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICBkZXRhaWxzOiB0aGlzLmRldGFpbHMsXG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQXV0aEltcGxpY2l0R3JhbnRSZWRpcmVjdEVycm9yKGVycm9yKSB7XG4gICAgcmV0dXJuIGlzQXV0aEVycm9yKGVycm9yKSAmJiBlcnJvci5uYW1lID09PSAnQXV0aEltcGxpY2l0R3JhbnRSZWRpcmVjdEVycm9yJztcbn1cbmV4cG9ydCBjbGFzcyBBdXRoUEtDRUdyYW50Q29kZUV4Y2hhbmdlRXJyb3IgZXh0ZW5kcyBDdXN0b21BdXRoRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGRldGFpbHMgPSBudWxsKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UsICdBdXRoUEtDRUdyYW50Q29kZUV4Y2hhbmdlRXJyb3InLCA1MDAsIHVuZGVmaW5lZCk7XG4gICAgICAgIHRoaXMuZGV0YWlscyA9IG51bGw7XG4gICAgICAgIHRoaXMuZGV0YWlscyA9IGRldGFpbHM7XG4gICAgfVxuICAgIHRvSlNPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICBkZXRhaWxzOiB0aGlzLmRldGFpbHMsXG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEF1dGhSZXRyeWFibGVGZXRjaEVycm9yIGV4dGVuZHMgQ3VzdG9tQXV0aEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBzdGF0dXMpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSwgJ0F1dGhSZXRyeWFibGVGZXRjaEVycm9yJywgc3RhdHVzLCB1bmRlZmluZWQpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0F1dGhSZXRyeWFibGVGZXRjaEVycm9yKGVycm9yKSB7XG4gICAgcmV0dXJuIGlzQXV0aEVycm9yKGVycm9yKSAmJiBlcnJvci5uYW1lID09PSAnQXV0aFJldHJ5YWJsZUZldGNoRXJyb3InO1xufVxuLyoqXG4gKiBUaGlzIGVycm9yIGlzIHRocm93biBvbiBjZXJ0YWluIG1ldGhvZHMgd2hlbiB0aGUgcGFzc3dvcmQgdXNlZCBpcyBkZWVtZWRcbiAqIHdlYWsuIEluc3BlY3QgdGhlIHJlYXNvbnMgdG8gaWRlbnRpZnkgd2hhdCBwYXNzd29yZCBzdHJlbmd0aCBydWxlcyBhcmVcbiAqIGluYWRlcXVhdGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRoV2Vha1Bhc3N3b3JkRXJyb3IgZXh0ZW5kcyBDdXN0b21BdXRoRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHN0YXR1cywgcmVhc29ucykge1xuICAgICAgICBzdXBlcihtZXNzYWdlLCAnQXV0aFdlYWtQYXNzd29yZEVycm9yJywgc3RhdHVzLCAnd2Vha19wYXNzd29yZCcpO1xuICAgICAgICB0aGlzLnJlYXNvbnMgPSByZWFzb25zO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0F1dGhXZWFrUGFzc3dvcmRFcnJvcihlcnJvcikge1xuICAgIHJldHVybiBpc0F1dGhFcnJvcihlcnJvcikgJiYgZXJyb3IubmFtZSA9PT0gJ0F1dGhXZWFrUGFzc3dvcmRFcnJvcic7XG59XG5leHBvcnQgY2xhc3MgQXV0aEludmFsaWRKd3RFcnJvciBleHRlbmRzIEN1c3RvbUF1dGhFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlLCAnQXV0aEludmFsaWRKd3RFcnJvcicsIDQwMCwgJ2ludmFsaWRfand0Jyk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3JzLmpzLm1hcCIsIi8qKlxuICogQXZvaWQgbW9kaWZ5aW5nIHRoaXMgZmlsZS4gSXQncyBwYXJ0IG9mXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2UtY29tbXVuaXR5L2Jhc2U2NHVybC1qcy4gIFN1Ym1pdCBhbGwgZml4ZXMgb25cbiAqIHRoYXQgcmVwbyFcbiAqL1xuLyoqXG4gKiBBbiBhcnJheSBvZiBjaGFyYWN0ZXJzIHRoYXQgZW5jb2RlIDYgYml0cyBpbnRvIGEgQmFzZTY0LVVSTCBhbHBoYWJldFxuICogY2hhcmFjdGVyLlxuICovXG5jb25zdCBUT19CQVNFNjRVUkwgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODktXycuc3BsaXQoJycpO1xuLyoqXG4gKiBBbiBhcnJheSBvZiBjaGFyYWN0ZXJzIHRoYXQgY2FuIGFwcGVhciBpbiBhIEJhc2U2NC1VUkwgZW5jb2RlZCBzdHJpbmcgYnV0XG4gKiBzaG91bGQgYmUgaWdub3JlZC5cbiAqL1xuY29uc3QgSUdOT1JFX0JBU0U2NFVSTCA9ICcgXFx0XFxuXFxyPScuc3BsaXQoJycpO1xuLyoqXG4gKiBBbiBhcnJheSBvZiAxMjggbnVtYmVycyB0aGF0IG1hcCBhIEJhc2U2NC1VUkwgY2hhcmFjdGVyIHRvIDYgYml0cywgb3IgaWYgLTJcbiAqIHVzZWQgdG8gc2tpcCB0aGUgY2hhcmFjdGVyLCBvciBpZiAtMSB1c2VkIHRvIGVycm9yIG91dC5cbiAqL1xuY29uc3QgRlJPTV9CQVNFNjRVUkwgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGNoYXJNYXAgPSBuZXcgQXJyYXkoMTI4KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXJNYXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY2hhck1hcFtpXSA9IC0xO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IElHTk9SRV9CQVNFNjRVUkwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY2hhck1hcFtJR05PUkVfQkFTRTY0VVJMW2ldLmNoYXJDb2RlQXQoMCldID0gLTI7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgVE9fQkFTRTY0VVJMLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNoYXJNYXBbVE9fQkFTRTY0VVJMW2ldLmNoYXJDb2RlQXQoMCldID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJNYXA7XG59KSgpO1xuLyoqXG4gKiBDb252ZXJ0cyBhIGJ5dGUgdG8gYSBCYXNlNjQtVVJMIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gYnl0ZSBUaGUgYnl0ZSB0byBjb252ZXJ0LCBvciBudWxsIHRvIGZsdXNoIGF0IHRoZSBlbmQgb2YgdGhlIGJ5dGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0gc3RhdGUgVGhlIEJhc2U2NCBjb252ZXJzaW9uIHN0YXRlLiBQYXNzIGFuIGluaXRpYWwgdmFsdWUgb2YgYHsgcXVldWU6IDAsIHF1ZXVlZEJpdHM6IDAgfWAuXG4gKiBAcGFyYW0gZW1pdCBBIGZ1bmN0aW9uIGNhbGxlZCB3aXRoIHRoZSBuZXh0IEJhc2U2NCBjaGFyYWN0ZXIgd2hlbiByZWFkeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ5dGVUb0Jhc2U2NFVSTChieXRlLCBzdGF0ZSwgZW1pdCkge1xuICAgIGlmIChieXRlICE9PSBudWxsKSB7XG4gICAgICAgIHN0YXRlLnF1ZXVlID0gKHN0YXRlLnF1ZXVlIDw8IDgpIHwgYnl0ZTtcbiAgICAgICAgc3RhdGUucXVldWVkQml0cyArPSA4O1xuICAgICAgICB3aGlsZSAoc3RhdGUucXVldWVkQml0cyA+PSA2KSB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSAoc3RhdGUucXVldWUgPj4gKHN0YXRlLnF1ZXVlZEJpdHMgLSA2KSkgJiA2MztcbiAgICAgICAgICAgIGVtaXQoVE9fQkFTRTY0VVJMW3Bvc10pO1xuICAgICAgICAgICAgc3RhdGUucXVldWVkQml0cyAtPSA2O1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHN0YXRlLnF1ZXVlZEJpdHMgPiAwKSB7XG4gICAgICAgIHN0YXRlLnF1ZXVlID0gc3RhdGUucXVldWUgPDwgKDYgLSBzdGF0ZS5xdWV1ZWRCaXRzKTtcbiAgICAgICAgc3RhdGUucXVldWVkQml0cyA9IDY7XG4gICAgICAgIHdoaWxlIChzdGF0ZS5xdWV1ZWRCaXRzID49IDYpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IChzdGF0ZS5xdWV1ZSA+PiAoc3RhdGUucXVldWVkQml0cyAtIDYpKSAmIDYzO1xuICAgICAgICAgICAgZW1pdChUT19CQVNFNjRVUkxbcG9zXSk7XG4gICAgICAgICAgICBzdGF0ZS5xdWV1ZWRCaXRzIC09IDY7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIENvbnZlcnRzIGEgU3RyaW5nIGNoYXIgY29kZSAoZXh0cmFjdGVkIHVzaW5nIGBzdHJpbmcuY2hhckNvZGVBdChwb3NpdGlvbilgKSB0byBhIHNlcXVlbmNlIG9mIEJhc2U2NC1VUkwgY2hhcmFjdGVycy5cbiAqXG4gKiBAcGFyYW0gY2hhckNvZGUgVGhlIGNoYXIgY29kZSBvZiB0aGUgSmF2YVNjcmlwdCBzdHJpbmcuXG4gKiBAcGFyYW0gc3RhdGUgVGhlIEJhc2U2NCBzdGF0ZS4gUGFzcyBhbiBpbml0aWFsIHZhbHVlIG9mIGB7IHF1ZXVlOiAwLCBxdWV1ZWRCaXRzOiAwIH1gLlxuICogQHBhcmFtIGVtaXQgQSBmdW5jdGlvbiBjYWxsZWQgd2l0aCB0aGUgbmV4dCBieXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnl0ZUZyb21CYXNlNjRVUkwoY2hhckNvZGUsIHN0YXRlLCBlbWl0KSB7XG4gICAgY29uc3QgYml0cyA9IEZST01fQkFTRTY0VVJMW2NoYXJDb2RlXTtcbiAgICBpZiAoYml0cyA+IC0xKSB7XG4gICAgICAgIC8vIHZhbGlkIEJhc2U2NC1VUkwgY2hhcmFjdGVyXG4gICAgICAgIHN0YXRlLnF1ZXVlID0gKHN0YXRlLnF1ZXVlIDw8IDYpIHwgYml0cztcbiAgICAgICAgc3RhdGUucXVldWVkQml0cyArPSA2O1xuICAgICAgICB3aGlsZSAoc3RhdGUucXVldWVkQml0cyA+PSA4KSB7XG4gICAgICAgICAgICBlbWl0KChzdGF0ZS5xdWV1ZSA+PiAoc3RhdGUucXVldWVkQml0cyAtIDgpKSAmIDB4ZmYpO1xuICAgICAgICAgICAgc3RhdGUucXVldWVkQml0cyAtPSA4O1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGJpdHMgPT09IC0yKSB7XG4gICAgICAgIC8vIGlnbm9yZSBzcGFjZXMsIHRhYnMsIG5ld2xpbmVzLCA9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBCYXNlNjQtVVJMIGNoYXJhY3RlciBcIiR7U3RyaW5nLmZyb21DaGFyQ29kZShjaGFyQ29kZSl9XCJgKTtcbiAgICB9XG59XG4vKipcbiAqIENvbnZlcnRzIGEgSmF2YVNjcmlwdCBzdHJpbmcgKHdoaWNoIG1heSBpbmNsdWRlIGFueSB2YWxpZCBjaGFyYWN0ZXIpIGludG8gYVxuICogQmFzZTY0LVVSTCBlbmNvZGVkIHN0cmluZy4gVGhlIHN0cmluZyBpcyBmaXJzdCBlbmNvZGVkIGluIFVURi04IHdoaWNoIGlzXG4gKiB0aGVuIGVuY29kZWQgYXMgQmFzZTY0LVVSTC5cbiAqXG4gKiBAcGFyYW0gc3RyIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ1RvQmFzZTY0VVJMKHN0cikge1xuICAgIGNvbnN0IGJhc2U2NCA9IFtdO1xuICAgIGNvbnN0IGVtaXR0ZXIgPSAoY2hhcikgPT4ge1xuICAgICAgICBiYXNlNjQucHVzaChjaGFyKTtcbiAgICB9O1xuICAgIGNvbnN0IHN0YXRlID0geyBxdWV1ZTogMCwgcXVldWVkQml0czogMCB9O1xuICAgIHN0cmluZ1RvVVRGOChzdHIsIChieXRlKSA9PiB7XG4gICAgICAgIGJ5dGVUb0Jhc2U2NFVSTChieXRlLCBzdGF0ZSwgZW1pdHRlcik7XG4gICAgfSk7XG4gICAgYnl0ZVRvQmFzZTY0VVJMKG51bGwsIHN0YXRlLCBlbWl0dGVyKTtcbiAgICByZXR1cm4gYmFzZTY0LmpvaW4oJycpO1xufVxuLyoqXG4gKiBDb252ZXJ0cyBhIEJhc2U2NC1VUkwgZW5jb2RlZCBzdHJpbmcgaW50byBhIEphdmFTY3JpcHQgc3RyaW5nLiBJdCBpcyBhc3N1bWVkXG4gKiB0aGF0IHRoZSB1bmRlcmx5aW5nIHN0cmluZyBoYXMgYmVlbiBlbmNvZGVkIGFzIFVURi04LlxuICpcbiAqIEBwYXJhbSBzdHIgVGhlIEJhc2U2NC1VUkwgZW5jb2RlZCBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdGcm9tQmFzZTY0VVJMKHN0cikge1xuICAgIGNvbnN0IGNvbnYgPSBbXTtcbiAgICBjb25zdCB1dGY4RW1pdCA9IChjb2RlcG9pbnQpID0+IHtcbiAgICAgICAgY29udi5wdXNoKFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVwb2ludCkpO1xuICAgIH07XG4gICAgY29uc3QgdXRmOFN0YXRlID0ge1xuICAgICAgICB1dGY4c2VxOiAwLFxuICAgICAgICBjb2RlcG9pbnQ6IDAsXG4gICAgfTtcbiAgICBjb25zdCBiNjRTdGF0ZSA9IHsgcXVldWU6IDAsIHF1ZXVlZEJpdHM6IDAgfTtcbiAgICBjb25zdCBieXRlRW1pdCA9IChieXRlKSA9PiB7XG4gICAgICAgIHN0cmluZ0Zyb21VVEY4KGJ5dGUsIHV0ZjhTdGF0ZSwgdXRmOEVtaXQpO1xuICAgIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYnl0ZUZyb21CYXNlNjRVUkwoc3RyLmNoYXJDb2RlQXQoaSksIGI2NFN0YXRlLCBieXRlRW1pdCk7XG4gICAgfVxuICAgIHJldHVybiBjb252LmpvaW4oJycpO1xufVxuLyoqXG4gKiBDb252ZXJ0cyBhIFVuaWNvZGUgY29kZXBvaW50IHRvIGEgbXVsdGktYnl0ZSBVVEYtOCBzZXF1ZW5jZS5cbiAqXG4gKiBAcGFyYW0gY29kZXBvaW50IFRoZSBVbmljb2RlIGNvZGVwb2ludC5cbiAqIEBwYXJhbSBlbWl0ICAgICAgRnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggVVRGLTggYnl0ZSB0aGF0IHJlcHJlc2VudHMgdGhlIGNvZGVwb2ludC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvZGVwb2ludFRvVVRGOChjb2RlcG9pbnQsIGVtaXQpIHtcbiAgICBpZiAoY29kZXBvaW50IDw9IDB4N2YpIHtcbiAgICAgICAgZW1pdChjb2RlcG9pbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2UgaWYgKGNvZGVwb2ludCA8PSAweDdmZikge1xuICAgICAgICBlbWl0KDB4YzAgfCAoY29kZXBvaW50ID4+IDYpKTtcbiAgICAgICAgZW1pdCgweDgwIHwgKGNvZGVwb2ludCAmIDB4M2YpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb2RlcG9pbnQgPD0gMHhmZmZmKSB7XG4gICAgICAgIGVtaXQoMHhlMCB8IChjb2RlcG9pbnQgPj4gMTIpKTtcbiAgICAgICAgZW1pdCgweDgwIHwgKChjb2RlcG9pbnQgPj4gNikgJiAweDNmKSk7XG4gICAgICAgIGVtaXQoMHg4MCB8IChjb2RlcG9pbnQgJiAweDNmKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSBpZiAoY29kZXBvaW50IDw9IDB4MTBmZmZmKSB7XG4gICAgICAgIGVtaXQoMHhmMCB8IChjb2RlcG9pbnQgPj4gMTgpKTtcbiAgICAgICAgZW1pdCgweDgwIHwgKChjb2RlcG9pbnQgPj4gMTIpICYgMHgzZikpO1xuICAgICAgICBlbWl0KDB4ODAgfCAoKGNvZGVwb2ludCA+PiA2KSAmIDB4M2YpKTtcbiAgICAgICAgZW1pdCgweDgwIHwgKGNvZGVwb2ludCAmIDB4M2YpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBVbmljb2RlIGNvZGVwb2ludDogJHtjb2RlcG9pbnQudG9TdHJpbmcoMTYpfWApO1xufVxuLyoqXG4gKiBDb252ZXJ0cyBhIEphdmFTY3JpcHQgc3RyaW5nIHRvIGEgc2VxdWVuY2Ugb2YgVVRGLTggYnl0ZXMuXG4gKlxuICogQHBhcmFtIHN0ciAgVGhlIHN0cmluZyB0byBjb252ZXJ0IHRvIFVURi04LlxuICogQHBhcmFtIGVtaXQgRnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggVVRGLTggYnl0ZSBvZiB0aGUgc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nVG9VVEY4KHN0ciwgZW1pdCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGxldCBjb2RlcG9pbnQgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGVwb2ludCA+IDB4ZDdmZiAmJiBjb2RlcG9pbnQgPD0gMHhkYmZmKSB7XG4gICAgICAgICAgICAvLyBtb3N0IFVURi0xNiBjb2RlcG9pbnRzIGFyZSBVbmljb2RlIGNvZGVwb2ludHMsIGV4Y2VwdCB2YWx1ZXMgaW4gdGhpc1xuICAgICAgICAgICAgLy8gcmFuZ2Ugd2hlcmUgdGhlIG5leHQgVVRGLTE2IGNvZGVwb2ludCBuZWVkcyB0byBiZSBjb21iaW5lZCB3aXRoIHRoZVxuICAgICAgICAgICAgLy8gY3VycmVudCBvbmUgdG8gZ2V0IHRoZSBVbmljb2RlIGNvZGVwb2ludFxuICAgICAgICAgICAgY29uc3QgaGlnaFN1cnJvZ2F0ZSA9ICgoY29kZXBvaW50IC0gMHhkODAwKSAqIDB4NDAwKSAmIDB4ZmZmZjtcbiAgICAgICAgICAgIGNvbnN0IGxvd1N1cnJvZ2F0ZSA9IChzdHIuY2hhckNvZGVBdChpICsgMSkgLSAweGRjMDApICYgMHhmZmZmO1xuICAgICAgICAgICAgY29kZXBvaW50ID0gKGxvd1N1cnJvZ2F0ZSB8IGhpZ2hTdXJyb2dhdGUpICsgMHgxMDAwMDtcbiAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBjb2RlcG9pbnRUb1VURjgoY29kZXBvaW50LCBlbWl0KTtcbiAgICB9XG59XG4vKipcbiAqIENvbnZlcnRzIGEgVVRGLTggYnl0ZSB0byBhIFVuaWNvZGUgY29kZXBvaW50LlxuICpcbiAqIEBwYXJhbSBieXRlICBUaGUgVVRGLTggYnl0ZSBuZXh0IGluIHRoZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSBzdGF0ZSBUaGUgc2hhcmVkIHN0YXRlIGJldHdlZW4gY29uc2VjdXRpdmUgVVRGLTggYnl0ZXMgaW4gdGhlXG4gKiAgICAgICAgICAgICAgc2VxdWVuY2UsIGFuIG9iamVjdCB3aXRoIHRoZSBzaGFwZSBgeyB1dGY4c2VxOiAwLCBjb2RlcG9pbnQ6IDAgfWAuXG4gKiBAcGFyYW0gZW1pdCAgRnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggY29kZXBvaW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nRnJvbVVURjgoYnl0ZSwgc3RhdGUsIGVtaXQpIHtcbiAgICBpZiAoc3RhdGUudXRmOHNlcSA9PT0gMCkge1xuICAgICAgICBpZiAoYnl0ZSA8PSAweDdmKSB7XG4gICAgICAgICAgICBlbWl0KGJ5dGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgMSBsZWFkaW5nIGJpdHMgdW50aWwgeW91IHJlYWNoIDBcbiAgICAgICAgZm9yIChsZXQgbGVhZGluZ0JpdCA9IDE7IGxlYWRpbmdCaXQgPCA2OyBsZWFkaW5nQml0ICs9IDEpIHtcbiAgICAgICAgICAgIGlmICgoKGJ5dGUgPj4gKDcgLSBsZWFkaW5nQml0KSkgJiAxKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0YXRlLnV0ZjhzZXEgPSBsZWFkaW5nQml0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0ZS51dGY4c2VxID09PSAyKSB7XG4gICAgICAgICAgICBzdGF0ZS5jb2RlcG9pbnQgPSBieXRlICYgMzE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhdGUudXRmOHNlcSA9PT0gMykge1xuICAgICAgICAgICAgc3RhdGUuY29kZXBvaW50ID0gYnl0ZSAmIDE1O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0YXRlLnV0ZjhzZXEgPT09IDQpIHtcbiAgICAgICAgICAgIHN0YXRlLmNvZGVwb2ludCA9IGJ5dGUgJiA3O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFVURi04IHNlcXVlbmNlJyk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUudXRmOHNlcSAtPSAxO1xuICAgIH1cbiAgICBlbHNlIGlmIChzdGF0ZS51dGY4c2VxID4gMCkge1xuICAgICAgICBpZiAoYnl0ZSA8PSAweDdmKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVVRGLTggc2VxdWVuY2UnKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5jb2RlcG9pbnQgPSAoc3RhdGUuY29kZXBvaW50IDw8IDYpIHwgKGJ5dGUgJiA2Myk7XG4gICAgICAgIHN0YXRlLnV0ZjhzZXEgLT0gMTtcbiAgICAgICAgaWYgKHN0YXRlLnV0ZjhzZXEgPT09IDApIHtcbiAgICAgICAgICAgIGVtaXQoc3RhdGUuY29kZXBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9ucyB0byBjb252ZXJ0IGRpZmZlcmVudCB0eXBlcyBvZiBzdHJpbmdzIHRvIFVpbnQ4QXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFVybFRvVWludDhBcnJheShzdHIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb25zdCBzdGF0ZSA9IHsgcXVldWU6IDAsIHF1ZXVlZEJpdHM6IDAgfTtcbiAgICBjb25zdCBvbkJ5dGUgPSAoYnl0ZSkgPT4ge1xuICAgICAgICByZXN1bHQucHVzaChieXRlKTtcbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGJ5dGVGcm9tQmFzZTY0VVJMKHN0ci5jaGFyQ29kZUF0KGkpLCBzdGF0ZSwgb25CeXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nVG9VaW50OEFycmF5KHN0cikge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIHN0cmluZ1RvVVRGOChzdHIsIChieXRlKSA9PiByZXN1bHQucHVzaChieXRlKSk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XG59XG5leHBvcnQgZnVuY3Rpb24gYnl0ZXNUb0Jhc2U2NFVSTChieXRlcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IHN0YXRlID0geyBxdWV1ZTogMCwgcXVldWVkQml0czogMCB9O1xuICAgIGNvbnN0IG9uQ2hhciA9IChjaGFyKSA9PiB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGNoYXIpO1xuICAgIH07XG4gICAgYnl0ZXMuZm9yRWFjaCgoYnl0ZSkgPT4gYnl0ZVRvQmFzZTY0VVJMKGJ5dGUsIHN0YXRlLCBvbkNoYXIpKTtcbiAgICAvLyBhbHdheXMgY2FsbCB3aXRoIGBudWxsYCBhZnRlciBwcm9jZXNzaW5nIGFsbCBieXRlc1xuICAgIGJ5dGVUb0Jhc2U2NFVSTChudWxsLCBzdGF0ZSwgb25DaGFyKTtcbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmFzZTY0dXJsLmpzLm1hcCIsImltcG9ydCB7IEFQSV9WRVJTSU9OX0hFQURFUl9OQU1FLCBCQVNFNjRVUkxfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBBdXRoSW52YWxpZEp3dEVycm9yIH0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IHsgYmFzZTY0VXJsVG9VaW50OEFycmF5LCBzdHJpbmdGcm9tQmFzZTY0VVJMIH0gZnJvbSAnLi9iYXNlNjR1cmwnO1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGlyZXNBdChleHBpcmVzSW4pIHtcbiAgICBjb25zdCB0aW1lTm93ID0gTWF0aC5yb3VuZChEYXRlLm5vdygpIC8gMTAwMCk7XG4gICAgcmV0dXJuIHRpbWVOb3cgKyBleHBpcmVzSW47XG59XG5leHBvcnQgZnVuY3Rpb24gdXVpZCgpIHtcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgICAgICBjb25zdCByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLCB2ID0gYyA9PSAneCcgPyByIDogKHIgJiAweDMpIHwgMHg4O1xuICAgICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgaXNCcm93c2VyID0gKCkgPT4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcbmNvbnN0IGxvY2FsU3RvcmFnZVdyaXRlVGVzdHMgPSB7XG4gICAgdGVzdGVkOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG59O1xuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBsb2NhbFN0b3JhZ2UgaXMgc3VwcG9ydGVkIG9uIHRoaXMgYnJvd3Nlci5cbiAqL1xuZXhwb3J0IGNvbnN0IHN1cHBvcnRzTG9jYWxTdG9yYWdlID0gKCkgPT4ge1xuICAgIGlmICghaXNCcm93c2VyKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGdsb2JhbFRoaXMubG9jYWxTdG9yYWdlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIERPTSBleGNlcHRpb24gd2hlbiBhY2Nlc3NpbmcgYGxvY2FsU3RvcmFnZWBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAobG9jYWxTdG9yYWdlV3JpdGVUZXN0cy50ZXN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZVdyaXRlVGVzdHMud3JpdGFibGU7XG4gICAgfVxuICAgIGNvbnN0IHJhbmRvbUtleSA9IGBsc3d0LSR7TWF0aC5yYW5kb20oKX0ke01hdGgucmFuZG9tKCl9YDtcbiAgICB0cnkge1xuICAgICAgICBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKHJhbmRvbUtleSwgcmFuZG9tS2V5KTtcbiAgICAgICAgZ2xvYmFsVGhpcy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShyYW5kb21LZXkpO1xuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZVRlc3RzLnRlc3RlZCA9IHRydWU7XG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlVGVzdHMud3JpdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UgY2FuJ3QgYmUgd3JpdHRlbiB0b1xuICAgICAgICAvLyBodHRwczovL3d3dy5jaHJvbWl1bS5vcmcvZm9yLXRlc3RlcnMvYnVnLXJlcG9ydGluZy1ndWlkZWxpbmVzL3VuY2F1Z2h0LXNlY3VyaXR5ZXJyb3ItZmFpbGVkLXRvLXJlYWQtdGhlLWxvY2Fsc3RvcmFnZS1wcm9wZXJ0eS1mcm9tLXdpbmRvdy1hY2Nlc3MtaXMtZGVuaWVkLWZvci10aGlzLWRvY3VtZW50XG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlVGVzdHMudGVzdGVkID0gdHJ1ZTtcbiAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGVUZXN0cy53cml0YWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlV3JpdGVUZXN0cy53cml0YWJsZTtcbn07XG4vKipcbiAqIEV4dHJhY3RzIHBhcmFtZXRlcnMgZW5jb2RlZCBpbiB0aGUgVVJMIGJvdGggaW4gdGhlIHF1ZXJ5IGFuZCBmcmFnbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUGFyYW1ldGVyc0Zyb21VUkwoaHJlZikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoaHJlZik7XG4gICAgaWYgKHVybC5oYXNoICYmIHVybC5oYXNoWzBdID09PSAnIycpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc2hTZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHVybC5oYXNoLnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICBoYXNoU2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIGhhc2ggaXMgbm90IGEgcXVlcnkgc3RyaW5nXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gc2VhcmNoIHBhcmFtZXRlcnMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgaGFzaCBwYXJhbWV0ZXJzXG4gICAgdXJsLnNlYXJjaFBhcmFtcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBjb25zdCByZXNvbHZlRmV0Y2ggPSAoY3VzdG9tRmV0Y2gpID0+IHtcbiAgICBsZXQgX2ZldGNoO1xuICAgIGlmIChjdXN0b21GZXRjaCkge1xuICAgICAgICBfZmV0Y2ggPSBjdXN0b21GZXRjaDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGZldGNoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBfZmV0Y2ggPSAoLi4uYXJncykgPT4gaW1wb3J0KCdAc3VwYWJhc2Uvbm9kZS1mZXRjaCcpLnRoZW4oKHsgZGVmYXVsdDogZmV0Y2ggfSkgPT4gZmV0Y2goLi4uYXJncykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgX2ZldGNoID0gZmV0Y2g7XG4gICAgfVxuICAgIHJldHVybiAoLi4uYXJncykgPT4gX2ZldGNoKC4uLmFyZ3MpO1xufTtcbmV4cG9ydCBjb25zdCBsb29rc0xpa2VGZXRjaFJlc3BvbnNlID0gKG1heWJlUmVzcG9uc2UpID0+IHtcbiAgICByZXR1cm4gKHR5cGVvZiBtYXliZVJlc3BvbnNlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBtYXliZVJlc3BvbnNlICE9PSBudWxsICYmXG4gICAgICAgICdzdGF0dXMnIGluIG1heWJlUmVzcG9uc2UgJiZcbiAgICAgICAgJ29rJyBpbiBtYXliZVJlc3BvbnNlICYmXG4gICAgICAgICdqc29uJyBpbiBtYXliZVJlc3BvbnNlICYmXG4gICAgICAgIHR5cGVvZiBtYXliZVJlc3BvbnNlLmpzb24gPT09ICdmdW5jdGlvbicpO1xufTtcbi8vIFN0b3JhZ2UgaGVscGVyc1xuZXhwb3J0IGNvbnN0IHNldEl0ZW1Bc3luYyA9IGFzeW5jIChzdG9yYWdlLCBrZXksIGRhdGEpID0+IHtcbiAgICBhd2FpdCBzdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59O1xuZXhwb3J0IGNvbnN0IGdldEl0ZW1Bc3luYyA9IGFzeW5jIChzdG9yYWdlLCBrZXkpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICB9XG4gICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHJlbW92ZUl0ZW1Bc3luYyA9IGFzeW5jIChzdG9yYWdlLCBrZXkpID0+IHtcbiAgICBhd2FpdCBzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbn07XG4vKipcbiAqIEEgZGVmZXJyZWQgcmVwcmVzZW50cyBzb21lIGFzeW5jaHJvbm91cyB3b3JrIHRoYXQgaXMgbm90IHlldCBmaW5pc2hlZCwgd2hpY2hcbiAqIG1heSBvciBtYXkgbm90IGN1bG1pbmF0ZSBpbiBhIHZhbHVlLlxuICogVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL21pa2Utbm9ydGgvdHlwZXMvYmxvYi9tYXN0ZXIvc3JjL2FzeW5jLnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZlcnJlZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXh0cmEtc2VtaVxuICAgICAgICA7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBEZWZlcnJlZC5wcm9taXNlQ29uc3RydWN0b3IoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4dHJhLXNlbWlcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlcztcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ID0gcmVqO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5EZWZlcnJlZC5wcm9taXNlQ29uc3RydWN0b3IgPSBQcm9taXNlO1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZUpXVCh0b2tlbikge1xuICAgIGNvbnN0IHBhcnRzID0gdG9rZW4uc3BsaXQoJy4nKTtcbiAgICBpZiAocGFydHMubGVuZ3RoICE9PSAzKSB7XG4gICAgICAgIHRocm93IG5ldyBBdXRoSW52YWxpZEp3dEVycm9yKCdJbnZhbGlkIEpXVCBzdHJ1Y3R1cmUnKTtcbiAgICB9XG4gICAgLy8gUmVnZXggY2hlY2tzIGZvciBiYXNlNjR1cmwgZm9ybWF0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIUJBU0U2NFVSTF9SRUdFWC50ZXN0KHBhcnRzW2ldKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhJbnZhbGlkSnd0RXJyb3IoJ0pXVCBub3QgaW4gYmFzZTY0dXJsIGZvcm1hdCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIC8vIHVzaW5nIGJhc2U2NHVybCBsaWJcbiAgICAgICAgaGVhZGVyOiBKU09OLnBhcnNlKHN0cmluZ0Zyb21CYXNlNjRVUkwocGFydHNbMF0pKSxcbiAgICAgICAgcGF5bG9hZDogSlNPTi5wYXJzZShzdHJpbmdGcm9tQmFzZTY0VVJMKHBhcnRzWzFdKSksXG4gICAgICAgIHNpZ25hdHVyZTogYmFzZTY0VXJsVG9VaW50OEFycmF5KHBhcnRzWzJdKSxcbiAgICAgICAgcmF3OiB7XG4gICAgICAgICAgICBoZWFkZXI6IHBhcnRzWzBdLFxuICAgICAgICAgICAgcGF5bG9hZDogcGFydHNbMV0sXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gZGF0YTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBudWxsIGFmdGVyIHNvbWUgdGltZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNsZWVwKHRpbWUpIHtcbiAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKGFjY2VwdCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGFjY2VwdChudWxsKSwgdGltZSk7XG4gICAgfSk7XG59XG4vKipcbiAqIENvbnZlcnRzIHRoZSBwcm92aWRlZCBhc3luYyBmdW5jdGlvbiBpbnRvIGEgcmV0cnlhYmxlIGZ1bmN0aW9uLiBFYWNoIHJlc3VsdFxuICogb3IgdGhyb3duIGVycm9yIGlzIHNlbnQgdG8gdGhlIGlzUmV0cnlhYmxlIGZ1bmN0aW9uIHdoaWNoIHNob3VsZCByZXR1cm4gdHJ1ZVxuICogaWYgdGhlIGZ1bmN0aW9uIHNob3VsZCBydW4gYWdhaW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXRyeWFibGUoZm4sIGlzUmV0cnlhYmxlKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChhY2NlcHQsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4dHJhLXNlbWlcbiAgICAgICAgO1xuICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCBJbmZpbml0eTsgYXR0ZW1wdCsrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZm4oYXR0ZW1wdCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSZXRyeWFibGUoYXR0ZW1wdCwgbnVsbCwgcmVzdWx0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0KHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JldHJ5YWJsZShhdHRlbXB0LCBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGVjMmhleChkZWMpIHtcbiAgICByZXR1cm4gKCcwJyArIGRlYy50b1N0cmluZygxNikpLnN1YnN0cigtMik7XG59XG4vLyBGdW5jdGlvbnMgYmVsb3cgdGFrZW4gZnJvbTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjMzMDk0MDkvY3JlYXRpbmctYS1jb2RlLXZlcmlmaWVyLWFuZC1jaGFsbGVuZ2UtZm9yLXBrY2UtYXV0aC1vbi1zcG90aWZ5LWFwaS1pbi1yZWFjdGpzXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVQS0NFVmVyaWZpZXIoKSB7XG4gICAgY29uc3QgdmVyaWZpZXJMZW5ndGggPSA1NjtcbiAgICBjb25zdCBhcnJheSA9IG5ldyBVaW50MzJBcnJheSh2ZXJpZmllckxlbmd0aCk7XG4gICAgaWYgKHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IGNoYXJTZXQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODktLl9+JztcbiAgICAgICAgY29uc3QgY2hhclNldExlbiA9IGNoYXJTZXQubGVuZ3RoO1xuICAgICAgICBsZXQgdmVyaWZpZXIgPSAnJztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJpZmllckxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2ZXJpZmllciArPSBjaGFyU2V0LmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0TGVuKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcmlmaWVyO1xuICAgIH1cbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGFycmF5KTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcnJheSwgZGVjMmhleCkuam9pbignJyk7XG59XG5hc3luYyBmdW5jdGlvbiBzaGEyNTYocmFuZG9tU3RyaW5nKSB7XG4gICAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgIGNvbnN0IGVuY29kZWREYXRhID0gZW5jb2Rlci5lbmNvZGUocmFuZG9tU3RyaW5nKTtcbiAgICBjb25zdCBoYXNoID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBlbmNvZGVkRGF0YSk7XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShoYXNoKTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShieXRlcylcbiAgICAgICAgLm1hcCgoYykgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShjKSlcbiAgICAgICAgLmpvaW4oJycpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlUEtDRUNoYWxsZW5nZSh2ZXJpZmllcikge1xuICAgIGNvbnN0IGhhc0NyeXB0b1N1cHBvcnQgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB0eXBlb2YgY3J5cHRvLnN1YnRsZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdHlwZW9mIFRleHRFbmNvZGVyICE9PSAndW5kZWZpbmVkJztcbiAgICBpZiAoIWhhc0NyeXB0b1N1cHBvcnQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdXZWJDcnlwdG8gQVBJIGlzIG5vdCBzdXBwb3J0ZWQuIENvZGUgY2hhbGxlbmdlIG1ldGhvZCB3aWxsIGRlZmF1bHQgdG8gdXNlIHBsYWluIGluc3RlYWQgb2Ygc2hhMjU2LicpO1xuICAgICAgICByZXR1cm4gdmVyaWZpZXI7XG4gICAgfVxuICAgIGNvbnN0IGhhc2hlZCA9IGF3YWl0IHNoYTI1Nih2ZXJpZmllcik7XG4gICAgcmV0dXJuIGJ0b2EoaGFzaGVkKS5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKS5yZXBsYWNlKC89KyQvLCAnJyk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29kZUNoYWxsZW5nZUFuZE1ldGhvZChzdG9yYWdlLCBzdG9yYWdlS2V5LCBpc1Bhc3N3b3JkUmVjb3ZlcnkgPSBmYWxzZSkge1xuICAgIGNvbnN0IGNvZGVWZXJpZmllciA9IGdlbmVyYXRlUEtDRVZlcmlmaWVyKCk7XG4gICAgbGV0IHN0b3JlZENvZGVWZXJpZmllciA9IGNvZGVWZXJpZmllcjtcbiAgICBpZiAoaXNQYXNzd29yZFJlY292ZXJ5KSB7XG4gICAgICAgIHN0b3JlZENvZGVWZXJpZmllciArPSAnL1BBU1NXT1JEX1JFQ09WRVJZJztcbiAgICB9XG4gICAgYXdhaXQgc2V0SXRlbUFzeW5jKHN0b3JhZ2UsIGAke3N0b3JhZ2VLZXl9LWNvZGUtdmVyaWZpZXJgLCBzdG9yZWRDb2RlVmVyaWZpZXIpO1xuICAgIGNvbnN0IGNvZGVDaGFsbGVuZ2UgPSBhd2FpdCBnZW5lcmF0ZVBLQ0VDaGFsbGVuZ2UoY29kZVZlcmlmaWVyKTtcbiAgICBjb25zdCBjb2RlQ2hhbGxlbmdlTWV0aG9kID0gY29kZVZlcmlmaWVyID09PSBjb2RlQ2hhbGxlbmdlID8gJ3BsYWluJyA6ICdzMjU2JztcbiAgICByZXR1cm4gW2NvZGVDaGFsbGVuZ2UsIGNvZGVDaGFsbGVuZ2VNZXRob2RdO1xufVxuLyoqIFBhcnNlcyB0aGUgQVBJIHZlcnNpb24gd2hpY2ggaXMgMllZWS1NTS1ERC4gKi9cbmNvbnN0IEFQSV9WRVJTSU9OX1JFR0VYID0gL14yWzAtOV17M30tKDBbMS05XXwxWzAtMl0pLSgwWzEtOV18MVswLTldfDJbMC05XXwzWzAtMV0pJC9pO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2VBUElWZXJzaW9uKHJlc3BvbnNlKSB7XG4gICAgY29uc3QgYXBpVmVyc2lvbiA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KEFQSV9WRVJTSU9OX0hFQURFUl9OQU1FKTtcbiAgICBpZiAoIWFwaVZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghYXBpVmVyc2lvbi5tYXRjaChBUElfVkVSU0lPTl9SRUdFWCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShgJHthcGlWZXJzaW9ufVQwMDowMDowMC4wWmApO1xuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRXhwKGV4cCkge1xuICAgIGlmICghZXhwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBleHAgY2xhaW0nKTtcbiAgICB9XG4gICAgY29uc3QgdGltZU5vdyA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuICAgIGlmIChleHAgPD0gdGltZU5vdykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pXVCBoYXMgZXhwaXJlZCcpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGdvcml0aG0oYWxnKSB7XG4gICAgc3dpdGNoIChhbGcpIHtcbiAgICAgICAgY2FzZSAnUlMyNTYnOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnUlNBU1NBLVBLQ1MxLXYxXzUnLFxuICAgICAgICAgICAgICAgIGhhc2g6IHsgbmFtZTogJ1NIQS0yNTYnIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlICdFUzI1Nic6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdFQ0RTQScsXG4gICAgICAgICAgICAgICAgbmFtZWRDdXJ2ZTogJ1AtMjU2JyxcbiAgICAgICAgICAgICAgICBoYXNoOiB7IG5hbWU6ICdTSEEtMjU2JyB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhbGcgY2xhaW0nKTtcbiAgICB9XG59XG5jb25zdCBVVUlEX1JFR0VYID0gL15bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXsxMn0kLztcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVVSUQoc3RyKSB7XG4gICAgaWYgKCFVVUlEX1JFR0VYLnRlc3Qoc3RyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0BzdXBhYmFzZS9hdXRoLWpzOiBFeHBlY3RlZCBwYXJhbWV0ZXIgdG8gYmUgVVVJRCBidXQgaXMgbm90Jyk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVscGVycy5qcy5tYXAiLCJ2YXIgX19yZXN0ID0gKHRoaXMgJiYgdGhpcy5fX3Jlc3QpIHx8IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5pbXBvcnQgeyBBUElfVkVSU0lPTlMsIEFQSV9WRVJTSU9OX0hFQURFUl9OQU1FIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZXhwaXJlc0F0LCBsb29rc0xpa2VGZXRjaFJlc3BvbnNlLCBwYXJzZVJlc3BvbnNlQVBJVmVyc2lvbiB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyBBdXRoQXBpRXJyb3IsIEF1dGhSZXRyeWFibGVGZXRjaEVycm9yLCBBdXRoV2Vha1Bhc3N3b3JkRXJyb3IsIEF1dGhVbmtub3duRXJyb3IsIEF1dGhTZXNzaW9uTWlzc2luZ0Vycm9yLCB9IGZyb20gJy4vZXJyb3JzJztcbmNvbnN0IF9nZXRFcnJvck1lc3NhZ2UgPSAoZXJyKSA9PiBlcnIubXNnIHx8IGVyci5tZXNzYWdlIHx8IGVyci5lcnJvcl9kZXNjcmlwdGlvbiB8fCBlcnIuZXJyb3IgfHwgSlNPTi5zdHJpbmdpZnkoZXJyKTtcbmNvbnN0IE5FVFdPUktfRVJST1JfQ09ERVMgPSBbNTAyLCA1MDMsIDUwNF07XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IpIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKCFsb29rc0xpa2VGZXRjaFJlc3BvbnNlKGVycm9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgQXV0aFJldHJ5YWJsZUZldGNoRXJyb3IoX2dldEVycm9yTWVzc2FnZShlcnJvciksIDApO1xuICAgIH1cbiAgICBpZiAoTkVUV09SS19FUlJPUl9DT0RFUy5pbmNsdWRlcyhlcnJvci5zdGF0dXMpKSB7XG4gICAgICAgIC8vIHN0YXR1cyBpbiA1MDAuLi41OTkgcmFuZ2UgLSBzZXJ2ZXIgaGFkIGFuIGVycm9yLCByZXF1ZXN0IG1pZ2h0IGJlIHJldHJ5ZWQuXG4gICAgICAgIHRocm93IG5ldyBBdXRoUmV0cnlhYmxlRmV0Y2hFcnJvcihfZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSwgZXJyb3Iuc3RhdHVzKTtcbiAgICB9XG4gICAgbGV0IGRhdGE7XG4gICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IGF3YWl0IGVycm9yLmpzb24oKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF1dGhVbmtub3duRXJyb3IoX2dldEVycm9yTWVzc2FnZShlKSwgZSk7XG4gICAgfVxuICAgIGxldCBlcnJvckNvZGUgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmVzcG9uc2VBUElWZXJzaW9uID0gcGFyc2VSZXNwb25zZUFQSVZlcnNpb24oZXJyb3IpO1xuICAgIGlmIChyZXNwb25zZUFQSVZlcnNpb24gJiZcbiAgICAgICAgcmVzcG9uc2VBUElWZXJzaW9uLmdldFRpbWUoKSA+PSBBUElfVkVSU0lPTlNbJzIwMjQtMDEtMDEnXS50aW1lc3RhbXAgJiZcbiAgICAgICAgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmXG4gICAgICAgIGRhdGEgJiZcbiAgICAgICAgdHlwZW9mIGRhdGEuY29kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZXJyb3JDb2RlID0gZGF0YS5jb2RlO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgZGF0YSAmJiB0eXBlb2YgZGF0YS5lcnJvcl9jb2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICBlcnJvckNvZGUgPSBkYXRhLmVycm9yX2NvZGU7XG4gICAgfVxuICAgIGlmICghZXJyb3JDb2RlKSB7XG4gICAgICAgIC8vIExlZ2FjeSBzdXBwb3J0IGZvciB3ZWFrIHBhc3N3b3JkIGVycm9ycywgd2hlbiB0aGVyZSB3ZXJlIG5vIGVycm9yIGNvZGVzXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgIGRhdGEgJiZcbiAgICAgICAgICAgIHR5cGVvZiBkYXRhLndlYWtfcGFzc3dvcmQgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICBkYXRhLndlYWtfcGFzc3dvcmQgJiZcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkoZGF0YS53ZWFrX3Bhc3N3b3JkLnJlYXNvbnMpICYmXG4gICAgICAgICAgICBkYXRhLndlYWtfcGFzc3dvcmQucmVhc29ucy5sZW5ndGggJiZcbiAgICAgICAgICAgIGRhdGEud2Vha19wYXNzd29yZC5yZWFzb25zLnJlZHVjZSgoYSwgaSkgPT4gYSAmJiB0eXBlb2YgaSA9PT0gJ3N0cmluZycsIHRydWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQXV0aFdlYWtQYXNzd29yZEVycm9yKF9nZXRFcnJvck1lc3NhZ2UoZGF0YSksIGVycm9yLnN0YXR1cywgZGF0YS53ZWFrX3Bhc3N3b3JkLnJlYXNvbnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGVycm9yQ29kZSA9PT0gJ3dlYWtfcGFzc3dvcmQnKSB7XG4gICAgICAgIHRocm93IG5ldyBBdXRoV2Vha1Bhc3N3b3JkRXJyb3IoX2dldEVycm9yTWVzc2FnZShkYXRhKSwgZXJyb3Iuc3RhdHVzLCAoKF9hID0gZGF0YS53ZWFrX3Bhc3N3b3JkKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVhc29ucykgfHwgW10pO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnJvckNvZGUgPT09ICdzZXNzaW9uX25vdF9mb3VuZCcpIHtcbiAgICAgICAgLy8gVGhlIGBzZXNzaW9uX2lkYCBpbnNpZGUgdGhlIEpXVCBkb2VzIG5vdCBjb3JyZXNwb25kIHRvIGEgcm93IGluIHRoZVxuICAgICAgICAvLyBgc2Vzc2lvbnNgIHRhYmxlLiBUaGlzIHVzdWFsbHkgbWVhbnMgdGhlIHVzZXIgaGFzIHNpZ25lZCBvdXQsIGhhcyBiZWVuXG4gICAgICAgIC8vIGRlbGV0ZWQsIG9yIHRoZWlyIHNlc3Npb24gaGFzIHNvbWVob3cgYmVlbiB0ZXJtaW5hdGVkLlxuICAgICAgICB0aHJvdyBuZXcgQXV0aFNlc3Npb25NaXNzaW5nRXJyb3IoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEF1dGhBcGlFcnJvcihfZ2V0RXJyb3JNZXNzYWdlKGRhdGEpLCBlcnJvci5zdGF0dXMgfHwgNTAwLCBlcnJvckNvZGUpO1xufVxuY29uc3QgX2dldFJlcXVlc3RQYXJhbXMgPSAobWV0aG9kLCBvcHRpb25zLCBwYXJhbWV0ZXJzLCBib2R5KSA9PiB7XG4gICAgY29uc3QgcGFyYW1zID0geyBtZXRob2QsIGhlYWRlcnM6IChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaGVhZGVycykgfHwge30gfTtcbiAgICBpZiAobWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cbiAgICBwYXJhbXMuaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCcgfSwgb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmhlYWRlcnMpO1xuICAgIHBhcmFtcy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKSwgcGFyYW1ldGVycyk7XG59O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9yZXF1ZXN0KGZldGNoZXIsIG1ldGhvZCwgdXJsLCBvcHRpb25zKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGhlYWRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaGVhZGVycyk7XG4gICAgaWYgKCFoZWFkZXJzW0FQSV9WRVJTSU9OX0hFQURFUl9OQU1FXSkge1xuICAgICAgICBoZWFkZXJzW0FQSV9WRVJTSU9OX0hFQURFUl9OQU1FXSA9IEFQSV9WRVJTSU9OU1snMjAyNC0wMS0wMSddLm5hbWU7XG4gICAgfVxuICAgIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuand0KSB7XG4gICAgICAgIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHtvcHRpb25zLmp3dH1gO1xuICAgIH1cbiAgICBjb25zdCBxcyA9IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5xdWVyeSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG4gICAgaWYgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5yZWRpcmVjdFRvKSB7XG4gICAgICAgIHFzWydyZWRpcmVjdF90byddID0gb3B0aW9ucy5yZWRpcmVjdFRvO1xuICAgIH1cbiAgICBjb25zdCBxdWVyeVN0cmluZyA9IE9iamVjdC5rZXlzKHFzKS5sZW5ndGggPyAnPycgKyBuZXcgVVJMU2VhcmNoUGFyYW1zKHFzKS50b1N0cmluZygpIDogJyc7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IF9oYW5kbGVSZXF1ZXN0KGZldGNoZXIsIG1ldGhvZCwgdXJsICsgcXVlcnlTdHJpbmcsIHtcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgbm9SZXNvbHZlSnNvbjogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLm5vUmVzb2x2ZUpzb24sXG4gICAgfSwge30sIG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5ib2R5KTtcbiAgICByZXR1cm4gKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy54Zm9ybSkgPyBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMueGZvcm0oZGF0YSkgOiB7IGRhdGE6IE9iamVjdC5hc3NpZ24oe30sIGRhdGEpLCBlcnJvcjogbnVsbCB9O1xufVxuYXN5bmMgZnVuY3Rpb24gX2hhbmRsZVJlcXVlc3QoZmV0Y2hlciwgbWV0aG9kLCB1cmwsIG9wdGlvbnMsIHBhcmFtZXRlcnMsIGJvZHkpIHtcbiAgICBjb25zdCByZXF1ZXN0UGFyYW1zID0gX2dldFJlcXVlc3RQYXJhbXMobWV0aG9kLCBvcHRpb25zLCBwYXJhbWV0ZXJzLCBib2R5KTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IGZldGNoZXIodXJsLCBPYmplY3QuYXNzaWduKHt9LCByZXF1ZXN0UGFyYW1zKSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIC8vIGZldGNoIGZhaWxlZCwgbGlrZWx5IGR1ZSB0byBhIG5ldHdvcmsgb3IgQ09SUyBlcnJvclxuICAgICAgICB0aHJvdyBuZXcgQXV0aFJldHJ5YWJsZUZldGNoRXJyb3IoX2dldEVycm9yTWVzc2FnZShlKSwgMCk7XG4gICAgfVxuICAgIGlmICghcmVzdWx0Lm9rKSB7XG4gICAgICAgIGF3YWl0IGhhbmRsZUVycm9yKHJlc3VsdCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMubm9SZXNvbHZlSnNvbikge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgcmVzdWx0Lmpzb24oKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgYXdhaXQgaGFuZGxlRXJyb3IoZSk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIF9zZXNzaW9uUmVzcG9uc2UoZGF0YSkge1xuICAgIHZhciBfYTtcbiAgICBsZXQgc2Vzc2lvbiA9IG51bGw7XG4gICAgaWYgKGhhc1Nlc3Npb24oZGF0YSkpIHtcbiAgICAgICAgc2Vzc2lvbiA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEpO1xuICAgICAgICBpZiAoIWRhdGEuZXhwaXJlc19hdCkge1xuICAgICAgICAgICAgc2Vzc2lvbi5leHBpcmVzX2F0ID0gZXhwaXJlc0F0KGRhdGEuZXhwaXJlc19pbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdXNlciA9IChfYSA9IGRhdGEudXNlcikgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZGF0YTtcbiAgICByZXR1cm4geyBkYXRhOiB7IHNlc3Npb24sIHVzZXIgfSwgZXJyb3I6IG51bGwgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBfc2Vzc2lvblJlc3BvbnNlUGFzc3dvcmQoZGF0YSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gX3Nlc3Npb25SZXNwb25zZShkYXRhKTtcbiAgICBpZiAoIXJlc3BvbnNlLmVycm9yICYmXG4gICAgICAgIGRhdGEud2Vha19wYXNzd29yZCAmJlxuICAgICAgICB0eXBlb2YgZGF0YS53ZWFrX3Bhc3N3b3JkID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KGRhdGEud2Vha19wYXNzd29yZC5yZWFzb25zKSAmJlxuICAgICAgICBkYXRhLndlYWtfcGFzc3dvcmQucmVhc29ucy5sZW5ndGggJiZcbiAgICAgICAgZGF0YS53ZWFrX3Bhc3N3b3JkLm1lc3NhZ2UgJiZcbiAgICAgICAgdHlwZW9mIGRhdGEud2Vha19wYXNzd29yZC5tZXNzYWdlID09PSAnc3RyaW5nJyAmJlxuICAgICAgICBkYXRhLndlYWtfcGFzc3dvcmQucmVhc29ucy5yZWR1Y2UoKGEsIGkpID0+IGEgJiYgdHlwZW9mIGkgPT09ICdzdHJpbmcnLCB0cnVlKSkge1xuICAgICAgICByZXNwb25zZS5kYXRhLndlYWtfcGFzc3dvcmQgPSBkYXRhLndlYWtfcGFzc3dvcmQ7XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBfdXNlclJlc3BvbnNlKGRhdGEpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgdXNlciA9IChfYSA9IGRhdGEudXNlcikgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZGF0YTtcbiAgICByZXR1cm4geyBkYXRhOiB7IHVzZXIgfSwgZXJyb3I6IG51bGwgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBfc3NvUmVzcG9uc2UoZGF0YSkge1xuICAgIHJldHVybiB7IGRhdGEsIGVycm9yOiBudWxsIH07XG59XG5leHBvcnQgZnVuY3Rpb24gX2dlbmVyYXRlTGlua1Jlc3BvbnNlKGRhdGEpIHtcbiAgICBjb25zdCB7IGFjdGlvbl9saW5rLCBlbWFpbF9vdHAsIGhhc2hlZF90b2tlbiwgcmVkaXJlY3RfdG8sIHZlcmlmaWNhdGlvbl90eXBlIH0gPSBkYXRhLCByZXN0ID0gX19yZXN0KGRhdGEsIFtcImFjdGlvbl9saW5rXCIsIFwiZW1haWxfb3RwXCIsIFwiaGFzaGVkX3Rva2VuXCIsIFwicmVkaXJlY3RfdG9cIiwgXCJ2ZXJpZmljYXRpb25fdHlwZVwiXSk7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHtcbiAgICAgICAgYWN0aW9uX2xpbmssXG4gICAgICAgIGVtYWlsX290cCxcbiAgICAgICAgaGFzaGVkX3Rva2VuLFxuICAgICAgICByZWRpcmVjdF90byxcbiAgICAgICAgdmVyaWZpY2F0aW9uX3R5cGUsXG4gICAgfTtcbiAgICBjb25zdCB1c2VyID0gT2JqZWN0LmFzc2lnbih7fSwgcmVzdCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcHJvcGVydGllcyxcbiAgICAgICAgICAgIHVzZXIsXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gX25vUmVzb2x2ZUpzb25SZXNwb25zZShkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGE7XG59XG4vKipcbiAqIGhhc1Nlc3Npb24gY2hlY2tzIGlmIHRoZSByZXNwb25zZSBvYmplY3QgY29udGFpbnMgYSB2YWxpZCBzZXNzaW9uXG4gKiBAcGFyYW0gZGF0YSBBIHJlc3BvbnNlIG9iamVjdFxuICogQHJldHVybnMgdHJ1ZSBpZiBhIHNlc3Npb24gaXMgaW4gdGhlIHJlc3BvbnNlXG4gKi9cbmZ1bmN0aW9uIGhhc1Nlc3Npb24oZGF0YSkge1xuICAgIHJldHVybiBkYXRhLmFjY2Vzc190b2tlbiAmJiBkYXRhLnJlZnJlc2hfdG9rZW4gJiYgZGF0YS5leHBpcmVzX2luO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmV0Y2guanMubWFwIiwiZXhwb3J0IGNvbnN0IFNJR05fT1VUX1NDT1BFUyA9IFsnZ2xvYmFsJywgJ2xvY2FsJywgJ290aGVycyddO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHlwZXMuanMubWFwIiwidmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuaW1wb3J0IHsgX2dlbmVyYXRlTGlua1Jlc3BvbnNlLCBfbm9SZXNvbHZlSnNvblJlc3BvbnNlLCBfcmVxdWVzdCwgX3VzZXJSZXNwb25zZSwgfSBmcm9tICcuL2xpYi9mZXRjaCc7XG5pbXBvcnQgeyByZXNvbHZlRmV0Y2gsIHZhbGlkYXRlVVVJRCB9IGZyb20gJy4vbGliL2hlbHBlcnMnO1xuaW1wb3J0IHsgU0lHTl9PVVRfU0NPUEVTLCB9IGZyb20gJy4vbGliL3R5cGVzJztcbmltcG9ydCB7IGlzQXV0aEVycm9yIH0gZnJvbSAnLi9saWIvZXJyb3JzJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdvVHJ1ZUFkbWluQXBpIHtcbiAgICBjb25zdHJ1Y3Rvcih7IHVybCA9ICcnLCBoZWFkZXJzID0ge30sIGZldGNoLCB9KSB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgICB0aGlzLmZldGNoID0gcmVzb2x2ZUZldGNoKGZldGNoKTtcbiAgICAgICAgdGhpcy5tZmEgPSB7XG4gICAgICAgICAgICBsaXN0RmFjdG9yczogdGhpcy5fbGlzdEZhY3RvcnMuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGRlbGV0ZUZhY3RvcjogdGhpcy5fZGVsZXRlRmFjdG9yLmJpbmQodGhpcyksXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBsb2dnZWQtaW4gc2Vzc2lvbi5cbiAgICAgKiBAcGFyYW0gand0IEEgdmFsaWQsIGxvZ2dlZC1pbiBKV1QuXG4gICAgICogQHBhcmFtIHNjb3BlIFRoZSBsb2dvdXQgc29wZS5cbiAgICAgKi9cbiAgICBhc3luYyBzaWduT3V0KGp3dCwgc2NvcGUgPSBTSUdOX09VVF9TQ09QRVNbMF0pIHtcbiAgICAgICAgaWYgKFNJR05fT1VUX1NDT1BFUy5pbmRleE9mKHNjb3BlKSA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQHN1cGFiYXNlL2F1dGgtanM6IFBhcmFtZXRlciBzY29wZSBtdXN0IGJlIG9uZSBvZiAke1NJR05fT1VUX1NDT1BFUy5qb2luKCcsICcpfWApO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUE9TVCcsIGAke3RoaXMudXJsfS9sb2dvdXQ/c2NvcGU9JHtzY29wZX1gLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIGp3dCxcbiAgICAgICAgICAgICAgICBub1Jlc29sdmVKc29uOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhbiBpbnZpdGUgbGluayB0byBhbiBlbWFpbCBhZGRyZXNzLlxuICAgICAqIEBwYXJhbSBlbWFpbCBUaGUgZW1haWwgYWRkcmVzcyBvZiB0aGUgdXNlci5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBBZGRpdGlvbmFsIG9wdGlvbnMgdG8gYmUgaW5jbHVkZWQgd2hlbiBpbnZpdGluZy5cbiAgICAgKi9cbiAgICBhc3luYyBpbnZpdGVVc2VyQnlFbWFpbChlbWFpbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BPU1QnLCBgJHt0aGlzLnVybH0vaW52aXRlYCwge1xuICAgICAgICAgICAgICAgIGJvZHk6IHsgZW1haWwsIGRhdGE6IG9wdGlvbnMuZGF0YSB9LFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiBvcHRpb25zLnJlZGlyZWN0VG8sXG4gICAgICAgICAgICAgICAgeGZvcm06IF91c2VyUmVzcG9uc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBlbWFpbCBsaW5rcyBhbmQgT1RQcyB0byBiZSBzZW50IHZpYSBhIGN1c3RvbSBlbWFpbCBwcm92aWRlci5cbiAgICAgKiBAcGFyYW0gZW1haWwgVGhlIHVzZXIncyBlbWFpbC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5wYXNzd29yZCBVc2VyIHBhc3N3b3JkLiBGb3Igc2lnbnVwIG9ubHkuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZGF0YSBPcHRpb25hbCB1c2VyIG1ldGFkYXRhLiBGb3Igc2lnbnVwIG9ubHkuXG4gICAgICogQHBhcmFtIG9wdGlvbnMucmVkaXJlY3RUbyBUaGUgcmVkaXJlY3QgdXJsIHdoaWNoIHNob3VsZCBiZSBhcHBlbmRlZCB0byB0aGUgZ2VuZXJhdGVkIGxpbmtcbiAgICAgKi9cbiAgICBhc3luYyBnZW5lcmF0ZUxpbmsocGFyYW1zKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMgfSA9IHBhcmFtcywgcmVzdCA9IF9fcmVzdChwYXJhbXMsIFtcIm9wdGlvbnNcIl0pO1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcmVzdCksIG9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKCduZXdFbWFpbCcgaW4gcmVzdCkge1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgbmV3RW1haWwgd2l0aCBuZXdfZW1haWwgaW4gcmVxdWVzdCBib2R5XG4gICAgICAgICAgICAgICAgYm9keS5uZXdfZW1haWwgPSByZXN0ID09PSBudWxsIHx8IHJlc3QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHJlc3QubmV3RW1haWw7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGJvZHlbJ25ld0VtYWlsJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BPU1QnLCBgJHt0aGlzLnVybH0vYWRtaW4vZ2VuZXJhdGVfbGlua2AsIHtcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5LFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICB4Zm9ybTogX2dlbmVyYXRlTGlua1Jlc3BvbnNlLFxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5yZWRpcmVjdFRvLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVc2VyIEFkbWluIEFQSVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgdXNlci5cbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbiBhIHNlcnZlci4gTmV2ZXIgZXhwb3NlIHlvdXIgYHNlcnZpY2Vfcm9sZWAga2V5IGluIHRoZSBicm93c2VyLlxuICAgICAqL1xuICAgIGFzeW5jIGNyZWF0ZVVzZXIoYXR0cmlidXRlcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L2FkbWluL3VzZXJzYCwge1xuICAgICAgICAgICAgICAgIGJvZHk6IGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIHhmb3JtOiBfdXNlclJlc3BvbnNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgYSBsaXN0IG9mIHVzZXJzLlxuICAgICAqXG4gICAgICogVGhpcyBmdW5jdGlvbiBzaG91bGQgb25seSBiZSBjYWxsZWQgb24gYSBzZXJ2ZXIuIE5ldmVyIGV4cG9zZSB5b3VyIGBzZXJ2aWNlX3JvbGVgIGtleSBpbiB0aGUgYnJvd3Nlci5cbiAgICAgKiBAcGFyYW0gcGFyYW1zIEFuIG9iamVjdCB3aGljaCBzdXBwb3J0cyBgcGFnZWAgYW5kIGBwZXJQYWdlYCBhcyBudW1iZXJzLCB0byBhbHRlciB0aGUgcGFnaW5hdGVkIHJlc3VsdHMuXG4gICAgICovXG4gICAgYXN5bmMgbGlzdFVzZXJzKHBhcmFtcykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2c7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYWdpbmF0aW9uID0geyBuZXh0UGFnZTogbnVsbCwgbGFzdFBhZ2U6IDAsIHRvdGFsOiAwIH07XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdHRVQnLCBgJHt0aGlzLnVybH0vYWRtaW4vdXNlcnNgLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIG5vUmVzb2x2ZUpzb246IHRydWUsXG4gICAgICAgICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogKF9iID0gKF9hID0gcGFyYW1zID09PSBudWxsIHx8IHBhcmFtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyYW1zLnBhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b1N0cmluZygpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcGVyX3BhZ2U6IChfZCA9IChfYyA9IHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy5wZXJQYWdlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MudG9TdHJpbmcoKSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogJycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB4Zm9ybTogX25vUmVzb2x2ZUpzb25SZXNwb25zZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKVxuICAgICAgICAgICAgICAgIHRocm93IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICAgICAgY29uc3QgdXNlcnMgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCB0b3RhbCA9IChfZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCd4LXRvdGFsLWNvdW50JykpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IDA7XG4gICAgICAgICAgICBjb25zdCBsaW5rcyA9IChfZyA9IChfZiA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdsaW5rJykpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5zcGxpdCgnLCcpKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiBbXTtcbiAgICAgICAgICAgIGlmIChsaW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGlua3MuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQobGluay5zcGxpdCgnOycpWzBdLnNwbGl0KCc9JylbMV0uc3Vic3RyaW5nKDAsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsID0gSlNPTi5wYXJzZShsaW5rLnNwbGl0KCc7JylbMV0uc3BsaXQoJz0nKVsxXSk7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25bYCR7cmVsfVBhZ2VgXSA9IHBhZ2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbi50b3RhbCA9IHBhcnNlSW50KHRvdGFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdXNlcnMpLCBwYWdpbmF0aW9uKSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXJzOiBbXSB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHVzZXIgYnkgaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdWlkIFRoZSB1c2VyJ3MgdW5pcXVlIGlkZW50aWZpZXJcbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uIGEgc2VydmVyLiBOZXZlciBleHBvc2UgeW91ciBgc2VydmljZV9yb2xlYCBrZXkgaW4gdGhlIGJyb3dzZXIuXG4gICAgICovXG4gICAgYXN5bmMgZ2V0VXNlckJ5SWQodWlkKSB7XG4gICAgICAgIHZhbGlkYXRlVVVJRCh1aWQpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdHRVQnLCBgJHt0aGlzLnVybH0vYWRtaW4vdXNlcnMvJHt1aWR9YCwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICB4Zm9ybTogX3VzZXJSZXNwb25zZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgdXNlciBkYXRhLlxuICAgICAqXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZXMgVGhlIGRhdGEgeW91IHdhbnQgdG8gdXBkYXRlLlxuICAgICAqXG4gICAgICogVGhpcyBmdW5jdGlvbiBzaG91bGQgb25seSBiZSBjYWxsZWQgb24gYSBzZXJ2ZXIuIE5ldmVyIGV4cG9zZSB5b3VyIGBzZXJ2aWNlX3JvbGVgIGtleSBpbiB0aGUgYnJvd3Nlci5cbiAgICAgKi9cbiAgICBhc3luYyB1cGRhdGVVc2VyQnlJZCh1aWQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFsaWRhdGVVVUlEKHVpZCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BVVCcsIGAke3RoaXMudXJsfS9hZG1pbi91c2Vycy8ke3VpZH1gLCB7XG4gICAgICAgICAgICAgICAgYm9keTogYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgeGZvcm06IF91c2VyUmVzcG9uc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBhIHVzZXIuIFJlcXVpcmVzIGEgYHNlcnZpY2Vfcm9sZWAga2V5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIFRoZSB1c2VyIGlkIHlvdSB3YW50IHRvIHJlbW92ZS5cbiAgICAgKiBAcGFyYW0gc2hvdWxkU29mdERlbGV0ZSBJZiB0cnVlLCB0aGVuIHRoZSB1c2VyIHdpbGwgYmUgc29mdC1kZWxldGVkIGZyb20gdGhlIGF1dGggc2NoZW1hLiBTb2Z0IGRlbGV0aW9uIGFsbG93cyB1c2VyIGlkZW50aWZpY2F0aW9uIGZyb20gdGhlIGhhc2hlZCB1c2VyIElEIGJ1dCBpcyBub3QgcmV2ZXJzaWJsZS5cbiAgICAgKiBEZWZhdWx0cyB0byBmYWxzZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS5cbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uIGEgc2VydmVyLiBOZXZlciBleHBvc2UgeW91ciBgc2VydmljZV9yb2xlYCBrZXkgaW4gdGhlIGJyb3dzZXIuXG4gICAgICovXG4gICAgYXN5bmMgZGVsZXRlVXNlcihpZCwgc2hvdWxkU29mdERlbGV0ZSA9IGZhbHNlKSB7XG4gICAgICAgIHZhbGlkYXRlVVVJRChpZCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ0RFTEVURScsIGAke3RoaXMudXJsfS9hZG1pbi91c2Vycy8ke2lkfWAsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICBzaG91bGRfc29mdF9kZWxldGU6IHNob3VsZFNvZnREZWxldGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB4Zm9ybTogX3VzZXJSZXNwb25zZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgX2xpc3RGYWN0b3JzKHBhcmFtcykge1xuICAgICAgICB2YWxpZGF0ZVVVSUQocGFyYW1zLnVzZXJJZCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnR0VUJywgYCR7dGhpcy51cmx9L2FkbWluL3VzZXJzLyR7cGFyYW1zLnVzZXJJZH0vZmFjdG9yc2AsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgeGZvcm06IChmYWN0b3JzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgZmFjdG9ycyB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IGRhdGEsIGVycm9yIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIF9kZWxldGVGYWN0b3IocGFyYW1zKSB7XG4gICAgICAgIHZhbGlkYXRlVVVJRChwYXJhbXMudXNlcklkKTtcbiAgICAgICAgdmFsaWRhdGVVVUlEKHBhcmFtcy5pZCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ0RFTEVURScsIGAke3RoaXMudXJsfS9hZG1pbi91c2Vycy8ke3BhcmFtcy51c2VySWR9L2ZhY3RvcnMvJHtwYXJhbXMuaWR9YCwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Hb1RydWVBZG1pbkFwaS5qcy5tYXAiLCJpbXBvcnQgeyBzdXBwb3J0c0xvY2FsU3RvcmFnZSB9IGZyb20gJy4vaGVscGVycyc7XG4vKipcbiAqIFByb3ZpZGVzIHNhZmUgYWNjZXNzIHRvIHRoZSBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZSBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGNvbnN0IGxvY2FsU3RvcmFnZUFkYXB0ZXIgPSB7XG4gICAgZ2V0SXRlbTogKGtleSkgPT4ge1xuICAgICAgICBpZiAoIXN1cHBvcnRzTG9jYWxTdG9yYWdlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfSxcbiAgICBzZXRJdGVtOiAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIXN1cHBvcnRzTG9jYWxTdG9yYWdlKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgIH0sXG4gICAgcmVtb3ZlSXRlbTogKGtleSkgPT4ge1xuICAgICAgICBpZiAoIXN1cHBvcnRzTG9jYWxTdG9yYWdlKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnbG9iYWxUaGlzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgfSxcbn07XG4vKipcbiAqIFJldHVybnMgYSBsb2NhbFN0b3JhZ2UtbGlrZSBvYmplY3QgdGhhdCBzdG9yZXMgdGhlIGtleS12YWx1ZSBwYWlycyBpblxuICogbWVtb3J5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVtb3J5TG9jYWxTdG9yYWdlQWRhcHRlcihzdG9yZSA9IHt9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0SXRlbTogKGtleSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlW2tleV0gfHwgbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SXRlbTogKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIHN0b3JlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlSXRlbTogKGtleSkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHN0b3JlW2tleV07XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvY2FsLXN0b3JhZ2UuanMubWFwIiwiLyoqXG4gKiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvZ2xvYmFsdGhpc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxHbG9iYWxUaGlzKCkge1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpXG4gICAgICAgIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ19fbWFnaWNfXycsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgJ0FsbG93IGFjY2VzcyB0byBtYWdpYydcbiAgICAgICAgX19tYWdpY19fLmdsb2JhbFRoaXMgPSBfX21hZ2ljX187XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgJ0FsbG93IGFjY2VzcyB0byBtYWdpYydcbiAgICAgICAgZGVsZXRlIE9iamVjdC5wcm90b3R5cGUuX19tYWdpY19fO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yICdBbGxvdyBhY2Nlc3MgdG8gZ2xvYmFscydcbiAgICAgICAgICAgIHNlbGYuZ2xvYmFsVGhpcyA9IHNlbGY7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wb2x5ZmlsbHMuanMubWFwIiwiaW1wb3J0IHsgc3VwcG9ydHNMb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2hlbHBlcnMnO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBjb25zdCBpbnRlcm5hbHMgPSB7XG4gICAgLyoqXG4gICAgICogQGV4cGVyaW1lbnRhbFxuICAgICAqL1xuICAgIGRlYnVnOiAhIShnbG9iYWxUaGlzICYmXG4gICAgICAgIHN1cHBvcnRzTG9jYWxTdG9yYWdlKCkgJiZcbiAgICAgICAgZ2xvYmFsVGhpcy5sb2NhbFN0b3JhZ2UgJiZcbiAgICAgICAgZ2xvYmFsVGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc3VwYWJhc2UuZ290cnVlLWpzLmxvY2tzLmRlYnVnJykgPT09ICd0cnVlJyksXG59O1xuLyoqXG4gKiBBbiBlcnJvciB0aHJvd24gd2hlbiBhIGxvY2sgY2Fubm90IGJlIGFjcXVpcmVkIGFmdGVyIHNvbWUgYW1vdW50IG9mIHRpbWUuXG4gKlxuICogVXNlIHRoZSB7QGxpbmsgI2lzQWNxdWlyZVRpbWVvdXR9IHByb3BlcnR5IGluc3RlYWQgb2YgY2hlY2tpbmcgd2l0aCBgaW5zdGFuY2VvZmAuXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NrQWNxdWlyZVRpbWVvdXRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmlzQWNxdWlyZVRpbWVvdXQgPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBOYXZpZ2F0b3JMb2NrQWNxdWlyZVRpbWVvdXRFcnJvciBleHRlbmRzIExvY2tBY3F1aXJlVGltZW91dEVycm9yIHtcbn1cbmV4cG9ydCBjbGFzcyBQcm9jZXNzTG9ja0FjcXVpcmVUaW1lb3V0RXJyb3IgZXh0ZW5kcyBMb2NrQWNxdWlyZVRpbWVvdXRFcnJvciB7XG59XG4vKipcbiAqIEltcGxlbWVudHMgYSBnbG9iYWwgZXhjbHVzaXZlIGxvY2sgdXNpbmcgdGhlIE5hdmlnYXRvciBMb2NrTWFuYWdlciBBUEkuIEl0XG4gKiBpcyBhdmFpbGFibGUgb24gYWxsIGJyb3dzZXJzIHJlbGVhc2VkIGFmdGVyIDIwMjItMDMtMTUgd2l0aCBTYWZhcmkgYmVpbmcgdGhlXG4gKiBsYXN0IG9uZSB0byByZWxlYXNlIHN1cHBvcnQuIElmIHRoZSBBUEkgaXMgbm90IGF2YWlsYWJsZSwgdGhpcyBmdW5jdGlvbiB3aWxsXG4gKiB0aHJvdy4gTWFrZSBzdXJlIHlvdSBjaGVjayBhdmFpbGFibGlsaXR5IGJlZm9yZSBjb25maWd1cmluZyB7QGxpbmtcbiAqIEdvVHJ1ZUNsaWVudH0uXG4gKlxuICogWW91IGNhbiB0dXJuIG9uIGRlYnVnZ2luZyBieSBzZXR0aW5nIHRoZSBgc3VwYWJhc2UuZ290cnVlLWpzLmxvY2tzLmRlYnVnYFxuICogbG9jYWwgc3RvcmFnZSBpdGVtIHRvIGB0cnVlYC5cbiAqXG4gKiBJbnRlcm5hbHM6XG4gKlxuICogU2luY2UgdGhlIExvY2tNYW5hZ2VyIEFQSSBkb2VzIG5vdCBwcmVzZXJ2ZSBzdGFjayB0cmFjZXMgZm9yIHRoZSBhc3luY1xuICogZnVuY3Rpb24gcGFzc2VkIGluIHRoZSBgcmVxdWVzdGAgbWV0aG9kLCBhIHRyaWNrIGlzIHVzZWQgd2hlcmUgYWNxdWlyaW5nIHRoZVxuICogbG9jayByZWxlYXNlcyBhIHByZXZpb3VzbHkgc3RhcnRlZCBwcm9taXNlIHRvIHJ1biB0aGUgb3BlcmF0aW9uIGluIHRoZSBgZm5gXG4gKiBmdW5jdGlvbi4gVGhlIGxvY2sgd2FpdHMgZm9yIHRoYXQgcHJvbWlzZSB0byBmaW5pc2ggKHdpdGggb3Igd2l0aG91dCBlcnJvciksXG4gKiB3aGlsZSB0aGUgZnVuY3Rpb24gd2lsbCBmaW5hbGx5IHdhaXQgZm9yIHRoZSByZXN1bHQgYW55d2F5LlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGxvY2sgdG8gYmUgYWNxdWlyZWQuXG4gKiBAcGFyYW0gYWNxdWlyZVRpbWVvdXQgSWYgbmVnYXRpdmUsIG5vIHRpbWVvdXQuIElmIDAgYW4gZXJyb3IgaXMgdGhyb3duIGlmXG4gKiAgICAgICAgICAgICAgICAgICAgICAgdGhlIGxvY2sgY2FuJ3QgYmUgYWNxdWlyZWQgd2l0aG91dCB3YWl0aW5nLiBJZiBwb3NpdGl2ZSwgdGhlIGxvY2sgYWNxdWlyZVxuICogICAgICAgICAgICAgICAgICAgICAgIHdpbGwgdGltZSBvdXQgYWZ0ZXIgc28gbWFueSBtaWxsaXNlY29uZHMuIEFuIGVycm9yIGlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgYSB0aW1lb3V0IGlmIGl0IGhhcyBgaXNBY3F1aXJlVGltZW91dGAgc2V0IHRvIHRydWUuXG4gKiBAcGFyYW0gZm4gVGhlIG9wZXJhdGlvbiB0byBydW4gb25jZSB0aGUgbG9jayBpcyBhY3F1aXJlZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRvckxvY2sobmFtZSwgYWNxdWlyZVRpbWVvdXQsIGZuKSB7XG4gICAgaWYgKGludGVybmFscy5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnQHN1cGFiYXNlL2dvdHJ1ZS1qczogbmF2aWdhdG9yTG9jazogYWNxdWlyZSBsb2NrJywgbmFtZSwgYWNxdWlyZVRpbWVvdXQpO1xuICAgIH1cbiAgICBjb25zdCBhYm9ydENvbnRyb2xsZXIgPSBuZXcgZ2xvYmFsVGhpcy5BYm9ydENvbnRyb2xsZXIoKTtcbiAgICBpZiAoYWNxdWlyZVRpbWVvdXQgPiAwKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgYWJvcnRDb250cm9sbGVyLmFib3J0KCk7XG4gICAgICAgICAgICBpZiAoaW50ZXJuYWxzLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0BzdXBhYmFzZS9nb3RydWUtanM6IG5hdmlnYXRvckxvY2sgYWNxdWlyZSB0aW1lZCBvdXQnLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgYWNxdWlyZVRpbWVvdXQpO1xuICAgIH1cbiAgICAvLyBNRE4gYXJ0aWNsZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0xvY2tNYW5hZ2VyL3JlcXVlc3RcbiAgICAvLyBXcmFwcGluZyBuYXZpZ2F0b3IubG9ja3MucmVxdWVzdCgpIHdpdGggYSBwbGFpbiBQcm9taXNlIGlzIGRvbmUgYXMgc29tZVxuICAgIC8vIGxpYnJhcmllcyBsaWtlIHpvbmUuanMgcGF0Y2ggdGhlIFByb21pc2Ugb2JqZWN0IHRvIHRyYWNrIHRoZSBleGVjdXRpb25cbiAgICAvLyBjb250ZXh0LiBIb3dldmVyLCBpdCBhcHBlYXJzIHRoYXQgbW9zdCBicm93c2VycyB1c2UgYW4gaW50ZXJuYWwgcHJvbWlzZVxuICAgIC8vIGltcGxlbWVudGF0aW9uIHdoZW4gdXNpbmcgdGhlIG5hdmlnYXRvci5sb2Nrcy5yZXF1ZXN0KCkgQVBJIGNhdXNpbmcgdGhlbVxuICAgIC8vIHRvIGxvc2UgY29udGV4dCBhbmQgZW1pdCBjb25mdXNpbmcgbG9nIG1lc3NhZ2VzIG9yIGJyZWFrIGNlcnRhaW4gZmVhdHVyZXMuXG4gICAgLy8gVGhpcyB3cmFwcGluZyBpcyBiZWxpZXZlZCB0byBoZWxwIHpvbmUuanMgdHJhY2sgdGhlIGV4ZWN1dGlvbiBjb250ZXh0XG4gICAgLy8gYmV0dGVyLlxuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IGdsb2JhbFRoaXMubmF2aWdhdG9yLmxvY2tzLnJlcXVlc3QobmFtZSwgYWNxdWlyZVRpbWVvdXQgPT09IDBcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBtb2RlOiAnZXhjbHVzaXZlJyxcbiAgICAgICAgICAgIGlmQXZhaWxhYmxlOiB0cnVlLFxuICAgICAgICB9XG4gICAgICAgIDoge1xuICAgICAgICAgICAgbW9kZTogJ2V4Y2x1c2l2ZScsXG4gICAgICAgICAgICBzaWduYWw6IGFib3J0Q29udHJvbGxlci5zaWduYWwsXG4gICAgICAgIH0sIGFzeW5jIChsb2NrKSA9PiB7XG4gICAgICAgIGlmIChsb2NrKSB7XG4gICAgICAgICAgICBpZiAoaW50ZXJuYWxzLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0BzdXBhYmFzZS9nb3RydWUtanM6IG5hdmlnYXRvckxvY2s6IGFjcXVpcmVkJywgbmFtZSwgbG9jay5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJuYWxzLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdAc3VwYWJhc2UvZ290cnVlLWpzOiBuYXZpZ2F0b3JMb2NrOiByZWxlYXNlZCcsIG5hbWUsIGxvY2submFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGFjcXVpcmVUaW1lb3V0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludGVybmFscy5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQHN1cGFiYXNlL2dvdHJ1ZS1qczogbmF2aWdhdG9yTG9jazogbm90IGltbWVkaWF0ZWx5IGF2YWlsYWJsZScsIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTmF2aWdhdG9yTG9ja0FjcXVpcmVUaW1lb3V0RXJyb3IoYEFjcXVpcmluZyBhbiBleGNsdXNpdmUgTmF2aWdhdG9yIExvY2tNYW5hZ2VyIGxvY2sgXCIke25hbWV9XCIgaW1tZWRpYXRlbHkgZmFpbGVkYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJuYWxzLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnbG9iYWxUaGlzLm5hdmlnYXRvci5sb2Nrcy5xdWVyeSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0BzdXBhYmFzZS9nb3RydWUtanM6IE5hdmlnYXRvciBMb2NrTWFuYWdlciBzdGF0ZScsIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgJyAgJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0BzdXBhYmFzZS9nb3RydWUtanM6IEVycm9yIHdoZW4gcXVlcnlpbmcgTmF2aWdhdG9yIExvY2tNYW5hZ2VyIHN0YXRlJywgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQnJvd3NlciBpcyBub3QgZm9sbG93aW5nIHRoZSBOYXZpZ2F0b3IgTG9ja01hbmFnZXIgc3BlYywgaXRcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5lZCBhIG51bGwgbG9jayB3aGVuIHdlIGRpZG4ndCB1c2UgaWZBdmFpbGFibGUuIFNvIHdlIGNhblxuICAgICAgICAgICAgICAgIC8vIHByZXRlbmQgdGhlIGxvY2sgaXMgYWNxdWlyZWQgaW4gdGhlIG5hbWUgb2YgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgIC8vIGFuZCB1c2VyIGV4cGVyaWVuY2UgYW5kIGp1c3QgcnVuIHRoZSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0BzdXBhYmFzZS9nb3RydWUtanM6IE5hdmlnYXRvciBMb2NrTWFuYWdlciByZXR1cm5lZCBhIG51bGwgbG9jayB3aGVuIHVzaW5nICNyZXF1ZXN0IHdpdGhvdXQgaWZBdmFpbGFibGUgc2V0IHRvIHRydWUsIGl0IGFwcGVhcnMgdGhpcyBicm93c2VyIGlzIG5vdCBmb2xsb3dpbmcgdGhlIExvY2tNYW5hZ2VyIHNwZWMgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0xvY2tNYW5hZ2VyL3JlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgZm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pKTtcbn1cbmNvbnN0IFBST0NFU1NfTE9DS1MgPSB7fTtcbi8qKlxuICogSW1wbGVtZW50cyBhIGdsb2JhbCBleGNsdXNpdmUgbG9jayB0aGF0IHdvcmtzIG9ubHkgaW4gdGhlIGN1cnJlbnQgcHJvY2Vzcy5cbiAqIFVzZWZ1bCBmb3IgZW52aXJvbm1lbnRzIGxpa2UgUmVhY3QgTmF0aXZlIG9yIG90aGVyIG5vbi1icm93c2VyXG4gKiBzaW5nbGUtcHJvY2VzcyAoaS5lLiBubyBjb25jZXB0IG9mIFwidGFic1wiKSBlbnZpcm9ubWVudHMuXG4gKlxuICogVXNlIHtAbGluayAjbmF2aWdhdG9yTG9ja30gaW4gYnJvd3NlciBlbnZpcm9ubWVudHMuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgbG9jayB0byBiZSBhY3F1aXJlZC5cbiAqIEBwYXJhbSBhY3F1aXJlVGltZW91dCBJZiBuZWdhdGl2ZSwgbm8gdGltZW91dC4gSWYgMCBhbiBlcnJvciBpcyB0aHJvd24gaWZcbiAqICAgICAgICAgICAgICAgICAgICAgICB0aGUgbG9jayBjYW4ndCBiZSBhY3F1aXJlZCB3aXRob3V0IHdhaXRpbmcuIElmIHBvc2l0aXZlLCB0aGUgbG9jayBhY3F1aXJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgd2lsbCB0aW1lIG91dCBhZnRlciBzbyBtYW55IG1pbGxpc2Vjb25kcy4gQW4gZXJyb3IgaXNcbiAqICAgICAgICAgICAgICAgICAgICAgICBhIHRpbWVvdXQgaWYgaXQgaGFzIGBpc0FjcXVpcmVUaW1lb3V0YCBzZXQgdG8gdHJ1ZS5cbiAqIEBwYXJhbSBmbiBUaGUgb3BlcmF0aW9uIHRvIHJ1biBvbmNlIHRoZSBsb2NrIGlzIGFjcXVpcmVkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0xvY2sobmFtZSwgYWNxdWlyZVRpbWVvdXQsIGZuKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHByZXZpb3VzT3BlcmF0aW9uID0gKF9hID0gUFJPQ0VTU19MT0NLU1tuYW1lXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgY29uc3QgY3VycmVudE9wZXJhdGlvbiA9IFByb21pc2UucmFjZShbXG4gICAgICAgIHByZXZpb3VzT3BlcmF0aW9uLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBlcnJvciBvZiBwcmV2aW91cyBvcGVyYXRpb24gdGhhdCB3ZSdyZSB3YWl0aW5nIHRvIGZpbmlzaFxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pLFxuICAgICAgICBhY3F1aXJlVGltZW91dCA+PSAwXG4gICAgICAgICAgICA/IG5ldyBQcm9taXNlKChfLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBQcm9jZXNzTG9ja0FjcXVpcmVUaW1lb3V0RXJyb3IoYEFjcXVyaW5nIHByb2Nlc3MgbG9jayB3aXRoIG5hbWUgXCIke25hbWV9XCIgdGltZWQgb3V0YCkpO1xuICAgICAgICAgICAgICAgIH0sIGFjcXVpcmVUaW1lb3V0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA6IG51bGwsXG4gICAgXS5maWx0ZXIoKHgpID0+IHgpKVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgaWYgKGUgJiYgZS5pc0FjcXVpcmVUaW1lb3V0KSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0pXG4gICAgICAgIC50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gcHJldmlvdXMgb3BlcmF0aW9ucyBmaW5pc2hlZCBhbmQgd2UgZGlkbid0IGdldCBhIHJhY2Ugb24gdGhlIGFjcXVpcmVcbiAgICAgICAgLy8gdGltZW91dCwgc28gdGhlIGN1cnJlbnQgb3BlcmF0aW9uIGNhbiBmaW5hbGx5IHN0YXJ0XG4gICAgICAgIHJldHVybiBhd2FpdCBmbigpO1xuICAgIH0pO1xuICAgIFBST0NFU1NfTE9DS1NbbmFtZV0gPSBjdXJyZW50T3BlcmF0aW9uLmNhdGNoKGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGlmIChlICYmIGUuaXNBY3F1aXJlVGltZW91dCkge1xuICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgb3BlcmF0aW9uIHRpbWVkIG91dCwgaXQgZG9lc24ndCBtZWFuIHRoYXQgdGhlIHByZXZpb3VzXG4gICAgICAgICAgICAvLyBvcGVyYXRpb24gZmluaXNoZWQsIHNvIHdlIG5lZWQgY29udG51ZSB3YWl0aW5nIGZvciBpdCB0byBmaW5pc2hcbiAgICAgICAgICAgIGF3YWl0IHByZXZpb3VzT3BlcmF0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZTtcbiAgICB9KTtcbiAgICAvLyBmaW5hbGx5IHdhaXQgZm9yIHRoZSBjdXJyZW50IG9wZXJhdGlvbiB0byBmaW5pc2ggc3VjY2Vzc2Z1bGx5LCB3aXRoIGFuXG4gICAgLy8gZXJyb3Igb3Igd2l0aCBhbiBhY3F1aXJlIHRpbWVvdXQgZXJyb3JcbiAgICByZXR1cm4gYXdhaXQgY3VycmVudE9wZXJhdGlvbjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvY2tzLmpzLm1hcCIsImltcG9ydCBHb1RydWVBZG1pbkFwaSBmcm9tICcuL0dvVHJ1ZUFkbWluQXBpJztcbmltcG9ydCB7IERFRkFVTFRfSEVBREVSUywgRVhQSVJZX01BUkdJTl9NUywgQVVUT19SRUZSRVNIX1RJQ0tfRFVSQVRJT05fTVMsIEFVVE9fUkVGUkVTSF9USUNLX1RIUkVTSE9MRCwgR09UUlVFX1VSTCwgU1RPUkFHRV9LRVksIEpXS1NfVFRMLCB9IGZyb20gJy4vbGliL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBBdXRoSW1wbGljaXRHcmFudFJlZGlyZWN0RXJyb3IsIEF1dGhQS0NFR3JhbnRDb2RlRXhjaGFuZ2VFcnJvciwgQXV0aEludmFsaWRDcmVkZW50aWFsc0Vycm9yLCBBdXRoU2Vzc2lvbk1pc3NpbmdFcnJvciwgQXV0aEludmFsaWRUb2tlblJlc3BvbnNlRXJyb3IsIEF1dGhVbmtub3duRXJyb3IsIGlzQXV0aEFwaUVycm9yLCBpc0F1dGhFcnJvciwgaXNBdXRoUmV0cnlhYmxlRmV0Y2hFcnJvciwgaXNBdXRoU2Vzc2lvbk1pc3NpbmdFcnJvciwgaXNBdXRoSW1wbGljaXRHcmFudFJlZGlyZWN0RXJyb3IsIEF1dGhJbnZhbGlkSnd0RXJyb3IsIH0gZnJvbSAnLi9saWIvZXJyb3JzJztcbmltcG9ydCB7IF9yZXF1ZXN0LCBfc2Vzc2lvblJlc3BvbnNlLCBfc2Vzc2lvblJlc3BvbnNlUGFzc3dvcmQsIF91c2VyUmVzcG9uc2UsIF9zc29SZXNwb25zZSwgfSBmcm9tICcuL2xpYi9mZXRjaCc7XG5pbXBvcnQgeyBEZWZlcnJlZCwgZ2V0SXRlbUFzeW5jLCBpc0Jyb3dzZXIsIHJlbW92ZUl0ZW1Bc3luYywgcmVzb2x2ZUZldGNoLCBzZXRJdGVtQXN5bmMsIHV1aWQsIHJldHJ5YWJsZSwgc2xlZXAsIHN1cHBvcnRzTG9jYWxTdG9yYWdlLCBwYXJzZVBhcmFtZXRlcnNGcm9tVVJMLCBnZXRDb2RlQ2hhbGxlbmdlQW5kTWV0aG9kLCBnZXRBbGdvcml0aG0sIHZhbGlkYXRlRXhwLCBkZWNvZGVKV1QsIH0gZnJvbSAnLi9saWIvaGVscGVycyc7XG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VBZGFwdGVyLCBtZW1vcnlMb2NhbFN0b3JhZ2VBZGFwdGVyIH0gZnJvbSAnLi9saWIvbG9jYWwtc3RvcmFnZSc7XG5pbXBvcnQgeyBwb2x5ZmlsbEdsb2JhbFRoaXMgfSBmcm9tICcuL2xpYi9wb2x5ZmlsbHMnO1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4vbGliL3ZlcnNpb24nO1xuaW1wb3J0IHsgTG9ja0FjcXVpcmVUaW1lb3V0RXJyb3IsIG5hdmlnYXRvckxvY2sgfSBmcm9tICcuL2xpYi9sb2Nrcyc7XG5pbXBvcnQgeyBzdHJpbmdUb1VpbnQ4QXJyYXksIGJ5dGVzVG9CYXNlNjRVUkwgfSBmcm9tICcuL2xpYi9iYXNlNjR1cmwnO1xucG9seWZpbGxHbG9iYWxUaGlzKCk7IC8vIE1ha2UgXCJnbG9iYWxUaGlzXCIgYXZhaWxhYmxlXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgdXJsOiBHT1RSVUVfVVJMLFxuICAgIHN0b3JhZ2VLZXk6IFNUT1JBR0VfS0VZLFxuICAgIGF1dG9SZWZyZXNoVG9rZW46IHRydWUsXG4gICAgcGVyc2lzdFNlc3Npb246IHRydWUsXG4gICAgZGV0ZWN0U2Vzc2lvbkluVXJsOiB0cnVlLFxuICAgIGhlYWRlcnM6IERFRkFVTFRfSEVBREVSUyxcbiAgICBmbG93VHlwZTogJ2ltcGxpY2l0JyxcbiAgICBkZWJ1ZzogZmFsc2UsXG4gICAgaGFzQ3VzdG9tQXV0aG9yaXphdGlvbkhlYWRlcjogZmFsc2UsXG59O1xuYXN5bmMgZnVuY3Rpb24gbG9ja05vT3AobmFtZSwgYWNxdWlyZVRpbWVvdXQsIGZuKSB7XG4gICAgcmV0dXJuIGF3YWl0IGZuKCk7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHb1RydWVDbGllbnQge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBjbGllbnQgZm9yIHVzZSBpbiB0aGUgYnJvd3Nlci5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHRoaXMubWVtb3J5U3RvcmFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VFbWl0dGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5hdXRvUmVmcmVzaFRpY2tlciA9IG51bGw7XG4gICAgICAgIHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaGluZ0RlZmVycmVkID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEtlZXBzIHRyYWNrIG9mIHRoZSBhc3luYyBjbGllbnQgaW5pdGlhbGl6YXRpb24uXG4gICAgICAgICAqIFdoZW4gbnVsbCBvciBub3QgeWV0IHJlc29sdmVkIHRoZSBhdXRoIHN0YXRlIGlzIGB1bmtub3duYFxuICAgICAgICAgKiBPbmNlIHJlc29sdmVkIHRoZSB0aGUgYXV0aCBzdGF0ZSBpcyBrbm93biBhbmQgaXQncyBzYXZlIHRvIGNhbGwgYW55IGZ1cnRoZXIgY2xpZW50IG1ldGhvZHMuXG4gICAgICAgICAqIEtlZXAgZXh0cmEgY2FyZSB0byBuZXZlciByZWplY3Qgb3IgdGhyb3cgdW5jYXVnaHQgZXJyb3JzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmluaXRpYWxpemVQcm9taXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5kZXRlY3RTZXNzaW9uSW5VcmwgPSB0cnVlO1xuICAgICAgICB0aGlzLmhhc0N1c3RvbUF1dGhvcml6YXRpb25IZWFkZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdXBwcmVzc0dldFNlc3Npb25XYXJuaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9ja0FjcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGVuZGluZ0luTG9jayA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogVXNlZCB0byBicm9hZGNhc3Qgc3RhdGUgY2hhbmdlIGV2ZW50cyB0byBvdGhlciB0YWJzIGxpc3RlbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0Q2hhbm5lbCA9IG51bGw7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gY29uc29sZS5sb2c7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VJRCA9IEdvVHJ1ZUNsaWVudC5uZXh0SW5zdGFuY2VJRDtcbiAgICAgICAgR29UcnVlQ2xpZW50Lm5leHRJbnN0YW5jZUlEICs9IDE7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlSUQgPiAwICYmIGlzQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ011bHRpcGxlIEdvVHJ1ZUNsaWVudCBpbnN0YW5jZXMgZGV0ZWN0ZWQgaW4gdGhlIHNhbWUgYnJvd3NlciBjb250ZXh0LiBJdCBpcyBub3QgYW4gZXJyb3IsIGJ1dCB0aGlzIHNob3VsZCBiZSBhdm9pZGVkIGFzIGl0IG1heSBwcm9kdWNlIHVuZGVmaW5lZCBiZWhhdmlvciB3aGVuIHVzZWQgY29uY3VycmVudGx5IHVuZGVyIHRoZSBzYW1lIHN0b3JhZ2Uga2V5LicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMpLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5sb2dEZWJ1Z01lc3NhZ2VzID0gISFzZXR0aW5ncy5kZWJ1ZztcbiAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5kZWJ1ZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBzZXR0aW5ncy5kZWJ1ZztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBlcnNpc3RTZXNzaW9uID0gc2V0dGluZ3MucGVyc2lzdFNlc3Npb247XG4gICAgICAgIHRoaXMuc3RvcmFnZUtleSA9IHNldHRpbmdzLnN0b3JhZ2VLZXk7XG4gICAgICAgIHRoaXMuYXV0b1JlZnJlc2hUb2tlbiA9IHNldHRpbmdzLmF1dG9SZWZyZXNoVG9rZW47XG4gICAgICAgIHRoaXMuYWRtaW4gPSBuZXcgR29UcnVlQWRtaW5BcGkoe1xuICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy51cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiBzZXR0aW5ncy5oZWFkZXJzLFxuICAgICAgICAgICAgZmV0Y2g6IHNldHRpbmdzLmZldGNoLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cmwgPSBzZXR0aW5ncy51cmw7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnM7XG4gICAgICAgIHRoaXMuZmV0Y2ggPSByZXNvbHZlRmV0Y2goc2V0dGluZ3MuZmV0Y2gpO1xuICAgICAgICB0aGlzLmxvY2sgPSBzZXR0aW5ncy5sb2NrIHx8IGxvY2tOb09wO1xuICAgICAgICB0aGlzLmRldGVjdFNlc3Npb25JblVybCA9IHNldHRpbmdzLmRldGVjdFNlc3Npb25JblVybDtcbiAgICAgICAgdGhpcy5mbG93VHlwZSA9IHNldHRpbmdzLmZsb3dUeXBlO1xuICAgICAgICB0aGlzLmhhc0N1c3RvbUF1dGhvcml6YXRpb25IZWFkZXIgPSBzZXR0aW5ncy5oYXNDdXN0b21BdXRob3JpemF0aW9uSGVhZGVyO1xuICAgICAgICBpZiAoc2V0dGluZ3MubG9jaykge1xuICAgICAgICAgICAgdGhpcy5sb2NrID0gc2V0dGluZ3MubG9jaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc0Jyb3dzZXIoKSAmJiAoKF9hID0gZ2xvYmFsVGhpcyA9PT0gbnVsbCB8fCBnbG9iYWxUaGlzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBnbG9iYWxUaGlzLm5hdmlnYXRvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxvY2tzKSkge1xuICAgICAgICAgICAgdGhpcy5sb2NrID0gbmF2aWdhdG9yTG9jaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9jayA9IGxvY2tOb09wO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuandrcyA9IHsga2V5czogW10gfTtcbiAgICAgICAgdGhpcy5qd2tzX2NhY2hlZF9hdCA9IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSO1xuICAgICAgICB0aGlzLm1mYSA9IHtcbiAgICAgICAgICAgIHZlcmlmeTogdGhpcy5fdmVyaWZ5LmJpbmQodGhpcyksXG4gICAgICAgICAgICBlbnJvbGw6IHRoaXMuX2Vucm9sbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdW5lbnJvbGw6IHRoaXMuX3VuZW5yb2xsLmJpbmQodGhpcyksXG4gICAgICAgICAgICBjaGFsbGVuZ2U6IHRoaXMuX2NoYWxsZW5nZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgbGlzdEZhY3RvcnM6IHRoaXMuX2xpc3RGYWN0b3JzLmJpbmQodGhpcyksXG4gICAgICAgICAgICBjaGFsbGVuZ2VBbmRWZXJpZnk6IHRoaXMuX2NoYWxsZW5nZUFuZFZlcmlmeS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgZ2V0QXV0aGVudGljYXRvckFzc3VyYW5jZUxldmVsOiB0aGlzLl9nZXRBdXRoZW50aWNhdG9yQXNzdXJhbmNlTGV2ZWwuYmluZCh0aGlzKSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMucGVyc2lzdFNlc3Npb24pIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5zdG9yYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlID0gc2V0dGluZ3Muc3RvcmFnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzdXBwb3J0c0xvY2FsU3RvcmFnZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmFnZSA9IGxvY2FsU3RvcmFnZUFkYXB0ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lbW9yeVN0b3JhZ2UgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlID0gbWVtb3J5TG9jYWxTdG9yYWdlQWRhcHRlcih0aGlzLm1lbW9yeVN0b3JhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWVtb3J5U3RvcmFnZSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zdG9yYWdlID0gbWVtb3J5TG9jYWxTdG9yYWdlQWRhcHRlcih0aGlzLm1lbW9yeVN0b3JhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0Jyb3dzZXIoKSAmJiBnbG9iYWxUaGlzLkJyb2FkY2FzdENoYW5uZWwgJiYgdGhpcy5wZXJzaXN0U2Vzc2lvbiAmJiB0aGlzLnN0b3JhZ2VLZXkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsID0gbmV3IGdsb2JhbFRoaXMuQnJvYWRjYXN0Q2hhbm5lbCh0aGlzLnN0b3JhZ2VLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGEgbmV3IEJyb2FkY2FzdENoYW5uZWwsIG11bHRpLXRhYiBzdGF0ZSBjaGFuZ2VzIHdpbGwgbm90IGJlIGF2YWlsYWJsZScsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKF9iID0gdGhpcy5icm9hZGNhc3RDaGFubmVsKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnKCdyZWNlaXZlZCBicm9hZGNhc3Qgbm90aWZpY2F0aW9uIGZyb20gb3RoZXIgdGFiIG9yIGNsaWVudCcsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9ub3RpZnlBbGxTdWJzY3JpYmVycyhldmVudC5kYXRhLmV2ZW50LCBldmVudC5kYXRhLnNlc3Npb24sIGZhbHNlKTsgLy8gYnJvYWRjYXN0ID0gZmFsc2Ugc28gd2UgZG9uJ3QgZ2V0IGFuIGVuZGxlc3MgbG9vcCBvZiBtZXNzYWdlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfVxuICAgIF9kZWJ1ZyguLi5hcmdzKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZ0RlYnVnTWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyKGBHb1RydWVDbGllbnRAJHt0aGlzLmluc3RhbmNlSUR9ICgke3ZlcnNpb259KSAke25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1gLCAuLi5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGNsaWVudCBzZXNzaW9uIGVpdGhlciBmcm9tIHRoZSB1cmwgb3IgZnJvbSBzdG9yYWdlLlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgY2xpZW50LCBidXQgc2hvdWxkIGFsc28gYmUgY2FsbGVkXG4gICAgICogbWFudWFsbHkgd2hlbiBjaGVja2luZyBmb3IgYW4gZXJyb3IgZnJvbSBhbiBhdXRoIHJlZGlyZWN0IChvYXV0aCwgbWFnaWNsaW5rLCBwYXNzd29yZCByZWNvdmVyeSwgZXRjKS5cbiAgICAgKi9cbiAgICBhc3luYyBpbml0aWFsaXplKCkge1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplUHJvbWlzZSA9IChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5faW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmluaXRpYWxpemVQcm9taXNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJTVBPUlRBTlQ6XG4gICAgICogMS4gTmV2ZXIgdGhyb3cgaW4gdGhpcyBtZXRob2QsIGFzIGl0IGlzIGNhbGxlZCBmcm9tIHRoZSBjb25zdHJ1Y3RvclxuICAgICAqIDIuIE5ldmVyIHJldHVybiBhIHNlc3Npb24gZnJvbSB0aGlzIG1ldGhvZCBhcyBpdCB3b3VsZCBiZSBjYWNoZWQgb3ZlclxuICAgICAqICAgIHRoZSB3aG9sZSBsaWZldGltZSBvZiB0aGUgY2xpZW50XG4gICAgICovXG4gICAgYXN5bmMgX2luaXRpYWxpemUoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHBhcnNlUGFyYW1ldGVyc0Zyb21VUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgbGV0IGNhbGxiYWNrVXJsVHlwZSA9ICdub25lJztcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0ltcGxpY2l0R3JhbnRDYWxsYmFjayhwYXJhbXMpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tVcmxUeXBlID0gJ2ltcGxpY2l0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGF3YWl0IHRoaXMuX2lzUEtDRUNhbGxiYWNrKHBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja1VybFR5cGUgPSAncGtjZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEF0dGVtcHQgdG8gZ2V0IHRoZSBzZXNzaW9uIGZyb20gdGhlIFVSTCBvbmx5IGlmIHRoZXNlIGNvbmRpdGlvbnMgYXJlIGZ1bGZpbGxlZFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIE5vdGU6IElmIHRoZSBVUkwgaXNuJ3Qgb25lIG9mIHRoZSBjYWxsYmFjayB1cmwgdHlwZXMgKGltcGxpY2l0IG9yIHBrY2UpLFxuICAgICAgICAgICAgICogdGhlbiB0aGVyZSBjb3VsZCBiZSBhbiBleGlzdGluZyBzZXNzaW9uIHNvIHdlIGRvbid0IHdhbnQgdG8gcHJlbWF0dXJlbHkgcmVtb3ZlIGl0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChpc0Jyb3dzZXIoKSAmJiB0aGlzLmRldGVjdFNlc3Npb25JblVybCAmJiBjYWxsYmFja1VybFR5cGUgIT09ICdub25lJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHRoaXMuX2dldFNlc3Npb25Gcm9tVVJMKHBhcmFtcywgY2FsbGJhY2tVcmxUeXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfaW5pdGlhbGl6ZSgpJywgJ2Vycm9yIGRldGVjdGluZyBzZXNzaW9uIGZyb20gVVJMJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBdXRoSW1wbGljaXRHcmFudFJlZGlyZWN0RXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvckNvZGUgPSAoX2EgPSBlcnJvci5kZXRhaWxzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvckNvZGUgPT09ICdpZGVudGl0eV9hbHJlYWR5X2V4aXN0cycgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGUgPT09ICdpZGVudGl0eV9ub3RfZm91bmQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb2RlID09PSAnc2luZ2xlX2lkZW50aXR5X25vdF9kZWxldGFibGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBmYWlsZWQgbG9naW4gYXR0ZW1wdCB2aWEgdXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgb2xkIHNlc3Npb24gYXMgaW4gdmVyaWZ5T3RwLCBzaWduVXAgYW5kIHNpZ25JbldpdGgqXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3JlbW92ZVNlc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzZXNzaW9uLCByZWRpcmVjdFR5cGUgfSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfaW5pdGlhbGl6ZSgpJywgJ2RldGVjdGVkIHNlc3Npb24gaW4gVVJMJywgc2Vzc2lvbiwgJ3JlZGlyZWN0IHR5cGUnLCByZWRpcmVjdFR5cGUpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NhdmVTZXNzaW9uKHNlc3Npb24pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVkaXJlY3RUeXBlID09PSAncmVjb3ZlcnknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9ub3RpZnlBbGxTdWJzY3JpYmVycygnUEFTU1dPUkRfUkVDT1ZFUlknLCBzZXNzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX25vdGlmeUFsbFN1YnNjcmliZXJzKCdTSUdORURfSU4nLCBzZXNzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGVycm9yOiBudWxsIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBubyBsb2dpbiBhdHRlbXB0IHZpYSBjYWxsYmFjayB1cmwgdHJ5IHRvIHJlY292ZXIgc2Vzc2lvbiBmcm9tIHN0b3JhZ2VcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3JlY292ZXJBbmRSZWZyZXNoKCk7XG4gICAgICAgICAgICByZXR1cm4geyBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVycm9yOiBuZXcgQXV0aFVua25vd25FcnJvcignVW5leHBlY3RlZCBlcnJvciBkdXJpbmcgaW5pdGlhbGl6YXRpb24nLCBlcnJvciksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpO1xuICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfaW5pdGlhbGl6ZSgpJywgJ2VuZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgYW5vbnltb3VzIHVzZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIHNlc3Npb24gd2hlcmUgdGhlIGlzX2Fub255bW91cyBjbGFpbSBpbiB0aGUgYWNjZXNzIHRva2VuIEpXVCBzZXQgdG8gdHJ1ZVxuICAgICAqL1xuICAgIGFzeW5jIHNpZ25JbkFub255bW91c2x5KGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BPU1QnLCBgJHt0aGlzLnVybH0vc2lnbnVwYCwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IChfYiA9IChfYSA9IGNyZWRlbnRpYWxzID09PSBudWxsIHx8IGNyZWRlbnRpYWxzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjcmVkZW50aWFscy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZGF0YSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge30sXG4gICAgICAgICAgICAgICAgICAgIGdvdHJ1ZV9tZXRhX3NlY3VyaXR5OiB7IGNhcHRjaGFfdG9rZW46IChfYyA9IGNyZWRlbnRpYWxzID09PSBudWxsIHx8IGNyZWRlbnRpYWxzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjcmVkZW50aWFscy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2FwdGNoYVRva2VuIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB4Zm9ybTogX3Nlc3Npb25SZXNwb25zZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKGVycm9yIHx8ICFkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsIH0sIGVycm9yOiBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGRhdGEuc2Vzc2lvbjtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBkYXRhLnVzZXI7XG4gICAgICAgICAgICBpZiAoZGF0YS5zZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2F2ZVNlc3Npb24oZGF0YS5zZXNzaW9uKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9ub3RpZnlBbGxTdWJzY3JpYmVycygnU0lHTkVEX0lOJywgc2Vzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXIsIHNlc3Npb24gfSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgdXNlci5cbiAgICAgKlxuICAgICAqIEJlIGF3YXJlIHRoYXQgaWYgYSB1c2VyIGFjY291bnQgZXhpc3RzIGluIHRoZSBzeXN0ZW0geW91IG1heSBnZXQgYmFjayBhblxuICAgICAqIGVycm9yIG1lc3NhZ2UgdGhhdCBhdHRlbXB0cyB0byBoaWRlIHRoaXMgaW5mb3JtYXRpb24gZnJvbSB0aGUgdXNlci5cbiAgICAgKiBUaGlzIG1ldGhvZCBoYXMgc3VwcG9ydCBmb3IgUEtDRSB2aWEgZW1haWwgc2lnbnVwcy4gVGhlIFBLQ0UgZmxvdyBjYW5ub3QgYmUgdXNlZCB3aGVuIGF1dG9jb25maXJtIGlzIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIGxvZ2dlZC1pbiBzZXNzaW9uIGlmIHRoZSBzZXJ2ZXIgaGFzIFwiYXV0b2NvbmZpcm1cIiBPTlxuICAgICAqIEByZXR1cm5zIEEgdXNlciBpZiB0aGUgc2VydmVyIGhhcyBcImF1dG9jb25maXJtXCIgT0ZGXG4gICAgICovXG4gICAgYXN5bmMgc2lnblVwKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlcztcbiAgICAgICAgICAgIGlmICgnZW1haWwnIGluIGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIG9wdGlvbnMgfSA9IGNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgICAgIGxldCBjb2RlQ2hhbGxlbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgY29kZUNoYWxsZW5nZU1ldGhvZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmxvd1R5cGUgPT09ICdwa2NlJykge1xuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgIFtjb2RlQ2hhbGxlbmdlLCBjb2RlQ2hhbGxlbmdlTWV0aG9kXSA9IGF3YWl0IGdldENvZGVDaGFsbGVuZ2VBbmRNZXRob2QodGhpcy5zdG9yYWdlLCB0aGlzLnN0b3JhZ2VLZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMgPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUE9TVCcsIGAke3RoaXMudXJsfS9zaWdudXBgLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmVtYWlsUmVkaXJlY3RUbyxcbiAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5kYXRhKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvdHJ1ZV9tZXRhX3NlY3VyaXR5OiB7IGNhcHRjaGFfdG9rZW46IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jYXB0Y2hhVG9rZW4gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVfY2hhbGxlbmdlOiBjb2RlQ2hhbGxlbmdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZV9jaGFsbGVuZ2VfbWV0aG9kOiBjb2RlQ2hhbGxlbmdlTWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB4Zm9ybTogX3Nlc3Npb25SZXNwb25zZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCdwaG9uZScgaW4gY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBob25lLCBwYXNzd29yZCwgb3B0aW9ucyB9ID0gY3JlZGVudGlhbHM7XG4gICAgICAgICAgICAgICAgcmVzID0gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BPU1QnLCBgJHt0aGlzLnVybH0vc2lnbnVwYCwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBob25lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAoX2IgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZGF0YSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiAoX2MgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuY2hhbm5lbCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogJ3NtcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBnb3RydWVfbWV0YV9zZWN1cml0eTogeyBjYXB0Y2hhX3Rva2VuOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuY2FwdGNoYVRva2VuIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHhmb3JtOiBfc2Vzc2lvblJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhJbnZhbGlkQ3JlZGVudGlhbHNFcnJvcignWW91IG11c3QgcHJvdmlkZSBlaXRoZXIgYW4gZW1haWwgb3IgcGhvbmUgbnVtYmVyIGFuZCBhIHBhc3N3b3JkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoZXJyb3IgfHwgIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3I6IGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uID0gZGF0YS5zZXNzaW9uO1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IGRhdGEudXNlcjtcbiAgICAgICAgICAgIGlmIChkYXRhLnNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zYXZlU2Vzc2lvbihkYXRhLnNlc3Npb24pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX25vdGlmeUFsbFN1YnNjcmliZXJzKCdTSUdORURfSU4nLCBzZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlciwgc2Vzc2lvbiB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTG9nIGluIGFuIGV4aXN0aW5nIHVzZXIgd2l0aCBhbiBlbWFpbCBhbmQgcGFzc3dvcmQgb3IgcGhvbmUgYW5kIHBhc3N3b3JkLlxuICAgICAqXG4gICAgICogQmUgYXdhcmUgdGhhdCB5b3UgbWF5IGdldCBiYWNrIGFuIGVycm9yIG1lc3NhZ2UgdGhhdCB3aWxsIG5vdCBkaXN0aW5ndWlzaFxuICAgICAqIGJldHdlZW4gdGhlIGNhc2VzIHdoZXJlIHRoZSBhY2NvdW50IGRvZXMgbm90IGV4aXN0IG9yIHRoYXQgdGhlXG4gICAgICogZW1haWwvcGhvbmUgYW5kIHBhc3N3b3JkIGNvbWJpbmF0aW9uIGlzIHdyb25nIG9yIHRoYXQgdGhlIGFjY291bnQgY2FuIG9ubHlcbiAgICAgKiBiZSBhY2Nlc3NlZCB2aWEgc29jaWFsIGxvZ2luLlxuICAgICAqL1xuICAgIGFzeW5jIHNpZ25JbldpdGhQYXNzd29yZChjcmVkZW50aWFscykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlcztcbiAgICAgICAgICAgIGlmICgnZW1haWwnIGluIGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIG9wdGlvbnMgfSA9IGNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgICAgIHJlcyA9IGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L3Rva2VuP2dyYW50X3R5cGU9cGFzc3dvcmRgLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvdHJ1ZV9tZXRhX3NlY3VyaXR5OiB7IGNhcHRjaGFfdG9rZW46IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jYXB0Y2hhVG9rZW4gfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeGZvcm06IF9zZXNzaW9uUmVzcG9uc2VQYXNzd29yZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCdwaG9uZScgaW4gY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBob25lLCBwYXNzd29yZCwgb3B0aW9ucyB9ID0gY3JlZGVudGlhbHM7XG4gICAgICAgICAgICAgICAgcmVzID0gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BPU1QnLCBgJHt0aGlzLnVybH0vdG9rZW4/Z3JhbnRfdHlwZT1wYXNzd29yZGAsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ290cnVlX21ldGFfc2VjdXJpdHk6IHsgY2FwdGNoYV90b2tlbjogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmNhcHRjaGFUb2tlbiB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB4Zm9ybTogX3Nlc3Npb25SZXNwb25zZVBhc3N3b3JkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhJbnZhbGlkQ3JlZGVudGlhbHNFcnJvcignWW91IG11c3QgcHJvdmlkZSBlaXRoZXIgYW4gZW1haWwgb3IgcGhvbmUgbnVtYmVyIGFuZCBhIHBhc3N3b3JkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFkYXRhIHx8ICFkYXRhLnNlc3Npb24gfHwgIWRhdGEudXNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvcjogbmV3IEF1dGhJbnZhbGlkVG9rZW5SZXNwb25zZUVycm9yKCkgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLnNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zYXZlU2Vzc2lvbihkYXRhLnNlc3Npb24pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX25vdGlmeUFsbFN1YnNjcmliZXJzKCdTSUdORURfSU4nLCBkYXRhLnNlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHsgdXNlcjogZGF0YS51c2VyLCBzZXNzaW9uOiBkYXRhLnNlc3Npb24gfSwgKGRhdGEud2Vha19wYXNzd29yZCA/IHsgd2Vha1Bhc3N3b3JkOiBkYXRhLndlYWtfcGFzc3dvcmQgfSA6IG51bGwpKSxcbiAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBMb2cgaW4gYW4gZXhpc3RpbmcgdXNlciB2aWEgYSB0aGlyZC1wYXJ0eSBwcm92aWRlci5cbiAgICAgKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyB0aGUgUEtDRSBmbG93LlxuICAgICAqL1xuICAgIGFzeW5jIHNpZ25JbldpdGhPQXV0aChjcmVkZW50aWFscykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9oYW5kbGVQcm92aWRlclNpZ25JbihjcmVkZW50aWFscy5wcm92aWRlciwge1xuICAgICAgICAgICAgcmVkaXJlY3RUbzogKF9hID0gY3JlZGVudGlhbHMub3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlZGlyZWN0VG8sXG4gICAgICAgICAgICBzY29wZXM6IChfYiA9IGNyZWRlbnRpYWxzLm9wdGlvbnMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5zY29wZXMsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogKF9jID0gY3JlZGVudGlhbHMub3B0aW9ucykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnF1ZXJ5UGFyYW1zLFxuICAgICAgICAgICAgc2tpcEJyb3dzZXJSZWRpcmVjdDogKF9kID0gY3JlZGVudGlhbHMub3B0aW9ucykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLnNraXBCcm93c2VyUmVkaXJlY3QsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMb2cgaW4gYW4gZXhpc3RpbmcgdXNlciBieSBleGNoYW5naW5nIGFuIEF1dGggQ29kZSBpc3N1ZWQgZHVyaW5nIHRoZSBQS0NFIGZsb3cuXG4gICAgICovXG4gICAgYXN5bmMgZXhjaGFuZ2VDb2RlRm9yU2Vzc2lvbihhdXRoQ29kZSkge1xuICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVQcm9taXNlO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leGNoYW5nZUNvZGVGb3JTZXNzaW9uKGF1dGhDb2RlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNpZ25zIGluIGEgdXNlciBieSB2ZXJpZnlpbmcgYSBtZXNzYWdlIHNpZ25lZCBieSB0aGUgdXNlcidzIHByaXZhdGUga2V5LlxuICAgICAqIE9ubHkgU29sYW5hIHN1cHBvcnRlZCBhdCB0aGlzIHRpbWUsIHVzaW5nIHRoZSBTaWduIGluIHdpdGggU29sYW5hIHN0YW5kYXJkLlxuICAgICAqL1xuICAgIGFzeW5jIHNpZ25JbldpdGhXZWIzKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGNvbnN0IHsgY2hhaW4gfSA9IGNyZWRlbnRpYWxzO1xuICAgICAgICBpZiAoY2hhaW4gPT09ICdzb2xhbmEnKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zaWduSW5XaXRoU29sYW5hKGNyZWRlbnRpYWxzKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEBzdXBhYmFzZS9hdXRoLWpzOiBVbnN1cHBvcnRlZCBjaGFpbiBcIiR7Y2hhaW59XCJgKTtcbiAgICB9XG4gICAgYXN5bmMgc2lnbkluV2l0aFNvbGFuYShjcmVkZW50aWFscykge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oLCBfaiwgX2ssIF9sLCBfbTtcbiAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgIGxldCBzaWduYXR1cmU7XG4gICAgICAgIGlmICgnbWVzc2FnZScgaW4gY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBjcmVkZW50aWFscy5tZXNzYWdlO1xuICAgICAgICAgICAgc2lnbmF0dXJlID0gY3JlZGVudGlhbHMuc2lnbmF0dXJlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeyBjaGFpbiwgd2FsbGV0LCBzdGF0ZW1lbnQsIG9wdGlvbnMgfSA9IGNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgbGV0IHJlc29sdmVkV2FsbGV0O1xuICAgICAgICAgICAgaWYgKCFpc0Jyb3dzZXIoKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2FsbGV0ICE9PSAnb2JqZWN0JyB8fCAhKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy51cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQHN1cGFiYXNlL2F1dGgtanM6IEJvdGggd2FsbGV0IGFuZCB1cmwgbXVzdCBiZSBzcGVjaWZpZWQgaW4gbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlZFdhbGxldCA9IHdhbGxldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB3YWxsZXQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRXYWxsZXQgPSB3YWxsZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3aW5kb3dBbnkgPSB3aW5kb3c7XG4gICAgICAgICAgICAgICAgaWYgKCdzb2xhbmEnIGluIHdpbmRvd0FueSAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygd2luZG93QW55LnNvbGFuYSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICAgKCgnc2lnbkluJyBpbiB3aW5kb3dBbnkuc29sYW5hICYmIHR5cGVvZiB3aW5kb3dBbnkuc29sYW5hLnNpZ25JbiA9PT0gJ2Z1bmN0aW9uJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgnc2lnbk1lc3NhZ2UnIGluIHdpbmRvd0FueS5zb2xhbmEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygd2luZG93QW55LnNvbGFuYS5zaWduTWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkV2FsbGV0ID0gd2luZG93QW55LnNvbGFuYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQHN1cGFiYXNlL2F1dGgtanM6IE5vIGNvbXBhdGlibGUgU29sYW5hIHdhbGxldCBpbnRlcmZhY2Ugb24gdGhlIHdpbmRvdyBvYmplY3QgKHdpbmRvdy5zb2xhbmEpIGRldGVjdGVkLiBNYWtlIHN1cmUgdGhlIHVzZXIgYWxyZWFkeSBoYXMgYSB3YWxsZXQgaW5zdGFsbGVkIGFuZCBjb25uZWN0ZWQgZm9yIHRoaXMgYXBwLiBQcmVmZXIgcGFzc2luZyB0aGUgd2FsbGV0IGludGVyZmFjZSBvYmplY3QgZGlyZWN0bHkgdG8gc2lnbkluV2l0aFdlYjMoeyBjaGFpbjogJ3NvbGFuYScsIHdhbGxldDogcmVzb2x2ZWRVc2VyV2FsbGV0IH0pIGluc3RlYWQuYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCgoX2EgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMudXJsKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICBpZiAoJ3NpZ25JbicgaW4gcmVzb2x2ZWRXYWxsZXQgJiYgcmVzb2x2ZWRXYWxsZXQuc2lnbkluKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgcmVzb2x2ZWRXYWxsZXQuc2lnbkluKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHsgaXNzdWVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9LCBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuc2lnbkluV2l0aFNvbGFuYSksIHsgXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vbi1vdmVycmlkYWJsZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246ICcxJywgZG9tYWluOiB1cmwuaG9zdCwgdXJpOiB1cmwuaHJlZiB9KSwgKHN0YXRlbWVudCA/IHsgc3RhdGVtZW50IH0gOiBudWxsKSkpO1xuICAgICAgICAgICAgICAgIGxldCBvdXRwdXRUb1Byb2Nlc3M7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3V0cHV0KSAmJiBvdXRwdXRbMF0gJiYgdHlwZW9mIG91dHB1dFswXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0VG9Qcm9jZXNzID0gb3V0cHV0WzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChvdXRwdXQgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG91dHB1dCA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICAgJ3NpZ25lZE1lc3NhZ2UnIGluIG91dHB1dCAmJlxuICAgICAgICAgICAgICAgICAgICAnc2lnbmF0dXJlJyBpbiBvdXRwdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0VG9Qcm9jZXNzID0gb3V0cHV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdAc3VwYWJhc2UvYXV0aC1qczogV2FsbGV0IG1ldGhvZCBzaWduSW4oKSByZXR1cm5lZCB1bnJlY29nbml6ZWQgdmFsdWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCdzaWduZWRNZXNzYWdlJyBpbiBvdXRwdXRUb1Byb2Nlc3MgJiZcbiAgICAgICAgICAgICAgICAgICAgJ3NpZ25hdHVyZScgaW4gb3V0cHV0VG9Qcm9jZXNzICYmXG4gICAgICAgICAgICAgICAgICAgICh0eXBlb2Ygb3V0cHV0VG9Qcm9jZXNzLnNpZ25lZE1lc3NhZ2UgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRUb1Byb2Nlc3Muc2lnbmVkTWVzc2FnZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpICYmXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFRvUHJvY2Vzcy5zaWduYXR1cmUgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG91dHB1dFRvUHJvY2Vzcy5zaWduZWRNZXNzYWdlID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gb3V0cHV0VG9Qcm9jZXNzLnNpZ25lZE1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShvdXRwdXRUb1Byb2Nlc3Muc2lnbmVkTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIHNpZ25hdHVyZSA9IG91dHB1dFRvUHJvY2Vzcy5zaWduYXR1cmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0BzdXBhYmFzZS9hdXRoLWpzOiBXYWxsZXQgbWV0aG9kIHNpZ25JbigpIEFQSSByZXR1cm5lZCBvYmplY3Qgd2l0aG91dCBzaWduZWRNZXNzYWdlIGFuZCBzaWduYXR1cmUgZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoJ3NpZ25NZXNzYWdlJyBpbiByZXNvbHZlZFdhbGxldCkgfHxcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHJlc29sdmVkV2FsbGV0LnNpZ25NZXNzYWdlICE9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgICAgICAgICAgICAgICEoJ3B1YmxpY0tleScgaW4gcmVzb2x2ZWRXYWxsZXQpIHx8XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiByZXNvbHZlZFdhbGxldCAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgICAgICAgICAgICAgIXJlc29sdmVkV2FsbGV0LnB1YmxpY0tleSB8fFxuICAgICAgICAgICAgICAgICAgICAhKCd0b0Jhc2U1OCcgaW4gcmVzb2x2ZWRXYWxsZXQucHVibGljS2V5KSB8fFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgcmVzb2x2ZWRXYWxsZXQucHVibGljS2V5LnRvQmFzZTU4ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQHN1cGFiYXNlL2F1dGgtanM6IFdhbGxldCBkb2VzIG5vdCBoYXZlIGEgY29tcGF0aWJsZSBzaWduTWVzc2FnZSgpIGFuZCBwdWJsaWNLZXkudG9CYXNlNTgoKSBBUEknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFtcbiAgICAgICAgICAgICAgICAgICAgYCR7dXJsLmhvc3R9IHdhbnRzIHlvdSB0byBzaWduIGluIHdpdGggeW91ciBTb2xhbmEgYWNjb3VudDpgLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFdhbGxldC5wdWJsaWNLZXkudG9CYXNlNTgoKSxcbiAgICAgICAgICAgICAgICAgICAgLi4uKHN0YXRlbWVudCA/IFsnJywgc3RhdGVtZW50LCAnJ10gOiBbJyddKSxcbiAgICAgICAgICAgICAgICAgICAgJ1ZlcnNpb246IDEnLFxuICAgICAgICAgICAgICAgICAgICBgVVJJOiAke3VybC5ocmVmfWAsXG4gICAgICAgICAgICAgICAgICAgIGBJc3N1ZWQgQXQ6ICR7KF9jID0gKF9iID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnNpZ25JbldpdGhTb2xhbmEpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pc3N1ZWRBdCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpfWAsXG4gICAgICAgICAgICAgICAgICAgIC4uLigoKF9kID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnNpZ25JbldpdGhTb2xhbmEpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5ub3RCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFtgTm90IEJlZm9yZTogJHtvcHRpb25zLnNpZ25JbldpdGhTb2xhbmEubm90QmVmb3JlfWBdXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgLi4uKCgoX2UgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuc2lnbkluV2l0aFNvbGFuYSkgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmV4cGlyYXRpb25UaW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBbYEV4cGlyYXRpb24gVGltZTogJHtvcHRpb25zLnNpZ25JbldpdGhTb2xhbmEuZXhwaXJhdGlvblRpbWV9YF1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgICAgICAgICAuLi4oKChfZiA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5zaWduSW5XaXRoU29sYW5hKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2YuY2hhaW5JZClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gW2BDaGFpbiBJRDogJHtvcHRpb25zLnNpZ25JbldpdGhTb2xhbmEuY2hhaW5JZH1gXVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSksXG4gICAgICAgICAgICAgICAgICAgIC4uLigoKF9nID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnNpZ25JbldpdGhTb2xhbmEpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5ub25jZSkgPyBbYE5vbmNlOiAke29wdGlvbnMuc2lnbkluV2l0aFNvbGFuYS5ub25jZX1gXSA6IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgLi4uKCgoX2ggPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuc2lnbkluV2l0aFNvbGFuYSkgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oLnJlcXVlc3RJZClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gW2BSZXF1ZXN0IElEOiAke29wdGlvbnMuc2lnbkluV2l0aFNvbGFuYS5yZXF1ZXN0SWR9YF1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgICAgICAgICAuLi4oKChfayA9IChfaiA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5zaWduSW5XaXRoU29sYW5hKSA9PT0gbnVsbCB8fCBfaiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2oucmVzb3VyY2VzKSA9PT0gbnVsbCB8fCBfayA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ub3B0aW9ucy5zaWduSW5XaXRoU29sYW5hLnJlc291cmNlcy5tYXAoKHJlc291cmNlKSA9PiBgLSAke3Jlc291cmNlfWApLFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSksXG4gICAgICAgICAgICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXliZVNpZ25hdHVyZSA9IGF3YWl0IHJlc29sdmVkV2FsbGV0LnNpZ25NZXNzYWdlKG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShtZXNzYWdlKSwgJ3V0ZjgnKTtcbiAgICAgICAgICAgICAgICBpZiAoIW1heWJlU2lnbmF0dXJlIHx8ICEobWF5YmVTaWduYXR1cmUgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0BzdXBhYmFzZS9hdXRoLWpzOiBXYWxsZXQgc2lnbk1lc3NhZ2UoKSBBUEkgcmV0dXJuZWQgYW4gcmVjb2duaXplZCB2YWx1ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaWduYXR1cmUgPSBtYXliZVNpZ25hdHVyZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BPU1QnLCBgJHt0aGlzLnVybH0vdG9rZW4/Z3JhbnRfdHlwZT13ZWIzYCwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICBib2R5OiBPYmplY3QuYXNzaWduKHsgY2hhaW46ICdzb2xhbmEnLCBtZXNzYWdlLCBzaWduYXR1cmU6IGJ5dGVzVG9CYXNlNjRVUkwoc2lnbmF0dXJlKSB9LCAoKChfbCA9IGNyZWRlbnRpYWxzLm9wdGlvbnMpID09PSBudWxsIHx8IF9sID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfbC5jYXB0Y2hhVG9rZW4pXG4gICAgICAgICAgICAgICAgICAgID8geyBnb3RydWVfbWV0YV9zZWN1cml0eTogeyBjYXB0Y2hhX3Rva2VuOiAoX20gPSBjcmVkZW50aWFscy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX20uY2FwdGNoYVRva2VuIH0gfVxuICAgICAgICAgICAgICAgICAgICA6IG51bGwpKSxcbiAgICAgICAgICAgICAgICB4Zm9ybTogX3Nlc3Npb25SZXNwb25zZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEuc2Vzc2lvbiB8fCAhZGF0YS51c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBuZXcgQXV0aEludmFsaWRUb2tlblJlc3BvbnNlRXJyb3IoKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGEuc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NhdmVTZXNzaW9uKGRhdGEuc2Vzc2lvbik7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5QWxsU3Vic2NyaWJlcnMoJ1NJR05FRF9JTicsIGRhdGEuc2Vzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBkYXRhOiBPYmplY3QuYXNzaWduKHt9LCBkYXRhKSwgZXJyb3IgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIF9leGNoYW5nZUNvZGVGb3JTZXNzaW9uKGF1dGhDb2RlKSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2VJdGVtID0gYXdhaXQgZ2V0SXRlbUFzeW5jKHRoaXMuc3RvcmFnZSwgYCR7dGhpcy5zdG9yYWdlS2V5fS1jb2RlLXZlcmlmaWVyYCk7XG4gICAgICAgIGNvbnN0IFtjb2RlVmVyaWZpZXIsIHJlZGlyZWN0VHlwZV0gPSAoc3RvcmFnZUl0ZW0gIT09IG51bGwgJiYgc3RvcmFnZUl0ZW0gIT09IHZvaWQgMCA/IHN0b3JhZ2VJdGVtIDogJycpLnNwbGl0KCcvJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUE9TVCcsIGAke3RoaXMudXJsfS90b2tlbj9ncmFudF90eXBlPXBrY2VgLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgYXV0aF9jb2RlOiBhdXRoQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgY29kZV92ZXJpZmllcjogY29kZVZlcmlmaWVyLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeGZvcm06IF9zZXNzaW9uUmVzcG9uc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHJlbW92ZUl0ZW1Bc3luYyh0aGlzLnN0b3JhZ2UsIGAke3RoaXMuc3RvcmFnZUtleX0tY29kZS12ZXJpZmllcmApO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEuc2Vzc2lvbiB8fCAhZGF0YS51c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsLCByZWRpcmVjdFR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG5ldyBBdXRoSW52YWxpZFRva2VuUmVzcG9uc2VFcnJvcigpLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YS5zZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2F2ZVNlc3Npb24oZGF0YS5zZXNzaW9uKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9ub3RpZnlBbGxTdWJzY3JpYmVycygnU0lHTkVEX0lOJywgZGF0YS5zZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgZGF0YSksIHsgcmVkaXJlY3RUeXBlOiByZWRpcmVjdFR5cGUgIT09IG51bGwgJiYgcmVkaXJlY3RUeXBlICE9PSB2b2lkIDAgPyByZWRpcmVjdFR5cGUgOiBudWxsIH0pLCBlcnJvciB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCwgcmVkaXJlY3RUeXBlOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBBbGxvd3Mgc2lnbmluZyBpbiB3aXRoIGFuIE9JREMgSUQgdG9rZW4uIFRoZSBhdXRoZW50aWNhdGlvbiBwcm92aWRlciB1c2VkXG4gICAgICogc2hvdWxkIGJlIGVuYWJsZWQgYW5kIGNvbmZpZ3VyZWQuXG4gICAgICovXG4gICAgYXN5bmMgc2lnbkluV2l0aElkVG9rZW4oY3JlZGVudGlhbHMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcHJvdmlkZXIsIHRva2VuLCBhY2Nlc3NfdG9rZW4sIG5vbmNlIH0gPSBjcmVkZW50aWFscztcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L3Rva2VuP2dyYW50X3R5cGU9aWRfdG9rZW5gLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBub25jZSxcbiAgICAgICAgICAgICAgICAgICAgZ290cnVlX21ldGFfc2VjdXJpdHk6IHsgY2FwdGNoYV90b2tlbjogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmNhcHRjaGFUb2tlbiB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeGZvcm06IF9zZXNzaW9uUmVzcG9uc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IHJlcztcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIWRhdGEgfHwgIWRhdGEuc2Vzc2lvbiB8fCAhZGF0YS51c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBuZXcgQXV0aEludmFsaWRUb2tlblJlc3BvbnNlRXJyb3IoKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGEuc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NhdmVTZXNzaW9uKGRhdGEuc2Vzc2lvbik7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5QWxsU3Vic2NyaWJlcnMoJ1NJR05FRF9JTicsIGRhdGEuc2Vzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBkYXRhLCBlcnJvciB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTG9nIGluIGEgdXNlciB1c2luZyBtYWdpY2xpbmsgb3IgYSBvbmUtdGltZSBwYXNzd29yZCAoT1RQKS5cbiAgICAgKlxuICAgICAqIElmIHRoZSBge3sgLkNvbmZpcm1hdGlvblVSTCB9fWAgdmFyaWFibGUgaXMgc3BlY2lmaWVkIGluIHRoZSBlbWFpbCB0ZW1wbGF0ZSwgYSBtYWdpY2xpbmsgd2lsbCBiZSBzZW50LlxuICAgICAqIElmIHRoZSBge3sgLlRva2VuIH19YCB2YXJpYWJsZSBpcyBzcGVjaWZpZWQgaW4gdGhlIGVtYWlsIHRlbXBsYXRlLCBhbiBPVFAgd2lsbCBiZSBzZW50LlxuICAgICAqIElmIHlvdSdyZSB1c2luZyBwaG9uZSBzaWduLWlucywgb25seSBhbiBPVFAgd2lsbCBiZSBzZW50LiBZb3Ugd29uJ3QgYmUgYWJsZSB0byBzZW5kIGEgbWFnaWNsaW5rIGZvciBwaG9uZSBzaWduLWlucy5cbiAgICAgKlxuICAgICAqIEJlIGF3YXJlIHRoYXQgeW91IG1heSBnZXQgYmFjayBhbiBlcnJvciBtZXNzYWdlIHRoYXQgd2lsbCBub3QgZGlzdGluZ3Vpc2hcbiAgICAgKiBiZXR3ZWVuIHRoZSBjYXNlcyB3aGVyZSB0aGUgYWNjb3VudCBkb2VzIG5vdCBleGlzdCBvciwgdGhhdCB0aGUgYWNjb3VudFxuICAgICAqIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIHZpYSBzb2NpYWwgbG9naW4uXG4gICAgICpcbiAgICAgKiBEbyBub3RlIHRoYXQgeW91IHdpbGwgbmVlZCB0byBjb25maWd1cmUgYSBXaGF0c2FwcCBzZW5kZXIgb24gVHdpbGlvXG4gICAgICogaWYgeW91IGFyZSB1c2luZyBwaG9uZSBzaWduIGluIHdpdGggdGhlICd3aGF0c2FwcCcgY2hhbm5lbC4gVGhlIHdoYXRzYXBwXG4gICAgICogY2hhbm5lbCBpcyBub3Qgc3VwcG9ydGVkIG9uIG90aGVyIHByb3ZpZGVyc1xuICAgICAqIGF0IHRoaXMgdGltZS5cbiAgICAgKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBQS0NFIHdoZW4gYW4gZW1haWwgaXMgcGFzc2VkLlxuICAgICAqL1xuICAgIGFzeW5jIHNpZ25JbldpdGhPdHAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICgnZW1haWwnIGluIGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBlbWFpbCwgb3B0aW9ucyB9ID0gY3JlZGVudGlhbHM7XG4gICAgICAgICAgICAgICAgbGV0IGNvZGVDaGFsbGVuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCBjb2RlQ2hhbGxlbmdlTWV0aG9kID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mbG93VHlwZSA9PT0gJ3BrY2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICAgICAgW2NvZGVDaGFsbGVuZ2UsIGNvZGVDaGFsbGVuZ2VNZXRob2RdID0gYXdhaXQgZ2V0Q29kZUNoYWxsZW5nZUFuZE1ldGhvZCh0aGlzLnN0b3JhZ2UsIHRoaXMuc3RvcmFnZUtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L290cGAsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5kYXRhKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZV91c2VyOiAoX2IgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuc2hvdWxkQ3JlYXRlVXNlcikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdvdHJ1ZV9tZXRhX3NlY3VyaXR5OiB7IGNhcHRjaGFfdG9rZW46IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jYXB0Y2hhVG9rZW4gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVfY2hhbGxlbmdlOiBjb2RlQ2hhbGxlbmdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZV9jaGFsbGVuZ2VfbWV0aG9kOiBjb2RlQ2hhbGxlbmdlTWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZW1haWxSZWRpcmVjdFRvLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCdwaG9uZScgaW4gY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBob25lLCBvcHRpb25zIH0gPSBjcmVkZW50aWFscztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUE9TVCcsIGAke3RoaXMudXJsfS9vdHBgLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGhvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAoX2MgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZGF0YSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVfdXNlcjogKF9kID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnNob3VsZENyZWF0ZVVzZXIpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBnb3RydWVfbWV0YV9zZWN1cml0eTogeyBjYXB0Y2hhX3Rva2VuOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuY2FwdGNoYVRva2VuIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiAoX2UgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuY2hhbm5lbCkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogJ3NtcycsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsLCBtZXNzYWdlSWQ6IGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGF0YS5tZXNzYWdlX2lkIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgQXV0aEludmFsaWRDcmVkZW50aWFsc0Vycm9yKCdZb3UgbXVzdCBwcm92aWRlIGVpdGhlciBhbiBlbWFpbCBvciBwaG9uZSBudW1iZXIuJyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBMb2cgaW4gYSB1c2VyIGdpdmVuIGEgVXNlciBzdXBwbGllZCBPVFAgb3IgVG9rZW5IYXNoIHJlY2VpdmVkIHRocm91Z2ggbW9iaWxlIG9yIGVtYWlsLlxuICAgICAqL1xuICAgIGFzeW5jIHZlcmlmeU90cChwYXJhbXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCByZWRpcmVjdFRvID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IGNhcHRjaGFUb2tlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICgnb3B0aW9ucycgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbyA9IChfYSA9IHBhcmFtcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVkaXJlY3RUbztcbiAgICAgICAgICAgICAgICBjYXB0Y2hhVG9rZW4gPSAoX2IgPSBwYXJhbXMub3B0aW9ucykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhcHRjaGFUb2tlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L3ZlcmlmeWAsIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgYm9keTogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwYXJhbXMpLCB7IGdvdHJ1ZV9tZXRhX3NlY3VyaXR5OiB7IGNhcHRjaGFfdG9rZW46IGNhcHRjaGFUb2tlbiB9IH0pLFxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG8sXG4gICAgICAgICAgICAgICAgeGZvcm06IF9zZXNzaW9uUmVzcG9uc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBlcnJvciBvY2N1cnJlZCBvbiB0b2tlbiB2ZXJpZmljYXRpb24uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uID0gZGF0YS5zZXNzaW9uO1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IGRhdGEudXNlcjtcbiAgICAgICAgICAgIGlmIChzZXNzaW9uID09PSBudWxsIHx8IHNlc3Npb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlc3Npb24uYWNjZXNzX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2F2ZVNlc3Npb24oc2Vzc2lvbik7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5QWxsU3Vic2NyaWJlcnMocGFyYW1zLnR5cGUgPT0gJ3JlY292ZXJ5JyA/ICdQQVNTV09SRF9SRUNPVkVSWScgOiAnU0lHTkVEX0lOJywgc2Vzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXIsIHNlc3Npb24gfSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIGEgc2luZ2xlLXNpZ24gb24gdXNpbmcgYW4gZW50ZXJwcmlzZSBJZGVudGl0eSBQcm92aWRlci4gQVxuICAgICAqIHN1Y2Nlc3NmdWwgU1NPIGF0dGVtcHQgd2lsbCByZWRpcmVjdCB0aGUgY3VycmVudCBwYWdlIHRvIHRoZSBpZGVudGl0eVxuICAgICAqIHByb3ZpZGVyIGF1dGhvcml6YXRpb24gcGFnZS4gVGhlIHJlZGlyZWN0IFVSTCBpcyBpbXBsZW1lbnRhdGlvbiBhbmQgU1NPXG4gICAgICogcHJvdG9jb2wgc3BlY2lmaWMuXG4gICAgICpcbiAgICAgKiBZb3UgY2FuIHVzZSBpdCBieSBwcm92aWRpbmcgYSBTU08gZG9tYWluLiBUeXBpY2FsbHkgeW91IGNhbiBleHRyYWN0IHRoaXNcbiAgICAgKiBkb21haW4gYnkgYXNraW5nIHVzZXJzIGZvciB0aGVpciBlbWFpbCBhZGRyZXNzLiBJZiB0aGlzIGRvbWFpbiBpc1xuICAgICAqIHJlZ2lzdGVyZWQgb24gdGhlIEF1dGggaW5zdGFuY2UgdGhlIHJlZGlyZWN0IHdpbGwgdXNlIHRoYXQgb3JnYW5pemF0aW9uJ3NcbiAgICAgKiBjdXJyZW50bHkgYWN0aXZlIFNTTyBJZGVudGl0eSBQcm92aWRlciBmb3IgdGhlIGxvZ2luLlxuICAgICAqXG4gICAgICogSWYgeW91IGhhdmUgYnVpbHQgYW4gb3JnYW5pemF0aW9uLXNwZWNpZmljIGxvZ2luIHBhZ2UsIHlvdSBjYW4gdXNlIHRoZVxuICAgICAqIG9yZ2FuaXphdGlvbidzIFNTTyBJZGVudGl0eSBQcm92aWRlciBVVUlEIGRpcmVjdGx5IGluc3RlYWQuXG4gICAgICovXG4gICAgYXN5bmMgc2lnbkluV2l0aFNTTyhwYXJhbXMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgY29kZUNoYWxsZW5nZSA9IG51bGw7XG4gICAgICAgICAgICBsZXQgY29kZUNoYWxsZW5nZU1ldGhvZCA9IG51bGw7XG4gICAgICAgICAgICBpZiAodGhpcy5mbG93VHlwZSA9PT0gJ3BrY2UnKSB7XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIFtjb2RlQ2hhbGxlbmdlLCBjb2RlQ2hhbGxlbmdlTWV0aG9kXSA9IGF3YWl0IGdldENvZGVDaGFsbGVuZ2VBbmRNZXRob2QodGhpcy5zdG9yYWdlLCB0aGlzLnN0b3JhZ2VLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L3Nzb2AsIHtcbiAgICAgICAgICAgICAgICBib2R5OiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sICgncHJvdmlkZXJJZCcgaW4gcGFyYW1zID8geyBwcm92aWRlcl9pZDogcGFyYW1zLnByb3ZpZGVySWQgfSA6IG51bGwpKSwgKCdkb21haW4nIGluIHBhcmFtcyA/IHsgZG9tYWluOiBwYXJhbXMuZG9tYWluIH0gOiBudWxsKSksIHsgcmVkaXJlY3RfdG86IChfYiA9IChfYSA9IHBhcmFtcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVkaXJlY3RUbykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdW5kZWZpbmVkIH0pLCAoKChfYyA9IHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2FwdGNoYVRva2VuKVxuICAgICAgICAgICAgICAgICAgICA/IHsgZ290cnVlX21ldGFfc2VjdXJpdHk6IHsgY2FwdGNoYV90b2tlbjogcGFyYW1zLm9wdGlvbnMuY2FwdGNoYVRva2VuIH0gfVxuICAgICAgICAgICAgICAgICAgICA6IG51bGwpKSwgeyBza2lwX2h0dHBfcmVkaXJlY3Q6IHRydWUsIGNvZGVfY2hhbGxlbmdlOiBjb2RlQ2hhbGxlbmdlLCBjb2RlX2NoYWxsZW5nZV9tZXRob2Q6IGNvZGVDaGFsbGVuZ2VNZXRob2QgfSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIHhmb3JtOiBfc3NvUmVzcG9uc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZHMgYSByZWF1dGhlbnRpY2F0aW9uIE9UUCB0byB0aGUgdXNlcidzIGVtYWlsIG9yIHBob25lIG51bWJlci5cbiAgICAgKiBSZXF1aXJlcyB0aGUgdXNlciB0byBiZSBzaWduZWQtaW4uXG4gICAgICovXG4gICAgYXN5bmMgcmVhdXRoZW50aWNhdGUoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVByb21pc2U7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9hY3F1aXJlTG9jaygtMSwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3JlYXV0aGVudGljYXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBfcmVhdXRoZW50aWNhdGUoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdXNlU2Vzc2lvbihhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhOiB7IHNlc3Npb24gfSwgZXJyb3I6IHNlc3Npb25FcnJvciwgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAoc2Vzc2lvbkVycm9yKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBzZXNzaW9uRXJyb3I7XG4gICAgICAgICAgICAgICAgaWYgKCFzZXNzaW9uKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXV0aFNlc3Npb25NaXNzaW5nRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnR0VUJywgYCR7dGhpcy51cmx9L3JlYXV0aGVudGljYXRlYCwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGp3dDogc2Vzc2lvbi5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc2VuZHMgYW4gZXhpc3Rpbmcgc2lnbnVwIGNvbmZpcm1hdGlvbiBlbWFpbCwgZW1haWwgY2hhbmdlIGVtYWlsLCBTTVMgT1RQIG9yIHBob25lIGNoYW5nZSBPVFAuXG4gICAgICovXG4gICAgYXN5bmMgcmVzZW5kKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGAke3RoaXMudXJsfS9yZXNlbmRgO1xuICAgICAgICAgICAgaWYgKCdlbWFpbCcgaW4gY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVtYWlsLCB0eXBlLCBvcHRpb25zIH0gPSBjcmVkZW50aWFscztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUE9TVCcsIGVuZHBvaW50LCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ290cnVlX21ldGFfc2VjdXJpdHk6IHsgY2FwdGNoYV90b2tlbjogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmNhcHRjaGFUb2tlbiB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZW1haWxSZWRpcmVjdFRvLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoJ3Bob25lJyBpbiBjcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGhvbmUsIHR5cGUsIG9wdGlvbnMgfSA9IGNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgZW5kcG9pbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBnb3RydWVfbWV0YV9zZWN1cml0eTogeyBjYXB0Y2hhX3Rva2VuOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuY2FwdGNoYVRva2VuIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsLCBtZXNzYWdlSWQ6IGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGF0YS5tZXNzYWdlX2lkIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgQXV0aEludmFsaWRDcmVkZW50aWFsc0Vycm9yKCdZb3UgbXVzdCBwcm92aWRlIGVpdGhlciBhbiBlbWFpbCBvciBwaG9uZSBudW1iZXIgYW5kIGEgdHlwZScpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2Vzc2lvbiwgcmVmcmVzaGluZyBpdCBpZiBuZWNlc3NhcnkuXG4gICAgICpcbiAgICAgKiBUaGUgc2Vzc2lvbiByZXR1cm5lZCBjYW4gYmUgbnVsbCBpZiB0aGUgc2Vzc2lvbiBpcyBub3QgZGV0ZWN0ZWQgd2hpY2ggY2FuIGhhcHBlbiBpbiB0aGUgZXZlbnQgYSB1c2VyIGlzIG5vdCBzaWduZWQtaW4gb3IgaGFzIGxvZ2dlZCBvdXQuXG4gICAgICpcbiAgICAgKiAqKklNUE9SVEFOVDoqKiBUaGlzIG1ldGhvZCBsb2FkcyB2YWx1ZXMgZGlyZWN0bHkgZnJvbSB0aGUgc3RvcmFnZSBhdHRhY2hlZFxuICAgICAqIHRvIHRoZSBjbGllbnQuIElmIHRoYXQgc3RvcmFnZSBpcyBiYXNlZCBvbiByZXF1ZXN0IGNvb2tpZXMgZm9yIGV4YW1wbGUsXG4gICAgICogdGhlIHZhbHVlcyBpbiBpdCBtYXkgbm90IGJlIGF1dGhlbnRpYyBhbmQgdGhlcmVmb3JlIGl0J3Mgc3Ryb25nbHkgYWR2aXNlZFxuICAgICAqIGFnYWluc3QgdXNpbmcgdGhpcyBtZXRob2QgYW5kIGl0cyByZXN1bHRzIGluIHN1Y2ggY2lyY3Vtc3RhbmNlcy4gQSB3YXJuaW5nXG4gICAgICogd2lsbCBiZSBlbWl0dGVkIGlmIHRoaXMgaXMgZGV0ZWN0ZWQuIFVzZSB7QGxpbmsgI2dldFVzZXIoKX0gaW5zdGVhZC5cbiAgICAgKi9cbiAgICBhc3luYyBnZXRTZXNzaW9uKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVQcm9taXNlO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLl9hY3F1aXJlTG9jaygtMSwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VzZVNlc3Npb24oYXN5bmMgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFjcXVpcmVzIGEgZ2xvYmFsIGxvY2sgYmFzZWQgb24gdGhlIHN0b3JhZ2Uga2V5LlxuICAgICAqL1xuICAgIGFzeW5jIF9hY3F1aXJlTG9jayhhY3F1aXJlVGltZW91dCwgZm4pIHtcbiAgICAgICAgdGhpcy5fZGVidWcoJyNfYWNxdWlyZUxvY2snLCAnYmVnaW4nLCBhY3F1aXJlVGltZW91dCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sb2NrQWNxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0ID0gdGhpcy5wZW5kaW5nSW5Mb2NrLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMucGVuZGluZ0luTG9ja1t0aGlzLnBlbmRpbmdJbkxvY2subGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBsYXN0O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgZm4oKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0luTG9jay5wdXNoKChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGp1c3QgY2FyZSBpZiBpdCBmaW5pc2hlZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmxvY2soYGxvY2s6JHt0aGlzLnN0b3JhZ2VLZXl9YCwgYWNxdWlyZVRpbWVvdXQsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1ZygnI19hY3F1aXJlTG9jaycsICdsb2NrIGFjcXVpcmVkIGZvciBzdG9yYWdlIGtleScsIHRoaXMuc3RvcmFnZUtleSk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NrQWNxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdJbkxvY2sucHVzaCgoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGp1c3QgY2FyZSBpZiBpdCBmaW5pc2hlZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAvLyBrZWVwIGRyYWluaW5nIHRoZSBxdWV1ZSB1bnRpbCB0aGVyZSdzIG5vdGhpbmcgdG8gd2FpdCBvblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5wZW5kaW5nSW5Mb2NrLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2FpdE9uID0gWy4uLnRoaXMucGVuZGluZ0luTG9ja107XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh3YWl0T24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nSW5Mb2NrLnNwbGljZSgwLCB3YWl0T24ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfYWNxdWlyZUxvY2snLCAnbG9jayByZWxlYXNlZCBmb3Igc3RvcmFnZSBrZXknLCB0aGlzLnN0b3JhZ2VLZXkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2tBY3F1aXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfYWNxdWlyZUxvY2snLCAnZW5kJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVXNlIGluc3RlYWQgb2Yge0BsaW5rICNnZXRTZXNzaW9ufSBpbnNpZGUgdGhlIGxpYnJhcnkuIEl0IGlzXG4gICAgICogc2VtYW50aWNhbGx5IHVzdWFsbHkgd2hhdCB5b3Ugd2FudCwgYXMgZ2V0dGluZyBhIHNlc3Npb24gaW52b2x2ZXMgc29tZVxuICAgICAqIHByb2Nlc3NpbmcgYWZ0ZXJ3YXJkcyB0aGF0IHJlcXVpcmVzIG9ubHkgb25lIGNsaWVudCBvcGVyYXRpbmcgb24gdGhlXG4gICAgICogc2Vzc2lvbiBhdCBvbmNlIGFjcm9zcyBtdWx0aXBsZSB0YWJzIG9yIHByb2Nlc3Nlcy5cbiAgICAgKi9cbiAgICBhc3luYyBfdXNlU2Vzc2lvbihmbikge1xuICAgICAgICB0aGlzLl9kZWJ1ZygnI191c2VTZXNzaW9uJywgJ2JlZ2luJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyB0aGUgdXNlIG9mIF9fbG9hZFNlc3Npb24gaGVyZSBpcyB0aGUgb25seSBjb3JyZWN0IHVzZSBvZiB0aGUgZnVuY3Rpb24hXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLl9fbG9hZFNlc3Npb24oKTtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBmbihyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfdXNlU2Vzc2lvbicsICdlbmQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBORVZFUiBVU0UgRElSRUNUTFkhXG4gICAgICpcbiAgICAgKiBBbHdheXMgdXNlIHtAbGluayAjX3VzZVNlc3Npb259LlxuICAgICAqL1xuICAgIGFzeW5jIF9fbG9hZFNlc3Npb24oKSB7XG4gICAgICAgIHRoaXMuX2RlYnVnKCcjX19sb2FkU2Vzc2lvbigpJywgJ2JlZ2luJyk7XG4gICAgICAgIGlmICghdGhpcy5sb2NrQWNxdWlyZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnKCcjX19sb2FkU2Vzc2lvbigpJywgJ3VzZWQgb3V0c2lkZSBvZiBhbiBhY3F1aXJlZCBsb2NrIScsIG5ldyBFcnJvcigpLnN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRTZXNzaW9uID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IG1heWJlU2Vzc2lvbiA9IGF3YWl0IGdldEl0ZW1Bc3luYyh0aGlzLnN0b3JhZ2UsIHRoaXMuc3RvcmFnZUtleSk7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1ZygnI2dldFNlc3Npb24oKScsICdzZXNzaW9uIGZyb20gc3RvcmFnZScsIG1heWJlU2Vzc2lvbik7XG4gICAgICAgICAgICBpZiAobWF5YmVTZXNzaW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzVmFsaWRTZXNzaW9uKG1heWJlU2Vzc2lvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNlc3Npb24gPSBtYXliZVNlc3Npb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1ZygnI2dldFNlc3Npb24oKScsICdzZXNzaW9uIGZyb20gc3RvcmFnZSBpcyBub3QgdmFsaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVtb3ZlU2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY3VycmVudFNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHNlc3Npb246IG51bGwgfSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEEgc2Vzc2lvbiBpcyBjb25zaWRlcmVkIGV4cGlyZWQgYmVmb3JlIHRoZSBhY2Nlc3MgdG9rZW4gX2FjdHVhbGx5X1xuICAgICAgICAgICAgLy8gZXhwaXJlcy4gV2hlbiB0aGUgYXV0b1JlZnJlc2hUb2tlbiBvcHRpb24gaXMgb2ZmIChvciB3aGVuIHRoZSB0YWIgaXNcbiAgICAgICAgICAgIC8vIGluIHRoZSBiYWNrZ3JvdW5kKSwgdmVyeSBlYWdlciB1c2VycyBvZiBnZXRTZXNzaW9uKCkgLS0gbGlrZVxuICAgICAgICAgICAgLy8gcmVhbHRpbWUtanMgLS0gbWlnaHQgc2VuZCBhIHZhbGlkIEpXVCB3aGljaCB3aWxsIGV4cGlyZSBieSB0aGUgdGltZSBpdFxuICAgICAgICAgICAgLy8gcmVhY2hlcyB0aGUgc2VydmVyLlxuICAgICAgICAgICAgY29uc3QgaGFzRXhwaXJlZCA9IGN1cnJlbnRTZXNzaW9uLmV4cGlyZXNfYXRcbiAgICAgICAgICAgICAgICA/IGN1cnJlbnRTZXNzaW9uLmV4cGlyZXNfYXQgKiAxMDAwIC0gRGF0ZS5ub3coKSA8IEVYUElSWV9NQVJHSU5fTVNcbiAgICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfX2xvYWRTZXNzaW9uKCknLCBgc2Vzc2lvbiBoYXMke2hhc0V4cGlyZWQgPyAnJyA6ICcgbm90J30gZXhwaXJlZGAsICdleHBpcmVzX2F0JywgY3VycmVudFNlc3Npb24uZXhwaXJlc19hdCk7XG4gICAgICAgICAgICBpZiAoIWhhc0V4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdG9yYWdlLmlzU2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdXBwcmVzc1dhcm5pbmcgPSB0aGlzLnN1cHByZXNzR2V0U2Vzc2lvbldhcm5pbmc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3h5U2Vzc2lvbiA9IG5ldyBQcm94eShjdXJyZW50U2Vzc2lvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3VwcHJlc3NXYXJuaW5nICYmIHByb3AgPT09ICd1c2VyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHNob3cgd2FybmluZyB3aGVuIHRoZSB1c2VyIG9iamVjdCBpcyBiZWluZyBhY2Nlc3NlZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdVc2luZyB0aGUgdXNlciBvYmplY3QgYXMgcmV0dXJuZWQgZnJvbSBzdXBhYmFzZS5hdXRoLmdldFNlc3Npb24oKSBvciBmcm9tIHNvbWUgc3VwYWJhc2UuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZSgpIGV2ZW50cyBjb3VsZCBiZSBpbnNlY3VyZSEgVGhpcyB2YWx1ZSBjb21lcyBkaXJlY3RseSBmcm9tIHRoZSBzdG9yYWdlIG1lZGl1bSAodXN1YWxseSBjb29raWVzIG9uIHRoZSBzZXJ2ZXIpIGFuZCBtYXkgbm90IGJlIGF1dGhlbnRpYy4gVXNlIHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpIGluc3RlYWQgd2hpY2ggYXV0aGVudGljYXRlcyB0aGUgZGF0YSBieSBjb250YWN0aW5nIHRoZSBTdXBhYmFzZSBBdXRoIHNlcnZlci4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwcHJlc3NXYXJuaW5nID0gdHJ1ZTsgLy8ga2VlcHMgdGhpcyBwcm94eSBpbnN0YW5jZSBmcm9tIGxvZ2dpbmcgYWRkaXRpb25hbCB3YXJuaW5nc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN1cHByZXNzR2V0U2Vzc2lvbldhcm5pbmcgPSB0cnVlOyAvLyBrZWVwcyB0aGlzIGNsaWVudCdzIGZ1dHVyZSBwcm94eSBpbnN0YW5jZXMgZnJvbSB3YXJuaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2Vzc2lvbiA9IHByb3h5U2Vzc2lvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyBzZXNzaW9uOiBjdXJyZW50U2Vzc2lvbiB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBzZXNzaW9uLCBlcnJvciB9ID0gYXdhaXQgdGhpcy5fY2FsbFJlZnJlc2hUb2tlbihjdXJyZW50U2Vzc2lvbi5yZWZyZXNoX3Rva2VuKTtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgc2Vzc2lvbjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyBzZXNzaW9uIH0sIGVycm9yOiBudWxsIH07XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1ZygnI19fbG9hZFNlc3Npb24oKScsICdlbmQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IHVzZXIgZGV0YWlscyBpZiB0aGVyZSBpcyBhbiBleGlzdGluZyBzZXNzaW9uLiBUaGlzIG1ldGhvZFxuICAgICAqIHBlcmZvcm1zIGEgbmV0d29yayByZXF1ZXN0IHRvIHRoZSBTdXBhYmFzZSBBdXRoIHNlcnZlciwgc28gdGhlIHJldHVybmVkXG4gICAgICogdmFsdWUgaXMgYXV0aGVudGljIGFuZCBjYW4gYmUgdXNlZCB0byBiYXNlIGF1dGhvcml6YXRpb24gcnVsZXMgb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gand0IFRha2VzIGluIGFuIG9wdGlvbmFsIGFjY2VzcyB0b2tlbiBKV1QuIElmIG5vIEpXVCBpcyBwcm92aWRlZCwgdGhlIEpXVCBmcm9tIHRoZSBjdXJyZW50IHNlc3Npb24gaXMgdXNlZC5cbiAgICAgKi9cbiAgICBhc3luYyBnZXRVc2VyKGp3dCkge1xuICAgICAgICBpZiAoand0KSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fZ2V0VXNlcihqd3QpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVByb21pc2U7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuX2FjcXVpcmVMb2NrKC0xLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fZ2V0VXNlcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgYXN5bmMgX2dldFVzZXIoand0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoand0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdHRVQnLCBgJHt0aGlzLnVybH0vdXNlcmAsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBqd3Q6IGp3dCxcbiAgICAgICAgICAgICAgICAgICAgeGZvcm06IF91c2VyUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdXNlU2Vzc2lvbihhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyBhbiBlcnJvciBpZiB0aGVyZSBpcyBubyBhY2Nlc3NfdG9rZW4gb3IgY3VzdG9tIGF1dGhvcml6YXRpb24gaGVhZGVyXG4gICAgICAgICAgICAgICAgaWYgKCEoKF9hID0gZGF0YS5zZXNzaW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWNjZXNzX3Rva2VuKSAmJiAhdGhpcy5oYXNDdXN0b21BdXRob3JpemF0aW9uSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCB9LCBlcnJvcjogbmV3IEF1dGhTZXNzaW9uTWlzc2luZ0Vycm9yKCkgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdHRVQnLCBgJHt0aGlzLnVybH0vdXNlcmAsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBqd3Q6IChfYyA9IChfYiA9IGRhdGEuc2Vzc2lvbikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmFjY2Vzc190b2tlbikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB4Zm9ybTogX3VzZXJSZXNwb25zZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0F1dGhTZXNzaW9uTWlzc2luZ0Vycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBKV1QgY29udGFpbnMgYSBgc2Vzc2lvbl9pZGAgd2hpY2ggZG9lcyBub3QgY29ycmVzcG9uZCB0byBhbiBhY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgLy8gc2Vzc2lvbiBpbiB0aGUgZGF0YWJhc2UsIGluZGljYXRpbmcgdGhlIHVzZXIgaXMgc2lnbmVkIG91dC5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVtb3ZlU2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCByZW1vdmVJdGVtQXN5bmModGhpcy5zdG9yYWdlLCBgJHt0aGlzLnN0b3JhZ2VLZXl9LWNvZGUtdmVyaWZpZXJgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHVzZXIgZGF0YSBmb3IgYSBsb2dnZWQgaW4gdXNlci5cbiAgICAgKi9cbiAgICBhc3luYyB1cGRhdGVVc2VyKGF0dHJpYnV0ZXMsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVQcm9taXNlO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl91cGRhdGVVc2VyKGF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgX3VwZGF0ZVVzZXIoYXR0cmlidXRlcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdXNlU2Vzc2lvbihhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhOiBzZXNzaW9uRGF0YSwgZXJyb3I6IHNlc3Npb25FcnJvciB9ID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChzZXNzaW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgc2Vzc2lvbkVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXNlc3Npb25EYXRhLnNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhTZXNzaW9uTWlzc2luZ0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlc3Npb24gPSBzZXNzaW9uRGF0YS5zZXNzaW9uO1xuICAgICAgICAgICAgICAgIGxldCBjb2RlQ2hhbGxlbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgY29kZUNoYWxsZW5nZU1ldGhvZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmxvd1R5cGUgPT09ICdwa2NlJyAmJiBhdHRyaWJ1dGVzLmVtYWlsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICBbY29kZUNoYWxsZW5nZSwgY29kZUNoYWxsZW5nZU1ldGhvZF0gPSBhd2FpdCBnZXRDb2RlQ2hhbGxlbmdlQW5kTWV0aG9kKHRoaXMuc3RvcmFnZSwgdGhpcy5zdG9yYWdlS2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvcjogdXNlckVycm9yIH0gPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUFVUJywgYCR7dGhpcy51cmx9L3VzZXJgLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmVtYWlsUmVkaXJlY3RUbyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBhdHRyaWJ1dGVzKSwgeyBjb2RlX2NoYWxsZW5nZTogY29kZUNoYWxsZW5nZSwgY29kZV9jaGFsbGVuZ2VfbWV0aG9kOiBjb2RlQ2hhbGxlbmdlTWV0aG9kIH0pLFxuICAgICAgICAgICAgICAgICAgICBqd3Q6IHNlc3Npb24uYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICB4Zm9ybTogX3VzZXJSZXNwb25zZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAodXNlckVycm9yKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyB1c2VyRXJyb3I7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbi51c2VyID0gZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NhdmVTZXNzaW9uKHNlc3Npb24pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX25vdGlmeUFsbFN1YnNjcmliZXJzKCdVU0VSX1VQREFURUQnLCBzZXNzaW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IHNlc3Npb24udXNlciB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBzZXNzaW9uIGRhdGEgZnJvbSB0aGUgY3VycmVudCBzZXNzaW9uLiBJZiB0aGUgY3VycmVudCBzZXNzaW9uIGlzIGV4cGlyZWQsIHNldFNlc3Npb24gd2lsbCB0YWtlIGNhcmUgb2YgcmVmcmVzaGluZyBpdCB0byBvYnRhaW4gYSBuZXcgc2Vzc2lvbi5cbiAgICAgKiBJZiB0aGUgcmVmcmVzaCB0b2tlbiBvciBhY2Nlc3MgdG9rZW4gaW4gdGhlIGN1cnJlbnQgc2Vzc2lvbiBpcyBpbnZhbGlkLCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICAgKiBAcGFyYW0gY3VycmVudFNlc3Npb24gVGhlIGN1cnJlbnQgc2Vzc2lvbiB0aGF0IG1pbmltYWxseSBjb250YWlucyBhbiBhY2Nlc3MgdG9rZW4gYW5kIHJlZnJlc2ggdG9rZW4uXG4gICAgICovXG4gICAgYXN5bmMgc2V0U2Vzc2lvbihjdXJyZW50U2Vzc2lvbikge1xuICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVQcm9taXNlO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9zZXRTZXNzaW9uKGN1cnJlbnRTZXNzaW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIF9zZXRTZXNzaW9uKGN1cnJlbnRTZXNzaW9uKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRTZXNzaW9uLmFjY2Vzc190b2tlbiB8fCAhY3VycmVudFNlc3Npb24ucmVmcmVzaF90b2tlbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBdXRoU2Vzc2lvbk1pc3NpbmdFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGltZU5vdyA9IERhdGUubm93KCkgLyAxMDAwO1xuICAgICAgICAgICAgbGV0IGV4cGlyZXNBdCA9IHRpbWVOb3c7XG4gICAgICAgICAgICBsZXQgaGFzRXhwaXJlZCA9IHRydWU7XG4gICAgICAgICAgICBsZXQgc2Vzc2lvbiA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB7IHBheWxvYWQgfSA9IGRlY29kZUpXVChjdXJyZW50U2Vzc2lvbi5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQuZXhwKSB7XG4gICAgICAgICAgICAgICAgZXhwaXJlc0F0ID0gcGF5bG9hZC5leHA7XG4gICAgICAgICAgICAgICAgaGFzRXhwaXJlZCA9IGV4cGlyZXNBdCA8PSB0aW1lTm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0V4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNlc3Npb246IHJlZnJlc2hlZFNlc3Npb24sIGVycm9yIH0gPSBhd2FpdCB0aGlzLl9jYWxsUmVmcmVzaFRva2VuKGN1cnJlbnRTZXNzaW9uLnJlZnJlc2hfdG9rZW4pO1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3I6IGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghcmVmcmVzaGVkU2Vzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IG51bGwsIHNlc3Npb246IG51bGwgfSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IHJlZnJlc2hlZFNlc3Npb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCB0aGlzLl9nZXRVc2VyKGN1cnJlbnRTZXNzaW9uLmFjY2Vzc190b2tlbik7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXNzaW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IGN1cnJlbnRTZXNzaW9uLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogY3VycmVudFNlc3Npb24ucmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogZGF0YS51c2VyLFxuICAgICAgICAgICAgICAgICAgICB0b2tlbl90eXBlOiAnYmVhcmVyJyxcbiAgICAgICAgICAgICAgICAgICAgZXhwaXJlc19pbjogZXhwaXJlc0F0IC0gdGltZU5vdyxcbiAgICAgICAgICAgICAgICAgICAgZXhwaXJlc19hdDogZXhwaXJlc0F0LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2F2ZVNlc3Npb24oc2Vzc2lvbik7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5QWxsU3Vic2NyaWJlcnMoJ1NJR05FRF9JTicsIHNlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBzZXNzaW9uLnVzZXIsIHNlc3Npb24gfSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHNlc3Npb246IG51bGwsIHVzZXI6IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgc2Vzc2lvbiwgcmVnYXJkbGVzcyBvZiBleHBpcnkgc3RhdHVzLlxuICAgICAqIFRha2VzIGluIGFuIG9wdGlvbmFsIGN1cnJlbnQgc2Vzc2lvbi4gSWYgbm90IHBhc3NlZCBpbiwgdGhlbiByZWZyZXNoU2Vzc2lvbigpIHdpbGwgYXR0ZW1wdCB0byByZXRyaWV2ZSBpdCBmcm9tIGdldFNlc3Npb24oKS5cbiAgICAgKiBJZiB0aGUgY3VycmVudCBzZXNzaW9uJ3MgcmVmcmVzaCB0b2tlbiBpcyBpbnZhbGlkLCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICAgKiBAcGFyYW0gY3VycmVudFNlc3Npb24gVGhlIGN1cnJlbnQgc2Vzc2lvbi4gSWYgcGFzc2VkIGluLCBpdCBtdXN0IGNvbnRhaW4gYSByZWZyZXNoIHRva2VuLlxuICAgICAqL1xuICAgIGFzeW5jIHJlZnJlc2hTZXNzaW9uKGN1cnJlbnRTZXNzaW9uKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVByb21pc2U7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9hY3F1aXJlTG9jaygtMSwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3JlZnJlc2hTZXNzaW9uKGN1cnJlbnRTZXNzaW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIF9yZWZyZXNoU2Vzc2lvbihjdXJyZW50U2Vzc2lvbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3VzZVNlc3Npb24oYXN5bmMgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnRTZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2Vzc2lvbiA9IChfYSA9IGRhdGEuc2Vzc2lvbikgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIShjdXJyZW50U2Vzc2lvbiA9PT0gbnVsbCB8fCBjdXJyZW50U2Vzc2lvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudFNlc3Npb24ucmVmcmVzaF90b2tlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhTZXNzaW9uTWlzc2luZ0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2Vzc2lvbiwgZXJyb3IgfSA9IGF3YWl0IHRoaXMuX2NhbGxSZWZyZXNoVG9rZW4oY3VycmVudFNlc3Npb24ucmVmcmVzaF90b2tlbik7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvcjogZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgdXNlcjogbnVsbCwgc2Vzc2lvbjogbnVsbCB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiB7IHVzZXI6IHNlc3Npb24udXNlciwgc2Vzc2lvbiB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyB1c2VyOiBudWxsLCBzZXNzaW9uOiBudWxsIH0sIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzZXNzaW9uIGRhdGEgZnJvbSBhIFVSTCBzdHJpbmdcbiAgICAgKi9cbiAgICBhc3luYyBfZ2V0U2Vzc2lvbkZyb21VUkwocGFyYW1zLCBjYWxsYmFja1VybFR5cGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghaXNCcm93c2VyKCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhJbXBsaWNpdEdyYW50UmVkaXJlY3RFcnJvcignTm8gYnJvd3NlciBkZXRlY3RlZC4nKTtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYW4gZXJyb3IgaW4gdGhlIFVSTCwgaXQgZG9lc24ndCBtYXR0ZXIgd2hhdCBmbG93IGl0IGlzLCB3ZSBqdXN0IHJldHVybiB0aGUgZXJyb3IuXG4gICAgICAgICAgICBpZiAocGFyYW1zLmVycm9yIHx8IHBhcmFtcy5lcnJvcl9kZXNjcmlwdGlvbiB8fCBwYXJhbXMuZXJyb3JfY29kZSkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBlcnJvciBjbGFzcyByZXR1cm5lZCBpbXBsaWVzIHRoYXQgdGhlIHJlZGlyZWN0IGlzIGZyb20gYW4gaW1wbGljaXQgZ3JhbnQgZmxvd1xuICAgICAgICAgICAgICAgIC8vIGJ1dCBpdCBjb3VsZCBhbHNvIGJlIGZyb20gYSByZWRpcmVjdCBlcnJvciBmcm9tIGEgUEtDRSBmbG93LlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBdXRoSW1wbGljaXRHcmFudFJlZGlyZWN0RXJyb3IocGFyYW1zLmVycm9yX2Rlc2NyaXB0aW9uIHx8ICdFcnJvciBpbiBVUkwgd2l0aCB1bnNwZWNpZmllZCBlcnJvcl9kZXNjcmlwdGlvbicsIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHBhcmFtcy5lcnJvciB8fCAndW5zcGVjaWZpZWRfZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiBwYXJhbXMuZXJyb3JfY29kZSB8fCAndW5zcGVjaWZpZWRfY29kZScsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDaGVja3MgZm9yIG1pc21hdGNoZXMgYmV0d2VlbiB0aGUgZmxvd1R5cGUgaW5pdGlhbGlzZWQgaW4gdGhlIGNsaWVudCBhbmQgdGhlIFVSTCBwYXJhbWV0ZXJzXG4gICAgICAgICAgICBzd2l0Y2ggKGNhbGxiYWNrVXJsVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2ltcGxpY2l0JzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmxvd1R5cGUgPT09ICdwa2NlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhQS0NFR3JhbnRDb2RlRXhjaGFuZ2VFcnJvcignTm90IGEgdmFsaWQgUEtDRSBmbG93IHVybC4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwa2NlJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmxvd1R5cGUgPT09ICdpbXBsaWNpdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBBdXRoSW1wbGljaXRHcmFudFJlZGlyZWN0RXJyb3IoJ05vdCBhIHZhbGlkIGltcGxpY2l0IGdyYW50IGZsb3cgdXJsLicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gdGhlcmUncyBubyBtaXNtYXRjaCBzbyB3ZSBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2luY2UgdGhpcyBpcyBhIHJlZGlyZWN0IGZvciBQS0NFLCB3ZSBhdHRlbXB0IHRvIHJldHJpZXZlIHRoZSBjb2RlIGZyb20gdGhlIFVSTCBmb3IgdGhlIGNvZGUgZXhjaGFuZ2VcbiAgICAgICAgICAgIGlmIChjYWxsYmFja1VybFR5cGUgPT09ICdwa2NlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnKCcjX2luaXRpYWxpemUoKScsICdiZWdpbicsICdpcyBQS0NFIGZsb3cnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmFtcy5jb2RlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXV0aFBLQ0VHcmFudENvZGVFeGNoYW5nZUVycm9yKCdObyBjb2RlIGRldGVjdGVkLicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHRoaXMuX2V4Y2hhbmdlQ29kZUZvclNlc3Npb24ocGFyYW1zLmNvZGUpO1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5kZWxldGUoJ2NvZGUnKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUod2luZG93Lmhpc3Rvcnkuc3RhdGUsICcnLCB1cmwudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyBzZXNzaW9uOiBkYXRhLnNlc3Npb24sIHJlZGlyZWN0VHlwZTogbnVsbCB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBwcm92aWRlcl90b2tlbiwgcHJvdmlkZXJfcmVmcmVzaF90b2tlbiwgYWNjZXNzX3Rva2VuLCByZWZyZXNoX3Rva2VuLCBleHBpcmVzX2luLCBleHBpcmVzX2F0LCB0b2tlbl90eXBlLCB9ID0gcGFyYW1zO1xuICAgICAgICAgICAgaWYgKCFhY2Nlc3NfdG9rZW4gfHwgIWV4cGlyZXNfaW4gfHwgIXJlZnJlc2hfdG9rZW4gfHwgIXRva2VuX3R5cGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXV0aEltcGxpY2l0R3JhbnRSZWRpcmVjdEVycm9yKCdObyBzZXNzaW9uIGRlZmluZWQgaW4gVVJMJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0aW1lTm93ID0gTWF0aC5yb3VuZChEYXRlLm5vdygpIC8gMTAwMCk7XG4gICAgICAgICAgICBjb25zdCBleHBpcmVzSW4gPSBwYXJzZUludChleHBpcmVzX2luKTtcbiAgICAgICAgICAgIGxldCBleHBpcmVzQXQgPSB0aW1lTm93ICsgZXhwaXJlc0luO1xuICAgICAgICAgICAgaWYgKGV4cGlyZXNfYXQpIHtcbiAgICAgICAgICAgICAgICBleHBpcmVzQXQgPSBwYXJzZUludChleHBpcmVzX2F0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFjdHVhbGx5RXhwaXJlc0luID0gZXhwaXJlc0F0IC0gdGltZU5vdztcbiAgICAgICAgICAgIGlmIChhY3R1YWxseUV4cGlyZXNJbiAqIDEwMDAgPD0gQVVUT19SRUZSRVNIX1RJQ0tfRFVSQVRJT05fTVMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEBzdXBhYmFzZS9nb3RydWUtanM6IFNlc3Npb24gYXMgcmV0cmlldmVkIGZyb20gVVJMIGV4cGlyZXMgaW4gJHthY3R1YWxseUV4cGlyZXNJbn1zLCBzaG91bGQgaGF2ZSBiZWVuIGNsb3NlciB0byAke2V4cGlyZXNJbn1zYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpc3N1ZWRBdCA9IGV4cGlyZXNBdCAtIGV4cGlyZXNJbjtcbiAgICAgICAgICAgIGlmICh0aW1lTm93IC0gaXNzdWVkQXQgPj0gMTIwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdAc3VwYWJhc2UvZ290cnVlLWpzOiBTZXNzaW9uIGFzIHJldHJpZXZlZCBmcm9tIFVSTCB3YXMgaXNzdWVkIG92ZXIgMTIwcyBhZ28sIFVSTCBjb3VsZCBiZSBzdGFsZScsIGlzc3VlZEF0LCBleHBpcmVzQXQsIHRpbWVOb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGltZU5vdyAtIGlzc3VlZEF0IDwgMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQHN1cGFiYXNlL2dvdHJ1ZS1qczogU2Vzc2lvbiBhcyByZXRyaWV2ZWQgZnJvbSBVUkwgd2FzIGlzc3VlZCBpbiB0aGUgZnV0dXJlPyBDaGVjayB0aGUgZGV2aWNlIGNsb2NrIGZvciBza2V3JywgaXNzdWVkQXQsIGV4cGlyZXNBdCwgdGltZU5vdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCB0aGlzLl9nZXRVc2VyKGFjY2Vzc190b2tlbik7XG4gICAgICAgICAgICBpZiAoZXJyb3IpXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uID0ge1xuICAgICAgICAgICAgICAgIHByb3ZpZGVyX3Rva2VuLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVyX3JlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICAgIGV4cGlyZXNfaW46IGV4cGlyZXNJbixcbiAgICAgICAgICAgICAgICBleHBpcmVzX2F0OiBleHBpcmVzQXQsXG4gICAgICAgICAgICAgICAgcmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgICAgICB0b2tlbl90eXBlLFxuICAgICAgICAgICAgICAgIHVzZXI6IGRhdGEudXNlcixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBSZW1vdmUgdG9rZW5zIGZyb20gVVJMXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfZ2V0U2Vzc2lvbkZyb21VUkwoKScsICdjbGVhcmluZyB3aW5kb3cubG9jYXRpb24uaGFzaCcpO1xuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyBzZXNzaW9uLCByZWRpcmVjdFR5cGU6IHBhcmFtcy50eXBlIH0sIGVycm9yOiBudWxsIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyBzZXNzaW9uOiBudWxsLCByZWRpcmVjdFR5cGU6IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBVUkwgY29udGFpbnMgcGFyYW1ldGVycyBnaXZlbiBieSBhbiBpbXBsaWNpdCBvYXV0aCBncmFudCBmbG93IChodHRwczovL3d3dy5yZmMtZWRpdG9yLm9yZy9yZmMvcmZjNjc0OS5odG1sI3NlY3Rpb24tNC4yKVxuICAgICAqL1xuICAgIF9pc0ltcGxpY2l0R3JhbnRDYWxsYmFjayhwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4ocGFyYW1zLmFjY2Vzc190b2tlbiB8fCBwYXJhbXMuZXJyb3JfZGVzY3JpcHRpb24pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgVVJMIGFuZCBiYWNraW5nIHN0b3JhZ2UgY29udGFpbiBwYXJhbWV0ZXJzIGdpdmVuIGJ5IGEgUEtDRSBmbG93XG4gICAgICovXG4gICAgYXN5bmMgX2lzUEtDRUNhbGxiYWNrKHBhcmFtcykge1xuICAgICAgICBjb25zdCBjdXJyZW50U3RvcmFnZUNvbnRlbnQgPSBhd2FpdCBnZXRJdGVtQXN5bmModGhpcy5zdG9yYWdlLCBgJHt0aGlzLnN0b3JhZ2VLZXl9LWNvZGUtdmVyaWZpZXJgKTtcbiAgICAgICAgcmV0dXJuICEhKHBhcmFtcy5jb2RlICYmIGN1cnJlbnRTdG9yYWdlQ29udGVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc2lkZSBhIGJyb3dzZXIgY29udGV4dCwgYHNpZ25PdXQoKWAgd2lsbCByZW1vdmUgdGhlIGxvZ2dlZCBpbiB1c2VyIGZyb20gdGhlIGJyb3dzZXIgc2Vzc2lvbiBhbmQgbG9nIHRoZW0gb3V0IC0gcmVtb3ZpbmcgYWxsIGl0ZW1zIGZyb20gbG9jYWxzdG9yYWdlIGFuZCB0aGVuIHRyaWdnZXIgYSBgXCJTSUdORURfT1VUXCJgIGV2ZW50LlxuICAgICAqXG4gICAgICogRm9yIHNlcnZlci1zaWRlIG1hbmFnZW1lbnQsIHlvdSBjYW4gcmV2b2tlIGFsbCByZWZyZXNoIHRva2VucyBmb3IgYSB1c2VyIGJ5IHBhc3NpbmcgYSB1c2VyJ3MgSldUIHRocm91Z2ggdG8gYGF1dGguYXBpLnNpZ25PdXQoSldUOiBzdHJpbmcpYC5cbiAgICAgKiBUaGVyZSBpcyBubyB3YXkgdG8gcmV2b2tlIGEgdXNlcidzIGFjY2VzcyB0b2tlbiBqd3QgdW50aWwgaXQgZXhwaXJlcy4gSXQgaXMgcmVjb21tZW5kZWQgdG8gc2V0IGEgc2hvcnRlciBleHBpcnkgb24gdGhlIGp3dCBmb3IgdGhpcyByZWFzb24uXG4gICAgICpcbiAgICAgKiBJZiB1c2luZyBgb3RoZXJzYCBzY29wZSwgbm8gYFNJR05FRF9PVVRgIGV2ZW50IGlzIGZpcmVkIVxuICAgICAqL1xuICAgIGFzeW5jIHNpZ25PdXQob3B0aW9ucyA9IHsgc2NvcGU6ICdnbG9iYWwnIH0pIHtcbiAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplUHJvbWlzZTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2FjcXVpcmVMb2NrKC0xLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fc2lnbk91dChvcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIF9zaWduT3V0KHsgc2NvcGUgfSA9IHsgc2NvcGU6ICdnbG9iYWwnIH0pIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3VzZVNlc3Npb24oYXN5bmMgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvcjogc2Vzc2lvbkVycm9yIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoc2Vzc2lvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IHNlc3Npb25FcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSAoX2EgPSBkYXRhLnNlc3Npb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY2Nlc3NfdG9rZW47XG4gICAgICAgICAgICBpZiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCB0aGlzLmFkbWluLnNpZ25PdXQoYWNjZXNzVG9rZW4sIHNjb3BlKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIDQwNHMgc2luY2UgdXNlciBtaWdodCBub3QgZXhpc3QgYW55bW9yZVxuICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgNDAxcyBzaW5jZSBhbiBpbnZhbGlkIG9yIGV4cGlyZWQgSldUIHNob3VsZCBzaWduIG91dCB0aGUgY3VycmVudCBzZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGlzQXV0aEFwaUVycm9yKGVycm9yKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yLnN0YXR1cyA9PT0gNDA0IHx8IGVycm9yLnN0YXR1cyA9PT0gNDAxIHx8IGVycm9yLnN0YXR1cyA9PT0gNDAzKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGVycm9yIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2NvcGUgIT09ICdvdGhlcnMnKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVtb3ZlU2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHJlbW92ZUl0ZW1Bc3luYyh0aGlzLnN0b3JhZ2UsIGAke3RoaXMuc3RvcmFnZUtleX0tY29kZS12ZXJpZmllcmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlY2VpdmUgYSBub3RpZmljYXRpb24gZXZlcnkgdGltZSBhbiBhdXRoIGV2ZW50IGhhcHBlbnMuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIEEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIGFuIGF1dGggZXZlbnQgaGFwcGVucy5cbiAgICAgKi9cbiAgICBvbkF1dGhTdGF0ZUNoYW5nZShjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWcoJyN1bnN1YnNjcmliZSgpJywgJ3N0YXRlIGNoYW5nZSBjYWxsYmFjayB3aXRoIGlkIHJlbW92ZWQnLCBpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZUVtaXR0ZXJzLmRlbGV0ZShpZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9kZWJ1ZygnI29uQXV0aFN0YXRlQ2hhbmdlKCknLCAncmVnaXN0ZXJlZCBjYWxsYmFjayB3aXRoIGlkJywgaWQpO1xuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlRW1pdHRlcnMuc2V0KGlkLCBzdWJzY3JpcHRpb24pO1xuICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplUHJvbWlzZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2FjcXVpcmVMb2NrKC0xLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW1pdEluaXRpYWxTZXNzaW9uKGlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4geyBkYXRhOiB7IHN1YnNjcmlwdGlvbiB9IH07XG4gICAgfVxuICAgIGFzeW5jIF9lbWl0SW5pdGlhbFNlc3Npb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3VzZVNlc3Npb24oYXN5bmMgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhOiB7IHNlc3Npb24gfSwgZXJyb3IsIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICBhd2FpdCAoKF9hID0gdGhpcy5zdGF0ZUNoYW5nZUVtaXR0ZXJzLmdldChpZCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsYmFjaygnSU5JVElBTF9TRVNTSU9OJywgc2Vzc2lvbikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnKCdJTklUSUFMX1NFU1NJT04nLCAnY2FsbGJhY2sgaWQnLCBpZCwgJ3Nlc3Npb24nLCBzZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCAoKF9iID0gdGhpcy5zdGF0ZUNoYW5nZUVtaXR0ZXJzLmdldChpZCkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsYmFjaygnSU5JVElBTF9TRVNTSU9OJywgbnVsbCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnKCdJTklUSUFMX1NFU1NJT04nLCAnY2FsbGJhY2sgaWQnLCBpZCwgJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIHBhc3N3b3JkIHJlc2V0IHJlcXVlc3QgdG8gYW4gZW1haWwgYWRkcmVzcy4gVGhpcyBtZXRob2Qgc3VwcG9ydHMgdGhlIFBLQ0UgZmxvdy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbWFpbCBUaGUgZW1haWwgYWRkcmVzcyBvZiB0aGUgdXNlci5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5yZWRpcmVjdFRvIFRoZSBVUkwgdG8gc2VuZCB0aGUgdXNlciB0byBhZnRlciB0aGV5IGNsaWNrIHRoZSBwYXNzd29yZCByZXNldCBsaW5rLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmNhcHRjaGFUb2tlbiBWZXJpZmljYXRpb24gdG9rZW4gcmVjZWl2ZWQgd2hlbiB0aGUgdXNlciBjb21wbGV0ZXMgdGhlIGNhcHRjaGEgb24gdGhlIHNpdGUuXG4gICAgICovXG4gICAgYXN5bmMgcmVzZXRQYXNzd29yZEZvckVtYWlsKGVtYWlsLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgbGV0IGNvZGVDaGFsbGVuZ2UgPSBudWxsO1xuICAgICAgICBsZXQgY29kZUNoYWxsZW5nZU1ldGhvZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmZsb3dUeXBlID09PSAncGtjZScpIHtcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIFtjb2RlQ2hhbGxlbmdlLCBjb2RlQ2hhbGxlbmdlTWV0aG9kXSA9IGF3YWl0IGdldENvZGVDaGFsbGVuZ2VBbmRNZXRob2QodGhpcy5zdG9yYWdlLCB0aGlzLnN0b3JhZ2VLZXksIHRydWUgLy8gaXNQYXNzd29yZFJlY292ZXJ5XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ1BPU1QnLCBgJHt0aGlzLnVybH0vcmVjb3ZlcmAsIHtcbiAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICBjb2RlX2NoYWxsZW5nZTogY29kZUNoYWxsZW5nZSxcbiAgICAgICAgICAgICAgICAgICAgY29kZV9jaGFsbGVuZ2VfbWV0aG9kOiBjb2RlQ2hhbGxlbmdlTWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICBnb3RydWVfbWV0YV9zZWN1cml0eTogeyBjYXB0Y2hhX3Rva2VuOiBvcHRpb25zLmNhcHRjaGFUb2tlbiB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86IG9wdGlvbnMucmVkaXJlY3RUbyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCB0aGUgaWRlbnRpdGllcyBsaW5rZWQgdG8gYSB1c2VyLlxuICAgICAqL1xuICAgIGFzeW5jIGdldFVzZXJJZGVudGl0aWVzKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCB0aGlzLmdldFVzZXIoKTtcbiAgICAgICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgaWRlbnRpdGllczogKF9hID0gZGF0YS51c2VyLmlkZW50aXRpZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdIH0sIGVycm9yOiBudWxsIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExpbmtzIGFuIG9hdXRoIGlkZW50aXR5IHRvIGFuIGV4aXN0aW5nIHVzZXIuXG4gICAgICogVGhpcyBtZXRob2Qgc3VwcG9ydHMgdGhlIFBLQ0UgZmxvdy5cbiAgICAgKi9cbiAgICBhc3luYyBsaW5rSWRlbnRpdHkoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgdGhpcy5fdXNlU2Vzc2lvbihhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBhd2FpdCB0aGlzLl9nZXRVcmxGb3JQcm92aWRlcihgJHt0aGlzLnVybH0vdXNlci9pZGVudGl0aWVzL2F1dGhvcml6ZWAsIGNyZWRlbnRpYWxzLnByb3ZpZGVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86IChfYSA9IGNyZWRlbnRpYWxzLm9wdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZWRpcmVjdFRvLFxuICAgICAgICAgICAgICAgICAgICBzY29wZXM6IChfYiA9IGNyZWRlbnRpYWxzLm9wdGlvbnMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5zY29wZXMsXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiAoX2MgPSBjcmVkZW50aWFscy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MucXVlcnlQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIHNraXBCcm93c2VyUmVkaXJlY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdHRVQnLCB1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBqd3Q6IChfZSA9IChfZCA9IGRhdGEuc2Vzc2lvbikgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmFjY2Vzc190b2tlbikgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZXJyb3IpXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICBpZiAoaXNCcm93c2VyKCkgJiYgISgoX2EgPSBjcmVkZW50aWFscy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2tpcEJyb3dzZXJSZWRpcmVjdCkpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGF0YS51cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyBwcm92aWRlcjogY3JlZGVudGlhbHMucHJvdmlkZXIsIHVybDogZGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkYXRhLnVybCB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgcHJvdmlkZXI6IGNyZWRlbnRpYWxzLnByb3ZpZGVyLCB1cmw6IG51bGwgfSwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVubGlua3MgYW4gaWRlbnRpdHkgZnJvbSBhIHVzZXIgYnkgZGVsZXRpbmcgaXQuIFRoZSB1c2VyIHdpbGwgbm8gbG9uZ2VyIGJlIGFibGUgdG8gc2lnbiBpbiB3aXRoIHRoYXQgaWRlbnRpdHkgb25jZSBpdCdzIHVubGlua2VkLlxuICAgICAqL1xuICAgIGFzeW5jIHVubGlua0lkZW50aXR5KGlkZW50aXR5KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdXNlU2Vzc2lvbihhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ0RFTEVURScsIGAke3RoaXMudXJsfS91c2VyL2lkZW50aXRpZXMvJHtpZGVudGl0eS5pZGVudGl0eV9pZH1gLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgand0OiAoX2IgPSAoX2EgPSBkYXRhLnNlc3Npb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY2Nlc3NfdG9rZW4pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBuZXcgSldULlxuICAgICAqIEBwYXJhbSByZWZyZXNoVG9rZW4gQSB2YWxpZCByZWZyZXNoIHRva2VuIHRoYXQgd2FzIHJldHVybmVkIG9uIGxvZ2luLlxuICAgICAqL1xuICAgIGFzeW5jIF9yZWZyZXNoQWNjZXNzVG9rZW4ocmVmcmVzaFRva2VuKSB7XG4gICAgICAgIGNvbnN0IGRlYnVnTmFtZSA9IGAjX3JlZnJlc2hBY2Nlc3NUb2tlbigke3JlZnJlc2hUb2tlbi5zdWJzdHJpbmcoMCwgNSl9Li4uKWA7XG4gICAgICAgIHRoaXMuX2RlYnVnKGRlYnVnTmFtZSwgJ2JlZ2luJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydGVkQXQgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgLy8gd2lsbCBhdHRlbXB0IHRvIHJlZnJlc2ggdGhlIHRva2VuIHdpdGggZXhwb25lbnRpYWwgYmFja29mZlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHJldHJ5YWJsZShhc3luYyAoYXR0ZW1wdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhdHRlbXB0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBzbGVlcCgyMDAgKiBNYXRoLnBvdygyLCBhdHRlbXB0IC0gMSkpOyAvLyAyMDAsIDQwMCwgODAwLCAuLi5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWcoZGVidWdOYW1lLCAncmVmcmVzaGluZyBhdHRlbXB0JywgYXR0ZW1wdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L3Rva2VuP2dyYW50X3R5cGU9cmVmcmVzaF90b2tlbmAsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keTogeyByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4gfSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICB4Zm9ybTogX3Nlc3Npb25SZXNwb25zZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIChhdHRlbXB0LCBlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRCYWNrT2ZmSW50ZXJ2YWwgPSAyMDAgKiBNYXRoLnBvdygyLCBhdHRlbXB0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGVycm9yICYmXG4gICAgICAgICAgICAgICAgICAgIGlzQXV0aFJldHJ5YWJsZUZldGNoRXJyb3IoZXJyb3IpICYmXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHJ5YWJsZSBvbmx5IGlmIHRoZSByZXF1ZXN0IGNhbiBiZSBzZW50IGJlZm9yZSB0aGUgYmFja29mZiBvdmVyZmxvd3MgdGhlIHRpY2sgZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgRGF0ZS5ub3coKSArIG5leHRCYWNrT2ZmSW50ZXJ2YWwgLSBzdGFydGVkQXQgPCBBVVRPX1JFRlJFU0hfVElDS19EVVJBVElPTl9NUyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnKGRlYnVnTmFtZSwgJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHsgc2Vzc2lvbjogbnVsbCwgdXNlcjogbnVsbCB9LCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdlbmQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfaXNWYWxpZFNlc3Npb24obWF5YmVTZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IGlzVmFsaWRTZXNzaW9uID0gdHlwZW9mIG1heWJlU2Vzc2lvbiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgIG1heWJlU2Vzc2lvbiAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgJ2FjY2Vzc190b2tlbicgaW4gbWF5YmVTZXNzaW9uICYmXG4gICAgICAgICAgICAncmVmcmVzaF90b2tlbicgaW4gbWF5YmVTZXNzaW9uICYmXG4gICAgICAgICAgICAnZXhwaXJlc19hdCcgaW4gbWF5YmVTZXNzaW9uO1xuICAgICAgICByZXR1cm4gaXNWYWxpZFNlc3Npb247XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVQcm92aWRlclNpZ25Jbihwcm92aWRlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCB1cmwgPSBhd2FpdCB0aGlzLl9nZXRVcmxGb3JQcm92aWRlcihgJHt0aGlzLnVybH0vYXV0aG9yaXplYCwgcHJvdmlkZXIsIHtcbiAgICAgICAgICAgIHJlZGlyZWN0VG86IG9wdGlvbnMucmVkaXJlY3RUbyxcbiAgICAgICAgICAgIHNjb3Blczogb3B0aW9ucy5zY29wZXMsXG4gICAgICAgICAgICBxdWVyeVBhcmFtczogb3B0aW9ucy5xdWVyeVBhcmFtcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2RlYnVnKCcjX2hhbmRsZVByb3ZpZGVyU2lnbkluKCknLCAncHJvdmlkZXInLCBwcm92aWRlciwgJ29wdGlvbnMnLCBvcHRpb25zLCAndXJsJywgdXJsKTtcbiAgICAgICAgLy8gdHJ5IHRvIG9wZW4gb24gdGhlIGJyb3dzZXJcbiAgICAgICAgaWYgKGlzQnJvd3NlcigpICYmICFvcHRpb25zLnNraXBCcm93c2VyUmVkaXJlY3QpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBkYXRhOiB7IHByb3ZpZGVyLCB1cmwgfSwgZXJyb3I6IG51bGwgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVjb3ZlcnMgdGhlIHNlc3Npb24gZnJvbSBMb2NhbFN0b3JhZ2UgYW5kIHJlZnJlc2hlcyB0aGUgdG9rZW5cbiAgICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBpcyBhc3luYyB0byBhY2NvbW1vZGF0ZSBmb3IgQXN5bmNTdG9yYWdlIGUuZy4gaW4gUmVhY3QgbmF0aXZlLlxuICAgICAqL1xuICAgIGFzeW5jIF9yZWNvdmVyQW5kUmVmcmVzaCgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBkZWJ1Z05hbWUgPSAnI19yZWNvdmVyQW5kUmVmcmVzaCgpJztcbiAgICAgICAgdGhpcy5fZGVidWcoZGVidWdOYW1lLCAnYmVnaW4nKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZXNzaW9uID0gYXdhaXQgZ2V0SXRlbUFzeW5jKHRoaXMuc3RvcmFnZSwgdGhpcy5zdG9yYWdlS2V5KTtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnKGRlYnVnTmFtZSwgJ3Nlc3Npb24gZnJvbSBzdG9yYWdlJywgY3VycmVudFNlc3Npb24pO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1ZhbGlkU2Vzc2lvbihjdXJyZW50U2Vzc2lvbikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdzZXNzaW9uIGlzIG5vdCB2YWxpZCcpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2Vzc2lvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9yZW1vdmVTZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNXaXRoTWFyZ2luID0gKChfYSA9IGN1cnJlbnRTZXNzaW9uLmV4cGlyZXNfYXQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IEluZmluaXR5KSAqIDEwMDAgLSBEYXRlLm5vdygpIDwgRVhQSVJZX01BUkdJTl9NUztcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnKGRlYnVnTmFtZSwgYHNlc3Npb24gaGFzJHtleHBpcmVzV2l0aE1hcmdpbiA/ICcnIDogJyBub3QnfSBleHBpcmVkIHdpdGggbWFyZ2luIG9mICR7RVhQSVJZX01BUkdJTl9NU31zYCk7XG4gICAgICAgICAgICBpZiAoZXhwaXJlc1dpdGhNYXJnaW4pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvUmVmcmVzaFRva2VuICYmIGN1cnJlbnRTZXNzaW9uLnJlZnJlc2hfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgdGhpcy5fY2FsbFJlZnJlc2hUb2tlbihjdXJyZW50U2Vzc2lvbi5yZWZyZXNoX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBdXRoUmV0cnlhYmxlRmV0Y2hFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdyZWZyZXNoIGZhaWxlZCB3aXRoIGEgbm9uLXJldHJ5YWJsZSBlcnJvciwgcmVtb3ZpbmcgdGhlIHNlc3Npb24nLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVtb3ZlU2Vzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbm8gbmVlZCB0byBwZXJzaXN0IGN1cnJlbnRTZXNzaW9uIGFnYWluLCBhcyB3ZSBqdXN0IGxvYWRlZCBpdCBmcm9tXG4gICAgICAgICAgICAgICAgLy8gbG9jYWwgc3RvcmFnZTsgcGVyc2lzdGluZyBpdCBhZ2FpbiBtYXkgb3ZlcndyaXRlIGEgdmFsdWUgc2F2ZWQgYnlcbiAgICAgICAgICAgICAgICAvLyBhbm90aGVyIGNsaWVudCB3aXRoIGFjY2VzcyB0byB0aGUgc2FtZSBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5QWxsU3Vic2NyaWJlcnMoJ1NJR05FRF9JTicsIGN1cnJlbnRTZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdlcnJvcicsIGVycik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdlbmQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBfY2FsbFJlZnJlc2hUb2tlbihyZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgaWYgKCFyZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBBdXRoU2Vzc2lvbk1pc3NpbmdFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlZnJlc2hpbmcgaXMgYWxyZWFkeSBpbiBwcm9ncmVzc1xuICAgICAgICBpZiAodGhpcy5yZWZyZXNoaW5nRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hpbmdEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlYnVnTmFtZSA9IGAjX2NhbGxSZWZyZXNoVG9rZW4oJHtyZWZyZXNoVG9rZW4uc3Vic3RyaW5nKDAsIDUpfS4uLilgO1xuICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdiZWdpbicpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoaW5nRGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHRoaXMuX3JlZnJlc2hBY2Nlc3NUb2tlbihyZWZyZXNoVG9rZW4pO1xuICAgICAgICAgICAgaWYgKGVycm9yKVxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgaWYgKCFkYXRhLnNlc3Npb24pXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEF1dGhTZXNzaW9uTWlzc2luZ0Vycm9yKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zYXZlU2Vzc2lvbihkYXRhLnNlc3Npb24pO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5QWxsU3Vic2NyaWJlcnMoJ1RPS0VOX1JFRlJFU0hFRCcsIGRhdGEuc2Vzc2lvbik7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHNlc3Npb246IGRhdGEuc2Vzc2lvbiwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaGluZ0RlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHNlc3Npb246IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgaWYgKCFpc0F1dGhSZXRyeWFibGVGZXRjaEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9yZW1vdmVTZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIChfYSA9IHRoaXMucmVmcmVzaGluZ0RlZmVycmVkKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoX2IgPSB0aGlzLnJlZnJlc2hpbmdEZWZlcnJlZCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaGluZ0RlZmVycmVkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnKGRlYnVnTmFtZSwgJ2VuZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIF9ub3RpZnlBbGxTdWJzY3JpYmVycyhldmVudCwgc2Vzc2lvbiwgYnJvYWRjYXN0ID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBkZWJ1Z05hbWUgPSBgI19ub3RpZnlBbGxTdWJzY3JpYmVycygke2V2ZW50fSlgO1xuICAgICAgICB0aGlzLl9kZWJ1ZyhkZWJ1Z05hbWUsICdiZWdpbicsIHNlc3Npb24sIGBicm9hZGNhc3QgPSAke2Jyb2FkY2FzdH1gKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJyb2FkY2FzdENoYW5uZWwgJiYgYnJvYWRjYXN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsLnBvc3RNZXNzYWdlKHsgZXZlbnQsIHNlc3Npb24gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0gQXJyYXkuZnJvbSh0aGlzLnN0YXRlQ2hhbmdlRW1pdHRlcnMudmFsdWVzKCkpLm1hcChhc3luYyAoeCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHguY2FsbGJhY2soZXZlbnQsIHNlc3Npb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICAgICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5fZGVidWcoZGVidWdOYW1lLCAnZW5kJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0IGN1cnJlbnRTZXNzaW9uIGFuZCBjdXJyZW50VXNlclxuICAgICAqIHByb2Nlc3MgdG8gX3N0YXJ0QXV0b1JlZnJlc2hUb2tlbiBpZiBwb3NzaWJsZVxuICAgICAqL1xuICAgIGFzeW5jIF9zYXZlU2Vzc2lvbihzZXNzaW9uKSB7XG4gICAgICAgIHRoaXMuX2RlYnVnKCcjX3NhdmVTZXNzaW9uKCknLCBzZXNzaW9uKTtcbiAgICAgICAgLy8gX3NhdmVTZXNzaW9uIGlzIGFsd2F5cyBjYWxsZWQgd2hlbmV2ZXIgYSBuZXcgc2Vzc2lvbiBoYXMgYmVlbiBhY3F1aXJlZFxuICAgICAgICAvLyBzbyB3ZSBjYW4gc2FmZWx5IHN1cHByZXNzIHRoZSB3YXJuaW5nIHJldHVybmVkIGJ5IGZ1dHVyZSBnZXRTZXNzaW9uIGNhbGxzXG4gICAgICAgIHRoaXMuc3VwcHJlc3NHZXRTZXNzaW9uV2FybmluZyA9IHRydWU7XG4gICAgICAgIGF3YWl0IHNldEl0ZW1Bc3luYyh0aGlzLnN0b3JhZ2UsIHRoaXMuc3RvcmFnZUtleSwgc2Vzc2lvbik7XG4gICAgfVxuICAgIGFzeW5jIF9yZW1vdmVTZXNzaW9uKCkge1xuICAgICAgICB0aGlzLl9kZWJ1ZygnI19yZW1vdmVTZXNzaW9uKCknKTtcbiAgICAgICAgYXdhaXQgcmVtb3ZlSXRlbUFzeW5jKHRoaXMuc3RvcmFnZSwgdGhpcy5zdG9yYWdlS2V5KTtcbiAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5QWxsU3Vic2NyaWJlcnMoJ1NJR05FRF9PVVQnLCBudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbnkgcmVnaXN0ZXJlZCB2aXNpYmlsaXR5Y2hhbmdlIGNhbGxiYWNrLlxuICAgICAqXG4gICAgICoge0BzZWUgI3N0YXJ0QXV0b1JlZnJlc2h9XG4gICAgICoge0BzZWUgI3N0b3BBdXRvUmVmcmVzaH1cbiAgICAgKi9cbiAgICBfcmVtb3ZlVmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5fZGVidWcoJyNfcmVtb3ZlVmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaygpJyk7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrO1xuICAgICAgICB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICYmIGlzQnJvd3NlcigpICYmICh3aW5kb3cgPT09IG51bGwgfHwgd2luZG93ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcikpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVtb3ZpbmcgdmlzaWJpbGl0eWNoYW5nZSBjYWxsYmFjayBmYWlsZWQnLCBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIHRoZSBwcml2YXRlIGltcGxlbWVudGF0aW9uIG9mIHtAbGluayAjc3RhcnRBdXRvUmVmcmVzaH0uIFVzZSB0aGlzXG4gICAgICogd2l0aGluIHRoZSBsaWJyYXJ5LlxuICAgICAqL1xuICAgIGFzeW5jIF9zdGFydEF1dG9SZWZyZXNoKCkge1xuICAgICAgICBhd2FpdCB0aGlzLl9zdG9wQXV0b1JlZnJlc2goKTtcbiAgICAgICAgdGhpcy5fZGVidWcoJyNfc3RhcnRBdXRvUmVmcmVzaCgpJyk7XG4gICAgICAgIGNvbnN0IHRpY2tlciA9IHNldEludGVydmFsKCgpID0+IHRoaXMuX2F1dG9SZWZyZXNoVG9rZW5UaWNrKCksIEFVVE9fUkVGUkVTSF9USUNLX0RVUkFUSU9OX01TKTtcbiAgICAgICAgdGhpcy5hdXRvUmVmcmVzaFRpY2tlciA9IHRpY2tlcjtcbiAgICAgICAgaWYgKHRpY2tlciAmJiB0eXBlb2YgdGlja2VyID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdGlja2VyLnVucmVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyB0aWNrZXIgaXMgYSBOb2RlSlMgVGltZW91dCBvYmplY3QgdGhhdCBoYXMgYW4gYHVucmVmYCBtZXRob2RcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvdGltZXJzLmh0bWwjdGltZW91dHVucmVmXG4gICAgICAgICAgICAvLyBXaGVuIGF1dG8gcmVmcmVzaCBpcyB1c2VkIGluIE5vZGVKUyAobGlrZSBmb3IgdGVzdGluZykgdGhlXG4gICAgICAgICAgICAvLyBgc2V0SW50ZXJ2YWxgIGlzIHByZXZlbnRpbmcgdGhlIHByb2Nlc3MgZnJvbSBiZWluZyBtYXJrZWQgYXNcbiAgICAgICAgICAgIC8vIGZpbmlzaGVkIGFuZCB0ZXN0cyBydW4gZW5kbGVzc2x5LiBUaGlzIGNhbiBiZSBwcmV2ZW50ZWQgYnkgY2FsbGluZ1xuICAgICAgICAgICAgLy8gYHVucmVmKClgIG9uIHRoZSByZXR1cm5lZCBvYmplY3QuXG4gICAgICAgICAgICB0aWNrZXIudW5yZWYoKTtcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgaGFzIG5vIGNvbnRleHQgb2YgRGVub1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBEZW5vICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgRGVuby51bnJlZlRpbWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBzaW1pbGFyIGxpa2UgZm9yIE5vZGVKUywgYnV0IHdpdGggdGhlIERlbm8gQVBJXG4gICAgICAgICAgICAvLyBodHRwczovL2Rlbm8ubGFuZC9hcGlAbGF0ZXN0P3Vuc3RhYmxlJnM9RGVuby51bnJlZlRpbWVyXG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGhhcyBubyBjb250ZXh0IG9mIERlbm9cbiAgICAgICAgICAgIERlbm8udW5yZWZUaW1lcih0aWNrZXIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJ1biB0aGUgdGljayBpbW1lZGlhdGVseSwgYnV0IGluIHRoZSBuZXh0IHBhc3Mgb2YgdGhlIGV2ZW50IGxvb3Agc28gdGhhdFxuICAgICAgICAvLyAjX2luaXRpYWxpemUgY2FuIGJlIGFsbG93ZWQgdG8gY29tcGxldGUgd2l0aG91dCByZWN1cnNpdmVseSB3YWl0aW5nIG9uXG4gICAgICAgIC8vIGl0c2VsZlxuICAgICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVByb21pc2U7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9hdXRvUmVmcmVzaFRva2VuVGljaygpO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhpcyBpcyB0aGUgcHJpdmF0ZSBpbXBsZW1lbnRhdGlvbiBvZiB7QGxpbmsgI3N0b3BBdXRvUmVmcmVzaH0uIFVzZSB0aGlzXG4gICAgICogd2l0aGluIHRoZSBsaWJyYXJ5LlxuICAgICAqL1xuICAgIGFzeW5jIF9zdG9wQXV0b1JlZnJlc2goKSB7XG4gICAgICAgIHRoaXMuX2RlYnVnKCcjX3N0b3BBdXRvUmVmcmVzaCgpJyk7XG4gICAgICAgIGNvbnN0IHRpY2tlciA9IHRoaXMuYXV0b1JlZnJlc2hUaWNrZXI7XG4gICAgICAgIHRoaXMuYXV0b1JlZnJlc2hUaWNrZXIgPSBudWxsO1xuICAgICAgICBpZiAodGlja2VyKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpY2tlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhcnRzIGFuIGF1dG8tcmVmcmVzaCBwcm9jZXNzIGluIHRoZSBiYWNrZ3JvdW5kLiBUaGUgc2Vzc2lvbiBpcyBjaGVja2VkXG4gICAgICogZXZlcnkgZmV3IHNlY29uZHMuIENsb3NlIHRvIHRoZSB0aW1lIG9mIGV4cGlyYXRpb24gYSBwcm9jZXNzIGlzIHN0YXJ0ZWQgdG9cbiAgICAgKiByZWZyZXNoIHRoZSBzZXNzaW9uLiBJZiByZWZyZXNoaW5nIGZhaWxzIGl0IHdpbGwgYmUgcmV0cmllZCBmb3IgYXMgbG9uZyBhc1xuICAgICAqIG5lY2Vzc2FyeS5cbiAgICAgKlxuICAgICAqIElmIHlvdSBzZXQgdGhlIHtAbGluayBHb1RydWVDbGllbnRPcHRpb25zI2F1dG9SZWZyZXNoVG9rZW59IHlvdSBkb24ndCBuZWVkXG4gICAgICogdG8gY2FsbCB0aGlzIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCBmb3IgeW91LlxuICAgICAqXG4gICAgICogT24gYnJvd3NlcnMgdGhlIHJlZnJlc2ggcHJvY2VzcyB3b3JrcyBvbmx5IHdoZW4gdGhlIHRhYi93aW5kb3cgaXMgaW4gdGhlXG4gICAgICogZm9yZWdyb3VuZCB0byBjb25zZXJ2ZSByZXNvdXJjZXMgYXMgd2VsbCBhcyBwcmV2ZW50IHJhY2UgY29uZGl0aW9ucyBhbmRcbiAgICAgKiBmbG9vZGluZyBhdXRoIHdpdGggcmVxdWVzdHMuIElmIHlvdSBjYWxsIHRoaXMgbWV0aG9kIGFueSBtYW5hZ2VkXG4gICAgICogdmlzaWJpbGl0eSBjaGFuZ2UgY2FsbGJhY2sgd2lsbCBiZSByZW1vdmVkIGFuZCB5b3UgbXVzdCBtYW5hZ2UgdmlzaWJpbGl0eVxuICAgICAqIGNoYW5nZXMgb24geW91ciBvd24uXG4gICAgICpcbiAgICAgKiBPbiBub24tYnJvd3NlciBwbGF0Zm9ybXMgdGhlIHJlZnJlc2ggcHJvY2VzcyB3b3JrcyAqY29udGludW91c2x5KiBpbiB0aGVcbiAgICAgKiBiYWNrZ3JvdW5kLCB3aGljaCBtYXkgbm90IGJlIGRlc2lyYWJsZS4gWW91IHNob3VsZCBob29rIGludG8geW91clxuICAgICAqIHBsYXRmb3JtJ3MgZm9yZWdyb3VuZCBpbmRpY2F0aW9uIG1lY2hhbmlzbSBhbmQgY2FsbCB0aGVzZSBtZXRob2RzXG4gICAgICogYXBwcm9wcmlhdGVseSB0byBjb25zZXJ2ZSByZXNvdXJjZXMuXG4gICAgICpcbiAgICAgKiB7QHNlZSAjc3RvcEF1dG9SZWZyZXNofVxuICAgICAqL1xuICAgIGFzeW5jIHN0YXJ0QXV0b1JlZnJlc2goKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZVZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2soKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fc3RhcnRBdXRvUmVmcmVzaCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdG9wcyBhbiBhY3RpdmUgYXV0byByZWZyZXNoIHByb2Nlc3MgcnVubmluZyBpbiB0aGUgYmFja2dyb3VuZCAoaWYgYW55KS5cbiAgICAgKlxuICAgICAqIElmIHlvdSBjYWxsIHRoaXMgbWV0aG9kIGFueSBtYW5hZ2VkIHZpc2liaWxpdHkgY2hhbmdlIGNhbGxiYWNrIHdpbGwgYmVcbiAgICAgKiByZW1vdmVkIGFuZCB5b3UgbXVzdCBtYW5hZ2UgdmlzaWJpbGl0eSBjaGFuZ2VzIG9uIHlvdXIgb3duLlxuICAgICAqXG4gICAgICogU2VlIHtAbGluayAjc3RhcnRBdXRvUmVmcmVzaH0gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgKi9cbiAgICBhc3luYyBzdG9wQXV0b1JlZnJlc2goKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZVZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2soKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fc3RvcEF1dG9SZWZyZXNoKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJ1bnMgdGhlIGF1dG8gcmVmcmVzaCB0b2tlbiB0aWNrLlxuICAgICAqL1xuICAgIGFzeW5jIF9hdXRvUmVmcmVzaFRva2VuVGljaygpIHtcbiAgICAgICAgdGhpcy5fZGVidWcoJyNfYXV0b1JlZnJlc2hUb2tlblRpY2soKScsICdiZWdpbicpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fYWNxdWlyZUxvY2soMCwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdXNlU2Vzc2lvbihhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhOiB7IHNlc3Npb24gfSwgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlc3Npb24gfHwgIXNlc3Npb24ucmVmcmVzaF90b2tlbiB8fCAhc2Vzc2lvbi5leHBpcmVzX2F0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnKCcjX2F1dG9SZWZyZXNoVG9rZW5UaWNrKCknLCAnbm8gc2Vzc2lvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlc3Npb24gd2lsbCBleHBpcmUgaW4gdGhpcyBtYW55IHRpY2tzIChvciBoYXMgYWxyZWFkeSBleHBpcmVkIGlmIDw9IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwaXJlc0luVGlja3MgPSBNYXRoLmZsb29yKChzZXNzaW9uLmV4cGlyZXNfYXQgKiAxMDAwIC0gbm93KSAvIEFVVE9fUkVGUkVTSF9USUNLX0RVUkFUSU9OX01TKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1ZygnI19hdXRvUmVmcmVzaFRva2VuVGljaygpJywgYGFjY2VzcyB0b2tlbiBleHBpcmVzIGluICR7ZXhwaXJlc0luVGlja3N9IHRpY2tzLCBhIHRpY2sgbGFzdHMgJHtBVVRPX1JFRlJFU0hfVElDS19EVVJBVElPTl9NU31tcywgcmVmcmVzaCB0aHJlc2hvbGQgaXMgJHtBVVRPX1JFRlJFU0hfVElDS19USFJFU0hPTER9IHRpY2tzYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGlyZXNJblRpY2tzIDw9IEFVVE9fUkVGUkVTSF9USUNLX1RIUkVTSE9MRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9jYWxsUmVmcmVzaFRva2VuKHNlc3Npb24ucmVmcmVzaF90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1dG8gcmVmcmVzaCB0aWNrIGZhaWxlZCB3aXRoIGVycm9yLiBUaGlzIGlzIGxpa2VseSBhIHRyYW5zaWVudCBlcnJvci4nLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVidWcoJyNfYXV0b1JlZnJlc2hUb2tlblRpY2soKScsICdlbmQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUuaXNBY3F1aXJlVGltZW91dCB8fCBlIGluc3RhbmNlb2YgTG9ja0FjcXVpcmVUaW1lb3V0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1ZygnYXV0byByZWZyZXNoIHRva2VuIHRpY2sgbG9jayBub3QgYXZhaWxhYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBjYWxsYmFja3Mgb24gdGhlIGJyb3dzZXIgLyBwbGF0Zm9ybSwgd2hpY2ggaW4tdHVybiBydW5cbiAgICAgKiBhbGdvcml0aG1zIHdoZW4gdGhlIGJyb3dzZXIgd2luZG93L3RhYiBhcmUgaW4gZm9yZWdyb3VuZC4gT24gbm9uLWJyb3dzZXJcbiAgICAgKiBwbGF0Zm9ybXMgaXQgYXNzdW1lcyBhbHdheXMgZm9yZWdyb3VuZC5cbiAgICAgKi9cbiAgICBhc3luYyBfaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5fZGVidWcoJyNfaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpJyk7XG4gICAgICAgIGlmICghaXNCcm93c2VyKCkgfHwgISh3aW5kb3cgPT09IG51bGwgfHwgd2luZG93ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9SZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBpbiBub24tYnJvd3NlciBlbnZpcm9ubWVudHMgdGhlIHJlZnJlc2ggdG9rZW4gdGlja2VyIHJ1bnMgYWx3YXlzXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9SZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayA9IGFzeW5jICgpID0+IGF3YWl0IHRoaXMuX29uVmlzaWJpbGl0eUNoYW5nZWQoZmFsc2UpO1xuICAgICAgICAgICAgd2luZG93ID09PSBudWxsIHx8IHdpbmRvdyA9PT0gdm9pZCAwID8gdm9pZCAwIDogd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spO1xuICAgICAgICAgICAgLy8gbm93IGltbWVkaWF0ZWx5IGNhbGwgdGhlIHZpc2JpbGl0eSBjaGFuZ2VkIGNhbGxiYWNrIHRvIHNldHVwIHdpdGggdGhlXG4gICAgICAgICAgICAvLyBjdXJyZW50IHZpc2JpbGl0eSBzdGF0ZVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fb25WaXNpYmlsaXR5Q2hhbmdlZCh0cnVlKTsgLy8gaW5pdGlhbCBjYWxsXG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdfaGFuZGxlVmlzaWJpbGl0eUNoYW5nZScsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayByZWdpc3RlcmVkIHdpdGggYHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJylgLlxuICAgICAqL1xuICAgIGFzeW5jIF9vblZpc2liaWxpdHlDaGFuZ2VkKGNhbGxlZEZyb21Jbml0aWFsaXplKSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBgI19vblZpc2liaWxpdHlDaGFuZ2VkKCR7Y2FsbGVkRnJvbUluaXRpYWxpemV9KWA7XG4gICAgICAgIHRoaXMuX2RlYnVnKG1ldGhvZE5hbWUsICd2aXNpYmlsaXR5U3RhdGUnLCBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUpO1xuICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9SZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBpbiBicm93c2VyIGVudmlyb25tZW50cyB0aGUgcmVmcmVzaCB0b2tlbiB0aWNrZXIgcnVucyBvbmx5IG9uIGZvY3VzZWQgdGFic1xuICAgICAgICAgICAgICAgIC8vIHdoaWNoIHByZXZlbnRzIHJhY2UgY29uZGl0aW9uc1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1JlZnJlc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY2FsbGVkRnJvbUluaXRpYWxpemUpIHtcbiAgICAgICAgICAgICAgICAvLyBjYWxsZWQgd2hlbiB0aGUgdmlzaWJpbGl0eSBoYXMgY2hhbmdlZCwgaS5lLiB0aGUgYnJvd3NlclxuICAgICAgICAgICAgICAgIC8vIHRyYW5zaXRpb25lZCBmcm9tIGhpZGRlbiAtPiB2aXNpYmxlIHNvIHdlIG5lZWQgdG8gc2VlIGlmIHRoZSBzZXNzaW9uXG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIGJlIHJlY292ZXJlZCBpbW1lZGlhdGVseS4uLiBidXQgdG8gZG8gdGhhdCB3ZSBuZWVkIHRvIGFjcXVpcmVcbiAgICAgICAgICAgICAgICAvLyB0aGUgbG9jayBmaXJzdCBhc3luY2hyb25vdXNseVxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVByb21pc2U7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSAhPT0gJ3Zpc2libGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1ZyhtZXRob2ROYW1lLCAnYWNxdWlyZWQgdGhlIGxvY2sgdG8gcmVjb3ZlciB0aGUgc2Vzc2lvbiwgYnV0IHRoZSBicm93c2VyIHZpc2liaWxpdHlTdGF0ZSBpcyBubyBsb25nZXIgdmlzaWJsZSwgYWJvcnRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZpc2liaWxpdHkgaGFzIGNoYW5nZWQgd2hpbGUgd2FpdGluZyBmb3IgdGhlIGxvY2ssIGFib3J0XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVjb3ZlciB0aGUgc2Vzc2lvblxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9yZWNvdmVyQW5kUmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9SZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdG9wQXV0b1JlZnJlc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgdGhlIHJlbGV2YW50IGxvZ2luIFVSTCBmb3IgYSB0aGlyZC1wYXJ0eSBwcm92aWRlci5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5yZWRpcmVjdFRvIEEgVVJMIG9yIG1vYmlsZSBhZGRyZXNzIHRvIHNlbmQgdGhlIHVzZXIgdG8gYWZ0ZXIgdGhleSBhcmUgY29uZmlybWVkLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLnNjb3BlcyBBIHNwYWNlLXNlcGFyYXRlZCBsaXN0IG9mIHNjb3BlcyBncmFudGVkIHRvIHRoZSBPQXV0aCBhcHBsaWNhdGlvbi5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5xdWVyeVBhcmFtcyBBbiBvYmplY3Qgb2Yga2V5LXZhbHVlIHBhaXJzIGNvbnRhaW5pbmcgcXVlcnkgcGFyYW1ldGVycyBncmFudGVkIHRvIHRoZSBPQXV0aCBhcHBsaWNhdGlvbi5cbiAgICAgKi9cbiAgICBhc3luYyBfZ2V0VXJsRm9yUHJvdmlkZXIodXJsLCBwcm92aWRlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBbYHByb3ZpZGVyPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHByb3ZpZGVyKX1gXTtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5yZWRpcmVjdFRvKSB7XG4gICAgICAgICAgICB1cmxQYXJhbXMucHVzaChgcmVkaXJlY3RfdG89JHtlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy5yZWRpcmVjdFRvKX1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnNjb3Blcykge1xuICAgICAgICAgICAgdXJsUGFyYW1zLnB1c2goYHNjb3Blcz0ke2VuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLnNjb3Blcyl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmxvd1R5cGUgPT09ICdwa2NlJykge1xuICAgICAgICAgICAgY29uc3QgW2NvZGVDaGFsbGVuZ2UsIGNvZGVDaGFsbGVuZ2VNZXRob2RdID0gYXdhaXQgZ2V0Q29kZUNoYWxsZW5nZUFuZE1ldGhvZCh0aGlzLnN0b3JhZ2UsIHRoaXMuc3RvcmFnZUtleSk7XG4gICAgICAgICAgICBjb25zdCBmbG93UGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7XG4gICAgICAgICAgICAgICAgY29kZV9jaGFsbGVuZ2U6IGAke2VuY29kZVVSSUNvbXBvbmVudChjb2RlQ2hhbGxlbmdlKX1gLFxuICAgICAgICAgICAgICAgIGNvZGVfY2hhbGxlbmdlX21ldGhvZDogYCR7ZW5jb2RlVVJJQ29tcG9uZW50KGNvZGVDaGFsbGVuZ2VNZXRob2QpfWAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVybFBhcmFtcy5wdXNoKGZsb3dQYXJhbXMudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5xdWVyeVBhcmFtcykge1xuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKG9wdGlvbnMucXVlcnlQYXJhbXMpO1xuICAgICAgICAgICAgdXJsUGFyYW1zLnB1c2gocXVlcnkudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5za2lwQnJvd3NlclJlZGlyZWN0KSB7XG4gICAgICAgICAgICB1cmxQYXJhbXMucHVzaChgc2tpcF9odHRwX3JlZGlyZWN0PSR7b3B0aW9ucy5za2lwQnJvd3NlclJlZGlyZWN0fWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHt1cmx9PyR7dXJsUGFyYW1zLmpvaW4oJyYnKX1gO1xuICAgIH1cbiAgICBhc3luYyBfdW5lbnJvbGwocGFyYW1zKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdXNlU2Vzc2lvbihhc3luYyAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YTogc2Vzc2lvbkRhdGEsIGVycm9yOiBzZXNzaW9uRXJyb3IgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAoc2Vzc2lvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yOiBzZXNzaW9uRXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdERUxFVEUnLCBgJHt0aGlzLnVybH0vZmFjdG9ycy8ke3BhcmFtcy5mYWN0b3JJZH1gLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgand0OiAoX2EgPSBzZXNzaW9uRGF0YSA9PT0gbnVsbCB8fCBzZXNzaW9uRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2Vzc2lvbkRhdGEuc2Vzc2lvbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGlzQXV0aEVycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBfZW5yb2xsKHBhcmFtcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3VzZVNlc3Npb24oYXN5bmMgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBkYXRhOiBzZXNzaW9uRGF0YSwgZXJyb3I6IHNlc3Npb25FcnJvciB9ID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChzZXNzaW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3I6IHNlc3Npb25FcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gT2JqZWN0LmFzc2lnbih7IGZyaWVuZGx5X25hbWU6IHBhcmFtcy5mcmllbmRseU5hbWUsIGZhY3Rvcl90eXBlOiBwYXJhbXMuZmFjdG9yVHlwZSB9LCAocGFyYW1zLmZhY3RvclR5cGUgPT09ICdwaG9uZScgPyB7IHBob25lOiBwYXJhbXMucGhvbmUgfSA6IHsgaXNzdWVyOiBwYXJhbXMuaXNzdWVyIH0pKTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUE9TVCcsIGAke3RoaXMudXJsfS9mYWN0b3JzYCwge1xuICAgICAgICAgICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGp3dDogKF9hID0gc2Vzc2lvbkRhdGEgPT09IG51bGwgfHwgc2Vzc2lvbkRhdGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlc3Npb25EYXRhLnNlc3Npb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuZmFjdG9yVHlwZSA9PT0gJ3RvdHAnICYmICgoX2IgPSBkYXRhID09PSBudWxsIHx8IGRhdGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRhdGEudG90cCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnFyX2NvZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEudG90cC5xcl9jb2RlID0gYGRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGYtOCwke2RhdGEudG90cC5xcl9jb2RlfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGEsIGVycm9yOiBudWxsIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICoge0BzZWUgR29UcnVlTUZBQXBpI3ZlcmlmeX1cbiAgICAgKi9cbiAgICBhc3luYyBfdmVyaWZ5KHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3VzZVNlc3Npb24oYXN5bmMgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YTogc2Vzc2lvbkRhdGEsIGVycm9yOiBzZXNzaW9uRXJyb3IgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlc3Npb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3I6IHNlc3Npb25FcnJvciB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IF9yZXF1ZXN0KHRoaXMuZmV0Y2gsICdQT1NUJywgYCR7dGhpcy51cmx9L2ZhY3RvcnMvJHtwYXJhbXMuZmFjdG9ySWR9L3ZlcmlmeWAsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHsgY29kZTogcGFyYW1zLmNvZGUsIGNoYWxsZW5nZV9pZDogcGFyYW1zLmNoYWxsZW5nZUlkIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBqd3Q6IChfYSA9IHNlc3Npb25EYXRhID09PSBudWxsIHx8IHNlc3Npb25EYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZXNzaW9uRGF0YS5zZXNzaW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NhdmVTZXNzaW9uKE9iamVjdC5hc3NpZ24oeyBleHBpcmVzX2F0OiBNYXRoLnJvdW5kKERhdGUubm93KCkgLyAxMDAwKSArIGRhdGEuZXhwaXJlc19pbiB9LCBkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX25vdGlmeUFsbFN1YnNjcmliZXJzKCdNRkFfQ0hBTExFTkdFX1ZFUklGSUVEJywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGEsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICoge0BzZWUgR29UcnVlTUZBQXBpI2NoYWxsZW5nZX1cbiAgICAgKi9cbiAgICBhc3luYyBfY2hhbGxlbmdlKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3VzZVNlc3Npb24oYXN5bmMgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YTogc2Vzc2lvbkRhdGEsIGVycm9yOiBzZXNzaW9uRXJyb3IgfSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlc3Npb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3I6IHNlc3Npb25FcnJvciB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBfcmVxdWVzdCh0aGlzLmZldGNoLCAnUE9TVCcsIGAke3RoaXMudXJsfS9mYWN0b3JzLyR7cGFyYW1zLmZhY3RvcklkfS9jaGFsbGVuZ2VgLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiB7IGNoYW5uZWw6IHBhcmFtcy5jaGFubmVsIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBqd3Q6IChfYSA9IHNlc3Npb25EYXRhID09PSBudWxsIHx8IHNlc3Npb25EYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZXNzaW9uRGF0YS5zZXNzaW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChpc0F1dGhFcnJvcihlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB7QHNlZSBHb1RydWVNRkFBcGkjY2hhbGxlbmdlQW5kVmVyaWZ5fVxuICAgICAqL1xuICAgIGFzeW5jIF9jaGFsbGVuZ2VBbmRWZXJpZnkocGFyYW1zKSB7XG4gICAgICAgIC8vIGJvdGggX2NoYWxsZW5nZSBhbmQgX3ZlcmlmeSBpbmRlcGVuZGVudGx5IGFjcXVpcmUgdGhlIGxvY2ssIHNvIG5vIG5lZWRcbiAgICAgICAgLy8gdG8gYWNxdWlyZSBpdCBoZXJlXG4gICAgICAgIGNvbnN0IHsgZGF0YTogY2hhbGxlbmdlRGF0YSwgZXJyb3I6IGNoYWxsZW5nZUVycm9yIH0gPSBhd2FpdCB0aGlzLl9jaGFsbGVuZ2Uoe1xuICAgICAgICAgICAgZmFjdG9ySWQ6IHBhcmFtcy5mYWN0b3JJZCxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjaGFsbGVuZ2VFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3I6IGNoYWxsZW5nZUVycm9yIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3ZlcmlmeSh7XG4gICAgICAgICAgICBmYWN0b3JJZDogcGFyYW1zLmZhY3RvcklkLFxuICAgICAgICAgICAgY2hhbGxlbmdlSWQ6IGNoYWxsZW5nZURhdGEuaWQsXG4gICAgICAgICAgICBjb2RlOiBwYXJhbXMuY29kZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHtAc2VlIEdvVHJ1ZU1GQUFwaSNsaXN0RmFjdG9yc31cbiAgICAgKi9cbiAgICBhc3luYyBfbGlzdEZhY3RvcnMoKSB7XG4gICAgICAgIC8vIHVzZSAjZ2V0VXNlciBpbnN0ZWFkIG9mICNfZ2V0VXNlciBhcyB0aGUgZm9ybWVyIGFjcXVpcmVzIGEgbG9ja1xuICAgICAgICBjb25zdCB7IGRhdGE6IHsgdXNlciB9LCBlcnJvcjogdXNlckVycm9yLCB9ID0gYXdhaXQgdGhpcy5nZXRVc2VyKCk7XG4gICAgICAgIGlmICh1c2VyRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yOiB1c2VyRXJyb3IgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmYWN0b3JzID0gKHVzZXIgPT09IG51bGwgfHwgdXNlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogdXNlci5mYWN0b3JzKSB8fCBbXTtcbiAgICAgICAgY29uc3QgdG90cCA9IGZhY3RvcnMuZmlsdGVyKChmYWN0b3IpID0+IGZhY3Rvci5mYWN0b3JfdHlwZSA9PT0gJ3RvdHAnICYmIGZhY3Rvci5zdGF0dXMgPT09ICd2ZXJpZmllZCcpO1xuICAgICAgICBjb25zdCBwaG9uZSA9IGZhY3RvcnMuZmlsdGVyKChmYWN0b3IpID0+IGZhY3Rvci5mYWN0b3JfdHlwZSA9PT0gJ3Bob25lJyAmJiBmYWN0b3Iuc3RhdHVzID09PSAndmVyaWZpZWQnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhbGw6IGZhY3RvcnMsXG4gICAgICAgICAgICAgICAgdG90cCxcbiAgICAgICAgICAgICAgICBwaG9uZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICoge0BzZWUgR29UcnVlTUZBQXBpI2dldEF1dGhlbnRpY2F0b3JBc3N1cmFuY2VMZXZlbH1cbiAgICAgKi9cbiAgICBhc3luYyBfZ2V0QXV0aGVudGljYXRvckFzc3VyYW5jZUxldmVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWNxdWlyZUxvY2soLTEsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl91c2VTZXNzaW9uKGFzeW5jIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YTogeyBzZXNzaW9uIH0sIGVycm9yOiBzZXNzaW9uRXJyb3IsIH0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKHNlc3Npb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvcjogc2Vzc2lvbkVycm9yIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBjdXJyZW50TGV2ZWw6IG51bGwsIG5leHRMZXZlbDogbnVsbCwgY3VycmVudEF1dGhlbnRpY2F0aW9uTWV0aG9kczogW10gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB7IHBheWxvYWQgfSA9IGRlY29kZUpXVChzZXNzaW9uLmFjY2Vzc190b2tlbik7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRMZXZlbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQuYWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IHBheWxvYWQuYWFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgbmV4dExldmVsID0gY3VycmVudExldmVsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZlcmlmaWVkRmFjdG9ycyA9IChfYiA9IChfYSA9IHNlc3Npb24udXNlci5mYWN0b3JzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZmlsdGVyKChmYWN0b3IpID0+IGZhY3Rvci5zdGF0dXMgPT09ICd2ZXJpZmllZCcpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcbiAgICAgICAgICAgICAgICBpZiAodmVyaWZpZWRGYWN0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dExldmVsID0gJ2FhbDInO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50QXV0aGVudGljYXRpb25NZXRob2RzID0gcGF5bG9hZC5hbXIgfHwgW107XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogeyBjdXJyZW50TGV2ZWwsIG5leHRMZXZlbCwgY3VycmVudEF1dGhlbnRpY2F0aW9uTWV0aG9kcyB9LCBlcnJvcjogbnVsbCB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBmZXRjaEp3ayhraWQsIGp3a3MgPSB7IGtleXM6IFtdIH0pIHtcbiAgICAgICAgLy8gdHJ5IGZldGNoaW5nIGZyb20gdGhlIHN1cHBsaWVkIGp3a3NcbiAgICAgICAgbGV0IGp3ayA9IGp3a3Mua2V5cy5maW5kKChrZXkpID0+IGtleS5raWQgPT09IGtpZCk7XG4gICAgICAgIGlmIChqd2spIHtcbiAgICAgICAgICAgIHJldHVybiBqd2s7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHJ5IGZldGNoaW5nIGZyb20gY2FjaGVcbiAgICAgICAgandrID0gdGhpcy5qd2tzLmtleXMuZmluZCgoa2V5KSA9PiBrZXkua2lkID09PSBraWQpO1xuICAgICAgICAvLyBqd2sgZXhpc3RzIGFuZCBqd2tzIGlzbid0IHN0YWxlXG4gICAgICAgIGlmIChqd2sgJiYgdGhpcy5qd2tzX2NhY2hlZF9hdCArIEpXS1NfVFRMID4gRGF0ZS5ub3coKSkge1xuICAgICAgICAgICAgcmV0dXJuIGp3aztcbiAgICAgICAgfVxuICAgICAgICAvLyBqd2sgaXNuJ3QgY2FjaGVkIGluIG1lbW9yeSBzbyB3ZSBuZWVkIHRvIGZldGNoIGl0IGZyb20gdGhlIHdlbGwta25vd24gZW5kcG9pbnRcbiAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgX3JlcXVlc3QodGhpcy5mZXRjaCwgJ0dFVCcsIGAke3RoaXMudXJsfS8ud2VsbC1rbm93bi9qd2tzLmpzb25gLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGF0YS5rZXlzIHx8IGRhdGEua2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBBdXRoSW52YWxpZEp3dEVycm9yKCdKV0tTIGlzIGVtcHR5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5qd2tzID0gZGF0YTtcbiAgICAgICAgdGhpcy5qd2tzX2NhY2hlZF9hdCA9IERhdGUubm93KCk7XG4gICAgICAgIC8vIEZpbmQgdGhlIHNpZ25pbmcga2V5XG4gICAgICAgIGp3ayA9IGRhdGEua2V5cy5maW5kKChrZXkpID0+IGtleS5raWQgPT09IGtpZCk7XG4gICAgICAgIGlmICghandrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQXV0aEludmFsaWRKd3RFcnJvcignTm8gbWF0Y2hpbmcgc2lnbmluZyBrZXkgZm91bmQgaW4gSldLUycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqd2s7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBleHBlcmltZW50YWwgVGhpcyBtZXRob2QgbWF5IGNoYW5nZSBpbiBmdXR1cmUgdmVyc2lvbnMuXG4gICAgICogQGRlc2NyaXB0aW9uIEdldHMgdGhlIGNsYWltcyBmcm9tIGEgSldULiBJZiB0aGUgSldUIGlzIHN5bW1ldHJpYyBKV1RzLCBpdCB3aWxsIGNhbGwgZ2V0VXNlcigpIHRvIHZlcmlmeSBhZ2FpbnN0IHRoZSBzZXJ2ZXIuIElmIHRoZSBKV1QgaXMgYXN5bW1ldHJpYywgaXQgd2lsbCBiZSB2ZXJpZmllZCBhZ2FpbnN0IHRoZSBKV0tTIHVzaW5nIHRoZSBXZWJDcnlwdG8gQVBJLlxuICAgICAqL1xuICAgIGFzeW5jIGdldENsYWltcyhqd3QsIGp3a3MgPSB7IGtleXM6IFtdIH0pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCB0b2tlbiA9IGp3dDtcbiAgICAgICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCB0aGlzLmdldFNlc3Npb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgfHwgIWRhdGEuc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvciB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b2tlbiA9IGRhdGEuc2Vzc2lvbi5hY2Nlc3NfdG9rZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGhlYWRlciwgcGF5bG9hZCwgc2lnbmF0dXJlLCByYXc6IHsgaGVhZGVyOiByYXdIZWFkZXIsIHBheWxvYWQ6IHJhd1BheWxvYWQgfSwgfSA9IGRlY29kZUpXVCh0b2tlbik7XG4gICAgICAgICAgICAvLyBSZWplY3QgZXhwaXJlZCBKV1RzXG4gICAgICAgICAgICB2YWxpZGF0ZUV4cChwYXlsb2FkLmV4cCk7XG4gICAgICAgICAgICAvLyBJZiBzeW1tZXRyaWMgYWxnb3JpdGhtIG9yIFdlYkNyeXB0byBBUEkgaXMgdW5hdmFpbGFibGUsIGZhbGxiYWNrIHRvIGdldFVzZXIoKVxuICAgICAgICAgICAgaWYgKCFoZWFkZXIua2lkIHx8XG4gICAgICAgICAgICAgICAgaGVhZGVyLmFsZyA9PT0gJ0hTMjU2JyB8fFxuICAgICAgICAgICAgICAgICEoJ2NyeXB0bycgaW4gZ2xvYmFsVGhpcyAmJiAnc3VidGxlJyBpbiBnbG9iYWxUaGlzLmNyeXB0bykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCB0aGlzLmdldFVzZXIodG9rZW4pO1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZ2V0VXNlciBzdWNjZWVkcyBzbyB0aGUgY2xhaW1zIGluIHRoZSBKV1QgY2FuIGJlIHRydXN0ZWRcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFpbXM6IHBheWxvYWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYXR1cmUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBhbGdvcml0aG0gPSBnZXRBbGdvcml0aG0oaGVhZGVyLmFsZyk7XG4gICAgICAgICAgICBjb25zdCBzaWduaW5nS2V5ID0gYXdhaXQgdGhpcy5mZXRjaEp3ayhoZWFkZXIua2lkLCBqd2tzKTtcbiAgICAgICAgICAgIC8vIENvbnZlcnQgSldLIHRvIENyeXB0b0tleVxuICAgICAgICAgICAgY29uc3QgcHVibGljS2V5ID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoJ2p3aycsIHNpZ25pbmdLZXksIGFsZ29yaXRobSwgdHJ1ZSwgW1xuICAgICAgICAgICAgICAgICd2ZXJpZnknLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAvLyBWZXJpZnkgdGhlIHNpZ25hdHVyZVxuICAgICAgICAgICAgY29uc3QgaXNWYWxpZCA9IGF3YWl0IGNyeXB0by5zdWJ0bGUudmVyaWZ5KGFsZ29yaXRobSwgcHVibGljS2V5LCBzaWduYXR1cmUsIHN0cmluZ1RvVWludDhBcnJheShgJHtyYXdIZWFkZXJ9LiR7cmF3UGF5bG9hZH1gKSk7XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXV0aEludmFsaWRKd3RFcnJvcignSW52YWxpZCBKV1Qgc2lnbmF0dXJlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB2ZXJpZmljYXRpb24gc3VjY2VlZHMsIGRlY29kZSBhbmQgcmV0dXJuIGNsYWltc1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsYWltczogcGF5bG9hZCxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLFxuICAgICAgICAgICAgICAgICAgICBzaWduYXR1cmUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNBdXRoRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3IgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxufVxuR29UcnVlQ2xpZW50Lm5leHRJbnN0YW5jZUlEID0gMDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUdvVHJ1ZUNsaWVudC5qcy5tYXAiLCJpbXBvcnQgR29UcnVlQ2xpZW50IGZyb20gJy4vR29UcnVlQ2xpZW50JztcbmNvbnN0IEF1dGhDbGllbnQgPSBHb1RydWVDbGllbnQ7XG5leHBvcnQgZGVmYXVsdCBBdXRoQ2xpZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXV0aENsaWVudC5qcy5tYXAiLCJpbXBvcnQgeyBBdXRoQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL2F1dGgtanMnO1xuZXhwb3J0IGNsYXNzIFN1cGFiYXNlQXV0aENsaWVudCBleHRlbmRzIEF1dGhDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3VwYWJhc2VBdXRoQ2xpZW50LmpzLm1hcCIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgRnVuY3Rpb25zQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL2Z1bmN0aW9ucy1qcyc7XG5pbXBvcnQgeyBQb3N0Z3Jlc3RDbGllbnQsIH0gZnJvbSAnQHN1cGFiYXNlL3Bvc3RncmVzdC1qcyc7XG5pbXBvcnQgeyBSZWFsdGltZUNsaWVudCwgfSBmcm9tICdAc3VwYWJhc2UvcmVhbHRpbWUtanMnO1xuaW1wb3J0IHsgU3RvcmFnZUNsaWVudCBhcyBTdXBhYmFzZVN0b3JhZ2VDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3RvcmFnZS1qcyc7XG5pbXBvcnQgeyBERUZBVUxUX0dMT0JBTF9PUFRJT05TLCBERUZBVUxUX0RCX09QVElPTlMsIERFRkFVTFRfQVVUSF9PUFRJT05TLCBERUZBVUxUX1JFQUxUSU1FX09QVElPTlMsIH0gZnJvbSAnLi9saWIvY29uc3RhbnRzJztcbmltcG9ydCB7IGZldGNoV2l0aEF1dGggfSBmcm9tICcuL2xpYi9mZXRjaCc7XG5pbXBvcnQgeyBlbnN1cmVUcmFpbGluZ1NsYXNoLCBhcHBseVNldHRpbmdEZWZhdWx0cyB9IGZyb20gJy4vbGliL2hlbHBlcnMnO1xuaW1wb3J0IHsgU3VwYWJhc2VBdXRoQ2xpZW50IH0gZnJvbSAnLi9saWIvU3VwYWJhc2VBdXRoQ2xpZW50Jztcbi8qKlxuICogU3VwYWJhc2UgQ2xpZW50LlxuICpcbiAqIEFuIGlzb21vcnBoaWMgSmF2YXNjcmlwdCBjbGllbnQgZm9yIGludGVyYWN0aW5nIHdpdGggUG9zdGdyZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1cGFiYXNlQ2xpZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgY2xpZW50IGZvciB1c2UgaW4gdGhlIGJyb3dzZXIuXG4gICAgICogQHBhcmFtIHN1cGFiYXNlVXJsIFRoZSB1bmlxdWUgU3VwYWJhc2UgVVJMIHdoaWNoIGlzIHN1cHBsaWVkIHdoZW4geW91IGNyZWF0ZSBhIG5ldyBwcm9qZWN0IGluIHlvdXIgcHJvamVjdCBkYXNoYm9hcmQuXG4gICAgICogQHBhcmFtIHN1cGFiYXNlS2V5IFRoZSB1bmlxdWUgU3VwYWJhc2UgS2V5IHdoaWNoIGlzIHN1cHBsaWVkIHdoZW4geW91IGNyZWF0ZSBhIG5ldyBwcm9qZWN0IGluIHlvdXIgcHJvamVjdCBkYXNoYm9hcmQuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZGIuc2NoZW1hIFlvdSBjYW4gc3dpdGNoIGluIGJldHdlZW4gc2NoZW1hcy4gVGhlIHNjaGVtYSBuZWVkcyB0byBiZSBvbiB0aGUgbGlzdCBvZiBleHBvc2VkIHNjaGVtYXMgaW5zaWRlIFN1cGFiYXNlLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmF1dGguYXV0b1JlZnJlc2hUb2tlbiBTZXQgdG8gXCJ0cnVlXCIgaWYgeW91IHdhbnQgdG8gYXV0b21hdGljYWxseSByZWZyZXNoIHRoZSB0b2tlbiBiZWZvcmUgZXhwaXJpbmcuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYXV0aC5wZXJzaXN0U2Vzc2lvbiBTZXQgdG8gXCJ0cnVlXCIgaWYgeW91IHdhbnQgdG8gYXV0b21hdGljYWxseSBzYXZlIHRoZSB1c2VyIHNlc3Npb24gaW50byBsb2NhbCBzdG9yYWdlLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmF1dGguZGV0ZWN0U2Vzc2lvbkluVXJsIFNldCB0byBcInRydWVcIiBpZiB5b3Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IGRldGVjdHMgT0F1dGggZ3JhbnRzIGluIHRoZSBVUkwgYW5kIHNpZ25zIGluIHRoZSB1c2VyLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLnJlYWx0aW1lIE9wdGlvbnMgcGFzc2VkIGFsb25nIHRvIHJlYWx0aW1lLWpzIGNvbnN0cnVjdG9yLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmdsb2JhbC5mZXRjaCBBIGN1c3RvbSBmZXRjaCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5nbG9iYWwuaGVhZGVycyBBbnkgYWRkaXRpb25hbCBoZWFkZXJzIHRvIHNlbmQgd2l0aCBlYWNoIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdXBhYmFzZVVybCwgc3VwYWJhc2VLZXksIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIHRoaXMuc3VwYWJhc2VVcmwgPSBzdXBhYmFzZVVybDtcbiAgICAgICAgdGhpcy5zdXBhYmFzZUtleSA9IHN1cGFiYXNlS2V5O1xuICAgICAgICBpZiAoIXN1cGFiYXNlVXJsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdXBhYmFzZVVybCBpcyByZXF1aXJlZC4nKTtcbiAgICAgICAgaWYgKCFzdXBhYmFzZUtleSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc3VwYWJhc2VLZXkgaXMgcmVxdWlyZWQuJyk7XG4gICAgICAgIGNvbnN0IF9zdXBhYmFzZVVybCA9IGVuc3VyZVRyYWlsaW5nU2xhc2goc3VwYWJhc2VVcmwpO1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gbmV3IFVSTChfc3VwYWJhc2VVcmwpO1xuICAgICAgICB0aGlzLnJlYWx0aW1lVXJsID0gbmV3IFVSTCgncmVhbHRpbWUvdjEnLCBiYXNlVXJsKTtcbiAgICAgICAgdGhpcy5yZWFsdGltZVVybC5wcm90b2NvbCA9IHRoaXMucmVhbHRpbWVVcmwucHJvdG9jb2wucmVwbGFjZSgnaHR0cCcsICd3cycpO1xuICAgICAgICB0aGlzLmF1dGhVcmwgPSBuZXcgVVJMKCdhdXRoL3YxJywgYmFzZVVybCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZVVybCA9IG5ldyBVUkwoJ3N0b3JhZ2UvdjEnLCBiYXNlVXJsKTtcbiAgICAgICAgdGhpcy5mdW5jdGlvbnNVcmwgPSBuZXcgVVJMKCdmdW5jdGlvbnMvdjEnLCBiYXNlVXJsKTtcbiAgICAgICAgLy8gZGVmYXVsdCBzdG9yYWdlIGtleSB1c2VzIHRoZSBzdXBhYmFzZSBwcm9qZWN0IHJlZiBhcyBhIG5hbWVzcGFjZVxuICAgICAgICBjb25zdCBkZWZhdWx0U3RvcmFnZUtleSA9IGBzYi0ke2Jhc2VVcmwuaG9zdG5hbWUuc3BsaXQoJy4nKVswXX0tYXV0aC10b2tlbmA7XG4gICAgICAgIGNvbnN0IERFRkFVTFRTID0ge1xuICAgICAgICAgICAgZGI6IERFRkFVTFRfREJfT1BUSU9OUyxcbiAgICAgICAgICAgIHJlYWx0aW1lOiBERUZBVUxUX1JFQUxUSU1FX09QVElPTlMsXG4gICAgICAgICAgICBhdXRoOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQVVUSF9PUFRJT05TKSwgeyBzdG9yYWdlS2V5OiBkZWZhdWx0U3RvcmFnZUtleSB9KSxcbiAgICAgICAgICAgIGdsb2JhbDogREVGQVVMVF9HTE9CQUxfT1BUSU9OUyxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBhcHBseVNldHRpbmdEZWZhdWx0cyhvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCA/IG9wdGlvbnMgOiB7fSwgREVGQVVMVFMpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VLZXkgPSAoX2EgPSBzZXR0aW5ncy5hdXRoLnN0b3JhZ2VLZXkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICcnO1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSAoX2IgPSBzZXR0aW5ncy5nbG9iYWwuaGVhZGVycykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDoge307XG4gICAgICAgIGlmICghc2V0dGluZ3MuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYXV0aCA9IHRoaXMuX2luaXRTdXBhYmFzZUF1dGhDbGllbnQoKF9jID0gc2V0dGluZ3MuYXV0aCkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDoge30sIHRoaXMuaGVhZGVycywgc2V0dGluZ3MuZ2xvYmFsLmZldGNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBzZXR0aW5ncy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuYXV0aCA9IG5ldyBQcm94eSh7fSwge1xuICAgICAgICAgICAgICAgIGdldDogKF8sIHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBAc3VwYWJhc2Uvc3VwYWJhc2UtanM6IFN1cGFiYXNlIENsaWVudCBpcyBjb25maWd1cmVkIHdpdGggdGhlIGFjY2Vzc1Rva2VuIG9wdGlvbiwgYWNjZXNzaW5nIHN1cGFiYXNlLmF1dGguJHtTdHJpbmcocHJvcCl9IGlzIG5vdCBwb3NzaWJsZWApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZldGNoID0gZmV0Y2hXaXRoQXV0aChzdXBhYmFzZUtleSwgdGhpcy5fZ2V0QWNjZXNzVG9rZW4uYmluZCh0aGlzKSwgc2V0dGluZ3MuZ2xvYmFsLmZldGNoKTtcbiAgICAgICAgdGhpcy5yZWFsdGltZSA9IHRoaXMuX2luaXRSZWFsdGltZUNsaWVudChPYmplY3QuYXNzaWduKHsgaGVhZGVyczogdGhpcy5oZWFkZXJzLCBhY2Nlc3NUb2tlbjogdGhpcy5fZ2V0QWNjZXNzVG9rZW4uYmluZCh0aGlzKSB9LCBzZXR0aW5ncy5yZWFsdGltZSkpO1xuICAgICAgICB0aGlzLnJlc3QgPSBuZXcgUG9zdGdyZXN0Q2xpZW50KG5ldyBVUkwoJ3Jlc3QvdjEnLCBiYXNlVXJsKS5ocmVmLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICBzY2hlbWE6IHNldHRpbmdzLmRiLnNjaGVtYSxcbiAgICAgICAgICAgIGZldGNoOiB0aGlzLmZldGNoLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuRm9yQXV0aEV2ZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1cGFiYXNlIEZ1bmN0aW9ucyBhbGxvd3MgeW91IHRvIGRlcGxveSBhbmQgaW52b2tlIGVkZ2UgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIGdldCBmdW5jdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25zQ2xpZW50KHRoaXMuZnVuY3Rpb25zVXJsLmhyZWYsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcbiAgICAgICAgICAgIGN1c3RvbUZldGNoOiB0aGlzLmZldGNoLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3VwYWJhc2UgU3RvcmFnZSBhbGxvd3MgeW91IHRvIG1hbmFnZSB1c2VyLWdlbmVyYXRlZCBjb250ZW50LCBzdWNoIGFzIHBob3RvcyBvciB2aWRlb3MuXG4gICAgICovXG4gICAgZ2V0IHN0b3JhZ2UoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3VwYWJhc2VTdG9yYWdlQ2xpZW50KHRoaXMuc3RvcmFnZVVybC5ocmVmLCB0aGlzLmhlYWRlcnMsIHRoaXMuZmV0Y2gpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGEgcXVlcnkgb24gYSB0YWJsZSBvciBhIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVsYXRpb24gLSBUaGUgdGFibGUgb3IgdmlldyBuYW1lIHRvIHF1ZXJ5XG4gICAgICovXG4gICAgZnJvbShyZWxhdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN0LmZyb20ocmVsYXRpb24pO1xuICAgIH1cbiAgICAvLyBOT1RFOiBzaWduYXR1cmVzIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggUG9zdGdyZXN0Q2xpZW50LnNjaGVtYVxuICAgIC8qKlxuICAgICAqIFNlbGVjdCBhIHNjaGVtYSB0byBxdWVyeSBvciBwZXJmb3JtIGFuIGZ1bmN0aW9uIChycGMpIGNhbGwuXG4gICAgICpcbiAgICAgKiBUaGUgc2NoZW1hIG5lZWRzIHRvIGJlIG9uIHRoZSBsaXN0IG9mIGV4cG9zZWQgc2NoZW1hcyBpbnNpZGUgU3VwYWJhc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NoZW1hIC0gVGhlIHNjaGVtYSB0byBxdWVyeVxuICAgICAqL1xuICAgIHNjaGVtYShzY2hlbWEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdC5zY2hlbWEoc2NoZW1hKTtcbiAgICB9XG4gICAgLy8gTk9URTogc2lnbmF0dXJlcyBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIFBvc3RncmVzdENsaWVudC5ycGNcbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGEgZnVuY3Rpb24gY2FsbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmbiAtIFRoZSBmdW5jdGlvbiBuYW1lIHRvIGNhbGxcbiAgICAgKiBAcGFyYW0gYXJncyAtIFRoZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgZnVuY3Rpb24gY2FsbFxuICAgICAqIEBwYXJhbSBvcHRpb25zIC0gTmFtZWQgcGFyYW1ldGVyc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmhlYWQgLSBXaGVuIHNldCB0byBgdHJ1ZWAsIGBkYXRhYCB3aWxsIG5vdCBiZSByZXR1cm5lZC5cbiAgICAgKiBVc2VmdWwgaWYgeW91IG9ubHkgbmVlZCB0aGUgY291bnQuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZ2V0IC0gV2hlbiBzZXQgdG8gYHRydWVgLCB0aGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aFxuICAgICAqIHJlYWQtb25seSBhY2Nlc3MgbW9kZS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5jb3VudCAtIENvdW50IGFsZ29yaXRobSB0byB1c2UgdG8gY291bnQgcm93cyByZXR1cm5lZCBieSB0aGVcbiAgICAgKiBmdW5jdGlvbi4gT25seSBhcHBsaWNhYmxlIGZvciBbc2V0LXJldHVybmluZ1xuICAgICAqIGZ1bmN0aW9uc10oaHR0cHM6Ly93d3cucG9zdGdyZXNxbC5vcmcvZG9jcy9jdXJyZW50L2Z1bmN0aW9ucy1zcmYuaHRtbCkuXG4gICAgICpcbiAgICAgKiBgXCJleGFjdFwiYDogRXhhY3QgYnV0IHNsb3cgY291bnQgYWxnb3JpdGhtLiBQZXJmb3JtcyBhIGBDT1VOVCgqKWAgdW5kZXIgdGhlXG4gICAgICogaG9vZC5cbiAgICAgKlxuICAgICAqIGBcInBsYW5uZWRcImA6IEFwcHJveGltYXRlZCBidXQgZmFzdCBjb3VudCBhbGdvcml0aG0uIFVzZXMgdGhlIFBvc3RncmVzXG4gICAgICogc3RhdGlzdGljcyB1bmRlciB0aGUgaG9vZC5cbiAgICAgKlxuICAgICAqIGBcImVzdGltYXRlZFwiYDogVXNlcyBleGFjdCBjb3VudCBmb3IgbG93IG51bWJlcnMgYW5kIHBsYW5uZWQgY291bnQgZm9yIGhpZ2hcbiAgICAgKiBudW1iZXJzLlxuICAgICAqL1xuICAgIHJwYyhmbiwgYXJncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdC5ycGMoZm4sIGFyZ3MsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgUmVhbHRpbWUgY2hhbm5lbCB3aXRoIEJyb2FkY2FzdCwgUHJlc2VuY2UsIGFuZCBQb3N0Z3JlcyBDaGFuZ2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgUmVhbHRpbWUgY2hhbm5lbC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIFRoZSBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIFJlYWx0aW1lIGNoYW5uZWwuXG4gICAgICpcbiAgICAgKi9cbiAgICBjaGFubmVsKG5hbWUsIG9wdHMgPSB7IGNvbmZpZzoge30gfSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFsdGltZS5jaGFubmVsKG5hbWUsIG9wdHMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFsbCBSZWFsdGltZSBjaGFubmVscy5cbiAgICAgKi9cbiAgICBnZXRDaGFubmVscygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhbHRpbWUuZ2V0Q2hhbm5lbHMoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmVzIGFuZCByZW1vdmVzIFJlYWx0aW1lIGNoYW5uZWwgZnJvbSBSZWFsdGltZSBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlYWx0aW1lQ2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBuYW1lIG9mIHRoZSBSZWFsdGltZSBjaGFubmVsLlxuICAgICAqXG4gICAgICovXG4gICAgcmVtb3ZlQ2hhbm5lbChjaGFubmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWx0aW1lLnJlbW92ZUNoYW5uZWwoY2hhbm5lbCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlcyBhbmQgcmVtb3ZlcyBhbGwgUmVhbHRpbWUgY2hhbm5lbHMgZnJvbSBSZWFsdGltZSBjbGllbnQuXG4gICAgICovXG4gICAgcmVtb3ZlQWxsQ2hhbm5lbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWx0aW1lLnJlbW92ZUFsbENoYW5uZWxzKCk7XG4gICAgfVxuICAgIF9nZXRBY2Nlc3NUb2tlbigpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIHRoaXMuYWNjZXNzVG9rZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0geWllbGQgdGhpcy5hdXRoLmdldFNlc3Npb24oKTtcbiAgICAgICAgICAgIHJldHVybiAoX2IgPSAoX2EgPSBkYXRhLnNlc3Npb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY2Nlc3NfdG9rZW4pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfaW5pdFN1cGFiYXNlQXV0aENsaWVudCh7IGF1dG9SZWZyZXNoVG9rZW4sIHBlcnNpc3RTZXNzaW9uLCBkZXRlY3RTZXNzaW9uSW5VcmwsIHN0b3JhZ2UsIHN0b3JhZ2VLZXksIGZsb3dUeXBlLCBsb2NrLCBkZWJ1ZywgfSwgaGVhZGVycywgZmV0Y2gpIHtcbiAgICAgICAgY29uc3QgYXV0aEhlYWRlcnMgPSB7XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7dGhpcy5zdXBhYmFzZUtleX1gLFxuICAgICAgICAgICAgYXBpa2V5OiBgJHt0aGlzLnN1cGFiYXNlS2V5fWAsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXcgU3VwYWJhc2VBdXRoQ2xpZW50KHtcbiAgICAgICAgICAgIHVybDogdGhpcy5hdXRoVXJsLmhyZWYsXG4gICAgICAgICAgICBoZWFkZXJzOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGF1dGhIZWFkZXJzKSwgaGVhZGVycyksXG4gICAgICAgICAgICBzdG9yYWdlS2V5OiBzdG9yYWdlS2V5LFxuICAgICAgICAgICAgYXV0b1JlZnJlc2hUb2tlbixcbiAgICAgICAgICAgIHBlcnNpc3RTZXNzaW9uLFxuICAgICAgICAgICAgZGV0ZWN0U2Vzc2lvbkluVXJsLFxuICAgICAgICAgICAgc3RvcmFnZSxcbiAgICAgICAgICAgIGZsb3dUeXBlLFxuICAgICAgICAgICAgbG9jayxcbiAgICAgICAgICAgIGRlYnVnLFxuICAgICAgICAgICAgZmV0Y2gsXG4gICAgICAgICAgICAvLyBhdXRoIGNoZWNrcyBpZiB0aGVyZSBpcyBhIGN1c3RvbSBhdXRob3JpemFpdG9uIGhlYWRlciB1c2luZyB0aGlzIGZsYWdcbiAgICAgICAgICAgIC8vIHNvIGl0IGtub3dzIHdoZXRoZXIgdG8gcmV0dXJuIGFuIGVycm9yIHdoZW4gZ2V0VXNlciBpcyBjYWxsZWQgd2l0aCBubyBzZXNzaW9uXG4gICAgICAgICAgICBoYXNDdXN0b21BdXRob3JpemF0aW9uSGVhZGVyOiAnQXV0aG9yaXphdGlvbicgaW4gdGhpcy5oZWFkZXJzLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2luaXRSZWFsdGltZUNsaWVudChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVhbHRpbWVDbGllbnQodGhpcy5yZWFsdGltZVVybC5ocmVmLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IHBhcmFtczogT2JqZWN0LmFzc2lnbih7IGFwaWtleTogdGhpcy5zdXBhYmFzZUtleSB9LCBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMucGFyYW1zKSB9KSk7XG4gICAgfVxuICAgIF9saXN0ZW5Gb3JBdXRoRXZlbnRzKCkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZSgoZXZlbnQsIHNlc3Npb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVRva2VuQ2hhbmdlZChldmVudCwgJ0NMSUVOVCcsIHNlc3Npb24gPT09IG51bGwgfHwgc2Vzc2lvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2Vzc2lvbi5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIF9oYW5kbGVUb2tlbkNoYW5nZWQoZXZlbnQsIHNvdXJjZSwgdG9rZW4pIHtcbiAgICAgICAgaWYgKChldmVudCA9PT0gJ1RPS0VOX1JFRlJFU0hFRCcgfHwgZXZlbnQgPT09ICdTSUdORURfSU4nKSAmJlxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VkQWNjZXNzVG9rZW4gIT09IHRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZWRBY2Nlc3NUb2tlbiA9IHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50ID09PSAnU0lHTkVEX09VVCcpIHtcbiAgICAgICAgICAgIHRoaXMucmVhbHRpbWUuc2V0QXV0aCgpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZSA9PSAnU1RPUkFHRScpXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoLnNpZ25PdXQoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlZEFjY2Vzc1Rva2VuID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3VwYWJhc2VDbGllbnQuanMubWFwIiwiaW1wb3J0IFN1cGFiYXNlQ2xpZW50IGZyb20gJy4vU3VwYWJhc2VDbGllbnQnO1xuZXhwb3J0ICogZnJvbSAnQHN1cGFiYXNlL2F1dGgtanMnO1xuZXhwb3J0IHsgUG9zdGdyZXN0RXJyb3IsIH0gZnJvbSAnQHN1cGFiYXNlL3Bvc3RncmVzdC1qcyc7XG5leHBvcnQgeyBGdW5jdGlvbnNIdHRwRXJyb3IsIEZ1bmN0aW9uc0ZldGNoRXJyb3IsIEZ1bmN0aW9uc1JlbGF5RXJyb3IsIEZ1bmN0aW9uc0Vycm9yLCBGdW5jdGlvblJlZ2lvbiwgfSBmcm9tICdAc3VwYWJhc2UvZnVuY3Rpb25zLWpzJztcbmV4cG9ydCAqIGZyb20gJ0BzdXBhYmFzZS9yZWFsdGltZS1qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN1cGFiYXNlQ2xpZW50IH0gZnJvbSAnLi9TdXBhYmFzZUNsaWVudCc7XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgU3VwYWJhc2UgQ2xpZW50LlxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlQ2xpZW50ID0gKHN1cGFiYXNlVXJsLCBzdXBhYmFzZUtleSwgb3B0aW9ucykgPT4ge1xuICAgIHJldHVybiBuZXcgU3VwYWJhc2VDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlS2V5LCBvcHRpb25zKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwiZmlsZSI6ImFzc2V0cy9zdXBhYmFzZS1EakhmZGZlMy5qcyJ9