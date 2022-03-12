const { Routes } = require('discord-api-types/v10');
const { ChannelType } = require('~/lib/constants');

module.exports = class GuildManager {

	constructor(client, id) {
		this.client = client;
		this.db = client.db.collection('guilds');
		this.id = id;
	}

	async createForumChannel() {
		const channel = await this.rest.post(Routes.guildChannels(this.id), { body: {
			type: ChannelType.GuildForum,
			name: 'Tickets'
		} });
		console.log(channel);

		await this.db.updateOne({ id: this.id }, { channel: channel.id }, { upsert: true });
	}

	async fetchForumChannel() {
		const config = await this.db.findOne({ id: this.id });

		if (!config || !config.channel) return this.createForumChannel();

		return config.channel;
	}

};
