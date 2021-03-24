import { Listener, Subjects, TicketUpdatedEvent } from "@cltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  // when Tickets Service emits and updated ticket event we also want to
  // reflect that change in our Tickets Collection inside the Orders Service
  async onMessage (data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });

    // because of the plugin, on save it will increment the version
    await ticket.save();

    msg.ack();
  }
}
