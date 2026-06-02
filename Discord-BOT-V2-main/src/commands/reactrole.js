const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getDB } = require('../config/mongodb');

module.exports = {
    name: 'reactrole',
    async execute(interaction) {
        try {
            const ruolo = interaction.options.getRole('ruolo');
            const titolo = interaction.options.getString('titolo');
            const descrizione = interaction.options.getString('descrizione');

            const embed = new EmbedBuilder()
                .setTitle(titolo)
                .setDescription(descrizione)
                .setColor(0x5865F2);

            const button = new ButtonBuilder()
                .setCustomId(`reactrole_${ruolo.id}`)
                .setLabel(`Ottieni ${ruolo.name}`)
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            const message = await interaction.channel.send({ embeds: [embed], components: [row] });

            const db = getDB();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            await db.collection('reactroles').insertOne({
                messageId: message.id,
                channelId: interaction.channelId,
                roleId: ruolo.id,
                roleName: ruolo.name,
                expiresAt: expiresAt,
                createdAt: new Date()
            });

            await interaction.reply({ content: `✅ Messaggio reaction role creato! Scadrà tra 24 ore.`, ephemeral: true });
        } catch (error) {
            console.error('Error in reactrole command:', error);
            await interaction.reply({ content: "❌ Errore nel creare il reaction role!", ephemeral: true });
        }
    }
};
