const Discord = require('discord.js');
module.exports = {
    data: {
        name: "ping",
        aliases: [],
        description: "Gets the ping of the bot.",
        input: [],
        category: "Utility",
        ownerOnly: false,
        guildOnly: false,
    },
    execute: async (message, client, args, data) => {
        const embed = new Discord.MessageEmbed()
            .setTitle("Pong!")
            .setColor("GREEN")
            .setTimestamp()
            .addField("Latency", `${client.ws.ping}ms`);
        message.reply({embeds: [embed]});
    }
}