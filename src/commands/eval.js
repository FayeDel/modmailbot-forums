// This is just for local testing

const { SlashCommand, CommandOptionType } = require('slash-create');
const util = require('~/lib/util');

module.exports = class SetupCommand extends SlashCommand {

	constructor(creator) {
		super(creator, {
			name: 'eval',
			description: 'Runs code for testing purposes.',
			options: [{
				type: CommandOptionType.STRING,
				name: 'code',
				description: 'The code to execute.',
				required: true
			}]
		});
		this.filePath = __filename;
	}

	async run(ctx) {
		let { code } = ctx.options;
		code = `(async () => {\n${code}\n})();`;

		let result = eval(code);

		if (util.isThenable(result)) result = await result;

		return ctx.reply(util.codeBlock(result, 'js'));
	}

};
