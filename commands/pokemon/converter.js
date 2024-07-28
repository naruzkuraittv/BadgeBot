const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Converts between hexadecimal and decimal')
        .addStringOption(option => 
            option.setName('hex2decimal')
                .setDescription('Convert hexadecimal to decimal')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('decimal2hex')
                .setDescription('Convert decimal to hexadecimal')
                .setRequired(false)),
    async execute(interaction) {
        const hexInput = interaction.options.getString('hex2decimal');
        const decimalInput = interaction.options.getString('decimal2hex');

        if (hexInput) {
            const decimalValue = parseInt(hexInput, 16);
            if (!isNaN(decimalValue)) {
                await interaction.reply(`Decimal: ${decimalValue}`);
            } else {
                await interaction.reply('Invalid hexadecimal input.');
            }
        } else if (decimalInput) {
            const hexValue = parseInt(decimalInput, 10).toString(16).toUpperCase();
            if (!isNaN(parseInt(decimalInput, 10))) {
                await interaction.reply(`Hexadecimal: ${hexValue}`);
            } else {
                await interaction.reply('Invalid decimal input.');
            }
        } else {
            await interaction.reply('No input provided.');
        }
    },
};
