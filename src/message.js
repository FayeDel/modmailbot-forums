const { RYDIXORD } = require('~/lib/util/constants');

module.exports = async function handleMessage(msg) {
	if (msg.author.bot) return false;

	if (msg.channel.type === 'DM') return handleDMs(msg);

	if (!msg.guild) return false;

	const forum = await msg.client.forums.get(msg.guild);
	if (!forum) return false;
	if (msg.channel.parentId !== forum) return false;

	return handleGuild(msg);
};

async function handleDMs(msg) {
	const guild = await msg.client.guilds.fetch(RYDIXORD);
	const threadId = await msg.client.forums.threads.fetch(guild, msg.author);
	const thread = await msg.client.channels.fetch(threadId);

	thread.send(`**${msg.author.username}:** ${msg.content}`);

	console.log(`DM: ${msg.content}`);
}

async function handleGuild(msg) {
	console.log(`Thread: ${msg.content}`);

	const userId = await msg.client.forums.threads.user(msg.guild, msg.channel);
	if (!userId) return;

	const user = await msg.client.users.fetch(userId);

	user.send(`**Moderator (${msg.author.username}):** ${msg.content}`);
}