const Discord = require("discord.js");
const { getLevel, getMultiplier } = require("../Utils.js");
const ms = require("ms");
module.exports = {
    data: {
        name: "make",
        aliases: ["m"],
        description: "Make a sandwhich (or two.. or a thousand).",
        input: [],
        category: "Store",
        ownerOnly: false,
        guildOnly: false,
    },
    execute: async (message, client, args, data, db) => {
        

        // return if the user doesn't have a store
        if (!data) {
            return message.reply("You don't have a store, make one with `openstore`.");
        }
        var originalData = data;
        // return if the user's sandwichTimeout has not been reached yet
        if (data.sandwichTimeout > Date.now()) {
            return message.reply(`You can't make a sanwich yet. You have to wait ${ms(ms(Math.ceil((data.sandwichTimeout - Date.now()) / 1000) + " seconds"), {long: true})}`);
        }

        // create a new sandwichTimeout for 15 minutes in the future in the db
        await db.update({
            sandwichTimeout: Date.now() + 15 * 60 * 1000,
        }, {
            where: {
                uuid: data.uuid,
            },
        });

        
        // give the user an xp value ranging from 40 to 60 in the db
        var xp = Math.floor(Math.random() * 20) + 40;


        //add the xp to the user's xp value in the data
        data.xp += xp;

        // multiply 1 sandwhich by the user's level and sandwich multiplier
        var sandwich = getMultiplier(data) + 1;

        //add the sandwich to data
        data.sandwiches += sandwich;

        //update data to reflect money increase
        data.money += sandwich * 5;

        // send the user a message with their sandwich value and xp
        const embed = new Discord.MessageEmbed()
            .setTitle("Sandwich!")
            .setColor("GREEN")
            .setTimestamp()
            .setDescription(`You made a sandwich! You now have ${data.sandwiches} sandwiches.\n\`+$${sandwich * 5}\`\n\`+${xp} xp\`\n\`+${sandwich} sandwiches\``)
            .addField("\u200B", "\u200B")
            .addField("💵 Money", `${data.money}`, true)
            .addField("🪙 Experience", `${data.xp} (Level ${getLevel(data.xp)})`, true);

        message.reply({ embeds: [embed] });

        // update the database with the new data
        Promise.all([
            db.update(
                {
                    money: originalData.money + sandwich * 5,
                },
                {
                    where: {
                        uuid: data.uuid,
                    },
                }
            ),
            db.update(
                {
                    sandwiches: originalData.sandwiches + sandwich,
                },
                {
                    where: {
                        uuid: data.uuid,
                    },
                }
            ),
            db.update(
                {
                    xp: originalData.xp + xp,
                },
                {
                    where: {
                        uuid: data.uuid,
                    },
                }
            ),
        ]);
    },
};
