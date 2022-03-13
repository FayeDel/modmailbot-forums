const Command = require('~/lib/structures/Command');

const util = require('~/lib/util');

module.exports = class ThreadCommand extends Command {

	async prechecks(ctx, { client, channel, guild }) {
		const forumChannelId = await client.forums.get(guild);

		if (!forumChannelId) throw `The bot hasn't been set up yet. Try running \`/setup\`.`;

		if (!util.isThread(channel)) throw `This channel isn't a thread. Try going to <#${forumChannelId}> and selecting a thread there.`;

		if (channel.parentId !== forumChannelId) throw `This isn't the channel that has been set up for tickets. Try going to <#${forumChannelId}> or running \`/setup\`.`;

		return true;
	}

};
