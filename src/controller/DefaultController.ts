import * as express from 'express'
import {injectable, inject} from 'inversify'
import * as builder from 'botbuilder'

import TYPES from '../types'

import {RegistrableController} from './RegistrableController'

@injectable()
export class DefaultController implements RegistrableController {
    private connector
    constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        })
    }

    public register(app: express.Application): void {
        app.route('/')
            .get(async(request: express.Request, response: express.Response, next: express.NextFunction) => {

              response.json('OK')
            })

        app.post('/api/messages')
    }
}