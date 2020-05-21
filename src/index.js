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
// Jexia
const { jexiaClient, dataOperations, UMSModule } = require('jexia-sdk-js/node');


/**
 * Program entry
 */
(() => {
    console.info(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Program Start`));

    /**
     * Inits
     */
    const dataOps = dataOperations();
    const ums = new UMSModule();

    const projectID = process.env.JEXIA_PROJECT_ID;

    console.info(chalk.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Init ID '${projectID}'`));
    jexiaClient().init({
        projectID,
    }, dataOps, ums);

    // TODO: jexia
})();
