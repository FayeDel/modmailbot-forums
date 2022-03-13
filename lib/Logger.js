// This class handles logging what happens to tickets

const { success, created } = require('~/lib/util/constants').emoji;
const { timestamp } = require('~/lib/util');

module.exports = class Logger {

	constructor(client) {
		this.client = client;
		this.db = client.db.collection('guilds');
	}

	async init(guild) {
		const forum = await this.client.forums.get(guild);
		if (!forum) throw `This server doesn't have a forum thread set up yet.`;

		await this.client.forums.threads.create(guild);

		return this.initial(guild);
	}

	async get(guild) {
		const config = await this.db.findOne({ guild: guild.id });

		if (!config?.log)
			return false;

		const channel = await this.client.channels.fetch(config.log);

		return channel;
	}

	async created(guild, user) {
		const channel = await this.get(guild);
		if (!channel) throw `This server doesn't have a forum thread set up yet.`;
		const threadId = await this.client.forums.threads.get(guild, user);
		const thread = await this.client.channels.fetch(threadId);

		const { role } = await this.client.forums.db.findOne({ guild: guild.id });

		await channel.send(`${created} ticket opened by **${user}** [${user.id}] on ${timestamp()}`);
		await thread.send(`<@&${role}> **${user}** [${user.id}] opened this ticket on ${timestamp()}`, { allowedMentions: { parse: ['roles'], roles: [role] } });
	}

	async closed(guild, user, moderator) {
		const channel = await this.get(guild);
		if (!channel) throw `This server doesn't have a forum thread set up yet.`;

		return channel.send(`${success} ticket for **${user}** [${user.id}] closed by ${moderator} [${moderator.id}] on ${timestamp()}`);
	}

	async initial(guild) {
		const channel = await this.get(guild);
		if (!channel) throw `This server doesn't have a forum thread set up yet.`;

		await channel.send('This channel serves as a log for all interactions with tickets.');
	}

};
