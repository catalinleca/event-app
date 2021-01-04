import {NextFunction, Request, Response} from "express";
import {NotAuthorizedError} from "../errors/not-authorized-error";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    // Assume current user is always ran before this one
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
}
