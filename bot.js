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
const Champions = "1247247172127297616";
system = ["Ewins:0", "Ewins:1", "Ewins:2", "Ewins:3"];
const E_Wins = ["1270937713851240549","1270937800442777622","1270938132078002207","1270937897108766771", Elite_Victor];

function HasAllBadges(member) {
    return Gymbadges_roles.every(role => member.roles.cache.has(role));
}
function whatrolesdotheyhave(member, roles) {
    return roles.some(role => member.roles.cache.has(role));
}
function handlerolesold(member, role, gainorloose)
    {
    //does the member have all the badges
    // if not has Elite_challenger role, then remove future roles
    if (!HasAllBadges(member)) {
        member.roles.remove(Elite_challenger);
        member.roles.remove(E_Wins[0]);
        member.roles.remove(E_Wins[1]);
        member.roles.remove(E_Wins[2]);
        member.roles.remove(E_Wins[3]);
        member.roles.remove(Elite_Victor);
        member.roles.remove(Champion_Challenger);

    }
    //if has all the badges
    if (HasAllBadges(member)) 
        {
        let rolesToCheck = [Elite_challenger, E_Wins[0], E_Wins[1], E_Wins[2], E_Wins[3], Elite_Victor, Champion_Challenger, Champions];

        //check if they have the Elite_challenger role, any of the Ewins roles, or the Elite_Victor role
        
        //if has Elite_challenger role, then add Ewins[0]
        whatrolesdotheyhave(member, rolesToCheck);
        if (!member.roles.cache.has(Elite_challenger || Elite_Victor || Champion_Challenger || Champions)) 
            {
                member.roles.add(Elite_challenger);
                if (!member.roles.cache.has(E_Wins[0]||E_Wins[1]||E_Wins[2]||E_Wins[3]||Elite_Victor)) 
                    {
                        member.roles.add(E_Wins[0]);
                    }
            }
            whatrolesdotheyhave(member, rolesToCheck);
            if (member.roles.cache.has(Elite_challenger)) 
                { // they should have it it was just given or they already had it
                // if has elite victor, then add champion challenger remove ewins
                    if (member.roles.cache.has(Elite_Victor)) // they might
                        {
                            member.roles.remove(E_Wins[3]);
                            member.roles.remove(E_Wins[2]);
                            member.roles.remove(E_Wins[1]);
                            member.roles.remove(E_Wins[0]);

                            member.roles.add(Champion_Challenger);

                        }
                    if (!member.roles.cache.has(Elite_Victor)) // should remove all roles above Elite_victor if they have them
                            {
                            whatrolesdotheyhave(member, rolesToCheck);

                            if (memberr.roles.cache.has(E_Wins[0]||E_Wins[1]||E_Wins[2]||E_Wins[3])) 
                                {
                                    if (member.roles.cache.has(E_Wins[3])) 
                                        {
                                            member.roles.remove(Champion_Challenger);
                                            member.roles.remove(E_Wins[2]);
                                            member.roles.remove(E_Wins[2]);
                                            member.roles.remove(E_Wins[1]);
                                            member.roles.remove(E_Wins[0]);
                                        }
                                    whatrolesdotheyhave(member, rolesToCheck);
                                    if (member.roles.cache.has(E_Wins[2])) 
                                        {
                                            member.roles.remove(E_Wins[3]);
                                            member.roles.remove(E_Wins[1]);
                                            member.roles.remove(E_Wins[0]);
                                        }
                                    whatrolesdotheyhave(member, rolesToCheck);
                                    if (member.roles.cache.has(E_Wins[1])) 
                                        {
                                            member.roles.remove(E_Wins[3]);
                                            member.roles.remove(E_Wins[2]);
                                            member.roles.remove(E_Wins[0]);
                                        }
                                    whatrolesdotheyhave(member, rolesToCheck);
                                    if (member.roles.cache.has(E_Wins[0])) 
                                        {
                                            member.roles.remove(E_Wins[3]);
                                            member.roles.remove(E_Wins[2]);
                                            member.roles.remove(E_Wins[1]);
                                        }
                                    console.log("has elite challenger and and Ewins but not Elite Victor, all things are as they should be");
                                }

                        }
                }
            
            
                if (member.roles.cache.has(Elite_Victor)) // they might
                {
                    member.roles.remove(E_Wins[3]);
                    member.roles.remove(E_Wins[2]);
                    member.roles.remove(E_Wins[1]);
                    member.roles.remove(E_Wins[0]);

                    member.roles.add(Champion_Challenger);

                }
            if (!member.roles.cache.has(Elite_Victor)) // should remove all roles above Elite_victor if they have them
                    {
                    whatrolesdotheyhave(member, rolesToCheck);

                    if (memberr.roles.cache.has(E_Wins[0]||E_Wins[1]||E_Wins[2]||E_Wins[3])) 
                        {
                            if (member.roles.cache.has(E_Wins[3])) 
                                {
                                    member.roles.remove(Champion_Challenger);
                                    member.roles.remove(E_Wins[2]);
                                    member.roles.remove(E_Wins[2]);
                                    member.roles.remove(E_Wins[1]);
                                    member.roles.remove(E_Wins[0]);
                                }
                            whatrolesdotheyhave(member, rolesToCheck);
                            if (member.roles.cache.has(E_Wins[2])) 
                                {
                                    member.roles.remove(E_Wins[3]);
                                    member.roles.remove(E_Wins[1]);
                                    member.roles.remove(E_Wins[0]);
                                }
                            whatrolesdotheyhave(member, rolesToCheck);
                            if (member.roles.cache.has(E_Wins[1])) 
                                {
                                    member.roles.remove(E_Wins[3]);
                                    member.roles.remove(E_Wins[2]);
                                    member.roles.remove(E_Wins[0]);
                                }
                            whatrolesdotheyhave(member, rolesToCheck);
                            if (member.roles.cache.has(E_Wins[0])) 
                                {
                                    member.roles.remove(E_Wins[3]);
                                    member.roles.remove(E_Wins[2]);
                                    member.roles.remove(E_Wins[1]);
                                }
                            console.log("has elite challenger and and Ewins but not Elite Victor, all things are as they should be");
                        }

                }
        }
        if (!HasAllBadges(member)) 
            {
                member.roles.remove(Elite_challenger);
                member.roles.remove(E_Wins[0]);
                member.roles.remove(E_Wins[1]);
                member.roles.remove(E_Wins[2]);
                member.roles.remove(E_Wins[3]);
                member.roles.remove(Elite_Victor);
                member.roles.remove(Champion_Challenger);
                member.roles.remove(Champions);
    
            }
    }

