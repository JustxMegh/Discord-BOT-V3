const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

function buildCommands() {
    return [
        new SlashCommandBuilder()
            .setName('pulizia')
            .setDescription('Registra la pulizia e aggiunge le bottiglie a una famiglia.')
            .addRoleOption(option => 
                option.setName('famiglia').setDescription('Seleziona il ruolo della famiglia su Discord').setRequired(true))
            .addIntegerOption(option => 
                option.setName('bottiglie').setDescription('Inserisci il numero di bottiglie raccolte').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('eliminapulizia')
            .setDescription('Elimina l\'ultima pulizia registrata per una famiglia.')
            .addRoleOption(option => 
                option.setName('famiglia').setDescription('Seleziona il ruolo della famiglia').setRequired(true))
            .addIntegerOption(option => 
                option.setName('bottiglie').setDescription('Numero di bottiglie da rimuovere').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('classifica')
            .setDescription('Mostra la classifica delle bottiglie in ordine decrescente.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('calcolomn')
            .setDescription('Calcola il valore MN: (bottiglie × 1000 - valore totale) × 0.30')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('logpulizia')
            .setDescription('Imposta il canale per i log delle pulizie.')
            .addChannelOption(option =>
                option.setName('canale').setDescription('Seleziona il canale').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('logclassifica')
            .setDescription('Imposta il canale per i log della classifica.')
            .addChannelOption(option =>
                option.setName('canale').setDescription('Seleziona il canale').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('setbackupchannel')
            .setDescription('Imposta il canale per i backup automatici.')
            .addChannelOption(option =>
                option.setName('canale').setDescription('Seleziona il canale').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('backup')
            .setDescription('Esegui un backup manuale adesso.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('resetclassifica')
            .setDescription('Azzera completamente tutti i dati della classifica.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('reactrole')
            .setDescription('Crea un messaggio con reazione per ricevere un ruolo temporaneo.')
            .addRoleOption(option =>
                option.setName('ruolo').setDescription('Seleziona il ruolo da assegnare').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        new SlashCommandBuilder()
            .setName('info')
            .setDescription('Mostra le informazioni su tutti i comandi disponibili.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ].map(command => command.toJSON());
}

module.exports = { buildCommands };
