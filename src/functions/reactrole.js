const { getDB } = require('../config/mongodb');

async function cleanupExpiredReactroles(client) {
    try {
        const db = getDB();
        const now = new Date();

        // Find all expired reaction roles
        const expiredReactroles = await db.collection('reactroles').find({
            expiresAt: { $lt: now }
        }).toArray();

        for (const reactrole of expiredReactroles) {
            try {
                // Try to delete the message
                const channel = await client.channels.fetch(reactrole.channelId);
                if (channel) {
                    const message = await channel.messages.fetch(reactrole.messageId);
                    if (message) {
                        await message.delete();
                    }
                }
            } catch (error) {
                console.error(`Error deleting expired reactrole message:`, error);
            }

            // Delete from database
            await db.collection('reactroles').deleteOne({ _id: reactrole._id });
        }

        if (expiredReactroles.length > 0) {
            console.log(`✅ Cleaned up ${expiredReactroles.length} expired reaction roles`);
        }
    } catch (error) {
        console.error('Error in cleanupExpiredReactroles:', error);
    }
}

module.exports = {
    cleanupExpiredReactroles
};