function handleRoles(member) {
    const hasAll = hasAllBadges(member);
    const rolesToCheck = [Elite_challenger, ...E_Wins, Champion_Challenger, Champions];

    if (hasAll) {
        if (!member.roles.cache.has(Elite_challenger) && !rolesToCheck.some(role => member.roles.cache.has(role))) {
            member.roles.add(Elite_challenger);
            member.roles.add(E_Wins[0]);
        } else if (member.roles.cache.has(Elite_Victor)) {
            member.roles.remove(E_Wins);
            member.roles.add(Champion_Challenger);
        }
    } else {
        member.roles.remove([Elite_challenger, ...E_Wins, Elite_Victor, Champion_Challenger, Champions]);
    }
}

function handleRoles3(member) { // 100 % broken
    const Elite_challenger = "1258198493537898537";
    const Elite_Victor = "1265341660028731555";
    const Champion_Challenger = "1258198593634963577";
    const Champions = "1247247172127297616";
    const E_Wins = ["1270937713851240549", "1270937800442777622", "1270938132078002207", "1270937897108766771", Elite_Victor];

    function HasAllBadges(member) {
        return Gymbadges_roles.every(role => member.roles.cache.has(role));
    }

    if (!HasAllBadges(member)) {
        member.roles.remove([Elite_challenger, ...E_Wins, Elite_Victor, Champion_Challenger, Champions]);
        return;
    }

    if (HasAllBadges(member)) {
        if (!member.roles.cache.has(Elite_challenger)) {
            member.roles.add(Elite_challenger);
            member.roles.add(E_Wins[0]);
            return;
        }

        let ewinIndex = E_Wins.findIndex(role => member.roles.cache.has(role));

        if (ewinIndex === -1) {
            member.roles.add(E_Wins[0]);
        } else if (ewinIndex < E_Wins.length - 2) {
            member.roles.remove(E_Wins.slice(0, ewinIndex + 1));
            member.roles.add(E_Wins[ewinIndex + 1]);
        }

        if (member.roles.cache.has(Elite_Victor)) {
            member.roles.remove(E_Wins.slice(0, E_Wins.length - 1));
            member.roles.add(Champion_Challenger);
        }

        if (member.roles.cache.has(Champion_Challenger)) {
            member.roles.remove([Elite_challenger, ...E_Wins.slice(0, E_Wins.length - 1), Elite_Victor]);
        }
    }
}






client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if (processingMembers.has(newMember.id)) return;
    processingMembers.add(newMember.id);

    const gainedRole = newMember.roles.cache.find(role => !oldMember.roles.cache.has(role.id));
    if (gainedRole) {
        handleRoles(newMember);
    }

    processingMembers.delete(newMember.id);
});

client.login(token);
