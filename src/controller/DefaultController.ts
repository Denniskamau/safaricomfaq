import * as express from 'express'
import {injectable, inject} from 'inversify'

import TYPES from '../types'

import {RegistrableController} from './RegistrableController'

@injectable()
export class DefaultController implements RegistrableController {
    constructor() {}

    public register(app: express.Application): void {
        app.route('/')
            .get(async(request: express.Request, response: express.Response, next: express.NextFunction) => {

              response.json('OK')
            })
    }
}