/**
 * @description App for playing around with Jexia, Main Entry point
 * @file /src/index.js
 * @author Henco Smith 2020
 */
/* eslint-disable camelcase */

/**
 * Packages
 */
// Time helpers
const moment = require('moment');
// Command line formatting
const chalk = require('chalk');
// Jexia
const { jexiaClient, dataOperations } = require('jexia-sdk-js/node');
// Config file loader
const config = require('config');
// Promise helper
const Promise = require('bluebird');


/**
 * Init
 */
const projectID = process.env.JEXIA_PROJECT_ID;
console.info(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Init Project ID '${projectID}'`));

const dataOps = dataOperations();

jexiaClient().init({
    projectID,
    key: process.env.JEXIA_API_KEY,
    secret: process.env.JEXIA_API_SECRET,
}, dataOps);

// Push Joke to dataset
const jokes = dataOps.dataset(config.get('jexia.jokeDataset'));


module.exports = {
    pushJoke: async (joke) => {
        const insertQuery = jokes.insert([{
            description: joke,
        }]);

        const records = await new Promise((resolve, reject) => {
            insertQuery.subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        }).catch((err) => { throw err; });

        console.info(chalk.green(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${JSON.stringify(records)}`));
    },

    getRandomJoke: async () => {
        // lookup the oldest and latest creation timestamp of all records in
        // the jokes dataset
        const selectQuery = jokes
            .select()
            .fields({
                fn: 'min',
                field: 'created_at',
                alias: 'oldest_created_at',
            }, {
                fn: 'max',
                field: 'created_at',
                alias: 'latest_created_at',
            });

        const dateRange = await new Promise((resolve, reject) => {
            selectQuery.subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        }).catch((err) => { throw err; });

        const {
            oldest_created_at,
            latest_created_at,
        } = dateRange[0];

        const timeRange = moment(latest_created_at).diff(moment(oldest_created_at), 'seconds');
        const randomDate = moment(oldest_created_at).add(Math.round(Math.random() * timeRange), 'seconds');

        // Lookup a random joke
        const selectRandomQuery = jokes
            .select()
            .fields('description')
            .where((field) => field('created_at').isLessThan(randomDate))
            .sortDesc('created_at')
            .limit(1);

        const randomRecord = await new Promise((resolve, reject) => {
            selectRandomQuery.subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        }).catch((err) => { throw err; });

        return randomRecord[0].description;
    },
};
