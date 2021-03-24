import { Listener, Subjects, TicketCreatedEvent } from "@cltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = queueGroupName

  // when a ticket is created inside Tickets Service we want
  // to also create a ticket in our Orders Service's db
  async onMessage (data: TicketCreatedEvent["data"], msg: Message) {
    const {
      id,
      title,
      price
    } = data;
    const ticket = Ticket.build({
      id,
      title,
      price
    });
    await ticket.save();

    msg.ack();
  }
}
