const ThreadCommand = require('~/lib/structures/ThreadCommand');
const { CommandOptionType } = require('slash-create');

module.exports = class CloseCommand extends ThreadCommand {

	constructor(creator) {
		super(creator, {
			name: 'reply',
			description: 'Sends a message to the user in the current thread.',
			options: [{
				type: CommandOptionType.STRING,
				name: 'message',
				description: 'The message to send to the user.',
				required: true
			}],
			guildIDs: [process.env.DISCORD_GUILD_ID]
		});
		this.filePath = __filename;
	}

	async execute(ctx, { user: author, channel, client, guild }) {
		const userId = await client.forums.threads.user(guild, channel);
		const user = await client.users.fetch(userId);

		const message = `**Moderator (${author.username}):** ${ctx.options.message}`;

		await user.send(message);

		return message;
	}

};
