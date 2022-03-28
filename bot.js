const Discord = require("discord.js");
const fs = require("node:fs");
const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MEMBERS,

	],
});
const Sequelize = require("sequelize");
const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	// SQLite only
	storage: "database.sqlite",
});

const db = sequelize.define("userData", {
    uid: {
        type: Sequelize.BIGINT,
    },
    uuid: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    money: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
    },
	storeName: {
		type: Sequelize.STRING,
	},
	xp: {
		type: Sequelize.BIGINT,
		defaultValue: 0,
	},
	sandwiches: {
		type: Sequelize.BIGINT,
		defaultValue: 0,
	},
	sandwichMultiplier: {
		type: Sequelize.BIGINT,
		defaultValue: 1,
	},
	sandwichTimeout: {
		type: Sequelize.DATE,
	},
	upgrade_qualityIngredients: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
});
db.sync({ alter: true });

client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


//Load event files
const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) =>
			event.execute(...args, client, db)
		);
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, db));
	}
}

client.login(process.env.DISCORD_TOKEN);
