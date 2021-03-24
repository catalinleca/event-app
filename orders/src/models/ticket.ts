import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@cltickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id: any;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved (): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build (attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // If we create an entry with "id" prop, mongo will ignore it
  // and also insert "_id" so we just want to override that one
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
};

// No arrow function!!!
ticketSchema.method("isReserved", async function () {
  // this === the ticket document that it's being called on
  const existingOrder = await Order.findOne({
    // @ts-ignore
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
});

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
