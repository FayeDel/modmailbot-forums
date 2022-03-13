// This is a custom client implementation that gets managers and utility classes added

const { Client, Team } = require('discord.js');
const { REST } = require('@discordjs/rest');

const ForumManager = require('~/lib/ForumManager');

module.exports = class ModMail extends Client {

	constructor(db, token, opts = {}) {
		super(opts);
		this.db = db;
		this.rest10 = new REST({ version: '10' }).setToken(token);
		this.owners = [];

		this.forums = new ForumManager(this);
	}

	async fetchOwners() {
		await this.application.fetch();
		const { owner } = this.application;

		if (owner instanceof Team)
			this.owners = owner.members.map(member => member.user.id);
		else
			this.owners = [owner.id];

		return this.owners;
	}

};
