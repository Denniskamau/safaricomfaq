import { Container } from 'inversify'
import "reflect-metadata"

import TYPES from './types'

import { RegistrableController } from './controller/RegistrableController'
import { DefaultController } from './controller/DefaultController'
import { BotController } from './controller/BotController'

const container = new Container()

container.bind<RegistrableController>(TYPES.Controller).to(DefaultController)
container.bind<RegistrableController>(TYPES.Controller).to(BotController)

export default container