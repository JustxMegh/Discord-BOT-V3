const { salvaConfig } = require('../utils/database');

module.exports = {
    name: 'setbenvenuto',
    async execute(interaction) {
        const canale = interaction.options.getChannel('canale');
        await salvaConfig('benvenuto_channel', canale.id);
        await interaction.reply({ content: `✅ Canale benvenuto impostato a ${canale}`, ephemeral: true });
    }
};
