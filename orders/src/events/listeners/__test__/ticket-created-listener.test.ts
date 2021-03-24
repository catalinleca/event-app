import mongoose from "mongoose";
// the fake one from __mocks__ will be imported in test env
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { TicketCreatedEvent } from "@cltickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create the instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message object
  // ack will be a jest mock in order to keep track of it
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {
    listener,
    data,
    msg
  };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage fct with data obj + message obj
  await listener.onMessage(data, msg);

  // expect ticket created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage fct with data obj + message obj
  await listener.onMessage(data, msg);

  // expect ack is called
  expect(msg.ack).toHaveBeenCalled();
});
