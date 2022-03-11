// Self explanatory.

const { SlashCommand } = require("slash-create");

module.exports = class CloseCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'close',
            description: "Closes the thread and log it to the log forum channel."
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        return "Close command executed.";
    }
}