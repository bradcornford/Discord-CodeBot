const fetch = require('node-fetch');
const cheerio = require('cheerio');

const config = require('../includes/config');

const typeFacebookInitial = 'initial';
const typeFacebookPoll = 'poll';

const getFacebookPosts = async () => {
    return await fetch(
        'https://www.facebook.com/gumballs.dungeons/posts/?_fb_noscript=1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0'
            }
        })
        .then(async response => {
            const html = await response.text();
            const $ = cheerio.load(html);

            console.log('Completed Facebook request');

            const timeLinePostElements = $('.userContent').map((i,el) => $(el)).get();
            const posts = timeLinePostElements.map(post => {
                return {
                    message: post.html(),
                    created_at: post.parents('.userContentWrapper').find('.timestampContent').html()
                };
            });

            console.log('Completed parsing Facebook request to posts');

            return posts;
        })
        .catch(console.error);
};

const matchCodeInFacebookPost = (post) => {
    let pattern = /Classic &amp; Joint: ([a-zA-Z0-9]{6,12})/;

    if (post.message.includes('Classic &amp; Joint:')) {
        let matches = post.message.match(pattern);

        if (
            matches !== null &&
            matches[1] !== 'undefined' &&
            config.codes.filter(item => item.code === matches[1]).length === 0
        ) {
            return matches[1];
        }
    }

    return false;
};

const extractCodesFromFacebookPosts = async (client, posts, type, channels) => {
    for (const post of posts) {
        let code = matchCodeInFacebookPost(post);

        if (code !== false) {
            if (type === typeFacebookInitial) {
                config.codes.push({ 'code': code, 'date': post.created_at });
                console.log(`Initial code: ${code}`);
            } else if (type === typeFacebookPoll) {
                config.codes.unshift({ 'code': code, 'date': post.created_at });
                console.log(`Poll code: ${code}`);
                channels.forEach((channel) => {
                    channel.send(code)
                        .catch(console.error);
                });
            }
        }
    }

    console.log('Completed extracting codes from Facebook posts');

    return posts;
};

exports.typeFacebookInitial = typeFacebookInitial;
exports.typeFacebookPoll = typeFacebookPoll;
exports.getFacebookPosts = getFacebookPosts;
exports.extractCodesFromFacebookPosts = extractCodesFromFacebookPosts;
