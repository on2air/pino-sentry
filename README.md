
# pino-sentry
[![CircleCI](https://circleci.com/gh/aandrewww/pino-sentry.svg?style=svg)](https://circleci.com/gh/aandrewww/pino-sentry)
[![node](https://img.shields.io/badge/node-6.4.0+-brightgreen.svg)][node-url]
[![license](https://img.shields.io/github/license/aandrewww/pino-sentry.svg)][license-url]

Load [pino](https://github.com/pinojs/pino) logs into [Sentry](https://sentry.io/)

## Index

* [Install](#install)
* [Usage](#usage)
  - [CLI](#cli)
  - [API](#api)
* [Options](#options-options)
  - [Transport options](#transport-options)
  - [Log Level Mapping](#log-level-mapping)
* [License](#license)

## Install

```bash
npm install pino-sentry -g
```

## Usage

### CLI

```bash
node ./app.js | pino-sentry --dsn=https://******@sentry.io/12345
```

### API

```js
const { createWriteStream } = require('pino-sentry');
// ...
const opts = { /* ... */ };
const stream = createWriteStream({ dsn: process.env.SENTRY_DSN });
const logger = pino(opts, stream);
```

## Options (`options`)

### Transport options

* `--dsn` (`-d`): your Sentry DSN or Data Source Name (defaults to `process.env.SENTRY_DSN`)
* `--environment` (`-e`): (defaults to `process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production'`)
* `--serverName` (`-n`): transport name (defaults to `pino-sentry`)
* `--debug` (`-dm`): turns debug mode on or off (default to `process.env.SENTRY_DEBUG || false`)
* `--sampleRate` (`-sr`): sample rate as a percentage of events to be sent in the range of 0.0 to 1.0 (default to `1.0`)
* `--maxBreadcrumbs` (`-mx`): total amount of breadcrumbs that should be captured (default to `100`)

### Log Level Mapping

Pino logging levels are mapped by default to Sentry's acceptable levels.

```js
{
  trace: 'debug',
  debug: 'debug',
  info: 'info',
  warn: 'warning',
  error: 'error',
  fatal: 'fatal'
}
```

## License

[MIT License][license-url]

[license-url]: LICENSE
[node-url]: https://nodejs.org
