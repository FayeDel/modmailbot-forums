const ThreadCommand = require('~/lib/structures/ThreadCommand');

const { success } = require('~/lib/util/constants').emoji;

module.exports = class CloseCommand extends ThreadCommand {

	constructor(creator) {
		super(creator, {
			name: 'close',
			description: 'Closes the thread and log it to the log forum channel.'
		});
		this.filePath = __filename;
	}

	async execute(ctx, { channel, guild }) {
		await guild.channels.update(channel, { archived: true });

		return `${success} This thread has been closed.`;
	}

};
