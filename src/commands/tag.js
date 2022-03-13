// The idea of this is to add tags per post so they can be categorised
// and ultimately easier to find than just scrolling/referencing through logs.

const Command = require('~/lib/structures/Command');
const { CommandOptionType } = require('slash-create');

module.exports = class TagAddCommand extends Command {

	constructor(creator) {
		super(creator, {
			name: 'tag',
			description: 'Add a tag to this conversation/post.',
			options: [{
				type: CommandOptionType.STRING,
				name: 'thread_id',
				description: 'The ID of the thread/post you want to add the tag to.',
				required: true
			}, {
				type: CommandOptionType.STRING,
				name: 'suggestion',
				description: 'The tag name you want to include in.',
				required: true
			}]
		});
		this.filePath = __filename;
	}

	async execute(ctx) {
		return `Tag add command executed, with content: ${ctx.options.thread_id} :: ${ctx.options.suggestion}`;
	}

};