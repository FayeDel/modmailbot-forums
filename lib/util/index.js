const { ChannelType } = require('~/lib/util/constants');

module.exports = class Util {

	static isThenable(input) {
		if (!input) return false;
		return input instanceof Promise || (input !== Promise.prototype && Util.isFunction(input.then) && Util.isFunction(input.catch));
	}

	static isFunction(input) {
		return typeof input === 'function';
	}

	static codeBlock(input, lang) {
		return `\`\`\`${lang || ''}\n${input}\n\`\`\``;
	}

	static isThread(channel) {
		return [ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread].includes(channel.type);
	}

};
