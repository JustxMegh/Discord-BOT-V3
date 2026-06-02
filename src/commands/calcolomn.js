const { EmbedBuilder } = require('discord.js');
const { caricaDati } = require('../utils/database');

module.exports = {
    name: 'calcolomn',
    async execute(interaction) {
        try {
            const dati = await caricaDati();

            if (Object.keys(dati.famiglie).length === 0) {
                return await interaction.reply({ content: "⚠️ La classifica è vuota. Usa `/pulizia` per iniziare!", ephemeral: true });
            }

            let totaleBottiglie = 0;
            let totalePrezzoGlobale = 0;
            for (const info of Object.values(dati.famiglie)) {
                totaleBottiglie += info.totale;
                totalePrezzoGlobale += info.prezzoTotale;
            }

            const prezzoBase = totaleBottiglie * 1000;
            const differenza = prezzoBase - totalePrezzoGlobale;
            const valoreFinale = differenza * 0.30;

            const now = new Date();
            const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            const embed = new EmbedBuilder()
                .setTitle("💎  CALCOLO MERCATO NERO")
                .setDescription("> Riepilogo del calcolo per il valore MN attuale\n\u200B")
                .setColor(0x9B59B6)
                .addFields(
                    { name: "🍾 Totale Bottiglie", value: `\`\`\`${totaleBottiglie.toLocaleString()}\`\`\``, inline: true },
                    { name: "💵 Bottiglie × 1.000", value: `\`\`\`$${prezzoBase.toLocaleString()}\`\`\``, inline: true },
                    { name: "📋 Valore Classifica", value: `\`\`\`$${totalePrezzoGlobale.toLocaleString()}\`\`\``, inline: true },
                    { name: "\u200B", value: "─────────────────────────", inline: false },
                    { name: "📊 Differenza", value: `\`$${differenza.toLocaleString()}\``, inline: true },
                    { name: "✨ Valore MN (30%)", value: `**$${valoreFinale.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**`, inline: true }
                )
                .setFooter({ text: `Dark Alcol  •  ${dateStr} alle ${timeStr}`, iconURL: "https://i.imgur.com/uGRyIRO.png" });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in calcolomn command:', error);
            await interaction.reply({ content: "❌ Errore nel calcolare il valore MN!", ephemeral: true });
        }
    }
};
