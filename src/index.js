/**
 * @description App for playing around with Jexia, Main Entry point
 * @file /src/index.js
 * @author Henco Smith 2020
 */

/**
 * Packages
 */
// Time helpers
const moment = require('moment');
// Command line formatting
const chalk = require('chalk');
// General helper library
const _ = require('lodash');
// REST helper
const axios = require('axios');
// Config file loader
const config = require('config');
// Discord SDK
const Discord = require('discord.js');
// Routing Helper and Middleware
const express = require('express');


/**
 * Helpers
 */
const { pushJoke, getRandomJoke } = require('./components/jexia');
const { getBot } = require('./components/nlp');


/**
 * Program entry
 */
(async () => {
    try {
        console.info(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Program Start`));

        // Test Env definitions
        const projectID = process.env.JEXIA_PROJECT_ID;
        if (_.isUndefined(projectID) || _.isNull(projectID)) {
            throw new Error('JEXIA_PROJECT_ID environment variable must be defined');
        }
        const key = process.env.JEXIA_API_KEY;
        if (_.isUndefined(key) || _.isNull(key)) {
            throw new Error('JEXIA_API_KEY environment variable must be defined');
        }
        const secret = process.env.JEXIA_API_SECRET;
        if (_.isUndefined(secret) || _.isNull(secret)) {
            throw new Error('JEXIA_API_SECRET environment variable must be defined');
        }
        const botToken = process.env.DISCORD_BOT_TOKEN;
        if (_.isUndefined(botToken) || _.isNull(botToken)) {
            throw new Error('DISCORD_BOT_TOKEN environment variable must be defined');
        }
        const port = process.env.PORT;
        if (_.isUndefined(port) || _.isNull(port)) {
            throw new Error('PORT environment variable must be defined');
        }


        // Pull a Chuck Norris joke from API
        const { data } = await axios.get(config.get('request.chuckNorrisGet'));
        const joke = data.value;
        console.info(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] '${joke}'`));


        // Push a joke to Jexia on Startup
        await pushJoke(joke).catch((err) => { throw err; });


        // Setup NLP bot
        const nlp = await getBot().catch((err) => { throw err; });


        // Create and init discord client
        const client = new Discord.Client();
        await client.login(botToken)
            .catch((err) => { throw err; });

        client.on('ready', () => {
            console.info(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Discord bot logged in as ${client.user.tag}`));
        });

        client.on('message', async (msg) => {
            if (msg.content.toLowerCase().includes('joke')) {
                msg.reply(await getRandomJoke());
                return;
            }
            if ([
                'day',
                'daily',
            ].includes(msg.content.toLowerCase())) {
                msg.reply(joke);
                return;
            }

            const nlpResult = await nlp.process('en', msg.content)
                .catch((err) => { throw err; });
            const { answer } = nlpResult;
            if (!_.isUndefined(answer) && !_.isNull(answer)) {
                msg.reply(answer);
            }
        });


        // Setup Express
        const app = express();
        app.get('/', (req, res) => {
            res.json({
                dailyJoke: joke,
                discordServer: 'https://discord.gg/8UnBxRm',
            });
        });
        app.listen(port);
    } catch (err) {
        console.error(chalk.red(err.message));
        console.info(chalk.yellow(err.stack));
        process.exit(1);
    }
})();
