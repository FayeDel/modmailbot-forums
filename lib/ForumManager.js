const { Routes } = require('discord-api-types/v10');
const { ChannelType } = require('~/lib/util/constants');
const ForumThreadManager = require('~/lib/ForumThreadManager');
const Logger = require('~/lib/Logger');

module.exports = class ForumManager {

	constructor(client) {
		this.client = client;
		this.db = client.db.collection('guilds');
		this.threads = new ForumThreadManager(client, this);
		this.logger = new Logger(client);
	}

	async create(guild) {
		const channel = await this.client.rest10.post(Routes.guildChannels(guild.id), { body: {
			type: ChannelType.GuildForum,
			name: 'tickets'
		} });

		await this.db.updateOne({ guild: guild.id }, { $set: { channel: channel.id } }, { upsert: true });

		return channel.id;
	}

	async fetch(guild) {
		const channel = await this.get(guild);

		if (channel) return channel;
		else return this.create(guild);
	}

	async get(guild) {
		const config = await this.db.findOne({ guild: guild.id });

		return config?.channel;
	}

	async reset(guild) {
		const channel = await this.get(guild);

		if (channel) await this.client.rest10.delete(Routes.channel(channel));

		return this.create(guild);
	}

};
