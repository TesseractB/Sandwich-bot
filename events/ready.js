const { WebhookClient, MessageEmbed } = require("discord.js");
const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });
module.exports = {
	name: "ready",
	once: true,
	execute: async (client, db) => {
		const embed = new MessageEmbed()
			.setTitle(`Shard [${client.shard.ids}] Online`)
			.setColor("GREEN")
			.setTimestamp();
		webhookClient.send({ embeds: [embed] });
	}
};
