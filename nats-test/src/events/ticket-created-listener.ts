import {Message} from "node-nats-streaming";
import {Listener} from "./base-listener";

export class TicketCreatedListener extends Listener {
  queueGroupName = 'payments-service';
  subject = 'ticket:created';

  onMessage(data: any, msg: Message): void {
    console.log('Event data!', data);

    msg.ack(); // assuming everything is going on correctly
  }

}
