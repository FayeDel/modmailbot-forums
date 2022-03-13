const ThreadCommand = require('~/lib/structures/ThreadCommand');
const { sleep } = require('~/lib/util');

module.exports = class CloseCommand extends ThreadCommand {

	constructor(creator) {
		super(creator, {
			name: 'close',
			description: 'Closes the thread and log it to the log forum channel.'
		});
		this.filePath = __filename;
	}

	async execute(ctx, { user: author, channel, responder, client, guild }) {
		await ctx.send(responder.success(`This thread has been closed by ${author} and will be deleted in a couple seconds.`));

		const userId = await client.forums.threads.user(guild, channel);
		const user = await client.users.fetch(userId);
		await client.forums.logger.closed(guild, user, author);

		await sleep(5);

		await channel.delete();
	}

};
