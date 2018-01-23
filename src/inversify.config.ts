import {Container} from 'inversify'
import "reflect-metadata"

import TYPES from './types'

import { RegistrableController } from './controller/RegistrableController'
import { DefaultController } from './controller/DefaultController'

const container = new Container()

container.bind<RegistrableController>(TYPES.Controller).to(DefaultController)

export default container