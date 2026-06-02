const { EmbedBuilder } = require('discord.js');
const { caricaDati, salvaDati } = require('../utils/database');
const { getDB } = require('../config/mongodb');

module.exports = {
    name: 'pulizia',
    async execute(interaction, discordClient) {
        const famiglia = interaction.options.getRole('famiglia');
        const bottiglie = interaction.options.getInteger('bottiglie');

        if (bottiglie <= 0) {
            return await interaction.reply({ content: "❌ Il numero di bottiglie deve essere maggiore di zero!", ephemeral: true });
        }

        try {
            const db = getDB();
            const dati = await caricaDati();
            const idRuolo = famiglia.id;
            const nomeRuolo = famiglia.name;

            if (!dati.famiglie[idRuolo]) {
                dati.famiglie[idRuolo] = { nome: nomeRuolo, totale: 0, prezzoTotale: 0 };
            } else {
                dati.famiglie[idRuolo].nome = nomeRuolo;
            }

            const pricePerBottle = bottiglie < 30000 ? 600 : 750;
            const prezzoQuestaPulizia = bottiglie * pricePerBottle;

            dati.famiglie[idRuolo].totale += bottiglie;
            dati.famiglie[idRuolo].prezzoTotale += prezzoQuestaPulizia;

            await salvaDati(dati);

            await db.collection('history').insertOne({
                type: 'pulizia',
                famiglia: idRuolo,
                bottiglie: bottiglie,
                prezzo: prezzoQuestaPulizia,
                timestamp: new Date()
            });

            const now = new Date();
            const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            const embed = new EmbedBuilder()
                .setTitle("🧹  PULIZIA REGISTRATA")
                .setDescription(`> Pulizia eseguita con successo per ${famiglia}\n\u200B`)
                .setColor(0x2ECC71)
                .setThumbnail("https://i.imgur.com/uGRyIRO.png")
                .addFields(
                    { name: "🍾 Bottiglie Aggiunte", value: `\`\`\`${bottiglie.toLocaleString()}\`\`\``, inline: true },
                    { name: "💵 Prezzo Unitario", value: `\`\`\`$${pricePerBottle}\`\`\``, inline: true },
                    { name: "💰 Totale Pulizia", value: `\`\`\`$${prezzoQuestaPulizia.toLocaleString()}\`\`\``, inline: true },
                    { name: "\u200B", value: "─────────────────────────", inline: false },
                    { name: "📊 Totale Famiglia", value: `**${dati.famiglie[idRuolo].totale.toLocaleString()}** bottiglie  •  **$${dati.famiglie[idRuolo].prezzoTotale.toLocaleString()}**`, inline: false }
                )
                .setImage("https://i.pinimg.com/originals/ff/82/64/ff826461651840d930177cf874af2092.gif")
                .setFooter({ text: `Dark Alcol  •  ${dateStr} alle ${timeStr}`, iconURL: "https://i.imgur.com/uGRyIRO.png" });

            await interaction.reply({ embeds: [embed] });

            const configDoc = await db.collection('config').findOne({ key: 'pulizia_logs_channel' });
            if (configDoc && configDoc.value) {
                try {
                    const logChannel = await discordClient.channels.fetch(configDoc.value);
                    if (logChannel) await logChannel.send({ embeds: [embed] });
                } catch (error) {
                    console.error('Errore nell\'invio al canale log:', error);
                }
            }
        } catch (error) {
            console.error('Error in pulizia command:', error);
            await interaction.reply({ content: "❌ Errore nel registrare la pulizia!", ephemeral: true });
        }
    }
};
