/**
 * @description App for playing around with Jexia, Main Entry point
 * @file /src/index.js
 * @author Henco Smith 2020
 */

/**
 * Packages
 */
// NLP processing
const { dockStart } = require('@nlpjs/basic');


module.exports = {
    // https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/01.basic
    getBot: async () => {
        const dock = await dockStart({ use: ['Basic'] });
        const nlp = dock.get('nlp');

        nlp.addLanguage('en');
        // Adds the utterances and intents for the NLP
        nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
        nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
        nlp.addDocument('en', 'okay see you later', 'greetings.bye');
        nlp.addDocument('en', 'bye for now', 'greetings.bye');
        nlp.addDocument('en', 'i must go', 'greetings.bye');
        nlp.addDocument('en', 'cheers', 'greetings.bye');
        nlp.addDocument('en', 'hello', 'greetings.hello');
        nlp.addDocument('en', 'hi', 'greetings.hello');
        nlp.addDocument('en', 'hey', 'greetings.hello');
        nlp.addDocument('en', 'howdy', 'greetings.hello');
        nlp.addDocument('en', 'who are you', 'questions.identity');
        nlp.addDocument('en', 'how old are you', 'questions.age');
        nlp.addDocument('en', 'what is your age', 'questions.age');

        // Train also the NLG
        nlp.addAnswer('en', 'greetings.bye', 'Till next time');
        nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
        nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
        nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
        nlp.addAnswer('en', 'questions.identity', 'A dumpster of a bot! Thanks for reminding me');
        nlp.addAnswer('en', 'questions.identity', 'Some random scrap metal');
        nlp.addAnswer('en', 'questions.age', "I don't think age matters");
        nlp.addAnswer('en', 'questions.age', 'Old enough');

        await nlp.train();

        return nlp;
    },
};
