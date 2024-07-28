const { SlashCommandBuilder } = require('discord.js');

function calculateNextSeed(currentSeed) {
    let a = (0x41C6 * (currentSeed & 0xFFFF) + ((currentSeed >> 16) * 0x4E6D)) & 0xFFFFFFFF;
    let b = (0x4E6D * (currentSeed & 0xFFFF) + ((a & 0xFFFF) * 65536) + 0x6073) & 0xFFFFFFFF;
    return b >>> 0;
}

function formatSeed(frame, seed, isTarget) {
    return `Seed ${frame}: ${seed.toString(16).toUpperCase().padStart(8, '0')}${isTarget ? ' ← Target' : ''}`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advanceseed')
        .setDescription('Calculates a range of seeds')
        .addStringOption(option => 
            option.setName('seed')
                .setDescription('Enter your current seed in hexadecimal')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('target')
                .setDescription('Enter your target frame')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('plus')
                .setDescription('Number of seeds to calculate after the target frame')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minus')
                .setDescription('Number of seeds to calculate before the target frame')
                .setRequired(true)),
    async execute(interaction) {
        const seedInput = interaction.options.getString('seed');
        const target = interaction.options.getInteger('target');
        const plus = interaction.options.getInteger('plus');
        const minus = interaction.options.getInteger('minus');
        let currentSeed = parseInt(seedInput, 16);
        let seeds = [];

        for (let frame = 1; frame <= target + plus; frame++) {
            currentSeed = calculateNextSeed(currentSeed);
            if (frame >= target - minus) {
                seeds.push(formatSeed(frame, currentSeed, frame === target));
            }
        }

        await interaction.reply(`Seed Range:\n${seeds.join('\n')}`);
    },
};
