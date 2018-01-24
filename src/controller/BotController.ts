import * as express from 'express'
import * as builder from 'botbuilder'
import {injectable, inject} from 'inversify'

import TYPES from '../types'

import {RegistrableController} from './RegistrableController'

@injectable()
export class BotController implements RegistrableController {
    private connector
    constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        })
    }

    public register(app: express.Application): void {
        app.route('/api/messages')
            .post(this.connector.listen())
    }
}