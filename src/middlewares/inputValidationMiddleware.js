"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const myValidationResult = express_validator_1.validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        };
    },
});
const inputValidationMiddleware = (req, res, next) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errorsMessages: errors.array({ onlyFirstError: true }) });
        return;
    }
    next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
