const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const GuildManager = require('~/lib/GuildManager');

module.exports = class ModMail {

	constructor(db, token) {
		this.db = db;
		this.rest = new REST({ version: '10' }).setToken(token);

		this.application = null;
		this.owners = [];
	}

	guild(id) {
		return new GuildManager(this, id);
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
