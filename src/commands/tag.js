// The idea of this is to add tags per post so they can be categorised
// and ultimately easier to find than just scrolling/referencing through logs.

const ThreadCommand = require('~/lib/structures/ThreadCommand');
const { CommandOptionType } = require('slash-create');
const constants = require('~/lib/util/constants');

module.exports = class TagAddCommand extends ThreadCommand {

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
					name: 'tag',
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
					name: 'tag',
					description: 'The tag name to remove from the post.',
					required: true,
					autocomplete: true,
					type: CommandOptionType.STRING
				}]
			}]
		});
		this.filePath = __filename;
	}

	async autocomplete(ctx) {
		const { client } = ctx.creator;

		if (!ctx.guildID) return [];

		const guild = client.guilds.cache.get(ctx.guildID);
		const tags = await client.forums.fetchTags(guild);

		const input = ctx.options[ctx.subcommands[0]][ctx.focused].toLowerCase();

		let filteredTags = input?.length ? tags.filter(tag => tag.name.toLowerCase().startsWith(input)) : tags;
		if (!filteredTags.length) filteredTags = tags;

		ctx.sendResults(filteredTags.map(tag => ({ name: `${tag.emoji_name ? `${tag.emoji_name} ` : ''}${tag.name}`, value: tag.id })));
	}


	async execute(ctx, { channel, responder, guild, client }) {
		const action = ctx.subcommands[0];
		const tag = ctx.options[action]['tag'];
	
		let { applied_tags } = await client.rest10.get(`/channels/${channel.id}`);
		if (!applied_tags) applied_tags = [];
		const available_tags = await client.forums.fetchTags(guild);

		switch(action) {
			case 'add':
				if (applied_tags.includes(tag)) return responder.error('This tag is already applied to the channel');
				client.rest10.patch(`/channels/${channel.id}`, { body: { applied_tags: [...applied_tags, tag] } });
				break;
			case 'remove':
				if (!applied_tags.includes(tag)) return responder.error('This tag does not exist on this channel');
				client.rest10.patch(`/channels/${channel.id}`, { body: { applied_tags: applied_tags.filter(t => t !== tag) } });
				break;
		}

		return responder.success(`${action === 'add' ? 'Tagged' : 'Untagged'} ${channel} with **${available_tags.find(t => t.id === tag).name}**.`);
	}

};
