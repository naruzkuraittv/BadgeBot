const { SlashCommandBuilder } = require('discord.js');

function calculateNextSeed(currentSeed) {
    let a = (0x41C6 * (currentSeed & 0xFFFF) + ((currentSeed >> 16) * 0x4E6D)) & 0xFFFFFFFF;
    let b = (0x4E6D * (currentSeed & 0xFFFF) + ((a & 0xFFFF) * 65536) + 0x6073) & 0xFFFFFFFF;
    return b >>> 0;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findframe')
        .setDescription('Finds the frame number from initial to current seed')
        .addStringOption(option => 
            option.setName('initialseed')
                .setDescription('Enter the initial seed in hexadecimal')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('currentseed')
                .setDescription('Enter the current seed in hexadecimal')
                .setRequired(true)),
    async execute(interaction) {
        const initialSeedInput = interaction.options.getString('initialseed');
        const currentSeedInput = interaction.options.getString('currentseed');
        const initialSeed = parseInt(initialSeedInput, 16);
        const currentSeed = parseInt(currentSeedInput, 16);
        
        let frame = 0;
        let seed = initialSeed;
        const maxIterations = 1000000; // Set a maximum to prevent infinite loop

        while (seed !== currentSeed && frame < maxIterations) {
            seed = calculateNextSeed(seed);
            frame++;
        }

        if (seed === currentSeed) {
            await interaction.reply(`Found Match at Frame: ${frame}`);
        } else {
            await interaction.reply('No match found within the iteration limit.');
        }
    },
};
