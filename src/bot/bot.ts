import * as builder from 'botbuilder'
import * as axios from 'axios'

export default class Bot {
  public connector: builder.ChatConnector;
  private bot: builder.UniversalBot;

  constructor() {
    this.connector = new builder.ChatConnector({
      appId: process.env.MICROSOFT_APP_ID,
      appPassword: process.env.MICROSOFT_APP_PASSWORD
    })
  }

  public init() : void {
    this.bot = new builder.UniversalBot(this.connector)
  }
}