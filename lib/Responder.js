const { success, error } = require('~/lib/util/constants').emoji;

module.exports = class Responder {

	static success(text) {
		return `${success} ${text}`;
	}

	static error(text) {
		return `${error} ${text}`;
	}

};
