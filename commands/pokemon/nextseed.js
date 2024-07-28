const { SlashCommandBuilder } = require('discord.js');

function calculateNextSeed(currentSeed) {
    let a = (0x41C6 * (currentSeed & 0xFFFF) + ((currentSeed >> 16) * 0x4E6D)) & 0xFFFFFFFF;
    let b = (0x4E6D * (currentSeed & 0xFFFF) + ((a & 0xFFFF) * 65536) + 0x6073) & 0xFFFFFFFF;
    return b >>> 0; // Ensure the result is an unsigned 32-bit integer
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextseed')
        .setDescription('Calculates the next seed value')
        .addStringOption(option => 
            option.setName('currentseed')
                .setDescription('Enter the current seed in hexadecimal')
                .setRequired(true)),
    async execute(interaction) {
        const currentSeedInput = interaction.options.getString('currentseed');
        const currentSeed = parseInt(currentSeedInput, 16);
        const nextSeedValue = calculateNextSeed(currentSeed);

        await interaction.reply(`Next Seed: ${nextSeedValue.toString(16).toUpperCase().padStart(8, '0')}`);
    },
};
