const { getDB } = require('../config/mongodb');

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user, client) {
        // Ignore bot reactions
        if (user.bot) return;

        try {
            const db = getDB();
            const reactroleDoc = await db.collection('reactroles').findOne({ 
                messageId: reaction.message.id 
            });

            if (!reactroleDoc) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(reactroleDoc.roleId);

            if (!role) return;

            // Remove role from user
            await member.roles.remove(role);
        } catch (error) {
            console.error('Error in messageReactionRemove event:', error);
        }
    }
};
