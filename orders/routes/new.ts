import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@cltickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {Order} from "../models/orders";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
  const {ticketId} = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // ticket should not be associated to an order that is not 'cancelled'
  const existingOrder = await ticket.isReserved();
  if (existingOrder) {
    throw new BadRequestError('Ticket already reserved!');
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })
  await order.save();

  res.status(201).send(order)
})

export {router as newOrderRouter};
