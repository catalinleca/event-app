import { OrderCancelledEvent, Publisher, Subjects } from "@cltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
