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
    // Load commands once globally
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
            // Clears?
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



// Gym types as a visual indicator of the gym leader type and the gym badge type in its respective index
system =        ["gymleadrer_role","gymbadge_role"]
normal =    ["1244399627709583411","1244399612446511214"]
fire =      ["1244399622600790037","1244399608529027163"]
water =     ["1244399628758286398","1244399612899627009"]
grass =     ["1244399624433700985","1244399610353680526"]
electric =  ["1244399620537192560","1244399606377349301"]
ice =       ["1244399623112626297","1244399609024090205"]
fighting =  ["1244399618855403542","1244399604577996953"]
poison =    ["1244399626250096820","1244399611825754172"]
ground =    ["1244399623657881653","1244399609405771869"]
flying =    ["1244399621812518982","1244399607853613181"]
psychic =   ["1244399625138343998","1244399611121238086"]
bug =       ["1244399616322043905","1244399602216734835"]
rock =      ["1244399630599458867","1244399614468165705"]
ghost =     ["1244399620994633919","1244399607077666958"]
dragon =    ["1244399617563689122","1244399602652942368"]
dark =      ["1244399618461139005","1244399603403587696"]
steel =     ["1244399629488095243","1244399614002593903"]
fairy =     ["1244399619631218831","1244399605467316255"]

const types = ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
const Gymleader_roles = [normal[0],fire[0],water[0],grass[0],electric[0],ice[0],fighting[0],poison[0],ground[0],flying[0],psychic[0],bug[0],rock[0],ghost[0],dragon[0],dark[0],steel[0],fairy[0]];
const Gymbadges_roles = [normal[1],fire[1],water[1],grass[1],electric[1],ice[1],fighting[1],poison[1],ground[1],flying[1],psychic[1],bug[1],rock[1],ghost[1],dragon[1],dark[1],steel[1],fairy[1]];

// if has all gym badges, then add Elite_challenger role

const Elite_challenger = "1258198493537898537";
const Elite_Victor = "1265341660028731555"
const Champion_Challenger = "1258198593634963577";
system = ["Ewins:0", "Ewins:1", "Ewins:2", "Ewins:3"]
const E_Wins = ["1270937713851240549","1270937800442777622","1270938132078002207","1270937897108766771", Elite_Victor]

 // if not has Elite_challenger role, then remove Ewins role,
 // if has E_wins[i-1] and gets e_wins[i] then remove e_wins[i-1]
 // if not has Ewins[0 through 3] and has Elite_challenger then add Ewins[0]
 // if has elite victor then add champion challenger

 function HasAllBadges(member) {    return Gymbadges_roles.every(role => member.roles.cache.has(role));}


 function handleE4_wins(member, role) {
    const roleIndex = E_Wins.indexOf(role.id);

    // Remove all other E_Wins roles except the current one
    for (let i = 0; i < E_Wins.length; i++) {
        if (i !== roleIndex) {
            member.roles.remove(E_Wins[i]);
        }
    }

    // Add the Champion_Challenger role if the member gains the Elite_Victor role (E_Wins[4])
    if (role.id === Elite_Victor) {
        member.roles.add(Champion_Challenger);
        member.roles.remove(Elite_challenger);
    } else {
        // Ensure Champion_Challenger role is removed if the member does not have Elite_Victor
        member.roles.remove(Champion_Challenger);
        // If the member has all gym badges, ensure Elite_challenger role and E_Wins[0]
        if (HasAllBadges(member)) {
            member.roles.add(Elite_challenger);
            member.roles.add(E_Wins[0]);
        }
    }
}


function handleRoles(member, role) {
    // Check if the role is part of the Gymbadges_roles array
    if (Gymbadges_roles.includes(role.id)) {
        // Check if the member has all badges
        if (HasAllBadges(member)) {
            member.roles.add(Elite_challenger);
        } else {
            member.roles.remove(Elite_challenger);
            // Remove all E_Wins roles if member does not have all badges
            E_Wins.forEach(eliteRole => member.roles.remove(eliteRole));
            return; // Exit if the user doesn't have all gym badges
        }
    }

    // If the member has the Elite_challenger role
    if (member.roles.cache.has(Elite_challenger)) {
        handleE4_wins(member, role);
    }
}

function handleRoles(member, role) {
    // Check if the role is part of the Gymbadges_roles array
    if (Gymbadges_roles.includes(role.id)) {
        // Check if the member has all badges
        if (HasAllBadges(member)) {
            member.roles.add(Elite_challenger);
        } else {
            // Remove roles if the user does not have all badges
            member.roles.remove(Elite_challenger);
            member.roles.remove(Champion_Challenger);
            E_Wins.forEach(eliteRole => member.roles.remove(eliteRole));
            return; // Exit if the user doesn't have all gym badges
        }
    }

    // If the member has the Elite_challenger role
    if (member.roles.cache.has(Elite_challenger)) {
        handleE4_wins(member, role);
    }
}

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    // Detect role changes
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

    // Handle removed roles
    if (removedRoles.size > 0) {
        removedRoles.forEach(role => {
            // Handle removal of Elite_challenger specifically
            if (role.id === Elite_challenger) {
                if (HasAllBadges(newMember)) {
                    newMember.roles.add(Elite_challenger);
                } else {
                    newMember.roles.remove(Champion_Challenger);
                    E_Wins.forEach(eliteRole => newMember.roles.remove(eliteRole));
                }
            }

            // Handle removal of Elite_Victor specifically
            if (role.id === Elite_Victor) {
                if (HasAllBadges(newMember)) {
                    newMember.roles.add(Elite_challenger);
                    // Reset to Elite Wins 0
                    newMember.roles.add(E_Wins[0]);
                    for (let i = 1; i < E_Wins.length; i++) {
                        newMember.roles.remove(E_Wins[i]);
                    }
                } else {
                    newMember.roles.remove(Champion_Challenger);
                    E_Wins.forEach(eliteRole => newMember.roles.remove(eliteRole));
                }
            }

            // Handle gym badge role removal
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

    // Handle added roles
    if (addedRoles.size > 0) {
        addedRoles.forEach(role => handleRoles(newMember, role));
    }

    // Combined check for simultaneous addition of last badge and Elite_challenger
    if (HasAllBadges(newMember) && !oldMember.roles.cache.has(Elite_challenger) && newMember.roles.cache.has(Elite_challenger)) {
        newMember.roles.add(Elite_challenger);
        newMember.roles.add(E_Wins[0]);
        for (let i = 1; i < E_Wins.length; i++) {
            newMember.roles.remove(E_Wins[i]);
        }
    }
});




client.login(token);
