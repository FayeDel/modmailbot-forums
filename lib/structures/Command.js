const { SlashCommand } = require('slash-create');

const responder = require('~/lib/Responder');

module.exports = class Command extends SlashCommand {

	async run(ctx) {
		if (!ctx.guildID) return responder.error('This command only works in servers.');

		const { client } = ctx.creator;
		const guild = client.guild(ctx.guildID);
		const channel = await guild.channel(ctx.channelID);

		const failed = await this.prechecks(ctx, { client, guild, channel })
			.then(() => false)
			.catch((error) => responder.error(error));

		if (failed) return failed;

		const res = await this.execute(ctx, { client, guild, channel, responder });

		return res;
	}

	async prechecks() {
		return true;
	}

};
