const { ChannelType } = require('~/lib/util/constants');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

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
		return [ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD', 'GUILD_NEWS_THREAD'].includes(channel.type);
	}

	static timestamp() {
		return `<t:${Math.round(new Date().getTime() / 1000)}:f>`;
	}

	static sleep(duration) {
		return sleep(duration * 1000);
	}

};
