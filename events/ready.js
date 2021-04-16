const { getFacebookPosts, extractCodesFromFacebookPosts, typeFacebookInitial, typeFacebookPoll } = require('../includes/facebook')

const config = require('../includes/config');
const process = require('process');

/**
 * @param {Client} client
 */
module.exports = (client) => {
    console.log(`${client.user.username} is now online!`);

    client.user.setActivity(`version ${config.version}`, { type: 'PLAYING' })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);

    const codesChannels = [];

    client.guilds.cache.map((guild) => {
        config.discordChannels.split(',').forEach((discordChannel) => {
            let codeChannel = guild.channels.cache.find(channel => channel.name === discordChannel);

            if (codeChannel) {
                codesChannels.push(codeChannel);
            }
        });
    });

    if (codesChannels.length === 0) {
        console.error(`Unable to find any codes channels, exiting`);
        process.exit(1);
    }

    getFacebookPosts()
        .then((posts) => extractCodesFromFacebookPosts(client, posts, typeFacebookInitial, codesChannels))
        .then(() => client.setInterval(
                async () => {
                    await getFacebookPosts()
                        .then((posts) => extractCodesFromFacebookPosts(client, posts, typeFacebookPoll, codesChannels))
                        .catch(console.error);
                },
                config.pollInterval
            ))
        .catch(console.error);
};
