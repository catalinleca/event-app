import { Listener, OrderCreatedEvent, Subjects } from "@cltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  // Tickets service needs to watch for created orders in order to
  // reserve a ticket
  async onMessage (data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // no ticket -> throw err
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as reserved by setting its orderId prop
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // don't forget that if it fails we don't want toa ack
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title.toString(),
      price: ticket.price,
      userId: ticket.userId,
      orderId : ticket.orderId
    });

    // Ack the message
    msg.ack();
  }
}
