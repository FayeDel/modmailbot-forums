const Command = require('~/lib/structures/Command');
const { CommandOptionType } = require('slash-create');
const constants = require('~/lib/util/constants');

module.exports = class CloseCommand extends Command {

	constructor(creator) {
		super(creator, {
			name: 'find',
			description: 'Lists all archived threads from a user.',
			options: [{
				type: CommandOptionType.USER,
				name: 'user',
				description: 'The user whose threads to search.',
				required: true
			}],
			guildIDs: [constants.RYDIXORD]
		});
		this.filePath = __filename;
	}

	async execute(ctx, { client, guild }) {
		const userId = ctx.options.user;
		const user = await client.users.fetch(userId);

		const entries = await client.db.collection('archived').find({ guild: guild.id, user: user.id }).toArray();

		return [
			`**Threads for ${user}**`,
			'',
			...entries.map(entry => `<#${entry.channel}>`)
		].join('\n');
	}

};
