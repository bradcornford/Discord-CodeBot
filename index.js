require('dotenv').config()

const Discord = require('discord.js');

const client = new Discord.Client();

require('./includes/log');

const config = require('./includes/config');

client.on('ready', async () => {
    await require('./events/ready')(client);
});

client.login(config.discordToken)
    .catch(console.error);
