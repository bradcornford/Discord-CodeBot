const ms = require('string-to-ms');
const packageJson = require('../package.json');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
const DISCORD_CHANNELS = process.env.DISCORD_CHANNELS || 'codes';
const POLL_INTERVAL = ms(process.env.POLL_INTERVAL) || ms('1h');
const CODES = [];

exports.discordToken = DISCORD_TOKEN;
exports.discordChannels = DISCORD_CHANNELS;
exports.pollInterval = POLL_INTERVAL;
exports.codes = CODES;
exports.version = packageJson.version;
