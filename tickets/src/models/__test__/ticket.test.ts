import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: "123"
  })

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make 2 separate changes to the tickets we fetched ( one for each )
  firstInstance!.set({ price: 10});
  secondInstance!.set({ price: 15});

  // Save the first fetched ticket - expect to success
  await firstInstance!.save();

  // Save the second fetched ticket - expect to fail because of wrong version number
  try {
    await secondInstance!.save();
  } catch (err) {
    return done(); // tells jest that's it test completed
  }

  throw new Error('Should not react this point')
})

it("increments the version number on multiple save", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: "123"
  })
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1)

  await ticket.save();
  expect(ticket.version).toEqual(2)
})
