import { Publisher, Subjects, TicketUpdatedEvent } from "@cltickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketsUpdated = Subjects.TicketsUpdated;
}

