// events/guildMemberAdd.js
const { EmbedBuilder } = require('discord.js');

// ─── CONFIGURAZIONE BENVENUTO ────────────────────────────────────────────────
const CANALE_BENVENUTO_ID = "1490564270599966810";   // canale fisso benvenuto
const CANALE_RICHIESTE_ID = "1464003262523900140";   // canale per le richieste

// 👇 Sostituisci con il link della tua GIF
const GIF_BENVENUTO = "INSERISCI_QUI_IL_LINK_DELLA_TUA_GIF";
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        try {
            const channel = member.guild.channels.cache.get(CANALE_BENVENUTO_ID);
            if (!channel) {
                console.warn(`⚠️ Canale benvenuto ${CANALE_BENVENUTO_ID} non trovato.`);
                return;
            }

            const now = new Date();
            const dateStr = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x1A1A2E)
                .setTitle("🍾  BENVENUTO NEL DARK ALCOL")
                .setDescription(
                    `> Bentornato, ${member}!\n\n` +
                    `Sei entrato a far parte del **Dark Alcol**.\n` +
                    `Per richiedere la tua sezione, vai in <#${CANALE_RICHIESTE_ID}> e segui le istruzioni.\n\n` +
                    `**Buona fortuna e buon lavoro.**`
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setImage(GIF_BENVENUTO)
                .setFooter({
                    text: `Dark Alcol  •  ${dateStr}  •  Membro #${member.guild.memberCount}`,
                    iconURL: "https://i.imgur.com/uGRyIRO.png"
                });

            await channel.send({ content: `${member}`, embeds: [welcomeEmbed] });
        } catch (error) {
            console.error('Errore nell\'evento guildMemberAdd:', error);
        }
    },
};
