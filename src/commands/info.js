const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'info',
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle("📖  GUIDA AI COMANDI")
                .setDescription("> Elenco completo di tutti i comandi disponibili, divisi per categoria.\n\u200B")
                .setColor(0x3498DB)
                .addFields(
                    // ── SEZIONE PULIZIE ──
                    {
                        name: "🧹  ─── GESTIONE PULIZIE ───",
                        value: "\u200B",
                        inline: false
                    },
                    {
                        name: "</pulizia:0>",
                        value: "Registra una nuova pulizia per una famiglia.\n> Parametri: `famiglia` (ruolo) • `bottiglie` (numero)",
                        inline: false
                    },
                    {
                        name: "</eliminapulizia:0>",
                        value: "Rimuove l'ultima pulizia registrata per una famiglia.\n> Parametri: `famiglia` (ruolo) • `bottiglie` (numero)",
                        inline: false
                    },

                    // ── SEZIONE CLASSIFICA ──
                    {
                        name: "\u200B\n🏆  ─── CLASSIFICA ───",
                        value: "\u200B",
                        inline: false
                    },
                    {
                        name: "</classifica:0>",
                        value: "Mostra la classifica di tutte le famiglie, ordinata per bottiglie.",
                        inline: false
                    },
                    {
                        name: "</resetclassifica:0>",
                        value: "⚠️ Azzera completamente tutti i dati della classifica. **IRREVERSIBILE.**",
                        inline: false
                    },

                    // ── SEZIONE MERCATO NERO ──
                    {
                        name: "\u200B\n💎  ─── MERCATO NERO ───",
                        value: "\u200B",
                        inline: false
                    },
                    {
                        name: "</calcolomn:0>",
                        value: "Calcola il valore MN con la formula: `(bott. × 1000 − valore totale) × 0.30`",
                        inline: false
                    },

                    // ── SEZIONE CONFIGURAZIONE ──
                    {
                        name: "\u200B\n⚙️  ─── CONFIGURAZIONE ───",
                        value: "\u200B",
                        inline: false
                    },
                    {
                        name: "</logpulizia:0>",
                        value: "Imposta il canale dove vengono inviati i log delle pulizie.",
                        inline: false
                    },
                    {
                        name: "</logclassifica:0>",
                        value: "Imposta il canale dove vengono inviati i log della classifica.",
                        inline: false
                    },
                    {
                        name: "</setbackupchannel:0>",
                        value: "Imposta il canale per i backup automatici.",
                        inline: false
                    },
                    {
                        name: "</backup:0>",
                        value: "Esegue manualmente un backup dei dati.",
                        inline: false
                    },
                    {
                        name: "</reactrole:0>",
                        value: "Crea un bottone per assegnare un ruolo automaticamente (dura 24 ore).",
                        inline: false
                    }
                )
                .setFooter({ text: "Dark Alcol Bot  •  Tutti i comandi richiedono permessi di Amministratore", iconURL: "https://i.imgur.com/uGRyIRO.png" });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error in info command:', error);
            await interaction.reply({ content: "❌ Errore nel mostrare le informazioni!", ephemeral: true });
        }
    }
};
