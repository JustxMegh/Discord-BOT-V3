const { salvaConfig } = require('../utils/database');

module.exports = {
    name: 'logpulizia',
    async execute(interaction) {
        const canale = interaction.options.getChannel('canale');
        await salvaConfig('pulizia_logs_channel', canale.id);
        await interaction.reply({ content: `✅ Canale log pulizie impostato a ${canale}`, ephemeral: true });
    }
};
