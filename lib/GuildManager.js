const { Routes } = require('discord-api-types/v10');
const { ChannelType } = require('~/lib/constants');

module.exports = class GuildManager {

	constructor(client, id) {
		this.client = client;
		this.db = client.db.collection('guilds');
		this.id = id;
	}

	async createForumChannel() {
		const channel = await this.client.rest.post(Routes.guildChannels(this.id), { body: {
			type: ChannelType.GuildForum,
			name: 'tickets'
		} });

		await this.db.updateOne({ id: this.id }, { $set: { channel: channel.id } }, { upsert: true });

		return channel.id;
	}

	async fetchForumChannel() {
		const channel = await this.getForumChannel();

		if (channel) return channel;
		else return this.createForumChannel();
	}

	async getForumChannel() {
		const config = await this.db.findOne({ id: this.id });

		return config?.channel;
	}

};
