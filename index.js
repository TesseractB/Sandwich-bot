const { ShardingManager, WebhookClient, MessageEmbed } = require("discord.js");
// Inject environment variables
const dotenv = require("dotenv");
dotenv.config();
// Create a new webhook client
const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });
// Create a new sharding manager
const manager = new ShardingManager("./bot.js", {
	token: process.env.TOKEN,
    totalShards: 'auto'
});
// Send a message to the webhook when a shard is created
manager.on("shardCreate", (shard) => {
	const embed = new MessageEmbed()
		.setTitle(`Shard [${shard.id}] Launched`)
		.setColor("BLUE")
		.setTimestamp();
	webhookClient.send({ embeds: [embed] });
});

manager
	.spawn()
	.then((shards) => {
		shards.forEach((shard) => {
			shard.on("death", () => {
                // Send a message to the webhook when a shard is disconnected
				const embed = new MessageEmbed()
					.setTitle(`Shard [${shard.id}] Disconnected`)
					.setColor("RED")
					.setTimestamp();
				webhookClient.send({ embeds: [embed] });
			});
            
		});
	})
	.catch(console.error);
