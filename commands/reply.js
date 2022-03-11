// Self explanatory.

const { SlashCommand, CommandOptionType } = require("slash-create");

module.exports = class ReplyCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'reply',
            description: "Reply to the conversation.",
            options: [{
                type: CommandOptionType.STRING,
                name: "message",
                description: "The message to send to the other person.",
                required: True
            }]
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        return `Reply command executed, with content: ${ctx.options.message}`;
    }
}