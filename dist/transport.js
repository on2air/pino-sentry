"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWriteStream = exports.createWriteStreamAsync = exports.PinoSentryTransport = void 0;
const tslib_1 = require("tslib");
const split2_1 = tslib_1.__importDefault(require("split2"));
const pump_1 = tslib_1.__importDefault(require("pump"));
const through2_1 = tslib_1.__importDefault(require("through2"));
const pify_1 = tslib_1.__importDefault(require("pify"));
const Sentry = tslib_1.__importStar(require("@sentry/node"));
class ExtendedError extends Error {
    constructor(info) {
        super(info.message);
        this.name = "Error";
        this.stack = info.stack || null;
    }
}
function writeToStdout() {
    return through2_1.default(function (chunk, _enc, cb) {
        this.push(chunk);
        process.stdout.write(chunk);
        cb();
    });
}
const SEVERITIES_MAP = {
    10: Sentry.Severity.Debug,
    20: Sentry.Severity.Debug,
    30: Sentry.Severity.Info,
    40: Sentry.Severity.Warning,
    50: Sentry.Severity.Error,
    60: Sentry.Severity.Fatal,
    // Support for useLevelLabels
    // https://github.com/pinojs/pino/blob/master/docs/api.md#uselevellabels-boolean
    trace: Sentry.Severity.Debug,
    debug: Sentry.Severity.Debug,
    info: Sentry.Severity.Info,
    warning: Sentry.Severity.Warning,
    error: Sentry.Severity.Error,
    fatal: Sentry.Severity.Fatal,
};
class PinoSentryTransport {
    constructor(options) {
        Sentry.init(this.withDefaults(options || {}));
    }
    getLogSeverity(level) {
        return SEVERITIES_MAP[level] || Sentry.Severity.Info;
    }
    get sentry() {
        return Sentry;
    }
    parse(line) {
        const chunk = JSON.parse(line);
        const cb = () => {
        };
        this.prepareAndGo(chunk, cb);
    }
    transformer() {
        return through2_1.default.obj((chunk, _enc, cb) => {
            this.prepareAndGo(chunk, cb);
        });
    }
    prepareAndGo(chunk, cb) {
        const severity = this.getLogSeverity(chunk.level);
        const tags = chunk.tags || {};
        if (chunk.reqId) {
            tags.uuid = chunk.reqId;
        }
        if (chunk.responseTime) {
            tags.responseTime = chunk.responseTime;
        }
        if (chunk.hostname) {
            tags.hostname = chunk.hostname;
        }
        // const user = chunk.user || {};
        const message = chunk.msg;
        const stack = chunk.stack || '';
        Sentry.withScope(scope => {
            if (chunk.user)
                scope.setUser(chunk.user);
            if (this.isObject(tags)) {
                Object.keys(tags).forEach(tag => scope.setExtra(tag, tags[tag]));
            }
        });
        // Capturing Errors / Exceptions
        if (this.shouldLogException(severity)) {
            const error = message instanceof Error ? message : new ExtendedError({ message, stack });
            setImmediate(() => {
                Sentry.captureException(error);
                cb();
            });
        }
        else {
            // // Capturing Messages
            // setImmediate(() => {
            //   Sentry.captureMessage(message, severity);
            //   cb();
            // });
        }
    }
    withDefaults(options = {}) {
        return {
            dsn: process.env.SENTRY_DSN || '',
            // npm_package_name will be available if ran with
            // from a "script" field in package.json.
            serverName: process.env.npm_package_name || 'pino-sentry',
            environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production',
            debug: !!process.env.SENTRY_DEBUG || false,
            sampleRate: 1.0,
            maxBreadcrumbs: 100,
            ...options,
        };
    }
    isObject(obj) {
        const type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }
    shouldLogException(level) {
        return level === Sentry.Severity.Fatal || level === Sentry.Severity.Error;
    }
}
exports.PinoSentryTransport = PinoSentryTransport;
;
function createWriteStreamAsync(options = {}) {
    if (!options.dsn && !process.env.SENTRY_DSN) {
        throw Error('Sentry DSN missing');
    }
    const transport = new PinoSentryTransport(options);
    const sentryTransformer = transport.transformer();
    const pumpAsync = pify_1.default(pump_1.default);
    return pumpAsync(process.stdin.pipe(writeToStdout()), split2_1.default((line) => {
        try {
            return JSON.parse(line);
        }
        catch (e) {
            throw Error('logs should be in json format');
        }
    }), sentryTransformer);
}
exports.createWriteStreamAsync = createWriteStreamAsync;
;
function createWriteStream(options = {}) {
    if (!options.dsn && !process.env.SENTRY_DSN) {
        throw Error('Sentry DSN missing');
    }
    const transport = new PinoSentryTransport(options);
    const sentryParse = transport.parse.bind(transport);
    return Object.assign(split2_1.default(sentryParse), { transport });
}
exports.createWriteStream = createWriteStream;
;
//# sourceMappingURL=transport.js.map