const { getDB } = require('../config/mongodb');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        // Ignore bot reactions
        if (user.bot) return;

        try {
            const db = getDB();
            const reactroleDoc = await db.collection('reactroles').findOne({ 
                messageId: reaction.message.id 
            });

            if (!reactroleDoc) return;

            // Check if reaction role has expired
            if (new Date() > reactroleDoc.expiresAt) {
                await db.collection('reactroles').deleteOne({ _id: reactroleDoc._id });
                return;
            }

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(reactroleDoc.roleId);

            if (!role) {
                await db.collection('reactroles').deleteOne({ _id: reactroleDoc._id });
                return;
            }

            // Add role to user
            await member.roles.add(role);
            
            // Remove the reaction
            await reaction.users.remove(user.id);
        } catch (error) {
            console.error('Error in messageReactionAdd event:', error);
        }
    }
};
