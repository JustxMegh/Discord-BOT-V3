const { eseguiBackup } = require('../functions/backup');

module.exports = {
    name: 'backup',
    async execute(interaction, discordClient) {
        await interaction.deferReply({ ephemeral: true });
        await eseguiBackup(discordClient);
        await interaction.editReply({ content: "✅ Backup eseguito manualmente!" });
    }
};
