// This is just for local testing

const Command = require('~/lib/structures/Command');

const { CommandOptionType } = require('slash-create');
const util = require('~/lib/util');
const constants = require('~/lib/util/constants');
const { inspect } = require('util');

/* eslint-disable-next-line no-unused-vars */
const { Routes } = require('discord-api-types/v10');

module.exports = class SetupCommand extends Command {

	constructor(creator) {
		super(creator, {
			name: 'eval',
			description: 'Runs code for testing purposes.',
			options: [
				{
					type: CommandOptionType.STRING,
					name: 'code',
					description: 'The code to execute.',
					required: true
				},
				{
					type: CommandOptionType.INTEGER,
					name: 'depth',
					description: 'How far to evaluate properties.',
					required: false
				}
			],
			guildIDs: [constants.RYDIXORD]
		});
		this.filePath = __filename;
	}

	/* eslint-disable-next-line no-unused-vars */
	async execute(ctx, { client, guild, channel, responder }) {
		let { code } = ctx.options;
		const { depth } = ctx.options;

		code = `(async () => {\n${code}\n})();`;

		let result = eval(code);

		if (util.isThenable(result)) result = await result;

		result = inspect(result, {
			depth: depth || 0
		});

		return util.codeBlock(result, 'js');
	}

	async prechecks(ctx, { client, guild, channel }) {
		if (!client.owners.includes(ctx.user.id)) throw 'You may not run the eval command';

		return super.prechecks(ctx, { client, guild, channel });
	}

};
