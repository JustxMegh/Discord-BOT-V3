const { EmbedBuilder } = require('discord.js');
const { caricaDati } = require('../utils/database');
const { getDB } = require('../config/mongodb');

const MEDAGLIE = ['🥇', '🥈', '🥉'];

module.exports = {
    name: 'classifica',
    async execute(interaction, discordClient) {
        try {
            const db = getDB();
            const dati = await caricaDati();

            if (Object.keys(dati.famiglie).length === 0) {
                return await interaction.reply({ content: "⚠️ La classifica è attualmente vuota. Usa `/pulizia` per iniziare!", ephemeral: true });
            }

            const classificaOrdinata = Object.entries(dati.famiglie).sort((a, b) => b[1].totale - a[1].totale);

            let testoClassifica = "";
            let totaleGeneraleBottiglie = 0;
            let totalePrezzoGlobale = 0;

            for (let i = 0; i < classificaOrdinata.length; i++) {
                const [idRuolo, info] = classificaOrdinata[i];
                totaleGeneraleBottiglie += info.totale;
                totalePrezzoGlobale += info.prezzoTotale;

                const medaglia = MEDAGLIE[i] ?? `**${i + 1}°**`;
                testoClassifica += `${medaglia}  <@&${idRuolo}>\n`;
                testoClassifica += `┗  \`${info.totale.toLocaleString()}\` bott.  •  \`$${info.prezzoTotale.toLocaleString()}\`\n\n`;
            }

            const now = new Date();
            const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            const embed = new EmbedBuilder()
                .setTitle("🏆  CLASSIFICA BOTTIGLIE")
                .setDescription(testoClassifica)
                .setColor(0xF1C40F)
                .addFields(
                    { name: "─────────────────────────", value: "\u200B", inline: false },
                    { name: "🍾 Bottiglie Totali", value: `\`${totaleGeneraleBottiglie.toLocaleString()}\``, inline: true },
                    { name: "💰 Valore Globale", value: `\`$${totalePrezzoGlobale.toLocaleString()}\``, inline: true }
                )
                .setFooter({ text: `Dark Alcol  •  ${dateStr} alle ${timeStr}`, iconURL: "https://i.imgur.com/uGRyIRO.png" });

            await interaction.reply({ embeds: [embed] });

            const configDoc = await db.collection('config').findOne({ key: 'classifica_logs_channel' });
            if (configDoc && configDoc.value) {
                try {
                    const logChannel = await discordClient.channels.fetch(configDoc.value);
                    if (logChannel) await logChannel.send({ embeds: [embed] });
                } catch (error) {
                    console.error('Errore nell\'invio al canale log:', error);
                }
            }
        } catch (error) {
            console.error('Error in classifica command:', error);
            await interaction.reply({ content: "❌ Errore nel mostrare la classifica!", ephemeral: true });
        }
    }
};
