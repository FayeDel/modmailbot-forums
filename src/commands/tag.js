// The idea of this is to add tags per post so they can be categorised
// and ultimately easier to find than just scrolling/referencing through logs.

const Command = require('~/lib/structures/Command');
const { CommandOptionType } = require('slash-create');
const constants = require('~/lib/util/constants');

module.exports = class TagAddCommand extends Command {

	constructor(creator) {
		super(creator, {
			name: 'tag',
			description: 'Modify tags to a forum channel/post.',
			guildIDs: [constants.RYDIXORD],
			options: [{
				type: CommandOptionType.SUB_COMMAND,
				name: 'add',
				description: 'Add a tag to a thread/forum post.',
				options: [{
					name: 'thread_id',
					description: 'The ID of the thread you want to add the tag to.',
					required: true,
					autocomplete: true,
					type: CommandOptionType.STRING
				}, {
					name: 'suggestion',
					description: 'The tag name to attach to the post.',
					required: true,
					autocomplete: true,
					type: CommandOptionType.STRING
				
				}]
			}, {
				type: CommandOptionType.SUB_COMMAND,
				name: 'remove',
				description: 'Remove a tag to a thread/forum post.',
				options: [{
					name: 'thread_id',
					description: 'The ID of the thread you want to remove the tag to.',
					required: true,
					autocomplete: true,
					type: CommandOptionType.STRING
				}]
			}]
		});
		this.filePath = __filename;
	}

	async autocomplete(ctx) {
		let option = ctx.focused; // this is a string of the current focused option

		console.log(ctx.option[option]);
		ctx.sendResults([{ name: `Your text: ${ctx.options[ctx.focused]}`, value: ctx.options[ctx.focused] }]);

		// TODO: Fix this internally, this does not seem to activate.
	}


	async execute(ctx, { client }) {

		let returnvalues = [ctx.subcommands[0]];  // This is needed to be referenced for parsing reasons.
		// aka ["add", "<thread_id>", "<suggestion>"] || ["remove", "<thread_id>", undefined]

		// We first need to determine what subcommands were used.
		switch (ctx.subcommands[0]) {
			case "add":
				switch (Object.keys(ctx.options[ctx.subcommands[0]])[0]) {
					// Find the options per /tag add
					case 'thread_id':
						returnvalues.push(ctx.options[ctx.subcommands[0]]['thread_id']);
					case 'suggestion':
						returnvalues.push(ctx.options[ctx.subcommands[0]]['suggestion']);
				}
				break;
			case "remove":
				switch (Object.keys(ctx.options[ctx.subcommands[0]])[0]) {
					// Find the options per /tag add
					case 'thread_id':
						returnvalues.push(ctx.options[ctx.subcommands[0]]['thread_id']);
						break;
				}
				break;
		}

		if (returnvalues.at(2) !== undefined) {
			// If they're not undefined, fetch the tag from the API.
		}

		// since autocomplete doesn't work (atm), the below line is commented out.
		// let thread =  await client.channels.fetch(threadId);
		// and use the above thread obj to assign/remove tags.

		return `Tag command executed. (Check console for ext. output)\nData:: /${returnvalues[0]} ${returnvalues[1]} ${returnvalues.at(2) !== undefined ? returnvalues[2] : "N/A"}`
	}

};
