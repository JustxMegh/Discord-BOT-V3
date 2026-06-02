const { EmbedBuilder } = require('discord.js');
const { salvaDati } = require('../utils/database');
const { getDB } = require('../config/mongodb');

module.exports = {
    name: 'resetclassifica',
    async execute(interaction) {
        try {
            const db = getDB();
            const datiVuoti = { famiglie: {} };
            await salvaDati(datiVuoti);
            await db.collection('history').deleteMany({});

            const embed = new EmbedBuilder()
                .setTitle("🔄  CLASSIFICA RESETTATA")
                .setDescription("> Tutti i dati della classifica sono stati cancellati.\n> La nuova stagione può iniziare con `/pulizia`.")
                .setColor(0xFF6B6B)
                .setFooter({ text: "Dark Alcol  •  Reset eseguito", iconURL: "https://i.imgur.com/uGRyIRO.png" });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error in resetclassifica command:', error);
            await interaction.reply({ content: "❌ Errore nel resettare la classifica!", ephemeral: true });
        }
    }
};
