// This command exists so that you have to do the associated command
// to setup the bot. (This is also because of REST/HTTP not relying on the
// associated Gateway event.)

const { SlashCommand } = require('slash-create');

const { success } = require('~/lib/constants').emoji;

module.exports = class SetupCommand extends SlashCommand {

	constructor(creator) {
		super(creator, {
			name: 'setup',
			description: 'Sets up the modmail forum channels.'
		});
		this.filePath = __filename;
	}

	async run(ctx) {
		const channelID = await ctx.creator.client.guild(ctx.guildID).resetForumChannel();

		return `${success} Setup complete. Your tickets will now appear in <#${channelID}>`;
	}

};
