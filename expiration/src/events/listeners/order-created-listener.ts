import { Listener, OrderCreatedEvent, Subjects } from "@cltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage (data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    // this executes right away the expirationQueue.process inside expiration-queue.ts file
    // basically the job is sent here and received there without any delay
    await expirationQueue.add({
      orderId: data.id
    }, {
      delay
    });

    msg.ack();
  }
}
