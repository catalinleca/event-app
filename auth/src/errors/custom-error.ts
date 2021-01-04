export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        /** this is basically calling new Error(message), just for logging purpose! */
        super(message);

        /** Only because it s extending a base class */
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): {
        message: string,
        field?: string
    }[]
}
