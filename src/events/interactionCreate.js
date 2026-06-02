const { getDB } = require('../config/mongodb');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                await interaction.reply({ content: '❌ Errore nell\'esecuzione del comando!', ephemeral: true });
            }
        }

        // Handle button interactions
        if (interaction.isButton()) {
            if (interaction.customId.startsWith('reactrole_')) {
                try {
                    const roleId = interaction.customId.replace('reactrole_', '');
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        return await interaction.reply({ content: '❌ Il ruolo non esiste più!', ephemeral: true });
                    }

                    const db = getDB();
                    const reactroleDoc = await db.collection('reactroles').findOne({ roleId: roleId });

                    if (!reactroleDoc) {
                        return await interaction.reply({ content: '❌ Questo reaction role è scaduto!', ephemeral: true });
                    }

                    if (new Date() > reactroleDoc.expiresAt) {
                        await db.collection('reactroles').deleteOne({ _id: reactroleDoc._id });
                        return await interaction.reply({ content: '❌ Questo reaction role è scaduto!', ephemeral: true });
                    }

                    if (interaction.member.roles.has(roleId)) {
                        await interaction.member.roles.remove(role);
                        await interaction.reply({ content: `✅ Ruolo ${role.name} rimosso!`, ephemeral: true });
                    } else {
                        await interaction.member.roles.add(role);
                        await interaction.reply({ content: `✅ Ruolo ${role.name} assegnato!`, ephemeral: true });
                    }
                } catch (error) {
                    console.error('Error handling reactrole button:', error);
                    await interaction.reply({ content: '❌ Errore nell\'assegnare il ruolo!', ephemeral: true });
                }
            }
        }
    }
};
