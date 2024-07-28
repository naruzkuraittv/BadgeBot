const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, clientId } = require('./config.json');

const commands = [];
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();

function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            let shouldLoad = true;
            const stream = fs.createReadStream(filePath);
            const reader = readline.createInterface({ input: stream });

            reader.on('line', (line) => {
                if (line.startsWith('//skip loading')) {
                    console.log(`Skipping command load for: ${file}`);
                    shouldLoad = false;
                }
            });

            reader.on('close', () => {
                stream.destroy();
                if (shouldLoad) {
                    const command = require(filePath);
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                    console.log(`Loaded command: ${command.data.name}`);
                }
            });

            reader.on('error', (error) => {
                console.error(`Error reading file ${file}:`, error);
            });
        }
    }
}

async function clearAndRegisterCommands() {
    const guilds = await client.guilds.fetch();
    const rest = new REST({ version: '9' }).setToken(token);

    for (const guild of guilds.values()) {
        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: [] });
            await rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands });
        } catch (error) {
            console.error(`Error handling guild ${guild.id}:`, error);
        }
    }
}

client.once(Events.ClientReady, async () => {
    console.log('Client ready. Loading commands...');
    loadCommands(path.join(__dirname, 'commands'));
    console.log('Commands loaded. Clearing and registering commands...');
    await clearAndRegisterCommands();
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

const Gymbadges_roles = [
    "1244399612446511214", "1244399608529027163", "1244399612899627009", "1244399610353680526", 
    "1244399606377349301", "1244399609024090205", "1244399604577996953", "1244399611825754172", 
    "1244399609405771869", "1244399607853613181", "1244399611121238086", "1244399602216734835", 
    "1244399614468165705", "1244399607077666958", "1244399602652942368", "1244399603403587696", 
    "1244399614002593903", "1244399605467316255"
];
const Elite_challenger = "1258198493537898537";
const Elite_victor = "1265341660028731555";
const Champion_Challenger = "1258198593634963577";

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache.map(role => role.id);
    const newRoles = newMember.roles.cache.map(role => role.id);

    const hasAllRoles = Gymbadges_roles.every(roleId => newRoles.includes(roleId));
    const gainedAllBadgeRoles = !Gymbadges_roles.every(roleId => oldRoles.includes(roleId)) && hasAllRoles;

    if (gainedAllBadgeRoles) {
        const eliteChallengerRole = newMember.guild.roles.cache.get(Elite_challenger);
        if (eliteChallengerRole && !newRoles.includes(Elite_challenger)) {
            await newMember.roles.add(eliteChallengerRole);
            console.log(`Role ${eliteChallengerRole.name} added to user ${newMember.displayName}`);
        }
    }

    const hadEliteVictor = oldRoles.includes(Elite_victor);
    const hasEliteVictor = newRoles.includes(Elite_victor);
    const gainedEliteVictor = !hadEliteVictor && hasEliteVictor;

    if (gainedEliteVictor) {
        const championChallengerRole = newMember.guild.roles.cache.get(Champion_Challenger);
        if (championChallengerRole && !newRoles.includes(Champion_Challenger)) {
            await newMember.roles.add(championChallengerRole);
            console.log(`Role ${championChallengerRole.name} added to user ${newMember.displayName}`);
        }
    }
});

client.login(token);
