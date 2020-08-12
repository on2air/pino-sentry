/// <reference types="node" />
import stream from 'stream';
import * as Sentry from '@sentry/node';
declare const SEVERITIES_MAP: {
    readonly 10: Sentry.Severity.Debug;
    readonly 20: Sentry.Severity.Debug;
    readonly 30: Sentry.Severity.Info;
    readonly 40: Sentry.Severity.Warning;
    readonly 50: Sentry.Severity.Error;
    readonly 60: Sentry.Severity.Fatal;
    readonly trace: Sentry.Severity.Debug;
    readonly debug: Sentry.Severity.Debug;
    readonly info: Sentry.Severity.Info;
    readonly warning: Sentry.Severity.Warning;
    readonly error: Sentry.Severity.Error;
    readonly fatal: Sentry.Severity.Fatal;
};
export declare class PinoSentryTransport {
    constructor(options?: Sentry.NodeOptions);
    getLogSeverity(level: keyof typeof SEVERITIES_MAP): Sentry.Severity;
    get sentry(): typeof Sentry;
    parse(line: any): void;
    transformer(): stream.Transform;
    prepareAndGo(chunk: any, cb: any): void;
    private withDefaults;
    private isObject;
    private shouldLogException;
}
export declare function createWriteStreamAsync(options?: Sentry.NodeOptions): PromiseLike<stream.Transform>;
export declare function createWriteStream(options?: Sentry.NodeOptions): stream.Transform & {
    transport: PinoSentryTransport;
};
export {};
