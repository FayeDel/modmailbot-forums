// This class handles the lifecycle of the threads inside a forum channel and provides utility functions for it

const { Routes } = require('discord-api-types/v10');
const { ChannelType } = require('~/lib/util/constants');
const { sleep } = require('~/lib/util');

module.exports = class ForumThreadManager {

	constructor(client, forums) {
		this.client = client;
		this.forums = forums;
		this.db = client.db.collection('channels');
	}

	async create(guild, user) {
		const forum = await this.forums.get(guild);
		if (!forum) throw `This server doesn't have a forum thread set up yet.`;

		const channel = await this.client.rest10.post(`/channels/${forum}/threads`, { body: {
			type: ChannelType.GuildPublicThread,
			name: user ? `${user.username}-${user.discriminator}` : 'logs',
			location: 'Forum Channel',
			auto_archive_duration: 1440
		} });

		if (user) {
			await this.db.updateOne({ user: user.id, guild: guild.id }, { $set: { channel: channel.id } }, { upsert: true });
			await this.client.channels.fetch(channel.id);
			await this.forums.logger.created(guild, user);
		} else {
			await sleep(1);
			await this.forums.db.updateOne({ guild: guild.id }, { $set: { log: channel.id } }, { upsert: true });
			await this.client.rest10.patch(`/channels/${channel.id}`, { body: { flags: 2 } });
		}

		return channel.id;
	}

	async fetch(guild, user) {
		const channel = await this.get(guild, user);

		if (channel) return channel;
		else return this.create(guild, user);
	}

	async get(guild, user) {
		if (user) {
			const config = await this.db.findOne({ guild: guild.id, user: user.id });
			return config?.channel;
		} else {
			const config = await this.forums.db.findOne({ guild: guild.id });
			return config?.log;
		}
	}

	async user(guild, channel) {
		const config = await this.db.findOne({ guild: guild.id, channel: channel.id });

		return config?.user;
	}

	async reset(guild, user) {
		const channel = await this.get(guild, user);

		if (channel) await this.client.rest10.delete(Routes.channel(channel));

		return this.create(guild, user);
	}

};
