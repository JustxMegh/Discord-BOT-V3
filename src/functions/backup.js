const { EmbedBuilder } = require('discord.js');
const { caricaDati, salvaDati } = require('../utils/database');
const { getDB } = require('../config/mongodb');

let backupInterval;

async function eseguiBackup(client) {
    try {
        const db = getDB();
        const dati = await caricaDati();

        // Create backup embed
        const embed = new EmbedBuilder()
            .setTitle("💾 Backup Automatico")
            .setDescription(`Backup eseguito alle ${new Date().toLocaleString('it-IT')}`)
            .setColor(0x00FF00);

        // Add family data to embed
        if (dati.famiglie && Object.keys(dati.famiglie).length > 0) {
            let familieText = '';
            for (const [familyName, familyData] of Object.entries(dati.famiglie)) {
                familieText += `**${familyName}**: ${familyData.bottiglie} bottiglie - €${familyData.valore}\n`;
            }
            embed.addFields({ name: "Famiglie", value: familieText || "Nessuna famiglia registrata" });
        } else {
            embed.addFields({ name: "Famiglie", value: "Nessuna famiglia registrata" });
        }

        // Save backup to database
        await db.collection('backups').insertOne({
            data: dati,
            timestamp: new Date(),
            createdAt: new Date()
        });

        // Keep only the last backup (delete older ones)
        const backups = await db.collection('backups').find().sort({ timestamp: -1 }).toArray();
        if (backups.length > 1) {
            const oldBackups = backups.slice(1);
            for (const backup of oldBackups) {
                await db.collection('backups').deleteOne({ _id: backup._id });
            }
        }

        // Send backup to configured channel
        const backupChannelId = await db.collection('config').findOne({ key: 'backup_channel' });
        if (backupChannelId) {
            const channel = await client.channels.fetch(backupChannelId.value);
            if (channel) {
                await channel.send({ embeds: [embed] });
            }
        }

        console.log('✅ Backup eseguito con successo');
    } catch (error) {
        console.error('Error executing backup:', error);
    }
}

function startBackupSchedule(client) {
    // Execute backup immediately on start
    eseguiBackup(client);

    // Then schedule it every 24 hours
    backupInterval = setInterval(() => {
        eseguiBackup(client);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    console.log('✅ Backup schedule started (every 24 hours)');
}

function stopBackupSchedule() {
    if (backupInterval) {
        clearInterval(backupInterval);
        console.log('⏹️ Backup schedule stopped');
    }
}

module.exports = {
    eseguiBackup,
    startBackupSchedule,
    stopBackupSchedule
};
