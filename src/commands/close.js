const { SlashCommand } = require('slash-create');
const util = require('~/lib/util');

module.exports = class CloseCommand extends SlashCommand {

	constructor(creator) {
		super(creator, {
			name: 'close',
			description: 'Closes the thread and log it to the log forum channel.'
		});
		this.filePath = __filename;
	}

	async run(ctx) {
		const channel = await ctx.creator.client.guild(ctx.guildID).channel(ctx.channelID);
		if (util.isThread(channel)) return `isThread`;

		return 'is not thread';
	}

};
