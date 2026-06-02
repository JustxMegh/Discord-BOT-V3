const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { connectMongoDB } = require('./config/mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Initialize commands collection
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command);
        console.log(`✅ Loaded command: ${command.name}`);
    } else {
        console.warn(`⚠️ Command at ${filePath} is missing name or execute property`);
    }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
        console.log(`✅ Loaded event (once): ${event.name}`);
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
        console.log(`✅ Loaded event: ${event.name}`);
    }
}

// Connect to MongoDB and start bot
async function start() {
    try {
        await connectMongoDB();
        console.log('✅ Connected to MongoDB');
        
        await client.login(process.env.DISCORD_TOKEN);
        console.log('✅ Bot logged in successfully');
    } catch (error) {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('⏹️ Shutting down gracefully...');
    await client.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('⏹️ Shutting down gracefully...');
    await client.destroy();
    process.exit(0);
});
