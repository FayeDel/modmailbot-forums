const ThreadCommand = require('~/lib/structures/ThreadCommand');
const { sleep } = require('~/lib/util');

module.exports = class CloseCommand extends ThreadCommand {

	constructor(creator) {
		super(creator, {
			name: 'close',
			description: 'Closes the thread and logs the action.'
		});
		this.filePath = __filename;
	}

	async execute(ctx, { user: author, channel, responder, client, guild }) {
		await ctx.send(responder.success(`This thread has been closed by ${author}.`));

		const userId = await client.forums.threads.user(guild, channel);
		const user = await client.users.fetch(userId);
		await channel.setName(`${user.id}-${Math.floor(new Date().getTime() / 1000)}`);
		await client.forums.logger.closed(guild, user, author);
		await client.forums.threads.db.deleteOne({ guild: guild.id, channel: channel.id });
		await client.db.collection('archived').insertOne({ guild: guild.id, channel: channel.id, user: user.id });

		await sleep(5);

		await this.client.rest10.patch(`/channels/${channel.id}`, { body: { archived: true } });
	}

};
