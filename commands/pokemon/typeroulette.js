const { SlashCommandBuilder } = require('discord.js');

function random_type() {
    const types = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
    return types[Math.floor(Math.random() * types.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('typeroulette')  
        .setDescription('Responds with a random pokemon type'),
    async execute(interaction) {
        if (Math.random() < 0.03) {  
            await interaction.reply('shiny ' + random_type());
        } else {
            await interaction.reply(random_type());
        }
    },
};
