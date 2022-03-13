const { ChannelType } = require('discord-api-types/v10');

module.exports = {
	RYDIXORD: '897162092652683314',

	ChannelType: {
		...ChannelType,
		15: 'GuildForum',
		GuildForum: 15
	},

	emoji: {
		success: '<:success:952070716335984690>',
		error: '<:error:952070715388088360>',
		created: '<:plus:952074472683368468>'
	}
};
