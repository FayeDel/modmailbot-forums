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

		await channel.send(`${created} ticket opened by **${user}** [${user.id}] on ${timestamp()}`);
		await user.send(`${success} Your message has been forwarded to the moderators of **${guild.name}**. Please be patient - we'll be with you soon.`);
	}

	async closed(guild, user, moderator) {
		const channel = await this.get(guild);
		if (!channel) throw `This server doesn't have a forum thread set up yet.`;
		const threadId = await this.client.forums.threads.get(guild, user);

		await channel.send(`${success} ticket for **${user}** [${user.id}] closed by ${moderator} [${moderator.id}] on ${timestamp()}. It will be archived at <#${threadId}>`);
		await user.send([
			`Thank you for using ModMail! We hope that your question has been answered!`,
			`This thread has been closed to keep our system clean. Your issue hasn't been answered or you have more questions? Don't hesitate to send a new message!`
		].join('\n'));
	}

};
