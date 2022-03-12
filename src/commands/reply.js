const ThreadCommand = require('~/lib/structures/ThreadCommand');

const { CommandOptionType } = require('slash-create');

module.exports = class ReplyCommand extends ThreadCommand {

	constructor(creator) {
		super(creator, {
			name: 'reply',
			description: 'Reply to the conversation.',
			options: [{
				type: CommandOptionType.STRING,
				name: 'message',
				description: 'The message to send to the other person.',
				required: true
			}]
		});
		this.filePath = __filename;
	}

	async execute(ctx) {
		return `Reply command executed, with content: ${ctx.options.message}`;
	}

};
