// This is just for local testing

const { SlashCommand, CommandOptionType } = require('slash-create');
const util = require('~/lib/util');
const constants = require('~/lib/constants');
const { inspect } = require('util');

/* eslint-disable-next-line no-unused-vars */
const { Routes } = require('discord-api-types/v10');

module.exports = class SetupCommand extends SlashCommand {

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

	async run(ctx) {
		if (!ctx.creator.client.owners.includes(ctx.user.id)) return `You may not run the eval command`;

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

};
