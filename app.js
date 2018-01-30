"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const types_1 = require("./types");
const inversify_config_1 = require("./inversify.config");
const Logger_1 = require("./util/Logger");
const app = express();
app.use(bodyParser.json());
const controllers = inversify_config_1.default.getAll(types_1.default.Controller);
controllers.forEach(controller => controller.register(app));
app.use(function (err, req, res, next) {
    Logger_1.logger.error(err.stack);
    next(err);
});
app.use(function (err, req, res, next) {
    res.status(500).send('Internal Server Error');
});
const port = process.env.PORT || 3000;
app.listen(port, function () {
    Logger_1.logger.info(`Safaricom FAQ App listening on port ${port}!`);
});
