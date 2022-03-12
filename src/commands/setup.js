// This command exists so that you have to do the associated command
// to setup the bot. (This is also because of REST/HTTP not relying on the
// associated Gateway event.)

const { SlashCommand } = require('slash-create');

module.exports = class SetupCommand extends SlashCommand {

	constructor(creator) {
		super(creator, {
			name: 'setup',
			description: 'Sets up the modmail forum channels.'
		});
		this.filePath = __filename;
	}

	async run(ctx) {
		return 'Setup command executed.';
	}

};
