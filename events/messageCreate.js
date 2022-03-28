// discord.js v13 messageCreate event
const Discord = require("discord.js");


module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {Sequelize.Model} db
     * 
     */
    execute: async (message, client, db) => {
        // find the user in the database
        // if they do not exist, do nothing
        // if they do exist, assign their data to data
        const data = await db.findOne({
            where: {
                uid: message.author.id,
            },
        });

        if (message.author.bot) return;
        //get prefix from env variables
        const prefix = process.env.PREFIX;
        //check if message starts with prefix
        if (!message.content.startsWith(prefix)) return;
        //get command name
        const commandName = message.content.slice(prefix.length).split(" ")[0].toLowerCase();
        //get args from message
        const args = message.content.slice(prefix.length).split(" ").slice(1);
        //get command from collection
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.data.aliases && cmd.data.aliases.includes(commandName));
        //if command doesn't exist, return
        if (!command) return;
        //if command is only for owner, check if user is owner
        if (command.data.ownerOnly && message.author.id !== process.env.OWNER_ID) {
            return;
        }
        //if command is only for guild, check if user is in a guild
        if (command.data.guildOnly && !message.guild) {
            return;
        }

        if (args.length < command.data.input.map((i) => i.required).filter((i) => i).length) {
            return message.reply({
                content: `Please provide the correct number of arguments.\n${command.data.input.map(input => `**${input.name}**: ${input.required ? "Required" : "Optional"}`).join("\n")}`,
                ephemeral: true,
            });
        }

        // execute command with client, args, and data
        try {
            await command.execute(message, client, args, data, db);
        } catch (error) {
            console.error(error);
            try {
                await message.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } catch {
                await message.editReply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    }
};