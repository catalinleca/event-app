import {OrderStatus} from "@cltickets/common";
import request from "supertest";
import {app} from "../../src/app";
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/orders";

it('marks and order as cancelled', async () => {
  // create a ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save();

  const user = global.signin();
  // make a req to create an order
  const { body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

  // make a req to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(204)

  // expect the thing to be cancelled
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo('emits an order cancelled event')
