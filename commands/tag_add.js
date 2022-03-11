// The idea of this is to add tags per post so they can be categorised
// and ultimately easier to find than just scrolling/referencing through logs.

const { SlashCommand, CommandOptionType } = require("slash-create");

module.exports = class TagAddCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'tag_add',
            description: "Add a tag to this conversation/post.",
            options: [{
                type: CommandOptionType.STRING,
                name: "thread_id",
                description: "The ID of the thread/post you want to add the tag to.",
                required: true
            }, {
                type: CommandOptionType.STRING,
                name: "suggestion",
                description: "The tag name you want to include in.",
                required: true
            }]
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        return `Tag add command executed, with content: ${ctx.options.thread_id} :: ${ctx.options.suggestion}`;
    }
}