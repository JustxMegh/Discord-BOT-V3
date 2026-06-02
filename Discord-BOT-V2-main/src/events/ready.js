const { ActivityType } = require('discord.js');
const { startBackupSchedule } = require('../functions/backup');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Bot logged in as ${client.user.tag}`);
        
        // Set bot status
        client.user.setActivity('/pulizia', { type: ActivityType.Listening });
        
        // Start the backup schedule
        startBackupSchedule(client);
    }
};
