const { salvaConfig } = require('../utils/database');

module.exports = {
    name: 'setbackupchannel',
    async execute(interaction) {
        const canale = interaction.options.getChannel('canale');
        await salvaConfig('backup_channel', canale.id);
        await interaction.reply({ content: `✅ Canale backup impostato a ${canale}`, ephemeral: true });
    }
};
