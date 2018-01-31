import * as express from 'express'
import * as builder from 'botbuilder'
import axios from 'axios'
import { injectable, inject } from 'inversify'

import TYPES from '../types'

import { RegistrableController } from './RegistrableController'
import { hostname } from 'os'

@injectable()
export class BotController implements RegistrableController {
	private connector
	private bot
	private instructions = 'Welcome to the *Safom* bot. This will answer all FAQ questions from safaricom website'
	private host = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0'
	private path = `/knowledgebases/${process.env.QNA_SERVICE_ID}/generateAnswer`

	constructor() {
		this.connector = new builder.ChatConnector({
			appId: process.env.MICROSOFT_APP_ID,
			appPassword: process.env.MICROSOFT_APP_PASSWORD
		})

		this.bot = new builder.UniversalBot(this.connector)

		this.setupBot()
	}

	public register(app: express.Application): void {
		app.route('/api/messages')
			.post(this.connector.listen())
	}

	private async setupBot(): Promise<void> {
		const _bot = this.bot
		const _instructions = this.instructions

		this.bot.on('conversationUpdate', (activity) => {
			if (activity.membersAdded) {
				activity.membersAdded.forEach(function (identity) {
					if (identity.id === activity.address.bot.id) {
						let reply

						reply = new builder.Message()
							.address(activity.address)
							.text(_instructions)
						_bot.send(reply)

						reply = new builder.Message()
							.address(activity.address)
							.text('Are you a *Safom* customer')
						_bot.send(reply)
					}
				})
			}
		})

		this.bot.dialog('/', [
			(session) => {
				builder.Prompts.text(session, 'What is your name')
			},
			(session, result, next) => {
				session.userData.name = result.response
				next()
			},
			(session) => {
				builder.Prompts.text(session, `${session.userData.name}, what is your phone number?`)
			},
			(session, result, next) => {
				session.userData.phoneNumber = result.response
				session.replaceDialog('faqQuestions')
			},
		])

		this.bot.dialog('faqQuestions', [
			(session, args) => {
				if (args && args.reprompt)
					builder.Prompts.text(session, 'What other inquiries do you have?')
				else
					builder.Prompts.text(session, 'What inquiry do you have?')
			},
			async (session, result, next) => {
				const userQueryResponse = await this.getResponse(result.response)

				session.send(`${userQueryResponse}`)
				next()
			},
			(session) => {
				builder.Prompts.text(session, `Any other question that you have for us ${session.userData.name}`)
			},
			(session, result) => {
				if (result.response === 'yes') {
					const args = {
						reprompt: true
					}
					session.replaceDialog('faqQuestions', args)
				} else {
					session.endDialog(`Thanks ${session.userData.name}, we hope we have been able to be of service.`)
				}
			}
		])
	}

	private async getResponse(question: string): Promise<string> {
		var options = {
			url: `${this.host}${this.path}`,
			method: 'POST',
			headers: {
				'Ocp-Apim-Subscription-Key': `${process.env.QNA_SUBSCRIPTION_ID}`,
				'Content-Type': 'application/json'
			},
			data: {
				question
			}
		}
		console.log(options)

		try {
			const { data } = await axios(options)

			if (data.answers.length > 0) {
				return data.answers[0].answer
			}

			return 'I cannot understand what you are saying'
		} catch (error) {
			console.log(error.response.data)

			return 'Oops!! An error occured.'
		}
	}
}