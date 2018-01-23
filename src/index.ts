
import * as express from 'express'
import * as bodyParser from 'body-parser'
import TYPES from './types'
import container from './inversify.config'
import {logger} from './util/Logger'
import {RegistrableController} from './controller/RegistrableController'

const app: express.Application = express()

app.use(bodyParser.json())


const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller)
controllers.forEach(controller => controller.register(app))

app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.error(err.stack)
    next(err)
})

app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(500).send('Internal Server Error')
})

const port = process.env.PORT || 3000

app.listen(port, function () {
    logger.info(`Safaricom FAQ App listening on port ${port}!`)
})