const { EmbedBuilder } = require('discord.js');
const { caricaDati, salvaDati } = require('../utils/database');
const { getDB } = require('../config/mongodb');

module.exports = {
    name: 'eliminapulizia',
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

            if (!dati.famiglie[idRuolo] || dati.famiglie[idRuolo].totale < bottiglie) {
                return await interaction.reply({ content: "❌ Non è possibile rimuovere più bottiglie di quelle registrate!", ephemeral: true });
            }

            let prezzoRimosso = 0;
            const lastPulizia = await db.collection('history').findOne(
                { famiglia: idRuolo, type: 'pulizia' },
                { sort: { timestamp: -1 } }
            );

            if (lastPulizia) {
                prezzoRimosso = lastPulizia.prezzo;
                await db.collection('history').deleteOne({ _id: lastPulizia._id });
            }

            dati.famiglie[idRuolo].totale -= bottiglie;
            dati.famiglie[idRuolo].prezzoTotale -= prezzoRimosso;

            await salvaDati(dati);

            await db.collection('history').insertOne({
                type: 'eliminapulizia',
                famiglia: idRuolo,
                bottiglie: bottiglie,
                prezzo: prezzoRimosso,
                timestamp: new Date()
            });

            const now = new Date();
            const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            const embed = new EmbedBuilder()
                .setTitle("🗑️  PULIZIA ELIMINATA")
                .setDescription(`> Ultima pulizia rimossa per ${famiglia}\n\u200B`)
                .setColor(0xE74C3C)
                .addFields(
                    { name: "🍾 Bottiglie Rimosse", value: `\`\`\`${bottiglie.toLocaleString()}\`\`\``, inline: true },
                    { name: "💸 Prezzo Rimosso", value: `\`\`\`$${prezzoRimosso.toLocaleString()}\`\`\``, inline: true },
                    { name: "\u200B", value: "─────────────────────────", inline: false },
                    { name: "📊 Totale Famiglia", value: `**${dati.famiglie[idRuolo].totale.toLocaleString()}** bottiglie  •  **$${dati.famiglie[idRuolo].prezzoTotale.toLocaleString()}**`, inline: false }
                )
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
            console.error('Error in eliminapulizia command:', error);
            await interaction.reply({ content: "❌ Errore nel rimuovere la pulizia!", ephemeral: true });
        }
    }
};
