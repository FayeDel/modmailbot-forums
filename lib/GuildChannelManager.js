const { Collection } = require('@discordjs/collection');

const { Routes } = require('discord-api-types/v10');

module.exports = class GuildChannelManager {

	constructor(client, guild) {
		this.client = client;
		this.guild = guild;
		this.cache = new Collection();
	}

	get(id) {
		return this.cache.has(id) && this.cache.get(id);
	}

	async fetch(id) {
		if (this.cache.has(id))
			return this.get(id);
		else {
			const channel = await this.client.rest.get(Routes.channel(id));

			this.set(id, channel);

			return channel;
		}
	}

	set(id, channel) {
		this.cache.set(id, channel);
	}

};