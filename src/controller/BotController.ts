import * as express from 'express'
import * as builder from 'botbuilder'
import {injectable, inject} from 'inversify'

import TYPES from '../types'

import {RegistrableController} from './RegistrableController'

@injectable()
export class BotController implements RegistrableController {
    private connector
    private bot
    private instructions = 'Welcome to the Bot to showcase the DirectLine API. Send text to echo it.';

    constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        })

        this.bot = new builder.UniversalBot(this.connector, (session) => {
            const reply = new builder.Message().address(session.message.address)

            reply.text(`You said: ${session.message.text}`)

            session.send(reply)
        })

        this.setupBot()
    }

    public register(app: express.Application): void {
        app.route('/api/messages')
            .post(this.connector.listen())
    }

    private setupBot(): void {
        const _bot = this.bot
        const _instructions = this.instructions
        
        this.bot.on('conversationUpdate',(activity) => {
            if (activity.membersAdded) {
                activity.membersAdded.forEach(function (identity) {
                    if (identity.id === activity.address.bot.id) {
                        var reply = new builder.Message()
                            .address(activity.address)
                            .text(_instructions)
                        _bot.send(reply);
                    }
                });
            }
        })
    }
}