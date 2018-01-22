const builder = require('botbuilder')

const connector = new builder.ConsoleConnector().listen()
const bot = new builder.UniversalBot(connector, function (session) {
	session.send('You said: %s', session.message.text)
})