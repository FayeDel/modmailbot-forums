const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { Collection } = require('@discordjs/collection');

const GuildManager = require('~/lib/GuildManager');

module.exports = class ModMail {

	constructor(db, token) {
		this.db = db;
		this.rest = new REST({ version: '10' }).setToken(token);

		this.application = null;
		this.owners = [];

		this.guilds = new Collection();
	}

	guild(id) {
		if (this.guilds.has(id)) return this.guilds.get(id);
		else {
			const guild = new GuildManager(this, id);
			this.guilds.set(id, guild);
			return guild;
		}
	}

	async fetchApplication() {
		if (this.application) return this.application;

		const app = await this.rest.get(Routes.oauth2CurrentApplication());

		this.application = app;

		return app;
	}

	async fetchOwners() {
		const app = await this.fetchApplication();

		let owners = [];

		if (app.team)
			owners = app.team.members.map(member => member.user.id);
		else
			owners = [app.owner.id];

		this.owners = owners;

		return owners;
	}

};
