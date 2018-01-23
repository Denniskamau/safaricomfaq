import * as express from 'express'
import * as builder from 'botbuilder'

class App {
  public express
  private connector

  constructor () {
    this.express = express()
    this.mountRoutes()

    this.connector = new builder.ChatConnector({
      appId: process.env.MICROSOFT_APP_ID,
      appPassword: process.env.MICROSOFT_APP_PASSWORD
    })
  }

  private mountRoutes (): void {
    const router = express.Router()
    
    router.get('/', (request, response) => {
      response.json({
        message: 'pong'
      })
    })
    
    router.get('api/messages', (request, response) => {
      response.json({
        message: 'pong'
      })
    })
    
    this.express.use('/', router)
  }
}

export default new App().express