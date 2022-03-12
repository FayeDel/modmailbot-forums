const { SlashCommand } = require('slash-create');
const util = require('~/lib/util');

const { success, error } = require('~/lib/constants').emoji;

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
		if (!util.isThread(channel)) return `${error} This channel isn't a thread. Try going to <#${forumChannelID}> and selecting a thread there.`;

		const forumChannelID = await ctx.creator.client.guild(ctx.guildID).getForumChannel();
		if (!forumChannelID) return `${error} The bot hasn't been set up yet. Try running \`/setup\`.`;

		if (channel.parent_id !== forumChannelID) return `${error} This isn't the channel that has been set up for tickets. Try going to <#${forumChannelID}> or running \`/setup\`.`;

		return success;
	}

};
