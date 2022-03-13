const Command = require('~/lib/structures/Command');
const { CommandOptionType } = require('slash-create');

const { success } = require('~/lib/util/constants').emoji;

module.exports = class SetupCommand extends Command {

	constructor(creator) {
		super(creator, {
			name: 'setup',
			description: 'Sets up the modmail forum channels.',
			options: [
				{
					type: CommandOptionType.ROLE,
					name: 'role',
					description: 'A role that gets pinged whenever a ticket gets created. Will create one if not given.',
					required: false
				}
			]
		});
		this.filePath = __filename;
	}

	async execute(ctx, { client, guild }) {
		const { role: roleId } = ctx.options;
		let role;

		if (!roleId) role = await guild.roles.create({ name: 'ModMail Moderators' });

		const channelID = await client.forums.reset(guild);
		await client.forums.logger.init(guild);

		await client.forums.db.updateOne({ guild: guild.id }, { $set: { role: roleId || role.id } });

		return `${success} Setup complete. Your tickets will now appear in <#${channelID}>`;
	}

};
