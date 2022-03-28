const Discord = require("discord.js");
module.exports = {
    data: {
        name: "killshard",
        aliases: [],
        description: "Kills a shard.",
        input: [{name: "shardId", required: true}],
        category: "Bot Management",
        ownerOnly: true,
        guildOnly: false,
    },
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.Client} client 
     * @param {*} args 
     * @param {*} data 
     * @returns 
     */
    execute: async (message, client, args, data) => {
        if (!args[0]) {
            return message.reply({
                content: "Please specify a shard id.",
                ephemeral: true,
            });
        }
        if (isNaN(args[0])) {
            return message.reply({
                content: "Please specify a valid shard id.",
                ephemeral: true,
            });
        }
        const shardId = parseInt(args[0]);
        if (shardId > client.shard.count) {
            return message.reply({
                content: "That shard id is too high.",
                ephemeral: true,
            });
        }
        if (shardId < 0) {
            return message.reply({
                content: "Please specify a valid shard id.",
                ephemeral: true,
            });
        }
        client.shard.broadcastEval(killShard, {context: {shardId: shardId}});
    }
};

function killShard(c, {shardId}) {
    if (c.shard.ids === shardId) {
        process.exit()
    }
}
