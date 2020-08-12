#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = tslib_1.__importDefault(require("commander"));
// import pkg from '../package.json';
const transport_1 = require("./transport");
// main cli logic
function main() {
    commander_1.default
        // .version(pkg.version)
        .option('-d, --dsn <dsn>', 'Your Sentry DSN or Data Source Name')
        .option('-e, --environment <environment>', 'Sentry environment')
        .option('-n, --serverName <serverName>', 'Transport name')
        .option('-dm, --debug <debug>', 'Turns debug mode on or off')
        .option('-sr, --sampleRate <sampleRate>', 'Sample rate as a percentage of events to be sent in the range of 0.0 to 1.0')
        .option('-mb, --maxBreadcrumbs <maxBreadcrumbs>', 'Total amount of breadcrumbs that should be captured')
        .option('-di, --dist <dist>', 'Sets the distribution for all events')
        .option('--maxValueLength <maxValueLength>', 'Maximum number of chars a single value can have before it will be truncated.')
        .option('--release <release>', 'The release identifier used when uploading respective source maps.')
        .action(async ({ dsn, serverName, environment, debug, sampleRate, maxBreadcrumbs, dist, logLevel, maxValueLength, release }) => {
        try {
            console.info('start');
            const writeStream = await transport_1.createWriteStreamAsync({
                dsn,
                serverName,
                environment,
                debug,
                sampleRate,
                maxBreadcrumbs,
                dist,
                logLevel,
                maxValueLength,
                release,
            });
            process.stdin.pipe(writeStream);
            console.info('logging');
        }
        catch (error) {
            console.log(error.message);
        }
    });
    commander_1.default.parse(process.argv);
}
main();
//# sourceMappingURL=cli.js.map