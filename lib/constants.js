const { ChannelType } = require('discord-api-types/v10');

module.exports = {
	RYDIXORD: '897162092652683314',

	ChannelType: {
		...ChannelType,
		15: 'GuildForum',
		GuildForum: 15
	}
};
