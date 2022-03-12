const Command = require('~/lib/structures/Command');

const util = require('~/lib/util');

module.exports = class ThreadCommand extends Command {

	async prechecks(ctx, { channel }) {
		const forumChannelID = await ctx.creator.client.guild(ctx.guildID).getForumChannel();
		if (!forumChannelID) throw `The bot hasn't been set up yet. Try running \`/setup\`.`;

		if (!util.isThread(channel)) throw `This channel isn't a thread. Try going to <#${forumChannelID}> and selecting a thread there.`;

		if (channel.parent_id !== forumChannelID) throw `This isn't the channel that has been set up for tickets. Try going to <#${forumChannelID}> or running \`/setup\`.`;

		return true;
	}

};
