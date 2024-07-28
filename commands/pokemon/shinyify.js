const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shinyify')
        .setDescription('Calculates the shiny SID from TID and PID')
        .addIntegerOption(option => 
            option.setName('tid')
                .setDescription('The Trainer ID (TID) as a decimal number')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('pid')
                .setDescription('The Pokémon ID (PID) as a hexadecimal number')
                .setRequired(true)),
    async execute(interaction) {
        const tid = interaction.options.getInteger('tid');
        const pid = interaction.options.getString('pid');

        // Convert TID to Hexadecimal
        const tidHex = tid.toString(16).toUpperCase();

        // Split PID into two halves
        const pidFirstHalf = parseInt(pid.substring(0, 4), 16);
        const pidSecondHalf = parseInt(pid.substring(4, 8), 16);

        // Perform XOR operation
        const result = parseInt(tidHex, 16) ^ pidFirstHalf ^ pidSecondHalf;

        // Convert result back to Decimal
        const resultDecimal = result.toString();

        // Reply with the result
        await interaction.reply(`Expected shiny SID:\n\`\`\`${resultDecimal}\`\`\``);
    },
};
