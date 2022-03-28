const Discord = require("discord.js");
const Utils = require("../Utils.js");
module.exports = {
    data: {
        name: "store",
        aliases: ["s"],
        description: "Gets infor about your store.",
        input: [],
        category: "Store",
        ownerOnly: false,
        guildOnly: false,
    },
    execute: async (message, client, args, data) => {
        if (!data) {
            return message.reply("You don't have a store.");
        }
        var createdDate = new Date(data.createdAt);
        const embed = new Discord.MessageEmbed()
            .setTitle(`${data.storeName}`)
            .setColor("GREEN")
            .setTimestamp()
            .addField("Owner", `${data.name}`, true)
            .addField("💵 Money", `${data.money}`, true)
            .addField("🪙 Experience", `${data.xp} (Level ${Utils.getLevel(data.exp)})`, true)
            .addField('\u200B', '\u200B')
            .addField("📅 Created", `<t:${Math.floor(createdDate.getTime()/1000)}>`, false);
        message.reply({embeds: [embed]});
    }
};
