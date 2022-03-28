const Discord = require("discord.js");
module.exports = {
    data: {
        name: "help",
        aliases: [],
        description: "Gets the help message of the bot.",
        input: [{name: "command", required: false}],
        category: "Utility",
        ownerOnly: false,
        guildOnly: false,
    },
    execute: async (message, client, args, data) => {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Help")
                .setColor("GOLD")
                .setTimestamp();
            const commands = client.commands.map((c) => c);
            const categories = [];
            for (const command of commands) {
                if (!categories.includes(command.data.category)) {
                    categories.push(command.data.category);
                }
            }
            for (const category of categories) {
                if (category === "Bot Management") {
                    continue;
                }
                const commandsInCategory = commands.filter((c) => c.data.category === category);
                const fields = [];
                for (const command of commandsInCategory) {
                    fields.push(`\`${command.data.name}\``);
                }
                embed.addField(`${category}`, `${fields.join(", ")}`, true);
            }
            message.reply({ embeds: [embed] });
        } else {
            const command = client.commands.get(args[0]) || client.commands.find((c) => c.data.aliases.includes(args[0]));
            if (!command) {
                return message.reply({
                    content: "That command does not exist!",
                    ephemeral: true,
                });
            }
            if (command.data.input[0]) {
                var inputs = command.data.input.map((i) => {
                    if (i.required) {
                        return `<${i.name}>`;
                    } else {
                        return `[${i.name}]`;
                    }
                });
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`Help for ${command.data.name}`)
                .setColor("GOLD")
                .setTimestamp()
                .addField("Description", `*${command.data.description}*`, false)
                .addField(
                    "Aliases",
                    `\`${command.data.aliases[0] ? command.data.aliases.join(", ") : "None"}\``,
                    true
                )
                .addField("Category", `__${command.data.category}__`, true)
                .addField("Guild Only", `*${command.data.guildOnly}*`, true)
                .addField(
                    "Inputs",
                    `\`${command.data.input[0] ? inputs.join(", ") : "None"}\``,
                    true
                )
                .setFooter({ text: "<> = Required, [] = Optional" });
            message.reply({ embeds: [embed] });
        }
    },
};
