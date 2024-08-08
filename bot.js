const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, clientId } = require('./config.json');

const commands = [];
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
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

const processingMembers = new Set();

system = ["gymleadrer_role","gymbadge_role"];
const normal = ["1244399627709583411","1244399612446511214"];
const fire = ["1244399622600790037","1244399608529027163"];
const water = ["1244399628758286398","1244399612899627009"];
const grass = ["1244399624433700985","1244399610353680526"];
const electric = ["1244399620537192560","1244399606377349301"];
const ice = ["1244399623112626297","1244399609024090205"];
const fighting = ["1244399618855403542","1244399604577996953"];
const poison = ["1244399626250096820","1244399611825754172"];
const ground = ["1244399623657881653","1244399609405771869"];
const flying = ["1244399621812518982","1244399607853613181"];
const psychic = ["1244399625138343998","1244399611121238086"];
const bug = ["1244399616322043905","1244399602216734835"];
const rock = ["1244399630599458867","1244399614468165705"];
const ghost = ["1244399620994633919","1244399607077666958"];
const dragon = ["1244399617563689122","1244399602652942368"];
const dark = ["1244399618461139005","1244399603403587696"];
const steel = ["1244399629488095243","1244399614002593903"];
const fairy = ["1244399619631218831","1244399605467316255"];

const types = ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
const Gymleader_roles = [normal[0],fire[0],water[0],grass[0],electric[0],ice[0],fighting[0],poison[0],ground[0],flying[0],psychic[0],bug[0],rock[0],ghost[0],dragon[0],dark[0],steel[0],fairy[0]];
const Gymbadges_roles = [normal[1],fire[1],water[1],grass[1],electric[1],ice[1],fighting[1],poison[1],ground[1],flying[1],psychic[1],bug[1],rock[1],ghost[1],dragon[1],dark[1],steel[1],fairy[1]];

const Elite_challenger = "1258198493537898537";
const Elite_Victor = "1265341660028731555";
const Champion_Challenger = "1258198593634963577";
const system = ["Ewins:0", "Ewins:1", "Ewins:2", "Ewins:3"];
const E_Wins = ["1270937713851240549","1270937800442777622","1270938132078002207","1270937897108766771", Elite_Victor];

function HasAllBadges(member) {
    return Gymbadges_roles.every(role => member.roles.cache.has(role));
}

function handleE4_wins(member, role) {
    const roleIndex = E_Wins.indexOf(role.id);
    for (let i = 0; i < E_Wins.length; i++) {
        if (i !== roleIndex) {
            member.roles.remove(E_Wins[i]);
        }
    }
    if (role.id === Elite_Victor) {
        member.roles.add(Champion_Challenger);
        member.roles.remove(Elite_challenger);
    } else {
        member.roles.remove(Champion_Challenger);
        if (HasAllBadges(member)) {
            member.roles.add(Elite_challenger);
            member.roles.add(E_Wins[0]);
        }
    }
}

function handleRoles(member, role) {
    if (Gymbadges_roles.includes(role.id)) {
        if (HasAllBadges(member)) {
            member.roles.add(Elite_challenger);
        } else {
            member.roles.remove(Elite_challenger);
            member.roles.remove(Champion_Challenger);
            E_Wins.forEach(eliteRole => member.roles.remove(eliteRole));
            return;
        }
    }
    if (member.roles.cache.has(Elite_challenger)) {
        handleE4_wins(member, role);
    }
}

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if (processingMembers.has(newMember.id)) return;
    processingMembers.add(newMember.id);

    try {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

        if (removedRoles.size > 0) {
            removedRoles.forEach(role => {
                if (role.id === Elite_challenger) {
                    if (HasAllBadges(newMember)) {
                        newMember.roles.add(Elite_challenger);
                    } else {
                        newMember.roles.remove(Champion_Challenger);
                        E_Wins.forEach(eliteRole => newMember.roles.remove(eliteRole));
                    }
                }
                if (role.id === Elite_Victor) {
                    if (HasAllBadges(newMember)) {
                        newMember.roles.add(Elite_challenger);
                        newMember.roles.add(E_Wins[0]);
                        for (let i = 1; i < E_Wins.length; i++) {
                            newMember.roles.remove(E_Wins[i]);
                        }
                    } else {
                        newMember.roles.remove(Champion_Challenger);
                        E_Wins.forEach(eliteRole => newMember.roles.remove(eliteRole));
                    }
                }
                if (Gymbadges_roles.includes(role.id)) {
                    if (!HasAllBadges(newMember)) {
                        newMember.roles.remove(Elite_challenger);
                        newMember.roles.remove(Champion_Challenger);
                        E_Wins.forEach(eliteRole => newMember.roles.remove(eliteRole));
                    }
                }
                handleRoles(newMember, role);
            });
        }

        if (addedRoles.size > 0) {
            addedRoles.forEach(role => handleRoles(newMember, role));
        }

        if (HasAllBadges(newMember) && !oldMember.roles.cache.has(Elite_challenger) && newMember.roles.cache.has(Elite_challenger)) {
            newMember.roles.add(Elite_challenger);
            newMember.roles.add(E_Wins[0]);
            for (let i = 1; i < E_Wins.length; i++) {
                newMember.roles.remove(E_Wins[i]);
            }
        }
    } finally {
        processingMembers.delete(newMember.id);
    }
});

client.login(token);
