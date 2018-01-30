"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const axios_1 = require("axios");
const inversify_1 = require("inversify");
let BotController = class BotController {
    constructor() {
        this.instructions = 'Welcome to the *Safom* bot. This will answer all FAQ questions from safaricom website';
        this.host = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0';
        this.path = `/knowledgebases/${process.env.QNA_SERVICE_ID}/generateAnswer`;
        this.connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        });
        this.bot = new builder.UniversalBot(this.connector);
        this.setupBot();
    }
    register(app) {
        app.route('/api/messages')
            .post(this.connector.listen());
    }
    setupBot() {
        return __awaiter(this, void 0, void 0, function* () {
            const _bot = this.bot;
            const _instructions = this.instructions;
            this.bot.on('conversationUpdate', (activity) => {
                if (activity.membersAdded) {
                    activity.membersAdded.forEach(function (identity) {
                        if (identity.id === activity.address.bot.id) {
                            let reply;
                            reply = new builder.Message()
                                .address(activity.address)
                                .text(_instructions);
                            _bot.send(reply);
                            reply = new builder.Message()
                                .address(activity.address)
                                .text('Are you a *Safom* customer');
                            _bot.send(reply);
                        }
                    });
                }
            });
            this.bot.dialog('/', [
                (session) => {
                    builder.Prompts.text(session, 'What is your name');
                },
                (session, result, next) => {
                    session.userData.name = result.response;
                    next();
                },
                (session) => {
                    builder.Prompts.text(session, `${session.userData.name}, what is your phone number?`);
                },
                (session, result, next) => {
                    session.userData.phoneNumber = result.response;
                    session.replaceDialog('faqQuestions');
                },
            ]);
            this.bot.dialog('faqQuestions', [
                (session, args) => {
                    if (args && args.reprompt)
                        builder.Prompts.text(session, 'What other inquiries do you have?');
                    else
                        builder.Prompts.text(session, 'What inquiry do you have?');
                },
                (session, result, next) => __awaiter(this, void 0, void 0, function* () {
                    const userQueryResponse = yield this.getResponse(result.response);
                    session.send(`${userQueryResponse}`);
                    next();
                }),
                (session) => {
                    builder.Prompts.confirm(session, `Any other question that you have for us ${session.userData.name}`);
                },
                (session, result) => {
                    if (result.response === 'yes') {
                        const args = {
                            reprompt: true
                        };
                        session.replaceDialog('faqQuestions', args);
                    }
                    else {
                        session.endDialog(`Thanks ${session.userData.name}, we hope we have been able to be of service.`);
                    }
                }
            ]);
        });
    }
    getResponse(question) {
        return __awaiter(this, void 0, void 0, function* () {
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
            };
            try {
                const { data } = yield axios_1.default(options);
                if (data.answers.length > 0) {
                    return data.answers[0].answer;
                }
                return 'I cannot understand what you are saying';
            }
            catch (error) {
                console.log(error.response.data);
                return 'Oops!! An error occured.';
            }
        });
    }
};
BotController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], BotController);
exports.BotController = BotController;
