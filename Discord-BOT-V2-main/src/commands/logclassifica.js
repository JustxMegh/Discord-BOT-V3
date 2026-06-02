const { salvaConfig } = require('../utils/database');

module.exports = {
    name: 'logclassifica',
    async execute(interaction) {
        const canale = interaction.options.getChannel('canale');
        await salvaConfig('classifica_logs_channel', canale.id);
        await interaction.reply({ content: `✅ Canale log classifica impostato a ${canale}`, ephemeral: true });
    }
};
