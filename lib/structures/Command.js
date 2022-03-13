const { SlashCommand } = require('slash-create');

const responder = require('~/lib/Responder');

module.exports = class Command extends SlashCommand {

	async run(ctx) {
		if (!ctx.guildID) return responder.error('This command only works in servers.');

		const { client } = ctx.creator;
		const guild = client.guilds.cache.get(ctx.guildID);
		const channel = await guild.channels.fetch(ctx.channelID);
		const _member = ctx.member;
		const member = await guild.members.fetch(_member.id);

		const failed = await this.prechecks(ctx, { client, guild, channel, member })
			.then(() => false)
			.catch((error) => responder.error(error));

		if (failed) return failed;

		const res = await this.execute(ctx, { client, guild, channel, responder, member, user: member.user });

		return res;
	}

	async prechecks() {
		return true;
	}

};
