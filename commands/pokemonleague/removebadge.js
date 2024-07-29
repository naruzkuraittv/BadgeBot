const { SlashCommandBuilder } = require('discord.js');

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

const Elite_challenger = "1258198493537898537";
const Champion_Challenger = "1258198593634963577";

function HasAllBadges(member) {
    return Gymbadges_roles.every(role => member.roles.cache.has(role));
}

function HasAnyBadge(member) {
    return Gymbadges_roles.some(role => member.roles.cache.has(role));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removebadge')
        .setDescription('Remove the badge from a user')
        .addUserOption(option => option.setName('target').setDescription('The user to remove the badge from').setRequired(true)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = await interaction.guild.members.fetch(target.id);
        
        let indexofgymrole = -1;
        const command_enabled = true;
        if (command_enabled == true) {  
            let hasGymLeaderRole = Gymleader_roles.some((role, index) => {
                if (interaction.member.roles.cache.has(role)) {
                    indexofgymrole = index;
                    return true;
                }
                return false;
            });

            if (!hasGymLeaderRole) {
                await interaction.reply('You do not have the permission to remove badges.');
                return;
            }

            if (indexofgymrole !== -1) {
                if (member.roles.cache.has(Gymbadges_roles[indexofgymrole])) {
                    await member.roles.remove(Gymbadges_roles[indexofgymrole]);
                    if (!HasAllBadges(member) && member.roles.cache.has(Elite_challenger)) {
                        await member.roles.remove(Elite_challenger);
                        await interaction.reply('The badge has been removed, and the user is no longer an Elite Challenger.');
                    } else {
                        await interaction.reply('The badge has been removed.');
                    }
                } else {
                    await interaction.reply('The user does not have this badge.');
                }
            } else {
                await interaction.reply('An error occurred while removing the badge.');
            }
        }
        else {await interaction.reply('This command is disabled');}
    },
};
