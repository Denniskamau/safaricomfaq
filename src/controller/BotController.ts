import * as express from 'express'
import * as builder from 'botbuilder'
import * as axios from 'axios'
import {injectable, inject} from 'inversify'

import TYPES from '../types'

import {RegistrableController} from './RegistrableController'
import { hostname } from 'os';

@injectable()
export class BotController implements RegistrableController {
    private connector
    private bot
    private instructions = 'Welcome to the "Safom" bot. This will answer all FAQ questions from safaricom website'
    private host = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0'
    private endpoint = '/knowledgebases/43b22a33-6cde-49de-98d8-66257bcd6356/generateAnswer'

    constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        })

        this.bot = new builder.UniversalBot(this.connector, (session) => {
            const reply = new builder.Message().address(session.message.address)

            const text = session.message.text

            const _name = 'Name:'
            const _email = 'Email:'
            const _phoneNumber = 'Phone Number:'

            let name
            let email
            let phoneNumber

            if(text.indexOf('Name:') > -1 && text.indexOf('Email:') > -1 && text.indexOf('Phone Number:') > -1) {
                name = text.substring((text.lastIndexOf('Name:') + _name.length + 1), (text.indexOf('Email:') - 1)).replace(/\'/g,'')  
                email = text.substring((text.lastIndexOf('Email:') + _email.length + 1), (text.indexOf('Phone Number:') - 1)).replace(/\'/g,'')         
                phoneNumber = text.substring((text.lastIndexOf('Phone Number:') + _phoneNumber.length + 1)).replace(/\'/g,'')
                
                reply.text(`Welcome ${name} - ${phoneNumber}. What inquiry do you have today? Respond with /Q:Some question here`)

                session.send(reply)
            } else if(text.indexOf('/Q:') > -1) {
                const question = text.substring((text.lastIndexOf('/Q:') + 3))

                const response = this.getResponse(question)

                reply.text(`${response}. Are you satisfied with the answer?`)

                session.send(reply)
            } else {
                reply.text(`You said: ${text}. I didn't quite get that`)

                session.send(reply)
            }
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
                        let reply
                        
                        reply= new builder.Message()
                            .address(activity.address)
                            .text(_instructions)
                        _bot.send(reply)
                        
                        reply= new builder.Message()
                            .address(activity.address)
                            .text('Please enter your name, email address and mobile number in this format:\n\nName:\'John Doe\',\n\nEmail:\'john.doe@noone.com\',\n\nPhone Number:\'0722000000\'')
                        _bot.send(reply)
                    }
                })
            }
        })
    }

    private async getResponse(question: string): Promise<string> {
        const authOptions = {
            method: 'POST',
            url: `${this.host}${this.endpoint}`,
            data: question,
            headers: {
              'Content-Type': 'multipart/form-data',
              'Ocp-Apim-Subscription-Key': '31366e4aba0d45818c2e8d4cb04b6909',
            }
          }
      
          const reply = await axios(authOptions)
          console.log(reply)

          return reply
    }
}