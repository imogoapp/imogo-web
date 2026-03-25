const pkg = require('../package.json') as { version: string };

export const APP_VERSION: string = pkg.version;
