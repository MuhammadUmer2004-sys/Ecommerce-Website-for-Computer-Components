// utils/scheduler.js
const cron = require('node-cron');
const {cleanupExpiredTokens} = require('../models/Token');

const scheduleTokenCleanup = () => {
    cron.schedule('0 * * * *', async () => { // Runs every hour
        console.log('Running token cleanup task...');
        try {
            await cleanupExpiredTokens();
            console.log('Expired tokens cleaned up.');
        } catch (error) {
            console.error('Error during cleanup:', error.message);
        }
    });
};

module.exports = { scheduleTokenCleanup };
