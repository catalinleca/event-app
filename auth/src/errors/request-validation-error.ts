import {ValidationError} from 'express-validator' // express-validator error type
import {CustomError} from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid Request Params'); // only for logging

        /** Only because we are extending a build in class */
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => ({
            message: err.msg,
            field: err.param
        }))
    }
}

/**
 * General error model
 {
    errors: {
        message: string, field?: string
    }[]
 }
 */
