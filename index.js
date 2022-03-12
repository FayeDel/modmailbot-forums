require('dotenv').config();

const { ExpressServer, SlashCreator } = require('slash-create');
// const { RestClient } = require("@discordjs/rest");

// logger instance because its better to distinguish than pure console.log()
const CatLoggr = require('cat-loggr');
const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');

const path = require('path');

const creator = new SlashCreator({
	applicationID: process.env.DISCORD_APP_ID,
	publicKey: process.env.DISCORD_PUBLIC_KEY,
	token: process.env.DISCORD_BOT_TOKEN,
	serverPort: 5050
});

creator.on('debug', (message) => logger.log(message));
creator.on('warn', (message) => logger.warn(message));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) =>
	logger.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`));
creator.on('commandRegister', (command) =>
	logger.info(`Registered command ${command.commandName}`));
creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

/*
 * The slash command client object will listen on port 5050.
 * For local development, ExpressServer's fine.
 * If this were to scale, you may need to use something else that `slash-create` supports.
 */

creator.withServer(new ExpressServer())
	.registerCommandsIn(path.join(__dirname, 'commands'))
	.syncCommands()
	.startServer();

console.log(`Starting server at "localhost:${creator.options.serverPort}/interactions"`);
