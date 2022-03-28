const Discord = require("discord.js");
module.exports = {
    data: {
        name: "upgrade",
        aliases: ["upgrades"],
        description: "Upgrade your store.",
        input: [{ name: "upgrade", required: false }],
        category: "Store",
        ownerOnly: false,
        guildOnly: true,
    },
    execute: async (message, client, args, data, db) => {
        if (!data) {
            return message.reply("You don't have a store, make one with `openstore`.");
        }

        var possilbeUpgrades = [
            {
                name: "Quality Ingredients",
                code: "qualityIngredients",
                description: "Increase the quality of your ingredients",
                initialCost: 100,
                costCurve: 1.5,
                maxLevel: 10,
                currentLevel: data.upgrade_qualityIngredients,
            },
        ];
        // if there are no args, list the upgrades, price, and current level
        if (!args[0]) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Upgrades")
                .setColor("GREEN")
                .setTimestamp()
                .setFooter({
                    text: `You can use upgrade <upgrade> to upgrade your store. | 💵 ${data.money}`,
                })
                .setDescription(`Here are the upgrades you can purchase.\n\n`);
            possilbeUpgrades.forEach((upgrade) => {
                embed.addField(
                    `${upgrade.name} (${upgrade.currentLevel}/${upgrade.maxLevel})`,
                    `${upgrade.description} - $${
                        upgrade.initialCost * Math.pow(upgrade.costCurve, upgrade.currentLevel)
                    }\n\`s!upgrade ${upgrade.code}\``
                );
            });
            return message.channel.send({ embeds: [embed] });
        }

        //return if the upgrade doesnt exist
        var upgrade = possilbeUpgrades.find(
            (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
        );
        if (!upgrade) {
            return message.reply("That upgrade doesn't exist.");
        }

        // if the user has enough money, upgrade the upgrade specified in args[0]
        if (
            data.money >=
            possilbeUpgrades.find((upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase())
                .initialCost *
                Math.pow(
                    possilbeUpgrades.find(
                        (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
                    ).costCurve,
                    possilbeUpgrades.find(
                        (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
                    ).currentLevel
                )
        ) {
            await db.update(
                {
                    money:
                        data.money -
                        possilbeUpgrades.find(
                            (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
                        ).initialCost *
                            Math.pow(
                                possilbeUpgrades.find(
                                    (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
                                ).costCurve,
                                possilbeUpgrades.find(
                                    (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
                                ).currentLevel
                            ),
                    upgrade_qualityIngredients:
                        possilbeUpgrades.find(
                            (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
                        ).currentLevel + 1,
                },
                {
                    where: {
                        uuid: data.uuid,
                    },
                }
            );
            return message.reply(
                `You upgraded your ${args[0]} to level ${
                    possilbeUpgrades.find(
                        (upgrade) => upgrade.code.toLowerCase() == args[0].toLowerCase()
                    ).currentLevel + 1
                }!`
            );
        } else {
            return message.reply("You don't have enough money to upgrade that.");
        }
    },
};
