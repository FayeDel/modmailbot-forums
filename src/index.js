require('dotenv').config();

// This rewrites require calls so it's easier to reference files. ../../lib/util becomes ~/lib/util
require('@aero/require').config(process.cwd(), false);

// Custom client impl
const ModMail = require('~/lib/ModMail');

// Message handler
const handleMessage = require('./message');

// Database; we use MongoDB because it requires almost no effort
const { MongoClient } = require('mongodb');
const mc = new MongoClient(process.env.MONGO_URI);

const { Intents } = require('discord.js');
const { GatewayServer, SlashCreator } = require('slash-create');

// Fancy logging
const CatLoggr = require('cat-loggr');
const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');

const { join } = require('path');

async function main() {
	await mc.connect();

	const client = new ModMail(mc.db(process.env.MONGO_DB), process.env.DISCORD_BOT_TOKEN, {
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.DIRECT_MESSAGES,
			Intents.FLAGS.GUILD_MEMBERS
		],
		partials: [
			'CHANNEL'
		],
		allowedMentions: {
			parse: []
		}
	});

	client.on('messageCreate', handleMessage);

	await client.login(process.env.DISCORD_BOT_TOKEN);

	const owners = await client.fetchOwners();
	logger.info(`Registered owners [${owners.join(', ')}]`);

	const creator = new SlashCreator({
		applicationID: process.env.DISCORD_APP_ID,
		publicKey: process.env.DISCORD_PUBLIC_KEY,
		token: process.env.DISCORD_BOT_TOKEN,
		client
	});

	creator.on('synced', () => logger.info('Commands synced!'));
	creator.on('commandRun', (command, _, ctx) => logger.info(`${ctx.user.username} (${ctx.user.id}) ran command ${command.commandName}`));
	creator.on('commandRegister', (command) => logger.info(`Registered command ${command.commandName}`));
	creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

	creator.withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)))
		.registerCommandsIn(join(__dirname, 'commands'))
		.syncCommands();

	return creator;
}

main().then((creator) => {
	logger.info(`Logged in as ${creator.client.user.tag}.`);
});
