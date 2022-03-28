const { v5: uuidv5 } = require("uuid");
const Discord = require("discord.js");
module.exports = {
    data: {
        name: "openstore",
        aliases: ["os"],
        description: "Opens your store.",
        input: [{name: "storeName", required: true}],
        category: "Store",
        ownerOnly: false,
        guildOnly: false,
    },
    execute: async (message, client, args, data, db) => {
        const storeName = args.join(" ")
        // check that data exists
        // if not, add user data to the database where uid is the user id and uuid is a random uuid,
        // then assign it to data
        if (!data) {
            await db.create({
                uid: message.author.id,
                uuid: uuidv5(message.author.id, uuidv5.DNS),
                storeName: storeName,
                name: message.author.username,
            });
            data = await db.findOne({
                where: {
                    uid: message.author.id,
                },
            });
        } else {
            return message.reply("You already have a store open.");
        }
        

    },
};
