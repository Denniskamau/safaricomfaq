require('dotenv').config()

import * as express from 'express'
import * as bodyParser from 'body-parser'

import TYPES from './types'
import container from './inversify.config'
import { logger } from './util/Logger'

import { RegistrableController } from './controller/RegistrableController'
import { TwitterService } from "./services/TwitterService"

export class BotFramework {
  public express: express.Application

  constructor() {
    this.express = express()
    this.middleware()
    this.registerControllers()
  }

  private middleware(): void {
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: true }))

    this.express.use(function (request: express.Request, response: express.Response, next: express.NextFunction) {
      console.log(request.method + ' ' + request.path)
      next()
    })

    this.express.use(function (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) {
      console.log(error.stack)
      next(error)
    })

    this.express.use(function (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) {
      response.status(500).send('Internal Server Error')
    })
  }

  private registerControllers(): void {
    const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller)
    controllers.forEach(controller => controller.register(this.express))
  }
}

export class TwitterCron {
  public express: express.Application

  private twitterService: TwitterService

  constructor() {
    this.express = express()
    this.twitterService = new TwitterService()

    this.runService()
  }

  private runService(): void {
    this.twitterService.fetchAllSafaricomTweets()
  }
}
